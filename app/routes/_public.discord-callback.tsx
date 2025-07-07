import type { LoaderFunction } from '@remix-run/cloudflare'
import { redirect } from '@remix-run/cloudflare'
import { getSession, commitSession } from '~/sessions'

export const loader: LoaderFunction = async ({ request, context }) => {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  const error = url.searchParams.get('error')

  if (error) {
    return redirect('/options?error=discord_auth_failed')
  }

  if (!code) {
    return redirect('/options?error=no_auth_code')
  }

  const clientId = String(context.DISCORD_CLIENT_ID)
  const clientSecret = String(context.DISCORD_CLIENT_SECRET)
  const redirectUri = `${url.protocol}//${url.host}/discord-callback`

  if (!clientId || !clientSecret) {
    throw new Error('Discord OAuth environment variables are not set')
  }

  try {
    // Exchange code for access token
    const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirectUri
      })
    })

    if (!tokenResponse.ok) {
      throw new Error('Failed to exchange code for token')
    }

    const tokenData = await tokenResponse.json()
    const accessToken = tokenData.access_token

    // Get user data from Discord
    const userResponse = await fetch('https://discord.com/api/users/@me', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })

    console.log('[discord-callback] userResponse status:', userResponse.status)
    const userText = await userResponse.clone().text()
    console.log('[discord-callback] userResponse body:', userText)

    if (!userResponse.ok) {
      throw new Error('Failed to get user data from Discord')
    }

    const userData = await userResponse.json()
    console.log('[discord-callback] userData:', userData)

    // Store user data in session
    const session = await getSession(request.headers.get('Cookie'))
    session.set('discord_id', userData.id)
    session.set('discord_username', userData.username)
    session.set('discord_avatar', userData.avatar)

    return redirect('/options?success=discord_connected', {
      headers: {
        'Set-Cookie': await commitSession(session)
      }
    })
  } catch (error) {
    console.error('[discord-callback] Discord OAuth error:', error)
    return redirect('/options?error=discord_auth_failed')
  }
}
