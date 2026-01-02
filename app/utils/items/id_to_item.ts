import { ffxivItemsMap } from './ffxivItems'
import { wowItemsMap } from './wowItems'
import { wowPetsItemsMap } from './wowPetItems'
import { wowStackableItemsMap } from './wowStackableItems'
import { gw2ItemsMap } from './gw2Items'

export const ffxivItems = Object.entries(ffxivItemsMap)
export const wowItems = Object.entries(wowItemsMap)
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

export const ffxivItemsList = ffxivItems.map(parseItemsForDataListSelect)
export const wowItemsList = wowItems.map(parseItemsForDataListSelect)
export const wowPetItemsList = wowPetsItems.map(parseItemsForDataListSelect)
export const wowStackableItemList = wowStackableItems.map(
  parseItemsForDataListSelect
)
export const gw2ItemsList = gw2Items.map(parseItemsForDataListSelect)
