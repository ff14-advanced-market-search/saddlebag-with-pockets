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
  data: Array<ExportItem>
  itemInfo: ItemInfo
}

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