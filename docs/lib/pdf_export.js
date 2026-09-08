/* ============================================================
   PdfExport — 客户版 PDF 内容/版式生成（2026-09-08）

   用途：导出菜单多选 Work I–V 后，生成一份可直接交付的 HTML：
   1. 勾选的 Work1–4 → 按 step 全量输出（沿用内容成果版清洗逻辑）；
   2. Work5 策划书成稿 → 克隆当前前端渲染 DOM（保留表格与 SVG）。

   约束：
   - 渠道结构图等 SVG 直接取自 Work5 当前 DOM，只做 PDF 侧改色
     （fill/stroke 属性），不改变图形结构、几何、文字与连线顺序。
   - CSS 变量必须由本地服务同源加载，渲染端先打开服务页面再 set_content。
   - 不引入第三方 skill / 设计系统。
   ============================================================ */
(function(){
  'use strict';

  const WORK_META = [
    { n: 1, roman: 'I',   title: '业务价值体系' },
    { n: 2, roman: 'II',  title: '目标市场' },
    { n: 3, roman: 'III', title: '价值主张' },
    { n: 4, roman: 'IV',  title: '营销组合' },
    { n: 5, roman: 'V',   title: '策划书' }
  ];

  // PDF 侧图表配色：只改填充，不改形。顺序用于矩阵散点。
  const POINT_PALETTE = ['#6B2E1A', '#2C5FB3', '#8A6D3B', '#4A6B53', '#7A4E8C'];
  const CHANNEL_ONLINE = '#2C5FB3';
  const CHANNEL_OFFLINE = '#6B2E1A';

  function esc(s){
    return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
  }

  function removeEls(root, selectors){
    if(!root || !root.querySelectorAll) return;
    root.querySelectorAll(selectors).forEach(el => {
      if(el && el.parentNode) el.parentNode.removeChild(el);
    });
  }

  function colorizeCharts(root){
    if(!root || !root.querySelectorAll) return;
    // 矩阵散点：按文档顺序分配色板，只改 fill/stroke。
    let pi = 0;
    root.querySelectorAll('svg.chart circle[data-pid]').forEach(circle => {
      const color = POINT_PALETTE[pi++ % POINT_PALETTE.length];
      circle.setAttribute('fill', color);
      circle.setAttribute('stroke', color);
    });

    // 渠道树：shape 与 Work4/5 完全一致，仅按 线上/线下 改条色。
    const svg = root.querySelector('svg.channel-tree-svg');
    if(!svg) return;
    let onlineCount = 0;
    try{
      const structure = state && state.work4 && state.work4.place && state.work4.place.structure;
      if(structure && structure[0] && Array.isArray(structure[0].children)) onlineCount = structure[0].children.length;
    }catch(_){}
    const bars = Array.from(svg.querySelectorAll('rect')).filter(r => r.getAttribute('fill') === 'var(--color-ink)');
    bars.forEach((bar, i) => {
      bar.setAttribute('fill', i < onlineCount ? CHANNEL_ONLINE : CHANNEL_OFFLINE);
    });
  }

  function cleanPlanClone(clone){
    removeEls(clone,
      'button,input,select,textarea,.ai-actions,.toolbar,.readiness,.provenance-go,.no-print,.synced-badge');
    clone.querySelectorAll('details.detail-layer').forEach(d => {
      const sum = d.querySelector(':scope > summary');
      const label = sum ? (sum.textContent || '') : '';
      if(/上游明细/.test(label)) d.remove();
      else d.setAttribute('open', '');
    });
    clone.querySelectorAll('[contenteditable]').forEach(el => el.removeAttribute('contenteditable'));
    colorizeCharts(clone);
    return clone;
  }

  function clonePlanHtml(stepNode){
    if(!stepNode || !stepNode.cloneNode) return '';
    const clone = cleanPlanClone(stepNode.cloneNode(true));
    return Array.from(clone.querySelectorAll('.chapter'))
      .map(ch => ch.outerHTML)
      .join('\n');
  }

  function baseOrigin(){
    try{
      if(typeof apiUrl === 'function') return String(apiUrl('')).replace(/\/+$/, '');
    }catch(_){}
    if(typeof location !== 'undefined' && location.origin && /^https?:/.test(location.origin)) return location.origin;
    return 'http://localhost:8765';
  }

  function collectAppCss(){
    if(typeof document === 'undefined') return '';
    try{
      return Array.from(document.querySelectorAll('style'))
        .map(s => s.textContent || '')
        .join('\n');
    }catch(e){
      console.warn('[PdfExport collectAppCss]', e);
      return '';
    }
  }

  function buildPdfHtml({ works, planHtml, printRootHtml, appCss }){
    const sorted = (works || []).map(Number).filter(n => WORK_META.some(m => m.n === n)).sort((a, b) => a - b);
    if(!sorted.length) throw new Error('未选择工作坊');

    let title = '品牌策划书';
    try{
      const cover = state && state.work5 && state.work5.cover && state.work5.cover.title;
      const sbu = state && state.work1 && state.work1.sbu && state.work1.sbu.name;
      title = cover || sbu || title;
    }catch(_){}

    const origin = baseOrigin();
    const appCssBlock = appCss
      ? `\n<style id="app-screen-css">\n${appCss}\n</style>`
      : '';
    const printRootBlock = printRootHtml
      ? `<div id="printRoot">${printRootHtml}</div>`
      : '';

    const planBody = sorted.includes(5) && planHtml
      ? `<div id="client-plan">
  <div id="work5" class="workshop active"><div id="steps5"><div class="step active" data-step="plan">${planHtml}</div></div></div>
</div>` : '';

    const today = new Date();
    const date = today.getFullYear() + '.' + String(today.getMonth() + 1).padStart(2, '0') + '.' + String(today.getDate()).padStart(2, '0');

    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<title>${esc(title)} · 客户版</title>
<meta name="author" content="Brand Project">
<meta name="description" content="选中工作坊按 step 全量输出 + Work5 策划书成稿">
<meta name="generator" content="Brand-Workshop PDF Export">
<link rel="stylesheet" href="${origin}/tokens.css">
<link rel="stylesheet" href="${origin}/workshop5-editorial.css">
${appCssBlock}
<link rel="stylesheet" href="${origin}/pdf-client.css">
</head>
<body>
<div class="client-cover">
  <div class="client-eyebrow">品牌策划书 · Client Edition</div>
  <h1 class="client-title">${esc(title)}</h1>
  <div class="client-sub">选中工作坊按 step 全量输出 + Work5 策划书成稿</div>
  <div class="client-meta"><span>${date}</span><span>客户版 · V1</span></div>
</div>
${printRootBlock}
${planBody}
</body>
</html>`;
  }

  function selfCheck({ works, planHtml, printRootHtml, html }){
    const issues = [];
    const sorted = (works || []).map(Number).sort((a, b) => a - b);
    if(!html || html.length < 100) issues.push('html 为空');
    if(/{{/.test(html || '')) issues.push('HTML 残留模板占位符');
    const all = String(html || '') + '\n' + String(planHtml || '');
    const visible = all
      .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
      .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ');
    if(/<(button|input|select|textarea)\b/i.test(visible)) issues.push('导出 HTML 残留编辑控件');
    if(/上游明细/.test(visible)) issues.push('导出 HTML 残留上游明细层');
    if(/provenance-go|ai-actions|toolbar|readiness|synced-badge/.test(visible)) issues.push('导出 HTML 残留编辑/同步骨架');
    const earlier = sorted.filter(n => n < 5);
    if(earlier.length && !printRootHtml) issues.push('勾选 Work1–4 但缺少按 step 输出的正文');
    if(sorted.includes(5)){
      if(!planHtml) issues.push('勾选 Work5 但缺少策划书正文');
      let hasChannelData = false;
      try{
        const structure = state && state.work4 && state.work4.place && state.work4.place.structure;
        hasChannelData = Array.isArray(structure) && structure.length > 0;
      }catch(_){}
      if(hasChannelData && !/channel-tree-svg/.test(planHtml || '')) issues.push('勾选 Work5 且 Work4 有渠道数据，但缺少渠道结构 SVG');
      const expectedChapters = 5;
      const actual = (planHtml || '').match(/<section\b[^>]*class="[^"]*\bchapter\b/g) || [];
      if(actual.length < expectedChapters) issues.push('Work5 章节不足：' + actual.length + '/' + expectedChapters);
    }
    return issues;
  }

  const PdfExport = { buildPdfHtml, clonePlanHtml, cleanPlanClone, collectAppCss, selfCheck, WORK_META };
  if(typeof window !== 'undefined') window.PdfExport = PdfExport;
  if(typeof module !== 'undefined' && module.exports) module.exports = PdfExport;
})();
