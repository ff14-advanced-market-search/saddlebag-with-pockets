import React, { useState } from 'react'
import { ToolTip } from '~/components/Common/InfoToolTip'
import { InputWithLabel } from '../InputWithLabel'
import SmallFormContainer from '../SmallFormContainer'
import type { WoWServerRegion, WoWServerData } from '~/requests/WoW/types'
import Label from '../Label'
import WoWServerSelect from './WoWServerSelect'
import RegionAndServerSelect from './RegionAndServerSelect'

interface Props {
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  loading: boolean
  error?: string
  clearErrors: () => void
  defaultRegion?: WoWServerRegion
  defaultServer?: WoWServerData
}

const itemQuality = [
  {
    name: 'Common',
    value: 1
  },
  {
    name: 'Uncommon',
    value: 2
  },
  {
    name: 'Rare',
    value: 3
  },
  {
    name: 'Epic',
    value: 4
  },
  {
    name: 'Legendary',
    value: 5
  },
  {
    name: 'Artifact',
    value: 6
  },
  {
    name: 'Heirloom',
    value: 7
  }
]

const expansionOptions = [
  { label: 'All', value: '-1' },
  { label: 'Classic (Vanilla)', value: '1' },
  { label: 'The Burning Crusade', value: '2' },
  { label: 'Wrath of the Lich King', value: '3' },
  { label: 'Cataclysm', value: '4' },
  { label: 'Mists of Pandaria', value: '5' },
  { label: 'Warlords of Draenor', value: '6' },
  { label: 'Legion', value: '7' },
  { label: 'Battle for Azeroth', value: '8' },
  { label: 'Shadowlands', value: '9' },
  { label: 'Dragonflight', value: '10' },
  { label: 'The War Within', value: '11' }
]

const WoWScanForm = ({
  onClick,
  loading,
  error,
  onChange,
  clearErrors,
  defaultRegion = 'NA',
  defaultServer = { name: 'Thrall', id: 3678 }
}: Props) => {
  return (
    <SmallFormContainer
      title="WoW Non-Commodity Server to Server Trade Search"
      onClick={onClick}
      loading={loading}
      disabled={loading}
      error={error}>
      <div className="flex flex-col lg:flex-row lg:gap-7">
        <div className="w-full">
          <InputWithLabel
            defaultValue={10000}
            type="number"
            labelTitle="Minimum Average TSM Price"
            inputTag="Amount"
            name="minHistoricPrice"
            onChange={(e) => {
              onChange(e)
              clearErrors()
            }}
          />
          <InputWithLabel
            defaultValue={50}
            type="number"
            labelTitle="Return On Investment (%)"
            inputTag="%"
            name="roi"
            onChange={onChange}
            min={0}
          />
          <InputWithLabel
            defaultValue={0}
            type="number"
            step="0.01"
            labelTitle="Minimum Sales Per Day"
            inputTag="Min Sales"
            name="salePerDay"
            onChange={onChange}
            min={0}
          />
          <InputWithLabel
            defaultValue={-1}
            type="number"
            labelTitle="Minimum Required Level"
            inputTag="Level"
            name="requiredLevel"
            onChange={onChange}
            min={-1}
            max={70}
          />
          <InputWithLabel
            defaultValue={-1}
            type="number"
            labelTitle="Minimum Item Level (ilvl)"
            inputTag="Level"
            name="iLvl"
            onChange={onChange}
            min={-1}
            max={1000}
          />
          <ItemQualitySelect />
        </div>
        <div className="w-full">
          <ItemClassSelect
            onChange={(itemClassValue, itemSubClassValue) => {
              // Notify parent component
            }}
          />
          <RegionAndServerSelect
            serverSelectFormName="homeRealmId"
            serverSelectTitle="Home World"
            region={defaultRegion}
            defaultRealm={defaultServer}
            onServerSelectChange={clearErrors}
            onServerTextChange={clearErrors}
          />
          <WoWServerSelect
            formName="newRealmId"
            title="New World"
            onSelectChange={clearErrors}
            onTextChange={clearErrors}
            regionValue={defaultRegion}
          />
        </div>
      </div>
    </SmallFormContainer>
  )
}

export default WoWScanForm

const itemClasses: Array<{
  name: string
  value: number
  subClasses: Array<{ name: string; value: number }>
}> = [
  {
    name: 'Consumable',
    value: 0,
    subClasses: [
      { name: 'Generic', value: 0 },
      { name: 'Potion', value: 1 },
      { name: 'Elixir', value: 2 },
      { name: 'Flasks & Phials', value: 3 },
      { name: 'Food & Drink', value: 4 },
      { name: 'Food & Drink 2', value: 5 },
      { name: 'Bandage', value: 6 },
      { name: 'Other', value: 7 },
      { name: 'Other 2', value: 8 },
      { name: 'Vantus Rune', value: 9 }
    ]
  },
  {
    name: 'Container',
    value: 1,
    subClasses: [
      { name: 'Bag', value: 0 },
      { name: 'Soul Bag', value: 1 },
      { name: 'Herb Bag', value: 2 },
      { name: 'Enchanting Bag', value: 3 },
      { name: 'Engineering Bag', value: 4 },
      { name: 'Gem Bag', value: 5 },
      { name: 'Mining Bag', value: 6 },
      { name: 'Leatherworking Bag', value: 7 },
      { name: 'Inscription Bag', value: 8 },
      { name: 'Tackle Box', value: 9 },
      { name: 'Cooking Bag', value: 10 }
    ]
  },
  {
    name: 'Weapon',
    value: 2,
    subClasses: [
      { name: 'One-Handed Axes', value: 0 },
      { name: 'Two-Handed Axes', value: 1 },
      { name: 'Bows', value: 2 },
      { name: 'Guns', value: 3 },
      { name: 'One-Handed Maces', value: 4 },
      { name: 'Two-Handed Maces', value: 5 },
      { name: 'Polearms', value: 6 },
      { name: 'One-Handed Swords', value: 7 },
      { name: 'Two-Handed Swords', value: 8 },
      { name: 'Warglaives', value: 9 },
      { name: 'Staves', value: 10 },
      { name: 'Bear Claws', value: 11 },
      { name: 'CatClaws', value: 12 },
      { name: 'Fist Weapons', value: 13 },
      { name: 'Miscellaneous', value: 14 },
      { name: 'Daggers', value: 15 },
      { name: 'Thrown', value: 16 },
      { name: 'Crossbows', value: 18 },
      { name: 'Wands', value: 19 },
      { name: 'Fishing Poles', value: 20 }
    ]
  },
  {
    name: 'Gem',
    value: 3,
    subClasses: [
      { name: 'Intellect', value: 0 },
      { name: 'Agility', value: 1 },
      { name: 'Strength', value: 2 },
      { name: 'Stamina', value: 3 },
      { name: 'Spirit', value: 4 },
      { name: 'Critical Strike', value: 5 },
      { name: 'Mastery', value: 6 },
      { name: 'Haste', value: 7 },
      { name: 'Versatility', value: 8 },
      { name: 'Other', value: 9 },
      { name: 'Multiple Stats', value: 10 },
      { name: 'Artifact Relic', value: 11 }
    ]
  },
  {
    name: 'Armor',
    value: 4,
    subClasses: [
      {
        name: 'Misc',
        value: 0
      },
      { name: 'Cloth', value: 1 },
      { name: 'Leather', value: 2 },
      { name: 'Mail', value: 3 },
      { name: 'Plate', value: 4 },
      { name: 'Cosmetic', value: 5 },
      { name: 'Shields', value: 6 },
      { name: 'Librams', value: 7 },
      { name: 'Idols', value: 8 },
      { name: 'Totems', value: 9 },
      { name: 'Sigils', value: 10 },
      { name: 'Relic', value: 11 }
    ]
  },
  {
    name: 'Tradegoods',
    value: 7,
    subClasses: [
      { name: 'Parts', value: 1 },
      { name: 'Jewelcrafting', value: 4 },
      { name: 'Cloth', value: 5 },
      { name: 'Leather', value: 6 },
      { name: 'Metal & Stone', value: 7 },
      { name: 'Cooking', value: 8 },
      { name: 'Herb', value: 9 },
      { name: 'Elemental', value: 10 },
      { name: 'Other', value: 11 },
      { name: 'Enchanting', value: 12 },
      { name: 'Inscription', value: 16 },
      { name: 'Optional Reagents', value: 18 },
      { name: 'Finishing Reagents', value: 19 }
    ]
  },
  {
    name: 'Item Enhancement',
    value: 8,
    subClasses: [
      { name: 'Head', value: 0 },
      { name: 'Neck', value: 1 },
      { name: 'Shoulder', value: 2 },
      { name: 'Cloak', value: 3 },
      { name: 'Chest', value: 4 },
      { name: 'Wrist', value: 5 },
      { name: 'Hands', value: 6 },
      { name: 'Waist', value: 7 },
      { name: 'Legs', value: 8 },
      { name: 'Feet', value: 9 },
      { name: 'Finger', value: 10 },
      { name: 'One-Handed Weapon', value: 11 },
      { name: 'Two-Handed Weapon', value: 12 },
      { name: 'Shield/Off-hand', value: 13 },
      { name: 'Misc', value: 14 }
    ]
  },
  {
    name: 'Recipe',
    value: 9,
    subClasses: [
      { name: 'Book', value: 0 },
      { name: 'Leatherworking', value: 1 },
      { name: 'Tailoring', value: 2 },
      { name: 'Engineering', value: 3 },
      { name: 'Blacksmithing', value: 4 },
      { name: 'Cooking', value: 5 },
      { name: 'Alchemy', value: 6 },
      { name: 'First Aid', value: 7 },
      { name: 'Enchanting', value: 8 },
      { name: 'Fishing', value: 9 },
      { name: 'Jewelcrafting', value: 10 },
      { name: 'Inscription', value: 11 }
    ]
  },
  {
    name: 'Quest Item',
    value: 12,
    subClasses: [{ name: 'Quest Item', value: 0 }]
  },
  {
    name: 'Miscellaneous',
    value: 15,
    subClasses: [
      { name: 'Junk', value: 0 },
      { name: 'Reagent', value: 1 },
      { name: 'Companion Pets', value: 2 },
      { name: 'Holiday', value: 3 },
      { name: 'Other', value: 4 },
      { name: 'Mount', value: 5 },
      { name: 'Mount Equipment', value: 6 },
      { name: 'Toys', value: 199 }
    ]
  },
  {
    name: 'Glyph',
    value: 16,
    subClasses: [
      { name: 'Warrior', value: 1 },
      { name: 'Paladin', value: 2 },
      { name: 'Hunter', value: 3 },
      { name: 'Rogue', value: 4 },
      { name: 'Priest', value: 5 },
      { name: 'Death Knight', value: 6 },
      { name: 'Shaman', value: 7 },
      { name: 'Mage', value: 8 },
      { name: 'Warlock', value: 9 },
      { name: 'Monk', value: 10 },
      { name: 'Druid', value: 11 },
      { name: 'Demon Hunter', value: 12 }
    ]
  },
  {
    name: 'Battle Pet',
    value: 17,
    subClasses: [
      { name: 'Humanoid', value: 0 },
      { name: 'Dragonkin', value: 1 },
      { name: 'Flying', value: 2 },
      { name: 'Undead', value: 3 },
      { name: 'Critter', value: 4 },
      { name: 'Magic', value: 5 },
      { name: 'Elemental', value: 6 },
      { name: 'Beast', value: 7 },
      { name: 'Aquatic', value: 8 },
      { name: 'Mechanical', value: 9 }
    ]
  },
  {
    name: 'Profession',
    value: 19,
    subClasses: [
      { name: 'Blacksmithing', value: 0 },
      { name: 'Leatherworking', value: 1 },
      { name: 'Alchemy', value: 2 },
      { name: 'Herbalism', value: 3 },
      { name: 'Cooking', value: 4 },
      { name: 'Mining', value: 5 },
      { name: 'Tailoring', value: 6 },
      { name: 'Engineering', value: 7 },
      { name: 'Enchanting', value: 8 },
      { name: 'Fishing', value: 9 },
      { name: 'Skinning', value: 10 },
      { name: 'Jewelcrafting', value: 11 },
      { name: 'Inscription', value: 12 },
      { name: 'Archaeology', value: 1 }
    ]
  }
]

interface ItemClassSelectProps {
  itemClass?: number
  itemSubClass?: number
  onChange?: (itemClassValue: number, itemSubClassValue: number) => void
}

export const ItemClassSelect: React.FC<ItemClassSelectProps> = ({
  itemClass,
  itemSubClass,
  onChange
}) => {
  const [selectedItemClass, setSelectedItemClass] = useState(itemClass)
  const [selectedItemSubClass, setSelectedItemSubClass] = useState(itemSubClass)

  const subClassItems = itemClasses.find(
    (item) => item.value === selectedItemClass
  )?.subClasses

  return (
    <div className="mt-2 flex-col mb-0.5">
      <div className="flex flex-1 items-center gap-1 mt-0.5 relative">
        <Label htmlFor="itemClass">Item Category</Label>
        <ToolTip data="Pick an item category to search for" />
      </div>
      <Select
        id={'itemClass'}
        name={'itemClass'}
        value={selectedItemClass}
        onChange={(event) => {
          const newItemClassValue = parseInt(event.target.value, 10)
          setSelectedItemClass(newItemClassValue)
          setSelectedItemSubClass(-1) // Reset itemSubClass when itemClass changes
          onChange?.(newItemClassValue, -1) // Notify parent component with new values
        }}>
        <option value={-1}>All</option>
        {itemClasses.map(({ name, value }) => (
          <option key={name + value} value={value}>
            {name}
          </option>
        ))}
      </Select>
      <div className="flex flex-1 items-center gap-1 mt-0.5 relative">
        <Label htmlFor="itemSubClass">Item Sub Category</Label>
        <ToolTip data="Pick an item sub category to search for" />
      </div>
      <Select
        id={'itemSubClass'}
        name={'itemSubClass'}
        value={selectedItemSubClass}
        onChange={(event) => {
          const newItemSubClassValue = parseInt(event.target.value, 10)
          setSelectedItemSubClass(newItemSubClassValue)
          onChange?.(selectedItemClass ?? -1, newItemSubClassValue) // Provide a default value for selectedItemClass
        }}>
        <option value={-1}>All</option>
        {subClassItems?.map(({ name, value }) => (
          <option key={name + value} value={value}>
            {name}
          </option>
        ))}
      </Select>
    </div>
  )
}

interface ItemQualitySelectProps {
  defaultValue?: string
  onChange?: (value: string) => void
}

export const ItemQualitySelect: React.FC<ItemQualitySelectProps> = ({
  defaultValue,
  onChange
}) => (
  <div className="w-full mt-2">
    <div className="flex flex-1 items-center gap-1 mt-0.5 relative">
      <Label htmlFor="item-quality">Item Quality</Label>
      <ToolTip data="Pick which quality item you would like to search from" />
    </div>
    <Select
      id="item-quality"
      name="itemQuality"
      defaultValue={defaultValue}
      onChange={(e) => onChange?.(e.target.value)}>
      {itemQuality.map(({ name, value }) => (
        <option key={name + value} value={value}>
          {name}
        </option>
      ))}
    </Select>
  </div>
)

interface ExpansionSelectProps {
  defaultValue?: string
  onChange?: (value: string) => void
}

export const ExpansionSelect: React.FC<ExpansionSelectProps> = ({
  defaultValue,
  onChange
}) => (
  <div className="w-full mt-2">
    <div className="flex flex-1 items-center gap-1 mt-0.5 relative">
      <Label htmlFor="expansion-select">Expansion</Label>
      <ToolTip data="Select the World of Warcraft expansion you're interested in" />
    </div>
    <Select
      id="expansion-select"
      name="expansion"
      defaultValue={defaultValue}
      onChange={(e) => onChange?.(e.target.value)}>
      {expansionOptions.map(({ label, value }) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </Select>
  </div>
)

const Select = (
  props: React.DetailedHTMLProps<
    React.SelectHTMLAttributes<HTMLSelectElement>,
    HTMLSelectElement
  >
) => (
  <select
    className="mt-1 flex-1 min-w-0 block w-full px-3 py-2 rounded-md focus:ring-blue-500 focus:border-blue-500 disabled:text-gray-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md dark:border-gray-400 dark:text-gray-100 dark:bg-gray-600"
    {...props}
  />
)
