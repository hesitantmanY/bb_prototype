/* Node test for docs/cases/loader.js
 Simulates a minimal window with Work1..Work5 defaultData() so we can
 exercise the loader without a browser. Also verifies that:
 - list() returns the registered case
 - has() / load() reject unknown brands
 - load('douya-mama') returns a 5-work state
 - load('douya-mama', {works:['work1']}) only fills work1; rest = defaults
 - deep-merge: case missing fields fall back to default
 (2026-08-27: shanmu-tea case removed from registry — now uses douya-mama.)
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
fakeWindow.__case_douya_mama = {
 brand: 'douya-mama',
 label: '豆芽妈妈 Douya Mama',
 summary: 'test',
 defaultWorks: ['work1','work2','work3','work4','work5'],
 getState(){
 return {
 work1: { name: 'douya', items: ['douya-leaf'], /* nested omitted */ },
 work2: { name: 'douya-w2' },
 work3: null, // explicit null — should fall back to default
 work4: { /* empty */ },
 work5: { name: 'douya-w5' }
 };
 }
};

global.window = fakeWindow;
global.document = { addEventListener:()=>{} };

// Load loader.js — it will read window.__case_douya_mama and attach window.Cases
require(path.join(__dirname, '..', 'docs', 'cases', 'loader.js'));
const Cases = fakeWindow.Cases;

let pass=0, fail=0;
function assert(name, cond, detail){
 if(cond){ pass++; console.log('PASS ' + name); }
 else { fail++; console.log('FAIL ' + name + (detail? ' — ' + detail: '')); }
}

const list = Cases.list();
assert('list() returns >=1 case', list.length >= 1, JSON.stringify(list));

const entry = list.find(c => c.brand === 'douya-mama');
assert('list() has douya-mama with brand/label/summary',
 !!entry && /豆芽妈妈/.test(entry.label) && typeof entry.summary === 'string',
 JSON.stringify(entry));

assert('has("douya-mama") is true', Cases.has('douya-mama') === true);
assert('has("nope") is false', Cases.has('nope') === false);

let threw = false;
try { Cases.load('nope'); } catch(e){ threw = true; }
assert('load("nope") throws', threw);

const full = Cases.load('douya-mama');
assert('full has work1..work5',
 ['work1','work2','work3','work4','work5'].every(k => k in full));

assert('work1.name is case value', full.work1.name === 'douya');
assert('work1.items replaced (not concat)',
 Array.isArray(full.work1.items) && full.work1.items.length === 1 && full.work1.items[0] === 'douya-leaf',
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

const partial = Cases.load('douya-mama', {works:['work2']});
assert('partial: only work2 has case value',
 partial.work2.name === 'douya-w2' &&
 partial.work1.name === 'default-work1' &&
 partial.work3.name === 'default-work3' &&
 partial.work4.name === 'default-work4' &&
 partial.work5.name === 'default-work5',
 JSON.stringify({w1:partial.work1.name, w2:partial.work2.name, w3:partial.work3.name, w4:partial.work4.name, w5:partial.work5.name}));

console.log(`\n${pass} pass / ${fail} fail`);
process.exit(fail === 0? 0: 1);
