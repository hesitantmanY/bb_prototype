/* ============================================================
 douya-mama — case entry point
 ============================================================ */
(function(){
  function readWork(name){
    if(typeof window === 'undefined') return null;
    return window['__case_douya_mama_' + name] || null;
  }

  const index = {
    brand: 'douya-mama',
    label: '豆芽妈妈 Douya Mama',
    summary: '杭州 0-3 岁婴幼儿洗护淘宝 5 年老店，年营收 1200 万，复购率 38%，从淘系转抖音+小红书的内容种草升级。',
    defaultWorks: ['work1','work2','work3','work4','work5'],
    getState(){
      return {
        work1: readWork('work1'),
        work2: readWork('work2'),
        work3: readWork('work3'),
        work4: readWork('work4'),
        work5: readWork('work5')
      };
    }
  };

  if(typeof window!== 'undefined') window.__case_douya_mama = index;
})();
