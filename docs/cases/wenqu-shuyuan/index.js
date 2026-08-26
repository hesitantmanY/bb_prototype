/* ============================================================
 wenqu-shuyuan — case entry point
 ============================================================ */
(function(){
  function readWork(name){
    if(typeof window === 'undefined') return null;
    return window['__case_wenqu_shuyuan_' + name] || null;
  }

  const index = {
    brand: 'wenqu-shuyuan',
    label: '问渠书院 Wenqu Academy',
    summary: '杭州/宁波/绍兴 3 校区的 K12 素质+职业培训双线品牌，老客续费 70%，从少儿编程+美术+口才延伸到大学生/职场新人的数字媒体+电商运营职业课。',
    defaultWorks: ['work1','work2','work3'],
    getState(){
      return {
        work1: readWork('work1'),
        work2: readWork('work2'),
        work3: readWork('work3')
      };
    }
  };

  if(typeof window!== 'undefined') window.__case_wenqu_shuyuan = index;
})();
