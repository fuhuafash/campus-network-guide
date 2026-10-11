// .vitepress/config.mts
import { defineConfig } from "vitepress";
import { defineTeekConfig } from "vitepress-theme-teek/config";

// Teek 主题配置
const teekConfig = defineTeekConfig({
  teekHome: false,
  vitePlugins: {
    sidebarOption: {
      initItems: false,
    },
  },
});

// https://vitepress.dev/reference/site-config
export default defineConfig({
  extends: teekConfig,
  base: '/campus-network-guide/',
  title: "校园网防多设备检测指南",
  description: "一份详细的指南帮助你的绕过校园网的多设备检测",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '主页', link: '/' },
      { text: '快速开始', link: 'Main/getting-started' }
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/fuhuafash/campus-network-guide' }
    ]
  }
})
