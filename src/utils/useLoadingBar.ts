import { ref } from 'vue'
const isLoading = ref(false)
export function useLoadingBar() {
  return { isLoading }
}
