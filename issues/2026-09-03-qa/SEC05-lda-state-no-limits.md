# SEC05 — LDA 参数与 /api/state 无体量上限:CPU 长跑与磁盘填充

严重度:中 / 方向:安全 / 确认度:confirmed

## 问题

- `POST /api/lda` 只 clamp `k`;`passes`/`iterations`/`no_below`/`no_above` 与 documents 的条数/长度全部原样放行 → 请求传 `passes:9999999` + 千条超长文本可让 gensim 长时间占满 CPU 并膨胀内存;
- `PUT /api/state` 的 state 为任意 dict,请求体无大小上限 → 数十上百 MB JSON 直接写盘。

与 SEC01 叠加后,任意恶意网页即可触发。

## 期望

lda 端限文档条数/单条与总字符数,passes/iterations 合理 clamp;两端点加请求体上限。

## 复现

```
POST /api/lda  {"documents":["x"×1e6 ×1000条], "passes":9999999, "iterations":9999999}
```

## 证据

- server/app.py:222-235 — 仅 clamp k
- server/lda.py:127-136 — gensim 训练循环直接用参数
- server/app.py:97-103 — StateSave.state 任意 dict 无大小上限

## 修复方向

参数 clamp + documents 限额 + 请求体大小中间件/校验。
