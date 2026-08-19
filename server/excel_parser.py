"""Excel/CSV parsing — used for 八爪鱼 / 问卷星 exports."""
from __future__ import annotations

import io
from typing import Any

import pandas as pd


_TEXT_COLUMN_HINTS = (
    "内容", "评论", "正文", "评价", "文本", "留言", "反馈", "意见",
    "comment", "content", "review", "text", "body", "message", "feedback",
)


def _auto_detect_text_column(columns: list[str]) -> str | None:
    lowered = {c: str(c).lower() for c in columns}
    for c in columns:
        lc = lowered[c]
        for hint in _TEXT_COLUMN_HINTS:
            if hint in lc:
                return c
    return columns[0] if columns else None


def parse_spreadsheet(filename: str, data: bytes) -> dict[str, Any]:
    """Parse an uploaded spreadsheet and return sheet/columns/rows."""
    name = filename.lower()
    try:
        if name.endswith(".csv") or name.endswith(".txt"):
            # Try utf-8 first, then gbk for Chinese exports.
            try:
                text = data.decode("utf-8")
            except UnicodeDecodeError:
                text = data.decode("gbk", errors="ignore")
            df = pd.read_csv(io.StringIO(text))
            sheets = {"Sheet1": df}
        elif name.endswith(".xls"):
            sheets = pd.read_excel(io.BytesIO(data), sheet_name=None, engine="xlrd")
        else:
            sheets = pd.read_excel(io.BytesIO(data), sheet_name=None, engine="openpyxl")
    except Exception as e:
        return {"error": str(e)}

    if not sheets:
        return {"error": "no_sheets"}

    # Default to first sheet. (Caller can later request a specific sheet by name.)
    first_name = next(iter(sheets))
    df = sheets[first_name]
    df = df.fillna("")

    columns = [str(c) for c in df.columns]
    rows = df.to_dict(orient="records")
    # Convert values to JSON-serializable strings.
    serial_rows = []
    for r in rows:
        serial_rows.append({k: (v.item() if hasattr(v, "item") else v) for k, v in r.items()})

    return {
        "sheet_names": list(sheets.keys()),
        "active_sheet": first_name,
        "columns": columns,
        "rows": serial_rows,
        "row_count": len(serial_rows),
        "suggested_text_column": _auto_detect_text_column(columns),
    }
