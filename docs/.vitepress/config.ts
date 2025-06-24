import { defineConfig } from "vitepress";
import { withPwa } from "@vite-pwa/vitepress";
import { withEasyTheme } from "./plugins/vitepress-easy-theme";

export default withPwa(
  withEasyTheme(
    defineConfig({
      base: "/",
      title: "an blog",
      description: "vue、js、nodejs等等的学习记录",
      ignoreDeadLinks: true,
      themeConfig: {
        socialLinks: [
          {
            icon: "github",
            link: "https://github.com/luojinan",
          },
        ],
        search: {
          provider: "local",
        },
        // 表示显示h2-h6的标题
        outline: "deep",
      },
      pwa: {
        registerType: "autoUpdate",
        workbox: {
          globPatterns: ["**/*.{css,js,html,svg,png,ico,txt,woff2}"],
          runtimeCaching: [
            {
              urlPattern:
                /^https:\/\/kingan-md-img\.oss-cn-guangzhou\.aliyuncs\.com\/blog\/.*/i,
              handler: "CacheFirst",
              options: {
                cacheName: "oss-img-cache",
                expiration: {
                  maxEntries: 32,
                  maxAgeSeconds: 60 * 60 * 24 * 365, // <== 365 days
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
          ],
        },
      },
    }),
  ),
);
