/* ============================================================
   ExportMenu — 顶栏「导出 ▼」统一入口 + 多选工作坊打印
   ============================================================
   已锁决策（wayfinder/export-menu-print/map.md）：
   - 顶栏一个 ghost「导出 ▼」按钮，菜单两项：导出 Markdown、导出 PDF。
   - 导出 Markdown 行为不变，只是入口改菜单项。
   - 导出 PDF：模态面板多选工作坊，默认全不勾、至少勾一个才可导出。
   - 勾选粒度 = 工作坊；前序工作坊提炼关键结论，Work5 策划书成稿放最后。
   - 产物 =「PDF」：由 PdfExport 生成独立 A4 HTML，
     再经本地后端 /api/pdf 用 Playwright 渲染下载；不弹浏览器打印框。
   - 案例（demo）模式：导出菜单不可打开，既不导出 MD 也不打印。
   实现：Work5 成稿直接克隆当前渲染 DOM（表格/SVG 原样），前序工作坊
   关键结论由 Work5 compose* 只读函数提炼；渠道图只允许 PDF 侧改色，
   不改变图形结构。旧 _buildPrintRoot / window.print 流程保留备用但不再调用。
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

 const GUIDANCE_RE = /(请先|尚未|还没有|未完成|添加|点击此处|运行合成|运行|生成|留空|手动|输入后回车|示例|说明|提示|推荐|必填|本步最小|去 Work|暂无|使用|选择|删除|只提示|起点)/;
 const ADVANCED_DETAIL_RE = /(LDA 高级|消息设置|展开\/收起|评分维度管理|高级参数)/;

 const ExportMenu = {
   _sel: new Set(),
   _cardGroups: [],
   _bound: false,

   _demo(){
     try{
       if(typeof state === 'undefined' || !state || !state.meta) return false;
       if(state.meta.isDemo || state.meta.demoCase) return true;
       if(typeof document !== 'undefined' && document.body) return document.body.classList.contains('is-demo');
     }catch(_){}
     return false;
   },

   sync(){
     if(typeof document === 'undefined') return;
     const btn = document.getElementById('exportBtn');
     if(!btn) return;
     const locked = this._demo();
     btn.disabled = locked;
     btn.title = locked ? '案例模式不可导出 / 打印' : '';
     btn.setAttribute('aria-disabled', locked ? 'true' : 'false');
     if(locked) this.close();
   },

   init(){
     if(this._bound || typeof document === 'undefined') return;
     const btn = document.getElementById('exportBtn');
     if(!btn) return;
     btn.addEventListener('click', e => {
       e.stopPropagation();
       if(this._demo()) return;
       const pop = document.getElementById('exportMenuPopup');
       if(!pop) return;
       const open = pop.classList.toggle('open');
       btn.setAttribute('aria-expanded', open ? 'true' : 'false');
     });
     document.addEventListener('click', e => {
       const wrap = document.querySelector('.export-wrap');
       if(wrap && !wrap.contains(e.target)) this.close();
     });
     document.addEventListener('keydown', e => {
       if(e.key === 'Escape'){ this.close(); this.closePrint(); }
     });
     this._bound = true;
     this.sync();
   },

   toggle(){
     if(typeof document === 'undefined' || this._demo()) return;
     const btn = document.getElementById('exportBtn');
     if(btn) btn.click();
   },

   close(){
     if(typeof document === 'undefined') return;
     const pop = document.getElementById('exportMenuPopup');
     const btn = document.getElementById('exportBtn');
     if(pop) pop.classList.remove('open');
     if(btn) btn.setAttribute('aria-expanded', 'false');
   },

   md(){
     if(this._demo()) return;
     if(typeof App !== 'undefined' && typeof App.exportMd === 'function') App.exportMd();
     this.close();
   },

   _workLabel(n){
     const m = WORK_META.find(x => x.n === n);
     return m ? m.roman + ' · ' + m.title : '';
   },

   _stepCount(n){
     try{
       const mod = typeof window !== 'undefined' ? window['Work' + n] : null;
       return (mod && mod.steps && mod.steps.length) ? mod.steps.length : 0;
     }catch(_){ return 0; }
   },

   openPrint(){
     if(this._demo() || typeof document === 'undefined') return;
     const list = document.getElementById('printPickList');
     const go = document.getElementById('printGoBtn');
     if(!list || !go) return;
     list.innerHTML = '';
     this._sel = new Set();
     WORK_META.forEach(m => {
       const row = document.createElement('label');
       row.className = 'print-pick-row';
       const cb = document.createElement('input');
       cb.type = 'checkbox';
       cb.value = String(m.n);
       const name = document.createElement('span');
       name.className = 'print-pick-name';
       name.textContent = this._workLabel(m.n);
       const count = document.createElement('span');
       count.className = 'print-pick-count';
       const c = this._stepCount(m.n);
       count.textContent = (c === 1 ? '1 个步骤' : c + ' 个步骤');
       cb.addEventListener('change', () => {
         if(cb.checked) this._sel.add(m.n);
         else this._sel.delete(m.n);
         this._syncPrintGo();
       });
       row.appendChild(cb);
       row.appendChild(name);
       row.appendChild(count);
       list.appendChild(row);
     });
     this._syncPrintGo();
     const modal = document.getElementById('printModal');
     if(modal) modal.classList.add('open');
     this.close();
   },

   _syncPrintGo(){
     const go = document.getElementById('printGoBtn');
     if(!go) return;
     const n = this._sel.size;
     go.disabled = n === 0;
     go.textContent = n === 0 ? '导出 PDF' : '导出 PDF（' + n + ' 个工作坊）';
   },

   closePrint(){
     if(typeof document === 'undefined') return;
     const modal = document.getElementById('printModal');
     if(modal) modal.classList.remove('open');
   },

   async doPrint(){
     if(this._demo() || !this._sel || this._sel.size === 0) return;
     if(typeof document === 'undefined') return;
     const works = [...this._sel].map(Number).filter(n => WORK_META.some(m => m.n === n)).sort((a, b) => a - b);
     this.closePrint();
     this.close();
     if(typeof PdfExport === 'undefined' || typeof fetch !== 'function' || typeof apiUrl !== 'function'){
       showToast('PDF 导出模块未加载，请刷新后重试');
       return;
     }
     showToast('正在生成 PDF…', 5000);
     try{
       const printRootHtml = await this._ensurePrintRootHtml(works.filter(n => n < 5));
       const planHtml = await this._ensurePlanHtml();
       const appCss = typeof PdfExport.collectAppCss === 'function' ? PdfExport.collectAppCss() : '';
       const html = PdfExport.buildPdfHtml({ works, planHtml, printRootHtml, appCss });
       const issues = PdfExport.selfCheck({ works, planHtml, printRootHtml, html });
       if(issues.length) throw new Error('自检未通过：' + issues.join('；'));

       const raw = ((state && state.meta && state.meta.loadedFrom) || 'brand').trim();
       const safe = raw.replace(/[\\\/:*?"<>|\s]+/g,'-').replace(/^[.\-]+|[.\-]+$/g,'').slice(0,80) || 'brand';
       const res = await fetch(apiUrl('/api/pdf'), {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ html, filename: safe + '.pdf' })
       });
       if(!res.ok){
         let msg = 'HTTP ' + res.status;
         try{ const j = await res.json(); if(j && j.detail) msg = String(j.detail); }catch(_){}
         throw new Error(msg);
       }
       const blob = await res.blob();
       const a = document.createElement('a');
       a.href = URL.createObjectURL(blob);
       a.download = safe + '.pdf';
       document.body.appendChild(a);
       a.click();
       setTimeout(() => {
         try{ URL.revokeObjectURL(a.href); }catch(_){}
         try{ if(a.parentNode) a.parentNode.removeChild(a); }catch(_){}
       }, 1000);
       showToast('PDF 已生成');
     }catch(e){
       console.error('[ExportMenu PDF]', e);
       showToast('PDF 生成失败：' + (e && e.message ? e.message : e), 4000);
     }
   },

   _ensurePrintRootHtml(works){
     if(!works || !works.length || typeof document === 'undefined') return '';
     this._buildPrintRoot(works);
     const root = document.getElementById('printRoot');
     const html = root ? root.innerHTML : '';
     if(root) root.innerHTML = '';
     return html;
   },

   async _ensurePlanHtml(){
     if(!this._sel || !this._sel.has(5)) return '';
     if(typeof document === 'undefined') return '';
     const origWork = state && state.meta && state.meta.currentWork;
     const origStep = state && state.meta && state.meta.currentStep;
     const demo = this._demo();

     // 与进入 Work5 同语义：先同步上游成稿，再渲染 plan step。
     if(!demo && typeof Work5 !== 'undefined' && typeof Work5.autoSync === 'function'){
       try{ await Work5.autoSync(); }catch(e){ console.warn('[ExportMenu autoSync]', e); }
     }
     if(!document.querySelector('#steps5 .step') || origWork !== 5){
       if(typeof App !== 'undefined' && typeof App.goWork === 'function'){
         try{ App.goWork(5); }catch(e){ console.warn('[ExportMenu goWork5]', e); }
       }
     }
     const waitUntil = Date.now() + 4000;
     while(Date.now() < waitUntil && !document.querySelector('#steps5 .step .chapter')){
       await new Promise(r => setTimeout(r, 30));
     }
     const step = document.querySelector('#steps5 .step');
     const html = step && typeof PdfExport !== 'undefined' ? PdfExport.clonePlanHtml(step) : '';

     // 恢复用户导出前的页面位置。
     if(origWork && origWork !== 5 && typeof App !== 'undefined'){
       try{
         if(typeof App.goWork === 'function') App.goWork(origWork);
         if(origStep && typeof App.goStep === 'function') App.goStep(origStep);
       }catch(e){ console.warn('[ExportMenu restore]', e); }
     }
     return html;
   },

   _refreshWork(n){
     try{
       const mod = typeof window !== 'undefined' ? window['Work' + n] : null;
       if(!mod || !mod.steps || (typeof mod.renderStep !== 'function' && typeof mod.rerender !== 'function')) return;
       (mod.steps || []).forEach(s => {
         try{
           if(typeof mod.rerender === 'function'){
             mod.rerender(s.id);
           } else {
             const sec = document.querySelector('#steps'+n+' .step[data-step="'+s.id+'"]');
             if(sec) sec.dataset.rendered = '0';
             mod.renderStep(s.id);
           }
         }catch(e){ console.warn('[ExportMenu render] W'+n+'.'+s.id, e); }
       });
     }catch(e){ console.warn('[ExportMenu refresh]', e); }
   },

   _buildPrintRoot(works){
     if(typeof document === 'undefined') return;
     const root = document.getElementById('printRoot');
     if(!root) return;
     root.innerHTML = '';
     works.forEach(n => {
       this._refreshWork(n);
       const source = document.getElementById('work' + n);
       if(!source) return;
       const clone = source.cloneNode(true);
       if(!clone.classList.contains('active')) clone.classList.add('active');
       clone.querySelectorAll('.step').forEach(s => s.classList.add('active'));
       const srcControls = source.querySelectorAll('input,textarea,select');
       const dstControls = clone.querySelectorAll('input,textarea,select');
       dstControls.forEach((dst, i) => {
         const src = srcControls[i];
         if(!src) return;
         try{
           if(src.type === 'checkbox' || src.type === 'radio'){
             dst.checked = src.checked;
           } else if(src.tagName === 'SELECT'){
             if(src.selectedIndex >= 0 && dst.options && src.selectedIndex < dst.options.length){
               dst.selectedIndex = src.selectedIndex;
             }
           } else {
             dst.value = src.value;
           }
         }catch(_){}
       });
       this._cleanClone(clone, n);
       const wrap = document.createElement('div');
       wrap.className = 'pv-workshop';
       const title = document.createElement('h2');
       title.className = 'pv-workshop-title';
       title.textContent = this._workLabel(n);
       wrap.appendChild(title);
       wrap.appendChild(clone);
       root.appendChild(wrap);
     });
   },

   _cleanClone(clone, n){
     this._dropEditorChrome(clone);
     this._collectCardGroups(clone);
     this._dropUnselectedCards();
     this._textifyControls(clone);
     this._cleanChips(clone);
     this._dropPlaceholderText(clone);
     this._openAccordions(clone);
     this._cleanFields(clone);
     this._cleanTables(clone);
     this._dropDetails(clone);
     this._pruneEmpty(clone, n);
   },

   _dropEditorChrome(root){
     const hard = Array.from(root.querySelectorAll(
       '.no-print,.mvo-card,.metric-next,.ai-box,.ai-actions,.ai-settings-check,' +
       '.progress-bar,.runner-bar,.edit-hint,.item-add,.sbu-toolbar,' +
       '.metric-legend,.metric-health,.metric-empty,.metric-suggest,.notice,' +
       '.cap-ai-btn,.cap-ai-hint,.q-del,.metric-card-actions,.warning,' +
       '.hallmark-hint,.sbu-sub-meta,.sbu-sub-lead,.c-hint,.v-label,.v-pill,' +
       '.ai-draft,.ai-draft-title,.ai-draft-hint,.ai-draft-arrow'
     ));
     hard.forEach(el => el.parentNode && el.parentNode.removeChild(el));
     root.querySelectorAll('button,input[type="file"],input[type="range"],input[type="hidden"]').forEach(el => {
       el.parentNode && el.parentNode.removeChild(el);
     });
     // 说明性头部/引导不是成果；但表格里的 .hint 可能是 AI 解释，留着由后续规则判断。
     root.querySelectorAll('.lede,.cap-acc-derive,.cap-acc-arrow').forEach(el => {
       el.parentNode && el.parentNode.removeChild(el);
     });
     root.querySelectorAll('details').forEach(d => {
       const sum = d.querySelector(':scope > summary');
       if(sum && ADVANCED_DETAIL_RE.test(sum.textContent || '')){
         d.parentNode && d.parentNode.removeChild(d);
       }
     });
   },

   _collectCardGroups(root){
     this._cardGroups = [];
     const groups = new Map();
     root.querySelectorAll('.card,.tier-card').forEach(card => {
       const parent = card.parentElement;
       if(!parent) return;
       if(!groups.has(parent)) groups.set(parent, []);
       groups.get(parent).push(card);
     });
     groups.forEach(cards => {
       const parent = cards[0].parentElement;
       const hasControls = cards.some(c => c.querySelector('input[type="radio"],input[type="checkbox"]'))
         || cards.some(c => c.classList.contains('tier-card'))
         || (parent && parent.classList && parent.classList.contains('sbu-biz-type'));
       if(!hasControls) return;
       const selected = cards.filter(c =>
         c.classList.contains('selected') ||
         c.classList.contains('active') ||
         !!c.querySelector('input:checked')
       );
       if(selected.length) this._cardGroups.push({ cards, selected });
     });
   },

   _dropUnselectedCards(){
     this._cardGroups.forEach(({ cards, selected }) => {
       selected.forEach(c => c.classList.add('pv-kept'));
       cards.forEach(c => {
         if(!selected.includes(c) && c.parentNode) c.parentNode.removeChild(c);
       });
     });
     this._cardGroups = [];
   },

   _textifyControls(root){
     root.querySelectorAll('input,textarea,select').forEach(ctrl => {
       let text = null;
       const type = (ctrl.type || '').toLowerCase();
       if(type === 'checkbox' || type === 'radio'){
         if(ctrl.checked && ctrl.closest('td')) text = '✓';
         else if(ctrl.checked && !ctrl.closest('label,.card,.tier-card,.pv-kept')) text = '✓';
         else text = null;
       } else if(ctrl.tagName === 'SELECT'){
         if(String(ctrl.value || '').trim()){
           const o = ctrl.selectedOptions && ctrl.selectedOptions.length ? ctrl.selectedOptions[0] : null;
           text = String(o && (o.textContent !== undefined ? o.textContent : o.text) || '').trim();
         }
       } else {
         const v = (ctrl.value != null ? ctrl.value : (ctrl.textContent || ''));
         text = String(v).trim();
       }
       if(text){
         const span = document.createElement('span');
         span.className = 'pv-value';
         span.textContent = text;
         ctrl.parentNode.replaceChild(span, ctrl);
       } else {
         ctrl.parentNode && ctrl.parentNode.removeChild(ctrl);
       }
     });
   },

   _cleanChips(root){
     root.querySelectorAll('.sbu-chip:not(.on)').forEach(el => el.parentNode && el.parentNode.removeChild(el));
     root.querySelectorAll('.sbu-chip.on').forEach(el => el.classList.add('pv-kept'));
     root.querySelectorAll('.chip-row').forEach(row => {
       const selected = Array.from(row.querySelectorAll('.chip.maroon'));
       if(!selected.length) return;
       selected.forEach(c => c.classList.add('pv-kept'));
       row.querySelectorAll('.chip:not(.maroon)').forEach(c => {
         if(!c.classList.contains('pv-kept') && c.parentNode) c.parentNode.removeChild(c);
       });
     });
   },

   _dropPlaceholderText(root){
     root.querySelectorAll('[contenteditable]').forEach(ed => {
       const t = String(ed.textContent || '').trim();
       if(!t || /^〔.*〕$/.test(t) || /点击此处输入/.test(t) || /——点击此处输入/.test(t)){
         ed.parentNode && ed.parentNode.removeChild(ed);
         return;
       }
       ed.removeAttribute('contenteditable');
     });
   },

   _openAccordions(root){
     root.querySelectorAll('.cap-acc-item').forEach(item => {
       item.classList.add('open');
       const head = item.querySelector(':scope > .cap-acc-head');
       if(head) head.parentNode && head.parentNode.removeChild(head);
       const body = item.querySelector(':scope > .cap-acc-body');
       if(!body || !body.textContent.trim()){
         item.parentNode && item.parentNode.removeChild(item);
       }
     });
     root.querySelectorAll('details').forEach(d => {
       if(!d.hasAttribute('open')) d.setAttribute('open', '');
     });
   },

   _cleanFields(root){
     root.querySelectorAll('.field,.sbu-field,.cap-field,.field-h').forEach(field => {
       const meaningful = field.querySelector(
         '.pv-value,.pv-kept,[contenteditable],table,svg,img,canvas,.chip,.tag,.callout'
       );
       if(!meaningful){
         field.parentNode && field.parentNode.removeChild(field);
         return;
       }
       field.querySelectorAll('.sbu-value-echo,.help-q').forEach(el => {
         el.parentNode && el.parentNode.removeChild(el);
       });
       field.querySelectorAll('.sbu-label,label,.cap-field-label,.persona-row-label').forEach(label => {
         const t = String(label.textContent || '').trim();
         // 只摘掉纯引导性括号（决定…/说明…/多选…等），保留含义括号（如 SBU 声明）。
         label.textContent = t.replace(/（[^）]*(决定|说明|可选|多选|必填|输入|如何|什么|示例|默认|单行)[^）]*）/g, '').trim();
       });
     });
   },

   _cleanTables(root){
     root.querySelectorAll('table').forEach(t => {
       t.querySelectorAll('tbody tr').forEach(tr => {
         const cells = Array.from(tr.children);
         if(!cells.some(td => String(td.textContent || '').trim())){
           tr.parentNode && tr.parentNode.removeChild(tr);
         }
       });
       if(!t.querySelector('tbody tr')){
         t.parentNode && t.parentNode.removeChild(t);
         return;
       }
       // 去掉纯操作列：表头末列无文字、且该列数据格为空时删除整列。
       const head = t.querySelector('thead tr');
       if(head && head.children.length){
         const lastHead = head.children[head.children.length - 1];
         if(lastHead && !String(lastHead.textContent || '').trim()){
           t.querySelectorAll('tbody tr').forEach(tr => {
             const cells = Array.from(tr.children);
             const last = cells[cells.length - 1];
             if(last && !String(last.textContent || '').trim()) last.remove();
           });
           lastHead.remove();
         }
       }
     });
   },

   _dropDetails(root){
     root.querySelectorAll('details').forEach(d => {
       const sum = d.querySelector(':scope > summary');
       if(sum && ADVANCED_DETAIL_RE.test(sum.textContent || '')){
         d.parentNode && d.parentNode.removeChild(d);
         return;
       }
       const meaningful = d.querySelector('.pv-value,.pv-kept,[contenteditable],table,svg,img,.chip,.tag,.callout');
       if(!meaningful){
         const t = String(d.textContent || '').trim();
         if(!t || GUIDANCE_RE.test(t)){
           d.parentNode && d.parentNode.removeChild(d);
         }
       }
     });
   },

   _pruneEmpty(root, n){
     // 纯引导/空数据卡片：没有任何成果承载时整卡去掉。
     root.querySelectorAll('.card,.scenario-card,.q-card,.metric-dim,.persona-block,.cap-acc-item').forEach(card => {
       if(card.querySelector('.pv-value,.pv-kept,[contenteditable],table,svg,img,canvas,.chip,.tag,.callout')) return;
       const t = String(card.textContent || '').trim();
       if(!t || GUIDANCE_RE.test(t)){
         card.parentNode && card.parentNode.removeChild(card);
       }
     });
     // 自底向上清空只含空白 / 只剩删除按钮后空壳的容器。
     const els = Array.from(root.querySelectorAll('div,section,article,details,ul,ol,li,span,label'));
     for(let i = els.length - 1; i >= 0; i--){
       const el = els[i];
       if(el.classList.contains('step') || el.classList.contains('workshop') ||
          el.classList.contains('sub-head') || el.id === 'steps' + n ||
          el.id === 'work' + n || el.closest('.sub-head')) continue;
       if(el.querySelector('table,svg,img,canvas,[contenteditable],.pv-value,.pv-kept,.chip,.tag,.callout')) continue;
       const t = String(el.textContent || '').trim();
       if(!t) el.parentNode && el.parentNode.removeChild(el);
     }
   }
 };

 if(typeof window !== 'undefined'){
   window.ExportMenu = ExportMenu;
   if(document.readyState === 'loading'){
     document.addEventListener('DOMContentLoaded', () => ExportMenu.init());
   } else {
     ExportMenu.init();
   }
 }
 if(typeof module !== 'undefined' && module.exports) module.exports = ExportMenu;
})();
