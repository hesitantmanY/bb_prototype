/* Node test: W5 4P/4C 结构化重组 + AI 改写格式约束（2026-09-01 wayfinder T04）。
   Run: node tests/work5_4p_structure.test.js
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
const calls=[];
const sandbox = {
  console, setTimeout, clearTimeout, Date, JSON, Math, Object, Array, String, Number, Boolean,
  document,
  el(){ return { appendChild(){ return this; } }; },
  esc: s => String(s??''),
  autosave(){}, showToast(){}, confirm: () => true,
  state: null,
  Work1: {}, Work2: {}, Work3: {}, Work4: {}, Work5: {}, App: {}, API: {
    async call(messages){ calls.push(messages); return '· 润色后要点一\n· 润色后要点二'; },
    async callJson(messages){ calls.push(messages); return { customerValue:'# 客户价值\n- 第一点\n- 第二点' }; }
  },
  Runner: {
    start(){ return { done:0, aborted:false, controller:{ signal:{} }, total:2 }; },
    renderUI(){}, checkpoint(){ return Promise.resolve(); }, finish(){}
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

async function main(){
  // 1. normalizeBullets：剥 markdown 装饰、- 转 · 、去 ★
  {
    const out = W5.normalizeBullets('# 标题\n- 要点1\n**加粗** 文案\n3.5 ★ 星');
    ok('剥标题/列表/加粗/★', out === '标题\n· 要点1\n加粗 文案\n3.5 星', out);
  }

  // 2. structureP：按 Work4 表单字段重组（summaryText 字段优先）
  sandbox.Work4 = {
    summaryText: key => {
      if(key==='price') return '策略：中高端\n档位：\n- A 100元\n- B 200元 ★';
      if(key==='product') return '产品名：奶粉\n- 差异化甲\n- 差异化乙';
      return '';
    }
  };
  sandbox.state = { work4:{}, work5: W5.defaultData() };
  {
    const price = W5.structureP('price');
    ok('价格块重组：- 转 ·、去 ★', price.includes('· A 100元') && price.includes('· B 200元') && !price.includes('★'));
    const product = W5.compose4P().product;
    ok('compose4P 走 structureP 结构化', product.includes('产品名：奶粉') && product.includes('· 差异化甲'));
  }

  // 3. convert4C：输出受格式约束（normalize 兜底）
  {
    sandbox.state.work5.ch4_mix = { product:'p', price:'p', place:'p', promotion:'p' };
    await W5.convert4C(null);
    ok('4C 转换后结构化为主题句 + · 要点',
      sandbox.state.work5.ch4_mix.customerValue === '客户价值\n· 第一点\n· 第二点',
      JSON.stringify(sandbox.state.work5.ch4_mix.customerValue));
  }

  // 4. aiPolish4P：只润色非空 P、prompt 带格式约束、结果 normalize
  {
    calls.length = 0;
    sandbox.state.work5.ch4_mix = { product:'· A 要点', price:'· B 要点', place:'', promotion:'' };
    await W5.aiPolish4P(null);
    ok('只调 2 次（跳过空 P）', calls.length === 2);
    const sys = calls[0].find(m => m.role==='system').content;
    ok('prompt 含结构约束 + 去 AI 味禁令', sys.includes('保持结构不变') && sys.includes('不要输出标题') && sys.includes('写作禁令'));
    ok('润色结果落入字段', sandbox.state.work5.ch4_mix.product.includes('润色后要点一')
      && sandbox.state.work5.ch4_mix.price.includes('润色后要点二'));
  }

  // 5. aiSummary4P（2026-09-01 决策 4）：AI 总结为表 4-1 行，actions 规范化，缺省 P 不写入
  {
    calls.length = 0;
    sandbox.AiContext = { buildPrompt: ({system, instruction}) =>
      [{role:'system', content:system}, {role:'user', content:instruction}] };
    sandbox.state.work5.ch4_mix = { product:'p', price:'p', place:'p', promotion:'p' };
    sandbox.API.callJson = async(ms)=>{
      calls.push(ms);
      return { product:{core:'成分透明配方',actions:'- 亮点一\n- 亮点二',nums:'复购 3.25'},
               price:{core:'中高端三档',actions:'- A 档',nums:'100-200 元'} };
    };
    await W5.aiSummary4P(null);
    const pt = sandbox.state.work5.ch4_mix.pTable;
    ok('pTable 填充且 actions 规范化', pt.product.core==='成分透明配方'
      && pt.product.actions==='· 亮点一\n· 亮点二' && pt.product.nums==='复购 3.25');
    ok('AI 未返回的 P 保持空（可手填）', !pt.place.core && !pt.promotion.core);
    const sys = calls[0].find(m => m.role==='system').content;
    ok('4P 表 prompt 含去 AI 味禁令', sys.includes('写作禁令'));
    const md = W5.fourPTableMd();
    ok('fourPTableMd 输出表格且竖线转义', md.includes('| 产品 | 成分透明配方 |') && md.includes('· 亮点一；· 亮点二'));
  }

  console.log(`\n${pass} pass / ${fail} fail`);
  process.exit(fail === 0 ? 0 : 1);
}
main().catch(e => { console.error(e); process.exit(1); });
