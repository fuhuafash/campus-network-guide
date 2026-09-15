---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "防多设备检测指南"
  text: "一份简单的指南"
  tagline: 帮助绕过校园网对于NAT的检测
  actions:
    - theme: brand
      text: 关于项目
      link: /introduce/about
    - theme: alt
      text: 快速开始
      link: /getting-started

features:
  - title: 检测原理
    details: 梳理校园网常见的多设备识别方式，如 TTL、DHCP 指纹、UA、MAC 等
  - title: DPI应对
    details: 整理深度包检测的常见识别流量，加密混淆等应对思路与风险
  - title: 详细配置
    details: 给出 OpenWrt 等路由器的具体设置步骤与注意事项
  - title: 自检与排错
    details: TTL、DHCP 指纹、UA、MAC 等问题的排查
---

