/* Node test: 案例浏览（body.is-demo）下，步间/跨坊 CTA 应豁免 case 只读锁。

   契约（参考 issues/2026-09-07-fix/BIZ09-case-cta-exempt.md）：
   1. body.is-demo #stepsN button / input / textarea / select / [contenteditable] / svg
      仍按原 BIZ02 规则 opacity:.55 + pointer-events:none + cursor:not-allowed
      （编辑 / AI 控件保持锁定）。
   2. 步间 CTA（UI.stepNextCta，class="metric-next" > button.primary.small）
      和跨坊 CTA（UI.nextWorkCta，结构同上）走特例：
      body.is-demo #stepsN .metric-next button 应 opacity:1 + pointer-events:auto
      + cursor:pointer，让「下一步 →」「II. 目标市场 →」类按钮在案例里可点。
   3. 特异性：override 规则 (1,2,0,1) 必须晚于原规则 (1,1,0,1) 出现，靠级联胜出。
   4. MVO 未过时的 .metric-next--hidden 仍以 !important 压住（这条 css 文件本身已存在，
      本测试只盯「过门槛后」要可点）。

   解析方式：直接读 docs/global-brand-building.html，定位 body.is-demo 周围的 CSS 文本，
   按选择器+块粒度分桶，断言 override 存在、晚于原规则、且 3 条目标属性正确。

   Run: node tests/case_cta_exempt.test.js
*/
'use strict';
const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function ok(name, cond, detail){
  if(cond){ pass++; console.log('PASS ' + name); }
  else { fail++; console.log('FAIL ' + name + (detail ? ' — ' + String(detail).slice(0,200) : '')); }
}

const html = fs.readFileSync(path.join(__dirname, '..', 'docs', 'global-brand-building.html'), 'utf8');

// 1) 抽取 <style>...</style> 段并取出 body.is-demo 周围的 CSS 文本
const styleBlocks = [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map(m => m[1]);
const css = styleBlocks.join('\n');

// 2) 把 body.is-demo 段里所有 CSS 规则切成 [{selectors:[...], body:'...'}, ...]
function parseRules(text){
  // 1) 先剥 /* ... */ 注释（注释里可能含逗号 / 花括号，不能算规则）
  const stripped = text.replace(/\/\*[\s\S]*?\*\//g, ' ');
  // 2) 顶层无嵌套，按 '}' 切，每段第一条 '{' 之前是选择器部分
  const rules = [];
  let i = 0, depth = 0, start = 0, buf = '';
  while(i < stripped.length){
    const ch = stripped[i];
    if(ch === '{'){
      if(depth === 0){ buf = stripped.slice(start, i); start = i + 1; }
      depth++;
    } else if(ch === '}'){
      depth--;
      if(depth === 0){
        const body = stripped.slice(start, i);
        const selectors = buf.split(',').map(s => s.trim()).filter(Boolean);
        rules.push({ selectors, body: body.trim() });
        start = i + 1;
      }
    }
    i++;
  }
  return rules;
}

const rules = parseRules(css);
const isDemoRules = rules.filter(r => r.selectors.some(s => s.startsWith('body.is-demo')));
ok('存在 body.is-demo 规则', isDemoRules.length > 0, 'count=' + isDemoRules.length);

// 3) 找原锁定规则：body.is-demo #stepsN button (1-5) 那 5 条
const originalLockSelectors = [];
for(let n=1; n<=5; n++){
  const sel = 'body.is-demo #steps' + n + ' button';
  if(isDemoRules.some(r => r.selectors.includes(sel))) originalLockSelectors.push(sel);
}
ok('原锁定规则 5 条都在', originalLockSelectors.length === 5,
   'found=' + originalLockSelectors.length + ' selectors=' + originalLockSelectors.join('|'));

// 4) 找 override 规则：body.is-demo #stepsN .metric-next button (1-5)
const overrideSelectors = [];
let overrideRule = null;
for(let n=1; n<=5; n++){
  const sel = 'body.is-demo #steps' + n + ' .metric-next button';
  const r = isDemoRules.find(r => r.selectors.includes(sel));
  if(r) { overrideSelectors.push(sel); overrideRule = r; }
}
ok('override 规则 5 条都在', overrideSelectors.length === 5,
   'found=' + overrideSelectors.length + ' selectors=' + overrideSelectors.join('|'));

// 5) override 必须晚于原规则（级联才生效）
if(originalLockSelectors.length === 5 && overrideSelectors.length === 5){
  const firstOriginalIdx = isDemoRules.findIndex(r => r.selectors.includes(originalLockSelectors[0]));
  const firstOverrideIdx = isDemoRules.findIndex(r => r.selectors.includes(overrideSelectors[0]));
  ok('override 出现在原规则之后', firstOverrideIdx > firstOriginalIdx,
     'originalIdx=' + firstOriginalIdx + ' overrideIdx=' + firstOverrideIdx);
}

// 6) override 规则的 body 必须包含 3 个关键属性
if(overrideRule){
  const body = overrideRule.body;
  ok('override 设了 opacity:1',          /opacity\s*:\s*1\b/.test(body), body);
  ok('override 设了 cursor:pointer',     /cursor\s*:\s*pointer\b/.test(body), body);
  ok('override 设了 pointer-events:auto',/pointer-events\s*:\s*auto\b/.test(body), body);
  // 反断言：override 不能用 !important（依赖级联胜出，BIZ02 链路上的层级契约）
  ok('override 不依赖 !important', !/!important/i.test(body), body);
} else {
  ok('override 设了 opacity:1',          false);
  ok('override 设了 cursor:pointer',     false);
  ok('override 设了 pointer-events:auto',false);
  ok('override 不依赖 !important',       false);
}

// 7) 原始锁定规则的 body 仍含 pointer-events:none（保证 BIZ02 语义未受牵连）
const firstOriginalRule = isDemoRules.find(r => r.selectors.includes(originalLockSelectors[0]));
if(firstOriginalRule){
  ok('原锁定规则仍含 pointer-events:none', /pointer-events\s*:\s*none\b/.test(firstOriginalRule.body),
     firstOriginalRule.body);
} else {
  ok('原锁定规则仍含 pointer-events:none', false);
}

// 8) .metric-next--hidden 仍以 !important 压住（MVO 未过时 CTA 不应可见）
const hiddenRule = rules.find(r => r.selectors.some(s => s.endsWith('.metric-next--hidden')));
ok('.metric-next--hidden 规则存在', !!hiddenRule);
if(hiddenRule){
  ok('.metric-next--hidden 含 !important', /!important/.test(hiddenRule.body), hiddenRule.body);
  ok('.metric-next--hidden 含 display:none', /display\s*:\s*none\b/.test(hiddenRule.body), hiddenRule.body);
}

// 9) 不动 ui.js：UI.stepNextCta / UI.nextWorkCta 仍用 class="metric-next" 容器 + button.primary.small
//    这一条保证我们的 override 真的命中运行时的 DOM
const uiSrc = fs.readFileSync(path.join(__dirname, '..', 'docs', 'lib', 'ui.js'), 'utf8');
const uiStepNextHasMetricNext = /stepNextCta[\s\S]{0,400}class\s*:\s*['"]metric-next['"]/.test(uiSrc);
ok('UI.stepNextCta 仍用 class="metric-next" 容器', uiStepNextHasMetricNext);

const uiNextWorkHasMetricNext = /nextWorkCta[\s\S]{0,400}class\s*:\s*['"]metric-next['"]/.test(uiSrc);
ok('UI.nextWorkCta 仍用 class="metric-next" 容器', uiNextWorkHasMetricNext);

console.log('\n' + pass + ' pass / ' + fail + ' fail');
process.exit(fail ? 1 : 0);
