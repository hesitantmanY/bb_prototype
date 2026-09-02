/* Node test: work2 毒切片自愈（2026-09-01）。
   现象：state.work2 变成 false/非对象（重构期间中间版本代码写坏）后，
   work2 三个步骤 render 全崩（candidates.forEach / !mks.length /
   effectiveWeights 的 state.work2[axis]），goStep try/catch 吞掉 → 界面空白，
   自动保存把毒数据固化进 current.json 与快照。
   修复：App.healWork2 在 renderAll（所有 state 替换路径的必经点）把
   falsy / 非对象 / 数组的 work2 归位为 Work2.defaultData()。

   Run: node tests/work2_poison_heal.test.js
*/
'use strict';
const path = require('path');

let pass = 0, fail = 0;
function ok(name, cond, detail){
  if(cond){ pass++; console.log('PASS ' + name); }
  else { fail++; console.log('FAIL ' + name + (detail ? ' — ' + detail : '')); }
}

const DEFAULT_W2 = () => ({
  candidates: [], screening: { criteria: [] }, retained: [],
  attractiveness: { categories: [1, 2, 3, 4] },
  competitiveness: { categories: [1, 2, 3, 4] },
  scoring: {}, decision: { tier1: { marketId: null } }
});
global.Work2 = { defaultData: DEFAULT_W2 };
global.showToast = () => {};

const App = require(path.join(__dirname, '..', 'docs', 'lib', 'app.js'));

// false（实测毒值）→ 归位为空白模板
let st = { work2: false };
ok('heals work2:false', App.healWork2(st) === true && Array.isArray(st.work2.candidates));

// 其它 falsy / 非对象毒值
for(const poison of [null, undefined, 0, '', 'x', 42, []]){
  st = { work2: poison };
  const healed = App.healWork2(st);
  ok('heals work2:' + JSON.stringify(poison), healed === true && Array.isArray(st.work2.candidates));
}

// 健康 v2 对象原样通过（不换引用、不重建）
const good = DEFAULT_W2(); good.retained = [{ id: 'm1', name: '成都' }];
st = { work2: good };
ok('healthy work2 untouched', App.healWork2(st) === false && st.work2 === good);

// 幂等：治愈后再跑不再变更
ok('idempotent after heal', App.healWork2(st) === false);

console.log(fail ? `\n${fail} FAILED` : `\nall ${pass} passed`);
process.exit(fail ? 1 : 0);
