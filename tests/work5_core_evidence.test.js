/* Node test: W5 核心证据块（2026-09-01 wayfinder T05）。
   E1 价值体系 / E2 决策卡 / E3 痛点地图+语料构成 / E4 渠道结构，视图 + 导出同构。
   Run: node tests/work5_core_evidence.test.js
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
  Work1:{}, Work2:{}, Work3:{}, Work4:{}, Work5:{}, App:{goWork(){}}, Runner:{}, API:{}, UI:{ mountMvo(){}, mountMark(){}, mountGuard(){return true;}, demoNote(){return null;} },
  AiContext:{ buildPrompt:()=>[] },
  renderMatrix(opts){ opts.container.innerHTML='<svg/>'; }
};
sandbox.window=sandbox;
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(path.join(root,'workshop5.js'),'utf8'), sandbox, {filename:'workshop5.js'});
const W5=sandbox.Work5;

sandbox.Work1={ steps:[{id:'a'}], mvo:{a:()=>({checks:[]})} };
sandbox.Work2={
  steps:[{id:'x'}], mvo:{x:()=>({checks:[]})},
  computeMatrix:()=>[{id:'m1',name:'印尼',x:8,y:9}],
  setTier1(){}
};
sandbox.Work3={
  steps:[{id:'y'}], mvo:{y:()=>({checks:[]})},
  computeMatrix:()=>[],
  effectiveCuts:()=>({xCut:7,yCut:7}),
  isInSector:()=>true,
  entrySuggestion:()=>({text:''}),
  scenarioName:id=>id==='s1'?'新手妈妈':''
};
sandbox.Work4={ steps:[{id:'z'}], mvo:{z:()=>({checks:[]})} };

sandbox.state={
  work1:{
    sbu:{name:'豆芽'}, environment:{}, personas:[], values:{}, analysis:{},
    metrics:{ dimensions:[{name:'品牌显著性',secondaries:[{name:'知晓度',selfScore:5,actual:7}]}] },
    ourCapabilities:{smileCurve:'优势在研发端'}
  },
  work2:{
    matrix:{xCut:7,yCut:7},
    markets:[{id:'m1',name:'印尼'}],
    decision:{tier1:{marketId:'m1',rationale:'需求大',resourcesPct:80,milestones:['6 个月铺货'],reEvalTrigger:'份额<5%'},tier2:{marketIds:[],observationMetrics:[]},tier3:{marketIds:[],reEvalTrigger:''}}
  },
  work3:{
    matrix:{showSector:true,sectorWidth:1.5},
    candidates:[],
    mining:{ painMap:[{id:'p1',pain:'怕买错',type:'痛点',frequency:'高',evidence:'评论「分不清真假」[模拟]',scenarioId:'s1'}], corpusComposition:{real:3,simulated:2,total:5} },
    proposition:{}, identity:{}
  },
  work4:{
    place:{ structure:[{name:'线上',children:[{name:'自营站',share:40},{name:'平台',share:60}]}], keyPartners:['本地仓配'] }
  },
  work5:W5.defaultData()
};

const sec=makeNode('section');
document.querySelector=sel=>sel.includes('data-step="plan"')?sec:null;
W5.renderStep('plan');
const txt=collectText(sec);
ok('E1 价值体系摘要嵌入', txt.includes('品牌价值体系') && txt.includes('知晓度') && txt.includes('Δ +2.0'));
ok('E1 认知断点高亮类', (function(){ let f=false; (function walk(n){ if(n.className&&String(n.className).includes('hot')) f=true; (n.children||[]).forEach(walk); })(sec); return f; })());
ok('表 3-1 三档决策表嵌入（主战场行 + 里程碑）', txt.includes('表 3-1 三档资源决策') && txt.includes('主战场') && txt.includes('印尼') && txt.includes('里程碑：6 个月铺货'));
ok('表 3-2 痛点地图嵌入（类型/频次/场景/原声列 + 语料构成表尾）', txt.includes('表 3-2 客户痛点地图') && txt.includes('真实 3 + 模拟 2') && txt.includes('怕买错') && txt.includes('新手妈妈'));
ok('E4 渠道结构嵌入', txt.includes('渠道结构') && txt.includes('自营站 40%') && txt.includes('本地仓配'));

const md=W5.exportMd();
ok('导出含 E1 价值体系', md.includes('### 品牌价值体系（自评 → 实测）') && md.includes('Δ +2.0'));
ok('导出含 E2 决策卡', md.includes('### 三档决策卡') && md.includes('主战场：印尼'));
ok('导出含 E3 痛点地图', md.includes('### 痛点地图（语料构成：真实 3 + 模拟 2）') && md.includes('怕买错'));
ok('导出含 E4 渠道结构', md.includes('### 渠道结构') && md.includes('自营站 40%'));

console.log(`\n${pass} pass / ${fail} fail`);
process.exit(fail===0?0:1);
