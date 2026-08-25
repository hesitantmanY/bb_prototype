# 中小企业市场分析与品牌布局

一个面向"中小企业老板"的市场分析与品牌布局工具：5 个工作坊串联 SBU → 目标市场 → 价值主张 → 营销组合 → 策划书，含 LLM 合成调研、Delphi 专家权重、LDA 主题建模、最优决策扇面等方法。

## 架构

- **前端**：`docs/global-brand-building.html` + 5 个 `workshopN.js` 模块，全部纯原生 JS。
- **后端**：`server/` 下的 FastAPI，端口 `8765`。负责：
  - **配置与数据持久化**：API 配置存 `server/config.yaml`，API Key 存 `server/.env`（均已 git-ignore）；工作内容存 `server/data/default/current.json`。
  - **LLM 请求代理**：所有 AI 调用经后端转发，API Key 不会到达浏览器。
  - **版本回溯**：每次保存自动建快照（保留最近 30 个），支持手动命名存档与一键恢复。
  - LDA 主题建模（jieba + gensim）和 Excel/CSV 解析。
  - 文档解析（`doc_extract.py`）：txt/md/csv 直接读、docx 用标准库解、pdf 用 pypdf。给"资料文件"抽屉用。
- **AI**：后端代理到 LLM（DeepSeek / OpenAI / Gemini / 任何 OpenAI 兼容端点）。无 Key 时所有 AI 步骤自动降级为"复制提示词 → 粘贴结果"的手动模式。

## 运行

### 1. 启动 Python 后端

```bash
cd server
python -m venv .venv
.venv\Scripts\activate        # Windows
# source .venv/bin/activate   # macOS/Linux
pip install -r requirements.txt
python app.py
```

后端健康检查：<http://localhost:8765/api/health>

### 2. 打开工具

访问 <http://localhost:8765/>（HTML 与 JS 均由 FastAPI 提供）。后端未启动时页面会显示启动指引。

### 3. 配置 LLM

打开页面右上角「API 设定」：选择提供商、Base URL、Model、API Key。建议 DeepSeek：

- Base URL：`https://api.deepseek.com`
- Model：`deepseek-chat`
- 温度：`1.0`

配置保存到项目 `server/config.yaml` 与 `server/.env`。也可手动复制 `server/.env.example` 为 `.env` 后编辑。

## 工作坊

| # | 名称 | 核心方法 |
|---|---|---|
| I | 业务价值体系 | PEST、客户画像、合成调研（AI-Human Hybrids, JM 2025）、Likert/开放题分析、Sheth 价值框架 |
| II | 目标市场选择 | 指标体系、5 位合成专家两轮 Delphi、加权评分、吸引力 × 竞争力矩阵 |
| III | 价值主张与定位 | LDA 主题建模（本地 Python）、痛点地图、备选卖点、合意性 × 可实施性矩阵、最优决策扇面、迁移路径、定位句、MBTI 人格、slogan |
| IV | 营销组合 | 4P 表单与 AI 起草、渠道结构树、媒介预算百点图 |
| V | 策划书 | 从 Work 1–4 一键汇总、PEST/SWOT/STP/4P/4C 章节、打印 PDF、导出 Markdown |

## 数据、版本与导入导出

- **自动保存**：输入停顿约 1 秒后自动保存到服务器；切换标签/步骤、关闭页面前会立即同步。关页面再打开，内容还在。
- **历史记录**：右上角「历史记录」可查看自动版本（保留最近 30 个）与手动命名存档，任意版本可一键恢复（恢复前会自动备份当前内容）。
- **导入 / 导出**：「导出 MD」生成可阅读的 Markdown，文件末尾嵌入了完整数据；「导入 .md」可从该文件恢复。导入、重置前都会自动存档，均可在历史记录中回退。
- **资料文件**：顶栏「资料文件」可上传 docx / xlsx / pdf / txt / md / csv（单文件 ≤5MB，合计 ≤30k tokens）。所有 LLM 调用会自动把上传文件内容拼进 prompt，作为生成时的参考上下文；文件仅存在本会话内存，刷新页面会清空。**PDF 解析需要 `pypdf`**（已在 `server/requirements.txt`，`pip install -r requirements.txt` 会装上）。
- **演示模式**：「查看演示」注入一个完整的中国茶品牌东南亚扩张案例（山木茶事），可随意点改但**不保存**；再次点击退出，回到你自己的数据。演示模式下每个步骤顶部会显示三行批注：在分析什么 / 写时考虑 / 常见错误。

## 写作辅助（每个步骤都有）

- **AI 标记**：AI 自动生成的区块会显示一个小的 "AI" 标签，用户编辑任一字段后自动转为"已确认"样式（描边），提醒哪些内容仍需人工核对。
- **本步最小可交付**：每步顶部一张可勾选清单，告诉你这步至少要交什么。
- **健康检查（右侧拉出）**：从右边缘拉出，列出当前步骤的具体待补 / 提醒项（如 PEST 缺维度、测评点缺量化口径、卖点没绑痛点等）。规则在 `docs/lib/quality_rules.js` 增删，可读说明在 `docs/teacher/quality-rules.md`。

配置文件 `config.yaml`、`.env` 与数据目录 `data/` 均已在 `.gitignore` 中，不会被提交。

## 目录

```
docs/
  global-brand-building.html           # 主页面
  workshop1.js ... workshop5.js        # 各工作坊模块
  demo-data.js                         # 演示样例
  lib/
    ai_provenance.js                   # AI 来源标记 + "AI" 徽章
    file_context.js                    # 上传文件池，注入 LLM 上下文
    quality_rules.js                   # 右侧健康检查规则
    demo_notes.js                      # 演示模式下的三行批注
  teacher/
    quality-rules.md                   # 健康检查规则的可读说明
  specs/                               # 设计规格
server/
  app.py                               # FastAPI 入口（配置/数据/快照/LLM 代理/LDA/Excel/文档解析）
  config.py                            # config.yaml + .env 读写
  llm_proxy.py                         # LLM 请求代理
  storage.py                           # 状态持久化与快照
  lda.py                               # LDA 8 步流程
  excel_parser.py                      # 八爪鱼/问卷星表格解析
  doc_extract.py                       # docx/pdf/txt/md/csv 文本提取
  .env.example                         # API Key 模板
  requirements.txt
```

## 降级策略

- 未配置 API Key → 所有"用 AI 生成"按钮变成"复制提示词 + 粘贴解析"手动模式。
- Work 1 没跑合成调研 → Work 3 合意性评分自动回退到 AI 直接打分（无逐 persona 子分）。
