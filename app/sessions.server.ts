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
export const DISCORD_ID = 'discord_id'
export const DISCORD_USERNAME = 'discord_username'
export const DISCORD_AVATAR = 'discord_avatar'
export const EARLY_ACCESS_TOKEN = 'early_access_token'

// Use a default dev secret - production should set SESSION_SECRET env var
const sessionSecret = 'dev-secret'

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage({
    cookie: {
      name: '__session',
      secrets: [sessionSecret],
      secure: false,
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
