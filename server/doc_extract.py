"""Plain-text extraction for user-uploaded context files.

Supports: .txt .md .csv .docx .pdf
- txt/md/csv: decoded directly (utf-8, gbk fallback)
- docx: stdlib zipfile + xml (no third-party dep)
- pdf: pypdf if installed, otherwise returns an error suggesting text export

The extracted text is returned to the browser, which inlines it into LLM
prompts as user-provided context (no retrieval index / RAG).
"""
from __future__ import annotations

import csv
import io
import re
import zipfile
from typing import Any
from xml.etree import ElementTree as ET

MAX_TEXT_CHARS = 200_000  # hard cap per file (~50k tokens) to protect prompts


def _decode(data: bytes) -> str:
    try:
        return data.decode("utf-8")
    except UnicodeDecodeError:
        return data.decode("gbk", errors="ignore")


def _extract_docx(data: bytes) -> str:
    """Extract paragraph text from a .docx using only stdlib."""
    ns = {"w": "http://schemas.openxmlformats.org/wordprocessingml/2006/main"}
    paragraphs: list[str] = []
    with zipfile.ZipFile(io.BytesIO(data)) as z:
        # word/document.xml holds the main body
        with z.open("word/document.xml") as f:
            tree = ET.parse(f)
    for p in tree.iter("{%s}p" % ns["w"]):
        texts = [t.text for t in p.iter("{%s}t" % ns["w"]) if t.text]
        line = "".join(texts).strip()
        if line:
            paragraphs.append(line)
    return "\n".join(paragraphs)


def _extract_pdf(data: bytes) -> str:
    try:
        from pypdf import PdfReader  # type: ignore
    except ImportError:
        try:
            from PyPDF2 import PdfReader  # type: ignore
        except ImportError:
            raise RuntimeError(
                "PDF 解析需要 pypdf：请在 server 目录运行 pip install pypdf，"
                "或将 PDF 另存为 .txt/.docx 后上传。"
            )
    reader = PdfReader(io.BytesIO(data))
    parts: list[str] = []
    for page in reader.pages:
        try:
            parts.append(page.extract_text() or "")
        except Exception:
            continue
    return "\n".join(parts)


def _extract_csv(data: bytes) -> str:
    text = _decode(data)
    # Keep CSV readable but compact: sniff dialect, render rows as pipe-joined.
    try:
        reader = csv.reader(io.StringIO(text))
        rows = list(reader)
    except Exception:
        return text
    lines = []
    for row in rows[:2000]:  # cap rows
        lines.append(" | ".join(cell.strip() for cell in row))
    return "\n".join(lines)


def extract_document(filename: str, data: bytes) -> dict[str, Any]:
    """Return {ok, text, kind, truncated} or {ok:False, error}."""
    name = filename.lower()
    try:
        if name.endswith((".txt", ".md")):
            text = _decode(data)
            kind = "text"
        elif name.endswith(".csv"):
            text = _extract_csv(data)
            kind = "csv"
        elif name.endswith(".docx"):
            text = _extract_docx(data)
            kind = "docx"
        elif name.endswith(".pdf"):
            text = _extract_pdf(data)
            kind = "pdf"
        elif name.endswith((".xlsx", ".xls")):
            # Spreadsheets go through the dedicated parser; here just give a hint.
            return {"ok": False, "error": "表格请使用「解析 Excel」入口，或另存为 CSV。"}
        else:
            return {"ok": False, "error": f"不支持的文件类型：{filename.rsplit('.', 1)[-1]}"}
    except RuntimeError as e:
        return {"ok": False, "error": str(e)}
    except Exception as e:
        return {"ok": False, "error": f"解析失败：{e}"}

    truncated = False
    if len(text) > MAX_TEXT_CHARS:
        text = text[:MAX_TEXT_CHARS]
        truncated = True
    text = re.sub(r"\n{3,}", "\n\n", text).strip()
    return {"ok": True, "text": text, "kind": kind, "truncated": truncated,
            "chars": len(text)}
