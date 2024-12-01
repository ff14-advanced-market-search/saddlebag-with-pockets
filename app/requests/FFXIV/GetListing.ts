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
}: GetListingProps) => Promise<Response> = async ({
  itemId,
  world,
  initialDays,
  endDays
}) => {
  return fetch(`${address}/api/listing`, {
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
