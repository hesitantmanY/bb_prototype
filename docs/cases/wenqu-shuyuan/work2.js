/* ============================================================
 wenqu-shuyuan / work2 — 目标市场选择 (T09 filled)
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
    candidates: [{"id":"mc1","name":"艺考集训","reason":"客单价高但政策风险大","source":"user"},{"id":"mc2","name":"企业内训","reason":"周期长、客单高","source":"user"}],
    screening: { criteria: [] },
    retained: [{"id":"m1","name":"大学生/职场新人","region":"杭州/宁波/绍兴高校+职场","population":"约 200 万","gdpPerCapita":"家庭年收入 15-30 万","notes":"就业刚需强、客单价高、社交传播好","source":"user"},{"id":"m2","name":"K12 老客（鸡娃续费）","region":"3 校区周边家庭","population":"已有 1500 学员家庭","gdpPerCapita":"家庭年收入 25-50 万","notes":"老客粘性强，续费 70%","source":"user"},{"id":"m3","name":"30+ 转行者","region":"浙江省内待业/转行","population":"约 100 万","gdpPerCapita":"家庭年收入 10-20 万","notes":"人数多、就业兑现风险大","source":"user"}],
    attractiveness: { categories: buildCats(attractTemplate) },
    competitiveness: { categories: buildCats(competeTemplate) },
    scoring: { m1: { 'ind_经济_市场规模': {score: 8.5, source: 'user'}, 'ind_经济_客单价与': {score: 7.5, source: 'user'}, 'ind_政治法律_行业监管': {score: 9, source: 'user'}, 'ind_政治法律_广告法与': {score: 7, source: 'user'}, 'ind_社会文化_客群需求': {score: 8, source: 'user'}, 'ind_社会文化_种草 /': {score: 8.5, source: 'user'}, 'ind_风险_核心资源': {score: 7, source: 'user'}, 'ind_风险_新客获客': {score: 8.5, source: 'user'}, 'ind_市场信息_目标客群': {score: 8.5, source: 'user'}, 'ind_市场信息_竞品表现': {score: 7.5, source: 'user'}, 'ind_营销渠道_核心渠道': {score: 9, source: 'user'}, 'ind_营销渠道_KOL ': {score: 7, source: 'user'}, 'ind_认证合规_核心资质': {score: 8, source: 'user'}, 'ind_认证合规_关键背书': {score: 8.5, source: 'user'}, 'ind_产品品牌_现有老客': {score: 7, source: 'user'}, 'ind_产品品牌_C 端品': {score: 8.5, source: 'user'} }, m2: { 'ind_经济_市场规模': {score: 6, source: 'user'}, 'ind_经济_客单价与': {score: 5, source: 'user'}, 'ind_政治法律_行业监管': {score: 6.5, source: 'user'}, 'ind_政治法律_广告法与': {score: 4.5, source: 'user'}, 'ind_社会文化_客群需求': {score: 5.5, source: 'user'}, 'ind_社会文化_种草 /': {score: 6, source: 'user'}, 'ind_风险_核心资源': {score: 4.5, source: 'user'}, 'ind_风险_新客获客': {score: 6, source: 'user'}, 'ind_市场信息_目标客群': {score: 7.5, source: 'user'}, 'ind_市场信息_竞品表现': {score: 6.5, source: 'user'}, 'ind_营销渠道_核心渠道': {score: 8, source: 'user'}, 'ind_营销渠道_KOL ': {score: 6, source: 'user'}, 'ind_认证合规_核心资质': {score: 7, source: 'user'}, 'ind_认证合规_关键背书': {score: 7.5, source: 'user'}, 'ind_产品品牌_现有老客': {score: 6, source: 'user'}, 'ind_产品品牌_C 端品': {score: 7.5, source: 'user'} }, m3: { 'ind_经济_市场规模': {score: 7.5, source: 'user'}, 'ind_经济_客单价与': {score: 6.5, source: 'user'}, 'ind_政治法律_行业监管': {score: 8, source: 'user'}, 'ind_政治法律_广告法与': {score: 6, source: 'user'}, 'ind_社会文化_客群需求': {score: 7, source: 'user'}, 'ind_社会文化_种草 /': {score: 7.5, source: 'user'}, 'ind_风险_核心资源': {score: 6, source: 'user'}, 'ind_风险_新客获客': {score: 7.5, source: 'user'}, 'ind_市场信息_目标客群': {score: 4.5, source: 'user'}, 'ind_市场信息_竞品表现': {score: 3.5, source: 'user'}, 'ind_营销渠道_核心渠道': {score: 5, source: 'user'}, 'ind_营销渠道_KOL ': {score: 3, source: 'user'}, 'ind_认证合规_核心资质': {score: 4, source: 'user'}, 'ind_认证合规_关键背书': {score: 4.5, source: 'user'}, 'ind_产品品牌_现有老客': {score: 3, source: 'user'}, 'ind_产品品牌_C 端品': {score: 4.5, source: 'user'} } },
    delphi: {
      recruitment: { perspectives: [{"id":"p_brand","role":"教育品牌策略","why":"看 K12 转职教品牌迁移"},{"id":"p_growth","role":"职业课运营","why":"看就业转化路径"},{"id":"p_teacher","role":"资深职业课老师","why":"判断师资复制"},{"id":"p_hr","role":"本地企业 HRD","why":"看就业兑现可行性"},{"id":"p_student","role":"大学生 KOC","why":"翻译求职焦虑"}] },
      personas: [{"id":"pe1","name":"教育品牌策略","perspective":"看品牌迁移","stance":"中性"},{"id":"pe2","name":"职业课运营","perspective":"看转化","stance":"增长向"},{"id":"pe3","name":"职业课老师","perspective":"看师资","stance":"产品向"},{"id":"pe4","name":"企业 HRD","perspective":"看就业","stance":"渠道向"},{"id":"pe5","name":"大学生 KOC","perspective":"看决策","stance":"用户向"}],
      userHosted: true,
      finalWeights: {
        attractiveness: { 'ind_经济_市场规模':0.20, 'ind_经济_客单价':0.15, 'ind_政治法律_行业':0.10, 'ind_政治法律_广告':0.05, 'ind_社会文化_客群':0.15, 'ind_社会文化_渗透':0.10, 'ind_风险_资源':0.05, 'ind_风险_获客':0.05 },
        competitiveness: { 'ind_市场信息_目标':0.06, 'ind_市场信息_竞品':0.06, 'ind_营销渠道_核心':0.10, 'ind_营销渠道_KOL':0.08, 'ind_认证合规_资质':0.10, 'ind_认证合规_背书':0.10, 'ind_产品品牌_老客':0.15, 'ind_产品品牌_品牌':0.10 }
      },
      summary: "两轮 Delphi 后专家对\"增长率\"与\"师资基础\"赋权最高。大学生/职场新人客单价高、就业刚需强、老学员可推荐，6 个月内可贡献 30% 营收。",
      status: 'done',
      phase: 'converged',
      panel: [], round1: null, round2: null, synthesis: null, finalSynthesis: null, weights: null
    },
    matrix: { xCut: null, yCut: null, notes: "m1 大学生/职场新人客单价高、就业刚需强、老学员推荐可借力，6 个月内可贡献 30% 营收；m2 老客稳定但增长见顶；m3 转行者人数多但兑现风险大。" },
    decision: {
      explanations: {},
      tier1: { marketId:'m1', rationale:"m1 大学生/职场新人客单价高、就业刚需强、老学员推荐可借力，6 个月内可贡献 30% 营收；m2 老客稳定但增长见顶；m3 转行者人数多但兑现风险大。", resourcesPct:80, milestones:["6 月内招 2 名职业课老师+1 名就业对接","与 3-5 家本地企业签就业合作协议","上线小程序学习报告+作品墙"], reEvalTrigger:'3 个月复盘：核心指标未达预期' },
      tier2: { marketIds:["m2"], observationMetrics:['月复购率','客单价'], reEvalTrigger:'复购率连续 2 月 < 阈值' },
      tier3: { marketIds:["m3"], reEvalTrigger:'tier1 ROI 跑通后再启动' }
    },
    meta: { schemaVersion: 2, work1Linked: false },
    _pipeDone: ['framework','evaluate']
  };
  if(typeof window!== 'undefined') window.__case_wenqu_shuyuan_work2 = data;
})();
