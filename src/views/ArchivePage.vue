<script lang="ts" setup>
import { computed } from 'vue'
import { articles } from '@/utils/articleList'

// 按年份分组（articles 已按日期降序，年份天然从新到旧）
const groups = computed(() => {
  const map = new Map<string, typeof articles>()
  for (const article of articles) {
    const year = article.date.slice(0, 4)
    if (!map.has(year)) map.set(year, [])
    map.get(year)!.push(article)
  }
  return [...map.entries()]
})
</script>

<template>
  <div class="archive-page">
    <h1 class="archive-heading">归档</h1>
    <p class="archive-sub">共 {{ articles.length }} 篇文章</p>

    <section v-for="[year, list] in groups" :key="year" class="year-group">
      <h2 class="year-badge">
        {{ year }} <span class="year-count">{{ list.length }} 篇</span>
      </h2>
      <ol class="year-list">
        <li v-for="article in list" :key="article.id" class="year-item">
          <time :datetime="article.date" class="item-date">{{ article.date.slice(5) }}</time>
          <router-link :to="`/article/${article.id}`" class="item-title">
            {{ article.title }}
          </router-link>
        </li>
      </ol>
    </section>

    <p v-if="!groups.length" class="archive-empty">暂无文章</p>
  </div>
</template>

<style scoped>
.archive-page {
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
  padding: var(--spacing-lg) 0 var(--spacing-xl);
}

.archive-heading {
  font-size: 1.75rem;
  font-weight: 800;
  margin: 0;
  color: var(--dark-gray);
}

.archive-sub {
  color: var(--mid-gray);
  font-size: 0.875rem;
  margin: var(--spacing-xs) 0 var(--spacing-lg);
}

.year-group {
  margin-bottom: var(--spacing-xl);
}

.year-badge {
  display: flex;
  align-items: baseline;
  gap: var(--spacing-sm);
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--main);
  margin: 0 0 var(--spacing-sm);
  padding-left: var(--spacing-sm);
}

.year-count {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--mid-gray);
}

.year-list {
  list-style: none;
  margin: 0 0 0 var(--spacing-sm); /* 竖线右移到年份文字正下方 */
  padding: 0 0 0 var(--spacing-sm);
  border-left: 2px solid var(--light-gray);
}

.year-item {
  position: relative;
  display: flex;
  align-items: baseline;
  gap: var(--spacing);
  padding: 0.45rem 0;
}

/* 圆点精确骑在竖线上：线占 ol 左缘 0-2px，li 内容从 10px 起，
   圆点宽 6px，中心对齐线中心需 left = 1 - 3 - 10 = -12px */
.year-item::before {
  content: '';
  position: absolute;
  left: -12px;
  top: 50%;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--main);
  transform: translateY(-50%);
}

.item-date {
  color: var(--mid-gray);
  font-size: 0.8125rem;
  font-weight: 600;
  flex-shrink: 0;
  font-variant-numeric: tabular-nums;
}

.item-title {
  color: var(--dark-gray);
  font-size: 0.9375rem;
  text-decoration: none;
  transition: var(--transition-fast);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item-title:hover {
  color: var(--main);
}

@media (max-width: 640px) {
  .item-title {
    white-space: normal;
  }
}

.archive-empty {
  text-align: center;
  color: var(--mid-gray);
  padding: var(--spacing-xl) 0;
}
</style>
