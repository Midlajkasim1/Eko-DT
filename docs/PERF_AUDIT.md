# Performance Audit — Frag Digital Twin Viewer

**Target device for all impact estimates:** 8 GB RAM laptop, integrated GPU (VRAM carved from system RAM), 100 Mbps LAN (12.5 MB/s), Chrome.
**Evidence corpus:** repo source at `src/`, `backend/`, `static/`; the shipped export at `docs/Marsa_project/backend/`; the distribution archive `docs/Marsa_project (3).zip`.
**Labelling:** every number is tagged **[M]** (measured — computed from a real file or a real run) or **[E]** (estimated — arithmetic on stated assumptions). Assumptions and constants are in Appendix B.

---

## 1. Executive summary

A cold open of the exported viewer downloads **284,545,480 bytes of `project.json` [M]** and blocks every model fetch behind it — `src/viewer/ViewerApp.tsx:179` awaits `res.json()` before the model loop at `:222` can issue its first byte — so **22.76 s [M/E]** of wire time elapses on a 100 Mbps LAN before a single triangle exists, on every single open. **99.99 % of that file is base64 JPEG [M]**: 284,501,846 of 284,545,480 characters are `textureDataUrl` values; everything else — models list, camera, render settings, API settings, thumbnail — totals about **32 KB compact [M]**. Only **5 of the 14 embedded textures are unique [M]**, so **154.0 MB is byte-identical duplication [M]**, and **209.7 MB of it belongs to models that are not in the export at all [M]** (verified against `docs/Marsa_project (3).zip`, which contains exactly 5 `.frag` entries). Both ends of the transfer defeat caching independently: the client sends `?t=Date.now()` plus `cache:'no-store'` (`ViewerApp.tsx:164`) and `serve_project_json` (`backend/main.py:722-731`) takes no `Request` and never checks `If-None-Match`, so a reopen costs the same 22.76 s as the first open — while the route 12 lines below it (`backend/main.py:743-763`) already implements exactly the ETag/304 pattern that is missing.

Behind that prefix sit three more compounding costs. Parsing the response peaks at **~850-895 MB RSS [M]** and retains **~275 MB of V8 heap for the whole session [M]** in `useProjectStore.currentProject` — on an 8 GB machine whose iGPU shares the same RAM. Every `.frag` is then decompressed and parsed **twice**, into two independent `FragmentsModels` worker pools (`src/hooks/useModelLoader.ts:83-89` then `:92`), strictly serialised, for a second copy that **no code in the repo ever reads** and that is structurally incapable of serving a pick — costing **270.1 MB of duplicated inflated geometry [M]** and roughly doubling parse wall-clock. And in the studio, opening the project list materialises the same 284.5 MB file **twice per recent project** (IndexedDB structured clone + disk parse, `src/store/useProjectStore.ts:89-91`, `src/lib/projectDb.ts:24`/`:80`) to render five fields, then re-parses it a third time and writes all 284.5 MB back into IndexedDB when you click (`useProjectStore.ts:158-161`).

The single fix that moves everything is externalising textures to content-hashed sidecar files: `project.json` goes to **~45 KB [M]**, textures to **3.0 MB of WebP capped at 2048 px [M]**, which removes the 22.76 s prefix, the 850 MB spike, the 275 MB retention, ~1.08 GB of latent GPU bitmap, ~21 s of ZIP-export deflate, and the multi-second freeze on every material edit — all from one change.

---

## 2. Cold-open critical path

### 2.1 Exported viewer (as shipped in `docs/Marsa_project/`)

Time-ordered. "Blocking" = nothing downstream can start until it completes.

| # | Step | What blocks | s on target | Notes |
|---|---|---|---|---|
| 1 | `GET /` → 302 → `/login` | full navigation | 0.1 **[E]** | Shipped backend gates `/`, `/project.json`, `/models` behind `_has_session()` (`docs/Marsa_project/backend/main.py:726-733, 745-749, 761-766`). Repo source deliberately ungates them (`backend/main.py:724-728`) — **stale export**. |
| 2 | Operator types + `POST /api/auth/login` | full navigation | operator | `login.html:338` does `window.location.replace('/')` — zero overlap with any asset transfer. |
| 3 | `viewer.html` + eager JS 8,369,908 B **[M]** | JS execute | 0.67 wire **[M]** + ~0.6-0.9 compile **[E]** | `three` 744,279 + `thatopen` 6,725,495 + `ViewerCanvas` 848,729 + css 29,774 + react/viewer. Uncompressed — no `GZipMiddleware` anywhere (`backend/main.py:420` registers only CORS). |
| 4 | worker fetch from `unpkg.com` | engine init only | 0.2-0.6 **[E]** | `FRAGS.FragmentsModels.getWorker()` (`src/lib/fragmentsEngine.ts:667`) hard-codes `https://unpkg.com/@thatopen/fragments@3.4.5/...`. Runs **in parallel**; but hard-fails on an air-gapped LAN. The locally built `worker-u5_w900i.mjs` (3,253,387 B **[M]**) ships and is never requested. |
| 5 | **`GET project.json` 284,545,480 B** | ⛔ **everything** | **22.76 [M/E]** | `ViewerApp.tsx:164`. **Serialized and need not be.** Uncacheable by construction (see §4.1). gzip is not an escape: 214.5-218.6 MB **[M]**, still 17.2-17.5 s. |
| 6 | `await res.json()` | ⛔ everything | 0.8-1.2 **[E]** (0.37-0.50 desktop **[M]**) | Peak ~850-895 MB RSS **[M]**; 275 MB retained for the session **[M]** (`ViewerApp.tsx:210-211`). |
| 7 | `beginSession()` + progress UI | — | 0 | `ViewerApp.tsx:214` runs **after** the await at `:179`, so steps 5-6 show an indeterminate spinner with no progress at all. |
| 8 | Model fetch loop, 96,825,739 B **[M]** | first model | 7.75 wire **[M/E]** | `ViewerApp.tsx:222-229`, strictly serial `for … await`. **Serialized and need not be.** 8 of 13 declared models 404 (see §4.9). |
| 9 | Per-model parse ×2 | model visible | ~20.5 **[E]** | `useModelLoader.ts:83-89` (throwaway) then `:92` (real), awaited back-to-back. Inflate floor alone: 3.20 s desktop **[M]** per pass. **Redundant.** Partially overlaps step 8. |
| 10 | Texture decode + upload | nothing (fire-and-forget) | 0.6-0.9 **[E]** | One reachable texture as shipped: 7952×5304 = 42,177,408 px **[M]** → 168.7 MB RGBA, ~225 MB with mips **[E]**. |
| **Σ** | **click → all models interactive** | | **≈ 45-60 [E]** | Of which **~30.5 s is pure serial transfer** that a manifest split and concurrent fetches would collapse to ~8 s. |

### 2.2 Studio (`index.html` → `App.tsx`), one Marsa-sized recent project

| # | Step | What blocks | s on target | Notes |
|---|---|---|---|---|
| 1 | `ProjectListPage` mount → `loadRecentProjects` | project cards | — | `ProjectListPage.tsx:39-41`. Re-runs on **every** return to the list (`App.tsx:92`, `Header.tsx:21`, `Sidebar.tsx:82`); StrictMode doubles it in dev. |
| 2 | `getCachedHandles()` IDB structured-clone | ⛔ cards | 0.15-0.7 **[E]** (0.09-0.40 desktop **[M]**) | `projectDb.ts:20-36` deserialises **all** cached metas into one array before the loop. `cacheHandle` stores the whole meta (`projectDb.ts:16-18`). |
| 3 | `loadProjectFromHandle` read+decode+parse | ⛔ cards | 1.0-1.3 **[E]** (0.58-0.67 desktop **[M]**) | `projectDb.ts:80` — `JSON.parse(await file.text())`. Renders 5 fields ≈ 63 B of scalar data. |
| 4 | click → `openRecentProject` re-parse | ⛔ open | 1.0-1.3 **[E]** | `useProjectStore.ts:158` throws away the `meta` the caller already holds (`ProjectListPage.tsx:62`). **Redundant.** |
| 5 | `await cacheHandle(...)` 284.5 MB → IndexedDB | ⛔ open | 1.2-3.0 **[E]** | `useProjectStore.ts:161`. Clone 0.24-0.27 s **[M]** + LevelDB write. **Awaited before the first `.frag` byte.** |
| 6 | Serial disk read of 5 `.frag`, 96.8 MB | first model | 0.5-1.5 **[E]** | `projectDb.ts:265-277`, strictly serial. |
| 7 | Per-model parse ×2 | model visible | ~20.5 **[E]** | Same double parse as §2.1 #9. |
| 8 | Spatial-tree enrichment, 75,099 worker RPCs **[M]** | UI responsiveness | 1.5-3 **[E]** | `useSpatialTree.ts:30-83`, one un-batched `getAttributes()` per node, fired the moment each model parses. Studio only. |
| **Σ** | **app start → all models interactive** | | **≈ 27-32 [E]** | Steps 2-5 (~4-6 s) are **entirely avoidable**; the card needs ~19 KB, the file is 284.5 MB — an over-read factor of **8,791×** against the non-override remainder **[M]**. |

Retained memory on the project-list screen before the user clicks anything: **275.5 MB per recent project [M]**, held in `recentProjects` for the session (`useProjectStore.ts:107-114`); `closeProject` deliberately does not clear it (`:173-175`).

---

## 3. Ranked findings

Ranked by **user-visible impact ÷ implementation risk**, not by severity. All rows are CONFIRMED unless marked. Severity in brackets where it differs from the auditor's original after verification.

| # | Sev | Finding | Dimension | Evidence | Impact | Fix | Eff | Risk |
|---|---|---|---|---|---|---|---|---|
| 1 | crit | `project.json` embeds 284.5 MB of base64 JPEG; 99.99 % of the file, 5 unique images, 154 MB duplication | data-at-rest / everything | `projectDb.ts:313-314`; `MaterialPanel.tsx:85-95`; `types/index.ts` | 22.76 s serial prefix, 275 MB retained, ~850 MB peak, ~1.08 GB latent GPU | Content-hashed sidecar textures + 2048 px cap (§5 Phase 1) | M | M |
| 2 | crit | Every `.frag` parsed **twice** into two worker pools, serially; second copy never read | model-load | `useModelLoader.ts:83-92`; `fragmentsEngine.ts:670-671`; `components/index.mjs:9189` | ~50 % of parse wall-clock; 270.1 MB duplicated inflated data **[M]** | Delete 8 lines | **trivial** | L |
| 3 | crit | `/project.json` uncacheable at both ends: `?t=` + `no-store` client, no `If-None-Match` server | network | `ViewerApp.tsx:164`; `backend/main.py:722-731` vs `:753-762` | 22.76 s on **every reopen** | Copy the 4-line ETag block from `serve_model`; drop the buster | **S** | L |
| 4 | crit | Export ships 209.7 MB of textures for models not in the bundle | data-at-rest | `projectDb.ts:306-331`; override→modelId grouping **[M]** | −209.7 MB / −16.8 s first open | Build export meta from models that produced bytes | S | L |
| 5 | crit | Textures decoded per-override with a fresh `TextureLoader`, `THREE.Cache` off, never disposed | memory / GPU | `useMaterialOverrides.ts:437-445`; grep `THREE.Cache` = 0 hits | 168.7 MB RGBA leaked **per** material edit; 854 MiB latent | Module-level hash→Texture cache + `dispose()` | S | L |
| 6 | crit | Studio list mount materialises 284.5 MB twice per recent project to render 5 fields | studio-open | `ProjectListPage.tsx:39-41`; `useProjectStore.ts:89-91`; `projectDb.ts:24, 80` | ~1.0-1.3 s frozen + 275 MB retained **per project** | Slim card record in `cacheHandle`; don't re-read on the list | S | L |
| 7 | crit | Click re-parses `project.json` a 2nd time then awaits a 284.5 MB IndexedDB write before any geometry | studio-open | `useProjectStore.ts:158-161`; `ProjectListPage.tsx:62-72` | ~1.7-3.4 s of dead time click→first byte **[M/E]** | Pass the already-parsed meta through; cache slim record | S | L |
| 8 | high | Shipped bundle is stale: cache-busts `.frag` too, gates all routes behind sign-in, has no `SignInOverlay` | export | `static/assets/viewer-Bj5BPblg.js:60`; `docs/.../main.py:726-766` | 96.8 MB re-downloaded per open (7.75 s **[M/E]**); zero sign-in/transfer overlap | Rebuild + re-export; verify the export copies current `backend/main.py` | S | M |
| 9 | high | Every material edit / nudge / camera save re-stringifies + rewrites all 284.5 MB | material-overrides | `projectDb.ts:55-73, 238-241`; 8 call sites incl. `useProjectStore.ts:392`, `ProjectSettingsModal.tsx:192` | ~0.5-0.8 s hard freeze + ~1.4 s write per click **[M]**; 5.69 GB written per 20 edits | Debounce; move `stringify` out of the retry loop; (moot after #1) | S | L |
| 10 | crit | `/api/fin/power-live` returns 921-981 KB every 5 s because `power_history` is embedded | backend network | `backend/main.py:114-126, 502-507`; `data-provider.js:96-118` | 663-706 MB/hour/tab **[M]**; ~156 ms event-loop block per request **[M]** | Split history to the 30 s poll + ETag | S | L |
| 11 | crit | `DashboardOverlay` teardown targets `window.Dashboard`, which is never assigned anywhere | memory leak | `DashboardOverlay.tsx:111-120`; grep `window.Dashboard =` = 0 hits | Every toggle leaks timers + ≤16 listeners, permanently | Give `dashboard.js` a real `destroy()` handle | M | L |
| 12 | crit | `data-provider.js` self-starting IIFE with no guard: N toggles → N pollers **and** N² live-DOM rebuilds | memory / CPU | `data-provider.js:70-80, 118-130, 147`; `dashboard.js:937-941, 2967` | 5 toggles = 90 req/min forever + 5 right-panel innerHTML rebuilds/s | Idempotent IIFE; call `stop()` from cleanup | M | M |
| 13 | high | `RenderPass` output is discarded — N8AO re-renders the scene itself (`autoRenderBeauty`) | render loop | `fragmentsEngine.ts:451-466`; `n8ao/dist/N8AO.js:2404, 2867-2870, 2965` | 1 of 3 full scene + 4096² shadow submissions per frame | `renderPass.enabled = !ssaoPass.enabled` | S | M |
| 14 | high | Depth pre-pass allocates a `MeshDepthMaterial` **inside** the RAF callback and re-renders the shadow map | render loop | `fragmentsEngine.ts:597-606, 626-635, 340-342` | ~3-7 ms/frame **[E]** + 60 material allocs/s | Hoist the material; `shadowMap.autoUpdate=false` around it | S | L |
| 15 | high | `web-ifc` (~4.6-5.2 MB) welded into the eagerly-preloaded `thatopen` chunk; the viewer never converts IFC | build | `@thatopen/fragments/index.mjs:40`; `vite.config.ts:209-213`; `viewer.html:11-14` | ~0.9-1.1 s of cold start **[E]**; 13.5 MB heap **[M]** | Viewer-only alias stub + dynamic import in `ifcConverter.ts` | M | M |
| 16 | high | ZIP export deflates ~377 MB on the main thread in 16 KB slices | data-at-rest | `projectDb.ts:413`; `jszip/lib/stream/DataWorker.js:8` | ~26 s **[M]**, ~1.3-1.5 GB peak RSS **[M]** | `STORE` for `.frag`/textures; move to a Worker | L | M |
| 17 | high | One "Apply Material" click applies every override on the model **twice** | material-overrides | `MaterialPanel.tsx:117-121`; `useMaterialOverrides.ts:482-494, 524-527, 543` | 2 full-res decodes per click; 13× if the missing model is restored | Drop the redundant event dispatch | S | M |
| 18 | high | `parse_zinc_csv` `<< >>` collapse is a char-at-a-time loop on grids containing zero `<<` | backend CPU | `fin_client.py:43-59, 80-95` | 1,112 ms of 1,849 ms per 30 s cycle **[M]**; regex = 1.3 ms **[M]** | `re.sub` + `csv.reader` | S | M |
| 19 | high | No response compression anywhere | backend network | `backend/main.py:17-21, 420-426` | ~642 MB/hr/tab removable **[M]** | Path-guarded gzip on `/api` + `/assets` **only** | trivial | M |
| 20 | high | Spatial-tree enrichment fires 75,099 un-batched worker RPCs the moment each model parses | react | `useSpatialTree.ts:30-83`; `ModelInfoPanel.tsx:237-241` | ~0.74 s worker **[M]**, ~1.5-3 s on target **[E]**; studio only | One `getItemsData(allIds)`; gate behind expand | M | L |
| 21 | crit | IFC→frag conversion runs on the main thread | ifc | `App.tsx:71-75`; `ifcConverter.ts:13-27`; `fragments/index.mjs:37588-37610` | 384,600 ms across 8 files **[M]**; 145,219 ms for one **[M]** | Move `IfcImporter` into a Worker | M | M |
| 22 | med | `fetch_power_histories` awaits 30 hisReads serially inside the 30 s loop | backend | `fin_client.py:694-701` | 29 wasted RTTs; 6-30 s per cycle **[E]** | `asyncio.gather` + `Semaphore(8)` | S | L |
| 23 | med | `asyncio.to_thread` does not protect the event loop from pure-Python parsing (GIL) | backend | `fin_client.py:507-513`; `main.py:71-81` | 3.9 s window per 30 s **[M]**; concurrent `.frag` streaming drops to 4.1 MB/s **[M]** | Fix #18 first; then `ProcessPoolExecutor` | M | M |
| 24 | med | Whole IFC materialised as one ArrayBuffer (1.99 GB) **[M]**; library's `readCallback` unused | ifc | `App.tsx:73-74`; `fragments/index.d.ts:3778-3797` | ~2 GB peak on an 8 GB box; needs a Worker to fix | Worker + `FileReaderSync` over `File.slice()` | M | M |
| 25 | med | Engine init blocks on a cross-origin `unpkg.com` worker fetch; fails closed offline | model-load | `fragmentsEngine.ts:667`; `fragments/index.mjs:36208-36219` | ~0 s added (overlaps), but total failure on an air-gapped LAN | Pass the bundled worker URL | S | L |
| 26 | med | Model fetch and disk read loops are strictly serial | open path | `ViewerApp.tsx:222-261`; `projectDb.ts:265-277` | Hides no request boundaries; blocks the parse pipeline | Bounded concurrency 2 + anchor-first parse | M | M |
| 27 | med | `readBodyWithProgress` allocates a second full buffer per model | memory | `ViewerApp.tsx:12-35` vs `projectDb.ts:126-135` | +41.4 MB transient peak **[M]** | Preallocate from `content-length` | trivial | L |
| 28 | med | Per-chunk `updateEntry` causes ~1,477 store commits + React renders per open **[M]** | react | `useLoadingProgressStore.ts:50-55`; `ViewerApp.tsx:236` | Main-thread churn during load | rAF-coalesce | S | L |
| 29 | low | Two orphan overrides target modelIds absent from `project.models` | data | override grouping **[M]** | ~0 runtime (filtered at `useMaterialOverrides.ts:482`), ~200 B | Mark `orphanedAt`; prune in `removeModelEntry` | trivial | L |
| 30 | — | ❌ **Rejected:** pretty-printing `project.json` | — | 284,545,480 vs 284,538,182 **[M]** | 0.0026 % — do not chase | — | — | — |
| 31 | — | ❌ **Rejected:** `static/static/` is duplication | — | `templates/index.html:7, 790, 791` | Referenced through the `StaticFiles` mount | — | — | — |

---

## 4. Findings in detail

### 4.1 `project.json` is a 284.5 MB serial prefix that can never be cached

**Evidence.** `src/viewer/ViewerApp.tsx:164`:

```ts
res = await fetch('project.json?t=' + Date.now(), { cache: 'no-store' })
```

`:179` — `const meta = (await res.json()) as ProjectMeta` — and the model loop only begins at `:222`. `backend/main.py:722-731`:

```python
@app.get("/project.json")
async def serve_project_json():
    if os.path.exists(PROJECT_JSON):
        return FileResponse(PROJECT_JSON, media_type="application/json")
```

The signature takes **no `Request`**, so no conditional-GET is even possible. Starlette 1.3.1's `FileResponse.set_stat_headers` *does* emit an `etag` — the defect is that `FileResponse.__call__` never inspects `if-none-match` (only `StaticFiles` does), so the endpoint answers 200 + full body regardless. Twelve lines below, `serve_model` (`backend/main.py:753-762`) implements exactly the right pattern, with the comment *"A matched ETag turns a 100+ MB transfer into a 304 on every revisit."*

**Arithmetic.**

| Quantity | Value | Tag |
|---|---|---|
| `project.json` | 284,545,480 B | M |
| `textureDataUrl` characters | 284,501,846 (99.985 %) | M |
| Non-override remainder | ~32,367 B compact / ~38,205 B pretty | M |
| Wire at 12.5 MB/s | 284,545,480 ÷ 12,500,000 = **22.76 s** | M/E |
| gzip -6 | 214.5-218.6 MB (75-77 %) → 17.2-17.5 s | M |
| Over-read factor vs remainder | **8,791×** | M |

Compression is **not** a mitigation: base64-wrapped JPEG is already-compressed entropy, and producing it costs 11-14 s of single-threaded CPU on a 1-worker uvicorn **[M]**, serialised into the same request window.

**Nuance.** The shipped `docs/Marsa_project/backend/main.py:729-730` gates `/project.json` behind `_has_session()`, so there the 22.76 s starts *after* sign-in; the repo source deliberately ungated it. The serial prefix is identical either way. Over loopback (the default path `Start_Viewer_Windows.bat` opens) transfer collapses to ~0.3-2 s **[M]** and the memory spike becomes the dominant harm; 22.76 s applies to the LAN path the same script advertises (`--host 0.0.0.0`).

### 4.2 `res.json()` materialises the payload three times and retains 275 MB forever

**Evidence.** `ViewerApp.tsx:179` then `:210-211`:

```ts
setProjectMeta(meta)
useProjectStore.setState({ currentProject: meta })
```

**Measured (node 24 / V8, real file):** `readFileSync` → RSS 306 MB; `buf.toString('utf8')` → RSS 578 MB; `JSON.parse` → RSS **854 MB**, `heapUsed` **275 MB**. With `--expose-gc`, 546 MB survives a forced GC in one harness (V8 sliced strings pinning the source), 275 MB in another — call the retained figure **275-546 MB [M]**.

**Honest correction:** the "three copies at once" figure is partly a Node artefact. Chrome's `Response.json()` decodes the body incrementally (`FetchDataLoader::CreateLoaderAsString`, 8-bit fast path since the payload is pure ASCII), so the network buffer need not fully coexist with the finished string. State the Chrome transient as **~550-850 MB [E]**, the retained figure as **~275 MB [M]**, and tab-crash as *plausible, not certain*. Note also that `projectMeta` and `currentProject` are two references to the **same** object — retention is 275 MB once, not doubled — and `projectMeta` is read exactly once outside its declaration, at `ViewerApp.tsx:287`, to pass a single boolean.

Parse cost is **not** the headline: 0.37-0.50 s desktop **[M]**, ~0.8-1.2 s on target **[E]**, against 22.76 s of download. This finding is about memory, not latency.

### 4.3 Every `.frag` is parsed twice, and nothing reads the second copy

**Evidence.** `src/lib/fragmentsEngine.ts:667-671`:

```ts
const workerUrl = await FRAGS.FragmentsModels.getWorker()
const fragments = new FRAGS.FragmentsModels(workerUrl)
const obcFragments = components.get(OBC.FragmentsManager)
obcFragments.init(workerUrl)
```

`FragmentsManager.init` runs `this._core = new FragmentsModels(workerURL, options)` (`node_modules/@thatopen/components/dist/index.mjs:9189`) — a **second, complete** parser with its own worker pool. `src/hooks/useModelLoader.ts:83-92` then feeds it the same bytes:

```ts
const obcBuffer = fragBytes.slice(0); // clone to avoid transfer issues
await (engine.obcFragments as any).core?.load?.(obcBuffer, { modelId });
…
const model = await engine.fragments.load(fragBytes, { modelId })
```

Line 85 is awaited before line 92 begins — **strictly serial**, not overlapped. Neither call passes `raw`, so the worker's `CREATE_MODEL` handler runs `pako.inflate` and rebuilds the flatbuffer view, box controller, tiles, properties, raycaster and BVH twice (`worker.mjs:81776-81784, 81184-81194`).

**The second copy is dead.** `grep -rn obcFragments src/` returns 5 hits: the interface field (`fragmentsEngine.ts:27`), construction and `init` (`:670-671`), the return (`:793`), and this one write. **Zero reads.** More strongly, it *cannot* serve a pick: `SimpleRaycaster.castRay` → `FastModelPicker` builds its material map from the OBC `fragments.list` (`components/index.mjs:12782-12786`) but *renders* `world.scene.three` (`:12848`) after hiding every mesh not inside an OBC `model.object` subtree (`:12885-12905`). The OBC objects are never added to any scene — `world.scene.three.add(model.object)` at `useModelLoader.ts:112` adds only the primary copy. So the picker hides all real geometry, renders an empty 4×4 scissor box, reads back a cleared pixel, and returns null. The `world.meshes` fallback at `:13909` is empty too (`world.meshes` is never populated in `src/`). Real picking is done by `mAny.raycast(...)` over `engine.fragments.models.list` (`ViewerCanvas.tsx:397-406`) plus a `THREE.Raycaster` fallback (`:423-452`).

**Arithmetic (measured on the 5 shipped files):**

| File | on disk | inflated | pako inflate |
|---|---|---|---|
| mr4pcit9-tqt0vwt | 41,384,646 | 107,802,688 | 1,404 ms |
| mr4pcofo-s64li2e | 1,827,551 | 5,318,584 | 75 ms |
| mr4pd6s3-d04ewpn | 21,891,107 | 68,862,248 | 748 ms |
| mr4rrco9-v2x9il3 | 14,106,462 | 39,618,672 | 432 ms |
| mr4rsg39-yn5jrpc | 17,615,973 | 48,509,752 | 546 ms |
| **Total** | **96,825,739** | **270,111,944** (2.79×) | **3,204 ms** |

All **[M]** (desktop, node 24). Duplicated worker-resident inflated data: **270.1 MB**, of which 257.6 MiB is pure duplication. Full `CREATE_MODEL` is ~2× the inflate floor **[E]**, and the target laptop ~1.6× slower **[E]** → one pass ≈ 10.3 s, so the redundant pass costs ≈ **10 s of serialised wall-clock**.

Two further costs the deletion also removes: the `fragBytes.slice(0)` clone (up to 41.4 MB transient, needed *only* because the OBC load would detach the buffer first — `FragmentsModels.load` already transfers, `fragments/index.mjs:15839-15843`), and a second worker pool (`hardwareConcurrency − 3`, floor 2), which on a 4-core laptop takes worker threads from 4 to 2. The OBC models are also never disposed — `ViewerCanvas.tsx:130-136` only calls `engine.fragments.disposeModel(id)` — so the duplicate survives project close.

### 4.4 Studio project list materialises 284.5 MB twice per recent project to render five fields

**Evidence.** `ProjectListPage.tsx:39-41` → `useProjectStore.ts:83-91`:

```ts
const cached = await getCachedHandles()
for (const { projectId, handle, meta: cachedMeta, thumbnail: cachedThumb } of cached) {
  let meta = await loadProjectFromHandle(handle)
```

`getCachedHandles` (`projectDb.ts:20-36`) does a serial `await get(key)` per project — each one structured-clone-deserialising the full record, because `cacheHandle` (`projectDb.ts:16-18`) stores the entire meta:

```ts
await set(projectId, { handle, meta, thumbnail }, handleStore)
```

Then `loadProjectFromHandle` → `readJson` (`projectDb.ts:80`) does `JSON.parse(await file.text())` on the same 284.5 MB. The card renders `project.name`, `models.length`, `updatedAt`, the thumbnail, and `isFinProject` (`ProjectListPage.tsx:280-285`).

**Two mechanical caveats, both verified.** (a) The IDB copy is *pure waste on the happy path* — `cachedMeta` is only read at `useProjectStore.ts:93` when `loadProjectFromHandle` returns null. (b) The disk read is **conditional**: on a cold page load the File System Access permission is `'prompt'`, `getFileHandle` rejects, `readJson` swallows it (`projectDb.ts:81-83`) and only the IDB leg runs. The full double-materialisation fires when permission is live — i.e. **every time the user navigates back to the project list mid-session** (`App.tsx:92`, `Header.tsx:21`, `Sidebar.tsx:82` remount the page).

**Arithmetic [M], real file, node 24:** IDB structured-clone deserialise 90-402 ms; file read 142-182 ms; UTF-8 decode 99-144 ms; `JSON.parse` 258-343 ms. Per project: **~0.58-0.67 s desktop**, ~1.0-1.5 s on target **[E]**, ~569 MB of I/O. `getCachedHandles` returns **all** metas in one array that stays reachable for the whole loop, so N cached projects hold N copies live *before* the first parse; peak with one project + its parse = **854 MB RSS [M]**. Retained afterwards: **275.5 MB per project [M]** in `recentProjects`, for the session.

The card's true minimum payload is ~19 KB (dominated by an 18,871-char thumbnail data URL that `project.json` *also* embeds and that `loadProjectFromHandle` then overwrites by separately reading `thumbnail.webp`, `projectDb.ts:219-230`). Scalar fields alone: **63 B**.

**Secondary defect on the same lines:** when the disk read fails, the card renders from the cached meta (`useProjectStore.ts:93-96`), but `openRecentProject` re-reads and returns null at `:159` — so clicking such a card silently does nothing.

### 4.5 Clicking a project pays a second parse plus an awaited 284.5 MB IndexedDB write

**Evidence.** `useProjectStore.ts:155-161`:

```ts
openRecentProject: async (handle: FileSystemDirectoryHandle) => {
  const ok = await verifyHandlePermission(handle)
  if (!ok) return null
  const meta = await loadProjectFromHandle(handle)
  if (!meta) return null
  await cacheHandle(meta.projectId, handle, meta, (meta as any).thumbnail)
```

`ProjectListPage.handleOpenRecent` (`:62-72`) already **has** the parsed `meta` in its own arguments. Only after all three complete does `loadModelsFromProject` run (`ProjectListPage.tsx:99-100`).

**[M]:** re-parse 504-511 ms (read 141 + decode 100 + parse 262); structured-clone serialise 239-274 ms producing a 271.4 MB record; 284.5 MB write+fsync at 141 MB/s = 2,019 ms — a floor for the LevelDB write. **Total awaited dead time click → first `.frag` byte ≈ 1.7-3.4 s [M/E]**, peak process RSS 1.67 GB **[M]**.

**Honest note:** the re-read is not *purely* redundant — it picks up external edits (a case the codebase handles explicitly at `useProjectStore.ts:396`). But freshness does not require re-parsing 284 MB of base64, and `cacheHandle` re-writes byte-identical data in the common case.

### 4.6 Material overrides: uncached, un-disposed, full-resolution camera JPEGs

**Evidence.** `useMaterialOverrides.ts:437-445` (verified verbatim):

```ts
if (override.textureDataUrl && 'map' in mat) {
  new THREE.TextureLoader().load(override.textureDataUrl, (tex) => {
    tex.wrapS = THREE.RepeatWrapping
    tex.wrapT = THREE.RepeatWrapping
    const scale = override.textureScale !== undefined ? override.textureScale : 0.001
    tex.repeat.set(scale, scale)
    mat.map = tex
```

A fresh `TextureLoader` per material per apply; `THREE.Cache.enabled` is never set anywhere in `src/` (grep = 0 hits); no `texture.dispose()` anywhere (three's `Material.dispose()` does **not** dispose `.map`); no `colorSpace`, no `anisotropy`, no size cap.

**JPEG SOF headers extracted from `project.json` [M]:**

| Dimensions | Mpx | copies | RGBA each |
|---|---|---|---|
| 7952×5304 | 42.18 | 1 | 168.7 MB |
| 6016×4016 | 24.16 | 1 | 96.6 MB |
| 5472×3648 | 19.96 | 7 | 79.8 MB |
| 2824×2000 | 5.65 | 3 | 22.6 MB |
| 1080×720 | 0.78 | 2 | 3.1 MB |

14 textured overrides; 13 reachable (one targets `model-mrn570k9-r8apmz3`, absent from `project.models`) = **223.8 Mpx = 895 MB / 854 MiB of RGBA [M]**, ~1.14 GB with mipmaps **[E]**. Deduped to the 5 unique images: **92,725,120 px = 353.7 MiB [M]**.

**Critical scope correction.** In the bundle as actually shipped, only **ONE** texture ever decodes. Twelve of the fourteen belong to `model-mrndfcat-yhvvvgk`, whose `.frag` is absent — verified inside `docs/Marsa_project (3).zip` itself, which contains exactly 5 `.frag` entries — and `ViewerApp.tsx:229-233` skips a 404'd model, so `applyForModel` never runs for it (`useMaterialOverrides.ts:482-494` filters on `override.modelId === modelId` over loaded models only). Realised cost: **42.18 Mpx = 168.7 MB RGBA, ~225 MB with mips [M/E]**, ~0.6-0.9 s of decode, fire-and-forget so it adds no load latency. The 854 MiB figure is the **latent** ceiling the moment that model file is restored — and `project.models` declares it, so restoration is clearly intended.

**The repeat cost is the real defect.** `useProjectStore.ts:382-387` builds a new `materialOverrides` object on every save, changing the effect dependency at `useMaterialOverrides.ts:543`, which re-applies **every** override on **every** loaded model. `MaterialPanel.tsx:121` then *additionally* dispatches `material-override-updated`, handled at `:524-527`. So one Apply click = two applications minimum, each with a fresh decode, and the superseded GPU texture is never freed. Five edits on the shipped project ≈ **1.05 GiB of unreclaimed GPU memory [E]** on a machine whose iGPU shares the 8 GB.

The cap is visually free: UVs are box-projected raw world metres (`useMaterialOverrides.ts:225-237`) and `repeat.set(scale, scale)` at `:441-442` with `textureScale` measured at 0.001-0.2, so texels/m = width × scale. At scale 0.001 the 7952 px source resolves **7.95 texels/m (12.6 cm/texel)** — already a blur at any distance, for 74.83 MB of payload.

### 4.7 Export ships 209.7 MB of textures for models it does not contain

**Evidence.** `projectDb.ts:313-314`:

```ts
const backendMeta = { ...meta, apiSettings: { ...(meta.apiSettings || {}), finDirectMode: false } }
zip.file('backend/project.json', JSON.stringify(backendMeta, null, 2))
```

The models loop at `:326-331` already reads each model's bytes and silently skips the missing ones — but the meta written at `:314` is unfiltered.

**Override bytes by modelId [M]:**

| modelId | overrides | bytes | in `models[]` | on disk |
|---|---|---|---|---|
| model-mrndfcat-yhvvvgk | 12 | 209.3 MB | yes | **no** |
| model-mr4pcit9-tqt0vwt | 1 | 74.8 MB | yes | yes |
| model-mrn570k9-r8apmz3 | 1 | 0.4 MB | **no** | no |
| model-mr4pcp28-2ijom66 | 1 | ~0 | **no** | no |

Filtering to models that produced bytes: `project.json` **284.5 MB → 74.9 MB [M]**, i.e. **−209.7 MB, −16.8 s of first-open wire time**, ~209 MB less browser heap, and 8 dead model fetches removed from the loading card.

### 4.8 The shipped bundle is a stale build

Three independent regressions, all fixed in `src/` and none re-exported:

| Defect | Shipped | Repo source |
|---|---|---|
| `.frag` fetches | `fetch(t.fragFile + "?t=" + Date.now(), {cache:"no-store"})` — `viewer-Bj5BPblg.js:60` | `await fetch(m.fragFile)` with the comment *"Cacheable on purpose"* — `ViewerApp.tsx:227-229` |
| `/models` ETag/304 | absent — `docs/.../main.py:755-758` | present — `backend/main.py:753-763` |
| Route gating | `/`, `/project.json`, `/models` all behind `_has_session()` — `docs/.../main.py:726-766` | deliberately ungated — `backend/main.py:724-728` |
| `SignInOverlay` | absent (grep "Secure Connect" over every shipped asset = 0 hits) | present, designed so *"models keep streaming in behind it"* |

Cost as shipped: **96,825,739 B [M]** of `.frag` re-downloaded on every open = **7.75 s [M/E]**, plus zero overlap between the operator's typing and the ~31.6 s of transfer, plus one extra full navigation and a 17.4 KB `login.html` round trip. The `_has_session()` gate keys off a module-global `client` (`main.py:43`), so it only fires on the first open after each server start.

**Bound on the caching fix:** Chrome's Simple Cache refuses any single entry above ~1/8 of the cache size (~40 MB at the default). If the 121.3 MB and 138.7 MB `.frag` files are ever deployed they may never be cached even with perfect headers — content-hashed immutable URLs, or splitting the large frags, is what makes the fix hold.

### 4.9 The shipped export is a partial extraction — stated explicitly

`project.json` declares **13 models totalling 482,530,257 B [M]**. Only **5 `.frag` files (96,825,739 B) [M]** exist, both on disk in `docs/Marsa_project/backend/models/` **and inside `docs/Marsa_project (3).zip`** (verified: exactly 5 `.frag` entries). Missing: `mr4re409-0rht67o` (121.3 MB), `mr4rk17v-wis1pts` (138.7 MB), `mrndfcat-yhvvvgk` (13.6 MB), and five `.glb` at 22.4 MB each.

**Where this matters:** it caps the *realised* texture cost at one image (§4.6), caps the *realised* model transfer at 7.75 s rather than 38.6 s, and means `project.json` is currently 74.6 % of the network budget — but only 37 % if all 13 models were deployed. Every number in this report that depends on the model set is given for **both** the shipped 5 and the declared 13.

### 4.10 Render loop: the scene is submitted three times per frame

**Evidence.** `fragmentsEngine.ts:451-452` adds a `RenderPass`; `:453+` adds `N8AOPass`. In `node_modules/n8ao/dist/N8AO.js`, `autoRenderBeauty` defaults to `true` (`:2404`) and the pass does its own `renderer.setRenderTarget(this.beautyRenderTarget); renderer.render(this.scene, this.camera)` (`:2867-2870`), then samples `this.beautyRenderTarget.texture` for `sceneDiffuse` (`:2965`). `readBuffer` is never dereferenced anywhere in the class body. So the `RenderPass` output is **100 % discarded**. Separately, `fragmentsEngine.ts:597-606, 626-635` runs a hand-rolled depth pre-pass whose `needsDepth` gate is true for this project (`outlineEdges: true` **and** `cloudShadowsEnabled: true` in `renderSettings`), allocating `new THREE.MeshDepthMaterial()` **inside the RAF callback** at `:626`. Because `shadowMap.autoUpdate` is true (`:340-342`), each of the three `renderer.render()` calls also re-renders the 4096² directional shadow map.

**Corrected arithmetic.** There is no `setPixelRatio` in `src/`; `composer.setSize` receives CSS-pixel size (`:652`), so the composer RT is ~1920×1080. At HalfFloat RGBA (8 B) + 32-bit depth: 1920×1080×12 = **24.9 MB** per discarded pass, not the 53.4 MB originally claimed. The 4096² PCF shadow target is RGBA8 + 32-bit depth ≈ 134 MB of attachments, but the per-frame clear is hardware fast-cleared, so it is not all real bandwidth. **Defensible statement:** eliminating the `RenderPass` removes **one of three full scene + shadow-map submissions**, i.e. ~⅓ of per-frame draw-call, vertex and shadow work in realistic mode — roughly a **10-18 % frame-time reduction [E]**, ~15 fps → ~17-18 fps. The "6-12 ms / 15→22 fps" figure from the original draft was unmeasured arithmetic and is withdrawn.

**Amplifier.** The custom `world.renderer.update` override (`fragmentsEngine.ts:543-546`) bypasses `SimpleRenderer`'s on-demand early-return (`@thatopen/components/index.mjs:14625-14630`), so in realistic mode this triple render runs on **every rAF frame**, not only while the camera moves.

The `MeshDepthMaterial` sub-claim needs correcting: the program cache key is identical every frame so no GLSL recompile occurs, and the WeakMap-keyed material properties are collectable — real cost is tens of µs/frame plus GC pressure, not a leak. Hoist it anyway; it is a one-line change.

### 4.11 The FIN dashboard is the steady-state bandwidth and CPU sink

`backend/main.py:114-126` splices `cached_power_history` into the payload that `live_loop` rebuilds every 5 s, but that history is only reassigned once per 30 s at `:81` — so 5 of every 6 responses re-ship byte-identical data.

**[M]:** full payload 921,290-980,754 B; one series 30,661-32,634 B; payload with `power_history` popped **1,026-1,343 B** — a **686-956×** over-send. At `live_ms: 5000` (`backend/config.json:6-9`) that is **663-706 MB/hour/tab**. Chrome-side `JSON.parse` 5.7 ms median **[M]**. Server-side is worse than first measured: `get_power_live` (`main.py:502`) declares no `response_model`, so FastAPI routes through `jsonable_encoder` before `json.dumps` — full render **144.5 ms min, 157.7 ms median [M]**, and because the handler is `async def` that is **event-loop-blocking CPU every 5 s per tab**, which also stalls concurrent `.frag` streaming.

Two structural amplifiers on the same path:

- **No compression at all.** `backend/main.py:420-426` registers only `CORSMiddleware`. gzip -6 on the real captured payload: 218,012 → 19,146 B = **8.78 % [M]**. Combined removable traffic ≈ **642 MB/hour/tab [M]**. Must be **path-guarded** — a blanket `GZipMiddleware` would also try to deflate the 284.5 MB `project.json` (14.1 s of CPU for 25 % **[M]**) and the already-compressed `.frag`.
- **The payload grows forever.** The history window start is hardcoded `2026-05-21` in `config.json`, so every series accretes ~424 B/day → **~12.7 KB/day added to every 5 s poll [M/E]**.

**Backend CPU.** `parse_zinc_csv` (`fin_client.py:43-59`) collapses `<< >>` blocks with `processed_text += text[i]` one character at a time, then re-scans every line character-by-character for CSV splitting (`:80-95`). Measured on the two real captured grids (899,167 + 961,951 chars): full `parse_zinc_csv` **1,849 ms [M]**, of which the `<< >>` loop is **1,112 ms [M]** — and both grids contain **zero** `<<` occurrences (`str.count` = 0). The `re.sub` equivalent takes **1.29 ms [M]** (862×) and produces byte-identical output on all three captured grids including `alarms_today.txt`, which does contain 3 genuine blocks. This runs synchronously inside `async def fetch_realtime_data` via `asyncio.to_thread`, which does **not** release the GIL for pure-Python code (`sys.getswitchinterval()` = 0.005 **[M]**): during the 3.9 s parse window, a concurrent 41.4 MB `.frag` download drops from **291.7 MB/s to 4.1 MB/s [M]** on loopback.

### 4.12 Two dashboard lifecycle leaks that compound quadratically

**(a)** `DashboardOverlay.tsx:111-120` tears down by reading `(window as any).Dashboard?.finInterval`. `grep -rn "window\.Dashboard" src/ static/ templates/` finds **only that read** — `window.Dashboard` is never assigned anywhere, in source or in the exported bundle. `static/js/dashboard.js` is a bare IIFE (`:4` → `:3695`) with no export surface and no re-entry guard. So the `clearInterval` never runs, and the `Dashboard.init()` / `DashboardAdmin.init()` calls at `DashboardOverlay.tsx:98-103` have never executed. Removing the `<script class="dt-dashboard-injected">` element at `:114` un-does nothing — script elements are inert once executed. Per toggle, permanently leaked: a 1 Hz `setInterval(tickClock, 1000)` (`:1977`), a 30 s tick, up to 16 `document`/`window` listeners (grep count 16, against 3 `removeEventListener` in the whole file), and the `dashboard-data` handler at `:2967`.

**(b)** `static/js/data-provider.js` is a self-starting IIFE: `state` is captured at `:70`, `stop()` at `:127` clears only *that* closure's timers, `start()` runs unconditionally at `:147`, and `window.DashboardData` is rebound at `:132` — so the previous generation's `stop()` becomes unreachable and its 5 s `pollLive` + 30 s `pollRealtime` run until the tab closes.

**The quadratic term.** Each generation of `dashboard.js` also adds a `dashboard-data` listener, and `renderRightPanel` (`:937-941`) resolves its target with a **live** `document.getElementById('rpContent')` — not a captured node. So every stale generation writes `innerHTML` into the one real right panel. N pollers × N listeners = **N² live-DOM rebuilds per 5 s [E]**. At 5 toggles: 90 req/min forever and 5 forced style+layout passes per second, on a machine simultaneously rendering fragments on an iGPU.

**Scope, honestly:** the exported viewer passes `adminMode={false}` (`ViewerApp.tsx:287`), so `ViewerCanvas.tsx:588` never renders the toggle and only one generation exists there. This is a **studio/admin** defect that scales with session length. Two sub-claims from the original draft are withdrawn as immaterial: 20 leaked `tickClock` timers cost ~0.005 ms/frame, and 320 early-returning listeners cost ~1 ms per *click*, not per frame. `renderModuleOverview` writes into a closure-captured, detached node — memory retention, not layout.

---

## 5. Fix roadmap

### Phase 0 — Quick wins (< 1 day total, low risk, independently shippable)

| # | Item | Files | Gain | Risk |
|---|---|---|---|---|
| 0.1 | Delete the OBC duplicate parse (8 lines) + the `slice(0)` clone; then drop `obcFragments` entirely | `useModelLoader.ts:83-89`, `fragmentsEngine.ts:27, 670-671, 793` | −~10 s parse **[E]**, −270.1 MB **[M]**, worker threads 4→2 | L — but smoke-test picking + spatial tree first (§4.3 proves nothing reads it) |
| 0.2 | Conditional GET on `/project.json`; drop `?t=` + `no-store` | `backend/main.py:722-731`, `ViewerApp.tsx:164` | −22.76 s on every reopen **[M/E]** | L — copy `serve_model:753-762` verbatim |
| 0.3 | Prune dead overrides + missing models from the export meta | `projectDb.ts:306-331` | −209.7 MB / −16.8 s first open **[M]** | L — prune in the exporter only, never in `saveProjectMeta`; log dropped modelIds |
| 0.4 | Module-level texture cache + `dispose()` before reassigning `mat.map` | `useMaterialOverrides.ts:437-445, 63-93` | 14 decodes → 5; ends the per-edit GPU leak | L — key on data URL, clone the Texture when `textureScale` differs |
| 0.5 | Drop the redundant `material-override-updated` dispatch | `MaterialPanel.tsx:121` | Halves work per Apply click | M — verify Apply still lands once; keep the *removed* dispatch at `:130` |
| 0.6 | Slim card record in `cacheHandle`; stop re-reading on the list | `projectDb.ts:16-18`, `useProjectStore.ts:83-115` | −~1.0-1.3 s and −275 MB **per recent project** | L — tolerate all 3 legacy record shapes; rewrite slim on read |
| 0.7 | Pass the already-parsed meta through on click | `ProjectListPage.tsx:62`, `useProjectStore.ts:155-161` | −1.7-3.4 s click→first byte **[M/E]** | L |
| 0.8 | `renderPass.enabled = !ssaoPass.enabled`; hoist the `MeshDepthMaterial` | `fragmentsEngine.ts:159-160, 451-466, 626` | ~10-18 % frame time **[E]** | M — must be a single derived assignment in both places, or the scene goes black |
| 0.9 | `{compression:'STORE'}` for `.frag`/`.glb` zip entries | `projectDb.ts:330, 453` | −2.7 s native / ~7 s main-thread pako **[M]** for 8.9 % size **[M]** | L |
| 0.10 | Split `power_history` out of `/api/fin/power-live`; path-guarded gzip on `/api` + `/assets` | `backend/main.py:114-126, 420`; `data-provider.js:96-118` | −642 MB/hr/tab **[M]** | M — **must not** be blanket gzip (§4.11); 6 dashboard read sites need the new endpoint |
| 0.11 | `re.sub` for `<< >>`; `csv.reader` for the split | `fin_client.py:43-59, 80-95` | −1,112 ms per 30 s cycle **[M]**, 862× **[M]** | M — output verified byte-identical on all 3 captured grids |
| 0.12 | `asyncio.gather` + `Semaphore(8)` for the 30 hisReads | `fin_client.py:694-701` | −29 RTTs/cycle | L — `live_loop` already gathers 37 calls against the same client |
| 0.13 | Rebuild + re-export the bundle | build pipeline; verify `projectDb.ts:348-362` copies current `backend/main.py` | −7.75 s per reopen **[M/E]**; restores sign-in/transfer overlap | M — one full regression pass on the export |
| 0.14 | Bundled worker URL instead of `getWorker()` | `fragmentsEngine.ts:667` | ~0 s, but removes a hard `unpkg.com` dependency and makes the shipped 3.25 MB asset live | L |

**What the user will feel after Phase 0:** reopening an already-visited project is near-instant instead of a 30 s wait. First open of a re-exported bundle drops from ~50 s to ~30 s. Models appear about twice as fast once download finishes. Clicking a project card responds immediately instead of freezing for 2-4 s. Applying a material stops leaking, and the viewer stops getting slower the longer you leave it open.

### Phase 1 — Structural: texture externalisation + migration (~3-4 engineer-days, medium risk)

**This must come first among the structural items** — findings 1, 2, 4, 5, 6, 7, 9 and 16 all collapse or become trivial once it lands.

Target format (v2): overrides carry `textureHash`; a project-level `textures: Record<hash, TextureAsset>` catalogue holds `{hash, src, mime, width, height, sourceWidth, sourceHeight, bytes}`; files live at `<project>/textures/<sha256[:16]>.webp`, re-encoded at 2048 px / WebP q82 with a JPEG q85 fallback and a byte-identical pass-through when the source is already under the cap. `assetsVersion: 2` is emitted **first** so a 4 KB peek detects migration state in constant time.

**Measured targets:**

| | before | after |
|---|---|---|
| `project.json` | 284,545,480 B | **44,996 B** pretty (6,323×) **[M]** |
| textures on disk | 0 (embedded) | **3,166,930 B** (3.02 MiB) **[M]** |
| wire prefix @ 12.5 MB/s | 22.76 s | 0.0036 s + 0.24 s deferred, cacheable-immutable |
| unique decoded pixels | 224,569,856 | **12,139,904** (18.5×) **[M]** |
| RGBA bitmap | 856.7 MiB | **46.3 MiB** (61.7 MiB w/ mips) **[M]** |
| retained heap | ~275 MB | ~0 |
| transient peak | ~850 MB | < 4 MB |

**Migration:** a 3-pass byte scan (locate `"textureDataUrl"` ranges by streaming; extract/dedup/re-encode one texture at a time; byte-splice into `project.json.tmp` then atomic replace). Never `JSON.parse`s the 284 MB file. Prototyped and timed end-to-end on the real file: **11.0 s [M]** server-side (Python + Pillow), peak ~170 MB RSS for the worst texture. A studio-side worker version peaks ~300 MB in a worker heap versus the ~850 MB the *current* code spends on the main thread on every open. Guarded by the `assetsVersion` peek, so it runs once. Pillow-optional degradation: skip re-encode, still externalise the original JPEG bytes — `project.json` still goes to ~45 KB and 97.9 MB of textures become binary and ETag-cacheable.

**Orphan policy: quarantine, do not delete.** Mark `orphanedAt` and exclude from *exports* only. Justification: orphans already cost zero runtime (`useMaterialOverrides.ts:482-494` filters on loaded models); `removeModelEntry` (`useProjectStore.ts:281-308`) deletes a model without touching overrides, so orphaning is an expected transient, not corruption; and concretely, `model-mrn570k9-r8apmz3`'s texture hashes to the same image as a *live* override on `model-mrndfcat-yhvvvgk`, so blind deletion would remove a record and free **zero** unique textures. Fix `removeModelEntry` to prune at delete time instead — with the user present.

**Side effects for free:** `colorSpace = SRGBColorSpace` (currently unset at `useMaterialOverrides.ts:438-445` — a real gamma bug) and `anisotropy = min(8, maxAniso)` (currently 1), so the 2048-capped texture will look **better** at grazing angles than today's uncapped one.

**Risks:** the single `textureScale: 0.001` override drops from 7.95 to 2.05 texels/m (already unusably blurry either way — expose `meta.maxTextureSize` and a per-asset opt-out); `OffscreenCanvas.convertToBlob('image/webp')` is effectively Chromium-only (the studio already requires `showDirectoryPicker`, but the exported viewer runs anywhere — hence per-asset `mime` and the JPEG fallback at 3,768,274 B **[M]**); a crash mid-rewrite must resume from `.tmp` and keep `project.json.v1.bak` for one release; and the byte scan assumes no `"` or backslash in the base64 value — gated by a post-rewrite count assertion that aborts and restores on mismatch.

**What the user will feel:** the exported viewer opens in seconds instead of a minute, with geometry appearing almost immediately instead of after a blank 23 s spinner. The studio project list appears instantly. Saving a material stops freezing the tab. The app stops being an OOM risk on an 8 GB machine.

### Phase 2 — Deeper (1-2 days for the load pipeline; the rest independent)

Depends on Phase 0.1 (single parse) landing first.

| Item | Gain | Effort | Risk |
|---|---|---|---|
| Bounded-concurrency (2) fetch + anchor-first parallel parse, with `AbortController` and `engine.fragments.abort()` | first model 12.3 s → 7.8 s; all-5 23.8 s → 11.6 s (−51 %) **[E]**, against a 7.75 s wire floor **[M]** | M | M — `load()` seeds `baseCoordinates` from whichever model resolves first (`fragments/index.mjs:36285-36298`); **anchor-first sequencing is not optional**, or placement becomes nondeterministic. If `getCoordinates()` proves identical across the set, free fan-out gives ~0.4 s to first geometry |
| Preallocate from `content-length` in `readBodyWithProgress` | −41.4 MB transient **[M]** | trivial | L |
| rAF-coalesce progress updates | ~1,477 React commits **[M]** → ≤60/s | S | L |
| Wire the library's own `onProgress` (`fragments/index.d.ts:2111-2125`) | Real per-stage progress instead of a binary flag | S | L |
| Batch spatial-tree enrichment into one `getItemsData(allIds)`; gate behind expand | 75,099 RPCs **[M]** → 1 | M | L |
| Viewer-only `web-ifc` alias stub + dynamic import in `ifcConverter.ts` | −~4.6 MB eager, −0.9-1.1 s cold start **[E]**, −13.5 MB heap **[M]** | M | M |
| Move `IfcImporter` into a Worker; feed `readCallback` from `FileReaderSync`/`File.slice()` | Returns 384,600 ms **[M]** of frozen UI to the main thread; removes the 1.99 GB JS-side allocation **[M]** | M | M — do **not** bank parallel conversion on an 8 GB box: `file.arrayBuffer()` + web-ifc's WASM copy is ~4 GB for the largest file alone |
| Move ZIP generation into a Worker; stream to `FileSystemWritableFileStream` | −26 s **[M]** of saturated main thread, −~1.3 GB peak **[M]** | L | M — largely moot after Phase 1 (~72 % of the deflate cost is `project.json`) |
| `ProcessPoolExecutor` for zinc parsing | Removes the last event-loop block | M | M — do #0.11 first; it may make this unnecessary |
| `window.Dashboard.destroy()` + idempotent `data-provider.js` | Ends the N² dashboard leak | M | M |

**What the user will feel:** models stream in progressively instead of appearing all at once at the end; the studio stays responsive during IFC import instead of showing Chrome's "page unresponsive" dialog; project export finishes in seconds without freezing; the dashboard can be toggled repeatedly without the app degrading.

---

## Appendix A — Findings killed in verification

Do not re-investigate these.

| Claim | Why it was killed |
|---|---|
| **"All model bytes are read serially and every ArrayBuffer is retained for the session — 460 MB live at once with nothing releasing it."** | The serial read is real (`projectDb.ts:265-277`) and is captured by finding #26. The load-bearing half — retention — is **false**. `FragmentsModels.load` transfers (detaches) the buffer to its worker via the transfer list at `fragments/dist/index.mjs:15839-15843` → `postMessage(input, content)` at `:28601`, so the main-thread `ArrayBuffer` is released by structured-clone transfer, not held. The 460 MB figure is also the *declared* size of 13 models, only 5 of which exist (96.8 MB). |
| **Pretty-printing `project.json` (`JSON.stringify(data, null, 2)`, `projectDb.ts:61`)** | Measured: pretty 284,545,480 chars vs compact 284,538,182 — a **7,298 B / 0.0026 %** difference, because the payload is 15 enormous single-line strings. Compact stringify is also not faster (634 ms vs 586 ms). Do not chase. |
| **`static/static/` (480 KB) is duplicated dead weight** | `templates/index.html:7, 790, 791` references `/static/css/dashboard.css` and `/static/js/{data-provider,dashboard}.js`, which resolve through the `StaticFiles` mount (`backend/main.py:776-777`) to exactly that directory. It is live. |
| **gzip as the fix for `project.json`** | Measured: 213.5-218.6 MB (75-77 %) for 11.3-14.1 s of single-threaded CPU. base64-wrapped JPEG is already-compressed entropy, and gzip's 32 KB window cannot dedupe the 154 MB of identical textures that sit megabytes apart. It is a 25 % saving for a CPU cost that serialises into the same request on a 1-worker uvicorn. |
| **"`serve_project_json` sends no ETag"** | Starlette 1.3.1's `FileResponse.set_stat_headers` **does** auto-emit `etag` and `last-modified`. The actual defect is narrower and the fix is different: `FileResponse.__call__` inspects only `range`/`if-range` and has no `if-none-match` branch at all, so it can never answer 304. Both the client cache-buster **and** an explicit server-side conditional are required. |
| **"The `MeshDepthMaterial` allocated per frame causes shader recompiles and a program leak"** | The program cache key is identical every frame, so `acquireProgram` reuses the cached `WebGLProgram` — no GLSL compile or link. `usedTimes` is never decremented but inflates a counter on one shared program, and the WeakMap-keyed properties entry is collectable. Real cost is tens of µs/frame. Hoist it for tidiness; it is not part of the impact. |
| **"20 leaked `tickClock` timers and 320 leaked listeners cause measurable frame cost"** | `tickClock` is ~5-20 µs → ~0.005 ms/frame at 20 generations. The 320 listeners are early-returning `contains()`/`closest()` checks costing ~1 ms per **click**, not per frame. The dashboard leak is real (§4.12) but its cost is the N² live-DOM rebuilds and the leaked network pollers, not these. |

---

## Appendix B — Measurement method, constants, and assumptions

### Device and network constants (used in every `[E]` figure)

| Constant | Value | Source |
|---|---|---|
| Target LAN | 100 Mbps = **12,500,000 B/s** | brief |
| Target RAM | 8 GB, iGPU sharing system RAM | brief |
| Measurement host | Windows 11, node 24.18.1 (same V8 as Chrome), Python 3.12.10, 16 GB — **faster than target** | this machine |
| Target-vs-host CPU factor | **1.6×** slower (used for all laptop projections) | assumption, stated |
| Full `CREATE_MODEL` ÷ `pako.inflate` | **2×** (conservative end of an observed 2-3× range) | assumption, stated |
| JPEG decode rate | 50-100 Mpx/s on an iGPU laptop | assumption, stated |
| iGPU achievable bandwidth | ~25-30 GB/s (not the 51.2 GB/s theoretical peak) | assumption, stated |
| Chrome per-entry HTTP cache limit | ~1/8 of cache size ≈ 40 MB at default | Simple Cache `kMaxFileRatio` |

### Units

Byte counts are **decimal MB** (10⁶) unless suffixed MiB. Several figures in the source material mixed the two; where a total is quoted it has been recomputed consistently. `224,569,856 px × 4 B = 898,279,424 B = 898 MB = 856.7 MiB` — both forms appear in §4.6 and are the same number.

### How each class of number was produced

- **File sizes** — `stat` on the real files; `zipfile` enumeration for archive contents. All `[M]`.
- **`project.json` composition** — byte scan for `"textureDataUrl"` ranges, base64 decode, SHA-256 for dedup, JPEG SOF marker parse for dimensions, and `JSON.stringify` of the object with `materialOverrides` removed for the remainder. All `[M]`. The remainder figure varies 32,367-43,634 B across harnesses depending on whether the embedded `thumbnail` data URL (18,871 chars) and pretty-printing are counted; **32,367 B compact excluding thumbnail** is the figure used, and the conclusion is unchanged at any of them.
- **Parse/stringify/clone timings** — node 24 with the real file, minimum or median of 3+ runs, warm cache. `readFileSync` 141-182 ms, UTF-8 decode 99-144 ms, `JSON.parse` 258-343 ms, `JSON.stringify(…, null, 2)` 480-695 ms, `structuredClone` 239-420 ms. The spread across harnesses is real and reported as a range rather than a single figure. All `[M]`.
- **Memory** — `process.memoryUsage()` RSS and `heapUsed` around each step, plus `--expose-gc` for retention. `[M]`, but Node-measured: Chrome's incremental `Response.json()` decode means the transient peak is a **range** (~550-850 MB), not the firm Node figure (854 MB). Stated as such in §4.2.
- **`.frag` inflation** — `pako.inflate` and node `zlib` over the 5 real files. `[M]`.
- **Texture pixel counts** — JPEG SOF0 headers read directly out of the base64 payloads. `[M]`. RGBA and mipmap figures are `px × 4` and `× 4/3` — `[E]` in the sense that they are arithmetic, but on measured inputs.
- **Backend timings** — `parse_zinc_csv`, `jsonable_encoder`/`json.dumps`, and gzip ratios run against the real captured FIN grids in `docs/` (`point+or+cmd+or+sensor+or+rule+or+diag.txt`, `equip+points.txt`, `alarms_today.txt`) and `MarsaAlArab/.../power_live.json`. All `[M]`. The GIL-contention figure (291.7 → 4.1 MB/s) was measured cross-process on loopback and is a *loopback* number; on a 100 Mbps LAN the client is clamped to 12.5 MB/s, so the real-world effect is ~32.7 MB of starved transfer per 3.9 s parse window — **that** is the figure to quote.
- **IFC conversion times** — read directly from `conversionTimeMs` and `originalFileSizeBytes` recorded in `docs/Marsa_project/backend/project.json` `models[]`. `[M]` — these are real production runs, not synthetic.
- **ZIP export** — jszip 3.10.1 (the repo's own copy) driven against the real artifacts. 20.9-25.5 s, 1.32-1.49 GB peak RSS. `[M]`.
- **Bundle composition** — esbuild differential (`--external:web-ifc`) plus byte-offset token probes in the shipped chunk. web-ifc's share of `thatopen-CPOaZ7o8.js` is bounded between **4.26 MB and 5.93 MB**, with **~4.6-5.2 MB** the defensible point estimate. `[M]` with a stated bound.

### Things stated as uncertain, on purpose

1. **The on-disk export is a partial extraction** — but the missing-model fact is verified against `docs/Marsa_project (3).zip` itself (5 `.frag` entries), not only the extracted folder. Every model-set-dependent number is given for both the shipped 5 and the declared 13.
2. **Frame-time figures for §4.10** are structural (one of three submissions removed) rather than profiled. No GPU profiler run was performed; the "6-12 ms/frame" and "15→22 fps" numbers from the original draft were unmeasured and are withdrawn.
3. **The 2× `CREATE_MODEL` multiplier** in §4.3 is an assumption. The measured floor is the inflate time (3,204 ms desktop for one pass). If the true multiplier is 3×, both the before and after figures scale together and the ~50 % reduction holds; absolute seconds shift.
4. **"OOM/tab-crash"** is described as *plausible*, not certain, everywhere it appears. An 850 MB transient in a Chrome renderer is survivable on 8 GB in isolation (much of it is PartitionAlloc/external rather than V8 heap); combined with 96.8-460 MB of `.frag` ArrayBuffers and iGPU shared texture memory it is a real risk, but probabilistic.
5. **Multi-project studio figures** (e.g. "3 recents = 855 MB retained") are extrapolation — only one 284 MB project exists in evidence. The single-project case (275.5 MB retained, 854 MB peak) already clears the bar and is the figure quoted.

---

## 6. Implementation results

Implemented on `perf/audit-fixes`, 16 commits from `fba7995`, 18 files, +929/−331.
Every number below is **measured on this machine against the real evidence** (a copy of
`docs/Marsa_project/`, never the original — its SHA-256 is unchanged), not carried over from §3-§5.
Gate at every commit: `npm run build` clean, and `npm run lint` **229 problems at baseline → 216 now**.

### 6.1 Phase 0 — all 14 items landed

| # | Predicted | Measured | Verdict |
|---|---|---|---|
| 0.1 | −270.1 MB, −~10 s parse | 96,825,739 B → 270,111,944 B inflated per pass, duplicated. Per-file inflate sizes match §4.3 exactly | as predicted |
| 0.2 | −22.76 s per reopen | 304 + zero-byte body on matched ETag, verified against the real ASGI app | as predicted |
| 0.3 | −209.7 MB / −16.8 s | 284,545,480 → 74,863,417 B; 13 models → 5, 15 overrides → 1 | exact |
| 0.4 | 14 decodes → 5 | 5 unique of 14; 224,569,856 → 92,725,120 px of decode | exact |
| 0.5 | halves work per Apply | one application per Apply instead of two | as predicted |
| 0.6 | −1.0-1.3 s, −275 MB per project | IDB record 284,557,077 → 19,010 B (14,969×); 1,455 ms parse removed per project per list mount | better than predicted |
| 0.7 | −1.7-3.4 s click→first byte | **subsumed by 0.6** — see 6.3 | reframed |
| 0.8 | ~10-18 % frame time | one of three scene submissions removed; `readBuffer` confirmed to appear once in n8ao, in the signature only, never dereferenced | structural claim confirmed; not profiled |
| 0.9 | −2.7 s native / ~7 s pako for 8.9 % | 11,582 → 492 ms (23.5×) for +8.96 % bytes, jszip 3.10.1 on the real 96.8 MB | size exact, saving larger |
| 0.10 | −642 MB/hr/tab | 246,700 → 2,351 B per 5 s poll (105×); 177.6 → 27.6 MB/hr, 2.5 MB gzipped | ratio holds, absolute smaller — see 6.3 |
| 0.11 | 862× on the `<< >>` collapse | 688 ms → 0.78 ms (~880×), byte-identical on 20,021 adversarial/fuzz cases + all 3 real grids | as predicted; second half rejected — see 6.3 |
| 0.12 | −29 RTTs/cycle | 1.50 s → 0.24 s (6.2×) at 30 endpoints / 50 ms RTT, peak concurrency exactly 8, key order preserved | as predicted |
| 0.13 | −7.75 s per reopen | export made loud; bundle rebuilt and verified free of all four §4.8 symptoms | partially — see 6.3 |
| 0.14 | ~0 s, removes unpkg dependency | `getWorker()` no longer called; library's own bundled-worker fallback is the only reference | as predicted |

### 6.2 Phase 1 — texture externalisation landed

Migrated a copy of the real exported project and served it through the actual backend:

| | before | predicted | **measured** |
|---|---|---|---|
| `project.json` | 284,545,480 B | 44,996 B | **45,166 B** |
| textures on disk | 0 (embedded) | 3,166,930 B | **3,166,930 B** (exact) |
| unique decoded pixels | 224,569,856 | 12,139,904 | **12,139,904** (exact) |
| RGBA bitmap | 856.7 MiB | 46.3 MiB | **46.3 MiB** (61.7 MiB w/ mips) |
| wire prefix @ 12.5 MB/s | 22.76 s | 0.0036 s | **0.0036 s** + 0.25 s deferred, immutable |
| migration wall-clock | — | 11.0 s | **7.9 s** |

The migration byte-splices and never `JSON.parse`s the 284 MB file. Verified: idempotent under the
`assetsVersion` peek, discards a stale `.tmp`, keeps `project.json.v1.bak`, and **fault-injected on four
failure paths — in every one the original is byte-identical, no `.tmp` survives, and no `.bak` is written.**
Note the JSON-validity assertion fires before the count assertion, so the count check is a secondary guard.

Also fixed en route: a **path traversal** in `serve_model` that the new `/textures` route inherited by
copying its guard — `os.path.join(base, "..\x")` still *string*-starts-with `base` on Windows. Both routes
now resolve and compare real paths. Reachable only by a client that does not normalise `../`.

### 6.3 Where reality differed from the audit, and what was not done

- **0.11, second half rejected.** `csv.reader` is *not* equivalent: Zinc quotes with backslash escapes, not
  doubled quotes, and the existing splitter deliberately keeps the quote characters for the caller to strip.
  It is also not the hot path — measured **1.0×**, because ~99 % of rows contain quotes. The `<< >>` collapse
  was the entire win. A plain `re.sub` was also rejected: the original emits a placeholder for a *nested* `<<`
  and drops the tail of an unterminated one, which `<<.*?>>` does not reproduce.
- **0.7 was largely subsumed by 0.6.** Once the list stops parsing `project.json`, the read on click is the
  only one rather than a redundant second, and the `cacheHandle` write it blocked on is 19 KB. What remained
  was a real defect — clicking a card whose folder had moved failed silently — and that is what 0.7 fixes.
- **0.10's absolute saving is smaller than predicted.** The audit measured a 921-981 KB payload; the capture
  available here (`MarsaAlArab/UnrealIPC/power_live.json`) is 246,700 B, so the per-hour figure is 177.6 MB,
  not 663-706 MB. The 105× ratio and the structure of the fix are unchanged.
- **0.13 is not a re-export.** Producing the ZIP needs `showDirectoryPicker` and a click in the studio UI.
  `dist/` is rebuilt and verified; the export itself remains an operator step, now impossible to ship broken.
- **The 284 MB → 45 KB gain is not automatic.** `backend/migrate_textures.py` is an explicit operator tool
  (`python migrate_textures.py <project-dir>`). It is deliberately **not** run at server startup: it rewrites
  a 284 MB file in place, and doing that unattended on someone's project is not a decision this change should
  make for them. Existing studio projects likewise stay v1 until it is run against their folder; new textures
  are written as v2 from now on, and the read path still accepts v1 `textureDataUrl`.
- **0.8 is a structural claim, not a profiled one.** One of three submissions is provably removed; no GPU
  profiler was run, so the 10-18 % figure remains `[E]`, as the audit itself stated.
- **0.14 is not runtime-verified in a browser.** Evidence is the library's documented fallback plus the
  emitted asset reference and MIME check.
- **Phase 2: six of ten rows landed, one was made unnecessary, three did not.**

  | Phase 2 row | Outcome |
  |---|---|
  | Bounded-concurrency fetch + anchor-first commit | **landed** — downloads overlap two at a time, models reach the store in declared order so the `baseCoordinates` anchor is unchanged. 1.39x on simulated timings; verified against the adversarial case where the first model is slowest |
  | `readBodyWithProgress` preallocation | **landed** — removes the second full copy (41.4 MB on the largest model). The first attempt corrupted an under-declared `content-length`; its own test caught that |
  | rAF-coalesce progress | **landed** — 1,402 `updateEntry` calls collapse to 26 commits (54x); terminal phases bypass the queue so a backgrounded tab still finishes |
  | Wire the library's `onProgress` | **landed** — real parse percentage instead of a hardcoded 75% |
  | Batch spatial-tree enrichment | **landed** — 9,331 nodes go from 9,331 worker round trips to 1, with an identical tree |
  | `window.Dashboard.destroy()` + idempotent `data-provider` | **landed** — five injections leave 2 live pollers rather than 10 |
  | `ProcessPoolExecutor` for zinc parsing | **not needed after 0.11.** `parse_zinc_csv` over all three real grids is now **417 ms per 30 s cycle — 1.39% of it**, down from the audit's 1,849 ms. Moving that to a process pool means pickling ~1.9 MB of text out and ~2,000 row dicts back every cycle, which plausibly costs more than it saves. The audit anticipated this: *"do #0.11 first; it may make this unnecessary"* |
  | Viewer-only `web-ifc` alias stub | **not done.** `@thatopen/fragments/dist/index.mjs:40` does `import * as WEBIFC from "web-ifc"` at the top level, and both entries import that package, so excluding it from the viewer needs a per-entry alias — i.e. splitting the single two-entry Vite build in two. That build is what produces `dist/viewer-assets.json`, which the whole export pipeline consumes, and the export cannot be regression-tested without driving the studio UI |
  | Move `IfcImporter` into a Worker | **not done.** The largest remaining item; needs a browser to validate meaningfully |
  | Move ZIP generation into a Worker | **not done.** Largely moot after Phase 1 — the audit's own estimate is that ~72% of the deflate cost was `project.json`, which is now 45 KB, and 0.9 already took the model entries off DEFLATE |

- **0.8 is a structural claim, not a profiled one.** One of three submissions is provably removed; no GPU
  profiler was run, so the 10-18 % figure remains `[E]`, as the audit itself stated.
- **0.14 is not runtime-verified in a browser.** Evidence is the library's documented fallback plus the
  emitted asset reference and MIME check.
- **Phase 2 is two items of nine.** `readBodyWithProgress` preallocation landed: the response now
  streams into a buffer sized from `content-length`, removing the second full copy (41.4 MB on the largest
  Marsa model). An over-declared, under-declared, absent or zero `content-length` all still round-trip
  byte-for-byte — the first version of this change silently corrupted the under-declared case, which its
  own test caught. rAF-coalesced progress also landed: **1,402 `updateEntry` calls collapse to 26 store
  commits (54x)**, with terminal phases bypassing the queue so a backgrounded tab still finishes.
  **Not done:** anchor-first parallel loading, batched spatial tree, the `web-ifc` alias split, the IFC worker, the ZIP worker, `ProcessPoolExecutor`, and the
  dashboard lifecycle fix. The load-pipeline item is the significant one — it is where the audit's
  "first model 12.3 s -> 7.8 s" lives, and it carries the `baseCoordinates` anchor-first constraint that
  makes it the riskiest remaining change.

### 6.4 Review

Every commit was gated on build + lint. Item 0.1 and the full Phase 0 diff were reviewed by independent
agents prompted to refute. Findings that survived and were fixed:

- **0.1 left dead code.** With `FragmentsManager.init()` gone, `SimpleRaycaster.castRay` short-circuits on
  `fragments.initialized`, making the entire `OBC.Raycasters` block in `handleCanvasClick` unreachable, along
  with an `OBC.Hider` arm whose `FragmentsManager.core` getter now throws. Both removed. This also means 0.1
  removes a wasted `getFullPick` scissor render on **every click**, which the audit did not claim.
- **0.5 broke GLB material overrides** — the dispatch it deleted was the only caller of `applyOverride`'s
  GLB branch. The effect now drives from the loaded model list and `model-loaded` fires for GLB, so GLB
  overrides also apply on load, which never worked before.
- **0.6 left the project list stale** — five actions refreshed the in-memory card without persisting it, and
  the oldest bare-handle cache shape was being deleted rather than recovered. Both fixed.
- **0.13's throw reached no UI** — both exporters now surface the message.

