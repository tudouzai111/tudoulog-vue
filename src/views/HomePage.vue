<script lang="ts" setup>
import { inject, onMounted, onUnmounted, ref, type Ref } from 'vue'
import { useRouter } from 'vue-router'
import { type Theme, THEMES } from '@/constants/theme.ts'
import { articles } from '@/utils/articleList'
import CardComponent from '@/components/CardComponent.vue'
import TagComponent from '@/components/TagComponent.vue'
import { TAG_MODE } from '@/constants/tagMode.ts'
import { useArticleStats } from '@/composables/useArticleStats'
import { SOCIAL_LINKS } from '@/constants/social.ts'

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

// 打字机副标题：想换签名就改这个数组
const PHRASES = ['爱折腾的前端小白', '工具软件收藏家', '踩坑记录员', 'Cloudflare 重度用户']
const typedText = ref('')
let typeTimer: ReturnType<typeof setTimeout> | null = null

onMounted(() => {
  // 用户偏好减弱动效时，静态显示第一句
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    typedText.value = PHRASES[0]!
    return
  }
  let phraseIndex = 0
  let charIndex = 0
  let deleting = false

  const tick = () => {
    const phrase = PHRASES[phraseIndex]!
    if (!deleting) {
      charIndex++
      typedText.value = phrase.slice(0, charIndex)
      if (charIndex === phrase.length) {
        deleting = true
        typeTimer = setTimeout(tick, 1800) // 打完停留
        return
      }
      typeTimer = setTimeout(tick, 110)
    } else {
      charIndex--
      typedText.value = phrase.slice(0, charIndex)
      if (charIndex === 0) {
        deleting = false
        phraseIndex = (phraseIndex + 1) % PHRASES.length
        typeTimer = setTimeout(tick, 400) // 删完停顿
        return
      }
      typeTimer = setTimeout(tick, 45)
    }
  }
  typeTimer = setTimeout(tick, 500)
})

onUnmounted(() => {
  if (typeTimer) clearTimeout(typeTimer)
})

const goToListWithTag = (tag: string) => {
  router.push({ path: '/article', query: { tags: tag } })
}
</script>

<template>
  <div class="home">
    <section class="hero">
      <div class="hero-content">
        <h1 class="hero-title">土豆仔</h1>
        <p class="hero-subtitle" aria-label="个人签名">
          <span>{{ typedText }}</span>
          <span aria-hidden="true" class="type-caret">|</span>
        </p>
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

        <div class="social-row">
          <a
            v-for="link in SOCIAL_LINKS"
            :key="link.name"
            :aria-label="link.name"
            :href="link.url"
            :rel="link.external ? 'noopener' : undefined"
            :target="link.external ? '_blank' : undefined"
            class="social-link"
            :title="link.name"
          >
            <svg
              aria-hidden="true"
              :fill="link.filled ? 'currentColor' : 'none'"
              :stroke="link.filled ? 'none' : 'currentColor'"
              stroke-linecap="round"
              stroke-linejoin="round"
              :stroke-width="link.filled ? 0 : 2"
              viewBox="0 0 24 24"
            >
              <path :d="link.icon" />
            </svg>
          </a>
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
  min-height: 1.7em; /* 打字机文字长短变化时防止布局跳动 */
}

.type-caret {
  color: var(--main);
  animation: caret-blink 1s step-end infinite;
  margin-left: 1px;
}

@keyframes caret-blink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
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

.social-row {
  display: flex;
  gap: var(--spacing-sm);
  justify-content: center;
  margin-top: 0.25rem;
}

.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  border: var(--border);
  background: var(--off-white);
  color: var(--mid-gray);
  transition: var(--transition);
}

.social-link:hover {
  background: var(--main);
  border-color: var(--main);
  color: #fff;
  transform: translateY(-3px);
  box-shadow: var(--shadow-main);
}

.social-link svg {
  width: 19px;
  height: 19px;
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
