import { address, UserAgent } from '~/requests/client/config'

export interface ListingPriceDiff {
  avg_price_diff: number
  median_price_diff: number
}

export interface ListingTimeDiff {
  avg_time_diff: number
  median_time_diff: number
}

export interface Listing {
  hq: boolean
  lastReviewTime: string
  pricePerUnit: number
  quantity: number
  retainerName: string
  total: number
  unix_timestamp: number
}

export interface ListingResponseType {
  listing_price_diff: ListingPriceDiff
  listing_time_diff: ListingTimeDiff
  listings: Array<Listing>
  min_price: number
  payload: GetListingProps
  priceTimeData: number[]
  priceTimeDataHQ: number[]
  quantityTimeData: number[]
  quantityTimeDataHQ: number[]
  current_price_vs_median_percent: number
  current_hq_price_vs_median_percent: number
  current_quantity_vs_median_percent: number
  current_hq_quantity_vs_median_percent: number
}

export interface GetListingProps {
  itemId: number
  world: string
  initialDays: number
  endDays: number
}

const GetListing: ({
  itemId,
  world,
  initialDays,
  endDays
}: /**
 * Sends a POST request to fetch listing information based on provided parameters.
 * @example
 * sync({ itemId: 123, world: 'Ultros', initialDays: 1, endDays: 7 })
 * Promise<Response> object containing listing data
 * @param {number} itemId - Unique identifier for the item.
 * @param {string} world - Name of the server world.
 * @param {number} initialDays - Number of initial days for the listing.
 * @param {number} endDays - Number of end days for the listing.
 * @returns {Promise<Response>} Promise containing the fetch response.
 * @description
 *   - The function constructs JSON request body from the arguments.
 *   - Uses the user's agent for request headers.
 *   - Makes a network request to the endpoint defined by 'address' variable.
 *   - Intended for use in fetching game data listings in FFXIV.
 */
GetListingProps) => Promise<Response> = async ({
  itemId,
  world,
  initialDays,
  endDays
}) => {
  return fetch(`${address}/api/ffxiv/v2/listing`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': UserAgent
    },
    body: JSON.stringify({
      item_id: itemId,
      home_server: world,
      initial_days: initialDays,
      end_days: endDays
    })
  })
}

export default GetListing
