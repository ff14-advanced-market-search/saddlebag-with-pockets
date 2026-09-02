import { describe, it, expect } from 'vitest'
import { loader as discordLoginLoader } from '~/routes/_public.discord-login'
import { loader as discordCallbackLoader } from '~/routes/_public.discord-callback'
import { action as discordDisconnectAction } from '~/routes/_public.discord-disconnect'

const context = {
  DISCORD_CLIENT_ID: 'test-client-id',
  DISCORD_CLIENT_SECRET: 'test-client-secret'
}

const startDiscordLogin = async () => {
  const response = (await discordLoginLoader({
    request: new Request('http://localhost:8788/discord-login'),
    params: {},
    context
  })) as Response
  const location = response.headers.get('Location')
  const setCookie = response.headers.get('Set-Cookie')

  if (!location || !setCookie) {
    throw new Error('Discord login did not create an OAuth session')
  }

  return {
    response,
    state: new URL(location).searchParams.get('state'),
    cookie: setCookie.split(';')[0]
  }
}

describe('Discord OAuth Routes', () => {
  describe('discord-login', () => {
    it('should redirect to Discord OAuth URL', async () => {
      const { response, state } = await startDiscordLogin()

      expect(response.status).toBe(302)
      expect(response.headers.get('Location')).toContain(
        'discord.com/api/oauth2/authorize'
      )
      expect(response.headers.get('Location')).toContain(
        'client_id=test-client-id'
      )
      expect(state).toBeTruthy()
      expect(response.headers.get('Set-Cookie')).toContain('__discord_session=')
    })
  })

  describe('discord-callback', () => {
    it('should handle missing authorization code', async () => {
      const { state, cookie } = await startDiscordLogin()
      const request = new Request(
        `http://localhost:8788/discord-callback?state=${state}`,
        { headers: { Cookie: cookie } }
      )

      const response = (await discordCallbackLoader({
        request,
        params: {},
        context
      })) as Response

      expect(response.status).toBe(302)
      expect(response.headers.get('Location')).toContain(
        '/options?error=no_auth_code'
      )
    })

    it('should handle OAuth error', async () => {
      const { state, cookie } = await startDiscordLogin()
      const request = new Request(
        `http://localhost:8788/discord-callback?error=access_denied&state=${state}`,
        { headers: { Cookie: cookie } }
      )

      const response = (await discordCallbackLoader({
        request,
        params: {},
        context
      })) as Response

      expect(response.status).toBe(302)
      expect(response.headers.get('Location')).toContain(
        '/options?error=discord_auth_failed'
      )
    })

    it('should reject callbacks without the matching OAuth state', async () => {
      const { cookie } = await startDiscordLogin()
      const response = (await discordCallbackLoader({
        request: new Request(
          'http://localhost:8788/discord-callback?code=attacker-code&state=invalid',
          { headers: { Cookie: cookie } }
        ),
        params: {},
        context
      })) as Response

      expect(response.status).toBe(302)
      expect(response.headers.get('Location')).toContain(
        '/options?error=discord_auth_failed'
      )
    })
  })

  describe('discord-disconnect', () => {
    it('should clear Discord session data', async () => {
      const request = new Request('http://localhost:8788/discord-disconnect', {
        method: 'POST'
      })

      const response = (await discordDisconnectAction({
        request,
        params: {},
        context
      })) as Response

      expect(response.status).toBe(302)
      expect(response.headers.get('Location')).toContain(
        '/options?success=discord_disconnected'
      )
      expect(response.headers.get('Set-Cookie')).toBeDefined()
    })
  })
})
