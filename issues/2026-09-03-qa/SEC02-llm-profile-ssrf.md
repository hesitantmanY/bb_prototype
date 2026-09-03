# SEC02 — /api/llm 的 profile 参数无约束:开放 SSRF 代理

严重度:高 / 方向:安全 / 确认度:confirmed

## 问题

`POST /api/llm` 请求体可携带任意 `profile` 对象,服务端 `cfg = profile or load_config()` 让客户端 profile **完全覆盖**服务端配置(provider/apiKey/baseUrl/model 全由客户端指定)。校验层明确放行("profile 通过但结构不校验")。结果是:任何能触达 127.0.0.1:8765 的进程/网页都能把本地服务当 HTTP 代理,向任意 URL(含 127.0.0.1 其他端口、路由器/内网面板、云元数据)发任意 POST 并读回响应;`model` 还可注入 URL 路径。

与 SEC01 叠加:跨源网页无需先改配置即可直接用 profile 打内网。

## 期望

profile 要么移除,要么受限:provider 白名单、baseUrl 仅 http(s) 且主机名校验、不可指向私有/回环网段(除非显式配置)。

## 证据

- server/llm_proxy.py:26 — `cfg = profile or load_config()`
- server/llm_proxy.py:66 / :103 — baseUrl 与 model 直接拼 URL 发请求
- server/llm_validate.py:102-103 — profile 直通不校验结构
- server/test_llm_endpoint.py — 只测 gemini body 接缝,不测 profile 逃逸

## 复现

```
POST /api/llm  {"messages":[{"role":"user","content":"hi"}],
  "profile":{"provider":"custom","baseUrl":"http://127.0.0.1:22","model":"x","apiKey":"anything"}}
```

服务器向 127.0.0.1:22 发 POST(响应被回传)。

## 修复方向

profile 若不启用就忽略(强制走服务端配置);若启用则做 provider 枚举 + baseUrl 白名单/主机名校验(禁私有网段,除非显式信任)。
