/* Node test: quality_rules 的 Work 5 规则与六章 schema 对齐（2026-09-01 bugfix）。
   老规则引用 ch3_market / ch4_mix.trim，新规则按 ch1..ch5 章节判。 */
'use strict';
let pass = 0, fail = 0;
function ok(name, cond, detail){
  if(cond){ pass++; console.log('PASS ' + name); }
  else { fail++; console.log('FAIL ' + name + (detail ? ' — ' + detail : '')); }
}
function full(){
  return {
    cover:{title:'t',team:'t',date:'2026'},
    abstract:'这是一段足够长的摘要文字，超过三十个字符的长度要求。',
    ch1_business:'业务单元：豆芽妈妈，母婴行业，面向东南亚市场。',
    ch2_environment:{political:'政策稳定',economic:'',social:'',technological:'',strengths:[],weaknesses:[],opportunities:[],threats:[]},
    ch3_strategy:{segmentation:'场景',targeting:'目标市场：印尼',positioning:'定位句'},
    ch4_mix:{product:'产品',price:'',place:'',promotion:''},
    ch5_outlook:'六个月内完成铺货，关键风险是汇率，应对是本地化采购。'
  };
}
global.state = { work1:{}, work2:{}, work3:{}, work4:{}, work5: full() };
const QR = require('../docs/lib/quality_rules.js');
{
  const r = QR.RULES.find(x=>x.id==='w5-upstream');
  ok('规则存在', !!r);
  let threw=false, val=false;
  try{ val=r.test(); }catch(e){ threw=true; }
  ok('六章齐全 → 通过且不抛错', !threw && val===true);
}
{
  global.state = { work5:{ cover:{title:'',team:'',date:''}, abstract:'', ch1_business:'', ch2_environment:{}, ch3_strategy:{}, ch4_mix:{}, ch5_outlook:'' } };
  const r = QR.RULES.find(x=>x.id==='w5-upstream');
  let threw=false, val=true;
  try{ val=r.test(); }catch(e){ threw=true; }
  ok('空状态 → 不通过且不抛错（不再 ch4_mix.trim TypeError）', !threw && val===false);
}
{
  // 旧死字段不应让规则误判通过
  global.state = { work5:{ ch1_business:'x', ch3_market:'x', ch4_mix:{}, ch2_environment:{}, ch3_strategy:{} } };
  const r = QR.RULES.find(x=>x.id==='w5-upstream');
  let threw=false, val=true;
  try{ val=r.test(); }catch(e){ threw=true; }
  ok('旧死字段不误判通过', !threw && val===false);
}
console.log(`\n${pass} pass / ${fail} fail`);
process.exit(fail === 0 ? 0 : 1);
