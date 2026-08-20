/* ============================================================
   WORKSHOP 4 — 营销组合 4P
   Steps: product / price / place / promotion / summary
   ============================================================ */
Work4.steps = [
  {id:'route',     label:'路径'},
  {id:'product',   label:'产品'},
  {id:'price',     label:'价格'},
  {id:'place',     label:'渠道'},
  {id:'promotion', label:'促销'},
  {id:'summary',   label:'汇总'}
];

Work4.defaultData = () => ({
  route: {
    scope:'global',                 // 'global' | 'domestic'
    oemType:'',                     // OEM | ODM | OBM | EMS
    entryMode:'',                   // export | licensing | franchise | contract-mfg | jv | acquisition | greenfield
    light:[],                       // 'single-point' | 'borrow-boat' | 'philosophy'
    politicalPower:''               // 政企关系（合资/并购/绿地时显示）
  },
  product: {
    name:'', description:'', coreDifferentiators:[],
    physicalFeatures:'', serviceOffering:'', technologyMoat:'',
    skus:[], aiResult:'',
    businessType:'physical',        // physical | service | hybrid
    certifications:'', localization:'', serviceLocalization:'',
    people:'', process:'', physicalEvidence:''
  },
  price: {
    strategy:'', strategyNote:'',
    tiers:[], channelPricing:[], promotions:[],
    competitorPrices:'', aiResult:'',
    ppp:'', pricingNumbers:'', fxSensitivity:''
  },
  place: {
    onlineSelf:[], onlineThird:[], onlineNotes:'',
    offlineDirect:[], offlineDistrib:[], offlineRetail:[], offlineNotes:'',
    keyPartners:[], channelIncentives:'',
    structure:[], // [{name, children:[{name, share}]}]
    aiResult:'',
    localChannelRelations:''
  },
  promotion: {
    advertising:[], pr:[], salesPromotion:[],
    crm:{tool:'',membership:'',repurchase:'',notes:''},
    contentStrategy:'', aiResult:'', theme:'',
    context:'', taboos:'', kolTiers:'', language:''
  }
});

// Bump when changing render output so cached steps re-render for existing users.
Work4.RENDER_VERSION = '2';

Work4.renderStep = function(id){
  const sec=document.querySelector('#steps4 .step[data-step="'+id+'"]');
  if(!sec) return;
  Work4.syncBodyAttrs();
  if(sec.dataset.rendered===Work4.RENDER_VERSION){ Work4.refreshDynamic(id); return; }
  sec.innerHTML='';
  sec.appendChild(UI.stepHeader('STEP '+(Work4.steps.findIndex(s=>s.id===id)+1),
    Work4.titles[id], Work4.subtitles[id]));
  // Context bar
  const c=state.work4;
  const mkt=state.work2.markets.find(m=>m.id===state.work2.matrix.selectedMarketId);
  const vp=state.work3.proposition;
  const ctxBar=el('div',{class:'callout'},
    el('span',{class:'callout-title'},'UPSTREAM'),
    el('div',{class:'mono',style:{'font-size':'11px',marginTop:'4px'}},
      `SBU: ${state.work1.sbu.name||'—'}  ·  目标市场: ${mkt?.name||'—'}  ·  价值主张: ${vp.chosenValueText||'—'}  ·  定位: ${vp.positioningStatement||'—'}  ·  Slogan: ${vp.chosenSlogan||'—'}`)
  );
  sec.appendChild(ctxBar);

  const fn=Work4.render[id]; if(fn) fn(sec);
  sec.dataset.rendered=Work4.RENDER_VERSION;
};

// Drive conditional-field visibility in CSS via body attributes:
// data-w4-scope=global|domestic, data-w4-biz=physical|service|hybrid,
// data-w4-oem=OEM|ODM|OBM|EMS, data-w4-entry=...
Work4.syncBodyAttrs = function(){
  const r=state.work4.route||{}, p=state.work4.product||{};
  document.body.dataset.w4Scope=r.scope||'global';
  document.body.dataset.w4Biz=p.businessType||'physical';
  document.body.dataset.w4Oem=r.oemType||'';
  document.body.dataset.w4Entry=r.entryMode||'';
};

Work4.titles={
  route:'出海路径与进入模式',
  product:'产品 / 技术 / 服务',
  price:'定价 / 价格体系',
  place:'销售渠道治理',
  promotion:'传播促销 / 客户关系',
  summary:'4P 汇总'
};
Work4.subtitles={
  route:'判断业务在微笑曲线上的位置、用什么模式进入市场、以什么姿态起步。这决定了后面四个 P 你能控制多少。',
  product:'产品是什么、卖给谁、靠什么差异化；海外还要过认证、做本地化。让卖点支撑 Work 3 的价值主张。',
  price:'定价策略、价格档位、渠道差异化与促销节奏；跨文化还要考虑购买力、汇率与数字禁忌。',
  place:'线上线下渠道组合、关键伙伴、本地关系与激励；让渠道覆盖目标客群聚集地。',
  promotion:'传播主题、媒介组合、公关事件、销售促进与 CRM；跨文化要匹配语境、避开禁忌、选对 KOL。',
  summary:'路径与四 P 交叉核对一致性，一键同步到 Work 5。'
};
Work4.render={};

/* ---------- ROUTE ---------- */
Work4.render.route = function(sec){
  const r=state.work4.route;

  // 0. Market scope
  sec.appendChild(el('h4',{},'市场范围'));
  const scopeRow=el('div',{class:'grid2'});
  [['global','出海 / 跨国经营'],['domestic','本阶段聚焦国内市场']].forEach(([v,label])=>{
    scopeRow.appendChild(el('div',{class:'card'+(r.scope===v?' selected':'')},
      el('label',{style:{display:'flex',gap:'8px','align-items':'center','font-family':'var(--font-display)','font-style':'italic','font-size':'16px','text-transform':'none','letter-spacing':0,'color':'var(--ink)'}},
        el('input',{type:'radio',name:'w4scope',checked:r.scope===v,onchange:()=>{r.scope=v;autosave();Work4.syncBodyAttrs();Work4.renderStep('route')}}), label)));
  });
  sec.appendChild(scopeRow);

  if(r.scope==='domestic'){
    sec.appendChild(el('div',{class:'callout'},
      el('span',{class:'callout-title'},'国内模式'),
      el('p',{class:'muted',style:{'font-size':'13px',margin:'4px 0 0'}},'聚焦单一国内市场时，跨文化调适字段已隐藏。后面的 4P 作为常规营销组合填写即可；如业务转向出海，回到本页切换即可恢复全部字段。')));
    // Domestic still needs the OEM positioning judgment for the Promotion warning
    sec.appendChild(el('h4',{},'业务在微笑曲线上的位置'));
    Work4.oemCards(sec, r);
    return;
  }

  // 1. OEM/ODM/OBM/EMS — positioning judgment
  sec.appendChild(el('h4',{},'业务在微笑曲线上的位置'));
  Work4.oemCards(sec, r);

  // 2. Entry mode
  sec.appendChild(el('h4',{},'国际市场进入模式'));
  sec.appendChild(el('p',{class:'muted',style:{'font-size':'12px',margin:'0 0 10px'}},
    '从左到右：资源承诺与风险递增、企业控制权递增。'));
  const modes=[
    ['export','出口','生产留在母国，直接/间接销往海外','低','弱'],
    ['licensing','许可证贸易','授权对方使用技术/品牌，收取授权费','低','弱'],
    ['franchise','特许经营','授权品牌+经营模式，收加盟费与权利金','中','中'],
    ['contract-mfg','合同制造','委托当地工厂按要求生产，自己负责品牌销售','中','中'],
    ['jv','合资','与本地伙伴共同出资设立企业','高','强'],
    ['acquisition','并购','收购当地现成公司','高','强'],
    ['greenfield','绿地投资','从零新建全资海外子公司','最高','最强']
  ];
  const t=el('table',{class:'data'});
  t.innerHTML='<thead><tr><th style="width:24px"></th><th>模式</th><th>说明</th><th style="width:70px">资源/风险</th><th style="width:70px">控制权</th></tr></thead>';
  const tb=el('tbody');
  modes.forEach(([v,label,desc,risk,ctrl])=>{
    const tr=el('tr',{onclick:()=>{r.entryMode=v;autosave();Work4.syncBodyAttrs();Work4.renderStep('route')}},
      el('td',{},el('input',{type:'radio',name:'w4entry',checked:r.entryMode===v})),
      el('td',{},label),
      el('td',{class:'muted',style:{'font-size':'12px'}},desc),
      el('td',{class:'mono',style:{'font-size':'11px'}},risk),
      el('td',{class:'mono',style:{'font-size':'11px'}},ctrl));
    tb.appendChild(tr);
  });
  t.appendChild(tb); sec.appendChild(t);

  // 3. Lightweight tactics (multi-select)
  sec.appendChild(el('h4',{},'轻量化出海打法（可多选）'));
  const tactics=[
    ['single-point','单点突破','只打透一个细分市场/场景/人群，用未被满足的需求而非市场热门选卖点（海尔小冰箱、传音非洲）'],
    ['borrow-boat','借船出海','借平台（Amazon/TikTok Shop）、渠道（本地经销商）、生态（产业带）和本地伙伴，先借后建'],
    ['philosophy','哲学先行','用利他/价值观做差异化，把为用户着想变成可感知的品牌资产']
  ];
  const lw=el('div',{class:'grid3'});
  tactics.forEach(([v,label,desc])=>{
    const on=(r.light||[]).includes(v);
    lw.appendChild(el('div',{class:'card'+(on?' selected':''),onclick:()=>{
      r.light=r.light||[]; const i=r.light.indexOf(v); if(i>=0)r.light.splice(i,1); else r.light.push(v);
      autosave();Work4.renderStep('route');
    }},
      el('label',{style:{display:'flex',gap:'8px','align-items':'flex-start','font-family':'var(--font-display)','font-style':'italic','font-size':'16px','text-transform':'none','letter-spacing':0,'color':'var(--ink)'}},
        el('input',{type:'checkbox',checked:on,style:{marginTop:'3px'}}),
        el('div',{},el('div',{},label),el('div',{class:'muted',style:{'font-family':'var(--font-body)','font-style':'normal','font-size':'12px',marginTop:'4px'}},desc)))));
  });
  sec.appendChild(lw);

  // 4. Soft coupling warnings
  const emLabel={export:'出口',licensing:'许可贸易',franchise:'特许经营','contract-mfg':'合同制造',jv:'合资',acquisition:'并购',greenfield:'绿地投资'};
  const warns=[];
  if((r.light||[]).includes('borrow-boat') && ['jv','acquisition','greenfield'].includes(r.entryMode)){
    warns.push(['借船出海与重资产模式冲突','借船是轻资产起步，而'+emLabel[r.entryMode]+'属于重资源投入。两者并非不能共存（可先借船、再自建），但要确认你现在处于哪个阶段。']);
  }
  if((r.light||[]).includes('philosophy') && ['licensing','export','contract-mfg'].includes(r.entryMode)){
    warns.push(['哲学先行需要体验落地','价值观/利他品牌形象需要通过终端体验传递。'+emLabel[r.entryMode]+'模式下你对终端体验的控制较弱，价值观容易在渠道中走样。']);
  }
  if(r.oemType && r.oemType!=='OBM'){
    warns.push([r.oemType+' 模式下品牌传播由谁负责','非 OBM（自有品牌）模式下，面向 C 端的品牌广告/PR/CRM 主要由委托方负责。可做企业级 B2B 传播（能力、认证、供应链），但消费者品牌资产不会沉淀到你这里。']);
  }
  warns.forEach(([title,body])=>{
    sec.appendChild(el('div',{class:'warning',style:{'font-size':'13px'}},
      el('strong',{},title),el('div',{class:'muted',style:{marginTop:'4px'}},body)));
  });

  // 5. Political power — only for high-control entry modes
  if(['jv','acquisition','greenfield'].includes(r.entryMode)){
    sec.appendChild(el('h4',{},'政企关系与合规（Political Power）'));
    sec.appendChild(el('p',{class:'muted',style:{'font-size':'12px',margin:'0 0 6px'}},
      '合资/并购/绿地直接面对当地监管与政策环境。记录政府关系、准入许可、合规要点。'));
    sec.appendChild(UI.field('政企关系 / 合规要点',
      el('textarea',{rows:3,oninput:e=>{r.politicalPower=e.target.value;autosave()}},r.politicalPower||'')));
  }
};

Work4.oemCards = function(sec, r){
  const types=[
    ['OEM','代工生产','按委托方规格制造，无自有品牌；微笑曲线底部'],
    ['ODM','设计+制造','有设计能力，但产品贴委托方品牌'],
    ['OBM','自有品牌','从研发到品牌营销全链条，品牌资产归自己'],
    ['EMS','代工服务','电子/精密制造服务（富士康式），规模与供应链为核心能力']
  ];
  const row=el('div',{class:'grid2'});
  types.forEach(([v,label,desc])=>{
    row.appendChild(el('div',{class:'card'+(r.oemType===v?' selected':'')},
      el('label',{style:{display:'flex',gap:'8px','align-items':'center','font-family':'var(--font-display)','font-style':'italic','font-size':'16px','text-transform':'none','letter-spacing':0,'color':'var(--ink)'}},
        el('input',{type:'radio',name:'w4oem',checked:r.oemType===v,onchange:()=>{r.oemType=v;autosave();Work4.syncBodyAttrs();Work4.renderStep('route')}}), label),
      el('p',{class:'muted',style:{'font-size':'12px',margin:'6px 0 0'}},desc)
    ));
  });
  sec.appendChild(row);
};

/* ---------- PRODUCT ---------- */
Work4.render.product = function(sec){
  const p=state.work4.product;
  sec.appendChild(UI.field('产品名称', el('input',{value:p.name,oninput:e=>{p.name=e.target.value;autosave()}})));
  sec.appendChild(UI.field('产品线一句话描述', el('textarea',{rows:2,oninput:e=>{p.description=e.target.value;autosave()}},p.description)));

  // Business type (drives 7P fields)
  sec.appendChild(el('h4',{},'业务类型'));
  const bRow=el('div',{class:'grid3'});
  [['physical','实体产品'],['service','服务'],['hybrid','产品+服务']].forEach(([v,label])=>{
    bRow.appendChild(el('div',{class:'card'+(p.businessType===v?' selected':'')},
      el('label',{style:{display:'flex',gap:'8px','align-items':'center','font-family':'var(--font-display)','font-style':'italic','font-size':'16px','text-transform':'none','letter-spacing':0,'color':'var(--ink)'}},
        el('input',{type:'radio',name:'w4biz',checked:p.businessType===v,onchange:()=>{p.businessType=v;autosave();Work4.syncBodyAttrs();Work4.renderStep('product')}}), label)));
  });
  sec.appendChild(bRow);

  // SKUs
  sec.appendChild(el('h4',{},'SKU 表'));
  Work4.simpleTable(sec, p.skus, [
    {key:'name',label:'SKU 名称',type:'text'},
    {key:'specs',label:'规格',type:'text'},
    {key:'price_range',label:'价格区间',type:'text'},
    {key:'differentiator',label:'差异化',type:'text'}
  ], 'skus');

  // differentiators
  sec.appendChild(el('h4',{},'核心差异化'));
  const diff=UI.tagsInput(p.coreDifferentiators||[]);
  diff.el.querySelector('input').addEventListener('blur',()=>{p.coreDifferentiators=diff.get();autosave()});
  sec.appendChild(diff.el);
  sec.appendChild(el('button',{class:'small ghost',onclick:()=>{
    state.work3.candidates.filter(c=>c.selected).forEach(c=>{
      if(!p.coreDifferentiators.includes(c.name)) p.coreDifferentiators.push(c.name);
    });
    autosave(); Work4.renderStep('product');
  }},'从 Work 3 入选卖点导入'));

  sec.appendChild(UI.field('物理特征 / 技术规格', el('textarea',{rows:3,oninput:e=>{p.physicalFeatures=e.target.value;autosave()}},p.physicalFeatures)));
  sec.appendChild(UI.field('服务承诺（售后、保修、安装、培训）', el('textarea',{rows:2,oninput:e=>{p.serviceOffering=e.target.value;autosave()}},p.serviceOffering)));
  sec.appendChild(UI.field('技术护城河（专利、独有工艺、供应链）', el('textarea',{rows:2,oninput:e=>{p.technologyMoat=e.target.value;autosave()}},p.technologyMoat)));

  // Cross-cultural product adaptation (global only)
  const xc=el('div',{class:'x-culture'});
  xc.appendChild(el('h4',{},'跨文化产品调适'));
  xc.appendChild(UI.field('市场准入认证（CE/FCC/FDA/CCC/halal 等）', el('textarea',{rows:2,oninput:e=>{p.certifications=e.target.value;autosave()}},p.certifications||'')));
  xc.appendChild(UI.field('本地化适配（功能、审美/颜色、包装规格）', el('textarea',{rows:3,oninput:e=>{p.localization=e.target.value;autosave()}},p.localization||'')));
  xc.appendChild(UI.field('服务本地化（售后网络、本地语言、安装培训）', el('textarea',{rows:2,oninput:e=>{p.serviceLocalization=e.target.value;autosave()}},p.serviceLocalization||'')));
  sec.appendChild(xc);

  // 7P service extension (service/hybrid only)
  const xs=el('div',{class:'x-service'});
  xs.appendChild(el('h4',{},'服务业扩展（7P）'));
  xs.appendChild(UI.field('People 人员（前台、客服、技师的形象与能力）', el('textarea',{rows:2,oninput:e=>{p.people=e.target.value;autosave()}},p.people||'')));
  xs.appendChild(UI.field('Process 服务流程（交付步骤、响应时效）', el('textarea',{rows:2,oninput:e=>{p.process=e.target.value;autosave()}},p.process||'')));
  xs.appendChild(UI.field('Physical Evidence 有形展示（门店、物料、界面、评价）', el('textarea',{rows:2,oninput:e=>{p.physicalEvidence=e.target.value;autosave()}},p.physicalEvidence||'')));
  sec.appendChild(xs);

  Work4.aiBox(sec,'product',
    `你是产品营销专家。基于以下信息，为产品提炼三段卖点：功能卖点 3-5 条；情感卖点 2-3 条；服务承诺 1-2 条。每条不超过 30 字。用 Markdown。\n\nSBU:${state.work1.sbu.name}\n产品:${p.name} ${p.description}\n核心差异化:${(p.coreDifferentiators||[]).join('、')}\n价值主张:${state.work3.proposition.chosenValueText}\n目标市场:${(state.work2.markets.find(m=>m.id===state.work2.matrix.selectedMarketId)||{}).name||''}${p.certifications?`\n准入认证:${p.certifications}`:''}${p.localization?`\n本地化适配:${p.localization}`:''}`,
    text=>{ p.aiResult=text; autosave(); Work4.renderStep('product'); }
  );
  if(p.aiResult) sec.appendChild(el('div',{class:'plate'},
    el('span',{class:'plate-label'},'PRODUCT COPY'),
    el('div',{style:{'white-space':'pre-wrap'}},p.aiResult)));
};

/* ---------- PRICE ---------- */
Work4.render.price = function(sec){
  const p=state.work4.price;
  sec.appendChild(el('h4',{},'定价策略'));
  const strategies=[
    ['cost-plus','成本加成','在成本基础上增加固定比例；适合成熟品类、价格敏感客户。'],
    ['value','价值定价','基于客户感知价值；适合差异化强、情感价值高的品牌。'],
    ['competitive','竞争定价','紧贴主要竞品；适合同质化高、竞争激烈的市场。'],
    ['penetration','渗透定价','低价快速抢占份额；适合网络效应强的品类。'],
    ['skimming','撇脂定价','高价收割早期用户；适合创新强、稀缺供给。']
  ];
  const row=el('div',{class:'grid3'});
  strategies.forEach(([v,label,desc])=>{
    const card=el('div',{class:'card'+(p.strategy===v?' selected':'')},
      el('label',{style:{display:'flex',gap:'8px','align-items':'center','font-family':'var(--font-display)','font-style':'italic','font-size':'16px','text-transform':'none','letter-spacing':0,'color':'var(--ink)'}},
        el('input',{type:'radio',name:'prStrat',checked:p.strategy===v,onchange:()=>{p.strategy=v;autosave();Work4.renderStep('price')}}), label),
      el('p',{class:'muted',style:{'font-size':'12px'}},desc)
    );
    row.appendChild(card);
  });
  sec.appendChild(row);
  sec.appendChild(UI.field('选择理由', el('textarea',{rows:2,oninput:e=>{p.strategyNote=e.target.value;autosave()}},p.strategyNote)));

  sec.appendChild(el('h4',{},'价格档位'));
  Work4.simpleTable(sec, p.tiers, [
    {key:'name',label:'档位名',type:'text'},
    {key:'targetSegment',label:'目标客群',type:'text'},
    {key:'price',label:'价格',type:'number'},
    {key:'unit',label:'单位/币种',type:'text'},
    {key:'notes',label:'备注',type:'text'}
  ], 'tiers');

  sec.appendChild(el('h4',{},'渠道差异化定价'));
  Work4.simpleTable(sec, p.channelPricing, [
    {key:'channel',label:'渠道',type:'text'},
    {key:'priceAdjustment',label:'价格调整',type:'text'},
    {key:'rationale',label:'理由',type:'text'}
  ], 'channelPricing');

  sec.appendChild(el('h4',{},'促销节奏'));
  Work4.simpleTable(sec, p.promotions, [
    {key:'occasion',label:'节点',type:'text'},
    {key:'discount',label:'折扣/机制',type:'text'},
    {key:'period',label:'时段',type:'text'}
  ], 'promotions');

  sec.appendChild(UI.field('竞品价格信息（粘贴）', el('textarea',{rows:3,oninput:e=>{p.competitorPrices=e.target.value;autosave()}},p.competitorPrices)));

  const xc=el('div',{class:'x-culture'});
  xc.appendChild(el('h4',{},'跨文化定价'));
  xc.appendChild(UI.field('购买力 / PPP 校准', el('textarea',{rows:2,placeholder:'目标市场可支配收入、价格敏感度、与母国市场的价差',oninput:e=>{p.ppp=e.target.value;autosave()}},p.ppp||'')));
  xc.appendChild(UI.field('数字 / 尾数 / 税（吉庆数字、.99 习惯、关税增值税）', el('textarea',{rows:2,oninput:e=>{p.pricingNumbers=e.target.value;autosave()}},p.pricingNumbers||'')));
  xc.appendChild(UI.field('汇率敏感度 / 本币结算', el('textarea',{rows:2,oninput:e=>{p.fxSensitivity=e.target.value;autosave()}},p.fxSensitivity||'')));
  sec.appendChild(xc);

  if(p.tiers.length){
    sec.appendChild(el('h4',{},'价格档位图'));
    const plate=el('section',{class:'plate'},el('span',{class:'plate-label'},'F5 · TICK ROWS · 价格档位'));
    renderBarChart(plate, p.tiers.filter(t=>t.price).map(t=>({label:t.name,value:Number(t.price)})),{unit:''});
    sec.appendChild(plate);
  }

  Work4.aiBox(sec,'price',
    `你是定价策略顾问。业务"${state.work1.sbu.name}"面向"${(state.work2.markets.find(m=>m.id===state.work2.matrix.selectedMarketId)||{}).name||''}"，采用${p.strategy||'（未选）'}策略。竞品价格：${p.competitorPrices||'未提供'}。价值主张：${state.work3.proposition.chosenValueText}。价格档位：${JSON.stringify(p.tiers)}。请给出：1) 推荐价格区间及理由；2) 各档位建议定价；3) 渠道差异化建议；4) 促销节奏。用 Markdown。`,
    text=>{ p.aiResult=text; autosave(); Work4.renderStep('price'); }
  );
  if(p.aiResult) sec.appendChild(el('div',{class:'plate'},el('span',{class:'plate-label'},'PRICE STRATEGY'),el('div',{style:{'white-space':'pre-wrap'}},p.aiResult)));
};

/* ---------- PLACE ---------- */
Work4.render.place = function(sec){
  const p=state.work4.place;
  sec.appendChild(el('h4',{},'线上渠道'));
  sec.appendChild(UI.field('自营（官网、独立站、App、小程序等）', Work4.tagBox(p.onlineSelf, v=>{p.onlineSelf=v;autosave()})));
  sec.appendChild(UI.field('第三方平台（Amazon、TikTok Shop、Shopee、Lazada 等）', Work4.tagBox(p.onlineThird, v=>{p.onlineThird=v;autosave()})));
  sec.appendChild(UI.field('线上备注', el('textarea',{rows:2,oninput:e=>{p.onlineNotes=e.target.value;autosave()}},p.onlineNotes)));

  sec.appendChild(el('h4',{},'线下渠道'));
  sec.appendChild(UI.field('直营门店 / 专柜', Work4.tagBox(p.offlineDirect, v=>{p.offlineDirect=v;autosave()})));
  sec.appendChild(UI.field('经销商 / 代理商', Work4.tagBox(p.offlineDistrib, v=>{p.offlineDistrib=v;autosave()})));
  sec.appendChild(UI.field('超市 / KA / 零售', Work4.tagBox(p.offlineRetail, v=>{p.offlineRetail=v;autosave()})));
  sec.appendChild(UI.field('线下备注', el('textarea',{rows:2,oninput:e=>{p.offlineNotes=e.target.value;autosave()}},p.offlineNotes)));

  sec.appendChild(UI.field('关键合作伙伴', Work4.tagBox(p.keyPartners, v=>{p.keyPartners=v;autosave()})));
  sec.appendChild(UI.field('渠道激励机制', el('textarea',{rows:3,oninput:e=>{p.channelIncentives=e.target.value;autosave()}},p.channelIncentives)));

  const xc=el('div',{class:'x-culture'});
  xc.appendChild(el('h4',{},'本地渠道关系'));
  xc.appendChild(UI.field('本地经销商/代理合作模式、账期、返点与关系维护',
    el('textarea',{rows:3,oninput:e=>{p.localChannelRelations=e.target.value;autosave()}},p.localChannelRelations||'')));
  sec.appendChild(xc);

  // channel structure
  sec.appendChild(el('h4',{},'渠道结构（销售占比）'));
  if(!p.structure.length){
    p.structure=[
      {name:'线上', children:[{name:'自营',share:20},{name:'第三方平台',share:80}]},
      {name:'线下', children:[{name:'直营',share:30},{name:'经销商',share:50},{name:'KA',share:20}]}
    ];
  }
  const table=el('div',{class:'table-wrap'});
  const t=el('table',{class:'data'});
  t.innerHTML='<thead><tr><th>一级渠道</th><th>二级渠道</th><th style="width:100px">占比 %</th><th></th></tr></thead>';
  const tb=el('tbody');
  p.structure.forEach((grp,gi)=>{
    grp.children.forEach((ch,ci)=>{
      const tr=el('tr');
      if(ci===0) tr.appendChild(el('td',{rowspan:grp.children.length,style:{'font-style':'italic','vertical-align':'top'}},
        el('input',{value:grp.name,oninput:e=>{grp.name=e.target.value;autosave()}})));
      tr.appendChild(el('td',{},el('input',{value:ch.name,oninput:e=>{ch.name=e.target.value;autosave()}})));
      tr.appendChild(el('td',{},el('input',{type:'number',min:0,max:100,value:ch.share,oninput:e=>{ch.share=parseInt(e.target.value)||0;autosave()}})));
      tr.appendChild(el('td',{},el('button',{class:'ghost small',onclick:()=>{grp.children.splice(ci,1);autosave();Work4.renderStep('place')}},'×')));
      tb.appendChild(tr);
    });
  });
  t.appendChild(tb); table.appendChild(t); sec.appendChild(table);
  sec.appendChild(el('div',{class:'row'},
    el('button',{class:'small',onclick:()=>{p.structure[0].children.push({name:'',share:0});autosave();Work4.renderStep('place')}},'+ 线上二级'),
    el('button',{class:'small',onclick:()=>{p.structure[1].children.push({name:'',share:0});autosave();Work4.renderStep('place')}},'+ 线下二级')
  ));

  // charts
  if(p.structure.length){
    sec.appendChild(el('h4',{},'渠道占比图'));
    const plate=el('section',{class:'plate'},el('span',{class:'plate-label'},'G7 · TREE LR / F13 · NESTED TREEMAP'));
    Work4.renderChannelTree(plate, p.structure);
    sec.appendChild(plate);
  }

  Work4.aiBox(sec,'place',
    `你是渠道策略专家。业务"${state.work1.sbu.name}"进入"${(state.work2.markets.find(m=>m.id===state.work2.matrix.selectedMarketId)||{}).name||''}"，产品 ${state.work4.product.name||''}，价格 ${JSON.stringify(state.work4.price.tiers)}。请给出：1) 推荐渠道组合及线上/线下比例；2) 各渠道优先级与进入顺序；3) 关键合作伙伴类型；4) 渠道激励建议。用 Markdown。最后附上渠道结构 JSON：[{"name":"线上","children":[{"name":"...","share":40}]},{"name":"线下","children":[...]}]，一级 share 总和 100。`,
    text=>{
      p.aiResult=text; autosave();
      // try parse embedded JSON
      const m=text.match(/```json\s*([\s\S]+?)```/)||text.match(/\[\s*\{[\s\S]+\}\s*\]/);
      if(m){ try{ const arr=JSON.parse(m[1]||m[0]); if(Array.isArray(arr)){ p.structure=arr; } }catch{} }
      Work4.renderStep('place');
    }
  );
  if(p.aiResult) sec.appendChild(el('div',{class:'plate'},el('span',{class:'plate-label'},'PLACE STRATEGY'),el('div',{style:{'white-space':'pre-wrap'}},p.aiResult)));
};

Work4.renderChannelTree=function(container, structure){
  const W=640,H=40+structure.reduce((a,g)=>a+Math.max(1,g.children.length)*34,0);
  let svg=`<svg class="chart" viewBox="0 0 ${W} ${H}">`;
  let y=20;
  structure.forEach((grp,gi)=>{
    const gh=Math.max(1,grp.children.length)*34;
    const gx=80, gy=y+gh/2;
    svg+=`<rect x="20" y="${y}" width="120" height="${gh}" fill="#EDE9E0" stroke="#3A190F"/>`;
    svg+=`<text x="80" y="${gy+4}" text-anchor="middle" font-family="Playfair Display" font-style="italic" font-size="14" fill="#3A190F">${esc(grp.name)}</text>`;
    grp.children.forEach((ch,ci)=>{
      const cy=y+ci*34+17;
      const cw=10+String(ch.share)+4;
      svg+=`<line x1="140" y1="${gy}" x2="220" y2="${cy}" stroke="#D4CFC4"/>`;
      const barW=(ch.share/100)*260;
      svg+=`<rect x="220" y="${cy-10}" width="260" height="20" fill="#EDE9E0" stroke="#D4CFC4"/>`;
      svg+=`<rect x="220" y="${cy-10}" width="${barW}" height="20" fill="#3A190F"/>`;
      svg+=`<text x="490" y="${cy+4}" font-family="JetBrains Mono" font-size="11" fill="#1A1A1A">${esc(ch.name)} ${ch.share}%</text>`;
    });
    y+=gh+10;
  });
  svg+=`</svg>`;
  container.insertAdjacentHTML('beforeend', svg);
};

/* ---------- PROMOTION ---------- */
Work4.render.promotion = function(sec){
  const p=state.work4.promotion;
  const r=state.work4.route;
  if(r.oemType && r.oemType!=='OBM'){
    sec.appendChild(el('div',{class:'warning',style:{'font-size':'13px'}},
      el('strong',{},r.oemType+' 模式提示：'),
      el('span',{},' 此模式下面向 C 端的品牌广告/PR 主要由委托方负责。下表内容可用于企业级 B2B 传播（能力、认证、供应链），消费者品牌资产不会沉淀到本企业。')));
  }
  sec.appendChild(UI.field('传播主题（一句话）', el('input',{value:p.theme,oninput:e=>{p.theme=e.target.value;autosave()}})));

  sec.appendChild(el('h4',{},'广告 / 媒介投放'));
  Work4.simpleTable(sec, p.advertising, [
    {key:'media',label:'媒介',type:'text'},
    {key:'budgetShare',label:'预算占比%',type:'number'},
    {key:'message',label:'核心信息',type:'text'},
    {key:'kpi',label:'KPI',type:'text'}
  ], 'advertising');

  // budget chart
  if(p.advertising.length && p.advertising.some(a=>a.budgetShare)){
    sec.appendChild(el('h4',{},'媒介预算'));
    const plate=el('section',{class:'plate'},el('span',{class:'plate-label'},'L14 · HUNDRED FIELD · 媒介预算'));
    const total=p.advertising.reduce((a,b)=>a+(Number(b.budgetShare)||0),0);
    const seg=p.advertising.filter(a=>a.budgetShare).map((a,i)=>({label:a.media, count:Math.round(Number(a.budgetShare)/total*100), color:['#3A190F','#6B3B2A','#8D7971','#B2A49C','#D4CFC4','#684F45'][i%6]}));
    const hf=el('div'); renderHundredField(hf, seg);
    plate.appendChild(hf);
    sec.appendChild(plate);
  }

  sec.appendChild(el('h4',{},'公关事件'));
  Work4.simpleTable(sec, p.pr, [
    {key:'event',label:'事件',type:'text'},
    {key:'timing',label:'时机',type:'text'},
    {key:'expectedReach',label:'预期触达',type:'text'}
  ], 'pr');

  sec.appendChild(el('h4',{},'销售促进'));
  Work4.simpleTable(sec, p.salesPromotion, [
    {key:'tactic',label:'手段',type:'text'},
    {key:'mechanic',label:'机制',type:'text'},
    {key:'period',label:'时段',type:'text'}
  ], 'salesPromotion');

  sec.appendChild(el('h4',{},'CRM 与复购'));
  sec.appendChild(el('div',{class:'grid2'},
    UI.field('CRM 工具', el('input',{value:p.crm.tool,oninput:e=>{p.crm.tool=e.target.value;autosave()}})),
    UI.field('会员体系', el('input',{value:p.crm.membership,oninput:e=>{p.crm.membership=e.target.value;autosave()}}))
  ));
  sec.appendChild(UI.field('复购激励', el('input',{value:p.crm.repurchase,oninput:e=>{p.crm.repurchase=e.target.value;autosave()}})));
  sec.appendChild(UI.field('CRM 备注', el('textarea',{rows:2,oninput:e=>{p.crm.notes=e.target.value;autosave()}},p.crm.notes)));
  sec.appendChild(UI.field('内容策略（KOL/KOC、UGC、品牌叙事节奏）', el('textarea',{rows:3,oninput:e=>{p.contentStrategy=e.target.value;autosave()}},p.contentStrategy)));

  const xc=el('div',{class:'x-culture'});
  xc.appendChild(el('h4',{},'跨文化传播'));
  xc.appendChild(UI.field('高/低语境（高语境重隐喻关系画面，低语境重直白事实）', el('textarea',{rows:2,oninput:e=>{p.context=e.target.value;autosave()}},p.context||'')));
  xc.appendChild(UI.field('禁忌与本地节日（宗教、颜色、符号、性别表达、营销节点）', el('textarea',{rows:2,oninput:e=>{p.taboos=e.target.value;autosave()}},p.taboos||'')));
  xc.appendChild(UI.field('KOL/KOC 分层（头部/腰部/素人及平台选择）', el('textarea',{rows:2,oninput:e=>{p.kolTiers=e.target.value;autosave()}},p.kolTiers||'')));
  xc.appendChild(UI.field('语言/翻译/本地代言', el('textarea',{rows:2,oninput:e=>{p.language=e.target.value;autosave()}},p.language||'')));
  sec.appendChild(xc);

  Work4.aiBox(sec,'promotion',
    `你是整合营销传播专家。"${state.work1.sbu.name}"进入"${(state.work2.markets.find(m=>m.id===state.work2.matrix.selectedMarketId)||{}).name||''}"，价值主张"${state.work3.proposition.chosenValueText}"，品牌人格 ${state.work3.proposition.mbti}，slogan"${state.work3.proposition.chosenSlogan}"，渠道 ${JSON.stringify(state.work4.place.structure)}。请给出：1) 传播主题；2) 媒介组合及预算占比；3) 内容节奏（上市/成长/成熟期）；4) 2-3 个公关事件创意；5) 销售促进机制；6) CRM 与复购激励。用 Markdown。媒介组合部分用 JSON 数组：[{"media":"","share":0,"message":"","kpi":""}]，share 总和 100。`,
    text=>{
      p.aiResult=text; autosave();
      const m=text.match(/```json\s*([\s\S]+?)```/)||text.match(/\[\s*\{[\s\S]+\}\s*\]/);
      if(m){ try{ const arr=JSON.parse(m[1]||m[0]); if(Array.isArray(arr)){ p.advertising=arr.map(a=>({...a,budgetShare:a.share})); } }catch{} }
      Work4.renderStep('promotion');
    }
  );
  if(p.aiResult) sec.appendChild(el('div',{class:'plate'},el('span',{class:'plate-label'},'PROMOTION PLAN'),el('div',{style:{'white-space':'pre-wrap'}},p.aiResult)));
};

/* ---------- SUMMARY ---------- */
Work4.render.summary = function(sec){
  const p=state.work4, r=p.route;
  const global = r.scope!=='domestic';
  sec.appendChild(el('h3',{},'路径与 4P 一致性核对'));
  const checks=[
    [global?'出海范围已确定？':'市场范围已确定？', !!r.scope],
    [global?'进入模式已选择？':'微笑曲线位置已判断？', global ? !!r.entryMode : !!r.oemType],
    ['产品卖点是否支撑价值主张？', p.product.coreDifferentiators.length>0 && !!state.work3.proposition.chosenValueText],
    ['定价是否匹配目标客群？', !!p.price.strategy && p.price.tiers.length>0],
    ['渠道是否覆盖目标客群聚集地？', p.place.onlineSelf.length+p.place.onlineThird.length+p.place.offlineDirect.length+p.place.offlineRetail.length>0],
    ['传播信息是否一致？', !!p.promotion.theme && p.promotion.advertising.length>0]
  ];
  if(global && ['jv','acquisition','greenfield'].includes(r.entryMode)){
    checks.push(['政企关系/合规已记录？', !!r.politicalPower]);
  }
  checks.forEach(([q,ok])=>{
    sec.appendChild(el('div',{style:{display:'flex',gap:'10px',alignItems:'center',padding:'8px 0',borderBottom:'1px solid var(--line)'}},
      el('span',{class:'tag '+(ok?'maroon':'')}, ok?'达成':'待补'),
      el('span',{},q)));
  });

  sec.appendChild(el('hr',{class:'rule'}));
  // Route plate
  sec.appendChild(el('h3',{},'出海路径'));
  sec.appendChild(el('div',{class:'plate'},el('span',{class:'plate-label'},'ROUTE'),
    el('div',{style:{'white-space':'pre-wrap'}}, Work4.summaryText('route'))));

  [['product','产品'],['price','价格'],['place','渠道'],['promotion','促销']].forEach(([k,label])=>{
    sec.appendChild(el('h3',{},label));
    sec.appendChild(el('div',{class:'plate'},el('span',{class:'plate-label'},(p[k].aiResult?'AI ':'')+label.toUpperCase()),
      el('div',{style:{'white-space':'pre-wrap'}}, p[k].aiResult||Work4.summaryText(k))));
  });
  sec.appendChild(el('div',{class:'row',style:{'margin-top':'20px'}},
    el('button',{class:'primary',onclick:()=>{
      state.work5.ch4_mix.route=Work4.summaryText('route');
      state.work5.ch4_mix.product=Work4.summaryText('product');
      state.work5.ch4_mix.price=Work4.summaryText('price');
      state.work5.ch4_mix.place=Work4.summaryText('place');
      state.work5.ch4_mix.promotion=Work4.summaryText('promotion');
      autosave(); showToast('已同步到 Work 5');
    }},'同步到 Work 5'),
    el('button',{onclick:()=>{
      const md=['# 营销组合汇总','',
        '## 出海路径',Work4.summaryText('route'),'',
        '## 产品',Work4.summaryText('product'),'',
        '## 价格',Work4.summaryText('price'),'',
        '## 渠道',Work4.summaryText('place'),'',
        '## 促销',Work4.summaryText('promotion')].join('\n');
      navigator.clipboard.writeText(md); showToast('已复制到剪贴板');
    }},'复制汇总')
  ));
};
Work4.summaryText=function(k){
  const p=state.work4[k];
  if(k==='route'){
    const r=state.work4.route;
    if(r.scope==='domestic') return [
      '市场范围：国内（本阶段不出海）',
      r.oemType?`微笑曲线位置：${r.oemType}`:''
    ].filter(Boolean).join('\n');
    const emLabel={export:'出口',licensing:'许可证贸易',franchise:'特许经营','contract-mfg':'合同制造',jv:'合资',acquisition:'并购',greenfield:'绿地投资'};
    const lightLabel={'single-point':'单点突破','borrow-boat':'借船出海',philosophy:'哲学先行'};
    return [
      '市场范围：出海/跨国经营',
      r.oemType?`微笑曲线位置：${r.oemType}`:'',
      r.entryMode?`进入模式：${emLabel[r.entryMode]||r.entryMode}`:'',
      (r.light||[]).length?`轻量化打法：${r.light.map(x=>lightLabel[x]||x).join('、')}`:'',
      r.politicalPower?`政企关系/合规：${r.politicalPower}`:''
    ].filter(Boolean).join('\n');
  }
  if(p.aiResult) return p.aiResult;
  if(k==='product') return [
    p.name?`产品：${p.name}（${p.description}）`:'',
    `业务类型：${{physical:'实体产品',service:'服务',hybrid:'产品+服务'}[p.businessType]||'实体产品'}`,
    p.coreDifferentiators.length?`核心差异化：${p.coreDifferentiators.join('、')}`:'',
    p.skus.length?`SKU：\n${p.skus.map(s=>`- ${s.name}：${s.specs}，${s.price_range}`).join('\n')}`:'',
    p.physicalFeatures?`物理特征：${p.physicalFeatures}`:'',
    p.serviceOffering?`服务承诺：${p.serviceOffering}`:'',
    p.technologyMoat?`技术护城河：${p.technologyMoat}`:'',
    p.certifications?`准入认证：${p.certifications}`:'',
    p.localization?`本地化适配：${p.localization}`:'',
    p.serviceLocalization?`服务本地化：${p.serviceLocalization}`:'',
    p.people?`人员：${p.people}`:'',
    p.process?`流程：${p.process}`:'',
    p.physicalEvidence?`有形展示：${p.physicalEvidence}`:''
  ].filter(Boolean).join('\n');
  if(k==='price') return [
    p.strategy?`定价策略：${p.strategy}（${p.strategyNote}）`:'',
    p.tiers.length?`价格档位：\n${p.tiers.map(t=>`- ${t.name}（${t.targetSegment}）：${t.price} ${t.unit||''}`).join('\n')}`:'',
    p.channelPricing.length?`渠道差异：\n${p.channelPricing.map(c=>`- ${c.channel}：${c.priceAdjustment}（${c.rationale}）`).join('\n')}`:'',
    p.ppp?`购买力/PPP：${p.ppp}`:'',
    p.pricingNumbers?`数字/尾数/税：${p.pricingNumbers}`:'',
    p.fxSensitivity?`汇率敏感度：${p.fxSensitivity}`:''
  ].filter(Boolean).join('\n');
  if(k==='place') return [
    `线上自营：${(p.onlineSelf||[]).join('、')}`,
    `线上第三方：${(p.onlineThird||[]).join('、')}`,
    `线下直营：${(p.offlineDirect||[]).join('、')}`,
    `经销商：${(p.offlineDistrib||[]).join('、')}`,
    `KA 零售：${(p.offlineRetail||[]).join('、')}`,
    p.keyPartners.length?`关键伙伴：${p.keyPartners.join('、')}`:'',
    p.channelIncentives?`激励机制：${p.channelIncentives}`:'',
    p.localChannelRelations?`本地渠道关系：${p.localChannelRelations}`:''
  ].filter(Boolean).join('\n');
  if(k==='promotion') return [
    p.theme?`传播主题：${p.theme}`:'',
    p.advertising.length?`媒介组合：\n${p.advertising.map(a=>`- ${a.media} ${a.budgetShare}% — ${a.message}（KPI: ${a.kpi}）`).join('\n')}`:'',
    p.pr.length?`公关事件：\n${p.pr.map(e=>`- ${e.event}（${e.timing}）：${e.expectedReach}`).join('\n')}`:'',
    p.salesPromotion.length?`销售促进：\n${p.salesPromotion.map(s=>`- ${s.tactic}：${s.mechanic}（${s.period}）`).join('\n')}`:'',
    p.contentStrategy?`内容策略：${p.contentStrategy}`:'',
    p.context?`高低语境：${p.context}`:'',
    p.taboos?`禁忌与节日：${p.taboos}`:'',
    p.kolTiers?`KOL/KOC 分层：${p.kolTiers}`:'',
    p.language?`语言/翻译：${p.language}`:'',
    p.crm.membership?`CRM：${p.crm.tool} / ${p.crm.membership} / ${p.crm.repurchase}`:''
  ].filter(Boolean).join('\n');
  return '';
};

/* ---------- HELPERS ---------- */
Work4.simpleTable=function(sec, arr, cols, keyName){
  const table=el('div',{class:'table-wrap'});
  const t=el('table',{class:'data'});
  t.innerHTML='<thead><tr>'+cols.map(c=>`<th>${c.label}</th>`).join('')+'<th style="width:50px"></th></tr></thead>';
  const tb=el('tbody');
  arr.forEach((row,i)=>{
    const tr=el('tr');
    cols.forEach(c=>{
      const td=el('td');
      const inp=document.createElement(c.type==='textarea'?'textarea':'input');
      if(c.type!=='textarea') inp.type=c.type||'text';
      inp.value=row[c.key]??'';
      inp.addEventListener('input', e=>{
        row[c.key]= c.type==='number'? parseFloat(e.target.value)||null : e.target.value;
        autosave();
      });
      td.appendChild(inp); tr.appendChild(td);
    });
    tr.appendChild(el('td',{},el('button',{class:'ghost small',onclick:()=>{arr.splice(i,1);autosave();Work4.renderStep(Work4.currentStepId());}},'删除')));
    tb.appendChild(tr);
  });
  t.appendChild(tb); table.appendChild(t); sec.appendChild(table);
  sec.appendChild(el('button',{class:'small',onclick:()=>{
    const blank={}; cols.forEach(c=>blank[c.key]= c.type==='number'?null:'');
    arr.push(blank);
    autosave(); Work4.renderStep(Work4.currentStepId());
  }},'+ 添加'));
};
Work4.currentStepId=function(){
  const t=document.querySelector('.subtabs .subtab.active');
  return t?t.dataset.step:null;
};
Work4.tagBox=function(arr, onChange){
  const ti=UI.tagsInput(arr||[]);
  ti.el.querySelector('input').addEventListener('blur',()=>onChange(ti.get()));
  return ti.el;
};
Work4.aiBox=function(sec,key,userPrompt,onResult){
  const ai=el('div',{class:'ai-box'});
  const btn=el('button',{class:'primary',onclick:()=>{
    API.aiButton({
      button:btn,container:ai,jsonMode:false,
      buildPrompt:()=>[{role:'user',content:userPrompt}],
      onResult:(r,raw)=>{ onResult(typeof r==='string'?r:raw); }
    });
  }},'用 AI 起草');
  ai.appendChild(btn); sec.appendChild(ai);
};
Work4.refreshDynamic=function(){};

Work4.exportMd = function(){
  return `\n## IV. 营销组合\n\n### 出海路径\n${Work4.summaryText('route')}\n\n### 产品\n${Work4.summaryText('product')}\n\n### 价格\n${Work4.summaryText('price')}\n\n### 渠道\n${Work4.summaryText('place')}\n\n### 促销\n${Work4.summaryText('promotion')}\n`;
};
