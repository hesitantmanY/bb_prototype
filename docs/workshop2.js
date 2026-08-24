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
  // 工具栏「随机生成示例」只挂在 scope step-header 上（用户点哪个 tab 看到的都是它）
  if(id==='scope') Work2.mountRandomExample(sec);
  const fn=Work2.render[id]; if(fn) fn(sec);
  sec.dataset.rendered='1';
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
      button:btn,container:ai,
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
  const statusText=el('p',{class:'mono',style:'font-size:11px;color:var(--muted)'}, Work2.delphiStatus());
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
      button:btn,container:ai,
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
      button:btn,container:ai,
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

/* ============================================================
   RandomExample — Work 2
   工具栏挂在「scope」子 step 的 step-header。覆盖范围：scope +
   指标体系 + 候选市场 + 矩阵。Delphi 留空（用户自己跑）。
   ============================================================ */
const WORK2_SAMPLES = [
  // 样本 1：东南亚茶品牌（山木茶事实战化简版）
  {
    scope: { question:'首阶段进入哪个东南亚市场能最大化品牌资产积累？',
      timeframe:'18 个月内启动，第 36 个月实现首站盈利',
      constraints:'首阶段预算 USD 1.2M；不与母公司经销网重叠；清真认证在印尼可推迟 12+ 月',
      candidateCount:3 },
    attractiveness: { indicators:[
      { id:'a1', name:'市场规模与增长', source:'user', rubric:{high:'精品茶年增速 ≥15% 且人均茶消费 ≥SGD 80/年', mid:'精品茶年增速 8-15% 或人均茶消费 SGD 40-80', low:'精品茶年增速 <8% 或人均茶消费 <SGD 40'} },
      { id:'a2', name:'华人密度与文化亲和', source:'user', rubric:{high:'华人占比 ≥25% 且对中餐/茶接受度高', mid:'华人占比 10-25% 或部分接受', low:'华人占比 <10% 或接受度低'} },
      { id:'a3', name:'数字渠道成熟度', source:'user', rubric:{high:'Shopee/Lazada/TikTok Shop GMV 占比茶品类 ≥30%', mid:'15-30%', low:'<15%'} },
      { id:'a4', name:'法规与清真友好度', source:'user', rubric:{high:'食品进口合规清晰, 清真认证成熟或可推迟', mid:'合规需 6-12 月, 清真可选', low:'合规 >12 月, 清真强制'} }
    ]},
    competitiveness: { indicators:[
      { id:'c1', name:'品牌资产可迁移', source:'user', rubric:{high:'中文文化叙事可直接迁移且不冲突', mid:'需翻译/本地化 <3 月', low:'需重塑品牌'} },
      { id:'c2', name:'供应链与产地复用度', source:'user', rubric:{high:'复用母公司 80%+ 供应链, 海运 <14 天', mid:'复用 50-80%, 海运 14-21 天', low:'<50% 复用'} },
      { id:'c3', name:'团队与渠道资源', source:'user', rubric:{high:'有现成海外团队/代理/合资伙伴', mid:'可 6 月内建立', low:'需 12+ 月从零建设'} }
    ]},
    markets: [
      { id:'m1', name:'新加坡', region:'东南亚·城邦', population:'5.9M', gdpPerCapita:'USD 84,000',
        notes:'TWG 主战场, 华人占 75%, 数字渠道成熟, 食品进口合规最快',
        scores: {a1:9, a2:10, a3:9, a4:9, c1:9, c2:8, c3:8} },
      { id:'m2', name:'吉隆坡', region:'东南亚·马来西亚', population:'8.4M', gdpPerCapita:'USD 28,000',
        notes:'华人 23%, 本地老字号各占一边, Shopee 渗透高',
        scores: {a1:7, a2:6, a3:8, a4:7, c1:8, c2:7, c3:6} },
      { id:'m3', name:'雅加达', region:'东南亚·印尼', population:'11M', gdpPerCapita:'USD 13,000',
        notes:'华人 <7%, 清真强制, 数字渠道 TikTok Shop 最强',
        scores: {a1:6, a2:3, a3:8, a4:3, c1:6, c2:5, c3:4} }
    ],
    matrix: { selectedMarketId:'m1', xCut:6.5, yCut:6.5, notes:'新加坡位于高吸引力+高竞争力象限。雅加达数字渠道强但合规是硬门槛。' },
    decision: { rationale:'新加坡在吸引力 4 维中 3 维得分 ≥9, 竞争力 3 维中 2 维 ≥8, 是唯一落在"高吸引力+高竞争力"象限的市场。雅加达数字渠道虽强, 但合规与文化亲和是结构性短板, 不符合 18 月启动目标。吉隆坡介于两者之间, 36 月窗口可作为第二阶段。',
      sequence:'M0-3: 新加坡公司注册 + 食品合规 + Shopee/Lazada 上线; M4-9: AR 溯源 + 节气订阅首发; M10-18: KOL 矩阵 + 第二城市评估',
      risks:['TWG 在新加坡百货的强势可能挤压"高端"心智','清真认证推迟后印尼市场进入窗口延后 12+ 月','订阅模式在新加坡早期接受度低需 KOC 验证'],
      nextSteps:'新加坡公司注册 → 母公司供应链签出口合同 → Shopee SG 旗舰店 6 月上线 → 7 月 AR 溯源首发 → 9 月节气订阅季首期' }
  },
  // 样本 2：欧洲设计师家居
  {
    scope: { question:'原创设计家居在欧洲的优先进驻城市组合是什么？',
      timeframe:'24 个月在 2 个城市启动 DTC 站 + 买手店',
      constraints:'首阶段预算 EUR 0.8M；不通过亚马逊；必须在 2 个城市建立品牌露出',
      candidateCount:3 },
    attractiveness: { indicators:[
      { id:'a1', name:'设计消费力', source:'user', rubric:{high:'人均设计消费 ≥EUR 200/年且独立买手店密度高', mid:'EUR 100-200/年', low:'<EUR 100/年'} },
      { id:'a2', name:'设计展与媒体话语权', source:'user', rubric:{high:'每年有国际级设计周+主流设计媒体总部', mid:'区域级设计展', low:'无设计展/媒体'} },
      { id:'a3', name:'中产与年轻客群规模', source:'user', rubric:{high:'25-40 岁中产 ≥2M 且城市化率高', mid:'1-2M', low:'<1M'} }
    ]},
    competitiveness: { indicators:[
      { id:'c1', name:'品牌叙事兼容度', source:'user', rubric:{high:'当代极简/东方美学叙事能直接沟通', mid:'需微调视觉', low:'风格冲突需重塑'} },
      { id:'c2', name:'海运/仓储可达性', source:'user', rubric:{high:'汉堡/鹿特丹港 14 天内可达 + 第三方海外仓成熟', mid:'海运 14-21 天', low:'海运 >21 天或仓储复杂'} },
      { id:'c3', name:'独立设计渠道渗透', source:'user', rubric:{high:'独立买手店/DTC 设计师品牌已成主流', mid:'部分买手店但大卖场仍主导', low:'大卖场为主, 独立买手店稀缺'} }
    ]},
    markets: [
      { id:'m1', name:'阿姆斯特丹', region:'欧洲·荷兰', population:'0.9M', gdpPerCapita:'EUR 60,000',
        notes:'设计周主场, 北欧设计集群, 独立买手店密度欧洲第一',
        scores: {a1:9, a2:10, a3:7, c1:9, c2:10, c3:10} },
      { id:'m2', name:'柏林', region:'欧洲·德国', population:'3.7M', gdpPerCapita:'EUR 50,000',
        notes:'Designmai + DMY 设计周, 客群偏年轻极简, 但分销渠道碎片化',
        scores: {a1:7, a2:8, a3:8, c1:8, c2:9, c3:7} },
      { id:'m3', name:'米兰', region:'欧洲·意大利', population:'1.4M', gdpPerCapita:'EUR 45,000',
        notes:'米兰设计周主战场, 但本土品牌强势, 东方美学准入壁垒高',
        scores: {a1:8, a2:10, a3:6, c1:5, c2:8, c3:6} }
    ],
    matrix: { selectedMarketId:'m1', xCut:7.0, yCut:7.0, notes:'阿姆斯特丹是高吸引+高竞争力象限唯一解。米兰话语权高但品牌叙事冲突。' },
    decision: { rationale:'阿姆斯特丹在 3 维吸引力全部 ≥7, 3 维竞争力全部 ≥9, 是首阶段双城之一的必然选择。柏林作为第二城, 客群结构与 DTC 渠道契合但分销需自建。米兰话语权最强但与东方美学叙事冲突, 留待第三阶段。',
      sequence:'M0-3: 阿姆斯特丹 DTC 站上线 + 与 3 家买手店签约; M4-9: 柏林 DTC 站 + DMY 参展; M10-18: 米兰设计周试水',
      risks:['欧洲家居需求 Q4 集中, 库存周转压力大','独立买手店账期长（60-90 天）','物流成本在 14 天海运线之外难以竞争'],
      nextSteps:'阿姆斯特丹 DTC 站 4 月上线 → 6 月与底特律设计集合店签约 → 9 月柏林 DMY 参展 → 12 月米兰设计周预热' }
  }
];

// 把样本暴露到 Work2 命名空间，方便 Work5 链式触发
Work2.WORK2_SAMPLES = WORK2_SAMPLES;

// 把 applySample 提到命名空间上，AI 模式也能复用同一份填入逻辑
Work2._applyWork2Sample = function(s){
  const d = state.work2;
  // scope（缺失字段保持原值）
  d.scope.question = s.scope?.question || d.scope.question;
  d.scope.timeframe = s.scope?.timeframe || d.scope.timeframe;
  d.scope.constraints = s.scope?.constraints || d.scope.constraints;
  d.scope.candidateCount = s.scope?.candidateCount || d.scope.candidateCount;
  // indicators
  if(s.attractiveness?.indicators?.length){
    d.attractiveness.indicators = s.attractiveness.indicators.map(x => ({
      id: 'a' + uid('ind').slice(-4), name: x.name || '', source: x.source || 'user',
      weight: 0, support: 0,
      rubric: { high: x.rubric?.high || '', mid: x.rubric?.mid || '', low: x.rubric?.low || '' }
    }));
  }
  if(s.competitiveness?.indicators?.length){
    d.competitiveness.indicators = s.competitiveness.indicators.map(x => ({
      id: 'c' + uid('ind').slice(-4), name: x.name || '', source: x.source || 'user',
      weight: 0, support: 0,
      rubric: { high: x.rubric?.high || '', mid: x.rubric?.mid || '', low: x.rubric?.low || '' }
    }));
  }
  // 重置 Delphi
  d.delphi = Work2.defaultData().delphi;
  d.delphi.panel = Work2.EXPERTS.map(e => ({...e, round1:null, round2:null}));
  // markets
  if(s.markets?.length){
    d.markets = s.markets.map(m => ({
      id: uid('m'), name: m.name || '', region: m.region || '',
      population: m.population || '', gdpPerCapita: m.gdpPerCapita || '',
      notes: m.notes || '',
      scores: {...(m.scores || {})}
    }));
    // 重建 sample.scores 的 key 映射到新 indicator id
    const aMap = {}; (s.attractiveness?.indicators || []).forEach((x, i) => aMap[x.id] = d.attractiveness.indicators[i]?.id);
    const cMap = {}; (s.competitiveness?.indicators || []).forEach((x, i) => cMap[x.id] = d.competitiveness.indicators[i]?.id);
    d.markets.forEach((m, mi) => {
      const newScores = {};
      const sScores = s.markets[mi]?.scores || {};
      Object.keys(sScores).forEach(k => {
        if(k.startsWith('a') && aMap[k]) newScores[aMap[k]] = sScores[k];
        else if(k.startsWith('c') && cMap[k]) newScores[cMap[k]] = sScores[k];
        else newScores[k] = sScores[k]; // 兜底：保留原 key
      });
      m.scores = newScores;
    });
  }
  // matrix
  if(s.matrix && Object.keys(s.matrix).length){
    d.matrix = {...d.matrix, ...s.matrix};
    d.matrix.selectedMarketId = d.markets[0] ? d.markets[0].id : null;
  }
  // decision
  if(s.decision && Object.keys(s.decision).length){
    d.decision = {...d.decision, ...s.decision};
  }
};

Work2.mountRandomExample = function(sec){
  if(!window.RandomExample) return;
  window.RandomExample.mount({
    section: sec,
    workKey: 'work2',
    samples: WORK2_SAMPLES,
    coverMsg: '这会覆盖 Work 2 当前的目标市场选择内容（scope/指标/市场/矩阵/决策），继续？',
    hasData: () => {
      const d = state.work2;
      return !!(d.scope.question || d.markets.length || d.attractiveness.indicators.length || d.competitiveness.indicators.length);
    },
    applySample: (s) => Work2._applyWork2Sample(s),
    rerenderIds: ['scope','indicators','delphi','markets','scoring','matrix','decision'],
    buildPrompt: () => [
      {role:'system', content:'你是国际市场进入战略专家。基于给定 SBU 与决策范围, 生成一套完整的目标市场选择示例(覆盖 7 步)。输出 JSON: {"scope":{"question":"","timeframe":"","constraints":"","candidateCount":3},"attractiveness":{"indicators":[{"id":"a1","name":"","rubric":{"high":"","mid":"","low":""}}]},"competitiveness":{"indicators":[{"id":"c1","name":"","rubric":{"high":"","mid":"","low":""}}]},"markets":[{"name":"","region":"","population":"","gdpPerCapita":"","notes":"","scores":{"a1":0-10,"c1":0-10}}],"matrix":{"xCut":0-10,"yCut":0-10,"notes":""},"decision":{"rationale":"","sequence":"","risks":[""],"nextSteps":""}}。Delphi 不需要填, 由用户自己跑。selectedMarketId 省略, 系统会用第一个市场。'},
      {role:'user', content:`SBU: ${state.work1.sbu.name}\n品类: ${state.work1.sbu.category}\n地理范围: ${state.work1.sbu.scope}\n决策范围: ${state.work2.scope.question || '(用户尚未填)'}`}
    ],
    onAiResult: (r, {refresh}) => {
      if(!r){ showToast('AI 返回为空'); return; }
      Work2._applyWork2Sample({
        scope: r.scope,
        attractiveness: r.attractiveness,
        competitiveness: r.competitiveness,
        markets: r.markets,
        matrix: r.matrix,
        decision: r.decision
      });
      refresh();
    }
  });
};

