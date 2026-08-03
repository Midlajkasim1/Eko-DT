"""
FIN Connector Backend — FastAPI Server
Template-based: all project-specific values come from config.json.
Exposes REST API for the React frontend to consume.
Also serves the compiled viewer app from the 'static/' directory.
"""

import asyncio
import json
import os
import re
from contextlib import asynccontextmanager
from datetime import datetime
from typing import Optional
from urllib.parse import quote

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, PlainTextResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

from fin_client import FinScramClient, safe_get

# ─── Load Config ─────────────────────────────────────────────────────────────

CONFIG_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "config.json")

with open(CONFIG_PATH, "r") as f:
    CONFIG = json.load(f)

PROJECT_NAME = CONFIG["project_name"]
FIN_SERVER_URL = CONFIG.get("fin_server_url", "https://localhost")

# ─── Global State ────────────────────────────────────────────────────────────

client: Optional[FinScramClient] = None
polling_tasks: list[asyncio.Task] = []

# Cached data (updated by background polling)
cached_equip_data: dict = {}
cached_power_data: dict = {}
cached_building_data: dict = {}
cached_sensor_avg: dict = {"temp": None, "humidity": None, "co2": None}
cached_power_history: dict = {}
cached_fdd_summary: list = []
cached_meter_data: dict = {}
cached_alarm_data: dict = {}
cached_facility: dict = {}


# ─── Background Polling ─────────────────────────────────────────────────────

async def realtime_loop():
    """Fetch equipment, alarms, histories, and derived summaries."""
    global cached_equip_data, cached_building_data, cached_power_history
    global cached_fdd_summary, cached_meter_data, cached_alarm_data, cached_facility

    rt_endpoints = CONFIG.get("realtime_endpoints", {})
    pw_endpoints = CONFIG.get("power_endpoints", {})
    interval = CONFIG.get("polling", {}).get("realtime_ms", 30000) / 1000

    while client and client.is_authenticated:
        try:
            realtime = await client.fetch_realtime_data(rt_endpoints)
            cached_equip_data = {
                "timestamp": datetime.now().isoformat(),
                "equipment": _flatten_equip(realtime),
            }
            _compute_sensor_averages(realtime)
            cached_fdd_summary = _build_fdd_summary(realtime)
            cached_meter_data = _extract_meters(realtime, CONFIG.get("meter_profile", {}))
            cached_alarm_data = _flatten_alarms(client.last_alarm_rows, CONFIG.get("severity_bands", {}))
            cached_facility = _compute_facility_services(realtime)
            cached_power_history = await client.fetch_power_histories(pw_endpoints)
            cached_building_data = {
                "status": "success",
                "Building_Info": {
                    "timestamp": datetime.now().isoformat(),
                    "Equipments": realtime,
                    "buildingPowerUsageHistory": cached_power_history,
                    "facilityServices": cached_facility,
                },
            }
            await asyncio.sleep(interval)
        except Exception as e:
            print(f"[FIN] realtime loop error: {e}")
            await asyncio.sleep(10)


async def live_loop():
    """Poll configured live points; failed reads stay null, never a fake 0."""
    global cached_power_data

    live_ids = CONFIG.get("live_point_ids", {})
    interval = CONFIG.get("polling", {}).get("live_ms", 5000) / 1000

    while client and client.is_authenticated:
        try:
            values = await asyncio.gather(
                *(client.fetch_live_point(pid) for pid in live_ids.values()),
                return_exceptions=True,
            )
            live_results = {
                key: None if isinstance(val, Exception) else val
                for key, val in zip(live_ids, values)
            }
            cached_power_data = {
                "timestamp": datetime.now().isoformat(),
                **live_results,
                "carbon_emission": live_results.get("carbon"),
                "avg_temp": cached_sensor_avg.get("temp"),
                "avg_hum": cached_sensor_avg.get("humidity"),
                "avg_co2": cached_sensor_avg.get("co2"),
                "unit": "kWh",
                "power_history": cached_power_history,
                "fdd": cached_fdd_summary,
                "facilityServices": cached_facility,
            }
            await asyncio.sleep(interval)
        except Exception as e:
            print(f"[FIN] live loop error: {e}")
            await asyncio.sleep(interval)


def _build_fdd_summary(realtime: dict) -> list[dict]:
    summary = []
    for floor_name, floor_data in realtime.items():
        for eq in floor_data.get("hvac", []):
            rules = {
                str(pt.get("navName")): str(pt.get("currentValue", "N/A"))
                for pt in eq.get("points", [])
                if str(pt.get("navName") or "").upper().startswith("RULE_")
            }
            if rules:
                summary.append({
                    "equip": eq.get("name", "Unknown"),
                    "floor": floor_name,
                    "alarms": len(eq.get("alarms", [])),
                    "rules": rules,
                })
    return summary


def _extract_meters(realtime: dict, profile: dict) -> dict:
    prefix = str(profile.get("prefix", "")).upper()
    point_map = profile.get("point_map", {})
    if not prefix or not point_map:
        return {}

    meters: dict = {}
    for floor_data in realtime.values():
        for eq in floor_data.get("hvac", []):
            name = str(eq.get("name", ""))
            if not name.upper().startswith(prefix):
                continue
            metrics: dict = {key: None for key in point_map}
            for pt in eq.get("points", []):
                nav = str(pt.get("navName", "")).lower().replace("-", " ").replace("_", " ")
                best_key, best_len = None, -1
                for key, aliases in point_map.items():
                    for alias in aliases:
                        if alias in nav and len(alias) > best_len:
                            best_key, best_len = key, len(alias)
                if not best_key:
                    continue
                match = re.search(r"-?\d+(?:\.\d+)?", str(pt.get("currentValue", "")))
                if match:
                    metrics[best_key] = float(match.group())
            meters[name] = metrics
    return meters


def _flatten_alarms(rows: list, bands: dict) -> dict:
    critical_max = bands.get("critical", 250)
    warning_max = bands.get("warning", 400)
    alarms = []
    counts = {"critical": 0, "warning": 0, "info": 0}

    for row in rows or []:
        if row.get("alarm") is not True or row.get("active") is not True:
            continue
        priority = row.get("priority") if isinstance(row.get("priority"), (int, float)) else None
        if priority is not None and priority <= critical_max:
            severity = "critical"
        elif priority is not None and priority <= warning_max:
            severity = "warning"
        else:
            severity = "info"
        counts[severity] += 1
        source = row.get("sourceRef")
        alarms.append({
            "source": safe_get(source, "dis") or safe_get(source, "val") or "",
            "message": row.get("message", ""),
            "priority": priority,
            "severity": severity,
            "occurred": row.get("occurred") or row.get("created"),
            "state": row.get("state"),
        })

    alarms.sort(key=lambda a: str(a.get("occurred") or ""), reverse=True)
    return {
        "timestamp": datetime.now().isoformat(),
        "alarms": alarms,
        "counts": {**counts, "total": sum(counts.values())},
    }


def _flatten_equip(realtime: dict) -> list[dict]:
    """Flatten floor-wise equipment into a single list for the frontend."""
    equip_list = []
    for floor_name, floor_data in realtime.items():
        for category, items in floor_data.items():
            if not isinstance(items, list):
                continue
            for eq in items:
                eq_name = eq.get("name", "")
                if any(x in eq_name.upper() for x in ["ENERGY", "USAGE", "CALC"]):
                    continue
                alarms = eq.get("alarms", [])
                equip_list.append({
                    "name": eq_name,
                    "floor": floor_name,
                    "category": category,
                    "inAlarm": len(alarms) > 0,
                    "alarms": alarms,
                    "bimId": eq.get("bimId", ""),
                    "points": eq.get("points", []),
                })
    return equip_list


def _compute_sensor_averages(realtime: dict):
    """Compute building-wide sensor averages from equipment points."""
    global cached_sensor_avg
    temp_vals, hum_vals, co2_vals = [], [], []

    for floor_data in realtime.values():
        for eq in floor_data.get("hvac", []):
            for pt in eq.get("points", []):
                nav = str(pt.get("navName") or "").lower()
                val_str = pt.get("currentValue", "")
                try:
                    num = float(re.sub(r'[^0-9.\-]', '', str(val_str)))
                except (ValueError, TypeError):
                    continue

                if "temp" in nav and 10 < num < 50:
                    temp_vals.append(num)
                elif "humid" in nav and 5 < num < 100:
                    hum_vals.append(num)
                elif "co2" in nav and 100 < num < 5000:
                    co2_vals.append(num)

    if temp_vals:
        cached_sensor_avg["temp"] = round(sum(temp_vals) / len(temp_vals), 2)
    if hum_vals:
        cached_sensor_avg["humidity"] = round(sum(hum_vals) / len(hum_vals), 2)
    if co2_vals:
        cached_sensor_avg["co2"] = round(sum(co2_vals) / len(co2_vals), 2)


def _compute_facility_services(realtime: dict) -> dict:
    """Calculate facility services metrics from realtime equipment data."""
    total_alarms = 0
    total_faults = 0
    total_maintenance = 0
    total_equipment = 0
    online_equipment = 0

    for floor_name, floor_data in realtime.items():
        if not isinstance(floor_data, dict):
            continue
        hvac_list = floor_data.get('hvac', [])
        for equipment in hvac_list:
            if not isinstance(equipment, dict):
                continue
            
            total_equipment += 1
            points = equipment.get('points', [])
            equipment_alarms = equipment.get('alarms', [])
            has_connectivity = len(points) > 0
            is_faulty = False
            
            if isinstance(equipment_alarms, list) and len(equipment_alarms) > 0:
                total_alarms += len(equipment_alarms)
            
            for point in points:
                if not isinstance(point, dict):
                    continue
                p_name = str(point.get('navName', '')).lower()
                p_val = str(point.get('currentValue', '')).lower()
                p_status = str(point.get('status', '')).lower()
                
                is_ticket = any(k in p_val for k in ['alarm', 'failure', 'broken', 'stuck', 'slippage', 'seizure', 'fault', 'error'])
                if is_ticket:
                    total_alarms += 1
                    is_faulty = True
                
                is_issue = any(k in p_val for k in ['calibration', 'no response', 'working']) or p_status != 'ok'
                if is_ticket:
                    is_issue = False

                if is_issue:
                    total_faults += 1
                    if p_status != 'ok':
                        is_faulty = True
                
                if ('maintenance' in p_val or 'maint' in p_name or 'manual' in p_val) and 'maintaining setpoint' not in p_val:
                    total_maintenance += 1
            
            if has_connectivity and not is_faulty:
                online_equipment += 1
            elif 'online' in str(equipment.get('equipStatus', '')).lower():
                online_equipment += 1
    
    uptime = 99.8
    if total_equipment > 0:
        uptime = (online_equipment / total_equipment) * 100
        
    return {
        'openTickets': total_alarms,
        'openIssues': total_faults,
        'maintenance': total_maintenance,
        'avgUptime': round(uptime, 1),
        'totalEquipment': total_equipment,
        'onlineEquipment': online_equipment
    }


# ─── FastAPI App ─────────────────────────────────────────────────────────────

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup/shutdown lifecycle."""
    yield
    # Cleanup
    global polling_tasks, client
    _cancel_polling()
    if client:
        await client.close()


def _cancel_polling():
    global polling_tasks
    for task in polling_tasks:
        if not task.done():
            task.cancel()
    polling_tasks = []


app = FastAPI(
    title="FIN Connector API",
    description="Template-based FIN Framework connector for the IFC Digital Twin Viewer",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ─── Request/Response Models ────────────────────────────────────────────────

class LoginRequest(BaseModel):
    username: str
    password: str
    server_url: Optional[str] = None
    project_name: Optional[str] = None


class StatusResponse(BaseModel):
    connected: bool
    project_name: str
    server_url: str
    display_name: str


# ─── Endpoints ───────────────────────────────────────────────────────────────

@app.post("/api/fin/login")
async def login(req: LoginRequest):
    """Authenticate with FIN server using SCRAM-SHA-256."""
    global client, polling_tasks, FIN_SERVER_URL, PROJECT_NAME

    server_url = req.server_url or FIN_SERVER_URL
    project = req.project_name or PROJECT_NAME

    # Update globals if overridden
    FIN_SERVER_URL = server_url
    PROJECT_NAME = project

    _cancel_polling()

    # Close existing client
    if client:
        await client.close()

    client = FinScramClient(server_url, project)
    success = await client.authenticate(req.username, req.password)

    if not success:
        raise HTTPException(status_code=401, detail="Authentication failed")

    polling_tasks = [
        asyncio.create_task(realtime_loop()),
        asyncio.create_task(live_loop()),
    ]

    return {
        "status": "success",
        "message": f"Authenticated to {server_url} as {req.username}",
        "project": project,
    }


@app.get("/api/fin/status", response_model=StatusResponse)
async def get_status():
    """Check connection status."""
    return StatusResponse(
        connected=client.is_authenticated if client else False,
        project_name=PROJECT_NAME,
        server_url=FIN_SERVER_URL,
        display_name=CONFIG.get("display_name", PROJECT_NAME),
    )


@app.get("/api/fin/equip-live")
async def get_equip_live():
    """Get live equipment data (floor-wise with points and alarms)."""
    if not client or not client.is_authenticated:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return cached_equip_data or {"timestamp": None, "equipment": []}


@app.get("/api/fin/power-live")
async def get_power_live():
    """Get live power/energy/sensor data."""
    if not client or not client.is_authenticated:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return cached_power_data or {}


@app.get("/api/fin/pmu-live")
async def get_meter_live():
    """Get power-meter equipment metrics keyed by meter name."""
    if not client or not client.is_authenticated:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return cached_meter_data


@app.get("/api/fin/alarms")
async def get_alarms():
    """Get the flat active-alarm list with counts by severity."""
    if not client or not client.is_authenticated:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return cached_alarm_data or {
        "timestamp": None,
        "alarms": [],
        "counts": {"critical": 0, "warning": 0, "info": 0, "total": 0},
    }


READ_ONLY_EXPR = re.compile(r"^\s*(readById|readAll|hisRead)\s*\(")
BLOCKED_EXPR = re.compile(
    r"pointWrite|pointOverride|pointEmergency|pointSetDef|pointAuto"
    r"|ioWrite|invoke|commit|recNew|recEdit|recRemove|eval\s*\(",
    re.IGNORECASE,
)


@app.get("/api/fin/eval")
async def eval_read(expr: str):
    """Read-only Axon passthrough for history charts and trends."""
    if not client or not client.is_authenticated:
        raise HTTPException(status_code=401, detail="Not authenticated")
    if len(expr) > 2000 or not READ_ONLY_EXPR.match(expr) or BLOCKED_EXPR.search(expr):
        raise HTTPException(status_code=400, detail="Only readById, readAll, and hisRead expressions are allowed")
    text = await client.fetch_api(
        f"/api/{client.project_name}/eval?expr={quote(expr, safe='')}", is_text=True
    )
    if text is None:
        raise HTTPException(status_code=502, detail="FIN request failed")
    return PlainTextResponse(text, media_type="text/zinc")


@app.get("/api/fin/building-info")
async def get_building_info():
    """Get full building data with history."""
    if not client or not client.is_authenticated:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return cached_building_data or {}


@app.post("/api/fin/logout")
async def logout():
    """Disconnect from FIN server."""
    global client
    _cancel_polling()
    if client:
        await client.close()
        client = None
    return {"status": "disconnected"}


@app.get("/api/fin/config")
async def get_config():
    """Get the current config (without sensitive data)."""
    return {
        "project_name": PROJECT_NAME,
        "server_url": FIN_SERVER_URL,
        "display_name": CONFIG.get("display_name", PROJECT_NAME),
    }


# ─── Static Viewer App ────────────────────────────────────────────────────────

BACKEND_DIR = os.path.dirname(os.path.abspath(__file__))
STATIC_DIR = os.path.join(BACKEND_DIR, "static")
MODELS_DIR = os.path.join(BACKEND_DIR, "models")
PROJECT_JSON = os.path.join(BACKEND_DIR, "project.json")


@app.get("/project.json")
async def serve_project_json():
    """Serve the project.json for the standalone viewer."""
    if os.path.exists(PROJECT_JSON):
        return FileResponse(PROJECT_JSON, media_type="application/json")
    raise HTTPException(status_code=404, detail="project.json not found")


@app.get("/thumbnail.webp")
async def serve_thumbnail():
    """Serve the project thumbnail."""
    thumb = os.path.join(BACKEND_DIR, "thumbnail.webp")
    if os.path.exists(thumb):
        return FileResponse(thumb, media_type="image/webp")
    raise HTTPException(status_code=404, detail="thumbnail not found")


@app.get("/models/{filename:path}")
async def serve_model(filename: str):
    """Serve model files (.frag / .glb) from the backend/models/ directory."""
    safe = os.path.normpath(filename)
    model_path = os.path.join(MODELS_DIR, safe)
    # Prevent path traversal
    if not model_path.startswith(MODELS_DIR):
        raise HTTPException(status_code=403, detail="Forbidden")
    if os.path.exists(model_path):
        media = "model/gltf-binary" if model_path.endswith(".glb") else "application/octet-stream"
        return FileResponse(model_path, media_type=media)
    raise HTTPException(status_code=404, detail=f"Model {filename} not found")


@app.get("/")
@app.get("/viewer.html")
async def serve_viewer():
    """Serve the viewer SPA entry point."""
    viewer_path = os.path.join(STATIC_DIR, "viewer.html")
    if os.path.exists(viewer_path):
        return FileResponse(viewer_path, media_type="text/html")
    return {"error": "Viewer not found. Make sure static/ folder is present."}


if os.path.exists(STATIC_DIR):
    app.mount("/", StaticFiles(directory=STATIC_DIR, html=True), name="static")
