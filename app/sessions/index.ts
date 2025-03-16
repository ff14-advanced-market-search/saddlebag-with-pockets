import type { Session } from '@remix-run/cloudflare'
import { createCookieSessionStorage } from '@remix-run/cloudflare'
import { validateWorldAndDataCenter } from '~/utils/locations'
import { validateServerAndRegion } from '~/utils/WoWServers'
import { defaultMaxAge } from '~/requests/client/config'
import type { WoWServerRegion } from '~/requests/WoW/types'

export const DATA_CENTER = 'data_center'
export const FF14_WORLD = 'world'
export const WOW_REGION = 'wow_region'
export const WOW_REALM_ID = 'wow_realm_id'
export const WOW_REALM_NAME = 'wow_realm_name'

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage({
    cookie: {
      name: '__session',
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: defaultMaxAge
    }
  })

const getFF14WorldAndDataCenter = (session: Session) => {
  const worldSession = session.get(FF14_WORLD)
  const sessionDataCenter = session.get(DATA_CENTER)
  return validateWorldAndDataCenter(worldSession, sessionDataCenter)
}

/**
* Retrieves World of Warcraft session details and validates server and region.
* @example
* getSessionDetails(session)
* true
* @param {Session} session - Current session object containing WoW details.
* @returns {boolean} Whether the server and region are valid.
* @description
*   - Defaults WoW realm ID to 'NA' if not present in the session.
*   - WoW region will be 'undefined' if not available in the session.
*   - WoW realm name will be 'undefined' if not available in the session.
*   - Validates server and region integration using external function.
*/
const getUserWoWSessionData = (session: Session) => {
  const sessionWoWRealm = session.has(WOW_REALM_ID)
    ? session.get(WOW_REALM_ID)
    : 'NA'

  const sessionWoWRegion = session.has(WOW_REGION)
    ? session.get(WOW_REGION)
    : undefined

  const sessionWoWRealmName = session.has(WOW_REALM_NAME)
    ? session.get(WOW_REALM_NAME)
    : undefined

  return validateServerAndRegion(
    sessionWoWRegion,
    sessionWoWRealm,
    sessionWoWRealmName
  )
}

/**
* Retrieves game-related session data for a user based on request cookies.
* @example
* getUserSessionData(request)
* { getWorld: [Function], getDataCenter: [Function], getWoWSessionData: [Function], getAllUserSessionData: [Function] }
* @param {Request} request - The request object containing session and cookie information.
* @returns {Object} An object containing methods to access various session data.
* @description
*   - Utilizes cookies to find specific game session information for FF14 and WoW.
*   - Provides methods to access world and data center information for FF14.
*   - Validates, retrieves, and constructs WoW session information including server region.
*   - Combines both FF14 and WoW data into a single comprehensive session data object.
*/
async function getUserSessionData(request: Request) {
  const session = await getSession(request.headers.get('Cookie'))
  const cookieHeader = request.headers.get('Cookie') || ''

  const getCookieValue = (name: string) => {
    const match = cookieHeader.match(new RegExp(`(^| )${name}=([^;]+)`))
    return match ? decodeURIComponent(match[2]) : undefined
  }

  const getFF14Data = () => {
    const worldCookie = getCookieValue(FF14_WORLD)
    const dataCenterCookie = getCookieValue(DATA_CENTER)

    if (worldCookie && dataCenterCookie) {
      return validateWorldAndDataCenter(worldCookie, dataCenterCookie)
    }

    return getFF14WorldAndDataCenter(session)
  }

  /**
  * Retrieves server and region data from cookies or session information.
  * @example
  * functionName()
  * some sample return value
  * @param {object} session - Session object containing user session data.
  * @returns {object|null} Validated server and region data or user WoW session data.
  * @description
  *   - Uses predefined constants WOW_REGION, WOW_REALM_ID, WOW_REALM_NAME to get cookie values.
  *   - Calls validateServerAndRegion if all necessary cookies are present.
  *   - Falls back to getUserWoWSessionData if cookies are not set.
  *   - Assumes WoWServerRegion type for region validation.
  */
  const getWoWData = () => {
    const regionCookie = getCookieValue(WOW_REGION)
    const realmIdCookie = getCookieValue(WOW_REALM_ID)
    const realmNameCookie = getCookieValue(WOW_REALM_NAME)

    if (regionCookie && realmIdCookie && realmNameCookie) {
      return validateServerAndRegion(
        regionCookie as WoWServerRegion,
        Number(realmIdCookie),
        realmNameCookie
      )
    }

    return getUserWoWSessionData(session)
  }

  return {
    getWorld: () => getFF14Data().world,
    getDataCenter: () => getFF14Data().data_center,
    getWoWSessionData: () => getWoWData(),
    getAllUserSessionData: () => ({
      ...getFF14Data(),
      ...getWoWData()
    })
  }
}

export { getUserSessionData, getSession, commitSession, destroySession }
