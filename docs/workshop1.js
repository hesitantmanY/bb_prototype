/* ============================================================
   WORKSHOP 1 — 业务价值体系
   Steps: sbu / environment / personas / survey / analysis / values / recommendations
   ============================================================ */
Work1.steps = [
  {id:'sbu', label:'1. SBU'},
  {id:'environment', label:'2. 环境'},
  {id:'personas', label:'3. 客户画像'},
  {id:'metrics', label:'4. 指标体系'},
  {id:'survey', label:'5. 合成调研'},
  {id:'analysis', label:'6. 数据分析'},
  {id:'values', label:'7. 价值框架'},
  {id:'recommendations', label:'8. 建议'}
];

Work1.defaultData = () => ({
  sbu: { name:'', category:'', stage:'', scope:'', countries:[], summary:'' },
  environment: {
    political:'', economic:'', social:'', technological:'',
    industry:'', competitors:'', trends:'', swot:{s:[],w:[],o:[],t:[]}
  },
  personas: [],   // {id, name, gender, age, occupation, income, region, values, painPoints, channels, quote, traits}
  metrics: {      // 品牌资产指标体系（CBBE）：一级维度 → 二级指标（问卷题目的来源）
    dimensions: [
      { id:uid('m'), name:'品牌功效', secondaries:[
        {id:uid('s'), name:'产品品质'},{id:uid('s'), name:'工艺技术'},{id:uid('s'), name:'销售和售后'}
      ]},
      { id:uid('m'), name:'品牌形象', secondaries:[
        {id:uid('s'), name:'知名度'},{id:uid('s'), name:'竞争地位'},{id:uid('s'), name:'品牌传播'},{id:uid('s'), name:'社会贡献'}
      ]}
    ]
  },
  survey: {
    questions: [],   // {id, type:'likert'|'open'|'single'|'multi', text, options, anchors, sourceIndicatorId}
    responses: [],   // {personaId, answers:[{questionId, value, raw}]}
    n: 0,
    status:'idle',  // idle | running | done | error
    mode:'api',
    useFewShot:true, useRag:false, ragContext:'',
    progress:{done:0,total:0},
    error:null
  },
  analysis: {
    likertStats: {},   // questionId -> {mean, sd, dist:[5 counts]}
    openThemes: [],    // {questionId, themes:[{label,count,quote}]}
    indicatorMeans: [], // {label, value}
    insights: ''
  },
  values: {
    functional:[], emotional:[], social:[], epistemic:[], conditional:[],
    chosenFunctional:'', chosenEmotional:'', chosenSocial:'',
    rationale:''
  },
  recommendations: { short:'', mid:'', long:'', risks:[] }
});

const LIKERT5 = ['非常不同意','不同意','一般','同意','非常同意'];

Work1.renderStep = function(id){
  const sec = document.querySelector('#steps1 .step[data-step="'+id+'"]');
  if(!sec) return;
  if(sec.dataset.rendered==='1'){ Work1.refreshDynamic(id); return; }
  Work1._renderFull(sec, id);
};
// Force a full rebuild of a step (use after structural changes: add/delete/reorder).
Work1.rerender = function(id){
  const sec = document.querySelector('#steps1 .step[data-step="'+id+'"]');
  if(!sec) return;
  Work1._renderFull(sec, id);
};
Work1._renderFull = function(sec, id){
  sec.innerHTML='';
  sec.appendChild(UI.stepHeader(
    'STEP '+Work1.steps.findIndex(s=>s.id===id),
    Work1.titles[id],
    Work1.subtitles[id]
  ));
  const fn = Work1.render[id];
  if(fn) fn(sec);
  sec.dataset.rendered='1';
};

Work1.titles = {
  sbu:'战略业务单元',
  environment:'宏观与行业环境',
  personas:'客户画像',
  metrics:'品牌资产指标体系',
  survey:'合成消费者调研',
  analysis:'调研数据分析',
  values:'客户价值框架',
  recommendations:'策略建议'
};
Work1.subtitles = {
  sbu:'界定本次工作坊所聚焦的 SBU，它是后续所有分析的边界。',
  environment:'PEST + 行业 + 竞争者，为后续判断提供事实底色。',
  personas:'定义 3–6 个典型客户画像，作为合成调研的答题者。',
  metrics:'基于 CBBE 品牌资产金字塔搭建一级 / 二级指标；问卷题目将由此生成。课程要求至少 5 个一级指标、每个一级指标下至少 3 个测评点。',
  survey:'让画像作为合成受访者回答结构化问卷；方法依据 AI-Human Hybrids (JM 2025)。',
  analysis:'分布、均值、主题聚类；自动聚合并呈现在 Atelier 图表中。',
  values:'从功能 / 情感 / 社会 / 认知 / 条件五个维度提炼价值要素。',
  recommendations:'把洞察转化为短中长期可执行建议，风险单列。'
};

Work1.render = {};

/* ---------- STEP 1: SBU ---------- */
Work1.render.sbu = function(sec){
  const d=state.work1.sbu;
  if(!Array.isArray(d.countries)) d.countries=[];

  // 地区 → 国家清单（硬编码常见市场）
  const REGION_COUNTRIES = {
    '东南亚': ['泰国','越南','印度尼西亚','马来西亚','菲律宾','新加坡','柬埔寨','老挝','缅甸','文莱'],
    '东亚（日韩）': ['日本','韩国'],
    '南亚（印度等）': ['印度','巴基斯坦','孟加拉国','斯里兰卡','尼泊尔'],
    '中东': ['沙特阿拉伯','阿联酋','以色列','土耳其','伊朗','卡塔尔','科威特','阿曼','约旦','埃及'],
    '欧洲': ['英国','法国','德国','意大利','西班牙','荷兰','瑞士','瑞典','挪威','丹麦','芬兰','波兰','葡萄牙','比利时','奥地利','爱尔兰'],
    '北美': ['美国','加拿大','墨西哥'],
    '拉美': ['巴西','阿根廷','智利','哥伦比亚','秘鲁','墨西哥'],
    '非洲': ['南非','尼日利亚','肯尼亚','埃及','摩洛哥','埃塞俄比亚','加纳'],
    '大洋洲': ['澳大利亚','新西兰','斐济'],
    '全球': []
  };
  const REGIONS = ['东南亚','东亚（日韩）','南亚（印度等）','中东','欧洲','北美','拉美','非洲','大洋洲','全球'];

  // 是否需要展示「目标国家（可多选）」块：仅当 scope 命中一个真实的地区
  const scopeHasRegion = !!(d.scope && REGION_COUNTRIES[d.scope] && d.scope !== '全球');

  // 输入框加 placeholder，鼠标点进去就能看到该填什么
  sec.appendChild(UI.field('SBU 名称', el('input',{type:'text',value:d.name,placeholder:'例：海外智能家居品牌 · 面向年轻消费者',oninput:e=>{d.name=e.target.value;autosave();App.updateSummary()}})));
  sec.appendChild(UI.field('所属品类 / 行业', el('input',{type:'text',value:d.category,placeholder:'例：消费电子 / 智能家居 / 美妆个护',oninput:e=>{d.category=e.target.value;autosave()}})));

  // 国家多选改用 checkbox 列表：每个国家一个 checkbox，单击即切换，
  // 视觉上就是「多选」而不是「下拉里按住 Ctrl」。整块先放 DOM 里、切地区时只换内容。
  const countryList = el('div',{class:'country-list', style:{display:'flex','flex-wrap':'wrap',gap:'6px 14px',marginTop:'4px','align-items':'center'}});
  const countryField = UI.field('目标国家（可多选）', countryList);

  function refreshCountryBlock(){
    const showCountries = !!(d.scope && REGION_COUNTRIES[d.scope] && d.scope !== '全球');
    if(!showCountries){
      countryField.style.display = 'none';
      d.countries = [];
      return;
    }
    countryField.style.display = '';
    countryList.innerHTML = '';
    REGION_COUNTRIES[d.scope].forEach(c=>{
      const cb = el('input',{type:'checkbox',value:c});
      cb.checked = d.countries.includes(c);
      cb.addEventListener('change', ()=>{
        if(cb.checked){
          if(!d.countries.includes(c)) d.countries.push(c);
        }else{
          d.countries = d.countries.filter(x=>x!==c);
        }
        autosave();
      });
      const lab = el('label',{style:{display:'inline-flex','align-items':'center',gap:'4px',cursor:'pointer','font-size':'14px','white-space':'nowrap'}},
        cb, document.createTextNode(c)
      );
      countryList.appendChild(lab);
    });
  }

  // 切换「地理范围」：只更新数据 + 局部刷新国家块，不重渲染整个 SBU。
  const scopeSelect = el('select',{onchange:e=>{
    d.scope = e.target.value;
    refreshCountryBlock();
    autosave();
  }}, ...[''].concat(REGIONS).map(o=>{
    // value 保持空字符串（state 里是 ''），但显示成「请选择地区」
    const text = o === '' ? '请选择地区' : o;
    const opt=el('option',{value:o},text); if(o===d.scope)opt.selected=true; return opt;
  }));

  const grid=el('div',{class:'grid2'},
    UI.field('所处阶段', el('select',{onchange:e=>{d.stage=e.target.value;autosave()}},
      ...['','初创期','成长期','成熟期','转型期','海外扩张期'].map(o=>{
        // value 保持空字符串（state 里是 ''），但显示成「请选择阶段」
        const text = o === '' ? '请选择阶段' : o;
        const opt=el('option',{value:o},text); if(o===d.stage)opt.selected=true; return opt;
      }))),
    UI.field('地理范围', scopeSelect)
  );
  sec.appendChild(grid);

  // 国家块始终在 DOM 里（避免布局抖动 / 焦点丢失），但默认隐藏
  sec.appendChild(countryField);
  refreshCountryBlock();

  sec.appendChild(UI.field('一句话业务概述', el('textarea',{rows:3,placeholder:'用一句话讲清「为谁、解决什么问题、和竞品有何不同」',oninput:e=>{d.summary=e.target.value;autosave()}},d.summary)));
};

/* ---------- STEP 2: ENVIRONMENT ---------- */
Work1.render.environment = function(sec){
  const d=state.work1.environment;
  // PEST 1×4 editorial grid — big italic serif letter + monospace label + textarea
  const pest=[
    ['political',  'P', '政治 / 政策 / 法规'],
    ['economic',   'E', '经济 / 汇率 / 购买力'],
    ['social',     'S', '社会 / 文化 / 人口'],
    ['technological','T','技术 / 基础设施 / 渠道']
  ];
  const placeholders = {
    political: '例：东南亚华人对中国传统文化接受度高…',
    economic:  '例：新加坡 2023 年人均 GDP 约 USD 84,000…',
    social:    '例：华人 25–40 岁群体对节气、慢生活感兴趣…',
    technological:'例：Shopee、Lazada、跨境电商渗透率高…'
  };
  const grid=el('div',{class:'pest-grid'});
  pest.forEach(([k,letter,label])=>{
    const item=el('div',{class:'pest-item'});
    item.appendChild(el('div',{class:'pest-letter'}, letter));
    item.appendChild(el('span',{class:'pest-label'}, label));
    item.appendChild(el('textarea',{
      rows:5,
      placeholder: placeholders[k] || '',
      oninput:e=>{d[k]=e.target.value;autosave()}
    }, d[k] || ''));
    grid.appendChild(item);
  });
  sec.appendChild(grid);
  sec.appendChild(el('hr',{class:'rule'}));

  // Three narrative fields — use .field-h so labels render as big italic serif
  // (matching the PEST 1×4 grid and the usehallmark reference).
  const mkField = (label, value, onInput, rows, ph) =>
    el('div',{class:'field field-h'},
      el('label',{}, label),
      el('textarea',{rows, placeholder:ph||'', oninput:onInput}, value||'')
    );
  sec.appendChild(mkField('行业与竞争格局', d.industry, e=>{d.industry=e.target.value;autosave()}, 3, '例：高端百货专柜 + 年轻拼配 + 本地老字号 + 进口快消化品牌…'));
  sec.appendChild(mkField('主要竞争对手',   d.competitors, e=>{d.competitors=e.target.value;autosave()}, 2, '例：TWG Tea（高端百货）、TEAMan（年轻拼配）、本地老字号茶庄、ITO EN（日系瓶装）'));
  sec.appendChild(mkField('关键趋势',       d.trends, e=>{d.trends=e.target.value;autosave()}, 2, '例：节气营销、可追溯供应链、茶具订阅礼盒、KOC 内容种草…'));

  // AI action — step-1 上下结构：上 = meta+title+hint，下 = 按钮靠右
  const ai=el('div',{class:'ai-box ai-box-step1'});
  const top=el('div',{class:'ai-box-top'});
  const meta=el('div',{class:'ai-box-meta'});
  meta.appendChild(el('span',{class:'ai-box-meta-tip'},'提示'));
  meta.appendChild(el('span',{class:'ai-box-meta-text'},'请先绑定 LLM'));
  meta.appendChild(el('span',{class:'ai-box-meta-sep'},'·'));
  meta.appendChild(el('span',{class:'ai-box-meta-draft'},'DRAFT WITH AI'));
  top.appendChild(meta);
  top.appendChild(el('h4',{class:'ai-box-headline'},'用 AI 起草环境分析'));
  top.appendChild(el('p',{class:'ai-box-hint'},'基于已填的 SBU 信息，一键生成结构化 PEST + 行业格局 + 关键趋势，覆盖上方六个文本框。'));
  ai.appendChild(top);
  const action=el('div',{class:'ai-box-action'});
  const btn=el('button',{class:'primary',onclick:()=>{
    API.aiButton({
      button:btn, container:ai,
      buildPrompt:()=>[{role:'system',content:'你是全球品牌战略顾问。基于给定的 SBU 信息，生成结构化 PEST、行业格局与三个关键趋势。输出 JSON：{"political":"","economic":"","social":"","technological":"","industry":"","competitors":"","trends":""}'},
        {role:'user',content:`SBU: ${state.work1.sbu.name}\n品类: ${state.work1.sbu.category}\n阶段: ${state.work1.sbu.stage}\n范围: ${state.work1.sbu.scope}\n概述: ${state.work1.sbu.summary}`}],
      onResult:r=>{
        if(!r){ showToast('解析失败'); return; }
        Object.assign(d, {
          political:r.political||d.political, economic:r.economic||d.economic,
          social:r.social||d.social, technological:r.technological||d.technological,
          industry:r.industry||d.industry, competitors:r.competitors||d.competitors,
          trends:r.trends||d.trends
        });
        autosave(); Work1.renderStep('environment');
      }
    });
  }},'开始生成');
  action.appendChild(btn);
  ai.appendChild(action);
  sec.appendChild(ai);
};

/* ---------- STEP 3: PERSONAS ---------- */
Work1.render.personas = function(sec){
  const d=state.work1.personas;
  const list=el('div',{id:'personaList'});
  d.forEach((p,i)=>list.appendChild(Work1.personaCard(p, i)));
  sec.appendChild(list);
  sec.appendChild(el('div',{class:'row',style:{marginTop:'16px'}},
    el('button',{onclick:()=>{
      d.push({id:uid('p'),name:'',gender:'',age:'',occupation:'',income:'',region:'',values:[],painPoints:'',channels:[],quote:'',traits:''});
      autosave(); Work1.renderStep('personas');
    }},'+ 添加画像'),
    el('button',{class:'primary',onclick:()=>Work1.generatePersonas(sec)},'用 AI 生成画像')
  ));
};
Work1.personaCard = function(p, i){
  // Hallmark 重设计：每个画像 = 2 个 hallmark-item
  //   Item 1 (quote) : 全宽引言，无 number，作为画像"声音"的 headline
  //   Item 2 (main)  : 3-col 标准结构（number | 中段 | KEY POINTS）
  const idx = (i != null) ? i : 0;
  const num = String(idx+1).padStart(2,'0');
  // 1.2c: 自动把 p.name 同步为 "P1" 格式
  p.name = `P${idx+1}`;

  const block = el('div',{class:'persona-block'});

  // ============ Item 1: 大引言 (全宽, 无 number) ============
  const quoteItem = el('article',{class:'hallmark-item hallmark-persona hallmark-persona-quote'});
  quoteItem.appendChild(el('span',{class:'persona-row-label'}, 'TA 怎么说'));
  const quoteTextarea = el('textarea',{rows:2, class:'persona-quote', placeholder:'一句代表性引言（不带引号）', oninput:e=>{p.quote=e.target.value;autosave()}}, p.quote || '');
  quoteItem.appendChild(quoteTextarea);
  block.appendChild(quoteItem);

  // ============ Item 2: 画像主体 (3-col: 01 | 中段 | KEY POINTS) ============
  const bodyItem = el('article',{class:'hallmark-item hallmark-persona hallmark-persona-main'});
  bodyItem.appendChild(el('div',{class:'hallmark-num'}, num));

  const mid = el('div',{class:'hallmark-mid'});

  // Top row: 画像 #01 标签 + 删除按钮
  const nameRow = el('div',{class:'persona-name-row'});
  const nameLabel = el('div',{class:'persona-name-label'}, `画像 #${num}`);
  nameRow.appendChild(nameLabel);
  const delBtn = el('button',{class:'ghost small persona-del', onclick:()=>{
    state.work1.personas = state.work1.personas.filter(x=>x.id!==p.id);
    autosave(); Work1.renderStep('personas');
  }}, '删除');
  nameRow.appendChild(delBtn);
  mid.appendChild(nameRow);

  // Bio row: 性别 / 年龄 / 职业 / 收入 / 地区 (5-column)
  const grid = el('div',{class:'grid5 persona-grid'});
  const mkInput = (key, ph) => el('input',{type:'text', value:p[key]||'', placeholder:ph,
    oninput:e=>{p[key]=e.target.value;autosave()}});
  const genderSel = el('select',{class:'persona-gender', onchange:e=>{p.gender=e.target.value;autosave()}},
    ...['', '女', '男', '其他', '不透露'].map(v=>{
      const o = el('option',{value:v}, v==='' ? '性别' : v);
      if((p.gender||'')===v) o.selected = true;
      return o;
    })
  );
  grid.appendChild(genderSel);
  grid.appendChild(mkInput('age','年龄段 28'));
  grid.appendChild(mkInput('occupation','职业 品牌经理'));
  grid.appendChild(mkInput('income','收入 SGD 75k/年'));
  grid.appendChild(mkInput('region','地区 新加坡'));
  mid.appendChild(grid);

  // 痛点
  mid.appendChild(el('label',{class:'persona-row-label'}, '痛点 / 未被满足需求'));
  mid.appendChild(el('textarea',{rows:2, placeholder:'例：买茶不懂产地、害怕过度包装、送礼怕撞款',
    oninput:e=>{p.painPoints=e.target.value;autosave()}}, p.painPoints||''));

  // 核心价值观 tags
  mid.appendChild(el('label',{class:'persona-row-label'}, '核心价值观'));
  const ti = UI.tagsInput(p.values||[]);
  ti.el.querySelector('input').setAttribute('placeholder','输入后回车添加');
  ti.el.querySelector('input').addEventListener('blur',()=>{p.values=ti.get();autosave()});
  mid.appendChild(ti.el);

  // 常用渠道 tags
  mid.appendChild(el('label',{class:'persona-row-label'}, '常用渠道'));
  const tc = UI.tagsInput(p.channels||[]);
  tc.el.querySelector('input').setAttribute('placeholder','输入后回车添加');
  tc.el.querySelector('input').addEventListener('blur',()=>{p.channels=tc.get();autosave()});
  mid.appendChild(tc.el);

  bodyItem.appendChild(mid);

  // Right: KEY POINTS
  const right = el('div',{class:'hallmark-right'});
  right.appendChild(el('span',{class:'hallmark-label'}, 'KEY POINTS'));
  const valCount = (p.values||[]).length;
  const chanCount = (p.channels||[]).length;
  const summary = el('div',{class:'persona-summary'});
  summary.appendChild(el('div',{}, `${valCount} 个价值观`));
  summary.appendChild(el('div',{}, `${chanCount} 个渠道`));
  right.appendChild(summary);
  bodyItem.appendChild(right);

  block.appendChild(bodyItem);
  return block;
};
Work1.generatePersonas = function(container){
  if(state.work1.personas.length && !confirm('这会替换当前画像，继续？')) return;
  const ai=el('div',{class:'ai-box'});
  container.appendChild(ai);
  const btn=el('button',{class:'primary'},'生成中…');
  btn.disabled=true; ai.appendChild(btn);
  API.aiButton({
    button:btn, container:ai,
    buildPrompt:()=>[{role:'system',content:'你是消费者研究专家。基于 SBU 与目标市场，生成 4 个差异化的典型客户画像，男女比例均衡。gender 取值：女 / 男 / 其他 / 不透露。请使用编号 P1/P2/P3/P4 替代真实姓名（不要生成真实姓名）。输出 JSON: {"personas":[{"name":"","gender":"","age":"","occupation":"","income":"","region":"","values":[""],"painPoints":"","channels":[""],"quote":""}]}'},
      {role:'user',content:`SBU: ${state.work1.sbu.name}\n品类: ${state.work1.sbu.category}\n范围: ${state.work1.sbu.scope}\n概述: ${state.work1.sbu.summary}\n环境: ${state.work1.environment.industry||''}`}],
    onResult:r=>{
      if(!r || !Array.isArray(r.personas)){ showToast('生成失败'); return; }
      state.work1.personas = r.personas.map((p,i)=>({id:uid('p'),...p, gender: p.gender||'', name: `P${i+1}`}));
      autosave(); Work1.renderStep('personas');
    }
  });
};

/* ---------- STEP 4: METRICS (品牌资产指标体系) ---------- */
Work1.render.metrics = function(sec){
  if(!state.work1.metrics) state.work1.metrics={dimensions:[]};
  const m=state.work1.metrics;
  if(!Array.isArray(m.dimensions)) m.dimensions=[];

  const list=el('div',{class:'hallmark-list'});
  m.dimensions.forEach((dim,i)=>{
    if(!Array.isArray(dim.secondaries)) dim.secondaries=[];
    const num=String(i+1).padStart(2,'0');
    const item=el('article',{class:'hallmark-item'});

    item.appendChild(el('div',{class:'hallmark-num'}, num));

    const mid=el('div',{class:'hallmark-mid'});
    const nameInput=el('input',{type:'text',value:dim.name||'',
      placeholder:'一级指标名称（如：品牌功效）',
      oninput:e=>{dim.name=e.target.value;autosave();}});
    nameInput.style.fontFamily='var(--font-body)';
    nameInput.style.fontSize='20px';
    nameInput.style.fontStyle='italic';
    nameInput.style.width='100%';
    nameInput.style.border='none';
    nameInput.style.borderBottom='1px solid var(--line)';
    nameInput.style.background='transparent';
    nameInput.style.padding='4px 0';
    mid.appendChild(nameInput);
    mid.appendChild(el('p',{class:'hallmark-hint edit-hint'},'二级测评点（回车添加，问卷题目将由这些指标生成）'));

    const ti=UI.tagsInput((dim.secondaries||[]).map(s=>s.name), '输入二级指标后回车');
    const syncTags=()=>{
      const names=ti.get();
      // preserve existing ids by name order; new ones get ids
      const oldById={}; (dim.secondaries||[]).forEach(s=>{oldById[s.id]=s;});
      const used=new Set();
      dim.secondaries=names.map(nm=>{
        const found=(dim.secondaries||[]).find(s=>s.name===nm && !used.has(s.id));
        if(found){used.add(found.id); return found;}
        return {id:uid('s'), name:nm};
      });
      // update counter
      const c=item.querySelector('.hallmark-count-num');
      if(c) c.textContent=names.length;
      autosave();
    };
    ti.el.querySelector('input').addEventListener('blur',syncTags);
    ti.el.addEventListener('click',e=>{ if(e.target.tagName==='BUTTON') setTimeout(syncTags,0); });
    ti.el.querySelector('input').addEventListener('keydown',e=>{
      if(e.key==='Enter') setTimeout(syncTags,0);
    });
    mid.appendChild(ti.el);
    item.appendChild(mid);

    const right=el('div',{class:'hallmark-right'});
    right.appendChild(el('span',{class:'hallmark-label'},'测评点'));
    right.appendChild(el('div',{class:'hallmark-count'},
      el('span',{class:'hallmark-count-num'}, dim.secondaries.length),
      document.createTextNode(' items')
    ));
    const del=el('button',{class:'ghost small',style:'margin-top:8px',
      onclick:()=>{ if(confirm('删除一级指标「'+(dim.name||'')+'」及其二级指标？')){
        m.dimensions.splice(i,1); autosave(); Work1.rerender('metrics'); }}},'删除');
    right.appendChild(del);
    item.appendChild(right);

    list.appendChild(item);
  });
  sec.appendChild(list);

  // soft validation hint
  const lowDim=m.dimensions.length<5;
  const lowSec=m.dimensions.some(d=>(d.secondaries||[]).length<3);
  if(lowDim || lowSec){
    sec.appendChild(el('p',{class:'muted italic',style:'font-size:13px;margin-top:8px'},
      '课程要求：至少 5 个一级指标，每个一级指标下至少 3 个测评点。当前 '
      + (lowDim?'一级指标不足（'+m.dimensions.length+'/5）':'')
      + (lowDim&&lowSec?'；':'')
      + (lowSec?'部分一级指标测评点不足 3 个':'') + '。'));
  }

  const actions=el('div',{class:'ai-actions'},
    el('button',{class:'ghost',onclick:()=>{
      m.dimensions.push({id:uid('m'),name:'',secondaries:[]});
      autosave(); Work1.rerender('metrics');
    }},'+ 添加一级指标'),
    (()=>{ const btn=el('button',{class:'primary',onclick:()=>{
      API.aiButton({button:btn, container:sec,
        buildPrompt:()=>[{role:'system',content:'你是品牌资产管理专家，基于 CBBE 品牌资产金字塔（显著性/功效/形象/判断/感受/共鸣）为指定业务设计品牌资产指标体系。输出 JSON: {"dimensions":[{"name":"一级指标名","secondaries":["二级指标1","二级指标2","二级指标3"]}]}，至少 5 个一级指标，每个一级指标至少 3 个二级指标。'},
          {role:'user',content:`SBU:${state.work1.sbu.name}\n品类:${state.work1.sbu.category}\n概述:${state.work1.sbu.summary}\n画像痛点:\n${state.work1.personas.map(p=>p.name+':'+p.painPoints).join('\n')}`}],
        onResult:r=>{
          if(!r||!Array.isArray(r.dimensions)){showToast('生成失败');return;}
          m.dimensions=r.dimensions.map(d=>({id:uid('m'),name:d.name||'',
            secondaries:(d.secondaries||[]).map(s=>({id:uid('s'),name:String(s)}))}));
          autosave(); Work1.rerender('metrics');
        }});
    }},'用 AI 起草指标体系'); return btn; })()
  );
  sec.appendChild(el('hr',{class:'rule'}));
  sec.appendChild(actions);
};

/* ---------- STEP 5: SURVEY ---------- */
Work1.render.survey = function(sec){
  const s=state.work1.survey;
  if(!state.work1.personas.length){
    sec.appendChild(el('div',{class:'warning'},'请先在「客户画像」步骤至少添加一个画像。'));
    return;
  }

  // question designer — card style
  sec.appendChild(el('h3',{},'问卷设计'));

  const ensureAnchors=q=>{ if(!Array.isArray(q.anchors)||q.anchors.length!==5) q.anchors=[...LIKERT5]; };

  const list=el('div',{class:'q-card-list'});

  // card drag-and-drop reordering
  let dragIdx=null;
  list.addEventListener('dragstart',e=>{
    const card=e.target.closest('.q-card'); if(!card) return;
    dragIdx=Number(card.dataset.idx); card.classList.add('dragging');
    e.dataTransfer.effectAllowed='move';
  });
  list.addEventListener('dragend',e=>{ const card=e.target.closest('.q-card'); if(card) card.classList.remove('dragging'); });
  list.addEventListener('dragover',e=>{
    const card=e.target.closest('.q-card'); if(!card||dragIdx===null) return;
    e.preventDefault(); e.dataTransfer.dropEffect='move';
  });
  list.addEventListener('drop',e=>{
    const card=e.target.closest('.q-card'); if(!card||dragIdx===null) return;
    e.preventDefault();
    const to=Number(card.dataset.idx);
    if(to!==dragIdx){
      const [moved]=s.questions.splice(dragIdx,1);
      s.questions.splice(to,0,moved);
      autosave(); Work1.rerender('survey');
    }
    dragIdx=null;
  });

  s.questions.forEach((q,i)=>{
    q.type='likert'; // 课件 work1 统一采用李克特5点量表（同仁堂/京东方/极狐案例）
    ensureAnchors(q);
    const card=el('article',{class:'q-card',draggable:'true','data-idx':i});

    // header: number · delete
    const head=el('header');
    head.appendChild(el('span',{class:'q-num'},'Q'+String(i+1).padStart(2,'0')));
    head.appendChild(el('span',{class:'q-type-tag'},'李克特 5 级'));
    head.appendChild(el('button',{class:'q-del ghost small',
      onclick:()=>{s.questions.splice(i,1);autosave();Work1.rerender('survey')}},'删除'));
    card.appendChild(head);

    // question text — 陈述句式（李克特量表要求同一构念的陈述加总计分）
    card.appendChild(el('input',{class:'q-text',type:'text',value:q.text,
      placeholder:'输入陈述，如：该品牌在产品品质方面表现稳定可靠',
      oninput:e=>{q.text=e.target.value;autosave()}}));

    // likert 5 anchors
    const ac=el('div',{class:'q-anchors'});
    ;[1,2,3,4,5].forEach((n,k)=>{
      const wrap=el('div',{class:'q-anchor'});
      wrap.appendChild(el('span',{class:'q-anchor-n'},String(n)));
      wrap.appendChild(el('input',{type:'text',value:q.anchors[k]||'',
        oninput:e=>{q.anchors[k]=e.target.value;autosave()}}));
      ac.appendChild(wrap);
    });
    card.appendChild(ac);
    list.appendChild(card);
  });
  sec.appendChild(list);

  // actions: generate from metrics + add blank
  const designerActions=el('div',{class:'ai-actions'});
  designerActions.appendChild(el('button',{class:'primary',onclick:()=>{
    const dims=state.work1.metrics.dimensions||[];
    const total=dims.reduce((n,d)=>n+(d.secondaries||[]).length,0);
    if(!total){ showToast('请先在「指标体系」中建立二级指标'); return; }
    const existing=new Set(s.questions.map(qq=>qq.sourceIndicatorId).filter(Boolean));
    let added=0;
    dims.forEach(d=>(d.secondaries||[]).forEach(s2=>{
      if(existing.has(s2.id)) return;
      s.questions.push({id:uid('q'),type:'likert',
        text:'我认可该品牌在「'+(s2.name||'')+'」方面的表现',
        options:[],anchors:[...LIKERT5],sourceIndicatorId:s2.id});
      added++;
    }));
    autosave(); Work1.rerender('survey');
    showToast(added? ('已根据指标生成 '+added+' 道李克特题'):'所有指标均已生成过题目');
  }},'⬚ 从指标体系生成李克特题目'));
  designerActions.appendChild(el('button',{class:'ghost',onclick:()=>{
    s.questions.push({id:uid('q'),type:'likert',text:'',options:[],anchors:[...LIKERT5],sourceIndicatorId:null});
    autosave(); Work1.rerender('survey');
  }},'+ 添加题目'));
  sec.appendChild(designerActions);

  sec.appendChild(el('hr',{class:'rule'}));
  sec.appendChild(el('h3',{},'运行合成调研'));

  const options=el('div',{class:'grid3'},
    UI.field('每位画像重复样本数', (()=>{
      const inp=el('input',{type:'number',min:1,max:20,value:s.n||3,oninput:e=>{s.n=parseInt(e.target.value)||1;autosave()}});
      return inp;
    })()),
    UI.field('Few-shot 示例', (()=>{
      const c=el('input',{type:'checkbox',checked:s.useFewShot,onchange:e=>{s.useFewShot=e.target.checked;autosave()}});
      c.style.width='auto'; return c;
    })()),
    UI.field('RAG 上下文（可选）', el('textarea',{rows:2,placeholder:'粘贴行业资料、评测数据等作为答题参考',oninput:e=>{s.ragContext=e.target.value;autosave()}},s.ragContext||''))
  );
  sec.appendChild(options);

  // progress & actions
  const bar=el('div',{class:'progress-bar'}, el('div',{style:{transform:'scaleX('+(s.progress.total? s.progress.done/s.progress.total:0)+')'}}));
  sec.appendChild(bar);
  const statusLine=el('p',{class:'mono',style:'font-size:11px;color:var(--muted)'}, Work1.surveyStatus());
  sec.appendChild(statusLine);
  const runBtn=el('button',{class:'primary',onclick:e=>Work1.runSurvey(e.currentTarget)},
    (s.status==='paused'||s.status==='aborted')?'继续合成调研':'运行合成调研');
  const actions=el('div',{class:'ai-actions'}, runBtn,
    el('button',{class:'ghost',onclick:()=>Work1.analyzeResponses()},'重新分析'),
    el('button',{class:'ghost',onclick:()=>{ if(confirm('清空已有回答？')){s.responses=[];s._doneKeys=[];s.status='idle';s.likertStats={};s.openThemes=[];autosave();Work1.rerender('survey');}}},'清空回答')
  );
  sec.appendChild(actions);
  if(s.error) sec.appendChild(el('div',{class:'warning'},s.error));
};
Work1.surveyStatus = function(){
  const s=state.work1.survey;
  if(s.status==='running') return `进行中 ${s.progress.done}/${s.progress.total}`;
  if(s.status==='paused') return `已暂停 · 已完成 ${s.progress.done}/${s.progress.total}（点继续）`;
  if(s.status==='done') return `完成 · 共 ${s.responses.length} 份回答`;
  if(s.status==='error') return '错误：'+s.error;
  return '就绪';
};
Work1.runSurvey = async function(button){
  const s=state.work1.survey;
  if(!s.questions.length){ showToast('请先添加题目'); return; }
  if(s.status==='running'){ showToast('调研进行中'); return; }
  // Resume support: keep existing responses + _doneKeys; only run missing units.
  if(!Array.isArray(s.responses)) s.responses=[];
  if(!Array.isArray(s._doneKeys)) s._doneKeys=[];
  const doneSet=new Set(s._doneKeys);
  const allTasks=[];
  state.work1.personas.forEach(p=>{
    for(let i=0;i<(s.n||1);i++) allTasks.push({persona:p, run:i, key:p.id+':'+i});
  });
  const tasks=allTasks.filter(t=>!doneSet.has(t.key));
  if(!tasks.length){ showToast('所有受访者已完成'); s.status='done'; Work1.analyzeResponses(); Work1.renderStep('survey'); return; }

  s.status='running'; s.error=null;
  s.progress={done:s._doneKeys.length, total:allTasks.length};
  Work1.refreshDynamic('survey');

  const task=Runner.start({id:'work1-survey', label:'合成调研', button, total:tasks.length, pausable:true,
    onPause:()=>{ s.status='paused'; Work1.refreshDynamic('survey'); autosave(); },
    onResume:()=>{ s.status='running'; Work1.refreshDynamic('survey'); }});
  if(!task){ s.status=s._doneKeys.length?('paused'):'idle'; return; }
  task.done=0; // count only this batch for the button progress
  Runner.renderUI();

  const concurrency=Math.min(4, tasks.length);
  let idx=0, failed=false;
  async function worker(){
    while(idx<tasks.length && !task.aborted && !failed){
      const u=tasks[idx++];
      try{
        const r=await Work1.askPersona(u.persona, s.questions, s.useFewShot, s.ragContext, task.controller.signal);
        if(r && Array.isArray(r.answers)) s.responses.push({personaId:u.persona.id, answers:r.answers});
        doneSet.add(u.key);
      }catch(e){
        if(task.aborted || (e && e.name==='AbortError')) break;
        s.error=e.message; failed=true; break;
      }
      s._doneKeys=[...doneSet];
      s.progress.done=s._doneKeys.length;
      task.done++;
      Work1.refreshDynamic('survey');
      autosave();
      try{ await Runner.checkpoint(); }catch{ break; }  // pause/abort gate
    }
  }
  try{
    await Promise.all(Array.from({length:concurrency},worker));
  }finally{
    const aborted=task.aborted;
    Runner.finish();
    if(aborted){
      s.status='paused';  // keep partial results, button shows 继续
    }else if(failed){
      s.status='error';
    }else{
      s.status='done';
      delete s._doneKeys;
      Work1.analyzeResponses();
    }
    autosave(); Work1.rerender('survey');
  }
};
Work1.askPersona = function(persona, questions, fewShot, rag){
  const qBlock = questions.map((q,i)=>{
    const a=Array.isArray(q.anchors)&&q.anchors.length===5?q.anchors:LIKERT5;
    return `Q${i+1}. ${q.text} （1=${a[0]}，2=${a[1]}，3=${a[2]}，4=${a[3]}，5=${a[4]}）`;
  }).join('\n');
  const sys=`你扮演以下具体消费者，以 TA 的口吻回答市场调研李克特5点量表。要符合画像的年龄、收入、价值观、痛点。按真实态度给 1-5 的整数，不要解释，直接输出 JSON。`;
  const schema=`{"answers":[${questions.map(q=>`{"questionId":"${q.id}","value":1-5的整数}`).join(',')}]}`;
  const userParts=[
    `画像：${persona.name}\n年龄：${persona.age}\n职业：${persona.occupation}\n收入：${persona.income}\n地区：${persona.region}\n价值观：${(persona.values||[]).join('、')}\n痛点：${persona.painPoints}\n渠道：${(persona.channels||[]).join('、')}\n语录：${persona.quote}`,
    `请回答以下问卷，输出符合 schema 的 JSON：\n${qBlock}\n\n输出 schema：\n${schema}`
  ];
  if(rag) userParts.push('参考资料（仅作为答题事实依据）：\n'+rag);
  if(fewShot){
    userParts.push('示例：\n{"answers":[{"questionId":"'+questions[0].id+'","value":4}]}');
  }
  return API.callJson([{role:'system',content:sys},{role:'user',content:userParts.join('\n\n')}],
    {signal: Runner.signal()});
};

Work1.analyzeResponses = function(){
  const s=state.work1.survey; const a=state.work1.analysis;
  a.likertStats={}; a.openThemes=[]; a.indicatorMeans=[];
  s.questions.forEach(q=>{
    if(q.type==='likert'){
      const vals=[]; const dist=[0,0,0,0,0];
      s.responses.forEach(r=>{
        const an=r.answers.find(x=>x.questionId===q.id);
        const v=parseInt(an?.value); if(!isNaN(v)&&v>=1&&v<=5){vals.push(v);dist[v-1]++;}
      });
      a.likertStats[q.id]={mean:mean(vals),sd:sd(vals),dist,n:vals.length};
      a.indicatorMeans.push({label:q.text.length>22?q.text.slice(0,22)+'…':q.text, value:mean(vals)});
    } else if(q.type==='open'){
      const texts=[];
      s.responses.forEach(r=>{
        const an=r.answers.find(x=>x.questionId===q.id);
        if(an?.value) texts.push(String(an.value));
      });
      a.openThemes.push({questionId:q.id, question:q.text, texts});
    }
  });
  autosave();
};

/* ---------- STEP 6: ANALYSIS ---------- */
Work1.render.analysis = function(sec){
  const a=state.work1.analysis; const s=state.work1.survey;
  if(!s.responses.length){ sec.appendChild(el('div',{class:'warning'},'尚无调研数据，请先运行合成调研。')); return; }

  sec.appendChild(el('h3',{},'Likert 题项分布'));
  s.questions.filter(q=>q.type==='likert').forEach(q=>{
    const stat=a.likertStats[q.id]; if(!stat) return;
    const an=Array.isArray(q.anchors)&&q.anchors.length===5?q.anchors:LIKERT5;
    const plate=el('section',{class:'plate'},
      el('span',{class:'plate-label'},`L14 · HUNDRED FIELD · ${q.text}`),
      el('div',{class:'row'},
        (()=>{const c=el('div'); renderHundredField(c, [
          {label:'5 '+an[4],count:Math.round(stat.dist[4]/stat.n*100),color:'#3A190F'},
          {label:'4 '+an[3],count:Math.round(stat.dist[3]/stat.n*100),color:'#6B3B2A'},
          {label:'3 '+an[2],count:Math.round(stat.dist[2]/stat.n*100),color:'#A79E91'},
          {label:'2 '+an[1],count:Math.round(stat.dist[1]/stat.n*100),color:'#D4CFC4'},
          {label:'1 '+an[0],count:Math.round(stat.dist[0]/stat.n*100),color:'#E8DFD8'},
        ]); return c;})(),
        el('div',{},
          el('p',{class:'mono',style:'font-size:12px'},`n=${stat.n} · 均值 ${stat.mean.toFixed(2)} · SD ${stat.sd.toFixed(2)}`),
          el('p',{class:'italic muted',style:'font-size:13px'},q.text)
        )
      )
    );
    sec.appendChild(plate);
  });

  sec.appendChild(el('h3',{},'指标均值排名'));
  const barPlate=el('section',{class:'plate'}, el('span',{class:'plate-label'},'F5 · TICK ROWS · 指标均值'));
  const barC=el('div');
  renderBarChart(barC, a.indicatorMeans.sort((x,y)=>y.value-x.value), {unit:''});
  barPlate.appendChild(barC); sec.appendChild(barPlate);

  // open-ended with AI theme extraction (work1 默认全李克特，仅当存在开放题时显示)
  if(a.openThemes && a.openThemes.length){
  sec.appendChild(el('h3',{},'开放题主题'));
  const hmList = el('div',{class:'hallmark-list'});
  a.openThemes.forEach((ot, i)=>{
    const num = String(i+1).padStart(2, '0');
    const item = el('article',{class:'hallmark-item'});

    // Left: number
    item.appendChild(el('div',{class:'hallmark-num'}, num));

    // Middle: question (italic serif headline) + body
    const mid = el('div',{class:'hallmark-mid'});
    mid.appendChild(el('h4',{class:'hallmark-headline'}, ot.question));
    if(ot.themes && ot.themes.length){
      (ot.quotes||[]).slice(0,3).forEach(q=>{
        mid.appendChild(el('p',{class:'hallmark-quote'}, q));
      });
    } else {
      mid.appendChild(el('p',{class:'hallmark-empty'}, `共 ${ot.texts.length} 条文本，尚未生成主题。`));
      const btn=el('button',{class:'primary small',onclick:()=>Work1.extractThemes(ot,btn,item)},'用 AI 归纳主题');
      mid.appendChild(el('div',{class:'hallmark-action'}, btn));
    }
    item.appendChild(mid);

    // Right: HALLMARK label + theme rows
    const right = el('div',{class:'hallmark-right'});
    right.appendChild(el('span',{class:'hallmark-label'}, 'KEY POINTS'));
    if(ot.themes && ot.themes.length){
      const themes = el('div',{class:'hallmark-themes'});
      ot.themes.forEach(t=>{
        const row = el('div',{class:'hallmark-theme-row'});
        row.appendChild(el('span',{class:'hallmark-theme-label'}, t.label));
        row.appendChild(el('span',{class:'hallmark-theme-count'}, `×${t.count}`));
        themes.appendChild(row);
      });
      right.appendChild(themes);
    } else {
      right.appendChild(el('span',{class:'hallmark-empty'}, '—'));
    }
    item.appendChild(right);

    hmList.appendChild(item);
  });
  sec.appendChild(hmList);
  }

  sec.appendChild(el('h3',{},'综合洞察'));
  sec.appendChild(UI.field('AI 或自己撰写的综合洞察', el('textarea',{rows:6,oninput:e=>{a.insights=e.target.value;autosave()}},a.insights)));
  const insightAi=el('div',{class:'ai-box'});
  const insightBtn=el('button',{class:'primary',onclick:()=>{
    API.aiButton({
      button:insightBtn, container:insightAi,
      buildPrompt:()=>[{role:'system',content:'你是市场研究总监。根据给定的描述性统计与开放题主题，撰写 5-8 条可执行洞察。输出 JSON: {"insights":"..."}'},
        {role:'user',content:Work1.surveyDigest()}],
      onResult:r=>{ if(r?.insights){ a.insights=r.insights; autosave(); Work1.renderStep('analysis'); } }
    });
  }},'用 AI 综合洞察');
  insightAi.appendChild(insightBtn);
  sec.appendChild(insightAi);
};
Work1.surveyDigest = function(){
  const s=state.work1.survey, a=state.work1.analysis;
  let out='SBU：'+state.work1.sbu.name+'\n\n';
  out+='Likert 题项均值：\n';
  s.questions.filter(q=>q.type==='likert').forEach(q=>{
    const st=a.likertStats[q.id];
    if(st) out+=`- ${q.text}: 均值 ${st.mean.toFixed(2)}，分布 ${st.dist.join('/')}\n`;
  });
  out+='\n开放题原文：\n';
  a.openThemes.forEach(ot=>{
    out+=`\n## ${ot.question}\n`;
    ot.texts.slice(0,15).forEach((t,i)=>out+=`${i+1}. ${t}\n`);
  });
  return out;
};
Work1.extractThemes = function(ot, btn, plate){
  API.aiButton({
    button:btn, container:plate,
    buildPrompt:()=>[{role:'system',content:'你是定性研究分析师。从开放题答案中归纳 4-6 个主题。输出 JSON: {"themes":[{"label":"","count":0}],"quotes":[""]}'},
      {role:'user',content:`题目：${ot.question}\n\n回答：\n${ot.texts.map((t,i)=>`${i+1}. ${t}`).join('\n')}`}],
    onResult:r=>{
      if(r?.themes){ ot.themes=r.themes; ot.quotes=r.quotes||[]; autosave(); Work1.renderStep('analysis'); }
    }
  });
};

/* ---------- STEP 7: VALUES ---------- */
Work1.render.values = function(sec){
  const v=state.work1.values;
  const dims=[
    ['functional','功能性价值','解决具体问题 / 性能 / 可靠性'],
    ['emotional','情感性价值','感受 / 情绪 / 自我表达'],
    ['social','社会性价值','身份 / 归属 / 社交货币'],
    ['epistemic','认知性价值','新奇 / 学习 / 好奇心'],
    ['conditional','条件性价值','特定场景 / 时节 / 文化']
  ];
  // Hallmark-style 5-row layout: 01..05 | italic headline + description + tags | KEY POINTS
  const list = el('div',{class:'hallmark-list hallmark-value-list'});
  dims.forEach(([k,title,desc], i)=>{
    const num = String(i+1).padStart(2,'0');
    const item = el('article',{class:'hallmark-item'});

    // Left: number
    item.appendChild(el('div',{class:'hallmark-num'}, num));

    // Middle: title (italic serif) + description + tag input
    const mid = el('div',{class:'hallmark-mid'});
    mid.appendChild(el('h4',{class:'hallmark-headline'}, title));
    mid.appendChild(el('p',{class:'hallmark-hint'}, desc));
    const ti = UI.tagsInput(v[k] || []);
    ti.el.querySelector('input').addEventListener('blur',()=>{v[k]=ti.get();autosave()});
    // Re-render counter when tags change so KEY POINTS count updates
    ti.el.addEventListener('click',(e)=>{
      if(e.target.tagName==='BUTTON'){
        setTimeout(()=>{
          const c = item.querySelector('.hallmark-count-num');
          if(c) c.textContent = ti.get().length;
        },0);
      }
    });
    ti.el.querySelector('input').addEventListener('keydown',(e)=>{
      if(e.key==='Enter' && e.target.value.trim()){
        setTimeout(()=>{
          const c = item.querySelector('.hallmark-count-num');
          if(c) c.textContent = ti.get().length;
        },0);
      }
    });
    mid.appendChild(ti.el);
    item.appendChild(mid);

    // Right: KEY POINTS label + count
    const right = el('div',{class:'hallmark-right'});
    right.appendChild(el('span',{class:'hallmark-label'}, 'KEY POINTS'));
    const count = el('div',{class:'hallmark-count'},
      el('span',{class:'hallmark-count-num'}, (v[k]||[]).length),
      document.createTextNode(' values')
    );
    right.appendChild(count);
    item.appendChild(right);

    list.appendChild(item);
  });
  sec.appendChild(list);

  sec.appendChild(el('hr',{class:'rule'}));
  sec.appendChild(el('h3',{},'选定的三层核心价值'));

  // Helper for the four large-style fields below
  const mkH = (label, value, onInput, ph, isTA) => {
    const wrap = el('div',{class:'field field-h'});
    wrap.appendChild(el('label',{}, label));
    if(isTA){
      wrap.appendChild(el('textarea',{rows:4, placeholder:ph||'', oninput:onInput}, value||''));
    } else {
      wrap.appendChild(el('input',{type:'text', value:value||'', placeholder:ph||'', oninput:onInput}));
    }
    return wrap;
  };
  sec.appendChild(mkH('功能主轴', v.chosenFunctional, e=>{v.chosenFunctional=e.target.value;autosave()}, '例：可追溯原产地 · 节气限定'));
  sec.appendChild(mkH('情感主轴', v.chosenEmotional,  e=>{v.chosenEmotional=e.target.value;autosave()},  '例：慢生活仪式感 · 文化亲近'));
  sec.appendChild(mkH('社会主轴', v.chosenSocial,    e=>{v.chosenSocial=e.target.value;autosave()},    '例：高品位送礼场景 · 文化身份认同'));
  sec.appendChild(mkH('取舍理由', v.rationale,       e=>{v.rationale=e.target.value;autosave()},       '为什么是这三条？为什么放弃了另两条？', true));

  const ai=el('div',{class:'ai-box'});
  const btn=el('button',{class:'primary',onclick:()=>{
    API.aiButton({
      button:btn,container:ai,
      buildPrompt:()=>[{role:'system',content:'你是品牌价值框架专家。根据 SBU、客户画像、调研洞察，提出功能/情感/社会/认知/条件 5 类价值要素，并从中选出三条主轴。输出 JSON: {"functional":[],"emotional":[],"social":[],"epistemic":[],"conditional":[],"chosenFunctional":"","chosenEmotional":"","chosenSocial":"","rationale":""}'},
        {role:'user',content:`SBU:${state.work1.sbu.name}\n画像:${state.work1.personas.map(p=>p.name+':'+p.painPoints).join('\n')}\n洞察:\n${state.work1.analysis.insights}`}],
      onResult:r=>{
        if(!r)return;
        ['functional','emotional','social','epistemic','conditional','chosenFunctional','chosenEmotional','chosenSocial','rationale'].forEach(k=>{ if(r[k]!=null) v[k]=r[k]; });
        autosave(); Work1.renderStep('values');
      }
    });
  }},'用 AI 起草价值框架');
  ai.appendChild(btn); sec.appendChild(ai);
};

/* ---------- STEP 8: RECOMMENDATIONS ---------- */
Work1.render.recommendations = function(sec){
  const r=state.work1.recommendations;
  // Hallmark layout: 4 rows (short / mid / long / risks), NO hairlines, NO color change
  const list = el('div',{class:'rec-list'});
  const mkItem = (idx, num, title, value, onInput, ph, time) => {
    const item = el('article',{class:'rec-item'});
    item.appendChild(el('div',{class:'hallmark-num'}, num));
    const mid = el('div',{class:'hallmark-mid'});
    // Time tag + title on one line (no underline, no color change per user request)
    const head = el('div',{class:'rec-head'});
    if(time) head.appendChild(el('span',{class:'rec-time'}, time));
    head.appendChild(el('span',{class:'rec-title'}, title));
    mid.appendChild(head);
    mid.appendChild(el('textarea',{rows:4, placeholder:ph||'', oninput:onInput}, value||''));
    item.appendChild(mid);
    // Right: empty for now (could add duration / KPI placeholder later)
    item.appendChild(el('div',{class:'hallmark-right'}));
    return item;
  };
  list.appendChild(mkItem(0, '01', '短期（0–6 个月）', r.short, e=>{r.short=e.target.value;autosave()}, '例：新加坡 Tang Plaza 上架节气礼盒 + 茶具订阅；3 位 KOC 拍摄开盒与冲泡。'));
  list.appendChild(mkItem(1, '02', '中期（6–18 个月）', r.mid,   e=>{r.mid=e.target.value;autosave()},   '例：吉隆坡 Pavilion 快闪 + 雅加达清真认证产品线；上线小程序 AR 溯源。'));
  list.appendChild(mkItem(2, '03', '长期（18 个月+）',  r.long,  e=>{r.long=e.target.value;autosave()},  '例：建立东南亚茶师驻地项目，与本地陶艺师合作限定茶具，形成年度 IP。'));
  // Risks: number + title + tags input (no textarea)
  const risksItem = el('article',{class:'rec-item'});
  risksItem.appendChild(el('div',{class:'hallmark-num'}, '04'));
  const risksMid = el('div',{class:'hallmark-mid'});
  const risksHead = el('div',{class:'rec-head'});
  risksHead.appendChild(el('span',{class:'rec-time'}, '关键风险'));
  risksHead.appendChild(el('span',{class:'rec-title'}, '关键风险 / 假设'));
  risksMid.appendChild(risksHead);
  const risks = UI.tagsInput(r.risks||[]);
  risks.el.querySelector('input').setAttribute('placeholder','输入后回车添加');
  risks.el.querySelector('input').addEventListener('blur',()=>{r.risks=risks.get();autosave()});
  risksMid.appendChild(risks.el);
  risksItem.appendChild(risksMid);
  risksItem.appendChild(el('div',{class:'hallmark-right'}));
  list.appendChild(risksItem);
  sec.appendChild(list);

  const ai=el('div',{class:'ai-box'});
  const btn=el('button',{class:'primary',onclick:()=>{
    API.aiButton({
      button:btn,container:ai,
      buildPrompt:()=>[{role:'system',content:'你是品牌战略顾问。根据价值框架与洞察，输出短中长期建议与关键风险。JSON: {"short":"","mid":"","long":"","risks":[""]}'},
        {role:'user',content:`SBU:${state.work1.sbu.name}\n价值: 功能=${state.work1.values.chosenFunctional} 情感=${state.work1.values.chosenEmotional} 社会=${state.work1.values.chosenSocial}\n洞察:\n${state.work1.analysis.insights}`}],
      onResult:res=>{
        if(!res)return;
        r.short=res.short||r.short; r.mid=res.mid||r.mid; r.long=res.long||r.long;
        if(Array.isArray(res.risks)) r.risks=res.risks;
        autosave(); Work1.renderStep('recommendations');
      }
    });
  }},'用 AI 起草建议');
  ai.appendChild(btn); sec.appendChild(ai);
};

/* ---------- DYNAMIC REFRESH (preserve input focus where possible) ---------- */
Work1.refreshDynamic = function(id){
  if(id==='survey'){
    const bar=document.querySelector('#steps1 .step[data-step="survey"] .progress-bar > div');
    if(bar){
      const s=state.work1.survey;
      bar.style.transform='scaleX('+(s.progress.total? s.progress.done/s.progress.total:0)+')';
    }
    const sl=document.querySelector('#steps1 .step[data-step="survey"] p.mono');
    if(sl) sl.textContent=Work1.surveyStatus();
  }
};

/* ---------- EXPORT ---------- */
Work1.exportMd = function(){
  const d=state.work1;
  let out=`## I. 业务价值体系\n\n### 1. SBU\n- **名称**：${d.sbu.name}\n- **品类**：${d.sbu.category}\n- **阶段**：${d.sbu.stage}\n- **范围**：${d.sbu.scope}\n\n> ${d.sbu.summary}\n\n`;
  out+=`### 2. 环境\n- **P**：${d.environment.political}\n- **E**：${d.environment.economic}\n- **S**：${d.environment.social}\n- **T**：${d.environment.technological}\n\n**行业**：${d.environment.industry}\n\n**竞争**：${d.environment.competitors}\n\n**趋势**：${d.environment.trends}\n\n`;
  out+=`### 3. 客户画像\n`;
  d.personas.forEach(p=>{
    out+=`- **${p.name}** (${p.age}, ${p.occupation}, ${p.region}) — ${p.painPoints}\n  - 价值观：${(p.values||[]).join('、')}\n  - 语录：*${p.quote}*\n`;
  });
  out+=`\n### 4. 合成调研\n- 样本数：${d.survey.responses.length}（每位画像 ${d.survey.n} 份）\n- 题数：${d.survey.questions.length}\n\n`;
  out+=`### 5. 分析洞察\n${d.analysis.insights}\n\n`;
  out+=`### 6. 价值框架\n- 功能：${d.values.chosenFunctional}\n- 情感：${d.values.chosenEmotional}\n- 社会：${d.values.chosenSocial}\n\n> ${d.values.rationale}\n\n`;
  out+=`### 7. 建议\n- 短期：${d.recommendations.short}\n- 中期：${d.recommendations.mid}\n- 长期：${d.recommendations.long}\n- 风险：${(d.recommendations.risks||[]).join('；')}\n`;
  return out;
};
