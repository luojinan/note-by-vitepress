// import Inspect from 'vite-plugin-inspect'
import UnoCSS from 'unocss/vite'
import presetUno from '@unocss/preset-uno'
import { VitepressIndexPage } from '../vitepress-index-page'
import { getNavData } from './lib/nav'
import { getSidebarData } from './lib/sidebar'

export const withEasyTheme = (config) => {
  // 初始化一些中文配置
  config.lang = 'zh'
  config.outlineTitle = '文章目录' // 目录顶部文字(默认: in this page)

  // nav: [{ text: "笔记", link: "/articles/01-笔记/" }]
  config.themeConfig.nav = getNavData({ enableDirActiveMatch: true })
  // sidebar: { // 侧边导航
  //   '/': [
  //     {
  //       text: ' 介绍',
  //       items: [{ text: '介绍', link: '/'}],
  //     },
  //   ],
  // },
  config.themeConfig.sidebar = getSidebarData()
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