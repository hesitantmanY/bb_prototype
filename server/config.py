"""Configuration management: config.yaml for non-sensitive settings, .env for API key."""
from __future__ import annotations

import os
from pathlib import Path
from typing import Any

import yaml
from dotenv import dotenv_values, set_key

SERVER_DIR = Path(__file__).resolve().parent
CONFIG_FILE = SERVER_DIR / "config.yaml"
ENV_FILE = SERVER_DIR / ".env"

DEFAULTS: dict[str, Any] = {
    "provider": "deepseek",
    "baseUrl": "https://api.deepseek.com",
    "model": "deepseek-v4-flash",
    "temperature": 1.0,
    "backendUrl": "http://localhost:8765",
}


def load_config() -> dict[str, Any]:
    """Load config from config.yaml, merge with .env key."""
    cfg = dict(DEFAULTS)

    if CONFIG_FILE.exists():
        try:
            with open(CONFIG_FILE, "r", encoding="utf-8") as f:
                file_cfg = yaml.safe_load(f) or {}
            cfg.update({k: v for k, v in file_cfg.items() if v is not None})
        except Exception:
            pass  # fall back to defaults

    # Load API key from .env
    env_vals = dotenv_values(ENV_FILE) if ENV_FILE.exists() else {}
    cfg["apiKey"] = env_vals.get("LLM_API_KEY", "") or ""

    return cfg


def save_config(config: dict[str, Any]) -> dict[str, Any]:
    """Save non-sensitive fields to config.yaml, apiKey to .env. Returns merged config."""
    # Ensure server dir exists
    SERVER_DIR.mkdir(parents=True, exist_ok=True)

    # Separate apiKey from other config
    api_key = config.pop("apiKey", None)

    # Write config.yaml
    provider = config.get("provider", DEFAULTS["provider"])
    base_url = config.get("baseUrl", DEFAULTS["baseUrl"])
    model = config.get("model", DEFAULTS["model"])
    temperature = float(config.get("temperature", DEFAULTS["temperature"]))
    backend_url = config.get("backendUrl", DEFAULTS["backendUrl"])

    # Hand-written (instead of yaml.dump) so the explanatory comments survive
    # every save from the settings modal. String fields go through safe_dump
    # so values are quoted when needed (SEC06 — prevents YAML injection via
    # provider/baseUrl/model/backendUrl).
    def _quote(value: Any) -> str:
        return yaml.safe_dump(value, allow_unicode=True).strip()

    yaml_text = f"""# Global Brand Building — LLM 配置
# 也可在页面右上角「API 设定」里修改，保存时会覆写本文件。

# 提供商: 名称与前端 docs/lib/providers.js 保持一致（deepseek / doubao /
# moonshot / minimax / qwen / zhipu / openai / gemini / custom 等）
provider: {_quote(provider)}

# API 基地址。提供商预设：
#   deepseek -> https://api.deepseek.com
#   openai   -> https://api.openai.com/v1
#   gemini   -> https://generativelanguage.googleapis.com/v1beta
baseUrl: {_quote(base_url)}

# 模型名称
model: {_quote(model)}

# 采样温度，控制输出的随机性，取值 0.0–2.0：
#   0.0–0.3  稳定、确定，适合结构化输出/评分/JSON（Delphi 权重、打分）
#   0.4–0.8  平衡，日常生成与文案
#   0.9–1.2  发散、有创意，适合头脑风暴、slogan、备选方案
#   1.3–2.0  高随机性，可能跑偏，谨慎使用
# 改完保存即生效；页面上的滑块改的就是这个值。
temperature: {temperature}

# 本地 Python 服务地址（LDA / Excel / 数据存储），一般不用改
backendUrl: {_quote(backend_url)}
"""
    with open(CONFIG_FILE, "w", encoding="utf-8") as f:
        f.write(yaml_text)

    # Write .env — only if apiKey is provided (empty means "keep existing")
    if api_key is not None and api_key != "" and api_key != "********":
        set_key(str(ENV_FILE), "LLM_API_KEY", api_key)

    return load_config()


def public_config() -> dict[str, Any]:
    """Return config without the actual API key, just whether it exists."""
    cfg = load_config()
    key = cfg.pop("apiKey", "")
    cfg["apiKeyExists"] = bool(key)
    return cfg
