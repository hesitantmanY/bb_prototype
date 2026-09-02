/* Node test: Store 持久化适配器（2026-09-01 候选 4 抽出）。
   假 fetch / localStorage / $ 跨同一接缝。

   Run: node tests/store.test.js
*/
'use strict';
const path = require('path');

let pass = 0, fail = 0;
function ok(name, cond, detail){
  if(cond){ pass++; console.log('PASS ' + name); }
  else { fail++; console.log('FAIL ' + name + (detail ? ' — ' + detail : '')); }
}

const calls = [];
const fakeStore = {};
global.state = { settings: { api: { backendUrl: 'http://localhost:9999' } } };
global.DEFAULT_SETTINGS = { backendUrl: 'http://localhost:8765' };
global.STORAGE_KEY = 'gbw_atelier_v1';
global.apiUrl = p => 'http://localhost:9999' + p;
global.$ = () => null;
global.showToast = (msg) => { calls.push({ toast: msg }); };
global.mergeWithDefaults = s => ({ ...s, merged: true });
global.localStorage = {
  getItem: k => fakeStore[k] != null ? fakeStore[k] : null,
  setItem: (k, v) => { fakeStore[k] = v; },
  removeItem: k => { delete fakeStore[k]; }
};
global.fetch = async (url, opts = {}) => {
  calls.push({ url: String(url), method: opts.method || 'GET', body: opts.body ? JSON.parse(opts.body) : null });
  const h = handlers.shift();
  return h(url, opts);
};

let handlers = [];
function next(handler){ handlers.push(handler); }
function res(body, status = 200){
  return { ok: status >= 200 && status < 300, status, json: async () => body };
}

const Store = require(path.join(__dirname, '..', 'docs', 'lib', 'store.js'));

(async () => {
  // save
  next(() => res({ok:true}));
  calls.length = 0;
  const saved = await Store.save({ meta: {}, work1: {} });
  ok('save returns true', saved === true);
  ok('save PUTs /api/state with project_id + state', calls[0].url === 'http://localhost:9999/api/state' && calls[0].method === 'PUT');
  ok('save body has project_id default', calls[0].body.project_id === 'default');
  ok('save stamps meta.savedAt', typeof calls[0].body.state.meta.savedAt === 'string');

  // save failure → toast + false
  next(() => res({}, 500));
  const failed = await Store.save({ meta: {}, work1: {} });
  ok('save failure returns false', failed === false);
  ok('save failure toasts HTTP status', calls.some(c => c.toast && /保存失败: HTTP 500/.test(c.toast)));

  // load 404 → null
  next(() => res({}, 404));
  const none = await Store.load();
  ok('load 404 → null', none === null);

  // load ok
  next(() => res({ meta: {}, work1: { sbu: { name: 'X' } } }));
  const loaded = await Store.load();
  ok('load returns state', loaded && loaded.work1.sbu.name === 'X');
  ok('load GETs /api/state?project_id=default', calls.some(c => c.url === 'http://localhost:9999/api/state?project_id=default'));

  // migrateFromLocalStorage: legacy key → config PUT + state PUT + remove
  fakeStore['gbw_atelier_v1'] = JSON.stringify({
    meta: {},
    settings: { api: { provider: 'deepseek', baseUrl: 'https://x', model: 'm', temperature: 1, backendUrl: 'http://b', apiKey: 'legacy-secret' } },
    work1: {}
  });
  handlers = [
    () => res({ provider:'deepseek', apiKeyExists:false }),
    () => res({ok:true}),
    () => res({ok:true})
  ];
  calls.length = 0;
  const migrated = await Store.migrateFromLocalStorage();
  const configPut = calls.find(c => c.url === 'http://localhost:9999/api/config' && c.method === 'PUT');
  const statePut = calls.find(c => c.url === 'http://localhost:9999/api/state' && c.method === 'PUT');
  ok('migrate returns merged state', migrated && migrated.merged === true);
  ok('migrate PUTs config with legacy key', configPut && configPut.body.apiKey === 'legacy-secret');
  ok('migrate masks key in state', statePut && statePut.body.state.settings.api.apiKey === '********');
  ok('migrate removes localStorage key', fakeStore['gbw_atelier_v1'] == null);

  delete global.state; delete global.DEFAULT_SETTINGS; delete global.STORAGE_KEY;
  delete global.apiUrl; delete global.$; delete global.showToast; delete global.mergeWithDefaults;
  delete global.localStorage; delete global.fetch;
  console.log(`\n${pass} pass / ${fail} fail`);
  process.exit(fail === 0 ? 0 : 1);
})().catch(e => { console.error('TEST CRASH', e); process.exit(1); });
