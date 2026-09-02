/* ============================================================
 History — 2026-09-01 架构评审候选 4：从 global-brand-building.html 内联脚本抽出。
 依赖均为运行时全局（el / state / saveNow / Archive / App 等），浏览器可用，
 node 测试通过注入对应 stub 直接命中接口。
 ============================================================ */
(function(){
 'use strict';

const History = {
  async open(){
    $('#historyModal').classList.add('open');
    await this.render();
  },
  close(){ $('#historyModal').classList.remove('open'); },
  async render(){
    const seq=(this._seq||0)+1; this._seq=seq;  // 快速输入/连续操作时丢弃过期请求，避免行重复
    const list=$('#snapList'); list.innerHTML='';
    let snaps=[];
    try{ snaps=await Archive.list(); }catch{}
    if(seq!==this._seq) return;
    const q=($('#snapSearch').value||'').trim().toLowerCase();
    if(q) snaps=snaps.filter(s=>(s.name||'').toLowerCase().includes(q));
    if(!snaps.length){
      list.appendChild(el('p',{class:'muted'}, q? '没有匹配的版本。' : '还没有历史版本。'));
      return;
    }
    snaps.forEach(s=>{
      const time=new Date(s.created_at*1000).toLocaleString();
      const isTime=s.type==='time';
      list.appendChild(el('div',{class:'expert-row','data-id':s.id},
        el('div',{style:'flex:1;min-width:0'},
          el('div',{class:'snap-name',style:'font-family:var(--font-mono);font-size:13px'}, s.name),
          el('div',{class:'hint'}, isTime? '时间名版本 · 保留最近 10 个' : time+' · 永久保留')
        ),
        el('button',{class:'small','data-act':'load','data-name':s.name,onclick:()=>History.load(s.id)},'加载'),
        el('button',{class:'small',onclick:()=>History.rename(s.id)},'重命名'),
        el('button',{class:'small',onclick:()=>History.del(s.id)},'删除')
      ));
    });
  },
  async rename(id){
    const row=Array.from(document.querySelectorAll('#snapList .expert-row')).find(r=>r.dataset.id===id);
    if(!row) return;
    const nameEl=row.querySelector('.snap-name');
    const inp=el('input',{type:'text',class:'snap-rename',value:nameEl.textContent});
    nameEl.replaceWith(inp);
    inp.focus(); inp.select();
    let finished=false;
    const finish=async saveIt=>{
      if(finished) return; finished=true;
      const v=inp.value.trim();
      if(saveIt && v){
        try{
          // 同名版本：与保存流程一致，先问覆盖还是另存
          let overwrite=false;
          try{
            const snaps=await Archive.list();
            if(snaps.some(s=>s.type==='named' && s.id!==id && s.name===v)){
              overwrite=confirm('已存在同名版本「'+v+'」。\n确定 → 覆盖该版本（旧内容将被替换）\n取消 → 另存为新版本（自动加后缀）');
            }
          }catch{}
          await Archive.rename(id, v, {overwrite});
          // 2026-08-28：重命名的是当前档案 → 同步 meta.loadedFrom + 顶栏标签
          if(state?.meta?.loadedFromId===id){
            state.meta.loadedFrom = v;
            if(typeof App!=='undefined' && App.updateArchiveLabel) App.updateArchiveLabel();
          }
          showToast('已重命名');
        }catch(e){ showToast('重命名失败: '+e.message); }
      }
      this.render();
    };
    const onBlur=()=>finish(false);
    inp.addEventListener('blur', onBlur);
    inp.addEventListener('keydown', e=>{
      if(e.key==='Enter'){ e.preventDefault(); inp.removeEventListener('blur', onBlur); finish(true); }
      else if(e.key==='Escape'){ e.preventDefault(); inp.removeEventListener('blur', onBlur); finish(false); }
    });
  },
  async del(id){
    if(!confirm('删除此版本？此操作不可恢复。')) return;
    try{
      await Archive.remove(id);
      showToast('已删除');
      await this.render();
    }catch(e){ showToast('删除失败: '+e.message); }
  },
  async load(id){
    // 2026-08-26: 一键直载（去掉两步行内确认）。服务端已不自动备份「恢复前备份」，
    // 加载会直接覆盖原档案——点加载前请确认选中的版本。
    const row=Array.from(document.querySelectorAll('#snapList .expert-row')).find(r=>r.dataset.id===id);
    if(!row) return;
    const btn=row.querySelector('button[data-act="load"]');
    if(btn) btn.textContent='加载中…';
    try{
      const data=await Archive.restore(id);
      const keepApi=state.settings.api;
      state=mergeWithDefaults(data);
      state.settings.api=keepApi;
      state.meta.isDemo=false;
      state.meta.demoCase=null;
      state.meta.demoSnapshot=null;
      // 2026-08-28：当前档案 = 刚加载的快照。导出 MD 文件名与顶栏标签都从这里读。
      state.meta.loadedFrom = btn?.dataset.name || id;
      state.meta.loadedFromId = id;
      $('#demoBanner').classList.remove('show');
      $('#demoBtn').textContent='载入案例 ▼';
      document.body.classList.remove('is-demo');
      this.close();
      App.renderAll();
      App.updateSummary();
      App.updateArchiveLabel();
      showToast('已加载版本：'+(btn?.dataset.name||id));
    }catch(e){
      if(btn) btn.textContent='加载';
      showToast('加载失败: '+e.message);
    }
  }
};

 if(typeof window!=='undefined') window.History = History;
 if(typeof module!=='undefined' && module.exports) module.exports = History;
})();
