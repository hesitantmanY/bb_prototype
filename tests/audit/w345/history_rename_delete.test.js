/* 审计证据脚本（w345_crud）：档案「重命名 / 删除」三条路径。

   跑法：node tests/audit/w345/history_rename_delete.test.js
   红 = 当前代码有 bug（本脚本按「修好后应为绿」写断言）。

   覆盖：
   A. 顶栏 ✎「重命名此档案」按钮：历史弹窗未打开时 #snapList 无行 →
      History.rename 第一行 `if(!row) return;` 静默 no-op。
   B. 行内重命名成功后，服务端返回的新 id 被丢弃 → state.meta.loadedFromId
      仍指向旧 id（快照文件已被 os.replace 改名）。
   C. 删除「当前档案」后 loadedFrom / loadedFromId 不清理，顶栏仍显示
      已删除的档案名，✎ 指向一个不存在的快照。
*/
'use strict';
const path = require('path');
const root = path.join(__dirname, '..', '..', '..');

let pass = 0, fail = 0;
function ok(name, cond, detail){
  if(cond){ pass++; console.log('PASS ' + name); }
  else { fail++; console.log('FAIL ' + name + (detail ? ' — ' + detail : '')); }
}

/* ---------- 最小 DOM ---------- */
const created = [];
function makeNode(tag, attrs){
  const node = {
    tag, attrs: attrs || {}, children: [], _listeners: {}, dataset: {},
    style: {}, hidden: false, className: '', _text: '',
    classList: { add(){}, remove(){}, contains(){ return false; } },
    appendChild(c){ if(c != null) this.children.push(c); return c; },
    addEventListener(t, fn){ (this._listeners[t] = this._listeners[t] || []).push(fn); },
    removeEventListener(t, fn){ this._listeners[t] = (this._listeners[t] || []).filter(f => f !== fn); },
    querySelector(){ return null; }, querySelectorAll(){ return []; },
    setAttribute(k, v){ this.attrs[k] = v; }, removeAttribute(k){ delete this.attrs[k]; },
    focus(){ this._focused = true; }, select(){ this._selected = true; },
    replaceWith(n){ this._replacedWith = n; if(this.parentNode){ const i=this.parentNode.children.indexOf(this); this.parentNode.children[i]=n; n.parentNode=this.parentNode; } },
    remove(){},
    get textContent(){ return this._text; }, set textContent(v){ this._text = String(v); },
    get innerHTML(){ return this._html || ''; }, set innerHTML(v){ this._html = v; this.children = []; }
  };
  return node;
}
const el = (tag, attrs = {}, ...children) => {
  const e = makeNode(tag, attrs);
  if(attrs && attrs.value != null) e.value = attrs.value;
  for(const c of children.flat()){
    if(c == null || c === false) continue;
    e.appendChild(typeof c === 'object' ? c : { tag:'#text', text:String(c), children:[] });
  }
  created.push(e);
  return e;
};

/* ---------- 全局 stub（history.js / app.js 的自由变量） ---------- */
const registry = new Map();
const $ = sel => {
  if(!registry.has(sel)) registry.set(sel, makeNode('div', {id:String(sel).replace(/^#/, '')}));
  return registry.get(sel);
};

let renameCalls = [];
let removeCalls = [];
let snapshots = [];
const toasts = [];

global.window = global;
global.$ = $;
global.el = el;
global.showToast = m => toasts.push(String(m));
global.confirm = () => true;
global.state = { meta: { loadedFrom: 'v1', loadedFromId: 'named_v1' } };
global.Archive = {
  list: async () => snapshots,
  rename: async (id, name, opts) => { renameCalls.push({id, name, opts}); return { id:'named_'+name, name, type:'named' }; },
  remove: async id => { removeCalls.push(id); return true; },
  restore: async () => ({})
};
const rows = [];
global.document = {
  querySelectorAll: () => rows,
  querySelector: () => null,
  getElementById: () => null,
  createElement: makeNode,
  body: { classList: { add(){}, remove(){}, contains(){ return false; } } }
};

const History = require(path.join(root, 'docs', 'lib', 'history.js'));
const App = require(path.join(root, 'docs', 'lib', 'app.js'));
global.History = History;

const tick = () => new Promise(r => setImmediate(r));

async function main(){
  /* ============ A. 顶栏 ✎ 重命名 ============ */
  App.updateArchiveLabel();
  const btn = $('#archiveRenameBtn');
  ok('A0 顶栏 ✎ 已接线到重命名', typeof btn.onclick === 'function' && btn.hidden === false);
  created.length = 0; renameCalls = []; toasts.length = 0;
  btn.onclick();                       // 用户点顶栏 ✎（历史弹窗从未打开 → #snapList 空）
  await tick();
  ok('A1 点顶栏 ✎ 有可见反馈或发起重命名（当前静默 no-op）',
     renameCalls.length > 0, 'Archive.rename 调用 0 次，toast=' + JSON.stringify(toasts) + '，新建节点 ' + created.length + ' 个');
  ok('A2 顶栏 ✎ 不依赖「历史记录弹窗先被打开过」',
     created.length > 0 || renameCalls.length > 0, '未创建任何输入控件（row 找不到直接 return）');

  /* ============ B. 行内重命名后 id 失联 ============ */
  snapshots = [{ id:'named_v1', name:'v1', type:'named', created_at: 0 }];
  const nameEl = makeNode('span'); nameEl.textContent = 'v1';
  const parent = makeNode('div'); parent.appendChild(nameEl);
  const row = { dataset: { id:'named_v1' }, querySelector: sel => (sel === '.snap-name' ? nameEl : null) };
  rows.length = 0; rows.push(row);
  created.length = 0; renameCalls = [];
  await History.rename('named_v1');
  const inp = created.find(n => n.tag === 'input' && n.attrs.class === 'snap-rename');
  ok('B0 重命名进入行内编辑（弹窗打开态）', !!inp);
  inp.value = '终版';
  const ev = { key:'Enter', preventDefault(){} };
  inp._listeners.keydown.forEach(fn => fn(ev));
  await tick(); await tick();
  ok('B1 重命名发到 Archive.rename', renameCalls.length === 1 && renameCalls[0].name === '终版', JSON.stringify(renameCalls));
  ok('B2 服务端改名后 id 变了，meta.loadedFromId 必须跟新',
     state.meta.loadedFromId === 'named_终版', '仍是 ' + state.meta.loadedFromId + '（快照文件已被 os.replace 改名，旧 id 不存在）');

  /* ============ C. 删除当前档案 ============ */
  state.meta = { loadedFrom: 'v1', loadedFromId: 'named_v1' };
  snapshots = [{ id:'named_v1', name:'v1', type:'named', created_at: 0 }];
  rows.length = 0;
  await History.del('named_v1');
  await tick();
  ok('C1 删除当前档案后不再把它当「当前档案」',
     !state.meta.loadedFromId && !state.meta.loadedFrom,
     'loadedFrom="' + state.meta.loadedFrom + '" loadedFromId="' + state.meta.loadedFromId + '"（顶栏仍显示已删档案，✎ 指向不存在 id）');

  console.log('\n' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
}

main().catch(e => { console.error(e); process.exit(1); });
