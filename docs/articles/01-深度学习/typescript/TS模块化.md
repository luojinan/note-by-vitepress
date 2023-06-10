# TS 模块化

TS 也是有模块的概念的：👇
- 处理 业务代码 的模块
- 处理 类型 的模块

业务代码的模块 👇

> 也就是我们常指的 `JS` 引用 `非JS文件` 如：`CSS`、`SVG`
> 
> `原生JS` 是不支持直接引用这些文件的，`CSS`、`SVG` 正确的使用方式是在 `HTML` 中通过特定的 `标签` 来引用
> 
> 同理在 `TS` 中，也没有默认处理这些 `非JS/TS文件`，而是需要手动处理

类型的模块化 👇

> 模块化的好处，我们不赘述。至少可以很好的复用 `类型或配置`，减少重复代码
> 
> `TS类型` 可以混在业务代码中，并被 `import type` ，但是有注意事项
> 
> TS 的 `JSON配置` 也支持模块化引用

## 非TS文件(模块)支持

> TS模块化 识别 `非TS/JS文件`

TS 文件引入其他文件模块 如👇 css
```js
import * as foo from './some/file.css'
```

使用 `.d.ts` 库声明文件
```ts
declare module '*.css';
```
`declare module` 声明语法

一般是创建 `env.d.ts`

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
👆 当然每次创建项目都手动写这段配置也麻烦，一般会封装📦起来复用

下面的 TS类型模块化 中讲解

## 忽略第三方依赖类型报错

```ts
declare module '@zz/fetch'
declare module '@zz-yy/utils'
```

## 重写第三方依赖的类型声明

```ts
declare module 'foo' { // ✨ 声明的是 module 类型
  // some variable declarations
  export var bar: number;
}
```

👆 当然一般不需要重写，安装对应的 @type 包即可，甚至不用配置，ts 解析器会默认查找 `node_modules/@types` 目录 (可以自定义)

## 纯类型内容时的TS模块化

在 ts 中默认不同文件也会共享 类型空间 和 变量空间, 不会因为不同文件而属于被模块化

如👇  跨文件共享了变量
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

## tsConifg 配置引入(继承)方式

在 `vite` 中是

- `.d.ts` 的引用语句是 `/// <reference types="vite/client" />`
- `tsconfig.json` 的引用语句是 `"extends": "@vue/tsconfig/tsconfig.web.json"`

注意 `tsconfig.json` 的 `references`字段 并不是引用语句，而是区分环境的语句 单独再生效一份 `tsconfig` 的功能
