/* ============================================================
 DemoMenu — 2026-09-01 架构评审候选 4：从 global-brand-building.html 内联脚本抽出。
 依赖均为运行时全局（el / state / saveNow / Archive / App 等），浏览器可用，
 node 测试通过注入对应 stub 直接命中接口。
 ============================================================ */
(function(){
 'use strict';

var DemoMenu = {
  popup: null,
  listEl: null,
  init(){
    if(this._inited) return;
    this.popup = document.getElementById('demoMenuPopup');
    this.listEl = document.getElementById('demoMenuList');
    if(!this.popup || !this.listEl) return;
    this._inited = true;
    // 先绑按钮和外部关闭，再 render。render 依赖 state，可能在 App.init 跑完前为 null；
    // render 失败不能影响点击绑定，否则菜单彻底哑火。
    const btn = document.getElementById('demoBtn');
    if(btn && !btn._demoBound){
      btn._demoBound = true;
      btn.addEventListener('click', (e)=>{
        e.stopPropagation();
        // 已载入案例：按钮文案"载入案例 ▼"，点击再打开选单切换案例
        // 未载入：同上，打开选单让用户挑
        if(state.meta.demoCase && typeof App!=='undefined'){
          App.toggleDemo();
        }else{
          this.toggle();
        }
      });
    }
    document.addEventListener('click', (e) => {
      if(!this.popup.classList.contains('open')) return;
      if(!e.target.closest('.demo-menu-wrap')) this.close();
    });
    try{ this.render(); }catch(e){ console.error('[DemoMenu.render]', e); }
  },
  toggle(){
    if(!this.popup){ console.warn('[DemoMenu] popup not initialized; calling init()'); this.init(); }
    if(!this.popup) return;
    if(this.popup.classList.contains('open')) this.close();
    else this.open();
  },
  open(){
    if(!this.popup) return;
    this.render();
    this.popup.classList.add('open');
  },
  close(){
    if(!this.popup) return;
    this.popup.classList.remove('open');
  },
  render(){
    if(!this.listEl) return;
    // 2026-09-01 候选 3：cases/bundle.js + loader 是唯一来源，旧 DemoData 已删。
    let cases = [];
    if(typeof Cases!=='undefined' && Cases.list){
      cases = Cases.list().map(c => ({
        key: c.brand,
        name: c.label,
        ready: true,
        industry: '',
        description: c.summary || ''
      }));
    }
    const current = (state && state.meta && state.meta.demoCase) || null;
    this.listEl.innerHTML = '';
    cases.forEach(c => {
      const isActive = c.key === current;
      const item = el('div', {
        class: 'demo-menu-item' + (isActive ? ' active' : '') + (c.ready ? '' : ' disabled')
      },
        el('div', {class: 'demo-menu-item-name'}, c.name),
        el('div', {class: 'demo-menu-item-meta'}, c.industry),
        el('div', {class: 'demo-menu-item-desc'}, c.description),
        el('div', {class: 'demo-menu-item-status'},
          c.ready ? (isActive ? '当前案例' : '点击载入') : '待补全')
      );
      if(c.ready){
        item.addEventListener('click', () => {
          this.close();
          if(typeof App!=='undefined') App.toggleDemo(c.key);
        });
      }
      this.listEl.appendChild(item);
    });
  }
};

 if(typeof window!=='undefined') window.DemoMenu = DemoMenu;
 if(typeof module!=='undefined' && module.exports) module.exports = DemoMenu;
})();
