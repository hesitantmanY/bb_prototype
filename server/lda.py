"""LDA topic modeling — reproduces the courseware 8-step pipeline.

Pipeline:
  1. data collection (documents from request)
  2. data cleaning (drop empty / too-short docs)
  3. Chinese tokenization (jieba)
  4. stopword removal
  5. dictionary construction (filter no_below / no_above)
  6. LDA training (gensim)
  7. result interpretation (topics, keyword weights, representative docs)
  8. model evaluation (c_v coherence)
"""
from __future__ import annotations

import os
import re
from collections import Counter
from typing import Any

import jieba
from gensim import corpora
from gensim.models import CoherenceModel, LdaModel


# Bundled Chinese stopwords (common + a few marketing-research filler words).
_STOPWORDS = """
的 了 和 是 就 都 而 及 与 这 那 你 我 他 她 它 们 一个 一些 什么 怎么 为什么
在 有 没 不 也 还 很 但 但是 不过 而且 或者 因为 所以 如果 虽然 然后 就是
这个 那个 这样 那样 这些 那些 一直 已经 曾经 可能 应该 可以 能够 觉得 认为
啊 呀 吧 呢 吗 嘛 哦 哈 嗯 啦 哇 嘿 嘻
会 要 能 对 让 给 把 被 从 到 向 往 于 以 为 之 其 此 该 某 每
吧 家 里 上 下 中 内 外 前 后 左 右 边 个 件 种 次 些 点
more most very really just quite rather almost nearly about above below between
into onto upon within without among around across behind beside beyond during
except through throughout
the a an and or but if then else when while of to in on for with at by from as is are was were be been being have has had do does did it its this that these those i you he she we they me him her us them my your his our their
非常 比较 有点 一些 一下 一样 这种 那种 其实 真的 确实 还是 还有 不是 没有 不要 不能 不会
感觉 看到 用过 使用 东西 真的 特别 比较 蛮 挺 还 比较 而且 主要 可能 应该 现在 之前 之后
买 卖 店 家 款 块 元 个 啊 吧 呢 哈 哦 嗯
"""

EXTRA_STOPWORDS_FILE = os.path.join(os.path.dirname(__file__), "stopwords_zh.txt")


def _load_stopwords() -> set[str]:
    words = {w.strip() for w in _STOPWORDS.split() if w.strip()}
    if os.path.exists(EXTRA_STOPWORDS_FILE):
        with open(EXTRA_STOPWORDS_FILE, encoding="utf-8") as f:
            for line in f:
                w = line.strip()
                if w and not w.startswith("#"):
                    words.add(w)
    return words


_STOPWORDS_SET = _load_stopwords()

# 1–2 character tokens that are pure noise for marketing research.
_NOISE_RE = re.compile(r"^[\W\d_a-zA-Z]{1,2}$")


def _tokenize(text: str) -> list[str]:
    text = re.sub(r"\s+", " ", str(text)).strip()
    tokens = jieba.lcut(text)
    out = []
    for t in tokens:
        t = t.strip()
        if not t or t in _STOPWORDS_SET:
            continue
        if _NOISE_RE.match(t):
            continue
        if len(t) == 1 and not re.match(r"[一-鿿]", t):
            continue
        out.append(t)
    return out


def _clean_documents(documents: list[str], min_tokens: int = 3) -> tuple[list[str], list[list[str]]]:
    cleaned_texts: list[str] = []
    tokenized: list[list[str]] = []
    for doc in documents:
        text = str(doc or "").strip()
        if not text:
            continue
        tokens = _tokenize(text)
        if len(tokens) < min_tokens:
            continue
        cleaned_texts.append(text)
        tokenized.append(tokens)
    return cleaned_texts, tokenized


def run_lda(
    documents: list[str],
    k: int = 5,
    passes: int = 15,
    iterations: int = 100,
    no_below: int = 2,
    no_above: float = 0.5,
    language: str = "zh",
    random_state: int = 42,
) -> dict[str, Any]:
    """Run LDA on raw documents and return a JSON-serializable result dict."""
    raw_count = len([d for d in documents if str(d or "").strip()])
    cleaned_texts, tokenized = _clean_documents(documents)

    if not tokenized:
        return {
            "error": "no_valid_documents",
            "stats": {"raw_count": raw_count, "valid_count": 0},
            "topics": [],
            "word_freq_top": [],
        }

    dictionary = corpora.Dictionary(tokenized)
    dictionary.filter_extremes(no_below=no_below, no_above=no_above)
    if len(dictionary) == 0:
        return {
            "error": "empty_dictionary",
            "stats": {"raw_count": raw_count, "valid_count": len(cleaned_texts)},
            "topics": [],
            "word_freq_top": [],
        }

    corpus = [dictionary.doc2bow(doc) for doc in tokenized]

    lda = LdaModel(
        corpus=corpus,
        id2word=dictionary,
        num_topics=k,
        passes=passes,
        iterations=iterations,
        alpha="auto",
        eta="auto",
        random_state=random_state,
    )

    # Topic keywords with weights.
    raw_topics = lda.show_topics(num_topics=k, num_words=12, formatted=False)
    topics_out = []
    for tid, keywords in raw_topics:
        topics_out.append({
            "id": int(tid),
            "label": "",  # filled by caller (LLM)
            "label_generated": False,
            "share": 0.0,
            "keywords": [
                {"word": w, "weight": round(float(p), 4)} for w, p in keywords
            ],
            "representative_docs": [],
        })

    # Topic shares = average topic proportion across corpus.
    topic_totals = [0.0] * k
    for bow in corpus:
        dist = dict(lda.get_document_topics(bow, minimum_probability=0.0))
        for tid in range(k):
            topic_totals[tid] += dist.get(tid, 0.0)
    n = max(1, len(corpus))
    for t in topics_out:
        t["share"] = round(topic_totals[t["id"]] / n * 100, 1)

    # Representative docs per topic: pick docs with highest probability for that topic.
    doc_scores: dict[int, list[tuple[int, float]]] = {t["id"]: [] for t in topics_out}
    for i, bow in enumerate(corpus):
        dist = dict(lda.get_document_topics(bow, minimum_probability=0.0))
        for tid, prob in dist.items():
            doc_scores[int(tid)].append((i, float(prob)))
    for t in topics_out:
        top_docs = sorted(doc_scores[t["id"]], key=lambda x: x[1], reverse=True)[:3]
        t["representative_docs"] = [cleaned_texts[i][:300] for i, _ in top_docs]

    # Coherence (c_v).
    coherence = None
    try:
        cm = CoherenceModel(
            model=lda, texts=tokenized, dictionary=dictionary, coherence="c_v"
        )
        coherence = round(float(cm.get_coherence()), 4)
    except Exception:
        coherence = None

    # Word frequency top-25.
    counter: Counter[str] = Counter()
    for doc in tokenized:
        counter.update(doc)
    word_freq_top = [
        {"word": w, "count": int(c)} for w, c in counter.most_common(25)
    ]

    # Pre/post dictionary size for the stats block.
    pre_unique = len({w for doc in tokenized for w in doc})
    total_words = sum(len(doc) for doc in tokenized)

    return {
        "error": None,
        "stats": {
            "raw_count": raw_count,
            "valid_count": len(cleaned_texts),
            "total_words": total_words,
            "unique_words": pre_unique,
            "vocab_size": len(dictionary),
            "coherence": coherence,
            "k": k,
            "passes": passes,
            "iterations": iterations,
        },
        "topics": topics_out,
        "word_freq_top": word_freq_top,
    }
