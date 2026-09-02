/* Node test: 案例 bundle 与 HTML 挂载（2026-09-01 架构评审候选 3）。

   - bundle.js 是唯一浏览器入口（file:// 兼容，不能 fetch JSON）；
   - HTML 只挂 bundle.js + loader.js，不再有 30 个 per-case script 标签；
   - bundle 与源码文件等价（同一组 window 全局）。

   Run: node tests/cases.bundle.test.js
*/
'use strict';
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const bundlePath = path.join(root, 'docs', 'cases', 'bundle.js');
const htmlSrc = fs.readFileSync(path.join(root, 'docs', 'global-brand-building.html'), 'utf8');
const loaderSrc = fs.readFileSync(path.join(root, 'docs', 'cases', 'loader.js'), 'utf8');

let pass = 0, fail = 0;
function ok(name, cond, detail){
  if(cond){ pass++; console.log('PASS ' + name); }
  else { fail++; console.log('FAIL ' + name + (detail ? ' — ' + detail : '')); }
}

ok('bundle.js exists', fs.existsSync(bundlePath));
const bundleSrc = fs.existsSync(bundlePath) ? fs.readFileSync(bundlePath, 'utf8') : '';

// Bundle 与源码一致：每个品牌 index.js 的 global 赋值都出现
const brandRe = /^[ ]*'([a-z0-9-]+)': \{/gm;
const brands = [];
let m;
while((m = brandRe.exec(loaderSrc)) !== null) brands.push(m[1]);
ok('loader registry has 5 brands', brands.length === 5, String(brands.length));
for(const b of brands){
  ok('bundle includes ' + b + ' index global',
    bundleSrc.includes('window.__case_' + b.replace(/-/g, '_') + ' = index'));
}

// Bundle 加载等价性：fake window 下产生 30 个全局
const fakeWindow = {};
const savedWindow = global.window;
global.window = fakeWindow;
global.document = { addEventListener(){} };
require(bundlePath);
global.window = savedWindow;
const globals = Object.keys(fakeWindow).filter(k => k.startsWith('__case_'));
ok('bundle defines 30 case globals', globals.length === 30, String(globals.length));

// HTML 只挂 bundle + loader，无 per-case 标签、无 demo-data
ok('HTML loads cases/bundle.js', /cases\/bundle\.js/.test(htmlSrc));
ok('HTML loads cases/loader.js', /<script src="cases\/loader\.js/.test(htmlSrc));
ok('no per-case script tags remain', !/<script src="cases\/[a-z0-9-]+\/work[0-9]\.js/.test(htmlSrc));
ok('no demo-data.js tag remains', !/<script src="demo-data\.js/.test(htmlSrc));
ok('demo-data.js deleted from repo', !fs.existsSync(path.join(root, 'docs', 'demo-data.js')));

console.log(`\n${pass} pass / ${fail} fail`);
process.exit(fail === 0 ? 0 : 1);
