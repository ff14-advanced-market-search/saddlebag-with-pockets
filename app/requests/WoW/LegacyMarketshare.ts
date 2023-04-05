import { address, UserAgent } from '~/requests/client/config'
import type { MarketState } from '../FFXIV/marketshare'

export interface LegacyMarketshareResponse {
  data: Array<LegacyMarketshareItem>
}

export interface LegacyMarketshareItem {
  itemID: number
  itemName: string
  currentMarketValue: number
  historicMarketValue: number
  historicPrice: number
  minPrice: number
  percentChange: number
  salesPerDay: number
  item_class: number
  item_subclass: number
  state: MarketState
}

export type LegacyMarketshareSortBy =
  | 'currentMarketValue'
  | 'historicMarketValue'
  | 'historicPrice'
  | 'minPrice'
  | 'percentChange'
  | 'salesPerDay'

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
