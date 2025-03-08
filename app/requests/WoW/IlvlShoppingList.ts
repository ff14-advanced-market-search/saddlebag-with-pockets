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
