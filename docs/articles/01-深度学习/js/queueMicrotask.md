# queueMicrotask

[Using microtasks in JavaScript with queueMicrotask() - MDN](https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API/Microtask_guide)

## js的微任务
Browser
- MutationObserver
- Promise.then catch finally
- queueMicrotask

Nodejs
- process.nextTick

## queueMicrotask的背景

虽然在过去要入列微任务有可用的技巧（比如创建一个立即 `resolve` 的 `promise）`

但新加入的 `queueMicrotask()` 方法增加了一种标准的方式，可以安全的引入微任务而避免使用额外的技巧

Promise 的问题：
- 当使用 `promise` 创建微任务时，由回调抛出的异常被报告为 `rejected promises` 而不是标准异常 `UnhandledPromiseRejectionWarning`
- 创建和销毁 `promise` 带来了事件和内存方面的额外开销，这是正确入列微任务的函数应该避免的

提供更底层的 `API` 而不是让大家 `hask` 其他方式实现是浏览器完善的趋势

## 🌰 使用

```js
MyElement.prototype.loadData = function (url) {
  if (this._cache[url]) {
    queueMicrotask(() => {
      this._setData(this._cache[url]);
      this.dispatchEvent(new Event("load"));
    });
  } else {
    fetch(url)
      .then((res) => res.arrayBuffer())
      .then((data) => {
        this._cache[url] = data;
        this._setData(data);
        this.dispatchEvent(new Event("load"));
      });
  }
};
```
👆 假如不使用 `queueMicrotask` , 在调用 `loadData()` 会出现2种情况，一种是异步一种是同步，调用行为变成不确定的了

此时给同步情况包裹 `queueMicrotask` 就可以跟 `fetch` 行为一致了，`Promise` 同理

> 警告： 因为微任务自身可以入列更多的微任务，且事件循环会持续处理微任务直至队列为空，那么就存在一种使得事件循环无尽处理微任务的真实风险。如何处理递归增加微任务是要谨慎而行的。


“实现一个 Promise” 在实现时也许可以采用 `queueMicrotask()`

