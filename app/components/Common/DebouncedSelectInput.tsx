import DebouncedInput from './DebouncedInput'
import TitleTooltip from './TitleTooltip'
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
  error
}: {
  title?: string
  tooltip?: string
  formName?: string
  selectOptions: Array<SelectInputOption>
  onSelect?: (debouncedValue: string) => void
  error?: string
}) {
  const [name, setName] = useState('')

  const items = getItems(name, selectOptions)
  const handleDebounceChange = (debouncedValue: string) => {
    setName(debouncedValue)
    onSelect?.(debouncedValue)
  }

  const className = classNames(
    'flex flex-col rounded-md shadow-sm focus:ring-blue-500 focus:border-2 focus:border-blue-500 border border-gray-300 dark:border-gray-400 justify-center items-center',
    error ? 'border-red-500' : ''
  )

  return (
    <div className={className}>
      {title && <TitleTooltip title={title} toolTip={tooltip} />}
      <DebouncedInput
        onDebouncedChange={handleDebounceChange}
        className={`p-2 w-full border-0 rounded-md dark:border-gray-400 dark:text-gray-100 dark:bg-gray-600`}
        list="items"
        name={formName}
      />
      {items.length > 0 && (
        <datalist id="items">
          {items.map((item) => (
            <option key={item.value + '-' + item.label} value={item.label} />
          ))}
        </datalist>
      )}
    </div>
  )
}
