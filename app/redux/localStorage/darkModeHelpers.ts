export const DARK_MODE_STORAGE_KEY = 'darkmode'
export const DARK_MODE_MEDIA_QUERY = '(prefers-color-scheme: dark)'

export const getSavedDarkMode = (): boolean | null => {
  try {
    const value = localStorage.getItem(DARK_MODE_STORAGE_KEY)
    return value === 'true' ? true : value === 'false' ? false : null
  } catch {
    return null
  }
}

export const getSystemDarkMode = (): boolean =>
  typeof window !== 'undefined' && typeof window.matchMedia === 'function'
    ? window.matchMedia(DARK_MODE_MEDIA_QUERY).matches
    : false

export const setDarkModeInLocalStorage = (value: boolean) => {
  try {
    localStorage.setItem(DARK_MODE_STORAGE_KEY, value.toString())
    return { success: true }
  } catch {
    return undefined
  }
}

export const clearDarkModeFromLocalStorage = () => {
  try {
    localStorage.removeItem(DARK_MODE_STORAGE_KEY)
  } catch {
    // The current session can still follow the system preference.
  }
}
