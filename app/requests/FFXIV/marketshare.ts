import { address, UserAgent } from '~/requests/client/config'

export type MarketshareResult = Array<MarketshareItem>

export interface MarketshareItem {
  avg: number
  itemID: string
  marketValue: number
  median: number
  name: string
  npc_vendor_info: string
  purchaseAmount: number
  quantitySold: number
  url: string
}

export type MarketshareSortBy =
  | 'avg'
  | 'marketValue'
  | 'median'
  | 'purchaseAmount'
  | 'quantitySold'

const GetHistory: ({
  server,
  timePeriod,
  salesAmount,
  averagePrice,
  sortBy,
  filters
}: {
  server: string
  timePeriod: number
  salesAmount: number
  sortBy: MarketshareSortBy
  averagePrice: number
  filters: Array<number>
}) => Promise<Response> = async ({
  server,
  timePeriod,
  salesAmount,
  averagePrice,
  sortBy,
  filters
}) => {
  return fetch(`${address}/api/ffxivmarketshare`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': UserAgent
    },
    body: JSON.stringify({
      server: server,
      time_period: timePeriod,
      sales_amount: salesAmount,
      average_price: averagePrice,
      filters,
      sort_by: sortBy
    })
  })
}

export default GetHistory
