import { validateWorldAndDataCenter } from '~/utils/locations'

const FFXIV_WORLD_KEY = 'ffxiv_world'
const FFXIV_DATA_CENTER_KEY = 'ffxiv_data_center'

/**
 * Retrieves and validates Final Fantasy XIV world and data center information from local storage.
 * @example
 * getFFWorldDataFromLocalStorage()
 * { world: 'A sample world', data_center: 'A sample data center' }
 * @returns {Object} An object containing validated world and data center information.
 * @description
 *   - If the world or data center is not found in local storage, default values are set back to local storage.
 *   - Utilizes a try-catch block to ensure safe handling of storage retrieval and validation.
 */
export const getFFWorldDataFromLocalStorage = () => {
  try {
    const world = localStorage.getItem(FFXIV_WORLD_KEY)
    const dataCenter = localStorage.getItem(FFXIV_DATA_CENTER_KEY)

    const validData = validateWorldAndDataCenter(world, dataCenter)

    if (!world || !dataCenter) {
      setFFWorldDataInLocalStorage(validData.world, validData.data_center)
    }

    return validData
  } catch {
    return validateWorldAndDataCenter()
  }
}

/**
 * Stores FFXIV world and data center in localStorage.
 * @example
 * storeWorldAndDataCenter('Hyperion', 'Aether')
 * // Returns: { success: true }
 * @param {string} world - The name of the FFXIV world to store.
 * @param {string} dataCenter - The name of the FFXIV data center to store.
 * @returns {{ success: boolean } | undefined} Returns an object indicating success, or undefined if an error occurs.
 * @description
 *   - Uses localStorage to persist the FFXIV world and data center.
 *   - Catches exceptions that may occur during the localStorage operations.
 */
export const setFFWorldDataInLocalStorage = (
  world: string,
  dataCenter: string
) => {
  try {
    localStorage.setItem(FFXIV_WORLD_KEY, world)
    localStorage.setItem(FFXIV_DATA_CENTER_KEY, dataCenter)

    return { success: true }
  } catch {
    return undefined
  }
}
