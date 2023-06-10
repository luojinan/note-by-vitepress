# SSR（Server-Side Rendering）

SSR（Server-Side Rendering）是指在服务端将 React、Vue 等前端框架编写的组件转换为 HTML 字符串，并将这些字符串返回给浏览器。浏览器在接收到 HTML 后，可以直接渲染出页面

相比于客户端渲染，SSR 可以提供更快的首次加载速度和更好的 SEO

## 使用 SSR 的背景

在传统的客户端渲染中，浏览器在接收到 HTML 后，会通过加载 JS、CSS 等资源并执行 JS 代码来渲染出页面。这种方式需要等待所有资源加载完毕并执行完毕后才能展现页面，因此会有一定的加载时间。在某些情况下，这种加载时间会导致用户体验的下降，例如在网络较慢的情况下，用户需要等待较长时间才能看到页面。

SSR 的出现可以解决这个问题。通过在服务端将组件渲染为 HTML 字符串并返回给浏览器，可以让浏览器直接渲染页面，减少首次加载时间。另外，由于搜索引擎无法执行 JS 代码，因此客户端渲染的页面对 SEO 不够友好。使用 SSR 可以让搜索引擎直接抓取到页面的内容，提高 SEO。

在 Web 应用程序中，渲染是将代码转换为用户界面的过程。在传统的 Web 应用程序中，渲染通常是在浏览器中完成的，这种方式称为客户端渲染（Client-Side Rendering，CSR）。但是，在客户端渲染中，浏览器必须等待所有的 JavaScript 代码下载并执行，然后才能渲染出完整的页面。这会导致页面加载时间变慢，用户体验下降。而 SSR（Server-Side Rendering，服务器端渲染）则是一种解决方案，它可以提高网页加载速度和用户体验。


在浏览器端，通过 JavaScript 构建页面时，需要等待 JavaScript 下载、解析和执行，然后才能展示页面内容，这个过程叫做“客户端渲染”。而在服务端渲染时，服务器将页面的 HTML、CSS 和 JavaScript 代码都生成好后一并发送到浏览器，这样浏览器就能直接展示页面内容，无需等待 JavaScript 加载执行，从而加快页面的渲染速度和提升用户体验。

在 SSR 实现的过程中，可以使用模板引擎来构建 HTML 页面，并在服务器端渲染模板引擎的模板，生成完整的 HTML 页面。同时，在服务器端渲染时，需要注意保留浏览器端所需的交互逻辑，比如绑定事件等。

在 SSR 中，还需要考虑数据的获取和同步问题。通常情况下，页面的渲染需要依赖数据，而在客户端渲染时，数据是通过 JavaScript 异步获取的。但在 SSR 中，需要在服务器端同步获取数据，并将数据传递给客户端，这样客户端渲染时就可以直接使用数据，避免了因异步获取数据而导致的页面内容闪烁等问题。

在实现 SSR 时，需要考虑到服务器端和客户端的代码复用问题。为了避免代码的重复编写和维护，可以使用一些框架或库来支持 SSR。比如在 React 中，可以使用 Next.js 来实现 SSR，而在 Vue.js 中，可以使用 Nuxt.js 来实现 SSR。

总的来说，SSR 可以提升页面的渲染速度和用户体验，并且能够帮助搜索引擎抓取页面内容，提高 SEO。在实现 SSR 时，需要考虑到数据获取和同步、代码复用等问题，同时可以使用一些现有的框架或库来支持 SSR 的实现。

SSR 实现的核心是，将应用程序的渲染过程从客户端转移到服务器端。浏览器只需要下载渲染后的 HTML、CSS 和 JavaScript。这意味着用户在浏览器中请求页面时，服务器将返回一个完全呈现的 HTML 页面，而不是一个仅包含标记和脚本的空白文档。可以减少页面加载时间，提高用户体验。

## SSR 的优缺点

### 优点

👇 相比于 CSR，SSR 的好处有：
1. 更快的内容到达时间（Time to First Byte）：由于 SSR 是在服务器端完成渲染组件并将 HTML 字符串返回给浏览器的，因此浏览器可以更快地接收到 HTML 和 CSS。这将减少页面的加载时间，从而提高用户的体验。
2. 更好的 SEO：搜索引擎抓取工具可以直接看到完整的页面内容，而不需要等待 JavaScript 加载完成。这使得搜索引擎能够更准确地识别页面内容，提高了 SEO 的效果。
3. 更好的性能：相比于 CSR，SSR 的首次加载时间可能会稍微慢一些，但是在后续的页面切换中，由于只需要下载渲染后的 HTML、CSS 和 JavaScript，因此性能更好。
4. 更好的可访问性（Accessibility）：通过 SSR 可以提供更好的可访问性，因为可以确保所有的内容都在 HTML 中渲染，无需 JavaScript。这对于需要考虑可访问性的应用程序非常重要。

### 缺点

- SSR 在服务器端执行可能需要更多的资源，包括 CPU 和内存，因为服务器必须渲染页面并发送 HTML 到客户端，这可能会导致服务器负载过高
- 更多的网络传输。由于 HTML 字符串需要从服务端传输到浏览器，因此会有更多的网络传输
- SSR 可能需要更多的开发时间和成本，因为您需要编写服务器端代码来呈现页面，例如数据获取、路由处理、样式处理等
- SSR 可能对某些客户端功能（例如一些动态的交互）有限制，因为某些客户端功能可能需要在客户端上才能运行

## SSR 实现原理

正如上面所说，实现 SSR 需要使用到服务端，因此我们需要先抛弃 **前端静态资源服务器** 的概念

从现在开始，我们的前端应用，是通过 `nodejs` 服务的get请求显示页面的

当 `nodejs服务端` 接收到一个请求时：
1. **匹配路由**：请求的 `URL` 和路由配置，确定需要渲染哪些页面组件
2. **渲染**：将这些组件渲染为 `HTML` 字符串（执行 `JavaScript` 得到 `静态页面HTML` 代码）
3. **响应**：将 `HTML` 字符串返回给浏览器，浏览器直接将 `HTML` 字符串渲染为页面

👆 可以看出，难点在于实现 **匹配路由** 和 **渲染**

### 渲染

SSR 并不是生成一个静态THTML页面就可以了，而是需要同时保留动态交互js，因此需要考虑如何把这部分交互js逻辑注入到静态HTML中，也被称为：将客户端和服务器端的代码合并(服务端负责合并: 客户端动态交互逻辑JS + 服务端处理后的静态页面HTML)

- 页面渲染逻辑: 先获取需要的数据。如通过 API 或其他方式获取数据，并将数据注入到HTML中
- 动态交互逻辑: 用户交互和更新 UI 逻辑

因为在 `CSR客户端渲染应用` 中 `页面渲染逻辑` 和 `动态交互逻辑` 都在原客户端js代码里

而 `SSR服务端渲染应用` 则需要服务端处理 `页面渲染逻辑` 后，也要把 `动态交互逻辑` 处理出来

👇 这个过程可以通过两种方式实现：
- 使用模板引擎，在服务器端生成 HTML 文件时插入客户端 JavaScript 代码。这种方式可以让我们手动管理 HTML 文件，但是需要维护两份代码：服务器端的渲染代码和客户端的 JavaScript 代码。
- 使用前端框架提供的 SSR 解决方案，例如 Nuxt.js 和 Next.js。这些框架通过一些约定和默认配置来简化 SSR 的实现。例如，Nuxt.js 通过约定将所有页面组件放在 `pages` 目录下，然后自动生成对应的路由和服务器端渲染代码。同时，Nuxt.js 还提供了一些内置的模块和插件来简化开发流程，例如 Axios 模块可以帮助我们在客户端和服务器端使用相同的 HTTP 请求库。

正如上面 SSR 的 `nodejs服务端` 难点在于实现 `匹配路由` 和 `渲染` , 而 `渲染` 的难点则在于 `生成静态页面HTML` 和 `合并动态交互逻辑JS`

> 需要注意的是，在服务端渲染时，需要将客户端的状态（例如 Redux 的 store）传递给服务端，以便服务端在渲染组件时使用正确的状态。

## 手写简单 SSR Demo

👇 创建一个 `index.html` 文件，作为我们的 SSR 页面
```html
<!DOCTYPE html>
<html>
  <head><title>SSR Demo</title></head>
  <body>
    <h1>这是一份简易的 SSR Demo，当前时间为：<span id="time"></span></h1>

    <script>
      const now = new Date().toLocaleString();
      document.getElementById('time').innerHTML = now;
    </script>
  </body>
</html>
```

👇 安装依赖
```bash
npm init -y
npm install koa koa-router koa-static
```

👇 创建一个 `index.js` 文件，这个文件就是我们的服务端入口文件
```javascript
const Koa = require('koa');
const Router = require('koa-router');
const serve = require('koa-static');
const fs = require('fs');
const path = require('path');

const app = new Koa();
const router = new Router();

// 定义路由
router.get('/', async (ctx) => {
  // 读取 index.html 文件并返回给客户端
  const file = fs.readFileSync(path.join(__dirname, 'index.html'));
  ctx.type = 'html';
  ctx.body = file;
});

// 静态资源服务
app.use(serve(path.join(__dirname, 'public')));

// 注册路由
app.use(router.routes());

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
```

👇 启动服务端
```bash
node index.js
```

在浏览器中访问 `http://localhost:3000`，页面上显示了当前时间

这个 `DEMO` 仅仅是简单的接管了 `静态资源服务器` 的功能, `nodejs服务端` 把 `前端HTML` 原样输出（获取时间 以及 渲染逻辑 的js发生在浏览器端）

假如是 `SPA` ，此时就是 `nodejs服务端` 原样输出打包后的 `前端HTML`，即 `HTML内容` 依然空白，需要浏览器端加载 `JS` 后渲染页面内容

理想状态则是，`nodejs服务端` 执行JS逻辑，并根据渲染逻辑代码，找出对应的HTML代码进行修改，如上的js逻辑中
1. `nodejs` 执行 `new Date().toLocaleString()` 得出值
2. 遇到 `document.getElementById('time').innerHTML = now` 则匹配出html代码中的 `<span id="time"></span>` 重写为对应的结果
3. 输出 `纯HTML内容` ，去除 `JS内容`

👆所说的步骤是可行的，难点在于 `nodejs端` 需要抹平浏览器端的 `DOM相关渲染逻辑` 为匹配 `HTML字符串` 并重写的逻辑

> 得益于成熟的 `虚拟DOM` 技术，`nodejs端` 不需要识别真正的DOM代码
> 
> 因为客户端js代码提供的就是 有着真实DOM关系的 js对象数据，只需要把这些数据转化为HTML字符串即可

## React SSR Demo

👇 使用 create-react-app 创建一个新的 React 应用。
```bash
npx create-react-app my-app
cd my-app
```

👇 安装相关依赖
```bash
npm install react-dom express compression
```

👇 创建一个 Express 服务器并将 React 组件渲染为 HTML 字符串
```javascript
import express from 'express';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import App from './App';

const app = express();

app.get('/', (req, res) => {
  const html = ReactDOMServer.renderToString(<App />);
  res.send(`
    <html>
      <head>
        <title>My App</title>
      </head>
      <body>
        <div id="root">${html}</div>
      </body>
    </html>
  `);
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
```

👇 `src/App.js`
```js
import React from 'react';

function App() {
  return (
    <div>
      <h1>Hello SSR</h1>
      <p>This is a simple SSR demo</p>
    </div>
  );
}

export default App;
```

👇 启动服务器
```bash
node server.js
```

访问 http://localhost:3000 ，即可看到 SSR 渲染出的页面


## 7. SSR 的最佳实践


1. 使用 Webpack 打包客户端代码，并将打包后的文件放到静态文件目录中，以便浏览器可以访问到它们。

2. 在服务器端，使用 `renderToString` 或 `renderToStaticMarkup` 函数将 React 组件渲染为 HTML 字符串。在 Vue.js 中，使用 `renderToString` 函数将组件渲染为 HTML 字符串。

3. 将渲染好的 HTML 字符串和客户端代码一起发送给浏览器，并在客户端使用 `hydrate` 函数将 HTML 字符串转换为 React 或 Vue 组件。在 Vue.js 中，使用 `createApp` 函数创建一个新的 Vue 实例，并使用 `mount` 函数将组件挂载到 DOM 中。

4. 避免在组件中使用浏览器 API，例如 `window`、`document`、`navigator` 等，因为在服务器端这些 API 是不存在的。

5. 在组件中使用异步数据获取时，需要使用 `getInitialProps` 或 `asyncData` 等函数，在服务器端获取数据并将数据作为 props 传递给组件。在客户端，可以使用 `useEffect`、`useLayoutEffect`、`componentDidMount` 等钩子函数获取数据。

6. 在 SSR 中，需要注意 SEO 的问题。搜索引擎爬虫不会执行 JavaScript 代码，因此需要将页面的核心内容在服务器端渲染为 HTML 字符串，以便搜索引擎爬虫可以正确地抓取页面内容。同时，需要设置正确的页面标题、关键字、描述等 SEO 相关的元信息。

7. 在 SSR 中，需要注意性能问题。因为 SSR 需要在服务器端执行 React 或 Vue 的渲染过程，所以会增加服务器的负载。为了提高性能，可以使用缓存、代码分割、预取等技术来优化 SSR。

8. 在 SSR 中，需要注意安全问题。因为 SSR 将 React 或 Vue 组件渲染为 HTML 字符串，而 HTML 字符串中可能包含恶意代码，因此需要对输入数据进行严格的过滤和验证，以防止 XSS 和其他安全问题的发生。

9. SSR 的实现方式有多种，可以使用 Next.js、Nuxt.js 等框架，也可以手动实现 SSR。在选择 SSR 框架时，需要考虑框架的易用性、性能、扩展性等因素。


## SSR 与 虚拟DOM 的关系

## 参考材料

- [彻底理解服务端渲染 - SSR原理](https://github.com/yacan8/blog/issues/30)
- [vue 实现SSR](https://ainyi.com/116)
