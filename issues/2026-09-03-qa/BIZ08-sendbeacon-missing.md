# BIZ08 — README 声称关页 sendBeacon 同步,实际不存在

严重度:低 / 方向:业务流程 / 确认度:confirmed

## 问题

README/注释声称"刷新或关闭页面前会立即同步(sendBeacon)",全库 grep 无任何 sendBeacon 调用;实际兜底是 beforeunload 的原生"离开此网站?"确认窗。用户编辑后 2 分钟内直接关页/刷新:确认窗误点"离开"→ 最近 ≤2 分钟改动丢失(autosave 周期 2 分钟)。

## 期望

接 pagehide + navigator.sendBeacon(POST /api/state 已支持),或删除 README 承诺。

## 证据

- docs/global-brand-building.html:2665-2667 — 注释自述"beforeunload 原生确认窗兜底",无 sendBeacon
- docs/lib/app.js:61 — autosave 周期 2 分钟

## 修复方向

加 pagehide/sendBeacon 同步;顺带把"AI 失败后自动保存"等即时性检查一遍。
