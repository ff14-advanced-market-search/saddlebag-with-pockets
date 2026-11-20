export type WoWForeverRegion = 'NA' | 'EU'
export type WoWForeverFaction = 'alliance' | 'horde'
export type WoWForeverRuleset = 'normal' | 'pvp' | 'rp' | 'rp_pvp'

export interface WoWForeverSettings {
  region: WoWForeverRegion
  faction: WoWForeverFaction
  ruleset: WoWForeverRuleset
}

export const DEFAULT_WOW_FOREVER_SETTINGS: WoWForeverSettings = {
  region: 'NA',
  faction: 'alliance',
  ruleset: 'normal'
}

/**
 * Auction house ids shared by NA Forever and EU Forever.
 * Neutral houses are listed here for display. They are not a home-faction choice.
 */
export const WOW_FOREVER_MARKETS: Array<{ id: number; label: string }> = [
  { id: 111, label: 'Normal Alliance' },
  { id: 114, label: 'Normal Horde' },
  { id: 117, label: 'Normal Neutral' },
  { id: 110, label: 'PvP Alliance' },
  { id: 113, label: 'PvP Horde' },
  { id: 116, label: 'PvP Neutral' },
  { id: 119, label: 'Roleplay Alliance' },
  { id: 120, label: 'Roleplay Horde' },
  { id: 121, label: 'Roleplay Neutral' },
  { id: 123, label: 'Roleplay PvP Alliance' },
  { id: 124, label: 'Roleplay PvP Horde' },
  { id: 125, label: 'Roleplay PvP Neutral' }
]

export const WOW_FOREVER_FACTIONS: Array<{
  value: WoWForeverFaction
  label: string
}> = [
  { value: 'alliance', label: 'Alliance' },
  { value: 'horde', label: 'Horde' }
]

export const WOW_FOREVER_RULESETS: Array<{
  value: WoWForeverRuleset
  label: string
}> = [
  { value: 'normal', label: 'Normal' },
  { value: 'pvp', label: 'PvP' },
  { value: 'rp', label: 'RP' },
  { value: 'rp_pvp', label: 'RP PvP' }
]

const regions = new Set<WoWForeverRegion>(['NA', 'EU'])
const factions = new Set<WoWForeverFaction>(['alliance', 'horde'])
const rulesets = new Set<WoWForeverRuleset>(['normal', 'pvp', 'rp', 'rp_pvp'])

export const validateWoWForeverSettings = (
  region: unknown,
  faction: unknown,
  ruleset: unknown
): WoWForeverSettings => {
  return {
    region: regions.has(region as WoWForeverRegion)
      ? (region as WoWForeverRegion)
      : DEFAULT_WOW_FOREVER_SETTINGS.region,
    faction: factions.has(faction as WoWForeverFaction)
      ? (faction as WoWForeverFaction)
      : DEFAULT_WOW_FOREVER_SETTINGS.faction,
    ruleset: rulesets.has(ruleset as WoWForeverRuleset)
      ? (ruleset as WoWForeverRuleset)
      : DEFAULT_WOW_FOREVER_SETTINGS.ruleset
  }
}

export const wowForeverRegionLabel = (region: WoWForeverRegion) =>
  region === 'NA' ? 'North America' : 'Europe'

export const wowForeverRegionShort = (region: WoWForeverRegion) =>
  region === 'NA' ? 'NA Forever' : 'EU Forever'

export const wowForeverFactionLabel = (faction: WoWForeverFaction) =>
  faction === 'alliance' ? 'Alliance' : 'Horde'

/**
 * Home-faction auction house for each Forever ruleset.
 * Neutral / Blackwater houses are not home choices.
 */
export const getHomeForeverAuctionHouseId = (
  faction: WoWForeverFaction,
  ruleset: WoWForeverRuleset
): number => {
  switch (ruleset) {
    case 'normal':
      return faction === 'alliance' ? 111 : 114
    case 'pvp':
      return faction === 'alliance' ? 110 : 113
    case 'rp':
      return faction === 'alliance' ? 119 : 120
    case 'rp_pvp':
      return faction === 'alliance' ? 123 : 124
  }
}

const enabledForeverAuctionHouseIds = new Set(
  WOW_FOREVER_MARKETS.map((entry) => entry.id)
)

export const isEnabledForeverAuctionHouseId = (auctionHouseId: number) =>
  enabledForeverAuctionHouseIds.has(auctionHouseId)

export const foreverAuctionHouseLabel = (auctionHouseId: number) => {
  const market = WOW_FOREVER_MARKETS.find(
    (entry) => entry.id === auctionHouseId
  )
  return market ? `${market.label} (${auctionHouseId})` : String(auctionHouseId)
}

export const foreverFeedLabel = (feedType: string) => {
  if (feedType === 'single') return 'Items'
  if (feedType === 'commodity') return 'Commodities'
  return feedType
}
