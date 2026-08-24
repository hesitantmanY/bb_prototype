---
title: "AI-Human Hybrids for Marketing Research: Leveraging Large Language Models (LLMs) as Collaborators"
source: "Journal of Marketing 2025, Vol. 89(2) 43-70 (American Marketing Association)"
author:
  - "Neeraj Arora"
  - "Ishita Chakraborty"
  - "Yohei Nishimura"
published: "2025"
created: 2026-08-17
description: "JM 2025 实证论文。核心命题：人机混合（human-LLM hybrid）能同时提升营销研究的效率与效果。定性侧用 GPT-4 复现某财富500强食品公司 2019 年 Friendsgiving 深访研究，测试四种混合模式（合成受访者/LLM招募/LLM主持/主持+招募），发现 LLM 生成数据在深度(+0.680)与洞察性(+0.498)上显著优于人类，LLM 作分析师主题召回率 77-96%；专家评委无人选择纯人类或纯 LLM 的摘要。定量侧复现冷藏狗粮概念测试(n=605)，零样本 LLM 能抓住答案方向但异质性与内部一致性不足，few-shot 与 RAG 显著改善。附定性/定量两张 LLM 采纳路线图。"
tags:
  - course/supplementary
  - paper/marketing-research
  - ai/llm
  - business/marketing
  - research/methodology
doi: 10.1177/00222429241276529
---


Journal of Marketing 2025, Vol. 89(2) 43-70 © American Marketing Association 2025 Article reuse guidelines: sagepub.com/journals-permissions DOI: 10.1177/00222429241276529 journals.sagepub.com/home/jmx 



Neeraj Arora , Ishita Chakraborty , and Yohei Nishimura 

## Abstract

The authors’ central premise is that a human–LLM (large language model) hybrid approach leads to efficiency and effectiveness gains in the marketing research process. In qualitative research, they show that LLMs can assist in both data generation and analysis; LLMs effectively create sample characteristics, generate synthetic respondents, and conduct and moderate in-depth interviews. The AI–human hybrid generates information-rich, coherent data that surpasses human-only data in depth and insightfulness and matches human performance in data analysis tasks of generating themes and summaries. Evidence from expert judges shows that humans and LLMs possess complementary skills; the human–LLM hybrid outperforms its humanonly or LLM-only counterpart. For quantitative research, the LLM correctly picks the answer direction and valence, with the quality of synthetic data significantly improving through few-shot learning and retrieval-augmented generation. The authors demonstrate the value of the AI–human hybrid by collaborating with a Fortune 500 food company and replicating a 2019 qualitative and quantitative study using GPT-4. For their empirical investigation, the authors design the system architecture and prompts to create personas, ask questions, and obtain responses from synthetic respondents. They provide road maps for integrating LLMs into qualitative and quantitative marketing research and conclude that LLMs serve as valuable collaborators in the insight generation process. 

## Keywords

generative AI, natural language processing, qualitative research, surveys, consumer insights, unstructured data, RAG, in-context learning 

Online supplement: https://doi.org/10.1177/00222429241276529 

Submitted December 30, 2023 

Generative AI (GenAI) and large language models (LLMs) have recently witnessed an explosive growth in their capabilities (Zhao et al. 2023). In marketing, areas projected to see the greatest adoption of GenAI include personalization, marketing research, and content creation (Acar 2023; Moreau, Prandelli, and Schreier 2023; Peres et al. 2023; Ratajczak et al. 2023). GenAI is poised to have a transformative impact on marketing research, an industry worth $84.3 billion in 2023 (Statista 2023); application areas include unstructured and structured data collection, management, analysis, and reporting (Sankaran 2023). As a result ofthe GenAI disruption, marketing research professionals are evaluating a variety of GenAI use cases (Greenbook 2024) and many innovative companies are emerging at the intersection of marketing research and GenAI (Quirks 2024). 

In this article, we systematically investigate stages in the marketing research process in which an LLM could add value. Typical steps in the marketing research process (Churchill and Iacobucci 2006; Kumar et al. 2018; McDaniel and Gates 2018) include problem definition, research design, study design, sample selection, data collection, data analysis, and insights delivery. The three main research design approaches include exploratory, descriptive, and causal. Exploratory research, such as qualitative in-depth interviews, is used in the early stages to gain new insights into a relatively unknown topic. This initial exploration is then supported by descriptive and causal research methods, such as surveys and experiments, to further understand and validate the findings. 


Table 1. Large Language Models in Marketing Research: An Adoption Framework.


<table><tr><td rowspan="2">Research Stages</td><td colspan="3">How LLMs Can Assist</td></tr><tr><td>Exploratory (e.g., Depth Interviews)</td><td>Descriptive (e.g., Surveys)</td><td>Causal (e.g., A/B Tests)</td></tr><tr><td>Study design</td><td>Create/streamline discussion guide</td><td>Create survey questionnaire</td><td>Create concepts and A/B tests</td></tr><tr><td>Sample selection</td><td>Determine sample characteristics</td><td>Determine sample characteristics</td><td>Determine sample characteristics</td></tr><tr><td>Data collection</td><td>Synthetic respondents</td><td>Synthetic respondents</td><td>Synthetic respondents</td></tr><tr><td>Data analysis</td><td>Summarization/theme extraction, visualization</td><td>Statistical analysis and models, visualization</td><td>Statistical analysis and models, visualization</td></tr></table>

Consider a stylized business context in which a brand manager collaborates with a consumer insights manager to formulate the problem the research is trying to address and agree on a set of research questions. The two may collaboratively agree on a research design that, for example, begins with exploratory research (e.g., in-depth interviews) followed by descriptive research (e.g., a survey). These first two steps of the research process are largely led by humans. Although the brand and insights managers could consult an LLM to gather secondary research on the topic and explore use cases that could help inform the research questions or research design, they would still largely rely on their knowledge ofand experience in the business context to formulate the research problem, questions, and design. 

The central premise of this article is that a human–LLM hybrid approach can lead to efficiency and effectiveness gains in the marketing research process. In this approach, an LLM could serve as a useful assistant for the insights manager throughout the remaining stages of the research process, namely, study design, sample selection, data collection, and data analysis. We outline a framework (Table 1) that describes aspects of marketing research where an LLM could play a significant role as an efficient and effective assistant, and we test several of these aspects empirically. 

In the study design stage, an LLM could be used to generate a discussion guide for exploratory research and the first draft of a survey for descriptive research. Likewise, in the sample selection stage, an LLM could help determine the characteristics of respondents who would be good candidates to interview. Finally, LLMs could also be used to generate synthetic respondents for individual in-depth interviews and surveys. At the data analysis stage, an LLM could then be used to summarize text and extract key themes from long, unstructured qualitative interviews. For quantitative surveys, an LLM could be used to report summary statistics, visualize the data, and debug analysis code as needed. 

It is important to note that an LLM can be wrong, be biased, or hallucinate when it was not trained on the relevant data. 

Therefore, the human supervisor is a necessary part of the marketing research knowledge production process. For example, the human can make decisions about when not to ask an LLM for help; this could occur when the information sought is new not only to the company but also to the world. Other examples include marketing research in cultural contexts to understand local customs and traditions, topics with ethical considerations such as targeting vulnerable populations, and obtaining insights from data containing personally identifiable information, where LLMs may lack the necessary safeguards for data security and privacy. 

Existing academic research on the possible value of LLMs for marketing research is nascent and sparse (Brand, Israeli, and Ngwe 2023; P. Li et al. 2024; Qiu, Singh, and Srinivasan 2023). Early evidence suggests that although LLMs offer promise in how they could augment human judgement, they also present shortcomings. Consequently, research is needed to systematically evaluate the performance of LLMs on representative marketing research tasks and begin developing guidelines. Guided by the framework in Table 1, this article aims to fill this gap in a rapidly evolving area that can disrupt marketing research practice. To explore the effective use of LLMs in marketing research, we empirically investigate their role at various stages of the research process. For qualitative and quantitative research, we study the possible role LLMs could play for recruiting respondents, collecting data, and conducting analyses. We generate synthetic respondents and compare their performance and information quality to that of human respondents in both research types. 

We partnered with a Fortune 500 food company and replicated two studies the company had conducted in 2019 using an LLM (GPT-4 [OpenAI et al. 2023]). The first study was qualitative in nature and centered around business questions for the Friendsgiving celebration. The second study focused on testing a new refrigerated dog food concept. For each study we treated the original (human) studies as the “ground truth” and benchmarked the LLM-generated studies against them. This approach enabled us to objectively evaluate the quality of synthetic data and thus answer our research questions pertaining to the role LLMs could play in knowledge generation. 

In Study 1 (Friendsgiving), our findings indicate that LLMs offer significant potential for qualitative research, assisting in both data generation and analysis. On the data generation front, LLMs effectively create desirable sample characteristics, generate synthetic respondents that match those characteristics, and conduct and moderate in-depth interviews. Using objective text-quality metrics from natural language processing and human evaluations from crowd workers, we find that LLM-generated responses were superior in terms of depth and insightfulness, thus offering effectiveness gains. On the analysis front, LLMs perform well as analysts, matching human experts in identifying key ideas, grouping them into themes, and summarizing information. Although LLMs missed some themes that humans detected, they also generated new ones that humans did not. Qualitative evidence from expert judges shows that human–LLM hybrids, with LLMs as data generators or analysts, outperformed their human-only or LLM-only counterparts. 

The findings for the second study (refrigerated pet food) involving quantitative data reveal that the LLM picked the answer direction well: When the average for a variable is toward the lower end of the scale, the synthetic data average tends to be low and vice versa. For the zero-shot learning model, the variance in the synthetic data, or response heterogeneity, was consistently smaller and the correlations between variables in the human data, a measure of reliability, were not recovered well by the LLM. To correct for this limitation, we tested two approaches to incorporate context: few-shot learning (Brown et al. 2020) and retrieval-augmented generation (RAG) (Lewis et al. 2020). The former simply leverages previous answers an LLM gave to generate the next answer, and the latter leverages existing contextual information, namely, the results of a qualitative study the company conducted on the topic of interest. Each approach shows great promise in improving synthetic survey data quality as they help improve the heterogeneity and reliability of LLM answers. 

This article makes several contributions to the growing literature ofhow LLMs can be leveraged in different marketing contexts. First, we focus our attention on AI–human hybrids to understand the role an LLM could play as an efficient and effective collaborator. In our empirical evaluation, we find that LLMs and humans bring unique, complementary insights to the table. Second, a differentiating aspect of our work is that we study both qualitative and quantitative aspects of marketing research. Although existing research investigates how LLMs can contribute in the domain of structured (quantitative) data, we show great promise for LLMs in the unstructured (qualitative) domain. Third, in the structured data domain, we demonstrate the value of incorporating context (few-shot learning and RAG) for generating synthetic respondents. 

The article is organized as follows. First, we provide a brief background on text analysis and the shift toward generalpurpose LLMs. Next, we summarize the current work in marketing and related fields regarding the use of LLMs and highlight how this article differs. Then, we discuss the crucial role of prompt engineering and incorporating context in LLM-based marketing research. In the empirical section, we describe the qualitative and quantitative studies and investigate the role LLMs could play in marketing research. 

Finally, we present our conclusions and outline the limitations of our research. 

## Background

Text analysis techniques have played an important role in marketing research over the last decade because unstructured text data such as social media content, call transcripts, and consumer reviews are present in a variety of business contexts (Berger et al. 2020; Gentzkow, Kelly, and Taddy 2019). Methods have evolved from simple lexicons or word lists (Pennebaker and King 1999) to more scalable machine learning (Tirunillai and Tellis 2014) and deep learning methods (Chakraborty, Kim, and Sudhir 2022; Timoshenko and Hauser 2019; Wang et al. 2022) that use word embeddings. As development of deep learning models often needed a large amount of costly human-labeled training data, there was an increasing need for general-purpose language models that could be useful for a range of natural language processing tasks like translation, question/answering, and summarization. This led to the development of transformer-based language models such as BERT (bidirectional encoder representations from transformers [Devlin et al. 2018]) and GPT (generative pretrained transformer [Radford et al. 2018]). 

## Large Language Models

An LLM is a transformer-based language model with hundreds of billions or more parameters, trained on extensive data (Zhao et al. 2023). By learning from vast amounts of unlabeled data, LLMs gain linguistic knowledge and create contextual language representations. Their training data include sources like Common Crawl and Wikipedia, as seen with the GPT-3 (Brown et al. 2020) and Llama 2 (Touvron et al. 2023) models. 

LLMs have experienced widespread applications in domains such as finance (Li et al. 2023), biomedicine (C. Li et al. 2024), and education (Liu and M’Hiri 2024). Some of these applications involve data generation, while others pertain to tasks that include summarization and analysis. Several early articles noted the superior performance of LLMs as data annotators or labelers in domains such as political messages (Törnberg 2023) and search queries (Thomas et al. 2023). Some articles find that although LLMs outperform expert humans for certain less ambiguous labeling tasks, their performance is subpar for tasks that require superior human judgement (Kocoń et al. 2023; Ziems et al. 2024). 

In areas more similar to marketing, Horton (2023) uses LLMs to mimic human decision-making in behavioral economics experiments involving dictator games and status quo bias and demonstrates that LLMs exhibit behaviors similar to humans. Similarly, Aher, Arriaga, and Kalai (2023) replicate human subject studies in psychology and economics that include ultimatum games and wisdom of crowds. In another article, Argyle et al. (2023) simulate synthetic data for voting patterns with demographic personas to show that LLMs can generate effective proxies for human subpopulations in social science research. Finally, Serapio-García et al. (2023) study how different LLM types can simulate human personality traits (e.g., extraversion, openness, conscientiousness, and neuroticism) by using prompts that mimic persona descriptions. They find that larger, instruction fine-tuned models have better criterion validity than smaller, noninstruction-tuned LLMs. 


Table 2. Marketing Research and Large Language Models: Relevant Empirical Literature.


<table><tr><td>Article</td><td>Topic</td><td>Qualitative</td><td>Quantitative</td><td>Human Benchmark</td><td>Theory Testing</td><td>Incorporate Context</td></tr><tr><td>Brand, Israeli, and Ngwe (2023)<eq>^{b}</eq></td><td>Marketing research</td><td></td><td></td><td></td><td></td><td></td></tr><tr><td>P. Li et al. (2024)<eq>^{ab}</eq></td><td>Perceptual maps</td><td></td><td></td><td></td><td></td><td></td></tr><tr><td>Qiu, Singh, and Srinivasan (2023)<eq>^{b}</eq></td><td>Consumer risk preference</td><td></td><td></td><td></td><td></td><td></td></tr><tr><td>Horton (2023)</td><td>Economics theory testing</td><td></td><td></td><td></td><td></td><td></td></tr><tr><td>Argyle et al. (2023)<eq>^{a}</eq></td><td>Synthetic data for voting</td><td></td><td></td><td></td><td></td><td></td></tr><tr><td>Aher, Arriaga, and Kalai (2023)<eq>^{a}</eq></td><td>Simulate human behavior</td><td></td><td></td><td></td><td></td><td></td></tr><tr><td>This article</td><td>Marketing research</td><td></td><td></td><td></td><td></td><td></td></tr></table>


<sup>a</sup>Published article. 



<sup>b</sup>Marketing article. 


## LLMs and Marketing Research

Existing research on how to use LLMs for marketing research is limited. These articles (Brand, Israeli, and Ngwe 2023; Li, P., et al. 2024; Qiu, Singh, and Srinivasan 2023) suggest that LLMs show promise for marketing research; the results have face validity and nice theoretical properties. Brand, Israeli, and Ngwe (2023) explore how GPT-3.5 responds to commonly used marketing surveys and find that the responses are consistent with economic theory as they exhibit state dependence, downward-sloping demand curves, and reasonable willingness-to-pay estimates. Similarly, Qiu, Singh, and Srinivasan (2023) show that LLM responses align with key economic principles, such as downwardsloping demand curves and risk aversion. They find that these results are directionally accurate and do not precisely reflect consumer behavior as the LLM exhibits behaviors with extreme risk-aversion or loss-aversion parameters. P. Li et al. (2024) show how GPT can be prompted to reproduce perceptual maps from human surveys. For measures based on brand similarity and attribute ratings, they show that the agreement rates between human- and LLM-based perceptual maps exceed 75%. 

Table 2 summarizes research in marketing that relates to this article to suggest how LLMs could be leveraged for marketing research. It also includes empirical articles outside the marketing field that we find most relevant to our research.<sup>1</sup> Based on the articles included in this table, several aspects of our work stand out. First, we focus on AI–human hybrids to explore the role an LLM could play as a collaborator and assistant. We demonstrate that humans and LLMs make unique contributions to the research process. Second, we investigate the role of LLMs in both qualitative and quantitative research. Qualitative research involving unstructured data is crucial in marketing research but has not been studied in the context of LLMs. We empirically examine the role of LLMs in both generating and analyzing unstructured data. Third, in the structured data domain, we demonstrate the value of incorporating context (few-shot learning and RAG) when generating synthetic survey respondents, which is a new contribution to the marketing literature. Based on the evidence from qualitative and quantitative studies, we provide guidelines for practitioners to implement AI–human hybrid marketing research processes. 

## Operationalization of LLMs for Marketing Research

Table 1 describes how LLMs could be useful at different stages of the marketing research process. Irrespective of the actual use case in this table, common approaches to utilize LLMs for marketing research exist. For instance, the most basic way to use an LLM is prompting, or zero-shot usage. A prompt is a set of instructions provided to an LLM that programs and customizes the LLM to generate desired outputs and interactions (White et al. 2023). In a prompt, the LLM is given instructions, input, data, and a desired output format. Zero-shot usage has shortcomings as the LLM is only relying on its original training data and lacks task-specific knowledge. In the following section, we explain some methods used to impart task-specific knowledge to LLMs along with illustrative examples from our setting. 

## Zero-Shot Prediction and Prompts

In zero-shot prediction, an LLM generates output for a specific task without an example, relying solely on its pretrained knowledge. The effectiveness of zero-shot prediction depends on the quality of prompts. Take the example of a marketing research context where we want the LLM to play the role of a synthetic respondent. To do that, the LLM first needs to be given a persona that resembles the intended survey participant. A persona can include demographic details such as age, gender, and location, psychographic variables such as interests and values, and professional background. It serves as a guiding post, and all answers to the subsequent questions are conditioned on this persona. In an LLM, one can provide this persona using what is commonly referred to as a “system role,” which is like an outer loop ofa program, or factors on which to condition the subsequent interactions with the LLM. 

![image](https://cdn-mineru.openxlab.org.cn/result/2026-08-17/3e35c286-06b2-48f5-80b8-198a0d2d79c4/d0fc7b62c927e0b279788b92d32f9993dabfd81866703f0e2874b1ad4fd55eb4.jpg)



Figure 1. Synthetic Data Generation System Architecture by a Large Language Model.


A “user role” defines the precise question being asked of an LLM and the desired answer formats. In marketing research, for example, a user role could involve a question pertaining to attitudes toward refrigerated pet food. The response to this question could be a number between 1 (“strongly agree”) and 5 (“strongly disagree”) for a Likert scale. The LLM replies to the questions asked within the guidelines imposed by the system and user roles. 

Figure 1 is a pictorial representation of how synthetic data generation is implemented using system and user roles. Personas are stored as system roles, and questions are stored as user roles to create prompts and requests sent through the application programming interface (API). The response from the LLM is processed to extract the necessary answers and passed through validation checks. If a check fails, the same question is sent again to the LLM. If it passes the validation check, the necessary aggregation and formatting are performed. The code can also store and share history from the previous question–answer pair when needed; the LLM moderation and few-shot learning we describe in the following section are examples of this feedback mechanism in the data generation process. 

Finally, the heart ofthe data generation system architecture is the OpenAI server, which does the heavy lifting of generating synthetic respondents. The API serves as the interface with code to accept instructions for generating the data. The API asks the LLM (GPT-4 in our case) to answer the questions listed and provide answers based on the given system and user prompts. After all the questions have been answered, the system outputs the data compiled from the LLM’s answers. 

## Incorporating Context: Improving Beyond Zero-Shot Predictions

Although zero-shot prediction is the easiest to implement, its performance on complex tasks that require domain knowledge is limited. We next describe three approaches to inject domain knowledge for an LLM: few-shot learning, RAG, and finetuning. Table 3 summarizes each and includes an example. 

Few-shot learning. In-context learning improves a model’s ability to understand and perform tasks based on the context provided within the input, without needing additional training. The simplest way to incorporate domain-specific knowledge is few-shot learning (Brown et al. 2020). This involves giving the LLM a few examples to enable it to understand the task better. Few-shot learning entails a low cost and is easy to implement. The number of examples is limited by the maximum number of tokens the LLM can process in context. 

Retrieval-augmented generation (RAG). RAG (Gao et al. 2023; Lewis et al. 2020) is used to improve the output quality of an LLM by incorporating information from an external knowledge source. In Figure 2, the components of RAG are a retrieval module and a generation module. The retrieval module fetches snippets of information from the external knowledge base. This provides critical contextual information for the 


Table 3. Incorporating Context in LLMs: Few-Shot Learning, RAG, and Fine-Tuning.


<table><tr><td>Methods</td><td>Description</td><td>Example</td></tr><tr><td>Zero-shot</td><td>No gradient/model parameter updates are performed.</td><td>In generating response for a marketing research survey, the prompts create personas and ask questions.</td></tr><tr><td>Few-shot</td><td>One or more examples are provided within the prompt to help the model understand the task.No gradient/model parameter updates are performed.</td><td>Before generating response for a marketing research survey, multiple question-answer pairs for survey questions are shown to the LLM as examples.</td></tr><tr><td>RAG</td><td>An external data source that the LLM can leverage for additional contextual information is created.Based on each prompt, relevant documents in the knowledgebase are identified and retrieved.No gradient/model parameter updates are performed.</td><td>To generate response for a marketing research survey, existing qualitative studies serve as the external knowledge base for contextual information.Relevant information of qualitative research is appended to the prompt and passed to the LLM.</td></tr><tr><td>Fine-tuning</td><td>The model is trained via repeated gradient/model parameter updates using task-specific data.</td><td>Before generating response for a marketing research survey for refrigerated dog food, the LLM is fine-tuned using past surveys conducted in related categories.</td></tr></table>

![image](https://cdn-mineru.openxlab.org.cn/result/2026-08-17/3e35c286-06b2-48f5-80b8-198a0d2d79c4/0eac3e1807be00a01c970105f2de24a5f944069a4e77201720347b724dae0592.jpg)



Figure 2. Retrieval-Augmented Generation (RAG).


LLM to generate a meaningful answer. The generation module relies on the original prompt and the retrieved snippets to generate the answer. The retrieved documents and the original prompt are then input into the LLM, generating a contextually appropriate response. 

RAG augments the capabilities of LLMs to generate answers pertaining to a unique context without retraining the model; it offers creative ways to utilize a company’s existing knowledge base. Its benefits include cost-effective implementation, the ability to incorporate new information at any time (e.g., new marketing research), and reducing the LLM’s propensity to generate false information when not trained on the specific context. 

From the standpoint of implementation, the fundamental elements of RAG are a (1) vectorized database and (2) retrieval system. All necessary information from an input source is transformed into the embedding format (i.e., a vector) while preserving the semantics contained in the document. Then, the retrieval system is implemented to find the most relevant information in the vectorized database to the given prompt. Researchers can develop RAG by using existing open-source AI application databases, such as Chroma (https://www.trychroma.com/) or 

Pinecone (https://www.pinecone.io/), or building the entire system from the ground up. 

RAG can be particularly useful in marketing, where managers rely on multiple external information sources for decision-making. Factors such as information source relevancy, reliability, and recency can help determine the appropriate information source for a given marketing research use case. For example, existing qualitative data from an external data source could be used to generate new qualitative or quantitative data; existing literature on a topic, web pages, or blog posts are other examples of external data sources that may be useful. 

Fine-tuning. Fine-tuning is a technique where a pretrained model is further trained, typically on a smaller dataset, to adapt to a specific task. Fine-tuning an LLM is a common procedure employed to specialize a pretrained model and, unlike few-shot learning, it adjusts the model’s internal parameters to better capture the intricacies of the new data (Howard and Ruder 2018). Through fine-tuning, researchers can harness the knowledge embedded within LLMs and adapt it to specific applications, obviating the need for training large models from the ground up (Sun et al. 2017). Fine-tuning LLMs could enhance their alignment with the field of marketing research by adapting them to specific tasks and domains. For instance, customizing an LLM with private, industry-specific data enables a company to generate insights that are tailored to that industry. Similarly, fine-tuning an LLM to create marketing content, such as ad copy, that aligns with a brand’s tone, style, and messaging ensures that the generated content is consistent and relevant. 


Table 4. Glossary of Terms (Alphabetical Order).


<table><tr><td>Term</td><td>Definition</td></tr><tr><td>Application programming interface (API)</td><td>A set of rules and protocols that enables different software applications to communicate with each other.</td></tr><tr><td>Embedding</td><td>A dense vector representation of a data instance (e.g., a word, sentence, or image) in a lower-dimensional continuous vector space.</td></tr><tr><td>Few-shot learning</td><td>The ability of a machine learning model to predict on data instances after being trained on a few examples.</td></tr><tr><td>Fine-tuning</td><td>The process of taking a pretrained machine learning model (typically an LLM or computer vision model) and further training it on a specific task or domain-specific dataset.</td></tr><tr><td>In-context learning</td><td>In-context learning enables language models to learn tasks given only a few examples in the form of demonstration.</td></tr><tr><td>Persona</td><td>A set of traits, background information, and characteristics assigned to a language model.</td></tr><tr><td>Prompt</td><td>The initial input text or instructions given to the model to specify the task or guide its output.</td></tr><tr><td>RAG</td><td>An architecture that combines a pretrained language model with a retrieval system to enable the model to utilize external knowledge sources during text generation tasks.</td></tr><tr><td>Reinforcement learning</td><td>A type of machine learning where an agent learns to make decisions by performing actions in an environment to maximize cumulative rewards balancing exploitation and exploration.</td></tr><tr><td>System role</td><td>Refers to the predefined persona, background, or set of traits assigned to a language model.</td></tr><tr><td>Transformer</td><td>A type of neural network architecture that uses an attention mechanism to effectively capture long-range dependencies in sequence data like text or audio.</td></tr><tr><td>User role</td><td>Refers to the question-and-answer formats given to a language model.</td></tr><tr><td>Zero-shot prediction</td><td>The ability of a machine learning model to make predictions on data instances that belong to classes that were not seen during training.</td></tr></table>

Although we do not focus on fine-tuning in this article, it offers promise for marketing research. At the same time, the possible gains from fine-tuning need to be balanced against an increased risk of hallucinations because LLMs often struggle to incorporate new information, especially outside the scope of their training data (Gekhman et al. 2024). We summarize a brief description of the key technical terms used in this section in Table 4. 

## Empirical Evidence: An LLM and Marketing Research

We note previously that LLMs can be incorporated at various stages ofthe marketing research process (Table 1). The research problem stems from a firm’s unique business needs and is best formulated by domain experts. The next stages consist of coming up with a research design that could involve qualitative or quantitative research. There is an opportunity to leverage LLMs for each element of the research design. In this section, we investigate the potential value of an LLM for exploratory (qualitative; Study 1) and descriptive (quantitative; Study 2) research empirically. 

## Qualitative Research: Study 1

Qualitative research is conducted for a wide variety of research questions, including needs assessment, new product design, and ad testing. It also spans a wide variety of methods, such as in-depth interviews, focus groups, ethnographies, and observational research. For the purpose ofthis article, we will center our attention on in-depth interviews, a popular method for exploratory research. 

## In-Depth Interviews: Some Background

If in-depth interviews are selected for exploratory research, the next steps involve creating a discussion guide and selecting a sample. The guide aims to elicit detailed and personalized responses, and the sample is chosen for its potential to provide relevant insights. The interviews are usually unstructured, with a moderator asking various questions and probing to ensure detailed, focused, and relevant answers. The collected data, often in unstructured text or audiovisual form, is then analyzed by experts. 

Guided by Table 1, an LLM can assist at various stages of exploratory research, particularly in-depth interviews. For instance, in the data collection stage, strategies might involve using human participants or supplementing/replacing them with synthetic counterparts. An LLM can also assist in moderating the interviews. Finally, the LLM can analyze the data in collaboration with a human. We aim to test whether an LLM can match human performance in these stages. The primary objective of Study 1 is to determine how well the AI–human hybrid matches a purely human process on (a) data generation and (b) data analysis. 


Table 5. In-Depth Interviews: LLM–Human Hybrids.


<table><tr><td rowspan="2"></td><td colspan="4">Task Responsibility</td></tr><tr><td>Discussion Guide</td><td>Sample Selection</td><td>Respondents</td><td>Moderation</td></tr><tr><td>All human</td><td>Human</td><td>Human</td><td>Human</td><td>Human</td></tr><tr><td>LLM hybrid 1 (synthetic respondent condition)</td><td>Human</td><td>Human</td><td>LLM</td><td>Human</td></tr><tr><td>LLM hybrid 2 (recruitment condition)</td><td>Human</td><td>LLM</td><td>LLM</td><td>Human</td></tr><tr><td>LLM hybrid 3 (moderation condition)</td><td>Human</td><td>Human</td><td>LLM</td><td>LLM</td></tr><tr><td>LLM hybrid 4 (moderation and recruitment condition)</td><td>Human</td><td>LLM</td><td>LLM</td><td>LLM</td></tr></table>

## Evaluating the LLM Performance

For the two dimensions of data generation and analysis, we need to first establish criteria by which we can assess the performance of an LLM. There are several ways to evaluate LLMs, and they differ across domains, as noted by a recent survey on this topic (Chang et al. 2024). A common evaluation approach across disciplines is the Turing test (Moor 2003), which assesses how closely an AI matches human performance in a given task. The role ofthe human benchmark is crucial to the evaluations we report. For exploratory marketing research, one of the key goals is to uncover novel, interesting, and actionable insights that are relevant to a firm’s research question (Swedberg 2020). To accomplish this, the data must be high quality, information rich, detail oriented, and comprehensible to analysts (Wongsuphasawat, Liu, and Heer 2019). Importantly, the impact on end users (e.g., insights managers) is crucial, and we need domain experts to evaluate these high-level outcomes (Serapio-García et al. 2023). 

Guided by the principles described previously, we adopt the four criteria to evaluate LLMs for exploratory research, which we will utilize in the subsequent analyses: 

1. Data quality: Comparison of LLM- versus humangenerated data using well-established metrics such as readability and information quality. 

2. Similarity to human data: Comparison of LLM- versus human-generated data in an embedding space. 

3. Research objectives: Evaluation of LLM- versus human-generated data in terms of well-established metrics such as clarity, relevance, depth, and insightfulness by human evaluators. 

4. Research outcomes: Evaluation of LLM- versus humangenerated themes/summaries by domain experts in qualitative research. 

## Study 1 Description

We partnered with a Fortune 500 food manufacturing company and its research supplier C+R Research (Chicago) that routinely engages in exploratory, descriptive, and causal marketing research. For our exploratory research, we picked a representative research project where the context was to “help position the firm as a thought leader to retailers by elaborating on and bringing to life emotions, experiences, and traditions around Friendsgiving.” Friendsgiving, a modern counterpart to the more traditional Thanksgiving, is typically celebrated in the company of chosen family or friends instead of family. At the time of the study, Friendsgiving was a somewhat new concept that had become especially popular, and our partner company did not have a good understanding of consumers’ perceptions, thoughts, emotions, and rituals associated with this modern version of Thanksgiving. 

The company wanted to use Friendsgiving as an opportunity to attract younger consumers to its brands and seed year-round sales of its products. The qualitative research was done virtually in 2019 (before LLMs became mainstream) and was meant to provide inspiration for the company’s 2020 Friendsgiving campaigns. The original research was conducted over five days. For this study, we only focus on day 1 because the remaining days involved journaling about the actual event and uploading pictures and videos, which are beyond the scope of this study. 

## Qualitative Data Generation: Description of Models Used

In Study 1, our first objective is to assess how well the data generated by an AI–human hybrid matches the human-only data. Our approach involves testing different LLM-hybrid models in which one or more aspects of the qualitative research process are assigned to an LLM (see Table 5). Next, we detail the data generation process for each model. 

LLM hybrid 1. In this condition, we mimic the human study by using the original discussion guide, profile of the respondents, and probes (moderation). The only difference is that instead of humans participating in the interview, we generate synthetic respondents who closely mirror the profiles of those who originally participated in the interview. To accomplish this, we obtain a detailed profile of the original respondents of the study from our research partner, including the respondents gender, age, ethnicity, and other research-specific conditions such as their role (host or attendee) in a Friendsgiving party. Then, we generate prompts for the LLM as described in 


Table 6. Prompt Structure (LLM Hybrid 1).


<table><tr><td>Type</td><td>Prompt</td></tr><tr><td>Context</td><td>You are a respondent in an in-depth interview. Today is November 21, 2019. I am Ally. I will be guiding you through an online discussion. You have been selected with a handful of others across the country to share your thoughts and opinions in this research discussion, and I look forward to hearing what you have to say!</td></tr><tr><td>System</td><td>You have been chosen to be a part of this discussion because you previously mentioned you will either be hosting or attending a Friendsgiving this year! Your name is Scott. You are a 32-year-old Caucasian Male. You are a Host of the Friendsgiving party.</td></tr><tr><td>User</td><td>For the remainder of this discussion, we are going to be talking about Friendsgiving. I would love to understand your opinions and thoughts on this! Answer all the questions using as much detail as possible. There are no wrong answers!</td></tr></table>


Table 7. Prompt Structure (LLM Hybrid 2).


<table><tr><td>Type</td><td>Prompt</td></tr><tr><td>Sample identification</td><td>Friendsgiving is a new variation of Thanksgiving. We want to understand people&#x27;s attitudes toward it, how they celebrate it, and what thoughts and emotions connect to it. What would be a good representative sample of people to talk to?</td></tr><tr><td>Persona construction</td><td>Now generate personas of people who have the characteristics enumerated above. Not every persona needs to have every characteristic. The personas should be sufficiently unique.</td></tr></table>

Table 6. The prompt includes three components. First, we give some context to the LLM (e.g., this is an in-depth interview). Next, we offer a system role that gives the variables on which all subsequent answers need to be conditioned (e.g., demographics and host or attendee at the Friendsgiving event). Finally, the user role elaborates on the exact task and format of the expected output (e.g., the answers can be open-ended and detailed). 

LLM hybrid 2 (recruitment condition). Instead of replicating the respondent profiles in the original study, we ask the LLM to suggest a group of respondents to generate ideas for this qualitative research and then further ask the LLM to generate synthetic personas to match those suggestions. Table 7 presents details of the sample identification and persona construction prompts. In response to the first prompt, the LLM produced a rich description of potential respondents. Although the original study had good variation in terms of respondent demographics (gender, age, ethnicity), it still missed some key dimensions such as people with dietary restrictions, expatriates and international students, individuals from underrepresented groups (e.g., LGBTQ+), and chefs who have started developing Friendsgiving menus. Importantly, these are the segments of the market that may have had a difficult time fitting in with traditional Thanksgiving celebrations and would think of Friendsgiving as a more inclusive, modern tradition. We then ask the LLM to generate unique profiles of respondents that meet these criteria. In response to this prompt, the LLM generated 10 unique personas, and we replicate the in-depth interview using these generated personas (for a full list of personas generated using the sample identification and persona construction prompts, see Table W1 in Web Appendix A). 

LLM hybrid 3 (moderation condition). This is a more complex hybrid scenario in which the LLM is not only acting as a synthetic respondent but also moderating the in-depth interview by providing appropriate probes. In LLM hybrid 3, we use the respondent profile from the original study. For the LLM moderator to resemble a human moderator, we develop a probing strategy that involves (1) real-time scoring of every question–answer turn, (2) a comprehensive threshold score, and (3) relevant probes. The score has four dimensions: clarity, relevance, depth, and insightfulness. Using these scoring dimensions, every question–answer turn is given a score. We average these scores to create a quality index for the answer, ranging 0–100; when the score falls below a threshold of80, the LLM provides an appropriate probe. Table 8 illustrates how we implement the LLM’s moderation process. 

LLM hybrid 4 (moderation and recruitment condition). This condition is a mix of two previous LLM conditions. The LLM is asked to (1) generate synthetic profiles (as in LLM hybrid 2) and (2) moderate the depth interview (as in LLM hybrid 3). 

## Evaluation of Data Generation

For the data generated for the four LLM–human hybrids described in Table 5, we next report our findings for the evaluation criteria described previously. We first evaluate the performance of the various LLM-hybrid models compared with the humans on the first two criteria (data quality and similarity to human data). We then evaluate LLM-generated data according to research objectives in a human evaluation study on Prolific. 

Data quality. We look at readability metrics including SMOG (McLaughlin 1969), Gunning fog (Gunning 1969), and Flesch–Kincaid (Kincaid et al. 1975). Our findings indicate that the LLM-generated data have a lower reading ease than human data (see Figure W1 in Web Appendix A).<sup>2</sup> The differences in means are statistically significant (p < .05). Next, we look at information density and coherence. Information density is a measure of unique information in the dataset; after data preprocessing, it counts the number of unique tokens (words and phrases) normalized by the number of documents. Coherence is a measure of whether a topic model such as latent Dirichlet allocation (Blei, Ng, and Jordan 2003) can extract interpretable themes from a corpus which in turn shows if the data generated have a logical flow of ideas. We find that LLM hybrid 3 (synthetic respondents with moderation condition) has the highest information density and coherence among the hybrid models (for details, see Table W2 in Web Appendix A). 


Table 8. An Example of How We Implement Moderation.


<table><tr><td>Flow</td><td>Prompts/Generated Texts/Scores</td></tr><tr><td>Question</td><td>What do you like about celebrating Friendsgiving? What are you looking forward to most about this year&#x27;s Friendsgiving?</td></tr><tr><td>LLM answer</td><td>I love the sense of community and camaraderie that Friendsgiving brings. It&#x27;s a time to relax, laugh, and enjoy each other&#x27;s company. What I&#x27;m looking forward to most this year is seeing everyone and sharing our multicultural feast. I can&#x27;t wait to hear everyone&#x27;s gratitude shares and see who wins our game tournament!</td></tr><tr><td>LLM score</td><td>Relevancy: 70, depth: 60, clarity: 90, insightful: 65, overall (average): 71.25 &lt; threshold</td></tr><tr><td>LLM probe</td><td>Can you elaborate on the multicultural feast and the game tournament? How do these elements contribute to the overall Friendsgiving experience?</td></tr><tr><td>LLM additional answer</td><td>The multicultural feast is a reflection of the diversity within our friend group. Everyone gets to share a piece of their heritage through food, which sparks conversations and brings us closer. It&#x27;s not just about eating, but learning and appreciating our different backgrounds. The game tournament, on the other hand, adds a level of friendly competition and fun. It&#x27;s a break from the seriousness of everyday life and allows us to bond over shared enjoyment. Both elements, the feast and the games, create a warm, inclusive atmosphere and contribute to the overall sense of camaraderie and unity that defines our Friendsgiving.</td></tr><tr><td>LLM score</td><td>Relevancy: 90, depth: 70, clarity: 95, insightful: 80, overall (average): 83.75 &gt;= threshold(Goes to the next question)</td></tr></table>

Similarity to human-generated data. Next, we assess how closely the LLM hybrid–generated data match the humangenerated data. To do this, we transform the responses generated from the human process and each of the LLM-hybrid processes into a multidimensional embedding vector using BERT sentence embeddings (Reimers and Gurevych 2019). An embedding captures the essence or meaning of the text in a holistic way. By calculating the distance between two embeddings, we can quantitatively determine the similarity between the text pieces. Although these original embeddings have 768 dimensions, we can use dimension reduction techniques like UMAP (McInnes, Healy, and Melville 2018) to further reduce the dimensionality of this space and create perceptual maps that enable visual comparison. By comparing the human and LLM data, we learn that the LLM hybrid 3 generates data that are semantically closest to the data generated by human respondents (see Figures W2 and W3 in Web Appendix A). Interestingly, we also discover that some ideas are unique to the LLM hybrid–generated data, whereas others are exclusive to humans. This finding underscores the benefits of integrating human and LLM intelligence for generating exploratory research data as the two complement each other. 

Research objectives. Based on the analyses so far, we found that the LLM hybrid 3 is the best-performing LLM hybrid in terms of data quality and similarity metrics. We next aim to assess how this best-performing hybrid does on our third evaluation criterion: Whether the data generated by this LLM meets objectives of exploratory research. As discussed, the data must be clear, detailed, relevant to the research, and insightful to be useful for analysis and to potentially uncover new and exciting insights. Therefore, we ask crowd workers from Prolific to compare the data from LLM hybrid 3 with humangenerated data on these metrics. 

For this Prolific study (approved by our university’s institutional review board), we recruited 250 participants on Prolific in November 2024 using these screening criteria: Respondents are located in the United States, are over 18 years of age, and have a high school diploma or higher education. We further mandated a balanced sample in terms of gender representation and for respondents to have a minimum approval rate of 90% on the platform. Table W3 and Figure W4 in Web Appendix A present the sample demographics of survey participants and the survey instrument, respectively. 

Table 9 shows the subset of questions chosen for this Prolific study. Every survey respondent was asked to evaluate four different question–answer pairs (two LLM responses and two human responses) resulting in 1,000 evaluations. They evaluated the answers on the following dimensions: clarity (clear, understandable, and no ambiguity), relevance (to the research question), depth (how detail oriented the responses are), and insightfulness (having a fresh perspective or a novel suggestion). The evaluation used a five-point rating scale.<sup>3</sup> 


Table 9. Prolific Study: Discussion Guide Questions.


<table><tr><td>Question</td><td>Question</td><td>Type</td></tr><tr><td>3</td><td>What do you like about celebrating Friendsgiving? What are you looking forward to most about this year&#x27;s Friendsgiving? Alternatively, what do you dislike about celebrating Friendsgiving? What, if anything, are you not looking forward to about Friendsgiving?</td><td>All respondents</td></tr><tr><td>13</td><td>Now, I would like you to tell us about the menu at Friendsgiving—including both foods and beverages. If you planned the menu, please tell us what considerations went into deciding what would be served. What are you making/bringing? What are others making/bringing? How did you decide what you will be making/bringing?</td><td>All respondents</td></tr><tr><td>14</td><td>What, if any, resources did you or will you use when planning your meal (Facebook, Pinterest, etc.)? What make those great resources?</td><td>All respondents</td></tr><tr><td>6</td><td>I would like for you to walk me through the planning and preparation process. What have you been doing/still need to do to get ready for your party? Consider the following: Who is invited? How did you send the invitations? The house: Cleaning, decorating, setting up, etc. Food and beverages Anything else?</td><td>Host</td></tr><tr><td>10</td><td>What are you bringing to the upcoming Friendsgiving that you will be attending? How did you decide what to bring? What, if any, resources helped you with this? Where is Friendsgiving going to be?</td><td>Attendee</td></tr></table>


Table 10. Mixed-Effects Model of Evaluations for LLM- Versus Human-Generated Answers.


<table><tr><td rowspan="2"></td><td colspan="4">Dependent Variable: Scoring Dimensions</td></tr><tr><td>Score (Clarity)(1)</td><td>Score (Relevance)(2)</td><td>Score (Depth)(3)</td><td>Score (Insightfulness)(4)</td></tr><tr><td>Intercept</td><td>3.818***(.08)</td><td>3.436***(.09)</td><td>3.001***(.07)</td><td>2.929***(.10)</td></tr><tr><td>LLM generated</td><td>.137(.103)</td><td>-.085(.114)</td><td>.680***(.108)</td><td>.498***(.112)</td></tr><tr><td>Answer length</td><td>-.0001(.072)</td><td>.0007(.004)</td><td>.001*(.004)</td><td>.007*(.004)</td></tr><tr><td>N</td><td>992</td><td>992</td><td>992</td><td>992</td></tr><tr><td>Number of evaluators</td><td>248</td><td>248</td><td>248</td><td>248</td></tr><tr><td>Number of blocks</td><td>5</td><td>5</td><td>5</td><td>5</td></tr><tr><td>Evaluator demographics</td><td>Yes</td><td>Yes</td><td>Yes</td><td>Yes</td></tr><tr><td>Log likelihood</td><td>3,044.4</td><td>3,251.8</td><td>3,113.9</td><td>3,179</td></tr></table>


*p < .1, **p < .05, ***p < .01. 



Notes: The four columns show the four dependent variables of interest (human evaluation on clarity, relevance, depth, and insightfulness). The key independent variable is LLM generated, (i.e., whether the answer is generated by an LLM or human). The answer length control ensures these effects are not driven simply by LLM’s verbosity. Evaluator demographic controls include gender, age group, and education level. Standard errors are reported in parentheses. 


Table 10 summarizes the findings from the Prolific study. The survey is analyzed at the evaluator–answer unit. Our main dependent variables of interest are the four scoring dimensions: clarity, relevance, depth, and insightfulness. The primary independent variable of interest is the dummy variable LLM generated, which is 1 when the answer is generated by an LLM and 0 otherwise. We control for answer length and evaluator demographics (age, gender, and education level). In the survey, not every respondent is assigned the same question; 

therefore, we use a nested mixed-effects model or a hierarchical linear model (Gelman and Hill 2006; Kashy, Campbell, and Harris 2006). To account for the variability due to different questions, we use question numbers as random effects. Table 10 shows the results of the mixed-effects model. 

We find no impact of source of data generation (LLM or human) on the dimensions of clarity and relevance. However, an LLM-generated answer is associated with an increase of .680 in depth scores and .498 in insightfulness scores (p < .05). After controlling for answer length and evaluator demographics, LLM-generated answers are considered more detailed and insightful by human evaluators. 

To summarize our results for Study 1 on the three evaluation criteria of data quality, similarity to human data, and meeting research objectives, the LLM hybrids generate high-quality, information-rich data, albeit, with somewhat lower readability. The quality ofLLM-generated responses can be further enhanced through self-moderation by the LLM. Although semantically similar, there are unique elements in both LLM- and humangenerated data. The LLM hybrid also meets the objectives of the research by generating responses that are superior in terms of depth and insightfulness. In addition, LLMs have proved useful in identifying certain niche participants who are typically overlooked in human-driven recruitment processes, such as vegans or restaurant chefs with unique Friendsgiving offerings. 

![image](https://cdn-mineru.openxlab.org.cn/result/2026-08-17/3e35c286-06b2-48f5-80b8-198a0d2d79c4/5e2b3ab2a1d636c7d0f613c047dbc8613e50e08632d7c2905bca8f4821b69382.jpg)



Figure 3. Large Language Models as Analysts: Expert Assessment.


## Qualitative Data Analysis: Human–LLM Hybrids

Our reporting so far has focused on the performance of AI– human hybrids for data generation. Our second objective for Study 1 is to determine how well the AI–human hybrid matches a purely human process on data analysis. To compare the final outcomes of data generated by humans and the LLM hybrid, the data must be analyzed. Traditionally, this data analysis is performed by expert qualitative analysts. However, qualitative research often produces large amounts of unstructured text and audiovisual data, which could benefit from the assistance of an LLM (Jalali and Akhavan 2024). In the following, we aim to investigate two aspects of data analysis: (1) to evaluate the LLM’s performance as an analyst and (2) to determine whether the human–LLM hybrid approach adds value over a human-only or LLM-only approach. 

To conduct this comparison, we require human analysts and an LLM to undertake a qualitative data analysis task. This task involves thematic concept analysis, which includes reading the text, excluding fillers, highlighting key phrases or sentences, clustering these into related concepts or themes, iterating to remove repetitive ideas, and consolidating the themes into a concise summary (Burnard 1991; Castleberry and Nolen 2018; Gioia, Corley, and Hamilton 2013). In our experiment, human analysts and the LLM will perform this thematic analysis on the generated data. Additionally, a separate group of qualitative experts (referred to as judges) will compare the analyses conducted by humans and the LLM. Given the skill required for this task, we collaborate with expert qualitative researchers from our partner. Each analyst has a minimum of five years of experience, while each judge has over ten years in qualitative research. Next, we describe the findings from the expert assessment. The sample size for this assessment is small, our findings being largely qualitative. 

Figure 3 is a pictorial representation of how the expert assessment was operationalized. As seen in the figure, we rely on responses to questions from an in-depth interview from humans and LLMs. We use the same five questions from the Friendsgiving context as in the Prolific study (Table 9). In total, there are ten question–answer pairs for these five questions: five are original human responses (human-generated data) from interview participants, and five are responses from the LLM (LLM-generated data). We used the best-performing LLM hybrid 3 from the previous section for this purpose. On average, a human analyst requires 40–45 minutes to review one question and its corresponding answers from 23 respondents. Therefore, we recruited ten human analysts and assigned each to one question. The analysts’ tasks included identifying key sentences and phrases from the 23 respondents, clustering them into themes, and writing a brief one-paragraph summary. The same task is subsequently assigned to the LLM in the form of prompts as shown in Table 11. 

We generated four summaries (and themes) for each question based on the data source (human or LLM) and who conducted the analysis (human or LLM). That is, the summary for each question fell into one of the following four bins: human generated–human analyzed, human generated–LLM analyzed, LLM generated–human analyzed, or LLM generated–LLM analyzed. As we had 5 questions, this resulted in a total of 20 (5 × 4) summaries. 


Table 11. Large Language Models as Analyst: Prompt Structure.


<table><tr><td>Type</td><td>Prompt Structure</td></tr><tr><td>System</td><td>Imagine you are an experienced qualitative research analyst.</td></tr><tr><td>User</td><td>You are provided with a question and corresponding participant responses from an in-depth interview. Read the response carefully and perform the following tasks:1. Highlight the most informative sentences from the respondent answers2. Cluster the most informative sentences in task I into high-level themes3. Write a short paragraph summarizing the key insights from the respondent answer</td></tr></table>

For each question, the second stage of the assessment involves a comparative evaluation of the four bins of themes/summaries by expert human judges. We assign each judge one question and ask them to read the question along with the four corresponding themes/summaries. We pose an open-ended question to the judges: Which is the best summary and why? 

## Evaluation of Data Analysis

We first report findings pertaining to the role of an LLM as an analyst. We then report how the human–LLM hybrid gets judged relative to a human-only or LLM-only approach. For the first goal (an LLM as an analyst) we examine the similarity between LLM processes and human processes at different stages of the data analysis. Both human and LLM analyses are conceptualized to involve three stages: (1) identifying key sentences, (2) clustering them into themes, and (3) summarizing. 

We start by assessing the degree of overlap in key sentences and phrases between the human and LLM processes and then comparing the themes and summaries. For each question– answer pair, we convert every highlighted sentence (by humans and LLMs) into an embedding or vector representation (Radford et al. 2018). We then measure the distance (cosine similarity) between the human- and LLM-highlighted sentences.<sup>4</sup> We find that humans tend to highlight more sentences than LLMs (human average = 35, LLM average = 19). Humans highlight sentences even when they are semantically similar to other answers, and the LLM automatically selects sentences that are sufficiently distinct. Despite differences in the number of sentences highlighted, the average cosine similarity between sentences highlighted by humans and the LLM is high (.78). This shows that for the identification of key sentences, there is significant overlap in the sentences that humans and the LLM “think” are important. 

Next, we assess the extent of overlap in higher-order tasks via theme detection and summarization. For theme detection, there are two ways to measure the extent of similarity: manually comparing the themes or measuring their cosine similarity. Table 12 shows the results from the manual matching process by using the human generated–human analyzed condition (allhuman condition) as the baseline. The “Proportion of Theme Recovery” columns indicate the percentage of overall themes from the all-human process recovered in each of the three LLM-based processes. The “Proportion of New Themes” columns indicate the percentage of new themes that are revealed in each of the three LLM-based processes compared with the all-human process. For example, in the human generated–LLM analyzed condition, there is an average of 96% theme recovery and 23% of new themes identified. Likewise, the LLM generated–human analyzed and LLM generated–LLM analyzed processes have 86% and 77% theme recovery, respectively, and 14% new themes identified on average.<sup>5</sup> 

Based on this evidence, we conclude that the LLM-hybrid processes result in similar themes when compared with an allhuman generation/analysis process. Moreover, at times an LLM analyst can discover new themes that might be overlooked by the human analyst. 

We next look at the final stage of analysis: A comparison of summaries across the four previously identified bins. To evaluate the summaries holistically, we seek the help of our expert judges who indicate which summary is the best and why. Table 13 summarizes the judges’ comments on how they select the best summary. The main takeaways are that none of the judges selected a human-only or LLM-only summary as the best. Three out of five judges selected the human generated–LLM analyzed summaries and the remaining two selected the LLM generated–human analyzed summaries. The three judges who liked the human generated–LLM analyzed summaries the most indicated that there were some good examples, which had the right amount of detail and storytelling. The remaining two judges who liked the LLM generated–human analyzed summaries the most noted that the summaries were thorough and interesting to read and had both a functional and emotional lens. 

Our qualitative results from assessment involving experts highlight three main findings. First, we find that LLMs perform as well as analysts: LLMs are comparable to humans in identifying key ideas, grouping them into themes, and summarizing them. Second, LLMs sometimes generate new themes from qualitative data that humans do not. Finally, human–LLM hybrids appear to outperform humanonly or LLM-only alternatives. The last finding reiterates what we noted earlier, namely, that the future of qualitative marketing research likely involves a collaboration between LLMs and humans, with each contributing unique strengths to the knowledge creation process. Although the final insights from any marketing research will primarily remain the forte of humans, the AI–human hybrid can deliver significant efficiency and effectiveness gains in the marketing research process. 


Table 12. Overlapping Themes: Human Versus LLM Hybrids.


<table><tr><td rowspan="2">Generated-Analyzed</td><td colspan="3">Proportion of Theme Recovery</td><td colspan="3">Proportion of New Themes</td></tr><tr><td>Human-LLM</td><td>LLM-Human</td><td>LLM-LLM</td><td>Human-LLM</td><td>LLM-Human</td><td>LLM-LLM</td></tr><tr><td>Question 1</td><td>100%</td><td>100%</td><td>75%</td><td>25%</td><td>25%</td><td>25%</td></tr><tr><td>Question 2</td><td>100%</td><td>75%</td><td>100%</td><td>25%</td><td>0</td><td>0</td></tr><tr><td>Question 3</td><td>100%</td><td>100%</td><td>75%</td><td>0</td><td>25%</td><td>25%</td></tr><tr><td>Question 4</td><td>100%</td><td>75%</td><td>75%</td><td>40%</td><td>20%</td><td>20%</td></tr><tr><td>Question 5</td><td>80%</td><td>80%</td><td>60%</td><td>25%</td><td>0</td><td>0</td></tr><tr><td>Mean</td><td>96%</td><td>86%</td><td>77%</td><td>23%</td><td>14%</td><td>14%</td></tr></table>


# of common themes in the LLM–hybrid process # of common themes in the LLM–hybrid process Notes: Themes recovered Notes: Themes recovered = 



# of themes in the human generated–human analyzed condition 



# of unique themes not in the all human condition New themes = 



= <sub># of themes in the human generated–human analyzed condition</sub> 



Table 13. Expert Comments.


<table><tr><td>Question</td><td>Comments</td></tr><tr><td>1</td><td>I think Response #3 (LLM–Human) is best because of the thoroughness of their response. I like that they included the specific wording “Chosen Family” and went into detail about the new traditions that started from Friendsgiving (gratitude circles, recipe swaps, etc.). I like that they separated the positive and negative aspects of Friendsgiving in both the Summary and the Themes section.</td></tr><tr><td>2</td><td>The best summary is Response #2 (Human–LLM) because the examples provided helped to aid understanding by the reader by bringing the decision-making tools and example dishes to life.</td></tr><tr><td>3</td><td>The best summary is Response #2 (Human–LLM) is best because ... To me, it represents a better “summary” by providing a larger context for the evaluation. Furthermore, the headline followed by a single bullet strikes a nice balance between concise and adequate detail.</td></tr><tr><td>4</td><td>The best summary is Response #2 (Human–LLM) because it felt most conversational and struck the best balance between detail-orientation and storytelling.</td></tr><tr><td>5</td><td>The best summary is Response #4 (LLM–Human) because ... This response was most thorough and interesting to read. It tackled the topic from both a functional and emotional lens; it included some high level insights, but also some details that were unexpected/new.</td></tr></table>

## LLM Road Map for Qualitative Research

Drawing from the insights of Study 1 and the broader context of qualitative research in marketing, we conclude with a road map (see Figure 4) illustrating how marketing researchers can leverage an LLM as an efficient collaborator. Once the research question is finalized, the LLM can assist in assessing the best qualitative research method (e.g., in-depth interviews vs. focus groups). During the research design phase, an LLM can generate an initial discussion guide or refine one developed by a researcher. The LLM can help identify characteristics (e.g., geography, profession, and personal interests) of respondents best suited to answer the research question. At the data collection phase, companies can experiment with a combination of human and synthetic respondents to generate insights efficiently and effectively. 

LLMs can also serve as excellent assistants when analyzing vast amount of text and audiovisual data collected during research. As demonstrated in Study 1, an LLM can emulate a human to identify relevant information from text data and generate themes. Considering that experts needed 40–45 minutes for such tasks on a small text sample in our study, this could save significant time and thus give the experts time for more complex tasks such as ensuring that the insights answer the research questions. 

![image](https://cdn-mineru.openxlab.org.cn/result/2026-08-17/3e35c286-06b2-48f5-80b8-198a0d2d79c4/747c4d3dfac1f7c0c7407c665c1f3ce7cad11eba69b26d5756f24096b6346c70.jpg)



Figure 4. Incorporating a Large Language Model in Qualitative Research: A Road Map.



Notes: The white, dark gray, and light gray blocks represent human-only, LLM-only, and AI–human hybrid processes, respectively. LLMs can assist in streamlining the discussion guide, identifying the right sample to interview, creating synthetic interview participants, and data analysis (e.g., removing repetitive text, identifying important sentences, and clustering them thematically).


We find that unique insights emerge from AI–human hybrids compared with the human-only or LLM-only approaches; the two approaches are complementary. As a result, we anticipate that AI–human hybrids will be the future ofqualitative research. The relative role of the human and AI would vary by task complexity and novelty associated with the research question. This argument is in line with task-based hybrid approaches described in fields such as organizational behavior (Shrestha, Ben-Menahem, and Von Krogh 2019) and sales force recruitment (Chakraborty et al. 2024). 

Finally, because LLMs are evolving rapidly, firms must continuously evaluate the efficiency and effectiveness gains from AI–human hybrids and establish a learning repository to develop guiding principles for long-term AI adoption. These principles should not only be solely cost driven but also address systemic algorithmic biases and the potential pitfalls of overreliance on AI. Given that marketing research is a medium-risk AI application compared with health care or recruitment,<sup>6</sup> this cautious test-and-learn approach to innovation could offer significant advantages. 

## Quantitative Research: Study 2

Following the encouraging findings from Study 1, we investigate how an LLM performs in replicating a marketing research survey. Similar to the approach we adopted for qualitative research, for this study we selected a representative survey that our partner company conducted in 2019. Using the findings from this study (n = 605) as a benchmark, our goal is to assess how well synthetic respondents perform relative to human respondents. The purpose of this quantitative study conducted by the company was to evaluate the attractiveness of a refrigerated dog food concept to dog owners. Two aspects of the concepts were of particular interest to the company. The first pertained to packaging (i.e., resealable bag vs. sliceable tube), and the second centered around the dog food ingredients (i.e., human grade vs. fresh). The full survey was longer, but for the purposes of our research we focus on specific aspects of the survey that are commonly deployed in many marketing research studies: concept preference, concept evaluation (e.g., purchase likelihood), attitudes toward the concept, and consumption frequency. 


Table 14. Prompt Structure: Survey.


<table><tr><td>Type</td><td>Prompt</td></tr><tr><td>Context</td><td>You are a respondent on a survey involving pet foods and today is August 19, 2019. Furthermore,A premium, fresh pet food shown below can be found in a fridge within your local store that carries pet food.This refrigerated pet food is made with real, high-quality ingredients. It is available in both a resealable bag containing bite-size chunks and pieces or in a sliceable roll in a plastic wrap.</td></tr><tr><td>System</td><td>Pretend that:You currently own a dog.You are likely to purchase refrigerated fresh dog food in the future assuming that.It is available where you shop for pet food and offered at a reasonable price.Here are some of your other descriptive characteristics as a survey respondent:You are White or Caucasian, male and 77 years old.You live in the west region in the United States. The area in which you live is rural.Your household has 2 people. Your marital status is married.Your education level is some college and your annual household income is 115,000 U.S. dollars.Your employment status is retired.</td></tr><tr><td>User</td><td>A question is typically described to the LLM as follows:Question: How often would you purchase this refrigerated (fresh) dog food idea?Answer format: Answer the question with a single number only. Do not include any other information. Use this format to answer: 2Choices: (1) Once every 6–11 months, (2) Less than once a year, (3) Once every 2–3 months, (4) Once a year, (5) Multiple times per week, (6) Once every 4–6 months, (7) 2–3 times per month, (8) Once a month, (9) Once a week.</td></tr></table>

The survey begins with questions about the respondents gender, age, and zip code, followed by questions about dog ownership, the type of dogs (e.g., puppy or adult and their weight), the number of dogs, and the respondent’s level of responsibility in caring for the dog (e.g., pet care and pet food shopping). Only those respondents engaged in pet food shopping for their dog are included in the survey. 

The survey describes the refrigerated dog food concept being tested in the research as follows: “Premium, fresh pet food can be found in a fridge within your local store that carries pet food. This refrigerated pet food is made with real, high-quality ingredients. It is available in both a resealable bag containing bite-size chunks and pieces, or in a sliceable roll in a plastic wrap.” Only those respondents likely to purchase such a product are allowed to continue the survey; that is, the survey prescreens the respondents for an interest in a refrigerated dog food product. The respondents then indicate the package type they are more likely to buy (resealable or sliceable). For each package type, the survey tests two versions of products: fresh (nonhuman grade) and human grade. The researchers assign respondents to resealable or sliceable products based on their preference. For example, those who prefer the resealable bag evaluate two alternatives: fresh and human grade. 

For each alternative, the respondents indicate their purchase likelihood, concept liking, and concept uniqueness on a fivepoint scale. Then, respondents answer questions, which relate to specific attributes (e.g., convenience, healthy ingredients, and quality) of the product concept, on a five-point scale (1 = “strongly agree,” and 5 = “strongly disagree”). They also indicate their intended frequency of purchase of this product concept. The final set of questions asks the respondents to provide information on demographic variables such as marital status, education, and income. 

## How the LLM Replicated the Survey Responses

To replicate the survey in an LLM, we specify the system, user, and assistant roles as previously defined (see Table 14). In its system role, the LLM is given contextual information for the task and the persona for each respondent. In the user role, LLM is given the question to answer and the required format for the answer. In its role as an assistant, the LLM answers the questions in the format desired. We use the system architecture depicted in Figure 1 to generate synthetic data. We use the OpenAI API for the GPT-4 model and a temperature setting of1 to generate these data. In robustness checks reported in Web Appendix B (Figures W6 and W7), we examine how the results vary by temperature and seed choice. The main takeaway is that the results are similar for a wide range of temperatures and for different seeds. This occurs because, in the survey context, the questions have a lower number of plausible answers. Compared with text generation, this task is of lower complexity and therefore exhibits less variability. 


Table 15. Demographic Statistics.


<table><tr><td>Variables</td><td colspan="4">Summary Statistics</td></tr><tr><td rowspan="2">Gender</td><td>Female</td><td>Male</td><td></td><td></td></tr><tr><td>49.6%</td><td>50.4%</td><td></td><td></td></tr><tr><td rowspan="2">Age</td><td>18–34</td><td>35–54</td><td>55–64</td><td>&gt;64</td></tr><tr><td>28.1%</td><td>45.1%</td><td>18.2%</td><td>8.6%</td></tr><tr><td rowspan="2">Income</td><td>&lt;$25,000</td><td>$25,000–$49,999</td><td>$50,000–$99,999</td><td>&gt;$99,999</td></tr><tr><td>7.6%</td><td>19.3%</td><td>46.4%</td><td>26.6%</td></tr><tr><td rowspan="2">Urbanicity</td><td>Rural</td><td>Urban</td><td>Suburban</td><td></td></tr><tr><td>24.6%</td><td>38.8%</td><td>36.5%</td><td></td></tr><tr><td rowspan="2">Education</td><td>&lt;12 years</td><td>High school graduate</td><td>Some college</td><td>College</td></tr><tr><td>.7%</td><td>14.9%</td><td>27.9%</td><td>56.5%</td></tr><tr><td rowspan="2">Ethnicity</td><td>White</td><td>Black</td><td>Asian</td><td>Other race</td></tr><tr><td>84.5%</td><td>3.8%</td><td>8.2%</td><td>3.6%</td></tr></table>

![image](https://cdn-mineru.openxlab.org.cn/result/2026-08-17/3e35c286-06b2-48f5-80b8-198a0d2d79c4/9e4b757cff1a8090c4571b044b28e1654d22cb8943a0ffce44555ca850d56968.jpg)



Figure 5. Purchase Likelihood, Liking, and Uniqueness (Sliceable, Human Grade). Notes: Error bars = ±1 SE.


## Results

The sample size for the original survey conducted by our partner company was 605. Table 15 reports the sample characteristics of the respondents who participated. In the synthetic data we generated, individual personas are created based on these sample characteristics. Our synthetic data exactly match the actual data on these dimensions. For the 605 synthetic respondents we generated, 304 evaluated the resealable bag product and the remaining 301 evaluated the sliceable roll in a plastic wrap. Table W6 in Web Appendix B summarizes the statistics for the three main groupings ofthe survey questions related to each product type (resealable and sliceable): concept evaluation, attitudes toward the concept, and consumption. The respondents provided their evaluation of both the fresh and human-grade dog foods. 

![image](https://cdn-mineru.openxlab.org.cn/result/2026-08-17/3e35c286-06b2-48f5-80b8-198a0d2d79c4/dd84eb619a727b4462f88624bfdd70e7128995b14bb95b91eeac8f3837a2eb43.jpg)



Figure 6. Consumer Attitudes (Sliceable, Human Grade). Notes: Error bars = ±1 SE.


The following results report how the actual data compare with the synthetic data for the human-grade, sliceable product in greater detail. 

Concept evaluation. Figure 5 presents a comparison between synthetic (LLM1) and actual data for three questions pertaining to purchase likelihood (Question 1), product liking (Question 2), and uniqueness (Question 3). For purchase likelihood, we find that the synthetic data mimic the direction and the valence of the actual data well. Statistically, two aspects of the results are noteworthy. First, the mean purchase likelihood for the synthetic data is lower, implying a higher purchase likelihood (p < .05). Second, the synthetic measure has a lower variance (p < .05). Somewhat in contrast, for the liking measure, the synthetic measure has the same mean as the actual data (p < .05); however, its standard deviation is lower (p < .05). For the uniqueness measure, although the mean for the synthetic answer is higher (p < .05), the standard deviation is lower (p < .05). 

Attitudinal measures. Figure 6 reports how the synthetic measures for a variety of attitudes, measured on a five-point scale, compare with the actual data. The seven attitudinal measures ask the respondents to give their responses for the following items: 

1. Has more benefits than other premium dog food 

2. I would use this as my dog’s primary source of food 

3. Is a convenient way to serve fresh food to my dog 

4. Is made with the healthiest ingredients 

5. Is the best quality product 

6. Is the safest food for my dog 

7. Makes me feel good about what I am feeding my dog 

For two of the seven attributes, the synthetic measure has the same mean as the actual data (Measures 2 and 7). For the remaining five attributes, the synthetic measure has a mean that is different from the actual data. The standard deviations for the synthetic data are lower. 

To investigate the distributional properties of these measures, we report the actual and synthetic data distributions in Figure 7. We selected these two distributions (Measures 7 and 4) as illustrations because, for the former, the actual and synthetic means are not statistically different, whereas they are different for the latter. For both distributions, the ratings for the synthetic data are concentrated around 4 or 5. This explains the lower standard deviation for the synthetic data; Measure 4, unlike the remaining attitudinal variables, includes mostly 4. 

![image](https://cdn-mineru.openxlab.org.cn/result/2026-08-17/3e35c286-06b2-48f5-80b8-198a0d2d79c4/23e89d3f34fa719cb2ff2da11df141ad59ae2caeaebb0c72a787646e0c54397d.jpg)



Figure 7. Distribution Comparison: Actual Versus LLM1.


Consumption. To measure purchase frequency, the survey asks the respondents to select one of nine bins: multiple times per week, once a week, 2–3 times per month, once a month, once every 2–3 months, once every 4–6 months, once every 6–11 months, once a year, or less than once a year. Figure 8 reports the findings from actual and synthetic respondents. We find that the synthetic data effectively pick the frequency counts for some of the bins (2–3 times per month and once a month) well. It, however, overreports the counts for multiple times per week and underreports for once a week. A chi-square test reveals that the actual and synthetic data distributions for the purchase frequency measure are different (p < .05). 

Across all comparisons thus far, the LLM picks the answer direction well in most instances; when the average for a variable is toward the lower end of the scale, the synthetic data average also tends to be low (e.g., purchase likelihood, liking, and uniqueness) and vice versa (e.g., the seven attitudinal measures). For almost all variables, the response heterogeneity in the synthetic data is smaller. 

![image](https://cdn-mineru.openxlab.org.cn/result/2026-08-17/3e35c286-06b2-48f5-80b8-198a0d2d79c4/fbcd12dfea31fbea563ac5af38d4c7cfe9604913a883c76d49dc76a94bb0e878.jpg)



Figure 8. Survey Data (Sliceable, Human Grade).


A possible explanation for why the response heterogeneity for many variables in the synthetic data is smaller may be that the majority of prompts in the system role are centered around demographics (age, race, region, education, employment, etc.). It is well known that demographics explain a very small proportion of consumer preferences, attitudes, and behaviors. Better approaches to generate synthetic survey data exist. First, incorporating context by including answers to previous questions in the system prompt for the current question, or few-shot learning, may result in more realistic answers. Second, the retrieval-augmented generation (RAG) of synthetic data that leverages the company’s existing relevant information about refrigerated pet foods could help generate better synthetic data. We next test these two approaches. 

## Incorporating Context: Few-Shot Learning and RAG

As it relates to the psychometric properties of survey items, response consistency and convergent validity are known to be important (Cunningham, Preacher, and Banaji 2001; Peter 1979, 1981). Although consistency refers to correlations between multiple items for a construct (e.g., health consciousness), convergent validity refers to correlation among different measures (e.g., healthy, safe) that are related to the same construct (e.g., quality). Therefore, for our research, the ability to recover the correlations among items in human data is important. In addition to recovering the mean response, in our findings presented herein, we pay attention to how well the LLM recovers the heterogeneity across respondents and the correlation between responses. 


Table 16. Mean, Heterogeneity, and Correlations Recovery Metrics.


<table><tr><td>Model</td><td>Mean</td><td>Heterogeneity</td><td>Correlations</td></tr><tr><td>LLM1 (zero shot)</td><td>.66 (.02)</td><td>.41 (.06)</td><td>.40 (.02)</td></tr><tr><td>LLM2 (few shot, response history)</td><td>.67 (.04)</td><td>.29 (.03)</td><td>.27 (.02)</td></tr><tr><td>LLM3 (few shot and RAG)</td><td>.69 (.04)</td><td>.28 (.03)</td><td>.11 (.02)</td></tr><tr><td>Sample size</td><td>7</td><td>7</td><td>21</td></tr></table>


Notes: Each number is the average of the absolute difference between each model and the actual data. Standard errors are in parentheses.


Our goal is to investigate how existing methods can be used to improve on the results we report in the previous section. In the results reported, we used the implementation architecture described in Figure 1. To incorporate context by using few-shot learning, for a given persona, in the system role we include the answers the LLM provided for the previous questions; when asking three questions from a synthetic respondent, we include the question–answer pair for Question 1 when the LLM answered Question 2 and the question–answer pairs for Questions 1 and 2 when it answered Question 3. 

![image](https://cdn-mineru.openxlab.org.cn/result/2026-08-17/3e35c286-06b2-48f5-80b8-198a0d2d79c4/4c8a7e2608b94700ba578e16db14161eb9990b2752711186b170435c3a8510c3.jpg)



Figure 9. Mean and Heterogeneity Recoveries (Sliceable, Human Grade). Notes: Error bars = ±1 SE in Panel A.


![image](https://cdn-mineru.openxlab.org.cn/result/2026-08-17/3e35c286-06b2-48f5-80b8-198a0d2d79c4/abc075d2f61629e34a6ad958176775f66630aedb304fa68193ff37fd6d13304c.jpg)



Figure 10. Internal Consistency Recoveries (Sliceable, Human Grade).


To incorporate context using RAG, we include data from qualitative research that our partner company and C+R Research conducted prior to the current survey. The purpose of this qualitative research was to gain an understanding of pet owners’ attitudes, perceptions, and motivations regarding the purchase of premium pet food, with a particular focus on their current and future interest in human-grade ultra-premium pet food. The company intended to explore consumers’ relationships with their pets and their perceptions of fresh versus frozen pet food. In addition, the study investigated the motives for purchasing premium pet food and assessed buyers’ reactions to various pet food claims (e.g., human-grade, natural, fresh, and never frozen). To operationalize RAG as described in 

Figure 2, we use transcripts from 16 respondents who participated in this qualitative research. 

In Table 16, we compare the results from the previous section (LLM1) with those from incorporating few-shot learning (LLM2) and few-shot learning plus RAG (LLM3). We compare the three LLMs on three dimensions: bias, heterogeneity, and internal consistency. In particular, we are interested in comparing the LLM performance on the last two metrics, which we have not formally examined yet. When comparing bias, our goal is to assess how the average response of humans compares with those of the three LLMs; it simply reports the absolute difference between the mean response of the humans with those ofthe LLMs. When comparing heterogeneity, we report the absolute difference in standard deviations between the human responses and LLM responses. Finally, when reporting internal consistency, we report the absolute difference in pairwise correlations (e.g., among two attitudinal measures) between the human responses and LLM responses. For all three recovery measures, in Table 16 we report the averages across the seven attitudinal questions that appear after the three concept evaluation questions that the LLM answers earlier in the survey. Answers to the first three questions should give the LLM some contextual information about the respondent. 


Figure 11. Incorporating a Large Language Model in Quantitative Research: A Road Map. Notes: The white, dark gray, and light gray blocks represent human-only, LLM-only, and hybrid processes respectively.


![image](https://cdn-mineru.openxlab.org.cn/result/2026-08-17/3e35c286-06b2-48f5-80b8-198a0d2d79c4/1ce598bd096661a491ffb104d72d87f24cc63106fa9369babc16a72ec5afc903.jpg)


There are important takeaways in these analyses that point to the value of few-shot learning and RAG. On the heterogeneity measure, we see gains from incorporating context. Both LLM2 and LLM3 get closer to the heterogeneity exhibited by human respondents than LLM1 (p < .05). The difference in heterogeneity recovery between LLM2 and LLM3 is not significant (p < .05). On the internal consistency measure, we see impressive gains. Both LLM2 and LLM3 get closer to the internal consistency exhibited by human respondents (p < .05). The difference in internal consistency recovery between LLM2 and LLM3 is also significant (p < .05), with LLM3 outperforming LLM2. In contrast, on the bias measure, incorporating context via response history (LLM2) or response history plus RAG (LLM3) does not exhibit any gains. The LLM answers tend be more extreme (by about .7 on a five-point scale) across all three LLMs. 

To summarize, when we incorporate respondent history or few-shot learning into efforts to generate synthetic respondents, we see encouraging gains in the LLM performance on two dimensions: better characterization of respondent heterogeneity and improved internal consistency. When we incorporate context two different ways, few-shot learning and RAG, we see further gains in improved internal consistency. 

Next, we visually illustrate the gains from incorporating context for three attitudinal questions. In Panels B–D of Figure 9, we show that LLM3 exhibits response heterogeneity that is closest to that of the humans. Across all seven questions (for the remaining questions, see Figure W5 in Web Appendix B) we see gains in how LLM2 and LLM3 characterize heterogeneity relative to LLM1. In Panel A of Figure 9, we find that for Measures 1 and 3, both LLM2 and LLM3 get closer to the human answer; in contrast, for Measure 2 both LLM2 and LLM3 get farther away from it. 

Finally, to demonstrate gains in internal consistency, we focus our attention on the seven previously discussed attitudinal questions (Measures 1–7). The top left ofFigure 10 demonstrates the correlations among these seven questions based on human data. The correlations make sense because, for example, Measure 4 (healthiest ingredients) and Measure 5 (best quality product) have a correlation of.69. All correlations in the actual data are positive and significant (p < .05). For LLM1 (top right), an undesirable aspect ofthe correlations in the synthetic data is that most correlations are close to zero. For LLM2 (bottom left), when the model incorporates few-shot learning, all correlations are positive and mimic the true correlations better. For LLM3 (bottom right), when both response history and RAG are incorporated, the correlation recovery is even better and mimics the actual correlations the best. 

In summary, we find that the foundation LLM does a reasonably good job of recovering the direction of the human answers. However, this model suffers from two undesirable psychometric properties: an inability to fully describe response heterogeneity and the poor internal consistency of the responses. Both shortcomings can be partially overcome by incorporating context. We show that response history and RAG are promising tools that can help recover human answers better than the baseline foundation models. With the rapid pace of AI evolution, it is fair to say that “today’s AI is the worst AI you will ever use” (Mollick 2023). With this in mind, we are encouraged by the promising results we find in Study 2. 

## LLM Adoption Road Map for Surveys

Based on the lessons learned from Study 2 and the broader landscape of survey research in marketing, we end with a road map (see Figure 11) for how marketing researchers can leverage an LLM as a collaborator. As a first step, for the survey design process, the LLM can be an excellent starting point for creating the first draft of a survey and doing so quickly. For example, an LLM can be used to ideate attributes that may be the most relevant, create perceptual and attitudinal measures (e.g., needs and motives), eliminate redundancy among attributes, and refine multiattribute scales. Survey introductions, screener questions, and demographic questions can be generated by an LLM with relative ease. A human expert can begin with this draft survey, add skip logic and programming instructions, assess respondent experience, and so on before approving it. Therefore, the LLM can focus on the laborious, repetitive, and uninteresting tasks while the human expert can think more creatively about answers to the business questions and the quality of the insights the research should deliver. 

Our findings reveal that before launching a survey to humans, an LLM could be used as the first step to generate synthetic data. In this step, both response history and relevant data sources (via RAG) could add significant value by generating more realistic data. The results could be used to visualize the results that an insights manager should anticipate. By turning the research flow on its head, this “backward” marketing research approach (Andreasen 1985) where one can look at the expected results before fielding a survey could be invaluable in a variety of ways. It could answer fundamental questions that include the quality of insights the survey is likely to reveal and survey questions that could be removed or added. The synthetic data may offer guidance on sample size by relying on the variance observed; it is often difficult to do sample size calculations for surveys because the expected variance on key questions is unobserved prior to a survey. The synthetic data may sometimes obviate the need to conduct the survey at all; for example, this could occur when one concept clearly dominates all the concepts tested or when the main insights from the survey are not new. 

As with any disruptive innovation, we encourage companies to be thoughtful and strategic when adopting LLMs for survey research. To calibrate and uncover the true value of an LLM for its business, companies should run multiple validation checks before fully embracing LLM-generated survey data. By building a repository of human surveys mimicked by LLMs, a test-and-learn approach may reveal areas in which an LLM shines and those in which it is deemed inappropriate. A test-and-learn approach for different ways to incorporate context should also be a part of the adoption process. These validations could be conducted on historical data. Indeed, most Fortune 500 companies likely have hundreds of surveys that they could potentially validate. Using such historical data can help develop guiding principles for when and how to use an LLM for survey research. A step-by-step approach to using LLMs as an assistant to conduct marketing research surveys is included in Web Appendix C. 

## Conclusions

The impact of GenAI and LLMs on the business world and society at large is likely to be transformational. In marketing, GenAI is already showing an impact in areas such as personalization, product ideation, and content designs. We believe that the marketing research industry is also poised for disruption because of innovations in LLMs and investigate this claim empirically. Our findings indicate that the AI–human hybrid can deliver significant efficiency and effectiveness gains in the marketing research process. 

On the qualitative front, LLMs can assist a marketing researcher generate synthetic data and analyze data. In terms ofdata generation, LLMs can help evaluate appropriate research methods, streamline research instruments, determine the profile of individuals to interview, generate synthetic respondents, interview respondents, and even moderate an in-depth interview. LLM-generated data are as good as and sometimes better than human-generated data on dimensions such as depth and insightfulness. In terms of analyzing unstructured qualitative data, LLMs show great potential. They do as well as expert human analysts in relatively simple tasks like identifying key sentences, clustering them into themes, and coming up with a clear, informative, and interesting summary. Thus, human experts could use LLMs as an assistant for insight generation to help reduce their data-processing load. 

On the quantitative front, we find that the LLM picked the answer direction well; when the average for a variable is toward the lower end of the scale, the synthetic data average tends also to be low and vice versa. To improve on the findings from the base foundation model (GPT-4), we tested two ways to incorporate context: few-shot learning and RAG. Each approach shows promise in improving synthetic survey data quality by helping improve the heterogeneity and reliability of LLM answers. An AI–human hybrid can significantly streamline the survey design process by quickly creating initial drafts, allowing human experts to focus on the quality ofinsights that the research will deliver. Additionally, using LLMs to generate synthetic data before conducting human surveys can provide valuable insights into expected results, help determine sample sizes, and sometimes even eliminate the need for the survey. 

A significant advantage of LLMs as an assistant is their low cost. We believe that this single factor will contribute significantly toward rapid adoption of LLMs for insight generation. The gains here are likely to be substantially higher for hard-to-reach respondents (e.g., doctors, senior managers); although obvious, it is worth noting that synthetic respondents do not get tired and can provide lengthy answers for many questions. In the B2B arena, where the end users and buyers are not easy to reach, LLM could be helpful in supplementing the information gathered from human respondents. LLMs as an intelligent engine could prove to be a revolutionary generator of prior information for a wide variety of business questions at a low cost. 

## Limitations and Future Research

A well-known shortcoming of LLMs is that they are trained on scraped data that exhibit gender, race, and cultural biases and may contain misinformation. Therefore, the LLM output could reinforce those biases and propagate misinformation (for useful perspectives, see Ahmed [2024] and Nasa [2024]). In addition to presenting a hurdle in LLM adoption, this shortcoming amplifies the need for a human in the loop for marketing research use cases. Methods such as reinforcement learning (Christiano et al. 2017) with human feedback could promote LLM alignment with values like helpfulness and harmlessness, enhancing its ability to generate high-quality responses and reduce harmful content. Over time, because of policy interventions, foundation models may get better by using curated data to mitigate data biases that currently exist. Fine-tuning may also present opportunities to address ethical concerns by using transfer learning. For example, an LLM could be trained to comply with legal requirements to remove existing biases. For research in the field of psychology, perspectives by Demszky et al. (2023) are helpful. 

The findings from the empirical tests we report are not generalizable and should be viewed as illustrations of the main point of the article that LLMs could be used as an assistant when conducting qualitative and quantitative research. Repeated validations across a wide variety of contexts are necessary for the successful adoption of LLMs as a collaborator/ assistant in the marketing research process. 

## Acknowledgments

We thank Paul Metz, CEO ofC+R Research Chicago; Darren Breese, VP Qualitative Research of C+R Research Chicago, and the C+R team for sharing the data and supporting this research. We also thank the client company (it wishes to remain anonymous) for giving us access to the studies we report. We thank Jungeun Lim for outstanding research support. We also thank Yi Liu, Hulya Karaman, Shrabastee Banerjee, Ankit Sisodia, Remi Daviet, the participants in the marketing seminar at University of California, Davis, and the participants in the Symposium on AI in Marketing at University ofWisconsin–Madison for their valuable feedback. 

## Authors Contributions

The authors are listed alphabetically and contributed equally. 

## Coeditor

Shrihari Sridhar 

## Associate Editor

Detelina Marinova 

## Declaration of Conflicting Interests

The authors declared no potential conflicts of interest with respect to the research, authorship, and/or publication of this article. 

## Funding

The authors received no financial support for the research, authorship, and/or publication of this article. 

## ORCID iDs

Neeraj Arora https://orcid.org/0000-0001-8210-9592 Ishita Chakraborty https://orcid.org/0000-0002-7210-2773 

## References



Acar, Oguz A. (2023), “A Practical Guide for Marketers Who Want to Use GenAI,” Harvard Business Review (December 11), https://hbr. org/2023/12/a-practical-guide-for-marketers-who-want-to-use-genai. 





Aher, Gati, Rosa I. Arriaga, and Adam Tauman Kalai (2023), “Using Large Language Models to Simulate Multiple Humans and Replicate Human Subject Studies,” in ICML ’23: Proceedings ofthe 40th International Conference on Machine Learning. Association for Computing Machinery, 337–71. 





Ahmed, Nisha Arya (2024), “Understanding and Mitigating Bias in Large Language Models (LLMs),” Datacamp (January 25), https:// www.datacamp.com/blog/understanding-and-mitigating-biasin-large-language-models-llms. 





Andreasen, Alan R. (1985), “Backward Market Research,” Harvard Business Review, 63 (3), 176–82. 





Argyle, Lisa P., Ethan C. Busby, Nancy Fulda, Joshua R. Gubler, Christopher Rytting, and David Wingate (2023), “Out of One, Many: Using Language Models to Simulate Human Samples,” Political Analysis, 31 (3), 337–51. 





Berger, Jonah, Ashlee Humphreys, Stephan Ludwig, Wendy W. Moe, Oded Netzer, and David A. Schweidel (2020), “Uniting the Tribes: Using Text for Marketing Insight,” Journal of Marketing, 84 (1), 1–25. 





Blei, David M., Andrew Y. Ng, and Michael I. Jordan (2003), “Latent Dirichlet Allocation,” Journal of Machine Learning Research, 3, 993–1022. 





Brand, James, Ayelet Israeli, and Donald Ngwe (2023), “Using LLMs for Market Research,” Harvard Business School Marketing Unit Working Paper No. 23-062, SSRN (March 30), https://dx.doi.org/ 10.2139/ssrn.4395751. 





Brown, Tom B., Benjamin Mann, Nick Ryder, Melanie Subbiah, Jared Kaplan, Prafulla Dhariwal, Arvind Neelakantan, Pranav Shyam, Girish Sastry, Amanda Askell, Sandhini Agarwal, Ariel Herbert-Voss, Gretchen Krueger, Tom Henighan, Rewon Child, Aditya Ramesh, Daniel M. Ziegler, Jeffrey Wu, Clemens Winter, Christopher Hess, et al. (2020), “Language Models Are Few-Shot Learners,” in NIPS ’20: Proceedings ofthe 





34th International Conference on Neural Information Processing Systems. Association for Computing Machinery, 1877–1901. 





Burnard, Philip (1991), “A Method of Analysing Interview Transcripts in Qualitative Research,” Nurse Education Today, 11 (6), 461–66. 





Castleberry, Ashley and Amanda Nolen (2018), “Thematic Analysis of Qualitative Research Data: Is It as Easy as It Sounds?” Currents in Pharmacy Teaching and Learning, 10 (6), 807–15. 





Chakraborty, Ishita, Khai Chiong, Howard Dover, and K. Sudhir (2024), “Can AI and AI-Hybrids Detect Persuasion Skills? Salesforce Hiring with Conversational Video Interviews,” Marketing Science (published online September 19), https:// doi.org/10.1287/mksc.2023.0149. 





Chakraborty, Ishita, Minkyung Kim, and K. Sudhir (2022), “Attribute Sentiment Scoring with Online Text Reviews: Accounting for Language Structure and Missing Attributes,” Journal of Marketing Research, 59 (3), 600–622. 





Chang, Yupeng, Xu Wang, Jindong Wang, Yuan Wu, Linyi Yang, Kaijie Zhu, Hao Chen, Xiaoyuan Yi, Cunxiang Wang, Yidong Wang, Wei Ye, Yue Zhang, Yi Chang, Philip S. Yu, Qiang Yang, and Xing Xie (2024), “A Survey on Evaluation of Large Language Models,” ACM Transactions on Intelligent Systems and Technology, 15 (3), 1–45. 





Christiano, Paul F., Jan Leike, Tom B. Brown, Miljan Martic, Shane Legg, and Dario Amodei (2017), “Deep Reinforcement Learning from Human Preferences,” in NIPS ’17: Proceedings of the 31st International Conference on Neural Information Processing Systems. Association for Computing Machinery, 4302–10. 





Churchill, Gilbert A. and Dawn Iacobucci (2006), Marketing Research: Methodological Foundations, 9th ed.Thomson South-Western. 





Cunningham, William A., Kristopher J. Preacher, and Mahzarin R. Banaji (2001), “Implicit Attitude Measures: Consistency, Stability, and Convergent Validity,” Psychological Science, 12 (2), 163–70. 





Demszky, Dorottya, Diyi Yang, David S. Yeager, Christopher J. Bryan, Margarett Clapper, Susannah Chandhok, Johannes C. Eichstaedt, Cameron Hecht, Jeremy Jamieson, Meghann Johnson, Michaela Jones, Danielle Krettek-Cobb, Leslie Lai, Nirel JonesMitchell, Desmond C. Ong, Carol S. Dweck, James J. Gross, and James W. Pennebaker (2023), “Using Large Language Models in Psychology,” Nature Reviews Psychology, 2 (11), 688–701. 





Devlin, Jacob, Ming-Wei Chang, Kenton Lee, and Kristina Toutanova (2018), “BERT: Pre-Training of Deep Bidirectional Transformers for Language Understanding,” arXiv, https://doi.org/10.48550/ arXiv.1810.04805. 





Gao, Yunfan, Yun Xiong, Xinyu Gao, Kangxiang Jia, Jinliu Pan, Yuxi Bi, Yi Dai, Jiawei Sun, Meng Wang, and Haofen Wang (2023), “Retrieval-Augmented Generation for Large Language Models: A Survey,” arXiv, https://doi.org/10.48550/arXiv.2312.10997. 





Gekhman, Zorik, Gal Yona, Roee Aharoni, Matan Eyal, Amir Feder, Roi Reichart, and Jonathan Herzig (2024), “Does Fine-Tuning LLMs on New Knowledge Encourage Hallucinations?” arXiv, https://doi.org/10.48550/arXiv.2405.05904. 





Gelman, Andrew and Jennifer Hill (2006), Data Analysis Using Regression and Multilevel/Hierarchical Models. Cambridge University Press. 





Gentzkow, Matthew, Bryan Kelly, and Matt Taddy (2019), “Text as Data,” Journal ofEconomic Literature, 57 (3), 535–74. 





Gioia, Dennis A., Kevin G. Corley, and Aimee L. Hamilton (2013), “Seeking Qualitative Rigor in Inductive Research: Notes on the Gioia Methodology,” Organizational Research Methods, 16 (1), 15–31. 





Greenbook (2024), “2024 GRIT Insights Practice Report” (May), https://www.greenbook.org/grit/insights-practice-edition. 





Gunning, Robert (1969), “The Fog Index After Twenty Years,” International Journal ofBusiness Communication, 6 (2), 3–13. 





Horton, John J. (2023), “Large Language Models as Simulated Economic Agents: What Can We Learn from Homo Silicus?” National Bureau of Economic Research Working Paper 31122, https://www.nber.org/papers/w31122. 





Howard, Jeremy and Sebastian Ruder (2018), “Universal Language Model Fine-Tuning for Text Classification,” arXiv, https://doi.org/ 10.48550/arXiv.1801.06146. 





Jalali, Mohammad S. and Ali Akhavan (2024), “Integrating AI Language Models in Qualitative Research: Replicating Interview Data Analysis with ChatGPT,” System Dynamics Review, 30 (3), e1772. 





Kashy, Deborah A., Lorne Campbell, and David W. Harris (2006), “Advances in Data Analytic Approaches for Relationships Research: The Broad Utility of Hierarchical Linear Modeling,” in The Cambridge Handbook of Personal Relationships. Cambridge University Press, 73–89. 





Kincaid, J. Peter, Robert P. Fishburn Jr., Richard L. Rogers, and Brad S. Chissom (1975), “Derivation of New Readability Formulas (Automated Readability Index, Fog Count and Flesch Reading Ease Formula) for Navy Enlisted Personnel,” research report, Chief of Naval Technical Training. 





Kocoń , Jan, Igor Cichecki, Oliwier Kaszyca, Mateusz Kochanek, Dominika Szydło, Joanna Baran, Julita Bielaniewicz, Marcin Gruza, Arkadiusz Janz, Kamil Kanclerz, Anna Kocoń , Bartłomiej Koptyra, Wiktoria Mieleszczenko-Kowszewicz, Piotr Miłkowski, Marcin Oleksy, Maciej Piasecki, Łukasz Radliń ski, Konrad Wojtasik, Stanisław Woźniak, and Przemysław Kazienko (2023), “ChatGPT: Jack of all Trades, Master of None,” Information Fusion, 99 (November), 101861. 





Kumar, V., Robert P. Leone, David A. Aaker, and George S. Day (2018), Marketing Research, 13th ed.John Wiley & Sons. 





Lewis, Patrick, Ethan Perez, Aleksandra Piktus, Fabio Petroni, Vladimir Karpukhin, Naman Goyal, Heinrich Küttler, Mike Lewis, Wen-tau Yih, Tim Rocktäschel, Sebastian Riedel, and Douwe Kiela (2020), “Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks,” in NIPS ’20: Proceedings of the 34th International Conference on Neural Information Processing Systems. Association for Computing Machinery, 9459–74. 





Li, Chunyuan, Cliff Wong, Sheng Zhang, Naoto Usuyama, Haotian Liu, Jianwei Yang, Tristan Naumann, Hoifung Poon, and Jianfeng Gao (2024), “LLaVA-Med: Training a Large Language-and-Vision Assistant for Biomedicine in One Day,” in NIPS ’23: Proceedings of the 37th International Conference on Neural Information Processing Systems. Association for Computing Machinery, 28541–64. 





Li, Peiyao, Noah Castelo, Zsolt Katona, and Miklos Sarvary (2024), “Frontiers: Determining the Validity of Large Language Models 





for Automated Perceptual Analysis,” Marketing Science, 43 (2), 254–66. 





Li, Yinheng, Shaofei Wang, Han Ding, and Hang Chen (2023), “Large Language Models in Finance: A Survey,” in ICAIF ’23: Proceedings of the Fourth ACM International Conference on AI in Finance. Association for Computing Machinery, 374–82. 





Liu, Mengqi and Faten M’Hiri (2024), “Beyond Traditional Teaching: Large Language Models as Simulated Teaching Assistants in Computer Science,” in SIGCSE 2024: Proceedings of the 55th ACM Technical Symposium on Computer Science Education. Association for Computing Machinery, 743–49. 





McDaniel, Carl, Jr., and Roger Gates (2018), Marketing Research, 11th ed. John Wiley & Sons. 





McInnes, Leland, John Healy, and James Melville (2018), “UMAP: Uniform Manifold Approximation and Projection for Dimension Reduction,” arXiv, https://doi.org/10.48550/arXiv.1802.03426. 





McLaughlin, G. Harry (1969), “SMOG Grading: A New Readability Formula,” Journal of Reading, 12 (8), 639–46. 





Mollick, Ethan (2023), “Today’s AI Is the Worst AI You Will Ever Use,” LinkedIn (September 9), https://www.linkedin.com/posts/ emollick_todays-ai-is-the-worst-ai-you-will-ever-activity-7106305 750431322112-Xr7n/. 





Moor, James H. (2003), The Turing Test: The Elusive Standard of Artificial Intelligence. Springer. 





Moreau, Page, Emanuela Prandelli, and Martin Schreier (2023), “Generative Artificial Intelligence and Design Co-Creation in Luxury New Product Development: The Power of Discarded Ideas,” Bocconi University Management Research Paper, SSRN (November 30), https://dx.doi.org/10.2139/ssrn.4630856. 





Nasa, Samarpit (2024), “De-Biasing LLMs: From Theory to Practice,” Appypie (September 27), https://www.appypie.com/blog/ strategies-for-de-biasing-llms. 





OpenAI, Josh Achiam, Steven Adler, Sandhini Agarwal, Lama Ahmad, Ilge Akkaya, Florencia Leoni Aleman, Diogo Almeida, Janko Altenschmidt, Sam Altman, Shyamal Anadkat, Red Avila, Igor Babuschkin, Suchir Balaji, Valerie Balcom, Paul Baltescu, Haiming Bao, Mohammad Bavarian, Jeff Belgum, and Irwan Bello (2023), “GPT-4 Technical Report,” arXiv, https://doi.org/ 10.48550/arXiv.2303.08774. 





Pennebaker, James W. and Laura A. King (1999), “Linguistic Styles: Language Use as an Individual Difference,” Journal of Personality and Social Psychology, 77 (6), 1296–1312. 





Peres, Renana, Martin Schreier, David Schweidel, and Alina Sorescu (2023), “On ChatGPT and Beyond: How Generative Artificial Intelligence May Affect Research, Teaching, and Practice,” International Journal ofResearch in Marketing, 40 (2), 269–75. 





Peter, J. Paul (1979), “Reliability: A Review of Psychometric Basics and Recent Marketing Practices,” Journal ofMarketing Research, 16 (1), 6–17. 





Peter, J. Paul (1981), “Construct Validity: A Review of Basic Issues and Marketing Practices,” Journal ofMarketing Research, 18 (2), 133–45. 





Qiu, Liying, Param Vir Singh, and Kannan Srinivasan (2023), “Consumer Risk Preferences Elicitation from Large Language Models,” SSRN (July 31), https://dx.doi.org/10.2139/ssrn.4526072. 





Quirks (2024), “8 Top Generative AI Companies” (July 1), https:// www.quirks.com/articles/8-top-generative-ai-companies. 





Radford, Alec, Karthik Narasimhan, Tim Salimans, and Ilya Sutskever (2018), “Improving Language Understanding by Generative Pre-Training,” staff paper, OpenAI. 





Ratajczak, David, Matthew Kropp, Silvio Palumbo, Nicolas de Bellefonds, Jessica Apotheker, Sarah Willersdorf, and Giorgo Paizanis (2023), “How CMOs Are Succeeding with Generative AI,” BCG (June 15), https://www.bcg.com/publications/2023/ generative-ai-in-marketing. 





Reimers, Nils and Iryna Gurevych (2019), “Sentence-BERT: Sentence Embeddings Using Siamese BERT-Networks,” arXiv, https://doi. org/10.48550/arXiv.1908.10084. 





Sankaran, Ajith (2023), “Transforming Market Research: The Impact of Generative AI,” Forbes (November 1), https://www.forbes. com/sites/forbesbusinesscouncil/2023/11/01/transforming-marketresearch-the-impact-of-generative-ai/. 





Serapio-García, Greg, Mustafa Safdari, Clément Crepy, Luning Sun, Stephen Fitz, Peter Romero, Marwa Abdulhai, Aleksandra Faust, and Maja Matarić (2023), “Personality Traits in Large Language Models,” arXiv, https://doi.org/10. 48550/arXiv.2307.00184. 





Shrestha, Yash Raj, Shiko M. Ben-Menahem, and Georg Von Krogh (2019), “Organizational Decision-Making Structures in the Age of Artificial Intelligence,” California Management Review, 61 (4), 66–83. 





Statista (2023), “Revenue of the Market Research Industry Worldwide from 2008 to 2023 with a Forecast for 2024,” (accessed July 1, 2024), https://www.statista.com/statistics/242477/global-revenueof-market-research-companies/. 





Sun, Chen, Abhinav Shrivastava, Saurabh Singh, and Abhinav Gupta (2017), “Revisiting Unreasonable Effectiveness of Data in Deep Learning Era,” in 2017 IEEE International Conference on Computer Vision (ICCV). IEEE, 843–52. 





Swedberg, Richard (2020), “Exploratory Research,” in The Production ofKnowledge: Enhancing Progress in Social Science. Cambridge University Press, 17–41. 





Thomas, Paul, Seth Spielman, Nick Craswell, and Bhaskar Mitra (2023), “Large Language Models Can Accurately Predict Searcher Preferences,” arXiv, https://doi.org/10.48550/arXiv.2309.10621. 





Timoshenko, Artem and John R. Hauser (2019), “Identifying Customer Needs from User-Generated Content,” Marketing Science, 38 (1), 1–20. 





Tirunillai, Seshadri and Gerard J. Tellis (2014), “Mining Marketing Meaning from Online Chatter: Strategic Brand Analysis of Big Data Using Latent Dirichlet Allocation,” Journal of Marketing Research, 51 (4), 463–79. 





Törnberg, Petter (2023), “ChatGPT-4 Outperforms Experts and Crowd Workers in Annotating Political Twitter Messages with Zero-Shot Learning,” arXiv, https://doi.org/10.48550/arXiv.2304.06588. 





Touvron, Hugo, Louis Martin, Kevin Stone, Peter Albert, Amjad Almahairi, Yasmine Babaei, Nikolay Bashlykov, Soumya Batra, Prajjwal Bhargava, Shruti Bhosale, Dan Bikel, Lukas Blecher, Cristian Canton Ferrer, Moya Chen, Guillem Cucurull, David Esiobu, Jude Fernandes, Jeremy Fu, Wenyin Fu, and Brian Fuller (2023), “Llama 2: Open Foundation and Fine-Tuned Chat Models,” arXiv, https://doi.org/10.48550/arXiv.2307.09288. 





Wang, Xin (Shane), Jiaxiu He, David J. Curry, and Jun Hyun (Joseph) Ryoo (2022), “Attribute Embedding: Learning 





Hierarchical Representations of Product Attributes from Consumer Reviews,” Journal ofMarketing, 86 (6), 155–75. 





White, Jules, Quchen Fu, Sam Hays, Michael Sandborn, Carlos Olea, Henry Gilbert, Ashraf Elnashar, Jesse Spencer-Smith, and Douglas C. Schmidt (2023), “A Prompt Pattern Catalog to Enhance Prompt Engineering with ChatGPT,” arXiv, https://doi.org/10.48550/arXiv. 2302.11382. 





Wongsuphasawat, Kanit, Yang Liu, and Jeffrey Heer (2019), “Goals, Process, and Challenges of Exploratory Data Analysis: An Interview Study,” arXiv, https://doi.org/10.48550/arXiv.1911.00568. 





Zhang, Shuang, Xuefeng Zheng, and Changjun Hu (2015), “A Survey of Semantic Similarity and Its Application to Social Network 





Analysis,” in 2015 IEEE International Conference on Big Data (Big Data). IEEE, 2362–67. 





Zhao, Wayne Xin, Kun Zhou, Junyi Li, Tianyi Tang, Xiaolei Wang, Yupeng Hou, Yingqian Min, Beichen Zhang, Junjie Zhang, Zican Dong, Yifan Du, Chen Yang, Yushuo Chen, Zhipeng Chen, Jinhao Jiang, Ruiyang Ren, Yifan Li, Xinyu Tang, Zikang Liu, Peiyu Liu et al. (2023), “A Survey of Large Language Models,” arXiv, https://doi.org/10.48550/arXiv.2303.18223. 





Ziems, Caleb, William Held, Omar Shaikh, Jiaao Chen, Zhehao Zhang, and Diyi Yang (2024), “Can Large Language Models Transform Computational Social Science?” Computational Linguistics, 50 (1), 237–91. 

