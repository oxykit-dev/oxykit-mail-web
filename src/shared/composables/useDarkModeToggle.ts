import { ref } from 'vue'
import { useTheme } from 'vuetify'

export function useDarkModeToggle() {
  const theme = useTheme()
  const isDark = ref(theme.global.current.value.dark)

  function toggleDark() {
    if (isDark.value) {
      if (typeof theme.change === 'function') theme.change('light')
    } else {
      if (typeof theme.change === 'function') theme.change('dark')
    }
    isDark.value = !isDark.value
  }

  return { isDark, toggleDark }
}
