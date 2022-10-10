import { items } from './id_to_item'

export const searchForItemName = (term: string) => {
  if (term.length < 2) return
  return items.filter(([_, name]) => name.includes(term))
}

export const getItemNameById = (id: number): string | undefined => {
  const name = items.find(([itemId]) => id.toString() === itemId)

  if (!name) {
    return
  }

  return name[1]
}
