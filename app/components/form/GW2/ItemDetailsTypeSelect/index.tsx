import Label from '~/components/form/Label'
import { itemTypes } from '~/utils/GW2Filters/itemTypes'

/**
 * Renders a dropdown selection input for GW2 item details types (subclasses).
 * @example
 * ItemDetailsTypeSelect({
 *   itemType: 0,
 *   defaultValue: 100,
 *   onChange: (value) => console.log(value)
 * })
 * @param {number} itemType - The selected item type. If -1, shows "All Details Types".
 * @param {number} defaultValue - The default selected details type value.
 * @param {(value: number) => void} onChange - Callback function when the dropdown value changes.
 * @returns {JSX.Element} Rendered dropdown component allowing users to select a details type.
 */
const ItemDetailsTypeSelect = ({
  itemType = -1,
  defaultValue = -1,
  onChange
}: {
  itemType?: number
  defaultValue?: number
  onChange?: (value: number) => void
}) => {
  const selectedType = itemTypes.find((type) => type.value === itemType)
  const subClasses = selectedType?.subClasses || []

  return (
    <div className="mt-2">
      <Label htmlFor="details_type">Details Type</Label>
      <select
        name="details_type"
        id="details_type"
        defaultValue={defaultValue}
        onChange={(event) => {
          if (onChange) {
            onChange(parseInt(event.target.value, 10))
          }
        }}
        className="flex-1 min-w-0 block w-full px-3 py-2 mt-1 focus:ring-blue-500 focus:border-blue-500 disabled:text-gray-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md dark:border-gray-400 dark:text-gray-100 dark:bg-gray-600 dark:placeholder-gray-400">
        <option value={-1}>All Details Types</option>
        {subClasses.map(({ name, value }) => (
          <option key={value} value={value}>
            {name}
          </option>
        ))}
      </select>
    </div>
  )
}

export default ItemDetailsTypeSelect
