# AGENTS.md

## Work3 卖点挖掘（语料双来源 + 混合建模）

改动或评审 `docs/workshop3.js` 的语料/建模逻辑（`runLDA`、`collectDocs`、`painPrompt`、`simulatedDocuments`、「生成模拟语料」按钮、语料构成标注）或评分判分逻辑（MVO/`ensureDesirabilityAggregates`/`computeMatrix`）前，先核对 [CONTEXT.md](CONTEXT.md) 的 Work3 术语：真实 + 模拟混合建模、构成可见、样本补足、真实 ≥3 条可建模、模拟默认参与且可勾选退出、模拟语料默认包含负面反馈（`includeNegative`）；评分 MVO 判分基于维度分或 persona 子分，聚合值不回写。文献依据 JM 2025（Arora, Chakraborty & Nishimura）：人机混合优于纯人类/纯 LLM；全文见 `docs/AI-Human Hybrids for Marketing Research Leveraging Large Language Models (LLMs) as Collaborators.pdf`。

## Schema 迁移 / mergeWithDefaults

改 `mergeWithDefaults`、任何 migrate 函数、或给工作坊数据加新字段前，遵循：迁移必须幂等、必须随加载落盘、migrate 函数里禁止 showToast；新默认字段优先做嵌套合并而不是只靠 migrate。

## server/lda.py 或任何模型返回

改 `server/lda.py`、`server/app.py` 的 JSON 端点、或任何把 gensim/numpy 输出返回给前端的地方：numpy.float32 会炸 Pydantic 序列化，输出前必须转原生类型并用 `json.dumps` 自检（回归测试在 `server/test_lda.py`）。

## AI 起草按钮的重新生成语义

所有「AI 起草…」「用 AI 起名」「让 AI 生成…」「一键生成…」「用 AI 起草建议/综合洞察/价值框架」类按钮必须遵循：已生成 → 按钮文案变「重新生成…」，点击**直接覆盖**上一次结果（不追加、不 confirm、不静默空转）；未生成 → 原文案。流水线类按钮（双维评分、评估体系、人格与 Slogan、主张与定位）点击重新生成时需清断点整组重跑。
