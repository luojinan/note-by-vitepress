# CDN 服务

如果我们做一些个人网站，想要节省些个人流量或者加速资源加载，可以考虑用大厂的 CDN 服务

如：加载vue的运行时资源

[通过 CDN 使用 Vue](https://cn.vuejs.org/guide/quick-start.html#using-vue-from-cdn)

## npm 产物 CDN 服务

### npmmirror(原cnpm)

[npmmirror 镜像站已内置支持类似 unpkg cdn 解析能力](https://zhuanlan.zhihu.com/p/633904268)

[npmmirror 官网](https://npmmirror.com/)，搜索后点 `产物预览` 找自己需要的产物

👇 vue 提供的全面的npm产物
![](https://kingan-md-img.oss-cn-guangzhou.aliyuncs.com/blog/20240311121712669.png?x-oss-process=image/format,webp/resize,w_640)

```bash
# 获取目录信息 /${pkg}/${versionOrTag}/files?meta
https://registry.npmmirror.com/antd/5.5.2/files?meta

# 获取文件内容 /${pkg}/${versionOrTag}/files/${path}
https://registry.npmmirror.com/antd/5.5.0/files/lib/index.js

# 获取文件元信息 /${pkg}/${versionOrTag}/files/${path}?meta
https://registry.npmmirror.com/antd/5.5.0/files/lib/index.js?meta

# 获取入口文件内容 /${pkg}/${versionOrTag}/files
https://registry.npmmirror.com/antd/latest/files

# 支持 Semver Range
https://registry.npmmirror.com/antd/^5/files/lib/index.js
```

### jsdelivr

国内可以访问的外国 CDN 服务

## github 文件服务

虽然 github提供了源文件获取功能的，但是速度不行

此时可以考虑 [Github RAW 加速服务](https://gitmirror.com/raw.html)

把原github域名替换 `raw.githubusercontent.com` -> `raw.gitmirror.com`

`https://域名/人/仓库名/分支名master/文件路径.xx`

另外除了github官方提供源文件读取

esmsh 也提供了读取github源文件的功能并且走了自己的cdn（github的应该也有cdn缓存处理吧）

[jsdelivr](https://www.jsdelivr.com/?query=author%3A%20vuejs&docs=gh) 也提供了github文件功能

## 让npm产物支持esm的 CDN 服务

传统 npm 产物 CDN 服务的缺点是完全依赖产物提供方，本地构建产物使用node_modules没什么要注意的，但是大部分运行时产物都是提供umd

esmsh
