import { address, UserAgent } from '~/requests/client/config'
import type { WoWServerRegion } from '../WOWScan'

interface StatLookupProps {
  homeRealmId: number
  region: WoWServerRegion
  commodity: boolean
  desiredAvgPrice: number
  desiredSalesPerDay: number
  itemQuality: number
  requiredLevel: number
  itemClass: number
  itemSubclass: number
  iLvl: number
}

export interface ItemStats {
  currentMarketValue: number
  historicMarketValue: number
  historicPrice: number
  itemID: number
  itemName: string
  item_class: number
  item_subclass: number
  minPrice: number
  percentChange: number
  salesPerDay: number
  state: 'spiking' | 'increasing' | 'stable' | 'decreasing' | 'crashing'
}

export interface ItemStatResponse {
  data: Array<ItemStats>
}

const WoWStatLookup: (props: StatLookupProps) => Promise<Response> = async ({
  homeRealmId,
  itemQuality,
  desiredSalesPerDay,
  region,
  commodity,
  desiredAvgPrice,
  requiredLevel,
  itemClass,
  itemSubclass,
  iLvl
}) => {
  return fetch(`${address}/api/wow/itemstats`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': UserAgent
    },
    body: JSON.stringify({
      homeRealmId,
      region,
      commodity,
      desired_avg_price: desiredAvgPrice,
      desired_sales_per_day: desiredSalesPerDay,
      itemQuality,
      required_level: requiredLevel,
      item_class: itemClass,
      item_subclass: itemSubclass,
      ilvl: iLvl
    })
  })
}

export default WoWStatLookup
