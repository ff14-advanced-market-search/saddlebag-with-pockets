import { address, UserAgent } from '~/requests/client/config'
import type { WoWServerRegion } from './WOWScan'

export type ItemStat = 'Socket' | 'Leech' | 'Speed' | 'Avoidance' // | 'Haste' | 'Crit' | 'Mastery' | 'Versatility'

interface IlvlShoppingListProps {
  region: WoWServerRegion
  itemID: number
  maxPurchasePrice: number
  desiredStats: ItemStat[]
  desiredMinIlvl: number
}

export interface ListItem {
  link: string
  price: number
  quantity: number
  realmID: number
  realmName: string
  realmNames: string
  ilvl: number
  stats: ItemStat[]
}

export interface IlvlWoWListResponse {
  name: string
  data: Array<ListItem>
}

/**
* Sends a POST request to retrieve a shopping list for items based on specified criteria.
* @example
* sync({ region: 'us', itemID: 1234, maxPurchasePrice: 5000, desiredStats: ['haste', 'crit'], desiredMinIlvl: 200 })
* // Returns a promise with the response from the API
* @param {Object} { Arguments } - An object containing parameters for the shopping list.
* @param {string} {region} - The region code for which the shopping list is requested.
* @param {number} {itemID} - The unique identifier for the item to search for.
* @param {number} {maxPurchasePrice} - The maximum purchase price of the desired item.
* @param {Array<string>} {desiredStats} - A list of desired item stats (e.g., 'haste', 'crit').
* @param {number} {desiredMinIlvl} - The minimum item level desired for the items.
* @returns {Promise<Response>} Returns a promise that resolves to the fetch API response.
* @description
*   - It uses a POST request to communicate with the specified API endpoint.
*   - It serializes the provided parameters into a JSON string for the request body.
*   - Sets necessary headers including content type and user agent.
*/
const IlvlShoppingList = async ({
  region,
  itemID,
  maxPurchasePrice,
  desiredStats,
  desiredMinIlvl
}: IlvlShoppingListProps) => {
  return fetch(`${address}/api/wow/ilvlshoppinglist`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': UserAgent
    },
    body: JSON.stringify({
      region,
      itemID,
      maxPurchasePrice,
      desiredStats,
      desiredMinIlvl
    })
  })
}

export default IlvlShoppingList
