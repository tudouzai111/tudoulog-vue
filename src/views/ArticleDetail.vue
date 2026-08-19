<script lang="ts" setup>
import { useRoute, useRouter } from 'vue-router'
import { computed, nextTick, ref, watch } from 'vue'
import type { Component } from 'vue'
import { articles, loadArticleComponent } from '@/utils/articleList'
import type { Heading } from '@/types'

import 'github-markdown-css'
import '@/styles/article-common.css'
import TocComponent from '@/components/TocComponent.vue'
import BackToTop from '@/components/BackToTop.vue'
import TagComponent from '@/components/TagComponent.vue'
import { TAG_MODE } from '@/constants/tagMode.ts'

const route = useRoute()
const router = useRouter()
const goToListWithTag = (tags: string) => {
  router.push({
    path: '/article',
    query: { tags },
  })
}

const articleId = route.params.id as string
const article = computed(() => articles.find((a) => a.id === articleId))

const contentRef = ref<HTMLElement | null>(null)
const headings = ref<Heading[]>([])

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-') // 空格替换为'-'
    .replace(/[^\w\u4e00-\u9fa5-]/g, '') // 保留中文，字母，数字，连字符
}

function generateTocTree(contentRef: HTMLElement): Heading[] {
  const elements = contentRef.querySelectorAll('h1, h2, h3, h4, h5, h6')
  const slugCount = new Map<string, number>()

  // 辅助：生成唯一 slug
  const generateId = (text: string): string => {
    const baseSlug = slugify(text) || 'heading'
    const count = slugCount.get(baseSlug) || 0
    const id = count === 0 ? baseSlug : `${baseSlug}-${count}`
    slugCount.set(baseSlug, count + 1)
    return id
  }

  // 核心：用栈维护层级关系
  const stack: Heading[] = [] // 栈顶是当前处理的父节点
  const root: Heading[] = [] // 最终结果

  elements.forEach((el) => {
    const level = parseInt(el.tagName.slice(1)) // H2 -> 2
    const title = el.textContent || ''

    // 生成/复用 id
    let id = el.id
    if (!id) {
      id = generateId(title)
      el.id = id // 回填 DOM，用于锚点跳转
    }

    const node: Heading = { id, title, level, children: [] }

    // 栈操作：找到正确的父节点
    while (stack.length > 0 && stack[stack.length - 1]!.level >= level) {
      stack.pop() // 当前节点层级 ≤ 栈顶，说明栈顶不是父节点
    }

    if (stack.length === 0) {
      // 没有父节点，直接挂到根
      root.push(node)
    } else {
      // 挂到栈顶（当前父节点）的 children 里
      stack[stack.length - 1]!.children!.push(node)
    }

    // 当前节点入栈，可能成为后续节点的父节点
    stack.push(node)
  })

  return root
}

// 懒加载的文章正文组件实例
const articleComp = ref<Component | null>(null)

// 文章组件为异步加载，需等待其渲染完成后才能提取标题生成目录
watch(
  article,
  async (a) => {
    if (!a) return
    // 设置标题为文章标题
    document.title = a.title + '-土豆博客'

    // 清空旧内容与旧目录
    articleComp.value = null
    headings.value = []

    const comp = await loadArticleComponent(a.id)
    if (!comp) return

    articleComp.value = comp

    // 等待异步组件渲染进 DOM
    await nextTick()
    if (contentRef.value) {
      headings.value = generateTocTree(contentRef.value)
    }
  },
  { immediate: true },
)
</script>

<template>
  <article class="article-page">
    <div v-if="article" class="article-card">
      <!-- 封面区域 -->
      <header
        v-if="article.coverImage"
        :style="`background-image: url(${article.coverImage})`"
        class="cover-wrapper"
      >
        <img :alt="article.title" :src="article.coverImage" class="article-cover" loading="eager" />
      </header>

      <div class="article-info">
        <div class="article-meta">
          <h1 class="article-title">{{ article.title }}</h1>
          <time :datetime="article.date" class="article-time">{{ article.date }}</time>
        </div>
        <div class="tags-position">
          <TagComponent
            :mode="TAG_MODE[1]"
            :tags="article.tags || []"
            @click-tag="goToListWithTag"
          />
        </div>
      </div>

      <div v-if="article.excerpt" class="article-excerpt">{{ article.excerpt }}</div>

      <!-- 文章内容 -->
      <section class="article-content">
        <div ref="contentRef" class="markdown-body">
          <component :is="articleComp" v-if="articleComp" />
        </div>
        <TocComponent :headings="headings" />
      </section>
    </div>
    <BackToTop />
  </article>
</template>

<style scoped>
.article-page {
  max-width: 1200px;
}

.article-card {
  width: 100%;
  background: var(--md-background);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
}

.cover-wrapper {
  border-radius: var(--border-radius) var(--border-radius) 0 0;
  position: relative;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  overflow: hidden;
}

.cover-wrapper::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: inherit; /* 继承父元素的背景图 */
  background-size: cover;
  background-position: center;
  filter: blur(8px);
  z-index: 0;
}

.article-cover {
  position: relative;
  display: block;
  width: 100%;
  max-height: 60vh;
  object-fit: scale-down;
  object-position: center;
  z-index: 1;
}

.article-info {
  padding: var(--spacing-lg);
}

.article-title {
  color: var(--dark-gray);
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0 0 var(--spacing-xs);
  line-height: 1.3;
}

.article-time {
  color: var(--mid-gray);
  font-size: 0.875rem;
}

.tags-position {
  padding-top: var(--spacing-sm);
}

.article-excerpt {
  width: 100%;
  padding: var(--spacing-lg);
  background: var(--off-white);
  color: var(--dark-gray);
}
.article-content {
  width: 100%;
  max-width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: var(--spacing-lg);
  gap: var(--spacing-lg);
}

.article-content img {
  width: 100%;
}

@media (max-width: 768px) {
  .article-content {
    flex-direction: column;
    padding: var(--spacing);
  }
  .article-title {
    font-size: 1.25rem;
  }
}

.markdown-body {
  background: none;
  width: 100%;
  min-width: 0;
  flex-shrink: 1;
}
</style>
