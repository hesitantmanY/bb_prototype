# BIZ05 — W1「清空回答」后 analysis 统计/实测分不失效

严重度:中 / 方向:业务流程 / 确认度:confirmed

## 问题

W1 合成调研跑完后,「清空回答」只清 survey 侧的 `s.likertStats`/`s.openThemes`——这两个字段在默认 survey 数据里根本不存在(统计实际存在 `analysis.likertStats`),等于什么都没清。遗留:

- metrics 步的实测分回填(indicatorMeans → backfillScores 写入的 actual)仍显示旧值;
- analysis 步的 mvo 判据(`analysis.likertStats` 非空)仍全绿,可继续把已删调研的洞察带进 W5。

用户以为删掉了调研数据,实际旧统计/旧分数仍是"当前事实"在上下游流转。

## 期望

清空回答一并清 `analysis.likertStats/indicatorMeans/openThemes` 并重新 backfillScores 置空 actual,分析步提示"尚无调研数据"。

## 复现

1. W1 合成调研跑完(metrics 出现实测分,analysis 统计就绪);
2. 点「清空回答」;
3. 数据分析步提示尚无数据,但 metrics 实测分仍在,analysis mvo 仍绿。

## 证据

- docs/workshop1.js:2282 — 清的是 survey 侧不存在的字段
- docs/workshop1.js:227 — mvo 判 analysis.likertStats
- docs/workshop1.js:279-293 — backfillScores 读 analysis.indicatorMeans(未清)

## 修复方向

清空 handler 改为清 analysis 侧统计 + 重新 backfill 置空。
