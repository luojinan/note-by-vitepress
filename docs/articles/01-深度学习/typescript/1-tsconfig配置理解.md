# tsconfig配置理解

`tsconfig.json` 将会把一个文件夹转换为「项目」，如果不指定任何 `exclude` 或者 `files`，则包含在 `tsconfig.json` 中的所有文件夹中的所有文件都会被包含在编译中。

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

我们一般不使用 TS 的 [编译功能](./0.md#现代前端项目的选择)，不需要实时编译 `compileOnSave`

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

而 `files` 配置在非简易项目时并不适用，此时我们使用 `include、exclude` 指定目录，而不是配置 `files`

`exclude` 的默认值是 `["node_modules", "bower_components", "jspm_packages"]` + `outDir选项指定的值`, 如果有一些文件实在不想被 `TS` 扫描，可以手动配置(`node_modules`不会被覆盖而是合并)


注意以下情况，`exclude` 中指定的被忽略文件，将会无效依然被扫描：👇
1. import操作符
2. types操作符
3. `///<reference`操作符
4. 在files选项中添加配置的方式


如 umi 项目配置
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

- references - 参考
- extends - 继承

| _ | _ |
|--- | ---|
| extends | 继承其他配置文件，如基础配置 `tsconfig.base.json`
| references | 一个对象的数组，指明要引用的工程。path属性可以指向到包含tsconfig.json文件的目录，或者直接指向到配置文件本身（名字是任意的）

这里 `extends` 才是我们平时理解的复用，多份tsconfig配置 作用于 **单入口**，`tsconfig.base.json`.

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
👆 同理 1.入口范围指定为vite构建需要的文件 2. 使用 `extends` 复用 `@vue/` 官方库中的 `node` 配置


## lib

ts-learn/README.md

只考虑类型检查功能，则给 ts 文件框定环境，提升一点性能 以及 正确的环境语法提示







