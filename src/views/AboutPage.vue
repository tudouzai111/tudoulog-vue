<script lang="ts" setup>
import { SOCIAL_LINKS } from '@/constants/social.ts'
const socialLinks = SOCIAL_LINKS
</script>

<template>
  <transition-group appear class="about-page" name="list" tag="div">
    <!-- 关于博客 -->
    <section key="1" aria-labelledby="about-title" class="about-card">
      <h2 id="about-title" class="about-title">
        <span class="cool-title">关于土豆博客</span>
      </h2>
      <div class="about-content">
        <p class="intro">一个纯静态个人博客项目</p>

        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">GitHub项目地址</span>
            <a
              class="info-link"
              href="https://github.com/tudouzai111/tudoulog-vue"
              rel="noopener noreferrer"
              target="_blank"
            >
              github.com/tudouzai111/tudoulog-vue
            </a>
          </div>
          <div class="info-item">
            <span class="info-label">Gitee项目地址</span>
            <a
              class="info-link"
              href="https://gitee.com/tudouza1/tudoulog-vue"
              rel="noopener noreferrer"
              target="_blank"
            >
              gitee.com/tudouza1/tudoulog-vue
            </a>
          </div>
          <div class="info-item">
            <span class="info-label">Cloudflare地址</span>
            <a
              class="info-link"
              href="https://tudoulog.pages.dev/"
              rel="noopener noreferrer"
              target="_blank"
            >
              tudoulog.pages.dev
            </a>
          </div>

          <div class="info-item">
            <span class="info-label">联系方式</span>
            <span class="info-value">QQ: 1715593110</span>
          </div>
        </div>

        <div class="social-links">
          <a
            v-for="link in socialLinks"
            :key="link.name"
            :aria-label="link.name"
            :href="link.url"
            class="social-link"
            rel="noopener noreferrer"
            target="_blank"
          >
            <svg class="social-icon" :fill="link.filled ? 'currentColor' : 'none'" :stroke="link.filled ? 'none' : 'currentColor'" stroke-linecap="round" stroke-linejoin="round" :stroke-width="link.filled ? 0 : 2" viewBox="0 0 24 24">
              <path :d="link.icon" />
            </svg>
            {{ link.name }}
          </a>
        </div>
      </div>
    </section>

    <section key="2" aria-labelledby="about-title" class="about-card">
      <h2 id="about-title" class="about-title">
        <span class="cool-title">关于土豆仔</span>
      </h2>
      <div class="about-content">
        <p class="intro">当时玩邮差骑士的随机名字是土豆仔，所以网名就叫土豆仔了</p>
      </div>
    </section>

    <section key="3" aria-labelledby="about-title" class="about-card">
      <h2 id="about-title" class="about-title">
        <span class="cool-title">关于资源</span>
      </h2>
      <div class="about-content">
        <p class="intro">网页肯定要图标，所以随便找了个土豆图标🥔</p>
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">图标资源</span>
            <a
              class="info-link"
              href="https://www.flaticon.com/free-icons/potato"
              rel="noopener noreferrer"
              target="_blank"
              title="potato icons"
            >
              Potato icons created by Freepik - Flaticon
            </a>
          </div>
        </div>
      </div>
    </section>
  </transition-group>
</template>

<style scoped>
.about-page {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  max-width: 800px;
  margin: 0 auto;
}

.about-card {
  background: var(--off-white);
  border-radius: var(--border-radius);
  padding: var(--spacing-lg);
  border: var(--border);
  box-shadow: var(--shadow);
  transition: var(--transition);
}

.about-card:hover {
  box-shadow: var(--shadow-hover);
}

.about-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 var(--spacing) 0;
}

.about-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing);
}

.intro {
  font-size: 1rem;
  color: var(--dark-gray);
  margin: 0;
}

.info-grid {
  display: grid;
  gap: var(--spacing-sm);
}

.info-item {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
  align-items: center;
}

.info-label {
  font-weight: 600;
  color: var(--dark-gray);
  min-width: 80px;
}

.info-link {
  color: var(--main);
  word-break: break-all;
}

.info-link:hover {
  text-decoration: underline;
}

.info-value {
  color: var(--mid-gray);
}

.social-links {
  display: flex;
  gap: var(--spacing-sm);
}

.social-link {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: 0.5rem 1rem;
  background: var(--white);
  border: var(--border);
  border-radius: var(--border-radius-sm);
  color: var(--dark-gray);
  font-weight: 500;
  transition: var(--transition-fast);
}

.social-link:hover {
  background: var(--main);
  color: #fff;
  border-color: var(--main);
}

.social-icon {
  width: 1.25rem;
  height: 1.25rem;
}

@media (max-width: 768px) {
  .about-card {
    padding: var(--spacing);
  }
}
</style>
