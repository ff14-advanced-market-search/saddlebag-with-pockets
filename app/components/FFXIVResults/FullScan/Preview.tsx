import { useDragLayer } from 'react-dnd'

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
      className='fixed pointer-events-none top-0 left-0 opacity-80 dark:opacity-30 dark:text-gray-100 z-20'
      style={{
        transform: `translate(${currentOffset?.x}px, ${currentOffset?.y}px) rotate(5deg)`
      }}
    >
      {item.stuff}
    </div>
  ) : null
}

export default Preview
