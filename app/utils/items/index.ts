import { ffxivItems } from './id_to_item'

export const searchForItemName = (term: string, itemList = ffxivItems) => {
  if (!term) {
    return
  }

  const termToFilter = term.trim().toLowerCase()
  if (termToFilter.length < 2) return
  return itemList.filter(([_, name]) =>
    name.toLowerCase().includes(termToFilter)
  )
}

export const getItemNameById = (
  id: number | string,
  itemList = ffxivItems
): string | undefined => {
  const idToUse = typeof id === 'number' ? id.toString() : id

  const name = itemList.find(([itemId]) => idToUse === itemId)

  if (!name) {
    return
  }

  return name[1]
}

export const getItemIDByName = (
  name: string,
  itemList = ffxivItems
): string | undefined => {
  const lowerCaseName = name.toLowerCase()
  const item = itemList.find(
    ([_, itemName]) => lowerCaseName === itemName.toLowerCase()
  )

  if (!item) {
    return
  }

  return item[0]
}
