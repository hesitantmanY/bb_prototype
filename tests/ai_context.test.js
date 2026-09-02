/* Node test for docs/lib/ai_context.js — sections registry, digest guardrails,
   cache stability, buildPrompt structure, few-shot registry.
   Run: node tests/ai_context.test.js
*/
'use strict';
const path = require('path');
const AiContext = require(path.join(__dirname, '..', 'docs', 'lib', 'ai_context.js'));

let pass=0, fail=0;
function ok(name, cond, detail){
  if(cond){ pass++; console.log('PASS ' + name); }
  else { fail++; console.log('FAIL ' + name + (detail? ' — ' + detail : '')); }
}

// --- helpers ---
ok('estimateTokens ~3 chars/token', AiContext.estimateTokens('abcdef') === 2);
ok('tr truncates with ellipsis', AiContext.tr('abcdefgh', 5) === 'abcde…');
ok('tr no-op under limit', AiContext.tr('abc', 5) === 'abc');

// --- registration ---
AiContext.register('t1', [
  {name:'a', label:'A节', priority:1, get: st => '内容A：' + (st?.val || '')},
  {name:'b', label:'B节', priority:2, get: st => '内容B'},
  {name:'c', label:'C节', priority:9, get: st => 'x'.repeat(5000)} // 超限节
]);
ok('sections() returns registered copy', AiContext.sections('t1').length === 3);
ok('sections() unknown work → []', AiContext.sections('nope').length === 0);

// --- digest: cap + omission note ---
const st = { val: 'v1' };
const dg = AiContext.digest('t1', { sections: ['a','b','c'], state: st });
ok('digest contains kept sections', dg.text.includes('内容A：v1') && dg.text.includes('内容B'));
ok('digest drops oversized low-priority section with note',
  !dg.text.includes('x'.repeat(100)) && dg.omitted.includes('C节') && dg.text.includes('已省略'));
ok('digest tokens within cap (~1000)', dg.tokens <= AiContext.DIGEST_TOKEN_CAP + 50, String(dg.tokens));

// --- digest: cache stability (same config + state → same key) ---
AiContext.clearCache();
const d1 = AiContext.digest('t1', { sections: ['a','b'], state: st });
const d2 = AiContext.digest('t1', { sections: ['b','a'], state: st }); // 顺序无关
ok('digest cache: order-insensitive same key', d1.key === d2.key && d1.text === d2.text);
const d3 = AiContext.digest('t1', { sections: ['a','b'], state: { val: 'v2' } });
ok('digest: upstream change → new key', d3.key !== d1.key);

// --- buildPrompt structure: stable prefix first ---
const messages = AiContext.buildPrompt({
  workId: 't1', sections: ['a'], system: 'SYS', instruction: 'DO IT', state: st
});
ok('buildPrompt: [system+digest, user]', messages.length === 2 &&
  messages[0].role === 'system' && messages[1].role === 'user' && messages[1].content === 'DO IT');
ok('buildPrompt: system carries SYS + digest', messages[0].content.startsWith('SYS') && messages[0].content.includes('内容A：v1'));

// --- few-shot as separate system message ---
AiContext.registerFewShot('t.key', '{"shape":true}');
const mfs = AiContext.buildPrompt({
  workId: 't1', sections: ['a'], system: 'SYS', instruction: 'GO', fewShot: 't.key', state: st
});
ok('buildPrompt with few-shot: 3 messages', mfs.length === 3 && mfs[1].role === 'system' && mfs[1].content.includes('"shape":true'));
ok('buildPrompt few-shot warns not to copy', mfs[1].content.includes('勿照抄'));
ok('fewShotText unknown key → ""', AiContext.fewShotText('missing') === '');
ok('standard delphi.weights example registered', AiContext.fewShotText('delphi.weights').includes('ratings'));

// --- standard section registry (spec table) ---
ok('work1 sections registered', AiContext.sections('work1').some(s=>s.name==='sbu'));
ok('work2 sections registered', AiContext.sections('work2').some(s=>s.name==='indicators') && AiContext.sections('work2').some(s=>s.name==='matrix'));
ok('work3 sections registered', AiContext.sections('work3').some(s=>s.name==='positioning') && AiContext.sections('work3').some(s=>s.name==='painMap'));
ok('work4 sections registered', AiContext.sections('work4').some(s=>s.name==='product'));
ok('work5 sections registered', AiContext.sections('work5').some(s=>s.name==='ch4_mix'));

// --- field-level truncation in standard getters ---
const bigState = {
  work1: {
    sbu: { name: 'S', category: 'C', scope: 'S'.repeat(500), summary: 'sum', boundary: 'b' },
    environment: { political: 'P'.repeat(500), economic: '', social: '', technological: '', industry: '', ourCapabilities: {} },
    personas: [{ id:'p1', name:'画', region:'R', painPoints: '痛'.repeat(200), values: [], quote: '' }]
  }
};
const envSec = AiContext.sections('work1').find(s=>s.name==='environment');
ok('environment getter truncates each dim ≤200', envSec.get(bigState).length <= 260);
const personaSec = AiContext.sections('work1').find(s=>s.name==='personas');
ok('personas getter truncates pain ≤120', personaSec.get(bigState).length <= 200);

console.log(`\n${pass} pass / ${fail} fail`);
process.exit(fail === 0 ? 0 : 1);
