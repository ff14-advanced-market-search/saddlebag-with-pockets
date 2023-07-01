import { address, UserAgent } from '~/requests/client/config'
import type { WoWServerRegion } from '../WOWScan'

interface PetImportProps {
  region: WoWServerRegion
  homeRealmId: number
  connectedRealmIds: Record<string, string>
  roi: number
  profitAmount: number
  maxPurchasePrice: number
  salesPerDay: number
  avgPrice: number
  includeCategories: Array<string | number>
  excludeCategories: Array<string | number>
  sortBy: string
}

interface PetImport {
  ROI: number
  avgPriceTSM: number
  itemID: number
  itemName: string
  undermineLink: string
  warcraftPetsLink: string
  lowestPrice: number
  lowestPriceRealmID: number
  lowestPriceRealmName: string
  minPrice: number
  profitAmount: number
  salesPerDay: number
}

export interface PetImportResponse {
  data: Array<PetImport>
}

const PetImportRequest = async ({
  homeRealmId,
  region,
  connectedRealmIds,
  roi,
  profitAmount,
  maxPurchasePrice,
  salesPerDay,
  avgPrice,
  includeCategories,
  excludeCategories,
  sortBy
}: PetImportProps) =>
  await fetch(`${address}/api/wow/petimport`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': UserAgent
    },
    body: JSON.stringify({
      region,
      homeRealmID: homeRealmId,
      connectedRealmIDs: connectedRealmIds,
      ROI: roi,
      profitAmount,
      maxPurchasePrice,
      salesPerDay,
      avgPrice,
      includeCategories,
      excludeCategories,
      sortBy
    })
  })

export default PetImportRequest
