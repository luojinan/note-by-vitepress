# react compiler

> 在 2024 的 React Conf 上，React Compiler 正式开源了，早在 2021 的 React Conf 上，由黄玄提出的 React Forget（React without memo）概念，后改名为 React Compiler。

[react-compiler-github](https://github.com/reactwg/react-compiler/discussions/5)

## 简介

👇 [React Compiler — Goals, Design Principles, and Architecture 目标、设计原则和架构](https://github.com/facebook/react/blob/main/compiler/docs/DESIGN_GOALS.md)

1. **限制重新渲染**：减少不必要的组件重新渲染，保证应用性能。
2. **保持启动性能**：确保编译后的代码不会增加启动负担。
3. **兼容现有工具**：与现有的调试和性能分析工具兼容。
4. **易于理解**：让开发者能够快速理解其工作原理。
5. **无需额外注释**：不需要开发者添加类型或其他注释。

其架构包括：

- **Babel插件**：用于代码转换。
- **ESLint插件**：用于报告违反React规则的代码错误。React Compiler的目的是使React应用默认快速，同时保持开发者的编程体验。

它不会更改 React 现有的开发范式和更新方式，侵入性非常弱。这一点对于老项目来说，非常非常重要。

**开发者体验**：它减少了开发者手动使用`useMemo`、`useCallback`和`React.memo`等记忆化技术的需要，简化了代码和优化过程

👇 代码示例： 一个纯静态的子组件，随着父组件重新渲染

```tsx
export default function App() {
  const [counter, setCounter] = useState(0)

  return (
    <div>
      <button onClick={() => setCounter(counter + 1)}>点击修改 counter：{counter}</button>

      <Children />
    </div>
  )
}
```

子组件，不使用任何hook，没有props

```tsx
export default function Children() {
  console.log('子组件render')

  return <div>Children</div>
}
```

可以看到，每次都会触发 Children 函数组件的执行，当然 React 有 虚拟dom diff算法，展示让我们假设这个diff算法很耗时，而且这个组件完全独立，我们理应不需要它重新触发

**我们先了解一下 React 的更新机制:**

在React项目中，任何组件的 state 状态变化都会从最顶层的根节点开始递归对比，判断哪些节点发生了变化。这种更新机制的成本较高，因为在判断过程中，如果 React 发现 props、state、context 任意一个不同，那么就认为该节点被更新了。尤其是在频繁更新状态时，冗余的`re-render`会导致性能问题。（对比的成本非常小）

## 手动优化

### React.memo

使用memo包裹 `React.memo(Children)`

> React.memo 用于优化组件的渲染，将组件包裹起来返回一个新的优化后的组件
>
> 原理是：通过浅比较 props 的方式来判断是否重新渲染组件

```tsx
function Children() {
  console.log('子组件render')

  return <div>Children</div>
}

export default React.memo(Children)
```

### 加上静态属性prop

也可以memo

```tsx
export default function App() {
  const [counter, setCounter] = useState(0)

  return (
    <div>
      <button onClick={() => setCounter(counter + 1)}>点击修改 counter：{counter}</button>

      <Children a={1} b={2} />
    </div>
  )
}
```

```tsx
function Children(props) {
  console.log('子组件render')

  return <div>{ JSON.stringify(props) }</div>
}

export default React.memo(Children)
```

### 加上引用类型/函数prop

不使用任何hook，加上引用类型数据/无副作用函数，memo失效

```tsx
export default function App() {
  const [counter, setCounter] = useState(0)

  const p = () => console.log('无副作用函数')
  // or
  const p = {}

  return (
    <div>
      <button onClick={() => setCounter(counter + 1)}>点击修改 counter：{counter}</button>

      <Children a={1} b={2} c={p} />
    </div>
  )
}
```

```js
const oldProps = { a: 1, b: 2 }

const newProps = { a: 1, b: 2 }

// oldProps === newProps

// 函数参数
const oldProps = { a: 1, b: 2, c: fn1 }

const newProps = { a: 1, b: 2, c: fn2 }

// oldProps !== newProps
```

这是因为 c引用类型数据，在父组件重新执行时也跟着重新创建了

移动到外部即可

```tsx
const p = () => console.log('无副作用函数')
// or
const p = {}

export default function App() {
  const [counter, setCounter] = useState(0)

  return (
    <div>
      <button onClick={() => setCounter(counter + 1)}>点击修改 counter：{counter}</button>

      <Children a={1} b={2} c={p} />
    </div>
  )
}
```

但是在需要使用usestate的时候，放不了在外面，还是要写在里面，此时就需要考虑如何让memo判断props时，能正确识别引用类型是否改变，而决定是否触发重新渲染子组件

而 hook 具备让父组件重新执行时，即使把引用类型数据写在内部，也不重新创建

引用类型如对象数据，可以通过useState包裹，即可实现父组件重新执行时也不重新创建

而函数数据，就要通过useCallback包裹

> useCallback 可以用于优化函数的创建和传递，确保在依赖项不变的情况下，函数不会被重新创建
>
> 这在需要将函数作为 prop 传递给子组件或作为依赖项传递给其他钩子时非常有用

```tsx
export default function App() {
  const [counter, setCounter] = useState(0)
  const p = useCallback(() => {}, [])
  // or
  const [p] = useState({})

  return (
    <div>
      <button onClick={() => setCounter(counter + 1)}>点击修改 counter：{counter}</button>

      <Children a={1} b={2} c={p} />
    </div>
  )
}
```

### usememo?

这个钩子允许你缓存一个函数输出的结果，并在需要时检索这些信息，而无需再次重新计算该值

和是否重新渲染没有太大关系，是另一种性能优化

👇 当我们编写好了周全的memo子组件，此时确实需要更新子组件（传递给子组件的props是变量）

```tsx
export default function App() {
  const [counter, setCounter] = useState(0)

  return (
    <div>
      <button onClick={() => setCounter(counter + 1)}>点击修改 counter：{counter}</button>

      <Children a={counter} />
    </div>
  )
}
```

```js
import { memo } from "react"

const getTotal = () => {
  console.log('触发耗时计算')
  let total = 0
  for (let i = 0; i < 1000000; i++) {
    total += 1
  }
  return total
}

function Children(props) {
  console.log('子组件render')
  const res = getTotal()

  return <div>{props.a}hello world{res}</div>
}

export default memo(Children)
```

👆 没有副作用的耗时计算因为react的重新执行机制会重新计算，解决办法有：

1. 提升到外部
2. 使用useEffect和useState存储计算后的结果
3. 使用useMemo

### 😓 要不要手动优化？

可以看出如果要考虑性能，要比较了解闭包，对开发的心智负担还是有点重的

上面一套手动优化下来，开发已经吐了🤮，还极容易遗漏东西，最后优化了个寂寞

那我们无脑给所有组件添加 React.memo 包裹

然后看心情补充 usecallback、useState 包裹引用类型props数据，能命中优化就命中优化，不命中拉倒

![](https://kingan-md-img.oss-cn-guangzhou.aliyuncs.com/blog/20240919165249181.png?x-oss-process=image/format,webp)

> 只有当你的组件经常使用完全相同的 props 重新渲染时，并且其重新渲染逻辑是非常昂贵的，使用 memo 优化才有价值。如果你的组件重新渲染时没有明显的延迟，那么 memo 就不必要了
>
> 请记住，如果传递给组件的 props 始终不同，例如在渲染期间传递对象或普通函数，则 memo 是完全无用的
>
> 这就是为什么你通常需要在 memo 中同时使用 useMemo 和 useCallback。

[在每个地方都应该添加 memo 吗 - react 文档](https://zh-hans.react.dev/reference/react/memo#should-you-add-memo-everywhere)

## compiler

React Compiler 编译之后的代码 **并非是** 在合适的时机帮我注入 memo/useCallback 等 API 来缓存组件。而是使用了一个名为 useMemoCache 的 hook 来缓存代码片段

Compiler 会分析所有可能存在的返回结果，并把每个返回结果都存储在 useMemoCache 中。把缓存结构存储在数组上，每一个渲染结果都会被存储在 useMemoCache 的某一项中，如果判断之后发现该结果可以复用，则直接通过读取序列的方式使用即可

[react compiler playground](https://playground.react.dev/#N4Igzg9grgTgxgUxALhAMygOzgFwJYSYAEAwgBZ4A2AJjApgBQAOMETYAlEcADrFFxCkSggB0lCAHMGAcjgUadYkuoIYMjnyJE6OWMQZbtRADzU8ANwB8wAFIBlAPIA5UWBww8mSXjQBPZlZ2DgBfEwB6c2sjTUwQvj4EAA8mCBgcIlU0AEMoSgzyKlp6PhAQoA)

组件渲染不依赖 props时👇

![](https://kingan-md-img.oss-cn-guangzhou.aliyuncs.com/blog/20240914155024597.png?x-oss-process=image/format,webp)

在 Compiler 编译后的代码中，有一个比较少见的语法会频繁出现：Symbol.for，我先把这个知识点科普一下。

Symbol 在 JavaScript 中，是一种基础数据类型。

我们常常用 Symbol 来创建全局唯一值。例如，下面两个变量，虽然写法是一样的，但是他们的比较结果并不相等

在 Compiler 编译后的代码中，有一个比较少见的语法会频繁出现：Symbol.for，我先把这个知识点科普一下。

Symbol 在 JavaScript 中，是一种基础数据类型。

我们常常用 Symbol 来创建全局唯一值。例如，下面两个变量，虽然写法是一样的，但是他们的比较结果并不相等

```js
const a = Symbol('hello');
const b = Symbol('hello');

a === b; // false
```

Symbol.for 则不同，Symbol.for 传入相同字符串时，它不会重复创建不同的值。

而是在后续的调用中，读取之前已经创建好的值。因此下面的代码对比结果为 true

```js
const a = Symbol.for('for');
const b = Symbol.for('for');

a === b; // true

```

或者我们用另外一种说法来表达这种创建 -> 读取的过程。

```js
// 创建一个 symbol 并放入 symbol 注册表中，键为 "foo"
Symbol.for('foo');

// 从 symbol 注册表中读取键为"foo"的 symbol
Symbol.for('foo');
```

在 Compiler 编译后的代码中，组件依赖 useMemoCache 来缓存所有运算表达式，包括组件、函数等。

在下面的例子中，useMemoCache 传入参数为 12，说明在该组件中，有 12 个单位需要被缓存。

在初始化时，会默认给所有的缓存变量初始一个值。

```js
$ = _c(1);
// $ = useMemoCache(12);

function useMemoCache(count) {
  for (let $i = 0; $i < count; $i += 1) {
    $[$i] = Symbol.for('react.memo_cache_sentinel');
  }
}
```

组件渲染依赖props时👇

![](https://kingan-md-img.oss-cn-guangzhou.aliyuncs.com/blog/20240914155118474.png?x-oss-process=image/format,webp)

组件渲染依赖逻辑计算时 👇
![](https://kingan-md-img.oss-cn-guangzhou.aliyuncs.com/blog/20240914155630533.png?x-oss-process=image/format,webp)

👆 使用函数会缓存计算结果，等同于 usememo，从而优化重计算逻辑

源码位置

```js
// react/compiler/packages/babel-plugin-react-compiler/src/Entrypoint/Program.ts
function compileProgram(program: NodePath<t.Program>, pass: CompilerPass) {
  const useMemoCacheIdentifier = program.scope.generateUidIdentifier('c');

  // ....

  compiledFn = compileFn(
    fn,
    config,
    fnType,
    useMemoCacheIdentifier.name,
    pass.opts.logger,
    pass.filename,
    pass.code,
  );
}
```

```js
// react/compiler/packages/babel-plugin-react-compiler/src/ReactiveScopes/CodegenReactiveFunction.ts
function codegenFunction(fn: ReactiveFunction, uniqueIdentifiers: Set<string>) {
  // ....
  // 共缓存的变量 数量 =>  
  // const $ = _c(4);
  // t0 = $[0];
  const cacheCount = compiled.memoSlotsUsed;
  // The import declaration for `useMemoCache` is inserted in the Babel plugin
  preface.push(
    t.variableDeclaration('const', [
      t.variableDeclarator(
        t.identifier(cx.synthesizeName('$')),
        t.callExpression(t.identifier(fn.env.useMemoCacheIdentifier), [
          t.numericLiteral(cacheCount),
        ]),
      ),
    ]),
  );
  if (fastRefreshState !== null) {
    // ...
  }
}
```

## react-compiler VS vue/compiler-sfc

vue 不需要显式的判断是否重新渲染

**Vue 的响应式系统**：

- Vue 有一个强大的响应式系统，它可以自动追踪组件的数据依赖，并在数据变化时更新 DOM。Vue 使用基于依赖追踪的机制，当组件的响应式数据发生变化时，Vue 会自动触发组件的重新渲染。
- Vue 能够区分静态和动态的 props。当 props 发生变化时，Vue 会进行依赖追踪并触发更新。

最后 Vue 和 React 都使用虚拟 DOM diffing 来最小化 DOM 操作。

引入 React Compiler 后依然不做依赖收集，所以有些人说 react 加了compiler之后会加依赖收集是不对滴

React 还是通过从根节点自上而下的 diff 来找出需要更新的节点。在这个过程中，会通过大量的判断来决定使用缓存值

可以明确的是，Compiler 编译之后的代码，缓存命中的概率非常高，几乎所有应该缓存的元素和函数都会被缓存起来。

因此，React Compiler 也能够在不做依赖收集的情况下，做到元素级别的超级细粒度更细。

但是，这样做的代价就是，React 需要经历大量的判断来决定是否需要更新。

所以这个时候，我们就需要明确，我所谓的大量判断的时间成本，到底有多少？它会不会导致新的性能问题？

可以看到，几乎所有的比较都是使用了全等比较，因此，我们可以写一个例子来感知一下，超大量的全等比较到底需要花费多少时间。

```js
const cur = performance.now();

for (let i = 0; i < 100*10000; i++) {
  'xxx' == 'xx';
}
const now = performance.now();
console.log(now - cur);
```

## umijs

[umirc forget](https://umijs.org/docs/api/config#forget)

[react-19-upgrade-guide](https://react.dev/blog/2024/04/25/react-19-upgrade-guide)

更新 umijs、react、react-dom

👇 antd 组件库在 react19 报错

![](https://kingan-md-img.oss-cn-guangzhou.aliyuncs.com/blog/20240919105441437.png?x-oss-process=image/format,webp)

[reactRender is not a function" with react 19-rc](https://github.com/react-component/util/issues/550)

```js
import { render as reactRender, unmount as reactUnmount } from "rc-util/es/React/render";
```

## Using the compiler on < React 19

[forget.experimental.enableCompilerWithReact18](https://github.com/umijs/umi/issues/12404)

[Using the compiler on < React 19](https://github.com/reactwg/react-compiler/discussions/6)

## 其他

### 严格模式

React Compiler 并非全能，如果你写的代码过于灵活，无法被提前预判执行行为，那么 React Compiler 将会跳过这一部分的优化。

因此好的方式是在项目中引入严格模式，在严格模式的指导下完成的开发，基本都在 React Compiler 的辐射范围之内

不幸的是 antdesign 在 严格模式下也有问题

### eslint

React Compiler 提供了 eslint 插件，用于检查代码是否符合优化规则，且独立于 React Compiler

当该插件显示你的代码有违反 [React Rules](https://zh-hans.react.dev/reference/rules) 时，编译器同样也会跳过优化。

`pnpm add eslint-plugin-react-compiler -D`

👇 eslintrc.js

```js
module.exports = {
  plugins: ['eslint-plugin-react-compiler'],
  rules: {
    'react-compiler/react-compiler': 'error',
  },
};
```

![](https://kingan-md-img.oss-cn-guangzhou.aliyuncs.com/blog/20240919153413172.png?x-oss-process=image/format,webp)

## 拓展

[react 性能优化hook](https://juejin.cn/post/7273427487588925501#heading-1)

[react compiler - documents](https://react.dev/learn/react-compiler)

[如何减少react组件不必要的重新渲染](https://juejin.cn/post/7183490342144966712)

[react 所有性能优化hook](https://juejin.cn/post/7273427487588925501#heading-1)

[苦等三年，React Compiler 终于能用了](https://mp.weixin.qq.com/s?__biz=MzI4NjE3MzQzNg==&mid=2649869339&idx=1&sn=c245638ed9147cf37fe93e04fd576276&chksm=f3e59d88c492149ec71c38e875d1e05211edb6708065e28f2cac240a8182195a18d5456525c7&scene=21#wechat_redirect)

[我已彻底拿捏 React Compiler，原来它是元素级细粒度更新](https://mp.weixin.qq.com/s/7XFn56O3ia5vHPqSaeo6GA)

[不等了，直接起飞！我找到了 Compiler 在低版本中使用的方法，它不再是 React 19 的专属](https://mp.weixin.qq.com/s/RQ1c6YdNgyG-vCCPQBFMjw)

[useMemo..一把梭？达咩！✋|一文告诉你为什么React不把他们设为默认方法](https://juejin.cn/post/7104436526494253087)
