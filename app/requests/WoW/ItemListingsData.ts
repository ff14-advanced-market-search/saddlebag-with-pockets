import { address, UserAgent } from '~/requests/client/config'
import type { WoWServerRegion } from './WOWScan'
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
  itemID: number
  itemName: string
  avgQuantity: number
  currentQuantity: number
  quantityState: WoWMarketState
  currentVsAvgQuantityPercent: number
  currentMarketValue: number
  historicMarketValue: number
  listingData: Array<ListingData>
  historicPrice: number
  minPrice: number
  salesPerDay: number
  percentChange: number
  priceTimeData: Array<number>
  quantityTimeData: Array<number>
  state: WoWMarketState
  link: string
  blog: string
}

export interface ItemListingResponse {
  data: ItemListing
}

const ItemListingsData: (
  props: ItemListingsProps
  /**
   * Sends a POST request to fetch item listings data for WoW using specified parameters.
   * @example
   * sync({ homeRealmId: 123, region: 'us', itemID: 456 })
   * A promise resolving to a response object from the fetch request.
   * @param {Object} params - Encapsulates parameters for the API request.
   * @param {number} params.homeRealmId - The ID of the home realm.
   * @param {string} params.region - The region code (e.g., 'us').
   * @param {number} params.itemID - The ID of the item to fetch listings for.
   * @returns {Promise<Response>} Promise resolving to the fetch response.
   * @description
   *   - The function constructs a POST request URL dynamically based on the server address.
   *   - Ensures the request contains necessary headers for content type and user agent.
   *   - Utilizes JSON.stringify to convert the parameters object to a JSON string for the request body.
   *   - Designed specifically for World of Warcraft item listings data retrieval.
   */
) => Promise<Response> = async ({ homeRealmId, region, itemID }) => {
  return fetch(`${address}/api/wow/v2/listings`, {
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
