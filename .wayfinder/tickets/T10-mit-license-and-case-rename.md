---
id: T10
title: MIT LICENSE + README 徽章 + 教学化叙事禁词落地
type: task
status: closed
assignee: agent
blocks: [T08, T09]
parent: map
claimed_at: 2026-08-20
closed_at: 2026-08-20
---

## Question

开源相关的最后一步：

1. **加 `LICENSE` 文件**（MIT 标准文本，copyright 写你 + 年份）。
2. **README 顶部加徽章**：`[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)`。
3. **教学化叙事禁词扫一遍代码 / 文案**：
 - `docs/demo-data.js` → 重命名 / 迁移到 `docs/cases/shanmu-tea.js`（由 T08 决定具体形态）
 - 「查看演示」按钮 → 中性化（"载入案例" / "换一个项目" / 别的）
 - 全局 grep：`演示 / 教学 / 样例 / 虚拟 / AI 生成 / 练习 / 模拟` —— 任何命中评估：留 / 改 / 删
 - `work1.analysis.insights` 里如果有"（以上为演示）"之类尾注，删
4. **文档小更新**：
 - README "配置 LLM" 章节加 T02 后的 provider 适配层说明
 - README "工作坊" 表格加一列"数据是否已填好"（yes / no / partial）
 - 新增 `docs/cases/README.md`：怎么添加新案例（指向 T08 的 SCHEMA.md）

## Acceptance

- 仓库根有 `LICENSE`，`head -1 LICENSE` 是 MIT 标准版权行。
- README 第一屏能看到 MIT 徽章。
- `grep -rE '演示|教学|样例|虚拟|AI 生成|练习|模拟' docs/ server/ README.md` 没有任何"会让用户怀疑数据真实性的"命中（产品文案意义上的命中可以保留——比如 demo-data 改成 cases/ 之后，路径里已经没有"demo"了）。
- 任意一个不熟悉这套工具的人打开页面，看不到"这是演示" / "这是教学" / "这是 AI 生成的样例"之类的标签。

## Why

发布前的最后一道工序。T08 决定了 case 文件怎么放，T10 负责"放到对的地方 + 拿掉所有暗示标签"。

## Resolution

**Done.** MIT LICENSE + README 徽章 + 教学化叙事禁词落地。

**Files added**

- `LICENSE` — MIT 标准版权文本，copyright 2026 hesitantmany.

**Files changed**

- `README.md`:
 - 顶部加 `[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)` 徽章
 - 「工作坊」表格新增「案例数据」列，5 步全标"已填好"（含具体字段计数）
 - 「架构」段补充 `docs/lib/*.js` 和 `docs/cases/<brand>/` 两个目录
 - 新增「支持的 LLM Provider」子段，7 个 provider 表格说明 JSON mode 能力（来自 T02 的 `docs/lib/providers.js`）
- `docs/global-brand-building.html`:
 - 注释 "Demo 模式" → "案例只读模式"
 - saveStatus 文案 "演示模式 · 不会保存" → "案例只读 · 不会保存"
- `docs/workshop3.js`:
 - LDA fallback 按钮文案 "将用 LLM 模拟" → "将用 LLM 推断"（描述功能，不描述数据）
- `docs/workshop1.js`:
 - 「AI 生成 SBU」system prompt: "虚构战略业务单元 / 适合练习" → "战略业务单元 / 适合出海/OBM 转型"（去掉虚构/练习标签）

**Not changed (deliberately, per T08 "其它保留" decision)**

- `docs/specs/*` 产品规格文档保留（dev 文档，非用户可见）
- 「用 AI 生成 X」按钮文案保留（描述**工具在做什么**，不是描述**数据是什么**）
- 「随机生成示例」按钮保留
- 「LDA 主题建模模拟器」system prompt 保留（机器读，不显示给用户）
- code 注释里偶尔出现的 "演示" 词（dev-internal）

**Test result** — 207 测试仍全过（无回归）：
```
$ for t in tests/*.test.js; do node $t; done
180 pass / 0 fail
$ python3 server/llm_validate.py && python3 server/gemini_body.py
18 + 9 pass / 0 fail
```

**Acceptance verification**

| Item | Status |
|---|---|
| `LICENSE` is MIT, copyright 2026 hesitantmany | Done |
| README 顶部 MIT 徽章 | Done |
| 用户打开页面看不到"演示/教学/样例/虚拟/AI 生成的样例"标签 | Done (3 处用户可见改动) |
| `grep` 命中 (排除注释 + specs) | 1 命中, 是 fallback 提示, 描述功能而非数据 — 保留 |
| 工作坊表格加"数据是否已填好"列 | Done (改名"案例数据", 5 步全标"已填好"含具体字段计数) |
| `docs/cases/README.md` (案例添加指南) | 已在 T08 用 `docs/cases/SCHEMA.md` 替代; 不重复 |

**Production behavior change** — none. T10 is purely cosmetic /
publication prep. All test suites green, no state schema change.

**Open (logged, not blocking)**

- `docs/specs/*` 仍含"演示"字样 — T10 acceptance 明确"其它保留"原则,
 specs 文档是 dev 文档, 不修
- 内部 dev 注释里 "演示" 词 (work1.js:191, 1188; workshop3.js 注释) — 同上

**Goal achieved: all 10 tickets closed.**

```
T01 extractJson 容错回退
T02 response_format provider/model 白名单
T03 Gemini 代理 system 角色 + JSON mode
T04 askPersona schema 改纯英文 + 答错回退
T05 Delphi 第二轮 prompt 修复
T06 后端 LlmRequest 校验
T07 AI 输出体检：schema 校验 + 自动重试 1 次
T08 案例库元数据 schema 设计
T09 山木茶事扩展到工作坊 5 步全字段
T10 MIT LICENSE + 教学化叙事禁词落地
```

Track A (AI 修稳) 7 张 + Track B (案例库) 3 张全部完成。
**累计测试**: 180 Node + 27 Python = **207 / 0 fail**.
**wayfinder effort 完结** — 见 `.wayfinder/map.md` 的 "Decisions so far" 段。

