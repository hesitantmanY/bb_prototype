/* Node test: W5 明细层折叠 + 导出全量（2026-09-01 wayfinder T06）。
   Delphi 权重 / LDA 主题词表 / 媒介预算，默认收起、导出完整。
   Run: node tests/work5_detail_layer.test.js
*/
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const root = path.join(__dirname, '..', 'docs');
let pass = 0, fail = 0;
function ok(name, cond, detail){
  if(cond){ pass++; console.log('PASS ' + name); }
  else { fail++; console.log('FAIL ' + name + (detail ? ' — ' + detail : '')); }
}
function makeNode(tag){
  return {
    tagName:String(tag).toUpperCase(), nodeType:1, children:[], attrs:{}, style:{}, className:'',
    appendChild(c){ this.children.push(c); return c; },
    addEventListener(){}, setAttribute(k,v){ this.attrs[k]=String(v); },
    querySelector(){ return null; }, querySelectorAll(){ return []; },
    set innerHTML(v){ this._innerHTML=String(v); this.children=[]; },
    get innerHTML(){ return this._innerHTML||''; }
  };
}
function collectText(n){
  if(n.nodeType===3) return String(n.text||'');
  let out=n._innerHTML||'';
  for(const c of (n.children||[])) out+=collectText(c);
  return out;
}
function collectClasses(n, out=[]){
  if(n.className) out.push(n.className);
  for(const c of (n.children||[])) collectClasses(c, out);
  return out;
}
const document = {
  createElement:t=>makeNode(t),
  createTextNode:s=>({nodeType:3,text:String(s),children:[]}),
  head:{appendChild(){}},
  getElementById:()=>null,
  querySelector:()=>null
};
const sandbox = {
  console, setTimeout, clearTimeout, Date, JSON, Math, Object, Array, String, Number, Boolean,
  document,
  el(tag, attrs={}, ...children){
    const e=document.createElement(tag);
    for(const [k,v] of Object.entries(attrs)){
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
  autosave(){}, showToast(){}, confirm:()=>true,
  state:null,
  Work1:{ steps:[{id:'a'}], mvo:{a:()=>({checks:[]})} },
  Work2:{
    steps:[{id:'x'}], mvo:{x:()=>({checks:[]})},
    computeMatrix:()=>[{id:'m1',name:'印尼',x:8,y:9}], setTier1(){},
    allIndicators:()=>[{id:'i1',name:'市场规模',axis:'attractiveness',catName:'经济'}],
    effectiveWeights:()=>({attractiveness:{i1:0.6},competitiveness:{}})
  },
  Work3:{
    steps:[{id:'y'}], mvo:{y:()=>({checks:[]})},
    computeMatrix:()=>[], effectiveCuts:()=>({xCut:7,yCut:7}),
    isInSector:()=>true, entrySuggestion:()=>({text:''}), scenarioName:()=>''
  },
  Work4:{ steps:[{id:'z'}], mvo:{z:()=>({checks:[]})} },
  Work5:{}, App:{goWork(){}}, Runner:{}, API:{}, UI:{ mountMvo(){}, mountMark(){}, mountGuard(){return true;}, demoNote(){return null;} },
  AiContext:{ buildPrompt:()=>[] },
  renderMatrix(opts){ opts.container.innerHTML='<svg/>'; }
};
sandbox.window=sandbox;
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(path.join(root,'workshop5.js'),'utf8'), sandbox, {filename:'workshop5.js'});
const W5=sandbox.Work5;

sandbox.state={
  work1:{ sbu:{name:'豆芽'}, environment:{}, personas:[], values:{}, analysis:{}, metrics:{dimensions:[]} },
  work2:{ matrix:{xCut:7,yCut:7}, markets:[{id:'m1',name:'印尼'}], decision:{tier1:{marketId:'m1',rationale:'大',resourcesPct:80,milestones:[],reEvalTrigger:''}} },
  work3:{
    matrix:{showSector:true,sectorWidth:1.5}, candidates:[],
    mining:{ painMap:[], topics:[{id:0,label:'成分焦虑',share:35,keywords:[{word:'成分'},{word:'透明'}],representative_docs:['评论 A']}] },
    proposition:{}, identity:{}
  },
  work4:{ place:{}, promotion:{ advertising:[{media:'KOL',budgetShare:40,message:'成分透明',kpi:'转化率'},{media:'信息流',budgetShare:60,message:'品牌',kpi:'曝光'}] } },
  work5:W5.defaultData()
};

const sec=makeNode('section');
document.querySelector=sel=>sel.includes('data-step="plan"')?sec:null;
W5.renderStep('plan');
const txt=collectText(sec);
ok('Delphi 权重明细嵌入', txt.includes('Delphi 收敛权重（1 项）') && txt.includes('经济 / 市场规模：60.0%'));
ok('LDA 主题词表明细嵌入', txt.includes('LDA 主题词表（1 个）') && txt.includes('成分焦虑（35%）：成分、透明'));
ok('媒介预算改为横条图（图不言）', txt.includes('媒介预算构成') && txt.includes('KOL') && txt.includes('40%') && txt.includes('信息流'));
const classes=collectClasses(sec);
ok('三处折叠：权重/主题词/4P 详述', classes.filter(c=>String(c).includes('detail-layer')).length===3);

const md=W5.exportMd();
ok('导出含权重明细', md.includes('#### 上游明细 · Delphi 收敛权重（1 项）'));
ok('导出含主题词表明细', md.includes('#### 上游明细 · LDA 主题词表（1 个）'));
ok('导出含媒介预算明细', md.includes('#### 上游明细 · 媒介预算组合（budgetShare 合计 100）'));

console.log(`\n${pass} pass / ${fail} fail`);
process.exit(fail===0?0:1);
