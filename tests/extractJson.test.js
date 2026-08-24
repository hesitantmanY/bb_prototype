/* Node.js test runner — runs the 25 fixtures against docs/lib/json_extract.js
 without needing a browser or the FastAPI server. Mirrors the browser test page
 logic (tests/extractJson.test.html) so they don't drift.

 Usage: node tests/extractJson.test.js
 Exits 0 on all-pass, 1 on any fail.
*/
'use strict';

const path = require('path');
const JsonExtract = require(path.join(__dirname, '..', 'docs', 'lib', 'json_extract.js'));

// Load fixtures (they live in a UMD-style file that defines window.EXTRACT_FIXTURES
// when run in a browser; for Node we read it and eval the literal in a sandbox-ish way).
const fs = require('fs');
const fxSrc = fs.readFileSync(path.join(__dirname, 'extractJson.fixtures.js'), 'utf8');
const sandbox = { EXTRACT_FIXTURES: null };
// eslint-disable-next-line no-new-func
new Function('sandbox', fxSrc + '\n; sandbox.EXTRACT_FIXTURES = EXTRACT_FIXTURES;')(sandbox);
const FIXTURES = sandbox.EXTRACT_FIXTURES;

function deepEqual(a, b){
 if(a === b) return true;
 if(a == null || b == null) return a === b;
 if(typeof a!== typeof b) return false;
 if(typeof a!== 'object') return a === b;
 const aArr = Array.isArray(a), bArr = Array.isArray(b);
 if(aArr!== bArr) return false;
 if(aArr){
 if(a.length!== b.length) return false;
 for(let i=0;i<a.length;i++) if(!deepEqual(a[i], b[i])) return false;
 return true;
 }
 const ka = Object.keys(a), kb = Object.keys(b);
 if(ka.length!== kb.length) return false;
 for(const k of ka){
 if(!Object.prototype.hasOwnProperty.call(b, k)) return false;
 if(!deepEqual(a[k], b[k])) return false;
 }
 return true;
}

let pass=0, fail=0, skip=0;
const failures = [];

FIXTURES.forEach((fx, i) => {
 const idx = String(i+1).padStart(2,'0');
 const got = JsonExtract.run(fx.input);

 if(fx.kind === 'skip'){
 skip++;
 console.log(`${idx} SKIP ${fx.name}`);
 return;
 }

 if(fx.kind === 'null'){
 if(got === null){
 pass++;
 console.log(`${idx} PASS ${fx.name}`);
 } else {
 fail++;
 failures.push({idx, fx, got});
 console.log(`${idx} FAIL ${fx.name} — expected null, got ${JSON.stringify(got).slice(0,100)}`);
 }
 return;
 }

 // 'ok'
 if(got!== null && deepEqual(got, fx.expected)){
 pass++;
 console.log(`${idx} PASS ${fx.name}`);
 } else {
 fail++;
 failures.push({idx, fx, got});
 console.log(`${idx} FAIL ${fx.name}\n input: ${JSON.stringify(fx.input).slice(0,80)}\n expected: ${JSON.stringify(fx.expected).slice(0,100)}\n got: ${got===null?'null':JSON.stringify(got).slice(0,100)}\n lastErr: ${JsonExtract.lastError || '(none)'}`);
 }
});

const total = FIXTURES.length;
console.log(`\n${pass} pass / ${fail} fail / ${skip} skip (total ${total})`);

if(fail > 0){
 console.log('\nFAILURES:');
 for(const f of failures){
 console.log(` ${f.idx} ${f.fx.name}: ${f.got===null?'null':JSON.stringify(f.got).slice(0,80)}`);
 }
 process.exit(1);
}
process.exit(0);
