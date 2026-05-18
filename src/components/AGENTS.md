# src/components/ Knowledge Base

## OVERVIEW
Reusable UI components. Layout subfolder contains app shell (header, footer, layout wrapper).

## STRUCTURE
```
components/
├── BackToTop.vue       # Scroll-to-top button
├── CardComponent.vue   # Article card display
├── DemoPreview.vue     # Demo preview (registered globally in main.ts)
├── TagComponent.vue    # Tag display/filtering
├── TocComponent.vue    # Table of contents container
├── TocItem.vue         # Individual TOC item
└── layout/             # App shell components
    ├── AppLayout.vue   # Main layout wrapper with router-view
    ├── AppHeader.vue   # Site header/navigation
    └── AppFooter.vue   # Site footer
```

## WHERE TO LOOK
| Task | Location |
|------|----------|
| Add new UI component | Directly in this folder |
| Modify app shell | `layout/` subfolder |
| TOC rendering | `TocComponent.vue` + `TocItem.vue` |
| Article cards | `CardComponent.vue` |

## CONVENTIONS
- PascalCase `.vue` filenames
- `<script setup lang="ts">` syntax
- Scoped styles unless global override needed

## ANTI-PATTERNS
- Do NOT add page-level logic here (use `views/`)
- Do NOT register components globally unless truly needed (only `DemoPreview` is)
