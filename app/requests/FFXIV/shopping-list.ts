import { address, UserAgent } from '~/requests/client/config'

export interface ShoppingItem {
  itemID: string | number
  craft_amount: number
  hq: boolean
  job: number
}
export interface GetShoppingListInput {
  homeServer: string
  shoppingList: Array<ShoppingItem>
}

const GetShoppingList = async ({
  homeServer,
  shoppingList
}: GetShoppingListInput) => {
  const firstRequest = await fetch(`${address}/api/createshoppinglist`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': UserAgent
    },
    body: JSON.stringify({
      home_server: homeServer,
      shopping_list: shoppingList
    })
  })

  const newInput = await firstRequest.json()

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
