import { isSearchGame, type SearchGame } from '~/utils/WoWForever/itemNames'

const DEFAULT_SEARCH_GAME_STORAGE_KEY = 'defaultSearchGame'

export const getDefaultSearchGameFromLocalStorage = (): SearchGame => {
  try {
    const game = localStorage.getItem(DEFAULT_SEARCH_GAME_STORAGE_KEY)
    if (!isSearchGame(game)) {
      return 'ffxiv'
    }
    return game
  } catch {
    return 'ffxiv'
  }
}

export const setDefaultSearchGameInLocalStorage = (
  value: SearchGame
): { success: true } | undefined => {
  try {
    localStorage.setItem(DEFAULT_SEARCH_GAME_STORAGE_KEY, value)
    return { success: true }
  } catch {
    return undefined
  }
}
