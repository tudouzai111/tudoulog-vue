<script lang="ts" setup></script>

<template>
  <section class="not-found">
    <div class="not-found-content">
      <span aria-hidden="true" class="not-found-emoji">🥔</span>
      <h1>404 NotFound</h1>
      <p>这个页面被土豆吃掉了</p>
      <div class="not-found-actions">
        <router-link class="btn-primary" to="/">返回首页</router-link>
        <router-link class="btn-secondary" to="/article">浏览文章</router-link>
      </div>
    </div>
  </section>
</template>

<style scoped>
.not-found {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  text-align: center;
  color: var(--dark-gray);
  padding: var(--spacing-xl);
}

.not-found-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing);
}

.not-found-emoji {
  font-size: 4rem;
  line-height: 1;
}

.not-found h1 {
  font-size: 4rem;
  font-weight: 800;
  line-height: 1;
  color: var(--dark-gray);
  text-align: center;
  margin: 0;
}

.not-found p {
  font-size: 1.5rem;
  color: var(--mid-gray);
  margin: 0;
}

.not-found-actions {
  display: flex;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-sm);
}

.not-found-actions a {
  padding: 0.5rem 1.5rem;
  border-radius: var(--border-radius-sm);
  font-weight: 600;
  text-decoration: none;
  transition: var(--transition-fast);
}

.btn-primary {
  background: var(--main);
  color: #fff;
  box-shadow: var(--shadow-main);
}

.btn-primary:hover {
  background: color-mix(in oklch, var(--main) 85%, black);
  color: #fff;
}

.btn-secondary {
  background: var(--white);
  color: var(--dark-gray);
  border: var(--border);
}

.btn-secondary:hover {
  background: var(--light-gray);
  color: var(--dark-gray);
}

@media (max-width: 768px) {
  .not-found h1 {
    font-size: 2.5rem;
  }

  .not-found-emoji {
    font-size: 3rem;
  }
}
</style>
