<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:4F46E5,50:06B6D4,100:10B981&height=200&section=header&text=Campus%20Network%20Guide&fontSize=44&fontColor=ffffff&fontAlignY=38&desc=%E6%A0%A1%E5%9B%AD%E7%BD%91%E9%98%B2%E5%A4%9A%E8%AE%BE%E5%A4%87%E6%A3%80%E6%B5%8B%E6%8C%87%E5%8D%97&descAlignY=58&descSize=18" width="100%" alt="校园网防多设备检测指南" />

**校园网共享限制的原理与应对配置**

[![在线阅读](https://img.shields.io/badge/%E5%9C%A8%E7%BA%BF%E9%98%85%E8%AF%BB-GitHub%20Pages-06B6D4?style=for-the-badge&logo=github)](https://fuhuafash.github.io/campus-network-guide/)
[![Stars](https://img.shields.io/github/stars/fuhuafash/campus-network-guide?style=for-the-badge&logo=github&color=F59E0B&label=Stars)](https://github.com/fuhuafash/campus-network-guide/stargazers)
[![最近提交](https://img.shields.io/github/last-commit/fuhuafash/campus-network-guide?style=for-the-badge&logo=git&color=10B981&label=%E6%9C%80%E8%BF%91%E6%8F%90%E4%BA%A4)](https://github.com/fuhuafash/campus-network-guide/commits/main)
[![许可证](https://img.shields.io/github/license/fuhuafash/campus-network-guide?style=for-the-badge&color=4F46E5&label=%E8%AE%B8%E5%8F%AF%E8%AF%81)](LICENSE)

[![VitePress](https://img.shields.io/badge/VitePress-1.6-5C73E7?style=flat-square&logo=vite&logoColor=white)](https://vitepress.dev)
[![Teek](https://img.shields.io/badge/Teek-1.6-06B6D4?style=flat-square)](https://github.com/Kele-Bingtang/vitepress-theme-teek)
[![Node](https://img.shields.io/badge/Node.js-24-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org)
[![OpenWrt](https://img.shields.io/badge/OpenWrt-24.10-00B5E2?style=flat-square&logo=openwrt&logoColor=white)](https://openwrt.org)

</div>

## ⭐ 特点

目前较少教程整理关于如何应对DPI，虽然深度包检测耗费性能，但是如果各位的高校上了DPI，本指南提供了方向

其次是一些另类的，如NTP服务域名特征的检测

### 📦 现成规则集

针对微信 UID 检测，仓库根目录有两份 ShellCrash 能直接导入的配置：

| UA3F 工作模式 | 配置文件 |
| :--- | :--- |
| TPROXY | [Campusinternet-TPROXY.yaml](Campusinternet-TPROXY.yaml) |
| SOCKS5 | [Campusinternet-SOCKS5.yaml](Campusinternet-SOCKS5.yaml) |

对于不使用UA3F的代理配置，可使用 [Campusinternet-TPROXY.yaml](Campusinternet-TPROXY.yaml)

两份配置文件均未配置过于复杂的国外分流规则，目的是保持对小内存设备友好


## 📂 目录结构

```text
docs/
├── index.md                    首页
├── Main/
│   ├── getting-started.md
│   ├── about.md
│   ├── 传统检测/                TTL / UA / DHCP / MAC / NTP
│   ├── 深度包检测/              DPI
│   ├── 另类检测/
│   └── 防检测方案/
├── public/mascot_pack/         Neuro基米，构建时生成
└── .vitepress/
    ├── config.mts              站点配置
    └── theme/                  主题入口与 Layout.vue
scripts/copy-mascot.mjs
Campusinternet-TPROXY.yaml
Campusinternet-SOCKS5.yaml
.github/workflows/deploy.yml
```
## 🤝 参与贡献

如有不足，欢迎提交issues


## 免责
> [!WARNING]
> 本文档仅供网络技术学习、学术研究及合法个人使用参考，请遵守所在学校与 ISP 的《网络服务使用协议》及相关法律法规。作者与贡献者不对使用本文档导致的任何直接或间接后果承担责任。

---

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:10B981,50:06B6D4,100:4F46E5&height=120&section=footer" width="100%" alt="footer" />

<sub>基于 <a href="LICENSE">GPL-3.0</a> 发布 · Neuro基米来自 <a href="https://github.com/CommentOut64/web-mascot">web-mascot</a>（CC-BY-NC-SA-4.0）</sub>

</div>
