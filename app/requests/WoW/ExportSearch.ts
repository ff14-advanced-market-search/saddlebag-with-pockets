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
