# BIZ13 — 快速刷新后回到旧页面（state > 64KB 时 pagehide save 静默失败）

严重度:中 / 方向:业务流程 / 确认度:confirmed（trace 7/7 + 测试 64/64）

## 问题

用户报告：原本在 W1 step 3，**打字后切到 step 8，刷新 → beforeunload 弹窗 → 确认 → 回到 step 3**。期望 step 8，实际 step 3。

### systematic-debugging 复现链路

```
1. 用户在 step 3 打字（dirty=true, 弹窗触发条件）
2. 用户切到 step 8（state 累积变 64KB+——典型场景：推荐文案、调研回答、价值主张正文）
3. F5 刷新
4. beforeunload 弹窗（dirty=true）→ 用户确认
5. pagehide 触发 sendBeacon(payload)
6. payload > 64KB → sendBeacon 静默 return false ❌
7. fallback fetch with keepalive 也失败（同样 64KB 限制）❌
8. 没有任何 PUT/POST 成功 → server 仍是老 state（currentStep=3）
9. 页面重新加载 → init 读 server → currentStep=3
10. 用户回到 step 3 ❌
```

### 根因（Phase 1.4 跨组件取证确认）

`/tmp/biz13_trace3.js` 跑出 7/7 pass：

| 场景 | sendBeacon | fallback fetch | 最终存盘 |
|---|---|---|---|
| 小 state（几 KB） | ✅ 成功 | — | ✅ 存盘 |
| 大 state（70KB） | ❌ **return false**（>64KB 硬规范） | ❌ 同样失败 | ❌ **完全没存** |

`navigator.sendBeacon` 有 **64KB 硬上限**（浏览器规范，所有 web app 都受限制）；`fetch with keepalive` 同样受限。**两条通道都被大 payload 卡死且全部静默**——没 console、没 toast、没错误。

`sendBeacon` 的 64KB 是**浏览器硬规范，无法绕过**。BIZ11/BIZ12 的 pagehide 兜底在 state > 64KB 时彻底失效。

### 排除的假设

- ❌ dirty 提前被清零（goStep / goWork 不动 dirty）
- ❌ saveNow 提前跑（用户没点保存、2 分钟 autosave 还没到）
- ❌ sendBeacon URL 错（server 端 `app.py:265` 有 `POST /api/state` 别名专门给 sendBeacon 用）
- ❌ 跨域 origin（`_origin_allowed` 显式允许 `null` origin，sendBeacon 用 `null`）
- ❌ pagehide 事件未触发（弹窗已确认走完，pagehide 必然触发）

## 期望

刷新后落在用户**最后切到的位置**（work + step），不管 state 大小。这是 UX 核心，不能丢。

## 修复决策（grill 收尾）

候选 4 选 1：
- **A. localStorage 兜底** ← 选
- B. 只 sendBeacon `meta` 小包
- C. Service Worker 拦截
- D. 不修

选 A 理由：
1. **精准对症**——用户痛点是"刷新后位置丢了"，localStorage 存位置（work + step）刚好
2. **同步保证**——`localStorage.setItem` 是同步 API，goStep/goWork 调完一定写完。不依赖浏览器异步/网络
3. **零 server 改动**——BIZ11/BIZ12 server 端兜底保留，localStorage 是客户端第二道兜底
4. **和 BIZ11/BIZ12 互补不冲突**——server 那条 BIZ08/BIZ11/BIZ12 救小 state；localStorage 救大 state
5. **符合之前"能接受未保存的情况"**——localStorage 只存位置，work 数据继续走 server 那条 BIZ08/BIZ11 通道，丢点也接受

## 修复

### 改动 1：`goStep` 末尾同步写 localStorage（`docs/lib/app.js:180-184`）

```js
state.meta.currentStep = id;
// BIZ13：同步写 localStorage 兜底"刷新后位置丢失"——sendBeacon 64KB 硬限制
// 救不回大 state；localStorage 同步保证写完。case 模式跳过，保持"预 case 位置"。
if(state && !state.meta.isDemo){
  try{ localStorage.setItem('brand.lastPos', JSON.stringify({work: state.meta.currentWork, step: id})); }catch(_){}
}
```

- goWork 内部调 goStep，自动覆盖 work 切换
- case 模式跳过：保持"预 case 位置"——退出案例后回到原位置而非案例位置

### 改动 2：`init` 在 `mergeWithDefaults` 后、renderAll 前读 localStorage（`docs/lib/app.js:46-60`）

```js
// BIZ13：localStorage 兜底刷新后位置丢失。sendBeacon 在 state > 64KB 时
// 静默失败（浏览器硬规范），work 数据走 server 那条 BIZ08/BIZ11 通道丢点
// 用户可接受，但"位置"是 UX 核心不能丢——localStorage 同步保证写完。
// case 模式跳过：保持"预 case 位置"，退出案例后回到原位置而非案例位置。
if(state && !state.meta.isDemo && !state.meta.demoCase){
  try{
    const raw = localStorage.getItem('brand.lastPos');
    if(raw){
      const pos = JSON.parse(raw);
      if(pos && [1,2,3,4,5].includes(pos.work)) state.meta.currentWork = pos.work;
      if(pos && typeof pos.step === 'string' && pos.step.length>0){
        const mod={1:Work1,2:Work2,3:Work3,4:Work4,5:Work5}[state.meta.currentWork];
        if(mod && mod.steps.some(s => s.id === pos.step)) state.meta.currentStep = pos.step;
      }
    }
  }catch(_){}
}
```

- **双判 isDemo + demoCase**：案例模式完全跳过，保留 case 自己的 currentStep
- **work 校验 `[1,2,3,4,5]`**：防止 localStorage 损坏读到非法值
- **step 校验 `mod.steps.some(s => s.id === pos.step)`**：防止 step id 在新版本里被删除后还硬塞回去
- **try/catch 包裹**：localStorage 不可用（隐私模式、配额满）时静默 fallback

### 数据流（修复后）

```
[切步/切work]
  goStep(id) 或 goWork(n) 内部 goStep
    ↓
  state.meta.currentStep = id   (内存)
    ↓
  localStorage.setItem('brand.lastPos', {work, step})  (同步、可靠)
    ↓
  sendBeacon (fire-and-forget，能成就成、不能成也不影响)

[刷新]
  init
    mergeWithDefaults(serverState)  ← work 数据从这里
    ↓
    localStorage.getItem('brand.lastPos')  ← 位置从这里
    ↓
    校验 [1..5] + mod.steps.some
    ↓
    state.meta.currentWork/Step 覆盖
    ↓
  renderAll → 恢复正确位置 ✓
```

## 副作用评估

- **localStorage 配额**：5-10 MB（B 端常见）。存 `{work:1, step:"recommendations"}` ≈ 50 字节，亿次切步也不会爆
- **隐私模式**：localStorage 不可用时 setItem 抛异常，被 try/catch 吞掉，无影响
- **多 tab 同步**：localStorage 跨 tab 共享，最后一次写入胜出。与 server 端 BIZ03 跨 tab 对账不冲突
- **跨浏览器 / 跨设备**：localStorage 不跨浏览器/设备。新设备用 server 端 BIZ11/BIZ12 兜底
- **case 模式**：双判 isDemo + demoCase 完全跳过，保留 case 的 currentStep
- **用户清缓存**：localStorage 清空，fallback 到 server 端（`currentStep = null`）→ 回到 W1.sbu
- **BIZ11/BIZ12 链路仍工作**：server 端兜底保留，localStorage 是"server 失败时仍有位置"的第二道兜底
- **没有动 saveNow / pagehide / goWork 主体**：0 行业务逻辑改动

## 验证

扩展 `tests/w_refresh_step_lag.test.js`，**64 / 64 通过**（BIZ11 33 + BIZ12 18 + BIZ13 13）。

**源层契约**（新增 5 条）：
- goStep 同步写 `localStorage.setItem('brand.lastPos'`
- goStep 写 localStorage 在 case 模式跳过（`!state.meta.isDemo` 守门）
- init 读 `localStorage.getItem('brand.lastPos'`
- init 在 case 模式跳过（`!isDemo && !demoCase` 双判）
- init 读出 work 后校验 `[1,2,3,4,5]`
- init 读出 step 后校验 `mod.steps.some(s => s.id === pos.step)`

**行为层**（新增 Case 9-11 共 13 条）：
- **Case 9** 大 state 场景（70KB recommendations）：
  - 切到 step 8 → localStorage 写入 ✓
  - pagehide save 失败（state > 64KB）→ server 仍是 step 3
  - 刷新 → init 读 localStorage → state.currentStep 覆盖为 'recommendations' ✓
- **Case 10** localStorage 空 / null：保留 server 位置
- **Case 11** case 模式（isDemo=true）：不读 localStorage，保留 case 的 currentStep

**完整套件**：`node scripts/run-tests.js` 报 58 pass / 3 fail（3 个 pre-existing 用 `git stash` 验证与 BIZ13 无关）。

**端到端**（需浏览器手验）：
- 打开应用 → W1 step 3 → 在某字段填 50KB+ 内容 → 切到 step 8 → F5 刷新
- **应当**：刷新后仍在 W1 step 8
- **修复前**：刷新后回到 W1 step 3（pagehide sendBeacon 静默失败，server 仍是 step 3）

## 决策时序

- 2026-09-07：BIZ11/BIZ12 落地后用户实测发现"快速刷新后弹窗 + 回到另一个页面"；用 systematic-debugging 走 4 阶段定位 sendBeacon 64KB 硬限制 + fallback fetch 同样受限；选 A（localStorage 兜底）作为唯一不受浏览器硬规范限制的方案。
- 关联：
  - [BIZ11](BIZ11-w-refresh-step-lag.md) — server 端兜底（currentStep），小 state 救回
  - [BIZ12](BIZ12-w-refresh-work-lag.md) — server 端兜底（currentWork），撞 id 场景救回
  - [BIZ13] — 客户端 localStorage 兜底，大 state 救回（绕过 sendBeacon 64KB 硬限制）
  - BIZ08（pagehide sendBeacon 兜底）— 仍工作，但大 state 时救不回

## 架构图（修复后多层兜底）

```
                    ┌──────────────────────────────────┐
                    │   用户刷新                      │
                    └──────────────┬───────────────────┘
                                   │
                    ┌──────────────▼───────────────┐
                    │  init 读 localStorage         │ ← BIZ13 客户端兜底
                    │  brand.lastPos               │   （大 state 救回）
                    └──────────────┬───────────────┘
                                   │ (overrides if 非 case)
                    ┌──────────────▼───────────────┐
                    │  init 读 server /api/state   │
                    └──────────────┬───────────────┘
                                   │
                    ┌──────────────▼───────────────┐
                    │  渲染当前 work+step           │
                    └──────────────────────────────────┘
                    ↑ 刷新中可能跑的存盘路径 ↓
                                   │
        ┌──────────────────────────┴────────────────────────┐
        │                                                    │
┌───────▼────────┐                                  ┌────────▼────────┐
│ 2 分钟 autosave │                                  │ pagehide        │
│ (BIZ08 + dirty) │                                  │ sendBeacon       │
└───────┬────────┘                                  │ + fetch keepalive│
        │                                            │ (BIZ11+BIZ12 守门)│
        └─────────────────┬──────────────────────────┘
                          │
                ┌─────────▼─────────┐
                │  PUT/POST /api/state│
                │  (server 端存盘)     │
                └─────────────────────┘

适用矩阵：
                   小 state        大 state
─────────────────────────────────────────
autosave 2min        ✓               ✓
pagehide sendBeacon  ✓ (BIZ11+BIZ12) ❌ (>64KB)
localStorage        ✓ (BIZ13)        ✓ (BIZ13)  ← 唯一可靠路径
```

## 退役说明（2026-09-07 BIZ14）

localStorage 兜底已被 [BIZ14](BIZ14-position-url-routing.md)（位置 URL 路由 ?w=&s=&case=）
取代：位置由浏览器原生保留在 URL 中，无 64KB 限制、不依赖网络。brand.lastPos 相关代码
已移除，本文档保留作决策记录。
