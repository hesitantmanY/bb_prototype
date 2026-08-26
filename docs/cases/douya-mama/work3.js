/* ============================================================
 douya-mama / work3 — 价值主张与定位 (T09 filled)
 形状严格匹配 Work3.defaultData()。
 ============================================================ */
(function(){
  const data = {
    context: {
      sbuName: '豆芽妈妈',
      targetMarket: '一线精致妈妈 + 抖音新客',
      personas: [
        { id:'p1', name:'林小满', painPoints:'宝宝红 PP 反复、担心成分刺激' },
        { id:'p2', name:'周晓燕', painPoints:'价格敏感、囤货焦虑' },
        { id:'p3', name:'苏雅', painPoints:'信任门槛高、需要医生背书' }
      ],
      hasSurvey: true
    },
    mining: {
      documents: [
        '豆芽的成分表我截图发过群，便宜又安心。',
        '宝宝红 PP 试了松达没用，换豆芽护臀膏就好。',
        '配料表没看懂，有没有医生能解读一下？',
        '闺蜜推荐买的，5 年了，配方一直没变。',
        '抖音上看到成分党妈妈推这个，但价格比袋鼠妈妈贵。',
        '想要试用装，红 PP 严重不敢直接买。',
        '儿科医生推荐才买的，比贝亲便宜。',
        '我买豆芽是看老客评论多，新牌子不敢试。',
        '护臀膏味道很重，宝宝不喜欢，能改进吗？',
        '能否出个亲子装系列，全家都能用？'
      ],
      includeWork1Open: true,
      includeWork1Themes: true,
      ldaParams: { k: 3, passes: 15, iterations: 100, no_below: 2, no_above: 0.5 },
      ldaResult: null,
      ldaError: null,
      topics: [
        { id:0, label:'成分与配方透明', share:40, keywords:[
          {word:'成分',weight:0.09},{word:'配方',weight:0.08},{word:'配料表',weight:0.07},{word:'检测',weight:0.04},{word:'解读',weight:0.03}
        ], representative_docs:['配料表没看懂，有没有医生能解读一下？','豆芽的成分表我截图发过群'] },
        { id:1, label:'红 PP 应急与医生背书', share:35, keywords:[
          {word:'红PP',weight:0.09},{word:'护臀膏',weight:0.08},{word:'医生',weight:0.06},{word:'推荐',weight:0.05},{word:'儿科',weight:0.03}
        ], representative_docs:['宝宝红 PP 试了松达没用，换豆芽护臀膏就好','儿科医生推荐才买的'] },
        { id:2, label:'老客信任与价格', share:25, keywords:[
          {word:'老客',weight:0.08},{word:'闺蜜',weight:0.06},{word:'新牌子',weight:0.05},{word:'价格',weight:0.05},{word:'便宜',weight:0.04}
        ], representative_docs:['闺蜜推荐买的，5 年了','抖音上看到但价格比袋鼠妈妈贵'] }
      ],
      wordFreqTop: [
        {word:'成分',count:5},{word:'配方',count:4},{word:'红PP',count:4},{word:'医生',count:3},{word:'推荐',count:3},
        {word:'老客',count:3},{word:'价格',count:2},{word:'护臀膏',count:2},{word:'闺蜜',count:2},{word:'检测',count:2}
      ],
      stats: { raw_count: 10, valid_count: 10, total_words: 142, vocab_size: 38, coherence: 0.45 },
      painMap: [
        { id:'pa1', pain:'成分表看不懂，担心不安全', evidence:'配料表没看懂，有没有医生能解读',
          frequency:'高', linkedNeeds:['成分透明','医生背书'], linkedTopicId:0, type:'痛点' },
        { id:'pa2', pain:'红 PP 反复，试错成本高', evidence:'试了松达没用，换豆芽就好',
          frequency:'高', linkedNeeds:['红 PP 急救','医生推荐'], linkedTopicId:1, type:'痛点' },
        { id:'pa3', pain:'新牌子不敢试，需要信任锚点', evidence:'我买豆芽是看老客评论多，新牌子不敢试',
          frequency:'中', linkedNeeds:['老客背书','品牌历史'], linkedTopicId:2, type:'痛点' },
        { id:'pa4', pain:'价格相对竞品偏高', evidence:'抖音上看到但价格比袋鼠妈妈贵',
          frequency:'中', linkedNeeds:['价值证明'], linkedTopicId:2, type:'痒点' },
        { id:'pa5', pain:'想要试用装降低首次决策成本', evidence:'红 PP 严重不敢直接买，想要试用装',
          frequency:'中', linkedNeeds:['试用装'], linkedTopicId:1, type:'痒点' }
      ]
    },
    candidates: [
      { id:'c1', name:'成分透明配方', pain:'成分焦虑',
        description:'每件产品展示完整成分表+检测报告+配方白名单',
        evidence:'10 篇评论中 5 篇提及成分',
        desirabilityScore: 8.7, implementabilityScore: 8.7,
        desiredBy:['p1','p3'], competitiveEdge:'5 年配方稳定 + 5 万老客基础' },
      { id:'c2', name:'儿科医生背书', pain:'信任门槛',
        description:'三甲医院儿科医生推荐+在线问诊+医生解读成分',
        evidence:'3 篇评论提及医生推荐',
        desirabilityScore: 8.0, implementabilityScore: 7.0,
        desiredBy:['p3'], competitiveEdge:'儿科医生合作是护城河' },
      { id:'c3', name:'红 PP 急救包', pain:'红 PP 反复',
        description:'护臀膏试用装+皮肤咨询+无效退款',
        evidence:'4 篇评论提及红 PP',
        desirabilityScore: 8.3, implementabilityScore: 8.3,
        desiredBy:['p1','p3'], competitiveEdge:'急救包形态比单件护臀膏更易触达' },
      { id:'c4', name:'抖音成分实验室', pain:'新客难触达',
        description:'抖音"成分实验室"系列内容（30 秒短剧+配方表动画）',
        evidence:'内部策略，无评论',
        desirabilityScore: 6.7, implementabilityScore: 8.0,
        desiredBy:['p1','p2'], competitiveEdge:'抖音空白红利窗口' }
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
        { from:'贝亲客户', to:'c1', reason:'同价格带, 豆芽补足成分透明', cost:5 },
        { from:'松达客户', to:'c1', reason:'山茶油成分党迁移到豆芽配方', cost:6 },
        { from:'戴可思客户', to:'c3', reason:'金盏花成分派迁移到红 PP 急救', cost:7 }
      ]
    },
    proposition: {
      coreValueIds:['c1','c2','c3','c4'],
      alternatives:[
        {id:'a1', text:'看得见的成分，安心的呵护。'},
        {id:'a2', text:'成分党妈妈，选豆芽。'},
        {id:'a3', text:'5 年妈妈，5 年放心。'}
      ],
      chosenValueText: '看得见的成分，安心的呵护。',
      positioning: {
        brand: '豆芽妈妈',
        audience: '25-35 岁精致妈妈/成分党',
        coreValue: '成分透明+医生背书+红 PP 急救',
        category: '国货婴幼儿洗护专业品牌'
      },
      positioningStatement: '对于 25-35 岁精致妈妈/成分党, 豆芽妈妈是唯一一个用 5 年配方稳定 + 完整成分表 + 儿科医生背书 + 红 PP 急救包, 让"看得见的成分, 安心的呵护"落到实处的国货婴幼儿洗护专业品牌。',
      sloganOptions: [
        {text:'看得见的成分，安心的呵护', source:'agent'},
        {text:'成分党妈妈，选豆芽', source:'user'},
        {text:'5 年妈妈，5 年放心', source:'user'}
      ],
      chosenSlogan: '看得见的成分，安心的呵护',
      mbti: 'ISFJ (守护者型 — 偏温暖、专业、稳定)',
      personalityTraits: ['安心','专业','透明','温暖','信任']
    }
  };

  if(typeof window!== 'undefined') window.__case_douya_mama_work3 = data;
})();
