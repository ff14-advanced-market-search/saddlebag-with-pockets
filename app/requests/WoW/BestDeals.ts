import { address, UserAgent } from '~/requests/client/config'
import type { WoWServerRegion } from './WOWScan'
import { WOW_DISCORD_CONSENT } from '~/constants/wowDiscordConsent'

interface WoWBestDealsProps {
  type: string
  region: WoWServerRegion
  discount: number
  salesPerDay: number
  minPrice: number
  itemClass: number
  itemSubClass: number
  expansionNumber: number
}

export interface DealItem {
  [key: string]: any
  connectedRealmId: number
  discount: number
  historicPrice: number
  itemID: number
  itemName: string
  link: string
  minPrice: number
  realmName: string
  salesPerDay: number
}

export interface WoWDealResponse {
  data: Array<DealItem>
}

/**
 * Sends a POST request to fetch the best deals in WoW based on the provided parameters
 * @example
 * sync({ type: 'armor', region: 'US', discount: 20, salesPerDay: 15, minPrice: 100, itemClass: 2, itemSubClass: 3, expansionNumber: 9 })
 * Promise resolving with server response
 * @param {Object} WoWBestDealsProps - Object containing the parameters for fetching best deals.
 * @param {string} WoWBestDealsProps.type - Type of the item.
 * @param {string} WoWBestDealsProps.region - Region of the market.
 * @param {number} WoWBestDealsProps.discount - Discount percentage.
 * @param {number} WoWBestDealsProps.salesPerDay - Number of sales per day.
 * @param {number} WoWBestDealsProps.minPrice - Minimum price filter.
 * @param {number} WoWBestDealsProps.itemClass - Class of the item.
 * @param {number} WoWBestDealsProps.itemSubClass - Subclass of the item.
 * @param {number} WoWBestDealsProps.expansionNumber - Expansion number.
 * @returns {Promise} Returns a Promise that resolves with the response from the server.
 * @description
 *   - Converts salesPerDay to a float with one decimal place before sending.
 *   - Communicates with the '/api/wow/bestdeals' endpoint.
 *   - Utilizes 'application/json' content type for the request.
 *   - Attaches 'User-Agent' for request headers.
 */
const WoWBestDeals = async ({
  type,
  region,
  discount,
  salesPerDay,
  minPrice,
  itemClass,
  itemSubClass,
  expansionNumber
}: WoWBestDealsProps) => {
  const floatingSalesPerDay = salesPerDay.toFixed(1)
  return fetch(`${address}/api/wow/bestdeals`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': UserAgent
    },
    // send a JSON with salesPerDay as a float
    body: JSON.stringify({
      discord_consent: WOW_DISCORD_CONSENT,
      type,
      region,
      discount,
      minPrice,
      salesPerDay: +floatingSalesPerDay,
      item_class: itemClass,
      item_subclass: itemSubClass,
      expansion_number: expansionNumber
    })
  })
}

export default WoWBestDeals
