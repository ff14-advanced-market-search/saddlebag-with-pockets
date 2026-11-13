export type WoWForeverRegion = 'NA' | 'EU'
export type WoWForeverFaction = 'alliance' | 'horde'

export interface WoWForeverSettings {
  region: WoWForeverRegion
  faction: WoWForeverFaction
}

export const DEFAULT_WOW_FOREVER_SETTINGS: WoWForeverSettings = {
  region: 'NA',
  faction: 'alliance'
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

const regions = new Set<WoWForeverRegion>(['NA', 'EU'])
const factions = new Set<WoWForeverFaction>(['alliance', 'horde'])

export const validateWoWForeverSettings = (
  region: unknown,
  faction: unknown
): WoWForeverSettings => {
  return {
    region: regions.has(region as WoWForeverRegion)
      ? (region as WoWForeverRegion)
      : DEFAULT_WOW_FOREVER_SETTINGS.region,
    faction: factions.has(faction as WoWForeverFaction)
      ? (faction as WoWForeverFaction)
      : DEFAULT_WOW_FOREVER_SETTINGS.faction
  }
}

export const wowForeverRegionLabel = (region: WoWForeverRegion) =>
  region === 'NA' ? 'North America' : 'Europe'

export const wowForeverRegionShort = (region: WoWForeverRegion) =>
  region === 'NA' ? 'NA Forever' : 'EU Forever'

export const wowForeverFactionLabel = (faction: WoWForeverFaction) =>
  faction === 'alliance' ? 'Alliance' : 'Horde'

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
