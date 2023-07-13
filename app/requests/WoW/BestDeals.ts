import { address, UserAgent } from '~/requests/client/config'
import type { WoWServerRegion } from '../WOWScan'

interface WoWBestDealsProps {
  type: string
  region: WoWServerRegion
  discount: number
  minPrice: number
  salesPerDay: number
}

export interface DealItem {
  connectedRealmID: number
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

const WoWBestDeals = async ({
  type,
  region,
  discount,
  minPrice,
  salesPerDay
}: WoWBestDealsProps) =>
  fetch(`${address}/api/wow/bestdeals`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': UserAgent
    },
    body: JSON.stringify({
      type,
      region,
      discount,
      minPrice,
      salesPerDay
    })
  })

export default WoWBestDeals
