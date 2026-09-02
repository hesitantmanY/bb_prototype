# Work 2 — 目标市场选择

> **3 步对齐课程 2.3 节的 3 个活动**(构建评估体系 / 评估候选市场 / 矩阵选市场)。
> **3 个 sub-tab**，每个 1 个 AI 按键；**构建评估体系内部分 6 阶段**。
> 所有 AI 深度消费 work1 产物(`sbu / environment / ourCapabilities / personas / competitors / metrics / recommendations`)。
> **Delphi 升级为 Hybrid 2 风格**(论文 *"AI-Human Hybrids for Marketing Research"* JM 2025):1 call 招聘 + 5 call 深 persona(RAG + few-shot)+ user 主持 + 可选 1 call 收敛。
> **AI 提问流程全局优化**(2026-08-27 决策):所有工作坊的 AI 按钮统一走 `docs/lib/ai_context.js` 的最小上下文包 + 「消息设置」折叠区,详见文末「AI 生成提问流程优化(全局机制)」。
> 设计系统、API 引擎见 [README.md](README.md)。上游:Work 1。下游:Work 3(读 `decision.tier1.marketId`)。

---

## 总览：3 步流程

| Sub-tab | 课程活动 | 内部段落 | AI 按键 | 成本 |
|---|---|---|---|---|
| **1. 构建评估体系** | 1. 构建评估体系 | 候选清单 / 筛选标准 / 应用筛选 / 指标体系 / 权重(Hybrid 2 Delphi) | 1 个「AI 从 work1 推导评估体系」 | 9-10 call |
| **2. 评估候选市场** | 2. 评估各意向市场 | 3 保留市场 × 16 指标 = 48 评分格 | 1 个「AI 评分」+ 范围选抶 | 0-3 call |
| **3. 矩阵 + 三档决策** | 3. 矩阵选目标市场 | 散点图 / 三档卡 / 触发再评估 | 1 个「AI 解释 + 起三档决策卡」 | 1 call |

**全程 AI 总成本:10-14 call**(原 11 call Delphi 单项 + 评估/决策 ≈ 现在覆盖全流程)

---

## 数据结构(schemaVersion: 2)

```js
Work2.defaultData = () => ({
  // ===== Tab 1: 构建评估体系 =====
  candidates: [
    // { id, name, reason, source: "user"|"ai" }
  ],
  screening: {
    criteria: [
      // { id, name, source: "user"|"ai" }
    ]
  },
  retained: [
    // { id, name, region, population, gdpPerCapita, notes, source }
  ],
  attractiveness: {
    // 默认 4×2:经济/政治法律/社会文化/风险 × 二级指标
    categories: [
      // { id, name, indicators: [{ id, name, rubric:{high,mid,low}, weight, support, source }] }
    ]
  },
  competitiveness: {
    // 默认 4×2:市场信息/营销渠道/认证合规/产品品牌 × 二级指标
    categories: [ /* 同上 */ ]
  },
  delphi: {
    // === Hybrid 2 升级版 ===
    recruitment: { perspectives: [] },  // 招聘阶段输出
    personas: [                        // persona 并行阶段输出（动态生成，不是固定 5）
      // { id, perspectiveName, keySignals, ratings, reasoning, userOverride }
    ],
    userHosted: true,                  // User 主持阶段标志
    finalWeights: null,                // 可选收敛（展示记录，回填后释放为 null）
    status: "idle",                    // idle|recruiting|personas|hosted|converging|done
    phase: null,                       // checkpoint
    drifted: false,                    // 收敛后指标体系权重被手改 → 提示偏离收敛
    // === 旧字段(保留兼容,不再使用) ===
    panel: [], round1: null, round2: null, synthesis: null, finalSynthesis: null, weights: null
  },
  // ===== Tab 2: 评估候选市场 =====
  scoring: {
    // marketId: { indicatorId: { score:0-10, evidence:str, url?:str, source:"user"|"ai" } }
  },
  // ===== Tab 3: 矩阵 + 三档决策 =====
  matrix: { xCut: null, yCut: null, notes: "" },
  decision: {
    tier1: { marketId: null, rationale: "", resourcesPct: 80, milestones: [], reEvalTrigger: "" },
    tier2: { marketIds: [], observationMetrics: [], reEvalTrigger: "" },
    tier3: { marketIds: [], reEvalTrigger: "" }
  },
  // ===== 跨 tab 元信息 =====
  meta: { schemaVersion: 2, work1Linked: false }
});
```

---

## 构建评估体系

| 标题 | 任务 | AI? |
|---|---|---|
| 候选市场清单（5-10 个） | 5-10 个市场 + 入选理由 | AI 1 call |
| 筛选标准（3-5 个可观测、可量化） | 3-5 个可观测标准 | AI 1 call |
| 应用筛选 → 保留 3 个市场 | 输出 3 个保留市场 | AI 1 call |
| 指标体系（4×2 模板，默认可覆写） | 4×2 模板(默认可覆写) | AI 1 call |
| 招聘（Delphi） | LLM 建议"该听哪 5 个视角" | AI 1 call |
| 5 persona 并行（Delphi） | 每个 persona 给权重 + 理由 | AI 5 call(并行) |
| User 主持 | user 看 5 个输出,手改权重 | 0 call |
| 收敛（可选） | AI 取均值归一化 | AI 0-1 call |

**构建评估体系总成本：9-10 call**（与原 11 call 相当但覆盖更广）

### 候选市场清单（5-10 个）

**输入**(从 work1 读):
- `state.work1.sbu.{name, category, scope, countries, summary}`
- `state.work1.environment.industry`
- `state.work1.personas[].region`

**输出**:5-10 个候选市场,每个含 `{name, reason}`。

**AI prompt 模板**:
```
system: 你是国际市场进入策略顾问。基于 SBU 特征,列出 5-10 个值得评估的海外候选市场。
user: SBU: ${work1.sbu.name} (${work1.sbu.category})
范围: ${work1.sbu.scope}
行业: ${work1.environment.industry}
目标客群分布: ${work1.personas.map(p=>p.region).join(", ")}
输出: {"candidates": [{"name": "", "reason": "1 句, 含 需求/规模/趋势 之一"}]}
```

**UI**:表格行,name + reason 字段可编辑,可增删。

### 筛选标准（3-5 个可观测、可量化）

**输入**:从 work1 读 PEST + capabilities。
**输出**:3-5 个可观测、可量化的筛选标准(如"Hofstede UAI > 80"、"市场规模 < $100M")。

**AI prompt 模板**:
```
system: 你是市场进入策略顾问。基于以下业务特征,建议 3-5 个可观测、可量化的初筛淘汰标准。每条标准必须能从一个公开数据源查到。
user: 政治环境: ${work1.environment.political}
经济: ${work1.environment.economic}
社会: ${work1.environment.social}
技术: ${work1.environment.technological}
能力: ${JSON.stringify(work1.environment.ourCapabilities)}
输出: {"criteria": [{"name": "", "source": "数据源名称"}]}
```

### 应用筛选 → 保留 3 个市场

**输入**：候选市场清单 + 筛选标准的输出。
**输出**:3 个保留市场,每个含 `{name, reason, region?, population?, gdpPerCapita?, notes?}`。

**AI prompt 模板**:
```
system: 你是市场进入策略顾问。给定 5-10 个候选市场和 3-5 个筛选标准,应用标准淘汰到 3 个保留市场。
user: 候选: ${JSON.stringify(candidates)}
标准: ${JSON.stringify(criteria)}
输出: {"retained": [{"name": "", "reason": "为什么留"}]}
```

**UI**:3 张详细字段卡(name / region / population / gdpPerCapita / notes),可编辑。

### 指标体系（4×2 模板，默认可覆写）

**默认模板**:
- **市场吸引力(attractiveness)**:经济(市场规模/中高端容量 + 经济景气度/消费意愿)、政治法律(出海政策/贸易摩擦 + 认证要求/合规成本)、社会文化(目标客群需求强度 + Hofstede 文化维度匹配度)、风险(汇率/回款 + 物流时效/库存)
- **业务竞争力(competitiveness)**:市场信息(需求数据可获取性 + 竞品数据可监测性)、营销渠道(电商平台成熟度 + KOL/合作渠道)、认证合规(既有认证可复用度 + 法律服务可获取性)、产品与品牌(客户基础可迁移性 + C 端品牌能力起点)

**每个一级默认权重 0.25,每个二级权重 = 0.5(一级内归一化)**。

**AI prompt 模板**:
```
system: 你是营销研究方法专家。基于以下业务特征,建议 4 一级 × 2 二级 的市场吸引力指标 + 业务竞争力指标。每个指标给高中低评分锚点。
user: PEST: ${work1.environment}
能力: ${work1.environment.ourCapabilities}
竞品: ${work1.environment.competitors}
请按以下 4×2 模板输出(可微调一级名但不能删一级):
  吸引力: 经济 / 政治法律 / 社会文化 / 风险
  竞争力: 市场信息 / 营销渠道 / 认证合规 / 产品品牌
输出: {"attractiveness": {"categories": [{"name": "", "indicators": [{"name": "", "rubric": {"high": "", "mid": "", "low": ""}}]}]}, "competitiveness": {...}}
```

**UI**:可折叠的 4 个一级 card,每 card 内 2 个二级指标行;user 可整 card 增删、二级增删改。

### 权重：Hybrid 2 Delphi（先招聘后画像）

**依据论文**:*AI-Human Hybrids for Marketing Research*(JM 2025)— 论文验证"先招聘后画像"模式产出异质性更高的合成数据。

#### 招聘

**AI prompt 模板**:
```
system: 你是营销研究方法专家。给定一个 SBU,建议做"海外市场选择"时应该重点听哪 5 个视角/利益方。
user: SBU: ${work1.sbu}
行业: ${work1.environment.industry}
能力: ${work1.environment.ourCapabilities}
输出: {"perspectives": [{"name": "视角名", "rationale": "为什么这个视角重要", "keySignals": ["3-5 个该视角最在意的信号"]}]}
```

#### 5 persona 并行

**每个 persona 配**:
- 深 system prompt(含 perspective.name + rationale + keySignals)
- few-shot:1 个"好的权重推理示例"
- RAG:塞入该 perspective.keySignals 相关的 work1 字段

**AI prompt 模板**:
```
system: 你是 ${perspective.name} 专家。${perspective.rationale}
你最在意的信号: ${perspective.keySignals.join("、")}。
few-shot 示例: 财务紧张创业公司出海 → EBIT 0.5 / 增长 0.3 / 竞争 0.2,理由是短期要回本。
请对下列指标赋权重(${axis} 维度内总和=1)。
user: SBU: ${work1.sbu.name} (${work1.sbu.category})
环境: ${work1.environment}
能力: ${work1.environment.ourCapabilities}
竞品: ${work1.environment.competitors}
指标 (axis=${axis}):
  - ${ind.name}: 高分锚点 ${ind.rubric.high} / 中分 ${ind.rubric.mid} / 低分 ${ind.rubric.low}
输出: {"ratings": {"<id>": 0.0-1.0}, "reasoning": "<30字理由>"}
```

**运行**:5 个 parallel call。

#### User 主持(no AI)

**UI**:
- 5 张 persona 卡片平铺
- 每张显示:perspective 名 / 完整权重表 / 1 句理由
- 顶部 banner:「这 5 位视角的权重有分歧。你可以:① 采纳 AI 收敛 ② 手动改 ③ 保留分歧给不同方案分别跑矩阵」
- 每个权重行可编辑
- 「AI 收敛」按钮（执行收敛）

#### 收敛(可选)

**AI prompt 模板**:
```
system: 你是研究方法主持人。5 位视角分别给出指标权重(已含用户手改)。请取均值(同轴内归一化),输出最终权重。
user: 5 persona 权重: ${JSON.stringify(personas)}
输出: {"weights": {"attractiveness": {"indId": w}, "competitiveness": {"indId": w}}, "summary": "1 段"}
```

**结果**:收敛权重（同轴内归一化）回填到存储的两级权重——一级权重 = 该一级下各二级收敛权重之和,二级权重 = 收敛权重 ÷ 一级权重,令 `一级 × 二级 == 收敛权重`;`delphi.status='done'`、`delphi.summary` 记录收敛。`finalWeights` 仅作展示/历史记录,不再作为计算权威;存量带 `finalWeights` 的档案在加载时一次性回填后置空（幂等,见 ADR-0002）。

---

## 评估候选市场

- 1 个表格:3 行(市场)× 16 列(指标)= 48 格
- 每格:input number 0-10 + 必填 evidence (1 行)+ 可选 URL
- 顶部 AI 按钮「AI 评分」+ 范围选抶(全部 / 市场 A / B / C)

### AI 评分

**输入**(从 work1 读):
- `work1.environment.competitors` (5-7 家):作为打分对照
- `work1.personas`:客群需求强度打分依据
- `work1.metrics.dimensions`:C 端品牌能力依据

**AI prompt 模板**(每市场一次 call):
```
system: 你是市场进入评分员。根据 SBU 与 rubric,对给定市场在每个指标上打 0-10 分。
user: SBU: ${work1.sbu}
竞品对照: ${work1.environment.competitors}
客群需求: ${work1.personas}
市场: ${market.name} (${market.region}, ${market.population}, ${market.gdpPerCapita})
指标:
${indBlock}
输出: {"scores": {"<id>": 0-10}, "evidence": {"<id>": "10-30 字依据"}, "sources": {"<id>": "可选 URL"}}
```

**并行**:3 个市场用 `Promise.all` 并行。

**UI 反馈**:每格显示 AI dot(标记 source="ai"),user 编辑后 dot 消失。

### 数据源约束

- 每格 `evidence` 必填(10-30 字)
- 每格 `url` 可选(指向报告/新闻/公司公告)
- 提交时校验:score 必须有,evidence 必须有,url 可缺

---

## 矩阵 + 三档决策

### 散点图

- 4 象限:明星 (高/高)/ 产能 (低/高)/ 双低 / 潜力 (高/低)
- xCut/yCut 可手设或默认中位数
- 排名表附在图下

### 三档决策卡

**字段**:
| 字段 | tier1 主战场 | tier2 观察期 | tier3 放弃/暂缓 |
|---|---|---|---|
| marketId(s) | 单个 | 列表 | 列表 |
| rationale | 为什么 | 为什么观察 | 为什么暂缓 |
| resourcesPct | 数字(如 80) | 数字(如 5) | 0 |
| milestones | 6 个月里程碑 | — | — |
| observationMetrics | — | 观察指标 | — |
| reEvalTrigger | 触发再评估条件 | 触发再评估条件 | 触发再评估条件 |

**AI 按钮「AI 解释 + 起三档决策卡」**(单次输出全部):

**输入**(从 work1 读):
- `work1.recommendations.{short, mid, long}`:作为 milestones 引用
- `work1.sbu.boundary`:作为"为什么主战场选这个"的战略契合依据

**AI prompt 模板**:
```
system: 你是国际市场战略顾问。基于矩阵结果,给出三档决策 + 每档象限解释 + 触发再评估条件。
user: SBU: ${work1.sbu}
边界: ${work1.sbu.boundary}
建议: 短期 ${work1.recommendations.short} / 中期 ${work1.recommendations.mid} / 长期 ${work1.recommendations.long}
矩阵结果:
${matrix.map(p => `- ${p.name}: 吸引力 ${p.y.toFixed(2)}, 竞争力 ${p.x.toFixed(2)}, 象限 ${p.quadrant}`).join("\n")}
输出: {
  "explanations": {"<marketName>": "为什么落在这个象限"},
  "tier1": {"marketId": "<id>", "rationale": "", "resourcesPct": 80, "milestones": ["3-5 条"], "reEvalTrigger": ""},
  "tier2": {"marketIds": ["<id1>", "<id2>"], "observationMetrics": ["2-3 条"], "reEvalTrigger": ""},
  "tier3": {"marketIds": ["<id>"], "reEvalTrigger": ""}
}
```

**UI**:3 张卡片平铺,user 可手改任何字段;改 tier1.marketId → tier2/tier3 自动调整。

---

## 数据迁移(schemaVersion: 1 → 2)

```js
function migrateWork2(old) {
  if ((old.meta?.schemaVersion ?? 1) < 2) {
    return {
      ...old,
      candidates: old.markets?.slice(3).map(m => ({ id: m.id, name: m.name, reason: m.notes || "", source: "user" })) || [],
      retained: old.markets?.slice(0, 3) || [],
      attractiveness: {
        categories: bucketIndicatorsByCategory(old.attractiveness?.indicators || [], "attractiveness")
      },
      competitiveness: {
        categories: bucketIndicatorsByCategory(old.competitiveness?.indicators || [], "competitiveness")
      },
      decision: {
        tier1: {
          marketId: old.matrix?.selectedMarketId || null,
          rationale: old.decision?.rationale || "",
          resourcesPct: 80,
          milestones: old.decision?.nextSteps ? [old.decision.nextSteps] : [],
          reEvalTrigger: ""
        },
        tier2: { marketIds: [], observationMetrics: [], reEvalTrigger: "" },
        tier3: { marketIds: [], reEvalTrigger: "" }
      },
      meta: { schemaVersion: 2, work1Linked: false }
    };
  }
  return old;
}
function bucketIndicatorsByCategory(inds, axis) {
  const defaultNames = axis === "attractiveness"
    ? ["经济", "政治法律", "社会文化", "风险"]
    : ["市场信息", "营销渠道", "认证合规", "产品品牌"];
  // 按指标名模糊匹配归类;不匹配的归到第一个
  // ...(见实现)
}
```

迁移时弹 toast:「Workshop 2 已重构,老数据已迁移,请复核。」

---

## AI 生成提问流程优化(全局机制 · 2026-08-27 决策)

> 适用于全部 5 个工作坊的 AI 按钮。目标:**准确性优先**(相关上下文必给、无关上下文不给——无关信息是噪音,会稀释模型注意力)、**用户知情可控**(生成前可查看/调整将发送的消息)、**不 dump 整包 state**(字段级截断)。token 节约是副产品,不是目的。

### 共享库 `docs/lib/ai_context.js`(新增)

| API | 职责 |
|---|---|
| `AiContext.sections(workId)` | 每工作坊注册上下文节:节名 / 来源(state 路径) / 截断上限 |
| `AiContext.digest(workId, cfg)` | 按「上游 state 指纹 + cfg(选中节 + fewShot 选择)」会话内缓存,返回稳定共享前缀 |
| `AiContext.buildPrompt({workId, needs, system, instruction, fewShot})` | 拼 messages:`[system + 共享 digest] + 按钮指令`,稳定前缀在前 |
| `AiContext.estimateTokens(text)` | 3 字符/token 估算(同 `file_context.js`) |
| 护栏 | digest 上限 ≈1000 tokens;超限丢弃低优先级节并注明「已省略」 |

### 上下文节注册表(节名 / 来源 / 截断上限)

| work | 节 | 来源 | 上限 |
|---|---|---|---|
| work1 | `sbu` | `work1.sbu.{name,category,scope,summary,boundary}` | 全量(短字段) |
| work1 | `environment` | `work1.environment.{political,economic,social,technological,industry,ourCapabilities,competitors}` | 每维 ≤200 字 |
| work1 | `personas` | `work1.personas[]` | 痛点 ≤120 字/条,其余 ≤60 字 |
| work1 | `insights` | `work1.analysis.insights` | ≤300 字 |
| work1 | `valueFramework` | `work1.values.*` | ≤200 字 |
| work1 | `metrics` | `work1.metrics.dimensions` | ≤300 字 |
| work2 | `markets` | `work2.candidates / retained` | 全量(行少) |
| work2 | `indicators` | `work2.attractiveness / competitiveness` | ≤400 字 |
| work2 | `matrix` | `work2.matrix` + 各市场得分 | ≤200 字 |
| work3 | `positioning` | `work3.proposition.{chosenValueText,positioningStatement,chosenSlogan,mbti}` | 全量 |
| work3 | `differentiators` | `work3.candidates[]` 入选项 | ≤200 字合计 |
| work3 | `painMap` | `work3.mining.painMap` top 5 | ≤200 字 |
| work4 | 各 P | `work4.*`(含新增 certList / scenarios / risk 等) | 按交付物 ≤400 字 |
| work5 | `ch4_mix` | `work5.ch4_mix` | ≤600 字 |

### 按钮 `needs` 声明(开发侧,用户不可见)

- 每个按钮声明需要的节;「消息设置」默认勾选 = `needs`。例:
  - work2 候选市场:`needs:['sbu','environment','personas']`
  - work2 persona 并行赋权:`needs:['sbu','environment','indicators'] + fewShot:'delphi.weights'`
- 精度原则:**相关节全给、无关节不给**。`needs` 的首要作用是精度而非省钱——给错信息比给少信息更伤输出质量。

### 「消息设置」折叠区(每个 ai-box,默认收起)

| 控件 | 行为 |
|---|---|
| 上下文节勾选 | 列出该按钮可用节,默认 = `needs`;用户可加勾/去勾 |
| 示例(few-shot) | `无示例` / `通用格式示例`;结构化按钮默认开,纯文本按钮默认无 |
| 消息预览 | 显示将发送的 prompt + 估算 token 数 |
| 重置为推荐 | 恢复 `needs` 默认 + 默认 fewShot |

- 手动模式不变(复制提示词 + 粘贴结果);消息预览复用同一 digest 缓存,不重复构建。
- **不用演示案例做 few-shot**(会把模型带偏到案例公司数据)。通用格式示例 = 每交付物一小段「输入片段 + 期望 JSON 形状」占位样例,指令注明「仅参考格式,勿照抄内容」。

### 缓存与重试

- digest 指纹 = 上游 state 版本 + 选中节 + fewShot 选择;同一配置重复点击 / SchemaCheck 重试命中缓存,messages 数组不重建。
- prompt 结构稳定前缀在前 → 命中 DeepSeek/OpenAI 自动 prompt 缓存;work2 Delphi 的 5 路 persona 并行与多轮迭代共享同一 digest,收益最大。

### 迁移批次

1. 新建 `docs/lib/ai_context.js` + 本规格落地
2. W4 全部按钮(18 个)先采用
3. W3/W5 简单按钮(痛点地图 / 备选卖点 / slogan / 4C / SWOT / 起名等)
4. W1/W2 循环流程(合成问卷、Delphi 招聘–收敛全流程、AI 评分)最后迁移——每轮迭代共享同一 digest

### 本文件(work2.md)受影响点

- 各节内联的「AI prompt 模板」保留为模板正本,实现时改写为 `needs` + `instruction` 声明,经 `AiContext.buildPrompt` 调用。
- persona 并行阶段已内联的 few-shot 示例移入通用格式示例注册表(键 `delphi.weights`),UI 走「消息设置」的示例选择。

---

## 验收测试场景

1. **冷启动**：清空 state → 构建评估体系 AI 弹"work1 未填，请先完成 work1"
2. **正常路径**：work1 完整 → 构建评估体系 6 阶段全跑通 → 评估候选市场 48 格填满 → 矩阵 + 三档决策 3 档卡填满
3. **Delphi Hybrid 2**:① 招聘 1 call 输出 5 perspectives ② 5 personas 并行带 RAG work1 ③ user 主持可改权重 ④ 收敛取均值
4. **三档可改**：矩阵 + 三档决策改 tier1.marketId → tier2/tier3 自动调整
5. **Manual mode**:所有 AI 按键在无 API key 时走"复制 + 粘贴"流程
6. **数据迁移**:schemaVersion=1 → 2 字段映射正确
7. **导出**:`Work2.exportMd()` 输出符合新 6 段结构,work3 能解析

---

## Assumptions

1. **Delphi = Hybrid 2 升级版**(6-7 call + user 主持 + RAG/few-shot)
2. **Work1 缺失时 Work2 不复制 work1 表单**,只降级 AI 输出
3. **样本数据**:`docs/demo-data.js` 集中提供,不硬编码到 workshop2.js
4. **`Runner.start({total: 6, pausable: true})` 可支撑构建评估体系的 6 阶段**
5. **tier1 必须有市场**(强制非空),tier2/tier3 可空
6. **Work3 改造**只改主市场读取 + 加 tier2 上下文,不动其他步骤
7. **论文依据**:Arora, Chakraborty & Nishimura (2025), *AI-Human Hybrids for Marketing Research: Leveraging LLMs as Collaborators*, Journal of Marketing 89(2) 43-70（DOI 10.1177/00222429241276529）

---

## 实施顺序(Goal 模式时)

1. 改 `state.work2` schema + 迁移逻辑
2. 改 `Work2.steps` → 3 tab
3. 构建评估体系基础阶段（候选 / 标准 / 筛选 / 指标）
4. 构建评估体系 Delphi 阶段（Hybrid 2 Delphi）
5. 评估候选市场（48 格 + 必填依据 + 1+选抶）
6. 矩阵 + 三档决策（散点图 + 3 档卡 + 单 AI 输出）
7. Work3 适配
8. 5 个 sample case 迁 schema
9. 写新测试 + 跑通 7 个验收场景
10. 更新 `docs/specs/`

---

## 文件改动清单

| 文件 | 改动 |
|---|---|
| `docs/lib/ai_context.js` | **新增**:全局 AI 上下文机制(sections 注册 / digest 缓存 / buildPrompt / token 护栏) |
| `docs/workshop2.js` | 主改:3 tab、Hybrid 2 Delphi、6 阶段 Runners、3 档卡 UI、新 schema、迁移 hook |
| `docs/global-brand-building.html` | 改 `Work2.steps`、迁移 hook、3 档 CTA、3 档总结 panel |
| `docs/workshop3.js` | `selectedMarketId` → `tier1.marketId`、加 tier2 读取 |
| `docs/demo-data.js` | 5 个 sample case 迁 schema |
| `tests/random_example.test.js` | 改断言 |
| `tests/cases.shanmu_tea.test.js` | 改断言 |
| `tests/work2_migration.test.js` | **新增** |
| `tests/work2_delphi_hybrid2.test.js` | **新增** |
| `docs/specs/work2/工作坊2:海外目标市场选择.md` | 校对(应已对齐 3 活动) |
| `docs/specs/README.md` | 同步 3 步法 |
