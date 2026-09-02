/* ============================================================
 Runner — 全局单任务锁：AI 任务的暂停/中止/进度（2026-09-01 候选 4 抽出）。

 浏览器依赖（运行时解析）：el / showToast / state / document / AbortController。
 node 测试用 button:null 即可测状态机，不触碰 DOM。

 Public API（window.Runner）：
   start({id,label,button,total,pausable,onPause,onResume}) → task | null
   togglePause() / abort() / checkpoint() / tick(n) / setTotal(n)
   signal() / finish() / renderUI()
 ============================================================ */
(function(){
  'use strict';

  function restoreButton(button, text){
    button.disabled=false;
    if(text!=null) button.textContent=text;
  }

  const Runner = {
    current: null,
    // Returns a task handle, or null if another task is running.
    start({id, label, button, total=0, pausable=false, onPause, onResume}){
      if(this.current && !this.current._finished){
        if(typeof showToast!=='undefined') showToast('请先暂停或中止当前 AI 任务');
        return null;
      }
      const task={
        id, label, button, total, pausable, onPause, onResume,
        controller: new AbortController(),
        status:'running', paused:false, aborted:false, done:0,
        _resume:null, _origOnclick:null, _origText:'', _origHTML:null,
        _abortBtn:null, _bar:null, _tick:null, _timeEl:null, _finished:false
      };
      if(button){
        task._origText=button.textContent;
        task._origOnclick=button.onclick;
        task._origHTML=button.innerHTML;
        if(pausable) button.onclick=()=>this.togglePause();
        const ab=el('button',{class:'abort-btn',type:'button',title:'中止',
          onclick:()=>this.abort()},'×');
        const inlineProgress = button.classList.contains('ai-draft-btn') || button.classList.contains('primary');
        if(inlineProgress){
          button.classList.add('running');
          button.innerHTML='';
          const time=el('span',{class:'ai-draft-state-time'},'已用 0s');
          task._timeEl=time;
          const abSpan=el('span',{class:'abort-inline',role:'button',tabindex:0,title:'中止',
            onclick:e=>{ e.stopPropagation(); this.abort(); },
            onkeydown:e=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); e.stopPropagation(); this.abort(); } }},'中止');
          task._inlineAbort=abSpan;
          button.appendChild(el('span',{class:'ai-draft-row'},
            el('span',{class:'ai-draft-title'},'生成中 · '+label+'…'),
            el('span',{class:'ai-draft-right'}, time, abSpan)
          ));
          button.appendChild(el('span',{class:'ai-draft-progress'},
            el('span',{class:'ai-draft-progress-fill indeterminate'})));
          task._elapsed=0;
          task._tick=setInterval(()=>{
            task._elapsed++;
            if(task._timeEl) task._timeEl.textContent='已用 '+task._elapsed+'s';
          },1000);
        }else{
          button.insertAdjacentElement('afterend', ab);
          task._abortBtn=ab;
          const bar=el('div',{class:'runner-bar'},
            el('div',{class:'runner-bar-track'}, el('div',{class:'runner-bar-fill'})),
            el('span',{class:'runner-bar-text'}, label)
          );
          ab.insertAdjacentElement('afterend', bar);
          task._bar=bar;
          if(!pausable) button.disabled=true;
        }
      }
      this.current=task;
      this.renderUI();
      return task;
    },
    togglePause(){
      const t=this.current; if(!t||!t.pausable||t.aborted) return;
      // 2026-09-01 三态机（ADR 0009）：暂停态再点击=中止。恢复路径删除，
      // 「继续」由断点续跑提供（重新点生成，跳过已完成单元）。
      if(t.paused){ this.abort(); return; }
      t.paused=true; t.status='paused';
      if(t.onPause){ try{ t.onPause(); }catch{} }
      this.renderUI();
    },
    abort(){
      const t=this.current; if(!t||t.aborted) return;
      t.aborted=true; t.status='aborting';
      try{ t.controller.abort(); }catch{}
      if(t._resume){ t._resume(); t._resume=null; }
      this.renderUI();
    },
    // Await between units: blocks while paused, throws if aborted.
    async checkpoint(){
      const t=this.current; if(!t) return;
      if(t.aborted) throw new DOMException('Aborted','AbortError');
      if(t.paused){
        await new Promise(res=>{ t._resume=res; });
        if(t.aborted) throw new DOMException('Aborted','AbortError');
      }
    },
    tick(n=1){ const t=this.current; if(t){ t.done+=n; this.renderUI(); } },
    setTotal(n){ const t=this.current; if(t){ t.total=n; this.renderUI(); } },
    signal(){ return this.current ? this.current.controller.signal : undefined; },
    finish(){
      const t=this.current; if(!t) return;
      t._finished=true;
      if(t._tick){ clearInterval(t._tick); t._tick=null; }
      if(t.button){
        if(t._origOnclick!==null) t.button.onclick=t._origOnclick;
        restoreButton(t.button, t._origText);
        if(t._origHTML!=null){ t.button.innerHTML=t._origHTML; t.button.classList.remove('running'); }
      }
      if(t._abortBtn){ t._abortBtn.remove(); t._abortBtn=null; }
      if(t._bar){ t._bar.remove(); t._bar=null; }
      this.current=null;
      this.renderUI();
    },
    renderUI(){
      const t=this.current;
      const st = (typeof window!=='undefined' && window.state) || (typeof state!=='undefined' ? state : null);
      const locked=!!(st && st.meta && st.meta.isDemo);
      if(typeof document!=='undefined'){
        const sw=document.getElementById('modeSwitch');
        if(sw) sw.querySelectorAll('button').forEach(b=>b.disabled=!!t||locked);
        const gear=document.getElementById('settingsGear');
        if(gear) gear.disabled=!!t||locked;
      }
      if(!t || !t.button) return;
      // 三态机文案（ADR 0009）：暂停态的主动作是中止，提示语教用户新语义
      if(t._abortBtn) t._abortBtn.style.display = t.paused ? 'none' : '';
      if(t._inlineAbort) t._inlineAbort.style.display = t.paused ? 'none' : '';
      if(t.pausable){
        if(t.paused) t.button.textContent = t.total?`已暂停 · ${t.done}/${t.total}（点击中止）`:'已暂停（点击中止）';
        else t.button.textContent = t.total?`暂停 · ${Math.round(100*t.done/t.total)}%`:'暂停';
      }else if(!(t.button.classList.contains('ai-draft-btn') || t.button.classList.contains('primary'))){
        t.button.textContent='生成中…';
      }
      const bar=t._bar;
      if(bar){
        const fill=bar.querySelector('.runner-bar-fill');
        const text=bar.querySelector('.runner-bar-text');
        if(fill && text){
          if(t.total>0){
            const pct=Math.round(100*Math.min(1,t.done/t.total));
            fill.style.transform=`scaleX(${Math.min(1,t.done/t.total)})`;
            fill.classList.remove('indeterminate');
            text.textContent=`${t.label} · ${pct}% · ${t.done}/${t.total}${t.paused?' · 已暂停（点击中止）':''}`;
          }else{
            fill.classList.add('indeterminate');
            text.textContent=`${t.label} · 生成中…`;
          }
        }
      }
    }
  };

  if(typeof window!=='undefined') window.Runner = Runner;
  if(typeof module!=='undefined' && module.exports) module.exports = Runner;
})();
