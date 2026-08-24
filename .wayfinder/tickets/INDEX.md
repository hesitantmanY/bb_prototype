# Tickets index

> Each ticket lives in its own file. This index is a reading order / dependency view.

## Status

| ID | Title | Type | Status | Blocks (i.e. blocked-by) |
|----|-------|------|--------|--------------------------|
| T01 | extractJson 容错回退 | task | **closed** | — |
| T02 | response_format 改 provider/model 白名单 | task | **closed** | T07 |
| T03 | Gemini 代理路径补 system 角色 + JSON mode | task | **closed** | T02 |
| T04 | askPersona schema 改纯英文 + 答错回退 | task | **closed** | T01, T07 |
| T05 | Delphi 第二轮 prompt 修复 + 加本专家 r1 锚点 | task | **closed** | T01 |
| T06 | 后端 LlmRequest 校验 | task | **closed** | — |
| T07 | AI 输出体检：schema 校验 + 自动重试 1 次 | task | **closed** | T01 |
| T08 | 案例库元数据 schema 设计 | grilling | **closed** | — |
| T09 | 山木茶事扩展到工作坊 5 步全字段 | task | **closed** | T08, T01, T02, T03, T04, T05, T06, T07 |
| T10 | MIT LICENSE + README 徽章 + 教学化叙事禁词落地 | task | **closed** | T08, T09 |

## Frontier (open + unblocked + unclaimed)

按 wayfinder 规则，**未声明的 open ticket = unclaimed**。当前无人 claim。

可领取 ticket（T01 关闭后）：

- **T04** askPersona schema 改纯英文 + 答错回退（之前被 T01 阻塞，现在解锁）
- **T05** Delphi 第二轮 prompt 修复 + 加本专家 r1 锚点（之前被 T01 阻塞，现在解锁）
- **T06** 后端 LlmRequest 校验（始终在 frontier）
- **T07** AI 输出体检：schema 校验 + 自动重试 1 次（之前被 T01 阻塞，现在解锁）
- **T08** 案例库元数据 schema 设计（grilling 类型，先 design 再写代码）

## Wave plan（建议领取顺序）

不是必须，但按"小步快走 + 并行安全"原则排：

- **Wave 1**：[done] T01（已关）、[done] T08（已关）
- **Wave 2**：[done] T02 / T03 / T04 / T05 / T06 / T07 / T09 / T10 已全关
- **所有 ticket 关闭。** wayfinder effort 完结。
- **Wave 4**：T09 等 T01–T07 + T08（最重的 task）
- **Wave 5**：T10 等 T08 + T09（收尾）

## Claim 规则

任何 session **claim** 一个 ticket = 在它的 frontmatter 里把 `status: open` 改成 `status: claimed` 并加上 `assignee:` 字段。其他 session 看到这个状态就跳过。

关闭 ticket = `status: closed` + 在文末追加 `## Resolution` 段记录结论，并在 `.wayfinder/map.md` 的 `## Decisions so far` 追加一行（`[Title](tickets/Txx-...md) — 一句话 gist`）。
</content>
</invoke>