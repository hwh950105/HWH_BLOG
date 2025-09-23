import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  const isDarkMode = ref(true)

  const toggleTheme = () => {
    isDarkMode.value = !isDarkMode.value
    // Update body class for global theme
    document.body.classList.toggle('dark-mode', isDarkMode.value)
    document.body.classList.toggle('light-mode', !isDarkMode.value)
  }

  return {
    isDarkMode,
    toggleTheme
  }
}) 