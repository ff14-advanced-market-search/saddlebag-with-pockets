import { address, UserAgent } from '../client/config'

export interface PriceGroup {
  name: string
  item_ids: number[]
  categories: Array<{
    item_class: number
    item_subclass: number
    expansion_number: number
    min_quality: number
    commodity_type?: string
  }>
}

export interface WeeklyPriceGroupDeltaProps {
  region: string
  start_year: number
  start_month: number
  start_day: number
  price_groups: PriceGroup[]
}

export interface ItemData {
  itemID: number
  itemName: string
  historicPrice: number
  salesPerDay: number
  marketshare: number
  weekly_data: Array<{
    p: number // price
    q: number // quantity
    t: number // timestamp
    delta: number // price change %
  }>
}

export interface GroupData {
  deltas: Record<string, number>
  item_names: Record<string, string>
  item_data: Record<string, ItemData>
}

export interface WeeklyPriceGroupDeltaResponse {
  [groupName: string]: GroupData
}

const WeeklyPriceGroupDelta = async (
  props: WeeklyPriceGroupDeltaProps
): Promise<Response> => {
  const response = await fetch(`${address}/api/wow/weekly-price-group-delta`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': UserAgent
    },
    body: JSON.stringify(props)
  })

  if (!response.ok) {
    throw new Error(`Server responded with status ${response.status}`)
  }
  return response
}

export default WeeklyPriceGroupDelta
