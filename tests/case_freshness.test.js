/* Node test: 案例数据新鲜度（2026-09-02 用户反馈「矩阵空白、案例 work2 没做」）。
   根因：进入案例后刷新「保留现场」（2026-08-26 语义），案例源数据更新
   （bundle 重发）永远到不了补丁前已进入案例的浏览器 —— 旧现场被反复恢复。
   修复契约（App.refreshCaseIfStale，init 时调用）：
   1. 非案例工作区不动
   2. 旧会话（无 meta.caseFp）视为过期 → 重载案例内容 + 写指纹
   3. 指纹一致 → 保留现场（含案例内编辑）
   4. 指纹不一致（源数据更新）→ 重载 + 更新指纹
   5. 重载语义与进入案例一致：work1-3 合并、work4/5 整体替换、跑 schema 迁移
   Run: node tests/case_freshness.test.js
*/
'use strict';
const path = require('path');

let pass = 0, fail = 0;
function ok(name, cond, detail){
  if(cond){ pass++; console.log('PASS ' + name); }
  else { fail++; console.log('FAIL ' + name + (detail ? ' — ' + String(detail).slice(0,140) : '')); }
}

global.saveNow = async () => true;
let migrations = 0;
global.runSchemaMigrations = (st) => {
  migrations++;
  // 模拟 Work4.migrateKeyPartners 之类的幂等结构迁移：迁移会原地改数据。
  if(st && st.work4 && st.work4.place && Array.isArray(st.work4.place.structure)
    && st.work4.place.structure.length === 2
    && st.work4.place.structure[0].name === '线下'
    && st.work4.place.structure[1].name === '线上'){
    const tmp = st.work4.place.structure[0];
    st.work4.place.structure[0] = st.work4.place.structure[1];
    st.work4.place.structure[1] = tmp;
  }
};
const CASE_DATA = {
  work1: { a: 1 },
  work2: { scoring: { m1: { i1: { score: 8 } } } },
  work3: { candidates: [{ name: '卖点' }] },
  work4: { mix: 1 },
  work5: { ch1: 1 }
};
global.Cases = {
  has: b => b === 'demo',
  load: () => JSON.parse(JSON.stringify(CASE_DATA))
};

const App = require(path.join(__dirname, '..', 'docs', 'lib', 'app.js'));

// 1. 非案例工作区不动
let st = { meta:{}, work1:{}, work2:{}, work3:{}, work4:{}, work5:{} };
ok('无 demoCase 不动作', App.refreshCaseIfStale(st) === false);

// 2. 旧会话（无 caseFp）→ 重载 + 写指纹
st = { meta:{ demoCase:'demo' }, work1:{}, work2:{ scoring:{} }, work3:{}, work4:{ old:1 }, work5:{ old:1 } };
ok('旧会话重载案例内容', App.refreshCaseIfStale(st) === true && st.work2.scoring.m1?.i1?.score === 8);
ok('写回数字指纹', typeof st.meta.caseFp === 'number');
ok('重载跑 schema 迁移', migrations > 0);

// 3. 指纹一致（案例未更新）→ 保留现场（含案例内编辑）
const fp0 = st.meta.caseFp;
st.work1.userEdit = 'kept';
ok('未更新保留现场', App.refreshCaseIfStale(st) === false && st.work1.userEdit === 'kept');

// 4. 案例源数据更新 → 再次重载 + 指纹更新
CASE_DATA.work1.a = 2;
ok('更新后重载', App.refreshCaseIfStale(st) === true && st.work1.a === 2);
ok('指纹随源数据更新', st.meta.caseFp !== fp0);

// 5. work4/5 整体替换（不合并进入前内容，同进入案例语义）
st = { meta:{ demoCase:'demo' }, work1:{}, work2:{}, work3:{}, work4:{ stale:1 }, work5:{ stale:1 } };
App.refreshCaseIfStale(st);
ok('work4/5 整体替换', !('stale' in st.work4) && !('stale' in st.work5) && st.work4.mix === 1);

// 6. 指纹对内容敏感、与引用无关
ok('指纹内容敏感', App.caseFp(CASE_DATA) === App.caseFp(JSON.parse(JSON.stringify(CASE_DATA))));
const mutated = JSON.parse(JSON.stringify(CASE_DATA)); mutated.work5.ch1 = 9;
ok('指纹随内容变化', App.caseFp(CASE_DATA) !== App.caseFp(mutated));

// 7. 案例源不可用（bundle 未载入/品牌缺失）→ 静默跳过不抛错
global.Cases = { has: () => false, load: () => { throw new Error('no bundle'); } };
st = { meta:{ demoCase:'ghost' }, work1:{}, work2:{}, work3:{}, work4:{}, work5:{} };
ok('案例缺失静默跳过', App.refreshCaseIfStale(st) === false);

// 8. 案例指纹应基于迁移后数据：进入案例写入迁移后指纹，刷新时不能把
//    “迁移前 → 迁移后”误判成源数据更新（否则会重置案例内编辑）。
{
  global.Cases = { has: () => true, load: () => JSON.parse(JSON.stringify(CASE_DATA)) };
  CASE_DATA.work4 = {
    place: {
      keyPartners: ['小红书 KOC'],
      structure: [
        { name:'线下', children:[{ name:'门店', share:60 }] },
        { name:'线上', children:[{ name:'官网', share:40 }] }
      ]
    }
  };
  const loaded = Cases.load('demo');
  runSchemaMigrations(loaded);
  st = { meta:{ demoCase:'demo', caseFp: App.caseFp(loaded) }, work1:{ userEdit:'保留的编辑' }, work2:{}, work3:{}, work4:{ old:1 }, work5:{ old:1 } };
  let saveCalls = 0;
  const origSave = global.saveNow;
  global.saveNow = async () => { saveCalls++; return true; };
  const ret = App.refreshCaseIfStale(st);
  ok('迁移后指纹一致 → 不重载、不重置案例内编辑', ret === false && st.work1.userEdit === '保留的编辑');
  ok('不因指纹归一额外落盘', saveCalls === 0);
  global.saveNow = origSave;
}

(async function(){
  // 9. toggleDemo 也必须写“迁移后”指纹：进入案例与刷新比较用同一口径，
  //    否则刷新第一次就把新进入的案例误判成“源数据已更新”并重载。
  global.Cases = { has: () => true, load: () => JSON.parse(JSON.stringify(CASE_DATA)) };
  const origSave = global.saveNow;
  global.saveNow = async () => true;
  global.$ = () => ({ classList:{ add(){}, remove(){} }, textContent:'' });
  global.requestAnimationFrame = fn => fn();
  global.window = { scrollTo(){} };
  global.document = { body:{ classList:{ add(){}, remove(){} } }, addEventListener(){}, getElementById(){ return null; } };
  global.Work1 = { steps:[{ id:'metrics' }] };
  global.state = { meta:{ demoCase:null, demoSnapshot:null, isDemo:false, loadedFrom:null, loadedFromId:null }, work1:{}, work2:{}, work3:{}, work4:{}, work5:{}, settings:{ api:{} } };
  App.renderAll = () => {};
  App.updateSummary = () => {};
  await App.toggleDemo('demo');
  const expectedFp = App.caseFpMigrated(Cases.load('demo'));
  ok('进入案例写入迁移后指纹（与刷新口径一致）', state.meta.caseFp === expectedFp,
    'stored=' + state.meta.caseFp + ' expected=' + expectedFp);
  ok('进入案例后 work4 已迁移（结构归位/补桶）',
    state.work4.place.structure[0].name === '线上'
    && state.work4.place.structure[1].name === '线下',
    JSON.stringify((state.work4.place.structure || []).map(g => g && g.name)));
  global.saveNow = origSave;

  console.log(fail ? `\n${fail} FAILED` : `\nall ${pass} passed`);
  process.exit(fail ? 1 : 0);
})();
