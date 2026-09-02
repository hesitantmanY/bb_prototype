# Work 3 — 价值主张与定位（6 步版）

> 6 步，每步一个「AI 起草」主按键；多子动作步为真流水线（API 自动 / 手动粘贴双模式）。
> 流程：场景细分 → 卖点挖掘 → 备选卖点 → 合意性 × 可实施性评分与矩阵 → 主张与定位 → 人格与 Slogan。
> 设计系统、API 引擎、数据模型见 [README.md](README.md)。
> 上游：Work 1（SBU、客户画像/使用场景/价值体系/合成调研）、Work 2（tier1 主战场 + tier2 观察市场，旧 schema 兼容）。
> 下游：Work 4（4P 围绕选定价值主张展开）、Work 5（策划书 STP 章节）。

## 结构变更记录（2026-08-27 grilling 共识）

1. **每步一个 AI 主按键**：对齐 Work 2「每个 sub-tab 1 个 AI 按键」纪律，Work 3 每步一个「AI 起草…」主入口；条件性次级动作（迁移路径）仅适用时出现。
2. **6 步结构**：新增「场景细分」步（对齐任务清单第 1 项），末步拆为「主张与定位」「人格与 Slogan」；原「上游接入」步并入场景细分顶部只读上下文条。
3. **真流水线**：多子动作步（卖点挖掘 / 评分与矩阵 / 主张与定位 / 人格与 Slogan）主按键按单元顺序执行；Runner 支持进度、暂停、中止、断点续跑；手动模式逐单元提示词推进。
4. **重跑语义**：草稿类（场景/痛点/卖点/主张/人格/Slogan）确认后整组替换；评分类只补未完成单元，人工编辑保留。
5. **Work 2 v2 联动**：读取 `decision.tier1`（主战场）+ `decision.tier2`（观察市场）；旧数据（`matrix.selectedMarketId`）兼容回退。Work 2 v2 本体另案实现。
6. **Work 1 复用**：`work1.personas` + `work1.scenarios`（使用场景）作为场景细分草稿的种子输入（翻译为市场细分场景，不直接等同）。

---

## 数据结构

`state.work3` 完整 schema：

```js
{
  // 上游接入（只读回显 + 场景细分）
  context: {
    sbuName: "",             // work1.sbu.name
    sbuOneLine: "",
    targetMarket: "",        // tier1 市场名（旧数据回退 selectedMarketId）
    targetMarketReason: "",
    tier1: null,             // {marketId, name, rationale} — work2.decision.tier1
    tier2: [],               // [{marketId, name}] — work2.decision.tier2
    personas: [],            // work1.personas（只读引用）
    valueFramework: [],      // work1.valueFramework.indicators
    hasSurvey: false         // work1.survey.responses 是否有数据
  },

  // 场景细分（新增）
  scenarios: [
    {
      id, name: "",           // 市场细分场景名（如：母婴/适老化家庭）
      description: "",        // 规模可估算、痛点可命中、竞品未垄断
      personaIds: [],         // 关联 work1 画像 id
      needStrength: { pain: 0, willingness: 0, frequency: 0 }, // 1–10
      selected: false         // 主战场
    }
  ],

  // 卖点挖掘（双模式 AI）
  mining: {
    documents: [],            // 语料（粘贴/导入）
    includeWork1Open: true,
    includeWork1Themes: true,
    ldaParams: { k:5, passes:15, iterations:100, no_below:2, no_above:0.5 },
    ldaResult: null, ldaError: null,
    topics: [],               // [{id,label,share,keywords,representative_docs}]
    wordFreqTop: [], stats: null,
    painMap: [                // 痛点/痒点
      { id, pain, evidence, frequency, linkedNeeds: [], linkedTopicId, type: "痛点"|"痒点", scenarioId }
    ]
  },

  // 备选卖点
  candidates: [
    {
      id, name: "", pain: "", description: "", evidence: "",
      source: "ai"|"user",
      scenarioId: "",         // 关联场景（新增）
      selected: false,
      desirabilityScores: {}, // personaId → {importance,uniqueness,credibility}
      importance: 0, uniqueness: 0, credibility: 0, desirability: 0,
      desirabilitySource: "personas"|"ai"|"user",
      feasibility: 0, communicability: 0, sustainability: 0, implementability: 0,
      implementabilitySource: "ai"|"user",
      extraDims: {}
    }
  ],

  dimensions: {
    desirability: [
      { key: "importance", label: "重要性", definition: "这个卖点对客户有多重要" },
      { key: "uniqueness", label: "独特性", definition: "竞品是否也在说/做" },
      { key: "credibility", label: "可信性", definition: "客户凭什么相信你能做到" }
    ],
    implementability: [
      { key: "feasibility", label: "可行性", definition: "技术/供应链/成本能否实现" },
      { key: "communicability", label: "可传播性", definition: "能否用一句话让客户听懂" },
      { key: "sustainability", label: "可持续性", definition: "能否长期维持、不被轻易复制" }
    ]
  },

  matrix: { showSector: true, sectorAngle: 90, sectorRadius: 12, xCut: null, yCut: null, manualSelected: [] },
  migration: { prompt: "", analyses: [] },

  // 主张与定位
  proposition: {
    coreValueIds: [],         // selected 卖点自动同步
    alternatives: [{ id, text }],
    chosenValueText: "",
    positioning: { brand, audience, coreValue, category },
    positioningStatement: ""
  },

  // 人格与 Slogan（自 proposition 迁出）
  identity: {
    mbti: "", personalityTraits: [],
    sloganOptions: [], chosenSlogan: ""
  },

  _scoreDone: []              // 评分断点续跑（内部）
}
```

**默认值**：`scenarios` 初始为空；`candidates` 初始 5 个空行；`dimensions` 为上述 6 维；`identity` 为空对象。演示数据（皂液器 10 条卖点含完整评分）通过全局「查看演示」开关注入。

## 数据迁移

`Work3.migrateWork3(old)`，在加载路径 `mergeWithDefaults` 之后调用：

```js
function migrateWork3(old){
  // 1. identity ← old.proposition（旧数据含 slogan/mbti/personalityTraits）
  // 2. scenarios = []（旧数据无）
  // 3. painMap[].scenarioId / candidates[].scenarioId = ""（旧数据无）
  // 4. context.tier1/tier2 ← work2.decision（缺则回退 matrix.selectedMarketId）
  // 5. 弹 toast「Workshop 3 已重构，老数据已迁移，请复核。」
}
```

Work 2 读取规则（统一 helper，masthead 摘要同用）：

- `work2.decision?.tier1?.marketId` 存在 → tier1 主战场 + tier2 观察市场；
- 否则回退 `work2.matrix.selectedMarketId` + `work2.markets`（旧 schema）。

---

## 步骤结构与主按键总览

| 步骤 | 主按键 | 流水线单元 | 产出 |
|---|---|---|---|
| 1. 场景细分 | 「AI 起草场景细分」 | 1 | 3–5 场景 + 需求强度 + 主战场 |
| 2. 卖点挖掘 | 「AI 起草痛点地图」 | 确保主题 → 痛点地图 | 主题 + 6–10 痛点/痒点 |
| 3. 备选卖点 | 「AI 起草备选卖点」 | 1 | 8–12 卖点（带场景） |
| 4. 评分与矩阵 | 「AI 起草双维评分」 | 合意性 → 可实施性 | 双维分 + 矩阵/扇面/排名 |
| 5. 主张与定位 | 「AI 起草主张与定位」 | 价值主张 → 定位句建议 | 3 备选 + 定位句 |
| 6. 人格与 Slogan | 「AI 起草人格与 Slogan」 | 人格 → Slogan | MBTI+特质 + 5 slogan |

每步顶部固定一个 AI 面板（`.ai-box`），主按键文案统一「AI 起草…」。流水线实现统一 helper，见「双模式与流水线」。

---

## 场景细分

**上游上下文条**（原「上游接入」步，只读）：`SBU · 主战场市场(tier1) · 观察市场(tier2) · N 位客户画像 · 合成调研：已完成/未完成`。点击可跳回 Work 1/2 修改；tier1 未读时提示去 Work 2 完成。

**输入（种子）**：`work1.personas`（region/painPoints/values）+ `work1.scenarios`（使用场景，翻译种子）+ work2 tier1/tier2。

**「AI 起草场景细分」**（1 单元）：

- 输出：3–5 个市场细分场景，每个含 `name`（≤12 字）、`description`、`personaIds`（关联画像）、`needStrength`（痛点真实度/支付意愿/决策频率 1–10）、`selected`（默认 3 个主战场，用户可调 2–4）。
- 默认提示词：

```
你是市场研究专家。业务"{SBU}"面向目标市场"{tier1}"（观察市场：{tier2}）。
以下是客户画像与使用场景：
画像：{personas JSON}
使用场景（Work 1 感知价值矩阵）：{scenarios JSON}
请把上述信息翻译为 3–5 个"目标市场细分场景"（不是产品使用情境），每个场景须：客群规模可估算、痛点可被现有产品功能命中、竞品未垄断心智。
为每个场景给需求强度三维分（1–10）：pain 痛点真实度 / willingness 支付意愿 / frequency 决策频率；关联 1–2 个最匹配的画像 id；默认标记 3 个主战场（selected=true）。
JSON 返回 {"scenarios":[{"name":"","description":"","personaIds":[],"needStrength":{"pain":0,"willingness":0,"frequency":0},"selected":true}]}
```

- 结果填入 `scenarios`，卡片可编辑（场景名/描述/需求强度滑块/主战场勾选/关联画像多选）。

**MVO**：≥3 个场景；已标记主战场；tier1 已读取。

## 卖点挖掘

语料输入（粘贴/导入 Excel/CSV）与 Work 1 合并勾选同旧版；LDA 参数**折叠为高级区**，不再平铺。

### 语料来源（2026-08-29 grilling 共识）

建模语料 = 真实语料 + 模拟语料（可混合，来源构成始终可见）：

- **真实语料**：粘贴/导入的评论、访谈、工单 +（按勾选）Work 1 开放题答案与主题文本，存 `mining.documents`。
- **模拟语料**：画像生成，存独立 `mining.simulatedDocuments`，不混入 `documents`。语料卡提供「生成模拟语料（基于画像）」按钮（真实 <3 条时显示补足提示，足量后也可生成作补充）；用 `AiContext` 传 `sbu / personas / scenarios / valueFramework`，每个关联画像 ≥3 条、总量 ≥9；已有真实文本保留为种子（低样本 = 混合，不是丢弃）。
- **负面反馈默认开启**：`mining.includeNegative` 默认 true，勾选框「语料包含负面反馈/抱怨」。开启时至少一半模拟语料必须是负面/抱怨/吐槽（未满足需求、失败体验、犹豫、竞品对比失望、不推荐理由），禁止「以前痛、现在好了」的种草腔；画像原话（quote）只是期望，不代表真实好评。
- **运行条件**：真实语料 ≥3 条即可建模；<3 条时经样本补足后也可建模——不再硬阻断。模拟语料在真实足量后**继续参与建模**（补充而非替代），默认勾选「建模时包含模拟语料」，可取消、可一键清除。
- **标注护栏**：语料卡显示「真实 N + 模拟 M」；`painPrompt` 语料样例每条标 `[真实]/[模拟]`；导出含语料构成。
- **文献依据**：Arora, Chakraborty & Nishimura (2025), *AI-Human Hybrids for Marketing Research: Leveraging LLMs as Collaborators*, Journal of Marketing 89(2) 43-70（DOI 10.1177/00222429241276529）——人机混合（真实 + 合成受访者组合）优于纯人类/纯 LLM，合成数据需 few-shot/RAG 校准，LLM 会错需人监督 + 标注。

**「AI 起草痛点地图」**（2 单元流水线）：

- 单元 A「确保主题」：`topics` 已有则跳过；否则用 `collectDocs()`（真实 + 按勾选并入模拟）调 `/api/lda` 真跑（后端未连接用 LLM 模拟，UI 标注「模拟」）；语料不足 3 条时提示先生成/提交语料。
- 单元 B「起草痛点地图」：LLM 输入 = SBU + 市场 + 主题（含关键词/代表原文）+ Work 1 数据（按勾选）+ 语料样例（每条标 `[真实]/[模拟]`）；痛点必须来自负面体验或未满足需求，evidence 优先摘录负面语料原文；输出 6–10 条痛点/痒点，每条含 `pain/evidence/frequency/linkedNeeds/linkedTopicId/type/scenarioId`；**主题名在本次调用内联生成**（移除独立「用 AI 命名主题」按钮）。
- 默认提示词：旧版痛点地图提示词 + `scenarios` 候选列表 + `scenarioId` 字段 + 主题命名要求。

**手动模式**：若主题已存在，显示痛点地图提示词；若不存在，显示合并提示词（模拟主题 + 命名 + 痛点地图一次输出）。

**LDA 结果区**（数据概览/词频 Top 25/主题卡）保留为只读呈现，不做独立 AI 按钮。

**MVO**：主题（或模拟主题）≥1；痛点地图 ≥5（含痛点和痒点）。

## 备选卖点

卖点表 = 卖点 + **关联痛点**（按 `painId` 关联痛点地图，下拉可改/可自定义输入）+ 方案描述 + **支撑证据** + 场景列（可留空/自定义）。

**「AI 起草备选卖点」**（1 单元）：输入 SBU + 市场 + `painMap`（含 id）+ `scenarios` + Work 1 价值体系；输出 8–12 个卖点，每个含 `name/painId/pain/description/evidence/scenarioId`，**painId 必须取自痛点地图，不得编造**；返回后按 painId（或文本模糊匹配兜底）落库，证据为空时自动带入所关联痛点的 `evidence`。

**关联痛点语义**：AI 起草自动绑定；老数据只有文本时由 `Work3.resolvePainId` 模糊匹配兜底；用户始终可下拉修改或选「自定义…」输入新痛点文本（`painId` 置空，`pain` 存自定义文本）。

**支撑证据**：关联痛点后自动带入该痛点的证据，可改写。三种可接受形态——语料原文摘录（模拟语料标 `[模拟]`）、量化统计（"N 篇评论提及 X"）、可验证的第三方/内部依据；确实没有写「内部策略，无评论」，不编造。

**评分维度管理**：不变（6 维默认，可增删改名，每侧至少保留 1 个）。

**MVO**：卖点 ≥6；每条绑定了痛点与证据；每条有场景（可留空但提示）。

## 评分与矩阵

评分落点：可实施性维度分直接写 `c[d.key]`；合意性在有合成调研时先写 `desirabilityScores[p.id]`（逐 persona），完成后回填各维度 persona 均值到 `c[d.key]`（重要性/独特性/可信性三列显示用）。`desirability`/`implementability` 聚合值由 `computeMatrix` 现算，不落盘——MVO 与健康检查按「维度分齐全或 persona 子分存在」判分，不要依赖不存在的聚合字段。

**「AI 起草双维评分」**（2 单元流水线，复用 `runScoringUnits`/Runner）：

- 单元 A 合意性：`context.hasSurvey` → 逐 persona 打 3 子分（system=persona 描述，user=卖点 + 3 子问题，多卖点 × 多 persona 并行）；否则 AI 直接评分（提示「Work 1 未完成合成调研，将由 AI 直接评分」）。
- 单元 B 可实施性：企业内部视角打 3 子分（可行性/可传播性/可持续性）。
- 断点续跑：`_scoreDone` 记录已完成 (persona×卖点) 单元，刷新后跳过；已有人工编辑保留。

**评分表**：不变（展开明细、AI 角标、手改后角标消失）。

**矩阵 + 扇面 + 排名表**：不变；排名表新增「场景」列；矩阵点 tooltip 显示场景名。象限底色/扇面叠加/手选覆盖逻辑均不变。

**「AI 起草迁移路径」**（条件性次级按键，非主入口）：仅当存在扇面外卖点时显示，逻辑同旧版。

**MVO**：所有卖点有合意性与可实施性分；存在入选卖点。

## 主张与定位

**入选核心卖点**：`selected=true` 自动同步，卡片展示，可拖拽排序（决定主辅）。渲染顺序 = `proposition.coreValueIds`（不在顺序表的扇面直选卖点排末尾）；拖拽把卖点插到目标之前，drop 后立即按新顺序重排。

**「AI 起草主张与定位」**（2 单元流水线）：

- 单元 A：3 个差异化价值主张备选（20–40 字，说清"为谁、提供什么、有何不同"），写入 `alternatives` 由用户选定。
- 单元 B：定位句建议——按四要素（品类/目标客群/差异化卖点/可量化利益）给填空建议，回填 `positioning` 四空（用户可改，实时预览不变）。
- 默认提示词：旧版价值主张提示词 + 定位句模板提示词。

**重生成语义**：已生成过（`alternatives` 非空）→ 按钮变「重新生成主张与定位」，点击清 `_pipeProp` 断点、候选**整组替换**（不追加）、定位句按新结果覆盖；未生成过 → 「AI 起草主张与定位」。

**定位句**：填空式模板 + 实时预览不变；示例（比亚迪海狮05EV）保留。

**灵魂三问自检**（课程 3.3.2，只读提示卡）：「这个价值主张长期成立吗？对客户真的有利吗？经得起社会拷问吗？（伦理 / 文化禁忌 / 长期影响）」。

**MVO**：已选定价值主张；定位句四要素完整。

## 人格与 Slogan

**「AI 起草人格与 Slogan」**（2 单元流水线）：

- 单元 A：MBTI + 3–5 个人格特质（基于价值主张 + 目标客群）。
- 单元 B：5 个 slogan（中文 12 字内，含情感驱动词）。
- 用户选定/编辑；选定项写入导出。

**不做**：logo 设计 / 视觉识别系统 / 色彩规范（维持边界，工具只输出文字方向供 Midjourney/设计师使用）；汇报 PPT 工具外。

**MVO**：MBTI 或特质 ≥1；已选定 slogan（可空但提示）。

---

## 双模式与流水线（AI 引擎）

新增统一 helper `API.aiPipeline(container, units, opts)`（基于现有 Runner / runScoringUnits / manualBox 模式）：

- `units = [{ key, label, buildPrompt, onResult }]`；`key` 用于断点续跑（已完成单元跳过）。
- **API 自动模式**：顺序执行；单元间可暂停（`Runner`），当前请求进行中不可真暂停（后端非流式），暂停发生在单元之间；× 中止保留已完成单元；再次点击从断点继续，不重复计费。
- **手动模式**：逐单元显示提示词（复制 → 粘贴 → 解析并填入 → 「下一步」）；可跳过单步；无后台进程。
- **单单元失败**：API 失败自动降级为该单元手动箱，可继续/跳过后续单元。
- **重跑语义**：草稿类单元 `onResult` 替换前 `confirm()`（「重新起草将替换当前草稿」）；评分类只补 `_scoreDone` 缺失单元。

主按键统一命名「AI 起草…」；所有主按键双模式（顶栏 `[API 自动 | 手动模式]` 切换不变）。

## 与其他 Work 的数据接口

| 方向 | 数据 |
|---|---|
| ← Work 1 | SBU、personas（含使用场景，作场景细分种子）、价值体系、合成调研开放题与主题、调研完成状态 |
| ← Work 2 | tier1 主战场 + tier2 观察市场（v2；旧数据回退 selectedMarketId） |
| → Work 4 | 入选卖点、定位陈述、品牌人格、slogan |
| → Work 5 | 目标市场、场景细分、价值主张、定位陈述、品牌人格（策划书 STP 章） |

## MVO 与跨工作坊闭环 CTA

6 步 MVO 汇总见各步；末步 `identity` 的 mvo 全过后显示「IV. 营销组合 →」（`UI.nextWorkCta`，规则同 work1 step8，work5 终点不加）。

## 验收测试场景

1. **冷启动**：work1/2 空 → 场景细分 AI 提示先完成上游。
2. **正常路径**：work1 完整 + work2 tier1 → 6 步全跑通，每步一个主按键。
3. **流水线**：卖点挖掘（有/无主题两条路径）、双维评分（persona/direct 两模式）、主张定位、人格 slogan 单元顺序正确；中途暂停/刷新续跑不重复计费。
4. **手动模式**：全部主按键走「复制 + 粘贴」逐提示词流程，可跳过。
5. **重跑语义**：草稿替换需确认；评分只补缺，人工编辑保留。
6. **数据迁移**：旧 work3（无 scenarios、proposition 含人格/slogan）→ 新 schema 无损；work2 旧/新 schema 读取均正确。
7. **导出**：`Work3.exportMd()` 含场景、痛点、卖点（含场景标签）、矩阵、主张、定位、人格、slogan。

## Assumptions

1. Work 2 v2 本体（3 tab + Hybrid 2 Delphi + 三档决策）另案实现；本次仅 work3 读取/摘要适配 + 旧兼容。
2. Work 1「使用场景」≠ Work 3「市场细分场景」：前者只作 AI 草稿种子，不自动拷贝。
3. 主按键文案统一「AI 起草…」；VI 与 PPT 明确不做。
4. 手动模式流水线不产生后台进程，沿用 manualBox 语义。
5. 场景为可选组织维度：painMap/candidates 的 `scenarioId` 可留空，不影响主流程；有场景时用于排序/提示/导出。
