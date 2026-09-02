/* Node test: Work 2 schema v1 → v2 migration (docs/specs/work2/work2.md).
   Run: node tests/work2_migration.test.js
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

// ---- v1 fixture (旧 7 步版数据) ----
const v1 = {
  scope: { question:'选哪 3 国试点', timeframe:'12 个月', constraints:'预算有限', candidateCount:4 },
  attractiveness: { indicators: [
    {id:'a1', name:'经济规模与增长', rubric:{high:'大',mid:'中',low:'小'}, weight:0.4, support:5, source:'delphi'},
    {id:'a2', name:'政策法规稳定', rubric:{high:'稳',mid:'一般',low:'乱'}, weight:0.3, support:5, source:'delphi'},
    {id:'a3', name:'文化匹配', rubric:{high:'近',mid:'中',low:'远'}, weight:0.3, support:5, source:'delphi'}
  ]},
  competitiveness: { indicators: [
    {id:'b1', name:'渠道可达', rubric:{high:'',mid:'',low:''}, weight:0.6, support:5, source:'delphi'},
    {id:'b2', name:'认证可复用', rubric:{high:'',mid:'',low:''}, weight:0.4, support:5, source:'delphi'}
  ]},
  delphi: {
    panel: [], round1: null, round2: null, synthesis: null,
    finalSynthesis: '两轮共识', weights: { attractiveness:{a1:0.4,a2:0.3,a3:0.3}, competitiveness:{b1:0.6,b2:0.4} },
    status: 'done'
  },
  markets: [
    {id:'m1', name:'新加坡', region:'东南亚', population:'590万', gdpPerCapita:'$82k', notes:'金融中心', scores:{a1:8}},
    {id:'m2', name:'吉隆坡', region:'东南亚', population:'180万', gdpPerCapita:'$12k', notes:'华人多', scores:{}},
    {id:'m3', name:'雅加达', region:'东南亚', population:'1050万', gdpPerCapita:'$4.9k', notes:'体量大', scores:{}},
    {id:'m4', name:'曼谷', region:'东南亚', population:'1050万', gdpPerCapita:'$7k', notes:'备选', scores:{}},
    {id:'m5', name:'马尼拉', region:'东南亚', population:'1400万', gdpPerCapita:'$3.5k', notes:'备选', scores:{}}
  ],
  matrix: { selectedMarketId:'m1', xCut:5, yCut:6, notes:'note' },
  decision: { rationale:'新加坡作为试点', sequence:'先新加坡后吉隆坡', risks:['汇率'], nextSteps:'90 天内注册公司' }
};

const m = W2.migrateWork2(JSON.parse(JSON.stringify(v1)));

ok('meta.schemaVersion = 2', m.meta.schemaVersion === 2);
ok('retained = first 3 markets (ids kept)',
  m.retained.length === 3 && m.retained.map(x=>x.id).join(',') === 'm1,m2,m3');
ok('candidates = markets.slice(3) with reason from notes',
  m.candidates.length === 2 && m.candidates[0].name === '曼谷' && m.candidates[0].reason === '备选' && m.candidates[0].source === 'user');
ok('screening.criteria initialized empty', Array.isArray(m.screening.criteria) && m.screening.criteria.length === 0);

const aCats = m.attractiveness.categories;
const cCats = m.competitiveness.categories;
ok('attractiveness: 4 default categories', aCats.length === 4 && aCats.map(c=>c.name).join(',') === '经济,政治法律,社会文化,风险');
ok('competitiveness: 4 default categories', cCats.length === 4 && cCats.map(c=>c.name).join(',') === '市场信息,营销渠道,认证合规,产品品牌');
ok('indicators fuzzy-bucketed (经济规模→经济, 政策法规→政治法律, 文化匹配→社会文化)',
  aCats.find(c=>c.name==='经济').indicators.some(i=>i.id==='a1') &&
  aCats.find(c=>c.name==='政治法律').indicators.some(i=>i.id==='a2') &&
  aCats.find(c=>c.name==='社会文化').indicators.some(i=>i.id==='a3'));
ok('competitiveness bucketed (渠道可达→营销渠道, 认证可复用→认证合规)',
  cCats.find(c=>c.name==='营销渠道').indicators.some(i=>i.id==='b1') &&
  cCats.find(c=>c.name==='认证合规').indicators.some(i=>i.id==='b2'));
ok('rubric preserved on migrated indicators',
  aCats.find(c=>c.name==='经济').indicators.find(i=>i.id==='a1').rubric.high === '大');

ok('delphi legacy fields kept (compat)', m.delphi.weights && m.delphi.finalSynthesis === '两轮共识');
ok('delphi.finalWeights ported from old weights', m.delphi.finalWeights && m.delphi.finalWeights.attractiveness.a1 === 0.4);
ok('delphi.status done', m.delphi.status === 'done');

ok('matrix cuts/notes preserved', m.matrix.xCut === 5 && m.matrix.yCut === 6 && m.matrix.notes === 'note');
ok('decision.tier1 ← matrix.selectedMarketId + rationale',
  m.decision.tier1.marketId === 'm1' && m.decision.tier1.rationale === '新加坡作为试点');
ok('decision.tier1.milestones ← nextSteps', m.decision.tier1.milestones[0] === '90 天内注册公司');
ok('decision.tier1.resourcesPct default 80', m.decision.tier1.resourcesPct === 80);
ok('tier2/tier3 initialized empty', m.decision.tier2.marketIds.length === 0 && m.decision.tier3.marketIds.length === 0);

ok('old keys removed (markets/scope)', !('markets' in m) && !('scope' in m));
ok('migration idempotent (v2 in → same out)', W2.migrateWork2(m) === m);
ok('null-safe', W2.migrateWork2(null) === null);

// 回归：mergeWithDefaults 会把新默认值的 meta.schemaVersion=2 混入旧数据，
// 迁移判定必须看旧 schema 特征而不是 meta。
const mergedLikeV2 = JSON.parse(JSON.stringify(v1));
mergedLikeV2.meta = { schemaVersion: 2, work1Linked: false };
const m2 = W2.migrateWork2(mergedLikeV2);
ok('merged-with-defaults old data still migrates',
  m2.retained.length === 3 && m2.attractiveness.categories.length === 4 && !('markets' in m2));

/* 2026-09-01 回归：migrateDelphiWeights 曾对 finalWeights:null `return false`、
   成功时 `return ok`——SchemaMigrate 旧契约 `out !== undefined` 会把 work2
   整片替换成布尔 → 每次刷新 healWork2 弹「数据已损坏」并用空白模板覆盖存档。
   契约：迁移只能原地改（JSON 对比检测）或返回替换对象。 */
ok('migrateDelphiWeights(finalWeights:null) returns undefined',
  W2.migrateDelphiWeights({ delphi: { finalWeights: null } }) === undefined);
ok('migrateDelphiWeights(no delphi) returns undefined',
  W2.migrateDelphiWeights({}) === undefined);
{
  const w2 = W2.defaultData();
  w2.delphi.finalWeights = { attractiveness: {}, competitiveness: {} };
  const ret = W2.migrateDelphiWeights(w2);
  ok('migrateDelphiWeights(converged) returns undefined, mutates in place',
    ret === undefined && w2.delphi.finalWeights === null);
}

/* 2026-09-01：「AI 评分」→「重新生成」按钮语义。已生成（任一格有分）→ 重新生成。 */
sandbox.state = { work2: W2.defaultData() };
ok('hasAnyScore false on default (no scoring)',
  W2.hasAnyScore() === false);
sandbox.state.work2.scoring['m1'] = { i1: { score: null, evidence: '', url: '' } };
ok('hasAnyScore false when cells exist but no score',
  W2.hasAnyScore() === false);
sandbox.state.work2.scoring['m1'].i1.score = 8;
ok('hasAnyScore true once any score present',
  W2.hasAnyScore() === true);
sandbox.state.work2.scoring['m2'] = null;  // 稀疏/脏结构不炸
ok('hasAnyScore tolerates null market buckets',
  W2.hasAnyScore() === true);

console.log(`\n${pass} pass / ${fail} fail`);
process.exit(fail ? 1 : 0);
