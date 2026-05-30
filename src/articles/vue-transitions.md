---
title: 'Vue 3 过渡动画实战指南：从 Transition 到 TransitionGroup'
date: '2026-06-01'
tags: ['Vue', '前端', 'CSS', '教程']
excerpt: '用博客项目中的真实代码讲解 Vue 3 的 Transition 和 TransitionGroup，包括类名体系、路由过渡、列表 stagger 错峰动画等'
coverImage: ''
---

> 文章使用AI润色

## 引言

做前端开发这么多年，动画一直是个让人又爱又恨的东西。爱它能让页面活起来，恨它实现起来太麻烦。Vue 3 内置的 Transition 和 TransitionGroup 组件把最头疼的部分封装好了，你只需要关心什么时机触发什么效果，剩下的交给框架。

这篇文章不讲虚的，直接拿我博客项目里的真实代码说事。

项目的完整代码可以在 Gitee 上找到：[tudoulog-vue](https://gitee.com/tudouza1/tudoulog-vue)。

## Transition 类名体系

Vue 的过渡基于 6 个 CSS 类名，分别在元素进入和离开的不同阶段生效。理解这几个类名的触发时机，基本就掌握了 Transition 的核心。

| 类名 | 触发时机 | 作用 |
|------|---------|------|
| `xx-enter-from` | 元素插入前添加，下一帧移除 | 定义进入的起始状态 |
| `xx-enter-active` | 元素插入前添加，过渡结束后移除 | 定义进入过渡的持续过程 |
| `xx-enter-to` | 元素插入后下一帧添加，过渡结束后移除 | 定义进入的结束状态 |
| `xx-leave-from` | 离开触发时添加，下一帧移除 | 定义离开的起始状态 |
| `xx-leave-active` | 离开触发时添加，过渡结束后移除 | 定义离开过渡的持续过程 |
| `xx-leave-to` | 离开触发后下一帧添加，过渡结束后移除 | 定义离开的结束状态 |

`xx` 是 Transition 组件 `name` 属性的值。比如 `name="page"`，对应的类就是 `.page-enter-from`、`.page-leave-active` 这样。

记住一个规律：`-from` 是起始状态，`-to` 是结束状态，`-active` 是整个过程的动画属性。大多数时候你只需要配 `-from` 和 `-active` 就够了。

## 过渡模式 mode

Transition 有三种模式：

- **默认（同时）**：旧元素离开和新元素进入同时发生。看起来有点别扭，两个元素会重叠。
- **`out-in`**：旧元素完全离开后，新元素再进入。最常用，体验最好。
- **`in-out`**：新元素先进入，旧元素再离开。用得少，某些特殊场景才有意义。

项目中路由过渡用的就是 `out-in`：

```vue
<transition appear mode="out-in" name="page">
  <component :is="Component" :key="$route.fullPath" />
</transition>
```

`appear` 属性让页面首次加载也有动画效果，不是非得等路由切换才触发。

## 路由过渡动画实战

来看博客项目里的完整实现。AppLayout.vue 是全局布局组件，路由切换的过渡就放在这里：

```vue
<template>
  <div class="layout">
    <AppHeader />
    <main class="main-content">
      <router-view v-slot="{ Component }">
        <transition appear mode="out-in" name="page">
          <component :is="Component" :key="$route.fullPath" />
        </transition>
      </router-view>
    </main>
    <AppFooter v-if="!isHome" />
  </div>
</template>
```

注意 `:key="$route.fullPath"` 这一行。如果不加 key，从 `/article/foo` 跳到 `/article/bar` 时，因为都是同一个组件，Vue 会复用实例，过渡就不会触发。用 fullPath 作为 key，每次路由变化都强制重新创建组件，过渡才能正常工作。

对应的 CSS 定义在全局样式里：

```css
.page-enter-active,
.page-leave-active {
  transition: all 0.3s ease-in-out;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
```

效果就是页面切换时有个轻微的缩放淡入淡出，0.3 秒完成，不拖沓。过渡时间建议控制在 0.2 到 0.4 秒之间，太短看不清，太长显得卡。

## TransitionGroup 与列表动画

Transition 处理的是单个元素的进入离开，TransitionGroup 处理的是列表。区别在于：

- TransitionGroup 会渲染一个真实的 DOM 容器，通过 `tag` 属性指定标签名
- 列表中的每一项必须有唯一的 `key`
- 它多了一个 `move` 过渡，用于处理列表排序时的动画

看博客首页的英雄区域怎么用的：

```vue
<transition-group appear class="hero-content" name="list" tag="div">
  <h1 key="1" class="hero-title">土豆仔</h1>
  <p key="2" class="hero-subtitle">这是一个纯静态个人博客</p>
  <div key="3" class="hero-image-wrapper">
    <img src="/img/tudouzai.jpeg" alt="土豆仔" class="hero-image" />
  </div>
  <div key="4" class="theme-picker">
    ...
  </div>
</transition-group>
```

四个子元素依次进入，配合 stagger 错峰动画，视觉上会有一个接一个出现的层次感。

## Stagger 错峰动画

错峰动画就是让列表中的元素不是同时出现，而是一个接一个地出现，形成波浪效果。

### nth-child 方案

首页用的是 nth-child 硬编码：

```css
.list-enter-active:nth-child(1) { transition-delay: 0s; }
.list-enter-active:nth-child(2) { transition-delay: 0.1s; }
.list-enter-active:nth-child(3) { transition-delay: 0.2s; }
.list-enter-active:nth-child(4) { transition-delay: 0.3s; }
```

每个元素比前一个晚 0.1 秒出现。效果不错，但不够灵活。如果元素数量不固定，就得写很多条规则。

### CSS 变量方案

文章列表页用了更聪明的办法。在 Vue 模板里直接通过 `:style` 把延迟时间设为 CSS 变量：

```vue
<transition-group appear class="article-list" name="list" tag="div">
  <router-link
    v-for="(article, index) in showArticles"
    :key="article.id"
    :style="{ '--delay': index * 0.1 + 's' }"
    :to="`/article/${article.id}`"
  >
    <CardComponent :card="article" />
  </router-link>
</transition-group>
```

CSS 这边只需要一行：

```css
.list-enter-active {
  transition: all 0.3s ease-out;
  transition-delay: var(--delay, 0s);
}

.list-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
```

`var(--delay, 0s)` 的意思是优先使用 CSS 变量 `--delay`，如果没定义就用 0s 作为默认值。

### 哪种方案更好？

如果列表固定不变（比如首页那四个元素），nth-child 完全够用，代码直观。如果列表是动态的，像文章列表那样根据搜索结果变化，CSS 变量方案是更好的选择，不用改 CSS 就能适配任意数量的元素。

另外全局样式里还定义了一个 `list-move` 过渡：

```css
.list-move {
  transition: transform 0.3s ease;
}
```

这个用于列表排序或过滤时，元素在 DOM 中移动位置的动画。比如筛选标签时，文章列表重新排序，每个卡片会平滑地移动到新位置，而不是闪一下。

## 最佳实践

总结几条经验：

**路由过渡用 out-in。** 默认的同时过渡会让新旧元素打架，用户体验不好。out-in 先走后来，干净利落。

**动态列表用 CSS 变量做 stagger。** 比 nth-child 灵活得多，不用写一堆重复代码。

**过渡时间不要太长。** 0.2s 到 0.4s 是比较舒服的范围。超过 0.5s 就会让人觉得页面慢了。

**合理使用 appear。** 页面首次加载的动画能给用户留下好印象，但是别滥用，到处都是动画反而廉价。

**leave 动画别忘了。** 很多人只做了 enter，leave 直接消失，体验很割裂。Vue 的 Transition 让 enter 和 leave 是一一对应的，花半分钟把 leave 也配上。

Transition 和 TransitionGroup 是 Vue 3 里性价比很高的功能，几行代码就能让页面交互上一个档次。下次做页面的时候，不妨试试加上过渡效果。
