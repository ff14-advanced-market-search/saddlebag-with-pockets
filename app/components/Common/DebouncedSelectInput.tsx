import Label from '../form/Label'
import DebouncedInput from './DebouncedInput'
import { ToolTip } from './InfoToolTip'
import { useState } from 'react'
import { classNames } from '~/utils'

interface SelectInputOption {
  label: string
  value: string
}

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

export default function DebouncedSelectInput({
  title,
  tooltip,
  onSelect,
  selectOptions,
  formName,
  error,
  placeholder,
  containerClassNames,
  label,
  id
}: {
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
}) {
  const [name, setName] = useState('')

  const items = getItems(name, selectOptions)
  const handleDebounceChange = (debouncedValue: string) => {
    setName(debouncedValue)
    onSelect?.(debouncedValue)
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
      : 'border-0 rounded-md',
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
        <DebouncedInput
          id={id}
          onDebouncedChange={handleDebounceChange}
          className={inputClassname}
          list={'items-' + id}
          name={formName}
          placeholder={placeholder}
        />
        {label && (
          <span
            className={`inline-flex items-center justify-center text-center px-3 rounded-r-md bg-gray-50 text-gray-500 sm:text-sm dark:text-gray-300 dark:bg-gray-700`}>
            {label}
          </span>
        )}
      </div>
      {items.length > 0 && (
        <datalist id={'items-' + id}>
          {items.map((item) => (
            <option key={item.value + '-' + item.label} value={item.label} />
          ))}
        </datalist>
      )}
    </div>
  )
}
