/* ============================================================
   WORKSHOP 2 — 目标市场选择 (Delphi + GE matrix)
   Steps: scope / indicators / delphi / markets / matrix / decision
   ============================================================ */
Work2.steps = [
  {id:'scope', label:'1. 决策范围'},
  {id:'indicators', label:'2. 指标体系'},
  {id:'delphi', label:'3. Delphi 权重'},
  {id:'markets', label:'4. 候选市场'},
  {id:'scoring', label:'5. 评分'},
  {id:'matrix', label:'6. 矩阵'},
  {id:'decision', label:'7. 决策'}
];

Work2.EXPERTS = [
  {id:'researcher', name:'市场研究分析师', initial:'研', focus:'数据可靠性、样本偏差、测量有效性'},
  {id:'industry', name:'行业/品类专家', initial:'行', focus:'品类成熟度、供应链、竞争壁垒'},
  {id:'finance', name:'财务/投资分析师', initial:'财', focus:'市场规模、增长率、利润率、资本投入'},
  {id:'culture', name:'跨文化/本地化专家', initial:'文', focus:'文化距离、本地偏好、法规合规'},
  {id:'channel', name:'渠道/分销专家', initial:'渠', focus:'渠道可达性、媒介结构、物流能力'}
];

Work2.defaultData = () => ({
  scope: { question:'', timeframe:'', constraints:'', candidateCount:4 },
  attractiveness: { indicators:[] },  // {id,name,rubric:{high,mid,low},weight,support,source}
  competitiveness: { indicators:[] },
  delphi: {
    panel: Work2.EXPERTS.map(e=>({...e, round1:null, round2:null})),
    round1: null,    // {invites, responses:[{expertId, ratings:{indId:1-10}, reasoning}]}
    synthesis: null, // {summary, disagreements:[], recommendations:[]}
    round2: null,
    finalSynthesis: null,
    weights: null,   // {attractiveness:{indId:weight}, competitiveness:{...}}
    status:'idle'    // idle|running|round1|synthesis|round2|done|error
  },
  markets: [],   // {id,name,region,population,gdpPerCapita,notes,scores:{indId:0-10}, e_indId:'', src_indId:''}
  matrix: { selectedMarketId:null, xCut:null, yCut:null, notes:'' },
  decision: { rationale:'', sequence:'', risks:[], nextSteps:'' }
});

Work2.renderStep = function(id){
  const sec=document.querySelector('#steps2 .step[data-step="'+id+'"]');
  if(!sec) return;
  if(sec.dataset.rendered==='1'){ Work2.refreshDynamic(id); return; }
  sec.innerHTML='';
  sec.appendChild(UI.stepHeader(
    'STEP '+(Work2.steps.findIndex(s=>s.id===id)+1),
    Work2.titles[id], Work2.subtitles[id]
  ));
  const dn=UI.demoNote(2,id); if(dn) sec.appendChild(dn);
  // 工具栏「随机生成示例」只挂在 scope step-header 上（用户点哪个 tab 看到的都是它）
  // 顶栏"演示案例"菜单接管样本注入；Work 2 不再单独挂"随机生成示例"按钮。
  if(Work2.mvo && Work2.mvo[id]) sec.appendChild(UI.mvoCard(Work2.mvo[id](), sec));
  const fn=Work2.render[id]; if(fn) fn(sec);
  sec.dataset.rendered='1';
};

Work2.mvo = {
  scope: () => ({
    checks: [
      {label:'明确了决策问题', test:()=>(state.work2.scope.question||'').trim().length>5},
      {label:'设定了时间窗口', test:()=>!!(state.work2.scope.timeframe||'').trim()},
      {label:'写了约束条件', test:()=>(state.work2.scope.constraints||'').trim().length>5},
    ],
    note:'想清楚"在为什么决策"——是进入哪国，还是先选哪 3 国试点？问题不同，指标和候选市场都不同。'
  }),
  indicators: () => ({
    checks: [
      {label:'吸引力指标 ≥3 个，各有高/中/低分锚点', test:()=>state.work2.attractiveness.indicators.length>=3 && state.work2.attractiveness.indicators.every(i=>i.rubric&&i.rubric.high)},
      {label:'竞争力指标 ≥3 个，各有高/中/低分锚点', test:()=>state.work2.competitiveness.indicators.length>=3 && state.work2.competitiveness.indicators.every(i=>i.rubric&&i.rubric.high)},
    ],
    note:'没有 rubric（打分锚点）的指标，AI 和你自己打分都会漂移。每个指标写清"高=什么、中=什么、低=什么"。'
  }),
  delphi: () => ({
    checks: [
      {label:'权重已确定（各指标有 weight）', test:()=>state.work2.attractiveness.indicators.every(i=>i.weight>0) && state.work2.competitiveness.indicators.every(i=>i.weight>0)},
    ],
    note:'Delphi 产出的是权重共识。权重不一定要平均——对你的业务越关键的指标权重越高。'
  }),
  markets: () => ({
    checks: [
      {label:'候选市场 ≥3 个', test:()=>state.work2.markets.length>=3},
      {label:'每个市场有基本事实（人口/GDP 等）', test:()=>state.work2.markets.every(m=>(m.notes||'').trim().length>3)},
    ],
    note:'候选市场要可比——不要把"东南亚"和"新加坡"放在一起比。颗粒度统一到国家或城市级。'
  }),
  scoring: () => ({
    checks: [
      {label:'每个市场在所有指标上都有分', test:()=>{const inds=[...state.work2.attractiveness.indicators,...state.work2.competitiveness.indicators];return state.work2.markets.every(m=>inds.every(i=>m.scores&&m.scores[i.id]!=null));}},
    ],
    note:'AI 打分后一定要人工复核——尤其你比 AI 更懂的本地市场。点击分数格可直接修改。'
  }),
  matrix: () => ({
    checks: [
      {label:'已选定目标市场', test:()=>state.work2.matrix.selectedMarketId!=null},
    ],
    note:'第一象限（高吸引力+高竞争力）不一定是首选——也要看进入顺序和风险，这是下一步决策的内容。'
  }),
  decision: () => ({
    checks: [
      {label:'写了选择理由', test:()=>(state.work2.decision.rationale||'').trim().length>20},
      {label:'列了进入次序', test:()=>(state.work2.decision.sequence||'').trim().length>3},
      {label:'列了风险', test:()=>(state.work2.decision.risks||[]).some(r=>(r||'').trim().length>3)},
    ],
    note:'好的决策记录"放弃了什么、为什么"——不只是选了什么。nextSteps 写第一个 90 天动作。'
  }),
};
Work2.rerender = function(id){
  const sec=document.querySelector('#steps2 .step[data-step="'+id+'"]');
  if(!sec) return;
  sec.dataset.rendered='0';
  Work2.renderStep(id);
};

Work2.titles={
  scope:'决策范围', indicators:'吸引力 / 竞争力指标', delphi:'Delphi 专家权重',
  markets:'候选市场', scoring:'市场评分', matrix:'九位矩阵', decision:'最终决策'
};
Work2.subtitles={
  scope:'明确「我们在为什么决策」——目标市场选择的时间窗口、约束与候选数量。',
  indicators:'为市场吸引力与企业竞争力分别建立评价指标；每个指标配高分锚点、中分锚点、低分锚点。',
  indicators:'为市场吸引力与企业竞争力分别建立评价指标；每个指标配高分锚点、中分锚点、低分锚点。',
  delphi:'5 位合成专家两轮匿名打分，主持人综合反馈，产出权重。',
  markets:'添加 4–8 个候选市场，填写基本事实。',
  scoring:'按指标逐市场打分；可一键用 AI 按 rubric 生成，再人工覆盖。',
  matrix:'加权汇总后落在吸引力—竞争力矩阵上，按中位线切分四象限。',
  decision:'选择目标市场、记录取舍理由、排序与风险。'
};

Work2.render={};

/* ---------- SCOPE ---------- */
Work2.render.scope = function(sec){
  const d=state.work2.scope;
  sec.appendChild(UI.field('决策问题', el('input',{type:'text',value:d.question,oninput:e=>{d.question=e.target.value;autosave()}})));
  sec.appendChild(UI.field('时间窗口', el('input',{type:'text',value:d.timeframe,oninput:e=>{d.timeframe=e.target.value;autosave()}})));
  sec.appendChild(UI.field('约束条件（预算、品牌资产、合规等）', el('textarea',{rows:3,oninput:e=>{d.constraints=e.target.value;autosave()}},d.constraints)));
  sec.appendChild(UI.field('候选市场数量', el('input',{type:'number',min:2,max:12,value:d.candidateCount,oninput:e=>{d.candidateCount=parseInt(e.target.value);autosave()}})));
};

/* ---------- INDICATORS ---------- */
Work2.render.indicators = function(sec){
  ['attractiveness','competitiveness'].forEach(k=>{
    sec.appendChild(el('h3',{}, k==='attractiveness'?'市场吸引力指标':'企业竞争力指标'));
    const obj=state.work2[k];
    const table=el('div',{class:'table-wrap'});
    const t=el('table',{class:'data'});
    t.innerHTML=`<thead><tr><th style="width:22%">指标</th><th>高分锚点 (8–10)</th><th>中分锚点 (4–7)</th><th>低分锚点 (0–3)</th><th style="width:50px"></th></tr></thead>`;
    const tb=el('tbody');
    obj.indicators.forEach((ind,i)=>{
      const tr=el('tr');
      tr.appendChild(el('td',{}, el('input',{value:ind.name,oninput:e=>{ind.name=e.target.value;autosave()}})));
      ['high','mid','low'].forEach(a=>{
        tr.appendChild(el('td',{}, el('textarea',{rows:2,oninput:e=>{ind.rubric=ind.rubric||{};ind.rubric[a]=e.target.value;autosave()}},ind.rubric?.[a]||'')));
      });
      tr.appendChild(el('td',{}, el('button',{class:'ghost small',onclick:()=>{obj.indicators.splice(i,1);autosave();Work2.renderStep('indicators')}},'删除')));
      tb.appendChild(tr);
    });
    t.appendChild(tb); table.appendChild(t); sec.appendChild(table);
    sec.appendChild(el('div',{class:'row',style:{marginBottom:'20px'}},
      el('button',{onclick:()=>{obj.indicators.push({id:uid('ind'),name:'',rubric:{high:'',mid:'',low:''},weight:0,support:0,source:'user'});autosave();Work2.renderStep('indicators');}},'+ 添加指标')
    ));
  });

  const ai=el('div',{class:'ai-box'});
  const btn=el('button',{class:'primary',onclick:()=>{
    API.aiButton({
      button:btn,container:ai,aiScope:'work2.indicators',
      buildPrompt:()=>[{role:'system',content:'你是国际市场进入战略专家。为目标市场选择生成 4-6 个市场吸引力指标和 4-6 个企业竞争力指标，每个指标给出高中低三档评分锚点。输出 JSON: {"attractiveness":[{"name":"","rubric":{"high":"","mid":"","low":""}}],"competitiveness":[{"name":"","rubric":{"high":"","mid":"","low":""}}]}'},
        {role:'user',content:`SBU: ${state.work1.sbu.name}\n品类: ${state.work1.sbu.category}\n范围: ${state.work1.sbu.scope}\n决策问题: ${state.work2.scope.question}\n约束: ${state.work2.scope.constraints}`}],
      onResult:r=>{
        if(!r)return;
        ['attractiveness','competitiveness'].forEach(k=>{
          state.work2[k].indicators = (r[k]||[]).map(x=>({id:uid('ind'),weight:0,support:0,source:'ai',...x,rubric:x.rubric||{}}));
        });
        autosave(); Work2.renderStep('indicators');
      }
    });
  }},'用 AI 生成指标体系');
  ai.appendChild(btn); sec.appendChild(ai);
};

/* ---------- DELPHI ---------- */
Work2.render.delphi = function(sec){
  const d=state.work2.delphi;
  const inds=[...state.work2.attractiveness.indicators,...state.work2.competitiveness.indicators];
  if(inds.length<2){ sec.appendChild(el('div',{class:'warning'},'请先在「指标体系」步骤至少添加两个指标。')); return; }

  // panel avatars
  sec.appendChild(el('h3',{},'专家团'));
  const panel=el('div',{class:'plate'});
  d.panel.forEach(ex=>{
    const status = d.status==='running' ? 'thinking' : (ex.round1?'done':'');
    const row=el('div',{class:'expert-row'},
      el('div',{class:'expert-avatar '+status}, ex.initial),
      el('div',{},
        el('div',{style:'font-family:var(--font-display);font-style:italic;font-size:18px'}, ex.name),
        el('div',{class:'hint'}, ex.focus)
      )
    );
    panel.appendChild(row);
  });
  sec.appendChild(panel);

  // controls
  const bar=el('div',{class:'progress-bar'}, el('div'));
  sec.appendChild(bar);
  const statusText=el('p',{class:'mono',style:'font-size:11px;color:var(--color-ink-2)'}, Work2.delphiStatus());
  sec.appendChild(statusText);
  const delphiBtn=el('button',{class:'primary',onclick:e=>Work2.runDelphi(e.currentTarget)},
    ({round1:'重新运行 Delphi',synthesis:'继续 Delphi',round2:'继续 Delphi',paused:'继续 Delphi',aborted:'继续 Delphi'})[d.status] || '运行 Delphi 两轮');
  const actions=el('div',{class:'ai-actions'}, delphiBtn);
  sec.appendChild(actions);

  // results
  if(d.weights){
    sec.appendChild(el('hr',{class:'rule'}));
    sec.appendChild(el('h3',{},'最终权重'));
    ['attractiveness','competitiveness'].forEach(k=>{
      sec.appendChild(el('h4',{}, k==='attractiveness'?'市场吸引力':'企业竞争力'));
      const items=state.work2[k].indicators.map(ind=>({
        label:ind.name, value:(d.weights[k]?.[ind.id]||0)*100
      })).sort((a,b)=>b.value-a.value);
      const c=el('section',{class:'plate'});
      renderBarChart(c, items, {unit:'%'});
      sec.appendChild(c);
    });
  }
  if(d.finalSynthesis){
    sec.appendChild(el('h3',{},'主持人综合'));
    sec.appendChild(el('div',{class:'callout'},
      el('span',{class:'callout-title'},'HOST SYNTHESIS'),
      d.finalSynthesis));
  }
};
Work2.delphiStatus=function(){
  const s=state.work2.delphi.status;
  return ({idle:'就绪',running:'运行中…',paused:'已暂停（点继续）',aborted:'已中止（点继续）',round1:'第一轮已完成',synthesis:'主持人综合已完成',round2:'第二轮已完成',done:'完成',error:'错误'})[s]||s;
};
Work2.runDelphi = async function(button){
  const d=state.work2.delphi;
  if(d.status==='running'){ showToast('Delphi 运行中'); return; }
  const inds=[
    ...state.work2.attractiveness.indicators.map(i=>({...i,axis:'attractiveness'})),
    ...state.work2.competitiveness.indicators.map(i=>({...i,axis:'competitiveness'}))
  ];
  const indList=inds.map(i=>`- [${i.id}] (${i.axis}) ${i.name}: ${i.rubric.high} / ${i.rubric.mid} / ${i.rubric.low}`).join('\n');
  const context=`SBU:${state.work1.sbu.name}\n品类:${state.work1.sbu.category}\n范围:${state.work1.sbu.scope}\n决策:${state.work2.scope.question}\n约束:${state.work2.scope.constraints}\n\n指标:\n${indList}`;

  // 4 pausable stages: round1 experts → host synthesis → round2 experts → finalize.
  // d.phase records the stage that LAST COMPLETED, so resume begins at the next one.
  const STAGES=['round1','synthesis','round2','final'];
  const startIdx = d.phase ? Math.min(STAGES.length, STAGES.indexOf(d.phase)+1) : 0;
  const task=Runner.start({id:'work2-delphi', label:'Delphi 两轮', button,
    total: STAGES.length, pausable:true,
    onPause:()=>{ d.status='paused'; Work2.refreshDynamic('delphi'); autosave(); },
    onResume:()=>{ d.status='running'; Work2.refreshDynamic('delphi'); }});
  if(!task) return;
  task.done = startIdx;
  d.status='running'; d.error=null;
  Runner.renderUI();
  try{
    let r1 = d.round1?.responses || [];
    if(startIdx<=0){
      r1=await Promise.all(d.panel.map(async ex=>{
        const sys=`你是${ex.name}，关注${ex.focus}。请作为 Delphi 专家小组成员，对给定指标在各自维度内（吸引力维度内总和=1，竞争力维度内总和=1）赋权（0-1 之间，保留两位小数），并给出简短理由。严格输出 JSON。`;
        const user=context+`\n\n请输出: {"ratings":{"<indicatorId>":0.0-1.0},"reasoning":"..."}，要求吸引力指标的 ratings 之和=1，竞争力指标的 ratings 之和=1。`;
        const r=await API.callJson([{role:'system',content:sys},{role:'user',content:user}],{signal:Runner.signal()});
        ex.round1=r;
        return {expertId:ex.id, ...r};
      }));
      if(task.aborted) return;
      d.round1={responses:r1}; d.phase='round1'; autosave();
      task.done=1; Runner.renderUI();
      await Runner.checkpoint();
    }

    if(startIdx<=1){
      const sysHost='你是 Delphi 主持人。汇总各专家首轮权重，识别分歧最大的 3 个指标，给出第二轮讨论焦点。输出 JSON: {"summary":"","disagreements":[{"indicatorId":"","issue":""}],"recommendations":[""]}';
      const userHost = context + '\n\n第一轮各专家权重:\n' + JSON.stringify(r1,null,2);
      d.synthesis = await API.callJson([{role:'system',content:sysHost},{role:'user',content:userHost}],{signal:Runner.signal()});
      if(task.aborted) return;
      d.phase='synthesis'; autosave();
      task.done=2; Runner.renderUI();
      await Runner.checkpoint();
    }

    let r2 = d.round2?.responses || [];
    if(startIdx<=2){
      r2=await Promise.all(d.panel.map(async ex=>{
        const sys=`你是${ex.name}。第二轮 Delphi。你已经看到主持人综合反馈和其他专家匿名权重。请修订你的权重，仍按维度内总和=1，简要说明修订理由。输出 JSON: {"ratings":{...},"reasoning":"","revision":"修订了什么及原因"}`;
        const user=context+`\n\n主持人综合:\n${JSON.stringify(d.synthesis)}\n\n其他专家第一轮:\n`+JSON.stringify(r1.filter(r=>r.expertId!==ex.id));
        const r=await API.callJson([{role:'system',content:sys},{role:'user',content:user}],{signal:Runner.signal()});
        ex.round2=r;
        return {expertId:ex.id, ...r};
      }));
      if(task.aborted) return;
      d.round2={responses:r2}; d.phase='round2'; autosave();
      task.done=3; Runner.renderUI();
      await Runner.checkpoint();
    }

    // finalize
    const weights={attractiveness:{},competitiveness:{}};
    inds.forEach(ind=>{
      const vals=r2.map(r=>Number(r.ratings?.[ind.id])).filter(v=>!isNaN(v));
      weights[ind.axis][ind.id]=vals.length?mean(vals):0;
    });
    ['attractiveness','competitiveness'].forEach(axis=>{
      const sum=Object.values(weights[axis]).reduce((a,b)=>a+b,0);
      if(sum>0) Object.keys(weights[axis]).forEach(k=>weights[axis][k]/=sum);
    });
    d.weights=weights;
    ['attractiveness','competitiveness'].forEach(axis=>{
      state.work2[axis].indicators.forEach(ind=>{
        ind.weight=weights[axis][ind.id]||0;
        const vals=r2.map(r=>Number(r.ratings?.[ind.id])).filter(v=>!isNaN(v));
        ind.support=vals.length; ind.source='delphi';
      });
    });
    d.finalSynthesis = (d.synthesis?.summary||'') + '\n\n第二轮共识已形成，权重取所有专家第二轮评分的均值并归一化。';
    d.status='done'; delete d.phase;
    autosave();
  }catch(e){
    if(task.aborted || (e && e.name==='AbortError')){ d.status='paused'; }
    else { d.status='error'; d.error=e.message; showToast('Delphi 失败: '+e.message); }
    autosave();
  }finally{
    Runner.finish();
    Work2.rerender('delphi');
  }
};
Work2.refreshDynamic=function(id){
  if(id==='delphi'){
    const sec=document.querySelector('#steps2 .step[data-step="delphi"]');
    if(!sec) return;
    const bar=sec.querySelector('.progress-bar > div');
    const d=state.work2.delphi;
    if(bar){
      const total=d.panel.length*2; // 2 rounds
      const done=d.panel.filter(e=>e.round1).length + d.panel.filter(e=>e.round2).length;
      bar.style.transform='scaleX('+(done/total)+')';
    }
    const st=sec.querySelector('p.mono');
    if(st) st.textContent=Work2.delphiStatus();
  }
};

/* ---------- MARKETS ---------- */
Work2.render.markets = function(sec){
  const m=state.work2.markets;
  const table=el('div',{class:'table-wrap'});
  const t=el('table',{class:'data'});
  t.innerHTML='<thead><tr><th>市场名称</th><th>地区</th><th>人口/规模</th><th>人均 GDP / 关键事实</th><th>备注</th><th style="width:50px"></th></tr></thead>';
  const tb=el('tbody');
  m.forEach((mk,i)=>{
    const tr=el('tr');
    tr.appendChild(el('td',{},el('input',{value:mk.name,oninput:e=>{mk.name=e.target.value;autosave();App.updateSummary()}})));
    tr.appendChild(el('td',{},el('input',{value:mk.region,oninput:e=>{mk.region=e.target.value;autosave()}})));
    tr.appendChild(el('td',{},el('input',{value:mk.population,oninput:e=>{mk.population=e.target.value;autosave()}})));
    tr.appendChild(el('td',{},el('input',{value:mk.gdpPerCapita,oninput:e=>{mk.gdpPerCapita=e.target.value;autosave()}})));
    tr.appendChild(el('td',{},el('textarea',{rows:1,oninput:e=>{mk.notes=e.target.value;autosave()}},mk.notes)));
    tr.appendChild(el('td',{},el('button',{class:'ghost small',onclick:()=>{m.splice(i,1);autosave();Work2.renderStep('markets')},},'删除')));
    tb.appendChild(tr);
  });
  t.appendChild(tb); table.appendChild(t); sec.appendChild(table);
  sec.appendChild(el('div',{class:'row'},
    el('button',{onclick:()=>{m.push({id:uid('m'),name:'',region:'',population:'',gdpPerCapita:'',notes:'',scores:{}});autosave();Work2.renderStep('markets')}},'+ 添加市场'),
  ));

  const ai=el('div',{class:'ai-box'});
  const btn=el('button',{class:'primary',onclick:()=>{
    const n=state.work2.scope.candidateCount||4;
    API.aiButton({
      button:btn,container:ai,aiScope:'work2.markets',
      buildPrompt:()=>[{role:'system',content:`你是国际市场顾问。基于 SBU 与范围，生成 ${n} 个差异化候选市场。输出 JSON: {"markets":[{"name":"","region":"","population":"","gdpPerCapita":"","notes":""}]}`},
        {role:'user',content:`SBU:${state.work1.sbu.name}\n品类:${state.work1.sbu.category}\n范围:${state.work1.sbu.scope}\n决策:${state.work2.scope.question}`}],
      onResult:r=>{
        if(!r?.markets)return;
        state.work2.markets = r.markets.map(x=>({id:uid('m'),scores:{},...x}));
        autosave(); Work2.renderStep('markets');
      }
    });
  }},'用 AI 生成候选市场');
  ai.appendChild(btn); sec.appendChild(ai);
};

/* ---------- SCORING ---------- */
Work2.render.scoring = function(sec){
  const mks=state.work2.markets;
  const aInd=state.work2.attractiveness.indicators, cInd=state.work2.competitiveness.indicators;
  if(!mks.length){ sec.appendChild(el('div',{class:'warning'},'请先添加候选市场。')); return; }
  if(!aInd.length||!cInd.length){ sec.appendChild(el('div',{class:'warning'},'请先完成指标体系。')); return; }

  // controls
  const ai=el('div',{class:'ai-box'});
  const allBtn=el('button',{class:'primary',onclick:()=>Work2.aiScoreAll(allBtn,ai)},'AI 一键全部评分');
  ai.appendChild(allBtn);
  sec.appendChild(ai);

  ['attractiveness','competitiveness'].forEach((axis,idx)=>{
    sec.appendChild(el('h3',{}, idx===0?'市场吸引力':'企业竞争力'));
    const inds = axis==='attractiveness'?aInd:cInd;
    const table=el('div',{class:'table-wrap'});
    const t=el('table',{class:'data'});
    const head=el('thead'); const hr=el('tr');
    hr.appendChild(el('th',{},'市场'));
    inds.forEach(ind=>hr.appendChild(el('th',{title:ind.rubric?.high||''}, ind.name+'\n(w='+(ind.weight?Math.round(ind.weight*100)+'%':'-')+')')));
    head.appendChild(hr); t.appendChild(head);
    const tb=el('tbody');
    mks.forEach(mk=>{
      const tr=el('tr');
      tr.appendChild(el('td',{style:{'font-family':'var(--font-display)','font-style':'italic'}}, mk.name));
      inds.forEach(ind=>{
        const val=mk.scores[ind.id];
        const src=mk['src_'+ind.id];
        const td=el('td',{class:'score-cell'});
        const inp=el('input',{type:'number',min:0,max:10,step:0.1,value:val??'',placeholder:'—',
          oninput:e=>{ mk.scores[ind.id]=parseFloat(e.target.value); mk['src_'+ind.id]='user'; autosave(); }});
        td.appendChild(inp);
        if(src==='ai' && val!=null){
          const dot=el('span',{class:'ai-mark',title:'AI 生成，编辑后变为人工'});
          td.appendChild(dot);
          inp.addEventListener('input',()=>dot.remove());
        }
        if(mk['e_'+ind.id]){
          td.appendChild(el('div',{class:'hint',style:'max-width:180px;white-space:normal;text-transform:none;letter-spacing:0'}, mk['e_'+ind.id]));
        }
        tr.appendChild(td);
      });
      tb.appendChild(tr);
    });
    t.appendChild(tb); table.appendChild(t); sec.appendChild(table);
  });
};
Work2.aiScoreAll = function(btn, container){
  const mks=state.work2.markets;
  const inds=[...state.work2.attractiveness.indicators.map(i=>({...i,axis:'attractiveness'})),...state.work2.competitiveness.indicators.map(i=>({...i,axis:'competitiveness'}))];
  btn.disabled=true; btn.textContent='评分中…';
  Promise.all(mks.map(async mk=>{
    const sys='你是市场进入评分员。根据 SBU 与 rubric，对给定市场在每个指标上打 0-10 分（保留一位小数），并给 30 字内依据。严格输出 JSON。';
    const indBlock=inds.map(i=>`[${i.id}] ${i.name}\n  高分(8-10): ${i.rubric.high}\n  中分(4-7): ${i.rubric.mid}\n  低分(0-3): ${i.rubric.low}`).join('\n');
    const user=`SBU:${state.work1.sbu.name} (${state.work1.sbu.category})\n市场:${mk.name} (${mk.region}, ${mk.population}, ${mk.gdpPerCapita})\n备注:${mk.notes}\n\n指标:\n${indBlock}\n\n输出: {"scores":{"<id>":0-10},"evidence":{"<id>":"30字内依据"}}`;
    try{
      const r=await API.callJson([{role:'system',content:sys},{role:'user',content:user}]);
      if(r?.scores){
        Object.entries(r.scores).forEach(([k,v])=>{
          mk.scores[k]=clamp(Number(v),0,10);
          mk['src_'+k]='ai';
          if(r.evidence?.[k]) mk['e_'+k]=r.evidence[k];
        });
        autosave();
      }
    }catch(e){ console.warn('score failed',mk.name,e); }
  })).then(()=>{ btn.disabled=false;btn.textContent='AI 一键全部评分'; Work2.renderStep('scoring'); showToast('评分完成'); });
};

/* ---------- MATRIX ---------- */
Work2.computeMatrix = function(){
  const mks=state.work2.markets;
  const wA=state.work2.delphi.weights?.attractiveness||{};
  const wC=state.work2.delphi.weights?.competitiveness||{};
  return mks.map(mk=>{
    let a=0,c=0,swA=0,swC=0;
    state.work2.attractiveness.indicators.forEach(ind=>{
      const v=mk.scores[ind.id];
      if(v!=null && !isNaN(v)){
        const w=wA[ind.id]!=null?wA[ind.id]:1/state.work2.attractiveness.indicators.length;
        a+=v*w; swA+=w;
      }
    });
    state.work2.competitiveness.indicators.forEach(ind=>{
      const v=mk.scores[ind.id];
      if(v!=null && !isNaN(v)){
        const w=wC[ind.id]!=null?wC[ind.id]:1/state.work2.competitiveness.indicators.length;
        c+=v*w; swC+=w;
      }
    });
    return {...mk, x:swC?c/swC:c, y:swA?a/swA:a};
  });
};
Work2.render.matrix = function(sec){
  const pts=Work2.computeMatrix();
  if(!pts.length){ sec.appendChild(el('div',{class:'warning'},'请先完成候选市场与评分。')); return; }
  const plate=el('section',{class:'plate'},
    el('span',{class:'plate-label'},'F8 · PLUMB SCATTER · 吸引力 × 竞争力')
  );
  sec.appendChild(plate);
  renderMatrix({
    container:plate, points:pts.map(p=>({id:p.id,label:p.name,x:p.x,y:p.y})),
    xLabel:'企业竞争力（加权）', yLabel:'市场吸引力（加权）',
    xCut:state.work2.matrix.xCut, yCut:state.work2.matrix.yCut,
    selectedId:state.work2.matrix.selectedMarketId,
    qHighHigh:'明星市场（重点投入）',qHighYLowX:'潜力市场（补能力）',
    qlowYHighX:'产能市场（选择性收割）',qLowLow:'放弃市场',
    onSelect:id=>{ state.work2.matrix.selectedMarketId=id; autosave(); Work2.renderStep('matrix'); App.updateSummary(); }
  });

  // controls
  sec.appendChild(el('div',{class:'grid3',style:{marginTop:'14px'}},
    UI.field('X 轴切分线（留空=中位数）', el('input',{type:'number',min:0,max:10,step:0.1,value:state.work2.matrix.xCut??'',oninput:e=>{state.work2.matrix.xCut=e.target.value===''?null:parseFloat(e.target.value);autosave();Work2.renderStep('matrix')}})),
    UI.field('Y 轴切分线（留空=中位数）', el('input',{type:'number',min:0,max:10,step:0.1,value:state.work2.matrix.yCut??'',oninput:e=>{state.work2.matrix.yCut=e.target.value===''?null:parseFloat(e.target.value);autosave();Work2.renderStep('matrix')}})),
    UI.field('矩阵备注', el('input',{type:'text',value:state.work2.matrix.notes,oninput:e=>{state.work2.matrix.notes=e.target.value;autosave()}}))
  ));

  // ranking table
  sec.appendChild(el('h3',{},'排名'));
  const table=el('div',{class:'table-wrap'});
  const t=el('table',{class:'data'});
  t.innerHTML='<thead><tr><th>#</th><th>市场</th><th>吸引力</th><th>竞争力</th><th>象限</th><th>合计</th></tr></thead>';
  const tb=el('tbody');
  const xCut=state.work2.matrix.xCut ?? median(pts.map(p=>p.x));
  const yCut=state.work2.matrix.yCut ?? median(pts.map(p=>p.y));
  [...pts].sort((a,b)=>(b.x+b.y)-(a.x+a.y)).forEach((p,i)=>{
    const q=p.x>=xCut&&p.y>=yCut?'明星':p.x<xCut&&p.y>=yCut?'潜力':p.x>=xCut&&p.y<yCut?'产能':'放弃';
    const tr=el('tr',{},
      el('td',{},String(i+1)),
      el('td',{style:{'font-style':'italic'}},p.name+(p.id===state.work2.matrix.selectedMarketId?' *':'')) ,
      el('td',{class:'mono'},p.y.toFixed(2)),
      el('td',{class:'mono'},p.x.toFixed(2)),
      el('td',{},el('span',{class:'tag '+(q==='明星'?'maroon':'')},q)),
      el('td',{class:'mono'},(p.x+p.y).toFixed(2))
    );
    tb.appendChild(tr);
  });
  t.appendChild(tb); table.appendChild(t); sec.appendChild(table);
};

/* ---------- DECISION ---------- */
Work2.render.decision = function(sec){
  const d=state.work2.decision;
  const sel=state.work2.markets.find(m=>m.id===state.work2.matrix.selectedMarketId);
  sec.appendChild(el('div',{class:'callout'},
    el('span',{class:'callout-title'},'已选目标市场'),
    sel?sel.name+' · '+ (sel.region||''):'尚未在矩阵中选择市场'
  ));
  sec.appendChild(UI.field('选择理由 / 战略契合度', el('textarea',{rows:4,oninput:e=>{d.rationale=e.target.value;autosave()}},d.rationale)));
  sec.appendChild(UI.field('进入次序（如有多个市场）', el('input',{type:'text',value:d.sequence,oninput:e=>{d.sequence=e.target.value;autosave()}})));
  const risks=UI.tagsInput(d.risks||[]);
  risks.el.querySelector('input').addEventListener('blur',()=>{d.risks=risks.get();autosave()});
  sec.appendChild(UI.field('关键风险与对冲方式', risks.el));
  sec.appendChild(UI.field('下一步行动', el('textarea',{rows:3,oninput:e=>{d.nextSteps=e.target.value;autosave()}},d.nextSteps)));

  const ai=el('div',{class:'ai-box'});
  const btn=el('button',{class:'primary',onclick:()=>{
    API.aiButton({
      button:btn,container:ai,aiScope:'work2.decision',
      buildPrompt:()=>[{role:'system',content:'你是国际市场战略顾问。基于矩阵结果给出目标市场选择理由、进入次序与关键风险。输出 JSON: {"rationale":"","sequence":"","risks":[""],"nextSteps":""}'},
        {role:'user',content:`SBU:${state.work1.sbu.name}\n候选市场:\n${Work2.computeMatrix().map(p=>`- ${p.name}: 吸引力 ${p.y.toFixed(2)}, 竞争力 ${p.x.toFixed(2)}`).join('\n')}\n已选: ${sel?.name||'未选'}\n备注: ${state.work2.matrix.notes}`}],
      onResult:r=>{
        if(!r)return;
        d.rationale=r.rationale||d.rationale; d.sequence=r.sequence||d.sequence;
        d.nextSteps=r.nextSteps||d.nextSteps;
        if(Array.isArray(r.risks))d.risks=r.risks;
        autosave(); Work2.renderStep('decision');
      }
    });
  }},'用 AI 起草决策说明');
  ai.appendChild(btn); sec.appendChild(ai);
};

/* ---------- EXPORT ---------- */
Work2.exportMd = function(){
  const d=state.work2;
  let out=`\n## II. 目标市场选择\n\n### 1. 决策范围\n- **问题**：${d.scope.question}\n- **时间窗口**：${d.scope.timeframe}\n- **约束**：${d.scope.constraints}\n\n`;
  out+=`### 2. 指标体系\n**吸引力**：\n`;
  d.attractiveness.indicators.forEach(i=>out+=`- ${i.name}（权重 ${Math.round((i.weight||0)*100)}%）— 高：${i.rubric.high}；中：${i.rubric.mid}；低：${i.rubric.low}\n`);
  out+=`\n**竞争力**：\n`;
  d.competitiveness.indicators.forEach(i=>out+=`- ${i.name}（权重 ${Math.round((i.weight||0)*100)}%）— 高：${i.rubric.high}；中：${i.rubric.mid}；低：${i.rubric.low}\n`);
  out+=`\n### 3. Delphi 综合\n${d.delphi.finalSynthesis||''}\n\n`;
  out+=`### 4–6. 候选市场评分与矩阵\n`;
  Work2.computeMatrix().forEach(p=>{
    out+=`- **${p.name}** (${p.region||''}) — 吸引力 ${p.y.toFixed(2)}，竞争力 ${p.x.toFixed(2)}\n`;
  });
  const sel=d.markets.find(m=>m.id===d.matrix.selectedMarketId);
  out+=`\n### 7. 决策\n- **目标市场**：${sel?.name||'未选'}\n- **理由**：${d.decision.rationale}\n- **进入次序**：${d.decision.sequence}\n- **风险**：${(d.decision.risks||[]).join('；')}\n- **下一步**：${d.decision.nextSteps}\n`;
  return out;
};
