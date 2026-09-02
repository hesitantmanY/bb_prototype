/* Node test: UI 步骤挂载契约（2026-09-01 候选 4）。
   mountGuard / mountMvo / mountMark —— ADR 0001 语义原样保留。

   Run: node tests/ui_mount.test.js
*/
'use strict';
const path = require('path');

let pass = 0, fail = 0;
function ok(name, cond, detail){
  if(cond){ pass++; console.log('PASS ' + name); }
  else { fail++; console.log('FAIL ' + name + (detail ? ' — ' + detail : '')); }
}

function makeNode(tag, attrs, ...children){
  const node = {
    tag, attrs: attrs || {}, children: [], style: (attrs && attrs.style) || {},
    dataset: {},
    classList: { add(){}, remove(){}, toggle(){}, contains(){ return false; } },
    appendChild(c){ this.children.push(c); return c; },
    addEventListener(){ return this; },
    querySelector(){ return null; },
    querySelectorAll(){ return []; },
    set innerHTML(v){ this._innerHTML = v; this.children = []; },
    get innerHTML(){ return this._innerHTML || ''; },
    set textContent(v){ this._text = v; },
    get textContent(){ return this._text; }
  };
  (children || []).flat().forEach(c => { if(c != null) node.appendChild(c); });
  if(children.length === 1 && typeof children[0] === 'string') node._text = children[0];
  return node;
}

global.el = makeNode;
global.clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
global.latinize = s => s;
global.state = { meta: { isDemo: false } };

const UI = require(path.join(__dirname, '..', 'docs', 'lib', 'ui.js'));

// mountGuard：未渲染 → true；已渲染 → refreshDynamic + false
let refreshed = 0;
const W = { RENDER_VERSION: '2', refreshDynamic: id => { refreshed++; } };
const sec = { dataset: { rendered: '' }, appendChild(c){ this._appended = this._appended || []; this._appended.push(c); }, addEventListener(){}, querySelectorAll(){ return []; } };

ok('mountGuard returns true on fresh step', UI.mountGuard(sec, W, 'x') === true);
sec.dataset.rendered = '2';
ok('mountGuard returns false on cached step', UI.mountGuard(sec, W, 'x') === false);
ok('mountGuard calls refreshDynamic on cached step', refreshed === 1);

// mountMvo：按步 mvo 追加卡片
const mvoCfg = { checks: [], note: null };
const W2 = { RENDER_VERSION: '3', mvo: { y: () => mvoCfg } };
UI.mountMvo(sec, W2, 'y');
ok('mountMvo appends mvo card', (sec._appended || []).some(n => n && n.tag === 'div' && n.attrs && n.attrs.class === 'mvo-card'));

// mountMvo：W5 单 mvo 形态
const W5 = { RENDER_VERSION: '1', mvo: () => mvoCfg };
const sec5 = { dataset: { rendered: '' }, appendChild(c){ this._appended = this._appended || []; this._appended.push(c); }, addEventListener(){}, querySelectorAll(){ return []; } };
UI.mountMvo(sec5, W5, 'plan');
ok('mountMvo handles single-function mvo', (sec5._appended || []).length === 1);

// mountMark：标记渲染完成
UI.mountMark(sec, W2);
ok('mountMark sets rendered', sec.dataset.rendered === '3');

// mvoCard refresh 活体联动（ADR 0001：mvo 变化驱动 CTA 显隐）
const sec3 = { dataset: { rendered: '' }, appendChild(c){ this._appended = this._appended || []; this._appended.push(c); }, addEventListener(){}, querySelectorAll(){ return []; } };
const cfg = { checks: [{ label: 'ok', test: () => true }], note: null };
const card = UI.mvoCard(cfg, sec3);
ok('mvoCard exposes refresh', typeof card._refreshMvo === 'function');
const head = card.children[0] || {};
const progress = (head.children || []).find(c => c.attrs && c.attrs.class === 'mvo-progress');
ok('mvoCard marks all done', progress && progress._text === '1/1', JSON.stringify(head.children && head.children.map(c => c.attrs)));

delete global.el; delete global.clamp; delete global.latinize; delete global.state;
console.log(`\n${pass} pass / ${fail} fail`);
process.exit(fail === 0 ? 0 : 1);
