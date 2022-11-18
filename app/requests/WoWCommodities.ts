import { address, UserAgent } from '~/requests/client/config'
import type { WoWServerRegion } from './WOWScan'

export interface WoWShortage {
  avg_price: number
  flip_price_levels: Array<{
    listing_price_level: {
      from_price_level: number
      to_price_level: number
    }
    total_price: number
  }>
  item_id: number
  name: string
  sales_per_day: number
  sales_per_hour: number
  price_reset: boolean
  max_sane_flip_level: {
    cost_to_level?: number
    cost_to_next_level?: number
    listing_price_level?: {
      from_price_level: number
      to_price_level: number
    }
  }
  price_reset_info: {
    recommend_price?: number
    total_price?: number
  }
}

export type WowShortageResult =
  | {
      increase: Array<WoWShortage>
      reset: Array<WoWShortage>
    }
  | { exception: string }
  | {}

export interface WOWCommodityShortageProps {
  desiredAvgPrice: number
  desiredSalesPerDay: number
  desiredPriceIncrease: number
  desiredSellPrice: number
  flipRiskLimit: number
  itemQuality: number
  itemClass: number
  itemSubClass: number
  region: WoWServerRegion
  underMarketPricePercent: number
  overMarketPricePercent: number
}

const WoWCommodityShortage: ({
  desiredAvgPrice,
  desiredSalesPerDay,
  desiredPriceIncrease,
  desiredSellPrice,
  flipRiskLimit,
  itemQuality,
  itemClass,
  itemSubClass,
  region,
  underMarketPricePercent,
  overMarketPricePercent
}: WOWCommodityShortageProps) => Promise<Response> = async ({
  desiredAvgPrice,
  desiredSalesPerDay,
  desiredPriceIncrease,
  desiredSellPrice,
  flipRiskLimit,
  itemQuality,
  itemClass,
  itemSubClass,
  region,
  underMarketPricePercent,
  overMarketPricePercent
}) => {
  return fetch(`${address}/api/wow/commodity`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': UserAgent
    },
    body: JSON.stringify({
      desired_avg_price: desiredAvgPrice,
      desired_sales_per_day: desiredSalesPerDay,
      desired_price_increase: desiredPriceIncrease,
      desired_sell_price: desiredSellPrice,
      flip_risk_limit: flipRiskLimit,
      itemQuality: itemQuality,
      item_class: itemClass,
      item_subclass: itemSubClass,
      region,
      under_market_price_percent: underMarketPricePercent,
      over_market_price_percent: overMarketPricePercent
    })
  })
}

export default WoWCommodityShortage
