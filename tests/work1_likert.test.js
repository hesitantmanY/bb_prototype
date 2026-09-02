/* Node test: Work1 李克特统计走 LikertParse（2026-09-01 架构评审候选 1）。

   原实现 parseInt(value) 对 LLM 常见输出（"三" / " 4 "）静默丢值；
   接线 LikertParse 后容错解析，合法值统计不变，非法值仍丢弃。

   Run: node tests/work1_likert.test.js
*/
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.join(__dirname, '..', 'docs');
const LikertParse = require(path.join(root, 'lib', 'likert_parse.js'));

let pass = 0, fail = 0;
function ok(name, cond, detail){
  if(cond){ pass++; console.log('PASS ' + name); }
  else { fail++; console.log('FAIL ' + name + (detail ? ' — ' + detail : '')); }
}

function makeNode(tag, attrs, ...children){
  const node = { tag, attrs: attrs || {}, children, style: (attrs && attrs.style) || {} };
  node.appendChild = c => { node.children.push(c); return c; };
  node.addEventListener = () => node;
  node.querySelector = () => null;
  return node;
}

const sandbox = {
  console, setTimeout, clearTimeout, setInterval, clearInterval,
  Date, JSON, Math, Object, Array, String, Number, Boolean,
  document: {
    body: { dataset: {} },
    querySelector: () => null,
    getElementById: () => null,
    createElement: t => makeNode(t),
    head: { appendChild(){} }
  },
  el: makeNode,
  uid: (p='id') => p + '_' + Math.random().toString(36).slice(2, 9),
  mean: arr => arr.length ? arr.reduce((a,b)=>a+b,0)/arr.length : 0,
  sd: arr => {
    if(arr.length < 2) return 0;
    const m = arr.reduce((a,b)=>a+b,0)/arr.length;
    return Math.sqrt(arr.reduce((s,x)=>s+(x-m)*(x-m),0)/arr.length);
  },
  clamp: (v,lo,hi) => Math.max(lo, Math.min(hi,v)),
  esc: s => String(s==null?'':s),
  autosave: () => {},
  showToast: () => {},
  LikertParse,
  window: null
};
sandbox.UI = { demoNote: () => null, mvoCard: () => makeNode('div') };
sandbox.API = { callJson: async () => null, call: async () => '', extractJson: () => null };
sandbox.Runner = { start: () => null, signal: () => undefined };
sandbox.App = { updateSummary: () => {} };
sandbox.Work1 = {};  // 壳内全局先声明（同 random_example.test.js 约定）
vm.createContext(sandbox);

const code = fs.readFileSync(path.join(root, 'workshop1.js'), 'utf8');
vm.runInContext(code, sandbox, {filename: 'workshop1.js'});

sandbox.state = {
  meta: {},
  work1: sandbox.Work1.defaultData()
};
sandbox.state.work1.survey.questions = [
  { id: 'q1', type: 'likert', text: '满意度', anchors: ['很差','差','中','好','很好'] }
];
sandbox.state.work1.survey.responses = [
  { personaId: 'p1', answers: [{ questionId: 'q1', value: '三' }] },
  { personaId: 'p2', answers: [{ questionId: 'q1', value: ' 4 ' }] },
  { personaId: 'p3', answers: [{ questionId: 'q1', value: 3 }] },
  { personaId: 'p4', answers: [{ questionId: 'q1', value: '1-5的整数' }] }
];

sandbox.Work1.analyzeResponses();

const st = sandbox.state.work1.analysis.likertStats.q1;
ok('tolerant values parsed (三 / " 4 " / 3 → 3,4,3)', JSON.stringify(st.dist) === JSON.stringify([0,0,2,1,0]));
ok('invalid value still dropped (n=3)', st.n === 3);
ok('mean correct (3+4+3)/3', Math.abs(st.mean - (10/3)) < 1e-9);

console.log(`\n${pass} pass / ${fail} fail`);
process.exit(fail === 0 ? 0 : 1);
