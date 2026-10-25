<script lang="ts" setup>
import { computed } from 'vue'
import { useColorMode } from '@/composables/useColorMode'
import { useSearchModal } from '@/composables/useSearchModal'
import { COLOR_MODE_LABELS } from '@/constants/colorMode'

const { colorMode, cycleMode } = useColorMode()
const { open: openSearch } = useSearchModal()

const toggleTitle = computed(() => {
  const current = COLOR_MODE_LABELS[colorMode.value]
  const next =
    COLOR_MODE_LABELS[
      colorMode.value === 'light' ? 'dark' : colorMode.value === 'dark' ? 'auto' : 'light'
    ]
  return `当前：${current}，点击切换到${next}`
})
</script>

<template>
  <div class="header-component">
    <div class="header">
      <nav aria-label="主导航" class="nav">
        <router-link class="nav-item" exact-active-class="nav-item-active" to="/">
          首页
        </router-link>
        <router-link active-class="nav-item-active" class="nav-item" to="/article">
          文章
        </router-link>
        <router-link active-class="nav-item-active" class="nav-item" to="/word"> 废话 </router-link>
        <router-link active-class="nav-item-active" class="nav-item" to="/about">
          关于
        </router-link>
        <button
          aria-label="全文搜索（Ctrl + K）"
          class="icon-btn"
          title="全文搜索（Ctrl + K）"
          type="button"
          @click="openSearch"
        >
          <svg
            aria-hidden="true"
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-width="2"
            viewBox="0 0 24 24"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
        </button>
        <button
          :aria-label="toggleTitle"
          :title="toggleTitle"
          class="icon-btn"
          type="button"
          @click="cycleMode"
        >
          <!-- 浅色：太阳 -->
          <svg
            v-if="colorMode === 'light'"
            aria-hidden="true"
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-width="2"
            viewBox="0 0 24 24"
          >
            <circle cx="12" cy="12" r="4" />
            <path
              d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
            />
          </svg>
          <!-- 深色：月亮 -->
          <svg
            v-else-if="colorMode === 'dark'"
            aria-hidden="true"
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            viewBox="0 0 24 24"
          >
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
          <!-- 跟随系统：显示器 -->
          <svg
            v-else
            aria-hidden="true"
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            viewBox="0 0 24 24"
          >
            <rect height="12" rx="2" width="18" x="3" y="4" />
            <path d="M8 20h8m-4-4v4" />
            <path d="M7 9.5 9 8l2 1.5L13 8l2 1.5" />
          </svg>
        </button>
      </nav>
    </div>
  </div>
</template>

<style scoped>
.header-component {
  width: 100%;
  display: flex;
  justify-content: center;
  padding: var(--spacing-sm);
  position: sticky;
  top: 0;
  z-index: 40;
}

.header {
  padding: var(--spacing-sm);
  background: var(--off-white);
  backdrop-filter: blur(20px);
  border-radius: var(--border-radius);
  display: flex;
  justify-content: center;
  box-shadow: var(--shadow);
  border: var(--border);
}

.nav {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  gap: var(--spacing-sm);
}

.nav-item {
  background: var(--white);
  color: var(--dark-gray);
  text-decoration: none;
  border: none;
  padding: 0.25rem 1rem;
  text-align: center;
  border-radius: var(--border-radius-sm);
  transition: var(--transition);
}

.nav-item:hover {
  cursor: pointer;
  background: color-mix(in oklch, var(--main) 80%, white);
  color: #fff;
  font-weight: bold;
}

.nav-item:focus-visible {
  outline: 2px solid var(--main);
  outline-offset: 2px;
}

.nav-item-active {
  background: var(--main) !important;
  color: #fff !important;
  box-shadow: var(--shadow-main);
  font-weight: bold;
}

.icon-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  padding: 0;
  background: var(--white);
  color: var(--dark-gray);
  border: none;
  border-radius: var(--border-radius-sm);
  cursor: pointer;
  transition: var(--transition);
}

.icon-btn:hover {
  background: var(--light-gray);
}

.icon-btn:focus-visible {
  outline: 2px solid var(--main);
  outline-offset: 2px;
}

.icon-btn svg {
  width: 18px;
  height: 18px;
}
</style>
