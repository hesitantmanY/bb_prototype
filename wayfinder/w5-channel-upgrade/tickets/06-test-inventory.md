---
id: 06
title: 测试清单
labels: [wayfinder:grilling]
state: closed
assignee: hesitantmany
blocked-by: []
---

## Question

本图改动落地时的测试清单怎么定（毕业自地图雾区，00/01 号票已关）：

(a) work5_core_evidence fixture 的更新范围——大纲编号回归（4.2.1/4.2.2/4.2.3/4.3/4.4）。
(b) G7 树图渲染断言——伙伴行、按位置挂载、structure 空降级、side 空提示行。
(c) 迁移断言——keyPartners 字符串数组 → [{name, side}] 启发式（等 04 号票定形）。
(d) Work4 侧——≠100 callout、MVO“伙伴已分类”条目（等 03 号票定形）。

背景：测试编写本身不在图内（Plan, don't do）；本票定清单与验收口径。

## Resolution

2026-09-07 自答关票（00-05 全关后清单已完全定形，无剩余决策）：

1. **解析**（入 tests/work4_parse.test.js 惯例文件）：`partnerList` 宽进矩阵——字符串项升格、side 缺失/非法归 null、单项缺 name 丢弃不毁整组、顿号/换行兜底。
2. **迁移**：string[] → `[{name, side:''}]` 升格不丢数据；词表命中/未命中各取代表词断言。
3. **树图**：伙伴行渲染（◇ 前缀、无占比条）、按位置挂 structure[0]/[1]、分组块标签含合计、structure 空降级提示、side 空图下提示行。
4. **大纲编号回归**：work5 fixture 断言第 4 章标题序（4.2.1/4.2.2/4.2.3/4.3/4.4）与导出 md 投影形状。
5. **Work4 杂项**：≠100 callout 显隐、summaryText('place') 含 localChannelRelations。

断言最小化、跟随仓库既有 tests/ 惯例，不引测试框架。
