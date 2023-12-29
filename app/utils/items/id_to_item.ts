import { ffxivItemsMap } from './ffxivItems'
import { wowItemsMap } from './wowItems'

export const ffxivItems = Object.entries(ffxivItemsMap)
export const wowItems = Object.entries(wowItemsMap)

export const parseItemsForDataListSelect = ([value, label]: [
  string,
  string
]) => ({
  value,
  label
})

export const ffxivItemsList = ffxivItems.map(parseItemsForDataListSelect)
export const wowItemsList = wowItems.map(parseItemsForDataListSelect)
