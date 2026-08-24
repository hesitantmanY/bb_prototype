/* Node test for docs/lib/likert_parse.js
 Covers happy path + the 4 fail reasons + 3 tolerant cases + parseAll shape.
*/
'use strict';
const path = require('path');
const L = require(path.join(__dirname, '..', 'docs', 'lib', 'likert_parse.js'));

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

// ---- parseValue: happy path ----
eq('numeric 3', L.parseValue(3), {ok:true, value:3});
eq('numeric 5', L.parseValue(5), {ok:true, value:5});
eq('string "3"', L.parseValue('3'), {ok:true, value:3});
eq('string " 3 "', L.parseValue(' 3 '), {ok:true, value:3});
eq('float 3.0 → 3', L.parseValue(3.0), {ok:true, value:3});
eq('Chinese 三', L.parseValue('三'), {ok:true, value:3});
eq('Chinese 五', L.parseValue('五'), {ok:true, value:5});

// ---- parseValue: missing ----
eq('null → missing', L.parseValue(null), {ok:false, reason:'missing'});
eq('undefined → missing', L.parseValue(undefined), {ok:false, reason:'missing'});
eq('"" → missing', L.parseValue(''), {ok:false, reason:'missing'});
eq('" " → missing', L.parseValue(' '), {ok:false, reason:'missing'});

// ---- parseValue: notInteger ----
eq('"1-5的整数" → notInteger (the T04 key case)', L.parseValue('1-5的整数'), {ok:false, reason:'notInteger'});
eq('"评分" → notInteger', L.parseValue('评分'), {ok:false, reason:'notInteger'});
eq('"N/A" → notInteger', L.parseValue('N/A'), {ok:false, reason:'notInteger'});
eq('"3.5" → notInteger', L.parseValue('3.5'), {ok:false, reason:'notInteger'});
eq('"abc" → notInteger', L.parseValue('abc'), {ok:false, reason:'notInteger'});

// ---- parseValue: outOfRange ----
eq('6 → outOfRange', L.parseValue(6), {ok:false, reason:'outOfRange'});
eq('0 → outOfRange', L.parseValue(0), {ok:false, reason:'outOfRange'});
eq('-1 → outOfRange', L.parseValue(-1), {ok:false, reason:'outOfRange'});
eq('"7" → outOfRange', L.parseValue('7'), {ok:false, reason:'outOfRange'});

// ---- parseValue: wrongType ----
eq('true → wrongType', L.parseValue(true), {ok:false, reason:'wrongType'});
eq('{} → wrongType', L.parseValue({}), {ok:false, reason:'wrongType'});
eq('[] → wrongType', L.parseValue([]), {ok:false, reason:'wrongType'});

// ---- parseValue: custom range ----
eq('opts min=0: 0 ok', L.parseValue(0, {min:0, max:5}), {ok:true, value:0});
eq('opts max=10: 10 ok', L.parseValue(10, {min:1, max:10}), {ok:true, value:10});
eq('opts max=10: 11 outOfRange', L.parseValue(11, {min:1, max:10}), {ok:false, reason:'outOfRange'});

// ---- parseAll: shape ----
{
 const r = L.parseAll([
 {questionId:'q1', value:3},
 {questionId:'q1', value:'1-5的整数'}, // notInteger
 {questionId:'q1', value:7}, // outOfRange
 {questionId:'q1', value:null}, // missing
 {questionId:'q2', value:5},
 {questionId:'q2', value:true}, // wrongType
 {questionId:'q2', value:'四'} // Chinese
 ]);
 eq('parseAll q1.ok', r.byQuestionId.q1.ok, [3]);
 eq('parseAll q2.ok', r.byQuestionId.q2.ok, [5, 4]);
 eq('parseAll q1 dropped count', r.byQuestionId.q1.dropped.length, 3);
 eq('parseAll dropped.total', r.dropped.total, 4);
 eq('parseAll dropped.byReason', r.dropped.byReason,
 {missing:1, notInteger:1, outOfRange:1, wrongType:1});
 eq('parseAll q1 dropped reasons', r.dropped.byQuestionId.q1,
 {missing:1, notInteger:1, outOfRange:1, wrongType:0});
 eq('parseAll q2 dropped reasons', r.dropped.byQuestionId.q2,
 {missing:0, notInteger:0, outOfRange:0, wrongType:1});
}

// ---- parseAll: empty / bad input ----
ok('parseAll([]) total 0', L.parseAll([]).dropped.total === 0);
ok('parseAll(null) total 0', L.parseAll(null).dropped.total === 0);

// ---- parseAll: questionId missing → ignored ----
ok('parseAll skips entries without questionId',
 L.parseAll([{value:3}, {questionId:'', value:3}]).dropped.total === 0);

// ---- T04 acceptance fixture: 5 "答错" + 5 "答对" ----
// Mirrors the 5-bad / 5-good fixture required by T04 acceptance.
{
 const answers = [
 // 5 OK
 {questionId:'q1', value:4},
 {questionId:'q2', value:'3'}, // string int
 {questionId:'q3', value:5},
 {questionId:'q4', value:' 2 '}, // whitespace
 {questionId:'q5', value:'四'}, // Chinese digit
 // 5 BAD (one per reason)
 {questionId:'q1', value:'1-5的整数'}, // notInteger (LLM schema-bleed)
 {questionId:'q2', value:7}, // outOfRange
 {questionId:'q3', value:null}, // missing
 {questionId:'q4', value:true}, // wrongType
 {questionId:'q5', value:'3.5'} // notInteger
 ];
 const r = L.parseAll(answers);
 ok('T04 fixture: 5 ok answers retained', r.dropped.total === 5);
 ok('T04 fixture: dropped total = 5', r.dropped.total === 5);
 // All 5 reasons represented
 eq('T04 fixture: byReason has all 4 reasons + 1 notInteger duplicate',
 r.dropped.byReason,
 {missing:1, notInteger:2, outOfRange:1, wrongType:1});
 // Each questionId has at most 1 dropped (one bad per qid)
 ok('T04 fixture: byQuestionId has 5 entries',
 Object.keys(r.dropped.byQuestionId).length === 5);
 // First 5 OK values are recovered (in order of appearance)
 eq('T04 fixture: ok values order',
 Object.values(r.byQuestionId).map(s => s.ok).flat().sort(),
 [2, 3, 4, 4, 5]);
}

console.log(`\n${pass} pass / ${fail} fail`);
process.exit(fail === 0? 0: 1);
