const DEFAULT_SEARCH_GAME_STORAGE_KEY = 'defaultSearchGame'

export const getDefaultSearchGameFromLocalStorage = (): 'ffxiv' | 'wow' => {
  try {
    const game = localStorage.getItem(DEFAULT_SEARCH_GAME_STORAGE_KEY)
    if (!game || (game !== 'ffxiv' && game !== 'wow')) {
      return 'ffxiv'
    }
    return game
  } catch {
    return 'ffxiv'
  }
}

export const setDefaultSearchGameInLocalStorage = (
  value: 'ffxiv' | 'wow'
): { success: true } | undefined => {
  try {
    localStorage.setItem(DEFAULT_SEARCH_GAME_STORAGE_KEY, value)
    return { success: true }
  } catch {
    return undefined
  }
}
