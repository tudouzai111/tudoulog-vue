# src/articles/ Knowledge Base

## OVERVIEW
Markdown article source files. `vite-plugin-vue-markdown` transforms these into Vue components at build time.

## STRUCTURE
```
articles/
├── flutter.md
├── hello.md
├── music-study.md
├── oklch.md
├── ruanjian-list.md
├── springboot-config.md
├── suan-fa.md
└── win11bug.md
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
coverImage: '/src/assets/img/coverImage.png'
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
