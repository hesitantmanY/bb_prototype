---
id: 03
title: Work4 编辑与生成改造
labels: [wayfinder:grilling]
state: closed
assignee: hesitantmany
blocked-by: []
---

## Question

Work4 侧的编辑与生成如何改？

已议定：

- (a) 手动 side 选择器 = 复用 Work1 业务三问的双键 segmented control（`sbu-seg`/`sbu-segmented`，is-on 黑底白字 + aria-pressed + 状态小字），chip 内嵌“线上 | 线下”两键；扩展点：初始两键不亮 = 未分类，点亮的键再点一次取消（SBU 原版无取消）。手动新增默认未分类。通用 `Work4.tagBox` 不动，keyPartners 单做变体渲染器。
- (b) guide 改“对象数组 [{name, side}]，side 枚举 线上/线下，判断不了省略 side”；字段 kind 新增 `'partners'`（7 个 tags 字段零波及），SchemaCheck items 校验（required name，side enum 含 null）。解析走新 schemaKey `'partnerList'`，仿 tagList 宽进：字符串项升格 {name, side:null}、side 缺失/非法归 null、JSON 全挂退顿号/换行切分；单项缺 name 丢弃不毁整组。AI 没给 side 时解析层**不做**启发式补分类（归 null 走未分类提示行，启发式只服务旧存档迁移）。
- (c) MVO 不加“伙伴已分类”条目，维持“列了关键渠道伙伴”原检查——side 是质量属性不是存在性，未分类已有 chip 状态小字 + W5 提示行双重可见性，不为两键段控加完成门槛（对齐闸门语义“只提醒不阻断”）。

待议：

(d) 数据模型切换后，place 默认值与 AI 起草整体替换（已有内容覆盖）的合并语义是否需要调整。
(e) （01 号票 (e) 移交）渠道结构表下方 ≠100 合计提示 callout——只提示不阻断。
(f) （01 号票 (b) 移交）AI 起草 schema 约束 structure 一级固定 线上/线下 顺序——展示层按位置挂伙伴行的前提。

背景：已锁决策 3/4/5（本图 Notes）；AI 起草在生成时输出 side，是新分类的正路。

## Resolution

2026-09-07 关票。(a)(b)(c) 见上；其余三问均由既有决策直接推出，不构成新决策，当场锁：

- **(d) 无需调整**：默认 `keyPartners = []`（不预置示例伙伴）；AI 起草整体替换 = ADR 0008 现状（整组覆盖 + 确认弹窗，未含 key 不动），数组形状变化零新语义；旧 string[] 兼容只在迁移 heal 层做一次（04 号票），渲染器只认归一化对象，不做双形兼容。
- **(e) ≠100 callout**：落 Work4 结构表下方，只提示不阻断（01 号票已锁，此处仅承接实现范围）。
- **(f) structure 一级顺序约束**：AI schema 固定 线上/线下 顺序（01 号票已锁，此处仅承接实现范围）。
