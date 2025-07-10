以下是 OpenAI 平台文档左侧目录的中文翻译及结构说明，适合初学者快速了解。
[openai](https://platform.openai.com/docs/overview)

OpenAI 平台文档左侧目录（中文版）

- 入门
  - 概览
  - 快速开始
  - 开发库
- 核心概念
  - 文本与提示
  - 图像与视觉、音频与语音
  - 结构化输出（only json？）
  - 函数调用（多个并行）
- API 指南
  - 会话状态（多轮对话携带）
  - 流式传输（数据接口、生命周期type）
  - 文件输入
  - 后台模式
  - Webhooks
  - 批量处理
  - 推理
  - 深度研究
- 工具
  - 工具使用
  - 远程 MCP
  - 网络搜索
  - 文件搜索
  - 图像生成
  - 代码解释器
  - 计算机操作
- 智能体（Agents）
  - 构建智能体
  - 语音智能体
  - 智能体 SDK（TypeScript）
- 实时 API
  - 使用实时 API
  - 实时对话
  - 实时转录
  - 语音活动检测
- 模型优化
  - 概览
  - 评测（Evals）
  - 监督微调
  - 视觉微调
  - 直接偏好优化
  - 强化微调
  - 评分器
  - 蒸馏
- 专用模型
  - 图像生成、文本转语音、语音转文本
  - 向量嵌入
  - 内容审核
- Codex
  - Codex
  - 智能体联网
  - 本地 Shell 工具
  - Codex CLI
  - Codex 更新日志
- 最佳实践
  - 生产环境最佳实践
  - 安全最佳实践
  - 提示缓存
  - 预测输出
  - 推理最佳实践
  - 评测设计
  - 微调最佳实践
  - 强化微调用例
  - 模型选择
  - 延迟优化
  - 准确率优化
  - 高级用法
  - Responses 与 Chat Completions
  - 灵活处理
- 助手 API
  - 概览
  - 快速开始
  - 深入解析
  - 工具
  - 新功能
- 资源
  - 数据管理
  - 检索
  - 深度研究 MCP
  - ChatGPT Actions

- 整体结构分为“入门”、“核心概念”、“API 指南”、“工具”、“智能体”、“实时 API”、“模型优化”、“专用模型”、“Codex”、“最佳实践”、“助手 API”、“资源”等模块。
- 初学者建议从“入门”模块开始，了解平台基础和如何快速上手。
- “核心概念”帮助理解文本、图像、语音等 AI 能力的基本原理。
- “API 指南”与“工具”模块适合开发者查阅具体用法和集成方法。
- “最佳实践”与“资源”模块提供了安全、优化、合规等方面的建议和支持。
- 其余模块如“模型优化”、“专用模型”、“Codex”等适合有一定基础后深入学习和扩展。

不同 prompt 的定义，openai 文档介绍可以把系统提示词和用户提示词的关系理解为函数调用，用户提示词提供参数，系统提示词提供逻辑

```js
systemPrompt(userPrompt);
```

除了 userPrompt, openai 还有一个 assistantPrompt, 只多次对话由LLM产生的结果，也将作为有效的Prompt

```js
import OpenAI from "openai";

const openai = new OpenAI();

let history = [
  {
    role: "user",
    content: "tell me a joke",
  },
];

const response = await openai.responses.create({
  model: "gpt-4o-mini",
  input: history,
  store: true,
});
// 第一轮对话结束
console.log(response.output_text);

// Add the 第一轮对话 response to the history
history = [
  ...history,
  ...response.output.map((el) => {
    // TODO: Remove this step
    delete el.id;
    return el; // role 将会是 assistant
  }),
];

// 开始第二轮对话
history.push({
  role: "user",
  content: "tell me another",
});

const secondResponse = await openai.responses.create({
  model: "gpt-4o-mini",
  input: history,
  store: true,
});

console.log(secondResponse.output_text);
```

👇 openai 内置通过对话id处理携带多轮对话内容，`previous_response_id`（包含input 和 output） 等同于上面手动 push inputs

> 本质上是由openai调用云端的对话内容来 push inputs，传入 LLM 的 context 还是完整的(收费)

```js
import OpenAI from "openai";

const openai = new OpenAI();

const response = await openai.responses.create({
  model: "gpt-4o-mini",
  input: "tell me a joke",
  store: true,
});

console.log(response.output_text);

const secondResponse = await openai.responses.create({
  model: "gpt-4o-mini",
  previous_response_id: response.id, // 等同于 push inputs
  input: [{ role: "user", content: "explain why this is funny." }],
  store: true,
});

console.log(secondResponse.output_text);
```

Funtion Call

myServer -> LLM -> myServer -> otherServer -> myServer -> LLM

使用 JSON schema 定义function如何被调用，作用、入参、枚举 ...🤔 应该有根据ts类型定义或者根据函数代码生成 JSON schema的定制 LLM(callback 到 结构化输出的章节)

LLM 可以吐出多个 function call 的调用参数，myServer 需要遍历这些结果，逐个调用function，并把结果推入下一次的inputs

👇 并行执行器

```js
// for of 语法
for (const toolCall of response.output) {
  const { type, name, arguments, call_id } = toolCall;
  if (type !== "function_call") {
    continue;
  }

  const args = JSON.parse(arguments);

  const result = callFunction(name, args);
  input.push({
    type: "function_call_output",
    call_id,
    output: result.toString(),
  });
}
```

👇 调试时打印流，使用 for await of 语法，每次循环会等待（`await`）下一个异步结果返回

```js
const finalToolCalls = {};

for await (const event of stream) {
  const { type, item, output_index, delta } = event;
  if (type === "response.output_item.added") {
    finalToolCalls[output_index] = item;
  } else if (type === "response.function_call_arguments.delta") {
    // 流式拼接 function call 的参数
    if (finalToolCalls[output_index]) {
      finalToolCalls[output_index].arguments += delta;
    }
  }
}
```
