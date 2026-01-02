import { address, UserAgent } from '~/requests/client/config'

export interface GW2MarketshareItem {
  itemID: number
  itemName: string
  state: string
  price_average: number
  historic_price_average: number
  pricePercentChange: number
  sold: number
  historic_sold: number
  soldPercentChange: number
  value: number
  historic_value: number
  valuePercentChange: number
  current_sell_price: number
  current_sell_quantity: number
  current_buy_price: number
  current_buy_quantity: number
  type: number
  details_type: number
  rarity: number
  level: number
  sell_sold: number
  sell_price_avg: number
  sell_value: number
  sell_delisted: number
  sell_listed: number
  sell_price_max: number
  sell_price_min: number
  sell_price_stdev: number
  sell_quantity_avg: number
  sell_quantity_max: number
  sell_quantity_min: number
  sell_quantity_stdev: number
  buy_sold: number
  buy_price_avg: number
  buy_value: number
  buy_delisted: number
  buy_listed: number
  buy_price_max: number
  buy_price_min: number
  buy_price_stdev: number
  buy_quantity_avg: number
  buy_quantity_max: number
  buy_quantity_min: number
  buy_quantity_stdev: number
  count: number
  statsDate: string
  historicStatsDateCutoff: string
}

export interface GW2MarketshareResponse {
  data: Array<GW2MarketshareItem>
}

export type GW2MarketshareSortBy =
  | 'value'
  | 'historic_value'
  | 'sold'
  | 'historic_sold'
  | 'price_average'
  | 'historic_price_average'
  | 'pricePercentChange'
  | 'soldPercentChange'
  | 'valuePercentChange'

export interface GW2MarketshareProps {
  desired_avg_price: number
  desired_sales_per_day: number
  sort_by: GW2MarketshareSortBy
  type: number
  details_type: number
  rarity: number
  level: number
}

const GW2Marketshare = async ({
  desired_avg_price,
  desired_sales_per_day,
  sort_by,
  type,
  details_type,
  rarity,
  level
}: GW2MarketshareProps): Promise<Response> => {
  return fetch(`${address}/api/gw2/marketshare`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': UserAgent
    },
    body: JSON.stringify({
      desired_avg_price,
      desired_sales_per_day,
      sort_by,
      type,
      details_type,
      rarity,
      level
    })
  })
}

export default GW2Marketshare
