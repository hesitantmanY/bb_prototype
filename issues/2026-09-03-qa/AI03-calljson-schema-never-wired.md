# AI03 — CallJsonStrict 的 schema 校验/重试从未启用

严重度:中 / 方向:AI 管线 / 确认度:confirmed(机制;实际触发取决于 LLM 输出形态)

## 问题

call_json_strict.js 的 schema 校验 + 重试机制是死分支:调用点统一传 `schema: null`(html:2735),库内 `if(!schema) return ok` 使 SchemaCheck.validate 永远不执行。所有 AI 调用(合成调研、Delphi、各 AI 按钮)只做"能 parse 就收",顶层结构错(如 work2 决策返回顶层数组、漏 required key)不重试,交给各站点 onResult 的 `if(!r?.xxx) return` 静默跳过——字段静默未更新,用户无感知。

与 schema_check.js 自身的单元测试覆盖、以及 CallJsonStrict 的设计意图(带 schema 失败重试一次)不匹配。

## 期望

高频调用点为已知输出形状补 schema(work2 scores/decision/tiers、work3 dims 等 few-shot 已有对应形状),把 schema 传进 CallJsonStrict;结构校验失败时可见(重试或明示)。

## 复现(视 LLM 输出而定)

1. work2 决策步 AI 起草,让 LLM 返回顶层数组或缺少约定的 ratings/decision 键(部分模型偶尔如此);
2. 解析成功但字段不写入,无任何提示,toast 已消失。

## 证据

- docs/global-brand-building.html:2735 — `schema: null` 硬编码
- docs/lib/call_json_strict.js:67-72 — `if(!schema) return ok`

## 修复方向

为少数高频调用点提供 schema 并接线;或至少在顶层结构不符预期时走既有警告通道提示用户。
