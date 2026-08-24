# Global Brand Building and Marketing Communication — 总纲

> 输出物：`docs/global-brand-building.html` + `server/` 本地 Python 服务
> 视觉参考：Hallmark (usehallmark.com) Atelier 主题 — 见 `docs/pics/`
> 用途：供使用者为自己的业务完成 5 个工作坊的品牌建设流程

---

## 技术架构

```
┌─────────────────────────────────────────────┐
│  浏览器：global-brand-building.html          │
│  (Atelier UI + 图表 + 状态管理 + LLM API)   │
└──────────┬──────────────────────┬───────────┘
           │ fetch                │ fetch（直连，不经后端）
                                 
┌────────────────────┐   ┌──────────────────────┐
│ 本地 Python 服务    │   │ LLM API              │
│ FastAPI :8765      │   │ DeepSeek/OpenAI/     │
│                    │   │ Gemini/自定义         │
│ /api/lda           │   └──────────────────────┘
│ /api/parse-excel   │
│ /api/health        │
│ （预留扩展：词云、  │
│   情感分析、爬虫） │
└────────────────────┘
```

**分工**：
- **HTML 前端**：所有 UI、表单、矩阵、图表、LLM 合成调研（LLM API key 在浏览器里，直连 provider）。
- **Python 后端**：只承担浏览器做不好的计算密集/算法任务（LDA 中文分词建模、Excel 解析），未来按需扩展。
- **启动方式**：`cd server && pip install -r requirements.txt && uvicorn app:app --port 8765`，然后浏览器打开 HTML（或访问 `http://localhost:8765` 由后端托管 HTML）。
- **后端不可用时降级**：LDA 相关功能显示"本地服务未启动"，提供"用 LLM 模拟主题提取"回退；Excel 导入回退到 SheetJS CDN。

## 项目文件

```
docs/
  global-brand-building.html           ← 主工具（前端单文件）
  specs/
    README.md                          ← 本文件
    work1.md … work5.md                ← 各工作坊规格
  pics/                                ← Hallmark Atelier 参考截图
server/
  app.py                               ← FastAPI 入口
  lda.py                               ← jieba + gensim LDA
  excel.py                             ← openpyxl 解析
  requirements.txt                     ← fastapi, uvicorn, jieba, gensim, openpyxl, pandas
```

---

## 项目定位

- **性质**：本地运行的 HTML + Python 工具，数据全部存在浏览器 localStorage，不依赖云端。
- **使用者**：课程学员（小组为单位），用于为自己的真实业务做品牌国际化设计。
- **核心场景**：课上分工作坊练习 + 课下沿用同一份数据继续完成策划书。
- **不是**：课堂计时器、PPT 生成器。
- **气质**：不是 SaaS 后台，是一本可以填写的工作室手册（atelier workbook）。

## 导航层级

| 主导航 | 子导航 | 规格 |
|---|---|---|
| **Work 1** 业务单元价值体系 |  SBU 选题 /  环境分析 /  客户洞察 /  价值体系 /  合成调研 /  数据分析 /  改进建议与汇报 | [work1.md](work1.md) |
| **Work 2** 目标市场选择 |  SBU 与备选市场 /  德尔菲指标权重 /  评分测算 /  吸引力×竞争力矩阵 /  汇报 | [work2.md](work2.md) |
| **Work 3** 价值主张与定位 |  目标市场接入 /  卖点挖掘 /  备选卖点 /  合意性×可实施性矩阵+扇面 /  价值主张与定位 /  品牌个性与视觉 | [work3.md](work3.md) |
| **Work 4** 营销组合 |  产品 /  定价 /  渠道 /  传播促销 | [work4.md](work4.md) |
| **Work 5** 策划书 | 封面/摘要/1 企业概况/2 环境(PEST+SWOT)/3 STP/4 4P4C/5 展望/参考文献 | [work5.md](work5.md) |

> 5 个 Work 规格已全部完成。数据流：Work 1（SBU/画像/价值体系/合成调研）→ Work 2（目标市场）→ Work 3（价值主张/定位）→ Work 4（4P）→ Work 5（策划书汇总）。

---

## 设计系统（Hallmark Atelier）

### 视觉语言

参考图来自 hallmark.com 的 Atelier 主题，核心特征：

- **纸质暖底**：不是冷灰白，是未涂布纸的暖米色。
- **高对比 Didone 衬线标题**：Bodoni / Didot / Playfair Display 风格，极粗笔画 + 极细衬线，标题以句点结尾。
- **等宽 UI 字体**：所有标签、编号、元数据、按钮用等宽字体，全大写，字距拉开。
- **衬线斜体正文**：正文用衬线斜体。
- **零装饰**：无阴影、无渐变、无圆角、无 emoji。只用细线（hairline rule）分隔。
- **章节隐喻**：Plate I / 03 / 04 这样的编号 + 斜体数字。
- **CLI 气息**：顶部有 `/ hallmark v1.1` 这样的斜杠命令式标识。

### 配色

| 角色 | 色值 | 用途 |
|---|---|---|
| 背景 | `#F2EFE8` | 暖米色纸质底 |
| 面板底 | `#EDE9E0` | 略深于背景 |
| 主文字 | `#1A1A1A` | 近黑 |
| 次要文字 | `#8A8275` | 暖灰，标签、批注 |
| 边线 | `#D4CFC4` | hairline 1px |
| **栗色强调** | `#3A190F` | 深酒红 — 斜体标题、关键强调、链接 |
| 栗色浅底 | `#E8DFD8` | 选中态、高亮块 |
| 警示 | `#8B2500` | 错误、最低分 |
| 占位 | `#B5AFA2` | placeholder、未填写 |

内容区只用暖灰底 + 黑字 + 栗色强调。四象限矩阵用栗色/暖灰/中性灰区分，不引入蓝绿。

### 字体（中西文配对）

从 Google Fonts 加载，系统字体回退：

1. **大标题 / 章节标题**：Playfair Display 700/900 + Noto Serif SC 700/900
   - 回退 `Georgia, "Songti SC", "SimSun", serif`
2. **正文**：Lora 400 italic + Noto Serif SC 400
   - 回退 `Georgia, "Songti SC", "SimSun", serif`
3. **UI 标签、按钮、输入框、表格**：JetBrains Mono 400/500 + Noto Sans SC 400/500
   - 回退 `ui-monospace, "SF Mono", "Cascadia Code", "Microsoft YaHei", sans-serif`
   - 全大写，`letter-spacing: 0.15em`

加载策略：`<link rel="preconnect">` + `display=swap`，不阻塞渲染。

### 字号层级

- H1：48–64px，Playfair/Noto Serif 900
- H2：32–40px，Playfair/Noto Serif 700，带句点
- H3：20–24px，Playfair 700 italic
- 正文：16–17px，Lora/Noto Serif 400 italic
- 标签/元数据：11–12px，JetBrains Mono，大写，字距 0.15em
- 输入框：14px，JetBrains Mono / Noto Sans SC

### 装饰元素

- **Hairline 分隔**：1px solid `#D4CFC4`
- **章节编号**：`01 /` 或 `PLATE I`，等宽字体，次要文字色
- **黑色小方块** `` 作项目符号
- **Em-dash 引导线**：`— STUDIO NOTE`
- **巨型斜体字符**作 plate marker
- 所有元素**直角、无阴影、无圆角、无 emoji**（用 →  — / 文字符号）

---

## API 引擎（全局）

所有涉及 AI 的步骤都支持**双模式**：

- **API 自动模式**：配置 key 后一键调用 LLM，结果直接填入。
- **手动模式**：显示可复制的提示词 + 结果粘贴区，学员到外部 AI 工具操作后粘回。未配置 key 时强制此模式。

右上角 masthead 是一个**双段开关 `[ API 自动 | 手动模式 ]` + 齿轮 **：

- 点双段开关可在两种模式间随时切换（`state.settings.manualMode`，落盘持久化），即使已配 key 也能主动切到手动模式省 token。
- 未配置 key 时「API 自动」档置灰，强制停在手动档，hover 提示先配置 key。
- 齿轮  打开配置面板。运行 AI 任务期间开关与齿轮禁用。

### 配置面板（齿轮 ）

- Provider 下拉：**DeepSeek / ChatGPT / Gemini / 其他**（OpenAI 兼容）
- 选 provider 自动填入默认 baseUrl + model，可改：

| Provider | baseUrl | 默认 model |
|---|---|---|
| DeepSeek | `https://api.deepseek.com` | `deepseek-v4-flash` |
| ChatGPT | `https://api.openai.com/v1` | `gpt-5.6 Sol` |
| Gemini | `https://generativelanguage.googleapis.com/v1beta` | `gemini-3.5-flash` |
| 其他 | 用户自填 | 用户自填（假定 OpenAI 兼容） |

- API Key（password 类型，存服务端 config.yaml/.env，浏览器只持掩码）
- Temperature 滑块（0–2，默认 1.0）
- 「测试连接」按钮

### 调用逻辑

- DeepSeek / OpenAI / custom：OpenAI 兼容 `/chat/completions` 格式
- Gemini：走 `generateContent` REST 格式（单独封装）
- 所有流量经本地后端代理，API key 永不到达浏览器。
- 错误处理：401 / 429 / 网络错误分别给中文提示
- **安全**：API key 只存服务端 config.yaml/.env，永不写入项目文件、不随打印/导出泄露；导出的 state 对 key 做掩码。

### 运行控制：暂停 / 继续 / 中止（Runner）

全局单任务锁 `Runner`（同时只允许一个 AI 任务），给每个 AI 按钮统一的运行控件：

- **一次性按钮**（PEST、竞争、画像、指标、SWOT、4C、起名、润色等）：运行时按钮显示「生成中…」，右侧出现 **×**，点 × 用 `AbortController` 掐断当前 fetch（已花 token 的本次结果丢弃，不写入）。一次性请求不提供暂停。
- **长任务**（work1 合成调研、work2 德尔菲两轮、work3 逐 persona/卖点评分、work5 全文润色）：按**单元边界**暂停——work1 一个 (persona×重复) 为一单元，work2 四阶段（第一轮专家 / 主持人综合 / 第二轮专家 / 汇总），work3 每个评分单元，work5 每个章节。
  - 运行中按钮变 `暂停 · 42%`，点了在当前单元完成后暂停（变 `继续 · 5/12`），右侧 × 中止。
  - 后端非流式，一次 HTTP 请求进行中无法真暂停；暂停发生在单元之间。
  - 已完成单元的结果与完成键（如 `survey._doneKeys`、delphi `phase`）写入 state 并 autosave，**跨刷新/跨步骤保留**。再次点运行自动跳过已完成单元，断点续跑、不重复花 token。
  - × 中止：abort 当前请求，已完成单元结果保留，状态置为 `paused`，按钮显示「继续」。
- 手动模式下没有后台进程，不显示暂停/中止键。

---

## 本地 Python 服务接口

FastAPI 跑在 `http://localhost:8765`。前端在启动时 ping `/api/health`，连通则启用 LDA/Excel 高级功能；未连通则降级。

### `GET /api/health`
返回 `{ status: "ok", version: "x.y" }`。前端启动时探测。

### `POST /api/lda`
真跑 LDA 主题建模，复现课件 8 步流程。

请求：
```json
{
  "documents": ["文本1", "文本2", "..."],
  "k": 5,
  "passes": 15,
  "iterations": 100,
  "no_below": 2,
  "no_above": 0.5,
  "language": "zh"
}
```

响应：
```json
{
  "stats": {
    "raw_count": 72,
    "valid_count": 44,
    "total_words": 981,
    "vocab_size": 120,
    "coherence": 0.3699
  },
  "topics": [
    {
      "id": 1,
      "label": "游园体验与设施",
      "share": 25.2,
      "keywords": [
        {"word": "温泉", "weight": 0.082},
        {"word": "设施", "weight": 0.054}
      ],
      "representative_docs": ["原文片段1", "原文片段2"]
    }
  ],
  "word_freq_top": [
    {"word": "温泉", "count": 41}
  ]
}
```

实现：jieba 中文分词 → 去停用词（内置中文停用词表 + 用户可追加）→ gensim 建词典/语料 → LdaModel → CoherenceModel（c_v）。`label` 字段初为空，由前端调 LLM 补主题名（或让 LLM 基于关键词生成）。

### `POST /api/parse-excel`
解析八爪鱼/问卷星导出的 `.xlsx/.xls/.csv`。

请求：`multipart/form-data`，字段 `file`。

响应：
```json
{
  "sheet_names": ["Sheet1"],
  "columns": ["评论内容", "评分", "时间"],
  "rows": [
    {"评论内容": "...", "评分": 5, "时间": "2026-01-02"}
  ],
  "row_count": 200,
  "suggested_text_column": "评论内容"
}
```

实现：pandas + openpyxl。自动识别正文列（列名含"内容/评论/正文/comment/content/review"）。

### 降级策略

后端未启动时：
- `/api/lda` 按钮显示"本地服务未启动"，旁边给「用 LLM 模拟主题提取」回退按钮（走 LLM API，质量可接受但不是真 LDA）。
- `/api/parse-excel` 降级为前端 SheetJS（从 CDN 动态加载）。
- 页脚显示 ` 本地服务未连接` 栗色小字。

---

## 数据模型（localStorage）

统一 key：`gbw_atelier_v1`

```js
{
  meta: { savedAt, isDemo: false, demoSnapshot: null },
  settings: {
    api: { provider, apiKey, baseUrl, model, temperature },
    autoSave: true
  },
  work1: { /* 详见 work1.md */ },
  work2: {},
  work3: {},
  work4: {},
  work5: {}
}
```

自动写入 localStorage（不强制手动保存）。

---

## 全局交互

### 顶部 Masthead

- 斜杠命令式标识 `/ global-brand-workshop v0.1`
- 全局摘要条：`SBU:xxx · 目标市场:xxx · 价值主张:xxx`（只读回显，点击跳转对应工作坊）
- 操作按钮：打印/PDF · 保存 · 重置 · 查看演示 · API 设定
- 空字段显示"— 未填写"

### 三个核心按钮

- **打印 / 导出 PDF**：`window.print()`，打印样式隐藏导航与操作按钮
- **保存**：`localStorage.setItem`，toast 提示
- **重置**：`confirm()` 后清空并刷新

### "查看演示"按钮

- 默认关闭，开启时注入原皂液器示例数据
- 顶部加批注提示当前为演示数据
- 关闭时恢复到切换前的快照

### 键盘快捷键

- `Ctrl/Cmd + 1~5`：切换工作坊
- `Ctrl/Cmd + P`：打印

---

## 图表实现（lieflat-charts × Atelier）

所有数据图表统一通过 **[lieflat-charts](https://github.com/larashero3-dotcom/lieflat-charts) skill** 生成。该 skill 已安装在 `~/.claude/skills/lieflat-charts/`，提供 49 张模板（Lupi 编辑叙事 / Lupi Basics 基础 / Glance 快读 / Interactive 大图），输出单文件 HTML，纯 SVG 可离线，ECharts/Chart.js 图需联网。

### 边界：图版 vs. 页面外壳

Atelier 页面外壳（masthead、tabs、表单、表格）仍走 Atelier 设计系统——直角、Playfair/Lora/JetBrains Mono、无圆角无阴影。**图表作为插入手册的「图版（Plate）」**，图版内部沿用 lieflat 的视觉语法：24px 圆角卡、Inter 字体、胶囊柱端、reveal 动画。这是有意的视觉边界（图版 = 独立作品），不是违反 Atelier 规范。两者用下面的 Atelier custom 色板缝合。

### Atelier custom 色板（单一色系，全局锁定）

按 lieflat SKILL 第六点五节规则建立 custom，只覆盖颜色；字体、圆角、动画参数仍以 `mono-tokens.js` 为准。所有成品 HTML 内联此对象，所有图从角色取色，**禁止借用 porcelain/palm/wire 色值**，也不回写 skill 源文件。

```js
// Atelier × lieflat — custom palette
// 单色系：栗色 #3A190F 沿明度梯编码序数；HERO 给一个主角。
const ATELIER = {
  name: 'atelier',
  logic: 'ordinal',
  // ── 底 / 字 / 线 ──
  BG:    '#F2EFE8', // 暖米纸质底（同 Atelier 背景）
  TXT:   '#1A1A1A', // 近黑主文字
  MUT:   '#6B6458', // 图内次级文字、轴标签（#8A8275 在 #F2EFE8 上对比度仅 3.3:1，图内 9.5px 标签需 4.5:1，故加深；页面外壳批注可保留 #8A8275）
  FAINT: '#A8A194', // 来源行、辅助刻度
  GRID:  '#D4CFC4', // hairline 网格（同 Atelier 边线）
  PANEL: '#EDE9E0', // 卡内面板底
  // ── 数据色 ──
  DATA:  '#3A190F', // 栗色：主数据
  DATA2: '#8D7971', // 次级数据
  HERO:  '#3A190F', // 视线落点（选中市场、最高柱、关键结论）
  WARN:  '#8B2500', // 警示色，仅用于「不良」象限与错误态
  // ── 序数明度梯（浅→深，低→高）──────────────────────────
  // 由 #3A190F 与 #F2EFE8 在 15/35/55/75/100% 插值得到
  RAMP:  ['#D6CFC7', '#B2A49C', '#8D7971', '#684F45', '#3A190F'],
  // ── 无序类目（单色相，≤3 类才用彩色；>3 退回灰阶）──────
  CAT3:  ['#3A190F', '#684F45', '#B2A49C'],
  // ── 象限底色（仅 Work 2 / Work 3 矩阵背景，非数据系列）──
  QUAD: {
    great:      'rgba(58,25,15,.08)',  // 优质：栗色淡底
    emerging:   'rgba(138,130,117,.10)', // 新兴：暖灰淡底
    mature:     'rgba(180,175,165,.12)', // 成熟：中性灰淡底
    bad:        'rgba(139,37,0,.08)',    // 不良：警示淡底
  },
  // ── 暗卡（lieflat 大图需要时，Atelier 不用暗卡）────────
  DARK: null,
};
```

**对比度自查（已通过）**：TXT/BG = 15.4:1；DATA/BG = 13.1:1；MUT/BG = 4.7:1。

### 工作流（每张图必走）

1. 按数据形状在下表锁定图型编号；先 Lupi Editorial → Lupi Basics → Glance（Glance 仅用于 dashboard/监控/三秒快读，并写明降级理由）。
2. 打开 `~/.claude/skills/lieflat-charts/templates/<gallery>.html`，按卡内标题找到 `<div class="card">` 与 `<script>` 里同名 `// ════` 注释块，以其为骨架。
3. 替换数据、标题（写结论不写图型名）、副标题（图例·时间范围）、来源行。
4. 把 mono-tokens.js 全文内联，再把上面的 ATELIER 对象挂到 `window.ATELIER`，渲染代码里的颜色引用从 `MONO.INK/L` 改为从 `ATELIER` 取；字体、圆角、动画不动。
5. 走 SKILL.md 第八节 14 条自检清单；`node --check` 过语法。
6. 嵌入主 HTML 时，用 `<section class="plate">…</section>` 包裹，外部加等宽小标签 `PLATE N · {图型名}`（呼应 Atelier 的 Plate 编号隐喻）。

### 各 Work 图表选型表

| Work | 数据形状 | 首选模板 | 编号 | gallery | 备注 |
|---|---|---|---|---|---|
|   | 李克特 5 点分布（N 位受访者，1 点 = 1 人） | Hundred Field | **L14** | lupi-gallery | 单位分解，副标题写「one dot = one respondent」；N>60 降级 F1 |
|   | 单选各选项占比（≤6 项，加总 100%） | Hundred Field | **L14** | lupi-gallery | 同上，按选项分桶 |
|   | 开放题主题（主题 + 频次 + 代表原话） | Type Colonnade | **L12** | lupi-gallery | 每个主题下列原文，不丢明细；频次用 RAMP 明度编码 |
|   | 多指标均分对比（4–8 个二级指标，中文长名） | Tick Rows | **F5** | basics-gallery | 横条，中文标签不截断；HERO 标最高分 |
|   | 指标 × 问题均分热力（小矩阵 ≤100 格） | Arc Matrix | **L4** | lupi-gallery | 行=指标，列=题，明度=均分 |
|   | 吸引力 × 竞争力散点（≤15 市场，带象限切分线） | Plumb Scatter | **F8** | basics-gallery | **库外翻译**：F8 为骨架，叠加 xCut/yCut 虚线与 QUAD 象限底色；选中市场 = HERO 实心 r=7，其余 = 描边空心。见下方「库外图型」 |
|   | 一级指标权重（100% 构成，≤6 项） | Hundred Field | **L14** | lupi-gallery | 或 F5 Tick Rows（权重排序场景） |
|   | 指标 × 市场评分热力 | Dot Heat | **F10** | basics-gallery | 周×小时模板平移到指标×市场 |
|   | 市场综合总分排名（横向排序） | Tick Rows | **F5** | basics-gallery | HERO 标选中市场 |
|  — | 客户合意性 × 企业可实施性矩阵 | Plumb Scatter | **F8** | basics-gallery | 同 Work 2 矩阵翻译；卖点替代市场点；**叠加最优决策扇面（库外，见下）** |
|  — | 备选卖点合意性 / 可实施性双评分对比 | Dumbbell Queue | **F12** | basics-gallery | 每个卖点两颗珠，HERO 标入选主张 |
|   | 渠道层级结构（2–3 层） | Tree LR | **G7** | glance-gallery | Glance 合理：层级图本就靠形读 |
|   | 营销预算分配（渠道→子渠道，两层权重） | Nested Treemap | **F13** | basics-gallery | 走 F13 硬规则，area=预算，color=一级渠道（CAT3） |
|   | 媒体投放比例（100%，≤6 项） | Hundred Field | **L14** | lupi-gallery | 单序列构成首选 Lupi |
|  5 | SWOT 四象限文字格 | —（库外） | — | — | **不使用 lieflat**：SWOT 是文字网格而非数据编码，直接用 Atelier 直角 2×2 hairline 网格，四象限底色沿用 QUAD 变量 |

### 库外图型规则

Work 2 / Work 3 的「吸引力 × 竞争力」矩阵是库外图型（F8 Plumb Scatter 不带象限切分）。按 SKILL 第六节翻译流程处理：

1. **本体**：X/Y 位置编码两个独立评分（0–10）；点的空心/实心编码是否选中；象限底色是战略分区，不编码数据；切分线是中位数决策阈值，不是坐标轴。
2. **最近亲戚**：F8 Plumb Scatter（basics-gallery.html），继承其坐标系、点几何、入场动画。
3. **token 造句**：所有颜色从 `ATELIER` 取——网格 `GRID`，轴文字 `MUT`，点描边 `DATA`，选中点填充 `HERO`，象限底色 `ATELIER.QUAD.*`，切分线 `MUT` 虚线 1px（`stroke-dasharray:4 3`）。
4. **过 hard rules**：柱/点不断轴（X/Y 均 0–10，完整画出）；标签装不下用 hover 出；选中点 HERO 唯一；演示数据用 `MONO.rnd(i,k)` 不用 `Math.random()`。

**Work 3 最优决策扇面（库外叠加）**：在 F8 矩阵上以左下角 (0,0) 为圆心、沿 45° 对角线叠加一个扇环（栗色 `HERO` opacity 0.08 填充，斜边与内弧 `HERO` 1px 虚线）。扇面是决策筛选区，不替代象限底色——象限是诊断，扇面是筛选。几何参数：中心角 45°（不可改）、张角 θ（默认 90°，滑块 30°–120°）、内半径 r（默认总分 12/20，滑块 8–16）。落扇面内的卖点自动 `selected=true`。

### 不做的图

- **饼图**：按 SKILL 第七节拒绝，100% 构成一律走 L14 / G4 Dot Waffle。
- **3D / 阴影 / 渐变 / 玻璃拟态**：拒绝，即使 Atelier 外壳也不引入。
- **雷达图**：如 Work 3 价值主张多维度对照需要，按 SKILL 用 ECharts 原生雷达 + ATELIER token 换肤，不重写。
- **Choropleth 地图 / 轨迹图**：库内无地理管线，不做；目标市场选择用矩阵+排名表替代。

### 资源位置

- skill 根目录：`~/.claude/skills/lieflat-charts/`
- 图型目录：`catalog.md`（49 张索引）
- 渲染骨架：`templates/lupi-gallery.html`、`templates/basics-gallery.html`、`templates/glance-gallery.html`、`templates/big-*.html`
- 设计 token：`mono-tokens.js`（字体/圆角/动画正本）、`color-presets.js`（三套内置预设，仅参考，Atelier 交付不使用）
- 校验脚本：`scripts/validate.mjs`

---

## 文件结构

输出物：单文件 `docs/global-brand-building.html`

```html
<head>
  <meta>...
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display...&family=Lora...&family=JetBrains+Mono...&family=Noto+Serif+SC...&family=Noto+Sans+SC..." rel="stylesheet">
  <style>...</style>
</head>
<body>
  <header class="masthead">...</header>
  <nav class="main-tabs">...</nav>
  <main>
    <section data-workshop="1">...</section>
    ...
  </main>
  <footer class="colophon">...</footer>
  <script>...</script>
</body>
```

---

## 验收标准

- [ ] Chrome / Edge / Safari 最新版无 console error
- [ ] 单文件可断网打开（除 Google Fonts 外不依赖网络；API 调用需网络）
- [ ] API 配置支持 DeepSeek / ChatGPT / Gemini / 自定义，Gemini 走独立格式
- [ ] 未配置 key 时所有 AI 步骤自动降级为提示词 + 粘贴区
- [ ] 合成调研可运行、显示进度、可中止、校验失败重试
- [ ] 数据自动写入 localStorage
- [ ] 打印样式隐藏交互元素与 API key
- [ ] 颜色仅使用规定色板
- [ ] 字体为 Playfair Display / Lora / JetBrains Mono + Noto Serif SC / Noto Sans SC（含系统回退）
- [ ] 全程无 emoji
