# Map — global-brand-building

> Single source of truth for "做完整"这一轮 effort。Local tracker（无外接 issue tracker）。
> 每个 ticket 是 `.wayfinder/tickets/T<NN>-<slug>.md` 一个文件，frontmatter 存状态和阻塞边。

## Destination

让这套"品牌国际化战略"工具在企业同学手里**按按钮不灵异、AI 输出稳定可解释**，并把现有演示案例扩到工作坊 5 步全字段——使其从"能跑的工具"升级到"可以直接照着做完整 5 步工作坊"的可分发资产，以 MIT 协议开源。

具体说，等这张图清空时满足：
1. 任意 AI 按钮点击后，**前端有明确 loading 状态**、失败有重试入口；不会"按了没反应"或"按了但什么都没填"；
2. 同一份 SBU + 市场输入跑两遍，**输出结构一致**（同一 provider 下的字段命名、值域、缺失字段处理）；
3. **provider 适配层**把 OpenAI 兼容 / Gemini / 至少一个国产端点（DeepSeek 已选）作为一等公民切换，切换不需要改业务代码；
4. **AI 输出体检**——每条 LLM 返回都过 schema 校验、失败自动重试 1 次，仍失败才 fallback 到手动模式；
5. 山木茶事案例扩到工作坊 5 步全字段，可在「查看演示」一键注入完整流程。

## Notes

- **Skills to consult when working tickets**: `using-superpowers`（任何 ticket 开始前）；`grilling` / `domain-modeling`（charting / 边界决策时）；`prototype`（UI 行为类 ticket 的"先做最便宜能看的东西"时）；`code-review`（接近收尾时）。**不**自动启用 `simplify`、不改 docs/demo-data.js 之外的现有产品代码以外的代码。
- **"完整"的语义**：本 effort 不指"测试覆盖率 100%"或"全 i18n"——见 Out of scope。
- **不做的事**：不动 README 之外的产品文案、不动 demo-data 之外的演示数据；不引入新框架（保持 FastAPI + 原生 JS）。
- **教学化叙事禁词**：在 ticket / demo data / 用户可见文案里，**不出现**"纯教学案例""AI 生成""演示用"等暗示数据非真实的标签。山木茶事作为案例呈现时，跟"真实品牌"无叙事差异。
- **MIT**：仓库加 `LICENSE` (MIT)、README 顶部加许可证徽章。这件事在 T09 阶段一并做。

## Decisions so far

<!-- Each line: title — one-line gist. Body lives in the ticket. -->

- [extractJson 容错回退](tickets/T01-extractJson-tolerant.md) — 抽出 5 阶段 fallback 链到 `docs/lib/json_extract.js`，25 个 fixture 全过；`API.lastExtractError` 暴露失败原因给 T07 用。
- [案例库元数据 schema 设计](tickets/T08-case-library-metadata-schema.md) — 一品牌一文件夹（`docs/cases/<brand>/{work1..5.js, index.js}`）+ UMD loader（`Cases.list/has/load`）；demo-data.js 删除迁移；UI「查看演示」改「载入案例」。山木茶事骨架就位，**T09 填字段**。
- [AI 输出体检：schema 校验 + 自动重试 1 次](tickets/T07-ai-output-schema-validation.md) — JSON-schema-lite DSL（6 type + 4 modifier），`CallJsonStrict.run` retry 钩子；3 个高风险站（askPersona / indicators / nameTopics）已迁。**累计 76 测试全过**。
- [askPersona schema 改纯英文 + 答错回退](tickets/T04-askPersona-schema-and-value-tolerance.md) — `LikertParse.parseValue` 4 类失败原因 + `a.dropped` 计数 + analysis 顶部 warning banner。**累计 117 测试全过**。
- [Delphi 第二轮 prompt 修复](tickets/T05-delphi-r2-anchor-and-fix.md) — r2 prompt 补"本专家 r1 锚点"（之前是 host + 别人 r1，自己 r1 缺失导致复读）；注释说明 prompt 设计意图。**117 测试仍全过**。
- [后端 LlmRequest 校验](tickets/T06-backend-llm-request-validation.md) — 纯 Python 校验（role 白名单 / content ≤32k / 总长 ≤200k / temperature 0-2 / 1-64 messages），`/api/llm` 失败 422。**累计 18 Python 自检 + 117 Node 测试全过**。
- [response_format 改 provider/model 白名单](tickets/T02-response-format-whitelist.md) — 7 个 provider 注册（openai/deepseek/qwen/gemini/zhipu/moonshot/doubao），`Providers.getMode()` 决定是否下 `response_format`；Gemini 翻译留 T03。**累计 141 测试全过**。
- [Gemini 代理路径补 system 角色 + JSON mode](tickets/T03-gemini-system-role-and-json.md) — `system_instruction` 提取、`role:'model'` 翻译、`responseMimeType` 下发；`build_gemini_body` 抽到 `gemini_body.py` 纯逻辑可单测。**累计 168 测试全过**。
- [山木茶事扩展到工作坊 5 步全字段](tickets/T09-shanmu-tea-5-step.md) — 5 画像/3 场景/5×3 CBBE/12 题调研/15 响应/完整 Delphi 两轮/20 文档 LDA/5 SKU/完整 5 章策划书。**累计 207 测试全过**。
- [MIT LICENSE + 教学化叙事禁词落地](tickets/T10-mit-license-and-case-rename.md) — MIT LICENSE + README 徽章 + provider 适配层表 + 工作坊表格加"案例数据"列；3 处用户可见文案清扫。**wayfinder effort 完结**。

## Not yet specified

<!-- Fog: in scope, but question not yet sharp enough to ticket. -->

- **企业同学拿到工具后第一周最容易卡在哪**——决定 T10（用户手册）的内容范围。当前没有用户反馈样本。
- **"AI 输出不对"如何回流成 prompt 改进**——是否需要 prompt 版本管理（每个工作坊步骤记录 prompt vN、对应模型、对应输出）。这块属于"输出体检"沉淀之后才看得清的事，先不进 ticket。
- **provider 适配层的"模型白名单"具体名单**——OpenAI / DeepSeek / Qwen / Gemini / 智谱 GLM / 豆包，先支持前 4 个 + 至少一个国产的具体边界，剩下边做边定。

## Out of scope

<!-- Scope boundary. Closed tickets here. -->

- **i18n / 英文版 UI**——本 effort 不做。理由：当前用户群（你 + 企业同学）中文。
- **多用户系统 / 权限 / 协同编辑**——开源后各人本地跑，不做 SaaS 化。理由：F2 决策。
- **加新案例（茶饮 SaaS / 出海制造业 / 消费品等虚构案例）**——本 effort 不做，案例库只扩展山木茶事本身。理由：F2 决策"案例库的形态 b"。
- **部署形态变更（GitHub Pages / Next.js / Docker）**——保持 FastAPI 起静态 + API。理由：F2 决策。
- **可观测性（Sentry / 结构化日志 / 性能 trace）**——不做。理由：F2 决策"4 暂时不管"。
- **E2E 测试 / CI 流水线**——不做。理由：F2 决策"4 暂时不管"。
- **用户手册（场景化教程）**——不做。理由：F2 决策"4 暂时不管"。
- **演示模式按模块注入**——不做。理由：F2 决策"4 暂时不管"。

## Open tickets (frontier lives in `tickets/`)

总览见 `tickets/` 目录 + 通过 `blocks` 字段计算出来的 frontier。
</content>
</invoke>