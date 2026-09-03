"""Configuration management: config.yaml (non-sensitive) + .env (API keys).

Multi-provider layout (2026-09-03, 决策 grilling 锁定):
- config.yaml:  `active: <厂商名>` + `providers: {<厂商>: {baseUrl, model, temperature}}`
  + 全局 `backendUrl`。不含任何密钥。
- server/.env:   每家一行 `LLM_API_KEY_<厂商大写>='sk-…'`（600 权限）。
- 旧单槽（config.yaml 顶层 provider/baseUrl/model + .env 裸 LLM_API_KEY）
  自动按「老 provider 名」迁入新结构；裸 LLM_API_KEY **不自动归属任何厂商**
  （legacyKeyPending=true，等用户在设置里把 Key 配给正确的厂商——
  历史上单槽 era 存在 provider 与 Key 错配，自动归位会固化错账）。
  任一厂商存入新 Key 或用户「丢弃旧 Key」后裸行删除。

load_config() 保持旧形状（= 当前激活厂商的那一套），llm_proxy 等消费方零改动。
"""
from __future__ import annotations

import json
import re
from pathlib import Path
from typing import Any

import yaml
from dotenv import dotenv_values, set_key

SERVER_DIR = Path(__file__).resolve().parent
CONFIG_FILE = SERVER_DIR / "config.yaml"
ENV_FILE = SERVER_DIR / ".env"

KEY_PREFIX = "LLM_API_KEY_"
LEGACY_KEY = "LLM_API_KEY"
_NAME_RE = re.compile(r"^[A-Za-z][A-Za-z0-9_\-]{0,31}$")

# 无配置文件时的出厂默认（仅 deepseek；其余厂商由前端 providers.js 预填保存）
DEFAULTS: dict[str, Any] = {
    "provider": "deepseek",
    "baseUrl": "https://api.deepseek.com",
    "model": "deepseek-v4-flash",
    "temperature": 1.0,
    "backendUrl": "http://localhost:8765",
}


def _env_key(name: str) -> str:
    return KEY_PREFIX + re.sub(r"[^A-Za-z0-9]", "_", name).upper()


def _read_env() -> dict[str, str]:
    if not ENV_FILE.exists():
        return {}
    try:
        return dotenv_values(ENV_FILE)
    except Exception:
        return {}


def _write_env(env: dict[str, str]) -> None:
    """Rewrite .env preserving line order of known keys."""
    if not env:
        ENV_FILE.write_text("", encoding="utf-8")
        return
    ENV_FILE.write_text(
        "".join(f"{k}={v}\n" for k, v in env.items()), encoding="utf-8")


def _del_env_key(name: str) -> None:
    env = _read_env()
    if name in env:
        del env[name]
        _write_env(env)


def _read_yaml() -> dict[str, Any]:
    if not CONFIG_FILE.exists():
        return {}
    try:
        with open(CONFIG_FILE, "r", encoding="utf-8") as f:
            return yaml.safe_load(f) or {}
    except Exception:
        return {}


def _full() -> dict[str, Any]:
    """New-shape view: {active, providers{name:{baseUrl,model,temperature}}, backendUrl}."""
    data = _read_yaml()
    # 新结构直读
    if isinstance(data.get("providers"), dict) and data.get("active"):
        return {
            "active": str(data["active"]),
            "providers": {
                str(k): {kk: vv for kk, vv in (v or {}).items()}
                for k, v in data["providers"].items()
            },
            "backendUrl": data.get("backendUrl", DEFAULTS["backendUrl"]),
        }
    # 旧单槽迁移（内存级；保存时落盘为新结构）
    if data.get("provider") and data.get("baseUrl"):
        name = str(data["provider"])
        return {
            "active": name,
            "providers": {
                name: {
                    "baseUrl": data.get("baseUrl", ""),
                    "model": data.get("model", ""),
                    "temperature": float(data.get("temperature", DEFAULTS["temperature"])),
                }
            },
            "backendUrl": data.get("backendUrl", DEFAULTS["backendUrl"]),
        }
    return {
        "active": DEFAULTS["provider"],
        "providers": {},
        "backendUrl": DEFAULTS["backendUrl"],
    }


def load_config() -> dict[str, Any]:
    """当前激活厂商的旧形状配置（llm_proxy 消费）：含 apiKey（该厂商自己的）。"""
    full = _full()
    name = full["active"]
    p = full["providers"].get(name, {})
    env = _read_env()
    if name == DEFAULTS["provider"] and not p:
        base, model = DEFAULTS["baseUrl"], DEFAULTS["model"]
    else:
        base, model = p.get("baseUrl", ""), p.get("model", "")
    return {
        "provider": name,
        "baseUrl": base,
        "model": model,
        "temperature": float(p.get("temperature", DEFAULTS["temperature"])),
        "backendUrl": full["backendUrl"],
        "apiKey": env.get(_env_key(name), "") or "",
    }


def save_config(config: dict[str, Any]) -> dict[str, Any]:
    """写入（= 激活）指定厂商。入参为旧形状（provider/baseUrl/model/temperature/
    backendUrl/apiKey?）。Key 写 .env 的 LLM_API_KEY_<厂商> 行；若旧裸 LLM_API_KEY
    仍在则一并认领删除。返回 load_config()（激活后形状）。"""
    SERVER_DIR.mkdir(parents=True, exist_ok=True)

    api_key = config.pop("apiKey", None)
    name = str(config.get("provider") or DEFAULTS["provider"])
    if not _NAME_RE.match(name):
        raise ValueError(f"非法厂商名: {name}")

    full = _full()
    old = full["providers"].get(name, {})
    providers = dict(full["providers"])
    providers[name] = {
        "baseUrl": str(config.get("baseUrl", old.get("baseUrl", ""))),
        "model": str(config.get("model", old.get("model", ""))),
        "temperature": float(config.get("temperature", old.get("temperature", 1.0))),
    }
    full["active"] = name
    full["providers"] = providers
    if config.get("backendUrl"):
        full["backendUrl"] = str(config["backendUrl"])

    # JSON 引号 = 合法 YAML 标量。切勿用 yaml.safe_dump——它对单标量会输出
    # 文档结束符 "..."，嵌进模板后整份 yaml 非法、load 静默回退默认值
    # （2026-09-03 实锤：SEC06 早期版本曾因此把 config.yaml 写坏）。
    def _quote(value: Any) -> str:
        return json.dumps(str(value), ensure_ascii=False)

    yaml_text = f"""# Global Brand Building — LLM 配置（多厂商，2026-09-03 起）
# 也可在页面右上角「API 设定」里修改，保存时会覆写本文件。
# 密钥不在此文件——每家在 server/.env 的 LLM_API_KEY_<厂商> 行。

# 当前激活的厂商（AI 调用走这一家）
active: {_quote(name)}

# 各家非敏感配置（Key 在 .env）
providers:
"""
    for pname in sorted(providers):
        p = providers[pname]
        yaml_text += f"  {_quote(pname)}:\n"
        yaml_text += f"    baseUrl: {_quote(p.get('baseUrl', ''))}\n"
        yaml_text += f"    model: {_quote(p.get('model', ''))}\n"
        yaml_text += f"    temperature: {float(p.get('temperature', 1.0))}\n"
    yaml_text += f"""# 本地 Python 服务地址（LDA / Excel / 数据存储），一般不用改
backendUrl: {_quote(full['backendUrl'])}
"""
    with open(CONFIG_FILE, "w", encoding="utf-8") as f:
        f.write(yaml_text)

    # Key 处理：只有显式给了非空、非掩码的新 Key 才写入对应厂商槽
    if api_key is not None and str(api_key) not in ("", "********"):
        env = _read_env()
        env[_env_key(name)] = f"'{api_key}'"
        # 认领旧裸 Key：只要任一厂商存了新 Key，旧行即删
        env.pop(LEGACY_KEY, None)
        _write_env(env)

    return load_config()


def _provider_names() -> list[str]:
    return sorted(_full()["providers"].keys())


def public_config() -> dict[str, Any]:
    """完整公开视图：激活套平铺字段（旧形状兼容）+ active + providers（无 Key）
    + legacyKeyPending。"""
    cfg = load_config()
    key = cfg.pop("apiKey", "")
    full = _full()
    env = _read_env()
    cfg["apiKeyExists"] = bool(key)
    cfg["active"] = full["active"]
    cfg["providers"] = [
        {
            "name": n,
            "baseUrl": full["providers"][n].get("baseUrl", ""),
            "model": full["providers"][n].get("model", ""),
            "temperature": float(full["providers"][n].get("temperature", 1.0)),
            "apiKeyExists": bool(env.get(_env_key(n), "")),
        }
        for n in sorted(full["providers"])
    ]
    cfg["legacyKeyPending"] = LEGACY_KEY in env
    return cfg


def clear_provider_key(name: str) -> None:
    """清除指定厂商的 Key（.env 行）。"""
    if not _NAME_RE.match(name):
        raise ValueError(f"非法厂商名: {name}")
    _del_env_key(_env_key(name))


def discard_legacy_key() -> bool:
    """删除旧裸 LLM_API_KEY 行。返回是否真的存在过。"""
    env = _read_env()
    if LEGACY_KEY not in env:
        return False
    _del_env_key(LEGACY_KEY)
    return True
