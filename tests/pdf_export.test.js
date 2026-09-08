/* Node test: PDF HTML 生成与自检（2026-09-08）。
   Run: node tests/pdf_export.test.js
*/
'use strict';

const path = require('path');
let pass = 0, fail = 0;
function ok(name, cond, detail){
  if(cond){ pass++; console.log('PASS ' + name); }
  else { fail++; console.log('FAIL ' + name + (detail ? ' — ' + detail : '')); }
}

const PdfExport = require(path.join(__dirname, '..', 'docs', 'lib', 'pdf_export.js'));

ok('module exposes build/selfCheck', typeof PdfExport.buildPdfHtml === 'function' && typeof PdfExport.selfCheck === 'function');

// Stub the Work5 compose helpers only (the real W5 DOM path is covered by
// headless self-check; this Node test keeps the module logic pure).
global.Work5 = {
  composeCh1: () => '业务单元：智能温度控制器\n一句话概述：面向中高端客户',
  composeTargeting: () => '目标市场：德国\n市场吸引力：8.02/10',
  composePositioning: () => ({ positioning: '价值主张：婴儿房恒温守护', segmentation: '' }),
  compose4P: () => ({ route: '市场范围：出海' })
};
global.state = { work4: { place: { structure: [] }, promotion: {} } };

const planHtml = `
<section class="chapter"><div class="chapter-head"><h2>1 业务与市场</h2></div></section>
<section class="chapter"><div class="chapter-head"><h2>2 环境分析</h2></div></section>
<section class="chapter"><div class="chapter-head"><h2>3 市场选择与定位</h2></div></section>
<section class="chapter"><div class="chapter-head"><h2>4 营销组合</h2></div>
  <svg class="chart channel-tree-svg" role="img" aria-label="渠道结构树">
    <rect x="1" y="1" width="10" height="10" fill="var(--color-paper-2)"></rect>
    <rect x="1" y="1" width="5" height="10" fill="var(--color-ink)"></rect>
  </svg>
</section>
<section class="chapter"><div class="chapter-head"><h2>5 总结与展望</h2></div></section>
`;

const printRootHtml = `
<div class="pv-workshop"><h2 class="pv-workshop-title">I · 业务价值体系</h2>
  <div id="work1" class="workshop active"><div id="steps1"><section class="step active">SBU 内容</section></div></div>
</div>`;

const html = PdfExport.buildPdfHtml({ works: [1, 5], planHtml, printRootHtml });

ok('build returns a full document', typeof html === 'string' && html.length > 500);
ok('document includes pdf-client.css', html.includes('pdf-client.css'));
ok('document includes Work5 plan wrapper', html.includes('id="client-plan"') && html.includes('channel-tree-svg'));
ok('document includes Work1 step content', html.includes('id="printRoot"') && html.includes('pv-workshop'));
ok('no summary card path for unselected/selected works', !html.includes('client-summary'));

const issues = PdfExport.selfCheck({ works: [1, 5], planHtml, printRootHtml, html });
ok('selfCheck passes with clean plan', issues.length === 0, issues.join('；'));

const noChannelPlan = planHtml.replace(/<svg class="chart channel-tree-svg".*?<\/svg>/s, '');
const noChannelHtml = PdfExport.buildPdfHtml({ works: [5], planHtml: noChannelPlan });
ok('selfCheck tolerates missing channel svg when Work4 has no structure data',
  PdfExport.selfCheck({ works: [5], planHtml: noChannelPlan, html: noChannelHtml }).length === 0);

ok('selfCheck rejects leftover controls', PdfExport.selfCheck({
  works: [5], planHtml: '<button>去改</button>' + planHtml, printRootHtml: '', html
}).length > 0);

console.log(`\n${pass} pass / ${fail} fail`);
process.exit(fail === 0 ? 0 : 1);
