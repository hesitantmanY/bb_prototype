"""Regression: run_lda output must be JSON-serializable (no numpy types).

Background: topics[].share came back as numpy.float32 from gensim, which made
FastAPI/Pydantic return HTTP 500 on /api/lda. Guard the contract here.

Run: server/.venv/bin/python server/test_lda.py
"""
from __future__ import annotations

import json

from lda import run_lda


CORPUS = [
    "晚上睡觉老被热醒又冷醒，这温控器是不是傻的，白天上班没精神。",
    "我调了定时，半夜还是会乱跳，温度忽高忽低，根本没法睡整觉。",
    "听说智能温控器能学习睡眠习惯，希望真能让我一觉到天亮，省点电。",
    "宝宝房温度忽高忽低，半夜要起来看好几次，怕着凉又怕捂出痱子。",
    "远程模式时灵时不灵，人在客厅都连不上，更别说半夜在婴儿房看手机。",
    "出差回来屋里冷得像冰窖，出门前没法预调，只能路上手动开 APP。",
    "电费账单还是和以前一样吓人，显示的温度永远差好几度，实际热过头。",
    "设定 21 度它非要跑到 23 度才停，白白浪费一堆电，心里特别愧疚。",
    "老式温控器控温不精准，能源浪费严重，碳排放高。",
    "这个温控器是个孤岛，不能跟智能音箱联动，也没有学习能力。",
]


def test_output_is_json_serializable() -> None:
    result = run_lda(
        documents=CORPUS,
        k=3,
        passes=15,
        iterations=100,
        no_below=2,
        no_above=0.5,
        language="zh",
    )
    # Must not raise; numpy.float32 would blow up here.
    json.dumps(result)
    assert all(isinstance(t["share"], float) for t in result["topics"])
    print("PASS: run_lda output is JSON-serializable, shares are native float")


if __name__ == "__main__":
    test_output_is_json_serializable()
