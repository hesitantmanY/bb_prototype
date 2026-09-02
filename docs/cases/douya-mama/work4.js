/* ============================================================
 douya-mama / work4 — 营销组合 4P
 数据源：docs/demo-data.js douya.work4（cases/ 拆分迁移，2026-09-01）。
 形状匹配 Work4.defaultData()；defaultData 比本数据新增的字段
 （如 ppp/fxSensitivity/localChannelRelations/adoptedSegments）由 Cases.load deepMerge 兜底。
 ============================================================ */
(function(){
  const data = {
    route:{
      scope:'domestic',           // 豆芽妈妈是国内品牌，本阶段聚焦国内市场
      oemType:'OBM',              // 有自有品牌（豆芽妈妈），从研发到品牌营销全链条
      entryMode:'',
      light:[],
      politicalPower:''
    },
    product:{
      name:'豆芽妈妈婴幼儿洗护系列',
      description:'0-3 岁婴幼儿洗护全品类，成分透明+配方安心',
      coreDifferentiators:['成分透明展示','儿科医生背书','红 PP 急救','5 年配方稳定'],
      physicalFeatures:'无泪配方 / 无香精 / 通过敏感肌测试 / 包装可溯源二维码',
      serviceOffering:'7 天无理由 / 在线儿科咨询 / 成分查询小程序',
      technologyMoat:'5 年 OEM 配方数据库 + 儿科医生顾问团',
      skus:[
        {name:'洗发沐浴二合一', specs:'300ml', price_range:'88-128 元', differentiator:'无泪配方'},
        {name:'护臀膏', specs:'50g', price_range:'108-158 元', differentiator:'氧化锌配方+红 PP 急救'},
        {name:'洗面奶（0+）', specs:'100g', price_range:'98-138 元', differentiator:'氨基酸温和'},
        {name:'待产包礼盒', specs:'6 件套', price_range:'588-888 元', differentiator:'颜值+全套'}
      ]
    },
    price:{
      strategy:'value',
      strategyNote:'中端定价，强调成分与安全的价值感；待产包礼盒承接高客单。',
      tiers:[
        {name:'日常单件', targetSegment:'复购老客', price:88, unit:'元/件', notes:''},
        {name:'核心单品', targetSegment:'新客转化', price:128, unit:'元/件', notes:'护臀膏'},
        {name:'待产包礼盒', targetSegment:'新手妈妈', price:688, unit:'元/套', notes:'6 件套'}
      ],
      channelPricing:[
        {channel:'淘宝旗舰店', priceAdjustment:'与官网同价', rationale:'维护品牌价格'},
        {channel:'抖音直播间', priceAdjustment:'首发立减 30', rationale:'拉新'},
        {channel:'小红书', priceAdjustment:'挂车链接 9 折', rationale:'种草转化'}
      ],
      promotions:[
        {occasion:'双 11', discount:'待产包礼盒立减 100', period:'11.1-11.11'},
        {occasion:'618', discount:'单件 8.5 折', period:'6.1-6.18'}
      ],
      competitorPrices:'贝亲 100-250；红色小象 80-150；松达 60-120；戴可思 70-140；袋鼠妈妈 50-100'
    },
    place:{
      onlineSelf:['淘宝旗舰店','抖音旗舰店'],
      onlineThird:['天猫','京东','拼多多'],
      onlineNotes:'淘宝为主阵地，抖音为新增长极；天猫维持品牌',
      offlineDirect:['高端母婴店展示'],
      offlineDistrib:['精品超市'],
      offlineRetail:[],
      offlineNotes:'第一年以线上为主，线下仅做品牌展示',
      keyPartners:['小红书 KOC','儿科医生顾问','抖音直播 MCN'],
      channelIncentives:'KOC 寄送样品+佣金 15%；MCN 直播坑位费 + GMV 提成 5%',
      structure:[
        {name:'线上', children:[{name:'淘宝', share:55},{name:'抖音', share:25},{name:'其他', share:20}]}
      ]
    },
    promotion:{
      theme:'看得见的成分，安心的呵护',
      advertising:[
        {media:'抖音短视频', budgetShare:40, message:'成分透明实验', kpi:'GMV/ROAS'},
        {media:'小红书 KOC', budgetShare:25, message:'真实使用+成分表', kpi:'互动率'},
        {media:'淘宝直通车', budgetShare:20, message:'复购优惠', kpi:'ROI'},
        {media:'直播带货', budgetShare:15, message:'红 PP 急救包', kpi:'转化率'}
      ],
      pr:[
        {event:'儿科医生直播+成分解读', timing:'每月 1 次', expectedReach:'50 万妈妈群体'}
      ],
      salesPromotion:[
        {tactic:'老客 9 折', mechanic:'私域推送', period:'每月'},
        {tactic:'待产包立减 100', mechanic:'预产期前 1 月', period:'全年'}
      ],
      crm:{tool:'企业微信+淘宝 CRM', membership:'VIP 妈妈群（消费满 2000）', repurchase:'每 60 天推送适配产品', notes:'老客复购是基本盘'},
      contentStrategy:'抖音"成分实验室"系列 + 小红书"妈妈真实体验"系列 + 淘宝"配方溯源"长图。'
    }
  };

  if(typeof window!== 'undefined') window.__case_douya_mama_work4 = data;
})();
