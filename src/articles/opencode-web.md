---
title: '配置OpenCodeWeb通过内网穿透实现远程控制OpenCode'
date: '2026-07-07'
tags: ['AI工具', 'OpenCode', '教程', '内网穿透']
excerpt: '配置OpenCodeWeb和内网穿透，实现其他设备远程控制本地OpenCode'
coverImage: 'opencode-web.png'
---

# 配置内网穿透
## 下载 Sakura Frp
先注册账号：https://www.natfrp.com/  
然后下载软件并登录账号：https://www.natfrp.com/tunnel/download
## 配置 Sakura Frp
**新建隧道**  
节点随便选择一个通用节点，类型选择 TCP，隧道名随意，本地端口填 4096，然后创建完并开启  
到日志页面看公网链接：

![opencode-web_1.png](/img/opencode-web_1.png)

# 启动 opencode web
终端输入
```bash
$env:OPENCODE_SERVER_PASSWORD = "密码"
opencode web --hostname 0.0.0.0 --port 4096
```
但是这个密码只是临时设置的，如果要长期使用这个密码而不是每次都设置临时密码，可以直接在系统环境变量里直接设置

![opencode-web_2.png](/img/opencode-web_2.png)

设置完后重开 PowerShell 并启动 opencode web，没有提示`! OPENCODE_SERVER_PASSWORD is not set`密码就是设置成功了

![opencode-web_3.png](/img/opencode-web_3.png)

# 访问 opencode web

现在就是配置完了，可以尝试访问 Sakura Frp 中的外网链接，同时前缀加上`https://` ，例如：`https://frp-use.com:12345/` 此时浏览器会有网站证书危险提示直接无视继续访问即可，因为内网穿透没有域名和网站证书如果只是自己使用无视即可。  

![opencode-web_5.png](/img/opencode-web_5.png)

然后进入opencode web界面后提示输入用户名和密码，用户名：`opencode` ，密码就是刚刚自己在环境变量里设置的

![opencode-web_4.png](/img/opencode-web_4.png)

登录后就可以在其他的设备来控制本地电脑的 opencode 了

![opencode-web.png](/img/cover/opencode-web.png)
