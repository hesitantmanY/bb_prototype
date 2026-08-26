/* ============================================================
 hengrui-zao / work2 — 目标市场选择 (T09 filled)
 形状严格匹配 Work2.defaultData()。
 ============================================================ */
(function(){
  const data = {
    scope: {
      question: '恒锐精密应优先拓展哪个客户细分市场？',
      timeframe: '12-18 个月',
      constraints: '品牌运营团队从零；OEM 客户不能流失；预算 500 万',
      candidateCount: 3
    },
    attractiveness: {
      indicators: [
        { id:'a1', name:'市场规模', weight:0.25, source:'delphi', support:5, rubric:{
          high:'目标客群 >5000 家', mid:'1000-5000 家', low:'<1000 家' }},
        { id:'a2', name:'增长率', weight:0.30, source:'delphi', support:5, rubric:{
          high:'国产替代/专精特新 >25%', mid:'15-25%', low:'<15%' }},
        { id:'a3', name:'客单价', weight:0.20, source:'delphi', support:5, rubric:{
          high:'客单 >100 万/年', mid:'30-100 万/年', low:'<30 万/年' }},
        { id:'a4', name:'品牌接受度', weight:0.25, source:'delphi', support:5, rubric:{
          high:'愿意尝试新自有品牌', mid:'部分尝试', low:'只认 OEM' }}
      ]
    },
    competitiveness: {
      indicators: [
        { id:'c1', name:'制造基础', weight:0.30, source:'delphi', support:5, rubric:{
          high:'现有 OEM 经验可复用', mid:'部分领域可复用', low:'需重塑' }},
        { id:'c2', name:'资质匹配', weight:0.25, source:'delphi', support:5, rubric:{
          high:'IATF/ISO 13485 完备', mid:'部分资质', low:'需新认证' }},
        { id:'c3', name:'渠道效率', weight:0.20, source:'delphi', support:5, rubric:{
          high:'现有渠道 ROI >1.5', mid:'1-1.5', low:'<1' }},
        { id:'c4', name:'团队匹配', weight:0.25, source:'delphi', support:5, rubric:{
          high:'有现成品牌/营销能力', mid:'3-6 月可建', low:'需 12+ 月从零' }}
      ]
    },
    delphi: {
      panel: (typeof Work2!== 'undefined' && Work2.EXPERTS)
        ? Work2.EXPERTS.map(e => ({...e, round1:null, round2:null}))
        : [],
      round1: null,
      synthesis: null,
      round2: null,
      finalSynthesis: '两轮 Delphi 后专家对"增长率"与"制造基础"赋权最高。专精特新中小品牌方国产替代意愿强、客单价可接受、愿意尝试新自有品牌，恒锐精密 30+ 年 OEM 经验可直接复用；工业采购经理以 OEM 为主、不会主动选自有品牌；机器人新领域增速快但客户结构未验证。',
      weights: {
        attractiveness: {a1:0.25,a2:0.30,a3:0.20,a4:0.25},
        competitiveness: {c1:0.30,c2:0.25,c3:0.20,c4:0.25}
      },
      status: 'done'
    },
    markets: [
      { id:'m1', name:'专精特新中小品牌方', region:'苏州/宁波/东莞/深圳', population:'约 2000 家', gdpPerCapita:'营收 5000 万-5 亿',
        notes:'国产替代意愿强、客单价可接受',
        scores:{a1:8, a2:9, a3:7, a4:8, c1:8, c2:7, c3:6, c4:5},
        e_indId:'a1', src_indId:'c1' },
      { id:'m2', name:'工业采购经理（OEM 现有）', region:'汽车/医疗/3C 整机厂', population:'约 5000 家', gdpPerCapita:'营收 1 亿-100 亿',
        notes:'OEM 为主，少数接受自有品牌',
        scores:{a1:9, a2:6, a3:9, a4:3, c1:10, c2:9, c3:9, c4:6},
        e_indId:'a1', src_indId:'c1' },
      { id:'m3', name:'机器人/新领域（增长型）', region:'深圳/上海/杭州机器人厂', population:'约 500 家', gdpPerCapita:'营收 5000 万-10 亿',
        notes:'增速快、客单价高、新领域',
        scores:{a1:6, a2:9, a3:8, a4:7, c1:5, c2:4, c3:5, c4:3},
        e_indId:'a1', src_indId:'c1' }
    ],
    matrix: { selectedMarketId:'m1', xCut:null, yCut:null, notes:'短期保 m2 工业采购经理 OEM 合作，中期重点攻 m1 专精特新中小品牌方（自有品牌试点），长期考虑 m3 机器人新领域。' },
    decision: {
      rationale: 'm1 专精特新中小品牌方国产替代意愿强、客单价可接受、愿意尝试新自有品牌，12 个月内可贡献自有品牌 60% 营收；m2 OEM 现有稳定但只认 OEM；m3 机器人新领域增速快但客户结构未验证。',
      sequence: 'm2 工业采购经理 OEM 保合作（0-6 月）→ m1 专精特新中小品牌方自有品牌试点（3-12 月）→ m3 机器人新领域拓展（12+ 月）',
      risks: ['自有品牌客户接受度低','m2 工业采购经理对自有品牌不感冒','机器人新领域经验不足','品牌运营人才招聘难'],
      nextSteps: '6 月内招 1 名品牌运营+1 名电商运营；参加 SIMM/CIMT 展会发布自有品牌；官网+小程序上线"恒锐造"品牌页。'
    }
  };

  if(typeof window!== 'undefined') window.__case_hengrui_zao_work2 = data;
})();
