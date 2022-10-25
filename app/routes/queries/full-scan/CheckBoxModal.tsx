import React from 'react'
import filters from '~/utils/filters/'

interface CheckboxRowProps {
  selected: boolean
  onChange: (e: React.ChangeEvent) => void
  id: string | number
  title: string
}

const CheckBoxRow = ({ selected, onChange, id, title }: CheckboxRowProps) => {
  return (
    <div className="w-[95%] flex px-1 py-2 z-[inherit] shadow-sm mb-0.5 content-between items-center">
      <label
        htmlFor={`${title}-${id}`}
        style={{ flexGrow: 1, textAlign: 'left' }}>
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
}> = ({ children, onClose }) => {
  return (
    <>
      <div
        style={{
          zIndex: 10001,
          backgroundColor: 'white',
          position: 'fixed',
          top: '20px',
          width: 'fit-content',
          borderRadius: '5px',
          margin: '0 auto',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '90vh',
          maxWidth: '90vw'
        }}
        onClick={(e) => {
          e.stopPropagation()
        }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button type="button" onClick={onClose}>
            Close
          </button>
        </div>
        <div
          style={{
            overflow: 'scroll',
            maxHeight: '100%'
          }}>
          {children}
        </div>
      </div>
      <div
        style={{
          zIndex: 10000,
          opacity: 0.7,
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'black'
        }}
        onClick={onClose}></div>
    </>
  )
}
