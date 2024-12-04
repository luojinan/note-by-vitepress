# Service Worker

1. service worker 基本使用和生命周期机制
2. 使用 service worker 代理请求缓存
3. 利用 service worker 更新机制

## 认识 Service Worker

[Service_Worker_API - MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/Service_Worker_API#service_worker_%E7%9A%84%E6%A6%82%E5%BF%B5%E5%92%8C%E7%94%A8%E6%B3%95)

### 什么是 Service Worker

`Service Worker`是浏览器在后台独立于网页运行的、用JavaScript编写的脚本。Service Worker 中运行的代码**不会被普通JS阻塞**，也不会阻塞其他页面的 JS 文件中的代码；  

这个脚本与普通js脚本的区别主要是因为他们的运行容器不同，在普通页面脚本中，有许多宿主对象可以使用，如`window`, `document`, `localstorage`等，这些是service worker无法使用的。worker中的全局对象变成了`self`。  

其次，service worker被设计成完全异步的，所以需要尽量避免在其中使用需要长时间计算的同步逻辑

Service Worker 是一个浏览器中的**进程**而不是浏览器内核下的线程，因此它在被注册安装之后，能够被在多个页面中使用，也不会因为页面的关闭而被销毁。

> **Service Worker要求HTTPS，但为了开发调试方便，localhost除外。**

> **Service Worker脚本缓存规则与一般脚本不同。如果设置了强缓存，并且max-age设置小于24小时，那么与普通http缓存无异，但是如果max-age大于24小时，那么service worker文件会在24小时之后强制更新**

[浏览器支持情况](https://caniuse.com/?search=ServiceWorkers)

### Service Worker 能做什么?

由于它能够拦截全局的fetch事件，以及能在后台运行的能力等，可以做到 `缓存静态资源` 、`离线缓存`和`后台同步`等

![](https://kingan-md-img.oss-cn-guangzhou.aliyuncs.com/blog/20240610221000743.png?x-oss-process=image/format,webp/resize,w_720)

- 后台数据同步
- 响应来自其他源的资源请求
- 集中接收计算成本高的数据更新，比如地理位置和陀螺仪信息，这样多个页面就可以利用同一组数据
- 在客户端进行 CoffeeScript、LESS、CJS/AMD 等模块编译和依赖管理（用于开发目的）
- 后台服务钩子
- 自定义模板用于特定 URL 模式
- 性能增强，比如预取用户可能需要的资源，比如相册中的后面数张图片

### 注册 Service Worker

```js
try {
  const registration = await navigator.serviceWorker.register("/sw.js", {
    scope: "/",
  });
  if (registration.installing) {
    console.log("正在安装 Service worker");
  } else if (registration.waiting) {
    console.log("已安装 Service worker installed");
  } else if (registration.active) {
    console.log("激活 Service worker");
  }
} catch (error) {
  console.error(`注册失败：${error}`);
}
```

为什么我的 service worker 注册失败了？：

- 没有在 HTTPS 下运行
- 不允许你的 app 指向不同源（origin）的 service worker。
- service worker 只能在 service worker 作用域内捕获客户端发出的请求。
- service worker 最大的作用域是 worker 所在的位置（换句话说，如果脚本 sw.js 位于 /js/sw.js 中，默认情况下它只能控制 /js/ 下的 URL）。可以使用 Service-Worker-Allowed 标头指定 worker 的最大作用域列表。
- 在 Firefox 中，若用户处于无痕浏览模式、禁用了历史记录或者启用了在 Firefox 关闭时清除历史记录，Service Worker API 将被隐藏而无法使用。
- 在 Chrome 中，当启用“阻止所有 Cookie（不建议）”选项时，注册将会失败。

### Scope 是什么?

Service Worker 注册的默认作用域是与脚本网址相对的 ./
可以在注册时通过传入 Scope 参数配置作用域。  
想知道客户端是否受 SW 控制，可以通过通navigator.serviceWorker.controller（其将为 null 或一个 Service Worker 实例）检测

### 注册失败会怎样?

在调用 navigator.serviceWorker.register(sw.js) 注册 Service Worker 实例时，返回一个Promise。如果 sw.js 脚本在初始执行中未能进行下载、解析，或引发错误，则注册器 promise 将拒绝，并舍弃此 Service Worker。可以通过 catch 来捕获错误信息；如果注册成功，可以使用 then 来获取一个 ServiceWorkerRegistration 的实例

Chrome 的 DevTools 在控制台和应用标签的 Service Worker 部分中显示此错误

> ✨ install 示例 - 引出修改sw时没有执行新的console

### 如何通信

service worker挂载在`navigator.serviceWorker.controller`上，所以可以通过controller进行通讯。与web worker的postMessage类似，在service worker中则是使用 `self.clients`来send消息。  

注意，`self.clients` 能得到哪些 clients ，和scope设置有关。

👇 客户端网页 app.js

```javascript
// 客户端 向 sw 发送hello
navigator.serviceWorker.controller.postMessage('hello');  
// 客户端 接收 sw 的消息
navigator.serviceWorker.addEventListener('message', function(e) {
  console.log(e.data); // 打印： response from service worker
})
```

👇 sw

```js
// sw.js
// sw 接收 客户端 的消息
self.addEventListener('message', e => {
  console.log(e.data);  // 打印：hello
  // sw 向 客户端 发送消息
  e.source.postMessage('response from service worker')
});
```

👇 sw 可以主动向其他窗口发送消息，不局限于source页面

```javascript
// sw.js
(async function() {
  let cls = await self.clients.matchAll();
  cls.forEach(cl => cl.postMessage('message from service worker')); //
})();
```

对于不同 scope 的多个 Service Worker ，我么也可以给指定的 Service Worker 发送信息。

```javascript
// index.js
if ('serviceWorker' in window.navigator) {
  navigator.serviceWorker.register('./sw.js', { scope: './sw' })
    .then(function (reg) {
      reg.active.postMessage("this message is from page, to sw");
    })
    
  navigator.serviceWorker.register('./sw2.js', { scope: './sw2' })
    .then(function (reg) {
      reg.active.postMessage("this message is from page, to sw 2");
    })
}

// sw.js
this.addEventListener('message', function (event) {
  console.log(event.data); // this message is from page, to sw
});

// sw2.js
this.addEventListener('message', function (event) {
  console.log(event.data); // this message is from page, to sw 2
});

```

与其它地方的postMessage类似，也可以通过MessageChannel进行通讯：

```js
const channel = new MessageChannel();

navigator.serviceWorker.controller.postMessage('hello', [channel.port1]);

channel.port2.onmessge = function(e) { console.log(e.data); }

// sw.js
self.addEventListener('message', e => {
  e.ports[0].postMessage('message from service worker');
});
```

> ✨ postmsg 示例

### 主要事件

[service worker 事件 - MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/Service_Worker_API/Using_Service_Workers#%E6%BC%94%E7%A4%BA)

- `install`: 安装时触发，参考生命周期 Installing。  
    通常在这个事件里缓存静态资源文件，存到CacheStorage里
- `activate`：激活时触发，参考生命周期 Activating。  
    通常在这个事件里进行重置操作，例如处理旧实例缓存等
- `message`：事件通信触发

功能性事件：

- `fetch`：浏览器发起http请求时触发，通常在这个事件里匹配缓存
- `push`：推送通知时触发
- `sync`：后台同步时触发

### 生命周期

生命周期分为：Installing -> Installed(Waiting) -> Activating -> Activated -> Redundant

![](https://kingan-md-img.oss-cn-guangzhou.aliyuncs.com/blog/20240613173438397.png?x-oss-process=image/format,webp)

![](https://developer.mozilla.org/zh-CN/docs/Web/API/Service_Worker_API/Using_Service_Workers/sw-lifecycle.svg)

1. **Download**
2. **Register**：注册 Service Worker 时，service worker 将在 `ServiceWorkerGlobalScope` 中执行；这本质上是一种特殊的上下文，在主脚本执行线程之外运行，没有访问 DOM 的权限。Service Worker 现在已为处理事件做好准备。
3. **Install**：当注册成功后，就进入了 Installing 阶段。每个 Service Worker 只会调用一次安装事件。  
   - install 事件始终是发送给 service worker 的第一个事件（这可用于启动填充 IndexedDB 和缓存站点资源的过程）
   - 在这个阶段，可以通过返回event.waitUntil()的Promise来告诉浏览器什么时候**安装**完成了。  
   - 还可以通过 `self.skipWaiting()` 来跳过下面的 Waiting 阶段（谨慎使用）
4. **Installed（Wait）**：已存在 Service Worker 的情况下，当 `新Service Worker` 安装完成后，就进入 Waiting 阶段。因为需要确保浏览器只运行一个Service Worker版本。所以在所有相关客户端都关闭之前，都不会激活当前的Service Worker。  
   - 假设使用Chrome打开了两个tab来运行有 旧Service Worker 网页, 那么 旧Service Worker 就控制了两个客户端。当完全关闭Chrome之后，再次打开网页，新Service Worker 才会进入到激活阶段。
5. **Activate**：Service Worker 安装完成后，激活时触发。此时已经没有客户端被 旧Service Worker 控制了。  
   - 注意，当前打开的客户端（调用register的页面）仍然不受它控制。文档必须重新加载才能真正的受到控制。而调用`clients.claim()` 则可以声明提前控制所有客户端，它才具备处理`push,sync和fetch`功能性事件的能力。  
   - 在这个阶段，可以通过返回 `event.waitUntil()` 的Promise来告诉浏览器什么时候**激活**完成了。  
   - 还可以通过 `self.skipWaiting()` 来跳过 Waiting 阶段（一般不在这里使用）
6. **Activated**：已经激活完成。此时可以处理事件了（比如拦截fetch返回缓存等）
7. **Redundant**：新Service Worker 正常激活后，旧Service Worker 会变成这个状态

可以看出来，并不是每个生命周期都有对应的事件可以操作(`Install、Activate`)的。仔细理解生命周期，理解后下面的工作流程会很轻松

因为设计的目的是：不希望同一 service worker 的两个不同版本同时运行，所以才会有这么复杂绕口的生命周期 😵‍💫，这也是很多应用层面设计灰度方案、前端项目很少设计多版本并存的原因

> `event.waitUntil` 控制功能性事件延迟接管

![](https://kingan-md-img.oss-cn-guangzhou.aliyuncs.com/blog/20240613143636187.png?x-oss-process=image/format,webp)

## 首次 Service Worker 工作流程

结合上面的生命周期，我们可以看到流程如下：

1. `注册` 首次打开网页，调用 `serviceWorker.register()`，传入对应的 sw 脚本，注册对应的 Service Worker 实例

2. `下载` 注册成功后，用户首次访问 Service Worker 控制的网站或页面时，Service Worker 会被下载到客户端，这将作用于整个域内用户可访问的URL或特定子集（Scope）。

3. `安装` 首次启用 Service Worker，页面会尝试安装。如果 Install事件回调函数中的操作都执行成功，标志 Service Worker 安装成功，进入下一阶段。如果使用了 cache API 遇到任何文件下载失败或缓存失败，那么安装步骤失败，该 Service Worker 会被丢弃。

4. `激活` 安装成功后会进入激活（不等于受控），激活成功后，此时页面依旧不会缓存。因为是首次注册该 Service Worker ，需要**刷新**后才接管相应页面的控制权，从而处理fetch、post、sync等事件。

### 首次注册激活的 Service Worker 需要再次加载来生效

```js
// index.js
// 3s后创建了一个 src 为 "/dog.svg" 的image

  navigator.serviceWorker.register('/sw.js')
    .then(reg => console.log('SW registered!', reg))
    .catch(err => console.log('registered err', err));

  setTimeout(() => {
    const img = new Image();
    img.src = '/dog.svg';
    document.body.appendChild(img);
  }, 3000);
```

```js
// sw.js

self.addEventListener('install', event => {
  console.log('V1 installing…');

  event.waitUntil(
    caches.open('static-v1').then(cache => cache.add('/cat.svg'))
  );
});

self.addEventListener('activate', event => {
  console.log('V1 now ready to handle fetches!');
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  if (url.origin == location.origin && url.pathname == '/dog.svg') {
    event.respondWith(caches.match('/cat.svg'));
  }
});
```

Service Worker 在 install 里加入了缓存图片 cat.svg。并在请求 /dog.svg 时提供该图像。然而我们第一次打开页面时（也就是首次注册/激活SW实例时），会发现，尽管3s后才去获取 /dog.svg（此时SW应该已经激活），但实际返回的不是我们预想的 /cat.svg，还是 /dog.svg

刷新后，出现 /cat.svg

> 误区：修改sw，出现/cat.svg，以为是install新的sw会触发接管，实际只是热更新触发了刷新，接管fetch和新的sw没有关系，并且此时新的sw没有激活

### 如果我不想重刷呢?

我们从上述例子知道了，Service Worker 激活后，需要重刷一次才能真正接管控制权。那我不想重刷呢？ **那就使用`clients.claim()`**

```js
// sw.js

...

self.addEventListener('activate', event => {
+  event.waitUntil(clients.claim());
   console.log('Now ready to handle fetches!');
});

```

有了这行代码后， SW 就会立马接管网页控制权。如果sw.js执行够快，在3s以内，那此时即使不刷新我们也会看到 /cat.svg

## 更新 Service Worker 流程

是否更新service worker首先是由浏览器来决定的，只有当前后两个service worker文件在内容上不同的时候浏览器才会启动新的Service Worker的注册安装流程

### 简述

1. 注册: 打开网页A，调用 `serviceWorker.register()`，发现脚本已更新，注册新的 Service Worker 实例。同时旧实例依旧启用。

2. 下载: 同首次下载流程

3. 安装: 新Service Worker

4. waiting/激活: Service Worker 安装完成后，因为已有 Service Worker 被启用，那新版本会进入 Waiting 状态。直到所有已打开界面（这里就是网页A）不再使用 旧Service Worker 后，一般是关闭页面，新Service Worker 才触发激活钩子（常用于清空数据等）

### 理解**Waiting状态**

我们试图把原本返回的 /cat.svg 改为 /mouse.svg

```js
  
  self.addEventListener('install', event => {
    console.log('V2 installing…');
    event.waitUntil(
+     caches.open('static-v2').then(cache => cache.add('/horse.svg'))
    );
  });
  
  ...
  
  self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);

    if (url.origin == location.origin && url.pathname == '/dog.svg') {
+     event.respondWith(caches.match('/mouse.svg'));
    }
  });

```

我们期望的是，现在不返回 /cat.svg 而是 /mouse.svg，但实际却还是看到了 /cat.svg 。为什么?

**分析：**

- 打开网页A，浏览器检测到脚本内容发生了改变，尝试重新注册新的 Service Worker，旧Service Worker 依旧启用
- 安装时，在新的脚本里，缓存名从 'static-v1' -> 'static-v2'，也就是说，新旧缓存不会覆盖，独立存在
- 安装成功，由于网页A中 旧Service Worker 依旧在运行，所以 新Service Worker 处于Waiting阶段，因为浏览器需要确保同一时间只运行一个 Service Worker。可在 Chrome 的 DevTools 里查看状态
- **刷新界面，会发现 新Service Worker 依旧Waiting**  
    原因可能是：由于浏览器的内部实现原理，当页面切换或者自身刷新时，浏览器是等到新的页面完成渲染之后再销毁旧的页面。这表示新旧两个页面中间有共同存在的交叉时间，由于存在这种重叠情况，在刷新时当前 Service Worker 始终会控制一个页面。
- 关闭浏览器或关闭网页A，重新打开后， 新Service Worker 会激活，进而获取控制权。此时显示 /mouse.svg

### Service Worker 什么时候接管?

旧 Service Worker 退出时将触发 Activate，新 Service Worker 将能够控制客户端。此时可以处理一些迁移数据库或清除缓存的工作。将一个 promise 传递到 event.waitUntil()，它将清除缓存后，才真正激活接管

```js
// sw.js
const expectedCaches = ['static-v2'];

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(key => {
        if (!expectedCaches.includes(key)) {
          return caches.delete(key);
        }
      })
    )).then(() => {
      console.log('V2 now ready to handle fetches!');
    })
  );
});
```

> ✨ 示例fetch - 修改sw 不会立即图片

## 静态资源缓存

正常情况下，用户打开网页，浏览器会自动下载网页所需要的 JS 文件、图片等静态资源。但是如果用户在没有联网的情况下打开网页，浏览器就无法下载这些展示页面效果所必须的资源，页面也就无法正常的展示出来。

我们可以使用 Service Worker 配合 CacheStroage 来实现对静态资源的缓存。 **CacheStorage** service worker的缓存能力主要与`self.caches`对象有关，这是一个CacheStorage对象，在普通页面中也可以使用，但是一般用在service worker中  
我们需要注意以下几点：

- Cache Storage只能用在https环境中
- Cache Stroage 只能缓存静态资源，所以它只能缓存用户的 GET 请求
- Cache Stroage 中的缓存不会过期，但是浏览器对它的大小是有限制的，所以需要我们定期进行清理

### 缓存指定静态资源

```javascript
// sw.js
this.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open('sw_1').then(function (cache) {
      return cache.addAll([
        '/style.css',
        '/main.jpg',
        './main.js'
      ])
    }
    ));
});
```

1. 我们使用 `caches.open` 方法新建或打开一个已存在的缓存
2. `cache.addAll` 方法的作用是请求指定链接的资源并把它们存储到之前打开的缓存中
3. 由于资源的下载、缓存是**异步行为**，所以我们要使用事件对象提供的 `event.waitUntil` 方法，它能够保证资源被缓存完成前 Service Worker 不会被安装完成，避免发生错误。

从 Chrome 开发工具中的 Application 的 Cache Strogae 中可以看到我们缓存的资源。

### 缓存fetch静态资源

```js
// 针对 GET 有效
this.addEventListener('fetch', function (event) {
  console.log(event.request.url);
  
  event.respondWith(
    caches.match(event.request).then(res => {
      // res有值证明缓存有资源，没值则fetch并存入cache
      return res ||
        fetch(event.request)
          .then(responese => {
            const responeseClone = responese.clone();
            caches.open('sw_1').then(cache => {
              cache.put(event.request, responeseClone);
            })
            return responese;
          })
          .catch(err => {
            console.log(err);
          });
    })
  )
});
```

我们需要监听 fetch 事件，每当用户向服务器发起请求的时候这个事件就会被触发。有一点需要注意，**页面的路径不能大于 Service Worker 的 scope**，不然 fetch 事件是无法被触发的。

1. 使用事件对象提供的 `respondWith` 方法劫持用户发出的 http 请求，并把一个 Promise 作为响应结果返回给用户
2. 在 Cache Stroage 匹配请求，如果匹配成功，则返回缓存中的资源；如果匹配失败，则向服务器请求资源，将原返回数据返回给用户。因为请求和响应流只能被读取一次，在响应里使用 `clone` 方法复制一份数据，并使用 `cache.put` 方法把复制数据存储在缓存中。

### 拦截fetch自定义逻辑

1. 仅缓存 所有请求都从缓存里读取 **何时使用：通常用于获取不变的静态资源。**

```js
self.addEventListener('fetch', function(event) {
  // 如果缓存中没有找到，响应看起来和connection错误一样
  event.respondWith(caches.match(event.request));
});
```

2. 仅网络 客户端发出请求，Service Worker 拦截该请求并将请求发送到网络。 **何时使用：当不是请求静态资源时，比如 ping 检测、非 GET 的请求。**

```js
self.addEventListener('fetch', function(event) {
  event.respondWith(fetch(event.request));
});
```

其实，如果我们不使用 **responseWith** 方法，请求也会正常发出。

3. 缓存优先，如果请求缓存不成功，Service Worker 则会将请求网络。 **何时使用：当您在构建离线优先的应用时**

```lua
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});
```

4. 网络优先 Service Worker 将向网络发出一个请求，如果请求成功，那么就将资源存入缓存。 **何时使用：当您在构建一些需要频繁改变的内容时，此策略便是首选。**

```lua
self.addEventListener('fetch', function(event) {
  event.respondWith(
    fetch(event.request).catch(function() {
      return caches.match(event.request);
    })
  );
});
```

此方法存在缺陷。如果用户的网络时断时续或很慢，这需要花很长的时间。

5. 常规回退(404兜底) 当两个请求都失败时（一个请求失败于缓存，另一个失败于网络），您将显示一个通用的回退，以便您的用户不会感受到白屏或某些奇怪的错误。

```js
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    }).catch(function() {
      return caches.match('/offline.html');
    })
  );
});
```

## 控制更新方案

我们从上一章可以直到，当Service Worker 更新时，会出发install 事件，虽然这个事件触发后，浏览器不会立即进入激活阶段，而是会进入等待阶段。

那我不就可以利用这个特性，在每次上线时，更新一下sw文件，然后在sw的install事件里做手脚来实现让用户更新了吗！！！ 😈

### skipWaiting 方案

可以在 install 或 activate 事件（通常在install里）里调用 self.skipWaiting() 来跳过Waiting阶段。这会导致新Service Worker 将旧Service Worker停用，并在Waiting阶段立即进入激活阶段。

```js
  self.addEventListener('install', event => {
+   self.skipWaiting();
    ...
  });
```

👆 激活受控后，所有的fetch会走sw，就可以添加fetch header 控制http缓存头了，当然如果做资源缓存也可以操作此时的fetch更新缓存！！

然而，这样做是有风险的，激活的sw速度不一样，会有前后不一致的问题

1. 用户打开 index.html, 安装了 sw-v1.js，产生 `SW1` 实例，后续网络请求通过了 `SW1`，页面加载完成
2. 代码更新，用户重新打开 index.html，此时 `SW1` 处理http请求。同时，执行到 `navigator.serviceWorker.register`，发现有个 sw-v2.js，由于 Service Worker 异步安装，此时后台异步安装 `SW2` 实例。
3. 因为 `sw.v2.js` 在 `install` 阶段有 `self.skipWaiting()`，所以浏览器强制停止了 `SW1`，而是让 `SW2` 马上激活并控制页面
4. 后续http请求，由 `SW2`处理

> 同一个页面，前半部分的请求是由 `SW1` 控制，而后半部分是由 `SW2` 控制。这两者的不一致性很容易导致问题，甚至网页报错崩溃。比如说 `SW1` 预缓存了一个 `v1/image.png`，而当 `SW2` 激活时，通常会删除老版本的预缓存，转而添加例如 `v2/image.png` 的缓存。这时如果断网，或者采用的是 CacheFirst 之类的缓存策略时，浏览器发现 `v1/image.png` 已经在缓存中找不到了。即便网络正常，浏览器也得再发一次请求去获取这些本已经缓存过的资源，浪费了时间和带宽。再者，这类 SW 引发的错误很难复现，也很难 DEBUG，给程序添加了不稳定因素。

### skipWaiting + 刷新 方案

直接 skipWaiting，我们会发现同一页面请求有一部分被旧SW控制，一部分被新的控制

那我们在 新SW 接管后，重刷网页！！

客户端 app.js 可以监听sw是不是有新的sw接管(需要sw接管 而不仅仅是install)了 `controllerchange`

```javascript
navigator.serviceWorker.addEventListener('controllerchange', (e) => {
  console.log(e);
  window.location.reload();
})
```

这样做的缺点也很明显，会打断用户体验，因为刷新了嘛

> ✨ 示例 update_auto 控制台skip + 代码 skip

**Notice:**

> 我们知道，SW 在Waiting状态时，靠刷新并不会改变其状态，因为不会使 旧SW 退出  
> 这里的做法是，先使用 `skipWaiting` 来使 旧SW 退出，然后通过 `controllerchange` 监听到变化再执行刷新。

> 我们还要注意，当在 Dev Tools 里开启Update on Reload 功能时，使用如上代码会引发`无限的自我刷新`。所以通常我们加一个flag判断

```js
let refreshing = false
navigator.serviceWorker.addEventListener('controllerchange', () => {
  if (refreshing) {
    return
  }
  refreshing = true;
  window.location.reload();
});
```

### 让用户主动刷新

我们知道，通过 `controllerchange` 监听就可以执行刷新操作了。既然我们刷新会打断用户体验，那换个思路，让用户自己去刷新不是也可以?

1. 浏览器检测到 新SW，安装并进入Waiting阶段，同时会触发 `updatefound` 事件

2. 监听 `updatefound` 事件，弹出提示，让用户选择是否更新

```javascript
// index.js

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').then(function (registration) {
   if (registration.waiting) { 
      // 通过自定义 updated 事件，弹出选择框
      emit('updated', registration);
      return;
    }

    // updatefound 回调 
    registration.onupdatefound = function () {
      var installingWorker = registration.installing;
      installingWorker.onstatechange = function () {
        switch (installingWorker.state) {
          case 'installed':
            if (navigator.serviceWorker.controller) {
               emit('updated', registration);
            }
            break;
        }
      };
    };
  }).catch(function(e) {
    console.error('Error during service worker registration:', e);
  });
}

```

3. 如果用户选择更新，通过 `postMessage` 通知 新SW 执行 `skipWaiting`

```javascript
// click.js
// 点击确认的回调

try {
  navigator.serviceWorker.getRegistration().then(registration => {
    // 向 waiting 的SW发送消息
    registration.waiting.postMessage('skipWaiting');
  });
} catch (e) {
  window.location.reload();
}

```

```js
// sw-v2.js
// SW 不再在 install 阶段执行 skipWaiting 了

self.addEventListener('message', event => {
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
  }
})
```

4. 通过 `controllerchange` 监听事件，刷新网页

```js
// sw-v2.js

let refreshing = false
navigator.serviceWorker.addEventListener('controllerchange', () => {
  if (refreshing) {
    return
  }
  refreshing = true;
  window.location.reload();
});

```

当然，该方法也有弊端

1. 过于复杂，设计API过多，跨文件传输消息，且多了UI设计
2. SW的更新依赖用户点击

## Question

### 如果在新版本里，更改了 service-worker.js 地址（名称）会怎么样?

针对静态文件，现在流行的做法是通过hash值（或其他值）在每次构建时生成不同的名称，再配以缓存策略，降低访问耗时。

但如果 service-worker.js 也这样做，就可能会：

1. index.html 将 sw-v1.js 注册为 Service Worker。
2. sw-v1.js 把 index.html 缓存起来，以实现离线功能。
3. 更新 index.html，注册全新的 sw-v2.js。 执行上述操作，我们会发现用户将永远无法获取 sw-v2.js，因为 sw-v1.js 将从其缓存中提供旧版本的 index.html，里面引用的是 sw-v1.js。 一旦遇到这种情况，除非用户手动清除缓存，卸载 `v1`，否则我们无能为力

> 所以 `service-worker.js` 必须使用相同的名字，不能在文件名上加上任何会改变的因素。

### 如果给 service-worker.js 设置缓存会怎么样?

会遇到和上面一毛一样的情况！ 最好是将 service-worker.js 独立出来并设置 `Cache-control: no-store`

### 如何判断页面是否被 service worker 控制

如果需要判断一个页面是否受service worker控制，可以检测`navigator.serviceWorker.controller`这个属性是否为null或者一个service worker实例。

### 可以注册多个 Service Worker吗?

在同一个 Origin 下，可以注册多个 Service Worker。但是请注意，这些 Service Worker 的 **scope 必须是不相同的**。

```javascript
if ('serviceWorker' in window.navigator) {
  navigator.serviceWorker.register('./sw/sw.js', { scope: './sw' })
    .then(function (reg) {
      console.log('success', reg);
    })
    
  navigator.serviceWorker.register('./sw2/sw2.js', { scope: './sw2' })
    .then(function (reg) {
      console.log('success', reg);
    })
}
```

### 开发时不想手动刷新?

在开发时为了每次都使用新SW，可以在chrome开发者工具里勾上 **Update on reload** 的单选框，选中它之后，我们每次刷新页面都能够使用最新的 service worker 文件。

## 参考

[谨慎处理 Service Worker 的更新](https://juejin.cn/post/6844903792522035208 "https://juejin.cn/post/6844903792522035208")  
[MemoryCache、DiskCache、ServiceWorker比较](https://juejin.cn/post/7088741970696208414 "https://juejin.cn/post/7088741970696208414")
