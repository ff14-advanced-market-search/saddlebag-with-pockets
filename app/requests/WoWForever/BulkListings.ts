import { address, UserAgent } from '~/requests/client/config'
import { WOW_DISCORD_CONSENT } from '~/constants/wowDiscordConsent'
import type { ForeverItemListing } from './Listings'
import type { WoWForeverRegion } from '~/utils/WoWForever'

export type { ForeverItemListing } from './Listings'
export type ForeverItemListingResponse =
  | { data: ForeverItemListing }
  | { exception: string }

export interface ForeverBulkListingsProps {
  auctionHouseId: number
  region: WoWForeverRegion
  itemIDs: Array<number>
}

export type ForeverBulkListingsResponse =
  | { data: Record<string, ForeverItemListing> }
  | { exception: string }

/**
 * POST /api/wow/forever/bulk-listings
 * Batch helper; Forever item-data prefers /api/wow/forever/listings for one item.
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

export default ForeverBulkListings
