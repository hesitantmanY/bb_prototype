/* ============================================================
 FileContext — global pool of user-uploaded context files.

 Loaded as a plain <script>. Attaches to window.FileContext.

 Design (per 2026-08-24 decisions):
 - Single GLOBAL file pool (one drawer, shared across all workshops),
   not per-step.
 - Accepted: docx / xlsx / pdf / txt / md / csv (xlsx routes through
   /api/parse-excel; the rest through /api/extract-doc).
 - Limits: ≤5MB per file; total inlined context ≤30k tokens.
 - No RAG / retrieval index. File text is inlined verbatim into LLM
   prompts at the call site via buildContextBlock().
 - Files are NOT persisted to the server state store; they live for the
   browser session. (Text can be large; keeping it out of current.json
   avoids ballooning snapshots. Re-upload per session.)

 Public API:
   FileContext.list()                       → [{id,name,kind,chars,tokens,text}]
   FileContext.add(file)                    → Promise, extracts via server
   FileContext.remove(id)
   FileContext.clear()
   FileContext.totalTokens()                → rough token estimate
   FileContext.budgetTokens()               → 30000
   FileContext.withinBudget()               → bool
   FileContext.buildContextBlock(maxTokens) → string to append to a prompt,
                                              or '' if no files
   FileContext.on(cb)                       → subscribe to changes
 ============================================================ */
(function(){
 'use strict';

 const BUDGET_TOKENS = 30000;
 const MAX_FILE_BYTES = 5 * 1024 * 1024;
 const ACCEPTED = ['.docx','.xlsx','.pdf','.txt','.md','.csv'];

 // Rough mixed-language token estimate. Chinese runs ~1.5 chars/token,
 // English ~4 chars/token; 3 chars/token is a conservative middle for
 // CJK-heavy marketing docs.
 function estimateTokens(text){
   if(!text) return 0;
   return Math.ceil(text.length / 3);
 }

 let files = [];
 const listeners = new Set();
 function emit(){ listeners.forEach(cb=>{ try{ cb(files); }catch(e){} }); }

 function apiUrl(path){
   // same convention as the main shell
   const base = (typeof BACKEND_BASE !== 'undefined') ? BACKEND_BASE : '';
   return (base || '') + path;
 }

 async function extract(file){
   const name = (file.name || '').toLowerCase();
   const ext = '.' + name.split('.').pop();
   if(ACCEPTED.indexOf(ext) === -1){
     throw new Error('不支持的文件类型：' + ext + '（支持 ' + ACCEPTED.join(' / ') + '）');
   }
   if(file.size > MAX_FILE_BYTES){
     throw new Error('文件过大：' + (file.size/1024/1024).toFixed(1) + 'MB（单文件上限 5MB）');
   }
   const fd = new FormData();
   fd.append('file', file);
   const endpoint = ext === '.xlsx' ? '/api/parse-excel' : '/api/extract-doc';
   const res = await fetch(apiUrl(endpoint), { method:'POST', body: fd });
   if(!res.ok){
     let msg = 'HTTP ' + res.status;
     try{ const j = await res.json(); msg = j.detail || j.error || msg; }catch{}
     throw new Error(msg);
   }
   const data = await res.json();

   if(ext === '.xlsx'){
     // Flatten parsed spreadsheet (columns + row objects) into readable text.
     const parts = [];
     const cols = data.columns || [];
     if(cols.length) parts.push(cols.join(' | '));
     const rows = data.rows || [];
     rows.slice(0, 500).forEach(r=>{
       const cells = Array.isArray(r) ? r : cols.map(c=>r[c]);
       parts.push(cells.map(c=> (c==null?'':String(c)).trim()).join(' | '));
     });
     return { kind:'xlsx', text: parts.join('\n') };
   }
   return { kind: data.kind || ext.slice(1), text: data.text || '' };
 }

 async function add(file){
   const { kind, text } = await extract(file);
   const tokens = estimateTokens(text);
   const entry = {
     id: 'f_' + Math.random().toString(36).slice(2,10),
     name: file.name,
     kind,
     chars: text.length,
     tokens,
     text
   };
   files.push(entry);
   emit();
   return entry;
 }

 function remove(id){
   files = files.filter(f=>f.id!==id);
   emit();
 }

 function clear(){
   files = [];
   emit();
 }

 function list(){ return files.slice(); }
 function totalTokens(){ return files.reduce((a,f)=>a+f.tokens, 0); }
 function budgetTokens(){ return BUDGET_TOKENS; }
 function withinBudget(){ return totalTokens() <= BUDGET_TOKENS; }

 // Build a text block to append to an LLM prompt. Respects the token
 // budget by including files in upload order until the budget is met;
 // files that don't fit are noted as omitted.
 function buildContextBlock(maxTokens){
   const cap = Math.min(maxTokens || BUDGET_TOKENS, BUDGET_TOKENS);
   if(!files.length) return '';
   const parts = [];
   let used = 0;
   const omitted = [];
   for(const f of files){
     if(used + f.tokens > cap){
       omitted.push(f.name + '（约' + f.tokens + ' tokens，超出预算未包含）');
       continue;
     }
     parts.push(
       '--- 已上传资料：' + f.name + '（' + f.kind + '，约' + f.tokens + ' tokens）---\n' +
       f.text
     );
     used += f.tokens;
   }
   let block = parts.join('\n\n');
   if(omitted.length){
     block += '\n\n[以下资料因超出 token 预算未包含：' + omitted.join('；') + ']';
   }
   return block;
 }

 function on(cb){ listeners.add(cb); return ()=>listeners.delete(cb); }

 const FileContext = {
   list, add, remove, clear,
   totalTokens, budgetTokens, withinBudget,
   buildContextBlock, on,
   ACCEPTED, MAX_FILE_BYTES
 };
 if(typeof window!=='undefined') window.FileContext = FileContext;
 if(typeof module!=='undefined' && module.exports) module.exports = FileContext;
})();
