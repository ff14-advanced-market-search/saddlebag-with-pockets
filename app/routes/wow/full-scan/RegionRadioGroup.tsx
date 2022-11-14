import type { WoWServerRegion } from '~/requests/WOWScan'

const regions: Array<{ label: string; value: WoWServerRegion }> = [
  { label: 'North America', value: 'NA' },
  { label: 'Europe', value: 'EU' }
]

export const RegionRadioGroup = ({
  onChange,
  defaultChecked = 'NA'
}: {
  onChange: (region: WoWServerRegion) => void
  defaultChecked?: WoWServerRegion
}) => {
  return (
    <div
      onChange={(event: React.SyntheticEvent<EventTarget>) => {
        const value = (event.target as HTMLInputElement).value
        if (value === 'NA' || value === 'EU') onChange(value)
      }}>
      {regions.map(({ label, value }) => (
        <label key={label} htmlFor={`radio-${value}`} className="mx-1">
          <>
            <input
              id={`radio-${value}`}
              type="radio"
              value={value}
              name="region"
              defaultChecked={defaultChecked === value}
            />
            {label}
          </>
        </label>
      ))}
    </div>
  )
}
