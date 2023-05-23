# vitepress文档

[homepage -github.io](https://luojinan.github.io/notepage/)

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
- https://github.com.ipaddress.com
- http://ip.tool.chinaz.com - ✨ 可用
- https://whatismyipaddress.com//hostname-ip
- http://ip-api.com

填写到 `HOST` 文件中(`Live Host` Vscode插件)
```text
# Github
118.184.78.78                github.global.ssl.fastly.net
185.199.108.153               assets-cdn.github.com
20.205.243.166                github.com
```

## 部署到 github.io

```bash
sh deploy.sh
```

通过 链接 [[homepage -github.io](https://luojinan.github.io/notepage)](https://luojinan.github.io/notepage/) 访问验证是否部署成功

浏览器强刷新(不走浏览器缓存) `ctrl/command + shift + r` / `ctrl + f5`
