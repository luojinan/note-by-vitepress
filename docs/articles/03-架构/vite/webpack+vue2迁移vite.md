[vite 源码解析](https://juejin.cn/post/7047479540850884645)
[基于esbuild的universal bundler设计](https://www.jianshu.com/p/c71ad2e1df06)

[将vue-cli的webpack配置输出到独立文件](https://www.jianshu.com/p/7738e058ac4a)

[迁移vite笔记](https://www.wujieli.top/2022/08/21/%E5%BC%80%E5%8F%91%E7%8E%AF%E5%A2%83%E5%8D%87%E7%BA%A7%20Vite%20%E8%B8%A9%E5%9D%91%E6%80%BB%E7%BB%93/)

## 输出旧项目vuecli的webpack配置

```bash
# --mode 指定环境模式 (默认值：development)
npx vue-cli-service inspect --mode development > webpack.config.development.js

npx vue-cli-service inspect --mode production > webpack.config.production.js
```
在产生的 js 文件开头，添加：`module.exports =`，然后格式化即可查看。


## vite 指令创建基础模版

配置 vite for vue2 的 plugin
```ts
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from "vite";
import vue from '@vitejs/plugin-vue2'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    extensions: [".js", ".ts", ".jsx", ".tsx", ".json"],
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
})
```

## 把旧项目整个拉进来运行

![](https://kingan-md-img.oss-cn-guangzhou.aliyuncs.com/blog/20230316172158.png)

vite 启动会扫描出缺少哪些依赖，按提示安装依赖



## postcss.config 需要 cjs

![](https://kingan-md-img.oss-cn-guangzhou.aliyuncs.com/blog/20230316172357.png)

vite 自动扫描到项目中存在 postcss 时执行相关插件功能

## process.env js异常阻断

理论上 第三方库不应该用这种变量，而使用方传递进来


```ts
export default defineConfig({
  define: {
    // 同 webpack.DefinePlugin，手动兼容 dev 环境 process.env
    'process.env': {
    }
  },
})
```

## 旧项目中的 require 及 require.context 语法

![](https://kingan-md-img.oss-cn-guangzhou.aliyuncs.com/blog/20230403112610.png)


因为不多所以可以考虑 改写为 import

```ts
// vite
const routeFiles = import.meta.glob('@/router/*.ts') // 未执行的 import 函数

const routesPromise = Object.values(routeFiles).map(item=> item()) // 执行得到 promise
let routes= []
await Promise.all(routesPromise).then(list=>{
  // promise 后模块内容在 default 中
  routes = list.map(item=> item.default).flat()
})
```

但是一定要兼容的话，可以尝试自己封装 vite plugin 转译代码成 import

## 添加域名子路径 使用域名而不是本地开启 http2

## 依赖中的依赖是 commonjs 没有预构建成功?

![](https://kingan-md-img.oss-cn-guangzhou.aliyuncs.com/blog/20230403112729.png)


`import { } from 'commonjs'` 语句 vite 报错 找不到模块中的方法

理论上 vite 的预构建会处理 node_modules 中所有的依赖

## vue class 语法 装饰器

webpack 构建工具需要 babel 插件

但是 vite 是废弃 babel 使用 swc

[](https://blog.csdn.net/qq_41800366/article/details/115030758)


[vite支持babel 在遇到 js/ts 时先经过babel再经过其他插件](https://github.com/owlsdepartment/vite-plugin-babel)

![](https://kingan-md-img.oss-cn-guangzhou.aliyuncs.com/blog/20230317185634.png)

esbuild 的 transform 方法报错

应该可以单独给 esbuild 加插件

esbuild 不支持转译 js 中的装饰器
而 ts 在 esbuild 中会先经过 ts -> js -> esbuild

因此只要 ts 把正确的转译装饰器，理论上 esbuild 是不会报错的

还要继续断点到 vite 处理 ts 的地方

当改写为👇 后装饰器生效
```ts
import { Vue } from 'vue-property-decorator'
import { forceLogin } from '@/libs/decorator/forceLogin'

export default class Demo extends Vue {
  @forceLogin
  test() {
    console.log('111')
  }
}
```

因此不是 esbuild 也不是 tsc 处理不了装饰器

而是 装饰器语法 的需要在 class 内部，而 vue 的 SFC 文件可能没有被编译成合法的使用装饰器的 class

而理论上现在的报错才是正确的，旧代码里的非 classComponent 理论上是用不了装饰器，什么地方做了额外的处理吗

尝试降级 vue2.6 无效

尝试降级 vite-plugin-vue2 无效

不熟悉 装饰器语法 以及 原理，更不熟悉在 vue2 使用装饰器 和 在 ts 使用装饰器的不同 以及vue2 是如何支持装饰器的

'vue-property-decorator' 与 ts 的关系

为什么vue 不指定 lang=ts 也能用装饰器

```ts
// vite.config.js
import legacy from '@vitejs/plugin-legacy'

export default {
  plugins: [
    legacy({
      targets: ['defaults', 'not IE 11']
    })
  ]
}
```

[swc decorators](https://github.com/swc-project/swc/discussions/3032)

## 公共库问题

1. sass 废弃直接运算符 因此升级 sasscore 后就没有直接运算符了，但是升级后的 hairline 行为不一致

找到 sass 对应 node-sass 的版本

![](https://kingan-md-img.oss-cn-guangzhou.aliyuncs.com/blog/20230403145203.png)


```js
import {xx} from '@zz-eg/common-lib/dist/url'
```

@zz-eg/common-lib/dist/url.js 是构建后的 commonjs 资源

```js
/**
 * Server-only plugin that lexes, resolves, rewrites and analyzes url imports.
 *
 * - Imports are resolved to ensure they exist on disk
 *
 * - Lexes HMR accept calls and updates import relationships in the module graph
 *
 * - Bare module imports are resolved (by @rollup-plugin/node-resolve) to
 * absolute file paths, e.g.
 *
 *     ```js
 *     import 'foo'
 *     ```
 *     is rewritten to
 *     ```js
 *     import '/@fs//project/node_modules/foo/dist/foo.js'
 *     ```
 *
 * - CSS imports are appended with `.js` since both the js module and the actual
 * css (referenced via `<link>`) may go through the transform pipeline:
 *
 *     ```js
 *     import './style.css'
 *     ```
 *     is rewritten to
 *     ```js
 *     import './style.css.js'
 *     ```
 */
```

预构建时处理 bare module 还是 👆的 rewrites 处理 bare module

还是都处理 😵

什么时候 rewrite 成 prebudle 的 node_modules/.vite/xx ，什么时候 rewrite 成 node_modules/xx

先 prebudle， rewrite 发生在运行时，会检查 bare module 是否有预编译产物，有则rewrite 成 node_modules/.vite/xx

所以缺了预构建产物 不是 rewrite 的问题

## vite 源码 debug

建一个纯的 vite vue2 zz基建的项目，复现问题来调试！！

code/test/vite-vue2-zz


尝试 纯 vite js-cookie
1. 直接引入 js-cookie 可以转译 commonjs
2. 先预构建，由预构建产物引入 js-cookie, 也可以转译 commonjs

zz-ui 是被预构建了的，内部引入 js-cookie 没有被转译，因为把 js-cookie 识别成了 esm ?

而纯的项目成功把 js-cookie 识别成了 umd？

1. debugger 纯项目把 js-cookie 识别为 umd 的逻辑
2. 找出源码 识别第三方依赖是 esm 的代码逻辑

可能成功预构建了，但是引入的时候还是引入的 node_modules

zz-ui 内部有3个esm模块， 这3个模块内部依赖也完全不走预构建？
```js
// node_modules/.pnpm/rcnpm.zhuanspirit.com+@zz-common+zz-ui@5.0.5_qokby4kue5woh4zds3ira4utjm/node_modules/@zz-common/zz-ui/es/recycle-date/index.js

// node_modules/.pnpm/rcnpm.zhuanspirit.com+@zz-common+zz-ui@5.0.5_qokby4kue5woh4zds3ira4utjm/node_modules/@zz-common/zz-ui/es/model-list/scrollor.js

// node_modules/.pnpm/rcnpm.zhuanspirit.com+@zz-common+zz-ui@5.0.5_qokby4kue5woh4zds3ira4utjm/node_modules/@zz-common/zz-ui/es/recycle-address/index.js

```
确实是这3个模块 走了 esm 的原因

少了 __toESM 包裹

因为这3个模块指定了 后缀 .vue 让 esbuild plugin 走了未知资源 不预构建，由运行时转译

只有这3个模块是vue 其他组件模块都是js(function component render h)

这些文件不会在esbuild阶段进行处理，所以要提前把它们找出并解析。

忘记走 打包流程了吗？

组件库对外的是vue

1. 让组件库打包成js
2. 想办法让 esbuild 转译 vue
  vueplugin


vite pre-bundle 只处理js的理由，以及边界情况

node_modules 第三方库就是引入了 其他类型资源，交由运行时 viteServer 转译资源

但是运行时识别不了 commonjs ？
而这个资源的内部又有 commonjs呢

1. 为什么预构建 pre-bundle 不处理非js资源
2. 为什么运行时 viteServer 不处理commonjs


```js
optimizeDeps: {
 esbuildOptions: {
   plugins: [
     {
       name: 'rewriteZZuiPath',
       setup(build) {
         build.onResolve({ filter: /(index|scrollor).vue$/ }, (args) => {
           if (args.importer.includes('node_modules')) {
             return { path: path.join(args.resolveDir, `${args.path}.js`) }
           }
         })
       }
     }
   ]
 }
}
```

zzui 的打包方式，.vue后缀是不能存在的？


不再报错 依赖问题

1. zzui style
2. js 装饰器 esbuild

![](https://kingan-md-img.oss-cn-guangzhou.aliyuncs.com/blog/20230406142217.png)

vite prebundle 怎么处理第三方依赖的 peerDeps ？

prebundle node_modles/a 时遇到 peerDeps

## 运行时装饰器语法解析

预构建就报错了...

运行时vite 解析js用的是 esbuild(不是只用预构建使用)

1. 尝试配置 vite/plugin-vue2 无效，学习解析babel参数源码
2. 可以尝试配置自定义运行时 rollup-plugin 解决(rollup靠的还是babel,会让本来不需要babel的运行时变重)


