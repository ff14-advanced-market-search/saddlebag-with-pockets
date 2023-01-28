import React from 'react'
import Label from '../form/Label'

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
            className="flex flex-0 shrink-0 mx-1 text-sm items-center gap-1 mr-2 last:mr-1">
            <input
              id={`radio-${value}`}
              type="radio"
              value={value}
              name={name}
              defaultChecked={defaultChecked === value}
            />
            <span>{label}</span>
          </label>
        ))}
      </div>
    </div>
  )
}
