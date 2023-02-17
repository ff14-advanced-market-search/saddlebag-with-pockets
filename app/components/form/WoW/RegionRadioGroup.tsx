import React from 'react'
import type { WoWServerRegion } from '~/requests/WOWScan'
import Label from '../Label'

const regions: Array<{ label: string; value: WoWServerRegion }> = [
  { label: 'North America', value: 'NA' },
  { label: 'Europe', value: 'EU' }
]

export const RegionRadioGroup = ({
  onChange,
  defaultChecked = 'NA',
  title = 'Select your Region'
}: {
  onChange: (region: WoWServerRegion) => void
  defaultChecked?: WoWServerRegion
  title?: string
}) => {
  return (
    <div className="flex flex-col flex-1 my-1">
      <Label>{title}</Label>
      <div
        className="flex flex-1"
        onChange={(event: React.SyntheticEvent<EventTarget>) => {
          const value = (event.target as HTMLInputElement).value
          if (value === 'NA' || value === 'EU') onChange(value)
        }}>
        {regions.map(({ label, value }) => (
          <label
            key={label}
            htmlFor={`radio-${value}`}
            className="flex flex-0 shrink-0 mx-1 text-sm items-center gap-1 mr-2 last:mr-1 dark:text-gray-300">
            <input
              id={`radio-${value}`}
              type="radio"
              value={value}
              name="region"
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
