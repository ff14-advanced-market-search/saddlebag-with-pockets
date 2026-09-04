import type { LoaderFunction } from '@remix-run/cloudflare'
import { redirect } from '@remix-run/cloudflare'
import {
  commitDiscordSession,
  getDiscordSession
} from '~/sessions/discord.server'

const OAUTH_STATE = 'discord_oauth_state'

export const loader: LoaderFunction = async ({ request, context }) => {
  const url = new URL(request.url)
  const redirectUri = `${url.protocol}//${url.host}/discord-callback`

  // Discord OAuth configuration
  const clientId = context.DISCORD_CLIENT_ID
  const scope = 'identify'

  if (typeof clientId !== 'string' || !clientId) {
    throw new Error('DISCORD_CLIENT_ID environment variable is not set')
  }

  const session = await getDiscordSession(request, context)
  const state = crypto.randomUUID()
  session.set(OAUTH_STATE, state)

  const discordAuthUrl = new URL('https://discord.com/api/oauth2/authorize')
  discordAuthUrl.searchParams.set('client_id', clientId)
  discordAuthUrl.searchParams.set('redirect_uri', redirectUri)
  discordAuthUrl.searchParams.set('response_type', 'code')
  discordAuthUrl.searchParams.set('scope', scope)
  discordAuthUrl.searchParams.set('state', state)

  return redirect(discordAuthUrl.toString(), {
    headers: {
      'Set-Cookie': await commitDiscordSession(session, context)
    }
  })
}
