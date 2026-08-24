/* ═══════════════════════════════════════════════════════════════
   MONO — Lieflat Charts 共享库
   风格的唯一正本；本文件被 docs/charts/ 下所有图引用。
   来源：lieflat-charts/mono-tokens.js（与上游同步）
   用法：<script src="_lib/mono.js"></script>
   ═══════════════════════════════════════════════════════════════ */
(function (global) {
  'use strict';

  /* ── 1 · 色板 ──────────────────────────────────────
     纸灰 + 炭黑。明度即数据：最重要 = 最黑。       */
  const INK   = '#1C1C1A';
  const PAPER = '#F0EFEB';
  const MUTED = '#8F8E88';
  const FAINT = '#C6C5BF';
  const GRID  = '#DEDDD6';
  const L   = ['#1C1C1A', '#4A4944', '#6A6963', '#8F8E88', '#B0AFA9', '#C6C5BF', '#D8D7D1'];
  const LAD = ['#1C1C1A', '#4A4944', '#8F8E88', '#B0AFA9', '#D8D7D1'];

  /* ── 2 · 字体 ────────────────────────────────────── */
  const FONT = {
    family: 'Inter',
    link:   'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap',
    title:  { size: 16.5, weight: 700, spacing: '-.02em' },
    sub:    { size: 11.5, weight: 400 },
    src:    { size: 9.5,  weight: 500, spacing: '.08em' },
    value:  { weight: 800 },
    axis:   { size: 9.5,  weight: 600 },
    minHalf: 6.5, minWide: 5.5,
  };

  /* ── 3 · 形状 ────────────────────────────────────── */
  const SHAPE = {
    cardRadius: 24,
    cardPad:    '28px 28px 20px',
  };

  /* ── 4 · 动画 ──────────────────────────────────────
     快进快停 quarticOut，不弹跳。reduced-motion 降级在 mono.css。 */
  const MOTION = {
    enter: 900,
    staggerDot: 12,
    staggerBar: 100,
  };

  /* ── 5 · 确定性伪随机 ──────────────────────────────
     演示数据用，刷新必须长一样。                    */
  const rnd = (i, k) => Math.abs(((i * 73856093) ^ (k * 19349663)) % 1000) / 1000;

  /* ── 6 · SVG 快捷 ────────────────────────────────── */
  const NS = 'http://www.w3.org/2000/svg';
  const el  = (parent, tag, attrs) => {
    const n = document.createElementNS(NS, tag);
    if (attrs) for (const k in attrs) n.setAttribute(k, attrs[k]);
    parent.appendChild(n);
    return n;
  };
  const txt = (parent, attrs, s) => {
    const n = el(parent, 'text', attrs);
    n.textContent = s;
    return n;
  };
  const tip = (n, s) => {
    const t = document.createElementNS(NS, 'title');
    t.textContent = s;
    n.appendChild(t);
  };
  const html = (parent, s) => {
    parent.insertAdjacentHTML('beforeend', s);
  };

  /* ── 7 · 几何 ────────────────────────────────────── */
  const D2R = Math.PI / 180;
  const pol = (cx, cy, r, deg) => [cx + r * Math.cos(deg * D2R), cy + r * Math.sin(deg * D2R)];

  /* ── 8 · 统一 reveal：滚入视野才播，点击重播 ──────
     带 timer 登记，重播前清干净，防动画叠加。        */
  const timers = {};
  const keep = (id, t) => { (timers[id] = timers[id] || []).push(t); };
  const obsReveal = (id, fn) => {
    const n = document.getElementById(id);
    if (!n) return;
    const go = () => {
      (timers[id] || []).forEach(clearTimeout);
      timers[id] = [];
      if (n.tagName === 'svg' || n.tagName === 'SVG') n.innerHTML = '';
      fn(n);
    };
    const io = new IntersectionObserver(es => {
      if (es[0].isIntersecting) { go(); io.disconnect(); }
    }, { threshold: .3 });
    io.observe(n);
    n.style.cursor = 'pointer';
    n.addEventListener('click', go);
  };

  /* ── 9 · 工具 ────────────────────────────────────── */
  const median = arr => {
    const s = arr.slice().sort((a, b) => a - b);
    const m = Math.floor(s.length / 2);
    return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
  };
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const esc = s => String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

  global.MONO = {
    INK, PAPER, MUTED, FAINT, GRID, L, LAD,
    FONT, SHAPE, MOTION,
    rnd, pol, D2R,
    el, txt, tip, html,
    obsReveal, keep,
    median, clamp, esc,
  };
})(typeof window !== 'undefined' ? window : globalThis);
