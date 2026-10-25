import { ref } from 'vue'
const isLoading = ref(false)
// 加载完成但进度条还在展示(跑到100%)的阶段
const isDone = ref(false)
let doneTimer: ReturnType<typeof setTimeout> | null = null

export function useLoadingBar() {
  const start = () => {
    if (doneTimer) {
      clearTimeout(doneTimer)
      doneTimer = null
    }
    isDone.value = false
    isLoading.value = true
  }
  const finish = () => {
    isLoading.value = false
    isDone.value = true
    // 等 width 过渡到 100% + 淡出完成后复位
    if (doneTimer) clearTimeout(doneTimer)
    doneTimer = setTimeout(() => {
      isDone.value = false
      doneTimer = null
    }, 400)
  }
  return { isLoading, isDone, start, finish }
}
