/* ============================================================
 Archive — 档案存取深模块（2026-09-01 架构评审候选 5）。

 快照的 list / create / rename / remove / restore 唯一入口。
 调用方不碰 URL、project_id 与响应形状；失败 throw Error(服务端 detail)。
 浏览器与 node 测试跨同一接缝（真实 fetch / 测试假 fetch）。

 baseUrl 惰性读取 window.state.settings.api.backendUrl，与壳内 apiUrl
 同源；settings 变更后无需重新配置。
 ============================================================ */
(function(){
  'use strict';

  function baseUrl(){
    if(typeof window !== 'undefined' && window.state && window.state.settings && window.state.settings.api &&
       window.state.settings.api.backendUrl){
      return window.state.settings.api.backendUrl.replace(/\/+$/, '');
    }
    return 'http://localhost:8765';
  }

  async function _req(method, path, body){
    const res = await fetch(baseUrl() + path, {
      method,
      headers: body != null ? {'Content-Type':'application/json'} : undefined,
      body: body != null ? JSON.stringify(body) : undefined
    });
    const data = await res.json().catch(() => null);
    if(!res.ok){
      throw new Error((data && data.detail) ? data.detail : ('HTTP ' + res.status));
    }
    return data;
  }

  const Archive = {
    // GET /api/snapshots?project_id=default → [{id,name,type,created_at}]
    list(){
      return _req('GET', '/api/snapshots?project_id=default');
    },
    // POST /api/snapshots {project_id, name, overwrite} → snapshot meta
    create({name, overwrite=false} = {}){
      return _req('POST', '/api/snapshots', {
        project_id: 'default',
        name: name || null,
        overwrite: !!overwrite
      });
    },
    // POST /api/snapshots/{id}/rename?project_id=default → snapshot meta
    rename(id, name, {overwrite=false} = {}){
      return _req('POST', '/api/snapshots/' + encodeURIComponent(id) + '/rename?project_id=default', {
        name: String(name || ''),
        overwrite: !!overwrite
      });
    },
    // DELETE /api/snapshots/{id}?project_id=default → true
    async remove(id){
      await _req('DELETE', '/api/snapshots/' + encodeURIComponent(id) + '?project_id=default');
      return true;
    },
    // POST /api/snapshots/{id}/restore?project_id=default → restored state
    async restore(id){
      const data = await _req('POST', '/api/snapshots/' + encodeURIComponent(id) + '/restore?project_id=default');
      return data.state;
    }
  };

  if(typeof window !== 'undefined') window.Archive = Archive;
  if(typeof module !== 'undefined' && module.exports) module.exports = Archive;
})();
