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

console.log(`\n${pass} pass / ${fail} fail`);
process.exit(fail === 0? 0: 1);
