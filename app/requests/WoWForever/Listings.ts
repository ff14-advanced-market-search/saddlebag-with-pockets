import { address, UserAgent } from '../client/config'
import { WOW_DISCORD_CONSENT } from '../../constants/wowDiscordConsent'
import type { WoWMarketState } from '../WoW/types'
import type { WoWForeverRegion } from '../../utils/WoWForever'

interface ListingData {
  price: number
  quantity: number
  auctionID?: number
}

/**
 * Forever listing row from POST /api/wow/forever/listings (single-item).
 * Render listingData / prices as returned — do not pick commodity vs single
 * via is_stackable (item ids are not in both markets; API sets item_type).
 *
 * Optional tsm* fields are shown when the API exposes Forever TSM raw columns.
 */
export interface ForeverItemListing {
  itemID: number
  itemName: string
  /** API-provided feed label only; do not use for market selection. */
  item_type?: string
  minPrice: number
  historicPrice: number
  salesPerDay: number
  listingData: ListingData[]
  currentQuantity: number
  currentMarketValue: number
  historicMarketValue: number
  percentChange: number
  state: WoWMarketState
  link: string
  auctionHouseId: number
  auctionHouseName: string
  faction: string
  lowestAuctionID?: number
  /** Present on bulk / older shapes; optional on compact forever/listings. */
  avgQuantity?: number
  quantityState?: WoWMarketState
  currentVsAvgQuantityPercent?: number
  priceTimeData?: number[]
  quantityTimeData?: number[]
  blog?: string
  tsmQuantity?: number | null
  tsmMarketValue?: number | null
  tsmAvgSalePrice?: number | null
  tsmSaleRate?: number | null
  tsmSoldPerDay?: number | null
  tsmHistorical?: number | null
}

export type ForeverItemListingResponse =
  | { data: ForeverItemListing }
  | { exception: string }

export interface ForeverListingsProps {
  auctionHouseId: number
  region: WoWForeverRegion
  itemID: number
}

const isForeverItemListingResponse = (
  body: unknown
): body is ForeverItemListingResponse => {
  if (body == null || typeof body !== 'object') return false
  return 'data' in body || 'exception' in body
}

/**
 * POST /api/wow/forever/listings
 * Fast single-item Forever mirror of retail /api/wow/v2/listings.
 */
const ForeverListings = async ({
  auctionHouseId,
  region,
  itemID
}: ForeverListingsProps): Promise<ForeverItemListingResponse> => {
  const response = await fetch(`${address}/api/wow/forever/listings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': UserAgent
    },
    body: JSON.stringify({
      discord_consent: WOW_DISCORD_CONSENT,
      auctionHouseId,
      region,
      itemID
    })
  })

  if (!response.ok) {
    return {
      exception: `Forever listings request failed (${response.status}). POST /api/wow/forever/listings may not be deployed yet (Aetheryte PR #426).`
    }
  }

  const body: unknown = await response.json()
  if (!isForeverItemListingResponse(body)) {
    return { exception: 'Invalid Forever listings response' }
  }
  return body
}

export default ForeverListings
