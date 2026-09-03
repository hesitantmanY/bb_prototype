# AI01 — work4 步级回填:空数组静默清空已有广告/渠道/PR/促销数据

严重度:高 / 方向:AI 管线 / 确认度:confirmed

## 问题

json_extract.js 的表字段清洗中,`advertising`/`structure`/`pr`/`salesPromotion` 四个 schema 在「LLM 输出解析成数组但逐行清洗后为空」时直接返回 `{ok:true, value:[]}`,没有任何空数组防线——而同一文件里 `promotions`(471 行)和 `skus` 都有 `if(!cleaned.length) return {ok:false}`。消费端 work4「整体替换」把空数组落盘并计入"已填入字段数",toast 显示"已填入 n/total 个字段"。

典型触发:LLM 用了旁路键(如广告行只给 `channel` 不给约定键 `media`,清洗 filter 后全滤掉)或干脆给了空壳行。

同区域第二症状:清洗用 `Number(a.share ?? a.budgetShare ?? 0)`,LLM 写 `"30%"` 形态 → NaN → 归一化判断 `total>0` 为 false 被跳过,NaN 原样入库,下游渲染成 "NaN%"。

## 期望

空数组 = 解析失败:不落盘、不计入 n、字段保持旧值并给警告;share 接受 "30%" 形态(去百分号 parseFloat),非法值过滤。

## 复现

1. Work4 传播步已有真实广告数据;
2. 点该步 AI 起草,让 LLM 返回 `{"advertising":[{"media":"电视","share":30}]}` 之外的旁路键形态或空数组;
3. 确认「整体替换」→ 已有广告被清空,toast 却报已填入。

## 证据

- docs/lib/json_extract.js:474-528 — 四个 schema 无空数组 guard(对照 :471 promotions、:534+ skus 有)
- docs/lib/json_extract.js:477-480 — `Number("30%")` → NaN,归一化被跳过
- docs/workshop4.js:391-403 — 消费端 `p[s.key]=[]` 且计数 n++

## 修复方向

四个 schema 仿照 skus 加空数组 guard;share/结构 share 统一 parseFloat 去百分号、NaN 过滤;清洗层失败与警告沿既有 warnings 通道上报。
