<script setup lang="ts">
import { useLoadingBar } from '@/utils/useLoadingBar'
const { isLoading } = useLoadingBar()
</script>

<template>
  <div class="loading-bar" :class="{ active: isLoading }" />
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
  transition: opacity 0.2s;
}
.loading-bar.active {
  opacity: 1;
  animation: loading 2s ease-in-out infinite; /* 0→90% 无限滑动 */
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
