/* Node test: Runner 全局单任务锁状态机（2026-09-01 候选 4 抽出）。
   用 button:null 测纯状态机，不触碰 DOM。

   Run: node tests/runner.test.js
*/
'use strict';
const path = require('path');
const Runner = require(path.join(__dirname, '..', 'docs', 'lib', 'runner.js'));

let pass = 0, fail = 0;
function ok(name, cond, detail){
  if(cond){ pass++; console.log('PASS ' + name); }
  else { fail++; console.log('FAIL ' + name + (detail ? ' — ' + detail : '')); }
}

// start 返回任务句柄
const t1 = Runner.start({id:'a', label:'任务A', pausable:false});
ok('start returns task', !!t1 && t1.id === 'a' && t1.status === 'running');
ok('signal() returns AbortSignal', Runner.signal() && typeof Runner.signal().aborted === 'boolean');

// 单任务锁：并发 start 被拒
const t2 = Runner.start({id:'b', label:'任务B'});
ok('concurrent start rejected (single-task lock)', t2 === null);

// tick / setTotal
Runner.tick(2);
ok('tick advances done', Runner.current.done === 2);
Runner.setTotal(5);
ok('setTotal updates total', Runner.current.total === 5);

// checkpoint 不暂停时立即通过
(async () => {
  await Runner.checkpoint();
  ok('checkpoint passes when running', true);

  // abort 语义
  Runner.abort();
  ok('abort sets aborted + signal', Runner.current.aborted === true && Runner.signal().aborted === true);
  let threw = false;
  try{ await Runner.checkpoint(); }catch(e){ threw = e && e.name === 'AbortError'; }
  ok('checkpoint throws AbortError after abort', threw);

  // finish 清空
  Runner.finish();
  ok('finish clears current', Runner.current === null);
  ok('signal() undefined after finish', Runner.signal() === undefined);

  // 三态机（2026-09-01 决策）：生成中→点击=暂停；暂停态再点击=中止（无恢复路径，
  // 断点续跑由重新点生成提供）。checkpoint 挂起的 promise 被中止唤醒并抛 AbortError。
  let pausedCalls = 0, resumedCalls = 0;
  const t3 = Runner.start({id:'c', label:'任务C', pausable:true, onPause:()=>pausedCalls++, onResume:()=>resumedCalls++});
  Runner.togglePause();
  ok('togglePause pauses', t3.paused === true && t3.status === 'paused');
  const cp = Runner.checkpoint(); // 暂停中挂起
  setTimeout(() => Runner.togglePause(), 5); // 暂停态再点击 = 中止
  let threwAb = false;
  try{ await cp; }catch(e){ threwAb = e && e.name === 'AbortError'; }
  ok('paused 再点击 = 中止（checkpoint 抛 AbortError）', threwAb && t3.aborted === true);
  ok('恢复路径已删（onResume 不触发）', resumedCalls === 0 && pausedCalls === 1);
  Runner.finish();

  // 暂停态 abort 幂等：再次 toggle 不炸
  const t5 = Runner.start({id:'e', label:'任务E', pausable:true});
  Runner.togglePause(); Runner.togglePause();
  Runner.togglePause();
  ok('中止后 togglePause 无害', t5.aborted === true && Runner.current === t5);
  Runner.finish();

  console.log(`\n${pass} pass / ${fail} fail`);
  process.exit(fail === 0 ? 0 : 1);
})().catch(e => { console.error('TEST CRASH', e); process.exit(1); });
