<script lang="ts" setup>
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useSearchModal } from '@/composables/useSearchModal'

const router = useRouter()
const { isOpen, close, toggle } = useSearchModal()

const query = ref('')
const results = ref<SearchResult[]>([])
const searching = ref(false)
const activeIndex = ref(-1)
const inputRef = ref<HTMLInputElement | null>(null)
const listRef = ref<HTMLElement | null>(null)

interface SearchResult {
  url: string
  title: string
  date?: string
  excerpt: string
}

// Pagefind 的 JS API 在构建完成后才存在于 dist/pagefind/，
// 因此运行时动态加载（@vite-ignore 阻止 vite 在构建期解析这个路径）
interface PagefindInstance {
  search: (q: string) => Promise<{ results: PagefindResult[] }>
}

let pagefindInstance: PagefindInstance | null = null

interface PagefindResult {
  data: () => Promise<{
    url: string
    meta: Record<string, string>
    excerpt: string
  }>
}

async function loadPagefind(): Promise<PagefindInstance> {
  if (!pagefindInstance) {
    const url = '/pagefind/pagefind.js'
    pagefindInstance = (await import(/* @vite-ignore */ url)) as PagefindInstance
  }
  return pagefindInstance
}

// 索引页 URL 映射回真实路由：/_index/<id>.html → /article/<id>
function toRealUrl(indexUrl: string): string {
  return indexUrl.replace(/^\/_index\//, '/article/').replace(/\.html$/, '')
}

let searchTimer: ReturnType<typeof setTimeout> | null = null

watch(query, (q) => {
  if (searchTimer) clearTimeout(searchTimer)
  if (!q.trim()) {
    results.value = []
    searching.value = false
    return
  }
  searching.value = true
  searchTimer = setTimeout(() => void runSearch(q.trim()), 250)
})

async function runSearch(q: string) {
  try {
    const pagefind = await loadPagefind()
    const res = await pagefind.search(q)
    const data = await Promise.all(res.results.slice(0, 12).map((r) => r.data()))
    results.value = data.map((d) => ({
      url: toRealUrl(d.url),
      title: d.meta?.title ?? d.url,
      date: d.meta?.date,
      excerpt: d.excerpt,
    }))
  } catch {
    results.value = []
  } finally {
    searching.value = false
    activeIndex.value = -1
  }
}

function go(result: SearchResult) {
  close()
  query.value = ''
  router.push(result.url)
}

// 打开时聚焦输入框，清空旧状态
watch(isOpen, async (open) => {
  if (open) {
    await nextTick()
    inputRef.value?.focus()
  } else {
    query.value = ''
    results.value = []
  }
})

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    close()
    return
  }
  if (!results.value.length) return
  if (event.key === 'ArrowDown') {
    event.preventDefault()
    activeIndex.value = (activeIndex.value + 1) % results.value.length
    scrollActiveIntoView()
  } else if (event.key === 'ArrowUp') {
    event.preventDefault()
    activeIndex.value = (activeIndex.value - 1 + results.value.length) % results.value.length
    scrollActiveIntoView()
  } else if (event.key === 'Enter' && activeIndex.value >= 0) {
    event.preventDefault()
    go(results.value[activeIndex.value]!)
  }
}

function scrollActiveIntoView() {
  nextTick(() => {
    listRef.value
      ?.querySelector('[data-active="true"]')
      ?.scrollIntoView({ block: 'nearest' })
  })
}

function onGlobalKeydown(event: KeyboardEvent) {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault()
    toggle()
  }
}

onMounted(() => window.addEventListener('keydown', onGlobalKeydown))
onUnmounted(() => window.removeEventListener('keydown', onGlobalKeydown))
</script>

<template>
  <Teleport to="body">
    <Transition name="search-fade">
      <div
        v-if="isOpen"
        aria-label="全文搜索"
        class="search-overlay"
        role="dialog"
        aria-modal="true"
        @click.self="close"
        @keydown="onKeydown"
      >
        <div class="search-panel">
          <div class="search-bar">
            <svg
              aria-hidden="true"
              class="search-icon"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              ref="inputRef"
              v-model="query"
              aria-label="搜索文章正文"
              autocomplete="off"
              class="search-input"
              placeholder="搜索文章正文…"
              type="text"
            />
            <kbd class="search-esc">Esc</kbd>
          </div>

          <div ref="listRef" class="search-results">
            <p v-if="!query.trim()" class="search-hint">输入关键词，全文搜索所有文章（Ctrl + K 随时唤起）</p>
            <p v-else-if="searching" class="search-hint">搜索中…</p>
            <p v-else-if="!results.length" class="search-hint">没有找到相关内容</p>
            <button
              v-for="(result, index) in results"
              :key="result.url"
              :data-active="index === activeIndex"
              :class="{ 'search-item-active': index === activeIndex }"
              class="search-item"
              type="button"
              @click="go(result)"
              @mouseenter="activeIndex = index"
            >
              <span class="search-item-title">{{ result.title }}</span>
              <span v-if="result.date" class="search-item-date">{{ result.date }}</span>
              <!-- 摘要由构建期索引生成，内容可信 -->
              <!-- eslint-disable-next-line vue/no-v-html -->
              <span class="search-item-excerpt" v-html="result.excerpt" />
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.search-overlay {
  position: fixed;
  inset: 0;
  z-index: 70;
  display: flex;
  justify-content: center;
  padding: 12vh var(--spacing) var(--spacing);
  background: rgba(10, 12, 16, 0.55);
}

.search-panel {
  width: 100%;
  max-width: 620px;
  max-height: 70vh;
  display: flex;
  flex-direction: column;
  background: var(--md-background);
  border: var(--border);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-lg);
  overflow: hidden;
}

.search-bar {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing) var(--spacing-lg);
  border-bottom: 1px solid var(--light-gray);
}

.search-icon {
  width: 18px;
  height: 18px;
  color: var(--mid-gray);
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  color: var(--dark-gray);
  font-size: 1.0625rem;
  font-family: inherit;
}

.search-esc {
  font-size: 0.6875rem;
  color: var(--mid-gray);
  border: 1px solid var(--light-gray);
  border-radius: 6px;
  padding: 2px 6px;
}

.search-results {
  overflow-y: auto;
  padding: var(--spacing-sm);
}

.search-hint {
  text-align: center;
  color: var(--mid-gray);
  font-size: 0.875rem;
  padding: var(--spacing-lg) 0;
  margin: 0;
}

.search-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
  text-align: left;
  background: transparent;
  border: none;
  border-radius: var(--border-radius-sm);
  padding: var(--spacing-sm) var(--spacing);
  cursor: pointer;
  font-family: inherit;
  color: var(--dark-gray);
}

.search-item-active {
  background: color-mix(in srgb, var(--main) 12%, transparent);
}

.search-item-title {
  font-size: 0.9375rem;
  font-weight: 600;
  display: flex;
  justify-content: space-between;
  gap: var(--spacing-sm);
}

.search-item-date {
  color: var(--mid-gray);
  font-size: 0.75rem;
  font-weight: 500;
  flex-shrink: 0;
}

.search-item-excerpt {
  font-size: 0.8125rem;
  color: var(--mid-gray);
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.search-item-excerpt :deep(mark) {
  background: color-mix(in srgb, var(--main) 30%, transparent);
  color: inherit;
  border-radius: 3px;
  padding: 0 1px;
}

.search-fade-enter-active,
.search-fade-leave-active {
  transition: var(--transition-fast);
}

.search-fade-enter-from,
.search-fade-leave-to {
  opacity: 0;
}
</style>
