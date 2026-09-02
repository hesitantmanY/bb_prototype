/* ============================================================
   WORKSHOP 2 — 目标市场选择（3 tab · schemaVersion 2）
   Steps: framework / evaluate / decision
   对齐课程 2.3 三活动：构建评估体系 / 评估候选市场 / 矩阵选市场。
   Delphi = Hybrid 2（论文 AI-Human Hybrids for Marketing Research, JM 2025）：
   1 call 招聘 + 5 call 深 persona（RAG + few-shot）+ user 主持 + 可选 1 call 收敛。
   所有 AI 按钮走 docs/lib/ai_context.js 的最小上下文包 + 「消息设置」。
   ============================================================ */
Work2.steps = [
  {id:'framework', label:'1. 构建评估体系'},
  {id:'evaluate', label:'2. 评估候选市场'},
  {id:'decision', label:'3. 矩阵 + 三档决策'}
];
// 每步的下游步骤；末步（decision）无下游，出口走跨坊 CTA（2026-08-28 统一步间 CTA）
Work2.NEXT_STEPS = { framework:'evaluate', evaluate:'decision' };

/* 4×2 默认指标模板（默认可覆写）。一级默认权重 0.25，二级 = 0.5（一级内归一化）。 */
Work2.INDICATOR_TEMPLATE = {
  attractiveness: [
    ['经济', ['市场规模 / 中高端容量', '经济景气度 / 消费意愿']],
    ['政治法律', ['出海政策 / 贸易摩擦', '认证要求 / 合规成本']],
    ['社会文化', ['目标客群需求强度', 'Hofstede 文化维度匹配度']],
    ['风险', ['汇率 / 回款', '物流时效 / 库存']]
  ],
  competitiveness: [
    ['市场信息', ['需求数据可获取性', '竞品数据可监测性']],
    ['营销渠道', ['电商平台成熟度', 'KOL / 合作渠道']],
    ['认证合规', ['既有认证可复用度', '法律服务可获取性']],
    ['产品品牌', ['客户基础可迁移性', 'C 端品牌能力起点']]
  ]
};
Work2.defaultTemplate = function(axis){
  return Work2.INDICATOR_TEMPLATE[axis].map(([name, inds])=>({
    id: uid('cat'), name, weight: 0.25,
    indicators: inds.map(n=>({id:uid('ind'), name:n, rubric:{high:'',mid:'',low:''}, weight:0.5, support:0, source:'template'}))
  }));
};

Work2.defaultData = () => ({
  // ===== Tab 1: 构建评估体系 =====
  candidates: [],            // {id, name, reason, source}
  screening: { criteria: [] }, // {id, name, source, kind:'user'|'ai'}
  retained: [],              // {id, name, region, population, gdpPerCapita, notes, source}
  attractiveness: { categories: Work2.defaultTemplate('attractiveness') },
  competitiveness: { categories: Work2.defaultTemplate('competitiveness') },
  delphi: {
    // === Hybrid 2 升级版 ===
    recruitment: { perspectives: [] },   // 招聘阶段输出
    personas: [],                        // persona 并行阶段输出（动态生成）
    userHosted: true,                    // User 主持阶段标志
    finalWeights: null,                  // 收敛展示记录（回填后释放为 null）
    summary: '',
    status: 'idle',                      // idle|recruiting|personas|hosted|converging|done
    phase: null,                         // checkpoint
    drifted: false,                      // 收敛后 1.4 权重被手改 → 提示偏离收敛
    // === 旧字段（保留兼容，不再使用） ===
    panel: [], round1: null, round2: null, synthesis: null, finalSynthesis: null, weights: null
  },
  // ===== Tab 2: 评估候选市场 =====
  scoring: {},   // marketId: { indId: {score, evidence, url, source:'user'|'ai'} }
  // ===== Tab 3: 矩阵 + 三档决策 =====
  matrix: { xCut: null, yCut: null, notes: '' },
  decision: {
    explanations: {},   // marketName -> 为什么落在这个象限
    tier1: { marketId: null, rationale: '', resourcesPct: 80, milestones: [], reEvalTrigger: '' },
    tier2: { marketIds: [], observationMetrics: [], reEvalTrigger: '' },
    tier3: { marketIds: [], reEvalTrigger: '' }
  },
  // ===== 跨 tab 元信息 =====
  meta: { schemaVersion: 2, work1Linked: false },
  _pipeDone: []   // Tab 1 主流水线断点
});

/* ---------- 数据迁移（schemaVersion 1 → 2） ---------- */
Work2.BUCKET_KEYWORDS = {
  attractiveness: {
    '经济': ['经济','规模','增长','容量','消费','GDP'],
    '政治法律': ['政治','政策','法规','法律','监管','贸易','准入'],
    '社会文化': ['文化','社会','人口','语言','宗教','Hofstede'],
    '风险': ['风险','汇率','回款','物流','库存','波动']
  },
  competitiveness: {
    '市场信息': ['信息','数据','调研','监测'],
    '营销渠道': ['渠道','电商','KOL','分销','平台'],
    '认证合规': ['认证','合规','资质','法务'],
    '产品品牌': ['品牌','产品','客户','认知']
  }
};
Work2.bucketIndicatorsByCategory = function(inds, axis){
  const defaultNames = axis === 'attractiveness'
    ? ['经济', '政治法律', '社会文化', '风险']
    : ['市场信息', '营销渠道', '认证合规', '产品品牌'];
  const kw = Work2.BUCKET_KEYWORDS[axis] || {};
  const cats = defaultNames.map(n=>({ id: uid('cat'), name: n, weight: 0.25, indicators: [] }));
  // 按指标名模糊匹配归类（关键词 → 前缀包含）；不匹配的归到第一个
  (inds||[]).forEach(ind=>{
    const nm = ind.name || '';
    let idx = cats.findIndex(c => (kw[c.name]||[]).some(k => nm.includes(k)));
    if(idx < 0) idx = cats.findIndex(c => nm.includes(c.name) || c.name.includes(nm.slice(0,2)));
    cats[idx>=0?idx:0].indicators.push({
      id: ind.id || uid('ind'), name: nm,
      rubric: ind.rubric || {high:'',mid:'',low:''},
      weight: 0.5, support: ind.support||0, source: ind.source||'user'
    });
  });
  cats.forEach(c=>{
    const n = Math.max(1, c.indicators.length);
    c.indicators.forEach(i=>{ i.weight = 1/n; });
  });
  return cats;
};
Work2.migrateWork2 = function(old){
  if(!old) return old;
  // 旧 schema 特征（markets / scope / 平铺 indicators）。注意：mergeWithDefaults
  // 会把新默认值的 meta.schemaVersion=2 混入旧数据，因此不能只看 meta。
  const isV1 = Array.isArray(old.markets) || !!old.scope ||
    Array.isArray(old.attractiveness?.indicators) || Array.isArray(old.competitiveness?.indicators);
  if(!isV1) return old;
  const migrated = {
    ...old,
    candidates: (old.markets||[]).slice(3).map(m=>({id:m.id, name:m.name, reason:m.notes||'', source:'user'})),
    screening: { criteria: [] },
    retained: (old.markets||[]).slice(0,3),
    attractiveness: { categories: Work2.bucketIndicatorsByCategory(old.attractiveness?.indicators||[], 'attractiveness') },
    competitiveness: { categories: Work2.bucketIndicatorsByCategory(old.competitiveness?.indicators||[], 'competitiveness') },
    delphi: {
      recruitment: { perspectives: [] }, personas: [], userHosted: true,
      finalWeights: old.delphi?.weights || null,
      summary: old.delphi?.finalSynthesis || '',
      status: old.delphi?.weights ? 'done' : 'idle', phase: null,
      panel: old.delphi?.panel || [], round1: old.delphi?.round1 || null, round2: old.delphi?.round2 || null,
      synthesis: old.delphi?.synthesis || null, finalSynthesis: old.delphi?.finalSynthesis || null,
      weights: old.delphi?.weights || null
    },
    scoring: {},
    matrix: { xCut: old.matrix?.xCut ?? null, yCut: old.matrix?.yCut ?? null, notes: old.matrix?.notes || '' },
    decision: {
      explanations: {},
      tier1: {
        marketId: old.matrix?.selectedMarketId || null,
        rationale: old.decision?.rationale || '',
        resourcesPct: 80,
        milestones: old.decision?.nextSteps ? [old.decision.nextSteps] : [],
        reEvalTrigger: ''
      },
      tier2: { marketIds: [], observationMetrics: [], reEvalTrigger: '' },
      tier3: { marketIds: [], reEvalTrigger: '' }
    },
    meta: { schemaVersion: 2, work1Linked: false },
    _pipeDone: []
  };
  delete migrated.markets;
  delete migrated.scope;
  if(typeof showToast === 'function') showToast('Workshop 2 已重构，老数据已迁移，请复核。', 3200);
  return migrated;
};

/* Work 2 v2 读取统一 helper（work3 上下文 / work4 上下文条 / masthead 摘要共用）：
   decision.tier1.marketId 存在 → 新 schema；否则回退旧 matrix.selectedMarketId + markets。 */
Work2.selectedTiers = function(){
  const w2 = (typeof state !== 'undefined' && state) ? state.work2 : null;
  if(!w2) return { v: 0, tier1: null, tier2: [] };
  const pools = [w2.retained||[], w2.markets||[], w2.candidates||[]];
  const findM = id => { for(const p of pools){ const m = p.find(x=>x.id===id); if(m) return m; } return null; };
  if(w2.decision?.tier1?.marketId){
    const t1 = findM(w2.decision.tier1.marketId);
    const t2 = (w2.decision.tier2?.marketIds||[]).map(id=>findM(id)).filter(Boolean);
    return {
      v: 2,
      tier1: { marketId: w2.decision.tier1.marketId, name: t1?.name||'', rationale: w2.decision.tier1.rationale||'' },
      tier2: t2.map(m=>({ marketId: m.id, name: m.name }))
    };
  }
  if(w2.matrix?.selectedMarketId){
    const m = findM(w2.matrix.selectedMarketId);
    return { v: 1, tier1: { marketId: w2.matrix.selectedMarketId, name: m?.name||'', rationale: w2.decision?.rationale||'' }, tier2: [] };
  }
  return { v: 0, tier1: null, tier2: [] };
};

/* ---------- 骨架渲染 ---------- */
Work2.renderStep = function(id){
  const sec=document.querySelector('#steps2 .step[data-step="'+id+'"]');
  if(!sec) return;
  // RENDER_VERSION guard（契约在 UI.mountGuard，2026-09-01 候选 4）
  if(!UI.mountGuard(sec, Work2, id)) return;
  sec.innerHTML='';
  const idx2 = Work2.steps.findIndex(s=>s.id===id);
  sec.appendChild(el('div',{class:'sub-head'},
    el('span',{class:'num'},'2.'+(idx2+1)),
    el('h3',{}, Work2.titles[id])
  ));
  const subEl2 = Work2.subtitles && Work2.subtitles[id];
  if(subEl2){
    sec.appendChild(el('p',{class:'lede', style:{fontFamily:'var(--font-display)', fontStyle:'normal', fontSize:'1.125rem', lineHeight:1.5, color:'var(--color-ink)', margin:'0 0 28px'}}, subEl2));
  }
  sec.appendChild(el('div',{class:'plate plate--empty'}));
  const dn=UI.demoNote(2,id); if(dn) sec.appendChild(dn);
  UI.mountMvo(sec, Work2, id);
  const fn=Work2.render[id]; if(fn) fn(sec);
  // 步间跳转 CTA：本步 mvo 全过后显示「下一步 →」（2026-08-28 统一步间 CTA）
  const nxt=UI.stepNextCta(2,id); if(nxt) sec.querySelector('.plate').appendChild(nxt);
  // 跨工作坊闭环 CTA：末步 mvo 全过后显示「III. 价值主张 →」
  const nw=UI.nextWorkCta(2,id); if(nw) sec.querySelector('.plate').appendChild(nw);
  UI.mountMark(sec, Work2);
};
Work2.rerender = function(id){
  const sec=document.querySelector('#steps2 .step[data-step="'+id+'"]');
  if(!sec) return;
  sec.dataset.rendered='0';
  Work2.renderStep(id);
};
// Bump when changing render output so cached steps re-render for existing users.
Work2.RENDER_VERSION = '2';

// Forced redraw (clears cache + re-renders).
// Called by interactive state-change callbacks after autosave.
Work2.rerender=function(id){
  const sec=document.querySelector('#steps2 .step[data-step="'+id+'"]');
  if(!sec) return;
  sec.dataset.rendered='0';
  Work2.renderStep(id);
};

// Global refreshDynamic: default behavior invalidates cache on any id change,
// so every interactive callback triggers a full rebuild.
Work2.refreshDynamic=function(id){
  Work2.rerender(id);
};

Work2.titles = {
  framework: '构建评估体系',
  evaluate: '评估候选市场',
  decision: '矩阵 + 三档决策'
};
Work2.subtitles = {
  framework: '候选清单 → 筛选标准 → 应用筛选 → 4×2 指标体系 → Hybrid 2 Delphi 定权重。',
  evaluate: '3 个保留市场 × 16 个指标 = 48 格评分；每格必须有依据，AI 打分后人工复核。',
  decision: '加权得分落在吸引力—竞争力矩阵上，起三档决策卡：主战场 / 观察期 / 暂缓。'
};

Work2.mvo = {
  framework: () => ({
    checks: [
      {label:'候选市场 ≥5 个且有入选理由', test:()=>state.work2.candidates.length>=5 && state.work2.candidates.every(c=>(c.reason||'').trim().length>3)},
      {label:'筛选标准 ≥3 个', test:()=>state.work2.screening.criteria.length>=3},
      {label:'保留了 3 个市场', test:()=>state.work2.retained.length===3},
      {label:'指标体系完整（每个二级有高分锚点）', test:()=>Work2.allIndicators().every(i=>i.rubric&&i.rubric.high)}
    ],
    note:'评估体系先于打分——没有 rubric（高/中/低锚点）的指标，AI 和你自己打分都会漂移。'
  }),
  evaluate: () => ({
    checks: [
      {label:'每个市场在所有指标上都有分', test:()=>Work2.allIndicators().every(i=>state.work2.retained.every(m=>state.work2.scoring[m.id]?.[i.id]?.score!=null))},
      {label:'每格都有依据（10-30 字）', test:()=>Work2.allIndicators().every(i=>state.work2.retained.every(m=>(state.work2.scoring[m.id]?.[i.id]?.evidence||'').trim().length>=5))}
    ],
    note:'AI 打分后一定要人工复核——尤其你比 AI 更懂的本地市场。依据写不出来，分数大概率是编的。'
  }),
  decision: () => ({
    checks: [
      {label:'已选定主战场（tier1 非空）', test:()=>state.work2.decision.tier1.marketId!=null},
      {label:'写了选择理由', test:()=>(state.work2.decision.tier1.rationale||'').trim().length>20},
      {label:'列了 6 个月里程碑', test:()=>(state.work2.decision.tier1.milestones||[]).some(m=>(m||'').trim().length>3)},
      {label:'写了触发再评估条件', test:()=>!!(state.work2.decision.tier1.reEvalTrigger||'').trim()}
    ],
    note:'好的决策记录"放弃了什么、为什么"——主战场之外，观察期和暂缓市场也要有触发再评估的条件。'
  })
};

Work2.render = {};

/* ---------- 公共工具 ---------- */
// 展平两轴指标：{id, name, axis, catId, catName, rubric, weight(一级内), catWeight}
Work2.allIndicators = function(){
  const out=[];
  ['attractiveness','competitiveness'].forEach(axis=>{
    (state.work2[axis].categories||[]).forEach(cat=>{
      (cat.indicators||[]).forEach(ind=>{
        out.push({...ind, axis, catId:cat.id, catName:cat.name, catWeight:cat.weight??0.25});
      });
    });
  });
  return out;
};
// 有效权重：存储的一级×二级，按轴归一化（收敛后已回填到存储，finalWeights 不再覆盖）
Work2.effectiveWeights = function(){
  const inds = Work2.allIndicators();
  const weights = {attractiveness:{}, competitiveness:{}};
  ['attractiveness','competitiveness'].forEach(axis=>{
    const axisInds = inds.filter(i=>i.axis===axis);
    let sum = 0;
    axisInds.forEach(i=>{
      const w = (i.catWeight ?? 0.25) * (i.weight ?? 0.5);
      weights[axis][i.id] = w; sum += w;
    });
    if(sum>0) axisInds.forEach(i=>{ weights[axis][i.id] /= sum; });
  });
  return weights;
};
Work2.work1Ready = function(){
  return !!(state.work1?.sbu?.name||'').trim();
};
Work2.guardWork1 = function(){
  if(!Work2.work1Ready()){ showToast('work1 未填，请先完成 work1'); return false; }
  return true;
};
// Tab 1 主流水线的完成单元存储
Work2.pipeStore = {
  get(){ return state.work2._pipeDone || []; },
  set(v){ state.work2._pipeDone = v; }
};

/* ---------- TAB 1: 构建评估体系 ---------- */
Work2.render.framework = function(sec){
  const plate = sec.querySelector('.plate');
  const w2 = state.work2;

  // 主按键：AI 从 work1 推导评估体系（4 单元流水线：候选→标准→筛选→指标）
  const ai = el('div',{class:'ai-box'});
  const mid = el('div',{class:'ai-box-mid'});
  const fwGenerated = (state.work2.candidates||[]).length>0 || (state.work2._pipeDone||[]).length>0;
  const mainBtn = el('button',{class:'primary'}, fwGenerated ? '重新推导评估体系' : 'AI 从 work1 推导评估体系');
  mid.appendChild(mainBtn);
  const needsAll = ['sbu','environment','personas','competitors'];
  const handle = (typeof AiContext!=='undefined')
    ? AiContext.mountSettings(mid,{workId:'work2', needs:needsAll,
        preview:()=>({system:'4 单元流水线（候选清单→筛选标准→应用筛选→指标体系）', instruction:'点击后按单元顺序执行'})})
    : {current:()=>({sections:needsAll.slice(), fewShot:null})};
  mainBtn.addEventListener('click', ()=>Work2.runFrameworkPipeline(mainBtn, mid, handle.current()));
  ai.appendChild(mid);
  plate.appendChild(ai);

  // 候选市场清单
  plate.appendChild(el('h4',{},'候选市场清单（5-10 个）'));
  const ct=el('div',{class:'table-wrap'});
  const ctbl=el('table',{class:'data'});
  ctbl.innerHTML='<thead><tr><th style="width:24%">市场</th><th>入选理由（需求 / 规模 / 趋势）</th><th style="width:50px"></th></tr></thead>';
  const ctb=el('tbody');
  w2.candidates.forEach((c,i)=>{
    ctb.appendChild(el('tr',{},
      el('td',{},el('input',{value:c.name,oninput:e=>{c.name=e.target.value;autosave()}})),
      el('td',{},el('input',{value:c.reason,oninput:e=>{c.reason=e.target.value;autosave()}})),
      el('td',{},el('button',{class:'ghost small',onclick:()=>{w2.candidates.splice(i,1);autosave();Work2.rerender('framework')}},'×'))
    ));
  });
  ctbl.appendChild(ctb); ct.appendChild(ctbl); plate.appendChild(ct);
  plate.appendChild(el('button',{class:'small',onclick:()=>{w2.candidates.push({id:uid('cand'),name:'',reason:'',source:'user'});autosave();Work2.rerender('framework')}},'+ 添加候选市场'));

  // 筛选标准
  plate.appendChild(el('h4',{},'筛选标准（3-5 个可观测、可量化）'));
  const st=el('div',{class:'table-wrap'});
  const stbl=el('table',{class:'data'});
  stbl.innerHTML='<thead><tr><th>标准（如：Hofstede UAI > 80）</th><th style="width:30%">数据源</th><th style="width:50px"></th></tr></thead>';
  const stb=el('tbody');
  w2.screening.criteria.forEach((c,i)=>{
    stb.appendChild(el('tr',{},
      el('td',{},el('input',{value:c.name,oninput:e=>{c.name=e.target.value;autosave()}})),
      el('td',{},el('input',{value:c.source||'',oninput:e=>{c.source=e.target.value;autosave()}})),
      el('td',{},el('button',{class:'ghost small',onclick:()=>{w2.screening.criteria.splice(i,1);autosave();Work2.rerender('framework')}},'×'))
    ));
  });
  stbl.appendChild(stb); st.appendChild(stbl); plate.appendChild(st);
  plate.appendChild(el('button',{class:'small',onclick:()=>{w2.screening.criteria.push({id:uid('crit'),name:'',source:'',kind:'user'});autosave();Work2.rerender('framework')}},'+ 添加标准'));

  // 保留市场（3 张详细字段卡）
  plate.appendChild(el('h4',{},'应用筛选 → 保留 3 个市场'));
  const rGrid = el('div',{class:'grid3'});
  for(let i=0;i<3;i++){
    const m = w2.retained[i];
    const card = el('div',{class:'card'});
    if(!m){
      card.appendChild(el('p',{class:'hint'},'保留市场 '+(i+1)+' — 用「应用筛选」生成或手动添加。'));
      card.appendChild(el('button',{class:'small ghost',onclick:()=>{w2.retained.push({id:uid('m'),name:'',region:'',population:'',gdpPerCapita:'',notes:'',reason:'',source:'user'});autosave();Work2.rerender('framework')}},'+ 手动添加'));
    } else {
      card.appendChild(el('div',{style:{display:'flex',justifyContent:'space-between',alignItems:'center'}},
        el('input',{value:m.name,style:{fontFamily:'var(--font-display)',fontStyle:'normal',fontSize:'16px'},oninput:e=>{m.name=e.target.value;autosave();App.updateSummary()}}),
        el('button',{class:'ghost small',onclick:()=>{w2.retained.splice(i,1);autosave();Work2.rerender('framework')}},'×')));
      [['region','地区'],['population','人口/规模'],['gdpPerCapita','人均 GDP']].forEach(([k,lb])=>{
        card.appendChild(el('div',{class:'field'},el('label',{},lb),el('input',{value:m[k]||'',oninput:e=>{m[k]=e.target.value;autosave()}})));
      });
      card.appendChild(el('div',{class:'field'},el('label',{},'为什么保留'),el('textarea',{rows:2,oninput:e=>{m.reason=e.target.value;autosave()}},m.reason||'')));
      card.appendChild(el('div',{class:'field'},el('label',{},'备注'),el('textarea',{rows:1,oninput:e=>{m.notes=e.target.value;autosave()}},m.notes||'')));
    }
    rGrid.appendChild(card);
  }
  plate.appendChild(rGrid);

  // 指标体系（可折叠一级 card）
  plate.appendChild(el('h4',{},'指标体系（4×2 模板，默认可覆写）'));
  ['attractiveness','competitiveness'].forEach(axis=>{
    plate.appendChild(el('h5',{style:'margin:14px 0 6px'}, axis==='attractiveness'?'市场吸引力':'业务竞争力'));
    (w2[axis].categories||[]).forEach((cat,ci)=>{
      const det = el('details',{open:true,class:'plate',style:'margin-bottom:10px'});
      det.appendChild(el('summary',{style:'cursor:pointer;font-family:var(--font-display);font-style:normal;font-size:16px'},
        cat.name + '（一级权重 ' + Math.round((cat.weight??0.25)*100) + '%）'));
      (cat.indicators||[]).forEach((ind,ii)=>{
        const effPct = () => Math.round(((cat.weight??0.25)*(ind.weight??0.5))*100) + '%';
        const effSpan = el('span',{class:'mono',style:'font-size:11px;color:var(--color-ink-2)',title:'有效权重 = 一级权重 × 二级权重'}, '有效 ' + effPct());
        const row = el('div',{style:{borderTop:'1px solid var(--color-rule)',padding:'10px 0'}},
          el('div',{style:{display:'flex',gap:'10px',alignItems:'center'}},
            el('input',{value:ind.name,style:{flex:1},oninput:e=>{ind.name=e.target.value;autosave()}}),
            effSpan,
            el('span',{class:'mono',style:'font-size:11px'}, '二级权重'),
            el('input',{type:'number',min:0,max:1,step:0.05,value:ind.weight??0.5,style:{width:'70px'},oninput:e=>{
              ind.weight=parseFloat(e.target.value)||0;
              if(state.work2.delphi.status==='done') state.work2.delphi.drifted=true;
              effSpan.textContent='有效 '+effPct();
              autosave();
            }}),
            el('button',{class:'ghost small',onclick:()=>{cat.indicators.splice(ii,1);autosave();Work2.rerender('framework')}},'×'))
        );
        const rub = el('div',{class:'grid3',style:'margin-top:6px'});
        ['high','mid','low'].forEach(a=>{
          rub.appendChild(el('div',{class:'field'},
            el('label',{},({high:'高分锚点 (8-10)',mid:'中分锚点 (4-7)',low:'低分锚点 (0-3)'})[a]),
            el('textarea',{rows:2,oninput:e=>{ind.rubric=ind.rubric||{};ind.rubric[a]=e.target.value;autosave()}},ind.rubric?.[a]||'')));
        });
        row.appendChild(rub);
        det.appendChild(row);
      });
      det.appendChild(el('div',{class:'row',style:'margin-top:8px'},
        el('button',{class:'small ghost',onclick:()=>{cat.indicators.push({id:uid('ind'),name:'',rubric:{high:'',mid:'',low:''},weight:0.5,support:0,source:'user'});autosave();Work2.rerender('framework')}},'+ 二级指标'),
        el('button',{class:'small ghost',onclick:()=>{w2[axis].categories.splice(ci,1);autosave();Work2.rerender('framework')}},'删除整个一级')));
      plate.appendChild(det);
    });
    plate.appendChild(el('button',{class:'small',onclick:()=>{w2[axis].categories.push({id:uid('cat'),name:'新一级维度',weight:0.25,indicators:[]});autosave();Work2.rerender('framework')}},'+ 一级维度'));
  });

  // 1.5 Hybrid 2 Delphi
  Work2.renderDelphi(plate);
};

/* 主流水线：候选 → 标准 → 筛选 → 指标 */
Work2.runFrameworkPipeline = function(button, container, cfg){
  if(!Work2.guardWork1()) return;
  // 2026-08-29 重新生成语义：已生成 → 清断点，4 单元完整重跑（直接覆盖）
  if((state.work2.candidates||[]).length>0 || (state.work2._pipeDone||[]).length>0) state.work2._pipeDone=[];
  const w1 = state.work1;
  const sections = cfg?.sections || ['sbu','environment','personas','competitors'];
  const pick = needs => sections.filter(s=>needs.includes(s));
  const mk = (key, label, fewShot, needs, system, instruction, onResult) => ({
    key, label, jsonMode: true,
    buildPrompt: ()=> AiContext.buildPrompt({workId:'work2', sections:pick(needs), system,
      // 2026-09-01：instruction 支持函数——流水线逐单元执行，下游单元（应用筛选）
      // 必须在执行时读前序单元刚写入的 state；点击时冻结的字符串拿到的是空/旧清单。
      instruction: typeof instruction==='function' ? instruction() : instruction, fewShot}),
    onResult
  });
  const units = [
    mk('fw:candidates','候选清单','work2.candidates',['sbu','environment','personas'],
      '你是国际市场进入策略顾问。基于 SBU 特征，列出 5-10 个值得评估的海外候选市场。',
      '目标客群分布：' + (w1.personas||[]).map(p=>p.region).filter(Boolean).join('、') +
      '\n输出: {"candidates": [{"name": "", "reason": "1 句, 含 需求/规模/趋势 之一"}]}',
      r=>{ if(!r?.candidates) return;
        state.work2.candidates = r.candidates.map(c=>({id:uid('cand'),name:c.name||'',reason:c.reason||'',source:'ai'}));
        state.work2.meta.work1Linked = true; autosave(); }),
    mk('fw:criteria','筛选标准','work2.criteria',['sbu','environment'],
      '你是市场进入策略顾问。基于业务特征，建议 3-5 个可观测、可量化的初筛淘汰标准。每条标准必须能从一个公开数据源查到。',
      '输出: {"criteria": [{"name": "", "source": "数据源名称"}]}',
      r=>{ if(!r?.criteria) return;
        state.work2.screening.criteria = r.criteria.map(c=>({id:uid('crit'),name:c.name||'',source:c.source||'',kind:'ai'}));
        autosave(); }),
    mk('fw:retained','应用筛选','work2.retained',['sbu'],
      '你是市场进入策略顾问。给定 5-10 个候选市场和 3-5 个筛选标准，应用标准淘汰到 3 个保留市场。',
      ()=>'候选: ' + JSON.stringify(state.work2.candidates.map(c=>({name:c.name,reason:c.reason}))) +
      '\n标准: ' + JSON.stringify(state.work2.screening.criteria.map(c=>c.name)) +
      '\n只能从上面的候选清单里选，不得引入清单外的市场。' +
      // 2026-09-01：三个事实字段必须填——空串占位示例会被模型照抄成空值（1.3 卡片全空的根因）
      '\n输出: {"retained": [{"name": "清单中的市场名", "reason": "为什么留", "region": "所属地区如 欧洲/东亚", "population": "人口或规模量级如 约 6700 万", "gdpPerCapita": "人均 GDP 量级如 约 4.9 万美元"}]}，region/population/gdpPerCapita 按真实近似值填写，不得留空。',
      r=>{ if(!r?.retained) return;
        state.work2.retained = r.retained.slice(0,3).map(m=>({id:uid('m'),name:m.name||'',region:m.region||'',population:m.population||'',gdpPerCapita:m.gdpPerCapita||'',notes:'',reason:m.reason||'',source:'ai'}));
        state.work2.scoring = {}; autosave(); }),
    mk('fw:indicators','指标体系','work2.indicators',['sbu','environment','competitors'],
      '你是营销研究方法专家。建议 4 一级 × 2 二级 的市场吸引力指标 + 业务竞争力指标。每个指标给高中低评分锚点。请按以下 4×2 模板输出（可微调一级名但不能删一级）：吸引力：经济 / 政治法律 / 社会文化 / 风险；竞争力：市场信息 / 营销渠道 / 认证合规 / 产品品牌。',
      '输出: {"attractiveness": {"categories": [{"name": "", "indicators": [{"name": "", "rubric": {"high": "", "mid": "", "low": ""}}]}]}, "competitiveness": {...}}',
      r=>{ if(!r) return;
        ['attractiveness','competitiveness'].forEach(axis=>{
          const cats = r[axis]?.categories;
          if(!Array.isArray(cats) || !cats.length) return;
          state.work2[axis].categories = cats.map(c=>({
            id:uid('cat'), name:c.name||'', weight:1/cats.length,
            indicators:(c.indicators||[]).map(i=>({id:uid('ind'),name:i.name||'',rubric:i.rubric||{high:'',mid:'',low:''},weight:1/Math.max(1,(c.indicators||[]).length),support:0,source:'ai'}))
          }));
        });
        // 指标变了：权重需重定（Delphi 重置）
        state.work2.delphi.finalWeights = null; state.work2.delphi.personas = [];
        state.work2.delphi.status = 'idle'; state.work2.delphi.drifted = false;
        autosave(); })
  ];
  API.aiPipeline({button, container, label:'AI 推导评估体系', units, store:Work2.pipeStore,
    onDone: ()=>Work2.rerender('framework')});
};

/* ---------- Hybrid 2 Delphi ---------- */
Work2.renderDelphi = function(plate){
  const d = state.work2.delphi;
  plate.appendChild(el('hr',{class:'rule'}));
  plate.appendChild(el('h4',{},'权重：Hybrid 2 Delphi（先招聘后画像）'));
  plate.appendChild(el('p',{class:'muted',style:'font-size:12px;margin:0 0 10px'},
    '论文《AI-Human Hybrids for Marketing Research》（JM 2025）验证：先招聘后画像模式产出异质性更高的合成数据。'));
  const inds = Work2.allIndicators();

  // 招聘
  if(!(d.recruitment.perspectives||[]).length){
    const {box} = API.aiCtxBox({
      workId:'work2', needs:['sbu','environment'], fewShotKey:'delphi.perspectives',
      label:'AI 招聘：该听哪 5 个视角',
      system:'你是营销研究方法专家。给定一个 SBU，建议做“海外市场选择”时应该重点听哪 5 个视角/利益方。',
      instruction:()=>'行业: ' + (state.work1.environment?.industry||'') +
        '\n输出: {"perspectives": [{"name": "视角名", "rationale": "为什么这个视角重要", "keySignals": ["3-5 个该视角最在意的信号"]}]}',
      aiScope:'work2.delphi.recruit',
      onResult:r=>{
        if(!r?.perspectives?.length) return;
        d.recruitment.perspectives = r.perspectives.slice(0,7).map(p=>({name:p.name||'',rationale:p.rationale||'',keySignals:p.keySignals||[]}));
        d.status='recruiting'; d.personas=[]; d.finalWeights=null;
        autosave(); Work2.rerender('framework');
      }
    });
    plate.appendChild(box);
    return;
  }

  // 视角清单（可删）
  const chipRow = el('div',{class:'chip-row',style:'margin-bottom:10px'});
  d.recruitment.perspectives.forEach((p,i)=>{
    const chip = el('span',{class:'chip',title:p.rationale},
      p.name,
      el('button',{class:'ghost small',style:'margin-left:6px',onclick:()=>{d.recruitment.perspectives.splice(i,1);autosave();Work2.rerender('framework')}},'×'));
    chipRow.appendChild(chip);
  });
  plate.appendChild(chipRow);

  // 5 persona 并行赋权（Runner 可暂停，d.phase 记录已完成 persona 数）
  if(!(d.personas||[]).length || d.status==='personas'){
    const runBtn = el('button',{class:'primary',onclick:e=>Work2.runPersonas(e.currentTarget)},
      (d.personas||[]).length ? '继续 persona 并行赋权' : '运行 ' + d.recruitment.perspectives.length + ' persona 并行赋权');
    plate.appendChild(el('div',{class:'ai-actions'}, runBtn,
      el('button',{class:'ghost',onclick:()=>{d.recruitment.perspectives=[];d.personas=[];d.status='idle';d.drifted=false;autosave();Work2.rerender('framework')}},'重新招聘')));
    return;
  }

  // User 主持（no AI）
  plate.appendChild(el('div',{class:'callout'},
    el('span',{class:'callout-title'},'USER HOSTED'),
    el('p',{style:'margin:6px 0 0'},'这 ' + d.personas.length + ' 位视角的权重有分歧。你可以：① 采纳 AI 收敛 ② 手动改（直接改下表权重） ③ 保留分歧给不同方案分别跑矩阵。')));
  const grid = el('div',{class:'grid2'});
  d.personas.forEach(p=>{
    const card = el('div',{class:'card',style:'margin-bottom:12px'});
    card.appendChild(el('div',{style:{fontFamily:'var(--font-display)',fontStyle:'normal',fontSize:'18px'}}, p.perspectiveName + (p.userOverride?' · 已手改':'')));
    if(p.reasoning) card.appendChild(el('p',{class:'hint',style:'margin:4px 0 8px'}, p.reasoning));
    ['attractiveness','competitiveness'].forEach(axis=>{
      const axisInds = inds.filter(i=>i.axis===axis);
      if(!axisInds.length) return;
      card.appendChild(el('div',{class:'mono',style:'font-size:10px;letter-spacing:.15em;color:var(--color-ink-2);margin-top:6px'}, axis==='attractiveness'?'吸引力':'竞争力'));
      axisInds.forEach(ind=>{
        p.ratings = p.ratings || {};
        p.ratings[axis] = p.ratings[axis] || {};
        const row = el('div',{style:{display:'flex',gap:'8px',alignItems:'center',padding:'2px 0'}},
          el('span',{style:{flex:1,fontSize:'12px'}}, ind.name),
          el('input',{type:'number',min:0,max:1,step:0.05,value:(p.ratings[axis][ind.id]??0).toFixed(2),style:{width:'70px',fontFamily:'var(--font-mono)',textAlign:'right'},
            oninput:e=>{p.ratings[axis][ind.id]=parseFloat(e.target.value)||0;p.userOverride=true;autosave();}}));
        card.appendChild(row);
      });
    });
    grid.appendChild(card);
  });
  plate.appendChild(grid);

  // 收敛（可选）1 call
  const convAi = el('div',{class:'ai-box'});
  const convBtn = el('button',{class:'primary',onclick:()=>Work2.converge(convBtn, convAi)}, 'AI 收敛（取均值归一化）');
  convAi.appendChild(convBtn);
  plate.appendChild(convAi);

  if(d.status==='done'){
    const ew = Work2.effectiveWeights();
    plate.appendChild(el('hr',{class:'rule'}));
    plate.appendChild(el('h4',{},'最终权重（已回填到指标体系）'));
    ['attractiveness','competitiveness'].forEach(axis=>{
      plate.appendChild(el('h5',{style:'margin:10px 0 4px'}, axis==='attractiveness'?'市场吸引力':'业务竞争力'));
      const items = inds.filter(i=>i.axis===axis)
        .map(i=>({label:i.name, value:(ew[axis]?.[i.id]||0)*100}))
        .sort((a,b)=>b.value-a.value);
      const c = el('section',{class:'plate'});
      renderBarChart(c, items, {unit:'%'});
      plate.appendChild(c);
    });
    if(d.drifted) plate.appendChild(el('div',{class:'callout'},
      el('span',{class:'callout-title'},'已偏离收敛'),
      el('p',{style:{margin:'6px 0 0'}},'指标体系的权重已被手改，评分与矩阵已用最新手改权重。如需回到收敛结果，重新执行 AI 收敛。')));
    if(d.summary) plate.appendChild(el('div',{class:'callout'}, el('span',{class:'callout-title'},'收敛总结'), d.summary));
  }
};

/* persona 并行：每个 persona 一个深 system prompt（含 rationale + keySignals RAG）+ few-shot，并行 call */
Work2.runPersonas = async function(button){
  if(!Work2.guardWork1()) return;
  const d = state.work2.delphi;
  const inds = Work2.allIndicators();
  if(inds.length<2){ showToast('请先完成指标体系（至少 2 个二级指标）'); return; }
  const pers = d.recruitment.perspectives;
  const doneN = (d.personas||[]).length;
  const pending = pers.slice(doneN);
  if(!pending.length){ showToast('persona 已全部完成'); return; }
  const task = Runner.start({id:'work2-delphi-personas', label:'Delphi persona 赋权', button,
    total: pers.length, pausable: true,
    onPause:()=>{ d.status='personas'; autosave(); },
    onResume:()=>{}});
  if(!task) return;
  task.done = doneN;
  d.status='personas';
  Runner.renderUI();
  // RAG：把该视角 keySignals 相关的 work1 字段塞进 prompt（字段级截断）
  const w1 = state.work1;
  const ragFor = p => {
    const sig = (p.keySignals||[]).join('、');
    const bits = [
      '能力: ' + AiContext.tr(['delivery','core','brand','customer','compliance'].map(k=>w1.environment?.ourCapabilities?.[k]).filter(Boolean).join('；'), 300),
      '竞品: ' + (w1.environment?.competitors||[]).slice(0,5).map(c=>c.name).join('、'),
      '客群: ' + (w1.personas||[]).map(x=>x.name).join('、')
    ].filter(Boolean);
    return '你最在意的信号：' + sig + '\n相关资料：\n' + bits.join('\n');
  };
  try{
    // 剩余 persona 并行 call
    const results = await Promise.all(pending.map(async p=>{
      const sys = '你是' + p.name + '专家。' + (p.rationale||'') +
        '\n few-shot 示例：财务紧张创业公司出海 → 短期要回本，权重偏向规模与增长。\n' +
        '请对下列指标赋权重（吸引力维度内总和=1，竞争力维度内总和=1，保留两位小数）。严格输出 JSON。';
      const user = ragFor(p) +
        '\nSBU: ' + w1.sbu.name + ' (' + (w1.sbu.category||'') + ')' +
        '\n范围: ' + (w1.sbu.scope||'') +
        '\n指标:\n' + inds.map(i=>'- [' + i.id + '] (' + i.axis + ') ' + i.name + ': 高分 ' + (i.rubric?.high||'—') + ' / 中分 ' + (i.rubric?.mid||'—') + ' / 低分 ' + (i.rubric?.low||'—')).join('\n') +
        '\n输出: {"ratings": {"<indicatorId>": 0.0-1.0}, "reasoning": "<30字理由>"}';
      const fs = AiContext.fewShotText('delphi.weights');
      const messages = [{role:'system',content:sys}];
      if(fs) messages.push({role:'system',content:'格式示例（仅参考格式，勿照抄内容）：\n'+fs});
      messages.push({role:'user',content:user});
      return API.callJson(messages, {signal:Runner.signal()}).then(r=>{ Runner.tick(1); return {p, r}; });
    }));
    if(task.aborted) return;
    results.forEach(({p, r})=>{
      if(!r?.ratings) return;
      const ratings = {attractiveness:{}, competitiveness:{}};
      inds.forEach(i=>{ ratings[i.axis][i.id] = clamp(Number(r.ratings[i.id])||0, 0, 1); });
      ['attractiveness','competitiveness'].forEach(axis=>{
        const sum = Object.values(ratings[axis]).reduce((a,b)=>a+b,0);
        if(sum>0) Object.keys(ratings[axis]).forEach(k=>ratings[axis][k]=+(ratings[axis][k]/sum).toFixed(3));
      });
      d.personas.push({id:uid('persona'), perspectiveName:p.name, keySignals:p.keySignals||[],
        ratings, reasoning:r.reasoning||'', userOverride:false});
    });
    d.status='hosted'; d.phase=null;
    autosave();
  }catch(e){
    if(task.aborted || (e && e.name==='AbortError')){ d.status='personas'; }
    else { showToast('Delphi persona 失败: '+e.message); }
    autosave();
  }finally{
    Runner.finish();
    Work2.rerender('framework');
  }
};

/* 纯函数：多 persona 权重取均值（同轴内归一化）——便于单测 */
Work2.convergeWeights = function(personas, inds){
  const weights = {attractiveness:{}, competitiveness:{}};
  ['attractiveness','competitiveness'].forEach(axis=>{
    const axisInds = inds.filter(i=>i.axis===axis);
    axisInds.forEach(ind=>{
      const vals = personas
        .map(p=>Number(p.ratings?.[axis]?.[ind.id]))
        .filter(v=>!isNaN(v));
      weights[axis][ind.id] = vals.length ? vals.reduce((a,b)=>a+b,0)/vals.length : 0;
    });
    const sum = Object.values(weights[axis]).reduce((a,b)=>a+b,0);
    if(sum>0) Object.keys(weights[axis]).forEach(k=>weights[axis][k] = weights[axis][k]/sum);
  });
  return weights;
};

/* 纯函数：把收敛权重（轴内和=1）回填到一级+二级，令 一级×二级 == 收敛权重。
   catWeight = 该一级下各二级收敛权重之和；indWeight = 收敛权重 / catWeight。
   无有效收敛权的一级/二级保留原值；全部无效时返回 false（不落回）。 */
Work2.backfillWeightsInto = function(w2Data, weights){
  if(!w2Data || !weights) return false;
  let any = false;
  ['attractiveness','competitiveness'].forEach(axis=>{
    const axisW = weights[axis] || {};
    (w2Data[axis]?.categories||[]).forEach(cat=>{
      let catSum = 0;
      (cat.indicators||[]).forEach(ind=>{
        const w = Number(axisW[ind.id]);
        if(!isNaN(w)) catSum += w;
      });
      if(!(catSum > 0)) return;
      cat.weight = +catSum.toFixed(4);
      (cat.indicators||[]).forEach(ind=>{
        const w = Number(axisW[ind.id]);
        if(isNaN(w)) return;
        ind.weight = +(w/catSum).toFixed(4);
        any = true;
      });
    });
  });
  return any;
};

/* 存量迁移：旧档案 finalWeights 一次性回填两级并释放（幂等：回填后置空，不再触发） */
Work2.migrateDelphiWeights = function(w2Data){
  const d = w2Data?.delphi;
  // 迁移契约：原地改即可（SchemaMigrate 靠 JSON 对比检测变更），返回值必须是
  // undefined 或替换对象——曾 return false/ok 导致 work2 整片被换成布尔。
  if(!d || d.finalWeights == null) return;
  const ok = Work2.backfillWeightsInto(w2Data, d.finalWeights);
  if(ok){ d.status = 'done'; d.drifted = false; }
  d.finalWeights = null;
};

/* 收敛：本地均值（确定性）+ 回填两级 + 可选 1 call AI 总结 */
Work2.converge = async function(btn, container){
  const d = state.work2.delphi;
  const inds = Work2.allIndicators();
  const weights = Work2.convergeWeights(d.personas, inds);
  if(!Work2.backfillWeightsInto(state.work2, weights)){
    showToast('无可收敛权重：请先让视角给出有效权重');
    return;
  }
  d.drifted = false;
  btn.disabled = true; btn.textContent = '收敛中…';
  try{
    const messages = AiContext.buildPrompt({
      workId:'work2', sections:['sbu','indicators'],
      system:'你是研究方法主持人。' + d.personas.length + ' 位视角分别给出指标权重（已含用户手改）。已按均值归一化，请给出 1 段收敛总结（分歧在哪、共识在哪）。',
      instruction: d.personas.length + ' persona 权重: ' + JSON.stringify(d.personas.map(p=>({name:p.perspectiveName, ratings:p.ratings}))) +
        '\n收敛后权重: ' + JSON.stringify(weights) +
        '\n输出: {"summary": "<1段>"}',
      fewShot:'delphi.converge'
    });
    const r = await API.callJson(messages);
    d.summary = r?.summary || '';
  }catch(e){
    // 降级：本地总结，不阻断权重落地（0-1 call 语义）
    d.summary = '（AI 总结不可用）权重取 ' + d.personas.length + ' 位视角均值并归一化。';
  }
  d.finalWeights = null;
  d.status = 'done';
  autosave();
  btn.disabled = false; btn.textContent = 'AI 收敛（取均值归一化）';
  showToast('已回填到指标体系');
  Work2.rerender('framework');
};

/* ---------- TAB 2: 评估候选市场 ---------- */
Work2.render.evaluate = function(sec){
  const plate = sec.querySelector('.plate');
  const mks = state.work2.retained;
  const inds = Work2.allIndicators();
  if(!mks.length){ plate.appendChild(el('div',{class:'warning'},'请先在「应用筛选」保留恰好 3 个市场（当前 0 个）——候选清单 ≠ 保留市场。')); return; }
  if(!inds.length){ plate.appendChild(el('div',{class:'warning'},'请先完成指标体系。')); return; }

  // AI 评分 + 范围选择（全部 / 市场 A / B / C）
  const aiBar = el('div',{class:'ai-box'});
  const mid = el('div',{class:'ai-box-mid'});
  const scopeSel = el('select',{style:{marginBottom:'10px',maxWidth:'220px'}});
  scopeSel.appendChild(el('option',{value:'all'},'范围：全部市场'));
  mks.forEach(m=>scopeSel.appendChild(el('option',{value:m.id},'范围：仅 ' + (m.name||'未命名'))));
  mid.appendChild(scopeSel);
  const scoreBtn = el('button',{class:'primary'}, Work2.hasAnyScore() ? '重新生成' : 'AI 评分');
  mid.appendChild(scoreBtn);
  const needsScore = ['sbu','competitors','personas','metrics','indicators'];
  const handle = (typeof AiContext!=='undefined')
    ? AiContext.mountSettings(mid,{workId:'work2', needs:needsScore, fewShotKey:'work2.scores',
        preview:()=>({system:'你是市场进入评分员…', instruction:'对每个市场在每个指标上打 0-10 分'})})
    : {current:()=>({sections:needsScore.slice(), fewShot:'work2.scores'})};
  scoreBtn.addEventListener('click', ()=>Work2.aiScore(scoreBtn, mid, scopeSel.value, handle.current()));
  aiBar.appendChild(mid);
  plate.appendChild(aiBar);

  // 两轴表格：行=市场，列=指标；每格 score + evidence（必填）+ url（可选）
  ['attractiveness','competitiveness'].forEach((axis,idx)=>{
    plate.appendChild(el('h4',{}, idx===0?'市场吸引力':'业务竞争力'));
    const axisInds = inds.filter(i=>i.axis===axis);
    const table = el('div',{class:'table-wrap'});
    const t = el('table',{class:'data'});
    const head = el('thead'); const hr = el('tr');
    hr.appendChild(el('th',{style:'min-width:90px'},'市场'));
    axisInds.forEach(ind=>hr.appendChild(el('th',{title:'高分：'+(ind.rubric?.high||''),style:'min-width:150px'},
      ind.name + '\n(' + ind.catName + ', w=' + Math.round((Work2.effectiveWeights()[axis][ind.id]||0)*100) + '%)')));
    head.appendChild(hr); t.appendChild(head);
    const tb = el('tbody');
    mks.forEach(mk=>{
      const tr = el('tr');
      tr.appendChild(el('td',{style:{'font-family':'var(--font-display)','font-style':'normal'}}, mk.name||'未命名'));
      axisInds.forEach(ind=>{
        state.work2.scoring[mk.id] = state.work2.scoring[mk.id] || {};
        const cell = state.work2.scoring[mk.id][ind.id] || (state.work2.scoring[mk.id][ind.id] = {score:null, evidence:'', url:'', source:'user'});
        const td = el('td',{class:'score-cell'});
        const inp = el('input',{type:'number',min:0,max:10,step:0.1,value:cell.score??'',placeholder:'—',
          oninput:e=>{cell.score = e.target.value===''?null:clamp(parseFloat(e.target.value),0,10); cell.source='user'; autosave();}});
        td.appendChild(inp);
        if(cell.source==='ai' && cell.score!=null){
          const dot = el('span',{class:'ai-mark',title:'AI 生成，编辑后变为人工'});
          td.appendChild(dot);
          inp.addEventListener('input',()=>dot.remove());
        }
        td.appendChild(el('input',{value:cell.evidence||'',placeholder:'依据（必填 10-30 字）',style:{fontSize:'11px',marginTop:'4px'},
          oninput:e=>{cell.evidence=e.target.value;autosave()}}));
        td.appendChild(el('input',{value:cell.url||'',placeholder:'URL（可选）',style:{fontSize:'11px',marginTop:'2px'},
          oninput:e=>{cell.url=e.target.value;autosave()}}));
        tr.appendChild(td);
      });
      tb.appendChild(tr);
    });
    t.appendChild(tb); table.appendChild(t); plate.appendChild(table);
  });
};

/* AI 评分：每市场 1 call，Promise.all 并行 */
Work2.aiScore = function(btn, container, scope, cfg){
  if(!Work2.guardWork1()) return;
  const mks = scope==='all' ? state.work2.retained : state.work2.retained.filter(m=>m.id===scope);
  if(!mks.length){ showToast('没有可评分的市场'); return; }
  const inds = Work2.allIndicators();
  const indBlock = inds.map(i=>'[' + i.id + '] (' + i.axis + ') ' + i.name +
    '\n  高分(8-10): ' + (i.rubric?.high||'—') + '\n  中分(4-7): ' + (i.rubric?.mid||'—') + '\n  低分(0-3): ' + (i.rubric?.low||'—')).join('\n');
  btn.disabled = true; btn.textContent = '评分中…';
  Promise.all(mks.map(async mk=>{
    const messages = AiContext.buildPrompt({
      workId:'work2', sections:(cfg?.sections||[]),
      system:'你是市场进入评分员。根据 SBU 与 rubric，对给定市场在每个指标上打 0-10 分（保留一位小数），并给 10-30 字依据。严格输出 JSON。',
      instruction:'市场: ' + mk.name + ' (' + [mk.region,mk.population,mk.gdpPerCapita].filter(Boolean).join(', ') + ')' +
        '\n指标:\n' + indBlock +
        '\n输出: {"scores": {"<id>": 0-10}, "evidence": {"<id>": "10-30 字依据"}, "sources": {"<id>": "可选 URL"}}',
      fewShot: cfg?.fewShot
    });
    try{
      const r = await API.callJson(messages);
      if(r?.scores){
        state.work2.scoring[mk.id] = state.work2.scoring[mk.id] || {};
        Object.entries(r.scores).forEach(([k,v])=>{
          state.work2.scoring[mk.id][k] = {
            score: clamp(Number(v),0,10),
            evidence: r.evidence?.[k] || '',
            url: r.sources?.[k] || '',
            source: 'ai'
          };
        });
        autosave();
      }
    }catch(e){ console.warn('score failed', mk.name, e); }
  })).then(()=>{
    btn.disabled = false; btn.textContent = Work2.hasAnyScore() ? '重新生成' : 'AI 评分';
    Work2.rerender('evaluate');
    showToast('评分完成');
  });
};

/* 是否已有任何评分（驱动「AI 评分」→「重新生成」按钮语义，同 887 决策卡模式） */
Work2.hasAnyScore = () => Object.values(state.work2.scoring||{})
  .some(mk => mk && Object.values(mk).some(c => c && c.score != null));

/* ---------- TAB 3: 矩阵 + 三档决策 ---------- */
Work2.computeMatrix = function(){
  const mks = state.work2.retained || [];
  const w = Work2.effectiveWeights();
  return mks.map(mk=>{
    const sc = state.work2.scoring[mk.id] || {};
    let a=0, c=0, swA=0, swC=0;
    Work2.allIndicators().forEach(ind=>{
      const v = sc[ind.id]?.score;
      if(v==null || isNaN(v)) return;
      const wt = w[ind.axis][ind.id] || 0;
      if(ind.axis==='attractiveness'){ a += v*wt; swA += wt; }
      else { c += v*wt; swC += wt; }
    });
    return {...mk, x: swC ? c/swC : 0, y: swA ? a/swA : 0};
  });
};

Work2.render.decision = function(sec){
  const plate = sec.querySelector('.plate');
  const d = state.work2.decision;
  const mks = state.work2.retained || [];
  const pts = Work2.computeMatrix();
  if(!pts.length){ plate.appendChild(el('div',{class:'warning'},'请先完成候选市场与评分。')); return; }
  const cuts = Work2.matrixCuts();
  const hasStar = pts.length>=2 && pts.some(p=>Work2.quadrant(p.x,p.y)==='明星');
  // 2026-09-01 grilling：象限是分析结论，三档是资源决策——无明星时不代填、明示取舍义务。
  if(pts.length>=2 && !hasStar){
    plate.appendChild(el('div',{class:'warning'},'当前无明星市场（双高象限空缺）：tier1 主战场是战略取舍而非矩阵结论，请让理由说明取舍。'));
  }

  // AI 解释 + 起三档决策卡（单 call）
  const {box} = API.aiCtxBox({
    workId:'work2', needs:['sbu','recommendations','matrix','markets','indicators'], fewShotKey:'work2.tiers',
    label:((d.explanations && Object.keys(d.explanations).length>0) || !!d.tier1?.marketId) ? '重新生成三档决策卡' : 'AI 解释 + 起三档决策卡',
    system:'你是国际市场战略顾问。基于矩阵结果，给出三档决策 + 每档象限解释 + 触发再评估条件。',
    instruction:()=>'边界: ' + (state.work1.sbu.boundary||'') +
      '\n建议: 短期 ' + (state.work1.recommendations?.short||'') + ' / 中期 ' + (state.work1.recommendations?.mid||'') + ' / 长期 ' + (state.work1.recommendations?.long||'') +
      '\n矩阵结果:\n' + pts.map(p=>'- [id=' + p.id + '] ' + p.name + ': 吸引力 ' + p.y.toFixed(2) + ', 竞争力 ' + p.x.toFixed(2) + ', 象限 ' + Work2.quadrant(p.x,p.y)).join('\n') +
      '\n象限语义: 明星=双高·重点投入 / 潜力=吸引力高竞争力低·补能力 / 产能=竞争力高吸引力低·选择性收割 / 双低=放弃' +
      (hasStar ? '' : '\n当前无明星市场：tier1 选非明星市场时，rationale 必须写明取舍（选它要补什么能力、放弃什么）。') +
      '\n输出: explanations / tier1 / tier2 / tier3 四段 JSON（marketId 用上面给出的 id）。',
    aiScope:'work2.decision',
    onResult:r=>{
      if(!r) return;
      if(r.explanations) d.explanations = r.explanations;
      ['tier1','tier2','tier3'].forEach(t=>{
        if(!r[t]) return;
        Object.keys(r[t]).forEach(k=>{ d[t][k] = r[t][k]; });
      });
      // AI 回填的 id 必须落在矩阵点清单内：幻觉 id 会让 tier1 名字变空串，
      // 并随跨坊 CTA 污染下游 workshop（2026-09-01 审计）。
      Work2.sanitizeTiers(d, pts.map(p=>p.id));
      // tier1 变更后联动：保证 tier2/3 不含 tier1 市场
      if(d.tier1.marketId) Work2.syncTiers(d.tier1.marketId);
      d.cutsChanged = false;  // 新解释按当前口径生成，过期提示解除
      autosave(); Work2.rerender('decision'); App.updateSummary();
    }
  });
  plate.appendChild(box);

  // 散点图（4 象限：明星 / 产能 / 双低 / 潜力）
  const scatterPlate = el('section',{class:'plate'},
    el('span',{class:'plate-label'},'F8 · PLUMB SCATTER · 吸引力 × 竞争力'));
  renderMatrix({
    container:scatterPlate, points:pts.map(p=>({id:p.id,label:p.name,x:p.x,y:p.y})),
    xLabel:'业务竞争力（加权）', yLabel:'市场吸引力（加权）',
    xCut:cuts.xCut, yCut:cuts.yCut,
    selectedId:d.tier1.marketId,
    qHighHigh:'明星市场（重点投入）', qHighYLowX:'潜力市场（补能力）',
    qlowYHighX:'产能市场（选择性收割）', qLowLow:'放弃市场',
    onSelect:id=>{ Work2.setTier1(id); }
  });
  // 2026-09-01 修复：scatterPlate 此前从未挂载，矩阵图画进孤儿节点（用户看不到）。
  plate.appendChild(scatterPlate);
  plate.appendChild(el('div',{class:'grid3',style:{marginTop:'14px'}},
    UI.field('X 轴切分线 · 留空=自动（区间中点）', el('input',{type:'number',min:0,max:10,step:0.1,value:state.work2.matrix.xCut??'',onchange:e=>{state.work2.matrix.xCut=e.target.value===''?null:parseFloat(e.target.value);state.work2.decision.cutsChanged=true;autosave();Work2.rerender('decision')}})),
    UI.field('Y 轴切分线 · 留空=自动（区间中点）', el('input',{type:'number',min:0,max:10,step:0.1,value:state.work2.matrix.yCut??'',onchange:e=>{state.work2.matrix.yCut=e.target.value===''?null:parseFloat(e.target.value);state.work2.decision.cutsChanged=true;autosave();Work2.rerender('decision')}})),
    UI.field('矩阵备注', el('input',{type:'text',value:state.work2.matrix.notes,oninput:e=>{state.work2.matrix.notes=e.target.value;autosave()}}))
  ));
  // 口径变更后旧 AI 解释不自动销毁，只提示（2026-09-01 grilling 决策 4-B）。
  if(d.cutsChanged && Object.keys(d.explanations||{}).length){
    plate.appendChild(el('div',{class:'warning'},'矩阵口径已变，AI 解释可能过期——可点上方按钮重新生成。'));
  }

  // 排名表
  plate.appendChild(el('h4',{},'排名'));
  const table = el('div',{class:'table-wrap'});
  const t = el('table',{class:'data'});
  t.innerHTML='<thead><tr><th>#</th><th>市场</th><th>吸引力</th><th>竞争力</th><th>象限</th><th>解释</th></tr></thead>';
  const tb = el('tbody');
  [...pts].sort((a,b)=>(b.x+b.y)-(a.x+a.y)).forEach((p,i)=>{
    const q = Work2.quadrant(p.x, p.y);
    tb.appendChild(el('tr',{},
      el('td',{},String(i+1)),
      el('td',{style:{'font-style':'normal'}}, p.name + (p.id===d.tier1.marketId?' *':'')),
      el('td',{class:'mono'},p.y.toFixed(2)),
      el('td',{class:'mono'},p.x.toFixed(2)),
      el('td',{},el('span',{class:'tag '+(q==='明星'?'maroon':'')},q)),
      el('td',{class:'hint',style:'max-width:240px;white-space:normal;text-transform:none;letter-spacing:0'}, d.explanations?.[p.name]||'')
    ));
  });
  t.appendChild(tb); table.appendChild(t); plate.appendChild(table);

  // 三档决策卡
  plate.appendChild(el('h4',{},'三档决策卡'));
  const grid = el('div',{class:'grid3'});
  // tier1 主战场（强制非空）
  const c1 = el('div',{class:'card'});
  c1.appendChild(el('div',{class:'hint'},'TIER 1 · 主战场'));
  const sel1 = el('select',{onchange:e=>{ Work2.setTier1(e.target.value||null); }});
  sel1.appendChild(el('option',{value:''},'— 必选 —'));
  mks.forEach(m=>{ const o = el('option',{value:m.id}, m.name||'未命名'); if(m.id===d.tier1.marketId) o.selected=true; sel1.appendChild(o); });
  c1.appendChild(sel1);
  c1.appendChild(el('div',{class:'field'},el('label',{},'为什么选它'),el('textarea',{rows:3,oninput:e=>{d.tier1.rationale=e.target.value;autosave()}},d.tier1.rationale)));
  c1.appendChild(el('div',{class:'field'},el('label',{},'资源占比 %'),el('input',{type:'number',min:0,max:100,value:d.tier1.resourcesPct,oninput:e=>{d.tier1.resourcesPct=parseInt(e.target.value)||0;autosave()}})));
  c1.appendChild(el('div',{class:'field'},el('label',{},'6 个月里程碑')));
  (d.tier1.milestones||[]).forEach((ms,i)=>{
    c1.appendChild(el('div',{style:{display:'flex',gap:'6px',marginBottom:'4px'}},
      el('input',{value:ms,style:{flex:1},oninput:e=>{d.tier1.milestones[i]=e.target.value;autosave()}}),
      el('button',{class:'ghost small',onclick:()=>{d.tier1.milestones.splice(i,1);autosave();Work2.rerender('decision')}},'×')));
  });
  c1.appendChild(el('button',{class:'small ghost',onclick:()=>{d.tier1.milestones.push('');autosave();Work2.rerender('decision')}},'+ 里程碑'));
  c1.appendChild(el('div',{class:'field'},el('label',{},'触发再评估条件'),el('input',{value:d.tier1.reEvalTrigger||'',oninput:e=>{d.tier1.reEvalTrigger=e.target.value;autosave()}})));
  grid.appendChild(c1);
  // tier2 观察期 / tier3 暂缓（复选）
  [['tier2','TIER 2 · 观察期'],['tier3','TIER 3 · 放弃 / 暂缓']].forEach(([key,label])=>{
    const card = el('div',{class:'card'});
    card.appendChild(el('div',{class:'hint'},label));
    mks.forEach(m=>{
      if(m.id===d.tier1.marketId) return;
      const on = (d[key].marketIds||[]).includes(m.id);
      card.appendChild(el('label',{class:'ai-settings-check'},
        (()=>{const cb=el('input',{type:'checkbox',checked:on});cb.style.width='auto';cb.addEventListener('change',()=>{
          const arr=d[key].marketIds; const i=arr.indexOf(m.id);
          if(cb.checked&&i<0) arr.push(m.id); if(!cb.checked&&i>=0) arr.splice(i,1);
          autosave();
        });return cb;})(),
        ' ' + (m.name||'未命名')));
    });
    if(key==='tier2'){
      card.appendChild(el('div',{class:'field',style:'margin-top:8px'},el('label',{},'观察指标')));
      (d.tier2.observationMetrics||[]).forEach((om,i)=>{
        card.appendChild(el('div',{style:{display:'flex',gap:'6px',marginBottom:'4px'}},
          el('input',{value:om,style:{flex:1},oninput:e=>{d.tier2.observationMetrics[i]=e.target.value;autosave()}}),
          el('button',{class:'ghost small',onclick:()=>{d.tier2.observationMetrics.splice(i,1);autosave();Work2.rerender('decision')}},'×')));
      });
      card.appendChild(el('button',{class:'small ghost',onclick:()=>{d.tier2.observationMetrics.push('');autosave();Work2.rerender('decision')}},'+ 观察指标'));
    }
    card.appendChild(el('div',{class:'field'},el('label',{},'触发再评估条件'),el('input',{value:d[key].reEvalTrigger||'',oninput:e=>{d[key].reEvalTrigger=e.target.value;autosave()}})));
    grid.appendChild(card);
  });
  plate.appendChild(grid);
};

/* 切分线唯一出口（ADR 0010）：手动值优先；留空 → 自动区间中点 (min+max)/2。
   旧默认中位数在 3 点场景必然穿过中间市场的圆心，>= 平局裁决静默加冕象限
   （2026-09-01 荷兰案例：表格判「明星」、图上看不出）。表格/图/AI/导出一律走这里。 */
Work2.matrixCuts = function(){
  const pts = Work2.computeMatrix();
  const mid = vs => vs.length>=2 ? (Math.min(...vs)+Math.max(...vs))/2 : null;
  return {
    xCut: state.work2.matrix.xCut ?? mid(pts.map(p=>p.x)),
    yCut: state.work2.matrix.yCut ?? mid(pts.map(p=>p.y))
  };
};

Work2.quadrant = function(x, y){
  const pts = Work2.computeMatrix();
  if(pts.length<2) return '—';  // 单市场无切分意义
  const {xCut, yCut} = Work2.matrixCuts();
  if(x>=xCut && y>=yCut) return '明星';
  if(x<xCut && y>=yCut) return '潜力';
  if(x>=xCut && y<yCut) return '产能';
  return '双低';
};

/* 改 tier1.marketId → tier2/tier3 自动调整：旧主战场若不在任何档则降入观察期 */
/* AI 回填的三档 id 消毒：不在合法清单内的 marketId/marketIds 直接丢弃（幻觉防线） */
Work2.sanitizeTiers = function(d, validIds){
  const has = id => validIds.includes(id);
  if(d.tier1 && d.tier1.marketId!=null && !has(d.tier1.marketId)) d.tier1.marketId = null;
  ['tier2','tier3'].forEach(t=>{
    if(d[t] && Array.isArray(d[t].marketIds)) d[t].marketIds = [...new Set(d[t].marketIds.filter(has))];
  });
  return d;
};

Work2.setTier1 = function(marketId){
  const d = state.work2.decision;
  const prev = d.tier1.marketId;
  if(!marketId){ return; }
  d.tier1.marketId = marketId;
  Work2.syncTiers(marketId, prev);
  autosave(); Work2.rerender('decision'); App.updateSummary();
};
Work2.syncTiers = function(marketId, prev){
  const d = state.work2.decision;
  [d.tier2.marketIds, d.tier3.marketIds].forEach(arr=>{
    const i = arr.indexOf(marketId);
    if(i>=0) arr.splice(i,1);
  });
  if(prev && prev!==marketId && !d.tier2.marketIds.includes(prev) && !d.tier3.marketIds.includes(prev)){
    d.tier2.marketIds.push(prev);
  }
};

/* ---------- 导出 ---------- */
Work2.exportMd = function(){
  const d = state.work2;
  let out = '\n## II. 目标市场选择\n\n';
  out += '### 1. 候选市场清单\n';
  d.candidates.forEach(c=>{ out += '- **' + c.name + '**：' + (c.reason||'') + '\n'; });
  out += '\n### 2. 筛选标准\n';
  d.screening.criteria.forEach(c=>{ out += '- ' + c.name + (c.source ? '（数据源：' + c.source + '）' : '') + '\n'; });
  out += '\n### 3. 保留市场（应用筛选后）\n';
  d.retained.forEach(m=>{ out += '- **' + m.name + '**（' + [m.region,m.population,m.gdpPerCapita].filter(Boolean).join('，') + '）— ' + (m.reason||m.notes||'') + '\n'; });
  out += '\n### 4. 指标体系与权重\n';
  const ew = Work2.effectiveWeights();
  ['attractiveness','competitiveness'].forEach(axis=>{
    out += '**' + (axis==='attractiveness'?'市场吸引力':'业务竞争力') + '**：\n';
    d[axis].categories.forEach(cat=>{
      out += '- ' + cat.name + '（一级权重 ' + Math.round((cat.weight??0.25)*100) + '%）\n';
      cat.indicators.forEach(i=>{
        const w = Math.round((ew[axis]?.[i.id] ?? (cat.weight??0.25)*(i.weight??0.5)) * 100);
        out += '  - ' + i.name + '（权重 ' + w + '%）— 高：' + (i.rubric?.high||'—') + '；中：' + (i.rubric?.mid||'—') + '；低：' + (i.rubric?.low||'—') + '\n';
      });
    });
  });
  if(d.delphi.personas.length){
    out += '\n**Hybrid 2 Delphi**：' + d.delphi.personas.map(p=>p.perspectiveName).join('、') + '\n';
    if(d.delphi.summary) out += '> ' + d.delphi.summary + '\n';
  }
  out += '\n### 5. 评分与矩阵\n';
  Work2.computeMatrix().forEach(p=>{
    out += '- **' + p.name + '**（' + (p.region||'') + '）— 吸引力 ' + p.y.toFixed(2) + '，竞争力 ' + p.x.toFixed(2) + '，象限：' + Work2.quadrant(p.x,p.y) + '\n';
  });
  const nameOf = id => (d.retained.find(m=>m.id===id)||{}).name || '未知';
  out += '\n### 6. 三档决策\n';
  out += '- **主战场**：' + nameOf(d.decision.tier1.marketId) + '（资源 ' + d.decision.tier1.resourcesPct + '%）\n';
  out += '  - 理由：' + (d.decision.tier1.rationale||'') + '\n';
  (d.decision.tier1.milestones||[]).forEach(ms=>{ out += '  - 里程碑：' + ms + '\n'; });
  out += '  - 再评估触发：' + (d.decision.tier1.reEvalTrigger||'') + '\n';
  out += '- **观察期**：' + (d.decision.tier2.marketIds||[]).map(nameOf).join('、') + '\n';
  (d.decision.tier2.observationMetrics||[]).forEach(om=>{ out += '  - 观察：' + om + '\n'; });
  out += '  - 再评估触发：' + (d.decision.tier2.reEvalTrigger||'') + '\n';
  out += '- **暂缓**：' + ((d.decision.tier3.marketIds||[]).map(nameOf).join('、')||'无') + '\n';
  out += '  - 再评估触发：' + (d.decision.tier3.reEvalTrigger||'') + '\n';
  return out;
};

// 2026-09-01 候选 4：迁移注册契约（v2 重构 + Delphi 权重回填）
Work2.workKey = 'work2';
Work2.migrations = [Work2.migrateWork2, Work2.migrateDelphiWeights];
