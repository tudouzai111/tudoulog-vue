/**
 * 标题 slug 生成，全项目唯一实现。
 *
 * 构建期（vite.config.ts 给 heading 生成 id）与运行时（ArticleDetail.vue 的目录锚点）
 * 都 import 这一份——两处 id 必须一致，目录才能锚上。需要调整规则时只改这里，
 * 不要在任何一处复制同名逻辑。
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-') // 空格替换为'-'
    .replace(/[^\w\u4e00-\u9fa5-]/g, '') // 保留中文、字母、数字、下划线、连字符
}
