import {
  DEFAULT_WOW_FOREVER_SETTINGS,
  validateWoWForeverSettings,
  type WoWForeverSettings
} from '~/utils/WoWForever'

const WOW_FOREVER_SETTINGS_KEY = 'wow_forever_settings'

const isSavedWoWForeverSettings = (
  value: Partial<WoWForeverSettings>
): value is WoWForeverSettings =>
  (value.region === 'NA' || value.region === 'EU') &&
  (value.faction === 'alliance' || value.faction === 'horde')

/**
 * A stored preference only counts when both fields were saved as valid values.
 * Missing or unreadable storage is not a preference, so callers must not
 * write the fallback defaults over a valid session.
 */
export const getSavedWoWForeverSettingsFromLocalStorage =
  (): WoWForeverSettings | null => {
    try {
      if (typeof localStorage === 'undefined') return null
      const raw = localStorage.getItem(WOW_FOREVER_SETTINGS_KEY)
      if (!raw) return null
      const parsed = JSON.parse(raw) as Partial<WoWForeverSettings>
      return isSavedWoWForeverSettings(parsed) ? parsed : null
    } catch {
      return null
    }
  }

export const getWoWForeverSettingsFromLocalStorage = (): WoWForeverSettings =>
  getSavedWoWForeverSettingsFromLocalStorage() ?? DEFAULT_WOW_FOREVER_SETTINGS

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
