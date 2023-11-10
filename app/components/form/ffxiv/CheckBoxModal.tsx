import React from 'react'
import filters from '~/utils/filters/'

interface CheckboxRowProps {
  selected: boolean
  onChange: (e: React.ChangeEvent) => void
  id: string | number
  title: string
}

export const CheckBoxRow = ({
  selected,
  onChange,
  id,
  title
}: CheckboxRowProps) => {
  return (
    <div className="w-[95%] flex px-1 py-2 z-[inherit] shadow-sm mb-0.5 content-between items-center min-h-12 dark:text-gray-300 dark:border-b dark:border-gray-500">
      <label htmlFor={`${title}-${id}`} className="grow text-left">
        {title}
      </label>
      <input
        id={`${title}-${id}`}
        checked={selected}
        onChange={onChange}
        type="checkbox"
      />
    </div>
  )
}

interface ModalContentProps {
  ids: Array<number>
  setIds: (newIds: Array<number>) => void
}

export const ModalContent = ({
  ids,
  setIds
}: ModalContentProps): JSX.Element => {
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
