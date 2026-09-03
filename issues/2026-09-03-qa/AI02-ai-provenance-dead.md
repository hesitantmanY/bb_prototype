# AI02 — AI 溯源链全死:13 处传 aiScope,无处消费

严重度:中 / 方向:AI 管线 / 确认度:confirmed

## 问题

AI 溯源(provenance)链路断在接线处:

- work1/2/3/4 共 13 处按钮传入 `aiScope`(如 `'work4.'+pKey`),aiCtxBox 也在透传(html:2883);
- 但 `aiButton` 的解构(html:2815)**不含 aiScope**——传进来即被丢弃,从不消费;
- `AIProv.mark` 全库仅 workshop1.js:2355 一处弱引用调用(typeof 守卫),其余 mark/confirm/badge/forScope 零调用;aiScope 与 mark 之间没有任何接线。

后果:AI 生成字段与用户手改字段事后无法区分;无"AI 标记/未确认"UI(quality 规则文案"见右上角 AI 标记"指向不存在的 UI);导出/存档无来源痕迹——与"AI 起草、人工复核采纳"的产品理念链路断开。

## 期望

aiButton/aiCtxBox 消费 aiScope,成功后对目标路径调 AIProv.mark,对应字段渲染 badge;人工编辑后 confirm。

## 复现

1. 任一工作坊点 AI 起草按钮(自动模式)生成内容;
2. 结果直接写入 state;任何位置查不到该内容的 AI 来源标记(字段级 badge/未确认态均不存在)。

## 证据

- docs/global-brand-building.html:2815 — aiButton 解构无 aiScope
- docs/global-brand-building.html:2880-2884 — aiCtxBox 转发 aiScope → aiButton 丢弃
- docs/lib/ai_provenance.js — mark/confirm/badge/forScope 定义齐备但全库零消费(唯一调用 workshop1.js:2355)
- 13 处传参点:workshop1.js 6 处、workshop2.js 2 处、workshop3.js 3 处、workshop4.js 1 处

## 修复方向

aiButton 接受 aiScope,成功路径调用 AIProv.mark(按调用方 key),接入现有渲染位;或若溯源已被其他机制取代,删除该资产并在文档声明(见 README 附注口径)。
