"""LLM request proxy — forwards requests to the configured provider, keeps API key server-side."""
from __future__ import annotations

from typing import Any

import httpx

from config import load_config
from gemini_body import build_gemini_body

TIMEOUT = 120.0


async def proxy_llm(
    messages: list[dict[str, str]],
    opts: dict[str, Any] | None = None,
    profile: dict[str, Any] | None = None,
) -> tuple[int, dict[str, Any]]:
    """Proxy an LLM chat completion request.

    Returns (status_code, response_dict). On success the dict includes '_text'
    with the extracted response content so the frontend doesn't need to know
    provider-specific shapes.

    `profile` is ignored (SEC02): it previously let any caller override
    baseUrl/model/apiKey, turning this endpoint into an open HTTP proxy
    (SSRF). Server config is the single source of truth.
    """
    opts = opts or {}
    cfg = load_config()

    provider = cfg.get("provider", "deepseek")
    api_key = cfg.get("apiKey", "")
    base_url = (cfg.get("baseUrl") or "").rstrip("/")
    model = cfg.get("model", "")
    temperature = opts.get("temperature", cfg.get("temperature", 1.0))

    if not api_key:
        return 503, {"error": {"message": "未配置 API Key，请在「API 设定」中填写。"}}
    if not base_url:
        return 503, {"error": {"message": "未配置 Base URL。"}}
    if not model:
        return 503, {"error": {"message": "未配置 Model。"}}

    try:
        if provider == "gemini":
            return await _proxy_gemini(
                base_url, model, api_key, messages, temperature, opts
            )
        else:
            return await _proxy_openai_compatible(
                base_url, model, api_key, messages, temperature, opts
            )
    except httpx.TimeoutException:
        return 504, {"error": {"message": "LLM 请求超时（120 秒），请稍后重试。"}}
    except httpx.ConnectError as e:
        return 502, {"error": {"message": f"无法连接到 LLM 服务：{e}"}}
    except Exception as e:
        return 500, {"error": {"message": f"代理请求失败：{e}"}}


async def _proxy_openai_compatible(
    base_url: str,
    model: str,
    api_key: str,
    messages: list[dict],
    temperature: float,
    opts: dict,
) -> tuple[int, dict]:
    url = f"{base_url}/chat/completions"
    body: dict[str, Any] = {
        "model": model,
        "messages": messages,
        "temperature": temperature,
        "stream": False,
    }
    if opts.get("response_format"):
        body["response_format"] = opts["response_format"]

    async with httpx.AsyncClient(timeout=TIMEOUT) as client:
        res = await client.post(
            url,
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {api_key}",
            },
            json=body,
        )

    if res.status_code != 200:
        return _error_response(res)

    data = res.json()
    text = data.get("choices", [{}])[0].get("message", {}).get("content", "")
    data["_text"] = text
    return 200, data


async def _proxy_gemini(
    base_url: str,
    model: str,
    api_key: str,
    messages: list[dict],
    temperature: float,
    opts: dict[str, Any],
) -> tuple[int, dict]:
    url = f"{base_url}/models/{model}:generateContent"
    body = build_gemini_body(messages, temperature, opts)

    async with httpx.AsyncClient(timeout=TIMEOUT) as client:
        res = await client.post(
            url,
            headers={"Content-Type": "application/json"},
            params={"key": api_key},
            json=body,
        )

    if res.status_code != 200:
        return _error_response(res)

    data = res.json()
    text = (
        data.get("candidates", [{}])[0]
        .get("content", {})
        .get("parts", [{}])[0]
        .get("text", "")
    )
    data["_text"] = text
    return 200, data


def _error_response(res: httpx.Response) -> tuple[int, dict]:
    """Extract error message from provider error response, pass through status."""
    try:
        data = res.json()
        msg = data.get("error", {}).get("message") or data.get("message", "")
        if not msg:
            msg = f"HTTP {res.status_code}"
        return res.status_code, {"error": {"message": msg}}
    except Exception:
        return res.status_code, {"error": {"message": f"HTTP {res.status_code}"}}
