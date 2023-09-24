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

const GetShoppingList = async ({
  homeServer,
  shoppingList,
  regionWide
}: GetShoppingListInput) => {
  const firstRequest = await fetch(`${address}/api/createshoppinglist`, {
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

  const newInput = await firstRequest.json()

  if ('exception' in newInput) {
    return json(newInput)
  }

  return await fetch(`${address}/api/shoppinglist`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': UserAgent
    },
    body: JSON.stringify(newInput)
  })
}

export default GetShoppingList
