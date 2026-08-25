/* ============================================================
   DEMO DATA — 多 case 演示数据
   中小企业市场分析与品牌布局工具

   cases:
     douya     - 豆芽妈妈（消费品 / 母婴洗护，详细）
     xiaohuo   - 小镬记（餐厅 / 粤菜融合，meta only）
     wenqu     - 问渠书院（教育 / 培训，meta only）
     hengrui   - 恒锐精密（制造 / 专精特新，meta only）
     maohaizi  - 毛孩子之家（本地生活 / 宠物，meta only）

   使用：
     DemoData.list()             → 列出所有 case
     DemoData.inject(key, state) → 把指定 case 注入到 state
   ============================================================ */
// 5 个 case 的问卷统计：survey 的 IIFE 计算后存这里，analysis 再合并（旧版误用未定义的 s 传值，加载即 ReferenceError）
var DOUYA_STATS = null;
var XIAOHUO_STATS = null;
var WENQU_STATS = null;
var HENGRUI_STATS = null;
var MAOHAIZI_STATS = null;
const DemoData = {
  cases: {

    /* ============================================================
       豆芽妈妈 — 母婴洗护，详细数据
       ============================================================ */
    douya: {
      meta: {
        name: '豆芽妈妈',
        industry: '消费品 / 母婴洗护',
        tagline: '淘宝 5 年老店的渠道升级与品牌年轻化',
        description: '杭州豆芽母婴用品有限公司，专注 0-3 岁婴幼儿洗护，淘宝 5 年老店，年营收 1200 万，纠结要不要把团队一半精力从淘系转抖音。',
        valueChain: {
          curve: '消费品 / 母婴洗护',
          nodes: [
            {label:'配方研发',  v:8.5, tip:'成分/功效/感官定义 — 最高附加值'},
            {label:'原料采购',  v:5.0, tip:'原料溯源/包材/稳定供应链'},
            {label:'OEM代工',   v:3.0, tip:'代工厂生产 — 微笑曲线谷底'},
            {label:'电商履约',  v:4.0, tip:'仓配/快递/退换货'},
            {label:'品牌/营销', v:9.0, tip:'种草/直播/复购 — 最高附加值'},
            {label:'客服/会员', v:5.5, tip:'私域CRM/复购激励/口碑'}
          ]
        },
        ready: true
      },
      work1: {
        sbu: {
          name: '豆芽妈妈',
          category: '母婴洗护（婴幼儿洗浴+护肤+护臀）',
          stage: '成长期',
          scope: '国内',
          countries: ['中国'],
          summary: '杭州豆芽母婴用品有限公司，专注 0-3 岁婴幼儿洗护，淘宝 5 年老店，8 人团队，年营收 1200 万，复购率 38%。',
          threeQuestions: {customer: true, channel: true, brand: true},
          boundary: '客户：与 0-3 岁婴幼儿洗护场景用户区隔（不做 3+ 岁儿童、不做孕妇专用、不做婴幼玩具）；渠道：淘宝/天猫母婴为主，不依赖线下母婴店；品牌：豆芽妈妈为独立品牌，不与母公司其他品类共用 logo；损益：豆芽独立核算，复用母公司 OEM 供应链与质检体系。'
        },
        environment: {
          political: '婴幼儿化妆品监管持续收紧，《儿童化妆品监督管理条例》要求配方安全备案、原料白名单；小红书/抖音违规宣传查处力度加大。',
          economic: '出生率持续下降（2023 年新生儿 902 万，同比降 5.6%），但客单价上升、精致育儿消费升级；母婴整体市场 2023 年约 4 万亿，洗护细分约 600 亿。',
          social: '90/95 后妈妈成为主力（占比 60%+），成分党、敏感肌关注度提升；小红书/抖音种草驱动决策；男性参与育儿比例上升。',
          technological: 'AI 客服、私域 SCRM、内容种草工具成熟；抖音电商 GMV 持续增长（2023 年母婴品类增长 35%+）；直播带货成为新流量入口。',
          industry: '头部品牌贝亲（外资）、红色小象（上美）、松达、戴可思；国货新锐崛起；价格带分高端（贝亲 100+）、中端（红色小象 80-150）、性价比（袋鼠妈妈 50-100）。',
          basics: {
            scale: { actual: '8 人团队（运营 3/设计 1/客服 2/仓储 1/老板 1），年营收 1200 万', target: '15 人团队，年营收 2500 万', source: '内部台账' },
            scope: { actual: '婴幼儿洗浴+护肤+护臀，不做玩具/辅食/孕妇', target: '增加婴幼儿防晒、亲子共护线', source: '战略规划' },
            products: { actual: '洗发沐浴二合一、护臀膏、洗面奶、爽身粉', target: '+ 婴幼儿防晒、亲子共护', source: '产品路线图' },
            customers: { actual: '淘宝 5 年老客为主，复购率 38%', target: '新增抖音精致妈妈客户群', source: '用户调研' },
            supply: { actual: 'OEM 代工 3 家（华东），配方稳定', target: '保留 1 家 + 新增 1 家华南 OEM', source: '供应链' },
            performance: {
              share: { actual: '淘宝母婴洗护细分 0.5%', target: '1.2%（抖音新客+老客复购）', source: '目标推导' },
              roi: { actual: '1.4', target: '1.6', source: '财务模型' },
              growth: { actual: '年增 15%', target: '年增 30%（抖音带动）', source: '行业基准 + 抖音红利' }
            }
          },
          competitors: [
            { id:'c1', name:'贝亲 Pigeon', price:'100-250 元/件', strengths:'外资品牌、渠道渗透深、医生背书', weaknesses:'国货情怀弱、价格高、年轻化不足', position:'在"国货成分党"上错位' },
            { id:'c2', name:'红色小象（上美）', price:'80-150 元/件', strengths:'国货老牌、综艺植入、全渠道', weaknesses:'成分透明度待提升、年轻化中', position:'以"成分透明 + 配方溯源"差异化' },
            { id:'c3', name:'松达', price:'60-120 元/件', strengths:'山茶油成分口碑好、复购高', weaknesses:'品牌年轻化弱、抖音布局慢', position:'以"山茶油溯源 + 抖音内容种草"追赶' },
            { id:'c4', name:'戴可思', price:'70-140 元/件', strengths:'新锐国货、金盏花成分、年轻妈妈喜爱', weaknesses:'品牌历史短、价格带偏中端', position:'以"5 年老店信任背书"差异化' },
            { id:'c5', name:'袋鼠妈妈', price:'50-100 元/件', strengths:'性价比、孕妇线起家、渠道广', weaknesses:'婴幼儿专业感弱、敏感肌口碑一般', position:'不直接竞争（不同场景）' }
          ],
          ourCapabilities: {
            delivery: 'OEM 3 家代工稳定，但小批量灵活度待提升',
            core: '5 年复购率 38%，老客口碑沉淀',
            brand: '淘宝老客忠诚度高，但抖音/小红书品牌力弱',
            customer: '私域老客群 5 万+',
            compliance: '婴幼儿化妆品备案齐备',
            defensive: '5 年淘宝复购数据 + 配方安全口碑',
            critical: '抖音运营为零，错过新流量红利',
            structural: '团队结构偏淘系运营，缺抖音/内容人才',
            smileCurve: '优势在客户/品牌（复购+口碑），劣势在渠道/营销（缺抖音）——定位为"老客信任驱动 + 抖音新客获取"双轮',
            trends: '成分党、敏感肌、国货新锐、抖音种草、精致育儿'
          }
        },
        personas: [
          { id:'p1', name:'林小满', gender:'女', age:'28', occupation:'互联网产品经理', income:'一线 30 万/年', region:'北京',
            values:['成分透明','敏感肌友好','颜值设计'], painPoints:'宝宝红 PP 反复、担心成分刺激、不知道选哪个',
            channels:['小红书','抖音','淘宝'], quote:'我愿意为成分透明付钱，但不要被收"成分焦虑税"。' },
          { id:'p2', name:'周晓燕', gender:'女', age:'34', occupation:'全职妈妈', income:'二线 15 万/年（家庭）', region:'成都',
            values:['性价比','安全','复购习惯'], painPoints:'价格敏感、囤货焦虑、孩子皮肤换季问题',
            channels:['淘宝','微信群','拼多多'], quote:'我买豆芽 5 年了，换品牌太麻烦。' },
          { id:'p3', name:'苏雅', gender:'女', age:'32', occupation:'中学教师', income:'二线 12 万/年', region:'武汉',
            values:['医生推荐','成分研究','品牌历史'], painPoints:'信任门槛高、被网红种草怕踩雷、需要医生背书',
            channels:['小红书','知乎','微博'], quote:'我要看到成分表和检测报告才敢买。' }
        ],
        scenarios: [
          { id:'sc1', name:'日常洗护囤货', personaIds:['p2'],
            benefits:{usage:'二合一洗发沐浴方便',service:'老客 9 折+免邮',staff:'客服响应快',image:'精打细算的好妈妈'},
            costs:{monetary:'单件 88-128 元',time:'无需挑选',energy:'无',psychic:'成分是否安全'},
            anchor:'省心 + 老客信任', decisiveGap:'成分透明——需在页面突出配方表和检测报告' },
          { id:'sc2', name:'敏感肌/红 PP 应急', personaIds:['p1','p3'],
            benefits:{usage:'护臀膏+成分透明',service:'在线皮肤咨询',staff:'客服专业',image:'研究型妈妈'},
            costs:{monetary:'单件 128-188 元',time:'需研究',energy:'信息过载',psychic:'选错延误宝宝皮肤'},
            anchor:'成分透明 + 医生背书', decisiveGap:'信任——成分表清晰 + 三甲医院儿科推荐' },
          { id:'sc3', name:'新手妈妈待产包', personaIds:['p1'],
            benefits:{usage:'全套洗护+礼盒',service:'待产包组合价',staff:'客服送试用装',image:'有准备的精致妈妈'},
            costs:{monetary:'全套 500-800 元',time:'需研究',energy:'信息过载',psychic:'买错浪费'},
            anchor:'一站式 + 颜值', decisiveGap:'信任——新手妈妈要看到其他妈妈推荐 + 品牌历史' }
        ],
        metrics: {
          disclaimerAcknowledged: true,
          dimensions: [
            { id:'dm1', name:'产品功效·安全', secondaries:[
              { id:'ds1', name:'成分安全与配方透明', measure:'检测报告展示完整度 / 配方白名单', forecast: 7, target: 9 },
              { id:'ds2', name:'宝宝使用效果', measure:'红 PP 缓解率 / 客户复购', forecast: 7, target: 9 },
              { id:'ds3', name:'配送与售后服务', measure:'次日达率 / 客服响应时间', forecast: 6, target: 8 }
            ]},
            { id:'dm2', name:'品牌形象·认知', secondaries:[
              { id:'ds4', name:'品牌知名度', measure:'无提示提及率（妈妈群体%）', forecast: 4, target: 7 },
              { id:'ds5', name:'差异化定位', measure:'能说出差异化的妈妈%', forecast: 5, target: 8 },
              { id:'ds6', name:'口碑传播', measure:'正面 UGC 篇数/月', forecast: 6, target: 8 }
            ]},
            { id:'dm3', name:'品牌形象·判断', secondaries:[
              { id:'ds7', name:'专业可信', measure:'专业度评分', forecast: 7, target: 9 },
              { id:'ds8', name:'配方安心', measure:'成分安心题均分', forecast: 8, target: 9 },
              { id:'ds9', name:'性价比', measure:'性价比评分', forecast: 6, target: 8 }
            ]},
            { id:'dm4', name:'品牌形象·感受', secondaries:[
              { id:'ds10', name:'设计颜值', measure:'包装设计评分', forecast: 7, target: 8 },
              { id:'ds11', name:'品牌温度', measure:'品牌情感题均分', forecast: 7, target: 8 },
              { id:'ds12', name:'信任感', measure:'信任题均分', forecast: 8, target: 9 }
            ]},
            { id:'dm5', name:'品牌共鸣·复购', secondaries:[
              { id:'ds13', name:'社群归属', measure:'私域社群活跃度', forecast: 7, target: 8 },
              { id:'ds14', name:'复购意愿', measure:'年复购率', forecast: 7, target: 8 },
              { id:'ds15', name:'推荐意愿', measure:'NPS', forecast: 6, target: 8 }
            ]}
          ]
        },
        // 16 题李克特问卷（自动生成，与山木茶事同样的结构）
        survey: (function(){
          const anchors=['非常不同意','不同意','一般','同意','非常同意'];
          const qs=[
            {id:'q1', type:'likert', text:'该品牌产品成分表清晰透明，可放心使用', anchors:[...anchors], sourceIndicatorId:'ds1'},
            {id:'q2', type:'likert', text:'该品牌能有效缓解宝宝皮肤问题（红 PP、湿疹）', anchors:[...anchors], sourceIndicatorId:'ds2'},
            {id:'q3', type:'likert', text:'该品牌配送及时、客服响应专业', anchors:[...anchors], sourceIndicatorId:'ds3'},
            {id:'q4', type:'likert', text:'在妈妈群体中我常听到这个品牌', anchors:[...anchors], sourceIndicatorId:'ds4'},
            {id:'q5', type:'likert', text:'该品牌在成分透明、配方安心上有差异化优势', anchors:[...anchors], sourceIndicatorId:'ds5'},
            {id:'q6', type:'likert', text:'我常在小红书/抖音看到该品牌的正面口碑', anchors:[...anchors], sourceIndicatorId:'ds6'},
            {id:'q7', type:'likert', text:'该品牌在婴幼儿洗护上展现专业度', anchors:[...anchors], sourceIndicatorId:'ds7'},
            {id:'q8', type:'likert', text:'我信任该品牌的产品安全性', anchors:[...anchors], sourceIndicatorId:'ds8'},
            {id:'q9', type:'likert', text:'该品牌价格与价值匹配，性价比合理', anchors:[...anchors], sourceIndicatorId:'ds9'},
            {id:'q10',type:'likert', text:'该品牌包装设计美观，符合妈妈审美', anchors:[...anchors], sourceIndicatorId:'ds10'},
            {id:'q11',type:'likert', text:'该品牌让我感到温暖、被理解', anchors:[...anchors], sourceIndicatorId:'ds11'},
            {id:'q12',type:'likert', text:'该品牌让我对产品成分产生信任', anchors:[...anchors], sourceIndicatorId:'ds12'},
            {id:'q13',type:'likert', text:'我愿意加入该品牌的妈妈社群', anchors:[...anchors], sourceIndicatorId:'ds13'},
            {id:'q14',type:'likert', text:'我会持续复购该品牌产品', anchors:[...anchors], sourceIndicatorId:'ds14'},
            {id:'q15',type:'likert', text:'我愿意向新手妈妈推荐该品牌', anchors:[...anchors], sourceIndicatorId:'ds15'},
            {id:'q16',type:'likert', text:'我愿意参与该品牌的内容活动', anchors:[...anchors], sourceIndicatorId:'ds16'}
          ];
          const personas=[
            {p:'p1', base:[5,4,5,4,5,4,5,5,4,5,4,5,4,5,5,4]},
            {p:'p2', base:[4,4,5,3,4,3,4,5,5,4,4,4,4,5,4,3]},
            {p:'p3', base:[5,4,4,3,5,4,5,5,3,4,4,5,3,4,4,3]}
          ];
          const clamp=(v,lo,hi)=>Math.max(lo,Math.min(hi,v));
          const responses=[];
          personas.forEach(p=>{
            for(let r=0;r<3;r++){
              const answers=qs.map((q,i)=>{
                const v=clamp(p.base[i]+Math.round((Math.random()-.5)*2),1,5);
                return {questionId:q.id,value:v};
              });
              responses.push({personaId:p.p, answers});
            }
          });
          const mean=a=>a.reduce((x,y)=>x+y,0)/(a.length||1);
          const sd=a=>{ const m=mean(a); return Math.sqrt(mean(a.map(x=>(x-m)*(x-m)))); };
          const likertStats={};
          qs.forEach(q=>{
            const vals=[]; const dist=[0,0,0,0,0];
            responses.forEach(r=>{ const an=r.answers.find(x=>x.questionId===q.id); const v=parseInt(an?.value); if(!isNaN(v)&&v>=1&&v<=5){vals.push(v);dist[v-1]++;} });
            likertStats[q.id]={mean:+mean(vals).toFixed(2),sd:+sd(vals).toFixed(2),dist,n:vals.length};
          });
          const indicatorMeans=qs.map(q=>({label:q.text.length>18?q.text.slice(0,18)+'…':q.text, value:likertStats[q.id].mean, mean:likertStats[q.id].mean, sourceIndicatorId:q.sourceIndicatorId||null}));
          DOUYA_STATS={likertStats, indicatorMeans};
          return {questions:qs, responses, n:3, status:'done', progress:{done:9,total:9}, error:null, mode:'demo', useFewShot:true, useRag:false, ragContext:''};
        })(),
        analysis: Object.assign({openThemes:[], insights:'1. 配方安全（Q1）与配方安心（Q8）是豆芽妈妈的强项，得分 4.0+。\n2. 品牌知名度（Q4）是核心短板，年轻客户群对豆芽妈妈认知有限。\n3. 价格敏感（Q6）在下沉客户群中突出，但客户愿为"成分透明"付溢价。\n4. 老客复购（Q14）与推荐（Q15）分化明显，5 年老客忠诚度高但新客难触达。\n5. 抖音内容种草是品牌升级的关键渠道，应通过"成分透明 + 真实使用"建立信任。'}, DOUYA_STATS || {}),
        values: {
          functional: ['成分透明','配方安心','复购稳定'],
          emotional: ['妈妈安心','放心选购'],
          social: ['同圈层身份','研究型妈妈'],
          epistemic: ['检测报告展示','配方白名单'],
          conditional: ['新手妈妈','敏感肌宝宝'],
          chosenFunctional: '成分透明与配方安心',
          chosenEmotional: '妈妈安心',
          chosenSocial: '研究型妈妈的精致育儿',
          rationale: '以"成分透明"建立功能可信度，以"妈妈安心"建立情感连接，以"研究型妈妈精致育儿"承担社交身份表达。'
        },
        recommendations: {
          short: '页面突出成分表和检测报告；小红书+抖音同步开账号，"成分透明"系列短视频。',
          mid: '抖音渠道精细化运营（KOC 种草+直播带货），目标 6 个月内抖音 GMV 占总营收 25%。',
          long: '建立"豆芽成分实验室"内容 IP，儿科医生背书，形成"国货母婴成分派"品类心智。',
          risks: ['抖音运营人才招聘难','老客被抖音价格战挤走','新生儿数量持续下降']
        }
      },

      work2: {
        scope: {
          question: '豆芽妈妈应优先拓展哪个客户细分市场？',
          timeframe: '12-18 个月',
          constraints: '抖音团队从零搭建；老客不能流失；预算 200 万',
          candidateCount: 3
        },
        attractiveness: {indicators:[
          {id:'a1',name:'市场规模',weight:0.25,source:'delphi',support:5,rubric:{high:'目标客群 >1000 万',mid:'300-1000 万',low:'<300 万'}},
          {id:'a2',name:'增长率',weight:0.30,source:'delphi',support:5,rubric:{high:'抖音/小红书渗透 >60%',mid:'30-60%',low:'<30%'}},
          {id:'a3',name:'客单价',weight:0.20,source:'delphi',support:5,rubric:{high:'客单 >300 元',mid:'150-300 元',low:'<150 元'}},
          {id:'a4',name:'成分党占比',weight:0.25,source:'delphi',support:5,rubric:{high:'成分研究型 >40%',mid:'20-40%',low:'<20%'}}
        ]},
        competitiveness: {indicators:[
          {id:'c1',name:'复购基础',weight:0.30,source:'delphi',support:5,rubric:{high:'现有老客 >5 万',mid:'1-5 万',low:'<1 万'}},
          {id:'c2',name:'品牌资产匹配',weight:0.25,source:'delphi',support:5,rubric:{high:'成分透明口碑强',mid:'部分场景匹配',low:'需重塑品牌'}},
          {id:'c3',name:'渠道效率',weight:0.20,source:'delphi',support:5,rubric:{high:'现有渠道 ROI >2',mid:'1-2',low:'<1'}},
          {id:'c4',name:'团队匹配',weight:0.25,source:'delphi',support:5,rubric:{high:'团队有现成能力',mid:'3-6 月可建',low:'需 12+ 月从零'}}
        ]},
        delphi: {
          status: 'done',
          weights: {
            attractiveness: {a1:0.25,a2:0.30,a3:0.20,a4:0.25},
            competitiveness: {c1:0.30,c2:0.25,c3:0.20,c4:0.25}
          },
          finalSynthesis: '两轮 Delphi 后专家对"增长率"与"复购基础"赋权最高。一线精致妈妈客单价高、成分党占比高、抖音渗透高，6 个月内可贡献 30% 营收；二线老客稳定但增长见顶；抖音新客是渠道维度不是细分市场。'
        },
        markets: [
          { id:'m1', name:'一线精致妈妈', region:'北京/上海/广州/深圳', population:'约 300 万', gdpPerCapita:'家庭年收入 50 万+', notes:'成分党、价格不敏感、抖音渗透高',
            scores:{a1:7, a2:8, a3:9, a4:9, c1:6, c2:7, c3:6, c4:6} },
          { id:'m2', name:'二线价格敏感妈妈', region:'成都/武汉/西安/南京', population:'约 800 万', gdpPerCapita:'家庭年收入 15-30 万', notes:'淘宝老客多、复购稳定',
            scores:{a1:9, a2:6, a3:5, a4:5, c1:9, c2:9, c3:9, c4:7} },
          { id:'m3', name:'抖音新客（兴趣电商）', region:'抖音兴趣电商', population:'潜在 2000 万+', gdpPerCapita:'参差', notes:'新流量红利，但老客品牌力弱',
            scores:{a1:8, a2:9, a3:5, a4:5, c1:3, c2:4, c3:3, c4:3} }
        ],
        matrix: { selectedMarketId:'m1', xCut:null, yCut:null, notes:'短期保 m2 老客复盘，中期重点攻 m1 抖音+小红书种草，长期考虑 m3 抖音兴趣电商。' },
        decision: {
          rationale: 'm1 一线精致妈妈客单价高、成分党、抖音渗透高，6 个月内可贡献 30% 营收；m2 老客稳定但增长见顶；m3 是渠道维度不是细分市场。',
          sequence: 'm2 老客复购（0-6 月）→ m1 抖音+小红书种草（3-12 月）→ m3 抖音兴趣电商拓展（12+ 月）',
          risks: ['抖音运营人才招聘难','m1 获客成本高于预期','m2 老客对抖音内容不接受'],
          nextSteps: '6 月内招 1 名抖音运营+1 名内容策划；启动小红书+抖音"成分透明"系列内容。'
        }
      },

      work3: {
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
          ldaParams:{k:3,passes:15,iterations:100,no_below:2,no_above:0.5},
          stats:{raw_count:10,valid_count:10,total_words:142,vocab_size:38,coherence:0.45},
          topics:[
            {id:0,label:'成分与配方透明',share:40,keywords:[
              {word:'成分',weight:.09},{word:'配方',weight:.08},{word:'配料表',weight:.07},{word:'检测',weight:.04},{word:'解读',weight:.03}
            ],representative_docs:['配料表没看懂，有没有医生能解读一下？','豆芽的成分表我截图发过群']},
            {id:1,label:'红 PP 应急与医生背书',share:35,keywords:[
              {word:'红PP',weight:.09},{word:'护臀膏',weight:.08},{word:'医生',weight:.06},{word:'推荐',weight:.05},{word:'儿科',weight:.03}
            ],representative_docs:['宝宝红 PP 试了松达没用，换豆芽护臀膏就好','儿科医生推荐才买的']},
            {id:2,label:'老客信任与价格',share:25,keywords:[
              {word:'老客',weight:.08},{word:'闺蜜',weight:.06},{word:'新牌子',weight:.05},{word:'价格',weight:.05},{word:'便宜',weight:.04}
            ],representative_docs:['闺蜜推荐买的，5 年了','抖音上看到但价格比袋鼠妈妈贵']}
          ],
          wordFreqTop:[
            {word:'成分',count:5},{word:'配方',count:4},{word:'红PP',count:4},{word:'医生',count:3},{word:'推荐',count:3},
            {word:'老客',count:3},{word:'价格',count:2},{word:'护臀膏',count:2},{word:'闺蜜',count:2},{word:'检测',count:2}
          ],
          painMap:[
            {id:'pa1',pain:'成分表看不懂，担心不安全',evidence:'配料表没看懂，有没有医生能解读',frequency:'高',linkedNeeds:['成分透明','医生背书'],linkedTopicId:0,type:'痛点'},
            {id:'pa2',pain:'红 PP 反复，试错成本高',evidence:'试了松达没用，换豆芽就好',frequency:'高',linkedNeeds:['红 PP 急救','医生推荐'],linkedTopicId:1,type:'痛点'},
            {id:'pa3',pain:'新牌子不敢试，需要信任锚点',evidence:'我买豆芽是看老客评论多，新牌子不敢试',frequency:'中',linkedNeeds:['老客背书','品牌历史'],linkedTopicId:2,type:'痛点'},
            {id:'pa4',pain:'价格相对竞品偏高',evidence:'抖音上看到但价格比袋鼠妈妈贵',frequency:'中',linkedNeeds:['价值证明'],linkedTopicId:2,type:'痒点'},
            {id:'pa5',pain:'想要试用装降低首次决策成本',evidence:'红 PP 严重不敢直接买，想要试用装',frequency:'中',linkedNeeds:['试用装'],linkedTopicId:1,type:'痒点'}
          ]
        },
        candidates:[
          {id:'c1',name:'成分透明配方',pain:'成分焦虑',description:'每件产品展示完整成分表+检测报告+配方白名单',evidence:'10 篇评论中 5 篇提及成分',
            desirabilityScores:{p1:{importance:9,uniqueness:8,credibility:9},p2:{importance:7,uniqueness:7,credibility:8},p3:{importance:10,uniqueness:8,credibility:9}},
            desirabilitySource:'personas', importance:8.7,uniqueness:7.7,credibility:8.7,
            feasibility:8,communicability:9,sustainability:9, selected:true},
          {id:'c2',name:'儿科医生背书',pain:'信任门槛',description:'三甲医院儿科医生推荐+在线问诊+医生解读成分',evidence:'3 篇评论提及医生推荐',
            desirabilityScores:{p1:{importance:8,uniqueness:7,credibility:9},p2:{importance:6,uniqueness:6,credibility:8},p3:{importance:10,uniqueness:7,credibility:10}},
            desirabilitySource:'personas', importance:8.0,uniqueness:6.7,credibility:9.0,
            feasibility:6,communicability:8,sustainability:7, selected:true},
          {id:'c3',name:'红 PP 急救包',pain:'红 PP 反复',description:'护臀膏试用装+皮肤咨询+无效退款',evidence:'4 篇评论提及红 PP',
            desirabilityScores:{p1:{importance:9,uniqueness:6,credibility:8},p2:{importance:8,uniqueness:5,credibility:7},p3:{importance:8,uniqueness:6,credibility:8}},
            desirabilitySource:'personas', importance:8.3,uniqueness:5.7,credibility:7.7,
            feasibility:9,communicability:8,sustainability:8, selected:true},
          {id:'c4',name:'抖音成分实验室',pain:'新客难触达',description:'抖音"成分实验室"系列内容（30 秒短剧+配方表动画）',evidence:'内部策略，无评论',
            desirabilityScores:{p1:{importance:8,uniqueness:9,credibility:7},p2:{importance:5,uniqueness:8,credibility:6},p3:{importance:7,uniqueness:9,credibility:7}},
            desirabilitySource:'personas', importance:6.7,uniqueness:8.7,credibility:6.7,
            feasibility:7,communicability:9,sustainability:8, selected:true},
          {id:'c5',name:'私域妈妈社群',pain:'老客复购',description:'VIP 妈妈群+早教内容+试用优先+老带新奖励',evidence:'老客复购 38% 的基础',
            desirabilityScores:{p1:{importance:6,uniqueness:5,credibility:7},p2:{importance:8,uniqueness:5,credibility:7},p3:{importance:5,uniqueness:5,credibility:7}},
            desirabilitySource:'personas', importance:6.3,uniqueness:5.0,credibility:7.0,
            feasibility:9,communicability:7,sustainability:8, selected:false}
        ],
        dimensions:{
          desirability:[{key:'importance',label:'重要性'},{key:'uniqueness',label:'独特性'},{key:'credibility',label:'可信度'}],
          implementability:[{key:'feasibility',label:'可行性'},{key:'communicability',label:'传播力'},{key:'sustainability',label:'持续性'}]
        },
        matrix:{showSector:true,sectorAngle:90,sectorRadius:12,xCut:null,yCut:null,manualSelected:[]},
        migration:{analyses:[]},
        proposition:{
          coreValueIds:['c1','c2','c3','c4'],
          alternatives:[
            {id:'a1',text:'看得见的成分，安心的呵护。'},
            {id:'a2',text:'成分党妈妈，选豆芽。'},
            {id:'a3',text:'5 年妈妈，5 年放心。'}
          ],
          chosenValueText:'看得见的成分，安心的呵护。',
          positioning:{brand:'豆芽妈妈', audience:'25-35 岁精致妈妈/成分党', coreValue:'成分透明+医生背书+红 PP 急救', category:'国货婴幼儿洗护专业品牌'},
          positioningStatement:'豆芽妈妈 是为 25-35 岁精致妈妈/成分党 提供 成分透明+医生背书+红 PP 急救 的 国货婴幼儿洗护专业品牌。',
          sloganOptions:['看得见的成分，安心的呵护','成分党妈妈，选豆芽','5 年妈妈，5 年放心'],
          chosenSlogan:'看得见的成分，安心的呵护',
          mbti:'ISFJ',
          archetype: { primary: 'Caregiver', secondary: 'Innocent' },
          personalityTraits:['安心','专业','透明','温暖','信任']
        }
      },

      work4: {
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
      },

      work5: {
        cover: { title:'豆芽妈妈 · 2027 渠道升级与品牌年轻化策划书', subtitle:'看得见的成分，安心的呵护', team:'豆芽妈妈团队', date:'2026-08' },
        abstract: '本策划书围绕豆芽妈妈从淘宝老店向"淘宝+抖音+小红书"全渠道升级展开。核心定位"成分党妈妈的安心选择"，以"成分透明+儿科医生背书+红 PP 急救"为三大卖点，主攻一线精致妈妈，6 个月内抖音 GMV 占总营收 25%。',
        ch1_business: '豆芽妈妈专注 0-3 岁婴幼儿洗护，淘宝 5 年老店，8 人团队，年营收 1200 万，复购率 38%。核心价值为功能（成分透明+配方安心）、情感（妈妈安心）、社会（研究型妈妈精致育儿）。',
        ch2_environment: {
          political: '婴幼儿化妆品监管持续收紧（成分备案、原料白名单）。',
          economic: '出生率下降但客单价上升，母婴洗护 600 亿市场。',
          social: '90/95 后妈妈成分党；小红书/抖音种草驱动决策。',
          technological: '抖音电商增长 35%+；AI 客服成熟。',
          strengths: ['5 年复购 38%','成分透明口碑','私域 5 万+ 老客'],
          weaknesses: ['抖音运营为零','品牌年轻化弱','团队结构偏淘系'],
          opportunities: ['抖音新流量红利','成分党品类心智','精致育儿升级'],
          threats: ['出生率持续下降','戴可思/松达加速抖音布局','价格战']
        },
        ch3_strategy: {
          segmentation: '按客户分层：一线精致妈妈（25-35 岁）/ 二线价格敏感妈妈（30-40 岁）/ 抖音新客（不限地域）。',
          targeting: '短期保二线老客复购；中期攻一线精致妈妈；长期拓展抖音兴趣电商。',
          positioning: '为 25-35 岁精致妈妈提供成分透明+医生背书的国货婴幼儿洗护专业品牌。'
        },
        ch4_mix: {
          product: '婴幼儿洗护全品类（洗发沐浴/护臀/洗面/待产包礼盒）',
          price: '中端定价（88-188 元单件，688 元待产包礼盒）',
          place: '淘宝主阵地 + 抖音新增长 + 小红书种草',
          promotion: '"看得见的成分，安心的呵护"——抖音/小红书 KOC 内容种草',
          customerValue: '成分透明 + 配方安心 + 妈妈放心',
          customerCost: '中端定价 + 老客优惠',
          convenience: '淘宝/抖音/小红书多渠道',
          communication: '儿科医生背书 + KOC 真实使用 + 老客社群'
        },
        ch5_outlook: '12 个月内抖音 GMV 占比从 0 到 25%，3 年内品牌从淘宝老店升级为"国货母婴成分派"代表。关键风险为抖音运营人才招聘与老客对内容策略的接受度，应对为分阶段试水+保留老客独立运营。',
        references: [
          { authors:'Castelo, N. et al.', title:'AI-Human Hybrids for Marketing Research', year:'2025', url:'' },
          { authors:'', title:'2023 中国母婴行业白皮书', year:'2023', url:'' }
        ]
      }
    },

    /* ============================================================
       小镬记 — 餐厅 / 粤菜融合，国内 OBM（详细）
       ============================================================ */
    xiaohuo: {
      meta: {
        name: '小镬记',
        industry: '餐饮 / 粤菜融合',
        tagline: '区域粤菜融合馆的连锁化探索',
        description: '老陈（30 年粤菜功底）+ 儿子小陈（互联网产品经理）的家族餐厅，2 家直营店（广州荔湾老店 30 年 / 珠江新城 2 年），年营收 600 万，纠结要不要把传统粤菜 + 西式/日料/东南亚做"年轻化融合馆"连锁到深圳/上海。',
        valueChain: {
          curve: '餐饮 / 堂食+融合',
          nodes: [
            {label:'食材溯源/采购',  v:7.0, tip:'清远鸡/顺德鱼生 — 食材故事化'},
            {label:'中央厨房/标准化', v:5.0, tip:'酱料/预制半成品/出品稳定'},
            {label:'现场烹饪/服务',   v:8.5, tip:'厨师+服务员 — 核心体验'},
            {label:'渠道/抖音同城',   v:4.5, tip:'美团/大众点评/抖音同城号'},
            {label:'品牌/口碑/出片',  v:9.0, tip:'老字号信任+出片 — 最高附加值'},
            {label:'会员/复购/CRM',   v:6.0, tip:'私域社群/会员次卡/老带新'}
          ]
        },
        ready: true
      },
      work1: {
        sbu: {
          name: '小镬记',
          category: '餐饮 / 粤菜融合（堂食+融合菜研发+连锁）',
          stage: '成长期',
          scope: '国内',
          countries: ['中国'],
          summary: '广州家族餐厅，2 家直营店，老店 30 年（荔湾）+ 新店 2 年（珠江新城），年营收 600 万，5 位粤菜师傅，15 道招牌菜，年坪效 1.2 万元/㎡，毛利 55%。',
          threeQuestions: {customer: true, channel: false, brand: true},
          boundary: '客户：聚焦 25-45 岁中端堂食客，不做外卖专店、不做婚宴/团餐；渠道：堂食+小程序+美团+抖音同城号，不依赖外卖平台；品牌：小镬记为独立家族品牌，不与老陈个人名号混用；损益：2 家店独立核算，复用老店师傅团队与食材供应链。'
        },
        environment: {
          political: '餐饮预制菜监管收紧，《餐饮服务食品安全监管》要求明厨亮灶、半成品溯源；广州、深圳对餐饮油烟/垃圾分类监管加强。',
          economic: '2023 年餐饮收入 5.2 万亿（同比增 16.9%），粤菜占全国餐饮 8.4%；购物中心餐饮倒闭率上升，差异化融合菜反向增长。',
          social: 'Z 世代追求"出片+体验"；家庭客回归堂食重视"真材实料"；探店博主驱动新店流量；老字号国潮复兴。',
          technological: '抖音同城号/小红书探店种草成熟；小程序点餐+会员系统普及；明厨亮灶直播/中央厨房可视化。',
          industry: '粤菜头部：广州酒家（150 元，宴席/老字号）、点都德（80 元，早茶/茶楼）、炳胜（200 元，精品粤菜）、顺德食通天、太兴餐厅；融合菜新锐：gaga、渔宴、新长福。',
          basics: {
            scale: { actual: '2 家直营，5 位粤菜师傅，年营收 600 万', target: '5 家直营 + 2 家加盟，年营收 2500 万', source: '内部台账 + 战略规划' },
            scope: { actual: '堂食为主，2 家直营（荔湾/珠江新城）', target: '深圳/上海各 1 家直营 + 加盟', source: '战略规划' },
            products: { actual: '15 道招牌粤菜 + 时令融合菜', target: '融合菜占比 30% + 招牌菜标准化', source: '产品路线图' },
            customers: { actual: '老客回头 60% + 探店博主引流 25%', target: '老客 50% + 小程序会员 30% + 抖音同城 20%', source: '用户调研' },
            supply: { actual: '清远鸡/顺德鱼生原产地直供，5 家供应商', target: '保留 5 家 + 新增 2 家融合食材供应链', source: '供应链' },
            performance: {
              share: { actual: '广州粤菜细分 0.3%', target: '1%（深圳/上海各 1 家贡献）', source: '目标推导' },
              roi: { actual: '1.3', target: '1.5', source: '财务模型' },
              growth: { actual: '年增 8%', target: '年增 35%（连锁带动）', source: '行业基准 + 融合菜红利' }
            }
          },
          competitors: [
            { id:'c1', name:'广州酒家', price:'人均 150 元', strengths:'老字号、宴席/早茶全场景、电商预制菜', weaknesses:'年轻化弱、菜品创新慢、客群偏家庭', position:'以"融合菜+出片体验"差异化' },
            { id:'c2', name:'点都德', price:'人均 80 元', strengths:'早茶品类心智强、价格亲民', weaknesses:'正餐场景弱、品牌形象传统', position:'以"中端价位+正餐融合"错位' },
            { id:'c3', name:'炳胜', price:'人均 200 元', strengths:'精品粤菜标杆、食材高端', weaknesses:'客单价高、新客门槛高、扩张慢', position:'以"30 年老店信任+性价比"切入' },
            { id:'c4', name:'太兴餐厅', price:'人均 90 元', strengths:'港式茶餐厅连锁、年轻化', weaknesses:'粤菜正宗度弱、原产地溯源弱', position:'以"老陈 30 年粤菜功底"差异化' },
            { id:'c5', name:'gaga（融合菜）', price:'人均 120 元', strengths:'融合菜+高颜值+商场店', weaknesses:'粤菜根基弱、复购低', position:'以"老店粤菜底蕴+融合创新"对抗' }
          ],
          ourCapabilities: {
            delivery: '5 位粤菜师傅 + 15 道招牌菜稳定出品，融合菜研发由小陈主导',
            core: '老陈 30 年粤菜功底 + 荔湾老店品牌沉淀',
            brand: '老店口碑强（30 年），但新店抖音/小红书运营弱',
            customer: '老客 60% 复购 + 探店博主引流',
            compliance: '明厨亮灶+SC 食品经营许可+食材溯源',
            defensive: '30 年老店信任 + 5 位师傅稳定 + 原产地食材',
            critical: '新店扩张资金有限 + 融合菜研发节奏慢',
            structural: '家族企业决策快，但缺连锁化人才（店长/营销/加盟）',
            smileCurve: '优势在品牌（30 年老店）+ 核心（粤菜师傅），劣势在客户（缺年轻会员运营）——定位为"老店信任 + 融合创新 + 抖音同城种草"三轮',
            trends: '融合菜、出片体验、探店博主、明厨亮灶直播、老字号国潮'
          }
        },
        personas: [
          { id:'p1', name:'林晓棠', gender:'女', age:'28', occupation:'互联网产品经理', income:'一线 32 万/年', region:'广州珠江新城',
            values:['出片颜值','体验独特','探店打卡'], painPoints:'传统粤菜环境老气、菜品单一、缺社交分享点',
            channels:['小红书','抖音','大众点评'], quote:'我愿意为"好看+独特"多付 30%，但不要被收"颜值税"。' },
          { id:'p2', name:'陈家明', gender:'男', age:'38', occupation:'国企中层', income:'一线 35 万/年（家庭）', region:'广州天河',
            values:['真材实料','性价比','家庭聚餐'], painPoints:'餐厅食材不透明、孩子挑食、节假日排队久',
            channels:['大众点评','美团','微信群'], quote:'一家人吃饭，食材来源比我点哪个菜重要。' },
          { id:'p3', name:'周小溪', gender:'女', age:'27', occupation:'小红书探店博主', income:'广告+流量 20 万/年', region:'深圳/广州',
            values:['话题性','独特体验','可传播'], painPoints:'探店同质化、商家配合度低、缺独家菜品',
            channels:['小红书','抖音','微博'], quote:'给我一个"非来不可"的理由，我就能带火一家店。' }
        ],
        scenarios: [
          { id:'sc1', name:'年轻白领下班聚会', personaIds:['p1'],
            benefits:{usage:'融合菜体验+颜值',service:'小程序预约+会员折扣',staff:'服务员引导点单',image:'懂生活的小姐姐'},
            costs:{monetary:'人均 150-200 元',time:'1.5-2 小时',energy:'选店纠结',psychic:'踩雷担心'},
            anchor:'出片 + 独特体验', decisiveGap:'环境颜值 + 融合菜稀缺——需在小红书/抖音放高清环境图与招牌融合菜' },
          { id:'sc2', name:'家庭周末聚餐', personaIds:['p2'],
            benefits:{usage:'15 道招牌+原产地食材',service:'家庭套餐+儿童椅',staff:'服务员介绍食材',image:'重视家庭的好爸爸'},
            costs:{monetary:'人均 80-150 元',time:'2-3 小时',energy:'选店对比',psychic:'孩子不爱吃'},
            anchor:'真材实料 + 老字号', decisiveGap:'食材溯源 + 师傅手艺——明厨亮灶+原产地食材展示' },
          { id:'sc3', name:'探店博主合作拍摄', personaIds:['p3'],
            benefits:{usage:'独家融合菜+老店故事',service:'专属拍摄位+主厨互动',staff:'老板/主厨配合',image:'独家内容产出'},
            costs:{monetary:'拍摄成本',time:'半天到一天',energy:'协调配合',psychic:'内容同质化'},
            anchor:'话题性 + 独家性', decisiveGap:'30 年老店+主厨手作——可让博主拍"师傅手作 30 年"系列' }
        ],
        metrics: {
          disclaimerAcknowledged: true,
          dimensions: [
            { id:'dm1', name:'产品·菜品', secondaries:[
              { id:'ds1', name:'菜品口味稳定性', measure:'老客复购率/差评比', forecast: 8, target: 9 },
              { id:'ds2', name:'融合菜创新度', measure:'季度上新数/博主探店提及', forecast: 5, target: 8 },
              { id:'ds3', name:'食材新鲜度', measure:'食材报废率/客户感知', forecast: 8, target: 9 }
            ]},
            { id:'dm2', name:'品牌·认知', secondaries:[
              { id:'ds4', name:'本地知名度', measure:'无提示提及率（广州%）', forecast: 7, target: 8 },
              { id:'ds5', name:'差异化定位', measure:'能说出"30 年老店"的客户%', forecast: 8, target: 9 },
              { id:'ds6', name:'出片传播力', measure:'小红书/抖音 UGC 篇数/月', forecast: 4, target: 8 }
            ]},
            { id:'dm3', name:'品牌·判断', secondaries:[
              { id:'ds7', name:'专业可信', measure:'粤菜专业度评分', forecast: 9, target: 9 },
              { id:'ds8', name:'食材安心', measure:'食材溯源感知', forecast: 8, target: 9 },
              { id:'ds9', name:'性价比', measure:'性价比评分', forecast: 7, target: 8 }
            ]},
            { id:'dm4', name:'品牌·感受', secondaries:[
              { id:'ds10', name:'环境颜值', measure:'环境设计评分', forecast: 6, target: 8 },
              { id:'ds11', name:'品牌温度', measure:'品牌情感题均分', forecast: 7, target: 8 },
              { id:'ds12', name:'信任感', measure:'信任题均分', forecast: 8, target: 9 }
            ]},
            { id:'dm5', name:'复购·推荐', secondaries:[
              { id:'ds13', name:'会员归属', measure:'小程序会员数', forecast: 5, target: 8 },
              { id:'ds14', name:'复购意愿', measure:'年复购率', forecast: 7, target: 8 },
              { id:'ds15', name:'推荐意愿', measure:'NPS', forecast: 7, target: 9 }
            ]}
          ]
        },
        survey: (function(){
          const anchors=['非常不同意','不同意','一般','同意','非常同意'];
          const qs=[
            {id:'q1', type:'likert', text:'小镬记菜品口味稳定，不会出现"这次好吃下次踩雷"', anchors:[...anchors], sourceIndicatorId:'ds1'},
            {id:'q2', type:'likert', text:'小镬记的融合菜有创新，能给我"没见过"的体验', anchors:[...anchors], sourceIndicatorId:'ds2'},
            {id:'q3', type:'likert', text:'小镬记食材新鲜，原产地可溯源', anchors:[...anchors], sourceIndicatorId:'ds3'},
            {id:'q4', type:'likert', text:'在广州本地我常听到朋友推荐小镬记', anchors:[...anchors], sourceIndicatorId:'ds4'},
            {id:'q5', type:'likert', text:'小镬记在"30 年老店+融合创新"上有清晰差异化', anchors:[...anchors], sourceIndicatorId:'ds5'},
            {id:'q6', type:'likert', text:'我常在小红书/抖音看到小镬记的环境/菜品图', anchors:[...anchors], sourceIndicatorId:'ds6'},
            {id:'q7', type:'likert', text:'小镬记在粤菜专业度上让我信任', anchors:[...anchors], sourceIndicatorId:'ds7'},
            {id:'q8', type:'likert', text:'我信任小镬记的食材来源与安全', anchors:[...anchors], sourceIndicatorId:'ds8'},
            {id:'q9', type:'likert', text:'小镬记人均 80-200 元与价值匹配', anchors:[...anchors], sourceIndicatorId:'ds9'},
            {id:'q10',type:'likert', text:'小镬记环境设计有"出片感"', anchors:[...anchors], sourceIndicatorId:'ds10'},
            {id:'q11',type:'likert', text:'小镬记让我感到"老字号但不老气"', anchors:[...anchors], sourceIndicatorId:'ds11'},
            {id:'q12',type:'likert', text:'小镬记老店历史让我对菜品产生信任', anchors:[...anchors], sourceIndicatorId:'ds12'},
            {id:'q13',type:'likert', text:'我愿意加入小镬记小程序会员', anchors:[...anchors], sourceIndicatorId:'ds13'},
            {id:'q14',type:'likert', text:'我会在半年内多次回小镬记就餐', anchors:[...anchors], sourceIndicatorId:'ds14'},
            {id:'q15',type:'likert', text:'我愿意向朋友推荐小镬记', anchors:[...anchors], sourceIndicatorId:'ds15'},
            {id:'q16',type:'likert', text:'我愿意参与小镬记的探店/打卡活动', anchors:[...anchors], sourceIndicatorId:'ds16'}
          ];
          const personas=[
            {p:'p1', base:[4,5,4,4,5,5,4,4,4,5,5,4,5,4,5,5]},
            {p:'p2', base:[5,3,5,5,4,3,5,5,5,4,4,5,4,5,5,3]},
            {p:'p3', base:[4,5,4,4,5,5,5,4,4,5,5,5,5,4,5,5]}
          ];
          const clamp=(v,lo,hi)=>Math.max(lo,Math.min(hi,v));
          const responses=[];
          personas.forEach(p=>{
            for(let r=0;r<3;r++){
              const answers=qs.map((q,i)=>{
                const v=clamp(p.base[i]+Math.round((Math.random()-.5)*2),1,5);
                return {questionId:q.id,value:v};
              });
              responses.push({personaId:p.p, answers});
            }
          });
          const mean=a=>a.reduce((x,y)=>x+y,0)/(a.length||1);
          const sd=a=>{ const m=mean(a); return Math.sqrt(mean(a.map(x=>(x-m)*(x-m)))); };
          const likertStats={};
          qs.forEach(q=>{
            const vals=[]; const dist=[0,0,0,0,0];
            responses.forEach(r=>{ const an=r.answers.find(x=>x.questionId===q.id); const v=parseInt(an?.value); if(!isNaN(v)&&v>=1&&v<=5){vals.push(v);dist[v-1]++;} });
            likertStats[q.id]={mean:+mean(vals).toFixed(2),sd:+sd(vals).toFixed(2),dist,n:vals.length};
          });
          const indicatorMeans=qs.map(q=>({label:q.text.length>18?q.text.slice(0,18)+'…':q.text, value:likertStats[q.id].mean, mean:likertStats[q.id].mean, sourceIndicatorId:q.sourceIndicatorId||null}));
          XIAOHUO_STATS={likertStats, indicatorMeans};
          return {questions:qs, responses, n:3, status:'done', progress:{done:9,total:9}, error:null, mode:'demo', useFewShot:true, useRag:false, ragContext:''};
        })(),
        analysis: Object.assign({openThemes:[], insights:'1. 菜品稳定性（Q1）与食材新鲜（Q3）是小镬记的强项，得分 4.0+，30 年老店信任背书有效。\n2. 融合菜创新（Q2）与出片传播（Q6）是核心短板，年轻客户群对小镬记"粤菜老店"形象认知强但"年轻化融合"心智弱。\n3. 性价比（Q9）分化明显，年轻白领愿为融合创新付溢价，家庭客更看人均与食材。\n4. 小程序会员（Q13）与博主打卡（Q16）是新增长点，抖音同城号/小红书种草是破圈关键。\n5. 老陈 30 年粤菜功底 + 主厨手作 + 原产地食材应作为核心传播资产，融合菜创新需小陈主导快速迭代。'}, XIAOHUO_STATS || {}),
        values: {
          functional: ['菜品稳定','食材原产地','融合创新'],
          emotional: ['老字号信任','家宴安心'],
          social: ['懂生活的精致食客','出片博主打卡'],
          epistemic: ['明厨亮灶','食材溯源'],
          conditional: ['家庭聚餐','探店打卡','年轻聚会'],
          chosenFunctional: '30 年老店信任 + 融合菜创新',
          chosenEmotional: '老字号不老气',
          chosenSocial: '懂生活的精致食客',
          rationale: '以"30 年老店+融合创新"建立功能差异化，以"老字号不老气"建立情感连接，以"懂生活的精致食客"承担社交身份。'
        },
        recommendations: {
          short: '小程序上线会员系统+明厨亮灶直播；抖音同城号+小红书开账号，发布"老陈 30 年+主厨手作+融合菜"系列内容。',
          mid: '深圳/上海各开 1 家直营店，融合菜占比 30%；招 2 名探店博主运营+1 名会员运营，6 个月内抖音同城粉丝 5 万+。',
          long: '建立"小镬记·融合菜实验室"内容 IP，主厨手作+老店故事系列，从广州 2 家店升级为粤菜融合品类代表。',
          risks: ['新店选址失误','融合菜研发节奏跟不上','加盟扩张品控失控','明厨亮灶/食材溯源合规风险']
        }
      },

      work2: {
        scope: {
          question: '小镬记应优先拓展哪个城市/客群？',
          timeframe: '12-18 个月',
          constraints: '新店资金 800 万；家族决策；老店不能受影响；师傅团队只 5 人',
          candidateCount: 3
        },
        attractiveness: {indicators:[
          {id:'a1',name:'市场规模',weight:0.25,source:'delphi',support:5,rubric:{high:'粤菜+融合菜 >300 亿',mid:'100-300 亿',low:'<100 亿'}},
          {id:'a2',name:'增长率',weight:0.30,source:'delphi',support:5,rubric:{high:'融合菜/探店渗透 >40%',mid:'20-40%',low:'<20%'}},
          {id:'a3',name:'客单价',weight:0.20,source:'delphi',support:5,rubric:{high:'人均 >150 元',mid:'100-150 元',low:'<100 元'}},
          {id:'a4',name:'传播渗透',weight:0.25,source:'delphi',support:5,rubric:{high:'小红书/抖音渗透 >60%',mid:'30-60%',low:'<30%'}}
        ]},
        competitiveness: {indicators:[
          {id:'c1',name:'老店信任',weight:0.30,source:'delphi',support:5,rubric:{high:'30 年老店品牌',mid:'10-30 年',low:'<10 年'}},
          {id:'c2',name:'团队匹配',weight:0.25,source:'delphi',support:5,rubric:{high:'5 位师傅+小陈运营',mid:'3-5 人可复制',low:'需重招团队'}},
          {id:'c3',name:'资金效率',weight:0.20,source:'delphi',support:5,rubric:{high:'现有资金可开店',mid:'需部分融资',low:'需大额融资'}},
          {id:'c4',name:'政策环境',weight:0.25,source:'delphi',support:5,rubric:{high:'明厨亮灶/预制菜监管松',mid:'一般',low:'严格'}}
        ]},
        delphi: {
          status: 'done',
          weights: {
            attractiveness: {a1:0.25,a2:0.30,a3:0.20,a4:0.25},
            competitiveness: {c1:0.30,c2:0.25,c3:0.20,c4:0.25}
          },
          finalSynthesis: '两轮 Delphi 后专家对"增长率"与"老店信任"赋权最高。深圳/上海融合菜渗透高、客单价高、抖音同城种草生态成熟，老陈 30 年粤菜功底+小陈互联网运营能形成"老店+融合"差异化；广州本店已饱和主要做品牌升级；加盟路线资金效率高但品控风险大。'
        },
        markets: [
          { id:'m1', name:'深圳（粤菜融合新客）', region:'深圳南山/福田', population:'潜在 50 万粤菜+融合菜客户', gdpPerCapita:'人均可支配 7 万+', notes:'融合菜渗透高、抖音同城生态成熟',
            scores:{a1:8, a2:9, a3:8, a4:9, c1:7, c2:7, c3:7, c4:7} },
          { id:'m2', name:'上海（精致中餐客）', region:'上海静安/徐汇', population:'潜在 30 万精致中餐客', gdpPerCapita:'人均可支配 8 万+', notes:'人均 200 元接受度高、出片文化强',
            scores:{a1:7, a2:8, a3:9, a4:8, c1:5, c2:5, c3:6, c4:6} },
          { id:'m3', name:'广州本店（老客+品牌升级）', region:'广州荔湾/珠江新城', population:'已有 600 万老客基础', gdpPerCapita:'人均可支配 6 万+', notes:'老店信任强，新店运营经验可复制',
            scores:{a1:6, a2:5, a3:6, a4:6, c1:10, c2:9, c3:10, c4:9} }
        ],
        matrix: { selectedMarketId:'m1', xCut:null, yCut:null, notes:'短期保 m3 广州本店老客，中期重点攻 m1 深圳（融合菜+抖音同城），长期考虑 m2 上海（人均高但师傅团队需扩展）。' },
        decision: {
          rationale: 'm1 深圳融合菜渗透高、抖音同城生态成熟、老陈 30 年粤菜功底+小陈运营可快速形成差异化，12 个月内可贡献 30% 营收；m3 老店稳定但增长见顶；m2 上海人均高但师傅团队仅 5 人风险大。',
          sequence: 'm3 广州本店品牌升级（0-6 月）→ m1 深圳开店（6-12 月）→ m2 上海开店（12+ 月）',
          risks: ['深圳选址失误','师傅团队复制跟不上','抖音同城运营人才招聘难','新城市客群对老店品牌认知弱'],
          nextSteps: '6 月内启动深圳选址+招 1 名店长+1 名探店博主运营；同步上线小程序会员+明厨亮灶直播。'
        }
      },

      work3: {
        context: {
          sbuName: '小镬记',
          targetMarket: '深圳粤菜融合新客 + 广州品牌升级老客',
          personas: [
            { id:'p1', name:'林晓棠', painPoints:'传统粤菜环境老气、缺社交分享点' },
            { id:'p2', name:'陈家明', painPoints:'食材不透明、节假日排队久' },
            { id:'p3', name:'周小溪', painPoints:'探店同质化、缺独家菜品' }
          ],
          hasSurvey: true
        },
        mining: {
          documents: [
            '小镬记是我吃 20 年的老店，荔湾那家味道最正。',
            '珠江新城店装修太现代，没有老店的感觉。',
            '能不能出一道粤菜+日料融合的刺身，小陈是产品经理应该懂。',
            '清远鸡从哪进的？想看溯源。',
            '主厨老陈 30 年了，能不能拍个纪录片？',
            '探店博主来了两次都说"和其他粤菜馆没差别"。',
            '小程序点单能不能加个"食材故事"页面？',
            '等位太久了，能不能预约取号？',
            '明厨亮灶看着安心，但师傅太忙没空讲菜。',
            '广州酒家出了预制菜，小镬记做不做？'
          ],
          ldaParams:{k:3,passes:15,iterations:100,no_below:2,no_above:0.5},
          stats:{raw_count:10,valid_count:10,total_words:148,vocab_size:42,coherence:0.42},
          topics:[
            {id:0,label:'老店信任与原产地',share:38,keywords:[
              {word:'老店',weight:.09},{word:'荔湾',weight:.07},{word:'清远',weight:.06},{word:'溯源',weight:.05},{word:'食材',weight:.04}
            ],representative_docs:['小镬记是我吃 20 年的老店','清远鸡从哪进的？想看溯源']},
            {id:1,label:'融合菜创新与年轻化',share:35,keywords:[
              {word:'融合',weight:.09},{word:'日料',weight:.07},{word:'刺身',weight:.06},{word:'小陈',weight:.05},{word:'创新',weight:.04}
            ],representative_docs:['能不能出一道粤菜+日料融合的刺身','探店博主来了两次都说没差别']},
            {id:2,label:'体验与服务',share:27,keywords:[
              {word:'小程序',weight:.08},{word:'预约',weight:.06},{word:'明厨',weight:.05},{word:'等位',weight:.05},{word:'故事',weight:.04}
            ],representative_docs:['小程序点单能不能加食材故事','等位太久了']}
          ],
          wordFreqTop:[
            {word:'老店',count:4},{word:'食材',count:3},{word:'融合',count:3},{word:'明厨',count:2},{word:'小陈',count:2},
            {word:'小程序',count:2},{word:'溯源',count:2},{word:'刺身',count:2},{word:'预约',count:2},{word:'创新',count:2}
          ],
          painMap:[
            {id:'pa1',pain:'新店缺老店感，年轻客户群认知弱',evidence:'珠江新城店装修太现代，没有老店的感觉',frequency:'高',linkedNeeds:['老店故事化','环境统一'],linkedTopicId:0,type:'痛点'},
            {id:'pa2',pain:'融合菜研发节奏慢，缺差异化',evidence:'探店博主来了两次都说没差别',frequency:'高',linkedNeeds:['融合菜实验室','季度上新'],linkedTopicId:1,type:'痛点'},
            {id:'pa3',pain:'食材溯源展示不足，缺信任锚点',evidence:'清远鸡从哪进的？想看溯源',frequency:'中',linkedNeeds:['明厨亮灶','食材二维码'],linkedTopicId:0,type:'痛点'},
            {id:'pa4',pain:'等位久/小程序体验差',evidence:'等位太久了，能不能预约取号',frequency:'中',linkedNeeds:['预约系统','等位服务'],linkedTopicId:2,type:'痒点'},
            {id:'pa5',pain:'主厨故事缺内容化，难以传播',evidence:'主厨老陈 30 年了，能不能拍个纪录片',frequency:'中',linkedNeeds:['主厨 IP','老店故事'],linkedTopicId:1,type:'痒点'}
          ]
        },
        candidates:[
          {id:'c1',name:'30 年老店信任',pain:'老店感弱',description:'老陈 30 年粤菜功底+荔湾老店故事化，明厨亮灶+主厨手作纪录片',evidence:'10 篇评论中 4 篇提及老店',
            desirabilityScores:{p1:{importance:7,uniqueness:9,credibility:10},p2:{importance:10,uniqueness:8,credibility:10},p3:{importance:8,uniqueness:9,credibility:9}},
            desirabilitySource:'personas', importance:8.3,uniqueness:8.7,credibility:9.7,
            feasibility:8,communicability:9,sustainability:9, selected:true},
          {id:'c2',name:'食材原产地溯源',pain:'信任不足',description:'清远鸡/顺德鱼生原产地直供，明厨亮灶+二维码溯源',evidence:'3 篇评论提及溯源',
            desirabilityScores:{p1:{importance:7,uniqueness:7,credibility:9},p2:{importance:10,uniqueness:7,credibility:10},p3:{importance:7,uniqueness:8,credibility:8}},
            desirabilitySource:'personas', importance:8.0,uniqueness:7.3,credibility:9.0,
            feasibility:7,communicability:8,sustainability:8, selected:true},
          {id:'c3',name:'融合菜实验室',pain:'缺差异化',description:'小陈主导粤菜+日料/西式/东南亚融合季度上新，3-5 道招牌融合菜',evidence:'4 篇评论提及融合',
            desirabilityScores:{p1:{importance:9,uniqueness:9,credibility:7},p2:{importance:7,uniqueness:8,credibility:6},p3:{importance:10,uniqueness:9,credibility:7}},
            desirabilitySource:'personas', importance:8.7,uniqueness:8.7,credibility:6.7,
            feasibility:7,communicability:9,sustainability:7, selected:true},
          {id:'c4',name:'主厨手作纪录片',pain:'传播难',description:'老陈手作 30 年系列短视频，抖音同城号+小红书分发',evidence:'2 篇评论提及纪录片',
            desirabilityScores:{p1:{importance:7,uniqueness:9,credibility:8},p2:{importance:6,uniqueness:8,credibility:7},p3:{importance:9,uniqueness:9,credibility:8}},
            desirabilitySource:'personas', importance:7.3,uniqueness:8.7,credibility:7.7,
            feasibility:8,communicability:9,sustainability:8, selected:true},
          {id:'c5',name:'小程序会员+预约',pain:'体验差',description:'会员积分+生日券+预约取号+等位茶点+食材故事页',evidence:'2 篇评论提及小程序',
            desirabilityScores:{p1:{importance:6,uniqueness:5,credibility:6},p2:{importance:7,uniqueness:5,credibility:7},p3:{importance:5,uniqueness:5,credibility:5}},
            desirabilitySource:'personas', importance:6.0,uniqueness:5.0,credibility:6.0,
            feasibility:9,communicability:6,sustainability:7, selected:false}
        ],
        dimensions:{
          desirability:[{key:'importance',label:'重要性'},{key:'uniqueness',label:'独特性'},{key:'credibility',label:'可信度'}],
          implementability:[{key:'feasibility',label:'可行性'},{key:'communicability',label:'传播力'},{key:'sustainability',label:'持续性'}]
        },
        matrix:{showSector:true,sectorAngle:90,sectorRadius:12,xCut:null,yCut:null,manualSelected:[]},
        migration:{analyses:[]},
        proposition:{
          coreValueIds:['c1','c2','c3','c4'],
          alternatives:[
            {id:'a1',text:'30 年老店，新派粤菜。'},
            {id:'a2',text:'老陈的镬，老陈的味。'},
            {id:'a3',text:'粤菜老店，融合新味。'}
          ],
          chosenValueText:'30 年老店，新派粤菜。',
          positioning:{brand:'小镬记', audience:'25-45 岁中端堂食客/年轻白领+家庭客+探店博主', coreValue:'30 年老店信任+融合菜创新+主厨手作+食材溯源', category:'粤菜融合专业品牌'},
          positioningStatement:'小镬记 是为 25-45 岁中端堂食客 提供 30 年老店信任+融合菜创新+主厨手作+食材溯源 的 粤菜融合专业品牌。',
          sloganOptions:['30 年老店，新派粤菜','老陈的镬，老陈的味','粤菜老店，融合新味'],
          chosenSlogan:'30 年老店，新派粤菜',
          mbti:'ESTJ',
          archetype: { primary: 'Ruler', secondary: 'Explorer' },
          personalityTraits:['老字号','专业','传承','温暖','创新']
        }
      },

      work4: {
        route:{
          scope:'domestic',
          oemType:'OBM',
          entryMode:'',
          light:[],
          politicalPower:''
        },
        product:{
          name:'小镬记粤菜融合系列',
          description:'30 年老店+粤菜融合+明厨亮灶+主厨手作',
          coreDifferentiators:['30 年老店信任','主厨手作','食材原产地溯源','融合菜创新'],
          physicalFeatures:'明厨亮灶 / 食材二维码溯源 / 老陈手作纪录片 / 融合菜季度上新',
          serviceOffering:'等位茶点+主厨讲解 / 食材故事小程序页 / 会员积分+生日券 / 私域社群',
          technologyMoat:'5 位粤菜师傅 + 荔湾老店品牌资产 + 小陈互联网运营',
          skus:[
            {name:'招牌粤菜 15 道', specs:'清远鸡/顺德鱼生/蜜汁叉烧等', price_range:'68-188 元/道', differentiator:'30 年老店配方'},
            {name:'融合菜季度上新', specs:'粤菜+日料/西式/东南亚', price_range:'88-268 元/道', differentiator:'小陈主导研发'},
            {name:'家庭套餐', specs:'4-6 人 8-10 道', price_range:'588-1288 元/套', differentiator:'食材溯源+主厨讲解'},
            {name:'主厨手作体验', specs:'1.5 小时 8 道菜', price_range:'298-498 元/位', differentiator:'主厨面对面'}
          ]
        },
        price:{
          strategy:'value',
          strategyNote:'中端定价，融合菜承担溢价；家庭套餐+主厨体验提升客单。',
          tiers:[
            {name:'招牌粤菜单道', targetSegment:'老客+家庭', price:128, unit:'元/道', notes:'清远鸡等招牌'},
            {name:'融合菜单道', targetSegment:'年轻白领+博主', price:168, unit:'元/道', notes:'季度上新'},
            {name:'家庭套餐', targetSegment:'家庭客', price:888, unit:'元/套', notes:'4-6 人 8-10 道'},
            {name:'主厨体验', targetSegment:'高端客+团建', price:398, unit:'元/位', notes:'1.5 小时'}
          ],
          channelPricing:[
            {channel:'堂食', priceAdjustment:'原价', rationale:'主战场'},
            {channel:'美团/大众点评', priceAdjustment:'9 折团购', rationale:'拉新引流'},
            {channel:'抖音同城号', priceAdjustment:'套餐立减 50', rationale:'种草转化'}
          ],
          promotions:[
            {occasion:'老店周年庆', discount:'招牌菜 8 折', period:'周年庆当月'},
            {occasion:'新店开业', discount:'双人套餐 5 折', period:'开业首月'}
          ],
          competitorPrices:'广州酒家 150；点都德 80；炳胜 200；太兴 90；gaga 120'
        },
        place:{
          onlineSelf:['小镬记小程序','抖音同城号旗舰店'],
          onlineThird:['美团','大众点评','小红书企业号'],
          onlineNotes:'小程序会员+预约为主；美团/点评做拉新；抖音同城号种草',
          offlineDirect:['荔湾老店','珠江新城店','深圳新店（拟）','上海新店（拟）'],
          offlineDistrib:[],
          offlineRetail:[],
          offlineNotes:'直营连锁为主，第一阶段不开放加盟',
          keyPartners:['小红书探店 KOC','抖音同城 MCN','清远/顺德食材基地'],
          channelIncentives:'KOC 免单+佣金 10%；MCN 坑位费 + GMV 提成 5%',
          structure:[
            {name:'线下', children:[{name:'广州本店', share:60},{name:'深圳新店', share:25},{name:'上海新店', share:15}]},
            {name:'线上', children:[{name:'小程序', share:50},{name:'美团/点评', share:30},{name:'抖音同城', share:20}]}
          ]
        },
        promotion:{
          theme:'30 年老店，新派粤菜',
          advertising:[
            {media:'抖音同城短视频', budgetShare:35, message:'老陈手作+融合菜', kpi:'同城曝光/团购 GMV'},
            {media:'小红书 KOC', budgetShare:30, message:'出片+主厨互动', kpi:'互动率/UGC'},
            {media:'大众点评/美团', budgetShare:20, message:'9 折团购+招牌菜', kpi:'到店转化率'},
            {media:'私域社群', budgetShare:15, message:'老客回馈+新菜试吃', kpi:'复购率'}
          ],
          pr:[
            {event:'老陈手作纪录片上线', timing:'30 周年庆', expectedReach:'同城 100 万曝光'},
            {event:'融合菜发布会', timing:'每季度 1 次', expectedReach:'小红书/同城 50 万'}
          ],
          salesPromotion:[
            {tactic:'美团 9 折团购', mechanic:'招牌菜+融合菜', period:'常年'},
            {tactic:'老客 8 折日', mechanic:'会员日', period:'每月 1 次'}
          ],
          crm:{tool:'小程序+企业微信', membership:'消费满 1000 升级银卡/满 5000 金卡', repurchase:'每 30 天推送新菜/活动', notes:'老客复购是基本盘'},
          contentStrategy:'抖音"老陈手作 30 年"系列 + 小红书"融合菜出片"系列 + 大众点评"食材故事"长图。'
        }
      },

      work5: {
        cover: { title:'小镬记 · 2027 连锁化与品牌年轻化策划书', subtitle:'30 年老店，新派粤菜', team:'小镬记家族团队（老陈/小陈）', date:'2026-08' },
        abstract: '本策划书围绕小镬记从广州 2 家直营向"广州品牌升级+深圳/上海连锁"扩张展开。核心定位"30 年老店，新派粤菜"，以"30 年老店信任+主厨手作+食材溯源+融合菜创新"为四大卖点，主攻 25-45 岁中端堂食客，12 个月内深圳 1 家直营店落地。',
        ch1_business: '小镬记专注粤菜融合，2 家直营店（荔湾老店 30 年/珠江新城 2 年），5 位粤菜师傅，年营收 600 万，毛利 55%。核心价值为功能（30 年老店信任+融合菜创新）、情感（老字号不老气）、社会（懂生活的精致食客）。',
        ch2_environment: {
          political: '餐饮预制菜监管收紧，明厨亮灶要求提高。',
          economic: '2023 年餐饮 5.2 万亿，粤菜占 8.4%；购物中心餐饮倒闭率上升，融合菜反向增长。',
          social: 'Z 世代追求出片；家庭客回归堂食重视真材实料；探店博主驱动新店流量。',
          technological: '抖音同城/小红书探店种草成熟；明厨亮灶直播+小程序会员普及。',
          strengths: ['30 年老店信任','5 位师傅稳定','原产地食材','明厨亮灶'],
          weaknesses: ['新店抖音/小红书弱','融合菜研发慢','家族决策但缺连锁人才'],
          opportunities: ['融合菜红利','深圳/上海扩张','老字号国潮'],
          threats: ['炳胜/广州酒家年轻化','购物中心餐饮倒闭','预制菜监管']
        },
        ch3_strategy: {
          segmentation: '按客户分层：年轻白领（25-35 岁）/ 家庭客（30-45 岁）/ 探店博主（25-30 岁）。',
          targeting: '短期保广州老客；中期攻深圳融合菜新客；长期拓展上海精致中餐客。',
          positioning: '为 25-45 岁中端堂食客提供 30 年老店信任+融合菜创新的粤菜融合专业品牌。'
        },
        ch4_mix: {
          product: '招牌粤菜 15 道+融合菜季度上新+家庭套餐+主厨体验',
          price: '中端定价（128-188 元单道，888 元家庭套餐，398 元主厨体验）',
          place: '广州直营+深圳/上海新店+小程序+美团/抖音同城',
          promotion: '"30 年老店，新派粤菜"——抖音同城"老陈手作"+小红书 KOC 出片',
          customerValue: '30 年老店信任+融合菜创新+食材溯源',
          customerCost: '中端定价+老客折扣+会员积分',
          convenience: '小程序预约+美团/点评+抖音同城',
          communication: '主厨纪录片+探店 KOC+老客社群'
        },
        ch5_outlook: '12 个月内深圳 1 家直营店开业，融合菜占比 30%，抖音同城粉丝 5 万+。3 年内品牌从广州 2 家店升级为粤菜融合品类代表。关键风险为新店选址与师傅团队复制，应对为分阶段开店+师傅师徒制+小陈驻场。',
        references: [
          { authors:'徐兴邦', title:'2024 中国餐饮品牌年轻化趋势报告', year:'2024', url:'' },
          { authors:'', title:'2023 粤菜行业白皮书', year:'2023', url:'' }
        ]
      }
    },

    /* ============================================================
       问渠书院 — 教育 / 培训，国内 OBM（详细）
       ============================================================ */
    wenqu: {
      meta: {
        name: '问渠书院',
        industry: '教育 / 培训',
        tagline: 'K12 素质培训向"素质+职业"双线转型',
        valueChain: {
          curve: '教育 / 培训',
          nodes: [
            {label:'教研/课程设计',     v:8.5, tip:'教学体系/课纲/方法论'},
            {label:'师资/招聘培训',     v:6.0, tip:'教师稳定+司龄+培训体系'},
            {label:'教材/教具/平台',    v:4.0, tip:'教辅/平台/设备'},
            {label:'招生/渠道',         v:5.0, tip:'地推/美团/抖音/B站'},
            {label:'品牌/口碑/案例',    v:9.0, tip:'家长口碑+学员作品 — 最高附加值'},
            {label:'学员服务/就业',     v:5.5, tip:'课后辅导/职业推荐/复购续费'}
          ]
        },
        description: '3 家校区（杭州/宁波/绍兴）的 K12 素质培训机构（编程+美术+口才），年营收 1500 万，员工 25 人。双减后赛道萎缩，老板纠结要不要加"职业培训线"（数字媒体/电商运营/新职业）。',
        ready: true
      },
      work1: {
        sbu: {
          name: '问渠书院',
          category: '教育 / 培训（K12 素质+职业培训）',
          stage: '成熟期',
          scope: '国内',
          countries: ['中国'],
          summary: '3 家校区（杭州/宁波/绍兴）的 K12 素质培训机构，编程+美术+口才三科，年营收 1500 万，员工 25 人，老客续费率 70%，双减后学员数下降 30%。',
          threeQuestions: {customer: true, channel: false, brand: true},
          boundary: '客户：聚焦 4-18 岁 K12 + 18+ 职业转型客，不做 0-3 岁早教/学科类培训；渠道：校区地推+美团点评+小红书家长口碑+抖音+老学员社群；品牌：问渠书院为独立品牌，不与母公司其他业务混用；损益：3 校区独立核算，复用师资与教务体系。'
        },
        environment: {
          political: '双减政策（2021）持续执行，K12 学科类培训受严格限制，素质类（编程/美术/口才）相对宽松；职业培训受人社部/教育部鼓励，证书类合规。',
          economic: '2023 年职业培训市场约 1.2 万亿（年增 12%）；K12 素质培训市场约 2000 亿（双减后稳定）；新职业（数字媒体/电商运营/AI 应用）需求增长。',
          social: '家长鸡娃焦虑+预算紧；大学生就业难（2024 毕业生 1179 万），学一门实用技能意愿强；30+ 转行者看重"学完能找到工作"。',
          technological: 'AI/大模型工具降低数字媒体门槛；线上录播+线下小班混合模式成熟；抖音/小红书职业教育内容获客高效。',
          industry: 'K12 素质：编程猫/核桃编程/美术宝/小码王；职业培训：开课吧/三节课/腾讯课堂/得到高研院/黑马程序员。',
          basics: {
            scale: { actual: '3 校区，员工 25 人，年营收 1500 万', target: '5 校区+1 职业培训线，年营收 3000 万', source: '内部台账' },
            scope: { actual: 'K12 编程+美术+口才 3 科', target: '+ 数字媒体/电商运营/AI 应用 3 科', source: '战略规划' },
            products: { actual: '年课 5800-9800 元，续费 70%', target: 'K12 保老客+职业课 4800-12000/期', source: '产品路线图' },
            customers: { actual: '3 校区 1500 学员，家长 60%/学员 30%/老带新 10%', target: '新增职业线 500 学员', source: '用户调研' },
            supply: { actual: '8 位全职老师+5 位兼职', target: '+ 5 位职业课老师+合作机构讲师', source: '供应链' },
            performance: {
              share: { actual: '杭州素质培训细分 0.4%', target: '0.8%（职业线贡献）', source: '目标推导' },
              roi: { actual: '1.2', target: '1.5', source: '财务模型' },
              growth: { actual: '年减 5%（双减影响）', target: '年增 20%（职业线带动）', source: '行业基准' }
            }
          },
          competitors: [
            { id:'c1', name:'编程猫', price:'年课 6000-12000 元', strengths:'编程细分龙头、AI 课程完整', weaknesses:'线下校区少、客单价高', position:'以"3 校区口碑+性价比"对抗' },
            { id:'c2', name:'核桃编程', price:'年课 4000-9000 元', strengths:'线上为主、价格亲民、规模大', weaknesses:'线下体验弱、师资不稳定', position:'以"线下小班+老师稳定"差异化' },
            { id:'c3', name:'开课吧', price:'职业课 5000-15000 元', strengths:'互联网职业教育头部、师资强', weaknesses:'近年暴雷口碑受损、就业兑现差', position:'以"3 校区稳定+就业推荐"重建信任' },
            { id:'c4', name:'三节课', price:'职业课 3000-8000 元', strengths:'互联网产品/运营课程口碑好', weaknesses:'线下弱、就业兑现一般', position:'以"线下+就业社群"差异化' },
            { id:'c5', name:'黑马程序员', price:'职业课 8000-20000 元', strengths:'IT 培训老牌、就业服务', weaknesses:'课程偏传统、缺新职业', position:'以"新职业+小班+老师稳定"切入' }
          ],
          ourCapabilities: {
            delivery: '3 校区场地+8 位全职老师+教务体系稳定',
            core: '5 年办学经验+老客续费 70%+本地口碑',
            brand: '3 城市本地家长口碑强，跨城品牌力弱',
            customer: '老学员社群 3000+家长',
            compliance: '办学许可证+素质类课程备案+人社部证书合作',
            defensive: '本地老客粘性+老师稳定+教务体系',
            critical: '新职业课师资弱+跨城复制能力待验证',
            structural: '团队偏 K12，缺职业培训运营/讲师',
            smileCurve: '优势在客户（老客粘性）+ 核心（师资稳定），劣势在品牌（跨城弱）+ 交付（缺新职业）——定位为"本地老客+职业线扩展"双轮',
            trends: 'AI 应用、电商运营、数字媒体、新职业、混合学习'
          }
        },
        personas: [
          { id:'p1', name:'李姐', gender:'女', age:'36', occupation:'小学三年级家长', income:'杭州 25 万/年（家庭）', region:'杭州西湖',
            values:['鸡娃焦虑','性价比','效果可见'], painPoints:'孩子学习兴趣低、报班多花销大、效果难量化',
            channels:['小红书家长群','美团点评','抖音'], quote:'我愿意花钱，但要看得到孩子进步。' },
          { id:'p2', name:'小王', gender:'男', age:'22', occupation:'大四应届生', income:'暂无', region:'宁波',
            values:['学完能找到工作','实战项目','简历加分'], painPoints:'大学学的没用、简历没亮点、面试总被拒',
            channels:['抖音','小红书','B 站'], quote:'我学完最关心能不能进面试、能不能拿 offer。' },
          { id:'p3', name:'张姐', gender:'女', age:'32', occupation:'传统行业待业 6 月', income:'失业金', region:'绍兴',
            values:['学一门新技能','转行可行','老师负责'], painPoints:'30+ 转行难、培训机构套路多、学完就业没保障',
            channels:['抖音','小红书','老学员推荐'], quote:'我已经被坑过两次，这次必须看口碑+就业案例。' }
        ],
        scenarios: [
          { id:'sc1', name:'家长报班决策', personaIds:['p1'],
            benefits:{usage:'试学课+小班',service:'学习进度反馈',staff:'老师稳定+教务跟进',image:'重视教育的家长'},
            costs:{monetary:'年课 5800-9800 元',time:'接送 1-2 小时/周',energy:'选班纠结',psychic:'效果不确定'},
            anchor:'效果可见 + 老师负责', decisiveGap:'学习进度可视化+老师稳定——小程序学习报告+老师点评' },
          { id:'sc2', name:'大学生求职技能', personaIds:['p2'],
            benefits:{usage:'实战项目+作品集',service:'简历指导+模拟面试',staff:'就业老师',image:'上进的应届生'},
            costs:{monetary:'职业课 4800-12000 元',time:'3-6 个月',energy:'学习强度',psychic:'找不到工作'},
            anchor:'就业兑现 + 项目实战', decisiveGap:'就业推荐+作品集——合作企业内推+学员作品墙' },
          { id:'sc3', name:'30+ 转行决策', personaIds:['p3'],
            benefits:{usage:'零基础友好+小班',service:'职业规划+老师答疑',staff:'老师负责+教务跟进',image:'勇敢转行的姐姐'},
            costs:{monetary:'职业课 4800-12000 元',time:'3-6 个月',energy:'工作+学习',psychic:'学完没人要'},
            anchor:'老师负责 + 就业保障', decisiveGap:'本地口碑+就业案例——老学员转行案例+就业社群' }
        ],
        metrics: {
          disclaimerAcknowledged: true,
          dimensions: [
            { id:'dm1', name:'教学·质量', secondaries:[
              { id:'ds1', name:'老师稳定性', measure:'老师流失率/年', forecast: 8, target: 9 },
              { id:'ds2', name:'教学效果', measure:'学员作品/成绩提升', forecast: 7, target: 8 },
              { id:'ds3', name:'课程体系完整', measure:'课程大纲完善度', forecast: 7, target: 8 }
            ]},
            { id:'dm2', name:'品牌·认知', secondaries:[
              { id:'ds4', name:'本地知名度', measure:'无提示提及率（杭州/宁波%）', forecast: 7, target: 8 },
              { id:'ds5', name:'差异化定位', measure:'能说出"老师稳定"的家长%', forecast: 6, target: 8 },
              { id:'ds6', name:'口碑传播', measure:'老带新转化率', forecast: 7, target: 8 }
            ]},
            { id:'dm3', name:'品牌·判断', secondaries:[
              { id:'ds7', name:'专业可信', measure:'专业度评分', forecast: 7, target: 8 },
              { id:'ds8', name:'就业保障', measure:'就业案例数/可信度', forecast: 4, target: 8 },
              { id:'ds9', name:'性价比', measure:'性价比评分', forecast: 6, target: 8 }
            ]},
            { id:'dm4', name:'品牌·感受', secondaries:[
              { id:'ds10', name:'校区环境', measure:'校区环境评分', forecast: 7, target: 8 },
              { id:'ds11', name:'品牌温度', measure:'品牌情感题均分', forecast: 7, target: 8 },
              { id:'ds12', name:'信任感', measure:'信任题均分', forecast: 7, target: 9 }
            ]},
            { id:'dm5', name:'复购·推荐', secondaries:[
              { id:'ds13', name:'社群归属', measure:'家长社群活跃度', forecast: 7, target: 8 },
              { id:'ds14', name:'续费意愿', measure:'年续费率', forecast: 7, target: 8 },
              { id:'ds15', name:'推荐意愿', measure:'NPS', forecast: 7, target: 9 }
            ]}
          ]
        },
        survey: (function(){
          const anchors=['非常不同意','不同意','一般','同意','非常同意'];
          const qs=[
            {id:'q1', type:'likert', text:'问渠书院老师稳定，不会出现频繁换老师', anchors:[...anchors], sourceIndicatorId:'ds1'},
            {id:'q2', type:'likert', text:'问渠书院教学效果可见，孩子作品/成绩有提升', anchors:[...anchors], sourceIndicatorId:'ds2'},
            {id:'q3', type:'likert', text:'问渠书院课程体系完整，从入门到进阶清晰', anchors:[...anchors], sourceIndicatorId:'ds3'},
            {id:'q4', type:'likert', text:'在杭州/宁波/绍兴本地我常听到问渠书院', anchors:[...anchors], sourceIndicatorId:'ds4'},
            {id:'q5', type:'likert', text:'问渠书院在"老师稳定+教学扎实"上有差异化', anchors:[...anchors], sourceIndicatorId:'ds5'},
            {id:'q6', type:'likert', text:'我常在小红书/抖音看到问渠书院的正面口碑', anchors:[...anchors], sourceIndicatorId:'ds6'},
            {id:'q7', type:'likert', text:'问渠书院在 K12 素质+职业培训上展现专业度', anchors:[...anchors], sourceIndicatorId:'ds7'},
            {id:'q8', type:'likert', text:'我信任问渠书院的就业推荐服务', anchors:[...anchors], sourceIndicatorId:'ds8'},
            {id:'q9', type:'likert', text:'问渠书院的课包与价值匹配', anchors:[...anchors], sourceIndicatorId:'ds9'},
            {id:'q10',type:'likert', text:'问渠书院校区环境干净安全', anchors:[...anchors], sourceIndicatorId:'ds10'},
            {id:'q11',type:'likert', text:'问渠书院让我感到"不是冷冰冰的机构"', anchors:[...anchors], sourceIndicatorId:'ds11'},
            {id:'q12',type:'likert', text:'我信任问渠书院的办学历史与合规', anchors:[...anchors], sourceIndicatorId:'ds12'},
            {id:'q13',type:'likert', text:'我愿意加入问渠书院的家长/学员社群', anchors:[...anchors], sourceIndicatorId:'ds13'},
            {id:'q14',type:'likert', text:'我会续费/复购问渠书院的课程', anchors:[...anchors], sourceIndicatorId:'ds14'},
            {id:'q15',type:'likert', text:'我愿意向朋友推荐问渠书院', anchors:[...anchors], sourceIndicatorId:'ds15'},
            {id:'q16',type:'likert', text:'我愿意参与问渠书院的活动/课程体验', anchors:[...anchors], sourceIndicatorId:'ds16'}
          ];
          const personas=[
            {p:'p1', base:[5,4,4,5,4,3,4,4,4,4,4,5,4,5,5,4]},
            {p:'p2', base:[4,4,4,3,4,3,4,5,4,3,3,4,3,4,4,4]},
            {p:'p3', base:[5,4,4,3,4,3,4,5,4,4,4,4,3,4,4,3]}
          ];
          const clamp=(v,lo,hi)=>Math.max(lo,Math.min(hi,v));
          const responses=[];
          personas.forEach(p=>{
            for(let r=0;r<3;r++){
              const answers=qs.map((q,i)=>{
                const v=clamp(p.base[i]+Math.round((Math.random()-.5)*2),1,5);
                return {questionId:q.id,value:v};
              });
              responses.push({personaId:p.p, answers});
            }
          });
          const mean=a=>a.reduce((x,y)=>x+y,0)/(a.length||1);
          const sd=a=>{ const m=mean(a); return Math.sqrt(mean(a.map(x=>(x-m)*(x-m)))); };
          const likertStats={};
          qs.forEach(q=>{
            const vals=[]; const dist=[0,0,0,0,0];
            responses.forEach(r=>{ const an=r.answers.find(x=>x.questionId===q.id); const v=parseInt(an?.value); if(!isNaN(v)&&v>=1&&v<=5){vals.push(v);dist[v-1]++;} });
            likertStats[q.id]={mean:+mean(vals).toFixed(2),sd:+sd(vals).toFixed(2),dist,n:vals.length};
          });
          const indicatorMeans=qs.map(q=>({label:q.text.length>18?q.text.slice(0,18)+'…':q.text, value:likertStats[q.id].mean, mean:likertStats[q.id].mean, sourceIndicatorId:q.sourceIndicatorId||null}));
          WENQU_STATS={likertStats, indicatorMeans};
          return {questions:qs, responses, n:3, status:'done', progress:{done:9,total:9}, error:null, mode:'demo', useFewShot:true, useRag:false, ragContext:''};
        })(),
        analysis: Object.assign({openThemes:[], insights:'1. 老师稳定性（Q1）与本地口碑（Q4）是问渠书院的强项，得分 4.0+，5 年办学沉淀有效。\n2. 就业保障（Q8）是核心短板，K12 老客稳定但职业线新业务尚无案例，客户对"学完能找到工作"信任度低。\n3. 性价比（Q9）在家长客群中突出（K12 课包贵），但职业课客群愿为"就业兑现"付溢价。\n4. 跨城品牌（Q4）仅限于 3 个城市，新职业线如复制到其他城市需建立新信任锚点。\n5. 老师稳定+本地口碑+小班是核心传播资产，职业线应以"就业案例+作品集+本地推荐"建立信任。'}, WENQU_STATS || {}),
        values: {
          functional: ['老师稳定','教学扎实','就业推荐'],
          emotional: ['家长放心','学员成长'],
          social: ['重视教育的家长','上进的学习者'],
          epistemic: ['学习报告','学员作品集'],
          conditional: ['K12 鸡娃','大学生求职','30+ 转行'],
          chosenFunctional: '老师稳定+教学扎实+就业推荐',
          chosenEmotional: '家长/学员的成长陪伴',
          chosenSocial: '重视教育+上进的成长型人群',
          rationale: '以"老师稳定+教学扎实+就业推荐"建立功能可信度，以"成长陪伴"建立情感连接，以"成长型人群"承担社交身份。'
        },
        recommendations: {
          short: '上线小程序学习报告+学员作品墙；小红书+抖音开账号发布"老师稳定+学员成长"系列内容。',
          mid: '6 个月内职业线开 2 个班（数字媒体+电商运营），与 3-5 家本地企业建立就业合作。',
          long: '建立"问渠成长陪伴"内容 IP，K12+职业双线联动，从 3 校区本地品牌升级为浙江素质+职业培训代表。',
          risks: ['职业线师资招聘难','就业兑现不达标影响口碑','双减政策再度收紧','跨城复制能力不足']
        }
      },

      work2: {
        scope: {
          question: '问渠书院应优先拓展哪个客户细分市场？',
          timeframe: '12-18 个月',
          constraints: '职业线团队从零搭建；老客不能流失；预算 300 万',
          candidateCount: 3
        },
        attractiveness: {indicators:[
          {id:'a1',name:'市场规模',weight:0.25,source:'delphi',support:5,rubric:{high:'目标客群 >500 万',mid:'100-500 万',low:'<100 万'}},
          {id:'a2',name:'增长率',weight:0.30,source:'delphi',support:5,rubric:{high:'新职业/就业培训 >30%',mid:'15-30%',low:'<15%'}},
          {id:'a3',name:'客单价',weight:0.20,source:'delphi',support:5,rubric:{high:'客单 >8000 元',mid:'4000-8000 元',low:'<4000 元'}},
          {id:'a4',name:'就业刚需',weight:0.25,source:'delphi',support:5,rubric:{high:'就业难+学完就业意愿 >70%',mid:'40-70%',low:'<40%'}}
        ]},
        competitiveness: {indicators:[
          {id:'c1',name:'师资基础',weight:0.30,source:'delphi',support:5,rubric:{high:'现有 8 位全职可转岗',mid:'需新招 3-5 位',low:'需重招团队'}},
          {id:'c2',name:'品牌资产匹配',weight:0.25,source:'delphi',support:5,rubric:{high:'老客信任可迁移',mid:'部分场景匹配',low:'需重塑品牌'}},
          {id:'c3',name:'渠道效率',weight:0.20,source:'delphi',support:5,rubric:{high:'现有渠道 ROI >1.5',mid:'1-1.5',low:'<1'}},
          {id:'c4',name:'就业资源',weight:0.25,source:'delphi',support:5,rubric:{high:'已有本地合作企业',mid:'3-6 月可谈',low:'需 12+ 月从零'}}
        ]},
        delphi: {
          status: 'done',
          weights: {
            attractiveness: {a1:0.25,a2:0.30,a3:0.20,a4:0.25},
            competitiveness: {c1:0.30,c2:0.25,c3:0.20,c4:0.25}
          },
          finalSynthesis: '两轮 Delphi 后专家对"增长率"与"师资基础"赋权最高。大学生/职场新人客单价高、就业刚需强、老学员可推荐，6 个月内可贡献 30% 营收；K12 老客稳定但增长见顶；30+ 转行者人数多但客单价低、就业兑现风险大。'
        },
        markets: [
          { id:'m1', name:'大学生/职场新人', region:'杭州/宁波/绍兴高校+职场', population:'约 200 万', gdpPerCapita:'家庭年收入 15-30 万', notes:'就业刚需强、客单价高、社交传播好',
            scores:{a1:8, a2:9, a3:9, a4:9, c1:7, c2:7, c3:6, c4:6} },
          { id:'m2', name:'K12 老客（鸡娃续费）', region:'3 校区周边家庭', population:'已有 1500 学员家庭', gdpPerCapita:'家庭年收入 25-50 万', notes:'老客粘性强，续费 70%',
            scores:{a1:6, a2:5, a3:7, a4:4, c1:9, c2:10, c3:9, c4:5} },
          { id:'m3', name:'30+ 转行者', region:'浙江省内待业/转行', population:'约 100 万', gdpPerCapita:'家庭年收入 10-20 万', notes:'人数多、就业兑现风险大',
            scores:{a1:7, a2:7, a3:5, a4:8, c1:5, c2:5, c3:4, c4:3} }
        ],
        matrix: { selectedMarketId:'m1', xCut:null, yCut:null, notes:'短期保 m2 K12 老客续费，中期重点攻 m1 大学生/职场新人，长期考虑 m3 30+ 转行者（需先建就业案例）。' },
        decision: {
          rationale: 'm1 大学生/职场新人客单价高、就业刚需强、老学员推荐可借力，6 个月内可贡献 30% 营收；m2 老客稳定但增长见顶；m3 转行者人数多但兑现风险大。',
          sequence: 'm2 K12 老客续费（0-6 月）→ m1 大学生/职场新人职业课（3-12 月）→ m3 30+ 转行者（12+ 月，需先建就业案例）',
          risks: ['职业线师资招聘难','就业兑现不达标','m1 客群对老牌 K12 品牌认知弱','m2 家长对职业线担心分散精力'],
          nextSteps: '6 月内招 2 名职业课老师+1 名就业对接；与 3-5 家本地企业签就业合作协议；上线小程序学习报告+作品墙。'
        }
      },

      work3: {
        context: {
          sbuName: '问渠书院',
          targetMarket: '大学生/职场新人 + K12 老客续费',
          personas: [
            { id:'p1', name:'李姐', painPoints:'孩子学习兴趣低、效果难量化' },
            { id:'p2', name:'小王', painPoints:'简历没亮点、面试总被拒' },
            { id:'p3', name:'张姐', painPoints:'30+ 转行难、培训机构套路多' }
          ],
          hasSurvey: true
        },
        mining: {
          documents: [
            '问渠书院的老师很负责，孩子学了一年进步很大。',
            '我家娃学了编程后，学校选拔被选上了。',
            '职业课能不能给个作品集，面试用得上？',
            '我同学在开课吧学完没找到工作，不敢去。',
            '30+ 转行很难，培训机构都收割焦虑。',
            '希望有试听课，先看看老师讲得怎么样。',
            '线上学不会，能去线下校区吗？',
            '老学员推荐有优惠吗？',
            '问渠的美术课不错，孩子喜欢。',
            '口才课老师换了三次，娃都不想学了。'
          ],
          ldaParams:{k:3,passes:15,iterations:100,no_below:2,no_above:0.5},
          stats:{raw_count:10,valid_count:10,total_words:145,vocab_size:40,coherence:0.43},
          topics:[
            {id:0,label:'老师稳定与教学效果',share:42,keywords:[
              {word:'老师',weight:.10},{word:'负责',weight:.07},{word:'进步',weight:.06},{word:'学完',weight:.05},{word:'喜欢',weight:.04}
            ],representative_docs:['问渠书院的老师很负责','口才课老师换了三次']},
            {id:1,label:'就业与作品集',share:33,keywords:[
              {word:'就业',weight:.09},{word:'作品集',weight:.07},{word:'面试',weight:.06},{word:'简历',weight:.05},{word:'找不到',weight:.04}
            ],representative_docs:['职业课能不能给个作品集','我同学学完没找到工作']},
            {id:2,label:'转行焦虑与试听',share:25,keywords:[
              {word:'转行',weight:.08},{word:'30+',weight:.06},{word:'焦虑',weight:.06},{word:'试听',weight:.05},{word:'推荐',weight:.04}
            ],representative_docs:['30+ 转行很难','希望有试听课']}
          ],
          wordFreqTop:[
            {word:'老师',count:5},{word:'就业',count:3},{word:'作品',count:3},{word:'转行',count:2},{word:'进步',count:2},
            {word:'试听',count:2},{word:'推荐',count:2},{word:'面试',count:2},{word:'简历',count:2},{word:'孩子',count:2}
          ],
          painMap:[
            {id:'pa1',pain:'老师频繁更换，学员粘性下降',evidence:'口才课老师换了三次',frequency:'高',linkedNeeds:['老师稳定','师徒制'],linkedTopicId:0,type:'痛点'},
            {id:'pa2',pain:'职业课缺作品集，面试无亮点',evidence:'职业课能不能给个作品集',frequency:'高',linkedNeeds:['实战项目','作品墙'],linkedTopicId:1,type:'痛点'},
            {id:'pa3',pain:'培训机构套路多，就业兑现差',evidence:'我同学学完没找到工作',frequency:'中',linkedNeeds:['就业案例','合作企业'],linkedTopicId:1,type:'痛点'},
            {id:'pa4',pain:'30+ 转行难，无试听难决策',evidence:'30+ 转行很难，希望有试听课',frequency:'中',linkedNeeds:['试听课','职业规划'],linkedTopicId:2,type:'痛点'},
            {id:'pa5',pain:'效果难量化，家长无感知',evidence:'效果难量化，孩子进步看不见',frequency:'中',linkedNeeds:['学习报告','学员成长档案'],linkedTopicId:0,type:'痒点'}
          ]
        },
        candidates:[
          {id:'c1',name:'老师稳定承诺',pain:'老师流失',description:'5 年老师平均司龄+师徒制+教务关怀，承诺 1 年内不换老师',evidence:'10 篇评论中 5 篇提及老师',
            desirabilityScores:{p1:{importance:10,uniqueness:8,credibility:9},p2:{importance:8,uniqueness:7,credibility:8},p3:{importance:9,uniqueness:8,credibility:9}},
            desirabilitySource:'personas', importance:9.0,uniqueness:7.7,credibility:8.7,
            feasibility:8,communicability:9,sustainability:9, selected:true},
          {id:'c2',name:'学员作品集+作品墙',pain:'面试无亮点',description:'每期课产出 3-5 个实战作品，作品墙上墙+小程序可看',evidence:'3 篇评论提及作品集',
            desirabilityScores:{p1:{importance:8,uniqueness:7,credibility:8},p2:{importance:10,uniqueness:8,credibility:9},p3:{importance:9,uniqueness:7,credibility:8}},
            desirabilitySource:'personas', importance:9.0,uniqueness:7.3,credibility:8.3,
            feasibility:8,communicability:8,sustainability:8, selected:true},
          {id:'c3',name:'就业推荐+合作企业',pain:'兑现差',description:'与本地 3-5 家企业签就业协议，学员毕业内推+就业社群',evidence:'2 篇评论提及就业',
            desirabilityScores:{p1:{importance:6,uniqueness:6,credibility:6},p2:{importance:10,uniqueness:8,credibility:8},p3:{importance:10,uniqueness:8,credibility:8}},
            desirabilitySource:'personas', importance:8.7,uniqueness:7.3,credibility:7.3,
            feasibility:6,communicability:8,sustainability:7, selected:true},
          {id:'c4',name:'小程序学习报告',pain:'效果难量化',description:'每节课后生成学习报告，阶段评估+老师点评+成长档案',evidence:'内部策略，无评论',
            desirabilityScores:{p1:{importance:10,uniqueness:7,credibility:8},p2:{importance:7,uniqueness:7,credibility:7},p3:{importance:8,uniqueness:7,credibility:7}},
            desirabilitySource:'personas', importance:8.3,uniqueness:7.0,credibility:7.3,
            feasibility:8,communicability:7,sustainability:8, selected:true},
          {id:'c5',name:'试听课+职业规划',pain:'决策难',description:'0 元试听+1v1 职业规划，老学员推荐有奖励',evidence:'2 篇评论提及试听',
            desirabilityScores:{p1:{importance:7,uniqueness:5,credibility:6},p2:{importance:7,uniqueness:5,credibility:6},p3:{importance:8,uniqueness:6,credibility:6}},
            desirabilitySource:'personas', importance:7.3,uniqueness:5.3,credibility:6.0,
            feasibility:9,communicability:7,sustainability:7, selected:false}
        ],
        dimensions:{
          desirability:[{key:'importance',label:'重要性'},{key:'uniqueness',label:'独特性'},{key:'credibility',label:'可信度'}],
          implementability:[{key:'feasibility',label:'可行性'},{key:'communicability',label:'传播力'},{key:'sustainability',label:'持续性'}]
        },
        matrix:{showSector:true,sectorAngle:90,sectorRadius:12,xCut:null,yCut:null,manualSelected:[]},
        migration:{analyses:[]},
        proposition:{
          coreValueIds:['c1','c2','c3','c4'],
          alternatives:[
            {id:'a1',text:'老师稳定，成长可见。'},
            {id:'a2',text:'学得会，找得到。'},
            {id:'a3',text:'问渠书院，成长陪伴。'}
          ],
          chosenValueText:'问渠书院，成长陪伴。',
          positioning:{brand:'问渠书院', audience:'4-18 岁 K12 学员+18+ 大学生/职场新人/转行者', coreValue:'老师稳定+作品集+就业推荐+学习报告', category:'浙江素质+职业培训专业品牌'},
          positioningStatement:'问渠书院 是为 4-18 岁 K12 学员与 18+ 大学生/职场新人/转行者 提供 老师稳定+作品集+就业推荐+学习报告 的 浙江素质+职业培训专业品牌。',
          sloganOptions:['老师稳定，成长可见','学得会，找得到','问渠书院，成长陪伴'],
          chosenSlogan:'问渠书院，成长陪伴',
          mbti:'ISFJ',
          archetype: { primary: 'Caregiver', secondary: 'Sage' },
          personalityTraits:['陪伴','稳定','专业','温暖','成长']
        }
      },

      work4: {
        route:{
          scope:'domestic',
          oemType:'OBM',
          entryMode:'',
          light:[],
          politicalPower:''
        },
        product:{
          name:'问渠书院素质+职业双线课程',
          description:'K12 素质+职业培训双线，老师稳定+作品集+就业推荐',
          coreDifferentiators:['老师稳定承诺','学员作品集','就业推荐合作','学习报告可视化'],
          physicalFeatures:'5 年老师司龄 / 师徒制 / 3 校区直营 / 线上线下混合 / 小程序学习报告',
          serviceOffering:'0 元试听 / 1v1 职业规划 / 学习进度反馈 / 就业社群 / 老学员推荐奖励',
          technologyMoat:'5 年办学经验 + 8 位全职老师 + 教务体系 + 本地企业合作',
          skus:[
            {name:'K12 编程年课', specs:'48 课时', price_range:'5800-8800 元/年', differentiator:'老师稳定+作品集'},
            {name:'K12 美术年课', specs:'48 课时', price_range:'5800-9800 元/年', differentiator:'老师稳定+作品集'},
            {name:'数字媒体职业课', specs:'3 个月 96 课时', price_range:'6800-9800 元/期', differentiator:'作品集+就业推荐'},
            {name:'电商运营职业课', specs:'3 个月 96 课时', price_range:'4800-7800 元/期', differentiator:'实战项目+合作企业'}
          ]
        },
        price:{
          strategy:'value',
          strategyNote:'K12 中端定价+老客续费优惠；职业线中高端定价，以"作品集+就业推荐"承担溢价。',
          tiers:[
            {name:'K12 单科年课', targetSegment:'K12 家长', price:7800, unit:'元/年', notes:'编程/美术/口才'},
            {name:'K12 双科包', targetSegment:'鸡娃家长', price:13800, unit:'元/年', notes:'任选两科 9 折'},
            {name:'数字媒体职业课', targetSegment:'大学生/职场新人', price:8800, unit:'元/期', notes:'3 个月 96 课时'},
            {name:'电商运营职业课', targetSegment:'转行者/副业', price:6800, unit:'元/期', notes:'3 个月 96 课时'}
          ],
          channelPricing:[
            {channel:'校区直营', priceAdjustment:'原价', rationale:'主战场'},
            {channel:'美团/大众点评', priceAdjustment:'9 折试听卡', rationale:'拉新引流'},
            {channel:'抖音/小红书', priceAdjustment:'职业课 9 折', rationale:'种草转化'}
          ],
          promotions:[
            {occasion:'暑期班', discount:'K12 双科包立减 1000', period:'6-8 月'},
            {occasion:'老学员推荐', discount:'推荐 1 人各得 500', period:'常年'}
          ],
          competitorPrices:'编程猫 6000-12000；核桃编程 4000-9000；开课吧 5000-15000；三节课 3000-8000；黑马 8000-20000'
        },
        place:{
          onlineSelf:['问渠小程序','问渠官网'],
          onlineThird:['美团','大众点评','抖音企业号','小红书企业号','B 站'],
          onlineNotes:'小程序为主阵地（学习报告+作品墙+试听预约）；美团/点评做拉新；抖音/小红书/B 站种草',
          offlineDirect:['杭州西湖校区','宁波校区','绍兴校区'],
          offlineDistrib:[],
          offlineRetail:[],
          offlineNotes:'3 校区直营，第一阶段不开放加盟；职业课与 K12 共享校区',
          keyPartners:['本地 3-5 家合作企业（就业内推）','小红书 KOC','抖音教育 MCN'],
          channelIncentives:'KOC 试听课免费+佣金 10%；MCN 坑位费 + GMV 提成 5%',
          structure:[
            {name:'线下', children:[{name:'杭州校区', share:45},{name:'宁波校区', share:30},{name:'绍兴校区', share:25}]},
            {name:'线上', children:[{name:'小程序', share:50},{name:'美团/点评', share:25},{name:'抖音/小红书', share:25}]}
          ]
        },
        promotion:{
          theme:'问渠书院，成长陪伴',
          advertising:[
            {media:'抖音短视频', budgetShare:30, message:'老师稳定+学员作品', kpi:'GMV/试听转化'},
            {media:'小红书 KOC', budgetShare:25, message:'学员成长案例', kpi:'互动率/到店'},
            {media:'美团/点评', budgetShare:20, message:'9 折试听', kpi:'到店率'},
            {media:'私域社群', budgetShare:25, message:'老学员推荐+学习报告', kpi:'续费率/转介绍'}
          ],
          pr:[
            {event:'学员作品展+就业案例发布会', timing:'每季度 1 次', expectedReach:'同城 30 万家庭/学员群体'},
            {event:'老师司龄纪念+师徒签约', timing:'每年 9 月', expectedReach:'本地 10 万家长群体'}
          ],
          salesPromotion:[
            {tactic:'老学员推荐有奖', mechanic:'推荐 1 人各得 500', period:'常年'},
            {tactic:'暑期班双科包立减 1000', mechanic:'K12 双科', period:'6-8 月'}
          ],
          crm:{tool:'小程序+企业微信+教务系统', membership:'银卡（消费 5000）/金卡（消费 15000）/钻石卡（消费 30000）', repurchase:'每 90 天推送续费/新课程', notes:'老客续费是基本盘'},
          contentStrategy:'抖音"老师司龄 5 年"系列 + 小红书"学员成长档案"系列 + 公众号"学习报告"长图。'
        }
      },

      work5: {
        cover: { title:'问渠书院 · 2027 素质+职业双线转型策划书', subtitle:'问渠书院，成长陪伴', team:'问渠书院教学团队', date:'2026-08' },
        abstract: '本策划书围绕问渠书院从 K12 素质单线向"素质+职业"双线转型展开。核心定位"问渠书院，成长陪伴"，以"老师稳定+作品集+就业推荐+学习报告"为四大卖点，主攻 4-18 岁 K12 + 18+ 大学生/职场新人/转行者，12 个月内职业线贡献 30% 营收。',
        ch1_business: '问渠书院专注 K12 素质+职业培训，3 校区（杭州/宁波/绍兴），25 人团队，年营收 1500 万，续费 70%。核心价值为功能（老师稳定+作品集+就业推荐）、情感（成长陪伴）、社会（成长型人群）。',
        ch2_environment: {
          political: '双减持续执行，素质类相对宽松；职业培训受鼓励。',
          economic: '职业培训 1.2 万亿（年增 12%）；K12 素质 2000 亿稳定；新职业需求增长。',
          social: '家长鸡娃+预算紧；大学生就业难；30+ 转行看重就业兑现。',
          technological: 'AI/大模型工具降低新职业门槛；线上+线下混合模式成熟；抖音/小红书职业教育获客高效。',
          strengths: ['5 年老师稳定','老客续费 70%','3 校区本地口碑','教务体系完整'],
          weaknesses: ['跨城品牌弱','新职业师资弱','缺就业案例','团队偏 K12'],
          opportunities: ['新职业红利','就业市场刚需','本地企业合作'],
          threats: ['双减再度收紧','开课吧暴雷影响信任','编程猫/核桃下沉']
        },
        ch3_strategy: {
          segmentation: '按客户分层：K12 家长（4-18 岁孩子）/ 大学生/职场新人 / 30+ 转行者。',
          targeting: '短期保 K12 老客续费；中期攻大学生/职场新人；长期拓展 30+ 转行者。',
          positioning: '为 4-18 岁 K12 学员与 18+ 大学生/职场新人/转行者提供老师稳定+作品集+就业推荐的浙江素质+职业培训专业品牌。'
        },
        ch4_mix: {
          product: 'K12 编程/美术/口才 + 数字媒体/电商运营职业课',
          price: 'K12 7800 元/年；数字媒体 8800 元/期；电商 6800 元/期',
          place: '3 校区直营+小程序+美团/抖音/小红书',
          promotion: '"问渠书院，成长陪伴"——抖音"老师司龄 5 年"+小红书"学员成长档案"',
          customerValue: '老师稳定+作品集+就业推荐+学习报告',
          customerCost: '中端定价+老学员推荐奖励',
          convenience: '3 校区+小程序+试听课',
          communication: '老师纪录片+学员作品展+老学员社群'
        },
        ch5_outlook: '12 个月内职业线开 2 个班（数字媒体+电商），与 3-5 家本地企业签就业合作，职业线营收占比从 0 到 30%。3 年内品牌从 3 校区 K12 升级为浙江素质+职业培训代表。关键风险为职业线师资与就业兑现，应对为先小班试点+老学员推荐+本地企业合作。',
        references: [
          { authors:'', title:'2024 中国职业培训行业白皮书', year:'2024', url:'' },
          { authors:'', title:'双减后 K12 素质培训发展报告', year:'2023', url:'' }
        ]
      }
    },

    /* ============================================================
       恒锐精密 — 制造 / 专精特新，国内 OBM（详细）
       ============================================================ */
    hengrui: {
      meta: {
        name: '恒锐精密',
        industry: '制造 / 专精特新',
        tagline: '小五金精密件 OEM 走自有品牌',
        description: '东莞 8000 万营收的精密件 OEM 厂（汽车变速箱+医疗+消费电子），员工 80 人。大客户砍单（一家占 40%）+ 价格战压力，老板想从纯 OEM 走自有品牌"恒锐造"。',
        valueChain: {
          curve: '制造 / 精密件',
          nodes: [
            {label:'研发/工程设计',     v:8.5, tip:'公差/材料/工艺 — IP/图纸'},
            {label:'关键零部件外购',   v:5.5, tip:'刀具/夹具/标准件'},
            {label:'制造/装配',         v:2.5, tip:'CNC/后处理 — 微笑曲线谷底'},
            {label:'物流/分销',         v:4.0, tip:'仓配/客户交付'},
            {label:'品牌/营销',         v:9.0, tip:'展会+自有品牌 — 最高附加值'},
            {label:'售后/技术服务',     v:5.0, tip:'客户走访/质量追溯/补件'}
          ]
        },
        ready: true
      },
      work1: {
        sbu: {
          name: '恒锐精密',
          category: '制造 / 专精特新（精密五金件 OEM+自有品牌）',
          stage: '成长期',
          scope: '国内',
          countries: ['中国'],
          summary: '东莞 8000 万营收的精密件 OEM 厂，服务汽车变速箱+医疗+消费电子三领域，员工 80 人，30+ 台 CNC 设备，SPC 体系完备，0.005mm 精度。',
          threeQuestions: {customer: true, channel: true, brand: true},
          boundary: '客户：聚焦 B 端整机品牌方+工业采购经理+专精特新渠道商，不做 C 端；渠道：直销团队+阿里 1688+行业展会（SIMM/CIMT）+微信生态，不依赖单一客户；品牌：恒锐造为独立自有品牌，与 OEM 业务做品牌区隔；损益：OEM 与自有品牌独立核算，复用工厂与设备。'
        },
        environment: {
          political: '专精特新政策持续加码，工信部"小巨人"扶持；制造业增值税即征即退；东莞"机器换人"补贴；中美贸易摩擦下国产替代加速。',
          economic: '2023 年中国精密零部件市场 1.8 万亿（年增 8%）；汽车/医疗/消费电子下游增长稳健；国产替代率从 30% 提升到 50%+。',
          social: '工业 4.0 推动柔性制造；B 端采购线上化（1688/京东工业）；客户对交期/资质/小批量柔性要求提升。',
          technological: 'CNC 五轴加工+3D 打印+激光检测成熟；MES/ERP 数字化；SPC 体系+ISO 9001/IATF 16949 认证；AI 视觉检测。',
          industry: '精密件 OEM 头部：科达制造/巨轮智能/拓斯达；专精特新标杆：苏州春兴/宁波震裕/东莞长盈精密；自营品牌新锐：长盈精密自有品牌、绿的谐波。',
          basics: {
            scale: { actual: '8000 万营收，80 人，30+ 台 CNC', target: '1.5 亿营收，自有品牌占 30%', source: '内部台账' },
            scope: { actual: '汽车变速箱+医疗+消费电子三领域', target: '汽车+医疗+3C+机器人四领域', source: '战略规划' },
            products: { actual: '精密五金件 OEM，0.005mm 精度', target: 'OEM+自有品牌"恒锐造"精密件', source: '产品路线图' },
            customers: { actual: '一汽/迈瑞/美的各 8-12%', target: 'OEM 客户结构散+自有品牌客户 30%', source: '用户调研' },
            supply: { actual: '30+ 台 CNC+5 套检测设备', target: '+ 5 台五轴 CNC+自动化产线', source: '供应链' },
            performance: {
              share: { actual: '精密五金细分 0.05%', target: '0.12%（自有品牌贡献）', source: '目标推导' },
              roi: { actual: '1.5', target: '1.7', source: '财务模型' },
              growth: { actual: '年增 10%', target: '年增 25%（国产替代+自有品牌）', source: '行业基准' }
            }
          },
          competitors: [
            { id:'c1', name:'长盈精密', price:'加工费 80-200 元/件', strengths:'消费电子精密件龙头、自有品牌布局早', weaknesses:'汽车医疗资质弱、定制化弱', position:'以"汽车医疗资质+小批量柔性"差异化' },
            { id:'c2', name:'震裕科技', price:'加工费 60-150 元/件', strengths:'家电+新能源精密件规模化、模具自制', weaknesses:'医疗资质弱、自有品牌弱', position:'以"医疗资质+SPC 体系"切入' },
            { id:'c3', name:'科达制造', price:'加工费 50-120 元/件', strengths:'通用机械精密件规模化、价格低', weaknesses:'精度 0.01mm、定制化弱', position:'以"0.005mm 精度+定制化"对抗' },
            { id:'c4', name:'拓斯达', price:'加工费 70-180 元/件', strengths:'智能制造+CNC 设备+服务一体化', weaknesses:'OEM 件非主业、客户分散', position:'以"30+ 年精密件经验"差异化' },
            { id:'c5', name:'绿的谐波（专精特新标杆）', price:'加工费 100-300 元/件', strengths:'谐波减速器专精特新、自有品牌强', weaknesses:'品类窄、跨品类能力弱', position:'以"多领域 OEM 经验+24h 打样"切入' }
          ],
          ourCapabilities: {
            delivery: '30+ 台 CNC + 5 套检测设备 + 24h 打样 + SPC 体系',
            core: '汽车/医疗/消费电子三领域经验 + 0.005mm 精度 + 小批量柔性',
            brand: 'OEM 代工口碑强，自有品牌"恒锐造"尚无认知',
            customer: '一汽/迈瑞/美的等 10+ 大客户',
            compliance: 'IATF 16949 / ISO 9001 / ISO 13485 医疗资质 / 第三方检测报告',
            defensive: '30+ 年精密件经验 + 客户结构散（大客户各 8-12%）',
            critical: '自有品牌"恒锐造"从零起 + 价格战压力',
            structural: '工厂+设备强，但缺品牌运营/电商/营销人才',
            smileCurve: '优势在核心（精密制造）+ 合规（医疗资质），劣势在品牌（自有品牌从零）+ 客户（结构待散）——定位为"精密制造+自有品牌"双轮',
            trends: '国产替代、专精特新、工业 4.0、小批量柔性、数字化'
          }
        },
        personas: [
          { id:'p1', name:'王工', gender:'男', age:'38', occupation:'一汽变速箱采购经理', income:'二线 30 万/年', region:'长春',
            values:['资质合规','交期稳定','小批量柔性'], painPoints:'图纸响应慢、检测报告不全、价格战压力',
            channels:['行业展会','企业微信','1688'], quote:'我选供应商看资质、看交期、看配合度，价格不是第一。' },
          { id:'p2', name:'李博士', gender:'男', age:'35', occupation:'迈瑞医疗研发主管', income:'一线 50 万/年', region:'深圳',
            values:['图纸配合度','医疗资质','检测报告'], painPoints:'图纸反复改、医疗认证复杂、量产风险',
            channels:['行业展会','SIMM/CIMT','企业微信'], quote:'医疗器械件看资质和工艺文档，价格不是核心。' },
          { id:'p3', name:'陈总', gender:'男', age:'45', occupation:'专精特新渠道商', income:'经营收入 200 万/年', region:'苏州',
            values:['OEM 性价比','柔性打样','长期合作'], painPoints:'上游不稳定、账期长、缺品牌力',
            channels:['1688','行业展会','微信'], quote:'我做渠道最看重长期稳定+性价比，不是单点价格。' }
        ],
        scenarios: [
          { id:'sc1', name:'新项目打样+量产', personaIds:['p1','p2'],
            benefits:{usage:'24h 打样+SPC 检测',service:'图纸配合+工艺文档',staff:'工程师专业',image:'可靠供应商'},
            costs:{monetary:'打样费 500-2000+量产 BOM',time:'7-15 天打样',energy:'图纸沟通',psychic:'量产风险'},
            anchor:'资质合规 + 配合度', decisiveGap:'24h 打样+工艺文档——官网/小程序展示打样流程+SPC 报告' },
          { id:'sc2', name:'医疗资质件认证', personaIds:['p2'],
            benefits:{usage:'ISO 13485+检测报告',service:'认证辅导+文档',staff:'工程师专业',image:'医疗合规伙伴'},
            costs:{monetary:'认证费 5-10 万+量产 BOM',time:'3-6 月认证',energy:'文档多',psychic:'认证失败'},
            anchor:'医疗资质 + 工艺文档', decisiveGap:'认证案例+第三方报告——展示 5+ 医疗认证案例' },
          { id:'sc3', name:'专精特新渠道合作', personaIds:['p3'],
            benefits:{usage:'OEM 性价比+柔性',service:'长期账期+技术支持',staff:'销售稳定',image:'稳定合作伙伴'},
            costs:{monetary:'渠道价 50-100 元/件',time:'长期合作',energy:'账期管理',psychic:'账期风险'},
            anchor:'长期稳定 + 性价比', decisiveGap:'稳定产能+柔性——展示 30+ 台 CNC+小批量能力' }
        ],
        metrics: {
          disclaimerAcknowledged: true,
          dimensions: [
            { id:'dm1', name:'产品·制造', secondaries:[
              { id:'ds1', name:'精度水平', measure:'加工精度 0.005mm / SPC 检测', forecast: 9, target: 9 },
              { id:'ds2', name:'打样交期', measure:'24h 打样达成率', forecast: 8, target: 9 },
              { id:'ds3', name:'小批量柔性', measure:'50 件起订达成率', forecast: 8, target: 9 }
            ]},
            { id:'dm2', name:'品牌·认知', secondaries:[
              { id:'ds4', name:'行业知名度', measure:'行业展会提及率', forecast: 5, target: 7 },
              { id:'ds5', name:'自有品牌认知', measure:'能说出"恒锐造"的客户%', forecast: 1, target: 6 },
              { id:'ds6', name:'口碑传播', measure:'老客户推荐率', forecast: 7, target: 8 }
            ]},
            { id:'dm3', name:'品牌·判断', secondaries:[
              { id:'ds7', name:'专业可信', measure:'专业度评分', forecast: 8, target: 9 },
              { id:'ds8', name:'医疗资质', measure:'ISO 13485 认证展示', forecast: 7, target: 9 },
              { id:'ds9', name:'性价比', measure:'加工费性价比评分', forecast: 7, target: 8 }
            ]},
            { id:'dm4', name:'品牌·感受', secondaries:[
              { id:'ds10', name:'响应速度', measure:'图纸回复时间', forecast: 8, target: 9 },
              { id:'ds11', name:'品牌温度', measure:'品牌情感题均分', forecast: 5, target: 7 },
              { id:'ds12', name:'信任感', measure:'信任题均分', forecast: 7, target: 8 }
            ]},
            { id:'dm5', name:'复购·推荐', secondaries:[
              { id:'ds13', name:'客户粘性', measure:'年合作客户数', forecast: 8, target: 9 },
              { id:'ds14', name:'续约率', measure:'年续约率', forecast: 8, target: 8 },
              { id:'ds15', name:'推荐意愿', measure:'NPS', forecast: 7, target: 8 }
            ]}
          ]
        },
        survey: (function(){
          const anchors=['非常不同意','不同意','一般','同意','非常同意'];
          const qs=[
            {id:'q1', type:'likert', text:'恒锐精密加工精度达到 0.005mm，SPC 检测完备', anchors:[...anchors], sourceIndicatorId:'ds1'},
            {id:'q2', type:'likert', text:'恒锐精密 24h 打样响应满足我紧急项目需求', anchors:[...anchors], sourceIndicatorId:'ds2'},
            {id:'q3', type:'likert', text:'恒锐精密支持小批量柔性（50 件起订）', anchors:[...anchors], sourceIndicatorId:'ds3'},
            {id:'q4', type:'likert', text:'在汽车/医疗/消费电子行业我常听到恒锐精密', anchors:[...anchors], sourceIndicatorId:'ds4'},
            {id:'q5', type:'likert', text:'恒锐造自有品牌在精密件领域有差异化', anchors:[...anchors], sourceIndicatorId:'ds5'},
            {id:'q6', type:'likert', text:'我常在行业展会/1688 看到恒锐精密的正面口碑', anchors:[...anchors], sourceIndicatorId:'ds6'},
            {id:'q7', type:'likert', text:'恒锐精密在精密件加工上展现专业度', anchors:[...anchors], sourceIndicatorId:'ds7'},
            {id:'q8', type:'likert', text:'我信任恒锐精密的医疗资质（ISO 13485）', anchors:[...anchors], sourceIndicatorId:'ds8'},
            {id:'q9', type:'likert', text:'恒锐精密加工费与价值匹配', anchors:[...anchors], sourceIndicatorId:'ds9'},
            {id:'q10',type:'likert', text:'恒锐精密图纸响应快，工程师配合度高', anchors:[...anchors], sourceIndicatorId:'ds10'},
            {id:'q11',type:'likert', text:'恒锐精密让我感到"专业但有温度"', anchors:[...anchors], sourceIndicatorId:'ds11'},
            {id:'q12',type:'likert', text:'恒锐精密资质和案例让我对合作产生信任', anchors:[...anchors], sourceIndicatorId:'ds12'},
            {id:'q13',type:'likert', text:'我愿意与恒锐精密建立长期合作', anchors:[...anchors], sourceIndicatorId:'ds13'},
            {id:'q14',type:'likert', text:'我会续约恒锐精密的代工合作', anchors:[...anchors], sourceIndicatorId:'ds14'},
            {id:'q15',type:'likert', text:'我愿意向同行推荐恒锐精密', anchors:[...anchors], sourceIndicatorId:'ds15'},
            {id:'q16',type:'likert', text:'我愿意尝试恒锐造自有品牌精密件', anchors:[...anchors], sourceIndicatorId:'ds16'}
          ];
          const personas=[
            {p:'p1', base:[5,5,5,4,2,4,5,4,4,5,3,4,5,5,5,3]},
            {p:'p2', base:[5,5,4,4,2,4,5,5,4,5,3,5,5,4,4,3]},
            {p:'p3', base:[4,4,5,3,2,3,4,3,5,4,3,4,5,5,4,3]}
          ];
          const clamp=(v,lo,hi)=>Math.max(lo,Math.min(hi,v));
          const responses=[];
          personas.forEach(p=>{
            for(let r=0;r<3;r++){
              const answers=qs.map((q,i)=>{
                const v=clamp(p.base[i]+Math.round((Math.random()-.5)*2),1,5);
                return {questionId:q.id,value:v};
              });
              responses.push({personaId:p.p, answers});
            }
          });
          const mean=a=>a.reduce((x,y)=>x+y,0)/(a.length||1);
          const sd=a=>{ const m=mean(a); return Math.sqrt(mean(a.map(x=>(x-m)*(x-m)))); };
          const likertStats={};
          qs.forEach(q=>{
            const vals=[]; const dist=[0,0,0,0,0];
            responses.forEach(r=>{ const an=r.answers.find(x=>x.questionId===q.id); const v=parseInt(an?.value); if(!isNaN(v)&&v>=1&&v<=5){vals.push(v);dist[v-1]++;} });
            likertStats[q.id]={mean:+mean(vals).toFixed(2),sd:+sd(vals).toFixed(2),dist,n:vals.length};
          });
          const indicatorMeans=qs.map(q=>({label:q.text.length>18?q.text.slice(0,18)+'…':q.text, value:likertStats[q.id].mean, mean:likertStats[q.id].mean, sourceIndicatorId:q.sourceIndicatorId||null}));
          HENGRUI_STATS={likertStats, indicatorMeans};
          return {questions:qs, responses, n:3, status:'done', progress:{done:9,total:9}, error:null, mode:'demo', useFewShot:true, useRag:false, ragContext:''};
        })(),
        analysis: Object.assign({openThemes:[], insights:'1. 制造能力（Q1/Q2/Q3）是恒锐精密的强项，得分 4.0-5.0，30+ 年精密经验+0.005mm 精度+24h 打样是核心壁垒。\n2. 自有品牌认知（Q5）是核心短板，几乎为零，恒锐造需要从零建立。\n3. 医疗资质（Q8）信任度高，但需更多认证案例与第三方报告展示。\n4. 性价比（Q9）分化，工业采购经理对价格不敏感，专精特新渠道商对性价比敏感。\n5. 自有品牌"恒锐造"应先在专精特新渠道商+中小品牌方试点，以"0.005mm 精度+24h 打样+SPC 体系+医疗资质"为四大核心卖点。'}, HENGRUI_STATS || {}),
        values: {
          functional: ['精度高','交期快','柔性小批量','医疗资质'],
          emotional: ['专业可靠','长期合作'],
          social: ['专精特新合作伙伴','国产替代代表'],
          epistemic: ['SPC 体系','第三方检测报告','认证案例'],
          conditional: ['汽车变速箱','医疗器械','消费电子','机器人'],
          chosenFunctional: '0.005mm 精度+24h 打样+小批量柔性+医疗资质',
          chosenEmotional: '专业可靠的精密件伙伴',
          chosenSocial: '专精特新国产替代合作伙伴',
          rationale: '以"0.005mm 精度+24h 打样+小批量柔性+医疗资质"建立功能可信度，以"专业可靠"建立情感连接，以"专精特新国产替代"承担社交身份。'
        },
        recommendations: {
          short: '官网+小程序上线"恒锐造"品牌页+认证案例墙+SPC 报告展示；参加 SIMM/CIMT 展会发布自有品牌。',
          mid: '6 个月内自有品牌试点 50+ 客户（专精特新渠道商+中小品牌方），营收占比 15%。',
          long: '建立"恒锐造·精密件专家"内容 IP，从东莞 OEM 厂升级为专精特新精密件自有品牌代表。',
          risks: ['价格战持续','自有品牌客户接受度低','工厂交期跟不上','医疗认证延期']
        }
      },

      work2: {
        scope: {
          question: '恒锐精密应优先拓展哪个客户细分市场？',
          timeframe: '12-18 个月',
          constraints: '品牌运营团队从零；OEM 客户不能流失；预算 500 万',
          candidateCount: 3
        },
        attractiveness: {indicators:[
          {id:'a1',name:'市场规模',weight:0.25,source:'delphi',support:5,rubric:{high:'目标客群 >5000 家',mid:'1000-5000 家',low:'<1000 家'}},
          {id:'a2',name:'增长率',weight:0.30,source:'delphi',support:5,rubric:{high:'国产替代/专精特新 >25%',mid:'15-25%',low:'<15%'}},
          {id:'a3',name:'客单价',weight:0.20,source:'delphi',support:5,rubric:{high:'客单 >100 万/年',mid:'30-100 万/年',low:'<30 万/年'}},
          {id:'a4',name:'品牌接受度',weight:0.25,source:'delphi',support:5,rubric:{high:'愿意尝试新自有品牌',mid:'部分尝试',low:'只认 OEM'}}
        ]},
        competitiveness: {indicators:[
          {id:'c1',name:'制造基础',weight:0.30,source:'delphi',support:5,rubric:{high:'现有 OEM 经验可复用',mid:'部分领域可复用',low:'需重塑'}},
          {id:'c2',name:'资质匹配',weight:0.25,source:'delphi',support:5,rubric:{high:'IATF/ISO 13485 完备',mid:'部分资质',low:'需新认证'}},
          {id:'c3',name:'渠道效率',weight:0.20,source:'delphi',support:5,rubric:{high:'现有渠道 ROI >1.5',mid:'1-1.5',low:'<1'}},
          {id:'c4',name:'团队匹配',weight:0.25,source:'delphi',support:5,rubric:{high:'有现成品牌/营销能力',mid:'3-6 月可建',low:'需 12+ 月从零'}}
        ]},
        delphi: {
          status: 'done',
          weights: {
            attractiveness: {a1:0.25,a2:0.30,a3:0.20,a4:0.25},
            competitiveness: {c1:0.30,c2:0.25,c3:0.20,c4:0.25}
          },
          finalSynthesis: '两轮 Delphi 后专家对"增长率"与"制造基础"赋权最高。专精特新中小品牌方国产替代意愿强、客单价可接受、愿意尝试新自有品牌，恒锐精密 30+ 年 OEM 经验可直接复用；工业采购经理以 OEM 为主、不会主动选自有品牌；机器人新领域增速快但客户结构未验证。'
        },
        markets: [
          { id:'m1', name:'专精特新中小品牌方', region:'苏州/宁波/东莞/深圳', population:'约 2000 家', gdpPerCapita:'营收 5000 万-5 亿', notes:'国产替代意愿强、客单价可接受',
            scores:{a1:8, a2:9, a3:7, a4:8, c1:8, c2:7, c3:6, c4:5} },
          { id:'m2', name:'工业采购经理（OEM 现有）', region:'汽车/医疗/3C 整机厂', population:'约 5000 家', gdpPerCapita:'营收 1 亿-100 亿', notes:'OEM 为主，少数接受自有品牌',
            scores:{a1:9, a2:6, a3:9, a4:3, c1:10, c2:9, c3:9, c4:6} },
          { id:'m3', name:'机器人/新领域（增长型）', region:'深圳/上海/杭州机器人厂', population:'约 500 家', gdpPerCapita:'营收 5000 万-10 亿', notes:'增速快、客单价高、新领域',
            scores:{a1:6, a2:9, a3:8, a4:7, c1:5, c2:4, c3:5, c4:3} }
        ],
        matrix: { selectedMarketId:'m1', xCut:null, yCut:null, notes:'短期保 m2 工业采购经理 OEM 合作，中期重点攻 m1 专精特新中小品牌方（自有品牌试点），长期考虑 m3 机器人新领域。' },
        decision: {
          rationale: 'm1 专精特新中小品牌方国产替代意愿强、客单价可接受、愿意尝试新自有品牌，12 个月内可贡献自有品牌 60% 营收；m2 OEM 现有稳定但只认 OEM；m3 机器人新领域增速快但客户结构未验证。',
          sequence: 'm2 工业采购经理 OEM 保合作（0-6 月）→ m1 专精特新中小品牌方自有品牌试点（3-12 月）→ m3 机器人新领域拓展（12+ 月）',
          risks: ['自有品牌客户接受度低','m2 工业采购经理对自有品牌不感冒','机器人新领域经验不足','品牌运营人才招聘难'],
          nextSteps: '6 月内招 1 名品牌运营+1 名电商运营；参加 SIMM/CIMT 展会发布自有品牌；官网+小程序上线"恒锐造"品牌页。'
        }
      },

      work3: {
        context: {
          sbuName: '恒锐精密',
          targetMarket: '专精特新中小品牌方 + 工业采购经理 OEM',
          personas: [
            { id:'p1', name:'王工', painPoints:'图纸响应慢、检测报告不全' },
            { id:'p2', name:'李博士', painPoints:'医疗认证复杂、量产风险' },
            { id:'p3', name:'陈总', painPoints:'上游不稳定、账期长' }
          ],
          hasSurvey: true
        },
        mining: {
          documents: [
            '恒锐精密的 0.005mm 精度确实能打，一汽变速箱件用着不错。',
            '24h 打样响应快，紧急项目救过我的命。',
            '医疗认证能不能帮我们辅导？工艺文档不全。',
            '小批量 50 件起订，灵活度比长盈精密好。',
            '能不能给个 SPC 报告？我们客户审计要。',
            '账期 60 天可以接受，比长盈好。',
            '专精特新认证有没有成功案例？',
            '国产替代我们想试一下，但价格不能再高了。',
            '一站式后处理（喷砂+阳极）能不能也做？',
            '你们 30+ 年 OEM 经验，自有品牌怎么定位？'
          ],
          ldaParams:{k:3,passes:15,iterations:100,no_below:2,no_above:0.5},
          stats:{raw_count:10,valid_count:10,total_words:152,vocab_size:41,coherence:0.44},
          topics:[
            {id:0,label:'精度与打样交期',share:40,keywords:[
              {word:'精度',weight:.10},{word:'打样',weight:.08},{word:'24h',weight:.06},{word:'紧急',weight:.05},{word:'量产',weight:.04}
            ],representative_docs:['0.005mm 精度确实能打','24h 打样响应快']},
            {id:1,label:'资质与文档',share:33,keywords:[
              {word:'认证',weight:.09},{word:'医疗',weight:.07},{word:'工艺文档',weight:.06},{word:'SPC',weight:.05},{word:'报告',weight:.04}
            ],representative_docs:['医疗认证能不能帮我们辅导','能不能给个 SPC 报告']},
            {id:2,label:'专精特新与一站式',share:27,keywords:[
              {word:'专精特新',weight:.08},{word:'国产替代',weight:.07},{word:'后处理',weight:.06},{word:'喷砂',weight:.05},{word:'阳极',weight:.04}
            ],representative_docs:['专精特新认证有没有成功案例','一站式后处理能不能也做']}
          ],
          wordFreqTop:[
            {word:'精度',count:4},{word:'打样',count:3},{word:'认证',count:3},{word:'医疗',count:3},{word:'SPC',count:2},
            {word:'报告',count:2},{word:'专精特新',count:2},{word:'国产替代',count:2},{word:'后处理',count:2},{word:'紧急',count:2}
          ],
          painMap:[
            {id:'pa1',pain:'医疗认证辅导不足，工艺文档不全',evidence:'医疗认证能不能帮我们辅导',frequency:'高',linkedNeeds:['认证辅导','工艺文档'],linkedTopicId:1,type:'痛点'},
            {id:'pa2',pain:'客户审计需要 SPC 报告，展示不足',evidence:'能不能给个 SPC 报告',frequency:'中',linkedNeeds:['SPC 体系','第三方报告'],linkedTopicId:1,type:'痛点'},
            {id:'pa3',pain:'一站式后处理（喷砂+阳极）缺能力',evidence:'一站式后处理能不能也做',frequency:'中',linkedNeeds:['后处理产线','一站式服务'],linkedTopicId:2,type:'痛点'},
            {id:'pa4',pain:'国产替代价格压力大',evidence:'国产替代想试，但价格不能再高了',frequency:'中',linkedNeeds:['性价比','专精特新案例'],linkedTopicId:2,type:'痛点'},
            {id:'pa5',pain:'自有品牌定位不清',evidence:'自有品牌怎么定位',frequency:'中',linkedNeeds:['品牌定位','案例展示'],linkedTopicId:0,type:'痒点'}
          ]
        },
        candidates:[
          {id:'c1',name:'0.005mm 精度+SPC',pain:'精度不达标',description:'0.005mm 精度+SPC 全程检测+第三方报告',evidence:'10 篇评论中 4 篇提及精度',
            desirabilityScores:{p1:{importance:10,uniqueness:8,credibility:10},p2:{importance:10,uniqueness:7,credibility:9},p3:{importance:9,uniqueness:7,credibility:8}},
            desirabilitySource:'personas', importance:9.7,uniqueness:7.3,credibility:9.0,
            feasibility:9,communicability:8,sustainability:9, selected:true},
          {id:'c2',name:'24h 打样+小批量柔性',pain:'交期慢',description:'24h 打样响应+50 件起订+7-15 天量产',evidence:'3 篇评论提及打样',
            desirabilityScores:{p1:{importance:9,uniqueness:7,credibility:8},p2:{importance:9,uniqueness:7,credibility:8},p3:{importance:8,uniqueness:8,credibility:7}},
            desirabilitySource:'personas', importance:8.7,uniqueness:7.3,credibility:7.7,
            feasibility:8,communicability:8,sustainability:8, selected:true},
          {id:'c3',name:'医疗资质+认证辅导',pain:'认证复杂',description:'ISO 13485 医疗资质+认证辅导+5+ 医疗案例',evidence:'3 篇评论提及医疗认证',
            desirabilityScores:{p1:{importance:7,uniqueness:7,credibility:8},p2:{importance:10,uniqueness:8,credibility:10},p3:{importance:6,uniqueness:6,credibility:7}},
            desirabilitySource:'personas', importance:7.7,uniqueness:7.0,credibility:8.3,
            feasibility:7,communicability:7,sustainability:8, selected:true},
          {id:'c4',name:'一站式后处理',pain:'后处理外协',description:'喷砂+阳极氧化+电镀后处理内化，一站式交付',evidence:'1 篇评论提及后处理',
            desirabilityScores:{p1:{importance:8,uniqueness:8,credibility:7},p2:{importance:8,uniqueness:8,credibility:7},p3:{importance:9,uniqueness:9,credibility:7}},
            desirabilitySource:'personas', importance:8.3,uniqueness:8.3,credibility:7.0,
            feasibility:7,communicability:8,sustainability:8, selected:true},
          {id:'c5',name:'专精特新案例墙',pain:'品牌信任弱',description:'官网+小程序上线 10+ 专精特新客户案例+认证展示',evidence:'内部策略',
            desirabilityScores:{p1:{importance:6,uniqueness:6,credibility:7},p2:{importance:6,uniqueness:6,credibility:7},p3:{importance:8,uniqueness:6,credibility:7}},
            desirabilitySource:'personas', importance:6.7,uniqueness:6.0,credibility:7.0,
            feasibility:9,communicability:7,sustainability:7, selected:false}
        ],
        dimensions:{
          desirability:[{key:'importance',label:'重要性'},{key:'uniqueness',label:'独特性'},{key:'credibility',label:'可信度'}],
          implementability:[{key:'feasibility',label:'可行性'},{key:'communicability',label:'传播力'},{key:'sustainability',label:'持续性'}]
        },
        matrix:{showSector:true,sectorAngle:90,sectorRadius:12,xCut:null,yCut:null,manualSelected:[]},
        migration:{analyses:[]},
        proposition:{
          coreValueIds:['c1','c2','c3','c4'],
          alternatives:[
            {id:'a1',text:'恒锐造，0.005mm 的精密。'},
            {id:'a2',text:'专精特新，恒锐造。'},
            {id:'a3',text:'国产替代，恒锐造精密。'}
          ],
          chosenValueText:'恒锐造，0.005mm 的精密。',
          positioning:{brand:'恒锐造', audience:'专精特新中小品牌方+工业采购经理+专精特新渠道商', coreValue:'0.005mm 精度+24h 打样+医疗资质+一站式后处理', category:'专精特新精密件自有品牌'},
          positioningStatement:'恒锐造 是为 专精特新中小品牌方与工业采购经理 提供 0.005mm 精度+24h 打样+医疗资质+一站式后处理 的 专精特新精密件自有品牌。',
          sloganOptions:['恒锐造，0.005mm 的精密','专精特新，恒锐造','国产替代，恒锐造精密'],
          chosenSlogan:'恒锐造，0.005mm 的精密',
          mbti:'ISTJ',
          archetype: { primary: 'Ruler', secondary: 'Sage' },
          personalityTraits:['专业','精密','可靠','务实','长期主义']
        }
      },

      work4: {
        route:{
          scope:'domestic',
          oemType:'OBM',
          entryMode:'',
          light:[],
          politicalPower:''
        },
        product:{
          name:'恒锐造精密件自有品牌',
          description:'0.005mm 精度+24h 打样+医疗资质+一站式后处理',
          coreDifferentiators:['0.005mm 精度','24h 打样','医疗资质（ISO 13485）','一站式后处理','小批量柔性'],
          physicalFeatures:'30+ 台 CNC / SPC 体系 / ISO 9001+IATF 16949+ISO 13485 / 第三方检测报告',
          serviceOffering:'24h 打样响应 / 工艺文档辅导 / 认证辅导 / 长期账期 / 技术支持',
          technologyMoat:'30+ 年精密件经验 + 30+ 台 CNC + 5 套检测设备 + 医疗资质',
          skus:[
            {name:'汽车变速箱精密件', specs:'精度 0.005mm', price_range:'加工费 50-150 元/件', differentiator:'IATF 16949+长期合作'},
            {name:'医疗器械精密件', specs:'精度 0.005mm', price_range:'加工费 80-250 元/件', differentiator:'ISO 13485+认证辅导'},
            {name:'消费电子精密件', specs:'精度 0.01mm', price_range:'加工费 30-100 元/件', differentiator:'小批量柔性+24h 打样'},
            {name:'机器人精密件', specs:'精度 0.005mm', price_range:'加工费 80-200 元/件', differentiator:'国产替代+柔性'}
          ]
        },
        price:{
          strategy:'value',
          strategyNote:'中端定价，以"精度+交期+资质"承担溢价；专精特新渠道商给渠道价。',
          tiers:[
            {name:'汽车件加工费', targetSegment:'一汽/汽车厂', price:80, unit:'元/件', notes:'BOM+加工费'},
            {name:'医疗件加工费', targetSegment:'迈瑞/医疗厂', price:150, unit:'元/件', notes:'含认证辅导'},
            {name:'消费电子件', targetSegment:'美的/3C 厂', price:60, unit:'元/件', notes:'小批量起订'},
            {name:'机器人件加工费', targetSegment:'机器人厂', price:120, unit:'元/件', notes:'国产替代'}
          ],
          channelPricing:[
            {channel:'直销团队', priceAdjustment:'原价', rationale:'主战场'},
            {channel:'阿里 1688', priceAdjustment:'9 折', rationale:'拉新引流'},
            {channel:'专精特新渠道商', priceAdjustment:'渠道价 7 折', rationale:'长期合作'}
          ],
          promotions:[
            {occasion:'SIMM/CIMT 展会', discount:'打样 5 折', period:'展会期间'},
            {occasion:'专精特新认证客户', discount:'首批合作 9 折', period:'签约后 3 月内'}
          ],
          competitorPrices:'长盈精密 80-200；震裕科技 60-150；科达制造 50-120；拓斯达 70-180；绿的谐波 100-300'
        },
        place:{
          onlineSelf:['恒锐精密官网','恒锐造小程序','恒锐造公众号'],
          onlineThird:['阿里 1688','京东工业','中国制造网'],
          onlineNotes:'官网+小程序为主阵地（案例墙+SPC 报告+认证展示）；1688 做拉新；行业展会做品牌发布',
          offlineDirect:['东莞工厂直销','深圳/苏州/宁波销售点'],
          offlineDistrib:['专精特新渠道商','行业展会（SIMM/CIMT）'],
          offlineRetail:[],
          offlineNotes:'直销团队+渠道商双线，第一阶段以 B 端为主',
          keyPartners:['专精特新渠道商 10+','阿里 1688 工业品牌','SIMM/CIMT 展会'],
          channelIncentives:'渠道商佣金 10%+年返 2%；直销奖金按 GMV 5%',
          structure:[
            {name:'线下', children:[{name:'直销团队', share:50},{name:'专精特新渠道商', share:25},{name:'行业展会', share:25}]},
            {name:'线上', children:[{name:'官网/小程序', share:50},{name:'阿里 1688', share:30},{name:'京东工业/中国制造', share:20}]}
          ]
        },
        promotion:{
          theme:'恒锐造，0.005mm 的精密',
          advertising:[
            {media:'行业展会（SIMM/CIMT）', budgetShare:35, message:'恒锐造品牌发布+案例展示', kpi:'签约客户数'},
            {media:'阿里 1688/京东工业', budgetShare:25, message:'24h 打样+案例', kpi:'询盘转化率'},
            {media:'官网/小程序', budgetShare:20, message:'案例墙+认证展示', kpi:'留资率'},
            {media:'销售团队+客户走访', budgetShare:20, message:'长期合作+定制方案', kpi:'签约率'}
          ],
          pr:[
            {event:'恒锐造品牌发布会（SIMM 展）', timing:'2027 年 3 月', expectedReach:'行业 10 万专业人士'},
            {event:'专精特新认证案例发布', timing:'每季度 1 次', expectedReach:'渠道 5 万+'}
          ],
          salesPromotion:[
            {tactic:'展会打样 5 折', mechanic:'现场签单', period:'展会期间'},
            {tactic:'首批合作 9 折', mechanic:'专精特新认证客户', period:'签约后 3 月'}
          ],
          crm:{tool:'企业微信+CRM 系统', membership:'战略客户/白银/黄金/钻石', repurchase:'每季度推送新工艺/案例', notes:'B 端客户长期关系为重'},
          contentStrategy:'官网"恒锐造案例墙"系列 + 公众号"0.005mm 的精密"长文 + 行业展会"工艺纪录片"。'
        }
      },

      work5: {
        cover: { title:'恒锐精密 · 2027 自有品牌"恒锐造"策划书', subtitle:'恒锐造，0.005mm 的精密', team:'恒锐精密团队', date:'2026-08' },
        abstract: '本策划书围绕恒锐精密从纯 OEM 向"OEM+自有品牌"双轮转型展开。核心定位"恒锐造，0.005mm 的精密"，以"0.005mm 精度+24h 打样+医疗资质+一站式后处理"为四大卖点，主攻专精特新中小品牌方与工业采购经理，12 个月内自有品牌营收占比 15%。',
        ch1_business: '恒锐精密专注精密件 OEM，8000 万营收，80 人，30+ 台 CNC。核心价值为功能（0.005mm 精度+24h 打样+医疗资质+一站式后处理）、情感（专业可靠）、社会（专精特新国产替代合作伙伴）。',
        ch2_environment: {
          political: '专精特新政策加码，国产替代加速。',
          economic: '精密零部件 1.8 万亿市场，国产替代率从 30% 提升到 50%+。',
          social: '工业 4.0 推动柔性制造；B 端采购线上化。',
          technological: 'CNC 五轴+3D 打印+激光检测成熟；SPC 体系+IATF/ISO 认证。',
          strengths: ['30+ 年精密经验','0.005mm 精度','IATF/ISO 13485 资质','客户结构散'],
          weaknesses: ['自有品牌从零','价格战压力','缺品牌运营人才','跨城销售弱'],
          opportunities: ['国产替代','专精特新','机器人新领域','一站式后处理'],
          threats: ['长盈/震裕规模压制','价格战持续','大客户砍单']
        },
        ch3_strategy: {
          segmentation: '按客户分层：工业采购经理（OEM 现有）/ 专精特新中小品牌方（自有品牌）/ 机器人新领域（增长型）。',
          targeting: '短期保工业采购经理 OEM；中期攻专精特新中小品牌方自有品牌；长期拓展机器人新领域。',
          positioning: '为专精特新中小品牌方与工业采购经理提供 0.005mm 精度+24h 打样+医疗资质+一站式后处理的专精特新精密件自有品牌。'
        },
        ch4_mix: {
          product: '汽车/医疗/消费电子/机器人精密件 + 一站式后处理',
          price: '中端定价（60-250 元/件加工费，BOM+加工费报价）',
          place: '直销团队+专精特新渠道商+行业展会+官网/小程序/1688',
          promotion: '"恒锐造，0.005mm 的精密"——SIMM/CIMT 展会发布+官网案例墙+渠道商合作',
          customerValue: '0.005mm 精度+24h 打样+医疗资质+一站式后处理',
          customerCost: '中端定价+首批 9 折+渠道价 7 折',
          convenience: '24h 打样响应+长期账期+技术支持',
          communication: '行业展会+官网案例墙+销售团队走访'
        },
        ch5_outlook: '12 个月内自有品牌试点 50+ 客户，营收占比 15%；参加 SIMM/CIMT 展会发布恒锐造品牌。3 年内品牌从东莞 OEM 厂升级为专精特新精密件自有品牌代表。关键风险为自有品牌客户接受度与品牌运营人才，应对为先小客户试点+渠道商合作+外招品牌运营。',
        references: [
          { authors:'', title:'2024 专精特新小巨人发展报告', year:'2024', url:'' },
          { authors:'', title:'2023 中国精密零部件行业白皮书', year:'2023', url:'' }
        ]
      }
    },

    /* ============================================================
       毛孩子之家 — 本地生活 / 宠物服务，国内 OBM（详细）
       ============================================================ */
    maohaizi: {
      meta: {
        name: '毛孩子之家',
        industry: '本地生活 / 宠物服务',
        tagline: '宠物洗护+寄养门店的品牌升级与复制',
        description: '成都+重庆 2 家宠物洗护+寄养门店，客单价 80-300 元，复购率 45%，单店月营收 8-12 万，老板想从 2 家开成 5 家区域品牌。',
        valueChain: {
          curve: '本地生活 / 宠物服务',
          nodes: [
            {label:'服务标准/培训',   v:8.0, tip:'洗护师CKU认证+无应激标准'},
            {label:'耗材/选品采购',    v:5.0, tip:'洗护用品/食品/玩具选品'},
            {label:'门店服务/洗护',    v:8.5, tip:'现场洗护+寄养 — 核心体验'},
            {label:'渠道/美团抖音',    v:5.0, tip:'美团/大众点评/抖音同城'},
            {label:'品牌/口碑/会员',   v:9.0, tip:'出片+联名 — 最高附加值'},
            {label:'客户回访/复购',    v:5.5, tip:'CRM/会员次卡/异业联盟'}
          ]
        },
        ready: true
      },
      work1: {
        sbu: {
          name: '毛孩子之家',
          category: '本地生活 / 宠物服务（洗护+寄养+宠物摄影）',
          stage: '成长期',
          scope: '国内',
          countries: ['中国'],
          summary: '成都+重庆 2 家直营宠物洗护+寄养门店，客单价 80-300 元，复购率 45%，单店月营收 8-12 万，老板想从 2 家开成 5 家区域品牌。',
          threeQuestions: {customer: true, channel: false, brand: true},
          boundary: '客户：聚焦 90/95 后新手铲屎官+二线家庭客+出差/旅行寄养客，不做活体交易/宠物医疗；渠道：美团+大众点评+小红书+抖音同城+私域社群，不依赖单一渠道；品牌：毛孩子之家为独立宠物服务品牌，不与个人 IP 混用；损益：2 店独立核算，复用洗护师团队与供应链。'
        },
        environment: {
          political: '宠物服务行业监管持续完善，《动物防疫法》要求寄养资质；成都/重庆对宠物店卫生/防疫要求提高；宠物经济受政策鼓励。',
          economic: '2023 年中国宠物经济 2793 亿（年增 3.2%），宠物服务约 300 亿；川渝宠物数量全国前 5。',
          social: '90/95 后成为养宠主力（占比 60%+），"科学养宠"理念普及；宠物拟人化（家人化）趋势；出差/旅行寄养刚需增长。',
          technological: '美团/大众点评宠物服务频道成熟；小红书/抖音同城种草高效；宠物洗护师认证体系（CKU/NGKC）普及；门店 SaaS 普及。',
          industry: '头部：新瑞鹏宠物医院（医疗为主）、萌爪医生（线上医疗）、小佩宠物（智能用品）、宠物家 PetsHome（连锁洗护）；区域品牌：圣宠、宠宠熊、爱诺宠物。',
          basics: {
            scale: { actual: '2 家直营，年营收约 240 万', target: '5 家直营+1 加盟，年营收 800 万', source: '内部台账' },
            scope: { actual: '洗护+寄养 2 个 SKU', target: '+ 宠物摄影+会员次卡+宠物用品零售', source: '战略规划' },
            products: { actual: '洗护 80-200/寄养 100-250', target: '+ 摄影 300-800/月卡 980', source: '产品路线图' },
            customers: { actual: '90/95 后+家庭客，复购 45%', target: '+ 出差/旅行寄养客，复购 55%', source: '用户调研' },
            supply: { actual: '3 位洗护师+2 位寄养师', target: '+ 5 位洗护师+3 位寄养师+合作摄影', source: '供应链' },
            performance: {
              share: { actual: '成都宠物洗护细分 0.5%', target: '1.5%（5 家店贡献）', source: '目标推导' },
              roi: { actual: '1.3', target: '1.6', source: '财务模型' },
              growth: { actual: '年增 15%', target: '年增 30%（连锁带动）', source: '行业基准' }
            }
          },
          competitors: [
            { id:'c1', name:'新瑞鹏宠物医院（医疗）', price:'洗护 100-300/寄养 150-300', strengths:'医疗+服务一体化、品牌强', weaknesses:'重医疗、轻洗护、价格偏高', position:'以"专业洗护+性价比"差异化' },
            { id:'c2', name:'宠物家 PetsHome（连锁洗护）', price:'洗护 80-200/寄养 120-250', strengths:'连锁化、SaaS 化、标准统一', weaknesses:'本地化弱、情感温度低', position:'以"本地化+情感温度"对抗' },
            { id:'c3', name:'圣宠（区域品牌）', price:'洗护 60-150/寄养 80-200', strengths:'川渝区域品牌、价格亲民', weaknesses:'品牌力弱、服务标准不一', position:'以"洗护师认证+无应激环境"切入' },
            { id:'c4', name:'宠宠熊（社区店）', price:'洗护 50-150/寄养 100-200', strengths:'社区店密度高、便利', weaknesses:'专业度弱、卫生标准不一', position:'以"专业洗护+无应激"差异化' },
            { id:'c5', name:'爱诺宠物（摄影+洗护）', price:'摄影 500-1500/洗护 100-250', strengths:'宠物摄影特色、客单价高', weaknesses:'频次低、依赖摄影', position:'以"洗护为入口+摄影做粘性"组合' }
          ],
          ourCapabilities: {
            delivery: '2 家直营+洗护师认证+无应激低噪环境+实时寄养直播',
            core: '2 年品牌沉淀+复购 45%+川渝本地口碑',
            brand: '本地口碑强，跨城品牌力弱',
            customer: '2 家店私域社群 3000+铲屎官',
            compliance: '动物防疫合格证+洗护师 CKU/NGKC 认证+卫生许可',
            defensive: '复购 45%+本地口碑+实时寄养直播',
            critical: '复制到 5 家店资金有限+人才复制难度大',
            structural: '门店运营强，但缺连锁化人才（店长/营销/加盟）',
            smileCurve: '优势在客户（私域社群）+ 核心（洗护师认证），劣势在品牌（跨城弱）+ 交付（缺摄影）——定位为"专业洗护+实时直播+会员次卡"三轮',
            trends: '科学养宠、宠物拟人化、寄养刚需、宠物摄影、无应激'
          }
        },
        personas: [
          { id:'p1', name:'小敏', gender:'女', age:'26', occupation:'互联网运营', income:'成都 18 万/年', region:'成都高新区',
            values:['专业温柔','颜值设计','科学养宠'], painPoints:'猫应激反应、宠物店卫生差、洗护师不专业',
            channels:['小红书','抖音同城','大众点评'], quote:'我宁愿多付 30%，也要让猫主子不害怕。' },
          { id:'p2', name:'赵姐', gender:'女', age:'35', occupation:'全职妈妈', income:'成都 20 万/年（家庭）', region:'成都锦江',
            values:['放心','性价比','卫生安全'], painPoints:'寄养不放心、价格不透明、宠物店套路多',
            channels:['美团','大众点评','微信群'], quote:'寄养最怕"摄像头是摆设"，我要的是真直播。' },
          { id:'p3', name:'Andy', gender:'男', age:'30', occupation:'外企销售', income:'成都 25 万/年', region:'成都武侯',
            values:['安全感','便利性','专业'], painPoints:'出差寄养、宠物应激、找不到靠谱店',
            channels:['美团','大众点评','小红书'], quote:'我出差最怕"摄像头关了一天没人告诉我"。' }
        ],
        scenarios: [
          { id:'sc1', name:'猫主子洗护', personaIds:['p1'],
            benefits:{usage:'无应激低噪+专业洗护',service:'洗护师认证+独立单宠用具',staff:'温柔专业',image:'科学养宠的小姐姐'},
            costs:{monetary:'洗护 150-250 元',time:'1.5-2 小时',energy:'选店对比',psychic:'猫应激'},
            anchor:'专业 + 温柔', decisiveGap:'无应激环境——独立单宠用具+低噪环境+洗护师认证' },
          { id:'sc2', name:'家庭长期寄养', personaIds:['p2'],
            benefits:{usage:'实时直播+卫生安全',service:'摄像头+每日反馈',staff:'寄养师负责',image:'负责的铲屎官'},
            costs:{monetary:'寄养 100-250 元/天',time:'出行/旅行 1-7 天',energy:'选店对比',psychic:'寄养不放心'},
            anchor:'放心 + 透明', decisiveGap:'实时直播——摄像头直播+每日视频反馈' },
          { id:'sc3', name:'出差短期寄养', personaIds:['p3'],
            benefits:{usage:'24h 直播+专业护理',service:'接送+健康检查',staff:'寄养师专业',image:'上进的铲屎官'},
            costs:{monetary:'寄养 150-250 元/天',time:'出差 2-5 天',energy:'找店',psychic:'出差焦虑'},
            anchor:'便利 + 安全', decisiveGap:'接送服务+24h 直播——24h 直播+接送一站式' }
        ],
        metrics: {
          disclaimerAcknowledged: true,
          dimensions: [
            { id:'dm1', name:'服务·专业', secondaries:[
              { id:'ds1', name:'洗护师专业度', measure:'CKU/NGKC 认证占比', forecast: 8, target: 9 },
              { id:'ds2', name:'无应激环境', measure:'客户感知评分', forecast: 7, target: 9 },
              { id:'ds3', name:'卫生安全', measure:'店内卫生评分/防疫合规', forecast: 8, target: 9 }
            ]},
            { id:'dm2', name:'品牌·认知', secondaries:[
              { id:'ds4', name:'本地知名度', measure:'无提示提及率（成都%）', forecast: 6, target: 8 },
              { id:'ds5', name:'差异化定位', measure:'能说出"实时直播"的客户%', forecast: 7, target: 9 },
              { id:'ds6', name:'口碑传播', measure:'小红书/抖音 UGC 篇数/月', forecast: 5, target: 8 }
            ]},
            { id:'dm3', name:'品牌·判断', secondaries:[
              { id:'ds7', name:'专业可信', measure:'专业度评分', forecast: 7, target: 9 },
              { id:'ds8', name:'寄养安心', measure:'实时直播感知', forecast: 8, target: 9 },
              { id:'ds9', name:'性价比', measure:'性价比评分', forecast: 6, target: 8 }
            ]},
            { id:'dm4', name:'品牌·感受', secondaries:[
              { id:'ds10', name:'环境颜值', measure:'门店设计评分', forecast: 7, target: 8 },
              { id:'ds11', name:'品牌温度', measure:'品牌情感题均分', forecast: 8, target: 9 },
              { id:'ds12', name:'信任感', measure:'信任题均分', forecast: 8, target: 9 }
            ]},
            { id:'dm5', name:'复购·推荐', secondaries:[
              { id:'ds13', name:'会员归属', measure:'月卡会员数', forecast: 4, target: 8 },
              { id:'ds14', name:'复购意愿', measure:'年复购率', forecast: 7, target: 8 },
              { id:'ds15', name:'推荐意愿', measure:'NPS', forecast: 7, target: 9 }
            ]}
          ]
        },
        survey: (function(){
          const anchors=['非常不同意','不同意','一般','同意','非常同意'];
          const qs=[
            {id:'q1', type:'likert', text:'毛孩子之家洗护师专业（CKU/NGKC 认证）', anchors:[...anchors], sourceIndicatorId:'ds1'},
            {id:'q2', type:'likert', text:'毛孩子之家无应激低噪环境，宠物不害怕', anchors:[...anchors], sourceIndicatorId:'ds2'},
            {id:'q3', type:'likert', text:'毛孩子之家店内卫生与防疫合规', anchors:[...anchors], sourceIndicatorId:'ds3'},
            {id:'q4', type:'likert', text:'在成都/重庆本地我常听到毛孩子之家', anchors:[...anchors], sourceIndicatorId:'ds4'},
            {id:'q5', type:'likert', text:'毛孩子之家在"实时寄养直播"上有差异化', anchors:[...anchors], sourceIndicatorId:'ds5'},
            {id:'q6', type:'likert', text:'我常在小红书/抖音看到毛孩子之家的正面口碑', anchors:[...anchors], sourceIndicatorId:'ds6'},
            {id:'q7', type:'likert', text:'毛孩子之家在宠物服务上展现专业度', anchors:[...anchors], sourceIndicatorId:'ds7'},
            {id:'q8', type:'likert', text:'我信任毛孩子之家的寄养实时直播服务', anchors:[...anchors], sourceIndicatorId:'ds8'},
            {id:'q9', type:'likert', text:'毛孩子之家价格与价值匹配', anchors:[...anchors], sourceIndicatorId:'ds9'},
            {id:'q10',type:'likert', text:'毛孩子之家门店环境有"出片感"', anchors:[...anchors], sourceIndicatorId:'ds10'},
            {id:'q11',type:'likert', text:'毛孩子之家让我感到"专业但有温度"', anchors:[...anchors], sourceIndicatorId:'ds11'},
            {id:'q12',type:'likert', text:'毛孩子之家的直播+单宠用具让我产生信任', anchors:[...anchors], sourceIndicatorId:'ds12'},
            {id:'q13',type:'likert', text:'我愿意办毛孩子之家的月卡/次卡会员', anchors:[...anchors], sourceIndicatorId:'ds13'},
            {id:'q14',type:'likert', text:'我会在半年内多次回毛孩子之家', anchors:[...anchors], sourceIndicatorId:'ds14'},
            {id:'q15',type:'likert', text:'我愿意向养宠朋友推荐毛孩子之家', anchors:[...anchors], sourceIndicatorId:'ds15'},
            {id:'q16',type:'likert', text:'我愿意参与毛孩子之家的活动/打卡', anchors:[...anchors], sourceIndicatorId:'ds16'}
          ];
          const personas=[
            {p:'p1', base:[5,5,5,4,5,4,5,4,4,5,5,5,4,5,5,5]},
            {p:'p2', base:[4,4,5,4,5,3,4,5,4,3,4,5,3,4,4,3]},
            {p:'p3', base:[5,4,4,4,5,4,5,5,4,4,4,5,4,4,5,4]}
          ];
          const clamp=(v,lo,hi)=>Math.max(lo,Math.min(hi,v));
          const responses=[];
          personas.forEach(p=>{
            for(let r=0;r<3;r++){
              const answers=qs.map((q,i)=>{
                const v=clamp(p.base[i]+Math.round((Math.random()-.5)*2),1,5);
                return {questionId:q.id,value:v};
              });
              responses.push({personaId:p.p, answers});
            }
          });
          const mean=a=>a.reduce((x,y)=>x+y,0)/(a.length||1);
          const sd=a=>{ const m=mean(a); return Math.sqrt(mean(a.map(x=>(x-m)*(x-m)))); };
          const likertStats={};
          qs.forEach(q=>{
            const vals=[]; const dist=[0,0,0,0,0];
            responses.forEach(r=>{ const an=r.answers.find(x=>x.questionId===q.id); const v=parseInt(an?.value); if(!isNaN(v)&&v>=1&&v<=5){vals.push(v);dist[v-1]++;} });
            likertStats[q.id]={mean:+mean(vals).toFixed(2),sd:+sd(vals).toFixed(2),dist,n:vals.length};
          });
          const indicatorMeans=qs.map(q=>({label:q.text.length>18?q.text.slice(0,18)+'…':q.text, value:likertStats[q.id].mean, mean:likertStats[q.id].mean, sourceIndicatorId:q.sourceIndicatorId||null}));
          MAOHAIZI_STATS={likertStats, indicatorMeans};
          return {questions:qs, responses, n:3, status:'done', progress:{done:9,total:9}, error:null, mode:'demo', useFewShot:true, useRag:false, ragContext:''};
        })(),
        analysis: Object.assign({openThemes:[], insights:'1. 洗护师专业（Q1）与卫生安全（Q3）是毛孩子之家强项，得分 4.0+，2 年本地口碑+CKU 认证有效。\n2. 实时直播（Q5/Q8）是核心差异化卖点，2 家店已上线，客群感知明显。\n3. 复购率（Q14）45% 表现良好，但会员月卡（Q13）渗透低，私域转化未充分挖掘。\n4. 跨城品牌（Q4）认知弱于本地口碑，5 家店扩展需强化品牌建设。\n5. 洗护师认证+实时直播+单宠独立用具+联名宠物摄影是核心传播资产，会员次卡+异业合作是规模增长关键。'}, MAOHAIZI_STATS || {}),
        values: {
          functional: ['洗护师认证','无应激环境','实时直播'],
          emotional: ['毛孩子放心','家人安心'],
          social: ['科学养宠的铲屎官','上进的养宠人'],
          epistemic: ['CKU/NGKC 认证','每日视频反馈'],
          conditional: ['新手铲屎官','家庭客','出差寄养'],
          chosenFunctional: '洗护师认证+无应激环境+实时直播',
          chosenEmotional: '毛孩子放心的家人感',
          chosenSocial: '科学养宠的铲屎官',
          rationale: '以"洗护师认证+无应激+实时直播"建立功能可信度，以"毛孩子放心的家人感"建立情感连接，以"科学养宠的铲屎官"承担社交身份。'
        },
        recommendations: {
          short: '小程序上线会员月卡+异业合作（宠物医院/猫舍）；小红书+抖音同城开账号发布"无应激洗护+实时直播"系列内容。',
          mid: '12 个月内开 3 家新店（成都 2+重庆 1），推出联名宠物摄影+会员次卡，营收增长 50%。',
          long: '建立"毛孩子之家·科学养宠"内容 IP，从川渝 2 家店升级为西南区域宠物服务品牌。',
          risks: ['洗护师招聘难','新店选址失误','跨城品牌认知弱','寄养卫生/安全风险']
        }
      },

      work2: {
        scope: {
          question: '毛孩子之家应优先拓展哪个城市/客群？',
          timeframe: '12-18 个月',
          constraints: '新店资金 300 万；老板亲自参与；老店不能受影响；洗护师团队复制',
          candidateCount: 3
        },
        attractiveness: {indicators:[
          {id:'a1',name:'市场规模',weight:0.25,source:'delphi',support:5,rubric:{high:'宠物数 >300 万',mid:'100-300 万',low:'<100 万'}},
          {id:'a2',name:'增长率',weight:0.30,source:'delphi',support:5,rubric:{high:'宠物经济 >20%',mid:'10-20%',low:'<10%'}},
          {id:'a3',name:'客单价',weight:0.20,source:'delphi',support:5,rubric:{high:'客单 >150 元',mid:'100-150 元',low:'<100 元'}},
          {id:'a4',name:'种草生态',weight:0.25,source:'delphi',support:5,rubric:{high:'小红书/抖音渗透 >60%',mid:'30-60%',low:'<30%'}}
        ]},
        competitiveness: {indicators:[
          {id:'c1',name:'本地口碑',weight:0.30,source:'delphi',support:5,rubric:{high:'2 年品牌沉淀',mid:'1-2 年',low:'<1 年'}},
          {id:'c2',name:'团队匹配',weight:0.25,source:'delphi',support:5,rubric:{high:'5 位洗护师可复制',mid:'3-5 位',low:'需重招团队'}},
          {id:'c3',name:'资金效率',weight:0.20,source:'delphi',support:5,rubric:{high:'现有资金可开店',mid:'需部分融资',low:'需大额融资'}},
          {id:'c4',name:'政策环境',weight:0.25,source:'delphi',support:5,rubric:{high:'宠物经济受鼓励',mid:'一般',low:'严格'}}
        ]},
        delphi: {
          status: 'done',
          weights: {
            attractiveness: {a1:0.25,a2:0.30,a3:0.20,a4:0.25},
            competitiveness: {c1:0.30,c2:0.25,c3:0.20,c4:0.25}
          },
          finalSynthesis: '两轮 Delphi 后专家对"增长率"与"本地口碑"赋权最高。成都/重庆本地宠物数全国前 5、种草生态成熟，毛孩子之家 2 年本地口碑+实时直播差异化已建立，5 家店中 3 家成都+1 家重庆+1 家绵阳/乐山，可形成"成都核心+川渝扩展"格局；绵阳/乐山客单价低、复制价值弱；加盟路线资金效率高但品控风险大。'
        },
        markets: [
          { id:'m1', name:'成都核心（2-3 家新店）', region:'成都高新/锦江/武侯', population:'潜在 50 万养宠家庭', gdpPerCapita:'人均可支配 5 万+', notes:'本地口碑强、抖音同城生态成熟',
            scores:{a1:9, a2:8, a3:8, a4:9, c1:9, c2:7, c3:8, c4:8} },
          { id:'m2', name:'重庆（1 家新店）', region:'重庆渝北/江北', population:'潜在 30 万养宠家庭', gdpPerCapita:'人均可支配 4.5 万+', notes:'已有 1 家店，扩展第 2 家',
            scores:{a1:7, a2:8, a3:7, a4:8, c1:7, c2:6, c3:7, c4:7} },
          { id:'m3', name:'绵阳/乐山（川内下沉）', region:'绵阳/乐山', population:'潜在 10 万养宠家庭', gdpPerCapita:'人均可支配 3.5 万+', notes:'客单价低、复制价值弱',
            scores:{a1:5, a2:6, a3:5, a4:5, c1:3, c2:4, c3:6, c4:6} }
        ],
        matrix: { selectedMarketId:'m1', xCut:null, yCut:null, notes:'短期保 2 家老店，中期重点攻 m1 成都 2-3 家新店（核心市场），次攻 m2 重庆 1 家（已有 1 家），长期考虑 m3 绵阳/乐山下沉。' },
        decision: {
          rationale: 'm1 成都核心市场客单价高、抖音同城生态成熟、毛孩子之家 2 年本地口碑可复用，12 个月内可贡献 50% 营收增长；m2 重庆已有 1 家，扩展第 2 家降低进入风险；m3 川内下沉客单价低、复制价值弱。',
          sequence: '成都 2 家老店优化（0-6 月）→ 成都 2 家新店（6-12 月）→ 重庆 1 家新店（12+ 月）',
          risks: ['新店选址失误','洗护师招聘难','5 家店管理失控','寄养卫生/安全风险'],
          nextSteps: '6 月内启动成都 2 家新店选址+招 3 位洗护师+1 位店长；上线小程序会员月卡+异业合作。'
        }
      },

      work3: {
        context: {
          sbuName: '毛孩子之家',
          targetMarket: '成都核心 90/95 后+家庭客+出差寄养客',
          personas: [
            { id:'p1', name:'小敏', painPoints:'猫应激反应、洗护师不专业' },
            { id:'p2', name:'赵姐', painPoints:'寄养不放心、价格不透明' },
            { id:'p3', name:'Andy', painPoints:'出差寄养、找不到靠谱店' }
          ],
          hasSurvey: true
        },
        mining: {
          documents: [
            '毛孩子之家的洗护师很温柔，我家猫不害怕。',
            '实时直播看着放心，铲屎官出门心里踏实。',
            '希望洗护师都持证上岗，CKU 认证的更专业。',
            '无应激环境做到了，猫主子不再炸毛。',
            '联名宠物摄影不错，可以和洗护打包。',
            '会员月卡能不能跨店通用？',
            '出差寄养能不能接送？',
            '美团/大众点评的 5 折券用着划算。',
            '希望有"科学养宠"内容更新，公众号不错。',
            '洗护师穿统一服装，专业感强。'
          ],
          ldaParams:{k:3,passes:15,iterations:100,no_below:2,no_above:0.5},
          stats:{raw_count:10,valid_count:10,total_words:150,vocab_size:43,coherence:0.45},
          topics:[
            {id:0,label:'专业洗护与无应激',share:40,keywords:[
              {word:'洗护师',weight:.10},{word:'CKU',weight:.08},{word:'无应激',weight:.07},{word:'专业',weight:.06},{word:'温柔',weight:.05}
            ],representative_docs:['洗护师很温柔','CKU 认证的更专业']},
            {id:1,label:'实时直播与寄养',share:35,keywords:[
              {word:'直播',weight:.10},{word:'寄养',weight:.08},{word:'放心',weight:.07},{word:'出差',weight:.06},{word:'接送',weight:.05}
            ],representative_docs:['实时直播看着放心','出差寄养能不能接送']},
            {id:2,label:'会员与异业',share:25,keywords:[
              {word:'会员',weight:.09},{word:'月卡',weight:.07},{word:'联名',weight:.06},{word:'摄影',weight:.05},{word:'跨店',weight:.04}
            ],representative_docs:['会员月卡能不能跨店通用','联名宠物摄影不错']}
          ],
          wordFreqTop:[
            {word:'洗护师',count:4},{word:'直播',count:4},{word:'无应激',count:3},{word:'会员',count:3},{word:'CKU',count:2},
            {word:'寄养',count:2},{word:'月卡',count:2},{word:'联名',count:2},{word:'专业',count:2},{word:'接送',count:2}
          ],
          painMap:[
            {id:'pa1',pain:'洗护师专业度参差不齐，缺统一认证',evidence:'希望洗护师都持证上岗',frequency:'高',linkedNeeds:['CKU 认证','统一培训'],linkedTopicId:0,type:'痛点'},
            {id:'pa2',pain:'寄养透明度不足，缺实时直播',evidence:'实时直播看着放心',frequency:'高',linkedNeeds:['24h 直播','每日反馈'],linkedTopicId:1,type:'痛点'},
            {id:'pa3',pain:'出差寄养缺接送服务',evidence:'出差寄养能不能接送',frequency:'中',linkedNeeds:['接送服务','一站式'],linkedTopicId:1,type:'痛点'},
            {id:'pa4',pain:'会员月卡不能跨店通用',evidence:'会员月卡能不能跨店通用',frequency:'中',linkedNeeds:['跨店通用','会员体系'],linkedTopicId:2,type:'痛点'},
            {id:'pa5',pain:'洗护+摄影不能组合，缺粘性',evidence:'联名宠物摄影可以打包',frequency:'中',linkedNeeds:['洗护+摄影组合','联名 IP'],linkedTopicId:2,type:'痒点'}
          ]
        },
        candidates:[
          {id:'c1',name:'洗护师 CKU 认证',pain:'专业度参差',description:'全员 CKU/NGKC 认证+统一培训+着装规范',evidence:'10 篇评论中 4 篇提及洗护师',
            desirabilityScores:{p1:{importance:10,uniqueness:8,credibility:10},p2:{importance:8,uniqueness:7,credibility:9},p3:{importance:9,uniqueness:7,credibility:9}},
            desirabilitySource:'personas', importance:9.0,uniqueness:7.3,credibility:9.3,
            feasibility:8,communicability:8,sustainability:9, selected:true},
          {id:'c2',name:'无应激低噪环境',pain:'猫应激',description:'独立单宠用具+低噪设备+渐进式洗护+专业安抚',evidence:'3 篇评论提及无应激',
            desirabilityScores:{p1:{importance:10,uniqueness:8,credibility:9},p2:{importance:7,uniqueness:7,credibility:7},p3:{importance:8,uniqueness:7,credibility:7}},
            desirabilitySource:'personas', importance:8.3,uniqueness:7.3,credibility:7.7,
            feasibility:7,communicability:8,sustainability:8, selected:true},
          {id:'c3',name:'实时寄养直播+24h 监控',pain:'寄养不放心',description:'24h 实时直播+每日视频反馈+健康检查',evidence:'4 篇评论提及直播',
            desirabilityScores:{p1:{importance:8,uniqueness:9,credibility:9},p2:{importance:10,uniqueness:8,credibility:10},p3:{importance:10,uniqueness:9,credibility:10}},
            desirabilitySource:'personas', importance:9.3,uniqueness:8.7,credibility:9.7,
            feasibility:8,communicability:9,sustainability:9, selected:true},
          {id:'c4',name:'联名宠物摄影',pain:'缺粘性',description:'与本地摄影机构联名，洗护+摄影组合套餐',evidence:'2 篇评论提及联名',
            desirabilityScores:{p1:{importance:7,uniqueness:9,credibility:7},p2:{importance:6,uniqueness:8,credibility:6},p3:{importance:6,uniqueness:8,credibility:6}},
            desirabilitySource:'personas', importance:6.3,uniqueness:8.3,credibility:6.3,
            feasibility:8,communicability:9,sustainability:7, selected:true},
          {id:'c5',name:'会员次卡+异业',pain:'会员不能跨店',description:'跨店通用月卡 980 元+异业（宠物医院/猫舍）合作',evidence:'2 篇评论提及会员',
            desirabilityScores:{p1:{importance:7,uniqueness:6,credibility:7},p2:{importance:8,uniqueness:6,credibility:7},p3:{importance:6,uniqueness:6,credibility:6}},
            desirabilitySource:'personas', importance:7.0,uniqueness:6.0,credibility:6.7,
            feasibility:8,communicability:7,sustainability:7, selected:false}
        ],
        dimensions:{
          desirability:[{key:'importance',label:'重要性'},{key:'uniqueness',label:'独特性'},{key:'credibility',label:'可信度'}],
          implementability:[{key:'feasibility',label:'可行性'},{key:'communicability',label:'传播力'},{key:'sustainability',label:'持续性'}]
        },
        matrix:{showSector:true,sectorAngle:90,sectorRadius:12,xCut:null,yCut:null,manualSelected:[]},
        migration:{analyses:[]},
        proposition:{
          coreValueIds:['c1','c2','c3','c4'],
          alternatives:[
            {id:'a1',text:'毛孩子放心，毛孩子之家。'},
            {id:'a2',text:'专业洗护，实时直播。'},
            {id:'a3',text:'科学养宠，从洗护开始。'}
          ],
          chosenValueText:'毛孩子放心，毛孩子之家。',
          positioning:{brand:'毛孩子之家', audience:'90/95 后新手铲屎官+二线家庭客+出差/旅行寄养客', coreValue:'洗护师认证+无应激环境+实时直播+联名摄影', category:'西南区域宠物服务专业品牌'},
          positioningStatement:'毛孩子之家 是为 90/95 后新手铲屎官与二线家庭客与出差/旅行寄养客 提供 洗护师认证+无应激环境+实时直播+联名摄影 的 西南区域宠物服务专业品牌。',
          sloganOptions:['毛孩子放心，毛孩子之家','专业洗护，实时直播','科学养宠，从洗护开始'],
          chosenSlogan:'毛孩子放心，毛孩子之家',
          mbti:'ISFJ',
          archetype: { primary: 'Caregiver', secondary: 'Sage' },
          personalityTraits:['温暖','专业','家人感','科学','安心']
        }
      },

      work4: {
        route:{
          scope:'domestic',
          oemType:'OBM',
          entryMode:'',
          light:[],
          politicalPower:''
        },
        product:{
          name:'毛孩子之家宠物服务',
          description:'专业洗护+无应激环境+实时寄养直播+联名摄影',
          coreDifferentiators:['洗护师 CKU 认证','无应激低噪环境','实时寄养直播','单宠独立用具','联名宠物摄影'],
          physicalFeatures:'CKU/NGKC 认证 / 无应激设备 / 24h 直播摄像头 / 独立单宠用具 / 联名摄影',
          serviceOffering:'专业洗护 / 24h 寄养直播 / 接送服务 / 联名摄影 / 会员月卡 / 异业合作',
          technologyMoat:'CKU 认证洗护师团队 + 2 家店私域社群 + 实时直播 SaaS',
          skus:[
            {name:'基础洗护', specs:'1.5 小时', price_range:'80-200 元', differentiator:'CKU 认证洗护师'},
            {name:'无应激 SPA', specs:'2 小时', price_range:'200-300 元', differentiator:'独立单宠+低噪'},
            {name:'寄养 24h 直播', specs:'1 天起', price_range:'100-250 元/天', differentiator:'24h 实时直播'},
            {name:'会员月卡', specs:'4 次洗护+2 次寄养', price_range:'980 元/月', differentiator:'跨店通用'}
          ]
        },
        price:{
          strategy:'value',
          strategyNote:'中端定价，会员月卡+联名摄影提升复购与客单。',
          tiers:[
            {name:'基础洗护', targetSegment:'新手铲屎官', price:128, unit:'元/次', notes:'CKU 认证'},
            {name:'无应激 SPA', targetSegment:'猫主子家长', price:238, unit:'元/次', notes:'独立单宠'},
            {name:'寄养 24h 直播', targetSegment:'出差/家庭客', price:168, unit:'元/天', notes:'24h 直播+反馈'},
            {name:'会员月卡', targetSegment:'复购客', price:980, unit:'元/月', notes:'4 次洗护+2 次寄养'}
          ],
          channelPricing:[
            {channel:'美团/大众点评', priceAdjustment:'9 折团购', rationale:'拉新引流'},
            {channel:'抖音同城', priceAdjustment:'套餐立减 30', rationale:'种草转化'},
            {channel:'私域社群', priceAdjustment:'会员月卡 9 折', rationale:'老客粘性'}
          ],
          promotions:[
            {occasion:'618 宠物节', discount:'会员月卡 8 折', period:'6 月'},
            {occasion:'新店开业', discount:'洗护 5 折', period:'开业首月'}
          ],
          competitorPrices:'新瑞鹏 100-300；宠物家 80-200；圣宠 60-150；宠宠熊 50-150；爱诺 100-250'
        },
        place:{
          onlineSelf:['毛孩子之家小程序','抖音同城号旗舰店'],
          onlineThird:['美团','大众点评','小红书企业号','抖音同城','异业合作（宠物医院/猫舍）'],
          onlineNotes:'小程序为主阵地（会员+直播+预约）；美团/点评做拉新；抖音同城种草；异业合作扩客',
          offlineDirect:['成都高新店','成都锦江店','成都新店 1（拟）','成都新店 2（拟）','重庆新店（拟）'],
          offlineDistrib:[],
          offlineRetail:[],
          offlineNotes:'5 家直营连锁，第一阶段不开放加盟；川渝同城为主',
          keyPartners:['小红书养宠 KOC','抖音同城 MCN','本地宠物医院/猫舍（异业）','CKU 认证机构'],
          channelIncentives:'KOC 体验券+佣金 10%；MCN 坑位费 + GMV 提成 5%；异业互换优惠券',
          structure:[
            {name:'线下', children:[{name:'成都门店', share:75},{name:'重庆门店', share:20},{name:'其他川渝', share:5}]},
            {name:'线上', children:[{name:'小程序', share:50},{name:'美团/点评', share:30},{name:'抖音/小红书', share:20}]}
          ]
        },
        promotion:{
          theme:'毛孩子放心，毛孩子之家',
          advertising:[
            {media:'抖音同城短视频', budgetShare:35, message:'无应激洗护+实时直播', kpi:'同城曝光/团购 GMV'},
            {media:'小红书 KOC', budgetShare:30, message:'养宠真实体验', kpi:'互动率/UGC'},
            {media:'美团/大众点评', budgetShare:20, message:'9 折团购+会员月卡', kpi:'到店转化率'},
            {media:'私域社群', budgetShare:15, message:'老客回馈+新店开业', kpi:'复购率/老带新'}
          ],
          pr:[
            {event:'毛孩子之家新店开业+CKU 认证发布', timing:'2027 年 3-6 月', expectedReach:'同城 50 万养宠群体'},
            {event:'联名宠物摄影展', timing:'每季度 1 次', expectedReach:'同城 20 万'}
          ],
          salesPromotion:[
            {tactic:'美团 9 折团购', mechanic:'基础洗护', period:'常年'},
            {tactic:'会员月卡 9 折', mechanic:'私域社群', period:'618/双 11'}
          ],
          crm:{tool:'小程序+企业微信+门店 SaaS', membership:'银卡（消费 1000）/金卡（消费 3000）/钻石卡（消费 6000）', repurchase:'每 30 天推送洗护/活动', notes:'老客复购是基本盘'},
          contentStrategy:'抖音"无应激洗护+实时直播"系列 + 小红书"科学养宠"系列 + 公众号"CKU 认证洗护师"长文。'
        }
      },

      work5: {
        cover: { title:'毛孩子之家 · 2027 区域品牌升级与连锁化策划书', subtitle:'毛孩子放心，毛孩子之家', team:'毛孩子之家团队', date:'2026-08' },
        abstract: '本策划书围绕毛孩子之家从成都/重庆 2 家直营向"5 家直营+区域品牌升级"扩张展开。核心定位"毛孩子放心，毛孩子之家"，以"洗护师认证+无应激环境+实时直播+联名摄影"为四大卖点，主攻 90/95 后新手铲屎官+二线家庭客+出差/旅行寄养客，12 个月内开 3 家新店，营收增长 50%。',
        ch1_business: '毛孩子之家专注宠物洗护+寄养，2 家直营（成都高新/锦江），年营收约 240 万，复购 45%。核心价值为功能（洗护师认证+无应激+实时直播）、情感（毛孩子放心的家人感）、社会（科学养宠的铲屎官）。',
        ch2_environment: {
          political: '《动物防疫法》要求寄养资质，宠物经济受鼓励。',
          economic: '2023 年宠物经济 2793 亿，川渝宠物数全国前 5。',
          social: '90/95 后科学养宠、宠物拟人化、出差/旅行寄养刚需。',
          technological: '美团/大众点评宠物频道成熟；CKU/NGKC 认证普及；门店 SaaS+24h 直播。',
          strengths: ['2 年本地口碑','CKU 认证洗护师','实时直播差异化','复购 45%'],
          weaknesses: ['跨城品牌弱','洗护师招聘难','缺连锁化人才','摄影能力依赖外协'],
          opportunities: ['川渝扩张','联名摄影','异业合作','会员月卡'],
          threats: ['新瑞鹏下沉','宠物家连锁化','寄养卫生风险']
        },
        ch3_strategy: {
          segmentation: '按客户分层：90/95 后新手铲屎官 / 二线家庭客 / 出差/旅行寄养客。',
          targeting: '短期保 2 家老店；中期攻成都 2 家新店（核心市场）；长期拓重庆 1 家+川内下沉。',
          positioning: '为 90/95 后新手铲屎官与二线家庭客与出差/旅行寄养客提供洗护师认证+无应激+实时直播+联名摄影的西南区域宠物服务专业品牌。'
        },
        ch4_mix: {
          product: '基础洗护+无应激 SPA+寄养 24h 直播+会员月卡+联名摄影',
          price: '中端定价（128-238 元洗护，168 元/天寄养，980 元月卡）',
          place: '成都 2 家+新店+重庆+小程序+美团/抖音同城+异业',
          promotion: '"毛孩子放心，毛孩子之家"——抖音同城"无应激洗护+实时直播"+小红书 KOC 养宠',
          customerValue: '洗护师认证+无应激+实时直播+联名摄影',
          customerCost: '中端定价+会员月卡+老客折扣',
          convenience: '小程序+美团/点评+接送服务',
          communication: 'CKU 认证+联名摄影展+养宠 KOC'
        },
        ch5_outlook: '12 个月内开 3 家新店（成都 2+重庆 1），推出联名摄影+会员月卡+异业合作，营收增长 50%。3 年内品牌从川渝 2 家店升级为西南区域宠物服务代表。关键风险为洗护师招聘与新店选址，应对为师徒制复制+老板亲自选址+CKU 认证机构合作。',
        references: [
          { authors:'', title:'2024 中国宠物经济白皮书', year:'2024', url:'' },
          { authors:'', title:'2023 川渝宠物服务市场报告', year:'2023', url:'' }
        ]
      }
    }
  },

  /* ============================================================
     公共方法
     ============================================================ */
  list() {
    return Object.entries(this.cases).map(([key, c]) => ({key, ...c.meta}));
  },

  inject(caseKey, s) {
    const c = this.cases[caseKey];
    if(!c) {
      console.warn('[DemoData] 案例不存在:', caseKey);
      return false;
    }
    if(!c.meta || c.meta.ready!==true || !c.work1) {
      console.warn('[DemoData] 案例尚未填完整数据:', caseKey, '— 仅 meta 可用');
      return false;
    }

    s.work1 = c.work1;
    s.work2 = c.work2;
    s.work3 = c.work3;
    s.work4 = c.work4;
    s.work5 = c.work5;
    s.meta = s.meta || {};
    s.meta.demoCase = caseKey;

    // 用每个 Work 的 defaultData 兜底缺失字段
    const mergeDefaults = (workKey, mod) => {
      if(!mod || typeof mod.defaultData !== 'function') return;
      const def = mod.defaultData();
      s[workKey] = { ...def, ...(s[workKey]||{}) };
      Object.keys(def).forEach(k=>{
        if(s[workKey][k] && typeof def[k]==='object' && !Array.isArray(def[k]) && def[k]!==null){
          s[workKey][k] = { ...def[k], ...s[workKey][k] };
        }
      });
    };
    mergeDefaults('work1', typeof Work1!=='undefined' ? Work1 : null);
    mergeDefaults('work2', typeof Work2!=='undefined' ? Work2 : null);
    mergeDefaults('work3', typeof Work3!=='undefined' ? Work3 : null);
    mergeDefaults('work4', typeof Work4!=='undefined' ? Work4 : null);
    mergeDefaults('work5', typeof Work5!=='undefined' ? Work5 : null);

    return true;
  }
};
