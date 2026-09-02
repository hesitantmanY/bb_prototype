/* Smoke test: load workshop 1-5 in a stub env, verify new schemas
   (work2 v2 three-tab, work3 six-step) + pure helpers.
   Run: node tests/random_example.test.js
*/
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.join(__dirname, '..', 'docs');
const files = ['workshop1.js', 'workshop2.js', 'workshop3.js', 'workshop4.js', 'workshop5.js'];

function makeNode(tag, attrs, ...children){
  const node = {
    tag, attrs: attrs || {}, children, _text: null,
    style: (attrs && attrs.style) || {},
    class: (attrs && attrs.class) || '',
    appendChild(c){ this.children.push(c); return c; },
    addEventListener(){ return this; },
    querySelector(){ return null; },
    set innerHTML(v){ this._innerHTML = v; this.children = []; },
    get innerHTML(){ return this._innerHTML || ''; },
    set textContent(v){ this._text = v; },
    get textContent(){ return this._text; }
  };
  if(children.length === 1 && typeof children[0] === 'string') node._text = children[0];
  return node;
}

// Minimal browser-like env
const sandbox = {
  console,
  setTimeout, clearTimeout, setInterval, clearInterval,
  Date, JSON, Math, Object, Array, String, Number, Boolean,
  document: { body: { dataset: {} }, querySelector: () => null, getElementById: () => null, createElement: t => makeNode(t), head: { appendChild(){} } },
  el: makeNode,
  uid: (prefix='id') => prefix + '_' + Math.random().toString(36).slice(2, 9),
  mean: (arr) => arr.length ? arr.reduce((a,b)=>a+b, 0) / arr.length : 0,
  sd: (arr) => {
    if(arr.length < 2) return 0;
    const m = arr.reduce((a,b)=>a+b, 0) / arr.length;
    return Math.sqrt(arr.reduce((s,x)=>s + (x-m)*(x-m), 0) / arr.length);
  },
  median: (arr) => { if(!arr.length) return 0; const s = arr.slice().sort((a,b)=>a-b); const m=Math.floor(s.length/2); return s.length%2 ? s[m] : (s[m-1]+s[m])/2; },
  clamp: (v, lo, hi) => Math.max(lo, Math.min(hi, v)),
  esc: s => String(s==null?'':s),
  backendOnline: false,
  state: null
};
['Work1','Work2','Work3','Work4','Work5','UI','App','Runner'].forEach(n => { sandbox[n] = {}; });
sandbox.UI.demoNote = () => null;
sandbox.API = { aiButton(){}, callJson(){}, call(){}, extractJson(){ return null; } };
sandbox.autosave = () => {};
sandbox.window = sandbox;
vm.createContext(sandbox);

// Default state built from the modules AFTER load (see below).
let pass=0, fail=0;
function ok(name, cond, detail){
  if(cond){ pass++; console.log('PASS ' + name); }
  else { fail++; console.log('FAIL ' + name + (detail? ' — ' + detail : '')); }
}

for(const f of files){
  const code = fs.readFileSync(path.join(root, f), 'utf8');
  try{ vm.runInContext(code, sandbox, {filename: f}); }
  catch(e){ console.log('LOAD ERR ' + f + ': ' + e.message); fail++; }
}

// Build a state object from the new defaultData() shapes.
sandbox.state = {
  work1: sandbox.Work1.defaultData(),
  work2: sandbox.Work2.defaultData(),
  work3: sandbox.Work3.defaultData(),
  work4: sandbox.Work4.defaultData(),
  work5: sandbox.Work5.defaultData()
};

/* ---------- Work 2 v2 ---------- */
ok('Work2 has 3 tabs', sandbox.Work2.steps.length === 3 &&
  sandbox.Work2.steps.map(s=>s.id).join(',') === 'framework,evaluate,decision');

const d2 = sandbox.state.work2;
ok('Work2 default schemaVersion=2', d2.meta.schemaVersion === 2);
ok('Work2 default template 4×2 attractiveness',
  d2.attractiveness.categories.length === 4 &&
  d2.attractiveness.categories.every(c => c.indicators.length === 2));
ok('Work2 default template 4×2 competitiveness',
  d2.competitiveness.categories.length === 4 &&
  d2.competitiveness.categories.every(c => c.indicators.length === 2));
ok('Work2 default weights 0.25 / 0.5',
  d2.attractiveness.categories.every(c => c.weight === 0.25 && c.indicators.every(i => i.weight === 0.5)));
ok('Work2 decision tier1/tier2/tier3 shape',
  d2.decision.tier1.resourcesPct === 80 && Array.isArray(d2.decision.tier2.marketIds) && Array.isArray(d2.decision.tier3.marketIds));
ok('Work2.allIndicators flattens 16', sandbox.Work2.allIndicators().length === 16);

// Migration v1 → v2
const oldWork2 = {
  scope: { question:'q', timeframe:'t', constraints:'c', candidateCount:4 },
  attractiveness: { indicators: [
    {id:'i1', name:'经济市场规模', rubric:{high:'h',mid:'m',low:'l'}, weight:0.5, support:3, source:'delphi'},
    {id:'i2', name:'渠道成熟度', rubric:{high:'h',mid:'m',low:'l'}, weight:0.5, support:3, source:'delphi'}
  ]},
  competitiveness: { indicators: [
    {id:'j1', name:'认证可复用', rubric:{high:'h',mid:'m',low:'l'}, weight:1, support:3, source:'delphi'}
  ]},
  delphi: { panel: [], weights: {attractiveness:{i1:1}, competitiveness:{j1:1}}, finalSynthesis:'syn' },
  markets: [
    {id:'m1', name:'新加坡', region:'SEA', notes:'keep1', scores:{}},
    {id:'m2', name:'吉隆坡', region:'SEA', notes:'keep2', scores:{}},
    {id:'m3', name:'雅加达', region:'SEA', notes:'keep3', scores:{}},
    {id:'m4', name:'曼谷', region:'SEA', notes:'dropped', scores:{}}
  ],
  matrix: { selectedMarketId:'m1', xCut:null, yCut:null, notes:'' },
  decision: { rationale:'r', sequence:'s', risks:['x'], nextSteps:'n' }
};
const mig2 = sandbox.Work2.migrateWork2(oldWork2);
ok('migrate: schemaVersion bumped', mig2.meta.schemaVersion === 2);
ok('migrate: first 3 markets retained', mig2.retained.length === 3 && mig2.retained[0].name === '新加坡');
ok('migrate: rest → candidates with reason', mig2.candidates.length === 1 && mig2.candidates[0].name === '曼谷' && mig2.candidates[0].reason === 'dropped');
ok('migrate: indicators bucketed into categories',
  mig2.attractiveness.categories.reduce((a,c)=>a+c.indicators.length,0) === 2 &&
  mig2.competitiveness.categories.reduce((a,c)=>a+c.indicators.length,0) === 1);
ok('migrate: tier1 from selectedMarketId', mig2.decision.tier1.marketId === 'm1' && mig2.decision.tier1.rationale === 'r');
ok('migrate: nextSteps → milestones', mig2.decision.tier1.milestones[0] === 'n');
ok('migrate: idempotent on v2', sandbox.Work2.migrateWork2(mig2) === mig2);
ok('migrate: old keys removed', !('markets' in mig2) && !('scope' in mig2));

// bucketIndicatorsByCategory fuzzy match
const buckets = sandbox.Work2.bucketIndicatorsByCategory(
  [{id:'a', name:'经济规模'}, {id:'b', name:'完全无关指标'}, {id:'c', name:'政治稳定性'}], 'attractiveness');
ok('bucket: 经济 → 经济类', buckets.find(c=>c.name==='经济').indicators.some(i=>i.id==='a'));
ok('bucket: 政治 → 政治法律类', buckets.find(c=>c.name==='政治法律').indicators.some(i=>i.id==='c'));
ok('bucket: unmatched → first category', buckets[0].indicators.some(i=>i.id==='b'));
ok('bucket: weights normalized within category',
  buckets.every(c => Math.abs(c.indicators.reduce((s,i)=>s+i.weight,0) - (c.indicators.length?1:0)) < 0.001));

// selectedTiers: new schema + legacy fallback
d2.retained = [{id:'m1', name:'新加坡'}, {id:'m2', name:'吉隆坡'}, {id:'m3', name:'雅加达'}];
d2.decision.tier1.marketId = 'm1';
d2.decision.tier2.marketIds = ['m2'];
let tiers = sandbox.Work2.selectedTiers();
ok('selectedTiers v2: tier1 name', tiers.v === 2 && tiers.tier1.name === '新加坡');
ok('selectedTiers v2: tier2 list', tiers.tier2.length === 1 && tiers.tier2[0].name === '吉隆坡');
// legacy fallback
d2.decision.tier1.marketId = null;
d2.matrix = { selectedMarketId:'m3', xCut:null, yCut:null, notes:'' };
tiers = sandbox.Work2.selectedTiers();
ok('selectedTiers legacy fallback', tiers.v === 1 && tiers.tier1.name === '雅加达');

// computeMatrix weighted scoring
d2.decision.tier1.marketId = null;
d2.scoring = {};
const inds2 = sandbox.Work2.allIndicators();
d2.retained.forEach(m=>{
  d2.scoring[m.id] = {};
  inds2.forEach(i=>{ d2.scoring[m.id][i.id] = {score: m.id==='m1'?8:4, evidence:'e', url:'', source:'ai'}; });
});
const pts2 = sandbox.Work2.computeMatrix();
ok('computeMatrix: uniform weights → mean score',
  Math.abs(pts2.find(p=>p.id==='m1').y - 8) < 0.01 && Math.abs(pts2.find(p=>p.id==='m2').x - 4) < 0.01);

// convergeWeights pure function
const personas = [
  { ratings: { attractiveness: {a1:0.8, a2:0.2}, competitiveness: {c1:1} } },
  { ratings: { attractiveness: {a1:0.4, a2:0.6}, competitiveness: {c1:1} } }
];
const fakeInds = [
  {id:'a1', axis:'attractiveness'}, {id:'a2', axis:'attractiveness'},
  {id:'c1', axis:'competitiveness'}
];
const conv = sandbox.Work2.convergeWeights(personas, fakeInds);
ok('convergeWeights: mean + normalize',
  Math.abs(conv.attractiveness.a1 - 0.6) < 0.001 && Math.abs(conv.attractiveness.a2 - 0.4) < 0.001);
ok('convergeWeights: axis sums to 1',
  Math.abs(Object.values(conv.attractiveness).reduce((a,b)=>a+b,0) - 1) < 0.001 &&
  Math.abs(Object.values(conv.competitiveness).reduce((a,b)=>a+b,0) - 1) < 0.001);

// syncTiers: changing tier1 moves old tier1 to tier2
d2.decision.tier1.marketId = 'm1';
d2.decision.tier2.marketIds = ['m2'];
d2.decision.tier3.marketIds = [];
sandbox.Work2.syncTiers('m3', 'm1');
ok('syncTiers: new tier1 removed from tier2/3',
  !d2.decision.tier2.marketIds.includes('m3') && !d2.decision.tier3.marketIds.includes('m3'));
ok('syncTiers: old tier1 demoted to tier2', d2.decision.tier2.marketIds.includes('m1'));

// exportMd 6-section structure
d2.candidates = [{id:'c1', name:'候选A', reason:'r'}];
d2.screening.criteria = [{id:'cr1', name:'标准A', source:'src'}];
d2.decision.tier1 = { marketId:'m1', rationale:'why', resourcesPct:80, milestones:['ms1'], reEvalTrigger:'trig' };
const md2 = sandbox.Work2.exportMd();
ok('exportMd contains 6 sections',
  ['### 1. 候选市场清单','### 2. 筛选标准','### 3. 保留市场','### 4. 指标体系与权重','### 5. 评分与矩阵','### 6. 三档决策'].every(h => md2.includes(h)));

/* ---------- Work 3 six-step ---------- */
ok('Work3 has 6 steps', sandbox.Work3.steps.length === 6 &&
  sandbox.Work3.steps.map(s=>s.id).join(',') === 'scenarios,mining,candidates,matrix,proposition,identity');

const d3 = sandbox.state.work3;
ok('Work3 default: scenarios empty, candidates 5 blanks',
  d3.scenarios.length === 0 && d3.candidates.length === 5);
ok('Work3 default: identity object',
  d3.identity && d3.identity.mbti === '' && Array.isArray(d3.identity.sloganOptions));
ok('Work3 default: proposition has no slogan fields',
  !('chosenSlogan' in d3.proposition) && !('mbti' in d3.proposition));

// migrateWork3: old proposition (with slogan/mbti) → identity
const oldWork3 = {
  context: { sbuName:'x', targetMarket:'y', personas:[], hasSurvey:false },
  mining: { documents:[], topics:[], painMap:[{id:'p1', pain:'痛', type:'痛点'}] },
  candidates: [{id:'c1', name:'卖点', selected:true}],
  proposition: {
    coreValueIds:['c1'], alternatives:[], chosenValueText:'主张',
    positioning:{brand:'b',audience:'a',coreValue:'c',category:'cat'},
    positioningStatement:'sentence',
    sloganOptions:['s1','s2'], chosenSlogan:'s1', mbti:'ENFP', personalityTraits:['t1']
  }
};
const mig3 = sandbox.Work3.migrateWork3(oldWork3);
ok('migrate3: identity ← proposition', mig3.identity.mbti === 'ENFP' && mig3.identity.chosenSlogan === 's1' && mig3.identity.personalityTraits[0] === 't1');
ok('migrate3: proposition cleaned', !('mbti' in mig3.proposition) && !('chosenSlogan' in mig3.proposition));
ok('migrate3: painMap/candidates get scenarioId', mig3.mining.painMap[0].scenarioId === '' && mig3.candidates[0].scenarioId === '');
ok('migrate3: idempotent', (()=>{ const again = sandbox.Work3.migrateWork3(mig3); return again.identity.mbti === 'ENFP'; })());

// syncContext reads work2 tier1/tier2 via selectedTiers
sandbox.state.work1.sbu.name = '测试SBU';
sandbox.state.work1.personas = [{id:'p1', name:'画像1', painPoints:'痛', values:[], quote:'', region:'R'}];
d2.decision.tier1 = { marketId:'m1', rationale:'why', resourcesPct:80, milestones:[], reEvalTrigger:'' };
d2.decision.tier2 = { marketIds:['m2'], observationMetrics:[], reEvalTrigger:'' };
d2.decision.tier3 = { marketIds:[], reEvalTrigger:'' };
sandbox.Work3.syncContext();
ok('syncContext: tier1 name', d3.context.targetMarket === '新加坡');
ok('syncContext: tier2 list', d3.context.tier2.length === 1 && d3.context.tier2[0].name === '吉隆坡');
ok('syncContext: personas copied', d3.context.personas.length === 1);

// scenarioSelect / scenarioName helpers
d3.scenarios = [{id:'sc1', name:'母婴场景', selected:true}];
ok('Work3.scenarioName resolves', sandbox.Work3.scenarioName('sc1') === '母婴场景');
ok('Work3.scenarioName unknown → empty', sandbox.Work3.scenarioName('nope') === '');

// exportMd includes new sections
d3.proposition.chosenValueText = '价值主张X';
d3.identity.chosenSlogan = '口号X';
const md3 = sandbox.Work3.exportMd();
ok('Work3.exportMd includes scenarios + identity',
  md3.includes('### 2. 场景细分') && md3.includes('口号X') && md3.includes('### 7. 品牌人格与 Slogan'));

/* ---------- Work 4 ---------- */
ok('Work4 exposes renderTreemap', typeof sandbox.Work4.renderTreemap === 'function');
ok('Work4 steps no longer include summary（ADR 0008：末步 promotion 直连 Work5）', !sandbox.Work4.steps.some(s=>s.id==='summary') && sandbox.Work4.steps.length === 5);

/* ---------- Work 5 ---------- */
ok('Work5._tier1Name via selectedTiers', sandbox.Work5._tier1Name() === '新加坡');

console.log(`\nTotal: ${pass} pass / ${fail} fail`);
process.exit(fail ? 1 : 0);
