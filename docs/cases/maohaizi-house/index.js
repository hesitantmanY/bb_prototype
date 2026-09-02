/* ============================================================
 maohaizi-house — case entry point
 ============================================================ */
(function(){
  function readWork(name){
    if(typeof window === 'undefined') return null;
    return window['__case_maohaizi_house_' + name] || null;
  }

  const index = {
    brand: 'maohaizi-house',
    label: '毛孩子之家 Maohaizi House',
    summary: '成都+重庆 2 家直营宠物洗护+寄养门店，复购 45%，洗护师 CKU 认证 + 24h 实时寄养直播，从 2 家向 5 家川渝区域品牌扩张。',
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

  if(typeof window!== 'undefined') window.__case_maohaizi_house = index;
})();
