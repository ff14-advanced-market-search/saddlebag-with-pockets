import type { Session } from '@remix-run/cloudflare'
import { createCookieSessionStorage } from '@remix-run/cloudflare'
import { validateWorldAndDataCenter } from '~/utils/locations'
import { validateServerAndRegion } from '~/utils/WoWServers'
import { defaultMaxAge } from '~/requests/client/config'
import type { WoWServerRegion } from '~/requests/WoW/types'

export const DATA_CENTER = 'data_center'
export const FF14_WORLD = 'world'
export const WOW_REGION = 'wowRegion'
export const WOW_REALM_ID = 'wowRealmId'
export const WOW_REALM_NAME = 'wowRealmName'

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
    sessionWoWRegion as WoWServerRegion,
    Number(sessionWoWRealm),
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
export const getUserSessionData = async (request: Request) => {
  const session = await getSession(request.headers.get('Cookie'))

  return {
    getWorld: () => getFF14WorldAndDataCenter(session).world,
    getDataCenter: () => getFF14WorldAndDataCenter(session).data_center,
    getWoWSessionData: () => getUserWoWSessionData(session),
    getFFXIVSessionData: () => ({
      world: {
        name: getFF14WorldAndDataCenter(session).world
      },
      region: getFF14WorldAndDataCenter(session).data_center
    }),
    getAllUserSessionData: () => ({
      ...getFF14WorldAndDataCenter(session),
      ...getUserWoWSessionData(session)
    })
  }
}

export { getSession, commitSession, destroySession }
