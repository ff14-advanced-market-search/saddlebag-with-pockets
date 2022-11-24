import { createCookieSessionStorage } from '@remix-run/cloudflare'
import { validateWorldAndDataCenter } from '~/utils/locations'

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
      const worldSession = session.get('world')
      const sessionDataCenter = session.get('data_center')
      const { world } = validateWorldAndDataCenter(
        worldSession,
        sessionDataCenter
      )
      return world
    },
    getDataCenter: () => {
      const worldSession = session.get('world')
      const sessionDataCenter = session.get('data_center')
      const { data_center } = validateWorldAndDataCenter(
        worldSession,
        sessionDataCenter
      )
      return data_center
    }
  }
}

export { getUserSessionData, getSession, commitSession, destroySession }
