---
title: Campusinternet-TPROXY 配置说明
---

# Campusinternet-TPROXY.yaml 配置说明

该配置文件适用于 **ShellClash（Mihomo / Clash.Meta 内核）** 的 **TPROXY 透明代理**模式，专为校园网多设备防检测环境设计。它通过在路由器层面对敏感流量进行**加密代理、域名嗅探、DNS 加密与特征隔离**，避免校园网出口探针捕获到多终端混合特征，同时兼顾国内直连、游戏低延迟与海外 AI 服务分流。

::: info 快速开始
使用前，请务必在 `proxy-providers` -> `Global-ISP` 的 `url` 字段中填入你的机场订阅链接，否则所有代理策略组将无法拉取节点。
:::

## 配置文件详情

### 1. 加密 DNS 阻断明文 DNS 泄露

**全链路加密解析**：`default-nameserver`、`proxy-server-nameserver`、`direct-nameserver` 与 `nameserver` 全部采用 **DoH（DNS over HTTPS）** 或 **DoT（DNS over TLS）**，网关无法直接窥探域名解析记录。

### 2. 代理微信与 QQ 流量

校园网 DPI 设备（如深信服、锐捷等）经常通过分析 **微信 / QQ 的心跳包、登录报文及应用特征** 来统计同一 IP 下活跃的账号数量与终端系统类型，从而判定是否存在路由器共享上网。

配置中通过 `WeChat` 规则集以及 `weixin.qq.com.cn`、关键字 `wx`、`qq`，将相关流量导向海外代理节点，使校园网出口只能看到加密的代理隧道流量，无法提取其中的应用层终端特征。

### 3. 代理操作系统特征域名

不同品牌的手机和电脑在联网后会自动访问各自的连通性检测（Captive Portal）域名。配置将这些强系统绑定域名统一纳入 `特征域名` 策略组走代理转发，防止网关在同一 IP 下同时捕获到多个互斥生态的请求：

| 终端生态 / 厂商 | 被代理的特征域名 |
| --- | --- |
| **Apple (iOS / macOS)** | `captive.apple.com` |
| **原生 Android / Google** | `connectivitycheck.gstatic.com`、`clients3.google.com`、`www.gstatic.com` |
| **小米（MIUI / HyperOS）** | `connect.rom.miui.com` |
| **华为 / 荣耀** | `connectivitycheck.platform.hicloud.com`、`connectivitycheck.platform.hihonorcloud.com` |
| **vivo / OPPO** | `wifi.vivo.com.cn`、`conn1.oppomobile.com`、`conn2.oppomobile.com` |
| **三星 / 高通** | `connectivity.samsung.com.cn`、`www.qualcomm.cn`、`www.qualcomm.com` |

### 4. 可选：NTP 对时流量代理

配置中预留了一条被注释的规则：

```yaml
# NTP服务
# - AND,((NETWORK,UDP),(DST-PORT,123)),Switch
```

部分校园网会通过不同系统的默认 NTP 服务器（如 `time.apple.com`、`time.windows.com`）或时钟偏移特征辅助检测多终端。如果你的校园网存在 NTP 检测，取消该行注释即可将 UDP 123 端口的对时流量转入代理。

## 🧭 策略组说明

| 策略组名称 | 类型 | 作用说明 |
| --- | --- | --- |
| **Switch** | `select` | 主切换组，默认用于未匹配的兜底 TCP 流量（可选自动故障转移、手动节点或直连） |
| **Fallback** | `fallback` | 自动故障转移组，按 `香港 → 新加坡 → 日本 → 美国` 顺序自动选择可用地区 |
| **Global-ISP** | `select` | 展开订阅中的所有原始节点，供手动精确选择 |
| **CN** | `select` | 国内直连组（`DIRECT`） |
| **WeChat&QQ** | `select` | 校园网防检测专用：代理微信与 QQ 流量 |
| **特征域名** | `select` | 校园网防检测专用：代理各操作系统连通性探测域名 |
| **Apple Intelligence** | `select` | 代理苹果智能与 iCloud Private Relay 相关域名（已排除香港节点） |
| **AI** | `select` | 代理海外 AI 服务（基于 `category-ai-!cn.mrs`，已排除香港节点） |
| **HongKong / Singapore / Japan / USA** | `url-test` | 各地区自动测速组，通过正则自动过滤掉包含 `Premium` 字样的高倍率节点 |

## 📋 分流规则说明

1. **局域网与基础直连**：放行局域网 IP（`GEOIP,LAN,DIRECT,no-resolve`），并将 `bing.com` 与 `SteamCN` 导向 `CN` 直连，保障国内下载速度。
2. **游戏与反作弊直连**：将《三角洲行动》（Delta Force）、腾讯反作弊（ACE / `anticheatexpert.com`）、GCloud 联机框架及 WeGame 相关域名强制 `DIRECT`，避免游戏高延迟或触发异地风控。
3. **反监控与安全上报拦截（`REJECT`）**：屏蔽小米安全/反诈引擎（`*.sec.miui.com`、`*.engine.miui.com`）、信通院（`eps.caict.ac.cn`）及部分第三方遥测域名。
4. **防检测代理规则**：依次匹配 `WeChat&QQ` 与 `特征域名`。
5. **AI 与苹果生态分流**：将 Apple Intelligence 相关域名及 `AI` 规则集导向非香港地区节点。
6. **国内流量直连**：通过 `China` 域名规则集与 `GEOIP,CN` 将大陆流量分流至 `CN`。
7. **未匹配流量兜底**：
   * `NETWORK,udp,DIRECT`：未命中上述规则的 UDP 流量（如联机游戏、P2P、视频通话）直接直连，降低代理服务器负载。
   * `MATCH,Switch`：其余未识别的 TCP 流量统一走 `Switch` 代理。