# SEC06 — config.yaml 裸 f-string 写入:可注入破坏配置

严重度:低 / 方向:安全 / 确认度:confirmed

## 问题

PUT /api/config 的五个字段用 f-string 裸写入 yaml(无引号、无合法性校验)。传 `provider:"gemini\nfoo: bar"` 可在 config.yaml 注入任意 YAML 键;传含特殊字符的 baseUrl 可生成畸形 yaml,load_config 吞异常静默回退默认值——表现为"设置保存成功但实际行为变默认"的静默故障。是 SEC01(任意来源可写配置)的分体;即使修了跨源,本地配置也缺字段级校验。

## 期望

provider 枚举校验、baseUrl 须 http(s)://host、写 yaml 用安全序列化(safe_dump/安全 quoting)。

## 证据

- server/app.py:121-131 — 配置写入端点
- server/config.py:60-87 — f-string 裸写 yaml

## 修复方向

字段级校验 + yaml.safe_dump。
