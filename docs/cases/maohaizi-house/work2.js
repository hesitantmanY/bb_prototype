/* ============================================================
 maohaizi-house / work2 — 目标市场选择 (T09 filled)
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
      "name": "北京/上海（一线拓展）",
      "reason": "距离远、品控难",
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
      "name": "高端宠物医院合作",
      "reason": "精准但门槛高、账期长",
      "source": "user"
    },
    {
      "id": "mc4",
      "name": "宠物繁育场/猫舍",
      "reason": "量大但价格敏感",
      "source": "user"
    },
    {
      "id": "mc5",
      "name": "跨境宠物用品市场",
      "reason": "增长快但合规复杂",
      "source": "user"
    }
  ],
  "screening": {
    "criteria": [
      "目标客群养宠支出 ≥ 300 元/月",
      "线上渠道可触达，获客成本 ≤ 50 元",
      "复购率 ≥ 30%，客单价 ≥ 100 元"
    ]
  },
  "retained": [
    {
      "id": "m1",
      "name": "成都核心（2-3 家新店）",
      "region": "成都高新/锦江/武侯",
      "population": "潜在 50 万养宠家庭",
      "gdpPerCapita": "人均可支配 5 万+",
      "notes": "本地口碑强、抖音同城生态成熟",
      "source": "user"
    },
    {
      "id": "m2",
      "name": "重庆（1 家新店）",
      "region": "重庆渝北/江北",
      "population": "潜在 30 万养宠家庭",
      "gdpPerCapita": "人均可支配 4.5 万+",
      "notes": "已有 1 家店，扩展第 2 家",
      "source": "user"
    },
    {
      "id": "m3",
      "name": "绵阳/乐山（川内下沉）",
      "region": "绵阳/乐山",
      "population": "潜在 10 万养宠家庭",
      "gdpPerCapita": "人均可支配 3.5 万+",
      "notes": "客单价低、复制价值弱",
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
              "high": "市场规模 ≥ 50 亿，年增速 ≥ 15%",
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
              "high": "客单价 ≥ 150 元，年消费 ≥ 6 次",
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
              "high": "宠物用品监管清晰，备案易、政策风险低",
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
              "high": "宣称合规风险低，功效表述可验证",
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
              "high": "精细化喂养需求强，客群主动研究成分",
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
              "high": "小红书/抖音宠物内容渗透率高，KOL 活跃",
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
              "high": "配方/供应链壁垒高，竞品复制难度大",
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
              "high": "CAC ≤ 客单价 25%，回收期 ≤ 2 月",
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
              "high": "目标客群画像清晰，行为数据丰富可监测",
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
              "high": "竞品格局清晰，数据可获取可对标",
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
              "high": "抖音电商/小红书渠道成熟，ROI 可测",
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
              "high": "宠物 KOL/KOC 储备 ≥ 50 位",
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
              "high": "第三方检测/饲料生产许可证齐全",
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
              "high": "兽医/营养师背书可获取，行业认证齐全",
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
              "high": "现有老客 ≥ 1 万，复购率 ≥ 35%",
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
              "high": "C 端品牌有认知基础，搜索量稳定",
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
        "evidence": "成都核心（2-3 家新店）在\"市场规模 / 行业容量\"上表现高，综合行业报告与专家访谈判断。"
      },
      "ind_经济_客单价与": {
        "score": 7.5,
        "source": "user",
        "evidence": "成都核心（2-3 家新店）在\"客单价与续费能力\"上表现中，综合行业报告与专家访谈判断。"
      },
      "ind_政治法律_行业监管": {
        "score": 9,
        "source": "user",
        "evidence": "成都核心（2-3 家新店）在\"行业监管 / 资质门槛\"上表现高，综合行业报告与专家访谈判断。"
      },
      "ind_政治法律_广告法与": {
        "score": 7,
        "source": "user",
        "evidence": "成都核心（2-3 家新店）在\"广告法与合规风险\"上表现中，综合行业报告与专家访谈判断。"
      },
      "ind_社会文化_客群需求": {
        "score": 8,
        "source": "user",
        "evidence": "成都核心（2-3 家新店）在\"客群需求强度\"上表现高，综合行业报告与专家访谈判断。"
      },
      "ind_社会文化_种草 /": {
        "score": 8.5,
        "source": "user",
        "evidence": "成都核心（2-3 家新店）在\"种草 / 社交渗透\"上表现高，综合行业报告与专家访谈判断。"
      },
      "ind_风险_核心资源": {
        "score": 7,
        "source": "user",
        "evidence": "成都核心（2-3 家新店）在\"核心资源复制难度\"上表现中，综合行业报告与专家访谈判断。"
      },
      "ind_风险_新客获客": {
        "score": 8.5,
        "source": "user",
        "evidence": "成都核心（2-3 家新店）在\"新客获客成本\"上表现高，综合行业报告与专家访谈判断。"
      },
      "ind_市场信息_目标客群": {
        "score": 8.5,
        "source": "user",
        "evidence": "成都核心（2-3 家新店）在\"目标客群数据可获取性\"上表现高，综合行业报告与专家访谈判断。"
      },
      "ind_市场信息_竞品表现": {
        "score": 7.5,
        "source": "user",
        "evidence": "成都核心（2-3 家新店）在\"竞品表现可监测\"上表现中，综合行业报告与专家访谈判断。"
      },
      "ind_营销渠道_核心渠道": {
        "score": 9,
        "source": "user",
        "evidence": "成都核心（2-3 家新店）在\"核心渠道成熟度\"上表现高，综合行业报告与专家访谈判断。"
      },
      "ind_营销渠道_KOL ": {
        "score": 7,
        "source": "user",
        "evidence": "成都核心（2-3 家新店）在\"KOL / 达人储备\"上表现中，综合行业报告与专家访谈判断。"
      },
      "ind_认证合规_核心资质": {
        "score": 8,
        "source": "user",
        "evidence": "成都核心（2-3 家新店）在\"核心资质完备度\"上表现高，综合行业报告与专家访谈判断。"
      },
      "ind_认证合规_关键背书": {
        "score": 8.5,
        "source": "user",
        "evidence": "成都核心（2-3 家新店）在\"关键背书可复用\"上表现高，综合行业报告与专家访谈判断。"
      },
      "ind_产品品牌_现有老客": {
        "score": 7,
        "source": "user",
        "evidence": "成都核心（2-3 家新店）在\"现有老客基础可迁移\"上表现中，综合行业报告与专家访谈判断。"
      },
      "ind_产品品牌_C 端品": {
        "score": 8.5,
        "source": "user",
        "evidence": "成都核心（2-3 家新店）在\"C 端品牌资产起点\"上表现高，综合行业报告与专家访谈判断。"
      }
    },
    "m2": {
      "ind_经济_市场规模": {
        "score": 6,
        "source": "user",
        "evidence": "重庆（1 家新店）在\"市场规模 / 行业容量\"上表现中，综合行业报告与专家访谈判断。"
      },
      "ind_经济_客单价与": {
        "score": 5,
        "source": "user",
        "evidence": "重庆（1 家新店）在\"客单价与续费能力\"上表现中低，综合行业报告与专家访谈判断。"
      },
      "ind_政治法律_行业监管": {
        "score": 6.5,
        "source": "user",
        "evidence": "重庆（1 家新店）在\"行业监管 / 资质门槛\"上表现中，综合行业报告与专家访谈判断。"
      },
      "ind_政治法律_广告法与": {
        "score": 4.5,
        "source": "user",
        "evidence": "重庆（1 家新店）在\"广告法与合规风险\"上表现中低，综合行业报告与专家访谈判断。"
      },
      "ind_社会文化_客群需求": {
        "score": 5.5,
        "source": "user",
        "evidence": "重庆（1 家新店）在\"客群需求强度\"上表现中低，综合行业报告与专家访谈判断。"
      },
      "ind_社会文化_种草 /": {
        "score": 6,
        "source": "user",
        "evidence": "重庆（1 家新店）在\"种草 / 社交渗透\"上表现中，综合行业报告与专家访谈判断。"
      },
      "ind_风险_核心资源": {
        "score": 4.5,
        "source": "user",
        "evidence": "重庆（1 家新店）在\"核心资源复制难度\"上表现中低，综合行业报告与专家访谈判断。"
      },
      "ind_风险_新客获客": {
        "score": 6,
        "source": "user",
        "evidence": "重庆（1 家新店）在\"新客获客成本\"上表现中，综合行业报告与专家访谈判断。"
      },
      "ind_市场信息_目标客群": {
        "score": 7.5,
        "source": "user",
        "evidence": "重庆（1 家新店）在\"目标客群数据可获取性\"上表现中，综合行业报告与专家访谈判断。"
      },
      "ind_市场信息_竞品表现": {
        "score": 6.5,
        "source": "user",
        "evidence": "重庆（1 家新店）在\"竞品表现可监测\"上表现中，综合行业报告与专家访谈判断。"
      },
      "ind_营销渠道_核心渠道": {
        "score": 8,
        "source": "user",
        "evidence": "重庆（1 家新店）在\"核心渠道成熟度\"上表现高，综合行业报告与专家访谈判断。"
      },
      "ind_营销渠道_KOL ": {
        "score": 6,
        "source": "user",
        "evidence": "重庆（1 家新店）在\"KOL / 达人储备\"上表现中，综合行业报告与专家访谈判断。"
      },
      "ind_认证合规_核心资质": {
        "score": 7,
        "source": "user",
        "evidence": "重庆（1 家新店）在\"核心资质完备度\"上表现中，综合行业报告与专家访谈判断。"
      },
      "ind_认证合规_关键背书": {
        "score": 7.5,
        "source": "user",
        "evidence": "重庆（1 家新店）在\"关键背书可复用\"上表现中，综合行业报告与专家访谈判断。"
      },
      "ind_产品品牌_现有老客": {
        "score": 6,
        "source": "user",
        "evidence": "重庆（1 家新店）在\"现有老客基础可迁移\"上表现中，综合行业报告与专家访谈判断。"
      },
      "ind_产品品牌_C 端品": {
        "score": 7.5,
        "source": "user",
        "evidence": "重庆（1 家新店）在\"C 端品牌资产起点\"上表现中，综合行业报告与专家访谈判断。"
      }
    },
    "m3": {
      "ind_经济_市场规模": {
        "score": 7.5,
        "source": "user",
        "evidence": "绵阳/乐山（川内下沉）在\"市场规模 / 行业容量\"上表现中，综合行业报告与专家访谈判断。"
      },
      "ind_经济_客单价与": {
        "score": 6.5,
        "source": "user",
        "evidence": "绵阳/乐山（川内下沉）在\"客单价与续费能力\"上表现中，综合行业报告与专家访谈判断。"
      },
      "ind_政治法律_行业监管": {
        "score": 8,
        "source": "user",
        "evidence": "绵阳/乐山（川内下沉）在\"行业监管 / 资质门槛\"上表现高，综合行业报告与专家访谈判断。"
      },
      "ind_政治法律_广告法与": {
        "score": 6,
        "source": "user",
        "evidence": "绵阳/乐山（川内下沉）在\"广告法与合规风险\"上表现中，综合行业报告与专家访谈判断。"
      },
      "ind_社会文化_客群需求": {
        "score": 7,
        "source": "user",
        "evidence": "绵阳/乐山（川内下沉）在\"客群需求强度\"上表现中，综合行业报告与专家访谈判断。"
      },
      "ind_社会文化_种草 /": {
        "score": 7.5,
        "source": "user",
        "evidence": "绵阳/乐山（川内下沉）在\"种草 / 社交渗透\"上表现中，综合行业报告与专家访谈判断。"
      },
      "ind_风险_核心资源": {
        "score": 6,
        "source": "user",
        "evidence": "绵阳/乐山（川内下沉）在\"核心资源复制难度\"上表现中，综合行业报告与专家访谈判断。"
      },
      "ind_风险_新客获客": {
        "score": 7.5,
        "source": "user",
        "evidence": "绵阳/乐山（川内下沉）在\"新客获客成本\"上表现中，综合行业报告与专家访谈判断。"
      },
      "ind_市场信息_目标客群": {
        "score": 4.5,
        "source": "user",
        "evidence": "绵阳/乐山（川内下沉）在\"目标客群数据可获取性\"上表现中低，综合行业报告与专家访谈判断。"
      },
      "ind_市场信息_竞品表现": {
        "score": 3.5,
        "source": "user",
        "evidence": "绵阳/乐山（川内下沉）在\"竞品表现可监测\"上表现低，综合行业报告与专家访谈判断。"
      },
      "ind_营销渠道_核心渠道": {
        "score": 5,
        "source": "user",
        "evidence": "绵阳/乐山（川内下沉）在\"核心渠道成熟度\"上表现中低，综合行业报告与专家访谈判断。"
      },
      "ind_营销渠道_KOL ": {
        "score": 3,
        "source": "user",
        "evidence": "绵阳/乐山（川内下沉）在\"KOL / 达人储备\"上表现低，综合行业报告与专家访谈判断。"
      },
      "ind_认证合规_核心资质": {
        "score": 4,
        "source": "user",
        "evidence": "绵阳/乐山（川内下沉）在\"核心资质完备度\"上表现中低，综合行业报告与专家访谈判断。"
      },
      "ind_认证合规_关键背书": {
        "score": 4.5,
        "source": "user",
        "evidence": "绵阳/乐山（川内下沉）在\"关键背书可复用\"上表现中低，综合行业报告与专家访谈判断。"
      },
      "ind_产品品牌_现有老客": {
        "score": 3,
        "source": "user",
        "evidence": "绵阳/乐山（川内下沉）在\"现有老客基础可迁移\"上表现低，综合行业报告与专家访谈判断。"
      },
      "ind_产品品牌_C 端品": {
        "score": 4.5,
        "source": "user",
        "evidence": "绵阳/乐山（川内下沉）在\"C 端品牌资产起点\"上表现中低，综合行业报告与专家访谈判断。"
      }
    }
  },
  "delphi": {
    "recruitment": {
      "perspectives": [
        {
          "id": "p_brand",
          "role": "宠物服务品牌策略",
          "why": "看本地口碑迁移"
        },
        {
          "id": "p_growth",
          "role": "抖音同城运营",
          "why": "评估同城生态"
        },
        {
          "id": "p_groomer",
          "role": "资深洗护师",
          "why": "判断团队复制"
        },
        {
          "id": "p_invest",
          "role": "宠物行业投资人",
          "why": "看客单价与回收"
        },
        {
          "id": "p_owner",
          "role": "90/95 后铲屎官 KOC",
          "why": "翻译洗护+寄养决策"
        }
      ]
    },
    "personas": [
      {
        "id": "pe1",
        "name": "宠物服务品牌策略",
        "perspective": "看口碑",
        "stance": "中性"
      },
      {
        "id": "pe2",
        "name": "抖音同城运营",
        "perspective": "看同城",
        "stance": "增长向"
      },
      {
        "id": "pe3",
        "name": "资深洗护师",
        "perspective": "看团队",
        "stance": "产品向"
      },
      {
        "id": "pe4",
        "name": "宠物行业投资人",
        "perspective": "看回本",
        "stance": "财务向"
      },
      {
        "id": "pe5",
        "name": "90/95 后铲屎官 KOC",
        "perspective": "看体验",
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
    "summary": "两轮 Delphi 后专家对\"增长率\"与\"本地口碑\"赋权最高。成都/重庆本地宠物数全国前 5、种草生态成熟，毛孩子之家 2 年本地口碑+实时直播差异化已建立。",
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
    "notes": "m1 成都核心市场客单价高、抖音同城生态成熟、毛孩子之家 2 年本地口碑可复用，12 个月内可贡献 50% 营收增长；m2 重庆已有 1 家，扩展第 2 家降低进入风险；m3 川内下沉客单价低、复制价值弱。"
  },
  "decision": {
    "explanations": {},
    "tier1": {
      "marketId": "m1",
      "rationale": "m1 成都核心市场客单价高、抖音同城生态成熟、毛孩子之家 2 年本地口碑可复用，12 个月内可贡献 50% 营收增长；m2 重庆已有 1 家，扩展第 2 家降低进入风险；m3 川内下沉客单价低、复制价值弱。",
      "resourcesPct": 80,
      "milestones": [
        "6 月内启动成都 2 家新店选址+招 3 位洗护师+1 位店长",
        "上线小程序会员月卡+异业合作"
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
  if(typeof window!== 'undefined') window.__case_maohaizi_house_work2 = data;
})();
