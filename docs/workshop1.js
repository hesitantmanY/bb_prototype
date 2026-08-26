/* ============================================================
   WORKSHOP 1 — 业务价值体系
   Steps: sbu / environment / personas / survey / analysis / values / recommendations
   ============================================================ */
Work1.steps = [
  {id:'sbu', label:'1. SBU'},
  {id:'environment', label:'2. 环境'},
  {id:'personas', label:'3. 客户画像'},
  {id:'metrics', label:'4. 指标体系'},
  {id:'survey', label:'5. 合成调研'},
  {id:'analysis', label:'6. 数据分析'},
  {id:'values', label:'7. 价值框架'},
  {id:'recommendations', label:'8. 建议'}
];

Work1.defaultData = () => ({
  //  SBU（Step 1）
  sbu: {
    name:'', category:'', stage:'', scope:'', countries:[], summary:'',
    threeQuestions: { customer:false, channel:false, brand:false }, // 业务三问：任一为 true → 独立 SBU
    boundary:''   // 边界声明：与母公司客户/渠道/品牌/损益四维的隔离点与复用资源
  },
  //  环境（Step 2 业务基本情况 + Step 3 竞争者 + 我们的资源盘点）
  environment: {
    political:'', economic:'', social:'', technological:'',
    industry:'',
    // 业务基本情况：每维 实况/目标；最近业绩必含 市场份额/ROI/年增长率
    basics: {
      scale:    { actual:'', target:'', source:'' },
      scope:    { actual:'', target:'', source:'' },
      products: { actual:'', target:'', source:'' },
      customers:{ actual:'', target:'', source:'' },
      supply:   { actual:'', target:'', source:'' },
      performance: {
        share:  { actual:'', target:'', source:'' },
        roi:    { actual:'', target:'', source:'' },
        growth: { actual:'', target:'', source:'' }
      }
    },
    // 直接竞品对标（5-7 家）
    competitors: [
      // { id, name, price, strengths, weaknesses, position }
    ],
    // 我们的资源盘点（内部·我们视角）：5 维 + 3 段总结 + 收口 + 趋势
    ourCapabilities: {
      // 5 维能力（通用 5 维，适用于任何 SBU 行业）
      delivery:'',    // 交付：产品或服务
      core:'',        // 核心：能力/资源/关系
      brand:'',       // 品牌：资产/认知/溢价
      customer:'',    // 客户：触达/渠道/关系
      compliance:'',  // 合规：监管/资质/门槛
      // 3 段总结
      defensive:'', critical:'', structural:'',
      // 微笑曲线收口（曲线节点变化时自动推导，可手改；_vcSig 记录推导时的节点签名）
      smileCurve:'',
      _vcSig:'',
      // 关键趋势
      trends:''
    }
  },
  //  客户画像
  personas: [],   // {id, name, gender, age, occupation, income, region, values, painPoints, channels, quote, traits}
  // 场景级感知价值矩阵（Step 4：总利益4类 − 总成本4项，按场景）
  scenarios: [
    // { id, name, personaIds:[], benefits:{usage,service,staff,image}, costs:{monetary,time,energy,psychic}, anchor, decisiveGap }
  ],
  //  品牌资产指标体系（Step 5：CBBE 层级 + 1-10 双列评分）
  metrics: {
    dimensions: [
      { id:uid('m'), name:'品牌功效·产品', secondaries:[
        {id:uid('s'), name:'外观与质感', forecast:null, target:null, actual:null, measure:''},
        {id:uid('s'), name:'功能完整度', forecast:null, target:null, actual:null, measure:''},
        {id:uid('s'), name:'品控稳定性', forecast:null, target:null, actual:null, measure:''}
      ]},
      { id:uid('m'), name:'品牌功效·技术', secondaries:[
        {id:uid('s'), name:'核心技术指标', forecast:null, target:null, actual:null, measure:''},
        {id:uid('s'), name:'智能化与OTA', forecast:null, target:null, actual:null, measure:''},
        {id:uid('s'), name:'APP/服务体验', forecast:null, target:null, actual:null, measure:''}
      ]},
      { id:uid('m'), name:'品牌形象·知名度', secondaries:[
        {id:uid('s'), name:'主动识别率', forecast:null, target:null, actual:null, measure:''},
        {id:uid('s'), name:'搜索曝光', forecast:null, target:null, actual:null, measure:''},
        {id:uid('s'), name:'垂类引用', forecast:null, target:null, actual:null, measure:''}
      ]},
      { id:uid('m'), name:'品牌形象·竞争地位', secondaries:[
        {id:uid('s'), name:'对标优势数', forecast:null, target:null, actual:null, measure:''},
        {id:uid('s'), name:'心智占位', forecast:null, target:null, actual:null, measure:''},
        {id:uid('s'), name:'价格合理性', forecast:null, target:null, actual:null, measure:''}
      ]},
      { id:uid('m'), name:'品牌形象·品牌传播', secondaries:[
        {id:uid('s'), name:'UGC数量质量', forecast:null, target:null, actual:null, measure:''},
        {id:uid('s'), name:'KOL主动推荐', forecast:null, target:null, actual:null, measure:''},
        {id:uid('s'), name:'危机口碑', forecast:null, target:null, actual:null, measure:''}
      ]}
    ],
    disclaimerAcknowledged: false
  },
  //  合成调研
  survey: {
    questions: [],   // {id, type:'likert', text, anchors, sourceIndicatorId}
    responses: [],   // {personaId, answers:[{questionId, value, raw}]}
    n: 0,
    status:'idle',  // idle | running | paused | aborted | done | error
    mode:'api',
    useFewShot:true, useRag:false, ragContext:'',
    progress:{done:0,total:0},
    error:null,
    _doneKeys: []
  },
  //  数据分析
  analysis: {
    likertStats: {},   // questionId -> {mean, sd, dist:[5 counts]}
    openThemes: [],    // {questionId, question, texts, themes, quotes}
    indicatorMeans: [], // {sourceIndicatorId, mean(1-5), score(1-10)} 用于回填
    insights: ''
  },
  //  价值框架（Sheth 五维，调研后综合）
  values: {
    functional:[], emotional:[], social:[], epistemic:[], conditional:[],
    chosenFunctional:'', chosenEmotional:'', chosenSocial:'',
    rationale:''
  },
  //  改进建议
  recommendations: { short:'', mid:'', long:'', risks:[] }
});

const LIKERT5 = ['非常不同意','不同意','一般','同意','非常同意'];

Work1.renderStep = function(id){
  const sec = document.querySelector('#steps1 .step[data-step="'+id+'"]');
  if(!sec) return;
  if(sec.dataset.rendered==='1'){ Work1.refreshDynamic(id); return; }
  Work1._renderFull(sec, id);
};
// Force a full rebuild of a step (use after structural changes: add/delete/reorder).
Work1.rerender = function(id){
  const sec = document.querySelector('#steps1 .step[data-step="'+id+'"]');
  if(!sec) return;
  Work1._renderFull(sec, id);
};
Work1._renderFull = function(sec, id){
  sec.innerHTML='';
  const idx = Work1.steps.findIndex(s=>s.id===id);
  sec.appendChild(el('div',{class:'sub-head'},
    el('span',{class:'num'},'1.'+(idx+1)),
    el('h3',{}, Work1.titles[id])
  ));
  const subEl = Work1.subtitles && Work1.subtitles[id];
  if(subEl){
    sec.appendChild(el('p',{class:'lede', style:{fontFamily:'var(--font-display)', fontStyle:'normal', fontSize:'1.125rem', lineHeight:1.5, color:'var(--color-ink)', maxWidth:'62ch', margin:'0 0 28px'}}, subEl));
  }
  sec.appendChild(el('div',{class:'plate plate--empty'}));
  const dn=UI.demoNote(1,id); if(dn) sec.appendChild(dn);
  if(Work1.mvo && Work1.mvo[id]) sec.appendChild(UI.mvoCard(Work1.mvo[id](), sec));
  const fn = Work1.render[id];
  if(fn) fn(sec);
  sec.dataset.rendered='1';
};

// Minimum-viable-output criteria per step. Each check.test() returns bool.
Work1.mvo = {
  sbu: () => ({
    checks: [
      {label:'SBU 名称与品类已填', test:()=>!!(state.work1.sbu.name && state.work1.sbu.category)},
      {label:'选定了阶段与地理范围', test:()=>!!(state.work1.sbu.stage && state.work1.sbu.scope)},
      {label:'一句话概述已写', test:()=>(state.work1.sbu.summary||'').trim().length>=20},
      {label:'四维边界（客户/渠道/品牌/损益）已声明', test:()=>(state.work1.sbu.boundary||'').trim().length>=30},
    ],
    note:'SBU 没划清，后面所有分析都会跑偏。边界写不清时，先把"和母公司共享什么、区隔什么"列出来。'
  }),
  environment: () => ({
    checks: [
      {label:'PEST 四维至少各填一段', test:()=>['political','economic','social','technological'].every(k=>(state.work1.environment[k]||'').trim().length>10)},
      {label:'至少 3 家直接竞品对标', test:()=>state.work1.environment.competitors.length>=3},
      {label:'我们的能力 5 维（交付/核心/品牌/客户/合规）已盘点', test:()=>{const c=state.work1.environment.ourCapabilities||{};return ['delivery','core','brand','customer','compliance'].every(k=>(c[k]||'').trim().length>5);}},
    ],
    note:'竞品不要只写大牌——写同价位、同场景、客户会真的拿来比较的 5-7 家。'
  }),
  personas: () => ({
    checks: [
      {label:'至少 3 个客户画像', test:()=>state.work1.personas.length>=3},
      {label:'每个画像有痛点与价值观', test:()=>state.work1.personas.every(p=>(p.painPoints||'').trim().length>5 && (p.values||[]).length>0)},
      {label:'至少 1 个使用场景的价值矩阵', test:()=>(state.work1.scenarios||[]).length>=1},
    ],
    note:'画像不是人口统计卡片——关键是"TA 在什么场景下、因为什么痛、愿意为什么付钱"。'
  }),
  metrics: () => {
    const dims=state.work1.metrics.dimensions||[];
    const totalSec=dims.reduce((a,d)=>a+(d.secondaries||[]).length,0);
    const withScores=dims.some(d=>(d.secondaries||[]).some(s=>s.forecast!=null&&s.target!=null));
    return {checks:[
      {label:'至少 4 个一级指标', test:()=>dims.length>=4},
      {label:'每个一级指标至少 3 个测评点（合计 ≥12）', test:()=>totalSec>=12},
      {label:'已填首年预测分与三年目标分', test:()=>withScores},
    ],
    note:'这是"你认为品牌现在/未来值多少分"的主观评估，不是调研结果；实测分在合成调研后回填。'};
  },
  survey: () => ({
    checks: [
      {label:'至少 5 道李克特题', test:()=>state.work1.survey.questions.filter(q=>q.type==='likert').length>=5},
      {label:'合成调研已运行（有回答）', test:()=>state.work1.survey.responses.length>0},
    ],
    note:'这些回答由 AI 合成受访者生成，用于回填指标实测分和方向判断，不能替代真实问卷。'
  }),
  analysis: () => ({
    checks: [
      {label:'已生成李克特统计与回填', test:()=>Object.keys(state.work1.analysis.likertStats||{}).length>0},
      {label:'写了综合洞察（至少 3 条）', test:()=>(state.work1.analysis.insights||'').trim().length>30},
    ],
    note:'重点看"预测分 vs 实测分偏差 >1.5"的指标——那是认知断点，是价值主张的发力点。'
  }),
  values: () => ({
    checks: [
      {label:'选定了功能/情感/社会三条主轴', test:()=>!!(state.work1.values.chosenFunctional && state.work1.values.chosenEmotional && state.work1.values.chosenSocial)},
      {label:'写了取舍理由', test:()=>(state.work1.values.rationale||'').trim().length>20},
    ],
    note:'价值框架回答"客户为什么选你而不是别人"——三条主轴必须能被调研中的高/低分证据支撑。'
  }),
  recommendations: () => ({
    checks: [
      {label:'短期 / 中期 / 长期建议都已填', test:()=>['short','mid','long'].every(k=>(state.work1.recommendations[k]||'').trim().length>10)},
      {label:'列出了关键风险', test:()=>(state.work1.recommendations.risks||[]).some(r=>(r||'').trim().length>0)},
    ],
    note:'建议要能落地：谁做、做什么、什么时间。风险写"如果发生、怎么应对"，不要只写风险名词。'
  }),
};

Work1.titles = {
  sbu:'战略业务单元（SBU）',
  environment:'业务基本情况与竞争',
  personas:'客户画像与价值诉求',
  metrics:'价值体系（CBBE 指标评分）',
  survey:'合成消费者调研',
  analysis:'调研数据分析与回填',
  values:'客户价值框架',
  recommendations:'策略建议'
};
Work1.subtitles = {
  sbu:'用业务三问筛出独立 SBU，写清 SBU 声明与四维边界（客户/渠道/品牌/损益）。',
  environment:'PEST 宏观扫描 + 六维业务基本情况（实况/目标）+ 5-7 家竞品对标与微笑曲线。',
  personas:'3-6 个画像，并按场景拆 4×4 感知价值矩阵（总利益 − 总成本），定位决定性短板。',
  metrics:'≥5 个一级指标 × ≥3 测评点，每个测评点 1-10 分（首年预测/三年目标）；调研后回填实测分并算偏差。',
  survey:'验证层：让画像作为合成受访者回答李克特 5 点问卷，实测用于回填上一步。',
  analysis:'验证层：分布/均值/主题聚类，把李克特 1-5 均值映射为 1-10 回填指标实测分，标出分差 >1.5 的认知断点。',
  values:'调研后综合：从功能/情感/社会/认知/条件五维提炼客户价值要素。',
  recommendations:'按"先修最薄弱层、再修分差最大项"输出短中长期建议，风险单列。'
};

// 李克特 1-5 → 价值评分 1-10（线性映射，仅用于预测与实测对照，不宣称等价）
Work1.likertToScore = mean => (mean==null||isNaN(mean))?null:clamp(((mean-1)/4)*9+1, 1, 10);
// 把调研实测分回填到 metrics 二级指标的 actual
Work1.backfillScores = function(){
  const m=state.work1.metrics, a=state.work1.analysis, s=state.work1.survey;
  if(!m||!Array.isArray(m.dimensions)) return;
  const byId={};
  (a.indicatorMeans||[]).forEach(x=>{ if(x.sourceIndicatorId) byId[x.sourceIndicatorId]=x; });
  m.dimensions.forEach(dim=>(dim.secondaries||[]).forEach(s2=>{
    const im=byId[s2.id];
    s2.actual = im ? Work1.likertToScore(im.mean) : null;
  }));
};

Work1.render = {};

/* ---------- SBU 样本（顶层，跨函数可用） ----------
   暴露到 Work1 命名空间，方便 Work5 等其他模块在未渲染 SBU 步骤时
   也能链式触发填入。数据与下方 Work1.render.sbu 内嵌版本保持一致。 */
const REGION_COUNTRIES = {
  '国内': [],
  '东南亚': ['泰国','越南','印度尼西亚','马来西亚','菲律宾','新加坡','柬埔寨','老挝','缅甸','文莱'],
  '东亚（日韩）': ['日本','韩国'],
  '南亚（印度等）': ['印度','巴基斯坦','孟加拉国','斯里兰卡','尼泊尔'],
  '中东': ['沙特阿拉伯','阿联酋','以色列','土耳其','伊朗','卡塔尔','科威特','阿曼','约旦','埃及'],
  '欧洲': ['英国','法国','德国','意大利','西班牙','荷兰','瑞士','瑞典','挪威','丹麦','芬兰','波兰','葡萄牙','比利时','奥地利','爱尔兰'],
  '北美': ['美国','加拿大','墨西哥'],
  '拉美': ['巴西','阿根廷','智利','哥伦比亚','秘鲁','墨西哥'],
  '非洲': ['南非','尼日利亚','肯尼亚','埃及','摩洛哥','埃塞俄比亚','加纳'],
  '大洋洲': ['澳大利亚','新西兰','斐济'],
  '全球': []
};
const REGIONS = ['国内','东南亚','东亚（日韩）','南亚（印度等）','中东','欧洲','北美','拉美','非洲','大洋洲','全球'];

const SBU_SAMPLES = [
  {name:'HOTO 智能电动工具出海品牌', category:'电动工具', stage:'海外扩张期', scope:'北美', countries:['美国','加拿大'],
   summary:'智能电动工具 × 美国家庭 DIY × 中端品牌定位',
   boundary:'与集团共享华南工厂与模具开发资源，但客户全部为美国 DTC、独立亚马逊店铺、自有品牌 HOTO；损益独立核算，由海外事业部单列 P&L。'},
  {name:'CASA 设计师家居出海', category:'家居家具', stage:'成长期', scope:'欧洲', countries:['德国','法国','意大利','荷兰'],
   summary:'原创设计家居 × 欧洲 25-40 岁中产 × 中高端调性品牌',
   boundary:'设计端与上海工作室共享，供应链独立委托佛山/越南代工；客户为欧洲独立买手店与自建 DTC 站，渠道与母公司国内业务完全分开；品牌名/VI 独立注册。'},
  {name:'NUTRI 营养补剂出海', category:'健康保健', stage:'成长期', scope:'东南亚', countries:['新加坡','马来西亚','泰国','印尼','越南'],
   summary:'植物基营养补剂 × 东南亚 25-40 岁都市女性 × 轻奢健康品牌',
   boundary:'研发与原料采购复用集团供应链，但配方与剂量按东南亚法规独立备案；客户为本土药店、Shopee/Lazada 旗舰店与自建独立站；品牌 LOGO/包装/VI 全套独立设计；损益由海外事业部单列。'},
  {name:'LUMI 智能照明出海', category:'智能家居', stage:'转型期', scope:'欧洲', countries:['英国','德国','荷兰'],
   summary:'智能照明系统 × 欧洲公寓住户 × 中高端设计品牌',
   boundary:'硬件模组复用集团 IoT 平台，但客户端软件与场景套装欧洲本地化独立开发；客户为欧洲 B2B 公寓开发商 + C 端独立站；品牌完全独立露出。'},
  {name:'PETPAL 宠物食品出海', category:'宠物用品', stage:'初创期', scope:'北美', countries:['美国','加拿大'],
   summary:'鲜粮宠物食品 × 北美养宠中产 × 中端天然品牌',
   boundary:'完全独立创业项目；生产委托集团合作工厂（同等价格、第三方品控），客户全部为 DTC 订阅 + 独立宠物店；与集团其他业务在客户/渠道/品牌/损益四维完全独立。'},
  {name:'VEDA 印度草本个护', category:'美妆个护', stage:'成长期', scope:'南亚（印度等）', countries:['印度','斯里兰卡','孟加拉国'],
   summary:'阿育吠陀草本个护 × 印度 25-35 岁都市中产 × 中高端天然品牌',
   boundary:'原料采购与集团印度合作农场共享，配方独立开发、符合印度 BIS 标准；客户为印度本土连锁药妆店 + 自建 DTC 站 + Nykaa 旗舰店；品牌 LOGO/包装独立设计、含印地语标识；损益由南亚事业部单列。'},
  {name:'NURT 中东母婴辅食', category:'母婴食品', stage:'成长期', scope:'中东', countries:['阿联酋','沙特阿拉伯','卡塔尔'],
   summary:'有机婴幼儿辅食 × 中东高净值家庭 × 高端清真品牌',
   boundary:'原料与集团有机供应链共享，配方与认证按中东 Halal 与 SFDA 法规独立备案；客户为中东高端超市、皇室供应商与自建 DTC；品牌 VI 含阿拉伯语双标；损益由中东事业部单列。'},
  {name:'KAI 拉美手机配件', category:'消费电子', stage:'初创期', scope:'拉美', countries:['巴西','墨西哥','阿根廷'],
   summary:'高性价比手机壳膜 × 拉美年轻消费者 × 中端快时尚品牌',
   boundary:'生产完全委托集团深圳合作工厂，渠道与品牌 100% 独立（拉美本土 KOL + Mercado Libre + 自建站）；与集团其他业务在客户/渠道/品牌/损益四维完全独立。'},
];

function applySBU(s){
  const d = state.work1.sbu;
  if(!Array.isArray(d.countries)) d.countries=[];
  d.name = s.name; d.category = s.category || ''; d.stage = s.stage || '';
  d.scope = (REGIONS.includes(s.scope) ? s.scope : '');
  d.summary = s.summary || ''; d.boundary = s.boundary || '';
  if (REGION_COUNTRIES[d.scope] && d.scope !== '全球' && d.scope !== '国内') {
    d.countries = (s.countries || []).filter(c => REGION_COUNTRIES[d.scope].includes(c));
  } else {
    d.countries = [];
  }
  const r = Math.random();
  const yesCount = r < 0.5 ? 3 : r < 0.8 ? 2 : r < 0.95 ? 1 : 0;
  const qsArr = Object.keys(d.threeQuestions);
  for (let i = qsArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [qsArr[i], qsArr[j]] = [qsArr[j], qsArr[i]];
  }
  qsArr.forEach((k, i) => { d.threeQuestions[k] = (i < yesCount); });
}

// 暴露到 Work1 命名空间
Work1.SBU_SAMPLES = SBU_SAMPLES;
Work1.applySBU = applySBU;

Work1.render.sbu = function(sec){
  const plate = sec.querySelector('.plate');
  const d=state.work1.sbu;
  if(!Array.isArray(d.countries)) d.countries=[];


  // === 12-col magazine grid · SBU 基础字段 ===
  const grid = el('div', {class:'sbu-grid'});

  // SBU 名称（8 列 · 必填 echo）
  const nameField = el('div', {class:'sbu-cell-8 sbu-field'},
    el('span', {class:'sbu-label'}, 'SBU 名称'),
    el('input', {class:'sbu-input', type:'text', value: d.name, placeholder:'例：豆芽妈妈母婴洗护 / 问渠书院素质培训',
      oninput: e => { d.name = e.target.value; autosave(); App.updateSummary(); }}),
    el('div', {class:'sbu-value-echo'},
      el('span', {class:'dot'}),
      '必填 · 1 行'
    )
  );
  grid.appendChild(nameField);

  // 品类（4 列）
  grid.appendChild(el('div', {class:'sbu-cell-4 sbu-field'},
    el('span', {class:'sbu-label'}, '所属品类 / 行业'),
    el('input', {class:'sbu-input', type:'text', value: d.category, placeholder:'例：消费电子 / 智能家居 / 美妆个护',
      oninput: e => { d.category = e.target.value; autosave(); }})
  ));

  // 阶段（4 列） + 地理范围（8 列，含 scopeSelect）
  const stageSelect = el('select', {class:'sbu-select', onchange: e => { d.stage = e.target.value; autosave(); }},
    ...['','初创期','成长期','成熟期','转型期','海外扩张期'].map(o => {
      const text = o === '' ? '请选择阶段' : o;
      const opt = el('option', {value:o}, text); if (o === d.stage) opt.selected = true; return opt;
    })
  );
  grid.appendChild(el('div', {class:'sbu-cell-4 sbu-field'},
    el('span', {class:'sbu-label'}, '所处阶段'),
    stageSelect
  ));

  const scopeSelect = el('select', {class:'sbu-select', onchange: e => {
    d.scope = e.target.value;
    refreshCountryBlock();
    autosave();
  }}, ...[''].concat(REGIONS).map(o => {
    const text = o === '' ? '请选择地区' : o;
    const opt = el('option', {value:o}, text); if (o === d.scope) opt.selected = true; return opt;
  }));
  grid.appendChild(el('div', {class:'sbu-cell-8 sbu-field'},
    el('span', {class:'sbu-label'}, '地理范围'),
    scopeSelect
  ));

  // 国家多选 chip 块（始终在 DOM，避免布局抖动；按 scope 显示）
  const countriesChips = el('div', {class:'sbu-chips'});
  const countriesHint = el('div', {class:'sbu-countries-hint'});
  const countriesField = el('div', {class:'sbu-cell-12 sbu-field', style:'display:none'},
    el('span', {class:'sbu-label'}, '具体国家 ',
      el('span', {class:'muted', style:'text-transform:none;letter-spacing:0;font-style:normal;font-size:11px'}, '— 多选')),
    countriesChips,
    countriesHint
  );
  grid.appendChild(countriesField);

  // 一句话业务概述（12 列全宽）
  grid.appendChild(el('div', {class:'sbu-cell-12 sbu-field'},
    el('span', {class:'sbu-label'}, '一句话业务概述（SBU 声明）'),
    el('textarea', {class:'sbu-textarea', rows:2,
      placeholder:'用一句话讲清「为谁、解决什么问题、和竞品有何不同」。如：智能温控器 × 美国 C 端 × 中高端品牌',
      oninput: e => { d.summary = e.target.value; autosave(); }}, d.summary || '')
  ));

  function refreshHint(){
    const on = Array.from(countriesChips.querySelectorAll('.sbu-chip.on')).map(c => c.dataset.country);
    if (on.length === 0) {
      countriesHint.innerHTML = '<span class="dot"></span>未选 — 点击上面 chip 切换';
    } else {
      countriesHint.innerHTML = '<span class="dot"></span>已选 ' + on.length + ' 国 · ' + on.join('、');
    }
  }
  function refreshCountryBlock(){
    const showCountries = !!(d.scope && REGION_COUNTRIES[d.scope] && d.scope !== '全球' && d.scope !== '国内');
    if (!showCountries) {
      countriesField.style.display = 'none';
      d.countries = [];
      return;
    }
    countriesField.style.display = '';
    countriesChips.innerHTML = '';
    REGION_COUNTRIES[d.scope].forEach(c => {
      const chip = el('span', {class:'sbu-chip' + (d.countries.includes(c) ? ' on' : ''), 'data-country': c}, c);
      chip.addEventListener('click', () => {
        const idx = d.countries.indexOf(c);
        if (idx >= 0) d.countries.splice(idx, 1);
        else d.countries.push(c);
        chip.classList.toggle('on');
        refreshHint();
        autosave();
      });
      countriesChips.appendChild(chip);
    });
    refreshHint();
  }
  refreshCountryBlock();
  plate.appendChild(grid);

  // === Sub-head: STEP 1.1 · 业务三问 ===
  plate.appendChild(el('div', {class:'sbu-sub-head'},
    el('div', {class:'sbu-sub-head-left'},
      el('span', {class:'sbu-sub-num'}, 'STEP 1.1'),
      el('h3', {}, '业务三问（独立 SBU 自检）')
    ),
    el('span', {class:'sbu-sub-meta'}, '3 QUESTIONS · 任一为"是"即独立')
  ));
  plate.appendChild(el('p', {class:'sbu-sub-lead'},
    '三问中任一答"是"，即构成独立 SBU，须在客户/渠道/品牌/损益四维至少一项独立核算。'));

  // === Hallmark 3-col 卡片（沿用全局 .hallmark-item 3 列 grid） ===
  if (!d.threeQuestions || typeof d.threeQuestions !== 'object') d.threeQuestions = {customer:false, channel:false, brand:false};
  const tq = d.threeQuestions;
  const DIM_LABEL = {customer:'客户', channel:'渠道', brand:'品牌'};
  const qs = [
    ['customer', '客户是否不同？', 'B 端 / C 端、整机厂 / 经销商、自有用户 / 客户配套……'],
    ['channel', '渠道是否不同？', 'ODM 配套 / Amazon 零售 / 经销批销 / 自建 DTC……'],
    ['brand', '品牌是否独立露出？', '贴客户 logo / 自有 logo、 母品牌子品牌关系……']
  ];
  const list = el('div', {class:'hallmark-list'});
  qs.forEach((pair, i) => {
    const [k, head, hint] = pair;
    const dim = DIM_LABEL[k];
    const yes = !!tq[k];
    const item = el('article', {class:'hallmark-item', 'data-q':k, 'data-dim':dim});
    item.appendChild(el('div', {class:'hallmark-num'}, String(i+1).padStart(2,'0')));
    item.appendChild(el('div', {class:'hallmark-mid'},
      el('h4', {class:'hallmark-headline'}, head),
      el('p', {class:'hallmark-hint'}, hint)
    ));
    // 右列：segmented control（不 / 是）— 任一选中变黑底白字
    const noBtn = el('button', {
      type:'button',
      class:'sbu-seg' + (yes ? '' : ' is-on'),
      'data-q':k, 'data-val':'no',
      'aria-pressed': yes ? 'false' : 'true',
      'aria-label': head + '：不'
    }, '不');
    const yesBtn = el('button', {
      type:'button',
      class:'sbu-seg' + (yes ? ' is-on' : ''),
      'data-q':k, 'data-val':'yes',
      'aria-pressed': yes ? 'true' : 'false',
      'aria-label': head + '：是'
    }, '是');
    const seg = el('div', {class:'sbu-segmented', role:'group', 'aria-label':head}, noBtn, yesBtn);
    const status = el('span', {class:'sbu-seg-status'}, yes ? '独立 · ' + dim : '不独立');
    const right = el('div', {class:'hallmark-right'},
      el('div', {class:'sbu-seg-block'}, seg, status)
    );
    item.appendChild(right);
    list.appendChild(item);

    const onClick = (val) => {
      const isYes = (val === 'yes');
      tq[k] = isYes;
      noBtn.classList.toggle('is-on', !isYes);
      yesBtn.classList.toggle('is-on', isYes);
      noBtn.setAttribute('aria-pressed', !isYes ? 'true' : 'false');
      yesBtn.setAttribute('aria-pressed', isYes ? 'true' : 'false');
      status.textContent = isYes ? '独立 · ' + dim : '不独立';
      updateVerdict();
      autosave();
    };
    noBtn.addEventListener('click', () => onClick('no'));
    yesBtn.addEventListener('click', () => onClick('yes'));
  });
  plate.appendChild(list);

  // === Verdict 横条（一行结论） ===
  const anyIndependent = !!(tq.customer || tq.channel || tq.brand);
  const dims = [];
  if (tq.customer) dims.push('客户');
  if (tq.channel) dims.push('渠道');
  if (tq.brand) dims.push('品牌');
  const vText = el('span', {class:'v-text'}, anyIndependent
    ? ('独立 SBU · ' + dims.join(' / '))
    : '可能只是现有业务延伸'
  );
  const vBody = el('div', {class:'v-body'}, vText);
  const verdict = el('div', {class:'sbu-verdict', 'data-state': anyIndependent ? 'independent' : 'extension'},
    el('span', {class:'v-label'}, '→ 结论'),
    vBody,
    el('span', {class:'v-pill'}, anyIndependent ? 'Independent' : 'Extension')
  );
  plate.appendChild(verdict);

  function updateVerdict(){
    const any = !!(tq.customer || tq.channel || tq.brand);
    const ds = [];
    if (tq.customer) ds.push('客户');
    if (tq.channel) ds.push('渠道');
    if (tq.brand) ds.push('品牌');
    if (any) {
      verdict.dataset.state = 'independent';
      verdict.querySelector('.v-pill').textContent = 'Independent';
      verdict.querySelector('.v-text').textContent = '独立 SBU · ' + ds.join(' / ');
    } else {
      verdict.dataset.state = 'extension';
      verdict.querySelector('.v-pill').textContent = 'Extension';
      verdict.querySelector('.v-text').textContent = '可能只是现有业务延伸';
    }
  }
  updateVerdict(); // 用与勾选后一致的逻辑初始化判定文案

  // 监听三问按钮变化 → 同步 verdict 文字
  plate.addEventListener('click', e => {
    const btn = e.target.closest('button');
    if (btn && (btn.textContent === 'YES' || btn.textContent === 'NO' ||
        btn.textContent === '是' || btn.textContent === '不')) {
      setTimeout(updateVerdict, 0);
    }
  });

  // === 边界声明 CALLOUT（沿用全局 .callout，新增 .sbu-callout 修饰） ===
  const callout = el('div', {class:'callout sbu-callout'},
    el('span', {class:'c-label'}, ' 边界声明'),
    el('p', {class:'c-hint'}, '说明与母公司其他业务在客户、渠道、品牌、损益四维上的隔离点，以及复用/共享的资源（供应链、研发、资质等）。'),
    el('textarea', {
      placeholder:'例：与集团共享华南工厂与模具开发资源，但客户全部为美国 DTC、独立亚马逊店铺、自有品牌 HOTO；损益独立核算，由海外事业部单列 P&L。',
      oninput: e => { d.boundary = e.target.value; autosave(); }
    }, d.boundary || '')
  );
  plate.appendChild(callout);

  // === END 行 ===
  plate.appendChild(el('p', {class:'sbu-end'}, 'END · STEP 1'));
};

/* ---------- STEP 2: ENVIRONMENT ---------- */
/* ---------- 微笑曲线（Smile Curve）----------
   价值链 6 环节的 U 形附加值分布图。
   数据源优先级：
   1) d.valueChain（AI 起草推导 / 用户手动调整，含 reason 依据）
   2) demo case 预设（demo-data.js 各 case 的 valueChain.nodes）
   3) 通用 fallback（理论曲线）
   节点点击 → 行内改分（0-10），hover 显示分数依据（reason / tip）。
   曲线收口（ourCapabilities.smileCurve）随节点变化自动推导，可手改，
   供 Work3 定位 / Work5 策划书引用 —— 曲线是辅助，结论才是产出。
   用纯 SVG, 无外部依赖, 自适应宽度 (viewBox 800x320)。 */
Work1.smileCurveData = function(){
  const d = state.work1.environment;
  // 1) 用户/AI 推导数据
  if(Array.isArray(d.valueChain) && d.valueChain.length){
    return {nodes: d.valueChain, curveLabel:'我的价值链',
      curveTip:'AI 依据你的实况/竞品/资源盘点推导的附加值分布；点节点调整分数，改完自动更新下方结论。'};
  }
  // 2) demo case 预设
  const dc = (typeof state!=='undefined' && state.meta && state.meta.demoCase) || null;
  if (dc && typeof DemoData!=='undefined' && DemoData.cases && DemoData.cases[dc] && DemoData.cases[dc].meta && DemoData.cases[dc].meta.valueChain){
    const vc = DemoData.cases[dc].meta.valueChain;
    return {nodes: vc.nodes, curveLabel: vc.curve,
      curveTip:'本案例价值链: ' + vc.curve + ' — 6 节点附加值按行业实际分布。'};
  }
  // 3) 通用 fallback（适合任何 B2C / B2B）
  return {nodes:[
    {label:'创意/概念',  v:7.5, tip:'商业模式/用户洞察/选题'},
    {label:'研发/设计',  v:8.5, tip:'产品/课程/菜谱设计 — 高附加值'},
    {label:'采购/生产',  v:4.0, tip:'原料/代工/中央厨房 — 微笑曲线谷底'},
    {label:'渠道/触达',  v:5.0, tip:'渠道/媒介/平台/本地配送'},
    {label:'品牌/营销',  v:9.0, tip:'品牌/口碑/内容 — 最高附加值'},
    {label:'复购/服务',  v:6.0, tip:'客服/CRM/会员/续费'}
  ], curveLabel:'通用价值链',
    curveTip:'微笑曲线 (Stan Shih, 1992): 创意/设计与品牌营销两端附加值最高, 中段采购/生产最低。'};
};

// 曲线收口：从节点自动推导一句话结论（图只是辅助，结论才是给后续步骤的输入）
Work1.smileConclusion = function(){
  const nodes = (Work1.smileCurveData().nodes||[]).filter(n=>n && typeof n.v==='number');
  if(!nodes.length) return '';
  const min = nodes.reduce((a,b)=>a.v<=b.v?a:b);
  const max = nodes.reduce((a,b)=>a.v>=b.v?a:b);
  if(min.label===max.label || min.v===max.v){
    return `各环节附加值差异不大，建议从「${max.label}」环节（${max.v} 分）寻找差异化突破口。`;
  }
  return `当前价值链重心在「${min.label}」（${min.v} 分，全链最低），建议向「${max.label}」（${max.v} 分，全链最高）移动：把资源从低附加环节逐步挪向高附加环节，提升整体利润弹性。`;
};

// 按分数档位即时生成解释（拖动节点时本地给出"为什么是这个分"）。
// 阈值：高附加 ≥7、中段 4-6.9、低附加 ≤3.9
Work1.smileLocalReason = function(label, v){
  if(v >= 7)  return `${label} 处于高附加值区（${v}）：资源/能力/认知/价格力表现突出，是利润核心，建议持续投入并对外强化。`;
  if(v >= 4)  return `${label} 处于中段（${v}）：提供基础支撑，但难以独立溢价，需配合上下游环节放大价值。`;
  return `${label} 处于低附加值区（${v}）：标准品化或被替代风险高，外部采购/外包/数字化往往比自建更划算。`;
};

// 把 value 吸附到 0.5 步长
Work1._snapV = function(v){
  const s = Math.round(v / 0.5) * 0.5;
  return Math.max(0, Math.min(10, s));
};

Work1._vcSig = function(nodes){
  return (nodes||[]).map(n=>n.label+'#'+n.v).join('|');
};

Work1.renderSmileCurve = function(){
  const d = state.work1.environment;
  const cap = d.ourCapabilities || (d.ourCapabilities = {});
  const W=800, H=320, padL=60, padR=40, padT=30, padB=80;
  const cw=W-padL-padR, ch=H-padT-padB;
  const selNodes = () => Work1.smileCurveData().nodes;
  // SVG 几何：可重复调用的纯函数
  const xFor = (i) => padL + (i/(Math.max(1,(selNodes().length-1))))*cw;
  const yFor = (v) => padT + (1 - Math.max(0,Math.min(10,v)) / 10) * ch;
  const vForY = (y) => {  // 反推：pixel y → 分数 0-10
    const v = (1 - (y - padT) / ch) * 10;
    return Work1._snapV(v);
  };
  // 实时改分（不重绘，只更新该节点的圆+文字+title+线段），用于拖拽中
  const liveSetNode = (i, newV) => {
    const svg = wrap.querySelector('svg');
    if(!svg) return;
    const nodes = selNodes();
    nodes[i].v = newV;
    const cx = xFor(i), cy = yFor(newV);
    const c = svg.querySelector('circle.smile-node[data-idx="'+i+'"]');
    const tx = svg.querySelector('text[data-label-idx="'+i+'"]');
    const tv = svg.querySelector('text[data-value-idx="'+i+'"]');
    if(c){ c.setAttribute('cy', cy); c.setAttribute('r', 9); }  // 拖拽中放大
    if(tx){
      const labelY = newV >= 6 ? cy - 16 : cy + 24;
      tx.setAttribute('y', labelY);
    }
    if(tv){
      const valueY = newV >= 6 ? cy - 4 : cy + 36;
      tv.setAttribute('y', valueY);
      tv.textContent = '附加值 ' + newV;
    }
    // 重建曲线 path（节点圆心变了）
    const path = 'M ' + xFor(0) + ' ' + yFor(nodes[0].v) + nodes.slice(1).map((n,j)=>{
      const px = xFor(j), py = yFor(nodes[j].v), x = xFor(j+1), y = yFor(n.v);
      return ' C ' + (px+(x-px)*0.5) + ' ' + py + ', ' + (px+(x-px)*0.5) + ' ' + y + ', ' + x + ' ' + y;
    }).join('');
    const linePath = svg.querySelector('path.smile-line');
    const areaPath = svg.querySelector('path.smile-area');
    if(linePath) linePath.setAttribute('d', path);
    if(areaPath){
      const baseY = yFor(0);
      areaPath.setAttribute('d', path + ' L ' + xFor(nodes.length-1) + ' ' + baseY + ' L ' + xFor(0) + ' ' + baseY + ' Z');
    }
  };
  const buildSvg = (nodes) => {
    let path = `M ${xFor(0)} ${yFor(nodes[0].v)}`;
    for(let i=1; i<nodes.length; i++){
      const px = xFor(i-1), py = yFor(nodes[i-1].v);
      const x = xFor(i), y = yFor(nodes[i].v);
      const cx1 = px + (x-px)*0.5, cy1 = py;
      const cx2 = px + (x-px)*0.5, cy2 = y;
      path += ` C ${cx1} ${cy1}, ${cx2} ${cy2}, ${x} ${y}`;
    }
    const svgOpen = `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;max-height:380px;display:block;margin:0 auto">`;
    const grad = `<defs>
      <linearGradient id="smile-grad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="var(--color-ink)" stop-opacity="0.18"/>
        <stop offset="100%" stop-color="var(--color-ink)" stop-opacity="0.02"/>
      </linearGradient>
    </defs>`;
    const baseY = yFor(0);
    const areaPath = path + ` L ${xFor(nodes.length-1)} ${baseY} L ${xFor(0)} ${baseY} Z`;
    const labels = nodes.map((n,i) => {
      const x = xFor(i), y = yFor(n.v);
      const isHigh = n.v >= 6;
      const labelY = isHigh ? y - 16 : y + 24;
      const valueY = isHigh ? y - 4 : y + 36;
      const valueColor = n.v >= 7 ? 'var(--color-accent)' : (n.v <= 3 ? 'var(--color-ink-2)' : 'var(--color-ink)');
      const why = n.reason || n.tip || '';
      return `
        <g>
          <circle class="smile-node" data-idx="${i}" cx="${x}" cy="${y}" r="6" fill="var(--color-ink)"/>
          <text data-label-idx="${i}" x="${x}" y="${labelY}" text-anchor="middle" font-family="var(--font-display)" font-style="normal" font-size="14" fill="var(--color-ink)">${n.label}</text>
          <text data-value-idx="${i}" x="${x}" y="${valueY}" text-anchor="middle" font-family="var(--font-mono)" font-size="11" fill="${valueColor}">附加值 ${n.v}</text>
          <title>${n.label} · ${n.v} 分\n${why}</title>
        </g>`;
    }).join('');
    const axisY = yFor(0);
    const axis = `
      <line x1="${padL}" y1="${axisY}" x2="${W-padR}" y2="${axisY}" stroke="var(--color-rule)" stroke-width="1" stroke-dasharray="3,3"/>
      <text x="${padL-8}" y="${axisY+4}" text-anchor="end" font-family="var(--font-mono)" font-size="10" fill="var(--color-ink-2)">低</text>
      <text x="${padL-8}" y="${padT+10}" text-anchor="end" font-family="var(--font-mono)" font-size="10" fill="var(--color-ink-2)">高</text>
      <text x="${W-padR+8}" y="${axisY+4}" text-anchor="start" font-family="var(--font-mono)" font-size="10" fill="var(--color-ink-2)">价值链 →</text>
    `;
    const valley = `
      <text x="${xFor(2)}" y="${H-padB+20}" text-anchor="middle" font-family="var(--font-mono)" font-size="10" fill="var(--color-accent)" font-style="normal">↑ 微笑曲线谷底: 最低附加值</text>
    `;
    return svgOpen + grad
      + `<path class="smile-area" d="${areaPath}" fill="url(#smile-grad)"/>`
      + `<path class="smile-line" d="${path}" fill="none" stroke="var(--color-ink)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`
      + axis + labels + valley
      + `<text x="${W/2}" y="${H-10}" text-anchor="middle" font-family="var(--font-mono)" font-size="10" fill="var(--color-ink-2)" letter-spacing="0.15em">SMILE CURVE · 价值链附加值分布</text>`
      + `</svg>`;
  };
  const wrap = el('div', {class:'smile-curve-wrap', style:'margin:12px 0 18px;padding:12px 16px;background:var(--color-paper-2);border:1px solid var(--color-rule)'});
  const capEl = el('div', {class:'muted', style:'font-size:12px;line-height:1.6;margin-top:6px;color:var(--muted, #888)'});
  const concEl = el('div', {style:'margin-top:10px;padding:10px 12px;border-left:3px solid var(--color-accent);background:var(--color-paper);font-size:13px;line-height:1.7',
    contenteditable:'true',
    oninput:e=>{
      cap.smileCurve = e.target.textContent;
      d._vcSig = Work1._vcSig(selNodes());  // 手改后签名对齐，节点不变则不再重算
      autosave();
    }}, '');

  // 拖拽：把节点绑定 pointer events。SVG viewBox 内的 y 直接映射到分数
  const bindDrag = () => {
    const svg = wrap.querySelector('svg');
    if(!svg) return;
    const nodes = svg.querySelectorAll('circle.smile-node');
    nodes.forEach(c => {
      c.style.cursor = 'ns-resize';
      let dragging = false, idx = -1;
      const getY = (e) => {
        // 把 clientY 换算到 viewBox y
        const r = svg.getBoundingClientRect();
        const ratio = H / r.height;
        return (e.clientY - r.top) * ratio;
      };
      const onDown = (e) => {
        e.preventDefault();
        dragging = true; idx = Number(c.dataset.idx);
        c.setPointerCapture && c.setPointerCapture(e.pointerId);
        c.setAttribute('r', 9);
      };
      const onMove = (e) => {
        if(!dragging) return;
        const y = Math.max(padT, Math.min(padT + ch, getY(e)));
        const v = vForY(y);
        liveSetNode(idx, v);
        // 实时更新收口结论（拖拽中：仅更新收口，不落盘 + 不重写 svg）
        const derived = Work1.smileConclusion();
        concEl.textContent = derived;
        // hover 状态：拖动时强制显示解释（即使光标不在节点上）
        const cur = selNodes()[idx];
        if(cur) c.querySelector('title') && (c.querySelector('title').textContent = cur.label + ' · ' + cur.v + ' 分\n' + Work1.smileLocalReason(cur.label, cur.v));
      };
      const onUp = () => {
        if(!dragging) return;
        dragging = false;
        c.setAttribute('r', 6);
        // 把改动写回 valueChain（首次拖动前可能还在用预设/通用曲线）
        const cur = selNodes()[idx];
        if(!cur) return;
        if(!Array.isArray(d.valueChain) || !d.valueChain.length){
          d.valueChain = selNodes().map(n=>({label:n.label, v:n.v, reason:n.reason||n.tip||''}));
        } else if(!d.valueChain[idx]){
          d.valueChain[idx] = {label:cur.label, v:cur.v, reason:cur.reason||cur.tip||''};
        } else {
          d.valueChain[idx].v = cur.v;
        }
        d._vcSig = '';  // 节点变了 → 下次 build 重算收口
        autosave();
        // 重建：把 title 还原为"现在分数"对应的本地解释（让 hover 看到新解读）
        const n = selNodes()[idx];
        const title = svg.querySelector('circle.smile-node[data-idx="'+idx+'"] title');
        if(title){ title.textContent = n.label + ' · ' + n.v + ' 分\n' + Work1.smileLocalReason(n.label, n.v); }
        // 收口文本落定
        concEl.textContent = cap.smileCurve && d._vcSig === Work1._vcSig(selNodes()) ? cap.smileCurve : (cap.smileCurve = Work1.smileConclusion());
        d._vcSig = Work1._vcSig(selNodes());
        autosave();
      };
      c.addEventListener('pointerdown', onDown);
      c.addEventListener('pointermove', onMove);
      c.addEventListener('pointerup', onUp);
      c.addEventListener('pointercancel', onUp);
    });
  };

  const build = () => {
    const sig = Work1._vcSig(selNodes());
    if(sig !== d._vcSig || !(cap.smileCurve||'').trim()){
      const derived = Work1.smileConclusion();
      if(derived && (cap.smileCurve||'').trim() !== derived){
        cap.smileCurve = derived;
      }
      d._vcSig = sig;
    }
    const sel = Work1.smileCurveData();
    wrap.innerHTML = '';
    wrap.appendChild(el('div', {html: buildSvg(sel.nodes)}));
    capEl.textContent = sel.curveTip;
    concEl.textContent = cap.smileCurve || Work1.smileConclusion();
    wrap.appendChild(capEl);
    wrap.appendChild(el('div', {style:'margin-top:12px;font-size:11px;letter-spacing:.16em;color:var(--color-ink-2)'},
      '曲线收口 · 自动推导（可编辑，供 Work3 定位 / Work5 策划书引用）'));
    wrap.appendChild(concEl);
    // 拖拽使用提示
    wrap.appendChild(el('div', {style:'font-size:11px;color:var(--color-ink-2);margin-top:6px;letter-spacing:.02em'},
      '↑↓ 拖动节点调整分数（0-10，步长 0.5）；hover 看新解释'));
    bindDrag();
  };
  build();
  return wrap;
};

// 微笑曲线"必须先 AI 起草"门禁：无自定义曲线且非演示时显示占位 + 起草按钮
Work1.renderSmileCurveGate = function(){
  const d = state.work1.environment;
  const hasUserCurve = Array.isArray(d.valueChain) && d.valueChain.length>0;
  const inDemo = state.meta && state.meta.isDemo && state.meta.demoCase;
  if(hasUserCurve || inDemo) return Work1.renderSmileCurve();
  return el('div', {style:'margin:12px 0 18px;padding:24px 18px;background:var(--color-paper-2);border:1px dashed var(--color-rule);text-align:center'},
    el('div', {style:'font-size:13px;letter-spacing:.16em;color:var(--color-ink-2);margin-bottom:12px'},
      '微笑曲线 · 待起草'),
    el('p', {style:'font-size:13px;line-height:1.7;color:var(--color-ink-2);max-width:520px;margin:0 auto 16px'},
      'AI 会根据你的 SBU（业务、品类、阶段、实况）和前面填的 PEST/竞品推导一条属于你的微笑曲线；之后你可以在图上拖动节点修改分数。'),
    el('button', {class:'primary', id:'smile-draft-trigger'}, '让 AI 起草我的微笑曲线')
  );
};

Work1.render.environment = function(sec){
  const plate = sec.querySelector('.plate');
  const d=state.work1.environment;

  // migrate legacy string competitors → drop into a fresh array
  if(typeof d.competitors==='string'){ d._legacyCompetitors=d.competitors; d.competitors=[]; }
  if(!Array.isArray(d.competitors)) d.competitors=[];
  if(!d.basics || typeof d.basics!=='object') d.basics=Work1.defaultData().environment.basics;
  ['scale','scope','products','customers','supply'].forEach(k=>{ if(!d.basics[k]) d.basics[k]={actual:'',target:'',source:''}; });
  if(!d.basics.performance) d.basics.performance={share:{},roi:{},growth:{}};
  ['share','roi','growth'].forEach(k=>{ if(!d.basics.performance[k]) d.basics.performance[k]={actual:'',target:'',source:''}; });
  // 我们的资源盘点（首次渲染时做一次性迁移）
  if(!d.ourCapabilities || typeof d.ourCapabilities!=='object'){
    d.ourCapabilities={delivery:'',core:'',brand:'',customer:'',compliance:'',defensive:'',critical:'',structural:'',smileCurve:'',trends:''};
  }
  // 通用 5 维：旧字段名 → 新字段名（一次性迁移）
  const oldToNew = {manufacturing:'delivery', technology:'core', channel:'customer'};
  Object.keys(oldToNew).forEach(oldKey=>{
    if(d.ourCapabilities[oldKey] && !d.ourCapabilities[oldToNew[oldKey]]){
      d.ourCapabilities[oldToNew[oldKey]] = d.ourCapabilities[oldKey];
    }
    delete d.ourCapabilities[oldKey];
  });
  // 兼容旧数据：旧分散字段 d.edges → 迁移到 ourCapabilities（带字段名映射）
  if(d.edges && typeof d.edges==='object'){
    Object.keys(oldToNew).forEach(oldKey=>{
      if(d.edges[oldKey] && !d.ourCapabilities[oldToNew[oldKey]]){
        d.ourCapabilities[oldToNew[oldKey]] = d.edges[oldKey];
      }
    });
    ['brand','compliance','defensive','critical','structural','smileCurve'].forEach(k=>{
      if(d.edges[k] && !d.ourCapabilities[k]) d.ourCapabilities[k] = d.edges[k];
    });
  }
  // 兼容旧数据：旧合并文本 d.edgesText → 解析后填 ourCapabilities（一次性）
  if(typeof d.edgesText === 'string' && d.edgesText.trim()){
    const parseOldEdgesText = (txt) => {
      const out = {};
      // 匹配 【标签】内容（直到下一个【或结尾）
      const re = /【([^】]+)】([\s\S]*?)(?=【|$)/g;
      const map = {
        '制造':'delivery','技术':'core','品牌':'brand','渠道':'customer','合规':'compliance',
        '防御性优势':'defensive','关键劣势':'critical','结构性劣势':'structural',
        '微笑曲线收口':'smileCurve','关键趋势':'trends'
      };
      let m;
      while((m = re.exec(txt)) !== null){
        const key = map[m[1].trim()];
        if(key && !out[key]) out[key] = m[2].trim();
      }
      return out;
    };
    const parsed = parseOldEdgesText(d.edgesText);
    Object.keys(parsed).forEach(k=>{
      if(!d.ourCapabilities[k]) d.ourCapabilities[k] = parsed[k];
    });
  }
  // 兼容旧数据：环境顶层的 trends → 迁移到 ourCapabilities.trends
  if(d.trends && !d.ourCapabilities.trends) d.ourCapabilities.trends = d.trends;

  // —— AI 起草入口（step 开头，PEST 之前）——
  const aiWrap = el('div',{class:'ai-draft'});
  const aiBtn = el('button',{type:'button',class:'ai-draft-btn',
    onclick:()=>{
      API.aiButton({
        button:aiBtn, container:aiWrap, aiScope:'work1.environment',
        label:'起草环境与竞争分析',
        buildPrompt:()=>{
          // 实况（业务基本情况）作为 AI 起草的依据；目标可空不强制
          const basicsText=(()=>{
            const bb=d.basics||{};
            const kv=(label,obj)=> (obj && obj.actual && String(obj.actual).trim()) ? label+'='+obj.actual.trim() : null;
            const parts=[
              kv('规模',bb.scale), kv('范围',bb.scope), kv('产品',bb.products),
              kv('客户',bb.customers), kv('供应链',bb.supply),
              kv('市占',bb.performance&&bb.performance.share),
              kv('ROI',bb.performance&&bb.performance.roi),
              kv('年增',bb.performance&&bb.performance.growth)
            ].filter(Boolean);
            return parts.length ? '\n业务实况: '+parts.join('；') : '';
          })();
          return [{role:'system',content:'你是全球品牌战略顾问。基于 SBU 生成结构化市场分析。输出 JSON：{"political":"","economic":"","social":"","technological":"","industry":"市场格局摘要（活跃品牌/渗透率/价格带/垂直空白）","competitors":[{"name":"","price":"","strengths":"","weaknesses":"","position":""}],"ourCapabilities":{"delivery":"产品/服务交付能力（能交付什么？怎么交付？标准化？）","core":"核心能力/资源/关系（别人短期追不上的）","brand":"品牌资产/知名度/溢价能力","customer":"客户触达/渠道/关系","compliance":"监管/资质/准入门槛","defensive":"防御性优势（对手短期难复制的 1-2 点）","critical":"关键劣势（客户能直接感知的致命短板）","structural":"结构性劣势（受资源/位置限制、宜绕开）","smileCurve":"优势/劣势落在价值链哪一端、决定后续定位方向","trends":"3 个值得追踪的方向"},"valueChain":[{"label":"价值链环节名","v":0-10的分数,"reason":"为什么是这个分数——必须引用用户业务实况/竞品/资源盘点的具体事实作为依据"}]}。competitors 给 5-7 家同价位同场景直接竞品。valueChain 给 5-6 个环节（按该业务实际价值链命名，如：配方研发/原料采购/OEM代工/电商履约/品牌营销/客服会员），v 反映该环节对本业务的附加值高低，reason 必须基于用户提供的业务实况与能力盘点推导。'},
            {role:'user',content:`SBU: ${state.work1.sbu.name}\n品类: ${state.work1.sbu.category}\n阶段: ${state.work1.sbu.stage}\n范围: ${state.work1.sbu.scope}\n概述: ${state.work1.sbu.summary}${basicsText}`}];
        },
        onResult:r=>{
          if(!r){ showToast('解析失败'); return; }
          // 只填空白：用户已填的字段保留，AI 只补空缺
          ['political','economic','social','technological','industry'].forEach(k=>{ if(r[k] && !(d[k]||'').trim()) d[k]=r[k]; });
          if(Array.isArray(r.competitors) && r.competitors.length && !d.competitors.length){
            d.competitors=r.competitors.map(c=>({id:uid('c'),name:c.name||'',price:c.price||'',strengths:c.strengths||'',weaknesses:c.weaknesses||'',position:c.position||''}));
          }
          // 微笑曲线：AI 推导的 valueChain（仅在用户没有自定义曲线时写入）
          if(Array.isArray(r.valueChain) && r.valueChain.length && !(Array.isArray(d.valueChain) && d.valueChain.length)){
            d.valueChain = r.valueChain.map(x=>({
              label:String(x.label||'').trim()||'环节',
              v:Math.max(0,Math.min(10,Number(x.v)||0)),
              reason:String(x.reason||'').trim()
            }));
          }
          const cap = r.ourCapabilities || r.edges;
          if(cap && typeof cap==='object'){
            if(!d.ourCapabilities) d.ourCapabilities={};
            const oldToNew = {manufacturing:'delivery', technology:'core', channel:'customer'};
            Object.keys(cap).forEach(k=>{
              if(cap[k]!=null){
                const newKey = oldToNew[k] || k;
                if(!(d.ourCapabilities[newKey]||'').trim()) d.ourCapabilities[newKey] = cap[k];
              }
            });
          }
          autosave(); Work1.rerender('environment');
        }
      });
    }},
    el('span',{class:'ai-draft-title'},'用 AI 起草环境与竞争分析'),
    el('span',{class:'ai-draft-arrow'},'→')
  );
  aiWrap.appendChild(aiBtn);
  aiWrap.appendChild(el('p',{class:'ai-draft-hint'},
    '基于 SBU 一键生成 PEST 四维 · 市场格局 · 竞品 · 资源盘点 · 价值链。只填充空白项，已填内容不会被覆盖。'));
  plate.appendChild(aiWrap);

  // —— PEST ——
  const pest=[
    ['political',  'P', '政治 / 政策 / 法规'],
    ['economic',   'E', '经济 / 汇率 / 购买力'],
    ['social',     'S', '社会 / 文化 / 人口'],
    ['technological','T','技术 / 基础设施 / 渠道']
  ];
  const placeholders = {
    political: '例：东南亚华人对中国传统文化接受度高…',
    economic:  '例：新加坡 2023 年人均 GDP 约 USD 84,000…',
    social:    '例：华人 25–40 岁群体对节气、慢生活感兴趣…',
    technological:'例：Shopee、Lazada、跨境电商渗透率高…'
  };
  const grid=el('div',{class:'pest-grid'});
  pest.forEach(([k,letter,label])=>{
    const item=el('div',{class:'pest-item'});
    item.appendChild(el('div',{class:'pest-letter'}, letter));
    item.appendChild(el('span',{class:'pest-label'}, label));
    item.appendChild(el('textarea',{rows:5,placeholder:placeholders[k]||'',
      oninput:e=>{d[k]=e.target.value;autosave()}}, d[k]||''));
    grid.appendChild(item);
  });
  plate.appendChild(el('h3',{},'PEST 宏观扫描'));
  plate.appendChild(grid);
  plate.appendChild(el('hr',{class:'rule'}));

  // —— 业务基本情况（Step 2：六维实况/目标）——
  plate.appendChild(el('h3',{},'业务基本情况（实况 / 目标）'));
  plate.appendChild(el('p',{class:'sbu-sub-lead'},'用六维表把业务现状结构化。实况（当下或历史数据）是 AI 起草的依据，尽量填；目标（3-5 年期望值）定不下可以留空，不阻塞流程。'));
  // 表头：列名（实况建议填 / 目标可空）
  plate.appendChild(el('div',{class:'basics-head'},
    el('span',{class:'basics-head-label'},'维度'),
    el('span',{class:'basics-head-col'},'实况 · 当下/历史 · 建议填'),
    el('span',{class:'basics-head-col'},'目标 · 3-5 年期望 · 可空')
  ));
  const b=d.basics;
  const trio=(obj,phActual,phTarget)=>el('div',{class:'basics-trio'},
    el('input',{type:'text',value:obj.actual||'',placeholder:phActual||'实况（建议填）',oninput:e=>{obj.actual=e.target.value;autosave()}}),
    el('input',{type:'text',value:obj.target||'',placeholder:phTarget||'目标（可空）',oninput:e=>{obj.target=e.target.value;autosave()}}));
  const basicsRow=(title,obj,phA,phT)=>el('div',{class:'basics-row'},
    el('span',{class:'basics-label'},title), trio(obj,phA,phT));
  plate.appendChild(basicsRow('规模与员工', b.scale,
    '例：2019 年成立 · 120 人 · 深圳+东莞', '例：500 人 · 东南亚 3 国'));
  plate.appendChild(basicsRow('业务范围', b.scope,
    '例：ODM 代工 + 自有品牌出海', '例：自有品牌占比 60%'));
  plate.appendChild(basicsRow('产品 / 业务线', b.products,
    '例：3 条线 · 均价 $30-80 · 主销欧美', '例：8 条线 · SKU 破百'));
  plate.appendChild(basicsRow('客户', b.customers,
    '例：Amazon 卖家 + 区域经销商', '例：DTC 占比 40%'));
  plate.appendChild(basicsRow('供应链', b.supply,
    '例：华南代工厂 · 模具自研', '例：海外仓 + 本地组装'));
  plate.appendChild(el('div',{class:'basics-row'},
    el('span',{class:'basics-label'},'最近业绩 · 市场份额'), trio(b.performance.share,
      '例：2024 营收 ¥8,000w · 市占 3%', '例：市占 8%')));
  plate.appendChild(el('div',{class:'basics-row'},
    el('span',{class:'basics-label'},'最近业绩 · ROI'), trio(b.performance.roi,
      '例：营销 ROI 2.5', '例：ROI 4+')));
  plate.appendChild(el('div',{class:'basics-row'},
    el('span',{class:'basics-label'},'最近业绩 · 年增长率'), trio(b.performance.growth,
      '例：+35% YoY', '例：+50% YoY')));

  // —— 竞争者与我们的资源盘点（Step 3：内部·我们）——
  plate.appendChild(el('h3',{},'竞争者与资源盘点'));
  //plate.appendChild(el('p',{class:'sbu-sub-lead'},
    //'先看外部（市场 / 竞品），再看内部 。'));
  const mkField=(label,value,onInput,rows,ph)=>el('div',{class:'field field-h'},
    el('label',{},label), el('textarea',{rows,placeholder:ph||'',oninput:onInput},value||''));
  // 3.1 市场格局 [外部·市场]
  //plate.appendChild(el('h4',{class:'sub-section'},'3.1 市场格局 [外部·市场]'));
  plate.appendChild(mkField('市场格局摘要', d.industry, e=>{d.industry=e.target.value;autosave()}, 4,
    '这个市场由谁主导（活跃品牌数 / 头部）？渗透到什么程度（增量/替换）？区域与价格带怎么分布？是否存在未被占领的垂直定位空白？'));
  // 3.2 竞品对标 [外部·竞品]
  //plate.appendChild(el('h4',{class:'sub-section'},'3.2 竞品对标 [外部·竞品]'));

  // competitor table —— 语义定宽（窄列：竞品/价位；宽列：优势/劣势/相对位置），
  // 列宽固定不随内容变化；长文本列用自动增高 textarea，格内换行（Excel 式）。
  const autosize=ta=>{ ta.style.height='auto'; ta.style.height=ta.scrollHeight+'px'; };
  const tbl=el('table',{class:'data competitor-table'});
  tbl.appendChild(el('colgroup',{},
    el('col',{class:'c-name'}), el('col',{class:'c-price'}),
    el('col',{class:'c-str'}), el('col',{class:'c-weak'}),
    el('col',{class:'c-pos'}), el('col',{class:'c-del'})));
  tbl.appendChild(el('thead',{}, el('tr',{}, ...['竞品','价位','优势','劣势','我们的相对位置',''].map(h=>el('th',{},h)))));
  const tbody=el('tbody');
  d.competitors.forEach((c,i)=>{
    const inp=(key,ph)=>el('input',{type:'text',value:c[key]||'',placeholder:ph,
      oninput:e=>{c[key]=e.target.value;autosave()}});
    const txa=(key,ph)=>el('textarea',{rows:1,class:'cell-grow',placeholder:ph,
      oninput:e=>{c[key]=e.target.value;autosize(e.target);autosave()}},c[key]||'');
    const tr=el('tr',{},
      el('td',{}, txa('name','竞品名称')),
      el('td',{}, inp('price','价位')),
      el('td',{}, txa('strengths','优势')),
      el('td',{}, txa('weaknesses','劣势')),
      el('td',{}, txa('position','相对位置')),
      el('td',{}, el('button',{class:'ghost small',onclick:()=>{d.competitors.splice(i,1);autosave();Work1.rerender('environment')}},'×'))
    );
    tbody.appendChild(tr);
  });
  tbl.appendChild(tbody);
  plate.appendChild(tbl);
  // 挂载后再按内容设置初始高度（scrollHeight 需要布局完成）
  setTimeout(()=>tbl.querySelectorAll('textarea.cell-grow').forEach(autosize), 0);
  plate.appendChild(el('button',{class:'ghost',style:'margin:8px 0',onclick:()=>{
    d.competitors.push({id:uid('c'),name:'',price:'',strengths:'',weaknesses:'',position:''});
    autosave(); Work1.rerender('environment');
  }},'+ 添加竞品'));

  // 外部（3.1 市场 + 3.2 竞品）→ 内部（3.3 资源盘点）的分界
  plate.appendChild(el('hr',{class:'rule'}));

  // 3.3 我们的资源盘点（4 步手风琴：5 维 → 3 段 → 收口 → 趋势）
  plate.appendChild(el('h4',{},'资源盘点'));
  // 手风琴：4 步
  const cap = d.ourCapabilities;
  const capField = (label, key, ph, rows, extraClass) => {
    const labelDiv = el('div',{class:'cap-field-label'},
      label,
      el('span',{class:'zh'}, ph || '')
    );
    const value = cap[key] || '';
    const input = el('textarea',{
      class:'cap-field-input'+(extraClass?' '+extraClass:''),
      rows: rows||2,
      oninput: e => { cap[key] = e.target.value; autosave(); }
    });
    input.value = value;
    return el('div',{class:'cap-field'}, labelDiv, input);
  };
  // 步骤构造
  const mkAccStep = (idx, tag, title, question, openByDefault, contentFn) => {
    const id = 'cap-acc-' + Math.random().toString(36).slice(2,9);
    const item = el('article',{class:'cap-acc-item'+(openByDefault?' open':''), id:id},
      el('div',{class:'cap-acc-head', onclick:()=>{
        document.getElementById(id).classList.toggle('open');
      }},
        el('div',{class:'cap-acc-num'}, String(idx)),
        el('div',{class:'cap-acc-title-block'},
          el('span',{class:'cap-acc-tag'}, tag),
          el('span',{class:'cap-acc-title'}, title),
          el('span',{class:'cap-acc-question'}, question)
        ),
        el('div',{class:'cap-acc-arrow'}, '›')
      ),
      el('div',{class:'cap-acc-body'})
    );
    // 填充 body 内容
    const body = item.querySelector('.cap-acc-body');
    contentFn(body);
    return item;
  };
  // 第 1 步：5 维能力（默认展开）
  plate.appendChild(el('div',{class:'cap-accordion'},
    mkAccStep(1, '第 1 层 · 事实', '5 维能力', '我们有什么？客观描述家底清单，不需要下结论。', true, (body) => {
      body.appendChild(capField('交付', 'delivery', '产品或服务？我们能交付什么？'));
      body.appendChild(capField('核心', 'core', '别人没有的？能力/资源/关系？'));
      body.appendChild(capField('品牌', 'brand', '资产？知名度？溢价？'));
      body.appendChild(capField('客户', 'customer', '怎么找到？触达/渠道/关系？'));
      body.appendChild(capField('合规', 'compliance', '监管/资质/准入门槛？'));
    })
  ));
  // 第 2 步：3 段判断
  plate.appendChild(el('div',{class:'cap-accordion'},
    mkAccStep(2, '第 2 层 · 提炼（依赖第 1 层）', '3 段判断', '什么是真本事、什么是软肋？不能空想，必须从第 1 层 5 维里"找出来"。', false, (body) => {
      body.appendChild(capField('防御性优势', 'defensive', '对手短期难复制的 1-2 点（最值钱）'));
      body.appendChild(capField('关键劣势', 'critical', '客户能直接感知的致命短板'));
      body.appendChild(capField('结构性劣势', 'structural', '受资源/位置限制、宜绕开而非硬拼'));
      // 提炼依据说明
      const derive = el('div',{class:'cap-acc-derive'}, '3 段判断必须从第 1 层 5 维里提炼（如"制造"+ "技术" → 防御性优势）');
      body.appendChild(derive);
    })
  ));
  // 第 3 步：微笑曲线
  plate.appendChild(el('div',{class:'cap-accordion'},
    mkAccStep(3, '第 3 层 · 收敛（依赖第 2 层）', '微笑曲线收口', '优势/劣势落在价值链哪一端？这一句决定后续定位方向。', false, (body) => {
      // 微笑曲线图（SVG）: 价值链 6 环节, 左高-谷-右高的 U 形
      // 门禁：先 AI 起草（写入 d.valueChain）才显示曲线 + 拖拽；演示案例跳过
      const gate = Work1.renderSmileCurveGate();
      body.appendChild(gate);
      const draftBtn = gate.querySelector && gate.querySelector('#smile-draft-trigger');
      if(draftBtn){
        draftBtn.addEventListener('click', ()=>{
          // 委托给页面顶部的 AI 起草按钮（包含实况/竞品/资源盘点完整 prompt）
          const top = document.querySelector('button.ai-draft-btn');
          if(!top){ showToast('顶部 AI 起草入口未就绪'); return; }
          top.click();
        });
      }
      const callout = el('div',{class:'cap-field'});
      const labelDiv = el('div',{class:'cap-field-label'}, '一句话定位',
        el('span',{class:'zh'}, '优势/劣势落在价值链哪一端？'));
      const value = cap.smileCurve || '';
      const input = el('textarea',{
        class:'cap-field-input callout',
        rows: 3,
        oninput: e => { cap.smileCurve = e.target.value; autosave(); }
      });
      input.value = value;
      callout.appendChild(labelDiv);
      callout.appendChild(input);
      body.appendChild(callout);
    })
  ));
  // 第 4 步：关键趋势
  plate.appendChild(el('div',{class:'cap-accordion'},
    mkAccStep(4, '第 4 层 · 变量（独立观察）', '关键趋势', '未来 12-24 个月要盯什么？与第 3 层定位方向关联。', false, (body) => {
      body.appendChild(capField('3 个值得追踪的方向', 'trends', '例：节气营销、可追溯供应链、KOC 内容种草、私域订阅', 3));
      // AI 按钮放在第 4 步末尾
      body.appendChild(el('button',{class:'cap-ai-btn', onclick:()=>{
        // AI 一键生成：基于 SBU + 5 维 → 3 段 + 收口 + 趋势
        // 实际 AI 调用在下方 AI 盒子统一处理（防止重复按钮）
        showToast('请使用顶部"用 AI 起草环境与竞争分析"按钮');
      }}, '用 AI 起草（基于 5 维 → 生成 3 段 + 收口 + 趋势）'));
      body.appendChild(el('div',{class:'cap-ai-hint'}, '必须先填第 1 层 5 维，AI 才有素材生成第 2/3/4 层。'));
    })
  ));

};

/* ---------- STEP 3: PERSONAS ---------- */
Work1.render.personas = function(sec){
  const plate = sec.querySelector('.plate');
  // —— Step 4：场景级感知价值矩阵（4×4）——
  if(!Array.isArray(state.work1.scenarios)) state.work1.scenarios=[];
  const sc=state.work1.scenarios;
  plate.appendChild(el('h3',{},'场景级客户感知价值矩阵'));
  plate.appendChild(el('p',{class:'muted',style:'font-size:13px'},
    '客户感知价值 = 总利益（使用/服务/人员/形象）− 总成本（货币/时间/精力/心理）。按场景拆分（建议 2-4 个），每张矩阵勾选关联画像，并定位决定性短板（信任 / 易用 / 规模化成本）。'));

  const scList=el('div',{class:'scenario-list'});
  sc.forEach((s,i)=>{
    if(!s.benefits) s.benefits={usage:'',service:'',staff:'',image:''};
    if(!s.costs) s.costs={monetary:'',time:'',energy:'',psychic:''};
    if(!Array.isArray(s.personaIds)) s.personaIds=[];
    const card=el('article',{class:'scenario-card'});
    const head=el('div',{class:'scenario-head'},
      el('input',{type:'text',value:s.name||'',placeholder:'场景名（如：自用购买 / 送礼 / 复购）',
        style:{flex:'1',fontFamily:'var(--font-body)',fontSize:'18px',fontStyle:'normal',border:'none',borderBottom:'1px solid var(--color-rule)',background:'transparent'},
        oninput:e=>{s.name=e.target.value;autosave();}}),
      el('button',{class:'ghost small',onclick:()=>{sc.splice(i,1);autosave();Work1.rerender('personas')}},'删除场景'));
    card.appendChild(head);
    // persona association
    if(state.work1.personas.length){
      const pw=el('div',{class:'scenario-personas'}, el('span',{class:'mono',style:'font-size:11px;margin-right:8px'},'关联画像'));
      state.work1.personas.forEach((p, idx)=>{
        const cb=el('input',{type:'checkbox',checked:s.personaIds.includes(p.id),
          onchange:e=>{ if(e.target.checked){ if(!s.personaIds.includes(p.id)) s.personaIds.push(p.id); }else{ s.personaIds=s.personaIds.filter(x=>x!==p.id); } autosave(); }});
        // 显示"画像#N"而非名字, 名字过长会换行破坏 chip 布局
        pw.appendChild(el('label',{title:p.name, style:'display:inline-flex;gap:3px;align-items:center;margin-right:10px;font-size:13px;cursor:pointer;white-space:nowrap'},cb, document.createTextNode('画像 #' + (idx + 1))));
      });
      card.appendChild(pw);
    }
    const cell=(obj,key,ph)=>el('textarea',{rows:1,placeholder:ph,style:'min-height:32px;height:32px;resize:vertical',
      oninput:e=>{obj[key]=e.target.value;autosave()}},obj[key]||'');
    const grid=el('div',{class:'grid2',style:'gap:18px'});
    // 紧凑的小标题: 与下方输入区间距自适应(用相邻选择器去掉多余 margin)
    const ben=el('div',{class:'scenario-bloc'},
      el('h4',{class:'mono',style:'font-size:11px;letter-spacing:.1em;margin:0 0 4px 0;text-transform:uppercase;color:var(--color-ink-2)'},'总利益'),
      ...[['usage','使用价值：功能/性能/解决的问题'],['service','服务价值：售后/咨询/配送/维修'],['staff','人员价值：服务人员专业度与态度'],['image','形象价值：身份认同/心理满足']]
        .map(([k,ph])=>el('div',{style:'margin-bottom:6px'}, cell(s.benefits,k,ph))));
    const cst=el('div',{class:'scenario-bloc'},
      el('h4',{class:'mono',style:'font-size:11px;letter-spacing:.1em;margin:0 0 4px 0;text-transform:uppercase;color:var(--color-ink-2)'},'总成本'),
      ...[['monetary','货币成本：直接花费'],['time','时间成本：选购/等待/学习'],['energy','精力成本：挑选/对比/手续'],['psychic','心理成本：担心/焦虑/顾虑']]
        .map(([k,ph])=>el('div',{style:'margin-bottom:6px'}, cell(s.costs,k,ph))));
    grid.appendChild(ben); grid.appendChild(cst);
    card.appendChild(grid);
    card.appendChild(el('div',{style:'margin-top:8px'},
      el('div',{class:'mono',style:'font-size:11px;letter-spacing:.1em;margin:0 0 4px 0;text-transform:uppercase;color:var(--color-ink-2)'},'顾客价值锚点（客户真正用什么标尺评判，不是企业自评）'),
      el('input',{type:'text',value:s.anchor||'',placeholder:'如：送礼是否有面子、产地是否可信',oninput:e=>{s.anchor=e.target.value;autosave()}})));
    card.appendChild(el('div',{style:'margin-top:8px'},
      el('div',{class:'mono',style:'font-size:11px;letter-spacing:.1em;margin:0 0 4px 0;text-transform:uppercase;color:var(--color-ink-2)'},'决定性短板（信任 / 易用 / 规模化成本 中是哪个，一句话说明）'),
      el('input',{type:'text',value:s.decisiveGap||'',placeholder:'如：信任——客户无法验证产地真伪',oninput:e=>{s.decisiveGap=e.target.value;autosave()}})));
    scList.appendChild(card);
  });
  plate.appendChild(scList);
  const scActions=el('div',{class:'ai-actions'},
    el('button',{class:'ghost',onclick:()=>{sc.push({id:uid('sc'),name:'',personaIds:[],benefits:{},costs:{},anchor:'',decisiveGap:''});autosave();Work1.rerender('personas')}},'+ 添加场景'));
  if(state.work1.personas.length){
    const ai=el('div',{class:'ai-box'});
    const aiBtn=el('button',{class:'primary',onclick:()=>{
      API.aiButton({button:aiBtn,container:ai,aiScope:'work1.scenarios',
        buildPrompt:()=>[{role:'system',content:'你是用户研究专家。基于 SBU 与画像，输出 2-4 个客户场景的感知价值矩阵。JSON: {"scenarios":[{"name":"场景名","personaNames":["画像编号如P1"],"benefits":{"usage":"使用价值","service":"服务价值","staff":"人员价值","image":"形象价值"},"costs":{"monetary":"货币成本","time":"时间成本","energy":"精力成本","psychic":"心理成本"},"anchor":"顾客价值锚点","decisiveGap":"决定性短板：信任/易用/规模化成本中哪个 + 一句说明"}]}'},
          {role:'user',content:`SBU:${state.work1.sbu.name}\n品类:${state.work1.sbu.category}\n概述:${state.work1.sbu.summary}\n画像:\n${state.work1.personas.map(p=>`${p.name}: 痛点=${p.painPoints}; 价值观=${(p.values||[]).join('/')}; 渠道=${(p.channels||[]).join('/')}`).join('\n')}`}],
        onResult:r=>{
          if(!r||!Array.isArray(r.scenarios)){showToast('生成失败');return;}
          state.work1.scenarios=r.scenarios.map(x=>{
            const ids=state.work1.personas.filter(p=>(x.personaNames||[]).includes(p.name)).map(p=>p.id);
            return {id:uid('sc'),name:x.name||'',personaIds:ids,benefits:x.benefits||{},costs:x.costs||{},anchor:x.anchor||'',decisiveGap:x.decisiveGap||''};
          });
          autosave(); Work1.rerender('personas');
        }});
    }},'用 AI 预填场景矩阵');
    ai.appendChild(aiBtn); scActions.appendChild(ai);
  }
  plate.appendChild(scActions);
  plate.appendChild(el('hr',{class:'rule'}));

  // —— 画像卡片（沿用现有模式，不动）——
  plate.appendChild(el('h3',{},'客户画像'));
  const d=state.work1.personas;
  const list=el('div',{id:'personaList'});
  d.forEach((p,i)=>list.appendChild(Work1.personaCard(p, i)));
  plate.appendChild(list);
  plate.appendChild(el('div',{class:'row',style:{marginTop:'16px'}},
    el('button',{onclick:()=>{
      d.push({id:uid('p'),name:'',gender:'',age:'',occupation:'',income:'',region:'',values:[],painPoints:'',channels:[],quote:'',traits:''});
      autosave(); Work1.renderStep('personas');
    }},'+ 添加画像'),
    el('button',{class:'primary',onclick:()=>Work1.generatePersonas(sec)},'用 AI 生成画像')
  ));
};
Work1.personaCard = function(p, i){
  // Hallmark 重设计：每个画像 = 2 个 hallmark-item
  //   Item 1 (quote) : 全宽引言，无 number，作为画像"声音"的 headline
  //   Item 2 (main)  : 3-col 标准结构（number | 中段 | KEY POINTS）
  const idx = (i != null) ? i : 0;
  const num = String(idx+1).padStart(2,'0');
  // 1.2c: 自动把 p.name 同步为 "P1" 格式
  p.name = `P${idx+1}`;

  const block = el('div',{class:'persona-block'});

  // ============ Item 1: 大引言 (全宽, 无 number) ============
  const quoteItem = el('article',{class:'hallmark-item hallmark-persona hallmark-persona-quote'});
  quoteItem.appendChild(el('span',{class:'persona-row-label'}, 'TA 怎么说'));
  const quoteTextarea = el('textarea',{rows:2, class:'persona-quote', placeholder:'一句代表性引言（不带引号）', oninput:e=>{p.quote=e.target.value;autosave()}}, p.quote || '');
  quoteItem.appendChild(quoteTextarea);
  block.appendChild(quoteItem);

  // ============ Item 2: 画像主体 (3-col: 01 | 中段 | KEY POINTS) ============
  const bodyItem = el('article',{class:'hallmark-item hallmark-persona hallmark-persona-main'});
  bodyItem.appendChild(el('div',{class:'hallmark-num'}, num));

  const mid = el('div',{class:'hallmark-mid'});

  // Top row: 画像 #01 标签 + 删除按钮
  const nameRow = el('div',{class:'persona-name-row'});
  const nameLabel = el('div',{class:'persona-name-label'}, `画像 #${num}`);
  nameRow.appendChild(nameLabel);
  const delBtn = el('button',{class:'ghost small persona-del', onclick:()=>{
    state.work1.personas = state.work1.personas.filter(x=>x.id!==p.id);
    autosave(); Work1.renderStep('personas');
  }}, '删除');
  nameRow.appendChild(delBtn);
  mid.appendChild(nameRow);

  // Bio row: 性别 / 年龄 / 职业 / 收入 / 地区 (5-column)
  const grid = el('div',{class:'grid5 persona-grid'});
  const mkInput = (key, ph) => el('input',{type:'text', value:p[key]||'', placeholder:ph,
    oninput:e=>{p[key]=e.target.value;autosave()}});
  const genderSel = el('select',{class:'persona-gender', onchange:e=>{p.gender=e.target.value;autosave()}},
    ...['', '女', '男', '其他', '不透露'].map(v=>{
      const o = el('option',{value:v}, v==='' ? '性别' : v);
      if((p.gender||'')===v) o.selected = true;
      return o;
    })
  );
  grid.appendChild(genderSel);
  grid.appendChild(mkInput('age','年龄段 28'));
  grid.appendChild(mkInput('occupation','职业 品牌经理'));
  grid.appendChild(mkInput('income','收入 SGD 75k/年'));
  grid.appendChild(mkInput('region','地区 新加坡'));
  mid.appendChild(grid);

  // 痛点
  mid.appendChild(el('label',{class:'persona-row-label'}, '痛点 / 未被满足需求'));
  mid.appendChild(el('textarea',{rows:2, placeholder:'例：买茶不懂产地、害怕过度包装、送礼怕撞款',
    oninput:e=>{p.painPoints=e.target.value;autosave()}}, p.painPoints||''));

  // 核心价值观 tags
  mid.appendChild(el('label',{class:'persona-row-label'}, '核心价值观'));
  const ti = UI.tagsInput(p.values||[]);
  ti.el.querySelector('input').setAttribute('placeholder','输入后回车添加');
  ti.el.querySelector('input').addEventListener('blur',()=>{p.values=ti.get();autosave()});
  mid.appendChild(ti.el);

  // 常用渠道 tags
  mid.appendChild(el('label',{class:'persona-row-label'}, '常用渠道'));
  const tc = UI.tagsInput(p.channels||[]);
  tc.el.querySelector('input').setAttribute('placeholder','输入后回车添加');
  tc.el.querySelector('input').addEventListener('blur',()=>{p.channels=tc.get();autosave()});
  mid.appendChild(tc.el);

  bodyItem.appendChild(mid);

  // Right: KEY POINTS
  const right = el('div',{class:'hallmark-right'});
  right.appendChild(el('span',{class:'hallmark-label'}, 'KEY POINTS'));
  const valCount = (p.values||[]).length;
  const chanCount = (p.channels||[]).length;
  const summary = el('div',{class:'persona-summary'});
  summary.appendChild(el('div',{}, `${valCount} 个价值观`));
  summary.appendChild(el('div',{}, `${chanCount} 个渠道`));
  right.appendChild(summary);
  bodyItem.appendChild(right);

  block.appendChild(bodyItem);
  return block;
};
Work1.generatePersonas = function(container){
  if(state.work1.personas.length && !confirm('这会替换当前画像，继续？')) return;
  const ai=el('div',{class:'ai-box'});
  container.appendChild(ai);
  const btn=el('button',{class:'primary'},'生成中…');
  btn.disabled=true; ai.appendChild(btn);
  API.aiButton({
    button:btn, container:ai, aiScope:'work1.personas',
    buildPrompt:()=>[{role:'system',content:'你是消费者研究专家。基于 SBU 与目标市场，生成 4 个差异化的典型客户画像，男女比例均衡。gender 取值：女 / 男 / 其他 / 不透露。请使用编号 P1/P2/P3/P4 替代真实姓名（不要生成真实姓名）。输出 JSON: {"personas":[{"name":"","gender":"","age":"","occupation":"","income":"","region":"","values":[""],"painPoints":"","channels":[""],"quote":""}]}'},
      {role:'user',content:`SBU: ${state.work1.sbu.name}\n品类: ${state.work1.sbu.category}\n范围: ${state.work1.sbu.scope}\n概述: ${state.work1.sbu.summary}\n环境: ${state.work1.environment.industry||''}`}],
    onResult:r=>{
      if(!r || !Array.isArray(r.personas)){ showToast('生成失败'); return; }
      state.work1.personas = r.personas.map((p,i)=>({id:uid('p'),...p, gender: p.gender||'', name: `P${i+1}`}));
      autosave(); Work1.renderStep('personas');
    }
  });
};

/* ---------- STEP 4: METRICS (品牌资产指标体系) ---------- */

// Suggested first-level dimensions for an empty metrics set. Covers both
// brand performance (功效) and brand image (形象) so the CBBE structure is
// represented. Each comes with 3 starter secondary points to reduce the
// blank-page problem.
Work1.METRIC_TEMPLATES = [
  {name:'品牌功效·产品', secondaries:[
    {name:'外观与质感', measure:'5分制外观评分 / 退货率'},
    {name:'功能完整度', measure:'核心功能达成率'},
    {name:'品控稳定性', measure:'不良率 / 客诉率'}]},
  {name:'品牌功效·技术', secondaries:[
    {name:'核心技术指标', measure:'行业基准对标分'},
    {name:'智能化/OTA', measure:'活跃用户功能使用率'},
    {name:'APP/服务体验', measure:'应用商店评分'}]},
  {name:'品牌形象·知名度', secondaries:[
    {name:'主动识别率', measure:'无提示提及率 (%)'},
    {name:'辅助提及率', measure:'提示后提及率 (%)'},
    {name:'声量份额', measure:'社媒提及量份额'}]},
  {name:'品牌形象·竞争地位', secondaries:[
    {name:'首选率', measure:'购买首选占比'},
    {name:'溢价意愿', measure:'愿付溢价中位 %'},
    {name:'净推荐值 NPS', measure:'NPS 分数'}]},
  {name:'品牌形象·传播', secondaries:[
    {name:'信息记忆度', measure:'广告回忆率'},
    {name:'情感联结', measure:'品牌喜爱度 1-10'},
    {name:'文化契合', measure:'本地语境认同度'}]},
];

Work1.render.metrics = function(sec){
  const plate = sec.querySelector('.plate');
  if(!state.work1.metrics) state.work1.metrics={dimensions:[]};
  const m=state.work1.metrics;
  if(!Array.isArray(m.dimensions)) m.dimensions=[];

  // 评分性质声明（5.4.4 必加）
  plate.appendChild(el('div',{class:'notice disclaimer'},
    '评分性质说明：以下「首年预测分」「三年目标分」均为预测/目标值，非真实市场调研。完成 合成调研或导入真实问卷后，系统会用李克特 1-5 均值映射成 1-10 回填「实测分」，并保留预测值以对照偏差。'));

  // —— 评分标尺说明（解决"1-10 分到底怎么打"）——
  plate.appendChild(el('div',{class:'metric-legend'},
    el('strong',{},'怎么打分：'),
    el('span',{},'1-3 = 行业中下游/明显短板；4-6 = 行业平均/基本达标；7-8 = 行业前列/优势；9-10 = 品类标杆/难以复制。'),
    el('br'),
    el('strong',{},'三列分数：'),
    el('span',{},'「首年预测」=现在对第一年的判断；「三年目标」=希望达到的位置（目标应高于预测，中高端定位差距更大）；「实测」由调研回填。'),
    el('br'),
    el('strong',{},'量化口径：'),
    el('span',{},'每个测评点必须写清"用什么数据衡量"——没有口径的分数无法复核，也无法在调研后对照。')));

  // —— 空状态：建议的指标模板（点一下加入，不强制）——
  if(!m.dimensions.length){
    const sug=el('div',{},
      el('p',{class:'muted',style:'font-size:13px;margin:0 0 6px'},'还没有指标。可以点选下面的常用维度作为起点，再按你的业务增删改名（也可以直接用 AI 起草）：'));
    const chips=el('div',{class:'metric-suggest'});
    Work1.METRIC_TEMPLATES.forEach(t=>{
      chips.appendChild(el('button',{class:'metric-suggest-chip',type:'button',
        onclick:()=>{
          m.dimensions.push({id:uid('m'), name:t.name,
            secondaries:t.secondaries.map(s=>({id:uid('s'),name:s.name,measure:s.measure,forecast:null,target:null,actual:null}))});
          autosave(); Work1.rerender('metrics');
        }}, '+ '+t.name));
    });
    sug.appendChild(chips);
    plate.appendChild(sug);
  }

  // 评分表头
  const list=el('div',{class:'metric-list'});
  m.dimensions.forEach((dim,i)=>{
    if(!Array.isArray(dim.secondaries)) dim.secondaries=[];
    // 旧数据：二级可能是纯名字符串/无评分字段 → 补成对象
    dim.secondaries=dim.secondaries.map(s=>{
      if(s && typeof s==='object') return {forecast:null,target:null,actual:null,measure:'',...s};
      return {id:uid('s'), name:String(s), forecast:null,target:null,actual:null,measure:''};
    });

    const item=el('article',{class:'hallmark-item metric-dim'});
    item.appendChild(el('div',{class:'hallmark-num'}, String(i+1).padStart(2,'0')));

    const mid=el('div',{class:'hallmark-mid'});
    const nameInput=el('input',{type:'text',value:dim.name||'',placeholder:'一级指标名称（如：品牌功效·产品）',
      title:'把同类测评点归到一个一级指标下，例如"品牌功效·产品"或"品牌形象·知名度"',
      oninput:e=>{dim.name=e.target.value;autosave();}});
    Object.assign(nameInput.style,{fontFamily:'var(--font-body)',fontSize:'20px',fontStyle:'normal',width:'100%',border:'none',borderBottom:'1px solid var(--color-rule)',background:'transparent',padding:'4px 0'});
    mid.appendChild(nameInput);

    // secondary scoring rows
    const tbl=el('table',{class:'data metric-table'});
    const thead=el('tr',{}, ...['二级测评点','量化口径（怎么衡量/什么算高分）','首年预测','三年目标','实测','Δ'].map(h=>el('th',{},h)));
    tbl.appendChild(el('thead',{},thead));
    const tbody=el('tbody');
    const numIn=(s2,key,ph)=>{
      const inp=el('input',{type:'number',min:1,max:10,step:1,value:s2[key]==null?'':s2[key],
        style:{width:'58px',textAlign:'center'},
        title: key==='forecast' ? '首年预测分（1-10）：现在对第一年的判断'
             : key==='target' ? '三年目标分（1-10）：希望达到的位置，通常高于预测' : '',
        placeholder:ph||'',
        oninput:e=>{ const v=e.target.value===''?null:clamp(parseInt(e.target.value),1,10); s2[key]=v; e.target.value=v==null?'':v; autosave(); Work1.updateMetricSummary(); }});
      return inp;
    };
    dim.secondaries.forEach((s2,j)=>{
      const delta = (s2.actual!=null && s2.forecast!=null) ? (s2.actual - s2.forecast) : null;
      const deltaCell=el('td',{class:'metric-delta', title:'实测 − 预测；|Δ|>1.5 为认知断点（客户认知与你的判断差很多）'}, delta==null?'—':(delta>0?'+':'')+delta.toFixed(1));
      if(delta!=null && Math.abs(delta)>1.5) deltaCell.style.color='var(--color-accent)';
      const tr=el('tr',{},
        el('td',{}, el('input',{type:'text',value:s2.name||'',placeholder:'测评点名称（具体、可感知）',
          title:'写客户能感知的具体点，例如"产地溯源可信度"，不要写"品质好"这种空话',
          oninput:e=>{s2.name=e.target.value;autosave()}})),
        el('td',{}, el('input',{type:'text',value:s2.measure||'',placeholder:'如：NPS / 复购率 / 5分占比',
          title:'这个测评点用什么数据衡量？没有口径的分数无法复核',
          oninput:e=>{s2.measure=e.target.value;autosave()}})),
        el('td',{}, numIn(s2,'forecast','1-10')),
        el('td',{}, numIn(s2,'target','1-10')),
        el('td',{}, el('span',{class:'mono'}, s2.actual!=null?s2.actual.toFixed(1):'—')),
        deltaCell,
        el('td',{}, el('button',{class:'ghost small',onclick:()=>{dim.secondaries.splice(j,1);autosave();Work1.rerender('metrics')}},'×'))
      );
      tbody.appendChild(tr);
    });
    tbl.appendChild(tbody);
    mid.appendChild(tbl);
    mid.appendChild(el('button',{class:'ghost small',style:'margin-top:6px',onclick:()=>{
      dim.secondaries.push({id:uid('s'),name:'',forecast:null,target:null,actual:null,measure:''});
      autosave(); Work1.rerender('metrics');
    }},'+ 添加测评点'));
    item.appendChild(mid);

    const right=el('div',{class:'hallmark-right'});
    right.appendChild(el('span',{class:'hallmark-label'},'测评点'));
    right.appendChild(el('div',{class:'hallmark-count'}, el('span',{class:'hallmark-count-num'},dim.secondaries.length), document.createTextNode(' items')));
    right.appendChild(el('button',{class:'ghost small',style:'margin-top:8px',
      onclick:()=>{ if(confirm('删除一级指标「'+(dim.name||'')+'」及其测评点？')){ m.dimensions.splice(i,1); autosave(); Work1.rerender('metrics'); }}},'删除'));
    item.appendChild(right);
    list.appendChild(item);
  });
  plate.appendChild(list);

  // —— 完整性健康面板（比原来的一句话软校验更具体）——
  const issues=[];
  if(m.dimensions.length<4) issues.push('一级指标只有 '+m.dimensions.length+' 个，建议至少 4 个以覆盖品牌功效与品牌形象。');
  const shortDim=m.dimensions.filter(d=>(d.secondaries||[]).length<3).map(d=>d.name||'(未命名)');
  if(shortDim.length) issues.push('以下一级指标测评点少于 3 个：'+shortDim.join('、'));
  const noMeasure=[];
  m.dimensions.forEach(d=>(d.secondaries||[]).forEach(s=>{ if(!(s.measure||'').trim()) noMeasure.push(s.name||'(未命名)'); }));
  if(noMeasure.length) issues.push(noMeasure.length+' 个测评点缺量化口径（无法复核）。');
  const noScore=[];
  m.dimensions.forEach(d=>(d.secondaries||[]).forEach(s=>{ if(s.forecast==null||s.target==null) noScore.push(s.name||'(未命名)'); }));
  if(noScore.length) issues.push(noScore.length+' 个测评点还没打预测/目标分。');
  const health=el('div',{class:'metric-health'+(issues.length?'':' ok')});
  if(issues.length){
    health.appendChild(el('div',{}, el('strong',{},'待完善：')));
    const ul=el('ul',{});
    issues.forEach(t=>ul.appendChild(el('li',{},t)));
    health.appendChild(ul);
  }else{
    health.appendChild(el('div',{class:'mh-ok'},'指标体系结构完整。运行合成调研后，实测分会自动回填并标出认知断点。'));
  }
  plate.appendChild(health);

  // 整组与单项汇总
  const sum=el('div',{class:'metric-summary'});
  plate.appendChild(sum);
  sec._summaryEl=sum;
  Work1.renderMetricSummary(sum);

  const actions=el('div',{class:'ai-actions'},
    el('button',{class:'ghost',onclick:()=>{m.dimensions.push({id:uid('m'),name:'',secondaries:[]});autosave();Work1.rerender('metrics')}},'+ 添加一级指标'),
    (()=>{ const btn=el('button',{class:'primary',onclick:()=>{
      API.aiButton({button:btn, container:sec, aiScope:'work1.metrics',
        buildPrompt:()=>[{role:'system',content:'你是品牌资产管理专家。基于 CBBE ，设计 ≥5 个一级指标、每个 ≥3 测评点的价值体系，并为每个测评点给首年预测分与三年目标分（1-10，中高端定位目标应更高）与量化口径。必须同时覆盖「品牌功效」（产品/技术/体验）与「品牌形象」（知名度/竞争地位/传播）。输出 JSON: {"dimensions":[{"name":"一级指标名","secondaries":[{"name":"测评点","measure":"量化口径","forecast":6,"target":8}]}]}'},
          {role:'user',content:`SBU:${state.work1.sbu.name}\n品类:${state.work1.sbu.category}\n概述:${state.work1.sbu.summary}\n场景短板:\n${(state.work1.scenarios||[]).map(s=>s.name+': '+(s.decisiveGap||'')).join('\n')}\n画像痛点:\n${state.work1.personas.map(p=>p.name+':'+p.painPoints).join('\n')}`}],
        onResult:r=>{
          if(!r||!Array.isArray(r.dimensions)){showToast('生成失败');return;}
          m.dimensions=r.dimensions.map(d=>({id:uid('m'),name:d.name||'',
            secondaries:(d.secondaries||[]).map(s=>({id:uid('s'),name:String(s.name||''),measure:s.measure||'',forecast:s.forecast!=null?clamp(+s.forecast,1,10):null,target:s.target!=null?clamp(+s.target,1,10):null,actual:null}))}));
          autosave(); Work1.rerender('metrics');
        }});
    }},'用 AI 起草指标体系'); return btn; })()
  );
  plate.appendChild(el('hr',{class:'rule'}));
  plate.appendChild(actions);
};

// 汇总：按一级算整组均分 + 列单项偏差 extremes（避免单项拉高整组）
Work1.renderMetricSummary = function(box){
  if(!box) return;
  box.innerHTML='';
  const m=state.work1.metrics; if(!m||!Array.isArray(m.dimensions)) return;
  const all=[];
  const rows=[];
  m.dimensions.forEach(dim=>{
    const fc=(dim.secondaries||[]).filter(s=>s.forecast!=null).map(s=>s.forecast);
    const avg=fc.length? fc.reduce((a,b)=>a+b,0)/fc.length : null;
    rows.push({name:dim.name||'(未命名)', avg, n:fc.length});
    (dim.secondaries||[]).forEach(s=>{ if(s.forecast!=null) all.push(s); });
  });
  box.appendChild(el('h4',{},'汇总（整组均分/单项）'));
  const grid=el('div',{class:'grid3'});
  rows.forEach(r=>{
    grid.appendChild(el('div',{class:'plate',style:{padding:'10px 12px'}},
      el('div',{class:'mono',style:'font-size:11px;color:var(--color-ink-2)'},r.name),
      el('div',{style:'font-size:22px;font-family:var(--font-body);font-style:normal'},r.avg!=null?r.avg.toFixed(1):'—'),
      el('div',{class:'mono',style:'font-size:10px;color:var(--color-ink-2)'},r.n+' 个预测分')));
  });
  box.appendChild(grid);
  const withDelta=all.filter(s=>s.actual!=null);
  if(withDelta.length){
    withDelta.sort((a,b)=>(b.actual-b.forecast)-(a.actual-a.forecast));
    const best=withDelta[0], worst=withDelta[withDelta.length-1];
    box.appendChild(el('p',{class:'muted',style:'font-size:13px;margin-top:8px'},
      '实测偏差最大：'+(worst.actual-worst.forecast>0?'':'')+(worst.actual-worst.forecast).toFixed(1)+'（'+worst.name+'）；表现最好：+'+(best.actual-best.forecast).toFixed(1)+'（'+best.name+'）。|Δ|>1.5 为认知断点。'));
  }else{
    box.appendChild(el('p',{class:'muted',style:'font-size:13px;margin-top:8px'},'尚无实测分——运行  合成调研并完成  分析后，这里会显示回填偏差。'));
  }
};
Work1.updateMetricSummary = function(){
  const box=document.querySelector('#steps1 .step[data-step="metrics"] .metric-summary');
  if(box) Work1.renderMetricSummary(box);
};

/* ---------- STEP 5: SURVEY ---------- */
Work1.render.survey = function(sec){
  const plate = sec.querySelector('.plate');
  const s=state.work1.survey;
  if(!state.work1.personas.length){
    plate.appendChild(el('div',{class:'warning'},'请先在「客户画像」步骤至少添加一个画像。'));
    return;
  }
  // Survey responses are AI-synthesized; responses are not directly editable.
  plate.appendChild(el('h3',{},'问卷设计'));

  const ensureAnchors=q=>{ if(!Array.isArray(q.anchors)||q.anchors.length!==5) q.anchors=[...LIKERT5]; };

  const list=el('div',{class:'q-card-list'});

  // card drag-and-drop reordering
  let dragIdx=null;
  list.addEventListener('dragstart',e=>{
    const card=e.target.closest('.q-card'); if(!card) return;
    dragIdx=Number(card.dataset.idx); card.classList.add('dragging');
    e.dataTransfer.effectAllowed='move';
  });
  list.addEventListener('dragend',e=>{ const card=e.target.closest('.q-card'); if(card) card.classList.remove('dragging'); });
  list.addEventListener('dragover',e=>{
    const card=e.target.closest('.q-card'); if(!card||dragIdx===null) return;
    e.preventDefault(); e.dataTransfer.dropEffect='move';
  });
  list.addEventListener('drop',e=>{
    const card=e.target.closest('.q-card'); if(!card||dragIdx===null) return;
    e.preventDefault();
    const to=Number(card.dataset.idx);
    if(to!==dragIdx){
      const [moved]=s.questions.splice(dragIdx,1);
      s.questions.splice(to,0,moved);
      autosave(); Work1.rerender('survey');
    }
    dragIdx=null;
  });

  s.questions.forEach((q,i)=>{
    q.type='likert'; // 课件 work1 统一采用李克特5点量表（同仁堂/京东方/极狐案例）
    ensureAnchors(q);
    const card=el('article',{class:'q-card',draggable:'true','data-idx':i});

    // header: number · delete
    const head=el('header');
    head.appendChild(el('span',{class:'q-num'},'Q'+String(i+1).padStart(2,'0')));
    head.appendChild(el('span',{class:'q-type-tag'},'李克特 5 级'));
    head.appendChild(el('button',{class:'q-del ghost small',
      onclick:()=>{s.questions.splice(i,1);autosave();Work1.rerender('survey')}},'删除'));
    card.appendChild(head);

    // question text — 陈述句式（李克特量表要求同一构念的陈述加总计分）
    card.appendChild(el('input',{class:'q-text',type:'text',value:q.text,
      placeholder:'输入陈述，如：该品牌在产品品质方面表现稳定可靠',
      oninput:e=>{q.text=e.target.value;autosave()}}));

    // likert 5 anchors
    const ac=el('div',{class:'q-anchors'});
    ;[1,2,3,4,5].forEach((n,k)=>{
      const wrap=el('div',{class:'q-anchor'});
      wrap.appendChild(el('span',{class:'q-anchor-n'},String(n)));
      wrap.appendChild(el('input',{type:'text',value:q.anchors[k]||'',
        oninput:e=>{q.anchors[k]=e.target.value;autosave()}}));
      ac.appendChild(wrap);
    });
    card.appendChild(ac);
    list.appendChild(card);
  });
  plate.appendChild(list);

  // actions: generate from metrics + add blank
  const designerActions=el('div',{class:'ai-actions'});
  designerActions.appendChild(el('button',{class:'primary',onclick:()=>{
    const dims=state.work1.metrics.dimensions||[];
    const total=dims.reduce((n,d)=>n+(d.secondaries||[]).length,0);
    if(!total){ showToast('请先在「指标体系」中建立二级指标'); return; }
    const existing=new Set(s.questions.map(qq=>qq.sourceIndicatorId).filter(Boolean));
    let added=0;
    dims.forEach(d=>(d.secondaries||[]).forEach(s2=>{
      if(existing.has(s2.id)) return;
      s.questions.push({id:uid('q'),type:'likert',
        text:'我认可该品牌在「'+(s2.name||'')+'」方面的表现',
        options:[],anchors:[...LIKERT5],sourceIndicatorId:s2.id});
      added++;
    }));
    autosave(); Work1.rerender('survey');
    showToast(added? ('已根据指标生成 '+added+' 道李克特题'):'所有指标均已生成过题目');
  }},' 从指标体系生成李克特题目'));
  designerActions.appendChild(el('button',{class:'ghost',onclick:()=>{
    s.questions.push({id:uid('q'),type:'likert',text:'',options:[],anchors:[...LIKERT5],sourceIndicatorId:null});
    autosave(); Work1.rerender('survey');
  }},'+ 添加题目'));
  plate.appendChild(designerActions);

  plate.appendChild(el('hr',{class:'rule'}));
  plate.appendChild(el('h3',{},'运行合成调研'));

  // —— 调研密度三档（少量/标准/丰富）——
  // n = 每位画像重复回答的轮数。总回答数 = 画像数 × n。
  // 异质性预期依据 JM2025 Study 2：更多轮 + few-shot 能改善异质性与内部一致性。
  const TIERS=[
    {n:1, name:'少量', desc:'快速看方向', time:'约 10–20 秒', het:'异质性较低，仅看大致方向', tok:'约 3–6k', badge:''},
    {n:2, name:'标准', desc:'推荐默认',   time:'约 20–40 秒', het:'异质性较好，足够回填指标', tok:'约 6–12k', badge:'推荐'},
    {n:4, name:'丰富', desc:'更稳分布',   time:'约 40–90 秒', het:'异质性与一致性最好，成本更高', tok:'约 12–25k', badge:''},
  ];
  if(!s.n) s.n=2;
  const personaCount=state.work1.personas.length;
  const tierGrid=el('div',{class:'tier-grid'});
  TIERS.forEach(t=>{
    const total=Math.max(1,personaCount)*t.n;
    const card=el('div',{class:'tier-card'+(s.n===t.n?' active':''),type:'button',role:'radio','aria-checked':s.n===t.n?'true':'false',
      onclick:()=>{ s.n=t.n; autosave(); Work1.rerender('survey'); }},
      el('div',{class:'tier-card-head'},
        el('span',{class:'tier-card-name'},t.name),
        t.badge ? el('span',{class:'tier-card-badge'},t.badge) : null
      ),
      el('div',{class:'tier-card-meta'}, t.desc+' · 共 '+total+' 份回答'),
      el('div',{class:'tier-est'},
        el('div',{}, el('b',{},'时间'), ' '+t.time),
        el('div',{}, el('b',{},'异质性'), ' '+t.het),
        el('div',{}, el('b',{},'token'), ' '+t.tok)
      )
    );
    tierGrid.appendChild(card);
  });
  plate.appendChild(UI.field('调研密度', tierGrid));
  plate.appendChild(el('p',{class:'muted',style:'font-size:12px;margin:-4px 0 12px'},
    '总回答数 = 客户画像数（'+Math.max(1,personaCount)+'）× 每位画像重复轮数（'+s.n+'）。这些是 AI 合成受访者的模拟回答，不是真人问卷。'));

  const options=el('div',{class:'grid3'},
    UI.field((()=>{
      // 用 label + ⓘ tooltip 包裹; UI.field 默认是单 label + 单 widget, 这里直接返回 fragment
      const wrap = el('div', {class:'field'});
      wrap.appendChild(el('label',{},
        'Few-shot 示例',
        el('span',{class:'help-q', 'data-help':'Few-shot = 在 prompt 里附 1-3 条已填好的「画像 + 答案」示例, 让 LLM 模仿示例的答题风格与分布。\n• 关: 更快但答案更发散, 适合探索\n• 开 (推荐): 答案更稳定贴近画像人设, 适合做正式调研\n\n调参: 配合下方"每位画像重复样本数"使用, 一般 n=2-3, 配合 few-shot 足以收敛分布。'},
          '?')));
      const c=el('input',{type:'checkbox',checked:s.useFewShot,onchange:e=>{s.useFewShot=e.target.checked;autosave()}});
      c.style.width='auto';
      wrap.appendChild(c);
      return wrap;
    })()),
    UI.field('RAG 上下文（可选）', el('textarea',{rows:2,placeholder:'粘贴行业资料、评测数据等作为答题参考',oninput:e=>{s.ragContext=e.target.value;autosave()}},s.ragContext||''))
  );
  plate.appendChild(options);

  // progress & actions
  const bar=el('div',{class:'progress-bar'}, el('div',{style:{transform:'scaleX('+(s.progress.total? s.progress.done/s.progress.total:0)+')'}}));
  plate.appendChild(bar);
  const statusLine=el('p',{class:'mono',style:'font-size:11px;color:var(--color-ink-2)'}, Work1.surveyStatus());
  plate.appendChild(statusLine);
  const runBtn=el('button',{class:'primary',onclick:e=>Work1.runSurvey(e.currentTarget)},
    (s.status==='paused'||s.status==='aborted')?'继续合成调研':'运行合成调研');
  const actions=el('div',{class:'ai-actions'}, runBtn,
    el('button',{class:'ghost',onclick:()=>Work1.analyzeResponses()},'重新分析'),
    el('button',{class:'ghost',onclick:()=>{ if(confirm('清空已有回答？')){s.responses=[];s._doneKeys=[];s.status='idle';s.likertStats={};s.openThemes=[];autosave();Work1.rerender('survey');}}},'清空回答')
  );
  plate.appendChild(actions);
  if(s.error) plate.appendChild(el('div',{class:'warning'},s.error));
};
Work1.surveyStatus = function(){
  const s=state.work1.survey;
  if(s.status==='running') return `进行中 ${s.progress.done}/${s.progress.total}`;
  if(s.status==='paused') return `已暂停 · 已完成 ${s.progress.done}/${s.progress.total}（点继续）`;
  if(s.status==='done') return `完成 · 共 ${s.responses.length} 份回答`;
  if(s.status==='error') return '错误：'+s.error;
  return '就绪';
};
Work1.runSurvey = async function(button){
  const s=state.work1.survey;
  if(!s.questions.length){ showToast('请先添加题目'); return; }
  if(s.status==='running'){ showToast('调研进行中'); return; }
  // Resume support: keep existing responses + _doneKeys; only run missing units.
  if(!Array.isArray(s.responses)) s.responses=[];
  if(!Array.isArray(s._doneKeys)) s._doneKeys=[];
  const doneSet=new Set(s._doneKeys);
  const allTasks=[];
  state.work1.personas.forEach(p=>{
    for(let i=0;i<(s.n||1);i++) allTasks.push({persona:p, run:i, key:p.id+':'+i});
  });
  const tasks=allTasks.filter(t=>!doneSet.has(t.key));
  if(!tasks.length){ showToast('所有受访者已完成'); s.status='done'; Work1.analyzeResponses(); Work1.renderStep('survey'); return; }

  s.status='running'; s.error=null;
  s.progress={done:s._doneKeys.length, total:allTasks.length};
  Work1.refreshDynamic('survey');

  const task=Runner.start({id:'work1-survey', label:'合成调研', button, total:tasks.length, pausable:true,
    onPause:()=>{ s.status='paused'; Work1.refreshDynamic('survey'); autosave(); },
    onResume:()=>{ s.status='running'; Work1.refreshDynamic('survey'); }});
  if(!task){ s.status=s._doneKeys.length?('paused'):'idle'; return; }
  task.done=0; // count only this batch for the button progress
  Runner.renderUI();

  const concurrency=Math.min(4, tasks.length);
  let idx=0, failed=false;
  async function worker(){
    while(idx<tasks.length && !task.aborted && !failed){
      const u=tasks[idx++];
      try{
        const r=await Work1.askPersona(u.persona, s.questions, s.useFewShot, s.ragContext, task.controller.signal);
        if(r && Array.isArray(r.answers)) s.responses.push({personaId:u.persona.id, answers:r.answers});
        doneSet.add(u.key);
      }catch(e){
        if(task.aborted || (e && e.name==='AbortError')) break;
        s.error=e.message; failed=true; break;
      }
      s._doneKeys=[...doneSet];
      s.progress.done=s._doneKeys.length;
      task.done++;
      Work1.refreshDynamic('survey');
      autosave();
      try{ await Runner.checkpoint(); }catch{ break; }  // pause/abort gate
    }
  }
  try{
    await Promise.all(Array.from({length:concurrency},worker));
  }finally{
    const aborted=task.aborted;
    Runner.finish();
    if(aborted){
      s.status='paused';  // keep partial results, button shows 继续
    }else if(failed){
      s.status='error';
    }else{
      s.status='done';
      delete s._doneKeys;
      Work1.analyzeResponses();
      if(typeof AIProv!=='undefined') AIProv.mark('work1.survey');
    }
    autosave(); Work1.rerender('survey');
  }
};
Work1.askPersona = function(persona, questions, fewShot, rag){
  const qBlock = questions.map((q,i)=>{
    const a=Array.isArray(q.anchors)&&q.anchors.length===5?q.anchors:LIKERT5;
    return `Q${i+1}. ${q.text} （1=${a[0]}，2=${a[1]}，3=${a[2]}，4=${a[3]}，5=${a[4]}）`;
  }).join('\n');
  const sys=`你扮演以下具体消费者，以 TA 的口吻回答市场调研李克特5点量表。要符合画像的年龄、收入、价值观、痛点。按真实态度给 1-5 的整数，不要解释，直接输出 JSON。`;
  const schema=`{"answers":[${questions.map(q=>`{"questionId":"${q.id}","value":1-5的整数}`).join(',')}]}`;
  const userParts=[
    `画像：${persona.name}\n年龄：${persona.age}\n职业：${persona.occupation}\n收入：${persona.income}\n地区：${persona.region}\n价值观：${(persona.values||[]).join('、')}\n痛点：${persona.painPoints}\n渠道：${(persona.channels||[]).join('、')}\n语录：${persona.quote}`,
    `请回答以下问卷，输出符合 schema 的 JSON：\n${qBlock}\n\n输出 schema：\n${schema}`
  ];
  if(rag) userParts.push('参考资料（仅作为答题事实依据）：\n'+rag);
  if(fewShot){
    userParts.push('示例：\n{"answers":[{"questionId":"'+questions[0].id+'","value":4}]}');
  }
  return API.callJson([{role:'system',content:sys},{role:'user',content:userParts.join('\n\n')}],
    {signal: Runner.signal()});
};

Work1.analyzeResponses = function(){
  const s=state.work1.survey; const a=state.work1.analysis;
  a.likertStats={}; a.openThemes=[]; a.indicatorMeans=[];
  s.questions.forEach(q=>{
    if(q.type==='likert'){
      const vals=[]; const dist=[0,0,0,0,0];
      s.responses.forEach(r=>{
        const an=r.answers.find(x=>x.questionId===q.id);
        const v=parseInt(an?.value); if(!isNaN(v)&&v>=1&&v<=5){vals.push(v);dist[v-1]++;}
      });
      const m=mean(vals);
      a.likertStats[q.id]={mean:m,sd:sd(vals),dist,n:vals.length};
      a.indicatorMeans.push({label:q.text.length>22?q.text.slice(0,22)+'…':q.text, value:m, mean:m, sourceIndicatorId:q.sourceIndicatorId||null});
    } else if(q.type==='open'){
      const texts=[];
      s.responses.forEach(r=>{
        const an=r.answers.find(x=>x.questionId===q.id);
        if(an?.value) texts.push(String(an.value));
      });
      a.openThemes.push({questionId:q.id, question:q.text, texts});
    }
  });
  // 回填指标实测分（李克特 1-5 → 1-10）并重算 Δ
  Work1.backfillScores();
  autosave();
};

/* ---------- STEP 6: ANALYSIS ---------- */
Work1.render.analysis = function(sec){
  const plate = sec.querySelector('.plate');
  const a=state.work1.analysis; const s=state.work1.survey;
  if(!s.responses.length){ plate.appendChild(el('div',{class:'warning'},'尚无调研数据，请先运行合成调研。')); return; }

  plate.appendChild(el('h3',{},'Likert 题项分布'));
  s.questions.filter(q=>q.type==='likert').forEach(q=>{
    const stat=a.likertStats[q.id]; if(!stat) return;
    const an=Array.isArray(q.anchors)&&q.anchors.length===5?q.anchors:LIKERT5;
    const plate=el('section',{class:'plate'},
      el('span',{class:'plate-label'},`L14 · HUNDRED FIELD · ${q.text}`),
      el('div',{class:'row'},
        (()=>{const c=el('div'); renderHundredField(c, [
          {label:'5 '+an[4],count:Math.round(stat.dist[4]/stat.n*100),color:'#1a1a1a'},
          {label:'4 '+an[3],count:Math.round(stat.dist[3]/stat.n*100),color:'#3a3a3a'},
          {label:'3 '+an[2],count:Math.round(stat.dist[2]/stat.n*100),color:'#7a7a7a'},
          {label:'2 '+an[1],count:Math.round(stat.dist[1]/stat.n*100),color:'#bababa'},
          {label:'1 '+an[0],count:Math.round(stat.dist[0]/stat.n*100),color:'#e0e0e0'},
        ]); return c;})(),
        el('div',{},
          el('p',{class:'mono',style:'font-size:12px'},`n=${stat.n} · 均值 ${stat.mean.toFixed(2)} · SD ${stat.sd.toFixed(2)}`),
          el('p',{class:'muted',style:'font-size:13px'},q.text)
        )
      )
    );
    plate.appendChild(plate);
  });

  plate.appendChild(el('h3',{},'指标均值排名'));
  const barPlate=el('section',{class:'plate'}, el('span',{class:'plate-label'},'F5 · TICK ROWS · 指标均值'));
  const barC=el('div');
  renderBarChart(barC, a.indicatorMeans.slice().sort((x,y)=>y.value-x.value), {unit:''});
  barPlate.appendChild(barC); plate.appendChild(barPlate);

  // 预测/实测对照（Step 5 双列评分 + 回填偏差）
  const scored=[];
  (state.work1.metrics.dimensions||[]).forEach(dim=>(dim.secondaries||[]).forEach(s2=>{
    if(s2.forecast!=null || s2.actual!=null) scored.push({dim:dim.name, ...s2});
  }));
  if(scored.length){
    plate.appendChild(el('h3',{},'预测/实测回填'));
    const tbl=el('table',{class:'data'});
    tbl.appendChild(el('thead',{}, el('tr',{}, ...['一级指标','测评点','首年预测','三年目标','实测(1-10)','Δ(实测−预测)'].map(h=>el('th',{},h)))));
    const tb=el('tbody');
    scored.forEach(s2=>{
      const delta=s2.actual!=null&&s2.forecast!=null?(s2.actual-s2.forecast):null;
      const dc=el('td',{}, delta==null?'—':(delta>0?'+':'')+delta.toFixed(1));
      if(delta!=null&&Math.abs(delta)>1.5) dc.style.color='var(--color-accent)';
      tb.appendChild(el('tr',{},
        el('td',{},s2.dim||''), el('td',{},s2.name||''),
        el('td',{class:'mono'},s2.forecast??'—'), el('td',{class:'mono'},s2.target??'—'),
        el('td',{class:'mono'},s2.actual!=null?s2.actual.toFixed(1):'—'), dc));
    });
    tbl.appendChild(tb); plate.appendChild(el('section',{class:'plate'},
      el('span',{class:'plate-label'},'BACKFILL · 李克特 1-5 映射为 1-10'), tbl));
  }

  // open-ended with AI theme extraction (work1 默认全李克特，仅当存在开放题时显示)
  if(a.openThemes && a.openThemes.length){
  plate.appendChild(el('h3',{},'开放题主题'));
  const hmList = el('div',{class:'hallmark-list'});
  a.openThemes.forEach((ot, i)=>{
    const num = String(i+1).padStart(2, '0');
    const item = el('article',{class:'hallmark-item'});

    // Left: number
    item.appendChild(el('div',{class:'hallmark-num'}, num));

    // Middle: question (italic serif headline) + body
    const mid = el('div',{class:'hallmark-mid'});
    mid.appendChild(el('h4',{class:'hallmark-headline'}, ot.question));
    if(ot.themes && ot.themes.length){
      (ot.quotes||[]).slice(0,3).forEach(q=>{
        mid.appendChild(el('p',{class:'hallmark-quote'}, q));
      });
    } else {
      mid.appendChild(el('p',{class:'hallmark-empty'}, `共 ${ot.texts.length} 条文本，尚未生成主题。`));
      const btn=el('button',{class:'primary small',onclick:()=>Work1.extractThemes(ot,btn,item)},'用 AI 归纳主题');
      mid.appendChild(el('div',{class:'hallmark-action'}, btn));
    }
    item.appendChild(mid);

    // Right: HALLMARK label + theme rows
    const right = el('div',{class:'hallmark-right'});
    right.appendChild(el('span',{class:'hallmark-label'}, 'KEY POINTS'));
    if(ot.themes && ot.themes.length){
      const themes = el('div',{class:'hallmark-themes'});
      ot.themes.forEach(t=>{
        const row = el('div',{class:'hallmark-theme-row'});
        row.appendChild(el('span',{class:'hallmark-theme-label'}, t.label));
        row.appendChild(el('span',{class:'hallmark-theme-count'}, `×${t.count}`));
        themes.appendChild(row);
      });
      right.appendChild(themes);
    } else {
      right.appendChild(el('span',{class:'hallmark-empty'}, '—'));
    }
    item.appendChild(right);

    hmList.appendChild(item);
  });
  plate.appendChild(hmList);
  }

  plate.appendChild(el('h3',{},'综合洞察'));
  plate.appendChild(UI.field('AI 或自己撰写的综合洞察', el('textarea',{rows:6,oninput:e=>{a.insights=e.target.value;autosave()}},a.insights)));
  const insightAi=el('div',{class:'ai-box'});
  const insightBtn=el('button',{class:'primary',onclick:()=>{
    API.aiButton({
      button:insightBtn, container:insightAi, aiScope:'work1.analysis',
      buildPrompt:()=>[{role:'system',content:'你是市场研究总监。根据给定的描述性统计与开放题主题，撰写 5-8 条可执行洞察。输出 JSON: {"insights":"..."}'},
        {role:'user',content:Work1.surveyDigest()}],
      onResult:r=>{ if(r?.insights){ a.insights=r.insights; autosave(); Work1.renderStep('analysis'); } }
    });
  }},'用 AI 综合洞察');
  insightAi.appendChild(insightBtn);
  plate.appendChild(insightAi);
};
Work1.surveyDigest = function(){
  const s=state.work1.survey, a=state.work1.analysis;
  let out='SBU：'+state.work1.sbu.name+'\n\n';
  out+='Likert 题项均值：\n';
  s.questions.filter(q=>q.type==='likert').forEach(q=>{
    const st=a.likertStats[q.id];
    if(st) out+=`- ${q.text}: 均值 ${st.mean.toFixed(2)}，分布 ${st.dist.join('/')}\n`;
  });
  out+='\n开放题原文：\n';
  a.openThemes.forEach(ot=>{
    out+=`\n## ${ot.question}\n`;
    ot.texts.slice(0,15).forEach((t,i)=>out+=`${i+1}. ${t}\n`);
  });
  return out;
};
Work1.extractThemes = function(ot, btn, plate){
  API.aiButton({
    button:btn, container:plate, aiScope:'work1.analysis',
    buildPrompt:()=>[{role:'system',content:'你是定性研究分析师。从开放题答案中归纳 4-6 个主题。输出 JSON: {"themes":[{"label":"","count":0}],"quotes":[""]}'},
      {role:'user',content:`题目：${ot.question}\n\n回答：\n${ot.texts.map((t,i)=>`${i+1}. ${t}`).join('\n')}`}],
    onResult:r=>{
      if(r?.themes){ ot.themes=r.themes; ot.quotes=r.quotes||[]; autosave(); Work1.renderStep('analysis'); }
    }
  });
};

/* ---------- STEP 7: VALUES ---------- */
Work1.render.values = function(sec){
  const plate = sec.querySelector('.plate');
  const v=state.work1.values;
  // Normalize: some AI drafts return [{value,evidence,priority}], but the
  // tags editor (UI.tagsInput) expects plain string[]. Coerce on render.
  const dimKeys=['functional','emotional','social','epistemic','conditional'];
  dimKeys.forEach(k=>{
    if(!Array.isArray(v[k])) v[k]=[];
    v[k] = v[k].map(x=> typeof x==='string' ? x : (x && x.value) ? x.value : '').filter(s=>s);
  });
  const dims=[
    ['functional','功能性价值','解决具体问题 / 性能 / 可靠性'],
    ['emotional','情感性价值','感受 / 情绪 / 自我表达'],
    ['social','社会性价值','身份 / 归属 / 社交货币'],
    ['epistemic','认知性价值','新奇 / 学习 / 好奇心'],
    ['conditional','条件性价值','特定场景 / 时节 / 文化']
  ];
  // Hallmark-style 5-row layout: 01..05 | italic headline + description + tags | KEY POINTS
  const list = el('div',{class:'hallmark-list hallmark-value-list'});
  dims.forEach(([k,title,desc], i)=>{
    const num = String(i+1).padStart(2,'0');
    const item = el('article',{class:'hallmark-item'});

    // Left: number
    item.appendChild(el('div',{class:'hallmark-num'}, num));

    // Middle: title (italic serif) + description + tag input
    const mid = el('div',{class:'hallmark-mid'});
    mid.appendChild(el('h4',{class:'hallmark-headline'}, title));
    mid.appendChild(el('p',{class:'hallmark-hint'}, desc));
    const ti = UI.tagsInput(v[k] || []);
    ti.el.querySelector('input').addEventListener('blur',()=>{v[k]=ti.get();autosave()});
    // Re-render counter when tags change so KEY POINTS count updates
    ti.el.addEventListener('click',(e)=>{
      if(e.target.tagName==='BUTTON'){
        setTimeout(()=>{
          const c = item.querySelector('.hallmark-count-num');
          if(c) c.textContent = ti.get().length;
        },0);
      }
    });
    ti.el.querySelector('input').addEventListener('keydown',(e)=>{
      if(e.key==='Enter' && e.target.value.trim()){
        setTimeout(()=>{
          const c = item.querySelector('.hallmark-count-num');
          if(c) c.textContent = ti.get().length;
        },0);
      }
    });
    mid.appendChild(ti.el);
    item.appendChild(mid);

    // Right: KEY POINTS label + count
    const right = el('div',{class:'hallmark-right'});
    right.appendChild(el('span',{class:'hallmark-label'}, 'KEY POINTS'));
    const count = el('div',{class:'hallmark-count'},
      el('span',{class:'hallmark-count-num'}, (v[k]||[]).length),
      document.createTextNode(' values')
    );
    right.appendChild(count);
    item.appendChild(right);

    list.appendChild(item);
  });
  plate.appendChild(list);

  plate.appendChild(el('hr',{class:'rule'}));
  plate.appendChild(el('h3',{},'选定的三层核心价值'));

  // Helper for the four large-style fields below
  const mkH = (label, value, onInput, ph, isTA) => {
    const wrap = el('div',{class:'field field-h'});
    wrap.appendChild(el('label',{}, label));
    if(isTA){
      wrap.appendChild(el('textarea',{rows:4, placeholder:ph||'', oninput:onInput}, value||''));
    } else {
      wrap.appendChild(el('input',{type:'text', value:value||'', placeholder:ph||'', oninput:onInput}));
    }
    return wrap;
  };
  plate.appendChild(mkH('功能主轴', v.chosenFunctional, e=>{v.chosenFunctional=e.target.value;autosave()}, '例：可追溯原产地 · 节气限定'));
  plate.appendChild(mkH('情感主轴', v.chosenEmotional,  e=>{v.chosenEmotional=e.target.value;autosave()},  '例：慢生活仪式感 · 文化亲近'));
  plate.appendChild(mkH('社会主轴', v.chosenSocial,    e=>{v.chosenSocial=e.target.value;autosave()},    '例：高品位送礼场景 · 文化身份认同'));
  plate.appendChild(mkH('取舍理由', v.rationale,       e=>{v.rationale=e.target.value;autosave()},       '为什么是这三条？为什么放弃了另两条？', true));

  const ai=el('div',{class:'ai-box'});
  const btn=el('button',{class:'primary',onclick:()=>{
    API.aiButton({
      button:btn,container:ai,aiScope:'work1.values',
      buildPrompt:()=>[{role:'system',content:'你是品牌价值框架专家。根据 SBU、客户画像、调研洞察，提出功能/情感/社会/认知/条件 5 类价值要素，并从中选出三条主轴。输出 JSON: {"functional":[],"emotional":[],"social":[],"epistemic":[],"conditional":[],"chosenFunctional":"","chosenEmotional":"","chosenSocial":"","rationale":""}'},
        {role:'user',content:`SBU:${state.work1.sbu.name}\n画像:${state.work1.personas.map(p=>p.name+':'+p.painPoints).join('\n')}\n洞察:\n${state.work1.analysis.insights}`}],
      onResult:r=>{
        if(!r)return;
        ['functional','emotional','social','epistemic','conditional','chosenFunctional','chosenEmotional','chosenSocial','rationale'].forEach(k=>{ if(r[k]!=null) v[k]=r[k]; });
        autosave(); Work1.renderStep('values');
      }
    });
  }},'用 AI 起草价值框架');
  ai.appendChild(btn); plate.appendChild(ai);
};

/* ---------- STEP 8: RECOMMENDATIONS ---------- */
Work1.render.recommendations = function(sec){
  const plate = sec.querySelector('.plate');
  const r=state.work1.recommendations;
  // Hallmark layout: 4 rows (short / mid / long / risks), NO hairlines, NO color change
  const list = el('div',{class:'rec-list'});
  const mkItem = (idx, num, title, value, onInput, ph, time) => {
    const item = el('article',{class:'rec-item'});
    item.appendChild(el('div',{class:'hallmark-num'}, num));
    const mid = el('div',{class:'hallmark-mid'});
    // Time tag + title on one line (no underline, no color change per user request)
    const head = el('div',{class:'rec-head'});
    if(time) head.appendChild(el('span',{class:'rec-time'}, time));
    head.appendChild(el('span',{class:'rec-title'}, title));
    mid.appendChild(head);
    mid.appendChild(el('textarea',{rows:4, placeholder:ph||'', oninput:onInput}, value||''));
    item.appendChild(mid);
    // Right: empty for now (could add duration / KPI placeholder later)
    item.appendChild(el('div',{class:'hallmark-right'}));
    return item;
  };
  list.appendChild(mkItem(0, '01', '短期（0–6 个月）', r.short, e=>{r.short=e.target.value;autosave()}, '例：新加坡 Tang Plaza 上架节气礼盒 + 茶具订阅；3 位 KOC 拍摄开盒与冲泡。'));
  list.appendChild(mkItem(1, '02', '中期（6–18 个月）', r.mid,   e=>{r.mid=e.target.value;autosave()},   '例：吉隆坡 Pavilion 快闪 + 雅加达清真认证产品线；上线小程序 AR 溯源。'));
  list.appendChild(mkItem(2, '03', '长期（18 个月+）',  r.long,  e=>{r.long=e.target.value;autosave()},  '例：建立东南亚茶师驻地项目，与本地陶艺师合作限定茶具，形成年度 IP。'));
  // Risks: number + title + tags input (no textarea)
  const risksItem = el('article',{class:'rec-item'});
  risksItem.appendChild(el('div',{class:'hallmark-num'}, '04'));
  const risksMid = el('div',{class:'hallmark-mid'});
  const risksHead = el('div',{class:'rec-head'});
  risksHead.appendChild(el('span',{class:'rec-time'}, '关键风险'));
  risksHead.appendChild(el('span',{class:'rec-title'}, '关键风险 / 假设'));
  risksMid.appendChild(risksHead);
  const risks = UI.tagsInput(r.risks||[]);
  risks.el.querySelector('input').setAttribute('placeholder','输入后回车添加');
  risks.el.querySelector('input').addEventListener('blur',()=>{r.risks=risks.get();autosave()});
  risksMid.appendChild(risks.el);
  risksItem.appendChild(risksMid);
  risksItem.appendChild(el('div',{class:'hallmark-right'}));
  list.appendChild(risksItem);
  plate.appendChild(list);

  const ai=el('div',{class:'ai-box'});
  const btn=el('button',{class:'primary',onclick:()=>{
    API.aiButton({
      button:btn,container:ai,aiScope:'work1.recommendations',
      buildPrompt:()=>[{role:'system',content:'你是品牌战略顾问。根据价值框架与洞察，输出短中长期建议与关键风险。JSON: {"short":"","mid":"","long":"","risks":[""]}'},
        {role:'user',content:`SBU:${state.work1.sbu.name}\n价值: 功能=${state.work1.values.chosenFunctional} 情感=${state.work1.values.chosenEmotional} 社会=${state.work1.values.chosenSocial}\n洞察:\n${state.work1.analysis.insights}`}],
      onResult:res=>{
        if(!res)return;
        r.short=res.short||r.short; r.mid=res.mid||r.mid; r.long=res.long||r.long;
        if(Array.isArray(res.risks)) r.risks=res.risks;
        autosave(); Work1.renderStep('recommendations');
      }
    });
  }},'用 AI 起草建议');
  ai.appendChild(btn); plate.appendChild(ai);
};

/* ---------- DYNAMIC REFRESH (preserve input focus where possible) ---------- */
Work1.refreshDynamic = function(id){
  if(id==='survey'){
    const bar=document.querySelector('#steps1 .step[data-step="survey"] .progress-bar > div');
    if(bar){
      const s=state.work1.survey;
      bar.style.transform='scaleX('+(s.progress.total? s.progress.done/s.progress.total:0)+')';
    }
    const sl=document.querySelector('#steps1 .step[data-step="survey"] p.mono');
    if(sl) sl.textContent=Work1.surveyStatus();
  }
  // 调研回填后刷新指标评分表（展示实测/Δ），无在途编辑可放心整体重建
  if(id==='metrics'){ Work1.rerender('metrics'); }
};

/* ---------- EXPORT ---------- */
Work1.exportMd = function(){
  const d=state.work1;
  const tq=d.sbu.threeQuestions||{};
  let out=`## I. 业务价值体系\n\n### 1. SBU\n- **名称**：${d.sbu.name}\n- **品类**：${d.sbu.category}\n- **阶段**：${d.sbu.stage}\n- **范围**：${d.sbu.scope}\n- **业务三问**：客户不同=${tq.customer?'是':'否'}；渠道不同=${tq.channel?'是':'否'}；品牌独立露出=${tq.brand?'是':'否'}\n\n> ${d.sbu.summary}\n\n**边界声明**：${d.sbu.boundary||''}\n\n`;

  out+=`### 2. 业务基本情况与竞争\n`;
  out+=`**PEST**\n- P：${d.environment.political}\n- E：${d.environment.economic}\n- S：${d.environment.social}\n- T：${d.environment.technological}\n\n`;
  const b=d.environment.basics||{};
  const trio=(label,o)=>o?`- **${label}**：实况 ${o.actual||'—'} / 目标 ${o.target||'—'}（来源：${o.source||'—'}）\n`:'';
  out+=`**业务基本情况**\n${trio('规模与员工',b.scale)}${trio('业务范围',b.scope)}${trio('产品/业务线',b.products)}${trio('客户',b.customers)}${trio('供应链',b.supply)}`;
  if(b.performance){ out+=`${trio('市场份额',b.performance.share)}${trio('ROI',b.performance.roi)}${trio('年增长率',b.performance.growth)}`; }
  out+=`\n**市场格局**：${d.environment.industry||''}\n\n`;
  if(Array.isArray(d.environment.competitors) && d.environment.competitors.length){
    out+=`**竞品对标**\n\n| 竞品 | 价位 | 优势 | 劣势 | 相对位置 |\n|---|---|---|---|---|\n`;
    d.environment.competitors.forEach(c=>{ out+=`| ${c.name} | ${c.price} | ${c.strengths} | ${c.weaknesses} | ${c.position} |\n`; });
    out+='\n';
  }
  const oc=d.environment.ourCapabilities||{};
  const e=d.environment.edges||{};  // 兼容老数据
  const edgesText = d.environment.edgesText || '';  // 兼容老数据
  // 优先级：ourCapabilities（新） > edges（旧分散字段） > edgesText（旧合并文本，解析后填回）
  const capData = (Object.values(oc).some(v=>v) || d.environment.ourCapabilities)
    ? oc
    : (Object.values(e).some(v=>v) ? e : null);
  if (capData) {
    out += `**我们的资源盘点**\n\n`;
    out += `5 维能力：\n`;
    out += `- 交付：${capData.delivery||'—'}\n`;
    out += `- 核心：${capData.core||'—'}\n`;
    out += `- 品牌：${capData.brand||'—'}\n`;
    out += `- 客户：${capData.customer||'—'}\n`;
    out += `- 合规：${capData.compliance||'—'}\n\n`;
    out += `3 段判断：\n`;
    out += `- 防御性优势：${capData.defensive||'—'}\n`;
    out += `- 关键劣势：${capData.critical||'—'}\n`;
    out += `- 结构性劣势：${capData.structural||'—'}\n\n`;
    out += `微笑曲线收口：${capData.smileCurve||'—'}\n\n`;
    out += `关键趋势：${capData.trends || d.environment.trends || '—'}\n\n`;
  } else if (edgesText) {
    // 兼容老数据：合并文本
    out += `**我们的资源盘点（旧版合并文本）**\n\n${edgesText}\n\n`;
  }

  out+=`### 3. 客户画像与价值诉求\n`;
  d.personas.forEach(p=>{
    out+=`- **${p.name}** (${p.age}, ${p.occupation}, ${p.region}) — ${p.painPoints}\n  - 价值观：${(p.values||[]).join('、')}\n  - 渠道：${(p.channels||[]).join('、')}\n  - 语录：*${p.quote}*\n`;
  });
  (d.scenarios||[]).forEach(s=>{
    out+=`\n**场景：${s.name}**（关联画像：${(s.personaIds||[]).map(id=>(d.personas.find(p=>p.id===id)||{}).name).filter(Boolean).join('、')||'—'}）\n`;
    out+=`- 利益：使用 ${s.benefits?.usage||'—'}；服务 ${s.benefits?.service||'—'}；人员 ${s.benefits?.staff||'—'}；形象 ${s.benefits?.image||'—'}\n`;
    out+=`- 成本：货币 ${s.costs?.monetary||'—'}；时间 ${s.costs?.time||'—'}；精力 ${s.costs?.energy||'—'}；心理 ${s.costs?.psychic||'—'}\n`;
    out+=`- 价值锚点：${s.anchor||'—'}\n- 决定性短板：${s.decisiveGap||'—'}\n`;
  });

  out+=`\n### 4. 价值体系评分（1-10）\n\n| 一级指标 | 测评点 | 量化口径 | 首年预测 | 三年目标 | 实测 | Δ |\n|---|---|---|---|---|---|---|\n`;
  (d.metrics.dimensions||[]).forEach(dim=>(dim.secondaries||[]).forEach(s2=>{
    const delta=s2.actual!=null&&s2.forecast!=null?(s2.actual-s2.forecast):null;
    out+=`| ${dim.name} | ${s2.name} | ${s2.measure||''} | ${s2.forecast??'—'} | ${s2.target??'—'} | ${s2.actual!=null?s2.actual.toFixed(1):'—'} | ${delta!=null?(delta>0?'+':'')+delta.toFixed(1):'—'} |\n`;
  }));

  out+=`\n### 5. 合成调研\n- 样本数：${d.survey.responses.length}（每位画像 ${d.survey.n} 份）\n- 题数：${d.survey.questions.length}\n\n`;
  out+=`### 6. 分析洞察\n${d.analysis.insights}\n\n`;
  out+=`### 7. 价值框架\n- 功能：${d.values.chosenFunctional}\n- 情感：${d.values.chosenEmotional}\n- 社会：${d.values.chosenSocial}\n\n> ${d.values.rationale}\n\n`;
  out+=`### 8. 建议\n- 短期：${d.recommendations.short}\n- 中期：${d.recommendations.mid}\n- 长期：${d.recommendations.long}\n- 风险：${(d.recommendations.risks||[]).join('；')}\n`;
  return out;
};

