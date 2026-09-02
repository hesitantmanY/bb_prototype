/* ============================================================
   WORKSHOP 5 — 策划书
   Single scrollable document, 5 chapters, 国标编号 1/1.1/1.1.1.
   2026-09-01 结构重排（用户决策 1-5 锁定）：
   - 删封面/摘要/参考文献与全部眉标；编辑正文满内容列
   - 第 3 章合并市场选择与定位（矩阵→决策卡→痛点→卖点→STP）
   - SWOT/4C 进入即 AI 预生成（仅空时）；4P 摘要表（IEEE 风格）+ 预算横条图
   - CSS 由 global-brand-building.html <link> 引入，不再 JS 注入
     （重复注入曾致无版本号缓存压住新样式，2026-09-01 根因修复）
   ============================================================ */

Work5.steps = [
  {id:'plan', label:'策划书'}
];

Work5.defaultData = () => ({
  ch1_business:'',
  ch2_environment: {
    political:'', economic:'', social:'', technological:'',
    strengths:[], weaknesses:[], opportunities:[], threats:[]
  },
  ch3_strategy: { segmentation:'', targeting:'', positioning:'' },
  ch4_mix: { route:'', product:'', price:'', place:'', promotion:'',
             customerValue:'', customerCost:'', convenience:'', communication:'',
             pTable:{ product:{core:'',actions:'',nums:''}, price:{core:'',actions:'',nums:''},
                      place:{core:'',actions:'',nums:''}, promotion:{core:'',actions:'',nums:''} } },
  ch5_outlook:'',
  lastAggregated:null
});

/* contenteditable 读取：innerText 保留 <br>/块级换行，归一化 CRLF，去尾部空行。
   写入侧用 textContent + CSS white-space:pre-wrap 保留 \n（不注入 HTML）。 */
Work5.readEd = function(node){
  if(!node) return '';
  const raw=(node.innerText!==undefined)?node.innerText:(node.textContent||'');
  return String(raw).replace(/\r\n?/g,'\n').replace(/\n+$/,'');
};

Work5.renderStep = function(id){
  const sec=document.querySelector('#steps5 .step[data-step="'+id+'"]');
  if(!sec) return;
  // RENDER_VERSION guard（契约在 UI.mountGuard，2026-09-01 候选 4）
  if(!UI.mountGuard(sec, Work5, id)) return;
  // 进渲染即清洗（幂等，不受 demo 闸门限制）：SWOT 误输垃圾 + 正文残留 ** 标记
  Work5._entryHeal();
  sec.innerHTML='';
  sec.appendChild(Work5.toolbar());
  sec.appendChild(Work5.readinessPanel());
  const dn5=UI.demoNote(5,'plan'); if(dn5) sec.appendChild(dn5);
  UI.mountMvo(sec, Work5, id);

  const w=state.work5;

  // ---------- 1 业务与市场 ----------
  sec.appendChild(Work5.chapter('1','业务与市场', body=>{
    body.appendChild(Work5.subhead('1.1','企业与业务概况'));
    body.appendChild(Work5.provenance(1,'业务概况 · 价值链 · 洞察'));
    body.appendChild(el('div',{class:'ai-actions'},
      el('button',{class:'ghost small',onclick:()=>Work5.aggregateCh1()},(w.ch1_business?'重新汇总':'从 Work 1 汇总')),
      el('button',{class:'ghost small',onclick:e=>Work5.aiPolish('ch1_business','业务概况',e.currentTarget)},'AI 改写为章节语言')
    ));
    body.appendChild(el('div',{class:'chapter-text',contenteditable:'true',
      oninput:e=>{state.work5.ch1_business=Work5.readEd(e.target);autosave();}},
      w.ch1_business||'〔点击此处输入企业及业务概况——业务基本面、为什么要做、我们是谁/不是谁。〕'));
    // 价值链定位：来自 Work1 微笑曲线收口（只读引用，自动带出）
    const vcLine = Work5.valueChainLine();
    if(vcLine){
      body.appendChild(el('p',{style:'font-size:12px;color:var(--color-ink-2);margin-top:10px;letter-spacing:.02em;line-height:1.7'},
        '价值链定位：'+vcLine));
    }
    body.appendChild(Work5.subhead('1.2','品牌价值体系'));
    Work5.valueSummaryBlock(body);
  }));

  // ---------- 2 环境分析 ----------
  sec.appendChild(Work5.chapter('2','环境分析', body=>{
    const e=state.work5.ch2_environment;
    body.appendChild(Work5.provenance(1,'PEST（政治/经济/社会/技术）· SWOT'));

    // 2.1 PEST 2×2（按键贴小节，2026-09-01 用户反馈）
    body.appendChild(Work5.subhead('2.1','PEST · 政治 / 经济 / 社会 / 技术'));
    body.appendChild(el('div',{class:'ai-actions'},
      el('button',{class:'ghost small',onclick:()=>Work5.importPestFromWork1()},(['political','economic','social','technological'].some(k=>(e[k]||'').trim())?'重新导入 PEST':'从 Work 1 导入 PEST'))
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
          oninput:ev=>{e[k]=Work5.readEd(ev.target);autosave();}},
          e[k]||'〔点击此处输入……〕')
      );
      pestGrid.appendChild(cell);
    });
    body.appendChild(pestGrid);

    // 2.2 SWOT 2×2（按键贴小节；手动生成，2026-09-01 二次决策）
    body.appendChild(Work5.subhead('2.2','SWOT · 优势 / 劣势 / 机会 / 威胁'));
    body.appendChild(el('div',{class:'ai-actions'},
      el('button',{class:'ghost small',onclick:ev=>Work5.aiSwot(ev.currentTarget)},(Work5._swotEmpty()?'AI 生成 SWOT':'重新生成 SWOT'))
    ));
    const swotGrid=el('div',{class:'swot-2x2'});
    [['strengths','S','优势'],['weaknesses','W','劣势'],
     ['opportunities','O','机会'],['threats','T','威胁']].forEach(([k,letter,label])=>{
      const itemsWrap=el('div',{class:'items'});
      (e[k]||[]).forEach((it,i)=>{
        itemsWrap.appendChild(el('div',{class:'item',contenteditable:'true',
          oninput:ev=>{ e[k][i]=Work5.readEd(ev.target); autosave(); }},
          it));
      });
      // 添加行：文本为空，占位提示由 CSS ::before 提供（2026-09-01 修复：
      // 原先文本「＋ 添加」+ CSS 双加号，且误输内容被当条目存入）
      itemsWrap.appendChild(el('div',{class:'item item-add',contenteditable:'true',
        onblur:ev=>{
          const v=Work5.readEd(ev.target).trim();
          if(v){
            if(!e[k]) e[k]=[];
            e[k].push(v);
            autosave(); Work5.rerender('plan');
          } else {
            ev.target.textContent='';
          }
        }},
        ''));
      swotGrid.appendChild(el('div',{class:'swot-cell '+k[0]},
        el('div',{class:'label'},
          el('span',{class:'letter'},letter),
          el('span',{},label)
        ),
        itemsWrap
      ));
    });
    body.appendChild(swotGrid);
  }));

  // ---------- 3 市场选择与定位 ----------
  sec.appendChild(Work5.chapter('3','市场选择与定位', body=>{
    body.appendChild(Work5.provenance(2,'市场矩阵 · 决策卡 · 痛点地图 · 卖点矩阵 · STP'));
    body.appendChild(Work5.subhead('3.1','市场吸引力 × 竞争力矩阵'));
    Work5.marketMatrixBlock(body);
    body.appendChild(Work5.subhead('3.2','三档决策卡'));
    Work5.decisionCardBlock(body);
    Work5.weightsBlock(body);
    body.appendChild(Work5.subhead('3.3','客户痛点地图'));
    Work5.painMapBlock(body);
    Work5.topicsBlock(body);
    body.appendChild(Work5.subhead('3.4','卖点矩阵与排名'));
    Work5.sellingPointBlock(body);
    body.appendChild(Work5.subhead('3.5','STP：细分 / 目标 / 定位'));
    body.appendChild(el('div',{class:'ai-actions'},
      el('button',{class:'ghost small',onclick:()=>Work5.importTargeting()},(state.work5.ch3_strategy.targeting?'重新导入目标市场':'从 Work 2 导入目标市场')),
      el('button',{class:'ghost small',onclick:()=>Work5.importPositioning()},(state.work5.ch3_strategy.positioning?'重新导入细分与定位':'从 Work 3 导入细分与定位'))
    ));
    const s=state.work5.ch3_strategy;
    body.appendChild(el('div',{class:'stp'},
      ...[['segmentation','S','细分','Segmentation'],
          ['targeting','T','目标','Targeting'],
          ['positioning','P','定位','Positioning']].map(([k,letter,zh,en])=>
        el('div',{class:'stp-row'},
          el('div',{class:'stp-label'},
            el('span',{class:'name'},letter+' — '+zh),
            en
          ),
          el('div',{class:'stp-text',contenteditable:'true',
            oninput:e=>{s[k]=Work5.readEd(e.target);autosave();}},
            s[k]||'〔点击此处输入……〕')
        ))
    ));
  }));

  // ---------- 4 营销组合 ----------
  sec.appendChild(Work5.chapter('4','营销组合', body=>{
    const m=state.work5.ch4_mix;
    body.appendChild(Work5.provenance(4,'出海路径 · 4P · 4C'));
    body.appendChild(el('div',{class:'ai-actions'},
      el('button',{class:'ghost small',onclick:()=>Work5.import4P()},(m.product?'重新导入':'从 Work 4 导入')),
      el('button',{class:'ghost small',onclick:e=>Work5.aiPolish4P(e.currentTarget)},'AI 润色 4P（保持结构）')
    ));

    body.appendChild(Work5.subhead('4.1','增长路径'));
    body.appendChild(el('div',{class:'chapter-text',contenteditable:'true',
      oninput:e=>{m.route=Work5.readEd(e.target);autosave();}},
      m.route||'〔点击此处输入——模式/路径/节奏……〕'));

    body.appendChild(Work5.subhead('4.2','营销组合 4P'));
    body.appendChild(el('div',{class:'ai-actions'},
      el('button',{class:'ghost small',onclick:e=>Work5.aiSummary4P(e.currentTarget)},(Work5._pTableHas()?'重新生成 4P 表':'AI 总结 4P 表'))
    ));
    Work5.fourPTableBlock(body);
    // 原 4P 全文：默认折叠（打印/导出全量展开）
    body.appendChild(Work5.detail('4P 详述（可编辑）',
      ...[['product','产品'],['price','价格'],['place','渠道'],['promotion','促销']].map(([k,zh])=>
        el('div',{class:'chapter-text',contenteditable:'true',
          oninput:e=>{m[k]=Work5.readEd(e.target);autosave();}},
          m[k]||('〔'+zh+'——点击此处输入……〕')))));

    body.appendChild(Work5.subhead('4.3','渠道结构'));
    Work5.channelBlock(body);

    body.appendChild(Work5.subhead('4.4','媒介预算构成'));
    Work5.budgetBarBlock(body);

    body.appendChild(Work5.subhead('4.5','4C：客户价值 / 成本 / 便利 / 沟通'));
    body.appendChild(el('div',{class:'ai-actions'},
      el('button',{class:'ghost small',onclick:e=>Work5.convert4C(e.currentTarget)},(Work5._fourCEmpty()?'AI 生成 4C':'重新生成 4C'))
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
          oninput:e=>{m[k]=Work5.readEd(e.target);autosave();}},
          m[k]||'〔点击此处输入……〕')
      ));
    });
    body.appendChild(cGrid);
  }));

  // ---------- 5 总结与展望 ----------
  sec.appendChild(Work5.chapter('5','总结与展望', body=>{
    body.appendChild(Work5.provenance('1–4','各章汇总'));
    body.appendChild(el('div',{class:'ai-actions'},
      el('button',{class:'ghost small',onclick:e=>Work5.aiOutlook(e.currentTarget)},(state.work5.ch5_outlook?'重新生成总结展望':'AI 生成总结展望'))
    ));
    body.appendChild(el('div',{class:'chapter-text',contenteditable:'true',
      oninput:e=>{state.work5.ch5_outlook=Work5.readEd(e.target);autosave();}},
      state.work5.ch5_outlook||'〔点击此处输入总结与展望——里程碑、关键风险、长期愿景。〕'));
  }));

  UI.mountMark(sec, Work5);
};
Work5.rerender = function(id){
  // W5 是单步长文档：局部 id（ch2/plan…）不存在独立 step 容器，
  // 一律重渲染唯一的 plan 步容器（修复局部重渲染悄悄失效的 bug）。
  const sec=document.querySelector('#steps5 .step[data-step="'+(id||'plan')+'"]')
    || document.querySelector('#steps5 .step');
  if(!sec) return;
  sec.dataset.rendered='0';
  Work5.renderStep('plan');
};

/* ============================================================
   证据型策划书：来源条 / 证据块 / 同步标
   ============================================================ */
Work5.provenance = function(work, label){
  const t=(state&&state.work5&&state.work5.lastAggregated)?(' · 同步 '+new Date(state.work5.lastAggregated).toLocaleTimeString()):'';
  const bar=el('div',{class:'provenance-bar'},
    '来自 Work '+work+' · '+label+t);
  // 2026-09-01 wayfinder T07：来源条可回链到上游工作坊。
  const n=Number(work);
  if(Number.isInteger(n)&&n>=1&&n<=4){
    bar.appendChild(el('button',{class:'ghost small provenance-go',onclick:()=>{ if(typeof App!=='undefined'&&App.goWork) App.goWork(n); }},'去改 →'));
  }
  return bar;
};
Work5.syncedBadge = function(work){
  return el('span',{class:'synced-badge',title:'直接修改共享 state，上游工作坊同步生效'},
    '已同步到 Work '+work);
};
Work5.ensureOverwrite = function(hasContent, label){
  if(!hasContent) return true;
  return confirm('「'+label+'」已有内容，重新导入/汇总将覆盖当前内容。确定？');
};

/* ---------- 核心证据块（wayfinder T05）----------
   四块均只读引用上游 state（修改去上游）；缺失时给「去 Work N 完成」。 */

// W1 价值体系摘要：自评 → 实测，|Δ|>1.5 为认知断点高亮
Work5.valueSummaryBlock = function(container){
  const dims=((state&&state.work1&&state.work1.metrics)||{}).dimensions||[];
  const rows=[];
  dims.forEach(d=>{
    (d.secondaries||[]).forEach(s2=>{
      if(s2.selfScore==null&&s2.actual==null) return;
      rows.push({dim:d.name,name:s2.name,self:s2.selfScore,actual:s2.actual});
    });
  });
  if(!rows.length){
    container.appendChild(el('div',{class:'warning'},'Work 1 尚未完成指标体系评分。',
      el('button',{class:'ghost small',onclick:()=>{ if(typeof App!=='undefined'&&App.goWork) App.goWork(1); }},'去 Work 1 完成 →')));
    return;
  }
  const plate=el('section',{class:'plate'});
  // 2026-09-01 用户决策：E1 标签与表 1-1 重复，只保留表题
  // 表 1-1（2026-09-01 用户决策：紧凑表格 + 断点底纹）；数值最多 2 位小数
  const fmt=v=>(v==null)?'—':String(Math.round(v*100)/100);
  let breaks=0;
  const t=el('table',{class:'paper-tbl value-tbl'},
    el('thead',{},el('tr',{},...['维度','指标','自评','实测','Δ'].map(h=>el('th',{},h)))),
    el('tbody',{},...rows.map(r=>{
      const delta=(r.actual!=null&&r.self!=null)?(r.actual-r.self):null;
      const hot=delta!=null&&Math.abs(delta)>1.5;
      if(hot) breaks++;
      return el('tr',{class:hot?'break-row':''},
        el('td',{class:'dim'},r.dim||'—'),
        el('td',{},r.name),
        el('td',{class:'num'},fmt(r.self)),
        el('td',{class:'num'},fmt(r.actual)),
        el('td',{class:'num'},
          delta!=null?el('span',{class:'delta-badge'+(hot?' hot':'')},'Δ '+(delta>0?'+':'')+delta.toFixed(1)):'—'));
    })),
    el('tfoot',{},el('tr',{},el('td',{colspan:'5',class:'tbl-note'},
      '认知断点 '+breaks+' 项（|Δ|>1.5）· 数据来自 Work 1 指标体系')))
  );
  plate.appendChild(el('div',{class:'fourp-table'},
    el('div',{class:'tbl-caption'},'表 1-1 品牌价值体系 · 自评 → 实测'),
    t));
  container.appendChild(plate);
  container.appendChild(Work5.syncedBadge(1));
};

// W2 市场名解析（2026-09-01 修复）：v2 schema 市场在 retained/candidates 池，
// 旧 v1 数据兼容 markets——不直接读单一数组（ADR 0010 唯一出口原则）。
Work5._w2NameOf=function(id){
  const w2=(state&&state.work2)||{};
  const pools=[...(w2.retained||[]),...(w2.markets||[]),...(w2.candidates||[])];
  const mk=pools.find(x=>x.id===id);
  return mk?(mk.name||''):'';
};

// W2 三档决策卡：表 3-1 三档资源决策（2026-09-01 用户决策：三行决策表，替换 E2 行式流水）
Work5.decisionCardBlock = function(container){
  const d=(state&&state.work2&&state.work2.decision)||{};
  const t1=d.tier1||{};
  if(!t1||!t1.marketId){
    container.appendChild(el('div',{class:'warning'},'Work 2 尚未完成三档决策。',
      el('button',{class:'ghost small',onclick:()=>{ if(typeof App!=='undefined'&&App.goWork) App.goWork(2); }},'去 Work 2 完成 →')));
    return;
  }
  const nameOf=Work5._w2NameOf;
  const t2=d.tier2||{}, t3=d.tier3||{};
  const t1Name=nameOf(t1.marketId)||t1.name||'未命名';
  const t2Names=(t2.marketIds||[]).map(nameOf).filter(Boolean);
  const t3Names=(t3.marketIds||[]).map(nameOf).filter(Boolean);
  const t1Content=[
    t1.rationale?('理由：'+t1.rationale):'',
    ...(t1.milestones||[]).map(ms=>'里程碑：'+ms)
  ].filter(Boolean);
  const t2Content=[...((t2.observationMetrics)||[])].map(om=>'观察指标：'+om);
  const mkRow=(tier,name,res,content,reEval,cls)=>el('tr',{class:cls||''},
    el('td',{class:'tier'},tier),
    el('td',{},name||'—'),
    el('td',{class:'num'},res||'—'),
    el('td',{},...((content.length?content:['—']).map(x=>el('div',{},x)))),
    el('td',{},reEval||'—'));
  const t=el('table',{class:'paper-tbl decision-tbl'},
    el('thead',{},el('tr',{},...['档位','目标市场','资源','关键内容','再评估触发'].map(h=>el('th',{},h)))),
    el('tbody',{},
      mkRow('主战场',t1Name,(t1.resourcesPct!=null?t1.resourcesPct:'—')+'%',t1Content,t1.reEvalTrigger||'—','tier1-row'),
      mkRow('观察期',t2Names.join('、'),'',t2Content,t2.reEvalTrigger||'—'),
      mkRow('暂缓',t3Names.join('、'),'','',(t3.reEvalTrigger||'—')||'—')
    )
  );
  container.appendChild(el('section',{class:'plate'},
    el('div',{class:'fourp-table'},
      el('div',{class:'tbl-caption'},'表 3-1 三档资源决策'),
      t)));
  container.appendChild(Work5.syncedBadge(2));
};

// W3 客户痛点地图：表 3-1（2026-09-01 用户决策：论文式表格，替换 E3 行式流水）
Work5.painMapBlock = function(container){
  const mg=((state&&state.work3)||{}).mining||{};
  const pains=mg.painMap||[];
  if(!pains.length){
    container.appendChild(el('div',{class:'warning'},'Work 3 尚未完成卖点挖掘（痛点地图）。',
      el('button',{class:'ghost small',onclick:()=>{ if(typeof App!=='undefined'&&App.goWork) App.goWork(3); }},'去 Work 3 完成 →')));
    return;
  }
  const comp=mg.corpusComposition||{real:(mg.documents||[]).length,simulated:(mg.simulatedDocuments||[]).length};
  const scName=id=>(typeof Work3!=='undefined'&&typeof Work3.scenarioName==='function'&&Work3.scenarioName(id))||'—';
  const typeOrder={'痛点':0,'痒点':1,'爽点':2};
  const freqOrder={'高':0,'中':1,'低':2};
  const rows=[...pains].sort((a,b)=>
    ((typeOrder[a.type]??3)-(typeOrder[b.type]??3))||((freqOrder[a.frequency]??3)-(freqOrder[b.frequency]??3)));
  const counts={'痛点':0,'痒点':0,'爽点':0};
  rows.forEach(p=>{ if(counts[p.type]!=null) counts[p.type]++; });
  const t=el('table',{class:'paper-tbl pain-tbl'},
    el('thead',{},el('tr',{},...['类型','痛点 / 爽点','频次','场景','用户原声'].map(h=>el('th',{},h)))),
    el('tbody',{},...rows.map(p=>el('tr',{},
      el('td',{class:'dim'},p.type||'—'),
      el('td',{},String(p.pain||'—')),
      el('td',{class:'num'},el('span',{class:'freq-badge f'+(freqOrder[p.frequency]!=null?freqOrder[p.frequency]:3)},p.frequency||'—')),
      el('td',{class:'dim'},scName(p.scenarioId)),
      el('td',{class:'quote',title:String(p.evidence||'')},String(p.evidence||'—'))
    ))),
    el('tfoot',{},el('tr',{},el('td',{colspan:'5',class:'tbl-note'},
      '痛点 '+counts['痛点']+' · 痒点 '+counts['痒点']+' · 爽点 '+counts['爽点']
      +' · 语料构成：真实 '+(comp.real||0)+' + 模拟 '+(comp.simulated||0)+(mg._simulated?' · 模拟建模':''))))
  );
  container.appendChild(el('div',{class:'fourp-table'},
    el('div',{class:'tbl-caption'},'表 3-2 客户痛点地图'),
    t));
  container.appendChild(Work5.syncedBadge(3));
};

// W4 渠道结构：结构树 + 关键伙伴
Work5.channelBlock = function(container){
  const p=((state&&state.work4)||{}).place||{};
  const struct=p.structure||[], partners=p.keyPartners||[];
  if(!struct.length&&!partners.length){
    container.appendChild(el('div',{class:'warning'},'Work 4 尚未完成渠道结构。',
      el('button',{class:'ghost small',onclick:()=>{ if(typeof App!=='undefined'&&App.goWork) App.goWork(4); }},'去 Work 4 完成 →')));
    return;
  }
  const plate=el('section',{class:'plate'});
  plate.appendChild(el('span',{class:'plate-label'},'E4 · 渠道结构 · 结构树 + 关键伙伴'));
  struct.forEach(g=>{
    const kids=(g.children||[]).map(c=>c.name+((c.share!=null)?(' '+c.share+'%'):'')).join('、');
    plate.appendChild(el('div',{class:'evidence-line'},'· '+(g.name||'')+(kids?('：'+kids):'')));
  });
  partners.forEach(kp=>plate.appendChild(el('div',{class:'evidence-line'},'· 关键伙伴：'+kp)));
  container.appendChild(plate);
  container.appendChild(Work5.syncedBadge(4));
};

/* ---------- 明细层折叠（wayfinder T06）：默认收起，打印展开，导出全量。 ---------- */
Work5.detail=function(label, ...children){
  return el('details',{class:'detail-layer'},
    el('summary',{},label),
    ...children
  );
};
Work5.weightsBlock=function(container){
  if(typeof Work2==='undefined'||typeof Work2.effectiveWeights!=='function'||typeof Work2.allIndicators!=='function') return;
  let inds=[], wts={};
  try{ inds=Work2.allIndicators(); wts=Work2.effectiveWeights(); }catch(_){}
  if(!inds.length) return;
  container.appendChild(Work5.detail('上游明细 · Delphi 收敛权重（'+inds.length+' 项）',
    ...inds.map(i=>{
      const w=wts[i.axis]&&wts[i.axis][i.id];
      return el('div',{class:'evidence-line'},'· '+(i.catName||'')+' / '+i.name+'：'+(w!=null?(w*100).toFixed(1)+'%':'—'));
    })
  ));
};
Work5.topicsBlock=function(container){
  const topics=(((state&&state.work3)||{}).mining||{}).topics||[];
  if(!topics.length) return;
  container.appendChild(Work5.detail('上游明细 · LDA 主题词表（'+topics.length+' 个）',
    ...topics.map(t=>{
      const kws=(t.keywords||[]).slice(0,8).map(k=>(k&&k.word)||k).join('、');
      const docs=(t.representative_docs||[]).slice(0,2).map(d=>'「'+String(d).slice(0,40)+'」').join(' ');
      return el('div',{class:'evidence-line'},'· '+(t.label||'主题 '+(t.id+1))+'（'+(t.share||0)+'%）：'+kws+(docs?' · 代表：'+docs:''));
    })
  ));
};

// W2 市场矩阵证据块（点选 = 设主战场，共享 state）
// 2026-09-01 修复：v2 schema 无 state.work2.markets（市场在 retained 池），
// 点位/切分线一律走 Work2.computeMatrix()/matrixCuts() 唯一出口（ADR 0010）。
Work5.marketMatrixBlock = function(container){
  let pts=[];
  try{ pts=(typeof Work2!=='undefined'&&Work2.computeMatrix)?Work2.computeMatrix():[]; }catch(_){ pts=[]; }
  pts=pts.filter(p=>(p.name||'').trim());
  if(!pts.length){
    container.appendChild(el('div',{class:'warning'},
      'Work 2 尚未完成候选市场与评分。',
      el('button',{class:'ghost small',onclick:()=>{ if(typeof App!=='undefined'&&App.goWork) App.goWork(2); }},'去 Work 2 完成 →')
    ));
    return;
  }
  let cuts={xCut:null,yCut:null};
  try{ if(typeof Work2!=='undefined'&&Work2.matrixCuts) cuts=Work2.matrixCuts(); }catch(_){}
  // 2026-09-02：全零点位（评分缺失/键名漂移）时给明确提示，不再无声画原点
  if(pts.every(p=>!p.x && !p.y)){
    container.appendChild(el('div',{class:'warning'},
      '3.1 显示异常：所有市场评分缺失，散点将全部落在原点。请回 Work 2 完成市场评分（每市场 × 每指标打分）。',
      el('button',{class:'ghost small',onclick:()=>{ if(typeof App!=='undefined'&&App.goWork) App.goWork(2); }},'去 Work 2 评分 →')));
  }
  const d=state.work2;
  const plate=el('section',{class:'plate'});
  plate.appendChild(el('span',{class:'plate-label'},'F8 · PLUMB SCATTER · 市场吸引力 × 业务竞争力（点选设为主战场）'));
  const chartWrap=el('div');
  renderMatrix({
    container:chartWrap,
    points:pts.map(p=>({id:p.id,label:p.name,x:p.x,y:p.y})),
    xLabel:'业务竞争力（加权）', yLabel:'市场吸引力（加权）',
    xCut:cuts.xCut, yCut:cuts.yCut,
    selectedId:(d.decision&&d.decision.tier1&&d.decision.tier1.marketId)||null,
    qHighHigh:'明星市场（重点投入）', qHighYLowX:'潜力市场（补能力）',
    qlowYHighX:'产能市场（选择性收割）', qLowLow:'放弃市场',
    onSelect:id=>{ if(Work2.setTier1) Work2.setTier1(id); autosave(); Work5.rerender('plan'); }
  });
  plate.appendChild(chartWrap);
  container.appendChild(plate);
  container.appendChild(Work5.syncedBadge(2));
};

// W3 卖点矩阵 + 可编辑排名表证据块（分数/勾选直接写共享 state）
Work5.sellingPointBlock = function(container){
  // 2026-09-02：computeMatrix/cuts/逐点辅助全部 try 保护——v1 时代完成的
  // work3 无 dimensions（迁移不补），裸调会炸掉 renderStep 后半页（「看不到矩阵」）。
  const w3=state.work3;
  let pts=[];
  try{ pts=(typeof Work3!=='undefined'&&Work3.computeMatrix)?Work3.computeMatrix():[]; }catch(_){ pts=[]; }
  pts=pts.filter(p=>(p.name||'').trim());
  if(!pts.length){
    container.appendChild(el('div',{class:'warning'},
      'Work 3 尚未完成卖点评分与矩阵。',
      el('button',{class:'ghost small',onclick:()=>{ if(typeof App!=='undefined'&&App.goWork) App.goWork(3); }},'去 Work 3 完成 →')
    ));
    return;
  }
  let cuts={xCut:7,yCut:7};
  try{ if(typeof Work3!=='undefined'&&Work3.effectiveCuts) cuts=Work3.effectiveCuts(); }catch(_){}
  // 2026-09-02：全零点位（合意/可实施维度分缺失）时给明确提示
  if(pts.every(p=>!p.x && !p.y)){
    container.appendChild(el('div',{class:'warning'},
      '3.4 显示异常：所有卖点维度分缺失，散点将全部落在原点。请回 Work 3 完成卖点评分（合意性 × 可实施性）。',
      el('button',{class:'ghost small',onclick:()=>{ if(typeof App!=='undefined'&&App.goWork) App.goWork(3); }},'去 Work 3 评分 →')));
  }
  const inSectorSafe=(x,y)=>{ try{ return Work3.isInSector(x,y); }catch(_){ return false; } };
  const sugSafe=(x,y)=>{ try{ return Work3.entrySuggestion(x,y); }catch(_){ return {ok:false,text:''}; } };
  const plate=el('section',{class:'plate'});
  plate.appendChild(el('span',{class:'plate-label'},'F8 · PLUMB SCATTER · 客户合意性 × 企业可实施性（扇面语义来自 Work 3）'));
  const chartWrap=el('div');
  renderMatrix({
    container:chartWrap,
    points:pts.map(p=>({id:p.id,label:p.name+(Work3.scenarioName(p.scenarioId)?' · '+Work3.scenarioName(p.scenarioId):''),x:p.x,y:p.y})),
    xLabel:'企业可实施性', yLabel:'客户合意性',
    xCut:w3.matrix.xCut, yCut:w3.matrix.yCut,
    showSector:w3.matrix.showSector, sectorWidth:w3.matrix.sectorWidth,
    qHighHigh:'明星卖点',qHighYLowX:'愿景卖点',qlowYHighX:'产能卖点',qLowLow:'淘汰卖点',
    hover:p=>{
      const q=p.x>=cuts.xCut&&p.y>=cuts.yCut?'明星':p.x<cuts.xCut&&p.y>=cuts.yCut?'愿景':p.x>=cuts.xCut&&p.y<cuts.yCut?'产能':'淘汰';
      return p.label+'｜象限：'+q+'｜'+sugSafe(p.x,p.y).text;
    }
  });
  plate.appendChild(chartWrap);
  container.appendChild(plate);
  const tbl=el('div',{class:'table-wrap'});
  const t=el('table',{class:'data'});
  t.innerHTML='<thead><tr><th>#</th><th>卖点</th><th>合意性</th><th>可实施性</th><th>象限</th><th>扇面</th><th>入选</th><th>如何进入最优</th></tr></thead>';
  const tb=el('tbody');
  [...pts].sort((a,b)=>(b.x+b.y)-(a.x+a.y)).forEach((p,i)=>{
    const q=p.x>=cuts.xCut&&p.y>=cuts.yCut?'明星':p.x<cuts.xCut&&p.y>=cuts.yCut?'愿景':p.x>=cuts.xCut&&p.y<cuts.yCut?'产能':'淘汰';
    const inside=inSectorSafe(p.x,p.y);
    const sug=sugSafe(p.x,p.y);
    const row=el('tr',{},
      el('td',{},String(i+1)),
      el('td',{style:{'font-style':'normal'}},p.name),
      el('td',{},el('input',{type:'number',min:0,max:10,step:0.1,value:(p.y??'').toFixed(1)||'',onchange:e=>{p.reviewDes=e.target.value===''?null:parseFloat(e.target.value);autosave();Work5.rerender('plan');}})),
      el('td',{},el('input',{type:'number',min:0,max:10,step:0.1,value:(p.x??'').toFixed(1)||'',onchange:e=>{p.reviewImp=e.target.value===''?null:parseFloat(e.target.value);autosave();Work5.rerender('plan');}})),
      el('td',{},el('span',{class:'tag '+(q==='明星'?'maroon':'')},q)),
      el('td',{},w3.matrix.showSector ? (inside?el('span',{class:'tag soft'},'扇面内'):el('span',{class:'tag'},'外')) : el('span',{class:'muted'},'—')),
      el('td',{},(()=>{const cb=el('input',{type:'checkbox',checked:!!p.selected});cb.style.width='auto';cb.addEventListener('change',()=>{p.selected=cb.checked;autosave();Work5.rerender('plan');});return cb;})()),
      el('td',{class:'hint',style:{'text-transform':'none','letter-spacing':'0'}},sug.text)
    );
    tb.appendChild(row);
  });
  t.appendChild(tb); tbl.appendChild(t); container.appendChild(tbl);
  container.appendChild(Work5.syncedBadge(3));
};

// 导出用的完整排名 Markdown 表（与视图同构）
Work5.rankingTableMd = function(){
  const w3=state.work3;
  if(!w3 || !Array.isArray(w3.candidates)) return '';
  let pts=[], cuts={xCut:7,yCut:7};
  try{ pts=(Work3.computeMatrix()||[]).filter(p=>(p.name||'').trim()); }catch(_){ pts=[]; }
  try{ if(Work3.effectiveCuts) cuts=Work3.effectiveCuts(); }catch(_){}
  if(!pts.length) return '';
  const lines=['| # | 卖点 | 合意性 | 可实施性 | 象限 | 扇面 | 入选 | 如何进入最优 |','| --- | --- | --- | --- | --- | --- | --- | --- |'];
  [...pts].sort((a,b)=>(b.x+b.y)-(a.x+a.y)).forEach((p,i)=>{
    const q=p.x>=cuts.xCut&&p.y>=cuts.yCut?'明星':p.x<cuts.xCut&&p.y>=cuts.yCut?'愿景':p.x>=cuts.xCut&&p.y<cuts.yCut?'产能':'淘汰';
    const inside=Work3.isInSector(p.x,p.y);
    const sug=Work3.entrySuggestion(p.x,p.y);
    const escMd = s => String(s||'').replace(/\|/g,'\\|');
    lines.push(`| ${i+1} | ${escMd(p.name)} | ${p.y.toFixed(1)} | ${p.x.toFixed(1)} | ${q} | ${w3.matrix.showSector?(inside?'扇面内':'外'):'—'} | ${p.selected?'✓':''} | ${escMd(sug.text)} |`);
  });
  return lines.join('\n');
};

/* ---------- 证据块导出 MD（与视图同构） ---------- */
Work5.valueSummaryMd = function(){
  const dims=((state&&state.work1&&state.work1.metrics)||{}).dimensions||[];
  const fmt=v=>(v==null)?'—':String(Math.round(v*100)/100);
  const rows=[];
  dims.forEach(d=>{
    (d.secondaries||[]).forEach(s2=>{
      if(s2.selfScore==null&&s2.actual==null) return;
      const delta=(s2.actual!=null&&s2.selfScore!=null)?(s2.actual-s2.selfScore):null;
      rows.push(`- ${d.name}·${s2.name}：自评 ${fmt(s2.selfScore)} → 实测 ${fmt(s2.actual)}${delta!=null?'（Δ '+(delta>0?'+':'')+delta.toFixed(1)+'）':''}`);
    });
  });
  return rows.length?('### 品牌价值体系（自评 → 实测）\n'+rows.join('\n')):'';
};
Work5.decisionMd = function(){
  const d=(state&&state.work2&&state.work2.decision)||{};
  const t1=d.tier1||{};
  if(!t1||!t1.marketId) return '';
  const nameOf=Work5._w2NameOf;
  const lines=['### 三档决策卡'];
  lines.push('- 主战场：'+(nameOf(t1.marketId)||t1.name||'未命名')+'（资源 '+(t1.resourcesPct||0)+'%）');
  if(t1.rationale) lines.push('- 选择理由：'+t1.rationale);
  (t1.milestones||[]).forEach(ms=>lines.push('- 里程碑：'+ms));
  if(t1.reEvalTrigger) lines.push('- 再评估触发：'+t1.reEvalTrigger);
  const t2=d.tier2||{}, t3=d.tier3||{};
  const t2Names=(t2.marketIds||[]).map(nameOf).filter(Boolean);
  const t3Names=(t3.marketIds||[]).map(nameOf).filter(Boolean);
  if(t2Names.length) lines.push('- 观察期：'+t2Names.join('、'));
  (t2.observationMetrics||[]).forEach(om=>lines.push('- 观察指标：'+om));
  if(t3Names.length) lines.push('- 暂缓：'+t3Names.join('、'));
  if(t3.reEvalTrigger) lines.push('- 暂缓再评估触发：'+t3.reEvalTrigger);
  return lines.join('\n');
};
Work5.painMapMd = function(){
  const mg=((state&&state.work3)||{}).mining||{};
  const pains=mg.painMap||[];
  if(!pains.length) return '';
  const comp=mg.corpusComposition||{real:(mg.documents||[]).length,simulated:(mg.simulatedDocuments||[]).length};
  const lines=['### 痛点地图（语料构成：真实 '+(comp.real||0)+' + 模拟 '+(comp.simulated||0)+(mg._simulated?' · 模拟建模':'')+'）'];
  pains.forEach(p=>{
    const sc=(typeof Work3!=='undefined'&&typeof Work3.scenarioName==='function'&&Work3.scenarioName(p.scenarioId))||'';
    lines.push('- ['+(p.type||'痛点')+'] '+(p.pain||'')+'（'+(p.frequency||'中')+'）'+(p.evidence?(' — '+p.evidence):'')+(sc?('【'+sc+'】'):''));
  });
  return lines.join('\n');
};
Work5.channelMd = function(){
  const p=((state&&state.work4)||{}).place||{};
  const struct=p.structure||[], partners=p.keyPartners||[];
  if(!struct.length&&!partners.length) return '';
  const lines=['### 渠道结构'];
  struct.forEach(g=>{
    const kids=(g.children||[]).map(c=>c.name+((c.share!=null)?(' '+c.share+'%'):'')).join('、');
    lines.push('- '+(g.name||'')+(kids?('：'+kids):''));
  });
  partners.forEach(kp=>lines.push('- 关键伙伴：'+kp));
  return lines.join('\n');
};
Work5.weightsMd = function(){
  if(typeof Work2==='undefined'||typeof Work2.effectiveWeights!=='function'||typeof Work2.allIndicators!=='function') return '';
  let inds=[], wts={};
  try{ inds=Work2.allIndicators(); wts=Work2.effectiveWeights(); }catch(_){}
  if(!inds.length) return '';
  const lines=['#### 上游明细 · Delphi 收敛权重（'+inds.length+' 项）'];
  inds.forEach(i=>{
    const w=wts[i.axis]&&wts[i.axis][i.id];
    lines.push('- '+(i.catName||'')+' / '+i.name+'：'+(w!=null?(w*100).toFixed(1)+'%':'—'));
  });
  return lines.join('\n');
};
Work5.topicsMd = function(){
  const topics=(((state&&state.work3)||{}).mining||{}).topics||[];
  if(!topics.length) return '';
  const lines=['#### 上游明细 · LDA 主题词表（'+topics.length+' 个）'];
  topics.forEach(t=>{
    const kws=(t.keywords||[]).slice(0,8).map(k=>(k&&k.word)||k).join('、');
    const docs=(t.representative_docs||[]).slice(0,2).map(d=>'「'+String(d).slice(0,40)+'」').join(' ');
    lines.push('- '+(t.label||'主题 '+(t.id+1))+'（'+(t.share||0)+'%）：'+kws+(docs?' · 代表：'+docs:''));
  });
  return lines.join('\n');
};
Work5.mediaMd = function(){
  const adv=(((state&&state.work4)||{}).promotion||{}).advertising||[];
  if(!adv.length) return '';
  const lines=['#### 上游明细 · 媒介预算组合（budgetShare 合计 100）'];
  adv.forEach(a=>lines.push('- '+(a.media||'')+' '+(a.budgetShare!=null?a.budgetShare:'—')+'% — '+(a.message||'')+'（KPI：'+(a.kpi||'')+'）'));
  return lines.join('\n');
};

Work5.mvo = function(){
  const w=state.work5;
  const env=w.ch2_environment||{};
  const s3=w.ch3_strategy||{};
  const hasCh2=['political','economic','social','technological'].some(k=>(env[k]||'').trim().length>0)
    || (env.strengths||[]).some(x=>(x||'').trim()) || (env.weaknesses||[]).some(x=>(x||'').trim());
  const hasCh4=!!w.ch4_mix && ['product','price','place','promotion'].some(k=>(w.ch4_mix[k]||'').trim().length>0);
  return {
    checks: [
      {label:'第 1 章 业务与市场有内容', test:()=>(w.ch1_business||'').trim().length>10},
      {label:'第 2 章 环境分析（PEST/SWOT）有内容', test:()=>hasCh2},
      {label:'第 3 章 市场选择与定位（STP）有内容', test:()=>!!((s3.segmentation||s3.targeting||s3.positioning||'')).trim()},
      {label:'第 4 章 营销组合（4P/4C）有内容', test:()=>hasCh4},
      {label:'第 5 章 总结与展望已写', test:()=>(w.ch5_outlook||'').trim().length>20},
    ],
    note:'策划书是给别人看的——把 AI 汇总的"正确的废话"改成你企业的具体判断和数据。打印前通读一遍，删掉所有没证据支撑的结论。'
  };
};

/* 上游四坊成稿检查（不硬卡 W5 完成判据，仅提示 + 去完成入口）。 */
Work5.UPSTREAM_WORKS=[
  {n:1, key:'I 业务价值体系'},
  {n:2, key:'II 目标市场'},
  {n:3, key:'III 价值主张'},
  {n:4, key:'IV 营销组合'}
];
Work5.upstreamStatus=function(){
  const mods={1:Work1,2:Work2,3:Work3,4:Work4};
  return Work5.UPSTREAM_WORKS.map(({n,key})=>{
    let done=false, passed=0, total=0;
    try{
      const mod=mods[n]; if(mod && mod.mvo && mod.steps){
        total=mod.steps.length;
        mod.steps.forEach(s=>{
          const cfg=typeof mod.mvo==='function' ? mod.mvo() : (mod.mvo[s.id]?mod.mvo[s.id]():null);
          if(cfg && cfg.checks.every(c=>{try{return !!c.test();}catch(_){return false;}})) passed++;
        });
      }
    }catch(_){}
    return {n,key,passed,total,done:total>0&&passed===total};
  });
};
Work5.upstreamLine=function(){
  return Work5.upstreamStatus().map(s=>s.key+(s.done?' ✓':' ✗')).join(' · ');
};
Work5.readinessPanel=function(){
  const items=Work5.upstreamStatus();
  const rows=items.map(it=>el('div',{class:'readiness-row'},
    el('span',{class:'readiness-dot'+(it.done?' ok':'')},it.done?'✓':'○'),
    el('span',{class:'readiness-name'},it.key),
    it.done
      ? el('span',{class:'muted'},'已完成')
      : el('button',{class:'ghost small',onclick:()=>{ if(typeof App!=='undefined'&&App.goWork) App.goWork(it.n); }},'去完成 →')
  ));
  return el('div',{class:'plate readiness no-print'},
    el('span',{class:'plate-label'},'成稿检查 · 上游工作坊（未完成不卡完成，仅提示）'),
    el('div',{class:'readiness-rows'},...rows)
  );
};

Work5.toolbar=function(){
  return el('div',{class:'plate no-print',style:{display:'flex',gap:'10px','flex-wrap':'wrap',alignItems:'center','margin-bottom':'20px'}},
    el('button',{class:'primary small',onclick:()=>Work5.aggregateAll()},'从 Work 1–4 一键汇总',el('span',{class:'arrow'})),
    el('button',{class:'ghost small',onclick:()=>window.print()},'打印 / PDF'),
    el('button',{class:'ghost small',onclick:()=>App.exportMd()},'导出 Markdown'),
    el('button',{class:'ghost small',onclick:e=>Work5.aiPolishAll(e.currentTarget)},'AI 润色全文')
  );
};

// 价值链定位：来自 Work1 微笑曲线收口（只读引用，供策划书自动带出 / 导出）
Work5.valueChainLine=function(){
  try{
    const env = state.work1.environment;
    const t = (env && env.ourCapabilities && env.ourCapabilities.smileCurve) || (typeof Work1!=='undefined' && Work1.smileConclusion ? Work1.smileConclusion() : '');
    return String(t||'').trim();
  }catch(e){ return ''; }
};

// 章节骨架：国标编号（CY/T 35：编号 + 空 1 字 + 标题），无眉标。
Work5.chapter=function(num,title,bodyFn){
  const body=el('div',{class:'plate'});
  bodyFn(body);
  return el('section',{class:'chapter'},
    el('div',{class:'chapter-head'}, el('h2',{}, num+' '+title)),
    body
  );
};
Work5.subhead=function(num,title){
  return el('div',{class:'sub-head'}, el('h3',{}, num+' '+title));
};

/* ---------- AGGREGATION ---------- */
/* 汇总/同步统一走 compose → 比较 → 写入。
   compose* 只读上游、产出纯文本/字段对象（不写 state、不触 DOM）；
   手动按钮与进入即同步共用同一批 compose，避免两条逻辑漂移。 */
Work5.composeCh1=function(){
  const w=(state&&state.work1)||{}, sbu=w.sbu||{}, vals=w.values||{};
  const lines=[];
  if(sbu.name) lines.push('业务单元：'+sbu.name);
  if(sbu.summary) lines.push('一句话概述：'+sbu.summary);
  if(sbu.category) lines.push('品类 / 行业：'+sbu.category);
  if(sbu.stage) lines.push('发展阶段：'+sbu.stage);
  if(sbu.scope) lines.push('地理范围：'+sbu.scope);
  if(vals.chosenFunctional||vals.chosenEmotional||vals.chosenSocial){
    lines.push('核心价值：功能 '+(vals.chosenFunctional||'—')+' · 情感 '+(vals.chosenEmotional||'—')+' · 社会 '+(vals.chosenSocial||'—'));
  }
  const ins=((w.analysis&&w.analysis.insights)||'').trim();
  if(ins) lines.push('关键洞察：\n'+ins);
  return lines.join('\n');
};
Work5.composePest=function(){
  const env=(state&&state.work1&&state.work1.environment)||{};
  const out={};
  ['political','economic','social','technological'].forEach(k=>{
    if((env[k]||'').trim()) out[k]=env[k];
  });
  return out;
};
Work5.composeTargeting=function(){
  if(typeof Work2==='undefined'||typeof Work2.selectedTiers!=='function') return '';
  let tiers={tier1:null,tier2:[]};
  try{ tiers=Work2.selectedTiers(); }catch(_){}
  if(!tiers||!tiers.tier1) return '';
  const pts=(typeof Work2.computeMatrix==='function')?Work2.computeMatrix():[];
  const p=pts.find(x=>x.id===tiers.tier1.marketId);
  const extra=[];
  if(p){ extra.push('市场吸引力：'+p.y.toFixed(2)+'/10'); extra.push('业务竞争力：'+p.x.toFixed(2)+'/10'); }
  if((tiers.tier2||[]).length) extra.push('观察市场：'+tiers.tier2.map(t=>t.name).join('、'));
  return '目标市场：'+tiers.tier1.name+'。\n'+(extra.length?extra.join('\n')+'\n':'')+'选择理由：'+(tiers.tier1.rationale||'');
};
Work5.composePositioning=function(){
  const w3=(state&&state.work3)||{};
  const p=w3.proposition||{}, id=w3.identity||{};
  let positioning='';
  if(p.chosenValueText||p.positioningStatement||id.mbti||p.mbti||id.chosenSlogan||p.chosenSlogan){
    const traits=((id.personalityTraits&&id.personalityTraits.length)?id.personalityTraits:(p.personalityTraits||[])).join('/');
    positioning='价值主张：'+(p.chosenValueText||'')
      +'\n定位句：'+(p.positioningStatement||'')
      +'\n品牌人格：'+(id.mbti||p.mbti||'')+(traits?' '+traits:'')
      +'\nSlogan：'+(id.chosenSlogan||p.chosenSlogan||'');
  }
  // STP 细分承接 Work3 场景细分（市场细分场景），不用 Work1 画像。旧数据无场景时回退画像。
  const scenarios=w3.scenarios||[];
  const ordered=[...scenarios.filter(s=>s.selected), ...scenarios.filter(s=>!s.selected)];
  let segmentation=ordered.map(s=>'· '+s.name+'：'+(s.description||'')).join('\n');
  if(!segmentation){
    segmentation=((state&&state.work1&&state.work1.personas)||[])
      .map(pp=>'· '+pp.name+'（'+pp.age+'，'+pp.occupation+'，'+pp.region+'）：'+pp.painPoints).join('\n');
  }
  return {segmentation,positioning};
};
/* 4P/4C 结构化重组。
   normalizeBullets：把 markdown 装饰剥成「主题句 + · 要点行」纯文本；
   structureP：按 Work4 表单字段（summaryText 字段优先）重组每个 P 的文档块。 */
Work5.normalizeBullets=function(text){
  if(!text) return '';
  return String(text).split(/\r?\n/).map(l=>{
    let s=l.replace(/^#{1,6}\s+/,'').replace(/\*\*(.+?)\*\*/g,'$1').replace(/\*(.+?)\*/g,'$1').trim();
    if(/^[-*•·]\s+/.test(s)) s='· '+s.replace(/^[-*•·]\s+/,'');
    s=s.replace(/\s*★/g,'').trim();
    return s;
  }).filter(l=>l!=='').join('\n');
};
Work5.structureP=function(key){
  let base='';
  if(typeof Work4!=='undefined'&&typeof Work4.summaryText==='function'){
    try{ base=Work4.summaryText(key)||''; }catch(_){}
  }
  if(!String(base||'').trim()){
    const m=(state&&state.work5&&state.work5.ch4_mix)||{};
    base=m[key]||'';
  }
  return Work5.normalizeBullets(base);
};
Work5.compose4P=function(){
  const out={};
  ['route','product','price','place','promotion'].forEach(k=>{
    const v=Work5.structureP(k);
    if(String(v||'').trim()) out[k]=v;
  });
  return out;
};

Work5.aggregateAll=function(){
  // 2026-09-01 wayfinder map：整组汇总先确认一次，再强制覆盖各章。
  const s=state.work5;
  const touched = !!(s.ch1_business ||
    ['political','economic','social','technological'].some(k=>(s.ch2_environment[k]||'').trim()) ||
    s.ch3_strategy.targeting || s.ch3_strategy.positioning || s.ch4_mix.product);
  if(touched && !confirm('「从 Work 1–4 汇总」将覆盖已填写的业务/环境/市场/4P 章节。确定？')) return;
  Work5.aggregateCh1(true);
  Work5.importPestFromWork1(true, true);
  Work5.importTargeting(true, true);
  Work5.importPositioning(true, true);
  Work5.import4P(true, true);
  state.work5.lastAggregated=new Date().toISOString();
  autosave(); Work5.rerender('plan');
  void Work5._auto4C();
  showToast('已从 Work 1–4 汇总');
};

Work5.aggregateCh1=function(force){
  if(!force && !Work5.ensureOverwrite(state.work5.ch1_business, '业务与市场')) return;
  const text=Work5.composeCh1();
  if(!text) return;
  state.work5.ch1_business=text; autosave(); Work5.rerender('plan');
};

Work5.importPestFromWork1=function(silent, force){
  const e=state.work5.ch2_environment;
  if(!force && !Work5.ensureOverwrite(['political','economic','social','technological'].some(k=>(e[k]||'').trim()), 'PEST')) return;
  const next=Work5.composePest();
  Object.assign(e,next);
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
// ai_context（2026-08-27 全局机制）：稳定前缀在前，共享 digest。
Work5._msgs=function(sys, user, needs){
  if(typeof AiContext!=='undefined' && AiContext.buildPrompt){
    return AiContext.buildPrompt({workId:'work5', sections:needs||['sbu','positioning'], system:sys, instruction:user});
  }
  return [{role:'system',content:sys},{role:'user',content:user}];
};
// work2 v2 主战场名（旧数据回退）
Work5._tier1Name=function(){
  return ((typeof Work2!=='undefined'&&Work2.selectedTiers)?Work2.selectedTiers().tier1?.name:'')||'';
};

/* 去样板写作禁令（humanizer-zh，2026-09-01 决策）：拼进所有生成类 system prompt。 */
Work5._humanRule='写作禁令：不用「此外/凸显/彰显/赋能/格局/不仅…而且…」这类套话；不用破折号插入语；不写三段排比；短句长句交错；直接给事实和数字，不写空话总结；禁用任何 markdown 符号（**、#、- 列表符），小标题直接写文字。';

/* ---------- SWOT（2026-09-01 决策 2：进入即预生成 + 手动重生成） ---------- */
// 占位/误输判定（2026-09-01 用户反馈）：添加行里误输的「＋1添加」类字符串
// 会被当正式条目存入 → 阻断 _swotEmpty → AI 预生成永远跳过。剥掉 ＋/+、
// 空白与「添加」后为空或仅剩 1 字符、且原串含 ＋/+/添加 特征的视为垃圾。
Work5._swotGarbage=function(it){
  const s=String(it==null?'':it);
  if(!s.trim()) return true;
  const stripped=s.replace(/[＋+\s]/g,'').replace(/添加/g,'');
  return stripped.length<=1 && /[＋+]|添加/.test(s);
};
// 清洗四组条目（幂等）：只删占位垃圾，不动真实内容。
Work5.healSwotItems=function(){
  const e=(state&&state.work5&&state.work5.ch2_environment)||{};
  ['strengths','weaknesses','opportunities','threats'].forEach(k=>{
    if(Array.isArray(e[k])) e[k]=e[k].filter(it=>!Work5._swotGarbage(it));
  });
};
Work5._swotEmpty=function(){
  const e=(state&&state.work5&&state.work5.ch2_environment)||{};
  return ['strengths','weaknesses','opportunities','threats'].every(k=>
    !(e[k]||[]).some(it=>!Work5._swotGarbage(it)));
};
Work5._genSwot=async function(signal){
  const env=state.work5.ch2_environment;
  const sys='你是营销战略顾问。基于给定信息生成 SWOT，输出 JSON: {"strengths":[],"weaknesses":[],"opportunities":[],"threats":[]}，每项 3-5 条、每条不超过 20 字的短标签，写具体事实不写空话。'+Work5._humanRule;
  const w1=(state&&state.work1)||{};
  const pains=(((state&&state.work3)||{}).mining||{}).painMap||[];
  const user='SBU：'+((w1.sbu&&w1.sbu.name)||'')
    +'\n一句话概述：'+((w1.sbu&&w1.sbu.summary)||'')
    +'\n\nPEST：\nP='+((env.political)||'')+'\nE='+((env.economic)||'')+'\nS='+((env.social)||'')+'\nT='+((env.technological)||'')
    +'\n\n目标市场：'+Work5._tier1Name()
    +'\n选择理由：'+(((state.work2||{}).decision&&state.work2.decision.tier1&&state.work2.decision.tier1.rationale)||'')
    +'\n\n价值主张：'+(((state.work3||{}).proposition||{}).chosenValueText||'')
    +(pains.length?('\n客户痛点：\n'+pains.slice(0,8).map(p=>'['+(p.type||'')+'] '+(p.pain||'')).join('\n')):'');
  const r=await API.callJson(Work5._msgs(sys, user, ['sbu','positioning']),{signal});
  if(r){
    ['strengths','weaknesses','opportunities','threats'].forEach(k=>{
      if(Array.isArray(r[k])) env[k]=r[k];
    });
  }
  return r;
};
Work5.aiSwot=async function(button){
  return Work5._run(button,'SWOT', async signal=>{
    const r=await Work5._genSwot(signal);
    if(r){ autosave(); Work5.rerender('plan'); }
  });
};

Work5.importTargeting=function(silent, force){
  if(!force && !Work5.ensureOverwrite(state.work5.ch3_strategy.targeting, '目标市场')) return;
  const text=Work5.composeTargeting();
  if(!text){ if(!silent)showToast('Work 2 未选择目标市场'); return; }
  state.work5.ch3_strategy.targeting=text;
  autosave();
  if(!silent){Work5.rerender('plan');showToast('已导入目标市场');}
};

Work5.importPositioning=function(silent, force){
  if(!force && !Work5.ensureOverwrite(state.work5.ch3_strategy.positioning, '定位')) return;
  const next=Work5.composePositioning();
  if(!next.positioning){ if(!silent)showToast('Work 3 尚未完成主张与定位'); return; }
  state.work5.ch3_strategy.positioning=next.positioning;
  state.work5.ch3_strategy.segmentation=next.segmentation;
  autosave();
  if(!silent){Work5.rerender('plan');showToast('已导入定位');}
};

Work5.import4P=function(silent, force){
  if(!force && !Work5.ensureOverwrite(state.work5.ch4_mix.product, '营销组合')) return;
  const next=Work5.compose4P();
  if(!next || !Object.keys(next).length){ if(!silent)showToast('Work 4 尚未完成 4P'); return; }
  const m=state.work5.ch4_mix;
  Object.assign(m,next);
  autosave();
  if(!silent){Work5.rerender('plan');showToast('已导入路径 + 4P');}
};

/* ---------- 进入即同步（wayfinder T03 + 2026-09-01 决策 2）：
   1) 上游章节最新成果自动带入（有变化才存档并覆盖，人工产物不动）
   2) SWOT/4C 为空且上游有料 → AI 预生成（仅空时填，绝不覆盖手改内容） ---------- */
Work5._fourCEmpty=function(){
  const m=(state&&state.work5&&state.work5.ch4_mix)||{};
  return ['customerValue','customerCost','convenience','communication'].every(k=>!(m[k]||'').trim());
};
Work5._pTableHas=function(){
  const pt=((state&&state.work5&&state.work5.ch4_mix)||{}).pTable||{};
  return ['product','price','place','promotion'].some(k=>pt[k]&&((pt[k].core||'').trim()||(pt[k].actions||'').trim()||(pt[k].nums||'').trim()));
};
// 2026-09-01 二次决策：SWOT 改回手动按键生成（进入不再自动调 API）；4C 保持空态自动。
Work5._auto4C=async function(){
  try{
    if(!state||!state.work5) return;
    if(state.meta&&state.meta.isDemo) return;
    if(typeof API==='undefined'||!API.callJson) return;
    const m=state.work5.ch4_mix;
    if(Work5._fourCEmpty() && ['product','price','place','promotion'].some(k=>(m[k]||'').trim())){
      await Work5._gen4C();
      autosave(); Work5.rerender('plan');
    }
  }catch(e){ console.warn('[W5 auto 4C]', e); }
};
// 进入/汇总时的无档案清洗：SWOT 占位垃圾 + 正文字段残留 markdown 粗体标记
Work5._stripBold=function(t){ return String(t==null?'':t).replace(/(\*\*|__)(.+?)\1/g,'$2'); };
Work5._entryHeal=function(){
  try{
    if(!state||!state.work5) return;
    Work5.healSwotItems();
    const w=state.work5;
    ['ch1_business','ch5_outlook'].forEach(f=>{ if(w[f]) w[f]=Work5._stripBold(w[f]); });
    if(w.ch4_mix&&w.ch4_mix.route) w.ch4_mix.route=Work5._stripBold(w.ch4_mix.route);
    const s3=w.ch3_strategy;
    if(s3) ['segmentation','targeting','positioning'].forEach(f=>{ if(s3[f]) s3[f]=Work5._stripBold(s3[f]); });
  }catch(_){}
};

Work5.autoSync=async function(){
  if(!state||!state.work5) return false;
  if(state.meta&&state.meta.isDemo) return false;
  const w=state.work5;
  const ch2=w.ch2_environment||(w.ch2_environment={});
  const s3=w.ch3_strategy||(w.ch3_strategy={});
  const mix=w.ch4_mix||(w.ch4_mix={});
  const base={
    ch1:w.ch1_business||'',
    pest:{political:ch2.political||'',economic:ch2.economic||'',social:ch2.social||'',technological:ch2.technological||''},
    targeting:s3.targeting||'',
    segmentation:s3.segmentation||'',
    positioning:s3.positioning||'',
    mix:{route:mix.route||'',product:mix.product||'',price:mix.price||'',place:mix.place||'',promotion:mix.promotion||''}
  };
  const pos=Work5.composePositioning();
  const patch={
    ch1_business:Work5.composeCh1()||null,
    pest:Work5.composePest(),
    targeting:Work5.composeTargeting()||null,
    segmentation:pos.positioning?pos.segmentation:null,
    positioning:pos.positioning||null,
    mix:Work5.compose4P()||{}
  };

  let changed=false;
  if(patch.ch1_business && patch.ch1_business!==(w.ch1_business||'')) changed=true;
  if(['political','economic','social','technological'].some(k=>patch.pest[k]!==undefined && patch.pest[k]!==(ch2[k]||''))) changed=true;
  if(patch.targeting && patch.targeting!==(s3.targeting||'')) changed=true;
  if(patch.segmentation!==null && patch.segmentation!==(s3.segmentation||'')) changed=true;
  if(patch.positioning && patch.positioning!==(s3.positioning||'')) changed=true;
  if(['route','product','price','place','promotion'].some(k=>patch.mix[k]!==undefined && patch.mix[k]!==(mix[k]||''))) changed=true;

  if(changed){
    // 覆盖前存档（可恢复）：先把当前内存状态落盘，再建一个时间名快照版本。
    try{ if(typeof saveNow==='function') await saveNow(); }catch(_){}
    try{ if(typeof Archive!=='undefined'&&typeof Archive.create==='function') await Archive.create({}); }catch(_){}

    // 应用前二次比对：存档期间用户可能已经开始输入，被改动的字段不再覆盖。
    if(patch.ch1_business && (w.ch1_business||'')===base.ch1) w.ch1_business=patch.ch1_business;
    ['political','economic','social','technological'].forEach(k=>{
      if(patch.pest[k]!==undefined && (ch2[k]||'')===base.pest[k]) ch2[k]=patch.pest[k];
    });
    if(patch.targeting && (s3.targeting||'')===base.targeting) s3.targeting=patch.targeting;
    if(patch.segmentation!==null && (s3.segmentation||'')===base.segmentation) s3.segmentation=patch.segmentation;
    if(patch.positioning && (s3.positioning||'')===base.positioning) s3.positioning=patch.positioning;
    ['route','product','price','place','promotion'].forEach(k=>{
      if(patch.mix[k]!==undefined && (mix[k]||'')===base.mix[k]) mix[k]=patch.mix[k];
    });
    w.lastAggregated=new Date().toISOString();
    autosave();
  }
  void Work5._auto4C();
  if(changed) Work5.rerender('plan');
  return changed;
};

/* ---------- 4C（2026-09-01 决策 2：进入即预生成 + 手动重生成） ---------- */
Work5._gen4C=async function(signal){
  const m=state.work5.ch4_mix;
  const sys='你是营销顾问。把 4P 转为 4C：Customer Value 来自 Product、Customer Cost 来自 Price（含时间/心理成本）、Convenience 来自 Place、Communication 来自 Promotion（双向沟通而非单向推送）。输出 JSON: {"customerValue":"","customerCost":"","convenience":"","communication":""}。每项 3-5 行要点，每行一个要点；不要标题、不要 markdown 装饰、不要编号、不得改变事实与数字。'+Work5._humanRule;
  const user=`Product: ${m.product}\nPrice: ${m.price}\nPlace: ${m.place}\nPromotion: ${m.promotion}`;
  const r=await API.callJson(Work5._msgs(sys, user, ['ch4_mix']),{signal});
  if(r){
    ['customerValue','customerCost','convenience','communication'].forEach(k=>{
      if(r[k]) m[k]=Work5.normalizeBullets(r[k]);
    });
  }
  return r;
};
Work5.convert4C=async function(button){
  return Work5._run(button,'4C转换', async signal=>{
    const r=await Work5._gen4C(signal);
    if(r){ autosave(); Work5.rerender('plan'); }
  });
};

/* ---------- 4P 摘要表（2026-09-01 决策 4：IEEE 风格表 + AI 总结） ---------- */
// 幂等补齐 pTable（旧存档无此字段；嵌套合并，符合 AGENTS.md 迁移约定）
Work5.healPTable=function(){
  const m=state.work5.ch4_mix||(state.work5.ch4_mix={});
  const blank=()=>({core:'',actions:'',nums:''});
  const pt=(m.pTable&&typeof m.pTable==='object')?m.pTable:{};
  ['product','price','place','promotion'].forEach(k=>{
    pt[k]=Object.assign(blank(),(pt[k]&&typeof pt[k]==='object')?pt[k]:{});
  });
  m.pTable=pt;
  return pt;
};
Work5.fourPTableBlock=function(container){
  const pt=Work5.healPTable();
  const cell=(r,k)=>el('td',{contenteditable:'true',
    oninput:e=>{r[k]=Work5.readEd(e.target);autosave();}}, r[k]||'');
  const t=el('table',{class:'paper-tbl'},
    el('thead',{},el('tr',{},...['要素','核心策略','关键举措','关键数字 / 依据'].map(h=>el('th',{},h)))),
    el('tbody',{},...[['product','产品'],['price','价格'],['place','渠道'],['promotion','促销']].map(([k,zh])=>{
      const r=pt[k];
      return el('tr',{},el('td',{class:'elem'},zh),cell(r,'core'),cell(r,'actions'),cell(r,'nums'));
    }))
  );
  container.appendChild(el('div',{class:'fourp-table'},
    el('div',{class:'tbl-caption'},'表 4-1 营销组合 4P 摘要'),
    t));
};
Work5.aiSummary4P=async function(button){
  return Work5._run(button,'4P摘要', async signal=>{
    const m=state.work5.ch4_mix;
    const keys=['product','price','place','promotion'].filter(k=>(m[k]||'').trim());
    if(!keys.length){ showToast('请先导入或填写 4P'); return; }
    const sys='你是策划书编辑。把营销组合 4P 各要素总结为表格行，输出 JSON: {"product":{"core":"核心策略一句话（不超过 30 字）","actions":"关键举措，最多 3 行，每行以 · 开头","nums":"关键数字或依据，没有则写 —"},"price":{...},"place":{...},"promotion":{...}} 四个键同构。不得改变事实与数字。'+Work5._humanRule;
    const user=keys.map(k=>k+': '+m[k]).join('\n\n');
    const r=await API.callJson(Work5._msgs(sys, user, ['ch4_mix']),{signal});
    if(r){
      const pt=Work5.healPTable();
      ['product','price','place','promotion'].forEach(k=>{
        if(r[k]&&typeof r[k]==='object'){
          pt[k]={core:String(r[k].core||''),actions:Work5.normalizeBullets(String(r[k].actions||'')),nums:String(r[k].nums==null?'':r[k].nums)};
        }
      });
      autosave(); Work5.rerender('plan');
    }
  });
};
// 4P 摘要表导出 MD（与视图同构）
Work5.fourPTableMd=function(){
  const pt=((state&&state.work5&&state.work5.ch4_mix)||{}).pTable||{};
  const rows=[['product','产品'],['price','价格'],['place','渠道'],['promotion','促销']];
  if(!rows.some(([k])=>pt[k]&&((pt[k].core||'').trim()||(pt[k].actions||'').trim()||(pt[k].nums||'').trim()))) return '';
  const esc=s=>String(s==null?'':s).replace(/\|/g,'\\|').replace(/\r?\n/g,'；');
  const lines=['| 要素 | 核心策略 | 关键举措 | 关键数字 / 依据 |','| --- | --- | --- | --- |'];
  rows.forEach(([k,zh])=>{
    const r=pt[k]||{};
    lines.push('| '+zh+' | '+esc(r.core)+' | '+esc(r.actions)+' | '+esc(r.nums)+' |');
  });
  return lines.join('\n');
};

// W4 媒介预算横条图（2026-09-01 决策 4：能图不言）
Work5.budgetBarBlock=function(container){
  const adv=(((state&&state.work4)||{}).promotion||{}).advertising||[];
  if(!adv.length){
    container.appendChild(el('div',{class:'warning'},'Work 4 尚未完成媒介预算组合。',
      el('button',{class:'ghost small',onclick:()=>{ if(typeof App!=='undefined'&&App.goWork) App.goWork(4); }},'去 Work 4 完成 →')));
    return;
  }
  const max=Math.max(...adv.map(a=>a.budgetShare||0),1);
  const rows=[...adv].sort((a,b)=>(b.budgetShare||0)-(a.budgetShare||0));
  const plate=el('section',{class:'plate'});
  plate.appendChild(el('span',{class:'plate-label'},
    '媒介预算构成 · budgetShare 合计 '+rows.reduce((s,a)=>s+(a.budgetShare||0),0)));
  rows.forEach(a=>{
    plate.appendChild(el('div',{class:'budget-row'},
      el('span',{class:'budget-name'},a.media||'—'),
      el('span',{class:'budget-track'},
        el('span',{class:'budget-fill',style:{width:Math.max(2,(a.budgetShare||0)/max*100)+'%'}})),
      el('span',{class:'budget-val'},(a.budgetShare!=null?a.budgetShare:'—')+'%')
    ));
    if((a.message||'').trim()||(a.kpi||'').trim()){
      plate.appendChild(el('div',{class:'budget-note'},
        (a.message||'')+((a.message&&a.kpi)?'（KPI：'+a.kpi+'）':(a.kpi?('KPI：'+a.kpi):''))));
    }
  });
  container.appendChild(plate);
  container.appendChild(Work5.syncedBadge(4));
};

/* 4P 润色（wayfinder T04 的 C）：逐 P 调 LLM，输出受格式约束，
   normalizeBullets 兜底——不得合并/删除要点、不得引入 markdown。 */
Work5.aiPolish4P=async function(button){
  const keys=['product','price','place','promotion'].filter(k=>(state.work5.ch4_mix[k]||'').trim());
  if(!keys.length){ showToast('请先导入或填写 4P'); return; }
  const task=Runner.start({id:'work5-polish-4p',label:'润色 4P',button,total:keys.length,pausable:true,
    onPause:()=>autosave(), onResume:()=>{}});
  if(!task) return;
  const sys='你是策划书编辑。把给定的营销组合要点润色得专业通顺，保持结构不变：每节第一行是主题句，其后每行一个要点（以 · 开头）。不要输出标题、不要 markdown 装饰、不要合并或删除要点、不得改变事实与数字。直接输出润色后的纯文本要点。'+Work5._humanRule;
  for(const k of keys){
    if(task.aborted) break;
    try{
      const text=await API.call([{role:'system',content:sys},{role:'user',content:state.work5.ch4_mix[k]}],{signal:task.controller.signal});
      if(text){ state.work5.ch4_mix[k]=Work5.normalizeBullets(text); autosave(); }
    }catch(e){ if(task.aborted || (e&&e.name==='AbortError')) break; console.warn(e); }
    task.done++; Runner.renderUI();
    try{ await Runner.checkpoint(); }catch{ break; }
  }
  Runner.finish();
  Work5.rerender('plan');
};

Work5.aiOutlook=async function(button){
  return Work5._run(button,'总结展望', async signal=>{
    const sys='你是品牌战略顾问。基于前四章生成总结与展望 300-500 字，包含核心战略复盘、关键风险与应对、6/12/24 月阶段性目标。'+Work5._humanRule;
    const reEval=(state.work2&&state.work2.decision&&state.work2.decision.tier1&&state.work2.decision.tier1.reEvalTrigger)||'';
    const user='SBU:'+(((state.work1||{}).sbu||{}).name||'')
      +'\n目标市场:'+Work5._tier1Name()
      +'\n价值主张:'+((((state.work3||{}).proposition||{}).chosenValueText)||'')
      +'\n产品:'+String(((state.work5.ch4_mix||{}).product||'')).slice(0,200)
      +(reEval?'\n再评估触发:'+reEval:'');
    const text=await API.call(Work5._msgs(sys, user, ['sbu','positioning','ch4_mix']),{signal});
    if(text){ state.work5.ch5_outlook=text; autosave(); Work5.rerender('plan'); }
  });
};

Work5.aiPolish=async function(field,label,button){
  const cur=state.work5[field];
  if(!cur){ showToast('请先填写内容'); return; }
  return Work5._run(button,'润色-'+label, async signal=>{
    const text=await API.call([{role:'system',content:`你是策划书编辑。润色给定的${label}章节，保持事实不变，仅让表达更通顺专业。直接输出润色后的文本。`+Work5._humanRule},
      {role:'user',content:cur}],{signal});
    if(text){ state.work5[field]=text; autosave(); Work5.rerender('plan'); showToast('已润色 '+label); }
  });
};

// Multi-chapter polish: pausable Runner, one unit per chapter.
Work5.aiPolishAll=async function(button){
  const fields=[['ch1_business','业务概况']].filter(([f])=>state.work5[f]);
  if(!fields.length){ showToast('没有可润色的章节'); return; }
  const task=Runner.start({id:'work5-polish-all', label:'润色全文', button, total:fields.length, pausable:true,
    onPause:()=>autosave(), onResume:()=>{}});
  if(!task) return;
  for(const [f,l] of fields){
    if(task.aborted) break;
    try{
      const text=await API.call([{role:'system',content:`你是策划书编辑。润色给定的${l}章节，保持事实不变，仅让表达更通顺专业。直接输出润色后的文本。`+Work5._humanRule},
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
  const sbuName=((state.work1||{}).sbu||{}).name||'';
  const vcLine = Work5.valueChainLine();
  const v1=Work5.valueSummaryMd();
  const d3=Work5.decisionMd(), w2=Work5.weightsMd();
  const p3=Work5.painMapMd(), t3=Work5.topicsMd();
  const c4=Work5.channelMd(), m4=Work5.mediaMd();
  const tblMd=Work5.fourPTableMd();
  const env=w.ch2_environment||{};
  const s3=w.ch3_strategy||{};
  const mix=w.ch4_mix||{};
  const part=(...xs)=>xs.filter(x=>x!=null&&String(x).trim()!=='').join('\n\n');
  return part(
    '## V. 策划书正文',
    '# '+(sbuName?sbuName+' 品牌策划书':'品牌策划书'),
    '> 上游成稿：'+Work5.upstreamLine(),
    part('## 1 业务与市场（来自 Work 1）',
      part('### 1.1 企业与业务概况', w.ch1_business||'（待完成）',
        vcLine?('价值链定位：'+vcLine):''),
      part('### 1.2 品牌价值体系', v1||'（Work 1 尚未完成指标体系评分）')),
    part('## 2 环境分析（来自 Work 1）',
      part('### 2.1 PEST',
        ['- 政治：'+(env.political||'（待完成）'),
         '- 经济：'+(env.economic||'（待完成）'),
         '- 社会：'+(env.social||'（待完成）'),
         '- 技术：'+(env.technological||'（待完成）')].join('\n')),
      part('### 2.2 SWOT',
        ['| 优势 S | 劣势 W |','|---|---|',
         '| '+((env.strengths||[]).join('；')||'—')+' | '+((env.weaknesses||[]).join('；')||'—')+' |',
         '| **机会 O** | **威胁 T** |',
         '| '+((env.opportunities||[]).join('；')||'—')+' | '+((env.threats||[]).join('；')||'—')+' |'].join('\n'))),
    part('## 3 市场选择与定位（来自 Work 2 / Work 3）',
      part('### 3.1 市场吸引力 × 竞争力矩阵','（矩阵图见应用内视图；评分与切分由 Work 2 驱动）'),
      part('### 3.2 三档决策卡', d3||'（Work 2 尚未完成三档决策）', w2),
      part('### 3.3 客户痛点地图', p3||'（Work 3 尚未完成卖点挖掘）', t3),
      part('### 3.4 卖点矩阵与排名', Work5.rankingTableMd()||'（Work 3 尚未完成卖点评分）'),
      part('### 3.5 STP',
        '#### 细分 S\n'+(s3.segmentation||'（待完成）'),
        '#### 目标 T\n'+(s3.targeting||'（待完成）'),
        '#### 定位 P\n'+(s3.positioning||'（待完成）'))),
    part('## 4 营销组合（来自 Work 4）',
      part('### 4.1 增长路径', mix.route||'（待完成）'),
      part('### 4.2 4P 摘要表', tblMd||'（未生成：在 4.2 节点「AI 总结 4P 表」）',
        '### 4.2.1 4P 详述',
        '#### 产品\n'+(mix.product||'（待完成）'),
        '#### 价格\n'+(mix.price||'（待完成）'),
        '#### 渠道\n'+(mix.place||'（待完成）'),
        '#### 促销\n'+(mix.promotion||'（待完成）')),
      part('### 4.3 渠道结构', c4||'（Work 4 尚未完成渠道结构）'),
      part('### 4.4 媒介预算构成', m4||'（Work 4 尚未完成媒介预算组合）'),
      part('### 4.5 4C',
        '- **客户价值**：'+(mix.customerValue||'（待生成）'),
        '- **客户成本**：'+(mix.customerCost||'（待生成）'),
        '- **客户便利**：'+(mix.convenience||'（待生成）'),
        '- **客户沟通**：'+(mix.communication||'（待生成）'))),
    part('## 5 总结与展望', w.ch5_outlook||'（待完成）')
  );
};

// 2026-09-01 候选 4：迁移注册契约（无迁移，仅声明 workKey）
Work5.workKey = 'work5';
