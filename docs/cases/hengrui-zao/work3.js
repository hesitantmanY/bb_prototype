/* ============================================================
 hengrui-zao / work3 — 价值主张与定位 (T09 filled)
 v2 schema：与 Work3.defaultData() 严格对齐。
 2026-08-28: 升级 work3 数据到 v2（identity 独立、scenarios 数组、painMap/candidates 加 scenarioId、
 scoring 落到 6 维、matrix 选 2 个），切换 case 时不再触发迁移 toast。
 ============================================================ */
(function(){
  const data = {
    context: {
      sbuName: "恒锐精密",
      sbuOneLine: "专精特新精密件自有品牌，30+ 年 OEM 经验",
      targetMarket: "专精特新中小品牌方",
      targetMarketReason: "国产替代意愿强、客单价可接受、愿意尝试新自有品牌，12 个月内可贡献自有品牌 60% 营收",
      tier1: { marketId:'m1', name:"专精特新中小品牌方", rationale:"国产替代意愿强、客单价可接受、愿意尝试新自有品牌，12 个月内可贡献自有品牌 60% 营收" },
      tier2: [{"marketId":"m2","name":"工业采购经理（OEM 现有）"}],
      personas: [{"id":"p1","name":"王工","painPoints":"图纸响应慢、检测报告不全"},{"id":"p2","name":"李博士","painPoints":"医疗认证复杂、量产风险"},{"id":"p3","name":"陈总","painPoints":"上游不稳定、账期长"}],
      valueFramework: ["0.005mm 精度","24h 打样","ISO 13485","一站式后处理"],
      hasSurvey: true
    },
    scenarios: [
  {
    "id": "s1",
    "name": "专精特新品牌方代工",
    "description": "中小品牌方找国产替代精密件代工",
    "personaIds": [
      "p1",
      "p3"
    ],
    "needStrength": {
      "pain": "高",
      "willingness": "高",
      "frequency": "项目制"
    },
    "selected": true
  },
  {
    "id": "s2",
    "name": "医疗认证辅导",
    "description": "医疗客户要 ISO 13485 辅导+量产",
    "personaIds": [
      "p2"
    ],
    "needStrength": {
      "pain": "高",
      "willingness": "中",
      "frequency": "项目制"
    },
    "selected": true
  },
  {
    "id": "s3",
    "name": "一站式后处理降本",
    "description": "客户找喷砂+阳极一站式交付",
    "personaIds": [
      "p3"
    ],
    "needStrength": {
      "pain": "中",
      "willingness": "中",
      "frequency": "月度"
    },
    "selected": false
  }
],
    mining: {
      documents: [
  "恒锐精密的 0.005mm 精度确实能打，一汽变速箱件用着不错。",
  "24h 打样响应快，紧急项目救过我的命。",
  "医疗认证能不能帮我们辅导？工艺文档不全。",
  "小批量 50 件起订，灵活度比长盈精密好。",
  "能不能给个 SPC 报告？我们客户审计要。",
  "账期 60 天可以接受，比长盈好。",
  "专精特新认证有没有成功案例？",
  "国产替代我们想试一下，但价格不能再高了。",
  "一站式后处理（喷砂+阳极）能不能也做？",
  "你们 30+ 年 OEM 经验，自有品牌怎么定位？"
],
      includeWork1Open: true,
      includeWork1Themes: true,
      ldaParams: { k: 3, passes: 15, iterations: 100, no_below: 2, no_above: 0.5 },
      ldaResult: null,
      ldaError: null,
      topics: [
  {
    "id": 0,
    "label": "精度与打样交期",
    "share": 40,
    "keywords": [
      {
        "word": "精度",
        "weight": 0.1
      },
      {
        "word": "打样",
        "weight": 0.08
      },
      {
        "word": "24h",
        "weight": 0.06
      },
      {
        "word": "紧急",
        "weight": 0.05
      },
      {
        "word": "量产",
        "weight": 0.04
      }
    ],
    "representative_docs": [
      "0.005mm 精度确实能打",
      "24h 打样响应快"
    ]
  },
  {
    "id": 1,
    "label": "资质与文档",
    "share": 33,
    "keywords": [
      {
        "word": "认证",
        "weight": 0.09
      },
      {
        "word": "医疗",
        "weight": 0.07
      },
      {
        "word": "工艺文档",
        "weight": 0.06
      },
      {
        "word": "SPC",
        "weight": 0.05
      },
      {
        "word": "报告",
        "weight": 0.04
      }
    ],
    "representative_docs": [
      "医疗认证能不能帮我们辅导",
      "能不能给个 SPC 报告"
    ]
  },
  {
    "id": 2,
    "label": "专精特新与一站式",
    "share": 27,
    "keywords": [
      {
        "word": "专精特新",
        "weight": 0.08
      },
      {
        "word": "国产替代",
        "weight": 0.07
      },
      {
        "word": "后处理",
        "weight": 0.06
      },
      {
        "word": "喷砂",
        "weight": 0.05
      },
      {
        "word": "阳极",
        "weight": 0.04
      }
    ],
    "representative_docs": [
      "专精特新认证有没有成功案例",
      "一站式后处理能不能也做"
    ]
  }
],
      wordFreqTop: [
  {
    "word": "精度",
    "count": 4
  },
  {
    "word": "打样",
    "count": 3
  },
  {
    "word": "认证",
    "count": 3
  },
  {
    "word": "医疗",
    "count": 3
  },
  {
    "word": "SPC",
    "count": 2
  },
  {
    "word": "报告",
    "count": 2
  },
  {
    "word": "专精特新",
    "count": 2
  },
  {
    "word": "国产替代",
    "count": 2
  },
  {
    "word": "后处理",
    "count": 2
  },
  {
    "word": "紧急",
    "count": 2
  }
],
      stats: {"raw_count":10,"valid_count":10,"total_words":152,"vocab_size":41,"coherence":0.44},
      painMap: [
  {
    "id": "pa1",
    "pain": "医疗认证辅导不足，工艺文档不全",
    "evidence": "医疗认证能不能帮我们辅导",
    "frequency": "高",
    "linkedNeeds": [
      "认证辅导",
      "工艺文档"
    ],
    "linkedTopicId": 1,
    "type": "痛点",
    "scenarioId": "s2"
  },
  {
    "id": "pa2",
    "pain": "客户审计需要 SPC 报告，展示不足",
    "evidence": "能不能给个 SPC 报告",
    "frequency": "中",
    "linkedNeeds": [
      "SPC 体系",
      "第三方报告"
    ],
    "linkedTopicId": 1,
    "type": "痛点",
    "scenarioId": "s1"
  },
  {
    "id": "pa3",
    "pain": "一站式后处理（喷砂+阳极）缺能力",
    "evidence": "一站式后处理能不能也做",
    "frequency": "中",
    "linkedNeeds": [
      "后处理产线",
      "一站式服务"
    ],
    "linkedTopicId": 2,
    "type": "痛点",
    "scenarioId": "s3"
  },
  {
    "id": "pa4",
    "pain": "国产替代价格压力大",
    "evidence": "国产替代想试，但价格不能再高了",
    "frequency": "中",
    "linkedNeeds": [
      "性价比",
      "专精特新案例"
    ],
    "linkedTopicId": 2,
    "type": "痛点",
    "scenarioId": "s1"
  },
  {
    "id": "pa5",
    "pain": "自有品牌定位不清",
    "evidence": "自有品牌怎么定位",
    "frequency": "中",
    "linkedNeeds": [
      "品牌定位",
      "案例展示"
    ],
    "linkedTopicId": 0,
    "type": "痒点",
    "scenarioId": "s1"
  }
]
    },
    candidates: [
  {
    "id": "c1",
    "name": "0.005mm 精度+SPC",
    "pain": "精度不达标",
    "description": "0.005mm 精度+SPC 全程检测+第三方报告",
    "evidence": "10 篇评论中 4 篇提及精度",
    "source": "user",
    "scenarioId": "s1",
    "selected": true,
    "importance": 10,
    "uniqueness": 9,
    "credibility": 9,
    "feasibility": 9,
    "communicability": 7,
    "sustainability": 9,
    "extraDims": {}
  },
  {
    "id": "c2",
    "name": "24h 打样+小批量柔性",
    "pain": "交期慢",
    "description": "24h 打样响应+50 件起订+7-15 天量产",
    "evidence": "3 篇评论提及打样",
    "source": "user",
    "scenarioId": "s1",
    "selected": true,
    "importance": 9,
    "uniqueness": 8,
    "credibility": 8,
    "feasibility": 7,
    "communicability": 9,
    "sustainability": 8,
    "extraDims": {}
  },
  {
    "id": "c3",
    "name": "医疗资质+认证辅导",
    "pain": "认证复杂",
    "description": "ISO 13485 医疗资质+认证辅导+5+ 医疗案例",
    "evidence": "3 篇评论提及医疗认证",
    "source": "user",
    "scenarioId": "s2",
    "selected": false,
    "importance": 8,
    "uniqueness": 8,
    "credibility": 9,
    "feasibility": 5,
    "communicability": 7,
    "sustainability": 8,
    "extraDims": {}
  },
  {
    "id": "c4",
    "name": "一站式后处理",
    "pain": "后处理外协",
    "description": "喷砂+阳极氧化+电镀后处理内化，一站式交付",
    "evidence": "1 篇评论提及后处理",
    "source": "user",
    "scenarioId": "s3",
    "selected": false,
    "importance": 7,
    "uniqueness": 9,
    "credibility": 7,
    "feasibility": 7,
    "communicability": 8,
    "sustainability": 7,
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
    matrix: {"showSector":true,"sectorWidth":1.5,"xCut":7,"yCut":7,"manualSelected":["c1","c2"]},
    migration: { prompt:'', analyses:[
  {
    "from": "长盈精密客户",
    "to": "c1",
    "reason": "同价位, 恒锐医疗资质更全",
    "cost": 5
  },
  {
    "from": "震裕科技客户",
    "to": "c2",
    "reason": "同柔性, 恒锐 24h 打样更快",
    "cost": 6
  },
  {
    "from": "拓斯达客户",
    "to": "c4",
    "reason": "一站式后处理替代外协",
    "cost": 7
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
      "text": "恒锐造，0.005mm 的精密。"
    },
    {
      "id": "a2",
      "text": "专精特新，恒锐造。"
    },
    {
      "id": "a3",
      "text": "国产替代，恒锐造精密。"
    }
  ],
  "chosenValueText": "恒锐造，0.005mm 的精密。",
  "positioning": {
    "brand": "恒锐造",
    "audience": "专精特新中小品牌方+工业采购经理+专精特新渠道商",
    "coreValue": "0.005mm 精度+24h 打样+医疗资质+一站式后处理",
    "category": "专精特新精密件自有品牌"
  },
  "positioningStatement": "对于专精特新中小品牌方与工业采购经理, 恒锐造是唯一一个用 0.005mm 精度 + 24h 打样响应 + ISO 13485 医疗资质 + 一站式后处理, 让\"0.005mm 的精密\"成为可验证、可审计、可放心的专精特新精密件自有品牌。"
},
    identity: {
  "mbti": "ISTJ (物流师型 — 偏精密、可靠、长期主义)",
  "personalityTraits": [
    "专业",
    "精密",
    "可靠",
    "务实",
    "长期主义"
  ],
  "sloganOptions": [
    {
      "text": "恒锐造，0.005mm 的精密",
      "source": "agent"
    },
    {
      "text": "专精特新，恒锐造",
      "source": "user"
    },
    {
      "text": "国产替代，恒锐造精密",
      "source": "user"
    }
  ],
  "chosenSlogan": "恒锐造，0.005mm 的精密"
},
    _scoreDone: ["c1","c2","c3","c4"],
    _pipeProp: ['coreValueIds','chosenValueText','positioning'],
    _pipeIdentity: ['mbti','sloganOptions','chosenSlogan']
  };
  if(typeof window!== 'undefined') window.__case_hengrui_zao_work3 = data;
})();
