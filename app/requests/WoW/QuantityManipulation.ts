import { address, UserAgent } from '~/requests/client/config'
import type { WoWServerRegion } from './WOWScan'
import { WOW_DISCORD_CONSENT } from '~/constants/wowDiscordConsent'

export interface QuantityManipulationProps {
  historicPrice: number
  salesPerDay: number
  minQuantityChangePercent: number
  minQuantitySwings: number
  hoursToAnalyze: number
  minPriceMultiplier: number
  itemQuality: number
  itemClass: number
  itemSubClass: number
  region: WoWServerRegion
  homeRealmName: string
  expansionNumber: number
}

export interface ManipulationItem {
  item_id: number
  item_name: string
  avg_quantity: number
  max_quantity: number
  min_quantity: number
  max_quantity_spike_percent: number
  max_quantity_drop_percent: number
  volatility: number
  suspicious_quantity_change_amount: number
  historic_price: number
  sales_per_day: number
  min_price: number
  max_price: number
  price_multiplier: number
  current_price: number
  quantity_history: Array<number>
  price_history: Array<number>
}

export interface ManipulationResponse {
  data: Array<ManipulationItem>
}

export interface ErrorElement {
  name: string
  type_error: string
  expected: string
  payload: string
}

export interface ErrorResponse {
  Type: string
  Message: string
  Elements?: Array<ErrorElement>
}

const WoWQuantityManipulation = async ({
  historicPrice,
  salesPerDay,
  minQuantityChangePercent,
  minQuantitySwings,
  hoursToAnalyze,
  minPriceMultiplier,
  itemQuality,
  itemClass,
  itemSubClass,
  region,
  homeRealmName,
  expansionNumber
}: QuantityManipulationProps): Promise<Response> => {
  const response = await fetch(`${address}/api/wow/quantity-manipulation`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': UserAgent
    },
    body: JSON.stringify({
      discord_consent: WOW_DISCORD_CONSENT,
      region,
      itemQuality,
      historicPrice,
      salesPerDay,
      min_quantity_change_percent: minQuantityChangePercent,
      min_quantity_swings: minQuantitySwings,
      hours_to_analyze: hoursToAnalyze,
      min_price_multiplier: minPriceMultiplier,
      item_class: itemClass,
      item_subclass: itemSubClass,
      expansion_number: expansionNumber
    })
  })

  if (!response.ok) {
    const errorData = (await response.json()) as ErrorResponse
    return new Response(JSON.stringify(errorData), {
      status: response.status,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  return response
}

export default WoWQuantityManipulation
