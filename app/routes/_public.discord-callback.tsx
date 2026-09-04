import type { LoaderFunction } from '@remix-run/cloudflare'
import { redirect } from '@remix-run/cloudflare'
import {
  commitDiscordSession,
  getDiscordSession
} from '~/sessions/discord.server'
import {
  GUILD_ID,
  exchangeCodeForToken,
  fetchDiscordUserData,
  fetchDiscordGuildMember
} from '~/utils/premium'

const OAUTH_STATE = 'discord_oauth_state'

export const loader: LoaderFunction = async ({ request, context }) => {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  const error = url.searchParams.get('error')
  const state = url.searchParams.get('state')
  const session = await getDiscordSession(request, context)
  const expectedState = session.get(OAUTH_STATE)

  session.unset(OAUTH_STATE)

  if (!state || typeof expectedState !== 'string' || state !== expectedState) {
    return redirect('/options?error=discord_auth_failed', {
      headers: {
        'Set-Cookie': await commitDiscordSession(session, context)
      }
    })
  }

  if (error) {
    console.error('[discord-callback] Discord OAuth error:', error)
    return redirect('/options?error=discord_auth_failed', {
      headers: {
        'Set-Cookie': await commitDiscordSession(session, context)
      }
    })
  }

  if (!code) {
    return redirect('/options?error=no_auth_code', {
      headers: {
        'Set-Cookie': await commitDiscordSession(session, context)
      }
    })
  }

  const clientId = context.DISCORD_CLIENT_ID
  const clientSecret = context.DISCORD_CLIENT_SECRET
  const redirectUri = `${url.protocol}//${url.host}/discord-callback`

  if (
    typeof clientId !== 'string' ||
    !clientId ||
    typeof clientSecret !== 'string' ||
    !clientSecret
  ) {
    throw new Error('Discord OAuth environment variables are not set')
  }

  try {
    // Exchange code for access token using utility function
    const tokenData = await exchangeCodeForToken(
      code,
      clientId,
      clientSecret,
      redirectUri
    )
    const accessToken = tokenData.access_token

    // Get user data from Discord using utility function
    const userData = await fetchDiscordUserData(accessToken)

    // Store user data in session
    session.set('discord_id', userData.id)
    session.set('discord_username', userData.username)
    session.set('discord_avatar', userData.avatar)

    // Fetch user roles from the guild using the bot token
    const botToken = context.DISCORD_BOT_TOKEN
    let discordRoles: string[] = []
    if (botToken && userData.id) {
      try {
        const memberData = await fetchDiscordGuildMember(
          botToken as string,
          GUILD_ID,
          userData.id
        )
        discordRoles = memberData.roles
      } catch (error) {
        console.error('Failed to fetch Discord member data:', error)
        // Continue without roles if the fetch fails
      }
    }
    session.set('discord_roles', discordRoles)
    // Set timestamp when roles were last refreshed
    session.set('discord_roles_refreshed_at', Date.now().toString())

    return redirect('/options?success=discord_connected', {
      headers: {
        'Set-Cookie': await commitDiscordSession(session, context)
      }
    })
  } catch (error) {
    console.error('[discord-callback] Discord OAuth error:', error)
    return redirect('/options?error=discord_auth_failed', {
      headers: {
        'Set-Cookie': await commitDiscordSession(session, context)
      }
    })
  }
}
