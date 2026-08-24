/* ============================================================
 shanmu-tea / work3 — 价值主张与定位 (T09 filled)
 ============================================================ */
(function(){
 const data = {
 context: {
 sbuName: '山木茶事 Shanmu Tea',
 targetMarket: '新加坡 (首阶段), 36 月后扩展至吉隆坡',
 personas: ['p1','p2','p3','p4','p5'],
 hasSurvey: true
 },
 mining: {
 documents: [
 // 来自 work1.analysis.openThemes.texts 的 16 条 + 几条额外推文
 '周末一个人安静读书时',
 '给客户讲文化的开场',
 '朋友来家做客',
 '给孩子做节气课',
 '下午办公室仪式感',
 '生日礼物想要有心意',
 '送父母他们会觉得洋气',
 '商务晚宴的伴手礼',
 '希望有印尼本地合作茶师',
 '单价对学生偏贵',
 '希望茶具能单卖',
 'AR 操作不够简单',
 '小包装更环保',
 '希望节气课程进入学校',
 '希望增加冷泡选项',
 '希望提供更详细冲泡指南',
 '我愿意为故事和确定性付钱',
 '一份能讲出产地和工艺的茶礼',
 '如果茶能像 ceramics 一样成为日常 art object',
 '我想要 SKU 透明到能查每一片叶子的产地'
 ],
 includeWork1Open: true,
 includeWork1Themes: true,
 ldaParams: { k: 4, passes: 15, iterations: 100, no_below: 2, no_above: 0.5 },
 ldaResult: null,
 ldaError: null,
 topics: [
 { id:0, label:'节气饮茶', share:32, keywords:[
 {word:'节气', weight:0.12}, {word:'仪式', weight:0.08}, {word:'茶师', weight:0.07},
 {word:'产地', weight:0.06}, {word:'订阅', weight:0.05}, {word:'溯源', weight:0.05},
 {word:'学生', weight:0.04}, {word:'课程', weight:0.04}, {word:'学校', weight:0.03},
 {word:'孩子', weight:0.03}, {word:'教育', weight:0.03}, {word:'传承', weight:0.03}
 ], representative_docs:[
 '给孩子做节气课', '下午办公室仪式感', '我愿意为故事和确定性付钱'
 ] },
 { id:1, label:'商务礼赠', share:28, keywords:[
 {word:'礼', weight:0.10}, {word:'商务', weight:0.09}, {word:'客户', weight:0.08},
 {word:'故事', weight:0.06}, {word:'文化', weight:0.06}, {word:'价格', weight:0.05},
 {word:'生日', weight:0.04}, {word:'送父母', weight:0.04}, {word:'晚宴', weight:0.04},
 {word:'心意', weight:0.03}, {word:'朋友', weight:0.03}, {word:'透明', weight:0.03}
 ], representative_docs:[
 '给客户讲文化的开场', '商务晚宴的伴手礼', '生日礼物想要有心意'
 ] },
 { id:2, label:'美学与社群', share:24, keywords:[
 {word:'设计', weight:0.10}, {word:'美学', weight:0.08}, {word:'陶瓷', weight:0.07},
 {word:'艺术', weight:0.06}, {word:'东方', weight:0.05}, {word:'朋友', weight:0.04},
 {word:'聚会', weight:0.04}, {word:'茶具', weight:0.04}, {word:'本地', weight:0.04},
 {word:'印度尼西亚', weight:0.03}, {word:'雅加达', weight:0.03}, {word:'视觉', weight:0.03}
 ], representative_docs:[
 '朋友来家做客', '希望茶具能单卖', '如果茶能像 ceramics 一样成为日常 art object'
 ] },
 { id:3, label:'操作与可及性', share:16, keywords:[
 {word:'AR', weight:0.08}, {word:'操作', weight:0.06}, {word:'小包装', weight:0.05},
 {word:'冷泡', weight:0.05}, {word:'指南', weight:0.05}, {word:'冲泡', weight:0.05},
 {word:'环保', weight:0.04}, {word:'跳过', weight:0.04}, {word:'可承受', weight:0.04},
 {word:'学生', weight:0.04}, {word:'价位', weight:0.04}, {word:'详细', weight:0.03}
 ], representative_docs:[
 'AR 操作不够简单', '小包装更环保', '希望提供更详细冲泡指南'
 ] }
 ],
 wordFreqTop: [
 {word:'节气', count:7}, {word:'仪式', count:5}, {word:'故事', count:5},
 {word:'设计', count:5}, {word:'商务', count:4}, {word:'产地', count:4},
 {word:'AR', count:3}, {word:'陶瓷', count:3}, {word:'订阅', count:3}
 ],
 stats: { raw_count: 20, valid_count: 20, total_words: 380, vocab_size: 142, coherence: 0.52 },
 painMap: [
 { id:'pm1', pain:'对文化礼赠缺乏既得体又有故事的选择', evidence:'p2 "商务赠礼缺文化品位" / p5 "教师节首选"',
 frequency:5, linkedNeeds:['n1','n3'], linkedTopicId:1, type:'痒点' },
 { id:'pm2', pain:'日常没有"小确幸"仪式感', evidence:'p1 "周末读书时" / p3 "日常 art object"',
 frequency:4, linkedNeeds:['n1','n2'], linkedTopicId:0, type:'痒点' },
 { id:'pm3', pain:'市面茶礼包装过度/拼配甜腻', evidence:'p1 "不要甜得发腻" / 行业评论',
 frequency:3, linkedNeeds:['n1','n3'], linkedTopicId:1, type:'痛点' },
 { id:'pm4', pain:'孩子/学校接触不到好茶文化', evidence:'p5 "学校茶文化活动缺好茶具"',
 frequency:3, linkedNeeds:['n2','n4'], linkedTopicId:0, type:'痛点' },
 { id:'pm5', pain:'AR/订阅等数字化体验门槛高', evidence:'p3 "AR 操作不够简单" / p4 "想评估订阅"',
 frequency:3, linkedNeeds:['n5'], linkedTopicId:3, type:'痛点' },
 { id:'pm6', pain:'学生/年轻创作者价格门槛高', evidence:'p3 "对学生偏贵"',
 frequency:2, linkedNeeds:['n1'], linkedTopicId:3, type:'痛点' }
 ]
 },
 candidates: [
 { id:'ca1', text:'节气可溯源的原叶茶礼', basedOn:['pm1','pm2','pm3'],
 desirabilityScore: 8.5, implementabilityScore: 8.0,
 desiredBy:['p1','p2','p5'], competitiveEdge:'TWG 无溯源, TEAMan 无节气, 本地老字号无品牌' },
 { id:'ca2', text:'东方美学可分享的茶具+茶套装', basedOn:['pm2','pm4'],
 desirabilityScore: 7.0, implementabilityScore: 6.5,
 desiredBy:['p1','p3','p5'], competitiveEdge:'陶瓷联名 IP, 故事卡 + 冲泡指南' },
 { id:'ca3', text:'可跳过 + 可查 + 可学的订阅', basedOn:['pm5','pm6'],
 desirabilityScore: 6.5, implementabilityScore: 7.5,
 desiredBy:['p1','p4'], competitiveEdge:'可跳过 + 批次号透明 + 学生价' }
 ],
 dimensions: {
 desirability: (typeof Work3!== 'undefined' && Work3.DEFAULT_DESIRABILITY_DIMS)
? Work3.DEFAULT_DESIRABILITY_DIMS.map(d => ({...d}))
: [
 {key:'consumerPull', label:'消费者拉力', weight:0.3},
 {key:'cultural', label:'文化资本', weight:0.25},
 {key:'category', label:'品类契合', weight:0.25},
 {key:'substitution', label:'不可替代性', weight:0.2}
 ],
 implementability: (typeof Work3!== 'undefined' && Work3.DEFAULT_IMPLEMENTABILITY_DIMS)
? Work3.DEFAULT_IMPLEMENTABILITY_DIMS.map(d => ({...d}))
: [
 {key:'internal', label:'内部能力匹配', weight:0.35},
 {key:'partner', label:'伙伴生态', weight:0.25},
 {key:'capital', label:'资金可承受', weight:0.2},
 {key:'time', label:'时间窗口', weight:0.2}
 ]
 },
 matrix: { showSector:true, sectorAngle:90, sectorRadius:12, xCut:7, yCut:7, manualSelected:['ca1'] },
 migration: {
 analyses: [
 { from:'TWG 客户', to:'ca1', reason:'同价位, 山木补足溯源+节气+东方美学', cost:5 },
 { from:'本地老字号', to:'ca1', reason:'升级为品牌叙事+订阅体验', cost:7 },
 { from:'咖啡用户', to:'ca2', reason:'茶具+茶套装作为"东方咖啡"日常替代', cost:8 }
 ]
 },
 proposition: {
 coreValueIds:['ca1'],
 alternatives:['ca2','ca3'],
 chosenValueText: '节气可溯源的原叶茶礼——给愿意为故事付钱的城市文化人',
 positioning: {
 brand: '山木茶事',
 audience: '25-40 岁东南亚城市华人/文化爱好者, 愿为故事与确定性付钱',
 coreValue: '节气 + 可溯源 + 东方美学 + 可分享',
 category: '高端原叶茶 + 茶具订阅'
 },
 positioningStatement: '对于 25-40 岁、追求仪式感与确定性的东南亚城市华人, 山木茶事是唯一一个用 8 期节气茶单 + AR 茶师溯源 + 东方美学茶具, 让"送礼与自饮都讲得出故事"的高端原叶茶品牌。',
 sloganOptions: [
 {text:'节气可溯源, 茶有故事', source:'agent'},
 {text:'一片叶子, 一年节气', source:'user'},
 {text:'每一杯, 都有茶师签名', source:'user'},
 {text:'有故事的茶, 给讲得出门的你', source:'agent'}
 ],
 chosenSlogan: '节气可溯源, 茶有故事',
 mbti: 'INFJ (顾问型 — 偏安静、文化深度、长期主义)',
 personalityTraits: ['真实','有故事','有距离感','东方','可信赖','可持续']
 }
 };

 if(typeof window!== 'undefined') window.__case_shanmu_tea_work3 = data;
})();
