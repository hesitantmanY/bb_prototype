# BIZ03 — 双标签页 autosave 静默覆盖另一页签的版本恢复/重置

严重度:中 / 方向:业务流程 / 确认度:confirmed(机制读码可证;实际需双页签验证)

## 问题

同一项目开两个标签页时无任何并发防护:全库无 storage 事件监听、无修订号/If-Match、无写锁。保存链只在单页签内串行(app.js 每 2 分钟 dirty 即 saveNow;store.js 只保证单页签内顺序)。

场景:页签 A「历史记录」恢复旧版本(current.json 被 A 覆盖)→ 页签 B 内存里还是旧内容,2 分钟周期 autosave 时把旧内容整体 PUT → A 的恢复被静默写回覆盖,无任何提示。看起来"恢复失败/又回去了"。

## 期望

写路径带修订号 compare-and-set(冲突提示刷新),或至少监听另一页签写入(如 storage 事件/版本号变化)时提示重载。

## 复现

1. 同项目开两个标签页,各编辑一点内容触发 dirty;
2. 页签 A 恢复一个旧版本快照(确认成功后数据为旧版);
3. 等页签 B 的下一次 2 分钟 autosave(或手动触发保存)→ current.json 被 B 的旧内存内容覆盖,A 的恢复消失。

## 证据

- docs/lib/app.js:61 — 每 2 分钟 dirty 保存
- docs/lib/store.js:21-23 — 保存链仅单页签内串行
- docs/lib/history.js:88-118 — 恢复直接 PUT current.json

## 修复方向

服务端/前端加简单修订号:PUT 带期望版本,不匹配返回冲突,前端提示刷新;或 window 间 storage 事件广播失效重载。
