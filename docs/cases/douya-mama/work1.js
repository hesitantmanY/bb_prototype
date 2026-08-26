/* ============================================================
 douya-mama / work1 — 业务价值体系 (T09 filled)
 字段值参考 docs/demo-data.js douya.work1 叙事基线，
 形状严格匹配 Work1.defaultData()。
 ============================================================ */
(function(){
  const data = {
    sbu: {
      name: '豆芽妈妈',
      category: '母婴洗护（婴幼儿洗浴+护肤+护臀）',
      stage: '成长期',
      scope: '国内',
      countries: ['中国'],
      summary: '杭州豆芽母婴用品有限公司，专注 0-3 岁婴幼儿洗护，淘宝 5 年老店，8 人团队，年营收 1200 万，复购率 38%。',
      threeQuestions: { customer: true, channel: true, brand: true },
      boundary: '客户：与 0-3 岁婴幼儿洗护场景用户区隔（不做 3+ 岁儿童、不做孕妇专用、不做婴幼玩具）；渠道：淘宝/天猫母婴为主，不依赖线下母婴店；品牌：豆芽妈妈为独立品牌，不与母公司其他品类共用 logo；损益：豆芽独立核算，复用母公司 OEM 供应链与质检体系。'
    },
    environment: {
      political: '婴幼儿化妆品监管持续收紧，《儿童化妆品监督管理条例》要求配方安全备案、原料白名单；小红书/抖音违规宣传查处力度加大。',
      economic: '出生率持续下降（2023 年新生儿 902 万，同比降 5.6%），但客单价上升、精致育儿消费升级；母婴整体市场 2023 年约 4 万亿，洗护细分约 600 亿。',
      social: '90/95 后妈妈成为主力（占比 60%+），成分党、敏感肌关注度提升；小红书/抖音种草驱动决策；男性参与育儿比例上升。',
      technological: 'AI 客服、私域 SCRM、内容种草工具成熟；抖音电商 GMV 持续增长（2023 年母婴品类增长 35%+）；直播带货成为新流量入口。',
      industry: '头部品牌贝亲（外资）、红色小象（上美）、松达、戴可思；国货新锐崛起；价格带分高端（贝亲 100+）、中端（红色小象 80-150）、性价比（袋鼠妈妈 50-100）。',
      basics: {
        scale: { actual: '8 人团队（运营 3/设计 1/客服 2/仓储 1/老板 1），年营收 1200 万', target: '15 人团队，年营收 2500 万', source: '内部台账' },
        scope: { actual: '婴幼儿洗浴+护肤+护臀，不做玩具/辅食/孕妇', target: '增加婴幼儿防晒、亲子共护线', source: '战略规划' },
        products: { actual: '洗发沐浴二合一、护臀膏、洗面奶、爽身粉', target: '+ 婴幼儿防晒、亲子共护', source: '产品路线图' },
        customers: { actual: '淘宝 5 年老客为主，复购率 38%', target: '新增抖音精致妈妈客户群', source: '用户调研' },
        supply: { actual: 'OEM 代工 3 家（华东），配方稳定', target: '保留 1 家 + 新增 1 家华南 OEM', source: '供应链' },
        performance: {
          share: { actual: '淘宝母婴洗护细分 0.5%', target: '1.2%（抖音新客+老客复购）', source: '目标推导' },
          roi: { actual: '1.4', target: '1.6', source: '财务模型' },
          growth: { actual: '年增 15%', target: '年增 30%（抖音带动）', source: '行业基准 + 抖音红利' }
        }
      },
      competitors: [
        { id:'c1', name:'贝亲 Pigeon', price:'100-250 元/件', strengths:'外资品牌、渠道渗透深、医生背书', weaknesses:'国货情怀弱、价格高、年轻化不足', position:'在"国货成分党"上错位' },
        { id:'c2', name:'红色小象（上美）', price:'80-150 元/件', strengths:'国货老牌、综艺植入、全渠道', weaknesses:'成分透明度待提升、年轻化中', position:'以"成分透明 + 配方溯源"差异化' },
        { id:'c3', name:'松达', price:'60-120 元/件', strengths:'山茶油成分口碑好、复购高', weaknesses:'品牌年轻化弱、抖音布局慢', position:'以"山茶油溯源 + 抖音内容种草"追赶' },
        { id:'c4', name:'戴可思', price:'70-140 元/件', strengths:'新锐国货、金盏花成分、年轻妈妈喜爱', weaknesses:'品牌历史短、价格带偏中端', position:'以"5 年老店信任背书"差异化' },
        { id:'c5', name:'袋鼠妈妈', price:'50-100 元/件', strengths:'性价比、孕妇线起家、渠道广', weaknesses:'婴幼儿专业感弱、敏感肌口碑一般', position:'不直接竞争（不同场景）' }
      ],
      ourCapabilities: {
        delivery: 'OEM 3 家代工稳定，但小批量灵活度待提升',
        core: '5 年复购率 38%，老客口碑沉淀',
        brand: '淘宝老客忠诚度高，但抖音/小红书品牌力弱',
        customer: '私域老客群 5 万+',
        compliance: '婴幼儿化妆品备案齐备',
        defensive: '5 年淘宝复购数据 + 配方安全口碑',
        critical: '抖音运营为零，错过新流量红利',
        structural: '团队结构偏淘系运营，缺抖音/内容人才',
        smileCurve: '优势在客户/品牌（复购+口碑），劣势在渠道/营销（缺抖音）——定位为"老客信任驱动 + 抖音新客获取"双轮',
        _vcSig: '',
        trends: '成分党、敏感肌、国货新锐、抖音种草、精致育儿'
      }
    },
    personas: [
      { id:'p1', name:'林小满', gender:'女', age:'28', occupation:'互联网产品经理', income:'一线 30 万/年', region:'北京',
        values:['成分透明','敏感肌友好','颜值设计'], painPoints:'宝宝红 PP 反复、担心成分刺激、不知道选哪个',
        channels:['小红书','抖音','淘宝'], quote:'我愿意为成分透明付钱，但不要被收"成分焦虑税"。',
        traits:{lifestyle:'互联网产品经理，成分党',cert:'INTJ'} },
      { id:'p2', name:'周晓燕', gender:'女', age:'34', occupation:'全职妈妈', income:'二线 15 万/年（家庭）', region:'成都',
        values:['性价比','安全','复购习惯'], painPoints:'价格敏感、囤货焦虑、孩子皮肤换季问题',
        channels:['淘宝','微信群','拼多多'], quote:'我买豆芽 5 年了，换品牌太麻烦。',
        traits:{lifestyle:'二线全职妈妈，老客复购型',cert:'ISFJ'} },
      { id:'p3', name:'苏雅', gender:'女', age:'32', occupation:'中学教师', income:'二线 12 万/年', region:'武汉',
        values:['医生推荐','成分研究','品牌历史'], painPoints:'信任门槛高、被网红种草怕踩雷、需要医生背书',
        channels:['小红书','知乎','微博'], quote:'我要看到成分表和检测报告才敢买。',
        traits:{lifestyle:'研究型妈妈，重口碑',cert:'ISTJ'} }
    ],
    scenarios: [
      { id:'sc1', name:'日常洗护囤货', personaIds:['p2'],
        benefits:{usage:'二合一洗发沐浴方便',service:'老客 9 折+免邮',staff:'客服响应快',image:'精打细算的好妈妈'},
        costs:{monetary:'单件 88-128 元',time:'无需挑选',energy:'无',psychic:'成分是否安全'},
        anchor:'省心 + 老客信任', decisiveGap:'成分透明——需在页面突出配方表和检测报告' },
      { id:'sc2', name:'敏感肌/红 PP 应急', personaIds:['p1','p3'],
        benefits:{usage:'护臀膏+成分透明',service:'在线皮肤咨询',staff:'客服专业',image:'研究型妈妈'},
        costs:{monetary:'单件 128-188 元',time:'需研究',energy:'信息过载',psychic:'选错延误宝宝皮肤'},
        anchor:'成分透明 + 医生背书', decisiveGap:'信任——成分表清晰 + 三甲医院儿科推荐' },
      { id:'sc3', name:'新手妈妈待产包', personaIds:['p1'],
        benefits:{usage:'全套洗护+礼盒',service:'待产包组合价',staff:'客服送试用装',image:'有准备的精致妈妈'},
        costs:{monetary:'全套 500-800 元',time:'需研究',energy:'信息过载',psychic:'买错浪费'},
        anchor:'一站式 + 颜值', decisiveGap:'信任——新手妈妈要看到其他妈妈推荐 + 品牌历史' }
    ],
    metrics: {
      dimensions: [
        { id:'m1', name:'产品功效·安全', secondaries:[
          { id:'s1', name:'成分安全与配方透明', measure:'检测报告展示完整度 / 配方白名单', forecast: 7, target: 9, actual: null },
          { id:'s2', name:'宝宝使用效果', measure:'红 PP 缓解率 / 客户复购', forecast: 7, target: 9, actual: null },
          { id:'s3', name:'配送与售后服务', measure:'次日达率 / 客服响应时间', forecast: 6, target: 8, actual: null }
        ]},
        { id:'m2', name:'品牌形象·认知', secondaries:[
          { id:'s4', name:'品牌知名度', measure:'无提示提及率（妈妈群体%）', forecast: 4, target: 7, actual: null },
          { id:'s5', name:'差异化定位', measure:'能说出差异化的妈妈%', forecast: 5, target: 8, actual: null },
          { id:'s6', name:'口碑传播', measure:'正面 UGC 篇数/月', forecast: 6, target: 8, actual: null }
        ]},
        { id:'m3', name:'品牌形象·判断', secondaries:[
          { id:'s7', name:'专业可信', measure:'专业度评分', forecast: 7, target: 9, actual: null },
          { id:'s8', name:'配方安心', measure:'成分安心题均分', forecast: 8, target: 9, actual: null },
          { id:'s9', name:'性价比', measure:'性价比评分', forecast: 6, target: 8, actual: null }
        ]},
        { id:'m4', name:'品牌形象·感受', secondaries:[
          { id:'s10', name:'设计颜值', measure:'包装设计评分', forecast: 7, target: 8, actual: null },
          { id:'s11', name:'品牌温度', measure:'品牌情感题均分', forecast: 7, target: 8, actual: null },
          { id:'s12', name:'信任感', measure:'信任题均分', forecast: 8, target: 9, actual: null }
        ]},
        { id:'m5', name:'品牌共鸣·复购', secondaries:[
          { id:'s13', name:'社群归属', measure:'私域社群活跃度', forecast: 7, target: 8, actual: null },
          { id:'s14', name:'复购意愿', measure:'年复购率', forecast: 7, target: 8, actual: null },
          { id:'s15', name:'推荐意愿', measure:'NPS', forecast: 6, target: 8, actual: null }
        ]}
      ],
      disclaimerAcknowledged: true
    },
    survey: {
      questions: [
        { id:'q1', type:'likert', text:'该品牌产品成分表清晰透明，可放心使用', anchors:['非常不同意','不同意','一般','同意','非常同意'], sourceIndicatorId:'s1' },
        { id:'q2', type:'likert', text:'该品牌能有效缓解宝宝皮肤问题（红 PP、湿疹）', anchors:['非常不同意','不同意','一般','同意','非常同意'], sourceIndicatorId:'s2' },
        { id:'q3', type:'likert', text:'该品牌配送及时、客服响应专业', anchors:['非常不同意','不同意','一般','同意','非常同意'], sourceIndicatorId:'s3' },
        { id:'q4', type:'likert', text:'在妈妈群体中我常听到这个品牌', anchors:['非常不同意','不同意','一般','同意','非常同意'], sourceIndicatorId:'s4' },
        { id:'q5', type:'likert', text:'该品牌在成分透明、配方安心上有差异化优势', anchors:['非常不同意','不同意','一般','同意','非常同意'], sourceIndicatorId:'s5' },
        { id:'q6', type:'likert', text:'我常在小红书/抖音看到该品牌的正面口碑', anchors:['非常不同意','不同意','一般','同意','非常同意'], sourceIndicatorId:'s6' },
        { id:'q7', type:'likert', text:'该品牌在婴幼儿洗护上展现专业度', anchors:['非常不同意','不同意','一般','同意','非常同意'], sourceIndicatorId:'s7' },
        { id:'q8', type:'likert', text:'我信任该品牌的产品安全性', anchors:['非常不同意','不同意','一般','同意','非常同意'], sourceIndicatorId:'s8' },
        { id:'q9', type:'likert', text:'该品牌价格与价值匹配，性价比合理', anchors:['非常不同意','不同意','一般','同意','非常同意'], sourceIndicatorId:'s9' },
        { id:'q10', type:'likert', text:'该品牌包装设计美观，符合妈妈审美', anchors:['非常不同意','不同意','一般','同意','非常同意'], sourceIndicatorId:'s10' },
        { id:'q11', type:'likert', text:'该品牌让我感到温暖、被理解', anchors:['非常不同意','不同意','一般','同意','非常同意'], sourceIndicatorId:'s11' },
        { id:'q12', type:'likert', text:'该品牌让我对产品成分产生信任', anchors:['非常不同意','不同意','一般','同意','非常同意'], sourceIndicatorId:'s12' },
        { id:'q13', type:'likert', text:'我愿意加入该品牌的妈妈社群', anchors:['非常不同意','不同意','一般','同意','非常同意'], sourceIndicatorId:'s13' },
        { id:'q14', type:'likert', text:'我会持续复购该品牌产品', anchors:['非常不同意','不同意','一般','同意','非常同意'], sourceIndicatorId:'s14' },
        { id:'q15', type:'likert', text:'我愿意向新手妈妈推荐该品牌', anchors:['非常不同意','不同意','一般','同意','非常同意'], sourceIndicatorId:'s15' },
        { id:'q16', type:'likert', text:'我愿意参与该品牌的内容活动', anchors:['非常不同意','不同意','一般','同意','非常同意'], sourceIndicatorId:'s16' }
      ],
      responses: [
        { personaId:'p1', answers:[
          {questionId:'q1', value:5, raw:'截图发过群'},
          {questionId:'q2', value:4, raw:'护臀膏好'},
          {questionId:'q3', value:5, raw:'响应快'},
          {questionId:'q4', value:4, raw:'圈内有人提'},
          {questionId:'q5', value:5, raw:'差异化强'},
          {questionId:'q6', value:4, raw:'小红书看到'},
          {questionId:'q7', value:5, raw:'专业'},
          {questionId:'q8', value:5, raw:'信任'},
          {questionId:'q9', value:4, raw:'合理'},
          {questionId:'q10', value:5, raw:'设计美'},
          {questionId:'q11', value:4, raw:'温暖'},
          {questionId:'q12', value:5, raw:'成分信任'},
          {questionId:'q13', value:4, raw:'愿加入社群'},
          {questionId:'q14', value:5, raw:'会复购'},
          {questionId:'q15', value:5, raw:'愿推荐'},
          {questionId:'q16', value:4, raw:'愿参与活动'} ]},
        { personaId:'p2', answers:[
          {questionId:'q1', value:4, raw:'老客放心'},
          {questionId:'q2', value:4, raw:'基本有效'},
          {questionId:'q3', value:5, raw:'老客免邮'},
          {questionId:'q4', value:3, raw:'老客知道'},
          {questionId:'q5', value:4, raw:'配方安心'},
          {questionId:'q6', value:3, raw:'抖音少'},
          {questionId:'q7', value:4, raw:'一般专业'},
          {questionId:'q8', value:5, raw:'信任'},
          {questionId:'q9', value:5, raw:'性价比好'},
          {questionId:'q10', value:4, raw:'一般'},
          {questionId:'q11', value:4, raw:'还行'},
          {questionId:'q12', value:4, raw:'信任'},
          {questionId:'q13', value:4, raw:'已加群'},
          {questionId:'q14', value:5, raw:'持续复购'},
          {questionId:'q15', value:4, raw:'会推荐'},
          {questionId:'q16', value:3, raw:'偶尔参与'} ]},
        { personaId:'p3', answers:[
          {questionId:'q1', value:5, raw:'看成分表'},
          {questionId:'q2', value:4, raw:'效果可'},
          {questionId:'q3', value:4, raw:'响应一般'},
          {questionId:'q4', value:3, raw:'不知名'},
          {questionId:'q5', value:5, raw:'差异化强'},
          {questionId:'q6', value:4, raw:'有口碑'},
          {questionId:'q7', value:5, raw:'专业'},
          {questionId:'q8', value:5, raw:'医生推荐'},
          {questionId:'q9', value:3, raw:'略贵'},
          {questionId:'q10', value:4, raw:'设计合理'},
          {questionId:'q11', value:4, raw:'中等'},
          {questionId:'q12', value:5, raw:'成分信任'},
          {questionId:'q13', value:3, raw:'观望'},
          {questionId:'q14', value:4, raw:'看情况'},
          {questionId:'q15', value:4, raw:'会推荐'},
          {questionId:'q16', value:3, raw:'不积极'} ]}
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
        q1: { mean: 4.67, sd: 0.47, dist:[0,0,0,1,2], n:3 },
        q2: { mean: 4.0, sd: 0.0, dist:[0,0,0,3,0], n:3 },
        q3: { mean: 4.67, sd: 0.47, dist:[0,0,0,1,2], n:3 },
        q4: { mean: 3.33, sd: 0.47, dist:[0,0,2,1,0], n:3 },
        q5: { mean: 4.67, sd: 0.47, dist:[0,0,0,1,2], n:3 },
        q6: { mean: 3.67, sd: 0.47, dist:[0,0,1,2,0], n:3 },
        q7: { mean: 4.67, sd: 0.47, dist:[0,0,0,1,2], n:3 },
        q8: { mean: 5.0, sd: 0.0, dist:[0,0,0,0,3], n:3 },
        q9: { mean: 4.0, sd: 0.82, dist:[0,0,1,1,1], n:3 },
        q10:{ mean: 4.33, sd: 0.47, dist:[0,0,0,2,1], n:3 },
        q11:{ mean: 4.0, sd: 0.0, dist:[0,0,0,3,0], n:3 },
        q12:{ mean: 4.67, sd: 0.47, dist:[0,0,0,1,2], n:3 },
        q13:{ mean: 3.67, sd: 0.47, dist:[0,0,1,2,0], n:3 },
        q14:{ mean: 4.67, sd: 0.47, dist:[0,0,0,1,2], n:3 },
        q15:{ mean: 4.33, sd: 0.47, dist:[0,0,0,2,1], n:3 },
        q16:{ mean: 3.33, sd: 0.47, dist:[0,0,2,1,0], n:3 }
      },
      openThemes: [
        { questionId:'open1', question:'你在哪些场景下愿意为成分透明付溢价？', texts:['红 PP 应急','新手待产包','敏感肌护理'], themes:[{label:'应急/敏感场景', count:2},{label:'决策门槛', count:1}], quotes:['红 PP 应急','新手待产包'] }
      ],
      indicatorMeans: [
        {label:'成分安全与配方透明', mean:4.67, value:4.67, sourceIndicatorId:'s1'},
        {label:'宝宝使用效果', mean:4.0, value:4.0, sourceIndicatorId:'s2'},
        {label:'配送与售后服务', mean:4.67, value:4.67, sourceIndicatorId:'s3'},
        {label:'品牌知名度', mean:3.33, value:3.33, sourceIndicatorId:'s4'},
        {label:'差异化定位', mean:4.67, value:4.67, sourceIndicatorId:'s5'},
        {label:'口碑传播', mean:3.67, value:3.67, sourceIndicatorId:'s6'},
        {label:'专业可信', mean:4.67, value:4.67, sourceIndicatorId:'s7'},
        {label:'配方安心', mean:5.0, value:5.0, sourceIndicatorId:'s8'},
        {label:'性价比', mean:4.0, value:4.0, sourceIndicatorId:'s9'},
        {label:'设计颜值', mean:4.33, value:4.33, sourceIndicatorId:'s10'},
        {label:'品牌温度', mean:4.0, value:4.0, sourceIndicatorId:'s11'},
        {label:'信任感', mean:4.67, value:4.67, sourceIndicatorId:'s12'},
        {label:'社群归属', mean:3.67, value:3.67, sourceIndicatorId:'s13'},
        {label:'复购意愿', mean:4.67, value:4.67, sourceIndicatorId:'s14'},
        {label:'推荐意愿', mean:4.33, value:4.33, sourceIndicatorId:'s15'}
      ],
      insights: '1. 配方安全（Q1）与配方安心（Q8）是豆芽妈妈的强项，得分 4.0+。\n2. 品牌知名度（Q4）是核心短板，年轻客户群对豆芽妈妈认知有限。\n3. 价格敏感（Q6）在下沉客户群中突出，但客户愿为"成分透明"付溢价。\n4. 老客复购（Q14）与推荐（Q15）分化明显，5 年老客忠诚度高但新客难触达。\n5. 抖音内容种草是品牌升级的关键渠道，应通过"成分透明 + 真实使用"建立信任。'
    },
    values: {
      functional: [
        { value:'成分表清晰透明', evidence:'Q1=4.67 / Q8=5.0', priority:'P0' },
        { value:'配方安心背书', evidence:'Q8=5.0 三人均 5 分', priority:'P0' },
        { value:'配方白名单', evidence:'婴幼儿化妆品备案齐备', priority:'P1' }
      ],
      emotional: [
        { value:'妈妈安心', evidence:'Q11=4.0 + 老客复购 38%', priority:'P0' },
        { value:'放心选购', evidence:'Q12=4.67', priority:'P0' }
      ],
      social: [
        { value:'研究型妈妈身份', evidence:'Q5=4.67 + 成分党定位', priority:'P0' },
        { value:'同圈层精致育儿', evidence:'一线精致妈妈客群', priority:'P1' }
      ],
      epistemic: [
        { value:'检测报告可读', evidence:'内部策略 "成分实验室"', priority:'P1' },
        { value:'医生背书解读', evidence:'三甲儿科医生合作', priority:'P1' }
      ],
      conditional: [
        { value:'新手妈妈决策', evidence:'待产包场景', priority:'P0' },
        { value:'敏感肌宝宝', evidence:'红 PP 应急场景', priority:'P0' }
      ],
      chosenFunctional: '成分透明与配方安心',
      chosenEmotional: '妈妈安心',
      chosenSocial: '研究型妈妈的精致育儿',
      rationale: '以"成分透明"建立功能可信度，以"妈妈安心"建立情感连接，以"研究型妈妈精致育儿"承担社交身份表达。'
    },
    recommendations: {
      short: '页面突出成分表和检测报告；小红书+抖音同步开账号，"成分透明"系列短视频。',
      mid: '抖音渠道精细化运营（KOC 种草+直播带货），目标 6 个月内抖音 GMV 占总营收 25%。',
      long: '建立"豆芽成分实验室"内容 IP，儿科医生背书，形成"国货母婴成分派"品类心智。',
      risks: ['抖音运营人才招聘难','老客被抖音价格战挤走','新生儿数量持续下降']
    }
  };

  if(typeof window!== 'undefined') window.__case_douya_mama_work1 = data;
})();
