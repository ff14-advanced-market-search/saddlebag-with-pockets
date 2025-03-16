import { json } from '@remix-run/cloudflare'
import { address, UserAgent } from '~/requests/client/config'

export interface ShoppingInputItem {
  itemID: string | number
  craft_amount: number
  hq: boolean
  job: number
}
export interface GetShoppingListInput {
  homeServer: string
  shoppingList: Array<ShoppingInputItem>
  regionWide: boolean
}

export interface ShoppingListItem {
  [key: string]: any
  hq: boolean
  itemID: number
  name: string
  pricePerUnit: number
  quantity: number
  worldName: string
}

export interface GetShoppingListResponse {
  average_cost_per_craft: number
  total_cost: number
  data: Array<ShoppingListItem>
}

/**
 * Executes a network request to fetch a shopping list.
 * @example
 * sync({ homeServer: 'server1', shoppingList: ['item1', 'item2'], regionWide: true })
 * Promise { <pending> }
 * @param {Object} {GetShoppingListInput} - An object containing the necessary input parameters.
 * @param {string} {homeServer} - The server from which the shopping list is fetched.
 * @param {Array} {shoppingList} - The list of items to be included in the shopping list.
 * @param {boolean} {regionWide} - A flag indicating if the list fetch is region-wide.
 * @returns {Promise<Response>} A promise that resolves to the response of the fetch request.
 * @description
 *   - This function uses the Fetch API to send a POST request to a specific endpoint.
 *   - It serializes the request body as JSON.
 *   - Sets the 'Content-Type' header to 'application/json' for the request.
 */
const GetShoppingList = async ({
  homeServer,
  shoppingList,
  regionWide
}: GetShoppingListInput) => {
  return await fetch(`${address}/api/v2/shoppinglist`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': UserAgent
    },
    body: JSON.stringify({
      home_server: homeServer,
      shopping_list: shoppingList,
      region_wide: regionWide
    })
  })
}

export default GetShoppingList
