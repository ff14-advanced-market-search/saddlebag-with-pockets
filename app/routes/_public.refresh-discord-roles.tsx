import type { ActionFunction } from '@remix-run/cloudflare'
import { redirect, json } from '@remix-run/cloudflare'
import { getSession, commitSession } from '~/sessions'
import { GUILD_ID, fetchDiscordGuildMember } from '~/utils/premium'

export const action: ActionFunction = async ({ request, context }) => {
  const session = await getSession(request.headers.get('Cookie'))
  const discordId = session.get('discord_id')
  if (!discordId) {
    return redirect('/options?error=discord_roles_refresh_failed')
  }
  const botToken = context.DISCORD_BOT_TOKEN
  if (!botToken) {
    return redirect('/options?error=discord_roles_refresh_failed')
  }

  try {
    if (botToken && discordId) {
      const memberData = await fetchDiscordGuildMember(
        botToken as string,
        GUILD_ID,
        discordId
      )
      session.set('discord_roles', memberData.roles)
      // Set timestamp when roles were last refreshed
      session.set('discord_roles_refreshed_at', Date.now().toString())

      // Check if this is a POST request (API call)
      const contentType = request.headers.get('content-type')
      if (contentType?.includes('application/json')) {
        return json(
          { success: true },
          {
            headers: {
              'Set-Cookie': await commitSession(session)
            }
          }
        )
      }

      // Otherwise redirect (GET request)
      return redirect('/options?success=discord_roles_refreshed', {
        headers: {
          'Set-Cookie': await commitSession(session)
        }
      })
    }
    return redirect('/options?error=discord_roles_refresh_failed')
  } catch (e) {
    console.error('[refresh-discord-roles] Error refreshing Discord roles:', e)
    return redirect('/options?error=discord_roles_refresh_failed')
  }
}

export const loader = () => redirect('/options')
