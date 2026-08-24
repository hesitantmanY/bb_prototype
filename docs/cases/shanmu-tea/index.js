/* ============================================================
 shanmu-tea — case entry point
 Each workN.js attaches its data to window.__case_shanmu_tea_workN
 (IIFE pattern so this file's load order doesn't matter, as long as
 loader.js reads the window globals after all workN.js have run).

 T08: only the skeleton. T09 fills values per docs/cases/SCHEMA.md.
 ============================================================ */
(function(){
 function readWork(name){
 if(typeof window === 'undefined') return null;
 return window['__case_shanmu_tea_' + name] || null;
 }

 const index = {
 brand: 'shanmu-tea',
 label: '山木茶事 Shanmu Tea',
 summary: '中国高端原叶茶与茶具订阅品牌，向东南亚城市文化人群扩张。',
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

 if(typeof window!== 'undefined') window.__case_shanmu_tea = index;
})();
