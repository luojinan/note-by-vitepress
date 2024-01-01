# Hooks 工作机制

[深入 React-Hooks 工作机制：“原则”的背后，是“原理”](https://github.com/luojinan/lagou-crawler/blob/b23f776d6d428f99073e8e4ec621453b5642f7fb/download/%E6%B7%B1%E5%85%A5%E6%B5%85%E5%87%BA%E6%90%9E%E5%AE%9A%20React/%E6%A8%A1%E5%9D%97%E4%BA%8C%EF%BC%9A%E5%88%A8%E6%A0%B9%E9%97%AE%E5%BA%95%E5%90%83%E9%80%8F%E2%80%9C%E6%A0%B8%E5%BF%83%E5%8E%9F%E7%90%86%E2%80%9D/08%20-%20%E6%B7%B1%E5%85%A5%20React-Hooks%20%E5%B7%A5%E4%BD%9C%E6%9C%BA%E5%88%B6%EF%BC%9A%E2%80%9C%E5%8E%9F%E5%88%99%E2%80%9D%E7%9A%84%E8%83%8C%E5%90%8E%EF%BC%8C%E6%98%AF%E2%80%9C%E5%8E%9F%E7%90%86%E2%80%9D.md)

很多教程讲解 `Hooks` 原理时都拿 `useState` 举例或自己实现一个 `useState`，但是经常发现理解了 `useState` 原理并不能解释其他的 `Hooks` 原理

此处，我们需要理解 `Hooks` 工作机制，并不等于具体的 `Hooks` 原理，我们需要理解在 React 函数组件中 `Hooks` 到底是怎么生效的

不建议对 `Fiber` 底层实现没有认知的前提下去和 `Hooks` 源码死磕。

✨ 重点理解：`Hooks` 触发函数组件重新渲染 的一些现象

> 为什么不能在循环、条件或嵌套函数中调用 `Hook` ?

## useState 这个 Hooks 的本质

因此，我们依然拿 `useState` 来介绍 `Hooks` 在函数组件中的工作机制。

首先我们的前置知识是 `useState` 的现象和原理，以此来看 `Hooks` 做了什么，注意，不是理解了 `useState` 就理解了 `Hooks` 的工作机制！

### useState 概念

```jsx
import { useState } from "react";

export default const MyComp = () => {
  const [name] = useState("我");
  const [age, setAge] = useState(1);

  console.log(`name: ${name}, age: ${age}`)

  // 编写 UI 逻辑
  return <div onClick={()=>setAge(2)}>不关心UI</div>
}
```

👆 通过查看控制台打印来查看 函数组件状态

- 组件初始化时打印 `name: 我, age: 1 `
- 点击触发更新状态时打印 `name: 我, age: 2 `

我们都知道 `函数组件` 通过 **整个函数重新执行** 来达到更新 UI 的效果

而 `useState` 所做的事情本质就是

1. 更新变量状态
2. 触发函数组件重新渲染

### 手写 useState

👇 一些教程中自己实现的 `useState` 就是这样：

```js
// ✨ 示例简易的 函数组件 重新渲染
function render() {
  ReactDOM.render(<App />, document.getElementById("root"));
}

// ✨ useState 函数外维护变量状态值
let state: any;

function useState<T>(initialState: T): [T, (newState: T) => void] {
  state = state || initialState;

  function setState(newState: T) {
    state = newState; // ✨ 1. 更新变量状态
    render(); // ✨ 2. 触发函数组件重新渲染
  }

  return [state, setState];
}

render(); // 首次渲染(不是useState的事)
```

## 条件语句中使用 Hooks

### 现象

假如希望首次渲染初始化出 name 的数据后，更新组件不走 `useState` 调用

```jsx
let isMounted = false;
const MyComp = () => {
  console.log("isMounted is", isMounted);

  let name, setName;

  // 在首次渲染（组件还未挂载）时，才获取 name、age 两个状态
  if (!isMounted) {
    // eslint-disable-next-line
    [name, setName] = useState("我");
    // if 内部的逻辑执行一次后，就将 isMounted 置为 true（说明已挂载，后续都不再是首次渲染了）
    isMounted = true;
  }

  const [age] = useState(1);

  console.log(`name: ${name}, age: ${age}`);

  // 编写 UI 逻辑
  return <div onClick={() => setName("你")}>不关心UI</div>;
};
```

`// eslint-disable-next-line` 这个注释

目前大部分的 React 项目都在内部预置了对 `React-Hooks-Rule（React-Hooks 使用规则）` 的强校验，而示例代码中把 `Hooks` 放进 `if` 语句的操作作为一种不合规操作，会被直接识别为 `Error` 级别的错误，进而导致程序报错

这里我们只有将相关代码的 `eslint` 校验给禁用掉，才能够避免校验性质的报错，从而更直观地看到错误的效果到底是什么样的，进而理解错误的原因。

👇 react 报错： `本次渲染 hooks 少于预期`
![](https://kingan-md-img.oss-cn-guangzhou.aliyuncs.com/blog/202308151151109.png)

👇 控制台输出：

![](https://kingan-md-img.oss-cn-guangzhou.aliyuncs.com/blog/202308151151869.png)

从控制台看出想要设置的 `name` 变为 `undefined` ，而不设置的 `age` 变为 `你`

也就是 `setName` 这个 `useState` 成功触发了重新渲染，也成功触发了状态更新，但是更新的变量出错了

我们通过文档和报错消息可以知道这是因为初始化函数组件和重新渲染函数组件的 `Hooks` 数量 or 顺序不一致引起的

也就是 `Hooks` 的工作机制与 `Hooks` 定义的顺序强相关

从示例也能看出在条件语句下的第一个 `useState` 是 `age` 因此初始化时第一个的 `setName` 更新了 `age` 的值

### 原理分析

- `React-Hooks` 在源码层面和 `Fiber` 关联十分密切，我们目前仍然处于基础夯实阶段，对 `Fiber` 机制相关的底层实现暂时没有讨论，盲目啃源码在这个阶段来说没有意义；

- `React-Hooks` 的源码链路相对来说比较长，涉及的关键函数 `renderWithHooks` 中“脏逻辑”也比较多，整体来说，学习成本比较高，学习效果也难以保证。

👇 `useState` 在 `函数组件` 执行时的步骤

![图片12.png](https://s0.lgstatic.com/i/image/M00/67/59/Ciqc1F-hJYCAWVjCAAEtNT9pGHA170.png)
![图片13.png](https://s0.lgstatic.com/i/image/M00/67/59/Ciqc1F-hJTGANs5yAAD4e6ACv8Q643.png)

- mountState（初始化）构建链表并渲染
- updateState 依次遍历链表并渲染 - **按顺序去遍历之前构建好的链表，取出对应的数据信息进行渲染**。

这个现象有点像我们构建了一个长度确定的数组，数组中的每个坑位都对应着一块确切的信息，后续每次从数组里取值的时候，只能够通过索引（也就是位置）来定位数据

也正因为如此，在许多文章里，都会直截了当地下这样的定义：`Hooks` 的本质就是数组

但读完这一课时的内容你就会知道，**Hooks 的本质其实是链表**。

[链表 linkedlist](../../04-面试/题库/面试-数据结构.md#链表linkedlist)

`useState` 源码示例

```jsx
function mountState(initialState) {
  // initialState 可以是待执行的函数
  if (typeof initialState === "function") initialState = initialState();

  // 创建当前 hook 对象的更新队列，这一步主要是为了能够依序保留 dispatch
  // 将新的 hook 对象追加进链表尾部
  var hook = mountWorkInProgressHook();
  const queue = (hook.queue = {
    last: null,
    dispatch: null,
    lastRenderedReducer: basicStateReducer,
    lastRenderedState: (initialState: any),
  });

  // 将 initialState 作为一个“记忆值”存下来
  hook.memoizedState = hook.baseState = initialState;

  // dispatch 是由上下文中一个叫 dispatchAction 的方法创建的，这里不必纠结这个方法具体做了什么
  const dispatch = (queue.dispatch = dispatchAction.bind(
    null,
    currentlyRenderingFiber$1,
    queue
  ));
  // ✨ setXXX 就是 dispatch 执行链表的调度方法
  return [hook.memoizedState, dispatch];
}
```

👆 `useState` 把状态构建到一个 `hook` 对象里，而 `hook` 对象之间以单向链表的形式相互串联

![图片16.png](https://s0.lgstatic.com/i/image/M00/67/65/CgqCHl-hJe2ATIhGAAHpze3gFHg893.png)
👆 `useState` 并不关心变量名，而是按顺序定位到对应的 `hook` 对象, 进行操作

因此，我们理解了 `不要在循环、条件或嵌套函数中调用 Hook` 这句警告的原因

**循环、条件语句、嵌套函数** 中不能保证函数组件前后的 `Hook` 顺序是否始终一致

### 其他关于链表的示例

![](https://kingan-md-img.oss-cn-guangzhou.aliyuncs.com/blog/202308151617262.png)

`cursor` - 光标

[一文彻底搞懂 react hooks 的原理和实现](https://juejin.cn/post/6844903975838285838)

[React hooks: not magic, just arrays](https://medium.com/@ryardley/react-hooks-not-magic-just-arrays-cd4f1857236e)
