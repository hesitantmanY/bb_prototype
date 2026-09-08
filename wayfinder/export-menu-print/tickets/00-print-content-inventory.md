---
id: 00
title: 打印“内容成果版”的分步保留清单
labels: [wayfinder:task]
state: closed
assignee: hesitantmany
blocked-by: []
---

## Question

盘点 Work1–Work5 全部 step 的渲染内容，产出一份「内容成果版打印保留矩阵」：哪些元素 / 组件是成果要保留，哪些是编辑骨架必须省略，哪些字段在空值时应连标签一起省略。

背景（已锁原则，见 map.md Notes 6、7）：打印无骨架，有值字段显示「字段名：值」，表格与图表保留，step 标题全部照印，空 step 标题下无正文；输出按 I→V、坊级标题 + 分页、无封面。

需要覆盖：

- Work1–Work4：每个 step 现有哪些内容承载形式（文本 / input / textarea / contenteditable / chip / 表格 / SVG / 只读结论区 / 证据行等），分别映射为「保留（含打印呈现方式）」「省略」「待定」。
- Work5：长文档章节里的 AI 按钮、contenteditable 正文、只读证据块、折叠明细层、SVG 树图/横条图如何取舍；已锁的 T06「打印展开全部明细」是否继续适用。
- 空值判定口径：什么算“该字段无内容”（空串 / 空数组 / 只有占位提示等），供打印侧统一省略。

产出挂到本票 Resolution：按 step 给保留/省略矩阵 + 待定清单，作为 01 号票的输入。

## Resolution

2026-09-07 关票（实现完成，用豆芽妈妈真实案例 + 无头 Chrome 验证）：

- 采用“克隆当前已渲染工作坊 DOM → 就地清洗”的路线，保留原 `#workN/#stepsN/.step` 结构，让各坊既有 CSS（含 W5 长文档样式）继续生效。
- 通用省略集：`button`、`input[type=file/range/hidden]`、`.mvo-card`、`.metric-next`、`.ai-box/.ai-actions/.ai-settings-check/.ai-draft*`、`.progress-bar/.runner-bar`、`.edit-hint`、`.item-add`、`.sbu-toolbar`、`.warning/.notice/.lede` 等编辑/引导件。
- 表单控件文本化：input/textarea/select 的值转为 `.pv-value` 文本；空值直接删除；checkbox/radio 仅保留选中语义；range 移除（数值由同区文本承载或转为文本）。
- 卡片/复选组只保留 `selected/active/input:checked` 对应项；`.sbu-chip` 只保留 `.on`；chip-row 只保留 `.maroon`（已选）。
- 表格：删空行/纯操作列，保留表头与数据表；SVG/横条图保留。
- contenteditable：去掉占位文案（`〔点击此处输入…〕`）后转静态文本；W5 的折叠明细按既有 T06 契约展开。
- 实测（Work2+3+4 构建）：按钮/input/textarea/select/MVO 残留均为 0，14 张表、5 个 SVG 保留，step 标题全部出现。
