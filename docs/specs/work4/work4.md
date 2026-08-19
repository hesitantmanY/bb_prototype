# Work 4 — 营销组合（4P）

> 4 个子模块（4P），每个一个子 tab。涉及 AI 的步骤统一支持双模式（API 调用 / 手动粘贴）。
> 流程：① 产品/技术/服务 → ② 定价/价格体系 → ③ 渠道治理 → ④ 传播促销/客户关系
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

  // ① 产品 / 技术 / 服务
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

  // ② 定价 / 价格体系
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

  // ③ 销售渠道治理
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

  // ④ 传播促销 / 客户关系
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

## ① 产品 / 技术 / 服务

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

## ② 定价 / 价格体系

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

**竞争对手价格**：文本区，学员粘贴竞品价格数据。

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

## ③ 销售渠道治理

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

## ④ 传播促销 / 客户关系

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

## 4P 汇总视图

4P 完成后，子 tab 栏右侧有一个「4P 汇总」按钮（或第 5 个 tab），展示：

- 四个 P 的核心结论卡片（从各 P 的 `aiResult` + 关键字段自动拼接）。
- 检查清单：
  - 产品卖点是否支撑价值主张？
  - 定价是否匹配目标客群？
  - 渠道是否覆盖目标客群聚集的地方？
  - 传播信息是否一致？
- 一键同步到 Work 5 策划书第 4 章。
- 一键复制 4P 摘要文本（供 PPT/汇报使用）。
