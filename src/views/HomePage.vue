<script lang="ts" setup>
import { inject, onMounted, ref, type Ref } from 'vue'
import { useRouter } from 'vue-router'
import { type Theme, THEMES } from '@/constants/theme.ts'
import { articles } from '@/utils/articleList'
import CardComponent from '@/components/CardComponent.vue'
import TagComponent from '@/components/TagComponent.vue'
import { TAG_MODE } from '@/constants/tagMode.ts'
import { useArticleStats } from '@/composables/useArticleStats'

const baseUrl = import.meta.env.BASE_URL
const router = useRouter()

// 注入主题
const { activeTheme, setTheme } = inject('theme') as {
  activeTheme: Ref<Theme>
  setTheme: (theme: Theme) => void
}

// 首页展示最新的几篇文章
const LATEST_COUNT = 4
const latestArticles = ref(articles.slice(0, LATEST_COUNT))

// 卡片浏览量/点赞
const { statsMap, loadStats } = useArticleStats()
onMounted(() => void loadStats(latestArticles.value.map((a) => a.id)))

const goToListWithTag = (tag: string) => {
  router.push({ path: '/article', query: { tags: tag } })
}
</script>

<template>
  <div class="home">
    <section class="hero">
      <div class="hero-content">
        <h1 class="hero-title">土豆仔</h1>
        <p class="hero-subtitle">这是一个纯静态个人博客</p>
        <div class="hero-image-wrapper">
          <img
            :src="`${baseUrl}img/tudouzai.webp`"
            alt="土豆仔"
            class="hero-image"
            loading="eager"
          />
        </div>

        <div class="theme-picker">
          <button
            v-for="theme in THEMES"
            :key="theme"
            :aria-label="`使用${theme === 'teal' ? '青绿' : theme === 'pink' ? '粉色' : '紫色'}主题`"
            :class="[theme, { active: activeTheme === theme }]"
            class="color-dot"
            type="button"
            @click="setTheme(theme)"
          />
        </div>
      </div>
    </section>

    <section v-if="latestArticles.length" aria-labelledby="latest-title" class="latest">
      <div class="latest-header">
        <h2 id="latest-title" class="latest-title">最新文章</h2>
        <router-link class="latest-more" to="/article">查看全部 →</router-link>
      </div>
      <div class="latest-list">
        <router-link
          v-for="article in latestArticles"
          :key="article.id"
          :to="`/article/${article.id}`"
        >
          <CardComponent :card="article" :stats="statsMap[article.id] ?? null">
            <template #tags>
              <TagComponent
                :mode="TAG_MODE[1]"
                :tags="article.tags || []"
                @click-tag="goToListWithTag"
              />
            </template>
          </CardComponent>
        </router-link>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
}

.hero {
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: var(--spacing-lg);
  padding: var(--spacing-xl);
}

.hero-title {
  font-size: 3rem;
  font-weight: 800;
  margin: 0;
}

.hero-subtitle {
  font-size: 1.25rem;
  color: var(--mid-gray);
  margin: 0;
}

.hero-image-wrapper {
  position: relative;
}

.hero-image {
  margin-top: 1rem;
  width: 320px;
  height: 320px;
  object-fit: cover;
  border-radius: 12px;
  box-shadow: var(--shadow-lg);
  transition: var(--transition);
}

@media screen and (max-width: 768px) {
  .hero-title {
    font-size: 2rem;
  }

  .hero-image {
    width: 250px;
    height: 250px;
  }
}

.theme-picker {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: var(--spacing);
}

.color-dot {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  cursor: pointer;
  transition: var(--transition);
  box-shadow: var(--shadow);
  border: 2px solid transparent;
  padding: 0;
}

.color-dot.pink {
  background-color: var(--pink);
}
.color-dot.teal {
  background-color: var(--teal);
}
.color-dot.purple {
  background-color: var(--purple);
}
.color-dot:hover {
  transform: scale(1.1);
  box-shadow: var(--shadow-lg);
}

.color-dot.active {
  border-color: var(--dark-gray);
  transform: scale(1.1);
  box-shadow: var(--shadow-hover);
}

@media screen and (max-width: 768px) {
  .color-dot {
    width: 36px;
    height: 36px;
  }
}

/* 最新文章 */
.latest {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  padding-bottom: var(--spacing-lg);
}

.latest-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  padding: 0 var(--spacing-xs);
}

.latest-title {
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0;
  color: var(--dark-gray);
}

.latest-more {
  font-size: 0.875rem;
  color: var(--mid-gray);
}

.latest-more:hover {
  color: var(--main);
}

.latest-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.latest-list a {
  display: block;
  text-decoration: none;
}
</style>
