/* ============================================================
 SavePanel — 2026-09-01 架构评审候选 4：从 global-brand-building.html 内联脚本抽出。
 依赖均为运行时全局（el / state / saveNow / Archive / App 等），浏览器可用，
 node 测试通过注入对应 stub 直接命中接口。
 ============================================================ */
(function(){
 'use strict';

const SavePanel = {
  open(){
    // BIZ02：案例 = 只读浏览，版本面板一并锁住（旧注释时代用 isDemo 拦保存，
    // 2026-08-26 移除后案例可编辑；现按决策恢复为只读）。
    if(state?.meta?.isDemo){ showToast('案例浏览中：不可存档'); return; }
    $('#savePopup').classList.add('open');
    const inp=$('#saveName');
    inp.value='';
    setTimeout(()=>inp.focus(), 0);
    document.addEventListener('keydown', this._key);
    document.addEventListener('click', this._outside);
  },
  cancel(){
    $('#savePopup').classList.remove('open');
    document.removeEventListener('keydown', this._key);
    document.removeEventListener('click', this._outside);
  },
  _key(e){
    if(e.key==='Escape') SavePanel.cancel();
  },
  _outside(e){
    const pop=$('#savePopup');
    if(pop.contains(e.target) || (e.target.id==='saveBtn')) return;
    SavePanel.cancel();
  },
  async commit(){
    if(!$('#savePopup').classList.contains('open')) return;
    const name=$('#saveName').value.trim();
    this.cancel();
    try{
      const persisted=await saveNow();
      if(!persisted) return;  // Store.save 已弹出失败提示
      // 同名版本：先问用户覆盖还是另存（覆盖会替换旧内容，需明确同意）
      let overwrite=false;
      if(name){
        try{
          const snaps=await Archive.list();
          if(snaps.some(s=>s.type==='named' && s.name===name)){
            overwrite=confirm('已存在同名版本「'+name+'」。\n确定 → 覆盖该版本（旧内容将被替换）\n取消 → 另存为新版本（自动加后缀）');
          }
        }catch{}
      }
      const snap=await Archive.create({name, overwrite});
      showToast(name? '已存档 · '+snap.name : '已保存 · '+snap.name);
    }catch(e){ showToast('存档失败: '+e.message); }
  }
};

 if(typeof window!=='undefined') window.SavePanel = SavePanel;
 if(typeof module!=='undefined' && module.exports) module.exports = SavePanel;
})();
