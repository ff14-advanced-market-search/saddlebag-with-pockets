import { address, UserAgent } from '~/requests/client/config'

interface ItemListingsProps {
  itemID: number
}

export interface BuyOrder {
  unit_price: number
  quantity: number
}

export interface SellOrder {
  unit_price: number
  quantity: number
}

export interface TimeDataPoint {
  sell_price_avg: number
  sell_quantity_avg: number
  sell_sold: number
  sell_value: number
  sell_delisted: number
  sell_listed: number
  buy_price_avg: number
  buy_quantity_avg: number
  buy_sold: number
  buy_value: number
  buy_delisted: number
  buy_listed: number
  date: string
  count: number
}

export interface ExtraData {
  sell_delisted: number
  sell_listed: number
  sell_price_max: number
  sell_price_min: number
  sell_price_stdev: number
  sell_quantity_avg: number
  sell_quantity_max: number
  sell_quantity_min: number
  sell_quantity_stdev: number
  buy_delisted: number
  buy_listed: number
  buy_price_max: number
  buy_price_min: number
  buy_price_stdev: number
  buy_quantity_avg: number
  buy_quantity_max: number
  buy_quantity_min: number
  buy_quantity_stdev: number
  count: number
}

export interface ItemListingData {
  itemID: number
  itemName: string
  type: number
  blog: string
  buys: BuyOrder[]
  sells: SellOrder[]
  sold: number
  price_average: number
  value: number
  sell_price_avg: number
  sell_sold: number
  sell_value: number
  buy_sold: number
  buy_price_avg: number
  buy_value: number
  date: string
  timeData: TimeDataPoint[]
  extraData: ExtraData
}

export interface ItemListingResponse {
  data: ItemListingData
}

const ItemListingsData: (
  props: ItemListingsProps
) => Promise<Response> = async ({ itemID }) => {
  return fetch(`${address}/api/gw2/listings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': UserAgent
    },
    body: JSON.stringify({
      itemID
    })
  })
}

export default ItemListingsData
