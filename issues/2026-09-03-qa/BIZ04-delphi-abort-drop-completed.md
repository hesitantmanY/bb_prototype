# BIZ04 — Delphi persona 中止丢已完成分值:续跑变重跑,白花 token

严重度:中 / 方向:业务流程 / 确认度:confirmed

## 问题

work2 权重 Delphi 的 persona 并行批次把结果集中在 `Promise.all(...).then(results.forEach(写入 d.personas))`,全部 resolve 后才落盘。任一 persona 的请求被中止(用户点暂停再中止)即抛 AbortError → catch 分支只改 status,已完成 persona 的分值全部丢弃。断点续跑从 doneN=0 重新开始 → 已完成单元重新调用 LLM,可能得到与刚才不同的一组评分。

与 ADR 记录的"已完成单元记录在案"续跑语义矛盾(对比 work1 调查的逐单元落盘是对的)。

## 期望

单 persona 完成即写入 d.personas(完成一个 push 一个);中止只跳过未完成单元,续跑不重调已完成 persona。

## 复现

1. W2 → 权重 Delphi → 运行(5 个 persona),进度 3/5;
2. 点暂停 → 中止;
3. 重新运行 → 5 个全重跑(token 重复花费,评分可能与刚才不同)。

## 证据

- docs/workshop2.js:626-652 — Promise.all 全部完成后才 forEach 写入
- docs/workshop2.js:655-657 — 中止只置 status='personas'

## 修复方向

改为逐 persona 完成后立即 push + autosave(与 work1 调查同模式)。
