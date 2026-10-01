// .vitepress/config.mts
import { defineConfig } from "vitepress";
import { defineTeekConfig } from "vitepress-theme-teek/config";

// Teek 主题配置
const teekConfig = defineTeekConfig({
  teekHome: false,
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

    sidebar: [
        {
          text: '简介',
          items: [
            { text: '关于项目', link: 'Main/about' },
            { text: '快速开始', link: 'Main/getting-started' }
          ]
        },
        {
          text: '传统检测',
          collapsed: false,
          items: [
            { text: 'MAC', link: '/传统检测/MAC' },
            { text: 'TTL', link: '/传统检测/TTL' },
            { text: 'HTTP User-Agent', link: '/传统检测/UA' },
            { text: 'DHCP 指纹', link: '/传统检测/DHCP' }
          ]
        },
        {
          text: '另类检测',
          collapsed: false,
          items: [
            { text: 'TCP 连接数', link: '/另类检测/TCP_connects' },
            { text: 'TCP SYN 指纹', link: '/另类检测/TCP_syn' }
          ]
        },
        {
          text: '防检测方案',
          collapsed: false,
          items: [
            { text: 'UA3F', link: '/防检测方案/UA3F' }
          ]
        }
      ]
    ,

    socialLinks: [
      { icon: 'github', link: 'https://github.com/fuhuafash/campus-network-guide' }
    ]
  }
})
