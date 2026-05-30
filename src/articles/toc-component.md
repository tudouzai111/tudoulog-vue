---
title: 'Vue 3 实战：手写通用文章目录导航组件（栈算法 + 滚动高亮 + 响应式）'
date: '2026-06-01'
tags: ['Vue', '前端', '教程']
excerpt: '从零实现一个通用的文章目录导航组件，涵盖栈算法构建目录树、递归组件渲染、滚动高亮和响应式布局'
coverImage: ''
---

> 文章使用AI润色

## 1. 引言

在 Markdown 博客系统中，文章内容由标题（h1~h6）构成天然层级结构。提供一个自动生成的目录导航（Table of Contents），能显著提升阅读体验：读者可以一目了然文章大纲，点击即可跳转到对应章节。

本文将从头实现一个通用 TOC 组件，包含三个核心能力：

- **栈算法**：将扁平的 h1~h6 标题列表构建为嵌套树结构
- **滚动高亮**：随页面滚动自动标记当前阅读的章节
- **响应式交互**：宽屏侧边栏常驻，窄屏底部抽屉式弹出

代码基于 Vue 3 + TypeScript + `<script setup>` 语法，完整项目可在 Gitee 查看：[tudoulog-vue](https://gitee.com/tudouza1/tudoulog-vue)。

---

## 2. 定义目录数据结构

先定义 Heading 类型。每个标题节点包含自身信息和一个 children 数组，用于挂载子标题：

```ts
// src/types/index.ts
export interface Heading {
  id: string       // 锚点 ID，用于跳转和高亮
  title: string    // 标题文本
  level: number    // 1~6，对应 h1~h6
  children?: Heading[]  // 子标题列表
}
```

嵌套结构的关键就在 `children` 字段。扁平的 h1~h6 经过算法处理后，变成一棵多叉树，递归组件再把这棵树渲染为嵌套的 ul/li。

---

## 3. 核心算法：用栈构建目录树

这是整个组件最精华的部分。常见的做法是只处理 h2/h3 两级，但我们的算法支持任意级别的标题混合出现，通用的栈结构能应对所有情况。

### 3.1 完整代码

```ts
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
  // 保留中文、字母、数字和连字符
    .replace(/[^\w\u4e00-\u9fa5-]/g, '')
}

function generateTocTree(contentRef: HTMLElement): Heading[] {
  const elements = contentRef.querySelectorAll('h1, h2, h3, h4, h5, h6')
  const slugCount = new Map<string, number>()

  // 为没有 id 的标题生成唯一锚点
  const generateId = (text: string): string => {
    const baseSlug = slugify(text) || 'heading'
    const count = slugCount.get(baseSlug) || 0
    const id = count === 0 ? baseSlug : `${baseSlug}-${count}`
    slugCount.set(baseSlug, count + 1)
    return id
  }

  const stack: Heading[] = []  // 维护当前层级路径
  const root: Heading[] = []   // 最终目录树（森林）

  elements.forEach((el) => {
    const level = parseInt(el.tagName.slice(1))  // 'H2' -> 2
    const title = el.textContent || ''

    // 优先使用元素已有的 id，否则自动生成
    let id = el.id
    if (!id) {
      id = generateId(title)
      el.id = id  // 回填 DOM，用于锚点跳转
    }

    const node: Heading = { id, title, level, children: [] }

    // 核心逻辑：弹出所有 level >= 当前节点的栈顶
    while (stack.length > 0 && stack[stack.length - 1]!.level >= level) {
      stack.pop()
    }

    if (stack.length === 0) {
      // 没有父节点，挂到根级
      root.push(node)
    } else {
      // 栈顶就是当前节点的父节点
      stack[stack.length - 1]!.children!.push(node)
    }

    // 当前节点入栈，它可能是后续节点的父节点
    stack.push(node)
  })

  return root
}
```

### 3.2 算法原理解析

理解这个算法的关键是看 `stack` 数组。它始终保存着从根到当前节点的路径：

- 遇到一个新标题时，**从栈顶开始检查**。如果栈顶的 level >= 当前 level，说明栈顶不是父级（可能是同级或子级），弹出。
- 重复弹出直到栈顶 level < 当前 level，此时栈顶就是父节点。
- 把当前节点挂到父节点的 children 中，然后当前节点入栈。

### 3.3 示例推演

假设有这样的标题结构：

```
H1: 介绍          (level 1)
H2: 安装          (level 2)
H3: Windows      (level 3)
H3: macOS        (level 3)
H2: 配置          (level 2)
```

逐行执行过程：

| 步骤 | 当前标题 | 栈操作 | 栈内容 | 挂载到 |
|------|----------|--------|--------|--------|
| 1 | H1 介绍 | 栈空，直接入栈 | `[H1]` | root |
| 2 | H2 安装 | H1.level(1) < 2，H1 是父节点，入栈 | `[H1, H2]` | H1.children |
| 3 | H3 Windows | H2.level(2) < 3，H2 是父节点，入栈 | `[H1, H2, H3]` | H2.children |
| 4 | H3 macOS | H3.level(3) >= 3，弹出前一个 H3。H2.level(2) < 3，入栈 | `[H1, H2, H3_new]` | H2.children |
| 5 | H2 配置 | H3.level(3) >= 2，弹出 H3。H2.level(2) >= 2，弹出 H2。H1.level(1) < 2，入栈 | `[H1, H2_new]` | H1.children |

最终树结构：

```
root
├── H1: 介绍
│   ├── H2: 安装
│   │   ├── H3: Windows
│   │   └── H3: macOS
│   └── H2: 配置
```

这种方案比传统的"只处理 h2/h3"健壮得多。即使出现 `h1 > h4 > h2` 这种交叉层级，算法也能正确处理。

---

## 4. TocItem 递归组件

有了树形数据，渲染就是递归组件的事了。

```vue
<!-- src/components/TocItem.vue -->
<script lang="ts" setup>
import type { Heading } from '@/types'

defineProps<{
  heading: Heading
  activeId: string
}>()

defineEmits<{
  (e: 'click', id: string): void
}>()
</script>

<template>
  <li>
    <a
      :class="{ active: activeId === heading.id }"
      :href="'#' + heading.id"
      @click.prevent="$emit('click', heading.id)"
    >
      {{ heading.title }}
    </a>
    <!-- 递归渲染子标题 -->
    <ul v-if="heading.children && heading.children.length" class="toc-sublist">
      <TocItem
        v-for="child in heading.children"
        :key="child.id"
        :active-id="activeId"
        :heading="child"
        @click="$emit('click', child.id)"
      />
    </ul>
  </li>
</template>
```

关键点：

- **自引用**：TocItem 的 template 中使用了 `<TocItem>`，这是 Vue 支持的递归组件模式。只要组件有 name 或在导入时注册了自己，就能在模板中调用自身。
- **事件冒泡**：子节点的 click 事件通过 `$emit` 向上冒泡，最终由 TocComponent 统一处理滚动逻辑。这样每个 TocItem 不需要关心滚动细节。
- **高亮透传**：`activeId` 从顶层一直传递到每个叶子节点，每个 a 标签自行判断是否 active。

---

## 5. TocComponent：滚动高亮与响应式

TocComponent 是整个目录导航的容器，负责三个职责：缓存标题偏移量、监听滚动计算高亮、管理响应式布局。

### 5.1 偏移量缓存

每次渲染后，遍历 headings 树，获取每个标题对应的 DOM 元素位置：

```ts
const headingOffsets = ref<{ id: string; top: number }[]>([])

const updateOffsets = () => {
  const offsets: { id: string; top: number }[] = []
  props.headings.forEach((h) => {
    const el = document.getElementById(h.id)
    if (el) offsets.push({ id: h.id, top: el.offsetTop })
    h.children?.forEach((child) => {
      const childEl = document.getElementById(child.id)
      if (childEl) offsets.push({ id: child.id, top: childEl.offsetTop })
    })
  })
  offsets.sort((a, b) => a.top - b.top)
  headingOffsets.value = offsets
}
```

为什么不用 getBoundingClientRect？因为 offsetTop 是相对于父容器的固定值，适合滚动场景。每次窗口 resize 或 headings 变化时重新计算。

### 5.2 滚动高亮算法

```ts
const handleScroll = () => {
  const scrollY = window.scrollY + 80  // 80px 偏移，让高亮稍微提前
  const offsets = headingOffsets.value
  if (!offsets.length) return

  // 从后往前找，最后一个 top <= scrollY 的标题就是当前阅读位置
  let active = offsets[0]!.id
  for (let i = offsets.length - 1; i >= 0; i--) {
    if (offsets[i]!.top <= scrollY) {
      active = offsets[i]!.id
      break
    }
  }
  activeId.value = active
}
```

算法很直接：**从后往前遍历**，找到第一个 offsetTop 小于等于当前滚动位置的标题。因为标题在文档中按从上到下排列，最后一个满足条件的标题就是用户当前阅读到的位置。

加上 80px 偏移量是为了让高亮"提前"一点点，用户滚动到标题附近时高亮立即切换，体验更流畅。

### 5.3 响应式交互

组件需要适配两种屏幕：

- **宽屏（>= 768px）**：TOC 作为侧边栏常驻，sticky 定位跟随滚动
- **窄屏（< 768px）**：TOC 默认隐藏，底部显示浮动按钮；点击后从底部滑出抽屉式面板

用 `window.matchMedia` 监听屏幕宽度：

```ts
const mediaQuery = window.matchMedia('(min-width: 768px)')
const isWideScreen = ref(mediaQuery.matches)

// 显示状态：宽屏始终显示，窄屏由 toggle 控制
const shouldShowToc = computed(() => {
  return isWideScreen.value || isTocVisible.value
})

const toggleToc = () => {
  isTocVisible.value = !isTocVisible.value
}
```

窄屏下点击目录项后自动关闭面板：

```ts
const handleClick = (id: string) => {
  const element = document.getElementById(id)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
    if (!isWideScreen.value) {
      toggleToc()  // 关闭面板
    }
  }
}
```

CSS 方面，宽屏下 TOC 使用 `position: sticky` 固定在右侧；窄屏下切换为 `position: fixed` 从底部弹出，配合 Vue transition 实现滑入动画。

---

## 6. 在文章详情中使用

在 ArticleDetail.vue 中集成 TOC 组件：

```vue
<script lang="ts" setup>
import { nextTick, onMounted, ref } from 'vue'
import type { Heading } from '@/types'
import TocComponent from '@/components/TocComponent.vue'

const contentRef = ref<HTMLElement | null>(null)
const headings = ref<Heading[]>([])

onMounted(async () => {
  // 等待 Markdown 渲染完成
  await nextTick()
  if (!contentRef.value) return

  // 从 DOM 提取标题构建目录树
  headings.value = generateTocTree(contentRef.value)
})
</script>

<template>
  <section class="article-content">
    <div ref="contentRef" class="markdown-body">
      <!-- Markdown 渲染后的文章内容 -->
      <component :is="article.component" v-if="article.component" />
    </div>
    <!-- 目录导航 -->
    <TocComponent :headings="headings" />
  </section>
</template>

<style scoped>
.article-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--spacing-lg);
}
</style>
```

需要注意 `nextTick` 的时机。Markdown 内容通过 `v-if` 或动态组件渲染，必须等 DOM 更新完成后才能执行 `querySelectorAll` 获取标题元素。`generateTocTree` 还会自动为没有 id 的标题生成锚点并回填 DOM。

---

## 7. 总结

本文实现了一个完整的文章目录导航组件，核心亮点有三个：

**栈算法构建目录树**。利用一个栈维护层级路径，兼容任意 h1~h6 组合，比固定处理 h2/h3 的方案通用得多。代码只有十几行，思路清晰。

**递归组件渲染树形结构**。TocItem 自引用的模式天然适配多叉树，配合事件冒泡和属性透传，每个节点只关注自己的渲染。

**滚动高亮 + 响应式布局**。通过缓存 offsetTop + 滚动监听实现精确的阅读位置标记；matchMedia 搭配 computed 实现宽窄屏自适应，移动端体验完整。

这个 TOC 组件不依赖任何第三方库，纯 Vue 3 + TypeScript 实现，可直接移植到任意 Markdown 渲染项目中使用。
