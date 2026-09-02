/* 回归测试（2026-09-01 用户反馈）：SWOT「看不到」根因链。
   添加行误输（如「＋1添加」）被当正式条目存入 strengths → _swotEmpty 恒 false
   → 进入 W5 的 AI 预生成被永久跳过。修复契约：
   1. 占位/误输条目（剥掉 ＋/+、空白、「添加」后为空或 ≤1 字符且含 ＋/添加 特征）被清洗
   2. _swotEmpty 忽略垃圾条目 → 自动 AI 生成正常触发
   3. 真·手工条目不被清洗
   Run: node tests/work5_swot_heal.test.js
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
  saveNow: async () => true,
  Archive: { create: async () => ({}) },
  state: null,
  Work1: {}, Work2: {}, Work3: {}, Work4: {}, Work5: {}, App: {}, Runner: {}, API: {},
  UI: { mountMvo(){}, mountMark(){}, mountGuard(){ return true; }, demoNote(){ return null; } },
  AiContext: { buildPrompt: ({system, instruction}) =>
    [{role:'system', content:system}, {role:'user', content:instruction}] },
  renderMatrix(){}
};
sandbox.window = sandbox;
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(path.join(root, 'workshop5.js'), 'utf8'), sandbox, {filename:'workshop5.js'});
const W5 = sandbox.Work5;
W5.rerender = function(){};

async function main(){
  // 1. 垃圾条目判定：误输占位清洗，真实条目保留
  ok('「＋1添加」判为垃圾', W5._swotGarbage('＋1添加') === true);
  ok('「＋ 添加」「+添加」「＋添加」判为垃圾',
    W5._swotGarbage('＋ 添加') && W5._swotGarbage('+添加') && W5._swotGarbage('＋添加'));
  ok('真实短条目「低」不误杀', W5._swotGarbage('低') === false);
  ok('真实条目「品牌知名度高」不误杀', W5._swotGarbage('品牌知名度高') === false);

  // 2. healSwotItems：清垃圾、留真实、保持数组其余内容
  sandbox.state = { meta:{}, work5: W5.defaultData() };
  const env = sandbox.state.work5.ch2_environment;
  env.strengths = ['配方研发强', '＋1添加', '＋ 添加'];
  env.opportunities = ['东南亚母婴渗透率爬升'];
  W5.healSwotItems();
  ok('heal 后 strengths 只剩真实条目', env.strengths.length === 1 && env.strengths[0] === '配方研发强');
  ok('heal 后 opportunities 完整保留', env.opportunities.length === 1);

  // 3. 二次决策 2026-09-01：SWOT 手动按键生成——垃圾不再阻断按钮语义，
  //    _swotEmpty 忽略垃圾 → 按钮显示「AI 生成 SWOT」，点击直接覆盖（AGENTS.md 语义）
  sandbox.state = { meta:{}, work5: W5.defaultData() };
  const s1 = sandbox.state;
  s1.work5.ch2_environment.strengths = ['＋1添加', '＋ 添加'];   // 只有垃圾
  s1.work5.ch2_environment.political = '政策稳定';
  sandbox.API = { async callJson(){
    return { strengths:['研发强'], weaknesses:['品牌弱'], opportunities:['增速高'], threats:['汇率'] };
  } };
  sandbox.Runner = {
    start(){ return { aborted:false, controller:{ signal:{} }, done:0 }; },
    renderUI(){}, checkpoint(){ return Promise.resolve(); }, finish(){}
  };
  ok('只有垃圾条目时 _swotEmpty 为 true（按钮=AI 生成）', W5._swotEmpty() === true);
  W5.healSwotItems();
  await W5.aiSwot(null);
  ok('手动按键生成 SWOT 写入', (s1.work5.ch2_environment.strengths||[]).join() === '研发强');

  // 4. 有真实条目 → 按钮为「重新生成」，点击直接覆盖（不 confirm）
  s1.work5.ch2_environment.strengths = ['手改的 S'];
  ok('存在真实条目 → _swotEmpty false（按钮=重新生成）', W5._swotEmpty() === false);
  await W5.aiSwot(null);
  ok('重新生成直接覆盖', (s1.work5.ch2_environment.strengths||[]).join() === '研发强');

  // 5. 无 API → 手动点击静默失败不抛错、内容不动
  sandbox.API = {};
  await W5.aiSwot(null);
  ok('无 API → 手动生成静默不抛错', (s1.work5.ch2_environment.strengths||[]).join() === '研发强');

  console.log(`\n${pass} pass / ${fail} fail`);
  process.exit(fail === 0 ? 0 : 1);
}
main().catch(e => { console.error(e); process.exit(1); });
