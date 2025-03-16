import { useEffect, useRef } from 'react'
import { useDrop, useDrag } from 'react-dnd'
import { getEmptyImage } from 'react-dnd-html5-backend'

const ItemTypes = {
  COLUMN: 'COLUMN',
  ROW: 'ROW'
}

/**
 * Handles the drag-and-drop functionality for table header columns.
 * @example
 * draggableHeader({ column, index, reorder, darkMode, children, ...rest })
 * <th>...</th>
 * @param {Object} { column, index, reorder, darkMode, children, ...rest } - Object containing necessary properties for draggable header.
 * @returns {JSX.Element} A table header element with drag-and-drop capabilities.
 * @description
 *   - Integrates React DnD hooks for managing drag-and-drop actions within table header columns.
 *   - Determines the outline color based on the darkMode flag.
 *   - Utilizes refs to attach drag-and-drop functionality using JSX element properties.
 *   - Leverages useEffect for setting up drag preview while capturing the dragging state.
 */
const DraggableHeader = ({
  column,
  index,
  reorder,
  darkMode,
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_props, drag, preview] = useDrag({
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

  const outlineColor = darkMode ? 'rgb(121, 124, 128)' : 'rgb(55, 65, 81)'

  drag(drop(ref))

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true })
  }, [preview])

  return (
    <th
      ref={ref}
      style={{
        cursor: 'move',
        outline: isOver ? `solid 2px ${outlineColor}` : ''
      }}
      {...rest}>
      {children}
    </th>
  )
}

export default DraggableHeader
