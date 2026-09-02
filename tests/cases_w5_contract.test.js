/* Node test: 案例 work5 与 W5 新契约对齐（2026-09-01 ADR 0012 + 附录）。
   契约：1) 封面/摘要/参考文献已删除——案例数据不得再带这三个键
        2) 文本字段无 \n\n 空行、无 ** markdown 残留
        3) ch4_mix.pTable 四行齐全（表 4-1 在案例中应为填好的教学样张）
        4) SWOT 四组非空（按键为「重新生成」语义，案例自带内容）
        5) 4C 四字段非空
   Run: node tests/cases_w5_contract.test.js
*/
'use strict';
const path = require('path');

const fakeWindow = {};
function makeDefaultData(tag){ return { _tag: tag }; }
fakeWindow.Work1 = { defaultData: () => makeDefaultData('work1') };
fakeWindow.Work2 = { defaultData: () => makeDefaultData('work2') };
fakeWindow.Work3 = { defaultData: () => makeDefaultData('work3') };
fakeWindow.Work4 = { defaultData: () => makeDefaultData('work4') };
fakeWindow.Work5 = { defaultData: () => makeDefaultData('work5') };
global.window = fakeWindow;
global.document = { addEventListener: ()=>{} };

const BRANDS = ['douya-mama','xiaohuo-ji','wenqu-shuyuan','hengrui-zao','maohaizi-house'];
const base = path.join(__dirname, '..', 'docs', 'cases');
for(const brand of BRANDS){
  for(const wk of ['work1','work2','work3','work4','work5']){
    require(path.join(base, brand, wk + '.js'));
  }
  require(path.join(base, brand, 'index.js'));
}
require(path.join(base, 'loader.js'));
const Cases = fakeWindow.Cases;

let pass=0, fail=0;
function assert(name, cond, detail){
  if(cond){ pass++; console.log('PASS ' + name); }
  else { fail++; console.log('FAIL ' + name + (detail? ' — ' + String(detail).slice(0,120): '')); }
}

// 递归收集字符串值（带路径）
function walkStrings(node, out, prefix){
  if(node==null) return out;
  if(typeof node==='string'){ out.push([prefix, node]); return out; }
  if(typeof node!=='object') return out;
  for(const k of Object.keys(node)) walkStrings(node[k], out, prefix? prefix+'.'+k : k);
  return out;
}

for(const brand of BRANDS){
  const w5 = Cases.load(brand).work5;

  assert(brand+': 无 cover/abstract/references 死字段',
    !('cover' in w5) && !('abstract' in w5) && !('references' in w5),
    Object.keys(w5).join(','));

  const strs = walkStrings(w5, [], '');
  const badNN = strs.filter(([,v]) => v.includes('\n\n'));
  const badMD = strs.filter(([,v]) => /\*\*/.test(v));
  assert(brand+': 无 \\n\\n 空行', badNN.length===0, badNN.map(([p])=>p).join(','));
  assert(brand+': 无 ** markdown 残留', badMD.length===0, badMD.map(([p])=>p).join(','));

  const pt = w5.ch4_mix && w5.ch4_mix.pTable;
  const ptOk = pt && ['product','price','place','promotion'].every(k =>
    pt[k] && String(pt[k].core||'').trim() && String(pt[k].actions||'').trim());
  assert(brand+': pTable 四行齐全（表 4-1 教学样张）', !!ptOk, JSON.stringify(pt||null).slice(0,80));

  const env = w5.ch2_environment||{};
  assert(brand+': SWOT 四组非空',
    ['strengths','weaknesses','opportunities','threats'].every(k => Array.isArray(env[k]) && env[k].length>0),
    JSON.stringify(['strengths','weaknesses','opportunities','threats'].map(k=>(env[k]||[]).length)));

  const mix = w5.ch4_mix||{};
  assert(brand+': 4C 四字段非空',
    ['customerValue','customerCost','convenience','communication'].every(k => String(mix[k]||'').trim().length>0),
    JSON.stringify(['customerValue','customerCost','convenience','communication'].map(k=>(mix[k]||'').length)));

  assert(brand+': ch1/ch5 正文非空',
    String(w5.ch1_business||'').trim().length>10 && String(w5.ch5_outlook||'').trim().length>10);
}

console.log(`\n${pass} pass / ${fail} fail`);
process.exit(fail === 0 ? 0 : 1);
