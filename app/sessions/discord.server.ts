import type { AppLoadContext, Session } from '@remix-run/cloudflare'
import { createCookieSessionStorage } from '@remix-run/cloudflare'
import { defaultMaxAge } from '~/requests/client/config'

const DISCORD_SESSION_COOKIE = '__discord_session'

const getSessionSecret = (context: AppLoadContext): string => {
  const secret = context.SESSION_SECRET ?? context.DISCORD_CLIENT_SECRET

  if (typeof secret !== 'string' || !secret.trim()) {
    throw new Error(
      'SESSION_SECRET or DISCORD_CLIENT_SECRET must be configured to secure Discord sessions'
    )
  }

  return secret
}

const createDiscordSessionStorage = (context: AppLoadContext) =>
  createCookieSessionStorage({
    cookie: {
      name: DISCORD_SESSION_COOKIE,
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: defaultMaxAge,
      secrets: [getSessionSecret(context)]
    }
  })

export const getDiscordSession = (request: Request, context: AppLoadContext) =>
  createDiscordSessionStorage(context).getSession(request.headers.get('Cookie'))

export const commitDiscordSession = (
  session: Session,
  context: AppLoadContext
) => createDiscordSessionStorage(context).commitSession(session)

export const destroyDiscordSession = (
  session: Session,
  context: AppLoadContext
) => createDiscordSessionStorage(context).destroySession(session)
