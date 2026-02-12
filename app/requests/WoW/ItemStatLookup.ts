import { address, UserAgent } from '~/requests/client/config'
import type { WoWServerRegion } from './WOWScan'
import { WOW_DISCORD_CONSENT } from '~/constants/wowDiscordConsent'
import type { WoWMarketState } from './types'

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
  expansionNumber: number
}

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
  state: WoWMarketState
  avgQuantity: number
  currentQuantity: number
  currentVsAvgQuantityPercent: number
  quantityState: WoWMarketState
  expansion_number: number
}

export interface ItemStatResponse {
  data: Array<ItemStats>
}

/**
 * Sends a POST request to the WoW item stats API with provided item criteria.
 * @example
 * sync({
 *   homeRealmId: 123,
 *   itemQuality: 'high',
 *   desiredSalesPerDay: 10,
 *   region: 'US',
 *   commodity: 'ore',
 *   desiredAvgPrice: 500,
 *   requiredLevel: 20,
 *   itemClass: 'weapon',
 *   itemSubClass: 'sword',
 *   iLvl: 100,
 *   expansionNumber: 3
 * })
 * // returns a Promise that resolves to the API response object
 * @param {Object} {homeRealmId, itemQuality, desiredSalesPerDay, region, commodity, desiredAvgPrice, requiredLevel, itemClass, itemSubClass, iLvl, expansionNumber} - Parameters required for the API request.
 * @returns {Promise<Object>} A promise that resolves to the response object from the item stats API.
 * @description
 *   - The function utilizes the fetch API for sending HTTP requests.
 *   - It converts the input parameters into a JSON string for the request body.
 *   - UserAgent is assumed to be a predefined constant or variable available in the scope.
 *   - It requires the server address to be defined under the variable `address`.
 */
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
  iLvl,
  expansionNumber
}) => {
  return fetch(`${address}/api/wow/itemstats`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': UserAgent
    },
    body: JSON.stringify({
      discord_consent: WOW_DISCORD_CONSENT,
      homeRealmId,
      region,
      commodity,
      desired_avg_price: desiredAvgPrice,
      desired_sales_per_day: desiredSalesPerDay,
      itemQuality,
      required_level: requiredLevel,
      item_class: itemClass,
      item_subclass: itemSubClass,
      ilvl: iLvl,
      expansion_number: expansionNumber
    })
  })
}

export default WoWStatLookup
