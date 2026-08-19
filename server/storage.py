"""File-based state persistence with snapshot versioning."""
from __future__ import annotations

import json
import os
import re
import time
from pathlib import Path
from typing import Any

DATA_DIR = Path(__file__).resolve().parent / "data"
MAX_AUTO_SNAPSHOTS = 30
# Auto snapshots are throttled: at most one per interval, so the retained 30
# span a meaningful stretch of editing time instead of 30 seconds of typing.
AUTO_SNAPSHOT_MIN_INTERVAL = 120  # seconds


def _project_dir(project_id: str) -> Path:
    return DATA_DIR / project_id


def _snapshots_dir(project_id: str) -> Path:
    return _project_dir(project_id) / "snapshots"


def _current_file(project_id: str) -> Path:
    return _project_dir(project_id) / "current.json"


def _atomic_write(path: Path, data: str) -> None:
    """Write to a temp file then rename for atomicity."""
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp = path.with_suffix(path.suffix + ".tmp")
    with open(tmp, "w", encoding="utf-8") as f:
        f.write(data)
    os.replace(tmp, path)


def load_state(project_id: str = "default") -> dict[str, Any] | None:
    """Load current state. Returns None if no saved state exists."""
    f = _current_file(project_id)
    if not f.exists():
        return None
    try:
        with open(f, "r", encoding="utf-8") as fh:
            return json.load(fh)
    except (json.JSONDecodeError, OSError):
        return None


def _strip_saved_at(state: Any) -> Any:
    """Return a copy of state with meta.savedAt nulled, for content comparison."""
    if not isinstance(state, dict):
        return state
    meta = dict(state.get("meta") or {})
    meta["savedAt"] = None
    return {**state, "meta": meta}


def _canonical(state: Any) -> str:
    return json.dumps(_strip_saved_at(state), sort_keys=True, ensure_ascii=False)


def save_state(project_id: str, state: dict[str, Any]) -> dict[str, Any]:
    """Save state and create an auto snapshot. Returns snapshot metadata.

    Snapshots are skipped when (a) content is identical to the newest snapshot
    (ignoring meta.savedAt), or (b) the newest auto snapshot is fresher than
    AUTO_SNAPSHOT_MIN_INTERVAL. current.json is always written.
    """
    _atomic_write(_current_file(project_id), json.dumps(state, ensure_ascii=False, indent=2))
    snaps = list_snapshots(project_id)
    if snaps:
        newest = snaps[0]
        latest_data = load_snapshot(project_id, newest["id"])
        if latest_data is not None and _canonical(latest_data) == _canonical(state):
            return {**newest, "skipped": "duplicate"}
        if newest["type"] == "auto" and (time.time() - newest["created_at"]) < AUTO_SNAPSHOT_MIN_INTERVAL:
            return {**newest, "skipped": "throttled"}
    snap = create_snapshot(project_id, state=state)
    _cleanup_auto_snapshots(project_id)
    return snap


def list_snapshots(project_id: str = "default") -> list[dict[str, Any]]:
    """List snapshots, newest first."""
    snap_dir = _snapshots_dir(project_id)
    if not snap_dir.exists():
        return []

    snapshots = []
    for f in snap_dir.glob("*.json"):
        try:
            stat = f.stat()
            name = f.stem
            is_auto = name.startswith("auto_")
            # Extract timestamp from auto_YYYYMMDD_HHMMSS
            created_at = stat.st_mtime
            if is_auto:
                ts_str = name[5:]  # remove "auto_"
                try:
                    created_at = time.mktime(time.strptime(ts_str, "%Y%m%d_%H%M%S"))
                except ValueError:
                    pass

            # Read minimal metadata without loading full state
            display_name = name
            if is_auto:
                try:
                    t = time.localtime(created_at)
                    display_name = time.strftime("%Y-%m-%d %H:%M:%S", t)
                except Exception:
                    display_name = name
            elif name.startswith("named_"):
                display_name = name[6:]  # remove "named_"

            snapshots.append({
                "id": name,
                "name": display_name,
                "type": "auto" if is_auto else "named",
                "created_at": created_at,
            })
        except OSError:
            continue

    snapshots.sort(key=lambda s: s["created_at"], reverse=True)
    return snapshots


def create_snapshot(
    project_id: str,
    name: str | None = None,
    state: dict[str, Any] | None = None,
) -> dict[str, Any]:
    """Create a snapshot. If name is provided, it's a named (permanent) snapshot.
    If state is None, reads from current.json."""
    if state is None:
        state = load_state(project_id)
        if state is None:
            raise ValueError("No state to snapshot")

    snap_dir = _snapshots_dir(project_id)
    snap_dir.mkdir(parents=True, exist_ok=True)

    if name:
        # Sanitize name for filename
        safe_name = re.sub(r'[<>:"/\\|?*]', "_", name).strip()
        snap_id = f"named_{safe_name}"
    else:
        snap_id = "auto_" + time.strftime("%Y%m%d_%H%M%S")
        # Avoid collisions if multiple saves within the same second
        counter = 1
        while (snap_dir / f"{snap_id}.json").exists():
            snap_id = f"auto_{time.strftime('%Y%m%d_%H%M%S')}_{counter}"
            counter += 1

    _atomic_write(snap_dir / f"{snap_id}.json", json.dumps(state, ensure_ascii=False, indent=2))

    return {
        "id": snap_id,
        "name": name if name else snap_id[5:],
        "type": "named" if name else "auto",
        "created_at": time.time(),
    }


def load_snapshot(project_id: str, snapshot_id: str) -> dict[str, Any] | None:
    """Load a snapshot's full state."""
    # Prevent path traversal
    safe_id = Path(snapshot_id).name
    f = _snapshots_dir(project_id) / f"{safe_id}.json"
    if not f.exists():
        return None
    try:
        with open(f, "r", encoding="utf-8") as fh:
            return json.load(fh)
    except (json.JSONDecodeError, OSError):
        return None


def restore_snapshot(project_id: str, snapshot_id: str) -> dict[str, Any] | None:
    """Restore a snapshot. Creates an auto-snapshot of current state first.
    Returns the restored state, or None on failure."""
    snapshot_state = load_snapshot(project_id, snapshot_id)
    if snapshot_state is None:
        return None

    # Auto-snapshot current state before restoring (so user can undo)
    current = load_state(project_id)
    if current is not None:
        create_snapshot(project_id, state=current)
        _cleanup_auto_snapshots(project_id)

    _atomic_write(
        _current_file(project_id),
        json.dumps(snapshot_state, ensure_ascii=False, indent=2),
    )
    return snapshot_state


def _cleanup_auto_snapshots(project_id: str, keep: int = MAX_AUTO_SNAPSHOTS) -> None:
    """Keep only the N most recent auto snapshots. Named snapshots are untouched."""
    snap_dir = _snapshots_dir(project_id)
    if not snap_dir.exists():
        return

    auto_files = sorted(
        snap_dir.glob("auto_*.json"),
        key=lambda f: f.stat().st_mtime,
        reverse=True,
    )
    for old in auto_files[keep:]:
        try:
            old.unlink()
        except OSError:
            pass
