
实际场景


- APP容器运行 WebView 如: Hybrid 应用、mpass
- 小程序: 微信 JS-SDK（WeiXinJSBridge）
- React-Native
- Nodejs( js 调用底层操作系统 C/C++)

![](https://kingan-md-img.oss-cn-guangzhou.aliyuncs.com/blog/20230216160317.png)

👆 `Node Bindings` 就有点类似 `JSBridge` 的功能，所以 `JSBridge` 本身是一个很简单的东西，其更多的是 一种形式、一种思想


![](https://kingan-md-img.oss-cn-guangzhou.aliyuncs.com/blog/20230216160420.png)

👆 核心是建立 `Native` 和 `Javascript` 间消息 双向通信 通道

## 微信 JS-SDK（WeiXinJSBridge）

`<script src="https://res2.wx.qq.com/open/js/jweixin-1.4.0.js"></script>`

自执行函数往 `Window` 全局挂在 `window.wx`类库



## JavaScript 执行 Native (主要)
调用全局挂载的类库方法 这些方法基本都是发布订阅模式, Native方有相应的监听触发 JavaScript 期望的功能

并且在此基础上通知 JavaScript 执行结果或者其他

所以即使最简单的通知 Native 替我们做某事, 也是双向通信(需要通知回来执行结果)

![](https://kingan-md-img.oss-cn-guangzhou.aliyuncs.com/blog/20230216163013.png)

思路简单, 实际编写看封装出的公共性

TODO: liebao 封装📦


## Native 执行 JavaScript

Native 可以调用 WebView 的执行 js 字符串方法