import React, { useState } from 'react'
import { ToolTip } from '~/components/Common/InfoToolTip'
import { InputWithLabel } from '../InputWithLabel'
import SmallFormContainer from '../SmallFormContainer'
import type { WoWServerRegion, WoWServerData } from '~/requests/WoW/types'
import Label from '../Label'
import WoWServerSelect from './WoWServerSelect'
import RegionAndServerSelect from './RegionAndServerSelect'
import { itemClasses } from '~/utils/WoWFilters/itemClasses'
import { itemQuality } from '~/utils/WoWFilters/itemQuality'
import { expansionOptions } from '~/utils/WoWFilters/expansions'
import { subclassRestrictions } from '~/utils/WoWFilters/commodityClasses'

interface Props {
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  loading: boolean
  error?: string
  clearErrors: () => void
  defaultRegion?: WoWServerRegion
  defaultServer?: WoWServerData
}

/**
 * Renders a form for searching World of Warcraft server-to-server trades.
 * @example
 * WoWScanForm({
 *   onClick: handleClick,
 *   loading: isLoading,
 *   error: fetchError,
 *   onChange: handleChange,
 *   clearErrors: clearFormErrors,
 *   defaultRegion: 'EU',
 *   defaultServer: { name: 'Outland', id: 1234 }
 * })
 * Returns a JSX element for the form.
 * @param {function} {onClick} - Function to handle form submission.
 * @param {boolean} {loading} - Indicates whether data is being loaded.
 * @param {string} {error} - Error message during data fetch.
 * @param {function} {onChange} - Function to handle input changes.
 * @param {function} {clearErrors} - Function to reset error logs.
 * @param {string} {defaultRegion} - Pre-selected region for server selection, defaults to 'NA'.
 * @param {object} {defaultServer} - Pre-selected server details, defaults to { name: 'Thrall', id: 3678 }.
 * @returns {JSX.Element} Returns a JSX element containing the form.
 * @description
 *   - Integrates various input fields specific to WoW trade servers, including TSM price, ROI, sales per day, etc.
 *   - Provides functionality to select item quality, item class, and server regions.
 *   - Handles loading state and error reporting gracefully.
 *   - Utilizes clearErrors function extensively to reset state during selection changes.
 */
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

interface ItemClassSelectProps {
  itemClass?: number
  itemSubClass?: number
  onChange?: (itemClassValue: number, itemSubClassValue: number) => void
  itemClassesOverride?: typeof itemClasses
}

/**
 * Renders a form for selecting item classes and subclasses with onchange handlers.
 * @example
 * ItemClassSelect({
 *   itemClass: 1,
 *   itemSubClass: 2,
 *   onChange: (itemClass, itemSubClass) => console.log(itemClass, itemSubClass)
 * })
 * <div>...</div>
 * @param {number} itemClass - The initial selected item class.
 * @param {number} itemSubClass - The initial selected item subclass.
 * @param {function} onChange - Callback function to handle changes in selection.
 * @returns {JSX.Element} JSX element representing the form.
 * @description
 *   - Resets itemSubClass when itemClass changes.
 *   - Calls onChange with updated values on selection change.
 *   - Provides default values for selections when notifying parent components.
 */
export const ItemClassSelect: React.FC<ItemClassSelectProps> = ({
  itemClass,
  itemSubClass,
  onChange,
  itemClassesOverride
}) => {
  const [selectedItemClass, setSelectedItemClass] = useState(itemClass)
  const [selectedItemSubClass, setSelectedItemSubClass] = useState(itemSubClass)

  const classesToUse = itemClassesOverride || itemClasses

  const selectedItemClassDef = classesToUse.find(
    (item) => item.value === selectedItemClass
  )
  const selectedItemClassName = selectedItemClassDef?.name

  let currentSubClassItems = selectedItemClassDef?.subClasses

  // Only apply subclass restrictions if itemClassesOverride is provided (i.e., we are in the commodity-only context)
  if (
    itemClassesOverride &&
    selectedItemClassName &&
    subclassRestrictions[selectedItemClassName]
  ) {
    const allowedSubclassNames = subclassRestrictions[selectedItemClassName]
    if (allowedSubclassNames && allowedSubclassNames.length > 0) {
      currentSubClassItems = currentSubClassItems?.filter((sub) =>
        allowedSubclassNames.includes(sub.name)
      )
    } else if (allowedSubclassNames) {
      currentSubClassItems = []
    }
  }

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
        {classesToUse.map(({ name, value }) => (
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
          onChange?.(selectedItemClass ?? -1, newItemSubClassValue)
        }}>
        <option value={-1}>All</option>
        {/* Use the potentially filtered currentSubClassItems here */}
        {currentSubClassItems?.map(({ name, value }) => (
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

/**
 * Renders a select input for choosing item quality in a form.
 * @example
 * ItemQualitySelect({ defaultValue: "common", onChange: handleQualityChange })
 * // Renders a div containing a label, tooltip, and select element.
 * @param {string} defaultValue - The default value for the select element, indicating the initially selected item quality.
 * @param {function} onChange - Callback function that is triggered when the selected item quality changes.
 * @returns {JSX.Element} JSX for the item quality selection component.
 * @description
 *   - Utilizes a custom Label component for labeling the select input.
 *   - Incorporates a ToolTip component to provide additional information on item quality selection.
 *   - The options within the select input are dynamically generated from an itemQuality array.
 */
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

/**
 * Renders a World of Warcraft expansion selection form component.
 * @example
 * ExpansionSelect({ defaultValue, onChange })
 * <div>...</div>
 * @param {string} defaultValue - The default selected value for the expansion dropdown.
 * @param {function} onChange - Callback function called when the selected value in the dropdown changes.
 * @returns {JSX.Element} A JSX element representing the WoW expansion selection form.
 * @description
 *   - The component includes a label and a tooltip explaining the dropdown's purpose.
 *   - The 'onChange' function is only invoked if it is provided.
 *   - Utilizes a predefined set of expansion options using `expansionOptions`.
 */
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
      name="expansionNumber"
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
