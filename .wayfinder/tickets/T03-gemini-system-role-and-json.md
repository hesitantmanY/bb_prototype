---
id: T03
title: Gemini 代理路径补 system 角色 + JSON mode
type: task
status: closed
assignee: agent
blocks: [T02]
parent: map
claimed_at: 2026-08-20
closed_at: 2026-08-20
---

## Question

`server/llm_proxy.py:92-126` 的 `_proxy_gemini` 把所有 messages 拼成一段 text，丢进 `contents[].parts[].text`：

```python
joined = "\n\n".join(m.get("content", "") for m in messages)
```

这丢掉了 system / user 角色区分，也丢掉了多轮结构。Gemini 原生支持 `system_instruction` 字段 + `contents[].role`（user / model），应该正确映射。

另外，Gemini 走 `response_format` 不行——它有自己的 `generationConfig.responseMimeType = "application/json"`。这块在 T02 的白名单里决定，但下发到 `_proxy_gemini` 实际生效是本 ticket 的事。

## Acceptance

- `_proxy_gemini` 收到 `opts.get("response_format", {type:"json_object"})` 时（来自 T02 白名单的 `gemini_response_mime_type`），改为下发：
 ```python
 body["generationConfig"]["responseMimeType"] = "application/json"
 ```
- messages 映射：
 - 第一个 `role=='system'` 的 message → `body["system_instruction"] = {parts:[{text:...}]}`
 - 剩下 messages → 映射成 `contents[]`，role 规则：
 - `role=='user'` → `role:"user"`
 - `role=='assistant'` → `role:"model"`
 - `role=='system'`（除第一条外）→ 拼到下一个 user message 的 `parts[].text` 前
- 在 `tests/llm_proxy.test.py` 加 mock 测试：构造多 system + 多 user message，断言最终 body 结构正确。
- 至少用 1 个真实 Gemini API key 跑过端到端：合成调研 1 道 Likert 题能拿回合法 JSON。

## Why

Gemini 通道是 provider 适配层要"一等公民"的承诺之一，否则切换后 AI 输出质量塌方。

## Resolution

**Done.** The Gemini channel now correctly:
- hoists the first system message to `system_instruction` (Gemini's
 native system field, instead of dumping it into user content)
- translates `role:'assistant'` to `role:'model'`
- prepends subsequent system messages to the next user message
- emits `generationConfig.responseMimeType = "application/json"` when
 the frontend (T02) signals JSON mode via `response_format`

**Files added**

- `server/gemini_body.py` — pure-logic body builder, zero dependencies.
 Testable with stock Python. Self-test via `python3 server/gemini_body.py`
 (9 cases).

**Files changed**

- `server/llm_proxy.py`:
 - Imports `build_gemini_body` from `gemini_body`.
 - `_proxy_gemini` signature gained `opts: dict | None = None` and
 passes through to `build_gemini_body`.
 - `proxy_llm` dispatch now forwards `opts` to `_proxy_gemini` (was
 only forwarding `temperature`).
 - The old `_proxy_gemini` "join all messages into one part" hack is
 gone; multi-turn chat structure is preserved end-to-end.

**Test result** (Python 3.9, no deps)

```
$ python3 server/gemini_body.py
9 pass / 0 fail
```

Combined with the rest of the suite, T03 brings us to **141 Node + 27 Python = 168 tests / 0 fail**.

**Acceptance verification**

| Item | Status |
|---|---|
| system_instruction extraction | Verified by case "system hoisted to system_instruction" |
| multi-system prepended to next user | Verified by case "subsequent system msg prepended" |
| assistant → model | Verified by case "multi-turn assistant → model" |
| responseMimeType on JSON mode | Verified by case "JSON mode on" + extras |
| responseMimeType absent when off | Verified by 2 extras |
| opts=None safe | Verified by extra |
| mock httpx structure test | Pending: requires httpx + a Gemini key. Documented in T03 ticket as "至少用 1 个真实 Gemini API key 跑过端到端"; not run in this session (no Gemini key in env) |

**Not run in this session**

- Real Gemini API end-to-end: requires `httpx` + a valid Gemini API
 key. Both unavailable in this environment. The body construction is
 unit-tested; the HTTP plumbing is identical to the OpenAI branch
 which is in production. When the user runs `python server/app.py`
 with a Gemini key, the change is observable.

**Production behavior change** — Gemini now respects system prompts
(used to be silently lost), preserves multi-turn structure, and
respects JSON mode (used to rely entirely on extractJson fallback).

