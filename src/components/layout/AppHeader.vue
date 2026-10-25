<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useColorMode } from '@/composables/useColorMode'
import { useSearchModal } from '@/composables/useSearchModal'
import { COLOR_MODE_LABELS } from '@/constants/colorMode'

const { colorMode, cycleMode } = useColorMode()
const { open: openSearch } = useSearchModal()

const menuOpen = ref(false)
const rootRef = ref<HTMLElement | null>(null)

const themeLabel = computed(
  () => `主题：${COLOR_MODE_LABELS[colorMode.value]}（点击切换）`,
)

function toggleMenu() {
  menuOpen.value = !menuOpen.value
}

function openSearchFromMenu() {
  menuOpen.value = false
  openSearch()
}

// 点击菜单外部时收起
function onDocumentClick(event: MouseEvent) {
  if (menuOpen.value && rootRef.value && !rootRef.value.contains(event.target as Node)) {
    menuOpen.value = false
  }
}

function onDocumentKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') menuOpen.value = false
}

onMounted(() => {
  document.addEventListener('click', onDocumentClick)
  document.addEventListener('keydown', onDocumentKeydown)
})

onUnmounted(() => {
  document.removeEventListener('click', onDocumentClick)
  document.removeEventListener('keydown', onDocumentKeydown)
})
</script>

<template>
  <div ref="rootRef" class="header-component">
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
          :aria-expanded="menuOpen"
          aria-label="更多功能"
          class="icon-btn"
          title="更多功能"
          type="button"
          @click="toggleMenu"
        >
          <svg
            aria-hidden="true"
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-width="2"
            viewBox="0 0 24 24"
          >
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>

        <!-- 下拉菜单 -->
        <Transition name="menu-pop">
          <div v-if="menuOpen" class="menu-panel" role="menu">
            <button class="menu-item" role="menuitem" type="button" @click="openSearchFromMenu">
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
              <span class="menu-item-label">搜索</span>
              <kbd class="menu-kbd">Ctrl K</kbd>
            </button>

            <button
              :title="themeLabel"
              class="menu-item"
              role="menuitem"
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
              <span class="menu-item-label">{{ COLOR_MODE_LABELS[colorMode] }}</span>
            </button>
          </div>
        </Transition>
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
  position: relative;
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

/* 下拉菜单 */
.menu-panel {
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  min-width: 200px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: var(--spacing-xs);
  background: var(--md-background);
  backdrop-filter: blur(20px);
  border: var(--border);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-hover);
  z-index: 45;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: 0.5rem var(--spacing-sm);
  border: none;
  border-radius: var(--border-radius-sm);
  background: transparent;
  color: var(--dark-gray);
  font-size: 0.875rem;
  font-family: inherit;
  text-align: left;
  cursor: pointer;
  transition: var(--transition-fast);
}

.menu-item:hover {
  background: var(--off-white);
  color: var(--dark-gray);
}

.menu-item:focus-visible {
  outline: 2px solid var(--main);
  outline-offset: -2px;
}

.menu-item svg {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  color: var(--mid-gray);
}

.menu-item-label {
  flex: 1;
}

.menu-kbd {
  font-size: 0.6875rem;
  color: var(--mid-gray);
  border: 1px solid var(--light-gray);
  border-radius: 5px;
  padding: 1px 5px;
}

/* 菜单弹出动画 */
.menu-pop-enter-active,
.menu-pop-leave-active {
  transition: var(--transition-fast);
}

.menu-pop-enter-from,
.menu-pop-leave-to {
  opacity: 0;
  transform: translateY(-6px) scale(0.98);
}
</style>
