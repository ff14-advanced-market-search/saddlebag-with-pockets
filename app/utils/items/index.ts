import { items } from './id_to_item'

export const searchForItemName = (term: string) => {
  const termToFilter = term.trim().toLowerCase()
  if (termToFilter.length < 2) return
  return items.filter(([_, name]) => name.toLowerCase().includes(termToFilter))
}

export const getItemNameById = (id: number | string): string | undefined => {
  const idToUse = typeof id === 'number' ? id.toString() : id

  const name = items.find(([itemId]) => idToUse === itemId)

  if (!name) {
    return
  }

  return name[1]
}
