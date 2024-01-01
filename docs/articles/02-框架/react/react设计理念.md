## 草稿

前端框架想要解决的问题的是：浏览器快速响应
- CPU瓶颈
- IO瓶颈(input/output)不止网络请求，包含所有交互、指令、响应等


👇 输入框数字+10000，填充 fill 成响应数量的数组，渲染相应数量的dom
![](https://kingan-md-img.oss-cn-guangzhou.aliyuncs.com/blog/202307302035822.png)

键盘输入的反显到输入框明显卡顿，因为渲染阻塞下一步的键盘监听事件

React 提出了时间切片来处理（实现 **单线程处理** 的插队控制，并不是减少时间销毁而是优先处理用户感知的交互

![](https://kingan-md-img.oss-cn-guangzhou.aliyuncs.com/blog/202307302045333.png)
立即执行 dom渲染，延迟执行change事件

useTransition 标识让优先级高的chage事件先触发，渲染事件优先级低

体现在页面是先显示end，再显示列表dom

`useEffect`
处理当前组件UI意外的操作，如修改 `document.title`
