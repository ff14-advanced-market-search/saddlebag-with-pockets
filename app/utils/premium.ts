import { REST } from '@discordjs/rest'
import { Routes } from 'discord-api-types/v10'

// Centralized premium Discord constants and helpers
export const GUILD_ID = '973380473281724476'
export const DISCORD_SERVER_URL =
  'https://discord.com/servers/saddlebag-exchange-973380473281724476'

export const PREMIUM_ROLE_IDS: readonly string[] = [
  '982062454433546291', // TEAM_ROLE_ID
  '982028821186371624', // PATREON_ROLE_ID
  '1043787711741431888', // FANCY_ROLE_ID
  '1043787958412640296', // SUPER_ROLE_ID
  '1209734479581552731', // ELITE_ROLE_ID
  '1210537409884848159', // DISCORD_FANCY_ROLE_ID
  '1211135581619490956', // DISCORD_SUPER_ROLE_ID
  '1211140468205944852' // DISCORD_ELITE_ROLE_ID
] as const

/**
 * Determines whether any of the provided role IDs correspond to a premium role.
 *
 * @param roles - An array of role IDs to check, or `undefined`/`null`
 * @returns `true` if at least one role ID matches a premium role; otherwise, `false`
 */
export function getHasPremium(roles: string[] | undefined | null): boolean {
  if (!Array.isArray(roles)) return false
  return roles.some((roleId) => PREMIUM_ROLE_IDS.includes(roleId))
}

/**
 * Determines whether the user has the Elite role.
 * Checks for both ELITE_ROLE_ID and DISCORD_ELITE_ROLE_ID.
 *
 * @param roles - An array of role IDs to check, or `undefined`/`null`
 * @returns `true` if the user has an Elite role; otherwise, `false`
 */
export function getHasElite(roles: string[] | undefined | null): boolean {
  if (!Array.isArray(roles)) return false
  return (
    roles.includes('1209734479581552731') || // ELITE_ROLE_ID
    roles.includes('1211140468205944852') // DISCORD_ELITE_ROLE_ID
  )
}

// Session timeout configuration (8 days in milliseconds)
export const ROLES_REFRESH_TIMEOUT = 8 * 24 * 60 * 60 * 1000 // 10 * 1000

/**
 * Checks if Discord roles need to be refreshed based on the last refresh timestamp
 * @param refreshedAt - Timestamp when roles were last refreshed (string)
 * @returns true if roles need refreshing, false otherwise
 */
export function needsRolesRefresh(
  refreshedAt: string | undefined | null
): boolean {
  if (!refreshedAt) return true

  const lastRefresh = parseInt(refreshedAt, 10)
  const now = Date.now()
  const timeSinceRefresh = now - lastRefresh

  return timeSinceRefresh > ROLES_REFRESH_TIMEOUT
}

// Optional: role ID to name/icon map for future use
export const PREMIUM_ROLE_INFO: Record<string, { name: string; icon: string }> =
  Object.freeze({
    '982062454433546291': { name: 'Team', icon: '🛡️' },
    '982028821186371624': { name: 'Patreon', icon: '🧡' },
    '1043787711741431888': { name: 'Fancy', icon: '✨' },
    '1043787958412640296': { name: 'Super', icon: '👑' },
    '1209734479581552731': { name: 'Elite', icon: '💎' },
    '1210537409884848159': { name: 'Discord Fancy', icon: '🌟' },
    '1211135581619490956': { name: 'Discord Super', icon: '👑' },
    '1211140468205944852': { name: 'Discord Elite', icon: '💎' }
  })

/**
 * Refreshes Discord roles via API call without leaving the current page
 * @returns Promise<boolean> - true if refresh was successful, false otherwise
 */
export const refreshDiscordRoles = async (): Promise<boolean> => {
  try {
    const response = await fetch('/refresh-discord-roles', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (response.ok) {
      // Reload the page to get updated session data
      console.log('Reloading page to get updated session data')
      await new Promise((resolve) => setTimeout(resolve, 3000))
      window.location.reload()
      return true
    }

    return false
  } catch (error) {
    console.error('Failed to refresh Discord roles:', error)
    return false
  }
}

/**
 * Fetch Discord user data using an access token
 * @param accessToken The Discord OAuth access token
 * @returns Promise<UserData> Discord user data
 */
export const fetchDiscordUserData = async (
  accessToken: string
): Promise<{
  id: string
  username: string
  avatar: string | null
}> => {
  const response = await fetch('https://discord.com/api/users/@me', {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch Discord user data: ${response.status}`)
  }

  return response.json()
}

/**
 * Exchange OAuth code for access token
 * @param code The OAuth authorization code
 * @param clientId Discord client ID
 * @param clientSecret Discord client secret
 * @param redirectUri The redirect URI used in the OAuth flow
 * @returns Promise<{access_token: string}> Token response
 */
export const exchangeCodeForToken = async (
  code: string,
  clientId: string,
  clientSecret: string,
  redirectUri: string
): Promise<{ access_token: string }> => {
  const response = await fetch('https://discord.com/api/oauth2/token', {
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

  if (!response.ok) {
    throw new Error(`Failed to exchange code for token: ${response.status}`)
  }

  return response.json()
}

/**
 * Fetch Discord guild member data using bot token
 * @param botToken Discord bot token
 * @param guildId Discord guild/server ID
 * @param userId Discord user ID
 * @returns Promise<{roles: string[]}> Guild member data
 */
export const fetchDiscordGuildMember = async (
  botToken: string,
  guildId: string,
  userId: string
): Promise<{ roles: string[] }> => {
  // Using discordjs/rest to fetch guild member data
  // can be replaced with raw api call if needed
  const rest = new REST({ version: '10' }).setToken(botToken)
  const member = (await rest.get(Routes.guildMember(guildId, userId))) as any
  return {
    roles: Array.isArray(member.roles) ? member.roles : []
  }
}
