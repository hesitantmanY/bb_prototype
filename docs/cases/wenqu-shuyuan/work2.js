/* ============================================================
 wenqu-shuyuan / work2 — 目标市场选择 (T09 filled)
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
      "name": "艺考集训",
      "reason": "客单价高但政策风险大",
      "source": "user"
    },
    {
      "id": "mc2",
      "name": "企业内训",
      "reason": "周期长、客单高",
      "source": "user"
    },
    {
      "id": "mc3",
      "name": "企业内训/职业培训 B 端",
      "reason": "客单价高但决策链长",
      "source": "user"
    },
    {
      "id": "mc4",
      "name": "K12 学科类培训",
      "reason": "政策风险高、已在收缩",
      "source": "user"
    },
    {
      "id": "mc5",
      "name": "留学语培/出国考试",
      "reason": "客单价高但市场波动大",
      "source": "user"
    }
  ],
  "screening": {
    "criteria": [
      "目标人群规模 ≥ 500 万，需求刚性",
      "客单价 ≥ 2000 元，完课率 ≥ 60%",
      "政策风险低，不在\"双减\"监管范围内"
    ]
  },
  "retained": [
    {
      "id": "m1",
      "name": "大学生/职场新人",
      "region": "杭州/宁波/绍兴高校+职场",
      "population": "约 200 万",
      "gdpPerCapita": "家庭年收入 15-30 万",
      "notes": "就业刚需强、客单价高、社交传播好",
      "source": "user"
    },
    {
      "id": "m2",
      "name": "K12 老客（鸡娃续费）",
      "region": "3 校区周边家庭",
      "population": "已有 1500 学员家庭",
      "gdpPerCapita": "家庭年收入 25-50 万",
      "notes": "老客粘性强，续费 70%",
      "source": "user"
    },
    {
      "id": "m3",
      "name": "30+ 转行者",
      "region": "浙江省内待业/转行",
      "population": "约 100 万",
      "gdpPerCapita": "家庭年收入 10-20 万",
      "notes": "人数多、就业兑现风险大",
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
              "high": "市场规模 ≥ 200 亿，年增速 ≥ 10%",
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
              "high": "客单价 ≥ 3000 元，续费率 ≥ 50%",
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
              "high": "政策支持职业教育，监管清晰",
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
              "high": "教育广告合规，无虚假宣称风险",
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
              "high": "就业焦虑驱动，需求刚性强",
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
              "high": "知乎/B站/小红书学习内容渗透率高",
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
              "high": "名师/教研团队可复制性低，壁垒高",
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
              "high": "CAC ≤ 客单价 30%，转化周期 ≤ 1 月",
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
              "high": "目标人群画像清晰，投放可精准触达",
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
              "high": "竞品数据可监测，格局稳定",
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
              "high": "信息流/社群渠道成熟，ROI 可测",
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
              "high": "学习博主/职场 KOL 储备 ≥ 20 位",
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
              "high": "办学许可证/ICP 等资质齐全",
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
              "high": "权威机构/名企合作背书可获取",
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
              "high": "5 年累计老学员 ≥ 5000，口碑转介绍 ≥ 30%",
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
              "high": "本地有品牌认知，老学员推荐率高",
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
        "evidence": "大学生/职场新人在\"市场规模 / 行业容量\"上表现高，综合行业报告与专家访谈判断。"
      },
      "ind_经济_客单价与": {
        "score": 7.5,
        "source": "user",
        "evidence": "大学生/职场新人在\"客单价与续费能力\"上表现中，综合行业报告与专家访谈判断。"
      },
      "ind_政治法律_行业监管": {
        "score": 9,
        "source": "user",
        "evidence": "大学生/职场新人在\"行业监管 / 资质门槛\"上表现高，综合行业报告与专家访谈判断。"
      },
      "ind_政治法律_广告法与": {
        "score": 7,
        "source": "user",
        "evidence": "大学生/职场新人在\"广告法与合规风险\"上表现中，综合行业报告与专家访谈判断。"
      },
      "ind_社会文化_客群需求": {
        "score": 8,
        "source": "user",
        "evidence": "大学生/职场新人在\"客群需求强度\"上表现高，综合行业报告与专家访谈判断。"
      },
      "ind_社会文化_种草 /": {
        "score": 8.5,
        "source": "user",
        "evidence": "大学生/职场新人在\"种草 / 社交渗透\"上表现高，综合行业报告与专家访谈判断。"
      },
      "ind_风险_核心资源": {
        "score": 7,
        "source": "user",
        "evidence": "大学生/职场新人在\"核心资源复制难度\"上表现中，综合行业报告与专家访谈判断。"
      },
      "ind_风险_新客获客": {
        "score": 8.5,
        "source": "user",
        "evidence": "大学生/职场新人在\"新客获客成本\"上表现高，综合行业报告与专家访谈判断。"
      },
      "ind_市场信息_目标客群": {
        "score": 8.5,
        "source": "user",
        "evidence": "大学生/职场新人在\"目标客群数据可获取性\"上表现高，综合行业报告与专家访谈判断。"
      },
      "ind_市场信息_竞品表现": {
        "score": 7.5,
        "source": "user",
        "evidence": "大学生/职场新人在\"竞品表现可监测\"上表现中，综合行业报告与专家访谈判断。"
      },
      "ind_营销渠道_核心渠道": {
        "score": 9,
        "source": "user",
        "evidence": "大学生/职场新人在\"核心渠道成熟度\"上表现高，综合行业报告与专家访谈判断。"
      },
      "ind_营销渠道_KOL ": {
        "score": 7,
        "source": "user",
        "evidence": "大学生/职场新人在\"KOL / 达人储备\"上表现中，综合行业报告与专家访谈判断。"
      },
      "ind_认证合规_核心资质": {
        "score": 8,
        "source": "user",
        "evidence": "大学生/职场新人在\"核心资质完备度\"上表现高，综合行业报告与专家访谈判断。"
      },
      "ind_认证合规_关键背书": {
        "score": 8.5,
        "source": "user",
        "evidence": "大学生/职场新人在\"关键背书可复用\"上表现高，综合行业报告与专家访谈判断。"
      },
      "ind_产品品牌_现有老客": {
        "score": 7,
        "source": "user",
        "evidence": "大学生/职场新人在\"现有老客基础可迁移\"上表现中，综合行业报告与专家访谈判断。"
      },
      "ind_产品品牌_C 端品": {
        "score": 8.5,
        "source": "user",
        "evidence": "大学生/职场新人在\"C 端品牌资产起点\"上表现高，综合行业报告与专家访谈判断。"
      }
    },
    "m2": {
      "ind_经济_市场规模": {
        "score": 6,
        "source": "user",
        "evidence": "K12 老客（鸡娃续费）在\"市场规模 / 行业容量\"上表现中，综合行业报告与专家访谈判断。"
      },
      "ind_经济_客单价与": {
        "score": 5,
        "source": "user",
        "evidence": "K12 老客（鸡娃续费）在\"客单价与续费能力\"上表现中低，综合行业报告与专家访谈判断。"
      },
      "ind_政治法律_行业监管": {
        "score": 6.5,
        "source": "user",
        "evidence": "K12 老客（鸡娃续费）在\"行业监管 / 资质门槛\"上表现中，综合行业报告与专家访谈判断。"
      },
      "ind_政治法律_广告法与": {
        "score": 4.5,
        "source": "user",
        "evidence": "K12 老客（鸡娃续费）在\"广告法与合规风险\"上表现中低，综合行业报告与专家访谈判断。"
      },
      "ind_社会文化_客群需求": {
        "score": 5.5,
        "source": "user",
        "evidence": "K12 老客（鸡娃续费）在\"客群需求强度\"上表现中低，综合行业报告与专家访谈判断。"
      },
      "ind_社会文化_种草 /": {
        "score": 6,
        "source": "user",
        "evidence": "K12 老客（鸡娃续费）在\"种草 / 社交渗透\"上表现中，综合行业报告与专家访谈判断。"
      },
      "ind_风险_核心资源": {
        "score": 4.5,
        "source": "user",
        "evidence": "K12 老客（鸡娃续费）在\"核心资源复制难度\"上表现中低，综合行业报告与专家访谈判断。"
      },
      "ind_风险_新客获客": {
        "score": 6,
        "source": "user",
        "evidence": "K12 老客（鸡娃续费）在\"新客获客成本\"上表现中，综合行业报告与专家访谈判断。"
      },
      "ind_市场信息_目标客群": {
        "score": 7.5,
        "source": "user",
        "evidence": "K12 老客（鸡娃续费）在\"目标客群数据可获取性\"上表现中，综合行业报告与专家访谈判断。"
      },
      "ind_市场信息_竞品表现": {
        "score": 6.5,
        "source": "user",
        "evidence": "K12 老客（鸡娃续费）在\"竞品表现可监测\"上表现中，综合行业报告与专家访谈判断。"
      },
      "ind_营销渠道_核心渠道": {
        "score": 8,
        "source": "user",
        "evidence": "K12 老客（鸡娃续费）在\"核心渠道成熟度\"上表现高，综合行业报告与专家访谈判断。"
      },
      "ind_营销渠道_KOL ": {
        "score": 6,
        "source": "user",
        "evidence": "K12 老客（鸡娃续费）在\"KOL / 达人储备\"上表现中，综合行业报告与专家访谈判断。"
      },
      "ind_认证合规_核心资质": {
        "score": 7,
        "source": "user",
        "evidence": "K12 老客（鸡娃续费）在\"核心资质完备度\"上表现中，综合行业报告与专家访谈判断。"
      },
      "ind_认证合规_关键背书": {
        "score": 7.5,
        "source": "user",
        "evidence": "K12 老客（鸡娃续费）在\"关键背书可复用\"上表现中，综合行业报告与专家访谈判断。"
      },
      "ind_产品品牌_现有老客": {
        "score": 6,
        "source": "user",
        "evidence": "K12 老客（鸡娃续费）在\"现有老客基础可迁移\"上表现中，综合行业报告与专家访谈判断。"
      },
      "ind_产品品牌_C 端品": {
        "score": 7.5,
        "source": "user",
        "evidence": "K12 老客（鸡娃续费）在\"C 端品牌资产起点\"上表现中，综合行业报告与专家访谈判断。"
      }
    },
    "m3": {
      "ind_经济_市场规模": {
        "score": 7.5,
        "source": "user",
        "evidence": "30+ 转行者在\"市场规模 / 行业容量\"上表现中，综合行业报告与专家访谈判断。"
      },
      "ind_经济_客单价与": {
        "score": 6.5,
        "source": "user",
        "evidence": "30+ 转行者在\"客单价与续费能力\"上表现中，综合行业报告与专家访谈判断。"
      },
      "ind_政治法律_行业监管": {
        "score": 8,
        "source": "user",
        "evidence": "30+ 转行者在\"行业监管 / 资质门槛\"上表现高，综合行业报告与专家访谈判断。"
      },
      "ind_政治法律_广告法与": {
        "score": 6,
        "source": "user",
        "evidence": "30+ 转行者在\"广告法与合规风险\"上表现中，综合行业报告与专家访谈判断。"
      },
      "ind_社会文化_客群需求": {
        "score": 7,
        "source": "user",
        "evidence": "30+ 转行者在\"客群需求强度\"上表现中，综合行业报告与专家访谈判断。"
      },
      "ind_社会文化_种草 /": {
        "score": 7.5,
        "source": "user",
        "evidence": "30+ 转行者在\"种草 / 社交渗透\"上表现中，综合行业报告与专家访谈判断。"
      },
      "ind_风险_核心资源": {
        "score": 6,
        "source": "user",
        "evidence": "30+ 转行者在\"核心资源复制难度\"上表现中，综合行业报告与专家访谈判断。"
      },
      "ind_风险_新客获客": {
        "score": 7.5,
        "source": "user",
        "evidence": "30+ 转行者在\"新客获客成本\"上表现中，综合行业报告与专家访谈判断。"
      },
      "ind_市场信息_目标客群": {
        "score": 4.5,
        "source": "user",
        "evidence": "30+ 转行者在\"目标客群数据可获取性\"上表现中低，综合行业报告与专家访谈判断。"
      },
      "ind_市场信息_竞品表现": {
        "score": 3.5,
        "source": "user",
        "evidence": "30+ 转行者在\"竞品表现可监测\"上表现低，综合行业报告与专家访谈判断。"
      },
      "ind_营销渠道_核心渠道": {
        "score": 5,
        "source": "user",
        "evidence": "30+ 转行者在\"核心渠道成熟度\"上表现中低，综合行业报告与专家访谈判断。"
      },
      "ind_营销渠道_KOL ": {
        "score": 3,
        "source": "user",
        "evidence": "30+ 转行者在\"KOL / 达人储备\"上表现低，综合行业报告与专家访谈判断。"
      },
      "ind_认证合规_核心资质": {
        "score": 4,
        "source": "user",
        "evidence": "30+ 转行者在\"核心资质完备度\"上表现中低，综合行业报告与专家访谈判断。"
      },
      "ind_认证合规_关键背书": {
        "score": 4.5,
        "source": "user",
        "evidence": "30+ 转行者在\"关键背书可复用\"上表现中低，综合行业报告与专家访谈判断。"
      },
      "ind_产品品牌_现有老客": {
        "score": 3,
        "source": "user",
        "evidence": "30+ 转行者在\"现有老客基础可迁移\"上表现低，综合行业报告与专家访谈判断。"
      },
      "ind_产品品牌_C 端品": {
        "score": 4.5,
        "source": "user",
        "evidence": "30+ 转行者在\"C 端品牌资产起点\"上表现中低，综合行业报告与专家访谈判断。"
      }
    }
  },
  "delphi": {
    "recruitment": {
      "perspectives": [
        {
          "id": "p_brand",
          "role": "教育品牌策略",
          "why": "看 K12 转职教品牌迁移"
        },
        {
          "id": "p_growth",
          "role": "职业课运营",
          "why": "看就业转化路径"
        },
        {
          "id": "p_teacher",
          "role": "资深职业课老师",
          "why": "判断师资复制"
        },
        {
          "id": "p_hr",
          "role": "本地企业 HRD",
          "why": "看就业兑现可行性"
        },
        {
          "id": "p_student",
          "role": "大学生 KOC",
          "why": "翻译求职焦虑"
        }
      ]
    },
    "personas": [
      {
        "id": "pe1",
        "name": "教育品牌策略",
        "perspective": "看品牌迁移",
        "stance": "中性"
      },
      {
        "id": "pe2",
        "name": "职业课运营",
        "perspective": "看转化",
        "stance": "增长向"
      },
      {
        "id": "pe3",
        "name": "职业课老师",
        "perspective": "看师资",
        "stance": "产品向"
      },
      {
        "id": "pe4",
        "name": "企业 HRD",
        "perspective": "看就业",
        "stance": "渠道向"
      },
      {
        "id": "pe5",
        "name": "大学生 KOC",
        "perspective": "看决策",
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
    "summary": "两轮 Delphi 后专家对\"增长率\"与\"师资基础\"赋权最高。大学生/职场新人客单价高、就业刚需强、老学员可推荐，6 个月内可贡献 30% 营收。",
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
    "notes": "m1 大学生/职场新人客单价高、就业刚需强、老学员推荐可借力，6 个月内可贡献 30% 营收；m2 老客稳定但增长见顶；m3 转行者人数多但兑现风险大。"
  },
  "decision": {
    "explanations": {},
    "tier1": {
      "marketId": "m1",
      "rationale": "m1 大学生/职场新人客单价高、就业刚需强、老学员推荐可借力，6 个月内可贡献 30% 营收；m2 老客稳定但增长见顶；m3 转行者人数多但兑现风险大。",
      "resourcesPct": 80,
      "milestones": [
        "6 月内招 2 名职业课老师+1 名就业对接",
        "与 3-5 家本地企业签就业合作协议",
        "上线小程序学习报告+作品墙"
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
  if(typeof window!== 'undefined') window.__case_wenqu_shuyuan_work2 = data;
})();
