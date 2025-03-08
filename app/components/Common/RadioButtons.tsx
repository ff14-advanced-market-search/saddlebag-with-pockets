import React from 'react'
import Label from '../form/Label'

/**
 * Renders a set of radio buttons with a title label.
 *
 * This component displays a labeled group of radio buttons based on the provided options.
 * When a radio button is selected, it calls the onChange callback with the corresponding value.
 *
 * @param onChange - Callback invoked when a radio button is selected.
 * @param radioOptions - Array of objects representing radio button options, each with a label and a value.
 * @param name - Name attribute for all radio buttons, ensuring they function as a group.
 * @param title - Title displayed above the radio buttons. Defaults to 'Select your Region'.
 * @param defaultChecked - Optional value that, when matching an option's value, marks that radio button as checked by default.
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
    <div className='flex flex-col flex-1 my-1'>
      <Label>{title}</Label>
      <div
        className='flex flex-1'
        onChange={(event: React.SyntheticEvent<EventTarget>) => {
          const value = (event.target as HTMLInputElement).value
          onChange?.(value)
        }}
      >
        {radioOptions.map(({ label, value }) => (
          <label
            key={label}
            htmlFor={`radio-${value}`}
            className='flex flex-0 shrink-0 mx-1 text-sm items-center gap-1 mr-2 last:mr-1 dark:text-gray-200'
          >
            <input
              id={`radio-${value}`}
              type='radio'
              value={value}
              name={name}
              defaultChecked={defaultChecked === value}
              className='dark:bg-transparent dark:border-2 dark:border-gray-200 dark:focus:border-gray-100 dark:focus:border-3'
            />
            <span>{label}</span>
          </label>
        ))}
      </div>
    </div>
  )
}
