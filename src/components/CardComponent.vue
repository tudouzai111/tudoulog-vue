<script lang="ts" setup>
import type { Card } from '@/types'

defineProps<{
  card: Card
  stats?: { views: number; likes: number } | null
}>()
</script>

<template>
  <article class="article-card" :class="{ 'no-cover': !card.coverImage }">
    <!-- 左侧封面：仅在有封面时显示 -->
    <div v-if="card.coverImage" class="cover-wrapper">
      <img :alt="card.title" :src="card.coverImage" class="article-cover" loading="lazy" />
    </div>

    <!-- 右侧内容 -->
    <div class="card-content">
      <h2 class="article-title">{{ card.title }}</h2>
      <p v-if="card.excerpt" class="article-excerpt">{{ card.excerpt }}</p>
      <footer class="card-footer">
        <div class="card-meta">
          <time v-if="card.date" :datetime="card.date" class="article-time">{{ card.date }}</time>
          <span v-if="stats" class="card-stats">
            <span class="stat" title="浏览量">
              <svg aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              {{ stats.views }}
            </span>
            <span class="stat" title="点赞">
              <svg aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path
                  d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                />
              </svg>
              {{ stats.likes }}
            </span>
          </span>
        </div>
        <slot name="tags" />
      </footer>
    </div>
  </article>
</template>

<style scoped>
.article-card {
  display: flex;
  flex-direction: row;
  text-decoration: none;
  border-radius: var(--border-radius);
  background-color: var(--off-white);
  box-shadow: var(--shadow);
  border: 1px solid var(--light-gray);
  overflow: hidden;
  transition: var(--transition);
  height: 160px; /* 有封面时固定高度 */
}

/* 无封面：纯文字卡片，高度自适应 */
.article-card.no-cover {
  height: auto;
}

.article-card:hover {
  box-shadow: var(--shadow-hover);
  transform: translateY(-2px);
}

/* 左侧封面区域 */
.cover-wrapper {
  position: relative;
  width: 240px; /* 固定宽度 */
  height: 100%;
  flex-shrink: 0; /* 防止被压缩 */
  overflow: hidden;
  background: var(--light-gray);
}

.article-cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  transition: var(--transition-slow);
}

.article-card:hover .article-cover {
  transform: scale(1.05); /* 悬停时轻微放大 */
}

/* 右侧内容区域 */
.card-content {
  flex: 1; /* 占据剩余空间 */
  padding: var(--spacing);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  min-width: 0; /* 防止 flex 子项溢出 */
}

.article-title {
  color: var(--dark-gray);
  font-size: 1.125rem;
  font-weight: 700;
  margin: 0;
  line-height: 1.4;
  /* 单行省略，节省空间 */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.article-excerpt {
  color: var(--mid-gray);
  font-size: 0.875rem;
  line-height: 1.6;
  margin: 0;
  /* 限制两行 */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex: 1; /* 占据中间空间 */
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-sm);
  margin-top: auto;
  padding-top: var(--spacing-sm);
  border-top: 1px solid var(--light-gray);
}

.card-meta {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  min-width: 0;
}

.card-stats {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  color: var(--mid-gray);
  font-size: 0.75rem;
  font-weight: 600;
}

.card-stats .stat {
  display: inline-flex;
  align-items: center;
  gap: 3px;
}

.card-stats .stat svg {
  width: 13px;
  height: 13px;
}

.article-time {
  color: var(--mid-gray);
  font-size: 0.75rem;
  font-weight: 600;
  flex-shrink: 0;
}

/* 响应式：小屏幕时恢复上下布局 */
@media (max-width: 640px) {
  .article-card {
    flex-direction: column;
    height: auto;
  }

  .cover-wrapper {
    width: 100%;
    height: 180px;
  }

  .article-title {
    white-space: normal;
    -webkit-line-clamp: 2;
    display: -webkit-box;
    -webkit-box-orient: vertical;
  }

  .card-footer {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-xs);
  }
}
</style>
