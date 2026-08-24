# Cases — schema and authoring guide

> A "case" is a pre-filled state for a brand, organized as one folder per
> brand. The main entry point is `Cases.load(brand)` which returns a full
> 5-work state object ready to be merged into the live `state`.

## Decisions (locked 2026-08-20)

1. **粒度（架构层）**: 每个 case = 一个品牌文件夹
 `docs/cases/<brand>/{work1.js..work5.js, index.js}`，work 之间模块化。
2. **覆盖度**: 5 步全字段（每个 work 的 `defaultData()` 形状必须被**完整填入**，
 无 "可选允许空"）。
3. **注入语义**: 全量覆盖 state。`Cases.load(brand)` 返回的 state 直接 `Object.assign` 给 `state`。
 载入前调用 `App.snapshot()` 做一次自动存档（与现状一致）。
4. **多案例并存**: 仓库可放多个 case 文件夹。`Cases` 是全局加载器。
5. **教学化叙事（仅主术语）**:
 - 「查看演示」按钮 → 「载入案例」
 - `docs/demo-data.js` → `docs/cases/<brand>/`
 - 不改: 随机示例按钮文案、其它出现"演示"的非主术语位置
6. **老的 `docs/demo-data.js`**: 删除并迁移，不留 shim。

## Directory layout

```
docs/cases/
 SCHEMA.md — this file
 loader.js — Cases object: list/load/load(brand,{works})
 shanmu-tea/
 index.js — { brand, label, summary, defaultWorks, getState() }
 work1.js — exports Work1.defaultData() shape, fully filled
 work2.js — exports Work2.defaultData() shape, fully filled
 work3.js — exports Work3.defaultData() shape, fully filled
 work4.js — exports Work4.defaultData() shape, fully filled
 work5.js — exports Work5.defaultData() shape, fully filled
```

## Per-work field reference (drawn from `WorkN.defaultData()`)

The shape of each `workN.js` is exactly what `WorkN.defaultData()` returns.
A "complete" case means every field present in `defaultData()` is given a
non-empty value (or, for arrays, at least one item; for objects, at least
one sub-field filled). The exact list per work:

### work1 (业务价值体系)
- `sbu`: `{name, category, stage, scope, countries[], summary, threeQuestions:{customer,channel,brand}, boundary}`
- `environment`: `{political, economic, social, technological, industry, basics:{scale,scope,products,customers,supply,performance{share,roi,growth} each {actual,target,source}}, competitors[5+ items with {id,name,price,strengths,weaknesses,position}], ourCapabilities:{delivery,core,brand,customer,compliance,defensive,critical,structural,smileCurve,trends}}`
- `personas[]`: 3–5 items with `{id,name,gender,age,occupation,income,region,values[],painPoints,channels[],quote,traits}`
- `scenarios[]`: 2+ items with `{id,name,personaIds[], benefits{usage,service,staff,image}, costs{monetary,time,energy,psychic}, anchor, decisiveGap}`
- `metrics.dimensions[]`: 5 CBBE 维度 × 3 二级指标 each `{id,name,forecast,target,actual,measure}` (forecast/target/actual 必填 number)
- `survey.questions[]`: 5+ Likert items
- `survey.responses[]`: 至少 1 轮合成调研的 N×Q 条响应
- `survey.n`, `survey.status='done'`
- `analysis.likertStats`, `analysis.openThemes` (filled)
- `analysis.indicatorMeans[]`, `analysis.insights` (filled prose)
- `values.{functional,emotional,social,epistemic,conditional}[]` (Sheth 5 维 — 各 ≥1 条)

### work2 (目标市场选择)
- `scope`: `{question, timeframe, constraints, candidateCount}`
- `attractiveness.indicators[]`: 4–6 items with `{id,name,rubric{high,mid,low},weight,support,source}` — `weight` and `support` 来自 Delphi
- `competitiveness.indicators[]`: 4–6 items (same shape)
- `delphi.panel[]`: 5 专家 (复制 `Work2.EXPERTS`)
- `delphi.round1`, `delphi.synthesis`, `delphi.round2`, `delphi.weights`, `delphi.finalSynthesis` (全部 filled)
- `delphi.status='done'`
- `markets[]`: ≥3 items with `{id,name,region,population,gdpPerCapita,notes,scores{...}, e_indId, src_indId}`
- `matrix`: `{selectedMarketId, xCut, yCut, notes}`
- `decision`: `{rationale, sequence, risks[], nextSteps}`

### work3 (价值主张与定位)
- `context`: `{sbuName, targetMarket, personas[], hasSurvey=true}`
- `mining.documents[]`: 至少 1 批 LDA 输入
- `mining.ldaParams`, `mining.ldaResult`, `mining.topics[]`, `mining.wordFreqTop[]`, `mining.stats`
- `mining.painMap[]`: ≥3 items `{id,pain,evidence,frequency,linkedNeeds[],linkedTopicId,type}`
- `candidates[]`: ≥3 备选卖点
- `dimensions.{desirability,implementability}`: ≥1 维度 each
- `matrix`: `{showSector, sectorAngle, sectorRadius, xCut, yCut, manualSelected[]}`
- `migration.analyses[]`: ≥1
- `proposition`: `{coreValueIds[], alternatives[], chosenValueText, positioning{brand,audience,coreValue,category}, positioningStatement, sloganOptions[], chosenSlogan, mbti, personalityTraits[]}`

### work4 (营销组合)
- `route`: `{scope, oemType, entryMode, light[], politicalPower}`
- `product`: `{name, description, coreDifferentiators[], physicalFeatures, serviceOffering, technologyMoat, skus[], businessType, certifications, localization, serviceLocalization, people, process, physicalEvidence}`
- `price`: `{strategy, strategyNote, tiers[], channelPricing[], promotions[], competitorPrices, ppp, pricingNumbers, fxSensitivity}`
- `place`: `{onlineSelf[], onlineThird[], onlineNotes, offlineDirect[], offlineDistrib[], offlineRetail[], offlineNotes, keyPartners[], channelIncentives, structure[], localChannelRelations}`
- `promotion`: `{advertising[], pr[], salesPromotion[], crm{tool,membership,repurchase,notes}, contentStrategy, theme, context, taboos, kolTiers, language}`

### work5 (策划书)
- `cover`: `{title, subtitle, team, date}`
- `abstract` (filled prose)
- `ch1_business` (filled prose)
- `ch2_environment`: `{political, economic, social, technological, strengths[], weaknesses[], opportunities[], threats[]}`
- `ch3_strategy`: `{segmentation, targeting, positioning}`
- `ch4_mix`: `{route, product, price, place, promotion, customerValue, customerCost, convenience, communication}`
- `ch5_outlook` (filled prose)
- `references[]`
- `lastAggregated` (timestamp)

## How to add a new case (T09+)

1. `mkdir -p docs/cases/<brand-slug>/`
2. For each workN, copy `WorkN.defaultData()` and fill every field per the
 reference above. The exported value must be **the defaultData shape** with
 values populated — not a custom structure.
3. Create `index.js`:
 ```js
 (function(){
 const work1 = require('./work1.js').data; // or: const work1 =...;
...
 const index = {
 brand: '<brand-slug>',
 label: '<Display Name>',
 summary: '<one-line description>',
 defaultWorks: ['work1','work2','work3','work4','work5'],
 getState(){ return { work1, work2, work3, work4, work5 }; }
 };
 if(typeof window!== 'undefined') window.__case_shanmu_tea = index;
 })();
 ```
4. Register the case in `loader.js` (`CASES` constant).
5. (Optional) Add to `docs/cases/README.md` index.

## What `loader.js` exposes

```js
window.Cases = {
 list(): Array<{brand, label, summary}> // all registered cases
 has(brand): boolean
 load(brand): full 5-work state object (merges with WorkN.defaultData())
 load(brand, {works:[]}): partial state, only specified works; rest = defaultData()
}
```

The merge step matters: even a "complete" case may have new fields added in
future `defaultData()` revisions. `load()` must deep-merge so missing fields
fall back to defaults, preventing the case from breaking after a product
update.

## Authoring rules

- **No "AI generated", "demo", "for teaching", "placeholder" labels** in any
 user-facing string. Cases are presented as brands.
- Numerical figures (market size, ROI, growth) should be internally consistent
 (e.g. ROI 0.8 → 1.6 over 3 years is plausible; -99% growth is not).
- Personas: avoid stereotypes. Give them a name, age, occupation, region
 that reflect the SBU's actual target market.
- Sources: when a claim has a real-world reference (e.g. a 2024 报告 number),
 put it in `source:` or a footer note. When it's a hand-estimate, mark it
 as "内部估算" — never pretend it's external.
- All strings are user-visible. Avoid English-only jargon unless it's a
 term of art in the field (e.g. "Likert", "Delphi", "PEST").
</content>
</invoke>