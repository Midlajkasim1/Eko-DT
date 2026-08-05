"""Externalise embedded material textures from project.json into content-hashed sidecars.

v1 stores every override texture as a base64 data URL inside project.json, which makes the
file hundreds of MB and blocks the viewer's first byte of geometry. v2 replaces each
`textureDataUrl` with a `textureHash` and moves the bytes to `textures/<hash>.<ext>`.

The rewrite is a byte splice: project.json is never parsed while it is still huge.
"""
from __future__ import annotations

import base64
import hashlib
import json
import os
import shutil
import sys
import time

ASSETS_VERSION = 2
MAX_TEXTURE_SIZE = 2048
WEBP_QUALITY = 82
JPEG_QUALITY = 85
PEEK_BYTES = 4096

_KEY = b'"textureDataUrl"'


def _peek_assets_version(path: str) -> int:
    with open(path, "rb") as fh:
        head = fh.read(PEEK_BYTES)
    marker = b'"assetsVersion"'
    at = head.find(marker)
    if at == -1:
        return 1
    digits = b""
    for byte in head[at + len(marker):]:
        char = bytes([byte])
        if char.isdigit():
            digits += char
        elif digits:
            break
    return int(digits) if digits else 1


def _find_texture_spans(buf: bytes) -> list[tuple[int, int, int]]:
    """Locate each `"textureDataUrl": "..."` as (key_start, value_start, value_end)."""
    spans = []
    at = 0
    while True:
        key = buf.find(_KEY, at)
        if key == -1:
            break
        i = key + len(_KEY)
        while i < len(buf) and buf[i] in b" \t\r\n:":
            i += 1
        if i >= len(buf) or buf[i] != 0x22:
            at = key + len(_KEY)
            continue
        start = i + 1
        end = buf.index(b'"', start)
        spans.append((key, start, end))
        at = end
    return spans


def _decode_data_url(value: bytes) -> tuple[str, bytes] | None:
    if not value.startswith(b"data:"):
        return None
    comma = value.find(b",")
    if comma == -1:
        return None
    header = value[5:comma]
    if not header.endswith(b";base64"):
        return None
    mime = header[: -len(b";base64")].decode("ascii", "replace")
    return mime, base64.b64decode(value[comma + 1:])


def _reencode(raw: bytes, mime: str) -> tuple[bytes, str, str, int, int, int, int]:
    """Return (bytes, mime, ext, width, height, source_width, source_height)."""
    try:
        import io

        from PIL import Image
    except ImportError:
        return raw, mime, _ext_for(mime), 0, 0, 0, 0

    try:
        with Image.open(io.BytesIO(raw)) as img:
            img.load()
            source_w, source_h = img.size
            if img.mode not in ("RGB", "RGBA"):
                img = img.convert("RGBA" if "A" in img.getbands() else "RGB")
            if max(img.size) > MAX_TEXTURE_SIZE:
                img.thumbnail((MAX_TEXTURE_SIZE, MAX_TEXTURE_SIZE), Image.LANCZOS)
            out = io.BytesIO()
            img.save(out, format="WEBP", quality=WEBP_QUALITY, method=4)
            encoded = out.getvalue()
            if len(encoded) >= len(raw) and img.size == (source_w, source_h):
                return raw, mime, _ext_for(mime), source_w, source_h, source_w, source_h
            return encoded, "image/webp", "webp", img.width, img.height, source_w, source_h
    except Exception as exc:
        print(f"  ! re-encode failed ({exc}); storing original bytes")
        return raw, mime, _ext_for(mime), 0, 0, 0, 0


def _ext_for(mime: str) -> str:
    return {
        "image/jpeg": "jpg",
        "image/jpg": "jpg",
        "image/png": "png",
        "image/webp": "webp",
    }.get(mime, "bin")


def migrate(project_dir: str, *, force: bool = False) -> int:
    project_json = os.path.join(project_dir, "project.json")
    if not os.path.exists(project_json):
        print(f"No project.json in {project_dir}")
        return 1

    version = _peek_assets_version(project_json)
    if version >= ASSETS_VERSION and not force:
        print(f"Already at assetsVersion {version} — nothing to do.")
        return 0

    textures_dir = os.path.join(project_dir, "textures")
    tmp_path = project_json + ".tmp"
    bak_path = project_json + ".v1.bak"

    if os.path.exists(tmp_path):
        print(f"Discarding {os.path.basename(tmp_path)} from an interrupted run.")
        os.remove(tmp_path)

    started = time.perf_counter()
    before_bytes = os.path.getsize(project_json)
    with open(project_json, "rb") as fh:
        buf = fh.read()

    spans = _find_texture_spans(buf)
    print(f"project.json {before_bytes:,} B — {len(spans)} textureDataUrl values")
    if not spans:
        print("Nothing to externalise.")
        return 0

    os.makedirs(textures_dir, exist_ok=True)
    catalogue: dict[str, dict] = {}
    replacements: list[tuple[int, int, bytes]] = []
    texture_bytes = 0
    hashed_expected = 0

    for key_start, value_start, value_end in spans:
        value = buf[value_start:value_end]
        if not value:
            replacements.append((key_start, value_end + 1, b'"textureHash": ""'))
            continue

        decoded = _decode_data_url(value)
        if decoded is None:
            print(f"  ! not a data URL at offset {value_start}; leaving in place")
            continue

        mime, raw = decoded
        digest = hashlib.sha256(raw).hexdigest()[:16]
        if digest not in catalogue:
            data, out_mime, ext, w, h, sw, sh = _reencode(raw, mime)
            name = f"{digest}.{ext}"
            with open(os.path.join(textures_dir, name), "wb") as fh:
                fh.write(data)
            texture_bytes += len(data)
            catalogue[digest] = {
                "hash": digest,
                "src": f"textures/{name}",
                "mime": out_mime,
                "width": w,
                "height": h,
                "sourceWidth": sw,
                "sourceHeight": sh,
                "bytes": len(data),
            }
            print(f"  {digest} {sw}x{sh} -> {w}x{h}  {len(raw):,} B -> {len(data):,} B")
        replacements.append(
            (key_start, value_end + 1, f'"textureHash": "{digest}"'.encode())
        )
        hashed_expected += 1

    catalogue_json = json.dumps(catalogue, indent=2).replace("\n", "\n  ")
    prefix = (
        b'{\n  "assetsVersion": '
        + str(ASSETS_VERSION).encode()
        + b',\n  "textures": '
        + catalogue_json.encode()
        + b","
    )

    brace = buf.index(b"{")
    with open(tmp_path, "wb") as out:
        out.write(prefix)
        cursor = brace + 1
        for key_start, after_value, payload in replacements:
            out.write(buf[cursor:key_start])
            out.write(payload)
            cursor = after_value
        out.write(buf[cursor:])

    with open(tmp_path, "rb") as fh:
        rewritten = fh.read()
    try:
        parsed = json.loads(rewritten)
    except json.JSONDecodeError as exc:
        os.remove(tmp_path)
        print(f"ABORT: rewritten project.json is not valid JSON ({exc}). Original untouched.")
        return 2

    overrides = parsed.get("materialOverrides") or {}
    hashed = sum(1 for o in overrides.values() if o.get("textureHash"))
    if hashed != hashed_expected:
        os.remove(tmp_path)
        print(
            f"ABORT: expected {hashed_expected} textureHash entries, found {hashed}. "
            "Original untouched."
        )
        return 3
    if parsed.get("assetsVersion") != ASSETS_VERSION:
        os.remove(tmp_path)
        print("ABORT: assetsVersion missing from rewritten file. Original untouched.")
        return 4

    if not os.path.exists(bak_path):
        shutil.copy2(project_json, bak_path)
    os.replace(tmp_path, project_json)

    after_bytes = os.path.getsize(project_json)
    elapsed = time.perf_counter() - started
    print(
        f"\nproject.json {before_bytes:,} B -> {after_bytes:,} B "
        f"({before_bytes / after_bytes:,.0f}x smaller)"
    )
    print(f"textures/    {texture_bytes:,} B across {len(catalogue)} files")
    print(f"backup       {os.path.basename(bak_path)}")
    print(f"elapsed      {elapsed:.1f} s")
    return 0


if __name__ == "__main__":
    target = sys.argv[1] if len(sys.argv) > 1 else "."
    sys.exit(migrate(target, force="--force" in sys.argv))
