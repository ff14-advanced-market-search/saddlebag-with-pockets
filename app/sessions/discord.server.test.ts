import { describe, expect, it } from 'vitest'
import { commitDiscordSession, getDiscordSession } from './discord.server'
import { requireDiscordTier } from '~/components/Common/DiscordSessionLoader.server'
import { PREMIUM_ROLE_IDS } from '~/utils/premium'

const context = { SESSION_SECRET: 'a-test-session-secret-with-enough-entropy' }

const createPremiumCookie = async () => {
  const session = await getDiscordSession(
    new Request('https://saddlebagexchange.com'),
    context
  )
  session.set('discord_id', '123')
  session.set('discord_roles', [PREMIUM_ROLE_IDS[0]])
  return commitDiscordSession(session, context)
}

describe('Discord session security', () => {
  it('accepts an untampered signed premium session', async () => {
    const cookie = await createPremiumCookie()
    const request = new Request('https://saddlebagexchange.com', {
      headers: { Cookie: cookie }
    })

    await expect(requireDiscordTier(request, context)).resolves.toMatchObject({
      isLoggedIn: true,
      hasPremium: true
    })
  })

  it('rejects a tampered Discord session', async () => {
    const cookie = await createPremiumCookie()
    const [cookiePair] = cookie.split(';')
    const [name, value] = cookiePair.split('=')
    const replacement = value.endsWith('a') ? 'b' : 'a'
    const tamperedCookie = `${name}=${value.slice(0, -1)}${replacement}`
    const request = new Request('https://saddlebagexchange.com', {
      headers: { Cookie: tamperedCookie }
    })

    await expect(requireDiscordTier(request, context)).rejects.toMatchObject({
      status: 403
    })
  })

  it('rejects an unsigned forged premium session', async () => {
    const forgedValue = btoa(
      JSON.stringify({
        discord_id: '123',
        discord_roles: [PREMIUM_ROLE_IDS[0]]
      })
    )
    const request = new Request('https://saddlebagexchange.com', {
      headers: { Cookie: `__discord_session=${forgedValue}` }
    })

    await expect(requireDiscordTier(request, context)).rejects.toMatchObject({
      status: 403
    })
  })
})
