/* Node test: Archive 档案存取深模块（2026-09-01 架构评审候选 5）。

   快照的 list/create/rename/remove/restore 唯一入口，调用方不碰 URL 与
   project_id。测试用假 fetch 跨同一接缝，另锁死 HTML 不再残留内联
   /api/snapshots fetch。

   Run: node tests/archive.test.js
*/
'use strict';
const fs = require('fs');
const path = require('path');

const Archive = require(path.join(__dirname, '..', 'docs', 'lib', 'archive.js'));

let pass = 0, fail = 0;
function ok(name, cond, detail){
  if(cond){ pass++; console.log('PASS ' + name); }
  else { fail++; console.log('FAIL ' + name + (detail ? ' — ' + detail : '')); }
}

let calls = [];
function mockFetch(handler){
  global.fetch = async (url, opts = {}) => {
    calls.push({
      url: String(url),
      method: opts.method || 'GET',
      body: opts.body ? JSON.parse(opts.body) : null
    });
    return handler(url, opts);
  };
}
function res(body, status = 200){
  return { ok: status >= 200 && status < 300, status, json: async () => body };
}

async function main(){
  // list
  mockFetch(() => res([{id:'time_1', name:'2026-09-01 00:00:00', type:'time'}]));
  calls = [];
  const snaps = await Archive.list();
  ok('list returns snapshot array', Array.isArray(snaps) && snaps.length === 1);
  ok('list GETs default project', calls[0].url === 'http://localhost:8765/api/snapshots?project_id=default');
  ok('list uses GET', calls[0].method === 'GET');

  // create
  mockFetch(() => res({id:'named_v1', name:'v1', type:'named'}));
  calls = [];
  const snap = await Archive.create({name:'v1', overwrite:true});
  ok('create returns snapshot meta', snap.name === 'v1');
  ok('create POSTs project_id/name/overwrite',
    calls[0].method === 'POST' && calls[0].body.project_id === 'default' &&
    calls[0].body.name === 'v1' && calls[0].body.overwrite === true);

  // create with no name → null
  mockFetch(() => res({id:'time_1', name:'t', type:'time'}));
  calls = [];
  await Archive.create();
  ok('create without name sends null', calls[0].body.name === null && calls[0].body.overwrite === false);

  // rename
  mockFetch(() => res({id:'named_v1', name:'新名', type:'named'}));
  calls = [];
  await Archive.rename('named 1', '新名', {overwrite:true});
  ok('rename URL-encodes id', calls[0].url.includes('/api/snapshots/named%201/rename?project_id=default'));
  ok('rename POSTs name/overwrite', calls[0].method === 'POST' && calls[0].body.name === '新名' && calls[0].body.overwrite === true);

  // remove
  mockFetch(() => res({ok:true}));
  calls = [];
  const removed = await Archive.remove('time_1');
  ok('remove returns true', removed === true);
  ok('remove DELETEs snapshot', calls[0].method === 'DELETE' && calls[0].url === 'http://localhost:8765/api/snapshots/time_1?project_id=default');

  // restore
  mockFetch(() => res({ok:true, state:{work1:{sbu:{name:'X'}}}}));
  const st = await Archive.restore('named_v1');
  ok('restore returns state (not envelope)', st && st.work1 && st.work1.sbu.name === 'X');

  // error mapping surfaces server detail
  mockFetch(() => res({detail:'Snapshot not found'}, 404));
  let err = null;
  try{ await Archive.remove('missing'); }catch(e){ err = e.message; }
  ok('error surfaces server detail', err === 'Snapshot not found');

  // baseUrl is read live from window.state
  global.window = { state: { settings: { api: { backendUrl: 'http://localhost:9999/' } } } };
  mockFetch(() => res([]));
  calls = [];
  await Archive.list();
  ok('baseUrl read from window.state', calls[0].url.startsWith('http://localhost:9999/'));
  delete global.window;

  // shell no longer has inline snapshot fetches
  const htmlSrc = fs.readFileSync(path.join(__dirname, '..', 'docs', 'global-brand-building.html'), 'utf8');
  ok('HTML loads lib/archive.js', /<script src="lib\/archive\.js\?v=1"><\/script>/.test(htmlSrc));
  ok('no inline /api/snapshots fetches remain', !/fetch\(apiUrl\('\/api\/snapshots/.test(htmlSrc));
}

main().then(() => {
  console.log(`\n${pass} pass / ${fail} fail`);
  process.exit(fail === 0 ? 0 : 1);
}).catch(e => {
  console.error('TEST CRASH: ' + e.stack);
  process.exit(1);
});
