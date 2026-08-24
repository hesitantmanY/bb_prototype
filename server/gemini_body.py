"""Gemini request body builder — pure logic, no dependencies.

Extracted from llm_proxy.py so it can be unit-tested without httpx
(or any other network library) being installed.

Public API:
    build_gemini_body(messages, temperature, opts=None) -> dict

T03 changes from the old behavior:
  1. The first `role=='system'` message is hoisted to `system_instruction`
     (Gemini's native system field).
  2. Subsequent `role=='system'` messages are prepended to the next user
     message's text.
  3. `role=='assistant'` is translated to `role:'model'`.
  4. If `opts.response_format == {type:'json_object'}`, set
     `generationConfig.responseMimeType = 'application/json'`.
     (The frontend emits this when the per-provider whitelist in T02
     says Gemini supports JSON mode.)
"""
from __future__ import annotations
from typing import Any


def build_gemini_body(
    messages: list[dict[str, Any]],
    temperature: float,
    opts: dict[str, Any] | None = None,
) -> dict[str, Any]:
    opts = opts or {}
    sys_text: str | None = None
    contents: list[dict[str, Any]] = []
    pending_system_prefix: str | None = None

    def flush_prefix_into_user(text: str) -> str:
        return (pending_system_prefix + "\n\n" + text) if pending_system_prefix else text

    for m in messages:
        role = m.get("role", "user")
        text = m.get("content", "") or ""
        if role == "system":
            if sys_text is None:
                sys_text = text
            else:
                pending_system_prefix = (
                    (pending_system_prefix + "\n\n" + text) if pending_system_prefix else text
                )
            continue
        if role == "assistant":
            contents.append({"role": "model", "parts": [{"text": text}]})
        else:
            contents.append({"role": "user", "parts": [{"text": flush_prefix_into_user(text)}]})
            pending_system_prefix = None

    body: dict[str, Any] = {
        "contents": contents,
        "generationConfig": {"temperature": temperature},
    }
    if sys_text is not None:
        body["system_instruction"] = {"parts": [{"text": sys_text}]}

    rf = opts.get("response_format")
    if isinstance(rf, dict) and rf.get("type") == "json_object":
        body["generationConfig"]["responseMimeType"] = "application/json"

    return body


if __name__ == "__main__":
    import sys

    cases = [
        # (name, messages, temperature, opts, expected_subset)
        ("basic user message",
         [{"role": "user", "content": "hi"}], 1.0, None,
         {"contents": [{"role": "user", "parts": [{"text": "hi"}]}],
          "generationConfig": {"temperature": 1.0}}),
        ("system hoisted to system_instruction",
         [{"role": "system", "content": "You are X."},
          {"role": "user", "content": "Question?"}], 0.7, None,
         {"system_instruction": {"parts": [{"text": "You are X."}]},
          "contents": [{"role": "user", "parts": [{"text": "Question?"}]}]}),
        ("multi-turn assistant -> model",
         [{"role": "user", "content": "Q1"},
          {"role": "assistant", "content": "A1"},
          {"role": "user", "content": "Q2"}], 1.0, None,
         {"contents": [
            {"role": "user", "parts": [{"text": "Q1"}]},
            {"role": "model", "parts": [{"text": "A1"}]},
            {"role": "user", "parts": [{"text": "Q2"}]}]}),
        ("JSON mode on -> responseMimeType",
         [{"role": "user", "content": "give json"}], 0.5,
         {"response_format": {"type": "json_object"}},
         {"generationConfig": {"temperature": 0.5, "responseMimeType": "application/json"}}),
        ("JSON mode off -> no responseMimeType",
         [{"role": "user", "content": "hi"}], 0.5, {},
         {"generationConfig": {"temperature": 0.5}}),
        ("subsequent system msg prepended to next user",
         [{"role": "system", "content": "sys1"},
          {"role": "system", "content": "sys2"},
          {"role": "user", "content": "Q"}], 1.0, None,
         {"system_instruction": {"parts": [{"text": "sys1"}]},
          "contents": [{"role": "user", "parts": [{"text": "sys2\n\nQ"}]}]}),
        ("empty messages",
         [], 1.0, None,
         {"contents": []}),
    ]

    pass_n = 0
    fail_n = 0
    for name, msgs, t, opts, expected_subset in cases:
        body = build_gemini_body(msgs, t, opts)
        ok = True
        diffs = []
        for k, v in expected_subset.items():
            actual = body.get(k)
            if actual != v:
                ok = False
                diffs.append(f"  key {k!r}: expected {v!r}, got {actual!r}")
        if ok:
            pass_n += 1
            print(f"PASS  {name}")
        else:
            fail_n += 1
            print(f"FAIL  {name}\n" + "\n".join(diffs) + f"\n   body: {body}")

    # Extra: ensure NO responseMimeType leaks when JSON mode off
    body = build_gemini_body([{"role": "user", "content": "x"}], 1.0, {})
    if "responseMimeType" not in body.get("generationConfig", {}):
        pass_n += 1
        print("PASS  no responseMimeType when JSON mode off")
    else:
        fail_n += 1
        print(f"FAIL  no responseMimeType when JSON mode off (got: {body})")

    # Extra: opts=None is safe
    body = build_gemini_body([{"role": "user", "content": "x"}], 1.0, None)
    if "responseMimeType" not in body.get("generationConfig", {}):
        pass_n += 1
        print("PASS  opts=None is safe (no responseMimeType)")
    else:
        fail_n += 1
        print(f"FAIL  opts=None not safe (got: {body})")

    print(f"\n{pass_n} pass / {fail_n} fail")
    sys.exit(0 if fail_n == 0 else 1)
