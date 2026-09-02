/* ============================================================
 QualityRules — right-sidebar "健康检查" rules.

 Loaded as a plain <script>. Attaches to window.QualityRules.

 Each rule:
   { id, work:1..5, step:'<step id>'|'*',
     level:'warn'|'info',
     msg:'问题描述（一句话）',
     test: () => bool   // returns true if OK (passes); false = shows the rule
   }

 Rules are authored here (not in the render code) so they are easy to
 read and edit. test() reads the global `state`. A rule that returns
 false appears in the sidebar for its work/step. SBU step intentionally
 has no rules (left as-is per design).

 To add a rule: append to RULES below. To disable one, set its `off:true`.
 ============================================================ */
(function(){
 'use strict';

 const RULES = [
   // ---- Work 1: environment ----
   {id:'w1-env-1', work:1, step:'environment', level:'warn',
    msg:'PEST 有维度空缺（政治/经济/社会/技术应各填一段）',
    test:()=>['political','economic','social','technological'].every(k=>(state.work1.environment[k]||'').trim().length>10)},
   {id:'w1-env-2', work:1, step:'environment', level:'warn',
    msg:'直接竞品少于 3 家（建议 5-7 家同价位同场景）',
    test:()=>state.work1.environment.competitors.length>=3},
   {id:'w1-env-3', work:1, step:'environment', level:'info',
    msg:'竞品缺少价格或定位信息，难以做对标',
    test:()=>state.work1.environment.competitors.every(c=>(c.price||'').trim()&&(c.position||'').trim())},
   {id:'w1-env-4', work:1, step:'environment', level:'info',
    msg:'能力盘点 5 维（交付/核心/品牌/客户/合规）未全部填写',
    test:()=>{const c=state.work1.environment.ourCapabilities||{};return ['delivery','core','brand','customer','compliance'].every(k=>(c[k]||'').trim().length>5);}},

   // ---- Work 1: personas ----
   {id:'w1-per-1', work:1, step:'personas', level:'warn',
    msg:'客户画像少于 3 个，覆盖面可能不足',
    test:()=>state.work1.personas.length>=3},
   {id:'w1-per-2', work:1, step:'personas', level:'warn',
    msg:'存在画像缺少痛点或价值观——画像应能驱动价值判断',
    test:()=>state.work1.personas.every(p=>(p.painPoints||'').trim().length>5 && (p.values||[]).length>0)},
   {id:'w1-per-3', work:1, step:'personas', level:'info',
    msg:'还没有使用场景的感知价值矩阵（建议 2-4 个场景）',
    test:()=>(state.work1.scenarios||[]).length>=1},

   // ---- Work 1: metrics ----
   {id:'w1-met-1', work:1, step:'metrics', level:'warn',
    msg:'一级指标少于 4 个，CBBE 维度可能不全',
    test:()=>(state.work1.metrics.dimensions||[]).length>=4},
   {id:'w1-met-2', work:1, step:'metrics', level:'warn',
    msg:'测评点合计不足 12 个（每个一级指标至少 3 个）',
    test:()=>(state.work1.metrics.dimensions||[]).reduce((a,d)=>a+(d.secondaries||[]).length,0)>=12},
   {id:'w1-met-3', work:1, step:'metrics', level:'info',
    msg:'部分测评点缺少量化口径（measure）——没有口径的分数无法复核',
    test:()=>(state.work1.metrics.dimensions||[]).every(d=>(d.secondaries||[]).every(s=>(s.measure||'').trim().length>0))},

   // ---- Work 1: survey ----
   {id:'w1-sur-1', work:1, step:'survey', level:'warn',
    msg:'李克特题少于 5 道，回填指标的覆盖度不够',
    test:()=>state.work1.survey.questions.filter(q=>q.type==='likert').length>=5},
   {id:'w1-sur-2', work:1, step:'survey', level:'warn',
    msg:'合成调研尚未运行（没有回答数据）',
    test:()=>state.work1.survey.responses.length>0},
   {id:'w1-sur-3', work:1, step:'survey', level:'info',
    msg:'调研回答来自 AI 合成受访者，不能替代真实问卷（见右上角 AI 标记）',
    test:()=>false},  // always-on reminder

   // ---- Work 1: analysis ----
   {id:'w1-ana-1', work:1, step:'analysis', level:'warn',
    msg:'还没有综合洞察（至少写 3 条可执行结论）',
    test:()=>(state.work1.analysis.insights||'').trim().length>30},

   // ---- Work 1: values ----
   {id:'w1-val-1', work:1, step:'values', level:'warn',
    msg:'功能/情感/社会三条主轴未全部选定',
    test:()=>!!(state.work1.values.chosenFunctional&&state.work1.values.chosenEmotional&&state.work1.values.chosenSocial)},
   {id:'w1-val-2', work:1, step:'values', level:'info',
    msg:'缺少取舍理由——为什么是这三条、放弃了什么',
    test:()=>(state.work1.values.rationale||'').trim().length>20},

   // ---- Work 1: recommendations ----
   {id:'w1-rec-1', work:1, step:'recommendations', level:'warn',
    msg:'短/中/长期建议有缺失',
    test:()=>['short','mid','long'].every(k=>(state.work1.recommendations[k]||'').trim().length>10)},
   {id:'w1-rec-2', work:1, step:'recommendations', level:'info',
    msg:'没有列出风险与应对',
    test:()=>(state.work1.recommendations.risks||[]).some(r=>(r||'').trim().length>0)},

   // ---- Work 2 ----
   {id:'w2-scope', work:2, step:'scope', level:'warn',
    msg:'决策问题/时间窗口/约束未填全',
    test:()=>!!(state.work2.scope.question||'').trim()&&!!(state.work2.scope.timeframe||'').trim()},
   {id:'w2-ind', work:2, step:'indicators', level:'warn',
    msg:'吸引力或竞争力指标不足 3 个，或缺少评分锚点(rubric)',
    test:()=>state.work2.attractiveness.indicators.length>=3&&state.work2.competitiveness.indicators.length>=3
      &&state.work2.attractiveness.indicators.every(i=>i.rubric&&i.rubric.high)
      &&state.work2.competitiveness.indicators.every(i=>i.rubric&&i.rubric.high)},
   {id:'w2-mkt', work:2, step:'markets', level:'warn',
    msg:'候选市场少于 3 个',
    test:()=>state.work2.markets.length>=3},
   {id:'w2-score', work:2, step:'scoring', level:'info',
    msg:'有市场未完成全部指标打分',
    test:()=>{const inds=[...state.work2.attractiveness.indicators,...state.work2.competitiveness.indicators];
      return state.work2.markets.every(m=>inds.every(i=>m.scores&&m.scores[i.id]!=null));}},
   {id:'w2-dec', work:2, step:'decision', level:'warn',
    msg:'最终决策的理由/次序/风险未填全',
    test:()=>(state.work2.decision.rationale||'').trim().length>20&&(state.work2.decision.sequence||'').trim()},

   // ---- Work 3 ----
   {id:'w3-min', work:3, step:'mining', level:'warn',
    msg:'还没有痛点地图（至少 5 条，含痛点与痒点）',
    test:()=>(state.work3.mining.painMap||[]).length>=5},
   {id:'w3-cand', work:3, step:'candidates', level:'warn',
    msg:'备选卖点少于 6 个，优选空间不足',
    test:()=>state.work3.candidates.length>=6},
   {id:'w3-cand-pain', work:3, step:'candidates', level:'warn',
    msg:'有卖点未关联痛点——卖点应回答"解决哪个痛点"',
    test:()=>{const cs=state.work3.candidates.filter(c=>(c.name||'').trim()); return cs.length===0 || cs.every(c=>(c.pain||'').trim()); }},
   {id:'w3-cand-ev', work:3, step:'candidates', level:'warn',
    msg:'有卖点缺支撑证据——填语料摘录（[真实]/[模拟]）/ 量化统计 / 可验证依据',
    test:()=>{const cs=state.work3.candidates.filter(c=>(c.name||'').trim()); return cs.length===0 || cs.every(c=>(c.evidence||'').trim()); }},
   {id:'w3-mat', work:3, step:'matrix', level:'warn',
    msg:'卖点还未全部完成合意性×可实施性打分',
    test:()=>{
      const named=state.work3.candidates.filter(c=>(c.name||'').trim());
      if(!named.length) return true;
      const ddims=state.work3.dimensions.desirability, idims=state.work3.dimensions.implementability;
      const hasD = c => ddims.every(d=>c[d.key]!=null) || Object.keys(c.desirabilityScores||{}).length>0;
      const hasI = c => idims.every(d=>c[d.key]!=null);
      return named.every(c=>hasD(c) && hasI(c));
    }},
   {id:'w3-prop', work:3, step:'proposition', level:'warn',
    msg:'价值主张或定位句未完成',
    test:()=>!!(state.work3.proposition.chosenValueText||'').trim()&&!!(state.work3.proposition.positioning&&state.work3.proposition.positioning.differentiator)},

   // ---- Work 4 ----
   {id:'w4-route', work:4, step:'route', level:'warn',
    msg:'未选定微笑曲线位置或进入模式',
    test:()=>!!state.work4.route.oemType&&!!state.work4.route.entryMode},
   {id:'w4-prod', work:4, step:'product', level:'warn',
    msg:'产品描述或核心差异点缺失',
    test:()=>!!(state.work4.product.description||'').trim()&&(state.work4.product.coreDifferentiators||[]).length>0},
   {id:'w4-price', work:4, step:'price', level:'warn',
    msg:'未选定价策略',
    test:()=>!!(state.work4.price.strategy||'').trim()},
   {id:'w4-place', work:4, step:'place', level:'warn',
    msg:'还没有规划任何渠道',
    test:()=>['onlineSelf','onlineThird','offlineDirect','offlineDistrib'].some(k=>(state.work4.place[k]||[]).length>0)},
   {id:'w4-promo', work:4, step:'promotion', level:'warn',
    msg:'传播主题未确定，或传播手段少于 2 类',
    test:()=>!!(state.work4.promotion.theme||'').trim()&&['advertising','pr','salesPromotion'].filter(k=>(state.work4.promotion[k]||[]).length>0).length>=2},

   // ---- Work 5（2026-09-01：封面/摘要/参考文献删除，封面/摘要规则一并移除） ----
   {id:'w5-upstream', work:5, step:'plan', level:'info',
    msg:'部分 Work 1–4 章节尚未汇总，策划书可能不完整',
    test:()=>{
      const w=state.work5;
      const env=w.ch2_environment||{};
      const s3=w.ch3_strategy||{};
      const ch2=['political','economic','social','technological'].some(k=>(env[k]||'').trim())
        || (env.strengths||[]).some(x=>(x||'').trim()) || (env.weaknesses||[]).some(x=>(x||'').trim());
      const ch5=!!w.ch4_mix && ['product','price','place','promotion'].some(k=>(w.ch4_mix[k]||'').trim());
      return !!(w.ch1_business||'').trim() && ch2
        && !!((s3.segmentation||s3.targeting||'')).trim() && !!(s3.positioning||'').trim() && ch5;
    }},
 ];

 function rulesFor(work, step){
   return RULES.filter(r=>!r.off && r.work===work && (r.step===step || r.step==='*'));
 }
 // Returns failing rules for the given work/step (those that should show).
 function evaluate(work, step){
   return rulesFor(work, step).filter(r=>{
     try{ return !r.test(); }catch(_){ return false; }
   });
 }
 function countFor(work, step){
   const list = step ? rulesFor(work, step) : RULES.filter(r=>!r.off&&r.work===work);
   const failing = list.filter(r=>{ try{return !r.test();}catch(_){return false;} });
   return {total:list.length, failing:failing.length, warns:failing.filter(r=>r.level==='warn').length};
 }

 const QualityRules={RULES,rulesFor,evaluate,countFor};
 if(typeof window!=='undefined') window.QualityRules=QualityRules;
 if(typeof module!=='undefined' && module.exports) module.exports=QualityRules;
})();
