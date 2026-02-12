import { address, UserAgent } from '~/requests/client/config'
import { WOW_DISCORD_CONSENT } from '~/constants/wowDiscordConsent'
import type { WoWServerRegion } from '~/requests/WoW/types'

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
      region: WoWServerRegion
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
}: /**
 * Sends a POST request to fetch commodity data in World of Warcraft.
 * @example
 * sync({
 *   desiredAvgPrice: 100,
 *   desiredSalesPerDay: 20,
 *   desiredPriceIncrease: 5,
 *   desiredSellPrice: 120,
 *   flipRiskLimit: 10,
 *   itemQuality: 2,
 *   itemClass: 'Armor',
 *   itemSubClass: 'Plate',
 *   region: 'US',
 *   underMarketPricePercent: 10,
 *   overMarketPricePercent: 20
 * })
 * // Initiates a request to fetch commodity data
 * @param {number} desiredAvgPrice - The desired average price for commodities.
 * @param {number} desiredSalesPerDay - The desired sales per day.
 * @param {number} desiredPriceIncrease - The desired price increase.
 * @param {number} desiredSellPrice - The desired sell price of the commodity.
 * @param {number} flipRiskLimit - The risk limit for flipping.
 * @param {number} itemQuality - Quality level of the item.
 * @param {string} itemClass - Class of the item (e.g., 'Armor').
 * @param {string} itemSubClass - Subclass of the item (e.g., 'Plate').
 * @param {string} region - The region code for the request.
 * @param {number} underMarketPricePercent - Percent under market price.
 * @param {number} overMarketPricePercent - Percent over market price.
 * @returns {Promise<Response>} A promise resolving to the response from the API call.
 * @description
 *   - The function makes an API call to the `${address}/api/wow/commodity` endpoint.
 *   - Method used for the request is 'POST'.
 *   - Headers include 'Content-Type' set to 'application/json' and a predefined 'User-Agent'.
 *   - `body` of the request is a JSON string derived from the function arguments.
 */
WOWCommodityShortageProps) => Promise<Response> = async ({
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
      discord_consent: WOW_DISCORD_CONSENT,
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
