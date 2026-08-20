const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/AGENTS-ChuxhzZo.js","assets/vendor-DhL4pvXe.js","assets/blog-markdown-system-Dd_sNvMQ.js","assets/clash-ggAR4S6A.js","assets/cloudflare-B2S4V4y2.js","assets/flutter-C0SQTqUe.js","assets/hello-QFzXgaI5.js","assets/music-study-ClmdYQWw.js","assets/oklch-BCmbMKUt.js","assets/opencode-web-BSN7_2or.js","assets/opencode-windows-install-BpqY1iNh.js","assets/ruanjian-list-B-ShNgoe.js","assets/springboot-config-COLTzUHo.js","assets/suan-fa-YRV3FUzf.js","assets/tag-component-theme-Brl1HUW2.js","assets/toc-component-CVNSrzlx.js","assets/vue-transitions-B9cXoBFb.js","assets/win11bug-jJylkSwR.js","assets/AppLayout-BvgOloyl.js","assets/AppLayout-h4A2jBgU.css","assets/HomePage-S6u8Y6k-.js","assets/HomePage-CWIUKTdD.css","assets/ArticlePage-1mK-pDV-.js","assets/article-common-CGgVWZRe.js","assets/article-common-B0ZBrl1H.css","assets/ArticlePage-CVSV0gmB.css","assets/WordPage-BiTEYZHi.js","assets/WordPage-Ddc59IEo.css","assets/ArticleDetail-BhwssvN0.js","assets/ArticleDetail-wVof2J8k.css","assets/AboutPage-DC7SWd6f.js","assets/AboutPage-BjmE0fB8.css","assets/NotFoundPage-sG7gK0du.js","assets/NotFoundPage-CFBGaYs9.css"])))=>i.map(i=>d[i]);
import{d as A,o as P,r as I,a as y,c as T,b as M,e as b,p as L,f as O,g as B,h as H,i as R,j as V}from"./vendor-DhL4pvXe.js";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))a(e);new MutationObserver(e=>{for(const o of e)if(o.type==="childList")for(const s of o.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&a(s)}).observe(document,{childList:!0,subtree:!0});function i(e){const o={};return e.integrity&&(o.integrity=e.integrity),e.referrerPolicy&&(o.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?o.credentials="include":e.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function a(e){if(e.ep)return;e.ep=!0;const o=i(e);fetch(e.href,o)}})();const S=["teal","pink","purple"],w=S[0],q={class:"app"},z=A({__name:"App",setup(n){const t=b(w),i=a=>{const e=document.documentElement;e.style.setProperty("--main",`var(--${a})`),e.style.setProperty("--main-light",`var(--${a}-light)`),localStorage.setItem("theme",a),t.value=a};return L("theme",{activeTheme:t,setTheme:i}),P(()=>{const a=localStorage.getItem("theme");a&&S.includes(a)?i(a):i(w)}),(a,e)=>{const o=I("router-view");return y(),T("div",q,[M(o)])}}}),N="modulepreload",F=function(n){return"/"+n},x={},r=function(t,i,a){let e=Promise.resolve();if(i&&i.length>0){let f=function(c){return Promise.all(c.map(u=>Promise.resolve(u).then(m=>({status:"fulfilled",value:m}),m=>({status:"rejected",reason:m}))))};document.getElementsByTagName("link");const s=document.querySelector("meta[property=csp-nonce]"),l=s?.nonce||s?.getAttribute("nonce");e=f(i.map(c=>{if(c=F(c),c in x)return;x[c]=!0;const u=c.endsWith(".css"),m=u?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${c}"]${m}`))return;const d=document.createElement("link");if(d.rel=u?"stylesheet":N,u||(d.as="script"),d.crossOrigin="",d.href=c,l&&d.setAttribute("nonce",l),document.head.appendChild(d),u)return new Promise((D,j)=>{d.addEventListener("load",D),d.addEventListener("error",()=>j(new Error(`Unable to preload CSS for ${c}`)))})}))}function o(s){const l=new Event("vite:preloadError",{cancelable:!0});if(l.payload=s,window.dispatchEvent(l),!l.defaultPrevented)throw s}return e.then(s=>{for(const l of s||[])l.status==="rejected"&&o(l.reason);return t().catch(o)})},G=`---
title: 'Vite + Vue 3 搭建 Markdown 博客文章系统：从配置到动态路由'
date: '2026-06-01'
tags: ['Vue', '前端', '教程']
excerpt: '拆解如何用 Vite 7 + Vue 3.5 + TypeScript 搭建一套 Markdown 博客系统，重点讲 vite-plugin-vue-markdown 的配置、动态路由设计以及文章列表的自动发现'
coverImage: ''
---

> 文章使用AI润色

## 1. 引言

现在很多开发者选择用静态博客来记录技术积累。Markdown 写文章很顺手，但要把它集成到 Vue 3 项目里变成可访问的页面，中间有一层转换工作要做。这篇文章从零开始，拆解如何用 Vite 7 + Vue 3.5 + TypeScript 搭一套 Markdown 博客系统，重点讲 \`vite-plugin-vue-markdown\` 的配置、动态路由设计，以及文章列表的自动发现。

项目的完整代码可以在 Gitee 上找到：[tudoulog-vue](https://gitee.com/tudouza1/tudoulog-vue)。

## 2. 安装与配置 vite-plugin-vue-markdown

核心思路是用 \`vite-plugin-vue-markdown\` 这个插件，在构建时把 \`.md\` 文件转成 Vue 组件。这样我们就能像引用 \`.vue\` 文件一样引用 Markdown 文章。

安装依赖（以下版本是项目当前使用的）：

\`\`\`
pnpm add vite-plugin-vue-markdown markdown-it-shiki shiki
\`\`\`

\`markdown-it-shiki\` 负责用 Shiki 做代码高亮，\`shiki\` 是底层的语法高亮引擎。

然后配置 \`vite.config.ts\`：

\`\`\`ts
import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import Markdown from 'vite-plugin-vue-markdown'
import Shiki from 'markdown-it-shiki'

export default defineConfig({
  base: '/',
  plugins: [
    vue({
      include: [/\\.vue$/, /\\.md$/],
    }),
    vueDevTools(),
    Markdown({
      markdownItOptions: {
        html: true,
        linkify: true,
        typographer: true,
      },
      markdownItUses: [
        [Shiki, { theme: 'one-dark-pro' }],
        (md: any) => {
          const defaultRender =
            md.renderer.rules.link_open ||
            ((tokens: any, idx: any, options: any, env: any, self: any) => {
              return self.renderToken(tokens, idx, options)
            })

          md.renderer.rules.link_open = (
            tokens: any, idx: any, options: any, env: any, self: any,
          ) => {
            const hrefIndex = tokens[idx].attrIndex('href')
            if (hrefIndex >= 0) {
              const href = tokens[idx].attrs[hrefIndex][1]
              if (/^https?:\\/\\//.test(href)) {
                tokens[idx].attrSet('target', '_blank')
                tokens[idx].attrSet('rel', 'noopener noreferrer')
              }
            }
            return defaultRender(tokens, idx, options, env, self)
          }
        },
      ],
      frontmatter: true,
      exportFrontmatter: true,
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'vue-router'],
        },
      },
    },
  },
})
\`\`\`

几个关键点：

- \`vue({ include: [/\\.vue$/, /\\.md$/] })\`：让 Vue 插件同时处理 \`.md\` 文件，这是让 Markdown 能当 Vue 组件用的前提。
- \`Shiki\` 搭配 \`one-dark-pro\` 主题：代码高亮效果和 VS Code 的 One Dark Pro 一致，看起来舒服。
- 自定义链接渲染器：判断链接是否以 \`http://\` 或 \`https://\` 开头，是的话自动加 \`target="_blank"\` 和 \`rel="noopener noreferrer"\`，实现外部链接新标签打开。这个纯 markdown-it 语法就能做，不需要额外库。
- \`frontmatter: true\` + \`exportFrontmatter: true\`：读取 Markdown 文件的头部元数据（标题、日期、标签等），并导出成变量供组件使用。
- \`manualChunks: { vendor: ['vue', 'vue-router'] }\`：把 Vue 和 Vue Router 单独打包成 vendor chunk，利用浏览器缓存节省带宽。

## 3. 编写 Markdown 文章

在 \`src/articles/\` 下新建 \`.md\` 文件，文件头部用 \`---\` 包裹 frontmatter：

\`\`\`md
---
title: '为什么要写纯静态土豆博客'
date: '2026-03-03'
tags: ['日常']
excerpt: '记录一下写博客的过程'
coverImage: ''
---
\`\`\`

字段说明：

- \`title\`：文章标题，必填
- \`date\`：发布日期，格式 \`YYYY-MM-DD\`，必填
- \`tags\`：标签数组，可选，用于分类筛选
- \`excerpt\`：摘要，可选，首页列表展示
- \`coverImage\`：封面图片文件名，可选。实际路径由代码拼接生成

文件名就是文章 ID。比如 \`hello.md\` 对应的 ID 就是 \`hello\`，路由里通过 \`article/:id\` 匹配。

## 4. 动态读取文章列表

有了 Markdown 文件，下一步是让程序自动发现它们。用 Vite 的 \`import.meta.glob\` 实现：

\`\`\`ts
// src/utils/articleList.ts
import type { Component } from 'vue'

const baseUrl = import.meta.env.BASE_URL

interface MarkdownModule {
  default: Component
  title?: string
  date?: string
  tags?: string[]
  excerpt?: string
  coverImage?: string
}

const modules: Record<string, MarkdownModule> = import.meta.glob(
  '@/articles/*.md', { eager: true }
)

export const articles = Object.entries(modules)
  .filter(([path]) => !path.includes('AGENTS.md'))
  .map(([path, mod]) => {
    const id = path.split('/').pop()!.replace('.md', '')
    const imgPath = baseUrl + 'img/cover/'
    return {
      id,
      title: mod.title || id,
      date: mod.date || '未知日期',
      tags: mod.tags || [],
      excerpt: mod.excerpt || '',
      coverImage: mod.coverImage ? imgPath + mod.coverImage : '',
      component: mod.default,
    }
  })
  .sort((a, b) => b.date.localeCompare(a.date))

export function getAllTags(): string[] {
  const tagSet = new Set<string>()
  articles.forEach((article) => {
    article.tags?.forEach((tag) => tagSet.add(tag))
  })
  return Array.from(tagSet).sort()
}
\`\`\`

几个设计细节：

- \`import.meta.glob\` 的 \`eager: true\`：在构建时立即执行导入，运行时不需要异步等待。匹配 \`@/articles/*.md\` 下的所有文件。
- \`.filter(([path]) => !path.includes('AGENTS.md'))\`：排除 \`AGENTS.md\`，这个是项目的知识库文件，不是文章。
- \`coverImage\` 处理：只存文件名，路径由 \`baseUrl + 'img/cover/'\` 拼接。这样封面图统一放在 \`public/img/cover/\` 下，部署到 Cloudflare Pages 时路径正确。
- \`.sort((a, b) => b.date.localeCompare(a.date))\`：按日期降序排列，最新文章排最前面。
- \`getAllTags()\` 工具函数：遍历所有文章收集标签，去重并排序，供标签页使用。

## 5. 配置路由

路由设计决定用户怎么访问文章。这里用嵌套路由，所有页面共享一个 \`AppLayout\` 布局组件：

\`\`\`ts
// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import { articles } from '@/utils/articleList.ts'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'AppLayout',
      component: () => import('@/components/layout/AppLayout.vue'),
      children: [
        {
          path: '',
          name: 'HomePage',
          component: () => import('@/views/HomePage.vue'),
          meta: { title: '首页-土豆博客' },
        },
        {
          path: 'article',
          name: 'ArticlePage',
          component: () => import('@/views/ArticlePage.vue'),
          meta: { title: '文章列表-土豆博客' },
        },
        {
          path: 'article/:id',
          name: 'ArticleDetail',
          component: () => import('@/views/ArticleDetail.vue'),
          beforeEnter: (to) => {
            if (!articles.find((a) => a.id === to.params.id)) {
              return { name: 'NotFound' }
            }
          },
        },
        {
          path: 'about',
          name: 'AboutPage',
          component: () => import('@/views/AboutPage.vue'),
          meta: { title: '关于-土豆博客' },
        },
        {
          path: '/:pathMatch(.*)*',
          name: 'NotFound',
          component: () => import('@/views/NotFoundPage.vue'),
        },
      ],
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    return { top: 0, behavior: 'smooth' }
  },
})

router.afterEach((to) => {
  document.title = (to.meta.title as string) || '土豆博客'
})

export default router
\`\`\`

路由设计要点：

- **嵌套路由**：\`AppLayout\` 为父路由，所有页面作为子路由。这样头部、底部等公共部分只需写一次。
- **动态路由 \`article/:id\`**：\`id\` 对应文件名（不含 \`.md\`）。比如访问 \`/article/hello\` 就渲染 \`hello.md\` 转换后的组件。
- **\`beforeEnter\` 守卫**：在进入文章详情前检查文章是否存在。如果 \`articles\` 列表里找不到对应的 \`id\`，直接重定向到 404 页面。这样访问不存在的文章不会白屏或报错。
- **\`/:pathMatch(.*)*\` 通配路由**：捕获所有未匹配的路径，指向自定义的 404 页面。
- **\`scrollBehavior\`**：返回 \`savedPosition\` 支持浏览器前进后退恢复滚动位置；\`to.hash\` 实现锚点平滑滚动；默认回到顶部。
- **\`router.afterEach\`**：每次路由切换后根据 \`meta.title\` 更新页面标题，没有设置的路由用默认标题"土豆博客"。

## 6. 渲染文章详情页

文章详情页的核心是渲染 Markdown 转换后的 Vue 组件。由于插件已经把 \`.md\` 文件转成了组件，直接动态挂载就行：

\`\`\`vue
<template>
  <article class="article-page">
    <div v-if="article" class="article-card">
      <!-- 封面区域 -->
      <header
        v-if="article.coverImage"
        :style="\`background-image: url(\${article.coverImage})\`"
        class="cover-wrapper"
      >
        <img
          :alt="article.title"
          :src="article.coverImage"
          class="article-cover"
          loading="eager"
        />
      </header>

      <div class="article-info">
        <div class="article-meta">
          <h1 class="article-title">{{ article.title }}</h1>
          <time :datetime="article.date" class="article-time">
            {{ article.date }}
          </time>
        </div>
      </div>

      <!-- 文章内容 -->
      <section class="article-content">
        <div ref="contentRef" class="markdown-body">
          <component :is="article.component" v-if="article.component" />
        </div>
      </section>
    </div>
  </article>
</template>
\`\`\`

核心就一行：\`<component :is="article.component" />\`。\`article.component\` 就是插件从 Markdown 转换出来的 Vue 组件，直接渲染就行。

样式方面，项目引入了 \`github-markdown-css\`（\`import 'github-markdown-css'\`），给包裹内容的 \`.markdown-body\` 加上 GitHub 风格的排版样式，看起来很干净。

封面图用了一个 blur 背景的视觉效果：封面图片正常显示，同时在它背后用 \`::before\` 伪元素模糊渲染同一张图作为背景，防止图片比例不匹配时出现空白。

## 7. 总结

这套方案的核心优势是简洁：

- 写文章就是写 Markdown，放进 \`src/articles/\` 即可
- \`import.meta.glob\` 自动发现文章，不需要手动注册
- \`vite-plugin-vue-markdown\` 把 Markdown 转成组件，无需额外构建步骤
- 动态路由 + \`beforeEnter\` 守卫做文章有效性校验
- 外部链接自动新标签打开，代码高亮用 Shiki

部署到 Cloudflare Pages 也很简单，Vite 构建输出静态文件，直接托管。整个系统依赖少，逻辑清晰，适合想自己控制博客代码的开发者。

有问题欢迎在评论区交流。
`,W=`---
title: 'Windows下安装Clash并配置节点代理'
date: '2026-06-10'
tags: ['Clash', '教程']
excerpt: '翻墙'
coverImage: ''
---

# 安装 Clash

https://clashofficial.com/zh-CN/index.html

用\`FlClash\` 版示例因为内存占用低

# 配置节点

免费节点URL：https://sub-unify.pages.dev/sub?token=ZH&clash

一元机场：https://xn--4gq62f52gdss.vip/

安装完跟着图片配置就行了

![clash_1.png](../../public/img/clash_1.png)
![clash_2.png](../../public/img/clash_2.png)

在URL里填入免费节点链接就行

![clash_3.png](../../public/img/clash_3.png)
![clash_4.png](../../public/img/clash_4.png)

选择一个延迟低的节点然后再托盘图标处设置一下就行了

谷歌能打开就算成功了：https://www.google.com/

其他版本配置同理
`,U=`---
title: '在CloudFlare上部署静态HTML文件'
date: '2026-07-10'
tags: ['CloudFlare', '教程', '前端']
excerpt: '在CloudFlare上免费部署静态HTML文件'
coverImage: ''
---

CloudFlare：https://www.cloudflare-cn.com/

注册个账号跟着图片走就行

![cloudflare_1.png](../../public/img/cloudflare_1.png)
![cloudflare_2.png](../../public/img/cloudflare_2.png)
![cloudflare_3.png](../../public/img/cloudflare_3.png)
![cloudflare_4.png](../../public/img/cloudflare_4.png)
`,$=`---
title: 'Flutter'
date: '2026-04-14'
tags: ['Flutter', 'Dart']
excerpt: 'Flutter环境的安装编译，Dart的基础语法，Flutter组件框架的学习，暂时只学了基础以后如果感兴趣有时间了可能会学的更深入'
coverImage: ''
---

#  安装配置
## Windows
### Flutter SDK
#### 下载
镜像：[https://mirrors.tuna.tsinghua.edu.cn/flutter/flutter_infra_release/releases/stable/](https://mirrors.tuna.tsinghua.edu.cn/flutter/flutter_infra_release/releases/stable/)

官方：[https://docs.flutter.dev/install/archive](https://docs.flutter.dev/install/archive)

环境变量：配置下载解压的 sdk 的 bin 目录

用户变量：编辑 \`FLUTTER_STORAGE_BASE_URL\` 变量值为：[https://storage.flutter-io.cn](https://storage.flutter-io.cn)

\`PUB_HOSTED_URL\` 变量值为：[https://pub-web.flutter-io.cn/](https://pub-web.flutter-io.cn/)或[https://mirrors.tuna.tsinghua.edu.cn/dart-pub/](https://mirrors.tuna.tsinghua.edu.cn/dart-pub/)



#### 验证
\`\`\`bash
flutter --version
\`\`\`

#### 更新
\`\`\`bash
flutter upgrade
\`\`\`

### Android SDK
下载命令行工具

[https://developer.android.google.cn/studio?hl=zh-cn#command-tools](https://developer.android.google.cn/studio?hl=zh-cn#command-tools)

解压到文件夹，在 cmdline-tools 下新建 latest 文件夹并把 <font style="color:rgb(38, 38, 38);">cmdline-tools 内所有的文件都移动到 latest 下</font>

<font style="color:rgb(38, 38, 38);">设置清华镜像源</font>

\`\`\`bash
# 设置国内镜像（当前会话）
setx ANDROID_SDK_ROOT "D:\\Tools\\SDK\\AndroidSDK"
setx PUB_HOSTED_URL "https://mirrors.tuna.tsinghua.edu.cn/dart-pub"
setx FLUTTER_STORAGE_BASE_URL "https://mirrors.tuna.tsinghua.edu.cn/flutter"
\`\`\`

在 bin 目录下执行更新组件

\`\`\`bash
./sdkmanager.bat --install "platform-tools" "platforms;android-34" "build-tools;34.0.0" ^ --sdk_root=D:\\Tools\\SDK\\AndroidSDK
\`\`\`

下载完后应该有

\`\`\`bash
D:\\Tools\\SDK\\AndroidSDK\\cmdline-tools\\latest\\bin\\sdkmanager.bat
D:\\Tools\\SDK\\AndroidSDK\\platform-tools\\adb.exe
D:\\Tools\\SDK\\AndroidSDK\\build-tools\\34.0.0\\aapt.exe
\`\`\`

添加环境变量

\`\`\`bash
D:\\Tools\\SDK\\AndroidSDK\\cmdline-tools\\latest\\bin
D:\\Tools\\SDK\\AndroidSDK\\platform-tools
\`\`\`

设置 Flutter 的 Android SDK 目录

\`\`\`bash
flutter config --android-sdk D:\\Tools\\SDK\\AndroidSDK
\`\`\`

接受许可

\`\`\`bash
flutter doctor --android-licenses
\`\`\`

### <font style="color:rgb(25, 25, 25);">Visual Studio 2022 生成工具</font>
[https://visualstudio.microsoft.com/zh-hans/downloads/](https://visualstudio.microsoft.com/zh-hans/downloads/)

勾选**使用C++的桌面开发**安装

### 浏览器
设置 chrome 环境变量

\`\`\`bash
setx CHROME_EXECUTABLE "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
\`\`\`

设置 edge

\`\`\`bash
setx CHROME_EXECUTABLE "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"
\`\`\`

## 验证环境
重开终端执行

\`\`\`bash
flutter doctor
\`\`\`

## VS Code
下载插件



# 开始
## 新建项目
\`\`\`bash
flutter create my_app
cd my_app
\`\`\`

## 运行
### windows
项目目录下

\`\`\`bash
flutter run -d windows
\`\`\`

### 安卓
连接 MUMU 模拟器

\`\`\`bash
adb connect 127.0.0.1:5555
\`\`\`

运行

\`\`\`bash
flutter run -d 127.0.0.1:5555
\`\`\`

---

下载 gradle 失败手动配置

[https://mirrors.aliyun.com/gradle/distributions/](https://mirrors.aliyun.com/gradle/distributions/?spm=a2c6h.25603864.0.0.3c73133apbP5Z0)

运行 \`android\\gradlew.bat\`

查看 gradle 最低支持版本下载

放到任意文件夹，修改 \`android\\gradle\\wrapper\\gradle-wrapper.properties\` 配置

\`\`\`bash
distributionUrl=file\\:///D:/Project/code/gradle/gradle-9.0.0-bin.zip
\`\`\`

## 打包
### windows
\`\`\`bash
flutter build windows --release
\`\`\`

如果报错打开设置中的开发者模式再尝试

### 安卓
\`\`\`dart
# 清理项目
flutter clean
flutter pub get

# 构建优化的APK文件
flutter build apk --split-per-abi --tree-shake-icons --obfuscate --split-debug-info=debug-info

# 重命名APK文件为项目名
$date = Get-Date -Format "yyyyMMdd"
Get-ChildItem -Path build\\app\\outputs\\flutter-apk\\ -Filter "app-*.apk" | Where-Object { $_.LastWriteTime -gt (Get-Date).AddMinutes(-10) } | ForEach-Object {
    $arch = $_.Name -replace 'app-', '' -replace '-release.apk', ''
    $newName = "relaunch-$arch-$date.apk"
    Copy-Item $_.FullName "build\\app\\outputs\\flutter-apk\\$newName"
    Write-Output "已创建: $newName ($([math]::Round($_.Length / 1MB, 2)) MB)"
}
\`\`\`

# Dart
[https://dart.cn/language](https://dart.cn/language)

## 变量
\`\`\`dart
var a = 1;
\`\`\`

## 常量
**const**

编译时常量

\`\`\`dart
const a = 1;
\`\`\`

**final**

运行时常量

\`\`\`dart
final a = 1;
\`\`\`

## 常用类型
### String
+ 模板字符串

\`\`\`dart
String text = "我要在\${DateTime.now()}吃早饭";
String name = "食堂";
String text = "我要在$name吃早饭";
\`\`\`

### 数字类型
+ int
+ num
+ double

### 布尔类型
+ bool

表示 true 或 false

### 列表类型
+ List

\`\`\`dart
List list = [1, 2, 3];
\`\`\`

+ 常用方法和属性

\`\`\`dart
list.add(4);
list.addAll([5, 6, 7]);
list.remove(4);
list.removeLast();
list.removeRange(0, 2);
\`\`\`

\`\`\`dart
list.forEach((item) {
  print(item);
});
// 是否都满足条件
list.every((item) {
  return item < 5;
});
// 是否有满足条件的
list.where((item) {
  return item < 5;
});
// 常用属性
list.length;
list.last;
list.first;
list.isEmpty;
\`\`\`

### 字典类型
+ Map

\`\`\`dart
Map map = {"name": "张三", "age": 18};
map["name"] = "李四";
print(map["name"]);
\`\`\`

+ 常用方法

\`\`\`dart
map.forEach((key, value) {
  print(key + ":" + value);
});
map.addAll({"sex": "男"});
print(map.containsKey("name"));
print(map.containsValue("张三"));
map.remove("name");
map.clear();
\`\`\`

### 动态类型
+ dynamic

\`\`\`dart
dynamic a = 1;
a = "1";
a = true;
a = [1, 2, 3];
a = {"a": 1};
\`\`\`

+ 与 var 的区别
    1. dynamic：无编译检查，所有方法和属性可以直接调用
    2. var：有编译检查，仅限调用推断的属性和方法

## 空安全机制
+ 通过编辑静态检查将运行时空指针提前暴露
+ 常见空安全操作符

|  操作符  |  符号  |  作用  |  实例  |
| --- | --- | --- | --- |
| 可空类型 | ? | 声明可空变量 | String?<br/>允许 String 为 null |
| 安全访问 | ?. | 对象为 null 跳过操作直接返回 null | user?.name<br/>若 user 为 null 返回 null |
| 非空断言 | !. | 主观保证变量非空（否则崩溃） | name!.length<br/>断言 name 非空 |
| 空合并 | ?? | 左侧为 null 返回右侧默认值 | name ?? "无名氏"<br/>name 为 null 返回"无名氏" |


## 算术运算符
+ ~/：整除

## 函数
### 可选位置参数
+ 可选参数必须位于必传参数后面
+ 传递时按照顺序传递
+ 可以设置默认值

\`\`\`dart
void main(List<String> args) {
  print(func("a"));
  print(func("a", "b"));
  print(func("a", "b", "c"));
}

String func(String a, [String? b, String? c = "c"]) {
  return a + (b ?? "默认值b") + (c ?? "默认值c");
}

// 输出：
a默认值bc
abc
abc
\`\`\`

### 可选命名参数
+ 可选参数必须位于必传参数后面
+ 按照 \` 参数名: 值 \`传递，无需关注顺序
+ 可以设置默认值

\`\`\`dart
void main(List<String> args) {
  print(func("张三"));
  print(func("张三", age: 18));
  print(func("张三", age: 18, sex: "男"));
}

String func(String name, {int? age = 10, String? sex = "未知"}) {
  return "name: $name, age: $age, sex: $sex";
}

// 输出
name: 张三, age: 10, sex: 未知
name: 张三, age: 18, sex: 未知
name: 张三, age: 18, sex: 男
\`\`\`

### 匿名函数
\`\`\`dart
void main(List<String> args) {
  test2(test);
}

Function test = () {
  print("test");
};

void test2(Function f) {
  f();
}
\`\`\`

### 箭头函数
\`\`\`dart
void main(List<String> args) {
  test2(test);
}

Function test = () {
  print("test");
};

void test2(Function f) => f();
\`\`\`

## 类
### 命名构造函数和构造函数语法糖
\`\`\`dart
void main(List<String> args) {
  Person p = Person("张三", 18, "男");
  Person p1 = Person.create("张三", 18, "男");
  p.show();
  p1.show();
}

class Person {
  String? name;
  int? age;
  String? sex;
  Person(this.name, this.age, this.sex);
  Person.create(this.name, this.age, this.sex);
  void show() {
    print("姓名：$name");
    print("年龄：$age");
    print("性别：$sex");
  }
}
\`\`\`

### 公有属性和私有属性
+ 私有属性用下划线 \`_\`区分
+ 私有属性不可用构造函数语法糖赋值

\`\`\`dart
void main(List<String> args) {
  Person p = Person.create("张三", age: 18, sex: "男");
  p.show();
}

class Person {
  String? name;
  int? _age;
  String? _sex;
  Person(this.name);
  Person.create(this.name, {int? age, String? sex}) {
    this._age = age;
    this._sex = sex;
  }
  void show() {
    print("姓名：$name");
    print("年龄：$_age");
    print("性别：$_sex");
  }
}
\`\`\`

### 继承和重写
+ dart 属于单继承，一个类只能拥有一个父类
+ 子类不会继承父类构造函数，必须通过 \`super\`调用父类构造函数确保父类正确初始化

\`\`\`dart
void main(List<String> args) {
  Child child = Child("张三", 18, "男");
  child.show();
}

class Person {
  String? name;
  int? age;
  Person(this.name, this.age);
  void show() {
    print("姓名：$name");
    print("年龄：$age");
  }
}

class Child extends Person {
  String? sex;
  Child(String name, int age, this.sex) : super(name, age);
  @override
  void show() {
    print("姓名：$name");
    print("年龄：$age");
    print("性别：$sex");
  }
}
\`\`\`

\`\`\`dart
void main(List<String> args) {
  Child child = Child(name: "张三", age: 18, sex: "男");
  child.show();
}

class Person {
  String? name;
  int? age;
  Person({this.name, this.age});
  void show() {
    print("姓名：$name");
    print("年龄：$age");
  }
}

class Child extends Person {
  String? sex;
  Child({String? name, int? age, this.sex}) : super(name: name, age: age);
  @override
  void show() {
    print("姓名：$name");
    print("年龄：$age");
    print("性别：$sex");
  }
}
\`\`\`

### 抽象类和接口
\`\`\`dart
void main(List<String> args) {
  PayBase wxPay = WxPay();
  wxPay.pay();
  PayBase aliPay = AliPay();
  aliPay.pay();
}

abstract class PayBase {
  void pay();
}

class WxPay implements PayBase {
  @override
  void pay() {
    print("微信支付");
  }
}

class AliPay implements PayBase {
  @override
  void pay() {
    print("支付宝支付");
  }
}
\`\`\`

### 类的混入
+ 不用传统继承的情况下，向类中添加新的功能
+ mixmin 定义一个对象
+ with 将定义的对象混入当前对象
+ 一个类支持 with 多个 mixin，优先级遵循“后来居上”原则，即后混入的会覆盖先混入的同名方法

\`\`\`dart
void main(List<String> args) {
  Student student = Student(name: "小明");
  student.song(student.name!);
  Teacher teacher = Teacher(name: "老张");
  teacher.song(teacher.name!);
}

mixin Base {
  void song(String name) {
    print("\${name}会唱歌");
  }
}

class Student with Base {
  String? name;
  int? age;
  Student({this.name, this.age});
}

class Teacher with Base {
  String? name;
  int? age;
  Teacher({this.name, this.age});
}
\`\`\`

## 泛型
\`\`\`dart
void main(List<String> args) {
  Teacher teacher1 = Teacher(students: ["小王", "小明"], name: "老张", age: 35);
  Teacher teacher2 = Teacher(students: ["小李", "小丽"], name: "老赵", age: 43);
  if (swapTeacher(teacher1, teacher2)) {
    print(teacher1);
    print(teacher2);
  }
}

class Teacher<T> {
  List<String>? students;
  T? name;
  int? age;
  Teacher({this.students, this.name, this.age});

  @override
  String toString() => 'Teacher(students: $students, name: $name, age: $age)';
}

bool swapTeacher<T>(Teacher<T> teacher1, Teacher<T> teacher2) {
  if (teacher1.students != null && teacher2.students != null) {
    List<String> students = teacher1.students!;
    teacher1.students = teacher2.students;
    teacher2.students = students;
    return true;
  }
  return false;
}
\`\`\`

## 异步编程
### 事件循环
+ dart 是单线程语言
+ dart 采用单线程+时间循环机制完成耗时任务的处理
+ 耗时任务：
    - 执行同步代码 => 执行微任务队列 => 执行任务队列 => 结束
+ 微任务队列：\`Future.microtask()\`
+ 事件队列：\`Future\`\`Future.delayed()\`\`I/O 操作（文件，网络）\`等

### Future-then/catchError
+ Future 代表一个异步操作的最终结果
+ 状态：Uncompleted（等待），Completed with a value（成功），Completed with a error（失败）
+ 创建：\`Future(() {})\`

\`\`\`dart
void main(List<String> args) {
  Future<String> f = Future(() {
    throw Exception("错误");
  });
  f.then((value) {
    print(value);
  });
  f.catchError((error) {
    print(error);
  });
}
\`\`\`

**链式调用**

\`\`\`dart
void main(List<String> args) {
  Future(() => "Hello World")
      .then((value) => Future(() => "task1"))
      .then((value) => Future(() => "task2"))
      .then((value) => Future(() => "task3"))
      .then((value) {
        print(value);
        throw Exception("错误");
      })
      .catchError((error) => print(error.toString()));
}

// 输出：
task3
Exception: 错误
\`\`\`

### Future-async/await
+ 除了 then/catchError 还可以通过 async/await 实现异步编程
+ await 总是等到 Future 执行成功才继续执行，async 和 await 是必须配套的

\`\`\`dart
void main(List<String> args) {
  func();
}

void func() async {
  try {
    await Future(() {
      // Future 执行成功才执行
      throw Exception();
    });
  } catch (e) {
    print("执行失败逻辑");
  }
}
\`\`\`

**推荐使用 async/await**

# Flutter
[https://docs.flutter.cn/get-started/fundamentals/widgets](https://docs.flutter.cn/get-started/fundamentals/widgets)

## 组件
### 路由
\`\`\`dart
home: HomePage(),
routes: {
  '/homepage': (context) => HomePage(),
  '/settingpage': (context) => SettingPage(),
},
\`\`\`

外部文件路由

\`\`\`dart

\`\`\`

### 侧边栏
\`\`\`dart
drawer: Drawer(
  child: Column(
    children: [
      DrawerHeader(child: Icon(Icons.favorite, size: 48)),
      ListTile(
        leading: Icon(Icons.home),
        title: Text('H O M E'),
        onTap: () {
          Navigator.pop(context);
          Navigator.pushNamed(context, '/homepage');
        },
      ),
      ListTile(
        leading: Icon(Icons.settings),
        title: Text('S E T T I N G S'),
        onTap: () {
          Navigator.pop(context);
          Navigator.pushNamed(context, '/settingpage');
        },
      ),
    ],
  ),
),
\`\`\`

### 底部导航栏


### 侧边抽屉


## 工具控件
### 按钮
\`\`\`dart
import 'package:flutter/material.dart';

class MyButton extends StatelessWidget {
  final String buttonName;
  VoidCallback onPressed;

  MyButton({super.key, required this.buttonName, required this.onPressed});

  @override
  Widget build(BuildContext context) {
    return MaterialButton(
      onPressed: onPressed,
      color: Theme.of(context).primaryColor,
      child: Text(buttonName, style: TextStyle(color: Colors.white)),
    );
  }
}
\`\`\`

调用

\`\`\`dart
MyButton(buttonName: "Save", onPressed: onSave),
\`\`\`

### 弹窗
\`\`\`dart
import 'package:flutter/material.dart';
import 'package:todo_app/core/utils/my_button.dart';

class DialogBox extends StatelessWidget {
  final TextEditingController controller;
  final VoidCallback onSave;
  final VoidCallback onCancel;

  DialogBox({
    super.key,
    required this.controller,
    required this.onSave,
    required this.onCancel,
  });

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      content: Container(
        height: 120,
        child: Column(
          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
          children: [
            TextField(
              controller: controller,
              decoration: InputDecoration(
                border: OutlineInputBorder(),
                hintText: "Add a new todo",
              ),
            ),
            Row(
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                MyButton(buttonName: "Save", onPressed: onSave),
                const SizedBox(width: 8),
                MyButton(buttonName: "Cancel", onPressed: onCancel),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

\`\`\`

调用

\`\`\`dart
showDialog(
  context: context,
  builder: (context) {
    return DialogBox(
      controller: _controller,
      onSave: saveNewTodo,
      onCancel: () => Navigator.of(context).pop(),
    );
  },
);
\`\`\`



## Hive
### 依赖
\`\`\`yaml
dependencies:
  hive: ^2.2.3
  hive_flutter: ^1.1.0
dev_dependencies:
  hive_generator: ^2.0.0
  build_runner: ^2.4.0
\`\`\`



# 常用依赖
## Hive


## Google 底部导航栏
\`\`\`yaml
google_nav_bar: ^5.0.7
\`\`\`

\`\`\`dart
import 'package:flutter/material.dart';
import 'package:google_nav_bar/google_nav_bar.dart';

class BottomNavBar extends StatelessWidget {
  void Function(int)? onTabChange;

  BottomNavBar({super.key, required this.onTabChange});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.symmetric(vertical: 20),
      child: GNav(
        color: Colors.grey[400],
        activeColor: Colors.grey.shade700,
        tabActiveBorder: Border.all(color: Colors.white),
        tabBackgroundColor: Colors.grey.shade100,
        mainAxisAlignment: MainAxisAlignment.center,
        tabBorderRadius: 16,
        onTabChange: (value) => onTabChange!(value),
        tabs: const [
          GButton(icon: Icons.home, text: 'Shop'),
          GButton(icon: Icons.shopping_bag_rounded, text: 'Cart'),
        ],
      ),
    );
  }
}

\`\`\`

\`\`\`dart
import 'package:flutter/material.dart';
import 'package:sneaker_shopping_cart/components/bottom_nav_bar.dart';
import 'package:sneaker_shopping_cart/pages/cart_page.dart';
import 'package:sneaker_shopping_cart/pages/shop_page.dart';

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  int _selectedIndex = 0;

  void navigateBottomBar(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }

  final List<Widget> _pages = [const ShopPage(), const CartPage()];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[300],
      bottomNavigationBar: BottomNavBar(
        onTabChange: (index) => navigateBottomBar(index),
      ),
      body: _pages[_selectedIndex],
    );
  }
}
\`\`\`
`,K=`---
title: '为什么要写纯静态土豆博客'
date: '2026-03-03'
tags: ['日常']
excerpt: '记录一下写博客的过程'
coverImage: ''
---

## 为什么要写这个博客项目

之前写过Spring Boot + Vue版本的个人博客，但是前端很多代码都是AI写的。 所以想自己从0开始写个能访问的静态博客。
刚开始是打算用纯HTML+CSS+JS写，但是发现耦合度太高了，最后还是选择使用Vue来写，顺便还能学一学

### 第一代博客

[第一代博客的项目地址](https://gitee.com/tudouza1/tudou-blog)

![首页](../../public/img/UserHomePage.png)
![管理员登录](../../public/img/LoginPage.png)
![管理员首页](../../public/img/AdminHomePage.png)
![文章编辑](../../public/img/ArticleEdit.png)

### 第二代博客

[第二代博客的项目地址](https://github.com/TuDouZa1/TuDouLog)

![第二代博客首页](../../public/img/tudoulogHome.png)
`,X=`---
title: '乐理'
date: '2026-03-04'
tags: ['乐理']
excerpt: '记录一下学习的乐理基础的知识'
coverImage: ''
---

# 基础
半音：键盘之间相邻的音，E-F和B-C是天然半音

全音：两个半音

纯一度：两个完全相同的音：C 到 C

增一度：

# 和弦
## 基础和弦构成
和弦=半音数的组合

+ 大三和弦 = 4半音 + 3半音
+ 小三和弦 = 3半音 + 4半音

## 和弦调性
先写音阶，再取音阶里的音建和弦

### 大调音阶（明亮）：全-全-半-全-全-全-半
\`主音 → (全) → (全) → (半) → (全) → (全) → (全) → (半) → 主音\`

例：C大调 = C D E F G A B C

### 小调音阶（忧郁）：全-半-全-全-半-全-全
\`主音 → (全) → (半) → (全) → (全) → (半) → (全) → (全) → 主音\`

例：C小调 = C D Eb F G Ab Bb C

### 大调和弦性质模板
\`\`\`plain
音级：Ⅰ   Ⅱm   Ⅲm   Ⅳ   Ⅴ   Ⅵm   Ⅶ°
性质：大  ↓小  ↓小   大  大  ↓小   ↓减
\`\`\`

箭头记忆：第一个"大"之后，向下小三度就是小和弦的循环。

### 小调和弦性质模板
\`\`\`plain
音级：Ⅰm   Ⅱ°   ♭Ⅲ   Ⅳm   Ⅴm   ♭Ⅵ   ♭Ⅶ
性质：小  ↓减   ↑大  ↓小  ↓小   ↑大   ↑大
\`\`\`

## 和弦公式
### 三和弦
| 和弦类型 | 半音公式 | 音程结构 | 标记 | 例：C根音 |
| --- | --- | --- | --- | --- |
| **大三和弦** | 4 + 3 | 大三度+小三度 | C | C-E-G |
| **小三和弦** | 3 + 4 | 小三度+大三度 | Cm | C-Eb-G |
| **减三和弦** | 3 + 3 | 小三度+小三度 | C° | C-Eb-Gb |
| **增三和弦** | 4 + 4 | 大三度+大三度 | C+ | C-E-G# |


### 七和弦
在三和弦基础上再叠加一个三度音（即+3或+4半音）

| 类型 | 堆叠公式 | 标记 | 例：C根音 | 听感 |
| --- | --- | --- | --- | --- |
| **大七和弦** | 大三和弦 + 4半音 | Cmaj7 | C-E-G-B | 梦幻、爵士 |
| **属七和弦** | 大三和弦 + 3半音 | C7 | C-E-G-Bb | 紧张、需解决 |
| **小七和弦** | 小三和弦 + 3半音 | Cm7 | C-Eb-G-Bb | 忧郁、柔和 |
| **半减七和弦** | 减三和弦 + 4半音 | Cm7b5 | C-Eb-Gb-Bb | 神秘、爵士ii级 |
| **减七和弦** | 减三和弦 + 3半音 | C°7 | C-Eb-Gb-Bbb(A) | 极不稳定 |


### 扩展和弦
在七和弦基础上继续叠加三度，但通常省略某些音

| 类型 | 堆叠公式 | 标记 | 实际组成音（C根音） |
| --- | --- | --- | --- |
| **大九和弦** | maj7 + 3半音 | Cmaj9 | C-E-G-B-D (省5音) |
| **属九和弦** | 7 + 3半音 | C9 | C-E-G-Bb-D (省5音) |
| **小九和弦** | m7 + 3半音 | Cm9 | C-Eb-G-Bb-D (省5音) |
| **属十一和弦** | 9 + 3半音 | C11 | C-(E)-G-Bb-D-F (省3音) |
| **属十三和弦** | 11 + 4半音 | C13 | C-(E)-(G)-Bb-D-F-A (省3/5音) |


### 变化/加音和弦
| 类型 | 公式 | 标记 | 例：C根音 | 用途 |
| --- | --- | --- | --- | --- |
| **挂四和弦** | 根音+4半音+7半音 | Csus4 | C-F-G | 替代三和弦，制造悬浮 |
| **挂二和弦** | 根音+2半音+7半音 | Csus2 | C-D-G | 更柔和 |
| **六和弦** | 大三+大三和弦+2半音 | C6 | C-E-G-A | 复古、终 |
| **小六和弦** | 小三+大三和弦+2半音 | Cm6 | C-Eb-G-A | 爵士 |
| **增七和弦** | 增三和弦 + 3半音 | C+7 | C-E-G#-Bb | 极紧张 |
| **加九和弦** | 大三和弦 + 3半音+ | Cadd9 | C-E-G-D | 不省音，更饱满 |


## 和弦转位
和弦转位是指将和弦的低音（根音）移到其他音高位置，使得和弦中的某个非根音成为最低音。转位后，和弦的音程结构发生了变化，但和弦的组成音保持不变。

**原位和弦**：以根音为最低音的和弦
**转位和弦**：以三音、五音或七音为最低音的和弦

### **三和弦的转位**（两个）
+ **第一转位**（六和弦）：以三音为低音
    - 标记：数字 **6** 或 **6/3**
    - 例如：C大调主和弦 1-3-5 → 第一转位：3-5-1（低音是3）
+ **第二转位**（四六和弦）：以五音为低音
    - 标记：数字 **6/4**
    - 例如：C大调主和弦 1-3-5 → 第二转位：5-1-3（低音是5）

### **七和弦的转位**（三个）
+ **第一转位**（五六和弦）：以三音为低音
    - 标记：**6/5** 或 **5/6**
+ **第二转位**（三四和弦）：以五音为低音
    - 标记：**4/3**
+ **第三转位**（二和弦）：以七音为低音
    - 标记：**2** 或 **4/2**

## 写和弦流程
目标：写B大调和弦进行

1. 写音阶（全全半全全全半）：B C# D# E F# G# A# B
2. 套模板（大-小-小-大-大-小-减）：B C#m D#m E F# G#m A#°
3. 选走向（流行）：B - G#m - E - F#
4. 按需加七音：Bmaj7 - G#m7 - E - F#7
`,Q=`---
title: 'OKLCH色彩'
date: '2026-03-01'
tags: ['前端', 'UI', 'CSS']
excerpt: 'oklch() 基于 Oklab 色彩空间，是 CSS 颜色表示的重大进步，它让颜色的亮度、色度、色相在感知上解耦，极大简化了动态配色、渐变生成和暗色主题的实现。'
coverImage: 'oklch.png'
---

> 其实我也不会这个配色，等我学会了继续写

# 资源推荐

[OKLCH 颜色选择器](https://oklch.net/zh-CN#0.7,0.1,180,100)

# 为什么选择OKLCH色彩

oklch 是 CSS 颜色表示的重大进步，它让颜色的亮度、色度、色相在感知上解耦，极大简化了动态配色、渐变生成和暗色主题的实现。
总之很先进用解决了以前配色的各种问题，就完事了，不用担心兼容性问题，有简单的解决方法。
这里主要讲用法

# \`oklch()\` 语法

\`\`\`text
oklch(L C H [ / A])
\`\`\`

L（亮度）：取值范围 0% ~ 100%，或数值 0 ~ 1。0% 为纯黑，100% 为纯白。

C（色度）：无单位数值，理论无上限，但实际显示器色域内通常不超过 0.4（约 0.37 为 sRGB 色域边界）。数值越大颜色越鲜艳。

H（色相）：角度值 0deg ~ 360deg，0deg 对应红色，90deg 对应黄色，180deg 对应绿色，270deg 对应蓝色。

A（透明度）：可选，0 ~ 1 或百分比，默认为 1。

## 演示

\`\`\`css
.color-example {
    background-color: oklch(50% 0.2 200deg); /* 带角度的蓝绿色 */
    color: oklch(80% 0.15 30deg / 0.8); /* 半透明暖橙 */
}
\`\`\`

<DemoPreview>
<template #preview>
<div style="background-color: oklch(50% 0.2 200deg);color: oklch(80% 0.15 30deg / 0.8);">
你好
</div>
</template>
</DemoPreview>
`,Z=`---
title: '配置OpenCodeWeb通过内网穿透实现远程控制OpenCode'
date: '2026-07-07'
tags: ['AI工具', 'OpenCode', '教程', '内网穿透']
excerpt: '配置OpenCodeWeb和内网穿透，实现其他设备远程控制本地OpenCode'
coverImage: 'opencode-web.png'
---

# 配置内网穿透
## 下载 Sakura Frp
先注册账号：https://www.natfrp.com/  
然后下载软件并登录账号：https://www.natfrp.com/tunnel/download
## 配置 Sakura Frp
**新建隧道**  
节点随便选择一个通用节点，类型选择 TCP，隧道名随意，本地端口填 4096，然后创建完并开启  
到日志页面看公网链接：

![opencode-web_1.png](../../public/img/opencode-web_1.png)

# 启动 opencode web
终端输入
\`\`\`bash
$env:OPENCODE_SERVER_PASSWORD = "密码"
opencode web --hostname 0.0.0.0 --port 4096
\`\`\`
但是这个密码只是临时设置的，如果要长期使用这个密码而不是每次都设置临时密码，可以直接在系统环境变量里直接设置

![opencode-web_2.png](../../public/img/opencode-web_2.png)

设置完后重开 PowerShell 并启动 opencode web，没有提示\`! OPENCODE_SERVER_PASSWORD is not set\`密码就是设置成功了

![opencode-web_3.png](../../public/img/opencode-web_3.png)

# 访问 opencode web

现在就是配置完了，可以尝试访问 Sakura Frp 中的外网链接，同时前缀加上\`https://\` ，例如：\`https://frp-use.com:12345/\` 此时浏览器会有网站证书危险提示直接无视继续访问即可，因为内网穿透没有域名和网站证书如果只是自己使用无视即可。  

![opencode-web_5.png](../../public/img/opencode-web_5.png)

然后进入opencode web界面后提示输入用户名和密码，用户名：\`opencode\` ，密码就是刚刚自己在环境变量里设置的

![opencode-web_4.png](../../public/img/opencode-web_4.png)

登录后就可以在其他的设备来控制本地电脑的 opencode 了

![opencode-web.png](../../public/img/cover/opencode-web.png)
`,Y=`---
title: 'Windows下安装OpenCode并配置oh-my-openagent和superpowers'
date: '2026-05-20'
tags: ['AI工具', 'OpenCode', '教程']
excerpt: '从零开始在Windows上安装OpenCode终端AI编码助手，并配置oh-my-openagent和superpowers插件'
coverImage: 'opencode-install.png'
---

> 文章使用AI润色

## 前言

OpenCode是一个开源的终端AI编码助手，支持多种LLM提供商。搭配oh-my-openagent（OmO）和superpowers插件后，可以获得强大的AI开发团队编排能力。本篇记录在Windows下的完整安装配置过程。

官网：https://opencode.ai/zh

官方文档：https://opencode.ai/docs/zh-cn

## 环境要求

- **操作系统**：Windows 10/11
- **Node.js**：>= 20.19.0
- **包管理器**：bun（推荐）/ npm / pnpm
- **终端**：Windows Terminal（推荐）

## 一、安装OpenCode

Windows下有几种安装方式，任选其一：

### 方式一：使用Scoop（推荐）

\`\`\`bash
scoop install opencode
\`\`\`

### 方式二：使用Chocolatey

以管理员身份打开PowerShell：

\`\`\`bash
choco install opencode
\`\`\`

### 方式三：使用npm

\`\`\`bash
npm install -g opencode-ai
\`\`\`

### 方式四：使用WSL（体验最佳）

Windows下使用WSL（Windows Subsystem for Linux）能获得最完整的体验：

\`\`\`bash
# 在WSL终端中执行
curl -fsSL https://opencode.ai/install | bash
\`\`\`

### 验证安装

\`\`\`bash
opencode --version
\`\`\`

看到版本号即表示安装成功。

## 二、配置Shell（解决PowerShell下bash命令不兼容问题）

OpenCode生成的指令默认使用bash语法（如\`&&\`、\`set VAR=value\`等），但Windows自带的PowerShell 5.1并不支持\`&&\`操作符，直接执行会报错：

\`\`\`
&& 运算符在此版本的 PowerShell 中无效
\`\`\`

### 解决方法：配置Git Bash

如果你已经安装了Git for Windows（大概率已装），自带的Git Bash可以直接在OpenCode中使用。

先把 Git 安装目录下的 bash 配置到环境变量 path 里，如： \`D:\\software\\Git\\bin\` 

有两种配置方式：

#### 方式一：全局配置（推荐）

在OpenCode全局配置文件\`"C:\\Users\\TuDouZai\\.config\\opencode\\opencode.json"\`中添加\`shell\`字段：

\`\`\`json
{
  "shell": "bash"
}
\`\`\`

添加后全局生效，所有项目都能使用bash执行命令。

#### 方式二：项目级配置

在项目根目录新建\`opencode.json\`（如已有则直接编辑），同样添加\`shell\`字段：

\`\`\`json
{
  "shell": "bash"
}
\`\`\`

项目级配置会覆盖全局配置，适合不同项目使用不同终端的情况。

### 验证

重启OpenCode后，shell命令就会通过Git Bash执行，\`&&\`、\`set\`、\`>\`等bash语法全部正常。

### 其他方案

- **使用WSL**：WSL里是原生Linux bash，不存在兼容问题，也是OpenCode官方推荐的方式
- **升级PowerShell 7+**：PS7支持\`&&\`操作符，但\`set VAR=value\`这类bash赋值语法仍需留意

> 其实安装opencode配置好shell后就可以让ai自己来安装插件了

## 三、安装Bun

oh-my-openagent的安装推荐使用bun，先安装bun：

\`\`\`powershell
powershell -c "irm bun.sh/install.ps1 | iex"
\`\`\`

安装完成后验证：

\`\`\`bash
bun --version
\`\`\`

## 四、安装oh-my-openagent

oh-my-openagent（原oh-my-opencode）是一个强大的AI开发代理编排框架，提供纪律代理（Discipline Agents）、团队模式（Team Mode）、Hash锚定编辑、LSP集成等功能。

GitHub地址：[https://github.com/code-yeongyu/oh-my-openagent](https://github.com/code-yeongyu/oh-my-openagent)

### 安装命令

\`\`\`bash
bunx oh-my-openagent install
\`\`\`

安装过程会自动完成以下操作：
1. 安装插件到OpenCode
2. 配置默认模型和代理
3. 生成项目配置文件（\`.opencode/oh-my-openagent.jsonc\`）

### 验证oh-my-openagent

在项目根目录运行OpenCode：

\`\`\`bash
opencode
\`\`\`

进入TUI后，输入\`ulw\`（或\`ultrawork\`），如果正常响应说明安装成功。

## 五、安装superpowers插件

superpowers插件提供了丰富的开发技能，包括Playwright浏览器自动化、Git原子提交、前端UI/UX设计、代码审查等。

### 配置步骤

1. **找到OpenCode配置文件**

   全局配置文件位于 \`~/.config/opencode/opencode.json\`（即 \`C:\\Users\\你的用户名\\.config\\opencode\\opencode.json\`）

2. **添加superpowers插件**

   在\`plugins\`数组中添加\`"superpowers@git+https://github.com/obra/superpowers.git"\`：

   \`\`\`json
   {
     "plugins": [
       "superpowers@git+https://github.com/obra/superpowers.git"
     ]
   }
   \`\`\`

   如果已有其他插件，追加到数组末尾即可：

   \`\`\`json
   {
     "plugins": [
       "oh-my-openagent",
       "superpowers@git+https://github.com/obra/superpowers.git"
     ]
   }
   \`\`\`

3. **保存文件**

4. **重启OpenCode**

   完全退出当前OpenCode会话，然后重新启动：

   \`\`\`bash
   opencode
   \`\`\`

### 验证superpowers

在OpenCode中发送：

\`\`\`
do you have superpowers?
\`\`\`

如果返回确认有superpowers（列出可用技能等），则表示配置成功。

## 六、配置模型

OpenCode 提供了一套完整的模型配置体系，从全局默认模型到每个子代理的专用模型，均可按需设置，无需 API Key。

### OpenCode Zen 免费模型

查看所有可用免费模型：

\`\`\`bash
# 列出 OpenCode Zen 所有可用模型
opencode models opencode
\`\`\`

> 不同时间免费模型都不一样，要自己查一下！

### 设置 OpenCode 默认模型

在全局配置文件（\`~/.config/opencode/opencode.json\`）中添加 \`model\` 字段：

\`\`\`json
{
  "$schema": "https://opencode.ai/config.json",
  "model": "opencode/deepseek-v4-flash-free",
  "small_model": "opencode/deepseek-v4-flash-free"
}
\`\`\`

- \`model\`：主模型，用于编码和复杂任务
- \`small_model\`：轻量模型，用于标题生成等简单任务。不设置时会自动选择更便宜的模型

### 配置 oh-my-openagent 多 Agent 模型

oh-my-openagent 编排了多个专用子代理，每个代理可以根据任务特点使用不同的模型，在性能和成本之间取得平衡。

配置文件位于 \`~/.config/opencode/oh-my-openagent.json\`，分为 \`agents\`（子代理）和 \`categories\`（任务分类）两部分：

> 这些配置都可以让 ai 去配置

\`\`\`json
{
  "$schema": "https://raw.githubusercontent.com/code-yeongyu/oh-my-openagent/dev/assets/oh-my-opencode.schema.json",
  "agents": {
    "hephaestus": { "model": "opencode/minimax-m2.5-free" },
    "oracle":      { "model": "opencode/big-pickle" },
    "librarian":   { "model": "opencode/qwen3.6-plus-free" },
    "explore":     { "model": "opencode/qwen3.6-plus-free" },
    "prometheus":  { "model": "opencode/big-pickle" },
    "metis":       { "model": "opencode/qwen3.6-plus-free" },
    "momus":       { "model": "opencode/big-pickle" },
    "multimodal-looker": { "model": "opencode/qwen3.6-plus-free" },
    "atlas":       { "model": "opencode/nemotron-3-super-free" },
    "sisyphus-junior": { "model": "opencode/deepseek-v4-flash-free" }
  },
  "categories": {
    "visual-engineering": { "model": "opencode/qwen3.6-plus-free" },
    "ultrabrain":         { "model": "opencode/big-pickle" },
    "deep":               { "model": "opencode/big-pickle" },
    "artistry":           { "model": "opencode/deepseek-v4-flash-free" },
    "quick":              { "model": "opencode/qwen3.6-plus-free" },
    "unspecified-low":    { "model": "opencode/qwen3.6-plus-free" },
    "unspecified-high":   { "model": "opencode/minimax-m2.5-free" },
    "writing":            { "model": "opencode/qwen3.6-plus-free" }
  }
}
\`\`\`

#### Agent 分工与推荐模型

| Agent | 职责 | 推荐模型 |
|-------|------|---------|
| \`hephaestus\` | 执行代理，处理具体编码任务 | \`minimax-m2.5-free\` |
| \`oracle\` | 高IQ顾问，架构/调试难题 | \`big-pickle\`（强模型） |
| \`librarian\` | 搜索外部文档和代码示例 | \`qwen3.6-plus-free\` |
| \`explore\` | 搜索代码库结构和模式 | \`qwen3.6-plus-free\` |
| \`prometheus\` | 任务规划和分解 | \`big-pickle\`（强模型） |
| \`metis\` | 需求分析，识别模糊点 | \`qwen3.6-plus-free\` |
| \`momus\` | 审查计划，发现遗漏 | \`big-pickle\`（强模型） |
| \`sisyphus-junior\` | 执行委派的具体子任务 | \`deepseek-v4-flash-free\` |

#### Category 分工与推荐模型

| Category | 适用场景 | 推荐模型 |
|----------|---------|---------|
| \`visual-engineering\` | 前端UI/UX、样式、动画 | \`qwen3.6-plus-free\` |
| \`ultrabrain\` | 复杂逻辑、架构决策 | \`big-pickle\`（强模型） |
| \`deep\` | 深度研究 + 端到端实现 | \`big-pickle\`（强模型） |
| \`artistry\` | 创意类、非常规方案 | \`deepseek-v4-flash-free\` |
| \`quick\` | 简单修改、修 typo | \`qwen3.6-plus-free\` |
| \`writing\` | 文档、技术写作 | \`qwen3.6-plus-free\` |

#### 配置思路

合理分配模型的核心原则：

- **高推理需求**（oracle、prometheus、momus、ultrabrain、deep）→ 用 \`big-pickle\` 等强模型，保证输出质量
- **高频搜索**（explore、librarian）→ 用 \`qwen3.6-plus-free\`，速度快 token 消耗大但免费
- **视觉/前端**（visual-engineering）→ \`qwen3.6-plus-free\` 或更强模型
- **简单任务**（quick、unspecified-low）→ 最便宜的模型即可

### 配置优先级

模型选择遵循以下优先级（从上到下递减）：

| 优先级 | 配置方式 | 说明 |
|--------|---------|------|
| 1 | \`opencode -m provider/model\` | 命令行参数，临时切换 |
| 2 | 项目根目录的 \`opencode.json\` | 项目级配置，覆盖全局 |
| 3 | \`~/.config/opencode/opencode.json\` | 全局配置，用户偏好 |
| 4 | 最近使用的模型 | OpenCode 自动记住 |
| 5 | 内置默认 | 兜底 |

### 验证配置

启动 OpenCode 后输入 \`/models\`，查看当前使用的模型，确认显示为目标模型 ID。

## 七、常用命令与功能

### OpenCode 内置命令

进入OpenCode的TUI后，直接输入斜杠命令即可调用：

| 命令 | 说明 |
|------|------|
| \`/init\` | 初始化项目或配置文件 |
| \`/connect\` | 连接或切换LLM提供商 |
| \`/models\` | 查看和选择可用模型 |
| \`/session\` | 会话管理（列表、查看、搜索历史会话） |
| \`/themes\` | 切换TUI主题 |
| \`/editor\` | 在编辑器中打开当前文件 |
| \`/export\` | 导出当前会话内容 |
| \`/refactor\` | 智能重构（LSP + AST-grep + TDD验证） |
| \`/review\` | 代码审查 |
| \`/handoff\` | 生成上下文摘要，用于跨会话继续工作 |
| \`/start-work\` | 从Prometheus规划开始执行任务 |
| \`/hyperplan\` | 多代理对抗式规划（5个代理交叉评审） |
| \`/ralph-loop\` | 启动自我反馈循环，持续优化直到完成 |
| \`/ulw-loop\` | 启动ultrawork循环，不完成不停止 |
| \`/remove-ai-slops\` | 移除代码中的AI风格代码 |
| \`/cancel-ralph\` | 取消正在运行的Ralph Loop |
| \`/stop-continuation\` | 停止所有持续执行机制 |
| \`/init-deep\` | 自动生成项目层级AGENTS.md知识库 |

> **提示**：输入 \`/\` 后按 Tab 可以看到当前可用的所有命令列表。

### oh-my-openagent 核心功能

| 功能 | 说明 |
|------|------|
| \`ulw\` / \`ultrawork\` | 一键激活所有代理，不完成不罢休 |
| \`/start-work\` | Prometheus规划器，先访谈再执行 |
| \`/init-deep\` | 自动生成项目层级AGENTS.md文件 |
| Team Mode | 多代理并行协作，实时可视化 |

### superpowers 内置技能

| 技能 | 用途 |
|------|------|
| \`brainstorming\` | 创意工作前的需求探索和设计 |
| \`systematic-debugging\` | 系统化的bug调试流程 |
| \`test-driven-development\` | TDD测试驱动开发 |
| \`git-master\` | Git原子提交、变基、历史搜索 |
| \`playwright\` | 浏览器自动化（验证、测试、爬虫） |
| \`frontend-ui-ux\` | 前端UI/UX设计开发 |
| \`verification-before-completion\` | 完成任务前自动验证 |
| \`writing-plans\` | 编写实施计划 |
| \`dispatching-parallel-agents\` | 并行分发独立任务 |

## 总结

整个安装配置流程：

\`\`\`
安装OpenCode → 配置Shell为Git Bash
安装Bun → 安装oh-my-openagent → 添加superpowers插件 → 配置默认模型与多Agent模型
\`\`\`
`,J=`---
title: '分享一些好用的软件'
date: '2026-03-03'
tags: ['软件推荐']
excerpt: '备份记录一些好用的软件'
coverImage: 'ruanjian-list.png'
---

# PC软件

## 开发软件

**IDEA**：无需多言<br>
**VS CODE**：轻量级IDE，支持配置所有语言，写一些配置文件和不想用JetBrains的可以用<br>
**WebStorm**：现在免费尝试了一下，还不错，就是仅非商业免费<br>
**Sublime Text**：高级记事本，编辑配置文件用，几乎支持所有语言高亮提示，内存占用非常低，也支持插件系统<br>
**Api Fox**：API测试文章生成管理软件，功能很全，占用内存很大，不过apifox的idea插件很好用<br>

## 运维软件

**IShellPro**
：专注于SSH的Shell工具，可视化查看服务器各项数据，多平台原生性能很好内存占用低，账号设置同步等需要氪金，基础功能免费<br>
[**WinSCP**](https://lestore.lenovo.com/detail/2331)：Windows的远程服务器文件传输管理工具，文件传输很稳定<br>
**Tiny RDM**：多平台可视化的Redis管理工具<br>
[**glogg**](https://glogg.bonnefon.org/)：看大型日志加载搜索速度快<br>
**Navicat**：数据库管理工具，Lite版免费，但是也可以尝试开源的\`DBeaver\`<br>
**Trae CN**：字节的免费AI IDE，用着还可以<br>

## 工具软件

[**SteamCommunity302**](https://www.dogfight360.com/blog/18682/)：修改host访问Steam和被墙网站的工具<br>
[**Motrix**](https://motrix.app/zh-CN/)：下载工具（Electron框架，内存占用较大）<br>
[**PDFgear**](https://www.pdfgear.com/zh/)：PDF转各种格式<br>
**HiBit Uninstall**：Windows卸载工具，能清理卸载残留文件注册表<br>
**Everything**：本地文件搜索索引神器<br>
[**mpv.net**](https://www.lckp.top/thing/mpvnet_cm/)：本地播放器，开箱即用<br>
**UU远程**：开箱即用免费远程控制软件，功能完善且稳定简单<br>
[**CefFlashBrowser**](https://github.com/Mzying2001/CefFlashBrowser)：内置Flash的浏览器，专门用来访问Flash<br>
[**Wub**](https://caiyun.139.com/w/i/2tyanW5HRDSch)：Windows停止更新软件\`提取码:21i6\`<br>
**WizTree**：可视化磁盘占用分析，清理垃圾用<br>
**图吧工具箱**：工具合集<br>
[**Auto Dark Mode**](https://github.com/AutoDarkMode/Windows-Auto-Night-Mode)：设置时间段自动切换Windows颜色，类似手机自动切换夜间模式<br>

## 日常软件

[**Typora**](链接:https://caiyun.139.com/w/i/2tyavBEw5Jxag)：本地Markdown编辑器，可以搭配坚果云实现云端同步，需要付费使用
\`提取码:dvle\`<br>
**PixPin**：截图软件，功能很全且免费<br>
[**搜狗输入法精简版8.2**](https://caiyun.139.com/w/i/2tyaob6RpfCyg)：二十几MB内存占用，支持第三方皮肤和账号同步，功能完整
\`提取码:dbi3\`<br>
[**Tai**](https://github.com/Planshit/Tai)：Windows软件使用时间统计工具，类似手机的屏幕使用时间统计<br>
**WPS**
：WPS人人皆知，在这里写出来是想说，office文档处理还得是WPS，因为WPS大文档的兼容性以及加载和阅读体验很好，
而开源office类软件在大型文档以及兼容性方面的支持很差，WPS只要在设置里把所有推广设置全部关闭用起来还是可以的<br>

# 安卓软件

## 工具软件

**ZArchiver Pro**：解压缩软件<br>
**RAR**：解压RAR特殊格式<br>
**NCM Dump**：解密网易云音乐下载的ncm格式文件为mp3文件<br>
**Shizuku**：激活后让手机暂时拥有root权限<br>
**MT管理器破解版**：神中神<br>

## 日常软件

**Via浏览器**：界面支持CSS和JS自定义，支持同步性能很好，就是下载管理器有点问题<br>
**贴吧Lite**：纯净版贴吧<br>
**Simple Live**：纯净版多平台看直播软件<br>
**阅读**：自定义书源阅读软件<br>
**Salt Player**：免费本地音乐播放器<br>
**爱其意**：动漫电视剧电影资源基本都有<br>
**囧次元**：看番的，广告很多<br>
**Lanerc**：看番的，广告较多<br>
**动漫共和国**：看番的，广告较多<br>
**Kazumi**：flutter开发的多平台看番软件，支持自定义源<br>
**LaQoo**：看番的，支持自定义源<br>
**每日漫图**：收集了很多pixiv插画，支持ai超分辨率<br>
**轻小说文库**：看轻小说的<br>

## 游戏软件

**GBA模拟器**：也就是MyBoy，玩经典老游戏用，比如口袋妖怪<br>
**J2ME Loader**：加载jar游戏用<br>
`,nn=`---
title: 'Spring Boot 配置类的学习'
date: '2026-04-01'
tags: ['SpringBoot', '后端']
excerpt: '记录springboot中各种的配置类，由于这些配置类不常写，但是也是很重要的，避免遗忘所以记录'
coverImage: ''
---

> 本人决定转向考公了，所以暂时不写了💀

# 统一返回结构与全局异常处理

## 1. 创建统一返回类 \`Result<T>\`

\`\`\`java
@Data
public class Result<T> {
    private Integer code;
    private String msg;
    private T data;

    private Result(Integer code, String msg, T data) {
        this.code = code;
        this.msg = msg;
        this.data = data;
    }

    public static <T> Result<T> success() {
        return new Result<>(200, "Success", null);
    }

    public static <T> Result<T> success(T data) {
        return new Result<>(200, "Success", data);
    }

    public static <T> Result<T> error(String msg) {
        return error(500, msg); // 默认服务器错误
    }

    public static <T> Result<T> error(Integer code, String msg) {
        return new Result<>(code, msg, null);
    }

    public static <T> Result<T> badRequest(String msg) {
        return error(400, msg);
    }

    public static <T> Result<T> unauthorized(String msg) {
        return error(401, msg);
    }

    public static <T> Result<T> forbidden(String msg) {
        return error(403, msg);
    }

    public static <T> Result<T> notFound(String msg) {
        return error(404, msg);
    }
}
\`\`\`

## 2. 自定义业务异常类

\`\`\`java
@Getter
public class BaseException extends RuntimeException implements Serializable {
    @Serial
    private static final long serialVersionUID = 1L;
    private final Integer code;

    public BaseException(Integer code, String msg) {
        super(msg);
        this.code = code;
    }
}
\`\`\`

\`\`\`java
public class BusinessException extends BaseException implements Serializable {
    @Serial
    private static final long serialVersionUID = 1L;

    public BusinessException(String msg) {
        super(500, msg);
    }
}
\`\`\`

## 3. 全局异常处理器

\`\`\`java
@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {
    // 处理自定义业务异常
    @ExceptionHandler(BusinessException.class)
    public Result<String> handleBusinessException(BusinessException e) {
        log.error("业务异常：{}", e.getMessage());
        return Result.error(e.getCode(), e.getMessage());
    }

    // 处理未捕获异常
    @ExceptionHandler(Exception.class)
    public Result<String> handleException(Exception e) {
        log.error("系统异常：", e); // 打印完整异常内容
        return Result.error(500, e.getMessage());
    }
}
\`\`\`


`,en=`---
title: '算法笔记'
date: '2025-07-21'
tags: ['C++', '算法']
excerpt: '以前打算法竞赛学习记录的笔记'
coverImage: ''
---

> 一些算法模板

# 数组
## 二分法
> 在单调性范围中找出符合条件的数，如单调递增的数组中找到第一个大于等于目标值的下标
>

### [left, right]
+ **更新逻辑**：
    - 如果目标值大于 \`arr[mid]\`，则 \`left = mid + 1\`
    - 如果目标值小于 \`arr[mid]\`，则 \`right = mid - 1\`
    - 如果目标值等于 \`arr[mid]\`，则返回 \`mid\` 或继续查找

\`\`\`cpp
int l = 0, r = max;
while (l <= r) {
    int mid = (l + r) >> 1;
    if (a[mid] >= target) {
        ans = mid;
        r = mid - 1;
    } else {
        l = mid + 1;
    }
}
return ans;
\`\`\`

### [left, right)
+ **更新逻辑**：
    - 如果目标值大于 \`arr[mid]\`，则 \`left = mid + 1\`
    - 如果目标值小于 \`arr[mid]\`，则 \`right = mid\`
    - 如果目标值等于 \`arr[mid]\`，则返回 \`mid\` 或继续查找

\`\`\`cpp
int l = 0, r = max + 1;
while (l < r) {
    int mid = (l + r) >> 1;
    if (a[mid] < target) {
        l = mid + 1;
    } else {
        r = mid;
    }
}
return l;
\`\`\`

## 前缀和和差分
### 一维差分
\`\`\`cpp
long long a[100010], d[100010], prefix[100010];

int main()
{
    ios::sync_with_stdio(0), cin.tie(0), cout.tie(0);
    int n, p, q;
    cin >> n >> p >> q;

    for (int i = 1; i <= n; i++)	cin >> a[i];
    for (int i = 1; i <= n; i++)	d[i] = a[i] - a[i - 1];

    int l, r, x;
    while (p--)
    {
        cin >> l >> r >> x;
        d[l] += x;
        d[r + 1] -= x;
    }

    for (int i = 1; i <= n; i++)
    {
        a[i] = d[i] + a[i - 1];
        prefix[i] = prefix[i - 1] + a[i];
    }

    while (q--)
    {
        cin >> l >> r;
        cout << prefix[r] - prefix[l - 1] << "\\n";
    }
}
\`\`\`

### 二维差分
\`\`\`cpp
int n, m, k;
cin >> n >> m >> k;
for (int i = 1; i <= n; i++) {
    for (int j = 1; j <= m; j++) {
        cin >> a[i][j];
        d[i][j] = a[i][j] - a[i - 1][j] - a[i][j - 1] + a[i - 1][j - 1];
    }
}
while (k--) {
    int x1, y1, x2, y2, v;
    cin >> x1 >> y1 >> x2 >> y2 >> v;
    d[x1][y1] += v;
    d[x2 + 1][y1] -= v;
    d[x1][y2 + 1] -= v;
    d[x2 + 1][y2 + 1] += v;
}
for (int i = 1; i <= n; i++) {
    for (int j = 1; j <= m; j++) {
        a[i][j] = a[i - 1][j] + a[i][j - 1] - a[i - 1][j - 1] + d[i][j];
    }
}
for (int i = 1; i <= n; i++) {
    for (int j = 1; j <= m; j++) {
        cout << a[i][j] << ' ';
    }
    cout << '\\n';
}
\`\`\`



## 树状数组
\`\`\`cpp
ll a[N], c[N], c2[N];

// 树状数组 单点修改 区间查询
/*
题目描述
给定一个大小为n的数组a和q次操作。
每次操作分为下面两种：
"1 k v"：给ak加上v
"2 l r"：查询区间[l,r]的和。
对于每次2操作，输出结果。

输入格式
第一行两个整数n,q。(1≤n,q≤2×10^5)
第二行n个整数表示数组a(−10^5≤ai≤10^5)
接下来q行，每行一个操作。(1≤l≤r≤n,−10^5≤v≤10^5)

输出格式
对于每次2操作，在一行内输出结果。
*/
int n, m;
int low_bit(int num) { return num & -num; }
void updata(ll c[], int pos, int val) {
    while (pos <= n) {
        c[pos] += val;
        pos += low_bit(pos);
    }
}
ll get_sum(ll c[], int pos) {
    ll ans = 0;
    while (pos) {
        ans += c[pos];
        pos -= low_bit(pos);
    }
    return ans;
}
void solve() {
    cin >> n >> m;
    for (int i = 1; i <= n; i++) cin >> a[i];
    for (int i = 1; i <= n; i++) updata(c, i, a[i]);
    for (int i = 1; i <= m; i++) {
        int op;
        cin >> op;
        if (op == 1) {
            int k, v;
            cin >> k >> v;
            updata(c, k, v);
        } else {
            int l, r;
            cin >> l >> r;
            cout << get_sum(c, r) - get_sum(c, l - 1) << '\\n';
        }
    }
}
// 树状数组 区间修改 单点查询
/*
修改a[l] a[r]，只需要updata : c[l] += v; c[r + 1] -= v;
单点查询对c进行get_sum即可
*/
// 树状数组 区间修改 区间查询
/*
题目描述
给定一个大小为n的数组a和q次操作。
每次操作分为下面两种：
"1 l r v"：给区间[l,r]加上v
"2 l r"：查询区间[l,r]的和。
对于每次2操作，输出结果。

输入格式
第一行两个整数n,q。(1≤n,q≤2×10^5)
第二行n个整数表示数组a(−10^5≤ai≤10^5)
接下来q行，每行一个操作。(1≤l≤r≤n,−10^5≤v≤10^5)

输出格式
对于每次2操作，在一行内输出结果。
*/
/*
c[i] = a[i] - a[i-1];
a[i] = c[i] + a[i-1];
sum(1, n)a
= a[1]+a[2]+a[3]+…+a[n-1]+a[n]
= c[1]+(c[1]+c[2])+…+(c[1]+c[2]+…+c[n])
= n*(c[1]+c[2]+…+c[n])-(0*c[1]+1*c[2]+2*c[3]+…+(n-1)*c[n]).
c2[i]=(i-1)*(a[i]-a[i-1])=(i-1)*c[i];
区间修改就有
updata(c[l], val); updata(c[r+1], -val);
updata(c2[l], (l-1)*v); updata(c2[r+1], -r*v);
求和时
sum1 = get_sum(c, r) * r - get_sum(c2,r);                           sum(1, r)
sum2 = get_sum(c, l - 1) * (l - 1) - get_sum(c2, l - 1);            sum(1, l -
1) 所以ans=sum1-sum2;                                                  sum(l, r)
*/
void solve2() {
    cin >> n >> m;
    for (int i = 1; i <= n; i++) cin >> a[i];
    for (int i = 1; i <= n; i++) {
        updata(c, i, a[i] - a[i - 1]);
        updata(c2, i, (i - 1) * (a[i] - a[i - 1]));
    }
    for (int i = 1; i <= m; i++) {
        int op, l, r;
        cin >> op >> l >> r;
        if (op == 1) {
            int v;
            cin >> v;
            updata(c, l, v);
            updata(c, r + 1, -v);
            updata(c2, l, (l - 1) * v);
            updata(c2, r + 1, -r * v);
        } else {
            ll sum1 = r * get_sum(c, r) - get_sum(c2, r);
            ll sum2 = (l - 1) * get_sum(c, l - 1) - get_sum(c2, l - 1);
            cout << sum1 - sum2 << '\\n';
        }
    }
}
\`\`\`

## 离散化
[我的很长，你算一下 | 星码StarryCoding](https://www.starrycoding.com/problem/63)
[求逆序对个数 | 星码StarryCoding](https://www.starrycoding.com/problem/31)

# 字符串
## KMP
\`\`\`cpp
int *kmp_get_next(string &str)
{
    int *next = new int[str.size()];
    next[0] = 0;
    int left = 0, right = 1;
    while (right < str.size())
    {
        if (str[left] == str[right])
            next[right++] = ++left;
        else
        {
            if (left == 0)
                next[right] = 0, right++;
            else
                left = next[left - 1];
        }
    }
    return next;
}

int kmp_search(string &a, string &b, int *next)
{
    int i = 0, j = 0;
    while (i < a.size() && j < b.size())
    {
        if (a[i] == b[j])
            i++, j++;
        else
        {
            if (j == 0)
                i++;
            else
                j = next[j - 1];
        }
    }
    return j == b.size() ? i - j : -1;
}

int main()
{
    string a = "ABABDABACDABABCABAB";
    string b = "ABABCABAB";
    int *next = kmp_get_next(a);
    for (char ch : a)
        cout << ch << ' ';
    puts("");
    for (int i = 0; i < a.size(); i++)
        cout << next[i] << ' ';
    puts("");
    cout << kmp_search(a, b, next);
}
\`\`\`

# 二叉树
## 递归遍历
\`\`\`cpp
void traversal(TreeNode* cur, vector<int>& vec) {
    if (cur == NULL) return;
    traversal(cur->left, vec);  // 左
    traversal(cur->right, vec); // 右
    vec.push_back(cur->val);    // 中
}
\`\`\`

## 统一迭代遍历
\`\`\`cpp
vector<int> preorderTraversal(TreeNode* root) {
    vector<int> result;
    stack<TreeNode*> st;
    if (root != NULL) st.push(root);
    while (!st.empty()) {
        TreeNode* node = st.top();
        st.pop();
        if (node != NULL) {
            if (node->right) st.push(node->right);  // 右
            if (node->left) st.push(node->left);    // 左
            st.push(node);                          // 中
            st.push(NULL);
        } else {
            node = st.top();
            st.pop();
            result.push_back(node->val);
        }
    }
    return result;
}
\`\`\`

## 层序遍历
\`\`\`cpp
vector<vector<int>> levelOrder(TreeNode* root) {
    queue<TreeNode*> que;
    if (root != NULL) que.push(root);
    vector<vector<int>> result;
    while (!que.empty()) {
        int size = que.size();
        vector<int> vec;
        // 这里一定要使用固定大小size，不要使用que.size()，因为que.size是不断变化的
        for (int i = 0; i < size; i++) {
            TreeNode* node = que.front();
            que.pop();
            vec.push_back(node->val);
            if (node->left) que.push(node->left);
            if (node->right) que.push(node->right);
        }
        result.push_back(vec);
    }
    return result;
}
\`\`\`

# 动态规划
## 背包问题
### 01背包
> 每件物品只能取一次，取或不取
>

**二维DP**

\`\`\`cpp
for (int i = 1; i < w.size(); i++) {
    for (int j = 0; j <= bag_size; j++) {
        if (j < w[i]) dp[i][j] = dp[i - 1][j];
        else dp[i][j] = max(dp[i - 1][j], dp[i - 1][j - w[i]] + v[i]);
    }
}
\`\`\`

两层for循环的遍历顺序可以颠倒

**一维DP**

求bag_size容量的背包可以装的最大价值是多少

\`\`\`cpp
int v[N]. w[N];
int dp[N];
dp[0] = 1;
for (int i = 0; i < w.size(); i++) { // 第 i 个物品
    for (int j = bag_size; j >= w[i]; j--) { // 背包的容量为 j
        dp[j] = max(dp[j], dp[j - w[i]] + v[i]);
    }
}
return dp[w.size()];
\`\`\`

求排列组合数

\`\`\`cpp
int bag_size = (target + sum) / 2;
vector<int> dp(bag_size + 1, 0);
dp[0] = 1;
for (int i = 0; i < nums.size(); i++) {
    for (int j = bag_size; j >= nums[i]; j--) {
        dp[j] = dp[j] + dp[j - nums[i]];
        // 不选 nums[j] 的方法数为 dp[j]
        // 选 nums[j] 的方法数为 dp[j - nums[i]]
        // 即减去 nums[j] 的容量后的方法数
    }
}
return dp[bag_size];
\`\`\`

### 完全背包
> 每件物品可以取无数次，不取或取几个
>

**二维DP**

\`\`\`cpp
// 初始化第一个物品的价值
for (int j = w[0]; j <= bag_size; j++) {
    dp[0][j] = dp[0][j - w[0]] + v[0];
}

for (int i = 1; i < w.size(); i++) {
    for (int j = 0; j <= bag_size; j++) {
        if (j < w[i]) dp[i][j] = dp[i - 1][j];
        else dp[i][j] = max(dp[i - 1][j], dp[i][j - w[i]] + v[i]);
    }
}
\`\`\`

遍历顺序无所谓

**一维DP**

\`\`\`cpp
for (int i = 0; i < w.size(); i++) {
    for (int j = w[i]; j <= bag_size; j++) {
        dp[j] = max(dp[j], dp[j - w[i]] + v[i]);
    }
}
\`\`\`

假如背包中有元素 1 5
如果先遍历背包中的元素再遍历背包容量，则有1 5，为组合数
如果先遍历背包容量再遍历背包中的元素，则有1 5和5 1，为排列数

> 记得求排列组合时 DP 是 += 之前的
>

### 多重背包
> 01背包的基础上加了每种物品的数量
>

\`\`\`cpp
int bag_size, n; // 背包容量， 物品种类
vector<int> w(n); // 每种物品的重量
vector<int> v(n); // 每种物品的价值
vector<int> num(n); // 每种物品的数量
vector<int> dp(bag_size + 1, 0);
for (int i = 0; i < n; i++) { // 遍历每种物品
    for (int j = bag_size; j >= w[i]; j--) { // 遍历背包容量
        for (int k = 1; k <= num[i] && j >= k * w[i]; k++) { // 遍历物品的数量
            dp[j] = max(dp[j], dp[j - k * w[i]] + k * v[i]);
        }
    }
}
return dp[bag_size];
\`\`\`

[多重背包问题的二进制优化解决方案,-CSDN博客](https://blog.csdn.net/2201_75859030/article/details/136793133)
这个还没看

## 树状DP
[337. 打家劫舍 III - 力扣（LeetCode）](https://leetcode.cn/problems/house-robber-iii/)

# 图论
## DFS
\`\`\`cpp
vector<int> g[N];

bitset<N> vis;

void dfs(int x) {
    vis[x] = true;
    cout << x << ' ';
    for (auto &y : g[x]) {
        if (vis[y]) continue;
        dfs(y);
    }
}
\`\`\`

## BFS
\`\`\`cpp
void bfs(int st) {
    queue<int> q;
    q.push(st);
    while (!q.empty()) {
        int x = q.front();
        q.pop();
        if (vis[x]) continue;
        vis[x] = true;
        cout << x << ' ';
        for (auto &y : g[x]) {
            if (vis[y]) continue;
            q.push(y);
        }
    }
}
\`\`\`

### 最短路
\`\`\`cpp
void bfs2(int sx, int sy) {  // 查找迷宫最短路
    memset(d, 0x3f, sizeof(d));
    d[sx][sy] = 0;
    queue<pair<int, int>> q;
    q.push({sx, sy});
    vis[sx][sy] = true;
    while (!q.empty()) {
        int x = q.front().first, y = q.front().second;
        q.pop();
        for (int i = 0; i < 4; i++) {
            int nx = x + dir[i][0], ny = y + dir[i][1];
            if (nx > 0 && ny > 0 && nx <= n && ny <= m &&
                d[nx][ny] > d[x][y] + 1 && !mp[nx][ny] && !vis[nx][ny]) {
                d[nx][ny] = d[x][y] + 1;
                q.push({nx, ny});
                vis[nx][ny] = true;
            }
        }
    }
}
\`\`\`

## 并查集
\`\`\`cpp
vector<int> fa = vector<int>(N, 0);

int n, m;

void init() {
    for (int i = 1; i <= n; i++) fa[i] = i;
}

int find(int u) {
    return u == fa[u] ? u : fa[u] = find(fa[u]);
}

bool isSame(int u, int v) {
    return find(u) == find(v);
}

void join(int u, int v) {
    fa[find(v)] = find(u);
}
\`\`\`

## 最小生成树
### Prim
\`\`\`cpp
int n, m; // 点，边
cin >> n >> m;

vector<vector<int>> grid(n + 1, vector<int>(n + 1, 10001));

while (m--) {
    int a, b, c;
    cin >> a >> b >> c;
    grid[a][b] = c;
    grid[b][a] = c; // 无向图
}

vector<int> minDist(n + 1, 10001);
vector<int> isInTree(n + 1, false);

for (int i = 1; i < n; i++) {
    int minVal = INT_MAX;
    int cur = -1;

    for (int j = 1; j <= n; j++) {
        if (!isInTree[j] && minDist[j] < minVal) {
            cur = j;
            minVal = minDist[j];
        }
    }

    isInTree[cur] = true;

    for (int j = 1; j <= n; j++) {
        if (!isInTree[j] && grid[cur][j] < minDist[j]) {
            minDist[j] = grid[cur][j];
        }
    }
}

int result = 0;
for (int i = 2; i <= n; i++) {
    result += minDist[i];
}

cout << result;
\`\`\`

### Kruskal(常用)
\`\`\`cpp
struct Edge {
    int l, r, val;
};

vector<int> fa(N);

void init(int n) {
    for (int i = 1; i <= n; i++) {
        fa[i] = i;
    }
}

int find(int x) {
    return fa[x] == x ? x : fa[x] = find(fa[x]);
}

bool isSame(int u, int v) {
    return find(u) == find(v);
}

void join(int u, int v) {
    fa[find(v)] = find(u);
}

int main() {
    int n, m;
    cin >> n >> m;

    init(n);
    vector<Edge> edges(n + 1);
    while (m--) {
        int a, b, c;
        cin >> a >> b >> c;
        edges.push_back({a, b, c});
    }

    sort(edges.begin(), edges.end(), [](const Edge &a, const Edge &b) { return a.val < b.val; });

    int result = 0;
    for (Edge edge : edges) {
        int x = find(edge.l);
        int y = find(edge.r);
        if (!isSame(x, y)) { // 一条边的两个节点祖先不同，则不在同一个集合（最小生成树）里
            result += edge.val;
            join(x, y);
        }
    }

    cout << result;
}
\`\`\`

## 拓扑排序
\`\`\`cpp
int main() {
    int n, m;
    cin >> n >> m;

    vector<int> inDegree(n, 0); // 0 ~ (n - 1)
    unordered_map<int, vector<int>> grid;
    while (m--) {
        int a, b;
        cin >> a >> b; // a -> b
        inDegree[b]++;
        grid[a].push_back(b); // a -> b -> ...
    }

    queue<int> que;
    for (int i = 0; i < n; i++) {
        if (inDegree[i] == 0) {
            que.push(i);
        }
    }

    vector<int> result;
    while (!que.empty()) {
        int cur = que.front();
        que.pop();
        result.push_back(cur);

        if (grid[cur].size()) { // 如果 cur 还有后续节点
            for (int node : grid[cur]) {
                inDegree[node]--; // 后续节点的入度 -1
                if (inDegree[node] == 0) {
                    que.push(node);
                }
            }
        }
    }

    if (result.size() == n) {
        for (int val : result) {
            cout << val << ' ';
        }
    } else {
        cout << "-1";
    }
}
\`\`\`

## dijkstra
### 原版(Prim)
\`\`\`cpp
int n, m;
cin >> n >> m;

vector<vector<int>> grid(n + 1, vector<int>(n + 1, INT_MAX));
while (m--) {
    int a, b, c;
    cin >> a >> b >> c;
    grid[a][b] = c;
}

vector<int> minDist(n + 1, INT_MAX);
vector<bool> vis(n + 1, false);
minDist[1] = 0;
for (int i = 1; i <= n; i++) {
    int minVal = INT_MAX;
    int cur = 1;

    for (int j = 1; j <= n; j++) {
        if (!vis[j] && minDist[j] < minVal) {
            minVal = minDist[j];
            cur = j;
        }
    }

    vis[cur] = true;

    for (int j = 1; j <= n; j++) {
        if (!vis[j] && grid[cur][j] != INT_MAX && minDist[cur] + grid[cur][j] < minDist[j]) {
            minDist[j] = minDist[cur] + grid[cur][j];
        }
    }
}

cout << (minDist[n] == INT_MAX ? -1 : minDist[n]);
\`\`\`

### 堆优化(常用)
\`\`\`cpp
class cmp {
    public:
    bool operator()(const pair<int, int> &a, const pair<int, int> &b) {
        return a.second > b.second;
    }
};

struct Edge {
    int to, val;

    Edge(int to, int val) : to(to), val(val) {
    }
};

void solve() {
    int n, m;
    cin >> n >> m;

    vector<list<Edge>> grid(n + 1);
    while (m--) {
        int a, b, c;
        cin >> a >> b >> c;
        grid[a].push_back(Edge(b, c));
    }

    vector<int> minDist(n + 1, INT_MAX);
    vector<bool> visited(n + 1, false);
    priority_queue<pair<int, int>, vector<pair<int, int>>, cmp> pq;

    pq.push(pair<int, int>(1, 0));
    minDist[1] = 0;
    while (!pq.empty()) {
        // 节点，源点到节点的距离
        pair<int, int> cur = pq.top();
        pq.pop();
        if (visited[cur.first]) {
            continue;
        }

        visited[cur.first] = true;

        for (Edge edge : grid[cur.first]) { // 遍历 cur 指向的节点
            if (!visited[edge.to] && minDist[cur.first] + edge.val < minDist[edge.to]) {
                minDist[edge.to] = minDist[cur.first] + edge.val;
                pq.push(pair<int, int>(edge.to, minDist[edge.to]));
            }
        }
    }

    cout << (minDist[n] == INT_MAX ? -1 : minDist[n]);
}
\`\`\`

## Bellman_ford
\`\`\`cpp
int n, m;
cin >> n >> m;

vector<vector<int>> grid;
while (m--) {
    int a, b, c;
    cin >> a >> b >> c;
    grid.push_back({a, b, c});
}

vector<int> minDist(n + 1, INT_MAX);
minDist[1] = 0;
for (int i = 1; i < n; i++) {
    for (vector<int> &edge : grid) { // 0 -> 1, val: 2
        if (minDist[edge[0]] != INT_MAX && minDist[edge[0]] + edge[2] < minDist[edge[1]]) {
            minDist[edge[1]] = minDist[edge[0]] + edge[2];
        }
    }
}

if (minDist[n] == INT_MAX) {
    cout << "unconnected";
} else {
    cout << minDist[n];
}
\`\`\`

## Bellman_ford_queue(SPFA)(常用)
\`\`\`cpp
struct Edge {
    int to, val;

    Edge(int to, int val) : to(to), val(val) {
    }
};

void solve() {
    int n, m;
    cin >> n >> m;

    vector<list<Edge>> grid(n + 1);
    while (m--) {
        int a, b, c;
        cin >> a >> b >> c;
        grid[a].push_back(Edge(b, c));
    }

    queue<int> que;
    vector<bool> inQue(n + 1, false);
    vector<int> minDist(n + 1, INT_MAX);
    minDist[1] = 0;
    que.push(1);
    while (!que.empty()) {
        int cur = que.front();
        que.pop();
        inQue[cur] = false;
        for (Edge edge : grid[cur]) {
            if (minDist[cur] + edge.val < minDist[edge.to]) {
                minDist[edge.to] = minDist[cur] + edge.val;
                if (inQue[edge.to] == false) {
                    que.push(edge.to);
                    inQue[edge.to] = true;
                }
            }
        }
    }

    if (minDist[n] == INT_MAX) {
        cout << "unconnected";
    } else {
        cout << minDist[n];
    }
}
\`\`\`

## Floyd
\`\`\`cpp
int n, m, p1, p2, val;
cin >> n >> m;

vector<vector<int>> grid(n + 1, vector<int>(n + 1, 10005));  // 因为边的最大距离是10^4

for(int i = 0; i < m; i++){
    cin >> p1 >> p2 >> val;
    grid[p1][p2] = val;
    grid[p2][p1] = val; // 注意这里是双向图

}
// 开始 floyd
for (int k = 1; k <= n; k++) {
    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= n; j++) {
            grid[i][j] = min(grid[i][j], grid[i][k] + grid[k][j]);
        }
    }
}
// 输出结果
int z, start, end;
cin >> z;
while (z--) {
    cin >> start >> end;
    if (grid[start][end] == 10005) cout << -1 << endl;
    else cout << grid[start][end] << endl;
}
\`\`\`

## 最短路总结
| 算法 | 使用场景 |
| --- | --- |
| Dijkstra | 单源且边为正数 |
| Bellman-Ford | 单源边可为负数，有负权回路，有限节点最短路 |
| Floyd | 多源点求最短路 |


# 数论
## 常用数学算法总结
\`\`\`cpp
bool isPrime(int n) {  // 判断质数
    if (n == 1) return false;
    for (int i = 2; i * i <= n / i; i++)
        if (n % i == 0) return false;
    return true;
}

void hasPrime(int n) {  // 区间质数
    vector<bool> vis(n + 1, false);
    vis[0] = vis[1] = true;
    for (int i = 2; i * i <= n; i++)
        if (!vis[i])
            for (int j = i * i; j <= n; j += i) vis[j] = true;
    for (int i = 2; i <= n; i++)
        if (!vis[i]) cout << i << ' ';
}

void hasFactor(int n) {  // 区间因数
    vector<int> res;
    for (int i = 1; i <= n / i; i++) {
        if (n % i) continue;
        res.push_back(i);
        if (i != n / i) res.push_back(n / i);
    }
    sort(res.begin(), res.end());
}

void has(int n) {  // 区间质因数
    vector<int> res;
    for (int i = 2; i <= n / 2; i++) {
        if (n % i) continue;
        res.push_back(i);
        while (n % i == 0) n /= i;
    }
    if (n > 1) res.push_back(n);
}

ll gcd(ll a, ll b) {  // 最大公约数
    a = abs(a);
    b = abs(b);
    while (b) {
        ll temp = b;
        b = a % b;
        a = temp;
    }
    return a;
}

ll lcm(ll a, ll b) {  // 最小公倍数
    a = abs(a);
    b = abs(b);
    if (!a || !b) return 0;
    return (a / gcd(a, b)) * b;
}

ll fastPow(ll a, ll b, ll p) {  // 快速幂
    ll res = 1 % p;
    a %= p;
    while (b) {
        if (b & 1) res = (res * a) % p;
        a = (a * a) % p;
        b >>= 1;
    }
    return res;
}
// 费马小定理
ll inv(ll a, ll p) { return (fastPow(a, p - 2, p) % p + p) % p; }
\`\`\`

## 高精度
\`\`\`cpp
class hp {
public:
    vector<int> a;
    void deleteZero(vector<int>& a) {
        for (int i = a.size() - 1; i >= 0; i--) {
            if (a[i] != 0) break;
            a.pop_back();
        }
        if (a.empty()) a.push_back(0);
    }
    hp() { a.push_back(0); }
    hp(int num) {
        a.clear();
        if (num == 0) {
            a.push_back(0);
            return;
        }
        while (num) {
            a.push_back(num % 10);
            num /= 10;
        }
    }
    hp(string& str) {
        a.clear();
        if (str == "0") {
            a.push_back(0);
            return;
        }
        for (int i = str.size() - 1; i >= 0; i--) {
            a.push_back(str[i] - '0');
        }
        deleteZero(a);
    }
    hp operator+(const hp& x) {
        hp res;
        int len = a.size() > x.a.size() ? a.size() : x.a.size();
        int carry = 0;
        for (int i = 0; i < len; i++) {
            if (i < a.size()) carry += a[i];
            if (i < x.a.size()) carry += x.a[i];
            res.a.push_back(carry % 10);
            carry /= 10;
        }
        if (carry) res.a.push_back(carry);
        deleteZero(res.a);
        return res;
    }
    hp operator-(const hp& x) {  // 假定减完不会为负数
        hp res;
        res.a.resize(a.size());
        int carry = 0;
        for (int i = 0; i < a.size(); i++) {
            int num = a[i] - carry;
            if (i < x.a.size()) num -= x.a[i];
            if (num < 0) num += 10, carry = 1;
            res.a[i] = num;
        }
        deleteZero(res.a);
        return res;
    }
    hp operator*(const hp& x) {
        hp res;
        res.a.resize(a.size() + x.a.size());
        for (int i = 0; i < a.size(); i++)
            for (int j = 0; j < x.a.size(); j++) res.a[i + j] += a[i] * x.a[j];
        for (int i = 0; i < res.a.size(); i++)
            if (res.a[i] >= 10) res.a[i + 1] += res.a[i] / 10, res.a[i] %= 10;
        deleteZero(res.a);
        return res;
    }
    hp operator/(const ll& x) {
        hp res;
        int carry = 0;
        for (int i = a.size() - 1; i >= 0; i--) {
            carry += a[i];
            if (carry / x) res.a.push_back(carry / x);
            carry %= x;
            carry *= 10;
        }
        reverse(res.a.begin(), res.a.end());
        return res;
    }
    short cmp(const hp& x) {
        if (a.size() > x.a.size()) return 1;
        if (a.size() < x.a.size()) return -1;
        for (int i = a.size() - 1; i >= 0; i--) {
            if (a[i] > x.a[i]) return 1;
            if (a[i] < x.a[i]) return -1;
        }
        return 0;
    }
    bool operator>(const hp& x) { return cmp(x) == 1; }
    bool operator<(const hp& x) { return cmp(x) == -1; }
    bool operator==(const hp& x) { return cmp(x) == 0; }
};
\`\`\`



# 一些例子
### 最长递增子序列
**二分法(O(n log n))**

\`\`\`cpp
int LIS(vector<int>& nums) {
    vector<int> d;  // 维护一个递增序列
    for (int x : nums) {
        auto it = lower_bound(d.begin(), d.end(), x);  // 二分查找x的插入位置
        if (it == d.end()) {
            d.push_back(x);  // 如果x大于d中的所有元素，追加到d的末尾
        } else {
            *it = x;  // 否则，更新d中的对应位置
        }
    }
    return d.size();  // d的长度即为LIS的长度
}
\`\`\`

### 最长公共子序列
**二维DP(O(n^2))**

\`\`\`cpp
int longestCommonSubsequence(string text1, string text2) {
    vector<vector<int>> dp(text1.size() + 1, vector<int>(text2.size() + 1, 0));
    for (int i = 1; i <= text1.size(); i++) {
        for (int j = 1; j <= text2.size(); j++) {
            if (text1[i - 1] == text2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1] + 1;
            } else {
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
    }
    return dp[text1.size()][text2.size()];
}
\`\`\`

**一维DP(O(n^2))**

\`\`\`cpp
int n;
cin >> n;
for (int i = 0; i < n; i++) {
    cin >> a[i];
}
for (int i = 0; i < n; i++) {
    cin >> b[i];
}
for (int i = 1; i <= n; i++) {
    // 上一个位置最长公共子序列的长度
    int pre = 0;
    for (int j = 1; j <= n; j++) {
        // 当前位置最长公共子序列的长度
        int cur = dp[j];
        if (a[i - 1] == b[j - 1]) {
            dp[j] = pre + 1;
        } else {
            dp[j] = max(dp[j], dp[j - 1]);
        }
        pre = cur;
    }
}
cout << dp[n];
\`\`\`

**数据量过大时的处理方法O(n log n)**

1. **建立位置映射**：记录第二个排列中每个元素的位置。
2. **转换为LIS问题**：将第一个排列中的元素转换为它们在第二个排列中的位置，得到一个新的序列。
3. **求解LIS**：在新的序列中找到最长递增子序列，其长度即为原问题的解。

\`\`\`cpp
#include <bits/stdc++.h>
using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(0);
    cout.tie(0);

    int n;
    cin >> n;
    vector<int> a(n), b(n);
    for (int i = 0; i < n; ++i) cin >> a[i];
    for (int i = 0; i < n; ++i) cin >> b[i];

    vector<int> pos(n + 1); // pos[x]表示x在b中的位置
    for (int i = 0; i < n; ++i) {
        pos[b[i]] = i + 1; // 位置是i+1（1-based索引）
    }

    vector<int> seq(n);
    for (int i = 0; i < n; ++i) {
        seq[i] = pos[a[i]];
    }

    vector<int> d;
    for (int x : seq) {
        auto it = lower_bound(d.begin(), d.end(), x);
        if (it == d.end()) {
            d.push_back(x);
        } else {
            *it = x;
        }
    }

    cout << d.size() << endl;

    return 0;
}
\`\`\`
`,tn=`---
title: 'Vue 3 组件设计：多功能标签组件与主题色切换系统'
date: '2026-06-01'
tags: ['Vue', '前端', 'CSS', '教程']
excerpt: '通过一个真实博客项目中的实战案例，分享 Vue 3 组件设计思路——包括三模式标签组件的 v-model 设计和 provide/inject 全局主题切换方案'
coverImage: ''
---

> 文章使用AI润色

## 1. 引言

在 Vue 3 项目开发中，组件复用和全局状态管理是两个常见场景。这篇文章通过一个真实博客项目中的两个实战案例，分享 Vue 3 的组件设计思路：

- **多功能标签组件**：一个组件支持三种交互模式（选中、导航、只读），用 \`v-model\` 和事件分发适配不同场景
- **主题色切换系统**：用 \`provide/inject\` 配合 CSS 变量（OKLCH 色彩空间）实现全局主题切换，无需引入 Pinia

两个案例都来自我的博客项目，代码均已落地运行，完整项目可在 Gitee 查看：[tudoulog-vue](https://gitee.com/tudouza1/tudoulog-vue)。

## 2. 标签模式定义

先看标签模式的类型定义。为了让类型更清晰，我把模式常量单独提取到一个文件 \`src/constants/tagMode.ts\`：

\`\`\`ts
/** 模式：select=可选中，navigate=点击跳转，readonly=只读 */
export const TAG_MODE = ['select', 'navigate', 'readonly']
export type TagMode = (typeof TAG_MODE)[number]
export const TAG_MODE_DEFAULT = TAG_MODE[0]
\`\`\`

这里用了 TypeScript 的 \`(typeof TAG_MODE)[number]\` 来推导联合类型，这样 TAG_MODE 数组和 TagMode 类型保持同步，改一处就行。

## 3. 标签组件实现

核心组件 \`TagComponent.vue\` 根据 mode prop 切换三种行为：

\`\`\`vue
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
<\/script>

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
\`\`\`

关键设计点：

**withDefaults 处理可选 prop**：\`tags\` 是必填，\`modelValue\` 和 \`mode\` 可选。\`withDefaults\` 第二个参数传 \`() => []\` 而不是 \`[]\`，避免引用共享。

**v-model 双向绑定**：select 模式下用 \`modelValue\` + \`update:modelValue\` 模式实现 v-model。标签被点击时切换选中状态，更新数组。

**三种模式区分**：
- select：点击切换选中 / 未选中，emit 整个数组
- navigate：点击发出标签名，父组件处理跳转
- readonly：点击直接 return，不做任何操作

**无障碍属性**：select 模式下 role 是 checkbox，配合 aria-checked；navigate 和 readonly 模式 role 是 button。

## 4. 文章列表页的标签筛选

文章列表页 \`ArticlePage.vue\` 用 select 模式做标签筛选。组件用法：

\`\`\`vue
<CardComponent :card="article">
  <template #tags>
    <TagComponent v-model="selectedTags" :tags="article.tags || []" />
  </template>
</CardComponent>
\`\`\`

每张文章卡片内部都有标签组件，点击标签把它加入 \`selectedTags\` 数组。筛选逻辑用 computed 实现：

\`\`\`ts
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
\`\`\`

筛选逻辑同时支持标签和搜索：标签用 \`every\` 确保文章包含所有选中标签（与关系）；搜索模糊匹配标题、摘要、标签。

当选中的标签有变化时，搜索结果变化，配合分页逻辑自动重置到第一页：

\`\`\`ts
watch(filteredArticles, () => (currentPage.value = 1))
\`\`\`

## 5. 文章详情页的标签导航

文章详情页 \`ArticleDetail.vue\` 用 navigate 模式，点击标签跳转到列表页并带上筛选参数：

\`\`\`vue
<TagComponent
  :mode="TAG_MODE[1]"
  :tags="article.tags || []"
  @click-tag="goToListWithTag"
/>
\`\`\`

\`\`\`ts
const goToListWithTag = (tags: string) => {
  router.push({
    path: '/article',
    query: { tags },
  })
}
\`\`\`

\`ArticlePage.vue\` 在 \`onMounted\` 里读取 URL 参数初始化 \`selectedTags\`：

\`\`\`ts
onMounted(() => {
  const tagsQuery = route.query.tags
  if (tagsQuery) {
    if (typeof tagsQuery === 'string') {
      selectedTags.value = tagsQuery.split(',').filter((tag) => tag.trim().length > 0)
    }
  }
})
\`\`\`

这样从详情页点击标签跳转后，列表页自动展示筛选结果，流程很自然。

## 6. 主题色系统：provide / inject + CSS 变量

全局主题切换用 \`provide/inject\` 配合 CSS 变量实现，不依赖状态管理库。

**主题常量定义**：

\`\`\`ts
export const THEMES = ['teal', 'pink', 'purple'] as const
export type Theme = (typeof THEMES)[number]
export const DEFAULT_THEME: Theme = THEMES[0]
\`\`\`

**CSS 变量定义**（\`src/styles/global.css\` 的 \`:root\` 中）：

\`\`\`css
/* 主色 - OKLCH 感知均匀色彩 */
--teal: oklch(75% 0.18 170);
--pink: oklch(75% 0.17 20);
--purple: oklch(70% 0.16 290);

--teal-light: oklch(85% 0.12 170);
--pink-light: oklch(85% 0.11 20);
--purple-light: oklch(80% 0.10 290);

--main: var(--teal);
--main-light: var(--teal-light);
\`\`\`

这里用了 OKLCH 色彩空间。相比 RGB 和 HSL，OKLCH 更接近人眼感知：同样 75% 亮度的颜色对人眼来说亮度基本一致，切换主题时不会出现亮暗跳跃。

**App.vue 提供主题**：

\`\`\`vue
<script lang="ts" setup>
import { onMounted, provide, ref } from 'vue'
import { DEFAULT_THEME, type Theme, THEMES } from '@/constants/theme.ts'

const activeTheme = ref<Theme>(DEFAULT_THEME)

const applyTheme = (theme: Theme) => {
  const root = document.documentElement
  root.style.setProperty('--main', \`var(--\${theme})\`)
  root.style.setProperty('--main-light', \`var(--\${theme}-light)\`)
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
<\/script>
\`\`\`

**子组件注入主题**：

\`\`\`ts
const { activeTheme, setTheme } = inject('theme') as {
  activeTheme: Ref<Theme>
  setTheme: (theme: Theme) => void
}
\`\`\`

**主题选择器渲染**：

\`\`\`vue
<div class="theme-picker">
  <span
    v-for="theme in THEMES"
    :key="theme"
    :class="[theme, { active: activeTheme === theme }]"
    class="color-dot"
    @click="setTheme(theme)"
  />
</div>
\`\`\`

选择器用三个圆点展示主题色，CSS 里每个点的背景色直接引用 \`var(--teal)\`、\`var(--pink)\`、\`var(--purple)\`。

主题切换的流程是：点击圆点 → \`setTheme\` 更新 \`--main\` 和 \`--main-light\` → 所有引用这两个变量的元素自动更新 → \`localStorage\` 持久化 → 下次刷新 \`onMounted\` 恢复。

## 7. provide / inject 与 defineProps 的对比

很多人会问：这个场景为什么不用 Pinia？其实不是不能用，而是没必要。

| 方案 | 适用场景 | 特点 |
|------|---------|------|
| defineProps | 父子组件直接传递 | 显式、类型安全、适合少量层级 |
| provide/inject | 跨层级共享 | 灵活、适合全局可选配置 |
| Pinia | 复杂状态管理 | 完整状态管理方案，带 DevTools |

主题切换的逻辑很简单：一个响应式值加一个设置函数，不需要 action、getter、持久化中间件。\`provide/inject\` 正好够用，而且不用额外安装依赖。但是如果你的需求变复杂了（比如多主题叠加、动态编译主题、主题编辑器的撤销重做），那时候再上 Pinia 也不迟。

## 8. 总结

从这两个案例可以总结一些 Vue 3 的组件设计原则：

1. **用模式而非复制**：一个组件通过 flag 切换多个模式，比复制粘贴三个相似组件好维护得多。关键是区分哪些逻辑是共享的（渲染标签），哪些是变化的（点击行为）。
2. **v-model 是双向通信的糖**：用 \`modelValue\` + \`update:modelValue\` 实现 v-model，父子组件不需要手动监听事件和同步状态。
3. **provide/inject 不是 Pinia 的对手**：它们是不同层级的工具。全局配置类状态用 provide/inject 很轻量，状态管理复杂度上来了再考虑 Pinia。
4. **CSS 变量 + OKLCH = 主题切换利器**：改一个变量就换一个主题，而且 OKLCH 保证各主题亮度一致。

项目中用 OKLCH 后切换主题不再有"某个颜色特别亮或特别暗"的问题，推荐一试。
`,rn=`---
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

代码基于 Vue 3 + TypeScript + \`<script setup>\` 语法，完整项目可在 Gitee 查看：[tudoulog-vue](https://gitee.com/tudouza1/tudoulog-vue)。

---

## 2. 定义目录数据结构

先定义 Heading 类型。每个标题节点包含自身信息和一个 children 数组，用于挂载子标题：

\`\`\`ts
// src/types/index.ts
export interface Heading {
  id: string       // 锚点 ID，用于跳转和高亮
  title: string    // 标题文本
  level: number    // 1~6，对应 h1~h6
  children?: Heading[]  // 子标题列表
}
\`\`\`

嵌套结构的关键就在 \`children\` 字段。扁平的 h1~h6 经过算法处理后，变成一棵多叉树，递归组件再把这棵树渲染为嵌套的 ul/li。

---

## 3. 核心算法：用栈构建目录树

这是整个组件最精华的部分。常见的做法是只处理 h2/h3 两级，但我们的算法支持任意级别的标题混合出现，通用的栈结构能应对所有情况。

### 3.1 完整代码

\`\`\`ts
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\\s+/g, '-')
  // 保留中文、字母、数字和连字符
    .replace(/[^\\w\\u4e00-\\u9fa5-]/g, '')
}

function generateTocTree(contentRef: HTMLElement): Heading[] {
  const elements = contentRef.querySelectorAll('h1, h2, h3, h4, h5, h6')
  const slugCount = new Map<string, number>()

  // 为没有 id 的标题生成唯一锚点
  const generateId = (text: string): string => {
    const baseSlug = slugify(text) || 'heading'
    const count = slugCount.get(baseSlug) || 0
    const id = count === 0 ? baseSlug : \`\${baseSlug}-\${count}\`
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
\`\`\`

### 3.2 算法原理解析

理解这个算法的关键是看 \`stack\` 数组。它始终保存着从根到当前节点的路径：

- 遇到一个新标题时，**从栈顶开始检查**。如果栈顶的 level >= 当前 level，说明栈顶不是父级（可能是同级或子级），弹出。
- 重复弹出直到栈顶 level < 当前 level，此时栈顶就是父节点。
- 把当前节点挂到父节点的 children 中，然后当前节点入栈。

### 3.3 示例推演

假设有这样的标题结构：

\`\`\`
H1: 介绍          (level 1)
H2: 安装          (level 2)
H3: Windows      (level 3)
H3: macOS        (level 3)
H2: 配置          (level 2)
\`\`\`

逐行执行过程：

| 步骤 | 当前标题 | 栈操作 | 栈内容 | 挂载到 |
|------|----------|--------|--------|--------|
| 1 | H1 介绍 | 栈空，直接入栈 | \`[H1]\` | root |
| 2 | H2 安装 | H1.level(1) < 2，H1 是父节点，入栈 | \`[H1, H2]\` | H1.children |
| 3 | H3 Windows | H2.level(2) < 3，H2 是父节点，入栈 | \`[H1, H2, H3]\` | H2.children |
| 4 | H3 macOS | H3.level(3) >= 3，弹出前一个 H3。H2.level(2) < 3，入栈 | \`[H1, H2, H3_new]\` | H2.children |
| 5 | H2 配置 | H3.level(3) >= 2，弹出 H3。H2.level(2) >= 2，弹出 H2。H1.level(1) < 2，入栈 | \`[H1, H2_new]\` | H1.children |

最终树结构：

\`\`\`
root
├── H1: 介绍
│   ├── H2: 安装
│   │   ├── H3: Windows
│   │   └── H3: macOS
│   └── H2: 配置
\`\`\`

这种方案比传统的"只处理 h2/h3"健壮得多。即使出现 \`h1 > h4 > h2\` 这种交叉层级，算法也能正确处理。

---

## 4. TocItem 递归组件

有了树形数据，渲染就是递归组件的事了。

\`\`\`vue
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
<\/script>

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
\`\`\`

关键点：

- **自引用**：TocItem 的 template 中使用了 \`<TocItem>\`，这是 Vue 支持的递归组件模式。只要组件有 name 或在导入时注册了自己，就能在模板中调用自身。
- **事件冒泡**：子节点的 click 事件通过 \`$emit\` 向上冒泡，最终由 TocComponent 统一处理滚动逻辑。这样每个 TocItem 不需要关心滚动细节。
- **高亮透传**：\`activeId\` 从顶层一直传递到每个叶子节点，每个 a 标签自行判断是否 active。

---

## 5. TocComponent：滚动高亮与响应式

TocComponent 是整个目录导航的容器，负责三个职责：缓存标题偏移量、监听滚动计算高亮、管理响应式布局。

### 5.1 偏移量缓存

每次渲染后，遍历 headings 树，获取每个标题对应的 DOM 元素位置：

\`\`\`ts
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
\`\`\`

为什么不用 getBoundingClientRect？因为 offsetTop 是相对于父容器的固定值，适合滚动场景。每次窗口 resize 或 headings 变化时重新计算。

### 5.2 滚动高亮算法

\`\`\`ts
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
\`\`\`

算法很直接：**从后往前遍历**，找到第一个 offsetTop 小于等于当前滚动位置的标题。因为标题在文档中按从上到下排列，最后一个满足条件的标题就是用户当前阅读到的位置。

加上 80px 偏移量是为了让高亮"提前"一点点，用户滚动到标题附近时高亮立即切换，体验更流畅。

### 5.3 响应式交互

组件需要适配两种屏幕：

- **宽屏（>= 768px）**：TOC 作为侧边栏常驻，sticky 定位跟随滚动
- **窄屏（< 768px）**：TOC 默认隐藏，底部显示浮动按钮；点击后从底部滑出抽屉式面板

用 \`window.matchMedia\` 监听屏幕宽度：

\`\`\`ts
const mediaQuery = window.matchMedia('(min-width: 768px)')
const isWideScreen = ref(mediaQuery.matches)

// 显示状态：宽屏始终显示，窄屏由 toggle 控制
const shouldShowToc = computed(() => {
  return isWideScreen.value || isTocVisible.value
})

const toggleToc = () => {
  isTocVisible.value = !isTocVisible.value
}
\`\`\`

窄屏下点击目录项后自动关闭面板：

\`\`\`ts
const handleClick = (id: string) => {
  const element = document.getElementById(id)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
    if (!isWideScreen.value) {
      toggleToc()  // 关闭面板
    }
  }
}
\`\`\`

CSS 方面，宽屏下 TOC 使用 \`position: sticky\` 固定在右侧；窄屏下切换为 \`position: fixed\` 从底部弹出，配合 Vue transition 实现滑入动画。

---

## 6. 在文章详情中使用

在 ArticleDetail.vue 中集成 TOC 组件：

\`\`\`vue
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
<\/script>

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
\`\`\`

需要注意 \`nextTick\` 的时机。Markdown 内容通过 \`v-if\` 或动态组件渲染，必须等 DOM 更新完成后才能执行 \`querySelectorAll\` 获取标题元素。\`generateTocTree\` 还会自动为没有 id 的标题生成锚点并回填 DOM。

---

## 7. 总结

本文实现了一个完整的文章目录导航组件，核心亮点有三个：

**栈算法构建目录树**。利用一个栈维护层级路径，兼容任意 h1~h6 组合，比固定处理 h2/h3 的方案通用得多。代码只有十几行，思路清晰。

**递归组件渲染树形结构**。TocItem 自引用的模式天然适配多叉树，配合事件冒泡和属性透传，每个节点只关注自己的渲染。

**滚动高亮 + 响应式布局**。通过缓存 offsetTop + 滚动监听实现精确的阅读位置标记；matchMedia 搭配 computed 实现宽窄屏自适应，移动端体验完整。

这个 TOC 组件不依赖任何第三方库，纯 Vue 3 + TypeScript 实现，可直接移植到任意 Markdown 渲染项目中使用。
`,on=`---
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
| \`xx-enter-from\` | 元素插入前添加，下一帧移除 | 定义进入的起始状态 |
| \`xx-enter-active\` | 元素插入前添加，过渡结束后移除 | 定义进入过渡的持续过程 |
| \`xx-enter-to\` | 元素插入后下一帧添加，过渡结束后移除 | 定义进入的结束状态 |
| \`xx-leave-from\` | 离开触发时添加，下一帧移除 | 定义离开的起始状态 |
| \`xx-leave-active\` | 离开触发时添加，过渡结束后移除 | 定义离开过渡的持续过程 |
| \`xx-leave-to\` | 离开触发后下一帧添加，过渡结束后移除 | 定义离开的结束状态 |

\`xx\` 是 Transition 组件 \`name\` 属性的值。比如 \`name="page"\`，对应的类就是 \`.page-enter-from\`、\`.page-leave-active\` 这样。

记住一个规律：\`-from\` 是起始状态，\`-to\` 是结束状态，\`-active\` 是整个过程的动画属性。大多数时候你只需要配 \`-from\` 和 \`-active\` 就够了。

## 过渡模式 mode

Transition 有三种模式：

- **默认（同时）**：旧元素离开和新元素进入同时发生。看起来有点别扭，两个元素会重叠。
- **\`out-in\`**：旧元素完全离开后，新元素再进入。最常用，体验最好。
- **\`in-out\`**：新元素先进入，旧元素再离开。用得少，某些特殊场景才有意义。

项目中路由过渡用的就是 \`out-in\`：

\`\`\`vue
<transition appear mode="out-in" name="page">
  <component :is="Component" :key="$route.fullPath" />
</transition>
\`\`\`

\`appear\` 属性让页面首次加载也有动画效果，不是非得等路由切换才触发。

## 路由过渡动画实战

来看博客项目里的完整实现。AppLayout.vue 是全局布局组件，路由切换的过渡就放在这里：

\`\`\`vue
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
\`\`\`

注意 \`:key="$route.fullPath"\` 这一行。如果不加 key，从 \`/article/foo\` 跳到 \`/article/bar\` 时，因为都是同一个组件，Vue 会复用实例，过渡就不会触发。用 fullPath 作为 key，每次路由变化都强制重新创建组件，过渡才能正常工作。

对应的 CSS 定义在全局样式里：

\`\`\`css
.page-enter-active,
.page-leave-active {
  transition: all 0.3s ease-in-out;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
\`\`\`

效果就是页面切换时有个轻微的缩放淡入淡出，0.3 秒完成，不拖沓。过渡时间建议控制在 0.2 到 0.4 秒之间，太短看不清，太长显得卡。

## TransitionGroup 与列表动画

Transition 处理的是单个元素的进入离开，TransitionGroup 处理的是列表。区别在于：

- TransitionGroup 会渲染一个真实的 DOM 容器，通过 \`tag\` 属性指定标签名
- 列表中的每一项必须有唯一的 \`key\`
- 它多了一个 \`move\` 过渡，用于处理列表排序时的动画

看博客首页的英雄区域怎么用的：

\`\`\`vue
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
\`\`\`

四个子元素依次进入，配合 stagger 错峰动画，视觉上会有一个接一个出现的层次感。

## Stagger 错峰动画

错峰动画就是让列表中的元素不是同时出现，而是一个接一个地出现，形成波浪效果。

### nth-child 方案

首页用的是 nth-child 硬编码：

\`\`\`css
.list-enter-active:nth-child(1) { transition-delay: 0s; }
.list-enter-active:nth-child(2) { transition-delay: 0.1s; }
.list-enter-active:nth-child(3) { transition-delay: 0.2s; }
.list-enter-active:nth-child(4) { transition-delay: 0.3s; }
\`\`\`

每个元素比前一个晚 0.1 秒出现。效果不错，但不够灵活。如果元素数量不固定，就得写很多条规则。

### CSS 变量方案

文章列表页用了更聪明的办法。在 Vue 模板里直接通过 \`:style\` 把延迟时间设为 CSS 变量：

\`\`\`vue
<transition-group appear class="article-list" name="list" tag="div">
  <router-link
    v-for="(article, index) in showArticles"
    :key="article.id"
    :style="{ '--delay': index * 0.1 + 's' }"
    :to="\`/article/\${article.id}\`"
  >
    <CardComponent :card="article" />
  </router-link>
</transition-group>
\`\`\`

CSS 这边只需要一行：

\`\`\`css
.list-enter-active {
  transition: all 0.3s ease-out;
  transition-delay: var(--delay, 0s);
}

.list-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
\`\`\`

\`var(--delay, 0s)\` 的意思是优先使用 CSS 变量 \`--delay\`，如果没定义就用 0s 作为默认值。

### 哪种方案更好？

如果列表固定不变（比如首页那四个元素），nth-child 完全够用，代码直观。如果列表是动态的，像文章列表那样根据搜索结果变化，CSS 变量方案是更好的选择，不用改 CSS 就能适配任意数量的元素。

另外全局样式里还定义了一个 \`list-move\` 过渡：

\`\`\`css
.list-move {
  transition: transform 0.3s ease;
}
\`\`\`

这个用于列表排序或过滤时，元素在 DOM 中移动位置的动画。比如筛选标签时，文章列表重新排序，每个卡片会平滑地移动到新位置，而不是闪一下。

## 最佳实践

总结几条经验：

**路由过渡用 out-in。** 默认的同时过渡会让新旧元素打架，用户体验不好。out-in 先走后来，干净利落。

**动态列表用 CSS 变量做 stagger。** 比 nth-child 灵活得多，不用写一堆重复代码。

**过渡时间不要太长。** 0.2s 到 0.4s 是比较舒服的范围。超过 0.5s 就会让人觉得页面慢了。

**合理使用 appear。** 页面首次加载的动画能给用户留下好印象，但是别滥用，到处都是动画反而廉价。

**leave 动画别忘了。** 很多人只做了 enter，leave 直接消失，体验很割裂。Vue 的 Transition 让 enter 和 leave 是一一对应的，花半分钟把 leave 也配上。

Transition 和 TransitionGroup 是 Vue 3 里性价比很高的功能，几行代码就能让页面交互上一个档次。下次做页面的时候，不妨试试加上过渡效果。
`,an=`---
title: '一次内核级内存泄漏排查实录：16GB内存被吃掉13GB，元凶竟是Realtek音频驱动'
date: '2026-04-26'
tags: [ 'Windows', '日常' ]
excerpt: '具体情况是突然电脑卡顿，内存占用99%，系统磁盘100%，CPU正常，任务管理器进程列表看不出谁占内存，重启无效'
coverImage: 'win11bug.png'
---

> 文章使用AI润色

# 问题现象

- 笔记本挂机黑屏唤醒后**极度卡顿**
- 任务管理器显示：**内存占用99%、磁盘100%**，但进程列表看不出哪个程序占用高
- CPU占用极低
- 重启后问题依旧

  ![win11bug1.png](../../public/img/win11bug1.png)

# 查找元凶

## RAMMap

发现非分页池（Nonpaged Pool）高达 **13GB**（共16GB内存）可以知道是内核级内存泄漏问题

![win11bug2.png](../../public/img/win11bug2.png)

## PoolMon

打开PoolMon后<br/>
按P键：筛选只显示“Nonp” (Nonpaged pool, 非分页池) 的数据，多按几次直到Type列显示为 Nonp 为止。<br/>
按B键：这会让所有结果按 Bytes 从大到小排列，让内存最大的排在最顶部，可以多按几次

然后发现 Tag **\`RTLF\`** 占用了约 **10GB**，元凶是 **Realtek 音频驱动**

![win11bug3.png](../../public/img/win11bug3.png)

# 根本原因

- Windows 下载并尝试安装 **KB5083769**（安全更新），但**安装失败**
- 这次失败的更新过程，**破坏了系统环境或触发了驱动冲突**，导致这两个 Realtek 驱动疯狂泄漏内存
- 注意：KB5083769 **实际上并未成功安装**

# 解决过程

| 操作过程                 | 结果                    |
|----------------------|-----------------------|
| 禁用两个 Realtek 驱动并重启   | 内存恢复正常，电脑不卡了但是内置扬声器无声 |
| 暂停 Windows 更新        | KB5083769停止安装         |
| 重新启用两个 Realtek 驱动并重启 | 内存、磁盘都正常，声音也回来了       |
| 启用WUB                | Windows系统更新永久停止       |

> **关键发现**：问题不是驱动，而是**更新过程中的某些临时状态或残留文件“污染”了系统**
> 当暂停更新并重启，那个冲突状态被清除了，驱动就能正常工作。

# 总结

- 使用 **WUB（Windows Update Blocker）** 工具**永久暂停更新**
- 停止更新的系统才是最好的系统

# 附录

RAMMap的下载链接：https://learn.microsoft.com/en-us/sysinternals/downloads/rammap<br/>
PoolMon的下载安装以及使用方法（转自腾讯云开发者社区）：https://cloud.tencent.com/developer/article/1871416<br/>
WUB的下载链接：https://caiyun.139.com/w/i/2uETMPyeDHo6h \`提取码:s7fk\`
`,sn="/",ln=Object.assign({"/src/articles/blog-markdown-system.md":G,"/src/articles/clash.md":W,"/src/articles/cloudflare.md":U,"/src/articles/flutter.md":$,"/src/articles/hello.md":K,"/src/articles/music-study.md":X,"/src/articles/oklch.md":Q,"/src/articles/opencode-web.md":Z,"/src/articles/opencode-windows-install.md":Y,"/src/articles/ruanjian-list.md":J,"/src/articles/springboot-config.md":nn,"/src/articles/suan-fa.md":en,"/src/articles/tag-component-theme.md":tn,"/src/articles/toc-component.md":rn,"/src/articles/vue-transitions.md":on,"/src/articles/win11bug.md":an}),cn=Object.assign({"/src/articles/AGENTS.md":()=>r(()=>import("./AGENTS-ChuxhzZo.js"),__vite__mapDeps([0,1])).then(n=>n.default),"/src/articles/blog-markdown-system.md":()=>r(()=>import("./blog-markdown-system-Dd_sNvMQ.js"),__vite__mapDeps([2,1])).then(n=>n.default),"/src/articles/clash.md":()=>r(()=>import("./clash-ggAR4S6A.js"),__vite__mapDeps([3,1])).then(n=>n.default),"/src/articles/cloudflare.md":()=>r(()=>import("./cloudflare-B2S4V4y2.js"),__vite__mapDeps([4,1])).then(n=>n.default),"/src/articles/flutter.md":()=>r(()=>import("./flutter-C0SQTqUe.js"),__vite__mapDeps([5,1])).then(n=>n.default),"/src/articles/hello.md":()=>r(()=>import("./hello-QFzXgaI5.js"),__vite__mapDeps([6,1])).then(n=>n.default),"/src/articles/music-study.md":()=>r(()=>import("./music-study-ClmdYQWw.js"),__vite__mapDeps([7,1])).then(n=>n.default),"/src/articles/oklch.md":()=>r(()=>import("./oklch-BCmbMKUt.js"),__vite__mapDeps([8,1])).then(n=>n.default),"/src/articles/opencode-web.md":()=>r(()=>import("./opencode-web-BSN7_2or.js"),__vite__mapDeps([9,1])).then(n=>n.default),"/src/articles/opencode-windows-install.md":()=>r(()=>import("./opencode-windows-install-BpqY1iNh.js"),__vite__mapDeps([10,1])).then(n=>n.default),"/src/articles/ruanjian-list.md":()=>r(()=>import("./ruanjian-list-B-ShNgoe.js"),__vite__mapDeps([11,1])).then(n=>n.default),"/src/articles/springboot-config.md":()=>r(()=>import("./springboot-config-COLTzUHo.js"),__vite__mapDeps([12,1])).then(n=>n.default),"/src/articles/suan-fa.md":()=>r(()=>import("./suan-fa-YRV3FUzf.js"),__vite__mapDeps([13,1])).then(n=>n.default),"/src/articles/tag-component-theme.md":()=>r(()=>import("./tag-component-theme-Brl1HUW2.js"),__vite__mapDeps([14,1])).then(n=>n.default),"/src/articles/toc-component.md":()=>r(()=>import("./toc-component-CVNSrzlx.js"),__vite__mapDeps([15,1])).then(n=>n.default),"/src/articles/vue-transitions.md":()=>r(()=>import("./vue-transitions-B9cXoBFb.js"),__vite__mapDeps([16,1])).then(n=>n.default),"/src/articles/win11bug.md":()=>r(()=>import("./win11bug-jJylkSwR.js"),__vite__mapDeps([17,1])).then(n=>n.default)});function k(n){return n.split("/").pop().replace(".md","")}function dn(n){const t=/^---\r?\n([\s\S]*?)\r?\n---/.exec(n);if(!t)return{};const i={};for(const a of t[1].split(/\r?\n/)){const e=/^([A-Za-z_]+):\s*(.*)$/.exec(a);if(!e)continue;const[,o,s]=e,l=s.trim();o==="tags"?i.tags=l.replace(/^\[/,"").replace(/\]$/,"").split(",").map(f=>f.trim().replace(/^['"]|['"]$/g,"")).filter(Boolean):(o==="title"||o==="date"||o==="excerpt"||o==="coverImage")&&(i[o]=l.replace(/^['"]|['"]$/g,""))}return i}const C={};for(const[n,t]of Object.entries(cn))C[k(n)]=t;const pn=Object.entries(ln).map(([n,t])=>{const i=dn(t),a=k(n);return{id:a,title:i.title||a,date:i.date||"未知日期",tags:i.tags||[],excerpt:i.excerpt||"",coverImage:i.coverImage?sn+"img/cover/"+i.coverImage:""}}).sort((n,t)=>t.date.localeCompare(n.date));function wn(n){return C[n]?.()}const v=b(!1),h=b(!1);let p=null;function un(){return{isLoading:v,isDone:h,start:()=>{p&&(clearTimeout(p),p=null),h.value=!1,v.value=!0},finish:()=>{v.value=!1,h.value=!0,p&&clearTimeout(p),p=setTimeout(()=>{h.value=!1,p=null},400)}}}const{start:mn,finish:E}=un(),g=O({history:B("/"),routes:[{path:"/",name:"AppLayout",component:()=>r(()=>import("./AppLayout-BvgOloyl.js"),__vite__mapDeps([18,1,19])),children:[{path:"",name:"HomePage",component:()=>r(()=>import("./HomePage-S6u8Y6k-.js"),__vite__mapDeps([20,1,21])),meta:{title:"首页-土豆博客"}},{path:"article",name:"ArticlePage",component:()=>r(()=>import("./ArticlePage-1mK-pDV-.js"),__vite__mapDeps([22,1,23,24,25])),meta:{title:"文章列表-土豆博客"}},{path:"word",name:"WordPage",component:()=>r(()=>import("./WordPage-BiTEYZHi.js"),__vite__mapDeps([26,1,27])),meta:{title:"废话-土豆博客"}},{path:"article/:id",name:"ArticleDetail",component:()=>r(()=>import("./ArticleDetail-BhwssvN0.js"),__vite__mapDeps([28,1,23,24,29])),beforeEnter:n=>{if(!pn.find(t=>t.id===n.params.id))return{name:"NotFound"}}},{path:"about",name:"AboutPage",component:()=>r(()=>import("./AboutPage-DC7SWd6f.js"),__vite__mapDeps([30,1,31])),meta:{title:"关于-土豆博客"}},{path:"/:pathMatch(.*)*",name:"NotFound",component:()=>r(()=>import("./NotFoundPage-sG7gK0du.js"),__vite__mapDeps([32,1,33]))}]}],scrollBehavior(n,t,i){return i||(n.hash?{el:n.hash,behavior:"smooth"}:{top:0,behavior:"smooth"})}});g.afterEach(n=>{document.title=n.meta.title||"土豆博客"});g.beforeEach(()=>{mn()});g.afterEach(()=>{E()});g.onError(()=>{E()});const gn=(n,t)=>{const i=n.__vccOpts||n;for(const[a,e]of t)i[a]=e;return i},hn={},fn={class:"demo-block"};function vn(n,t){return y(),T("figure",fn,[t[0]||(t[0]=H("div",{class:"demo-title"},"效果预览",-1)),R(n.$slots,"preview",{},void 0)])}const bn=gn(hn,[["render",vn],["__scopeId","data-v-84509da6"]]),_=V(z);_.use(g);_.component("DemoPreview",bn);_.mount("#app");export{S as T,gn as _,pn as a,wn as l,un as u};
