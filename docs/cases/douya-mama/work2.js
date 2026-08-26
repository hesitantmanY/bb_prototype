/* ============================================================
 douya-mama / work2 — 目标市场选择 (T09 filled)
 形状严格匹配 Work2.defaultData()。
 ============================================================ */
(function(){
  const data = {
    scope: {
      question: '豆芽妈妈应优先拓展哪个客户细分市场？',
      timeframe: '12-18 个月',
      constraints: '抖音团队从零搭建；老客不能流失；预算 200 万',
      candidateCount: 3
    },
    attractiveness: {
      indicators: [
        { id:'a1', name:'市场规模', weight:0.25, source:'delphi', support:5, rubric:{
          high:'目标客群 >1000 万', mid:'300-1000 万', low:'<300 万' }},
        { id:'a2', name:'增长率', weight:0.30, source:'delphi', support:5, rubric:{
          high:'抖音/小红书渗透 >60%', mid:'30-60%', low:'<30%' }},
        { id:'a3', name:'客单价', weight:0.20, source:'delphi', support:5, rubric:{
          high:'客单 >300 元', mid:'150-300 元', low:'<150 元' }},
        { id:'a4', name:'成分党占比', weight:0.25, source:'delphi', support:5, rubric:{
          high:'成分研究型 >40%', mid:'20-40%', low:'<20%' }}
      ]
    },
    competitiveness: {
      indicators: [
        { id:'c1', name:'复购基础', weight:0.30, source:'delphi', support:5, rubric:{
          high:'现有老客 >5 万', mid:'1-5 万', low:'<1 万' }},
        { id:'c2', name:'品牌资产匹配', weight:0.25, source:'delphi', support:5, rubric:{
          high:'成分透明口碑强', mid:'部分场景匹配', low:'需重塑品牌' }},
        { id:'c3', name:'渠道效率', weight:0.20, source:'delphi', support:5, rubric:{
          high:'现有渠道 ROI >2', mid:'1-2', low:'<1' }},
        { id:'c4', name:'团队匹配', weight:0.25, source:'delphi', support:5, rubric:{
          high:'团队有现成能力', mid:'3-6 月可建', low:'需 12+ 月从零' }}
      ]
    },
    delphi: {
      panel: (typeof Work2!== 'undefined' && Work2.EXPERTS)
        ? Work2.EXPERTS.map(e => ({...e, round1:null, round2:null}))
        : [],
      round1: null,
      synthesis: null,
      round2: null,
      finalSynthesis: '两轮 Delphi 后专家对"增长率"与"复购基础"赋权最高。一线精致妈妈客单价高、成分党占比高、抖音渗透高，6 个月内可贡献 30% 营收；二线老客稳定但增长见顶；抖音新客是渠道维度不是细分市场。',
      weights: {
        attractiveness: {a1:0.25,a2:0.30,a3:0.20,a4:0.25},
        competitiveness: {c1:0.30,c2:0.25,c3:0.20,c4:0.25}
      },
      status: 'done'
    },
    markets: [
      { id:'m1', name:'一线精致妈妈', region:'北京/上海/广州/深圳', population:'约 300 万', gdpPerCapita:'家庭年收入 50 万+',
        notes:'成分党、价格不敏感、抖音渗透高',
        scores:{a1:7, a2:8, a3:9, a4:9, c1:6, c2:7, c3:6, c4:6},
        e_indId:'a1', src_indId:'c1' },
      { id:'m2', name:'二线价格敏感妈妈', region:'成都/武汉/西安/南京', population:'约 800 万', gdpPerCapita:'家庭年收入 15-30 万',
        notes:'淘宝老客多、复购稳定',
        scores:{a1:9, a2:6, a3:5, a4:5, c1:9, c2:9, c3:9, c4:7},
        e_indId:'a1', src_indId:'c1' },
      { id:'m3', name:'抖音新客（兴趣电商）', region:'抖音兴趣电商', population:'潜在 2000 万+', gdpPerCapita:'参差',
        notes:'新流量红利，但老客品牌力弱',
        scores:{a1:8, a2:9, a3:5, a4:5, c1:3, c2:4, c3:3, c4:3},
        e_indId:'a1', src_indId:'c1' }
    ],
    matrix: { selectedMarketId:'m1', xCut:null, yCut:null, notes:'短期保 m2 老客复盘，中期重点攻 m1 抖音+小红书种草，长期考虑 m3 抖音兴趣电商。' },
    decision: {
      rationale: 'm1 一线精致妈妈客单价高、成分党、抖音渗透高，6 个月内可贡献 30% 营收；m2 老客稳定但增长见顶；m3 是渠道维度不是细分市场。',
      sequence: 'm2 老客复购（0-6 月）→ m1 抖音+小红书种草（3-12 月）→ m3 抖音兴趣电商拓展（12+ 月）',
      risks: ['抖音运营人才招聘难','m1 获客成本高于预期','m2 老客对抖音内容不接受'],
      nextSteps: '6 月内招 1 名抖音运营+1 名内容策划；启动小红书+抖音"成分透明"系列内容。'
    }
  };

  if(typeof window!== 'undefined') window.__case_douya_mama_work2 = data;
})();
