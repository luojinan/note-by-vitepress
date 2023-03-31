
[深入理解 TypeScript](https://jkchao.github.io/typescript-book-chinese/#why)

一些概念

ts有2个作用:
1. 类型检查
2. 转译打包为js产物

一般的前端项目都只使用类型检查的功能(不运行 `tsc` 配置 `compilerOptions.noEmit = true` 就行,只用 `loader` 把 `ts` 语法移除转为 `js` )

而js库开发则可能会使用到转译打包功能(还是 `esbuild` 好用吧 `tsup` 之类的...)


## references

```json
{
  "extends": "@vue/tsconfig/tsconfig.web.json",
  "include": ["env.d.ts", "src/**/*", "src/**/*.vue"],
  "compilerOptions": {
    "baseUrl": ".",
    "paths": { "@/*": ["./src/*"] }
  },

  "references": [
    {
      "path": "./tsconfig.config.json"
    }
  ]
}
```

vite tsconfig.json references tsconfig.config.json

转译打包功能的话，还可以实现区分编译以及区分缓存来实现按需编译

只考虑类型检查功能，则给 ts 文件框定环境，提升一点性能 以及 正确的环境语法提示

在 vite 创建的应用项目时，分为浏览器端 以及 本地构建服务的 node 环境

不给浏览器端代码使用 node api ，同理 不给 node 环境使用 浏览器api





