/* ============================================================
 AiContext — 全局 AI 上下文机制（2026-08-27 决策）

 适用于全部 5 个工作坊的 AI 按钮。目标：
 - 准确性优先：相关上下文必给、无关上下文不给（无关信息是噪音，
   会稀释模型注意力）。token 节约是副产品，不是目的。
 - 用户知情可控：生成前可查看/调整将发送的消息（「消息设置」折叠区）。
 - 不 dump 整包 state：字段级截断。

 Loaded as a plain <script>. Attaches to window.AiContext.

 Public API:
   AiContext.register(workId, sections)
       sections: [{name, label, priority, get(state)->string}]
       get() 内部自行做字段级截断（可用 AiContext.tr）。
   AiContext.sections(workId)                 → 已注册节列表副本
   AiContext.registerFewShot(key, text)       通用格式示例注册表
   AiContext.fewShotText(key)                 → text|''
   AiContext.estimateTokens(text)             3 字符/token（同 file_context.js）
   AiContext.tr(text, chars)                  字符级截断（超长加 …）
   AiContext.digest(workId, cfg)              → {text, tokens, omitted, key}
       cfg: {sections:[names], state?}
       会话内按「上游 state 指纹 + 选中节」缓存，返回稳定共享前缀。
       护栏：总上限 ≈1000 tokens；超限按 priority 丢节并注明「已省略」。
   AiContext.buildPrompt({workId, sections, system, instruction, fewShot, state})
       → messages：[system + 共享 digest] (+few-shot) + [按钮指令]，稳定前缀在前
   AiContext.mountSettings(container, cfg)    「消息设置」折叠区（默认收起）
       cfg: {workId, needs:[], fewShotKey:null, preview:()=>({system,instruction})}
       → handle {current():{sections, fewShot}, reset()}
   AiContext.clearCache()
 ============================================================ */
(function(){
 'use strict';

 const DIGEST_TOKEN_CAP = 1000;

 // workId -> [{name,label,priority,get}]
 const REGISTRY = {};
 // key -> few-shot text（通用格式示例；不用演示案例数据）
 const FEWSHOT = {};
 // cacheKey -> {text, tokens, omitted}
 const cache = new Map();

 function estimateTokens(text){
   if(!text) return 0;
   return Math.ceil(String(text).length / 3);
 }

 function tr(text, chars){
   const s = String(text == null ? '' : text);
   if(!chars || s.length <= chars) return s;
   return s.slice(0, chars) + '…';
 }

 // djb2 — 稳定、廉价、足够做会话内指纹。
 function hash(str){
   let h = 5381;
   for(let i = 0; i < str.length; i++){
     h = ((h << 5) + h + str.charCodeAt(i)) | 0;
   }
   return (h >>> 0).toString(36);
 }

 function register(workId, sections){
   REGISTRY[workId] = (sections || []).map(s => ({ priority: 100, ...s }));
 }
 function sections(workId){ return (REGISTRY[workId] || []).slice(); }
 function registerFewShot(key, text){ FEWSHOT[key] = String(text || ''); }
 function fewShotText(key){ return key ? (FEWSHOT[key] || '') : ''; }

 function shellState(){
   return (typeof state !== 'undefined' && state) ? state : null;
 }

 function materialize(sec, st){
   try{ return String(sec.get(st) ?? ''); }catch(e){ return ''; }
 }

 // 稳定共享前缀。指纹 = 上游 state（选中节序列化）+ 选中节集合。
 // 同一配置重复点击 / SchemaCheck 重试命中缓存，前缀文本不重建 —
 // 前缀稳定才能命中 DeepSeek/OpenAI 自动 prompt 缓存。
 function digest(workId, cfg = {}){
   const st = cfg.state || shellState();
   const all = REGISTRY[workId] || [];
   const picked = (cfg.sections || []).filter(n => all.some(s => s.name === n));
   const secs = all
     .filter(s => picked.includes(s.name))
     .sort((a, b) => a.priority - b.priority);

   const body = secs.map(s => '## ' + (s.label || s.name) + '\n' + materialize(s, st)).join('\n\n');
   const key = workId + '|' + picked.slice().sort().join(',') + '|' + hash(body);
   const hit = cache.get(key);
   if(hit) return { ...hit, key };

   // 护栏：按优先级装填，超出 ≈1000 tokens 的节丢弃并注明已省略。
   const kept = [];
   const omitted = [];
   let used = 0;
   for(const s of secs){
     const txt = materialize(s, st);
     if(!txt.trim()) continue;
     const block = '## ' + (s.label || s.name) + '\n' + txt;
     const t = estimateTokens(block);
     if(used + t > DIGEST_TOKEN_CAP){
       omitted.push(s.label || s.name);
       continue;
     }
     kept.push(block);
     used += t;
   }
   let text = '';
   if(kept.length){
     text = '【上游上下文（只读参考，字段已截断）】\n' + kept.join('\n\n');
     if(omitted.length) text += '\n\n[已省略（超出上下文预算）：' + omitted.join('、') + ']';
   }
   const entry = { text, tokens: estimateTokens(text), omitted };
   cache.set(key, entry);
   return { ...entry, key };
 }

 // messages：稳定前缀在前 → 命中提供商自动 prompt 缓存。
 function buildPromptCore({ workId, sections: secNames, system, instruction, fewShot, state: st }){
   const dg = digest(workId, { sections: secNames || [], state: st });
   let sys = String(system || '');
   if(dg.text) sys += '\n\n' + dg.text;
   const messages = [{ role: 'system', content: sys }];
   const fs = fewShotText(fewShot);
   if(fs) messages.push({ role: 'system', content: '格式示例（仅参考格式，勿照抄内容）：\n' + fs });
   messages.push({ role: 'user', content: String(instruction || '') });
   return messages;
 }

 function messagesToText(messages){
   return (messages || []).map(m => (m.role === 'system' ? '[system] ' : '[user] ') + m.content).join('\n\n');
 }

 // 「消息设置」折叠区：上下文节勾选（默认=按钮 needs）、示例选择、
 // 消息预览 + 估算 token、重置为推荐。默认收起。
 // 需要宿主页面的 el() / showToast；渲染发生在交互时，加载顺序无要求。
 function mountSettings(container, cfg){
   const workId = cfg.workId;
   const all = sections(workId);
   const current = {
     sections: (cfg.needs || []).slice(),
     fewShot: cfg.fewShotKey || null
   };
   let fewShotOn = !!cfg.fewShotKey && !!(cfg.fewShotDefault !== false);

   if(typeof el !== 'function' || !container) return { current: () => current, reset(){} };

   const details = el('details', { class: 'ai-settings' });
   const summary = el('summary', { class: 'ai-settings-summary' }, '消息设置（发送前可查看/调整）');
   details.appendChild(summary);
   const body = el('div', { class: 'ai-settings-body' });
   details.appendChild(body);

   // 1. 上下文节勾选
   const secBox = el('div', { class: 'ai-settings-group' });
   secBox.appendChild(el('div', { class: 'hint' }, '上下文节（相关节全给、无关节不给）'));
   if(!all.length){
     secBox.appendChild(el('p', { class: 'hint' }, '该工作坊未注册上下文节。'));
   }
   all.forEach(sec => {
     const cb = el('input', { type: 'checkbox', checked: current.sections.includes(sec.name) });
     cb.style.width = 'auto';
     cb.addEventListener('change', () => {
       const i = current.sections.indexOf(sec.name);
       if(cb.checked && i < 0) current.sections.push(sec.name);
       if(!cb.checked && i >= 0) current.sections.splice(i, 1);
       refreshPreview();
     });
     secBox.appendChild(el('label', { class: 'ai-settings-check' }, cb, ' ' + (sec.label || sec.name)));
   });
   body.appendChild(secBox);

   // 2. 示例（few-shot）
   if(cfg.fewShotKey && fewShotText(cfg.fewShotKey)){
     const fsBox = el('div', { class: 'ai-settings-group' });
     fsBox.appendChild(el('div', { class: 'hint' }, '示例（few-shot）'));
     const sel = el('select');
     const o1 = el('option', { value: 'none' }, '无示例');
     const o2 = el('option', { value: 'generic' }, '通用格式示例');
     if(fewShotOn) o2.selected = true; else o1.selected = true;
     sel.appendChild(o1); sel.appendChild(o2);
     sel.addEventListener('change', () => {
       fewShotOn = sel.value === 'generic';
       current.fewShot = fewShotOn ? cfg.fewShotKey : null;
       refreshPreview();
     });
     fsBox.appendChild(sel);
     body.appendChild(fsBox);
   }

   // 3. 消息预览 + token 估算（复用 digest 缓存，不重复构建）
   const pvBox = el('div', { class: 'ai-settings-group' });
   pvBox.appendChild(el('div', { class: 'hint' }, '消息预览'));
   const pvMeta = el('div', { class: 'mono ai-settings-meta' }, '');
   const pv = el('pre', { class: 'ai-settings-preview' }, '');
   pvBox.appendChild(pvMeta);
   pvBox.appendChild(pv);
   body.appendChild(pvBox);

   // 4. 重置为推荐
   body.appendChild(el('button', { type: 'button', class: 'ghost small', onclick: () => reset() }, '重置为推荐'));

   function reset(){
     current.sections = (cfg.needs || []).slice();
     fewShotOn = !!cfg.fewShotKey && !!(cfg.fewShotDefault !== false);
     current.fewShot = fewShotOn ? cfg.fewShotKey : null;
     body.querySelectorAll('input[type=checkbox]').forEach(cb => {
       const label = cb.closest('label');
       const name = label ? label.textContent.trim() : '';
       const sec = all.find(s => (s.label || s.name) === name);
       cb.checked = !!(sec && current.sections.includes(sec.name));
     });
     const sel = body.querySelector('select');
     if(sel) sel.value = fewShotOn ? 'generic' : 'none';
     refreshPreview();
   }

   function refreshPreview(){
     try{
       const base = cfg.preview ? cfg.preview() : {};
       const messages = buildPromptCore({
         workId,
         sections: current.sections,
         system: base.system || '',
         instruction: base.instruction || '（按钮指令在点击时生成）',
         fewShot: current.fewShot
       });
       const text = messagesToText(messages);
       pv.textContent = text.length > 4000 ? text.slice(0, 4000) + '\n…（预览截断）' : text;
       pvMeta.textContent = '约 ' + estimateTokens(text) + ' tokens · ' + messages.length + ' 条消息';
     }catch(e){
       pv.textContent = '（预览构建失败：' + e.message + '）';
     }
   }
   details.addEventListener('toggle', () => { if(details.open) refreshPreview(); });

   container.appendChild(details);
   return {
     current: () => ({ sections: current.sections.slice(), fewShot: current.fewShot }),
     reset
   };
 }

 function clearCache(){ cache.clear(); }

 // 旧式 API.aiButton 调用点的低成本升级：保留原 messages 构建，
 // 注入 digest + 「消息设置」。返回 {buildPrompt, handle}。
 // opts: {workId, needs, fewShotKey, container, originalBuild}
 function upgrade(opts){
   let handle = null;
   try{
     if(opts.container && typeof document !== 'undefined'){
       handle = mountSettings(opts.container, {
         workId: opts.workId, needs: opts.needs || [],
         fewShotKey: opts.fewShotKey || null,
         preview: ()=>{
           const ms = opts.originalBuild() || [];
           const sys = ms.find(m=>m.role==='system');
           return {
             system: sys ? sys.content : '',
             instruction: ms.filter(m=>m.role!=='system').map(m=>m.content).join('\n\n')
           };
         }
       });
     }
   }catch(e){ /* 宿主缺 el() 时静默降级 */ }
   const buildPrompt = ()=>{
     const ms = opts.originalBuild() || [];
     const sys = ms.find(m=>m.role==='system');
     const ins = ms.filter(m=>m.role!=='system').map(m=>m.content).join('\n\n');
     const cfg = handle ? handle.current() : { sections: opts.needs||[], fewShot: opts.fewShotKey||null };
     return buildPromptCore({
       workId: opts.workId, sections: cfg.sections,
       system: sys ? sys.content : '', instruction: ins, fewShot: cfg.fewShot
     });
   };
   return { buildPrompt, handle };
 }

 // ---------- 通用格式示例注册表 ----------
 // 原则：不用演示案例做 few-shot（会把模型带偏到案例公司数据）。
 // 每交付物一小段「输入片段 + 期望 JSON 形状」占位样例。
 registerFewShot('delphi.weights', [
   '输入片段：',
   '指标 (axis=attractiveness):',
   '- [ind_x] 指标A：高分锚点 … / 中分 … / 低分 …',
   '- [ind_y] 指标B：高分锚点 … / 中分 … / 低分 …',
   '期望 JSON 形状（维度内权重总和=1）：',
   '{"ratings":{"ind_x":0.6,"ind_y":0.4},"reasoning":"<30字理由>"}'
 ].join('\n'));
 registerFewShot('work2.candidates', '期望 JSON 形状：\n{"candidates":[{"name":"<国家/地区>","reason":"<1句，含需求/规模/趋势之一>"}]}');
 registerFewShot('work2.criteria', '期望 JSON 形状：\n{"criteria":[{"name":"<可观测标准，如 Hofstede UAI > 80>","source":"<公开数据源名称>"}]}');
 registerFewShot('work2.retained', '期望 JSON 形状：\n{"retained":[{"name":"<清单中的市场名>","reason":"<为什么留>","region":"<地区如 欧洲>","population":"<如 约 6700 万>","gdpPerCapita":"<如 约 4.9 万美元>"}]}');
 registerFewShot('work2.indicators', '期望 JSON 形状：\n{"attractiveness":{"categories":[{"name":"","indicators":[{"name":"","rubric":{"high":"","mid":"","low":""}}]}]},"competitiveness":{"categories":[…]}}');
 registerFewShot('delphi.perspectives', '期望 JSON 形状：\n{"perspectives":[{"name":"<视角名>","rationale":"<为什么重要>","keySignals":["<3-5个该视角最在意的信号>"]}]}');
 registerFewShot('delphi.converge', '期望 JSON 形状：\n{"weights":{"attractiveness":{"<indId>":0.25},"competitiveness":{"<indId>":0.25}},"summary":"<1段>"}');
 registerFewShot('work2.scores', '期望 JSON 形状：\n{"scores":{"<indId>":7.5},"evidence":{"<indId>":"<10-30字依据>"},"sources":{"<indId>":"<可选URL>"}}');
 registerFewShot('work2.tiers', '期望 JSON 形状：\n{"explanations":{"<市场名>":"<为什么落在这个象限>"},"tier1":{"marketId":"<id>","rationale":"","resourcesPct":80,"milestones":["<3-5条>"],"reEvalTrigger":""},"tier2":{"marketIds":["<id>"],"observationMetrics":["<2-3条>"],"reEvalTrigger":""},"tier3":{"marketIds":["<id>"],"reEvalTrigger":""}}');
 registerFewShot('work3.scenarios', '期望 JSON 形状：\n{"scenarios":[{"name":"<≤12字>","description":"","personaIds":["<画像id>"],"needStrength":{"pain":7,"willingness":6,"frequency":5},"selected":true}]}');
 registerFewShot('work3.painmap', '期望 JSON 形状：\n{"topics":[{"id":0,"label":"<4-8字主题名>"}],"pains":[{"pain":"","evidence":"<原文摘录>","frequency":"高|中|低","linkedNeeds":[""],"linkedTopicId":0,"type":"痛点|痒点","scenarioId":""}]}');
registerFewShot('work3.candidates', '期望 JSON 形状：\n{"candidates":[{"name":"<≤15字>","painId":"<痛点地图里的 id，不得编造>","pain":"<痛点文本（与 painId 对应）>","description":"<≤50字>","evidence":"","scenarioId":""}]}');
 registerFewShot('work3.dims', '期望 JSON 形状：\n{"<dimKey1>":7,"<dimKey2>":8,"<dimKey3>":6}');
 registerFewShot('work3.alternatives', '期望 JSON 形状：\n{"alternatives":[{"text":"<20-40字，为谁/提供什么/有何不同>"}]}');
 registerFewShot('work3.positioning', '期望 JSON 形状：\n{"positioning":{"brand":"","audience":"","coreValue":"","category":""}}');
 registerFewShot('work3.identity', '期望 JSON 形状：\n{"mbti":"<四个字母>","traits":["<3-5个特质词>"]}');
 registerFewShot('work3.slogans', '期望 JSON 形状：\n{"slogans":["<中文12字内，含情感驱动词>"]}');

 // ---------- 标准上下文节注册表 ----------
 // getter 内做字段级截断（规格表）；相关上下文必给、无关不给。
 const SEC = {};
 SEC.sbu = { name:'sbu', label:'SBU（work1）', priority:1, get(st){
   const s = st?.work1?.sbu || {};
   return [
     s.name ? '名称：' + s.name : '',
     s.category ? '品类：' + tr(s.category, 80) : '',
     s.scope ? '范围：' + tr(s.scope, 120) : '',
     (s.countries||[]).length ? '已有市场：' + s.countries.join('、') : '',
     s.summary ? '摘要：' + tr(s.summary, 200) : '',
     s.boundary ? '边界：' + tr(s.boundary, 300) : ''
   ].filter(Boolean).join('\n');
 }};
 SEC.environment = { name:'environment', label:'环境与能力（work1 PEST）', priority:2, get(st){
   const e = st?.work1?.environment || {};
   const parts = [];
   [['政治','political'],['经济','economic'],['社会','social'],['技术','technological'],['行业','industry']].forEach(([lb,k])=>{
     if(e[k]) parts.push(lb + '：' + tr(e[k], 200));
   });
   const cap = e.ourCapabilities || {};
   const capTxt = ['delivery','core','brand','customer','compliance','smileCurve','trends']
     .map(k=>cap[k]).filter(Boolean).join('；');
   if(capTxt) parts.push('我们的能力：' + tr(capTxt, 400));
   return parts.join('\n');
 }};
 SEC.competitors = { name:'competitors', label:'竞品（work1）', priority:5, get(st){
   const cs = st?.work1?.environment?.competitors || [];
   if(!cs.length) return '';
   return cs.slice(0,7).map(c=>'- ' + (c.name||'') + '：' + tr((c.position||'') + '；优' + (c.strengths||'') + '；劣' + (c.weaknesses||''), 120)).join('\n');
 }};
 SEC.personas = { name:'personas', label:'客户画像（work1）', priority:3, get(st){
   const ps = st?.work1?.personas || [];
   if(!ps.length) return '';
   return ps.map(p=>'- ' + (p.name||'') + (p.region ? '（' + p.region + '）' : '') +
     '：痛点 ' + tr((Array.isArray(p.painPoints)?p.painPoints.join('；'):p.painPoints)||'', 120) +
     '；价值观 ' + tr((Array.isArray(p.values)?p.values.join('；'):p.values)||'', 60) +
     (p.quote ? '；原话 ' + tr(p.quote, 60) : '')).join('\n');
 }};
 SEC.insights = { name:'insights', label:'调研洞察（work1）', priority:6, get(st){
   return tr(st?.work1?.analysis?.insights || '', 300);
 }};
 SEC.valueFramework = { name:'valueFramework', label:'价值体系（work1）', priority:6, get(st){
   const v = st?.work1?.values || {};
   return [
     v.chosenFunctional ? '功能价值：' + tr(v.chosenFunctional, 200) : '',
     v.chosenEmotional ? '情感价值：' + tr(v.chosenEmotional, 200) : '',
     v.chosenSocial ? '社会价值：' + tr(v.chosenSocial, 200) : '',
     v.rationale ? '依据：' + tr(v.rationale, 200) : ''
   ].filter(Boolean).join('\n');
 }};
 SEC.metrics = { name:'metrics', label:'品牌资产指标（work1）', priority:7, get(st){
   const dims = st?.work1?.metrics?.dimensions || [];
   if(!dims.length) return '';
   return tr(dims.map(d=>(d.secondaries||[]).length ? d.name + '（' + d.secondaries.map(s=>s.name).join('、') + '）' : d.name).join('；'), 300);
 }};
 SEC.recommendations = { name:'recommendations', label:'改进建议（work1）', priority:6, get(st){
   const r = st?.work1?.recommendations || {};
   return [
     r.short ? '短期：' + tr(r.short, 150) : '',
     r.mid ? '中期：' + tr(r.mid, 150) : '',
     r.long ? '长期：' + tr(r.long, 150) : ''
   ].filter(Boolean).join('\n');
 }};
 // work2
 SEC.markets = { name:'markets', label:'候选/保留市场（work2）', priority:2, get(st){
   const w2 = st?.work2 || {};
   const parts = [];
   if((w2.candidates||[]).length) parts.push('候选：' + w2.candidates.map(c=>c.name + (c.reason ? '（' + tr(c.reason,60) + '）' : '')).join('、'));
   if((w2.retained||[]).length) parts.push('保留：' + w2.retained.map(m=>m.name + (m.region ? '（' + m.region + '）' : '')).join('、'));
   return parts.join('\n');
 }};
 SEC.indicators = { name:'indicators', label:'指标体系（work2）', priority:3, get(st){
   const w2 = st?.work2 || {};
   const parts = [];
   ['attractiveness','competitiveness'].forEach(axis=>{
     const cats = w2[axis]?.categories || [];
     if(!cats.length) return;
     parts.push((axis==='attractiveness'?'吸引力':'竞争力') + '：' + cats.map(c=>
       c.name + '[' + (c.indicators||[]).map(i=>i.name + '(w=' + Math.round((i.weight||0)*100) + '%)').join('、') + ']'
     ).join('；'));
   });
   return tr(parts.join('\n'), 400);
 }};
 SEC.matrix = { name:'matrix', label:'矩阵与得分（work2）', priority:4, get(st){
   const w2 = st?.work2 || {};
   if(typeof Work2 === 'undefined' || !Work2.computeMatrix) return '';
   try{
     const pts = Work2.computeMatrix();
     if(!pts.length) return '';
     return tr(pts.map(p=>'- ' + p.name + '：吸引力 ' + p.y.toFixed(2) + '，竞争力 ' + p.x.toFixed(2)).join('\n'), 200);
   }catch(e){ return ''; }
 }};
 // work3
 SEC.positioning = { name:'positioning', label:'定位与主张（work3）', priority:1, get(st){
   const w3 = st?.work3 || {};
   const p = w3.proposition || {}, id = w3.identity || {};
   return [
     p.chosenValueText ? '价值主张：' + p.chosenValueText : '',
     p.positioningStatement ? '定位句：' + p.positioningStatement : '',
     id.chosenSlogan ? 'Slogan：' + id.chosenSlogan : '',
     id.mbti ? 'MBTI：' + id.mbti + ' ' + (id.personalityTraits||[]).join('/') : ''
   ].filter(Boolean).join('\n');
 }};
 SEC.differentiators = { name:'differentiators', label:'入选卖点（work3）', priority:3, get(st){
   const cs = (st?.work3?.candidates || []).filter(c=>c.selected);
   return tr(cs.map(c=>'- ' + c.name + '：' + tr(c.description||'', 60)).join('\n'), 200);
 }};
 SEC.painMap = { name:'painMap', label:'痛点地图（work3）', priority:4, get(st){
   const pm = st?.work3?.mining?.painMap || [];
   return tr(pm.slice(0,5).map(p=>'- [' + (p.type||'痛点') + '] ' + p.pain + '（' + (p.frequency||'') + '）').join('\n'), 200);
 }};
 SEC.scenarios3 = { name:'scenarios', label:'场景细分（work3）', priority:3, get(st){
   const sc = st?.work3?.scenarios || [];
   if(!sc.length) return '';
   return tr(sc.map(s=>'- ' + s.name + (s.selected ? '（主战场）' : '') + '：' + tr(s.description||'', 50)).join('\n'), 300);
 }};
 // work4
 SEC.product4 = { name:'product', label:'产品（work4）', priority:2, get(st){
   const p = st?.work4?.product || {};
   return tr([
     p.name ? '产品：' + p.name + '（' + tr(p.description||'', 80) + '）' : '',
     (p.coreDifferentiators||[]).length ? '差异化：' + p.coreDifferentiators.join('、') : '',
     (p.skus||[]).length ? 'SKU：' + p.skus.map(s=>s.name).join('、') : ''
   ].filter(Boolean).join('\n'), 400);
 }};
 SEC.price4 = { name:'price', label:'定价（work4）', priority:4, get(st){
   const p = st?.work4?.price || {};
   return tr([
     p.strategy ? '策略：' + p.strategy + (p.strategyNote ? '（' + tr(p.strategyNote,80) + '）' : '') : '',
     (p.tiers||[]).length ? '档位：' + p.tiers.map(t=>t.name + ' ' + (t.price||'')).join('、') : ''
   ].filter(Boolean).join('\n'), 400);
 }};
 SEC.place4 = { name:'place', label:'渠道（work4）', priority:4, get(st){
   const p = st?.work4?.place || {};
   const all=[...(p.onlineSelf||[]),...(p.onlineThird||[]),...(p.offlineDirect||[]),...(p.offlineDistrib||[]),...(p.offlineRetail||[])];
   return tr(all.length ? '渠道：' + all.join('、') : '', 400);
 }};
 SEC.promotion4 = { name:'promotion', label:'传播（work4）', priority:5, get(st){
   const p = st?.work4?.promotion || {};
   return tr([
     p.theme ? '主题：' + p.theme : '',
     (p.advertising||[]).length ? '媒介：' + p.advertising.map(a=>a.media + ' ' + (a.budgetShare||0) + '%').join('、') : ''
   ].filter(Boolean).join('\n'), 400);
 }};
 // work5
 SEC.ch4_mix = { name:'ch4_mix', label:'第4章营销组合（work5）', priority:2, get(st){
   const m = st?.work5?.ch4_mix || {};
   return tr(['route','product','price','place','promotion'].map(k=>m[k] ? '【' + k + '】' + m[k] : '').filter(Boolean).join('\n'), 600);
 }};

 // 每工作坊可见节（上游共享节重复注册；相关性由按钮 needs 控制）
 register('work1', [SEC.sbu, SEC.environment, SEC.competitors, SEC.personas, SEC.insights, SEC.valueFramework, SEC.metrics, SEC.recommendations]);
 register('work2', [SEC.sbu, SEC.environment, SEC.competitors, SEC.personas, SEC.valueFramework, SEC.metrics, SEC.recommendations, SEC.markets, SEC.indicators, SEC.matrix]);
 register('work3', [SEC.sbu, SEC.personas, SEC.valueFramework, SEC.markets, SEC.scenarios3, SEC.painMap, SEC.differentiators, SEC.positioning]);
 register('work4', [SEC.sbu, SEC.markets, SEC.positioning, SEC.differentiators, SEC.product4, SEC.price4, SEC.place4, SEC.promotion4]);
 register('work5', [SEC.sbu, SEC.positioning, SEC.ch4_mix]);

 const AiContext = {
   register, sections, registerFewShot, fewShotText,
   estimateTokens, tr, digest, buildPrompt: buildPromptCore, messagesToText,
   mountSettings, upgrade, clearCache,
   DIGEST_TOKEN_CAP
 };
 if(typeof window !== 'undefined') window.AiContext = AiContext;
 if(typeof module !== 'undefined' && module.exports) module.exports = AiContext;
})();
