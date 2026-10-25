<script lang="ts" setup>
import { inject, onMounted, onUnmounted, ref, type Ref } from 'vue'
import { type Theme, THEMES } from '@/constants/theme.ts'

const baseUrl = import.meta.env.BASE_URL

// 注入主题
const { activeTheme, setTheme } = inject('theme') as {
  activeTheme: Ref<Theme>
  setTheme: (theme: Theme) => void
}

// 打字机签名：想换就改这个数组
const PHRASES = ['这里是土豆博客', '一个纯静态个人博客', '这是一段文字', '这是一个打字机效果']
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
      </div>
    </section>
  </div>
</template>

<style scoped>
.home {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 80px); /* 一屏铺满（顶栏约占 80px） */
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
  margin-top: 0.25rem;
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
</style>
