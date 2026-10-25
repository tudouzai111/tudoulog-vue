<script lang="ts" setup>
import { computed, nextTick, ref, watch } from 'vue'
import { articles } from '@/utils/articleList'
import CardComponent from '@/components/CardComponent.vue'
import TagComponent from '@/components/TagComponent.vue'
import { useArticleStats } from '@/composables/useArticleStats'
import '@/styles/article-common.css'
import '@/styles/tag-common.css'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// 搜索
const searchQuery = ref('')

const clearSearch = () => {
  searchQuery.value = ''
  nextTick(() => {
    document.getElementById('search-input')?.focus()
  })
}

// 标签筛选
const selectedTags = ref<string[]>([])
watch(
  () => route.query.tags,
  (tags) => {
    if (tags) {
      if (typeof tags === 'string') {
        selectedTags.value = tags.split(',').filter((tag) => tag.trim().length > 0)
      }
    }
  },
  { immediate: true },
)
const removeTag = (tag: string) => {
  const index = selectedTags.value.indexOf(tag)
  if (index !== -1) {
    selectedTags.value.splice(index, 1)
  }
}
const clearTags = () => {
  selectedTags.value = []
}

// 筛选文章列表
const filteredArticles = computed(() => {
  return articles.filter((a) => {
    const matchTags =
      selectedTags.value.length === 0 ||
      (a.tags && selectedTags.value.every((tag) => a.tags.includes(tag)))

    const query = searchQuery.value.trim().toLowerCase()
    const matchSearch =
      query === '' ||
      a.title.toLowerCase().includes(query) ||
      a.excerpt?.toLowerCase().includes(query) ||
      a.tags?.some((tag) => tag.toLowerCase().includes(query))

    return matchTags && matchSearch
  })
})

// 分页
const currentPage = ref(1)
// 一页最多显示几个
const pageSize = ref(10)
// 总共几页
const totalPages = computed(() => Math.ceil(filteredArticles.value.length / pageSize.value))
// 当前页显示的文章
const showArticles = computed(() => {
  const startArticle = (currentPage.value - 1) * pageSize.value
  const endArticle = startArticle + pageSize.value
  return filteredArticles.value.slice(startArticle, endArticle)
})

// 列表卡片的浏览量/点赞（D1 未配置时自动隐藏）
const { statsMap, loadStats } = useArticleStats()
watch(
  showArticles,
  (list) => void loadStats(list.map((a) => a.id)),
  { immediate: true },
)
// 当筛选或搜索导致过滤的文章列表变化时，重置当前页为第一页
// 筛选标签后清除url的page参数
watch(filteredArticles, () => {
  currentPage.value = 1
  const query: Record<string, string> = {}
  if (selectedTags.value.length > 0) {
    query.tags = selectedTags.value.join(',')
  }
  router.replace({ query })
})
// 页面输入跳转
const inputPageNum = ref('')
// 分页按钮显示逻辑：始终包含首末页和当前页，间隔用省略号占位
type PageItem = number | '...'
const showPageBtn = computed<PageItem[]>(() => {
  const total = totalPages.value
  const current = currentPage.value
  // 页数不多时全部展示
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)

  const wanted = new Set([1, total, current - 1, current, current + 1])
  const pages = [...wanted].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b)

  const result: PageItem[] = []
  let prev = 0
  for (const p of pages) {
    if (p - prev > 1) result.push('...')
    result.push(p)
    prev = p
  }
  return result
})
// 切换页面
const goToPage = (n: number) => {
  router.replace({ query: { ...route.query, page: n } })
}
// 切换页码后页面回到最顶端
watch(currentPage, () => {
  nextTick(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' }) // 平滑滚动
  })
})
// 切换页码后修改currentPage值
watch(
  () => route.query.page,
  (page) => {
    const n = Number(page)
    currentPage.value = !isNaN(n) && n >= 1 ? Math.min(n, totalPages.value) : 1
  },
  { immediate: true },
)
</script>

<template>
  <div class="article-page">
    <!--  搜索  -->
    <div class="search">
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
        id="search-input"
        v-model="searchQuery"
        aria-label="搜索文章"
        class="search-input"
        placeholder="搜索文章..."
        type="text"
      />
      <button v-if="searchQuery" aria-label="清空搜索" class="clear-btn" @click="clearSearch">
        ✕
      </button>
    </div>
    <!--  标签筛选  -->
    <div class="tag-bar">
      <div class="selected-tag-container">
        <span class="tag-bar-info">
          {{ selectedTags.length > 0 ? '标签：' : '点击文章标签进行筛选' }}
        </span>
        <TransitionGroup class="selected-tags" name="tag" tag="span">
          <button
            v-for="tag in selectedTags"
            :key="tag"
            :aria-label="tag"
            class="selected-tag"
            type="button"
            @click.stop="removeTag(tag)"
          >
            {{ tag }}
          </button>
        </TransitionGroup>
      </div>
      <button
        v-show="selectedTags.length > 0"
        aria-label="清除筛选"
        class="clear-all-btn"
        type="button"
        @click="clearTags"
      >
        清除全部
      </button>
    </div>

    <!--  文章列表  -->
    <transition-group
      v-if="showArticles.length > 0"
      appear
      class="article-list"
      name="list"
      tag="div"
    >
      <router-link v-for="article in showArticles" :key="article.id" :to="`/article/${article.id}`">
        <CardComponent :card="article" :stats="statsMap[article.id] ?? null">
          <template #tags>
            <TagComponent v-model="selectedTags" :tags="article.tags || []" />
          </template>
        </CardComponent>
      </router-link>
    </transition-group>
    <div v-else class="article-empty">
      <h1>暂无文章</h1>
    </div>
    <!--  分页  -->
    <nav v-if="filteredArticles.length > 0 && totalPages > 1" aria-label="分页导航" class="page">
      <button
        :class="currentPage === 1 ? 'page-btn-disabled' : 'page-btn'"
        :disabled="currentPage === 1"
        aria-label="上一页"
        type="button"
        @click="goToPage(--currentPage)"
      >
        上一页
      </button>
      <template v-for="(item, index) in showPageBtn" :key="index">
        <span v-if="item === '...'" aria-hidden="true" class="page-ellipsis">…</span>
        <button
          v-else
          :class="item === currentPage ? 'page-btn-active' : 'page-btn'"
          class="page-btn"
          type="button"
          @click="goToPage(item)"
        >
          {{ item }}
        </button>
      </template>
      <button
        :class="currentPage === totalPages ? 'page-btn-disabled' : 'page-btn'"
        :disabled="currentPage === totalPages"
        aria-label="下一页"
        type="button"
        @click="goToPage(++currentPage)"
      >
        下一页
      </button>
      <!--   页面输入回车跳转   -->
      <input
        v-if="totalPages > 3"
        v-model="inputPageNum"
        aria-label="输入页码"
        class="page-input"
        inputmode="numeric"
        placeholder="Go"
        type="text"
        @keyup.enter="goToPage(Number(inputPageNum))"
      />
    </nav>

    <div v-if="filteredArticles.length > 0" class="result-stats">
      共 {{ filteredArticles.length }} 篇文章
      <span v-if="totalPages > 1">，第 {{ currentPage }} / {{ totalPages }} 页</span>
    </div>
  </div>
</template>

<style scoped>
/* 搜索 */
.search {
  position: relative;
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  width: 100%;
  background: var(--off-white);
  padding: var(--spacing-sm);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  border: var(--border);
  transition: var(--transition);
}

.search:focus-within {
  box-shadow: var(--shadow-hover);
}

.search-icon {
  width: 20px;
  height: 20px;
  color: var(--mid-gray);
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  color: var(--dark-gray);
  font-size: 1rem;
  padding: 0.25rem;
}

.search-input::placeholder {
  color: var(--mid-gray);
}

.clear-btn {
  background: none;
  border: none;
  color: var(--mid-gray);
  cursor: pointer;
  padding: 0.25rem;
  font-size: 1rem;
  line-height: 1;
  transition: var(--transition-fast);
}

.clear-btn:hover {
  color: var(--dark-gray);
}

/* 标签栏 */
.tag-bar {
  width: 100%;
  height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm);
  border-radius: var(--border-radius);
  background-color: var(--off-white);
  box-shadow: var(--shadow);
  border: var(--border);
  transition: var(--transition);
}

.tag-bar:hover {
  box-shadow: var(--shadow-hover);
}

.tag-bar-info {
  padding-left: 0.5rem;
  color: var(--mid-gray);
}

.selected-tag-container {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
}

.selected-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
}

.clear-all-btn {
  height: 32px;
  padding-right: 0.5rem;
  background: none;
  border: none;
  color: var(--mid-gray);
  cursor: pointer;
  transition: var(--transition);
}

.clear-all-btn:hover {
  color: var(--dark-gray);
}

/* 文章列表 */
.article-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  width: 100%;
}

.article-list a {
  display: block;
  text-decoration: none;
}

/* 分页 */
.page {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.5rem;
  border-radius: 12px;
  background-color: var(--off-white);
  box-shadow: var(--shadow);
  gap: 0.5rem;
}

.page-btn,
.page-btn-disabled,
.page-btn-active,
.page-input {
  height: 36px;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  color: var(--dark-gray);
  background: var(--white);
  font-size: 14px;
  transition: var(--transition);
}

.page-btn-disabled {
  opacity: 0.5;
}

.page-btn-active,
.page-btn:hover {
  background: var(--main);
  box-shadow: var(--shadow-main);
  color: #fff;
}

.page-btn:hover {
  cursor: pointer;
}

.page-input {
  outline: none;
  padding: 0.5rem;
  width: 40px;
  text-align: center;
}

.page-ellipsis {
  color: var(--mid-gray);
  padding: 0 2px;
  user-select: none;
}

/* 结果统计 */
.result-stats {
  text-align: center;
  font-size: 0.875rem;
  color: var(--mid-gray);
}
</style>
