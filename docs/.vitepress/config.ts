import { defineConfig } from 'vitepress'
import { withPwa } from '@vite-pwa/vitepress'
import { withEasyTheme } from './plugins/vitepress-easy-theme'

export default withPwa(withEasyTheme(defineConfig({
  base: "/notepage/",
  title: "罗锦安的blog",
  description: "vue、js、nodejs等等的学习记录",
  ignoreDeadLinks: true,
  themeConfig: {
    socialLinks: [
      {
        icon: "github",
        link: 'https://github.com/luojinan'
      }
    ],
    algolia: {
      appId: 'JI6H0D3OC3',
      apiKey: '8177b26e8ae81f186c520f237c3e27ed',
      indexName: 'notepage_vitepress'
    },
    // 表示显示h2-h6的标题
    outline: 'deep',
  },
  pwa:{},
})))