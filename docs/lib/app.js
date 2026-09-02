/* ============================================================
 App — 2026-09-01 架构评审候选 4：从 global-brand-building.html 内联脚本抽出。
 依赖均为运行时全局（el / state / saveNow / Archive / App 等），浏览器可用，
 node 测试通过注入对应 stub 直接命中接口。
 ============================================================ */
(function(){
 'use strict';

const App = {
  currentWork:1, currentStep:1,
  // 2026-09-01：work2 毒切片自愈。实测存档里出现过 work2:false（重构期间中间
  // 版本代码写坏），三个 render 在首次 append 前就抛 TypeError，goStep 的
  // try/catch 吞掉 → 步骤区空白无提示，2 分钟自动保存再把毒数据固化进存档。
  // renderAll 是所有 state 替换路径（init/案例/历史/导入/重置）的必经点。
  healWork2(st){
    if(st && st.work2 && typeof st.work2==='object' && !Array.isArray(st.work2)) return false;
    st.work2 = (typeof Work2!=='undefined' && Work2.defaultData) ? Work2.defaultData() : {};
    return true;
  },
  async init(){
    // 1. Backend is mandatory — block with instructions if unreachable.
    const ok = await Backend.health();
    if(!ok){
      $('#backendBlocker').classList.add('open');
      return;
    }
    // 2. Config from server (source of truth for API settings).
    let cfg = {...DEFAULT_SETTINGS, apiKeyExists:false};
    try{ cfg = await (await fetch(apiUrl('/api/config'))).json(); }catch{}
    state = defaultState();
    state.settings.api = {...cfg, apiKey: cfg.apiKeyExists ? '********' : ''};
    // 3. Load state from server; first run migrates legacy localStorage data.
    let data = await Store.load();
    if(!data){
      data = await Store.migrateFromLocalStorage();
      if(data) showToast('已将浏览器本地数据迁移到服务器');
    }
    if(data){
      const keepApi = state.settings.api;
      state = mergeWithDefaults(data);
      state.settings.api = keepApi;  // server config wins over saved copy
      // 2026-08-26: demoSnapshot 现在是合法持久化字段（案例沙箱快照）。
      // 刷新后若在案例中（demoCase+demoSnapshot 都在），保留现场，
      // 由用户点「退出案例」主动还原——旧版"存在即污染"守卫已移除。
    }
    // 4. 未保存时关闭/刷新 → 浏览器原生确认弹窗。
    window.addEventListener('beforeunload', e=>{
      if(dirty){
        e.preventDefault();
        e.returnValue='';
      }
    });
    // 5. 初始保存状态（与服务器数据一致 = 已保存）
    dirty = false;
    const ss0=$('#saveStatus');
    if(ss0 && !state.meta.isDemo) ss0.textContent='已保存';
    // 5.6 案例数据新鲜度（2026-09-02）：「保留现场」只在案例源数据未变时成立；
    // 案例更新过则重载案例内容，否则案例修复永远到不了补丁前已打开的页面。
    try{ this.refreshCaseIfStale(state); }catch(e){ console.warn('[case refresh]', e); }
    // 5.5 每 2 分钟自动保存：仅在有改动时覆盖原档案（/api/state），不新建版本。
    setInterval(()=>{ if(dirty && state) saveNow(); }, 120000);
    // 6. Render.
    this.renderAll();
    this.bindKeys();
    this.updateSummary();
    const bt=document.getElementById('buildTag');
    if(bt && typeof Work1!=='undefined' && Work1.BUILD) bt.textContent='b:'+Work1.BUILD;
    // 6. Init multi-case demo menu (with deferred fallback if DOMContentLoaded
    //    fires before all module scripts attach).
    if(typeof DemoMenu!=='undefined' && typeof DemoMenu.init==='function'){
      try{ DemoMenu.init(); }catch(e){ console.error('[DemoMenu.init] failed:', e); }
    } else {
      // DemoMenu not yet defined — try again shortly.
      setTimeout(()=>{ if(typeof DemoMenu!=='undefined'){ try{ DemoMenu.init(); }catch(e){ console.error(e); } } }, 50);
    }
  },
  bindKeys(){
    document.addEventListener('keydown', e=>{
      if((e.ctrlKey||e.metaKey) && e.key>='1' && e.key<='5'){
        e.preventDefault(); this.goWork(parseInt(e.key));
      }
      if((e.ctrlKey||e.metaKey) && e.key.toLowerCase()==='s'){
        e.preventDefault(); SavePanel.open();
      }
    });
  },
  goWork(n){
    // 切 tab 不写服务器（数据在内存，切换不丢；由 2 分钟周期保存兜底）
    this.currentWork=n;
    state.meta.currentWork = n;
    $$('.workshop').forEach(s=>s.classList.toggle('active', +s.dataset.workshop===n));
    $$('.tab').forEach(t=>t.classList.toggle('active', +t.dataset.work===n));
    this.renderSubtabs(n);
    this.bindSubtabs();
    // default step
    const first = this.workshopSteps(n)[0]?.id || 1;
    this.goStep(first);
    // 2026-09-01 wayfinder T03：进入 W5 即同步上游章节（覆盖前自动存档，见 Work5.autoSync）。
    if(n===5){
      try{
        if(typeof Work5!=='undefined' && typeof Work5.autoSync==='function' && !(state&&state.meta&&state.meta.isDemo)){
          Promise.resolve(Work5.autoSync()).catch(e=>console.warn('[W5 autoSync]', e));
        }
      }catch(e){ console.warn('[W5 autoSync hook]', e); }
    }
    window.scrollTo({top:0,behavior:'smooth'});
  },
  renderSubtabs(n){
    const bar = $('#subtabsBar');
    if(!bar) return;
    bar.innerHTML='';
    const mod={1:Work1,2:Work2,3:Work3,4:Work4,5:Work5}[n];
    if(!mod || !mod.steps || mod.steps.length<=1){
      bar.style.display='none';
      return;
    }
    bar.style.display='';
    mod.steps.forEach(s=>{
      const m = s.label.match(/^(\S+)\s+(.+)$/);
      const num = m?m[1]:'';
      const txt = m?m[2]:s.label;
      // 决策 10：work1 指标步骤显示已回填实测分角标
      let badge=null;
      if(mod===Work1 && s.id==='metrics'){
        const n=(state.work1?.metrics?.dimensions||[]).reduce((a,d)=>
          a+(d.secondaries||[]).reduce((x,s2)=>x+(s2.actual!=null?1:0),0),0);
        if(n>0) badge=el('span',{class:'subtab-badge'},'回填 '+n);
      }
      const b = el('button',{class:'subtab',type:'button','data-target':s.id},
        num ? el('span',{class:'sub-num'},num) : null,
        txt,
        badge
      );
      bar.appendChild(b);
    });
    this.subtabMod = mod;
  },
  bindSubtabs(){
    if(this._subtabBound) return;
    this._subtabBound = true;
    const bar = $('#subtabsBar');
    if(!bar) return;
    bar.addEventListener('click', e=>{
      const btn = e.target.closest('.subtab');
      if(!btn) return;
      const id = btn.dataset.target;
      this.goStep(id);
    });
  },
  workshopSteps(n){
    const mod={1:Work1,2:Work2,3:Work3,4:Work4,5:Work5}[n];
    return mod.steps;
  },
  goStep(id){
    // Single-page mode: only one .step is .active inside the active workshop.
    if(!this.currentWork) return;
    const wMod={1:Work1,2:Work2,3:Work3,4:Work4,5:Work5}[this.currentWork];
    if(!wMod) return;
    const validIds = wMod.steps.map(s=>s.id);
    if(!validIds.includes(id)) return;
    this.currentStep=id;
    state.meta.currentStep = id;
    const wEl = document.querySelector(`.workshop[data-workshop="${this.currentWork}"]`);
    if(!wEl) return;
    $$('.step', wEl).forEach(s=>s.classList.toggle('active', s.dataset.step===id));
    $$('#subtabsBar .subtab').forEach(t=>t.classList.toggle('active', t.dataset.target===id));
    // 2026-08-28：切步时重渲染目标步。step 内容依赖上游步状态（evaluate 的
    // 「未保留市场」警告等），只切 .active 会一直显示旧渲染；renderStep 的
    // RENDER_VERSION 缓存路径最终也走全量重渲染，无循环风险。
    try{ if(wMod && wMod.renderStep) wMod.renderStep(id); }
    catch(e){ console.error('[goStep render] W'+this.currentWork+'.'+id+' failed:', e); }
    // scroll to top of step area (below the subtab nav)
    const bar = $('#subtabsBar');
    const yOffset = bar ? -bar.offsetHeight - 8 : 0;
    const top = wEl.getBoundingClientRect().top + window.scrollY + yOffset;
    window.scrollTo({top, behavior:'smooth'});
  },
  renderAll(){
    if(this.healWork2(state)) showToast('Workshop 2 数据已损坏，已重置为空白模板。', 3200);
    // 2026-08-26: 载入案例 = 可编辑可保存（去掉只读锁）。
    // 用户导入案例后要基于案例编辑自己的策划，不再锁死 step 面板。
    // 保留 isDemo 用于横幅显示"当前案例"，但不设 inert。
    // const locked=!!state.meta.isDemo;
    // [1,2,3,4,5].forEach(n=>{ const el=$('#steps'+n); if(el) el.inert=locked; });
    // lock top-bar mode switch in demo read-only mode
    // const sw=document.getElementById('modeSwitch');
    // if(sw) sw.querySelectorAll('button').forEach(b=>b.disabled=locked);
    // const gear=document.getElementById('settingsGear');
    // if(gear) gear.disabled=locked;
    if(typeof Settings!=='undefined') Settings.renderModeSwitch();
    [1,2,3,4,5].forEach(n=>{
      const mod={1:Work1,2:Work2,3:Work3,4:Work4,5:Work5}[n];
      const steps=$(`#steps${n}`); steps.innerHTML='';
      mod.steps.forEach((s, i)=>{
        // Only the first sub-step starts active; others hidden until subtab click
        const sec=el('section',{class:'step'+(i===0?' active':''),'data-step':s.id});
        steps.appendChild(sec);
      });
    });
    // 决策 3：渲染前幂等回填实测分（载入 state/案例/History 恢复后 Δ 不再全空）
    if(typeof Work1!=='undefined' && Work1.backfillScores){
      try{ Work1.backfillScores(); }catch(e){ console.error('[backfillScores] failed:', e); }
    }
    // Render ALL sub-steps for every workshop (long-doc展开)
    [1,2,3,4,5].forEach(n=>{
      const mod={1:Work1,2:Work2,3:Work3,4:Work4,5:Work5}[n];
      mod.steps.forEach(s=>{
        try { if(mod.renderStep) mod.renderStep(s.id); }
        catch(e){ console.error('[renderStep] W'+n+'.'+s.id+' failed:', e); }
      });
    });
    // Restore the user's last position (persisted in meta), defaulting to
    // workshop 1 / its first step when no position was saved yet.
    const w = [1,2,3,4,5].includes(state.meta.currentWork) ? state.meta.currentWork : 1;
    // Read the persisted step BEFORE goWork(): goWork() internally calls
    // goStep(first) which overwrites state.meta.currentStep with the first
    // step's id — reading after it would always restore the first step.
    const st = state.meta.currentStep;
    this.goWork(w);
    if(st && this.workshopSteps(w).some(s=>s.id===st)) this.goStep(st);
    // 2026-08-28：刷新顶栏「当前档案」标签（meta.loadedFrom / demoCase 状态）
    this.updateArchiveLabel();
  },
  updateSummary(){
    const sbu=state.work1?.sbu?.name||'';
    const tiers=(typeof Work2!=='undefined'&&Work2.selectedTiers)?Work2.selectedTiers():{tier1:null};
    const mkt=tiers.tier1?.name||'';
    const val=state.work3?.proposition?.chosenValueText||state.work3?.candidates?.find(c=>c.selected)?.name||'';
    $('#sumSbu').textContent=sbu||'— 未填写';
    $('#sumMarket').textContent=mkt||'— 未填写';
    $('#sumValue').textContent=val||'— 未填写';
    const be=$('#sumBackend');
    if(backendOnline){ be.textContent='已连接'; be.style.color='var(--color-accent)'; }
    else{ be.textContent='未连接'; be.style.color='var(--color-warn)'; }
  },
  // 2026-08-28：顶栏「当前档案」标签驱动。来源：meta.loadedFrom（History 加载）
  // 或 meta.demoCase（在案例里时）。无源时隐藏。
  updateArchiveLabel(){
    const el=$('#archiveLabel'); const txt=$('#archiveLabelText'); const btn=$('#archiveRenameBtn');
    if(!el || !txt || !btn) return;
    const m=state?.meta;
    if(m?.demoCase){
      txt.textContent='当前案例：'+m.demoCase;
      btn.hidden=true;            // 案例不可重命名
      el.hidden=false;
    }else if(m?.loadedFrom){
      txt.textContent='当前：'+m.loadedFrom;
      btn.hidden=false;
      btn.onclick=()=>{ if(m.loadedFromId && typeof History!=='undefined') History.rename(m.loadedFromId); };
      el.hidden=false;
    }else{
      el.hidden=true;
    }
  },
  save(manual){ save(manual); },
  async reset(){
    if(!confirm('确定清空全部内容并重置？当前内容会先自动存档，可在「历史记录」恢复。')) return;
    // Archive current state before wiping — reset is recoverable via History.
    try{
      await saveNow();
      await Archive.create({name:'重置前存档 '+new Date().toLocaleString()});
    }catch{}
    const keepApi=state.settings.api;
    state=defaultState();
    state.settings.api=keepApi;
    await saveNow();
    this.renderAll();
    this.updateSummary();
    this.updateArchiveLabel();
    showToast('已重置');
  },
  // —— 案例数据指纹（2026-09-02）——
  // 进入案例时把 5 个 work 的序列化指纹存 meta.caseFp；刷新后重算指纹，
  // 不一致 = 案例源数据更新过 → 重载案例内容。修复「保留现场」语义的盲区：
  // 案例补丁永远到不了补丁前就已进入案例的浏览器（用户反馈：评分空白、
  // 硬刷新无效）。demoSnapshot 不动，退出案例仍回进入前的工作区。
  caseFp(loaded){
    const j=JSON.stringify([loaded.work1,loaded.work2,loaded.work3,loaded.work4,loaded.work5]);
    let h=5381;
    for(let i=0;i<j.length;i++) h=((h<<5)+h+j.charCodeAt(i))|0;
    return h;
  },
  // 进入案例与刷新重载共用的同一套载入语义（2026-09-01：work4/5 必须整体
  // 替换——合并会混入进入前工作区内容；work1-3 合并、旧 schema 运行时迁移）。
  applyCaseWorks(st, loaded){
    if(loaded.work1) Object.assign(st.work1, loaded.work1);
    if(loaded.work2) Object.assign(st.work2, loaded.work2);
    if(loaded.work3) Object.assign(st.work3, loaded.work3);
    st.work4 = loaded.work4;
    st.work5 = loaded.work5;
    if(typeof runSchemaMigrations==='function') runSchemaMigrations(st);
  },
  refreshCaseIfStale(st){
    const m=st.meta;
    if(!m.demoCase) return false;
    if(typeof Cases==='undefined' || !Cases.has || !Cases.has(m.demoCase)) return false;
    let loaded;
    try{ loaded=Cases.load(m.demoCase); }catch(e){ return false; }
    if(!loaded) return false;
    const fp=this.caseFp(loaded);
    if(fp === m.caseFp) return false;   // 案例未更新：保留现场（含案例内编辑）
    this.applyCaseWorks(st, loaded);
    m.caseFp=fp;
    saveNow();
    return true;
  },
  async toggleDemo(caseKey){
    // 进入/退出案例 = 沙箱语义（2026-08-26 回归修复）：
    // 进入前 deep-clone 存快照（demoSnapshot）；退出时恢复快照，回到进入前的内容与 step。
    // 看案例期间仍可编辑可保存（改动存版本后可恢复）；点「退出案例」丢弃案例数据回到自己的工作区。
    if(state.meta.demoCase){
      // —— 退出案例：恢复进入前的快照 ——
      if(state.meta.demoSnapshot){
        const keepApi=state.settings.api;
        state=JSON.parse(JSON.stringify(state.meta.demoSnapshot));
        state.settings.api=keepApi;
        state.meta.demoCase=null;
        state.meta.demoSnapshot=null;
        state.meta.isDemo=false;
        await saveNow();
      }else{
        // 无快照兜底（旧数据）：仅清除标记
        state.meta.demoCase=null;
        state.meta.demoSnapshot=null;
        state.meta.isDemo=false;
      }
      $('#demoBanner').classList.remove('show');
      $('#demoBtn').textContent='载入案例 ▼';
      document.body.classList.remove('is-demo');
      // 2026-08-28：退出案例 → 恢复原档案绑定（snap 里有就回写）
      if(state.meta.loadedFrom == null && state.meta.demoSnapshot?.meta?.loadedFrom){
        state.meta.loadedFrom = state.meta.demoSnapshot.meta.loadedFrom;
        state.meta.loadedFromId = state.meta.demoSnapshot.meta.loadedFromId;
      }
    }else{
      // —— 进入案例 ——
      if(!caseKey){
        if(typeof DemoMenu!=='undefined') DemoMenu.open();
        return;
      }
      // 先存档当前工作区（可恢复），再 deep-clone 快照供退出还原。
      await saveNow();
      const snap=JSON.parse(JSON.stringify(state));
      // 2026-09-01 候选 3：cases/bundle.js + loader 是唯一案例来源，旧 DemoData 已删。
      if(typeof Cases==='undefined' || !Cases.has(caseKey)){
        showToast('演示案例加载失败：'+caseKey);
        return;   // 快照丢弃，state 未被改动
      }
      const loaded = Cases.load(caseKey);
      if(!loaded){
        showToast('演示案例加载失败：'+caseKey);
        return;
      }
      this.applyCaseWorks(state, loaded);
      state.meta.caseFp = this.caseFp(loaded);   // 刷新后用于检测案例数据是否更新
      state.meta.demoSnapshot=snap;
      state.meta.isDemo=false;
      state.meta.demoCase=caseKey;
      // 2026-08-28：进入案例时清掉档案名（案例自己当档案名驱动导出）。
      state.meta.loadedFrom=null;
      state.meta.loadedFromId=null;
      // 2026-09-01：进入/切换案例 → 从案例起点看起（work1 第 1 步）。
      // 旧 keepWork 会停留在切换案例前的页面（如 workshop4 路径），
      // 页面不换、数据被换 → 看起来像"原内容被强制覆盖"。
      if(typeof Work1!=='undefined' && Work1.steps && Work1.steps[0]){
        state.meta.currentWork = 1;
        state.meta.currentStep = Work1.steps[0].id;
      }
      $('#demoBanner').classList.add('show');
      $('#demoBannerText').textContent = '当前案例：'+(caseKey||'')+' · 可编辑可保存 · 点「退出案例」回到进入前内容';
      $('#demoBtn').textContent='退出案例';
      document.body.classList.remove('is-demo');
    }
    this.renderAll();
    this.updateSummary();
    // 退出案例：renderAll 已按快照的 meta 恢复原 work/step（回到进入前的位置与内容）。
    // 进入案例：已导航到案例起点，滚动回顶部。
    if(state.meta.demoCase){
      requestAnimationFrame(()=>{
        window.scrollTo({top: 0, left: 0, behavior: 'instant'});
      });
    }
  },
  exportMd(){
    // 2026-09-01 候选 4：纯逻辑在 MarkdownExchange.buildExportMarkdown（可测试）。
    const { markdown, filename } = (typeof MarkdownExchange!=='undefined' && MarkdownExchange.buildExportMarkdown)
      ? MarkdownExchange.buildExportMarkdown({
          state,
          workExports: {
            work1: Work1.exportMd?.()||'',
            work2: Work2.exportMd?.()||'',
            work3: Work3.exportMd?.()||'',
            work4: Work4.exportMd?.()||'',
            work5: Work5.exportMd?.()||''
          }
        })
      : { markdown:'', filename:'brand-workshop.md' };
    const blob=new Blob([markdown],{type:'text/markdown;charset=utf-8'});
    const a=el('a',{href:URL.createObjectURL(blob),download:filename});
    a.click(); URL.revokeObjectURL(a.href);
  },
  importMd(){
    const inp=el('input',{type:'file',accept:'.md,.markdown,.txt'});
    inp.addEventListener('change', async ()=>{
      const file=inp.files[0]; if(!file) return;
      const text=await file.text();
      const parsed = (typeof MarkdownExchange!=='undefined' && MarkdownExchange.parseEmbeddedMarkdown)
        ? MarkdownExchange.parseEmbeddedMarkdown(text)
        : { ok:false, reason:'MarkdownExchange 未加载' };
      if(!parsed.ok){
        showToast(parsed.reason === 'no embedded data block' ? '无法识别：文件中没有嵌入的数据块'
          : (parsed.reason === 'data block parse failed' ? '数据块解析失败' : '导入失败'));
        return;
      }
      if(!confirm('导入将覆盖当前全部内容（当前内容会先自动存档）。继续？')) return;
      try{
        // Archive current before overwriting — import is recoverable via History.
        await saveNow();
        await Archive.create({name:'导入前存档 '+new Date().toLocaleString()});
        const keepApi=state.settings.api;
        state=mergeWithDefaults(parsed.state);
        state.settings.api=keepApi;  // never import API config from a file
        state.meta.isDemo=false;
        state.meta.demoCase=null;
        $('#demoBanner').classList.remove('show');
        $('#demoBtn').textContent='载入案例 ▼';
        document.body.classList.remove('is-demo');
        await saveNow();
        this.renderAll();
        this.updateSummary();
        showToast('导入完成');
      }catch(e){ showToast('导入失败: '+e.message); }
    });
    inp.click();
  }
};

 if(typeof window!=='undefined') window.App = App;
 if(typeof module!=='undefined' && module.exports) module.exports = App;
})();
