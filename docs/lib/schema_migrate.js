/* ============================================================
 SchemaMigrate — 工作坊迁移注册表驱动（2026-09-01 候选 4 抽出）。

 每个工作坊声明 WorkN.workKey + WorkN.migrations（函数数组，接收该坊
 state 切片，可原地改或返回新对象）；壳层加载/导入/案例载入统一走
 runMigrations(state, workshops)。幂等由各迁移自身保证；返回值与
 JSON 前后对比用于检测是否发生变更（变更才落盘 + 提示，见 debug-log）。

 Public API（window.SchemaMigrate）：
   run(state, workshops) → boolean（是否发生结构变更）
 ============================================================ */
(function(){
  'use strict';

  function run(state, workshops){
    let changed = false;
    for(const W of (workshops || [])){
      const key = W && W.workKey;
      if(!key || !state || !state[key]) continue;
      for(const fn of (W.migrations || [])){
        if(typeof fn !== 'function') continue;
        try{
          const before = JSON.stringify(state[key]);
          const out = fn(state[key]);
          // 契约：迁移可原地改（靠 JSON 对比检测变更）或返回替换对象。
          // 布尔等非对象返回值一律忽略——2026-09-01 migrateDelphiWeights 曾
          // `return false`，旧条件 `out !== undefined` 把 work2 整片换成 false，
          // 每次刷新触发 healWork2「数据已损坏」并把空白模板写回存档。
          if(out && typeof out === 'object') state[key] = out;
          if(JSON.stringify(state[key]) !== before) changed = true;
        }catch(e){
          if(typeof console!=='undefined') console.warn('[migrate '+key+']', e);
        }
      }
    }
    return changed;
  }

  const SchemaMigrate = { run };
  if(typeof window!=='undefined') window.SchemaMigrate = SchemaMigrate;
  if(typeof module!=='undefined' && module.exports) module.exports = SchemaMigrate;
})();
