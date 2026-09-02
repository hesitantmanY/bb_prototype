/* Node test: MatrixChart 散点矩阵渲染（2026-09-01 wayfinder map）。
   扇面 = 均衡带直线 + 「扇面∩第一象限」交集多边形。
   Run: node tests/matrix_chart.test.js
*/
'use strict';
const path = require('path');
global.median = a => { if(!a.length) return 0; const s=a.slice().sort((x,y)=>x-y); const m=Math.floor(s.length/2); return s.length%2?s[m]:(s[m-1]+s[m])/2; };
global.esc = s => String(s??'');
const Chart = require(path.join(__dirname, '..', 'docs', 'lib', 'matrix_chart.js'));
let pass = 0, fail = 0;
function ok(name, cond, detail){
  if(cond){ pass++; console.log('PASS ' + name); }
  else { fail++; console.log('FAIL ' + name + (detail ? ' — ' + detail : '')); }
}
function container(){
  let html = '';
  return {
    set innerHTML(v){ html = String(v); },
    get innerHTML(){ return html; },
    querySelectorAll(){ return []; }
  };
}
const points = [
  { id:'a', label:'A', x:9, y:8 },
  { id:'b', label:'B', x:9, y:5 },
  { id:'c', label:'C', x:6, y:6 }
];
const c1 = container();
Chart.render({ container:c1, points, xCut:7, yCut:7, showSector:true, sectorWidth:1.5 });
ok('showSector: 交集多边形已画', c1.innerHTML.includes('<polygon'));
ok('showSector: 两条均衡带直线已画', (c1.innerHTML.match(/stroke-dasharray="2 3"/g)||[]).length === 2, c1.innerHTML.slice(0,200));
ok('showSector: 散点已画', (c1.innerHTML.match(/<circle/g)||[]).length === 3);
const cHover = container();
Chart.render({ container:cHover, points, xCut:7, yCut:7, showSector:true, sectorWidth:1.5,
  hover: p => p.label + '｜象限：明星｜已最优' });
ok('hover: <title> 已嵌入 circle（T11）', cHover.innerHTML.includes('<title>A｜象限：明星｜已最优</title>'), cHover.innerHTML.slice(0,300));
const c2 = container();
Chart.render({ container:c2, points, xCut:7, yCut:7, showSector:false });
ok('无扇面: 无 polygon', !c2.innerHTML.includes('<polygon'));
ok('无扇面: 无均衡带直线', !c2.innerHTML.includes('stroke-dasharray="2 3"'));
ok('无扇面: 切分线仍在', (c2.innerHTML.match(/stroke-dasharray="4 3"/g)||[]).length >= 2);

// 2026-09-01：密集簇标签避让（3.4 看不清根因 = 标签固定右上互相叠）。
// 点标签带 class="pt-label"；放不下就不画，悬浮 title 兜底全名。
const dense = [];
for(let i=0;i<8;i++) dense.push({ id:'d'+i, label:'智能温控场景'+i, x:8.6+i*0.12, y:7.4+(i%3)*0.25 });
const cDense = container();
Chart.render({ container:cDense, points:dense, xCut:7, yCut:7, hover: p => p.label });
const nDense = (cDense.innerHTML.match(/class="pt-label"/g)||[]).length;
ok('密集簇: 标签有避让（8 点不满画）', nDense < 8 && nDense >= 1, 'drew ' + nDense);
ok('密集簇: 悬浮 title 全名兜底', (cDense.innerHTML.match(/<title>/g)||[]).length === 8);
const cSparse = container();
Chart.render({ container:cSparse, points, xCut:7, yCut:7 });
ok('稀疏: 3 点全画标签', (cSparse.innerHTML.match(/class="pt-label"/g)||[]).length === 3);
delete global.median; delete global.esc;
console.log(`\n${pass} pass / ${fail} fail`);
process.exit(fail === 0 ? 0 : 1);
