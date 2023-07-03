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

interface ExportItem {
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

export interface WoWExportResponse {
  data: Array<ExportItem>
}

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
  fetch(`${address}/api/wow/export`, {
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
