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

export interface ServerDistribution {
  [key: string]: number
}

export interface HistoryResponse {
  itemID: number
  average_ppu: number
  median_ppu: number
  average_quantity_sold_per_day: number
  average_sales_per_day: number
  total_quantity_sold: number
  total_purchase_amount: number
  home_server_sales_by_hour_chart: Array<HomeServerSalesByHour>
  price_history: Array<PriceHistory>
  stack_chance: Array<StackChance>
  dirty_sales: Array<DirtySale>
  server_distribution: ServerDistribution
  payload: GetHistoryProps
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
}: /**
 * Sends a POST request to fetch historical data for a specific item from a server.
 * @example
 * GetHistory({ itemId: 12345, world: 'Cerberus', initialDays: 10, endDays: 5, itemType: 'weapon' })
 * Promise(response)
 * @param {Object} {itemId, world, initialDays, endDays, itemType} - Configuration object containing parameters for the request.
 * @returns {Promise} A promise representing the completion of the fetch operation, containing the server response.
 * @description
 *   - Utilizes a specified home server to gather item history data.
 *   - Allows customization of the time range with `initialDays` and `endDays`.
 *   - Supports filtering by item type, defaulting to 'all'.
 *   - Ensures communication uses JSON format and includes a user-agent for identification.
 */
GetHistoryProps) => Promise<Response> = async ({
  itemId,
  world,
  initialDays = 7,
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
