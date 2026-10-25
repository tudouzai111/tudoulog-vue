import { reactive } from 'vue'

export interface CardStats {
  views: number
  likes: number
}

// 模块级缓存：列表页/首页共享，已加载过的 slug 不再重复请求
const statsMap = reactive<Record<string, CardStats>>({})
// D1 不可用（未绑定/接口故障）时置为 true，本会话不再重试，卡片静默隐藏统计
let unavailable = false

export function useArticleStats() {
  async function loadStats(ids: string[]) {
    if (unavailable) return
    const missing = [...new Set(ids.filter((id) => id && !(id in statsMap)))]
    if (!missing.length) return
    try {
      const res = await fetch(`/api/stats?slugs=${missing.join(',')}`)
      if (!res.ok) throw new Error(String(res.status))
      const data = (await res.json()) as Record<string, CardStats>
      for (const [slug, stats] of Object.entries(data)) statsMap[slug] = stats
      // 没查到的 slug 记为 0，避免下次列表翻页又发起同样的请求
      for (const id of missing) if (!(id in statsMap)) statsMap[id] = { views: 0, likes: 0 }
    } catch {
      unavailable = true
    }
  }

  return { statsMap, loadStats }
}
