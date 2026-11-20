---
title: 域名特征检测
---

# 域名特征检测

**域名特征检测**属于网络出口 DPI（深度包检测）中常见的终端指纹识别维度。与仅能针对明文 HTTP 生效的 UA 检测不同，即使当前互联网流量已高度 HTTPS 化，网关探针依然可以通过**明文 DNS 查询**、**HTTP `Host` 字段**以及 **TLS 握手阶段的 SNI** 提取终端访问的域名，从而推断当前 IP 后方的操作系统类型。

## ❓ 什么是域名特征

现代操作系统（Windows、iOS/macOS、Android 及各手机厂商定制系统）在联网后，即使不打开浏览器，也会在后台自动向厂商专属的服务器发起网络请求。例如网络连通性检测（Captive Portal Detection）、系统更新、消息推送（Push）和时间同步（NTP）等。

由于这些系统级服务的域名与特定操作系统高度绑定，网关只需在出口处旁路监听以下三个位置的域名信息，即可勾勒出终端画像：

1. **明文 DNS 查询（UDP/TCP 53 端口）**：设备在建立网络连接前，默认会以明文向 DNS 服务器发起域名解析请求。
2. **TLS 握手的 SNI（Server Name Indication）**：HTTPS 流量在建立加密连接前的 `ClientHello` 握手包中，客户端默认会以明文携带目标域名，以便服务器返回对应的 SSL/TLS 证书。
3. **明文 HTTP 请求头中的 `Host` 字段**：部分系统级服务（尤其是网络连通性检测）为了能够触发校园网认证页的重定向跳转，默认采用明文 HTTP 协议发出请求。

::: info
设备连上网络的那一刻，哪怕你什么软件都没打开，系统后台也会自动“报家门”。  
例如：Windows 会去请求 `www.msftconnecttest.com` 确认能不能上网，iPhone 会去连 `captive.apple.com` 和 `*.push.apple.com` 维持系统通知推送，安卓设备则会访问各自厂商的连通性检测接口。
:::

### 📄 常见操作系统的典型特征域名

网关探针通常会维护一份终端特征域名库，重点关注具有强系统绑定属性的后台服务域名：

| 操作系统 / 厂商 | 典型服务类型 | 常见特征域名 |
| --- | --- | --- |
| **Windows** | 网络连通性检测（NCSI） | `www.msftconnecttest.com`、`ipv6.msftconnecttest.com` |
| **Windows** | 系统更新 / 推送 / 对时 | `*.windowsupdate.com`、`*.wns.windows.com`、`time.windows.com` |
| **Apple (iOS / iPadOS / macOS)** | 门户连通性检测（Captive Portal） | `captive.apple.com` |
| **Apple (iOS / iPadOS / macOS)** | 消息推送（APNs）/ 系统更新 / 对时 | `*.push.apple.com`、`mesu.apple.com`、`time.apple.com` |
| **原生 Android (AOSP)** | 网络连通性检测 | `connectivitycheck.gstatic.com`、`connectivitycheck.android.com` |
| **小米（MIUI / HyperOS）** | 网络连通性检测 | `connect.rom.miui.com` |
| **华为（EMUI / HarmonyOS）** | 网络连通性检测 | `connectivitycheck.platform.hicloud.com` |
| **vivo** | 网络连通性检测 | `wifi.vivo.com.cn` |

::: details 为什么用了 HTTPS 加密，网关依然能看到我访问的域名？

HTTPS（TLS）加密保护的是**握手完成后的应用层数据内容**（如网页正文、HTTP Header 中的 User-Agent 等），但在握手建立之初，通常存在两处明文暴露点：

1. **传统 DNS 默认明文传输**：除非显式配置了 **DoH（DNS over HTTPS）** 或 **DoT（DNS over TLS）**，否则发往 53 端口的域名解析记录对沿途网关完全透明。
2. **TLS SNI 字段默认明文**：由于现代服务器普遍采用单 IP 托管多域名（虚拟主机/CDN），客户端必须在 TLS `ClientHello` 阶段明文告知服务端自己要访问哪个域名（即 SNI）。

**关于 ECH（Encrypted Client Hello）**：IETF 已于 2026 年 3 月正式发布 **RFC 9849** 标准，通过将真实的 `ClientHello` 加密封装在外层公共握手包中来隐藏 SNI。但 ECH 需要客户端、服务端以及 DNS 的 HTTPS/SVCB 记录三方共同支持，目前操作系统底层的各类后台服务远未全面普及，因此 SNI 依然是网关探针提取域名特征的有效来源。

### 参考资料

- **IETF**: [RFC 9849: TLS Encrypted Client Hello](https://www.rfc-editor.org/info/rfc9849/)
- **Apple Support**: [Use Apple products on enterprise networks](https://support.apple.com/en-us/101555)
- **Microsoft Learn**: [Connection endpoints for Windows](https://learn.microsoft.com/en-us/windows-365/link/connection-endpoints)

:::

## 🔬 域名特征检测判断规则

校园网网关通过在出口处持续采集同一公网 IP 对应的 DNS 查询记录、HTTP `Host` 及 TLS `SNI`，并与内置的操作系统域名特征库进行比对。

### 1. 正常直连（未挂载路由器）

单台设备直接接入校园网时，系统后台高频触发的连通性检测、推送心跳与更新域名归属于同一操作系统生态。

| 设备类型 | 捕获的高频特征域名 | 校园网网关判定 |
| --- | --- | --- |
| Windows 电脑 | `www.msftconnecttest.com`、`*.windowsupdate.com`、`time.windows.com` | ✔️ 唯一设备（Windows） |
| iPhone | `captive.apple.com`、`*.push.apple.com`、`mesu.apple.com` | ✔️ 唯一设备（Apple） |
| 小米手机 | `connect.rom.miui.com` | ✔️ 唯一设备（Android / 小米） |

### 2. 挂载路由器（经过路由 NAT 转发）

当多台不同系统的终端通过路由器 NAT 共享同一个 IP 上网时，网关会在极短的时间窗口内，观测到来自多个互斥操作系统生态的系统级域名请求：

| 下挂设备组合 | 同一 IP 下捕获的混合特征域名 | 校园网网关判定 |
| --- | --- | --- |
| Windows 电脑 + iPhone | 同时出现 `www.msftconnecttest.com` 与 `captive.apple.com` / `*.push.apple.com` | ⚠️ 存在多系统特征，配合其他探针持续跟踪 |
| Windows 电脑 + 华为/小米手机 | 同时出现 `*.windowsupdate.com` 与 `connect.rom.miui.com` / `connectivitycheck.platform.hicloud.com` | ⚠️ 存在多系统特征，配合其他探针持续跟踪 |