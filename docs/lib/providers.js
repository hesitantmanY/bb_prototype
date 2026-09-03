/* ============================================================
 Providers — provider/model capability whitelist + 默认预填单一来源。
 Loaded as a plain <script>. Attaches to window.Providers.

 Why this exists: the original code did
 if(provider!== 'gemini'){ opts.response_format = {type:'json_object'}; }
 which (a) breaks providers that don't accept the OpenAI shape
 (some Doubao / Zhipu / older Moonshot endpoints), and (b) gives
 Gemini nothing (Gemini uses a different JSON-mode mechanism that
 lives in T03's work on llm_proxy.py).

 Public API:
 getMode(provider, model) → 'openai_response_format' | 'gemini_response_mime_type' | 'none'
 getProviderConfig(provider) → full record (label, baseUrlHint, defaultModel, models dict) or null

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
 - minimax: "none" — response_format 支持按模型而异，保守置 none。
 - custom: full JSON mode (user-provided OpenAI-compatible endpoint).

 baseUrlHint = 服务端拼出请求 URL 所需前缀（llm_proxy 在其后追加
 /chat/completions 或 /models/{model}:generateContent），必须含 /v1 等段；
 设置弹层切换厂商时用它预填 Base URL（settings.js onProviderChange）。
 defaultModel = 同弹层预填的 Model（可改；与 README「配置 LLM」同步维护）。
 模型 ID 会随厂商迭代，预填只保证"选中即可用"，别当长期清单。

 Add a new provider: append to PROVIDERS below, document the JSON
 mode behavior, and (if needed) extend llm_proxy.py.
 ============================================================ */
(function(){
 'use strict';

 const PROVIDERS = {
 openai: {
 label: 'OpenAI',
 jsonMode: 'openai_response_format',
 baseUrlHint: 'https://api.openai.com/v1',
 defaultModel: 'gpt-4o-mini',
 models: {
 '*': { jsonMode: 'openai_response_format' }
 }
 },
 deepseek: {
 label: 'DeepSeek',
 jsonMode: 'openai_response_format',
 baseUrlHint: 'https://api.deepseek.com',
 defaultModel: 'deepseek-v4-flash',
 models: {
 '*': { jsonMode: 'openai_response_format' }
 }
 },
 qwen: {
 label: '通义千问',
 jsonMode: 'openai_response_format',
 baseUrlHint: 'https://dashscope.aliyuncs.com/compatible-mode',
 defaultModel: 'qwen3.6-flash',
 models: {
 '*': { jsonMode: 'openai_response_format' }
 }
 },
 gemini: {
 label: 'Google Gemini',
 jsonMode: 'gemini_response_mime_type', // T03 will handle this in llm_proxy.py
 baseUrlHint: 'https://generativelanguage.googleapis.com/v1beta',
 defaultModel: 'gemini-2.0-flash',
 models: {
 '*': { jsonMode: 'gemini_response_mime_type' }
 }
 },
 zhipu: {
 label: '智谱 GLM',
 jsonMode: 'none',
 baseUrlHint: 'https://open.bigmodel.cn/api/paas/v4',
 defaultModel: 'glm-5.3',
 models: {
 'glm-4-plus': { jsonMode: 'openai_response_format' },
 'glm-4-flash': { jsonMode: 'openai_response_format' },
 'glm-4-air': { jsonMode: 'openai_response_format' },
 'glm-4-airx': { jsonMode: 'openai_response_format' },
 '*': { jsonMode: 'none' }
 }
 },
 moonshot: {
 label: 'Kimi（Moonshot）',
 jsonMode: 'none',
 baseUrlHint: 'https://api.moonshot.cn/v1',
 defaultModel: 'kimi-k2.6',
 models: {
 // Moonshot v1 supports a guided JSON mode via a different param
 // (response_format={"type":"json_object"}) but historically 400'd
 // when sent in non-OpenAI mode. Conservative: "none".
 '*': { jsonMode: 'none' }
 }
 },
 doubao: {
 label: '火山方舟（豆包）',
 jsonMode: 'none',
 // 2026-09-03：按用户 Agent Plan 套餐端点（README 同源；/api/v3 是按量计费路径）
 baseUrlHint: 'https://ark.cn-beijing.volces.com/api/plan/v3',
 defaultModel: 'ark-code-latest',
 models: {
 // Ark 风格端点对 response_format 400，保守置 "none"。
 '*': { jsonMode: 'none' }
 }
 },
 minimax: {
 label: 'MiniMax',
 jsonMode: 'none',
 baseUrlHint: 'https://api.minimaxi.com/v1',
 defaultModel: 'MiniMax-M3',
 models: {
 // OpenAI 兼容端点；response_format 支持按模型而异，保守置 "none"。
 '*': { jsonMode: 'none' }
 }
 },
 custom: {
 label: '其他（OpenAI 兼容）',
 jsonMode: 'openai_response_format',
 baseUrlHint: '',
 defaultModel: '',
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
