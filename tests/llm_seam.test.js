/* Node test: LLM 输出接缝 —— 被测试的模块必须也是生产路径（候选 2）。

   2026-09-01 架构评审发现：server/gemini_body.py 与 server/llm_validate.py
   从未被 app.py / llm_proxy.py import，只有自测；前端 providers.js 从未挂载，
   API.callJson 用内联 provider!=='gemini' 判断。本测试用源码断言锁死接缝，
   防止「测试在测死代码」回归（ADR 0005 教训）。

   Run: node tests/llm_seam.test.js
*/
'use strict';
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
let pass = 0, fail = 0;
function ok(name, cond, detail){
  if(cond){ pass++; console.log('PASS ' + name); }
  else { fail++; console.log('FAIL ' + name + (detail ? ' — ' + detail : '')); }
}

const appSrc = fs.readFileSync(path.join(root, 'server', 'app.py'), 'utf8');
const proxySrc = fs.readFileSync(path.join(root, 'server', 'llm_proxy.py'), 'utf8');
const htmlSrc = fs.readFileSync(path.join(root, 'docs', 'global-brand-building.html'), 'utf8');
const w1Src = fs.readFileSync(path.join(root, 'docs', 'workshop1.js'), 'utf8');

// Server: request validation is wired into the live endpoint.
ok('app.py imports validate_llm_request',
  /from llm_validate import validate_llm_request/.test(appSrc));
ok('llm_endpoint calls validate_llm_request',
  /validate_llm_request\(req\.model_dump\(\)\)/.test(appSrc));
ok('llm_endpoint rejects invalid with 400',
  /raise HTTPException\(status_code=400/.test(appSrc));

// Server: the tested Gemini body builder is the production body builder.
ok('llm_proxy imports build_gemini_body',
  /from gemini_body import build_gemini_body/.test(proxySrc));
ok('_proxy_gemini delegates to build_gemini_body',
  /body = build_gemini_body\(messages, temperature, opts\)/.test(proxySrc));
ok('proxy_llm passes opts to _proxy_gemini',
  /_proxy_gemini\(\s*base_url, model, api_key, messages, temperature, opts\s*\)/.test(proxySrc));

// Frontend: providers.js is loaded and the JSON-mode negotiation uses it.
ok('HTML loads lib/providers.js',
  /<script src="lib\/providers\.js\?v=\d+"><\/script>/.test(htmlSrc));
ok('callJson negotiates mode via Providers.getMode',
  /Providers\.getMode\(provider, model\)/.test(htmlSrc));
ok('callJson maps openai/gemini modes to response_format',
  /mode==='openai_response_format' \|\| mode==='gemini_response_mime_type'/.test(htmlSrc));

// Frontend: AI JSON 调用与李克特解析走已加载的库（候选 1）。
ok('HTML loads schema_check.js',
  /<script src="lib\/schema_check\.js\?v=\d+"><\/script>/.test(htmlSrc));
ok('HTML loads call_json_strict.js',
  /<script src="lib\/call_json_strict\.js\?v=\d+"><\/script>/.test(htmlSrc));
ok('HTML loads likert_parse.js',
  /<script src="lib\/likert_parse\.js\?v=\d+"><\/script>/.test(htmlSrc));
// 2026-09-03：AI 溯源徽章与山木茶事批注层随资产删除（决策：不要 AI 标记、
// 案例只读）——反向断言锁死：被删的脚本不得重新出现在加载清单里。
ok('HTML no longer loads deleted ai_provenance.js',
  !/<script src="lib\/ai_provenance\.js/.test(htmlSrc));
ok('HTML no longer loads deleted demo_notes.js',
  !/<script src="lib\/demo_notes\.js/.test(htmlSrc));
ok('callJson delegates to CallJsonStrict.run',
  /CallJsonStrict\.run\(\{/.test(htmlSrc));
ok('callJson keeps transport errors throwing (raw==null)',
  /if\(r\.raw == null\) throw new Error\(r\.error/.test(htmlSrc));
ok('API.extractJson delegates to JsonExtract.run (one parser)',
  /if\(typeof JsonExtract!=='undefined' && JsonExtract\.run\)\{\s*return JsonExtract\.run\(text\);/.test(htmlSrc));
ok('workshop1 uses LikertParse.parseValue',
  /LikertParse\.parseValue\(an\?\.value\)/.test(w1Src));
ok('file_context.js deleted (unreferenced dead module)',
  !fs.existsSync(path.join(root, 'docs', 'lib', 'file_context.js')));

console.log(`\n${pass} pass / ${fail} fail`);
process.exit(fail === 0 ? 0 : 1);
