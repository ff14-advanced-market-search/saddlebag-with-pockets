import { items } from './id_to_item'

export const searchForItemName = (term: string) => {
  const termToFilter = term.trim().toLowerCase()
  if (termToFilter.length < 2) return
  return items.filter(([_, name]) => name.toLowerCase().includes(termToFilter))
}

export const getItemNameById = (id: number): string | undefined => {
  const name = items.find(([itemId]) => id.toString() === itemId)

  if (!name) {
    return
  }

  return name[1]
}
