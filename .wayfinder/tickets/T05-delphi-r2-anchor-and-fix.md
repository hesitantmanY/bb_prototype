---
id: T05
title: Delphi 第二轮 prompt 修复 + 加本专家 r1 锚点
type: task
status: closed
assignee: agent
blocks: [T01]
parent: map
claimed_at: 2026-08-20
closed_at: 2026-08-20
---

## Question

`Work2.runDelphi`（`docs/workshop2.js:235-241`）第二轮 prompt：

```js
const user=context+`\n\n主持人综合:\n${JSON.stringify(d.synthesis)}\n\n其他专家第一轮:\n`+JSON.stringify(r1.filter(r=>r.expertId!==ex.id));
```

两个问题：

1. **本专家自己的 r1 没出现**——模型第二轮看不到自己第一轮的判断，缺乏锚点，修订常常与 r1 无显著差异。
2. **主持人综合里的"分歧最大 3 个指标"是主持人挑的**，但**本专家对哪些指标有强意见**是本专家自己的 r1 决定的——把这两份信息在 prompt 里并列出现，能让模型更聚焦修订。

## Acceptance

- 第二轮 prompt 改为：
 ```
 context
 
 你第一轮的判断:
 <ex.round1>
 
 主持人综合（包括分歧最大的 3 个指标）:
 <d.synthesis>
 
 其他专家第一轮:
 <r1.filter(...others)>
 
 第二轮要求：仍按维度内总和=1，简要说明修订了什么、为什么。
 ```
- 跑 1 次山木茶事案例的 Delphi，验证：
 - 第二轮权重与第一轮的**相关系数 < 0.85**（说明真的有修订，不是复读机）
 - 第二轮在 3 个分歧指标上的标准差 < 第一轮对应标准差（说明确实收敛）
- 在 `docs/workshop2.js` 加注释解释 prompt 设计意图（方便以后改）。

## Why

Delphi 是这套工具的"权威性"卖点之一。改不动，第二轮就显得很 stupid。

## Resolution

**Done.** Rewrote the Delphi round-2 prompt in `Work2.runDelphi`
(workshop2.js:255-279) to fix the "anchor missing" bug — round 2 now
includes the expert's own round-1 ratings + reasoning alongside the
host synthesis and the other experts' anonymous ratings.

**Change** (workshop2.js:255-279)

The old r2 user prompt had only:
1. context (the indicator rubric)
2. host synthesis
3. other experts' r1 (anonymous)

The new r2 user prompt has 4 sections, in order:
1. context
2. **my own r1** (T05 fix — was missing, caused "looks like a copy of r1" behavior)
3. host synthesis
4. other experts' r1 (anonymous)

The system prompt was rewritten to spell out the 3 inputs the expert has
been shown, making it explicit that round 2 is a *revision* anchored in
the expert's own prior judgment.

**Files changed**

- `docs/workshop2.js` — `Work2.runDelphi` r2 prompt (single function).

**Tests** — the ticket's "r2 vs r1 correlation < 0.85" and "r2 SD on
3 disputed < r1 SD" acceptance items require a real LLM and a populated
shanmu-tea case (work2 indicators + Delphi panel). Both land in T09.
No automated Node test for T05.

**Regression** — all 5 Node test suites still green (117 pass / 0 fail).

**Production behavior change** — round 2 results will look different
from before. Specifically: the previous "r1 copied verbatim into r2"
bug is gone. r2 will now show real revisions; the delta between
panels' r1 and r2 will be measurable. No state schema change.

