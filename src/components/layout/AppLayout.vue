<script lang="ts" setup>
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import LoadingBar from '@/components/LoadingBar.vue'
</script>

<template>
  <div class="layout">
    <LoadingBar />
    <AppHeader />
    <main class="main-content">
      <router-view v-slot="{ Component }">
        <transition appear mode="out-in" name="page">
          <component :is="Component" :key="$route.path" />
        </transition>
      </router-view>
    </main>
    <AppFooter />
  </div>
</template>

<style scoped>
.layout {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
}

.main-content {
  padding: 0 var(--spacing-sm);
  width: 100%;
  flex: 1;
}
</style>
