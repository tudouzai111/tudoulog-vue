# src/articles/ Knowledge Base

## OVERVIEW
Markdown article source files. `vite-plugin-vue-markdown` transforms these into Vue components at build time.

## STRUCTURE
```
articles/
├── blog-markdown-system.md  # 博客Markdown系统设计
├── clash.md                 # Clash配置教程
├── cloudflare.md            # CloudFlare部署HTML
├── flutter.md               # Flutter学习笔记
├── hello.md                 # 第一篇博客（入门介绍）
├── music-study.md           # 乐理学习笔记
├── oklch.md                 # OKLCH色彩空间
├── opencode-web.md          # OpenCode Web配置
├── opencode-windows-install.md  # OpenCode Windows安装
├── ruanjian-list.md         # 软件推荐列表
├── springboot-config.md     # SpringBoot配置
├── suan-fa.md               # 算法笔记
├── tag-component-theme.md   # 标签组件主题
├── toc-component.md         # 目录组件实现
├── vue-transitions.md       # Vue过渡动画
└── win11bug.md              # Win11 Bug记录
```

## WHERE TO LOOK
| Task | Location |
|------|----------|
| Add new article | Create `article-slug.md` here |
| Article discovery | `src/utils/articleList.ts` (auto-globbed) |
| Markdown config | `vite.config.ts` (Shiki theme, link renderer) |

## REQUIRED FRONTMATTER
```markdown
---
title: '文章标题'
date: '2026-02-22'
tags: ['Vue', 'Markdown', '博客']
excerpt: '文章摘要'
coverImage: 'coverImage.webp'  # filename only — code prepends baseUrl + 'img/cover/'
---
```

## CONVENTIONS
- Filename = article ID (e.g., `hello.md` → id `hello`)
- Date format: `YYYY-MM-DD`
- Tags: string array
- Articles sorted by date descending (newest first)

## ANTI-PATTERNS
- Do NOT omit frontmatter (title, date required)
- Do NOT use spaces or special characters in filenames
- Do NOT place non-article markdown here
- Article content is CC BY-NC 4.0 licensed (see LICENSE-CC-BY-NC.md)
