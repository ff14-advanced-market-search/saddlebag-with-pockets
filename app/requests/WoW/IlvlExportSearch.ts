import { address, UserAgent } from '~/requests/client/config'
import type { WoWServerRegion } from './WOWScan'
import type { ItemStat } from './IlvlShoppingList'

interface IlvlExportSearchProps {
  region: WoWServerRegion
  itemID: number
  ilvl: number
  desiredStats: ItemStat[]
  populationWP: number
  populationBlizz: number
  rankingWP: number
  sortBy: string
}

export interface ExportItem {
  connectedRealmID: number
  connectedRealmNames: Array<string>
  itemQuantity: number
  minPrice: number
  stats: ItemStat[]
  realmPopulationType: string
  realmPopulationInt: number
  realmPopulationReal: number
  realmRanking: number
  link: string
  undermineLink: string
}

export interface ItemInfo {
  itemID: number
  itemName: string
  ilvl: number
  stats: ItemStat[]
  link: string
  undermineLink: string
  avgMinPrice: number
  medianMinPrice: number
  avgServerQuantity: number
  medianServerQuantity: number
  totalSelectedServerQuantity: number
}

export interface IlvlExportResponse {
  data: ExportItem[]
  itemInfo: ItemInfo
}

/**
 * Sends a request to the ilvlexport API with specified parameters.
 * @example
 * sync({ region: 'US', itemID: 12345, ilvl: 400, desiredStats: ['strength'], populationWP: 1000, populationBlizz: 50000, rankingWP: 20, sortBy: 'rank' })
 * Promise<Response>
 * @param {IlvlExportSearchProps} {Object} - Object containing parameters for the API request.
 * @returns {Promise<Response>} A promise that resolves to the response of the fetch request.
 * @description
 *   - Utilizes POST method for data submission.
 *   - Constructs request body using JSON.stringify.
 *   - Requires a User-Agent header for API interaction.
 */
const IlvlExportSearch = async ({
  region,
  itemID,
  ilvl,
  desiredStats,
  populationWP,
  populationBlizz,
  rankingWP,
  sortBy
}: IlvlExportSearchProps) => {
  return fetch(`${address}/api/wow/ilvlexport`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': UserAgent
    },
    body: JSON.stringify({
      region,
      itemID,
      ilvl,
      desiredStats,
      populationWP,
      populationBlizz,
      rankingWP,
      sortBy
    })
  })
}

export default IlvlExportSearch
