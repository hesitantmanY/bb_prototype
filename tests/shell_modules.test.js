/* Node test: 外壳模块抽出（2026-09-01 架构评审候选 4）。
   Runner / Backend 从 global-brand-building.html 内联脚本迁入 lib/，
   HTML 只挂标签；内联脚本不再保留第二份实现。

   Run: node tests/shell_modules.test.js
*/
'use strict';
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const htmlSrc = fs.readFileSync(path.join(root, 'docs', 'global-brand-building.html'), 'utf8');

let pass = 0, fail = 0;
function ok(name, cond, detail){
  if(cond){ pass++; console.log('PASS ' + name); }
  else { fail++; console.log('FAIL ' + name + (detail ? ' — ' + detail : '')); }
}

ok('HTML loads lib/runner.js', /<script src="lib\/runner\.js\?v=\d+"><\/script>/.test(htmlSrc));
ok('HTML loads lib/backend.js', /<script src="lib\/backend\.js\?v=\d+"><\/script>/.test(htmlSrc));
ok('HTML loads extracted shell libs',
  ['store','ui','settings','savepanel','demomenu','history','app','schema_migrate','markdown_exchange']
    .every(n => new RegExp('<script src="lib\\/' + n + '\\.js\\?v=\\d+"><\\/script>').test(htmlSrc)));
ok('inline script has no const Runner', !/const Runner = \{/.test(htmlSrc));
ok('inline script has no const Backend', !/const Backend = \{/.test(htmlSrc));
ok('inline script has no buttonRestore', !/function buttonRestore/.test(htmlSrc));
ok('inline script has no const Store/App/UI/History/SavePanel/DemoMenu/Settings',
  !/const (Store|App|UI|History|SavePanel|Settings) = \{/.test(htmlSrc) && !/var DemoMenu = \{/.test(htmlSrc));
ok('inline runSchemaMigrations delegates to SchemaMigrate',
  /SchemaMigrate\.run\(st, \[Work1,Work2,Work3,Work4,Work5\]/.test(htmlSrc));
ok('runner.js / backend.js exist',
  fs.existsSync(path.join(root, 'docs', 'lib', 'runner.js')) &&
  fs.existsSync(path.join(root, 'docs', 'lib', 'backend.js')));

console.log(`\n${pass} pass / ${fail} fail`);
process.exit(fail === 0 ? 0 : 1);
