import { useState } from 'react'
import Modal from '../Modal'
import { CheckBoxRow } from '../Modal/CheckBoxRow'
import { FFXIVModalContent } from '../ffxiv/FFXIVModalContent'

const noop = () => {}

const Filter = ({
  formName,
  filterButtonText = 'Choose Filters',
  selectedCountText = 'Filters',
  defaultValue,
  title,
  options,
  onChange
}: {
  formName: string
  filterButtonText?: string
  selectedCountText?: string
  defaultValue: Array<number>
  title: string
  options?: Array<{ value: number; label: string }>
  onChange?: (newIds: Array<number>) => void
}) => {
  const [ids, setIds] = useState(defaultValue)
  const [isOpen, setIsOpen] = useState(false)

  const handleOpen = () => setIsOpen(true)
  const handleClose = () => setIsOpen(false)
  return (
    <>
      <div className="col-span-6 sm:col-span-3 xl:col-span-2">
        <label
          htmlFor={formName}
          className="block text-sm my-1 font-medium text-gray-700 dark:text-gray-300">
          {title}
        </label>
        <div className={`mt-1 flex rounded-md shadow-sm`}>
          <input
            name={formName}
            value={ids.map((job) => job.toString())}
            hidden
            onChange={noop}
          />
          <button
            className="w-full py-2 px-4 text-sm bg-gray-100 hover:bg-gray-300 border border-gray-300 rounded text-left dark:bg-gray-500 dark:border-gray-500 dark:text-gray-200 dark:hover:bg-gray-400"
            aria-label="Choose filters"
            type="button"
            onClick={handleOpen}>
            {filterButtonText}
          </button>
        </div>
        <p className="mt-2 text-sm text-gray-400">{`${selectedCountText} applied: ${ids.length}`}</p>
      </div>
      {isOpen && (
        <Modal
          onClose={handleClose}
          title={`${selectedCountText} Selected: ${ids.length}`}>
          {options ? (
            <>
              {options?.map((option) => {
                const isSelected = ids.includes(option.value)
                return (
                  <CheckBoxRow
                    key={`${option.label}-${option.value}`}
                    title={option.label}
                    selected={isSelected}
                    onChange={(e) => {
                      e.stopPropagation()
                      if (isSelected) {
                        const newIds = ids.filter((id) => id !== option.value)
                        setIds(newIds)
                        onChange?.(newIds)
                        return
                      }

                      const newIds = [...ids, option.value]
                      setIds(newIds)
                      onChange?.(newIds)
                    }}
                    id={option.value}
                  />
                )
              })}
            </>
          ) : (
            <FFXIVModalContent
              ids={ids}
              setIds={(newIds) => {
                setIds(newIds)
                onChange?.(newIds)
              }}
            />
          )}
        </Modal>
      )}
    </>
  )
}

export default Filter
