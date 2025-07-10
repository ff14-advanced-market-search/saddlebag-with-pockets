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
