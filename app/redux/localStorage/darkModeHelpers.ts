const DARK_MODE_STORAGE_KEY = 'darkmode'

export const getDarkModeFromLocalStorage = () => {
  try {
    const darkmode = localStorage.getItem(DARK_MODE_STORAGE_KEY)
    if (!darkmode) {
      return false
    }
    return darkmode === 'true'
  } catch {
    return false
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
