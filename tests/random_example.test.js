/* Smoke test: load workshop 1-5 in a stub env, call each apply with sample[0],
   verify state mutation + no exceptions.
   Covers Work 1 (SBU), Work 2/3/4 (random example samples), Work 5 (chain trigger).
   Run: node tests/random_example.test.js
*/
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = '/Users/hesitantmany/vs project/building brand/Brand-building/docs';
const files = ['workshop1.js', 'workshop2.js', 'workshop3.js', 'workshop4.js', 'workshop5.js'];

// Minimal browser-like env
const sandbox = {
  console,
  window: {},
  setTimeout, clearTimeout, setInterval, clearInterval,
  Date, JSON, Math, Object, Array, String, Number, Boolean,
  document: { body: { dataset: {} } },
  // el helper used by workshops (just builds an object with .appendChild/.querySelector etc.)
  el: function(tag, attrs, ...children){
    const node = {
      tag, attrs: attrs || {},
      children,
      _text: null,
      style: (attrs && attrs.style) || {},
      class: (attrs && attrs.class) || '',
      appendChild(c){ this.children.push(c); return c; },
      addEventListener(ev, fn){ this._events = this._events || {}; (this._events[ev] = this._events[ev] || []).push(fn); return this; },
      querySelector(){ return null; },
      set innerHTML(v){ this._innerHTML = v; this.children = []; },
      get innerHTML(){ return this._innerHTML || ''; },
      set textContent(v){ this._text = v; },
      get textContent(){ return this._text; },
    };
    // Allow passing text as 3rd arg or nested
    if(children.length === 1 && typeof children[0] === 'string') node._text = children[0];
    return node;
  },
  // stubs for global functions referenced in workshops
  uid: (prefix='id') => prefix + '_' + Math.random().toString(36).slice(2, 9),
  mean: (arr) => arr.reduce((a,b)=>a+b, 0) / arr.length,
  sd: (arr) => {
    if(!arr.length) return 0;
    const m = arr.reduce((a,b)=>a+b, 0) / arr.length;
    return Math.sqrt(arr.reduce((s,x)=>s + (x-m)*(x-m), 0) / arr.length);
  },
  median: (arr) => { const s = arr.slice().sort((a,b)=>a-b); return s[Math.floor(s.length/2)]; },
  clamp: (v, lo, hi) => Math.max(lo, Math.min(hi, v)),
  state: {
    work1: { sbu: { name:'', threeQuestions: { customer:false, channel:false, brand:false } }, environment: { political:'' }, personas:[], values:{chosenFunctional:'',chosenEmotional:'',chosenSocial:'',rationale:''}, survey:{responses:[],n:0,questions:[]}, analysis:{insights:'',openThemes:{texts:[]}}, recommendations:{short:'',mid:'',long:'',risks:[]} },
    work2: { scope:{question:'',timeframe:'',constraints:'',candidateCount:4}, attractiveness:{indicators:[]}, competitiveness:{indicators:[]}, delphi:{panel:[]}, markets:[], matrix:{selectedMarketId:null,xCut:null,yCut:null,notes:''}, decision:{rationale:'',sequence:'',risks:[],nextSteps:''} },
    work3: { context:{sbuName:'',targetMarket:'',personas:[],hasSurvey:false}, mining:{documents:[],topics:[],wordFreqTop:[],stats:null,painMap:[]}, candidates:[], dimensions:{desirability:[],implementability:[]}, matrix:{showSector:true,sectorAngle:90,sectorRadius:12,xCut:null,yCut:null,manualSelected:[]}, migration:{analyses:[]}, proposition:{coreValueIds:[],alternatives:[],chosenValueText:'',positioning:{brand:'',audience:'',coreValue:'',category:''},positioningStatement:'',sloganOptions:[],chosenSlogan:'',mbti:'',personalityTraits:[]} },
    work4: { route:{scope:'',oemType:'',entryMode:'',light:[],politicalPower:''}, product:{name:'',description:'',coreDifferentiators:[],skus:[],aiResult:'',businessType:'physical'}, price:{strategy:'',strategyNote:'',tiers:[],promotions:[],aiResult:''}, place:{onlineSelf:[],onlineThird:[],offlineDirect:[],offlineDistrib:[],offlineRetail:[],keyPartners:[],structure:[],aiResult:''}, promotion:{advertising:[],pr:[],salesPromotion:[],crm:{},kolTiers:[],aiResult:'',theme:'',context:'',taboos:'',language:'',contentStrategy:''} }
  },
  // workshop namespaces must already exist; inject them
};
// Create Work1..4 namespaces
['Work1','Work2','Work3','Work4','Work5','UI','API','App','Runner','showToast'].forEach(n => { sandbox[n] = {}; });
sandbox.autosave = () => {};  // analyzeResponses / apply 路径会调用
sandbox.window = sandbox;  // so window.RandomExample works
vm.createContext(sandbox);

let pass=0, fail=0;
function ok(name, cond, detail){
  if(cond){ pass++; console.log('PASS ' + name); }
  else { fail++; console.log('FAIL ' + name + (detail? ' — ' + detail : '')); }
}

// Load each file
for(const f of files){
  const code = fs.readFileSync(path.join(root, f), 'utf8');
  try{ vm.runInContext(code, sandbox, {filename: f}); }
  catch(e){ console.log('LOAD ERR ' + f + ': ' + e.message); fail++; }
}

// 1. window.RandomExample
ok('window.RandomExample is defined', typeof sandbox.RandomExample === 'object' && typeof sandbox.RandomExample.mount === 'function');

// 2. Work1.SBU_SAMPLES exposed
ok('Work1.SBU_SAMPLES exposed', Array.isArray(sandbox.Work1.SBU_SAMPLES) && sandbox.Work1.SBU_SAMPLES.length >= 6);
ok('Work1.applySBU exposed', typeof sandbox.Work1.applySBU === 'function');

// 3. Apply Work 1 sample
try{ sandbox.Work1.applySBU(sandbox.Work1.SBU_SAMPLES[0]); ok('Work1.applySBU ran', sandbox.state.work1.sbu.name && sandbox.state.work1.sbu.name.length > 0); }
catch(e){ ok('Work1.applySBU ran', false, e.message); }

// 3b. Work 1 FULL sample (覆盖 8 个子 step)
ok('Work1.WORK1_FULL_SAMPLES exposed', Array.isArray(sandbox.Work1.WORK1_FULL_SAMPLES) && sandbox.Work1.WORK1_FULL_SAMPLES.length >= 2);
ok('Work1._applyWork1FullSample exposed', typeof sandbox.Work1._applyWork1FullSample === 'function');
try{
  sandbox.Work1._applyWork1FullSample(sandbox.Work1.WORK1_FULL_SAMPLES[0]);
  const d = sandbox.state.work1;
  ok('Work1 full: sbu.name filled', !!d.sbu.name);
  ok('Work1 full: environment.political', d.environment.political && d.environment.political.length > 5);
  ok('Work1 full: 5+ competitors', d.environment.competitors.length >= 5);
  ok('Work1 full: ourCapabilities 5 dims', !!(d.environment.ourCapabilities.delivery && d.environment.ourCapabilities.core));
  ok('Work1 full: 5 personas', d.personas.length === 5);
  ok('Work1 full: 3 scenarios', d.scenarios.length === 3);
  ok('Work1 full: 5 metrics dimensions', d.metrics.dimensions.length === 5);
  ok('Work1 full: 3 secondaries per dim', d.metrics.dimensions.every(dim => dim.secondaries.length === 3));
  ok('Work1 full: 10 likert questions', d.survey.questions.length === 10);
  ok('Work1 full: 10 responses (5p × 2n)', d.survey.responses.length === 10);
  ok('Work1 full: each response has 10 answers', d.survey.responses.every(r => r.answers.length === 10));
  // analyzeResponses 会基于 10 个 likert 题生成 10 个 indicatorMeans (而非 metrics 的 15 个二级)
  ok('Work1 full: 10 indicator means (from 10 likert)', d.analysis.indicatorMeans.length === 10);
  ok('Work1 full: likertStats filled (10 questions)', Object.keys(d.analysis.likertStats).length === 10);
  // backfillScores 会给 s1-s10 设 actual, s11-s15 仍是 null
  const s2Actuals = d.metrics.dimensions.flatMap(dim => dim.secondaries.map(s2 => s2.actual));
  ok('Work1 full: 10 s2.actual backfilled', s2Actuals.filter(v => v != null).length === 10);
  ok('Work1 full: values chosen set', !!(d.values.chosenFunctional && d.values.chosenEmotional && d.values.chosenSocial));
  ok('Work1 full: recommendations filled', !!(d.recommendations.short && d.recommendations.mid && d.recommendations.long));
  ok('Work1 full: 3+ risks', d.recommendations.risks.length >= 3);
  // 2nd sample (欧洲家居) sanity
  sandbox.Work1._applyWork1FullSample(sandbox.Work1.WORK1_FULL_SAMPLES[1]);
  const d2 = sandbox.state.work1;
  ok('Work1 full[2]: CASA scope=欧洲', d2.sbu.scope === '欧洲');
  ok('Work1 full[2]: 5 personas, names differ', d2.personas.length === 5 && d2.personas[0].id !== 'p1');
  ok('Work1 full[2]: metrics still 5 dim × 3', d2.metrics.dimensions.length === 5 && d2.metrics.dimensions.every(dim => dim.secondaries.length === 3));
}catch(e){ ok('Work1 full apply ran', false, e.message + '\n' + e.stack); }

// 4. Work 2 sample + apply
ok('Work2.WORK2_SAMPLES exposed', Array.isArray(sandbox.Work2.WORK2_SAMPLES) && sandbox.Work2.WORK2_SAMPLES.length >= 2);
ok('Work2._applyWork2Sample exposed', typeof sandbox.Work2._applyWork2Sample === 'function');
try{
  sandbox.Work2._applyWork2Sample(sandbox.Work2.WORK2_SAMPLES[0]);
  const d = sandbox.state.work2;
  ok('Work2 sample: scope filled', !!d.scope.question);
  ok('Work2 sample: 3+ markets', d.markets.length >= 3);
  ok('Work2 sample: a-indicators filled', d.attractiveness.indicators.length >= 3);
  ok('Work2 sample: c-indicators filled', d.competitiveness.indicators.length >= 3);
  ok('Work2 sample: matrix selectedMarketId set', !!d.matrix.selectedMarketId);
  ok('Work2 sample: decision filled', !!d.decision.rationale);
}catch(e){ ok('Work2 apply ran', false, e.message); }

// 5. Work 3
ok('Work3.WORK3_SAMPLES exposed', Array.isArray(sandbox.Work3.WORK3_SAMPLES) && sandbox.Work3.WORK3_SAMPLES.length >= 2);
ok('Work3._applyWork3Sample exposed', typeof sandbox.Work3._applyWork3Sample === 'function');
try{
  sandbox.Work3._applyWork3Sample(sandbox.Work3.WORK3_SAMPLES[0]);
  const d = sandbox.state.work3;
  ok('Work3 sample: 15+ documents', d.mining.documents.length >= 15);
  ok('Work3 sample: 3+ topics', d.mining.topics.length >= 3);
  ok('Work3 sample: 3+ pain points', d.mining.painMap.length >= 3);
  ok('Work3 sample: 3+ candidates', d.candidates.length >= 3);
  ok('Work3 sample: proposition chosenValueText', !!d.proposition.chosenValueText);
  ok('Work3 sample: positioning statement', !!d.proposition.positioningStatement);
  ok('Work3 sample: chosenSlogan', !!d.proposition.chosenSlogan);
}catch(e){ ok('Work3 apply ran', false, e.message); }

// 6. Work 4
ok('Work4.WORK4_SAMPLES exposed', Array.isArray(sandbox.Work4.WORK4_SAMPLES) && sandbox.Work4.WORK4_SAMPLES.length >= 2);
ok('Work4._applyWork4Sample exposed', typeof sandbox.Work4._applyWork4Sample === 'function');
try{
  sandbox.Work4._applyWork4Sample(sandbox.Work4.WORK4_SAMPLES[0]);
  const d = sandbox.state.work4;
  ok('Work4 sample: route oemType', !!d.route.oemType);
  ok('Work4 sample: product name', !!d.product.name);
  ok('Work4 sample: 5 SKUs', d.product.skus.length === 5);
  ok('Work4 sample: price strategy', !!d.price.strategy);
  ok('Work4 sample: 3+ price tiers', d.price.tiers.length >= 3);
  ok('Work4 sample: place structure tree', d.place.structure.length >= 1);
  ok('Work4 sample: promotion theme', !!d.promotion.theme);
  ok('Work4 sample: 3 KOL tiers', d.promotion.kolTiers.length >= 3);
}catch(e){ ok('Work4 apply ran', false, e.message); }

// 7. Work 5 button hooks
ok('Work5.randomExampleAll defined', typeof sandbox.Work5.randomExampleAll === 'function');
ok('Work5.aggregateAll defined', typeof sandbox.Work5.aggregateAll === 'function');

// 微笑曲线 SVG 渲染
ok('Work1.renderSmileCurve defined', typeof sandbox.Work1.renderSmileCurve === 'function');
try{
  const node = sandbox.Work1.renderSmileCurve();
  ok('Work1.renderSmileCurve returns element', !!node);
  ok('Work1.renderSmileCurve wraps SVG', typeof node.innerHTML === 'string' && node.innerHTML.indexOf('<svg') !== -1);
  ok('Work1.renderSmileCurve has 6 nodes', (node.innerHTML.match(/<circle/g) || []).length === 6);
  ok('Work1.renderSmileCurve has axis label', node.innerHTML.indexOf('SMILE CURVE') !== -1);
}catch(e){ ok('Work1.renderSmileCurve runs', false, e.message); }

console.log(`\nTotal: ${pass} pass / ${fail} fail`);
process.exit(fail ? 1 : 0);
