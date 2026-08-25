# 健康检查规则（Quality Rules）

右侧"检查"面板用这些规则判断每个步骤"写得够不够"。规则在 [docs/lib/quality_rules.js](../lib/quality_rules.js) 中定义并实时读取 `state`；本文件是给人看的说明，改规则请到 JS 文件里改。

## 怎么加/改一条规则

在 `RULES` 数组里加一条：

```js
{id:'唯一id', work:1, step:'environment', level:'warn',
 msg:'一句话说明问题',
 test:()=> /* 返回 true=没问题；false=面板显示这条 */ }
```

- `work`: 1-5
- `step`: 对应步骤 id（Work1 是 sbu/environment/personas/metrics/survey/analysis/values/recommendations；Work5 是 plan），或 `'*'`
- `level`: `warn`（红点，建议补充）或 `info`（灰点，提醒）
- SBU 步（work1.step='sbu'）按设计**不放规则**

删除一条：把它的 `off:true` 加上即可，不用删代码。

## 当前规则清单

### Work 1 业务价值体系
- environment：PEST 四维齐全；竞品≥3 家；竞品有价格/定位；能力 5 维填全
- personas：画像≥3；每个有痛点和价值观；至少 1 个场景价值矩阵
- metrics：一级指标≥4；测评点合计≥12；每个测评点有量化口径
- survey：李克特题≥5；调研已运行；**常驻提醒：回答来自 AI 合成受访者**
- analysis：综合洞察≥30 字
- values：三条主轴选定；有取舍理由
- recommendations：短中长期齐全；列了风险

### Work 2 目标市场
- scope：决策问题/时间窗口填了
- indicators：吸引力+竞争力各≥3 指标，各有 rubric
- markets：候选≥3
- scoring：每个市场所有指标有分
- decision：理由/次序填了

### Work 3 价值主张
- mining：痛点地图≥5 条
- candidates：备选卖点≥6
- matrix：卖点全部打分
- proposition：价值主张+定位句完成

### Work 4 营销组合
- route：微笑曲线位置+进入模式选定
- product：描述+差异点
- price：定价策略
- place：至少一类渠道
- promotion：主题+≥2 类手段

### Work 5 策划书
- 封面齐全；摘要≥30 字；Work1-4 章节已汇总

## 设计原则

1. **不阻断**：规则只提醒，不禁止进入下一步。对错的最终判断在人。
2. **warn vs info**：缺关键事实用 warn（红）；锦上添花/常驻提醒用 info（灰）。
3. **可操作**：每条 msg 要告诉用户"缺什么、补什么"，不写"请完善内容"这种废话。
4. **不要重复 MVO 卡片**：MVO 卡片管"最小可交付"（顶部，可勾选）；健康检查管"质量问题"（右侧，更细）。两者互补，不要把同一条写两遍。
