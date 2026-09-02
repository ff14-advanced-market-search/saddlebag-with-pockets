import type { ActionFunction } from '@remix-run/cloudflare'
import { redirect } from '@remix-run/cloudflare'
import {
  destroyDiscordSession,
  getDiscordSession
} from '~/sessions/discord.server'

export const action: ActionFunction = async ({ request, context }) => {
  const session = await getDiscordSession(request, context)

  return redirect('/options?success=discord_disconnected', {
    headers: {
      'Set-Cookie': await destroyDiscordSession(session, context)
    }
  })
}
