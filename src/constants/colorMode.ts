export const COLOR_MODES = ['light', 'dark', 'auto'] as const
export type ColorMode = (typeof COLOR_MODES)[number]
export const DEFAULT_COLOR_MODE: ColorMode = 'auto'
export const COLOR_MODE_STORAGE_KEY = 'colorMode'

export const COLOR_MODE_LABELS: Record<ColorMode, string> = {
  light: '浅色',
  dark: '深色',
  auto: '跟随系统',
}
