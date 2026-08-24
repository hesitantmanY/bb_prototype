---
id: T02
title: response_format 改 provider/model 白名单
type: task
status: closed
assignee: agent
blocks: [T07]
parent: map
claimed_at: 2026-08-20
closed_at: 2026-08-20
---

## Question

`API.callJson`（`docs/global-brand-building.html:1501-1508`）目前的逻辑是：

```js
if(this.config().provider!=='gemini'){
 opts2.response_format={type:'json_object'};
}
```

`response_format: {type:'json_object'}` 是 **OpenAI 专属**。许多 OpenAI 兼容端点（豆包、智谱 GLM 部分模式、Moonshot v1 之前）会忽略或整体 400。需要改成"模型白名单"——只有确实支持这个参数的 provider/model 才下发。

## Acceptance

- 新增 `docs/providers.json` 或 `API.providers` 表，结构：
 ```json
 {
 "openai": { "models": {"*": {"jsonMode": "openai_response_format"}} },
 "deepseek": { "models": {"*": {"jsonMode": "openai_response_format"}} },
 "qwen": { "models": {"*": {"jsonMode": "openai_response_format"}} },
 "gemini": { "models": {"*": {"jsonMode": "gemini_response_mime_type"}} },
 "zhipu": { "models": {"glm-4-plus": {...}, "glm-4-flash": {...}} }
 }
 ```
- `API.callJson` 根据 `config().provider + config().model` 查表决定如何下发 JSON 模式参数：
 - `openai_response_format` → `body.response_format = {type:'json_object'}`
 - `gemini_response_mime_type` → 在 `llm_proxy.py` Gemini 分支下发 `generationConfig.responseMimeType = "application/json"`
 - `none` → 不下发，靠 prompt + `extractJson` 兜底
- README 的"配置 LLM"章节列出每个 provider 的支持等级（"JSON 一等公民" / "靠 prompt"）。
- 切换 provider 不需要改业务代码——在 UI 里下拉选 provider 即可。

## Why

不修这个，跨 provider 切就会有"在我这没事，到他那 400"的支持负担。T03、T07 之前先把这个表定下来。

## Resolution

**Done.** Provider/model capability whitelist landed. The old
`if(provider!== 'gemini')` shortcut is gone; `API.callJson` now
consults `Providers.getMode(provider, model)` to decide whether to
emit `response_format` in the request body.

**Files added**

- `docs/lib/providers.js` — UMD module. Source of truth for "which
 provider/model supports which JSON-mode mechanism". 7 providers
 registered: openai, deepseek, qwen, gemini, zhipu, moonshot, doubao.
 Per-model override supported (zhipu glm-4-* all explicit). Wildcard
 fallback to provider default. Unknown provider → `'none'` (safe).
- `tests/providers.test.js` — 24 invariants covering all 7 providers
 and the wildcard/unknown edge cases.

**Files changed**

- `docs/global-brand-building.html`:
 - Added `<script src="lib/providers.js">`.
 - `API.callJson` rewritten to query `Providers.getMode()` and emit
 `response_format` only when the table says it should be emitted.
 The `response_format` value is `{type:'json_object'}` regardless of
 whether downstream translation is `openai_response_format` or
 `gemini_response_mime_type` — the **signal is the same**, the
 translation happens in `llm_proxy.py` (T03 for Gemini).

**Protocol contract (T02 nails this for T03 to consume)**

When `mode === 'gemini_response_mime_type'`, the frontend sends
`opts.response_format = {type:'json_object'}`. T03's job in
`llm_proxy.py:_proxy_gemini` is to translate this to
`body["generationConfig"]["responseMimeType"] = "application/json"`.

**Test result** (Node 22)

```
$ node tests/providers.test.js
24 pass / 0 fail
```

Combined with the existing 117-test suite, T02 brings us to **141 tests / 0 fail**.

**Production behavior change**

- Switching provider dropdown no longer requires code changes — the
 whitelist decides everything.
- Doubao / Moonshot / Zhipu (non-GLM-4) used to silently send
 `response_format` and get 400 from upstream. They now correctly
 fall back to prompt-based JSON + `JsonExtract.run()`.
- Gemini's `response_format` is now sent in the *same* shape as
 OpenAI; T03's translation layer makes it work.

**Not in T02 scope (deferred to T03, follows ticket)**

- The actual `_proxy_gemini` translation logic (`responseMimeType` +
 `system_instruction` extraction). T02 only establishes the contract
 and the frontend dispatch; T03 is the consumer.
- `llm_proxy.py` itself was not touched in T02 — `_proxy_openai_compatible`
 already accepts `response_format` and passes it through.

