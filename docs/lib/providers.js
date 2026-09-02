/* ============================================================
 Providers — provider/model capability whitelist.
 Loaded as a plain <script>. Attaches to window.Providers.

 Why this exists: the original code did
 if(provider!== 'gemini'){ opts.response_format = {type:'json_object'}; }
 which (a) breaks providers that don't accept the OpenAI shape
 (some Doubao / Zhipu / older Moonshot endpoints), and (b) gives
 Gemini nothing (Gemini uses a different JSON-mode mechanism that
 lives in T03's work on llm_proxy.py).

 Public API:
 getMode(provider, model) → 'openai_response_format' | 'gemini_response_mime_type' | 'none'
 getProviderConfig(provider) → full record (label, baseUrl hint, models dict) or null

 Provider support levels (locked 2026-08-20):
 - openai: full JSON mode (response_format json_object)
 - deepseek: full JSON mode (OpenAI-compatible, accepts response_format)
 - qwen: full JSON mode (DashScope OpenAI-compat accepts response_format)
 - gemini: Gemini-specific JSON mode (responseMimeType), handled by T03
 in llm_proxy.py; here the mode is recorded so callJson knows
 to send the trigger and T03 can map it.
 - zhipu: partial — GLM-4-Plus / GLM-4-Flash accept response_format.
 Other Zhipu models don't. Conservative default = "none".
 - moonshot: "none" — many older endpoints 400 on response_format.
 - doubao: "none" — Ark-style endpoints 400 on response_format.

 Add a new provider: append to PROVIDERS below, document the JSON
 mode behavior, and (if needed) extend llm_proxy.py.
 ============================================================ */
(function(){
 'use strict';

 const PROVIDERS = {
 openai: {
 label: 'OpenAI',
 jsonMode: 'openai_response_format',
 baseUrlHint: 'https://api.openai.com',
 models: {
 '*': { jsonMode: 'openai_response_format' }
 }
 },
 deepseek: {
 label: 'DeepSeek',
 jsonMode: 'openai_response_format',
 baseUrlHint: 'https://api.deepseek.com',
 models: {
 '*': { jsonMode: 'openai_response_format' }
 }
 },
 qwen: {
 label: '通义千问 (DashScope OpenAI-compat)',
 jsonMode: 'openai_response_format',
 baseUrlHint: 'https://dashscope.aliyuncs.com/compatible-mode',
 models: {
 '*': { jsonMode: 'openai_response_format' }
 }
 },
 gemini: {
 label: 'Google Gemini',
 jsonMode: 'gemini_response_mime_type', // T03 will handle this in llm_proxy.py
 baseUrlHint: 'https://generativelanguage.googleapis.com',
 models: {
 '*': { jsonMode: 'gemini_response_mime_type' }
 }
 },
 zhipu: {
 label: '智谱 GLM',
 jsonMode: 'none',
 baseUrlHint: 'https://open.bigmodel.cn/api/paas',
 models: {
 'glm-4-plus': { jsonMode: 'openai_response_format' },
 'glm-4-flash': { jsonMode: 'openai_response_format' },
 'glm-4-air': { jsonMode: 'openai_response_format' },
 'glm-4-airx': { jsonMode: 'openai_response_format' },
 '*': { jsonMode: 'none' }
 }
 },
 moonshot: {
 label: 'Moonshot (Kimi)',
 jsonMode: 'none',
 baseUrlHint: 'https://api.moonshot.cn',
 models: {
 // Moonshot v1 supports a guided JSON mode via a different param
 // (response_format={"type":"json_object"}) but historically 400'd
 // when sent in non-OpenAI mode. Conservative: "none".
 '*': { jsonMode: 'none' }
 }
 },
 doubao: {
 label: '豆包 (火山方舟)',
 jsonMode: 'none',
 baseUrlHint: 'https://ark.cn-beijing.volces.com/api/v3',
 models: {
 '*': { jsonMode: 'none' }
 }
 },
 custom: {
 label: '其他 (OpenAI 兼容)',
 jsonMode: 'openai_response_format',
 baseUrlHint: '',
 models: {
 '*': { jsonMode: 'openai_response_format' }
 }
 }
 };

 function getProviderConfig(provider){
 if(!provider) return null;
 return PROVIDERS[provider] || null;
 }

 function getMode(provider, model){
 const p = getProviderConfig(provider);
 if(!p) return 'none';
 const models = p.models || {};
 // Exact model match wins; otherwise '*' wildcard; otherwise provider default.
 if(model && models[model]) return models[model].jsonMode || 'none';
 if(models['*']) return models['*'].jsonMode || 'none';
 return p.jsonMode || 'none';
 }

 const Providers = { getProviderConfig, getMode, list: () => Object.keys(PROVIDERS) };
 if(typeof window!== 'undefined') window.Providers = Providers;
 if(typeof module!== 'undefined' && module.exports) module.exports = Providers;
})();
