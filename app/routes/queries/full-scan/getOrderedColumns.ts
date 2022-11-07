export const getOrderedColumns = (
  currentPos: number,
  newPos: number,
  sortOrder: Array<string>
): Array<string> | undefined => {
  const itemToMove = sortOrder[currentPos]
  if (!itemToMove) return

  const result = sortOrder.reduce<Array<string>>(
    (newOrder, columnId, currentIndex) => {
      if (currentIndex !== currentPos && currentIndex !== newPos) {
        return [...newOrder, columnId]
      }

      if (currentIndex === currentPos) {
        return newOrder
      }

      return [...newOrder, itemToMove, columnId]
    },
    []
  )
  return result
}
