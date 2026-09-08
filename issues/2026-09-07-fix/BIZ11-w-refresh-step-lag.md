# BIZ11 — 刷新后 currentStep 回到上一步（k → k+1）的根因与修复

严重度:中 / 方向:业务流程 / 确认度:confirmed（tests/w_refresh_step_lag.test.js 33/33）

## 问题

用户在 workshop n step k 页面按 F5 刷新，**反而跳到 step k+1**。读码 + 模拟复现确认根因：

### 链路

1. 服务器持久化的 `state.meta.currentStep = 'personas'`（k+1）—— 上次保存时用户在此
2. 用户点 subtab 切到 `'environment'`（k）—— `goStep` 改内存
3. `goStep`（`docs/lib/app.js:154-178`）**不调** `markDirty` / `saveNow` / `autosave`——纯导航不算改动
4. 用户没在任何字段输入 → `dirty` 仍是 `false`
5. 用户按 F5 刷新
6. `pagehide` 事件触发 `sendBeacon`（`docs/global-brand-building.html:2778-2790`，BIZ08 兜底）：
   ```js
   if(!dirty || !state) return;   // ← dirty=false 直接 return
   ```
   BIZ08 的兜底因为 dirty=false 跳过
7. 服务器仍是 `'personas'`（k+1）
8. 页面重新加载 → 恢复到 `'personas'`（k+1）
9. 用户视觉上：「我刚才在 environment（k），刷新后变成 personas（k+1）了」

### 为什么这个 bug 之前没暴露

- `goStep` 一直不调 markDirty（从仓库历史看是有意设计：「纯导航不算编辑改动」）
- BIZ08 加 pagehide sendBeacon 时正确处理了"dirty=true 必写"，但没处理"纯导航无输入但 currentStep 变了"的场景
- 短会话 + 频繁输入的用户不易撞到（dirty 早就 true 了，autosave 已经写过 currentStep）
- 撞到的用户：刚载入档案、切了几步看了看、还没开始填字段就刷新

## 期望

刷新后落在用户**最后切到的 step** 上，未保存的其他字段可接受丢失。

## 修复决策（grill 收尾）

Q1 候选 5 选 1：
- A. goStep/goWork 调 markDirty（最简，但纯切步也亮"未保存"）
- **B. goStep/goWork 调 saveNow**（最暴力，每次切步落盘）
- C. 缩 autosave 到 5 秒
- **D. pagehide 比对 currentStep vs lastSavedStep** ← 选
- E. 同步 saveNow

用户指示："我想要用户刷新页面的时候回到当前页面，能接受未保存的情况" —— 这把 A/B/C/E 都排除（都强于"能接受未保存"），**D 是唯一精准匹配**。

### 选 D 的理由

1. 精准匹配"刷新回当前页面"诉求（currentStep 兜住）
2. 保留"纯导航不算改动"语义 —— 纯切步不亮"未保存"状态栏
3. 跟 BIZ08 的 pagehide sendBeacon 配合最自然：sendBeacon 本就是"尽力同步、丢点没关系"的兜底通道
4. schema 加 1 字段（`meta.lastSavedStep`），`mergeWithDefaults` 自动补默认值
5. 0 行业务 JS 改动 —— goStep/goWork 维持原状

## 修复

### 改动 1：`defaultState` 加 `lastSavedStep`（`docs/global-brand-building.html:2618-2626`）

```js
meta: { savedAt: null, isDemo: false, demoSnapshot: null, currentWork: 1, currentStep: null,
        // BIZ11（2026-09-07）：上一次成功落盘后的 currentStep。pagehide 比对
        // currentStep vs lastSavedStep 兜底"纯导航无输入场景下刷新回当前 step"；
        // 不参与业务逻辑、saveNow 成功后单向跟随 currentStep 更新。
        lastSavedStep: null,
        // 2026-08-28：当前档案名 ...
        loadedFrom: null, loadedFromId: null },
```

### 改动 2：`saveNow` 成功后单向同步 `lastSavedStep`（`docs/global-brand-building.html:2769-2770`）

```js
if(ok){
  dirty=false;
  lastServerStamp = (state.meta && state.meta.savedAt) || null;
  // BIZ11：成功落盘后同步 lastSavedStep，让 pagehide 守门"currentStep 已同步"时跳过 sendBeacon
  if(state && state.meta) state.meta.lastSavedStep = state.meta.currentStep;
}
```

### 改动 3：pagehide 守门（`docs/global-brand-building.html:2782-2788`）

```js
window.addEventListener('pagehide', ()=>{
  if(!state) return;
  const stepChanged = state.meta && state.meta.currentStep !== state.meta.lastSavedStep;
  if(!dirty && !stepChanged) return;
  try{
    // ... sendBeacon 兜底 ...
  }catch(_){}
});
```

## 副作用评估

- **autosave 周期**：不变（120 秒），与本修复无关
- **2 分钟窗口期内的输入数据**：仍可能丢（用户接受）
- **案例 isDemo 模式**：`saveNow` 自身已在入口 `if(state?.meta?.isDemo) return true;` 拦下；pagehide 即使触发 sendBeacon，store 也会被 BIZ02 闸门挡掉（store.js:15 注释"BIZ02 保存闸门在 html saveNow 统一拦截"）。但 pagehide 仍会尝试一次 sendBeacon——**多一次无效 PUT**，可接受。
- **schema 迁移**：`mergeWithDefaults`（`global-brand-building.html:2715-2724`）用浅合并，新字段自动补 `null` 默认值。已存在档案刷新一次后 `lastSavedStep = null`，**首次 pagehide 会因为 `null !== currentStep` 触发一次 sendBeacon**——这是预期行为，相当于"迁移触发一次同步"。
- **race condition**：`saveNow` 是异步的（`async function`），如果在 saveNow 还没完成时用户又改了 currentStep，会有窗口期。但窗口极短（一个网络往返），且 pagehide 守门是"！一致就写"，最坏后果是冗余写一次。
- **work 切换（goWork）** 也走 pagehide 兜底 —— 但 `goWork` 也只改 `state.meta.currentWork`，不调 markDirty。**当前修复只兜 currentStep，currentWork 切换在刷新后仍可能丢**。本次不修（同根因、另起 ticket）。`tests/w_refresh_step_lag.test.js` 加了 goWork 也不调 markDirty 的反断言守住此处的对称语义。

## 验证

新增 `tests/w_refresh_step_lag.test.js`，**33 / 33 通过**。

**源层契约**（13 条）：
- defaultState 含 `lastSavedStep: null`
- saveNow 成功后同步 lastSavedStep
- pagehide 不再用 `!dirty` 单守门
- pagehide 守门含 `stepChanged` 比对
- pagehide 守门是 `dirty || stepChanged`
- goStep 不调 markDirty / autosave / saveNow（保留"纯导航不算改动"）
- goStep 仍写 `state.meta.currentStep`
- goWork 同样不调 markDirty（统一语义）

**行为层**（20 条）：
- 初始 `currentStep = lastSavedStep = 'personas'`
- `goStep('environment')` 后：`currentStep` 变、`dirty` 不变、`lastSavedStep` 不变
- pagehide 应触发（stepChanged=true）
- 模拟 pagehide 写盘成功
- 刷新后 `currentStep = 'environment'`（k）—— **修复生效**
- 刷新后无操作，pagehide 不应触发
- 第二次 goStep 同样兜住
- dirty=true 仍走老路径
- isDemo=true 时 saveNow return（不影响）

**完整套件**：`node scripts/run-tests.js` 报 58 pass / 3 fail（3 个 pre-existing 失败与 BIZ11 无关，已用 `git stash` 验证）。

**端到端**（需浏览器手验）：
- 打开应用 → 任意 workshop → 切到 step 3 → 不输入任何字段 → F5 刷新
- **应当**：刷新后仍在 step 3
- **修复前**：刷新后回到 step 4（或上次的某个 step）

## 决策时序

- 2026-09-07：用户报告「刷新后会跳到下一步」；grill 流程收 2 轮（Q1 修复走法 / Q2 收窄到 A vs D），落 D 方案。
- 关联：
  - [BIZ08](../2026-09-03-qa/BIZ08-sendbeacon-missing.md) 加了 pagehide sendBeacon 但守门是 dirty——本 issue 修这个守门的盲区
  - BIZ09 / BIZ10 同日 issue，跟本条无直接耦合

## 退役说明（2026-09-07 BIZ14）

本方案的 pagehide + lastSavedStep 机制已被 [BIZ14](BIZ14-position-url-routing.md)
（位置 URL 路由 ?w=&s=&case=）整体取代：位置不再进 server 持久化，
改由浏览器原生保留 URL。相关 schema 字段与守门代码已移除，本文档保留作决策记录。
