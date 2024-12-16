# 域名 + cloudflare

## cloudflare + github page

前情提要：`github page cusome domain` 配置和 `cloudflare cname` 配置都不支持 `pathname`

所以无法实现直接吧 `yourname.github.io/任意仓库` -> `yourdomain.com/任务仓库`

而是要把 `yourname.github.io/reponame1`（`reponame1`只会是仓库名） -> `reponame1.yourdomain.com`（`reponame1可任意填写，设置到对应repo即可`）

👇 因此步骤为：

- cloudflare: `xx.mydomain.com` -> `yourname.github.io`
- github page: `xx.mydomain.com`

> 在给 github page use custom domain 时遇到了不能设置pathname的问题(🙅 `mydomain.com/reponame1`)，所以如果有多个仓库需要使用自定义域名则必须使用子域名，如 `reponame1.mydomain.com`
>
> 并且由于自定义二级域名不再携带pathname，而是直接访问`reponame1.mydomain.com`，此时由于前端打包处理了静态资源路径为 `base: '/reponame/`，当`reponame1.mydomain.com`访问成功，其发起资源请求url会是`reponame1.mydomain.com/reponame/xxx.js`而导致读取不到资源（对应 `yourname.github.io/reponame/reponame/xxx.js` is 404😵）
>
> 因为github page 映射的资源目录为 `domain/reponame/*` -> `domain/*`

解决办法是 前端打包工具不要写死base，而是`base: './'`，完全由静态资源所处的目录决定访问路径，此时既能在`/reponame/*`访问，也能在`/*`访问

> 🤔 不确定由 github page 自定义域名后是否可以解决网速问题，因为是经过cloudflare来访问github page的可能会好点？可以等github page访问受限的时候对比githubpage 和 自定义域名访问的情况

意味着后续新增项目的步骤是：

1. location create frontend project，setting 打包工具的 `base:'./'` 不要写死目录名
2. new github repo 后常规配置好 github repo setting 里的page相关，选择分支或者github action产物，并通过 `yourname.github.io/new_reponame` 访问
3. 到 cloudflare dns setting add record 选择 type 为 cname，二级域名为 `new_reponame`，target 为 `yourname.github.io`
4. 到 github repo setting -> page -> custom domain 填写cloudflare新增的record二级域名，通过 `new_reponame.yourdomain.com` 访问
5. 注意确保：`yourname.github.io/new_reponame` 和 `new_reponame.yourdomain.com` 都可以访问

## cloudflare + 云服务器

<!-- 诉求：我们希望一个前端项目同时可以在 自己的服务器 和 github page 上运行 -->

github page限制项目必须在代码仓库名的目录下，如: `yourname.github.io/reponame`

因此前端项目打包必须处理好静态资源的路径读取，如: `vite.config.js` 设置 `base: '/reponame/'`

为了适应github page，自己的服务器部署前端资源时，在nginx存放也要严格按照github page的 reponame 存放，如: 部署目录为 `/usr/share/nginx/html/reponame/`
