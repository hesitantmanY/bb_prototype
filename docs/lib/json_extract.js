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

 // Main entry. See T01 acceptance in.wayfinder/tickets/T01-extractJson-tolerant.md
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

 if(typeof window!== 'undefined') window.JsonExtract = JsonExtract;
 if(typeof module!== 'undefined' && module.exports) module.exports = JsonExtract;
})();
