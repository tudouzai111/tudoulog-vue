# src/views/ Knowledge Base

## OVERVIEW
Page-level components. Each corresponds to a route in `src/router/index.ts`.

## STRUCTURE
```
views/
├── HomePage.vue        # Landing page (latest articles)
├── ArticlePage.vue     # Article listing page
├── ArticleDetail.vue   # Individual article view (renders markdown)
├── AboutPage.vue       # About page
├── WordPage.vue        # "废话" (mutterings) page
└── NotFoundPage.vue    # 404 error page
```

## WHERE TO LOOK
| Task | Location |
|------|----------|
| Add new page | Create `*Page.vue` here + register in router |
| Article detail rendering | `ArticleDetail.vue` |
| 404 handling | `NotFoundPage.vue` |

## CONVENTIONS
- Filename suffix: `*Page.vue`
- Router meta title format: `页面名-土豆博客`
- Components lazy-loaded via `() => import(...)`

## ROUTING NOTES
- All views nested under `AppLayout` in router
- `ArticleDetail` has `beforeEnter` guard validating article exists
- `:pathMatch(.*)*` catch-all → NotFoundPage

## ANTI-PATTERNS
- Do NOT add reusable UI here (use `components/`)
- Do NOT bypass router's `beforeEnter` for article validation
