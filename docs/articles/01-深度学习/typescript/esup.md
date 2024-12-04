esno ts-node 都是在node环境中直接运行ts文件的工具

而 bun 自身内置支持直接运行ts，因此也会有人拿bun和esno、ts-node做对比，但是需要注意它们的运行环境不一样

而 tsup 是对标构建工具的库，如webpack、rollup（之所以不把esbuild也纳入对标的构建工具中是因为esbuild已经作为很多构建工具的基础库，而tsup恰恰是基于 esbuild的）

但是好像也可以在rollup或者webpack中集成tsup？那tsup到底用来对标什么
