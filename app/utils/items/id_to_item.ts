import { ffxivItemsMap } from './ffxivItems'

export const ffxivItems = Object.entries(ffxivItemsMap)

export const parseItemsForDataListSelect = ([value, label]: [
  string,
  string
]) => ({
  value,
  label
})

export const ffxivItemsList = ffxivItems.map(parseItemsForDataListSelect)
