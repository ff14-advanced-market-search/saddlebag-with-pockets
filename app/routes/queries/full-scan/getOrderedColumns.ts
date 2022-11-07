export const getOrderedColumns = (
  currentPos: number,
  newPos: number,
  sortOrder: Array<string>
): Array<string> | undefined => {
  const itemToMove = sortOrder[currentPos]
  if (!itemToMove) return

  const result = sortOrder.reduce<Array<string>>(
    (newOrder, columnId, currentIndex) => {
      // We are not at an item that needs swapping
      if (
        (currentIndex !== currentPos && currentIndex !== newPos) ||
        // item is placed on itself
        (currentIndex === newPos && currentPos === newPos)
      ) {
        return [...newOrder, columnId]
      }

      if (currentIndex === currentPos) {
        // we need to remove the item that is being moved
        return newOrder
      }

      // if we are moving the item 1 place to the right then we need to swap them around.
      if (currentIndex === newPos && currentPos + 1 === newPos) {
        return [...newOrder, columnId, itemToMove]
      }

      // else we need to drop in the moving item infront of the currently placed item
      return [...newOrder, itemToMove, columnId]
    },
    []
  )
  return result
}
