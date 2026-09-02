/* ============================================================
 JsonExtract — tolerant JSON parser.
 Loaded as a plain <script> (no module). Attaches to window.JsonExtract.

 Public API:
 run(text) — main entry. Returns parsed value or null.
 Sets JsonExtract.lastError on failure.
 lastError — last failure reason (string | null).
 tryParseSafe(text) — single-shot JSON.parse with {ok,value,error} return.
 stripProse(text) — strip leading prose / markdown fence.
 stripJsComments(text) — strip // and /* * / outside strings.
 stripTrailingCommas(text) — strip,} and,] outside strings.
 locateBalancedJson(text) — first balanced {...} or [...].
 ============================================================ */
(function(){
 'use strict';

 const JsonExtract = {
 lastError: null,

 // Main entry. 5-stage fallback chain（T01 验收记录见 git 历史）。
 run(text){
 JsonExtract.lastError = null;
 if(text == null){
 JsonExtract.lastError = 'input is null/undefined';
 return null;
 }
 if(typeof text!== 'string'){
 // Defensive: upstream may pass non-string (e.g. pasted object)
 try { return JSON.parse(JSON.stringify(text)); }
 catch(e){
 JsonExtract.lastError = 'non-string input not serializable: ' + e.message;
 return null;
 }
 }
 // Strip BOM
 const cleaned = text.charCodeAt(0) === 0xFEFF? text.slice(1): text;

 // Stage 1: direct
 let r = JsonExtract.tryParseSafe(cleaned);
 if(r.ok) return r.value;
 let lastErr = r.error;

 // Stage 2: prose / fence
 const noProse = JsonExtract.stripProse(cleaned);
 r = JsonExtract.tryParseSafe(noProse);
 if(r.ok) return r.value;
 lastErr = r.error;

 // Stage 3: comments (after prose)
 const noComments = JsonExtract.stripJsComments(noProse);
 r = JsonExtract.tryParseSafe(noComments);
 if(r.ok) return r.value;
 lastErr = r.error;

 // Stage 4: trailing commas
 const noTrailing = JsonExtract.stripTrailingCommas(noComments);
 r = JsonExtract.tryParseSafe(noTrailing);
 if(r.ok) return r.value;
 lastErr = r.error;

 // Stage 5: balanced-scan as last resort
 const balanced = JsonExtract.locateBalancedJson(noTrailing);
 r = JsonExtract.tryParseSafe(balanced);
 if(r.ok) return r.value;
 lastErr = r.error;

 JsonExtract.lastError = lastErr || 'all stages failed';
 if(typeof console!== 'undefined' && console.debug){
 console.debug('[JsonExtract] all stages failed; first 200 chars:', cleaned.slice(0,200));
 }
 return null;
 },

 // Returns {ok:true,value} or {ok:false,error}. Never throws.
 tryParseSafe(text){
 if(text == null) return {ok:false, error:'null input'};
 if(typeof text!== 'string' ||!text.trim()) return {ok:false, error:'empty input'};
 try { return {ok:true, value: JSON.parse(text)}; }
 catch(e){ return {ok:false, error: e.message}; }
 },

 // Strip leading "here is the JSON: …" prose and ```fence``` blocks.
 // If a fence exists, take its body; otherwise trim leading non-JSON prose
 // up to the first `{` or `[`.
 stripProse(text){
 const fence = text.match(/```(?:json|JSON)?\s*([\s\S]*?)```/);
 if(fence) return fence[1];
 const firstObj = text.indexOf('{'), firstArr = text.indexOf('[');
 if(firstObj === -1 && firstArr === -1) return text;
 const start = firstObj === -1? firstArr: firstArr === -1? firstObj: Math.min(firstObj, firstArr);
 return text.slice(start);
 },

 // Remove JS-style line and block comments OUTSIDE strings.
 // Strings containing `//` or `/*` are preserved verbatim.
 stripJsComments(text){
 let out = '';
 let i = 0;
 const n = text.length;
 let inStr = false, quoteCh = '';
 while(i < n){
 const ch = text[i], next = text[i+1];
 if(inStr){
 out += ch;
 if(ch === '\\' && i+1 < n){ out += text[i+1]; i += 2; continue; }
 if(ch === quoteCh) inStr = false;
 i++; continue;
 }
 if(ch === '"' || ch === "'"){ inStr = true; quoteCh = ch; out += ch; i++; continue; }
 if(ch === '/' && next === '/'){
 i += 2;
 while(i < n && text[i]!== '\n') i++;
 continue;
 }
 if(ch === '/' && next === '*'){
 i += 2;
 while(i < n &&!(text[i] === '*' && text[i+1] === '/')) i++;
 i += 2;
 continue;
 }
 out += ch; i++;
 }
 return out;
 },

 // Remove trailing commas before } or]. Walks the string respecting
 // string boundaries so commas inside strings are untouched.
 stripTrailingCommas(text){
 let out = '';
 let i = 0;
 const n = text.length;
 let inStr = false, quoteCh = '';
 while(i < n){
 const ch = text[i];
 if(inStr){
 out += ch;
 if(ch === '\\' && i+1 < n){ out += text[i+1]; i += 2; continue; }
 if(ch === quoteCh) inStr = false;
 i++; continue;
 }
 if(ch === '"' || ch === "'"){ inStr = true; quoteCh = ch; out += ch; i++; continue; }
 if(ch === ','){
 let j = i+1;
 while(j < n && /\s/.test(text[j])) j++;
 if(j < n && (text[j] === '}' || text[j] === ']')){
 i++; continue; // skip the comma
 }
 }
 out += ch; i++;
 }
 return out;
 },

 // Find the first balanced {...} or [...] and return just that substring.
 // Returns the original text on failure.
 locateBalancedJson(text){
 const firstObj = text.indexOf('{'), firstArr = text.indexOf('[');
 if(firstObj === -1 && firstArr === -1) return text;
 const start = firstObj === -1? firstArr: firstArr === -1? firstObj: Math.min(firstObj, firstArr);
 const open = text[start];
 const close = open === '{'? '}': ']';
 let depth = 0, inStr = false, esc = false, quoteCh = '';
 for(let i = start; i < text.length; i++){
 const ch = text[i];
 if(inStr){
 if(esc){ esc = false; continue; }
 if(ch === '\\'){ esc = true; continue; }
 if(ch === quoteCh) inStr = false;
 continue;
 }
 if(ch === '"' || ch === "'"){ inStr = true; quoteCh = ch; continue; }
 if(ch === open) depth++;
 else if(ch === close){
 depth--;
 if(depth === 0) return text.slice(start, i+1);
 }
 }
 return text; // unbalanced; let parser produce the error
 }
 };

/* ============================================================
   结构化输出解析链（2026-09-01 架构评审候选 1 迁入）。
   原实现散在 workshop4.js（parseStructured / 表格 / 宽松 JSON / 截断抢救），
   与 JsonExtract 形成两套解析实现。现全部收进本模块：
   structured(rawText, schemaKey) 是唯一入口，Work4 只留薄委托。
   ============================================================ */

// 智能/全角引号 → ASCII（仅严格解析失败后兜底启用）
function normalizeJsonQuotes(text){
  if(!text) return text;
  return String(text)
    .replace(/[“”„‟＂]/g, '"')   // 智能/全角双引号 → "
    .replace(/[‘’‚‛＇]/g, "'");  // 智能/全角单引号 → '
}

// JSON 字符串值内的裸换行/回车/制表符转义（状态机；引号归一化之后跑）
function escapeBareNewlines(text){
  if(!text) return text;
  let out = '', inStr = false;
  for(let i=0;i<text.length;i++){
    const ch = text[i];
    if(ch === '\\'){ out += ch + (text[i+1]||''); i++; continue; }
    if(ch === '"'){ inStr = !inStr; out += ch; continue; }
    if(inStr){
      if(ch === '\n'){ out += '\\n'; continue; }
      if(ch === '\r'){ out += '\\r'; continue; }
      if(ch === '\t'){ out += '\\t'; continue; }
    }
    out += ch;
  }
  return out;
}

// 宽松 JSON：严格 → 引号归一化 → 归一化+裸换行转义。返回 {value, via} 或 null。
function lenientJsonParse(body){
  if(!body || typeof body !== 'string') return null;
  try{ return {value: JSON.parse(body), via:'strict'}; }catch(e){}
  try{ return {value: JSON.parse(normalizeJsonQuotes(body)), via:'quotes'}; }catch(e){}
  try{ return {value: JSON.parse(escapeBareNewlines(normalizeJsonQuotes(body))), via:'quotes+newlines'}; }catch(e){}
  return null;
}

// max_tokens 截断抢救：数组内完整元素前缀补 ']' 救回。返回 {value, via} 或 null。
function salvageJsonArray(rawText){
  if(!rawText || typeof rawText !== 'string') return null;
  let body = null;
  const fenceRe = /```(?:json|JSON)?[^\n]*\n([\s\S]*?)(?:```|$)/g;
  let m, last = null;
  while((m = fenceRe.exec(rawText)) !== null){ last = m[1]; }
  if(last != null && last.trim()) body = last;
  else {
    const start = rawText.indexOf('[');
    if(start === -1) return null;
    body = rawText.slice(start);
  }
  body = normalizeJsonQuotes(body);
  const arrStart = body.indexOf('[');
  if(arrStart === -1) return null;
  let depth = 1, inStr = false, esc = false, quoteCh = '';
  const ends = [];
  for(let i=arrStart+1; i<body.length; i++){
    const ch = body[i];
    if(inStr){
      if(esc){ esc = false; continue; }
      if(ch === '\\'){ esc = true; continue; }
      if(ch === quoteCh) inStr = false;
      continue;
    }
    if(ch === '"' || ch === "'"){ inStr = true; quoteCh = ch; continue; }
    if(ch === '[' || ch === '{'){ depth++; continue; }
    if(ch === ']' || ch === '}'){
      depth--;
      if(depth === 1) ends.push(i+1);
      if(depth === 0) break;
    }
  }
  for(let idx = ends.length-1; idx >= 0; idx--){
    const candidate = escapeBareNewlines(body.slice(0, ends[idx])) + ']';
    try{
      const v = JSON.parse(candidate);
      if(Array.isArray(v) && v.length) return {value: v, via:'salvaged'};
    }catch(e){}
  }
  return null;
}

// Markdown 表格块扫描（全角竖线/零宽字符/夹空行/缺一侧竖线均容忍）
function parseMarkdownTable(rawText){
  if(!rawText || typeof rawText !== 'string') return null;
  const text = String(rawText)
    .replace(/｜/g, '|')
    .replace(/[\u200B\u200C\u200D\u2060\uFEFF]/g, '');
  const lines = text.split(/\r?\n/).map(l => l.trim());
  const DASH_CELL = /^\s*:?[-–—―_=]{1,}:?\s*$/;
  function splitCells(l){
    return l.replace(/^\|/, '').replace(/\|$/, '').split('|').map(c => c.trim());
  }
  function kindOf(l){
    if(!l || l.indexOf('|') === -1) return 'other';
    const cells = splitCells(l);
    if(cells.length >= 2 && cells.every(c => DASH_CELL.test(c))) return 'sep';
    return 'row';
  }
  const kinds = lines.map(kindOf);
  let best = null;
  for(let i=0; i<lines.length; i++){
    if(kinds[i] !== 'row') continue;
    let j = i+1;
    while(j < lines.length && !lines[j]) j++;
    if(j >= lines.length || kinds[j] !== 'sep') continue;
    const header = splitCells(lines[i]);
    const rows = [];
    let k = j+1, gap = 0;
    while(k < lines.length){
      if(kinds[k] === 'row'){ rows.push(splitCells(lines[k])); gap = 0; }
      else if(!lines[k]){ if(++gap > 1) break; }
      else break;
      k++;
    }
    if(rows.length && (!best || rows.length > best.rows.length)){
      best = { header, rows };
    }
    i = j;
  }
  if(!best) return null;
  return best.rows.map(cells => {
    const obj = {};
    best.header.forEach((h, idx) => { obj[h] = cells[idx] || ''; });
    return obj;
  }).filter(r => Object.values(r).some(v => String(v).trim()));
}

// Markdown 表头 → schema 字段别名映射
const MT_ALIASES = {
  tiers: {
    '档位':'name', '名称':'name', 'tier':'name',
    '价格':'price', '单价':'price','price':'price',
    '单位':'unit', 'unit':'unit',
    '目标客群':'targetSegment', '客群':'targetSegment', 'segment':'targetSegment',
    '备注':'notes', '说明':'notes', 'notes':'notes',
    '主推':'hero', '主推款':'hero', 'hero':'hero'
  },
  channelPricing: {
    '渠道':'channel','channel':'channel',
    '价格调整':'priceAdjustment','调整':'priceAdjustment','priceAdjustment':'priceAdjustment',
    '理由':'rationale','原因':'rationale','rationale':'rationale'
  },
  promotions: {
    '节点':'occasion','节日':'occasion','occasion':'occasion',
    '折扣':'discount','机制':'discount','折扣/机制':'discount','discount':'discount',
    '时段':'period','时间':'period','period':'period'
  }
};

function mapTableRowByAliases(aliasMap, row){
  const out = {};
  for(const k of Object.keys(row)){
    const v = row[k];
    const key = aliasMap[k] || aliasMap[k.toLowerCase()] || k;
    if(key === 'price'){
      const m = String(v).replace(/[^\d.\-]/g,'');
      out[key] = parseFloat(m) || 0;
    } else if(key === 'hero'){
      out[key] = /^(是|yes|true|✓|✔|★|1)$/i.test(String(v).trim());
    } else {
      out[key] = v;
    }
  }
  return out;
}

// 表格给全行，截断 JSON 抢救给更准字段（hero）；按 name 配对，只补不覆盖。
function overlaySalvaged(rows, salvRows, schemaKey){
  if(schemaKey === 'tiers' && Array.isArray(rows) && Array.isArray(salvRows)){
    rows.forEach(r => {
      if(r.hero === true) return;
      const hit = salvRows.find(s => {
        const a = String(r && r.name || '').trim();
        const b = String(s && s.name || '').trim();
        return a && b && (a === b || a.indexOf(b) !== -1 || b.indexOf(a) !== -1);
      });
      if(hit && hit.hero === true) r.hero = true;
    });
  }
}

// 结构化输出唯一入口：JsonExtract.run → multi-fence → 归一化 → 截断抢救 → 表格 → schema 清洗
function structured(rawText, schemaKey){
  if(!rawText || typeof rawText !== 'string') return {ok:false, raw:rawText||'', reason:'empty input'};
  const raw = rawText;
  let parsed = null;
  if(schemaKey === 'tagList'){
    const text = String(rawText).trim();
    if(!text) return {ok:false, raw, reason:'empty'};
    try{
      const j = JSON.parse(text);
      if(Array.isArray(j)){
        const cleaned = j.map(x=>String(x||'').trim()).filter(Boolean);
        if(cleaned.length) return {ok:true, value:cleaned, raw, warnings:[]};
      }
    }catch(e){}
    const seps = text.split(/[,，、;；]/).map(s=>s.trim()).filter(Boolean);
    if(seps.length > 1) return {ok:true, value:seps, raw, warnings:[]};
    const lines = text.split(/\r?\n/)
      .map(l => l.replace(/^[\s\-\*•·]+/, '').trim())
      .filter(Boolean);
    if(lines.length) return {ok:true, value:lines, raw, warnings:[]};
    if(text) return {ok:true, value:[text], raw, warnings:[]};
    return {ok:false, raw, reason:'no items found'};
  }
  const warnings = [];
  JsonExtract.lastError = null;
  parsed = JsonExtract.run(rawText);
  {
    const allFences = rawText.match(/```(?:json|JSON)?\s*([\s\S]*?)```/g) || [];
    if(allFences.length >= 1){
      let best = parsed, bestLen = Array.isArray(parsed) ? parsed.length : 0;
      let bestVia = null;
      for(const f of allFences){
        const body = f.replace(/^```(?:json|JSON)?\s*/, '').replace(/```$/, '').trim();
        const got = lenientJsonParse(body);
        if(got){
          const v = got.value;
          const len = Array.isArray(v) ? v.length : (typeof v === 'object' && v ? 1 : 0);
          if(len > bestLen){ best = v; bestLen = len; bestVia = got.via; }
        }
      }
      if(best !== parsed && best != null){
        parsed = best;
        if(allFences.length > 1) warnings.push('fallback:multi-fence-largest');
        if(bestVia && bestVia !== 'strict') warnings.push('fallback:normalized-json');
      }
    }
  }
  if(parsed == null){
    const norm = escapeBareNewlines(normalizeJsonQuotes(rawText));
    if(norm !== rawText){
      const v = JsonExtract.run(norm);
      if(v != null){ parsed = v; warnings.push('fallback:normalized-json'); }
    }
  }
  if(parsed == null){
    const salv = salvageJsonArray(rawText);
    const mt = parseMarkdownTable(rawText);
    if(mt && mt.length){
      parsed = mt.map(mapTableRowByAliases.bind(null, MT_ALIASES[schemaKey]||{}));
      warnings.push('fallback:markdown-table');
      if(salv && Array.isArray(salv.value) && salv.value.length){
        overlaySalvaged(parsed, salv.value, schemaKey);
        warnings.push('fallback:truncated-json-salvaged');
      }
    } else if(salv && Array.isArray(salv.value) && salv.value.length){
      parsed = salv.value;
      warnings.push('fallback:truncated-json-salvaged');
    } else {
      return {ok:false, raw, reason: '无法解析为结构化字段：未找到 JSON 块或 Markdown 表格'};
    }
  }
  if(schemaKey === 'tiers'){
    if(!Array.isArray(parsed)) return {ok:false, raw, reason:'expected array of tiers'};
    const cleaned = parsed.map(t=>({
      name: String(t.name||t.tier||'').trim(),
      targetSegment: String(t.targetSegment||t.segment||'').trim(),
      price: typeof t.price==='number' ? t.price : parseFloat(t.price)||0,
      unit: String(t.unit||t.currency||'').trim(),
      hero: !!t.hero,
      notes: String(t.notes||'').trim()
    })).filter(t=>t.name);
    if(!cleaned.length) return {ok:false, raw, reason:'tiers array empty after clean'};
    return {ok:true, value:cleaned, raw, warnings};
  }
  if(schemaKey === 'channelPricing'){
    if(!Array.isArray(parsed)) return {ok:false, raw, reason:'expected array of channel pricing'};
    const cleaned = parsed.map(c=>({
      channel: String(c.channel||'').trim(),
      priceAdjustment: String(c.priceAdjustment||c.adjustment||'').trim(),
      rationale: String(c.rationale||'').trim()
    })).filter(c=>c.channel);
    if(!cleaned.length) return {ok:false, raw, reason:'channelPricing array empty after clean'};
    return {ok:true, value:cleaned, raw, warnings};
  }
  if(schemaKey === 'promotions'){
    if(!Array.isArray(parsed)) return {ok:false, raw, reason:'expected array of promotions'};
    const cleaned = parsed.map(p=> ({
      occasion: String(p.occasion||'').trim(),
      discount: String(p.discount||'').trim(),
      period: String(p.period||'').trim()
    })).filter(p=>p.occasion);
    if(!cleaned.length) return {ok:false, raw, reason:'promotions array empty after clean'};
    return {ok:true, value:cleaned, raw, warnings};
  }
  if(schemaKey === 'advertising'){
    if(!Array.isArray(parsed)) return {ok:false, raw, reason:'expected array of advertising'};
    const cleaned = parsed.map(a=>{
      const share = Number(a.share ?? a.budgetShare ?? 0);
      return {
        media: String(a.media||'').trim(),
        budgetShare: share,
        message: String(a.message||'').trim(),
        kpi: String(a.kpi||'').trim()
      };
    }).filter(a=>a.media);
    const total = cleaned.reduce((s,a)=>s+(a.budgetShare||0),0);
    if(total > 0 && Math.abs(total-100) > 0.5){
      const k = 100/total;
      cleaned.forEach(a=> a.budgetShare = Math.round(a.budgetShare*k*10)/10);
      warnings.push(`share 总和 ${total.toFixed(1)} 已归一到 100`);
    }
    return {ok:true, value:cleaned, raw, warnings};
  }
  if(schemaKey === 'structure'){
    if(!Array.isArray(parsed)) return {ok:false, raw, reason:'expected array of channel groups'};
    const cleaned = parsed.map(g=>({
      name: String(g.name||'').trim(),
      children: (Array.isArray(g.children)?g.children:[]).map(c=>({
        name: String(c.name||'').trim(),
        share: Number(c.share||0)
      })).filter(c=>c.name)
    })).filter(g=>g.name);
    cleaned.forEach(g=>{
      const total = g.children.reduce((s,c)=>s+(c.share||0),0);
      if(total > 0 && Math.abs(total-100) > 0.5){
        const k = 100/total;
        g.children.forEach(c=> c.share = Math.round(c.share*k*10)/10);
        warnings.push(`渠道组「${g.name}」share 总和 ${total.toFixed(1)} 已归一到 100`);
      }
    });
    return {ok:true, value:cleaned, raw, warnings};
  }
  if(schemaKey === 'pr'){
    if(!Array.isArray(parsed)) return {ok:false, raw, reason:'expected array of pr events'};
    const cleaned = parsed.map(e=>({
      event: String(e.event||'').trim(),
      timing: String(e.timing||e.time||'').trim(),
      expectedReach: String(e.expectedReach||e.reach||'').trim()
    })).filter(e=>e.event);
    return {ok:true, value:cleaned, raw, warnings};
  }
  if(schemaKey === 'salesPromotion'){
    if(!Array.isArray(parsed)) return {ok:false, raw, reason:'expected array of sales promotion'};
    const cleaned = parsed.map(s=>({
      tactic: String(s.tactic||'').trim(),
      mechanic: String(s.mechanic||'').trim(),
      period: String(s.period||'').trim()
    })).filter(s=>s.tactic);
    return {ok:true, value:cleaned, raw, warnings};
  }
  if(schemaKey === 'differentiators'){
    if(!Array.isArray(parsed)) return {ok:false, raw, reason:'expected array of strings'};
    return {ok:true, value: parsed.map(x=>String(x||'').trim()).filter(Boolean), raw, warnings};
  }
  if(schemaKey === 'skus'){
    if(!Array.isArray(parsed)) return {ok:false, raw, reason:'expected array of SKUs'};
    const cleaned = parsed.map(s=>({
      name: String(s.name||'').trim(),
      specs: String(s.specs||'').trim(),
      price_range: String(s.price_range||s.priceRange||'').trim(),
      differentiator: String(s.differentiator||'').trim()
    })).filter(s=>s.name);
    if(!cleaned.length) return {ok:false, raw, reason:'SKUs array empty after clean'};
    return {ok:true, value:cleaned, raw, warnings};
  }
  const tbl = parseMarkdownTable(rawText);
  if(tbl){
    const colAlias = {
      name:['name','档位','档位名','tier'],
      targetSegment:['targetSegment','目标客群','客群','target','segment'],
      price:['price','价格'],
      unit:['unit','单位','单位/币种','currency','币种'],
      hero:['hero','主力','主力款'],
      notes:['notes','备注'],
      channel:['channel','渠道'],
      priceAdjustment:['priceAdjustment','价格调整','adjustment'],
      rationale:['rationale','理由'],
      occasion:['occasion','节点','occasion'],
      discount:['discount','折扣','折扣/机制','mechanic'],
      period:['period','时段','时间','time']
    };
    function pickCell(obj, fields){
      for(const f of fields){
        for(const k of Object.keys(obj)){
          if(colAlias[f] && colAlias[f].some(a => k.toLowerCase() === a.toLowerCase())) return obj[k];
        }
      }
      return '';
    }
    if(schemaKey === 'tiers'){
      const cleaned = tbl.map(r=>({
        name: String(pickCell(r,['name'])).trim(),
        targetSegment: String(pickCell(r,['targetSegment'])).trim(),
        price: parseFloat(pickCell(r,['price'])) || 0,
        unit: String(pickCell(r,['unit'])).trim(),
        hero: /主力|hero/i.test(Object.values(r).join('|')),
        notes: String(pickCell(r,['notes'])).trim()
      })).filter(t=>t.name);
      if(cleaned.length) return {ok:true, value:cleaned, raw, warnings:['从 Markdown 表格解析（LLM 未出 JSON 块）']};
    }
    if(schemaKey === 'channelPricing'){
      const cleaned = tbl.map(r=>({
        channel: String(pickCell(r,['channel'])).trim(),
        priceAdjustment: String(pickCell(r,['priceAdjustment'])).trim(),
        rationale: String(pickCell(r,['rationale'])).trim()
      })).filter(c=>c.channel);
      if(cleaned.length) return {ok:true, value:cleaned, raw, warnings:['从 Markdown 表格解析']};
    }
    if(schemaKey === 'promotions'){
      const cleaned = tbl.map(r=>({
        occasion: String(pickCell(r,['occasion'])).trim(),
        discount: String(pickCell(r,['discount'])).trim(),
        period: String(pickCell(r,['period'])).trim()
      })).filter(p=>p.occasion);
      if(cleaned.length) return {ok:true, value:cleaned, raw, warnings:['从 Markdown 表格解析']};
    }
  }
  return {ok:true, value:parsed, raw, warnings};
}

JsonExtract.structured = structured;
JsonExtract.parseMarkdownTable = parseMarkdownTable;
JsonExtract.normalizeJsonQuotes = normalizeJsonQuotes;
JsonExtract.escapeBareNewlines = escapeBareNewlines;
JsonExtract.lenientJsonParse = lenientJsonParse;
JsonExtract.salvageJsonArray = salvageJsonArray;
JsonExtract.overlaySalvaged = overlaySalvaged;
JsonExtract.mapTableRowByAliases = mapTableRowByAliases;

 if(typeof window!== 'undefined') window.JsonExtract = JsonExtract;
 if(typeof module!== 'undefined' && module.exports) module.exports = JsonExtract;
})();
