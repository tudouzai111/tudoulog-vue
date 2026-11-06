import type { Plugin } from 'vite'

/**
 * 开发环境的 /api/stats 内存实现，契约与 functions/api/stats.ts 一致：
 * - GET  /api/stats?slug=<id>        → { [slug]: { views, likes } }
 * - GET  /api/stats?slugs=a,b,c     → { a: {...}, b: {...} }（未请求过的 slug 不出现）
 * - POST /api/stats { slug, action } → 自增后返回 { views, likes }
 *
 * 本地没有 D1；vite preview / 静态托管也不会带上 functions/ 目录，
 * 只有 pnpm dev 会经由本插件拿到数据（数值仅存于开发进程内存）。
 */

interface StatsRow {
  views: number
  likes: number
}

const BATCH_LIMIT = 50 // 与线上 Function 保持一致

export function devStatsApiPlugin(): Plugin {
  const stats = new Map<string, StatsRow>()
  const read = (slug: string): StatsRow => stats.get(slug) ?? { views: 0, likes: 0 }

  return {
    name: 'tudou-dev-stats-api',
    configureServer(server) {
      server.middlewares.use('/api/stats', async (req, res) => {
        const url = new URL(req.url ?? '/', 'http://dev.local')
        const send = (data: object, status = 200) => {
          res.statusCode = status
          res.setHeader('content-type', 'application/json')
          res.end(JSON.stringify(data))
        }

        if (req.method === 'GET') {
          const slug = url.searchParams.get('slug')
          const slugs = url.searchParams.get('slugs')
          if (!slug && !slugs) {
            send({ error: 'slug or slugs is required' }, 400)
            return
          }
          if (!slug) {
            // 批量模式：与线上一致，已存在的行才返回
            const ids = slugs!
              .split(',')
              .map((s) => s.trim())
              .filter(Boolean)
              .slice(0, BATCH_LIMIT)
            if (!ids.length) {
              send({})
              return
            }
            const out: Record<string, StatsRow> = {}
            for (const id of ids) {
              if (stats.has(id)) out[id] = read(id)
            }
            send(out)
            return
          }
          send({ [slug]: read(slug) })
          return
        }

        if (req.method === 'POST') {
          let body: { slug?: string; action?: string }
          try {
            const chunks: string[] = []
            for await (const chunk of req) {
              chunks.push(String(chunk))
            }
            body = JSON.parse(chunks.join(''))
          } catch {
            send({ error: 'invalid json' }, 400)
            return
          }
          const { slug, action } = body
          if (!slug || (action !== 'view' && action !== 'like')) {
            send({ error: 'slug and action (view|like) are required' }, 400)
            return
          }
          // 与线上 SQL 语义一致：INSERT col=1 ON CONFLICT col+1（首次计 1，后续累加）
          const existing = stats.get(slug) ?? { views: 0, likes: 0 }
          if (action === 'view') existing.views += 1
          else existing.likes += 1
          stats.set(slug, existing)
          send(read(slug))
          return
        }

        send({ error: 'method not allowed' }, 405)
      })
    },
  }
}
