# BIZ14 — 位置改为 URL 路由（?w=&s=&case=），取代 BIZ11/12/13 的 state+pagehide+localStorage 兜底

严重度:中 / 方向:架构简化 / 确认度:confirmed（tests/w_url_routing.test.js 34/34）

## 背景

用户提出：页面跳转（workshop n step k）本质是"位置"，不应该被当成"内容改动"
来触发未保存/持久化；刷新时浏览器本来就会保留 URL，记录当前索引即可，不需要
pagehide sendBeacon + localStorage 那套。

该判断成立。此前 BIZ11（pagehide 兜 currentStep）、BIZ12（pagehide 兜 currentWork）、
BIZ13（localStorage 兜大 state）都是用"持久化内容"的方式去解决"恢复位置"，把简单问题做复杂了：

- BIZ11/12 引入 `meta.lastSavedStep/lastSavedWork` 两个 schema 字段 + pagehide 位置守门
- BIZ13 引入 `localStorage brand.lastPos`
- 三者都只在"位置恰好在 server/localStorage 里存下来了"时有效；且 goStep/goWork
  仍不标 dirty，"纯导航 vs 未保存"的语义混淆没有消除

## 修复：URL 是位置的真值

位置写入 URL：`?w=1&s=recommendations&case=hengrui-zao`（query 格式，case 为额外参数）。

### docs/lib/app.js

- 新增 `App.syncUrl()`：把当前 `currentWork/currentStep/demoCase` 同步到 URL
  （`history.replaceState`，不污染 history 栈；保留 URL 上其他参数）
- 新增 `App.posFromUrl()`：解析并校验 URL 参数（work ∈ 1-5、step 存在、case 存在）
- 新增 `App.restoreFromUrl()`：init 时从 URL 恢复位置；若带 case 参数且当前不在该案例，
  自动 `toggleDemo(caseKey)` 进入案例（支持案例深链/刷新在案例中），再应用 w/s
- `goStep()`：写 `state.meta.currentStep` 后调 `this.syncUrl()`（取代 BIZ13 的 localStorage 写）
- `renderAll()` 末尾调 `this.syncUrl()`：init/案例/历史/导入/重置所有 state 替换路径
  结束时 URL 与最终恢复位置一致
- `init()`：移除 BIZ13 的 localStorage 读，改为 `await this.restoreFromUrl()`
- `toggleDemo()`：进入/退出案例后调 `this.syncUrl()`（写/清 `case` 参数）

### docs/global-brand-building.html

- `defaultState()`：删除 `lastSavedStep/lastSavedWork`（遗留存档里的旧值由 merge 忽略）
- `saveNow()`：删除 lastSaved* 同步
- `pagehide`：守门回归 BIZ08 的 `dirty`-only（位置由 URL 负责，导航不再触发存盘）

## 效果

- 刷新 = 浏览器原生保留 URL → 天然回到当前页面；无 64KB 限制、不依赖网络、不弹未保存窗
- 纯导航不再有任何持久化动作，"内容改动才算未保存"语义恢复干净
- 案例也走 URL（`case=` 参数），支持"分享案例链接直达某一步"与"刷新仍在案例内"
- 删除 2 个 schema 字段 + 1 个 localStorage key + 3 处 pagehide 位置守门代码

## 验证

- 新增 `tests/w_url_routing.test.js`（取代 `tests/w_refresh_step_lag.test.js`），34/34 通过：
  - 源层：defaultState 无 lastSaved*、saveNow 不写 lastSaved*、pagehide 回归 dirty-only、
    app.js 无 brand.lastPos、syncUrl/posFromUrl/restoreFromUrl 就位、goStep/renderAll/init/toggleDemo 接入
  - 行为层：goStep/goWork 同步 URL、W4 首步撞 id 'sbu' 正确、URL 恢复位置、
    非法参数 fallback、case 深链进入案例、案例内刷新恢复、未知 case 忽略、
    syncUrl 保留无关参数并清 case、renderAll 后 URL 与 state 一致
- `node scripts/run-tests.js`：58 pass / 3 fail（3 个 pre-existing，与本次无关）

## 决策时序

- 2026-09-07：用户指出"跳转不该算未保存，刷新时记录当前索引不就行了"；
  grill 确认 query 格式、case 作为额外参数、旧 schema 直接退役；
  按推荐全部落地。仅改动本地工作树，未推送远端。
- 关联：[BIZ11](BIZ11-w-refresh-step-lag.md)、[BIZ12](BIZ12-w-refresh-work-lag.md)、
  [BIZ13](BIZ13-w-refresh-localstorage-position.md) 均为本方案的中间层，已退役；
  BIZ08（pagehide 存内容）保留但守门回归 dirty-only。
