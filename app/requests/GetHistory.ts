import { address, UserAgent } from '~/requests/client/config'

export interface DirtySale {
  buyerName: string
  hq: boolean
  human_timestamp: string
  itemID: number
  onMannequin: boolean
  pricePerUnit: number
  quantity: number
  realName: string
  server: string
  timestamp: number
}

export interface HomeServerSalesByHour {
  sale_amt: number
  time: number
}

export interface PriceHistory {
  price_range: string
  sales_amount: number
}

export interface StackChance {
  average_price_for_size: number
  number_of_sales: number
  percent_of_sales: number
  percent_of_total_quantity_sold: number
  stack_size: number
}

export interface HistoryResponse {
  average_ppu: number
  median_ppu: number
  average_quantity_sold_per_day: number
  average_sales_per_day: number
  total_quantity_sold: number
  home_server_sales_by_hour_chart: Array<HomeServerSalesByHour>
  price_history: Array<PriceHistory>
  stack_chance: Array<StackChance>
  dirty_sales: Array<DirtySale>
}

export type GetHistoryResponse =
  | HistoryResponse
  | {
      exception: string
    }

export interface GetHistoryProps {
  itemId: number
  world: string
  initialDays?: number
  endDays?: number
  itemType?: 'all' | 'hq_only' | 'nq_only'
}

const GetHistory: ({
  itemId,
  world,
  initialDays,
  endDays,
  itemType
}: GetHistoryProps) => Promise<Response> = async ({
  itemId,
  world,
  initialDays = 14,
  endDays = 0,
  itemType = 'all'
}) => {
  return fetch(`${address}/api/history`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': UserAgent
    },
    body: JSON.stringify({
      item_id: itemId,
      home_server: world,
      initial_days: initialDays,
      end_days: endDays,
      item_type: itemType
    })
  })
}

export default GetHistory
