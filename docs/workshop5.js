/* ============================================================
   WORKSHOP 5 — 策划书
   Single scrollable document with editable chapters.
   ============================================================ */
// Work 5 工具步骤的 editorial 视觉注入：
// 复用 _hallmark_w5_demo.html 的设计语言（Playfair/Lora/12 列 grid 杂志感），
// 但只套到 #steps5 容器内，不污染 work1-4 同名 class。
// IIFE 防止重复注入。
(function(){
  if (document.getElementById('w5-editorial-styles')) return;
  const link = document.createElement('link');
  link.id = 'w5-editorial-styles';
  link.rel = 'stylesheet';
  link.href = 'workshop5-editorial.css';
  document.head.appendChild(link);
})();

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
  const dn5=UI.demoNote(5,'plan'); if(dn5) sec.appendChild(dn5);
  if(Work5.mvo) sec.appendChild(UI.mvoCard(Work5.mvo(), sec));

  // ---------- Cover (editorial centered) ----------
  sec.appendChild(Work5.section('cover','封面', function(body){
    const c=state.work5.cover;
    // 编辑态：字段列在，下方是排版态预览
    body.appendChild(el('div',{class:'edit-grid'},
      el('label',{},'标题'),el('input',{value:c.title||'',oninput:e=>{c.title=e.target.value;autosave();Work5.rerender('cover')}}),
      el('label',{},'副标题'),el('input',{value:c.subtitle||'',oninput:e=>{c.subtitle=e.target.value;autosave();Work5.rerender('cover')}}),
      el('label',{},'团队 / 小组'),el('input',{value:c.team||'',oninput:e=>{c.team=e.target.value;autosave();Work5.rerender('cover')}}),
      el('label',{},'日期'),el('input',{type:'date',value:c.date||'',oninput:e=>{c.date=e.target.value;autosave();Work5.rerender('cover')}}),
    ));
    body.appendChild(el('div',{class:'ai-actions'},
      el('button',{class:'btn btn--ghost btn--small',onclick:e=>Work5.aiTitle(e.currentTarget,body)},'用 AI 起名')
    ));
    // 排版态预览
    const prev=el('div',{class:'cover-preview'},
      el('div',{class:'cover-title',contenteditable:'true',oninput:e=>{c.title=e.target.textContent;autosave();}},
        c.title||'〔点击此处输入策划书标题〕'),
      el('div',{class:'cover-subtitle',contenteditable:'true',oninput:e=>{c.subtitle=e.target.textContent;autosave();}},
        c.subtitle||'〔点击此处输入副标题——一句话讲清这份策划要解决什么问题〕'),
      el('div',{class:'cover-meta'},
        el('div',{},el('strong',{},c.team||'〔团队〕'),el('div',{},'TEAM')),
        el('div',{},el('strong',{},c.date||'〔日期〕'),el('div',{},'DATE')),
        el('div',{},el('strong',{},'策划书'),el('div',{},'DOCUMENT'))
      )
    );
    body.appendChild(prev);
  }));

  // ---------- Abstract (italic editorial) ----------
  sec.appendChild(Work5.section('abstract','摘要', function(body){
    body.appendChild(el('div',{class:'ai-actions'},
      el('button',{class:'btn btn--ghost btn--small',onclick:()=>Work5.aggregateAbstract()},'从章节自动汇总'),
      el('button',{class:'btn btn--ghost btn--small',onclick:e=>Work5.aiPolish('abstract','摘要',e.currentTarget)},'AI 润色')
    ));
    const ab=el('div',{class:'abstract',contenteditable:'true',
      oninput:e=>{state.work5.abstract=e.target.textContent;autosave();}},
      state.work5.abstract||'〔点击此处输入摘要——本策划书围绕……展开，目标解决……问题。〕');
    body.appendChild(ab);
  }));

  // ---------- Chapter 1 ----------
  sec.appendChild(Work5.section('ch1','1. 企业及业务概况', function(body){
    body.appendChild(el('div',{class:'ai-actions'},
      el('button',{class:'btn btn--ghost btn--small',onclick:()=>Work5.aggregateCh1()},'从 Work 1 汇总'),
      el('button',{class:'btn btn--ghost btn--small',onclick:e=>Work5.aiPolish('ch1_business','业务概况',e.currentTarget)},'AI 改写为章节语言')
    ));
    const t=el('div',{class:'chapter-text',contenteditable:'true',
      oninput:e=>{state.work5.ch1_business=e.target.textContent;autosave();}},
      state.work5.ch1_business||'〔点击此处输入企业及业务概况——业务基本面、为什么要做、我们是谁/不是谁。〕');
    body.appendChild(t);
    // 价值链定位：来自 Work1 微笑曲线收口（只读引用，自动带出）
    const vcLine = Work5.valueChainLine();
    if(vcLine){
      body.appendChild(el('p',{style:'font-size:12px;color:var(--color-ink-2);margin-top:10px;letter-spacing:.02em;line-height:1.7'},
        '价值链定位：'+vcLine));
    }
  }));

  // ---------- Chapter 2: PEST 2x2 + SWOT 2x2 ----------
  sec.appendChild(Work5.section('ch2','2. 营销环境分析（PEST + SWOT）', function(body){
    const e=state.work5.ch2_environment;
    body.appendChild(el('div',{class:'ai-actions'},
      el('button',{class:'btn btn--ghost btn--small',onclick:()=>Work5.importPestFromWork1()},'从 Work 1 导入 PEST'),
      el('button',{class:'btn btn--ghost btn--small',onclick:e=>Work5.aiSwot(e.currentTarget)},'AI 提取 SWOT')
    ));

    // 2.1 PEST 2×2 大字版
    body.appendChild(el('div',{class:'sub-head'},
      el('span',{class:'num'},'2.1'),
      el('h3',{},'PEST · 政治 / 经济 / 社会 / 技术')
    ));
    const pestGrid=el('div',{class:'pest-2x2'});
    [['political','P','POLITICAL'],
     ['economic','E','ECONOMIC'],
     ['social','S','SOCIAL'],
     ['technological','T','TECHNOLOGICAL']].forEach(([k,letter,label])=>{
      const cell=el('div',{class:'pest-cell'},
        el('div',{class:'pest-letter'},letter),
        el('div',{class:'pest-label'},label),
        el('div',{class:'pest-text',contenteditable:'true',
          oninput:ev=>{e[k]=ev.target.textContent;autosave();}},
          e[k]||'〔点击此处输入……〕')
      );
      pestGrid.appendChild(cell);
    });
    body.appendChild(pestGrid);

    // 2.2 SWOT 2×2 大字版（项目列表）
    body.appendChild(el('div',{class:'sub-head'},
      el('span',{class:'num'},'2.2'),
      el('h3',{},'SWOT · 优势 / 劣势 / 机会 / 威胁')
    ));
    const swotGrid=el('div',{class:'swot-2x2'});
    [['strengths','S','优势'],['weaknesses','W','劣势'],
     ['opportunities','O','机会'],['threats','T','威胁']].forEach(([k,letter,label])=>{
      const itemsWrap=el('div',{class:'items'});
      const renderItems=()=>{
        itemsWrap.innerHTML='';
        (e[k]||[]).forEach((it,i)=>{
          const row=el('div',{class:'item',contenteditable:'true',
            oninput:ev=>{ e[k][i]=ev.target.textContent; autosave(); }},
            it);
          itemsWrap.appendChild(row);
        });
        // 新增一行（占位）
        const addRow=el('div',{class:'item item-add',contenteditable:'true',
          oninput:ev=>{
            const v=ev.target.textContent.trim();
            if(v){
              if(!e[k]) e[k]=[];
              e[k].push(v);
              autosave(); Work5.rerender('ch2');
            }
          }},
          '＋ 添加');
        itemsWrap.appendChild(addRow);
      };
      renderItems();
      const cell=el('div',{class:'swot-cell '+k[0]},
        el('div',{class:'label'},
          el('span',{class:'letter'},letter),
          el('span',{},label)
        ),
        itemsWrap
      );
      swotGrid.appendChild(cell);
    });
    body.appendChild(swotGrid);
  }));

  // ---------- Chapter 3: STP ----------
  sec.appendChild(Work5.section('ch3','3. 营销战略（STP）', function(body){
    const s=state.work5.ch3_strategy;
    body.appendChild(el('div',{class:'ai-actions'},
      el('button',{class:'btn btn--ghost btn--small',onclick:()=>Work5.importTargeting()},'从 Work 2 导入'),
      el('button',{class:'btn btn--ghost btn--small',onclick:()=>Work5.importPositioning()},'从 Work 3 导入')
    ));
    const stp=el('div',{class:'stp'},
      ...['segmentation','targeting','positioning'].map(k=>{
        const map={segmentation:{letter:'S',name:'细分',en:'Segmentation'},
                   targeting:{letter:'T',name:'目标',en:'Targeting'},
                   positioning:{letter:'P',name:'定位',en:'Positioning'}}[k];
        return el('div',{class:'stp-row'},
          el('div',{class:'stp-label'},
            el('span',{class:'name'},map.letter+' — '+map.name),
            map.en
          ),
          el('div',{class:'stp-text',contenteditable:'true',
            oninput:e=>{s[k]=e.target.textContent;autosave();}},
            s[k]||'〔点击此处输入……〕')
        );
      })
    );
    body.appendChild(stp);
  }));

  // ---------- Chapter 4: 4P / 4C ----------
  sec.appendChild(Work5.section('ch4','4. 营销组合（路径 + 4P / 4C）', function(body){
    const m=state.work5.ch4_mix;
    body.appendChild(el('div',{class:'ai-actions'},
      el('button',{class:'btn btn--ghost btn--small',onclick:()=>Work5.import4P()},'从 Work 4 导入'),
      el('button',{class:'btn btn--ghost btn--small',onclick:e=>Work5.convert4C(e.currentTarget)},'AI 转换为 4C')
    ));

    // 增长路径（独立段落）
    body.appendChild(el('div',{class:'sub-head'},
      el('span',{class:'num'},'4.0'),
      el('h3',{},'增长路径')
    ));
    body.appendChild(el('div',{class:'chapter-text',contenteditable:'true',
      oninput:e=>{m.route=e.target.textContent;autosave();}},
      m.route||'〔点击此处输入——模式/路径/节奏……〕'));

    // 4.1 4P
    body.appendChild(el('div',{class:'sub-head'},
      el('span',{class:'num'},'4.1'),
      el('h3',{},'4P · Product / Price / Place / Promotion')
    ));
    const pGrid=el('div',{class:'four-grid'});
    [['product','P','Product','产品'],['price','P','Price','价格'],
     ['place','P','Place','渠道'],['promotion','P','Promotion','促销']].forEach(([k,l,n,zh])=>{
      pGrid.appendChild(el('div',{class:'four-cell'},
        el('div',{class:'four-label'},l+' · '+n),
        el('div',{class:'four-name'},zh),
        el('div',{class:'four-text',contenteditable:'true',
          oninput:e=>{m[k]=e.target.textContent;autosave();}},
          m[k]||'〔点击此处输入……〕')
      ));
    });
    body.appendChild(pGrid);

    // 4.2 4C
    body.appendChild(el('div',{class:'sub-head'},
      el('span',{class:'num'},'4.2'),
      el('h3',{},'4C · Customer Value / Cost / Convenience / Communication')
    ));
    const cGrid=el('div',{class:'four-grid'});
    [['customerValue','C','Customer Value','客户价值'],
     ['customerCost','C','Customer Cost','客户成本'],
     ['convenience','C','Convenience','客户便利'],
     ['communication','C','Communication','客户沟通']].forEach(([k,l,n,zh])=>{
      cGrid.appendChild(el('div',{class:'four-cell'},
        el('div',{class:'four-label'},l+' · '+n),
        el('div',{class:'four-name'},zh),
        el('div',{class:'four-text',contenteditable:'true',
          oninput:e=>{m[k]=e.target.textContent;autosave();}},
          m[k]||'〔点击此处输入……〕')
      ));
    });
    body.appendChild(cGrid);
  }));

  // ---------- Chapter 5 ----------
  sec.appendChild(Work5.section('ch5','5. 总结与展望', function(body){
    body.appendChild(el('div',{class:'ai-actions'},
      el('button',{class:'btn btn--ghost btn--small',onclick:e=>Work5.aiOutlook(e.currentTarget)},'AI 生成总结展望')
    ));
    const t=el('div',{class:'chapter-text',contenteditable:'true',
      oninput:e=>{state.work5.ch5_outlook=e.target.textContent;autosave();}},
      state.work5.ch5_outlook||'〔点击此处输入总结与展望——里程碑、关键风险、长期愿景。〕');
    body.appendChild(t);
  }));

  // ---------- References (editorial table) ----------
  sec.appendChild(Work5.section('refs','参考文献', function(body){
    const refs=state.work5.references;
    const tableWrap=el('div',{class:'refs'});
    const t=el('table',{class:'refs-tbl'});
    const thead=el('thead',{},el('tr',{},...['#','作者','标题','年份','URL',''].map(h=>el('th',{},h))));
    const tb=el('tbody');
    refs.forEach((r,i)=>{
      const tr=el('tr',{'data-i':String(i)},
        el('td',{class:'num'},String(i+1)),
        ...['authors','title','year','url'].map(k=>el('td',{contenteditable:'true',
          oninput:e=>{r[k]=e.target.textContent;autosave();}},r[k]||'')),
        el('td',{},el('button',{class:'btn btn--ghost btn--small',onclick:()=>{refs.splice(i,1);autosave();Work5.rerender('refs')}},'×'))
      );
      tb.appendChild(tr);
    });
    t.appendChild(thead);t.appendChild(tb);tableWrap.appendChild(t);
    body.appendChild(tableWrap);
    body.appendChild(el('button',{class:'btn btn--ghost btn--small',onclick:()=>{
      refs.push({authors:'',title:'',year:'',url:''}); autosave(); Work5.rerender('refs');
    }},'＋ 添加文献'));
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

Work5.mvo = function(){
  const w=state.work5;
  return {
    checks: [
      {label:'封面（标题/团队/日期）已填', test:()=>!!(w.cover.title&&w.cover.team&&w.cover.date)},
      {label:'摘要已写或已汇总', test:()=>(w.abstract||'').trim().length>30},
      {label:'Work 1–4 内容已汇总进各章节', test:()=>!!(w.ch1_business||'').trim()&&!!(w.ch3_market||'').trim()&&!!(w.ch4_mix||'').trim()},
      {label:'风险与落地（里程碑）已写', test:()=>!!(w.ch6_risks||'').trim()||!!(w.ch7_roadmap||'').trim()},
    ],
    note:'策划书是给别人看的——把 AI 汇总的"正确的废话"改成你企业的具体判断和数据。打印前通读一遍，删掉所有没证据支撑的结论。'
  };
};

Work5.toolbar=function(){
  return el('div',{class:'plate no-print',style:{display:'flex',gap:'10px','flex-wrap':'wrap',alignItems:'center','margin-bottom':'20px'}},
    el('button',{class:'btn btn--small',onclick:()=>Work5.aggregateAll()},'从 Work 1–4 一键汇总',el('span',{class:'arrow'})),
    el('button',{class:'btn btn--ghost btn--small',onclick:()=>window.print()},'打印 / PDF'),
    el('button',{class:'btn btn--ghost btn--small',onclick:()=>App.exportMd()},'导出 Markdown'),
    el('button',{class:'btn btn--ghost btn--small',onclick:e=>Work5.aiPolishAll(e.currentTarget)},'AI 润色全文')
  );
};

// 随机生成示例：先看 Work 1-4 是否已有数据。
// 有 → 直接汇总（与"从 Work 1-4 一键汇总"等价，但语义统一为"随机示例"）
// 无 → 用各 work 内置的样本数据快速填一份, 再汇总
// Work5.randomExampleAll 已删除：演示数据入口统一走顶栏"演示案例"菜单（DemoMenu），
// 不再在 Work 5 toolbar 重复一个"随机生成示例"按钮。

// 价值链定位：来自 Work1 微笑曲线收口（只读引用，供策划书自动带出 / 导出）
Work5.valueChainLine=function(){
  try{
    const env = state.work1.environment;
    const t = (env && env.ourCapabilities && env.ourCapabilities.smileCurve) || (typeof Work1!=='undefined' && Work1.smileConclusion ? Work1.smileConclusion() : '');
    return String(t||'').trim();
  }catch(e){ return ''; }
};

Work5.section=function(id,title,bodyFn){
  // 形态：id ∈ {cover, abstract, ch1..ch5, refs} ; title 形如 "1. 企业及业务概况"
  // 返回：cover 走 .cover 布局；abstract 走 .chapter + eyebrow + h2 + plate(body)；
  //       其它章节走 .chapter + chapter-head(eyebrow+h2) + plate(body)。
  const splitTitle = (() => {
    const m = title.match(/^(\d+)\.\s*(.+)$/);
    return m ? { num: m[1] + '.', label: m[2] } : null;
  })();
  const section = el('section', { class: id === 'cover' ? 'cover' : 'chapter' });
  if (id === 'cover') {
    section.appendChild(el('div', { class: 'eyebrow' },
      el('span', { class: 'num' }, 'V / ' + ((splitTitle && splitTitle.num) || '策划书')),
      el('span', { class: 'sep' }, '/'),
      el('span', {}, 'Global Brand Workshop · 策划书')
    ));
    const body = el('div', {});
    bodyFn(body);
    section.appendChild(body);
    return section;
  }
  if (id === 'abstract') {
    section.appendChild(el('div', { class: 'chapter-head' },
      el('div', { class: 'eyebrow' },
        el('span', { class: 'num' }, 'V / 02'),
        el('span', { class: 'sep' }, '/'),
        el('span', {}, 'Abstract')
      ),
      el('h2', {}, '摘要')
    ));
  } else if (splitTitle) {
    section.appendChild(el('div', { class: 'chapter-head' },
      el('div', { class: 'eyebrow' },
        el('span', { class: 'num' }, 'V / ' + (splitTitle.num.replace('.', '').padStart(2, '0'))),
        el('span', { class: 'sep' }, '/'),
        el('span', {}, 'Chapter ' + splitTitle.num.replace('.', ''))
      ),
      el('h2', {}, splitTitle.label)
    ));
  } else {
    section.appendChild(el('div', { class: 'chapter-head' },
      el('div', { class: 'eyebrow' },
        el('span', { class: 'num' }, 'V / 99'),
        el('span', { class: 'sep' }, '/'),
        el('span', {}, 'References')
      ),
      el('h2', {}, title || '参考文献')
    ));
  }
  const body = el('div', { class: 'plate' });
  bodyFn(body);
  section.appendChild(body);
  return section;
};

Work5.refreshCover=function(){
  const c=state.work5.cover, prev=document.getElementById('coverPreview');
  if(!prev) return;
  prev.innerHTML=`
    <div style="text-align:center;padding:32px 20px">
      <div class="mono" style="font-size:11px;letter-spacing:.2em;color:var(--color-ink-2)">GLOBAL BRAND WORKSHOP · ${esc(c.date)}</div>
      <h1 style="margin:14px 0 6px">${esc(c.title||'〔标题〕')}</h1>
      <div style="font-family:var(--font-display);font-style:normal;font-size:20px;color:var(--color-accent)">${esc(c.subtitle||'')}</div>
      <div class="mono" style="font-size:11px;letter-spacing:.15em;color:var(--color-ink-2);margin-top:28px">${esc(c.team||'')}</div>
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
    const c=el('div',{style:{padding:'14px',background:bg,'border-right':'1px solid var(--color-rule)','border-bottom':'1px solid var(--color-rule)','min-height':'120px'}});
    c.appendChild(el('div',{class:'mono',style:{'font-size':'11px','letter-spacing':'.15em',color:'var(--color-accent)','margin-bottom':'6px'}},label));
    (items||[]).forEach(i=>c.appendChild(el('div',{style:{'font-size':'13px',padding:'2px 0'}},'· '+i)));
    vis.appendChild(c);
  });
};

/* ---------- AGGREGATION ---------- */
Work5.aggregateAll=function(){
  const c=state.work5.cover;
  if(!c.title){
    c.title = state.work1.sbu.name ? state.work1.sbu.name+' — 市场分析与品牌布局' : '市场分析与品牌布局';
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
        ...r.titles.map(t=>el('div',{style:{padding:'6px 0',cursor:'pointer','border-bottom':'1px solid var(--color-rule)','font-family':'var(--font-display)','font-style':'normal','font-size':'18px'},
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
  const vcLine = Work5.valueChainLine();
  return `\n## V. 策划书正文\n\n# ${w.cover.title}\n## ${w.cover.subtitle}\n${w.cover.team} · ${w.cover.date}\n\n## 摘要\n${w.abstract}\n\n## 1. 企业及业务概况\n${w.ch1_business}${vcLine ? '\n\n价值链定位：'+vcLine : ''}\n\n## 2. 营销环境分析\n### 2.1 PEST\n- 政治：${w.ch2_environment.political}\n- 经济：${w.ch2_environment.economic}\n- 社会：${w.ch2_environment.social}\n- 技术：${w.ch2_environment.technological}\n\n### 2.2 SWOT\n| 优势 S | 劣势 W |\n|---|---|\n| ${(w.ch2_environment.strengths||[]).join('；')} | ${(w.ch2_environment.weaknesses||[]).join('；')} |\n| **机会 O** | **威胁 T** |\n| ${(w.ch2_environment.opportunities||[]).join('；')} | ${(w.ch2_environment.threats||[]).join('；')} |\n\n## 3. 营销战略（STP）\n### 3.1 细分\n${w.ch3_strategy.segmentation}\n\n### 3.2 目标市场\n${w.ch3_strategy.targeting}\n\n### 3.3 定位\n${w.ch3_strategy.positioning}\n\n## 4. 营销组合（4P / 4C）\n### 产品\n${w.ch4_mix.product}\n\n### 价格\n${w.ch4_mix.price}\n\n### 渠道\n${w.ch4_mix.place}\n\n### 促销\n${w.ch4_mix.promotion}\n\n### 4C\n- **客户价值**：${w.ch4_mix.customerValue}\n- **客户成本**：${w.ch4_mix.customerCost}\n- **客户便利**：${w.ch4_mix.convenience}\n- **客户沟通**：${w.ch4_mix.communication}\n\n## 5. 总结与展望\n${w.ch5_outlook}\n${refs}`;
};
