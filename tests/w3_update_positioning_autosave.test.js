/* Node test: 渲染路径不应把页面置为"未保存"（BIZ15，2026-09-07）

   用户反馈：刷新后自动变成"未保存"态。Playwright 取证确认根因：
   Work3.render.proposition 在每次 renderAll（页面加载必经）都会调用
   Work3.updatePositioning()，而它无条件 autosave()（= markDirty），
   即使派生句 positioningStatement 没有任何变化 → 每次刷新都置 dirty。

   修复契约：
   1. updatePositioning 只在 positioningStatement 真的变化时才写 state + autosave
   2. 句子不变时重复调用（渲染路径）不产生 autosave
   3. UI 预览（#posPreview）每次仍更新（保持渲染语义）

   Run: node tests/w3_update_positioning_autosave.test.js
*/
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

let pass = 0, fail = 0;
function ok(name, cond, detail){
  if(cond){ pass++; console.log('PASS ' + name); }
  else { fail++; console.log('FAIL ' + name + (detail ? ' — ' + String(detail).slice(0,200) : '')); }
}

const root = path.join(__dirname, '..', 'docs');
let autosaveCalls = 0;
const previewTexts = [];
const sandbox = {
  console, setTimeout, clearTimeout, Date, JSON, Math, Object, Array, String, Number, Boolean,
  document: {
    body: { dataset: {} },
    querySelector: () => null,
    getElementById: id => id === 'posPreview' ? { set textContent(v){ previewTexts.push(String(v)); } } : null
  },
  el(tag, attrs, ...children){
    return { tag, attrs: attrs||{}, children, appendChild(){ return this; }, addEventListener(){ return this; }, querySelector(){ return null; } };
  },
  uid: (p='id') => p + '_' + Math.random().toString(36).slice(2, 9),
  mean: a => a.length ? a.reduce((x,y)=>x+y,0)/a.length : 0,
  median: a => { if(!a.length) return 0; const s=a.slice().sort((x,y)=>x-y); const m=Math.floor(s.length/2); return s.length%2?s[m]:(s[m-1]+s[m])/2; },
  clamp: (v,lo,hi) => Math.max(lo, Math.min(hi, v)),
  autosave: () => { autosaveCalls++; },
  backendOnline: false,
  state: null,
  Work1: {}, Work2: {}, Work3: {}, UI: {}, App: {}, Runner: {}, API: {}
};
sandbox.window = sandbox;
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(path.join(root, 'workshop2.js'), 'utf8'), sandbox, {filename:'workshop2.js'});
vm.runInContext(fs.readFileSync(path.join(root, 'workshop3.js'), 'utf8'), sandbox, {filename:'workshop3.js'});
const W3 = sandbox.Work3;

function makeState(statement){
  return {
    work1: { sbu:{name:'SBU'} },
    work3: {
      proposition: {
        positioning: { brand:'品牌', audience:'客群', coreValue:'核心价值', category:'品类' },
        positioningStatement: statement
      },
      context:{}, mining:{}, candidates:[], dimensions:{desirability:[],implementability:[]}
    }
  };
}

// 场景 1：首次加载，server 已有相同派生句 → 渲染不应置脏
let st = makeState('品牌 是为 客群 提供 核心价值 的 品类。');
sandbox.state = st;
autosaveCalls = 0; previewTexts.length = 0;
W3.updatePositioning();
ok('句子未变时 updatePositioning 不 autosave', autosaveCalls === 0, 'calls=' + autosaveCalls);
ok('句子未变时 UI 预览仍更新', previewTexts.length === 1);
ok('positioningStatement 未被改写', st.work3.proposition.positioningStatement === '品牌 是为 客群 提供 核心价值 的 品类。');

// 场景 2：重复调用（renderAll 会多次进入渲染）依然不置脏
W3.updatePositioning();
W3.updatePositioning();
ok('重复渲染不产生 autosave', autosaveCalls === 0, 'calls=' + autosaveCalls);

// 场景 3：派生句真的变化（用户编辑了某个字段）→ 写 state + autosave
st.work3.proposition.positioning.brand = '新品牌';
autosaveCalls = 0;
W3.updatePositioning();
ok('句子变化时 autosave 1 次', autosaveCalls === 1, 'calls=' + autosaveCalls);
ok('句子变化时 positioningStatement 更新',
   st.work3.proposition.positioningStatement === '新品牌 是为 客群 提供 核心价值 的 品类。',
   st.work3.proposition.positioningStatement);

// 场景 4：变化后再渲染（新句子已持久化）不再置脏
autosaveCalls = 0;
W3.updatePositioning();
ok('变化后再次渲染不重复 autosave', autosaveCalls === 0, 'calls=' + autosaveCalls);

console.log('\n' + pass + ' pass / ' + fail + ' fail');
process.exit(fail ? 1 : 0);
