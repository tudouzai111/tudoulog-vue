// 找出 public/img 下没有被任何源码/文章引用的"孤儿图片"
// 用法：node scripts/find-unused-images.mjs（只报告，不删除，删前自行二次确认）
//
// 判定方式是拿文件名在整个仓库的文本文件里搜（排除 dist/node_modules/.git/图片目录自身），
// 宁可漏报（把没用到的认为在用）也不误报，因为 CMS 编辑草稿时常有临时引用变化。
// 常见引用会覆盖：markdown 正文/封面 frontmatter、src/words、vue/ts/css、index.html 等页面模板。
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, extname, relative } from 'node:path'

const ROOT = process.cwd()
const IMG_DIR = 'public/img'
const SKIP_DIRS = new Set(['node_modules', 'dist', '.git'])
const TEXT_EXT = new Set([
  '.md',
  '.ts',
  '.vue',
  '.js',
  '.mjs',
  '.cjs',
  '.html',
  '.yml',
  '.yaml',
  '.json',
  '.css',
  '.scss',
  '.txt',
  '.xml',
])

function walkFiles(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name)
    if (statSync(full).isDirectory()) {
      // 跳过目录名命中黑名单的任意层级（dist/node_modules/.git）
      if (!SKIP_DIRS.has(name)) walkFiles(full, out)
      continue
    }
    if (TEXT_EXT.has(extname(name).toLowerCase())) out.push(full)
  }
  return out
}

function walkImages(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name)
    if (statSync(full).isDirectory()) {
      walkImages(full, out)
      continue
    }
    if (/\.(png|jpe?g|webp|gif|avif)$/i.test(name)) out.push(full)
  }
  return out
}

// 把所有可搜索文本拼成一个大池子，按文件名（basename）判断是否被引用
const corpus = walkFiles(ROOT)
  .filter((f) => !f.replaceAll('\\', '/').includes('/public/img/'))
  .map((f) => {
    try {
      return readFileSync(f, 'utf8')
    } catch {
      return '' // 个别文本读取失败不影响整体扫描
    }
  })
  .join('\n')

const unused = []
for (const img of walkImages(IMG_DIR)) {
  // coverImage frontmatter 只写裸文件名（渲染时才拼 img/cover/ 前缀），
  // 所以无论图片在哪层子目录，都按 basename 判定
  const base = img.split(/[\\/]/).pop() ?? img
  if (!corpus.includes(base)) unused.push({ path: relative(ROOT, img), base })
}

if (unused.length === 0) {
  console.log('未引用图片：0，一切干净')
} else {
  console.warn(`发现 ${unused.length} 张未引用图片：`)
  for (const { path } of unused) console.warn(`  ${path}`)
  console.warn('处理方式：CMS 媒体库删除，或 git rm 后推送（git 历史里有原图）。')
}
