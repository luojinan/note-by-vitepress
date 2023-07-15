// import Inspect from 'vite-plugin-inspect'
import UnoCSS from 'unocss/vite'
import presetUno from '@unocss/preset-uno'
import { VitepressIndexPage } from '../vitepress-index-page'
import { getNavData } from './lib/nav'
import { getSidebarData } from './lib/sidebar'

const chinessConfig = {
  lang: 'zh',
  outlineTitle: '文章目录' // 目录顶部文字(默认: in this page)
}

const navSidebar = {
  // nav: [{ text: "笔记", link: "/articles/01-笔记/" }]
  nav: getNavData({ enableDirActiveMatch: true }),
  // sidebar: { // 侧边导航
  //   '/': [
  //     {
  //       text: ' 介绍',
  //       items: [{ text: '介绍', link: '/'}],
  //     },
  //   ],
  // },
  sidebar: getSidebarData()
}

export const withEasyTheme = (config) => {
  // 初始化一些中文配置
  Object.assign(config, chinessConfig)
  // 根据目录自动生成 nav、sidebar 目录配置
  Object.assign(config.themeConfig, navSidebar)
  // rewrite + Dynamic Routes 用于解决 rollup file-base router 没有实体文件不打包的问题，使1个文件作为多个路由页面
  const rewrites = navSidebar.nav.reduce((res, item)=>{
    res[`${item.link.slice(1)}test.md`] = '[test].md'
    return res
  },{})
  Object.assign(config, rewrites)

  config.vite = { // 合并而不是覆盖
    plugins:[
      // Inspect(), // 调试用 不应该放插件里
      UnoCSS({
        presets: [
          presetUno(),
        ]
      }),
      VitepressIndexPage()
    ]
  }
  return config
}