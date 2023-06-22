import { address, UserAgent } from '~/requests/client/config'
import type { WoWServerRegion } from '../WOWScan'
import type { WoWMarketState } from './types'

interface ItemListingsProps {
  homeRealmId: number
  region: WoWServerRegion
  itemID: number
}

interface ListingData {
  price: number
  quantity: number
}

interface ItemListing {
  avgQuantity: number
  currentMarketValue: number
  currentQuantity: number
  currentVsAvgQuantityPercent: number
  historicMarketValue: number
  historicPrice: number
  itemID: number
  itemName: string
  listingData: Array<ListingData>
  minPrice: number
  percentChange: number
  priceTimeData: Array<number>
  quantityState: WoWMarketState
  quantityTimeData: Array<number>
  salesPerDay: number
  state: WoWMarketState
}

export interface ItemListingResponse {
  data: ItemListing
}

const ItemListingsData: (
  props: ItemListingsProps
) => Promise<Response> = async ({ homeRealmId, region, itemID }) => {
  return fetch(`${address}/api/wow/listings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': UserAgent
    },
    body: JSON.stringify({
      homeRealmId,
      region,
      itemID
    })
  })
}

export default ItemListingsData
