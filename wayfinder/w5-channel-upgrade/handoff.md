# 实现交接提示词（给 codex，2026-09-07）

下面整段复制给 codex 即可。规格唯一来源 = 本目录 map.md + tickets/00-06 的 ## Resolution；本文件只是入口提示词，与票冲突时以票为准。

---

仓库：品牌策划工作坊平台（原生 JS 模块，无框架，docs/ 下按 workshopN.js 组织）。当前分支 main，工作区有未提交的决策文档与案例数据改动，先通读再动手，不要回滚它们。

任务：把 wayfinder/w5-channel-upgrade/ 地图上的全部已锁决策实现掉。开工前按顺序读三样东西：

1. wayfinder/w5-channel-upgrade/map.md — 决策索引与已锁 Notes 1-10
2. 同目录 tickets/00 至 06 每张票的 "## Resolution" — 权威决策，票号即实现顺序
3. CONTEXT.md — 全部术语（尤其 Work4 的 步级 AI 起草/表单即真相源、Work5 的 证据块/进入即同步，与新增的 关键伙伴 side/销售占比/媒介预算占比）

实现范围概要（细节一律以票为准，本概要与票冲突时以票为准）：

- Work4 数据模型：place.keyPartners 从 string[] 升级为 [{name, side}]，side 枚举 线上/线下/''（未分类）。
- Work4 编辑 UI：keyPartners 专用 chip 变体渲染器（字段 kind 'partners'），复用 Work1 业务三问现成的 sbu-seg/sbu-segmented 双键段控样式——chip 内嵌“线上 | 线下”两键，未分类 = 两键都不亮，点亮的键再点一次取消；手动新增默认未分类；7 个 tags 字段共享的通用 Work4.tagBox 一个字都不许动。
- Work4 AI 起草：place 步 guide 改对象数组描述；json_extract.js 新增 schemaKey 'partnerList'，宽进策略——字符串项升格 {name, side:null}、side 缺失/非法归 null、JSON 全挂退顿号/换行切分、单项缺 name 丢弃但不毁整组；解析层不做关键词启发式（启发式只属于迁移，一条代码路径一种职责）。
- Work4 迁移：Work4.migrations 注册表（workshop4.js:1467 现成契约）加一个迁移——载入时发现 string[] 形状 keyPartners 就升格 [{name, side:''}] 并按票 04 词表（substring 匹配）预填 side，未命中留 ''。
- Work4 杂项：summaryText('place') 补上 localChannelRelations（现在漏了，导出会丢）；渠道结构表下方 ≠100 合计 callout（只提示不阻断，样式对齐现有 callout 家规）；AI schema 约束 structure 一级固定 线上/线下 顺序（Work5 树图按位置 structure[0]/[1] 挂伙伴行的前提）。
- Work5 第 4 章重排（大纲）：4.1 渠道路径 / 4.2 营销组合 4P（4.2.1 表 4-1 摘要、4.2.2 渠道结构、4.2.3 媒介预算）/ 4.3 4C / 4.4 反应机制（新节）。4P 详述维持折叠 detail 不占编号，T06 契约（默认收起、打印展开、导出全量）不变。
- 4.2.2 渠道结构 = G7 树图单载体（表 4-2 取消，不存在这个表）+ 树图下方执行机制文字（渠道激励 + 本地渠道关系，从 4P 详述折叠层升入）。树图：伙伴行与渠道行同节距、虚线连接、无占比条、标签“◇ 伙伴名（顿号连接）”；一级分组块标签补合计（“线上 65%”）；structure 空 = 整块降级为一行提示（不画树图不显伙伴）；side 空 = 不进图、图下一行“◇ 未分类伙伴：×× — 回 Work4 标注线上/线下”。
- 4.4 反应机制（新）：同步区块直读 state.work1 指标 Δ（与表 1-1 同源，偏差最大 3 项），块内独立 AI 起草按钮（空态“AI 起草反应机制”→已生成“重新生成”，覆盖语义），不进顶部一键汇总；W1 无实测数据时按钮置灰 + 提示去 Work 1 完成调研，不调 AI。
- 导出 md：4.2.2 走缩进列表数据投影（一级“线上（65%）”/二级“抖音小店 40%”/伙伴“◇ 伙伴：A、B”/未分类末行）+ 末尾注“（渠道结构图见应用内视图）”；树图放主层不进 T06；打印不做新机制（SVG 在 DOM 内随 window.print() 输出）。

硬约束：

- 新增或改动的 lib 文件（json_extract.js 等）必须在 index.html 的 script 标签上升 ?v= 版本号，否则浏览器缓存会吃掉改动。
- ADR 0008 步级 AI 起草语义不动（整组覆盖 + 确认弹窗）；不加新 ADR；CONTEXT.md 术语已定稿不要动。
- Work5 对 Work4 是只读同步，展示层不调 AI（唯一例外是 4.4 块内按钮，见票 00-(d)）。
- docs/cases/ 五个案例的 keyPartners 与 bundle.js、SCHEMA.md 已按新形状定稿，不要改案例数据。
- 中文注释、命名与周边代码同风格；任何输出不用 emoji，引号用“”不用「」。
- 每完成一块跑 node --check 与 tests/ 下相关测试再提交；测试按票 06 清单最小化新增，不引测试框架。提交用中文 conventional commits，一块一提交。

验收标准：

1. 打开任一案例进 Work5 第 4 章：4.2.2 树图含伙伴行、按线上/线下分组、导出 md 投影正确、打印可见树图。
2. Work4 手动加伙伴默认未分类，段控两键可切换可取消；AI 起草返回的伙伴自带分类。
3. 用旧格式存档（string[] keyPartners）载入：数据不丢、自动带分类初值。
4. 4.4 反应机制在无 W1 实测时置灰，有实测时能起草并重生成。
5. 全部测试通过，node --check 全绿。
