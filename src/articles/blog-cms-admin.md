---
title: '给纯静态博客接入免费网页编辑后台：Sveltia CMS + Cloudflare Workers 实战'
date: '2026-10-25'
tags: ['CloudFlare', 'GitHub', 'CMS', '教程']
excerpt: '不买服务器、不写后端代码，给纯静态博客接一个网页版内容后台：Sveltia CMS + GitHub OAuth + Cloudflare Worker 三件套，包含每个字段的填写说明和踩坑记录'
---

## 为什么折腾这个

我的博客是纯静态的，部署在 Cloudflare Pages 上，发文章的流程是：本地写 Markdown → git push → 自动构建。这套流程用了很久都挺舒服，但有一个场景一直不太方便——**不在电脑前的时候**，想随手发条动态或者改个错别字，就得掏出手机开终端。

市面上的方案无非两类：要么上一套带数据库的后端（要买服务器），要么用 headless CMS（大多要付费或者限制重重）。后来了解到 **Sveltia CMS + GitHub OAuth + Cloudflare Worker** 这个组合：零成本、零服务器，网页上写文章保存 = 自动 commit 到仓库 = 自动部署，效果和有后台一模一样。

## 核心思路：其实根本没有后端

先纠正一个直觉：这套系统里**没有传统意义的后端**。工作流程是这样的：

```
你在 /admin 网页上点"保存"
   ↓
Sveltia CMS（纯前端网页）拿着你的 GitHub 令牌，直接调用 GitHub API
   ↓
GitHub 收到一个 commit（和你自己 git push 一模一样）
   ↓
Cloudflare Pages 看到新 commit → 自动构建 → 一分钟后博客更新
```

拆开看每个角色：

- **内容数据库** = 你的 GitHub 仓库
- **构建器 + CDN** = Cloudflare Pages
- **CMS** = 一个漂亮的 git 客户端（Sveltia CMS 是个纯前端网页，没有服务端）
- **Worker** = 只干一件事：登录时把 GitHub 的临时授权码换成访问令牌，几 KB 的中间人

所以"网页能控制博客内容"的本质就是"它替你 commit"，令牌只存在你自己浏览器本地。

## 准备工作

- 博客仓库托管在 GitHub（我的 [tudoulog-vue](https://github.com/tudouzai111/tudoulog-vue)）
- Cloudflare Pages 上已经部署好博客
- 一个能访问 GitHub 和 workers.dev 的网络环境（这两个国内都需要代理，后面细说）

## 第一步：部署认证 Worker

打开 [sveltia-cms-auth](https://github.com/sveltia/sveltia-cms-auth) 仓库，README 里有 **Deploy to Cloudflare** 按钮，点它会进入 Cloudflare 的「设置您的应用程序」页面：

![Cloudflare Worker 部署配置](/img/cms-worker-deploy.png)

这个页面的字段怎么填（注意这是新版 Workers 流程的字段，跟老的 Pages 流程不一样）：

| 字段 | 填法 |
| ---- | ---- |
| Git 帐户 | 选你的 GitHub 账号 |
| 创建专用 Git 存储库 | 保持勾选，等于把认证服务复制一份私有仓库到你账号，以后上游更新可以同步 |
| 项目名称 | 默认 `sveltia-cms-auth` |
| **构建命令** | **留空**！这个 Worker 是现成的单文件脚本，不需要任何构建步骤 |
| 部署命令 | 默认 `pnpm run deploy` |
| 预览命令 | 默认 `npx wrangler preview` |
| 启用预览构建 | 开着没关系 |
| **使用 Cloudflare Access 保护** | **务必关闭**！开了会把 GitHub 的回调请求也拦在登录墙外面，认证流程直接断掉 |

部署完成后你就拿到了 Worker 的地址，形如 `https://sveltia-cms-auth.<你的子域>.workers.dev`，先记下来。

## 第二步：注册 GitHub OAuth 应用

GitHub → Settings → Developer settings → OAuth Apps → **Register a new application**：

![GitHub OAuth 应用注册](/img/cms-github-oauth-app.png)

新版表单的字段：

- **Application name**：随你，我填了 `tudoulog`
- **Homepage URL**：博客首页，比如 `https://tudoulog.pages.dev`
- **Application description**：可选
- **Redirect URIs**（关键）：填 `https://sveltia-cms-auth.<你的子域>.workers.dev/callback`，**结尾必须带 `/callback`**
- **Allow wildcard matching**：不勾
- **Enable Device Flow**：不勾
- **Expire user access tokens**：保持默认勾选就行

这里有个先后顺序问题：回调地址指向 Worker，但 Worker 没部署之前你根本不知道地址是什么。所以顺序是**先部署 Worker、再注册 OAuth 应用**；或者注册时先随便填一个，GitHub 支持随时编辑回调地址，部署完再回来改。

注册完成后页面会显示 **Client ID**，再点 **Generate a new client secret** 生成 **Client Secret**，两个都存好，下一步要用。

## 第三步：给 Worker 配置密钥

回到 Cloudflare → Workers 和 Pages → `sveltia-cms-auth` → 设置 → 变量和机密，添加两条：

| 变量名 | 值 | 类型 |
| ------ | -- | ---- |
| `GITHUB_CLIENT_ID` | 上一步的 Client ID | 文本 |
| `GITHUB_CLIENT_SECRET` | 上一步的 Client Secret | 机密 |

## 第四步：博客仓库加入 CMS 配置

在你的博客仓库里加两个文件（完整配置见[我的仓库](https://github.com/tudouzai111/tudoulog-vue/tree/master/public/admin)）：

`public/admin/index.html`——CMS 的入口页面，就一行脚本加载 Sveltia：

```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>内容管理</title>
  </head>
  <body>
    <script src="https://unpkg.com/@sveltia/cms/dist/sveltia-cms.js"></script>
  </body>
</html>
```

`public/admin/config.yml`——核心配置，`backend` 部分把三样东西串起来：

```yaml
backend:
  name: github
  repo: 你的用户名/你的仓库名
  branch: master
  # 认证 Worker 地址（不带 /callback）
  base_url: https://sveltia-cms-auth.<你的子域>.workers.dev

site_url: https://你的博客地址
media_folder: public/img
public_path: /img

collections:
  # 文章集合：folder 指向 src/articles，字段和 frontmatter 一一对应
  - name: articles
    label: 文章
    folder: src/articles
    create: true
    fields:
      - { label: 标题, name: title, widget: string }
      - { label: 发布日期, name: date, widget: datetime }
      - { label: 标签, name: tags, widget: list, required: false }
      - { label: 摘要, name: excerpt, widget: text, required: false }
      - label: 封面图
        name: coverImage
        widget: image
        required: false
      - { label: 草稿（开启后不发布）, name: draft, widget: boolean, default: false, required: false }
      - { label: 正文, name: body, widget: markdown }
```

push 之后，访问 `https://你的博客地址/admin/` 就是内容后台了。

## 踩坑记录

### 坑一：workers.dev 在国内被墙

这是最大的一个坑。`*.workers.dev` 在国内被 DNS 污染——`nslookup` 查出来的全是假 IP（比如 `108.160.170.41`），直连必然失败。我一开始还以为是 Worker 没部署成功，排查了半天。

实际影响：**登录 CMS 时必须开代理**（登录跳转要经过 Worker）。彻底解决的办法是给 Worker 绑一个自己的自定义域名，不过我的博客本来就是 pages.dev 免费方案，就先挂代理用了。

### 坑二：配置顺序别搞反

前面提过：OAuth 应用的回调地址依赖 Worker 地址，所以要先部署 Worker。我一开始还纠结要不要把 Pages 项目转成 Workers 项目——完全不用，两者是并排的关系：Pages 管博客托管，Worker 是独立的认证小程序，互不干扰。

### 坑三：别给 Cloudflare 的构建产物加 404.html

这是个题外但很有价值的坑。我给博客做 SPA 回退时，把 `index.html` 复制了一份当 `404.html` 放进构建产物（这是 GitHub Pages 上让 `/article/xxx` 深链接生效的标准做法）。结果 Cloudflare Pages 检测到 `404.html` 之后，就走"文件找不到返回 404 状态码"的逻辑了——页面内容看着正常，但搜索引擎看到的全是 404，等于把文章从收录里踢出去了。

解决办法：`404.html` 只在 GitHub Pages 的部署工作流里生成（构建后 `cp dist/index.html dist/404.html`），Cloudflare 的构建不产出它，这样两边各得其所。

### 坑四：封面图预览"加载不出来"

在 CMS 里编辑文章时封面图预览加载很慢，一度以为是配置坏了。其实是预览图从线上站点拉取的，刚 push 的图片要等部署完成才能显示，耐心等一分钟就好。

## 验收

全部配置完的验收流程：

1. 开着代理，访问 `https://你的博客地址/admin/`
2. 点 **Log in with GitHub** → 跳转授权 → 回到 CMS
3. 网页上新建一篇文章或者发一条废话，保存
4. 去 GitHub 仓库看——多了一个自动 commit；一分钟后博客上就能看到了

到这里，"网页写博客"的闭环就通了：电脑前用本地编辑器 + git，手机上用 CMS 后台，两边殊途同归，都汇到同一个仓库里。
