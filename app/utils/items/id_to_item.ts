import { itemsMap } from './items'

export const items = Object.entries(itemsMap)

export const parseItemsForDataListSelect = ([value, label]: [
  string,
  string
]) => ({
  value,
  label
})

export const ffxivItemsList = items.map(parseItemsForDataListSelect)
