"""FastAPI entry point. Serves the HTML tool and provides API endpoints for config, state, snapshots, LLM proxy, LDA, and Excel parsing."""
from __future__ import annotations

import mimetypes
from pathlib import Path
from typing import Any

# Some machines (notably Windows) don't register the woff2 MIME type; without
# it StaticFiles serves the font as application/octet-stream and browsers refuse it.
mimetypes.add_type("font/woff2", ".woff2")

from fastapi import FastAPI, File, HTTPException, Query, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field

from config import load_config, public_config, save_config
from doc_extract import extract_document
from excel_parser import parse_spreadsheet
from lda import run_lda
from llm_proxy import proxy_llm
from llm_validate import validate_llm_request
from storage import (
    create_snapshot,
    delete_snapshot,
    list_snapshots,
    load_snapshot,
    load_state,
    remove_legacy_auto_snapshots,
    rename_snapshot,
    restore_snapshot,
    save_state,
)

ROOT = Path(__file__).resolve().parent.parent
HTML_FILE = ROOT / "docs" / "global-brand-building.html"
# project_id becomes a directory name under server/data; only safe basenames
# are allowed (same contract as storage._PROJECT_ID_RE).
PROJECT_ID_PATTERN = r"^[A-Za-z0-9][A-Za-z0-9._-]{0,63}$"

app = FastAPI(title="Global Brand Building and Marketing Communication", version="0.2.0")

# The HTML is opened from disk or served at / — allow both via permissive CORS.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# One-time migration: the auto-snapshot feature was removed; delete legacy
# auto_*.json files (idempotent, runs once per process start).
remove_legacy_auto_snapshots()


# ---------------------------------------------------------------------------
# Request / Response models
# ---------------------------------------------------------------------------

class LdaRequest(BaseModel):
    documents: list[str]
    k: int = 5
    passes: int = 15
    iterations: int = 100
    no_below: int = 2
    no_above: float = 0.5
    language: str = "zh"


class ConfigUpdate(BaseModel):
    provider: str = "deepseek"
    baseUrl: str = ""
    model: str = ""
    apiKey: str | None = None  # None or "********" means keep existing
    temperature: float = 1.0
    backendUrl: str = ""


class LlmRequest(BaseModel):
    messages: list[dict[str, Any]]
    opts: dict[str, Any] | None = None
    profile: dict[str, Any] | None = None  # reserved for multi-model profiles


class SnapshotCreate(BaseModel):
    project_id: str = Field(default="default", pattern=PROJECT_ID_PATTERN)
    name: str | None = None
    overwrite: bool = False  # True = replace same-named version (user confirmed)


class SnapshotRename(BaseModel):
    name: str
    overwrite: bool = False


class StateSave(BaseModel):
    project_id: str = Field(default="default", pattern=PROJECT_ID_PATTERN)
    state: dict[str, Any]


# ---------------------------------------------------------------------------
# Health
# ---------------------------------------------------------------------------

@app.get("/api/health")
def health() -> dict:
    return {"status": "ok", "version": "0.2.0"}


# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

@app.get("/api/config")
def get_config() -> dict:
    """Return config without exposing the API key."""
    return public_config()


@app.put("/api/config")
def update_config(cfg: ConfigUpdate) -> dict:
    """Save config to config.yaml + .env."""
    data = cfg.model_dump()
    # If apiKey is None or masked, don't update the key
    if data.get("apiKey") in (None, "", "********"):
        data.pop("apiKey", None)
    merged = save_config(data)
    merged.pop("apiKey", None)
    merged["apiKeyExists"] = bool(load_config().get("apiKey"))
    return merged


# ---------------------------------------------------------------------------
# LLM Proxy
# ---------------------------------------------------------------------------

@app.post("/api/llm")
async def llm_endpoint(req: LlmRequest) -> JSONResponse:
    ok, errors = validate_llm_request(req.model_dump())
    if not ok:
        raise HTTPException(status_code=400, detail="; ".join(errors))
    status, data = await proxy_llm(req.messages, req.opts, req.profile)
    return JSONResponse(status_code=status, content=data)


# ---------------------------------------------------------------------------
# Project state persistence
# ---------------------------------------------------------------------------

@app.get("/api/state")
def get_state(project_id: str = Query("default", pattern=PROJECT_ID_PATTERN)) -> dict | None:
    state = load_state(project_id)
    if state is None:
        raise HTTPException(status_code=404, detail="No saved state")
    return state


@app.put("/api/state")
@app.post("/api/state")  # POST alias for navigator.sendBeacon on page unload
def put_state(body: StateSave) -> dict:
    save_state(body.project_id, body.state)
    return {"ok": True}


# ---------------------------------------------------------------------------
# Snapshots
# ---------------------------------------------------------------------------

@app.get("/api/snapshots")
def get_snapshots(project_id: str = Query("default", pattern=PROJECT_ID_PATTERN)) -> list[dict]:
    return list_snapshots(project_id)


@app.post("/api/snapshots")
def post_snapshot(body: SnapshotCreate) -> dict:
    try:
        snap = create_snapshot(body.project_id, name=body.name, overwrite=body.overwrite)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    return snap


@app.get("/api/snapshots/{snapshot_id}")
def get_snapshot(snapshot_id: str, project_id: str = Query("default", pattern=PROJECT_ID_PATTERN)) -> dict:
    data = load_snapshot(project_id, snapshot_id)
    if data is None:
        raise HTTPException(status_code=404, detail="Snapshot not found")
    return data


@app.post("/api/snapshots/{snapshot_id}/restore")
def restore_snapshot_endpoint(snapshot_id: str, project_id: str = Query("default", pattern=PROJECT_ID_PATTERN)) -> dict:
    data = restore_snapshot(project_id, snapshot_id)
    if data is None:
        raise HTTPException(status_code=404, detail="Snapshot not found")
    return {"ok": True, "state": data}


@app.delete("/api/snapshots/{snapshot_id}")
def delete_snapshot_endpoint(snapshot_id: str, project_id: str = Query("default", pattern=PROJECT_ID_PATTERN)) -> dict:
    if not delete_snapshot(project_id, snapshot_id):
        raise HTTPException(status_code=404, detail="Snapshot not found")
    return {"ok": True}


@app.post("/api/snapshots/{snapshot_id}/rename")
def rename_snapshot_endpoint(snapshot_id: str, body: SnapshotRename, project_id: str = Query("default", pattern=PROJECT_ID_PATTERN)) -> dict:
    try:
        snap = rename_snapshot(project_id, snapshot_id, body.name, overwrite=body.overwrite)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    if snap is None:
        raise HTTPException(status_code=404, detail="Snapshot not found")
    return snap


# ---------------------------------------------------------------------------
# LDA
# ---------------------------------------------------------------------------

@app.post("/api/lda")
def lda_endpoint(req: LdaRequest) -> dict:
    if not req.documents:
        raise HTTPException(status_code=400, detail="documents is empty")
    k = max(2, min(15, req.k))
    return run_lda(
        documents=req.documents,
        k=k,
        passes=req.passes,
        iterations=req.iterations,
        no_below=req.no_below,
        no_above=req.no_above,
        language=req.language,
    )


# ---------------------------------------------------------------------------
# Excel parsing
# ---------------------------------------------------------------------------

@app.post("/api/parse-excel")
async def parse_excel_endpoint(file: UploadFile = File(...)) -> dict:
    data = await file.read()
    if len(data) > 20 * 1024 * 1024:
        raise HTTPException(status_code=413, detail="file too large (max 20MB)")
    result = parse_spreadsheet(file.filename or "upload.xlsx", data)
    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])
    return result


@app.post("/api/extract-doc")
async def extract_doc_endpoint(file: UploadFile = File(...)) -> dict:
    """Extract plain text from an uploaded context file (txt/md/csv/docx/pdf).

    Used by the global file drawer so users can feed their own documents
    (research notes, reports, transcripts) into AI prompts. 5MB per file.
    """
    data = await file.read()
    if len(data) > 5 * 1024 * 1024:
        raise HTTPException(status_code=413, detail="文件过大（单文件上限 5MB）")
    result = extract_document(file.filename or "upload.txt", data)
    if not result.get("ok"):
        raise HTTPException(status_code=400, detail=result.get("error", "解析失败"))
    return result


# ---------------------------------------------------------------------------
# Static files
# ---------------------------------------------------------------------------

@app.get("/")
def index() -> FileResponse:
    if not HTML_FILE.exists():
        raise HTTPException(status_code=404, detail="HTML file not found")
    return FileResponse(HTML_FILE, media_type="text/html",
                        headers={"Cache-Control": "no-cache, no-store, must-revalidate"})


# Serve workshop JS modules and demo data from docs/.
# The HTML references them by bare filename (same-origin), so serve them at root.
DOCS_DIR = ROOT / "docs"
if DOCS_DIR.exists():
    app.mount("/docs", StaticFiles(directory=str(DOCS_DIR)), name="docs")
    FONTS_DIR = DOCS_DIR / "fonts"
    if FONTS_DIR.exists():
        app.mount("/fonts", StaticFiles(directory=str(FONTS_DIR)), name="fonts")

    @app.get("/{filename}")
    def docs_file(filename: str) -> FileResponse:
        candidate = DOCS_DIR / filename
        if candidate.is_file() and filename.endswith((".js", ".css", ".png", ".jpg", ".svg", ".ico", ".json", ".html")):
            media = "text/javascript" if filename.endswith(".js") else None
            return FileResponse(str(candidate), media_type=media,
                                headers={"Cache-Control": "no-cache, no-store, must-revalidate"})
        raise HTTPException(status_code=404, detail="not found")

    # Nested lib/ scripts (e.g. lib/demo_notes.js) — the single-segment route
    # above cannot match a slash, so serve them explicitly.
    @app.get("/lib/{filename}")
    def lib_file(filename: str) -> FileResponse:
        candidate = DOCS_DIR / "lib" / filename
        if candidate.is_file() and filename.endswith((".js", ".css")):
            media = "text/javascript" if filename.endswith(".js") else None
            return FileResponse(str(candidate), media_type=media,
                                headers={"Cache-Control": "no-cache, no-store, must-revalidate"})
        raise HTTPException(status_code=404, detail="not found")

    # Nested cases/ scripts (e.g. cases/douya-mama/work1.js) — demo case data.
    @app.get("/cases/{filename}")
    def cases_root_file(filename: str) -> FileResponse:
        import re
        if not re.fullmatch(r"[a-zA-Z0-9\-_]+\.\w+", filename):
            raise HTTPException(status_code=404, detail="not found")
        candidate = DOCS_DIR / "cases" / filename
        if candidate.is_file() and filename.endswith((".js", ".css")):
            media = "text/javascript" if filename.endswith(".js") else None
            return FileResponse(str(candidate), media_type=media,
                                headers={"Cache-Control": "no-cache, no-store, must-revalidate"})
        raise HTTPException(status_code=404, detail="not found")

    @app.get("/cases/{brand}/{filename}")
    def case_file(brand: str, filename: str) -> FileResponse:
        import re
        if not re.fullmatch(r"[a-zA-Z0-9\-_]+", brand) or not re.fullmatch(r"[a-zA-Z0-9\-_]+\.\w+", filename):
            raise HTTPException(status_code=404, detail="not found")
        candidate = DOCS_DIR / "cases" / brand / filename
        if candidate.is_file() and filename.endswith((".js", ".css")):
            media = "text/javascript" if filename.endswith(".js") else None
            return FileResponse(str(candidate), media_type=media,
                                headers={"Cache-Control": "no-cache, no-store, must-revalidate"})
        raise HTTPException(status_code=404, detail="not found")


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="127.0.0.1", port=8765)
