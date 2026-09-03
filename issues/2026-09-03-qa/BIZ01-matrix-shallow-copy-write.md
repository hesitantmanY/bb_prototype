# BIZ01 — 卖点矩阵写浅拷贝:入选与评审分不落库,界面与状态机矛盾

严重度:高 / 方向:业务流程 / 确认度:confirmed

## 问题

`Work3.computeMatrix()` 返回候选的浅拷贝 `{...c, x, y}`(坐标由 review 覆盖分或 persona 均值算出)。矩阵相关代码在两处把「用户操作」写到这个拷贝上而不是真候选,导致编辑静默丢失:

1. **Work3 矩阵视图自动派生「入选」**(workshop3.js:1105-1114):派生逻辑在拷贝上设 `p.selected`,只把结果汇总写进 `coreValueIds`;**`candidates[].selected` 从不会被自动派生写入**。而 MVO 闸门(workshop3.js:225)与主张步 AI 守卫(workshop3.js:1476-1478)判的是真 `c.selected` → 表格里显示 ✓ 已入选,状态机仍认为没选:跨坊 CTA 不亮、切到主张步点 AI 起草提示"请先在矩阵中选择入选卖点"。用户点已勾的 ✓ 想"确认",实际是取消勾选。

2. **Work5 排名表评审编辑**(workshop5.js:550-554):合意性/可实施性输入框与「入选」勾选把值写进 `p.reviewDes/p.reviewImp/p.selected`(拷贝),随即 rerender → computeMatrix 从真候选重算(review 覆盖分未写入真身)→ 输入立即复位。旁边 syncedBadge 却写着"直接修改共享 state,上游工作坊同步生效"——与事实相反。

## 期望

对矩阵的人工修改(评审分、入选确认)真正落到 `state.work3.candidates`;自动派生的入选结果与状态机判据一致。

## 复现

1. W5 → 3.4 卖点矩阵排名表 → 把某卖点合意性改成 8.5 或勾选「入选」→ 失焦后分数/勾选复位;
2. W3 → AI 双维评分出明星卖点 → 表格显示自动入选 → mvo 仍打叉,"进入 Workshop 4"CTA 不亮。

## 修复方向

两处写入都改为定位真候选(`candidates.find(x=>x.id===p.id)`)再写;或让派生/确认统一走 `coreValueIds` + 手动 selected 的单一日志通道,闸门判据与之对齐。
