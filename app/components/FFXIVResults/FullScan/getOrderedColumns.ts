/**
* Rearranges an item in an array from a current position to a new position.
* @example
* rearrangeItem(1, 3, ['a', 'b', 'c', 'd'])
* // Returns ['a', 'c', 'd', 'b']
* @param {number} currentPos - The current index of the item to be moved.
* @param {number} newPos - The target index where the item should be moved to.
* @param {Array<string>} sortOrder - The array of strings where the item movement will occur.
* @returns {Array<string> | undefined} A new array with the item rearranged, or undefined if the item at currentPos doesn't exist.
* @description
*   - If the item is being moved to the right by one position, it is placed after the current item.
*   - Returns the original array unmodified if the currentPos and newPos are the same.
*   - Utilizes the `reduce` function to accumulate the new order of items.
*   - Safely handles edge cases by returning undefined when no item is present at the current position.
*/
export const getOrderedColumns = (
  currentPos: number,
  newPos: number,
  sortOrder: Array<string>
): Array<string> | undefined => {
  const itemToMove = sortOrder[currentPos]
  if (!itemToMove) return

  const result = sortOrder.reduce<Array<string>>(
    (newOrder, currentItem, currentIndex) => {
      if (
        // We are not at an item that needs swapping
        (currentIndex !== currentPos && currentIndex !== newPos) ||
        // item is placed on itself
        (currentIndex === newPos && currentPos === newPos)
      ) {
        return [...newOrder, currentItem]
      }

      // Remove item that was moved
      if (currentIndex === currentPos) {
        return newOrder
      }

      // if we are moving the item 1 place to the right place it after the current item.
      if (currentIndex === newPos && currentPos + 1 === newPos) {
        return [...newOrder, currentItem, itemToMove]
      }

      // else drop the item in it's new position
      return [...newOrder, itemToMove, currentItem]
    },
    []
  )
  return result
}
