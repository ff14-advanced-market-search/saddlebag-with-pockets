import { address, UserAgent } from '~/requests/client/config'
import type { WoWServerRegion } from './WOWScan'

interface WoWShoppingListProps {
  region: WoWServerRegion
  itemID: number
  maxPurchasePrice: number
}

export interface ListItem {
  link: string
  price: number
  quantity: number
  realmID: number
  realmName: string
  realmNames: string
}

export interface WoWListResponse {
  name: string
  data: Array<ListItem>
}

/**
 * Sends a request to synchronize the shopping list for WoW based on provided parameters.
 * @example
 * sync({ region: 'EU', itemID: 12345, maxPurchasePrice: 1000 })
 * // Sample return: Promise containing response of the request
 * @param {Object} WoWShoppingListProps - The properties for the WoW shopping list.
 * @param {string} WoWShoppingListProps.region - The region for the WoW shopping list request.
 * @param {number} WoWShoppingListProps.itemID - The ID of the item for the WoW shopping list request.
 * @param {number} WoWShoppingListProps.maxPurchasePrice - The maximum purchase price for the item.
 * @returns {Promise} A promise that resolves with the server response.
 * @description
 *   - The function sends a POST request with JSON data to a specified API endpoint.
 *   - It creates an empty object for 'connectedRealmIDs' within the request body.
 *   - User-Agent is included in the headers to identify the client making the request.
 */
const WoWShoppingList = async ({
  region,
  itemID,
  maxPurchasePrice
}: WoWShoppingListProps) => {
  return fetch(`${address}/api/wow/shoppinglistx`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': UserAgent
    },
    // send a JSON with salesPerDay as a float
    body: JSON.stringify({
      region,
      itemID,
      maxPurchasePrice,
      connectedRealmIDs: {}
    })
  })
}

export default WoWShoppingList
