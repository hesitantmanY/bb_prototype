/* ============================================================
   WORKSHOP 5 — 策划书
   Single scrollable document with editable chapters.
   ============================================================ */
Work5.steps = [
  {id:'plan', label:'策划书'}
];

Work5.defaultData = () => ({
  cover: { title:'', subtitle:'', team:'', date:new Date().toISOString().slice(0,10) },
  abstract:'',
  ch1_business:'',
  ch2_environment: {
    political:'', economic:'', social:'', technological:'',
    strengths:[], weaknesses:[], opportunities:[], threats:[]
  },
  ch3_strategy: { segmentation:'', targeting:'', positioning:'' },
  ch4_mix: { route:'', product:'', price:'', place:'', promotion:'',
             customerValue:'', customerCost:'', convenience:'', communication:'' },
  ch5_outlook:'',
  references:[],
  lastAggregated:null
});

Work5.renderStep = function(id){
  const sec=document.querySelector('#steps5 .step[data-step="'+id+'"]');
  if(!sec) return;
  if(sec.dataset.rendered==='1'){ Work5.refreshDynamic(id); return; }
  sec.innerHTML='';
  sec.appendChild(Work5.toolbar());

  // Cover
  sec.appendChild(Work5.section('cover','封面', function(body){
    const c=state.work5.cover;
    body.appendChild(UI.field('标题', el('input',{value:c.title,oninput:e=>{c.title=e.target.value;autosave();Work5.refreshCover()}})));
    body.appendChild(UI.field('副标题', el('input',{value:c.subtitle,oninput:e=>{c.subtitle=e.target.value;autosave();Work5.refreshCover()}})));
    body.appendChild(el('div',{class:'grid2'},
      UI.field('团队 / 小组', el('input',{value:c.team,oninput:e=>{c.team=e.target.value;autosave();Work5.refreshCover()}})),
      UI.field('日期', el('input',{type:'date',value:c.date,oninput:e=>{c.date=e.target.value;autosave();Work5.refreshCover()}}))
    ));
    body.appendChild(el('div',{class:'ai-actions'},
      el('button',{class:'small',onclick:e=>Work5.aiTitle(e.currentTarget,body)},'用 AI 起名')
    ));
    body.appendChild(el('div',{id:'coverPreview',class:'plate',style:{marginTop:'14px',padding:'28px',background:'var(--bg)'}}));
    Work5.refreshCover();
  }));

  // Abstract
  sec.appendChild(Work5.section('abstract','摘要', function(body){
    body.appendChild(el('div',{class:'ai-actions'},
      el('button',{class:'small',onclick:()=>Work5.aggregateAbstract(body)},'从章节自动汇总'),
      el('button',{class:'small',onclick:e=>Work5.aiPolish('abstract','摘要',e.currentTarget)},'AI 润色')
    ));
    body.appendChild(el('textarea',{rows:5,maxlength:600,oninput:e=>{state.work5.abstract=e.target.value;autosave()}},state.work5.abstract));
  }));

  // Chapter 1
  sec.appendChild(Work5.section('ch1','1. 企业及业务概况', function(body){
    body.appendChild(el('div',{class:'ai-actions'},
      el('button',{class:'small',onclick:()=>Work5.aggregateCh1(body)},'从 Work 1 汇总'),
      el('button',{class:'small',onclick:e=>Work5.aiPolish('ch1_business','业务概况',e.currentTarget)},'AI 改写为章节语言')
    ));
    body.appendChild(el('textarea',{rows:8,oninput:e=>{state.work5.ch1_business=e.target.value;autosave()}},state.work5.ch1_business));
  }));

  // Chapter 2: PEST + SWOT
  sec.appendChild(Work5.section('ch2','2. 营销环境分析（PEST + SWOT）', function(body){
    const e=state.work5.ch2_environment;
    body.appendChild(el('h4',{},'2.1 PEST'));
    [['political','P · 政治/政策/法规'],['economic','E · 经济/汇率/购买力'],
     ['social','S · 社会/文化/人口'],['technological','T · 技术/基础设施/渠道']].forEach(([k,label])=>{
      body.appendChild(UI.field(label, el('textarea',{rows:3,oninput:ev=>{e[k]=ev.target.value;autosave()}},e[k])));
    });
    body.appendChild(el('div',{class:'ai-actions'},
      el('button',{class:'small',onclick:()=>Work5.importPestFromWork1()},'从 Work 1 导入 PEST'),
      el('button',{class:'small',onclick:e=>Work5.aiSwot(e.currentTarget)},'AI 提取 SWOT')
    ));

    body.appendChild(el('h4',{style:{'margin-top':'20px'}},'2.2 SWOT'));
    const swotGrid=el('div',{class:'grid2'});
    [['strengths','优势 S'],['weaknesses','劣势 W'],['opportunities','机会 O'],['threats','威胁 T']].forEach(([k,label])=>{
      const card=el('div',{class:'card'});
      card.appendChild(el('label',{},label));
      const ti=UI.tagsInput(e[k]||[]);
      ti.el.querySelector('input').addEventListener('blur',()=>{e[k]=ti.get();autosave();Work5.refreshSwotMatrix()});
      card.appendChild(ti.el);
      swotGrid.appendChild(card);
    });
    body.appendChild(swotGrid);

    body.appendChild(el('h4',{style:{'margin-top':'20px'}},'SWOT 矩阵'));
    const swotVis=el('div',{id:'swotVis',style:{display:'grid','grid-template-columns':'1fr 1fr','gap':'0',border:'1px solid var(--line)'}});
    body.appendChild(swotVis);
    Work5.refreshSwotMatrix();
  }));

  // Chapter 3 STP
  sec.appendChild(Work5.section('ch3','3. 营销战略（STP）', function(body){
    const s=state.work5.ch3_strategy;
    body.appendChild(el('h4',{},'3.1 细分 (Segmentation)'));
    body.appendChild(el('textarea',{rows:3,oninput:e=>{s.segmentation=e.target.value;autosave()}},s.segmentation));
    body.appendChild(el('h4',{},'3.2 目标市场 (Targeting)'));
    body.appendChild(el('div',{class:'ai-actions'},
      el('button',{class:'small',onclick:()=>Work5.importTargeting()},'从 Work 2 导入'),
    ));
    body.appendChild(el('textarea',{rows:4,oninput:e=>{s.targeting=e.target.value;autosave()}},s.targeting));
    body.appendChild(el('h4',{},'3.3 定位 (Positioning)'));
    body.appendChild(el('div',{class:'ai-actions'},
      el('button',{class:'small',onclick:()=>Work5.importPositioning()},'从 Work 3 导入'),
    ));
    body.appendChild(el('textarea',{rows:4,oninput:e=>{s.positioning=e.target.value;autosave()}},s.positioning));
  }));

  // Chapter 4 route + 4P / 4C
  sec.appendChild(Work5.section('ch4','4. 营销组合（路径 + 4P / 4C）', function(body){
    const m=state.work5.ch4_mix;
    body.appendChild(UI.field('出海路径', el('textarea',{rows:3,oninput:e=>{m.route=e.target.value;autosave()}},m.route)));
    [['product','产品 (Product)'],['price','价格 (Price)'],['place','渠道 (Place)'],['promotion','促销 (Promotion)']].forEach(([k,label])=>{
      body.appendChild(UI.field(label, el('textarea',{rows:4,oninput:e=>{m[k]=e.target.value;autosave()}},m[k])));
    });
    body.appendChild(el('div',{class:'ai-actions'},
      el('button',{class:'small',onclick:()=>Work5.import4P()},'从 Work 4 导入'),
      el('button',{class:'small',onclick:e=>Work5.convert4C(e.currentTarget)},'AI 转换为 4C')
    ));
    body.appendChild(el('h4',{style:{'margin-top':'16px'}},'4C 视角'));
    [['customerValue','客户价值 (Customer Value)'],['customerCost','客户成本 (Customer Cost)'],
     ['convenience','客户便利 (Convenience)'],['communication','客户沟通 (Communication)']].forEach(([k,label])=>{
      body.appendChild(UI.field(label, el('textarea',{rows:3,oninput:e=>{m[k]=e.target.value;autosave()}},m[k])));
    });
  }));

  // Chapter 5
  sec.appendChild(Work5.section('ch5','5. 总结与展望', function(body){
    body.appendChild(el('div',{class:'ai-actions'},
      el('button',{class:'small',onclick:e=>Work5.aiOutlook(e.currentTarget)},'AI 生成总结展望')
    ));
    body.appendChild(el('textarea',{rows:6,oninput:e=>{state.work5.ch5_outlook=e.target.value;autosave()}},state.work5.ch5_outlook));
  }));

  // References
  sec.appendChild(Work5.section('refs','参考文献', function(body){
    const refs=state.work5.references;
    const table=el('div',{class:'table-wrap'});
    const t=el('table',{class:'data'});
    t.innerHTML='<thead><tr><th>作者</th><th>标题</th><th style="width:80px">年份</th><th>URL</th><th style="width:50px"></th></tr></thead>';
    const tb=el('tbody');
    refs.forEach((r,i)=>{
      const tr=el('tr');
      ['authors','title','year','url'].forEach(k=>{
        tr.appendChild(el('td',{},el('input',{value:r[k]||'',oninput:e=>{r[k]=e.target.value;autosave()}})));
      });
      tr.appendChild(el('td',{},el('button',{class:'ghost small',onclick:()=>{refs.splice(i,1);autosave();Work5.rerender('plan')}},'删除')));
      tb.appendChild(tr);
    });
    t.appendChild(tb);table.appendChild(t);body.appendChild(table);
    body.appendChild(el('button',{onclick:()=>{refs.push({authors:'',title:'',year:'',url:''});autosave();Work5.rerender('plan')}},'+ 添加文献'));
  }));

  sec.dataset.rendered='1';
};
Work5.rerender = function(id){
  const sec=document.querySelector('#steps5 .step[data-step="'+id+'"]');
  if(!sec) return;
  sec.dataset.rendered='0';
  Work5.renderStep(id);
};

Work5.titles={};
Work5.subtitles={};

Work5.toolbar=function(){
  return el('div',{class:'plate no-print',style:{display:'flex',gap:'8px','flex-wrap':'wrap',alignItems:'center','margin-bottom':'20px'}},
    el('button',{class:'primary',onclick:()=>Work5.aggregateAll()},'从 Work 1–4 一键汇总'),
    el('button',{onclick:()=>window.print()},'打印 / PDF'),
    el('button',{onclick:()=>App.exportMd()},'导出 Markdown'),
    el('button',{class:'ghost',onclick:e=>Work5.aiPolishAll(e.currentTarget)},'AI 润色全文'),
    el('button',{class:'ghost',onclick:()=>Work5.randomExampleAll()},'随机生成示例')
  );
};

// 随机生成示例：先看 Work 1-4 是否已有数据。
// 有 → 直接汇总（与"从 Work 1-4 一键汇总"等价，但语义统一为"随机示例"）
// 无 → 用各 work 内置的样本数据快速填一份, 再汇总
Work5.randomExampleAll = function(){
  // 检查 Work 1-4 是否已有内容
  const w1 = state.work1 && (state.work1.sbu.name || state.work1.environment.political);
  const w2 = state.work2 && (state.work2.markets.length || state.work2.scope.question);
  const w3 = state.work3 && (state.work3.mining.documents.length || state.work3.proposition.chosenValueText);
  const w4 = state.work4 && (state.work4.product.name || state.work4.price.strategy);
  const allEmpty = !w1 && !w2 && !w3 && !w4;

  if(allEmpty){
    if(!confirm('Work 1-4 都还是空的, 将先在各 work 填入内置示例数据, 再汇总为策划书. 继续？')) return;
    // 链式触发：用各 work 的样本和 apply 函数
    try{
      if(typeof Work1 !== 'undefined' && Work1.SBU_SAMPLES && Work1.applySBU){
        Work1.applySBU(Work1.SBU_SAMPLES[0]);
      }
      if(typeof Work2 !== 'undefined' && Work2.WORK2_SAMPLES && Work2._applyWork2Sample){
        Work2._applyWork2Sample(Work2.WORK2_SAMPLES[0]);
      }
      if(typeof Work3 !== 'undefined' && Work3.WORK3_SAMPLES && Work3._applyWork3Sample){
        Work3._applyWork3Sample(Work3.WORK3_SAMPLES[0]);
      }
      if(typeof Work4 !== 'undefined' && Work4.WORK4_SAMPLES && Work4._applyWork4Sample){
        Work4._applyWork4Sample(Work4.WORK4_SAMPLES[0]);
      }
    }catch(e){ console.warn('Work5 random example fill failed', e); }
  } else {
    if((state.work5.ch1_business || state.work5.abstract) && !confirm('这会从 Work 1-4 重新汇总并覆盖当前策划书, 继续？')) return;
  }
  // 补全封面默认值
  const c = state.work5.cover;
  if(!c.title) c.title = (state.work1.sbu.name || '示例品牌') + ' · 品牌国际化战略策划书';
  if(!c.subtitle) c.subtitle = 'Work 1-4 自动汇总的策划书草案';
  if(!c.team) c.team = '战略小组 / ' + (new Date()).toISOString().slice(0,7);
  if(!c.date) c.date = new Date().toISOString().slice(0,10);
  autosave();
  Work5.aggregateAll();
  showToast(allEmpty ? '已用内置示例填 Work 1-4 + 汇总策划书' : '已从 Work 1-4 汇总策划书');
};

Work5.section=function(id,title,bodyFn){
  const det=el('details',{open:true});
  det.appendChild(el('summary',{style:{'font-family':'var(--font-display)','font-style':'italic','font-size':'22px','margin-bottom':'10px','cursor':'pointer'}},title));
  const body=el('div',{});
  bodyFn(body);
  det.appendChild(body);
  return det;
};

Work5.refreshCover=function(){
  const c=state.work5.cover, prev=document.getElementById('coverPreview');
  if(!prev) return;
  prev.innerHTML=`
    <div style="text-align:center;padding:32px 20px">
      <div class="mono" style="font-size:11px;letter-spacing:.2em;color:var(--muted)">GLOBAL BRAND WORKSHOP · ${esc(c.date)}</div>
      <h1 style="margin:14px 0 6px">${esc(c.title||'〔标题〕')}</h1>
      <div style="font-family:var(--font-display);font-style:italic;font-size:20px;color:var(--maroon)">${esc(c.subtitle||'')}</div>
      <div class="mono" style="font-size:11px;letter-spacing:.15em;color:var(--muted);margin-top:28px">${esc(c.team||'')}</div>
    </div>`;
};

Work5.refreshSwotMatrix=function(){
  const vis=document.getElementById('swotVis');
  if(!vis) return;
  const e=state.work5.ch2_environment;
  const cells=[
    ['S 优势',e.strengths,'rgba(58,25,15,.08)'],
    ['W 劣势',e.weaknesses,'rgba(180,175,165,.12)'],
    ['O 机会',e.opportunities,'rgba(138,130,117,.10)'],
    ['T 威胁',e.threats,'rgba(139,37,0,.08)']
  ];
  vis.innerHTML='';
  cells.forEach(([label,items,bg])=>{
    const c=el('div',{style:{padding:'14px',background:bg,'border-right':'1px solid var(--line)','border-bottom':'1px solid var(--line)','min-height':'120px'}});
    c.appendChild(el('div',{class:'mono',style:{'font-size':'11px','letter-spacing':'.15em',color:'var(--maroon)','margin-bottom':'6px'}},label));
    (items||[]).forEach(i=>c.appendChild(el('div',{style:{'font-size':'13px',padding:'2px 0'}},'· '+i)));
    vis.appendChild(c);
  });
};

/* ---------- AGGREGATION ---------- */
Work5.aggregateAll=function(){
  const c=state.work5.cover;
  if(!c.title){
    c.title = state.work1.sbu.name ? state.work1.sbu.name+' — Global Brand Building and Marketing Communication' : 'Global Brand Building and Marketing Communication';
    const sel=state.work2.markets.find(m=>m.id===state.work2.matrix.selectedMarketId);
    if(sel) c.subtitle='目标市场：'+sel.name;
    if(!c.team) c.team='';
  }
  Work5.aggregateCh1();
  Work5.importPestFromWork1(true);
  Work5.importTargeting(true);
  Work5.importPositioning(true);
  Work5.import4P(true);
  Work5.aggregateAbstract();
  state.work5.lastAggregated=new Date().toISOString();
  autosave(); Work5.rerender('plan'); showToast('已从 Work 1–4 汇总');
};

Work5.aggregateAbstract=function(){
  const w=state.work5;
  const parts=[
    state.work1.sbu.name?`本策划书围绕 ${state.work1.sbu.name}（${state.work1.sbu.category||''}）展开。`:'' ,
    state.work2.decision.rationale?`在目标市场选择上，${state.work2.decision.rationale}`:'',
    state.work3.proposition.chosenValueText?`核心价值主张为：${state.work3.proposition.chosenValueText}。`:'',
    state.work3.proposition.positioningStatement?state.work3.proposition.positioningStatement:'',
    state.work5.ch5_outlook?state.work5.ch5_outlook:''
  ].filter(Boolean);
  w.abstract=parts.join(' ').slice(0,500);
  autosave(); Work5.rerender('plan');
};

Work5.aggregateCh1=function(){
  const w=state.work1;
  const lines=[
    `# ${w.sbu.name}`,
    w.sbu.summary?`> ${w.sbu.summary}`:'',
    w.sbu.category?`- **品类/行业**：${w.sbu.category}`:'',
    w.sbu.stage?`- **阶段**：${w.sbu.stage}`:'',
    w.sbu.scope?`- **地理范围**：${w.sbu.scope}`:'',
    '',
    w.values.chosenFunctional?`**核心价值**：功能（${w.values.chosenFunctional}）、情感（${w.values.chosenEmotional}）、社会（${w.values.chosenSocial}）。`:'',
    w.analysis.insights?`\n**关键洞察**：\n${w.analysis.insights}`:''
  ].filter(Boolean);
  state.work5.ch1_business=lines.join('\n');
  autosave(); Work5.rerender('plan');
};

Work5.importPestFromWork1=function(silent){
  const env=state.work1.environment, e=state.work5.ch2_environment;
  if(env.political) e.political=env.political;
  if(env.economic) e.economic=env.economic;
  if(env.social) e.social=env.social;
  if(env.technological) e.technological=env.technological;
  autosave();
  if(!silent){ Work5.rerender('plan'); showToast('已导入 PEST'); }
};

// Wrap a single AI call with global Runner (abort ×) so all AI actions are controllable.
Work5._run=async function(button, label, fn){
  const task=Runner.start({id:'work5-'+label, label, button, pausable:false});
  if(!task) return;
  try{ await fn(task.controller.signal); }
  catch(e){
    if(!(e && e.name==='AbortError')){ showToast('AI 失败: '+e.message); }
  }finally{ Runner.finish(); }
};
Work5.aiSwot=async function(button){
  return Work5._run(button,'SWOT', async signal=>{
    const sys='你是营销战略顾问。根据给定信息，输出 SWOT JSON: {"strengths":[],"weaknesses":[],"opportunities":[],"threats":[]}，每项 3-5 条短标签。';
    const user=`SBU: ${state.work1.sbu.name}\n环境:\nP=${state.work5.ch2_environment.political}\nE=${state.work5.ch2_environment.economic}\nS=${state.work5.ch2_environment.social}\nT=${state.work5.ch2_environment.technological}\n\n目标市场: ${state.work2.decision.rationale}\n卖点: ${state.work3.proposition.chosenValueText}`;
    const r=await API.callJson([{role:'system',content:sys},{role:'user',content:user}],{signal});
    if(r){
      const e=state.work5.ch2_environment;
      ['strengths','weaknesses','opportunities','threats'].forEach(k=>{
        if(Array.isArray(r[k])) e[k]=r[k];
      });
      autosave(); Work5.rerender('plan');
    }
  });
};

Work5.importTargeting=function(silent){
  const sel=state.work2.markets.find(m=>m.id===state.work2.matrix.selectedMarketId);
  if(!sel){ if(!silent)showToast('Work 2 未选择目标市场'); return; }
  const pts=Work2.computeMatrix();
  const p=pts.find(x=>x.id===sel.id);
  state.work5.ch3_strategy.targeting =
    `**目标市场**：${sel.name}（${sel.region||''}）。\n- 市场吸引力：${p.y.toFixed(2)}/10\n- 企业竞争力：${p.x.toFixed(2)}/10\n- 选择理由：${state.work2.decision.rationale||sel.reason||''}\n- 进入次序：${state.work2.decision.sequence||''}`;
  autosave();
  if(!silent){Work5.rerender('plan');showToast('已导入目标市场');}
};

Work5.importPositioning=function(silent){
  const p=state.work3.proposition;
  state.work5.ch3_strategy.positioning =
    `**价值主张**：${p.chosenValueText}\n\n**定位句**：${p.positioningStatement}\n\n**品牌人格**：${p.mbti} ${(p.personalityTraits||[]).join('/')}\n\n**Slogan**：${p.chosenSlogan}`;
  state.work5.ch3_strategy.segmentation = state.work1.personas.map(p=>`- ${p.name}（${p.age}，${p.occupation}，${p.region}）：${p.painPoints}`).join('\n');
  autosave();
  if(!silent){Work5.rerender('plan');showToast('已导入定位');}
};

Work5.import4P=function(silent){
  const m=state.work5.ch4_mix;
  m.route=Work4.summaryText('route');
  m.product=Work4.summaryText('product');
  m.price=Work4.summaryText('price');
  m.place=Work4.summaryText('place');
  m.promotion=Work4.summaryText('promotion');
  autosave();
  if(!silent){Work5.rerender('plan');showToast('已导入路径 + 4P');}
};

Work5.convert4C=async function(button){
  return Work5._run(button,'4C转换', async signal=>{
    const m=state.work5.ch4_mix;
    const sys='你是营销顾问。把 4P 转为 4C：Customer Value 来自 Product、Customer Cost 来自 Price（含时间/心理成本）、Convenience 来自 Place、Communication 来自 Promotion（双向沟通而非单向推送）。输出 JSON: {"customerValue":"","customerCost":"","convenience":"","communication":""}';
    const user=`Product: ${m.product}\nPrice: ${m.price}\nPlace: ${m.place}\nPromotion: ${m.promotion}`;
    const r=await API.callJson([{role:'system',content:sys},{role:'user',content:user}],{signal});
    if(r){ Object.assign(m,r); autosave(); Work5.rerender('plan'); }
  });
};

Work5.aiOutlook=async function(button){
  return Work5._run(button,'总结展望', async signal=>{
    const sys='你是品牌战略顾问。基于前四章生成总结与展望 300-500 字，包含核心战略复盘、关键风险与应对、6/12/24 月阶段性目标。用 Markdown。';
    const user=`SBU:${state.work1.sbu.name}\n目标市场:${(state.work2.markets.find(m=>m.id===state.work2.matrix.selectedMarketId)||{}).name}\n价值主张:${state.work3.proposition.chosenValueText}\n产品:${state.work5.ch4_mix.product.slice(0,200)}\n风险:${(state.work2.decision.risks||[]).join('；')}`;
    const text=await API.call([{role:'system',content:sys},{role:'user',content:user}],{signal});
    if(text){ state.work5.ch5_outlook=text; autosave(); Work5.rerender('plan'); }
  });
};

Work5.aiTitle=async function(button,container){
  return Work5._run(button,'起名', async signal=>{
    const r=await API.callJson([{role:'system',content:'你是品牌策划书编辑。根据 SBU 与目标市场，输出 5 个标题备选 JSON: {"titles":[""]}'},
      {role:'user',content:`SBU:${state.work1.sbu.name}\n目标市场:${(state.work2.markets.find(m=>m.id===state.work2.matrix.selectedMarketId)||{}).name}\n价值主张:${state.work3.proposition.chosenValueText}`}],{signal});
    if(r?.titles){
      const box=el('div',{class:'plate',style:{'margin-top':'10px'}},
        el('span',{class:'plate-label'},'备选标题（点击使用）'),
        ...r.titles.map(t=>el('div',{style:{padding:'6px 0',cursor:'pointer','border-bottom':'1px solid var(--line)','font-family':'var(--font-display)','font-style':'italic','font-size':'18px'},
          onclick:()=>{state.work5.cover.title=t;autosave();Work5.rerender('plan')}},'· '+t))
      );
      container.appendChild(box);
    }
  });
};

Work5.aiPolish=async function(field,label,button){
  const cur=state.work5[field];
  if(!cur){ showToast('请先填写内容'); return; }
  return Work5._run(button,'润色-'+label, async signal=>{
    const text=await API.call([{role:'system',content:`你是策划书编辑。润色给定的${label}章节，保持事实不变，仅让表达更通顺专业。直接输出润色后的 Markdown。`},
      {role:'user',content:cur}],{signal});
    if(text){ state.work5[field]=text; autosave(); Work5.rerender('plan'); showToast('已润色 '+label); }
  });
};

// Multi-chapter polish: pausable Runner, one unit per chapter.
Work5.aiPolishAll=async function(button){
  const fields=[['ch1_business','业务概况'],['abstract','摘要']].filter(([f])=>state.work5[f]);
  if(!fields.length){ showToast('没有可润色的章节'); return; }
  const task=Runner.start({id:'work5-polish-all', label:'润色全文', button, total:fields.length, pausable:true,
    onPause:()=>autosave(), onResume:()=>{}});
  if(!task) return;
  for(const [f,l] of fields){
    if(task.aborted) break;
    try{
      const text=await API.call([{role:'system',content:`你是策划书编辑。润色给定的${l}章节，保持事实不变，仅让表达更通顺专业。直接输出润色后的 Markdown。`},
        {role:'user',content:state.work5[f]}],{signal:task.controller.signal});
      if(text){ state.work5[f]=text; autosave(); }
    }catch(e){ if(task.aborted || (e&&e.name==='AbortError')) break; console.warn(e); }
    task.done++; Runner.renderUI();
    try{ await Runner.checkpoint(); }catch{ break; }
  }
  Runner.finish();
  Work5.rerender('plan');
};

Work5.refreshDynamic=function(){};

/* ---------- EXPORT ---------- */
Work5.exportMd = function(){
  const w=state.work5;
  const refs = w.references.length ? '\n## 参考文献\n'+w.references.map((r,i)=>`${i+1}. ${r.authors} (${r.year}). ${r.title}. ${r.url}`).join('\n') : '';
  return `\n## V. 策划书正文\n\n# ${w.cover.title}\n## ${w.cover.subtitle}\n${w.cover.team} · ${w.cover.date}\n\n## 摘要\n${w.abstract}\n\n## 1. 企业及业务概况\n${w.ch1_business}\n\n## 2. 营销环境分析\n### 2.1 PEST\n- 政治：${w.ch2_environment.political}\n- 经济：${w.ch2_environment.economic}\n- 社会：${w.ch2_environment.social}\n- 技术：${w.ch2_environment.technological}\n\n### 2.2 SWOT\n| 优势 S | 劣势 W |\n|---|---|\n| ${(w.ch2_environment.strengths||[]).join('；')} | ${(w.ch2_environment.weaknesses||[]).join('；')} |\n| **机会 O** | **威胁 T** |\n| ${(w.ch2_environment.opportunities||[]).join('；')} | ${(w.ch2_environment.threats||[]).join('；')} |\n\n## 3. 营销战略（STP）\n### 3.1 细分\n${w.ch3_strategy.segmentation}\n\n### 3.2 目标市场\n${w.ch3_strategy.targeting}\n\n### 3.3 定位\n${w.ch3_strategy.positioning}\n\n## 4. 营销组合（4P / 4C）\n### 产品\n${w.ch4_mix.product}\n\n### 价格\n${w.ch4_mix.price}\n\n### 渠道\n${w.ch4_mix.place}\n\n### 促销\n${w.ch4_mix.promotion}\n\n### 4C\n- **客户价值**：${w.ch4_mix.customerValue}\n- **客户成本**：${w.ch4_mix.customerCost}\n- **客户便利**：${w.ch4_mix.convenience}\n- **客户沟通**：${w.ch4_mix.communication}\n\n## 5. 总结与展望\n${w.ch5_outlook}\n${refs}`;
};
