export const useTheme = () => {
  const isDark = useState('isDark', () => false)

  function toggleTheme() {
    isDark.value = !isDark.value
    if (import.meta.client) {
      localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
    }
  }

  function initTheme() {
    if (import.meta.client) {
      isDark.value = localStorage.getItem('theme') === 'dark'
    }
  }

  return { isDark, toggleTheme, initTheme }
}
