/* ============================================================
 xiaohuo-ji / work2 — 目标市场选择 (T09 filled)
 形状严格匹配 Work2.defaultData()。
 ============================================================ */
(function(){
  const data = {
    scope: {
      question: '小镬记应优先拓展哪个城市/客群？',
      timeframe: '12-18 个月',
      constraints: '新店资金 800 万；家族决策；老店不能受影响；师傅团队只 5 人',
      candidateCount: 3
    },
    attractiveness: {
      indicators: [
        { id:'a1', name:'市场规模', weight:0.25, source:'delphi', support:5, rubric:{
          high:'粤菜+融合菜 >300 亿', mid:'100-300 亿', low:'<100 亿' }},
        { id:'a2', name:'增长率', weight:0.30, source:'delphi', support:5, rubric:{
          high:'融合菜/探店渗透 >40%', mid:'20-40%', low:'<20%' }},
        { id:'a3', name:'客单价', weight:0.20, source:'delphi', support:5, rubric:{
          high:'人均 >150 元', mid:'100-150 元', low:'<100 元' }},
        { id:'a4', name:'传播渗透', weight:0.25, source:'delphi', support:5, rubric:{
          high:'小红书/抖音渗透 >60%', mid:'30-60%', low:'<30%' }}
      ]
    },
    competitiveness: {
      indicators: [
        { id:'c1', name:'老店信任', weight:0.30, source:'delphi', support:5, rubric:{
          high:'30 年老店品牌', mid:'10-30 年', low:'<10 年' }},
        { id:'c2', name:'团队匹配', weight:0.25, source:'delphi', support:5, rubric:{
          high:'5 位师傅+小陈运营', mid:'3-5 人可复制', low:'需重招团队' }},
        { id:'c3', name:'资金效率', weight:0.20, source:'delphi', support:5, rubric:{
          high:'现有资金可开店', mid:'需部分融资', low:'需大额融资' }},
        { id:'c4', name:'政策环境', weight:0.25, source:'delphi', support:5, rubric:{
          high:'明厨亮灶/预制菜监管松', mid:'一般', low:'严格' }}
      ]
    },
    delphi: {
      panel: (typeof Work2!== 'undefined' && Work2.EXPERTS)
        ? Work2.EXPERTS.map(e => ({...e, round1:null, round2:null}))
        : [],
      round1: null,
      synthesis: null,
      round2: null,
      finalSynthesis: '两轮 Delphi 后专家对"增长率"与"老店信任"赋权最高。深圳/上海融合菜渗透高、客单价高、抖音同城种草生态成熟，老陈 30 年粤菜功底+小陈互联网运营能形成"老店+融合"差异化；广州本店已饱和主要做品牌升级；加盟路线资金效率高但品控风险大。',
      weights: {
        attractiveness: {a1:0.25,a2:0.30,a3:0.20,a4:0.25},
        competitiveness: {c1:0.30,c2:0.25,c3:0.20,c4:0.25}
      },
      status: 'done'
    },
    markets: [
      { id:'m1', name:'深圳（粤菜融合新客）', region:'深圳南山/福田', population:'潜在 50 万粤菜+融合菜客户', gdpPerCapita:'人均可支配 7 万+',
        notes:'融合菜渗透高、抖音同城生态成熟',
        scores:{a1:8, a2:9, a3:8, a4:9, c1:7, c2:7, c3:7, c4:7},
        e_indId:'a1', src_indId:'c1' },
      { id:'m2', name:'上海（精致中餐客）', region:'上海静安/徐汇', population:'潜在 30 万精致中餐客', gdpPerCapita:'人均可支配 8 万+',
        notes:'人均 200 元接受度高、出片文化强',
        scores:{a1:7, a2:8, a3:9, a4:8, c1:5, c2:5, c3:6, c4:6},
        e_indId:'a1', src_indId:'c1' },
      { id:'m3', name:'广州本店（老客+品牌升级）', region:'广州荔湾/珠江新城', population:'已有 600 万老客基础', gdpPerCapita:'人均可支配 6 万+',
        notes:'老店信任强，新店运营经验可复制',
        scores:{a1:6, a2:5, a3:6, a4:6, c1:10, c2:9, c3:10, c4:9},
        e_indId:'a1', src_indId:'c1' }
    ],
    matrix: { selectedMarketId:'m1', xCut:null, yCut:null, notes:'短期保 m3 广州本店老客，中期重点攻 m1 深圳（融合菜+抖音同城），长期考虑 m2 上海（人均高但师傅团队需扩展）。' },
    decision: {
      rationale: 'm1 深圳融合菜渗透高、抖音同城生态成熟、老陈 30 年粤菜功底+小陈运营可快速形成差异化，12 个月内可贡献 30% 营收；m3 老店稳定但增长见顶；m2 上海人均高但师傅团队仅 5 人风险大。',
      sequence: 'm3 广州本店品牌升级（0-6 月）→ m1 深圳开店（6-12 月）→ m2 上海开店（12+ 月）',
      risks: ['深圳选址失误','师傅团队复制跟不上','抖音同城运营人才招聘难','新城市客群对老店品牌认知弱'],
      nextSteps: '6 月内启动深圳选址+招 1 名店长+1 名探店博主运营；同步上线小程序会员+明厨亮灶直播。'
    }
  };

  if(typeof window!== 'undefined') window.__case_xiaohuo_ji_work2 = data;
})();
