/* ============================================================
 Settings — 2026-09-01 架构评审候选 4：从 global-brand-building.html 内联脚本抽出。
 依赖均为运行时全局（el / state / saveNow / Archive / App 等），浏览器可用，
 node 测试通过注入对应 stub 直接命中接口。
 ============================================================ */
(function(){
 'use strict';

const Settings = {
  // Server (config.yaml + .env) is the source of truth. state.settings.api
  // mirrors it with a masked key so API.aiButton's "configured?" check works.

  // Global API/manual toggle (persisted in state, independent of key presence).
  hasKey(){ return !!(state?.settings?.api?.apiKey); },
  setMode(mode){
    if(Runner.current){ showToast('请先暂停或中止当前 AI 任务'); return; }
    if(mode==='api' && !this.hasKey()){
      showToast('请先点设置配置 API Key');
      this.renderModeSwitch();
      return;
    }
    state.settings.manualMode = (mode==='manual');
    autosave();
    this.renderModeSwitch();
  },
  renderModeSwitch(){
    const sw=document.getElementById('modeSwitch'); if(!sw) return;
    const manual=!!state.settings.manualMode || !this.hasKey();
    const forceManual=!this.hasKey();
    sw.querySelectorAll('button').forEach(b=>{
      const m=b.dataset.mode;
      b.classList.toggle('active', (m==='manual')===manual);
      b.disabled = (m==='api' && forceManual);
      b.title = (m==='api' && forceManual) ? '请先点设置配置 API Key' : '';
    });
  },

  async open(){
    let cfg={...DEFAULT_SETTINGS, apiKeyExists: !!state?.settings?.api?.apiKey};
    try{ cfg = await (await fetch(apiUrl('/api/config'))).json(); }catch{}
    // 2026-09-03：保存快照用于「测试连接」前的一致性检查（防"以为在测新厂商
    // 实际在测旧配置"）；保存成功后同步刷新。
    this._saved = {provider:cfg.provider, baseUrl:cfg.baseUrl, model:cfg.model};
    $('#setProvider').value=cfg.provider;
    $('#setBaseUrl').value=cfg.baseUrl;
    $('#setModel').value=cfg.model;
    $('#setApiKey').value='';
    $('#setApiKey').placeholder=cfg.apiKeyExists ? '已配置 · 留空保持不变' : 'sk-...';
    $('#setTemperature').value=cfg.temperature;
    $('#setTempVal').textContent=Number(cfg.temperature).toFixed(1);
    $('#setBackendUrl').value=cfg.backendUrl;
    $('#setTestResult').textContent = cfg.apiKeyExists ? ' 已配置 API Key（点「测试连接」验证）' : '';
    $('#setTestResult').style.color='var(--color-accent)';
    $('#settingsModal').classList.add('open');
  },
  close(){ $('#settingsModal').classList.remove('open'); },
  onApiKeyInput(){
    const r=$('#setTestResult');
    const k=$('#setApiKey').value.trim();
    if(!k){ r.textContent=''; return; }
    r.textContent=' 已输入新 Key（保存后生效，点「测试连接」验证）';
    r.style.color='var(--color-accent)';
  },
  onProviderChange(){
    // 2026-09-03：预填数据以 providers.js 注册表为单一来源（baseUrlHint +
    // defaultModel）；旧的本地写死 presets 漏了 qwen/zhipu/moonshot/doubao，
    // 选中即 TypeError。Providers 缺失时保留最小兜底。
    const p=$('#setProvider').value;
    let baseUrl='', model='';
    if(typeof Providers!=='undefined'){
      const rec=Providers.getProviderConfig(p);
      if(rec){ baseUrl=rec.baseUrlHint||''; model=rec.defaultModel||''; }
    }
    if(!model && typeof Providers==='undefined'){
      model={deepseek:'deepseek-v4-flash',openai:'gpt-4o-mini',gemini:'gemini-2.0-flash'}[p]||'';
    }
    $('#setBaseUrl').value=baseUrl;
    $('#setModel').value=model;
  },
  // 仅持久化（不关窗）：供 save() 与 test() 的「先保存再测」共用。
  // 成功返回 merged 配置并刷新一致性快照；失败返回 null（toast 提示）。
  async _persist(){
    const body={
      provider:$('#setProvider').value,
      baseUrl:$('#setBaseUrl').value.trim(),
      model:$('#setModel').value.trim(),
      temperature:parseFloat($('#setTemperature').value),
      backendUrl:$('#setBackendUrl').value.trim() || DEFAULT_SETTINGS.backendUrl
    };
    const key=$('#setApiKey').value.trim();
    if(key) body.apiKey=key;  // empty = keep existing key server-side
    try{
      const res = await fetch(apiUrl('/api/config'), {
        method:'PUT', headers:{'Content-Type':'application/json'}, body:JSON.stringify(body)
      });
      if(!res.ok) throw new Error('HTTP '+res.status);
      const merged = await res.json();
      state.settings.api = {...merged, apiKey: merged.apiKeyExists ? '********' : ''};
      this._saved = {provider:merged.provider, baseUrl:merged.baseUrl, model:merged.model};
      return merged;
    }catch(e){
      showToast('设定保存失败: '+e.message);
      return null;
    }
  },
  async save(){
    const merged = await this._persist();
    if(!merged) return;
    this.close();
    showToast('设定已保存');
    this.renderModeSwitch();
    this.checkBackend();
  },
  async test(){
    const r=$('#setTestResult'); r.textContent='测试中…'; r.style.color='var(--color-ink-2)';
    // 2026-09-03：防误配——表单与已保存配置不一致时先问。
    // Key 输入框有内容 = 新 Key 未保存；provider/baseUrl/model 改了 = 未保存。
    // 测试走的是服务器已保存的那套，不是弹窗里显示的这套。
    const form={
      provider:$('#setProvider').value,
      baseUrl:$('#setBaseUrl').value.trim(),
      model:$('#setModel').value.trim()
    };
    const saved=this._saved || form;   // open() 后必有快照；兜底当一致
    const keyTyped=$('#setApiKey').value.trim();
    const formChanged = form.provider!==saved.provider || form.baseUrl!==saved.baseUrl ||
      form.model!==saved.model || !!keyTyped;
    if(formChanged){
      const goSave = confirm(
        '改动尚未保存：「测试连接」打的是服务器已保存的配置（'+saved.provider+
        ' / '+(saved.model||'?')+'），不是弹窗里显示的（'+form.provider+' / '+(form.model||'?')+'）。\n\n'+
        (keyTyped?'注意：新粘贴的 API Key 也未保存。\n\n':'')+
        '「确定」→ 先保存再测试\n「取消」→ 仍按已保存配置测试');
      if(goSave){
        const merged=await this._persist();
        if(!merged){ r.textContent='保存失败，未测试'; r.style.color='var(--color-warn)'; return; }
      }
    }
    try{
      const text=await API.call([{role:'user',content:'回复"OK"两个字符'}]);
      if(text.trim().includes('OK')){ r.textContent='连接成功'; r.style.color='var(--color-accent)'; }
      else{ r.textContent='已连接，回复异常: '+text.slice(0,30); r.style.color='var(--color-warn)'; }
    }catch(e){ r.textContent='失败: '+e.message; r.style.color='var(--color-warn)'; }
  },
  async testBackend(){
    const r=$('#setBackendResult'); r.textContent='测试中…';
    state.settings.api.backendUrl=$('#setBackendUrl').value.trim()||DEFAULT_SETTINGS.backendUrl;
    const ok=await Backend.health();
    if(ok){ r.textContent=' 本地服务已连接'; r.style.color='var(--color-accent)'; }
    else{ r.textContent=' 未连接（LDA/Excel 将降级）'; r.style.color='var(--color-warn)'; }
    App.updateSummary();
  },
  async checkBackend(){
    await this.testBackend();
  }
};

 if(typeof window!=='undefined') window.Settings = Settings;
 if(typeof module!=='undefined' && module.exports) module.exports = Settings;
})();
