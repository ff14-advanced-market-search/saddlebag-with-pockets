import { address, UserAgent } from '~/requests/client/config'

export type WoWServerRegion = 'NA' | 'EU'

export interface WOWScanProps {
  homeRealmId: number
  homeRealmServerName: string
  newRealmId: number
  newRealmServerName: string
  minHistoricPrice: number
  roi: number
  salePerDay: number
  itemQuality: number
  requiredLevel: number
  itemClass: number
  itemSubClass: number
  iLvl: number
}

export interface WoWOutOfStock {
  [key: string]: number | string
  historicPrice: number
  itemID: number
  name: string
  price: number
  salesPerDay: number
}

export interface WoWProfitableItems {
  [key: string]: number | string

  historicPrice: number
  home_price: number
  itemID: number
  name: string
  new_price: number
  profit: number
  roi: number
  salesPerDay: number
}

export interface WoWScanResponse {
  out_of_stock: Array<WoWOutOfStock>
  out_w_sales: Array<WoWOutOfStock>
  profit_w_sales: Array<WoWProfitableItems>
  profitable_items: Array<WoWProfitableItems>
}

export type WoWScanResponseWithPayload = WoWScanResponse & {
  payload: WOWScanProps
}

const WOWScan: ({
  homeRealmId,
  newRealmId,
  minHistoricPrice,
  roi,
  salePerDay
}: WOWScanProps) => Promise<Response> = async ({
  homeRealmId,
  newRealmId,
  minHistoricPrice,
  roi,
  salePerDay,
  itemQuality,
  requiredLevel,
  itemClass,
  itemSubClass,
  iLvl
}) => {
  return fetch(`${address}/api/wow/scan`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': UserAgent
    },
    body: JSON.stringify({
      homeRealmId: homeRealmId,
      newRealmId: newRealmId,
      min_historic_price: minHistoricPrice,
      desired_roi: roi,
      sale_per_day: salePerDay,
      itemQuality: itemQuality,
      required_level: requiredLevel,
      item_class: itemClass,
      item_subclass: itemSubClass,
      ilvl: iLvl
    })
  })
}

export default WOWScan
