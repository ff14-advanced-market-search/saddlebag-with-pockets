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
