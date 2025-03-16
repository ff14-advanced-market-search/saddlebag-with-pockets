import filters from '~/utils/filters/'
import { CheckBoxRow } from '../Modal/CheckBoxRow'

interface FFXIVModalContentProps {
  ids: Array<number>
  setIds: (newIds: Array<number>) => void
}

/**
 * Renders a list of checkbox rows based on filters and manages their selection state.
 * @example
 * renderCheckBoxRows({ ids: [1, 2], setIds: function(newIds) { ... } })
 * Returns a JSX.Element containing a list of CheckBoxRow components.
 * @param {FFXIVModalContentProps} {ids, setIds} - The props containing selected ids and function to update them.
 * @returns {JSX.Element} A JSX element representing the checkbox rows with nested items.
 * @description
 *   - Iterates over a list of filters and creates a CheckBoxRow component for each filter.
 *   - Handles the selection of items and their nested sub-items, updating the state of `ids`.
 *   - Supports nested checkbox rows for each item's subItems if they exist.
 *   - Uses React Fragment shorthand (`<>`) to wrap multiple JSX elements.
 */
export const FFXIVModalContent = ({
  ids,
  setIds
}: FFXIVModalContentProps): JSX.Element => {
  return (
    <>
      {filters.reduce<Array<JSX.Element>>((currentElements, item) => {
        const isSelected = ids.includes(item.id)
        return [
          ...currentElements,
          <>
            <CheckBoxRow
              key={item.id}
              title={item.name}
              selected={isSelected}
              onChange={(e) => {
                e.stopPropagation()
                if (isSelected) {
                  setIds(ids.filter((id) => id !== item.id))
                  return
                }
                setIds([...ids, item.id])
              }}
              id={item.id}
            />
            {item.data.length > 0 &&
              item.data.reduce<Array<JSX.Element>>((currentItems, subItem) => {
                if ('id' in subItem && subItem.id !== undefined) {
                  const isSubSelected = ids.includes(subItem.id)
                  return [
                    ...currentItems,
                    <CheckBoxRow
                      key={subItem.id}
                      selected={isSubSelected}
                      title={` -- ${  subItem.name}`}
                      onChange={(e) => {
                        e.stopPropagation()
                        if (isSubSelected) {
                          setIds(ids.filter((id) => id !== subItem.id))
                          return
                        }
                        if (subItem.id) {
                          setIds([...ids, subItem.id])
                        }
                      }}
                      id={subItem.id}
                    />
                  ]
                }
                return currentItems
              }, [])}
          </>
        ]
      }, [])}
    </>
  )
}
