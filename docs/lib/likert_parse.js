/* ============================================================
 LikertParse — tolerant Likert-5 value parser.
 Loaded as a plain <script>. Attaches to window.LikertParse.

 The problem this solves: when an LLM returns
 {"answers":[{"questionId":"q1","value":"1-5的整数"}]}
 the existing code did `parseInt(value)` → NaN → silently dropped.
 That meant a survey with 5 personas × 10 questions could end up
 "analyzing" 30 responses when 50 were collected, with no UI hint.

 Public API:
 parseValue(raw, opts)
 opts: { min: 1, max: 5 } // default 1..5
 returns { ok: true, value: <int> }
 | { ok: false, reason: 'missing' | 'notInteger' | 'outOfRange' | 'wrongType' }

 parseAll(rawValues, opts)
 rawValues: array of {questionId, value}
 returns {
 byQuestionId: { q1: {ok:[3,5], dropped:[{reason, raw}]} },
 dropped: { total, byReason: {missing, notInteger, outOfRange, wrongType}, byQuestionId: {q1:{...}} }
 }

 Tolerant cases (we accept these without error):
 - numeric: 3, "3", 3.0, "3.0" → 3
 - leading/trailing whitespace: " 3 " → 3
 - Chinese digits: "三" → 3, "五" → 5 (because the survey prompt is Chinese)

 Hard-fail cases (with reason):
 - null / undefined / empty string → 'missing'
 - object / array / boolean → 'wrongType'
 - "1-5的整数", "评分", "N/A" → 'notInteger' (literal strings)
 - 6, 0, -1 → 'outOfRange'
 - "3.5" → 'notInteger' (Likert is integer)
 ============================================================ */
(function(){
 'use strict';

 const ZH_DIGITS = { '零':0,'一':1,'二':2,'三':3,'四':4,'五':5,'六':6,'七':7,'八':8,'九':9,'十':10 };

 function parseValue(raw, opts){
 opts = opts || {};
 const min = opts.min!= null? opts.min: 1;
 const max = opts.max!= null? opts.max: 5;
 if(raw == null || raw === ''){
 return { ok:false, reason:'missing' };
 }
 let n;
 if(typeof raw === 'number'){
 n = raw;
 } else if(typeof raw === 'string'){
 const t = raw.trim();
 if(t === ''){
 return { ok:false, reason:'missing' };
 }
 if(ZH_DIGITS.hasOwnProperty(t)){
 n = ZH_DIGITS[t];
 } else {
 // Reject "1-5的整数" / "评分" / "N/A" / "3.5" — not Number.parseInt-able
 // to a single bounded int without ambiguity. parseFloat would accept
 // "3.5" and we don't want that. Integer-shaped floats ("3.0"/"3.00")
 // are tolerated (AI07 — header docs promise "3.0" → 3).
 if(!/^-?\d+(\.0+)?$/.test(t)){
 return { ok:false, reason:'notInteger' };
 }
 n = parseInt(t, 10);
 }
 } else if(typeof raw === 'boolean'){
 return { ok:false, reason:'wrongType' };
 } else {
 return { ok:false, reason:'wrongType' };
 }
 if(!Number.isFinite(n) || Math.floor(n)!== n){
 return { ok:false, reason:'notInteger' };
 }
 if(n < min || n > max){
 return { ok:false, reason:'outOfRange' };
 }
 return { ok:true, value: n };
 }

 function parseAll(rawValues, opts){
 opts = opts || {};
 const out = {
 byQuestionId: {},
 dropped: { total: 0, byReason: { missing:0, notInteger:0, outOfRange:0, wrongType:0 }, byQuestionId: {} }
 };
 if(!Array.isArray(rawValues)) return out;
 for(const r of rawValues){
 const qid = r && r.questionId;
 if(!qid) continue;
 const slot = out.byQuestionId[qid] || (out.byQuestionId[qid] = { ok:[], dropped:[] });
 const slot2 = out.dropped.byQuestionId[qid] || (out.dropped.byQuestionId[qid] = { missing:0, notInteger:0, outOfRange:0, wrongType:0 });
 const v = parseValue(r.value, opts);
 if(v.ok){
 slot.ok.push(v.value);
 } else {
 slot.dropped.push({ reason:v.reason, raw:r.value });
 slot2[v.reason] = (slot2[v.reason] || 0) + 1;
 out.dropped.total++;
 out.dropped.byReason[v.reason] = (out.dropped.byReason[v.reason] || 0) + 1;
 }
 }
 return out;
 }

 const LikertParse = { parseValue, parseAll };
 if(typeof window!== 'undefined') window.LikertParse = LikertParse;
 if(typeof module!== 'undefined' && module.exports) module.exports = LikertParse;
})();
