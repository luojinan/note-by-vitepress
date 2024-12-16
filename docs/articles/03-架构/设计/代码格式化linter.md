在中文里，格式(名词)、格式化(动词)，太容易看着看着就混乱，我们按照在英文里的说法

- linter
- formatter

## 语法检测 + 代码风格/格式

## 检测 + 格式化

## eslint + prettier

## 编辑器 和 命令行(CI)

## antfu（纯 eslint）

1. 安装 `pnpm add -D eslint @antfu/eslint-config`

2. 配置 `eslint.config.js`

```js
// eslint.config.js
import antfu from '@antfu/eslint-config'

export default antfu()
```

👇 有趣的是，提供了一个脚本安装`pnpm add -D eslint @antfu/eslint-config` + 配置`eslint.config.js`，甚至能帮忙从eslint9- 迁移 migrate 到 eslint9 🤯

> We provided a CLI tool to help you set up your project, or migrate from the legacy config to the new flat config with one command.

```bash
pnpm dlx @antfu/eslint-config@latest
```

## Oxlint

## antfu + oxlint

```js
// eslint.config.js
import antfu from '@antfu/eslint-config'
import oxlint from 'eslint-plugin-oxlint'

export default antfu(
  {},
  oxlint.configs['flat/recommended'], // oxlint should be the last one
)
```

## Biome（Rust版 eslint+prettier）

## Zeroscript
