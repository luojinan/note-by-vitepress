
## 安装 brew
安装
[Homebrew 国内安装工具](https://brew.idayer.com/guide/start)

安装 `command tool for xcode 14`

`brew help` 成功

执行安装 `brew install fnm` 报错

[解决brew错误 - unknown or unsupported macOS version: :dunno (MacOSVersionError)](https://blog.csdn.net/weixin_43526371/article/details/121988285)
```bash
brew update-reset
```

## 安装 fnm

根据官方文档安装

```zsh
fnm -V

fnm install 18

fnm ls
```

## 卸载 n

查看 全局指令的安装位置
```bash
command -v n
# /Users/luojinan/Library/pnpm/n
```

[uninstall n](https://github.com/tj/n/issues/169#issuecomment-422667613)

```bash
cd /Users/luojinan/Library/pnpm

pnpm rm n -g
```

[[pnpm v7] crashes "add --global" with "ERROR  Unable to find the global bin directory"](https://github.com/pnpm/pnpm/issues/4658)


## 切换 node

`fnm use xx` 报错：`fnm env setup`

[README github](https://github.com/Schniz/fnm#shell-setup)

👇 打开`.zshrc`文件
```zsh
code ~/.zshrc
```

👇 最下面添加一行
```zsh
eval "$(fnm env --use-on-cd)"
```