# TS 入门

[深入理解 TypeScript](https://jkchao.github.io/typescript-book-chinese/#why)

[冴羽-ts](https://github.com/mqyqingfeng/learn-typescript)

ts 同时具有以下功能：
- 静态类型检查(扫描)
- 语法降级
- 编译输出js

👆 我们发现和现在一些工具功能重复如 `编译-webpack`、`降级-babel`

一般的前端项目都只使用类型检查的功能(`tsc` 配置 `compilerOptions.noEmit = true` ,  `loader` 把 `ts` 语法移除转为 `js` )

而js库开发则可能会使用到 tsc 做转译打包功能(但是 `esbuild` 或其他构建工具 `tsup` 还是比 `tsc` 好用，除非特别简易的库打包可以用 `tsc`)

TS 项目开发中的 一些概念：
- 抹除(`esbuild`、`webpack-loader`) - 无视 `tsconfig` 的编译配置，仅仅把 `TS` 转化为 `JS`，不做任何类型检查、语法降级、注释清除
- 类型检查(`tsc`、`IDE`) - 根据 `tsconfig` 对 `TS` 做静态语法扫描，不输出JS 文件(`noEmit`)
- 转译/编译(`tsc`) - 根据 `tsconfig` 把 `TS` 转化为 `JS，包括类型检查并中断报错`

> 在开发阶段，我们推荐你靠 IDE 来获取即时的类型错误反馈 - [vue3文档](https://cn.vuejs.org/guide/typescript/overview.html#overview)

![](https://kingan-md-img.oss-cn-guangzhou.aliyuncs.com/blog/202306110002326.png)

👆 和所有涉及编译原理的技术原理相同，如`babel`、`eslint`、`vue->js`

## 学习路线

官方文档比较重要的部分：
- [Everyday Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html) 是 TS 的基础知识，看完后可以再看看 [Cheat Sheets](https://www.typescriptlang.org/cheatsheets) 中的 Interfaces 和 Types 两张图回顾一下
- [Utility Types](https://www.typescriptlang.org/docs/handbook/utility-types.html) 是 TS 自带的一些工具类型
- 当你希望扩展第三方库的 TS 定义时，需要用到 [Declaration Merging](https://www.typescriptlang.org/docs/handbook/declaration-merging.html)
- 如果你想写一些类型推导，那么 [Type Manipulation](https://www.typescriptlang.org/docs/handbook/2/types-from-types.html) 中的都要看看

看文档，然后就做做 [type challenges](https://github.com/type-challenges/type-challenges) 的题

## IDE和指令执行类型检查

- 命令执行类型检查(不输出js `noEmit`)，结果输出在终端
- IDE执行类型检查，结果输出在代码位置

`typescript` 和 `eslint` 很像，项目需要：
1. 安装依赖
2. 配置文件
3. `IDE` 安装 插件
4. 可选 每次编译运行/代码提交前hook  进行静态扫描拦截

有时候我们发现启动项目报错 `eslint/typescript`，那就是安装的依赖被运行扫描生效

假如此时编辑器在代码部分没有相关的提示，那就是 `IDE` 的插件没生效，可以检查是否安装或和依赖的版本是否对应

👆 可以看出 `IDE` 和 指令 虽然从作用上来说是一体互相协助的，但是运行却是相互独立的

理论上， `VSCode` 的代码类型检查是跟项目的 `typescript` 和 `tsconfig` 强相关的

现在遇到了这个问题：

> `tsconfig.json` 配置了 `exclude` 目录，并且`exclude`目录没有被引用，为什么我的 `VSCode` 还是对 `exclude`目录下的ts文件进行了静态类型分析?
>
> 而配置 `compilerOptions` 编译选项的 `target` 时为 `ES5` 时，`VSCode` 可以正确根据 `tsconfig` 来提示无 `Promise` 语法
>
> 也就是 `VSCode` 会识别 `tsconfig` 的 `compilerOptions，但是不识别` `exclude` ？


[tsconfig.json 的行为-深入理解 TypeScript](https://jkchao.github.io/typescript-book-chinese/faqs/tsconfig-behavior.html#为什么把一个文件放入「exclude」选项中，它仍然会被编译器选中？) ：被 `import` 的文件，`exclude` 不会生效

👇 ChatGPT：

> `VSCode` 编辑器会使用自己的静态类型检查器来提供编辑器级别的类型分析和自动完成功能
> 
> 虽然 `tsc` 不会编译 `exclude` 目录下的文件，但是 `VSCode` 仍然会加载这些文件并对其进行静态类型分析，以提供更好的 `VSCode` 支持和代码提示。这意味着即使你在编译时排除了这些文件， `VSCode` 仍然会检查它们并提供相应的类型检查功能。
 
> 如果你希望 `VSCode` 完全忽略 `exclude` 目录下的文件，以减少 `VSCode` 的静态类型检查工作量，你可以尝试使用其他插件或配置来实现
> 
> 例如，一些 `VSCode` 插件可以根据指定的文件规则或模式来排除特定的文件或目录，这样 `VSCode` 就不会对这些文件进行静态类型检查。你可以在 `VSCode` 的插件市场中搜索相关的插件，并按照插件的说明进行配置

🤔️ 不太确定，也可能是我电脑 `IDE` 的问题，理论上 `VSCode` 会根据 `exclude` 配置忽略类型检查

## 现代前端项目的选择

### Vite

在基于 `Vite` 的配置中，`开发服务器devServer` 和 `打包器build` 将只会对 `TypeScript` 文件：
- 执行 抹除 (`esbuild`)
- 而不会执行 类型检查

这保证了 `Vite` 开发服务器在使用 `TypeScript` 时也能始终保持飞快的速度

Vite 之所以不把类型检查作为转换过程的一部分，是因为这两项工作在本质上是不同的。转译可以在每个文件的基础上进行，与 Vite 的按需编译模式完全吻合。相比之下，类型检查需要了解整个模块图。把类型检查塞进 Vite 的转换管道，将不可避免地损害 Vite 的速度优势。

如果需要类型检查来拦截代码提交，可以使用 `tsc` 命令执行类型检查(不输出js `noEmit`)

而 `Vue` 因为是 `.vue` 文件而不是 ts文件，因此提供一个 `vue-tsc` 命令工具

> `vue-tsc` 是对 `TypeScript` 自身命令行界面 `tsc` 的一个封装。它的工作方式基本和 `tsc` 一致。即：执行 `TS` 编译(只做类型检查也要执行编译指令`tsc`？)

> 在仅执行 `TS` 抹除的项目中，假如额外开启类型检查：
> 
> 开启 `Vite` 开发服务器的同时以侦听模式运行 `vue-tsc`
> 
> 或是使用 `vite-plugin-checker` 这样在另一个 `worker` 线程里做静态检查的插件

## d.ts

> `d.ts` - `declaration files` 声明文件，本质上还是ts文件，这更像是一种约定
>
> 一般指：库文件，用于声明第三方库，或自己定义的库目录

- 内置的`d.ts`: `lib.dom.d.ts`
- 安装第三方库的`d.ts`: @types/jquery/index.d.ts
- 安装第三方库的`node/globals.d.ts` 会无视 `tsconfig` 的 `lib`，如: `@types/node`
- 业务代码创建的 `d.ts`

第三方库:👇

如 `jquery` 需要手安装 `@types/jquery` 则会安装到 当前项目的 `node_modules/@types/` 下

内置库文件:👇

我们点进 `console` 的类型声明 会跳到 `VSCode(插件)` 提供的 `lib.dom.d.ts` 而不是 ts的

![](https://kingan-md-img.oss-cn-guangzhou.aliyuncs.com/blog/202306031741730.png)

业务代码 `d.ts`: 👇

可以创建在项目任何目录，并且任意命名，若分模块创建多个会被ts合并成一个来识别(会自动去重)

我们常把自定义`d.ts` 写在项目根目录，或 `typing/` 目录下

一方面是为了方便管理，另一方面是为了避免同名错误如：👇
```
/
├── src/utils/
│   ├── index.ts
│   └── index.d.ts
└── tsconfig.json
```
👆 我们把类型写在同级的 `d.ts` 下作为全局类型，不使用 `import` 而是直接使用类型

此时 ts 会帮我们寻找类型，理论上，`d.ts` 定义的是全局的类型，可以直接使用，但是发现不生效：
1. `index.ts` 会从自身寻找类型定义
2. 往同级目录 `d.ts` 寻找，但是忽略同名 `index.d.ts`
3. 往上级目录寻找 `d.ts`

## 类型空间和变量空间

[TS模块化](./TS%E6%A8%A1%E5%9D%97%E5%8C%96.md#纯类型内容时的TS模块化)
