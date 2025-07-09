import type { ActionFunction } from '@remix-run/cloudflare'
import { redirect } from '@remix-run/cloudflare'
import { getSession, commitSession } from '~/sessions'
import { GUILD_ID } from '~/utils/premium'

export const action: ActionFunction = async ({ request, context }) => {
  const session = await getSession(request.headers.get('Cookie'))
  const discordId = session.get('discord_id')
  if (!discordId) {
    return redirect('/options?error=discord_roles_refresh_failed')
  }
  const botToken = context.DISCORD_BOT_TOKEN
  let discordRoles = []
  try {
    if (botToken && discordId) {
      const memberResp = await fetch(
        `https://discord.com/api/v10/guilds/${GUILD_ID}/members/${discordId}`,
        {
          headers: { Authorization: `Bot ${botToken}` }
        }
      )
      if (memberResp.ok) {
        const memberData = await memberResp.json()
        discordRoles = Array.isArray(memberData.roles) ? memberData.roles : []
        session.set('discord_roles', discordRoles)
        return redirect('/options?success=discord_roles_refreshed', {
          headers: {
            'Set-Cookie': await commitSession(session)
          }
        })
      }
    }
    return redirect('/options?error=discord_roles_refresh_failed')
  } catch (e) {
    return redirect('/options?error=discord_roles_refresh_failed')
  }
}

export const loader = () => redirect('/options')
