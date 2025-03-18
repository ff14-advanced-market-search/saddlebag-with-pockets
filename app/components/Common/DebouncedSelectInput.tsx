import Label from '../form/Label'
import DebouncedInput from './DebouncedInput'
import { ToolTip } from './InfoToolTip'
import { useState, forwardRef } from 'react'
import { classNames } from '~/utils'

interface SelectInputOption {
  label: string
  value: string
}

/**
 * Filters and sorts a list of options based on string matching.
 * @example
 getItems('ap', [{label: 'Apple'}, {label: 'Grape'}, {label: 'Apricot'}])
 * // returns [{label: 'Apple'}, {label: 'Apricot'}]
 * @param {string} string - The string used to filter the list of options.
 * @param {Array<SelectInputOption>} list - The list of options to be filtered.
 * @returns {Array<SelectInputOption>} A new array with options that start with or include the string.
 * @description
 *   - The function prioritizes options whose labels start with the provided string.
 *   - Both the provided string and option labels are compared in lowercase.
 *   - When the string has fewer than 2 characters, the function returns an empty array.
 */
const getItems = (string: string, list: Array<SelectInputOption>) => {
  if (string.length < 2) return []
  const includes: Array<SelectInputOption> = []
  const startsWith: Array<SelectInputOption> = []

  list.forEach((item) => {
    const itemLabelLower = item.label.toLowerCase()
    const stringLower = string.toLowerCase()
    if (itemLabelLower.startsWith(stringLower)) {
      startsWith.push(item)
      return
    }
    if (itemLabelLower.includes(stringLower)) {
      includes.push(item)
      return
    }
  })

  return startsWith.concat(includes)
}

interface Props {
  title?: string
  tooltip?: string
  formName?: string
  id: string
  selectOptions: Array<SelectInputOption>
  onSelect?: (debouncedValue: string) => void
  error?: string
  placeholder?: string
  containerClassNames?: string
  label?: string
  useDebounce?: boolean
  debounceTimer?: number
  disabled?: boolean
  displayValue?: string
}

const DebouncedSelectInput = forwardRef<HTMLInputElement, Props>(
  (
    {
      title,
      tooltip,
      onSelect,
      selectOptions,
      formName,
      error,
      placeholder,
      containerClassNames,
      label,
      id,
      useDebounce = false,
      debounceTimer,
      disabled,
      displayValue
    },
    ref
  ) => {
    const [name, setName] = useState(displayValue ? displayValue : '')

    const items = getItems(name, selectOptions)

    const handleDebounceChange = (debouncedValue: string) => {
      setName(debouncedValue)
      onSelect?.(debouncedValue)
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value
      setName(value)
      onSelect?.(value)
    }

    const className = classNames(
      'flex flex-col rounded-md shadow-sm',
      error ? 'border-red-500' : '',
      containerClassNames || ''
    )

    const inputClassname = classNames(
      'p-2 w-full',
      label
        ? 'rounded-l-md border-gray-300 border-0 border-r'
        : 'border-0 border-transparent rounded-md',
      'focus:ring-blue-500 focus:border-2 focus:border-blue-500 dark:border-gray-400 dark:text-gray-100 dark:bg-gray-600'
    )

    return (
      <div className={className}>
        {title && (
          <>
            <div className="flex gap-1 relative items-center">
              <Label htmlFor={id}>{title}</Label>
              {tooltip && <ToolTip data={tooltip} />}
            </div>
          </>
        )}
        <div className="flex rounded-md shadow-sm border border-gray-300 dark:border-gray-400 mt-1">
          {useDebounce ? (
            <DebouncedInput
              ref={ref}
              id={id}
              onDebouncedChange={handleDebounceChange}
              className={inputClassname}
              list={`items-${id}`}
              name={formName}
              placeholder={placeholder}
              debounceTimer={debounceTimer}
              disabled={disabled}
              defaultValue={displayValue}
            />
          ) : (
            <input
              ref={ref}
              id={id}
              onChange={handleChange}
              className={inputClassname}
              list={`items-${id}`}
              name={formName}
              placeholder={placeholder}
              defaultValue={displayValue}
            />
          )}
          {label && (
            <span
              className={`inline-flex items-center justify-center text-center px-3 rounded-r-md bg-gray-50 text-gray-500 sm:text-sm dark:text-gray-300 dark:bg-gray-700`}>
              {label}
            </span>
          )}
        </div>
        {items.length > 0 && (
          <datalist id={`items-${id}`}>
            {items.map((item) => (
              <option key={`${item.value}-${item.label}`} value={item.label} />
            ))}
          </datalist>
        )}
      </div>
    )
  }
)

DebouncedSelectInput.displayName = 'DebouncedSelectInput'

export default DebouncedSelectInput
