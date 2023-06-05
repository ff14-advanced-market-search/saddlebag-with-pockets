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
