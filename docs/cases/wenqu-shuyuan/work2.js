/* ============================================================
 wenqu-shuyuan / work2 — 目标市场选择 (T09 filled)
 形状严格匹配 Work2.defaultData()。
 ============================================================ */
(function(){
  const data = {
    scope: {
      question: '问渠书院应优先拓展哪个客户细分市场？',
      timeframe: '12-18 个月',
      constraints: '职业线团队从零搭建；老客不能流失；预算 300 万',
      candidateCount: 3
    },
    attractiveness: {
      indicators: [
        { id:'a1', name:'市场规模', weight:0.25, source:'delphi', support:5, rubric:{
          high:'目标客群 >500 万', mid:'100-500 万', low:'<100 万' }},
        { id:'a2', name:'增长率', weight:0.30, source:'delphi', support:5, rubric:{
          high:'新职业/就业培训 >30%', mid:'15-30%', low:'<15%' }},
        { id:'a3', name:'客单价', weight:0.20, source:'delphi', support:5, rubric:{
          high:'客单 >8000 元', mid:'4000-8000 元', low:'<4000 元' }},
        { id:'a4', name:'就业刚需', weight:0.25, source:'delphi', support:5, rubric:{
          high:'就业难+学完就业意愿 >70%', mid:'40-70%', low:'<40%' }}
      ]
    },
    competitiveness: {
      indicators: [
        { id:'c1', name:'师资基础', weight:0.30, source:'delphi', support:5, rubric:{
          high:'现有 8 位全职可转岗', mid:'需新招 3-5 位', low:'需重招团队' }},
        { id:'c2', name:'品牌资产匹配', weight:0.25, source:'delphi', support:5, rubric:{
          high:'老客信任可迁移', mid:'部分场景匹配', low:'需重塑品牌' }},
        { id:'c3', name:'渠道效率', weight:0.20, source:'delphi', support:5, rubric:{
          high:'现有渠道 ROI >1.5', mid:'1-1.5', low:'<1' }},
        { id:'c4', name:'就业资源', weight:0.25, source:'delphi', support:5, rubric:{
          high:'已有本地合作企业', mid:'3-6 月可谈', low:'需 12+ 月从零' }}
      ]
    },
    delphi: {
      panel: (typeof Work2!== 'undefined' && Work2.EXPERTS)
        ? Work2.EXPERTS.map(e => ({...e, round1:null, round2:null}))
        : [],
      round1: null,
      synthesis: null,
      round2: null,
      finalSynthesis: '两轮 Delphi 后专家对"增长率"与"师资基础"赋权最高。大学生/职场新人客单价高、就业刚需强、老学员可推荐，6 个月内可贡献 30% 营收；K12 老客稳定但增长见顶；30+ 转行者人数多但客单价低、就业兑现风险大。',
      weights: {
        attractiveness: {a1:0.25,a2:0.30,a3:0.20,a4:0.25},
        competitiveness: {c1:0.30,c2:0.25,c3:0.20,c4:0.25}
      },
      status: 'done'
    },
    markets: [
      { id:'m1', name:'大学生/职场新人', region:'杭州/宁波/绍兴高校+职场', population:'约 200 万', gdpPerCapita:'家庭年收入 15-30 万',
        notes:'就业刚需强、客单价高、社交传播好',
        scores:{a1:8, a2:9, a3:9, a4:9, c1:7, c2:7, c3:6, c4:6},
        e_indId:'a1', src_indId:'c1' },
      { id:'m2', name:'K12 老客（鸡娃续费）', region:'3 校区周边家庭', population:'已有 1500 学员家庭', gdpPerCapita:'家庭年收入 25-50 万',
        notes:'老客粘性强，续费 70%',
        scores:{a1:6, a2:5, a3:7, a4:4, c1:9, c2:10, c3:9, c4:5},
        e_indId:'a1', src_indId:'c1' },
      { id:'m3', name:'30+ 转行者', region:'浙江省内待业/转行', population:'约 100 万', gdpPerCapita:'家庭年收入 10-20 万',
        notes:'人数多、就业兑现风险大',
        scores:{a1:7, a2:7, a3:5, a4:8, c1:5, c2:5, c3:4, c4:3},
        e_indId:'a1', src_indId:'c1' }
    ],
    matrix: { selectedMarketId:'m1', xCut:null, yCut:null, notes:'短期保 m2 K12 老客续费，中期重点攻 m1 大学生/职场新人，长期考虑 m3 30+ 转行者（需先建就业案例）。' },
    decision: {
      rationale: 'm1 大学生/职场新人客单价高、就业刚需强、老学员推荐可借力，6 个月内可贡献 30% 营收；m2 老客稳定但增长见顶；m3 转行者人数多但兑现风险大。',
      sequence: 'm2 K12 老客续费（0-6 月）→ m1 大学生/职场新人职业课（3-12 月）→ m3 30+ 转行者（12+ 月，需先建就业案例）',
      risks: ['职业线师资招聘难','就业兑现不达标','m1 客群对老牌 K12 品牌认知弱','m2 家长对职业线担心分散精力'],
      nextSteps: '6 月内招 2 名职业课老师+1 名就业对接；与 3-5 家本地企业签就业合作协议；上线小程序学习报告+作品墙。'
    }
  };

  if(typeof window!== 'undefined') window.__case_wenqu_shuyuan_work2 = data;
})();
