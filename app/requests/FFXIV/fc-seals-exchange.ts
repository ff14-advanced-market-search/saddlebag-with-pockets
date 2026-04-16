import { address, UserAgent } from '~/requests/client/config'

export interface FcSealsExchangeProps {
  home_server: string
  max_item_cost: number
  region_wide: boolean
}

export interface FcSealsExchangeRow {
  itemID: number
  itemName: string
  itemLevel: number
  listingServer: string
  price: number
  seals: number
  fcCredits: number
  creditsPerGil: number
  fcExperience: number
}

export type FcSealsExchangeResults = FcSealsExchangeRow[]

export const FcSealsExchangeRequest = async (
  body: FcSealsExchangeProps
): Promise<FcSealsExchangeResults> => {
  const response = await fetch(`${address}/api/ffxiv/fcsealsexchange`, {
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

  const json = (await response.json()) as { data?: FcSealsExchangeResults }

  if (!json.data || !Array.isArray(json.data)) {
    throw new Error('Unexpected API response shape')
  }

  return json.data
}
