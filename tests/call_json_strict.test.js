/* Node test for docs/lib/call_json_strict.js
 Mocks `call` (simulated LLM) and `extractJson` (uses real JsonExtract)
 to verify the retry/contract behavior.
*/
'use strict';
const path = require('path');
const SchemaCheck = require(path.join(__dirname, '..', 'docs', 'lib', 'schema_check.js'));
const JsonExtract = require(path.join(__dirname, '..', 'docs', 'lib', 'json_extract.js'));
const CallJsonStrict = require(path.join(__dirname, '..', 'docs', 'lib', 'call_json_strict.js'));

// Schema for Work1.askPersona — reused from schema_check.test.js
const askPersonaSchema = {
 type: 'object',
 required: ['answers'],
 fields: {
 answers: { type:'array', minLength:1, items:{
 type:'object', required:['questionId','value'],
 fields: {
 questionId: { type:'string', notEmpty:true },
 value: { type:'integer', min:1, max:5 }
 }
 }}
 }
};

let pass=0, fail=0;
function ok(name, cond, detail){
 if(cond){ pass++; console.log('PASS ' + name); }
 else { fail++; console.log('FAIL ' + name + (detail? ' — ' + detail: '')); }
}
function eq(name, got, expected){
 const o = JSON.stringify(got) === JSON.stringify(expected);
 if(o){ pass++; console.log('PASS ' + name); }
 else { fail++; console.log('FAIL ' + name + '\n got: ' + JSON.stringify(got) + '\n expected: ' + JSON.stringify(expected)); }
}

// Helper: a "call" mock that returns the next scripted response each time
function scriptedCall(responses){
 let i = 0;
 const calls = [];
 return {
 calls,
 fn: async (messages) => {
 calls.push(messages);
 if(i >= responses.length) throw new Error('scriptedCall: out of responses at call ' + (i+1));
 return responses[i++];
 }
 };
}

const baseMessages = [
 {role:'system', content:'You are a survey bot.'},
 {role:'user', content:'Answer please.'}
];

// ---- 1. Happy: 1st call valid → ok, attempts=1 ----
(async () => {
 const good = JSON.stringify({answers:[{questionId:'q1', value:3}]});
 const sc = scriptedCall([good]);
 const r = await CallJsonStrict.run({
 messages: baseMessages,
 schema: askPersonaSchema,
 call: sc.fn,
 extractJson: (t) => JsonExtract.run(t),
 lastExtractError: () => JsonExtract.lastError
 });
 ok('happy: ok=true', r.ok === true);
 ok('happy: attempts=1', r.attempts === 1);
 ok('happy: data has 1 answer', r.data && r.data.answers && r.data.answers.length === 1);
 ok('happy: only 1 LLM call', sc.calls.length === 1);

 // ---- 2. First invalid, second valid → ok, attempts=2, retry note appended ----
 const bad = JSON.stringify({answers:[{questionId:'q1', value:99}]}); // 99 out of range
 const sc2 = scriptedCall([bad, good]);
 const r2 = await CallJsonStrict.run({
 messages: baseMessages,
 schema: askPersonaSchema,
 call: sc2.fn,
 extractJson: (t) => JsonExtract.run(t),
 lastExtractError: () => JsonExtract.lastError
 });
 ok('retry: ok=true', r2.ok === true);
 ok('retry: attempts=2', r2.attempts === 2);
 ok('retry: 2 LLM calls', sc2.calls.length === 2);
 // Retry prompt must contain the failure hint
 const lastMsg2 = sc2.calls[1][sc2.calls[1].length - 1].content;
 ok('retry: 2nd user message contains "did not match"',
 /did not match/i.test(lastMsg2));
 ok('retry: 2nd user message contains original content',
 /Answer please/.test(lastMsg2));

 // ---- 3. Two invalid → ok=false, attempts=2, lastErrors present ----
 const sc3 = scriptedCall([bad, bad]);
 const r3 = await CallJsonStrict.run({
 messages: baseMessages,
 schema: askPersonaSchema,
 call: sc3.fn,
 extractJson: (t) => JsonExtract.run(t),
 lastExtractError: () => JsonExtract.lastError
 });
 ok('two-fail: ok=false', r3.ok === false);
 ok('two-fail: attempts=2', r3.attempts === 2);
 ok('two-fail: lastErrors present',
 Array.isArray(r3.lastErrors) && r3.lastErrors.length > 0);
 ok('two-fail: lastErrors mention value > 5',
 r3.lastErrors.some(e => /value > 5/.test(e.message)));

 // ---- 4. Garbage prose, no JSON, 1st fails parse, 2nd succeeds ----
 const sc4 = scriptedCall([
 'Sorry, I cannot answer that.',
 good
 ]);
 const r4 = await CallJsonStrict.run({
 messages: baseMessages,
 schema: askPersonaSchema,
 call: sc4.fn,
 extractJson: (t) => JsonExtract.run(t),
 lastExtractError: () => JsonExtract.lastError
 });
 ok('parse-fail-then-success: ok=true', r4.ok === true);
 ok('parse-fail-then-success: attempts=2', r4.attempts === 2);

 // ---- 5. Two garbage responses → ok=false, no lastErrors (parse failure path) ----
 const sc5 = scriptedCall(['nope', 'still nope']);
 const r5 = await CallJsonStrict.run({
 messages: baseMessages,
 schema: askPersonaSchema,
 call: sc5.fn,
 extractJson: (t) => JsonExtract.run(t),
 lastExtractError: () => JsonExtract.lastError
 });
 ok('two-parse-fail: ok=false', r5.ok === false);
 ok('two-parse-fail: attempts=2', r5.attempts === 2);

 // ---- 6. No schema → first valid returned as-is, no retry ----
 const sc6 = scriptedCall([good]);
 const r6 = await CallJsonStrict.run({
 messages: baseMessages,
 call: sc6.fn,
 extractJson: (t) => JsonExtract.run(t),
 lastExtractError: () => JsonExtract.lastError
 });
 ok('no-schema: ok=true', r6.ok === true);
 ok('no-schema: attempts=1', r6.attempts === 1);

 // ---- 7. AbortSignal pre-aborted throws AbortError ----
 const ctrl = new AbortController();
 ctrl.abort(); // pre-abort
 let threw = null;
 try {
 await CallJsonStrict.run({
 messages: baseMessages,
 schema: askPersonaSchema,
 call: async () => good,
 extractJson: (t) => JsonExtract.run(t),
 lastExtractError: () => JsonExtract.lastError,
 signal: ctrl.signal
 });
 } catch(e){ threw = e; }
 ok('abort: pre-aborted throws AbortError', threw && threw.name === 'AbortError');

 console.log(`\n${pass} pass / ${fail} fail`);
 process.exit(fail === 0? 0: 1);
})();
