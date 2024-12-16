import { defineConfig } from 'vitepress'
import { withPwa } from '@vite-pwa/vitepress'
import { withEasyTheme } from './plugins/vitepress-easy-theme'

export default withPwa(withEasyTheme(defineConfig({
  base: "/",
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
    search: {
      provider: 'local'
    },
    // 表示显示h2-h6的标题
    outline: 'deep',
  },
  pwa:{},
})))