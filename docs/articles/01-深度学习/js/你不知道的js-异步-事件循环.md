# 事件循环

[从event loop规范探究javaScript异步及浏览器更新渲染时机](https://github.com/aooy/blog/issues/5)

[常见异步笔试题，请写出代码的运行结果#7](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/7)

```js
//请写出输出内容
async function async1() {
    console.log('async1 start');
    await async2();
    console.log('async1 end');
}
async function async2() {
	console.log('async2');
}

console.log('script start');

setTimeout(function() {
    console.log('setTimeout');
}, 0)

async1();

new Promise(function(resolve) {
    console.log('promise1');
    resolve();
}).then(function() {
    console.log('promise2');
});
console.log('script end');

/*
script start
async1 start
async2
promise1
script end
async1 end
promise2
setTimeout
*/
```

## JS单线程处理任务

> 进程和线程的区别？为什么JS设计成单线程

两个名词都是 `CPU` 工作时间片的一个描述

- **进程**: 描述了 `CPU` 在运行指令及加载和保存上下文所需的时间，放在应用上来说就代表了一个程序
- **线程**: 是进程中的更小单位，描述了执行一段指令所需的时间

把这些概念拿到浏览器中来说
- 打开一个 `Tab` 页时，其实就是创建了一个进程
- 一个进程中可以有多个线程
  - 渲染线程
  - `JS` 引擎线程
  - `HTTP` 请求线程(发起一个请求时，其实就是创建了一个线程，当请求结束后，该线程可能就会被销毁)
  - ...

在 JS 运行的时候可能会阻止 UI 渲染
这说明了 `渲染线程` `JS 引擎线程` 两个线程是互斥的

因为 `JS` 可以修改 DOM，如果不互斥，在 `JS` 执行的时候 UI 线程还在工作，就可能导致不能安全的渲染 `UI`

得益于 `JS` 是单线程运行的
- 可以节省内存?
- 节约上下文切换时间?
- 不需要手动上锁
  - 假设读取一个数字 15 的时候
  - 同时有两个操作对数字进行了加减，这时候结果就出现了错误
  - 解决办法，在读取的时候加锁，直到读取完毕之前都不能进行写入操作

## JS单线程的背景

> 因为 javescript 创建之初，只是为了运行在浏览器端
> 面对浏览器特有的操作DOM场景，不能因为各种并发多线程逻辑，导致DOM被操作得晕头转向
> 因此 javascript 设计为单线程语言 - 负责执行代码的只有一个线程

而我们现在编写的异步函数，是基于单线程的事件循环机制进行的逻辑顺序排队(阻塞)执行，形成一种延迟执行的效果

## 同步任务-执行栈

栈内存作用
- 执行代码（主线程）
- 存储变量和基本类型值

把执行栈认为是一个存储函数调用的**栈结构**，遵循**先进后出**的原则

![](https://kingan-md-img.oss-cn-guangzhou.aliyuncs.com/blog/1670d2d20ead32ec.gif)

- 首先会执行一个 `main` 函数
- 然后执行我们的代码
- 根据先进后出的原则，后执行的函数会先弹出栈
- `foo` 函数后执行，当执行完毕后就从栈中弹出了


![](https://kingan-md-img.oss-cn-guangzhou.aliyuncs.com/blog/webcomponents.gif)

👇 平时也能在控制台的函数异常信息中看到执行栈的函数顺序

![](https://kingan-md-img.oss-cn-guangzhou.aliyuncs.com/blog/20221201204530.png)
👆 报错在 `foo` 函数，`foo` 函数又是在 bar 函数中调用的

👇 当执行栈存储过多函数，释放不掉就会导致爆栈(**栈可存放的函数是有限制**)

![](https://kingan-md-img.oss-cn-guangzhou.aliyuncs.com/blog/20221201204703.png)

## 异步任务

> `setTimeout 0` 并不是立即执行，可以看出JS处理异步是有一定顺序的

> js(执行代码)是单线程的，浏览器并不是单线程的，js执行一些 `webApi` ，交给浏览器，浏览器可以开启别的线程
> 
> 如 `setTimeout` 的 `webApi` 浏览器是在别的线程里倒计时

```js
function demo() {
  setInterval(function(){
    console.log(2)
  },1000)
  sleep(2000)
}
demo()
```
👆 多个回调函数会在耗时操作(2秒)结束以后同时执行，这样可能就会带来性能上的问题

👇 用 [requestAnimationFrame](https://developer.mozilla.org/zh-CN/docs/Web/API/window/requestAnimationFrame) 实现一个准确的 `setInterval` 
```js
function setInterval(callback, interval) {
  let timer
  const now = Date.now
  let startTime = now()
  let endTime = startTime
  const loop = () => {
    timer = window.requestAnimationFrame(loop)
    endTime = now()
    if (endTime - startTime >= interval) {
      startTime = endTime = now()
      callback(timer)
    }
  }
  timer = window.requestAnimationFrame(loop)
  return timer
}

let a = 0
setInterval(timer => {
  console.log(1)
  a++
  if (a === 3) cancelAnimationFrame(timer)
}, 1000)
```
👆 `requestAnimationFrame` 自带函数节流功能，基本可以保证在 16.6 毫秒内只执行一次（不掉帧的情况下）
并且该函数的延时效果是精确的，没有其他定时器时间不准的问题

TODO: 通过该函数来实现 `setTimeout`

### 宏任务

宏任务包括 `script` ， `setTimeout` `，setInterval` `，setImmediate` ，`I/O`，`UI` `rendering。`


### 微任务

微任务包括 `process.nextTick`，`promise` ，`MutationObserver`，`queueMicrotask`

### queueMicrotask

[queueMicrotask-MDN](https://developer.mozilla.org/en-US/docs/Web/API/queueMicrotask)

## 浏览器的事件循环

JS 引擎线程，执行 JS 代码往执行栈中放入函数，当遇到异步的代码时，会被挂起并在需要执行的时候加入到 Task（有多种 Task） 队列中(宏任务队列、微任务队列)

一旦执行栈为空，`Event Loop `就会从 Task 队列中拿出需要执行的代码并放入执行栈中执行

所以本质上来说 `JS` 中的异步还是**同步行为**

`Event Loop` 执行顺序如下所示：

- 首先执行同步代码
- 当执行完所有同步代码后，执行栈为空，查询是否有异步代码需要执行
- 执行所有微任务
- 当执行完所有微任务后，如有必要会渲染页面
- 执行宏任务中的异步代码，也就是 setTimeout 中的回调函数，然后开始下一轮 `Event Loop`

代码虽然 `setTimeout` 写在 `Promise` 之前，但是因为 `Promise` 属于微任务而 `setTimeout` 属于宏任务，所以会先执行 `Promise` 的回调

有个误区，认为微任务快于宏任务，其实是错误的

因为宏任务中如 `script` 
浏览器会先执行一个宏任务，内部产生异步代码的话才会先执行微任务(循环 ♻️)

> 警告： 因为微任务自身可以入列更多的微任务，且事件循环会持续处理微任务直至队列为空，那么就存在一种使得事件循环无尽处理微任务的真实风险。如何处理递归增加微任务是要谨慎而行的。

## event loop 调度

[浏览器原理](./%E6%B5%8F%E8%A7%88%E5%99%A8%E5%8E%9F%E7%90%86.md)

[事件循环-js现代教程](https://javascript.info/event-loop)

事件循环(死循环执行任务)只针对异步任务

我们先不考虑宏/微任务，只说异步任务

各个流程产生的异步任务：
- When an external script `<script src="...">` loads, the task is to execute it.
- When a user moves their mouse, the task is to dispatch `mousemove` event and execute handlers.
- When the time is due for a scheduled `setTimeout`, the task is to run its callback.
- …and so on.

这些不会立即执行的任务就被称为 **异步任务** ，并且存放到 **消息队列(先进先出)** 中，由一个死循环的事件循环来监听执行

![](https://kingan-md-img.oss-cn-guangzhou.aliyuncs.com/blog/20230331151026.png)

除了内置的异步任务，我们也可以手动利用异步任务做一些性能优化，如 拆分 CPU 过载任务(`splitting CPU-hungry tasks`)

如给文档的代码块做语法高亮，对静态页面做语法高亮的过程，是相当耗费 CPU 资源的

当引擎忙于语法高亮时，它就无法处理其他 DOM 相关的工作，例如处理用户事件等。它甚至可能会导致浏览器“中断（hiccup）”甚至“挂起（hang）”一段时间

我们可以通过将大任务拆分成多个小任务来避免这个问题。高亮显示前 100 行，然后使用 setTimeout（延时参数为 0）来安排（schedule）后 100 行的高亮显示，依此类推。

### 拆分耗时同步任务

同理，我们用一个长遍历模拟耗时任务，并尝试利用异步任务拆分

👇 耗时同步任务
```js
let i = 0;
let start = Date.now();

function count() {
  // do a heavy job
  for (let j = 0; j < 1e9; j++) {
    i++;
  }

  alert("Done in " + (Date.now() - start) + 'ms');
}

count();
```

👇 `setTimeout` 拆分
```js
let i = 0;
let start = Date.now();

function count() {
  // do a piece of the heavy job (*)
  do {
    i++;
  } while (i % 1e6 != 0);

  if (i == 1e9) {
    alert("Done in " + (Date.now() - start) + 'ms');
  } else {
    setTimeout(count); // schedule the new call (**)
  }
}

count();
```
这样只是拆分了多个异步任务，如果需要先执行其他任务需要确保插入消息队列的时机在执行拆分前(如，js在执行，点击页面按钮事件就可以在间隙时响应)

🤔 注意：这样拆分，只是实现了让我们可以优先执行其他的任务，并不会减少整体的时间

```js
let i = 0;
let start = Date.now();

function count() {
  // move the scheduling to the beginning
  if (i < 1e9 - 1e6) {
    setTimeout(count); // schedule the new call
  }

  do {
    i++;
  } while (i % 1e6 != 0);

  if (i == 1e9) {
    alert("Done in " + (Date.now() - start) + 'ms');
  }
}

count();
```
👆 把 `setTimeout` 放前面，在执行 `count` 时就创建一个异步任务，这样可以减少计时器的时间差(0ms并不只0ms)

🤔 为什么比同步任务还快？ 同步都在一个地方，内存状态有关？

### 进度条需求 js实时渲染DOM(手动让步给渲染引擎)

> 浏览器自身就有对JS频繁操作 DOM渲染 延后处理的特性(`Vue.nextTick()`)
> 
> `JS引擎` 执行完所有同步任务后再由 `渲染引擎` 执行渲染，因此频繁操作 `DOM` ，最终只会执行1次

👇 dom操作，发生在同步任务清空后
```html
<div id="progress"></div>

<script>
  function count() {
    for (let i = 0; i < 1e6; i++) {
      i++;
      progress.innerHTML = i;
    }
  }
  count();
</script>
```

进度条不会实时渲染，而是等 `js` 任务完成后，才交由 `渲染引擎` 执行

`js引擎` 和 `渲染引擎` 的交替执行

> 渲染引擎发生在 **每个异步任务** 后

因为异步任务都发生在同步任务执行完成后，因此我们说 渲染引擎发生在 **每个异步任务** 后

需要理解没异步任务的情况是 `js引擎` 执行完同步任务后交由 `渲染引擎`

正因为每个异步任务后都会 执行一次渲染，进度条需求就可以利用拆分异步任务的方式实现

```html
<div id="progress"></div>

<script>
  let i = 0;
  function count() {
    // 做繁重的任务的一部分 (*)
    do {
      i++;
      progress.innerHTML = i;
    } while (i % 1e3 != 0);

    if (i < 1e6) {
      setTimeout(count);
    }
  }
  count();
</script>
```

👇 微任务发生在渲染前，因此 进度条需求无法靠 **拆分微任务的异步任务** 实现

```html
<div id="progress"></div>
<script>
  let i = 0;
  function count() {
    // 做繁重的任务的一部分 (*)
    do {
      i++;
      progress.innerHTML = i;
    } while (i % 1e3 != 0);

    if (i < 1e6) {
      queueMicrotask(count); // <-- this
    }
  }
  count();
</script>
```

![](https://kingan-md-img.oss-cn-guangzhou.aliyuncs.com/blog/20230331180840.png)

🤔 为什么需要微任务

## nodejs的事件循环

[掘金小册简单介绍](http://www.qianduan.site/html/7-Event-Loop.htm)

TODO: 找详细资料学习

> Node 中的 Event Loop 和浏览器中的有什么区别？process.nexttick 执行顺序？

`Node` 中的 `Event Loop` 和浏览器中的是完全不相同的东西

`Node` 的 `Event Loop` 分为 6 个阶段，它们会按照顺序反复运行
每1个阶段对应一个任务队列内存
当队列为空或者执行的回调函数数量到达系统设定的阈值，就会进入下一阶段

![](https://kingan-md-img.oss-cn-guangzhou.aliyuncs.com/blog/20221202111706.png)

- timers
  - 执行 setTimeout 和 setInterval 回调，并且由 poll 阶段控制
  - Node 中定时器指定的时间也不是准确时间，只能是尽快执行
- pending callbacks
- idle prepare
- poll
  - 回到 timer 阶段执行回调(time的时机到了的话)
  - 执行 I/O 回调
  - 如果没有设定了 timer 的话，会发生以下两件事情
    - 如果 `poll` 队列不为空，会遍历回调队列并同步执行，直到队列为空或者达到系统限制
    - 如果 `poll` 队列为空时，会有两件事发生
      - 如果有 `setImmediate` `回调需要执行，poll` 阶段会停止并且进入到 `check` 阶段执行回调
      - 如果没有 `setImmediate` 回调需要执行，会等待回调被加入到队列中并立即执行回调，这里同样会有个超时时间设置防止一直等待下去
- check
  - 执行 `setImmediate`
- close callbacks
  - 执行 `close` 事件


Node宏任务

```js
setTimeout(() => {
    console.log('setTimeout')
}, 0)
setImmediate(() => {
    console.log('setImmediate')
})
```
`setTimeout` 可能执行在前，也可能执行在后
- `setTimeout(fn, 0) ==> setTimeout(fn, 1)`，这是由源码决定的
进入事件循环也是需要成本的，如果在准备时候花费了大于 `1ms` 的时间，那么在 `timer` 阶段就会直接执行 `setTimeout` 回调
- 如果准备时间花费小于 `1ms`，那么就是 `setImmediate` 回调先执行了


```js
const fs = require('fs')

fs.readFile(__filename, () => {
    setTimeout(() => {
        console.log('timeout');
    }, 0)
    setImmediate(() => {
        console.log('immediate')
    })
})
```
`setImmediate` 永远先执行
因为两个代码写在 `IO` 回调中
`IO` 回调是在 `poll` 阶段执行，当回调执行完毕后队列为空
发现存在 `setImmediate` 回调，所以就直接跳转到 check 阶段去执行回调了

Node微任务

在以上每个阶段完成前清空 `microtask` 队列，下图中的 `Tick` 就代表了 `microtask`
![](https://kingan-md-img.oss-cn-guangzhou.aliyuncs.com/blog/20221202114325.png)
```js
setTimeout(() => {
  console.log('timer21')
}, 0)

Promise.resolve().then(function() {
  console.log('promise1')
})
```
和浏览器中的输出是一样的，`microtask` 永远执行在 `macrotask` 前面

## Node 的 process.nextTick

独立于 `Node` 的 `Event Loop` 之外的，它有一个自己的队列，当每个阶段完成后
如果存在 `nextTick` 队列，就会清空队列中的所有回调函数，并且优先于其他 `microtask` 执行。

```js
setTimeout(() => {
 console.log('timer1')

 Promise.resolve().then(function() {
   console.log('promise1')
 })
}, 0)

process.nextTick(() => {
 console.log('nextTick')
 process.nextTick(() => {
   console.log('nextTick')
   process.nextTick(() => {
     console.log('nextTick')
     process.nextTick(() => {
       console.log('nextTick')
     })
   })
 })
})
```
永远都是先把 `nextTick` 全部打印出来。