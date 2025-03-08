import { useState } from 'react'
import Modal from '../Modal'
import { CheckBoxRow } from '../Modal/CheckBoxRow'
import { FFXIVModalContent } from '../ffxiv/FFXIVModalContent'

const noop = () => {}

interface FilterProps {
  formName: string
  defaultValue: number[]
  options: Array<{ value: number; label: string }>
  title: string
  onChange?: (selectedValues: number[]) => void
}

const Filter = ({
  formName,
  defaultValue,
  options,
  title,
  onChange
}: FilterProps) => {
  const [selected, setSelected] = useState<number[]>(defaultValue)
  const [isOpen, setIsOpen] = useState(false)

  const handleOpen = () => setIsOpen(true)
  const handleClose = () => setIsOpen(false)

  const handleChange = (value: number) => {
    const newSelected = selected.includes(value)
      ? selected.filter((v) => v !== value)
      : [...selected, value]

    setSelected(newSelected)
    onChange?.(newSelected)
  }

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
            value={selected.map((job) => job.toString())}
            hidden
            onChange={noop}
          />
          <button
            className="w-full py-2 px-4 text-sm bg-gray-100 hover:bg-gray-300 border border-gray-300 rounded text-left dark:bg-gray-500 dark:border-gray-500 dark:text-gray-200 dark:hover:bg-gray-400"
            aria-label="Choose filters"
            type="button"
            onClick={handleOpen}>
            Choose Filters
          </button>
        </div>
        <p className="mt-2 text-sm text-gray-400">{`Filters applied: ${selected.length}`}</p>
      </div>
      {isOpen && (
        <Modal onClose={handleClose} title="Filters Selected: 1">
          {options ? (
            <>
              {options?.map((option) => {
                const isSelected = selected.includes(option.value)
                return (
                  <CheckBoxRow
                    key={`${option.label}-${option.value}`}
                    title={option.label}
                    selected={isSelected}
                    onChange={(e) => {
                      e.stopPropagation()
                      handleChange(option.value)
                    }}
                    id={option.value}
                  />
                )
              })}
            </>
          ) : (
            <FFXIVModalContent
              ids={selected}
              setIds={(newIds) => {
                setSelected(newIds)
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
