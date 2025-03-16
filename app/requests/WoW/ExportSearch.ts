import { address, UserAgent } from '~/requests/client/config'
import type { WoWServerRegion } from '../WOWScan'

interface WoWExportSearchProps {
  region: WoWServerRegion
  itemID: number
  populationWP: number
  populationBlizz: number
  rankingWP: number
  minPrice: number
  maxQuantity: number
  sortBy: string
  connectedRealmIDs: Record<string, string>
}

export interface ExportItem {
  [key: string]: any
  connectedRealmID: number
  connectedRealmNames: Array<string>
  itemQuantity: number
  link: string
  minPrice: number
  realmPopulationInt: number
  realmPopulationReal: number
  realmPopulationType: string
  realmRanking: number
  undermineLink: string
}

interface ExportItemInfo {
  avgMinPrice: number
  avgServerQuantity: number
  avgTSMPrice: number
  itemID: number
  itemName: string
  link: string
  medianMinPrice: number
  medianServerQuantity: number
  salesPerDay: number
  totalSelectedServerQuantity: number
  undermineLink: string
  warcraftPetsLink: string
}

export interface WoWExportResponse {
  data: Array<ExportItem>
  itemInfo: ExportItemInfo
}

/**
 * Performs a synchronous fetch request to the WoW export API.
 * @example
 * sync({ region: 'US', itemID: 12345, populationWP: 'high', populationBlizz: 'low', rankingWP: 5, minPrice: 100, maxQuantity: 200, sortBy: 'price', connectedRealmIDs: [1, 2, 3] })
 * some sample return value
 * @param {WoWExportSearchProps} {region, itemID, populationWP, populationBlizz, rankingWP, minPrice, maxQuantity, sortBy, connectedRealmIDs} - Object containing search properties for WoW export.
 * @returns {Promise<Response>} Returns a Promise that resolves to the response of the fetch request.
 * @description
 *   - Sends request as 'POST' method with JSON stringified body to the endpoint.
 *   - Includes content types and user agent in the headers.
 *   - Address endpoint and UserAgent need to be defined elsewhere in the codebase.
 */
const WoWExportSearch = async ({
  region,
  itemID,
  populationWP,
  populationBlizz,
  rankingWP,
  minPrice,
  maxQuantity,
  sortBy,
  connectedRealmIDs
}: WoWExportSearchProps) =>
  fetch(`${address}/api/wow/exportx`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': UserAgent
    },
    body: JSON.stringify({
      region,
      itemID,
      populationWP,
      populationBlizz,
      rankingWP,
      minPrice,
      maxQuantity,
      sortBy,
      connectedRealmIDs
    })
  })

export default WoWExportSearch
