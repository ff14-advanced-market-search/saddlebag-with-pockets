import { createCookieSessionStorage } from '@remix-run/cloudflare'
import { validateWorldAndDataCenter } from '~/utils/locations'

export const DATA_CENTER = 'data_center'
export const FF14_WORLD = 'world'
export const WOW_REGION = 'wow_region'
export const WOW_REALM = 'wow_realm'

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

async function getUserSessionData(request: Request) {
  const session = await getSession(request.headers.get('Cookie'))
  return {
    getWorld: () => {
      const worldSession = session.get(FF14_WORLD)
      const sessionDataCenter = session.get(DATA_CENTER)
      const { world } = validateWorldAndDataCenter(
        worldSession,
        sessionDataCenter
      )
      return world
    },
    getDataCenter: () => {
      const worldSession = session.get(FF14_WORLD)
      const sessionDataCenter = session.get(DATA_CENTER)
      const { data_center } = validateWorldAndDataCenter(
        worldSession,
        sessionDataCenter
      )
      return data_center
    },
    getWoWRegion: () => {
      const regionSession = session.get(WOW_REGION)
      return regionSession
    },
    getWoWHomeRealm: () => {
      const realmSession = session.get(WOW_REALM)
      return realmSession
    }
  }
}

export { getUserSessionData, getSession, commitSession, destroySession }
