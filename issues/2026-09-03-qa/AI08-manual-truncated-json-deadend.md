# AI08 — 手动模式截断 JSON 无出路:「作为文本填入」被门控掉

严重度:低 / 方向:AI 管线 / 确认度:confirmed

## 问题

手动(无 Key 降级/手动模式)粘贴外部 AI 输出:若步级 JSON 被 max_tokens 切掉末尾,JSON.parse 与 JsonExtract 均失败 → 只有"未能解析 JSON" toast,**没有任何降级出路**——「作为文本填入」按钮只在 `!opts.rawOnly` 时出现,而 work4 步级起草传 `jsonMode:false` → rawOnly:true(workshop4.js:624),把唯一入口也 gate 掉了。_salvageJsonObject 也自认对象中途截断不可救。用户只能放弃这次外部起草重试。

## 期望

手动箱在解析失败时同样提供「作为文本填入」(正文区),与 jsonMode:false 语义一致。

## 证据

- docs/global-brand-building.html:2800-2806 — 解析门失败即 return,rawOnly 由 2806 控制
- docs/workshop4.js:624 — jsonMode:false → rawOnly:true
- docs/workshop4.js:333-360 — _salvageJsonObject 自认截断不可救

## 修复方向

解析失败时给出「作为文本填入」出口(进正文而非字段)。
