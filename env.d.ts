/// <reference types="vite/client" />

declare module 'virtual:article-meta' {
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
  export const articleMeta: ArticleMetaEntry[]
}

declare module 'virtual:article-components' {
  import type { Component } from 'vue'
  export const componentMap: Record<string, () => Promise<Component>>
}
