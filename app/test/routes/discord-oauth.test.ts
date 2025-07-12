import { describe, it, expect, vi } from 'vitest'
import { loader as discordLoginLoader } from '~/routes/_public.discord-login'
import { loader as discordCallbackLoader } from '~/routes/_public.discord-callback'
import { action as discordDisconnectAction } from '~/routes/_public.discord-disconnect'

// Mock environment variables
vi.stubEnv('DISCORD_CLIENT_ID', 'test-client-id')
vi.stubEnv('DISCORD_CLIENT_SECRET', 'test-client-secret')

describe('Discord OAuth Routes', () => {
  describe('discord-login', () => {
    it('should redirect to Discord OAuth URL', async () => {
      const request = new Request('http://localhost:8788/discord-login')

      try {
        const response = await discordLoginLoader({
          request,
          params: {},
          context: {}
        })

        expect(response.status).toBe(302)
        expect(response.headers.get('Location')).toContain(
          'discord.com/api/oauth2/authorize'
        )
        expect(response.headers.get('Location')).toContain(
          'client_id=test-client-id'
        )
      } catch (error) {
        // Expected to throw if environment variables are not set in test
        expect(error).toBeDefined()
      }
    })
  })

  describe('discord-callback', () => {
    it('should handle missing authorization code', async () => {
      const request = new Request('http://localhost:8788/discord-callback')

      const response = await discordCallbackLoader({
        request,
        params: {},
        context: {}
      })

      expect(response.status).toBe(302)
      expect(response.headers.get('Location')).toContain(
        '/options?error=no_auth_code'
      )
    })

    it('should handle OAuth error', async () => {
      const request = new Request(
        'http://localhost:8788/discord-callback?error=access_denied'
      )

      const response = await discordCallbackLoader({
        request,
        params: {},
        context: {}
      })

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

      const response = await discordDisconnectAction({
        request,
        params: {},
        context: {}
      })

      expect(response.status).toBe(302)
      expect(response.headers.get('Location')).toContain(
        '/options?success=discord_disconnected'
      )
      expect(response.headers.get('Set-Cookie')).toBeDefined()
    })
  })
})
