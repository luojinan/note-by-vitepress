
# HTML

## meta

`http-equiv="Refresh"`

自动刷新
```html
<meta http-equiv="Refresh" content="60">
```

每 60s 刷新一次页面(大屏监控场景,一般也是局部刷...)

自动跳转

```html
<meta http-equiv="Refresh" content="5;URL=page2.html">
```

多页幻灯片场景

单页路由的 URL 可以生效吗


## 页签 title

`document.title = 'xxx'` 可以修改页签 title

在页签退到后台时，现在可以通过 `Web Notifications API` 弹出系统消息

但是以前只能通过 页面title 提醒用户

如：使用 webSocker 或者 前端轮询 来获取通知内容和时机，弹出系统消息 或者 修改页签title

```js
let msgNum = 1 // 消息条数
let cnt = 0 // 计数器

const interval = setInterval( ()=> {
  cnt = (cnt+1) %2
  // 已读时： 消息条数为0
  if(msgNum === 0) {
    document.title = '页面'
    clearInterval(interval)
    return
  }
  // 单数隐藏 双数显示 实现闪烁
  const prefix = cnt % 2 ? `新消息(${msgNum})` : ''
  document.title = `${prefix}页面`
})
```

下载进度、当前操作步骤(单页时由路由配置实现)

## 异步script

![](https://kingan-md-img.oss-cn-guangzhou.aliyuncs.com/blog/20230401172150.png)
👆 绿色解析 `HTML`， 蓝色下载资源， 红色执行资源

`<script>` `ESModule` 时, 默认 `defer`，且依赖模块资源也是并行下载的

## 预请求`<link>`

![](https://kingan-md-img.oss-cn-guangzhou.aliyuncs.com/blog/20230401173237.png)

`<link rel="xxxx" href="http://xxxx">`

- `preconnect`: 预连接服务器,包括 `DNS解析`、`HTTPS 协商`、`TCP握手`
- `prefetch`: 预下载资源，浏览器忙时可能会不下载(🤔 `http2` 时不存在下载忙的情况吧)
- `preload`: 预下载资源，浏览器忙时也会下载
- `prerender`: 预执行并先渲染

## 为什么操作DOM耗时

浏览器单线程，切换 `渲染引擎` 和 `JS引擎`，内存和上下文切换损耗

![](https://kingan-md-img.oss-cn-guangzhou.aliyuncs.com/blog/20230401175622.png)

👆 操作 `JS引擎` 内的东西性能明显比 `操作DOM` 要好

渲染引擎，`重排重绘` 耗时

![](https://kingan-md-img.oss-cn-guangzhou.aliyuncs.com/blog/20230401180204.png)

![](https://kingan-md-img.oss-cn-guangzhou.aliyuncs.com/blog/20230401180254.png)


## 批量操作元素

虚拟DOM
