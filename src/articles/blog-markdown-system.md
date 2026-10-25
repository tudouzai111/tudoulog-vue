---
title: Vite + Vue 3 搭建 Markdown 博客文章系统：从配置到动态路由
date: 2026-06-01
tags:
  - Vue
  - 前端
  - 教程
excerpt: 拆解如何用 Vite 7 + Vue 3.5 + TypeScript 搭建一套 Markdown 博客系统，重点讲 vite-plugin-vue-markdown 的配置、动态路由设计以及文章列表的自动发现
coverImage: ''
updated: ''
draft: false
ai: true
---

## 1. 引言

现在很多开发者选择用静态博客来记录技术积累。Markdown 写文章很顺手，但要把它集成到 Vue 3 项目里变成可访问的页面，中间有一层转换工作要做。这篇文章从零开始，拆解如何用 Vite 7 + Vue 3.5 + TypeScript 搭一套 Markdown 博客系统，重点讲 `vite-plugin-vue-markdown` 的配置、动态路由设计，以及文章列表的自动发现。

项目的完整代码可以在 Gitee 上找到：[tudoulog-vue](https://gitee.com/tudouza1/tudoulog-vue)。

## 2. 安装与配置 vite-plugin-vue-markdown

核心思路是用 `vite-plugin-vue-markdown` 这个插件，在构建时把 `.md` 文件转成 Vue 组件。这样我们就能像引用 `.vue` 文件一样引用 Markdown 文章。

安装依赖（以下版本是项目当前使用的）：

```plain
pnpm add vite-plugin-vue-markdown markdown-it-shiki shiki
```

`markdown-it-shiki` 负责用 Shiki 做代码高亮，`shiki` 是底层的语法高亮引擎。

然后配置 `vite.config.ts`：

```ts
import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import Markdown from 'vite-plugin-vue-markdown'
import Shiki from 'markdown-it-shiki'

export default defineConfig({
  base: '/',
  plugins: [
    vue({
      include: [/\.vue$/, /\.md$/],
    }),
    vueDevTools(),
    Markdown({
      markdownItOptions: {
        html: true,
        linkify: true,
        typographer: true,
      },
      markdownItUses: [
        [Shiki, { theme: 'one-dark-pro' }],
        (md: any) => {
          const defaultRender =
            md.renderer.rules.link_open ||
            ((tokens: any, idx: any, options: any, env: any, self: any) => {
              return self.renderToken(tokens, idx, options)
            })

          md.renderer.rules.link_open = (
            tokens: any, idx: any, options: any, env: any, self: any,
          ) => {
            const hrefIndex = tokens[idx].attrIndex('href')
            if (hrefIndex >= 0) {
              const href = tokens[idx].attrs[hrefIndex][1]
              if (/^https?:\/\//.test(href)) {
                tokens[idx].attrSet('target', '_blank')
                tokens[idx].attrSet('rel', 'noopener noreferrer')
              }
            }
            return defaultRender(tokens, idx, options, env, self)
          }
        },
      ],
      frontmatter: true,
      exportFrontmatter: true,
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'vue-router'],
        },
      },
    },
  },
})
```

几个关键点：

- `vue({ include: [/\.vue$/, /\.md$/] })`：让 Vue 插件同时处理 `.md` 文件，这是让 Markdown 能当 Vue 组件用的前提。
- `Shiki` 搭配 `one-dark-pro` 主题：代码高亮效果和 VS Code 的 One Dark Pro 一致，看起来舒服。
- 自定义链接渲染器：判断链接是否以 `http://` 或 `https://` 开头，是的话自动加 `target="_blank"` 和 `rel="noopener noreferrer"`，实现外部链接新标签打开。这个纯 markdown-it 语法就能做，不需要额外库。
- `frontmatter: true` + `exportFrontmatter: true`：读取 Markdown 文件的头部元数据（标题、日期、标签等），并导出成变量供组件使用。
- `manualChunks: { vendor: ['vue', 'vue-router'] }`：把 Vue 和 Vue Router 单独打包成 vendor chunk，利用浏览器缓存节省带宽。

## 3. 编写 Markdown 文章

在 `src/articles/` 下新建 `.md` 文件，文件头部用 `---` 包裹 frontmatter：

```md
---
title: '为什么要写纯静态土豆博客'
date: '2026-03-03'
tags: ['日常']
excerpt: '记录一下写博客的过程'
coverImage: ''
---
```

字段说明：

- `title`：文章标题，必填
- `date`：发布日期，格式 `YYYY-MM-DD`，必填
- `tags`：标签数组，可选，用于分类筛选
- `excerpt`：摘要，可选，首页列表展示
- `coverImage`：封面图片文件名，可选。实际路径由代码拼接生成

文件名就是文章 ID。比如 `hello.md` 对应的 ID 就是 `hello`，路由里通过 `article/:id` 匹配。

## 4. 动态读取文章列表

有了 Markdown 文件，下一步是让程序自动发现它们。用 Vite 的 `import.meta.glob` 实现：

```ts
// src/utils/articleList.ts
import type { Component } from 'vue'

const baseUrl = import.meta.env.BASE_URL

interface MarkdownModule {
  default: Component
  title?: string
  date?: string
  tags?: string[]
  excerpt?: string
  coverImage?: string
}

const modules: Record<string, MarkdownModule> = import.meta.glob(
  '@/articles/*.md', { eager: true }
)

export const articles = Object.entries(modules)
  .filter(([path]) => !path.includes('AGENTS.md'))
  .map(([path, mod]) => {
    const id = path.split('/').pop()!.replace('.md', '')
    const imgPath = baseUrl + 'img/cover/'
    return {
      id,
      title: mod.title || id,
      date: mod.date || '未知日期',
      tags: mod.tags || [],
      excerpt: mod.excerpt || '',
      coverImage: mod.coverImage ? imgPath + mod.coverImage : '',
      component: mod.default,
    }
  })
  .sort((a, b) => b.date.localeCompare(a.date))

export function getAllTags(): string[] {
  const tagSet = new Set<string>()
  articles.forEach((article) => {
    article.tags?.forEach((tag) => tagSet.add(tag))
  })
  return Array.from(tagSet).sort()
}
```

几个设计细节：

- `import.meta.glob` 的 `eager: true`：在构建时立即执行导入，运行时不需要异步等待。匹配 `@/articles/*.md` 下的所有文件。
- `.filter(([path]) => !path.includes('AGENTS.md'))`：排除 `AGENTS.md`，这个是项目的知识库文件，不是文章。
- `coverImage` 处理：只存文件名，路径由 `baseUrl + 'img/cover/'` 拼接。这样封面图统一放在 `public/img/cover/` 下，部署到 Cloudflare Pages 时路径正确。\`
`- `.sort((a, b) => b.date.localeCompare(a.date))\`：按日期降序排列，最新文章排最前面。
- `getAllTags()` 工具函数：遍历所有文章收集标签，去重并排序，供标签页使用。

## 5. 配置路由

路由设计决定用户怎么访问文章。这里用嵌套路由，所有页面共享一个 `AppLayout` 布局组件：

```ts
// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import { articles } from '@/utils/articleList.ts'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'AppLayout',
      component: () => import('@/components/layout/AppLayout.vue'),
      children: [
        {
          path: '',
          name: 'HomePage',
          component: () => import('@/views/HomePage.vue'),
          meta: { title: '首页-土豆博客' },
        },
        {
          path: 'article',
          name: 'ArticlePage',
          component: () => import('@/views/ArticlePage.vue'),
          meta: { title: '文章列表-土豆博客' },
        },
        {
          path: 'article/:id',
          name: 'ArticleDetail',
          component: () => import('@/views/ArticleDetail.vue'),
          beforeEnter: (to) => {
            if (!articles.find((a) => a.id === to.params.id)) {
              return { name: 'NotFound' }
            }
          },
        },
        {
          path: 'about',
          name: 'AboutPage',
          component: () => import('@/views/AboutPage.vue'),
          meta: { title: '关于-土豆博客' },
        },
        {
          path: '/:pathMatch(.*)*',
          name: 'NotFound',
          component: () => import('@/views/NotFoundPage.vue'),
        },
      ],
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    return { top: 0, behavior: 'smooth' }
  },
})

router.afterEach((to) => {
  document.title = (to.meta.title as string) || '土豆博客'
})

export default router
```

路由设计要点：

- **嵌套路由**：`AppLayout` 为父路由，所有页面作为子路由。这样头部、底部等公共部分只需写一次。
- **动态路由 `article/:id`**：`id` 对应文件名（不含 `.md`）。比如访问 `/article/hello` 就渲染 `hello.md` 转换后的组件。
- **`beforeEnter` 守卫**：在进入文章详情前检查文章是否存在。如果 `articles` 列表里找不到对应的 `id`，直接重定向到 404 页面。这样访问不存在的文章不会白屏或报错。
- **`/:pathMatch(.*)*` 通配路由**：捕获所有未匹配的路径，指向自定义的 404 页面。
- **`scrollBehavior`**：返回 `savedPosition` 支持浏览器前进后退恢复滚动位置；`to.hash` 实现锚点平滑滚动；默认回到顶部。
- **`router.afterEach`**：每次路由切换后根据 `meta.title` 更新页面标题，没有设置的路由用默认标题"土豆博客"。

## 6. 渲染文章详情页

文章详情页的核心是渲染 Markdown 转换后的 Vue 组件。由于插件已经把 `.md` 文件转成了组件，直接动态挂载就行：

```vue
<template>
  <article class="article-page">
    <div v-if="article" class="article-card">
      <!-- 封面区域 -->
      <header
        v-if="article.coverImage"
        :style="`background-image: url(${article.coverImage})`"
        class="cover-wrapper"
      >
        <img
          :alt="article.title"
          :src="article.coverImage"
          class="article-cover"
          loading="eager"
        />
      </header>

      <div class="article-info">
        <div class="article-meta">
          <h1 class="article-title">{{ article.title }}</h1>
          <time :datetime="article.date" class="article-time">
            {{ article.date }}
          </time>
        </div>
      </div>

      <!-- 文章内容 -->
      <section class="article-content">
        <div ref="contentRef" class="markdown-body">
          <component :is="article.component" v-if="article.component" />
        </div>
      </section>
    </div>
  </article>
</template>
```

核心就一行：`<component :is="article.component" />`。`article.component` 就是插件从 Markdown 转换出来的 Vue 组件，直接渲染就行。

样式方面，项目引入了 `github-markdown-css`（`import 'github-markdown-css'`），给包裹内容的 `.markdown-body` 加上 GitHub 风格的排版样式，看起来很干净。

封面图用了一个 blur 背景的视觉效果：封面图片正常显示，同时在它背后用 `::before` 伪元素模糊渲染同一张图作为背景，防止图片比例不匹配时出现空白。

## 7. 总结

这套方案的核心优势是简洁：

- 写文章就是写 Markdown，放进 `src/articles/` 即可
- `import.meta.glob` 自动发现文章，不需要手动注册
- `vite-plugin-vue-markdown` 把 Markdown 转成组件，无需额外构建步骤
- 动态路由 + `beforeEnter` 守卫做文章有效性校验
- 外部链接自动新标签打开，代码高亮用 Shiki

部署到 Cloudflare Pages 也很简单，Vite 构建输出静态文件，直接托管。整个系统依赖少，逻辑清晰，适合想自己控制博客代码的开发者。

有问题欢迎在评论区交流。
