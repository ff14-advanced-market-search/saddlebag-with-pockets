export type WoWServerRegion = 'NA' | 'EU'

export interface WoWServerData {
  name: string
  id: number
}
export interface WoWLoaderData {
  wowRealm: WoWServerData
  wowRegion: WoWServerRegion
}

export type WoWMarketState =
  | 'spiking'
  | 'increasing'
  | 'stable'
  | 'decreasing'
  | 'crashing'
