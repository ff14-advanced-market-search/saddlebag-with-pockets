import { json } from '@remix-run/cloudflare'
import { getSession } from '~/sessions'
import { getHasPremium, needsRolesRefresh } from '~/utils/premium'

/**
 * Reusable function to get Discord session data for loaders
 * Returns the standard loader data structure with isLoggedIn, hasPremium, and needsRefresh
 */
export const getDiscordSessionData = async (request: Request) => {
  const session = await getSession(request.headers.get('Cookie'))
  const discordId = session?.get('discord_id') || null
  const discordRoles = session?.get('discord_roles') || []
  const rolesRefreshedAt = session?.get('discord_roles_refreshed_at') || null
  const isLoggedIn = Boolean(discordId)
  const hasPremium = getHasPremium(discordRoles)
  const needsRefresh = needsRolesRefresh(rolesRefreshedAt)

  return {
    isLoggedIn,
    hasPremium,
    needsRefresh
  }
}

/**
 * Reusable loader function that returns Discord session data
 * Can be used directly in loaders or combined with other data
 */
export const createDiscordLoader = async (request: Request) => {
  const sessionData = await getDiscordSessionData(request)
  return json(sessionData)
}

/**
 * Helper function to combine Discord session data with other loader data
 * Useful when you need both Discord session data and other route-specific data
 */
export const combineWithDiscordSession = async <T>(
  request: Request,
  additionalData: T
) => {
  const sessionData = await getDiscordSessionData(request)
  return json({
    ...sessionData,
    ...additionalData
  })
}
