网络上较好的一篇[whistle](http://wproxy.org/whistle/)教程，适合非前端人员快速了解与上手

集Nginx + Fiddler + Charles + Host配置 + winner等工具于一身的调试工具

是一个 Nodejs 实现的本地服务!

```bash
npm install -g whistle

# 启动
w2 start
# 重启
w2 restart
# 停止
w2 stop
# 调试运行，插件开发调试时使用
w2 run
```


- 设置请求host代理(本地访问域名转ip,等同于自己修改电脑host)
- 设置http转https(自签名证书)
- 抓取HTTP、HTTPS请求响应内容(提供代理网络服务ip,需要自己配置代理功能如手机的wifi自定义、pc浏览器插件`ProxySwitchyOmega`)
- 过滤不需要的url(?)
- 支持替换本地文件(?)
- 支持修改接口返回数据(?)
- 内置调试移动端页面的weinre和log及扩展eruda和vConsole(?)
- 修改请求url、方法、头部、内容及响应状态码、头部、内容等(?)

- [第一章：我为什么推荐大家使用Whistle](https://juejin.cn/post/6844904167404732430)
- [第二章：Whistle是什么及本地安装](https://juejin.cn/post/6844904167396343815)
- [第三章：Whistle之简单使用](https://juejin.cn/post/6844904167408943111)
- [第四章：Whistle项目配置文件](https://juejin.cn/post/6844904167400554510)
- [第五章：Whistle移动端调试](https://juejin.cn/post/6844904167857717262)

## 背景

1. 本地开发启动 Node devServer 静态服务器运行内存中 webpack 编译后的代码，通过 ip 或 localhost 访问
2. 通过 webpack 给 devServer 静态服务器安装 Node 中间件 `http-proxy-middleware` 实现代理访问后端服务器，绕过浏览器直接访问后端服务器跨域的限制

👆 是我们前端工程化的基建，理论上是足够使用的

但是我们也会遇到一些问题，比如：
- 用户的登陆功能，后端接口会校验客户端域名的合法性，只处理特定的域名的请求
- 特定域名下 cookie 的读取等等。这些功能在 localhost 的 host 下可能会受到限制

此时为了调试，我们可能在业务代码里判断 localhost 走内网登录逻辑，或是通过修改本地 host 文件来用域名打开本地项目

而 webpack 的代理后端服务器功能每次修改都需要重启 webpack 服务，如访问不同的测试环境或是访问不同的后端开发本地服务


导致这些不足的背后实质上是两个原因：👇
- 本地开发和线上环境的域名不一致，这就导致了业务代码参杂了环境相关的不纯洁的代码。
- 转发配置与webpack过于耦合，这就致使一旦环境需要变动就不得不进行项目重启。

因此解决的方案也是基于这两点:👇
- 本地开发时，浏览器中访问的是线上域名，即用线上的域名来开发和调试本地代码，做到本地代码和线上代码完全一致而不需要在代码层面做环境区分。
- 将接口代理功能从webpack中抽离，使用其他工具接管这部分功能，webpack不再需要因修改转发配置而重启。

## 本地 host

👆 提到通过修改 host 使用域名打开前端本地静态服务解决一些 localhost 浏览器问题

还可以通过修改 host 使前端项目直接访问生产环境接口，而实际访问的是 host 中配置的环境，此时切换后端服务环境不需要重启 webpack

其他 CDN 等资源服务器同理，开发测试阶段都是直接访问生产域名不区分环境，由每个人的本地 host 管理自己希望访问的地方


