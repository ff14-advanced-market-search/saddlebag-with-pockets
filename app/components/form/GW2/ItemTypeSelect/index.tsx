import Label from '~/components/form/Label'
import { itemTypes } from '~/utils/GW2Filters/itemTypes'

/**
 * Renders a dropdown selection input for GW2 item types.
 * @example
 * ItemTypeSelect({
 *   defaultValue: 0,
 *   onChange: (value) => console.log(value)
 * })
 * @param {number} defaultValue - The default selected item type value.
 * @param {(value: number) => void} onChange - Callback function when the dropdown value changes.
 * @returns {JSX.Element} Rendered dropdown component allowing users to select an item type.
 */
const ItemTypeSelect = ({
  defaultValue = -1,
  onChange
}: {
  defaultValue?: number
  onChange?: (value: number) => void
}) => (
  <div className="mt-2">
    <Label htmlFor="type">Type</Label>
    <select
      name="type"
      id="type"
      defaultValue={defaultValue}
      onChange={(event) => {
        if (onChange) {
          onChange(parseInt(event.target.value, 10))
        }
      }}
      className="flex-1 min-w-0 block w-full px-3 py-2 mt-1 focus:ring-blue-500 focus:border-blue-500 disabled:text-gray-500 shadow-sm sm:text-sm border-gray-300 rounded-md dark:border-gray-400 dark:text-gray-100 dark:bg-gray-600 dark:placeholder-gray-400">
      <option value={-1}>All Types</option>
      {itemTypes.map(({ name, value }) => (
        <option key={value} value={value}>
          {name}
        </option>
      ))}
    </select>
  </div>
)

export default ItemTypeSelect
