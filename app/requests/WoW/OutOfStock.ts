import { address, UserAgent } from '~/requests/client/config'
import type { WoWServerRegion } from '../WOWScan'

interface WoWOutOfStockProps {
  region: WoWServerRegion
  salesPerDay: number
  avgPrice: number
  minMarketValue: number
  populationWP: number
  populationBlizz: number
  rankingWP: number
  includeCategories: number[]
  excludeCategories: number[]
  expansionNumber: number
}

export interface OutOfStockItem {
  itemID: number
  itemName: string
  realmNames: string
  marketValue: number
  historicPrice: number
  salesPerDay: number
  popWoWProgress: number
  rankWoWProgress: number
  connectedRealmId: number
  undermineLink: string
  saddlebagLink: string
}

export interface WoWOutOfStockResponse {
  data: Array<OutOfStockItem>
}

/**
* Sends a request to fetch World of Warcraft out of stock information based on given parameters.
* @example
* sync({
*   region: 'US',
*   salesPerDay: 100,
*   avgPrice: 200,
*   minMarketValue: 150,
*   populationWP: 5000,
*   populationBlizz: 12000,
*   rankingWP: 2,
*   includeCategories: ['Weapons', 'Armor'],
*   excludeCategories: ['Potions'],
*   expansionNumber: 4
* })
* @param {string} region - The region to search within.
* @param {number} salesPerDay - The average sales per day.
* @param {number} avgPrice - The average price of items.
* @param {number} minMarketValue - The minimum market value for items.
* @param {number} populationWP - WoWProgress population data.
* @param {number} populationBlizz - Blizzard population data.
* @param {number} rankingWP - The WoWProgress ranking.
* @param {Array<string>} includeCategories - Categories of items to include in the search.
* @param {Array<string>} excludeCategories - Categories of items to exclude from the search.
* @param {number} expansionNumber - The expansion number.
* @returns {Promise<Response>} The fetch promise with the response data.
* @description
*   - Utilizes a POST request to communicate with the external WoW out of stock API endpoint.
*   - Converts input parameters to JSON format for the request body.
*   - Specifies a User-Agent header for identification or tracking purposes.
*/
const WoWOutOfStock = async ({
  region,
  salesPerDay,
  avgPrice,
  minMarketValue,
  populationWP,
  populationBlizz,
  rankingWP,
  includeCategories,
  excludeCategories,
  expansionNumber
}: WoWOutOfStockProps) => {
  return fetch(`${address}/api/wow/outofstock`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': UserAgent
    },
    body: JSON.stringify({
      region,
      salesPerDay,
      avgPrice,
      minMarketValue,
      populationWP,
      populationBlizz,
      rankingWP,
      includeCategories,
      excludeCategories,
      expansionNumber
    })
  })
}

export default WoWOutOfStock
