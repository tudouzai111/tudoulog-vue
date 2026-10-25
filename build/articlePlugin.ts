import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import MarkdownIt from 'markdown-it'
import { parse as parseYaml } from 'yaml'
import { escapeXml } from './xml'
import { SITE_AUTHOR, SITE_DESCRIPTION, SITE_TITLE, SITE_URL } from '../src/constants/site'
import type { Plugin, ViteDevServer } from 'vite'

/**
 * 构建期文章元数据插件：
 * - 解析 src/articles/*.md 的 frontmatter，生成 virtual:article-meta（列表元数据）
 * - 生成 virtual:article-components（按文章 id 懒加载组件，draft 不进产物）
 * - 生成 virtual:words（废话列表）
 * - 预渲染每篇文章的纯 HTML 索引页（dist/_index/，供 Pagefind 全文搜索索引）
 * - 构建时附带产出 robots.txt / sitemap.xml / rss.xml
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
  /** AI 辅助撰写标识 */
  ai: boolean
  wordCount: number
  readingMinutes: number
}

export interface WordEntry {
  date: string
  body: string
}

interface ParsedFrontmatter {
  title?: string
  date?: string
  updated?: string
  tags?: string[]
  excerpt?: string
  coverImage?: string
  draft?: boolean
  ai?: boolean
}

// 阅读时长估算：中文 400 字/分钟，英文 200 词/分钟，代码块不计入
const CJK_PER_MINUTE = 400
const WORDS_PER_MINUTE = 200

function parseFrontmatter(raw: string): ParsedFrontmatter {
  const match = /^---\r?\n([\s\S]*?)\r?\n---/.exec(raw)
  if (!match) return {}

  // 用标准 YAML 解析：Sveltia CMS 保存的是块列表/布尔原生语法，
  // 手写的是内联数组/引号字符串，YAML 解析器两者通吃
  let doc: Record<string, unknown>
  try {
    doc = parseYaml(match[1]!) as Record<string, unknown>
  } catch {
    return {}
  }
  if (!doc || typeof doc !== 'object') return {}

  const result: ParsedFrontmatter = {}
  const tagsValue = doc.tags
  if (Array.isArray(tagsValue)) {
    result.tags = tagsValue.map(String).map((t) => t.trim()).filter(Boolean)
  } else if (typeof tagsValue === 'string') {
    result.tags = tagsValue
      .replace(/^\[/, '')
      .replace(/\]$/, '')
      .split(',')
      .map((t) => t.trim().replace(/^['"]|['"]$/g, ''))
      .filter(Boolean)
  }
  for (const key of ['title', 'date', 'updated', 'excerpt', 'coverImage'] as const) {
    const value = doc[key]
    if (value !== undefined && value !== null) result[key] = String(value)
  }
  if (doc.draft !== undefined) result.draft = doc.draft === true || doc.draft === 'true'
  if (doc.ai !== undefined) result.ai = doc.ai === true || doc.ai === 'true'
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
      // 只取文件名：兼容手写的裸文件名和 CMS 写入的完整路径（如 /img/cover/x.png）
      coverImageFile: fm.coverImage ? fm.coverImage.split('/').pop() ?? '' : '',
      draft: fm.draft ?? false,
      ai: fm.ai ?? false,
      wordCount,
      readingMinutes,
    })
  }
  return entries.sort((a, b) => b.date.localeCompare(a.date))
}

export function readWords(root: string): WordEntry[] {
  const dir = join(root, 'src/words')
  let files: string[]
  try {
    files = readdirSync(dir)
  } catch {
    return [] // 目录尚不存在时视为无内容
  }
  const entries: WordEntry[] = []
  for (const file of files) {
    if (!file.endsWith('.md') || file === 'AGENTS.md') continue
    const raw = readFileSync(join(dir, file), 'utf8')
    const fm = parseFrontmatter(raw)
    const body = raw
      .replace(/^---\r?\n[\s\S]*?\r?\n---/, '')
      .trim()
    if (!body) continue
    entries.push({ date: fm.date || '未知日期', body })
  }
  return entries.sort((a, b) => b.date.localeCompare(a.date))
}

const VIRTUAL_META = 'virtual:article-meta'
const VIRTUAL_COMPONENTS = 'virtual:article-components'
const VIRTUAL_WORDS = 'virtual:words'

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

function virtualWordsModule(words: WordEntry[]): string {
  return `export const words = ${JSON.stringify(words, null, 2)}\n`
}

// 全文搜索索引页渲染器：纯 markdown-it（不做代码高亮，索引只需要文本）
const indexRenderer = new MarkdownIt({ html: true, linkify: true, typographer: true })

function renderSearchPage(article: ArticleMetaEntry, body: string): string {
  const rendered = indexRenderer.render(body)
  return `<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<title>${escapeXml(article.title)}</title>
<meta data-pagefind-meta="date:${escapeXml(article.date)}" name="date">
<meta data-pagefind-meta="excerpt:${escapeXml(article.excerpt)}" name="excerpt">
</head>
<body>
<main data-pagefind-body>
<h1>${escapeXml(article.title)}</h1>
${rendered}
</main>
</body>
</html>
`
}

export function articlePlugin(root: string): Plugin {
  let articles = readArticles(root)
  let words = readWords(root)
  const virtualIds = new Set([
    '\0' + VIRTUAL_META,
    '\0' + VIRTUAL_COMPONENTS,
    '\0' + VIRTUAL_WORDS,
  ])

  const invalidateVirtualModules = (server: ViteDevServer) => {
    articles = readArticles(root)
    words = readWords(root)
    for (const id of virtualIds) {
      const mod = server.moduleGraph.getModuleById(id)
      if (mod) void server.moduleGraph.invalidateModule(mod)
    }
  }

  return {
    name: 'tudou-article-meta',
    resolveId(id) {
      if (id === VIRTUAL_META || id === VIRTUAL_COMPONENTS || id === VIRTUAL_WORDS) {
        return '\0' + id
      }
    },
    load(id) {
      if (id === '\0' + VIRTUAL_META) return virtualMetaModule(articles)
      if (id === '\0' + VIRTUAL_COMPONENTS) return virtualComponentsModule(articles)
      if (id === '\0' + VIRTUAL_WORDS) return virtualWordsModule(words)
    },
    configureServer(server) {
      const onChange = (file: string) => {
        const normalized = file.replaceAll('\\', '/')
        if (
          (normalized.includes('/articles/') || normalized.includes('/words/')) &&
          normalized.endsWith('.md')
        ) {
          invalidateVirtualModules(server)
        }
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

      // 全文搜索索引页：预渲染纯 HTML 到 dist/_index/，
      // Pagefind（package.json 的 build 脚本末尾）会索引这个目录，
      // 搜索结果 URL 由前端映射回 /article/<id>
      const articlesDir = join(root, 'src/articles')
      for (const article of published) {
        try {
          const raw = readFileSync(join(articlesDir, `${article.id}.md`), 'utf8')
          const body = raw.replace(/^---\r?\n[\s\S]*?\r?\n---/, '').trim()
          this.emitFile({
            type: 'asset',
            fileName: `_index/${article.id}.html`,
            source: renderSearchPage(article, body),
          })
        } catch {
          // 单篇读取失败只跳过该篇的索引，不阻断构建
        }
      }
    },
    // 404.html 由 .github/workflows/deploy.yml 在部署 gh-pages 前复制生成。

  }
}
