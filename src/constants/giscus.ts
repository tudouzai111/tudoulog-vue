/**
 * giscus 评论配置。
 * 填写步骤：
 * 1. 让 https://github.com/apps/giscus 应用授权访问博客仓库
 * 2. 打开 https://giscus.app/zh-CN，填入仓库名，
 *    Discussion 分类建议选 Announcements
 * 3. 把页面上生成的 data-repo-id 和 data-category-id 填到下面
 */
export const GISCUS = {
  repo: 'tudouzai111/tudoulog-vue',
  repoId: '', // ← giscus.app 生成的 data-repo-id
  category: 'Announcements',
  categoryId: '', // ← giscus.app 生成的 data-category-id
  mapping: 'pathname',
  lang: 'zh-CN',
}

export const GISCUS_CONFIGURED = Boolean(GISCUS.repoId && GISCUS.categoryId)
