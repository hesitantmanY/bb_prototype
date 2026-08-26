/* ============================================================
 maohaizi-house / work3 — 价值主张与定位 (T09 filled)
 形状严格匹配 Work3.defaultData()。
 ============================================================ */
(function(){
  const data = {
    context: {
      sbuName: '毛孩子之家',
      targetMarket: '成都核心 90/95 后+家庭客+出差寄养客',
      personas: [
        { id:'p1', name:'小敏', painPoints:'猫应激反应、洗护师不专业' },
        { id:'p2', name:'赵姐', painPoints:'寄养不放心、价格不透明' },
        { id:'p3', name:'Andy', painPoints:'出差寄养、找不到靠谱店' }
      ],
      hasSurvey: true
    },
    mining: {
      documents: [
        '毛孩子之家的洗护师很温柔，我家猫不害怕。',
        '实时直播看着放心，铲屎官出门心里踏实。',
        '希望洗护师都持证上岗，CKU 认证的更专业。',
        '无应激环境做到了，猫主子不再炸毛。',
        '联名宠物摄影不错，可以和洗护打包。',
        '会员月卡能不能跨店通用？',
        '出差寄养能不能接送？',
        '美团/大众点评的 5 折券用着划算。',
        '希望有"科学养宠"内容更新，公众号不错。',
        '洗护师穿统一服装，专业感强。'
      ],
      includeWork1Open: true,
      includeWork1Themes: true,
      ldaParams: { k: 3, passes: 15, iterations: 100, no_below: 2, no_above: 0.5 },
      ldaResult: null,
      ldaError: null,
      topics: [
        { id:0, label:'专业洗护与无应激', share:40, keywords:[
          {word:'洗护师',weight:0.10},{word:'CKU',weight:0.08},{word:'无应激',weight:0.07},{word:'专业',weight:0.06},{word:'温柔',weight:0.05}
        ], representative_docs:['洗护师很温柔','CKU 认证的更专业'] },
        { id:1, label:'实时直播与寄养', share:35, keywords:[
          {word:'直播',weight:0.10},{word:'寄养',weight:0.08},{word:'放心',weight:0.07},{word:'出差',weight:0.06},{word:'接送',weight:0.05}
        ], representative_docs:['实时直播看着放心','出差寄养能不能接送'] },
        { id:2, label:'会员与异业', share:25, keywords:[
          {word:'会员',weight:0.09},{word:'月卡',weight:0.07},{word:'联名',weight:0.06},{word:'摄影',weight:0.05},{word:'跨店',weight:0.04}
        ], representative_docs:['会员月卡能不能跨店通用','联名宠物摄影不错'] }
      ],
      wordFreqTop: [
        {word:'洗护师',count:4},{word:'直播',count:4},{word:'无应激',count:3},{word:'会员',count:3},{word:'CKU',count:2},
        {word:'寄养',count:2},{word:'月卡',count:2},{word:'联名',count:2},{word:'专业',count:2},{word:'接送',count:2}
      ],
      stats: { raw_count: 10, valid_count: 10, total_words: 150, vocab_size: 43, coherence: 0.45 },
      painMap: [
        { id:'pa1', pain:'洗护师专业度参差不齐，缺统一认证', evidence:'希望洗护师都持证上岗',
          frequency:'高', linkedNeeds:['CKU 认证','统一培训'], linkedTopicId:0, type:'痛点' },
        { id:'pa2', pain:'寄养透明度不足，缺实时直播', evidence:'实时直播看着放心',
          frequency:'高', linkedNeeds:['24h 直播','每日反馈'], linkedTopicId:1, type:'痛点' },
        { id:'pa3', pain:'出差寄养缺接送服务', evidence:'出差寄养能不能接送',
          frequency:'中', linkedNeeds:['接送服务','一站式'], linkedTopicId:1, type:'痛点' },
        { id:'pa4', pain:'会员月卡不能跨店通用', evidence:'会员月卡能不能跨店通用',
          frequency:'中', linkedNeeds:['跨店通用','会员体系'], linkedTopicId:2, type:'痛点' },
        { id:'pa5', pain:'洗护+摄影不能组合，缺粘性', evidence:'联名宠物摄影可以打包',
          frequency:'中', linkedNeeds:['洗护+摄影组合','联名 IP'], linkedTopicId:2, type:'痒点' }
      ]
    },
    candidates: [
      { id:'c1', name:'洗护师 CKU 认证', pain:'专业度参差',
        description:'全员 CKU/NGKC 认证+统一培训+着装规范',
        evidence:'10 篇评论中 4 篇提及洗护师',
        desirabilityScore: 9.0, implementabilityScore: 8.7,
        desiredBy:['p1','p2','p3'], competitiveEdge:'CKU/NGKC 全员认证' },
      { id:'c2', name:'无应激低噪环境', pain:'猫应激',
        description:'独立单宠用具+低噪设备+渐进式洗护+专业安抚',
        evidence:'3 篇评论提及无应激',
        desirabilityScore: 8.3, implementabilityScore: 7.7,
        desiredBy:['p1','p3'], competitiveEdge:'单宠独立用具 + 渐进式安抚' },
      { id:'c3', name:'实时寄养直播+24h 监控', pain:'寄养不放心',
        description:'24h 实时直播+每日视频反馈+健康检查',
        evidence:'4 篇评论提及直播',
        desirabilityScore: 9.3, implementabilityScore: 9.0,
        desiredBy:['p1','p2','p3'], competitiveEdge:'24h 直播 + 视频反馈' },
      { id:'c4', name:'联名宠物摄影', pain:'缺粘性',
        description:'与本地摄影机构联名，洗护+摄影组合套餐',
        evidence:'2 篇评论提及联名',
        desirabilityScore: 6.3, implementabilityScore: 8.0,
        desiredBy:['p1'], competitiveEdge:'联名摄影 + 洗护组合' }
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
    matrix: { showSector:true, sectorAngle:90, sectorRadius:12, xCut:7, yCut:7, manualSelected:['c1','c3'] },
    migration: {
      analyses: [
        { from:'新瑞鹏客户', to:'c1', reason:'新瑞鹏重医疗, 毛孩子之家重洗护师认证', cost:5 },
        { from:'宠物家客户', to:'c3', reason:'24h 直播差异化, 毛孩子之家更有温度', cost:6 },
        { from:'圣宠客户', to:'c1', reason:'CKU 认证体系比区域品牌更标准', cost:4 }
      ]
    },
    proposition: {
      coreValueIds:['c1','c2','c3','c4'],
      alternatives:[
        {id:'a1', text:'毛孩子放心，毛孩子之家。'},
        {id:'a2', text:'专业洗护，实时直播。'},
        {id:'a3', text:'科学养宠，从洗护开始。'}
      ],
      chosenValueText: '毛孩子放心，毛孩子之家。',
      positioning: {
        brand: '毛孩子之家',
        audience: '90/95 后新手铲屎官+二线家庭客+出差/旅行寄养客',
        coreValue: '洗护师认证+无应激环境+实时直播+联名摄影',
        category: '西南区域宠物服务专业品牌'
      },
      positioningStatement: '对于 90/95 后新手铲屎官与二线家庭客与出差/旅行寄养客, 毛孩子之家是唯一一个用 CKU/NGKC 全员认证 + 无应激低噪环境 + 24h 实时寄养直播 + 联名宠物摄影, 让"毛孩子放心, 毛孩子之家"从洗护到寄养一站落地的西南区域宠物服务专业品牌。',
      sloganOptions: [
        {text:'毛孩子放心，毛孩子之家', source:'agent'},
        {text:'专业洗护，实时直播', source:'user'},
        {text:'科学养宠，从洗护开始', source:'user'}
      ],
      chosenSlogan: '毛孩子放心，毛孩子之家',
      mbti: 'ISFJ (守护者型 — 偏温暖、专业、家人感)',
      personalityTraits: ['温暖','专业','家人感','科学','安心']
    }
  };

  if(typeof window!== 'undefined') window.__case_maohaizi_house_work3 = data;
})();
