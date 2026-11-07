// 图片压缩管线：把 public/img 下的 PNG/JPEG 转成 WebP（favicon 除外）
// 用法：node scripts/convert-images.mjs              → 递归整目录
//       node scripts/convert-images.mjs a.png b.jpeg → 只转换指定文件（按文件名匹配）
// 之后在文章/封面里把 .png/.jpeg 引用改成 .webp 即可
import { readdirSync, statSync, unlinkSync } from 'node:fs'
import { join, extname } from 'node:path'
import sharp from 'sharp'

const IMG_DIR = 'public/img'
const SKIP = new Set(['tudou.png']) // favicon 保持 PNG
const QUALITY = 82

// 可选参数：只处理指定文件（按文件名匹配，覆盖整目录场景）
const only = new Set(process.argv.slice(2))
const hit = new Set()
let before = 0
let after = 0

async function walk(dir) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name)
    if (statSync(full).isDirectory()) {
      await walk(full)
      continue
    }
    if (only.size && !only.has(name)) continue
    hit.add(name)
    const ext = extname(full).toLowerCase()
    if (ext !== '.png' && ext !== '.jpeg' && ext !== '.jpg') continue
    if (SKIP.has(name)) continue

    const out = full.slice(0, -ext.length) + '.webp'
    // 头像单独缩小（展示尺寸 320px，2x 取 640）
    const isHero = name === 'tudouzai.jpeg'
    const pipeline = sharp(full)
    if (isHero) pipeline.resize({ width: 640, withoutEnlargement: true })
    const info = await pipeline.webp({ quality: isHero ? 88 : QUALITY }).toFile(out)

    const beforeSize = statSync(full).size
    before += beforeSize
    after += info.size
    unlinkSync(full) // git 历史里留有原图
    console.log(
      `${name} → ${name.slice(0, -ext.length)}.webp  ${Math.round(beforeSize / 1024)}KB → ${Math.round(info.size / 1024)}KB`,
    )
  }
}

await walk(IMG_DIR)
console.log(`\n完成：${Math.round(before / 1024)}KB → ${Math.round(after / 1024)}KB（节省 ${Math.round((1 - after / before) * 100)}%）`)
// 传了目标文件但一个都没被处理时提示，方便发现手误
const missing = [...only].filter((n) => !hit.has(n))
if (missing.length) console.warn(`未找到这些文件（或格式不支持转换）：${missing.join('、')}`)
