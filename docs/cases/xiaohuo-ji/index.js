/* ============================================================
 xiaohuo-ji — case entry point
 ============================================================ */
(function(){
  function readWork(name){
    if(typeof window === 'undefined') return null;
    return window['__case_xiaohuo_ji_' + name] || null;
  }

  const index = {
    brand: 'xiaohuo-ji',
    label: '小镬记 Xiao Huo Ji',
    summary: '广州 30 年家族粤菜餐厅，2 家直营，年营收 600 万，5 位粤菜师傅，从广州向深圳/上海连锁化扩张的粤菜融合品牌。',
    defaultWorks: ['work1','work2','work3'],
    getState(){
      return {
        work1: readWork('work1'),
        work2: readWork('work2'),
        work3: readWork('work3')
      };
    }
  };

  if(typeof window!== 'undefined') window.__case_xiaohuo_ji = index;
})();
