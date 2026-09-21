---
title: UA3F
---

# UA3F

> UA3F（Advanced HTTP(S) Rewriting Proxy）是一个高级 HTTP(S) 流量重写代理，可在 HTTP、SOCKS5、TPROXY、REDIRECT 与 NFQUEUE 模式下透明重写请求 / 响应 Header 与 Body，也可按规则执行 URL 重定向、拒绝或丢弃请求。除 HTTP 重写外，UA3F 还支持 L3 网络层特征重写（TTL、IPID、TCP Timestamp 等）与 Desync 混淆注入，常用于干扰 DPI 设备的流重组行为。

## 主要作用

- 固定TTL
- 统一UA
- 删除TCP时间戳
- TCP初始窗口重设
- IPID重设0

## 适用检测范围

- `任何简单检测`
- `有DPI，需要在代理后处理其他特征`

## 安装

[GitHub Releases](https://github.com/SunBK201/UA3F/releases) 下载对应平台构建版

从OpenWrt的包管理页面上传UA3F并安装

::: tip 无法获取软件包
如果无法正常更新软件包，请检查DNS设置
:::

## 快速运行


### 服务模式推荐选择

| 模式 | 工作方式 | 典型用途 |
| --- | --- | --- |
| SOCKS5 | SOCKS5 代理 | 与 Clash 代理链路配合 |
| TPROXY | netfilter TPROXY | Linux/OpenWrt 透明代理，保留原始目标地址 |

### 1.不需要代理

👉 通用设置 - 服务模式 - 选择`TPROXY`

👉 通用设置 - 重写策略 - 选择全局重写

👉 通用设置 - User-Agent - 填写电脑浏览器的UA

::: tip 快速获取UA
http://ua-check.stagoh.com
:::

👉 L3重写 - 开启固定 TTL -（如是自己构建可填TTL为128）

👉 L3重写 - 开启L3 重写 eBPF 卸载

👉 酌情开启 删除 TCP 时间戳 、固定 TCP 初始接收窗口

### 2.配合代理（抗DPI）

👉 安装[shellcrash](https://github.com/juewuy/ShellCrash/blob/dev/README_CN.md)

👉 配置shellcrash

| 由于shellcrash脚本优先级大于配置文件需要注意 |
| --- |
| 路由模式设置: `Tproxy模式` |
| 过滤CN_IP列表: `OFF` |
| 启用域名嗅探: `ON` |

#### 懒人配置文件

| 导入配置文件前先在指定位置填入节点订阅 |
| --- |
| 👉 如果UA3F选择`TPROXY` | |
| 👉 如果UA3F选择`SOCKS5` | |

完整文档与配置示例请参阅 [UA3F 官方文档](https://ua3f.sunbk201.site/)。