---
title: HTTP User-Agent 检测机制与原理
---

# 🪪 HTTP User-Agent (UA) 检测原理

**HTTP User-Agent（UA）检测**属于应用层的终端指纹识别，受限于 TLS/HTTPS 协议的端到端加密机制，网关探针仅能抓取并解析明文 HTTP 流量中的 UA 报文。

## ❓ 什么是 User-Agent

User-Agent 是 HTTP/HTTPS 请求头（Header）中的一个字符串字段。它的主要作用是**向目标服务器标识当前发起请求的客户端类型、操作系统、浏览器版本及内核信息**。

::: info 
客户端（浏览器、App、系统服务）在发起 HTTP 请求时，会在包头带上User-Agent，以表明身份  
例如：“我是运行在 Windows 11 上的 Chrome 浏览器”或“运行在 iOS 26 上的Safari浏览器”  
:::

### 📄 常见操作系统的典型 UA 关键字

网关探针通常不需要解析完整的字符串，只需提取其中的**操作系统核心关键字**：

| 操作系统类型 | 典型 UA 关键特征 | 实际请求示例片段 |
| :--- | :--- | :--- |
| **Windows 10/11** | `Windows NT 10.0; Win64` | `Mozilla/5.0 (Windows NT 10.0; Win64; x64)...` |
| **Android** | `Android <版本号>` | `Mozilla/5.0 (Linux; Android 16; Pixel 9 Pro)...` |
| **iOS** | `iPhone OS + Version/<版本号>` | `Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X)...` |
| **macOS** | `Macintosh; Intel Mac OS X` | `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)...` |

::: details 为什么 iOS 26 和 macOS 26  UA 里的版本号对不上？

从 iOS 26（Safari 26.0）开始，Safari 的 UA 中 **`iPhone OS` 后面的系统版本号不再反映真实系统版本**，而是被固定为 **`18_6`**（即 iOS 26 发布前最后一个版本）。这不是解析错误，而是 **Apple 有意为之的“版本冻结”策略**，目的是削弱用户被动指纹追踪。

**第三方浏览器的差异**：Chrome 等基于 Chromium 的浏览器和 Firefox 上的 UA **不受冻结影响**，仍会报告真实的系统版本。

macOS 上的 Safari 早在 2017 年就已将系统版本冻结在 `10_15_7`（macOS Catalina 的版本号），无论实际运行的是 macOS 15 Sequoia 还是 macOS 26 Tahoe，Safari 的 UA 中永远是 `Intel Mac OS X 10_15_7`。

### 参考文章

- **Apple Developer**: [Safari 26 Release Notes](https://developer.apple.com/documentation/safari-release-notes/safari-26-release-notes)

:::

## 🔬 校园网检测 UA 的原理

校园网网关通过在出口处对 **明文 HTTP 流量** 进行实时抓包，读取数据包头部的 `User-Agent` 字段。

### 1. 正常直连（未挂载路由器）

当单台设备直接连接校园网时，无论发起多少明文 HTTP 请求，网关收集到的 UA 操作系统特征保持高度一致。

| 设备类型 | 请求流量类型 | 抓取的明文 HTTP UA  | 校园网网关判定 |
| :--- | :--- | :--- | :--- |
| **Windows 电脑** | 明文 HTTP | `Windows NT 10.0` | 唯一设备（Windows） |
| **Android 手机** | 明文 HTTP | `Android 16` | 唯一设备（Android） |

### 2. 挂载路由器（经过路由 NAT 转发）

宿舍接入路由器后，多台不同系统的设备通过 NAT 转换共享同一个公网 IP 地址上网：

| 下挂设备组合 | 抓取的明文 HTTP UA | 校园网网关判定 |
| :--- | :--- | :--- |
| Windows 电脑 + iPhone | `Windows NT 10.0` 与 `iPhone OS` 混合出现 | ⚠️ **封禁或增加封禁概率** |