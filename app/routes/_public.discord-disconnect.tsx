import { redirect } from '@remix-run/cloudflare'
import { getSession, commitSession } from '~/sessions'

export const action: ActionFunction = async ({ request }) => {
  const session = await getSession(request.headers.get('Cookie'))

  // Clear Discord session data
  session.unset('discord_id')
  session.unset('discord_username')
  session.unset('discord_avatar')

  return redirect('/options?success=discord_disconnected', {
    headers: {
      'Set-Cookie': await commitSession(session)
    }
  })
}
