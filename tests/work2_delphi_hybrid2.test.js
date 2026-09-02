/* Node test: Work 2 Hybrid 2 Delphi — converge math + state machine fields.
   Run: node tests/work2_delphi_hybrid2.test.js
*/
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.join(__dirname, '..', 'docs');
const sandbox = {
  console, setTimeout, clearTimeout, Date, JSON, Math, Object, Array, String, Number, Boolean,
  document: { body: { dataset: {} }, querySelector: () => null },
  uid: (p='id') => p + '_' + Math.random().toString(36).slice(2, 9),
  mean: a => a.length ? a.reduce((x,y)=>x+y,0)/a.length : 0,
  median: a => { if(!a.length) return 0; const s=a.slice().sort((x,y)=>x-y); const m=Math.floor(s.length/2); return s.length%2?s[m]:(s[m-1]+s[m])/2; },
  clamp: (v,lo,hi) => Math.max(lo, Math.min(hi, v)),
  autosave: () => {},
  state: null,
  Work2: {}, UI: {}, App: {}, Runner: {}, API: {}
};
sandbox.window = sandbox;
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(path.join(root, 'workshop2.js'), 'utf8'), sandbox, {filename:'workshop2.js'});
const W2 = sandbox.Work2;
sandbox.state = { work1: { sbu:{} }, work2: W2.defaultData() };

let pass=0, fail=0;
function ok(name, cond, detail){
  if(cond){ pass++; console.log('PASS ' + name); }
  else { fail++; console.log('FAIL ' + name + (detail? ' — ' + detail : '')); }
}

// ---- default delphi state machine fields ----
const d = W2.defaultData().delphi;
ok('delphi default: Hybrid 2 fields present',
  d.recruitment && Array.isArray(d.recruitment.perspectives) &&
  Array.isArray(d.personas) && d.userHosted === true &&
  d.finalWeights === null && d.status === 'idle' && d.phase === null && d.drifted === false);
ok('delphi default: legacy fields kept (compat)',
  'panel' in d && 'round1' in d && 'round2' in d && 'weights' in d);

// ---- convergeWeights: 5 personas, mean + per-axis normalization ----
const inds = [
  {id:'a1', axis:'attractiveness'}, {id:'a2', axis:'attractiveness'},
  {id:'c1', axis:'competitiveness'}, {id:'c2', axis:'competitiveness'}
];
const mk = (aa1, aa2, cc1, cc2) => ({ ratings: {
  attractiveness: { a1: aa1, a2: aa2 },
  competitiveness: { c1: cc1, c2: cc2 }
}});
const personas = [
  mk(0.8, 0.2, 0.9, 0.1),
  mk(0.6, 0.4, 0.7, 0.3),
  mk(0.4, 0.6, 0.5, 0.5),
  mk(0.2, 0.8, 0.3, 0.7),
  mk(0.5, 0.5, 0.1, 0.9)
];
const w = W2.convergeWeights(personas, inds);
ok('converge: attractiveness mean correct',
  Math.abs(w.attractiveness.a1 - 0.5) < 0.001 && Math.abs(w.attractiveness.a2 - 0.5) < 0.001);
ok('converge: competitiveness mean correct',
  Math.abs(w.competitiveness.c1 - 0.5) < 0.001 && Math.abs(w.competitiveness.c2 - 0.5) < 0.001);
ok('converge: each axis sums to 1',
  ['attractiveness','competitiveness'].every(axis =>
    Math.abs(Object.values(w[axis]).reduce((a,b)=>a+b,0) - 1) < 0.001));

// asymmetric case
const w2 = W2.convergeWeights([mk(0.9,0.1,0.2,0.8), mk(0.7,0.3,0.4,0.6)], inds);
ok('converge asymmetric: a1=0.8, c2=0.7',
  Math.abs(w2.attractiveness.a1 - 0.8) < 0.001 && Math.abs(w2.competitiveness.c2 - 0.7) < 0.001);

// missing ratings are skipped, still normalized
const sparse = [
  { ratings: { attractiveness: { a1: 0.6, a2: 0.4 }, competitiveness: { c1: 1 } } },            // c2 缺失
  { ratings: { attractiveness: { a1: 0.2, a2: 0.8 }, competitiveness: { c1: 0.5, c2: 0.5 } } }
];
const w3 = W2.convergeWeights(sparse, inds);
ok('converge sparse: mean over available only (a1=(0.6+0.2)/2)',
  Math.abs(w3.attractiveness.a1 - 0.4) < 0.001);
ok('converge sparse: renormalized axis sum=1',
  Math.abs(Object.values(w3.attractiveness).reduce((a,b)=>a+b,0) - 1) < 0.001 &&
  Math.abs(Object.values(w3.competitiveness).reduce((a,b)=>a+b,0) - 1) < 0.001);
ok('converge sparse: c1 mean over 2 personas then normalized',
  Math.abs(w3.competitiveness.c1 - 0.6) < 0.001);
ok('converge sparse: empty persona list → zeros',
  Object.values(W2.convergeWeights([], inds).attractiveness).every(v => v === 0));

// ---- effectiveWeights: stored two-level weights are the authority ----
const st = sandbox.state;
const w2state = st.work2;
// template weights: 8 indicators per axis × (0.25*0.5) → uniform 0.125 after normalization
let ew = W2.effectiveWeights();
ok('effectiveWeights: template fallback uniform 1/8',
  Math.abs(ew.attractiveness[W2.allIndicators()[0].id] - 1/8) < 0.001);
// manual stored edit wins even if a stale finalWeights is present
const firstInd = W2.allIndicators()[0];
const firstCat = w2state[firstInd.axis].categories.find(c=>c.id===firstInd.catId);
w2state[firstInd.axis].categories.forEach(c=>{
  c.weight = c.id===firstCat.id ? 1 : 0;
  c.indicators.forEach(i=>{ i.weight = i.id===firstInd.id ? 1 : 0; });
});
w2state.delphi.finalWeights = { attractiveness: {}, competitiveness: {} };
W2.allIndicators().forEach((i, idx)=>{ w2state.delphi.finalWeights[i.axis][i.id] = idx===0 ? 0.001 : 0.999; });
ew = W2.effectiveWeights();
ok('effectiveWeights: stored edit wins, finalWeights not authoritative',
  Math.abs(ew[firstInd.axis][firstInd.id] - 1) < 0.001);

// ---- backfillWeightsInto: 一级×二级 == 收敛权重 ----
const tiny = {
  attractiveness: { categories: [
    { id:'c1', name:'经济', weight:0.25, indicators:[{id:'a1', weight:0.5},{id:'a2', weight:0.5}] },
    { id:'c2', name:'风险', weight:0.25, indicators:[{id:'a3', weight:0.5},{id:'a4', weight:0.5}] }
  ]},
  competitiveness: { categories: [] }
};
const convW = { attractiveness:{a1:0.4,a2:0.2,a3:0.3,a4:0.1}, competitiveness:{} };
ok('backfill: applies when weights exist',
  W2.backfillWeightsInto(tiny, convW) === true);
ok('backfill: category weight = sum of its converged indicators',
  Math.abs(tiny.attractiveness.categories[0].weight - 0.6) < 0.001 &&
  Math.abs(tiny.attractiveness.categories[1].weight - 0.4) < 0.001);
ok('backfill: indicator weight = converged / category sum',
  Math.abs(tiny.attractiveness.categories[0].indicators[0].weight - 0.4/0.6) < 0.001 &&
  Math.abs(tiny.attractiveness.categories[0].indicators[1].weight - 0.2/0.6) < 0.001);
ok('backfill: 一级×二级 reproduces converged weight',
  Math.abs(tiny.attractiveness.categories[0].weight * tiny.attractiveness.categories[0].indicators[0].weight - 0.4) < 0.001 &&
  Math.abs(tiny.attractiveness.categories[1].weight * tiny.attractiveness.categories[1].indicators[1].weight - 0.1) < 0.001);
const tinyZero = { attractiveness:{categories:[{id:'c',name:'经济',weight:0.25,indicators:[{id:'a',weight:0.5}]}]}, competitiveness:{categories:[]} };
ok('backfill: all-zero weights → no write, original kept',
  W2.backfillWeightsInto(tinyZero, {attractiveness:{a:0}, competitiveness:{}}) === false &&
  tinyZero.attractiveness.categories[0].weight === 0.25 &&
  tinyZero.attractiveness.categories[0].indicators[0].weight === 0.5);

// ---- migrateDelphiWeights: one-time backfill + release, idempotent ----
const legacy = W2.defaultData();
const legacyInds = legacy.attractiveness.categories[0].indicators;
legacy.delphi.finalWeights = {
  attractiveness: { [legacyInds[0].id]: 0.5, [legacyInds[1].id]: 0.5 },
  competitiveness: {}
};
ok('migration: backfills stored weights from finalWeights (returns undefined per migrate contract)',
  W2.migrateDelphiWeights(legacy) === undefined &&
  Math.abs(legacy.attractiveness.categories[0].weight - 1) < 0.001 &&
  legacy.attractiveness.categories[0].indicators.every(i=>Math.abs(i.weight - 0.5) < 0.001));
ok('migration: releases finalWeights and marks done',
  legacy.delphi.finalWeights === null && legacy.delphi.status === 'done' && legacy.delphi.drifted === false);
ok('migration: idempotent — second call is a no-op',
  W2.migrateDelphiWeights(legacy) === undefined && legacy.delphi.finalWeights === null);

// ---- persona card shape used by User 主持 hosted UI ----
w2state.delphi.personas = [{
  id: 'p1', perspectiveName: '财务视角', keySignals: ['回本周期'],
  ratings: w, reasoning: '短期要回本', userOverride: false
}];
ok('persona shape: perspectiveName/ratings/reasoning/userOverride',
  w2state.delphi.personas[0].perspectiveName === '财务视角' &&
  w2state.delphi.personas[0].userOverride === false);

console.log(`\n${pass} pass / ${fail} fail`);
process.exit(fail ? 1 : 0);
