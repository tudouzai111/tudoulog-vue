<script setup lang="ts">
import { useLoadingBar } from '@/utils/useLoadingBar'
const { isLoading, isDone } = useLoadingBar()
</script>

<template>
  <div class="loading-bar" :class="{ active: isLoading, done: isDone }" />
</template>

<style scoped>
.loading-bar {
  position: fixed;
  top: 0;
  left: 0;
  height: 3px;
  width: 0;
  background: var(--main);
  z-index: 9999;
  opacity: 0;
  /* 基础态只过渡 opacity，隐藏时 width 瞬间归零再淡出 */
  transition: opacity 0.3s;
}
.loading-bar.active {
  opacity: 1;
  animation: loading 2s ease-in-out infinite; /* 加载中 0→90% 无限滑动 */
}
.loading-bar.done {
  width: 100%;
  animation: none;
  /* 完成态：宽度平滑过渡到 100%，随后复位淡出 */
  transition:
    width 0.3s ease,
    opacity 0.3s ease;
}
@keyframes loading {
  0% {
    width: 0;
  }
  100% {
    width: 90%;
  }
}
</style>
