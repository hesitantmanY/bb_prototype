---
title: 策划书第 4 章完整承接 Work4 的 4P（结构收敛 + 渠道表图 + 关键伙伴分类）
labels: [wayfinder:map]
---

## Destination

Work5 策划书第 4 章“营销组合”完整、可信地承接 Work4 的 4P 内容。章节结构收敛为：4.1 渠道路径 / 4.2 营销组合 4P（4.2.1 摘要表 4-1、4.2.2 渠道结构（表 4-2 + G7 树图）、4.2.3 媒介预算）/ 4.3 4C / 4.4 反应机制（新，同步区块直读 W1 指标 Δ + 块内 AI 起草）；4P 详述维持折叠 detail 不占编号。支撑改造：Work4 数据模型升级 `place.keyPartners → [{name, side}]`（分类在生成时完成）、summaryText 承接缺口修复、存量迁移与案例定稿。地图走完 = 全部决策关闭、可直接开工实现；实现本身不在图内（Plan, don't do）。

## Notes

- 领域：Work4 是渠道数据（place）唯一属主；Work5 对应区块是只读同步（见 CONTEXT.md“同步区块”）。术语定稿随手落 CONTEXT.md。
- 每个会话先读本图再领票；grilling 票走 /grilling + /domain-modeling，一次一问，答案记进票内“## Resolution”后关票。
- Tracker 惯例（本地 markdown）：票号 = 文件名两位前缀；阻塞 = 票 frontmatter `blocked-by`；认领 = frontmatter `assignee` 写 hesitantmany；关票 = `state: closed`。
- 已锁决策（建图与重画时 grilling 产出，作为既定输入，不重复开票）：
  1. 渠道结构展示：G7 树图（`Work4.renderChannelTree`）单载体含伙伴行；表 4-2 已取消（01 号票推翻原“表 + 图都要”）；F13 treemap 不搬；
  2. 关键伙伴进树图不进表：伙伴行按 side 挂对应一级分组（按位置 structure[0]/[1]），AI 起草生成时分类、side 为空不进图只提示行（01 号票）；
  3. 分类属主在 Work4（数据模型层），Work5 保持只读，展示层不调 AI；
  4. 分类时机：AI 起草生成时带 side；手动输入标签旁选；案例写死源数据；旧存档启发式初值 + 手改；**不设**独立“AI 分类”按钮；
  5. 影响面已评估：中等偏小；通用 tags 渲染器（7 字段共享）不动，keyPartners 单做变体；
  6. 大纲：4.3/4.4 降为 4.2 底下三级标题（4.2.1 摘要 / 4.2.2 渠道结构 / 4.2.3 媒介预算），4C 前移为 4.3；表 4-1 编号不变，表 4-2 随取消不复存在（01 号票）；4P 详述不占编号；
  7. 4R/4I 不做正文小节；内容落点 = 4P 详述折叠层 + 4C 四格 + 第 3 章（逐条映射见“4P 承接差距审计”的 resolution）；需要框架对照时再议折叠层；
  8. 已知承接缺口三处：真丢 1 处（localChannelRelations 不在 summaryText）、藏而不丢 2 处（渠道激励、媒介 message/KPI）——去留由审计票定。
  9. （审计票锁）只升 place 执行项：渠道激励 + 本地渠道关系升入 4.2.2；promotion 执行项留折叠层；表 4-1 压缩度维持；4.4 反应机制 = 4C 之后新二级节（W1 指标 Δ 同步引用，偏差最大 3 项；块内 AI 起草按钮、覆盖语义、不进一键汇总；W1 无实测时置灰降级；4I 维持不做）。逐问细节见票。
  10. 2026-09-07 全部 7 张票关闭，地图走完；实现交接给 codex，交接提示词存本目录 handoff.md（实现不在图内，交接点 = Plan 的终点）。

## Decisions so far

- [4P 承接差距审计](tickets/00-4p-intake-audit.md) — localChannelRelations 补进 summaryText('place')；只升 place 执行项入 4.2.2（渠道激励 + 本地渠道关系），promotion 项留折叠层；表 4-1 维持 30 字/3 行压缩；新增 4.4“反应机制”（W1 指标 Δ 同步引用 + 块内 AI 起草按钮，无实测降级）。
- [G7 树图形态（含伙伴行）与边界情形](tickets/01-tree-shape.md) — 表 4-2 取消、树图单载体；伙伴行虚线无占比条、按位置挂组；分组块标签补合计；structure 空整块降级不显伙伴；side 空不进图只提示行；≠100 提示属主 Work4（移交 03 号票）。
- [Work4 编辑与生成改造](tickets/03-work4-edit-draft.md) — chip 复用 sbu-seg 双键段控（未分类=两键不亮、再点取消、手动新增默认未分类）；kind 'partners' + schemaKey 'partnerList' 宽进归 null、解析层不做启发式；MVO 不加分类条目；默认/覆盖语义维持 ADR 0008；≠100 callout 与 structure 顺序约束承接自 01 号票。
- [4.2.2 的导出与打印归属](tickets/02-export-print.md) — md 导出走缩进列表数据投影（树图不嵌、对齐“导出不嵌图”惯例，注“图见应用内”）；树图放主层不进 T06；打印走 DOM/SVG 满宽无新机制。
- [存量迁移规则](tickets/04-migration-rules.md) — 挂 Work4.migrations 注册表载入时升格 [{name, side:''}] + 词表预填（substring，线上 18 词/线下 15 词，未命中归未分类）；渲染层不做双形兼容。
- [案例源数据定稿 + bundle + SCHEMA](tickets/05-case-data-finalize.md) — 5 案例 16 条伙伴全部分类写死（SIMM/CIMT 展会随案例自身 structure 定线下）；bundle.js 重建、SCHEMA.md place 契约更新。
- [测试清单](tickets/06-test-inventory.md) — 5 组断言：partnerList 宽进矩阵、迁移升格+词表、树图渲染（伙伴行/位置挂载/两个降级）、大纲编号回归、≠100 callout + summaryText 含 localChannelRelations；最小化、不引框架。

## Not yet specified

（无——2026-09-07 全部票关闭，地图走完；实现交接见本目录 handoff.md。）

## Out of scope

- Work4 工作台自身的渠道表/图改动（现状够用）。
- F13 treemap 搬运（已决策不搬）。
- 4R/4I 正文小节（已锁决策 7）。
- 自动追问/主持机制（论文 Hybrid 3 的 moderation，平台未实现，需另立努力）。
