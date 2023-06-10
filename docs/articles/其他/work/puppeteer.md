# Puppeteer

工作中遇到了，希望在移动端调用pc端接口的场景，在后端(登录体系不同,开放移动端使用需要动到稳固的很底层的逻辑)难以配合的情况下，前端尝试使用 `nodejs` 服务，在没有跨域限制下调用pc端接口

面临的登录体系问题，尝试通过模拟登录接口解决，发现有特殊的加解密处理。因此没办法简单的模拟网络请求实现获取登录态。

此时考虑 `headless(无头浏览器)` ，模拟真实前端交互，来获取登录态。

[Puppeteer api](https://pptr.dev/api)

> Puppeteer is a Node.js library
> 
> which provides a high-level API to control Chrome/Chromium over the [DevTools Protocol](https://chromedevtools.github.io/devtools-protocol/).
> 
> Puppeteer runs in [headless](https://developers.google.com/web/updates/2017/04/headless-chrome) mode by default, but can be configured to run in full (non-headless) Chrome/Chromium.

> Puppeteer 是 `Node.js` 工具引擎
> 
> Puppeteer 提供了一系列 API，通过 [Chrome DevTools Protocol](https://chromedevtools.github.io/devtools-protocol/) 协议控制 `Chromium/Chrome` 浏览器的行为
> 
> Puppeteer 默认情况下是以 [headless](https://developers.google.com/web/updates/2017/04/headless-chrome) 启动 `Chrome` 的，也可以通过参数控制启动有界面的 `Chrome`

Puppeteer 默认绑定最新的 Chromium 版本，也可以自己设置不同版本的绑定

Puppeteer 让我们不需要了解太多的底层 CDP 协议实现与浏览器的通信

## What can I do? 

> - Generate screenshots and PDFs of pages.
> - Crawl a SPA (Single-Page Application) and generate pre-rendered content (i.e. "SSR" (Server-Side Rendering)).
> - Automate form submission, UI testing, keyboard input, etc.
> - Create an automated testing environment using the latest JavaScript and browser features.
> - Capture a timeline trace of your site to help diagnose performance issues.
> - Test Chrome Extensions.

> - 网页截图或者生成 PDF
> - 爬取 `SPA` 或 生成预渲染内容(等同于 `SSR(Server-Side Rendering)`)
> - UI 自动化测试，模拟表单提交，键盘输入，点击等行为
> - 创建一个最新的自动化测试环境，使用最新的 `js` 和最新的 `Chrome` 浏览器运行测试用例
> - 捕获网站的时间线，帮助诊断性能问题
> - 测试 `Chrome` 扩展程序

如👇：
- 性能分析机器人
- 截屏、PDF
- 定时预加载任务
- 抽取刷新缓存
- 预发布环境走查
- 接口测试、UI测试
- 爬虫抓取数据
- ...等等

## 单例模式开启 puppeteer

```js
let puppeteer = null

const createPuppeteer = async () => {
  if (!puppeteer) {
    puppeteer = require('puppeteer')
  }
  browser = await puppeteer.launch({
    // headless: false // 关闭无头模式
  })
  page = await browser.newPage()
}
```

1. `puppeteer.launch()` 启动无头浏览器，`headless: false` 代表会打开真实浏览器(方便调试)
2. `browser.newPage()` 打开空标签页


👇 作为一个后端nodejs应用，应控制好单例模式

```js
let puppeteer = null
let browser = null
let page = null

const usePuppeteer = () => {
  const closePage = async () => {
    await browser.close()
    browser = null
    page = null
  }

  const createPuppeteer = async () => {
    if (!puppeteer) {
      puppeteer = require('puppeteer')
    }
    if (browser) {
      await closePage()
    }
    browser = await puppeteer.launch()
    page = await browser.newPage()
  }

  // 单例模式开启无头浏览器的空白标签页
  const getPage = async () => {
    if (!page) {
      console.log('创建新的browser')
      await createPuppeteer()
    }
    console.log('复用前面的page')
    return page
  }

  return {
    getPage,
    closePage
  }
}
```

👇 使用方式
```js
const { getPage, closePage } = usePuppeteer()

// 开启无头浏览器
const page = await getPage()
// 关闭无头浏览器
await closePage()
```

在未调用 `closePage` 关闭前，多次 `usePuppeteer().getPage()` 获取到的page实例是前面创建的那一个

## 导航相关

- `page.goto` ：打开新页面
- `page.goBack` ：回退到上一个页面
- `page.goForward` ：前进到下一个页面
- `page.reload` ：重新加载页面
- `page.waitForNavigation`：等待页面跳转

## waitAndClick 等待元素出现并点击

👇 等待元素出现并点击
```js
/**
 * 等待元素出现并点击 TODO: 超时时间
 * @param {*} param0
 */
const waitAndClick = async ({ page, selectorStr }) => {
  await page.waitForSelector(selectorStr)
  await page.waitForTimeout(100)
  await page.click(selectorStr)
}
```

## page.goto 打开页面并点击某元素

```js
const page = await usePuppeteer().getPage()
await page.goto(url)

waitAndClick({ page, selectorStr: '.change-pc___2wS5N' }) // 切换到账号密码登录
```

## getValByDomAttr 获取元素属性值

👇 获取指定选择器的DOM上的属性值
```js
/**
 * 获取指定选择器的DOM上的属性值
 * @param { page selectorStr attributeStr }
 * @return
 */
const getValByDomAttr = async ({ page, selectorStr, attributeStr }) => {
  const bodyHandle = await page.$('body')
  await page.waitForSelector(selectorStr)

  const attributeVal = await page.evaluate((body, selectorStr, attributeStr) => {
    const codeImg = body.querySelector(selectorStr);
    const val = codeImg.getAttribute(attributeStr);
    return Promise.resolve(val);
  }, bodyHandle, selectorStr, attributeStr);

  return attributeVal ? attributeVal : Promise.reject(createError('获取图形验证码失败,请重试'))
}
```

`page.evaluate(callback)` 将在无头浏览器的作用域中执行 `callback`

注意，参数无法获取到函数作用域，需要通过参数传递，如上的：`body, selectorStr, attributeStr`

## getCodeImg 获取页面元素的图形验证码
```js
/**
 * 获取图形验证码
 * @param {*} loginFrontEndUrl
 * @return
 */
const getCodeImg = async (loginFrontEndUrl) => {
  const page = await usePuppeteer().getPage()

  await page.goto(loginFrontEndUrl)
  waitAndClick({ page, selectorStr: '.change-pc___2wS5N' }) // 切换到账号密码登录
  await page.waitForTimeout(300)

  // ✨ 获取图形验证码地址(base64)
  return getValByDomAttr({
    page,
    selectorStr: '.captcha-img___5RY6i',
    attributeStr: 'src'
  })
}
```

## focusAndInput 聚焦输入框并输入值
👇 聚焦输入框并输入值
```js
/**
 * 聚焦输入框并输入值
 * @param {*} param0
 * @return
 */
const focusAndInput = async ({ page, selectorStr, value }) => {
  if (!value) return
  await page.click(selectorStr, { clickCount: 3 }) // 点击多次以清除原输入值
  await page.type(selectorStr, value, { delay: 10 })
}
```
这里没有用 `focus` 聚焦输入框来输入信息，而是 **点击3次元素** 来聚焦并 **全选原输入的值**



## formInput 输入表单信息

👇 封装📦 纯输入框表单遍历输入值
```js
/**
 * 纯输入框表单输入值
 * @param {*} param0
 */
const formInput = async ({ page, formList }) => {
  for (let i = 0; i < formList.length; i++) {
    const { selectorStr, value } = formList[i]
    await focusAndInput({
      page,
      selectorStr,
      value
    })
  }
}
```

使用如👇：输入表单信息，账号、密码、图形验证码
```js
await formInput({
  page,
  formList: [
    { selectorStr: '#userName', value: username },
    { selectorStr: '#password', value: password },
    { selectorStr: '#graphicsCode', value: graphicsCode }
  ]
})
```

## waitForResponse 获取接口请求结果

```js
const firstResponse = await page.waitForResponse('https://xxxx/login')
const loginRes = await firstResponse.json()
```

[page.waitForResponse()](https://pptr.dev/api/puppeteer.page.waitforresponse) 返回的是一个 `respond实例`(带各种工具函数)，不是具体的结果

调用 `respond实例` 的 `.json()` 获取接口结果

实际应用场景：如👆的登录表单场景，调用登录接口可能 账号密码错误/图形验证码错误，这些提示信息在页面元素中通过toast体现，比较难捕获错误信息

而获取接口结果就可以应对任意的登录响应结果，如👇：遇到登录错误，就重新获取获取图形验证码返回

```js
const firstResponse = await page.waitForResponse('https://xxxx/login')
const loginRes = await firstResponse.json()

if (loginRes.code !== 0) {
  // 登录失败获取新的图形验证码-账号错误、验证码错误等 更换图形验证码重试
  const codeimg = await getCodeImg()
  
  const res = { ...loginRes, codeimg } // 返回重新获取的图形验证码
  return Promise.reject(res)
}
```
👆 这里遇到无法获取图形验证码的问题，多次测试，猜测是因为输入表单以及点击按钮速度过快，导致的无头浏览器页签失焦

👇 因此手动聚焦一次页面

```js
await page.focus('#graphicsCode') // 手动聚焦页面以 防止输入速度过快导致的无法获取元素
const codeimg = await getCodeImg()
```

但是还遇到了 **偶现获取的图形验证码是旧的** 即重新获取的图形验证码没有变化，但是无头浏览器中图形验证码有变化

👇 添加延时也没有解决
```js
page.waitForTimeout(100) // FIXME: 偶现获取的图形验证码是旧的
await page.focus('#graphicsCode') // 手动聚焦页面以 防止输入速度过快导致的无法获取元素
const codeimg = await getCodeImg()
```

## page.cookies 获取无头浏览器的cookies

```js
const cookiesList = await page.cookies()
```

实际使用场景：如👆的登录场景，无头浏览器登录完成后，会往页签环境种下cookies(页签打开的页面前端实现)，我们可以取处理后种下的cookies出来，返回，并种到自己的环境

而假设当前后端 nodejs服务，与前端同域，则直接在nodejs端种好cookies即可，会通过网络请求同步到前端

👇 如 eggjs：

```js
const { ctx } = this

const { cookiesList } = await login(ctx.request.body) // 从无头浏览器中获取到的cookies
for (const item of cookiesList) {
  ctx.cookies.set(item.name, item.value, {
    httpOnly: false,
    signed: false,
  }) // 直接往当前服务(与移动端同域)设置cookie
}
```

[eggjs-cookie](https://eggjs.github.io/zh/guide/cookie.html#%E5%85%81%E8%AE%B8%E5%89%8D%E7%AB%AF%E8%AF%BB%E5%8F%96-cookie)

## 其他场景

### 截图

👇 开启无头浏览器
```js
const browser = await puppeteer.launch();
const page = await browser.newPage();
//设置可视区域大小
await page.setViewport({width: 1920, height: 800});
await page.goto('https://xxxx');
```
👇 执行截图指令
```js
//对整个页面截图
await page.screenshot({
  path: './files/capture.png',  //图片保存路径
  type: 'png',
  fullPage: true //边滚动边截图
  // clip: {x: 0, y: 0, width: 1920, height: 800}
});
```
👇 执行截图指令
```js
//对页面某个元素截图
let [element] = await page.$x('/html/body/section[4]/div/div[2]');
await element.screenshot({
  path: './files/element.png'
});
```

👇 关闭无头浏览器
```js
await page.close();
await browser.close();
```

### 请求拦截

👇 开启无头浏览器
```js
const browser = await puppeteer.launch();
const page = await browser.newPage();
```

👇 设置拦截(针对页签,不一定要先进入页面地址)
```js
const blockTypes = new Set(['image', 'media', 'font']);
await page.setRequestInterception(true); //开启请求拦截
page.on('request', request => {
  const type = request.resourceType();
  const shouldBlock = blockTypes.has(type);
  if(shouldBlock){
    //直接阻止请求
    return request.abort();
  }else{
    //对请求重写
    return request.continue({
      //可以对 url，method，postData，headers 进行覆盖
      headers: Object.assign({}, request.headers(), {
        'puppeteer-test': 'true'
      })
    });
  }
});
```

👇 先设置拦截再打开指定地址
```js
await page.goto('https://xxx');
await page.close();
await browser.close();
```

其他监听事件：
- `page.on('close')` 页面关闭
- `page.on('console')` console API 被调用
- `page.on('error')` 页面出错
- `page.on('load')` 页面加载完
- `page.on('request')` 收到请求
- `page.on('requestfailed')` 请求失败
- `page.on('requestfinished')` 请求成功
- `page.on('response')` 收到响应
- `page.on('workercreated')` 创建 webWorker
- `page.on('workerdestroyed')` 销毁 webWorker

### 植入nodejs代码

👇 开启无头浏览器
```js
const browser = await puppeteer.launch();
const page = await browser.newPage();
await page.goto('https://webmail.vip.188.com');
```

👇 `page.exposeFunction()` 往浏览器上下文 `window` 注入 `nodej` 函数，`page.evaluate()` 执行浏览器上下文逻辑
```js
//注册一个 Node.js 函数，在浏览器里运行
await page.exposeFunction('md5', text =>
  // crypto 是 nodejs 内置模块
  crypto.createHash('md5').update(text).digest('hex')
);

//通过 page.evaluate 在浏览器里执行浏览器上下文逻辑
await page.evaluate(async () =>  {
  //在页面中调用 Node.js 环境中的函数
  const myHash = await window.md5('PUPPETEER');
  console.log(`md5 of ${myString} is ${myHash}`);
});
```

👇 关闭无头浏览器
```js
await page.close();
await browser.close();
```

### 页面性能分析

- 一个浏览器同一时间只能 trace 一次
- 通过 tracing 我们获取页面加载速度以及脚本的执行性能
- 在 devTools 的 Performance 可以上传对应的 json 文件并查看分析结果
- 我们可以写脚本来解析 trace.json 中的数据做自动化分析

```js
const browser = await puppeteer.launch();
const page = await browser.newPage();
```
```js
await page.tracing.start({path: './files/trace.json'});
await page.goto('https://www.google.com');
await page.tracing.stop();
/*
  continue analysis from 'trace.json'
*/
```
```js
browser.close();
```

### 爬虫抓取数据

```js
const search_text = '漫威';
const size = 15; // 每页搜索结果数
let start = 0; // 起始page
const browser = await puppeteer.launch({
  headless: false
})
const page = await browser.newPage()
const crawlMovies = async () => {
  await page.goto(`https://movie.douban.com/subject_search?search_text=${encodeURIComponent(search_text)}&start=${start * size}`, {waitUntil: 'domcontentloaded'})
  console.log(`crawling page ${start + 1}...`);
  // page.evaluate 里的 currentStart 参数需要传进去，不能直接使用外部参数
  let result = await page.evaluate((currentStart) => {
    // 获取该页所有电影标题
    let list = Array.from(document.querySelectorAll('.detail')).map((item) => {
      return item.querySelector('.title a').innerHTML;
    });
    // 判断是否是最后一页，作为递归退出的条件
    let maxStart = Math.max.apply(null, Array.from(document.querySelectorAll('.paginator a')).map((item) => {
      let startNum = 0;
      try {
        startNum = item.getAttribute('href').match(/\d+$/)[0];
      } catch (e) {
      }
      return startNum;
    }))
    return {
      list: list,
      isEnd: currentStart > maxStart
    }
  }, start * size);
  if (result.isEnd) {
    return result.list;
  }
  start += 1;
  return result.list.concat((await crawlMovies()))
}

const movieList = await crawlMovies()
console.log(JSON.stringify(movieList, null, 2))
```

## 部署

[docker服务器中使用puppeteer踩坑记录](https://juejin.cn/post/7178734705703911480)

## 总结

上面列出了一系列，我实际场景使用到的 `puppeteer` 中的工具函数，串起来就会是一个完整的 **通过无头浏览器操作表单完成登录** 的过程：

1. 开启无头浏览器，打开空白页签，并打开指定页面
2. 获取图形验证码src(base64)
3. 输入表单：账号、密码、图形验证码
4. 点击登录，并监听接口返回
5. 获取登录后无头浏览器页签的cookie，并返回

## 参考资料

- [Puppeteer api](https://pptr.dev/api)
- [结合项目来谈谈 Puppeteer](https://zhuanlan.zhihu.com/p/76237595)
- [Web Performance Recipes With Puppetee](https://addyosmani.com/blog/puppeteer-recipes/)
- [nestjs puppeteer 掘金签到](https://juejin.cn/post/7051521399168434184)
