import type { FC } from 'react'
import type { GetDeepProp } from '~/utils/ts'
import type { WorldsList } from '~/utils/locations/Worlds'

type SelectWorldProps = {
  onSelect: (world: string) => void
  dataCenter: string | undefined
  world: string | undefined
  worlds: GetDeepProp<WorldsList, 'name'> | undefined
}
/**
 * Renders a dropdown selection for choosing a world or server based on data center status.
 * @example
 * SelectWorld({
 *   onSelect: handleWorldSelect,
 *   world: 'ExampleWorld',
 *   dataCenter: true,
 *   worlds: worldList
 * })
 * // Renders a <select> element for world selection.
 * @param {function} onSelect - Callback function to handle the selection of a world.
 * @param {string} world - Current selected world or server name.
 * @param {boolean} dataCenter - Boolean representing if the data center is selected.
 * @param {Array} worlds - List of available worlds or servers.
 * @returns {JSX.Element} A fully rendered <select> element for selecting a world.
 * @description
 *   - The dropdown disables options and displays default messages if no world or data center is selected.
 *   - Ensures the dropdown is appropriately themed with focus and border styles for both light and dark modes.
 *   - Relies on external function `onSelect` for handling changes to the selected world.
 */
export const SelectWorld: FC<SelectWorldProps> = ({
  onSelect,
  world,
  dataCenter,
  worlds
}) => {
  const worldDefaultValue = () => {
    if (dataCenter) {
      return world ? world : 'Select your World/Server'
    }
    return `Please select a Data Center`
  }
  return (
    <select
      key={'world_select'}
      name="world"
      autoComplete="world"
      className="focus:ring-blue-500 focus:border-blue-500 relative block w-full rounded-sm bg-transparent focus:z-10 sm:text-sm border-gray-300 dark:border-gray-400 dark:bg-gray-600 dark:text-gray-100"
      // defaultValue={worldDefaultValue()}
      value={worldDefaultValue()}
      onChange={(event) => {
        onSelect(event.target.value)
      }}>
      {!world && (
        <option disabled hidden>
          {worldDefaultValue()}
        </option>
      )}
      {worlds &&
        worlds.map((value) => {
          return (
            <option key={value.name} value={value.name}>
              {value.name}
            </option>
          )
        })}
    </select>
  )
}
