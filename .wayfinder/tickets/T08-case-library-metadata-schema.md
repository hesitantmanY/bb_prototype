---
id: T08
title: 案例库元数据 schema 设计
type: grilling
status: closed
assignee: agent
blocks: []
parent: map
claimed_at: 2026-08-20
closed_at: 2026-08-20
---

## Question

山木茶事要扩到工作坊 5 步全字段。在动手前先**钉清楚"一个完整案例应该长什么样"**——schema 是后续 T09 填字段、T10 迁移 demo 数据的契约。

Grill 出来的决定（2026-08-20 第二轮修订）：

1. **粒度（架构层）**：每个案例 = 一个品牌文件夹 `docs/cases/<brand>/{work1.js..work5.js, index.js}`，work 之间模块化。但 **UI 行为**：载入案例 = 全量覆盖 state（与现状一致）。架构为按 work 加载留口子（`Cases.load(brand, {works:['work1']})`），T08 内不接入 UI。
2. **覆盖度**：5 步全字段（每个 work 的所有 `defaultData()` 字段都要有值）。无 "可选允许空"——是"完整"。
3. **注入语义**：全量覆盖 state（替换 `state.work1..5`）。载入前自动存档（与现状一致）。
4. **多案例并存**：仓库里以后可能不止 1 个 case。`Cases` 是全局加载器，`Cases.list()` / `Cases.load(brand)` / `Cases.load(brand, {works:['work2']})` 三接口。
5. **教学化叙事（仅主术语）**：
 - 文件名：`docs/demo-data.js` → `docs/cases/shanmu-tea/index.js`（以及同目录 `work1.js`...`work5.js`）
 - UI：「查看演示」按钮 → 「载入案例」；「查看演示」按钮的提示文字同步改
 - **不**改的：随机示例按钮文案、其它出现"演示"的非主术语位置
6. **老的 `docs/demo-data.js`**：删除并迁移（不留 deprecation shim）。

## Acceptance

- `docs/cases/SCHEMA.md`（新文件）写明上述 6 个决定的结论。
- `docs/cases/shanmu-tea/{work1..5.js, index.js}` 骨架就位——`work1..5` 内容是 `Work{N}.defaultData()` 的形状占位，**字段全空**（T09 才填）；`index.js` 是聚合 + 元数据。
- `docs/cases/loader.js`（新文件）实现 `Cases.list/load/load(brand, {works})` 三个方法。
- 「查看演示」按钮的文案 / 切换逻辑代码按新设计落地（这一处 T08 内做，**不**拆 ticket）。
- 老的 `docs/demo-data.js` 删掉。
- `docs/global-brand-building.html` 里的 `<script src="demo-data.js">` 改成 `<script src="cases/loader.js">`；调用 `DemoData.inject(s)` 的代码全部改成 `Cases.load(brand)`。

## Why

不先定 schema 就动手填字段，5 步填完发现某些字段跟产品默认值冲突、或者某些字段在产品里压根没渲染——返工。

## Notes from grill

- "按 work/module 可挑"在第二轮被撤回为"全量覆盖"。架构层仍按 module 切分（不改用户的撤回），UI 行为按用户的最新决定（"覆盖全部我认可"）。
- 案例的具体数据来源（市场规模数字、ROI 数字等）是**手编**还是**外部资料**——属于 T09 的活，不在 T08 grill 范围。

## Resolution

**Done.** Designed and implemented the case library infrastructure: a Markdown
schema doc, a folder-per-case directory layout, a UMD loader exposing
`Cases.list/has/load`, and the `shanmu-tea` skeleton (5 workN files + index).
T08 only ships the **shape**; T09 fills values.

**Files added**

- `docs/cases/SCHEMA.md` — human-readable schema. Per-work field reference
 drawn from `WorkN.defaultData()`. Authoring guide (folder layout, how to
 add a case, what to avoid in user-facing strings).
- `docs/cases/loader.js` — UMD module. `Cases.list/has/load(brand, opts)`.
 Deep-merges case values over `WorkN.defaultData()` so missing fields
 fall back to defaults (forward-compat with product updates).
- `docs/cases/shanmu-tea/index.js` — case entry point. Exposes
 `__case_shanmu_tea` global with `brand/label/summary/defaultWorks/getState`.
- `docs/cases/shanmu-tea/work1.js`... `work5.js` — 5 skeleton files.
 Each is the `WorkN.defaultData()` shape with empty values. T09 fills.
- `tests/cases.loader.test.js` — Node test for the loader. Verifies 12
 invariants: list/has/load contract, deep-merge, partial-load.

**Files changed**

- `docs/global-brand-building.html`:
 - `<script src="demo-data.js">` removed; replaced with 7 case-related
 `<script>` tags (5 workN + index + loader).
 - `DemoData.inject(state)` call site rewritten to
 `Cases.load('shanmu-tea')` + 5 `Object.assign` per work.
 - UI text: 「查看演示」→「载入案例」(3 places: button label, banner
 body, banner "退出演示"→"退出案例"). Banner wording rephrased to
 "载入的案例" instead of "DEMO 演示数据".
 - 2 of the 3 sites that reset `isDemo=false` (import-md, restore-snapshot)
 also updated for consistency.

**Files deleted**

- `docs/demo-data.js` — migrated to `docs/cases/shanmu-tea/`. No shim left
 per the user's "删了迁移" decision.

**Test result** (Node 22)

```
$ node tests/cases.loader.test.js
…
12 pass / 0 fail
```

**Decisions captured (in SCHEMA.md and ticket)**

- 粒度: folder per case, work files inside (architecture).
- 覆盖度: 5 steps all fields (T09 fills).
- 注入: full-state overwrite, auto-snapshot before.
- 多案例: `Cases.list()` enumerates registered cases.
- 教学化叙事: only main terminology changed (button label, banner body,
 file paths). Random-example button text kept (per "其它保留" decision).

**Architectural detail worth noting**

The loader's deep-merge deliberately **replaces arrays** (does not concat).
This means a case's `personas[]` is *intentional* — if the product adds
default personas, the case is not silently augmented. The deep-merge
*fills missing fields* but doesn't merge same-name fields array-wise.

**Open for T09 (not blocking, tracked)**

- The shanmu-tea 5 workN.js files are **shape-only** (T08 contract). T09
 fills values per SCHEMA.md per-work field reference. T09 also adds a
 "load case" regression test that exercises `Cases.load` with the real
 shanmu-tea data, not the fake shanmu-tea used in this test.
- Banner wording uses "载入的案例"; if you want a different tone, it's
 a one-line change in `global-brand-building.html:1139`.

**No production behavior change yet** — T08 only changes the path for
loading case data and renames a button. The case itself (shanmu-tea) is
still empty. T09 is when the user actually sees a fully-populated
shanmu-tea flow.

