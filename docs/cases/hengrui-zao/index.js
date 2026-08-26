/* ============================================================
 hengrui-zao — case entry point
 ============================================================ */
(function(){
  function readWork(name){
    if(typeof window === 'undefined') return null;
    return window['__case_hengrui_zao_' + name] || null;
  }

  const index = {
    brand: 'hengrui-zao',
    label: '恒锐造 Hengrui Precision',
    summary: '东莞 8000 万营收精密件 OEM 厂，0.005mm 精度 + 24h 打样 + 医疗资质，从 OEM 转"恒锐造"自有品牌面向专精特新中小品牌方。',
    defaultWorks: ['work1','work2','work3'],
    getState(){
      return {
        work1: readWork('work1'),
        work2: readWork('work2'),
        work3: readWork('work3')
      };
    }
  };

  if(typeof window!== 'undefined') window.__case_hengrui_zao = index;
})();
