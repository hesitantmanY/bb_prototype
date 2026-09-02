/* Node test for Work4.parseStructured / _prettifyJsonBlocks tolerant parse chain.
   Run: node tests/work4_parse.test.js

   2026-08-31：这条链 6 次截图驱动补丁（智能引号/裸换行/截断抢救/表格兜底/
   multi-fence/prettify）长期零回归测试——当年 json_extract.js 漏挂 <script>，
   浏览器里 JsonExtract 为 undefined，workshop4 在 catch 后早退，整条兜底链
   全是死代码，fenced JSON 必报「未找到 JSON 块或 Markdown 表格」。
   2026-09-01 架构评审候选 1：解析链迁入 JsonExtract，Work4 只留薄委托；
   本文件收录真实 LLM 输出形态，「JsonExtract 未加载」环境改为断言显式失败
   （漏挂由 tests/llm_seam.test.js 源码断言防复发，不再维护第二套兜底链）。
*/
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

let pass = 0, fail = 0;
function ok(name, cond, detail){
  if(cond){ pass++; console.log('PASS ' + name); }
  else { fail++; console.log('FAIL ' + name + (detail ? ' — ' + detail : '')); }
}

// 模拟浏览器 <script> 加载顺序：withJsonExtract=false 时模拟 json_extract.js 漏挂
function loadWork4({ withJsonExtract }){
  const sandbox = { console, el: () => null };
  sandbox.window = {};
  sandbox.Work4 = {};  // workshop4.js 顶层即 Work4.xxx 赋值，需预置
  if(withJsonExtract){
    const JE = require(path.join(__dirname, '..', 'docs', 'lib', 'json_extract.js'));
    sandbox.JsonExtract = JE;
    sandbox.window.JsonExtract = JE;
  }
  vm.createContext(sandbox);
  const src = fs.readFileSync(path.join(__dirname, '..', 'docs', 'workshop4.js'), 'utf8');
  try { vm.runInContext(src, sandbox); }
  catch(e){ /* DOM 渲染层引用在 eval 期可能抛错；parse 纯函数在此之前已挂载 */ }
  if(!sandbox.Work4 || typeof sandbox.Work4.parseStructured !== 'function'){
    throw new Error('Work4.parseStructured 未成功加载，eval 过早失败');
  }
  return sandbox.Work4;
}

// ---- fixtures（真实 LLM 输出形态）----

// 2026-08-31 截图故障存档原文：失败前缀 + pretty-printed fenced JSON
const FENCED_PRETTY = `【无法解析为结构化字段：未找到 JSON 块或 Markdown 表格】
\`\`\`json
[
  {
    "name": "基础版",
    "targetSegment": "追求性价比、只需基础温控的家庭",
    "price": 79,
    "unit": "GBP",
    "hero": false,
    "notes": "核心温控 + 手动/编程模式"
  },
  {
    "name": "标准版",
    "targetSegment": "重视远程控制与节能账单的主流家庭",
    "price": 139,
    "unit": "GBP",
    "hero": true,
    "notes": "主力走量款，含智能App、学习算法、能耗报告"
  },
  {
    "name": "高级版",
    "targetSegment": "高净值智能家居用户",
    "price": 219,
    "unit": "GBP",
    "hero": false,
    "notes": "全屋联动、多传感器、语音控制、高级材质与安装服务"
  }
]
\`\`\``;

const SMART_QUOTES = '```json\n[\n  {\n    “name”: “基础版”,\n    “price”: 79,\n    “hero”: false,\n    “notes”: “核心温控”\n  }\n]\n```';

const BARE_NEWLINE = '```json\n[{"name":"基础版","price":79,"hero":false,"notes":"第一行\n第二行续"}]\n```';

// 截断：max_tokens 把数组切在第 3 个对象半路，无闭合 fence
const TRUNCATED = '```json\n[\n  {"name":"基础版","price":79,"unit":"GBP","hero":false,"notes":"核心温控"},\n  {"name":"标准版","price":139,"unit":"GBP","hero":true,"notes":"主力走量款"},\n  {"name":"高级版","price":219,"unit":"GBP","hero":false,"notes":"全屋联动、多传感';

const MD_TABLE = `## 各档位建议定价

| 档位 | 目标客群 | 价格 | 单位 | 主推 | 备注 |
| --- | --- | --- | --- | --- | --- |
| 基础版 | 追求性价比的家庭 | 79 | GBP | 否 | 核心温控 + 手动 |
| 标准版 | 主流家庭 | 139 | GBP | 是 | 主力走量款，含 App |
| 高级版 | 高净值用户 | 219 | GBP | 否 | 全屋联动 |`;

// prompt 里的示例 fence（1 行假数据）+ 真实 fence（3 行）
const MULTI_FENCE = `示例：
\`\`\`json
[{"name":"示例档","price":1}]
\`\`\`
实际建议：
\`\`\`json
[
  {"name":"基础版","price":79,"hero":false,"notes":"a"},
  {"name":"标准版","price":139,"hero":true,"notes":"b"},
  {"name":"高级版","price":219,"hero":false,"notes":"c"}
]
\`\`\``;

const TRAILING_COMMAS = '```json\n[\n  {"name":"基础版","price":79,"hero":false,},\n  {"name":"标准版","price":139,"hero":true,},\n]\n```';

const COMPACT_FENCE = '```json\n[{"name":"基础版","price":79,"hero":false,"notes":"核心温控"},{"name":"标准版","price":139,"hero":true,"notes":"主力"}]\n```';

// LLM 把闭合 ``` 贴在 JSON 同行（CommonMark 非法闭合，seg-9 现场）
const SAMELINE_CLOSE = '## 各档位建议定价\n```json\n[{"name":"基础版","price":79,"hero":false},{"name":"标准版","price":139,"hero":true}]```';

const CHANNEL_TABLE = `| 渠道 | 价格调整 | 理由 |
| --- | --- | --- |
| 线上自营 | 标准价 | 直接触达 |
| 第三方平台 | 加价 10% | 平台佣金 |`;

// ---- 正常环境（json_extract.js 已加载，= 修复后浏览器）----
const W4 = loadWork4({ withJsonExtract: true });

{
  const r = W4.parseStructured(FENCED_PRETTY, 'tiers');
  ok('fenced pretty JSON + 失败前缀 → 3 行', r.ok && r.value.length === 3, r.reason);
  ok('  hero 落在标准版', r.ok && r.value.find(t => t.hero)?.name === '标准版');
  ok('  price 为数字 79/139/219', r.ok && r.value.map(t => t.price).join(',') === '79,139,219');
}
{
  const r = W4.parseStructured(SMART_QUOTES, 'tiers');
  ok('智能引号 fence → 解析成功', r.ok && r.value.length === 1, r.reason);
  ok('  name 归一化', r.ok && r.value[0].name === '基础版');
}
{
  const r = W4.parseStructured(BARE_NEWLINE, 'tiers');
  ok('字符串值内裸换行 → 解析成功', r.ok && r.value.length === 1, r.reason);
  ok('  notes 保留换行语义', r.ok && /第一行\n?第二行/.test(r.value[0].notes));
}
{
  const r = W4.parseStructured(TRUNCATED, 'tiers');
  ok('截断数组（无闭合 fence）→ 抢救前缀', r.ok && r.value.length === 2, r.reason);
  ok('  抢救 warning 标记', r.ok && r.warnings.some(w => /truncated-json-salvaged/.test(w)), String(r.warnings));
  ok('  hero 标准版未丢', r.ok && r.value.find(t => t.hero)?.name === '标准版');
}
{
  const r = W4.parseStructured(MD_TABLE, 'tiers');
  ok('纯 Markdown 表（无 JSON）→ 3 行', r.ok && r.value.length === 3, r.reason);
  ok('  markdown-table warning', r.ok && r.warnings.some(w => /markdown-table/.test(w)), String(r.warnings));
  ok('  列名别名映射 + 「是」→ hero=true', r.ok && r.value.find(t => t.hero)?.name === '标准版');
  ok('  价格列转数字', r.ok && r.value[0].price === 79);
}
{
  const r = W4.parseStructured(MULTI_FENCE, 'tiers');
  ok('multi-fence（示例 1 行 + 真实 3 行）→ 取最大 3 行', r.ok && r.value.length === 3, r.reason);
  ok('  不含示例档', r.ok && !r.value.some(t => t.name === '示例档'));
}
{
  const r = W4.parseStructured(TRAILING_COMMAS, 'tiers');
  ok('尾逗号（JsonExtract 层处理）→ 2 行', r.ok && r.value.length === 2, r.reason);
}
{
  const r = W4.parseStructured(CHANNEL_TABLE, 'channelPricing');
  ok('渠道表别名映射 → 2 行 channel 字段', r.ok && r.value.length === 2 && r.value[0].channel === '线上自营', r.reason);
}
{
  const r = W4.parseStructured('完全没有结构的散文，什么档位都没说', 'tiers');
  ok('纯散文无表无 JSON → 失败带 reason', !r.ok && /未找到 JSON/.test(r.reason), r.reason);
}
{
  const pretty = W4._prettifyJsonBlocks(COMPACT_FENCE);
  ok('prettify：单行 fence → 多行缩进', pretty.includes('\n  {') && pretty.includes('```json'), pretty.slice(0, 40));
  ok('prettify 产物仍可解析回 2 行', W4.parseStructured(pretty, 'tiers').value?.length === 2);
}
{
  // 闭合 ``` 贴在 JSON 同行（CommonMark 非法闭合）：剥末尾 fence 后重排并补正规闭合
  const pretty = W4._prettifyJsonBlocks(SAMELINE_CLOSE);
  ok('prettify：同行闭合 fence → 重排多行', pretty.includes('\n  {') && pretty.includes('\n```'), pretty.slice(-40));
  ok('  标题保留', pretty.includes('各档位建议定价'));
  ok('  产物可解析回 2 行', W4.parseStructured(pretty, 'tiers').value?.length === 2, W4.parseStructured(pretty, 'tiers').reason);
}

// ---- markdown 成稿渲染（散文段，2026-09-01）----
{
  const html = W4.renderMarkdown('- **官网直营**：按建议零售价销售\n- *亚马逊*：定价略低');
  ok('renderMarkdown：粗体列表项', html.includes('<li') && html.includes('<strong>官网直营</strong>'), html.slice(0, 120));
  ok('renderMarkdown：段落', /<p[^>]*>[^<]*这是一段散文<\/p>/.test(W4.renderMarkdown('这是一段散文')));
  ok('renderMarkdown：HTML 转义防注入', W4.renderMarkdown('<script>alert(1)</script>').includes('&lt;script&gt;'));
  ok('renderMarkdown：无内容安全', W4.renderMarkdown('') === '' && W4.renderMarkdown(null) === '');
}

// ---- 段落区语义（ADR 0008：只读正文展示，逐段采纳流已删除）----
// 散文/bullet 列表解析失败属正常——段落区不再做结构化红框门控。
{
  const PROSE = '基于英国智能温控器市场（如Nest、Hive、Tado）的定价锚点，建议将产品零售价定在 £129–£189 之间。';
  const dProse = W4.parseStructured(PROSE, 'tiers');
  ok('散文段：解析失败 + 用户友好 reason', !dProse.ok && /无法解析为结构化字段/.test(dProse.reason || ''));
  ok('段落采纳机制已移除（ADR 0008）', typeof W4.looksStructured === 'undefined' && typeof W4.mergeAiResult === 'undefined' && typeof W4.dedupAiResult === 'undefined');
}

// ---- 故障环境（json_extract.js 漏挂 <script>，2026-09-01 起）----
// 回归核心：库缺失时 workshop4 显式失败（reason 直说），不得静默早退或
// 假装成功；漏挂本身由 tests/llm_seam.test.js 的源码断言锁死。
const W4noLib = loadWork4({ withJsonExtract: false });
{
  const r = W4noLib.parseStructured(FENCED_PRETTY, 'tiers');
  ok('[无 JsonExtract] 显式失败而非早退成功', !r.ok, r.reason);
  ok('  reason 指明解析库未加载', /解析库未加载/.test(r.reason), r.reason);
}
{
  const r = W4noLib.parseStructured(MD_TABLE, 'tiers');
  ok('[无 JsonExtract] Markdown 表路径同样显式失败', !r.ok, r.reason);
}
{
  const r = W4noLib.parseStructured(TRUNCATED, 'tiers');
  ok('[无 JsonExtract] 截断抢救路径同样显式失败', !r.ok, r.reason);
}
{
  const r = W4noLib.parseStructured('纯散文无结构', 'tiers');
  ok('[无 JsonExtract] 纯散文同样显式失败', !r.ok, r.reason);
}

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
