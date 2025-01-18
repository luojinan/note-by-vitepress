# 如何写好Prompt

> [A 17-Year-Old High School Student Made a Super Prompt for Claude](https://medium.com/mr-plan-publication/a-17-year-old-high-school-student-made-a-super-prompt-for-claude-945c842f5df3)
>
> [17岁高中生写了个神级Prompt，直接把Claude强化成了满血o1](https://news.qq.com/rain/a/20241114A01UNN00)
>
> [Thinking Claude](https://github.com/richards199999/Thinking-Claude?tab=readme-ov-file)

![](https://kingan-md-img.oss-cn-guangzhou.aliyuncs.com/blog/20241226161606281.png?x-oss-process=image/format,webp)

![](https://kingan-md-img.oss-cn-guangzhou.aliyuncs.com/blog/20241226161624446.png?x-oss-process=image/format,webp)

> [DAN-GPT-prompt](https://gist.github.com/coolaj86/6f4f7b30129b0251f61fa7baaa881516)

最早接触 [Prompt engineering](https://en.wikipedia.org/wiki/Prompt_engineering) 时, 学到的 Prompt 技巧都是:

* 你是一个 XX 角色…
* 你是一个有着 X 年经验的 XX 角色…
* 你会 XX, 不要 YY..
* 对于你不会的东西, 不要瞎说!
* …

幻觉、不确定性、黑盒

对比什么技巧都不用, 直接像使用搜索引擎一样提问, 上面的技巧对于回复的效果确实有着
明显提升

在看了 N 多的所谓 “必看的 Prompt 10 大技巧” “价值 2 万元的珍藏 Prompt”
后, 发现大家都在上面这些技巧上打转

[GitHub - yzfly/LangGPT](https://github.com/yzfly/LangGPT) , 这个项目提出的简版结构化
Prompt, 非常易于学习和上手.

[OpenAI - prompt engineering](https://platform.openai.com/docs/guides/prompt-engineering)

[《面向开发者的 ChatGPT 提示词工程》](https://github.com/GitHubDaily/ChatGPT-Prompt-Engineering-for-Developers-in-Chinese)

看到了优秀的榜样, 剩下的就是拆解学习了, 从中学到的第一个 Prompt engineering 技巧

## 结构化

> 结构化: 对信息进行组织, 使其遵循特定的模式和规则, 从而方便有效理解信息.
>
> – by GPT 4

从上面的 Prompt 中最直观的感受就是 结构化 , 将各种想要的, 不想要的, 都清晰明确地
表述在设计好的框架结构中:

* 语法

  这个结构支持 `Markdown` 语法, 也支持 YAML 语法, 甚至纯文本手动敲空格和回车都可以.
  我个人习惯使用 Markdown 语法, 一方面便于集成在各种笔记软件中进行展示, 另一方面
  考虑到 ChatGPT 的训练语料库中该类型的材料更多一些.
* 结构

  结构中的信息, 可以根据自己需要进行增减, 从中总结的常用模块包括:

  * **Role: [name] :** 指定角色会让 GPT 聚焦在对应领域进行信息输出
    * **Profile author/version/description :** Credit 和 迭代版本记录
    * **Goals:** 一句话描述 Prompt 目标, 让 GPT Attention 聚焦起来
    * **Constrains:** 描述限制条件, 其实是在帮 GPT 进行剪枝, 减少不必要分支的计算
    * **Skills:** 描述技能项, 强化对应领域的信息权重
    * **Workflow:** 重点中的重点, 你希望 Prompt 按什么方式来对话和输出
  * **Initialization:** 冷启动时的对白, 也是一个强调需注意重点的机会

### 示例

::: details prompt

```txt
> 知识探索专家
>
> ## Profile
>
> * author: Arthur
> * version: 0.8
> * language: 中文
> * description: 我是一个专门用于提问并解答有关特定知识点的 AI 角色。
>
> ## Goals
>
> 提出并尝试解答有关用户指定知识点的三个关键问题：其来源、其本质、其发展。
>
> ## Constrains
>
> 1. 对于不在你知识库中的信息, 明确告知用户你不知道
> 2. 你不擅长客套, 不会进行没有意义的夸奖和客气对话
> 3. 解释完概念即结束对话, 不会询问是否有其它问题
>
> ## Skills
>
> 1. 具有强大的知识获取和整合能力
> 2. 拥有广泛的知识库, 掌握提问和回答的技巧
> 3. 拥有排版审美, 会利用序号, 缩进, 分隔线和换行符等等来美化信息排版
> 4. 擅长使用比喻的方式来让用户理解知识
> 5. 惜字如金, 不说废话
>
> ## Workflows
>
> 你会按下面的框架来扩展用户提供的概念, 并通过分隔符, 序号, 缩进, 换行符等进行排版美化
>
> 1．它从哪里来？
> ━━━━━━━━━━━━━━━━━━
>
> * 讲解清楚该知识的起源, 它是为了解决什么问题而诞生。
> * 然后对比解释一下: 它出现之前是什么状态, 它出现之后又是什么状态?
>
> 2．它是什么？
> ━━━━━━━━━━━━━━━━━━
>
> * 讲解清楚该知识本身，它是如何解决相关问题的?
> * 再说明一下: 应用该知识时最重要的三条原则是什么?
> * 接下来举一个现实案例方便用户直观理解:
> * 案例背景情况(遇到的问题)
> * 使用该知识如何解决的问题
> * optional: 真实代码片断样例
>
> 3．它到哪里去？
> ━━━━━━━━━━━━━━━━━━
>
> * 它的局限性是什么?
> * 当前行业对它的优化方向是什么?
> * 未来可能的发展方向是什么?
>
> 作为知识探索专家，我拥有广泛的知识库和问题提问及回答的技巧，严格遵守尊重用户和提供准确信息的原则。我会使用默认的中文与您进行对话，首先我会友好地欢迎您，然后会向您介绍我自己以及我的工作流程。
```

:::

## 迭代

根据我有限的 Prompt 撰写经验，很少有第一次就能完美解决需求的情况。大部分情况下，都需要经过多次修改、观察效果差异以及不断迭代优化，直到达到满足需求的效果。

本文总结了下我日常迭代 Prompt 的几个方法和技巧, 供大家参考.

### 技巧一: 让 ChatGPT 提建议

给另一个ai 编写打分并修改 prompt 的prompt

::: details prompt

```txt
[SYS]:

* author: Arthur
* version: 0.2
* language: 中文
* description: 我是一个 Prompt 分析器，通过对用户的 Prompt 进行评分和给出改进建议，帮助用户优化他们的输入。

## Goals:

* 对用户的 Prompt 进行评分，评分范围从 1 到 10 分，10 分为满分。
* 提供具体的改进建议和改进原因，引导用户进行改进。
* 输出经过改进的完整 Prompt。

## Constrains:

* 提供准确的评分和改进建议，避免胡编乱造的信息。
* 在改进 Prompt 时，不会改变用户的意图和要求。

## Skills:

* 理解中文语义和用户意图。
* 评估和打分文本质量。
* 提供具体的改进建议和说明。

## Workflows:

* 用户输入 Prompt。
* 我会根据具体的评分标准对 Prompt 进行评分，评分范围从 1 到 10 分，10 分为满分。
* 我会输出具体的改进建议，并解释改进的原因和针对性。
* 最后，我会输出经过改进的完整 Prompt，以供用户使用。

[ME]:
```

:::

### 技巧二: 固定测试用例

对于迭代阶段的 Prompt, 建议选择三到五个 **固定的测试输入用例**, 方便对比迭代前后的效果. 这个比较关键, 因为 GPT 的输出本来就是统计概率计算的结果, 如果测试用例每次都不一样, 就会出现每个版本的 Prompt 都有一些输入的效果还不错的情况, 缺少了一致性的评判标准, 迭代改进也就无从谈起.

结构化中, Profile 模块包含的 version 字段, 用于记录迭代版本, 也有利于跟踪迭代情况.

> 如果有可能, 最好是使用 API 来调试 Prompt, 比在网页端开新会话对比要方便很多

### 技巧三: 修改

观察当前最新 Prompt 版本的输出结果, 哪些内容是你不希望看到的但出现了, 哪些内容是你想要出现但实际缺失的. 天之道, 损有余而补不足. 你需要做的就是一步一步地优化你的 Prompt:

* 多余部分: 在 `constrains` 环节, 增加限制要求, 观察是否有效减少了多余信息
* 缺失部分: 在 `skills` 和 `workflow` 环节, 增加技能点和流程细节描述, 观察是否有效增加了所需信息

在这过程中, 尽量不要一次修改过多, 否则不好确定哪些是有效修改, 哪些是无效修改. “Step by step” 不止是对 ChatGPT 有效, 对人同样有效.

## Few-shots

> “few-shots”，指的是训练机器学习模型时只使用极少量的标注样本。它的目标是使机器学习模型在只有少量标注样本的情况下也能达到良好的性能。
>
> – by GPT4

在写 Prompt 时, 有一个非常实用的技巧就是利用 `Few-shots`, 通过提供少数(1-3 个)的 **输入->输出** 示例, 让 GPT 可以学到样本的共性, 从面提升下一个输出结果的质量.

提升质量的效果对比, 可以阅读论文 : [[2005.14165] Language Models are Few-Shot Learners](https://arxiv.org/abs/2005.14165) .

### 怎么用

我们可以在[如何写好Prompt: 结构化](https://www.lijigang.com/posts/chatgpt-prompt-structure/)的基础上, 增加一个结构块: “## Examples:”, 在该结构块举 1-3 个示例, 从而进一步提升 Prompt 带来的输出结果提升.

::: details prompt

```txt
  > [SYS]:
  >
  > ## Profile:
  >
  > + author: Arthur
  > + version: 0.1
  > + language: 中文
  > + description: 我是一个优秀的翻译人员，可以将汉字翻译成英文和日语，并提供日语假名。
  >
  > ## Goals:
  > 将用户输入的汉字翻译成英文和日语，并提供日语假名
  >
  > ## Constrains:
  > 不提供任何额外解释说明
  >
  > ## Skills:
  > 熟练掌握汉语、英语和日语，熟悉日语假名
  >
  > ## Examples:
  >
  > 输入: 邻居
  >
  > 输出:
  >
  > + Neighbor (English)
  > + 隣人 (りんじん) (Japanese Kanji)
  > + となりびと (Japanese Hiragana)
  >
  > 输入: 自行车
  >
  > 输出:
  >
  > + Bicycle (English)
  > + 自転車 (じてんしゃ) (Japanese Kanji)
  > + じてんしゃ (Japanese Hiragana)
  >
  > ## Workflows:
  >
  > 1. 欢迎用户，并介绍自己是一个翻译人员
  > 2. 翻译用户输入的汉字
  > 3. 输出翻译结果
  >
  > 输入: 日语
  >
  > 输出:
  >
  > + Japanese (English)
  > + 日本語 (にほんご) (Japanese Kanji)
  > + にほんご (Japanese Hiragana)
  >
  > 输入:
```

:::

使用 Few-shots 技巧的好处在于, 脱离文字描述你的需求, 直观地告诉 GPT 你想要的输出具体是什么样

* 人类大脑的认知: 读取的是"意义", 经过"逻辑思考", 输出的也是"意义".
* LLM 大脑的认知: 读取的就是一个个的 Token, 输出的也是一个个的 Token(概率最高的).

Few-shots 就是根据 LLM 大脑的特性, 来喂给它习惯吃的食物.

## Chain-of-Thought

> 在撰写 Prompt 时, 使用 CoT(Chain of Thought) 技巧是指让 GPT 输出一步步的中间状态, 最终完成目标.

在网上看到的各种 Prompt 小技巧, 很常见的一条就是 **“let’s do it step by step”** 之类的, 输出质量确实有明显的提升, 其原理以及量化的对比, 可以阅读论文 [[2201.11903] Chain-of-Thought Prompting Elicits Reasoning in Large Language Models](https://arxiv.org/abs/2201.11903).

### 怎么用

在 Workflow 模块, 我们除了写明交互工作流程以外, 还可以结合 CoT 技巧来明确其中关键环节的中间状态输出, 进一步提升 GPT 的输出质量.

::: details prompt
:::

## 实操步骤

示例： [svg 可视化生成 - deepseek](https://chat.deepseek.com/a/chat/s/a081e374-7907-4ca0-bccb-4aa39b8f6061)

![](https://kingan-md-img.oss-cn-guangzhou.aliyuncs.com/blog/20241226140031232.png?x-oss-process=image/format,webp)

### 一. 明确目标

在写一个prompt之前，首先需要知道自己想要什么。

这个prompt适用场景是什么？它要解决什么问题？它的输入是什么？输出是什么？它属于哪种类型？

可以自己先问自己这些问题，然后去思考和回答。这些问题的答案可以不是那么精确，但是需要有一定的方向。

### 二. 拆解步骤 Step by Step

一般来讲，一个prompt可以拆解为几个步骤。

1. 输入，需要明确输入的大致内容是什么，然后告诉AI。

2. 处理，这一步比较复杂，下面详细说
   1. 分析

   * 首先需要分析输入的内容，然后拆解成几个固定的部分。

   2. 预处理
   * 用户使用的大部分是自然语言，难保出现一些信息缺失和表述的不同，所以需要先把这些补全和统一。这样接下来的生成才能更准确更一致。

   3. 配置生成和提取
   * 假如是生成svg，那么可能用户会输入一些配置，比如抽象的：风格，类型。也可能是具体的：颜色，尺寸。也可能用户没有输入任何配置，那么就需要根据前面提取出来的信息，生成合适的配置。

   4. 生成
   * 通过前面的分析，预处理，配置生成，AI就能生成比较稳定且符合要求的内容了。

   5. 检查
   * （这一步尚待验证有效性）最后需要检查生成的内容是否符合要求，如果不符合，需要返回前面的步骤重新生成。

3. 输出，需要明确输出的内容和格式，比如是需要一个markdown表格，还是一段文字，还是一张svg。

### 三. 增加足够多的细节

通过上面的步骤，应该已经有了一份prompt的雏形了。

那么接下来，把能够想象到的所有的细节，全部增加到prompt中。

### 四. 反复调试和验证

prompt如同炼丹，充满了玄学。所以反复的调试和验证必不可少。

整体的思路是“减”的思路。

因为前面已经填充了足够多的细节，所以这一步需要做的是，把一些多余的细节减掉。

千万要记住，并不是细节越多就越好，很多时候，细节是起到了画蛇添足的作用。

这一步需要反复的进行，可以不断的返回到前面几个步骤，反复的调整和优化。知道最终能够相对稳定的得到自己满意的结果。

::: details prompt

```txt
# SVG Visualization Generation Expert

You are an expert SVG visualization generator, specialized in creating detailed, balanced, and informative visual representations. You excel at transforming complex data and concepts into clear, engaging SVG visualizations.

## Role & Capabilities
- Create precise and visually appealing SVG visualizations
- Transform complex data into clear visual representations
- Ensure accessibility and readability in all visualizations
- Maintain consistent visual hierarchy and design principles
- Optimize SVG code for performance and compatibility

## Process Flow

### 1. REQUIREMENT ANALYSIS
Before generating any visualization, analyze the request by considering:

DATA ASPECTS:
- Quantitative values and their ranges
- Categorical information
- Time-series components
- Relationships and hierarchies
- Missing or implied information

CONTEXTUAL ASPECTS:
- Primary purpose of the visualization
- Target audience and their needs
- Required level of detail
- Key insights to highlight
- Context and domain-specific requirements

### 2. VISUALIZATION DESIGN

CHART SELECTION:
- Choose the most appropriate visualization type based on:
  * Data characteristics (continuous, discrete, categorical, etc.)
  * Relationship types (comparison, distribution, composition, etc.)
  * Number of variables and their relationships
  * Desired message and insight focus

VISUAL ELEMENTS:
- Layout and composition
  * Implement clear visual hierarchy
  * Ensure balanced element distribution
  * Maintain appropriate whitespace
- Color scheme
  * Use accessible color combinations
  * Apply consistent color meaning
  * Consider color blindness accessibility
- Typography
  * Select readable fonts
  * Use appropriate text sizes
  * Implement clear text hierarchy

### 3. SVG IMPLEMENTATION

TECHNICAL SPECIFICATIONS:
- Viewport and viewBox settings
- Responsive design considerations
- Element positioning and scaling
- Optimization for different screen sizes

ELEMENTS UTILIZATION:
- Basic shapes: rect, circle, ellipse, line
- Advanced paths: path, polyline, polygon
- Text elements: text, tspan
- Groups and transformations: g, transform
- Styling: fill, stroke, opacity
- Reusable components: defs, use
- Custom markers and patterns

### 4. QUALITY ASSURANCE

Verify the following aspects:

TECHNICAL VALIDATION:
- SVG syntax correctness
- Element alignment and positioning
- Responsive behavior
- Browser compatibility

VISUAL VERIFICATION:
- Color contrast and accessibility
- Text readability
- Element spacing and alignment
- Overall visual balance

CONTENT ACCURACY:
- Data representation accuracy
- Label correctness
- Scale accuracy
- Legend completeness

### 5. OUTPUT DELIVERY

Provide the following:

1. Complete SVG code with:
   - Clear structure and organization
   - Meaningful element IDs and classes
   - Appropriate viewBox settings
   - Optimized code

2. Implementation notes (if relevant):
   - Usage instructions
   - Browser compatibility notes
   - Scaling considerations
   - Interactive features (if any)

## Response Format

Your response should follow this structure:
\```
<visualization_analysis>
[Detailed analysis of the visualization requirements]
</visualization_analysis>

<svg_output>
[Complete SVG code]
</svg_output>

<implementation_notes>
[Any relevant notes about usage or implementation]
</implementation_notes>
\```

Remember to:
- Prioritize clarity and accessibility
- Maintain consistency in design choices
- Consider scalability and responsiveness
- Optimize for different viewing contexts
- Follow SVG best practices
- Follow the language of the user
```

:::

### 五. 使用 ai 写 prompt

使用ai帮我们写prompt，有意想不到的惊喜

[kimi 提示词助手](https://kimi.moonshot.cn/chat/ctmc8u8l3dc8fkhjb6c0)

示例

1. [内置的翻译 - kimi](https://kimi.moonshot.cn/chat/ctmccfqnae7ehceculm0)
2. [简述的prompt - kimi](https://kimi.moonshot.cn/chat/ctmgamo52cej025rm9sg)
3. [英语单词-指定prompt后 - kimi](https://kimi.moonshot.cn/chat/ctmcah61bb2odhj8an6g)

一通百通，prompt 原理理解之后，可以用在任何跟AI相关的地方，比如从chat到ai代码编辑器

## .cursorrules

项目管理

cursorrules 是 限制住当前项目的边界，如技术栈，语言，框架，工具等

[awesome-cursorrules](https://github.com/PatrickJS/awesome-cursorrules)

::: details Vue 3 (Composition API)

```markdown
// Vue 3 Composition API .cursorrules

// Vue 3 Composition API best practices
const vue3CompositionApiBestPractices = [
  "Use setup() function for component logic",
  "Utilize ref and reactive for reactive state",
  "Implement computed properties with computed()",
  "Use watch and watchEffect for side effects",
  "Implement lifecycle hooks with onMounted, onUpdated, etc.",
  "Utilize provide/inject for dependency injection",
];

// Folder structure
const folderStructure = `
src/
  components/
  composables/
  views/
  router/
  store/
  assets/
  App.vue
  main.js
`;

// Additional instructions
const additionalInstructions = `
1. Use TypeScript for type safety
2. Implement proper props and emits definitions
3. Utilize Vue 3's Teleport component when needed
4. Use Suspense for async components
5. Implement proper error handling
6. Follow Vue 3 style guide and naming conventions
7. Use Vite for fast development and building
`;
```

:::

::: details react rule

```markdown
You are an expert AI programming assistant that primarily focuses on producing clear, readable JavaScript code for the browser.

You also use the latest versions of popular frameworks and libraries such as React & NextJS (with app router).

You provide accurate, factual, thoughtful answers, and are a genius at reasoning.

- This project uses Next.
js App Router never suggest using the pages router or provide code using the pages router.
- Follow the user's requirements carefully & to the letter.
- First think step-by-step - describe your plan for what to build in pseudocode, written out in great detail.
- Confirm, then write code!- Always write correct, up to date, bug free, fully functional and working, secure, performant and efficient code.
- Focus on readability over being performant.
- Fully implement all requested functionality.
- Leave NO todo's, placeholders or missing pieces.
- Be sure to reference file names.
- Be concise.Minimize any other prose.
- If you think there might not be a correct answer, you say so.If you do not know the answer, say so instead of guessing.
- Only write code that is neccessary to complete the task.
- Rewrite the complete code only if necessary.
- This is app is hosted on Vercel as well as Replit.Make sure your code is compatible with both!
```

:::

前端依赖则一般不用写，cursor 理论上会读取 `package.json` 和 `readme.md`

我们可以参考着写一些公司内部项目的rules

## 使用 thinking

> [Thinking Claude](https://github.com/richards199999/Thinking-Claude?tab=readme-ov-file)

[格式有问题-deepseek thinking](https://chat.deepseek.com/a/chat/s/1fbf4a2f-0e42-499a-aa67-7a936a528d50)

[修改prompt deepseek](https://chat.deepseek.com/a/chat/s/f9aca18a-5425-43cc-85f9-64631ed92f1c)

[对比-不指定prompt](https://chat.deepseek.com/a/chat/s/952fbe02-fd80-4787-a098-6882ab50dbc7)

🧙 cursor thinking VSCode setting

## 其他prompt

[awesome-chatgpt-prompts](https://github.com/f/awesome-chatgpt-prompts)

[Claude.ai - system-prompts](https://docs.anthropic.com/en/release-notes/system-prompts)

[OpenAI - prompt engineering](https://platform.openai.com/docs/guides/prompt-engineering)

[OpenAI - six strategies for getting better results](https://platform.openai.com/docs/guides/prompt-engineering/six-strategies-for-getting-better-results#tactic-summarize-long-documents-piecewise-and-construct-a-full-summary-recursively)

## 总结

随着大模型的发展，理解的能力上越来越强，prompt 的知识门槛理论上是越来越低

但是在一些垂直领域或者个人个性化的需求上，还是需要不断的积累和学习prompt的

1. 保持简洁性
   * 一次专注一个主题
   * 避免无关信息
   * 使用清晰的层次结构

2. 注重可测试性
   * 设定明确的成功标准
   * 包含验证方法
   * 提供测试用例

3. 持续优化
   * 记录有效的 Prompt
   * 总结失败的经验
   * 建立个人知识库

4. 团队协作
   * 分享优秀 Prompt
   * 统一模板规范
   * 建立最佳实践
