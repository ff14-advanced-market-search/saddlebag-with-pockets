import type { ForeverItemNamesMap } from '../../requests/WoWForever/ItemNames'
import { parseItemsForDataListSelect } from '../items/id_to_item'

export type ForeverItemEntry = [string, string]

export const foreverItemNamesToEntries = (
  names: ForeverItemNamesMap
): ForeverItemEntry[] =>
  Object.entries(names).sort((a, b) =>
    a[1].localeCompare(b[1], undefined, { sensitivity: 'base' })
  )

export const foreverItemNamesToSelectOptions = (names: ForeverItemNamesMap) =>
  foreverItemNamesToEntries(names).map(parseItemsForDataListSelect)

export type SearchGame = 'ffxiv' | 'wow' | 'gw2' | 'forever'

export const isSearchGame = (value: unknown): value is SearchGame =>
  value === 'ffxiv' || value === 'wow' || value === 'gw2' || value === 'forever'
