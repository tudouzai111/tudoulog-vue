import { fileURLToPath, URL } from 'node:url'
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import Markdown from 'vite-plugin-vue-markdown'
import {
  bundledLanguages,
  createHighlighter,
  type BuiltinLanguage,
  type Highlighter,
  type ShikiTransformer,
} from 'shiki'

// 给代码块注入复制按钮（点击行为由文章详情页统一代理）
function copyButtonTransformer(): ShikiTransformer {
  return {
    name: 'tudou-copy-button',
    pre(node) {
      this.addClassToHast(node, 'shiki-has-copy')
      node.children.push({
        type: 'element',
        tagName: 'button',
        properties: {
          class: 'shiki-copy-btn',
          type: 'button',
          'aria-label': '复制代码',
        },
        children: [{ type: 'text', value: '复制' }],
      })
    },
  }
}

// 扫描文章里的代码围栏，收集实际用到的语言，避免构建时加载全部语法
function collectArticleLangs(): BuiltinLanguage[] {
  const articlesDir = fileURLToPath(new URL('./src/articles', import.meta.url))
  const langSet = new Set<string>(['text'])
  for (const file of readdirSync(articlesDir)) {
    if (!file.endsWith('.md')) continue
    const raw = readFileSync(join(articlesDir, file), 'utf8')
    for (const match of raw.matchAll(/^```(\S+)/gm)) {
      langSet.add(match[1]!)
    }
  }
  return [...langSet].filter((lang): lang is BuiltinLanguage => lang in bundledLanguages)
}

export default defineConfig(async () => {
  const highlighter: Highlighter = await createHighlighter({
    themes: ['github-light', 'one-dark-pro'],
    langs: collectArticleLangs(),
  })

  return {
    base: '/',
    plugins: [
      vue({
        include: [/\.vue$/, /\.md$/], // 让 Vue 处理 .md 文件
      }),
      vueDevTools(),
      Markdown({
        markdownItOptions: {
          html: true,
          linkify: true,
          typographer: true,
          // Shiki 双主题：单份 HTML 同时带亮/暗两套行内颜色，暗色走 CSS 变量
          highlight(code, lang) {
            const realLang = (lang && lang in bundledLanguages ? lang : 'text') as BuiltinLanguage
            try {
              return highlighter.codeToHtml(code, {
                lang: realLang,
                themes: { light: 'github-light', dark: 'one-dark-pro' },
                defaultColor: 'light',
                transformers: [copyButtonTransformer()],
              })
            } catch {
              return `<pre class="shiki"><code>${escapeHtml(code)}</code></pre>`
            }
          },
        },
        markdownItUses: [
          // 自定义链接渲染器，使外部链接在新标签页中打开
          /* eslint-disable @typescript-eslint/no-explicit-any */
          (md: any) => {
            const defaultRender =
              md.renderer.rules.link_open ||
              ((tokens: any, idx: any, options: any, env: any, self: any) => {
                return self.renderToken(tokens, idx, options)
              })

            md.renderer.rules.link_open = (
              tokens: any,
              idx: any,
              options: any,
              env: any,
              self: any,
            ) => {
              const hrefIndex = tokens[idx].attrIndex('href')
              if (hrefIndex >= 0) {
                const href = tokens[idx].attrs[hrefIndex][1]
                // 判断是否为外部链接（以 http:// 或 https:// 开头）
                if (/^https?:\/\//.test(href)) {
                  // 添加 target="_blank" 和 rel="noopener noreferrer"
                  tokens[idx].attrSet('target', '_blank')
                  tokens[idx].attrSet('rel', 'noopener noreferrer')
                }
              }
              return defaultRender(tokens, idx, options, env, self)
            }
          },
          /* eslint-enable @typescript-eslint/no-explicit-any */
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
    // 构建优化
    build: {
      // 代码分割
      rollupOptions: {
        output: {
          manualChunks: {
            // 将 vendor 代码分离
            vendor: ['vue', 'vue-router'],
          },
        },
      },
    },
  }
})

function escapeHtml(code: string): string {
  return code
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}
