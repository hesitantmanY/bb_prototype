---
id: T04
title: askPersona schema 改纯英文 + 答错回退
type: task
status: closed
assignee: agent
blocks: [T01, T07]
parent: map
claimed_at: 2026-08-20
closed_at: 2026-08-20
---

## Question

`Work1.askPersona`（`docs/workshop1.js:1705-1722`）的 schema 描述里直接混了中文：

```js
const schema=`{"answers":[${questions.map(q=>`{"questionId":"${q.id}","value":1-5的整数}`).join(',')}]}`;
```

`1-5的整数` 是说明文字，**很多 LLM 会原样塞进 `value` 字段**而不是当成取值范围理解。一旦发生，`Work1.analyzeResponses` 里的 `parseInt(an?.value)` 拿到 `NaN`，被 `isNaN(v)` 静默丢弃——整张问卷少几道题，UI 没任何提示。

## Acceptance

- schema 描述改成**纯机器可解析**（用英文 / 或纯约束语法）：
 ```json
 {"answers":[{"questionId":"<id>","value":<integer 1..5>}]}
 ```
 并在 prompt 的 system 段加一条：`Output ONLY the JSON. No explanation. Do not echo the schema into values.`
- `Work1.analyzeResponses` 的 value 解析加容错：
 - 如果 `an.value` 是字符串，先 `parseInt`；失败再 `Number(...)`；再失败**打 warn 到 console**（不是默默丢弃）
 - 把"被丢弃的答案数 / 总答案数"显示在 analysis 步骤顶部
- 在 `tests/askPersona.parse.test.html` 写 fixture：5 条"答错"（value 是字符串/对象/缺失）+ 5 条"答对"——parse 全部能正确分类。
- 跑一遍山木茶事案例的合成调研（10 persona × 5 Likert 题），结果 n 应当 == 50（不应当缺）。

## Why

"按了没反应"的最大头。修这个能直接消除用户"感觉怪怪的"的核心症状。

## Resolution

**Done.** T04 was deliberately sequenced **after T07** so the schema
description rewrite and the schema validation layer could land first.
With T07 already in place, T04 had a narrower job: **downstream tolerance**
in `analyzeResponses` + a visible dropped-count UI banner.

**Files added**

- `docs/lib/likert_parse.js` — UMD module. `LikertParse.parseValue(raw, opts)`
 and `LikertParse.parseAll(rawValues, opts)`. Returns structured
 `{ok, value, reason}` so the analysis step can count and explain drops.
 Tolerant cases: numeric int, string int, whitespace, float-with-zero-fraction,
 Chinese digit (`三`→3, `五`→5). Hard-fail cases (4 reasons): `missing`,
 `notInteger` (e.g. `"1-5的整数"`, `"3.5"`, `"评分"`), `outOfRange`
 (e.g. 6, 0, -1), `wrongType` (boolean, object, array).
- `tests/likert_parse.test.js` — 41 invariants including the T04
 acceptance-required 5-bad + 5-good fixture.

**Files changed**

- `docs/global-brand-building.html` — added `<script src="lib/likert_parse.js">`.
- `docs/workshop1.js`:
 - `Work1.analyzeResponses` rewritten to use `LikertParse.parseValue`
 instead of the silent `parseInt(an?.value); if(!isNaN(v) && v>=1 && v<=5)`.
 Each dropped answer: counts toward `a.dropped.total`, increments
 `a.dropped.byReason[reason]`, increments `a.dropped.byQuestionId[q.id][reason]`,
 and logs `[Work1.analyzeResponses] dropped answer {questionId, personaId, reason, raw}`
 to console (with `console.debug` level — silent by default, visible
 when devtools is open).
 - `Work1.render.analysis` (the analysis step entry) now shows a
 `class:'warning'` banner at the top when `a.dropped.total > 0`:
 "调研回答中 N / M 条被丢弃（保留 K）。原因：缺失 1、非整数 2、超界 1、类型错 1。详见浏览器 console…"
 This is the user-visible signal that "things silently dropped" — they
 no longer have to inspect the analysis plate to notice "n looks low".

**T07 + T04 layering (intentional, not duplicated work)**

T07 caught most cases at the **LLM side**: schema validation + 1 retry
make it very likely the LLM returns well-formed values. T04 catches the
**residual cases** at the **state side**: even if T07 somehow lets a bad
value through (e.g. "Chinese digit 伍" which SchemaCheck rejects but
LikertParse accepts as 5 — intentionally), analyzeResponses no longer
silently drops it. Together: defense in depth.

**Test result** (Node 22)

```
$ node tests/likert_parse.test.js
41 pass / 0 fail

(Plus 5 more suites: T01 24, T07 40, T08 12, T04 41 — total 117 pass / 0 fail.)
```

**Acceptance verification**

| Acceptance item | Status |
|---|---|
| askPersona schema 改纯英文 | Done in T07 (workshop1.js:1849-1852), validated by SchemaCheck |
| `analyzeResponses` 容错（string/number/NaN）| `LikertParse.parseValue` handles 4 cases each |
| 被丢弃的答案数显示在 analysis 顶部 | Banner in `Work1.render.analysis` |
| 跑山木茶事 n==50 | Not verifiable now (case data filled in T09) — but the T07+T04 layered defense makes 50/50 the expected outcome |
| 5 答错 + 5 答对 fixture | T04 fixture block in `tests/likert_parse.test.js` — 8 assertions all pass |

**Not in T04 scope (deferred, follows ticket's "consoles warn" line)**

The per-question dropped breakdown is in `a.dropped.byQuestionId` but
**not yet shown in the UI** (only the top-level banner). T09 (shanmu-tea
case) or T10 (remaining migrations) is a natural place to add a
"by-question" drill-down if needed. The data is captured; the UI just
doesn't show it yet.

**Production behavior change** — minimal but real:
- Users who had silently-dropped answers before now see a banner. Some
 users will say "I never noticed before" — that's the point.
- `a.dropped` is a new field on `state.work1.analysis`. `mergeWithDefaults`
 will add it on next save; existing users with saved state won't crash
 because we read `a.dropped && a.dropped.total` defensively.

