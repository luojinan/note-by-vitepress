# Agents

Agent 只是一个后面出来的名词，其实就是一开始说的垂类LLM（通过prompt、tools、微调）定制后的一个应用/工具

另外，早期就出名的n8n、coze这些拉线连接LLM的自动化flower就是低代码实现Agents的过程，产物就是一个Agent，而现在技术成熟之后，开发应该了解如何通过代码实现Agent，相关的主要步骤会和拉线相似

另外menus那些是早期的，多agent

无论单agent、多agent 都需要支持有多个LLMs(而不是固定一个LLM一个prompt)自动多轮执行直到得到满意的输出

相关文档(🤮怎么都这么喜欢发pdf)：

- [《A practical guide to building agents》pdf- OpenAI](https://cdn.openai.com/business-guides-and-resources/a-practical-guide-to-building-agents.pdf)
- [《Building effective agents》 - Claude](https://www.anthropic.com/engineering/building-effective-agents)
- [some sample implementations - Claude](https://github.com/anthropics/anthropic-cookbook/tree/main/patterns/agents)
- [《Agents Companion》pdf- Google](https://www.kaggle.com/whitepaper-agent-companion)

[OpenAI构建智能体的实用指南中文翻译](https://lewlh.github.io/2025/04/22/APracticalGuideToBuildingAgents/)

智能体 对标 自动化/工作流workflows

智能体具有以下核心特性，使其能够可靠且一致地代表用户采取行动：

1. 它利用大型语言模型来管理工作流程的执行和决策。它能够识别工作流程何时完成，并在需要时主动纠正其行为。如果执行失败，它可以暂停操作并将控制权交还给用户。
2. 它可以访问多种工具以与外部系统交互——既用于收集上下文信息，也用于执行操作——并根据工作流程的当前状态动态选择合适的工具，同时始终在明确定义的防护边界内运行。

与传统的自动化不同，智能体特别适合那些传统确定性、基于规则的方法难以胜任的工作流程。

考虑智能体而非自动化的场景是：此前难以实现自动化的工作流程，尤其是传统方法遇到阻碍的场景：

- 复杂决策： 涉及细致、上下文敏感决策的工作流程，例如客户服务中的退款审批。
- 难以维护的规则集： 由于规则集过于庞大和复杂而变得难以管理，更新成本高或易出错的系统，例如进行供应商安全审查。
- 高度依赖非结构化数据： 涉及解读自然语言、从文档中提取意义或与用户进行对话式交互的场景，例如处理家庭保险索赔。

Claude 用代理系统包括agent和workflows

agentic systems：

- Workflows are systems where LLMs and tools are orchestrated through predefined code paths.
  - orchestrated through 协调 LLM and tools
  - workflows offer predictability and consistency for well-defined tasks
  - 提供 可预测和一致性给 定义明确的tasks
- Agents are systems where LLMs dynamically direct their own processes and tool usage, maintaining control over how they accomplish tasks.
  - LLM 自身控制自己行为和工具使用
  - flexibility and model-driven decision-making are needed at scale
  - 灵活 and 模型驱动 决策 at 大规模

optimizing single LLM calls with retrieval and in-context examples is usually enough.
优化 singke LLM 调用 with 检索 and 上下文示例 is usually enough

## code a simple agent

从代码上看一个agent的基础结构是：

```py
weather_agent = Agent(
  name = "Weather agent",
  instructions =
    "You are a helpful agent who can talk to users about the weather.",
  tools = [get_weather],
);
```

1. 模型： 驱动智能体推理和决策的大型语言模型（LLM）。
2. 工具： 智能体可以用来执行操作的外部函数或API。
3. 指令/系统提示词： 定义智能体行为的明确指导方针和防护边界。

总体来说，智能体需要以下三类工具：

| 类型         | 描述                                                                           | 例子                                                                |
| ------------ | ------------------------------------------------------------------------------ | ------------------------------------------------------------------- |
| 信息检索工具 | 使智能体能够获取执行工作流程所需的上下文和信息。                               | 示例：查询交易数据库或CRM系统、读取PDF文档、搜索网页。              |
| 执行工具     | 使智能体能够与系统交互以执行操作，例如向数据库添加新信息、更新记录或发送消息。 | 示例：发送电子邮件和短信、更新CRM记录、将客户服务工单移交人类处理。 |
| 编排工具     | 智能体本身可以作为其他智能体的工具——参见“编排”部分中的管理者模式。             | 示例：退款智能体、研究智能体、写作智能体。                          |

```py
from import agents Agent, WebSearchTool, function_tool

@function_tool
def save_results(output):
    db.insert({ : output, : datetime.time()})
    return "File saved"

search_agent = Agent(
  name="Search agent",
  instructions="Help the user search the internet and save results if asked.",
  tools=[WebSearchTool(), save_results],
)
```

tools：WebSearchTool（信息检索工具）、save_results（执行工具）

🤔 编排工具为多agent沟通调起的工具？

编排工具都需要一个“运行”（run）的概念，通常实现为一个循环，让智能体持续运行直到满足退出条件。常见的退出条件包括调用了工具、产生了特定结构化输出、遇到错误，或达到最大轮次限制。

```py
Agents.run(agent, [UserMessage("What's the capital of the USA?")])
```

这种“while循环”的概念是智能体运行的核心。在多智能体系统中（接下来会介绍），可以有一系列工具调用和智能体之间的交接，但仍允许模型运行多个步骤直到满足退出条件。

单agent的复杂条件逻辑都依赖prompt

在不切换到多智能体框架的情况下管理复杂性的有效策略是使用提示模板。与其为不同用例维护大量单独的提示，不如使用一个灵活的基础提示模板，接受策略变量。这种模板方法易于适应各种情境，大大简化了维护和评估。当出现新用例时，只需更新变量，而无需重写整个工作流程。

当prompt复杂和tools复杂时，一个agent的处理会不受控制，降智，此时需要拆解功能让多agent来协同处理

- 复杂逻辑：当提示包含许多条件语句（多个if-then-else分支），且提示模板难以扩展时，考虑将每个逻辑段分配给单独的智能体。
- 工具过载：问题不仅在于工具的数量，还在于工具的相似性或重叠。一些实现成功管理了超过15个定义清晰、互不重叠的工具，而其他实现可能在不到10个重叠工具时就出现问题。如果通过提供描述性名称、清晰参数和详细描述来改善工具清晰度后性能仍未提升，则考虑使用多个智能体。

多agent 分为：

- 管理者模式（智能体作为工具） 一个中央“管理者”智能体通过工具调用协调多个专门的智能体，每个智能体负责特定任务或领域。
  - 管理者不会丢失上下文或控制权，而是智能地将任务在适当的时间委托给合适的智能体，并将结果整合为一个连贯的交互。这确保了流畅、统一的体验，同时按需提供专业化的能力。
- 去中心化模式（智能体间任务交接） 多个智能体作为对等方运行，根据各自的专业领域相互交接任务。
  - 交接是一种单向转移，允许一个智能体将任务委托给另一个智能体。在智能体SDK中，交接是一种工具或函数。如果一个智能体调用了交接函数，我们会立即开始在被交接的新智能体上执行，同时转移最新的对话状态。

多智能体系统可以建模为图结构，其中智能体表示为节点。在管理者模式中，边表示工具调用；在去中心化模式中，边表示智能体之间的执行交接。

👇 就是把其他agent放到管理者的tools里

```py
rom import agents Agent, Runner

manager_agent = Agent(
  name="manager_agent",
  instructions=(
    "You are a translation agent. You use the tools given to you to translate."
    "If asked for multiple translations, you call the relevant tools."
  ),
  tools=[
    spanish_agent.as_tool(
      tool_name="translate_to_spanish",
      tool_description="Translate the user's message to Spanish",
    ),
    french_agent.as_tool(
      tool_name="translate_to_french",
      tool_description="Translate the user's message to French",
    ),
    italian_agent.as_tool(
      tool_name="translate_to_italian",
      tool_description="Translate the user's message to Italian",
    ),
  ]
)

async def main():
  msg = input("Translate 'hello' to Spanish, French and Italian for me!")

  orchestrator_output = await Runner.run(
    manager_agent,msg
  )

  for message orchestrator_output.new_messages:
    print(f"  - Translation step: {message.content}")
```

👇 去中心化，初始用户消息被发送到 triage_agent。识别出输入与最近的购买相关后，triage_agent 会调用交接函数，将控制权转移给 order_management_agent。

代码上合理 触发器 和 管理者 有点相似，多个agent则放到交接函数 handoffs 里而不是 tools 里

```py
from import agents Agent, Runner

technical_support_agent = Agent(
  name="Technical Support Agent",
  instructions=(
    "You provide expert assistance with resolving technical issues, system outages, or product troubleshooting."
  ),
  tools[search_knowledge_base]
)

sales_assistant_agent = Agent(
  name="Sales Assistant Agent",
  instructions=(
    "You help enterprise clients browse the product catalog, recommend suitable solutions, and facilitate purchase transactions."
  ),
  tools[initiate_purchase_order]
)

order_management_agent = Agent(
  name="Order Management Agent",
  instructions=(
    "You assist clients with inquiries regarding order tracking, delivery schedules, and processing returns or refunds."
  ),
  tools[track_order_status, initiate_refund_process]
)

triage_agent = Agent(
  name="Triage Agent",
  instructions=(
    "You act as the first point of contact, assessing customer queries and directing them promptly to the correct specialized agent."
  ),
  handoffs[technical_support_agent, sales_assistant_agent, order_management_agent],
)

await Runner.run(
  triage_agent,
  input("Could you please provide an update on the delivery timeline for our recent purchase?")
)
```

这种模式特别适用于类似对话分流的场景，或者当您希望专门的智能体完全接管某些任务而无需原始智能体继续参与时。可选地，您可以为第二个智能体配备一个返回交接功能，允许其在必要时将控制权再次转移回原始智能体。

防护措施
![](https://kingan-md-img.oss-cn-guangzhou.aliyuncs.com/blog/20250702154258763.png?x-oss-process=image/format,webp/resize,w_640)

```py
from import(
  Agent,
  GuardrailFunctionOutput,
  InputGuardrailTripwireTriggered,
  RunContextWrapper,
  Runner,
  TResponseInputItem,
  input_guardrail,
  Guardrail,
  GuardrailTripwireTriggered
)
from import pydantic BaseModel

class ChurnDetectionOutput(BaseModel):
  is_churn_risk: bool
  reasoning: str

churn_detection_agent = Agent(
  name="Churn Detection Agent",
  instructions="Identify if the user message indicates a potential customer churn risk.",
  output_type=ChurnDetectionOutput,
)

@input_guardrail
async def churn_detection_tripwire(
  ctx: RunContextWrapper[None], aglist[TResponseInputItem]
) -> GuardrailFunctionOutput:
  result = Runner.run(churn_detection_agent, input, context=ctx.context)

  return GuardrailFunctionOutput(
    output_info=result.final_output,
    tripwire_triggered=result.final_output.is_churn_risk,
  )

customer_support_agent = Agent(
  name="Customer support agent",
  instructions="You are a customer support agent. You help customers with their questions.",
  input_guardrails=[
    Guardrail(guardrail_function=churn_detection_tripwire),
  ],
)

async def main():
  # This should be ok
  await Runner.run(customer_support_agent, "Hello!")
  print("Hello message passed")

  # This should trip the guardrail
  try:
    await Runner.run(agent,"I think I might cancel my subscription")
    print("Guardrail didn't trip - this is unexpected")
  except GuardrailTripwireTriggered:
    print("Churn detection guardrail tripped")
```

## Building Blocks & Workflows

### The augmented LLM

Claude 的建议是逐步增强你的LLM得到 augmented LLM，而不是直接用agent

如你有一个LLM，此时可以通过 内置的增强函数，such as retrieval, tools（mcp）, and memor 得到一个够用的AI(也会被作为后续agent的最小构建单元？称为 Building block)

![](https://kingan-md-img.oss-cn-guangzhou.aliyuncs.com/blog/20250702172800441.png?x-oss-process=image/format,webp/resize,w_640)

### Prompt chaining

提示链，拆解任务后再逐步执行，这里可以只用单个 augmented LLM 多轮执行

![](https://kingan-md-img.oss-cn-guangzhou.aliyuncs.com/blog/20250702174040865.png?x-oss-process=image/format,webp/resize,w_640)

Gate 是门 programmatic checks，可以手动加在任一次轮位置

简化每次 LLM 调用，以降低延迟并提高准确率。
Examples where prompt chaining is useful:
提示链有用的示例：

Generating Marketing copy, then translating it into a different language.
生成营销文案，然后将其翻译成不同的语言。
Writing an outline of a document, checking that the outline meets certain criteria, then writing the document based on the outline.
撰写文档大纲，检查大纲是否符合某些标准，然后根据大纲撰写文档。

### router

Prompt if else 🤔?

![](https://kingan-md-img.oss-cn-guangzhou.aliyuncs.com/blog/20250702190433290.png?x-oss-process=image/format,webp/resize,w_640)

Directing different types of customer service queries (general questions, refund requests, technical support) into different downstream processes, prompts, and tools.
将不同类型的客户服务查询（一般问题、退款请求、技术支持）引导到不同的下游流程、提示和工具中。
Routing easy/common questions to smaller models like Claude 3.5 Haiku and hard/unusual questions to more capable models like Claude 3.5 Sonnet to optimize cost and speed.
将简单/常见问题路由到较小的模型（如 Claude 3.5 Haiku），将困难/不寻常的问题路由到功能更强大的模型（如 Claude 3.5 Sonnet），以优化成本和速度。

### Parallelization

Sectioning: Breaking a task into independent subtasks run in parallel.
分段 ：将任务分解为并行运行的独立子任务。
Voting: Running the same task multiple times to get diverse outputs.
投票： 多次运行相同的任务以获得不同的输出。

![](https://kingan-md-img.oss-cn-guangzhou.aliyuncs.com/blog/20250702203955680.png?x-oss-process=image/format,webp/resize,w_640)

- Sectioning:
  - Implementing guardrails where one model instance processes user queries while another screens them for inappropriate content or requests. This tends to perform better than having the same LLM call handle both guardrails and the core response.
  - 实现防护机制，其中一个模型实例处理用户查询，而另一个模型实例则筛选不适当的内容或请求。这通常比使用同一个 LLM 调用同时处理防护机制和核心响应效果更好。
  - Automating evals for evaluating LLM performance, where each LLM call evaluates a different aspect of the model’s performance on a given prompt.
  - 自动评估 LLM 性能，其中每次 LLM 调用都会评估模型在给定提示上性能的不同方面。
- Voting:
  - Reviewing a piece of code for vulnerabilities, where several different prompts review and flag the code if they find a problem.
  - 审查一段代码是否存在漏洞，如果发现问题，几个不同的提示会审查并标记代码。
  - Evaluating whether a given piece of content is inappropriate, with multiple prompts evaluating different aspects or requiring different vote thresholds to balance false positives and negatives.
  - 评估给定的内容是否不适当，使用多个提示评估不同的方面或要求不同的投票阈值来平衡误报和误报。

### Orchestrator-workers

![](https://kingan-md-img.oss-cn-guangzhou.aliyuncs.com/blog/20250702204433082.png?x-oss-process=image/format,webp/resize,w_640)

在协调器-工作者工作流中，中央 LLM 动态分解任务，将其委托给工作者 LLM，并综合其结果。

无法通过程序拆解子任务的功能

Coding products that make complex changes to multiple files each time.
每次对多个文件进行复杂更改的编码产品。
Search tasks that involve gathering and analyzing information from multiple sources for possible relevant information.
搜索任务涉及从多个来源收集和分析信息以获取可能相关的信息。

### Evaluator-optimizer

![](https://kingan-md-img.oss-cn-guangzhou.aliyuncs.com/blog/20250702204710193.png?x-oss-process=image/format,webp/resize,w_640)

When to use this workflow: This workflow is particularly effective when we have clear evaluation criteria, and when iterative refinement provides measurable value. The two signs of good fit are, first, that LLM responses can be demonstrably improved when a human articulates their feedback; and second, that the LLM can provide such feedback. This is analogous to the iterative writing process a human writer might go through when producing a polished document.
何时使用此工作流程： 当我们拥有清晰的评估标准，并且迭代改进能够提供可衡量的价值时，此工作流程尤其有效。良好契合的两个标志是：首先，当人类清晰地表达反馈时，LLM 的答案可以得到显著的改进；其次，LLM 能够提供这样的反馈。这类似于人类作家在撰写一篇精良文档时可能经历的迭代写作过程。

Examples where evaluator-optimizer is useful:

Literary translation where there are nuances that the translator LLM might not capture initially, but where an evaluator LLM can provide useful critiques.
文学翻译中存在一些细微差别，翻译人员（法学硕士）最初可能无法捕捉到，但评估人员（法学硕士）可以提供有用的批评。
Complex search tasks that require multiple rounds of searching and analysis to gather comprehensive information, where the evaluator decides whether further searches are warranted.
复杂的搜索任务需要多轮搜索和分析才能收集全面的信息，评估人员将决定是否需要进一步搜索。

## ✨ Agents

代理可以处理复杂的任务，但它们的实现通常很简单。它们通常只是基于环境反馈循环使用工具的 LLM。因此，清晰周到地设计工具集及其文档至关重要。我们将在附录 2（“快速设计你的工具”）中详细阐述工具开发的最佳实践。

环境感知就是结合所有上下文、工具之后，LLM对当前任务进度的理解能力，所以如何提升环境感知是抽象且关键的

![](https://kingan-md-img.oss-cn-guangzhou.aliyuncs.com/blog/20250702205531132.png?x-oss-process=image/format,webp/resize,w_640)

![](https://kingan-md-img.oss-cn-guangzhou.aliyuncs.com/blog/20250704135043592.png?x-oss-process=image/format,webp/resize,w_640)

Agent 和 workflow 在实现流程上表面相似，但核心区别在于“自主决策”与“流程预设”。

核心区别解析

1. 决策方式不同
   • Workflow（工作流）：每一步骤和工具调用都由开发者预先定义，流程是固定的。LLM 只在指定节点处理任务，无法改变流程顺序或内容。
   • Agent（代理）：每一步由 LLM 根据当前环境和目标自主决定下一步行动。流程不是预设的，而是动态生成的，LLM 可以根据反馈灵活调整策略和调用工具。

2. 具体实现对比
   | 特点 | Workflow（工作流） | Agent（代理） |
   | ------------ | ----------------------------------- | --------------------------------------- |
   | 流程控制 | 由开发者预设，固定顺序 | 由 LLM 动态决策，顺序可变 |
   | 工具调用 | 固定节点调用指定工具 | LLM 根据需要自主选择和调用工具 |
   | 反馈处理 | 仅在预设节点处理 | 每一步都可根据环境反馈调整策略 |
   | 终止条件 | 通常流程结束即终止 | LLM 判断是否完成，或遇到终止条件 |
   | 适用任务 | 明确、结构化、可分解 | 开放、复杂、需多轮推理 |

3. 伪代码对比

Workflow 示例

```py
# 固定流程
step1_result = llm_step1(input)
step2_result = llm_step2(step1_result)
final_result = llm_step3(step2_result)
```

Agent 示例

```py
# 动态决策
state = initial_state(input)
while not agent.done(state):
    action = llm_decide_next_action(state)
    result = agent.execute(action)
    state = agent.update_state(state, result)
```
