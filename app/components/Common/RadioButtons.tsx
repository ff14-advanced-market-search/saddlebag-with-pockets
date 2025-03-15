import React from 'react'
import Label from '../form/Label'

/**
 * Renders a group of radio buttons with customizable options and handling.
 * @example
 * RadioButtons({
 *   onChange: (value) => console.log(value),
 *   defaultChecked: 'option1',
 *   title: 'Select Option',
 *   radioOptions: [{ label: 'Option 1', value: 'option1' }, { label: 'Option 2', value: 'option2' }],
 *   name: 'options'
 * })
 * // returns rendered radio button component with specified options
 * @param {(value: string | number) => void} onChange - Callback executed when the selected radio button changes.
 * @param {Array<{label: string | number; value: string | number}>} radioOptions - Array of objects representing the options for the radio buttons.
 * @param {string} name - The name attribute for the radio buttons group.
 * @param {string} title - The title label for the radio button group.
 * @param {string | number} defaultChecked - Specifies the initially checked radio button.
 * @returns {JSX.Element} Returns a JSX element representing the radio button group.
 * @description
 *   - Provides default selection handling capability through the `defaultChecked` parameter.
 *   - Integrates seamlessly with React component architecture utilizing props.
 *   - Each radio input element includes a unique HTML `id` attribute derived from its `value`.
 *   - Applies dark mode styling when applicable through specific class names.
 */
export function RadioButtons({
  onChange,
  defaultChecked,
  title = 'Select your Region',
  radioOptions,
  name
}: {
  onChange: (value: string | number) => void
  radioOptions: Array<{ label: string | number; value: string | number }>
  name: string
  title: string
  defaultChecked?: string | number
}) {
  return (
    <div className="flex flex-col flex-1 my-1">
      <Label>{title}</Label>
      <div
        className="flex flex-1"
        onChange={(event: React.SyntheticEvent<EventTarget>) => {
          const value = (event.target as HTMLInputElement).value
          onChange?.(value)
        }}>
        {radioOptions.map(({ label, value }) => (
          <label
            key={label}
            htmlFor={`radio-${value}`}
            className="flex flex-0 shrink-0 mx-1 text-sm items-center gap-1 mr-2 last:mr-1 dark:text-gray-200">
            <input
              id={`radio-${value}`}
              type="radio"
              value={value}
              name={name}
              defaultChecked={defaultChecked === value}
              className="dark:bg-transparent dark:border-2 dark:border-gray-200 dark:focus:border-gray-100 dark:focus:border-3"
            />
            <span>{label}</span>
          </label>
        ))}
      </div>
    </div>
  )
}
