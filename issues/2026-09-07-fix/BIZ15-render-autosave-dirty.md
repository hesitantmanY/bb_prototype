# BIZ15 — 刷新后自动变成"未保存"：渲染路径无条件 autosave

严重度:中 / 方向:业务流程 / 确认度:confirmed（Playwright 真实浏览器复现 + 调用栈取证）

## 问题

用户报告：刷新页面后，状态栏自动变成"未保存 · 有更改"，即使没有做任何输入。

## 根因（Phase 1 取证）

用 Playwright 打开真实页面（服务端状态为 200KB 的完整工作区）：

1. 页面加载后 0.25s 起状态栏即"未保存"，`dirty=true`
2. 对比页面 state 与 server 存档：**数据完全一致**——没有任何渲染期数据改动
3. 给 `markDirty` 装包装器重放 `App.renderAll()`，抓到唯一调用栈：

```
at autosave (global-brand-building.html:2777)
at Work3.updatePositioning (workshop3.js:1489)
at Work3.render.proposition (workshop3.js:1470)
at Work3.renderStep (workshop3.js:156)
at app.js renderAll
```

`Work3.updatePositioning()` 每次渲染"价值主张"步骤都会执行（renderAll 对所有步骤
全量渲染），它无条件调用 `autosave()`（= markDirty）——即使派生的
`positioningStatement` 与已存值完全相同、数据零变化。因此每次刷新都被置脏。

## 修复

`docs/workshop3.js` 的 `Work3.updatePositioning()`：

```js
if(state.work3.proposition.positioningStatement !== sentence){
  state.work3.proposition.positioningStatement = sentence;
  autosave();          // 只有真实变化才标脏
}
const el2 = document.getElementById('posPreview');
if(el2) el2.textContent = sentence;   // UI 预览每次仍更新
```

输入事件路径不受影响（oninput 本就先 autosave 再调 updatePositioning）。

## 验证

- 新增 `tests/w3_update_positioning_autosave.test.js`，7/7 通过：
  句子未变不 autosave、重复渲染不置脏、UI 预览仍更新、句子变化写 state + autosave、
  变化后再次渲染不重复 autosave
- Playwright 真实浏览器复验：修复后刷新，状态栏全程"已保存"，`dirty=false`
- `node scripts/run-tests.js`：59 pass / 3 fail（3 个 pre-existing，与本次无关）

## 已知相关（未在本条修复）

全新空工作区首次加载时，W4 渠道结构"种子"逻辑（structure 为空时自动填入示例结构 +
`_seedNoticeShown=true`）也会在渲染期 autosave。那是**真实的数据变化**（自动生成的种子
尚未持久化），"未保存"语义上成立；但同样会让全新用户首屏即"未保存"。若要消除，
需把种子改为加载期迁移（SchemaMigrate + 落盘）而非渲染期写入，另开 ticket。

## 决策时序

- 2026-09-07：用户报告；Playwright 复现 + 调用栈定位；修 updatePositioning 单点；
  真实浏览器复验通过。仅改动本地工作树，未推送远端。
