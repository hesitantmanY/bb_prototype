/* Node test for docs/cases/loader.js
 Simulates a minimal window with Work1..Work5 defaultData() so we can
 exercise the loader without a browser. Also verifies that:
 - list() returns the registered case
 - has() / load() reject unknown brands
 - load('shanmu-tea') returns a 5-work state
 - load('shanmu-tea', {works:['work1']}) only fills work1; rest = defaults
 - deep-merge: case missing fields fall back to default
*/
'use strict';
const path = require('path');

// --- Minimal browser shim: window + WorkN.defaultData() --------------------
const fakeWindow = {};
// Each WorkN.defaultData returns a recognizable shape
function makeDefaultData(tag){
 return {
 _tag: tag,
 name: 'default-' + tag,
 items: ['default-a','default-b'],
 nested: { a:1, b:2 }
 };
}
fakeWindow.Work1 = { defaultData: () => makeDefaultData('work1') };
fakeWindow.Work2 = { defaultData: () => makeDefaultData('work2') };
fakeWindow.Work3 = { defaultData: () => makeDefaultData('work3') };
fakeWindow.Work4 = { defaultData: () => makeDefaultData('work4') };
fakeWindow.Work5 = { defaultData: () => makeDefaultData('work5') };
// Minimal case module — partial (missing `items` and `nested`) to test merge
fakeWindow.__case_shanmu_tea = {
 brand: 'shanmu-tea',
 label: '山木茶事 Shanmu Tea',
 summary: 'test',
 defaultWorks: ['work1','work2','work3','work4','work5'],
 getState(){
 return {
 work1: { name: 'shanmu', items: ['shanmu-leaf'], /* nested omitted */ },
 work2: { name: 'shanmu-w2' },
 work3: null, // explicit null — should fall back to default
 work4: { /* empty */ },
 work5: { name: 'shanmu-w5' }
 };
 }
};

global.window = fakeWindow;
global.document = { addEventListener:()=>{} };

// Load loader.js — it will read window.__case_shanmu_tea and attach window.Cases
require(path.join(__dirname, '..', 'docs', 'cases', 'loader.js'));
const Cases = fakeWindow.Cases;

let pass=0, fail=0;
function assert(name, cond, detail){
 if(cond){ pass++; console.log('PASS ' + name); }
 else { fail++; console.log('FAIL ' + name + (detail? ' — ' + detail: '')); }
}

assert('list() returns 1 case',
 Cases.list().length === 1,
 JSON.stringify(Cases.list()));

assert('list() entry has brand/label/summary',
 Cases.list()[0].brand === 'shanmu-tea' &&
 /山木茶事/.test(Cases.list()[0].label) &&
 typeof Cases.list()[0].summary === 'string');

assert('has("shanmu-tea") is true', Cases.has('shanmu-tea') === true);
assert('has("nope") is false', Cases.has('nope') === false);

let threw = false;
try { Cases.load('nope'); } catch(e){ threw = true; }
assert('load("nope") throws', threw);

const full = Cases.load('shanmu-tea');
assert('full has work1..work5',
 ['work1','work2','work3','work4','work5'].every(k => k in full));

assert('work1.name is case value', full.work1.name === 'shanmu');
assert('work1.items replaced (not concat)',
 Array.isArray(full.work1.items) && full.work1.items.length === 1 && full.work1.items[0] === 'shanmu-leaf',
 JSON.stringify(full.work1.items));
assert('work1.nested falls back to default (case omitted it)',
 full.work1.nested && full.work1.nested.a === 1 && full.work1.nested.b === 2,
 JSON.stringify(full.work1.nested));

assert('work3 (case=null) is replaced with full defaultData shape',
 full.work3 && full.work3._tag === 'work3' && full.work3.name === 'default-work3',
 JSON.stringify(full.work3));

assert('work4 (case empty object) is replaced with full defaultData shape',
 full.work4 && full.work4._tag === 'work4' && full.work4.name === 'default-work4',
 JSON.stringify(full.work4));

const partial = Cases.load('shanmu-tea', {works:['work2']});
assert('partial: only work2 has case value',
 partial.work2.name === 'shanmu-w2' &&
 partial.work1.name === 'default-work1' &&
 partial.work3.name === 'default-work3' &&
 partial.work4.name === 'default-work4' &&
 partial.work5.name === 'default-work5',
 JSON.stringify({w1:partial.work1.name, w2:partial.work2.name, w3:partial.work3.name, w4:partial.work4.name, w5:partial.work5.name}));

console.log(`\n${pass} pass / ${fail} fail`);
process.exit(fail === 0? 0: 1);
