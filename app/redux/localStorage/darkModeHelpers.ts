const DARK_MODE_STORAGE_KEY = 'darkmode'

const getSystemPrefersDarkMode = () => {
  if (typeof window === 'undefined') {
    return false
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

export const getDarkModeFromLocalStorage = () => {
  try {
    const darkmode = localStorage.getItem(DARK_MODE_STORAGE_KEY)
    if (!darkmode) {
      return getSystemPrefersDarkMode()
    }
    return darkmode === 'true'
  } catch {
    return getSystemPrefersDarkMode()
  }
}

export const setDarkModeInLocalStorage = (value: boolean) => {
  try {
    localStorage.setItem(DARK_MODE_STORAGE_KEY, value.toString())
    return { success: true }
  } catch {
    return undefined
  }
}
