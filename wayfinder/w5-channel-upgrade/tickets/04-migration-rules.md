---
id: 04
title: 存量迁移规则
labels: [wayfinder:grilling]
state: closed
assignee: hesitantmany
blocked-by: []
---

## Question

存量数据迁移规则如何定？

(a) heal 归一化：keyPartners `string[] → [{name, side:''}]` 挂在哪——work4 自愈逻辑还是 schema_migrate 迁移注册表；保证旧版本/旧结构数据载入不丢内容。
(b) 关键词启发式初值词表：哪些词进线上（平台/电商/KOC/MCN/直播/独立站…），哪些进线下（经销/商超/门店/医院/基地/展会…）；猜错靠手改。
(c) 启发式与“表 4-2 行布局”所定 side 空呈现方式的衔接；side 空时 Work5 展示不得丢数据。

背景：迁移跑在浏览器同步代码里不能调 AI（已锁决策 4）；blocked-by 01 是因为“其他”行的形状影响 (c) 的落地。

## Resolution

2026-09-07 关票，一次确认全收：

- **(a) 挂 `Work4.migrations` 注册表**（workshop4.js:1467 现成契约，载入时自动跑，历史快照恢复/案例导入全路径覆盖）：看到 keyPartners 字符串数组 → 升格 `[{name, side:''}]` → 跑词表预填 side。渲染层永远只见新形状，不做双形兼容。
- **(b) 词表锁定**（substring 匹配）：线上 = 平台、电商、Amazon、TikTok、Shopee、Lazada、独立站、官网、小程序、App、直播、KOC、KOL、MCN、博主、UP 主、种草、社媒；线下 = 经销、代理、商超、KA、超市、门店、专柜、直营、批发、分销、连锁、终端、医院、基地、展会。未命中 → `side:''` 走未分类提示行；猜错靠手改。
- **(c) 衔接 01 号票**（side 空不进图、图下提示行、导出同形），无新决策。
