/* ============================================================
 wenqu-shuyuan / work1 — 业务价值体系 (T09 filled)
 字段值参考 docs/demo-data.js wenqu.work1 叙事基线，
 形状严格匹配 Work1.defaultData()。
 ============================================================ */
(function(){
  const data = {
    sbu: {
      name: '问渠书院',
      category: '教育 / 培训（K12 素质+职业培训）',
      stage: '成熟期',
      scope: '国内',
      countries: ['中国'],
      summary: '3 家校区（杭州/宁波/绍兴）的 K12 素质培训机构，编程+美术+口才三科，年营收 1500 万，员工 25 人，老客续费率 70%，双减后学员数下降 30%。',
      threeQuestions: { customer: true, channel: false, brand: true },
      boundary: '客户：聚焦 4-18 岁 K12 + 18+ 职业转型客，不做 0-3 岁早教/学科类培训；渠道：校区地推+美团点评+小红书家长口碑+抖音+老学员社群；品牌：问渠书院为独立品牌，不与母公司其他业务混用；损益：3 校区独立核算，复用师资与教务体系。'
    },
    environment: {
      political: '双减政策（2021）持续执行，K12 学科类培训受严格限制，素质类（编程/美术/口才）相对宽松；职业培训受人社部/教育部鼓励，证书类合规。',
      economic: '2023 年职业培训市场约 1.2 万亿（年增 12%）；K12 素质培训市场约 2000 亿（双减后稳定）；新职业（数字媒体/电商运营/AI 应用）需求增长。',
      social: '家长鸡娃焦虑+预算紧；大学生就业难（2024 毕业生 1179 万），学一门实用技能意愿强；30+ 转行者看重"学完能找到工作"。',
      technological: 'AI/大模型工具降低数字媒体门槛；线上录播+线下小班混合模式成熟；抖音/小红书职业教育内容获客高效。',
      industry: 'K12 素质：编程猫/核桃编程/美术宝/小码王；职业培训：开课吧/三节课/腾讯课堂/得到高研院/黑马程序员。',
      valueChain: [
        {label:'教研/课程设计', v:8.5, reason:'教学体系/课纲/方法论'},
        {label:'师资/招聘培训', v:6.0, reason:'教师稳定+司龄+培训体系'},
        {label:'教材/教具/平台', v:4.0, reason:'教辅/平台/设备'},
        {label:'招生/渠道', v:5.0, reason:'地推/美团/抖音/B站'},
        {label:'品牌/口碑/案例', v:9.0, reason:'家长口碑+学员作品 — 最高附加值'},
        {label:'学员服务/就业', v:5.5, reason:'课后辅导/职业推荐/复购续费'},
      ],
      basics: {
        scale: { actual: '3 校区，员工 25 人，年营收 1500 万', target: '5 校区+1 职业培训线，年营收 3000 万', source: '内部台账' },
        scope: { actual: 'K12 编程+美术+口才 3 科', target: '+ 数字媒体/电商运营/AI 应用 3 科', source: '战略规划' },
        products: { actual: '年课 5800-9800 元，续费 70%', target: 'K12 保老客+职业课 4800-12000/期', source: '产品路线图' },
        customers: { actual: '3 校区 1500 学员，家长 60%/学员 30%/老带新 10%', target: '新增职业线 500 学员', source: '用户调研' },
        supply: { actual: '8 位全职老师+5 位兼职', target: '+ 5 位职业课老师+合作机构讲师', source: '供应链' },
        performance: {
          share: { actual: '杭州素质培训细分 0.4%', target: '0.8%（职业线贡献）', source: '目标推导' },
          roi: { actual: '1.2', target: '1.5', source: '财务模型' },
          growth: { actual: '年减 5%（双减影响）', target: '年增 20%（职业线带动）', source: '行业基准' }
        }
      },
      competitors: [
        { id:'c1', name:'编程猫', price:'年课 6000-12000 元', strengths:'编程细分龙头、AI 课程完整', weaknesses:'线下校区少、客单价高', position:'以"3 校区口碑+性价比"对抗' },
        { id:'c2', name:'核桃编程', price:'年课 4000-9000 元', strengths:'线上为主、价格亲民、规模大', weaknesses:'线下体验弱、师资不稳定', position:'以"线下小班+老师稳定"差异化' },
        { id:'c3', name:'开课吧', price:'职业课 5000-15000 元', strengths:'互联网职业教育头部、师资强', weaknesses:'近年暴雷口碑受损、就业兑现差', position:'以"3 校区稳定+就业推荐"重建信任' },
        { id:'c4', name:'三节课', price:'职业课 3000-8000 元', strengths:'互联网产品/运营课程口碑好', weaknesses:'线下弱、就业兑现一般', position:'以"线下+就业社群"差异化' },
        { id:'c5', name:'黑马程序员', price:'职业课 8000-20000 元', strengths:'IT 培训老牌、就业服务', weaknesses:'课程偏传统、缺新职业', position:'以"新职业+小班+老师稳定"切入' }
      ],
      ourCapabilities: {
        delivery: '3 校区场地+8 位全职老师+教务体系稳定',
        core: '5 年办学经验+老客续费 70%+本地口碑',
        brand: '3 城市本地家长口碑强，跨城品牌力弱',
        customer: '老学员社群 3000+家长',
        compliance: '办学许可证+素质类课程备案+人社部证书合作',
        defensive: '本地老客粘性+老师稳定+教务体系',
        critical: '新职业课师资弱+跨城复制能力待验证',
        structural: '团队偏 K12，缺职业培训运营/讲师',
        smileCurve: '优势在客户（老客粘性）+ 核心（师资稳定），劣势在品牌（跨城弱）+ 交付（缺新职业）——定位为"本地老客+职业线扩展"双轮',
        _vcSig: '',
        trends: 'AI 应用、电商运营、数字媒体、新职业、混合学习'
      }
    },
    personas: [
      { id:'p1', name:'李姐', gender:'女', age:'36', occupation:'小学三年级家长', income:'杭州 25 万/年（家庭）', region:'杭州西湖',
        values:['鸡娃焦虑','性价比','效果可见'], painPoints:'孩子学习兴趣低、报班多花销大、效果难量化',
        channels:['小红书家长群','美团点评','抖音'], quote:'我愿意花钱，但要看得到孩子进步。',
        traits:{lifestyle:'鸡娃家长，重效果',cert:'ESFJ'} },
      { id:'p2', name:'小王', gender:'男', age:'22', occupation:'大四应届生', income:'暂无', region:'宁波',
        values:['学完能找到工作','实战项目','简历加分'], painPoints:'大学学的没用、简历没亮点、面试总被拒',
        channels:['抖音','小红书','B 站'], quote:'我学完最关心能不能进面试、能不能拿 offer。',
        traits:{lifestyle:'应届生，就业导向',cert:'ENTJ'} },
      { id:'p3', name:'张姐', gender:'女', age:'32', occupation:'传统行业待业 6 月', income:'失业金', region:'绍兴',
        values:['学一门新技能','转行可行','老师负责'], painPoints:'30+ 转行难、培训机构套路多、学完就业没保障',
        channels:['抖音','小红书','老学员推荐'], quote:'我已经被坑过两次，这次必须看口碑+就业案例。',
        traits:{lifestyle:'30+ 转行者，谨慎',cert:'INFJ'} }
    ],
    scenarios: [
      { id:'sc1', name:'家长报班决策', personaIds:['p1'],
        benefits:{usage:'试学课+小班',service:'学习进度反馈',staff:'老师稳定+教务跟进',image:'重视教育的家长'},
        costs:{monetary:'年课 5800-9800 元',time:'接送 1-2 小时/周',energy:'选班纠结',psychic:'效果不确定'},
        anchor:'效果可见 + 老师负责', decisiveGap:'学习进度可视化+老师稳定——小程序学习报告+老师点评' },
      { id:'sc2', name:'大学生求职技能', personaIds:['p2'],
        benefits:{usage:'实战项目+作品集',service:'简历指导+模拟面试',staff:'就业老师',image:'上进的应届生'},
        costs:{monetary:'职业课 4800-12000 元',time:'3-6 个月',energy:'学习强度',psychic:'找不到工作'},
        anchor:'就业兑现 + 项目实战', decisiveGap:'就业推荐+作品集——合作企业内推+学员作品墙' },
      { id:'sc3', name:'30+ 转行决策', personaIds:['p3'],
        benefits:{usage:'零基础友好+小班',service:'职业规划+老师答疑',staff:'老师负责+教务跟进',image:'勇敢转行的姐姐'},
        costs:{monetary:'职业课 4800-12000 元',time:'3-6 个月',energy:'工作+学习',psychic:'学完没人要'},
        anchor:'老师负责 + 就业保障', decisiveGap:'本地口碑+就业案例——老学员转行案例+就业社群' }
    ],
    metrics: {
      dimensions: [
        { id:'m1', name:'教学·质量', secondaries:[
          { id:'s1', name:'老师稳定性', measure:'老师流失率/年', selfScore: 8, actual: null },
          { id:'s2', name:'教学效果', measure:'学员作品/成绩提升', selfScore: 7, actual: null },
          { id:'s3', name:'课程体系完整', measure:'课程大纲完善度', selfScore: 7, actual: null }
        ]},
        { id:'m2', name:'品牌·认知', secondaries:[
          { id:'s4', name:'本地知名度', measure:'无提示提及率（杭州/宁波%）', selfScore: 7, actual: null },
          { id:'s5', name:'差异化定位', measure:'能说出"老师稳定"的家长%', selfScore: 6, actual: null },
          { id:'s6', name:'口碑传播', measure:'老带新转化率', selfScore: 7, actual: null }
        ]},
        { id:'m3', name:'品牌·判断', secondaries:[
          { id:'s7', name:'专业可信', measure:'专业度评分', selfScore: 7, actual: null },
          { id:'s8', name:'就业保障', measure:'就业案例数/可信度', selfScore: 4, actual: null },
          { id:'s9', name:'性价比', measure:'性价比评分', selfScore: 6, actual: null }
        ]},
        { id:'m4', name:'品牌·感受', secondaries:[
          { id:'s10', name:'校区环境', measure:'校区环境评分', selfScore: 7, actual: null },
          { id:'s11', name:'品牌温度', measure:'品牌情感题均分', selfScore: 7, actual: null },
          { id:'s12', name:'信任感', measure:'信任题均分', selfScore: 7, actual: null }
        ]},
        { id:'m5', name:'复购·推荐', secondaries:[
          { id:'s13', name:'社群归属', measure:'家长社群活跃度', selfScore: 7, actual: null },
          { id:'s14', name:'续费意愿', measure:'年续费率', selfScore: 7, actual: null },
          { id:'s15', name:'推荐意愿', measure:'NPS', selfScore: 7, actual: null }
        ]}
      ],
      disclaimerAcknowledged: true
    },
    survey: {
      questions: [
        { id:'q1', type:'likert', text:'问渠书院老师稳定，不会出现频繁换老师', anchors:['非常不同意','不同意','一般','同意','非常同意'], sourceIndicatorId:'s1' },
        { id:'q2', type:'likert', text:'问渠书院教学效果可见，孩子作品/成绩有提升', anchors:['非常不同意','不同意','一般','同意','非常同意'], sourceIndicatorId:'s2' },
        { id:'q3', type:'likert', text:'问渠书院课程体系完整，从入门到进阶清晰', anchors:['非常不同意','不同意','一般','同意','非常同意'], sourceIndicatorId:'s3' },
        { id:'q4', type:'likert', text:'在杭州/宁波/绍兴本地我常听到问渠书院', anchors:['非常不同意','不同意','一般','同意','非常同意'], sourceIndicatorId:'s4' },
        { id:'q5', type:'likert', text:'问渠书院在"老师稳定+教学扎实"上有差异化', anchors:['非常不同意','不同意','一般','同意','非常同意'], sourceIndicatorId:'s5' },
        { id:'q6', type:'likert', text:'我常在小红书/抖音看到问渠书院的正面口碑', anchors:['非常不同意','不同意','一般','同意','非常同意'], sourceIndicatorId:'s6' },
        { id:'q7', type:'likert', text:'问渠书院在 K12 素质+职业培训上展现专业度', anchors:['非常不同意','不同意','一般','同意','非常同意'], sourceIndicatorId:'s7' },
        { id:'q8', type:'likert', text:'我信任问渠书院的就业推荐服务', anchors:['非常不同意','不同意','一般','同意','非常同意'], sourceIndicatorId:'s8' },
        { id:'q9', type:'likert', text:'问渠书院的课包与价值匹配', anchors:['非常不同意','不同意','一般','同意','非常同意'], sourceIndicatorId:'s9' },
        { id:'q10', type:'likert', text:'问渠书院校区环境干净安全', anchors:['非常不同意','不同意','一般','同意','非常同意'], sourceIndicatorId:'s10' },
        { id:'q11', type:'likert', text:'问渠书院让我感到"不是冷冰冰的机构"', anchors:['非常不同意','不同意','一般','同意','非常同意'], sourceIndicatorId:'s11' },
        { id:'q12', type:'likert', text:'我信任问渠书院的办学历史与合规', anchors:['非常不同意','不同意','一般','同意','非常同意'], sourceIndicatorId:'s12' },
        { id:'q13', type:'likert', text:'我愿意加入问渠书院的家长/学员社群', anchors:['非常不同意','不同意','一般','同意','非常同意'], sourceIndicatorId:'s13' },
        { id:'q14', type:'likert', text:'我会续费/复购问渠书院的课程', anchors:['非常不同意','不同意','一般','同意','非常同意'], sourceIndicatorId:'s14' },
        { id:'q15', type:'likert', text:'我愿意向朋友推荐问渠书院', anchors:['非常不同意','不同意','一般','同意','非常同意'], sourceIndicatorId:'s15' },
        { id:'q16', type:'likert', text:'我愿意参与问渠书院的活动/课程体验', anchors:['非常不同意','不同意','一般','同意','非常同意'], sourceIndicatorId:'s16' }
      ],
      responses: [
        { personaId:'p1', answers:[
          {questionId:'q1', value:5, raw:'老师很稳定'},
          {questionId:'q2', value:4, raw:'孩子有进步'},
          {questionId:'q3', value:4, raw:'体系完整'},
          {questionId:'q4', value:5, raw:'本地都知道'},
          {questionId:'q5', value:4, raw:'差异化'},
          {questionId:'q6', value:3, raw:'小红书少'},
          {questionId:'q7', value:4, raw:'专业'},
          {questionId:'q8', value:4, raw:'基本信任'},
          {questionId:'q9', value:4, raw:'合理'},
          {questionId:'q10', value:4, raw:'环境OK'},
          {questionId:'q11', value:4, raw:'有温度'},
          {questionId:'q12', value:5, raw:'信任老校'},
          {questionId:'q13', value:4, raw:'愿加群'},
          {questionId:'q14', value:5, raw:'会续费'},
          {questionId:'q15', value:5, raw:'愿推荐'},
          {questionId:'q16', value:4, raw:'愿参与'} ]},
        { personaId:'p2', answers:[
          {questionId:'q1', value:4, raw:'基本稳定'},
          {questionId:'q2', value:4, raw:'作品可'},
          {questionId:'q3', value:4, raw:'清晰'},
          {questionId:'q4', value:3, raw:'没听过'},
          {questionId:'q5', value:4, raw:'差异化'},
          {questionId:'q6', value:3, raw:'抖音少'},
          {questionId:'q7', value:4, raw:'专业'},
          {questionId:'q8', value:5, raw:'有就业'},
          {questionId:'q9', value:4, raw:'合理'},
          {questionId:'q10', value:3, raw:'没去过'},
          {questionId:'q11', value:3, raw:'一般'},
          {questionId:'q12', value:4, raw:'信任'},
          {questionId:'q13', value:3, raw:'观望'},
          {questionId:'q14', value:4, raw:'看情况'},
          {questionId:'q15', value:4, raw:'会推荐'},
          {questionId:'q16', value:4, raw:'愿参与'} ]},
        { personaId:'p3', answers:[
          {questionId:'q1', value:5, raw:'老师固定'},
          {questionId:'q2', value:4, raw:'效果可'},
          {questionId:'q3', value:4, raw:'完整'},
          {questionId:'q4', value:3, raw:'不知名'},
          {questionId:'q5', value:4, raw:'差异化'},
          {questionId:'q6', value:3, raw:'口碑少'},
          {questionId:'q7', value:4, raw:'专业'},
          {questionId:'q8', value:5, raw:'推荐'},
          {questionId:'q9', value:4, raw:'合理'},
          {questionId:'q10', value:4, raw:'环境OK'},
          {questionId:'q11', value:4, raw:'有温度'},
          {questionId:'q12', value:4, raw:'信任'},
          {questionId:'q13', value:3, raw:'观望'},
          {questionId:'q14', value:4, raw:'愿试'},
          {questionId:'q15', value:4, raw:'会推荐'},
          {questionId:'q16', value:3, raw:'看情况'} ]}
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
        q3: { mean: 4.0, sd: 0.0, dist:[0,0,0,3,0], n:3 },
        q4: { mean: 3.67, sd: 0.94, dist:[0,0,1,1,1], n:3 },
        q5: { mean: 4.0, sd: 0.0, dist:[0,0,0,3,0], n:3 },
        q6: { mean: 3.0, sd: 0.0, dist:[0,0,3,0,0], n:3 },
        q7: { mean: 4.0, sd: 0.0, dist:[0,0,0,3,0], n:3 },
        q8: { mean: 4.67, sd: 0.47, dist:[0,0,0,1,2], n:3 },
        q9: { mean: 4.0, sd: 0.0, dist:[0,0,0,3,0], n:3 },
        q10:{ mean: 3.67, sd: 0.47, dist:[0,0,1,2,0], n:3 },
        q11:{ mean: 3.67, sd: 0.47, dist:[0,0,1,2,0], n:3 },
        q12:{ mean: 4.33, sd: 0.47, dist:[0,0,0,2,1], n:3 },
        q13:{ mean: 3.33, sd: 0.47, dist:[0,0,2,1,0], n:3 },
        q14:{ mean: 4.33, sd: 0.47, dist:[0,0,0,2,1], n:3 },
        q15:{ mean: 4.33, sd: 0.47, dist:[0,0,0,2,1], n:3 },
        q16:{ mean: 3.67, sd: 0.47, dist:[0,0,1,2,0], n:3 }
      },
      openThemes: [
        { questionId:'open1', question:'你为什么选问渠书院？', texts:['老师稳定','本地口碑','学完能找到工作'], themes:[{label:'老师稳定', count:2},{label:'就业兑现', count:1}], quotes:['老师稳定','学完能找到工作'] }
      ],
      indicatorMeans: [
        {label:'老师稳定性', mean:4.67, value:4.67, sourceIndicatorId:'s1'},
        {label:'教学效果', mean:4.0, value:4.0, sourceIndicatorId:'s2'},
        {label:'课程体系完整', mean:4.0, value:4.0, sourceIndicatorId:'s3'},
        {label:'本地知名度', mean:3.67, value:3.67, sourceIndicatorId:'s4'},
        {label:'差异化定位', mean:4.0, value:4.0, sourceIndicatorId:'s5'},
        {label:'口碑传播', mean:3.0, value:3.0, sourceIndicatorId:'s6'},
        {label:'专业可信', mean:4.0, value:4.0, sourceIndicatorId:'s7'},
        {label:'就业保障', mean:4.67, value:4.67, sourceIndicatorId:'s8'},
        {label:'性价比', mean:4.0, value:4.0, sourceIndicatorId:'s9'},
        {label:'校区环境', mean:3.67, value:3.67, sourceIndicatorId:'s10'},
        {label:'品牌温度', mean:3.67, value:3.67, sourceIndicatorId:'s11'},
        {label:'信任感', mean:4.33, value:4.33, sourceIndicatorId:'s12'},
        {label:'社群归属', mean:3.33, value:3.33, sourceIndicatorId:'s13'},
        {label:'续费意愿', mean:4.33, value:4.33, sourceIndicatorId:'s14'},
        {label:'推荐意愿', mean:4.33, value:4.33, sourceIndicatorId:'s15'}
      ],
      insights: '1. 老师稳定性（Q1）与本地口碑（Q4）是问渠书院的强项，得分 4.0+，5 年办学沉淀有效。\n2. 就业保障（Q8）是核心短板，K12 老客稳定但职业线新业务尚无案例，客户对"学完能找到工作"信任度低。\n3. 性价比（Q9）在家长客群中突出（K12 课包贵），但职业课客群愿为"就业兑现"付溢价。\n4. 跨城品牌（Q4）仅限于 3 个城市，新职业线如复制到其他城市需建立新信任锚点。\n5. 老师稳定+本地口碑+小班是核心传播资产，职业线应以"就业案例+作品集+本地推荐"建立信任。'
    },
    values: {
      functional: [
        { value:'老师稳定', evidence:'Q1=4.67 / 5 年司龄', priority:'P0' },
        { value:'教学扎实', evidence:'Q2=4.0 / 学员作品', priority:'P0' },
        { value:'就业推荐', evidence:'Q8=4.67', priority:'P0' }
      ],
      emotional: [
        { value:'家长放心', evidence:'Q12=4.33', priority:'P0' },
        { value:'学员成长陪伴', evidence:'Q11=3.67 + 老客续费 70%', priority:'P0' }
      ],
      social: [
        { value:'重视教育的家长', evidence:'Q4=3.67 + 老客社群', priority:'P0' },
        { value:'上进的学习者', evidence:'Q8=4.67 + 职业课客群', priority:'P1' }
      ],
      epistemic: [
        { value:'学习报告可视化', evidence:'Q2=4.0', priority:'P1' },
        { value:'学员作品集', evidence:'Q2=4.0 + 作品墙', priority:'P1' }
      ],
      conditional: [
        { value:'K12 鸡娃续费', evidence:'Q14=4.33 / 续费 70%', priority:'P0' },
        { value:'大学生求职', evidence:'Q8=4.67 / 应届生', priority:'P0' }
      ],
      chosenFunctional: '老师稳定+教学扎实+就业推荐',
      chosenEmotional: '家长/学员的成长陪伴',
      chosenSocial: '重视教育+上进的成长型人群',
      rationale: '以"老师稳定+教学扎实+就业推荐"建立功能可信度，以"成长陪伴"建立情感连接，以"成长型人群"承担社交身份。'
    },
    recommendations: {
      short: '上线小程序学习报告+学员作品墙；小红书+抖音开账号发布"老师稳定+学员成长"系列内容。',
      mid: '6 个月内职业线开 2 个班（数字媒体+电商运营），与 3-5 家本地企业建立就业合作。',
      long: '建立"问渠成长陪伴"内容 IP，K12+职业双线联动，从 3 校区本地品牌升级为浙江素质+职业培训代表。',
      risks: ['职业线师资招聘难','就业兑现不达标影响口碑','双减政策再度收紧','跨城复制能力不足']
    }
  };

  if(typeof window!== 'undefined') window.__case_wenqu_shuyuan_work1 = data;
})();
