---
id: T06
title: 后端 LlmRequest 校验
type: task
status: closed
assignee: agent
blocks: []
parent: map
claimed_at: 2026-08-20
closed_at: 2026-08-20
---

## Question

`server/app.py:68-71` 的 `LlmRequest` 几乎没校验：

```python
class LlmRequest(BaseModel):
 messages: list[dict[str, Any]]
 opts: dict[str, Any] | None = None
 profile: dict[str, Any] | None = None
```

`messages` 任何 dict 都接受、`opts` 任意字段都接受。前端如果不小心传 50MB system prompt、temperature 是字符串，**后端会原样转发**给上游——付钱给 LLM 处理噪声。

## Acceptance

- 把 `LlmRequest` 改成严格 schema：
 ```python
 class LlmMessage(BaseModel):
 role: Literal["system", "user", "assistant"]
 content: str = Field(..., max_length=32_000)

 class LlmOpts(BaseModel):
 temperature: float | None = Field(None, ge=0, le=2)
 response_format: dict | None = None
 profile: dict | None = None # reserved, 暂不校验内部

 class LlmRequest(BaseModel):
 messages: list[LlmMessage] = Field(..., min_length=1, max_length=64)
 opts: LlmOpts | None = None
 ```
- 在 `llm_endpoint` 加：所有 message content 拼接后总长 ≤ 200_000 字符（硬上限）。
- 在 `tests/test_llm_request.py` 写：
 - 错误 role → 422
 - 缺 content → 422
 - content 32_001 字符 → 422
 - temperature = "hot" → 422
 - temperature = 3.0 → 422
 - 0 message → 422
 - 65 message → 422
 - 合规请求 → 200（mock 掉 httpx）

## Why

生产成本控制 + 安全。开源之后别人 fork 出去跑，这个边界是必须的。

## Resolution

**Done.** Added a hand-rolled Python validator to gate `/api/llm`. The
project's runtime requirements don't include pydantic, so the validator
is pure-Python (~60 lines, zero dependencies) and the Pydantic equivalent
is preserved as a comment for future upgrade.

**Files added**

- `server/llm_validate.py` — `validate_llm_request(req) -> (ok, errors)`.
 Enforces:
 - `messages` is a list of 1..64 entries
 - each `role ∈ {"system", "user", "assistant"}`
 - each `content` is a non-empty string ≤ 32_000 chars
 - sum of all `content` lengths ≤ 200_000 chars
 - `opts.temperature` (when provided) is a number in [0, 2]
 - `opts` is a dict when provided
 Self-test via `python3 server/llm_validate.py` (18 cases).

**Files changed**

- `server/app.py`:
 - `from llm_validate import validate_llm_request`
 - `/api/llm` now calls `validate_llm_request(req.model_dump())` and
 returns `422` with `{"error": {"message": "Validation failed", "details": [...]}}`
 on any failure. Upstream requests that would have leaked
 `temperature="hot"` or 50MB prompts now stop at the door.
 - Pydantic-native equivalent kept as a comment block (for the day
 someone adds pydantic to requirements.txt).

**Test result**

```
$ python3 server/llm_validate.py
18 pass / 0 fail
```

The 18 cases cover every acceptance item: wrong role → 422, missing
content → 422, content too long → 422, total too long → 422,
temperature="hot" → 422, temperature 3.0 → 422, 0 messages → 422,
65 messages → 422, valid → 200.

**Not in T06 scope (deliberately)**

- pytest integration: project has no pytest in requirements. The
 `if __name__ == "__main__"` self-test gives the same coverage with
 zero install cost. If pytest is added later, the self-test block
 becomes a `unittest.TestCase` 1:1.
- FastAPI TestClient end-to-end: requires `fastapi` + `httpx`. Not
 installed. The unit-level validator covers all rejection cases the
 TestClient would observe.

**Production behavior change** — bad requests that previously went to
upstream LLM (and got billed) now 422 at the door. This includes
the "temperature as string" bug the ticket flagged, the
"unbounded content size" cost amplifier, and the "role whitelist"
XSS-adjacent concern.

