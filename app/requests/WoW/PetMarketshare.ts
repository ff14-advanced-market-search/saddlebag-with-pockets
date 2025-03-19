import { address, UserAgent } from '~/requests/client/config'
import type { WoWServerRegion } from './WOWScan'
import type { WoWMarketState } from './types'

export interface PetMarketshareResponse {
  data: Array<PetMarketshareItem>
}

export interface PetMarketshareItem {
  avgTSMPrice: number
  estimatedRegionMarketValue: number
  homeMinPrice: number
  itemID: number
  itemName: string
  link: string
  percentChange: number
  salesPerDay: number
  state: WoWMarketState
  undermineLink: string
  warcraftPetsLink: string
}

export type PetMarketshareSortBy =
  | 'avgTSMPrice'
  | 'estimatedRegionMarketValue'
  | 'homeMinPrice'
  | 'percentChange'
  | 'salesPerDay'

interface PetMarketshareProps {
  region: WoWServerRegion
  homeRealmName: string
  desiredPrice: number
  desiredSalesPerDay: number
  includeCategories: Array<number>
  excludeCategories: Array<number>
  sortBy: string
}

const PetMarketshare: (
  props: PetMarketshareProps
  /**
   * Sends a request to the WoW Pet Market Share API with specified filters and returns the response.
   * @example
   * sync({
   *   region: 'us',
   *   homeRealmName: 'Stormrage',
   *   desiredPrice: 100,
   *   desiredSalesPerDay: 10,
   *   includeCategories: ['Battle Pets', 'Mounts'],
   *   excludeCategories: ['Toy'],
   *   sortBy: 'price'
   * })
   * Promise<Response>
   * @param {Object} params - The parameters for the API request.
   * @param {string} params.region - The region for the market data.
   * @param {string} params.homeRealmName - The home realm name for filtering results.
   * @param {number} params.desiredPrice - The price threshold for items.
   * @param {number} params.desiredSalesPerDay - The sales per day threshold for items.
   * @param {Array<string>} params.includeCategories - Categories to include in the results.
   * @param {Array<string>} params.excludeCategories - Categories to exclude from the results.
   * @param {string} params.sortBy - The attribute to sort the results by.
   * @returns {Promise<Response>} A promise resolving to the API response containing the filtered market data.
   * @description
   *   - Utilizes 'fetch' to send POST requests with given parameters.
   *   - Converts parameters to JSON format for the request body.
   *   - Requires 'User-Agent' and 'Content-Type' headers for the API call.
   */
) => Promise<Response> = async ({
  region,
  homeRealmName,
  desiredPrice,
  desiredSalesPerDay,
  includeCategories,
  excludeCategories,
  sortBy
}) => {
  return fetch(`${address}/api/wow/petmarketshare`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': UserAgent
    },
    body: JSON.stringify({
      region,
      homeRealmName,
      minPrice: desiredPrice,
      salesPerDay: desiredSalesPerDay,
      includeCategories,
      excludeCategories,
      sortBy
    })
  })
}

export default PetMarketshare
