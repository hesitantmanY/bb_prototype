/* ============================================================
 xiaohuo-ji / work1 — 业务价值体系 (T09 filled)
 字段值参考 docs/demo-data.js xiaohuo.work1 叙事基线，
 形状严格匹配 Work1.defaultData()。
 ============================================================ */
(function(){
  const data = {
    sbu: {
      name: '小镬记',
      category: '餐饮 / 粤菜融合（堂食+融合菜研发+连锁）',
      stage: '成长期',
      scope: '国内',
      countries: ['中国'],
      summary: '广州家族餐厅，2 家直营店，老店 30 年（荔湾）+ 新店 2 年（珠江新城），年营收 600 万，5 位粤菜师傅，15 道招牌菜，年坪效 1.2 万元/㎡，毛利 55%。',
      threeQuestions: { customer: true, channel: false, brand: true },
      boundary: '客户：聚焦 25-45 岁中端堂食客，不做外卖专店、不做婚宴/团餐；渠道：堂食+小程序+美团+抖音同城号，不依赖外卖平台；品牌：小镬记为独立家族品牌，不与老陈个人名号混用；损益：2 家店独立核算，复用老店师傅团队与食材供应链。'
    },
    environment: {
      political: '餐饮预制菜监管收紧，《餐饮服务食品安全监管》要求明厨亮灶、半成品溯源；广州、深圳对餐饮油烟/垃圾分类监管加强。',
      economic: '2023 年餐饮收入 5.2 万亿（同比增 16.9%），粤菜占全国餐饮 8.4%；购物中心餐饮倒闭率上升，差异化融合菜反向增长。',
      social: 'Z 世代追求"出片+体验"；家庭客回归堂食重视"真材实料"；探店博主驱动新店流量；老字号国潮复兴。',
      technological: '抖音同城号/小红书探店种草成熟；小程序点餐+会员系统普及；明厨亮灶直播/中央厨房可视化。',
      industry: '粤菜头部：广州酒家（150 元，宴席/老字号）、点都德（80 元，早茶/茶楼）、炳胜（200 元，精品粤菜）、顺德食通天、太兴餐厅；融合菜新锐：gaga、渔宴、新长福。',
      basics: {
        scale: { actual: '2 家直营，5 位粤菜师傅，年营收 600 万', target: '5 家直营 + 2 家加盟，年营收 2500 万', source: '内部台账 + 战略规划' },
        scope: { actual: '堂食为主，2 家直营（荔湾/珠江新城）', target: '深圳/上海各 1 家直营 + 加盟', source: '战略规划' },
        products: { actual: '15 道招牌粤菜 + 时令融合菜', target: '融合菜占比 30% + 招牌菜标准化', source: '产品路线图' },
        customers: { actual: '老客回头 60% + 探店博主引流 25%', target: '老客 50% + 小程序会员 30% + 抖音同城 20%', source: '用户调研' },
        supply: { actual: '清远鸡/顺德鱼生原产地直供，5 家供应商', target: '保留 5 家 + 新增 2 家融合食材供应链', source: '供应链' },
        performance: {
          share: { actual: '广州粤菜细分 0.3%', target: '1%（深圳/上海各 1 家贡献）', source: '目标推导' },
          roi: { actual: '1.3', target: '1.5', source: '财务模型' },
          growth: { actual: '年增 8%', target: '年增 35%（连锁带动）', source: '行业基准 + 融合菜红利' }
        }
      },
      competitors: [
        { id:'c1', name:'广州酒家', price:'人均 150 元', strengths:'老字号、宴席/早茶全场景、电商预制菜', weaknesses:'年轻化弱、菜品创新慢、客群偏家庭', position:'以"融合菜+出片体验"差异化' },
        { id:'c2', name:'点都德', price:'人均 80 元', strengths:'早茶品类心智强、价格亲民', weaknesses:'正餐场景弱、品牌形象传统', position:'以"中端价位+正餐融合"错位' },
        { id:'c3', name:'炳胜', price:'人均 200 元', strengths:'精品粤菜标杆、食材高端', weaknesses:'客单价高、新客门槛高、扩张慢', position:'以"30 年老店信任+性价比"切入' },
        { id:'c4', name:'太兴餐厅', price:'人均 90 元', strengths:'港式茶餐厅连锁、年轻化', weaknesses:'粤菜正宗度弱、原产地溯源弱', position:'以"老陈 30 年粤菜功底"差异化' },
        { id:'c5', name:'gaga（融合菜）', price:'人均 120 元', strengths:'融合菜+高颜值+商场店', weaknesses:'粤菜根基弱、复购低', position:'以"老店粤菜底蕴+融合创新"对抗' }
      ],
      ourCapabilities: {
        delivery: '5 位粤菜师傅 + 15 道招牌菜稳定出品，融合菜研发由小陈主导',
        core: '老陈 30 年粤菜功底 + 荔湾老店品牌沉淀',
        brand: '老店口碑强（30 年），但新店抖音/小红书运营弱',
        customer: '老客 60% 复购 + 探店博主引流',
        compliance: '明厨亮灶+SC 食品经营许可+食材溯源',
        defensive: '30 年老店信任 + 5 位师傅稳定 + 原产地食材',
        critical: '新店扩张资金有限 + 融合菜研发节奏慢',
        structural: '家族企业决策快，但缺连锁化人才（店长/营销/加盟）',
        smileCurve: '优势在品牌（30 年老店）+ 核心（粤菜师傅），劣势在客户（缺年轻会员运营）——定位为"老店信任 + 融合创新 + 抖音同城种草"三轮',
        _vcSig: '',
        trends: '融合菜、出片体验、探店博主、明厨亮灶直播、老字号国潮'
      }
    },
    personas: [
      { id:'p1', name:'林晓棠', gender:'女', age:'28', occupation:'互联网产品经理', income:'一线 32 万/年', region:'广州珠江新城',
        values:['出片颜值','体验独特','探店打卡'], painPoints:'传统粤菜环境老气、菜品单一、缺社交分享点',
        channels:['小红书','抖音','大众点评'], quote:'我愿意为"好看+独特"多付 30%，但不要被收"颜值税"。',
        traits:{lifestyle:'互联网产品经理，颜值党',cert:'ENFP'} },
      { id:'p2', name:'陈家明', gender:'男', age:'38', occupation:'国企中层', income:'一线 35 万/年（家庭）', region:'广州天河',
        values:['真材实料','性价比','家庭聚餐'], painPoints:'餐厅食材不透明、孩子挑食、节假日排队久',
        channels:['大众点评','美团','微信群'], quote:'一家人吃饭，食材来源比我点哪个菜重要。',
        traits:{lifestyle:'家庭客，重食材溯源',cert:'ESTJ'} },
      { id:'p3', name:'周小溪', gender:'女', age:'27', occupation:'小红书探店博主', income:'广告+流量 20 万/年', region:'深圳/广州',
        values:['话题性','独特体验','可传播'], painPoints:'探店同质化、商家配合度低、缺独家菜品',
        channels:['小红书','抖音','微博'], quote:'给我一个"非来不可"的理由，我就能带火一家店。',
        traits:{lifestyle:'探店博主，传播导向',cert:'ENTP'} }
    ],
    scenarios: [
      { id:'sc1', name:'年轻白领下班聚会', personaIds:['p1'],
        benefits:{usage:'融合菜体验+颜值',service:'小程序预约+会员折扣',staff:'服务员引导点单',image:'懂生活的小姐姐'},
        costs:{monetary:'人均 150-200 元',time:'1.5-2 小时',energy:'选店纠结',psychic:'踩雷担心'},
        anchor:'出片 + 独特体验', decisiveGap:'环境颜值 + 融合菜稀缺——需在小红书/抖音放高清环境图与招牌融合菜' },
      { id:'sc2', name:'家庭周末聚餐', personaIds:['p2'],
        benefits:{usage:'15 道招牌+原产地食材',service:'家庭套餐+儿童椅',staff:'服务员介绍食材',image:'重视家庭的好爸爸'},
        costs:{monetary:'人均 80-150 元',time:'2-3 小时',energy:'选店对比',psychic:'孩子不爱吃'},
        anchor:'真材实料 + 老字号', decisiveGap:'食材溯源 + 师傅手艺——明厨亮灶+原产地食材展示' },
      { id:'sc3', name:'探店博主合作拍摄', personaIds:['p3'],
        benefits:{usage:'独家融合菜+老店故事',service:'专属拍摄位+主厨互动',staff:'老板/主厨配合',image:'独家内容产出'},
        costs:{monetary:'拍摄成本',time:'半天到一天',energy:'协调配合',psychic:'内容同质化'},
        anchor:'话题性 + 独家性', decisiveGap:'30 年老店+主厨手作——可让博主拍"师傅手作 30 年"系列' }
    ],
    metrics: {
      dimensions: [
        { id:'m1', name:'产品·菜品', secondaries:[
          { id:'s1', name:'菜品口味稳定性', measure:'老客复购率/差评比', forecast: 8, target: 9, actual: null },
          { id:'s2', name:'融合菜创新度', measure:'季度上新数/博主探店提及', forecast: 5, target: 8, actual: null },
          { id:'s3', name:'食材新鲜度', measure:'食材报废率/客户感知', forecast: 8, target: 9, actual: null }
        ]},
        { id:'m2', name:'品牌·认知', secondaries:[
          { id:'s4', name:'本地知名度', measure:'无提示提及率（广州%）', forecast: 7, target: 8, actual: null },
          { id:'s5', name:'差异化定位', measure:'能说出"30 年老店"的客户%', forecast: 8, target: 9, actual: null },
          { id:'s6', name:'出片传播力', measure:'小红书/抖音 UGC 篇数/月', forecast: 4, target: 8, actual: null }
        ]},
        { id:'m3', name:'品牌·判断', secondaries:[
          { id:'s7', name:'专业可信', measure:'粤菜专业度评分', forecast: 9, target: 9, actual: null },
          { id:'s8', name:'食材安心', measure:'食材溯源感知', forecast: 8, target: 9, actual: null },
          { id:'s9', name:'性价比', measure:'性价比评分', forecast: 7, target: 8, actual: null }
        ]},
        { id:'m4', name:'品牌·感受', secondaries:[
          { id:'s10', name:'环境颜值', measure:'环境设计评分', forecast: 6, target: 8, actual: null },
          { id:'s11', name:'品牌温度', measure:'品牌情感题均分', forecast: 7, target: 8, actual: null },
          { id:'s12', name:'信任感', measure:'信任题均分', forecast: 8, target: 9, actual: null }
        ]},
        { id:'m5', name:'复购·推荐', secondaries:[
          { id:'s13', name:'会员归属', measure:'小程序会员数', forecast: 5, target: 8, actual: null },
          { id:'s14', name:'复购意愿', measure:'年复购率', forecast: 7, target: 8, actual: null },
          { id:'s15', name:'推荐意愿', measure:'NPS', forecast: 7, target: 9, actual: null }
        ]}
      ],
      disclaimerAcknowledged: true
    },
    survey: {
      questions: [
        { id:'q1', type:'likert', text:'小镬记菜品口味稳定，不会出现"这次好吃下次踩雷"', anchors:['非常不同意','不同意','一般','同意','非常同意'], sourceIndicatorId:'s1' },
        { id:'q2', type:'likert', text:'小镬记的融合菜有创新，能给我"没见过"的体验', anchors:['非常不同意','不同意','一般','同意','非常同意'], sourceIndicatorId:'s2' },
        { id:'q3', type:'likert', text:'小镬记食材新鲜，原产地可溯源', anchors:['非常不同意','不同意','一般','同意','非常同意'], sourceIndicatorId:'s3' },
        { id:'q4', type:'likert', text:'在广州本地我常听到朋友推荐小镬记', anchors:['非常不同意','不同意','一般','同意','非常同意'], sourceIndicatorId:'s4' },
        { id:'q5', type:'likert', text:'小镬记在"30 年老店+融合创新"上有清晰差异化', anchors:['非常不同意','不同意','一般','同意','非常同意'], sourceIndicatorId:'s5' },
        { id:'q6', type:'likert', text:'我常在小红书/抖音看到小镬记的环境/菜品图', anchors:['非常不同意','不同意','一般','同意','非常同意'], sourceIndicatorId:'s6' },
        { id:'q7', type:'likert', text:'小镬记在粤菜专业度上让我信任', anchors:['非常不同意','不同意','一般','同意','非常同意'], sourceIndicatorId:'s7' },
        { id:'q8', type:'likert', text:'我信任小镬记的食材来源与安全', anchors:['非常不同意','不同意','一般','同意','非常同意'], sourceIndicatorId:'s8' },
        { id:'q9', type:'likert', text:'小镬记人均 80-200 元与价值匹配', anchors:['非常不同意','不同意','一般','同意','非常同意'], sourceIndicatorId:'s9' },
        { id:'q10', type:'likert', text:'小镬记环境设计有"出片感"', anchors:['非常不同意','不同意','一般','同意','非常同意'], sourceIndicatorId:'s10' },
        { id:'q11', type:'likert', text:'小镬记让我感到"老字号但不老气"', anchors:['非常不同意','不同意','一般','同意','非常同意'], sourceIndicatorId:'s11' },
        { id:'q12', type:'likert', text:'小镬记老店历史让我对菜品产生信任', anchors:['非常不同意','不同意','一般','同意','非常同意'], sourceIndicatorId:'s12' },
        { id:'q13', type:'likert', text:'我愿意加入小镬记小程序会员', anchors:['非常不同意','不同意','一般','同意','非常同意'], sourceIndicatorId:'s13' },
        { id:'q14', type:'likert', text:'我会在半年内多次回小镬记就餐', anchors:['非常不同意','不同意','一般','同意','非常同意'], sourceIndicatorId:'s14' },
        { id:'q15', type:'likert', text:'我愿意向朋友推荐小镬记', anchors:['非常不同意','不同意','一般','同意','非常同意'], sourceIndicatorId:'s15' },
        { id:'q16', type:'likert', text:'我愿意参与小镬记的探店/打卡活动', anchors:['非常不同意','不同意','一般','同意','非常同意'], sourceIndicatorId:'s16' }
      ],
      responses: [
        { personaId:'p1', answers:[
          {questionId:'q1', value:4, raw:'基本稳定'},
          {questionId:'q2', value:5, raw:'融合菜有惊喜'},
          {questionId:'q3', value:4, raw:'食材可以'},
          {questionId:'q4', value:4, raw:'朋友提过'},
          {questionId:'q5', value:5, raw:'差异化强'},
          {questionId:'q6', value:5, raw:'小红书很多'},
          {questionId:'q7', value:4, raw:'专业'},
          {questionId:'q8', value:4, raw:'信任'},
          {questionId:'q9', value:4, raw:'合理'},
          {questionId:'q10', value:5, raw:'出片'},
          {questionId:'q11', value:5, raw:'不老气'},
          {questionId:'q12', value:4, raw:'老店信任'},
          {questionId:'q13', value:5, raw:'愿入会'},
          {questionId:'q14', value:4, raw:'会回访'},
          {questionId:'q15', value:5, raw:'愿推荐'},
          {questionId:'q16', value:5, raw:'愿参与'} ]},
        { personaId:'p2', answers:[
          {questionId:'q1', value:5, raw:'稳定好吃'},
          {questionId:'q2', value:3, raw:'一般'},
          {questionId:'q3', value:5, raw:'新鲜'},
          {questionId:'q4', value:5, raw:'老客都知'},
          {questionId:'q5', value:4, raw:'基本差异化'},
          {questionId:'q6', value:3, raw:'见得少'},
          {questionId:'q7', value:5, raw:'专业'},
          {questionId:'q8', value:5, raw:'信任'},
          {questionId:'q9', value:5, raw:'性价比好'},
          {questionId:'q10', value:4, raw:'环境还行'},
          {questionId:'q11', value:4, raw:'还可以'},
          {questionId:'q12', value:5, raw:'老店背书'},
          {questionId:'q13', value:4, raw:'已加会员'},
          {questionId:'q14', value:5, raw:'多次回访'},
          {questionId:'q15', value:5, raw:'会推荐'},
          {questionId:'q16', value:3, raw:'偶尔参与'} ]},
        { personaId:'p3', answers:[
          {questionId:'q1', value:4, raw:'基本稳定'},
          {questionId:'q2', value:5, raw:'有创新'},
          {questionId:'q3', value:4, raw:'食材可'},
          {questionId:'q4', value:4, raw:'探店圈提过'},
          {questionId:'q5', value:5, raw:'差异化强'},
          {questionId:'q6', value:5, raw:'UGC 多'},
          {questionId:'q7', value:5, raw:'专业'},
          {questionId:'q8', value:4, raw:'信任'},
          {questionId:'q9', value:4, raw:'合理'},
          {questionId:'q10', value:5, raw:'出片感强'},
          {questionId:'q11', value:5, raw:'不老气'},
          {questionId:'q12', value:5, raw:'老店信任'},
          {questionId:'q13', value:5, raw:'愿入会'},
          {questionId:'q14', value:4, raw:'愿回访'},
          {questionId:'q15', value:5, raw:'愿推荐'},
          {questionId:'q16', value:5, raw:'愿合作'} ]}
      ],
      n: 3,
      status: 'done',
      mode: 'demo',
      useFewShot: true,
      useRag: false,
      ragContext: '',
      progress: { done: 9, total: 9 },
      error: null,
      _doneKeys: ['p1-0','p2-0','p3-0']
    },
    analysis: {
      likertStats: {
        q1: { mean: 4.33, sd: 0.47, dist:[0,0,0,2,1], n:3 },
        q2: { mean: 4.33, sd: 0.94, dist:[0,0,1,1,1], n:3 },
        q3: { mean: 4.33, sd: 0.47, dist:[0,0,0,2,1], n:3 },
        q4: { mean: 4.33, sd: 0.47, dist:[0,0,0,2,1], n:3 },
        q5: { mean: 4.67, sd: 0.47, dist:[0,0,0,1,2], n:3 },
        q6: { mean: 4.33, sd: 0.94, dist:[0,0,1,1,1], n:3 },
        q7: { mean: 4.67, sd: 0.47, dist:[0,0,0,1,2], n:3 },
        q8: { mean: 4.33, sd: 0.47, dist:[0,0,0,2,1], n:3 },
        q9: { mean: 4.33, sd: 0.47, dist:[0,0,0,2,1], n:3 },
        q10:{ mean: 4.67, sd: 0.47, dist:[0,0,0,1,2], n:3 },
        q11:{ mean: 4.67, sd: 0.47, dist:[0,0,0,1,2], n:3 },
        q12:{ mean: 4.67, sd: 0.47, dist:[0,0,0,1,2], n:3 },
        q13:{ mean: 4.67, sd: 0.47, dist:[0,0,0,1,2], n:3 },
        q14:{ mean: 4.33, sd: 0.47, dist:[0,0,0,2,1], n:3 },
        q15:{ mean: 5.0, sd: 0.0, dist:[0,0,0,0,3], n:3 },
        q16:{ mean: 4.33, sd: 0.94, dist:[0,0,1,1,1], n:3 }
      },
      openThemes: [
        { questionId:'open1', question:'你会在什么场景下选小镬记？', texts:['家庭聚会','朋友出片','探店合作'], themes:[{label:'家宴/聚会', count:2},{label:'出片/打卡', count:1}], quotes:['家庭聚餐','探店合作'] }
      ],
      indicatorMeans: [
        {label:'菜品口味稳定性', mean:4.33, value:4.33, sourceIndicatorId:'s1'},
        {label:'融合菜创新度', mean:4.33, value:4.33, sourceIndicatorId:'s2'},
        {label:'食材新鲜度', mean:4.33, value:4.33, sourceIndicatorId:'s3'},
        {label:'本地知名度', mean:4.33, value:4.33, sourceIndicatorId:'s4'},
        {label:'差异化定位', mean:4.67, value:4.67, sourceIndicatorId:'s5'},
        {label:'出片传播力', mean:4.33, value:4.33, sourceIndicatorId:'s6'},
        {label:'专业可信', mean:4.67, value:4.67, sourceIndicatorId:'s7'},
        {label:'食材安心', mean:4.33, value:4.33, sourceIndicatorId:'s8'},
        {label:'性价比', mean:4.33, value:4.33, sourceIndicatorId:'s9'},
        {label:'环境颜值', mean:4.67, value:4.67, sourceIndicatorId:'s10'},
        {label:'品牌温度', mean:4.67, value:4.67, sourceIndicatorId:'s11'},
        {label:'信任感', mean:4.67, value:4.67, sourceIndicatorId:'s12'},
        {label:'会员归属', mean:4.67, value:4.67, sourceIndicatorId:'s13'},
        {label:'复购意愿', mean:4.33, value:4.33, sourceIndicatorId:'s14'},
        {label:'推荐意愿', mean:5.0, value:5.0, sourceIndicatorId:'s15'}
      ],
      insights: '1. 菜品稳定性（Q1）与食材新鲜（Q3）是小镬记的强项，得分 4.0+，30 年老店信任背书有效。\n2. 融合菜创新（Q2）与出片传播（Q6）是核心短板，年轻客户群对小镬记"粤菜老店"形象认知强但"年轻化融合"心智弱。\n3. 性价比（Q9）分化明显，年轻白领愿为融合创新付溢价，家庭客更看人均与食材。\n4. 小程序会员（Q13）与博主打卡（Q16）是新增长点，抖音同城号/小红书种草是破圈关键。\n5. 老陈 30 年粤菜功底 + 主厨手作 + 原产地食材应作为核心传播资产，融合菜创新需小陈主导快速迭代。'
    },
    values: {
      functional: [
        { value:'菜品口味稳定', evidence:'Q1=4.33 / 复购 60%', priority:'P0' },
        { value:'食材原产地溯源', evidence:'Q3=4.33 / 明厨亮灶', priority:'P0' },
        { value:'融合菜季度上新', evidence:'Q2=4.33 / 内部策略', priority:'P1' }
      ],
      emotional: [
        { value:'老字号信任', evidence:'Q12=4.67 / 30 年老店', priority:'P0' },
        { value:'家宴安心', evidence:'Q11=4.67', priority:'P0' }
      ],
      social: [
        { value:'懂生活的精致食客', evidence:'Q10=4.67 / p1/p3 高分', priority:'P0' },
        { value:'出片博主打卡', evidence:'Q6=4.33 / 探店博主引流', priority:'P1' }
      ],
      epistemic: [
        { value:'明厨亮灶可视化', evidence:'Q7=4.67', priority:'P1' },
        { value:'食材溯源二维码', evidence:'Q3=4.33', priority:'P1' }
      ],
      conditional: [
        { value:'家庭聚餐', evidence:'Q4=4.33 / 节假日', priority:'P0' },
        { value:'探店打卡', evidence:'Q6=4.33 / 抖音同城', priority:'P0' }
      ],
      chosenFunctional: '30 年老店信任 + 融合菜创新',
      chosenEmotional: '老字号不老气',
      chosenSocial: '懂生活的精致食客',
      rationale: '以"30 年老店+融合创新"建立功能差异化，以"老字号不老气"建立情感连接，以"懂生活的精致食客"承担社交身份。'
    },
    recommendations: {
      short: '小程序上线会员系统+明厨亮灶直播；抖音同城号+小红书开账号，发布"老陈 30 年+主厨手作+融合菜"系列内容。',
      mid: '深圳/上海各开 1 家直营店，融合菜占比 30%；招 2 名探店博主运营+1 名会员运营，6 个月内抖音同城粉丝 5 万+。',
      long: '建立"小镬记·融合菜实验室"内容 IP，主厨手作+老店故事系列，从广州 2 家店升级为粤菜融合品类代表。',
      risks: ['新店选址失误','融合菜研发节奏跟不上','加盟扩张品控失控','明厨亮灶/食材溯源合规风险']
    }
  };

  if(typeof window!== 'undefined') window.__case_xiaohuo_ji_work1 = data;
})();
