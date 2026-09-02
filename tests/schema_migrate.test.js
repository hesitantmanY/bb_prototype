/* Node test: SchemaMigrate 迁移注册表驱动（2026-09-01 候选 4 抽出）。

   Run: node tests/schema_migrate.test.js
*/
'use strict';
const path = require('path');
const SchemaMigrate = require(path.join(__dirname, '..', 'docs', 'lib', 'schema_migrate.js'));

let pass = 0, fail = 0;
function ok(name, cond, detail){
  if(cond){ pass++; console.log('PASS ' + name); }
  else { fail++; console.log('FAIL ' + name + (detail ? ' — ' + detail : '')); }
}

const W2 = {
  workKey: 'work2',
  migrations: [
    // 返回新对象
    old => ({ ...old, migrated: true }),
    // 原地改（migrateDelphiWeights 风格）
    old => { old.released = true; }
  ]
};
const W3 = { workKey: 'work3', migrations: [old => { old.flagged = 1; }] };
const W1 = { workKey: 'work1', migrations: [] };

// 变更检测
let st = { work1: { a: 1 }, work2: { v: 0 }, work3: {} };
const changed = SchemaMigrate.run(st, [W1, W2, W3]);
ok('run returns true on change', changed === true);
ok('return-object migration applied', st.work2.migrated === true);
ok('in-place migration applied', st.work2.released === true && st.work3.flagged === 1);
ok('work1 untouched (no migrations)', st.work1.a === 1);

// 幂等：再跑一次无变更
const st2 = JSON.parse(JSON.stringify(st));
const changed2 = SchemaMigrate.run(st2, [W1, W2, W3]);
ok('idempotent rerun → false', changed2 === false);
ok('state unchanged on idempotent rerun', JSON.stringify(st2) === JSON.stringify(st));

// 缺 key / 缺 workshop 安全
ok('missing key skipped', SchemaMigrate.run({ work9: {} }, [W2]) === false);
ok('null workshops safe', SchemaMigrate.run({}, null) === false);
ok('migration throwing is caught', SchemaMigrate.run({ work2: { v: 1 } }, [{ workKey: 'work2', migrations: [() => { throw new Error('x'); }] }]) === false);

// 2026-09-01 回归（work2:false 毒数据每次刷新复现的根因）：
// 迁移返回布尔 ≠ 替换对象。migrateDelphiWeights 曾对 finalWeights:null
// `return false`，旧条件 `out !== undefined` 把 work2 整片替换成 false →
// healWork2 每次刷新弹「数据已损坏」并把空白模板写回存档。
const W4 = { workKey: 'work4', migrations: [() => false, old => { old.touched = 1; return true; }] };
const st3 = { work4: { v: 1 } };
const changed3 = SchemaMigrate.run(st3, [W4]);
ok('boolean return does not replace slice', typeof st3.work4 === 'object' && st3.work4.v === 1);
ok('in-place mutation by boolean-returning migration still detected', changed3 === true && st3.work4.touched === 1);
ok('false-returning migration alone → no change', SchemaMigrate.run({ work4: { v: 1 } }, [{ workKey: 'work4', migrations: [() => false] }]) === false);

console.log(`\n${pass} pass / ${fail} fail`);
process.exit(fail === 0 ? 0 : 1);
