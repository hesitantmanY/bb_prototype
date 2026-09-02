/* Node test: 案例 W5 的 3.1 市场矩阵与 3.4 卖点矩阵非退化（2026-09-02 用户反馈）。
   真实链路：真实 Work1/2/3/5 模块 + 真实案例数据 + Cases.load + SchemaMigrate
   → Work2.computeMatrix / Work3.computeMatrix 必须给出有意义的点位，
   两个证据块不得显示「尚未完成」警告。
   Run: node tests/cases_matrix_blocks.test.js
*/
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const root = path.join(__dirname, '..', 'docs');

let matrixOpts = null;
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
  autosave(){}, showToast(){}, confirm:()=>true, backendOnline:false,
  state:null,
  App:{ updateSummary(){}, goWork(){}, snapshot(){} },
  Runner:{ start(){return null;}, renderUI(){}, checkpoint(){return Promise.resolve();}, finish(){} },
  API:{},
  AiContext:{ buildPrompt:()=>[] },
  UI:{ mountMvo(){}, mountMark(){}, mountGuard(){return true;}, demoNote(){return null;} },
  renderMatrix(opts){ matrixOpts=opts; opts.container.innerHTML='<svg/>'; },
  Work1:{}, Work2:{}, Work3:{}, Work4:{ steps:[{id:'z'}], mvo:{z:()=>({checks:[]})} }, Work5:{},
  SchemaMigrate:{ run(){ return false; } }
};
sandbox.window = sandbox;
vm.createContext(sandbox);
for(const f of ['workshop1.js','workshop2.js','workshop3.js','workshop5.js','lib/schema_migrate.js']){
  vm.runInContext(fs.readFileSync(path.join(root,f),'utf8'), sandbox, {filename:f});
}
// 真实 SchemaMigrate（覆盖占位）
vm.runInContext(fs.readFileSync(path.join(root,'lib/schema_migrate.js'),'utf8'), sandbox, {filename:'schema_migrate.js'});
// 真实案例（loader 与数据挂同一 window）
for(const brand of ['douya-mama','xiaohuo-ji','wenqu-shuyuan','hengrui-zao','maohaizi-house']){
  for(const wk of ['work1','work2','work3']){
    vm.runInContext(fs.readFileSync(path.join(root,'cases',brand,wk+'.js'),'utf8'), sandbox, {filename:brand+'/'+wk+'.js'});
  }
  vm.runInContext(fs.readFileSync(path.join(root,'cases',brand,'index.js'),'utf8'), sandbox, {filename:brand+'/index.js'});
}
vm.runInContext(fs.readFileSync(path.join(root,'cases/loader.js'),'utf8'), sandbox, {filename:'loader.js'});

const {Work1, Work2, Work3, Work5, SchemaMigrate, Cases} = sandbox;
const BRANDS = ['douya-mama','xiaohuo-ji','wenqu-shuyuan','hengrui-zao','maohaizi-house'];
let pass=0, fail=0;
function ok(name, cond, detail){
  if(cond){ pass++; console.log('PASS ' + name); }
  else { fail++; console.log('FAIL ' + name + (detail? ' — ' + String(detail).slice(0,140) : '')); }
}

for(const brand of BRANDS){
  const st = {
    meta:{},
    work1: Work1.defaultData(), work2: Work2.defaultData(), work3: Work3.defaultData(),
    work4: {}, work5: Work5.defaultData()
  };
  const loaded = Cases.load(brand);
  Object.assign(st.work1, loaded.work1);
  Object.assign(st.work2, loaded.work2);
  Object.assign(st.work3, loaded.work3);
  st.work5 = loaded.work5;
  sandbox.state = st;
  SchemaMigrate.run(st, [Work1, Work2, Work3, sandbox.Work4, Work5]);

  // 3.1 市场吸引力 × 竞争力矩阵
  const pts = Work2.computeMatrix().filter(p=>(p.name||'').trim());
  ok(brand+': 3.1 有 '+pts.length+' 个市场点（≥3）', pts.length>=3, pts.map(p=>p.name).join(','));
  const maxX = Math.max(0, ...pts.map(p=>p.x));
  const maxY = Math.max(0, ...pts.map(p=>p.y));
  ok(brand+': 3.1 点位非退化（max x='+maxX.toFixed(1)+' y='+maxY.toFixed(1)+'，均需 ≥5）',
    maxX>=5 && maxY>=5);
  {
    const c = makeNode('div');
    Work5.marketMatrixBlock(c);
    const txt = collectText(c);
    ok(brand+': 3.1 不显示「尚未完成」警告', !txt.includes('尚未完成候选市场'), txt.slice(0,60));
  }

  // 3.4 卖点矩阵与排名
  const spts = Work3.computeMatrix().filter(p=>(p.name||'').trim());
  ok(brand+': 3.4 有 '+spts.length+' 个卖点（≥3）', spts.length>=3, spts.map(p=>p.name).join(','));
  const sMaxX = Math.max(0, ...spts.map(p=>p.x));
  const sMaxY = Math.max(0, ...spts.map(p=>p.y));
  ok(brand+': 3.4 点位非退化（max 可实施性='+sMaxX.toFixed(1)+' 合意性='+sMaxY.toFixed(1)+'，均需 ≥5）',
    sMaxX>=5 && sMaxY>=5);
  {
    const c = makeNode('div');
    Work5.sellingPointBlock(c);
    const txt = collectText(c);
    ok(brand+': 3.4 排名表渲染（如何进入最优）', txt.includes('如何进入最优'), txt.slice(0,60));
    ok(brand+': 3.4 不显示「尚未完成」警告', !txt.includes('尚未完成卖点评分'), txt.slice(0,60));
  }
}

// 用户工作区形状（v1 时代完成的 work3 无 dimensions，迁移不补）：
// 3.4 的 computeMatrix 抛错不得炸掉整页渲染（2026-09-02 用户反馈「看不到矩阵」）
{
  const st = {
    meta:{},
    work1: Work1.defaultData(), work2: Work2.defaultData(), work3: Work3.defaultData(),
    work4: {}, work5: Work5.defaultData()
  };
  const loaded = Cases.load('douya-mama');
  Object.assign(st.work1, loaded.work1);
  Object.assign(st.work2, loaded.work2);
  Object.assign(st.work3, loaded.work3);
  st.work5 = loaded.work5;
  delete st.work3.dimensions;          // v1 工作区特征
  st.work3.candidates = st.work3.candidates.slice(0,1);
  sandbox.state = st;
  SchemaMigrate.run(st, [Work1, Work2, Work3, sandbox.Work4, Work5]);
  const sec2 = makeNode('section');
  document.querySelector = sel => sel.includes('data-step="plan"') ? sec2 : null;
  let threw = false;
  try{ Work5.renderStep('plan'); }catch(e){ threw = true; }
  const t2 = collectText(sec2);
  ok('缺 dimensions 的 work3：renderStep 不抛错', !threw);
  ok('3.4 显示「尚未完成卖点评分」而非崩溃', t2.includes('尚未完成卖点评分'));
  ok('3.5 STP 与第 4 章仍渲染（页面不被截断）',
    t2.includes('STP：细分 / 目标 / 定位') && t2.includes('营销组合'));
}

console.log(`\n${pass} pass / ${fail} fail`);
process.exit(fail === 0 ? 0 : 1);
