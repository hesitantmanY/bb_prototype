/* Node test: 切分线唯一出口 + 象限判定（2026-09-01 grilling，ADR 0010）。

   事故：旧默认切线 = 中位数，3 点场景切线必然穿过中间市场的圆心，
   `>=` 平局裁决把荷兰静默加冕成「明星」——表格判明星、图上点压在
   交叉点上看不出。共识：留空 → 区间中点 (min+max)/2；手动值优先；
   n<2 不判象限；tier1 与象限解绑。

   Run: node tests/work2_matrix_cuts.test.js
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

let pass=0, fail=0;
function ok(name, cond, detail){
  if(cond){ pass++; console.log('PASS ' + name); }
  else { fail++; console.log('FAIL ' + name + (detail? ' — ' + detail : '')); }
}

/* 每轴单指标（catWeight 1 × weight 1 → 归一化后有效权重 1），
   加权均值 = 该指标打分，坐标可控。 */
function mkState(markets){
  const w2 = W2.defaultData();
  w2.attractiveness = { categories: [{ id:'cA', name:'经济', weight:1,
    indicators: [{ id:'iA', name:'att', rubric:{high:'',mid:'',low:''}, weight:1, support:0, source:'user' }] }] };
  w2.competitiveness = { categories: [{ id:'cC', name:'市场信息', weight:1,
    indicators: [{ id:'iC', name:'comp', rubric:{high:'',mid:'',low:''}, weight:1, support:0, source:'user' }] }] };
  w2.retained = markets.map(([name, att, comp]) => ({ id:'m_'+name, name }));
  markets.forEach(([name, att, comp]) => {
    w2.scoring['m_'+name] = { iA: {score:att, evidence:'', url:'', source:'user'},
                              iC: {score:comp, evidence:'', url:'', source:'user'} };
  });
  return w2;
}

// —— 真实案例形状（德国/荷兰/瑞典，2026-09-01 荷兰事故回归）——
sandbox.state = { work2: mkState([['德国',8,3.9],['荷兰',7.5,4.5],['瑞典',7.4,4.6]]) };
let cuts = W2.matrixCuts();
ok('auto cut = interval midpoint (y)', Math.abs(cuts.yCut - (8+7.4)/2) < 1e-9, String(cuts.yCut));
ok('auto cut = interval midpoint (x)', Math.abs(cuts.xCut - (3.9+4.6)/2) < 1e-9, String(cuts.xCut));
ok('no phantom star: 荷兰 → 产能（旧中位数口径下靠双平局判明星）',
  W2.quadrant(4.5, 7.5) === '产能');
ok('德国 → 潜力', W2.quadrant(3.9, 8) === '潜力');
ok('瑞典 → 产能', W2.quadrant(4.6, 7.4) === '产能');
ok('no point sits on auto cut in this dataset',
  [ [8,3.9],[7.5,4.5],[7.4,4.6] ].every(([y,x]) => y!==cuts.yCut && x!==cuts.xCut));

// —— 平局规则显式化：切线穿过点时 >= 归高（规则保留，不再被默认切线触发）——
sandbox.state = { work2: mkState([['甲',2,2],['乙',4,4],['丙',6,6]]) };
ok('on-cut point counts high on both axes (>= rule kept)',
  W2.quadrant(4, 4) === '明星');

// —— 手动切分优先 ——
sandbox.state = { work2: mkState([['德国',8,3.9],['荷兰',7.5,4.5],['瑞典',7.4,4.6]]) };
sandbox.state.work2.matrix.xCut = 5;
sandbox.state.work2.matrix.yCut = 8.5;
cuts = W2.matrixCuts();
ok('manual cut overrides auto', cuts.xCut === 5 && cuts.yCut === 8.5);
ok('manual cuts reclassify accordingly', W2.quadrant(4.5, 7.5) === '双低');

// —— n<2 边界 ——
sandbox.state = { work2: mkState([['独苗',7,7]]) };
cuts = W2.matrixCuts();
ok('n=1: no auto cuts', cuts.xCut === null && cuts.yCut === null);
ok('n=1: quadrant is —', W2.quadrant(7, 7) === '—');

sandbox.state = { work2: W2.defaultData() };  // 0 保留市场
cuts = W2.matrixCuts();
ok('n=0: no auto cuts, quadrant —',
  cuts.xCut === null && cuts.yCut === null && W2.quadrant(5, 5) === '—');

console.log(`\n${pass} pass / ${fail} fail`);
process.exit(fail ? 1 : 0);
