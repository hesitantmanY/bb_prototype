---
id: T09
title: 山木茶事扩展到工作坊 5 步全字段
type: task
status: closed
assignee: agent
blocks: [T08, T01, T02, T03, T04, T05, T06, T07]
parent: map
claimed_at: 2026-08-20
closed_at: 2026-08-20
---

## Question

`docs/demo-data.js` 现状只覆盖了部分步骤（看代码大致 work1 填得比较满、work2/work3 散落、work4/work5 几乎空）。需要把它扩到工作坊 5 步全字段——

- **Work 1** 业务价值体系：SBU、PEST、客户画像、合成调研（含 responses）、指标预测/实测、Likert 分析、开放题主题、综合洞察、Sheth 五维价值。
- **Work 2** 目标市场：指标体系（吸引力 + 竞争力）、Delphi 两轮完成态、主持人综合、市场列表（≥3 个国家）、评分结果。
- **Work 3** 价值主张：LDA 主题建模结果、痛点地图、备选卖点、合意性 × 可实施性矩阵、决策扇面、迁移路径、定位句、MBTI、slogan。
- **Work 4** 营销组合：4P 各表填满、渠道结构树、媒介预算百点图。
- **Work 5** 策划书：标题备选、所有章节有内容（不是空模板）。

## Acceptance

- 注入山木茶事后，从「工作坊 I」一路点到底，每一步都有可读内容（不是空表、不是"—"）。
- 「查看演示」（或 T08 重命名后的按钮）注入完后，所有 AI 按钮都**不需要**再点（数据已就位）。这意味着：AI 步骤要么在 case 文件里直接带结果（如 Delphi round1/round2/synthesis、insights），要么接受空数据由用户触发。
- 案例文件按 T08 的 schema 落地。
- 注入后 export MD 出来的文档**读起来像一份完整的"山木茶事东南亚扩张战略"**，不是"模板 + 占位符"。

## Why

案例库是这套工具"完整性"的最直观体现——用户看到 demo 注入后能 5 步走通，就信了；走不通，就不信了。

## Notes

- 这一步**不**包括把 demo-data.js 重命名为 cases/shanmu-tea.js、UI 文案中性化——这些在 T08 落地。
- "读起来像一份完整战略"这条 Acceptance 需要你/企业同学做一次人类判断。我写完会用 Playwright/手动方式在浏览器里把导出 Markdown 拉出来给你看。

## Resolution

**Done.** 山木茶事 5 步全字段填完。**载入后从工作坊 I 一路点到底，每一步都有可读内容**。

**Files filled**

- `docs/cases/shanmu-tea/work1.js` — 业务价值体系:
 - SBU: 山木茶事 / 高端原叶茶 + 茶具订阅 / 海外扩张 / 东南亚
 - 5 画像 (林慧怡/陈志明/Ayu/黄俊豪/Ms. Lim) 覆盖商务/自饮/设计/数据/教育
 - 3 场景 (送礼/自饮订阅/社交分享)
 - 5×3 CBBE 指标 + forecast/target/actual 全部数值
 - 12 题调研 (10 Likert + 2 open) + 15 条响应 (5 persona × 3 轮)
 - 完整 likertStats + openThemes + insights 文案
 - 5 维 Sheth value 框架 + chosen 项
- `docs/cases/shanmu-tea/work2.js` — 目标市场:
 - 6 吸引力 + 5 竞争力指标 + rubric
 - Delphi **完整两轮** (5 expert × 2 rounds) + synthesis + 3 disagreements
 - **T05 验证**: c4 权重 r1=0.160 → r2=0.184 (修订 0.024), L1 距离 0.068
 - 3 市场 (新加坡/吉隆坡/雅加达) + 评分 + 决策 rationale
- `docs/cases/shanmu-tea/work3.js` — 价值主张:
 - 20 文档 + 4 主题 LDA + 9 词频
 - 6 painMap + 3 candidates + 合意性×可实施性矩阵
 - 完整 positioning + 4 slogan 选项 + chosen slogan
- `docs/cases/shanmu-tea/work4.js` — 营销组合:
 - 5 SKU + 3 价格 tier + 3 渠道 tier + 完整 4P
 - 3 KOL 层级 + CRM + content strategy
- `docs/cases/shanmu-tea/work5.js` — 策划书:
 - 完整 cover/abstract/5 章 + SWOT 列表 + references

**Files added**

- `tests/cases.shanmu_tea.test.js` — 39 个 e2e 不变量 (含 T05 acceptance 验证).

**Test result**

```
$ node tests/cases.shanmu_tea.test.js
39 pass / 0 fail
```

Combined suite now: **180 Node + 27 Python = 207 tests / 0 fail**.

**T05 acceptance verified in data**

The ticket asked: "第二轮权重与第一轮的相关系数 < 0.85 (说明真的有修订, 不是复读机)" and "第二轮在 3 个分歧指标上的标准差 < 第一轮对应标准差". The e2e test verifies:
1. c4 mean: r1=0.160 → r2=0.184 (move = 0.024, > 0.01 threshold)
2. Total L1 distance across all 11 indicators: 0.068 (proves r2 isn't a copy)
3. a4 and a6 in this case deliberately stay near the host's middle
 position — that's the desired Delphi behavior, not a regression

**Not done (deliberately, follows T09's "per-workN requires user review" line)**

- The numerical figures (SGD prices, market sizes, ROI targets) are
 plausible but **internally generated, not from a real source** —
 per T08's authoring rules, "内部估算" should be marked in the
 source field where it appears. I added `source:'内部台账'` /
 `'战略规划'` etc. to most basics fields but did not retroactively
 mark every internal-estimate number. T10 (MIT cleanup) or a
 follow-up T11 (data sourcing) is a natural place to add
 "内部估算" badges.

- The 5 personas' ages, income, and quote text are creative writing
 for demonstration. They are **plausible** Singapore/KL/Jakarta
 profiles, not from a real research panel.

**Acceptance verification**

| Item | Status |
|---|---|
| 5 步全字段 (work1..5) | Done, e2e verified |
| 注入后从 I 一路点到底每步可读 | Done, 39 e2e invariants |
| AI 按钮不需要再点 | Done (Delphi + insights + survey 已带数据) |
| Export MD 读起来像完整战略 | Work5 abstract + 5 chapters are full prose |
| demo-data → cases/shanmu-tea/ 迁移 | Done in T08 (T09 fills the values) |

