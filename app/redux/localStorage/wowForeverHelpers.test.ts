import { afterEach, expect, test, vi } from 'vitest'
import {
  getSavedWoWForeverSettingsFromLocalStorage,
  getWoWForeverSettingsFromLocalStorage
} from './wowForeverHelpers'

const storage = new Map<string, string>()

afterEach(() => {
  storage.clear()
  vi.unstubAllGlobals()
})

const stubStorage = () => {
  vi.stubGlobal('localStorage', {
    getItem: (key: string) => storage.get(key) ?? null,
    setItem: (key: string, value: string) => {
      storage.set(key, value)
    }
  })
}

test('missing forever settings are not treated as a saved preference', () => {
  stubStorage()

  expect(getSavedWoWForeverSettingsFromLocalStorage()).toBeNull()
  expect(getWoWForeverSettingsFromLocalStorage()).toEqual({
    region: 'NA',
    faction: 'alliance'
  })
  expect(storage.size).toBe(0)
})

test('unreadable forever settings are not treated as a saved preference', () => {
  storage.set('wow_forever_settings', '{')
  stubStorage()

  expect(getSavedWoWForeverSettingsFromLocalStorage()).toBeNull()
  expect(storage.get('wow_forever_settings')).toBe('{')
})

test('a saved forever preference is returned as stored', () => {
  storage.set(
    'wow_forever_settings',
    JSON.stringify({ region: 'EU', faction: 'horde' })
  )
  stubStorage()

  expect(getSavedWoWForeverSettingsFromLocalStorage()).toEqual({
    region: 'EU',
    faction: 'horde'
  })
})
