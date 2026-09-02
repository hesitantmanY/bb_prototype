# docs/charts/

本目录是 Brand-building 项目的 **lieflat-charts 风格图的标准位置**。

> 约定：本项目里所有「成片交付」的图（教学样张、报告插图、独立可分享的图）都放进 `docs/charts/`，统一遵守 [lieflat-charts](https://github.com/larashero3-dotcom/lieflat-charts) 的 Mono 视觉语法与工作流。

> 浏览入口：[`index.html`](./index.html) —— 画廊页，9 张图的索引与说明。

## 与项目内其他图的边界

| 在哪里 | 是什么 | 例子 |
|---|---|---|
| `docs/workshop1.js` ~ `workshop5.js` | 内嵌在工作坊 UI 里的**交互式组件**（与表单/状态机联动） | 微笑曲线诊断 SVG、感知价值矩阵、媒介预算百点图 |
| `docs/cases/<case>/*.js` | 具体案例（山木茶事等）的工作坊实例化 | 山木茶事的 work1.js |
| **`docs/charts/*.html`** ← 你在这里 | **独立、可分享、双击可开的成片图**。可嵌入报告、PPT、外部分享 | 本目录所有 HTML |
工作坊 UI 里的图保持原生 SVG / ECharts 写法以保证交互联动；成片输出的图走 lieflat-charts。

## 当前文件

| # | 文件 | 图型 / 思路 | 用途 | 来源 workshop |
|---|---|---|---|---|
| 01 | `smile-curve.html` | 库外：价值链微笑曲线（U 形参考 + 5 维能力点） | OEM→OBM 转型情境的典型画像 | workshop1（分析步骤） |
| 02 | `perceived-value-matrix.html` | G20 Matrix Heat 思路：4×4 画像 × 场景 | 客户研究 · 场景短板定位 | workshop1（感知价值矩阵） |
| 03 | `indicator-means-bars.html` | F5 Tick Rows：横向条形 + group 着色 | 品牌资产评估 · CBBE 体系 | workshop1（指标步骤） |
| 04 | `market-matrix.html` | F8 Plumb Scatter：四象限散点 + 中位切线 | 目标市场选择 · GE 矩阵 | workshop2（矩阵步骤） |
| 05 | `desirability-matrix.html` | Matrix + Sector：四象限 + 决策扇面 | 价值主张筛选 · 明星落点 | workshop3（矩阵步骤） |
| 06 | `channel-tree.html` | G7 Tree LR：左右两栏层级 | 营销组合 · 渠道结构 | workshop4（place 步骤） |
| 07 | `media-budget-hundred-field.html` | L14 Hundred Field：10×10 圆点矩阵 | 营销组合 · 媒介预算 | workshop4（promotion 步骤） |
| 08 | `word-freq-bars.html` | F5 Tick Rows：词频横向条 | 卖点挖掘 · LDA 主题结果 | workshop3（mining 步骤） |
| 09 | `swot-matrix.html` | L4 Arc Matrix 思路：2×2 SWOT + 战略提示 | 策划书 · 战略分析 | workshop5（ch2 SWOT） |

`index.html` 是画廊入口。所有图均使用 **Mono** 色板 + `obsReveal` 动画 + 卡片四件套结构。

## 共享库（`_lib/`）

| 文件 | 作用 |
|---|---|
| `_lib/mono.css` | 页面骨架、卡片样式、字体、动画（pop / fade / draw / bar-grow）、reduced-motion 降级 |
| `_lib/mono.js` | MONO 颜色 token、字体、形状、几何工具（pol/el/txt/tip/html）、`obsReveal`、`median`/`clamp`/`esc` |

每张图只内联数据 + 渲染逻辑，色板与动画统一从 `_lib/` 引用。如需调整全局风格，改这两个文件即可。

## 工作流（每张图都按这个走）

1. **判数据形状** —— 几个类目？带时间？占比？带正负？
2. **先审计主力，再考虑后备** —— L1–L15 与 F1–L13 是默认候选；命中 5 个例外（OHLC / 五数概括 / 跨 6 维 / 整年 52 周 / 多系列构成随时间）才直入后备。
3. **必要时 Glance** —— 上面都不适配或用户明确要 dashboard 才用。
4. **锁定真实模板** —— 翻 `catalog.md` 找到图型编号与 gallery 文件名，按卡内标题定位。
5. **按图数规则组成批次** —— 一张图一个结论；2–3 张各承担不同结论。
6. **按模板渲染并自检** —— 自检清单见 `lieflat-charts/SKILL.md` §八。

库外图型（如 smile-curve、desirability-matrix 的扇面、swot 战略组合）按 `SKILL.md` §六 翻译流程走：① 答本体 → ② 找亲戚 → ③ 用 token 造句 → ④ 过硬规则。每张图的代码注释里都标了候选审计理由。

## 文件结构（参考任意图）

```html
<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>图名 · Mono — Lieflat Charts</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="_lib/mono.css">
</head>
<body>
  <div class="grid2">
    <div class="card [wide]">
      <h2>{结论式标题，不写图型名}</h2>
      <div class="sub">{说明 · 图例 · 时间范围}</div>
      <svg id="chart" viewBox="0 0 720 XXX"></svg>
      <div class="src">{图型名 · 系列 · 来源（全大写）}</div>
    </div>
  </div>
  <script src="_lib/mono.js"></script>
  <script>
    const DATA = [ /* 用户只需要改这里 */ ];
    MONO.obsReveal('chart', el => { /* 渲染 */ });
  </script>
</body>
</html>
```

## 颜色系统

默认 **Mono**（纸灰 `#F0EFEB` + 炭黑 `#1C1C1A`，7 阶灰 ladder）。需要彩色时：
- 蓝 / 冷 / 学术 → `porcelain`
- 绿 / 暖 / 自然 / 复古 → `palm`
- 黑白克制 + 1 个主角 → `wire`

**同一份 HTML 只用一套色系。** 自定义色板按 `SKILL.md` §六.五 custom 规则建，**只内联在对应交付中**，不回写仓库。

## 资源

- lieflat-charts 项目：<https://github.com/larashero3-dotcom/lieflat-charts>
- 图型目录（49+ 张）：`catalog.md`（<https://github.com/larashero3-dotcom/lieflat-charts/blob/main/catalog.md>）
- 工作流与硬规则：`SKILL.md`（<https://github.com/larashero3-dotcom/lieflat-charts/blob/main/SKILL.md>）
- 颜色预设：`color-presets.js`
- 共享 token：`mono-tokens.js`
