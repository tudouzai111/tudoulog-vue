import { computed, ref } from 'vue'
import {
  COLOR_MODE_STORAGE_KEY,
  COLOR_MODES,
  DEFAULT_COLOR_MODE,
  type ColorMode,
} from '@/constants/colorMode'
import type { WritableComputedRef } from 'vue'

// 模块级单例：与 useLoadingBar 相同的模式，全站共享一份色彩模式状态
const colorMode = ref<ColorMode>(readStoredMode())
const resolvedMode = ref<'light' | 'dark'>(resolve(colorMode.value))

const systemDarkQuery = window.matchMedia('(prefers-color-scheme: dark)')

function readStoredMode(): ColorMode {
  try {
    const saved = localStorage.getItem(COLOR_MODE_STORAGE_KEY)
    if (saved && (COLOR_MODES as readonly string[]).includes(saved)) {
      return saved as ColorMode
    }
  } catch {
    // localStorage 不可用（隐私模式等）时静默降级
  }
  return DEFAULT_COLOR_MODE
}

function resolve(mode: ColorMode): 'light' | 'dark' {
  if (mode !== 'auto') return mode
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function apply() {
  resolvedMode.value = resolve(colorMode.value)
  // index.html 中的内联脚本会在首屏前设置同样的属性，这里保持同步
  document.documentElement.dataset.colorScheme = resolvedMode.value
}

// 跟随系统模式下，系统切换深浅色时实时响应
systemDarkQuery.addEventListener('change', () => {
  if (colorMode.value === 'auto') apply()
})

// 模块加载时立即应用，保证与内联脚本的初始值一致
apply()

const colorModeWritable = computed({
  get: () => colorMode.value,
  set: (mode: ColorMode) => {
    colorMode.value = mode
    try {
      localStorage.setItem(COLOR_MODE_STORAGE_KEY, mode)
    } catch {
      // 存储失败不影响本次会话的生效
    }
    apply()
  },
}) as WritableComputedRef<ColorMode>

export function useColorMode() {
  const cycleMode = () => {
    const index = COLOR_MODES.indexOf(colorMode.value)
    colorModeWritable.value = COLOR_MODES[(index + 1) % COLOR_MODES.length]!
  }
  return {
    colorMode: colorModeWritable,
    resolvedMode,
    cycleMode,
  }
}
