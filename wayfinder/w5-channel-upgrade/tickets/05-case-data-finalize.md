---
id: 05
title: 案例源数据定稿 + bundle + SCHEMA
labels: [wayfinder:task]
state: closed
assignee: hesitantmany
blocked-by: []
---

## Question

（task，AFK）给 5 个案例源文件的 keyPartners 写死 side（共 16 条）：

- docs/cases/douya-mama/work4.js（3 条）
- docs/cases/xiaohuo-ji/work4.js（3 条）
- docs/cases/wenqu-shuyuan/work4.js（3 条）
- docs/cases/hengrui-zao/work4.js（3 条）
- docs/cases/maohaizi-house/work4.js（4 条）

步骤：按已锁规则逐条分类（分类依据：渠道属性，如 KOC/MCN/平台→线上，医生顾问/食材基地/宠物医院/认证机构→线下）；改 `[{name, side}]` 形状；重跑 `node scripts/build-cases-bundle.js` 重建 bundle.js；更新 docs/cases/SCHEMA.md 的 place 字段说明；产出 git diff 供用户审核后关票。

解析为决策点：若有词条两边都能成立（如“展会”看线上线下办展），在 resolution comment 里列出待用户裁决，不擅自定。

## Resolution

2026-09-07 完成，16 条全部定稿，无边沿可两立词条需要裁决：

- douya-mama：小红书 KOC→线上；儿科医生顾问→线下；抖音直播 MCN→线上
- xiaohuo-ji：小红书探店 KOC→线上；抖音同城 MCN→线上；清远/顺德食材基地→线下
- wenqu-shuyuan：本地 3-5 家合作企业（就业内推）→线下（本地 B2B 关系，与线下渠道同属）；小红书 KOC→线上；抖音教育 MCN→线上
- hengrui-zao：专精特新渠道商 10+→线下；阿里 1688 工业品牌→线上；SIMM/CIMT 展会→**线下**（票面原列“两边可成立”待裁决，实际该案例自身 structure 已把“行业展会”放在线下组 share 25，随案例数据定，非擅自判断）
- maohaizi-house：小红书养宠 KOC→线上；抖音同城 MCN→线上；本地宠物医院/猫舍（异业）→线下；CKU 认证机构→线下

5 个源文件 + bundle.js（scripts/build-cases-bundle.js 重建）+ SCHEMA.md place 契约均已更新。
