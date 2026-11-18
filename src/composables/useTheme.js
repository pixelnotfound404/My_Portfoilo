import { ref, watch, onMounted } from 'vue'

const isDark = ref(true)

export function useTheme() {
  function applyTheme(dark) {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light')
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  }

  function toggleTheme() {
    isDark.value = !isDark.value
  }

  onMounted(() => {
    const saved = localStorage.getItem('theme')
    isDark.value = saved ? saved === 'dark' : true
    applyTheme(isDark.value)
  })

  watch(isDark, applyTheme)

  return { isDark, toggleTheme }
}
