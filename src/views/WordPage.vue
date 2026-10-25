<script lang="ts" setup>
import { computed } from 'vue'
import wordsData from '@/data/words.json'

interface WordItem {
  word: string
  date: string
}

// 按日期降序，最新的在最上面
const words = computed(() =>
  [...(wordsData as WordItem[])].sort((a, b) => b.date.localeCompare(a.date)),
)
</script>

<template>
  <TransitionGroup appear class="word-page" name="list" tag="div">
    <section v-for="(word, index) in words" :key="word.date + index" class="word-card">
      <p class="word-content">{{ word.word }}</p>
      <time class="word-time" :datetime="word.date">{{ word.date }}</time>
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
