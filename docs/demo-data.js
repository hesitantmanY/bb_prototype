/* ============================================================
   DEMO DATA — injected on "查看演示" toggle.
   A fictional Chinese tea brand expanding to Southeast Asia.
   ============================================================ */
const DemoData = {
  inject(s){
    s.work1 = {
      sbu: {
        name:'山木茶事 Shanmu Tea',
        category:'高端原叶中国茶 + 茶具订阅',
        stage:'海外扩张期',
        scope:'东南亚',
        countries:['新加坡'],
        summary:'以可持续产地直采、节气茶单和陶瓷茶具订阅，服务 25–40 岁东南亚城市华人与文化爱好者。',
        threeQuestions:{customer:true, channel:true, brand:true},
        boundary:'客户：与母公司国内大宗茶业务的经销商客群完全区隔，面向东南亚 C 端文化人群；渠道：母公司 B2B 经销网络不共享，自建 Shopee/独立站与海外专柜；品牌：山木茶事为独立出海品牌，不出现母品牌 logo；损益：海外团队独立核算。仅复用母公司的产地供应链与制茶资质。'
      },
      environment: {
        political:'东南亚华人圈对中国传统文化接受度高；新加坡、马来西亚均有成熟食品进口合规框架；印尼需清真认证。',
        economic:'新马人均 GDP 高，新加坡 2023 年约 USD 84,000；精品茶年增速 12-18%，高于传统茶。',
        social:'华人 25–40 岁群体对节气、慢生活、正念饮茶的兴趣上升；KOL 文化推动送礼场景。',
        technological:'Shopee、Lazada、TikTok Shop 渗透率高；小程序+独立站跨境电商成熟；冷链已覆盖一线城市。',
        industry:'活跃品牌数十个，Top 为 TWG/ITO EN/TEAMan；精品茶渗透率仍低（增量市场）；价格带分超高端百货、年轻拼配、本地老字号三段；"产地溯源+节气+订阅"垂直定位空白。',
        basics:{
          scale:{actual:'团队 12 人，深圳+新加坡各一办公室',target:'海外团队 25 人（含本地茶师 3 位）',source:'内部台账'},
          scope:{actual:'原叶茶 + 茶具订阅，不做瓶装茶饮',target:'增加商务定制线，不进入商超袋泡茶',source:'战略规划'},
          products:{actual:'节气订阅 8 期/年，30g/期',target:'+ 商务礼盒 + 陶瓷联名茶具',source:'产品路线图'},
          customers:{actual:'国内茶友社群为主',target:'东南亚 25-40 岁城市文化人群，女性占 60%',source:'用户调研'},
          supply:{actual:'复用母公司 12 位签约茶师',target:'新增东南亚本地陶艺师 5 位',source:'供应链'},
          performance:{
            share:{actual:'0（新进入）',target:'新加坡精品原叶茶 3%',source:'目标推导'},
            roi:{actual:'-',target:'首年 ROI 0.8，第三年 1.6',source:'财务模型'},
            growth:{actual:'-',target:'年增长 40%',source:'行业基准 12-18% × 差异化溢价'}
          }
        },
        competitors:[
          {id:'c1',name:'TWG Tea',price:'SGD 55-120/100g（超高端）',strengths:'百货专柜、奢华品牌认知、调香 SKU 丰富',weaknesses:'过度香水化、原叶纯度受质疑、年轻客群觉老气',position:'在文化叙事与原叶纯度上差异化，价格略低'},
          {id:'c2',name:'TEAMan',price:'SGD 28/80g（年轻拼配）',strengths:'社交媒体强、年轻客群、拼配创新',weaknesses:'缺乏产地深度、礼盒感弱',position:'以节气产地和茶具礼盒错位'},
          {id:'c3',name:'本地老字号茶庄',price:'中端散茶',strengths:'本地信任、价格亲民、线下客流',weaknesses:'无品牌叙事、包装陈旧、不懂数字营销',position:'用现代设计与订阅体验升级'},
          {id:'c4',name:'ITO EN',price:'瓶装茶 SGD 2-4',strengths:'渠道渗透、即饮便利',weaknesses:'非原叶体验、无文化溢价',position:'不直接竞争（不同场景）'},
          {id:'c5',name:'Aesthetic Tea Co.',price:'SGD 40-70/罐',strengths:'设计驱动、独立站成熟',weaknesses:'产地不透明、SKU 少',position:'以茶师溯源 AR 建立信任'}
        ],
        ourCapabilities:{
          delivery:'复用母公司供应链，工艺稳定但海外小批量灵活度待提升',
          core:'AR 溯源小程序与可跳过订阅系统为技术长板',
          brand:'海外知名度为零，但中文文化叙事独特',
          customer:'国内私域成熟，海外渠道从零建设',
          compliance:'新加坡食品进口合规清晰，印尼清真认证待办',
          defensive:'12 位茶师 3 年独家 + 节气内容 IP',
          critical:'海外品牌零知名度，首单获客成本高',
          structural:'海外重资产开柜成本高，宜以快闪+线上规避',
          smileCurve:'优势在研发/内容（茶师+节气 IP）与品牌端，劣势在渠道/零售终端——定位为"内容与品牌驱动的订阅"，不在门店密度上硬拼。',
          trends:'节气营销、可追溯供应链、茶具订阅礼盒、KOC 内容种草、正念/慢生活运动'
        }
      },
      personas: [
        {id:'p1',name:'林慧怡',gender:'女',age:'28',occupation:'品牌经理',income:'SGD 75k/年',region:'新加坡',
         values:['品质','仪式感','可持续'],painPoints:'买茶不懂产地、害怕过度包装、送礼怕撞款',
         channels:['Instagram','小红书','Tang Plaza'],quote:'我愿意为故事和确定性付钱，但不要甜得发腻的拼配。'},
        {id:'p2',name:'陈志明',gender:'男',age:'35',occupation:'科技公司总监',income:'MYR 180k/年',region:'吉隆坡',
         values:['效率','身份','健康'],painPoints:'商务赠礼缺文化品位、自己没时间挑茶',
         channels:['LinkedIn','Pavilion KL','微信朋友圈'],quote:'我要一盒能让客户记住我的茶。'},
        {id:'p3',name:'Ayu Putri',gender:'女',age:'26',occupation:'自由插画师',income:'IDR 180m/年',region:'雅加达',
         values:['审美','故事','社区'],painPoints:'对中国茶好奇但不懂门道、怕被收"游客价"',
         channels:['TikTok','Tokopedia','本地茶会'],quote:'我想从一个有美感的盒子开始学茶。'}
      ],
      scenarios: [
        {id:'sc1',name:'日常自饮', personaIds:['p1'],
         benefits:{usage:'节气原叶品质稳定、冲泡简单',service:'订阅可跳过、茶师在线答疑',staff:'茶师专业、不推销',image:'懂茶、有生活审美的自我形象'},
         costs:{monetary:'单期 SGD 48，高于袋泡茶',time:'需要等待冲泡、学习水温',energy:'挑选山头有学习门槛',psychic:'担心买错口味、浪费订阅'},
         anchor:'稳定的品质 + 不费力的仪式感', decisiveGap:'易用——山头与冲泡门槛把新人挡在门外，需教学卡降低'},
        {id:'sc2',name:'商务/节庆送礼', personaIds:['p2'],
         benefits:{usage:'茶品体面、可定制刻字',service:'企业阶梯价、准时送达',staff:'专属定制对接',image:'有文化品位、不撞款的赠礼形象'},
         costs:{monetary:'礼盒 SGD 188 起，单价高',time:'需提前定制、等待周期',energy:'挑选款式与预算的精力',psychic:'担心对方不喜欢、不够体面'},
         anchor:'得体、有说法、不撞款', decisiveGap:'信任——收礼人是否认这个品牌，取决于品牌知名度（当前为零）'},
        {id:'sc3',name:'文化入门好奇', personaIds:['p3'],
         benefits:{usage:'从美感盒子入门、低门槛尝试',service:'茶会/社群陪伴学习',staff:'同好友善、不端着',image:'审美与文化身份的表达'},
         costs:{monetary:'入门款可接受',time:'学习茶知识的时间',energy:'信息过载、怕被收游客价',psychic:'不懂门道的尴尬'},
         anchor:'被美感和故事吸引，再慢慢懂茶', decisiveGap:'信任——怕被当作"游客"收溢价，需透明价格与产地'}
      ],
      metrics: {
        disclaimerAcknowledged:true,
        dimensions: [
          {id:'dm1',name:'品牌功效·产品',secondaries:[
            {id:'ds1',name:'产品品质与产地溯源',measure:'5分占比 / 溯源扫码完成率',forecast:6,target:9},
            {id:'ds2',name:'节气与产品创新',measure:'节气新品售罄率',forecast:6,target:8},
            {id:'ds3',name:'订阅与配送服务',measure:'准时送达率 / NPS',forecast:7,target:9}
          ]},
          {id:'dm2',name:'品牌形象·知名度',secondaries:[
            {id:'ds4',name:'知名度',measure:'无提示提及率（目标客群%）',forecast:3,target:7},
            {id:'ds5',name:'差异化竞争地位',measure:'能说出差异化的受访者%',forecast:6,target:8},
            {id:'ds6',name:'品牌传播与口碑',measure:'正面 UGC 篇数/月',forecast:5,target:8}
          ]},
          {id:'dm3',name:'品牌形象·判断',secondaries:[
            {id:'ds7',name:'东方美学文化价值',measure:'设计/文化相关好评占比',forecast:7,target:9},
            {id:'ds8',name:'品质可信性',measure:'品质信任题均分',forecast:7,target:9},
            {id:'ds9',name:'性价比与溢价接受度',measure:'愿意溢价 ≥20% 的受访者%',forecast:5,target:7}
          ]},
          {id:'dm4',name:'品牌形象·感受',secondaries:[
            {id:'ds10',name:'品牌专业性',measure:'选茶/制茶专业度评分',forecast:6,target:8},
            {id:'ds11',name:'仪式感与情绪价值',measure:'情绪价值题均分',forecast:7,target:9},
            {id:'ds12',name:'社交送礼得体性',measure:'送礼意愿题均分',forecast:7,target:9}
          ]},
          {id:'dm5',name:'品牌共鸣',secondaries:[
            {id:'ds13',name:'社群归属感',measure:'社群活跃 / 加入意愿',forecast:5,target:8},
            {id:'ds14',name:'行为忠诚与复购',measure:'年复购率',forecast:6,target:8},
            {id:'ds15',name:'主动推荐意愿',measure:'NPS',forecast:6,target:9},
            {id:'ds16',name:'品牌参与度',measure:'活动参与率/UGC贡献',forecast:5,target:8}
          ]}
        ]
      },
      survey: (function(){
        const anchors=['非常不同意','不同意','一般','同意','非常同意'];
        // 课件范式：每个二级指标 → 一道李克特5点陈述句（同仁堂/京东方均如此）
        const qs=[
          {id:'q1', type:'likert', text:'该品牌茶叶产地可追溯、品质稳定可靠', anchors:[...anchors], sourceIndicatorId:'ds1'},
          {id:'q2', type:'likert', text:'节气限定茶品贴合时令需求、有新意', anchors:[...anchors], sourceIndicatorId:'ds2'},
          {id:'q3', type:'likert', text:'订阅礼盒配送及时、服务体验良好', anchors:[...anchors], sourceIndicatorId:'ds3'},
          {id:'q4', type:'likert', text:'我很早就知晓该品牌', anchors:[...anchors], sourceIndicatorId:'ds4'},
          {id:'q5', type:'likert', text:'对比同类品牌，该品牌的产地与文化更具差异化价值', anchors:[...anchors], sourceIndicatorId:'ds5'},
          {id:'q6', type:'likert', text:'我常在茶文化、生活方式渠道看到该品牌的正面口碑', anchors:[...anchors], sourceIndicatorId:'ds6'},
          {id:'q7', type:'likert', text:'该品牌的东方美学设计富有文化吸引力', anchors:[...anchors], sourceIndicatorId:'ds7'},
          {id:'q8', type:'likert', text:'我信任该品牌的茶叶品质与安全', anchors:[...anchors], sourceIndicatorId:'ds8'},
          {id:'q9', type:'likert', text:'我愿意为该品牌的可追溯与美学支付溢价', anchors:[...anchors], sourceIndicatorId:'ds9'},
          {id:'q10',type:'likert', text:'该品牌在选茶、制茶上展现出专业度', anchors:[...anchors], sourceIndicatorId:'ds10'},
          {id:'q11',type:'likert', text:'该品牌的茶为我的日常带来仪式感与放松', anchors:[...anchors], sourceIndicatorId:'ds11'},
          {id:'q12',type:'likert', text:'把该品牌作为礼物送出很得体、有品位', anchors:[...anchors], sourceIndicatorId:'ds12'},
          {id:'q13',type:'likert', text:'我愿意加入该品牌的茶友社群', anchors:[...anchors], sourceIndicatorId:'ds13'},
          {id:'q14',type:'likert', text:'我会持续复购该品牌的茶', anchors:[...anchors], sourceIndicatorId:'ds14'},
          {id:'q15',type:'likert', text:'我愿意主动向朋友推荐该品牌', anchors:[...anchors], sourceIndicatorId:'ds15'},
          {id:'q16',type:'likert', text:'我愿意参与该品牌的节气、茶会活动', anchors:[...anchors], sourceIndicatorId:'ds16'}
        ];
        // 三类画像的态度基线（对应 ds1..ds16），各自重复 3 份并加小幅扰动
        const personas=[
          {p:'p1', base:[5,4,5,4,4,4,5,5,4,5,5,5,4,5,5,4]},
          {p:'p2', base:[4,3,5,3,5,4,3,4,5,4,3,5,3,4,4,3]},
          {p:'p3', base:[4,5,3,2,4,3,5,3,3,3,5,4,5,3,4,5]}
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
        // 由回答计算均值/标准差/分布，保证分析页与数据一致
        const mean=a=>a.reduce((x,y)=>x+y,0)/(a.length||1);
        const sd=a=>{ const m=mean(a); return Math.sqrt(mean(a.map(x=>(x-m)*(x-m)))); };
        const likertStats={};
        qs.forEach(q=>{
          const vals=[]; const dist=[0,0,0,0,0];
          responses.forEach(r=>{ const an=r.answers.find(x=>x.questionId===q.id); const v=parseInt(an?.value); if(!isNaN(v)&&v>=1&&v<=5){vals.push(v);dist[v-1]++;} });
          likertStats[q.id]={mean:+mean(vals).toFixed(2),sd:+sd(vals).toFixed(2),dist,n:vals.length};
        });
        const indicatorMeans=qs.map(q=>({label:q.text.length>18?q.text.slice(0,18)+'…':q.text, value:likertStats[q.id].mean, mean:likertStats[q.id].mean, sourceIndicatorId:q.sourceIndicatorId||null}));
        // 暴露给同级 analysis 字段
        s.__demoAnalysis={likertStats, indicatorMeans};
        return {questions:qs, responses, n:3, status:'done', progress:{done:9,total:9}, error:null, mode:'demo', useFewShot:true, useRag:false, ragContext:''};
      })(),
      analysis: Object.assign({openThemes:[], insights:'1. 产品品质与产地溯源（Q1）、品质可信性（Q8）是全画像共识最强项，均在 4.3 以上。\n2. 品牌知名度（Q4）与茶友社群（Q13）是整体短板，年轻客群（Ayu 类）对品牌仍陌生。\n3. 送礼得体性（Q12）在商务客群中得分最高，是首次购买的核心场景。\n4. 东方美学（Q7）与仪式感（Q11）在年轻客群中突出，但溢价接受度（Q9）偏低，需以入门款降低门槛。\n5. 复购（Q14）与推荐（Q15）分化明显，建议用节气订阅把高美学评价转化为忠诚度。'}, s.__demoAnalysis || {}),
      values: {
        functional:['节气茶单','可追溯产地','可持续包装'],
        emotional:['慢生活仪式','文化亲近'],
        social:['高品位送礼','文化身份'],
        epistemic:['每月茶样','茶师故事'],
        conditional:['华人节庆','商务赠礼'],
        chosenFunctional:'节气产地原叶',
        chosenEmotional:'慢生活仪式感',
        chosenSocial:'文化品位赠礼',
        rationale:'以"节气产地"建立功能可信度，以"慢生活仪式"建立情感连接，以"文化品位"承担社交赠礼场景。'
      },
      recommendations: {
        short:'在新加坡 Tang Plaza / Shopee 上架节气礼盒 + 茶具订阅；3 位 KOC 拍摄开盒与冲泡。',
        mid:'吉隆坡 Pavilion 快闪 + 雅加达清真认证产品线；上线小程序 AR 溯源。',
        long:'建立东南亚茶师驻地项目，与本地陶艺师合作限定茶具，形成年度 IP。',
        risks:['汇率波动','印尼清真认证周期','TWG 模仿节气概念']
      }
    };
    delete s.__demoAnalysis;
    // 回填指标实测分（李克特 1-5 → 1-10），让  展示预测 vs 实测偏差
    if(typeof Work1!=='undefined' && Work1.backfillScores) Work1.backfillScores();

    s.work2 = {
      scope: {
        question:'山木茶事应首先深耕哪个东南亚市场作为旗舰？',
        timeframe:'12–18 个月',
        constraints:'首批海外预算 SGD 500k；品牌资产集中在中文文化叙事；暂无清真认证。',
        candidateCount:3
      },
      attractiveness: {indicators:[
        {id:'a1',name:'市场规模',weight:0.25,source:'delphi',support:5,rubric:{high:'精品茶年零售 >USD 200m',mid:'USD 80–200m',low:'<USD 80m'}},
        {id:'a2',name:'增长率',weight:0.30,source:'delphi',support:5,rubric:{high:'年增 >15%',mid:'8-15%',low:'<8%'}},
        {id:'a3',name:'华人人口与文化亲近',weight:0.25,source:'delphi',support:5,rubric:{high:'华人 >30% 且文化亲近度高',mid:'15-30%',low:'<15%'}},
        {id:'a4',name:'支付能力',weight:0.20,source:'delphi',support:5,rubric:{high:'人均 GDP >USD 40k',mid:'USD 10-40k',low:'<USD 10k'}}
      ]},
      competitiveness: {indicators:[
        {id:'c1',name:'渠道可达性',weight:0.30,source:'delphi',support:5,rubric:{high:'已有合作分销商',mid:'需 1-2 个本地伙伴',low:'从零建设'}},
        {id:'c2',name:'品牌资产匹配',weight:0.25,source:'delphi',support:5,rubric:{high:'中文文化叙事被广泛接受',mid:'部分场景接受',low:'需要重写叙事'}},
        {id:'c3',name:'合规/认证',weight:0.20,source:'delphi',support:5,rubric:{high:'食品/清真认证齐备',mid:'6 个月可获',low:'>1 年或不可获'}},
        {id:'c4',name:'竞争空白',weight:0.25,source:'delphi',support:5,rubric:{high:'无直接竞品占据此定位',mid:'1-2 个弱竞品',low:'强竞品已占据'}}
      ]},
      delphi: {
        status:'done',
        weights:{
          attractiveness:{a1:0.25,a2:0.30,a3:0.25,a4:0.20},
          competitiveness:{c1:0.30,c2:0.25,c3:0.20,c4:0.25}
        },
        finalSynthesis:'两轮 Delphi 后专家对"增长率"与"渠道可达性"赋权最高，提示旗舰市场应兼具高增速与较低进入摩擦。新加坡在支付能力与品牌资产匹配上突出，市场规模略小。'
      },
      markets: [
        {id:'m1',name:'新加坡',region:'新加坡',population:'5.9m',gdpPerCapita:'USD 84k',notes:'高支付、华人主导、高端零售成熟',
         scores:{a1:6,a2:8,a3:9,a4:10,c1:8,c2:9,c3:9,c4:7},
         e_a1:'精品茶零售约 USD 120m', e_c3:'食品进口现成'},
        {id:'m2',name:'吉隆坡 / 巴生谷',region:'马来西亚',population:'8m 大都会',gdpPerCapita:'MYR 180k',notes:'华人 40%+、成本低、清真需认证',
         scores:{a1:7,a2:9,a3:9,a4:6,c1:7,c2:8,c3:5,c4:8}},
        {id:'m3',name:'雅加达',region:'印尼',population:'11m 大都会',gdpPerCapita:'IDR 180m',notes:'市场最大但清真认证与品牌叙事待建',
         scores:{a1:9,a2:9,a3:3,a4:4,c1:5,c2:4,c3:2,c4:7}}
      ],
      matrix: { selectedMarketId:'m1', xCut:null, yCut:null, notes:'新加坡为旗舰，吉隆坡 6 个月后跟进，雅加达等待清真认证完成。'},
      decision: {
        rationale:'新加坡虽市场规模较小，但人均支付能力、品牌资产匹配与合规成熟度均领先，可在 12 个月内建立高端标杆；吉隆坡作为第二波，以同一供应链快速复制。',
        sequence:'新加坡 (M0–M12) → 吉隆坡 (M6–M18) → 雅加达 (M18+)',
        risks:['SGD 汇率','新加坡租金高','TWG 可能在新加坡发起价格战'],
        nextSteps:'签约 Tang Plaza 快闪；9 月前完成 Shopee 旗舰店；锁定 3 位 KOC。'
      }
    };

    s.work3 = {
      context: {
        sbuName:'山木茶事 Shanmu Tea',
        targetMarket:'新加坡 — 高支付、华人主导、高端零售成熟',
        personas:s.work1.personas.map(p=>({id:p.id,name:p.name,painPoints:p.painPoints})),
        hasSurvey:true
      },
      mining: {
        documents:[
          '这款茶包装好漂亮但价格真的贵，要是能每月寄不同的试试就好。',
          '买过 TWG，太香了像香水，还是想要原叶。',
          '送礼最怕撞款，节气限定比较有说法。',
          '不知道哪个山头的，师傅是谁，喝起来没底。',
          '盒子丢掉可惜，留着占地方，能当花器就好。',
          '能不能告诉我冲泡水温？我每次都泡苦。',
          '在 Tang Plaza 看到但不知道怎么选，店员只推荐最贵的。',
          '想要订阅，但希望可以跳过某个月。',
          '我爸喝了一辈子铁观音，我想给他一个不一样的礼盒。',
          '节气茶单有意思，但我分不清清明和谷雨的区别。'
        ],
        ldaParams:{k:3,passes:15,iterations:100,no_below:2,no_above:0.5},
        stats:{raw_count:10,valid_count:10,total_words:156,vocab_size:42,coherence:0.48},
        topics:[
          {id:0,label:'订阅与发现',share:38,keywords:[
            {word:'订阅',weight:.08},{word:'每月',weight:.06},{word:'试试',weight:.05},{word:'节气',weight:.05},{word:'跳过',weight:.03}
          ],representative_docs:['要是能每月寄不同的试试就好','希望可以跳过某个月']},
          {id:1,label:'产地与信任',share:34,keywords:[
            {word:'产地',weight:.08},{word:'师傅',weight:.07},{word:'山头',weight:.06},{word:'冲泡',weight:.04},{word:'水温',weight:.03}
          ],representative_docs:['不知道哪个山头的，师傅是谁','能不能告诉我冲泡水温']},
          {id:2,label:'包装与送礼',share:28,keywords:[
            {word:'礼盒',weight:.08},{word:'送礼',weight:.07},{word:'包装',weight:.06},{word:'撞款',weight:.04},{word:'花器',weight:.03}
          ],representative_docs:['送礼最怕撞款','盒子能当花器就好']}
        ],
        wordFreqTop:[
          {word:'节气',count:5},{word:'订阅',count:4},{word:'产地',count:4},{word:'礼盒',count:4},{word:'师傅',count:3},
          {word:'包装',count:3},{word:'冲泡',count:2},{word:'山头',count:2},{word:'每月',count:2},{word:'送礼',count:2}
        ],
        painMap:[
          {id:'pa1',pain:'不懂产地与师傅，难以判断价值',evidence:'不知道哪个山头的，师傅是谁',frequency:'高',linkedNeeds:['产地透明','溯源'],linkedTopicId:1,type:'痛点'},
          {id:'pa2',pain:'买一次就要定一个口味，风险高',evidence:'要是能每月寄不同的试试就好',frequency:'高',linkedNeeds:['订阅','可跳过'],linkedTopicId:0,type:'痛点'},
          {id:'pa3',pain:'送礼怕撞款，缺文化说法',evidence:'送礼最怕撞款，节气限定比较有说法',frequency:'中',linkedNeeds:['差异化','文化叙事'],linkedTopicId:2,type:'痛点'},
          {id:'pa4',pain:'包装过度、丢弃有负担',evidence:'盒子丢掉可惜，能当花器就好',frequency:'中',linkedNeeds:['可持续包装'],linkedTopicId:2,type:'痒点'},
          {id:'pa5',pain:'不会冲泡，水温/时间把握不好',evidence:'每次都泡苦',frequency:'中',linkedNeeds:['教学'],linkedTopicId:1,type:'痒点'}
        ]
      },
      candidates:[
        {id:'c1',name:'节气产地订阅',pain:'买一次就要定一个口味',description:'每节气 30g 原叶 + 产地卡片 + 冲泡指引，可跳过',evidence:'10 篇评论中 4 篇提及',
         desirabilityScores:{p1:{importance:9,uniqueness:8,credibility:8},p2:{importance:7,uniqueness:7,credibility:8},p3:{importance:9,uniqueness:9,credibility:7}},
         desirabilitySource:'personas',
         importance:8.3,uniqueness:8.0,credibility:7.7,
         feasibility:7,communicability:9,sustainability:8, selected:true},
        {id:'c2',name:'AR 产地溯源',pain:'不懂产地与师傅',description:'扫码看山头、师傅、采摘与加工视频',evidence:'已有合作茶师 12 位',
         desirabilityScores:{p1:{importance:8,uniqueness:7,credibility:9},p2:{importance:6,uniqueness:6,credibility:8},p3:{importance:8,uniqueness:8,credibility:6}},
         desirabilitySource:'personas',
         importance:7.3,uniqueness:7.0,credibility:7.7,
         feasibility:6,communicability:8,sustainability:7, selected:true},
        {id:'c3',name:'可种植礼盒',pain:'包装过度',description:'茶盒内嵌种子纸/可拆花器，包装二次生命',evidence:'3 篇评论提及',
         desirabilityScores:{p1:{importance:6,uniqueness:8,credibility:6},p2:{importance:5,uniqueness:6,credibility:7},p3:{importance:8,uniqueness:9,credibility:6}},
         desirabilitySource:'personas',
         importance:6.3,uniqueness:7.7,credibility:6.3,
         feasibility:5,communicability:9,sustainability:9, selected:false},
        {id:'c4',name:'商务定制茶礼',pain:'送礼撞款',description:'企业 LOGO 刻字 + 节气祝福卡 + 师傅签名',evidence:'调研中 4/9 提及送礼',
         desirabilityScores:{p1:{importance:5,uniqueness:5,credibility:8},p2:{importance:9,uniqueness:7,credibility:9},p3:{importance:4,uniqueness:4,credibility:7}},
         desirabilitySource:'personas',
         importance:6.0,uniqueness:5.3,credibility:8.0,
         feasibility:8,communicability:7,sustainability:6, selected:true},
        {id:'c5',name:'冲泡教学卡',pain:'不会冲泡',description:'每茶配水温/时间/茶量卡，扫码看 60 秒视频',evidence:'2 篇评论',
         desirabilityScores:{p1:{importance:6,uniqueness:4,credibility:8},p2:{importance:4,uniqueness:3,credibility:8},p3:{importance:8,uniqueness:6,credibility:7}},
         desirabilitySource:'personas',
         importance:6.0,uniqueness:4.3,credibility:7.7,
         feasibility:9,communicability:8,sustainability:8, selected:false}
      ],
      dimensions:{
        desirability:Work3.DEFAULT_DESIRABILITY_DIMS.map(d=>({...d})),
        implementability:Work3.DEFAULT_IMPLEMENTABILITY_DIMS.map(d=>({...d}))
      },
      matrix:{showSector:true,sectorAngle:90,sectorRadius:12,xCut:null,yCut:null,manualSelected:[]},
      migration:{analyses:[]},
      proposition:{
        coreValueIds:['c1','c2','c4'],
        alternatives:[
          {id:'a1',text:'每节气，把一座山头和一位师傅寄到你家。'},
          {id:'a2',text:'为城市里的文化人，提供可追溯的节气原叶。'},
          {id:'a3',text:'从山头到礼盒，透明到每一泡。'}
        ],
        chosenValueText:'每节气，把一座山头和一位师傅寄到你家。',
        positioning:{brand:'山木茶事',audience:'25–40 岁东南亚城市文化品位人群',coreValue:'节气产地原叶 + AR 溯源 + 商务礼盒',category:'高端原叶中国茶订阅'},
        positioningStatement:'山木茶事 是为 25–40 岁东南亚城市文化品位人群 提供 节气产地原叶 + AR 溯源 + 商务礼盒 的 高端原叶中国茶订阅。',
        sloganOptions:['节气有山木','一茶一师，一节一会','山中有时，木中有茶'],
        chosenSlogan:'一茶一师，一节一会',
        mbti:'INFJ',
        personalityTraits:['沉静','有品位','可信','文化叙事','节制']
      }
    };

    s.work4 = {
      product:{
        name:'节气茶事订阅',
        description:'每 6 周配送一个节气主题的原叶茶 + 茶具',
        coreDifferentiators:['节气产地订阅','AR 产地溯源','商务定制茶礼'],
        physicalFeatures:'30g 原叶铝罐 / 可降解纤维茶盒 / 陶瓷小茶具',
        serviceOffering:'14 天无理由 / 在线茶师咨询 / 订阅可跳过任一节',
        technologyMoat:'与 12 位产地茶师签 3 年独家；AR 溯源小程序',
        skus:[
          {name:'节气订阅（月）',specs:'30g/期',price_range:'SGD 48/期',differentiator:'可跳过'},
          {name:'节气订阅（年）',specs:'8 期',price_range:'SGD 360/年',differentiator:'赠陶瓷盖碗'},
          {name:'商务礼盒',specs:'双罐 + 定制刻字',price_range:'SGD 188 起',differentiator:'企业 LOGO'}
        ],
        aiResult:'**功能卖点**\n- 每节气更换山头与师傅\n- AR 扫码看产地与冲泡\n- 订阅可跳过、可暂停\n\n**情感卖点**\n- 慢生活的固定仪式\n- 文化品位的含蓄表达\n\n**服务承诺**\n- 14 天无理由退换\n- 在线茶师 7×12 小时响应'
      },
      price:{
        strategy:'value',
        strategyNote:'订阅的文化与发现价值难以用成本衡量，价值定价可维持品牌调性；商务礼盒承接高支付意愿。',
        tiers:[
          {name:'月度订阅',targetSegment:'自饮文化人群',price:48,unit:'SGD/期',notes:''},
          {name:'年度订阅',targetSegment:'忠实用户/送礼',price:360,unit:'SGD/年',notes:'约 7.5 折 + 茶具'},
          {name:'商务礼盒',targetSegment:'企业客户',price:188,unit:'SGD 起',notes:'按定制量阶梯'}
        ],
        channelPricing:[
          {channel:'Tang Plaza 专柜',priceAdjustment:'与官网同价',rationale:'维护品牌价格'},
          {channel:'Shopee 旗舰店',priceAdjustment:'官网价 9 折 + 免运',rationale:'拉新'}
        ],
        promotions:[
          {occasion:'春节',discount:'双罐礼盒 88 折',period:'春节前 3 周'},
          {occasion:'中秋',discount:'订阅年卡赠茶则',period:'中秋前 2 周'}
        ],
        competitorPrices:'TWG 100g 约 SGD 55–120；TEAMan 拼配 SGD 28/80g',
        aiResult:'**推荐价格区间**：单罐 SGD 38–58，订阅 SGD 48/期。年度订阅 7.5 折锚定长期客户。\n\n**渠道差异化**：专柜维持品牌定价；线上 9 折用于拉新与首单转化；商务礼盒按定制量阶梯报价。\n\n**促销节奏**：春节与中秋两个华人礼赠节点集中投放，年中（端午、七夕）做内容而非折扣。'
      },
      place:{
        onlineSelf:['品牌官网','微信小程序'],
        onlineThird:['Shopee 新加坡','TikTok Shop'],
        onlineNotes:'官网承接订阅与教育，Shopee 承接首单，TikTok Shop 承接 KOC 种草转化',
        offlineDirect:['Tang Plaza 专柜快闪'],
        offlineDistrib:['高端精品买手店'],
        offlineRetail:[],
        offlineNotes:'第一年以快闪验证客流，再决定是否开永久店',
        keyPartners:['Tang Plaza','新加坡茶阳客家会馆','本地陶艺师'],
        channelIncentives:'买手店首单寄售 60 天；卖结后转 65/35 分成；季度销售冠军额外 5% 市场费。',
        structure:[
          {name:'线上',children:[{name:'官网/小程序',share:40},{name:'Shopee',share:35},{name:'TikTok Shop',share:25}]},
          {name:'线下',children:[{name:'Tang Plaza 快闪',share:60},{name:'买手店',share:40}]}
        ],
        aiResult:'**线上/线下比例**：首年 70/30，第二年随 Tang Plaza 成熟向 60/40 过渡。\n\n**优先级**：Shopee 旗舰（M1）→ Tang Plaza 快闪（M3）→ TikTok Shop（M4）。\n\n**关键伙伴**：茶阳会馆背书文化、本地陶艺师做限定茶具。'
      },
      promotion:{
        theme:'一茶一师，一节一会',
        advertising:[
          {media:'Instagram/KOC',budgetShare:35,message:'开盒与冲泡仪式',kpi:'CPM<SGD 18'},
          {media:'小红书',budgetShare:25,message:'产地溯源故事',kpi:'收藏率 >8%'},
          {media:'TikTok Shop',budgetShare:20,message:'订阅首月优惠',kpi:'GMV/ROAS'},
          {media:'Tang Plaza 门店物料',budgetShare:15,message:'节气茶单',kpi:'进店转化'},
          {media:'高端生活杂志',budgetShare:5,message:'品牌长篇',kpi:'品牌搜索'}
        ],
        pr:[
          {event:'节气发布会 × 茶阳会馆',timing:'清明前',expectedReach:'50 万华人文化受众'},
          {event:'陶艺师联名茶具',timing:'中秋',expectedReach:'设计/生活方式媒体'}
        ],
        salesPromotion:[
          {tactic:'年卡赠盖碗',mechanic:'订阅年卡即赠',period:'中秋前 2 周'},
          {tactic:'企业阶梯',mechanic:'50 盒起 9 折 / 100 盒 85 折',period:'全年'}
        ],
        crm:{tool:'Klaviyo + 企业微信',membership:'茶友会（消费满 SGD 500 自动升级）',repurchase:'每节附赠"下一节预告" + 老客 9 折券',notes:''},
        contentStrategy:'每月 2 位 KOC 开盒视频 + 1 篇产地长文；节气前 1 周集中推送；每季度 1 次线下茶会。',
        aiResult:'**传播主题**：一茶一师，一节一会。\n\n**媒介组合**：KOC/小红书/TikTok 占 80% 承担种草与转化，门店/杂志承担品牌锚点。\n\n**内容节奏**：节气前 2 周预告 → 当周发布产地故事 → 节气后 UGC 征集冲泡。'
      }
    };

    s.work5 = {
      cover:{title:'山木茶事新加坡市场策划书',subtitle:'一茶一师，一节一会',team:'Atelier Demo',date:'2026-08'},
      abstract:'本策划书围绕山木茶事进入新加坡市场展开。以"节气产地原叶 + AR 溯源 + 商务礼盒"为核心卖点，面向 25–40 岁城市文化品位人群，通过 Shopee 旗舰与 Tang Plaza 快闪建立高端标杆，年度订阅承接复购。',
      ch1_business:'山木茶事以可持续产地直采、节气茶单和茶具订阅服务 25–40 岁东南亚华人与文化爱好者。核心价值为功能（节气产地）、情感（慢生活仪式）与社会（文化品位赠礼）。',
      ch2_environment:{
        political:'新加坡食品进口合规成熟；印尼需清真认证。',
        economic:'新加坡人均 GDP USD 84k，精品茶年增 12-18%。',
        social:'25–40 岁华人对节气、慢生活、正念饮茶兴趣上升。',
        technological:'Shopee/TikTok Shop 渗透高，小程序跨境电商成熟。',
        strengths:['12 位独家茶师','AR 溯源技术','文化叙事能力'],
        weaknesses:['新加坡租金高','品牌海外知名度为零','无清真认证'],
        opportunities:['精品茶高增长','送礼场景主导','KOC 种草成本低'],
        threats:['TWG 可能模仿节气','汇率波动','经济下行影响高端消费']
      },
      ch3_strategy:{
        segmentation:'按场景细分：自饮仪式（林慧怡类）、商务赠礼（陈志明类）、文化入门（Ayu 类）。',
        targeting:'以新加坡为旗舰，聚焦自饮仪式 + 商务赠礼。',
        positioning:'为 25–40 岁东南亚城市文化品位人群提供节气产地原叶订阅的高端品牌。'
      },
      ch4_mix:{
        product:'节气订阅 + AR 溯源 + 商务礼盒',
        price:'价值定价，单期 SGD 48，年卡 SGD 360',
        place:'Shopee 旗舰 + Tang Plaza 快闪 + 买手店',
        promotion:'一茶一师，一节一会；KOC/小红书/TikTok 80% 预算',
        customerValue:'每节气提供"发现 + 仪式 + 信任"三重价值',
        customerCost:'价格 + 选择成本（不知道怎么挑）由订阅与教学降低',
        convenience:'官网/Shopee/TikTok 多渠道下单，跳过任一节',
        communication:'茶师内容 + UGC + 茶会，形成双向对话'
      },
      ch5_outlook:'前 12 个月在新加坡建立高端标杆并跑通订阅模型；6 个月后用同一供应链复制吉隆坡；18 个月后视清真认证情况进入雅加达。关键风险为 TWG 模仿与租金压力，应对为独家茶师合约与快闪优先。',
      references:[
        {authors:'Castelo, N. et al.',title:'AI-Human Hybrids for Marketing Research',year:'2025',url:''},
        {authors:'',title:'Singapore Tea Market Report 2024',year:'2024',url:''}
      ]
    };

    // —— 用每个 Work 的 defaultData 兜底缺失字段 ——
    // 之前手写的 demo 数据只覆盖部分字段（如 work4 漏了 route），导致
    // renderAll 调用 Work4.renderStep('route') 时读 undefined 字段崩溃，
    // 整个 renderAll 中断、my-toggleDemo 还原代码未跑、页面卡在 sbu。
    // 兜底后任何被遗漏的字段都有合理默认值。
    const mergeDefaults = (workKey, mod) => {
      if(!mod || typeof mod.defaultData !== 'function') return;
      const def = mod.defaultData();
      s[workKey] = { ...def, ...(s[workKey]||{}) };
      // 一层字段各自再合并（route/product/...）— demo 数据提供的就是覆盖子集
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
  }
};
