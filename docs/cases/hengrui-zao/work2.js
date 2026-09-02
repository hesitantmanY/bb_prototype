/* ============================================================
 hengrui-zao / work2 — 目标市场选择 (T09 filled)
 v2 schema：与 Work2.defaultData() 严格对齐。
 2026-08-28: 升级 work2 数据到 v2（markets → retained/candidates、indicators 4×2 桶、
 Delphi Hybrid 2 字段、decision 三档），切换 case 时不再触发迁移 toast。
 ============================================================ */
(function(){
  const attractTemplate = [
    ['经济', ['市场规模 / 行业容量', '客单价与续费能力']],
    ['政治法律', ['行业监管 / 资质门槛', '广告法与合规风险']],
    ['社会文化', ['客群需求强度', '种草 / 社交渗透']],
    ['风险', ['核心资源复制难度', '新客获客成本']]
  ];
  const competeTemplate = [
    ['市场信息', ['目标客群数据可获取性', '竞品表现可监测']],
    ['营销渠道', ['核心渠道成熟度', 'KOL / 达人储备']],
    ['认证合规', ['核心资质完备度', '关键背书可复用']],
    ['产品品牌', ['现有老客基础可迁移', 'C 端品牌资产起点']]
  ];
  function buildCats(tpl){
    return tpl.map(([name, inds])=>({
      id:'cat_'+name, name, weight:0.25,
      indicators: inds.map(n=>({
        id:'ind_'+name+'_'+n.slice(0,4), name:n, weight:0.5,
        rubric:{high:'',mid:'',low:''}, support:0, source:'delphi'
      }))
    }));
  }
  const data = {
    candidates: [{"id":"mc1","name":"航空航天零部件","reason":"资质门槛极高、周期长","source":"user"},{"id":"mc2","name":"医疗器械整机","reason":"周期长、需临床数据","source":"user"}],
    screening: { criteria: [] },
    retained: [{"id":"m1","name":"专精特新中小品牌方","region":"苏州/宁波/东莞/深圳","population":"约 2000 家","gdpPerCapita":"营收 5000 万-5 亿","notes":"国产替代意愿强、客单价可接受","source":"user"},{"id":"m2","name":"工业采购经理（OEM 现有）","region":"汽车/医疗/3C 整机厂","population":"约 5000 家","gdpPerCapita":"营收 1 亿-100 亿","notes":"OEM 为主，少数接受自有品牌","source":"user"},{"id":"m3","name":"机器人/新领域（增长型）","region":"深圳/上海/杭州机器人厂","population":"约 500 家","gdpPerCapita":"营收 5000 万-10 亿","notes":"增速快、客单价高、新领域","source":"user"}],
    attractiveness: { categories: buildCats(attractTemplate) },
    competitiveness: { categories: buildCats(competeTemplate) },
    scoring: { m1: { 'ind_经济_市场规模': {score: 8.5, source: 'user'}, 'ind_经济_客单价与': {score: 7.5, source: 'user'}, 'ind_政治法律_行业监管': {score: 9, source: 'user'}, 'ind_政治法律_广告法与': {score: 7, source: 'user'}, 'ind_社会文化_客群需求': {score: 8, source: 'user'}, 'ind_社会文化_种草 /': {score: 8.5, source: 'user'}, 'ind_风险_核心资源': {score: 7, source: 'user'}, 'ind_风险_新客获客': {score: 8.5, source: 'user'}, 'ind_市场信息_目标客群': {score: 8.5, source: 'user'}, 'ind_市场信息_竞品表现': {score: 7.5, source: 'user'}, 'ind_营销渠道_核心渠道': {score: 9, source: 'user'}, 'ind_营销渠道_KOL ': {score: 7, source: 'user'}, 'ind_认证合规_核心资质': {score: 8, source: 'user'}, 'ind_认证合规_关键背书': {score: 8.5, source: 'user'}, 'ind_产品品牌_现有老客': {score: 7, source: 'user'}, 'ind_产品品牌_C 端品': {score: 8.5, source: 'user'} }, m2: { 'ind_经济_市场规模': {score: 6, source: 'user'}, 'ind_经济_客单价与': {score: 5, source: 'user'}, 'ind_政治法律_行业监管': {score: 6.5, source: 'user'}, 'ind_政治法律_广告法与': {score: 4.5, source: 'user'}, 'ind_社会文化_客群需求': {score: 5.5, source: 'user'}, 'ind_社会文化_种草 /': {score: 6, source: 'user'}, 'ind_风险_核心资源': {score: 4.5, source: 'user'}, 'ind_风险_新客获客': {score: 6, source: 'user'}, 'ind_市场信息_目标客群': {score: 7.5, source: 'user'}, 'ind_市场信息_竞品表现': {score: 6.5, source: 'user'}, 'ind_营销渠道_核心渠道': {score: 8, source: 'user'}, 'ind_营销渠道_KOL ': {score: 6, source: 'user'}, 'ind_认证合规_核心资质': {score: 7, source: 'user'}, 'ind_认证合规_关键背书': {score: 7.5, source: 'user'}, 'ind_产品品牌_现有老客': {score: 6, source: 'user'}, 'ind_产品品牌_C 端品': {score: 7.5, source: 'user'} }, m3: { 'ind_经济_市场规模': {score: 7.5, source: 'user'}, 'ind_经济_客单价与': {score: 6.5, source: 'user'}, 'ind_政治法律_行业监管': {score: 8, source: 'user'}, 'ind_政治法律_广告法与': {score: 6, source: 'user'}, 'ind_社会文化_客群需求': {score: 7, source: 'user'}, 'ind_社会文化_种草 /': {score: 7.5, source: 'user'}, 'ind_风险_核心资源': {score: 6, source: 'user'}, 'ind_风险_新客获客': {score: 7.5, source: 'user'}, 'ind_市场信息_目标客群': {score: 4.5, source: 'user'}, 'ind_市场信息_竞品表现': {score: 3.5, source: 'user'}, 'ind_营销渠道_核心渠道': {score: 5, source: 'user'}, 'ind_营销渠道_KOL ': {score: 3, source: 'user'}, 'ind_认证合规_核心资质': {score: 4, source: 'user'}, 'ind_认证合规_关键背书': {score: 4.5, source: 'user'}, 'ind_产品品牌_现有老客': {score: 3, source: 'user'}, 'ind_产品品牌_C 端品': {score: 4.5, source: 'user'} } },
    delphi: {
      recruitment: { perspectives: [{"id":"p_brand","role":"工业品牌策略","why":"看 OEM 转自有品牌路径"},{"id":"p_growth","role":"B2B 渠道运营","why":"看专精特新渠道渗透"},{"id":"p_engineer","role":"精密工艺工程师","why":"解读 0.005mm 精度壁垒"},{"id":"p_quality","role":"质量体系专家","why":"看 ISO 13485 迁移"},{"id":"p_buyer","role":"专精特新采购总监","why":"翻译国产替代决策"}] },
      personas: [{"id":"pe1","name":"工业品牌策略","perspective":"看品牌资产","stance":"中性"},{"id":"pe2","name":"B2B 渠道运营","perspective":"看渗透","stance":"增长向"},{"id":"pe3","name":"工艺工程师","perspective":"看精度","stance":"产品向"},{"id":"pe4","name":"质量体系专家","perspective":"看认证","stance":"合规向"},{"id":"pe5","name":"采购总监","perspective":"看替代","stance":"用户向"}],
      userHosted: true,
      finalWeights: {
        attractiveness: { 'ind_经济_市场规模':0.20, 'ind_经济_客单价':0.15, 'ind_政治法律_行业':0.10, 'ind_政治法律_广告':0.05, 'ind_社会文化_客群':0.15, 'ind_社会文化_渗透':0.10, 'ind_风险_资源':0.05, 'ind_风险_获客':0.05 },
        competitiveness: { 'ind_市场信息_目标':0.06, 'ind_市场信息_竞品':0.06, 'ind_营销渠道_核心':0.10, 'ind_营销渠道_KOL':0.08, 'ind_认证合规_资质':0.10, 'ind_认证合规_背书':0.10, 'ind_产品品牌_老客':0.15, 'ind_产品品牌_品牌':0.10 }
      },
      summary: "两轮 Delphi 后专家对\"增长率\"与\"制造基础\"赋权最高。专精特新中小品牌方国产替代意愿强、客单价可接受、愿意尝试新自有品牌，恒锐精密 30+ 年 OEM 经验可直接复用。",
      status: 'done',
      phase: 'converged',
      panel: [], round1: null, round2: null, synthesis: null, finalSynthesis: null, weights: null
    },
    matrix: { xCut: null, yCut: null, notes: "m1 专精特新中小品牌方国产替代意愿强、客单价可接受、愿意尝试新自有品牌，12 个月内可贡献自有品牌 60% 营收；m2 OEM 现有稳定但只认 OEM；m3 机器人新领域增速快但客户结构未验证。" },
    decision: {
      explanations: {},
      tier1: { marketId:'m1', rationale:"m1 专精特新中小品牌方国产替代意愿强、客单价可接受、愿意尝试新自有品牌，12 个月内可贡献自有品牌 60% 营收；m2 OEM 现有稳定但只认 OEM；m3 机器人新领域增速快但客户结构未验证。", resourcesPct:80, milestones:["6 月内招 1 名品牌运营+1 名电商运营","参加 SIMM/CIMT 展会发布自有品牌","官网+小程序上线\"恒锐造\"品牌页"], reEvalTrigger:'3 个月复盘：核心指标未达预期' },
      tier2: { marketIds:["m2"], observationMetrics:['月复购率','客单价'], reEvalTrigger:'复购率连续 2 月 < 阈值' },
      tier3: { marketIds:["m3"], reEvalTrigger:'tier1 ROI 跑通后再启动' }
    },
    meta: { schemaVersion: 2, work1Linked: false },
    _pipeDone: ['framework','evaluate']
  };
  if(typeof window!== 'undefined') window.__case_hengrui_zao_work2 = data;
})();
