import type { Component } from 'vue'

const baseUrl = import.meta.env.BASE_URL

// 文章 frontmatter 元数据
interface ArticleMeta {
  title?: string
  date?: string
  tags?: string[]
  excerpt?: string
  coverImage?: string
}

export interface Article extends ArticleMeta {
  id: string
  title: string
  date: string
  tags: string[]
  excerpt: string
  coverImage: string
  /** 正文字数（含中文按字、英文按词） */
  wordCount: number
  /** 预估阅读分钟数（最少 1 分钟） */
  readingMinutes: number
}

// 通过 import.meta.glob 导入文章原始文本（用于解析 frontmatter 与统计字数）
const rawModules = import.meta.glob<string>(['@/articles/*.md', '!**/AGENTS.md'], {
  eager: true,
  query: '?raw',
  import: 'default',
})

const componentLoaders = import.meta.glob<Component>('@/articles/*.md', {
  import: 'default',
})

function idFromPath(path: string): string {
  return path.split('/').pop()!.replace('.md', '')
}

function parseFrontmatter(raw: string): ArticleMeta {
  const match = /^---\r?\n([\s\S]*?)\r?\n---/.exec(raw)
  if (!match) return {}
  const result: ArticleMeta = {}
  for (const line of match[1]!.split(/\r?\n/)) {
    const m = /^([A-Za-z_]+):\s*(.*)$/.exec(line)
    if (!m) continue
    const [, key, value] = m
    const v = value!.trim()
    if (key === 'tags') {
      result.tags = v
        .replace(/^\[/, '')
        .replace(/\]$/, '')
        .split(',')
        .map((t) => t.trim().replace(/^['"]|['"]$/g, ''))
        .filter(Boolean)
    } else if (key === 'title' || key === 'date' || key === 'excerpt' || key === 'coverImage') {
      result[key] = v.replace(/^['"]|['"]$/g, '')
    }
  }
  return result
}

// 阅读时长估算：中文按 400 字/分钟，英文按 200 词/分钟
// 代码块不计入（扫代码的速度和读正文差别很大）
const CJK_PER_MINUTE = 400
const WORDS_PER_MINUTE = 200

function estimateReading(raw: string): { wordCount: number; readingMinutes: number } {
  const body = raw.replace(/^---\r?\n[\s\S]*?\r?\n---/, '')
  const prose = body
    .replace(/```[\s\S]*?```/g, '') // 围栏代码块
    .replace(/~~~[\s\S]*?~~~/g, '')
    .replace(/`[^`]*`/g, '') // 行内代码
    .replace(/<[^>]+>/g, '') // 内嵌 HTML 标签
  const cjkCount = (prose.match(/[\u4e00-\u9fa5\u3040-\u30ff]/g) ?? []).length
  const latinWords = prose
    .replace(/[\u4e00-\u9fa5\u3040-\u30ff]/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length
  const wordCount = cjkCount + latinWords
  const minutes = Math.ceil(cjkCount / CJK_PER_MINUTE + latinWords / WORDS_PER_MINUTE)
  return { wordCount, readingMinutes: Math.max(1, minutes) }
}

// id → 懒加载器映射
const componentMap: Record<string, () => Promise<Component>> = {}
for (const [path, loader] of Object.entries(componentLoaders)) {
  componentMap[idFromPath(path)] = loader
}

export const articles: Article[] = Object.entries(rawModules)
  .map(([path, raw]) => {
    const fm = parseFrontmatter(raw)
    const id = idFromPath(path)
    const { wordCount, readingMinutes } = estimateReading(raw)
    return {
      id,
      title: fm.title || id,
      date: fm.date || '未知日期',
      tags: fm.tags || [],
      excerpt: fm.excerpt || '',
      coverImage: fm.coverImage ? baseUrl + 'img/cover/' + fm.coverImage : '',
      wordCount,
      readingMinutes,
    }
  })
  .sort((a, b) => b.date.localeCompare(a.date))

// 按 id 懒加载文章正文组件
export function loadArticleComponent(id: string): Promise<Component> | undefined {
  return componentMap[id]?.()
}
