# BIZ07 — 导出 Markdown 出现两个一级标题

严重度:低 / 方向:业务流程 / 确认度:confirmed

## 问题

导出 md 时两个 H1 叠出:markdown_exchange.js:21 写 `# 档案名`(标题由档案名字段驱动,既定语义),workshop5.js:1278 导出正文又写 `# {sbuName} 品牌策划书`。档案名被重命名后两个标题还会不一致。

## 期望

单一 H1(保留档案名标题语义,删正文重复 H1 或降级为二级)。

## 证据

- docs/lib/markdown_exchange.js:21
- docs/workshop5.js:1278

## 修复方向

W5 export 不再输出自己的 H1。
