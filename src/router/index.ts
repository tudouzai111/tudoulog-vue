import { createRouter, createWebHistory } from 'vue-router'
import { articles } from '@/utils/articleList.ts'
import { useLoadingBar } from '@/utils/useLoadingBar.ts'

const { start: startLoading, finish: finishLoading } = useLoadingBar()

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
          path: 'word',
          name: 'WordPage',
          component: () => import('@/views/WordPage.vue'),
          meta: { title: '废话-土豆博客' },
        },
        {
          path: 'archive',
          name: 'ArchivePage',
          component: () => import('@/views/ArchivePage.vue'),
          meta: { title: '归档-土豆博客' },
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
  // 滚动行为
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth' }
    }
    // 页面级跳转直接归位（不写 behavior 即默认 auto），smooth 只留给锚点
    return { top: 0 }
  },
})

// 全局后置守卫：路由切换完成后修改标题
router.afterEach((to) => {
  // 如果路由元信息中有 title，则设置；否则使用默认标题
  document.title = (to.meta.title as string) || '土豆博客'
})

router.beforeEach(() => {
  startLoading()
})
router.afterEach(() => {
  finishLoading()
})
// 懒加载 chunk 失败兜底：
// 线上部署更新后，缓存的旧 index.html 引用的 content-hash chunk（视图组件）
// 在新部署里已不存在，动态 import 直接失败且 SPA 内无法自愈——
// 整页跳转目标地址，让服务器重新返回与当前部署一致的入口文件
const redirectingForChunkError = 'tudou:redirected-chunk-error'
router.onError((error, to) => {
  finishLoading()
  const message = error instanceof Error ? error.message : String(error)
  if (
    !message.includes('dynamically imported module') ||
    sessionStorage.getItem(redirectingForChunkError)
  ) {
    return
  }
  // 本会话只整页跳一次，防止服务器持续返回过期入口时无限循环
  sessionStorage.setItem(redirectingForChunkError, '1')
  window.location.assign(to?.fullPath ?? window.location.pathname)
})

export default router
