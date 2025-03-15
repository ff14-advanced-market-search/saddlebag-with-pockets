import { useDragLayer } from 'react-dnd'

/**
* Creates a draggable preview element based on the current dragging state.
* @example
* <Preview />
* <div className="fixed pointer-events-none top-0 left-0 opacity-80 dark:opacity-30 dark:text-gray-100 z-20"></div>
* @returns {JSX.Element|null} JSX element representing a draggable preview or null if not dragging.
* @description
*   - Applies a rotation transform of 5 degrees to the preview element.
*   - Adjusts position using styles based on currentOffset values.
*   - Ensures the element has reduced pointer events and opacity for a better visual effect.
*/
const Preview = () => {
  const { isDragging, item, currentOffset } = useDragLayer((monitor) => {
    return {
      item: monitor.getItem(),
      itemType: monitor.getItemType(),
      initialOffset: monitor.getInitialSourceClientOffset(),
      currentOffset: monitor.getSourceClientOffset(),
      isDragging: monitor.isDragging()
    }
  })

  return isDragging ? (
    <div
      className="fixed pointer-events-none top-0 left-0 opacity-80 dark:opacity-30 dark:text-gray-100 z-20"
      style={{
        transform: `translate(${currentOffset?.x}px, ${currentOffset?.y}px) rotate(5deg)`
      }}>
      {item.stuff}
    </div>
  ) : null
}

export default Preview
