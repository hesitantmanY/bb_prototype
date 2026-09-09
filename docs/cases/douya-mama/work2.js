/* ============================================================
 douya-mama / work2 — 目标市场选择 (T09 filled)
 v2 schema：与 Work2.defaultData() 严格对齐。
 2026-08-28: 升级 work2 数据到 v2（markets → retained/candidates、indicators 4×2 桶、
 Delphi Hybrid 2 字段、decision 三档），切换 case 时不再触发迁移 toast。
 ============================================================ */
(function(){
  // 4×2 默认指标模板（与 Work2.INDICATOR_TEMPLATE 一致）
  const attractTemplate = [
    ['经济', ['市场规模 / 中高端容量', '客单价与客单宽度']],
    ['政治法律', ['成分与安全监管', '电商合规与广告法']],
    ['社会文化', ['成分党妈妈占比', '小红书/抖音种草渗透']],
    ['风险', ['获客成本波动', '舆情与负面评价放大']]
  ];
  const competeTemplate = [
    ['市场信息', ['需求与竞品数据可获取性', '妈妈群体画像可监测']],
    ['营销渠道', ['抖音电商成熟度', '小红书 KOL 储备']],
    ['认证合规', ['成分检测报告完备', '儿科医生背书体系']],
    ['产品品牌', ['5 年老客基础可迁移', 'C 端品牌认知起点']]
  ];
  function buildCats(tpl){
    return tpl.map(([name, inds])=>({
      id:'cat_'+name, name, weight:0.25,
      indicators: inds.map(n=>({
        id:'ind_'+name+'_'+n.slice(0,4), name:n, weight:0.5,
        rubric:{high:'',mid:'',low:''}, support:0, source:'delphi'
      }))
    }));
  }

  // 指标 → 旧 v1 indicators 的映射（保留原 score 含义，但 id 改为 v2 默认 id）
  // 4 维 attractiveness 来自原 a1..a4：
  //   经济←a1 市场规模；经济(客单)←a3 客单价
  //   政治法律←a4 成分党（监管端代理）；社会文化←a2 增长率（社交渗透）
  //   风险←新构造的获客成本/舆情
  const data = {
  "candidates": [
    {
      "id": "mc1",
      "name": "抖音兴趣电商新客（兴趣电商）",
      "reason": "新流量红利，但老客品牌力弱",
      "source": "user"
    },
    {
      "id": "mc2",
      "name": "成分党跨境海淘妈妈",
      "reason": "海淘竞品多，转化链路长",
      "source": "user"
    },
    {
      "id": "mc3",
      "name": "高端月子中心合作渠道",
      "reason": "精准触达但门槛高",
      "source": "user"
    },
    {
      "id": "mc4",
      "name": "儿科医院皮肤科推荐",
      "reason": "信任度高但合规严",
      "source": "user"
    },
    {
      "id": "mc5",
      "name": "跨境海淘成分党妈妈",
      "reason": "客单价高但链路长",
      "source": "user"
    }
  ],
  "screening": {
    "criteria": [
      "市场规模 ≥ 100 万目标人群",
      "客单价 ≥ 150 元且复购周期 ≤ 3 月",
      "6 个月内可验证 ROI，获客成本可控"
    ]
  },
  "retained": [
    {
      "id": "m1",
      "name": "一线精致妈妈",
      "region": "北京/上海/广州/深圳",
      "population": "约 300 万",
      "gdpPerCapita": "家庭年收入 50 万+",
      "notes": "成分党、价格不敏感、抖音渗透高",
      "source": "user"
    },
    {
      "id": "m2",
      "name": "二线价格敏感妈妈",
      "region": "成都/武汉/西安/南京",
      "population": "约 800 万",
      "gdpPerCapita": "家庭年收入 15-30 万",
      "notes": "淘宝老客多、复购稳定",
      "source": "user"
    },
    {
      "id": "m3",
      "name": "抖音新客（兴趣电商）",
      "region": "抖音兴趣电商",
      "population": "潜在 2000 万+",
      "gdpPerCapita": "参差",
      "notes": "新流量红利，但老客品牌力弱",
      "source": "user"
    }
  ],
  "attractiveness": {
    "categories": [
      {
        "id": "cat_经济",
        "name": "经济",
        "weight": 0.25,
        "indicators": [
          {
            "id": "ind_经济_市场规模",
            "name": "市场规模 / 中高端容量",
            "weight": 0.5,
            "rubric": {
              "high": "目标人群 ≥ 500 万，年增速 ≥ 20%",
              "mid": "中等水平，介于高分与低分之间",
              "low": "低于行业平均，存在明显短板"
            },
            "support": 0,
            "source": "delphi"
          },
          {
            "id": "ind_经济_客单价与",
            "name": "客单价与客单宽度",
            "weight": 0.5,
            "rubric": {
              "high": "客单价 ≥ 200 元，年消费 ≥ 4 次",
              "mid": "中等水平，介于高分与低分之间",
              "low": "低于行业平均，存在明显短板"
            },
            "support": 0,
            "source": "delphi"
          }
        ]
      },
      {
        "id": "cat_政治法律",
        "name": "政治法律",
        "weight": 0.25,
        "indicators": [
          {
            "id": "ind_政治法律_成分与安",
            "name": "成分与安全监管",
            "weight": 0.5,
            "rubric": {
              "high": "监管清晰，备案齐全，无重大政策风险",
              "mid": "中等水平，介于高分与低分之间",
              "low": "低于行业平均，存在明显短板"
            },
            "support": 0,
            "source": "delphi"
          },
          {
            "id": "ind_政治法律_电商合规",
            "name": "电商合规与广告法",
            "weight": 0.5,
            "rubric": {
              "high": "广告法风险低，宣称可验证",
              "mid": "中等水平，介于高分与低分之间",
              "low": "低于行业平均，存在明显短板"
            },
            "support": 0,
            "source": "delphi"
          }
        ]
      },
      {
        "id": "cat_社会文化",
        "name": "社会文化",
        "weight": 0.25,
        "indicators": [
          {
            "id": "ind_社会文化_成分党妈",
            "name": "成分党妈妈占比",
            "weight": 0.5,
            "rubric": {
              "high": "成分党占比 ≥ 60%，主动查配方",
              "mid": "中等水平，介于高分与低分之间",
              "low": "低于行业平均，存在明显短板"
            },
            "support": 0,
            "source": "delphi"
          },
          {
            "id": "ind_社会文化_小红书/",
            "name": "小红书/抖音种草渗透",
            "weight": 0.5,
            "rubric": {
              "high": "小红书种草渗透率 ≥ 50%，KOL 储备充足",
              "mid": "中等水平，介于高分与低分之间",
              "low": "低于行业平均，存在明显短板"
            },
            "support": 0,
            "source": "delphi"
          }
        ]
      },
      {
        "id": "cat_风险",
        "name": "风险",
        "weight": 0.25,
        "indicators": [
          {
            "id": "ind_风险_获客成本",
            "name": "获客成本波动",
            "weight": 0.5,
            "rubric": {
              "high": "CAC ≤ 客单价 30%，ROI 回收期 ≤ 3 月",
              "mid": "中等水平，介于高分与低分之间",
              "low": "低于行业平均，存在明显短板"
            },
            "support": 0,
            "source": "delphi"
          },
          {
            "id": "ind_风险_舆情与负",
            "name": "舆情与负面评价放大",
            "weight": 0.5,
            "rubric": {
              "high": "负面舆情发生率低，危机应对成本小",
              "mid": "中等水平，介于高分与低分之间",
              "low": "低于行业平均，存在明显短板"
            },
            "support": 0,
            "source": "delphi"
          }
        ]
      }
    ]
  },
  "competitiveness": {
    "categories": [
      {
        "id": "cat_市场信息",
        "name": "市场信息",
        "weight": 0.25,
        "indicators": [
          {
            "id": "ind_市场信息_需求与竞",
            "name": "需求与竞品数据可获取性",
            "weight": 0.5,
            "rubric": {
              "high": "需求数据透明，竞品格局清晰",
              "mid": "中等水平，介于高分与低分之间",
              "low": "低于行业平均，存在明显短板"
            },
            "support": 0,
            "source": "delphi"
          },
          {
            "id": "ind_市场信息_妈妈群体",
            "name": "妈妈群体画像可监测",
            "weight": 0.5,
            "rubric": {
              "high": "用户画像精准，行为数据可监测",
              "mid": "中等水平，介于高分与低分之间",
              "low": "低于行业平均，存在明显短板"
            },
            "support": 0,
            "source": "delphi"
          }
        ]
      },
      {
        "id": "cat_营销渠道",
        "name": "营销渠道",
        "weight": 0.25,
        "indicators": [
          {
            "id": "ind_营销渠道_抖音电商",
            "name": "抖音电商成熟度",
            "weight": 0.5,
            "rubric": {
              "high": "抖音电商成熟，直播带货 ROI ≥ 2",
              "mid": "中等水平，介于高分与低分之间",
              "low": "低于行业平均，存在明显短板"
            },
            "support": 0,
            "source": "delphi"
          },
          {
            "id": "ind_营销渠道_小红书 ",
            "name": "小红书 KOL 储备",
            "weight": 0.5,
            "rubric": {
              "high": "小红书 KOL/KOC 储备 ≥ 50 位",
              "mid": "中等水平，介于高分与低分之间",
              "low": "低于行业平均，存在明显短板"
            },
            "support": 0,
            "source": "delphi"
          }
        ]
      },
      {
        "id": "cat_认证合规",
        "name": "认证合规",
        "weight": 0.25,
        "indicators": [
          {
            "id": "ind_认证合规_成分检测",
            "name": "成分检测报告完备",
            "weight": 0.5,
            "rubric": {
              "high": "第三方检测报告齐全，SGS 等可出",
              "mid": "中等水平，介于高分与低分之间",
              "low": "低于行业平均，存在明显短板"
            },
            "support": 0,
            "source": "delphi"
          },
          {
            "id": "ind_认证合规_儿科医生",
            "name": "儿科医生背书体系",
            "weight": 0.5,
            "rubric": {
              "high": "儿科医生/皮肤科医生背书可获取",
              "mid": "中等水平，介于高分与低分之间",
              "low": "低于行业平均，存在明显短板"
            },
            "support": 0,
            "source": "delphi"
          }
        ]
      },
      {
        "id": "cat_产品品牌",
        "name": "产品品牌",
        "weight": 0.25,
        "indicators": [
          {
            "id": "ind_产品品牌_5 年老",
            "name": "5 年老客基础可迁移",
            "weight": 0.5,
            "rubric": {
              "high": "现有 5 万+ 老客可迁移，复购率 ≥ 40%",
              "mid": "中等水平，介于高分与低分之间",
              "low": "低于行业平均，存在明显短板"
            },
            "support": 0,
            "source": "delphi"
          },
          {
            "id": "ind_产品品牌_C 端品",
            "name": "C 端品牌认知起点",
            "weight": 0.5,
            "rubric": {
              "high": "C 端有一定品牌认知，搜索量稳定",
              "mid": "中等水平，介于高分与低分之间",
              "low": "低于行业平均，存在明显短板"
            },
            "support": 0,
            "source": "delphi"
          }
        ]
      }
    ]
  },
  "scoring": {
    "m1": {
      "ind_经济_市场规模": {
        "score": 8.5,
        "source": "user",
        "evidence": "一线精致妈妈在\"市场规模 / 中高端容量\"上表现高，综合行业报告与专家访谈判断。"
      },
      "ind_经济_客单价与": {
        "score": 7.5,
        "source": "user",
        "evidence": "一线精致妈妈在\"客单价与客单宽度\"上表现中，综合行业报告与专家访谈判断。"
      },
      "ind_政治法律_成分与安": {
        "score": 9,
        "source": "user",
        "evidence": "一线精致妈妈在\"成分与安全监管\"上表现高，综合行业报告与专家访谈判断。"
      },
      "ind_政治法律_电商合规": {
        "score": 7,
        "source": "user",
        "evidence": "一线精致妈妈在\"电商合规与广告法\"上表现中，综合行业报告与专家访谈判断。"
      },
      "ind_社会文化_成分党妈": {
        "score": 8,
        "source": "user",
        "evidence": "一线精致妈妈在\"成分党妈妈占比\"上表现高，综合行业报告与专家访谈判断。"
      },
      "ind_社会文化_小红书/": {
        "score": 8.5,
        "source": "user",
        "evidence": "一线精致妈妈在\"小红书/抖音种草渗透\"上表现高，综合行业报告与专家访谈判断。"
      },
      "ind_风险_获客成本": {
        "score": 7,
        "source": "user",
        "evidence": "一线精致妈妈在\"获客成本波动\"上表现中，综合行业报告与专家访谈判断。"
      },
      "ind_风险_舆情与负": {
        "score": 8.5,
        "source": "user",
        "evidence": "一线精致妈妈在\"舆情与负面评价放大\"上表现高，综合行业报告与专家访谈判断。"
      },
      "ind_市场信息_需求与竞": {
        "score": 8.5,
        "source": "user",
        "evidence": "一线精致妈妈在\"需求与竞品数据可获取性\"上表现高，综合行业报告与专家访谈判断。"
      },
      "ind_市场信息_妈妈群体": {
        "score": 7.5,
        "source": "user",
        "evidence": "一线精致妈妈在\"妈妈群体画像可监测\"上表现中，综合行业报告与专家访谈判断。"
      },
      "ind_营销渠道_抖音电商": {
        "score": 9,
        "source": "user",
        "evidence": "一线精致妈妈在\"抖音电商成熟度\"上表现高，综合行业报告与专家访谈判断。"
      },
      "ind_营销渠道_小红书 ": {
        "score": 7,
        "source": "user",
        "evidence": "一线精致妈妈在\"小红书 KOL 储备\"上表现中，综合行业报告与专家访谈判断。"
      },
      "ind_认证合规_成分检测": {
        "score": 8,
        "source": "user",
        "evidence": "一线精致妈妈在\"成分检测报告完备\"上表现高，综合行业报告与专家访谈判断。"
      },
      "ind_认证合规_儿科医生": {
        "score": 8.5,
        "source": "user",
        "evidence": "一线精致妈妈在\"儿科医生背书体系\"上表现高，综合行业报告与专家访谈判断。"
      },
      "ind_产品品牌_5 年老": {
        "score": 7,
        "source": "user",
        "evidence": "一线精致妈妈在\"5 年老客基础可迁移\"上表现中，综合行业报告与专家访谈判断。"
      },
      "ind_产品品牌_C 端品": {
        "score": 8.5,
        "source": "user",
        "evidence": "一线精致妈妈在\"C 端品牌认知起点\"上表现高，综合行业报告与专家访谈判断。"
      }
    },
    "m2": {
      "ind_经济_市场规模": {
        "score": 6,
        "source": "user",
        "evidence": "二线价格敏感妈妈在\"市场规模 / 中高端容量\"上表现中，综合行业报告与专家访谈判断。"
      },
      "ind_经济_客单价与": {
        "score": 5,
        "source": "user",
        "evidence": "二线价格敏感妈妈在\"客单价与客单宽度\"上表现中低，综合行业报告与专家访谈判断。"
      },
      "ind_政治法律_成分与安": {
        "score": 6.5,
        "source": "user",
        "evidence": "二线价格敏感妈妈在\"成分与安全监管\"上表现中，综合行业报告与专家访谈判断。"
      },
      "ind_政治法律_电商合规": {
        "score": 4.5,
        "source": "user",
        "evidence": "二线价格敏感妈妈在\"电商合规与广告法\"上表现中低，综合行业报告与专家访谈判断。"
      },
      "ind_社会文化_成分党妈": {
        "score": 5.5,
        "source": "user",
        "evidence": "二线价格敏感妈妈在\"成分党妈妈占比\"上表现中低，综合行业报告与专家访谈判断。"
      },
      "ind_社会文化_小红书/": {
        "score": 6,
        "source": "user",
        "evidence": "二线价格敏感妈妈在\"小红书/抖音种草渗透\"上表现中，综合行业报告与专家访谈判断。"
      },
      "ind_风险_获客成本": {
        "score": 4.5,
        "source": "user",
        "evidence": "二线价格敏感妈妈在\"获客成本波动\"上表现中低，综合行业报告与专家访谈判断。"
      },
      "ind_风险_舆情与负": {
        "score": 6,
        "source": "user",
        "evidence": "二线价格敏感妈妈在\"舆情与负面评价放大\"上表现中，综合行业报告与专家访谈判断。"
      },
      "ind_市场信息_需求与竞": {
        "score": 7.5,
        "source": "user",
        "evidence": "二线价格敏感妈妈在\"需求与竞品数据可获取性\"上表现中，综合行业报告与专家访谈判断。"
      },
      "ind_市场信息_妈妈群体": {
        "score": 6.5,
        "source": "user",
        "evidence": "二线价格敏感妈妈在\"妈妈群体画像可监测\"上表现中，综合行业报告与专家访谈判断。"
      },
      "ind_营销渠道_抖音电商": {
        "score": 8,
        "source": "user",
        "evidence": "二线价格敏感妈妈在\"抖音电商成熟度\"上表现高，综合行业报告与专家访谈判断。"
      },
      "ind_营销渠道_小红书 ": {
        "score": 6,
        "source": "user",
        "evidence": "二线价格敏感妈妈在\"小红书 KOL 储备\"上表现中，综合行业报告与专家访谈判断。"
      },
      "ind_认证合规_成分检测": {
        "score": 7,
        "source": "user",
        "evidence": "二线价格敏感妈妈在\"成分检测报告完备\"上表现中，综合行业报告与专家访谈判断。"
      },
      "ind_认证合规_儿科医生": {
        "score": 7.5,
        "source": "user",
        "evidence": "二线价格敏感妈妈在\"儿科医生背书体系\"上表现中，综合行业报告与专家访谈判断。"
      },
      "ind_产品品牌_5 年老": {
        "score": 6,
        "source": "user",
        "evidence": "二线价格敏感妈妈在\"5 年老客基础可迁移\"上表现中，综合行业报告与专家访谈判断。"
      },
      "ind_产品品牌_C 端品": {
        "score": 7.5,
        "source": "user",
        "evidence": "二线价格敏感妈妈在\"C 端品牌认知起点\"上表现中，综合行业报告与专家访谈判断。"
      }
    },
    "m3": {
      "ind_经济_市场规模": {
        "score": 7.5,
        "source": "user",
        "evidence": "抖音新客（兴趣电商）在\"市场规模 / 中高端容量\"上表现中，综合行业报告与专家访谈判断。"
      },
      "ind_经济_客单价与": {
        "score": 6.5,
        "source": "user",
        "evidence": "抖音新客（兴趣电商）在\"客单价与客单宽度\"上表现中，综合行业报告与专家访谈判断。"
      },
      "ind_政治法律_成分与安": {
        "score": 8,
        "source": "user",
        "evidence": "抖音新客（兴趣电商）在\"成分与安全监管\"上表现高，综合行业报告与专家访谈判断。"
      },
      "ind_政治法律_电商合规": {
        "score": 6,
        "source": "user",
        "evidence": "抖音新客（兴趣电商）在\"电商合规与广告法\"上表现中，综合行业报告与专家访谈判断。"
      },
      "ind_社会文化_成分党妈": {
        "score": 7,
        "source": "user",
        "evidence": "抖音新客（兴趣电商）在\"成分党妈妈占比\"上表现中，综合行业报告与专家访谈判断。"
      },
      "ind_社会文化_小红书/": {
        "score": 7.5,
        "source": "user",
        "evidence": "抖音新客（兴趣电商）在\"小红书/抖音种草渗透\"上表现中，综合行业报告与专家访谈判断。"
      },
      "ind_风险_获客成本": {
        "score": 6,
        "source": "user",
        "evidence": "抖音新客（兴趣电商）在\"获客成本波动\"上表现中，综合行业报告与专家访谈判断。"
      },
      "ind_风险_舆情与负": {
        "score": 7.5,
        "source": "user",
        "evidence": "抖音新客（兴趣电商）在\"舆情与负面评价放大\"上表现中，综合行业报告与专家访谈判断。"
      },
      "ind_市场信息_需求与竞": {
        "score": 4.5,
        "source": "user",
        "evidence": "抖音新客（兴趣电商）在\"需求与竞品数据可获取性\"上表现中低，综合行业报告与专家访谈判断。"
      },
      "ind_市场信息_妈妈群体": {
        "score": 3.5,
        "source": "user",
        "evidence": "抖音新客（兴趣电商）在\"妈妈群体画像可监测\"上表现低，综合行业报告与专家访谈判断。"
      },
      "ind_营销渠道_抖音电商": {
        "score": 5,
        "source": "user",
        "evidence": "抖音新客（兴趣电商）在\"抖音电商成熟度\"上表现中低，综合行业报告与专家访谈判断。"
      },
      "ind_营销渠道_小红书 ": {
        "score": 3,
        "source": "user",
        "evidence": "抖音新客（兴趣电商）在\"小红书 KOL 储备\"上表现低，综合行业报告与专家访谈判断。"
      },
      "ind_认证合规_成分检测": {
        "score": 4,
        "source": "user",
        "evidence": "抖音新客（兴趣电商）在\"成分检测报告完备\"上表现中低，综合行业报告与专家访谈判断。"
      },
      "ind_认证合规_儿科医生": {
        "score": 4.5,
        "source": "user",
        "evidence": "抖音新客（兴趣电商）在\"儿科医生背书体系\"上表现中低，综合行业报告与专家访谈判断。"
      },
      "ind_产品品牌_5 年老": {
        "score": 3,
        "source": "user",
        "evidence": "抖音新客（兴趣电商）在\"5 年老客基础可迁移\"上表现低，综合行业报告与专家访谈判断。"
      },
      "ind_产品品牌_C 端品": {
        "score": 4.5,
        "source": "user",
        "evidence": "抖音新客（兴趣电商）在\"C 端品牌认知起点\"上表现中低，综合行业报告与专家访谈判断。"
      }
    }
  },
  "delphi": {
    "recruitment": {
      "perspectives": [
        {
          "id": "p_brand",
          "role": "品牌策略专家",
          "why": "衡量成分党迁移路径与品牌差异化"
        },
        {
          "id": "p_growth",
          "role": "抖音电商运营",
          "why": "评估兴趣电商投放 ROI 与渗透率"
        },
        {
          "id": "p_product",
          "role": "婴幼儿洗护产品经理",
          "why": "解读成分表与竞品配方差异"
        },
        {
          "id": "p_retail",
          "role": "线下母婴渠道商",
          "why": "识别二线城市复购驱动力"
        },
        {
          "id": "p_mom",
          "role": "一线妈妈 KOC",
          "why": "翻译红 PP 焦虑与试用装决策门槛"
        }
      ]
    },
    "personas": [
      {
        "id": "pe1",
        "name": "品牌策略专家",
        "perspective": "看品牌资产与迁移",
        "stance": "中性"
      },
      {
        "id": "pe2",
        "name": "抖音运营",
        "perspective": "看流量与转化",
        "stance": "增长向"
      },
      {
        "id": "pe3",
        "name": "产品经理",
        "perspective": "看配方与差异化",
        "stance": "产品向"
      },
      {
        "id": "pe4",
        "name": "线下渠道",
        "perspective": "看复购与铺货",
        "stance": "渠道向"
      },
      {
        "id": "pe5",
        "name": "妈妈 KOC",
        "perspective": "看决策与口碑",
        "stance": "用户向"
      }
    ],
    "userHosted": true,
    "finalWeights": {
      "attractiveness": {
        "ind_经济_市场规模": 0.2,
        "ind_经济_客单价": 0.15,
        "ind_政治法律_成分": 0.1,
        "ind_政治法律_电商": 0.05,
        "ind_社会文化_成分": 0.15,
        "ind_社会文化_渗透": 0.1,
        "ind_风险_获客成本": 0.05,
        "ind_风险_舆情": 0.05
      },
      "competitiveness": {
        "ind_市场信息_需求": 0.06,
        "ind_市场信息_画像": 0.06,
        "ind_营销渠道_抖音": 0.1,
        "ind_营销渠道_小红书": 0.08,
        "ind_认证合规_检测": 0.1,
        "ind_认证合规_医生": 0.1,
        "ind_产品品牌_老客": 0.15,
        "ind_产品品牌_品牌": 0.1
      }
    },
    "summary": "两轮 Delphi 后专家对\"小红书渗透\"\"老客基础\"赋权最高。一线精致妈妈客单价高、成分党占比高、抖音渗透高，6 个月内可贡献 30% 营收；二线老客稳定但增长见顶；抖音新客是渠道维度不是细分市场。",
    "status": "done",
    "phase": "converged",
    "panel": [],
    "round1": null,
    "round2": null,
    "synthesis": null,
    "finalSynthesis": null,
    "weights": null
  },
  "matrix": {
    "xCut": null,
    "yCut": null,
    "notes": "短期保 m2 老客复盘，中期重点攻 m1 抖音+小红书种草，长期考虑 m3 抖音兴趣电商。"
  },
  "decision": {
    "explanations": {
      "m1": "高吸引力（成分党+高客单）+ 强竞争力（5 万老客可迁移、抖音渠道成熟）",
      "m2": "高吸引力（市场规模大）+ 极强竞争力（老客粘性）但增长见顶",
      "m3": "中吸引力（新流量红利）+ 弱竞争力（无老客、品牌认知弱）"
    },
    "tier1": {
      "marketId": "m1",
      "rationale": "一线精致妈妈客单价高、成分党、抖音渗透高，6 个月内可贡献 30% 营收",
      "resourcesPct": 80,
      "milestones": [
        "6 月内招 1 名抖音运营+1 名内容策划",
        "启动小红书+抖音\"成分透明\"系列内容"
      ],
      "reEvalTrigger": "3 个月复盘：抖音 ROI < 1.5 或小红书互动 < 5%"
    },
    "tier2": {
      "marketIds": [
        "m2"
      ],
      "observationMetrics": [
        "月复购率",
        "客服响应时长"
      ],
      "reEvalTrigger": "复购率连续 2 月 < 30%"
    },
    "tier3": {
      "marketIds": [
        "m3"
      ],
      "reEvalTrigger": "一线 ROI 跑通后再启动"
    }
  },
  "meta": {
    "schemaVersion": 2,
    "work1Linked": false
  },
  "_pipeDone": [
    "framework",
    "evaluate"
  ]
};

  if(typeof window!== 'undefined') window.__case_douya_mama_work2 = data;
})();
