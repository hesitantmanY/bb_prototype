/* ============================================================
 maohaizi-house / work1 — 业务价值体系 (T09 filled)
 字段值参考 docs/demo-data.js maohaizi.work1 叙事基线，
 形状严格匹配 Work1.defaultData()。
 ============================================================ */
(function(){
  const data = {
    sbu: {
      name: '毛孩子之家',
      category: '本地生活 / 宠物服务（洗护+寄养+宠物摄影）',
      stage: '成长期',
      scope: '国内',
      countries: ['中国'],
      summary: '成都+重庆 2 家直营宠物洗护+寄养门店，客单价 80-300 元，复购率 45%，单店月营收 8-12 万，老板想从 2 家开成 5 家区域品牌。',
      threeQuestions: { customer: true, channel: false, brand: true },
      boundary: '客户：聚焦 90/95 后新手铲屎官+二线家庭客+出差/旅行寄养客，不做活体交易/宠物医疗；渠道：美团+大众点评+小红书+抖音同城+私域社群，不依赖单一渠道；品牌：毛孩子之家为独立宠物服务品牌，不与个人 IP 混用；损益：2 店独立核算，复用洗护师团队与供应链。'
    },
    environment: {
      political: '宠物服务行业监管持续完善，《动物防疫法》要求寄养资质；成都/重庆对宠物店卫生/防疫要求提高；宠物经济受政策鼓励。',
      economic: '2023 年中国宠物经济 2793 亿（年增 3.2%），宠物服务约 300 亿；川渝宠物数量全国前 5。',
      social: '90/95 后成为养宠主力（占比 60%+），"科学养宠"理念普及；宠物拟人化（家人化）趋势；出差/旅行寄养刚需增长。',
      technological: '美团/大众点评宠物服务频道成熟；小红书/抖音同城种草高效；宠物洗护师认证体系（CKU/NGKC）普及；门店 SaaS 普及。',
      industry: '头部：新瑞鹏宠物医院（医疗为主）、萌爪医生（线上医疗）、小佩宠物（智能用品）、宠物家 PetsHome（连锁洗护）；区域品牌：圣宠、宠宠熊、爱诺宠物。',
      valueChain: [
        {label:'服务标准/培训', v:8.0, reason:'洗护师CKU认证+无应激标准'},
        {label:'耗材/选品采购', v:5.0, reason:'洗护用品/食品/玩具选品'},
        {label:'门店服务/洗护', v:8.5, reason:'现场洗护+寄养 — 核心体验'},
        {label:'渠道/美团抖音', v:5.0, reason:'美团/大众点评/抖音同城'},
        {label:'品牌/口碑/会员', v:9.0, reason:'出片+联名 — 最高附加值'},
        {label:'客户回访/复购', v:5.5, reason:'CRM/会员次卡/异业联盟'},
      ],
      basics: {
        scale: { actual: '2 家直营，年营收约 240 万', target: '5 家直营+1 加盟，年营收 800 万', source: '内部台账' },
        scope: { actual: '洗护+寄养 2 个 SKU', target: '+ 宠物摄影+会员次卡+宠物用品零售', source: '战略规划' },
        products: { actual: '洗护 80-200/寄养 100-250', target: '+ 摄影 300-800/月卡 980', source: '产品路线图' },
        customers: { actual: '90/95 后+家庭客，复购 45%', target: '+ 出差/旅行寄养客，复购 55%', source: '用户调研' },
        supply: { actual: '3 位洗护师+2 位寄养师', target: '+ 5 位洗护师+3 位寄养师+合作摄影', source: '供应链' },
        performance: {
          share: { actual: '成都宠物洗护细分 0.5%', target: '1.5%（5 家店贡献）', source: '目标推导' },
          roi: { actual: '1.3', target: '1.6', source: '财务模型' },
          growth: { actual: '年增 15%', target: '年增 30%（连锁带动）', source: '行业基准' }
        }
      },
      competitors: [
        { id:'c1', name:'新瑞鹏宠物医院（医疗）', price:'洗护 100-300/寄养 150-300', strengths:'医疗+服务一体化、品牌强', weaknesses:'重医疗、轻洗护、价格偏高', position:'以"专业洗护+性价比"差异化' },
        { id:'c2', name:'宠物家 PetsHome（连锁洗护）', price:'洗护 80-200/寄养 120-250', strengths:'连锁化、SaaS 化、标准统一', weaknesses:'本地化弱、情感温度低', position:'以"本地化+情感温度"对抗' },
        { id:'c3', name:'圣宠（区域品牌）', price:'洗护 60-150/寄养 80-200', strengths:'川渝区域品牌、价格亲民', weaknesses:'品牌力弱、服务标准不一', position:'以"洗护师认证+无应激环境"切入' },
        { id:'c4', name:'宠宠熊（社区店）', price:'洗护 50-150/寄养 100-200', strengths:'社区店密度高、便利', weaknesses:'专业度弱、卫生标准不一', position:'以"专业洗护+无应激"差异化' },
        { id:'c5', name:'爱诺宠物（摄影+洗护）', price:'摄影 500-1500/洗护 100-250', strengths:'宠物摄影特色、客单价高', weaknesses:'频次低、依赖摄影', position:'以"洗护为入口+摄影做粘性"组合' }
      ],
      ourCapabilities: {
        delivery: '2 家直营+洗护师认证+无应激低噪环境+实时寄养直播',
        core: '2 年品牌沉淀+复购 45%+川渝本地口碑',
        brand: '本地口碑强，跨城品牌力弱',
        customer: '2 家店私域社群 3000+铲屎官',
        compliance: '动物防疫合格证+洗护师 CKU/NGKC 认证+卫生许可',
        defensive: '复购 45%+本地口碑+实时寄养直播',
        critical: '复制到 5 家店资金有限+人才复制难度大',
        structural: '门店运营强，但缺连锁化人才（店长/营销/加盟）',
        smileCurve: '优势在客户（私域社群）+ 核心（洗护师认证），劣势在品牌（跨城弱）+ 交付（缺摄影）——定位为"专业洗护+实时直播+会员次卡"三轮',
        _vcSig: '',
        trends: '科学养宠、宠物拟人化、寄养刚需、宠物摄影、无应激'
      }
    },
    personas: [
      { id:'p1', name:'小敏', gender:'女', age:'26', occupation:'互联网运营', income:'成都 18 万/年', region:'成都高新区',
        values:['专业温柔','颜值设计','科学养宠'], painPoints:'猫应激反应、宠物店卫生差、洗护师不专业',
        channels:['小红书','抖音同城','大众点评'], quote:'我宁愿多付 30%，也要让猫主子不害怕。',
        traits:{lifestyle:'互联网运营，养猫',cert:'INFP'} },
      { id:'p2', name:'赵姐', gender:'女', age:'35', occupation:'全职妈妈', income:'成都 20 万/年（家庭）', region:'成都锦江',
        values:['放心','性价比','卫生安全'], painPoints:'寄养不放心、价格不透明、宠物店套路多',
        channels:['美团','大众点评','微信群'], quote:'寄养最怕"摄像头是摆设"，我要的是真直播。',
        traits:{lifestyle:'全职妈妈，重家庭',cert:'ISFJ'} },
      { id:'p3', name:'Andy', gender:'男', age:'30', occupation:'外企销售', income:'成都 25 万/年', region:'成都武侯',
        values:['安全感','便利性','专业'], painPoints:'出差寄养、宠物应激、找不到靠谱店',
        channels:['美团','大众点评','小红书'], quote:'我出差最怕"摄像头关了一天没人告诉我"。',
        traits:{lifestyle:'外企销售，出差多',cert:'ENTJ'} }
    ],
    scenarios: [
      { id:'sc1', name:'猫主子洗护', personaIds:['p1'],
        benefits:{usage:'无应激低噪+专业洗护',service:'洗护师认证+独立单宠用具',staff:'温柔专业',image:'科学养宠的小姐姐'},
        costs:{monetary:'洗护 150-250 元',time:'1.5-2 小时',energy:'选店对比',psychic:'猫应激'},
        anchor:'专业 + 温柔', decisiveGap:'无应激环境——独立单宠用具+低噪环境+洗护师认证' },
      { id:'sc2', name:'家庭长期寄养', personaIds:['p2'],
        benefits:{usage:'实时直播+卫生安全',service:'摄像头+每日反馈',staff:'寄养师负责',image:'负责的铲屎官'},
        costs:{monetary:'寄养 100-250 元/天',time:'出行/旅行 1-7 天',energy:'选店对比',psychic:'寄养不放心'},
        anchor:'放心 + 透明', decisiveGap:'实时直播——摄像头直播+每日视频反馈' },
      { id:'sc3', name:'出差短期寄养', personaIds:['p3'],
        benefits:{usage:'24h 直播+专业护理',service:'接送+健康检查',staff:'寄养师专业',image:'上进的铲屎官'},
        costs:{monetary:'寄养 150-250 元/天',time:'出差 2-5 天',energy:'找店',psychic:'出差焦虑'},
        anchor:'便利 + 安全', decisiveGap:'接送服务+24h 直播——24h 直播+接送一站式' }
    ],
    metrics: {
      dimensions: [
        { id:'m1', name:'服务·专业', secondaries:[
          { id:'s1', name:'洗护师专业度', measure:'CKU/NGKC 认证占比', selfScore: 8, actual: null },
          { id:'s2', name:'无应激环境', measure:'客户感知评分', selfScore: 7, actual: null },
          { id:'s3', name:'卫生安全', measure:'店内卫生评分/防疫合规', selfScore: 8, actual: null }
        ]},
        { id:'m2', name:'品牌·认知', secondaries:[
          { id:'s4', name:'本地知名度', measure:'无提示提及率（成都%）', selfScore: 6, actual: null },
          { id:'s5', name:'差异化定位', measure:'能说出"实时直播"的客户%', selfScore: 7, actual: null },
          { id:'s6', name:'口碑传播', measure:'小红书/抖音 UGC 篇数/月', selfScore: 5, actual: null }
        ]},
        { id:'m3', name:'品牌·判断', secondaries:[
          { id:'s7', name:'专业可信', measure:'专业度评分', selfScore: 7, actual: null },
          { id:'s8', name:'寄养安心', measure:'实时直播感知', selfScore: 8, actual: null },
          { id:'s9', name:'性价比', measure:'性价比评分', selfScore: 6, actual: null }
        ]},
        { id:'m4', name:'品牌·感受', secondaries:[
          { id:'s10', name:'环境颜值', measure:'门店设计评分', selfScore: 7, actual: null },
          { id:'s11', name:'品牌温度', measure:'品牌情感题均分', selfScore: 8, actual: null },
          { id:'s12', name:'信任感', measure:'信任题均分', selfScore: 8, actual: null }
        ]},
        { id:'m5', name:'复购·推荐', secondaries:[
          { id:'s13', name:'会员归属', measure:'月卡会员数', selfScore: 4, actual: null },
          { id:'s14', name:'复购意愿', measure:'年复购率', selfScore: 7, actual: null },
          { id:'s15', name:'推荐意愿', measure:'NPS', selfScore: 7, actual: null }
        ]}
      ],
      disclaimerAcknowledged: true
    },
    survey: {
      questions: [
        { id:'q1', type:'likert', text:'毛孩子之家洗护师专业（CKU/NGKC 认证）', anchors:['非常不同意','不同意','一般','同意','非常同意'], sourceIndicatorId:'s1' },
        { id:'q2', type:'likert', text:'毛孩子之家无应激低噪环境，宠物不害怕', anchors:['非常不同意','不同意','一般','同意','非常同意'], sourceIndicatorId:'s2' },
        { id:'q3', type:'likert', text:'毛孩子之家店内卫生与防疫合规', anchors:['非常不同意','不同意','一般','同意','非常同意'], sourceIndicatorId:'s3' },
        { id:'q4', type:'likert', text:'在成都/重庆本地我常听到毛孩子之家', anchors:['非常不同意','不同意','一般','同意','非常同意'], sourceIndicatorId:'s4' },
        { id:'q5', type:'likert', text:'毛孩子之家在"实时寄养直播"上有差异化', anchors:['非常不同意','不同意','一般','同意','非常同意'], sourceIndicatorId:'s5' },
        { id:'q6', type:'likert', text:'我常在小红书/抖音看到毛孩子之家的正面口碑', anchors:['非常不同意','不同意','一般','同意','非常同意'], sourceIndicatorId:'s6' },
        { id:'q7', type:'likert', text:'毛孩子之家在宠物服务上展现专业度', anchors:['非常不同意','不同意','一般','同意','非常同意'], sourceIndicatorId:'s7' },
        { id:'q8', type:'likert', text:'我信任毛孩子之家的寄养实时直播服务', anchors:['非常不同意','不同意','一般','同意','非常同意'], sourceIndicatorId:'s8' },
        { id:'q9', type:'likert', text:'毛孩子之家价格与价值匹配', anchors:['非常不同意','不同意','一般','同意','非常同意'], sourceIndicatorId:'s9' },
        { id:'q10', type:'likert', text:'毛孩子之家门店环境有"出片感"', anchors:['非常不同意','不同意','一般','同意','非常同意'], sourceIndicatorId:'s10' },
        { id:'q11', type:'likert', text:'毛孩子之家让我感到"专业但有温度"', anchors:['非常不同意','不同意','一般','同意','非常同意'], sourceIndicatorId:'s11' },
        { id:'q12', type:'likert', text:'毛孩子之家的直播+单宠用具让我产生信任', anchors:['非常不同意','不同意','一般','同意','非常同意'], sourceIndicatorId:'s12' },
        { id:'q13', type:'likert', text:'我愿意办毛孩子之家的月卡/次卡会员', anchors:['非常不同意','不同意','一般','同意','非常同意'], sourceIndicatorId:'s13' },
        { id:'q14', type:'likert', text:'我会在半年内多次回毛孩子之家', anchors:['非常不同意','不同意','一般','同意','非常同意'], sourceIndicatorId:'s14' },
        { id:'q15', type:'likert', text:'我愿意向养宠朋友推荐毛孩子之家', anchors:['非常不同意','不同意','一般','同意','非常同意'], sourceIndicatorId:'s15' },
        { id:'q16', type:'likert', text:'我愿意参与毛孩子之家的活动/打卡', anchors:['非常不同意','不同意','一般','同意','非常同意'], sourceIndicatorId:'s16' }
      ],
      responses: [
        { personaId:'p1', answers:[
          {questionId:'q1', value:5, raw:'CKU 认证'},
          {questionId:'q2', value:5, raw:'猫不害怕'},
          {questionId:'q3', value:5, raw:'卫生OK'},
          {questionId:'q4', value:4, raw:'本地知道'},
          {questionId:'q5', value:5, raw:'直播有差异化'},
          {questionId:'q6', value:4, raw:'小红书有'},
          {questionId:'q7', value:5, raw:'专业'},
          {questionId:'q8', value:4, raw:'信任'},
          {questionId:'q9', value:4, raw:'合理'},
          {questionId:'q10', value:5, raw:'出片'},
          {questionId:'q11', value:5, raw:'有温度'},
          {questionId:'q12', value:5, raw:'信任直播'},
          {questionId:'q13', value:4, raw:'愿办月卡'},
          {questionId:'q14', value:5, raw:'多次回访'},
          {questionId:'q15', value:5, raw:'愿推荐'},
          {questionId:'q16', value:5, raw:'愿参与'} ]},
        { personaId:'p2', answers:[
          {questionId:'q1', value:4, raw:'基本专业'},
          {questionId:'q2', value:4, raw:'基本无应激'},
          {questionId:'q3', value:5, raw:'卫生OK'},
          {questionId:'q4', value:4, raw:'本地知道'},
          {questionId:'q5', value:5, raw:'直播有差异化'},
          {questionId:'q6', value:3, raw:'抖音少'},
          {questionId:'q7', value:4, raw:'基本专业'},
          {questionId:'q8', value:5, raw:'直播信任'},
          {questionId:'q9', value:4, raw:'合理'},
          {questionId:'q10', value:3, raw:'一般'},
          {questionId:'q11', value:4, raw:'有温度'},
          {questionId:'q12', value:5, raw:'信任直播'},
          {questionId:'q13', value:3, raw:'观望'},
          {questionId:'q14', value:4, raw:'愿回访'},
          {questionId:'q15', value:4, raw:'会推荐'},
          {questionId:'q16', value:3, raw:'偶尔参与'} ]},
        { personaId:'p3', answers:[
          {questionId:'q1', value:5, raw:'专业'},
          {questionId:'q2', value:4, raw:'基本无应激'},
          {questionId:'q3', value:4, raw:'卫生OK'},
          {questionId:'q4', value:4, raw:'知道'},
          {questionId:'q5', value:5, raw:'直播差异化'},
          {questionId:'q6', value:4, raw:'小红书有'},
          {questionId:'q7', value:5, raw:'专业'},
          {questionId:'q8', value:5, raw:'直播信任'},
          {questionId:'q9', value:4, raw:'合理'},
          {questionId:'q10', value:4, raw:'环境OK'},
          {questionId:'q11', value:4, raw:'有温度'},
          {questionId:'q12', value:5, raw:'信任'},
          {questionId:'q13', value:4, raw:'愿办卡'},
          {questionId:'q14', value:4, raw:'愿回访'},
          {questionId:'q15', value:5, raw:'愿推荐'},
          {questionId:'q16', value:4, raw:'愿参与'} ]}
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
        q2: { mean: 4.33, sd: 0.47, dist:[0,0,0,2,1], n:3 },
        q3: { mean: 4.67, sd: 0.47, dist:[0,0,0,1,2], n:3 },
        q4: { mean: 4.0, sd: 0.0, dist:[0,0,0,3,0], n:3 },
        q5: { mean: 5.0, sd: 0.0, dist:[0,0,0,0,3], n:3 },
        q6: { mean: 3.67, sd: 0.47, dist:[0,0,1,2,0], n:3 },
        q7: { mean: 4.67, sd: 0.47, dist:[0,0,0,1,2], n:3 },
        q8: { mean: 4.67, sd: 0.47, dist:[0,0,0,1,2], n:3 },
        q9: { mean: 4.0, sd: 0.0, dist:[0,0,0,3,0], n:3 },
        q10:{ mean: 4.0, sd: 0.82, dist:[0,0,1,1,1], n:3 },
        q11:{ mean: 4.33, sd: 0.47, dist:[0,0,0,2,1], n:3 },
        q12:{ mean: 5.0, sd: 0.0, dist:[0,0,0,0,3], n:3 },
        q13:{ mean: 3.67, sd: 0.47, dist:[0,0,1,2,0], n:3 },
        q14:{ mean: 4.33, sd: 0.47, dist:[0,0,0,2,1], n:3 },
        q15:{ mean: 4.67, sd: 0.47, dist:[0,0,0,1,2], n:3 },
        q16:{ mean: 4.0, sd: 0.82, dist:[0,0,1,1,1], n:3 }
      },
      openThemes: [
        { questionId:'open1', question:'你为什么选毛孩子之家？', texts:['洗护师温柔','直播放心','无应激'], themes:[{label:'洗护师专业', count:2},{label:'直播+无应激', count:1}], quotes:['洗护师很温柔','实时直播看着放心'] }
      ],
      indicatorMeans: [
        {label:'洗护师专业度', mean:4.67, value:4.67, sourceIndicatorId:'s1'},
        {label:'无应激环境', mean:4.33, value:4.33, sourceIndicatorId:'s2'},
        {label:'卫生安全', mean:4.67, value:4.67, sourceIndicatorId:'s3'},
        {label:'本地知名度', mean:4.0, value:4.0, sourceIndicatorId:'s4'},
        {label:'差异化定位', mean:5.0, value:5.0, sourceIndicatorId:'s5'},
        {label:'口碑传播', mean:3.67, value:3.67, sourceIndicatorId:'s6'},
        {label:'专业可信', mean:4.67, value:4.67, sourceIndicatorId:'s7'},
        {label:'寄养安心', mean:4.67, value:4.67, sourceIndicatorId:'s8'},
        {label:'性价比', mean:4.0, value:4.0, sourceIndicatorId:'s9'},
        {label:'环境颜值', mean:4.0, value:4.0, sourceIndicatorId:'s10'},
        {label:'品牌温度', mean:4.33, value:4.33, sourceIndicatorId:'s11'},
        {label:'信任感', mean:5.0, value:5.0, sourceIndicatorId:'s12'},
        {label:'会员归属', mean:3.67, value:3.67, sourceIndicatorId:'s13'},
        {label:'复购意愿', mean:4.33, value:4.33, sourceIndicatorId:'s14'},
        {label:'推荐意愿', mean:4.67, value:4.67, sourceIndicatorId:'s15'}
      ],
      insights: '1. 洗护师专业（Q1）与卫生安全（Q3）是毛孩子之家强项，得分 4.0+，2 年本地口碑+CKU 认证有效。\n2. 实时直播（Q5/Q8）是核心差异化卖点，2 家店已上线，客群感知明显。\n3. 复购率（Q14）45% 表现良好，但会员月卡（Q13）渗透低，私域转化未充分挖掘。\n4. 跨城品牌（Q4）认知弱于本地口碑，5 家店扩展需强化品牌建设。\n5. 洗护师认证+实时直播+单宠独立用具+联名宠物摄影是核心传播资产，会员次卡+异业合作是规模增长关键。'
    },
    values: {
      functional: [
        { value:'洗护师 CKU 认证', evidence:'Q1=4.67 / CKU/NGKC 占比', priority:'P0' },
        { value:'无应激环境', evidence:'Q2=4.33 / 独立单宠用具', priority:'P0' },
        { value:'实时寄养直播', evidence:'Q5=5.0 / 24h 监控', priority:'P0' }
      ],
      emotional: [
        { value:'毛孩子放心的家人感', evidence:'Q11=4.33 + 复购 45%', priority:'P0' },
        { value:'家人安心', evidence:'Q12=5.0', priority:'P0' }
      ],
      social: [
        { value:'科学养宠的铲屎官', evidence:'Q5=5.0 / 90/95 后', priority:'P0' },
        { value:'上进的养宠人', evidence:'Q14=4.33 + 异业合作', priority:'P1' }
      ],
      epistemic: [
        { value:'CKU/NGKC 认证', evidence:'Q1=4.67', priority:'P1' },
        { value:'每日视频反馈', evidence:'Q8=4.67', priority:'P1' }
      ],
      conditional: [
        { value:'新手铲屎官', evidence:'p1 小敏 / 互联网运营', priority:'P0' },
        { value:'出差/家庭寄养', evidence:'p2/p3 客群', priority:'P0' }
      ],
      chosenFunctional: '洗护师认证+无应激环境+实时直播',
      chosenEmotional: '毛孩子放心的家人感',
      chosenSocial: '科学养宠的铲屎官',
      rationale: '以"洗护师认证+无应激+实时直播"建立功能可信度，以"毛孩子放心的家人感"建立情感连接，以"科学养宠的铲屎官"承担社交身份。'
    },
    recommendations: {
      short: '小程序上线会员月卡+异业合作（宠物医院/猫舍）；小红书+抖音同城开账号发布"无应激洗护+实时直播"系列内容。',
      mid: '12 个月内开 3 家新店（成都 2+重庆 1），推出联名宠物摄影+会员次卡，营收增长 50%。',
      long: '建立"毛孩子之家·科学养宠"内容 IP，从川渝 2 家店升级为西南区域宠物服务品牌。',
      risks: ['洗护师招聘难','新店选址失误','跨城品牌认知弱','寄养卫生/安全风险']
    }
  };

  if(typeof window!== 'undefined') window.__case_maohaizi_house_work1 = data;
})();
