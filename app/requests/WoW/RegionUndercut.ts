import { address, UserAgent } from '~/requests/client/config'
import type { WoWServerRegion } from '../WOWScan'

interface PetAuction {
  petID: number
  price: number
  auctionID: number
}
interface ItemAuction {
  itemID: number
  price: number
  auctionID: number
}

interface AddOnData {
  homeRealmName: string
  region: string
  user_auctions: Array<PetAuction | ItemAuction>
}

interface RegionUndercutProps {
  region: WoWServerRegion
  homeRealmId: number
  addonData: Array<AddOnData>
}

interface ImportSearch {
  ROI: number
  avgPrice: number
  connectedRealmIDs: Record<string, string>
  homeRealmID: number
  maxPurchasePrice: number
  profitAmount: number
  region: WoWServerRegion
  salesPerDay: number
  sortBy: string
}

export interface UndercutItems {
  connectedRealmId: number
  item_id: number
  item_name: string
  link: string
  lowest_price: number
  realmName: string
  user_price: number
}

interface ResultByRealm {
  not_found: Array<{
    connectedRealmId: number
    item_id: number
    item_name: string
    link: string
    lowest_auction_id: number
    lowest_price: number
    price_found: boolean
    realmName: string
    undercut: boolean
    user_auction_id: number
    user_price: number
  }>
  realm_info: {
    connectedRealmID: number
    realmName: string
    realmNames: Array<string>
    region: string
  }
  not_undercut: Array<any>
  undercuts: Array<any>
}

type RealmName = string

export interface RegionUndercutResponse {
  import_search_json: ImportSearch
  not_found_list: Array<UndercutItems>
  undercut_list: Array<UndercutItems>
  results_by_realm: Record<RealmName, ResultByRealm>
}

/**
* Sends a POST request to the WoW RegionUndercut API endpoint with specified data.
* @example
* sync({ homeRealmId: 123, region: 'US', addonData: { someKey: 'someValue' } })
* // some sample return value
* @param {object} {homeRealmId, region, addonData} - The data to be sent in the request.
* @returns {Promise<Response>} A promise that resolves to the response from the API.
* @description
*   - Ensure that the address variable is properly defined and points to the correct API base URL.
*   - The request requires JSON-formatted data to be passed in the body.
*   - The 'User-Agent' header must conform to the server's expected value for successful authentication.
*/
const RegionUndercutRequest = async ({
  homeRealmId,
  region,
  addonData
}: RegionUndercutProps) =>
  await fetch(`${address}/api/wow/regionundercut`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': UserAgent
    },
    body: JSON.stringify({
      homeRealmID: homeRealmId,
      region,
      addonData
    })
  })

export default RegionUndercutRequest
