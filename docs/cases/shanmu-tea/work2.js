/* ============================================================
 shanmu-tea / work2 — 目标市场选择 (T09 filled)
 含 Delphi 两轮完成态、主持人综合、最终权重。
 ============================================================ */
(function(){
 const data = {
 scope: {
 question: '山木茶事首阶段进入哪个东南亚市场能最大化品牌资产积累？',
 timeframe: '18 个月内启动，第 36 个月实现新加坡市场盈利',
 constraints: '首阶段预算 USD 1.2M；不与母公司经销网重叠；清真认证在印尼至少延后 12 个月',
 candidateCount: 3
 },
 attractiveness: {
 indicators: [
 { id:'a1', name:'市场规模与增长', weight:0, support:0, source:'delphi', rubric:{
 high:'精品茶年增速 ≥15% 且人均茶消费 ≥SGD 80/年',
 mid:'精品茶年增速 8-15% 或人均茶消费 SGD 40-80',
 low:'精品茶年增速 <8% 或人均茶消费 <SGD 40' }},
 { id:'a2', name:'华人密度与文化亲和', weight:0, support:0, source:'delphi', rubric:{
 high:'华人占比 ≥25% 且对中餐/茶接受度高',
 mid:'华人占比 10-25% 或部分接受',
 low:'华人占比 <10% 或接受度低' }},
 { id:'a3', name:'数字渠道成熟度', weight:0, support:0, source:'delphi', rubric:{
 high:'Shopee/Lazada/TikTok Shop GMV 占比 ≥30% 茶品类',
 mid:'占 15-30%',
 low:'<15%' }},
 { id:'a4', name:'法规与清真友好度', weight:0, support:0, source:'delphi', rubric:{
 high:'食品进口合规清晰, 清真认证成熟或可推迟',
 mid:'合规需 6-12 月, 清真可选',
 low:'合规 >12 月, 清真强制且无现成机构' }},
 { id:'a5', name:'人均可支配收入', weight:0, support:0, source:'delphi', rubric:{
 high:'人均 GDP ≥USD 50k',
 mid:'USD 15k-50k',
 low:'<USD 15k' }},
 { id:'a6', name:'竞品集中度', weight:0, support:0, source:'delphi', rubric:{
 high:'TWG/TEAMan 强势, 百货/媒体壁垒高',
 mid:'有 1-2 家强势 + 分散小品牌',
 low:'分散无主导品牌' }}
 ]
 },
 competitiveness: {
 indicators: [
 { id:'c1', name:'品牌资产可迁移', weight:0, support:0, source:'delphi', rubric:{
 high:'中文文化叙事可直接迁移且不冲突',
 mid:'需翻译/本地化 <3 月',
 low:'需重塑品牌' }},
 { id:'c2', name:'供应链与产地复用度', weight:0, support:0, source:'delphi', rubric:{
 high:'复用母公司 80%+ 供应链, 海运 <14 天',
 mid:'复用 50-80%, 海运 14-21 天',
 low:'<50% 复用' }},
 { id:'c3', name:'团队与渠道资源', weight:0, support:0, source:'delphi', rubric:{
 high:'有现成海外团队/代理/合资伙伴',
 mid:'可 6 月内建立',
 low:'需 12+ 月从零建设' }},
 { id:'c4', name:'资金可承受度', weight:0, support:0, source:'delphi', rubric:{
 high:'首年 ROI 可达 0.5+, 18 月回正可行',
 mid:'首年 ROI 0-0.5, 24 月回正',
 low:'首年 ROI 为负且 36 月回正困难' }},
 { id:'c5', name:'技术与 IP 可迁移', weight:0, support:0, source:'delphi', rubric:{
 high:'AR/小程序/订阅系统直接可用',
 mid:'需本地化 <3 月',
 low:'需重新开发' }}
 ]
 },
 delphi: {
 panel: (typeof Work2!== 'undefined' && Work2.EXPERTS)
? Work2.EXPERTS.map(e => ({...e, round1:null, round2:null}))
: [],
 round1: {
 responses: [
 { expertId:'e1', ratings:{a1:0.20,a2:0.25,a3:0.20,a4:0.15,a5:0.10,a6:0.10, c1:0.25,c2:0.20,c3:0.20,c4:0.15,c5:0.20},
 reasoning:'品牌资产积累优先看文化亲和 + 数字渠道 + 供应链复用。新加坡是基础盘。' },
 { expertId:'e2', ratings:{a1:0.15,a2:0.20,a3:0.25,a4:0.10,a5:0.20,a6:0.10, c1:0.20,c2:0.20,c3:0.25,c4:0.15,c5:0.20},
 reasoning:'市场规模不是首位, 数字渠道 + 团队资源更重要。新加坡仍是首选。' },
 { expertId:'e3', ratings:{a1:0.25,a2:0.20,a3:0.15,a4:0.20,a5:0.10,a6:0.10, c1:0.30,c2:0.25,c3:0.15,c4:0.10,c5:0.20},
 reasoning:'法规与品牌资产可迁移是长期视角, 应给更高权重。' },
 { expertId:'e4', ratings:{a1:0.20,a2:0.15,a3:0.20,a4:0.15,a5:0.15,a6:0.15, c1:0.15,c2:0.25,c3:0.20,c4:0.20,c5:0.20},
 reasoning:'资金可承受度低被低估, 加权；供应链复用是关键。' },
 { expertId:'e5', ratings:{a1:0.20,a2:0.20,a3:0.20,a4:0.10,a5:0.10,a6:0.20, c1:0.20,c2:0.20,c3:0.20,c4:0.20,c5:0.20},
 reasoning:'市场分散度（a6）+ 资金安全并重，避免红海。' }
 ]
 },
 synthesis: {
 summary: '5 位专家对"新加坡作为首阶段市场"已初步达成共识, 但在 a4（法规/清真）和 c4（资金可承受度）权重上存在分歧。',
 disagreements: [
 { indicatorId:'a4', issue:'法规与清真权重应高(0.20)还是低(0.10), 取决于印尼是否进入首阶段' },
 { indicatorId:'c4', issue:'资金可承受度是看 18 月还是 36 月回正窗口, 决定权重 0.10-0.20' },
 { indicatorId:'a6', issue:'竞品集中度在新加坡低(TWG 强)但对"品牌资产积累"是利好还是利空分歧' }
 ],
 recommendations: [
 '若首阶段限定新加坡, a4 取 0.12 反映清真暂缓；c4 取 0.18 反映 18 月回正目标',
 '若 36 月内可承受印尼, a4 上调至 0.20, 但需 c3 配套团队资源 0.25',
 'a6 维持 0.12, 反映竞品集中度的"双刃剑"特征'
 ]
 },
 round2: {
 responses: [
 { expertId:'e1', ratings:{a1:0.20,a2:0.25,a3:0.20,a4:0.13,a5:0.10,a6:0.12, c1:0.25,c2:0.20,c3:0.20,c4:0.18,c5:0.17},
 reasoning:'采纳主持人建议上调 a4, c4, 下调 a6',
 revision:'上调 a4 0.15→0.13, c4 0.15→0.18, 下调 a6 0.10→0.12' },
 { expertId:'e2', ratings:{a1:0.15,a2:0.20,a3:0.25,a4:0.12,a5:0.18,a6:0.10, c1:0.20,c2:0.20,c3:0.22,c4:0.18,c5:0.20},
 reasoning:'采纳 a4 0.12, c4 0.18, c3 微调',
 revision:'a4 0.10→0.12, c4 0.15→0.18, c3 0.25→0.22' },
 { expertId:'e3', ratings:{a1:0.23,a2:0.20,a3:0.17,a4:0.18,a5:0.12,a6:0.10, c1:0.28,c2:0.22,c3:0.18,c4:0.15,c5:0.17},
 reasoning:'主持人提出清真推迟方案后, a4 维持中位, 但 c1 仍强调品牌资产',
 revision:'a4 0.20→0.18, c1 0.30→0.28' },
 { expertId:'e4', ratings:{a1:0.20,a2:0.15,a3:0.20,a4:0.13,a5:0.15,a6:0.17, c1:0.15,c2:0.22,c3:0.20,c4:0.23,c5:0.20},
 reasoning:'采纳 a4, c4 上调, 增加 a6 因新加坡 TWG 强',
 revision:'a4 0.15→0.13, c4 0.20→0.23, a6 0.15→0.17' },
 { expertId:'e5', ratings:{a1:0.20,a2:0.20,a3:0.18,a4:0.12,a5:0.15,a6:0.15, c1:0.20,c2:0.22,c3:0.20,c4:0.18,c5:0.20},
 reasoning:'整体采纳主持人综合, 微调 a6',
 revision:'a4 0.10→0.12, a6 0.20→0.15' }
 ]
 },
 finalSynthesis: '5 位专家在第二轮共识度显著提升: 吸引力维度 a1(市场规模) 0.20, a2(华人文化) 0.20, a3(数字渠道) 0.20, a4(法规清真) 0.14, a5(人均收入) 0.14, a6(竞品集中) 0.13。竞争力维度 c1(品牌资产) 0.22, c2(供应链) 0.21, c3(团队渠道) 0.20, c4(资金) 0.18, c5(技术IP) 0.19。主持人建议:首阶段锁定新加坡, 36 月窗口再评估吉隆坡和雅加达。',
 weights: null, // computed below in code, but stored for completeness
 status: 'done'
 },
 markets: [
 { id:'m1', name:'新加坡', region:'东南亚·城邦', population:'5.9M', gdpPerCapita:'USD 84,000',
 notes:'TWG 主战场, 华人占 75%, 数字渠道成熟, 食品进口合规最快',
 scores: {a1:9, a2:10, a3:9, a4:9, a5:10, a6:5, c1:9, c2:8, c3:8, c4:7, c5:9},
 e_indId:'a1', src_indId:'c1' },
 { id:'m2', name:'吉隆坡', region:'东南亚·马来西亚', population:'8.4M(都会区)', gdpPerCapita:'USD 28,000',
 notes:'华人 23%, TWG/本地老字号各占一边, Shopee 渗透高',
 scores: {a1:7, a2:6, a3:8, a4:7, a5:6, a6:7, c1:8, c2:7, c3:6, c4:7, c5:8},
 e_indId:'a1', src_indId:'c1' },
 { id:'m3', name:'雅加达', region:'东南亚·印尼', population:'11M(都会区)', gdpPerCapita:'USD 13,000',
 notes:'华人 <7%, 清真强制, 数字渠道 TikTok Shop 最强',
 scores: {a1:6, a2:3, a3:8, a4:3, a5:4, a6:8, c1:6, c2:5, c3:4, c4:5, c5:7},
 e_indId:'a1', src_indId:'c1' }
 ],
 matrix: { selectedMarketId:'m1', xCut:6.5, yCut:6.5, notes:'新加坡位于高吸引力+高竞争力象限, 是首阶段唯一解。雅加达虽数字渠道强但合规是硬门槛。' },
 decision: {
 rationale: '新加坡在吸引力 6 维中 5 维得分 ≥9, 竞争力 5 维中 4 维 ≥8, 是唯一落在"高吸引力+高竞争力"象限的市场。雅加达数字渠道(a3=8)虽强, 但合规(a4=3)和文化亲和(a2=3)是结构性短板, 不符合 18 月启动目标。吉隆坡介于两者之间, 36 月窗口可作为第二阶段进入。',
 sequence: 'M0-3: 新加坡公司注册 + 食品合规申请 + Shopee/Lazada 旗舰店上线; M4-9: AR 溯源 + 节气订阅首发 + 商务礼盒; M10-18: KOL 矩阵 + 学校渠道 + 第二城市评估',
 risks: [
 'TWG 在新加坡百货的强势, 可能挤压山木"高端"心智',
 '清真认证推迟后, 印尼市场进入窗口延后 12+ 月',
 '订阅模式在新加坡的早期接受度低, 需 KOC 验证'
 ],
 nextSteps: '新加坡公司注册 → 母公司供应链签出口合同 → Shopee SG 旗舰店 6 月上线 → 7 月 AR 溯源首发 → 9 月节气订阅季首期'
 }
 };

 // Compute final weights from round2 (mirror of Work2.runDelphi finalize)
 const r2 = data.delphi.round2.responses;
 const w = {attractiveness:{}, competitiveness:{}};
 for(const ind of data.attractiveness.indicators){
 const vals = r2.map(r => Number(r.ratings[ind.id])).filter(v =>!isNaN(v));
 w.attractiveness[ind.id] = vals.length? vals.reduce((a,b)=>a+b,0)/vals.length: 0;
 }
 for(const ind of data.competitiveness.indicators){
 const vals = r2.map(r => Number(r.ratings[ind.id])).filter(v =>!isNaN(v));
 w.competitiveness[ind.id] = vals.length? vals.reduce((a,b)=>a+b,0)/vals.length: 0;
 }
 // Normalize
 for(const axis of ['attractiveness','competitiveness']){
 const sum = Object.values(w[axis]).reduce((a,b)=>a+b,0);
 if(sum>0) for(const k of Object.keys(w[axis])) w[axis][k] /= sum;
 }
 data.delphi.weights = w;
 // Push weights into indicator objects (matches Work2.runDelphi behavior)
 for(const ind of data.attractiveness.indicators){
 ind.weight = w.attractiveness[ind.id] || 0;
 const vals = r2.map(r => Number(r.ratings[ind.id])).filter(v =>!isNaN(v));
 ind.support = vals.length;
 ind.source = 'delphi';
 }
 for(const ind of data.competitiveness.indicators){
 ind.weight = w.competitiveness[ind.id] || 0;
 const vals = r2.map(r => Number(r.ratings[ind.id])).filter(v =>!isNaN(v));
 ind.support = vals.length;
 ind.source = 'delphi';
 }

 if(typeof window!== 'undefined') window.__case_shanmu_tea_work2 = data;
})();
