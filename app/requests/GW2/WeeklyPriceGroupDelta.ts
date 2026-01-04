import { address, UserAgent } from '../client/config'

export interface GW2PriceGroup {
  name: string
  item_ids: number[]
  types: number[] // Can be GW2 types or details_types
}

export interface GW2WeeklyPriceGroupDeltaProps {
  start_year: number
  start_month: number
  start_day: number
  end_year: number
  end_month: number
  end_day: number
  minimum_value: number
  minimum_sales: number
  minimum_average_price: number
  price_groups: GW2PriceGroup[]
}

export interface GW2ItemData {
  itemName: string
  itemID: number
  weekly_data: Array<{
    itemID: number
    time: number // timestamp like 2025110300
    value: number
    sold: number
    price_average: number
    sell_sold: number
    sell_price_avg: number
    sell_value: number
    sell_delisted: number
    sell_listed: number
    sell_quantity_avg: number
    buy_sold: number
    buy_price_avg: number
    buy_value: number
    buy_delisted: number
    buy_listed: number
    buy_quantity_avg: number
    delta: number // price change %
  }>
}

export interface GW2GroupData {
  deltas: Record<string, number> // timestamp -> delta %
  item_names: Record<string, string> // itemID -> name
  item_data: Record<string, GW2ItemData> // itemID -> item data
}

export interface GW2WeeklyPriceGroupDeltaResponse {
  [groupName: string]: GW2GroupData
}

const GW2WeeklyPriceGroupDelta = async (
  props: GW2WeeklyPriceGroupDeltaProps
): Promise<Response> => {
  const response = await fetch(`${address}/api/gw2/weekly-price-group-delta`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': UserAgent
    },
    body: JSON.stringify(props)
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(
      `Server responded with status ${response.status}: ${errorText}`
    )
  }
  return response
}

export default GW2WeeklyPriceGroupDelta
