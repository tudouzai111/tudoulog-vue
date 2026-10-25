<script lang="ts" setup>
import { onMounted, ref } from 'vue'

const props = defineProps<{ slug: string }>()

// 接口不可用（D1 未配置/构建未部署）时整个组件保持隐藏
const available = ref(false)
const views = ref(0)
const likes = ref(0)
const liked = ref(false)

const LIKE_KEY = `liked:${props.slug}`
const VIEW_KEY = `viewed:${props.slug}`

async function fetchStats() {
  const res = await fetch(`/api/stats?slug=${encodeURIComponent(props.slug)}`)
  if (!res.ok) throw new Error(String(res.status))
  return (await res.json()) as { views: number; likes: number }
}

async function sendAction(action: 'view' | 'like') {
  const res = await fetch('/api/stats', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ slug: props.slug, action }),
  })
  if (!res.ok) throw new Error(String(res.status))
  return (await res.json()) as { views: number; likes: number }
}

// 查询失败自动重试（瞬时网络抖动会导致统计闪没）
async function fetchWithRetry() {
  let lastError: unknown
  for (let i = 0; i < 3; i++) {
    try {
      return await fetchStats()
    } catch (error) {
      lastError = error
      await new Promise((resolve) => setTimeout(resolve, 800 * (i + 1)))
    }
  }
  throw lastError
}

onMounted(async () => {
  try {
    const stats = await fetchWithRetry()
    views.value = stats.views
    likes.value = stats.likes
    available.value = true
    liked.value = localStorage.getItem(LIKE_KEY) === '1'
  } catch {
    available.value = false
    return
  }

  // 浏览计数失败只影响计数，不隐藏整个组件
  if (sessionStorage.getItem(VIEW_KEY) !== '1') {
    sessionStorage.setItem(VIEW_KEY, '1')
    try {
      const after = await sendAction('view')
      views.value = after.views
    } catch {
      // 忽略
    }
  }
})

async function like() {
  if (liked.value) return
  liked.value = true
  localStorage.setItem(LIKE_KEY, '1')
  likes.value += 1 // 乐观更新
  try {
    const after = await sendAction('like')
    views.value = after.views
    likes.value = after.likes
  } catch {
    liked.value = false
    localStorage.removeItem(LIKE_KEY)
    likes.value -= 1
  }
}
</script>

<template>
  <span v-if="available" class="article-interactions">
    <span class="interaction-item" title="浏览量">
      <svg
        aria-hidden="true"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        viewBox="0 0 24 24"
      >
        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
      {{ views }}
    </span>
    <button
      :class="{ liked }"
      aria-label="点赞"
      class="interaction-item like-btn"
      type="button"
      @click="like"
    >
      <svg
        aria-hidden="true"
        :fill="liked ? 'currentColor' : 'none'"
        stroke="currentColor"
        stroke-width="2"
        viewBox="0 0 24 24"
      >
        <path
          d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
        />
      </svg>
      {{ likes }}
    </button>
  </span>
</template>

<style scoped>
.article-interactions {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  color: var(--mid-gray);
  font-size: 0.8125rem;
}

.interaction-item {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.interaction-item svg {
  width: 15px;
  height: 15px;
}

.like-btn {
  border: none;
  background: none;
  padding: 2px 4px;
  border-radius: 6px;
  cursor: pointer;
  font: inherit;
  color: inherit;
  transition: var(--transition-fast);
}

.like-btn:hover {
  color: var(--pink);
  background: color-mix(in srgb, var(--pink) 12%, transparent);
}

.like-btn.liked {
  color: var(--pink);
  font-weight: 600;
}
</style>
