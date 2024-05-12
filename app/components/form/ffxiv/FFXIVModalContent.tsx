import filters from '~/utils/filters/'
import { CheckBoxRow } from '../Modal/CheckBoxRow'

interface FFXIVModalContentProps {
  ids: Array<number>
  setIds: (newIds: Array<number>) => void
}

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
                      title={' -- ' + subItem.name}
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
