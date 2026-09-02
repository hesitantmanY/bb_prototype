/* Node test: Work2 三档决策卡 AI 回填 id 消毒（2026-09-01）。
   现象（审计发现的同类风险）：决策单元 onResult 把 AI 返回的 marketId/marketIds
   原样写入 state。AI 幻觉清单外 id 时，tier1.marketId 成为孤儿 → tier1 名字变
   空串，随跨坊 CTA 污染 workshop3/4/5（「牛头不对马嘴」类）。
   修复：写入前按矩阵点 id 过滤，孤儿 id 丢弃。

   Run: node tests/work2_tier_sanitize.test.js
*/
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.join(__dirname, '..', 'docs');
const sandbox = {
  console, Math, Object, Array, String, Number, Boolean, JSON, Date,
  document: { querySelector: () => null },
  uid: (p='id') => p + '_x',
  clamp: (v,lo,hi) => Math.max(lo, Math.min(hi, v)),
  autosave: () => {}, showToast: () => {},
  el: () => ({ appendChild(){}, addEventListener(){}, classList:{add(){},remove(){}} }),
  state: null, Work2: {}, UI: {}, App: {}, Runner: {}, AiContext: undefined, API: {}
};
sandbox.window = sandbox;
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(path.join(root, 'workshop2.js'), 'utf8'), sandbox, {filename:'workshop2.js'});
const W2 = sandbox.Work2;

let pass=0, fail=0;
function ok(name, cond, detail){
  if(cond){ pass++; console.log('PASS ' + name); }
  else { fail++; console.log('FAIL ' + name + (detail? ' — ' + detail : '')); }
}

const valid = ['m_uk', 'm_de', 'm_jp'];

// 幻觉 id 混入三档
const d = W2.defaultData().decision;
d.tier1.marketId = 'm_mars';                       // 幻觉：不在清单
d.tier1.rationale = '火星电价低';
d.tier2.marketIds = ['m_de', 'm_venus', 'm_de'];   // 一个合法 + 一个幻觉 + 重复
d.tier3.marketIds = ['m_jp', 'm_pluto'];
W2.sanitizeTiers(d, valid);
ok('hallucinated tier1 id dropped', d.tier1.marketId === null, String(d.tier1.marketId));
ok('legit rationale preserved', d.tier1.rationale === '火星电价低');
ok('tier2 filtered', d.tier2.marketIds.length === 1 && d.tier2.marketIds[0] === 'm_de');
ok('tier3 filtered', d.tier3.marketIds.length === 1 && d.tier3.marketIds[0] === 'm_jp');

// 合法 id 原样通过
const d2 = W2.defaultData().decision;
d2.tier1.marketId = 'm_uk';
d2.tier2.marketIds = ['m_de', 'm_jp'];
W2.sanitizeTiers(d2, valid);
ok('valid tier1 kept', d2.tier1.marketId === 'm_uk');
ok('valid tier2 kept', d2.tier2.marketIds.length === 2);
ok('null tier1 untouched', (()=>{ const t=W2.defaultData().decision; W2.sanitizeTiers(t, valid); return t.tier1.marketId===null; })());

console.log(fail ? `\n${fail} FAILED` : `\nall ${pass} passed`);
process.exit(fail ? 1 : 0);
