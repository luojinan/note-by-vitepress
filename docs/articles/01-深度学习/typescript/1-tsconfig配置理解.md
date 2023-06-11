# tsconfig配置理解

`tsconfig.json` 将会把一个文件夹转换为「项目」，如果不指定任何 `exclude` 或者 `files`，则包含在 `tsconfig.json` 中的所有文件夹中的所有文件都会被包含在编译中。

和 `node` 指令运行 `js` 时寻找 `node_modules` 一样

运行方(`tsc`)指令来运行 `ts` 会有一个寻找 `tsconfig.json` 的过程

运行方(转译ts的工具)在这里是: `tsx/esno`，其他的如：`ts-node`、`tsc`、`webpack-ts-loader` ...

🤔 其他具有 **配置文件** 并且 **默认识别配置文件** 机制的前端构建工具(`webpack`、`vite`)，其实也有这种寻找机制(只会从当前执行命令根目录寻找)，而因为 `tsconfig的寻址` 和 `node_modules寻址` 完全一致因此拿出来对比

都没找到配置文件时会有写死的 **默认配置**，对应 `node_modules` 的全局依赖

注意：只有直接使用 `tsc` 指令才会自动寻址，当写了指令参数如 `tsc src/index.ts` 将会理解为不需要自定义配置而使用默认配置(就是 `tsc --init` 自动生成的那份配置)，即使项目目录中有 `tsconfig.json`

## 顶层配置项

我们使用 `tsc --init` 生成出来的 `tsconfig.json` 只有 `compilerOptions` 
，但其实和 `compilerOptions` 同级的其他配置也是需要了解的

外层 `tsconfig` 配置
```json
{
  "compilerOptions": {},

  // ✨ 以下与compilerOptions同级的配置项
  "compileOnSave": true,
  "files": [],
  "include": [],
  "exclude": [],
  "extends": "",
  "references": []
}
```

| 配置项 | 说明 |
| --- | --- |
| compilerOptions | 编译选项，详见compilerOptions
| - | - |
| compileOnSave | 让IDE在保存文件的时候根据tsconfig.json重新生成文件,要想支持这个特性需要Visual Studio 2015， TypeScript1.8.4以上并且安装atom-typescript插件
| files | 指定一个包含相对或绝对文件路径的列表
| include | 指定一个文件glob匹配模式列表，注意：`src/*` 只扫描src一级目录
| exclude | 指定一个文件glob匹配模式列表
| extends | 继承其他配置文件，如基础配置 `tsconfig.base.json`
| references | 一个对象的数组，指明要引用的工程。path属性可以指向到包含tsconfig.json文件的目录，或者直接指向到配置文件本身（名字是任意的）

我们一般不使用 TS 的 [编译功能](./0-TS%E5%85%A5%E9%97%A8.md#现代前端项目的选择)，不需要实时编译 `compileOnSave`

## 入口配置files、include、exclude

我们创建 TS 项目，什么都不配置时有一份默认配置

这也是很多入门教程：
1. 创建 `src/index.ts` 编写内容
2. 直接运行 `npx tsc` 指令
3. 查看生成的 `src/index.js` 内容

看这些步骤和结果，可以猜测： `TS` 至少默认设置了 入口、出口、转译级别

而入口的配置就是 `tsconfig.json` 外层的 `files、include、exclude` 属性

这里要注意:
- 不指定files选项值时，includes的默认值为`["**/*"]` (包含当前项目中所有文件)
- 指定了files选项值时，includes 的默认值为`[]` (根据依赖分析自动识别需要包含的文件)

如：`files` 设置为 `['src/index.ts']` 则该文件依赖的其他文件也会被归纳为编译对象

即 `index.ts` 依赖 `user.ts` 时，不需要在 `files` 中指定 `user.ts` ， `user.ts` 会自动纳入待编译文件

而 `files` 配置项在复杂项目时并不适用，此时我们使用 `include、exclude` 指定目录，而不是配置 `files`

`exclude` 的默认值是 `["node_modules", "bower_components", "jspm_packages"]` + `outDir选项指定的值`, 如果有一些文件实在不想被 `TS` 扫描，才手动配置(`node_modules`不会被覆盖而是合并)


注意以下情况，`exclude` 中指定的被忽略文件，将会无效，依然被扫描：👇
1. `import`操作符
2. `types`操作符
3. `///<reference`操作符
4. 在`files`选项中添加配置的方式

如 umi 项目配置：👇
```json
{
  "include": [
    "mock/**/*",
    "src/**/*",
    "typings/**/*",
    "config/**/*",
    ".eslintrc.js",
    ".stylelintrc.js",
    ".prettierrc.js",
    "mock/*"
  ],
  "exclude": ["node_modules", "build", "dist", "scripts", "src/.umi/*", "webpack"]
}
```
可以看出一般：
- `include`
  - src目录下的业务代码(路由页面、组件、工具方法等)
  - 根目录下的配置文件(`eslintrc、prettierrc、stylelintrc`) TODO: 为什么包括js文件,不能编写类型语法，会有类型提示？
- `exclude`
  - 打包产物 `dist/`
  - nodejs脚本 `scripts/`
  - umi 自动生成的内容 `src/.umi/`


## 复用配置references、extends

[Project References - ts Docs](https://www.typescriptlang.org/docs/handbook/project-references.html)

- `references` - 参考
- `extends` - 继承

| _ | _ |
|--- | ---|
| extends | 继承其他配置文件，如基础配置 `tsconfig.base.json`
| references | 一个对象的数组，指明要引用的工程。path属性可以指向到包含tsconfig.json文件的目录，或者直接指向到配置文件本身（名字是任意的）

这里 `extends` 才是我们平时理解的复用，多份 `tsconfig` 配置 作用于 **单入口**，`tsconfig.base.json`.

因此不过多介绍 `extends`，把重点放在理解 `references`上

`references` 是为了让我们针对多入口配置 `单/多份tsconfig` 作用于 **不同的入口**

1. 我们可以想象 **单元测试项目** 结构：👇
```
/
├── src/
│   └── index.ts
├── test/
│   └── index-tests.ts
└── tsconfig.json
```

`test` 脚本运行在 `nodejs` 环境，`src` 源码运行在浏览器环境

👆 虽然可以分别创建不同的 `tsconfig` ，运行两次独立的tsc。但是这样并不优雅，并且启动多次 `tsc` 的损耗也不小

2. 我们也可以想象 **现代构建工具的项目** 结构：👇
```
/
├── build/
│   ├── build.dev.ts
│   └── build.prod.ts
├── src/
│   └── index.ts
├── vite.config.ts
├── webpack.config.ts
└── tsconfig.json
```

除了 `src` 目录运行在浏览器环境，其他ts运行在 nodejs环境

3. 我们再想象 **SSR项目** ：👇
```
/
├── service/
│   └── index.ts
├── src/
│   └── index.ts
└── tsconfig.json
```

前端项目和后端node项目放在同一个目录下开发

👆 这些情况都是现代前端项目常见且不可避免的问题，我们希望不给浏览器端代码使用 `node api` ，同理 不给 node 环境使用 `浏览器api`

此时可以定义一份 `主tsconfig` ，`references` 一份其他入口配置的 `tsconfig`

### ViteDemo的references和extends

在 `Vite` 创建的应用项目时，分为 `浏览器端` 以及 `本地构建服务的node环境`

👇 `viteDemo/tsconfig.json`
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["env.d.ts", "src/**/*", "src/**/*.vue"],

  "extends": "@vue/tsconfig/tsconfig.web.json",
  "references": [
    {
      "path": "./tsconfig.config.json"
    }
  ]
}
```
👆 1. 入口范围指定为业务代码，不包括构建工具文件 2. 使用 `extends` 复用 `@vue/` 官方库中的浏览器环境`web`配置；3. 使用 `references` 复用同一个 `tsc` 进程而不是复用配置文件，处理其他入口(`node`)和相应的配置


👇 `viteDemo/tsconfig.config.json`
```json
{
  "compilerOptions": {
    "composite": true,
    "types": ["node"]
  },
  "include": ["vite.config.*", "vitest.config.*", "cypress.config.*", "playwright.config.*"],

  "extends": "@vue/tsconfig/tsconfig.node.json"
}
```
👆 同理 1.入口范围指定为vite构建工具文件 2. 使用 `extends` 复用 `@vue/` 官方库中的 `node` 配置

## tsc --init

👇 `tsc --init` 生成 `tsconfig.json` 文件

```json
{
  "compilerOptions": {
    /* Basic Options */
    "target": "es5",                                /* Specify ECMAScript target version: 'ES3' (default), 'ES5', 'ES2015', 'ES2016', 'ES2017', 'ES2018', 'ES2019', 'ES2020', 'ES2021', or 'ESNEXT'. */
    "module": "commonjs",                           /* Specify module code generation: 'none', 'commonjs', 'amd', 'system', 'umd', 'es2015', 'es2020', or 'ESNext'. */

    /* Strict Type-Checking Options */
    "strict": true,                                 /* Enable all strict type-checking options. */

    "esModuleInterop": true,                        /* Enables emit interoperability between CommonJS and ES Modules via creation of namespace objects for all imports. Implies 'allowSyntheticDefaultImports'. */

    /* Advanced Options */
    "skipLibCheck": true,                           /* Skip type checking of declaration files. */
    "forceConsistentCasingInFileNames": true        /* Disallow inconsistently-cased references to the same file. */
  }
}
```

## target

`ts` 转译后的 `js` 语法级别

✨ `dev` 阶段一般用 `ESNEXT`

> 🤔 如何区分 `dev` 和 `prod` 阶段的 `ts转译` ？

> 不需要考虑 `prod`, 现代构建工具 **ts转译不处理语法，而是直接擦除**，由其他工具如 `babel`、`swc` 做语法转译

> 🤔 ts 不参与构建阶段，库开发呢？
>
> 库开发一般也用其他成熟的构建工具(`esbuild/tsup`)，项目简单到可以使用 `tsc` 时则，可以通过指令指定配置文件 `tsc -p tsconfig.[build/dev].json`

上面提到：

> 注意：只有直接使用 `tsc` 指令才会自动寻址，当写了指令参数如 `tsc src/index.ts` 将会理解为不需要自定义配置而使用默认配置(就是 `tsc --init` 自动生成的那份配置)，即使项目目录中有 `tsconfig.json`


👇 `src/index.ts` 编写箭头函数 (es6语法)

并且配置 `tsconfig.json` 中的 `"target": "es5"` 为 `"target": "ESNEXT"`

```ts
(()=>{ // es6 箭头函数
  const msg:string = 'im a ts file' // es5 const 常量声明
  console.log(msg)
})
```

👇 运行带参数指令 `tsc src/index.ts` 转译结果：
```js
(function () {
  var msg = 'im a ts file'; // ❌ 不是 ESNEXT 语法
  console.log(msg);
});
```

👇 运行不带参数指令 `tsc` 转译结果：
```js
"use strict";
(() => {
  const msg = 'im a ts file'; // ✨ ESNEXT 语法
  console.log(msg);
});
```

👆 `"use strict";` 严格模式 由 `"alwaysStrict": true` 配置生效，一般不使用 `ts` 的转译功能，由 `现代前段构建工具` 处理是否输出严格模式

## lib相关lib/skipLibCheck

根据 `target` 的值 `lib` 有相应的默认值

因为该项与 `taget` 自动匹配，不用手动配置，手动配置一般出于优化 **ts扫描性能** 的目的

✨ `lib: [ "[target].core.d.ts" ]`

> `lib` 用于指定要包含在编译中的库文件，常用配置是： `["esnext", "dom"]`，手动配置可以减少一点默认配置带来的额外冗余损耗

✨ `skipLibCheck` 我们看到 `tsc --init` 生成的 [默认配置](#tsc-init) 中是开启这个的

[Understanding TypeScript’s skipLibCheck Once and For All](https://www.testim.io/blog/typescript-skiplibcheck/)

> `skipLibCheck` 作用是：跳过 所有库文件(`d.ts`)的扫描检查(包括类型、语法检查)，即使`d.ts`中编写了非法语法也不报错

👇 因此我们可以得出跳过的 **好处** 是：
1. 节省编译/静态扫描耗时
2. 忽略第三方库 `d.ts`的错误导致项目无法启动
3. 忽略第三方库使用不同版本的`typescript`编写的 `d.ts`，在项目`typescript` 版本下不兼容而导致的报错，项目无法启动

👇 同时带来的 **坏处/影响** 是：
1. 第三方库or业务代码自己编写的 `d.ts`，没有错误提示，当编写了非法语法的内容时，在项目中体现为库文件不生效，但是需要手动排查是否语法问题or其他问题

[vite官方文档](https://cn.vitejs.dev/guide/features.html#typescript) 👇

> 一些库（如：`vue`）不能很好地与 `"isolatedModules": true` 共同工作
> 
> 你可以在上游仓库(`vue`)修复好之前暂时使用 `"skipLibCheck": true` 来缓解这个错误

## types TODO:
types 和lib配置区别
1. 都是d.ts - lib是内置的不同版本js和浏览器环境.d.ts `vscode/node_modules/types`？
2. types则是需要自己引入的 库.d.ts 或 node.d.ts - `node_modules/@types`

默认从 node_modules/@types/ 下读取第三方(非dom、esx.core等内置) d.ts

可以手动关闭，自定义读取哪些 types

typeRoots

types

## path相关rootDir/baseUrl/paths

- `rootDir` - `tsconfig` 生效的目录
- `baseUrl` - 用于引入模块时省略编写路径（会让业务代码的路径不清晰）（建议用别名
- `paths` - `路径别名` 和 `webpack` 别名功能相同

```json
"paths": {
  "@/*": "src/*"
}
```

## js相关allowJs/checkJs

`ts项目` 默认不支持识别 `js文件` ，而开启 `allowJs` 后，将允许 `ts` 和 `js` 混用

这适用于项目初期从 `js` 迁移到 `ts`，逐步迁移

> 允许使用 `js` 的话，有个小注意事项，就是 `tsc` 编译，依然会对 `js` 做编译生成 `新的js`
> 
> 此时如果没有设置 `输出目录`，即输出目录为原文件位置，2个js将会 `同名同后缀` 而编译报错

而开启 `checkJs` 后，`js` 内容将具有隐式(自动)类型定义，如下：
```js
let a = 1
a = '' // VSCode 报红类型错误
```
👆 `VSCode` 报红类型错误，并且执行 `tsc` 编译也将报错终止

在不开启 `checkJS` 时，因为 `js` 是**弱类型语法**，，这么赋值是合法的

因此有时我们会看到一些 `include` 配置 `['*.js']` ，确实是会让 `js` 具有一定的 `ts` 能力

## jsx TODO: 


## esModuleInterop

允许 `import` 和 `commonjs` 混用，避免有些老旧的第三方库只有 `commonjs` 输出, 导致项目无法启动

我们看到 `tsc --init` 生成的 [默认配置](#tsc-init) 中是开启这个的

## 格式相关

| _ | _ |
| ---| --- |
| noImplicitAny | 不允许隐式的`any`，默认`false`（允许）
| noFallthroughCasesInSwitch | 检查`switch`语句包含正确的`break`
| noImplicitReturns | 不允许隐式的`return`，设为`true`后，如果函数没有返回值则会提示
| noUnusedLocals | 检查有没有未使用的局部变量
| strictNullChecks | 检查空值，检查有可能为`null`的地方，对象链式调用确保不会是`null`

👆 和 eslint 作用有点重合


## isolatedModules TODO:

是否将每个文件作为单独的模块

vue3 要求开启

## noEmit

不输出转译结果，现代前端项目，把静态类型扫描交给 IDE 处理，但是当需要在提交代码前hook 执行命令扫描时，需要使用到 `tsc指令`

此时 配置 `noEmit` 相当于仅执行类型扫描，不执行转译

与项目 `dev` 和 `build` 过程都独立

## 其他

| _ | _ |
| ---| --- |
| removeComments | 将编译后的文件中的注释删掉，设为true即删掉注释
| sourceMap | 生成 `sourceMap` 文件，这个文件里保存的，是转换后代码的位置，和对应的转换前的位置。有了它，出错的时候，通过断点工具可以直接显示原始代码，而不是转换后的代码(识别并使用`.map`文件的是浏览器)
| alwaysStrice | 编译后的文件是否开启严格模式
| module | 编译结果使用的模块化标准: `None, CommonJS, AMD, System, UMD, ES6/ES2015, ES2020, ESNext`
| resolveJsonModule | 支持引入json，但是必须把编译后module设置为commonjs
| noResolve | 不自动导入第三方类型如: `import $ from 'jquery'`将可以使用`jquery库`，但是没有语法提示，可能在明确没有错误的场景编译时使用(但是这样就不要用ts不就好了...)

👆 `module` - 和 `target` 转译js语法同理，`现代前段构建工具` 转译处理模块化语法，不需要 `ts` 的转译功能

👆 `resolveJsonModule` 同理，不需要 `ts` 的转译能力，而是开启识别非ts的文件即可👇

使用 `.d.ts` 库声明文件
```ts
declare module '*.css';
declare module '*.json';
```
`declare module` 声明语法，一般是创建 `env.d.ts`



