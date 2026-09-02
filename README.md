# AI 驱动的品牌建设工作流

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

一个 AI 驱动的品牌建设平台：五个工作坊从界定 SBU 出发，依次完成目标市场选择、品牌价值主张提炼与营销组合规划，最终汇成一份完整的品牌策划书；方法上融合 LLM 合成调研、Delphi 专家权重、LDA 主题建模与最优决策扇面。

## 方法依据

Arora、Chakraborty 与 Nishimura 于 2025 年发表了《AI-Human Hybrids for Marketing Research: Leveraging Large Language Models (LLMs) as Collaborators》。该文与一家财富 500 强食品企业合作，用 GPT-4 复现了该公司 2019 年的定性深访与定量概念测试（n=605，以原始人类研究为基准），得到三个与本平台直接相关的结论。

其一，人机混合优于任何单边。定性侧，人类评估者认为 LLM 生成的回答在深度与洞察性两个维度分别高出约 0.68 与 0.50 分（五点量表）；LLM 担任分析师时主题召回率达 77% 至 96%，还能发现人类遗漏的新主题；专家评委评选最佳摘要时，没有任何一位选择纯人类或纯 LLM 的版本。其二，LLM 可以低成本扮演合成受访者、访谈主持与分析师：设定样本特征、生成 persona、按提纲追问（回答质量低于阈值自动追问）、把长文本提炼为主题与摘要。本平台的合成调研与 Delphi 专家面板正是这一用法。其三，定量侧零样本 LLM 能抓住答案方向与效价，但异质性与内部一致性不足，需要用 few-shot 与 RAG 注入上下文改善。

论文同样划清了边界：LLM 会出错、带偏见、会幻觉；问题定义与研究设计必须由人主导，最终洞察由人负责。因此本平台全程采用 AI 起草、人工复核采纳的模式，未配置 API Key 时所有 AI 步骤自动降级为复制提示词手动模式，流程不依赖 AI 也能完整走通。

论文全文：`docs/AI-Human Hybrids for Marketing Research Leveraging Large Language Models (LLMs) as Collaborators.pdf`

## 架构

- **前端**（`docs/`）：`global-brand-building.html` 单页 + 5 个 `workshopN.js` 工作坊模块 + `lib/` 下 21 个原生 JS 工具模块（AI 上下文、JSON 容错解析、状态持久化、版本快照、任务锁等）。无框架、无构建步骤，浏览器直接加载。
- **案例库**（`docs/cases/`）：5 个演示案例，源数据按 `<brand>/work1-5.js + index.js` 组织，`bundle.js` 由 `scripts/build-cases-bundle.js` 生成，`loader.js` 是运行时注册表。
- **后端**（`server/`）：FastAPI，默认 `127.0.0.1:8765`。端点：健康检查 `/api/health`、配置读写 `/api/config`、状态 `/api/state`、版本快照 `/api/snapshots`（增删/改名/恢复）、LLM 代理 `/api/llm`、LDA `/api/lda`、表格解析 `/api/parse-excel`、文档提取 `/api/extract-doc`；同时托管前端静态文件。
- **配置与数据**：API 配置存 `server/config.yaml`，API Key 存 `server/.env`（均已 git-ignore）；工作内容存 `server/data/<project>/current.json`，版本快照存同目录 `snapshots/`。
- **LLM 请求代理**：所有 AI 调用经后端转发，API Key 不会到达浏览器；`providers.js` 维护各提供商 JSON 模式白名单，Gemini 的非 OpenAI 请求体由 `gemini_body.py` 转换。
- **分析与解析**：LDA 主题建模（jieba + gensim，`lda.py`）、八爪鱼/问卷星表格解析（pandas + openpyxl，`excel_parser.py`）（未测试）、文档文本提取（`doc_extract.py`：txt/md/csv 直接读、docx 用标准库解、pdf 用 pypdf）。
- **测试**：`tests/` 下 50+ 个 Node 直跑测试（`node tests/<name>.test.js`），另含 `server/test_lda.py`；仓库根执行 `node scripts/run-tests.js` 可顺序跑全部测试并汇总退出码。
- **安全回归**：`server/test_security.py` + `tests/security_frontend.test.js` 覆盖 API Key 不外泄、`project_id`/快照路径穿越、上传大小上限、Markdown/SVG 转义。
- 整体架构图见 `docs/architecture.html`（可交互）。

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

打开页面右上角「API 设定」（齿轮）：选择提供商、Base URL、Model、API Key、温度（默认 `1.0`）。建议 DeepSeek：

- Base URL：`https://api.deepseek.com`
- Model：`deepseek-chat`

配置保存到项目 `server/config.yaml` 与 `server/.env`。也可手动复制 `server/.env.example` 为 `.env` 后编辑。顶栏可随时在「API 自动 / 手动模式」间切换（独立于是否配 Key）。

### 4. 一键跑测试

```bash
node scripts/run-tests.js
```

脚本会先按文件名顺序跑完 `tests/*.test.js`，再跑 `server/test_*.py`（使用 `server/.venv`）；任一失败都会继续跑完其余测试并在最后汇总，退出码非 0。后端依赖未安装时会明确提示而不是静默跳过。

## 工作坊

| # | 名称（步数） | 核心方法 |
|---|---|---|
| I | 业务价值体系（8 步） | SBU 界定（业务三问、边界声明）、PEST + 竞品 + 资源盘点、客户画像、指标体系（自评 vs 实测 Δ）、合成调研（AI-Human Hybrids, JM 2025）、Likert/开放题分析、Sheth 价值框架、建议 |
| II | 目标市场（3 步） | 4×2 指标模板、5 位合成专家两轮 Delphi、加权评分、吸引力 × 竞争力矩阵、三档决策 |
| III | 价值主张（6 步） | 场景细分、语料导入（xlsx/csv/txt）+ LDA 主题建模（本地 Python；语料 = 真实 + 画像模拟混合，依据 JM 2025）、痛点地图、备选卖点、合意性 × 可实施性矩阵、最优决策扇面、迁移路径、定位句、MBTI 人格、slogan |
| IV | 营销组合（5 步） | 渠道路径、4P 表单与步级 AI 起草（每步一按钮整组回填）、渠道结构树、媒介预算百点图 |
| V | 策划书（1 步） | 5 章国标编号文档（业务与市场 / 环境分析 / 市场选择与定位 / 营销组合 / 总结与展望）、SWOT 2×2 与 4C 一键 AI 生成、4P 摘要表 + 预算横条图、打印 / PDF、导出 Markdown |

## 数据、版本与导入导出

- **自动保存**：内容有改动时约每 2 分钟自动落盘；切换步骤/工作坊、刷新或关闭页面前会立即同步（sendBeacon）。关页面再打开，内容还在。
- **保存与版本**：顶栏「保存」弹出命名框，保存 = 持久化当前内容 + 建一个版本；留空则按时间命名。内容无变化不会新建版本。时间命名版本自动清理、只保留最近 10 个，手动命名版本永久保留。
- **历史记录**：右上角「历史记录」列出全部版本，可一键恢复（直接载入，不做额外备份）、重命名、删除。重置、导入 .md 前会自动建「重置前 / 导入前存档」版本，都可在历史记录中回退。
- **导入 / 导出**：「导出 MD」生成可阅读的 Markdown，文件末尾嵌入完整数据；文件名与首行标题由档案名决定（进入过某版本或案例时顶栏显示当前档案名，可用 ✎ 重命名；无档案名时回退 `brand-workshop.md`）。「导入 .md」解析该数据块并覆盖当前内容，API 配置不会被导入。
- **语料导入（Work III）**：卖点挖掘步可上传 xlsx / xls / csv / txt，经后端解析（`/api/parse-excel`）后进入 LDA 语料列表。
- **演示案例**：顶栏「演示案例」提供 5 个完整案例（豆芽妈妈、小镬记、问渠书院、恒锐造、毛孩子之家），覆盖母婴电商、餐饮、教培、B2B 制造、宠物服务等行业。进入即沙箱：进入前内容先存快照；看案例期间可编辑可保存（改动会存为版本），顶栏按钮变「退出案例」，点击丢弃案例数据、恢复进入前的工作区。演示模式下每个步骤顶部会显示三行批注：在分析什么 / 写时考虑 / 常见错误。

## 写作辅助

- **本步最小可交付（MVO）**：每步顶部一张可勾选清单，告诉你这步至少要交什么。全部通过后，步骤底部亮出「下一步 →」按钮（工作坊末步则是跳往下一工作坊的跨坊 CTA）；清单只控制按钮显隐，步骤导航始终可用。
- **AI 任务锁**：全局同一时刻至多一个 AI 任务，进行中时其他 AI 按钮锁定。按钮三态：生成中 → 已暂停（再次点击主体 = 中止）→ 回到初始；生成中另有 × 直接中止，进度按 LLM 调用次数计。


## 目录

```
docs/
  global-brand-building.html           # 主页面（顶栏 + 5 个工作坊 + 各弹层）
  workshop1.js ... workshop5.js        # 各工作坊模块（步骤、渲染、AI 调用）
  workshop5-editorial.css              # Work V 策划书排版样式
  tokens.css                           # 设计 token（色板 / 字号 / 间距 / 动效）
  architecture.html                    # 架构图（可交互）
  cases/                               # 案例库
    loader.js                          #   运行时注册表（Cases.list / load）
    bundle.js                          #   由 scripts/build-cases-bundle.js 生成，勿手改
    <brand>/work1-5.js + index.js      #   5 个案例源数据
    SCHEMA.md                          #   案例数据结构说明
  lib/
    ai_context.js                      # 全局 AI 上下文（分节 digest + 消息设置）
    ai_provenance.js                   # AI 来源标记 + "AI" 徽章
    call_json_strict.js                # 带错误反馈重试的严格 JSON 调用
    json_extract.js                    # LLM JSON 多层容错解析
    schema_check.js                    # AI 输出结构校验
    likert_parse.js                    # 李克特 1-5 容错解析
    providers.js                       # 提供商 JSON 模式白名单
    archive.js                         # 版本（快照）存取
    runner.js                          # AI 任务全局锁（三态按钮 / 进度）
    backend.js                         # 本地服务 HTTP 适配器
    store.js                           # 状态持久化（保存 / 加载）
    schema_migrate.js                  # 旧数据迁移注册表
    markdown_exchange.js               # 导出/导入 .md 纯逻辑
    matrix_chart.js                    # 散点矩阵 / 条形图 SVG 渲染
    ui.js                              # 步骤挂载契约 + 共享 UI 组件
    settings.js                        # API 设定弹层
    savepanel.js                       # 保存弹层
    history.js                         # 历史版本弹层
    demomenu.js                        # 案例选择菜单
    app.js                             # 应用编排（init / 导航 / 导出 / 案例切换）
    demo_notes.js                      # 演示模式下的三行批注
  specs/                               # 各工作坊设计规格（work1-5）
  charts/ fonts/ pics/                 # 静态资源（图示 / 字体 / 截图）
server/
  app.py                               # FastAPI 入口（全部 /api/* 端点 + 静态托管）
  config.py                            # config.yaml + .env 读写
  llm_proxy.py / llm_validate.py / gemini_body.py
                                       # LLM 代理（转发 / 请求校验 / Gemini 请求体转换）
  storage.py                           # 状态持久化与版本快照
  lda.py                               # LDA 主题建模（jieba + gensim）
  excel_parser.py                      # 八爪鱼/问卷星表格解析
  doc_extract.py                       # docx/pdf/txt/md/csv 文本提取
  .env.example                         # API Key 模板
  requirements.txt
scripts/
  build-cases-bundle.js                # 重新生成 docs/cases/bundle.js
  run-tests.js                         # 顺序跑全部 JS/Python 测试并汇总退出码
tests/                                 # Node 直跑测试（node tests/<name>.test.js）
```

## 降级策略

- 未配置 API Key 或切到「手动模式」→ 所有「用 AI 生成」按钮变成「复制提示词 → 粘贴解析」卡片，流程不依赖 AI 也能完整走通。
- Work I 没跑合成调研 → Work III 合意性评分自动回退到 AI 直接打分（无逐 persona 子分）；有调研数据则回填各 persona 均值。
- 本地服务未连接 → LDA 主题改由 LLM 模拟生成；Excel/CSV 语料导入不可用。
- LLM 输出坏 JSON → `json_extract.js` 多层容错抢救（Markdown 表 / 智能引号 / 裸换行 / 截断修复）；仍失败时 `call_json_strict.js` 携错误反馈自动重试一次。
- 载入旧版本或旧结构数据 → `schema_migrate.js` 迁移注册表 + 各工作坊自愈逻辑（heal）自动补齐缺省字段，不丢内容。
