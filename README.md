> 博客Cloudflare地址：https://tudoulog.pages.dev/

# tudoulog

一个用 Vue 3 + Vite 构建的 Markdown 博客系统。文章放进 `src/articles/` 就会自动发现并生成动态路由，无需手动注册；支持代码高亮（亮暗双主题）、标签分类、搜索、深色模式和 RSS 订阅。

## 主要功能

- ✨ Vue 3 + TypeScript
- 📝 Markdown 文章支持（构建期自动提取元数据）
- 🌗 浅色 / 深色 / 跟随系统 三态色彩模式
- 🌈 Shiki 双主题代码高亮 + 代码复制按钮
- 🏷️ 文章标签管理与筛选
- 🔍 标题/摘要搜索、分页、文章目录导航
- 🧭 上一篇/下一篇导航、阅读时长估算、图片点击放大
- 📮 RSS 订阅（rss.xml）、sitemap.xml、robots.txt 自动生成
- 🎨 响应式设计，支持 prefers-reduced-motion

## 截图

![首页](public/img/readme_1.png)
![文章](public/img/readme_2.png)
![文章详情](public/img/readme_3.png)

## 技术栈

- Vue 3.5 + Vue Router 5
- Vite 7 + TypeScript 5.9
- vite-plugin-vue-markdown（Markdown 转 Vue 组件）
- Shiki（代码高亮，双主题）
- github-markdown-css（文章排版）

## 快速开始

确保已安装 Node.js (>=20.19.0) 和 pnpm

```bash
# 安装依赖
pnpm install

# 启动开发服务
pnpm dev
```

启动后访问 http://localhost:5173

## 添加文章

在 `src/articles/` 目录下新建 `.md` 文件，**文件名即文章 ID**（如 `hello.md` → `/article/hello`），文件头部加上 frontmatter：

```markdown
---
title: '文章标题'
date: '2026-02-22'
tags: ['Vue', 'Markdown', '博客']
excerpt: '文章摘要'
coverImage: 'coverImage.png'
---
```

字段说明：

| 字段       | 必填 | 说明                                                       |
| ---------- | ---- | ---------------------------------------------------------- |
| `title`    | ✅   | 文章标题                                                   |
| `date`     | ✅   | 发布日期，格式 `YYYY-MM-DD`                                |
| `tags`     |      | 标签数组，用于分类筛选                                     |
| `excerpt`  |      | 摘要，列表和 RSS 展示                                      |
| `coverImage` |    | 封面图**文件名**（图片放在 `public/img/cover/` 下）        |
| `updated`  |      | 更新日期 `YYYY-MM-DD`，用于 sitemap 的 lastmod             |
| `draft`    |      | 设为 `true` 时文章不发布（不出现在列表，也不打进构建产物） |

文章内图片放到 `public/img/` 下，用根路径引用：`![说明](/img/xxx.png)`。

## 项目结构

```
├── build/              # 构建期插件（文章元数据提取、RSS/sitemap 生成）
├── public/             # 静态资源（图片、图标）
├── src/
│   ├── articles/       # Markdown 文章
│   ├── components/     # 组件
│   ├── composables/    # 组合式函数（色彩模式等）
│   ├── constants/      # 站点配置、主题常量
│   ├── data/           # 站点数据（废话列表等）
│   ├── router/         # 路由
│   ├── styles/         # 样式
│   ├── utils/          # 工具函数
│   └── views/          # 页面
```

## 联系我

QQ：1715593110<br/>
Email：1715593110@qq.com

## License

This project is **dual-licensed**:

- **All source code** (e.g., `.py`, `.js`, `.css`, `.html` files) is licensed under the **MIT License** – see the `LICENSE` file for details.
- **All blog post content** (Markdown files under `src/articles/`) is licensed under the **Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)** – see `LICENSE-CC-BY-NC.md` for details.

In short: You can freely use, modify, and distribute the **code** for any purpose (including commercial). For the **written articles**, you may share and adapt them only for **non-commercial purposes**, and you must give appropriate credit to the original author.
