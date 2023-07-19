import { address, UserAgent } from '~/requests/client/config'
import type { WoWServerRegion } from '../WOWScan'

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

const WoWShoppingList = async ({
  region,
  itemID,
  maxPurchasePrice
}: WoWShoppingListProps) => {
  return fetch(`${address}/api/wow/shoppinglist`, {
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
