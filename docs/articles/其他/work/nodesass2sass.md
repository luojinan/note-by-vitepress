[或许能帮你解开 node-sass 的所有疑问？](https://www.jianshu.com/p/e461e3e765f0)

- Dart Sass 对应的依赖包 sass 新
- Node Sass 对应的依赖包 node-sass 旧 

node-sass 包难安装，是因为还要从 GitHub 中下载对应平台(系统)的 binding.node 文件

👇 因此将 Sass Binary Site 指定为国内镜像源使其也在国内镜像源中下载，才能彻底解决网络不稳定导致安装失败的问题

`sass-binary-site=https://npmmirror.com/mirrors/node-sass`


- node-sass 基于 LibSass 构建，后者使用 C++ 开发

在 Node 中调用其他语言编写的模块，需要用 node-gyp 生成平台相关的项目文件，然后调用 gcc、vsbuild、xcode 等编译平台来进行编译。

因此需要用到 node-gyp，在较新版本的 Node.js 中会自带 node-gyp，因此大部分情况下无需额外安装。

👇 因为 node-gyp 不需要额外安装，所以只做了解
- node-gyp 是 GYP 的 Node 实现，是用来编译 C++ 模块的跨平台工具。而 GYP 是基于 Python 开发，所以需要安装 Python。
- node-gyp 除了需要安装 Python 之外，在不同平台还要安装其他一些东西，比如 macOS 的 Xcode、Windows 的 VC++ 编译器等
- 在 node-gyp 构建项目文件的过程中，需要指定 Python 路径，在未配置的情况下，默认从环境变量 PATH 查找名为 python2 的可执行文件，找不到就会报错。通常做法是用 npm config set python /path/to/your/python 去指定，特别是本机有多个 Python 版本。

👇 镜像源问题只能解决下载慢的问题，如果 node-sass 还安装失败，原因无非就几个：
- 未安装平台相关的编译器。比如 macOS 的 Xcode 等。
- 当前 node-sass 与 Node 版本不兼容，这个版本对应关系可以在 node-sass 官网中查看；(约定好项目node环境避免)
- 当前 node-sass 所依赖的 node-gyp 不支持你本机安装的 Python 版本，可根据实际情况降低/升级 Python 解决。


Dart Sass 提供了纯 JavaScript 的 npm 包 sass（以前叫做 dart-sass），它的安装可比 node-sass 省心多了 😪。从 Node Sass 迁移到 Dart Sass 也非常简单，只要把 package.json 中的 node-sass 依赖改为 sass 即可，两者提供的 JavaScript API 是相同的。

## 安装 node-sass 常见错误与解决方法

### install post钩子 慢或者失败

👇 node-sass 的 package.json
```json
{
  "scripts": {
    "install": "node scripts/install.js",
    "postinstall": "node scripts/build.js"
  }
}
```
1. 下载对应平台的 binding.node 文件；
2. 下载完成，执行 node-gyp rebuild 命令进行构建。

👇 在指定 URL 中下载 binding.node 文件，而 URL 则通过 getBinaryUrl() 方法获取：
```js
function getBinaryUrl() {
  var site = getArgument('--sass-binary-site') ||
             process.env.SASS_BINARY_SITE  ||
             process.env.npm_config_sass_binary_site ||
             (pkg.nodeSassConfig && pkg.nodeSassConfig.binarySite) ||
             'https://github.com/sass/node-sass/releases/download';

  return [site, 'v' + pkg.version, getBinaryName()].join('/');
}
```
👆 从代码可知，下载地址的优先级是：
- 命令行参数 --sass-binary-site
- 环境变量 SASS_BINARY_SITE
- .npmrc 配置 sass_binary_site
- package.json 中的 nodeSass.binarySite 字段
- 若以上都没有指定，则从 Github 中下载，比如：https://github.com/sass/node-sass/releases/download/v8.0.0/darwin-x64-83_binding.node。

因此，仅仅指定国内镜像源还不够，还要指定 Sass Binary Site，方式有以上四种。

一般对项目管理，方便的配置是 .npmrc

```
$ npm config set sass_binary_site https://npmmirror.com/mirrors/node-sass
$ yarn config set sass_binary_site https://npmmirror.com/mirrors/node-sass
```

binding.node 文件就会从 https://npmmirror.com/mirrors/node-sass/v8.0.0/darwin-x64-83_binding.node 下载，就不会龟速那么慢了。

> 如果是使用命令行，可以在 --sass-binary-site 参数指定，比如：npm install node-sass --sass-binary-site=https://npmmirror.com/mirrors/node-sass。
> 可以设置 SASS_BINARY_SITE 环境变量，有两种方式：
> - 全局环境变量（持久化），比如 echo 'export SASS_BINARY_SITE=https://npmmirror.com/mirrors/node-sass' >> ~/.zshrc。
> - 临时环境变量，每次安装的时候指定。比如 SASS_BINARY_SITE=https://npmmirror.com/mirrors/node-sass npm install。

### node-gyp 异常

node-gyp 在不同系统需要不同的环境支持

Linux/Unix 平台：

> Python 3.x
> make
>  A proper C/C++ compiler toolchain, like GCC

macOS 平台：

> Python 3.x
> XCode Command Line Tools

一般也不缺这些环境

```bash
# 安装 XCode Command Line Tools
$ xcode-select --install

# 安装 Python 3
$ brew install python
```

如果安装了多个 Python 版本，可在 npm 或 yarn 的配置文件中指定

👇 以 macOS 为例
```bash
# 获取 Python 路径
$ which python3
/usr/local/bin/python3

# 配置 npm 或 yarn 的 python 路径
$ npm config set python /usr/local/bin/python3
$ yarn config set python /usr/local/bin/python3
```

现在系统一般默认环境是 Python 3

低版本 node-gyp 可能仅支持 Python 2.x， 此时可能要安装 Python 2 并指定环境...

Windows 平台：

> Python
> VC++ 编译器

Microsoft Store 下载安装 Python

👇 以管理员身份打开 cmd 或 PowerShell 安装 VC++ 编译器（更多请看 Environment setup and configuration）
```bash
$ npm install --global --production windows-build-tools
```

https://www.wujingquan.com/posts/a6b811ab.html

[Dart Sass](https://sass-lang.com/dart-sass/)

暂时可以通过 npmrc 设置代理下载路径，解决(🤔 所以实际上是网络问题而不是python问题？)
```
side-effects-cache=false

strict-peer-dependencies=false

auto-install-peers=false

xprofiler_binary_host_mirror=https://npmmirror.com/mirrors/xprofiler
sentrycli_cdnurl=https://npmmirror.com/mirrors/sentry-cli/
ELECTRON_MIRROR=https://npmmirror.com/mirrors/electron/
chromedriver_cdnurl=https://npmmirror.com/mirrors/chromedriver
puppeteer_download_host=https://npmmirror.com/mirrors
PUPPETEER_DOWNLOAD_HOST=https://npmmirror.com/mirrors
disturl=https://npmmirror.com/dist
chromedriver-cdnurl=https://npmmirror.com/mirrors/chromedriver
couchbase-binary-host-mirror=https://npmmirror.com/mirrors/couchbase/v{version}
debug-binary-host-mirror=https://npmmirror.com/mirrors/node-inspector
electron-mirror=https://npmmirror.com/mirrors/electron/
flow-bin-binary-host-mirror=https://npmmirror.com/mirrors/flow/v
fse-binary-host-mirror=https://npmmirror.com/mirrors/fsevents
fuse-bindings-binary-host-mirror=https://npmmirror.com/mirrors/fuse-bindings/v{version}
git4win-mirror=https://npmmirror.com/mirrors/git-for-windows
gl-binary-host-mirror=https://npmmirror.com/mirrors/gl/v{version}
grpc-node-binary-host-mirror=https://npmmirror.com/mirrors
hackrf-binary-host-mirror=https://npmmirror.com/mirrors/hackrf/v{version}
leveldown-binary-host-mirror=https://npmmirror.com/mirrors/leveldown/v{version}
leveldown-hyper-binary-host-mirror=https://npmmirror.com/mirrors/leveldown-hyper/v{version}
mknod-binary-host-mirror=https://npmmirror.com/mirrors/mknod/v{version}
node-sqlite3-binary-host-mirror=https://npmmirror.com/mirrors
node-tk5-binary-host-mirror=https://npmmirror.com/mirrors/node-tk5/v{version}
nodegit-binary-host-mirror=https://npmmirror.com/mirrors/nodegit/v{version}/
operadriver-cdnurl=https://npmmirror.com/mirrors/operadriver
phantomjs-cdnurl=https://npmmirror.com/mirrors/phantomjs
profiler-binary-host-mirror=https://npmmirror.com/mirrors/node-inspector/
puppeteer-download-host=https://npmmirror.com/mirrors
python-mirror=https://npmmirror.com/mirrors/python
rabin-binary-host-mirror=https://npmmirror.com/mirrors/rabin/v{version}
sass-binary-site=https://npmmirror.com/mirrors/node-sass
sodium-prebuilt-binary-host-mirror=https://npmmirror.com/mirrors/sodium-prebuilt/v{version}
sqlite3-binary-site=https://npmmirror.com/mirrors/sqlite3
utf-8-validate-binary-host-mirror=https://npmmirror.com/mirrors/utf-8-validate/v{version}
utp-native-binary-host-mirror=https://npmmirror.com/mirrors/utp-native/v{version}
zmq-prebuilt-binary-host-mirror=https://npmmirror.com/mirrors/zmq-prebuilt/v{version}
```


## 迁移


@zz/zz-sasscode

![](https://kingan-md-img.oss-cn-guangzhou.aliyuncs.com/blog202310182039188.png)

这个提示只在首次安装后启动时提示

要开启 Sass 的警告提示
`.sassrc` 或 `.scssrc` 的配置文件（或者在 `package.json` 文件中的 `sass` 字段）来指定全局的 Sass 配置选项
在配置文件中，将 `warn` 设置为 `true` 即可开启警告提示。例如：
```json
{
 "warn": true
}
```

目前最新稳定版sass是 1.6

暂时不影响


👇 `@zz/sasscore/functions/rem.scss`
```scss
@function pxToRem($px) {
  @if unit($px) == '%' {
    @return $px;
  }
  @return $px / 75px * 1rem;
}

@function pxRem($px) {
  @return $px / 75 * 1rem;
}
```

👇 `@zz/sasscore/mixins/border.scss`
```scss
@mixin border($type: solid, $color: black, $radius: 0) {
  @include parentMixin();
  &:before {
      @include beforeMixin($type, $color, $radius);
      border: 1px $type $color;
  }
}

@mixin parentMixin() {
    border: none !important;
}

@mixin beforeMixin($type, $color, $radius) {
    content: '';
    position: absolute;
    width: 200%;
    height: 200%;
    top: 0;
    left: 0;
    transform: scale(0.5);
    transform-origin: 0 0;
    box-sizing: border-box;
    pointer-events: none;
    border-radius: pxRem($radius*2); // 👈 sass 2 will remove $px / 75 * 1rem
}
```


@zz/sasscore 版本从0 -> 1

👇 `@zz/sasscore/mixins/hairline.scss`
```scss
@mixin hairline($border-color: $divide-color) {
  content: ' ';
  position: absolute;
  pointer-events: none;
  box-sizing: border-box;

  top: -50%;
  left: -50%;
  right: -50%;
  bottom: -50%;
  transform: scale(0.5);
  border-color: $border-color;
  border-width: 0px;
  border-style: solid;
}

@mixin hairline-bottom($border-color: $divide-color, $left: 0, $right: 0) {
  content: ' ';
  position: absolute;
  pointer-events: none;
  box-sizing: border-box;
  left: $left;
  right: $right;
  bottom: 0;
  transform: scaleY(0.5);
  border-bottom: 1px solid $border-color;
}

@mixin hairline-top($border-color: $divide-color, $left: 0, $right: 0) {
  content: ' ';
  position: absolute;
  pointer-events: none;
  box-sizing: border-box;
  left: $left;
  right: $right;
  top: 0;
  transform: scaleY(0.5);
  border-top: 1px solid $border-color;
}

@mixin border-1px($border-color: $divide-color, $radius: 2px, $style: solid) {
  position: relative;

  &::after{
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    width: 200%;
    height: 200%;
    display: block;
    pointer-events: none;
    transform: scale(.5);
    transform-origin: 0 0;
    box-sizing: border-box;
    border: 1px $style $border-color;
    border-radius: $radius * 2;
  }
}
```

👇 `@zz-common/zz-ui/lib/style/hairline.scss`

```scss
@import '@zz/sasscore/mixins/hairline.scss';

[class*='z-hairline'] {
  position: relative;

  &::after {
    @include hairline();
  }
}

.z-hairline {
  &--top::after {
    border-top-width: 1px;
  }

  &--bottom::after {
    border-bottom-width: 1px;
  }

  &--left::after {
    border-left-width: 1px;
  }

  &--right::after {
    border-right-width: 1px;
  }

  &--left-right::after {
    border-width: 0 1px;
  }

  &--top-bottom::after {
    border-width: 1px 0;
  }

  &--surround::after {
    border-width: 1px;
  }
}
```

👇 `@include border` 对比 `@include border-1px()`
```scss
@mixin border($type: solid, $color: black, $radius: 0) {
  border: none !important;
  &:before {
    content: '';
    position: absolute;
    width: 200%;
    height: 200%;
    top: 0;
    left: 0;
    transform: scale(0.5);
    transform-origin: 0 0;
    box-sizing: border-box;
    pointer-events: none;
    border-radius: pxRem($radius*2); // 👈 sass 2 will remove $px / 75 * 1rem

    border: 1px $type $color;
  }
}

@mixin border-1px($border-color: $divide-color, $radius: 2px, $style: solid) {
  position: relative;

  &::after{
    content: '';
    position: absolute;
    width: 200%;
    height: 200%;
    left: 0;
    top: 0;
    display: block;
    pointer-events: none;
    transform: scale(.5);
    transform-origin: 0 0;
    box-sizing: border-box;
    border: 1px $style $border-color;
    border-radius: $radius * 2;
  }
}
```


替换成
```scss
@import '@zz/sasscore';
// 替换成👇
@import '@zz/sasscore';
@import '@zz-common/zz-ui/lib/style/mixins/hairline.scss';

@include border-bottom(solid, #f0f0f0);
// 替换成👇
&::after {
  @include hairline(#f0f0f0);
  border-bottom-width: 1px;
  // 你可以定义任何一条边的任意属性
  // border-bottom-style: solid;
  // border-bottom-color: #ccc;
}

@include border(solid, #777777, 8);
// 替换成👇
@include border-1px(#777777, 8px);
```