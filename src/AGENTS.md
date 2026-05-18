# src/ Knowledge Base

## OVERVIEW
App source root. Entry: `main.ts`. Vue app mounts here with router, global styles, and `DemoPreview` component.

## STRUCTURE
```
src/
├── main.ts             # App entry: mounts Vue, registers router + DemoPreview globally
├── App.vue             # Root component (router outlet)
├── articles/           # Markdown article source files
├── components/         # Reusable UI components
├── constants/          # Config: theme colors, tag modes
├── router/             # Vue Router setup
├── styles/             # CSS: global, article, tag scoped
├── types/              # Shared TS interfaces
├── utils/              # articleList.ts (glob discovery)
└── views/              # Page-level components
```

## WHERE TO LOOK
| Task | Location |
|------|----------|
| App bootstrap | `main.ts` |
| Root component | `App.vue` |
| Type definitions | `types/index.ts` |
| Article discovery | `utils/articleList.ts` |

## CONVENTIONS
- All internal imports use `@/` alias
- `.vue` files use `<script setup lang="ts">`
- Components: PascalCase filenames
- Views: `*Page.vue` suffix for routes

## ANTI-PATTERNS
- Do NOT add side effects to `main.ts` beyond app setup
- Do NOT place page components in `components/` (use `views/`)
