const DEFAULT_SEARCH_GAME_STORAGE_KEY = 'defaultSearchGame'

export const getDefaultSearchGameFromLocalStorage = ():
  | 'ffxiv'
  | 'wow'
  | 'gw2' => {
  try {
    const game = localStorage.getItem(DEFAULT_SEARCH_GAME_STORAGE_KEY)
    if (!game || (game !== 'ffxiv' && game !== 'wow' && game !== 'gw2')) {
      return 'ffxiv'
    }
    return game as 'ffxiv' | 'wow' | 'gw2'
  } catch {
    return 'ffxiv'
  }
}

export const setDefaultSearchGameInLocalStorage = (
  value: 'ffxiv' | 'wow' | 'gw2'
): { success: true } | undefined => {
  try {
    localStorage.setItem(DEFAULT_SEARCH_GAME_STORAGE_KEY, value)
    return { success: true }
  } catch {
    return undefined
  }
}
