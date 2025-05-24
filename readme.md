# vitepress文档

test

[homepage -github.io](https://luojinan.github.io/note-by-vitepress/)

## 本地运行

```bash
pnpm i
pnpm dev
```

## 新增文章

约定式路由

`doc/articles/` 目录下新增 `markdown`

## 代码提交

```bash
# 拉取合并远程仓库代码
git pull origin master

# . 代表提交所有本地修改文件
git add .

# 添加提交说明
git commit -m ""

# 把提交推到远程仓库
git push origin master
```

[终端访问不到 github](https://github.com/mingjiezhou/notes/issues/13)

dns 解析问题，手动指定可用的 ip

先找到 git 命令行操作涉及到的几个相关域名：

- github.com
- github.global.ssl.fastly.net
- assets-cdn.github.com
- ...

然后可以到下面几个 ip 查询的网站(任选一个就行)，查找其对应的 ip 地址：

- <https://github.com.ipaddress.com>
- <http://ip.tool.chinaz.com> - ✨ 可用
- <https://whatismyipaddress.com//hostname-ip>
- <http://ip-api.com>

填写到 `HOST` 文件中(`Live Host` Vscode插件)

```txt
# Github
118.184.78.78                github.global.ssl.fastly.net
185.199.108.153               assets-cdn.github.com
20.205.243.166                github.com
```

## 部署到 github.io

```bash
sh deploy.sh
```

通过 链接 [[homepage -github.io](https://luojinan.github.io/note-by-vitepress)](<https://luojinan.github.io/note-by-vitepress/>) 访问验证是否部署成功

浏览器强刷新(不走浏览器缓存) `ctrl/command + shift + r` / `ctrl + f5`

## 图床

使用 阿里云OSS

macbook 在github 下载最新安装包

拖拽安装PicGO后，打开可能会提示`文件损坏`

实际上安装包并没有损坏，是 macbook 的来源校验问题

![](https://kingan-md-img.oss-cn-guangzhou.aliyuncs.com/blog202310101947133.png)

```
sudo spctl --master-disable
xattr -cr /Applications/PicGo.app
```

👆 运行后正常使用，配置图床key信息即可
