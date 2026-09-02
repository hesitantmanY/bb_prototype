/* ============================================================
 hengrui-zao / work1 — 业务价值体系 (T09 filled)
 字段值参考 docs/demo-data.js hengrui.work1 叙事基线，
 形状严格匹配 Work1.defaultData()。
 ============================================================ */
(function(){
  const data = {
    sbu: {
      name: '恒锐精密',
      category: '制造 / 专精特新（精密五金件 OEM+自有品牌）',
      stage: '成长期',
      scope: '国内',
      countries: ['中国'],
      summary: '东莞 8000 万营收的精密件 OEM 厂，服务汽车变速箱+医疗+消费电子三领域，员工 80 人，30+ 台 CNC 设备，SPC 体系完备，0.005mm 精度。',
      threeQuestions: { customer: true, channel: true, brand: true },
      boundary: '客户：聚焦 B 端整机品牌方+工业采购经理+专精特新渠道商，不做 C 端；渠道：直销团队+阿里 1688+行业展会（SIMM/CIMT）+微信生态，不依赖单一客户；品牌：恒锐造为独立自有品牌，与 OEM 业务做品牌区隔；损益：OEM 与自有品牌独立核算，复用工厂与设备。'
    },
    environment: {
      political: '专精特新政策持续加码，工信部"小巨人"扶持；制造业增值税即征即退；东莞"机器换人"补贴；中美贸易摩擦下国产替代加速。',
      economic: '2023 年中国精密零部件市场 1.8 万亿（年增 8%）；汽车/医疗/消费电子下游增长稳健；国产替代率从 30% 提升到 50%+。',
      social: '工业 4.0 推动柔性制造；B 端采购线上化（1688/京东工业）；客户对交期/资质/小批量柔性要求提升。',
      technological: 'CNC 五轴加工+3D 打印+激光检测成熟；MES/ERP 数字化；SPC 体系+ISO 9001/IATF 16949 认证；AI 视觉检测。',
      industry: '精密件 OEM 头部：科达制造/巨轮智能/拓斯达；专精特新标杆：苏州春兴/宁波震裕/东莞长盈精密；自营品牌新锐：长盈精密自有品牌、绿的谐波。',
      valueChain: [
        {label:'研发/工程设计', v:8.5, reason:'公差/材料/工艺 — IP/图纸'},
        {label:'关键零部件外购', v:5.5, reason:'刀具/夹具/标准件'},
        {label:'制造/装配', v:2.5, reason:'CNC/后处理 — 微笑曲线谷底'},
        {label:'物流/分销', v:4.0, reason:'仓配/客户交付'},
        {label:'品牌/营销', v:9.0, reason:'展会+自有品牌 — 最高附加值'},
        {label:'售后/技术服务', v:5.0, reason:'客户走访/质量追溯/补件'},
      ],
      basics: {
        scale: { actual: '8000 万营收，80 人，30+ 台 CNC', target: '1.5 亿营收，自有品牌占 30%', source: '内部台账' },
        scope: { actual: '汽车变速箱+医疗+消费电子三领域', target: '汽车+医疗+3C+机器人四领域', source: '战略规划' },
        products: { actual: '精密五金件 OEM，0.005mm 精度', target: 'OEM+自有品牌"恒锐造"精密件', source: '产品路线图' },
        customers: { actual: '一汽/迈瑞/美的各 8-12%', target: 'OEM 客户结构散+自有品牌客户 30%', source: '用户调研' },
        supply: { actual: '30+ 台 CNC+5 套检测设备', target: '+ 5 台五轴 CNC+自动化产线', source: '供应链' },
        performance: {
          share: { actual: '精密五金细分 0.05%', target: '0.12%（自有品牌贡献）', source: '目标推导' },
          roi: { actual: '1.5', target: '1.7', source: '财务模型' },
          growth: { actual: '年增 10%', target: '年增 25%（国产替代+自有品牌）', source: '行业基准' }
        }
      },
      competitors: [
        { id:'c1', name:'长盈精密', price:'加工费 80-200 元/件', strengths:'消费电子精密件龙头、自有品牌布局早', weaknesses:'汽车医疗资质弱、定制化弱', position:'以"汽车医疗资质+小批量柔性"差异化' },
        { id:'c2', name:'震裕科技', price:'加工费 60-150 元/件', strengths:'家电+新能源精密件规模化、模具自制', weaknesses:'医疗资质弱、自有品牌弱', position:'以"医疗资质+SPC 体系"切入' },
        { id:'c3', name:'科达制造', price:'加工费 50-120 元/件', strengths:'通用机械精密件规模化、价格低', weaknesses:'精度 0.01mm、定制化弱', position:'以"0.005mm 精度+定制化"对抗' },
        { id:'c4', name:'拓斯达', price:'加工费 70-180 元/件', strengths:'智能制造+CNC 设备+服务一体化', weaknesses:'OEM 件非主业、客户分散', position:'以"30+ 年精密件经验"差异化' },
        { id:'c5', name:'绿的谐波（专精特新标杆）', price:'加工费 100-300 元/件', strengths:'谐波减速器专精特新、自有品牌强', weaknesses:'品类窄、跨品类能力弱', position:'以"多领域 OEM 经验+24h 打样"切入' }
      ],
      ourCapabilities: {
        delivery: '30+ 台 CNC + 5 套检测设备 + 24h 打样 + SPC 体系',
        core: '汽车/医疗/消费电子三领域经验 + 0.005mm 精度 + 小批量柔性',
        brand: 'OEM 代工口碑强，自有品牌"恒锐造"尚无认知',
        customer: '一汽/迈瑞/美的等 10+ 大客户',
        compliance: 'IATF 16949 / ISO 9001 / ISO 13485 医疗资质 / 第三方检测报告',
        defensive: '30+ 年精密件经验 + 客户结构散（大客户各 8-12%）',
        critical: '自有品牌"恒锐造"从零起 + 价格战压力',
        structural: '工厂+设备强，但缺品牌运营/电商/营销人才',
        smileCurve: '优势在核心（精密制造）+ 合规（医疗资质），劣势在品牌（自有品牌从零）+ 客户（结构待散）——定位为"精密制造+自有品牌"双轮',
        _vcSig: '',
        trends: '国产替代、专精特新、工业 4.0、小批量柔性、数字化'
      }
    },
    personas: [
      { id:'p1', name:'王工', gender:'男', age:'38', occupation:'一汽变速箱采购经理', income:'二线 30 万/年', region:'长春',
        values:['资质合规','交期稳定','小批量柔性'], painPoints:'图纸响应慢、检测报告不全、价格战压力',
        channels:['行业展会','企业微信','1688'], quote:'我选供应商看资质、看交期、看配合度，价格不是第一。',
        traits:{lifestyle:'工业采购，重资质',cert:'ISTJ'} },
      { id:'p2', name:'李博士', gender:'男', age:'35', occupation:'迈瑞医疗研发主管', income:'一线 50 万/年', region:'深圳',
        values:['图纸配合度','医疗资质','检测报告'], painPoints:'图纸反复改、医疗认证复杂、量产风险',
        channels:['行业展会','SIMM/CIMT','企业微信'], quote:'医疗器械件看资质和工艺文档，价格不是核心。',
        traits:{lifestyle:'医疗研发主管，重合规',cert:'INTJ'} },
      { id:'p3', name:'陈总', gender:'男', age:'45', occupation:'专精特新渠道商', income:'经营收入 200 万/年', region:'苏州',
        values:['OEM 性价比','柔性打样','长期合作'], painPoints:'上游不稳定、账期长、缺品牌力',
        channels:['1688','行业展会','微信'], quote:'我做渠道最看重长期稳定+性价比，不是单点价格。',
        traits:{lifestyle:'渠道商，重长期',cert:'ESTJ'} }
    ],
    scenarios: [
      { id:'sc1', name:'新项目打样+量产', personaIds:['p1','p2'],
        benefits:{usage:'24h 打样+SPC 检测',service:'图纸配合+工艺文档',staff:'工程师专业',image:'可靠供应商'},
        costs:{monetary:'打样费 500-2000+量产 BOM',time:'7-15 天打样',energy:'图纸沟通',psychic:'量产风险'},
        anchor:'资质合规 + 配合度', decisiveGap:'24h 打样+工艺文档——官网/小程序展示打样流程+SPC 报告' },
      { id:'sc2', name:'医疗资质件认证', personaIds:['p2'],
        benefits:{usage:'ISO 13485+检测报告',service:'认证辅导+文档',staff:'工程师专业',image:'医疗合规伙伴'},
        costs:{monetary:'认证费 5-10 万+量产 BOM',time:'3-6 月认证',energy:'文档多',psychic:'认证失败'},
        anchor:'医疗资质 + 工艺文档', decisiveGap:'认证案例+第三方报告——展示 5+ 医疗认证案例' },
      { id:'sc3', name:'专精特新渠道合作', personaIds:['p3'],
        benefits:{usage:'OEM 性价比+柔性',service:'长期账期+技术支持',staff:'销售稳定',image:'稳定合作伙伴'},
        costs:{monetary:'渠道价 50-100 元/件',time:'长期合作',energy:'账期管理',psychic:'账期风险'},
        anchor:'长期稳定 + 性价比', decisiveGap:'稳定产能+柔性——展示 30+ 台 CNC+小批量能力' }
    ],
    metrics: {
      dimensions: [
        { id:'m1', name:'产品·制造', secondaries:[
          { id:'s1', name:'精度水平', measure:'加工精度 0.005mm / SPC 检测', selfScore: 9, actual: null },
          { id:'s2', name:'打样交期', measure:'24h 打样达成率', selfScore: 8, actual: null },
          { id:'s3', name:'小批量柔性', measure:'50 件起订达成率', selfScore: 8, actual: null }
        ]},
        { id:'m2', name:'品牌·认知', secondaries:[
          { id:'s4', name:'行业知名度', measure:'行业展会提及率', selfScore: 5, actual: null },
          { id:'s5', name:'自有品牌认知', measure:'能说出"恒锐造"的客户%', selfScore: 1, actual: null },
          { id:'s6', name:'口碑传播', measure:'老客户推荐率', selfScore: 7, actual: null }
        ]},
        { id:'m3', name:'品牌·判断', secondaries:[
          { id:'s7', name:'专业可信', measure:'专业度评分', selfScore: 8, actual: null },
          { id:'s8', name:'医疗资质', measure:'ISO 13485 认证展示', selfScore: 7, actual: null },
          { id:'s9', name:'性价比', measure:'加工费性价比评分', selfScore: 7, actual: null }
        ]},
        { id:'m4', name:'品牌·感受', secondaries:[
          { id:'s10', name:'响应速度', measure:'图纸回复时间', selfScore: 8, actual: null },
          { id:'s11', name:'品牌温度', measure:'品牌情感题均分', selfScore: 5, actual: null },
          { id:'s12', name:'信任感', measure:'信任题均分', selfScore: 7, actual: null }
        ]},
        { id:'m5', name:'复购·推荐', secondaries:[
          { id:'s13', name:'客户粘性', measure:'年合作客户数', selfScore: 8, actual: null },
          { id:'s14', name:'续约率', measure:'年续约率', selfScore: 8, actual: null },
          { id:'s15', name:'推荐意愿', measure:'NPS', selfScore: 7, actual: null }
        ]}
      ],
      disclaimerAcknowledged: true
    },
    survey: {
      questions: [
        { id:'q1', type:'likert', text:'恒锐精密加工精度达到 0.005mm，SPC 检测完备', anchors:['非常不同意','不同意','一般','同意','非常同意'], sourceIndicatorId:'s1' },
        { id:'q2', type:'likert', text:'恒锐精密 24h 打样响应满足我紧急项目需求', anchors:['非常不同意','不同意','一般','同意','非常同意'], sourceIndicatorId:'s2' },
        { id:'q3', type:'likert', text:'恒锐精密支持小批量柔性（50 件起订）', anchors:['非常不同意','不同意','一般','同意','非常同意'], sourceIndicatorId:'s3' },
        { id:'q4', type:'likert', text:'在汽车/医疗/消费电子行业我常听到恒锐精密', anchors:['非常不同意','不同意','一般','同意','非常同意'], sourceIndicatorId:'s4' },
        { id:'q5', type:'likert', text:'恒锐造自有品牌在精密件领域有差异化', anchors:['非常不同意','不同意','一般','同意','非常同意'], sourceIndicatorId:'s5' },
        { id:'q6', type:'likert', text:'我常在行业展会/1688 看到恒锐精密的正面口碑', anchors:['非常不同意','不同意','一般','同意','非常同意'], sourceIndicatorId:'s6' },
        { id:'q7', type:'likert', text:'恒锐精密在精密件加工上展现专业度', anchors:['非常不同意','不同意','一般','同意','非常同意'], sourceIndicatorId:'s7' },
        { id:'q8', type:'likert', text:'我信任恒锐精密的医疗资质（ISO 13485）', anchors:['非常不同意','不同意','一般','同意','非常同意'], sourceIndicatorId:'s8' },
        { id:'q9', type:'likert', text:'恒锐精密加工费与价值匹配', anchors:['非常不同意','不同意','一般','同意','非常同意'], sourceIndicatorId:'s9' },
        { id:'q10', type:'likert', text:'恒锐精密图纸响应快，工程师配合度高', anchors:['非常不同意','不同意','一般','同意','非常同意'], sourceIndicatorId:'s10' },
        { id:'q11', type:'likert', text:'恒锐精密让我感到"专业但有温度"', anchors:['非常不同意','不同意','一般','同意','非常同意'], sourceIndicatorId:'s11' },
        { id:'q12', type:'likert', text:'恒锐精密资质和案例让我对合作产生信任', anchors:['非常不同意','不同意','一般','同意','非常同意'], sourceIndicatorId:'s12' },
        { id:'q13', type:'likert', text:'我愿意与恒锐精密建立长期合作', anchors:['非常不同意','不同意','一般','同意','非常同意'], sourceIndicatorId:'s13' },
        { id:'q14', type:'likert', text:'我会续约恒锐精密的代工合作', anchors:['非常不同意','不同意','一般','同意','非常同意'], sourceIndicatorId:'s14' },
        { id:'q15', type:'likert', text:'我愿意向同行推荐恒锐精密', anchors:['非常不同意','不同意','一般','同意','非常同意'], sourceIndicatorId:'s15' },
        { id:'q16', type:'likert', text:'我愿意尝试恒锐造自有品牌精密件', anchors:['非常不同意','不同意','一般','同意','非常同意'], sourceIndicatorId:'s16' }
      ],
      responses: [
        { personaId:'p1', answers:[
          {questionId:'q1', value:5, raw:'精度能打'},
          {questionId:'q2', value:5, raw:'24h 响应快'},
          {questionId:'q3', value:5, raw:'50 件起订'},
          {questionId:'q4', value:4, raw:'听过'},
          {questionId:'q5', value:2, raw:'自有品牌还弱'},
          {questionId:'q6', value:4, raw:'有口碑'},
          {questionId:'q7', value:5, raw:'专业'},
          {questionId:'q8', value:4, raw:'医疗资质可'},
          {questionId:'q9', value:4, raw:'性价比合理'},
          {questionId:'q10', value:5, raw:'响应快'},
          {questionId:'q11', value:3, raw:'B 端中性'},
          {questionId:'q12', value:4, raw:'资质可'},
          {questionId:'q13', value:5, raw:'愿长期合作'},
          {questionId:'q14', value:5, raw:'会续约'},
          {questionId:'q15', value:5, raw:'愿推荐'},
          {questionId:'q16', value:3, raw:'愿尝试'} ]},
        { personaId:'p2', answers:[
          {questionId:'q1', value:5, raw:'精度达标'},
          {questionId:'q2', value:5, raw:'响应快'},
          {questionId:'q3', value:4, raw:'小批量可'},
          {questionId:'q4', value:4, raw:'听过'},
          {questionId:'q5', value:2, raw:'自有品牌弱'},
          {questionId:'q6', value:4, raw:'有口碑'},
          {questionId:'q7', value:5, raw:'专业'},
          {questionId:'q8', value:5, raw:'医疗资质强'},
          {questionId:'q9', value:4, raw:'合理'},
          {questionId:'q10', value:5, raw:'响应快'},
          {questionId:'q11', value:3, raw:'B 端中性'},
          {questionId:'q12', value:5, raw:'资质信任'},
          {questionId:'q13', value:5, raw:'愿合作'},
          {questionId:'q14', value:4, raw:'看情况'},
          {questionId:'q15', value:4, raw:'愿推荐'},
          {questionId:'q16', value:3, raw:'可试'} ]},
        { personaId:'p3', answers:[
          {questionId:'q1', value:4, raw:'精度可以'},
          {questionId:'q2', value:4, raw:'响应可以'},
          {questionId:'q3', value:5, raw:'柔性'},
          {questionId:'q4', value:3, raw:'听过少'},
          {questionId:'q5', value:2, raw:'品牌弱'},
          {questionId:'q6', value:3, raw:'一般'},
          {questionId:'q7', value:4, raw:'基本专业'},
          {questionId:'q8', value:3, raw:'一般'},
          {questionId:'q9', value:5, raw:'性价比高'},
          {questionId:'q10', value:4, raw:'响应OK'},
          {questionId:'q11', value:3, raw:'B 端'},
          {questionId:'q12', value:4, raw:'基本信任'},
          {questionId:'q13', value:5, raw:'愿合作'},
          {questionId:'q14', value:5, raw:'会续约'},
          {questionId:'q15', value:4, raw:'愿推荐'},
          {questionId:'q16', value:3, raw:'可试'} ]}
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
        q2: { mean: 4.67, sd: 0.47, dist:[0,0,0,1,2], n:3 },
        q3: { mean: 4.67, sd: 0.47, dist:[0,0,0,1,2], n:3 },
        q4: { mean: 3.67, sd: 0.47, dist:[0,0,1,2,0], n:3 },
        q5: { mean: 2.0, sd: 0.0, dist:[0,0,3,0,0], n:3 },
        q6: { mean: 3.67, sd: 0.47, dist:[0,0,1,2,0], n:3 },
        q7: { mean: 4.67, sd: 0.47, dist:[0,0,0,1,2], n:3 },
        q8: { mean: 4.0, sd: 0.82, dist:[0,0,1,1,1], n:3 },
        q9: { mean: 4.33, sd: 0.47, dist:[0,0,0,2,1], n:3 },
        q10:{ mean: 4.67, sd: 0.47, dist:[0,0,0,1,2], n:3 },
        q11:{ mean: 3.0, sd: 0.0, dist:[0,0,3,0,0], n:3 },
        q12:{ mean: 4.33, sd: 0.47, dist:[0,0,0,2,1], n:3 },
        q13:{ mean: 5.0, sd: 0.0, dist:[0,0,0,0,3], n:3 },
        q14:{ mean: 4.67, sd: 0.47, dist:[0,0,0,1,2], n:3 },
        q15:{ mean: 4.33, sd: 0.47, dist:[0,0,0,2,1], n:3 },
        q16:{ mean: 3.0, sd: 0.0, dist:[0,0,3,0,0], n:3 }
      },
      openThemes: [
        { questionId:'open1', question:'你为什么选恒锐精密？', texts:['精度能打','24h 打样','医疗资质'], themes:[{label:'精度+打样', count:2},{label:'医疗合规', count:1}], quotes:['精度能打','医疗资质强'] }
      ],
      indicatorMeans: [
        {label:'精度水平', mean:4.67, value:4.67, sourceIndicatorId:'s1'},
        {label:'打样交期', mean:4.67, value:4.67, sourceIndicatorId:'s2'},
        {label:'小批量柔性', mean:4.67, value:4.67, sourceIndicatorId:'s3'},
        {label:'行业知名度', mean:3.67, value:3.67, sourceIndicatorId:'s4'},
        {label:'自有品牌认知', mean:2.0, value:2.0, sourceIndicatorId:'s5'},
        {label:'口碑传播', mean:3.67, value:3.67, sourceIndicatorId:'s6'},
        {label:'专业可信', mean:4.67, value:4.67, sourceIndicatorId:'s7'},
        {label:'医疗资质', mean:4.0, value:4.0, sourceIndicatorId:'s8'},
        {label:'性价比', mean:4.33, value:4.33, sourceIndicatorId:'s9'},
        {label:'响应速度', mean:4.67, value:4.67, sourceIndicatorId:'s10'},
        {label:'品牌温度', mean:3.0, value:3.0, sourceIndicatorId:'s11'},
        {label:'信任感', mean:4.33, value:4.33, sourceIndicatorId:'s12'},
        {label:'客户粘性', mean:5.0, value:5.0, sourceIndicatorId:'s13'},
        {label:'续约率', mean:4.67, value:4.67, sourceIndicatorId:'s14'},
        {label:'推荐意愿', mean:4.33, value:4.33, sourceIndicatorId:'s15'}
      ],
      insights: '1. 制造能力（Q1/Q2/Q3）是恒锐精密的强项，得分 4.0-5.0，30+ 年精密经验+0.005mm 精度+24h 打样是核心壁垒。\n2. 自有品牌认知（Q5）是核心短板，几乎为零，恒锐造需要从零建立。\n3. 医疗资质（Q8）信任度高，但需更多认证案例与第三方报告展示。\n4. 性价比（Q9）分化，工业采购经理对价格不敏感，专精特新渠道商对性价比敏感。\n5. 自有品牌"恒锐造"应先在专精特新渠道商+中小品牌方试点，以"0.005mm 精度+24h 打样+SPC 体系+医疗资质"为四大核心卖点。'
    },
    values: {
      functional: [
        { value:'精度高 0.005mm', evidence:'Q1=4.67 / SPC 体系', priority:'P0' },
        { value:'交期快 24h', evidence:'Q2=4.67', priority:'P0' },
        { value:'柔性小批量', evidence:'Q3=4.67 / 50 件起订', priority:'P0' },
        { value:'医疗资质', evidence:'Q8=4.0 / ISO 13485', priority:'P0' }
      ],
      emotional: [
        { value:'专业可靠', evidence:'Q7=4.67 / 30+ 年经验', priority:'P0' },
        { value:'长期合作', evidence:'Q13=5.0', priority:'P0' }
      ],
      social: [
        { value:'专精特新合作伙伴', evidence:'Q5=2.0 + 国产替代', priority:'P0' },
        { value:'国产替代代表', evidence:'Q14=4.67 + 长期合作', priority:'P1' }
      ],
      epistemic: [
        { value:'SPC 体系', evidence:'Q1=4.67', priority:'P1' },
        { value:'第三方检测报告', evidence:'Q8=4.0', priority:'P1' },
        { value:'认证案例', evidence:'Q8=4.0', priority:'P1' }
      ],
      conditional: [
        { value:'汽车变速箱', evidence:'p1 王工', priority:'P0' },
        { value:'医疗器械', evidence:'p2 李博士', priority:'P0' },
        { value:'消费电子', evidence:'p3 陈总', priority:'P1' }
      ],
      chosenFunctional: '0.005mm 精度+24h 打样+小批量柔性+医疗资质',
      chosenEmotional: '专业可靠的精密件伙伴',
      chosenSocial: '专精特新国产替代合作伙伴',
      rationale: '以"0.005mm 精度+24h 打样+小批量柔性+医疗资质"建立功能可信度，以"专业可靠"建立情感连接，以"专精特新国产替代"承担社交身份。'
    },
    recommendations: {
      short: '官网+小程序上线"恒锐造"品牌页+认证案例墙+SPC 报告展示；参加 SIMM/CIMT 展会发布自有品牌。',
      mid: '6 个月内自有品牌试点 50+ 客户（专精特新渠道商+中小品牌方），营收占比 15%。',
      long: '建立"恒锐造·精密件专家"内容 IP，从东莞 OEM 厂升级为专精特新精密件自有品牌代表。',
      risks: ['价格战持续','自有品牌客户接受度低','工厂交期跟不上','医疗认证延期']
    }
  };

  if(typeof window!== 'undefined') window.__case_hengrui_zao_work1 = data;
})();
