import { useEffect, useRef } from 'react'
import { useDrop, useDrag } from 'react-dnd'
import { getEmptyImage } from 'react-dnd-html5-backend'

const ItemTypes = {
  COLUMN: 'COLUMN',
  ROW: 'ROW'
}

const DraggableHeader = ({
  column,
  index,
  reorder,
  children,
  ...rest
}: any) => {
  const ref = useRef()
  const { id } = column

  const [{ isOver }, drop] = useDrop({
    accept: ItemTypes.COLUMN,
    drop: (item) => {
      reorder(item, index)
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      isOverCurrent: monitor.isOver({ shallow: true })
    })
  })

  const [{ isDragging }, drag, preview] = useDrag({
    type: ItemTypes.COLUMN,
    item: () => {
      return {
        id,
        index,
        stuff: column.column.columnDef.header
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  })

  drag(drop(ref))

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true })
  }, [preview])

  return (
    <th
      ref={ref}
      {...rest}
      style={{
        cursor: 'move',
        opacity: isDragging ? 0.5 : 1,
        outline: isOver ? 'solid 2px yellow' : 'none'
      }}>
      {children}
    </th>
  )
}

export default DraggableHeader
