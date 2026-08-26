/* ============================================================
 maohaizi-house / work2 — 目标市场选择 (T09 filled)
 形状严格匹配 Work2.defaultData()。
 ============================================================ */
(function(){
  const data = {
    scope: {
      question: '毛孩子之家应优先拓展哪个城市/客群？',
      timeframe: '12-18 个月',
      constraints: '新店资金 300 万；老板亲自参与；老店不能受影响；洗护师团队复制',
      candidateCount: 3
    },
    attractiveness: {
      indicators: [
        { id:'a1', name:'市场规模', weight:0.25, source:'delphi', support:5, rubric:{
          high:'宠物数 >300 万', mid:'100-300 万', low:'<100 万' }},
        { id:'a2', name:'增长率', weight:0.30, source:'delphi', support:5, rubric:{
          high:'宠物经济 >20%', mid:'10-20%', low:'<10%' }},
        { id:'a3', name:'客单价', weight:0.20, source:'delphi', support:5, rubric:{
          high:'客单 >150 元', mid:'100-150 元', low:'<100 元' }},
        { id:'a4', name:'种草生态', weight:0.25, source:'delphi', support:5, rubric:{
          high:'小红书/抖音渗透 >60%', mid:'30-60%', low:'<30%' }}
      ]
    },
    competitiveness: {
      indicators: [
        { id:'c1', name:'本地口碑', weight:0.30, source:'delphi', support:5, rubric:{
          high:'2 年品牌沉淀', mid:'1-2 年', low:'<1 年' }},
        { id:'c2', name:'团队匹配', weight:0.25, source:'delphi', support:5, rubric:{
          high:'5 位洗护师可复制', mid:'3-5 位', low:'需重招团队' }},
        { id:'c3', name:'资金效率', weight:0.20, source:'delphi', support:5, rubric:{
          high:'现有资金可开店', mid:'需部分融资', low:'需大额融资' }},
        { id:'c4', name:'政策环境', weight:0.25, source:'delphi', support:5, rubric:{
          high:'宠物经济受鼓励', mid:'一般', low:'严格' }}
      ]
    },
    delphi: {
      panel: (typeof Work2!== 'undefined' && Work2.EXPERTS)
        ? Work2.EXPERTS.map(e => ({...e, round1:null, round2:null}))
        : [],
      round1: null,
      synthesis: null,
      round2: null,
      finalSynthesis: '两轮 Delphi 后专家对"增长率"与"本地口碑"赋权最高。成都/重庆本地宠物数全国前 5、种草生态成熟，毛孩子之家 2 年本地口碑+实时直播差异化已建立，5 家店中 3 家成都+1 家重庆+1 家绵阳/乐山，可形成"成都核心+川渝扩展"格局；绵阳/乐山客单价低、复制价值弱；加盟路线资金效率高但品控风险大。',
      weights: {
        attractiveness: {a1:0.25,a2:0.30,a3:0.20,a4:0.25},
        competitiveness: {c1:0.30,c2:0.25,c3:0.20,c4:0.25}
      },
      status: 'done'
    },
    markets: [
      { id:'m1', name:'成都核心（2-3 家新店）', region:'成都高新/锦江/武侯', population:'潜在 50 万养宠家庭', gdpPerCapita:'人均可支配 5 万+',
        notes:'本地口碑强、抖音同城生态成熟',
        scores:{a1:9, a2:8, a3:8, a4:9, c1:9, c2:7, c3:8, c4:8},
        e_indId:'a1', src_indId:'c1' },
      { id:'m2', name:'重庆（1 家新店）', region:'重庆渝北/江北', population:'潜在 30 万养宠家庭', gdpPerCapita:'人均可支配 4.5 万+',
        notes:'已有 1 家店，扩展第 2 家',
        scores:{a1:7, a2:8, a3:7, a4:8, c1:7, c2:6, c3:7, c4:7},
        e_indId:'a1', src_indId:'c1' },
      { id:'m3', name:'绵阳/乐山（川内下沉）', region:'绵阳/乐山', population:'潜在 10 万养宠家庭', gdpPerCapita:'人均可支配 3.5 万+',
        notes:'客单价低、复制价值弱',
        scores:{a1:5, a2:6, a3:5, a4:5, c1:3, c2:4, c3:6, c4:6},
        e_indId:'a1', src_indId:'c1' }
    ],
    matrix: { selectedMarketId:'m1', xCut:null, yCut:null, notes:'短期保 2 家老店，中期重点攻 m1 成都 2-3 家新店（核心市场），次攻 m2 重庆 1 家（已有 1 家），长期考虑 m3 绵阳/乐山下沉。' },
    decision: {
      rationale: 'm1 成都核心市场客单价高、抖音同城生态成熟、毛孩子之家 2 年本地口碑可复用，12 个月内可贡献 50% 营收增长；m2 重庆已有 1 家，扩展第 2 家降低进入风险；m3 川内下沉客单价低、复制价值弱。',
      sequence: '成都 2 家老店优化（0-6 月）→ 成都 2 家新店（6-12 月）→ 重庆 1 家新店（12+ 月）',
      risks: ['新店选址失误','洗护师招聘难','5 家店管理失控','寄养卫生/安全风险'],
      nextSteps: '6 月内启动成都 2 家新店选址+招 3 位洗护师+1 位店长；上线小程序会员月卡+异业合作。'
    }
  };

  if(typeof window!== 'undefined') window.__case_maohaizi_house_work2 = data;
})();
