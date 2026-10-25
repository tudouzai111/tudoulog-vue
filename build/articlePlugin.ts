import { copyFileSync, existsSync, readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { escapeXml } from './xml'
import { SITE_AUTHOR, SITE_DESCRIPTION, SITE_TITLE, SITE_URL } from '../src/constants/site'
import type { Plugin, ViteDevServer } from 'vite'

/**
 * 构建期文章元数据插件：
 * - 解析 src/articles/*.md 的 frontmatter，生成 virtual:article-meta（列表元数据）
 * - 生成 virtual:article-components（按文章 id 懒加载组件，draft 不进产物）
 * - 构建时附带产出 robots.txt / sitemap.xml / rss.xml / 404.html
 *
 * 说明：frontmatter 解析为受支持字段的宽松解析（标量 + 行内数组），
 * 与项目文章书写约定（src/articles/AGENTS.md）保持一致。
 */

export interface ArticleMetaEntry {
  id: string
  title: string
  date: string
  updated?: string
  tags: string[]
  excerpt: string
  coverImageFile: string
  draft: boolean
  wordCount: number
  readingMinutes: number
}

interface ParsedFrontmatter {
  title?: string
  date?: string
  updated?: string
  tags?: string[]
  excerpt?: string
  coverImage?: string
  draft?: boolean
}

// 阅读时长估算：中文 400 字/分钟，英文 200 词/分钟，代码块不计入
const CJK_PER_MINUTE = 400
const WORDS_PER_MINUTE = 200

function parseFrontmatter(raw: string): ParsedFrontmatter {
  const match = /^---\r?\n([\s\S]*?)\r?\n---/.exec(raw)
  if (!match) return {}
  const result: ParsedFrontmatter = {}
  for (const line of match[1]!.split(/\r?\n/)) {
    const m = /^([A-Za-z_]+):\s*(.*)$/.exec(line)
    if (!m) continue
    const key = m[1]!
    const value = m[2]!.trim()
    switch (key) {
      case 'tags':
        result.tags = value
          .replace(/^\[/, '')
          .replace(/\]$/, '')
          .split(',')
          .map((t) => t.trim().replace(/^['"]|['"]$/g, ''))
          .filter(Boolean)
        break
      case 'draft':
        result.draft = value === 'true'
        break
      case 'title':
      case 'date':
      case 'updated':
      case 'excerpt':
      case 'coverImage':
        result[key] = value.replace(/^['"]|['"]$/g, '')
        break
    }
  }
  return result
}

function estimateReading(raw: string): { wordCount: number; readingMinutes: number } {
  const body = raw.replace(/^---\r?\n[\s\S]*?\r?\n---/, '')
  const prose = body
    .replace(/```[\s\S]*?```/g, '')
    .replace(/~~~[\s\S]*?~~~/g, '')
    .replace(/`[^`]*`/g, '')
    .replace(/<[^>]+>/g, '')
  const cjkCount = (prose.match(/[\u4e00-\u9fa5\u3040-\u30ff]/g) ?? []).length
  const latinWords = prose
    .replace(/[\u4e00-\u9fa5\u3040-\u30ff]/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length
  const minutes = Math.ceil(cjkCount / CJK_PER_MINUTE + latinWords / WORDS_PER_MINUTE)
  return { wordCount: cjkCount + latinWords, readingMinutes: Math.max(1, minutes) }
}

export function readArticles(root: string): ArticleMetaEntry[] {
  const dir = join(root, 'src/articles')
  const entries: ArticleMetaEntry[] = []
  for (const file of readdirSync(dir)) {
    if (!file.endsWith('.md') || file === 'AGENTS.md') continue
    const id = file.replace(/\.md$/, '')
    const raw = readFileSync(join(dir, file), 'utf8')
    const fm = parseFrontmatter(raw)
    const { wordCount, readingMinutes } = estimateReading(raw)
    entries.push({
      id,
      title: fm.title || id,
      date: fm.date || '未知日期',
      updated: fm.updated,
      tags: fm.tags ?? [],
      excerpt: fm.excerpt ?? '',
      coverImageFile: fm.coverImage ?? '',
      draft: fm.draft ?? false,
      wordCount,
      readingMinutes,
    })
  }
  return entries.sort((a, b) => b.date.localeCompare(a.date))
}

const VIRTUAL_META = 'virtual:article-meta'
const VIRTUAL_COMPONENTS = 'virtual:article-components'

function virtualMetaModule(articles: ArticleMetaEntry[]): string {
  // 草稿的元数据同样不进客户端产物，避免标题/摘要泄露
  return `export const articleMeta = ${JSON.stringify(
    articles.filter((a) => !a.draft),
    null,
    2,
  )}\n`
}

function virtualComponentsModule(articles: ArticleMetaEntry[]): string {
  const lines = articles
    .filter((a) => !a.draft)
    .map(
      (a) =>
        `  ${JSON.stringify(a.id)}: () => import(${JSON.stringify(`/src/articles/${a.id}.md`)}).then((m) => m.default),`,
    )
  return `export const componentMap = {\n${lines.join('\n')}\n}\n`
}

export function articlePlugin(root: string): Plugin {
  let articles = readArticles(root)
  const virtualIds = new Set(['\0' + VIRTUAL_META, '\0' + VIRTUAL_COMPONENTS])

  const invalidateVirtualModules = (server: ViteDevServer) => {
    articles = readArticles(root)
    for (const id of virtualIds) {
      const mod = server.moduleGraph.getModuleById(id)
      if (mod) void server.moduleGraph.invalidateModule(mod)
    }
  }

  return {
    name: 'tudou-article-meta',
    resolveId(id) {
      if (id === VIRTUAL_META || id === VIRTUAL_COMPONENTS) return '\0' + id
    },
    load(id) {
      if (id === '\0' + VIRTUAL_META) return virtualMetaModule(articles)
      if (id === '\0' + VIRTUAL_COMPONENTS) return virtualComponentsModule(articles)
    },
    configureServer(server) {
      const onChange = (file: string) => {
        if (file.includes('articles') && file.endsWith('.md')) invalidateVirtualModules(server)
      }
      server.watcher.on('add', onChange)
      server.watcher.on('change', onChange)
      server.watcher.on('unlink', onChange)
    },
    transformIndexHtml() {
      return [
        {
          tag: 'link',
          attrs: {
            rel: 'alternate',
            type: 'application/rss+xml',
            title: SITE_TITLE,
            href: '/rss.xml',
          },
          injectTo: 'head',
        },
        { tag: 'meta', attrs: { name: 'author', content: SITE_AUTHOR }, injectTo: 'head' },
      ]
    },
    generateBundle() {
      const published = articles.filter((a) => !a.draft)
      const buildDate = new Date().toISOString().slice(0, 10)
      const pageUrl = (path: string) => SITE_URL + path

      // robots.txt
      this.emitFile({
        type: 'asset',
        fileName: 'robots.txt',
        source: `User-agent: *\nAllow: /\n\nSitemap: ${pageUrl('/sitemap.xml')}\n`,
      })

      // sitemap.xml
      const staticPages = ['/', '/article', '/word', '/about']
      const sitemapUrls = [
        ...staticPages.map(
          (p) =>
            `  <url>\n    <loc>${pageUrl(p)}</loc>\n    <lastmod>${buildDate}</lastmod>\n  </url>`,
        ),
        ...published.map(
          (a) =>
            `  <url>\n    <loc>${pageUrl(`/article/${a.id}`)}</loc>\n    <lastmod>${a.updated || a.date}</lastmod>\n  </url>`,
        ),
      ]
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapUrls.join('\n')}\n</urlset>\n`,
      })

      // rss.xml（RSS 2.0，摘要输出）
      const rssItems = published
        .map(
          (a) =>
            `    <item>\n      <title>${escapeXml(a.title)}</title>\n      <link>${pageUrl(`/article/${a.id}`)}</link>\n      <guid isPermaLink="true">${pageUrl(`/article/${a.id}`)}</guid>\n      <pubDate>${new Date(a.date).toUTCString()}</pubDate>\n      <description>${escapeXml(a.excerpt)}</description>\n    </item>`,
        )
        .join('\n')
      this.emitFile({
        type: 'asset',
        fileName: 'rss.xml',
        source: `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">\n  <channel>\n    <title>${escapeXml(SITE_TITLE)}</title>\n    <link>${pageUrl('/')}</link>\n    <description>${escapeXml(SITE_DESCRIPTION)}</description>\n    <language>zh-CN</language>\n    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>\n    <atom:link href="${pageUrl('/rss.xml')}" rel="self" type="application/rss+xml" />\n${rssItems}\n  </channel>\n</rss>\n`,
      })
    },
    closeBundle() {
      // GitHub Pages 的 SPA 回退：404.html 与 index.html 完全一致，
      // 由 vue-router 的通配路由在前端决定展示内容（Cloudflare Pages 同样生效）
      const distDir = join(root, 'dist')
      const indexHtml = join(distDir, 'index.html')
      if (existsSync(indexHtml)) {
        copyFileSync(indexHtml, join(distDir, '404.html'))
      }
    },
  }
}
