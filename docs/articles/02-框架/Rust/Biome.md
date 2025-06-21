# Biome

## 使用

1. 本地项目安装biome、本地项目配置biome.json，运行nodejs脚本检测 format 效果，如引号、分号、css
2. 编辑器安装插件、配置项目`编辑器/settings.json`、在文件中加减缩进(zed必须修改文件才触发)检测效果

[zed formatting and linting](https://zed.dev/docs/configuring-languages#formatting-and-linting)

## 原理

学Biome源码，之前还是要会babel的源码吧...

babel源码学习也就是用内部的AST转化树来实现，难道要手写AST树生成

[深入 Biome — 现代 Rust 前端工具链](https://mp.weixin.qq.com/s/bk6G8zD6MPgVUm02RzpeqQ)

- 在 Linter 方面，目前 Biome 内置支持了约 [320 条以上规则]( https://next.biomejs.dev/linter/)支持，几乎完整覆盖了 ESLint 以及社区 Lint 规则集中的大部分 Lint 规则
- 在 Formatter 上面，Biome 提供了 [97% 以上的 Prettier](https://next.biomejs.dev/blog/biome-wins-prettier-challenge/) 的能力对齐，这其中包括对于 JS 、TS 以及 JSX 等支持

Biome 官方也提供了非常方便的 [playground](https://next.biomejs.dev/playground/) 去进行体验:

前端生态常见的工具链：

- eslint 使用了 [babel 的 parser](https://babeljs.io/docs/babel-parser)
- webpack 则使用 [acorn 提供的 parser](https://github.com/acornjs/acorn)

已有的 Rust 生态的 parser：
- prettier 开始使用 [Add oxc parser #17472](https://github.com/prettier/prettier/pull/17472)
- Vue 团队推出的 Rolldown 使用了 [oxc-parser](https://playground.oxc.rs/)，对于 estree 有完美的兼容，[性能也很棒](https://github.com/oxc-project/bench-javascript-parser-written-in-rust)
- 主流的 Rust 工具链基本都会采用 [SWC 去做 Parser](https://play.swc.rs/)，Bundler 例如 Rspack、Farm 等，deno 同样也使用了 SWC, 主要原因在于 SWC 对于 babel 有很强的兼容

[swc playground](https://play.swc.rs/)

那么 Biome 也开发了自己的 Rust Parser，它的 Parser 相比其他的 Parser 有什么区别呢？


![](https://kingan-md-img.oss-cn-guangzhou.aliyuncs.com/blog/20250609194901575.png?x-oss-process=image/format,webp/resize,w_640)
能正常 Parse 出对应的 AST 结构来，但对于一些有语法错误的代码则不会输出 AST 结构

![](https://kingan-md-img.oss-cn-guangzhou.aliyuncs.com/blog/20250609194910950.png?x-oss-process=image/format,webp/resize,w_640)
Biome 的 Parser 不管源代码语句是合法还是非法都会输出一份 AST 出来，同时在生成 AST 之前, Biome 会生成 Green Tree 和 Red Tree 的结构。

展开介绍 Green Tree 和 Red Tree 之前，我们先介绍下 Biome 的 Parser 代码结构，目前 Biome 的 Parser 逻辑主要在仓库路径 [crates/biome_parser](https://github.com/biomejs/biome/tree/main/crates/biome_parser)

这个 Rust crate 是其他所有 parser 的基础，例如 biome_{js/json/css/html/graphql}_parser都是基于它实现，同时 Lexing(词法分析)处理也是在 biome_parser 这个 crates 中实现。

以上面的 biome_js_parser(Biome 中对于 JavaScript 以及 TypeScript 的 Parser 处理都在里面) 为例，Biome 会先把 source code 处理成一个绿树和红树的数据结构。

其中绿树是一个颗数据结构不可变(Immutable)的树，包含所有的语法类型以及文本长度，绿树上有源代码的所有信息，大致的数据结构形式如下:

![](https://kingan-md-img.oss-cn-guangzhou.aliyuncs.com/blog/20250609195153422.png?x-oss-process=image/format,webp/resize,w_640)

如图是 const a = 1;代码的绿树构造，以上为绿树节点的数据结构构造，这里使用了 Rust Analyzer 的一份简单数据结构，表达的意思应该差不多:

```rust
#[derive(PartialEq, Eq, Clone)]
struct Node {
    kind: SyntaxKind,                        // 节点类型标签
    text_len: usize,                         // 文本长度
    children: Vec<Arc<Either<Node, Token>>>, // 子节点（内部节点或Token）
}

#[derive(PartialEq, Eq, Clone)]
struct Token {
    kind: SyntaxKind,  // Token类型
    text: String,      // 实际文本内容
}
```
