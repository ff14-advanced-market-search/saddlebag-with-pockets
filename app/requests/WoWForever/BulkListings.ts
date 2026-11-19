import { address, UserAgent } from '~/requests/client/config'
import { WOW_DISCORD_CONSENT } from '~/constants/wowDiscordConsent'
import type { WoWMarketState } from '~/requests/WoW/types'
import type { WoWForeverRegion } from '~/utils/WoWForever'

interface ListingData {
  price: number
  quantity: number
  auctionID?: number
}

/**
 * Forever listing row from POST /api/wow/forever/bulk-listings.
 * Render listingData / prices as returned — do not pick commodity vs single
 * via is_stackable (item ids are not in both markets; API sets item_type).
 */
export interface ForeverItemListing {
  itemID: number
  itemName: string
  /** API-provided feed label only; do not use for market selection. */
  item_type?: string
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
  blog?: string
  auctionHouseId: number
  auctionHouseName: string
  faction: string
  lowestAuctionID?: number
  quantity?: number
}

export interface ForeverBulkListingsProps {
  auctionHouseId: number
  region: WoWForeverRegion
  itemIDs: Array<number>
}

export type ForeverBulkListingsResponse =
  | { data: Record<string, ForeverItemListing> }
  | { exception: string }

export type ForeverItemListingResponse =
  | { data: ForeverItemListing }
  | { exception: string }

/**
 * POST /api/wow/forever/bulk-listings
 * House-scoped Forever mirror of retail bulk-listings (auctionHouseId, not homeRealmId).
 */
const ForeverBulkListings = async ({
  auctionHouseId,
  region,
  itemIDs
}: ForeverBulkListingsProps): Promise<ForeverBulkListingsResponse> => {
  const response = await fetch(`${address}/api/wow/forever/bulk-listings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': UserAgent
    },
    body: JSON.stringify({
      discord_consent: WOW_DISCORD_CONSENT,
      auctionHouseId,
      region,
      itemIDs
    })
  })

  if (!response.ok) {
    return {
      exception: `Forever bulk-listings request failed (${response.status})`
    }
  }

  const body = (await response.json()) as ForeverBulkListingsResponse
  if (!body || typeof body !== 'object') {
    return { exception: 'Invalid Forever bulk-listings response' }
  }
  return body
}

/**
 * Single-item helper for the Forever item-data page.
 * Unwraps the bulk map keyed by stringified item ID.
 */
export const ForeverItemListingsData = async ({
  auctionHouseId,
  region,
  itemID
}: {
  auctionHouseId: number
  region: WoWForeverRegion
  itemID: number
}): Promise<ForeverItemListingResponse> => {
  const result = await ForeverBulkListings({
    auctionHouseId,
    region,
    itemIDs: [itemID]
  })

  if ('exception' in result) {
    return result
  }

  const listing = result.data?.[String(itemID)]
  if (!listing) {
    return { exception: `No Forever listing data found for item ${itemID}` }
  }

  return { data: listing }
}

export default ForeverBulkListings
