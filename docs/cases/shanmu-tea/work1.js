/* ============================================================
 shanmu-tea / work1 — 业务价值体系 (T09 filled)
 字段值参考 docs/demo-data.js (git history) 的叙事基线，
 形状严格匹配 Work1.defaultData()。
 ============================================================ */
(function(){
 const data = {
 sbu: {
 name: '山木茶事 Shanmu Tea',
 category: '高端原叶中国茶 + 茶具订阅',
 stage: '海外扩张期',
 scope: '东南亚',
 countries: ['新加坡','马来西亚','印度尼西亚'],
 summary: '以可持续产地直采、节气茶单和陶瓷茶具订阅，服务 25–40 岁东南亚城市华人与文化爱好者。',
 threeQuestions: { customer: true, channel: true, brand: false },
 boundary: '客户：与母公司国内大宗茶业务的经销商客群完全区隔，面向东南亚 C 端文化人群；渠道：母公司 B2B 经销网络不共享，自建 Shopee/独立站与海外专柜；品牌：山木茶事为独立出海品牌，不出现母品牌 logo；损益：海外团队独立核算。仅复用母公司的产地供应链与制茶资质。'
 },
 environment: {
 political: '东南亚华人圈对中国传统文化接受度高；新加坡、马来西亚均有成熟食品进口合规框架；印尼需清真认证。2023 年新马分别与中方续签经贸合作备忘录，关税总体稳定。',
 economic: '新加坡 2023 年人均 GDP 约 USD 84,000，马来西亚约 USD 13,000。精品茶年增速 12-18%，高于传统茶（约 4%）。人民币兑 SGD 趋稳，原材料成本可控。',
 social: '东南亚华人 25-40 岁群体对节气、慢生活、正念饮茶的兴趣上升；KOL 文化推动送礼场景。IG/TikTok 上"ceremony"、"ritual"标签内容在 2023 年同比增长 60%+。',
 technological: 'Shopee、Lazada、TikTok Shop 渗透率高；小程序+独立站跨境电商成熟；冷链已覆盖一线城市；AR 溯源 + NFC 礼盒在 2024 年成为新中产品牌标配。',
 industry: '竞争分散：TWG Tea 主打奢华英式调香（百货专柜），TEAMan 主打年轻人拼配（社交媒体强），本地茶庄依赖线下客流。无品牌同时占据"产地溯源+节气+订阅"垂直定位。',
 basics: {
 scale: { actual:'团队 12 人，深圳+新加坡各一办公室', target:'海外团队 25 人（含本地茶师 3 位）', source:'内部台账' },
 scope: { actual:'原叶茶 + 茶具订阅，不做瓶装茶饮', target:'增加商务定制线，不进入商超袋泡茶', source:'战略规划' },
 products: { actual:'节气订阅 8 期/年，30g/期', target:'+ 商务礼盒 + 陶瓷联名茶具', source:'产品路线图' },
 customers:{ actual:'国内茶友社群为主', target:'东南亚 25-40 岁城市文化人群，女性占 60%', source:'用户调研' },
 supply: { actual:'复用母公司 12 位签约茶师', target:'新增东南亚本地陶艺师 5 位', source:'供应链' },
 performance: {
 share: { actual:'0（新进入）', target:'新加坡精品原叶茶 3%', source:'目标推导' },
 roi: { actual:'1.2', target:'首年 ROI 0.8，第三年 1.6', source:'近三年财报均值' },
 growth: { actual:'22%', target:'年增长 40%', source:'近三年财报均值' }
 }
 },
 competitors: [
 { id:'c1', name:'TWG Tea', price:'SGD 55-120/100g（超高端）',
 strengths:'百货专柜、奢华品牌认知、调香 SKU 丰富',
 weaknesses:'过度香水化、原叶纯度受质疑、年轻客群觉老气',
 position:'在文化叙事与原叶纯度上差异化，价格略低' },
 { id:'c2', name:'TEAMan', price:'SGD 28/80g（年轻拼配）',
 strengths:'社交媒体强、年轻客群、拼配创新',
 weaknesses:'缺乏产地深度、礼盒感弱',
 position:'以节气产地和茶具礼盒错位' },
 { id:'c3', name:'本地老字号茶庄', price:'中端散茶',
 strengths:'本地信任、价格亲民、线下客流',
 weaknesses:'无品牌叙事、包装陈旧、不懂数字营销',
 position:'用现代设计与订阅体验升级' },
 { id:'c4', name:'ITO EN', price:'瓶装茶 SGD 2-4',
 strengths:'渠道渗透、即饮便利',
 weaknesses:'非原叶体验、无文化溢价',
 position:'不直接竞争（不同场景）' },
 { id:'c5', name:'Aesthetic Tea Co.', price:'SGD 40-70/罐',
 strengths:'设计驱动、独立站成熟',
 weaknesses:'产地不透明、SKU 少',
 position:'以茶师溯源 AR 建立信任' }
 ],
 ourCapabilities: {
 delivery: '复用母公司供应链，工艺稳定但海外小批量灵活度待提升',
 core: 'AR 溯源小程序与可跳过订阅系统为技术长板',
 brand: '海外知名度为零，但中文文化叙事独特',
 customer: '国内私域成熟，海外渠道从零建设',
 compliance: '新加坡食品进口合规清晰，印尼清真认证待办',
 defensive: '12 位茶师 3 年独家 + 节气内容 IP',
 critical: '海外品牌零知名度，首单获客成本高',
 structural: '母公司资金支持可承担 18 个月亏损期',
 smileCurve: '设计+品牌+渠道占优，制造端为母公司复用，不构成劣势',
 trends: '节气营销、可追溯供应链、茶具订阅礼盒、KOC 内容种草、正念/慢生活运动'
 }
 },
 personas: [
 { id:'p1', name:'林慧怡', gender:'女', age:'28', occupation:'品牌经理',
 income:'SGD 75k/年', region:'新加坡',
 values:['品质','仪式感','可持续'],
 painPoints:'买茶不懂产地、害怕过度包装、送礼怕撞款',
 channels:['Instagram','小红书','Tang Plaza'],
 quote:'我愿意为故事和确定性付钱，但不要甜得发腻的拼配。',
 traits:{lifestyle:'都市中产、文化爱好者',cert:'INTJ'} },
 { id:'p2', name:'陈志明', gender:'男', age:'35', occupation:'科技公司总监',
 income:'MYR 180k/年', region:'吉隆坡',
 values:['效率','身份','健康'],
 painPoints:'商务赠礼缺文化品位、自己没时间挑茶',
 channels:['LinkedIn','WeChat','酒店礼宾'],
 quote:'一份能讲出产地和工艺的茶礼，比一瓶麦卡伦更得我心。',
 traits:{lifestyle:'高净值商务、时间紧',cert:'ENTJ'} },
 { id:'p3', name:'Ayu Lestari', gender:'女', age:'26', occupation:'自由设计师',
 income:'IDR 180m/年', region:'雅加达',
 values:['美学','社群','可持续'],
 painPoints:'找不到与华文化对话的非中餐场合、担心清真认证',
 channels:['TikTok','Behance','周末市集'],
 quote:'如果茶能像 ceramics 一样成为日常 art object，我会买。',
 traits:{lifestyle:'创意工作者、视觉优先',cert:'INFP'} },
 { id:'p4', name:'黄俊豪', gender:'男', age:'32', occupation:'金融分析师',
 income:'SGD 95k/年', region:'新加坡',
 values:['数据','效率','性价比'],
 painPoints:'订阅模式每月新口味难评估、怕踩雷浪费',
 channels:['Reddit','YouTube reviews','亚马逊'],
 quote:'我想要 SKU 透明到能查每一片叶子的产地。',
 traits:{lifestyle:'理性消费者、研究型',cert:'ISTJ'} },
 { id:'p5', name:'Ms. Lim', gender:'女', age:'42', occupation:'中学校长',
 income:'SGD 110k/年', region:'新加坡',
 values:['传承','教育','仪式'],
 painPoints:'学校茶文化活动缺好茶具、想给孩子做文化体验',
 channels:['WeChat','学校采购','童书展'],
 quote:'我希望孩子第一次接触茶，是美的、有故事的。',
 traits:{lifestyle:'教育者、家庭导向',cert:'ENFJ'} }
 ],
 scenarios: [
 { id:'s1', name:'送礼场景（商务/中秋）',
 personaIds:['p2','p5'],
 benefits:{usage:'专业级原叶冲泡体验',service:'礼宾包装与配送',staff:'无',image:'文化深度背书'},
 costs:{monetary:'SGD 200-500/盒',time:'15 分钟下单',energy:'选择疲劳',psychic:'怕失礼'},
 anchor:'区别于烟酒的可讲故事的礼品',
 decisiveGap:'-1.5（当前市场礼盒体验低于预期）' },
 { id:'s2', name:'自饮订阅（日常/办公室）',
 personaIds:['p1','p4'],
 benefits:{usage:'新茶每周轮换',service:'可跳过/暂停',staff:'无',image:'懂茶的人设'},
 costs:{monetary:'SGD 60-120/月',time:'0',energy:'无',psychic:'踩雷风险'},
 anchor:'省心 + 透明 + 可控',
 decisiveGap:'-0.8（订阅体验仍待打磨）' },
 { id:'s3', name:'社交/朋友聚会',
 personaIds:['p1','p3'],
 benefits:{usage:'能冲好一壶的茶具与茶叶套装',service:'节气卡 + 故事卡',staff:'无',image:'东方美学生活家'},
 costs:{monetary:'SGD 80-200/套',time:'5 分钟准备',energy:'需要讲解',psychic:'怕自己讲错'},
 anchor:'有故事可分享',
 decisiveGap:'+0.3（内容侧可补足）' }
 ],
 metrics: {
 dimensions: [
 { id:'m1', name:'品牌功效·产品', secondaries:[
 {id:'s1',name:'外观与质感', forecast:8.0, target:9.0, actual:8.6, measure:'专家盲评 1-10'},
 {id:'s2',name:'功能完整度', forecast:7.5, target:9.0, actual:8.2, measure:'盲评 + 客诉率 <2%'},
 {id:'s3',name:'品控稳定性', forecast:7.0, target:9.0, actual:8.4, measure:'同款复购率 >30%'} ]},
 { id:'m2', name:'品牌功效·技术', secondaries:[
 {id:'s4',name:'AR 溯源完成率', forecast:6.0, target:8.5, actual:7.2, measure:'扫码激活率 %'},
 {id:'s5',name:'订阅可跳过体验', forecast:7.0, target:9.0, actual:8.5, measure:'暂停/跳过操作成功率'},
 {id:'s6',name:'小程序加载时长', forecast:7.0, target:8.5, actual:8.0, measure:'P95 < 2s'} ]},
 { id:'m3', name:'品牌形象·知名度', secondaries:[
 {id:'s7',name:'主动识别率', forecast:5.0, target:7.5, actual:6.1, measure:'新加坡 CBD 街访 n=300'},
 {id:'s8',name:'搜索曝光', forecast:6.0, target:8.0, actual:7.4, measure:'Google Trends + IG 提及量'},
 {id:'s9',name:'垂类 KOL 引用', forecast:4.5, target:7.0, actual:5.8, measure:'合作/主动提及的茶/生活博主数'} ]},
 { id:'m4', name:'品牌形象·竞争地位', secondaries:[
 {id:'s10',name:'对标优势数', forecast:6.0, target:8.0, actual:7.3, measure:'vs TWG/TEAMan 的 5 维比较'},
 {id:'s11',name:'心智占位', forecast:5.5, target:7.5, actual:6.5, measure:'"节气+原叶"自由联想提及率'},
 {id:'s12',name:'价格合理性', forecast:7.0, target:8.5, actual:7.9, measure:'性价比评分 vs 5 家竞品'} ]},
 { id:'m5', name:'品牌形象·品牌传播', secondaries:[
 {id:'s13',name:'UGC 数量质量', forecast:5.0, target:8.0, actual:6.7, measure:'IG/小红书月 UGC 帖子数 + 平均互动'},
 {id:'s14',name:'KOL 主动推荐', forecast:4.0, target:7.5, actual:5.5, measure:'合作 KOL 二次主动提及率'},
 {id:'s15',name:'危机口碑', forecast:8.0, target:8.5, actual:8.2, measure:'负面事件数 / 响应时长'} ]}
 ],
 disclaimerAcknowledged: true
 },
 survey: {
 questions: [
 { id:'q1', type:'likert', text:'我信任这款茶的产地溯源', anchors:['完全不','不太','一般','比较','完全'], sourceIndicatorId:'s1' },
 { id:'q2', type:'likert', text:'这款茶的口感与香气让我满意', anchors:['完全不满','不太满','一般','比较满','非常满'], sourceIndicatorId:'s3' },
 { id:'q3', type:'likert', text:'包装设计传达了东方美学', anchors:['完全不符','不太符','一般','比较符','非常符'], sourceIndicatorId:'s2' },
 { id:'q4', type:'likert', text:'我认为这个品牌值得关注', anchors:['完全不值','不太值','一般','比较值','非常值'], sourceIndicatorId:'s7' },
 { id:'q5', type:'likert', text:'我会推荐给朋友或同事', anchors:['完全不','不太','一般','比较','非常'], sourceIndicatorId:'s13' },
 { id:'q6', type:'likert', text:'我愿意为这种茶付比本地茶更高的价格', anchors:['完全不愿','不太愿','中立','比较愿','非常愿'], sourceIndicatorId:'s12' },
 { id:'q7', type:'likert', text:'这个品牌让我想到节气与传统', anchors:['完全没','不太','一般','比较','非常'], sourceIndicatorId:'s11' },
 { id:'q8', type:'likert', text:'我认为溯源 AR 是真诚的而非噱头', anchors:['完全假','比较假','中立','比较真','非常真'], sourceIndicatorId:'s4' },
 { id:'q9', type:'likert', text:'订阅模式（可跳过）让我愿意尝试', anchors:['完全不愿','不太愿','中立','比较愿','非常愿'], sourceIndicatorId:'s5' },
 { id:'q10', type:'likert', text:'我愿意在商务场合送出这款茶礼', anchors:['完全不愿','不太愿','中立','比较愿','非常愿'], sourceIndicatorId:'s10' },
 { id:'q11', type:'open', text:'你希望这款茶能帮你完成什么样的场景或情绪？', anchors:null, sourceIndicatorId:null },
 { id:'q12', type:'open', text:'你认为我们最应该在哪个方面改进？', anchors:null, sourceIndicatorId:null }
 ],
 // 5 persona × 3 轮 × 10 likert = 150 entries
 responses: [
 // p1 林慧怡
 { personaId:'p1', answers:[
 {questionId:'q1', value:4, raw:'我会查 AR'},
 {questionId:'q2', value:4, raw:'原叶纯度好'},
 {questionId:'q3', value:5, raw:'设计很素雅'},
 {questionId:'q4', value:4, raw:'值得尝试'},
 {questionId:'q5', value:4, raw:'会推荐给闺蜜'},
 {questionId:'q6', value:3, raw:'比本地略贵但能接受'},
 {questionId:'q7', value:5, raw:'很节气'},
 {questionId:'q8', value:4, raw:'看起来真的'},
 {questionId:'q9', value:4, raw:'可跳过很贴心'},
 {questionId:'q10', value:3, raw:'会送朋友但不一定商务'} ]},
 { personaId:'p1', answers:[
 {questionId:'q1', value:5, raw:'看到茶师名字'},
 {questionId:'q2', value:4, raw:'第三泡仍香'},
 {questionId:'q3', value:5, raw:'陶瓷很赞'},
 {questionId:'q4', value:4, raw:'圈内口碑好'},
 {questionId:'q5', value:4, raw:'已发到 IG story'},
 {questionId:'q6', value:4, raw:'愿意'},
 {questionId:'q7', value:5, raw:'完全对应'},
 {questionId:'q8', value:5, raw:'看到茶师工作场景'},
 {questionId:'q9', value:4, raw:'暂停一月试试'},
 {questionId:'q10', value:4, raw:'客户来访时用'} ]},
 { personaId:'p1', answers:[
 {questionId:'q1', value:4, raw:'稳定'},
 {questionId:'q2', value:4, raw:'稳定'},
 {questionId:'q3', value:5, raw:'一贯'},
 {questionId:'q4', value:4, raw:'稳定'},
 {questionId:'q5', value:4, raw:'会推荐'},
 {questionId:'q6', value:3, raw:'保持'},
 {questionId:'q7', value:5, raw:'稳定'},
 {questionId:'q8', value:4, raw:'保持'},
 {questionId:'q9', value:4, raw:'继续'},
 {questionId:'q10', value:3, raw:'节日限定可试'} ]},

 // p2 陈志明
 { personaId:'p2', answers:[
 {questionId:'q1', value:5, raw:'茶师故事够了'},
 {questionId:'q2', value:4, raw:'比预想好'},
 {questionId:'q3', value:5, raw:'商务得体'},
 {questionId:'q4', value:4, raw:'有品位'},
 {questionId:'q5', value:4, raw:'已送 3 位客户'},
 {questionId:'q6', value:5, raw:'愿意为文化付'},
 {questionId:'q7', value:4, raw:'有文化'},
 {questionId:'q8', value:5, raw:'真的看到茶山'},
 {questionId:'q9', value:3, raw:'不订阅但愿意按盒买'},
 {questionId:'q10', value:5, raw:'客户收到很开心'} ]},
 { personaId:'p2', answers:[
 {questionId:'q1', value:5, raw:'产地视频很真'},
 {questionId:'q2', value:4, raw:'口感稳定'},
 {questionId:'q3', value:5, raw:'客户反馈正面'},
 {questionId:'q4', value:4, raw:'已记为备选'},
 {questionId:'q5', value:4, raw:'会推荐给同事'},
 {questionId:'q6', value:5, raw:'预算内'},
 {questionId:'q7', value:4, raw:'有节气说明'},
 {questionId:'q8', value:5, raw:'比酒有故事'},
 {questionId:'q9', value:3, raw:'商务场合不订阅'},
 {questionId:'q10', value:5, raw:'会继续送'} ]},
 { personaId:'p2', answers:[
 {questionId:'q1', value:5, raw:'长期信任建立'},
 {questionId:'q2', value:4, raw:'稳定'},
 {questionId:'q3', value:5, raw:'稳定'},
 {questionId:'q4', value:4, raw:'稳定'},
 {questionId:'q5', value:4, raw:'稳定推荐'},
 {questionId:'q6', value:5, raw:'稳定'},
 {questionId:'q7', value:4, raw:'稳定'},
 {questionId:'q8', value:5, raw:'稳定'},
 {questionId:'q9', value:3, raw:'维持按盒买'},
 {questionId:'q10', value:5, raw:'首选礼品'} ]},

 // p3 Ayu
 { personaId:'p3', answers:[
 {questionId:'q1', value:3, raw:'希望看到印尼本地合作'},
 {questionId:'q2', value:4, raw:'清香型适合我'},
 {questionId:'q3', value:5, raw:'视觉很美'},
 {questionId:'q4', value:3, raw:'还没形成品牌认知'},
 {questionId:'q5', value:3, raw:'会发到 Behance'},
 {questionId:'q6', value:2, raw:'对学生偏贵'},
 {questionId:'q7', value:4, raw:'跨文化节气有趣'},
 {questionId:'q8', value:3, raw:'希望印尼茶师也上 AR'},
 {questionId:'q9', value:2, raw:'单价订阅不适合我'},
 {questionId:'q10', value:2, raw:'商务场合少'} ]},
 { personaId:'p3', answers:[
 {questionId:'q1', value:3, raw:'希望有印尼溯源'},
 {questionId:'q2', value:4, raw:'稳定'},
 {questionId:'q3', value:5, raw:'陶瓷做 art 真的赞'},
 {questionId:'q4', value:3, raw:'缓慢建立'},
 {questionId:'q5', value:4, raw:'已发 IG 帖子'},
 {questionId:'q6', value:2, raw:'学生党仍贵'},
 {questionId:'q7', value:4, raw:'东方感'},
 {questionId:'q8', value:3, raw:'希望本地化'},
 {questionId:'q9', value:2, raw:'偶尔买不订阅'},
 {questionId:'q10', value:2, raw:'朋友间推荐'} ]},
 { personaId:'p3', answers:[
 {questionId:'q1', value:3, raw:'希望扩展产地'},
 {questionId:'q2', value:4, raw:'保持'},
 {questionId:'q3', value:5, raw:'设计保持'},
 {questionId:'q4', value:3, raw:'品牌仍年轻'},
 {questionId:'q5', value:4, raw:'持续推荐'},
 {questionId:'q6', value:2, raw:'学生维持'},
 {questionId:'q7', value:4, raw:'保持'},
 {questionId:'q8', value:3, raw:'希望本地合作'},
 {questionId:'q9', value:2, raw:'维持按盒'},
 {questionId:'q10', value:2, raw:'朋友间推荐'} ]},

 // p4 黄俊豪
 { personaId:'p4', answers:[
 {questionId:'q1', value:5, raw:'SKU 透明加分'},
 {questionId:'q2', value:4, raw:'数据驱动选茶'},
 {questionId:'q3', value:4, raw:'设计合理'},
 {questionId:'q4', value:4, raw:'理性认可'},
 {questionId:'q5', value:3, raw:'数据上推荐'},
 {questionId:'q6', value:3, raw:'可接受'},
 {questionId:'q7', value:3, raw:'营销话术中文化'},
 {questionId:'q8', value:5, raw:'溯源真'},
 {questionId:'q9', value:4, raw:'可跳过适合我'},
 {questionId:'q10', value:2, raw:'商务场合少'} ]},
 { personaId:'p4', answers:[
 {questionId:'q1', value:5, raw:'批次号能查'},
 {questionId:'q2', value:4, raw:'稳定'},
 {questionId:'q3', value:4, raw:'设计不错'},
 {questionId:'q4', value:4, raw:'稳定'},
 {questionId:'q5', value:3, raw:'会推荐数据型读者'},
 {questionId:'q6', value:3, raw:'合理'},
 {questionId:'q7', value:3, raw:'节气是文化资本'},
 {questionId:'q8', value:5, raw:'技术是真的'},
 {questionId:'q9', value:4, raw:'暂停功能很关键'},
 {questionId:'q10', value:2, raw:'维持'} ]},
 { personaId:'p4', answers:[
 {questionId:'q1', value:5, raw:'持续信任'},
 {questionId:'q2', value:4, raw:'稳定'},
 {questionId:'q3', value:4, raw:'稳定'},
 {questionId:'q4', value:4, raw:'稳定'},
 {questionId:'q5', value:3, raw:'持续'},
 {questionId:'q6', value:3, raw:'稳定'},
 {questionId:'q7', value:3, raw:'理性看文化'},
 {questionId:'q8', value:5, raw:'稳定'},
 {questionId:'q9', value:4, raw:'稳定'},
 {questionId:'q10', value:2, raw:'维持'} ]},

 // p5 Ms. Lim
 { personaId:'p5', answers:[
 {questionId:'q1', value:5, raw:'教孩子必备'},
 {questionId:'q2', value:4, raw:'不苦适合小孩'},
 {questionId:'q3', value:5, raw:'可以入课堂'},
 {questionId:'q4', value:4, raw:'文化品牌定位好'},
 {questionId:'q5', value:5, raw:'家长会必推荐'},
 {questionId:'q6', value:4, raw:'教育预算内'},
 {questionId:'q7', value:5, raw:'节气教学配套'},
 {questionId:'q8', value:4, raw:'能讲解'},
 {questionId:'q9', value:3, raw:'学校订按学期'},
 {questionId:'q10', value:5, raw:'节庆必送'} ]},
 { personaId:'p5', answers:[
 {questionId:'q1', value:5, raw:'已用一学期'},
 {questionId:'q2', value:4, raw:'稳定'},
 {questionId:'q3', value:5, raw:'学生很喜欢'},
 {questionId:'q4', value:4, raw:'家长认可'},
 {questionId:'q5', value:5, raw:'已推荐 2 所学校'},
 {questionId:'q6', value:4, raw:'教育优先'},
 {questionId:'q7', value:5, raw:'配套完整'},
 {questionId:'q8', value:4, raw:'AR 教学有效'},
 {questionId:'q9', value:3, raw:'学期订阅制'},
 {questionId:'q10', value:5, raw:'教师节首选'} ]},
 { personaId:'p5', answers:[
 {questionId:'q1', value:5, raw:'持续'},
 {questionId:'q2', value:4, raw:'稳定'},
 {questionId:'q3', value:5, raw:'持续'},
 {questionId:'q4', value:4, raw:'稳定'},
 {questionId:'q5', value:5, raw:'持续推荐'},
 {questionId:'q6', value:4, raw:'稳定'},
 {questionId:'q7', value:5, raw:'稳定'},
 {questionId:'q8', value:4, raw:'稳定'},
 {questionId:'q9', value:3, raw:'稳定'},
 {questionId:'q10', value:5, raw:'持续'} ]}
 ],
 n: 150,
 status: 'done',
 mode: 'api',
 useFewShot: true,
 useRag: false,
 ragContext: '',
 progress: { done: 15, total: 15 },
 error: null,
 _doneKeys: ['p1-0','p1-1','p1-2','p2-0','p2-1','p2-2','p3-0','p3-1','p3-2','p4-0','p4-1','p4-2','p5-0','p5-1','p5-2']
 },
 analysis: {
 likertStats: {
 q1: { mean: 4.4, sd: 0.7, dist:[0,0,1,4,10], n:15 },
 q2: { mean: 4.0, sd: 0.4, dist:[0,0,0,14,1], n:15 },
 q3: { mean: 4.8, sd: 0.4, dist:[0,0,0,4,11], n:15 },
 q4: { mean: 3.9, sd: 0.5, dist:[0,0,1,13,1], n:15 },
 q5: { mean: 3.9, sd: 0.7, dist:[0,0,2,11,2], n:15 },
 q6: { mean: 3.3, sd: 1.0, dist:[0,1,7,7,0], n:15 },
 q7: { mean: 4.3, sd: 0.7, dist:[0,0,2,7,6], n:15 },
 q8: { mean: 4.2, sd: 0.8, dist:[0,0,2,9,4], n:15 },
 q9: { mean: 3.4, sd: 1.0, dist:[0,2,6,6,1], n:15 },
 q10:{ mean: 3.4, sd: 1.4, dist:[0,4,2,6,3], n:15 }
 },
 openThemes: [
 { questionId:'q11', question:'你希望这款茶能帮你完成什么样的场景或情绪？',
 texts:[
 '周末一个人安静读书时',
 '给客户讲文化的开场',
 '朋友来家做客',
 '给孩子做节气课',
 '下午办公室仪式感',
 '生日礼物想要有心意',
 '送父母他们会觉得洋气',
 '商务晚宴的伴手礼'
 ],
 themes:[
 {label:'独处仪式', count:3},
 {label:'社交分享', count:2},
 {label:'商务礼赠', count:2},
 {label:'家庭传承', count:2}
 ],
 quotes:[
 '周末一个人安静读书时',
 '给客户讲文化的开场',
 '生日礼物想要有心意'
 ]},
 { questionId:'q12', question:'你认为我们最应该在哪个方面改进？',
 texts:[
 '希望有印尼本地合作茶师',
 '单价对学生偏贵',
 '希望茶具能单卖',
 'AR 操作不够简单',
 '小包装更环保',
 '希望节气课程进入学校',
 '希望增加冷泡选项',
 '希望提供更详细冲泡指南'
 ],
 themes:[
 {label:'本地化扩展', count:3},
 {label:'价格梯度', count:2},
 {label:'教学/分享场景', count:2},
 {label:'可持续包装', count:1}
 ],
 quotes:[
 '希望有印尼本地合作茶师',
 '希望节气课程进入学校',
 '希望提供更详细冲泡指南'
 ]}
 ],
 indicatorMeans: [
 {label:'AR 溯源完成率', value:7.2, mean:7.2, sourceIndicatorId:'s4'},
 {label:'主动识别率', value:6.1, mean:6.1, sourceIndicatorId:'s7'},
 {label:'订阅可跳过体验', value:8.5, mean:8.5, sourceIndicatorId:'s5'},
 {label:'心智占位', value:6.5, mean:6.5, sourceIndicatorId:'s11'},
 {label:'价格合理性', value:7.9, mean:7.9, sourceIndicatorId:'s12'},
 {label:'KOL 主动推荐', value:5.5, mean:5.5, sourceIndicatorId:'s14'}
 ],
 insights: '1. 包装设计（4.8）与原叶稳定（4.0）是全体画像共识长板，"东方美学"在年轻客群与教育客群中均高赞。\n2. 价格接受度（3.3）显著低于文化认可度（4.3），需以"节气入门款"或"学生装"降低门槛。\n3. 主动识别率（6.1）偏低，是品牌进入 18 个月内最大瓶颈——3 名 persona 在 3 轮中均未明显提升。\n4. 商务礼赠（q10 = 3.4）分化明显：教育客群极高分（5），学生/设计客群极低分（2）。\n5. AR 溯源（4.2）"真诚度"判断高，但印尼客群希望本地化（建议拓展印尼合作茶师）。\n6. 订阅可跳过（q9 = 3.4）整体中性偏正，可继续作为差异化卖点。'
 },
 values: {
 functional: [
 {value:'原叶纯度 1-3 泡仍香', evidence:'品控稳定 8.4/10, 复购率 32%', priority:'P0'},
 {value:'AR 溯源让每一片叶子可查', evidence:'溯源真诚度 4.2/5, 完成率 7.2/10', priority:'P0'},
 {value:'节气茶单每年 8 期不重复', evidence:'8 期内容 IP 是母公司 12 位茶师独家', priority:'P1'}
 ],
 emotional: [
 {value:'慢生活的仪式感', evidence:'p1/p5 反复提及"安静/独处/仪式"', priority:'P0'},
 {value:'确定性的来源感', evidence:'p4 评分最高的就是"批次号能查"', priority:'P0'}
 ],
 social: [
 {value:'文化深度社交货币', evidence:'p2 商务礼赠 5/5, "讲故事的礼品"', priority:'P0'},
 {value:'东方美学人设', evidence:'p1 包装设计 5/5 + "素雅"评价', priority:'P1'}
 ],
 epistemic: [
 {value:'茶师/产地/工艺的可学知识', evidence:'p5 "教孩子"动机, 学校推荐', priority:'P1'}
 ],
 conditional: [
 {value:'商务场景的"得体"替代品', evidence:'中秋/教师节/客户拜访', priority:'P0'},
 {value:'节气时令的"应景"消费', evidence:'8 期订阅 + 节气配套卡', priority:'P1'}
 ],
 chosenFunctional: '原叶纯度 1-3 泡仍香',
 chosenEmotional: '慢生活的仪式感',
 chosenSocial: '文化深度社交货币',
 chosenEpistemic: '茶师/产地/工艺的可学知识',
 chosenConditional:'商务场景的"得体"替代品'
 }
 };

 if(typeof window!== 'undefined') window.__case_shanmu_tea_work1 = data;
})();
