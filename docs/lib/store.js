/* ============================================================
 Store — 2026-09-01 架构评审候选 4：从 global-brand-building.html 内联脚本抽出。
 依赖均为运行时全局（el / state / saveNow / Archive / App 等），浏览器可用，
 node 测试通过注入对应 stub 直接命中接口。
 ============================================================ */
(function(){
 'use strict';

const Store = {
  projectId: 'default',
  _chain: Promise.resolve(),

  save(stateObj){
    if(!stateObj) return Promise.resolve();
    // 2026-08-26: 载入案例后可编辑可保存。isDemo 不再用于保存闸门。
    // if(stateObj.meta.isDemo){
    //   const ss=$('#saveStatus'); if(ss) ss.textContent='演示模式 · 不会保存';
    //   return Promise.resolve();
    // }
    // Serialize saves — rapid edits must not race the server.
    this._chain = this._chain.then(()=>this._doSave(stateObj)).catch(()=>{});
    return this._chain;
  },

  async _doSave(stateObj){
    stateObj.meta.savedAt = new Date().toISOString();
    try{
      const res = await fetch(apiUrl('/api/state'), {
        method:'PUT', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({project_id:this.projectId, state:stateObj})
      });
      if(res.ok){
        const ss=$('#saveStatus'); if(ss) ss.textContent='已保存 · '+new Date().toLocaleTimeString();
        return true;
      }
      showToast('保存失败: HTTP '+res.status);
      return false;
    }catch(e){ showToast('保存失败: '+e.message); return false; }
  },

  async load(){
    try{
      const res = await fetch(apiUrl('/api/state')+'?project_id='+encodeURIComponent(this.projectId));
      if(!res.ok) return null;  // 404 = no saved state yet
      return await res.json();
    }catch{ return null; }
  },

  // One-time migration: legacy localStorage data (and its plaintext key) → server.
  async migrateFromLocalStorage(){
    try{
      const raw = localStorage.getItem(STORAGE_KEY);
      if(!raw) return null;
      const parsed = JSON.parse(raw);
      const legacyKey = parsed?.settings?.api?.apiKey || '';
      if(legacyKey){
        try{
          const cfg = await (await fetch(apiUrl('/api/config'))).json();
          if(!cfg.apiKeyExists){
            const api = parsed.settings.api;
            await fetch(apiUrl('/api/config'), {method:'PUT', headers:{'Content-Type':'application/json'},
              body: JSON.stringify({
                provider:api.provider||cfg.provider, baseUrl:api.baseUrl||cfg.baseUrl,
                model:api.model||cfg.model, temperature:api.temperature??cfg.temperature,
                backendUrl:api.backendUrl||cfg.backendUrl, apiKey:legacyKey
              })});
          }
        }catch{}
      }
      const merged = mergeWithDefaults(parsed);
      // Never persist a plaintext key inside the state file — masked flag only.
      merged.settings.api.apiKey = legacyKey ? '********' : '';
      await fetch(apiUrl('/api/state'), {method:'PUT', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({project_id:this.projectId, state:merged})});
      localStorage.removeItem(STORAGE_KEY);
      return merged;
    }catch(e){ console.error('migration failed', e); return null; }
  }
};

 if(typeof window!=='undefined') window.Store = Store;
 if(typeof module!=='undefined' && module.exports) module.exports = Store;
})();
