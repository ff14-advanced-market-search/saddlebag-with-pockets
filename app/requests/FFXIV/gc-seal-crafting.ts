import { address, UserAgent } from '~/requests/client/config'

export type GcSealCraftingMaterialMetric = 'median' | 'average'

export interface GcSealCraftingProps {
  home_server: string
  material_price_metric: GcSealCraftingMaterialMetric
  max_material_cost: number
  jobs: number[]
}

export interface GcSealCraftingRow {
  itemID: number
  itemName: string
  itemLevel: number
  craftCostGil: number
  seals: number
  gcSealsPerGil: number
  gcExperience: number
}

export type GcSealCraftingResults = GcSealCraftingRow[]

export const GcSealCraftingRequest = async (
  body: GcSealCraftingProps
): Promise<GcSealCraftingResults> => {
  const response = await fetch(`${address}/api/ffxiv/gcsealcrafting`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': UserAgent
    },
    body: JSON.stringify(body)
  })

  if (!response.ok) {
    throw new Error('Network response was not ok')
  }

  const json = (await response.json()) as { data?: GcSealCraftingResults }

  if (!json.data || !Array.isArray(json.data)) {
    throw new Error('Unexpected API response shape')
  }

  return json.data
}
