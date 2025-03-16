import { address, UserAgent } from '~/requests/client/config'

export type MarketshareResult = Array<MarketshareItem>

export type MarketState =
  | 'spiking'
  | 'increasing'
  | 'stable'
  | 'decreasing'
  | 'crashing'
  | 'out of stock'

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
  minPrice: number
  percentChange: number
  state: MarketState
}

export const marketShareSortBys = [
  'avg',
  'marketValue',
  'median',
  'purchaseAmount',
  'quantitySold',
  'minPrice',
  'percentChange'
] as const

export type MarketshareSortBy = (typeof marketShareSortBys)[number]

export interface MarketshareProps {
  server: string
  timePeriod: number
  salesAmount: number
  sortBy: MarketshareSortBy
  averagePrice: number
  filters: Array<number>
}

const MarketShare: ({
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
/**
* Sends a POST request to the server for fetching market share data of FFXIV.
* @example
* sync({ server: 'Balmung', timePeriod: 'weekly', salesAmount: 1500, averagePrice: 500, sortBy: 'price', filters: {} })
* Returns a promise resolving to the server's response.
* @param {Object} params - An object containing the necessary parameters.
* @param {string} params.server - The name of the server to query data from.
* @param {string} params.timePeriod - The time period for which data is fetched.
* @param {number} params.salesAmount - The amount of sales to consider.
* @param {number} params.averagePrice - The average price to filter the results by.
* @param {string} params.sortBy - The parameter by which to sort the results.
* @param {Object} params.filters - Additional filters to apply on the data.
* @returns {Promise<Response>} A promise resolving to the response from the fetch request.
* @description
*   - Sends a POST HTTP request with specified content headers.
*   - Converts the parameters to a JSON string for the request body.
*   - The endpoint is specified by `address` which is assumed to be defined globally.
*   - Utilizes a fixed 'User-Agent' for all requests.
*/
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

export default MarketShare
