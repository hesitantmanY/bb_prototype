/* Node test: W5 第 4 章重排（ticket 00-02 + 06 清单）。
   4.2.2 G7 树图含伙伴行、按位置挂载、structure 空降级、side 空提示行；
   导出 md 缩进投影；大纲编号回归；4.4 反应机制降级与 AI 起草。
   Run: node tests/work5_chapter4_tree.test.js
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
    tagName: String(tag).toUpperCase(), nodeType: 1, children: [], attrs: {}, style: {}, className: '',
    appendChild(c){ this.children.push(c); return c; },
    addEventListener(type, fn){ this._listeners = this._listeners || {}; (this._listeners[type] = this._listeners[type] || []).push(fn); },
    setAttribute(k, v){ this.attrs[k] = String(v); if(k === 'disabled') this._disabled = true; },
    querySelector(){ return null; },
    querySelectorAll(){ return []; },
    set innerHTML(v){ this._innerHTML = String(v); this.children = []; },
    get innerHTML(){ return this._innerHTML || ''; }
  };
}
function collectText(n){
  if(n.nodeType === 3) return String(n.text || '');
  let out = n._innerHTML || '';
  for(const c of (n.children || [])) out += collectText(c);
  return out;
}
function collectClasses(n, out = []){
  if(n.className) out.push(n.className);
  for(const c of (n.children || [])) collectClasses(c, out);
  return out;
}
function collectButtons(n, out = []){
  if(n.tagName === 'BUTTON') out.push(collectText(n).trim());
  for(const c of (n.children || [])) collectButtons(c, out);
  return out;
}
const document = {
  createElement: t => makeNode(t),
  createTextNode: s => ({ nodeType:3, text:String(s), children:[] }),
  head: { appendChild(){} },
  getElementById: () => null,
  querySelector: () => null
};
const apiCalls = [];
const sandbox = {
  console, setTimeout, clearTimeout, Date, JSON, Math, Object, Array, String, Number, Boolean,
  document,
  el(tag, attrs = {}, ...children){
    const e = document.createElement(tag);
    for(const [k, v] of Object.entries(attrs)){
      if(k === 'class') e.className = v;
      else if(k === 'html') e.innerHTML = v;
      else if(k.startsWith('on') && typeof v === 'function') e.addEventListener(k.slice(2), v);
      else if(k === 'style' && typeof v === 'object') Object.assign(e.style, v);
      else if(typeof v === 'boolean'){ if(v) e.setAttribute(k, ''); }
      else if(v == null) continue;
      else e.setAttribute(k, v);
    }
    for(const c of children.flat()){
      if(c == null || c === false) continue;
      e.appendChild(typeof c === 'string' || typeof c === 'number' ? document.createTextNode(c) : c);
    }
    return e;
  },
  esc: s => String(s ?? ''),
  uid: p => 'id_' + Math.random().toString(36).slice(2, 9),
  autosave(){}, showToast(){}, confirm: () => true,
  state: null,
  Work1: { steps:[{id:'a'}], mvo:{ a:()=>({checks:[]}) } },
  Work2: {
    steps:[{id:'x'}], mvo:{ x:()=>({checks:[]}) },
    computeMatrix: () => [], effectiveCuts: () => ({xCut:7,yCut:7}), setTier1(){}
  },
  Work3: {
    steps:[{id:'y'}], mvo:{ y:()=>({checks:[]}) },
    computeMatrix: () => [], effectiveCuts: () => ({xCut:7,yCut:7}),
    isInSector: () => true, entrySuggestion: () => ({text:''}), scenarioName: () => ''
  },
  Work4: { steps:[{id:'z'}], mvo:{ z:()=>({checks:[]}) } },
  Work5: {}, App: { goWork(){} }, Runner: {
    start(){ return { done:0, aborted:false, controller:{ signal:{} } }; },
    renderUI(){}, checkpoint(){ return Promise.resolve(); }, finish(){}
  },
  API: {
    async call(msgs){ apiCalls.push(msgs); return '· 监测认知断点复购率\n· 触发阈值：实测低于自评 1.5 分即启动专项调研'; },
    async callJson(){ apiCalls.push('json'); return {}; }
  },
  UI: { mountMvo(){}, mountMark(){}, mountGuard(){ return true; }, demoNote(){ return null; } },
  AiContext: { buildPrompt: () => [] },
  renderMatrix(){}
};
sandbox.window = sandbox;
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(path.join(root, 'workshop5.js'), 'utf8'), sandbox, {filename:'workshop5.js'});
const W5 = sandbox.Work5;
W5.rerender = function(){};

function baseState(work4place){
  return {
    work1: {
      sbu:{name:'豆芽'}, environment:{}, personas:[], values:{}, analysis:{},
      metrics:{ dimensions:[
        { name:'品牌显著性', secondaries:[{name:'知晓度', selfScore:5, actual:7}] },
        { name:'品牌形象', secondaries:[{name:'可信度', selfScore:8, actual:5}] },
        { name:'品牌功效', secondaries:[{name:'满意度', selfScore:9, actual:9}] }
      ] }
    },
    work2:{ matrix:{xCut:7,yCut:7}, decision:{tier1:{marketId:'m1',name:'印尼'}} },
    work3:{ matrix:{showSector:true,sectorWidth:1.5}, candidates:[], proposition:{}, identity:{} },
    work4:{ place: work4place },
    work5: W5.defaultData()
  };
}

const fullPlace = {
  structure:[
    {name:'线上', children:[{name:'抖音小店', share:40},{name:'官网', share:60}]},
    {name:'线下', children:[{name:'直营门店', share:70},{name:'经销商', share:30}]}
  ],
  keyPartners:[
    {name:'豆芽 MCN', side:'线上'}, {name:'家居博主', side:'线上'},
    {name:'区域经销商', side:'线下'}, {name:'未标注伙伴', side:''}
  ],
  channelIncentives:'返点 10%，账期 60 天',
  localChannelRelations:'本地代理按季度对账'
};

function renderWith(place){
  sandbox.state = baseState(place);
  const sec = makeNode('section');
  document.querySelector = sel => sel.includes('data-step="plan"') ? sec : null;
  W5.renderStep('plan');
  return sec;
}

// 1. 大纲编号 + 树图 + 伙伴按位置挂载
{
  const sec = renderWith(fullPlace);
  const txt = collectText(sec);
  ok('第 4 章大纲编号收敛为 4.2.1/4.2.2/4.2.3/4.3/4.4',
    txt.includes('4.1 渠道路径') && txt.includes('4.2.1 4P 摘要表')
    && txt.includes('4.2.2 渠道结构') && txt.includes('4.2.3 媒介预算构成')
    && txt.includes('4.3 4C') && txt.includes('4.4 反应机制'));
  ok('树图标签含组合计', txt.includes('线上 100%') && txt.includes('线下 100%'), txt.slice(0, 400));
  ok('树图含二级渠道行', txt.includes('抖音小店 40%') && txt.includes('直营门店 70%'));
  ok('伙伴行按组出现且顿号连接', txt.includes('◇ 伙伴：豆芽 MCN、家居博主') && txt.includes('◇ 伙伴：区域经销商'));
  ok('side 空伙伴在图下提示行', txt.includes('◇ 未分类伙伴：未标注伙伴 — 回 Work4 标注线上/线下'));
  ok('执行机制文字升入 4.2.2', txt.includes('渠道激励：返点 10%，账期 60 天') && txt.includes('本地渠道关系：本地代理按季度对账'));
  ok('4P 详述仍是折叠（不占编号）', collectClasses(sec).filter(c => String(c).includes('detail-layer')).length >= 1);
  ok('无实测降级不出现（有 delta 行）', !txt.includes('尚未完成实测调研'));
}

// 2. structure 空降级：不画树图、不显伙伴
{
  const sec = renderWith({ structure:[], keyPartners:[{name:'孤儿伙伴', side:'线上'}], channelIncentives:'', localChannelRelations:'' });
  const txt = collectText(sec);
  ok('structure 空 + 伙伴非空 → 降级提示', txt.includes('渠道结构尚未生成，先去 Work4 完成渠道步'));
  ok('structure 空不显示伙伴名', !txt.includes('孤儿伙伴'));
  ok('structure 空不画树图', !txt.includes('channel-tree-svg'));
}

// 3. 导出 md 缩进投影
{
  sandbox.state = baseState(fullPlace);
  sandbox.state.work5.ch4_mix.reactionMechanism = '· 监测认知断点\n· 每月复盘';
  const md = W5.exportMd();
  ok('导出含新大纲编号', md.includes('### 4.1 渠道路径') && md.includes('### 4.2.2 渠道结构')
    && md.includes('### 4.3 4C') && md.includes('### 4.4 反应机制'));
  ok('导出 4.2.2 不重复“### 渠道结构”标题',
    !/### 4\.2\.2 渠道结构\n\n### 渠道结构\n/.test(md),
    md.slice(md.indexOf('### 4.2.2 渠道结构'), md.indexOf('### 4.2.2 渠道结构') + 120));
  ok('导出为缩进列表投影', md.includes('- 线上（100%）') && md.includes('  - 抖音小店 40%')
    && md.includes('  - ◇ 伙伴：豆芽 MCN、家居博主'));
  ok('导出含未分类末行', md.includes('- ◇ 未分类伙伴：未标注伙伴 — 回 Work4 标注线上/线下'));
  ok('导出含执行机制文字（已从 4P 详述升入 4.2.2）',
    md.includes('- 渠道激励：返点 10%，账期 60 天')
    && md.includes('- 本地渠道关系：本地代理按季度对账'),
    md.slice(md.indexOf('### 4.2.2 渠道结构'), md.indexOf('### 4.3 4C')));
  ok('导出含图见应用内注', md.includes('（渠道结构图见应用内视图）'));
  ok('导出含反应机制正文', md.includes('### 4.4 反应机制') && md.includes('每月复盘'));
  ok('导出含 W1 Δ 同步读数（与 4.4 视图同构）',
    md.includes('W1 指标 Δ') && md.includes('品牌显著性 · 知晓度：自评 5 → 实测 7'));
}

// 4. 4.4 无实测：按钮降级且不调 API
{
  const st = baseState(fullPlace);
  st.work1.metrics.dimensions = [{ name:'品牌显著性', secondaries:[{name:'知晓度', selfScore:5, actual:null}] }];
  sandbox.state = st;
  const sec = makeNode('section');
  document.querySelector = sel => sel.includes('data-step="plan"') ? sec : null;
  W5.renderStep('plan');
  const txt = collectText(sec);
  const classes = collectClasses(sec);
  ok('无实测时 4.4 显示降级提示', txt.includes('尚未完成实测调研'));
  ok('无实测时按钮 is-disabled', classes.some(c => String(c).split(' ').includes('is-disabled')));
}

// 5. w1DeltaRows 排序与 limit + AI 起草写入
async function main(){
  {
    const st = baseState(fullPlace);
    st.work1.metrics.dimensions = [{ name:'品牌显著性', secondaries:[{name:'知晓度', selfScore:5, actual:null}] }];
    sandbox.state = st;
    apiCalls.length = 0;
    await W5.aiReaction(null);
    ok('无实测不调 API', apiCalls.length === 0);
  }
  {
    sandbox.state = baseState(fullPlace);
    const rows = W5.w1DeltaRows(2);
    ok('w1DeltaRows 只取偏差最大 2 项且按 |Δ| 排序', rows.length === 2
      && rows[0].name === '可信度' && rows[1].name === '知晓度', JSON.stringify(rows));
  }
  {
    sandbox.state = baseState(fullPlace);
    apiCalls.length = 0;
    await W5.aiReaction(null);
    const m = sandbox.state.work5.ch4_mix;
    ok('AI 起草写入 reactionMechanism', (m.reactionMechanism || '').includes('监测认知断点复购率'));
    ok('AI 起草调了 API', apiCalls.length === 1);
    ok('已有内容后 _reactionEmpty 为 false', W5._reactionEmpty() === false);
    const sec = makeNode('section');
    document.querySelector = sel => sel.includes('data-step="plan"') ? sec : null;
    W5.renderStep('plan');
    ok('已生成后块内按钮文案为“重新生成反应机制”', collectButtons(sec).includes('重新生成反应机制'));
  }
  console.log(`\n${pass} pass / ${fail} fail`);
  process.exit(fail === 0 ? 0 : 1);
}
main().catch(e => { console.error(e); process.exit(1); });
