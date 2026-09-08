# BIZ09 — 案例内步间 / 跨坊 CTA 被 CSS 一并锁死,违反「步骤导航始终可用」

严重度:中 / 方向:业务流程 / 确认度:confirmed(读码可证 CSS 规则 + 端到端复现 user 报告)

## 问题

`docs/global-brand-building.html:995-1017` 有一条 BIZ02 决策落地的 CSS 锁:

```css
body.is-demo #steps1 button, ..., #steps5 svg{
  opacity:.55; cursor:not-allowed; pointer-events:none; transform:none;
}
```

它本意是「案例浏览模式下,steps 区内的编辑 / AI 控件不可点」,但用 `button` 通配选择器**把所有 button 都套了**——包括**步间 CTA**(`UI.stepNextCta`)和**跨坊 CTA**(`UI.nextWorkCta`),它们也是 `button.primary.small`,只是被包在 `<div class="metric-next">` 里。

用户在案例里点 W1 step 8 的「II. 目标市场 →」(跨坊 CTA)、或任意 step 的「下一步:xxx →」(步间 CTA),**全部不可点**:按钮在屏幕上是灰的(`opacity:.55`)、`cursor:not-allowed`、鼠标穿透到底层。

这违反 `CONTEXT.md` 术语「**步骤导航始终可用**」——CTA 是"过后的捷径",不是"禁行栅栏"。把 CTA 也吃掉属于 BIZ02 CSS 规则的过度泛化(rule creep),与设计意图不符。

旁证:subtab bar(`#subtabsBar`)与顶栏 tab(W1-W5)不在 `#steps1-5` 里,本来就没被这条规则影响——所以用户能切 subtab、也能切 W1↔W2(顶栏),**唯独"下一步"和"II. 目标市场 →"两条不行**,造成不一致。

## 期望

1. 案例浏览下,步间 / 跨坊 CTA 在 MVO 全过后**应可见、可点**。
2. 编辑 / AI / 复制等按钮仍按 BIZ02 锁住(原规则不动)。
3. MVO 未过时,`.metric-next--hidden` 仍以 `!important` 压住,CTA 不可见(过门槛才显形)——这条语义不变。

## 修复

在 `docs/global-brand-building.html` 原 BIZ02 锁定规则之后追加一条 override(特异性 1,2,0,1 > 原 1,1,0,1,级联胜出,无 `!important`):

```css
body.is-demo #steps1 .metric-next button,
body.is-demo #steps2 .metric-next button,
body.is-demo #steps3 .metric-next button,
body.is-demo #steps4 .metric-next button,
body.is-demo #steps5 .metric-next button{
  opacity:1; cursor:pointer; pointer-events:auto;
}
```

`UI.stepNextCta` / `UI.nextWorkCta` 本就用 `class="metric-next"` 容器 + `class="primary small"` button(`docs/lib/ui.js:90-93`、`97-108`),命中本 override。

## 副作用评估

- `App.goStep(id)`(`docs/lib/app.js:154-172`):只动 `state.meta.currentStep`、重渲染、滚动。**不**写盘、**不**调 AI。
- `App.goWork(n)`(`docs/lib/app.js:87-105`):`goWork(5)` 才触发 `Work5.autoSync()`,被 `!isDemo` 闸门拦下。其余 work 间切换只动 `currentWork` + `currentStep`。
- 退出案例(`docs/lib/app.js:328-336`):`state = JSON.parse(JSON.stringify(state.meta.demoSnapshot))` 恢复进入前现场,`currentWork/currentStep` 同步回退。**案例内导航不污染真实工作区**。
- 2 分钟 autoSave(`docs/lib/app.js:60`):`saveNow` 在 demo 模式被 `global-brand-building.html:2732` 闸门拦,不写盘。
- 刷新保留现场(`docs/lib/app.js:43`):案例内 navigation 跟着 state 一起保留;`refreshCaseIfStale` 不动 navigation。

## 验证

- 新增 `tests/case_cta_exempt.test.js`(纯 Node 解析,无 jsdom),14 条断言全过:
  - BIZ02 原规则 5 条 `body.is-demo #stepsN button` 仍存在
  - override 5 条 `body.is-demo #stepsN .metric-next button` 存在、晚于原规则
  - override body 含 `opacity:1` + `cursor:pointer` + `pointer-events:auto`,**不**含 `!important`
  - `.metric-next--hidden` 仍含 `!important` + `display:none`
  - `UI.stepNextCta` / `UI.nextWorkCta` 仍用 `class="metric-next"` 容器
- 跑 `node scripts/run-tests.js`:除 3 个 pre-existing 失败(`work5_chapter4_tree.test.js` / `work5_core_evidence.test.js` 的 E4 / 树图标签 / 伙伴行——已通过 `git stash` 验证与本改动无关)外全过。
- 端到端:浏览器载入任一案例 → W1 step 8 出现「II. 目标市场 →」并可点 → 跳到 W2 step 1;W1 任意 step 全过 MVO 后「下一步:xxx →」可点。

## 决策时序

- 2026-09-07:用户报告「载入案例后页面跳转被锁」;grill 流程先排除 `architecture.html` 演示模式(按 F / Esc 退出)与 README 「只读沙箱」基线(点「退出案例」退出),定位到本 issue。
- 2026-09-07:grill 收敛到 A1 方案(最小 CSS 覆盖),落盘 + 14 条测试。
- 关联:[BIZ02](../2026-09-03-qa/BIZ02-isDemo-dead-gate.md) 是同一锁的「另一边」(批注 / autoSync);本 issue 不动 BIZ02 的状态,但与 BIZ02 同根因——BIZ02 CSS 写得太宽,这条 issue 是 BIZ02 的「导航控件」豁免。
