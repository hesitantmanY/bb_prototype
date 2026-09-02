/* Node test: 3.3 备选卖点痛点绑定归一 + 存量自愈（2026-09-01 grilling，决策 1-B/2-B）。

   事故：旧口径生成的 12 行候选 painId 全缺失，pain 字段一半是 AI 转述文本
   （与痛点地图对不上）、一半是幻觉 id（pain_3gmp2rei 等，不在地图）——
   关联痛点列实质空缺，证据链断裂；且 painCell 在 td 上设 display:flex
   覆盖 table-cell，整表错位（渲染层，另行修复）。

   共识：幻觉 id pain 清空；painId 命中地图 → pain 以地图原文为准 +
   evidence 为空时带入痛点证据；绑不上不动（低置信绝不自动绑）；
   已正确绑定行自愈时不动；幂等；绝不碰评分/勾选/场景/描述。

   Run: node tests/work3_pain_heal.test.js
*/
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.join(__dirname, '..', 'docs');
const sandbox = {
  console, setTimeout, clearTimeout, Date, JSON, Math, Object, Array, String, Number, Boolean,
  document: { body: { dataset: {} }, querySelector: () => null, createElement: () => ({ style: {}, appendChild(){}, setAttribute(){} }) },
  uid: (p='id') => p + '_' + Math.random().toString(36).slice(2, 9),
  mean: a => a.length ? a.reduce((x,y)=>x+y,0)/a.length : 0,
  median: a => { if(!a.length) return 0; const s=a.slice().sort((x,y)=>x-y); const m=Math.floor(s.length/2); return s.length%2?s[m]:(s[m-1]+s[m])/2; },
  clamp: (v,lo,hi) => Math.max(lo, Math.min(hi, v)),
  esc: s => String(s??''),
  autosave: () => {},
  state: null,
  Work3: {}, UI: {}, App: {}, Runner: {}, API: {}
};
sandbox.window = sandbox;
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(path.join(root, 'workshop3.js'), 'utf8'), sandbox, {filename:'workshop3.js'});
const W3 = sandbox.Work3;

let pass=0, fail=0;
function ok(name, cond, detail){
  if(cond){ pass++; console.log('PASS ' + name); }
  else { fail++; console.log('FAIL ' + name + (detail? ' — ' + detail : '')); }
}

const PAIN_MAP = [
  { id:'pain_aaa', pain:'老式温控器控温不精准，导致能源浪费严重', type:'痛点', evidence:'语料摘录A（[真实]）' },
  { id:'pain_bbb', pain:'夜间温度波动导致睡眠质量差', type:'痛点', evidence:'8 篇评论提及' },
  { id:'pain_ccc', pain:'远程调温不精准', type:'机会', evidence:'' }
];
function mkState(candidates){
  return { work3: { mining: { painMap: PAIN_MAP.slice() }, candidates } };
}

// —— resolvePainBinding（AI 新生成行的归一规则）——
sandbox.state = mkState([]);
let b = W3.resolvePainBinding({ painId:'pain_aaa', pain:'AI 自己转述的版本', evidence:'' });
ok('painId 命中 → pain 以地图原文为准（不信任 AI 转述）',
  b.painId==='pain_aaa' && b.pain===PAIN_MAP[0].pain);
ok('painId 命中 → evidence 为空时带入痛点证据', b.evidence==='语料摘录A（[真实]）');
b = W3.resolvePainBinding({ painId:'pain_aaa', pain:'x', evidence:'已有证据' });
ok('evidence 已有 → 不覆盖', b.evidence==='已有证据');
b = W3.resolvePainBinding({ painId:'pain_zzz', pain:'pain_halluci', evidence:'' });
ok('幻觉 id pain 且不在地图 → pain 清空、painId 落空',
  b.pain==='' && b.painId==='');
b = W3.resolvePainBinding({ painId:'', pain:'pain_bbb', evidence:'' });
ok('pain 字段填了真实存在的 id → 视为 id 绑定',
  b.painId==='pain_bbb' && b.pain===PAIN_MAP[1].pain);

// —— healCandidatesPain（存量自愈）——
// 行1: 精确匹配文本；行2: 包含匹配（候选文本包含地图原文）；行3: 幻觉 id；
// 行4: 转述对不上 → 不动；行5: 已正确绑定 + 自定义证据 → 完全不动。
const keep = { desirabilityScores:{ p1:{att:9} }, selected:true, scenarioId:'s1', description:'保留我' };
sandbox.state = mkState([
  { id:'c1', name:'卖点1', painId:'', pain:'老式温控器控温不精准，导致能源浪费严重', evidence:'', ...structuredClone(keep) },
  { id:'c2', name:'卖点2', painId:'', pain:'痛点：夜间温度波动导致睡眠质量差，非常影响休息', evidence:'', ...structuredClone(keep) },
  { id:'c3', name:'卖点3', painId:'', pain:'pain_3gmp2rei', evidence:'', ...structuredClone(keep) },
  { id:'c4', name:'卖点4', painId:'', pain:'温控器控温不精准导致电费飙升，用户苦不堪言', evidence:'', ...structuredClone(keep) },
  { id:'c5', name:'卖点5', painId:'pain_ccc', pain:'远程调温不精准（用户手改）', evidence:'自定义证据', ...structuredClone(keep) }
]);
const cs = sandbox.state.work3.candidates;
const changed1 = W3.healCandidatesPain();
ok('heal 报告发生变更', changed1 === true);
ok('精确匹配 → 绑定 + 地图原文 + 证据带入',
  cs[0].painId==='pain_aaa' && cs[0].pain===PAIN_MAP[0].pain && cs[0].evidence==='语料摘录A（[真实]）');
ok('包含匹配（候选含地图原文）→ 绑定',
  cs[1].painId==='pain_bbb' && cs[1].pain===PAIN_MAP[1].pain && cs[1].evidence==='8 篇评论提及');
ok('幻觉 id → pain 清空、绑定落空（无信息量字段不进自定义框）',
  cs[2].painId==='' && cs[2].pain==='');
ok('转述对不上 → 原样不动（不自动低置信绑定）',
  cs[3].painId==='' && cs[3].pain==='温控器控温不精准导致电费飙升，用户苦不堪言');
ok('已正确绑定行 → pain/证据不被 clobber',
  cs[4].painId==='pain_ccc' && cs[4].pain==='远程调温不精准（用户手改）' && cs[4].evidence==='自定义证据');
ok('评分/勾选/场景/描述分毫不碰',
  JSON.stringify(cs[0].desirabilityScores)==='{"p1":{"att":9}}' && cs[0].selected===true &&
  cs[0].scenarioId==='s1' && cs[0].description==='保留我' && cs[2].selected===true);

// 幂等：再跑一遍零变更（证据不被二次改写、无抖动）
const snapshot = JSON.stringify(cs);
const changed2 = W3.healCandidatesPain();
ok('幂等：二跑无变更', changed2 === false && JSON.stringify(cs) === snapshot);

console.log(`\n${pass} pass / ${fail} fail`);
process.exit(fail ? 1 : 0);
