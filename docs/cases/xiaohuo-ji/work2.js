/* ============================================================
 xiaohuo-ji / work2 — 目标市场选择 (T09 filled)
 v2 schema：与 Work2.defaultData() 严格对齐。
 2026-08-28: 升级 work2 数据到 v2（markets → retained/candidates、indicators 4×2 桶、
 Delphi Hybrid 2 字段、decision 三档），切换 case 时不再触发迁移 toast。
 ============================================================ */
(function(){
  const attractTemplate = [
    ['经济', ['市场规模 / 行业容量', '客单价与续费能力']],
    ['政治法律', ['行业监管 / 资质门槛', '广告法与合规风险']],
    ['社会文化', ['客群需求强度', '种草 / 社交渗透']],
    ['风险', ['核心资源复制难度', '新客获客成本']]
  ];
  const competeTemplate = [
    ['市场信息', ['目标客群数据可获取性', '竞品表现可监测']],
    ['营销渠道', ['核心渠道成熟度', 'KOL / 达人储备']],
    ['认证合规', ['核心资质完备度', '关键背书可复用']],
    ['产品品牌', ['现有老客基础可迁移', 'C 端品牌资产起点']]
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
  const data = {
  "candidates": [
    {
      "id": "mc1",
      "name": "北京/杭州（跨省拓展）",
      "reason": "粤菜认知弱、客群基础薄",
      "source": "user"
    },
    {
      "id": "mc2",
      "name": "加盟路线",
      "reason": "资金效率高但品控风险大",
      "source": "user"
    },
    {
      "id": "mc3",
      "name": "团餐/企业食堂承包",
      "reason": "量大但利润薄、账期长",
      "source": "user"
    },
    {
      "id": "mc4",
      "name": "速冻食品零售渠道",
      "reason": "渠道广但品牌投入大",
      "source": "user"
    },
    {
      "id": "mc5",
      "name": "旅游景区餐饮",
      "reason": "客单价高但季节性强",
      "source": "user"
    }
  ],
  "screening": {
    "criteria": [
      "目标区域客流稳定，日均翻台 ≥ 3",
      "客单价 ≥ 60 元，毛利率 ≥ 55%",
      "可标准化复制，不依赖单一厨师"
    ]
  },
  "retained": [
    {
      "id": "m1",
      "name": "深圳（粤菜融合新客）",
      "region": "深圳南山/福田",
      "population": "潜在 50 万粤菜+融合菜客户",
      "gdpPerCapita": "人均可支配 7 万+",
      "notes": "融合菜渗透高、抖音同城生态成熟",
      "source": "user"
    },
    {
      "id": "m2",
      "name": "上海（精致中餐客）",
      "region": "上海静安/徐汇",
      "population": "潜在 30 万精致中餐客",
      "gdpPerCapita": "人均可支配 8 万+",
      "notes": "人均 200 元接受度高、出片文化强",
      "source": "user"
    },
    {
      "id": "m3",
      "name": "广州本店（老客+品牌升级）",
      "region": "广州荔湾/珠江新城",
      "population": "已有 600 万老客基础",
      "gdpPerCapita": "人均可支配 6 万+",
      "notes": "老店信任强，新店运营经验可复制",
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
            "name": "市场规模 / 行业容量",
            "weight": 0.5,
            "rubric": {
              "high": "粤菜正餐市场 ≥ 500 亿，年增速 ≥ 8%",
              "mid": "中等水平，介于高分与低分之间",
              "low": "低于行业平均，存在明显短板"
            },
            "support": 0,
            "source": "delphi"
          },
          {
            "id": "ind_经济_客单价与",
            "name": "客单价与续费能力",
            "weight": 0.5,
            "rubric": {
              "high": "客单价 ≥ 80 元，月复购 ≥ 2 次",
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
            "id": "ind_政治法律_行业监管",
            "name": "行业监管 / 资质门槛",
            "weight": 0.5,
            "rubric": {
              "high": "食安监管清晰，证照办理规范",
              "mid": "中等水平，介于高分与低分之间",
              "low": "低于行业平均，存在明显短板"
            },
            "support": 0,
            "source": "delphi"
          },
          {
            "id": "ind_政治法律_广告法与",
            "name": "广告法与合规风险",
            "weight": 0.5,
            "rubric": {
              "high": "餐饮广告合规风险低",
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
            "id": "ind_社会文化_客群需求",
            "name": "客群需求强度",
            "weight": 0.5,
            "rubric": {
              "high": "粤菜接受度广，宴请/聚餐需求强",
              "mid": "中等水平，介于高分与低分之间",
              "low": "低于行业平均，存在明显短板"
            },
            "support": 0,
            "source": "delphi"
          },
          {
            "id": "ind_社会文化_种草 /",
            "name": "种草 / 社交渗透",
            "weight": 0.5,
            "rubric": {
              "high": "小红书/抖音美食探店渗透率高",
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
            "id": "ind_风险_核心资源",
            "name": "核心资源复制难度",
            "weight": 0.5,
            "rubric": {
              "high": "厨师团队/配方可复制性低，壁垒高",
              "mid": "中等水平，介于高分与低分之间",
              "low": "低于行业平均，存在明显短板"
            },
            "support": 0,
            "source": "delphi"
          },
          {
            "id": "ind_风险_新客获客",
            "name": "新客获客成本",
            "weight": 0.5,
            "rubric": {
              "high": "CAC ≤ 客单价 20%，回收期 ≤ 1 月",
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
            "id": "ind_市场信息_目标客群",
            "name": "目标客群数据可获取性",
            "weight": 0.5,
            "rubric": {
              "high": "商圈客流数据可查，人群画像清晰",
              "mid": "中等水平，介于高分与低分之间",
              "low": "低于行业平均，存在明显短板"
            },
            "support": 0,
            "source": "delphi"
          },
          {
            "id": "ind_市场信息_竞品表现",
            "name": "竞品表现可监测",
            "weight": 0.5,
            "rubric": {
              "high": "竞品点评/客流数据可监测",
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
            "id": "ind_营销渠道_核心渠道",
            "name": "核心渠道成熟度",
            "weight": 0.5,
            "rubric": {
              "high": "大众点评/抖音本地生活渠道成熟",
              "mid": "中等水平，介于高分与低分之间",
              "low": "低于行业平均，存在明显短板"
            },
            "support": 0,
            "source": "delphi"
          },
          {
            "id": "ind_营销渠道_KOL ",
            "name": "KOL / 达人储备",
            "weight": 0.5,
            "rubric": {
              "high": "本地美食 KOL/KOC 储备 ≥ 20 位",
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
            "id": "ind_认证合规_核心资质",
            "name": "核心资质完备度",
            "weight": 0.5,
            "rubric": {
              "high": "食品经营许可证/卫生评级齐全",
              "mid": "中等水平，介于高分与低分之间",
              "low": "低于行业平均，存在明显短板"
            },
            "support": 0,
            "source": "delphi"
          },
          {
            "id": "ind_认证合规_关键背书",
            "name": "关键背书可复用",
            "weight": 0.5,
            "rubric": {
              "high": "米其林/必吃榜等行业背书可争取",
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
            "id": "ind_产品品牌_现有老客",
            "name": "现有老客基础可迁移",
            "weight": 0.5,
            "rubric": {
              "high": "30 年老店积累老客 ≥ 2 万",
              "mid": "中等水平，介于高分与低分之间",
              "low": "低于行业平均，存在明显短板"
            },
            "support": 0,
            "source": "delphi"
          },
          {
            "id": "ind_产品品牌_C 端品",
            "name": "C 端品牌资产起点",
            "weight": 0.5,
            "rubric": {
              "high": "本地品牌认知度高，口碑基础好",
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
        "evidence": "深圳（粤菜融合新客）在\"市场规模 / 行业容量\"上表现高，综合行业报告与专家访谈判断。"
      },
      "ind_经济_客单价与": {
        "score": 7.5,
        "source": "user",
        "evidence": "深圳（粤菜融合新客）在\"客单价与续费能力\"上表现中，综合行业报告与专家访谈判断。"
      },
      "ind_政治法律_行业监管": {
        "score": 9,
        "source": "user",
        "evidence": "深圳（粤菜融合新客）在\"行业监管 / 资质门槛\"上表现高，综合行业报告与专家访谈判断。"
      },
      "ind_政治法律_广告法与": {
        "score": 7,
        "source": "user",
        "evidence": "深圳（粤菜融合新客）在\"广告法与合规风险\"上表现中，综合行业报告与专家访谈判断。"
      },
      "ind_社会文化_客群需求": {
        "score": 8,
        "source": "user",
        "evidence": "深圳（粤菜融合新客）在\"客群需求强度\"上表现高，综合行业报告与专家访谈判断。"
      },
      "ind_社会文化_种草 /": {
        "score": 8.5,
        "source": "user",
        "evidence": "深圳（粤菜融合新客）在\"种草 / 社交渗透\"上表现高，综合行业报告与专家访谈判断。"
      },
      "ind_风险_核心资源": {
        "score": 7,
        "source": "user",
        "evidence": "深圳（粤菜融合新客）在\"核心资源复制难度\"上表现中，综合行业报告与专家访谈判断。"
      },
      "ind_风险_新客获客": {
        "score": 8.5,
        "source": "user",
        "evidence": "深圳（粤菜融合新客）在\"新客获客成本\"上表现高，综合行业报告与专家访谈判断。"
      },
      "ind_市场信息_目标客群": {
        "score": 8.5,
        "source": "user",
        "evidence": "深圳（粤菜融合新客）在\"目标客群数据可获取性\"上表现高，综合行业报告与专家访谈判断。"
      },
      "ind_市场信息_竞品表现": {
        "score": 7.5,
        "source": "user",
        "evidence": "深圳（粤菜融合新客）在\"竞品表现可监测\"上表现中，综合行业报告与专家访谈判断。"
      },
      "ind_营销渠道_核心渠道": {
        "score": 9,
        "source": "user",
        "evidence": "深圳（粤菜融合新客）在\"核心渠道成熟度\"上表现高，综合行业报告与专家访谈判断。"
      },
      "ind_营销渠道_KOL ": {
        "score": 7,
        "source": "user",
        "evidence": "深圳（粤菜融合新客）在\"KOL / 达人储备\"上表现中，综合行业报告与专家访谈判断。"
      },
      "ind_认证合规_核心资质": {
        "score": 8,
        "source": "user",
        "evidence": "深圳（粤菜融合新客）在\"核心资质完备度\"上表现高，综合行业报告与专家访谈判断。"
      },
      "ind_认证合规_关键背书": {
        "score": 8.5,
        "source": "user",
        "evidence": "深圳（粤菜融合新客）在\"关键背书可复用\"上表现高，综合行业报告与专家访谈判断。"
      },
      "ind_产品品牌_现有老客": {
        "score": 7,
        "source": "user",
        "evidence": "深圳（粤菜融合新客）在\"现有老客基础可迁移\"上表现中，综合行业报告与专家访谈判断。"
      },
      "ind_产品品牌_C 端品": {
        "score": 8.5,
        "source": "user",
        "evidence": "深圳（粤菜融合新客）在\"C 端品牌资产起点\"上表现高，综合行业报告与专家访谈判断。"
      }
    },
    "m2": {
      "ind_经济_市场规模": {
        "score": 6,
        "source": "user",
        "evidence": "上海（精致中餐客）在\"市场规模 / 行业容量\"上表现中，综合行业报告与专家访谈判断。"
      },
      "ind_经济_客单价与": {
        "score": 5,
        "source": "user",
        "evidence": "上海（精致中餐客）在\"客单价与续费能力\"上表现中低，综合行业报告与专家访谈判断。"
      },
      "ind_政治法律_行业监管": {
        "score": 6.5,
        "source": "user",
        "evidence": "上海（精致中餐客）在\"行业监管 / 资质门槛\"上表现中，综合行业报告与专家访谈判断。"
      },
      "ind_政治法律_广告法与": {
        "score": 4.5,
        "source": "user",
        "evidence": "上海（精致中餐客）在\"广告法与合规风险\"上表现中低，综合行业报告与专家访谈判断。"
      },
      "ind_社会文化_客群需求": {
        "score": 5.5,
        "source": "user",
        "evidence": "上海（精致中餐客）在\"客群需求强度\"上表现中低，综合行业报告与专家访谈判断。"
      },
      "ind_社会文化_种草 /": {
        "score": 6,
        "source": "user",
        "evidence": "上海（精致中餐客）在\"种草 / 社交渗透\"上表现中，综合行业报告与专家访谈判断。"
      },
      "ind_风险_核心资源": {
        "score": 4.5,
        "source": "user",
        "evidence": "上海（精致中餐客）在\"核心资源复制难度\"上表现中低，综合行业报告与专家访谈判断。"
      },
      "ind_风险_新客获客": {
        "score": 6,
        "source": "user",
        "evidence": "上海（精致中餐客）在\"新客获客成本\"上表现中，综合行业报告与专家访谈判断。"
      },
      "ind_市场信息_目标客群": {
        "score": 7.5,
        "source": "user",
        "evidence": "上海（精致中餐客）在\"目标客群数据可获取性\"上表现中，综合行业报告与专家访谈判断。"
      },
      "ind_市场信息_竞品表现": {
        "score": 6.5,
        "source": "user",
        "evidence": "上海（精致中餐客）在\"竞品表现可监测\"上表现中，综合行业报告与专家访谈判断。"
      },
      "ind_营销渠道_核心渠道": {
        "score": 8,
        "source": "user",
        "evidence": "上海（精致中餐客）在\"核心渠道成熟度\"上表现高，综合行业报告与专家访谈判断。"
      },
      "ind_营销渠道_KOL ": {
        "score": 6,
        "source": "user",
        "evidence": "上海（精致中餐客）在\"KOL / 达人储备\"上表现中，综合行业报告与专家访谈判断。"
      },
      "ind_认证合规_核心资质": {
        "score": 7,
        "source": "user",
        "evidence": "上海（精致中餐客）在\"核心资质完备度\"上表现中，综合行业报告与专家访谈判断。"
      },
      "ind_认证合规_关键背书": {
        "score": 7.5,
        "source": "user",
        "evidence": "上海（精致中餐客）在\"关键背书可复用\"上表现中，综合行业报告与专家访谈判断。"
      },
      "ind_产品品牌_现有老客": {
        "score": 6,
        "source": "user",
        "evidence": "上海（精致中餐客）在\"现有老客基础可迁移\"上表现中，综合行业报告与专家访谈判断。"
      },
      "ind_产品品牌_C 端品": {
        "score": 7.5,
        "source": "user",
        "evidence": "上海（精致中餐客）在\"C 端品牌资产起点\"上表现中，综合行业报告与专家访谈判断。"
      }
    },
    "m3": {
      "ind_经济_市场规模": {
        "score": 7.5,
        "source": "user",
        "evidence": "广州本店（老客+品牌升级）在\"市场规模 / 行业容量\"上表现中，综合行业报告与专家访谈判断。"
      },
      "ind_经济_客单价与": {
        "score": 6.5,
        "source": "user",
        "evidence": "广州本店（老客+品牌升级）在\"客单价与续费能力\"上表现中，综合行业报告与专家访谈判断。"
      },
      "ind_政治法律_行业监管": {
        "score": 8,
        "source": "user",
        "evidence": "广州本店（老客+品牌升级）在\"行业监管 / 资质门槛\"上表现高，综合行业报告与专家访谈判断。"
      },
      "ind_政治法律_广告法与": {
        "score": 6,
        "source": "user",
        "evidence": "广州本店（老客+品牌升级）在\"广告法与合规风险\"上表现中，综合行业报告与专家访谈判断。"
      },
      "ind_社会文化_客群需求": {
        "score": 7,
        "source": "user",
        "evidence": "广州本店（老客+品牌升级）在\"客群需求强度\"上表现中，综合行业报告与专家访谈判断。"
      },
      "ind_社会文化_种草 /": {
        "score": 7.5,
        "source": "user",
        "evidence": "广州本店（老客+品牌升级）在\"种草 / 社交渗透\"上表现中，综合行业报告与专家访谈判断。"
      },
      "ind_风险_核心资源": {
        "score": 6,
        "source": "user",
        "evidence": "广州本店（老客+品牌升级）在\"核心资源复制难度\"上表现中，综合行业报告与专家访谈判断。"
      },
      "ind_风险_新客获客": {
        "score": 7.5,
        "source": "user",
        "evidence": "广州本店（老客+品牌升级）在\"新客获客成本\"上表现中，综合行业报告与专家访谈判断。"
      },
      "ind_市场信息_目标客群": {
        "score": 4.5,
        "source": "user",
        "evidence": "广州本店（老客+品牌升级）在\"目标客群数据可获取性\"上表现中低，综合行业报告与专家访谈判断。"
      },
      "ind_市场信息_竞品表现": {
        "score": 3.5,
        "source": "user",
        "evidence": "广州本店（老客+品牌升级）在\"竞品表现可监测\"上表现低，综合行业报告与专家访谈判断。"
      },
      "ind_营销渠道_核心渠道": {
        "score": 5,
        "source": "user",
        "evidence": "广州本店（老客+品牌升级）在\"核心渠道成熟度\"上表现中低，综合行业报告与专家访谈判断。"
      },
      "ind_营销渠道_KOL ": {
        "score": 3,
        "source": "user",
        "evidence": "广州本店（老客+品牌升级）在\"KOL / 达人储备\"上表现低，综合行业报告与专家访谈判断。"
      },
      "ind_认证合规_核心资质": {
        "score": 4,
        "source": "user",
        "evidence": "广州本店（老客+品牌升级）在\"核心资质完备度\"上表现中低，综合行业报告与专家访谈判断。"
      },
      "ind_认证合规_关键背书": {
        "score": 4.5,
        "source": "user",
        "evidence": "广州本店（老客+品牌升级）在\"关键背书可复用\"上表现中低，综合行业报告与专家访谈判断。"
      },
      "ind_产品品牌_现有老客": {
        "score": 3,
        "source": "user",
        "evidence": "广州本店（老客+品牌升级）在\"现有老客基础可迁移\"上表现低，综合行业报告与专家访谈判断。"
      },
      "ind_产品品牌_C 端品": {
        "score": 4.5,
        "source": "user",
        "evidence": "广州本店（老客+品牌升级）在\"C 端品牌资产起点\"上表现中低，综合行业报告与专家访谈判断。"
      }
    }
  },
  "delphi": {
    "recruitment": {
      "perspectives": [
        {
          "id": "p_brand",
          "role": "餐饮品牌策略",
          "why": "识别老店+融合差异化"
        },
        {
          "id": "p_growth",
          "role": "抖音同城运营",
          "why": "评估同城生态成熟度"
        },
        {
          "id": "p_chef",
          "role": "主厨顾问",
          "why": "判断师傅团队复制能力"
        },
        {
          "id": "p_invest",
          "role": "餐饮投资人",
          "why": "评估客单价与回收期"
        },
        {
          "id": "p_mom",
          "role": "年轻食客 KOC",
          "why": "翻译融合菜与出片需求"
        }
      ]
    },
    "personas": [
      {
        "id": "pe1",
        "name": "餐饮品牌策略",
        "perspective": "看品牌资产",
        "stance": "中性"
      },
      {
        "id": "pe2",
        "name": "抖音同城运营",
        "perspective": "看同城流量",
        "stance": "增长向"
      },
      {
        "id": "pe3",
        "name": "主厨顾问",
        "perspective": "看团队复制",
        "stance": "产品向"
      },
      {
        "id": "pe4",
        "name": "餐饮投资人",
        "perspective": "看回本周期",
        "stance": "财务向"
      },
      {
        "id": "pe5",
        "name": "年轻食客 KOC",
        "perspective": "看出片与体验",
        "stance": "用户向"
      }
    ],
    "userHosted": true,
    "finalWeights": {
      "attractiveness": {
        "ind_经济_市场规模": 0.2,
        "ind_经济_客单价": 0.15,
        "ind_政治法律_行业": 0.1,
        "ind_政治法律_广告": 0.05,
        "ind_社会文化_客群": 0.15,
        "ind_社会文化_渗透": 0.1,
        "ind_风险_资源": 0.05,
        "ind_风险_获客": 0.05
      },
      "competitiveness": {
        "ind_市场信息_目标": 0.06,
        "ind_市场信息_竞品": 0.06,
        "ind_营销渠道_核心": 0.1,
        "ind_营销渠道_KOL": 0.08,
        "ind_认证合规_资质": 0.1,
        "ind_认证合规_背书": 0.1,
        "ind_产品品牌_老客": 0.15,
        "ind_产品品牌_品牌": 0.1
      }
    },
    "summary": "两轮 Delphi 后专家对\"增长率\"与\"老店信任\"赋权最高。深圳/上海融合菜渗透高、客单价高、抖音同城种草生态成熟，老陈 30 年粤菜功底+小陈互联网运营能形成\"老店+融合\"差异化。",
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
    "notes": "m1 深圳融合菜渗透高、抖音同城生态成熟、老陈 30 年粤菜功底+小陈运营可快速形成差异化，12 个月内可贡献 30% 营收；m3 老店稳定但增长见顶；m2 上海人均高但师傅团队仅 5 人风险大。"
  },
  "decision": {
    "explanations": {},
    "tier1": {
      "marketId": "m1",
      "rationale": "m1 深圳融合菜渗透高、抖音同城生态成熟、老陈 30 年粤菜功底+小陈运营可快速形成差异化，12 个月内可贡献 30% 营收；m3 老店稳定但增长见顶；m2 上海人均高但师傅团队仅 5 人风险大。",
      "resourcesPct": 80,
      "milestones": [
        "6 月内启动深圳选址+招 1 名店长+1 名探店博主运营",
        "同步上线小程序会员+明厨亮灶直播"
      ],
      "reEvalTrigger": "3 个月复盘：核心指标未达预期"
    },
    "tier2": {
      "marketIds": [
        "m2"
      ],
      "observationMetrics": [
        "月复购率",
        "客单价"
      ],
      "reEvalTrigger": "复购率连续 2 月 < 阈值"
    },
    "tier3": {
      "marketIds": [
        "m3"
      ],
      "reEvalTrigger": "tier1 ROI 跑通后再启动"
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
  if(typeof window!== 'undefined') window.__case_xiaohuo_ji_work2 = data;
})();
