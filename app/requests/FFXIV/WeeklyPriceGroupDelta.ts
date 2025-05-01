import { address, UserAgent } from '../client/config'
import type { ImportData } from './types'

type PriceGroup = NonNullable<ImportData['price_groups']>[number]

export interface WeeklyPriceGroupDeltaProps {
  region: string
  start_year: number
  start_month: number
  start_day: number
  end_year: number
  end_month: number
  end_day: number
  hq_only: boolean
  price_setting: string
  quantity_setting: string
  price_groups: PriceGroup[]
}

export interface ItemData {
  itemID: number
  itemName: string
  historicPrice: number
  salesPerDay: number
  marketshare: number
  severity: number
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
  const response = await fetch(
    `${address}/api/ffxiv/weekly-price-group-delta`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': UserAgent
      },
      body: JSON.stringify(props)
    }
  )

  if (!response.ok) {
    throw new Error(`Server responded with status ${response.status}`)
  }
  return response
}

export default WeeklyPriceGroupDelta
