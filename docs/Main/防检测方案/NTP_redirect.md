---
title: NTP 服务劫持
---

# NTP 服务劫持

针对NTP服务的检测有以下方案

### 1. NTP 劫持与统一对时

在路由器层面统一接管局域网内的对时请求，让所有设备的 NTP 包都路由到同一台上游服务器，消除不同设备默认 NTP 服务器的指纹差异。

首先需要开启 NTP 服务器以及设定候选 NTP 服务器：

``` bash
👉 系统 - 系统 - 时间同步

✔️ 启用 NTP 客户端

✔️ 作为 NTP 服务器提供服务

👉 绑定 NTP 服务器： lan

❌ 使用 DHCP 通告的服务器
```

配置 iptables 规则劫持 NTP 请求：

```bash
iptables -t nat -N ntp_force_local
iptables -t nat -I PREROUTING -p udp --dport 123 -j ntp_force_local
iptables -t nat -A ntp_force_local -j DNAT --to-destination 192.168.1.1
iptables -t nat -A ntp_force_local -j MASQUERADE
```

其中`192.168.1.1`为OpenWrt网关地址，需要按实际情况填写。

配置 nftables 规则劫持 NTP 请求：

```bash
uci add firewall redirect
uci set firewall.@redirect[-1].name='Intercept-NTP-REDIRECT'
uci set firewall.@redirect[-1].src='lan'
uci set firewall.@redirect[-1].proto='udp'
uci set firewall.@redirect[-1].src_dport='123'
uci set firewall.@redirect[-1].target='DNAT'
uci set firewall.@redirect[-1].family='any'
uci commit firewall
service firewall restart
```


### 2. 加密代理转发

将 NTP服务 通过加密隧道转发至外部节点，使校园网出口处无法观察到 NTP 流量特征。

详见项目配置文件