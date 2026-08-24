/* ============================================================
 CallJsonStrict — strict LLM JSON caller.
 Loaded as a plain <script>. Attaches to window.CallJsonStrict.

 Depends on: SchemaCheck (window.SchemaCheck), JsonExtract (window.JsonExtract).
 The caller provides:
 - call(messages, opts) → returns the LLM response text
 - extractJson(text) → returns the parsed value or null
 - lastExtractError → string
 This decouples the strict loop from the actual API engine so the
 unit test can mock call/extractJson freely.

 Public API:
 run({ messages, schema, call, extractJson, lastExtractError, signal, onAttempt })
 → Promise<{ok:true, data, attempts} | {ok:false, error, attempts, lastErrors, raw}>

 `signal` is an AbortSignal; `onAttempt({n, text, parsed, errors})` is an
 optional observer (used by the aiButton UI to surface "retrying..." in
 the toast/label).
 ============================================================ */
(function(){
 'use strict';

 // Resolve SchemaCheck — in browser, it's a window global. In Node, the
 // test (or any consumer) must have called require() and pass it through
 // args.schemaChecker, OR we lazily require it here. The lazy require is
 // safe because the module is tiny and only loaded on first call.
 function getSchemaCheck(){
 if(typeof window!== 'undefined' && window.SchemaCheck) return window.SchemaCheck;
 if(typeof require!== 'undefined'){
 try { return require('./schema_check.js'); } catch(e){}
 }
 return null;
 }
 const SchemaCheck = getSchemaCheck();
 if(!SchemaCheck){
 throw new Error('CallJsonStrict: SchemaCheck not found. Load docs/lib/schema_check.js first.');
 }

 async function run(args){
 const { messages, schema, call, extractJson, lastExtractError, signal } = args;
 const messagesArr = Array.isArray(messages)? messages.slice(): [messages];
 let attempt = 0;
 let lastErrors = null;
 let lastRaw = null;

 while(attempt < 2){
 if(signal && signal.aborted){
 const e = new Error('aborted'); e.name = 'AbortError';
 throw e;
 }
 attempt++;
 let text;
 try {
 text = await call(messagesArr, {signal});
 } catch(e){
 if(e && e.name === 'AbortError') throw e;
 if(attempt >= 2){
 return {ok:false, error: e.message || String(e), attempts: attempt, lastErrors, raw: lastRaw};
 }
 continue; // retryable transport
 }
 lastRaw = text;
 const parsed = extractJson(text);
 if(parsed == null){
 lastErrors = [{path:'$', message: 'JSON parse failed: ' + (lastExtractError || 'unknown')}];
 } else if(!schema){
 return {ok:true, data: parsed, attempts: attempt};
 } else {
 const v = SchemaCheck.validate(parsed, schema);
 if(v.ok) return {ok:true, data: parsed, attempts: attempt};
 lastErrors = v.errors;
 }
 if(attempt >= 2) break;
 const retryNote = SchemaCheck.formatErrorsForRetry(lastErrors);
 const last = messagesArr[messagesArr.length - 1];
 messagesArr[messagesArr.length - 1] = {
...last,
 content: (last.content || '') + '\n\n' + retryNote
 };
 }
 return {
 ok: false,
 error: lastErrors? 'schema validation failed after 2 attempts': 'parse failed after 2 attempts',
 attempts: attempt,
 lastErrors,
 raw: lastRaw
 };
 }

 const CallJsonStrict = { run };
 if(typeof window!== 'undefined') window.CallJsonStrict = CallJsonStrict;
 if(typeof module!== 'undefined' && module.exports) module.exports = CallJsonStrict;
})();
