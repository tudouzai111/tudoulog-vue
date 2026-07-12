# PROJECT KNOWLEDGE BASE

**Generated:** 2026-07-12
**Commit:** 875d64f8
**Branch:** master
**Stack:** Vue 3.5 + TypeScript 5.9 + Vite 7 + Vue Router 5

## OVERVIEW
Markdown blog system ("土豆博客"). Articles written as `.md` files in `src/articles/`; `vite-plugin-vue-markdown` transforms them into Vue components at build time. Deployed on GitHub Pages (CI) + Cloudflare Pages (auto-deploy).

## STRUCTURE
```
tudoulog-vue/
├── src/
│   ├── articles/         # Markdown articles (frontmatter: title, date, tags, excerpt, coverImage)
│   ├── components/       # Reusable UI components
│   │   └── layout/       # App shell: AppLayout, AppHeader, AppFooter
│   ├── constants/        # Theme config, tag display modes
│   ├── router/           # Vue Router config (dynamic article routes)
│   ├── styles/           # Global + article/tag scoped CSS
│   ├── types/            # Shared TypeScript interfaces
│   ├── utils/            # articleList.ts (glob-based article discovery)
│   └── views/            # Page components (Home, ArticleList, Detail, About, Word, 404)
├── vite.config.ts        # Markdown plugin, Shiki, external link handling
├── .oxlintrc.json        # Oxlint: correctness=error
├── .prettierrc.json      # Prettier config
└── .github/workflows/deploy.yml  # CI/CD
```

## WHERE TO LOOK
| Task | Location | Notes |
|------|----------|-------|
| Add blog article | `src/articles/*.md` | Frontmatter required: title, date, tags |
| Change routing | `src/router/index.ts` | Dynamic `beforeEnter` for article validation |
| Add UI component | `src/components/` | PascalCase `.vue` files |
| Add page | `src/views/` | Register in router |
| Modify markdown rendering | `vite.config.ts` | Shiki theme, link renderer |
| Change theme/colors | `src/constants/theme.ts` | Shared across components |
| Global styles | `src/styles/global.css` | Imported in `main.ts` |

## CONVENTIONS
- PascalCase `.vue` filenames
- `@/` alias maps to `src/`
- Router uses `createWebHistory` with `import.meta.env.BASE_URL`
- Articles discovered via `import.meta.glob('@/articles/*.md', { eager: true })`
- External links auto-get `target="_blank" rel="noopener noreferrer"` (vite.config.ts custom renderer)

## ANTI-PATTERNS (THIS PROJECT)
- Do NOT add articles without frontmatter (title, date)
- Do NOT modify `articleList.ts` glob pattern without updating router validation
- Do NOT bypass `@/` alias for internal imports
- Dual license: code = MIT, articles = CC BY-NC 4.0

## COMMANDS
```bash
pnpm install          # Install dependencies
pnpm dev              # Dev server (localhost:5173)
pnpm build            # Type-check + production build
pnpm build-only       # Build without type-check
pnpm type-check       # vue-tsc --build
pnpm lint             # oxlint + eslint (both --fix)
pnpm lint:oxlint      # Oxlint only
pnpm lint:eslint      # ESLint only
pnpm format           # Prettier on src/
pnpm preview          # Preview production build
```

## NOTES
- Node ^20.19.0 or >=22.12.0 required (pnpm package manager)
- `DemoPreview` component registered globally in `main.ts`
- Article IDs derived from filename (e.g., `hello.md` → id `hello`)
- Cover images served from `baseUrl + 'img/cover/'`
