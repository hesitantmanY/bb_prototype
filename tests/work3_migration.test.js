/* Node test: Work 3 six-step migration + Work 2 tier1/tier2 read rules.
   Run: node tests/work3_migration.test.js
*/
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.join(__dirname, '..', 'docs');
const sandbox = {
  console, setTimeout, clearTimeout, Date, JSON, Math, Object, Array, String, Number, Boolean,
  document: { body: { dataset: {} }, querySelector: () => null },
  el: function(tag, attrs, ...children){
    return { tag, attrs: attrs||{}, children, appendChild(){ return this; }, addEventListener(){ return this; }, querySelector(){ return null; } };
  },
  uid: (p='id') => p + '_' + Math.random().toString(36).slice(2, 9),
  mean: a => a.length ? a.reduce((x,y)=>x+y,0)/a.length : 0,
  median: a => { if(!a.length) return 0; const s=a.slice().sort((x,y)=>x-y); const m=Math.floor(s.length/2); return s.length%2?s[m]:(s[m-1]+s[m])/2; },
  clamp: (v,lo,hi) => Math.max(lo, Math.min(hi, v)),
  autosave: () => {},
  backendOnline: false,
  state: null,
  Work1: {}, Work2: {}, Work3: {}, UI: {}, App: {}, Runner: {}, API: {}
};
sandbox.window = sandbox;
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(path.join(root, 'workshop2.js'), 'utf8'), sandbox, {filename:'workshop2.js'});
vm.runInContext(fs.readFileSync(path.join(root, 'workshop3.js'), 'utf8'), sandbox, {filename:'workshop3.js'});
const W2 = sandbox.Work2, W3 = sandbox.Work3;

let pass=0, fail=0;
function ok(name, cond, detail){
  if(cond){ pass++; console.log('PASS ' + name); }
  else { fail++; console.log('FAIL ' + name + (detail? ' — ' + detail : '')); }
}

// ---- migrateWork3: old work3 (identity inside proposition, no scenarios) ----
const old3 = {
  context: { sbuName:'旧SBU', targetMarket:'旧市场', personas:[], hasSurvey:false },
  mining: {
    documents:['d1'], topics:[{id:0,label:'主题A'}], wordFreqTop:[], stats:null,
    painMap:[{id:'p1', pain:'痛点1', evidence:'e', frequency:'高', linkedNeeds:[], type:'痛点'}]
  },
  candidates: [
    {id:'c1', name:'卖点1', pain:'痛点1', description:'d', evidence:'e', selected:true, desirabilityScores:{}},
    {id:'c2', name:'卖点2', pain:'痛点1', description:'d', evidence:'e', selected:false, desirabilityScores:{}}
  ],
  dimensions: { desirability:[], implementability:[] },
  matrix: { showSector:true, sectorAngle:90, sectorRadius:12, xCut:null, yCut:null, manualSelected:[] },
  migration: { analyses:[] },
  proposition: {
    coreValueIds:['c1'], alternatives:[{id:'a1',text:'主张备选'}], chosenValueText:'选定主张',
    positioning:{brand:'B',audience:'A',coreValue:'C',category:'K'},
    positioningStatement:'定位句。',
    sloganOptions:['s1','s2','s3'], chosenSlogan:'s2',
    mbti:'ISTJ', personalityTraits:['严谨','可靠']
  }
};
const m3 = W3.migrateWork3(JSON.parse(JSON.stringify(old3)));

ok('migrate3: identity created with mbti/traits/slogans',
  m3.identity.mbti === 'ISTJ' &&
  m3.identity.personalityTraits.join(',') === '严谨,可靠' &&
  m3.identity.sloganOptions.length === 3 && m3.identity.chosenSlogan === 's2');
ok('migrate3: proposition stripped of identity fields',
  !('mbti' in m3.proposition) && !('personalityTraits' in m3.proposition) &&
  !('sloganOptions' in m3.proposition) && !('chosenSlogan' in m3.proposition));
ok('migrate3: proposition core fields kept',
  m3.proposition.chosenValueText === '选定主张' && m3.proposition.positioningStatement === '定位句。');
ok('migrate3: painMap entries gain scenarioId', m3.mining.painMap.every(p => p.scenarioId === ''));
ok('migrate3: candidates gain scenarioId', m3.candidates.every(c => c.scenarioId === ''));
ok('migrate3: idempotent + non-destructive',
  (()=>{ const again = W3.migrateWork3(m3); return again.identity.mbti === 'ISTJ' && again.proposition.chosenValueText === '选定主张'; })());

// ---- Work 2 read rules: new schema (tier1/tier2) ----
sandbox.state = {
  work1: {
    sbu:{ name:'S', summary:'摘要' }, personas:[{id:'p1', name:'画像', painPoints:'痛', values:[], quote:'', region:'R'}],
    values:{ chosenFunctional:'F', chosenEmotional:'E', chosenSocial:'S' },
    survey:{ responses:[{personaId:'p1', answers:[]}] }, scenarios: []
  },
  work2: W2.defaultData(),
  work3: W3.defaultData()
};
const w2 = sandbox.state.work2;
w2.retained = [{id:'m1', name:'新加坡'}, {id:'m2', name:'吉隆坡'}, {id:'m3', name:'雅加达'}];
w2.decision.tier1 = { marketId:'m1', rationale:'枢纽优势', resourcesPct:80, milestones:[], reEvalTrigger:'' };
w2.decision.tier2 = { marketIds:['m2','m3'], observationMetrics:[], reEvalTrigger:'' };

let tiers = W2.selectedTiers();
ok('tiers v2: tier1 resolved', tiers.v === 2 && tiers.tier1.marketId === 'm1' && tiers.tier1.name === '新加坡' && tiers.tier1.rationale === '枢纽优势');
ok('tiers v2: tier2 list resolved', tiers.tier2.length === 2 && tiers.tier2[0].name === '吉隆坡');

// Work 3 syncContext picks it up
W3.syncContext();
const c3 = sandbox.state.work3.context;
ok('syncContext: targetMarket = tier1 name', c3.targetMarket === '新加坡');
ok('syncContext: targetMarketReason = tier1 rationale', c3.targetMarketReason === '枢纽优势');
ok('syncContext: tier2 copied', c3.tier2.length === 2);
ok('syncContext: hasSurvey detected', c3.hasSurvey === true);
ok('syncContext: valueFramework from work1', c3.valueFramework.length === 3);

// ---- Work 2 read rules: legacy fallback (matrix.selectedMarketId + markets) ----
const w2legacy = {
  markets: [{id:'x1', name:'旧市场A', region:'R'}, {id:'x2', name:'旧市场B'}],
  matrix: { selectedMarketId:'x2', xCut:null, yCut:null, notes:'' },
  decision: { rationale:'旧理由', sequence:'', risks:[], nextSteps:'' }
};
sandbox.state.work2 = w2legacy;
tiers = W2.selectedTiers();
ok('tiers legacy: fallback to selectedMarketId', tiers.v === 1 && tiers.tier1.name === '旧市场B');
ok('tiers legacy: rationale from old decision', tiers.tier1.rationale === '旧理由');
ok('tiers legacy: tier2 empty', tiers.tier2.length === 0);

W3.syncContext();
ok('syncContext legacy: targetMarket from fallback', sandbox.state.work3.context.targetMarket === '旧市场B');

// ---- empty work2 → v0 ----
sandbox.state.work2 = W2.defaultData();
tiers = W2.selectedTiers();
ok('tiers empty: v0 with null tier1', tiers.v === 0 && tiers.tier1 === null);

console.log(`\n${pass} pass / ${fail} fail`);
process.exit(fail ? 1 : 0);
