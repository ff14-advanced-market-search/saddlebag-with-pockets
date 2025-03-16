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

/**
* Retrieves the name of an item based on its ID from a list.
* @example
* getItemName(123456, [['123456', 'Sword'], ['654321', 'Shield']])
* // Returns "Sword"
* @param {number | string} id - The ID of the item to find, as a number or string.
* @param {Array} itemList - An array of item entries, where each entry consists of an item ID and its name.
* @returns {string | undefined} The name of the item if found, otherwise undefined.
* @description
*   - Converts numerical item IDs to strings for matching.
*   - Returns undefined if the item ID does not exist in the list.
*/
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

/**
* Finds the ID of an item by its name from a list.
* @example
* getItemIdByName('Potion', [['123', 'Potion'], ['456', 'Ether']])
* // Returns '123'
* @param {string} name - The name of the item to search for.
* @param {Array.<Array.<string>>} itemList - A list of items in the form of arrays, where each array contains the item's ID and name.
* @returns {string | undefined} The ID of the item if found; otherwise undefined.
* @description
*   - The function performs a case-insensitive comparison of the item names.
*   - If no item with the matching name is found, the function returns undefined.
*/
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
