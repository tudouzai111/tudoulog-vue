# AGENTS.md

个人博客「土豆博客」（tudoulog）：Vue 3.5 + TypeScript 5.9 + Vite 7 + Vue Router 5。站点与代码注释均为中文，遵循该风格。

## Commands

```bash
pnpm build       # 并行 type-check + vite build，末尾 pagefind --site dist 生成搜索索引
pnpm type-check  # vue-tsc --build
pnpm lint        # run-s lint:*：oxlint --fix → eslint --fix --cache
pnpm dev         # localhost:5173
pnpm format      # prettier --write src/（--experimental-cli）
```

- **没有测试套件**：验证靠 `pnpm lint && pnpm type-check && pnpm build`，别浪费时间找测试框架。
- Node `^20.19.0 || >=22.12.0` + pnpm；CI（`.github/workflows/deploy.yml`）用 Node 22、pnpm 9、`pnpm install --frozen-lockfile`。

## 内容流水线（最容易搞错的部分）

新增文章：往 `src/articles/` 放一个 `.md`，文件名即文章 ID（`foo.md` → `/article/foo`），**无需手动注册**；此目录只放文章，文件名避免空格和特殊字符。frontmatter 规范：`title` / `date`（`YYYY-MM-DD`，文章按日期倒序）必填；可选字段：`tags`（字符串数组）、`excerpt`、`coverImage`（只填**文件名**）、`updated`（`YYYY-MM-DD`，详情页与 sitemap lastmod 展示）、`draft`、`ai`。`draft: true` 全链路隐藏——不进列表、不进打包产物、不进 sitemap/RSS/搜索索引，路由守卫兜底 404；AI 辅助撰写的文章必须标 `ai: true`。正文图片一律写根路径 `/img/…`——`/public/` 前缀会在构建期被自动改写并打警告（articlePlugin 的 normalizePublicImg），别依赖兜底。

Markdown → Vue 组件分两层，改行为时别找错地方：

- `vite.config.ts`（inline markdown-it 插件）：Shiki 双主题（github-light + one-dark-pro）、代码复制按钮、标题锚点、外链自动 `target="_blank" rel="noopener noreferrer"`。
- `build/articlePlugin.ts`（自建 Vite 插件）：扫描 `src/articles/*.md` + `src/words/*.md`，产出虚拟模块 `virtual:article-meta` / `virtual:article-components` / `virtual:words`（`src/utils/articleList.ts` 消费），并附带生成 robots.txt / sitemap.xml / rss.xml 和 `dist/_index/` 预渲染 HTML。构建最后一步的 Pagefind **只索引 `dist/_index/`**，前端再把命中映射回 `/article/<id>`——改搜索行为要动这里，不是引入 `import.meta.glob`。

坑：

- Shiki 高亮语言集在 dev server 启动时从现有代码围栏收集一次；dev 期间新文章用新语言会静默降级为无高亮 `<pre>`，重启 dev server 才生效。
- `slugify` 已收敛为单一实现 `src/utils/slugify.ts`：构建期 heading id（`vite.config.ts`）与运行时目录锚点（`src/views/ArticleDetail.vue`）import 同一份，要调规则只改这个文件。

## 其他目录归属

| Use | Location | Notes |
|-----|----------|-------|
| 废话（微博客） | `src/words/*.md` | 每条一个文件，frontmatter 只有 `date` |
| 浏览量/点赞 API | `functions/api/stats.ts` | Cloudflare Pages Function，GET/POST `/api/stats`，依赖 D1 绑定 `DB`（无 wrangler 配置） |
| CMS 后台 | `public/admin/` | Sveltia CMS 纯静态；本地调试流程见 README「内容管理后台」 |
| 站点元数据 | `src/constants/site.ts` | `SITE_URL` 供 RSS / sitemap / canonical 使用，换域名改这里 |
| 主题/颜色 | `src/constants/theme.ts` + `src/styles/` | 深浅色模式共用 |

## 部署

- push 到 master 触发 CI 部署 GitHub Pages；CI 会 `cp dist/index.html dist/404.html`（**仅 GH Pages 需要**这个 SPA fallback）。Cloudflare Pages（tudoulog.pages.dev，主站）**不能带 404.html**，否则深链接返回 404 状态码——不要把 404.html 放进 `public/` 或提交到 dist。`public/_headers` 只对 CF Pages 生效（缓存策略：`/assets/` immutable、`/img/` 7 天），GH Pages 上它只是无害的静态文本。
- `/api/stats`：线上由 Cloudflare Pages Function 提供（需要 D1 绑定 `DB`）；本地 dev 由 `build/devStats.ts` 提供内存实现（进程内存，重启清零）；`vite preview` 无接口，组件会自动隐藏，属预期行为。

## Conventions

- `@/` → `src/`；PascalCase `.vue`；views 以 `*Page.vue` 命名并在 `src/router/index.ts` 注册，meta title 格式 `页面名-土豆博客`。
- `DemoPreview` 在 `main.ts` 全局注册，是唯一全局组件。
- 正文图片放 `public/img/`，用根路径 `/img/xxx.webp`；CMS 直传的 PNG/JPEG 记得跑 `node scripts/convert-images.mjs <文件名>`（不带参数则转整个目录），原图会被删掉（git 历史里留档）。CMS 编辑删掉正文图片后资产不会自动清理，跑 `pnpm images:check` 找孤儿图再删（判定按文件名全仓搜索，宁可漏报不误报）。封面图 frontmatter 只填**文件名**（渲染时拼 `img/cover/` 前缀，兼容 CMS 写入的完整路径）。
- License 拆分：代码 MIT，`src/articles/` 内容 CC BY-NC 4.0（`LICENSE-CC-BY-NC.md`）。
