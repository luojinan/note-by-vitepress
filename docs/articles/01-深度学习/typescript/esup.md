
## 不在大型项目里运行ts文件

- `esno`、`ts-node` 都是在node环境中直接运行ts文件的工具
- `bun` 自身内置支持直接运行ts，因此也会有人拿bun和esno、ts-node做对比，但是需要注意它们的运行环境不一样
- 未来 `Nodejs` 自身内置支持运行ts

[Nodejs V22.6 run Ts by natively](https://nodejs.org/en/learn/typescript/run-natively)

```shell
node --experimental-strip-types test.ts
```

`--experimental-strip-types`

`--实验性-剥离-类型`

## tsup

`tsup` 基于 `esbuild` 是对标构建工具的库，如webpack、rollup

（之所以不把 `esbuild` 也纳入对标的构建工具中是因为 `esbuild` 已经作为很多构建工具的基础库，而tsup恰恰是基于 esbuild的）
