import type { LoaderFunction } from '@remix-run/cloudflare'
import { redirect } from '@remix-run/cloudflare'

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url)
  const redirectUri = `${url.protocol}//${url.host}/discord-callback`

  // Discord OAuth configuration
  const clientId = process.env.DISCORD_CLIENT_ID
  const scope = 'identify'

  if (!clientId) {
    throw new Error('DISCORD_CLIENT_ID environment variable is not set')
  }

  const discordAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&response_type=code&scope=${scope}`

  return redirect(discordAuthUrl)
}
