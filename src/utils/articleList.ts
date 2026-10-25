import type { Component } from 'vue'
import { articleMeta } from 'virtual:article-meta'
import { componentMap } from 'virtual:article-components'

const baseUrl = import.meta.env.BASE_URL

// 文章列表元数据由构建期插件（build/articlePlugin.ts）从 markdown 提取，
// 运行时只做展示层的映射与排序
export interface Article {
  id: string
  title: string
  date: string
  updated?: string
  tags: string[]
  excerpt: string
  coverImage: string
  /** AI 辅助撰写标识 */
  ai: boolean
  /** 正文字数（含中文按字、英文按词） */
  wordCount: number
  /** 预估阅读分钟数（最少 1 分钟） */
  readingMinutes: number
}

export const articles: Article[] = articleMeta
  .filter((meta) => !meta.draft)
  .map((meta) => ({
    id: meta.id,
    title: meta.title || meta.id,
    date: meta.date || '未知日期',
    updated: meta.updated,
    tags: meta.tags,
    excerpt: meta.excerpt,
    coverImage: meta.coverImageFile ? baseUrl + 'img/cover/' + meta.coverImageFile : '',
    ai: meta.ai,
    wordCount: meta.wordCount,
    readingMinutes: meta.readingMinutes,
  }))
  .sort((a, b) => b.date.localeCompare(a.date))

// 按 id 懒加载文章正文组件（draft 文章不包含在映射里，路由守卫会兜底到 404）
export function loadArticleComponent(id: string): Promise<Component> | undefined {
  return componentMap[id]?.()
}
