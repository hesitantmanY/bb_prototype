/* Node test: Work2 主流水线单元间链式传参（2026-09-01）。
   现象：runFrameworkPipeline 的 mk() 在点击时就把 instruction 拼成字符串冻结，
   轮到「1.3 应用筛选」执行时，1.1/1.2 刚写入 state 的候选/标准不在提示词里
   （点击时是空清单 → AI 从空清单幻觉出候选之外的市场：墨西哥/哥斯达黎加/巴拿马）。
   修复：instruction 支持函数，buildPrompt 执行时才读 state。

   Run: node tests/work2_pipeline_chain.test.js
*/
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.join(__dirname, '..', 'docs');
let capturedUnits = null;
const sandbox = {
  console, setTimeout, clearTimeout, Date, JSON, Math, Object, Array, String, Number, Boolean,
  document: { body: { dataset: {} }, querySelector: () => null },
  uid: (p='id') => p + '_' + Math.random().toString(36).slice(2, 9),
  clamp: (v,lo,hi) => Math.max(lo, Math.min(hi, v)),
  median: a => 0, mean: a => 0,
  autosave: () => {},
  showToast: () => {},
  el: (tag, attrs, ...children) => ({
    tag, attrs: attrs || {}, style: {}, dataset: {},
    appendChild(){}, addEventListener(){}, classList:{add(){},remove(){},toggle(){},contains(){return false;}}
  }),
  state: null,
  Work2: {},
  UI: {}, App: {}, Runner: {},
  AiContext: {
    mountSettings: () => ({ current: () => ({ sections: ['sbu'] }) }),
    buildPrompt: ({system, instruction}) => [{role:'system',content:system},{role:'user',content:String(instruction)}],
    fewShotText: () => ''
  },
  API: { aiPipeline: opts => { capturedUnits = opts.units; } }
};
sandbox.window = sandbox;
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(path.join(root, 'workshop2.js'), 'utf8'), sandbox, {filename:'workshop2.js'});
const W2 = sandbox.Work2;
sandbox.state = {
  work1: { sbu: { name: '智能温度控制器' }, personas: [] },
  work2: W2.defaultData()
};
sandbox.state.work2._pipeDone = [];

let pass=0, fail=0;
function ok(name, cond, detail){
  if(cond){ pass++; console.log('PASS ' + name); }
  else { fail++; console.log('FAIL ' + name + (detail? ' — ' + detail : '')); }
}

// 启动流水线（此刻 candidates/criteria 为空）
W2.runFrameworkPipeline({addEventListener(){}}, {}, {});
ok('pipeline captured 4 units', Array.isArray(capturedUnits) && capturedUnits.length === 4);

// 模拟串行执行：单元 1（候选）和 2（标准）已写回 state
capturedUnits[0].onResult({ candidates: [
  {name:'英国', reason:'r1'}, {name:'德国', reason:'r2'}, {name:'日本', reason:'r3'}
]});
capturedUnits[1].onResult({ criteria: [{name:'住宅电价高于全美均值', source:'EIA'}] });
ok('unit1 wrote candidates', sandbox.state.work2.candidates.length === 3);
ok('unit2 wrote criteria', sandbox.state.work2.screening.criteria.length === 1);

// 单元 3（应用筛选）的提示词必须包含前序单元刚写入的数据
const u3prompt = JSON.stringify(capturedUnits[2].buildPrompt());
ok('unit3 prompt contains fresh candidates', u3prompt.includes('英国') && u3prompt.includes('德国'),
  'prompt: ' + u3prompt.slice(0, 200));
ok('unit3 prompt contains fresh criteria', u3prompt.includes('住宅电价高于全美均值'));
// 2026-09-01：region/population/gdpPerCapita 不得留空——空串占位示例会被模型照抄成空值
ok('unit3 prompt demands filled region/population/gdp', u3prompt.includes('不得留空'));

console.log(fail ? `\n${fail} FAILED` : `\nall ${pass} passed`);
process.exit(fail ? 1 : 0);
