import type { AppLoadContext } from '@remix-run/cloudflare'
import { json } from '@remix-run/cloudflare'
import { getDiscordSession } from '~/sessions/discord.server'
import { getHasPremium, getHasElite, needsRolesRefresh } from '~/utils/premium'

/**
 * Reusable function to get Discord session data for loaders
 * Returns the standard loader data structure with isLoggedIn, hasPremium, hasElite, and needsRefresh
 */
export const getDiscordSessionData = async (
  request: Request,
  context: AppLoadContext
) => {
  const session = await getDiscordSession(request, context)
  const discordId = session?.get('discord_id') || null
  const discordRoles = session?.get('discord_roles') || []
  const rolesRefreshedAt = session?.get('discord_roles_refreshed_at') || null
  const isLoggedIn = Boolean(discordId)
  const hasPremium = getHasPremium(discordRoles)
  const hasElite = getHasElite(discordRoles)
  const needsRefresh = needsRolesRefresh(rolesRefreshedAt)

  return {
    isLoggedIn,
    hasPremium,
    hasElite,
    needsRefresh
  }
}

/**
 * Reusable loader function that returns Discord session data
 * Can be used directly in loaders or combined with other data
 */
export const createDiscordLoader = async (
  request: Request,
  context: AppLoadContext
) => {
  const sessionData = await getDiscordSessionData(request, context)
  return json(sessionData)
}

/**
 * Helper function to combine Discord session data with other loader data
 * Useful when you need both Discord session data and other route-specific data
 */
export const combineWithDiscordSession = async <T>(
  request: Request,
  additionalData: T,
  context: AppLoadContext
) => {
  const sessionData = await getDiscordSessionData(request, context)
  return json({
    ...sessionData,
    ...additionalData
  })
}

export const requireDiscordTier = async (
  request: Request,
  context: AppLoadContext,
  tier: 'premium' | 'elite' = 'premium'
) => {
  const sessionData = await getDiscordSessionData(request, context)
  const hasRequiredTier =
    sessionData.isLoggedIn &&
    (tier === 'elite' ? sessionData.hasElite : sessionData.hasPremium)

  if (!hasRequiredTier) {
    throw json(
      { error: `${tier === 'elite' ? 'Elite' : 'Premium'} access required` },
      { status: 403 }
    )
  }

  return sessionData
}
