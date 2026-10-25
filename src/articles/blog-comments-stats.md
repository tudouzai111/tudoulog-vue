---
title: '给博客加上评论和浏览量：giscus + Cloudflare D1，依然零成本'
date: '2026-10-25'
tags: ['CloudFlare', 'GitHub', 'D1', '教程']
ai: true
excerpt: '纯静态博客的第二步进化：接入 giscus 评论系统，并用 Cloudflare Pages Functions + D1 数据库做浏览量和点赞，全程免费额度内搞定，附绑定踩坑记录'
---

上一篇[《给纯静态博客接入免费网页编辑后台》](/article/blog-cms-admin)解决了"写文章"的问题，这一篇解决"读者互动"：评论区 + 浏览量 + 点赞。方案依然是零成本：评论用 [giscus](https://giscus.app/zh-CN)（数据存 GitHub Discussions），浏览量和点赞用 **Cloudflare Pages Functions + D1 数据库**（免费额度每天 10 万次请求，个人博客根本用不完）。

## 一、评论区：giscus 三步接入

giscus 的原理是利用 GitHub Discussions 当评论存储，读者用 GitHub 账号登录评论，数据完全在你自己的仓库里。

**第一步**：让 [github.com/apps/giscus](https://github.com/apps/giscus) 应用获得仓库访问权限（Install → 选仓库）。

**第二步**：打开 [giscus.app/zh-CN](https://giscus.app/zh-CN)，填入仓库名，Discussion 分类选 **Announcements**（只有维护者能开帖，读者只能回复，不会被灌垃圾帖），页面会生成一段配置代码：

```html
<script src="https://giscus.app/client.js"
  data-repo="tudouzai111/tudoulog-vue"
  data-repo-id="R_kgDOT-J93A"
  data-category="Announcements"
  data-category-id="DIC_kwDOT-J93M4DJlK3"
  data-mapping="pathname"
  data-input-position="bottom"
  crossorigin="anonymous"
  async>
</script>
```

**第三步**：把它封装成 Vue 组件。有两个细节值得说：

1. **主题跟随站点的深浅色切换**。giscus 自带的 `preferred_color_scheme` 只跟随操作系统，但我的博客有手动三态切换，所以用 `postMessage` 让评论框热切换主题，不用刷新页面：

```ts
iframe?.contentWindow?.postMessage(
  { giscus: { setConfig: { theme: 'dark' } } },
  'https://giscus.app',
)
```

2. **懒加载**。评论区对首屏毫无贡献，用 IntersectionObserver 监听，滚到评论区附近才注入脚本。

另外实测 giscus.app 在国内可以直连，评论的加载不依赖代理。

## 二、浏览量和点赞：Pages Functions + D1

这部分是真正的"轻后端"。关键认知：**Pages 项目里放一个 `functions/` 目录，里面的文件会自动变成 API 路由**，和前端一起部署，同域名、无 CORS 问题。

### 1. 建 D1 数据库

Cloudflare 控制台 → 存储和数据库 → **D1 SQL 数据库** → 创建（名字如 `blog-stats`）→ 进入数据库 → **控制台** → 执行建表：

```sql
CREATE TABLE IF NOT EXISTS stats (
  slug TEXT PRIMARY KEY,
  views INTEGER NOT NULL DEFAULT 0,
  likes INTEGER NOT NULL DEFAULT 0
);
```

### 2. 绑定到 Pages 项目

**这是全文最容易踩坑的一步**。去 Pages 项目（不是 Worker！）→ 设置 → 绑定 → 添加 **D1 数据库绑定**：

- **变量名必须是大写的 `DB`**——代码里就是用 `env.DB` 取的，名字写错或者大小写不对，运行时就是 undefined
- 数据库选刚建的 `blog-stats`

改完绑定**必须触发一次重新部署**才生效——绑定是跟着部署快照走的，光保存不部署，线上函数拿到的还是旧环境。我就栽在这里：变量名写错了，改完又忘了重新部署，接口一直报 undefined。

### 3. 写接口

`functions/api/stats.ts`（文件路径就是路由：`/api/stats`）：

```ts
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

// GET  /api/stats?slug=文章id → 查询
export async function onRequestGet(context: FunctionContext): Promise<Response> {
  const slug = new URL(context.request.url).searchParams.get('slug')
  if (!slug) return json({ error: 'slug is required' }, 400)
  const row = await context.env.DB.prepare('SELECT views, likes FROM stats WHERE slug = ?')
    .bind(slug)
    .first<StatsRow>()
  return json({ views: row?.views ?? 0, likes: row?.likes ?? 0 })
}

// POST /api/stats { slug, action } → 自增
export async function onRequestPost(context: FunctionContext): Promise<Response> {
  const body = (await context.request.json()) as { slug?: string; action?: string }
  const column = body.action === 'view' ? 'views' : 'likes'
  await context.env.DB.prepare(
    `INSERT INTO stats (slug, ${column}) VALUES (?, 1)
     ON CONFLICT(slug) DO UPDATE SET ${column} = ${column} + 1`,
  )
    .bind(body.slug)
    .run()
  return json({ ok: true })
}
```

安全细节：自增的列名来自 `action` 参数，不能直接拼用户输入——先用白名单把 `action` 归一成 `views`/`likes` 两个常量再拼接，SQL 注入就没门了。

### 4. 前端组件

`ArticleStats.vue` 挂在文章元信息行里，几个体验细节：

- **静默降级**：进页面先 GET 一次，接口挂了（比如 D1 还没绑定好）整个组件不渲染，博客该什么样还什么样
- **浏览去重**：每个浏览器会话只计一次（`sessionStorage` 标记），刷新页面不刷浏览量
- **点赞防连点**：`localStorage` 记录已点赞，点了变实心红心；请求失败自动回滚乐观更新

## 踩坑记录

1. **变量名大小写**：D1 绑定变量名写成了小写或别的名字，代码里 `env.DB` 就是 undefined。报错只有一句 `Cannot read properties of undefined (reading 'prepare')`，一开始根本想不到是绑定名字的问题。

2. **绑定不重新部署就不生效**：改完绑定设置，线上函数还是拿不到数据库。绑定跟随部署快照，改完必须触发一次部署。

3. **排查技巧**：给接口的 500 响应临时带上错误详情（`detail: String(error)`），一眼就能区分"没建表"、"绑定没生效"还是"绑错了项目"——定位完再删掉。

## 验收

```bash
# 查询
curl "https://你的博客地址/api/stats?slug=文章id"
# 浏览 +1
curl -X POST -H "content-type: application/json" \
  -d '{"slug":"文章id","action":"view"}' \
  https://你的博客地址/api/stats
```

打开任意文章，元信息行会多出 👁 浏览量和 ❤️ 点赞按钮；滚到底部就是评论区。至此这个纯静态博客的三件套齐了：**git 管内容、CMS 管编辑、D1 管互动**——依然没有花一分钱服务器钱。
