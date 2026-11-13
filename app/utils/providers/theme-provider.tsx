import {
  DARK_MODE_MEDIA_QUERY,
  DARK_MODE_STORAGE_KEY,
  getSavedDarkMode,
  getSystemDarkMode
} from '~/redux/localStorage/darkModeHelpers'
import { syncTheme } from '~/redux/reducers/userSlice'
import type { store } from '~/redux/store'

// Runs before styles are painted, using the same precedence as the hydrated app.
export const clientThemeCode = `
;(() => {
  let saved = null;
  try { saved = localStorage.getItem(${JSON.stringify(
    DARK_MODE_STORAGE_KEY
  )}); } catch {}
  const systemDark = typeof window.matchMedia === 'function' && window.matchMedia(${JSON.stringify(
    DARK_MODE_MEDIA_QUERY
  )}).matches;
  const dark = saved === 'true' ? true : saved === 'false' ? false : systemDark;
  document.documentElement.classList.toggle('dark', dark);
})()`

export const EnsureThemeApplied = () => (
  <script dangerouslySetInnerHTML={{ __html: clientThemeCode }} />
)

export const startThemeSync = (themeStore: typeof store) => {
  const media =
    typeof window.matchMedia === 'function'
      ? window.matchMedia(DARK_MODE_MEDIA_QUERY)
      : null
  const apply = () => {
    document.documentElement.classList.toggle(
      'dark',
      themeStore.getState().user.darkmode
    )
  }
  const readPreference = () => {
    const saved = getSavedDarkMode()
    themeStore.dispatch(
      syncTheme({
        darkmode: saved ?? getSystemDarkMode(),
        preference: saved === null ? 'system' : 'manual'
      })
    )
  }
  const onSystemChange = (event: MediaQueryListEvent) => {
    if (themeStore.getState().user.themePreference === 'system') {
      themeStore.dispatch(
        syncTheme({ darkmode: event.matches, preference: 'system' })
      )
    }
  }
  const onStorageChange = (event: StorageEvent) => {
    if (event.key === DARK_MODE_STORAGE_KEY || event.key === null) {
      readPreference()
    }
  }

  const unsubscribe = themeStore.subscribe(apply)
  readPreference()
  if (media?.addEventListener) media.addEventListener('change', onSystemChange)
  else media?.addListener(onSystemChange)
  window.addEventListener('storage', onStorageChange)

  return () => {
    unsubscribe()
    if (media?.removeEventListener)
      media.removeEventListener('change', onSystemChange)
    else media?.removeListener(onSystemChange)
    window.removeEventListener('storage', onStorageChange)
  }
}
