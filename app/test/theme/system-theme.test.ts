import { runInNewContext } from 'node:vm'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { store } from '~/redux/store'
import { toggleDarkMode, resetToSystemTheme } from '~/redux/reducers/userSlice'
import {
  clientThemeCode,
  startThemeSync
} from '~/utils/providers/theme-provider'

const setupBrowser = (saved: string | null, systemDark: boolean) => {
  let value = saved
  let dark = false
  const mediaListeners = new Set<(event: MediaQueryListEvent) => void>()
  const storageListeners = new Set<(event: StorageEvent) => void>()
  const media = {
    matches: systemDark,
    addEventListener: (
      _: string,
      listener: (event: MediaQueryListEvent) => void
    ) => mediaListeners.add(listener),
    removeEventListener: (
      _: string,
      listener: (event: MediaQueryListEvent) => void
    ) => mediaListeners.delete(listener)
  }
  const localStorage = {
    getItem: () => value,
    setItem: (_: string, next: string) => {
      value = next
    },
    removeItem: () => {
      value = null
    }
  }
  const window = {
    matchMedia: () => media,
    addEventListener: (_: string, listener: (event: StorageEvent) => void) =>
      storageListeners.add(listener),
    removeEventListener: (_: string, listener: (event: StorageEvent) => void) =>
      storageListeners.delete(listener)
  }
  const document = {
    documentElement: {
      classList: {
        toggle: (_: string, next: boolean) => {
          dark = next
        }
      }
    }
  }
  vi.stubGlobal('window', window)
  vi.stubGlobal('document', document)
  vi.stubGlobal('localStorage', localStorage)
  return {
    window,
    document,
    localStorage,
    isDark: () => dark,
    saved: () => value,
    setSystem: (next: boolean) => {
      media.matches = next
      mediaListeners.forEach((listener) =>
        listener({ matches: next } as MediaQueryListEvent)
      )
    },
    setExternal: (next: string | null) => {
      value = next
      storageListeners.forEach((listener) =>
        listener({ key: 'darkmode' } as StorageEvent)
      )
    },
    listenerCount: () => mediaListeners.size + storageListeners.size
  }
}

afterEach(() => vi.unstubAllGlobals())

describe('theme preference', () => {
  it.each([
    [null, true, true],
    [null, false, false],
    ['false', true, false],
    ['true', false, true],
    ['invalid', true, true]
  ])(
    'applies saved %s and system dark %s before paint and after hydration',
    (saved, system, expected) => {
      const browser = setupBrowser(saved, system)
      runInNewContext(clientThemeCode, browser)
      expect(browser.isDark()).toBe(expected)
      const stop = startThemeSync(store)
      expect(browser.isDark()).toBe(expected)
      expect(store.getState().user.darkmode).toBe(expected)
      stop()
    }
  )

  it('follows system changes until the user chooses a theme, and can return to system', () => {
    const browser = setupBrowser(null, false)
    const stop = startThemeSync(store)
    browser.setSystem(true)
    expect(browser.isDark()).toBe(true)
    expect(store.getState().user.darkmode).toBe(true)
    expect(browser.saved()).toBeNull()

    store.dispatch(toggleDarkMode())
    expect(browser.saved()).toBe('false')
    expect(browser.isDark()).toBe(false)
    browser.setSystem(false)
    browser.setSystem(true)
    expect(browser.isDark()).toBe(false)

    store.dispatch(resetToSystemTheme())
    expect(browser.saved()).toBeNull()
    expect(browser.isDark()).toBe(true)
    browser.setSystem(false)
    expect(browser.isDark()).toBe(false)
    stop()
    expect(browser.listenerCount()).toBe(0)
  })

  it('syncs a preference changed or cleared in another tab', () => {
    const browser = setupBrowser(null, true)
    const stop = startThemeSync(store)
    browser.setExternal('false')
    expect(browser.isDark()).toBe(false)
    browser.setExternal(null)
    expect(browser.isDark()).toBe(true)
    stop()
  })

  it('uses light mode when the browser cannot report a system preference', () => {
    const browser = setupBrowser(null, true)
    vi.stubGlobal('window', { ...browser.window, matchMedia: undefined })
    runInNewContext(clientThemeCode, { ...browser, window: globalThis.window })
    expect(browser.isDark()).toBe(false)
    const stop = startThemeSync(store)
    expect(browser.isDark()).toBe(false)
    stop()
  })

  it('falls back to the system when storage is unavailable', () => {
    const browser = setupBrowser(null, true)
    browser.localStorage.getItem = () => {
      throw new Error('blocked')
    }
    runInNewContext(clientThemeCode, browser)
    expect(browser.isDark()).toBe(true)
    const stop = startThemeSync(store)
    expect(browser.isDark()).toBe(true)
    stop()
  })
})
