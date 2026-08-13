import type { Component } from 'vue'

const baseUrl = import.meta.env.BASE_URL

// 定义对应插件生成类，包含default组件用来显示markdown正文内容
// 文章内容
interface ArticleMeta {
  title?: string
  date?: string
  tags?: string[]
  excerpt?: string
  coverImage?: string
}
interface MarkdownModule {
  default: Component
  title?: string
  date?: string
  tags?: string[]
  excerpt?: string
  coverImage?: string
}


// 通过import.meta.glob一次性导入所有md文件
// 每个导入的模块会包含所有frontmatter字段和默认导出的default组件
// 使用 eager 会在构建时立即执行
const modules: Record<string, MarkdownModule> = import.meta.glob('@/articles/*.md', { eager: true })

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

// id → 懒加载器映射
const componentMap: Record<string, () => Promise<Component>> = {}
for (const [path, loader] of Object.entries(componentLoaders)) {
  componentMap[idFromPath(path)] = loader
}

export const articles = Object.entries(rawModules)
  .map(([path, raw]) => {
    const fm = parseFrontmatter(raw)
    const id = idFromPath(path)
    return {
      id,
      title: fm.title || id,
      date: fm.date || '未知日期',
      tags: fm.tags || [],
      excerpt: fm.excerpt || '',
      coverImage: fm.coverImage ? baseUrl + 'img/cover/' + fm.coverImage : '',
    }
  })
  .sort((a, b) => b.date.localeCompare(a.date))

// 按 id 懒加载文章正文组件
export function loadArticleComponent(id: string): Promise<Component> | undefined {
  return componentMap[id]?.()
}

