import { items } from './id_to_item'

export const searchForItemName = (term: string, itemList = items) => {
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
  itemList = items
): string | undefined => {
  const idToUse = typeof id === 'number' ? id.toString() : id

  const name = itemList.find(([itemId]) => idToUse === itemId)

  if (!name) {
    return
  }

  return name[1]
}
