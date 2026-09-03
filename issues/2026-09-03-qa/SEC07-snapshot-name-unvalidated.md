# SEC07 — 版本名无长度/字符校验:非法名致保存 500

严重度:低 / 方向:安全 / 确认度:confirmed

## 问题

创建/改名版本时 name 无 max_length、无字符过滤(storage.py 直接把含换行/任意长度的名字拼进文件名)。名字超 255 字节时文件写入抛 OSError 未捕获 → 500;含控制字符的名字显示在历史面板(渲染层用 textContent,无注入,仅污染观感)。

## 期望

name 限长(如 ≤60)并剥离控制字符/换行,超限返回 4xx 而非 500。

## 证据

- server/app.py:86-95 — SnapshotCreate.name 无长度约束
- server/storage.py:156-159 / 242-244 — 名字直接进文件名

## 修复方向

Pydantic 约束 + 文件名安全化。
