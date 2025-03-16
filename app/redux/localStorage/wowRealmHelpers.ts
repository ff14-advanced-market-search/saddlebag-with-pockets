import { validateServerAndRegion } from '~/utils/WoWServers'
import z from 'zod'
import type { WoWServerData, WoWServerRegion } from '~/requests/WoW/types'

const WOW_REALM_KEY = 'wow_realm'
const WOW_REGION_KEY = 'wow_region'

const parseServer = z.object({
  id: z.union([z.string(), z.number()]),
  name: z.string()
})

const parseRegion = z.union([z.literal('NA'), z.literal('EU')])

/**
 * Retrieves and validates server and region information for a World of Warcraft realm from local storage.
 * @example
 * getWoWRealmDataFromLocalStorage()
 * { valid: true, server: { id: 3678, name: 'Thrall' }, region: 'us' }
 * @returns {Object} An object containing the validation result, server details, and region.
 * @description
 *   - If the data stored in local storage is unavailable or invalid, fallback values are used.
 *   - The function handles errors gracefully by providing a fallback region and server data.
 *   - The parsed data objects for server and region are individually validated.
 *   - Local storage is updated with fallback data when an error occurs.
 *   - Uses WOW_REALM_KEY and WOW_REGION_KEY constants to access localStorage data.
 */
export const getWoWRealmDataFromLocalStorage = () => {
  try {
    const localserver = JSON.parse(
      localStorage.getItem(WOW_REALM_KEY) || ` { "id": 3678, "name": 'Thrall' }`
    )

    const server = parseServer.parse(localserver)

    const region = parseRegion.parse(localStorage.getItem(WOW_REGION_KEY))

    const validData = validateServerAndRegion(region, server.id, server.name)

    return validData
  } catch {
    const fallback = validateServerAndRegion('NA', undefined, undefined)
    setWoWRealmDataInLocalStorage(fallback.server, fallback.region)
    return validateServerAndRegion('NA', undefined, undefined)
  }
}

/**
 * Stores WoW realm and region data in localStorage.
 * @example
 * setWoWRealmDataInLocalStorage(serverData, serverRegion)
 * { success: true }
 * @param {WoWServerData} realm - The WoW server data to be stored.
 * @param {WoWServerRegion} region - The WoW server region data to be stored.
 * @returns {Object|undefined} Returns an object indicating success, or undefined if data storage fails.
 * @description
 *   - Saves the realm data in localStorage under the key WOW_REALM_KEY.
 *   - Saves the region data in localStorage under the key WOW_REGION_KEY.
 *   - Catches any errors that occur during the localStorage operations.
 */
export const setWoWRealmDataInLocalStorage = (
  realm: WoWServerData,
  region: WoWServerRegion
) => {
  try {
    localStorage.setItem(WOW_REALM_KEY, JSON.stringify(realm))
    localStorage.setItem(WOW_REGION_KEY, region)

    return { success: true }
  } catch {
    return undefined
  }
}
