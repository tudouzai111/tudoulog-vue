---
title: Vue 3 组件设计：多功能标签组件与主题色切换系统
date: 2026-06-01
tags:
  - Vue
  - 前端
  - CSS
  - 教程
excerpt: 通过一个真实博客项目中的实战案例，分享 Vue 3 组件设计思路——包括三模式标签组件的 v-model 设计和 provide/inject 全局主题切换方案
coverImage: ''
updated: ''
draft: false
ai: true
---

## 1. 引言

在 Vue 3 项目开发中，组件复用和全局状态管理是两个常见场景。这篇文章通过一个真实博客项目中的两个实战案例，分享 Vue 3 的组件设计思路：

- **多功能标签组件**：一个组件支持三种交互模式（选中、导航、只读），用 `v-model` 和事件分发适配不同场景
- **主题色切换系统**：用 `provide/inject` 配合 CSS 变量（OKLCH 色彩空间）实现全局主题切换，无需引入 Pinia

两个案例都来自我的博客项目，代码均已落地运行，完整项目可在 Gitee 查看：[tudoulog-vue](https://gitee.com/tudouza1/tudoulog-vue)。

## 2. 标签模式定义

先看标签模式的类型定义。为了让类型更清晰，我把模式常量单独提取到一个文件 `src/constants/tagMode.ts`：

```ts
/** 模式：select=可选中，navigate=点击跳转，readonly=只读 */
export const TAG_MODE = ['select', 'navigate', 'readonly']
export type TagMode = (typeof TAG_MODE)[number]
export const TAG_MODE_DEFAULT = TAG_MODE[0]
```

这里用了 TypeScript 的 `(typeof TAG_MODE)[number]` 来推导联合类型，这样 TAG_MODE 数组和 TagMode 类型保持同步，改一处就行。

## 3. 标签组件实现

核心组件 `TagComponent.vue` 根据 mode prop 切换三种行为：

```vue
<script lang="ts" setup>
import { computed } from 'vue'
import { TAG_MODE, TAG_MODE_DEFAULT, type TagMode } from '@/constants/tagMode.ts'

const props = withDefaults(
  defineProps<{ tags: string[]; modelValue?: string[]; mode?: TagMode }>(),
  { mode: TAG_MODE_DEFAULT, modelValue: () => [] },
)
const emit = defineEmits<{
  (e: 'update:modelValue', tags: string[]): void
  (e: 'clickTag', tags: string): void
}>()

const isSelectMode = computed(() => props.mode === TAG_MODE[0])
const isNavigateMode = computed(() => props.mode === TAG_MODE[1])
const isReadonlyMode = computed(() => props.mode === TAG_MODE[2])

const isSelected = (tag: string) => props.modelValue?.includes(tag)

const handleTagClick = (tag: string) => {
  if (isReadonlyMode.value) return
  if (isSelectMode.value) {
    const currentTags = props.modelValue ? [...props.modelValue] : []
    const index = currentTags.indexOf(tag)
    if (index === -1) {
      currentTags.push(tag)
    } else {
      currentTags.splice(index, 1)
    }
    emit('update:modelValue', currentTags)
  } else if (isNavigateMode.value) {
    emit('clickTag', tag)
  }
}
</script>

<template>
  <div aria-label="标签列表" class="tags" role="list">
    <button
      v-for="tag in tags"
      :key="tag"
      :aria-checked="isSelectMode ? isSelected(tag) : undefined"
      :class="[
        'tag',
        { 'tag-active': isSelectMode && isSelected(tag) },
        { 'tag-readonly': isReadonlyMode },
      ]"
      :role="isSelectMode ? 'checkbox' : 'button'"
      type="button"
      @click.stop.prevent="handleTagClick(tag)"
    >
      {{ tag }}
    </button>
  </div>
</template>
```

关键设计点：

**withDefaults 处理可选 prop**：`tags` 是必填，`modelValue` 和 `mode` 可选。`withDefaults` 第二个参数传 `() => []` 而不是 `[]`，避免引用共享。

**v-model 双向绑定**：select 模式下用 `modelValue` + `update:modelValue` 模式实现 v-model。标签被点击时切换选中状态，更新数组。

**三种模式区分**：

- select：点击切换选中 / 未选中，emit 整个数组
- navigate：点击发出标签名，父组件处理跳转
- readonly：点击直接 return，不做任何操作

**无障碍属性**：select 模式下 role 是 checkbox，配合 aria-checked；navigate 和 readonly 模式 role 是 button。

## 4. 文章列表页的标签筛选

文章列表页 `ArticlePage.vue` 用 select 模式做标签筛选。组件用法：

```vue
<CardComponent :card="article">
  <template #tags>
    <TagComponent v-model="selectedTags" :tags="article.tags || []" />
  </template>
</CardComponent>
```

每张文章卡片内部都有标签组件，点击标签把它加入 `selectedTags` 数组。筛选逻辑用 computed 实现：

```ts
const filteredArticles = computed(() => {
  return articles.filter((a) => {
    const matchTags =
      selectedTags.value.length === 0 ||
      (a.tags && selectedTags.value.every((tag) => a.tags.includes(tag)))
    const query = searchQuery.value.trim().toLowerCase()
    const matchSearch =
      query === '' ||
      a.title.toLowerCase().includes(query) ||
      a.excerpt?.toLowerCase().includes(query) ||
      a.tags?.some((tag) => tag.toLowerCase().includes(query))
    return matchTags && matchSearch
  })
})
```

筛选逻辑同时支持标签和搜索：标签用 `every` 确保文章包含所有选中标签（与关系）；搜索模糊匹配标题、摘要、标签。

当选中的标签有变化时，搜索结果变化，配合分页逻辑自动重置到第一页：

```ts
watch(filteredArticles, () => (currentPage.value = 1))
```

## 5. 文章详情页的标签导航

文章详情页 `ArticleDetail.vue` 用 navigate 模式，点击标签跳转到列表页并带上筛选参数：

```vue
<TagComponent
  :mode="TAG_MODE[1]"
  :tags="article.tags || []"
  @click-tag="goToListWithTag"
/>
```

```ts
const goToListWithTag = (tags: string) => {
  router.push({
    path: '/article',
    query: { tags },
  })
}
```

`ArticlePage.vue` 在 `onMounted` 里读取 URL 参数初始化 `selectedTags`：

```ts
onMounted(() => {
  const tagsQuery = route.query.tags
  if (tagsQuery) {
    if (typeof tagsQuery === 'string') {
      selectedTags.value = tagsQuery.split(',').filter((tag) => tag.trim().length > 0)
    }
  }
})
```

这样从详情页点击标签跳转后，列表页自动展示筛选结果，流程很自然。

## 6. 主题色系统：provide / inject + CSS 变量

全局主题切换用 `provide/inject` 配合 CSS 变量实现，不依赖状态管理库。

**主题常量定义**：

```ts
export const THEMES = ['teal', 'pink', 'purple'] as const
export type Theme = (typeof THEMES)[number]
export const DEFAULT_THEME: Theme = THEMES[0]
```

**CSS 变量定义**（`src/styles/global.css` 的 `:root` 中）：

```css
/* 主色 - OKLCH 感知均匀色彩 */
--teal: oklch(75% 0.18 170);
--pink: oklch(75% 0.17 20);
--purple: oklch(70% 0.16 290);

--teal-light: oklch(85% 0.12 170);
--pink-light: oklch(85% 0.11 20);
--purple-light: oklch(80% 0.10 290);

--main: var(--teal);
--main-light: var(--teal-light);
```

这里用了 OKLCH 色彩空间。相比 RGB 和 HSL，OKLCH 更接近人眼感知：同样 75% 亮度的颜色对人眼来说亮度基本一致，切换主题时不会出现亮暗跳跃。

**App.vue 提供主题**：

```vue
<script lang="ts" setup>
import { onMounted, provide, ref } from 'vue'
import { DEFAULT_THEME, type Theme, THEMES } from '@/constants/theme.ts'

const activeTheme = ref<Theme>(DEFAULT_THEME)

const applyTheme = (theme: Theme) => {
  const root = document.documentElement
  root.style.setProperty('--main', `var(--${theme})`)
  root.style.setProperty('--main-light', `var(--${theme}-light)`)
  localStorage.setItem('theme', theme)
  activeTheme.value = theme
}

provide('theme', { activeTheme, setTheme: applyTheme })

onMounted(() => {
  const saved = localStorage.getItem('theme') as Theme | null
  if (saved && THEMES.includes(saved)) {
    applyTheme(saved)
  } else {
    applyTheme(DEFAULT_THEME)
  }
})
</script>
```

**子组件注入主题**：

```ts
const { activeTheme, setTheme } = inject('theme') as {
  activeTheme: Ref<Theme>
  setTheme: (theme: Theme) => void
}
```

**主题选择器渲染**：

```vue
<div class="theme-picker">
  <span
    v-for="theme in THEMES"
    :key="theme"
    :class="[theme, { active: activeTheme === theme }]"
    class="color-dot"
    @click="setTheme(theme)"
  />
</div>
```

选择器用三个圆点展示主题色，CSS 里每个点的背景色直接引用 `var(--teal)`、`var(--pink)`、`var(--purple)`。

主题切换的流程是：点击圆点 → `setTheme` 更新 `--main` 和 `--main-light` → 所有引用这两个变量的元素自动更新 → `localStorage` 持久化 → 下次刷新 `onMounted` 恢复。

## 7. provide / inject 与 defineProps 的对比

很多人会问：这个场景为什么不用 Pinia？其实不是不能用，而是没必要。

| 方案 | 适用场景 | 特点 |
| --- | --- | --- |
| defineProps | 父子组件直接传递 | 显式、类型安全、适合少量层级 |
| provide/inject | 跨层级共享 | 灵活、适合全局可选配置 |
| Pinia | 复杂状态管理 | 完整状态管理方案，带 DevTools |

主题切换的逻辑很简单：一个响应式值加一个设置函数，不需要 action、getter、持久化中间件。`provide/inject` 正好够用，而且不用额外安装依赖。但是如果你的需求变复杂了（比如多主题叠加、动态编译主题、主题编辑器的撤销重做），那时候再上 Pinia 也不迟。

## 8. 总结

从这两个案例可以总结一些 Vue 3 的组件设计原则：

1. **用模式而非复制**：一个组件通过 flag 切换多个模式，比复制粘贴三个相似组件好维护得多。关键是区分哪些逻辑是共享的（渲染标签），哪些是变化的（点击行为）。
2. **v-model 是双向通信的糖**：用 `modelValue` + `update:modelValue` 实现 v-model，父子组件不需要手动监听事件和同步状态。
3. **provide/inject 不是 Pinia 的对手**：它们是不同层级的工具。全局配置类状态用 provide/inject 很轻量，状态管理复杂度上来了再考虑 Pinia。
4. **CSS 变量 + OKLCH = 主题切换利器**：改一个变量就换一个主题，而且 OKLCH 保证各主题亮度一致。

项目中用 OKLCH 后切换主题不再有"某个颜色特别亮或特别暗"的问题，推荐一试。
