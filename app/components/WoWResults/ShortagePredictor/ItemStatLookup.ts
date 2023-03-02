import { address, UserAgent } from '~/requests/client/config'
import type { WoWServerRegion } from '../../../requests/WOWScan'

interface StatLookupProps {
  homeRealmId: number
  region: WoWServerRegion
  commodity: boolean
  desiredAvgPrice: number
  desiredSalesPerDay: number
  itemQuality: number
  requiredLevel: number
  itemClass: number
  itemSubClass: number
  iLvl: number
}
type MarketState =
  | 'spiking'
  | 'increasing'
  | 'stable'
  | 'decreasing'
  | 'crashing'
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
  state: MarketState
  avgQuantity: number
  currentQuantity: number
  currentVsAvgQuantityPercent: number
  quantityState: MarketState
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
  itemSubClass,
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
      item_subclass: itemSubClass,
      ilvl: iLvl
    })
  })
}

export default WoWStatLookup
