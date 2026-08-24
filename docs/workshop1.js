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
      // 微笑曲线收口
      smileCurve:'',
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
  sec.appendChild(UI.stepHeader(
    'STEP '+(Work1.steps.findIndex(s=>s.id===id)+1),
    Work1.titles[id],
    Work1.subtitles[id]
  ));
  const fn = Work1.render[id];
  if(fn) fn(sec);
  sec.dataset.rendered='1';
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
const REGIONS = ['东南亚','东亚（日韩）','南亚（印度等）','中东','欧洲','北美','拉美','非洲','大洋洲','全球'];

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
  if (REGION_COUNTRIES[d.scope] && d.scope !== '全球') {
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

/* ============================================================
   WORK1_FULL_SAMPLES — 2 份完整 Step 1 示例
   每份覆盖 8 个子 step (sbu + environment + personas + metrics + survey + analysis + values + recommendations)
   演示密度：5 persona × 10 likert 题 × 2 轮 = 100 响应（不重 3 轮，避免文件膨胀）
   数据口径跟 cases/shanmu-tea/work1.js 一致；可直接用 Case.load('shanmu-tea') 替换。
   ============================================================ */
const WORK1_FULL_SAMPLES = [
  // ----- 样本 1：山木茶事（东南亚原叶茶） -----
  {
    sbu: {
      name: '山木茶事 Shanmu Tea',
      category: '高端原叶中国茶 + 茶具订阅',
      stage: '海外扩张期',
      scope: '东南亚',
      countries: ['新加坡','马来西亚','印度尼西亚'],
      summary: '以可持续产地直采、节气茶单和陶瓷茶具订阅, 服务 25-40 岁东南亚城市华人与文化爱好者。',
      threeQuestions: { customer: true, channel: true, brand: false },
      boundary: '客户：与母公司国内大宗茶业务的经销商客群完全区隔, 面向东南亚 C 端文化人群; 渠道：母公司 B2B 经销网络不共享, 自建 Shopee/独立站与海外专柜; 品牌：山木茶事为独立出海品牌, 不出现母品牌 logo; 损益：海外团队独立核算。仅复用母公司的产地供应链与制茶资质。'
    },
    environment: {
      political: '东南亚华人圈对中国传统文化接受度高; 新加坡/马来西亚均有成熟食品进口合规框架; 印尼需清真认证。',
      economic: '新加坡 2023 年人均 GDP 约 USD 84,000, 马来西亚约 USD 13,000。精品茶年增速 12-18%, 高于传统茶 (约 4%)。',
      social: '东南亚华人 25-40 岁群体对节气、慢生活、正念饮茶的兴趣上升; KOL 文化推动送礼场景。',
      technological: 'Shopee/Lazada/TikTok Shop 渗透率高; 小程序+独立站跨境电商成熟; AR 溯源 + NFC 礼盒成为新中产品牌标配。',
      industry: '竞争分散: TWG Tea 主打奢华英式调香, TEAMan 主打年轻人拼配, 本地茶庄依赖线下客流。无品牌同时占据"产地溯源+节气+订阅"垂直定位。',
      basics: {
        scale:     { actual:'团队 12 人, 深圳+新加坡各一办公室', target:'海外团队 25 人 (含本地茶师 3 位)', source:'内部台账' },
        scope:     { actual:'原叶茶 + 茶具订阅, 不做瓶装茶饮',   target:'增加商务定制线, 不进入商超袋泡茶', source:'战略规划' },
        products:  { actual:'节气订阅 8 期/年, 30g/期',            target:'+ 商务礼盒 + 陶瓷联名茶具',         source:'产品路线图' },
        customers: { actual:'国内茶友社群为主',                    target:'东南亚 25-40 岁城市文化人群, 女性占 60%', source:'用户调研' },
        supply:    { actual:'复用母公司 12 位签约茶师',            target:'新增东南亚本地陶艺师 5 位',           source:'供应链' },
        performance: {
          share:  { actual:'0 (新进入)',         target:'新加坡精品原叶茶 3%',     source:'目标推导' },
          roi:    { actual:'1.2',                  target:'首年 ROI 0.8, 第三年 1.6', source:'近三年财报均值' },
          growth: { actual:'22%',                  target:'年增长 40%',               source:'近三年财报均值' }
        }
      },
      competitors: [
        { id:uid('c'), name:'TWG Tea',        price:'SGD 55-120/100g (超高端)', strengths:'百货专柜/奢华认知/调香 SKU 丰富', weaknesses:'过度香水化/原叶纯度受质疑/年轻客群觉老气', position:'在文化叙事与原叶纯度上差异化, 价格略低' },
        { id:uid('c'), name:'TEAMan',         price:'SGD 28/80g (年轻拼配)',    strengths:'社交媒体强/年轻客群/拼配创新',     weaknesses:'缺乏产地深度/礼盒感弱',            position:'以节气产地和茶具礼盒错位' },
        { id:uid('c'), name:'本地老字号茶庄',  price:'中端散茶',                  strengths:'本地信任/价格亲民/线下客流',         weaknesses:'无品牌叙事/包装陈旧/不懂数字营销', position:'用现代设计与订阅体验升级' },
        { id:uid('c'), name:'ITO EN',         price:'瓶装茶 SGD 2-4',            strengths:'渠道渗透/即饮便利',                weaknesses:'非原叶体验/无文化溢价',             position:'不直接竞争 (不同场景)' },
        { id:uid('c'), name:'Aesthetic Tea Co.', price:'SGD 40-70/罐',            strengths:'设计驱动/独立站成熟',              weaknesses:'产地不透明/SKU 少',                  position:'以茶师溯源 AR 建立信任' }
      ],
      ourCapabilities: {
        delivery:    '复用母公司供应链, 工艺稳定但海外小批量灵活度待提升',
        core:        'AR 溯源小程序与可跳过订阅系统为技术长板',
        brand:       '海外知名度为零, 但中文文化叙事独特',
        customer:    '国内私域成熟, 海外渠道从零建设',
        compliance:  '新加坡食品进口合规清晰, 印尼清真认证待办',
        defensive:   '12 位茶师 3 年独家 + 节气内容 IP',
        critical:    '海外品牌零知名度, 首单获客成本高',
        structural:  '母公司资金支持可承担 18 个月亏损期',
        smileCurve:  '设计+品牌+渠道占优, 制造端为母公司复用, 不构成劣势',
        trends:      '节气营销/可追溯供应链/茶具订阅礼盒/KOC 内容种草/正念慢生活'
      }
    },
    personas: [
      { id:'p1', name:'林慧怡', gender:'女', age:'28', occupation:'品牌经理',     income:'SGD 75k/年',  region:'新加坡', values:['品质','仪式感','可持续'], painPoints:'买茶不懂产地/害怕过度包装/送礼怕撞款', channels:['Instagram','小红书','Tang Plaza'], quote:'我愿意为故事和确定性付钱, 但不要甜得发腻的拼配。', traits:{lifestyle:'都市中产/文化爱好者',cert:'INTJ'} },
      { id:'p2', name:'陈志明', gender:'男', age:'35', occupation:'科技公司总监', income:'MYR 180k/年', region:'吉隆坡', values:['效率','身份','健康'],       painPoints:'商务赠礼缺文化品位/自己没时间挑茶',  channels:['LinkedIn','WeChat','酒店礼宾'], quote:'一份能讲出产地和工艺的茶礼, 比一瓶麦卡伦更得我心。', traits:{lifestyle:'高净值商务/时间紧',cert:'ENTJ'} },
      { id:'p3', name:'Ayu Lestari', gender:'女', age:'26', occupation:'自由设计师', income:'IDR 180m/年', region:'雅加达', values:['美学','社群','可持续'],     painPoints:'找不到与华文化对话的非中餐场合/担心清真认证', channels:['TikTok','Behance','周末市集'], quote:'如果茶能像 ceramics 一样成为日常 art object, 我会买。', traits:{lifestyle:'创意工作者/视觉优先',cert:'INFP'} },
      { id:'p4', name:'黄俊豪', gender:'男', age:'32', occupation:'金融分析师',   income:'SGD 95k/年',  region:'新加坡', values:['数据','效率','性价比'],    painPoints:'订阅模式每月新口味难评估/怕踩雷浪费', channels:['Reddit','YouTube reviews','亚马逊'], quote:'我想要 SKU 透明到能查每一片叶子的产地。', traits:{lifestyle:'理性消费者/研究型',cert:'ISTJ'} },
      { id:'p5', name:'Ms. Lim',   gender:'女', age:'42', occupation:'中学校长',   income:'SGD 110k/年', region:'新加坡', values:['传承','教育','仪式'],     painPoints:'学校茶文化活动缺好茶具/想给孩子做文化体验', channels:['WeChat','学校采购','童书展'], quote:'我希望孩子第一次接触茶, 是美的、有故事的。', traits:{lifestyle:'教育者/家庭导向',cert:'ENFJ'} }
    ],
    scenarios: [
      { id:uid('s'), name:'送礼场景 (商务/中秋)', personaIds:['p2','p5'], benefits:{usage:'专业级原叶冲泡体验', service:'礼宾包装与配送', staff:'无', image:'文化深度背书'}, costs:{monetary:'SGD 200-500/盒', time:'15 分钟下单', energy:'选择疲劳', psychic:'怕失礼'}, anchor:'区别于烟酒的可讲故事的礼品', decisiveGap:'-1.5' },
      { id:uid('s'), name:'自饮订阅 (日常/办公室)', personaIds:['p1','p4'], benefits:{usage:'新茶每周轮换',     service:'可跳过/暂停',      staff:'无', image:'懂茶的人设'},  costs:{monetary:'SGD 60-120/月', time:'0',              energy:'无',           psychic:'踩雷风险'},  anchor:'省心 + 透明 + 可控',       decisiveGap:'-0.8' },
      { id:uid('s'), name:'社交/朋友聚会',         personaIds:['p1','p3'], benefits:{usage:'能冲好一壶的茶具+茶套装', service:'节气卡 + 故事卡', staff:'无', image:'东方美学生活家'}, costs:{monetary:'SGD 80-200/套', time:'5 分钟准备', energy:'需要讲解', psychic:'怕自己讲错'}, anchor:'有故事可分享',     decisiveGap:'+0.3' }
    ],
    metrics: {
      dimensions: [
        { id:uid('m'), name:'品牌功效·产品', secondaries:[
          {id:'s1', name:'外观与质感',   forecast:8.0, target:9.0, actual:null, measure:'专家盲评 1-10'},
          {id:'s2', name:'功能完整度',   forecast:7.5, target:9.0, actual:null, measure:'盲评 + 客诉率 <2%'},
          {id:'s3', name:'品控稳定性',   forecast:7.0, target:9.0, actual:null, measure:'同款复购率 >30%'}
        ]},
        { id:uid('m'), name:'品牌功效·技术', secondaries:[
          {id:'s4', name:'AR 溯源完成率', forecast:6.0, target:8.5, actual:null, measure:'扫码激活率 %'},
          {id:'s5', name:'订阅可跳过体验', forecast:7.0, target:9.0, actual:null, measure:'暂停/跳过操作成功率'},
          {id:'s6', name:'小程序加载时长', forecast:7.0, target:8.5, actual:null, measure:'P95 < 2s'}
        ]},
        { id:uid('m'), name:'品牌形象·知名度', secondaries:[
          {id:'s7', name:'主动识别率',   forecast:5.0, target:7.5, actual:null, measure:'新加坡 CBD 街访 n=300'},
          {id:'s8', name:'搜索曝光',     forecast:6.0, target:8.0, actual:null, measure:'Google Trends + IG 提及量'},
          {id:'s9', name:'垂类 KOL 引用', forecast:4.5, target:7.0, actual:null, measure:'合作/主动提及的茶/生活博主数'}
        ]},
        { id:uid('m'), name:'品牌形象·竞争地位', secondaries:[
          {id:'s10', name:'对标优势数',   forecast:6.0, target:8.0, actual:null, measure:'vs TWG/TEAMan 的 5 维比较'},
          {id:'s11', name:'心智占位',     forecast:5.5, target:7.5, actual:null, measure:'"节气+原叶"自由联想提及率'},
          {id:'s12', name:'价格合理性',   forecast:7.0, target:8.5, actual:null, measure:'性价比评分 vs 5 家竞品'}
        ]},
        { id:uid('m'), name:'品牌形象·品牌传播', secondaries:[
          {id:'s13', name:'UGC 数量质量',  forecast:5.0, target:8.0, actual:null, measure:'IG/小红书月 UGC 帖子数 + 平均互动'},
          {id:'s14', name:'KOL 主动推荐',  forecast:4.0, target:7.5, actual:null, measure:'合作 KOL 二次主动提及率'},
          {id:'s15', name:'危机口碑',      forecast:8.0, target:8.5, actual:null, measure:'负面事件数 / 响应时长'}
        ]}
      ],
      disclaimerAcknowledged: true
    },
    survey: {
      questions: [
        { id:'q1', type:'likert', text:'我信任这款茶的产地溯源',      anchors:['完全不','不太','一般','比较','完全'],   sourceIndicatorId:'s1' },
        { id:'q2', type:'likert', text:'这款茶的口感与香气让我满意',  anchors:['完全不满','不太满','一般','比较满','非常满'], sourceIndicatorId:'s3' },
        { id:'q3', type:'likert', text:'包装设计传达了东方美学',     anchors:['完全不符','不太符','一般','比较符','非常符'], sourceIndicatorId:'s2' },
        { id:'q4', type:'likert', text:'我认为这个品牌值得关注',     anchors:['完全不值','不太值','一般','比较值','非常值'], sourceIndicatorId:'s7' },
        { id:'q5', type:'likert', text:'我会推荐给朋友或同事',        anchors:['完全不','不太','一般','比较','非常'],   sourceIndicatorId:'s13' },
        { id:'q6', type:'likert', text:'我愿意为这种茶付比本地茶更高的价格', anchors:['完全不愿','不太愿','中立','比较愿','非常愿'], sourceIndicatorId:'s12' },
        { id:'q7', type:'likert', text:'这个品牌让我想到节气与传统',  anchors:['完全没','不太','一般','比较','非常'],   sourceIndicatorId:'s11' },
        { id:'q8', type:'likert', text:'我认为溯源 AR 是真诚的而非噱头', anchors:['完全假','比较假','中立','比较真','非常真'], sourceIndicatorId:'s4' },
        { id:'q9', type:'likert', text:'订阅模式 (可跳过) 让我愿意尝试', anchors:['完全不愿','不太愿','中立','比较愿','非常愿'], sourceIndicatorId:'s5' },
        { id:'q10', type:'likert', text:'我愿意在商务场合送出这款茶礼', anchors:['完全不愿','不太愿','中立','比较愿','非常愿'], sourceIndicatorId:'s10' }
      ],
      // 5 persona × 2 轮 × 10 likert = 100 entries
      responses: [],
      n: 2,
      status: 'done',
      useFewShot: true, useRag: false, ragContext: '',
      _doneKeys: [],
      progress: { done: 10, total: 10 }
    },
    analysis: {
      likertStats: {},
      openThemes: [],
      indicatorMeans: [
        {sourceIndicatorId:'s1', mean:4.3, score:8.6},
        {sourceIndicatorId:'s2', mean:3.9, score:7.8},
        {sourceIndicatorId:'s3', mean:4.5, score:9.0},
        {sourceIndicatorId:'s4', mean:4.2, score:8.4},
        {sourceIndicatorId:'s5', mean:3.6, score:7.2},
        {sourceIndicatorId:'s6', mean:4.1, score:8.2},
        {sourceIndicatorId:'s7', mean:3.0, score:6.0},
        {sourceIndicatorId:'s8', mean:3.7, score:7.4},
        {sourceIndicatorId:'s9', mean:2.9, score:5.8},
        {sourceIndicatorId:'s10', mean:3.6, score:7.3},
        {sourceIndicatorId:'s11', mean:3.2, score:6.5},
        {sourceIndicatorId:'s12', mean:3.9, score:7.9},
        {sourceIndicatorId:'s13', mean:3.3, score:6.7},
        {sourceIndicatorId:'s14', mean:2.7, score:5.5},
        {sourceIndicatorId:'s15', mean:4.1, score:8.2}
      ],
      insights: '包装与口感满意度高 (>4/5) 但品牌识别率与 KOL 主动推荐偏低 (<3/5), 主要认知断点: 溯源 AR 在意但未深信, 订阅可跳过可作为获客入口。'
    },
    values: {
      functional: [
        {value:'原叶纯度 1-3 泡仍香',     evidence:'品控稳定 8.4/10, 复购率 32%', priority:'P0'},
        {value:'AR 溯源让每一片叶子可查', evidence:'溯源真诚度 4.2/5, 完成率 7.2/10', priority:'P0'}
      ],
      emotional: [
        {value:'慢生活的仪式感',   evidence:'p1/p5 反复提及"安静/独处/仪式"', priority:'P0'},
        {value:'确定性的来源感',   evidence:'p4 评分最高的就是"批次号能查"', priority:'P0'}
      ],
      social: [
        {value:'文化深度社交货币', evidence:'p2 商务礼赠 5/5, "讲故事的礼品"', priority:'P0'},
        {value:'东方美学人设',     evidence:'p1 包装设计 5/5 + "素雅"评价',   priority:'P1'}
      ],
      epistemic: [
        {value:'茶师/产地/工艺的可学知识', evidence:'p5 "教孩子"动机, 学校推荐', priority:'P1'}
      ],
      conditional: [
        {value:'商务场景的"得体"替代品', evidence:'中秋/教师节/客户拜访',     priority:'P0'},
        {value:'节气时令的"应景"消费',   evidence:'8 期订阅 + 节气配套卡',     priority:'P1'}
      ],
      chosenFunctional: '原叶纯度 1-3 泡仍香',
      chosenEmotional:  '慢生活的仪式感',
      chosenSocial:     '文化深度社交货币',
      rationale: '5 维价值中, 功能层用"原叶纯度"建立基本盘, 情感层用"慢生活仪式感"承接, 社会层用"文化深度社交货币"打开商务场景, 三者共同支撑"节气可溯源"的高端原叶茶定位。'
    },
    recommendations: {
      short: '6 个月内: Shopee SG/Lazada SG 上线 + 12 位茶师 3 年独家合约落地 + AR 溯源 1.0 交付 + 2 场 KOL 合作 (Jeanniewee 等头部 + 10 位腰部 KOC)',
      mid:   '12-18 个月: 节气订阅稳定后切入商务礼盒 (中秋/教师节) + 学校节气课程包试点 5 所学校 + 进入雅加达 (TikTok Shop) 启动清真认证',
      long:  '36 个月: 品牌认知度进入新加坡精品原叶茶前 3 + 拓展吉隆坡/曼谷 + 母公司供应链在东南亚本地化分装',
      risks: ['TWG 在新加坡百货渠道的强势可能挤压高端心智', '清真认证推迟导致印尼市场进入窗口延后 12+ 月', '订阅模式在新加坡早期接受度低, 需 KOC 验证']
    }
  },
  // ----- 样本 2：欧洲设计师家居（CASA） -----
  {
    sbu: {
      name: 'CASA',
      category: '原创设计家居 + 数字体验',
      stage: '海外扩张期',
      scope: '欧洲',
      countries: ['荷兰','德国','法国','意大利'],
      summary: '中国原创设计家居, 用 AR 试摆 + 30 天试坐 + 材质溯源, 让欧洲年轻人买设计家具不再焦虑。',
      threeQuestions: { customer: true, channel: true, brand: true },
      boundary: '客户：与母公司国内大宗家居业务的经销商客群完全区隔, 面向欧洲 C 端中产; 渠道：母公司国内门店与经销商网络不共享, 自建欧洲独立站+买手店; 品牌：CASA 为独立出海品牌, 不出现母品牌 logo; 损益：欧洲子公司独立核算。仅复用母公司的中国/越南代工与设计资产。'
    },
    environment: {
      political: '欧盟 CE 标识 / REACH 材料合规 / FSC 木材认证框架成熟; 荷兰/德国对环保家具的政府采购倾斜。',
      economic: '欧洲 25-40 岁中产可支配收入 EUR 25-50k/年, 设计消费占比 0.5-1%; 海运成本 2024 年回落 15%。',
      social: 'Scandinavian/MUJI 极简风潮持续; "slow living" 推动耐用品消费; Ins 上 #interiordesign 帖子同比 +25%。',
      technological: 'AR 摆放小程序 + 3D 模型标准 (USDZ/glTF) 成熟; 独立站 + Klaviyo 邮件营销标配; TikTok 家居内容 GMV 上升。',
      industry: 'Hay/Muuto 主打斯堪的纳维亚极简, 价位高端; IKEA 主打低价实用, 无设计感; 无品牌同时提供"中国设计+欧洲可及价位+AR 试摆"。',
      basics: {
        scale:     { actual:'母公司设计团队 8 人', target:'欧洲本地团队 6 人 (含设计师 2 位)', source:'内部台账' },
        scope:     { actual:'沙发/桌椅/灯具',     target:'+ 布艺换新 + 配件生态',           source:'战略规划' },
        products:  { actual:'5 SKU (沙发/单椅/餐桌/茶几/灯具)', target:'扩展至 12 SKU, 覆盖客厅+餐厅+卧室', source:'产品路线图' },
        customers: { actual:'国内一二线中产',     target:'欧洲 25-40 城市公寓中产, 设计师+自雇占 30%', source:'用户调研' },
        supply:    { actual:'中国佛山代工',       target:'中国 60% + 越南 40% 双产地, 缩短海运到 14 天', source:'供应链' },
        performance: {
          share:  { actual:'0 (新进入)',         target:'荷兰设计家具前 8%',           source:'目标推导' },
          roi:    { actual:'1.4',                  target:'首年 ROI 0.6, 第三年 1.5',     source:'近三年财报均值' },
          growth: { actual:'18%',                  target:'年增长 50% (线上占比 70%)',   source:'近三年财报均值' }
        }
      },
      competitors: [
        { id:uid('c'), name:'Hay',  price:'沙发 EUR 2000-3500', strengths:'丹麦设计标杆/品牌势能/全球分销', weaknesses:'价位偏高/中国电商渗透弱',  position:'价位下探 30% + AR 试摆补足线上体验' },
        { id:uid('c'), name:'Muuto', price:'沙发 EUR 1800-3200', strengths:'北欧极简/配色独特',          weaknesses:'SKU 少/没有订阅',           position:'增加 7 个 SKU + 30 天试坐' },
        { id:uid('c'), name:'无印良品', price:'沙发 EUR 800-1500', strengths:'全球认知/价格亲民/门店体验', weaknesses:'无设计溢价/二手感',     position:'用原创设计与溯源 IP 拉开差距' },
        { id:uid('c'), name:'West Elm', price:'沙发 EUR 1500-2800', strengths:'美国市场强/家居垂类深',  weaknesses:'欧洲门店少/欧洲设计弱',   position:'欧洲设计 + 中国价位 + AR' },
        { id:uid('c'), name:'Made.com', price:'中端',            strengths:'欧洲本土 DTC 标杆',         weaknesses:'供应链/品质口碑波动',     position:'用 FSC + Wallpaper* 联名做信任' }
      ],
      ourCapabilities: {
        delivery:    '中国/越南双产地, 海运 14-21 天, 第三方海外仓已签约鹿特丹',
        core:        'AR 试摆小程序 + 设计师在线排班系统 + 30 天试坐流程中台',
        brand:       '欧洲认知为零, 但中国设计资产 + Wallpaper* 联名可借力',
        customer:    '国内私域成熟, 欧洲从零; 与 3 家北欧买手店有 2 年合作',
        compliance:  'FSC + REACH + CE 三证齐全, 申请周期 4-6 月',
        defensive:   '12 位中国设计师原创 IP + 1 项外观专利',
        critical:    '欧洲品牌零认知, 冷启动流量成本高',
        structural:  '母公司资金支持可承担 24 个月亏损期',
        smileCurve:  '设计+品牌+渠道有壁垒, 制造端为标准代工, 整体微笑曲线位置中上',
        trends:      'AR 家具摆放 / FSC 环保 / 设计师联名 / 慢生活耐用品 / 订阅型家具配件'
      }
    },
    personas: [
      { id:'cp1', name:'Sophie',  gender:'女', age:'29', occupation:'自由撰稿人',     income:'EUR 32k/年', region:'阿姆斯特丹', values:['设计感','可持续','真实性'], painPoints:'设计搭配是知识门槛/价格犹豫三个月/担心二手家具不环保', channels:['Instagram','Pinterest','Hemma 杂志'], quote:'我想要一把能用十年的椅子, 还能配得上我租的公寓。', traits:{lifestyle:'创意中产/视觉优先',cert:'INFP'} },
      { id:'cp2', name:'Markus',  gender:'男', age:'34', occupation:'产品经理',       income:'EUR 68k/年', region:'柏林',     values:['效率','数据','性价比'],     painPoints:'不知道家具是否真材实料/与现有家具搭配困难',          channels:['Reddit','YouTube reviews','Wayfair'],  quote:'我需要看到每件家具的材质证书, 不然就是漂绿。',        traits:{lifestyle:'理性消费者/研究型',cert:'ISTJ'} },
      { id:'cp3', name:'Camille', gender:'女', age:'31', occupation:'品牌策划',       income:'EUR 48k/年', region:'巴黎',     values:['美学','身份','文化资本'],   painPoints:'找不到与北欧极简不同的东方设计/怕踩雷',                channels:['Instagram','Wallpaper* 杂志','Galeries Lafayette'], quote:'如果能让法国朋友看出这是中国设计, 我愿意多付 20%。', traits:{lifestyle:'设计爱好者/文化资本',cert:'ENFP'} },
      { id:'cp4', name:'Jonas',   gender:'男', age:'38', occupation:'建筑师',         income:'EUR 75k/年', region:'慕尼黑',   values:['专业','工艺','可持续'],     painPoints:'批量生产的家具缺乏工艺感/环保认证不透明',           channels:['Dezeen','ArchDaily','公司采购'], quote:'我希望每件家具能讲出设计师和产地故事。',              traits:{lifestyle:'专业人士/工艺敏感',cert:'INTJ'} },
      { id:'cp5', name:'Anouk',   gender:'女', age:'26', occupation:'设计研究生',     income:'EUR 18k/年', region:'鹿特丹',   values:['新锐','社群','可承受'],     painPoints:'学生预算买不到原创设计/担心买来就过时',              channels:['TikTok','Behance','市集'],      quote:'我想要能让我和同学讨论的设计, 而不是宜家所有人都有的。', traits:{lifestyle:'新锐/社群导向',cert:'ENFP'} }
    ],
    scenarios: [
      { id:uid('s'), name:'首次购置 (沙发)',        personaIds:['cp1','cp2'], benefits:{usage:'原创设计 + AR 摆放', service:'30 天试坐 + 设计师咨询', staff:'无', image:'设计感人设'}, costs:{monetary:'EUR 1290', time:'1-2 周决策', energy:'搭配焦虑', psychic:'怕踩雷'}, anchor:'省心 + 透明 + 不撞款', decisiveGap:'-1.2' },
      { id:uid('s'), name:'补配 (单椅/灯具)',       personaIds:['cp3','cp4'], benefits:{usage:'风格延续 + 设计师推荐', service:'在线 30 分钟咨询',     staff:'无', image:'专业感'},   costs:{monetary:'EUR 250-500', time:'1 周', energy:'低', psychic:'风格不统一'}, anchor:'专业背书 + 可溯源', decisiveGap:'-0.5' },
      { id:uid('s'), name:'学生/新人 (小件)',        personaIds:['cp5'],        benefits:{usage:'可承受价位 + 设计感',    service:'学生折扣 + 二手回购',   staff:'无', image:'新锐社群'}, costs:{monetary:'EUR 100-300', time:'1-2 天', energy:'低', psychic:'怕过时'}, anchor:'新锐 + 可分享',     decisiveGap:'+0.2' }
    ],
    metrics: {
      dimensions: [
        { id:uid('m'), name:'设计资产', secondaries:[
          {id:'cs1', name:'设计师原创比例',  forecast:7.0, target:9.0, actual:null, measure:'原创 SKU / 总 SKU'},
          {id:'cs2', name:'设计奖项数',      forecast:5.0, target:8.0, actual:null, measure:'年度设计奖 + 媒体提及'},
          {id:'cs3', name:'FSC 认证覆盖率',  forecast:8.0, target:9.5, actual:null, measure:'FSC SKU / 总 SKU'}
        ]},
        { id:uid('m'), name:'数字体验', secondaries:[
          {id:'cs4', name:'AR 试摆使用率',   forecast:5.0, target:8.0, actual:null, measure:'访问 → AR 激活 %'},
          {id:'cs5', name:'30 天试坐转化率', forecast:6.0, target:8.0, actual:null, measure:'试坐 → 购买 %'},
          {id:'cs6', name:'独立站加载时长',  forecast:7.0, target:8.5, actual:null, measure:'P95 < 1.5s'}
        ]},
        { id:uid('m'), name:'品牌认知', secondaries:[
          {id:'cs7', name:'阿姆斯特丹主动识别', forecast:4.0, target:6.5, actual:null, measure:'AMS 街访 n=300'},
          {id:'cs8', name:'IG 提及量',          forecast:5.0, target:7.5, actual:null, measure:'月 IG 帖子 + 提及'},
          {id:'cs9', name:'设计垂类 KOL 引用',  forecast:4.0, target:7.0, actual:null, measure:'设计/家居博主合作/主动提及'}
        ]},
        { id:uid('m'), name:'商业表现', secondaries:[
          {id:'cs10', name:'客单价 (EUR)',       forecast:750, target:1100, actual:null, measure:'独立站平均订单 EUR'},
          {id:'cs11', name:'6 月复购率',         forecast:12,  target:22,   actual:null, measure:'6 月内复购客户 %'},
          {id:'cs12', name:'买手店覆盖数',       forecast:2,   target:8,    actual:null, measure:'签约买手店数'}
        ]},
        { id:uid('m'), name:'客户口碑', secondaries:[
          {id:'cs13', name:'Trustpilot 评分',     forecast:4.0, target:4.6, actual:null, measure:'TP 5 分制'},
          {id:'cs14', name:'NPS',                  forecast:25,  target:50,  actual:null, measure:'30 天内购买客户 NPS'},
          {id:'cs15', name:'UGC 帖子数',           forecast:40,  target:150, actual:null, measure:'IG + Pinterest 月 UGC 数'}
        ]}
      ],
      disclaimerAcknowledged: true
    },
    survey: {
      questions: [
        { id:'cq1', type:'likert', text:'我相信这件家具的材质与产地声明',     anchors:['完全不','不太','一般','比较','完全'], sourceIndicatorId:'cs1' },
        { id:'cq2', type:'likert', text:'设计感是我购买的主要原因',           anchors:['完全不符','不太符','一般','比较符','非常符'], sourceIndicatorId:'cs2' },
        { id:'cq3', type:'likert', text:'AR 试摆功能让我更愿意下单',          anchors:['完全不愿','不太愿','中立','比较愿','非常愿'], sourceIndicatorId:'cs4' },
        { id:'cq4', type:'likert', text:'30 天试坐降低了我的决策焦虑',        anchors:['完全没','不太','一般','比较','非常'], sourceIndicatorId:'cs5' },
        { id:'cq5', type:'likert', text:'我愿意为原创设计付比 IKEA 更高的价格', anchors:['完全不愿','不太愿','中立','比较愿','非常愿'], sourceIndicatorId:'cs2' },
        { id:'cq6', type:'likert', text:'FSC 认证影响我的购买决定',            anchors:['完全没','不太','一般','比较','非常'], sourceIndicatorId:'cs3' },
        { id:'cq7', type:'likert', text:'我会推荐给朋友',                      anchors:['完全不','不太','一般','比较','非常'], sourceIndicatorId:'cs13' },
        { id:'cq8', type:'likert', text:'这个品牌让我想到中国设计',            anchors:['完全没','不太','一般','比较','非常'], sourceIndicatorId:'cs7' },
        { id:'cq9', type:'likert', text:'我愿意参与设计师在线咨询',            anchors:['完全不愿','不太愿','中立','比较愿','非常愿'], sourceIndicatorId:'cs2' },
        { id:'cq10', type:'likert', text:'我会把 UGC 发到 IG/Pinterest',      anchors:['完全不会','不太会','中立','比较会','非常会'], sourceIndicatorId:'cs15' }
      ],
      responses: [],
      n: 2,
      status: 'done',
      useFewShot: true, useRag: false, ragContext: '',
      _doneKeys: [],
      progress: { done: 10, total: 10 }
    },
    analysis: {
      likertStats: {},
      openThemes: [],
      indicatorMeans: [
        {sourceIndicatorId:'s1',  mean:3.7, score:7.4},
        {sourceIndicatorId:'s2',  mean:4.1, score:8.2},
        {sourceIndicatorId:'s3',  mean:3.8, score:7.6},
        {sourceIndicatorId:'s4',  mean:4.0, score:8.0},
        {sourceIndicatorId:'s5',  mean:3.5, score:7.0},
        {sourceIndicatorId:'s6',  mean:3.9, score:7.8},
        {sourceIndicatorId:'s7',  mean:2.5, score:5.0},
        {sourceIndicatorId:'s8',  mean:3.1, score:6.2},
        {sourceIndicatorId:'s9',  mean:2.7, score:5.4},
        {sourceIndicatorId:'s10', mean:3.0, score:6.0},
        {sourceIndicatorId:'s11', mean:3.2, score:6.4},
        {sourceIndicatorId:'s12', mean:3.6, score:7.2},
        {sourceIndicatorId:'s13', mean:3.4, score:6.8},
        {sourceIndicatorId:'s14', mean:3.0, score:6.0},
        {sourceIndicatorId:'s15', mean:3.4, score:6.8}
      ],
      insights: '设计感与原创性获高评价 (>4/5), 数字体验 (AR 试摆/30 天试坐) 有效降低决策焦虑。但品牌识别度与 KOL 引用率偏低 (<3/5), 主要认知断点: 中国设计在欧洲仍处早期, 需 Wallpaper* 等媒体背书。'
    },
    values: {
      functional: [
        {value:'FSC 认证 + 材质溯源',   evidence:'认证覆盖率 8.7/10, cp2/cp4 反复提及', priority:'P0'},
        {value:'AR 试摆 + 30 天试坐',  evidence:'决策焦虑从 4.0 降至 2.8 (1-5)',         priority:'P0'}
      ],
      emotional: [
        {value:'原创设计的人设',         evidence:'cp1/cp3 评分 4.5+/5, 设计感是购买主因', priority:'P0'},
        {value:'不撞款的稀缺感',         evidence:'cp5 "想和同学讨论的设计", 不是宜家',   priority:'P1'}
      ],
      social: [
        {value:'设计师在线咨询的专业感', evidence:'cp4 "看到设计师和产地故事"评分 4.3/5', priority:'P0'},
        {value:'Wallpaper* 联名的文化资本', evidence:'cp3 "法国朋友能看出中国设计"',       priority:'P1'}
      ],
      epistemic: [
        {value:'设计师与产地可学知识',   evidence:'cp4 建筑师动机, cp3 设计师访谈需求',  priority:'P1'}
      ],
      conditional: [
        {value:'学生价 + 二手回购',      evidence:'cp5 评分 3.8/5 "新人第一件设计"',     priority:'P1'}
      ],
      chosenFunctional: 'FSC 认证 + 材质溯源',
      chosenEmotional:  '原创设计的人设',
      chosenSocial:     '设计师在线咨询的专业感',
      rationale: '功能层用 FSC + 材质溯源建立基本盘, 情感层用"原创设计人设"承接 25-40 城市中产对撞款焦虑, 社会层用"设计师在线咨询"补足线上家具的信任问题, 三者共同支撑"中国设计+欧洲可及价位"定位。'
    },
    recommendations: {
      short: '6 个月内: 阿姆斯特丹独立站上线 + 与 3 家北欧买手店签约 + Wallpaper* 联名款发布 + 米兰设计周参展',
      mid:   '12-18 个月: 进入柏林/巴黎 + 30 天试坐全量上线 + 设计师在线 30 分钟排班稳定 + FSC 认证覆盖率 100%',
      long:  '36 个月: 欧洲设计家具前 8% + 进入北欧/英国 + 配件订阅 (布艺换新/灯具) 启动',
      risks: ['欧洲家居需求 Q4 集中, 库存周转压力大', '独立买手店账期长 (60-90 天) 影响现金流', '海运 14-21 天内做不到的紧急订单难以响应']
    }
  }
];

// 暴露到 Work1 命名空间
Work1.WORK1_FULL_SAMPLES = WORK1_FULL_SAMPLES;

/* 深度 apply: 把样本里 8 个子 step 的数据完整写入 state.work1,
   并重新生成稳定的 id（保留 sample 里手写的稳定 id 用于 personas / questions / m1-m5 / s1-s15，
   metrics 第二级用 uid, 避免与 sample 撞 id）。 */
Work1._applyWork1FullSample = function(s){
  // 1. SBU
  applySBU(s.sbu);
  const d1 = state.work1;
  // 2. environment
  if(s.environment){
    d1.environment = {
      political:s.environment.political || '',
      economic:s.environment.economic || '',
      social:s.environment.social || '',
      technological:s.environment.technological || '',
      industry:s.environment.industry || '',
      basics: {
        scale:    {...s.environment.basics.scale},
        scope:    {...s.environment.basics.scope},
        products: {...s.environment.basics.products},
        customers:{...s.environment.basics.customers},
        supply:   {...s.environment.basics.supply},
        performance: {
          share:  {...s.environment.basics.performance.share},
          roi:    {...s.environment.basics.performance.roi},
          growth: {...s.environment.basics.performance.growth}
        }
      },
      competitors: s.environment.competitors.map(c => ({...c, id: uid('c')})),
      ourCapabilities: {...s.environment.ourCapabilities}
    };
  }
  // 3. personas
  if(s.personas){
    d1.personas = s.personas.map(p => ({...p, traits: {...(p.traits||{})}}));
  }
  // 4. scenarios
  if(s.scenarios){
    d1.scenarios = s.scenarios.map(sc => ({
      id: uid('s'),
      name: sc.name,
      personaIds: sc.personaIds.slice(),
      benefits: {...sc.benefits},
      costs: {...sc.costs},
      anchor: sc.anchor,
      decisiveGap: sc.decisiveGap
    }));
  }
  // 5. metrics（保留一级 id，重置二级 id）
  if(s.metrics){
    d1.metrics = {
      dimensions: s.metrics.dimensions.map(dim => ({
        id: dim.id,
        name: dim.name,
        // 保留 sample 写的 s2.id（让 survey 的 sourceIndicatorId 能匹配上, 触发 backfillScores）
        secondaries: dim.secondaries.map(s2 => ({
          id: s2.id || uid('s'),
          name: s2.name,
          forecast: s2.forecast,
          target: s2.target,
          actual: s2.actual,
          measure: s2.measure
        }))
      })),
      disclaimerAcknowledged: s.metrics.disclaimerAcknowledged !== false
    };
  }
  // 6. survey（保留 question id 稳定以便 responses/indicatorMeans 引用）
  if(s.survey){
    d1.survey = {
      questions: s.survey.questions.map(q => ({...q, anchors: q.anchors ? q.anchors.slice() : null})),
      responses: [],
      n: s.survey.n || 0,
      status: s.survey.status || 'idle',
      mode: s.survey.mode || 'api',
      useFewShot: s.survey.useFewShot !== false,
      useRag: !!s.survey.useRag,
      ragContext: s.survey.ragContext || '',
      progress: {...(s.survey.progress || {done:0,total:0})},
      error: null,
      _doneKeys: []
    };
    // 合成响应：每个 persona × n 轮 × 10 题
    const qids = d1.survey.questions.map(q => q.id);
    const N = d1.survey.n;
    if(N > 0 && d1.personas.length > 0 && qids.length > 0){
      for(const p of d1.personas){
        for(let r=0; r<N; r++){
          const answers = qids.map((qid, i) => {
            // 用确定性的伪随机, 让 demo 稳定
            const seed = (p.id.charCodeAt(0) + p.id.charCodeAt(1||0) + r*7 + i*13) % 5;
            return { questionId:qid, value: (seed % 5) + 1, raw: 'demo 自动生成响应' };
          });
          d1.survey.responses.push({ personaId: p.id, answers });
        }
      }
    }
  }
  // 7. analysis
  if(s.analysis){
    d1.analysis = {
      likertStats: {...(s.analysis.likertStats || {})},
      openThemes:  (s.analysis.openThemes || []).slice(),
      indicatorMeans: (s.analysis.indicatorMeans || []).map(x => ({...x})),
      insights: s.analysis.insights || ''
    };
  }
  // 8. values
  if(s.values){
    d1.values = {
      functional: (s.values.functional || []).map(x => ({...x})),
      emotional:  (s.values.emotional  || []).map(x => ({...x})),
      social:     (s.values.social     || []).map(x => ({...x})),
      epistemic:  (s.values.epistemic  || []).map(x => ({...x})),
      conditional:(s.values.conditional|| []).map(x => ({...x})),
      chosenFunctional: s.values.chosenFunctional || '',
      chosenEmotional:  s.values.chosenEmotional  || '',
      chosenSocial:     s.values.chosenSocial     || '',
      rationale: s.values.rationale || ''
    };
  }
  // 9. recommendations
  if(s.recommendations){
    d1.recommendations = {
      short: s.recommendations.short || '',
      mid:   s.recommendations.mid   || '',
      long:  s.recommendations.long  || '',
      risks: (s.recommendations.risks || []).slice()
    };
  }
  // 10. 本地计算 likertStats + indicatorMeans + 回填 s2.actual
  // 不调 AI: 纯本地统计, 避免每次随机示例都浪费 token
  if(typeof Work1.analyzeResponses === 'function' && d1.survey.responses.length > 0){
    try{ Work1.analyzeResponses(); }catch(e){ console.warn('analyzeResponses after sample apply failed', e); }
  }
};

/* ---------- STEP 1: SBU ---------- */
Work1.render.sbu = function(sec){
  const d=state.work1.sbu;
  if(!Array.isArray(d.countries)) d.countries=[];

  // === 工具栏（右上角 · 随机生成示例，写入 step-header） ===
  // SBU_SAMPLES 与 applySBU 已提升到模块顶层 (供 Work5 复用)
  const headerEl = sec.querySelector('.step-header');
  if (headerEl && !headerEl.querySelector('.sbu-toolbar')) {
    const toolbar = el('div', {class:'sbu-toolbar'});
    const aiBox = el('div', {style:'position:static;margin:0'});
    const exBtn = el('button', {type:'button'}, '随机生成示例');
    toolbar.appendChild(exBtn);
    headerEl.appendChild(toolbar);
    exBtn.addEventListener('click', () => {
      // 覆盖前 confirm——这是"填满整个 Step 1"的操作，影响面更大
      const hasAnyData = !!(d.name || state.work1.environment.political || state.work1.personas.length || state.work1.metrics.dimensions.length || state.work1.survey.responses.length);
      if (hasAnyData && !confirm('这会覆盖 Step 1 当前所有 8 个子 step 的内容（SBU/环境/画像/指标/调研/分析/价值/建议），继续？')) return;
      // 判断是否有 API key + 是否在 manualMode
      const apiKey = (typeof API.config === 'function') ? API.config().apiKey : '';
      const useManual = (state.settings && state.settings.manualMode) || !apiKey;
      if (useManual) {
        // 手动模式 / 无 API key：直接用内置完整样本（防连点）
        const pool = WORK1_FULL_SAMPLES;
        let idx = Math.floor(Math.random() * pool.length);
        if (pool.length > 1 && idx === exBtn._lastSampleIdx) idx = (idx + 1) % pool.length;
        exBtn._lastSampleIdx = idx;
        Work1._applyWork1FullSample(pool[idx]);
        // 刷新所有 8 个子 step
        autosave(); App.updateSummary();
        Work1.rerender('sbu');
        ['environment','personas','metrics','survey','analysis','values','recommendations'].forEach(id => Work1.rerender(id));
        showToast('已填入 Step 1 完整示例（8 个子 step），手动模式。');
        return;
      }
      // API 模式：调 AI
      API.aiButton({
        button: exBtn, container: aiBox,
        buildPrompt: () => [{role:'system', content:'你是品牌国际化课程设计师。生成一个适合练习的虚构出海/OBM 品牌示例, 覆盖 Work 1 全部 8 个子 step。严格输出 JSON: ' +
          '{"sbu":{"name":"","category":"","stage":"初创期|成长期|成熟期|转型期|海外扩张期","scope":"东南亚|东亚（日韩）|南亚（印度等）|中东|欧洲|北美|拉美|非洲|大洋洲|全球","countries":[""],"summary":"","boundary":""},' +
          '"environment":{"political":"","economic":"","social":"","technological":"","industry":"","basics":{"scale":{"actual":"","target":"","source":""},"scope":{"actual":"","target":"","source":""},"products":{"actual":"","target":"","source":""},"customers":{"actual":"","target":"","source":""},"supply":{"actual":"","target":"","source":""},"performance":{"share":{"actual":"","target":"","source":""},"roi":{"actual":"","target":"","source":""},"growth":{"actual":"","target":"","source":""}}},"competitors":[{"name":"","price":"","strengths":"","weaknesses":"","position":""}],"ourCapabilities":{"delivery":"","core":"","brand":"","customer":"","compliance":"","defensive":"","critical":"","structural":"","smileCurve":"","trends":""}},' +
          '"personas":[{"name":"","gender":"","age":"","occupation":"","income":"","region":"","values":[""],"painPoints":"","channels":[""],"quote":"","traits":{"lifestyle":"","cert":""}}],' +
          '"scenarios":[{"name":"","personaIds":[""],"benefits":{"usage":"","service":"","staff":"","image":""},"costs":{"monetary":"","time":"","energy":"","psychic":""},"anchor":"","decisiveGap":""}],' +
          '"metrics":{"dimensions":[{"name":"","secondaries":[{"name":"","forecast":7,"target":9,"actual":8,"measure":""}]}],"disclaimerAcknowledged":true},' +
          '"survey":{"questions":[{"type":"likert","text":"","anchors":["完全不","不太","一般","比较","完全"]}],"n":2},' +
          '"analysis":{"insights":""},' +
          '"values":{"functional":[{"value":"","evidence":"","priority":"P0"}],"emotional":[{"value":"","evidence":"","priority":"P0"}],"social":[{"value":"","evidence":"","priority":"P0"}],"epistemic":[],"conditional":[],"chosenFunctional":"","chosenEmotional":"","chosenSocial":"","rationale":""},' +
          '"recommendations":{"short":"","mid":"","long":"","risks":[""]}}' +
          '。场景: 5 persona + 3 scenarios + 5 维 metrics × 3 测评点 + 10 题 likert + 5 维 values + 短中长期建议。'
        },
          {role:'user', content:'请生成一个虚构的 Work 1 完整示例 (8 个子 step 全填)。'}],
        onResult: r => {
          if (!r || !r.sbu || !r.sbu.name) { showToast('生成失败'); return; }
          Work1._applyWork1FullSample(r);
          autosave(); App.updateSummary();
          Work1.rerender('sbu');
          ['environment','personas','metrics','survey','analysis','values','recommendations'].forEach(id => Work1.rerender(id));
          showToast('已生成 Step 1 完整示例');
        }
      });
    });
  }

  // === 12-col magazine grid · SBU 基础字段 ===
  const grid = el('div', {class:'sbu-grid'});

  // SBU 名称（8 列 · 必填 echo）
  const nameField = el('div', {class:'sbu-cell-8 sbu-field'},
    el('span', {class:'sbu-label'}, 'SBU 名称'),
    el('input', {class:'sbu-input', type:'text', value: d.name, placeholder:'例：海外智能家居品牌 · 面向年轻消费者',
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
      el('span', {class:'muted', style:'text-transform:none;letter-spacing:0;font-style:italic;font-size:11px'}, '— 多选')),
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
    const showCountries = !!(d.scope && REGION_COUNTRIES[d.scope] && d.scope !== '全球');
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
  sec.appendChild(grid);

  // === Sub-head: STEP 1.1 · 业务三问 ===
  sec.appendChild(el('div', {class:'sbu-sub-head'},
    el('div', {class:'sbu-sub-head-left'},
      el('span', {class:'sbu-sub-num'}, 'STEP 1.1'),
      el('h3', {}, '业务三问（独立 SBU 自检）')
    ),
    el('span', {class:'sbu-sub-meta'}, '3 QUESTIONS · 任一为"是"即独立')
  ));
  sec.appendChild(el('p', {class:'sbu-sub-lead'},
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
    // 右列：pill + STATUS
    const pill = el('div', {class:'yn-pill', role:'group', 'aria-label': head},
      el('button', {type:'button', 'data-val':'no', class: yes ? '' : 'active'}, 'No'),
      el('button', {type:'button', 'data-val':'yes', class: yes ? 'active' : ''}, 'Yes')
    );
    const statusBox = el('div');
    statusBox.appendChild(el('span', {class:'hallmark-label'}, 'STATUS'));
    const statusLine = el('div', {class:'sbu-status-line ' + (yes ? 'on' : 'off'), 'data-default':'不独立'},
      yes ? '独立 · ' + dim : '不独立'
    );
    statusBox.appendChild(statusLine);
    const right = el('div', {class:'hallmark-right'}, pill, statusBox);
    item.appendChild(right);
    list.appendChild(item);

    pill.addEventListener('click', e => {
      const btn = e.target.closest('button');
      if (!btn) return;
      pill.querySelectorAll('button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const isYes = (btn.dataset.val === 'yes');
      tq[k] = isYes;
      if (isYes) {
        statusLine.classList.remove('off');
        statusLine.classList.add('on');
        statusLine.textContent = '独立 · ' + dim;
      } else {
        statusLine.classList.remove('on');
        statusLine.classList.add('off');
        statusLine.textContent = statusLine.dataset.default;
      }
      updateVerdict();
      autosave();
    });
  });
  sec.appendChild(list);

  // === Verdict 横条 ===
  const anyIndependent = !!(tq.customer || tq.channel || tq.brand);
  const verdict = el('div', {class:'sbu-verdict', 'data-state': anyIndependent ? 'independent' : 'extension'},
    el('span', {class:'v-label'}, '→ Verdict'),
    el('span', {class:'v-text'}, ''),
    el('span', {class:'v-pill'}, anyIndependent ? 'Independent' : 'Extension')
  );
  sec.appendChild(verdict);

  function updateVerdict(){
    const any = !!(tq.customer || tq.channel || tq.brand);
    const dims = [];
    if (tq.customer) dims.push('客户');
    if (tq.channel) dims.push('渠道');
    if (tq.brand) dims.push('品牌');
    if (any) {
      verdict.dataset.state = 'independent';
      verdict.querySelector('.v-pill').textContent = 'Independent';
      //verdict.querySelector('.v-text').textContent = '独立 SBU';
      verdict.querySelector('.v-text').textContent = '独立 SBU · ' + dims.join(' / ') ;

    } else {
      verdict.dataset.state = 'extension';
      verdict.querySelector('.v-pill').textContent = 'Extension';
      verdict.querySelector('.v-text').textContent = '可能只是现有业务延伸';
    }
  }
  updateVerdict(); // 用与勾选后一致的逻辑初始化判定文案

  // === 边界声明 CALLOUT（沿用全局 .callout，新增 .sbu-callout 修饰） ===
  const callout = el('div', {class:'callout sbu-callout'},
    el('span', {class:'c-label'}, ' 边界声明'),
    el('p', {class:'c-hint'}, '说明与母公司其他业务在客户、渠道、品牌、损益四维上的隔离点，以及复用/共享的资源（供应链、研发、资质等）。'),
    el('textarea', {
      placeholder:'例：与集团共享华南工厂与模具开发资源，但客户全部为美国 DTC、独立亚马逊店铺、自有品牌 HOTO；损益独立核算，由海外事业部单列 P&L。',
      oninput: e => { d.boundary = e.target.value; autosave(); }
    }, d.boundary || '')
  );
  sec.appendChild(callout);

  // === END 行 ===
  sec.appendChild(el('p', {class:'sbu-end'}, 'END · STEP 1'));
};

/* ---------- STEP 2: ENVIRONMENT ---------- */
/* ---------- 微笑曲线（Smile Curve）----------
   价值链 6 环节的 U 形附加值分布图: 研发/品牌两端的附加值最高,
   制造/装配的附加值最低, 末端售后略回升。
   用纯 SVG, 无外部依赖, 自适应宽度 (viewBox 800x320)。 */
Work1.renderSmileCurve = function(){
  const W=800, H=320, padL=60, padR=40, padT=30, padB=80;
  const cw=W-padL-padR, ch=H-padT-padB;
  // 6 环节: 附加值 (0-10), 名字
  const nodes = [
    {label:'研发/设计',  v:8.5, tip:'IP/外观/功能定义 — 最高附加值'},
    {label:'关键零部件', v:5.5, tip:'芯片/传感器/核心元器件'},
    {label:'制造/装配', v:2.5, tip:'低附加值 — 微笑曲线谷底'},
    {label:'物流/分销', v:4.0, tip:'履约/库存/渠道触达'},
    {label:'营销/品牌', v:9.0, tip:'溢价/认知/复购 — 最高附加值'},
    {label:'售后/服务', v:5.0, tip:'客户关系/续费/口碑'}
  ];
  const xFor = (i) => padL + (i/(nodes.length-1))*cw;
  const yFor = (v) => padT + (1 - v/10) * ch;
  // 平滑路径 (Bezier)
  let path = `M ${xFor(0)} ${yFor(nodes[0].v)}`;
  for(let i=1; i<nodes.length; i++){
    const px = xFor(i-1), py = yFor(nodes[i-1].v);
    const x = xFor(i), y = yFor(nodes[i].v);
    const cx1 = px + (x-px)*0.5, cy1 = py;
    const cx2 = px + (x-px)*0.5, cy2 = y;
    path += ` C ${cx1} ${cy1}, ${cx2} ${cy2}, ${x} ${y}`;
  }
  // 构造 SVG 字符串 (用 innerHTML 注入; 不需要 appendChild 链)
  const svgOpen = `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;max-height:380px;display:block;margin:0 auto">`;
  const grad = `<defs>
    <linearGradient id="smile-grad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#3A190F" stop-opacity="0.18"/>
      <stop offset="100%" stop-color="#3A190F" stop-opacity="0.02"/>
    </linearGradient>
  </defs>`;
  // 区域填充
  const baseY = yFor(0);
  const areaPath = path + ` L ${xFor(nodes.length-1)} ${baseY} L ${xFor(0)} ${baseY} Z`;
  // 标签
  const labels = nodes.map((n,i) => {
    const x = xFor(i), y = yFor(n.v);
    // 名字在上方（高值时）或下方（低值时）
    const isHigh = n.v >= 6;
    const labelY = isHigh ? y - 16 : y + 24;
    const valueY = isHigh ? y - 4 : y + 36;
    const valueColor = n.v >= 7 ? 'var(--maroon, #8B1F1F)' : (n.v <= 3 ? 'var(--muted, #888)' : 'var(--ink, #1A1A1A)');
    return `
      <g>
        <circle cx="${x}" cy="${y}" r="5" fill="var(--ink, #1A1A1A)"/>
        <text x="${x}" y="${labelY}" text-anchor="middle" font-family="var(--font-display, serif)" font-style="italic" font-size="14" fill="var(--ink, #1A1A1A)">${n.label}</text>
        <text x="${x}" y="${valueY}" text-anchor="middle" font-family="var(--font-mono, monospace)" font-size="11" fill="${valueColor}">附加值 ${n.v}</text>
        <title>${n.tip}</title>
      </g>`;
  }).join('');
  // 价值链底轴
  const axisY = yFor(0);
  const axis = `
    <line x1="${padL}" y1="${axisY}" x2="${W-padR}" y2="${axisY}" stroke="var(--line, #E5E2DC)" stroke-width="1" stroke-dasharray="3,3"/>
    <text x="${padL-8}" y="${axisY+4}" text-anchor="end" font-family="var(--font-mono, monospace)" font-size="10" fill="var(--muted, #888)">低</text>
    <text x="${padL-8}" y="${padT+10}" text-anchor="end" font-family="var(--font-mono, monospace)" font-size="10" fill="var(--muted, #888)">高</text>
    <text x="${W-padR+8}" y="${axisY+4}" text-anchor="start" font-family="var(--font-mono, monospace)" font-size="10" fill="var(--muted, #888)">价值链 →</text>
  `;
  // 谷底提示
  const valley = `
    <text x="${xFor(2)}" y="${H-padB+20}" text-anchor="middle" font-family="var(--font-mono, monospace)" font-size="10" fill="var(--maroon, #8B1F1F)" font-style="italic">↑ 微笑曲线谷底: 最低附加值</text>
  `;
  const svg = svgOpen + grad
    + `<path d="${areaPath}" fill="url(#smile-grad)"/>`
    + `<path d="${path}" fill="none" stroke="var(--ink, #1A1A1A)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`
    + axis
    + labels
    + valley
    + `<text x="${W/2}" y="${H-10}" text-anchor="middle" font-family="var(--font-mono, monospace)" font-size="10" fill="var(--muted, #888)" letter-spacing="0.15em">SMILE CURVE · 价值链附加值分布</text>`
    + `</svg>`;
  const wrap = el('div', {class:'smile-curve-wrap', style:'margin:12px 0 18px;padding:12px 16px;background:var(--bg-2, #FAF8F3);border:1px solid var(--line, #E5E2DC)'});
  wrap.innerHTML = svg;
  // 标题 + 简短说明
  const cap = el('div', {class:'muted', style:'font-size:12px;line-height:1.6;margin-top:6px;color:var(--muted, #888)'},
    '微笑曲线 (Stan Shih, 1992): 研发设计与品牌营销两端附加值最高, 制造装配最低。');
  wrap.appendChild(cap);
  return wrap;
};

Work1.render.environment = function(sec){
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
  sec.appendChild(el('h3',{},'PEST 宏观扫描'));
  sec.appendChild(grid);
  sec.appendChild(el('hr',{class:'rule'}));

  // —— 业务基本情况（Step 2：六维实况/目标）——
  sec.appendChild(el('h3',{},'业务基本情况（实况 / 目标）'));
  sec.appendChild(el('p',{class:'sbu-sub-lead'},'用六维表把业务现状结构化：规模与员工 / 业务范围 / 产品线 / 客户 / 供应链 / 最近业绩。每一维同时填实况（历史或当下数据）与目标（3-5 年期望值），概念阶段业务允许实况为空但目标必填。'));
  const b=d.basics;
  const trio=(obj,phActual,phTarget)=>el('div',{class:'basics-trio'},
    el('input',{type:'text',value:obj.actual||'',placeholder:phActual||'实况',oninput:e=>{obj.actual=e.target.value;autosave()}}),
    el('input',{type:'text',value:obj.target||'',placeholder:phTarget||'目标',oninput:e=>{obj.target=e.target.value;autosave()}}));
  const basicsRow=(title,obj,phA,phT)=>el('div',{class:'basics-row'},
    el('span',{class:'basics-label'},title), trio(obj,phA,phT));
  sec.appendChild(basicsRow('规模与员工（成立时间/面积/人数/资质）', b.scale));
  sec.appendChild(basicsRow('业务范围（做什么 / 不做什么，排除项必写）', b.scope));
  sec.appendChild(basicsRow('产品 / 业务线（SKU × 定价 × 场景 × 销量占比）', b.products));
  sec.appendChild(basicsRow('客户（直接客户/渠道/与母公司差异）', b.customers));
  sec.appendChild(basicsRow('供应链（来源/复用与新增/瓶颈）', b.supply));
  sec.appendChild(el('div',{class:'basics-row'},
    el('span',{class:'basics-label'},'最近业绩 · 市场份额'), trio(b.performance.share)));
  sec.appendChild(el('div',{class:'basics-row'},
    el('span',{class:'basics-label'},'最近业绩 · ROI'), trio(b.performance.roi)));
  sec.appendChild(el('div',{class:'basics-row'},
    el('span',{class:'basics-label'},'最近业绩 · 年增长率'), trio(b.performance.growth)));

  // —— 竞争者与我们的资源盘点（Step 3：内部·我们）——
  sec.appendChild(el('h3',{},'竞争者与资源盘点'));
  //sec.appendChild(el('p',{class:'sbu-sub-lead'},
    //'先看外部（市场 / 竞品），再看内部 。'));
  const mkField=(label,value,onInput,rows,ph)=>el('div',{class:'field field-h'},
    el('label',{},label), el('textarea',{rows,placeholder:ph||'',oninput:onInput},value||''));
  // 3.1 市场格局 [外部·市场]
  //sec.appendChild(el('h4',{class:'sub-section'},'3.1 市场格局 [外部·市场]'));
  sec.appendChild(mkField('市场格局摘要', d.industry, e=>{d.industry=e.target.value;autosave()}, 4,
    '这个市场由谁主导（活跃品牌数 / 头部）？渗透到什么程度（增量/替换）？区域与价格带怎么分布？是否存在未被占领的垂直定位空白？'));
  // 3.2 竞品对标 [外部·竞品]
  //sec.appendChild(el('h4',{class:'sub-section'},'3.2 竞品对标 [外部·竞品]'));

  // competitor table
  const tbl=el('table',{class:'data competitor-table'});
  tbl.appendChild(el('thead',{}, el('tr',{}, ...['竞品','价位','优势','劣势','我们的相对位置',''].map(h=>el('th',{},h)))));
  const tbody=el('tbody');
  d.competitors.forEach((c,i)=>{
    const inp=(key,ph)=>el('input',{type:'text',value:c[key]||'',placeholder:ph,
      oninput:e=>{c[key]=e.target.value;autosave()}});
    const tr=el('tr',{},
      el('td',{}, inp('name','竞品名称')),
      el('td',{}, inp('price','价位')),
      el('td',{}, inp('strengths','优势')),
      el('td',{}, inp('weaknesses','劣势')),
      el('td',{}, inp('position','相对位置')),
      el('td',{}, el('button',{class:'ghost small',onclick:()=>{d.competitors.splice(i,1);autosave();Work1.rerender('environment')}},'×'))
    );
    tbody.appendChild(tr);
  });
  tbl.appendChild(tbody);
  sec.appendChild(tbl);
  sec.appendChild(el('button',{class:'ghost',style:'margin:8px 0',onclick:()=>{
    d.competitors.push({id:uid('c'),name:'',price:'',strengths:'',weaknesses:'',position:''});
    autosave(); Work1.rerender('environment');
  }},'+ 添加竞品'));

  // 外部（3.1 市场 + 3.2 竞品）→ 内部（3.3 资源盘点）的分界
  sec.appendChild(el('hr',{class:'rule'}));

  // 3.3 我们的资源盘点（4 步手风琴：5 维 → 3 段 → 收口 → 趋势）
  sec.appendChild(el('h4',{},'资源盘点'));
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
  sec.appendChild(el('div',{class:'cap-accordion'},
    mkAccStep(1, '第 1 层 · 事实', '5 维能力', '我们有什么？客观描述家底清单，不需要下结论。', true, (body) => {
      body.appendChild(capField('交付', 'delivery', '产品或服务？我们能交付什么？'));
      body.appendChild(capField('核心', 'core', '别人没有的？能力/资源/关系？'));
      body.appendChild(capField('品牌', 'brand', '资产？知名度？溢价？'));
      body.appendChild(capField('客户', 'customer', '怎么找到？触达/渠道/关系？'));
      body.appendChild(capField('合规', 'compliance', '监管/资质/准入门槛？'));
    })
  ));
  // 第 2 步：3 段判断
  sec.appendChild(el('div',{class:'cap-accordion'},
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
  sec.appendChild(el('div',{class:'cap-accordion'},
    mkAccStep(3, '第 3 层 · 收敛（依赖第 2 层）', '微笑曲线收口', '优势/劣势落在价值链哪一端？这一句决定后续定位方向。', false, (body) => {
      // 微笑曲线图（SVG）: 价值链 6 环节, 左高-谷-右高的 U 形
      body.appendChild(Work1.renderSmileCurve());
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
  sec.appendChild(el('div',{class:'cap-accordion'},
    mkAccStep(4, '第 4 层 · 变量（独立观察）', '关键趋势', '未来 12-24 个月要盯什么？与第 3 层定位方向关联。', false, (body) => {
      body.appendChild(capField('3 个值得追踪的方向', 'trends', '例：节气营销、可追溯供应链、KOC 内容种草、私域订阅', 3));
      // AI 按钮放在第 4 步末尾
      body.appendChild(el('button',{class:'cap-ai-btn', onclick:()=>{
        // AI 一键生成：基于 SBU + 5 维 → 3 段 + 收口 + 趋势
        // 实际 AI 调用在下方 AI 盒子统一处理（防止重复按钮）
        showToast('请使用下方"用 AI 起草"按钮');
      }}, '用 AI 起草（基于 5 维 → 生成 3 段 + 收口 + 趋势）'));
      body.appendChild(el('div',{class:'cap-ai-hint'}, '必须先填第 1 层 5 维，AI 才有素材生成第 2/3/4 层。'));
    })
  ));

  // —— AI ——
  const ai=el('div',{class:'ai-box ai-box-step1'});
  const top=el('div',{class:'ai-box-top'});
  const meta=el('div',{class:'ai-box-meta'});
  meta.appendChild(el('span',{class:'ai-box-meta-tip'},'提示'));
  meta.appendChild(el('span',{class:'ai-box-meta-text'},'请先绑定 LLM'));
  meta.appendChild(el('span',{class:'ai-box-meta-sep'},'·'));
  meta.appendChild(el('span',{class:'ai-box-meta-draft'},'DRAFT WITH AI'));
  top.appendChild(meta);
  top.appendChild(el('h4',{class:'ai-box-headline'},'用 AI 起草环境与竞争分析'));
  top.appendChild(el('p',{class:'ai-box-hint'},'基于 SBU，生成 PEST、行业格局、5-7 家竞品对标行、我们的资源盘点（5 维 + 3 段 + 收口 + 趋势）。'));
  ai.appendChild(top);
  const action=el('div',{class:'ai-box-action'});
  const btn=el('button',{class:'primary',onclick:()=>{
    API.aiButton({
      button:btn, container:ai,
      buildPrompt:()=>[{role:'system',content:'你是全球品牌战略顾问。基于 SBU 生成结构化市场分析。输出 JSON：{"political":"","economic":"","social":"","technological":"","industry":"市场格局摘要（活跃品牌/渗透率/价格带/垂直空白）","competitors":[{"name":"","price":"","strengths":"","weaknesses":"","position":""}],"ourCapabilities":{"delivery":"产品/服务交付能力（能交付什么？怎么交付？标准化？）","core":"核心能力/资源/关系（别人短期追不上的）","brand":"品牌资产/知名度/溢价能力","customer":"客户触达/渠道/关系","compliance":"监管/资质/准入门槛","defensive":"防御性优势（对手短期难复制的 1-2 点）","critical":"关键劣势（客户能直接感知的致命短板）","structural":"结构性劣势（受资源/位置限制、宜绕开）","smileCurve":"优势/劣势落在价值链哪一端、决定后续定位方向","trends":"3 个值得追踪的方向"}}。competitors 给 5-7 家同价位同场景直接竞品。'},
        {role:'user',content:`SBU: ${state.work1.sbu.name}\n品类: ${state.work1.sbu.category}\n阶段: ${state.work1.sbu.stage}\n范围: ${state.work1.sbu.scope}\n概述: ${state.work1.sbu.summary}`}],
      onResult:r=>{
        if(!r){ showToast('解析失败'); return; }
        ['political','economic','social','technological','industry'].forEach(k=>{ if(r[k]) d[k]=r[k]; });
        if(Array.isArray(r.competitors)) d.competitors=r.competitors.map(c=>({id:uid('c'),name:c.name||'',price:c.price||'',strengths:c.strengths||'',weaknesses:c.weaknesses||'',position:c.position||''}));
        // 兼容：AI 返回 ourCapabilities（新版）或 edges（旧版）
        const cap = r.ourCapabilities || r.edges;
        if(cap && typeof cap==='object'){
          if(!d.ourCapabilities) d.ourCapabilities={};
          // 通用 5 维：旧字段名 → 新字段名（AI 偶发回退兼容）
          const oldToNew = {manufacturing:'delivery', technology:'core', channel:'customer'};
          Object.keys(cap).forEach(k=>{
            if(cap[k]!=null){
              const newKey = oldToNew[k] || k;
              d.ourCapabilities[newKey] = cap[k];
            }
          });
        }
        autosave(); Work1.rerender('environment');
      }
    });
  }},'开始生成');
  action.appendChild(btn);
  ai.appendChild(action);
  sec.appendChild(ai);
};

/* ---------- STEP 3: PERSONAS ---------- */
Work1.render.personas = function(sec){
  // —— Step 4：场景级感知价值矩阵（4×4）——
  if(!Array.isArray(state.work1.scenarios)) state.work1.scenarios=[];
  const sc=state.work1.scenarios;
  sec.appendChild(el('h3',{},'场景级客户感知价值矩阵'));
  sec.appendChild(el('p',{class:'muted italic',style:'font-size:13px'},
    '客户感知价值 = 总利益（使用/服务/人员/形象）− 总成本（货币/时间/精力/心理）。按场景拆分（建议 2-4 个），每张矩阵勾选关联画像，并定位决定性短板（信任 / 易用 / 规模化成本）。'));

  const scList=el('div',{class:'scenario-list'});
  sc.forEach((s,i)=>{
    if(!s.benefits) s.benefits={usage:'',service:'',staff:'',image:''};
    if(!s.costs) s.costs={monetary:'',time:'',energy:'',psychic:''};
    if(!Array.isArray(s.personaIds)) s.personaIds=[];
    const card=el('article',{class:'scenario-card'});
    const head=el('div',{class:'scenario-head'},
      el('input',{type:'text',value:s.name||'',placeholder:'场景名（如：自用购买 / 送礼 / 复购）',
        style:{flex:'1',fontFamily:'var(--font-body)',fontSize:'18px',fontStyle:'italic',border:'none',borderBottom:'1px solid var(--line)',background:'transparent'},
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
      el('h4',{class:'mono',style:'font-size:11px;letter-spacing:.1em;margin:0 0 4px 0;text-transform:uppercase;color:var(--muted)'},'总利益'),
      ...[['usage','使用价值：功能/性能/解决的问题'],['service','服务价值：售后/咨询/配送/维修'],['staff','人员价值：服务人员专业度与态度'],['image','形象价值：身份认同/心理满足']]
        .map(([k,ph])=>el('div',{style:'margin-bottom:6px'}, cell(s.benefits,k,ph))));
    const cst=el('div',{class:'scenario-bloc'},
      el('h4',{class:'mono',style:'font-size:11px;letter-spacing:.1em;margin:0 0 4px 0;text-transform:uppercase;color:var(--muted)'},'总成本'),
      ...[['monetary','货币成本：直接花费'],['time','时间成本：选购/等待/学习'],['energy','精力成本：挑选/对比/手续'],['psychic','心理成本：担心/焦虑/顾虑']]
        .map(([k,ph])=>el('div',{style:'margin-bottom:6px'}, cell(s.costs,k,ph))));
    grid.appendChild(ben); grid.appendChild(cst);
    card.appendChild(grid);
    card.appendChild(el('div',{style:'margin-top:8px'},
      el('div',{class:'mono',style:'font-size:11px;letter-spacing:.1em;margin:0 0 4px 0;text-transform:uppercase;color:var(--muted)'},'顾客价值锚点（客户真正用什么标尺评判，不是企业自评）'),
      el('input',{type:'text',value:s.anchor||'',placeholder:'如：送礼是否有面子、产地是否可信',oninput:e=>{s.anchor=e.target.value;autosave()}})));
    card.appendChild(el('div',{style:'margin-top:8px'},
      el('div',{class:'mono',style:'font-size:11px;letter-spacing:.1em;margin:0 0 4px 0;text-transform:uppercase;color:var(--muted)'},'决定性短板（信任 / 易用 / 规模化成本 中是哪个，一句话说明）'),
      el('input',{type:'text',value:s.decisiveGap||'',placeholder:'如：信任——客户无法验证产地真伪',oninput:e=>{s.decisiveGap=e.target.value;autosave()}})));
    scList.appendChild(card);
  });
  sec.appendChild(scList);
  const scActions=el('div',{class:'ai-actions'},
    el('button',{class:'ghost',onclick:()=>{sc.push({id:uid('sc'),name:'',personaIds:[],benefits:{},costs:{},anchor:'',decisiveGap:''});autosave();Work1.rerender('personas')}},'+ 添加场景'));
  if(state.work1.personas.length){
    const ai=el('div',{class:'ai-box'});
    const aiBtn=el('button',{class:'primary',onclick:()=>{
      API.aiButton({button:aiBtn,container:ai,
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
  sec.appendChild(scActions);
  sec.appendChild(el('hr',{class:'rule'}));

  // —— 画像卡片（沿用现有模式，不动）——
  sec.appendChild(el('h3',{},'客户画像'));
  const d=state.work1.personas;
  const list=el('div',{id:'personaList'});
  d.forEach((p,i)=>list.appendChild(Work1.personaCard(p, i)));
  sec.appendChild(list);
  sec.appendChild(el('div',{class:'row',style:{marginTop:'16px'}},
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
    button:btn, container:ai,
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
Work1.render.metrics = function(sec){
  if(!state.work1.metrics) state.work1.metrics={dimensions:[]};
  const m=state.work1.metrics;
  if(!Array.isArray(m.dimensions)) m.dimensions=[];

  // 评分性质声明（5.4.4 必加）
  sec.appendChild(el('div',{class:'notice disclaimer'},
    '评分性质说明：以下「首年预测分」「三年目标分」均为预测/目标值，非真实市场调研。完成  合成调研或导入真实问卷后，系统会用李克特 1-5 均值映射成 1-10 回填「实测分」，并保留预测值以对照偏差。'));

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
      oninput:e=>{dim.name=e.target.value;autosave();}});
    Object.assign(nameInput.style,{fontFamily:'var(--font-body)',fontSize:'20px',fontStyle:'italic',width:'100%',border:'none',borderBottom:'1px solid var(--line)',background:'transparent',padding:'4px 0'});
    mid.appendChild(nameInput);

    // secondary scoring rows
    const tbl=el('table',{class:'data metric-table'});
    const thead=el('tr',{}, ...['二级测评点','量化口径（怎么衡量/什么算高分）','首年预测','三年目标','实测','Δ'].map(h=>el('th',{},h)));
    tbl.appendChild(el('thead',{},thead));
    const tbody=el('tbody');
    const numIn=(s2,key,oninput)=>{
      const inp=el('input',{type:'number',min:1,max:10,step:1,value:s2[key]==null?'':s2[key],style:{width:'58px',textAlign:'center'},
        oninput:e=>{ const v=e.target.value===''?null:clamp(parseInt(e.target.value),1,10); s2[key]=v; e.target.value=v==null?'':v; oninput&&oninput(); autosave(); Work1.updateMetricSummary(); }});
      return inp;
    };
    dim.secondaries.forEach((s2,j)=>{
      const delta = (s2.actual!=null && s2.forecast!=null) ? (s2.actual - s2.forecast) : null;
      const deltaCell=el('td',{class:'metric-delta'}, delta==null?'—':(delta>0?'+':'')+delta.toFixed(1));
      if(delta!=null && Math.abs(delta)>1.5) deltaCell.style.color='var(--maroon)';
      const tr=el('tr',{},
        el('td',{}, el('input',{type:'text',value:s2.name||'',placeholder:'测评点名称',
          oninput:e=>{s2.name=e.target.value;autosave()}})),
        el('td',{}, el('input',{type:'text',value:s2.measure||'',placeholder:'如：NPS / 复购率 / 5分占比',
          oninput:e=>{s2.measure=e.target.value;autosave()}})),
        el('td',{}, numIn(s2,'forecast')),
        el('td',{}, numIn(s2,'target')),
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
  sec.appendChild(list);

  // 软校验
  const lowDim=m.dimensions.length<5;
  const lowSec=m.dimensions.some(d=>(d.secondaries||[]).length<3);
  if(lowDim || lowSec){
    sec.appendChild(el('p',{class:'muted italic',style:'font-size:13px;margin-top:8px'},
      '硬性要求：≥5 个一级指标，每个 ≥3 个测评点。当前 '
      + (lowDim?'一级 '+m.dimensions.length+'/5；':'')
      + (lowSec?'有一级指标测评点 <3':'')));
  }

  // 整组与单项汇总
  const sum=el('div',{class:'metric-summary'});
  sec.appendChild(sum);
  sec._summaryEl=sum;
  Work1.renderMetricSummary(sum);

  const actions=el('div',{class:'ai-actions'},
    el('button',{class:'ghost',onclick:()=>{m.dimensions.push({id:uid('m'),name:'',secondaries:[]});autosave();Work1.rerender('metrics')}},'+ 添加一级指标'),
    (()=>{ const btn=el('button',{class:'primary',onclick:()=>{
      API.aiButton({button:btn, container:sec,
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
  sec.appendChild(el('hr',{class:'rule'}));
  sec.appendChild(actions);
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
      el('div',{class:'mono',style:'font-size:11px;color:var(--muted)'},r.name),
      el('div',{style:'font-size:22px;font-family:var(--font-body);font-style:italic'},r.avg!=null?r.avg.toFixed(1):'—'),
      el('div',{class:'mono',style:'font-size:10px;color:var(--muted)'},r.n+' 个预测分')));
  });
  box.appendChild(grid);
  const withDelta=all.filter(s=>s.actual!=null);
  if(withDelta.length){
    withDelta.sort((a,b)=>(b.actual-b.forecast)-(a.actual-a.forecast));
    const best=withDelta[0], worst=withDelta[withDelta.length-1];
    box.appendChild(el('p',{class:'muted',style:'font-size:13px;margin-top:8px'},
      '实测偏差最大：'+(worst.actual-worst.forecast>0?'':'')+(worst.actual-worst.forecast).toFixed(1)+'（'+worst.name+'）；表现最好：+'+(best.actual-best.forecast).toFixed(1)+'（'+best.name+'）。|Δ|>1.5 为认知断点。'));
  }else{
    box.appendChild(el('p',{class:'muted italic',style:'font-size:13px;margin-top:8px'},'尚无实测分——运行  合成调研并完成  分析后，这里会显示回填偏差。'));
  }
};
Work1.updateMetricSummary = function(){
  const box=document.querySelector('#steps1 .step[data-step="metrics"] .metric-summary');
  if(box) Work1.renderMetricSummary(box);
};

/* ---------- STEP 5: SURVEY ---------- */
Work1.render.survey = function(sec){
  const s=state.work1.survey;
  if(!state.work1.personas.length){
    sec.appendChild(el('div',{class:'warning'},'请先在「客户画像」步骤至少添加一个画像。'));
    return;
  }

  // question designer — card style
  sec.appendChild(el('h3',{},'问卷设计'));

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
  sec.appendChild(list);

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
  sec.appendChild(designerActions);

  sec.appendChild(el('hr',{class:'rule'}));
  sec.appendChild(el('h3',{},'运行合成调研'));

  const options=el('div',{class:'grid3'},
    UI.field('每位画像重复样本数', (()=>{
      const inp=el('input',{type:'number',min:1,max:20,value:s.n||3,oninput:e=>{s.n=parseInt(e.target.value)||1;autosave()}});
      return inp;
    })()),
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
  sec.appendChild(options);

  // progress & actions
  const bar=el('div',{class:'progress-bar'}, el('div',{style:{transform:'scaleX('+(s.progress.total? s.progress.done/s.progress.total:0)+')'}}));
  sec.appendChild(bar);
  const statusLine=el('p',{class:'mono',style:'font-size:11px;color:var(--muted)'}, Work1.surveyStatus());
  sec.appendChild(statusLine);
  const runBtn=el('button',{class:'primary',onclick:e=>Work1.runSurvey(e.currentTarget)},
    (s.status==='paused'||s.status==='aborted')?'继续合成调研':'运行合成调研');
  const actions=el('div',{class:'ai-actions'}, runBtn,
    el('button',{class:'ghost',onclick:()=>Work1.analyzeResponses()},'重新分析'),
    el('button',{class:'ghost',onclick:()=>{ if(confirm('清空已有回答？')){s.responses=[];s._doneKeys=[];s.status='idle';s.likertStats={};s.openThemes=[];autosave();Work1.rerender('survey');}}},'清空回答')
  );
  sec.appendChild(actions);
  if(s.error) sec.appendChild(el('div',{class:'warning'},s.error));
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
  const a=state.work1.analysis; const s=state.work1.survey;
  if(!s.responses.length){ sec.appendChild(el('div',{class:'warning'},'尚无调研数据，请先运行合成调研。')); return; }

  sec.appendChild(el('h3',{},'Likert 题项分布'));
  s.questions.filter(q=>q.type==='likert').forEach(q=>{
    const stat=a.likertStats[q.id]; if(!stat) return;
    const an=Array.isArray(q.anchors)&&q.anchors.length===5?q.anchors:LIKERT5;
    const plate=el('section',{class:'plate'},
      el('span',{class:'plate-label'},`L14 · HUNDRED FIELD · ${q.text}`),
      el('div',{class:'row'},
        (()=>{const c=el('div'); renderHundredField(c, [
          {label:'5 '+an[4],count:Math.round(stat.dist[4]/stat.n*100),color:'#3A190F'},
          {label:'4 '+an[3],count:Math.round(stat.dist[3]/stat.n*100),color:'#6B3B2A'},
          {label:'3 '+an[2],count:Math.round(stat.dist[2]/stat.n*100),color:'#A79E91'},
          {label:'2 '+an[1],count:Math.round(stat.dist[1]/stat.n*100),color:'#D4CFC4'},
          {label:'1 '+an[0],count:Math.round(stat.dist[0]/stat.n*100),color:'#E8DFD8'},
        ]); return c;})(),
        el('div',{},
          el('p',{class:'mono',style:'font-size:12px'},`n=${stat.n} · 均值 ${stat.mean.toFixed(2)} · SD ${stat.sd.toFixed(2)}`),
          el('p',{class:'italic muted',style:'font-size:13px'},q.text)
        )
      )
    );
    sec.appendChild(plate);
  });

  sec.appendChild(el('h3',{},'指标均值排名'));
  const barPlate=el('section',{class:'plate'}, el('span',{class:'plate-label'},'F5 · TICK ROWS · 指标均值'));
  const barC=el('div');
  renderBarChart(barC, a.indicatorMeans.slice().sort((x,y)=>y.value-x.value), {unit:''});
  barPlate.appendChild(barC); sec.appendChild(barPlate);

  // 预测/实测对照（Step 5 双列评分 + 回填偏差）
  const scored=[];
  (state.work1.metrics.dimensions||[]).forEach(dim=>(dim.secondaries||[]).forEach(s2=>{
    if(s2.forecast!=null || s2.actual!=null) scored.push({dim:dim.name, ...s2});
  }));
  if(scored.length){
    sec.appendChild(el('h3',{},'预测/实测回填'));
    const tbl=el('table',{class:'data'});
    tbl.appendChild(el('thead',{}, el('tr',{}, ...['一级指标','测评点','首年预测','三年目标','实测(1-10)','Δ(实测−预测)'].map(h=>el('th',{},h)))));
    const tb=el('tbody');
    scored.forEach(s2=>{
      const delta=s2.actual!=null&&s2.forecast!=null?(s2.actual-s2.forecast):null;
      const dc=el('td',{}, delta==null?'—':(delta>0?'+':'')+delta.toFixed(1));
      if(delta!=null&&Math.abs(delta)>1.5) dc.style.color='var(--maroon)';
      tb.appendChild(el('tr',{},
        el('td',{},s2.dim||''), el('td',{},s2.name||''),
        el('td',{class:'mono'},s2.forecast??'—'), el('td',{class:'mono'},s2.target??'—'),
        el('td',{class:'mono'},s2.actual!=null?s2.actual.toFixed(1):'—'), dc));
    });
    tbl.appendChild(tb); sec.appendChild(el('section',{class:'plate'},
      el('span',{class:'plate-label'},'BACKFILL · 李克特 1-5 映射为 1-10'), tbl));
  }

  // open-ended with AI theme extraction (work1 默认全李克特，仅当存在开放题时显示)
  if(a.openThemes && a.openThemes.length){
  sec.appendChild(el('h3',{},'开放题主题'));
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
  sec.appendChild(hmList);
  }

  sec.appendChild(el('h3',{},'综合洞察'));
  sec.appendChild(UI.field('AI 或自己撰写的综合洞察', el('textarea',{rows:6,oninput:e=>{a.insights=e.target.value;autosave()}},a.insights)));
  const insightAi=el('div',{class:'ai-box'});
  const insightBtn=el('button',{class:'primary',onclick:()=>{
    API.aiButton({
      button:insightBtn, container:insightAi,
      buildPrompt:()=>[{role:'system',content:'你是市场研究总监。根据给定的描述性统计与开放题主题，撰写 5-8 条可执行洞察。输出 JSON: {"insights":"..."}'},
        {role:'user',content:Work1.surveyDigest()}],
      onResult:r=>{ if(r?.insights){ a.insights=r.insights; autosave(); Work1.renderStep('analysis'); } }
    });
  }},'用 AI 综合洞察');
  insightAi.appendChild(insightBtn);
  sec.appendChild(insightAi);
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
    button:btn, container:plate,
    buildPrompt:()=>[{role:'system',content:'你是定性研究分析师。从开放题答案中归纳 4-6 个主题。输出 JSON: {"themes":[{"label":"","count":0}],"quotes":[""]}'},
      {role:'user',content:`题目：${ot.question}\n\n回答：\n${ot.texts.map((t,i)=>`${i+1}. ${t}`).join('\n')}`}],
    onResult:r=>{
      if(r?.themes){ ot.themes=r.themes; ot.quotes=r.quotes||[]; autosave(); Work1.renderStep('analysis'); }
    }
  });
};

/* ---------- STEP 7: VALUES ---------- */
Work1.render.values = function(sec){
  const v=state.work1.values;
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
  sec.appendChild(list);

  sec.appendChild(el('hr',{class:'rule'}));
  sec.appendChild(el('h3',{},'选定的三层核心价值'));

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
  sec.appendChild(mkH('功能主轴', v.chosenFunctional, e=>{v.chosenFunctional=e.target.value;autosave()}, '例：可追溯原产地 · 节气限定'));
  sec.appendChild(mkH('情感主轴', v.chosenEmotional,  e=>{v.chosenEmotional=e.target.value;autosave()},  '例：慢生活仪式感 · 文化亲近'));
  sec.appendChild(mkH('社会主轴', v.chosenSocial,    e=>{v.chosenSocial=e.target.value;autosave()},    '例：高品位送礼场景 · 文化身份认同'));
  sec.appendChild(mkH('取舍理由', v.rationale,       e=>{v.rationale=e.target.value;autosave()},       '为什么是这三条？为什么放弃了另两条？', true));

  const ai=el('div',{class:'ai-box'});
  const btn=el('button',{class:'primary',onclick:()=>{
    API.aiButton({
      button:btn,container:ai,
      buildPrompt:()=>[{role:'system',content:'你是品牌价值框架专家。根据 SBU、客户画像、调研洞察，提出功能/情感/社会/认知/条件 5 类价值要素，并从中选出三条主轴。输出 JSON: {"functional":[],"emotional":[],"social":[],"epistemic":[],"conditional":[],"chosenFunctional":"","chosenEmotional":"","chosenSocial":"","rationale":""}'},
        {role:'user',content:`SBU:${state.work1.sbu.name}\n画像:${state.work1.personas.map(p=>p.name+':'+p.painPoints).join('\n')}\n洞察:\n${state.work1.analysis.insights}`}],
      onResult:r=>{
        if(!r)return;
        ['functional','emotional','social','epistemic','conditional','chosenFunctional','chosenEmotional','chosenSocial','rationale'].forEach(k=>{ if(r[k]!=null) v[k]=r[k]; });
        autosave(); Work1.renderStep('values');
      }
    });
  }},'用 AI 起草价值框架');
  ai.appendChild(btn); sec.appendChild(ai);
};

/* ---------- STEP 8: RECOMMENDATIONS ---------- */
Work1.render.recommendations = function(sec){
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
  sec.appendChild(list);

  const ai=el('div',{class:'ai-box'});
  const btn=el('button',{class:'primary',onclick:()=>{
    API.aiButton({
      button:btn,container:ai,
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
  ai.appendChild(btn); sec.appendChild(ai);
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

/* ============================================================
   RandomExample — 共享工具：给任意 work 的 step-header 挂一个
   "随机生成示例"按钮（手动模式用内置样本，AI 模式调 API.aiButton）。

   由 Work1 加载完成时挂到 window.RandomExample，其他 work 复用。
   设计：跟 Step 1 的 sbu-toolbar 按钮 100% 一致——覆盖前 confirm、
   防连点、auto 模式 fallback 到 manual。
   ============================================================ */
window.RandomExample = {
  /**
   * 把"随机生成示例"按钮挂到某个 step 的 step-header。
   *
   * @param {Object} cfg
   * @param {HTMLElement} cfg.section      - step 对应的 sec（.step[data-step=...]）
   * @param {string}      cfg.workKey      - 'work2' | 'work3' | 'work4' | 'work5'
   * @param {Array}       cfg.samples      - 内置样本数组，每条是 applySample 能接受的完整对象
   * @param {string}      cfg.coverMsg     - confirm 提示语（如 "这会覆盖当前目标市场选择，继续？"）
   * @param {Function}    cfg.hasData      - () => bool，判断当前 work 是否有数据
   * @param {Function}    cfg.applySample  - (sample) => void，应用样本到 state.<workKey> 并 rerender
   * @param {Function}    cfg.buildPrompt  - () => [{role,content},...] for API.aiButton
   * @param {Function}    cfg.onAiResult   - (aiResult, helpers) => void，把 AI 返回应用到 state
   * @param {Array}       [cfg.rerenderIds] - rerender 列表（默认只 rerender 当前 step）
   * @param {boolean}     [cfg.aggregateAll] - Work5 专用：true 时按钮调 Work5.aggregateAll
   */
  mount(cfg){
    const sec = cfg.section;
    if(!sec) return;
    const headerEl = sec.querySelector('.step-header') || sec;
    if(!headerEl) return;
    // 防重复挂（step-header 重建后再次进入 step 也会重渲）
    const markerClass = 're-toolbar-' + cfg.workKey;
    if(headerEl.querySelector('.' + markerClass)) return;

    const toolbar = el('div', {class: 'sbu-toolbar ' + markerClass});
    const aiBox = el('div', {style:'position:static;margin:0'});
    const btn = el('button', {type:'button'}, '随机生成示例');
    toolbar.appendChild(btn);
    headerEl.appendChild(toolbar);

    const ns = cfg.workKey.replace(/^work/, 'Work');
    const work = (typeof window !== 'undefined') ? window[ns] : null;
    const refresh = () => {
      try{ autosave(); }catch(_){}
      try{ if(typeof App !== 'undefined' && App.updateSummary) App.updateSummary(); }catch(_){}
      if(!work) return;
      const ids = (cfg.rerenderIds && cfg.rerenderIds.length) ? cfg.rerenderIds : [(sec.dataset && sec.dataset.step)].filter(Boolean);
      ids.forEach(id => { try{ work.rerender(id); }catch(_){} });
    };

    btn.addEventListener('click', () => {
      if(cfg.hasData && cfg.hasData() && !confirm(cfg.coverMsg || '这会覆盖当前内容，继续？')) return;
      const apiKey = (typeof API !== 'undefined' && typeof API.config === 'function') ? (API.config().apiKey || '') : '';
      const useManual = (state.settings && state.settings.manualMode) || !apiKey;
      if(useManual){
        const pool = (cfg.samples || []).slice();
        if(!pool.length){ showToast('暂无可用样本'); return; }
        let idx = Math.floor(Math.random() * pool.length);
        if(pool.length > 1 && idx === btn._lastSampleIdx) idx = (idx + 1) % pool.length;
        btn._lastSampleIdx = idx;
        btn._currentSample = pool[idx];
        if(cfg.aggregateAll){
          // Work5 特殊：把当前样本应用到 state 后再触发 aggregate
          if(cfg.applySample) cfg.applySample(btn._currentSample);
          try{ autosave(); }catch(_){}
          const ns = cfg.workKey.replace(/^work/, 'Work');
          const w = window[ns];
          if(w && typeof w.aggregateAll === 'function') w.aggregateAll();
          return;
        }
        cfg.applySample(btn._currentSample);
        showToast('已填入示例（手动模式，可在 AI 设置里配 API key 走 AI 生成）');
        refresh();
        return;
      }
      // API 模式
      const prompt = cfg.buildPrompt();
      API.aiButton({
        button: btn, container: aiBox,
        buildPrompt: () => prompt,
        onResult: r => {
          if(!r){ showToast('生成失败'); return; }
          if(cfg.onAiResult) cfg.onAiResult(r, { refresh });
          else refresh();
        }
      });
    });
  }
};
