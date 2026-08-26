/* ============================================================
   WORKSHOP 3 — 价值主张与定位
   Steps: context / mining / candidates / matrix / proposition
   ============================================================ */
Work3.steps = [
  {id:'context', label:'1. 上游接入'},
  {id:'mining', label:'2. 卖点挖掘'},
  {id:'candidates', label:'3. 备选卖点'},
  {id:'matrix', label:'4. 合意性 × 可实施性'},
  {id:'proposition', label:'5. 主张/定位/人格'}
];

Work3.DEFAULT_DESIRABILITY_DIMS = [
  {key:'importance', label:'重要性', definition:'这个卖点对客户有多重要'},
  {key:'uniqueness', label:'独特性', definition:'竞品是否也在说/做'},
  {key:'credibility', label:'可信性', definition:'客户凭什么相信你能做到'}
];
Work3.DEFAULT_IMPLEMENTABILITY_DIMS = [
  {key:'feasibility', label:'可行性', definition:'技术/供应链/成本能否实现'},
  {key:'communicability', label:'可传播性', definition:'能否用一句话让客户听懂'},
  {key:'sustainability', label:'可持续性', definition:'能否长期维持、不被轻易复制'}
];

Work3.defaultData = () => ({
  context: { sbuName:'', targetMarket:'', personas:[], hasSurvey:false },
  mining: {
    documents: [],
    includeWork1Open:true, includeWork1Themes:true,
    ldaParams:{ k:5, passes:15, iterations:100, no_below:2, no_above:0.5 },
    ldaResult:null,    // from backend
    ldaError:null,
    topics: [],        // [{id,label,share,keywords:[],representative_docs:[]}]
    wordFreqTop:[],
    stats:null,
    painMap:[]         // [{id,pain,evidence,frequency,linkedNeeds:[],linkedTopicId,type:'痛点'|'痒点'}]
  },
  candidates: [],
  dimensions: {
    desirability: Work3.DEFAULT_DESIRABILITY_DIMS.map(d=>({...d})),
    implementability: Work3.DEFAULT_IMPLEMENTABILITY_DIMS.map(d=>({...d}))
  },
  matrix: { showSector:true, sectorAngle:90, sectorRadius:12, xCut:null, yCut:null, manualSelected:[] },
  migration: { analyses:[] },
  proposition: {
    coreValueIds:[], alternatives:[], chosenValueText:'',
    positioning:{brand:'',audience:'',coreValue:'',category:''},
    positioningStatement:'',
    sloganOptions:[], chosenSlogan:'',
    mbti:'', personalityTraits:[]
  }
});

Work3.renderStep = function(id){
  const sec=document.querySelector('#steps3 .step[data-step="'+id+'"]');
  if(!sec) return;
  if(sec.dataset.rendered==='1'){ Work3.refreshDynamic(id); return; }
  sec.innerHTML='';
  const idx3 = Work3.steps.findIndex(s=>s.id===id);
  sec.appendChild(el('div',{class:'sub-head'},
    el('span',{class:'num'},'3.'+(idx3+1)),
    el('h3',{}, Work3.titles[id])
  ));
  const subEl3 = Work3.subtitles && Work3.subtitles[id];
  if(subEl3){
    sec.appendChild(el('p',{class:'lede', style:{fontFamily:'var(--font-display)', fontStyle:'normal', fontSize:'1.125rem', lineHeight:1.5, color:'var(--color-ink)', maxWidth:'62ch', margin:'0 0 28px'}}, subEl3));
  }
  sec.appendChild(el('div',{class:'plate plate--empty'}));
  const dn=UI.demoNote(3,id); if(dn) sec.appendChild(dn);
  // 工具栏「随机生成示例」只挂在 context step-header
  // 顶栏"演示案例"菜单接管样本注入；Work 3 不再单独挂"随机生成示例"按钮。
  if(Work3.mvo && Work3.mvo[id]) sec.appendChild(UI.mvoCard(Work3.mvo[id](), sec));
  const fn=Work3.render[id]; if(fn) fn(sec);
  sec.dataset.rendered='1';
};

Work3.mvo = {
  context: () => ({
    checks: [
      {label:'已读取 SBU 与品类', test:()=>!!(state.work1?.sbu?.name)},
      {label:'已读取 Work 2 目标市场', test:()=>!!(state.work3.context.targetMarket)},
      {label:'至少 2 个客户画像', test:()=>(state.work3.context.personas||[]).length>=2},
    ],
    note:'本步是接入层。如果上游（Work 1/2）是空的，先回去补齐，否则卖点和主张都是空中楼阁。'
  }),
  mining: () => ({
    checks: [
      {label:'已导入/粘贴语料并跑 LDA 主题', test:()=>(state.work3.mining.topics||[]).length>0},
      {label:'痛点地图至少 5 条（含痛点和痒点）', test:()=>(state.work3.mining.painMap||[]).length>=5},
    ],
    note:'没有真实语料（评论、访谈、客服记录）时，LDA 和痛点都只是 LLM 的想象——尽量上传你自己的资料。'
  }),
  candidates: () => ({
    checks: [
      {label:'备选卖点 ≥6 个', test:()=>state.work3.candidates.length>=6},
      {label:'每个卖点绑定了痛点与证据', test:()=>state.work3.candidates.every(c=>(c.pain||'').trim().length>0)},
    ],
    note:'卖点要具体到"客户能感知的利益"，而不是"品质卓越""服务一流"这类正确的废话。'
  }),
  matrix: () => ({
    checks: [
      {label:'卖点已打合意性与可实施性分', test:()=>state.work3.candidates.every(c=>c.desirability!=null&&c.implementability!=null)},
      {label:'已确定扇面内的入选卖点', test:()=>state.work3.candidates.some(c=>c.selected)},
    ],
    note:'落在"高合意、低可实施"象限的卖点不要丢——那正是迁移路径要解决的问题。'
  }),
  proposition: () => ({
    checks: [
      {label:'已写价值主张（为谁/提供什么/有何不同）', test:()=>(state.work3.proposition.chosenValueText||'').trim().length>10},
      {label:'已写定位句', test:()=>{const p=state.work3.proposition.positioning||{};return !!(p.differentiator||p.statement);}},
      {label:'已选品牌人格', test:()=>!!(state.work3.proposition.mbti||(state.work3.proposition.personalityTraits||[]).length)},
    ],
    note:'主张、定位、人格必须自洽——一个"高端专业"的定位配"搞笑接地气"的人格会撕裂品牌。'
  }),
};
Work3.rerender = function(id){
  const sec=document.querySelector('#steps3 .step[data-step="'+id+'"]');
  if(!sec) return;
  sec.dataset.rendered='0';
  Work3.renderStep(id);
};
Work3.titles={
  context:'上游接入', mining:'卖点挖掘 (LDA + 痛点地图)', candidates:'备选卖点',
  matrix:'合意性 × 可实施性矩阵', proposition:'价值主张、定位与品牌人格'
};
Work3.subtitles={
  context:'Work 3 读取 Work 1 的 SBU/画像/价值框架以及 Work 2 选定的目标市场。',
  mining:'粘贴或导入评论文本，用本地 Python 服务运行 LDA 主题建模，再让 AI 归纳痛点地图。',
  candidates:'从痛点地图生成 8–12 个备选卖点；可增删改、绑定痛点与证据。',
  matrix:'逐 persona 打合意性子分 + AI 评可实施性子分；扇面筛选明星卖点，扇面外生成迁移路径。',
  proposition:'从入选卖点写价值主张、定位句、品牌人格（MBTI）与 slogan。不做 logo/视觉系统。'
};
Work3.render={};

/* ---------- CONTEXT ---------- */
Work3.render.context = function(sec){
  const plate = sec.querySelector('.plate');
  const c=state.work3.context;
  c.sbuName = state.work1.sbu.name;
  const selMkt = state.work2.markets.find(m=>m.id===state.work2.matrix.selectedMarketId);
  c.targetMarket = selMkt? selMkt.name+' — '+ (selMkt.reason||selMkt.region||'') : '';
  c.personas = state.work1.personas.map(p=>({id:p.id,name:p.name,painPoints:p.painPoints,values:p.values,quote:p.quote}));
  c.hasSurvey = state.work1.survey.responses.length>0;

  const bar=el('div',{class:'callout'},
    el('span',{class:'callout-title'},'UPSTREAM CONTEXT'),
    el('div',{class:'grid3',style:{marginTop:'8px'}},
      el('div',{}, el('div',{class:'hint'},'SBU'), el('div',{style:{'font-family':'var(--font-display)','font-style':'normal','font-size':'18px'}}, c.sbuName||'—')),
      el('div',{}, el('div',{class:'hint'},'目标市场'), el('div',{style:{'font-family':'var(--font-display)','font-style':'normal','font-size':'18px'}}, c.targetMarket||'— 请在 Work 2 选择')),
      el('div',{}, el('div',{class:'hint'},'客户画像 / 合成调研'),
        el('div',{class:'mono',style:{'font-size':'12px'}},`${c.personas.length} 位画像 · ${c.hasSurvey?'调研已完成':'调研未完成（将用 AI 直接评分）'}`))
    )
  );
  plate.appendChild(bar);
  if(!c.hasSurvey){
    plate.appendChild(el('div',{class:'warning'},'Work 1 没有合成调研数据。合意性评分将回退到「AI 直接打分」模式（无逐 persona 子分）。'));
  }
  plate.appendChild(el('p',{class:'muted'},'本步骤的内容由上游自动同步，无需填写。点击顶栏的标签可跳转回 Work 1/2 修改。'));
};

/* ---------- MINING ---------- */
Work3.render.mining = function(sec){
  const plate = sec.querySelector('.plate');
  const m=state.work3.mining;

  // Document input
  plate.appendChild(el('h3',{},'语料输入'));
  const docsCard=el('div',{class:'plate'});
  docsCard.appendChild(el('span',{class:'plate-label'},`${m.documents.length} 条文档`));
  const docList=el('div',{style:{maxHeight:'180px',overflow:'auto',marginBottom:'10px'}});
  function renderDocs(){
    docList.innerHTML='';
    m.documents.slice(0,50).forEach((d,i)=>{
      const row=el('div',{style:{display:'flex',gap:'8px','align-items':'flex-start',padding:'4px 0',borderBottom:'1px solid var(--color-rule)'}},
        el('span',{class:'mono',style:{'font-size':'11px',color:'var(--color-ink-2)','min-width':'28px'}}, '#'+(i+1)),
        el('div',{style:{flex:1,'font-size':'13px'}}, d.slice(0,180)+(d.length>180?'…':'')),
        el('button',{class:'ghost small',onclick:()=>{m.documents.splice(i,1);autosave();renderDocs();}},'×')
      );
      docList.appendChild(row);
    });
    if(m.documents.length>50) docList.appendChild(el('p',{class:'hint'},`还有 ${m.documents.length-50} 条未显示`));
  }
  renderDocs();
  docsCard.appendChild(docList);

  const paste=el('textarea',{rows:4,placeholder:'粘贴评论/访谈/工单，每行一条或空行分隔…'});
  docsCard.appendChild(paste);
  docsCard.appendChild(el('div',{class:'ai-actions',style:{'margin-top':'8px'}},
    el('button',{onclick:()=>{
      const lines=paste.value.split(/\n\s*\n|\n/).map(s=>s.trim()).filter(Boolean);
      m.documents.push(...lines); paste.value=''; autosave(); renderDocs();
    }},'添加到语料'),
    el('label',{class:'ghost',style:{display:'inline-flex',alignItems:'center',gap:'6px',cursor:'pointer','font-family':'var(--font-mono)','font-size':'11px','letter-spacing':'.15em','padding':'9px 16px'}},
      '导入 Excel/CSV',
      el('input',{type:'file',accept:'.xlsx,.xls,.csv,.txt',style:{display:'none'},onchange:e=>Work3.importExcel(e.target.files[0],renderDocs)})
    ),
    el('button',{class:'ghost',onclick:()=>{ if(confirm('清空全部语料？')){m.documents=[];autosave();renderDocs();}}},'清空')
  ));
  plate.appendChild(docsCard);

  // Include Work 1
  const inc1=el('label',{style:{display:'flex',gap:'8px','align-items':'center','font-family':'var(--font-body)','text-transform':'none','letter-spacing':0}},
    el('input',{type:'checkbox',checked:m.includeWork1Open,onchange:e=>{m.includeWork1Open=e.target.checked;autosave()}}),
    '包含 Work 1 开放题答案');
  const inc2=el('label',{style:{display:'flex',gap:'8px','align-items':'center','font-family':'var(--font-body)','text-transform':'none','letter-spacing':0}},
    el('input',{type:'checkbox',checked:m.includeWork1Themes,onchange:e=>{m.includeWork1Themes=e.target.checked;autosave()}}),
    '包含 Work 1 主题文本');
  plate.appendChild(el('div',{class:'row',style:{'max-width':'500px'}}, inc1, inc2));

  // LDA params
  plate.appendChild(el('h3',{},'LDA 参数'));
  const p=m.ldaParams;
  const paramGrid=el('div',{class:'grid4'},
    UI.field('K 主题数', el('input',{type:'number',min:2,max:15,value:p.k,oninput:e=>{p.k=parseInt(e.target.value);autosave()}})),
    UI.field('passes', el('input',{type:'number',min:1,max:50,value:p.passes,oninput:e=>{p.passes=parseInt(e.target.value);autosave()}})),
    UI.field('iterations', el('input',{type:'number',min:10,max:500,value:p.iterations,oninput:e=>{p.iterations=parseInt(e.target.value);autosave()}})),
    UI.field('no_below', el('input',{type:'number',min:1,max:20,value:p.no_below,oninput:e=>{p.no_below=parseInt(e.target.value);autosave()}}))
  );
  plate.appendChild(paramGrid);
  plate.appendChild(UI.field('no_above', el('input',{type:'number',min:0.1,max:1,step:0.05,value:p.no_above,oninput:e=>{p.no_above=parseFloat(e.target.value);autosave()}})));

  const ai=el('div',{class:'ai-box'});
  const runBtn=el('button',{class:'primary',onclick:()=>Work3.runLDA(runBtn,ai)}, backendOnline?'运行 LDA（本地服务）':'运行 LDA（本地服务未连接，将用 LLM 模拟）');
  ai.appendChild(runBtn);
  plate.appendChild(ai);

  if(m.ldaError) plate.appendChild(el('div',{class:'warning'},m.ldaError));

  // Results
  if(m.stats){
    plate.appendChild(el('hr',{class:'rule'}));
    plate.appendChild(el('h3',{},'LDA 结果'));
    const st=el('div',{class:'grid4'});
    [['原始文档',m.stats.raw_count],['有效文档',m.stats.valid_count],['总词数',m.stats.total_words],['词典大小',m.stats.vocab_size]].forEach(([k,v])=>{
      st.appendChild(el('div',{class:'card',style:{padding:'12px'}},
        el('div',{class:'hint'},k),
        el('div',{class:'mono',style:{'font-size':'22px','color':'var(--color-accent)'}}, v ?? '—')));
    });
    if(m.stats.coherence!=null) st.appendChild(el('div',{class:'card',style:{padding:'12px'}},
      el('div',{class:'hint'},'Coherence c_v'),
      el('div',{class:'mono',style:{'font-size':'22px','color':'var(--color-accent)'}}, m.stats.coherence)));
    plate.appendChild(st);

    // word freq
    if(m.wordFreqTop && m.wordFreqTop.length){
      plate.appendChild(el('h4',{},'Top 25 高频词'));
      const wf=el('section',{class:'plate'}, el('span',{class:'plate-label'},'F5 · TICK ROWS · 词频'));
      renderBarChart(wf, m.wordFreqTop.slice(0,15).map(w=>({label:w.word,value:w.count})),{});
      plate.appendChild(wf);
    }

    // topics
    plate.appendChild(el('h4',{},`${m.topics.length} 个主题`));
    const topicsGrid=el('div',{});
    m.topics.forEach(t=>{
      const card=el('div',{class:'card',style:{'margin-bottom':'12px'}});
      card.appendChild(el('div',{style:{display:'flex','justify-content':'space-between','align-items':'baseline'}},
        el('div',{},
          el('input',{type:'text',value:t.label||('主题 '+(t.id+1)),oninput:e=>{t.label=e.target.value;autosave()},
            style:{'font-family':'var(--font-display)','font-style':'normal','font-size':'18px','border-bottom':'1px solid var(--color-rule)'}}),
          el('span',{class:'tag',style:{'margin-left':'8px'}}, '占比 '+t.share+'%')
        )
      ));
      const kw=el('div',{class:'chip-row',style:{'margin-top':'8px'}});
      t.keywords.slice(0,10).forEach(k=>kw.appendChild(el('span',{class:'chip'}, k.word+' '+Math.round(k.weight*100))));
      card.appendChild(kw);
      if(t.representative_docs && t.representative_docs.length){
        const ex=el('details',{style:{'margin-top':'8px'}});
        ex.appendChild(el('summary',{class:'hint'},'代表性文档'));
        t.representative_docs.forEach(d=>ex.appendChild(el('p',{class:'quote'},d)));
        card.appendChild(ex);
      }
      topicsGrid.appendChild(card);
    });
    plate.appendChild(topicsGrid);

    // name topics with AI
    const nameAi=el('div',{class:'ai-box'});
    const nameBtn=el('button',{class:'primary',onclick:()=>Work3.nameTopics(nameBtn,nameAi)},'用 AI 命名主题');
    nameAi.appendChild(nameBtn);
    plate.appendChild(nameAi);
  }

  // Pain map
  plate.appendChild(el('hr',{class:'rule'}));
  plate.appendChild(el('h3',{},'痛点地图'));
  const painAi=el('div',{class:'ai-box'});
  const painBtn=el('button',{class:'primary',onclick:()=>Work3.makePainMap(painBtn,painAi)},'用 AI 生成痛点地图');
  painAi.appendChild(painBtn);
  plate.appendChild(painAi);

  if(m.painMap.length){
    const table=el('div',{class:'table-wrap'});
    const t=el('table',{class:'data'});
    t.innerHTML='<thead><tr><th style="width:22%">痛点/痒点</th><th>证据</th><th style="width:14%">频次</th><th style="width:10%">类型</th><th>对应需求</th><th style="width:50px"></th></tr></thead>';
    const tb=el('tbody');
    m.painMap.forEach((p,i)=>{
      const tr=el('tr');
      tr.appendChild(el('td',{},el('input',{value:p.pain,oninput:e=>{p.pain=e.target.value;autosave()}})));
      tr.appendChild(el('td',{},el('textarea',{rows:1,oninput:e=>{p.evidence=e.target.value;autosave()}},p.evidence)));
      tr.appendChild(el('td',{},el('select',{onchange:e=>{p.frequency=e.target.value;autosave()}},
        ...['高','中','低'].map(v=>{const o=el('option',{value:v},v);if(p.frequency===v)o.selected=true;return o;}))));
      tr.appendChild(el('td',{},el('select',{onchange:e=>{p.type=e.target.value;autosave()}},
        ...['痛点','痒点'].map(v=>{const o=el('option',{value:v},v);if(p.type===v)o.selected=true;return o;}))));
      const needs=UI.tagsInput(p.linkedNeeds||[]);
      needs.el.querySelector('input').addEventListener('blur',()=>{p.linkedNeeds=needs.get();autosave()});
      needs.el.style.fontSize='11px';
      tr.appendChild(el('td',{},needs.el));
      tr.appendChild(el('td',{},el('button',{class:'ghost small',onclick:()=>{m.painMap.splice(i,1);autosave();Work3.renderStep('mining')}},'×')));
      tb.appendChild(tr);
    });
    t.appendChild(tb);table.appendChild(t);plate.appendChild(table);
    plate.appendChild(el('button',{onclick:()=>{m.painMap.push({id:uid('pain'),pain:'',evidence:'',frequency:'中',linkedNeeds:[],type:'痛点'});autosave();Work3.renderStep('mining')}},'+ 添加痛点'));
  }
};

Work3.importExcel = async function(file, renderDocs){
  const m=state.work3.mining;
  try{
    let result;
    if(backendOnline){
      result=await Backend.parseExcel(file);
    }else{
      showToast('本地服务未连接，Excel 导入不可用');
      return;
    }
    const col = result.suggested_text_column || result.columns[0];
    const texts = result.rows.map(r=>String(r[col]||'')).filter(t=>t.trim().length>10);
    if(confirm(`将导入 ${texts.length} 条文本（列：${col}），是否继续？`)){
      m.documents.push(...texts);
      autosave(); renderDocs();
      showToast('已导入 '+texts.length+' 条');
    }
  }catch(e){ showToast('导入失败: '+e.message); }
};

Work3.runLDA = async function(btn, container){
  const m=state.work3.mining;
  let docs=[...m.documents];
  if(m.includeWork1Open){
    state.work1.analysis.openThemes.forEach(ot=>docs.push(...ot.texts));
  }
  if(m.includeWork1Themes){
    state.work1.analysis.openThemes.forEach(ot=>{
      (ot.themes||[]).forEach(t=>docs.push(t.label+' '+(ot.question||'')));
    });
  }
  if(docs.length<3){ showToast('至少需要 3 条文档'); return; }
  btn.disabled=true; btn.textContent='建模中…';
  try{
    let result;
    if(backendOnline){
      result=await Backend.lda(docs, m.ldaParams);
    }else{
      // LLM simulation fallback
      result=await Work3.llmLdaSim(docs, m.ldaParams.k);
    }
    if(result.error){ m.ldaError=result.error; }
    else{
      m.ldaError=null;
      m.stats=result.stats;
      m.topics=result.topics;
      m.wordFreqTop=result.word_freq_top;
    }
    autosave(); Work3.renderStep('mining');
  }catch(e){ m.ldaError=e.message; autosave(); Work3.renderStep('mining'); }
  finally{ btn.disabled=false; btn.textContent='运行 LDA'; }
};

Work3.llmLdaSim = async function(docs, k){
  const sys=`你是 LDA 主题建模模拟器。对给定的 ${docs.length} 条文档，模拟出 ${k} 个主题。输出 JSON: {"stats":{"raw_count":${docs.length},"valid_count":${docs.length},"total_words":0,"vocab_size":0,"coherence":0.5},"topics":[{"id":0,"label":"","share":20,"keywords":[{"word":"","weight":0.02}],"representative_docs":[""]}],"word_freq_top":[{"word":"","count":10}]}`;
  const sample=docs.slice(0,30).map((d,i)=>`${i+1}. ${d.slice(0,150)}`).join('\n');
  const r=await API.callJson([{role:'system',content:sys},{role:'user',content:sample}]);
  if(!r) throw new Error('LLM 模拟返回空');
  // normalize
  r.topics=(r.topics||[]).slice(0,k).map((t,i)=>({id:i,label:t.label||'',share:t.share||Math.round(100/k),keywords:(t.keywords||[]).slice(0,12),representative_docs:(t.representative_docs||[]).slice(0,3)}));
  r.word_freq_top=r.word_freq_top||[];
  return r;
};

Work3.nameTopics = function(btn, container){
  const m=state.work3.mining;
  API.aiButton({
    button:btn, container, aiScope:'work3.mining',
    buildPrompt:()=>[{role:'system',content:'你是品牌研究分析师。根据 LDA 主题关键词，为每个主题起一个 4-8 字中文名并给一句话描述。输出 JSON: {"topics":[{"id":0,"label":"","description":""}]}'},
      {role:'user',content:'SBU:'+state.work1.sbu.name+'\n目标市场:'+(state.work3.context.targetMarket||'')+'\n\n主题:\n'+m.topics.map(t=>`[${t.id}] ${t.keywords.map(k=>k.word).join('、')}`).join('\n')}],
    onResult:r=>{
      if(!r?.topics)return;
      r.topics.forEach(nt=>{
        const t=m.topics.find(x=>x.id===nt.id);
        if(t){ t.label=nt.label; t.description=nt.description; }
      });
      autosave(); Work3.renderStep('mining');
    }
  });
};

Work3.makePainMap = function(btn, container){
  const m=state.work3.mining;
  const topicsInfo = m.topics.length? m.topics.map(t=>({id:t.id,label:t.label,keywords:t.keywords.map(k=>k.word),docs:t.representative_docs})) : [];
  API.aiButton({
    button:btn, container, aiScope:'work3.mining',
    buildPrompt:()=>[{role:'system',content:'你是用户研究专家。基于 LDA 主题与原始语料，提炼 6-10 条痛点/痒点。区分"痛点"（必须解决）和"痒点"（加分项）。输出 JSON: {"pains":[{"pain":"","evidence":"原文摘录","frequency":"高|中|低","linkedNeeds":[""],"linkedTopicId":0,"type":"痛点|痒点"}]}'},
      {role:'user',content:`SBU:${state.work1.sbu.name}\n目标市场:${state.work3.context.targetMarket}\nLDA 主题:${JSON.stringify(topicsInfo,null,2)}\n\n语料样例:\n${m.documents.slice(0,30).map((d,i)=>i+'. '+d.slice(0,200)).join('\n')}`}],
    onResult:r=>{
      if(!r?.pains)return;
      m.painMap = r.pains.map(p=>({id:uid('pain'),...p}));
      autosave(); Work3.renderStep('mining');
    }
  });
};

/* ---------- CANDIDATES ---------- */
Work3.render.candidates = function(sec){
  const plate = sec.querySelector('.plate');
  const cs=state.work3.candidates;
  const table=el('div',{class:'table-wrap'});
  const t=el('table',{class:'data'});
  t.innerHTML='<thead><tr><th style="width:18%">卖点（≤15字）</th><th style="width:20%">关联痛点</th><th>方案描述（≤50字）</th><th>支撑证据</th><th style="width:50px"></th></tr></thead>';
  const tb=el('tbody');
  cs.forEach((c,i)=>{
    const tr=el('tr');
    tr.appendChild(el('td',{},el('input',{value:c.name,oninput:e=>{c.name=e.target.value;autosave()}})));
    const painSel=el('select',{onchange:e=>{c.pain=e.target.value;autosave()}});
    painSel.appendChild(el('option',{value:''},'—'));
    state.work3.mining.painMap.forEach(p=>{const o=el('option',{value:p.pain},p.pain);if(c.pain===p.pain)o.selected=true;painSel.appendChild(o);});
    painSel.appendChild(el('option',{value:'__custom'},'自定义…'));
    tr.appendChild(el('td',{},painSel));
    tr.appendChild(el('td',{},el('textarea',{rows:2,oninput:e=>{c.description=e.target.value;autosave()}},c.description)));
    tr.appendChild(el('td',{},el('input',{value:c.evidence||'',oninput:e=>{c.evidence=e.target.value;autosave()}})));
    tr.appendChild(el('td',{},el('button',{class:'ghost small',onclick:()=>{cs.splice(i,1);autosave();Work3.renderStep('candidates')}},'删除')));
    tb.appendChild(tr);
  });
  t.appendChild(tb);table.appendChild(t);plate.appendChild(table);
  plate.appendChild(el('div',{class:'ai-actions'},
    el('button',{onclick:()=>{cs.push({id:uid('c'),name:'',pain:'',description:'',evidence:'待验证',desirabilityScores:{},extraDims:{}});autosave();Work3.renderStep('candidates')}},'+ 添加卖点'),
  ));
  const ai=el('div',{class:'ai-box'});
  const btn=el('button',{class:'primary',onclick:()=>{
    API.aiButton({
      button:btn,container:ai,aiScope:'work3.candidates',
      buildPrompt:()=>[{role:'system',content:'你是产品策略专家。基于痛点地图生成 8-10 个备选卖点。输出 JSON: {"candidates":[{"name":"","pain":"","description":"","evidence":""}]}'},
        {role:'user',content:`SBU:${state.work1.sbu.name}\n目标市场:${state.work3.context.targetMarket}\n价值框架:${state.work1.values.chosenFunctional}/${state.work1.values.chosenEmotional}/${state.work1.values.chosenSocial}\n痛点地图:\n${state.work3.mining.painMap.map(p=>'- '+p.pain+' ('+p.type+'): '+p.evidence).join('\n')}`}],
      onResult:r=>{
        if(!r?.candidates)return;
        state.work3.candidates.push(...r.candidates.map(c=>({id:uid('c'),desirabilityScores:{},extraDims:{},...c})));
        autosave(); Work3.renderStep('candidates');
      }
    });
  }},'用 AI 生成备选卖点');
  ai.appendChild(btn); plate.appendChild(ai);
};

/* ---------- MATRIX ---------- */
Work3.computeMatrix = function(){
  const cs=state.work3.candidates;
  const ddims=state.work3.dimensions.desirability;
  const idims=state.work3.dimensions.implementability;
  return cs.map(c=>{
    // desirability: average across personas of average across dims; or direct
    let des=0;
    if(c.desirabilitySource==='personas' || Object.keys(c.desirabilityScores||{}).length){
      const perPersonaMeans=Object.values(c.desirabilityScores||{}).map(sc=>{
        const vals=ddims.map(d=>Number(sc[d.key])).filter(v=>!isNaN(v));
        return vals.length?mean(vals):null;
      }).filter(v=>v!=null);
      des=perPersonaMeans.length?mean(perPersonaMeans):0;
    } else {
      const vals=ddims.map(d=>Number(c[d.key])).filter(v=>!isNaN(v));
      des=vals.length?mean(vals):0;
    }
    const ivals=idims.map(d=>Number(c[d.key])).filter(v=>!isNaN(v));
    const imp=ivals.length?mean(ivals):0;
    return {...c, x:imp, y:des};
  });
};
Work3.isInSector = function(x,y){
  const m=state.work3.matrix;
  if(!m.showSector) return false;
  const rho=Math.sqrt(x*x+y*y);
  const phi=Math.atan2(y,x)*180/Math.PI;
  return rho>=m.sectorRadius && Math.abs(phi-45)<=m.sectorAngle/2;
};
Work3.render.matrix = function(sec){
  const plate = sec.querySelector('.plate');
  const cs=state.work3.candidates;
  if(!cs.length){ plate.appendChild(el('div',{class:'warning'},'请先在「备选卖点」添加卖点。')); return; }

  // scoring controls
  plate.appendChild(el('h3',{},'评分'));
  const ai=el('div',{class:'ai-box'});
  ai.appendChild(el('button',{class:'primary',onclick:e=>Work3.scoreDesirability(e.currentTarget)}, state.work3.context.hasSurvey?'逐 persona 评合意性':'AI 直接评合意性'));
  ai.appendChild(el('button',{onclick:e=>Work3.scoreImplementability(e.currentTarget)},'AI 评可实施性'));
  plate.appendChild(ai);

  // scoring table (collapsible details)
  const det=el('details');
  det.appendChild(el('summary',{class:'hint'},'展开/收起评分子项'));
  const ddims=state.work3.dimensions.desirability, idims=state.work3.dimensions.implementability;
  const table=el('div',{class:'table-wrap'});
  const t=el('table',{class:'data'});
  const head=el('thead'),hr=el('tr');
  hr.appendChild(el('th',{},'卖点'));
  if(state.work3.context.hasSurvey) hr.appendChild(el('th',{},'逐 persona 子分'));
  [...ddims,...idims].forEach(d=>hr.appendChild(el('th',{title:d.definition},d.label)));
  head.appendChild(hr); t.appendChild(head);
  const tb=el('tbody');
  cs.forEach(c=>{
    const tr=el('tr');
    tr.appendChild(el('td',{style:{'font-style':'normal'}},c.name));
    if(state.work3.context.hasSurvey){
      const td=el('td',{class:'mono',style:{'font-size':'11px'}});
      const pMeans=state.work3.context.personas.map(p=>{
        const sc=c.desirabilityScores?.[p.id];
        if(!sc) return p.name.slice(0,2)+':—';
        const m=mean(ddims.map(d=>Number(sc[d.key])||0));
        return p.name.slice(0,2)+':'+m.toFixed(1);
      });
      td.textContent=pMeans.join(' ');
      tr.appendChild(td);
    }
    [...ddims,...idims].forEach(d=>{
      const v=c[d.key];
      const src=c['src_'+d.key];
      const td=el('td',{class:'score-cell'});
      td.appendChild(el('input',{type:'number',min:0,max:10,step:0.1,value:v??'',oninput:e=>{c[d.key]=parseFloat(e.target.value);c['src_'+d.key]='user';autosave();}}));
      if(src==='ai'){const dot=el('span',{class:'ai-mark'});td.appendChild(dot);}
      tr.appendChild(td);
    });
    tb.appendChild(tr);
  });
  t.appendChild(tb); table.appendChild(t); det.appendChild(table); plate.appendChild(det);

  // matrix parameters
  plate.appendChild(el('hr',{class:'rule'}));
  const params=el('div',{class:'grid3'},
    UI.field('显示扇面', (()=>{
      const c=el('input',{type:'checkbox',checked:state.work3.matrix.showSector,onchange:e=>{state.work3.matrix.showSector=e.target.checked;autosave();Work3.renderStep('matrix')}});
      c.style.width='auto'; return c;
    })()),
    UI.field('扇面张角 θ ('+state.work3.matrix.sectorAngle+'°)',
      el('input',{type:'range',min:30,max:120,step:5,value:state.work3.matrix.sectorAngle,oninput:e=>{state.work3.matrix.sectorAngle=parseInt(e.target.value);autosave();Work3.renderStep('matrix')}})),
    UI.field('内半径 r ('+state.work3.matrix.sectorRadius+')',
      el('input',{type:'range',min:4,max:16,step:1,value:state.work3.matrix.sectorRadius,oninput:e=>{state.work3.matrix.sectorRadius=parseInt(e.target.value);autosave();Work3.renderStep('matrix')}}))
  );
  plate.appendChild(params);

  // matrix
  const pts=Work3.computeMatrix();
  const inSector=pts.filter(p=>Work3.isInSector(p.x,p.y)).map(p=>p.id);
  // Auto-select points in sector (unless user manually selected)
  const manual=new Set(state.work3.matrix.manualSelected||[]);
  pts.forEach(p=>{
    if(!manual.has(p.id)){
      p.selected = state.work3.matrix.showSector ? inSector.includes(p.id) : (p.x>=5&&p.y>=5);
    } else {
      p.selected = !!p.selected;
    }
  });
  // save selected to proposition
  state.work3.proposition.coreValueIds = pts.filter(p=>p.selected).map(p=>p.id);

  const scatterPlate=el('section',{class:'plate'},
    el('span',{class:'plate-label'},'F8 · PLUMB SCATTER · 客户合意性 × 企业可实施性')
  );
  renderMatrix({
    container:scatterPlate, points:pts.map(p=>({id:p.id,label:p.name,x:p.x,y:p.y})),
    xLabel:'企业可实施性', yLabel:'客户合意性',
    xCut:state.work3.matrix.xCut, yCut:state.work3.matrix.yCut,
    showSector:state.work3.matrix.showSector,
    sectorAngle:state.work3.matrix.sectorAngle, sectorRadius:state.work3.matrix.sectorRadius,
    selectedId:null,
    qHighHigh:'明星卖点',qHighYLowX:'愿景卖点',qlowYHighX:'产能卖点',qLowLow:'淘汰卖点',
    onSelect:id=>{
      const c=state.work3.candidates.find(x=>x.id===id);
      c.selected=!c.selected;
      if(!manual.has(id)) manual.add(id);
      state.work3.matrix.manualSelected=[...manual];
      autosave(); Work3.renderStep('matrix'); App.updateSummary();
    }
  });

  // ranking table
  plate.appendChild(el('h4',{},'卖点排名'));
  const table2=el('div',{class:'table-wrap'});
  const t2=el('table',{class:'data'});
  t2.innerHTML='<thead><tr><th>#</th><th>卖点</th><th>合意性</th><th>可实施性</th><th>象限</th><th>扇面</th><th>入选</th></tr></thead>';
  const tb2=el('tbody');
  const xCut=state.work3.matrix.xCut ?? median(pts.map(p=>p.x));
  const yCut=state.work3.matrix.yCut ?? median(pts.map(p=>p.y));
  [...pts].sort((a,b)=>(b.x+b.y)-(a.x+a.y)).forEach((p,i)=>{
    const q=p.x>=xCut&&p.y>=yCut?'明星':p.x<xCut&&p.y>=yCut?'愿景':p.x>=xCut&&p.y<yCut?'产能':'淘汰';
    const inside=Work3.isInSector(p.x,p.y);
    const tr=el('tr',{},
      el('td',{},String(i+1)),
      el('td',{style:{'font-style':'normal'}},p.name),
      el('td',{class:'mono'},p.y.toFixed(2)),
      el('td',{class:'mono'},p.x.toFixed(2)),
      el('td',{},el('span',{class:'tag '+(q==='明星'?'maroon':'')},q)),
      el('td',{},inside?el('span',{class:'tag soft'},'扇面内'):el('span',{class:'tag'},'外')),
      el('td',{}, (()=>{
        const cb=el('input',{type:'checkbox',checked:!!p.selected});
        cb.style.width='auto';
        cb.addEventListener('change',()=>{
          const c=state.work3.candidates.find(x=>x.id===p.id); c.selected=cb.checked;
          if(!manual.has(p.id)) manual.add(p.id);
          state.work3.matrix.manualSelected=[...manual];
          autosave(); Work3.renderStep('matrix');
        });
        return cb;
      })())
    );
    tb2.appendChild(tr);
  });
  t2.appendChild(tb2); table2.appendChild(t2); plate.appendChild(table2);

  // migration
  plate.appendChild(el('hr',{class:'rule'}));
  plate.appendChild(el('h3',{},'迁移路径（扇面外卖点）'));
  const outside=pts.filter(p=>!Work3.isInSector(p.x,p.y));
  if(!outside.length){ plate.appendChild(el('p',{class:'muted'},'所有卖点都在扇面内，无需迁移分析。')); }
  else{
    const mAi=el('div',{class:'ai-box'});
    const mBtn=el('button',{class:'primary',onclick:()=>Work3.generateMigration(mBtn,mAi,outside)},'为扇面外卖点生成迁移路径');
    mAi.appendChild(mBtn); plate.appendChild(mAi);
    if(state.work3.migration.analyses.length){
      state.work3.migration.analyses.forEach(a=>{
        const c=state.work3.candidates.find(x=>x.id===a.candidateId);
        const card=el('div',{class:'card',style:{'margin-bottom':'12px'}},
          el('div',{style:{'font-style':'normal','font-size':'18px','color':'var(--color-accent)'}}, c?.name||'已删除卖点'),
          el('p',{}, a.diagnosis),
          el('div',{}, (a.actions||[]).map((x,i)=>el('div',{style:{padding:'4px 0',borderBottom:'1px solid var(--color-rule)'}}, (i+1)+'. '+x))),
          a.targetScores && el('p',{class:'hint'}, '目标分数：合意性 '+(a.targetScores.desirability||'—')+' / 可实施性 '+(a.targetScores.implementability||'—'))
        );
        plate.appendChild(card);
      });
    }
  }
};
// Run a list of scoring units with Runner pause/abort. A unit = one (persona, candidate).
// Skips units whose score already exists in _scoreDone (persisted resume support).
async function runScoringUnits(button, label, units, runOne, onDoneKey){
  if(!Array.isArray(state.work3._scoreDone)) state.work3._scoreDone=[];
  const doneSet=new Set(state.work3._scoreDone);
  const pending=units.filter(u=>!doneSet.has(u.key));
  if(!pending.length){ showToast('评分已全部完成'); Work3.rerender('matrix'); return; }
  const task=Runner.start({id:'work3-score-'+label, label, button, total:pending.length, pausable:true,
    onPause:()=>autosave(), onResume:()=>{}});
  if(!task) return;
  for(const u of pending){
    if(task.aborted) break;
    let ok=true;
    try{ await runOne(u); }
    catch(e){
      if(task.aborted || (e&&e.name==='AbortError')) break;
      console.warn(e); ok=false;
    }
    if(ok){ doneSet.add(u.key); state.work3._scoreDone=[...doneSet]; }
    task.done++; autosave();
    try{ await Runner.checkpoint(); }catch{ break; }
  }
  const aborted=task.aborted;
  Runner.finish();
  if(!aborted){
    if(onDoneKey) onDoneKey();
    showToast(label+'评分完成');
  }
  Work3.rerender('matrix');
}
Work3.scoreDesirability = function(button){
  const cs=state.work3.candidates;
  const personas=state.work3.context.personas;
  const dims=state.work3.dimensions.desirability;
  if(!personas.length || !state.work3.context.hasSurvey){
    const units=cs.map(c=>({key:'d:'+c.id, c}));
    return runScoringUnits(button,'合意性',units,cs.length,
      async ({c})=>{
        const r=await API.callJson([
          {role:'system',content:`你是目标客户。对卖点在三个维度打 0-10 分。输出 JSON: {${dims.map(d=>'"'+d.key+'":0').join(',')}}`},
          {role:'user',content:`SBU:${state.work1.sbu.name}\n卖点:${c.name}\n方案:${c.description}\n证据:${c.evidence}`}
        ],{signal:Runner.signal()});
        if(r) dims.forEach(d=>{c[d.key]=clamp(Number(r[d.key]),0,10);c['src_'+d.key]='ai';});
      });
  }
  const units=personas.flatMap(p=>cs.map(c=>({key:'d:'+p.id+':'+c.id,p,c})));
  return runScoringUnits(button,'合意性',units,units.length,
    async ({p,c})=>{
      const r=await API.callJson([
        {role:'system',content:`你是${p.name}。${p.painPoints||''}。对给定卖点在 ${dims.map(d=>d.label+'('+d.key+')').join('、')} 三个维度打 0-10 分。输出 JSON: {${dims.map(d=>'"'+d.key+'":0').join(',')}}`},
        {role:'user',content:`卖点:${c.name}\n方案:${c.description}\n证据:${c.evidence}`}
      ],{signal:Runner.signal()});
      if(r){
        c.desirabilityScores=c.desirabilityScores||{};
        c.desirabilityScores[p.id]={};
        dims.forEach(d=>c.desirabilityScores[p.id][d.key]=clamp(Number(r[d.key]),0,10));
        c.desirabilitySource='personas';
      }
    },
    ()=>{ state.work3.context.desirabilityDone=true; delete state.work3._scoreDone; });
};
Work3.scoreImplementability = function(button){
  const cs=state.work3.candidates;
  const dims=state.work3.dimensions.implementability;
  const units=cs.map(c=>({key:'i:'+c.id,c}));
  return runScoringUnits(button,'可实施性',units,cs.length,
    async ({c})=>{
      const r=await API.callJson([
        {role:'system',content:`你是企业运营顾问。对卖点在 ${dims.map(d=>d.label+'('+d.key+')').join('、')} 三个维度打 0-10 分。输出 JSON: {${dims.map(d=>'"'+d.key+'":0').join(',')}}`},
        {role:'user',content:`SBU:${state.work1.sbu.name} 品类${state.work1.sbu.category}\n卖点:${c.name}\n方案:${c.description}\n证据:${c.evidence}`}
      ],{signal:Runner.signal()});
      if(r) dims.forEach(d=>{c[d.key]=clamp(Number(r[d.key]),0,10);c['src_'+d.key]='ai';});
    },
    ()=>{ state.work3.context.implementabilityDone=true; delete state.work3._scoreDone; });
};
Work3.generateMigration = function(btn, container, outside){
  const m=state.work3.matrix;
  API.aiButton({
    button:btn, container, aiScope:'work3.migration',
    buildPrompt:()=>[{role:'system',content:'你是品牌战略顾问。为扇面外卖点生成迁移路径。输出 JSON: {"analyses":[{"candidateId":"","diagnosis":"","actions":[""],"targetScores":{"desirability":0,"implementability":0}}]}'},
      {role:'user',content:`SBU:${state.work1.sbu.name}\n目标市场:${state.work3.context.targetMarket}\n扇面标准: 总分>=${m.sectorRadius}, 合意性与可实施性比值在 ${m.sectorAngle}° 张角内\n\n扇面外卖点:\n${outside.map(p=>`- [${p.id}] ${p.name}: 合意性 ${p.y.toFixed(2)}, 可实施性 ${p.x.toFixed(2)}, 方案:${p.description}`).join('\n')}`}],
    onResult:r=>{
      if(!r?.analyses)return;
      state.work3.migration.analyses=r.analyses;
      autosave(); Work3.renderStep('matrix');
    }
  });
};
Work3.refreshDynamic=function(){};

/* ---------- PROPOSITION ---------- */
Work3.render.proposition = function(sec){
  const plate = sec.querySelector('.plate');
  const p=state.work3.proposition;
  const selected=state.work3.candidates.filter(c=>p.coreValueIds.includes(c.id) || c.selected);

  plate.appendChild(el('h3',{},'入选核心卖点'));
  if(!selected.length) plate.appendChild(el('div',{class:'warning'},'尚未在矩阵中选择卖点。'));
  else{
    const list=el('div',{class:'chip-row'});
    selected.forEach(c=>list.appendChild(el('span',{class:'chip maroon'},c.name)));
    plate.appendChild(list);
  }

  plate.appendChild(el('hr',{class:'rule'}));
  plate.appendChild(el('h3',{},'价值主张备选'));
  const altBox=el('div',{});
  p.alternatives.forEach((a,i)=>{
    const card=el('div',{class:'card'+(a.id===p.chosenValueText?' selected':'')},
      el('div',{style:{display:'flex','justify-content':'space-between','align-items':'flex-start',gap:'10px'}},
        el('textarea',{rows:2,oninput:e=>{a.text=e.target.value;autosave()}},a.text),
        el('div',{},
          el('button',{class:'small primary',onclick:()=>{p.chosenValueText=a.text;autosave();Work3.renderStep('proposition');App.updateSummary()}},'选定'),
          el('button',{class:'small ghost',onclick:()=>{p.alternatives.splice(i,1);autosave();Work3.renderStep('proposition')}},'删除')
        )
      )
    );
    altBox.appendChild(card);
  });
  plate.appendChild(altBox);
  const vpAi=el('div',{class:'ai-box'});
  const vpBtn=el('button',{class:'primary',onclick:()=>{
    API.aiButton({
      button:vpBtn,container:vpAi,aiScope:'work3.proposition',
      buildPrompt:()=>[{role:'system',content:'你是品牌战略顾问。生成 3 个差异化价值主张，每个 20-40 字，说清"为谁、提供什么、有何不同"。输出 JSON: {"alternatives":[{"text":""}]}'},
        {role:'user',content:`SBU:${state.work1.sbu.name}\n目标市场:${state.work3.context.targetMarket}\n入选卖点:${selected.map(c=>c.name+'('+c.description+')').join('；')}\n画像:${state.work3.context.personas.map(p=>p.name+':'+p.painPoints).join('；')}`}],
      onResult:r=>{
        if(!r?.alternatives)return;
        p.alternatives.push(...r.alternatives.map(a=>({id:uid('alt'),...a})));
        autosave(); Work3.renderStep('proposition');
      }
    });
  }},'用 AI 生成价值主张');
  vpAi.appendChild(vpBtn); plate.appendChild(vpAi);

  // positioning
  plate.appendChild(el('hr',{class:'rule'}));
  plate.appendChild(el('h3',{},'定位句（填空式）'));
  p.positioning.brand=p.positioning.brand||state.work1.sbu.name;
  const posGrid=el('div',{class:'grid2'},
    UI.field('品牌', el('input',{value:p.positioning.brand,oninput:e=>{p.positioning.brand=e.target.value;autosave();Work3.updatePositioning()}})),
    UI.field('品类', el('input',{value:p.positioning.category,oninput:e=>{p.positioning.category=e.target.value;autosave();Work3.updatePositioning()}}))
  );
  plate.appendChild(posGrid);
  plate.appendChild(UI.field('目标客群', el('input',{value:p.positioning.audience,oninput:e=>{p.positioning.audience=e.target.value;autosave();Work3.updatePositioning()}})));
  plate.appendChild(UI.field('核心价值', el('textarea',{rows:2,oninput:e=>{p.positioning.coreValue=e.target.value;autosave();Work3.updatePositioning()}},p.positioning.coreValue)));
  // 价值链重心（来自 Work1 微笑曲线收口）—— 定位的既定前提，只读引用
  const vcRef = (()=>{
    try{
      const env = state.work1.environment;
      const t = (env && env.ourCapabilities && env.ourCapabilities.smileCurve) || (typeof Work1!=='undefined' && Work1.smileConclusion ? Work1.smileConclusion() : '');
      return String(t||'').trim();
    }catch(e){ return ''; }
  })();
  if(vcRef){
    plate.appendChild(el('div',{class:'callout',style:'margin-top:10px'},
      el('span',{class:'callout-title'},'价值链重心 · 来自 Work1 微笑曲线'),
      el('p',{style:'margin:6px 0 0;line-height:1.7'}, vcRef)
    ));
  }
  plate.appendChild(el('div',{class:'callout'},
    el('span',{class:'callout-title'},'定位句预览'),
    el('p',{id:'posPreview',style:{'font-family':'var(--font-display)','font-style':'normal','font-size':'20px'}}, '')
  ));
  Work3.updatePositioning();

  // brand personality
  plate.appendChild(el('hr',{class:'rule'}));
  plate.appendChild(el('h3',{},'品牌人格'));
  plate.appendChild(UI.field('MBTI 类型', el('input',{value:p.mbti,oninput:e=>{p.mbti=e.target.value;autosave()}})));
  const traits=UI.tagsInput(p.personalityTraits||[]);
  traits.el.querySelector('input').addEventListener('blur',()=>{p.personalityTraits=traits.get();autosave()});
  plate.appendChild(UI.field('人格特质关键词', traits.el));
  const persAi=el('div',{class:'ai-box'});
  const persBtn=el('button',{class:'primary',onclick:()=>{
    API.aiButton({
      button:persBtn,container:persAi,aiScope:'work3.proposition',
      buildPrompt:()=>[{role:'system',content:'你是品牌人格顾问。根据价值主张与目标客群，推荐一个 MBTI 类型与 5 个人格特质关键词。输出 JSON: {"mbti":"","traits":[""]}'},
        {role:'user',content:`SBU:${state.work1.sbu.name}\n价值主张:${p.chosenValueText}\n目标客群:${p.positioning.audience}`}],
      onResult:r=>{
        if(!r)return;
        p.mbti=r.mbti||p.mbti;
        if(Array.isArray(r.traits))p.personalityTraits=r.traits;
        autosave(); Work3.renderStep('proposition');
      }
    });
  }},'用 AI 推荐人格');
  persAi.appendChild(persBtn); plate.appendChild(persAi);

  // slogan
  plate.appendChild(el('hr',{class:'rule'}));
  plate.appendChild(el('h3',{},'Slogan'));
  const slogBox=el('div',{});
  p.sloganOptions.forEach((s,i)=>{
    const card=el('div',{class:'card'+(s===p.chosenSlogan?' selected':'')},
      el('div',{style:{display:'flex','justify-content':'space-between','align-items':'center'}},
        el('input',{value:s,oninput:e=>{p.sloganOptions[i]=e.target.value;autosave()}}),
        el('div',{},
          el('button',{class:'small primary',onclick:()=>{p.chosenSlogan=s;autosave();Work3.renderStep('proposition')}}, '选定'),
          el('button',{class:'small ghost',onclick:()=>{p.sloganOptions.splice(i,1);autosave();Work3.renderStep('proposition')}},'删除'))
      )
    );
    slogBox.appendChild(card);
  });
  plate.appendChild(slogBox);
  const slAi=el('div',{class:'ai-box'});
  const slBtn=el('button',{class:'primary',onclick:()=>{
    API.aiButton({
      button:slBtn,container:slAi,aiScope:'work3.proposition',
      buildPrompt:()=>[{role:'system',content:'你是品牌文案。创作 5 个中文 12 字内的 slogan，含情感驱动词。输出 JSON: {"slogans":[""]}'},
        {role:'user',content:`品牌:${p.positioning.brand}\n价值主张:${p.chosenValueText}\n人格:${p.mbti} ${(p.personalityTraits||[]).join('/')}`}],
      onResult:r=>{
        if(!r?.slogans)return;
        p.sloganOptions.push(...r.slogans);
        autosave(); Work3.renderStep('proposition');
      }
    });
  }},'用 AI 生成 slogan');
  slAi.appendChild(slBtn); plate.appendChild(slAi);
};
Work3.updatePositioning = function(){
  const p=state.work3.proposition.positioning;
  const sentence=`${p.brand||'〔品牌〕'} 是为 ${p.audience||'〔目标客群〕'} 提供 ${p.coreValue||'〔核心价值〕'} 的 ${p.category||'〔品类〕'}。`;
  state.work3.proposition.positioningStatement=sentence;
  const el2=document.getElementById('posPreview');
  if(el2) el2.textContent=sentence;
  autosave();
};

/* ---------- EXPORT ---------- */
Work3.exportMd = function(){
  const d=state.work3;
  let out=`\n## III. 价值主张与定位\n\n### 1. 目标市场\n${d.context.targetMarket}\n\n`;
  if(d.mining.topics.length){
    out+=`### 2. LDA 主题模型\n- 文档数：${d.mining.stats?.valid_count}\n- Coherence：${d.mining.stats?.coherence}\n\n`;
    d.mining.topics.forEach(t=>{ out+=`- **${t.label||'主题'+(t.id+1)}** (${t.share}%): ${t.keywords.slice(0,8).map(k=>k.word).join('、')}\n`; });
    out+='\n';
  }
  if(d.mining.painMap.length){
    out+='### 3. 痛点地图\n';
    d.mining.painMap.forEach(p=>out+=`- [${p.type}] **${p.pain}** (${p.frequency}) — ${p.evidence}\n`);
    out+='\n';
  }
  out+='### 4. 卖点矩阵\n';
  Work3.computeMatrix().sort((a,b)=>(b.x+b.y)-(a.x+a.y)).forEach(c=>{
    out+=`- **${c.name}**：合意性 ${c.y.toFixed(2)} / 可实施性 ${c.x.toFixed(2)} ${c.selected?'*':''}\n`;
  });
  out+=`\n### 5. 价值主张\n> ${d.proposition.chosenValueText}\n\n**定位句**：${d.proposition.positioningStatement}\n\n**品牌人格**：${d.proposition.mbti} ${(d.proposition.personalityTraits||[]).join('/')}\n\n**Slogan**：${d.proposition.chosenSlogan}\n`;
  return out;
};
