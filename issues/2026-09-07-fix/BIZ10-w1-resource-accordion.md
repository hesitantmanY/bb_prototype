# BIZ10 — W1 step 2 资源盘点 4 步手风琴改「数据驱动智能展开」

严重度:低 / 方向:UX / 确认度:confirmed(读码 + 用户报告"3 个常关需点 3 次" friction)

## 问题

`docs/workshop1.js:1131-1240` 的「资源盘点」4 步手风琴：

- **第 1 层 · 事实（5 维能力）**：默认展开（`openByDefault=true`）
- **第 2 层 · 提炼（3 段判断）**：默认**折叠**（`false`），依赖第 1 层
- **第 3 层 · 收敛（微笑曲线收口）**：默认**折叠**（`false`），依赖第 2 层
- **第 4 层 · 变量（关键趋势）**：默认**折叠**（`false`），独立观察

用户填完第 1 层 5 维后，第 2/3/4 仍要各点 1 次才能看到——**3 次点击 friction**，且每次 `autosave → Work1.rerender` 都会重画 UI，accordion 状态在 rerender 期间反复重置。

`tests/` 里**没有任何** `cap-acc` / `accordion` 相关测试，`issues/` 也没有历史 ticket，**`CONTEXT.md` 也没有 "手风琴 / progressive disclosure" 术语**——这是 UI 原则的第一笔。

## 期望

4 层的开闭由数据决定，不留"用户手动关"的有效路径：

- 第 1 层：始终展开（事实层，无上游）
- 第 2 层：5 维（delivery/core/brand/customer/compliance）trim().length **> 5** 全填 → 展开
- 第 3 层：3 段（defensive/critical/structural）trim().length **> 0** 全填 → 展开
- 第 4 层：始终展开（独立观察，无上游）

## 决策记录

### Q1：范围（A/B/C/D）
- A. 全开（最激进）—— 违反 pedagogy，过
- B. 智能展开（数据驱动）—— **选 B**
- C. 混合（层 1+4 展、2+3 折）—— 减点击有限，放弃
- D. 保留折叠 + 头部进度提示 —— 不解决 friction，放弃

### Q2：手动覆盖行为（B-a/B-b/B-c/B-d）
- B-a. 当次会话内尊重手动收拢（`cap._userClosed` 跟踪）—— 引入 schema 字段 + 迁移
- B-b. auto-open 必胜 —— **选 B-b**
- B-c. localStorage 持久化 —— 维护成本高
- B-d. 加"全部展开/折叠"主控按钮 —— 改动面大

**关键反驳**：用户 grill 阶段指出"当用户填完一个流程后，为什么还要合上它呢？'用户无法关闭'是伪需求"。

- 现实：每次 `autosave → Work1.rerender` 都会重画 accordion，**用户点的"关闭"在下一帧被数据驱动的 `open` 覆盖**。
- 因此 B-a 的 `_userClosed` 状态在当前 rerender 频率下形同虚设——加了 state 也是被吃掉。
- B-b 简单有效：填好数据 = 始终展开；用户点 head 切换视为 peek（**peek-only**，下次 rerender 回弹）。不引入新 state、不改 schema、不污染 `mergeWithDefaults`。

### Q3：阈值（a/b/c）
- a. 跟 MVO 对齐：层 1 `>5` chars（与 `workshop1.js:193` MVO check 一致），层 2/3 `>0` chars —— **选 a**
- b. 全 `>0` chars —— 奖励太即时、与 MVO 不齐
- c. 全 `>5` chars —— 凭空造数

**关键论点**：第 1 层用 `>5` chars 完全对接 MVO，**用户过 MVO 的瞬间 = 第 2 层自动展开**，是连贯的"过门槛 → 奖励下一层"闭环。第 2/3 层项目里没写 MVO check，强行套 `>5` 是凭空造数；`>0` 是最简"非空即填"。

## 修复

`docs/workshop1.js:1131-1153` 区域，在 `const cap = d.ourCapabilities;` 之后插入：

```js
const isFilled = {
  1: true,
  2: ['delivery','core','brand','customer','compliance'].every(k => (cap[k]||'').trim().length > 5),
  3: ['defensive','critical','structural'].every(k => (cap[k]||'').trim().length > 0),
  4: true,
};
```

并把 4 处 `mkAccStep(N, ..., <bool>, ...)` 的 `<bool>` 改为 `isFilled[N]`。

`mkAccStep` 自身的 `onclick={()=>document.getElementById(id).classList.toggle('open')}` 保留——填好数据的层 rerender 会被 `isFilled` 重置回 `open`，**点 head 切换只对未填数据的层有"peek"价值**。

## 副作用评估

- `autosave` 频率：每键入触发 1 次 rerender（`workshop1.js:1008`），原本 4 个 accordion 都按 `openByDefault` 硬编。改后每次 rerender 重算 `isFilled`——**纯函数、无副作用、无新增 state 字段**。
- `mergeWithDefaults` 迁移：不需要新字段，`ourCapabilities` 现有 11 个键已覆盖（`workshop1.js:52`、`911`）。
- schema：未动。
- 案例浏览：BIZ09 的 `body.is-demo` CSS 锁仍对 `.metric-next button` 豁免，**但 accordion 的 head 是 `.cap-acc-head`，仍是 `<div>` 不是 `<button>`，不受 BIZ02 锁定**——**案例里仍可点 accordion head**（peek）。这是 BIZ02 的 CSS 规则覆盖范围：`body.is-demo #steps1 button, ...` 只对 `button` 生效，`.cap-acc-head` 是 div 不命中。
- 演示批注：BIZ02 提到"演示批注永不显示"是另一条独立症状（`demo_notes.js` 加载了但渲染闸门死了），**与本 issue 无关**。

## 验证

新增 `tests/w1_resource_accordion.test.js`，**13 条断言全过**：

结构层（10 条）：
- `cap` 锚点存在
- `isFilled` 在 `cap` 后紧跟定义
- `isFilled[2]` 阈值 `>5 chars × 5 维`（含 5 个键名）
- `isFilled[3]` 阈值 `>0 chars × 3 段`（含 3 个键名）
- `isFilled[1]` / `[4]` 恒 `true`
- 4 处 `mkAccStep(1..4,...)` 改用 `isFilled[1..4]`
- 4 处 `mkAccStep` openByDefault 不再硬编 `true/false`

行为层（3 条）：
- `mkAccStep` 函数体在源里
- `mkAccStep(_, true, _)` 加 `.open` class
- `mkAccStep(_, false, _)` 不加 `.open` class

跑 `node scripts/run-tests.js`：除 3 个 pre-existing 失败（`work5_chapter4_tree.test.js` 2 处 / `work5_core_evidence.test.js` E4 渠道结构树图，已用 `git stash` 验证与本改动无关）外全过。

端到端（未在 headless 里跑，需浏览器手验）：
- 打开 `docs/global-brand-building.html` → W1 step 2 → 资源盘点：初始 4 个 accordion head，1 和 4 默认 open，2 和 3 默认 closed
- 在 5 维任一字段键入 1 字符：第 2 层**仍 closed**（< 5 chars）
- 5 维全填到 ≥6 chars：第 2 层**自动 open**（无点击）
- 在 3 段任一字段键入 1 字符：第 3 层**仍 closed**（< 1 char）
- 3 段全填：第 3 层**自动 open**
- 点已 open 的第 1 层 head：下一帧 rerender 仍 open（auto 胜）
- 点 closed 的第 2 层 head：下一帧 rerender 若 5 维未满仍 closed，**这是"peek"路径**——若用户继续填到 5 维全 ≥6 chars，第 2 层保持 open

## 决策时序

- 2026-09-07：用户报告"4 个模块除第一个都常关，能删除点 1 次下拉的动作吗"；grill 流程收 3 轮（Q1 范围 / Q2 手动覆盖 / Q3 阈值），落 B-b + Q3-a 组合。
- 关联：[BIZ09](BIZ09-case-cta-exempt.md) 是同日的"案例只读锁"豁免（CSS 层）；本 issue 是 UI 行为层；两条不直接耦合。
