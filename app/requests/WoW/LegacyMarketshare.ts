import { address, UserAgent } from '~/requests/client/config'
import type { MarketState } from '../FFXIV/marketshare'

export interface LegacyMarketshareResponse {
  data: Array<MarketshareItem>
}

export interface MarketshareItem {
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
}

interface LegacyMarketshareProps {
  homeRealmId: number
  desiredAvgPrice: number
  desiredSalesPerDay: number
  itemClass: number
  itemSubClass: number
  sortBy: string
}

const LegacyMarketshare: (
  props: LegacyMarketshareProps
) => Promise<Response> = async ({
  homeRealmId,
  desiredSalesPerDay,
  desiredAvgPrice,
  itemClass,
  itemSubClass,
  sortBy
}) => {
  return fetch(`${address}/api/wow/legacymarket`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': UserAgent
    },
    body: JSON.stringify({
      homeRealmId,
      desired_avg_price: desiredAvgPrice,
      desired_sales_per_day: desiredSalesPerDay,
      item_class: itemClass,
      item_subclass: itemSubClass,
      sort_by: sortBy
    })
  })
}

export default LegacyMarketshare
