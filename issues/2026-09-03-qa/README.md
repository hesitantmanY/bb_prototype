# QA 审计 2026-09-03 — 本地 issue 清单

来源:一次三向只读审计(安全 / 业务流程 / AI 管线),每条均经读码核实或已标"读码可证"。合并了同根因条目(B01 含 W3/W5 两症状;AI01 含 NaN share;AI05 含 enum 失配)。

## 高

| 编号 | 标题 |
| --- | --- |
| [SEC01](SEC01-api-no-auth-cors.md) | 本地服务零鉴权 + CORS 全开:任意网页可劫持 API Key、读改删档案 |
| [SEC02](SEC02-llm-profile-ssrf.md) | /api/llm 的 profile 参数无约束 → 开放 SSRF 代理 |
| [AI01](AI01-table-clean-empty-overwrite.md) | work4 步级回填:空数组静默清空已有广告/渠道/PR/促销数据 |
| [BIZ01](BIZ01-matrix-shallow-copy-write.md) | 卖点矩阵写浅拷贝:入选与评审分不落库,界面与状态机矛盾 |

## 中

| 编号 | 标题 |
| --- | --- |
| [SEC03](SEC03-upload-decompression-bomb.md) | docx/xlsx 只查上传字节,解压放大可打爆内存 |
| [SEC04](SEC04-work1-smilecurve-svg-xss.md) | work1 微笑曲线 SVG 不转义(work4/矩阵图已盖,此处漏) |
| [SEC05](SEC05-lda-state-no-limits.md) | LDA 参数与 /api/state 无体量上限 |
| [BIZ02](BIZ02-isDemo-dead-gate.md) | isDemo 永假:演示批注永不显示;案例进 W5 被静默改写章节 |
| [BIZ03](BIZ03-multitab-autosave-clobber.md) | 双标签页 autosave 静默覆盖另一页签的版本恢复 |
| [BIZ04](BIZ04-delphi-abort-drop-completed.md) | Delphi persona 中止丢已完成分值,续跑变重跑 |
| [BIZ05](BIZ05-work1-clear-analysis-stale.md) | W1 清空回答后 analysis 统计/实测分不失效 |
| [AI02](AI02-ai-provenance-dead.md) | AI 溯源链全死:aiScope 13 处传参无处消费 |
| [AI03](AI03-calljson-schema-never-wired.md) | CallJsonStrict schema 校验/重试从未启用 |
| [AI04](AI04-skip-unit-kills-pipeline.md) | 降级手动箱「跳过此单元」= 整条流水线静默终止 |
| [AI05](AI05-work4-warnings-swallowed.md) | work4 步级回填 warnings/失败字段不进 toast |
| [AI06](AI06-tiers-hero-inconsistent.md) | tiers hero 三条解析路径口径不一,非主力标成主力 |

## 低

| 编号 | 标题 |
| --- | --- |
| [SEC06](SEC06-config-yaml-raw-write.md) | config.yaml 裸 f-string 写入可注入破坏 |
| [SEC07](SEC07-snapshot-name-unvalidated.md) | 版本名无长度/字符校验 |
| [BIZ06](BIZ06-polish-only-ch1.md) | 「AI 润色全文」只润第 1 章 |
| [BIZ07](BIZ07-export-double-h1.md) | 导出 Markdown 出现两个一级标题 |
| [BIZ08](BIZ08-sendbeacon-missing.md) | README 声称关页 sendBeacon 同步,实际不存在 |
| [AI07](AI07-likert-30-dropped.md) | likert 把 "3.0" 字符串丢弃,与文件头文档矛盾 |
| [AI08](AI08-manual-truncated-json-deadend.md) | 手动模式截断 JSON 无出路,「作为文本填入」被门控掉 |

## 附注(非 issue,维护债)

- `docs/lib/quality_rules.js`(30+ 条规则)生产环境从未加载,全库无消费者,疑似陈旧资产——删除或补挂二选一。
- 自愈仅覆盖 work2 整片毒数据(healWork2),work1/3/4 嵌套毒值无兜底;当前无已知写入者,属防御性缺口。
