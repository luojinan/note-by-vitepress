# npm yarn pnpm

![](https://kingan-md-img.oss-cn-guangzhou.aliyuncs.com/blog/20230309224003.png)

> keys: `幽灵依赖`、`分身依赖`、`npm ci`、`lockfiles`、`hardlink`、`softlink`

## npm install 执行流程

![](https://kingan-md-img.oss-cn-guangzhou.aliyuncs.com/blog/20230112160326.png)

1. 检查 npm 的环境配置(`.npmrc`)
   - 一般都是默认的安装npm时的电脑配置
   - 手动设置一般只会设置 `npm` 源，如设置成淘宝镜像
   - 配置优先级: `项目级的.npmrc文件 > 用户级的 .npmrc文件 > 全局级的 .npmrc > npm内置的 .npmrc 文件`
2. 检查  `lockfiles` 
   - 并不是检查  `lockfiles` 是否存在, ❌ 有  `lockfiles` 就按照该文件安装依赖
   - 而是检查  `lockfiles` 中的依赖清单, 是否和 `package.json` 中的依赖清单一致
   - 一致, 则按照  `lockfiles` 的依赖清单安装依赖
   - 不一致, 不同版本的 npm 做的事情不一样
     - npm v5.0x 不一致就直接以 `package.json` 依赖清单为准
     - npm v5.1.0 - v5.4.2 不一致 TODO: 看不懂
     - npm v5.4.2 以上 判断 `package.json` 依赖清单定义的版本允许  `lockfiles` 中的依赖版本, 则按  `lockfiles` 安装, 如果不允许则按 `package.json` 安装
3. 遍历获取远程依赖包信息, 构建该依赖包的依赖树信息(TODO: 下载前还有一个仅获取依赖信息的网络请求?)，把依赖分析后的依赖树扁平化有利于去重(依赖名和版本都要相同)
4. 检查相应缓存, 有则取缓存, 无则远程下载(不是判断项目内node_modules缓存, 而是电脑全局的 `store` 通过 `npm config get cache`查看) 下载以及取缓存的都是压缩包,还有一个解压步骤
5. 生成  `lockfiles` 


🤔  有些依赖按 lock 安装 有些依赖按 `package.json` 安装吗？ 还是要么按 `package.json` 要么按 `lockfiles`


## npm/yarn 扁平化方案

> 👆 的流程图里，我们看到 `构建依赖树` 有`扁平化`的操作

其实早期的 `npm` 并不是扁平化依赖, 而是保留依赖关系的树状嵌套结构

```
node_modules
├── A@1.0.0
│   └── node_modules
│       └── B@1.0.0
└── C@1.0.0
    └── node_modules
        └── B@1.0.0
        └── D@1.0.0
```
👇 这种树状结构的明显问题是: 不同父级节点的相同子依赖重复安装了(而前端库的依赖结构嵌套是非常夸张的！🔥)
![](https://kingan-md-img.oss-cn-guangzhou.aliyuncs.com/blog/20230309225108.png)

后来 `yarn` 采用扁平 `node_modules` 结构解决重复安装的问题, 而 `npm` 也跟进成了扁平结构

**扁平结构依赖解决了一些问题也带来了一些问题** 🤔️

### 扁平化解决了树状结构问题
- 重复安装
- 依赖层级太深, 路径过长, windows系统会出现一些问题

### 扁平化依赖带来了新问题
- `幽灵依赖`问题: 项目的 `package.json` 中没有引用的依赖，出现在 `node_modules` 目录下, 此时项目可以直接使用该依赖(也就是 `package.json` 不能描述准确依赖清单了, 这直接违反了 `package.json` 包管理的设计初衷)
  - 当某个依赖升级后不再依赖那个幽灵依赖时, 项目内如果使用了, 将报错
  - 不了解幽灵依赖的具体版本, 如幽灵依赖版本较低, 项目内按照最新版本文档使用, 可能无法使用
- `分身依赖`问题: 扁平依赖的去重仅判断包名不判断版本, 也就是同名不同版本的依赖不会扁平到 `node_modules` , 而是仍然嵌套到具体的依赖包目录里(扁平依赖的判断是出现同名不同版本时嵌套)
  - 重复安装-嵌套的包没有提升并且有多个时
  - 重复的 `Typescript` 类型可能不同会互相冲突

```
node_modules
├── A@1.0.0
│   └── node_modules
│       └── B@1.0.0
├── B@2.0.0
└── C@1.0.0
```
```
node_modules
├── A@1.0.0
├── B@1.0.0
└── C@1.0.0
     └── node_modules
         └── B@2.0.0
```

> 网上大部分说法是会根据 `package.json` 里面的顺序决定谁会被提出来，放在前面的包依赖的内容会被先提出来

> 看源码后，`npm` 其实会调用一个叫做 `localeCompare` 的方法对依赖进行一次排序，实际上就是字典序在前面的 `npm` 包的底层依赖会被优先提出来。

👆 可以看出并 **不是彻底的扁平化**

> 🤔 应用依赖A、B，A也依赖B，会不会重复打包B？
> 
> 取决于 `分身依赖` 的同名是否同版本的判断, 若同版本不会重复安装, 不同版本就会

## pnpm

`npm/yarn` 虽然都能创建 `软/硬链接`, 但是这个功能是用于用户自己设置要软链接的依赖

👆 指 [TODO: npm link](./npm-link%E7%9A%84%E4%BD%BF%E7%94%A8.md)

而 `pnpm` 则内部利用 `软/硬链接` 设置了完善的依赖存储方案

### 概念 inode
`inode` 每个文件都有一个唯一的 `inode`, 包含文件元信息, 当访问文件时, 对应的元信息会被 copy 到内存去实现访问

`stat xxx.md` 可以查看具体文件的元信息

✨ **可以用来指向, 也可以把别的文件也定义成相同的** `inode`

### 概念 hard/link link
`Linux` 中包括两种链接：
1. 硬链接(`hard link`)
   - 创建多个空文件, 这些文件的 `inode` 等同于源文件 `inode`, 意味着只要源文件修改这些空文件也会同步修改，同理修改链接内容也会影响源文件以及其他所有链接
   - 并且这个指向是双向的, 只要链接数非 0, 文件就一直存在
   - 当源文件被删除，这个链接仍有内容不会为空
2. 软链接(`soft link`)，软链接又称为符号链接（symbolic link）
   - 创建多个空文件, 这些文件的 `inode` 是新的唯一的 `inode`, 永远指向源文件
   - 当源文件被删除，这个指向会保留但是为空，恢复源文件即可恢复内容
   - 这个指向是单向的, 删除 `soft link` 不影响源文件

### pnpm 依赖结构

![](https://kingan-md-img.oss-cn-guangzhou.aliyuncs.com/blog/20230310134808.png)

`package.json`中的依赖清单显示在 `node_modules` 下, 还有1个 `node_modules/.npm/`目录树状存放所有依赖(包括嵌套的依赖)

所有的依赖都是从全局 `store` 硬连接到了 `node_modules/.pnpm` 下，然后之间通过软链接来相互依赖。

```txt
node_modules
├─ .pnpm
│   └─ dayjs@1.10.7
└─ dayjs
```

外层的没有版本号

[node_modules结构 - pnpm官方文档](https://pnpm.io/symlinked-node-modules-structure)

扁平化所有嵌套依赖，同时保留2级树状结构👇

Every file of every package inside `node_modules` is a hard link to the
content-addressable store. Let's say you install `foo@1.0.0` that depends on
`bar@1.0.0`. pnpm will hard link both packages to `node_modules` like this:

```txt
node_modules
└── .pnpm
    ├── bar@1.0.0
    │   └── node_modules
    │       └── bar -> <store>/bar
    │           ├── index.js
    │           └── package.json
    └── foo@1.0.0
        └── node_modules
            └── foo -> <store>/foo
                ├── index.js
                └── package.json
```

👆 `package.json` 中依赖了 foo，在 `node_modules/.npm/` 会把嵌套依赖也扁平化

These are the only "real" files in `node_modules`. Once all the packages are
hard linked to `node_modules`, symbolic links are created to build the nested
dependency graph structure.

As you might have noticed, both packages are hard linked into a subfolder inside
a `node_modules` folder (`foo@1.0.0/node_modules/foo`). This is needed to:

1. **allow packages to import themselves.** `foo` should be able to
`require('foo/package.json')` or `import * as package from "foo/package.json"`.
2. **avoid circular symlinks.** Dependencies of packages are placed in the same
folder in which the dependent packages are. For Node.js it doesn't make a
difference whether dependencies are inside the package's `node_modules` or in
any other `node_modules` in the parent directories.

👆 扁平化出来的依赖，内部多一层 `node_modules/.npm/foo/node_modules` 这里存放依赖包, 为了实现 引用自身 和 构建树状依赖关系

The next stage of installation is symlinking dependencies. `bar` is going to be
symlinked to the `foo@1.0.0/node_modules` folder: 👇

```txt
node_modules
└── .pnpm
    ├── bar@1.0.0
    │   └── node_modules
    │       └── bar -> <store>/bar
    └── foo@1.0.0
        └── node_modules
            ├── foo -> <store>/foo
            └── bar -> ../../bar@1.0.0/node_modules/bar
```

👆 `foo` 依赖 `bar`, 在 `foo` 子级中生成软连接到 扁平化的 `bar`

Next, direct dependencies are handled. `foo` is going to be symlinked into the
root `node_modules` folder because `foo` is a dependency of the project: 👇

```txt
node_modules
├── foo -> ./.pnpm/foo@1.0.0/node_modules/foo
└── .pnpm
    ├── bar@1.0.0
    │   └── node_modules
    │       └── bar -> <store>/bar
    └── foo@1.0.0
        └── node_modules
            ├── foo -> <store>/foo
            └── bar -> ../../bar@1.0.0/node_modules/bar
```

👆 最终再把 `package.json` 直接依赖的包在外层 `node_modules` 创建软连接到 `/.pnpm`

This is a very simple example. However, the layout will maintain this structure
regardless of the number of dependencies and the depth of the dependency graph.

Let's add `qar@2.0.0` as a dependency of `bar` and `foo`. This is how the new
structure will look: 👇

```txt
node_modules
├── foo -> ./.pnpm/foo@1.0.0/node_modules/foo
└── .pnpm
    ├── bar@1.0.0
    │   └── node_modules
    │       ├── bar -> <store>/bar
    │       └── qar -> ../../qar@2.0.0/node_modules/qar
    ├── foo@1.0.0
    │   └── node_modules
    │       ├── foo -> <store>/foo
    │       ├── bar -> ../../bar@1.0.0/node_modules/bar
    │       └── qar -> ../../qar@2.0.0/node_modules/qar
    └── qar@2.0.0
        └── node_modules
            └── qar -> <store>/qar
```

👆 而假设是 3级嵌套的依赖，会由`.npm/` 层的依赖构建关系，最终也只会由2级，而不会无限嵌套 ✨

As you may see, even though the graph is deeper now (`foo > bar > qar`), the
directory depth in the file system is still the same.

This layout might look weird at first glance, but it is completely compatible
with Node's module resolution algorithm! When resolving modules, Node ignores
symlinks, so when `bar` is required from `foo@1.0.0/node_modules/foo/index.js`,
Node does not use `bar` at `foo@1.0.0/node_modules/bar`, but instead, `bar` is
resolved to its real location (`bar@1.0.0/node_modules/bar`). As a consequence,
`bar` can also resolve its dependencies which are in `bar@1.0.0/node_modules`.

👆 看起会有点混乱，但其实完全符合 `nodejs` , 且能很好的就解决 `幽灵依赖` 和 `利用全局缓存` 等问题

A great bonus of this layout is that only packages that are really in the
dependencies are accessible. With a flattened `node_modules` structure, all
hoisted packages are accessible.

### pnpm install 安装过程

`pnpm install` 安装时会判断全局的 `store` 中是否已存在对应的依赖
- 存在则在 `node_modules/.pnpm` 创建一个 `hard link`
- 不存在则下载 并安装到 `store` 中, 项目中的 `node_modules/.pnpm` 依然创建的是一个 `hard link`

按照👆的说法, `node_modules/.pnpm` 内部应该全都是 `hard link`

### `/.pnpm/`目录解决 幽灵依赖 问题

`node_modules` 外层(非 `.pnpm/` 目录下的依赖包), 只有 `package.json` 中依赖清单中对应的包

而 上面提到扁平化结构导致的 `幽灵依赖` 问题, 非 `package.json` 中的依赖在 `node_modules/.pnpm` 中才有, 在 `node_modules` 下没有

因此按照 `nodejs` 对 `bare module` 向上寻址是找不到依赖的, 项目内使用就会报错, 也就解决了 `幽灵依赖` 的问题

并且外层的 `package.json` 依赖包, 是 `soft link` 到 `node_modules/.pnpm`的对应依赖, 也就是外层和内层都有, 但是都是 `link`

🤔 为什么不是 `hard link`

### 解决分身依赖问题

上面提到 `npm/yarn` 的依赖是不彻底的扁平化, 当依赖同名不同版本时, 会安装到各自依赖内部

`pnpm` 安装的 `node_modules/.pnpm` 是嵌套结构, 连不彻底的扁平都不考虑

`pnpm` 在外层 名称 不带版本

但是 `store` 以及 `node_modules/.pnpm` 中的依赖包名是带版本的

依赖同名(包括版本), 会安装到各自依赖内部, 这会是一个 `soft link` 直接取 `node_modules/.pnpm` 中的依赖( `hard link` 到 `store` )

✨ **真实依赖文件全局只保存1份，项目依赖结构里的都是软硬连接**

这就解决了重复安装的问题

### 更快的原因

- `npm/yarn` 也在本地有缓存, 但是 `pnpm` 依然比他们快。是因为 `npm/yarn` 取到缓存,还需要解压并复制文件到项目内，而 `pnpm` 只用创建 `hard link`
- 首次安装依赖 `pnpm` 也比 `npm/yarn` 快 则是因为 `pnpm` 可能有缓存嵌套依赖, 而 `npm/yarn` 缓存嵌套依赖的机制没有这么全面

### 包存储在了 `store` 中，为什么我的  `node_modules`  还是占用了磁盘空间？

`pnpm` 创建从 `store` 到项目下  `node_modules`  文件夹的硬链接，但是硬链接本质还是和原始文件共享的是相同的 `inode`

因此，它们二者其实是共享同一个空间的，看起来占用了  `node_modules`  的空间

所有始终只会占用一份空间，而不是两份

### pnpm不足之处

1. 全局 `hardlink` 也会导致一些问题，比如改了 `link` 的代码，所有项目都受影响；对 `postinstall` 不友好；在 `postinstall` 里修改了代码，可能导致其他项目出问题

> 👆 pnpm 有考虑这种问题, 默认其实是 [clone(copy on write)](https://pnpm.io/npmrc#package-import-method) 而不是 `hard link`，但是 `clone` 的方式对 `mac` 没生效，因此 `fall back` 了 `hard link`, 文档中列出了这个属于 `Nodejs` 的 `bug`, 当这个问题被修复，以后都会是 `clone` 而不是 `hard-link`

2. 由于 `pnpm` 创建的 `node_modules` 依赖软链接，因此在不支持软链接的环境中，无法使用 `pnpm`，比如 `Electron` 应用

## 所有依赖安装到 dependencies 不区分dev会有什么问题？

- `dependencies` 项目依赖
- `devDependencies` 开发依赖
- `peerDependencies` 同版本的建议依赖
- `bundledDependencies` 捆绑依赖
- `optionalDependencies` 可选依赖

`dependencies` 表示项目依赖，这些依赖都会成为你的线上生产环境中的代码组成的部分。当 它关联到 `npm` 包被下载的时候, `dependencies` 下的模块也会作为依赖, 一起被下载。

实际上, 依赖是否是被打包,完全是取决你的项目里的是否是被引入了该模块

而 `devDependencies` 中的依赖一定不会被打包的

👇 得看项目
- 如果是前端 `spa` 应用 或者一次性的 `ssg` 项目可以这样做
- 但是如果是发布为依赖库就需要特别注意到底依赖是 `devDependencies` 还是仅生产环境下的依赖 `dependencies`

## 同时用npm和yarn会有什么问题？

antfu 的 vitesse 需要通过包的锁文件去判断具体用到那个包管理器然后用这个包管理器去自动安装具体的图标集依赖

不同的包管理器的 网络机制 缓存机制 下载后的依赖分布 不同，如果特别依赖这些的项目也需要注意一下

主要是造成不同机器上同一项目的依赖版本不一致, 严重的是构建部署机安装的依赖和开发本地依赖不一致造成不可知的线上问题

## 是否应该提交lockfiles到仓库？ 删除node_modules和lockfiles，重新install，是否有风险？

首先确定 `lockfiles` 的作用
-  `lockfiles` 用于保持依赖版本
-  `lockfiles` 是依赖分析后的文件，有  `lockfiles` 就不用再做一次依赖分析，构建依赖树清单(扁平化), 提升一点速度

`package.json` 中的依赖清单即使限制具体版本，嵌套依赖依然没办法限制, 还是会出现过一段时间后, 重新安装的依赖跟以前不同(嵌套依赖升级了)

比对 `lockfiles` 和 `package.json` 的版本，一般都是落后于 `package.json` 才不一致(手动升级了某个依赖)

此时会判断 `lockfiles` 落后的版本在 `package.json` 那里是否兼容，兼容的话不按package.json的新版本依赖来安装, 依然取 `lockfiles` (比对之后会相应的更新lock中的版本)

👆 注意流程图中不同 npm 版本处理 lock 比对版本的处理不相同，因此不同电脑的 npm 应该尽量相同，避免 lock 比对过程，每个人安装的依赖版本不同(有些按照 lock 有些按照 package)


因此为了保证项目的长久稳定, 应该提交 lock 到仓库, 当需要升级某个依赖时, 更新 lock 及 `package.json` 提交

如果他人因为 npm 版本不同, 按照 lock 安装不了依赖

或按照 lock 成功安装了依赖, 但是运行项目时依赖报错, 此时可能是该依赖版本不兼容这个 nodejs 环境, 此时可以整个项目考虑兼容这个 nodejs 环境去对这个依赖升级或是降级,并提交调整后的 `package.json` 和 lock, 考虑不兼容这个 nodejs 环境的话, 就让对方换成可以运行的 `nodejs` 版本

## 为什么 npm i 后lockfiles变了

首先需要明确的是，`npm i` 会先比对 `lockfiles` 内的版本是否符合 `package.json`
如果符合的话是不会按照 `package.json` 自动更新依赖的

而 `lockfiles` 不符合 `package.json` 版本的情况一般是 `package.json` 版本定义更高了

> 因为 `package.json` 版本定义的是最低版本，一般情况下自动生成的 `lockfiles` 都不会低于 `package.json`

手动改 `lockfiles` 的情况不多，手动改 `package.json` 反而会多点
- 改低 `package.json` 的话， `lockfiles` 的依赖版本是符合的，此时安装会走 `lockfiles` 而不是 `package.json` 也就是想在已有 `lockfiles` 的情况下安装低版本依赖，需要删除 `lockfiles` 在安装
- 改高 `package.json` 的话， `lockfiles` 的依赖版本不符合，此时会按照 `package.json` 的版本查找远程库的最高版本进行安装

也许你会说手动改 `package.json` 的情况也不多呀，都是 `npm i xx` 升级版本的，会自动更新 `package.json` 和 `lockfiles`

但是假如此时提交代码，只提交 `package.json`，丢弃 `lockfiles`，出现的结果就和手动改高 `package.json` 的情况一致了

回到问题：为什么 `npm i` 后`lockfiles`变了

因为 `lockfiles` 和 `package.json` 不符合，`npm` 自动查找不符合的依赖在 `package.json` 版本定义的远程库的最新版本

为什么 `lockfiles` 和 `package.json` 不符合，就是有人 手动改了 `package.json` 或是 升级了依赖没有提交新的 `lockfiles`

如何避免：👇
- 只要升级依赖就同时提交 `package.json` 、 `lockfiles`
- 理论上只要符合版本，都会走 `lockfiles` 不会出现不同的人本地依赖不一致问题，此时使用 `npm ci` 可以提升速度(只建议用于提升速度，而不是用于避免依赖走`package.json`)
- 如果使用 `npm i` 安装出现 `lockfiles` 变化，应检查变化项，并提交此 `lockfile` 上锁，让正确的 `lockfile` 控制版本，而不是按照落后的 `lockfile` 来 `npm ci`

## npm ci

[npm文档](https://docs.npmjs.com/cli/v8/commands/npm-ci)

官方称这种安装是 `clean install`

> used in automated environments such as test platforms, continuous integration, and deployment
> 
> 常用于自动化环境：测试平台、持续集成、部署环境

> In short, the main differences between using npm install and npm ci are:
> - The project must have an existing `package-lock.json` or `npm-shrinkwrap. json`.
> - If dependencies in the package lock do not match those in `package.json`, `npm ci` will exit with an error, instead of updating the package lock.
> - `npm ci` can only install entire projects at a time: individual dependencies cannot be added with this command.
> - If a node_modules is already present, it will be automatically removed before `npm ci` begins its install.
> - It will never write to `package.json` or any of the package-locks: installs are essentially frozen.

如果仅仅从官方提供的区别来看：

`npm ci` 也会先比对 `lockfiles` 内的版本是否符合 `package.json`
- 不符合就中断安装
- 符合就直接按照 `lockfiles` 安装依赖，不查询依赖远程库的版本是否更新

`npm ci` 在安装前会自动清除现存的 `node_modules`，所以 `npm ci` 天然规避了增量安装可能带来的不一致性等问题。（这也意味着，你又可以少记一条命令 npm prune。）

当想在已有 `node_modules` 情况下按照 `lockfiles` 安装依赖

`npm ci` 意味着会重新安装所有依赖，速度可能会比 `npm i` 慢(从头从全局缓存解压或是网络下载)
但是为了不出问题，大家按照 `lockfiles` 安装依赖都是手动删除 `node_modules` 的... 不敢直接安装，所以 `npm ci` 反而是符合习惯的...

可以用 `--prefer-offline`，最大限度地利用 npm 的全局缓存加速安装过程

> 注意：就像上面说的， `npm ci` 只建议用于提升速度，而不是用于避免依赖走`package.json`
>
> 当出现 `npm ci` 不符合而中断安装时，应检查修复 `lockfiles` 版本问题, 并使用 `npm i` 自动生成正确的 `lockfiles` (不要手动改)

## 迁移 npm to pnpm

[How to migrate from yarn / npm to pnpm](https://dev.to/andreychernykh/yarn-npm-to-pnpm-migration-guide-2n04)

1. 删除 `node_modules`
2. 直接执行 `pnpm i`
3. 执行 `pnpm dev`，看控制台报错，看哪个包缺失，再给补上到 `package.json`

👆 理论上换个 pnpm 重新安装依赖, 就可以启动项目了, 跟 npm 依赖完全无关了

![](https://kingan-md-img.oss-cn-guangzhou.aliyuncs.com/blog/20230310150818.png)

🤔 一些ts问题，为什么在pnpm环境下报错(npm环境不会)

还是幽灵依赖的问题，`@types/node` 在npm 环境会被其他依赖安装到 `node_modules/@types` 下
pnpm 则不会，因此需要手动提升到外部，这里虽然缺失的是 @types/node ，但是查看 tsconfig.ts 配置的 types 是 webpack-env

而 webpack-env 是基于 @types/node 的，因为按照真实ts配置安装 webpack-env

`tslib` 同理

![](https://kingan-md-img.oss-cn-guangzhou.aliyuncs.com/blog/20230314102459.png)
vue2.7 ts报错
升级 typescript `pnpm up typescript --lastest`


![](https://kingan-md-img.oss-cn-guangzhou.aliyuncs.com/blog/20230314114711.png)
升级 husky `pnpm up husky --lastest`


配置 preinstall 效果如下

![](https://kingan-md-img.oss-cn-guangzhou.aliyuncs.com/blog/20230318104521.png)

npm6 有效
npm 7+ 的 pre hook 在 install 后，一直未修复 issue



但是启动项目报错 包缺失, 并不是因为 pnpm 安装不到包, 而是因为 npm 允许直接使用 package.json 中没有的依赖(幽灵依赖), 在 pnpm 的依赖目录结构中是不允许的, 因此即使pnpm安装全了依赖, 也会报错 包缺失

此时，手动安装缺失的包, 自动补充到 package.json 中

问题：安装一个运行一次启动, 靠报错提示一个一个安装....

自动化工具思路：扫描项目代码中的引入语句, 找出 package.json 中没有的幽灵依赖, 一次性安装(工具难点在扫描效率)

参考 [@sugarat/ghost](https://www.npmjs.com/package/@sugarat/ghost)

扫描使用 babel/swc ?

1. 扫文件；
2. 提取导入资源路径；
3. 提取包名；
4. 剔除 package.json 中存在的
5. 剩下的包名就是幽灵依赖

使用 only-allow 限制包管理器


TODO: 迁移笔记 + 过一遍 pnpm 英文文档


## pnpm 使用 ci

`pnpm` 没有 `ci` 指令

我们上面了解了 `ci` 的作用：在持续集成等环境按照 `lockfiles` 安装依赖，并且不符合时中断安装

[pnpm i 官网文档](https://pnpm.io/cli/install#--frozen-lockfile) 提到 `pnpm` 内置 [is-ci](https://www.npmjs.com/package/is-ci) 判断当前环境是 `ci` 环境会设置 `--frozen-lockfile` 为 `true`，该选项就是 ci 的效果

> 就像上面反复强调的， `npm ci` 不是用于避免依赖走 `package.json`
> 
> 使用 `pnpm` 也不应该存在 `lockfiles` 内依赖不符合 `package.json` 的情况，不应该想着我要按照 `lockfiles` 安装依赖，要知道只要 `lockfiles` 符合 `package.json` 就不会自动更新依赖！

而提升速度的作用，在 `pnpm` 下并不会太明显

因此 `pnpm i` 足够了，不需要额外考虑

## 参考资料

- [字节的一个小问题 npm 和 yarn不一样吗？](https://juejin.cn/post/7060844948316225572)
- [pnpm 解决我哪些痛点？](https://juejin.cn/post/7036319707590295565)
- [聊聊依赖管理 -  字节前端 ByteFE](https://mp.weixin.qq.com/s/9JCs3rCmVuGT3FvKxXMJwg)
- [node_modules结构 - pnpm官方文档](https://pnpm.io/symlinked-node-modules-structure)
- [pnpm 原理解析](https://github.com/lvqq/blog/issues/60)
