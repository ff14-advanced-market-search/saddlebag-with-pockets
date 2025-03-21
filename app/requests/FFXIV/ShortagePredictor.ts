import { address, UserAgent } from '~/requests/client/config'

export interface ShortagePredictorProps {
  homeServer: string
  filters: number[]
  hqOnly: boolean
  desiredMedianPrice: number
  desiredSalesPerWeek: number
  desiredPriceVsMedianPercent: number
  desiredQuantityVsAvgPercent: number
}

export interface Prediction {
  item_id: number
  item_name: string
  main_category?: number
  sub_category?: number
  npc_vendor_uid: string | null
  npc_vendor_price: number | null
  median_nq: number
  median_hq: number
  average_price_nq: number
  average_price_hq: number
  sales_amount_nq: number
  sales_amount_hq: number
  quantity_sold_nq: number
  quantity_sold_hq: number
  current_price: number
  median_price: number
  current_avg_price: number
  current_price_vs_median_percent: number
  avg_quantity: number
  current_quantity: number
  current_quantity_vs_avg_percent: number
  avg_sale_rate_per_hour: number
  hours_til_shortage: number
  quantity_decline_rate_per_hour: number
  chart_q: number[]
  chart_p: number[]
}

export interface PredictionResponse {
  data: Array<Prediction>
}

const FFXIVShortagePredictor: (
  props: ShortagePredictorProps
  /**
   * Sends a POST request to the 'shortagefutures' API endpoint with specified parameters.
   *
   * @example
   * sync({
   *   homeServer: "Adamantoise",
   *   filters: [0],
   *   hqOnly: false,
   *   desiredMedianPrice: 500,
   *   desiredSalesPerWeek: 400,
   *   desiredPriceVsMedianPercent: 140,
   *   desiredQuantityVsAvgPercent: 50
   * })
   *
   * @param {string} homeServer - The home server to check prices on
   * @param {number[]} filters - Array of filter IDs to apply
   * @param {boolean} hqOnly - Whether to only show HQ items
   * @param {number} desiredMedianPrice - The minimum median price to look for
   * @param {number} desiredSalesPerWeek - The minimum number of sales per week
   * @param {number} desiredPriceVsMedianPercent - Maximum current price vs median price percentage
   * @param {number} desiredQuantityVsAvgPercent - Maximum current quantity vs average quantity percentage
   *
   * @returns {Promise<Response>} A promise that resolves to the API response object.
   */
) => Promise<Response> = async ({
  homeServer,
  filters,
  hqOnly,
  desiredMedianPrice,
  desiredSalesPerWeek,
  desiredPriceVsMedianPercent,
  desiredQuantityVsAvgPercent
}) => {
  return fetch(`${address}/api/ffxiv/shortagefutures`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': UserAgent
    },
    body: JSON.stringify({
      home_server: homeServer,
      filters,
      hq_only: hqOnly,
      desired_median_price: desiredMedianPrice,
      desired_sales_per_week: desiredSalesPerWeek,
      desired_price_vs_median_percent: desiredPriceVsMedianPercent,
      desired_quantity_vs_avg_percent: desiredQuantityVsAvgPercent
    })
  })
}

export default FFXIVShortagePredictor
