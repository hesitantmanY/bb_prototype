"""Security regression tests (no third-party test framework).

Covers the trust boundaries that matter for this local FastAPI service:
  1. project_id / snapshot_id must never escape server/data (path traversal);
  2. the API key is stored in .env only, never returned by /api/config and
     never written into config.yaml;
  3. upload endpoints enforce their documented size limits;
  4. /api/config exposes only apiKeyExists.

Run: server/.venv/bin/python server/test_security.py
"""
from __future__ import annotations

from pathlib import Path
from tempfile import TemporaryDirectory
from unittest.mock import patch

import config as config_module
import storage
from app import app
from fastapi.testclient import TestClient


client = TestClient(app)
passed = 0
failed = 0


def ok(name: str, cond: bool, detail: str = "") -> None:
    global passed, failed
    if cond:
        passed += 1
        print(f"PASS {name}")
    else:
        failed += 1
        print(f"FAIL {name}" + (f" — {detail}" if detail else ""))


def test_project_id_cannot_escape_data_dir() -> None:
    for bad in ("../escape", "../../escape", "/tmp/abs", "a/b", "..", ".", "", "x" * 65):
        try:
            storage._project_dir(bad)
            ok(f"project_id {bad!r} rejected", False)
        except ValueError:
            ok(f"project_id {bad!r} rejected", True)

    with TemporaryDirectory() as d:
        base = Path(d) / "data"
        with patch.object(storage, "DATA_DIR", base):
            storage.save_state("default", {"ok": True})
            ok("valid project_id still saves inside data dir",
               (base / "default" / "current.json").exists())


def test_state_api_rejects_traversal_project_id() -> None:
    with TemporaryDirectory() as d:
        base = Path(d) / "data"
        with patch.object(storage, "DATA_DIR", base):
            r = client.put("/api/state", json={
                "project_id": "../escape",
                "state": {"x": 1},
            })
            ok("PUT /api/state rejects ../ project_id", r.status_code == 422, str(r.status_code))
            ok("no current.json written outside data dir",
               not (Path(d) / "escape" / "current.json").exists())

            r = client.get("/api/state", params={"project_id": "../../escape"})
            ok("GET /api/state rejects ../ project_id", r.status_code == 422, str(r.status_code))


def test_snapshot_id_is_never_a_path() -> None:
    with TemporaryDirectory() as d:
        base = Path(d) / "data"
        snap_dir = base / "default" / "snapshots"
        snap_dir.mkdir(parents=True)
        outside = Path(d) / "keep.json"
        outside.write_text('{"escaped": true}', encoding="utf-8")

        with patch.object(storage, "DATA_DIR", base):
            result = storage.load_snapshot("default", "../keep")
            ok("snapshot_id ../keep does not read outside data dir",
               result is None and outside.exists())


def test_api_key_lives_in_env_not_config_or_api_response() -> None:
    secret = "sk-test-secret-never-export"
    with TemporaryDirectory() as d:
        base = Path(d)
        with (
            patch.object(config_module, "SERVER_DIR", base),
            patch.object(config_module, "CONFIG_FILE", base / "config.yaml"),
            patch.object(config_module, "ENV_FILE", base / ".env"),
        ):
            config_module.save_config({
                "provider": "deepseek",
                "baseUrl": "https://example.com",
                "model": "m",
                "temperature": 1.0,
                "backendUrl": "http://localhost:8765",
                "apiKey": secret,
            })
            public = config_module.public_config()
            ok("public_config has no apiKey key", "apiKey" not in public)
            ok("public_config only reports apiKeyExists",
               public.get("apiKeyExists") is True)
            ok("secret not written to config.yaml",
               secret not in (base / "config.yaml").read_text(encoding="utf-8"))
            ok("secret stored in .env",
               secret in (base / ".env").read_text(encoding="utf-8"))

            config_module.save_config({
                "provider": "deepseek",
                "baseUrl": "https://example.com",
                "model": "m",
                "temperature": 1.0,
                "backendUrl": "http://localhost:8765",
                "apiKey": "********",
            })
            ok("masked update keeps existing key",
               config_module.load_config().get("apiKey") == secret)


def test_config_endpoint_never_returns_key() -> None:
    body = client.get("/api/config").json()
    ok("/api/config omits apiKey", "apiKey" not in body)
    ok("/api/config reports apiKeyExists as bool",
       isinstance(body.get("apiKeyExists"), bool))


def test_upload_size_limits() -> None:
    r = client.post(
        "/api/parse-excel",
        files={"file": ("big.csv", b"x" * (20 * 1024 * 1024 + 1))},
    )
    ok("parse-excel over 20MB -> 413", r.status_code == 413, str(r.status_code))

    r = client.post(
        "/api/extract-doc",
        files={"file": ("big.txt", b"y" * (5 * 1024 * 1024 + 1))},
    )
    ok("extract-doc over 5MB -> 413", r.status_code == 413, str(r.status_code))


test_project_id_cannot_escape_data_dir()
test_state_api_rejects_traversal_project_id()
test_snapshot_id_is_never_a_path()
test_api_key_lives_in_env_not_config_or_api_response()
test_config_endpoint_never_returns_key()
test_upload_size_limits()

print(f"\n{passed} pass / {failed} fail")
raise SystemExit(1 if failed else 0)
