import { createCookieSessionStorage } from '@remix-run/cloudflare'
import { defaultMaxAge } from '~/requests/client/config'

export const { getSession, commitSession, destroySession } =
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
