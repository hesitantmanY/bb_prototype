"""File-based state persistence with manual version snapshots.

Model (single save concept):
- 保存 = persist current.json + explicitly create ONE version.
- Versions are manual. Empty name → time-named (type "time"), pruned to the
  newest MAX_TIME_SNAPSHOTS. Custom name → type "named", kept forever.
- No auto snapshots: the legacy auto_* files are removed by
  remove_legacy_auto_snapshots() at server startup.
"""
from __future__ import annotations

import json
import os
import re
import time
from pathlib import Path
from typing import Any

DATA_DIR = Path(__file__).resolve().parent / "data"
# Time-named versions (quick saves with no custom name) are pruned to the
# newest MAX_TIME_SNAPSHOTS; custom-named versions are permanent.
MAX_TIME_SNAPSHOTS = 10
# Backup created before a destructive restore — always custom-named (permanent).
BACKUP_PREFIX = "恢复前备份 "


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
    """Persist current state. No snapshot is created here — versions are
    created explicitly via POST /api/snapshots (create_snapshot)."""
    _atomic_write(_current_file(project_id), json.dumps(state, ensure_ascii=False, indent=2))
    return {"ok": True}


def _time_display(ts_str: str) -> str | None:
    """Convert a 15-char %Y%m%d_%H%M%S timestamp to 'YYYY-MM-DD HH:MM:SS'."""
    try:
        t = time.mktime(time.strptime(ts_str, "%Y%m%d_%H%M%S"))
        return time.strftime("%Y-%m-%d %H:%M:%S", time.localtime(t))
    except (ValueError, OSError):
        return None


def list_snapshots(project_id: str = "default") -> list[dict[str, Any]]:
    """List snapshots, newest first. Types: 'time' (time-named, prunable),
    'named' (custom name, permanent)."""
    snap_dir = _snapshots_dir(project_id)
    if not snap_dir.exists():
        return []

    snapshots = []
    for f in snap_dir.glob("*.json"):
        try:
            stat = f.stat()
            stem = f.stem
            is_time = stem.startswith("time_")
            is_named = stem.startswith("named_")
            created_at = stat.st_mtime
            display_name = stem
            if is_time or stem.startswith("auto_"):  # auto_ tolerated until migration
                ts_display = _time_display(stem[5:20])
                if ts_display is not None:
                    display_name = ts_display
                    t = time.mktime(time.strptime(stem[5:20], "%Y%m%d_%H%M%S"))
                    created_at = t
            elif is_named:
                display_name = stem[6:]  # remove "named_"

            snapshots.append({
                "id": stem,
                "name": display_name,
                "type": "time" if is_time else ("auto" if stem.startswith("auto_") else "named"),
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
    overwrite: bool = False,
) -> dict[str, Any]:
    """Create a version snapshot.

    - name empty/None → time-named (type 'time'); pruned to newest
      MAX_TIME_SNAPSHOTS after creation.
    - name given → custom-named (type 'named'); permanent.
    - Content identical to the newest snapshot → skipped (duplicate).
    - Name collisions: overwrite=True replaces the same-named version in place
      (old content gone — caller has already asked the user); otherwise the
      collision gets a (1), (2), … suffix.
    """
    if state is None:
        state = load_state(project_id)
        if state is None:
            raise ValueError("No state to snapshot")

    # Skip when content is identical to the newest snapshot (ignoring meta.savedAt).
    snaps = list_snapshots(project_id)
    if snaps:
        newest = snaps[0]
        newest_data = load_snapshot(project_id, newest["id"])
        if newest_data is not None and _canonical(newest_data) == _canonical(state):
            return {**newest, "skipped": "duplicate"}

    snap_dir = _snapshots_dir(project_id)
    snap_dir.mkdir(parents=True, exist_ok=True)

    name = (name or "").strip()
    if name:
        safe_name = re.sub(r'[<>:"/\\|?*]', "_", name).strip()
        snap_id = "named_" + safe_name
        if not overwrite:
            counter = 1
            while (snap_dir / f"{snap_id}.json").exists():
                snap_id = f"named_{safe_name}({counter})"
                counter += 1
        display_name = snap_id[6:]  # include the (n) suffix when renamed-on-collision
    else:
        base = time.strftime("%Y%m%d_%H%M%S")
        ts_display = time.strftime("%Y-%m-%d %H:%M:%S")
        snap_id = "time_" + base
        counter = 1
        while (snap_dir / f"{snap_id}.json").exists():
            counter += 1
            snap_id = f"time_{base}_{counter}"
        if counter > 1:
            ts_display = f"{ts_display} ({counter})"
        display_name = ts_display

    _atomic_write(snap_dir / f"{snap_id}.json", json.dumps(state, ensure_ascii=False, indent=2))
    _cleanup_time_snapshots(project_id)

    return {
        "id": snap_id,
        "name": display_name,
        "type": "time" if not name else "named",
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
    """Restore a snapshot. Current content is first backed up as a custom-named
    version (「恢复前备份 …」, permanent). Returns the restored state, or None."""
    snapshot_state = load_snapshot(project_id, snapshot_id)
    if snapshot_state is None:
        return None

    current = load_state(project_id)
    # Backup only when the restore would actually change content — restoring
    # the same version twice shouldn't produce backup noise.
    if current is not None and _canonical(current) != _canonical(snapshot_state):
        create_snapshot(
            project_id,
            name=BACKUP_PREFIX + time.strftime("%Y-%m-%d %H-%M"),  # 冒号会被文件名清洗，用连字符
            state=current,
        )

    _atomic_write(
        _current_file(project_id),
        json.dumps(snapshot_state, ensure_ascii=False, indent=2),
    )
    return snapshot_state


def delete_snapshot(project_id: str, snapshot_id: str) -> bool:
    """Delete a snapshot. Returns True if it existed and was removed."""
    safe_id = Path(snapshot_id).name
    f = _snapshots_dir(project_id) / f"{safe_id}.json"
    try:
        f.unlink()
        return True
    except OSError:
        return False


def rename_snapshot(
    project_id: str,
    snapshot_id: str,
    new_name: str,
    overwrite: bool = False,
) -> dict[str, Any] | None:
    """Rename a snapshot (any type becomes custom-named / permanent).
    On name collision: overwrite=True removes the target version first (caller
    has already asked the user); otherwise the target gets a (1), (2), … suffix.
    Returns new metadata; None if the snapshot doesn't exist.
    Raises ValueError when the new name is empty after sanitizing."""
    new_name = (new_name or "").strip()
    if not new_name:
        raise ValueError("Name is empty")
    safe_name = re.sub(r'[<>:"/\\|?*]', "_", new_name).strip()
    if not safe_name:
        raise ValueError("Name is empty")

    safe_id = Path(snapshot_id).name
    snap_dir = _snapshots_dir(project_id)
    src = snap_dir / f"{safe_id}.json"
    if not src.exists():
        return None

    target = "named_" + safe_name
    if overwrite:
        existing = snap_dir / f"{target}.json"
        if existing.exists() and existing != src:
            try:
                existing.unlink()  # 覆盖：先移除被顶掉的版本
            except OSError:
                raise ValueError("Cannot overwrite target snapshot")
    else:
        counter = 1
        while (snap_dir / f"{target}.json").exists() and (snap_dir / f"{target}.json") != src:
            target = f"named_{safe_name}({counter})"
            counter += 1
    dst = snap_dir / f"{target}.json"
    if dst == src:
        return {"id": target, "name": target[6:], "type": "named", "created_at": dst.stat().st_mtime}
    os.replace(src, dst)

    return {"id": target, "name": target[6:], "type": "named", "created_at": dst.stat().st_mtime}


def _cleanup_time_snapshots(project_id: str, keep: int = MAX_TIME_SNAPSHOTS) -> None:
    """Keep only the N most recent time-named versions. Named ones are untouched."""
    snap_dir = _snapshots_dir(project_id)
    if not snap_dir.exists():
        return

    time_files = sorted(
        snap_dir.glob("time_*.json"),
        key=lambda f: f.stat().st_mtime,
        reverse=True,
    )
    for old in time_files[keep:]:
        try:
            old.unlink()
        except OSError:
            pass


def remove_legacy_auto_snapshots() -> None:
    """One-time migration: delete legacy auto_*.json snapshots (the auto-snapshot
    feature was removed). Idempotent — safe to call on every startup."""
    for proj in DATA_DIR.iterdir():
        snap_dir = proj / "snapshots"
        if not snap_dir.is_dir():
            continue
        for f in snap_dir.glob("auto_*.json"):
            try:
                f.unlink()
            except OSError:
                pass
