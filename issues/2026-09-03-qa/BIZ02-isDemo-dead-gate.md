# BIZ02 — isDemo 永假:演示批注永不显示;案例进 W5 被静默改写章节

严重度:中 / 方向:业务流程 / 确认度:confirmed(grep 全库无 true 写入点;autoSync 副作用读码可证)

## 问题

`state.meta.isDemo` 全库没有任何 `true` 写入点(app.js:357 进入案例反而显式置 false),所有依赖它的闸门是死闸门:

1. **演示批注永不显示**:demo_notes.js 数据已加载、ui.js:166 判 isDemo 恒假直接 return —— README 承诺的"演示模式下每个步骤顶部三行批注"从未出现;
2. **案例内打开 W5 会静默改写案例**:app.js:99-104 的 goWork 以 isDemo 为守卫触发 workshop5 autoSync(autoSync/_auto4C 内部同样判 isDemo)——守卫全死 → 用户只是**阅读**演示案例的策划书章节,autoSync 就用字段拼接产物覆盖案例手写的「业务与市场/STP/4P」章节、自动创建一个时间名快照,4C 为空时**无提示调用 LLM**(花 token)。刷新后现场保留,持续污染。

## 期望

演示判定基于真实案例标记(如 `meta.demoCase`);案例内(autoSync/_auto4C)完全跳过;演示批注恢复显示。

## 复现

1. 顶栏「载入案例」打开任一演示案例;
2. 点顶栏「V. 策划书」→ autoSync 覆盖案例手写章节(可看版本快照列表出现新快照;4C 为空时观察 LLM 调用);
3. 各案例步骤顶部:演示批注三行从未出现。

## 证据

- docs/lib/app.js:357 — 进入案例置 isDemo=false;全库无 =true 写入
- docs/workshop5.js:1001-1012(_auto4C)、1027-1082(autoSync)、workshop5.js:1004/1029 — 依赖 isDemo 的死守卫
- docs/lib/app.js:99-104 — goWork 触发 autoSync 的守卫同死
- docs/lib/ui.js:166、demo_notes.js — 批注渲染闸门

## 修复方向

判定改用实际存在的案例标记;autoSync/_auto4C 在案例上下文内跳过(阅读案例不产生写入与 LLM 调用)。
