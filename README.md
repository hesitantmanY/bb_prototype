# Global Brand Building and Marketing Communication

一个面向"品牌国际化战略"课程的完整工具：5 个工作坊串联 SBU → 目标市场 → 价值主张 → 营销组合 → 策划书，含 LLM 合成调研、Delphi 专家权重、LDA 主题建模、最优决策扇面等方法。

## 架构

- **前端**：`docs/global-brand-building.html` + 5 个 `workshopN.js` 模块，全部纯原生 JS。
- **后端**（必需）：`server/` 下的 FastAPI，端口 `8765`。负责：
  - **配置与数据持久化**：API 配置存 `server/config.yaml`，API Key 存 `server/.env`（均已 git-ignore）；工作内容存 `server/data/default/current.json`。
  - **LLM 请求代理**：所有 AI 调用经后端转发，API Key 不会到达浏览器。
  - **版本回溯**：每次保存自动建快照（保留最近 30 个），支持手动命名存档与一键恢复。
  - LDA 主题建模（jieba + gensim）和 Excel/CSV 解析。
- **AI**：后端代理到 LLM（DeepSeek / OpenAI / Gemini / 任何 OpenAI 兼容端点）。无 Key 时所有 AI 步骤自动降级为"复制提示词 → 粘贴结果"的手动模式。

## 运行

### 1. 启动 Python 后端（必需）

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
- **演示模式**：「查看演示」注入一个完整的中国茶品牌东南亚扩张案例（山木茶事），可随意点改但**不保存**；再次点击退出，回到你自己的数据。

配置文件 `config.yaml`、`.env` 与数据目录 `data/` 均已在 `.gitignore` 中，不会被提交。

## 目录

```
docs/
  global-brand-building.html           # 主页面
  workshop1.js ... workshop5.js        # 各工作坊模块
  demo-data.js                         # 演示样例
  specs/                               # 设计规格
server/
  app.py                               # FastAPI 入口（配置/数据/快照/LLM 代理/LDA/Excel）
  config.py                            # config.yaml + .env 读写
  llm_proxy.py                         # LLM 请求代理
  storage.py                           # 状态持久化与快照
  lda.py                               # LDA 8 步流程
  excel_parser.py                      # 八爪鱼/问卷星表格解析
  .env.example                         # API Key 模板
  requirements.txt
```

## 降级策略

- 未配置 API Key → 所有"用 AI 生成"按钮变成"复制提示词 + 粘贴解析"手动模式。
- Work 1 没跑合成调研 → Work 3 合意性评分自动回退到 AI 直接打分（无逐 persona 子分）。
