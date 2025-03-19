import { address, UserAgent } from '~/requests/client/config'
import type { WoWServerRegion } from './WOWScan'

export interface ShortagePredictorProps {
  desiredAvgPrice: number
  desiredSalesPerDay: number
  itemQuality: number
  itemClass: number
  itemSubClass: number
  region: WoWServerRegion
  homeRealmName: string
  desiredPriceVsAvgPercent: number
  desiredQuantityVsAvgPercent: number
  expansionNumber: number
}

export interface Prediction {
  item_name: string
  current_price: number
  current_avg_price: number
  current_price_vs_avg_percent: number
  current_quantity: number
  avg_quantity: number
  current_quantity_vs_avg_percent: number
  hours_til_shortage: number
  item_id: number
  quality: number
  quantity_decline_rate_per_hour: number
  tsm_avg_price: number
  tsm_avg_sale_rate_per_hour: number
  chart_p: Array<number>
  chart_q: Array<number>
}

export interface PredictionAuction {
  desired_state: 'above' | 'below'
  itemID: number
  price: number
}

export interface AlertJson {
  homeRealmName: string
  region: WoWServerRegion
  user_auctions: Array<PredictionAuction>
}

export interface PredictionResponse {
  alert_item_names: Record<string, number>
  alert_json: AlertJson
  data: Array<Prediction>
}

const WoWShortagePredictor: (
  props: ShortagePredictorProps
  /**
   * Sends a POST request to the 'commodityfutures' API endpoint with specified parameters.
   *
   * @example
   * sync({
   *   desiredAvgPrice: 100,
   *   desiredSalesPerDay: 50,
   *   itemQuality: 2,
   *   itemClass: 4,
   *   itemSubClass: 1,
   *   region: 'us',
   *   homeRealmName: 'realmName',
   *   desiredPriceVsAvgPercent: 10,
   *   desiredQuantityVsAvgPercent: 20,
   *   expansionNumber: 2
   * })
   *
   * @param {number} desiredAvgPrice - The average price that is desired for the item.
   * @param {number} desiredSalesPerDay - The desired number of sales per day for the item.
   * @param {number} itemQuality - Quality rating of the item.
   * @param {number} itemClass - Class ID of the item.
   * @param {number} itemSubClass - Subclass ID of the item.
   * @param {string} region - The region where the query is to be made.
   * @param {string} homeRealmName - Name of the home realm.
   * @param {number} desiredPriceVsAvgPercent - Desired price comparison to the average price in percentage.
   * @param {number} desiredQuantityVsAvgPercent - Desired quantity comparison to the average quantity in percentage.
   * @param {number} expansionNumber - The expansion number related to the item.
   *
   * @returns {Promise<Response>} A promise that resolves to the API response object.
   *
   * @description
   *   - The function utilizes the fetch API to perform HTTP requests.
   *   - Ensure network connectivity for the API call to succeed.
   *   - The User-Agent header is set for the request.
   *   - JSON.stringify is used to convert the payload into JSON format.
   */
) => Promise<Response> = async ({
  desiredAvgPrice,
  desiredSalesPerDay,
  itemQuality,
  itemClass,
  itemSubClass,
  region,
  homeRealmName,
  desiredPriceVsAvgPercent,
  desiredQuantityVsAvgPercent,
  expansionNumber
}) => {
  return fetch(`${address}/api/wow/commodityfutures`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': UserAgent
    },
    body: JSON.stringify({
      desired_avg_price: desiredAvgPrice,
      desired_sales_per_day: desiredSalesPerDay,
      itemQuality,
      item_class: itemClass,
      item_subclass: itemSubClass,
      region,
      homeRealmName,
      desired_price_vs_avg_percent: desiredPriceVsAvgPercent,
      desired_quantity_vs_avg_percent: desiredQuantityVsAvgPercent,
      expansionNumber: expansionNumber
    })
  })
}

export default WoWShortagePredictor
