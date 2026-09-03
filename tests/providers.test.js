/* Node test for docs/lib/providers.js — provider/model whitelist. */
'use strict';
const path = require('path');
const P = require(path.join(__dirname, '..', 'docs', 'lib', 'providers.js'));

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

// Known providers
ok('list() includes openai/deepseek/qwen/gemini/zhipu/moonshot/doubao',
 ['openai','deepseek','qwen','gemini','zhipu','moonshot','doubao'].every(k => P.list().includes(k)));

// OpenAI: any model → openai_response_format
ok('openai gpt-4 → openai_response_format',
 P.getMode('openai','gpt-4') === 'openai_response_format');
ok('openai gpt-4o-mini → openai_response_format',
 P.getMode('openai','gpt-4o-mini') === 'openai_response_format');
ok('openai unknown model → openai_response_format (wildcard)',
 P.getMode('openai','gpt-99-future') === 'openai_response_format');

// DeepSeek: any model
ok('deepseek deepseek-chat → openai_response_format',
 P.getMode('deepseek','deepseek-chat') === 'openai_response_format');
ok('deepseek deepseek-reasoner → openai_response_format',
 P.getMode('deepseek','deepseek-reasoner') === 'openai_response_format');

// Qwen: any model
ok('qwen qwen-plus → openai_response_format',
 P.getMode('qwen','qwen-plus') === 'openai_response_format');
ok('qwen qwen-turbo → openai_response_format',
 P.getMode('qwen','qwen-turbo') === 'openai_response_format');

// Gemini: any model → gemini_response_mime_type
ok('gemini gemini-1.5-pro → gemini_response_mime_type',
 P.getMode('gemini','gemini-1.5-pro') === 'gemini_response_mime_type');
ok('gemini gemini-2.0-flash → gemini_response_mime_type',
 P.getMode('gemini','gemini-2.0-flash') === 'gemini_response_mime_type');

// Zhipu: explicit GLM-4 models → openai_response_format; others → none
ok('zhipu glm-4-plus → openai_response_format',
 P.getMode('zhipu','glm-4-plus') === 'openai_response_format');
ok('zhipu glm-4-flash → openai_response_format',
 P.getMode('zhipu','glm-4-flash') === 'openai_response_format');
ok('zhipu glm-4-air → openai_response_format',
 P.getMode('zhipu','glm-4-air') === 'openai_response_format');
ok('zhipu glm-3-turbo → none (unsupported)',
 P.getMode('zhipu','glm-3-turbo') === 'none');
ok('zhipu unknown → none',
 P.getMode('zhipu','glm-9-future') === 'none');

// Moonshot: any model → none (conservative)
ok('moonshot moonshot-v1-8k → none',
 P.getMode('moonshot','moonshot-v1-8k') === 'none');
ok('moonshot moonshot-v1-32k → none',
 P.getMode('moonshot','moonshot-v1-32k') === 'none');

// Doubao: any model → none
ok('doubao doubao-pro-32k → none',
 P.getMode('doubao','doubao-pro-32k') === 'none');

// Custom (OpenAI-compatible): any model → openai_response_format
ok('custom gpt-4 → openai_response_format (OpenAI 兼容兜底)',
 P.getMode('custom','gpt-4') === 'openai_response_format');
ok('custom unknown model → openai_response_format (wildcard)',
 P.getMode('custom','anything') === 'openai_response_format');

// Unknown provider → none (safe default)
ok('unknown provider → none', P.getMode('foo','bar') === 'none');
ok('null provider → none', P.getMode(null,null) === 'none');
ok('undefined model → use wildcard', P.getMode('openai',undefined) === 'openai_response_format');

// getProviderConfig
ok('getProviderConfig(openai) returns object',
 P.getProviderConfig('openai') && typeof P.getProviderConfig('openai') === 'object');
ok('getProviderConfig(unknown) returns null',
 P.getProviderConfig('unknown') === null);
ok('getProviderConfig has label + baseUrlHint',
 P.getProviderConfig('deepseek').label && P.getProviderConfig('deepseek').baseUrlHint);

// 2026-09-03：下拉新增/修正的国内厂商预填（单一来源锁）
ok('list() includes minimax',
 P.list().includes('minimax'));
ok('moonshot baseUrlHint ends /v1（否则拼 /chat/completions 404）',
 P.getProviderConfig('moonshot').baseUrlHint.endsWith('/v1'),
 P.getProviderConfig('moonshot').baseUrlHint);
ok('zhipu baseUrlHint ends /v4（GLM 实际端点）',
 P.getProviderConfig('zhipu').baseUrlHint.endsWith('/v4'),
 P.getProviderConfig('zhipu').baseUrlHint);
ok('openai baseUrlHint ends /v1',
 P.getProviderConfig('openai').baseUrlHint.endsWith('/v1'));
ok('gemini baseUrlHint ends /v1beta',
 P.getProviderConfig('gemini').baseUrlHint.endsWith('/v1beta'));
eq('doubao defaultModel 预填', P.getProviderConfig('doubao').defaultModel, 'ark-code-latest');
eq('moonshot defaultModel 预填', P.getProviderConfig('moonshot').defaultModel, 'kimi-k2.6');
eq('minimax defaultModel 预填', P.getProviderConfig('minimax').defaultModel, 'MiniMax-M3');
ok('minimax any model → none (保守)',
 P.getMode('minimax','MiniMax-M3') === 'none');
ok('every listed provider has baseUrlHint + defaultModel fields',
 P.list().every(k => {
   const c = P.getProviderConfig(k);
   return c && typeof c.baseUrlHint === 'string' && typeof c.defaultModel === 'string';
 }));

console.log(`\n${pass} pass / ${fail} fail`);
process.exit(fail === 0? 0: 1);
