import { address, UserAgent } from '~/requests/client/config'
import type { WoWServerRegion } from '../WOWScan'
import type { WoWMarketState } from './types'

export interface PetMarketshareResponse {
  data: Array<PetMarketshareItem>
}

export interface PetMarketshareItem {
  avgTSMPrice: number
  estimatedRegionMarketValue: number
  homeMinPrice: number
  itemID: number
  itemName: string
  link: string
  percentChange: number
  salesPerDay: number
  state: WoWMarketState
  undermineLink: string
  warcraftPetsLink: string
}

export type PetMarketshareSortBy =
  | 'avgTSMPrice'
  | 'estimatedRegionMarketValue'
  | 'homeMinPrice'
  | 'percentChange'
  | 'salesPerDay'

interface PetMarketshareProps {
  region: WoWServerRegion
  homeRealmName: string
  desiredPrice: number
  desiredSalesPerDay: number
  includeCategories: Array<number>
  excludeCategories: Array<number>
  sortBy: string
}

const PetMarketshare: (
  props: PetMarketshareProps
) => Promise<Response> = async ({
  region,
  homeRealmName,
  desiredPrice,
  desiredSalesPerDay,
  includeCategories,
  excludeCategories,
  sortBy
}) => {
  return fetch(`${address}/api/wow/petmarketshare`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': UserAgent
    },
    body: JSON.stringify({
      region,
      homeRealmName,
      minPrice: desiredPrice,
      salesPerDay: desiredSalesPerDay,
      includeCategories,
      excludeCategories,
      sortBy
    })
  })
}

export default PetMarketshare
