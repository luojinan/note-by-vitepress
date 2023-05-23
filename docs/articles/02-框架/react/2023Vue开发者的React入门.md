# 2023 Vue开发者的React入门

`Vue` 和 `React` 都是流行的 `JavaScript` 框架，它们在组件化、数据绑定等方面有很多相似之处

本文默认已有现代前端开发(`Vue`)背景，关于 **组件化、前端路由、状态管理** 概念不会过多介绍

0基础建议详细阅读 [Thinking in React-官方文档](https://react.dev/learn/thinking-in-react) 了解 `React` 的设计哲学

[React新文档](https://react.dev/)

[React中文文档(翻译中)](https://react.jscn.org/)

经过本文的学习让没开发过 `React` 项目的 `Vue` 开发者可以上手开发现有的 React 项目，完成工作需求开发

## React 新文档

`React` 新文档重新设计了导航结构，让我们更加轻松地找到所需的文档和示例代码
不仅提供了基础知识的介绍，还提供了更加详细的原理介绍和最佳实践，包括：`React` 组件的设计哲学、`React Hooks`的原理和用法等

并且提供了在线编辑和运行的功能，方便开发者进行测试和实验

👇 基于 **函数组件**

![](https://kingan-md-img.oss-cn-guangzhou.aliyuncs.com/blog/20230515001306.png)

初学可以只学 **函数组件**，[You Don't Need to Learn Class Components](https://www.freecodecamp.org/news/how-to-learn-react-in-2023/)

![](https://kingan-md-img.oss-cn-guangzhou.aliyuncs.com/blog/20230517173939.png)

👇 `interactive sandboxes` 可交互沙箱，边做边学

![](https://kingan-md-img.oss-cn-guangzhou.aliyuncs.com/blog/20230515001428.png)

`Fork` 可以单独打开页签

![](https://kingan-md-img.oss-cn-guangzhou.aliyuncs.com/blog/20230515001602.png)

## JSX 与 SFC

- 在 `Vue` 中我们使用 `单文件组件(SFC)` 编写组件模版
(虽然 `Vue` 也支持使用 `JSX` , 但是更鼓励使用`SFC`)
- 在 `React` 中，`JSX（JavaScript XML）`是一种将HTML语法嵌入到 `JavaScript` 中的语法扩展。它可以使得我们在 `JavaScript` 代码中轻松地定义组件的结构和样式，从而提高代码的可读性和可维护性

虽然 `React`和 `Vue` 在组件定义方式上存在差异，但是它们的组件化思想是相似的
### 根节点
👇 Vue
```vue
<template>
  <div>同级节点1</div>
  <div>同级节点2</div>
</template>
```
👇 React
```jsx
const App = (
  <>
    <div>同级节点1</div>
    <div>同级节点2</div>
  </>
)

const App = (
  <React.Fragment>
    <div>同级节点1</div>
    <div>同级节点2</div>
  </React.Fragment>
)
```
### 条件渲染
👇 Vue
```vue
<div v-if="show">条件渲染</div>
<div v-show="show">条件渲染</div>
```
👇 React
```jsx
{
  show ? <div>条件渲染</div> : null
}
```
### 循环语句
👇 Vue
```jsx
<ul>
  <li v-for="i in list" :key="i.id">{i.name}</li>
</ul>
```

👇 React
```jsx
<ul>
  { list.map(i => <li key={i.id}>{i.name}</li>) }
</ul>

```

### 表单绑定
👇 Vue
```vue
<input v-model="value"/>
```
👇 React
```jsx
<input value={value} onChange={onChange}/>
```

可以看出 `React` 的 `JSX语法` 学习记忆成本更低一点(当然`Vue`也不复杂)，`Vue` 更语法糖一些

## 单向数据流与双向绑定

在 `Vue` 中，我们使用 `v-bind`、`v-model`对数据进行绑定，无论是来自用户操作导致的变更，还是在某个方法里赋值都能够直接更新数据，不需要手动进行 `update` 操作

```js
this.data.msg = '直接修改数据后视图更新'
```

在 `React` 中，数据流是单向的，即从父组件传递到子组件，而不允许子组件直接修改父组件的数据。需要调用`set` 方法更新，当 `React` 感应到 `set` 触发时会再次调用 `render` 对 `dom` 进行刷新

```js
msg = "Hello" // ❌ 错误写法

setMsg('Hello'); // ✅ 来自hooks的set写法 后面会介绍
```

🤔 `Vue` 本质上底层也是单向的数据流，只不过对使用者来说看起来是双向的，如 `v-model` 本质也要 `set`

## React Hooks

`React Hooks` 是 `React 16.8` 版本中引入的特性，它可以让我们在 **函数组件** 中使用状态`（state）`和其他 `React` 特性

`Hooks` 本质是一些管理组件状态和逻辑的 `API` ，它允许开发者在 **函数式组件** 中使用状态、副作用和钩子函数，可以更加方便地管理组件状态、响应式地更新DOM、使用上下文等

在没有 `Hooks` 前， **函数组件** 不能拥有状态，只能做简单功能的UI(静态元素展示)，大家使用 **类组件** 来做状态组件

因为 **函数组件** 更加匹配 `React` 的设计理念 `UI = f(data)`，也更有利于逻辑拆分与重用的组件表达形式，为了能让 **函数组件** 可以拥有自己的状态，`Hooks` 应运而生

### 组件的逻辑复用

在 `Hooks` 出现之前，`React` 先后尝试了 `mixins混入`，`HOC高阶组件`，`render-props`等模式。但是都有各自的问题，比如 `mixins` 的数据来源不清晰，高阶组件的嵌套问题等等 

### class组件自身的问题

class组件就像一个厚重的‘战舰’ 一样，大而全，提供了很多东西，有不可忽视的学习成本，比如各种生命周期，this指向问题等等

### useState

> 参数接受一个默认值，返回 `[value, setValue]` 的元组（就是约定好值的 `JavaScript` 数组），来读取和修改数据

👇 不使用 `Hooks` 的静态组件，当点击修改数据，视图不会重新渲染
```jsx
function App() {
  let count = 1
  const add = () => count++ // 不会触发重新渲染

  return <div onClick={add}>{count}</div>
}
```

👇 使用 `useState`
```jsx
import { useState } from 'react'

function App() {
  let count = 1
  const [proxyCount, setProxyCount] = useState(count)
  const add = () => setProxyCount(proxyCount+1)

  return <div onClick={add}>{proxyCount}</div>
}
```
我们分析一下触发数据修改的 **函数组件行为**：

组件会第二次渲染（`useState` 返回的数组第二项 `setProxyCount()` 被执行就会触发重新渲染）
1. 点击按钮，调用 `setProxyCount(count + 1)` 修改状态，因为状态发生改变，所以，该组件会重新渲染
2. 组件重新渲染时，会再次执行该组件中的代码逻辑
3. 再次调用 `useState(1)`，此时 `React` 内部会拿到最新的状态值而非初始值，比如，该案例中最新的状态值为 `2`
4. 再次渲染组件，此时，获取到的状态 `count` 值为 `2`

👆 也就是触发重新渲染会让 `useState` 也重新执行，但是 `useState` 的参数(初始值)只会在组件第一次渲染时生效

每次的渲染，`useState` 获取到都是最新的状态值，React 组件会记住每次最新的状态值

### useEffect

上面我们分析触发组件重新渲染就可以发现，`React` 的函数组件没有具体的生命周期钩子

`React` 更希望我们把组件当作函数，而去关注函数的函数的副作用，而没有实例化过程的钩子

`useEffect` 就可以很好的帮助我们达到我们想要的效果：

1. 处理组件第一次渲染时的回调，类似 `Vue` 中的 `mounted`
```jsx
// 第二个参数传一个空数组，表示没有依赖，只会在第一次渲染时执行
useEffect(() => {
  alert('mounted');
}, [])
```

2. 通过依赖变更触发的钩子函数，只要有一项依赖发生变化就执行，类似 `Vue` 中的 `watch`
```jsx
function Comp({ title }) {
  const [count, setCount] = useState(0);
  // 第二个参数指定一个数组，放入你想监听的依赖：
  useEffect(() => {
    console.log('title or count has changed.')
  }, [title, count])
}
```
原则上，函数中用到的所有依赖都应该放进数组里

3. 组件卸载时执行内部 `return` 的函数
```jsx
import { useEffect } from "react"

const App = () => {

  useEffect(() => {
    const timerId = setInterval(() => {
      console.log('定时器在运行')
    }, 1000)

    return () => { // 用来清理副作用的事情
      clearInterval(timerId)
    }
  }, [])

  return <div>内部有定时器</div>
}
```

我们常见的副作用 `1. 数据请求ajax发送 2. 手动修改dom 3. localstorage操作`

### 自定义 Hooks

获取滚动距离y：
```jsx
import { useState, useEffect } from "react"

export function useWindowScroll () {
  const [y, setY] = useState(0)

  useEffect(() => {
    const scrollHandler = () => {
      const h = document.documentElement.scrollTop
      setY(h)
    }
    window.addEventListener('scroll', scrollHandler)
    return () => window.removeEventListener('scroll', scrollHandler)
  })

  return [y]
}
```
使用：
```jsx
const [y] = useWindowScroll()
return <div>{y}</div>
```
![](https://kingan-md-img.oss-cn-guangzhou.aliyuncs.com/blog/20230517hooks.gif)

封装的 `Hooks` 名称也要用 `use` 开头（这是一个约束）

## 状态管理

`React` 的 **状态管理** 有很多，入门可以暂时不考虑

或者已有项目使用什么再学习即可，和 `Vuex` 整体思路差不多

## tic-tac-toe 井字棋游戏

最后我们跟着 `React` 官方文档实现一个井字棋游戏来巩固知识点

使用 `Vite` 创建项目

![](https://kingan-md-img.oss-cn-guangzhou.aliyuncs.com/blog/20230516204426.png)

```bash
pnpm create vite react-tic-tac-toe --template react
cd react-tic-tac-toe
pnpm i
pnpm dev
```
👇 `vite.config.js` 非常简洁
```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

👇 修改入口文件 `main.jsx`
```jsx
import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import App from "./App";

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

👇 `util.js` 计算当前棋局是否有获胜
```js
// 计算当前棋局是否有获胜
export function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
```

👇 `Square.jsx` 正方形按钮组件
```jsx
// 正方形按钮组件
export default function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}
```

👇 `App.jsx`
```jsx
import { useState } from 'react';
import { calculateWinner } from './util.js'
import Square from './Square'

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    // 执行父组件的落子事件
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    // 胜利提示
    status = '获胜方是: ' + winner;
  } else {
    // 下一步提示
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  // 棋盘落子
  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    // 记录落子历史，用于恢复棋局
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  // 恢复棋局到第几步
  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  // 历史落子列表按钮展示，用于点击恢复棋局
  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}
```

![](https://kingan-md-img.oss-cn-guangzhou.aliyuncs.com/blog/20230515221615.png)

深入学习任一前端框架都不容易，让我们一起加油吧！

## 参考资料

- [React 新文档](https://react.dev/)
- [React 中文文档(翻译中)](https://react.jscn.org/)
- [给 Vue 开发的 React 上手指南](https://juejin.cn/post/6952545904087793678)
- [无缝切换？从Vue到React](https://zhuanlan.zhihu.com/p/609120596)
- [How to Learn React in 2023](https://www.freecodecamp.org/news/how-to-learn-react-in-2023/)
