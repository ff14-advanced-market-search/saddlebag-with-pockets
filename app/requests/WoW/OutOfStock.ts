import { address, UserAgent } from '~/requests/client/config'
import type { WoWServerRegion } from '../WOWScan'

interface WoWOutOfStockProps {
  region: WoWServerRegion
  salesPerDay: number
  avgPrice: number
  minMarketValue: number
  populationWP: number
  populationBlizz: number
  rankingWP: number
  includeCategories: number[]
  excludeCategories: number[]
  expansionNumber: number
}

export interface OutOfStockItem {
  itemID: number
  itemName: string
  realmNames: string
  marketValue: number
  salesPerDay: number
  popWoWProgress: number
  rankWoWProgress: number
  connectedRealmId: number
}

export interface WoWOutOfStockResponse {
  data: Array<OutOfStockItem>
}

const WoWOutOfStock = async ({
  region,
  salesPerDay,
  avgPrice,
  minMarketValue,
  populationWP,
  populationBlizz,
  rankingWP,
  includeCategories,
  excludeCategories,
  expansionNumber
}: WoWOutOfStockProps) => {
  return fetch(`${address}/api/wow/outofstock`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': UserAgent
    },
    body: JSON.stringify({
      region,
      salesPerDay,
      avgPrice,
      minMarketValue,
      populationWP,
      populationBlizz,
      rankingWP,
      includeCategories,
      excludeCategories,
      expansionNumber
    })
  })
}

export default WoWOutOfStock