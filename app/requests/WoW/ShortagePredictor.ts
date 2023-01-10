import { address, UserAgent } from '~/requests/client/config'
import type { WoWServerRegion } from '../WOWScan'

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
}

export interface Prediction {
  avg_quantity: number
  current_avg_price: number
  current_price: number
  current_price_vs_avg_percent: number
  current_quantity: number
  current_quantity_vs_avg_percent: number
  hours_til_shortage: number
  item_id: number
  item_name: string
  quality: number
  quantity_decline_rate_per_hour: number
  tsm_avg_price: number
  tsm_avg_sale_rate_per_hour: number
}

export interface PredictionAuction {
  desired_state: 'above' | 'below'
  itemID: number
  price: number
}

export interface PredictionResponse {
  alert_item_names: Record<string, number>
  alert_json: {
    homeRealmName: string
    region: WoWServerRegion
    user_auctions: Array<PredictionAuction>
  }
  data: Array<Prediction>
}

const WoWShortagePredictor: (
  props: ShortagePredictorProps
) => Promise<Response> = async ({
  desiredAvgPrice,
  desiredSalesPerDay,
  itemQuality,
  itemClass,
  itemSubClass,
  region,
  homeRealmName,
  desiredPriceVsAvgPercent,
  desiredQuantityVsAvgPercent
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
      desired_quantity_vs_avg_percent: desiredQuantityVsAvgPercent
    })
  })
}

export default WoWShortagePredictor
