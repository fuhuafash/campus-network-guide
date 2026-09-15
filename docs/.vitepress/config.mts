import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: '/campus-network-guide/',
  title: "校园网防多设备检测指南",
  description: "一份详细的指南帮助你的绕过校园网的多设备检测",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '主页', link: '/' },
      { text: '快速开始', link: '/getting-started' }
    ],

    sidebar: [
        {
          text: '简介',
          items: [
            { text: '关于项目', link: '/introduce/about.md' },
            { text: '快速开始', link: '/getting-started' }
          ]
        },
        {
          text: '传统检测',
          collapsed: false,
          items: [
            { text: 'MAC', link: '/traditional/MAC' },
            { text: 'TTL', link: '/traditional/TTL' },
            { text: 'HTTP User-Agent', link: '/traditional/UA' },
            { text: 'DHCP 指纹', link: '/traditional/DHCP' }
          ]
        },
        {
          text: '另类检测',
          collapsed: false,
          items: [
            { text: 'TCP 连接数', link: '/others/TCP' }
          ]
        },
        {
          text: '防检测方案',
          collapsed: false,
          items: [
            { text: 'UA3F', link: '/solution/UA3F.md' }
          ]
        }
      ]
    ,

    socialLinks: [
      { icon: 'github', link: 'https://github.com/fuhuafash/campus-network-guide' }
    ]
  }
})
