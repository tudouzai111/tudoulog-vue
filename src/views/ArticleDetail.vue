<script lang="ts" setup>
import { useRoute, useRouter } from 'vue-router'
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import type { Component } from 'vue'
import { articles, loadArticleComponent } from '@/utils/articleList'
import type { Heading } from '@/types'
import { SITE_URL } from '@/constants/site'

import 'github-markdown-css'
import '@/styles/markdown-scheme.css'
import '@/styles/article-common.css'
import TocComponent from '@/components/TocComponent.vue'
import BackToTop from '@/components/BackToTop.vue'
import TagComponent from '@/components/TagComponent.vue'
import ArticleStats from '@/components/ArticleStats.vue'
import GiscusComments from '@/components/GiscusComments.vue'
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

// 按日期降序的列表里，当前文章的前一篇更新、后一篇更早
const currentIndex = computed(() => articles.findIndex((a) => a.id === articleId))
const newerArticle = computed(() =>
  currentIndex.value > 0 ? articles[currentIndex.value - 1]! : null,
)
const olderArticle = computed(() =>
  currentIndex.value >= 0 && currentIndex.value < articles.length - 1
    ? articles[currentIndex.value + 1]!
    : null,
)

// 相关文章：按标签重合度排序，取前 3 篇（没有重合就隐藏）
const relatedArticles = computed(() => {
  const tags = article.value?.tags ?? []
  if (!tags.length) return []
  return articles
    .filter((a) => a.id !== articleId)
    .map((a) => ({ article: a, overlap: (a.tags ?? []).filter((t) => tags.includes(t)).length }))
    .filter((r) => r.overlap > 0)
    .sort((a, b) => b.overlap - a.overlap || b.article.date.localeCompare(a.article.date))
    .slice(0, 3)
})

// 复制正文：优先 Clipboard API，不可用时降级到 execCommand
async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.select()
    let ok = false
    try {
      ok = document.execCommand('copy')
    } catch {
      ok = false
    }
    textarea.remove()
    return ok
  }
}

// 代码块复制按钮（构建期由 Shiki transformer 注入），在正文容器上统一代理点击
// 同时代理图片点击放大（lightbox）
const lightboxSrc = ref('')

const handleContentClick = async (event: MouseEvent) => {
  const target = event.target as HTMLElement

  // 标题锚点：拦截原生跳转，与目录行为保持一致
  // （原生跳转会把百分号编码的中文哈希留在 URL，且滚动行为不受控）
  const anchor = target.closest('a.heading-anchor')
  if (anchor) {
    event.preventDefault()
    const id = anchor.getAttribute('href')?.slice(1) ?? ''
    const heading = document.getElementById(id)
    if (heading) {
      heading.scrollIntoView({ behavior: 'smooth' })
      // 静默更新地址栏，方便复制带锚点的链接，也不触发路由导航
      history.replaceState(null, '', `#${id}`)
    }
    return
  }

  // 图片放大
  const img = target.closest('img')
  if (img && img.closest('.markdown-body')) {
    lightboxSrc.value = img.getAttribute('src') ?? ''
    return
  }

  // 复制代码
  const btn = target.closest('.shiki-copy-btn')
  if (!btn) return
  const code = btn.closest('pre')?.querySelector('code')
  if (!code) return
  const ok = await copyText(code.textContent ?? '')
  btn.classList.add(ok ? 'copied' : 'copy-failed')
  btn.textContent = ok ? '已复制' : '复制失败'
  setTimeout(() => {
    btn.classList.remove('copied', 'copy-failed')
    btn.textContent = '复制'
  }, 1500)
}

// lightbox 打开时锁定背景滚动，Esc 关闭
watch(lightboxSrc, (src) => {
  document.body.style.overflow = src ? 'hidden' : ''
})

onUnmounted(() => {
  document.body.style.overflow = ''
})

const handleLightboxKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') lightboxSrc.value = ''
}

// 阅读进度条
const readingProgress = ref(0)

const updateReadingProgress = () => {
  const doc = document.documentElement
  const max = doc.scrollHeight - window.innerHeight
  readingProgress.value = max > 0 ? Math.min(100, (window.scrollY / max) * 100) : 0
}

onMounted(() => {
  window.addEventListener('scroll', updateReadingProgress, { passive: true })
  window.addEventListener('resize', updateReadingProgress)
  updateReadingProgress()
})

onUnmounted(() => {
  window.removeEventListener('scroll', updateReadingProgress)
  window.removeEventListener('resize', updateReadingProgress)
})

// 文末原文链接（复制分享用）
const articleLink = computed(() => SITE_URL + route.path)

const copyArticleLink = async () => {
  const ok = await copyText(`${article.value?.title ?? ''}\n${articleLink.value}`)
  linkCopied.value = ok
  setTimeout(() => (linkCopied.value = false), 1500)
}

const linkCopied = ref(false)

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
    // 标题文本排除构建期注入的锚点符号
    const clone = el.cloneNode(true) as HTMLElement
    clone.querySelector('.heading-anchor')?.remove()
    const title = clone.textContent?.trim() || ''

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
    <!-- 阅读进度条 -->
    <div aria-hidden="true" class="reading-progress" :style="{ width: readingProgress + '%' }" />
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
          <div class="article-meta-line">
            <span
              v-if="article.ai"
              class="ai-badge"
              title="本文由 AI 辅助撰写，内容基于实际操作过程整理"
            >
              <svg
                aria-hidden="true"
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                viewBox="0 0 24 24"
              >
                <path
                  d="M12 3l1.9 5.8a2 2 0 0 0 1.3 1.3L21 12l-5.8 1.9a2 2 0 0 0-1.3 1.3L12 21l-1.9-5.8a2 2 0 0 0-1.3-1.3L3 12l5.8-1.9a2 2 0 0 0 1.3-1.3z"
                />
              </svg>
              AI 辅助
            </span>
            <time :datetime="article.date" class="article-time">{{ article.date }}</time>
            <span v-if="article.updated" class="article-updated">
              更新于 {{ article.updated }}
            </span>
            <span class="article-stats"
              >约 {{ article.readingMinutes }} 分钟 · {{ article.wordCount }} 字</span
            >
            <ArticleStats v-if="articleId" :slug="articleId" />
          </div>
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
      <section class="article-content" @click="handleContentClick">
        <div ref="contentRef" class="markdown-body">
          <component :is="articleComp" v-if="articleComp" />
        </div>
        <TocComponent :headings="headings" />
      </section>

      <!-- 上一篇 / 下一篇 -->
      <nav v-if="newerArticle || olderArticle" aria-label="相邻文章" class="article-nav">
        <router-link
          v-if="newerArticle"
          :to="`/article/${newerArticle.id}`"
          class="article-nav-link"
        >
          <span class="nav-direction">← 上一篇</span>
          <span class="nav-title">{{ newerArticle.title }}</span>
        </router-link>
        <span v-else class="article-nav-spacer" aria-hidden="true"></span>
        <router-link
          v-if="olderArticle"
          :to="`/article/${olderArticle.id}`"
          class="article-nav-link align-end"
        >
          <span class="nav-direction">下一篇 →</span>
          <span class="nav-title">{{ olderArticle.title }}</span>
        </router-link>
      </nav>

      <!-- 相关文章 -->
      <section v-if="relatedArticles.length" aria-label="相关文章" class="related">
        <h3 class="related-title">相关文章</h3>
        <div class="related-grid">
          <router-link
            v-for="rel in relatedArticles"
            :key="rel.article.id"
            :to="`/article/${rel.article.id}`"
            class="related-item"
          >
            <span class="related-item-title">{{ rel.article.title }}</span>
            <span class="related-item-meta">
              {{ rel.article.date }} · {{ rel.article.readingMinutes }} 分钟
            </span>
          </router-link>
        </div>
      </section>

      <!-- 版权与分享 -->
      <footer class="article-license">
        <p class="license-text">
          本文作者：土豆仔 ·
          <a :href="articleLink" rel="noopener">原文链接</a> · 转载请注明出处（CC BY-NC 4.0）
        </p>
        <button class="copy-link-btn" type="button" @click="copyArticleLink">
          {{ linkCopied ? '已复制 ✓' : '复制链接' }}
        </button>
      </footer>

      <!-- 评论区（giscus，配置见 src/constants/giscus.ts） -->
      <GiscusComments />
    </div>
    <BackToTop />

    <!-- 图片放大层 -->
    <Teleport to="body">
      <Transition name="lightbox">
        <div
          v-if="lightboxSrc"
          aria-label="关闭图片预览"
          class="lightbox-overlay"
          role="button"
          tabindex="-1"
          @click="lightboxSrc = ''"
          @keydown="handleLightboxKeydown"
        >
          <img :alt="article?.title ?? ''" :src="lightboxSrc" class="lightbox-image" />
        </div>
      </Transition>
    </Teleport>
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

.article-meta-line {
  display: flex;
  align-items: baseline;
  gap: var(--spacing);
  flex-wrap: wrap;
}

.article-stats {
  color: var(--mid-gray);
  font-size: 0.8125rem;
}

.article-updated {
  color: var(--mid-gray);
  font-size: 0.8125rem;
}

/* AI 辅助徽章 */
.ai-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 10px;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--purple);
  background: color-mix(in srgb, var(--purple) 12%, transparent);
  border: 1px solid color-mix(in srgb, var(--purple) 35%, transparent);
}

.ai-badge svg {
  width: 13px;
  height: 13px;
}

/* 阅读进度条：固定在视口最顶端（高于吸顶导航） */
.reading-progress {
  position: fixed;
  top: 0;
  left: 0;
  height: 3px;
  background: var(--main);
  z-index: 50;
  pointer-events: none;
}

/* 版权与分享 */
.article-license {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--spacing);
  flex-wrap: wrap;
  padding: var(--spacing) var(--spacing-lg);
  border-top: 1px solid var(--light-gray);
  background: var(--off-white);
  border-radius: 0 0 var(--border-radius) var(--border-radius);
}

.license-text {
  margin: 0;
  color: var(--mid-gray);
  font-size: 0.8125rem;
}

.license-text a {
  color: var(--main);
}

.copy-link-btn {
  padding: 4px 12px;
  font-size: 0.75rem;
  font-weight: 600;
  font-family: inherit;
  border: 1px solid var(--light-gray);
  border-radius: var(--border-radius-sm);
  background: var(--white);
  color: var(--dark-gray);
  cursor: pointer;
  transition: var(--transition-fast);
  flex-shrink: 0;
}

.copy-link-btn:hover {
  border-color: var(--main);
  color: var(--main);
}

/* 相关文章 */
.related {
  padding: var(--spacing) var(--spacing-lg) var(--spacing-lg);
  border-top: 1px solid var(--light-gray);
}

.related-title {
  margin: 0 0 var(--spacing-sm);
  font-size: 1rem;
  color: var(--dark-gray);
}

.related-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-sm);
}

.related-item {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm);
  border: var(--border);
  border-radius: var(--border-radius-sm);
  background: var(--off-white);
  text-decoration: none;
  transition: var(--transition-fast);
  min-width: 0;
}

.related-item:hover {
  box-shadow: var(--shadow);
}

.related-item-title {
  color: var(--dark-gray);
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.related-item-meta {
  color: var(--mid-gray);
  font-size: 0.75rem;
}

@media (max-width: 768px) {
  .related-grid {
    grid-template-columns: 1fr;
  }
}

/* 上一篇 / 下一篇 */
.article-nav {
  display: flex;
  justify-content: space-between;
  gap: var(--spacing);
  padding: var(--spacing-lg);
  border-top: 1px solid var(--light-gray);
}

.article-nav-link {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  max-width: 48%;
  padding: var(--spacing-sm) var(--spacing);
  border-radius: var(--border-radius-sm);
  background: var(--off-white);
  border: var(--border);
  text-decoration: none;
  transition: var(--transition-fast);
}

.article-nav-link:hover {
  box-shadow: var(--shadow);
}

.article-nav-link.align-end {
  align-items: flex-end;
  text-align: right;
}

.article-nav-spacer {
  flex: 1;
}

.nav-direction {
  color: var(--mid-gray);
  font-size: 0.75rem;
  font-weight: 600;
}

.nav-title {
  color: var(--dark-gray);
  font-size: 0.9375rem;
  font-weight: 600;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
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
  .article-nav {
    flex-direction: column;
    padding: var(--spacing);
  }
  .article-nav-link {
    max-width: 100%;
  }
  .article-nav-link.align-end {
    align-items: flex-start;
    text-align: left;
  }
}

.markdown-body {
  background: none;
  width: 100%;
  min-width: 0;
  flex-shrink: 1;
}

/* lightbox
   不用 backdrop-filter：它叠在持续动画的渐变背景上会造成每帧全屏模糊重算，
   低端设备会明显卡顿 */
.lightbox-overlay {
  position: fixed;
  inset: 0;
  z-index: 60;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-lg);
  background: rgba(10, 12, 16, 0.85);
  cursor: zoom-out;
}

.lightbox-image {
  max-width: 92vw;
  max-height: 92vh;
  object-fit: contain;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-lg);
}

.lightbox-enter-active,
.lightbox-leave-active {
  transition: var(--transition-fast);
}

.lightbox-enter-from,
.lightbox-leave-to {
  opacity: 0;
}
</style>
