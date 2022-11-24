import { createCookieSessionStorage } from '@remix-run/cloudflare'
import { WorldsArray } from '~/utils/locations/Worlds'
import { DataCenterArray } from '~/utils/locations/DataCenters'

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

const validateWorldAndDataCenter = (
  world?: string | null,
  data_center?: string | null
) => {
  if (world && WorldsArray.includes(world)) {
    if (data_center && DataCenterArray.includes(data_center)) {
      return { world, data_center }
    }
  }

  return { world: WorldsArray.at(0), data_center: DataCenterArray.at(0) }
}

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

export {
  getUserSessionData,
  getSession,
  commitSession,
  destroySession,
  validateWorldAndDataCenter
}
