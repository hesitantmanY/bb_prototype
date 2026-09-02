/* ============================================================
 xiaohuo-ji / work3 — 价值主张与定位 (T09 filled)
 v2 schema：与 Work3.defaultData() 严格对齐。
 2026-08-28: 升级 work3 数据到 v2（identity 独立、scenarios 数组、painMap/candidates 加 scenarioId、
 scoring 落到 6 维、matrix 选 2 个），切换 case 时不再触发迁移 toast。
 ============================================================ */
(function(){
  const data = {
    context: {
      sbuName: "小镬记",
      sbuOneLine: "30 年粤菜老店，主厨手作+融合菜",
      targetMarket: "深圳粤菜融合新客",
      targetMarketReason: "融合菜渗透高、抖音同城生态成熟、老陈 30 年粤菜功底+小陈运营可快速形成差异化，12 个月内可贡献 30% 营收",
      tier1: { marketId:'m1', name:"深圳（粤菜融合新客）", rationale:"融合菜渗透高、抖音同城生态成熟、老陈 30 年粤菜功底+小陈运营可快速形成差异化，12 个月内可贡献 30% 营收" },
      tier2: [{"marketId":"m3","name":"广州本店（老客+品牌升级）"}],
      personas: [{"id":"p1","name":"林晓棠","painPoints":"传统粤菜环境老气、缺社交分享点"},{"id":"p2","name":"陈家明","painPoints":"食材不透明、节假日排队久"},{"id":"p3","name":"周小溪","painPoints":"探店同质化、缺独家菜品"}],
      valueFramework: ["30 年老店信任","主厨手作","食材原产地","融合菜创新"],
      hasSurvey: true
    },
    scenarios: [
  {
    "id": "s1",
    "name": "年轻食客探店打卡",
    "description": "25-35 岁年轻食客找融合菜+出片新店",
    "personaIds": [
      "p1",
      "p3"
    ],
    "needStrength": {
      "pain": "中",
      "willingness": "高",
      "frequency": "月度"
    },
    "selected": true
  },
  {
    "id": "s2",
    "name": "老客品牌升级",
    "description": "广州老客期待新店主厨手作+食材溯源",
    "personaIds": [
      "p2"
    ],
    "needStrength": {
      "pain": "低",
      "willingness": "高",
      "frequency": "季度"
    },
    "selected": true
  },
  {
    "id": "s3",
    "name": "节假日家庭聚餐",
    "description": "家庭客找正餐+明厨亮灶+预约",
    "personaIds": [
      "p2",
      "p3"
    ],
    "needStrength": {
      "pain": "中",
      "willingness": "中",
      "frequency": "节假日"
    },
    "selected": false
  }
],
    mining: {
      documents: [
  "小镬记是我吃 20 年的老店，荔湾那家味道最正。",
  "珠江新城店装修太现代，没有老店的感觉。",
  "能不能出一道粤菜+日料融合的刺身，小陈是产品经理应该懂。",
  "清远鸡从哪进的？想看溯源。",
  "主厨老陈 30 年了，能不能拍个纪录片？",
  "探店博主来了两次都说\"和其他粤菜馆没差别\"。",
  "小程序点单能不能加个\"食材故事\"页面？",
  "等位太久了，能不能预约取号？",
  "明厨亮灶看着安心，但师傅太忙没空讲菜。",
  "广州酒家出了预制菜，小镬记做不做？"
],
      includeWork1Open: true,
      includeWork1Themes: true,
      ldaParams: { k: 3, passes: 15, iterations: 100, no_below: 2, no_above: 0.5 },
      ldaResult: null,
      ldaError: null,
      topics: [
  {
    "id": 0,
    "label": "老店信任与原产地",
    "share": 38,
    "keywords": [
      {
        "word": "老店",
        "weight": 0.09
      },
      {
        "word": "荔湾",
        "weight": 0.07
      },
      {
        "word": "清远",
        "weight": 0.06
      },
      {
        "word": "溯源",
        "weight": 0.05
      },
      {
        "word": "食材",
        "weight": 0.04
      }
    ],
    "representative_docs": [
      "小镬记是我吃 20 年的老店",
      "清远鸡从哪进的？想看溯源"
    ]
  },
  {
    "id": 1,
    "label": "融合菜创新与年轻化",
    "share": 35,
    "keywords": [
      {
        "word": "融合",
        "weight": 0.09
      },
      {
        "word": "日料",
        "weight": 0.07
      },
      {
        "word": "刺身",
        "weight": 0.06
      },
      {
        "word": "小陈",
        "weight": 0.05
      },
      {
        "word": "创新",
        "weight": 0.04
      }
    ],
    "representative_docs": [
      "能不能出一道粤菜+日料融合的刺身",
      "探店博主来了两次都说没差别"
    ]
  },
  {
    "id": 2,
    "label": "体验与服务",
    "share": 27,
    "keywords": [
      {
        "word": "小程序",
        "weight": 0.08
      },
      {
        "word": "预约",
        "weight": 0.06
      },
      {
        "word": "明厨",
        "weight": 0.05
      },
      {
        "word": "等位",
        "weight": 0.05
      },
      {
        "word": "故事",
        "weight": 0.04
      }
    ],
    "representative_docs": [
      "小程序点单能不能加食材故事",
      "等位太久了"
    ]
  }
],
      wordFreqTop: [
  {
    "word": "老店",
    "count": 4
  },
  {
    "word": "食材",
    "count": 3
  },
  {
    "word": "融合",
    "count": 3
  },
  {
    "word": "明厨",
    "count": 2
  },
  {
    "word": "小陈",
    "count": 2
  },
  {
    "word": "小程序",
    "count": 2
  },
  {
    "word": "溯源",
    "count": 2
  },
  {
    "word": "刺身",
    "count": 2
  },
  {
    "word": "预约",
    "count": 2
  },
  {
    "word": "创新",
    "count": 2
  }
],
      stats: {"raw_count":10,"valid_count":10,"total_words":148,"vocab_size":42,"coherence":0.42},
      painMap: [
  {
    "id": "pa1",
    "pain": "新店缺老店感，年轻客户群认知弱",
    "evidence": "珠江新城店装修太现代，没有老店的感觉",
    "frequency": "高",
    "linkedNeeds": [
      "老店故事化",
      "环境统一"
    ],
    "linkedTopicId": 0,
    "type": "痛点",
    "scenarioId": "s1"
  },
  {
    "id": "pa2",
    "pain": "融合菜研发节奏慢，缺差异化",
    "evidence": "探店博主来了两次都说没差别",
    "frequency": "高",
    "linkedNeeds": [
      "融合菜实验室",
      "季度上新"
    ],
    "linkedTopicId": 1,
    "type": "痛点",
    "scenarioId": "s1"
  },
  {
    "id": "pa3",
    "pain": "食材溯源展示不足，缺信任锚点",
    "evidence": "清远鸡从哪进的？想看溯源",
    "frequency": "中",
    "linkedNeeds": [
      "明厨亮灶",
      "食材二维码"
    ],
    "linkedTopicId": 0,
    "type": "痛点",
    "scenarioId": "s2"
  },
  {
    "id": "pa4",
    "pain": "等位久/小程序体验差",
    "evidence": "等位太久了，能不能预约取号",
    "frequency": "中",
    "linkedNeeds": [
      "预约系统",
      "等位服务"
    ],
    "linkedTopicId": 2,
    "type": "痒点",
    "scenarioId": "s3"
  },
  {
    "id": "pa5",
    "pain": "主厨故事缺内容化，难以传播",
    "evidence": "主厨老陈 30 年了，能不能拍个纪录片",
    "frequency": "中",
    "linkedNeeds": [
      "主厨 IP",
      "老店故事"
    ],
    "linkedTopicId": 1,
    "type": "痒点",
    "scenarioId": "s2"
  }
]
    },
    candidates: [
  {
    "id": "c1",
    "name": "30 年老店信任",
    "pain": "老店感弱",
    "description": "老陈 30 年粤菜功底+荔湾老店故事化，明厨亮灶+主厨手作纪录片",
    "evidence": "10 篇评论中 4 篇提及老店",
    "source": "user",
    "scenarioId": "s2",
    "selected": true,
    "importance": 9,
    "uniqueness": 8,
    "credibility": 9,
    "feasibility": 9,
    "communicability": 9,
    "sustainability": 9,
    "extraDims": {}
  },
  {
    "id": "c2",
    "name": "食材原产地溯源",
    "pain": "信任不足",
    "description": "清远鸡/顺德鱼生原产地直供，明厨亮灶+二维码溯源",
    "evidence": "3 篇评论提及溯源",
    "source": "user",
    "scenarioId": "s2",
    "selected": false,
    "importance": 8,
    "uniqueness": 9,
    "credibility": 8,
    "feasibility": 6,
    "communicability": 8,
    "sustainability": 6,
    "extraDims": {}
  },
  {
    "id": "c3",
    "name": "融合菜实验室",
    "pain": "缺差异化",
    "description": "小陈主导粤菜+日料/西式/东南亚融合季度上新，3-5 道招牌融合菜",
    "evidence": "4 篇评论提及融合",
    "source": "user",
    "scenarioId": "s1",
    "selected": true,
    "importance": 9,
    "uniqueness": 9,
    "credibility": 7,
    "feasibility": 7,
    "communicability": 8,
    "sustainability": 7,
    "extraDims": {}
  },
  {
    "id": "c4",
    "name": "主厨手作纪录片",
    "pain": "传播难",
    "description": "老陈手作 30 年系列短视频，抖音同城号+小红书分发",
    "evidence": "2 篇评论提及纪录片",
    "source": "user",
    "scenarioId": "s2",
    "selected": false,
    "importance": 7,
    "uniqueness": 9,
    "credibility": 7,
    "feasibility": 7,
    "communicability": 9,
    "sustainability": 6,
    "extraDims": {}
  }
],
    dimensions: {
      desirability: (typeof Work3!== 'undefined' && Work3.DEFAULT_DESIRABILITY_DIMS)
        ? Work3.DEFAULT_DESIRABILITY_DIMS.map(d=>({...d}))
        : [
          {key:'importance', label:'重要性', definition:'这个卖点对客户有多重要'},
          {key:'uniqueness', label:'独特性', definition:'竞品是否也在说/做'},
          {key:'credibility', label:'可信性', definition:'客户凭什么相信你能做到'}
        ],
      implementability: (typeof Work3!== 'undefined' && Work3.DEFAULT_IMPLEMENTABILITY_DIMS)
        ? Work3.DEFAULT_IMPLEMENTABILITY_DIMS.map(d=>({...d}))
        : [
          {key:'feasibility', label:'可行性', definition:'技术/供应链/成本能否实现'},
          {key:'communicability', label:'可传播性', definition:'能否用一句话让客户听懂'},
          {key:'sustainability', label:'可持续性', definition:'能否长期维持、不被轻易复制'}
        ]
    },
    matrix: {"showSector":true,"sectorWidth":1.5,"xCut":7,"yCut":7,"manualSelected":["c1","c3"]},
    migration: { prompt:'', analyses:[
  {
    "from": "广州酒家客户",
    "to": "c1",
    "reason": "同为老字号，小镬记更年轻融合",
    "cost": 6
  },
  {
    "from": "炳胜客户",
    "to": "c1",
    "reason": "同价位, 小镬记更出片",
    "cost": 7
  },
  {
    "from": "gaga 客户",
    "to": "c3",
    "reason": "颜值党迁移到有粤菜底蕴的融合菜",
    "cost": 8
  }
] },
    proposition: {
  "coreValueIds": [
    "c1",
    "c2",
    "c3",
    "c4"
  ],
  "alternatives": [
    {
      "id": "a1",
      "text": "30 年老店，新派粤菜。"
    },
    {
      "id": "a2",
      "text": "老陈的镬，老陈的味。"
    },
    {
      "id": "a3",
      "text": "粤菜老店，融合新味。"
    }
  ],
  "chosenValueText": "30 年老店，新派粤菜。",
  "positioning": {
    "brand": "小镬记",
    "audience": "25-45 岁中端堂食客/年轻白领+家庭客+探店博主",
    "coreValue": "30 年老店信任+融合菜创新+主厨手作+食材溯源",
    "category": "粤菜融合专业品牌"
  },
  "positioningStatement": "对于 25-45 岁中端堂食客, 小镬记是唯一一个用 30 年老店信任 + 主厨手作 + 食材原产地溯源 + 小陈主导融合菜实验室, 让\"30 年老店, 新派粤菜\"既可讲述又可上桌的粤菜融合专业品牌。"
},
    identity: {
  "mbti": "ESTJ (管理者型 — 偏务实、传承、长期主义)",
  "personalityTraits": [
    "老字号",
    "专业",
    "传承",
    "温暖",
    "创新"
  ],
  "sloganOptions": [
    {
      "text": "30 年老店，新派粤菜",
      "source": "agent"
    },
    {
      "text": "老陈的镬，老陈的味",
      "source": "user"
    },
    {
      "text": "粤菜老店，融合新味",
      "source": "user"
    }
  ],
  "chosenSlogan": "30 年老店，新派粤菜"
},
    _scoreDone: ["c1","c2","c3","c4"],
    _pipeProp: ['coreValueIds','chosenValueText','positioning'],
    _pipeIdentity: ['mbti','sloganOptions','chosenSlogan']
  };
  if(typeof window!== 'undefined') window.__case_xiaohuo_ji_work3 = data;
})();
