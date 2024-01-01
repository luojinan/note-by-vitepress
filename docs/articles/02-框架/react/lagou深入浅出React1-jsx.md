# 前端面试宝典之React-1-JSX

[拉勾-深入浅出React逐字稿](https://kaiwu.lagou.com/course/courseInfo.htm?courseId=566)

[B站视频](https://www.bilibili.com/video/BV1j44y1c7yo?p=2&vd_source=c69cd2056fc16100c24229c4b1cfbf99)

[拉勾-深入浅出React逐字稿](https://github.com/87YLu/lagou-crawler/tree/main/download/深入浅出搞定%20React)

`React` 教程总是从 `JSX` 开始，而 `JSX语法` 过一下官方文档就会了，因为本来设计就是 `类HTML` 语法

✨ 我们前期需要重点理解 `React` 如何把 `JSX` 变为 浏览器识别的 `HTML` 的总体流程即可

具体细节与 `React` 真正做的事情相比不重要，更偏向编译原理

## JSX

> `JSX` 会被编译为 `React.creatElement()`
> 
> `React.creatElement()` 返回一个叫做 `ReactElement` 的 `JS 对象`

编译交由 `Babel` 处理

## React.creatElement()

`Babel`： 转译 `JSX语法` --> 带有很多参数的`JS函数调用`

👇 参数如下：
![](https://kingan-md-img.oss-cn-guangzhou.aliyuncs.com/blog/202308131628780.png)

👇 `React.creatElement()` 就是处理这些 标签语法中用的内容 props、子节点关系，如：

![](https://kingan-md-img.oss-cn-guangzhou.aliyuncs.com/blog/202308131630036.png)

容易有的误区：`creatElement()` 没有复杂算法、也没有创建或操作DOM

`React.creatElement()` 是个纯粹的参数转换器，一个数据处理层

`Babel` 转译后的代码(函数调用) 并未执行

而执行后得到的内容就是 `ReactElement` 对象，虚拟DOM！！！

## ReactElement 对象

这个对象 就是 虚拟DOM，老生常谈不细说，就是 JS对象 描述 真实DOM

在 React 环境中，可以直接打印出 虚拟DOM

```js
const Jsx = (<div>
  <h1>i am title</h1>
  <p>i am the content</p>
</div>
)

console.log(Jsx)
```

![](https://kingan-md-img.oss-cn-guangzhou.aliyuncs.com/blog/202308131652142.png)

和 `Vue` 中打印出来 `组件Ref` 类似，都是 `虚拟DOM`

## 渲染

到这里我们发现 `JSX` 内容链路只到了 `虚拟DOM`，并没有到 `真实DOM` 渲染

没错，`JSX` 的知识里，到 `虚拟DOM`( `ReactElement JS对象`) 就结束了

`虚拟DOM` 转 `真实DOM`，因为功能独立，一般作为单独的功能及知识

`ReactDom.render()`

## 整体流程

![](https://kingan-md-img.oss-cn-guangzhou.aliyuncs.com/blog/202308131659443.png)