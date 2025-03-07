# TS 模块化

TS 也是有模块的概念的：👇

- 处理 业务代码（`非 JS 文件`） 的 `d.ts` 模块
- 处理 类型 (`import type`) 的 `.ts` 模块
- 配置文件 `.json` 模块化

1. 业务代码（`非 JS 文件`）的模块 👇

> 也就是我们常指的 `JS` 引用 `非 JS 文件` 如：`CSS`、`SVG`
>
> `原生 JS` 是不支持直接引用这些文件的，`CSS`、`SVG` 正确的使用方式是在 `HTML` 中通过特定的 `标签` 来引用（依赖构建工具的最终产物也是对应 css 标签）
>
> 同理在 `TS` 中，也没有默认处理这些 `非 JS/TS 文件`，而是需要手动处理（忽略类型）

2. 类型 (`import type`) 的模块化 👇

> 模块化的好处，我们不赘述（复用 `类型或配置`，减少重复代码）
>
> `TS 类型` 可以混在业务代码中，并被 `import type`

3. 配置文件模块化

> TS 的 `JSON 配置` 也支持模块化引用

## 非 JS 文件（模块）支持

在 `vite` 的 `.d.ts` 模块化语句是 `/// <reference types="vite/client" />`

在 web 环境下有些固定的类型每次都要手动写，如 `非 TS/JS 文件`

TS 文件引入其他文件模块 如👇 css

```js
import * as foo from './some/file.css'
```

使用 `.d.ts` 库声明文件

```ts
// declare module 声明语法
declare module '*.css';
```

👇 一般统一放在 `env.d.ts`：当然每次创建项目都手动写这段配置也麻烦，一般会封装📦起来复用 (`/// <reference types="xxx.d.ts" />`)

```ts
declare module '*.css'
declare module '*.less'
declare module '*.scss'
declare module '*.sass'
declare module '*.svg'
declare module '*.png'
declare module '*.jpg'
declare module '*.jpeg'
declare module '*.gif'
declare module '*.json'
```

👇 `declare module` 语法也可以用来 忽略 or 重写 第三方依赖类型报错

```ts
declare module '@zz/fetch'
declare module '@zz-yy/utils'

//  重写第三方依赖的类型声明
declare module 'foo' { // ✨ 声明的是 module 类型
  // some variable declarations
  export var bar: number;
}
```

👆 当然一般不需要重写，安装对应的 @type 包即可，不用配置，因为 ts 解析器会默认查找 `node_modules/@types` 目录 （可以自定义）

## 类型 (`import type`) 的 TS 模块化

在 ts 中默认不同文件也会共享 `类型空间` 和 `变量空间`, 不会因为不同文件而属于被模块化

👇 跨文件共享了变量

```ts
// a.ts
const a = 'a'

// b.js
const b = a
```

ts 模块化需要手动编写，只要有 `import/export` 语法就会自动模块化如👇

```ts
// a.ts
export const a = 'a' // <-- 加上 export 后不再共享 a.ts 文件的内容

// b.ts
import { a } from './a.ts' // <-- 因为 a.ts 模块化了，因此需要引入使用，同理加上 import 后 b.ts 文件内容也不再共享
const b = a
```

因此当我们确实编写一个不需要导入导出的 ts 时，可以这么做👇

```ts
export {}

// ... write your ts code
```

## 配置文件模块化

tsConifg 配置引入（继承）方式

在 `vite` 中是：

- `tsconfig.json` 的引用语句是 `"extends": "@vue/tsconfig/tsconfig.web.json"`

注意 `tsconfig.json` 的 `references`字段 并不是引用语句，而是区分环境的语句 单独再生效一份 `tsconfig` 的功能：

```json
{
  // 指定要引用的其他 TypeScript 配置文件。这允许我们将配置拆分为多个文件，以便更好地组织和管理。
  "references": [
    // Web 应用程序代码的配置。
    { "path": "./tsconfig.app.json" },
    // Node.js 环境代码的配置。
    { "path": "./tsconfig.node.json" }
  ]
}
```
