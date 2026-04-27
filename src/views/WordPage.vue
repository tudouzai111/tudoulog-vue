<script lang="ts" setup>
const words = [
  {
    word: '你好',
    data: '2026-4-27',
  },
]
</script>

<template>
  <TransitionGroup appear class="word-page" name="list" tag="div">
    <section
      v-for="(word, index) in words"
      :key="index"
      :style="{ '--delay': index * 0.1 + 's' }"
      class="word-card"
    >
      <p class="word-content">{{ word.word }}</p>
      <time class="word-time">{{ word.data }}</time>
    </section>
  </TransitionGroup>
</template>

<style scoped>
.word-page {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  max-width: 800px;
  margin: 0 auto;
}
.word-card {
  background: var(--off-white);
  border-radius: var(--border-radius);
  padding: var(--spacing);
  border: var(--border);
  box-shadow: var(--shadow);
  transition: var(--transition);
}
.word-content {
  font-size: 1.125rem;
  line-height: 1.4;
  color: var(--dark-gray);
  margin: 0;
}
.word-time {
  color: var(--mid-gray);
  font-size: 0.75rem;
  font-weight: 600;
  flex-shrink: 0;
  margin-top: auto;
  padding-top: var(--spacing-sm);
}
</style>
