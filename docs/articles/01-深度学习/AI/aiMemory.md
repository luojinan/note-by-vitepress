# AI Memory

在日常使用大语言模型 (LLM) 的过程中，我们经常遇到这样的困扰：每次新的对话都像是从零开始，AI 无法记住之前的交互内容、个人偏好或项目上下文。这种 "健忘症" 不仅降低了工作效率，也影响了 AI 助手的实用性。

LLM 的无状态特性带来了几个关键问题：

- **重复性工作**：每次都需要重新提供背景信息和偏好设置
- **上下文丢失**：无法维持长期的项目状态和决策历史
- **个性化缺失**：无法学习和适应用户的特定需求
- **跨应用割裂**：在不同 AI 工具间无法共享信息

LLM 的无状态特性常常导致重复的提示和不一致的代码生成。每次寻求帮助，都感觉像是从零开始。

跨 APP 大数据算法推荐，小红书、抖音、电商平台的猜你喜欢

## 混乱的解决办法

1. system prompt
2. Cursor’s/Cline Rules - 勾选自动读取 or 手动选择 (ststem prompt -> project rules -> user prompt)
3. RAG
4. memory bank [cursor-memory-bank-rules.md](https://gist.github.com/ipenywis/1bdb541c3a612dbac4a14e1e3f4341ab)

- ai 不明白什么是合理记忆什么是废话，且上下文长了就会幻觉。所以记忆太多只能让第一次回答的不稳定性增加
- 一段时间后，大多数存储库文件变得 “臃肿” 且适得其反：只是增加了令牌的使用，而对代码质量却没有什么好处
- LLM 生成的任何东西，无论提示有多好，都需要某种形式的审查。审查记忆库只是又一项需要做的事情，而且浪费时间，因为它根本不是产品创造价值的一部分：它只对 LLM 代码生成有用，甚至不能真正用于正确的文档
- 这会减慢大多数任务的速度，因为现在 Roo 除了生成代码之外，还必须读取和更新所有存储库
- 自己维护几个上下文文件，既省事又省力，好处多多：更简洁，还能用于正式的技术项目文档。所以这不仅仅适用于 (LLM)
- [specStory](https://docs.specstory.com/introduction)

5. LLM Memory，openai memory
6. IDE Memory 如：规则类型示例规则始终开启 “使用 Tailwind CSS 进行所有样式设置” 基于范围 “对于 /api/ 中的文件，确保所有处理程序都返回标准 JSON 格式” 基于使用情况 “添加新路由时，使用 getServerSideProps 脚手架生成页面” 用户规则 “避免使用 any ；始终倾向于类型安全的方法”
7. 综合记忆层设计

### 方案对比分析

| 方案类型          | 实现复杂度 | 记忆持久性 | 跨应用支持 | 适用场景   |
| ------------- | ----- | ----- | ----- | ------ |
| System Prompt | 低     | 会话级   | 无     | 单次对话优化 |
| 项目规则文件        | 低     | 项目级   | 有限    | 代码项目   |
| RAG 检索        | 中     | 长期    | 有限    | 知识库查询  |
| Memory Bank   | 中     | 长期    | 中等    | 项目协作   |

## OpenAI memory

![](https://kingan-md-img.oss-cn-guangzhou.aliyuncs.com/blog/20250619135534312.png?x-oss-process=image/format,webp)

使用 ChatGPT 聊天时，您可以让它记住特定内容，也可以让它自己记住细节。ChatGPT 的记忆力会随着您使用次数的增加而增强，您会逐渐注意到它的进步。例如：

- 您曾解释过，您更喜欢会议记录底部有标题、要点和行动事项的摘要。ChatGPT 会记住这一点，并以这种方式回顾会议内容。
- 您告诉 ChatGPT 您经营着一家社区咖啡店。当您为庆祝新店开业的社交帖子集思广益时，ChatGPT 知道该从何入手。
- 你提到你有一个蹒跚学步的孩子，她喜欢水母。当你请求 ChatGPT 帮忙制作她的生日贺卡时，它建议你画一只戴着派对帽的水母。
- 作为一名拥有 25 名学生的幼儿园老师，您更喜欢 50 分钟的课程，并安排后续活动。ChatGPT 会在帮助您制定课程计划时记住这一点。

它会根据之前的聊天提供后续信息，比如 “你想让我用 XML 来呈现它吗？” 还有一次，它问 “你想让我把它转换成 JSON 吗？”

✨ 手动操作记忆 - 文档内视频

[OpenAI memory - 2024 年 2 月](https://openai.com/index/memory-and-new-controls-for-chatgpt/)
一开始是自动提取记忆，和手动操作记忆，称为 “长期记忆”

最近提供了记忆近期聊天内容，称为 “短期记忆”，不会提取内容记忆，而是强记忆近期内容，时间到了就丢弃

> 2025 年 6 月 3 日更新：免费用户将开始享受记忆功能改进。除了之前保存的记忆之外，ChatGPT 现在还会参考您最近的对话，以提供更个性化的回复。

![](https://kingan-md-img.oss-cn-guangzhou.aliyuncs.com/blog/20250619111429246.png?x-oss-process=image/format,webp)

[x.com](https://x.com/OpenAI/status/1910378768172212636)

隐私问题，“我有一个朋友”

## Cursor memories

[cursor 1.0 2025-6-4 changelog](https://www.cursor.com/cn/changelog)

## Memory Bank

[Cursor Memory Bank rules](https://gist.github.com/ipenywis/1bdb541c3a612dbac4a14e1e3f4341ab)

Memory Bank 是一种结构化的记忆管理方案，通过维护多个上下文文件来实现持久化记忆。

### 核心文件结构

```
project-memory/
├── projectbrief.md      # 项目基础文档
├── productContext.md    # 产品背景和目标
├── activeContext.md     # 当前工作焦点
├── systemPatterns.md    # 技术架构决策
├── techContext.md       # 技术栈和约束
└── progress.md         # 进展跟踪
```

1. projectbrief.md
   ▫ 项目基础文档，定义核心需求和目标，是所有其他文件的基础和项目范围的 “事实来源”。
2. productContext.md
   ▫ 说明项目存在的原因、要解决的问题、工作方式和用户体验目标，聚焦 “为什么做”。
3. activeContext.md
   ▫ 记录当前的工作重点、最近的变更、下一步计划和活跃决策，反映项目的实时动态。
4. systemPatterns.md
   ▫ 描述系统架构、关键技术决策、采用的设计模式和组件关系，帮助理解整体技术方案。
5. techContext.md
   ▫ 记录所用技术、开发环境、技术约束和依赖，便于开发和维护。
6. progress.md
   ▫ 跟踪项目进展，包括已完成内容、待开发部分、当前状态和已知问题，是进度管理的核心。

文件之间的关系:

- projectbrief.md 是所有文件的起点，决定项目的整体方向。
- productContext.md、systemPatterns.md、techContext.md 分别从产品、架构和技术层面补充细节。
- activeContext.md 汇总上述文件的当前焦点，指导日常工作。
- progress.md 记录实际进展，与 activeContext.md 共同反映项目现状。

这些文件共同构成 Memory Bank 的知识体系，确保每次 “记忆重置” 后都能快速恢复项目全貌，支持高效协作和持续演进

## Mem0/openmemory

[playground](https://mem0.dev/demo)

[openmemory dashboard](https://app.openmemory.dev/memories?page=1\&size=10)

👇 增加记忆
![](https://kingan-md-img.oss-cn-guangzhou.aliyuncs.com/blog/20250619152132459.png?x-oss-process=image/format,webp)

👇 列出记忆
![](https://kingan-md-img.oss-cn-guangzhou.aliyuncs.com/blog/20250619152339613.png?x-oss-process=image/format,webp)

👇 查找记忆回答问题
![](https://kingan-md-img.oss-cn-guangzhou.aliyuncs.com/blog/20250619152837508.png?x-oss-process=image/format,webp/resize,w_640)

典型使用场景 (Use Cases)

[deepwiki](https://deepwiki.com/mem0ai/mem0/1-overview)

![](https://kingan-md-img.oss-cn-guangzhou.aliyuncs.com/blog/20250619171456558.png?x-oss-process=image/format,webp)

- 在 Claude 中讨论了一个 API 设计，转到 Cursor 编码时，仍能访问设计细节、约束和需求。

### 源码

[mem0-ts github](https://github.com/mem0ai/mem0/tree/main/mem0-ts/src/oss)

[core 工厂](https://github.com/mem0ai/mem0/blob/main/mem0-ts/src/oss/src/utils/factory.ts)

## 四、实际应用场景与案例

### 4.1 跨 AI 应用的项目协作

**场景描述**：
在软件开发项目中，你可能需要在多个 AI 工具间切换：

- 在 Claude 中进行架构设计讨论
- 在 Cursor 中进行代码实现
- 在 ChatGPT 中进行代码审查

#### 数据清理策略

- 定期清理过期记忆
- 压缩重复信息
- 归档历史数据

## A-Mem

![](https://kingan-md-img.oss-cn-guangzhou.aliyuncs.com/blog/20250619171732922.png?x-oss-process=image/format,webp)

[A-Mem: Agentic Memory for LLM Agents - arxiv](https://arxiv.org/html/2502.12110?_immersive_translate_auto_translate=1)

## 总结

技术演进路径，从简单到复杂，LLM 记忆共享的技术方案可以分为以下几个层次：

```
基础层：System Prompt + 项目规则
 ↓
应用层：IDE Memory + RAG检索
 ↓
协议层：MCP (Model Context Protocol)
 ↓
架构层：Memory Bank + 向量数据库
 ↓
分布式层：跨平台记忆共享
```

background agent、A2A 都依赖于记忆共享

**参考资源**：

- [MCP 协议官方文档](https://modelcontextprotocol.io/)

- [Cursor Memory 功能说明](https://forum.cursor.com/t/0-51-memories-feature/98509)

- [Memory Bank 最佳实践](https://gist.github.com/ipenywis/1bdb541c3a612dbac4a14e1e3f4341ab)

- [mem0 开源项目](https://mem0.dev/)

- [help openai memory](https://help.openai.com/en/articles/8590148-memory-faq)

- [基于 LangGraph 多智能体框架的共享内存实现与探索](https://www.53ai.com/news/langchain/2025061673465.html)

- [A-Mem: Agentic Memory for LLM Agents - arxiv](https://arxiv.org/html/2502.12110?_immersive_translate_auto_translate=1)

- [【论文解读】A-MEM：面向 LLM Agent 的主动式记忆系统](https://zhuanlan.zhihu.com/p/1888290059859514793)
