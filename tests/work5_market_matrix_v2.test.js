/* 回归测试（2026-09-01 修复）：真实 workshop2.js + workshop5.js 同沙箱，
   构造「真实完成」的 v2 Work2 state，断言 W5 3.1 矩阵块不出警告 + 决策卡显示市场名。 */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const root = path.join(__dirname, "..", "docs");

let matrixOpts = null;
function makeNode(tag){
  return {
    tagName:String(tag).toUpperCase(), nodeType:1, children:[], attrs:{}, style:{}, className:'',
    appendChild(c){ this.children.push(c); return c; },
    addEventListener(){}, setAttribute(){}, querySelector(){ return null; }, querySelectorAll(){ return []; },
    set innerHTML(v){ this._innerHTML=String(v); this.children=[]; },
    get innerHTML(){ return this._innerHTML||''; }
  };
}
const document = {
  createElement:t=>makeNode(t),
  createTextNode:s=>({nodeType:3,text:String(s),children:[]}),
  head:{appendChild(){}},
  getElementById:()=>null,
  querySelector:()=>null
};
const sandbox = {
  console, setTimeout, clearTimeout, Date, JSON, Math, Object, Array, String, Number, Boolean, Promise,
  document,
  el(tag, attrs={}, ...children){
    const e=document.createElement(tag);
    for(const [k,v] of Object.entries(attrs||{})){
      if(k==='class') e.className=v;
      else if(k.startsWith('on')&&typeof v==='function') e.addEventListener(k.slice(2),v);
      else if(k==='style'&&typeof v==='object') Object.assign(e.style,v);
      else if(v==null) continue;
      else e.setAttribute(k,v);
    }
    for(const c of children.flat()){ if(c==null||c===false) continue; e.appendChild(typeof c==='string'||typeof c==='number'?document.createTextNode(c):c); }
    return e;
  },
  esc:s=>String(s??''), uid:p=>'id_'+Math.random().toString(36).slice(2,9),
  mean:a=>a.length?a.reduce((x,y)=>x+y,0)/a.length:0,
  median:a=>{if(!a.length)return 0;const s=[...a].sort((x,y)=>x-y);const m=Math.floor(s.length/2);return s.length%2?s[m]:(s[m-1]+s[m])/2;},
  clamp:(v,lo,hi)=>Math.max(lo,Math.min(hi,v)),
  autosave(){}, showToast(){}, confirm:()=>true,
  backendOnline:false,
  state:null,
  App:{ updateSummary(){}, goWork(){} },
  Runner:{ start(){return null;}, renderUI(){}, checkpoint(){return Promise.resolve();}, finish(){} },
  API:{},
  AiContext:{ buildPrompt:()=>[] },
  UI:{ mountMvo(){}, mountMark(){}, mountGuard(){return true;}, demoNote(){return null;} },
  renderMatrix(opts){ matrixOpts=opts; opts.container.innerHTML='<svg/>'; },
  Work1:{ sbuPresent(){} },
  Work2:{}, Work3:{}, Work4:{}, Work5:{},
};
sandbox.window = sandbox;
vm.createContext(sandbox);
for(const f of ['workshop1.js','workshop2.js','workshop5.js']){
  vm.runInContext(fs.readFileSync(path.join(root,f),'utf8'), sandbox, {filename:f});
}
const {Work2, Work5} = sandbox;

// —— 用 Work2 自己的 defaultData 构造「全部做完」的 v2 状态 ——
sandbox.state = {
  work1:{ sbu:{name:'豆芽妈妈'}, environment:{}, personas:[], values:{}, analysis:{}, metrics:{dimensions:[]} },
  work2: Work2.defaultData(),
  work3:{ proposition:{}, identity:{}, mining:{}, matrix:{showSector:false} },
  work4:{},
  work5: Work5.defaultData()
};
const w2 = sandbox.state.work2;
w2.retained = [
  {id:'m1', name:'印尼', region:'东南亚'},
  {id:'m2', name:'越南', region:'东南亚'}
];
const inds = Work2.allIndicators();
w2.scoring = {};
[w2.scoring['m1']={}, w2.scoring['m2']={}].forEach(sc=>{
  inds.forEach((ind,i)=>{ sc[ind.id] = { score: 6 + (i%4), source:'user' }; });
});
w2.decision.tier1.marketId = 'm1';
w2.decision.tier1.rationale = '市场规模大且增速高';

let fail = 0;
const assert=(name,cond)=>{ console.log((cond?'PASS ':'FAIL ')+name); if(!cond) fail=1; };

// 症状 1（用户报告）：3.1 矩阵块不应再显示「尚未完成」警告
{
  const c = makeNode('div');
  Work5.marketMatrixBlock(c);
  const txt = JSON.stringify(c)==='' ? '' : (function f(n){let o='';if(n.nodeType===3)return String(n.text||'');o+=n._innerHTML||'';for(const x of (n.children||[]))o+=f(x);return o;})(c);
  assert('3.1 不再显示「Work 2 尚未完成市场评分与矩阵选择」', !txt.includes('尚未完成市场评分'));
  assert('矩阵图收到 '+w2.retained.length+' 个市场点', Array.isArray(matrixOpts&&matrixOpts.points) && matrixOpts.points.length===2);
  assert('切分线来自 matrixCuts（null 也能自动中点）', matrixOpts && matrixOpts.xCut!=null && matrixOpts.yCut!=null);
}
// 症状 2（同根因）：三档决策卡主战场应显示市场名，不是「未命名」
{
  const c = makeNode('div');
  Work5.decisionCardBlock(c);
  const txt = (function f(n){let o='';if(n.nodeType===3)return String(n.text||'');o+=n._innerHTML||'';for(const x of (n.children||[]))o+=f(x);return o;})(c);
  assert('决策卡显示主战场=印尼（表 3-1 三行决策表，非「未命名」）', txt.includes('主战场') && txt.includes('印尼') && !txt.includes('未命名'));
}
console.log(fail ? 'RED' : 'GREEN');
process.exit(fail);
