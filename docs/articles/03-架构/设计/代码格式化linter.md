在中文里，格式(名词)、格式化(动词)，太容易看着看着就混乱，我们按照在英文里的说法

## 检测 + 格式化

- linter
  - 词源: 来自 "lint"，原意是指织物上的绒毛或灰尘
  - 在编程中，"lint" 指的是代码中的小问题或不规范的地方。
  - 注意：不是 "line - 行"
  - **输出**: 通常会生成报告或警告，指出代码中的问题及其位置
- formatter
  - 词源: 来自 "format"，意为格式化或排列
  - **输出**: 直接修改代码文件，使其格式化为预定的样式

- **Linter**:
  - 检查语法错误。
  - 检测未使用的变量和函数。
  - 检查潜在的逻辑错误。

- **Formatter**:
  - 自动调整缩进。
  - 统一括号、引号的使用。
  - 调整空格和换行。

🤔 不管从中文还是英文的概念上看，都很容易混为一谈，完全可以统一为“语法风格检测”

再加上，本应专注于语法检测的eslint，还具备格式检测，甚至可以 `--fix` 自动修改(格式化)

本应专注于格式检测的prettier，也具备语法检测格式化

即： 从实操工具上，更加重了 linter 和 formatter 的混乱

## 编辑器(VSCode) 和 命令行(CI)

我们暂且不论 eslint 和 prettier工具真实的效果，现在假设他们各司其职，eslinter只检测语法，可以通过`--fix`自动修复语法问题，prettier只负责格式化代码风格，两者可以完美配合使用

从目的上看，我们只要保证提交到代码仓库的代码是符合要求的就可以了：

在**多人协同的场景**里，我们会希望这2份配置是跟随项目代码共享的，所以会有2份配置文件在不同的项目代码里，而不是配置到每个人的电脑里

在**个人的开发体验**里，我们不能等修改了一堆代码后在提交时通过命令去检测修复和格式化，而是希望每次保存文件时都触发检测修复和格式化，这样的 **性能** 也会比起批量扫描修改过的文件要快（只扫描当前保存的文件）

因此有编辑器plugin可以帮助我们保存时按照 语法检测配置 和 风格格式化配置进行格式化，也就是他们各自出的官方编辑器插件 eslint plugin 和 prettier plugin

👇 并且在编辑器（VSCode）中开启保存时触发

`.vscode/settings.json`

```json
// 开启保存时自动格式化 prettier
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode"
}
// 开启保存时自动fix eslint
{
  "editor.formatOnSave": false,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit",
  },
}
```

> 没错 他们是冲突的，我们后面再说

🥳 现在，我们每次保存代码都会触发编辑器的自动格式化，并且会按照每个项目对应的配置规则来进行格式化，只有每个人的编辑器都安装好插件并且配置好编辑器设置(上传到代码仓库)就可以了

但是！这只是 **浅约定** 大家都按照规定的操作来开发和保存触发格式化，并不能真正约束提交到仓库的代码被格式化好或者修复好，如：1.被人本地临时修改规则配置文件来绕过校验提交代码 2. 被用其他编辑器来修改代码从而绕过插件校验 3. 临时关闭插件来绕过插件校验... 4. 某些无法被自动修复的语法，忘记手动修改

所以往往我们需要 **强约定** 提交必须触发格式化，不能太依赖编辑器就要运行命令在提交时触发的格式化或者修改

此时还需要安装对应的npm依赖包，并提供命令来触发格式化，一般是在提交前触发（通过git hook功能实现）

```bash
pnpm add -D eslint prettier
```

`package.json`

```json
{
  "scripts": {
    "lint": "eslint --fix && prettier . --write"
  },
}
```

> git hook 不在本次的讨论范围
>
> 参考 husky + lint-staged 或者 lefthook

现在我们在本地保存时自动触发格式化，并且在git push时拦截没有及时修改的不符合规则的文件了

我们需要明白这一系列操作的目的是什么，比如：

- 为什么安装npm依赖还要安装编辑器插件(保存格式化、实时报红)
- 为什么要提交规则文件，为什么要提交编辑器设置文件

> 🤔 因此，当我们是小团队或者个人开发时，可以考虑仅仅依靠编辑器自动格式化，不需要git hook拦截
>
> 可以节省下 1. linter formatter 的npm依赖(配置文件仍需要)，2.以及git hook 的npm依赖和配置(husky + lint-staged 或者 lefthook)，3.以及提交的速度

TODO: 编辑器插件是否自动格式化是否仍需要项目内安装依赖

## eslint + prettier

正如上面说的，linter 和 formatter 是可以共存的，但是两者的冲突问题，需要我们自己解决

[处理 ESLint 和 Prettier 冲突](https://ssqdoit.top/daily/2024/ESLint%20+%20Prettierrc%20%E4%BB%A3%E7%A0%81%E8%B4%A8%E9%87%8F%E6%A3%80%E6%9F%A5%E4%B8%8E%E6%A0%BC%E5%BC%8F%E5%8C%96.html#%E5%A4%84%E7%90%86-eslint-%E5%92%8C-prettier-%E5%86%B2%E7%AA%81)

## antfu（纯 eslint）

> Auto fix for formatting (aimed to be used standalone without Prettier)

[github](https://github.com/antfu/eslint-config/issues?q=oxlint)

1. 安装 `pnpm add -D eslint @antfu/eslint-config`
2. 配置 `eslint.config.js`

```js
// eslint.config.js
import antfu from '@antfu/eslint-config'

export default antfu()
```

👇 默认配置有些东西不太习惯，关掉一些太个性化的配置

```js
import antfu from '@antfu/eslint-config'

// Auto fix for formatting (aimed to be used standalone without Prettier) https://github.com/antfu/eslint-config
export default antfu(
  {
    lessOpinionated: true, // allow arrow function and if else etc https://github.com/antfu/eslint-config?tab=readme-ov-file#top-level-function-style-etc
    isInEditor: false, // auto fix import by eslint https://github.com/antfu/eslint-config?tab=readme-ov-file#editor-specific-disables
  },
  {
    files: ['**/*.ts', '**/*.vue'],
    rules: {
      'no-console': 'off',
      'vue/eqeqeq': 'off',
      'eqeqeq': 'off',
      // ...
    },
  },
)
```

设置编辑器保存自动格式化(只需要开启eslint)

[IDE Support - github](https://github.com/antfu/eslint-config?tab=readme-ov-file#ide-support-auto-fix-on-save)

```json
{
  // Disable the default formatter, use eslint instead
  "prettier.enable": false,
  "editor.formatOnSave": false,

  // Auto fix
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit",
    "source.organizeImports": "never" // eslint 排序import 和 Vsccode默认排序规则 不一致，选择eslint处理import时关闭
  },

  // TODO: Silent the stylistic rules in you IDE, but still auto fix them
  "eslint.rules.customizations": [
    { "rule": "style/*", "severity": "off", "fixable": true },
    { "rule": "format/*", "severity": "off", "fixable": true },
    { "rule": "*-indent", "severity": "off", "fixable": true },
    { "rule": "*-spacing", "severity": "off", "fixable": true },
    { "rule": "*-spaces", "severity": "off", "fixable": true },
    { "rule": "*-order", "severity": "off", "fixable": true },
    { "rule": "*-dangle", "severity": "off", "fixable": true },
    { "rule": "*-newline", "severity": "off", "fixable": true },
    { "rule": "*quotes", "severity": "off", "fixable": true },
    { "rule": "*semi", "severity": "off", "fixable": true }
  ],

  // TODO: Enable eslint for all supported languages
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact",
    "vue",
    "html",
    "markdown",
    "json",
    "jsonc",
    "yaml",
    "toml",
    "xml",
    "gql",
    "graphql",
    "astro",
    "svelte",
    "css",
    "less",
    "scss",
    "pcss",
    "postcss"
  ]
}
```

👇 有趣的是，提供了一个脚本安装`pnpm add -D eslint @antfu/eslint-config` + 配置`eslint.config.js`，甚至能帮忙从eslint9- 迁移 migrate 到 eslint9 🤯

> We provided a CLI tool to help you set up your project, or migrate from the legacy config to the new flat config with one command.

```bash
pnpm dlx @antfu/eslint-config@latest
```

查看 eslint 配置，会在本地启动一个静态网页来查看

```bash
npx @eslint/config-inspector
```

> 有趣的是 antfu 把这个查看配置部署到服务器，就可以让所有人看到
>
> [@antfu/eslint-config 开启的配置项](eslint-config.antfu.me/)

## Oxlint

## Oxlint + eslint

使用 [unplugin-oxlint](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Ftmg0%2Funplugin-oxlint)

> unplugin 系列的工具，都是为了抹平各种构建工具使用plugin机制的差异，主要方便plugin开发者
>
> 对于使用者来说，如果能自己找到对应的构建工具的插件，就不需要使用 unplugin 系列的插件

注意现在(2024.5)安装的eslint都是9版本，配置文件可以编写函数，且不再使用`.eslintrc.*`的文件名

> 🤮 而且VSCode的eslint插件没有发布9版本对应的正式版，要手动安装成pre版，否则VSCode无法静态检查(不会显示红色波浪线也不会触发自动保存)

👇 `vite.config.js` 使用 `unplugin-oxlint`

```js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Oxlint from 'unplugin-oxlint/vite'

// <https://vitejs.dev/config/>
export default defineConfig({
  plugins: [
    vue(),
    Oxlint({
      includes: ['src/**/*.{ts,vue}'],
    }),
  ],
})
```

## antfu + oxlint

[antfu github oxlint](https://github.com/antfu/eslint-config/issues/535#issuecomment-2224527120)

```sh
pnpm add eslint @antfu/eslint-config -D
pnpm add oxlint eslint-plugin-oxlint -D
```

👇 `eslint.config.js` 使用 `oxlint`提供的屏蔽规则（`eslint-plugin-oxlint`的本质就是一系列oxliner支持的检测规则不在eslint阶段执行，一份关闭eslint检测规则的配置）

```js
// eslint.config.js
import antfu from '@antfu/eslint-config'
import oxlint from 'eslint-plugin-oxlint'

export default antfu(
  {},
  oxlint.configs['flat/recommended'], // oxlint should be the last one
)
```

运行eslint 之前先运行 oxlint

```json
{
  "scripts": {
    "lint": "oxlint --fix && eslint --fix"
  }
}
```

## Biome（Rust版 eslint+prettier）

## Zeroscript
