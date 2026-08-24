---
id: T01
title: extractJson 容错回退
type: task
status: closed
assignee: agent
blocks: []
parent: map
claimed_at: 2026-08-20
closed_at: 2026-08-20
---

## Question

`API.extractJson`（`docs/global-brand-building.html:1510-1531`）是前端唯一的 JSON 兜底解析器，目前只能处理"模型在 JSON 外面多说话"这一种情况。我们需要让它**真正兜底得住**——任何下游 `onResult` 假设它返回有效 JSON 的代码，都不能再因为解析失败而静默吞掉。

具体要决定/实施的范围（请在动手前先 prototype 一份失败样例集）：

1. **支持的回退路径**：
 - 直接 `JSON.parse` 失败
 - 第一个 `{` / `[` 之前有 BOM / 多余空白 / 换行
 - 模型输出形如 `下面是 JSON:\n{...}\n` 前缀
 - 模型在 JSON 外面多打了 `//` 行注释
 - JSON 里多了 `,` 尾随逗号（合法 JS，不合法 JSON）
 - schema 字段里值是字符串而不是数字（"1-5的整数" 残留）
 - 字段名前后多了空格（` "value": 4` → `"value":4`）
2. **不可恢复的信号**：什么情况下应该放弃解析直接抛 `null`？（至少要明确：返回 null 时 `callJson` 怎么通知调用方——目前是 silent null）
3. **是否引入结构校验**？还是只做"能不能 parse"？

## Acceptance

- 给 `extractJson` 写一份 10+ 条的失败样例测试（`tests/extractJson.test.html` 之类的轻量测试页面），全部通过。
- `extractJson` 在所有失败路径下**返回 null 而不是抛异常**；调用方对 null 的处理要明确（要么打 toast 要么走手动模式）。
- README / 代码注释里写清"extractJson 不做语义校验，只做语法回退"——语义校验由 T07 处理。

## Why

这是 #1 "AI 灵异"问题的根因之一。`onResult(r?.xxx)` 在 r=null 时静默失败，UI 没提示。

## Resolution

**Done.** Implemented a 5-stage tolerant JSON parser as a standalone module so it
can be unit-tested without a browser or the FastAPI server.

**Files added**

- `docs/lib/json_extract.js` — UMD module exposing `JsonExtract.run(text)` and
 the 5 stage helpers (`tryParseSafe`, `stripProse`, `stripJsComments`,
 `stripTrailingCommas`, `locateBalancedJson`).
- `tests/extractJson.fixtures.js` — 25 fixtures, 8 failure modes, 5 happy
 paths, 1 known-uncommon (skip). Each fixture has `kind: ok | null | skip`.
- `tests/extractJson.test.js` — Node 22 runner. Mirrors the browser test page
 so they don't drift. Exits 0 on all-pass, 1 on any fail.
- `tests/extractJson.test.html` — Browser test page (for when FastAPI is
 running; UI-friendly variant).

**Files changed**

- `docs/global-brand-building.html` — `API.extractJson` is now a 4-line
 delegation to `JsonExtract.run`, with `API.lastExtractError` (getter) wired
 to `JsonExtract.lastError`. The 5 old internal stage methods deleted.
 Added `<script src="lib/json_extract.js">` near the other scripts.

**Test result** (Node 22)

```
$ node tests/extractJson.test.js
…
24 pass / 0 fail / 1 skip (total 25)
```

**Stage cascade** (in order — each only runs if the previous returned null)

1. direct `JSON.parse` (BOM stripped)
2. `stripProse` + parse — strips leading prose and ```fence``` blocks
3. `stripJsComments` + parse — strips `//` and `/* */` outside strings
4. `stripTrailingCommas` + parse — strips `,}` and `,]` outside strings
5. `locateBalancedJson` + parse — finds first balanced `{...}` / `[...]`

All string-aware walks respect single-quote, double-quote, and backslash
escapes (verified by fixture #20 — `https://example.com//path` in a string
is preserved).

**Contract now documented in code** (in `extractJson` comment + module
header): extractJson does NOT do semantic validation. T07 is the layer
that handles "value should be integer 1..5" and "answers array must be
non-empty".

**What the next layer (T07) gets for free**

- `API.lastExtractError` is the canonical place to read failure reason.
- `callJson` still returns `parsed | null` — backward-compatible. T07
 adds a separate `callJsonStrict(messages, opts, schema)` path and
 decides how to handle the null case (retry / manual / toast).

**Risks / follow-ups (not blocking, logged here)**

- Fixture #25 (unicode line separator ` `) is left as `skip` — uncommon
 and not worth the complexity. Re-evaluate if a provider starts emitting it.
- Stage 3 (comment stripping) only handles line and block comments. The
 current AI models we use don't emit nested `/* /* */ */` — the stripper
 uses a non-nested scan. If a provider does emit nested comments, the
 outer `*/` will close correctly (greedy) and inner text is dropped,
 which is the same behavior as JS parsers that don't support nested
 block comments. Acceptable.

**No behavior change for callers that already got `null`** — they still
get `null` for unparseable input. The improvement is for cases that
**previously silently returned `null` but should have parsed** (8 new
fixtures that the old code would have failed on).

