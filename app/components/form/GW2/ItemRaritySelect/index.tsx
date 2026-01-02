import Label from '~/components/form/Label'
import { itemRarities } from '~/utils/GW2Filters/itemRarity'

/**
 * Renders a dropdown selection input for GW2 item rarities.
 * @example
 * ItemRaritySelect({
 *   defaultValue: 4,
 *   onChange: (value) => console.log(value)
 * })
 * @param {number} defaultValue - The default selected rarity value.
 * @param {(value: number) => void} onChange - Callback function when the dropdown value changes.
 * @returns {JSX.Element} Rendered dropdown component allowing users to select an item rarity.
 */
const ItemRaritySelect = ({
  defaultValue = -1,
  onChange
}: {
  defaultValue?: number
  onChange?: (value: number) => void
}) => (
  <div className="mt-2">
    <Label htmlFor="rarity">Rarity</Label>
    <select
      name="rarity"
      id="rarity"
      defaultValue={defaultValue}
      onChange={(event) => {
        if (onChange) {
          onChange(parseInt(event.target.value, 10))
        }
      }}
      className="flex-1 min-w-0 block w-full px-3 py-2 mt-1 focus:ring-blue-500 focus:border-blue-500 disabled:text-gray-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md dark:border-gray-400 dark:text-gray-100 dark:bg-gray-600 dark:placeholder-gray-400">
      <option value={-1}>All Rarities</option>
      {itemRarities.map(({ name, value }) => (
        <option key={value} value={value}>
          {name}
        </option>
      ))}
    </select>
  </div>
)

export default ItemRaritySelect
