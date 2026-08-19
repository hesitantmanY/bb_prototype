# Work 3 — 价值主张与业务定位

> 5 步，每步一个子 tab。涉及 AI 的步骤统一支持双模式（API 调用 / 手动粘贴）。
> 流程：① 目标市场接入 → ② 卖点挖掘 → ③ 备选卖点 → ④ 合意性 × 可实施性评分与矩阵 → ⑤ 价值主张、定位与品牌人格
> 设计系统、API 引擎、数据模型见 [README.md](README.md)。
> 上游：Work 1（SBU、客户画像/价值体系/合成调研）、Work 2（选定目标市场）。
> 下游：Work 4（4P 围绕选定价值主张展开）、Work 5（策划书 STP 章节）。

---

## 数据结构

`state.work3` 完整 schema：

```js
{
  // ① 目标市场接入
  context: {
    sbuName: "",             // 从 work1.sbu 自动带入
    sbuOneLine: "",
    targetMarket: "",        // 从 work2.matrix.selectedMarketId 解析
    targetMarketReason: "",
    personas: [],            // 从 work1.customerInsight.personas 带入（只读引用）
    valueFramework: [],      // 从 work1.valueFramework.indicators 带入
    hasSurveyData: false     // work1.survey.respondents 是否有数据
  },

  // ② 卖点挖掘（双模式 AI）
  mining: {
    prompt: "",
    sourcesText: "",         // 用户粘贴的任意文本（评论/高频词/客服记录…）
    includeWork1Themes: true,// 是否把 Work 1 ⑥ 主题提取结果带入
    includeWork1Open: true,  // 是否把 Work 1 开放题原始回答带入
    result: "",              // AI 输出文本
    painMap: [
      { id, pain, evidence, frequency, linkedNeeds: [] }
    ]
  },

  // ③ 备选卖点
  candidates: [
    {
      id,
      name: "",
      pain: "",
      description: "",
      evidence: "",
      source: "ai" | "user",
      selected: false,
      // 客户合意性（0–10）：逐 persona 打 3 子分后聚合
      desirabilityScores: {
        // personaId: { importance, uniqueness, credibility }
      },
      importance: 0,         // 所有 persona 均值（自动）
      uniqueness: 0,
      credibility: 0,
      desirability: 0,       // 三项均值（自动）
      desirabilitySource: "personas" | "ai" | "user",
      // 企业可实施性（0–10）
      feasibility: 0,
      communicability: 0,
      sustainability: 0,
      implementability: 0,   // 三项均值（自动）
      implementabilitySource: "ai" | "user",
      // 可增删的自定义维度（默认空，用 6 个默认维度）
      extraDims: {}
    }
  ],

  // 评分维度（默认 6 维，可增删改名）
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

  // ④ 矩阵 + 最优决策扇面
  matrix: {
    showSector: true,
    sectorAngle: 90,         // 张角（度）
    sectorRadius: 12,        // 内半径（/20）
    xCut: null,              // null = 中位数
    yCut: null
  },
  // 扇面外卖点的迁移路径
  migration: {
    prompt: "",
    analyses: [
      // { candidateId, diagnosis, actions: [], targetScores: {desirability, implementability} }
    ]
  },

  // ⑤ 价值主张、定位与品牌人格
  proposition: {
    coreValues: [],          // selected=true 的卖点自动同步
    alternatives: [
      { id, text }
    ],
    chosenValueText: "",
    positioningStatement: "",
    prompt: "",
    result: ""
  },
  identity: {
    sloganOptions: [],       // AI 生成 5 个
    chosenSlogan: "",
    mbti: "",
    personalityTraits: [],
    prompt: "",
    result: ""
  }
}
```

**默认值**：`candidates` 初始为 5 个空行；`dimensions` 为上述 6 维。演示数据（皂液器 10 条卖点含完整评分）通过全局"查看演示"开关注入。

---

## ① 目标市场接入

进入 Work 3 时自动汇总上游，只读回显 + 可补充：

- **SBU**：Work 1 名称 + 一句话说明。
- **目标市场**：Work 2 选定市场名 + 理由；未选则提示去 Work 2 完成。
- **客户画像**：Work 1 的 persona 卡片（带入 `context.personas`，用于 ④ 逐 persona 打分）。
- **价值体系**：Work 1 一级/二级指标名。
- **Work 1 合成调研状态**：检测 `work1.survey.respondents` 是否有数据，决定 ④ 的合意性打分用 persona 模式还是 AI 回退。

顶部上下文条格式：`SBU · 目标市场 · N 位客户画像 · 合成调研：已完成/未完成`。

---

## ② 卖点挖掘

对应任务清单："获取目标市场的关键需求特征：痛点 vs 痒点"。
本步分两个动作：**LDA 主题建模**（本地 Python 跑，复现课件流程）→ **AI 痛点地图**（基于 LDA 结果 + 原文）。

### 输入：多源文本框 + 八爪鱼文件导入

一个大文本区，用户随便贴，不要求格式。占位符提示可贴的来源：

> 粘贴 Amazon/TikTok/小红书/Reddit 评论、八爪鱼爬取结果、客服工单、退货记录、访谈笔记……任意文本均可。每行一条文档（或空行分隔）。

**八爪鱼/问卷星文件导入**：
- 「导入文件」按钮，支持 `.xlsx` / `.xls` / `.csv` / `.txt`。
- 优先走本地 Python 服务 `/api/parse-excel`：上传文件，返回 sheet/columns/rows + 自动识别的正文列。
- 弹出预览对话框：显示列名、前 5 行、总行数，用户选择正文列（默认选自动识别列），可选附带评分/时间列。
- 确认后把正文列每行作为一条文档，追加到语料库（可见于"语料预览"区，每行一条，可删除）。
- 后端未启动时降级为前端 SheetJS（CDN 动态加载）。

下方两个勾选项（默认都勾选）：
- ☑ 合并 Work 1 合成调研的开放题回答（作为额外文档）
- ☑ 合并 Work 1 LDA 主题提取结果（作为先验）

如果 Work 1 没数据，这两项置灰并提示"Work 1 未完成合成调研"。

### LDA 主题建模（真跑，本地 Python）

复现课件 8 步流程。参数面板：

| 参数 | 默认 | 说明 |
|---|---|---|
| 主题数 K | 5 | 2–15 |
| passes | 15 | 课件默认 |
| iterations | 100 | 课件默认 |
| no_below | 2 | 词至少出现在多少文档 |
| no_above | 0.5 | 词不超过多少比例文档 |
| α / η | auto | gensim 自动 |

「运行 LDA」按钮 → 调 `/api/lda`，返回：

**数据概览**（对应课件"数据概况"页）：
- 原始文档数、清洗后有效文档数、分词后总词数、去停用词前唯一词数、过滤后词典大小、Coherence Score（K 值下）
- 词频 Top 25（**F5 Tick Rows** 横向条形图）

**主题结果**（对应课件"LDA 主题模型结果"）：
- K 个卡片，每张显示：主题占比（%）、AI 生成的主题名（拿到关键词后让 LLM 起名字）、Top 5–8 关键词
- 各主题关键词概率分布（每主题一个小条形）
- 主题占比用 **L14 Hundred Field**（100 个点，每点 = 1%）或栗色明度梯的水平堆叠条；不做饼图（README 已禁）
- 每个主题可展开看 2–3 条代表性原文

**多 K 对比**（可选）：跑 K=3/5/7/10，对比 Coherence Score，用折线图选最优 K。默认关闭（慢）。

**LLM 命名主题**：拿到 K 个主题的关键词后，自动调 LLM：
> 以下是 LDA 模型从评论中提取的主题关键词：{keywords}。请为每个主题起一个 4–8 字的中文名，简短描述这个主题。JSON 返回 [{id, label, description}]。

**降级**：后端未启动时，「运行 LDA」按钮置灰，旁边显示「用 LLM 模拟主题提取」回退（走 LLM API，质量可接受但不是真 LDA，UI 上标注"模拟"）。

### AI 痛点地图（双模式）

LDA 结果出来后，「让 AI 提炼痛点地图」按钮可用：
- 输入：SBU + 目标市场 + LDA 主题（含关键词、代表性原文）+ Work 1 数据（如勾选）+ 用户粘贴的语料。
- 输出：痛点列表，每个含 `pain`（一句话）、`evidence`（原文摘录）、`frequency`（高/中/低）、`linkedNeeds`（1–3 个需求）、`linkedTopicId`（对应哪个 LDA 主题）。
- 填入 `painMap`，可编辑增删。
- 手动模式：提示词 + 粘贴区 + JSON 解析。

**默认提示词**：
> 你是用户研究专家。业务"{SBU}"面向市场"{目标市场}"。以下是基于评论的 LDA 主题建模结果：
> {topics JSON}
> Work 1 调研数据：{work1Data}
> 请提炼痛点地图：每个痛点含描述、代表性原文、频次（高/中/低）、对应需求、关联主题 id。用 JSON 数组返回，字段 pain / evidence / frequency / linkedNeeds / linkedTopicId。
>
> 同时区分"痛点"（必须解决的问题）和"痒点"（让人愉悦的加分项），在 type 字段标注。

工具不集成八爪鱼/Amazon API（CORS + 鉴权），只接收用户导出的文件或粘贴的文本。

---

## ③ 备选卖点

### 卖点表

可增删表格，每行一个卖点：
- 卖点名称
- 对应痛点（从 `painMap` 下拉选或自由填）
- 方案描述（产品/服务如何解决）
- 支撑证据（数据、专利、材质、测试，无则"待验证"）

### AI 生成（双模式）

「让 AI 生成备选卖点」：
- 输入：SBU + 目标市场 + `painMap` + Work 1 价值体系。
- 输出：8–12 个卖点，追加到 `candidates`。
- 手动模式：提示词 + 粘贴区。

**默认提示词**：
> 你是产品策略专家。基于痛点地图，为"{SBU}"在"{目标市场}"生成 8–12 个备选卖点。每个含 name（≤15 字）、pain（解决的痛点）、description（≤50 字方案）、evidence（支撑证据，无则"待验证"）。JSON 数组返回。

### 评分维度管理

默认 6 维（对齐课件表格）：

| 侧 | 维度 | 定义 |
|---|---|---|
| 客户合意性 | 重要性 | 这个卖点对客户有多重要 |
|  | 独特性 | 竞品是否也在说/做 |
|  | 可信性 | 客户凭什么相信你能做到 |
| 企业可实施性 | 可行性 | 技术/供应链/成本能否实现 |
|  | 可传播性 | 能否一句话让客户听懂 |
|  | 可持续性 | 能否长期维持、不被复制 |

- 每个维度可改名、改定义、删除（每侧至少保留 1 个）。
- 可「＋ 添加维度」（如 B2B 加"合规性"、奢侈品加"工艺传承"）。
- 维度变化后，已有评分保留匹配的 key，不丢数据。

---

## ④ 合意性 × 可实施性评分与矩阵

核心步骤。客户合意性复用 Work 1 合成调研的 persona。

### 客户合意性评分

**模式 A：逐 persona 打 3 子分（Work 1 有合成调研数据时）**

- 把 Work 1 的每位 persona 作为评分主体。
- 对每个卖点，每位 persona 分别给重要性、独特性、可信性打 0–10 分。
- 调用方式：system role = persona 描述，user role = 卖点描述 + 3 个子问题。多卖点 × 多 persona 并行。
- 进度可视化："正在让 persona 3/5 评估卖点 4/10…"。
- 每个卖点的 3 个分数 = 所有 persona 的均值：
  ```
  importance = avg over personas
  uniqueness = avg over personas
  credibility = avg over personas
  desirability = (importance + uniqueness + credibility) / 3
  ```
- UI 可展开看每个 persona 的打分明细（Atelier 直角小表）。
- `desirabilitySource = "personas"`。

**模式 B：AI 直接打分（Work 1 无调研数据时回退）**

- 检测到 `context.hasSurveyData === false` 时，提示"Work 1 未完成合成调研，将由 AI 直接评分。[去 Work 1 跑调研]"。
- AI 一次性给所有卖点的 3 子分 + 依据。
- `desirabilitySource = "ai"`。用户可手改，改后变 `"user"`。

**手动模式**（无 API key）：为每个卖点生成提示词块，含全部 persona 描述 + 3 个评分要求，用户粘回解析。

**合意性默认提示词（模式 A，单 persona 单卖点）**：
> 你是{persona.name}，{persona.demographics}。你的痛点：{persona.painPoints}；你的需求：{persona.needs}。
> 产品"{SBU}"提出卖点："{卖点name}"——{卖点description}。证据：{evidence}。
> 请从你的视角分别给 0–10 分：
> 1. importance（这个卖点对你有多重要）
> 2. uniqueness（和竞品比有多独特）
> 3. credibility（你有多相信品牌能做到）
> 每项给一句话理由。JSON 返回 {importance, uniqueness, credibility, reasons:{}}。

### 企业可实施性评分

- AI 一键打分（双模式）：基于卖点描述 + evidence + SBU 资源，给可行性/可传播性/可持续性 3 子分。
- 不依赖 persona，是企业内部视角。
- AI 填的分数带 `AI` 角标，手改后角标消失。
- `implementabilitySource = "ai"`，手改后 `"user"`。

**可实施性提示词**：
> 你是企业运营顾问。业务"{SBU}"。对卖点"{name}"（{description}），从企业内部视角评 0–10：feasibility（技术/供应链/成本可行性）、communicability（一句话能否讲清）、sustainability（能否长期维持不被复制）。每项一句依据。JSON 返回。

### 评分锚点

每个维度有可编辑的三档锚点（同 Work 2 rubric）。AI 生成卖点时可一并生成初始锚点；没有锚点也能打分，但 UI 提示。

### 矩阵图

按 [README.md](README.md) 选型表：**F8 Plumb Scatter** 库外翻译（与 Work 2 矩阵同骨架）。

- X 轴：企业可实施性（0–10），Y 轴：客户合意性（0–10），均不断轴。
- 每个卖点一个圆点：selected = `HERO` 实心 r=7，未 selected = `DATA` 描边空心。
- 圆点旁标注卖点名（超长截断 + tooltip）。
- 切分线默认中位数，可改固定值；`MUT` 虚线 1px。
- 象限底色 `ATELIER.QUAD.*`：
  - 右上：**明星卖点**
  - 左上：**愿景卖点**（客户要但做不到）
  - 右下：**产能卖点**（做得到但客户不要）
  - 左下：**淘汰卖点**

合意性 vs 可实施性双评分明细，矩阵下方附 **F12 Dumbbell Queue**（每个卖点两颗珠，HERO 标入选主张）。

### 最优决策扇面（库外叠加于 F8）

以左下角 (0,0) 为圆心、沿 45° 对角线叠加扇环，筛出"既合意又可实施且两者平衡"的卖点。

**参数**（左栏控件）：

| 参数 | 默认 | 控件 | 含义 |
|---|---|---|---|
| 显示扇面 | 开 | 开关 | 关掉只看四象限 |
| 张角 θ | 90° | 滑块 30°–120° | 允许合意性:可实施性比值范围；越窄越要求平衡 |
| 内半径 r | 12（/20） | 滑块 8–16 | 总分阈值，排除双低 |

中心角永远 45°（对角线）。判定：卖点转极坐标 (ρ, φ)，入扇面当且仅当 `ρ ≥ r` 且 `|φ−45°| ≤ θ/2`。

**视觉**：扇面栗色 `HERO` opacity 0.08 填充；斜边 + 内弧 `HERO` 1px 虚线；象限底纹照常（扇面叠加不替代象限——象限诊断，扇面筛选）。

**自动筛选**：
- 扇面内卖点 `selected` 自动 true（实心）。
- 扇面外 false（空心）。
- 用户可点圆点手动切换 selected，手选点加描边；调整扇面参数时未被手动覆盖的点自动重筛。

### 排名表

矩阵下方，按"合意性 + 可实施性"降序：排名、卖点名、合意性、可实施性、象限、扇面内/外、selected 勾选框。

### 迁移路径分析（从各象限到第一象限/扇面）

扇面是目标区。对**扇面外**的每个卖点，AI 生成"如何进入扇面"的行动建议。扇面内（已入选）的卖点不分析。

按象限分类建议方向：

| 当前位置 | 瓶颈 | AI 建议方向 |
|---|---|---|
| 左上（愿景卖点）：合意高、可实施低 | 做不到 | 需要补什么能力/技术/资源/合作伙伴才能落地；或是否分阶段实现 |
| 右下（产能卖点）：可实施高、合意低 | 客户不要 | 如何重新定位/改写卖点表达/附加服务以提升客户价值；或是否应淘汰 |
| 左下（淘汰卖点）：双低 | 都不行 | 是否直接放弃，把资源转移到明星卖点；若要保留需要同时提升两维 |
| 扇面外但贴近边界 | 略失衡 | 具体该提升哪个维度、提升多少分能进入扇面（给出目标分数） |

**交互**：
- 矩阵下方一个「生成迁移路径」按钮（双模式）。
- AI 输出为卡片列表，每个扇面外卖点一张卡片：
  - 卖点名 + 当前坐标（合意 X.X / 可实施 Y.Y）+ 所在象限
  - 瓶颈诊断（一句话）
  - 2–3 条具体行动建议
  - 若是"差一点就进扇面"，标出"可实施性 +1.2 即可进入"这种量化目标
- 手动模式：提示词 + 粘贴区。
- 建议文本可编辑，随 `state.work3` 保存。

**数据字段**：
```js
migration: {
  prompt: "",
  analyses: [
    { candidateId, diagnosis, actions: [], targetScores: {desirability, implementability} }
  ]
}
```

**默认提示词**：
> 你是品牌战略顾问。以下卖点在"客户合意性 × 企业可实施性"矩阵中位于扇面（目标区）之外。请为每个卖点诊断瓶颈并给出 2–3 条进入扇面的具体行动建议。
>
> 扇面标准：合意性 + 可实施性 ≥ {r}，且两者比值在允许范围内（张角 {angle}°）。
> 卖点列表（含当前分数和象限）：
> {candidates JSON}
>
> 对左上（愿景）卖点，重点说明需补什么能力；对右下（产能）卖点，重点说明如何提升客户价值或重定位；对左下卖点，判断该放弃还是补救。若某卖点距扇面边界很近，给出需要提升的具体分数。用 JSON 数组返回：candidateId、diagnosis、actions（字符串数组）、targetScores。

---

## ⑤ 价值主张、定位与品牌人格

### 最终入选卖点

`selected=true` 的卖点自动同步到这里，卡片展示，可拖拽排序（决定主辅）。

### 价值主张（双模式 AI）

「让 AI 生成价值主张」：
- 输入：SBU + 目标市场 + 入选卖点 + Work 1 persona。
- 输出：3 个差异化价值主张（20–40 字），追加到 `alternatives`。
- 用户选用、编辑、重新生成。

**默认提示词**：
> 你是品牌战略顾问。为"{SBU}"在"{目标市场}"提炼 3 个差异化价值主张。入选卖点：{coreValues}；目标客户：{personas}。每个 20–40 字，说清"为谁、提供什么、有何不同"。JSON 数组返回 [{id, text}]。

### 定位陈述（模板填空）

套用任务清单模板：

> **{品牌}** 是为 **{目标客群}** 提供 **{核心价值}** 的 **{品类}**。

- 四个空：品牌名（从 Work 1 SBU）、目标客群（Work 1 persona 下拉/自由填）、核心价值（入选卖点多选）、品类。
- 实时预览完整句子。
- 示例（课件原文）：比亚迪海狮05EV 是为追求潮流、年轻时尚的中等收入人群提供外观时尚、纯电续航里程长的高性价比纯电动汽车。
- 定位陈述写入全局摘要 + Work 5 STP。

### 品牌人格

- MBTI 类型输入（自由填或 AI 推荐）。
- 人格特质关键词标签（可增删）。
- 「让 AI 推荐品牌人格」：基于价值主张 + 目标客群，给一个 MBTI + 3–5 个特质。

### Slogan（双模式 AI）

「让 AI 生成 slogan」：
- 输入：品牌名 + 价值主张 + 目标客群。
- 输出：5 个 slogan（中文 12 字内含情感驱动词，移植课件提示词）。
- 用户选一个或编辑。

**默认提示词**：
> 作为"{SBU}"的品牌顾问，创作 5 个 Slogan。中文 12 字内，含情感驱动词，体现"{价值主张}"。JSON 数组返回。

### 不做的

- **不做 logo 设计 / 视觉识别系统 / 色彩规范**——第 ⑥ 步砍掉。这部分交给设计师或图片生成工具，本工具只输出文字方向（品牌人格 + slogan）。用户后续可拿这两个输入去 Midjourney/设计师。

---

## 与其他 Work 的数据接口

| 方向 | 数据 |
|---|---|
| ← Work 1 | SBU、persona（用于合意性打分）、价值体系、合成调研开放题与主题（卖点挖掘输入）、调研是否完成（决定打分模式） |
| ← Work 2 | 选定目标市场名 + 理由 |
| → Work 4 | 入选卖点、定位陈述、品牌人格、slogan（4P 围绕它展开） |
| → Work 5 | 目标市场、竞争分析、价值主张、定位陈述、品牌人格（策划书 STP 章） |
