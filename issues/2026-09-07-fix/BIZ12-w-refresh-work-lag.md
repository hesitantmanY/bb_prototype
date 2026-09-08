# BIZ12 — 刷新后 currentWork 兜底（W1.sbu↔W4.sbu 撞 id 场景）

严重度:中 / 方向:业务流程 / 确认度:confirmed（tests/w_refresh_step_lag.test.js 51/51）

## 问题

[BIZ11](BIZ11-w-refresh-step-lag.md) 修的"刷新回当前 step"在 work 跨页 + step id 撞名场景仍失效：

### 链路

1. 用户在 W1 step `'sbu'`（`currentWork=1, currentStep='sbu'`）
2. 用户点顶栏 W4 → `goWork(4)` → `currentWork=4`，`goStep(first)` 把 `currentStep` 设成 `'sbu'`（W4 的首步 id 也是 'sbu'，**与 W1 首步撞 id**）
3. 用户没输入 → `dirty=false`
4. F5 刷新
5. pagehide 守门（BIZ11 修复后）只比对 `currentStep`：
   ```js
   const stepChanged = currentStep !== lastSavedStep;  // (sbu !== sbu) = false
   if(!dirty && !stepChanged) return;                  // ← return，不存盘
   ```
6. server 仍是 `currentWork=1, currentStep='sbu'`
7. 页面渲染 → 用户回到 **W1.sbu**（"另一个页面"——以为在 W4）

### 同根因、相同 fix pattern

[BIZ11 issue 末尾](../2026-09-03-qa/) 已经留底：

> "work 切换（goWork）也走 pagehide 兜底 —— 但 `goWork` 也只改 `state.meta.currentWork`，不调 markDirty。**当前修复只兜 currentStep，currentWork 切换在刷新后仍可能丢**。本次不修（同根因、另起 ticket）。"

用户撞到这 ticket 后决定按 BIZ11 同样模式扩展：选 **A**（D 方案的对称推广）。

## 期望

刷新后落在用户**最后切到的 work + step** 上。撞 id 场景（`currentStep` 字符串相同但 work 不同）必须靠 `currentWork` 独立跟踪来识别。

## 修复

### 改动 1：`defaultState` 加 `lastSavedWork`（`docs/global-brand-building.html:2622-2626`）

```js
// BIZ12（2026-09-07）：上一次成功落盘后的 currentWork。同 BIZ11 模式，pagehide
// 兜底"纯切 work 无输入场景下刷新回当前 work"；关键场景：W1.sbu→W4.sbu（两 work
// 首步 id 撞名），单看 currentStep 无法识别 work 切换。
lastSavedWork: null,
```

### 改动 2：`saveNow` 成功后同步 `lastSavedWork`（`docs/global-brand-building.html:2774-2777`）

```js
if(state && state.meta){
  state.meta.lastSavedStep = state.meta.currentStep;   // BIZ11
  state.meta.lastSavedWork = state.meta.currentWork;   // BIZ12
}
```

### 改动 3：pagehide 守门加 `workChanged`（`docs/global-brand-building.html:2782-2798`）

```js
window.addEventListener('pagehide', ()=>{
  if(!state) return;
  const stepChanged = state.meta && state.meta.currentStep !== state.meta.lastSavedStep;
  const workChanged = state.meta && state.meta.currentWork !== state.meta.lastSavedWork;
  if(!dirty && !stepChanged && !workChanged) return;   // ← BIZ12 加 workChanged
  // ... sendBeacon / keepalive fetch ...
});
```

## 副作用评估

- **0 行业务 JS 改动**：`goWork` 仍不调 markDirty（保留"纯导航不算改动"语义，与 BIZ11 对称）
- **schema**：加 1 字段 `lastSavedWork: null`，`mergeWithDefaults` 自动补默认值，已存档案刷新一次后 `lastSavedWork = null` → 首次 pagehide 因 `null !== currentWork` 触发一次 sendBeacon（迁移同步，预期行为）
- **案例 isDemo 模式**：`saveNow` 已拦在入口；pagehide 即使触发 sendBeacon 也是无效 PUT（store BIZ02 闸门挡掉），不影响
- **work 切换不输入场景的覆盖**：W1.sbu↔W4.sbu、W2.sbu（如果有）↔W4.sbu 等所有同 id 跨 work 切换都被兜住
- **lastSavedWork 不更新于 pagehide**：跟 BIZ11 一样的小冗余——pagehide 直接 sendBeacon 不走 saveNow，所以 lastSavedWork 不会更新。下次刷新时仍因 `workChanged=true` 触发一次冗余 sendBeacon。可接受
- **跨 work 切换不输入时未亮"未保存"**：保留"纯导航不算改动"语义，与 BIZ11 对称

## 验证

扩展 `tests/w_refresh_step_lag.test.js`，**51 / 51 通过**（BIZ11 33 条 + BIZ12 新增 18 条）。

**源层契约**（新增 5 条）：
- defaultState 含 `lastSavedWork: null`
- saveNow 成功后同步 `lastSavedWork`
- pagehide 守门含 `workChanged` 比对
- pagehide 守门是 `dirty || stepChanged || workChanged`

**行为层**（新增 Case 6/7/8 共 18 条）：
- **Case 6** W1.sbu → W4.sbu（撞 id）— BIZ12 修复目标：
  - `stepChanged=false`、`workChanged=true`、pagehide 仍触发、刷新后 `currentWork=4` 保留
- **Case 7** W4 刷新后无操作，三个都一致 → pagehide 不触发（不冗余写）
- **Case 8** W1.sbu → W2.tier（不撞 id）— 两条都触发，pagehide 写一次、刷新后 `currentWork=2, currentStep=tier, lastSavedWork=2, lastSavedStep=tier`

**完整套件**：`node scripts/run-tests.js` 报 59 pass / 3 fail（3 个 pre-existing 失败与 BIZ12 无关）。

**端到端**（需浏览器手验）：
- 打开应用 → 任意 step → 点顶栏 W1-W5 tab 切到不同 work → 不输入字段 → F5 刷新
- **应当**：刷新后仍在切到的那个 work + 它的首步
- **修复前**：撞 id 场景下回 W1.sbu；不撞 id 场景下回 W1 老 step

## 决策时序

- 2026-09-07：用户实测发现"快速刷新后弹未保存弹窗 + 回到另一个页面"；grill 1 轮定位到 work 撞 id 场景；选 A（同 BIZ11 D 方案的对称扩展）。
- 关联：
  - [BIZ11](BIZ11-w-refresh-step-lag.md) 同日同根因，BIZ11 留的口子就是这条 ticket
  - BIZ08 加的 pagehide sendBeacon 守门 = dirty 漏掉了纯切 work

## 退役说明（2026-09-07 BIZ14）

本方案的 pagehide + lastSavedWork 机制已被 [BIZ14](BIZ14-position-url-routing.md)
（位置 URL 路由 ?w=&s=&case=）整体取代。相关 schema 字段与守门代码已移除，
本文档保留作决策记录。
