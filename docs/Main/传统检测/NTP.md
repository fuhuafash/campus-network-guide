---
title: NTP 服务检测
---

# NTP 服务检测

在校园网多设备检测中，**NTP 流量特征检测**通过分析客户端 NTP 对时请求中的时间戳、轮询间隔、服务器域名等特征，判断同一公网 IP 后是否存在多台设备。

## ❓ 什么是 NTP

NTP（Network Time Protocol，网络时间协议）是用于在网络中同步计算机时钟的协议，工作在 UDP 端口 123 上。NTP 客户端会定期向时间服务器发送请求，以校准本地时钟。不同操作系统默认使用的 NTP 服务器不同：

| 系统 | 典型 NTP 服务器 |
| --- | :---: |
| Windows 10/11 | time.windows.com |
| macOS / iOS | time.apple.com |
| Android | pool.ntp.org / time.android.com |
| Linux | 发行版默认配置 |

::: warning
部分设备可能使用 DHCP 下发的 NTP 服务器（DHCP Option 42），而非系统默认服务器。
:::

## 🔬 NTP服务检测判断规则

| 场景 | 表现 | 判定 |
| --- | :---: | ---: |
| 单设备直连 | 单一时间戳序列，固定轮询间隔，固定 NTP 服务器 | ✔️ 正常 |
| 多设备经路由器 | 同一公网 IP 下时间戳交错、多序列、NTP 服务器域名不同 | 🚨 多设备 |