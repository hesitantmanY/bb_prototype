/* ============================================================
 wenqu-shuyuan / work3 — 价值主张与定位 (T09 filled)
 形状严格匹配 Work3.defaultData()。
 ============================================================ */
(function(){
  const data = {
    context: {
      sbuName: '问渠书院',
      targetMarket: '大学生/职场新人 + K12 老客续费',
      personas: [
        { id:'p1', name:'李姐', painPoints:'孩子学习兴趣低、效果难量化' },
        { id:'p2', name:'小王', painPoints:'简历没亮点、面试总被拒' },
        { id:'p3', name:'张姐', painPoints:'30+ 转行难、培训机构套路多' }
      ],
      hasSurvey: true
    },
    mining: {
      documents: [
        '问渠书院的老师很负责，孩子学了一年进步很大。',
        '我家娃学了编程后，学校选拔被选上了。',
        '职业课能不能给个作品集，面试用得上？',
        '我同学在开课吧学完没找到工作，不敢去。',
        '30+ 转行很难，培训机构都收割焦虑。',
        '希望有试听课，先看看老师讲得怎么样。',
        '线上学不会，能去线下校区吗？',
        '老学员推荐有优惠吗？',
        '问渠的美术课不错，孩子喜欢。',
        '口才课老师换了三次，娃都不想学了。'
      ],
      includeWork1Open: true,
      includeWork1Themes: true,
      ldaParams: { k: 3, passes: 15, iterations: 100, no_below: 2, no_above: 0.5 },
      ldaResult: null,
      ldaError: null,
      topics: [
        { id:0, label:'老师稳定与教学效果', share:42, keywords:[
          {word:'老师',weight:0.10},{word:'负责',weight:0.07},{word:'进步',weight:0.06},{word:'学完',weight:0.05},{word:'喜欢',weight:0.04}
        ], representative_docs:['问渠书院的老师很负责','口才课老师换了三次'] },
        { id:1, label:'就业与作品集', share:33, keywords:[
          {word:'就业',weight:0.09},{word:'作品集',weight:0.07},{word:'面试',weight:0.06},{word:'简历',weight:0.05},{word:'找不到',weight:0.04}
        ], representative_docs:['职业课能不能给个作品集','我同学学完没找到工作'] },
        { id:2, label:'转行焦虑与试听', share:25, keywords:[
          {word:'转行',weight:0.08},{word:'30+',weight:0.06},{word:'焦虑',weight:0.06},{word:'试听',weight:0.05},{word:'推荐',weight:0.04}
        ], representative_docs:['30+ 转行很难','希望有试听课'] }
      ],
      wordFreqTop: [
        {word:'老师',count:5},{word:'就业',count:3},{word:'作品',count:3},{word:'转行',count:2},{word:'进步',count:2},
        {word:'试听',count:2},{word:'推荐',count:2},{word:'面试',count:2},{word:'简历',count:2},{word:'孩子',count:2}
      ],
      stats: { raw_count: 10, valid_count: 10, total_words: 145, vocab_size: 40, coherence: 0.43 },
      painMap: [
        { id:'pa1', pain:'老师频繁更换，学员粘性下降', evidence:'口才课老师换了三次',
          frequency:'高', linkedNeeds:['老师稳定','师徒制'], linkedTopicId:0, type:'痛点' },
        { id:'pa2', pain:'职业课缺作品集，面试无亮点', evidence:'职业课能不能给个作品集',
          frequency:'高', linkedNeeds:['实战项目','作品墙'], linkedTopicId:1, type:'痛点' },
        { id:'pa3', pain:'培训机构套路多，就业兑现差', evidence:'我同学学完没找到工作',
          frequency:'中', linkedNeeds:['就业案例','合作企业'], linkedTopicId:1, type:'痛点' },
        { id:'pa4', pain:'30+ 转行难，无试听难决策', evidence:'30+ 转行很难，希望有试听课',
          frequency:'中', linkedNeeds:['试听课','职业规划'], linkedTopicId:2, type:'痛点' },
        { id:'pa5', pain:'效果难量化，家长无感知', evidence:'效果难量化，孩子进步看不见',
          frequency:'中', linkedNeeds:['学习报告','学员成长档案'], linkedTopicId:0, type:'痒点' }
      ]
    },
    candidates: [
      { id:'c1', name:'老师稳定承诺', pain:'老师流失',
        description:'5 年老师平均司龄+师徒制+教务关怀，承诺 1 年内不换老师',
        evidence:'10 篇评论中 5 篇提及老师',
        desirabilityScore: 9.0, implementabilityScore: 8.7,
        desiredBy:['p1','p2','p3'], competitiveEdge:'5 年老师司龄 + 师徒制承诺' },
      { id:'c2', name:'学员作品集+作品墙', pain:'面试无亮点',
        description:'每期课产出 3-5 个实战作品，作品墙上墙+小程序可看',
        evidence:'3 篇评论提及作品集',
        desirabilityScore: 9.0, implementabilityScore: 7.7,
        desiredBy:['p1','p2','p3'], competitiveEdge:'作品墙可视化 + 实战项目' },
      { id:'c3', name:'就业推荐+合作企业', pain:'兑现差',
        description:'与本地 3-5 家企业签就业协议，学员毕业内推+就业社群',
        evidence:'2 篇评论提及就业',
        desirabilityScore: 8.7, implementabilityScore: 7.3,
        desiredBy:['p2','p3'], competitiveEdge:'本地合作企业内推 + 就业社群' },
      { id:'c4', name:'小程序学习报告', pain:'效果难量化',
        description:'每节课后生成学习报告，阶段评估+老师点评+成长档案',
        evidence:'内部策略，无评论',
        desirabilityScore: 8.3, implementabilityScore: 7.7,
        desiredBy:['p1','p3'], competitiveEdge:'小程序学习报告 + 老师点评' }
    ],
    dimensions: {
      desirability: (typeof Work3!== 'undefined' && Work3.DEFAULT_DESIRABILITY_DIMS)
        ? Work3.DEFAULT_DESIRABILITY_DIMS.map(d => ({...d}))
        : [
          {key:'importance', label:'重要性', weight:0.4},
          {key:'uniqueness', label:'独特性', weight:0.3},
          {key:'credibility', label:'可信度', weight:0.3}
        ],
      implementability: (typeof Work3!== 'undefined' && Work3.DEFAULT_IMPLEMENTABILITY_DIMS)
        ? Work3.DEFAULT_IMPLEMENTABILITY_DIMS.map(d => ({...d}))
        : [
          {key:'feasibility', label:'可行性', weight:0.4},
          {key:'communicability', label:'传播力', weight:0.3},
          {key:'sustainability', label:'持续性', weight:0.3}
        ]
    },
    matrix: { showSector:true, sectorAngle:90, sectorRadius:12, xCut:7, yCut:7, manualSelected:['c1','c2'] },
    migration: {
      analyses: [
        { from:'编程猫客户', to:'c1', reason:'同价更高, 问渠老师更稳定', cost:5 },
        { from:'开课吧客户', to:'c3', reason:'开课吧暴雷, 问渠就业推荐更可信', cost:7 },
        { from:'三节课客户', to:'c2', reason:'作品集可视化弥补线上弱体验', cost:6 }
      ]
    },
    proposition: {
      coreValueIds:['c1','c2','c3','c4'],
      alternatives:[
        {id:'a1', text:'老师稳定，成长可见。'},
        {id:'a2', text:'学得会，找得到。'},
        {id:'a3', text:'问渠书院，成长陪伴。'}
      ],
      chosenValueText: '问渠书院，成长陪伴。',
      positioning: {
        brand: '问渠书院',
        audience: '4-18 岁 K12 学员+18+ 大学生/职场新人/转行者',
        coreValue: '老师稳定+作品集+就业推荐+学习报告',
        category: '浙江素质+职业培训专业品牌'
      },
      positioningStatement: '对于 4-18 岁 K12 学员与 18+ 大学生/职场新人/转行者, 问渠书院是唯一一个用 5 年老师稳定承诺 + 学员作品集 + 本地企业就业推荐 + 小程序学习报告, 让"成长陪伴"从少儿延续到成人的浙江素质+职业培训专业品牌。',
      sloganOptions: [
        {text:'老师稳定，成长可见', source:'agent'},
        {text:'学得会，找得到', source:'user'},
        {text:'问渠书院，成长陪伴', source:'user'}
      ],
      chosenSlogan: '问渠书院，成长陪伴',
      mbti: 'ISFJ (守护者型 — 偏陪伴、稳定、长期主义)',
      personalityTraits: ['陪伴','稳定','专业','温暖','成长']
    }
  };

  if(typeof window!== 'undefined') window.__case_wenqu_shuyuan_work3 = data;
})();
