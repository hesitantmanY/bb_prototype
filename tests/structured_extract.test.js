/* Node test: JsonExtract.structured —— 结构化输出解析链的唯一接缝
   （2026-09-01 架构评审候选 1：原实现从 workshop4.js 迁入）。

   浏览器与 node 测试跨同一接缝；Work4.parseStructured 只是薄委托。

   Run: node tests/structured_extract.test.js
*/
'use strict';
const path = require('path');
const JsonExtract = require(path.join(__dirname, '..', 'docs', 'lib', 'json_extract.js'));

let pass = 0, fail = 0;
function ok(name, cond, detail){
  if(cond){ pass++; console.log('PASS ' + name); }
  else { fail++; console.log('FAIL ' + name + (detail ? ' — ' + detail : '')); }
}

const FENCED = `【无法解析】\n\`\`\`json\n[\n{"name":"基础版","targetSegment":"性价比","price":79,"unit":"GBP","hero":false,"notes":"核心温控"},\n{"name":"标准版","targetSegment":"主流","price":139,"unit":"GBP","hero":true,"notes":"主力款"},\n{"name":"高级版","targetSegment":"高净值","price":219,"unit":"GBP","hero":false,"notes":"全屋联动"}\n]\n\`\`\``;

const MD = `| 档位 | 目标客群 | 价格 | 主推 |\n| --- | --- | --- | --- |\n| 基础版 | 性价比 | 79 | 否 |\n| 标准版 | 主流家庭 | 139 | 是 |`;

const TRUNCATED = `\`\`\`json\n[\n{"name":"基础版","price":79,"hero":false},\n{"name":"标准版","price":139,"hero":true},\n{"name":"高级版","price":21`;

// 智能引号作为 JSON 分隔符（“key”: “value”）——严格 JSON.parse 失败的形态
const SMART_DELIM = `\`\`\`json\n[{\u201cname\u201d:\u201c基础版\u201d,\u201ctargetSegment\u201d:\u201c性价比用户\u201d,\u201cprice\u201d:79,\u201chero\u201d:false}]\n\`\`\``;

{
  const r = JsonExtract.structured(FENCED, 'tiers');
  ok('fenced pretty JSON → 3 行', r.ok && r.value.length === 3, r.reason);
  ok('  hero 落在标准版', r.ok && r.value.find(t => t.hero)?.name === '标准版');
  ok('  price 为数字', r.ok && r.value.map(t => t.price).join(',') === '79,139,219');
}
{
  const r = JsonExtract.structured(MD, 'tiers');
  ok('Markdown 表 → 2 行', r.ok && r.value.length === 2, r.reason);
  ok('  列名别名 + 「是」→ hero=true', r.ok && r.value.find(t => t.hero)?.name === '标准版');
  ok('  markdown-table warning', r.ok && r.warnings.some(w => /markdown-table/.test(w)), String(r.warnings));
}
{
  const r = JsonExtract.structured(TRUNCATED, 'tiers');
  ok('截断数组 → 抢救 2 行', r.ok && r.value.length === 2, r.reason);
  ok('  salvage warning', r.ok && r.warnings.some(w => /truncated-json-salvaged/.test(w)), String(r.warnings));
}
{
  const r = JsonExtract.structured(SMART_DELIM, 'tiers');
  ok('智能引号分隔符 → 宽松解析救回', r.ok && r.value.length === 1, r.reason);
  ok('  normalized-json warning', r.ok && r.warnings.some(w => /normalized-json/.test(w)), String(r.warnings));
}
{
  const r = JsonExtract.structured('完全没有结构的散文，什么档位都没说', 'tiers');
  ok('纯散文 → 失败带友好 reason', !r.ok && /无法解析为结构化字段/.test(r.reason), r.reason);
}
{
  const r = JsonExtract.structured('- 功能卖点\n- 情感卖点\n- 服务承诺', 'tagList');
  ok('tagList bullet → 3 项', r.ok && r.value.length === 3 && r.value[1] === '情感卖点', r.reason);
}
{
  const r = JsonExtract.structured('[{"media":"抖音","budgetShare":60,"message":"A","kpi":"x"},{"media":"小红书","budgetShare":60,"message":"B","kpi":"y"}]', 'advertising');
  ok('advertising share 归一到 100', r.ok && Math.abs(r.value.reduce((s,a)=>s+a.budgetShare,0) - 100) < 0.01, JSON.stringify(r.value));
}

// AI01:清洗后为空的表字段 = 解析失败(不许静默清空已有数据)
{
  const r = JsonExtract.structured('```json\n[{"channel":"某渠道","reach":4000}]\n```', 'advertising');
  ok('advertising 旁路键(channel)清洗后为空 → ok:false',
     r.ok === false && /empty after clean/.test(r.reason), JSON.stringify(r));
}
{
  const r = JsonExtract.structured('```json\n[{"tactic":"","mechanic":""}]\n```', 'salesPromotion');
  ok('salesPromotion 空壳行 → ok:false', r.ok === false && /empty after clean/.test(r.reason), JSON.stringify(r));
}
{
  const r = JsonExtract.structured('```json\n[{"event":"","timing":""}]\n```', 'pr');
  ok('pr 空壳行 → ok:false', r.ok === false, JSON.stringify(r));
}
// AI01:share 百分号形态容错,非法值落 0 不产生 NaN
{
  const r = JsonExtract.structured('```json\n[{"media":"电视","share":"30%"},{"media":"社媒","share":"70%"}]\n```', 'advertising');
  ok('share "30%" 形态 → 30', r.ok && r.value[0].budgetShare === 30, JSON.stringify(r.value));
  ok('share 解析后无 NaN 残留', r.ok && r.value.every(a => Number.isFinite(a.budgetShare)), JSON.stringify(r.value));
}
{
  const r = JsonExtract.structured('```json\n[{"media":"电视","budgetShare":"abc"}]\n```', 'advertising');
  ok('share 非法串 → 落 0 而非 NaN', r.ok && r.value[0].budgetShare === 0, JSON.stringify(r.value));
}
// AI06:hero 肯定形态白名单 —「否」「主推」不再误判 true
{
  const r = JsonExtract.structured('```json\n[{"name":"A","price":79,"hero":"否"},{"name":"B","price":139,"hero":true},{"name":"C","price":199,"hero":"主推"}]\n```', 'tiers');
  ok('hero "否" → false', r.ok && !r.value.find(t=>t.name==='A').hero, JSON.stringify(r.value.map(t=>[t.name,t.hero])));
  ok('hero true → true', r.ok && r.value.find(t=>t.name==='B').hero);
  ok('hero "主推" 不误判', r.ok && !r.value.find(t=>t.name==='C').hero, JSON.stringify(r.value.map(t=>[t.name,t.hero])));
}
// AI06:Markdown 表路径先按 hero 列坐标判定(名称含"主力"不误伤)
{
  const r = JsonExtract.structured('| 档位 | 价格 | hero |\n| --- | --- | --- |\n| 主力机型A | 139 | 是 |\n| 经济款 | 79 | 否 |', 'tiers');
  ok('表路径 hero 列 是→true/否→false', r.ok && r.value.find(t=>t.name==='主力机型A').hero === true && r.value.find(t=>t.name==='经济款').hero === false,
     JSON.stringify(r.value.map(t=>[t.name,t.hero])));
}

console.log(`\n${pass} pass / ${fail} fail`);
process.exit(fail === 0 ? 0 : 1);
