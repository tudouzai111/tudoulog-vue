/**
 * 构建期标签折算（零依赖）：
 * 让"随手写标签"保持可行——大小写漂移与已确认的同义词在构建期统一为 canonical 写法，
 * 前端展示 / ?tags= 筛选 / 相关文章重合度看到的永远是同一字符串；源 md 不修改。
 *
 * 规则：
 * 1. 别名表优先（人工确认过的同义词与官方拼写，key 按小写匹配）；
 * 2. 其余按 case 不敏感分组，组内取出现次数最多的写法（并列取扫描序中先出现者）；
 * 3. 折算差异输出建议日志（每条只提示一次），不改源文件、不阻断构建。
 */

export interface TagFoldItem {
  id: string
  tags: string[]
}

/** 人工确认过的别名 / 官方拼写表：key 全小写，value 为 canonical 展示拼写。
 *  大小写类漂移无需登记（case 折叠自动处理），这里只放"机器推断不出来"的映射。
 *  口径：确认一个同义词或官方写法，就加一行。 */
const TAG_ALIASES: Record<string, string> = {
  cloudflare: 'Cloudflare', // 官方拼写（现有文章全写成了 CloudFlare）
  springboot: 'Spring Boot', // 官方是两个词
  js: 'JavaScript', // 同义缩写
}

interface TagFoldNotice {
  from: string
  to: string
  files: string[]
}

// 同一条折算建议在 dev 热重载期间只提示一次（与 normalizePublicImg 的去重同套路）
const loggedNotices = new Set<string>()

export function foldTags(items: TagFoldItem[]): TagFoldNotice[] {
  // ① 按 case 不敏感 key 统计各写法出现次数
  const groups = new Map<string, Map<string, number>>() // key → 原始写法 → 次数
  for (const { tags } of items) {
    for (const tag of tags) {
      const key = tag.toLowerCase()
      const group = groups.get(key) ?? new Map<string, number>()
      group.set(tag, (group.get(tag) ?? 0) + 1)
      groups.set(key, group)
    }
  }

  // ② 每组定 canonical：别名表优先，否则组内最高频写法（并列取先出现者）
  const canonical = new Map<string, string>()
  for (const [key, group] of groups) {
    const alias = TAG_ALIASES[key]
    if (alias) {
      canonical.set(key, alias)
      continue
    }
    let best: string | undefined
    let max = -1
    for (const [variant, count] of group) {
      if (count > max) {
        max = count
        best = variant
      }
    }
    canonical.set(key, best ??= group.keys().next().value!)
  }

  // ③ 原地重写为 canonical（同篇内去重），收集折算差异
  const notices = new Map<string, TagFoldNotice>()
  for (const item of items) {
    const folded: string[] = []
    for (const tag of item.tags) {
      const target = canonical.get(tag.toLowerCase())!
      if (target !== tag) {
        const memo = `${tag} → ${target}`
        const notice = notices.get(memo) ?? { from: tag, to: target, files: [] }
        notice.files.push(item.id)
        notices.set(memo, notice)
      }
      if (!folded.includes(target)) folded.push(target)
    }
    item.tags = folded
  }

  const list = [...notices.values()]
  for (const n of list) {
    if (!loggedNotices.has(n.from)) {
      loggedNotices.add(n.from)
      console.warn(
        `[tudou-article] 标签折算："${n.from}" → "${n.to}"（${n.files.join('、')}），建议顺手统一 frontmatter。`,
      )
    }
  }
  return list
}
