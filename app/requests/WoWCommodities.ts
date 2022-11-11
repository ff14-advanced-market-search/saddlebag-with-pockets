import { address, UserAgent } from '~/requests/client/config'

interface WoWShortageReset {
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
  price_reset: true
  max_sane_flip_level: {
    cost_to_level?: number
    cost_to_next_level?: number
    listing_price_level?: {
      from_price_level?: number
      to_price_level?: number
    }
  }
  price_reset_info: {
    recommend_price: number
    total_price: number
  }
}

interface WowShortageIncrease {
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
  price_reset: false
  max_sane_flip_level: {
    cost_to_level: number
    cost_to_next_level: number
    listing_price_level: {
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
      increase: Array<WowShortageIncrease>
      reset: Array<WoWShortageReset>
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
}

const WoWCommodityShortage: ({
  desiredAvgPrice,
  desiredSalesPerDay,
  desiredPriceIncrease,
  desiredSellPrice,
  flipRiskLimit,
  itemQuality,
  itemClass,
  itemSubClass
}: WOWCommodityShortageProps) => Promise<Response> = async ({
  desiredAvgPrice,
  desiredSalesPerDay,
  desiredPriceIncrease,
  desiredSellPrice,
  flipRiskLimit,
  itemQuality,
  itemClass,
  itemSubClass
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
      item_subclass: itemSubClass
    })
  })
}

export default WoWCommodityShortage
