"""LLM request validation — pure-Python, zero dependencies.

Why no Pydantic: pydantic is not in the project's runtime requirements
(see server/requirements.txt — it would have to be added). For a
small fixed schema (3 message fields, 1 opts field), a hand-written
validator is ~60 lines, has no import cost, and runs on stock Python 3.

When Pydantic becomes desirable (more complex validation, e.g. nested
schemas from cases/), this module can be replaced 1:1 with a Pydantic
BaseModel that exposes the same `validate_llm_request` signature.

Public API:
    validate_llm_request(req: dict) -> (ok: bool, errors: list[str])

`req` shape (matches what the browser sends):
    {
        "messages": [{"role": "system"|"user"|"assistant", "content": "..."}, ...],
        "opts": {
            "temperature": float | None,        # 0..2
            "response_format": dict | None,     # passed through, structure not validated
            "profile": dict | None              # reserved, structure not validated
        }
    }

Limits (locked 2026-08-20):
    - 1 <= len(messages) <= 64
    - 0 < len(content) <= 32_000 per message
    - sum of all content lengths <= 200_000
    - role in {"system", "user", "assistant"}
    - temperature in [0, 2] when provided (None = use server default)
"""
from __future__ import annotations

ALLOWED_ROLES = ("system", "user", "assistant")
MIN_MESSAGES = 1
MAX_MESSAGES = 64
MAX_CONTENT_LEN = 32_000
MAX_TOTAL_CONTENT_LEN = 200_000
MIN_TEMPERATURE = 0.0
MAX_TEMPERATURE = 2.0


def _is_str(v) -> bool:
    return isinstance(v, str)


def _is_number(v) -> bool:
    return isinstance(v, (int, float)) and not isinstance(v, bool)


def validate_llm_request(req) -> tuple[bool, list[str]]:
    """Validate a /api/llm request body. Returns (ok, errors)."""
    errors: list[str] = []
    if not isinstance(req, dict):
        return False, ["request body must be a JSON object"]

    messages = req.get("messages")
    if not isinstance(messages, list):
        return False, ["`messages` must be a list"]
    if len(messages) < MIN_MESSAGES:
        errors.append(f"`messages` must have at least {MIN_MESSAGES} entry")
        return False, errors
    if len(messages) > MAX_MESSAGES:
        errors.append(f"`messages` must have at most {MAX_MESSAGES} entries (got {len(messages)})")
        return False, errors

    total_len = 0
    for i, m in enumerate(messages):
        prefix = f"messages[{i}]"
        if not isinstance(m, dict):
            errors.append(f"{prefix} must be an object")
            continue
        role = m.get("role")
        if role not in ALLOWED_ROLES:
            errors.append(f"{prefix}.role must be one of {list(ALLOWED_ROLES)} (got {role!r})")
        content = m.get("content")
        if not _is_str(content):
            errors.append(f"{prefix}.content must be a string")
            continue
        if len(content) == 0:
            errors.append(f"{prefix}.content must be non-empty")
            continue
        if len(content) > MAX_CONTENT_LEN:
            errors.append(f"{prefix}.content length {len(content)} > max {MAX_CONTENT_LEN}")
            continue
        total_len += len(content)

    if total_len > MAX_TOTAL_CONTENT_LEN:
        errors.append(f"sum of messages.content length {total_len} > max {MAX_TOTAL_CONTENT_LEN}")

    opts = req.get("opts")
    if opts is not None:
        if not isinstance(opts, dict):
            errors.append("`opts` must be an object when provided")
        else:
            t = opts.get("temperature")
            if t is not None:
                if not _is_number(t):
                    errors.append(f"opts.temperature must be a number (got {type(t).__name__})")
                elif t < MIN_TEMPERATURE or t > MAX_TEMPERATURE:
                    errors.append(f"opts.temperature {t} out of range [{MIN_TEMPERATURE}, {MAX_TEMPERATURE}]")
            # response_format and profile are passed through without
            # structural validation — the upstream LLM handles them.

    return (len(errors) == 0), errors


# Self-test when run as a script. Lets the T06 acceptance checklist
# run without installing pytest / pydantic.
if __name__ == "__main__":
    import sys

    cases = [
        # (name, req, expect_ok)
        ("valid minimal", {"messages": [{"role": "user", "content": "hi"}]}, True),
        ("valid full", {"messages": [
            {"role": "system", "content": "You are X."},
            {"role": "user", "content": "Question?"},
        ], "opts": {"temperature": 0.7}}, True),
        ("valid no opts", {"messages": [{"role": "user", "content": "hi"}]}, True),
        ("valid boundary temp 0", {"messages": [{"role": "user", "content": "hi"}], "opts": {"temperature": 0}}, True),
        ("valid boundary temp 2", {"messages": [{"role": "user", "content": "hi"}], "opts": {"temperature": 2}}, True),
        ("empty messages list", {"messages": []}, False),
        ("too many messages (65)", {"messages": [{"role": "user", "content": str(i)} for i in range(65)]}, False),
        ("wrong role", {"messages": [{"role": "bot", "content": "hi"}]}, False),
        ("missing content", {"messages": [{"role": "user"}]}, False),
        ("content not string", {"messages": [{"role": "user", "content": 42}]}, False),
        ("content empty", {"messages": [{"role": "user", "content": ""}]}, False),
        ("content too long (32k+1)", {"messages": [{"role": "user", "content": "x" * (32_000 + 1)}]}, False),
        ("total content too long", {"messages": [
            {"role": "user", "content": "x" * 100_000},
            {"role": "user", "content": "y" * 100_001}
        ]}, False),
        ("temperature string", {"messages": [{"role": "user", "content": "hi"}], "opts": {"temperature": "hot"}}, False),
        ("temperature 3.0 out of range", {"messages": [{"role": "user", "content": "hi"}], "opts": {"temperature": 3.0}}, False),
        ("temperature -0.1 out of range", {"messages": [{"role": "user", "content": "hi"}], "opts": {"temperature": -0.1}}, False),
        ("opts not dict", {"messages": [{"role": "user", "content": "hi"}], "opts": "nope"}, False),
        ("body not dict", "nope", False),
    ]

    pass_n = 0
    fail_n = 0
    for name, req, expect_ok in cases:
        ok, errs = validate_llm_request(req)
        if ok == expect_ok:
            pass_n += 1
            print(f"PASS  {name}")
        else:
            fail_n += 1
            print(f"FAIL  {name}\n   expect ok={expect_ok}, got ok={ok}\n   errors: {errs}")

    print(f"\n{pass_n} pass / {fail_n} fail")
    sys.exit(0 if fail_n == 0 else 1)
