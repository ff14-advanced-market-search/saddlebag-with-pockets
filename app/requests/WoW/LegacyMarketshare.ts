import { address, UserAgent } from '~/requests/client/config'
import type { MarketState } from '../FFXIV/marketshare'
import { WOW_DISCORD_CONSENT } from '~/constants/wowDiscordConsent'

export interface LegacyMarketshareResponse {
  data: Array<LegacyMarketshareItem>
}

export interface LegacyMarketshareItem {
  itemID: number
  itemName: string
  currentMarketValue: number
  historicMarketValue: number
  historicPrice: number
  minPrice: number
  percentChange: number
  salesPerDay: number
  item_class: number
  item_subclass: number
  state: MarketState
}

export type LegacyMarketshareSortBy =
  | 'currentMarketValue'
  | 'historicMarketValue'
  | 'historicPrice'
  | 'minPrice'
  | 'percentChange'
  | 'salesPerDay'

interface LegacyMarketshareProps {
  homeRealmId: number
  desiredAvgPrice: number
  desiredSalesPerDay: number
  itemClass: number
  itemSubClass: number
  sortBy: string
}

const LegacyMarketshare: (
  props: LegacyMarketshareProps
  /**
   * Sends a request to the server to synchronize the legacy market data for World of Warcraft.
   * @example
   * sync({
   *   homeRealmId: 123,
   *   desiredSalesPerDay: 50,
   *   desiredAvgPrice: 100,
   *   itemClass: 'Weapon',
   *   itemSubClass: 'Sword',
   *   sortBy: 'price'
   * })
   * Promise resolves with server response.
   * @param {number} {homeRealmId} - Identifier for the realm to which the request pertains.
   * @param {number} {desiredSalesPerDay} - Target number of sales expected per day.
   * @param {number} {desiredAvgPrice} - Target average price criteria for the items.
   * @param {string} {itemClass} - Primary categorization for the item types.
   * @param {string} {itemSubClass} - Secondary categorization within the item class.
   * @param {string} {sortBy} - Conditions to sort the result set, e.g., by 'price' or 'sales'.
   * @returns {Promise<Response>} Promise resolving to the server's response object.
   * @description
   *   - Endpoint: `${address}/api/wow/legacymarket`.
   *   - Requires authentication headers related to the application's User-Agent.
   *   - Utilizes HTTP POST method for transmitting JSON payloads.
   */
) => Promise<Response> = async ({
  homeRealmId,
  desiredSalesPerDay,
  desiredAvgPrice,
  itemClass,
  itemSubClass,
  sortBy
}) => {
  return fetch(`${address}/api/wow/legacymarket`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': UserAgent
    },
    body: JSON.stringify({
      discord_consent: WOW_DISCORD_CONSENT,
      homeRealmId,
      desired_avg_price: desiredAvgPrice,
      desired_sales_per_day: desiredSalesPerDay,
      item_class: itemClass,
      item_subclass: itemSubClass,
      sort_by: sortBy
    })
  })
}

export default LegacyMarketshare
