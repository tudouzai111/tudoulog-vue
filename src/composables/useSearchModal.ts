import { ref } from 'vue'

// 模块级单例，与 useLoadingBar / useColorMode 相同的模式
const isOpen = ref(false)

export function useSearchModal() {
  const open = () => {
    isOpen.value = true
  }
  const close = () => {
    isOpen.value = false
  }
  const toggle = () => {
    isOpen.value = !isOpen.value
  }
  return { isOpen, open, close, toggle }
}
