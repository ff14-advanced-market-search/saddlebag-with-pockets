import Label from '~/components/form/Label'
import {
  WOW_FOREVER_FACTIONS,
  WOW_FOREVER_RULESETS,
  type WoWForeverFaction,
  type WoWForeverRegion,
  type WoWForeverSettings
} from '~/utils/WoWForever'

const regions: Array<{ label: string; value: WoWForeverRegion }> = [
  { label: 'North America', value: 'NA' },
  { label: 'Europe', value: 'EU' }
]

const ChoiceRow = <Value extends string>({
  title,
  name,
  value,
  options,
  onChange
}: {
  title: string
  name: string
  value: Value
  options: Array<{ label: string; value: Value }>
  onChange: (value: Value) => void
}) => {
  return (
    <div className="flex flex-col flex-1 my-1">
      <Label>{title}</Label>
      <div className="flex flex-wrap gap-x-3 gap-y-2 mt-1">
        {options.map((option) => (
          <label
            key={option.value}
            className="flex items-center gap-1 text-sm dark:text-gray-300">
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              className="dark:bg-transparent dark:border-2 dark:border-gray-200"
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  )
}

/**
 * Region, faction, and ruleset for WoW Forever.
 */
export default function ForeverHomeSelect({
  settings,
  onChange
}: {
  settings: WoWForeverSettings
  onChange: (settings: WoWForeverSettings) => void
}) {
  return (
    <div className="space-y-3">
      <ChoiceRow
        title="Region"
        name="forever-region"
        value={settings.region}
        options={regions}
        onChange={(region) => onChange({ ...settings, region })}
      />
      <ChoiceRow
        title="Faction"
        name="forever-faction"
        value={settings.faction}
        options={WOW_FOREVER_FACTIONS}
        onChange={(faction: WoWForeverFaction) =>
          onChange({ ...settings, faction })
        }
      />
      <ChoiceRow
        title="Ruleset"
        name="forever-ruleset"
        value={settings.ruleset}
        options={WOW_FOREVER_RULESETS}
        onChange={(ruleset) => onChange({ ...settings, ruleset })}
      />
    </div>
  )
}
