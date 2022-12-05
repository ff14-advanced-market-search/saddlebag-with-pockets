import React from 'react'
import XMarkIcon from '~/icons/XMarkIcon'
import filters from '~/utils/filters/'

interface CheckboxRowProps {
  selected: boolean
  onChange: (e: React.ChangeEvent) => void
  id: string | number
  title: string
}

const CheckBoxRow = ({ selected, onChange, id, title }: CheckboxRowProps) => {
  return (
    <div className="w-[95%] flex px-1 py-2 z-[inherit] shadow-sm mb-0.5 content-between items-center min-h-12">
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

export const Modal: React.FC<{
  onClose: () => void
  children: React.ReactNode
  title: string
}> = ({ children, onClose, title }) => {
  return (
    <>
      <div
        className="z-[10001] bg-white fixed rounded top-5 bottom-5 left-3.5 right-3.5 sm:translate-y-[-50%] sm:top-2/4 sm:bottom-[none] sm:right-[none] sm:translate-x-[-50%] sm:left-2/4 p-4 pt-1 flex flex-col sm:max-w-fit sm:h-[90vh]"
        onClick={(e) => {
          e.stopPropagation()
        }}>
        <div className="flex justify-between items-center m-1 mt-0 py-0">
          <p className="font-semibold">{title}</p>
          <button
            className="flex text-gray-700 rounded p-2 justify-between items-center"
            type="button"
            aria-label="Close filter selection"
            onClick={onClose}>
            <XMarkIcon />
          </button>
        </div>
        <div className="overflow-scroll max-h-full">{children}</div>
      </div>
      <div
        className="z-[10000] opacity-75 fixed inset-0 bg-black"
        onClick={onClose}></div>
    </>
  )
}
