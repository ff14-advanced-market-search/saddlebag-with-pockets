import { address, UserAgent } from '~/requests/client/config'
import type { WoWServerRegion } from './WOWScan'

export interface UltrarareSearchProps {
  region: WoWServerRegion
  populationBlizz: number
  rankingWP: number
  populationWP: number
  min_quantity: number
  max_quantity: number
  item_class: number
  item_subclass: number
  min_quality: number
  expansion_number: number
  sortBy: string
  min_buyoutPrice: number
  max_buyoutPrice: number
  min_tsmAvgSalePrice: number
  max_tsmAvgSalePrice: number
  earlyAccessToken: string
}

export interface UltrarareItem {
  itemID: number
  wowheadURL: string
  itemName: string
  item_class: number
  item_subclass: number
  quality: number
  minPrice: number
  total_quantity: number
  eligible_realm_count: number
  shortage: number
  realm_count_with_item: number
  medianMinPrice: number
  averageMinPrice: number
  tsmMarketValue: number
  tsmAvgSalePrice: number
  tsmSaleRate: number
  tsmSoldPerDay: number
  tsmHistorical: number
  tsmAvgSaleVSCurrentMin: string
  tsmAvgSaleVSCurrentAverage: string
  tsmAvgSaleVSCurrentMedian: string
  tsmHistoricVSCurrentMin: string
  tsmHistoricVSCurrentAverage: string
  tsmHistoricVSCurrentMedian: string
}

export interface UltrarareResponse {
  data: Array<UltrarareItem>
}

/**
 * Performs a fetch request to the WoW ultrarare API.
 * @example
 * UltrarareSearch({ region: 'NA', populationBlizz: 0, rankingWP: 99, populationWP: 5000, min_quantity: 0, max_quantity: 10, item_class: 2, item_subclass: -1, min_quality: -1, expansion_number: -1, sortBy: 'shortage', earlyAccessToken: 'token123' })
 * Promise<Response>
 * @param {UltrarareSearchProps} props - Object containing search properties for WoW ultrarare.
 * @returns {Promise<Response>} Returns a Promise that resolves to the response of the fetch request.
 * @description
 *   - Sends request as 'POST' method with JSON stringified body to the endpoint.
 *   - Uses the early access token in the URL path.
 *   - Includes content types and user agent in the headers.
 */
const UltrarareSearch = async ({
  region,
  populationBlizz,
  rankingWP,
  populationWP,
  min_quantity,
  max_quantity,
  item_class,
  item_subclass,
  min_quality,
  expansion_number,
  sortBy,
  min_buyoutPrice,
  max_buyoutPrice,
  min_tsmAvgSalePrice,
  max_tsmAvgSalePrice,
  earlyAccessToken
}: UltrarareSearchProps) =>
  fetch(`${address}/api/wow/${earlyAccessToken}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': UserAgent
    },
    body: JSON.stringify({
      region,
      populationBlizz,
      rankingWP,
      populationWP,
      min_quantity,
      max_quantity,
      item_class,
      item_subclass,
      min_quality,
      expansion_number,
      sortBy,
      min_buyoutPrice,
      max_buyoutPrice,
      min_tsmAvgSalePrice,
      max_tsmAvgSalePrice
    })
  })

export default UltrarareSearch
