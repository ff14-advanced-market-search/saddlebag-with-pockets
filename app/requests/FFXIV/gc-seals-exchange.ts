import { address, UserAgent } from '~/requests/client/config'

export interface GcSealsExchangeProps {
  home_server: string
  max_item_cost: number
  region_wide: boolean
}

export interface GcSealsExchangeRow {
  itemID: number
  itemName: string
  itemLevel: number
  listingServer: string
  price: number
  seals: number
  gcSealsPerGil: number
  gcExperience: number
}

export type GcSealsExchangeResults = GcSealsExchangeRow[]

export const GcSealsExchangeRequest = async (
  body: GcSealsExchangeProps
): Promise<GcSealsExchangeResults> => {
  const response = await fetch(`${address}/api/ffxiv/gcsealsexchange`, {
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

  const json = (await response.json()) as { data?: GcSealsExchangeResults }

  if (!json.data || !Array.isArray(json.data)) {
    throw new Error('Unexpected API response shape')
  }

  return json.data
}
