# React Hooks

## 闭包陷阱（Closure Trap）

闭包陷阱在 React Hooks 或 JavaScript 中常见，尤其是在定时器、事件监听等异步回调里

```tsx
import { useEffect, useState } from "react";

export default function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setInterval(() => {
      console.log(count); // ✨ 每次 log 0
      setCount(count + 1);
    }, 1000);
  }, []);

  return <div>{count}</div>; // ✨ 从0变为1 后续只会显示1
}
```

我们知道每次触发 hook 都会被hook重新执行 `App()`

此处：

1. useEffect首次渲染时执行了创建定时器，完成执行 App(), 得到状态0
2. 1s 后触发 useState，hook触发重新执行 App()，得到状态 0+1
3. 因为useEffect依赖数组是[],因此不会重新执行useEffect
4. 1s 后内部继续出发useSatte，hook触发重新执行App()，因useEffect内的状态不会随着多次的重新执行App()而得到更新，而始终是初次执行useEffect时的状态，得到状态 0+1

## 解释

👇 理想状态下定时器内的 count + 1可以获取最新每次最新的状态，如下图：

![](https://kingan-md-img.oss-cn-guangzhou.aliyuncs.com/blog/20250701192034207.png?x-oss-process=image/format,webp/resize,w_640)

👇 然而从代码的执行上看： count 状态永远是第一次执行 `App()` 时的状态 0

![](https://kingan-md-img.oss-cn-guangzhou.aliyuncs.com/blog/20250701192132108.png?x-oss-process=image/format,webp/resize,w_640)

👇 这个现象是闭包陷阱：

- useEffect 只在初次渲染时执行一次（因为依赖数组是 []）。
- setInterval 里的回调函数“记住”了当时的 count（比如 0），之后每次执行都用的是这个旧值。
- 所以每次 setCount(count + 1) 实际上都是 setCount(0 + 1)，count 只会变成 1，后面不会再变。

### JS原理：

假设我们想每秒打印一次 count，并让 count 自增：

```js
let count = 0;
setInterval(function () {
  count++;
}, 1000);
```

上面这段代码没问题，每秒都会打印递增的 count。

如果我们把 count 放到一个函数作用域里，并用闭包访问它：

```js
function main() {
  let count = 0;

  setInterval(function () {
    console.log(count); // 闭包捕获了 count
    count++;
  }, 1000);
}
main();
```

这也没问题，因为闭包每次都能访问到最新的 count。

👇 闭包陷阱的本质：问题出现在“闭包捕获的是某个时刻的变量值”，而不是“变量的最新值”

```js
function main() {
  let count = 0;

  function useEffect(capturedCount) {
    setInterval(() => {
      console.log(capturedCount, count); // 定时器每次取值只能取 capturedCount 0
      count = capturedCount + 1; // 即使允许set外部的值，但只能取 capturedCount 来计算
    }, 1000);
  }

  useEffect(count); // 传入 count 状态，只允许内部从当前params取值，允许在内部set外部的值，但是不会拿到外部最新的值，只能拿到这个params的状态
}

main();
```

useEffect 内 get的状态是由外部传入的，只会是初次执行时的状态，在内部我们命名为capturedCount，useEffect不能拿到最外层实时的值，但是可以set。

👇 因此定时器内部获取 count 不能直接取外部（如果可以取外部则状态是最新的），而是从 function params 中取，然后成功set外部的状态，因此会体现为：

```
0 0
0 1
0 1
...
```

React 中因为 useEffect 只在初次渲染时执行一次，setInterval 里的回调函数“记住”了当时的 count（0），之后每次执行(get值来运算)都用的是这个旧值

## 闭包陷阱（Closure Trap）解决办法

### 不形成闭包

不让它形成闭包不就行了？

这时候可以用 setState 的另一种参数：

TODO: 补充 react 文档链接

```tsx
import { useEffect, useState } from "react";

export default function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setInterval(() => {
      console.log(count); // ✨ 每次 log 0
      // setCount(count + 1);
      setCount((count) => count + 1); // 使用回调函数，而不是取params中的状态，而是由 React 调用这个回调函数获取一个最新的状态
    }, 1000);
  }, []);

  return <div>{count}</div>; // ✨ 正确自增
}
```
