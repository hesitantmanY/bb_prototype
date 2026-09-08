/* Node test: ExportMenu 统一导出入口（2026-09-07）。
   覆盖：案例模式禁用、普通模式解锁、打印面板工作坊清单与默认空选。
   Run: node tests/export_menu.test.js
*/
'use strict';
const path = require('path');

let pass = 0, fail = 0;
function ok(name, cond, detail){
  if(cond){ pass++; console.log('PASS ' + name); }
  else { fail++; console.log('FAIL ' + name + (detail ? ' — ' + detail : '')); }
}

function fakeClassList(){
  const set = new Set();
  return {
    add: c => set.add(c),
    remove: c => set.delete(c),
    toggle: (c, force) => { const on = force !== undefined ? force : !set.has(c); on ? set.add(c) : set.delete(c); return on; },
    contains: c => set.has(c)
  };
}

const btn = {
  disabled: false,
  title: '',
  attrs: {},
  setAttribute(k, v){ this.attrs[k] = String(v); },
  addEventListener(){}
};
const popup = { classList: fakeClassList() };
global.state = { meta: { isDemo: true, demoCase: 'douya-mama' } };
global.document = {
  getElementById(id){
    if(id === 'exportBtn') return btn;
    if(id === 'exportMenuPopup') return popup;
    return null;
  },
  addEventListener(){}
};
global.window = { Work2: { steps: [{ id: 'framework' }, { id: 'evaluate' }, { id: 'decision' }] } };

const ExportMenu = require(path.join(__dirname, '..', 'docs', 'lib', 'export_menu.js'));

ok('module exposes md/openPrint/doPrint', typeof ExportMenu.md === 'function' && typeof ExportMenu.openPrint === 'function' && typeof ExportMenu.doPrint === 'function');

ExportMenu.sync();
ok('demo mode disables export button', btn.disabled === true);
ok('demo mode keeps aria-disabled', btn.attrs['aria-disabled'] === 'true');

state.meta.isDemo = false;
state.meta.demoCase = null;
ExportMenu.sync();
ok('normal mode enables export button', btn.disabled === false);
ok('normal mode clears aria-disabled', btn.attrs['aria-disabled'] === 'false');

ok('workshop label uses roman + title', ExportMenu._workLabel(2) === 'II · 目标市场');
ok('step count reads module steps', ExportMenu._stepCount(2) === 3);
ok('unknown workshop falls back to empty', ExportMenu._workLabel(9) === '');

delete global.state;
delete global.document;
delete global.window;
console.log(`\n${pass} pass / ${fail} fail`);
process.exit(fail === 0 ? 0 : 1);
