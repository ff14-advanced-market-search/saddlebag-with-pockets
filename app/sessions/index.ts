import type { Session } from '@remix-run/cloudflare'
import { createCookieSessionStorage } from '@remix-run/cloudflare'
import { validateWorldAndDataCenter } from '~/utils/locations'
import { validateServerAndRegion } from '~/utils/WoWServers'

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
      path: '/'
    }
  })

const getFF14WorldAndDataCenter = (session: Session) => {
  const worldSession = session.get(FF14_WORLD)
  const sessionDataCenter = session.get(DATA_CENTER)
  return validateWorldAndDataCenter(worldSession, sessionDataCenter)
}

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

async function getUserSessionData(request: Request) {
  const session = await getSession(request.headers.get('Cookie'))
  return {
    getWorld: () => getFF14WorldAndDataCenter(session).world,
    getDataCenter: () => getFF14WorldAndDataCenter(session).data_center,
    getWoWSessionData: () => getUserWoWSessionData(session),
    getAllUserSessionData: () => ({
      ...getFF14WorldAndDataCenter(session),
      ...getUserWoWSessionData(session)
    })
  }
}

export { getUserSessionData, getSession, commitSession, destroySession }
