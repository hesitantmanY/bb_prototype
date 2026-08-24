/* ============================================================
 shanmu-tea / work4 — 营销组合 (T09 filled)
 ============================================================ */
(function(){
 const data = {
 route: {
 scope: 'global', // 'global' | 'domestic'
 oemType: 'OBM', // OEM | ODM | OBM | EMS
 entryMode: 'greenfield', // export | licensing | franchise | contract-mfg | jv | acquisition | greenfield
 light: ['philosophy'],
 politicalPower: '' // not applicable for greenfield in target market
 },
 product: {
 name: '山木茶事',
 description: '8 期节气茶单 + AR 茶师溯源 + 东方美学茶具, 让"送礼与自饮都讲得出故事"的高端原叶茶品牌。',
 coreDifferentiators: [
 '8 期节气内容 IP, 12 位签约茶师 3 年独家',
 'AR 茶师溯源, 每一片叶子可查到茶山与茶师',
 '订阅可跳过, 透明 SKU, 学生价入门款',
 '陶瓷联名茶具 + 故事卡, 文化场景可分享'
 ],
 physicalFeatures: '陶瓷密封罐 + 铝箔独立小袋 + NFC 标签 + 礼盒纸套',
 serviceOffering: '节气茶单订阅 / 单盒购买 / 商务礼盒定制 / 学校节气课程包',
 technologyMoat: 'AR 溯源小程序 + 订阅跳过系统 + 茶师 IP 数字资产',
 skus: [
 {sku:'S1', name:'节气入门款 8 期/月', priceSGD:68, audience:'学生/年轻创作者'},
 {sku:'S2', name:'节气标准款 8 期/月', priceSGD:128, audience:'都市中产/自饮'},
 {sku:'S3', name:'商务礼盒 1 盒', priceSGD:288, audience:'企业客户'},
 {sku:'S4', name:'陶瓷联名茶具套装', priceSGD:198, audience:'设计爱好者'},
 {sku:'S5', name:'学校节气课程包', priceSGD:498, audience:'中小学'}
 ],
 aiResult: '',
 businessType: 'physical',
 certifications: '新加坡 SFA 食品进口注册 + Halal 推迟 (印尼 12 月后)',
 localization: '英文/中文双语包装 + IG/TikTok 内容本地化',
 serviceLocalization: '客服 WeChat + WhatsApp 双通道',
 people: '本地茶师 3 位 + 数字运营 4 位 + 销售 3 位 (新加坡)',
 process: '母公司供应链 → 海运 14 天 → 新加坡仓 → Shopee + 独立站',
 physicalEvidence: '陶瓷罐可作桌面摆件; 礼盒可作收礼展示; AR 体验可发 IG 故事'
 },
 price: {
 strategy: '价值定价 (Premium Value Pricing)',
 strategyNote: '比 TWG 低 15-20%, 比 TEAMan 高 100%, 锚定"有故事可分享的中高端"。',
 tiers: [
 {tier:'入门', rangeSGD:'SGD 60-80/月', note:'学生/创作者, 拉新入口'},
 {tier:'标准', rangeSGD:'SGD 100-150/月', note:'主力, 都市中产订阅'},
 {tier:'礼盒', rangeSGD:'SGD 200-500/盒', note:'商务礼赠, 毛利最高'}
 ],
 channelPricing: 'Shopee 旗舰店与独立站同价; Shopee 节日活动允许 8 折一次/月',
 promotions: [
 'M3 开业: 订阅首月半价',
 'M9 中秋: 礼盒买 2 送 1 (限商务渠道)',
 'M12 周年: 学生装免运费'
 ],
 competitorPrices: 'TWG SGD 55-120/100g, 山木 SGD 80-180/100g (定位中高端)',
 aiResult: '',
 ppp: '在马来西亚与印尼市场暂以新加坡价格 80% 切入, 后续根据本地化成本上浮',
 pricingNumbers: '客单价 SGD 130, 复购率目标 35%, LTV/CAC 目标 ≥3',
 fxSensitivity: 'SGD/USD 波动 5% 范围内不影响定价; CNY/SGD 升值 10% 需上调 5%'
 },
 place: {
 onlineSelf: [
 {name:'山木独立站', region:'全球华人', share:25, notes:'Shopify + Klaviyo + 故事型落地页'},
 {name:'山木小程序', region:'新加坡/马来西亚华人', share:15, notes:'微信生态, AR 溯源入口'}
 ],
 onlineThird: [
 {name:'Shopee SG', region:'新加坡', share:30, notes:'主战场, B2C 主力'},
 {name:'Lazada SG', region:'新加坡', share:10, notes:'品牌店, 配合节日活动'},
 {name:'TikTok Shop', region:'新马印', share:15, notes:'内容种草 + 直播'}
 ],
 onlineNotes: 'Shopee + 独立站双前台, 库存/价格统一, TikTok 走 KOC 内容',
 offlineDirect: [
 {name:'山木茶室 @ ION Orchard', region:'新加坡', share:5, notes:'快闪 + 体验中心, 18 月内' }
 ],
 offlineDistrib: [
 {name:'Tang Plaza 食品区', region:'新加坡', share:0, notes:'12 月起, 谈判中'}
 ],
 offlineRetail: [],
 offlineNotes: '线下作为体验和礼赠, 不作为销量主战场',
 keyPartners: [
 {name:'Shopee SG', role:'B2C 主战场'},
 {name:'WeChat Pay SG', role:'华人支付'},
 {name:'新加坡旅游局', role:'节气文化节合作'},
 {name:'南洋理工大学', role:'节气课程试点'}
 ],
 channelIncentives: 'Shopee 旗舰店首年免佣金, 18 月后回到 6%; KOL 合作 CPS 15-25%',
 structure: [
 {name:'线上', children:[
 {name:'自营', share:40},
 {name:'平台', share:45}
 ]},
 {name:'线下', children:[
 {name:'自营快闪', share:5},
 {name:'经销', share:10}
 ]}
 ],
 aiResult: '',
 localChannelRelations: '母公司过去无东南亚经销, 需从零建设; 优先选择愿意投入 AR/内容共建的渠道方'
 },
 promotion: {
 advertising: [
 {channel:'Shopee 内', format:'品牌广告 + 直播切片', budgetSGD:'8,000/月'},
 {channel:'IG / TikTok', format:'KOC + 节气短剧', budgetSGD:'12,000/月'},
 {channel:'Google Search', format:'节气 + 原叶茶 关键词', budgetSGD:'3,000/月'}
 ],
 pr: [
 {event:'新加坡 F1 周末礼盒', note:'高端曝光, 目标商务客群'},
 {event:'中秋/教师节 学校节气课', note:'公关+教育场景双重'},
 {event:'茶师纪录片(YouTube 8 集)', note:'内容资产, 长期 SEO'}
 ],
 salesPromotion: [
 {type:'订阅首月半价', period:'M3-M5', note:'拉新'},
 {type:'礼盒买 2 送 1', period:'M9 中秋', note:'清库存 + 拓 B 端'},
 {type:'学生价入门款', period:'长期', note:'社群建设'}
 ],
 crm: {
 tool: 'Klaviyo (邮件) + 微信群 (社群)',
 membership: '节气会员, 12 期茶单订阅者进入"节气生活家"社群',
 repurchase: '订阅 8 期后自动续, 跳过 1 月无碍; 12 月未复购触发召回邮件',
 notes: '首阶段不做积分, 避免把文化品牌做成折扣品牌'
 },
 contentStrategy: '节气 + 茶师 + 客户场景三轮内容; IG/TikTok 主战场, 故事卡 + AR 体验',
 aiResult: '',
 theme: '"节气可溯源, 茶有故事"',
 context: '新加坡 + 25-40 岁城市华人/文化爱好者 + 中高端',
 taboos: '不做低价促销 (破坏品牌感); 不打"养生药效" (合规风险); 不与连锁商超合作 (调性不符)',
 kolTiers: [
 {tier:'头部 KOL', example:'@jeanniewee (生活/文化, 200k 粉丝)', budgetSGD:'5,000-15,000/篇', role:'品牌叙事'},
 {tier:'腰部 KOC', example:'10 位 @xxtea (15-50k 粉丝)', budgetSGD:'500-2,000/篇', role:'场景种草'},
 {tier:'学校教师', example:'Ms. Lim 类 + 5 所学校', budgetSGD:'赠送 100 份课程包', role:'教育渗透'}
 ],
 language: '英文 (IG/TikTok/Shopee) + 中文 (小程序/WeChat/企业礼赠)'
 }
 };

 if(typeof window!== 'undefined') window.__case_shanmu_tea_work4 = data;
})();
