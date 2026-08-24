/* Node test for docs/lib/schema_check.js
 Pure unit test of validate() + formatErrorsForRetry(). No fetch mocking.
*/
'use strict';
const path = require('path');
const SchemaCheck = require(path.join(__dirname, '..', 'docs', 'lib', 'schema_check.js'));

let pass=0, fail=0;
function eq(name, got, expected){
 const ok = JSON.stringify(got) === JSON.stringify(expected);
 if(ok){ pass++; console.log('PASS ' + name); }
 else { fail++; console.log('FAIL ' + name + '\n got: ' + JSON.stringify(got) + '\n expected: ' + JSON.stringify(expected)); }
}
function ok(name, cond, detail){
 if(cond){ pass++; console.log('PASS ' + name); }
 else { fail++; console.log('FAIL ' + name + (detail? ' — ' + detail: '')); }
}

// ---- schema for Work1.askPersona ----
const askPersonaSchema = {
 type: 'object',
 required: ['answers'],
 fields: {
 answers: {
 type: 'array', minLength: 1,
 items: {
 type: 'object',
 required: ['questionId','value'],
 fields: {
 questionId: { type:'string', notEmpty:true },
 value: { type:'integer', min:1, max:5 }
 }
 }
 }
 }
};

// ---- schema for Work2.indicators ----
const indicatorsSchema = {
 type: 'object',
 required: ['attractiveness','competitiveness'],
 fields: {
 attractiveness: { type:'array', minLength:1, items:{
 type:'object', required:['name','rubric'],
 fields:{ name:{type:'string',notEmpty:true}, rubric:{
 type:'object', required:['high','mid','low'],
 fields:{ high:{type:'string',notEmpty:true}, mid:{type:'string',notEmpty:true}, low:{type:'string',notEmpty:true} }
 }}
 }},
 competitiveness: { type:'array', minLength:1, items:{
 type:'object', required:['name','rubric'],
 fields:{ name:{type:'string',notEmpty:true}, rubric:{
 type:'object', required:['high','mid','low'],
 fields:{ high:{type:'string',notEmpty:true}, mid:{type:'string',notEmpty:true}, low:{type:'string',notEmpty:true} }
 }}
 }}
 }
};

// ---- schema for Work3.nameTopics ----
const nameTopicsSchema = {
 type: 'object',
 required: ['topics'],
 fields: {
 topics: { type:'array', minLength:1, items:{
 type:'object', required:['id','label','description'],
 fields: {
 id: { type:'integer' },
 label: { type:'string', notEmpty:true, minLength:2, maxLength:12 },
 description: { type:'string', notEmpty:true }
 }
 }}
 }
};

// ---- 1. askPersona happy path ----
ok('askPersona happy: valid',
 SchemaCheck.validate({answers:[
 {questionId:'q1', value:3},
 {questionId:'q2', value:5}
 ]}, askPersonaSchema).ok);

// ---- 2. askPersona: value out of range ----
{
 const r = SchemaCheck.validate({answers:[{questionId:'q1', value:7}]}, askPersonaSchema);
 ok('askPersona: value=7 rejected',!r.ok && r.errors.some(e => /value > 5/.test(e.message)));
}

// ---- 3. askPersona: value as string (the schema-bleed case) ----
{
 const r = SchemaCheck.validate({answers:[{questionId:'q1', value:'1-5的整数'}]}, askPersonaSchema);
 ok('askPersona: value as string rejected',!r.ok && r.errors.some(e => /expected type integer/.test(e.message)));
}

// ---- 4. askPersona: missing required field ----
{
 const r = SchemaCheck.validate({answers:[{value:3}]}, askPersonaSchema);
 ok('askPersona: missing questionId rejected',
!r.ok && r.errors.some(e => /questionId/.test(e.path) && /required/.test(e.message)));
}

// ---- 5. askPersona: empty array ----
{
 const r = SchemaCheck.validate({answers:[]}, askPersonaSchema);
 ok('askPersona: empty array rejected',!r.ok && r.errors.some(e => /array length < 1/.test(e.message)));
}

// ---- 6. askPersona: missing top-level field ----
{
 const r = SchemaCheck.validate({}, askPersonaSchema);
 ok('askPersona: missing top-level answers',
!r.ok && r.errors.some(e => /answers/.test(e.path) && /required/.test(e.message)));
}

// ---- 7. indicators happy ----
ok('indicators happy: valid',
 SchemaCheck.validate({
 attractiveness: [{name:'市场规模', rubric:{high:'>100亿', mid:'10-100亿', low:'<10亿'}}],
 competitiveness: [{name:'品牌资产', rubric:{high:'头部', mid:'腰部', low:'尾部'}}]
 }, indicatorsSchema).ok);

// ---- 8. indicators: missing rubric field ----
{
 const r = SchemaCheck.validate({
 attractiveness: [{name:'A', rubric:{high:'x', mid:'y'}}], // missing 'low'
 competitiveness: [{name:'B', rubric:{high:'x', mid:'y', low:'z'}}]
 }, indicatorsSchema);
 ok('indicators: missing rubric.low',!r.ok && r.errors.some(e => /low/.test(e.path)));
}

// ---- 9. nameTopics happy ----
ok('nameTopics happy: valid',
 SchemaCheck.validate({
 topics: [{id:0, label:'节气饮茶', description:'东南亚华人对 24 节气的饮茶习惯'}]
 }, nameTopicsSchema).ok);

// ---- 10. nameTopics: empty label rejected (T07 critical) ----
{
 const r = SchemaCheck.validate({
 topics: [{id:0, label:'', description:'desc'}]
 }, nameTopicsSchema);
 ok('nameTopics: empty label rejected',!r.ok && r.errors.some(e => /label/.test(e.path) && /notEmpty/.test(e.message)));
}

// ---- 11. nameTopics: label too short (2 char min) ----
{
 const r = SchemaCheck.validate({
 topics: [{id:0, label:'茶', description:'desc'}]
 }, nameTopicsSchema);
 ok('nameTopics: 1-char label rejected',!r.ok && r.errors.some(e => /label/.test(e.path)));
}

// ---- 12. nameTopics: label too long (12 char max) ----
{
 const r = SchemaCheck.validate({
 topics: [{id:0, label:'12345678901234567890', description:'desc'}]
 }, nameTopicsSchema);
 ok('nameTopics: 20-char label rejected',!r.ok && r.errors.some(e => /label/.test(e.path)));
}

// ---- 13. nameTopics: description empty ----
{
 const r = SchemaCheck.validate({
 topics: [{id:0, label:'节气饮茶', description:''}]
 }, nameTopicsSchema);
 ok('nameTopics: empty description rejected',
!r.ok && r.errors.some(e => /description/.test(e.path) && /notEmpty/.test(e.message)));
}

// ---- 14. formatErrorsForRetry: contains path and message ----
{
 const r = SchemaCheck.validate({answers:[{questionId:'q1', value:99}]}, askPersonaSchema);
 const msg = SchemaCheck.formatErrorsForRetry(r.errors);
 ok('formatErrorsForRetry: contains path',
 msg.indexOf('$.answers[0].value')!== -1);
 ok('formatErrorsForRetry: contains "did not match" header',
 /did not match/.test(msg));
 ok('formatErrorsForRetry: contains re-emit instruction',
 /re-emit/i.test(msg));
}

// ---- 15. formatErrorsForRetry: caps at 5 errors ----
{
 const many = Array.from({length:20}, (_,i) => ({questionId:'q'+i, value:99}));
 const r = SchemaCheck.validate({answers:many}, askPersonaSchema);
 const msg = SchemaCheck.formatErrorsForRetry(r.errors);
 ok('formatErrorsForRetry: caps display at 5',
 r.errors.length === 20 && /\(15 more\)/.test(msg));
}

// ---- 16. null schema = pass-through ----
ok('null schema: pass-through', SchemaCheck.validate({anything:1}, null).ok === true);

// ---- 17. type 'any' accepts anything ----
ok("type 'any' accepts anything",
 SchemaCheck.validate('hello', {type:'any'}).ok &&
 SchemaCheck.validate(42, {type:'any'}).ok);

// ---- 18. wrong root type ----
ok('wrong root type rejected',
!SchemaCheck.validate('not an object', {type:'object',required:['x']}).ok);

console.log(`\n${pass} pass / ${fail} fail`);
process.exit(fail === 0? 0: 1);
