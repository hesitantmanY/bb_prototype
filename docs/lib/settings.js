/* ============================================================
 Settings — 2026-09-01 架构评审候选 4：从 global-brand-building.html 内联脚本抽出。
 多厂商配置（2026-09-03 决策锁）：
 - 服务端存多套命名配置（=厂商名），Key 各存 .env 的 LLM_API_KEY_<厂商> 行；
 - 本弹窗「保存」= 写入当前厂商并设为激活（没有独立"切换"，保存目标即激活）；
 - 「测试连接」打激活配置；表单与激活配置不一致且未保存时先问；
 - 各家 Key：留空=不动；有内容且该家已有 Key → 覆盖确认；「清除」按钮可删。
 依赖均为运行时全局（el / state / saveNow / Archive / App 等），浏览器可用。
 ============================================================ */
(function(){
 'use strict';

// 弹窗里展示用的厂商中文名（与 html <option> 初值一致）
const BASE_LABELS = {
  deepseek:'DeepSeek', doubao:'火山方舟（豆包）', moonshot:'Kimi（Moonshot）',
  minimax:'MiniMax', qwen:'通义千问', zhipu:'智谱 GLM',
  openai:'OpenAI', gemini:'Google Gemini', custom:'其他（OpenAI 兼容）'
};

const Settings = {
  // Server (config.yaml + .env) is the source of truth. state.settings.api
  // mirrors the ACTIVE provider with a masked key.

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

  // ---- 内部状态：_providers: {name:{apiKeyExists,baseUrl,model,temperature}} ----
  _keyBtn(){ return $('#setClearKey'); },
  _banner(){ return $('#legacyKeyBanner'); },

  _markOptions(){
    const sel=$('#setProvider');
    [...sel.options].forEach(o=>{
      const base = BASE_LABELS[o.value] || o.textContent.replace(/ ✓$/,'');
      const has = !!(this._providers && this._providers[o.value] &&
        this._providers[o.value].apiKeyExists);
      o.textContent = base + (has ? ' ✓' : '');
    });
  },
  _currentHasKey(){
    const p=$('#setProvider').value;
    return !!(this._providers && this._providers[p] && this._providers[p].apiKeyExists);
  },
  _syncKeyUI(){
    const has=this._currentHasKey();
    const btn=this._keyBtn(); if(btn) btn.style.display = has ? '' : 'none';
    const inp=$('#setApiKey');
    inp.placeholder = has ? '已配置 · 留空保持不变' : 'sk-...';
  },

  async open(){
    let cfg={...DEFAULT_SETTINGS, apiKeyExists: !!state?.settings?.api?.apiKey};
    try{ cfg = await (await fetch(apiUrl('/api/config'))).json(); }catch{}
    this._providers = {};
    (cfg.providers||[]).forEach(p=>{ this._providers[p.name]=p; });
    // 快照=激活配置（测试连接前的对账基准）
    this._saved = {provider:cfg.provider, baseUrl:cfg.baseUrl, model:cfg.model};
    $('#setProvider').value=cfg.provider;
    this._markOptions();
    $('#setBaseUrl').value=cfg.baseUrl||'';
    $('#setModel').value=cfg.model||'';
    $('#setApiKey').value='';
    this._syncKeyUI();
    $('#setTemperature').value=cfg.temperature;
    $('#setTempVal').textContent=Number(cfg.temperature).toFixed(1);
    $('#setBackendUrl').value=cfg.backendUrl;
    $('#setTestResult').textContent = cfg.apiKeyExists
      ? ' 已配置 · 当前激活：'+(cfg.active||cfg.provider) : '';
    $('#setTestResult').style.color='var(--color-accent)';
    const banner=this._banner();
    if(banner) banner.style.display = cfg.legacyKeyPending ? '' : 'none';  // 文案在 HTML 里
    $('#settingsModal').classList.add('open');
  },
  close(){ $('#settingsModal').classList.remove('open'); },

  onApiKeyInput(){
    const r=$('#setTestResult');
    const k=$('#setApiKey').value.trim();
    if(!k){ r.textContent=''; return; }
    r.textContent=' 已输入新 Key（保存后生效，点「测试连接」验证）';
    r.style.color='var(--color-accent');
  },

  onProviderChange(){
    // 载入该厂商已存的 base/model/温度；没存过 → providers.js 注册表预填
    const p=$('#setProvider').value;
    const stored=this._providers && this._providers[p];
    let baseUrl='', model='', temperature=1.0;
    if(stored){
      baseUrl=stored.baseUrl||''; model=stored.model||''; temperature=stored.temperature??1.0;
    } else if(typeof Providers!=='undefined'){
      const rec=Providers.getProviderConfig(p);
      if(rec){ baseUrl=rec.baseUrlHint||''; model=rec.defaultModel||''; }
    }
    if(!model && typeof Providers==='undefined'){
      model={deepseek:'deepseek-v4-flash',openai:'gpt-4o-mini',gemini:'gemini-2.0-flash'}[p]||'';
    }
    $('#setBaseUrl').value=baseUrl;
    $('#setModel').value=model;
    $('#setTemperature').value=temperature;
    $('#setTempVal').textContent=Number(temperature).toFixed(1);
    $('#setApiKey').value='';
    this._syncKeyUI();
  },

  // 持久化当前厂商（=激活）。Key 规则：留空不动；有 Key 且该家已有 → 覆盖确认。
  async _persist(){
    const provider=$('#setProvider').value;
    const key=$('#setApiKey').value.trim();
    if(key && this._currentHasKey()){
      const go=confirm('将覆盖 '+provider+' 现有的 Key（旧 Key 立即失效，费用归属切换）。\n确定 → 覆盖；取消 → 保留旧 Key 不保存本次输入。');
      if(!go){ showToast('已取消：旧 Key 保留'); return null; }
    }
    const body={
      provider,
      baseUrl:$('#setBaseUrl').value.trim(),
      model:$('#setModel').value.trim(),
      temperature:parseFloat($('#setTemperature').value),
      backendUrl:$('#setBackendUrl').value.trim() || DEFAULT_SETTINGS.backendUrl
    };
    if(key) body.apiKey=key;
    try{
      const res = await fetch(apiUrl('/api/config'), {
        method:'PUT', headers:{'Content-Type':'application/json'}, body:JSON.stringify(body)
      });
      if(!res.ok) throw new Error('HTTP '+res.status);
      const merged = await res.json();
      state.settings.api = {...merged, apiKey: merged.apiKeyExists ? '********' : ''};
      this._providers = {};
      (merged.providers||[]).forEach(p=>{ this._providers[p.name]=p; });
      this._saved = {provider:merged.provider, baseUrl:merged.baseUrl, model:merged.model};
      this._markOptions();
      this._syncKeyUI();
      $('#setApiKey').value='';
      const banner=this._banner();
      if(banner && !merged.legacyKeyPending) banner.style.display='none';
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
    showToast('已保存并激活：'+merged.provider);
    this.renderModeSwitch();
    this.checkBackend();
  },

  async clearKey(){
    const p=$('#setProvider').value;
    if(!confirm('清除 '+p+' 的 Key？清除后该厂商显示未配置，AI 自动模式将不可用（可随时重新填入）。')) return;
    try{
      const res = await fetch(apiUrl('/api/config/clear-key'), {
        method:'POST', headers:{'Content-Type':'application/json'},
        body:JSON.stringify({name:p})
      });
      if(!res.ok) throw new Error('HTTP '+res.status);
      const merged = await res.json();
      this._providers = {};
      (merged.providers||[]).forEach(x=>{ this._providers[x.name]=x; });
      if(p===merged.active){
        state.settings.api = {...merged, apiKey: merged.apiKeyExists ? '********' : ''};
      }
      this._markOptions();
      this._syncKeyUI();
      showToast('已清除 '+p+' 的 Key');
      this.renderModeSwitch();
    }catch(e){ showToast('清除失败: '+e.message); }
  },
  async discardLegacy(){
    try{
      const res = await fetch(apiUrl('/api/config/discard-legacy'), {method:'POST'});
      if(!res.ok) throw new Error('HTTP '+res.status);
      const banner=this._banner();
      if(banner) banner.style.display='none';
      showToast('已丢弃旧 Key');
    }catch(e){ showToast('操作失败: '+e.message); }
  },

  async test(){
    const r=$('#setTestResult'); r.textContent='测试中…'; r.style.color='var(--color-ink-2)';
    // 防误配：表单与激活配置不一致时先问（Key 输入框有内容也算未保存）
    const form={
      provider:$('#setProvider').value,
      baseUrl:$('#setBaseUrl').value.trim(),
      model:$('#setModel').value.trim()
    };
    const saved=this._saved || form;
    const keyTyped=$('#setApiKey').value.trim();
    const formChanged = form.provider!==saved.provider || form.baseUrl!==saved.baseUrl ||
      form.model!==saved.model || !!keyTyped;
    if(formChanged){
      const goSave = confirm(
        '改动尚未保存：「测试连接」打的是已激活配置（'+saved.provider+
        ' / '+(saved.model||'?')+'），不是弹窗里显示的（'+form.provider+' / '+(form.model||'?')+'）。\n\n'+
        (keyTyped?'注意：新粘贴的 API Key 也未保存。\n\n':'')+
        '「确定」→ 先保存再测试\n「取消」→ 仍按已激活配置测试');
      if(goSave){
        const merged=await this._persist();
        if(!merged){ r.textContent='保存失败，未测试'; r.style.color='var(--color-warn)'; return; }
      }
    }
    try{
      const text=await API.call([{role:'user',content:'回复"OK"两个字符'}]);
      if(text.trim().includes('OK')){ r.textContent='连接成功（'+form.provider+'）'; r.style.color='var(--color-accent)'; }
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
