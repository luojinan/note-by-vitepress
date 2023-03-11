# only-allow

利用 `npm preinstall` 钩子判断执行的包管理器是否符合预期

## which-pm-runs

👇 `only-allow` 依赖 [which-pm-runs](https://github.com/zkochan/which-pm-runs)
```js
function pmFromUserAgent (userAgent) {
  const pmSpec = userAgent.split(' ')[0]
  const separatorPos = pmSpec.lastIndexOf('/')
  return {
    name: pmSpec.substr(0, separatorPos),
    version: pmSpec.substr(separatorPos + 1)
  }
}
module.exports = function () {
  if (!process.env.npm_config_user_agent) {
    return undefined
  }
  return pmFromUserAgent(process.env.npm_config_user_agent)
}
```

## process.env.npm_config_user_agent

👇 创建 `index.js`
```js
console.log(process.env.npm_config_user_agent)
// --> pnpm/7.7.0 npm/? node/v16.14.2 darwin arm64
```

注意：直接执行 `node index.js` 只会输出 `undefined`

使用 `pnpm init` 指定 `"dev": "node ./index.js"` 运行 `pnpm dev` 输出 👇

`pnpm/7.7.0 npm/? node/v16.14.2 darwin arm64`

## preinstall hook

利用钩子执行检查，在钩子里中断进程

```js
console.log(process.env.npm_config_user_agent)

console.log('😄 test stop install')
process.exit(1)
```

添加脚本 `"preinstall": "node ./index.js"`

运行 `npm i`

- npm 6 符合预期效果，报错 且 不执行安装
- npm 7+ 钩子 preinstall 发生在安装后... [github issue](https://github.com/vuejs/ecosystem-ci/pull/6)
- `pnpm` 和 `npm 7+` 一致 发生在安装后

但是 `pnpm` 提供了自己的 `preinstall hook`

`"pnpm:devPreinstall": "node ./index.js"`

此时执行 `pnpm i` 可以报错 且 不执行安装

![](https://kingan-md-img.oss-cn-guangzhou.aliyuncs.com/blog/20230311171040.png)

但是同时设置 `preinstall` 和 `pnpm:devpreinstall` 会在 `pnpm i` 不中断的情况下前后各执行1次，中断则不会执行后一次

## 获取运行命令参数

```js
const argv = process.argv.slice(2) // node index.js pnpm --> [pnpm]
const wantedPM = argv[0]
```

## 完整代码
```js
// 当前运行命令的包管理器
const userAgent = process.env.npm_config_user_agent // --> pnpm/7.7.0 npm/? node/v16.14.2 darwin arm64
const [pmSpec] = userAgent.split(' ')
const [runName] = pmSpec.split('/')

// 当前项目限制的期望包管理器
const argv = process.argv.slice(2)
const wantedPM = argv[0]

if(runName !== wantedPM) {
  console.log(`💢 you need use ${wantedPM} in this progrem`)
  process.exit(1)
}

console.log(`😄 yep! ${wantedPM} is right`)
```

本来挺好的工具，因为 npm hook 的问题，变得难用了。。。

[源码 -github](https://github.com/luojinan/note-by-vitepress/tree/master/test/only-allow)


## 参考资料

- [源码分析1](https://juejin.cn/post/7033560885050212389)
- [源码分析2](https://juejin.cn/post/7088998655377539102)
- [pnpm/only-allow - github](https://github.com/pnpm/only-allow)
