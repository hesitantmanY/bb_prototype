# Work 4 — 营销组合（4P）

> 5 个步骤（路径 + 4P），每个一个子 tab。涉及 AI 的步骤统一支持双模式（API 调用 / 手动粘贴）。
> 流程：路径（出海路径与进入模式）→ 产品/技术/服务 → 定价/价格体系 → 渠道治理 → 传播促销/客户关系
> 设计系统、API 引擎、数据模型见 [README.md](README.md)。
> 上游：Work 1（SBU）、Work 2（目标市场）、Work 3（价值主张、定位、品牌个性）。
> 下游：Work 5（策划书第 4 章营销组合）。

---

## 数据结构

`state.work4` 完整 schema：

```js
{
  context: {
    sbuName: "",           // 从 work1.sbu 带入
    targetMarket: "",      // 从 work2 带入选定市场
    valueProposition: "",  // 从 work3.proposition.chosenValueText 带入
    positioning: "",       // 从 work3.proposition.positioningStatement 带入
    slogan: ""             // 从 work3.identity.chosenSlogan 带入
  },

  // 路径（出海路径与进入模式）
  route: {
    scope: "",             // 出海 global / 本阶段聚焦国内 domestic
    oemType: "",           // OEM | ODM | OBM | EMS
    entryMode: "",         // export | licensing | franchise | contract-mfg | jv | acquisition | greenfield
    light: [],             // 出海姿态：single-point | borrow-boat | philosophy
    politicalPower: ""     // 政企关系 / 合规要点（仅 jv / acquisition / greenfield）
  },

  // 产品 / 技术 / 服务
  product: {
    name: "",              // 产品/产品线名称
    description: "",       // 产品概述
    skus: [
      { id, name, specs, price_range, differentiator }
    ],
    coreDifferentiators: [], // 核心差异化（标签数组，可从 Work 3 入选卖点带入）
    physicalFeatures: "",  // 物理特性/技术参数
    serviceOffering: "",   // 服务内容（售后、质保、安装等）
    technologyMoat: "",    // 技术壁垒/专利
    prompt: "",
    aiResult: ""           // AI 提炼的产品卖点文案
  },

  // 定价 / 价格体系
  price: {
    strategy: "",          // cost-plus | value | competitive | penetration | skimming
    strategyNote: "",      // 选择该策略的理由
    tiers: [
      // 价格梯度
      { id, name, targetSegment, price, unit, notes }
    ],
    channelPricing: [
      // 渠道差异化定价
      { id, channel, priceAdjustment, rationale }
    ],
    promotions: [
      // 促销期价格
      { id, occasion, discount, period }
    ],
    competitorPrices: "",  // 竞争对手价格（文本/粘贴）
    prompt: "",
    aiResult: ""
  },

  // 销售渠道治理
  place: {
    online: {
      selfOperated: [],    // 自营渠道（官网、独立站、App）
      thirdParty: [],      // 第三方平台（Amazon/TikTok Shop/本地平台）
      notes: ""
    },
    offline: {
      directStores: [],    // 直营店
      distributors: [],    // 经销商/代理商
      retail: [],          // 商超/KA
      notes: ""
    },
    keyPartners: [],       // 关键中间商/合作伙伴
    channelIncentives: "", // 渠道激励机制
    structure: [
      // 渠道树（两层）：[{name, type, children:[{name, share}]}]
      // share 为该渠道销售额占比（0–100），用于 F13 treemap / G7 tree
    ],
    prompt: "",
    aiResult: ""
  },

  // 传播促销 / 客户关系
  promotion: {
    advertising: [
      // 广告投放
      { id, media, budgetShare, message, kpi }
    ],
    pr: [
      // 公关活动
      { id, event, timing, expectedReach }
    ],
    salesPromotion: [
      // 销售促进（折扣、赠品、捆绑）
      { id, tactic, mechanic, period }
    ],
    crm: {
      tool: "",            // CRM 工具
      membership: "",      // 会员体系
      repurchaseIncentive: "", // 复购激励
      notes: ""
    },
    contentStrategy: "",   // 内容营销策略
    prompt: "",
    aiResult: ""
  }
}
```

---

## 通用交互

### 上游接入

进入 Work 4 时顶部显示一条只读上下文条：
```
SBU：xxx   目标市场：xxx   价值主张：xxx   定位：xxx   Slogan：xxx
```
从 Work 1/2/3 自动带入。任一为空时显示"— 未填写"，点击跳转对应 Work。不允许在 Work 4 修改上游数据。

### 4P 结构统一

每个 P 一个子 tab，内部布局统一：

1. **上下文提示**：这个 P 要解决什么问题（一句话，等宽字体）。
2. **表单区**：结构化字段（输入框、标签、可增删列表）。
3. **AI 助手**：双模式按钮 + 提示词 + 结果区。
4. **输出**：本 P 的结论文本，自动同步到 Work 5 策划书。

### 表单组件

- 可增删列表统一用 Atelier 直角行：每行末尾一个 `×` 删除，底部一个 `＋ 添加`。
- 标签数组用"输入回车添加"模式，每个标签右侧 × 删除。
- 价格、占比等数字字段用等宽字体，右对齐。

---

## 路径（出海路径与进入模式）

判断业务在微笑曲线上的位置、用什么模式进入市场、以什么姿态起步——路径决定控制权：OEM 几乎没有品牌和定价权，OBM 要自己承担渠道和传播。先想清楚再填 4P。

### 字段

- **市场范围**：出海 / 跨国经营，或本阶段聚焦国内市场。选国内时隐藏全部跨文化调适字段，4P 按常规营销组合填写。
- **业务在微笑曲线上的位置**：OEM 代工生产 / ODM 设计+制造 / OBM 自有品牌 / EMS 代工服务。
- **进入模式**：直接出口（最低控制）/ 授权许可 / 特许加盟 / 合同制造 / 合资 / 并购 / 绿地自建（最重但完全控制）。
- **出海姿态（可多选）**：单点突破 / 借船出海 / 长期主义。
- **政企关系**（仅合资 / 并购 / 绿地）：记录政府关系、准入许可、合规要点。

---

## 产品 / 技术 / 服务

### 字段

- **产品名称、产品线概述**
- **SKU 列表**：SKU 名、规格、价格区间、差异化点
- **核心差异化**：标签数组。进入时一键从 Work 3 入选卖点带入，可增删
- **物理特性/技术参数**：多行文本
- **服务内容**：售后、质保、安装、培训等
- **技术壁垒**：专利、独家工艺、供应链优势

### AI 助手（双模式）

「让 AI 提炼产品卖点」按钮：
- 输入：SBU + 产品描述 + SKU + 核心差异化 + 目标市场 + 价值主张。
- 输出：三段式文案——
  1. 功能卖点（3–5 条，对应物理特性）
  2. 情感卖点（2–3 条，对应品牌个性）
  3. 服务承诺（1–2 条）
- 填入 `aiResult`，可编辑，直接同步到 Work 5。
- 手动模式：提示词 + 粘贴区。

**默认提示词**：
> 你是一位产品营销专家。基于以下信息，为"{SBU}"在"{目标市场}"提炼产品卖点：
> 产品：{name}，{description}
> 核心差异化：{differentiators}
> 价值主张：{valueProposition}
> 请分三段输出：功能卖点（3–5 条）、情感卖点（2–3 条）、服务承诺（1–2 条）。每条不超过 30 字。用 Markdown。

---

## 定价 / 价格体系

### 字段

**定价策略**（单选，带说明）：
- 成本加成（cost-plus）
- 价值定价（value）
- 竞争定价（competitive）
- 渗透定价（penetration）
- 撇脂定价（skimming）

选完后在下方显示该策略的适用场景（等宽字体小字），并要求填"选择理由"。

**价格梯度**（可增删）：
- 档位名（如"基础款/标准款/高端款"）
- 目标客群
- 价格（数字 + 币种 + 单位）
- 备注

**渠道差异化定价**（可增删）：
- 渠道、价格调整（如"比官网低 10%"）、理由

**促销期价格**（可增删）：
- 场合、折扣力度、时间段

**竞争对手价格**：文本区，使用者粘贴竞品价格数据。

### 可视化

- 价格梯度用 **F5 Tick Rows**（basics-gallery）横向展示各档位价格，HERO 标主力款。
- 若填了竞品价格，AI 解析后叠加为参考线（可选，成本高就只做文本）。

### AI 助手（双模式）

「让 AI 给出定价建议」按钮：
- 输入：SBU + 产品 + 定价策略 + 竞品价格 + 目标市场 + 价值主张。
- 输出：
  1. 推荐价格区间（基于价值主张和竞品）
  2. 各档位建议定价
  3. 渠道差异化建议
  4. 促销节奏（节假日/新品期）
- 填入 `aiResult`，可编辑。
- 手动模式：提示词 + 粘贴区。

**默认提示词**：
> 你是一位定价策略顾问。业务"{SBU}"面向"{目标市场}"，采用{strategy}策略。竞品价格：{competitorPrices}。价值主张：{valueProposition}。请给出：1) 推荐价格区间及理由；2) 各档位建议定价；3) 渠道差异化建议；4) 促销节奏。用 Markdown。

---

## 销售渠道治理

### 字段

**线上渠道**：
- 自营：标签数组（官网、独立站、App、微信小程序…）
- 第三方平台：标签数组（Amazon、TikTok Shop、Shopee、Lazada、本地平台…）
- 备注

**线下渠道**：
- 直营店、经销商/代理商、商超/KA（各为标签数组）
- 备注

**关键中间商/合作伙伴**：文本列表。

**渠道激励机制**：多行文本（返点、培训、市场基金、独家区域…）。

**渠道结构树**（用于可视化）：
两层结构，每个一级渠道（线上/线下）下挂二级渠道，每个二级渠道有销售额占比 `share`（0–100，同一级下总和 100）。用户可在表单里编辑，也可由 AI 根据上述标签生成初始树。

### 可视化

- **G7 Tree LR**（glance-gallery）：展示渠道层级结构（一级 → 二级）。
- **F13 Nested Treemap**（basics-gallery）：展示渠道销售占比，area = share，color 按一级渠道（CAT3）。
- 两个图都放在表单下方，作为本 P 的"图版"。

### AI 助手（双模式）

「让 AI 生成渠道策略」按钮：
- 输入：SBU + 目标市场 + 产品 + 价值主张 + 价格档位。
- 输出：
  1. 推荐渠道组合（线上/线下比例）
  2. 各渠道优先级和进入顺序
  3. 关键合作伙伴类型
  4. 渠道激励建议
  5. 渠道结构树初始值（JSON：`[{name, children:[{name, share}]}]`，share 总和 100）
- 文本部分填入 `aiResult`，结构树部分填入 `structure`（用户确认后）。
- 手动模式：提示词 + 粘贴区。

**默认提示词**：
> 你是一位渠道策略专家。业务"{SBU}"进入"{目标市场}"，产品{description}，价格区间{tiers}。请给出：1) 推荐渠道组合及线上/线下比例；2) 各渠道优先级和进入顺序；3) 关键合作伙伴类型；4) 渠道激励建议。用 Markdown。最后附上渠道结构 JSON：[{"name":"线上","children":[{"name":"...","share":40}]},{"name":"线下","children":[...]}]，一级 share 总和 100。

---

## 传播促销 / 客户关系

### 字段

**广告投放**（可增删）：
- 媒体类型（搜索/社交/展示/电视/户外/…）
- 预算占比（0–100，所有项总和 100）
- 核心信息
- KPI

**公关活动**（可增删）：
- 事件名、时间、预期触达

**销售促进**（可增删）：
- 手段（折扣/赠品/捆绑/限时…）、机制、时间段

**CRM**：
- CRM 工具、会员体系、复购激励、备注

**内容策略**：多行文本（KOL/KOC、UGC、品牌故事节奏）。

### 可视化

- 广告媒体预算分配用 **L14 Hundred Field**（lupi-gallery）：100 个点，每点 = 1% 预算，按媒体分桶。
- 若预算数据完整，也可用 F13 Nested Treemap（媒体 → 子渠道）。

### AI 助手（双模式）

「让 AI 生成传播方案」按钮：
- 输入：SBU + 目标市场 + 价值主张 + 品牌个性/MBTI + slogan + 渠道组合 + 预算总盘（可选）。
- 输出：
  1. 传播主题（一句话）
  2. 媒体组合建议（含预算占比）
  3. 内容节奏（上市期/成长期/成熟期）
  4. 2–3 个公关事件创意
  5. 销售促进机制建议
  6. CRM 和复购激励建议
- 填入 `aiResult`，可编辑。广告投放表可由 AI 输出一键填入。
- 手动模式：提示词 + 粘贴区。

**默认提示词**：
> 你是一位整合营销传播专家。"{SBU}"进入"{目标市场}"，价值主张"{valueProposition}"，品牌人格{mbti}，slogan"{slogan}"，渠道{channels}。请给出：1) 传播主题；2) 媒体组合及预算占比；3) 内容节奏（上市/成长/成熟期）；4) 2–3 个公关事件创意；5) 销售促进机制；6) CRM 与复购激励。用 Markdown。媒体组合部分用 JSON 数组：[{media, share, message, kpi}]，share 总和 100。

---

## 跨工作坊闭环 CTA（2026-08-27 grilling 共识）

末步 `promotion`（2026-09-01：summary 步已删除，汇总由 Work5 承担）的 mvo
全过后，step 末显示「V. 策划书 →」，点击进下一工作坊首步。统一实现 `UI.nextWorkCta`
（global-brand-building.html）；规则同 work1 step8，work5 终点不加。

---

## 步级 AI 起草（2026-09-01，取代段落采纳流 / 一键 4P）

### 每步一个按钮

4P 每步顶部唯一一个「AI 起草{内容}」主按钮（head row 与上下文折叠保留）：

- 该步无内容 → `AI 起草{产品卖点/定价建议/渠道策略/传播方案}`，直接生成
- 该步已有内容 → `重新生成{内容}`，先弹「整体替换」确认（workshop123 式）

### 一次调用双写

单次 LLM 调用，prompt 由 `Work4.buildStepPrompt(pKey)` 统一构建（`STEP_FIELD_SPEC`
一处维护字段清单 / guide / 条件裁剪——跨文化字段仅出海、7P 扩展仅服务/混合业务）：

- **字段 JSON 对象**（末尾一个 ```json 块，键名 = 字段 key）→ `Work4.applyStepAll`
  容错解析后**整组覆盖**该步表单字段（未含的 key 不动；tags/text/table/crm/enum/
  structure 六类清洗，表格复用 `parseStructured` 容错链）
- **叙事正文**（## 标题 + 散文/列表/Markdown 表格）→ 剥掉 JSON 块后存 `aiResult`，
  自动全部采纳，段落区只读展示（JSON 永不外露；含 ```fence 的历史段落折叠为提示行）

成功 toast「已生成并填入 N/M 个字段，请逐项审改」；解析失败不动字段 + 显式 toast reason，
正文仍存入段落区。

### 表单是唯一真相源

`summaryText` 字段优先（已采纳段落拼接分支删除），price 摘要补跨文化 3 字段；
用户改表单 → 导出 / Work5 直接反映。

### mvo

4 个 P 的「采纳了至少 1 个 AI 起草段落」检查删除（内容检查即闸门，不强制用 AI）；
summary 步与其 mvo 一并删除，promotion 变末步。

### 截断抢救

fence 未闭合但对象完整（max_tokens 切掉结尾 ```）→ 括号平衡扫描救回；对象中途被截断
（顶层缺 `}`）显式失败 + 保留原字段，交用户重新生成。

### 图与表数据流通

- `Work4.simpleTable` 的 oninput 触发对应 step 的 `Work4.refreshCharts(stepId)`，**只重画 SVG 不重渲染整步**（避免输入框失焦）。
- channel tree / 嵌套 treemap / hundred field 渲染函数都从 `state.work4.{P}.{field}` 重读数据，refreshCharts 调用即可。
- place 的 `structure` 默认种子保留（不破坏老用户），但首次进 place 步时显示一行「已为你填入示例渠道结构，请按实际修改或点上方 AI 起草重抽」；`structure` 也纳入步级生成。
