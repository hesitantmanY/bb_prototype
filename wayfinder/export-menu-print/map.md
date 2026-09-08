---
title: 导出 ▼ 统一菜单 + 多选工作坊打印（内容成果版）
labels: [wayfinder:map]
---

## Destination

把顶栏「导出 MD」「打印 / PDF」两个出口收进一个「导出 ▼」按钮，展开菜单含「导出 Markdown」「打印 / PDF」两项；打印 / PDF 升级为在模态面板里多选工作坊、一次输出“内容成果版”干净 PDF。地图走完 = 产品决策全部关闭、可直接开工实现。

## Notes

- 领域：原生 JS 无框架应用；导出纯逻辑在 `docs/lib/markdown_exchange.js`；现状打印靠 `@media print` 把全部 `.workshop/.step` 强制显示（`docs/global-brand-building.html` 打印 CSS），因此打印范围无法选择、W1–W4 会带编辑控件。
- 已锁决策（建图 grilling 产出，不再重复开票）：
  1. 顶栏用一个 ghost 风格「导出 ▼」按钮替换现在的「导出 MD」「打印 / PDF」两个按钮；点击展开紧凑菜单，菜单两项：导出 Markdown、打印 / PDF。
  2. Work5 页内工具栏的「打印 / PDF」「导出 Markdown」两个重复按钮删除；导出只从顶栏走。
  3. 导出 Markdown 行为不变（五坊正文 + 文末嵌入数据块、不含 API Key），只是入口改为菜单项。
  4. 点菜单「打印 / PDF」打开居中模态面板：竖排 Work I–V 复选框，默认一个都不勾，至少勾选一个工作坊后「打印」才可点；支持多选、一次打印。
  5. 打印勾选粒度只到工作坊；选中某坊即自动包含该坊全部 step，不提供 step 级选择。
  6. 打印产物为“内容成果版”：不保留任何编辑骨架（按钮 / input / textarea / select / 占位文案 / 添加行 / MVO 卡 / AI 控件 / 空字段标签）；有值字段以「字段名：值」呈现；表格与图表保留；step 标题全部照印，空 step 标题下无正文。
  7. 输出顺序固定 I→V（如勾 Work3、Work5 则先 3 后 5）；每个工作坊前有坊级标题（如「III · 价值主张」）并分页；无封面页。
  8. 案例（demo）模式：「导出 ▼」菜单不可打开（按钮禁用），案例内既不导出 Markdown 也不打印。注意：这与 README/CONTEXT 现状「案例可导出 Markdown」冲突，实现交接需同步改文案与文档。
- Tracker 惯例（本地 markdown）：票号 = 文件名两位前缀；阻塞 = frontmatter `blocked-by`；认领 = frontmatter `assignee` 写 hesitantmany；关票 = `state: closed`。

## Decisions so far

- [打印“内容成果版”的分步保留清单](tickets/00-print-content-inventory.md) — 克隆已渲染 DOM 就地清洗；省略按钮/AI/MVO/占位/添加行等骨架，表单控件文本化，保留表、SVG、step 标题与 W5 明细展开；真实案例实测控件残留 0。
- [打印保留清单的例外确认](tickets/01-print-exceptions.md) — 空字段连标签省略、空 step 只印标题；表格空行/纯操作列删除但表头保留；表格内 AI 解释 `.hint` 保留；W4 叙事正文不参与打印；W5 T06 明细打印展开。

## Not yet specified

- 打印验收与回归测试清单：等“内容保留清单 / 例外确认”关票后，可据此补开“测试清单”票（如：打印无按钮/输入残留、空字段不出现、SVG/表格在打印容器内完整、案例下菜单不可开）。
- 实现机制（瞬态 DOM 克隆清洗 vs 为打印单独生成只读 DOM）属于开工实现细节，不在图内定；但实现必须以已锁决策 6、7 为验收口径。

（实现已按锁决策落地于 `docs/lib/export_menu.js` + `docs/global-brand-building.html`，`tests/export_menu.test.js` 8/8 通过；无头 Chrome 实测打印 DOM 无按钮/输入/MVO 残留。遗留 3 个渠道树相关测试失败与本次改动无关，来自工作区既有 W5 渠道树未完成改动。）

## Out of scope

- 把「导入 .md」「历史记录」「保存」并入导出菜单。
- 案例模式下任何导出/打印豁免（已锁决策 8）。
- step 级或章节级打印粒度（已锁决策 5）。
- 服务端 PDF 生成（2026-09-08 修订）：导出菜单「打印 / PDF」升级为「导出 PDF」——
  前端 `docs/lib/pdf_export.js` 生成 A4 HTML（前序工作坊关键结论 + Work5 成稿），
  本地后端 `/api/pdf` 用 Playwright 渲染下载；不再走浏览器 `window.print()`。
