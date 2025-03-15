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

/**
 * Creates a filter selection component allowing users to select options from a list.
 * @example
 * createFilterComponent({ formName: 'jobFilter', defaultValue: [1, 2], options: jobOptions, title: 'Job Selection', onChange: handleFilterChange })
 * Returns a JSX element for selecting filter options.
 * @param {Object} props - The properties for the filter component.
 * @param {string} props.formName - The name attribute for the hidden input element.
 * @param {number[]} props.defaultValue - The initial values for selected options.
 * @param {Array} props.options - The available options to display for selection with properties value and label.
 * @param {string} props.title - The title label for the filter component.
 * @param {Function} props.onChange - The callback function invoked when selected options change.
 * @returns {JSX.Element} Returns a JSX layout containing the filter component and its logic.
 * @description
 *   - Utilizes controlled React state management to handle user selections.
 *   - Toggles option selection based on user interaction within a modal.
 *   - The modal opens and closes based on user actions on the component's button element.
 *   - Translates selected numeric values into string format for display and hidden input value management.
 */
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
