/* Node test: W5 MVO 判据与上游成稿检查（2026-09-01 wayfinder T02）。
   修 MVO 抛错/死字段 + 六章判据 + 上游状态面板数据。
   Run: node tests/work5_mvo.test.js
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
const document = {
  createElement: () => ({ appendChild(){}, setAttribute(){}, style:{} }),
  head: { appendChild(){} },
  getElementById: () => null,
  querySelector: () => null
};
const sandbox = {
  console, setTimeout, clearTimeout, Date, JSON, Math, Object, Array, String, Number, Boolean,
  document,
  el(){ return { appendChild(){ return this; } }; },
  esc: s => String(s??''),
  autosave(){}, showToast(){}, confirm: () => true,
  state: null,
  Work1: {}, Work2: {}, Work3: {}, Work4: {}, Work5: {}, App: {}, Runner: {}, API: {}, UI: { mountMvo(){}, mountMark(){}, mountGuard(){ return true; }, demoNote(){ return null; } },
  AiContext: { buildPrompt: () => [] },
  renderMatrix(){}
};
sandbox.window = sandbox;
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(path.join(root, 'workshop5.js'), 'utf8'), sandbox, {filename:'workshop5.js'});
const W5 = sandbox.Work5;

function baseState(){
  return {
    work1: {},
    work2: {},
    work3: {},
    work4: {},
    work5: W5.defaultData()
  };
}
function fillW5(w){
  w.ch1_business='豆芽妈妈是一家聚焦母婴健康的企业，核心能力在于配方研发与本地化服务。';
  w.ch2_environment.political='目标市场政策稳定，对母婴品类有明确准入要求。';
  w.ch3_strategy.segmentation='场景一：新手妈妈……'; w.ch3_strategy.targeting='目标市场：印尼。';
  w.ch3_strategy.positioning='为新手妈妈提供成分透明的母婴产品。';
  w.ch4_mix.product='产品：成分透明配方奶粉。';
  w.ch5_outlook='6 个月内完成首批铺货，12 个月建立本地团队，关键风险是汇率波动，应对是本地化采购。';
  return w;
}

// 1. 五章齐全 → 全部通过，且求值过程不抛错
sandbox.state = baseState();
fillW5(sandbox.state.work5);
{
  const cfg = W5.mvo();
  let threw = false;
  const results = cfg.checks.map(c => { try{ return c.test(); }catch(e){ threw = true; return false; } });
  ok('五章齐全时 MVO 全过', !threw && results.every(Boolean));
  ok('MVO 检查项数量 = 5（五章，封面/摘要已删）', cfg.checks.length === 5);
}

// 2. 空状态：不抛错、对应项为 false
sandbox.state = baseState();
{
  const cfg = W5.mvo();
  let threw = false;
  const results = cfg.checks.map(c => { try{ return c.test(); }catch(e){ threw = true; return false; } });
  ok('空状态求值不抛错（修复 ch4_mix.trim TypeError）', !threw);
  ok('空状态全部为 false', results.every(v => v === false));
}

// 3. 旧数据只有死字段（ch3_market/ch6_risks）→ 不判通过、不抛错
sandbox.state = baseState();
sandbox.state.work5.ch3_market='旧字段'; sandbox.state.work5.ch6_risks='旧字段'; sandbox.state.work5.ch7_roadmap='旧字段';
{
  const cfg = W5.mvo();
  let threw = false;
  const results = cfg.checks.map(c => { try{ return c.test(); }catch(e){ threw = true; return false; } });
  ok('死字段不干扰判据（仍 false 且不抛错）', !threw && results.every(v => v === false));
}

// 4. 上游成稿检查：W1 全过、W2 未过、W4 无 mvo → done=false
sandbox.Work1 = {
  steps: [{id:'a'},{id:'b'}],
  mvo: { a:()=>({checks:[{test:()=>true}]}), b:()=>({checks:[{test:()=>true}]}) }
};
sandbox.Work2 = {
  steps: [{id:'x'}],
  mvo: { x:()=>({checks:[{test:()=>false}]}) }
};
sandbox.Work3 = {
  steps: [{id:'y'}],
  mvo: { y:()=>({checks:[{test:()=>true},{test:()=>true}]}) }
};
sandbox.Work4 = {};
{
  const st = W5.upstreamStatus();
  ok('上游状态返回 4 项', st.length === 4);
  ok('W1 全过 → done=true', st[0].done === true);
  ok('W2 未过 → done=false', st[1].done === false && st[1].passed === 0);
  ok('W3 全过 → done=true', st[2].done === true);
  ok('W4 无 mvo → done=false', st[3].done === false);
  ok('upstreamLine 含 ✓/✗', W5.upstreamLine().includes('I 业务价值体系 ✓') && W5.upstreamLine().includes('IV 营销组合 ✗'));
}

// 5. 导出 MD 带上游成稿一行
sandbox.state = baseState();
fillW5(sandbox.state.work5);
sandbox.Work3 = {
  computeMatrix: () => [],
  effectiveCuts: () => ({xCut:7, yCut:7}),
  isInSector: () => true,
  entrySuggestion: () => ({text:''}),
  scenarioName: () => ''
};
{
  const md = W5.exportMd();
  ok('导出含「> 上游成稿：」', md.includes('> 上游成稿：'));
}

console.log(`\n${pass} pass / ${fail} fail`);
process.exit(fail === 0 ? 0 : 1);
