import {
  DEFAULT_WOW_FOREVER_SETTINGS,
  validateWoWForeverSettings,
  type WoWForeverSettings
} from '~/utils/WoWForever'

const WOW_FOREVER_SETTINGS_KEY = 'wow_forever_settings'

export const getWoWForeverSettingsFromLocalStorage = (): WoWForeverSettings => {
  try {
    const raw = localStorage.getItem(WOW_FOREVER_SETTINGS_KEY)
    if (!raw) {
      setWoWForeverSettingsInLocalStorage(DEFAULT_WOW_FOREVER_SETTINGS)
      return DEFAULT_WOW_FOREVER_SETTINGS
    }

    const parsed = JSON.parse(raw) as Partial<WoWForeverSettings>
    return validateWoWForeverSettings(parsed.region, parsed.faction)
  } catch {
    setWoWForeverSettingsInLocalStorage(DEFAULT_WOW_FOREVER_SETTINGS)
    return DEFAULT_WOW_FOREVER_SETTINGS
  }
}

export const setWoWForeverSettingsInLocalStorage = (
  settings: WoWForeverSettings
) => {
  try {
    const valid = validateWoWForeverSettings(settings.region, settings.faction)
    localStorage.setItem(WOW_FOREVER_SETTINGS_KEY, JSON.stringify(valid))
    return { success: true }
  } catch {
    return undefined
  }
}
