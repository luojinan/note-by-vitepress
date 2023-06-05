npm@6 版本引入了 `npm-init <initializer>` 语法，等价于 `npx create-<initializer>` 命令，而 `npx` 命令会去 `$PATH` 路径和 `node_modules/.bin` 路径下寻找名叫 `create-<initializer>` 的可执行文件，如果找到了就执行，找不到就去安装。

也就是说，`npm init egg` 会去寻找或下载 `create-egg` 可执行文件，而 `create-egg` 包就是 `egg-init` 包的别名，相当于调用了 `egg-init` 

```bash
npm init vue@next
```

在习惯里，npm的脚手架依赖库工具都是通过全局安装依赖后，使用该库的指令进行搭建

如👇 vue-cli脚手架
```bash
npm i -g @vue/cli
vue create hello-world
```

而`npm init`则是给项目路径初始化出`package.json`文件，初始化项目目录的指令

为什么`npm init vue@next` 就可以安装脚手架依赖并运行脚手架搭建指令呢？

注意这里的`npm init xx` 不是安装依赖的指令`npm i xx` = `npm install xx`

npm init 用法：
```bash
npm init [--force|-f|--yes|-y|--scope]
npm init <@scope> (same as `npx <@scope>/create`)
npm init [<@scope>/]<name> (same as `npx [<@scope>/]create-<name>`)
```

- `npm init xxx` -> `npx create-xxx`
- `npm init @xxx` -> `npx @xxx/create`
- `npm init @xxx/foo` -> `npx @xxx/create-foo`

👆 @xx为命名空间，相当于一个依赖库的集合名称，而这些参数都会按照一定规则补充`create`名称

再来看这行指令`npm init vue@next`，需要注意到是依赖名后加`@xx`不是命名空间，而是指定版本
所以忽视安装依赖的版本则简化为 `npm init vue`
转化为`npx create-vue`

而[npx指令](http://nodejs.cn/learn/the-npx-nodejs-package-runner)，不仅能直接运行`node_modules`中的库，还能不把依赖安装到本地来运行指令(估计是安装到了本地缓存，运行完自动清除那种)
如下官方示例
```bash
npx cowsay "你好"
```
运行结果为
```
 _______
< 你好 >
 -------
        \   ^__^
         \  (oo)\_______
            (__)\       )\/\
                ||----w |
                ||     ||
```
这是`npx`安装`cowsay`的库并运行后的结果

到这里我们知道了`npm init vue@next`
就是本地执行`npx create-vue`
本地安装`create-vue`的脚手架库(不安装到本地而是安装到缓存并运行完清除),并运行的运行搭建指令

> 另外，npx的这个不安装到本地的特性其实也可以用到vue-cli的脚手架框架
> 
> 即 `npx @vue/cli create demoName`
> 
> 所以到这里并不能体现新的脚手架有多值得替换`npx create-vue`



### 🤔 为什么有不同的命令来初始化项目

2个指令可以看出区别是 `init/create`
我们运行
```bash
npm create --help
```
👇 得到
```bash
Usage:
npm init <package-spec> (same as `npx <package-spec>)
npm init <@scope> (same as `npx <@scope>/create`)

Options:
[-y|--yes] [-f|--force] [--scope <@scope>]
[-w|--workspace <workspace-name> [-w|--workspace <workspace-name> ...]]
[-ws|--workspaces] [--no-workspaces-update] [--include-workspace-root]

aliases: create, innit

Run "npm help init" for more info
```
👆 看出 `create` 是 `init` 的别名，并且指引详情文档也是打开 `init`

因此 这里运行 `npm init vue@latest` === `npm create vue@latest`

---

👇 [npm init 官方文档](https://docs.npmjs.com/cli/v8/commands/npm-init)
```bash
npm init foo -> npm exec create-foo
npm init @usr/foo -> npm exec @usr/create-foo
npm init @usr -> npm exec @usr/create
npm init @usr@2.0.0 -> npm exec @usr/create@2.0.0
npm init @usr/foo@2.0.0 -> npm exec @usr/create-foo@2.0.0
```

因此 `npm init vue@latest` 等同于👇
```bash
npx create-vue@latest
```