import { ffxivItemsMap } from './ffxivItems'
import { wowItemsMap } from './wowItems'
import { wowForeverItemsMap } from './wowForeverItems'
import { wowPetsItemsMap } from './wowPetItems'
import { wowStackableItemsMap } from './wowStackableItems'
import { gw2ItemsMap } from './gw2Items'

export const ffxivItems = Object.entries(ffxivItemsMap)
export const wowItems = Object.entries(wowItemsMap)
export const wowForeverItems = Object.entries(wowForeverItemsMap)
export const wowPetsItems = Object.entries(wowPetsItemsMap)
export const wowStackableItems = Object.entries(wowStackableItemsMap)
export const gw2Items = Object.entries(gw2ItemsMap)

export const parseItemsForDataListSelect = ([value, label]: [
  string,
  string
]) => ({
  value,
  label
})

/**
 * Datalist labels for search: append ` (id)` when the same name maps to
 * multiple ids so selecting a suggestion targets that specific item.
 */
export const itemSelectOptionsWithUniqueLabels = (
  items: [string, string][]
) => {
  const nameCounts = new Map<string, number>()
  for (const [, name] of items) {
    const key = name.toLowerCase()
    nameCounts.set(key, (nameCounts.get(key) ?? 0) + 1)
  }

  return items.map(([id, name]) => ({
    value: id,
    label:
      (nameCounts.get(name.toLowerCase()) ?? 0) > 1 ? `${name} (${id})` : name
  }))
}

export const ffxivItemsList = ffxivItems.map(parseItemsForDataListSelect)
export const wowItemsList = wowItems.map(parseItemsForDataListSelect)
export const wowForeverItemsList =
  itemSelectOptionsWithUniqueLabels(wowForeverItems)
export const wowPetItemsList = wowPetsItems.map(parseItemsForDataListSelect)
export const wowStackableItemList = wowStackableItems.map(
  parseItemsForDataListSelect
)
export const gw2ItemsList = gw2Items.map(parseItemsForDataListSelect)
