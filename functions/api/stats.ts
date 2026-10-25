/**
 * 文章浏览量与点赞接口（Cloudflare Pages Functions）
 * GET  /api/stats?slug=<文章id>          → { views, likes }
 * POST /api/stats  { slug, action }      → 自增后返回 { views, likes }
 *
 * 依赖 Cloudflare Pages 项目里绑定的 D1 数据库（变量名 DB），
 * 建表语句见 README 或下方注释：
 * CREATE TABLE IF NOT EXISTS stats (
 *   slug TEXT PRIMARY KEY,
 *   views INTEGER NOT NULL DEFAULT 0,
 *   likes INTEGER NOT NULL DEFAULT 0
 * );
 */

interface StatsRow {
  views: number
  likes: number
}

interface D1PreparedStatement {
  first<T = StatsRow>(): Promise<T | null>
  run(): Promise<unknown>
}

interface D1DatabaseLike {
  prepare(query: string): {
    bind(...values: unknown[]): D1PreparedStatement
  }
}

interface FunctionContext {
  request: Request
  env: { DB: D1DatabaseLike }
}

function json(data: object, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json' },
  })
}

async function readStats(db: D1DatabaseLike, slug: string): Promise<StatsRow> {
  const row = await db.prepare('SELECT views, likes FROM stats WHERE slug = ?')
    .bind(slug)
    .first<StatsRow>()
  return { views: row?.views ?? 0, likes: row?.likes ?? 0 }
}

export async function onRequestGet(context: FunctionContext): Promise<Response> {
  const slug = new URL(context.request.url).searchParams.get('slug')
  if (!slug) return json({ error: 'slug is required' }, 400)
  try {
    return json(await readStats(context.env.DB, slug))
  } catch {
    return json({ error: 'database unavailable' }, 500)
  }
}

export async function onRequestPost(context: FunctionContext): Promise<Response> {
  let body: { slug?: string; action?: string }
  try {
    body = (await context.request.json()) as { slug?: string; action?: string }
  } catch {
    return json({ error: 'invalid json' }, 400)
  }
  const { slug, action } = body
  if (!slug || (action !== 'view' && action !== 'like')) {
    return json({ error: 'slug and action (view|like) are required' }, 400)
  }
  const column = action === 'view' ? 'views' : 'likes'
  try {
    await context.env.DB.prepare(
      `INSERT INTO stats (slug, ${column}) VALUES (?, 1)
       ON CONFLICT(slug) DO UPDATE SET ${column} = ${column} + 1`,
    )
      .bind(slug)
      .run()
    return json(await readStats(context.env.DB, slug))
  } catch {
    return json({ error: 'database unavailable' }, 500)
  }
}
