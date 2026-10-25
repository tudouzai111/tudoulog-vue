<script lang="ts" setup>
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { useColorMode } from '@/composables/useColorMode'
import { GISCUS, GISCUS_CONFIGURED } from '@/constants/giscus'

const { resolvedMode } = useColorMode()
const container = ref<HTMLElement | null>(null)
const mounted = ref(false)

function giscusTheme(): string {
  return resolvedMode.value === 'dark' ? 'dark' : 'light'
}

// 把脚本注入容器；重复调用前先清空，用于主题切换时重建
function mountGiscus() {
  if (!container.value || !GISCUS_CONFIGURED) return
  container.value.innerHTML = ''

  const script = document.createElement('script')
  script.src = 'https://giscus.app/client.js'
  script.async = true
  script.crossOrigin = 'anonymous'
  script.dataset.repo = GISCUS.repo
  script.dataset.repoId = GISCUS.repoId
  script.dataset.category = GISCUS.category
  script.dataset.categoryId = GISCUS.categoryId
  script.dataset.mapping = GISCUS.mapping
  script.dataset.strict = '0'
  script.dataset.reactionsEnabled = '1'
  script.dataset.emitMetadata = '0'
  script.dataset.inputPosition = 'top'
  script.dataset.theme = giscusTheme()
  script.dataset.lang = GISCUS.lang
  script.dataset.loading = 'lazy'
  container.value.appendChild(script)
}

// 已挂载后切换深浅色：通过 postMessage 让 giscus 热切换主题，无需重建
function updateTheme() {
  const iframe = document.querySelector<HTMLIFrameElement>('iframe.giscus-frame')
  iframe?.contentWindow?.postMessage(
    { giscus: { setConfig: { theme: giscusTheme() } } },
    'https://giscus.app',
  )
}

watch(resolvedMode, () => {
  if (mounted.value) updateTheme()
})

// 进入视口再加载，避免拖慢首屏
let observer: IntersectionObserver | null = null

onMounted(() => {
  if (!GISCUS_CONFIGURED) return
  observer = new IntersectionObserver(
    (entries) => {
      if (entries.some((e) => e.isIntersecting) && !mounted.value) {
        mounted.value = true
        mountGiscus()
        observer?.disconnect()
      }
    },
    { rootMargin: '200px' },
  )
  if (container.value) observer.observe(container.value)
})

onUnmounted(() => observer?.disconnect())
</script>

<template>
  <section v-if="GISCUS_CONFIGURED" aria-label="评论区" class="giscus-comments">
    <h3 class="giscus-title">评论</h3>
    <div ref="container" class="giscus-container" />
  </section>
</template>

<style scoped>
.giscus-comments {
  padding: var(--spacing) var(--spacing-lg) var(--spacing-lg);
  border-top: 1px solid var(--light-gray);
}

.giscus-title {
  margin: 0 0 var(--spacing-sm);
  font-size: 1rem;
  color: var(--dark-gray);
}

.giscus-container :deep(.giscus) {
  max-width: 100%;
}
</style>
