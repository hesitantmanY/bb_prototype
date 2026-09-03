# AI05 — work4 步级回填 warnings/失败字段不进 toast:数字与实际不符

严重度:中 / 方向:AI 管线 / 确认度:confirmed

## 问题

work4 步级 AI 起草的结果汇总把三类"没成功"信息全部吞掉:

1. **字段级解析 warnings**(workshop4.js:393-402 收集,如 SKU/价格档位解析失败、budgetShare 总和 ≠100 被归一到 100%)从不展示——toast(workshop4.js:643-645)只用 n/total 与 reason;
2. **enum 字段失配静默跳过**(workshop4.js:403-405):LLM 把 strategy 写成"成本加成"而非约定值 cost-plus → includes 不命中 → 不写入、不计 n、无 warning;
3. crm 分支(workshop4.js:394-401)`n++` 无条件:空对象也计"已填入"。

用户看到"已填入 6/9 个字段"却无从知道哪 3 个失败、为什么;失败字段保持旧值却像填过。

## 期望

warnings 逐条拼进 toast 或追加明细行;enum 失配与 crm 空结果计入 warnings(与 table 失败同待遇)。

## 复现

1. W4 价格步 AI 起草,让 LLM 的 SKU 行缺必需键(整表被滤空)或 share 总和 ≠ 100;
2. toast 报已填入 n/total,无任何失败/归一化提示。

## 证据

- docs/workshop4.js:393-402 — warnings 收集后无出口
- docs/workshop4.js:643-645 — toast 只用 n/total 与 reason
- docs/workshop4.js:403-405 — enum 失配静默

## 修复方向

onResult 中把 applied.warnings 逐条并入 toast/追加提示;enum 失配与空 crm 计入 warnings;n 只计真正写入字段。
