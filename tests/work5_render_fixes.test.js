/* 回归测试（2026-09-01 三次用户反馈）：
   1. demo 态（meta.isDemo）下正文残留 ** 不被清洗 —— 清洗应在 renderStep 生效，不受 demo 闸门限制
   2. SWOT 按键挂在章节顶部，2.2 附近看不到 —— 按键应位于 2.2 小节内
   Run: node tests/work5_render_fixes.test.js
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
    tagName:String(tag).toUpperCase(), nodeType:1, children:[], attrs:{}, style:{}, className:'', dataset:{},
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
  autosave(){}, showToast(){}, confirm:()=>true,
  state:null,
  Work1:{ steps:[{id:'a'}], mvo:{a:()=>({checks:[]})} },
  Work2:{ steps:[{id:'x'}], mvo:{x:()=>({checks:[]})}, computeMatrix:()=>[], setTier1(){} },
  Work3:{ steps:[{id:'y'}], mvo:{y:()=>({checks:[]})}, computeMatrix:()=>[], effectiveCuts:()=>({xCut:7,yCut:7}),
          isInSector:()=>true, entrySuggestion:()=>({text:''}), scenarioName:()=>'' },
  Work4:{ steps:[{id:'z'}], mvo:{z:()=>({checks:[]})} },
  Work5:{}, App:{goWork(){}}, Runner:{start(){return null;},renderUI(){},checkpoint(){return Promise.resolve();},finish(){}},
  API:{}, UI:{ mountMvo(){}, mountMark(){}, mountGuard(){return true;}, demoNote(){return null;} },
  AiContext:{ buildPrompt:()=>[] },
  renderMatrix(opts){ opts.container.innerHTML='<svg/>'; }
};
sandbox.window = sandbox;
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(path.join(root, 'workshop5.js'), 'utf8'), sandbox, {filename:'workshop5.js'});
const W5 = sandbox.Work5;

// 症状 1：demo 态 + 残留 ** → 渲染出来不应再有 **
sandbox.state = {
  meta:{ isDemo:true },
  work1:{ sbu:{name:'温控'}, environment:{}, personas:[], values:{}, analysis:{}, metrics:{dimensions:[]} },
  work2:{ matrix:{xCut:7,yCut:7}, markets:[], decision:{} },
  work3:{ matrix:{showSector:false}, candidates:[], mining:{ painMap:[
    {type:'痛点', pain:'夜间温度波动睡不好', frequency:'高', evidence:'老温控器乱跳', scenarioId:''}
  ]}, proposition:{}, identity:{} },
  work4:{},
  work5: W5.defaultData()
};
sandbox.state.work5.ch5_outlook = '**战略复盘** 正文一\n\n**关键风险与应对** 正文二';
const sec = makeNode('section');
document.querySelector = sel => sel.includes('data-step="plan"') ? sec : null;
W5.renderStep('plan');
let txt = collectText(sec);
ok('demo 态渲染不出现 ** 标记', !txt.includes('**'), txt.slice(0,80));
ok('清洗后正文仍在（只剥标记不删内容）', txt.includes('战略复盘') && txt.includes('正文二'));

// 症状 2：SWOT 按键应出现在 2.2 小节之后（附近可点）
sandbox.state.work5.ch5_outlook = '';
sandbox.state.work5.ch2_environment.strengths = [];
sandbox.state.work5.ch2_environment.weaknesses = [];
sandbox.state.work5.ch2_environment.opportunities = [];
sandbox.state.work5.ch2_environment.threats = [];
sec.innerHTML=''; sec.dataset.rendered='0';
W5.renderStep('plan');
txt = collectText(sec);
const idx22 = txt.indexOf('2.2 SWOT');
const idxBtn = txt.search(/AI 生成 SWOT|重新生成 SWOT/);
ok('2.2 小节存在', idx22 >= 0);
ok('SWOT 按键位于 2.2 附近（其后首个按键命中）', idx22 >= 0 && idxBtn > idx22
  && txt.slice(idx22, idxBtn).length < 60, '2.2@'+idx22+' btn@'+idxBtn);

console.log(`\n${pass} pass / ${fail} fail`);
process.exit(fail === 0 ? 0 : 1);
