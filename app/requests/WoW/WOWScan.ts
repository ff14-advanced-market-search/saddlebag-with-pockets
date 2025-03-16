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
/**
* Sends a POST request to scan World of Warcraft items based on specific parameters.
* @example
* sync({
*   homeRealmId: 1,
*   newRealmId: 2,
*   minHistoricPrice: 100,
*   roi: 1.2,
*   salePerDay: 3,
*   itemQuality: 4,
*   requiredLevel: 10,
*   itemClass: 'Weapon',
*   itemSubClass: 'Sword',
*   iLvl: 100
* })
* Fetches the data while meeting specified conditions
* @param {number} homeRealmId - Identifies the home realm for the query.
* @param {number} newRealmId - Identifies the target realm for searching.
* @param {number} minHistoricPrice - Minimum historical price of the item.
* @param {number} roi - Desired return on investment.
* @param {number} salePerDay - Average sale per day of the item.
* @param {number} itemQuality - Quality rating of the item, higher is better.
* @param {number} requiredLevel - Minimum level required to use the item.
* @param {string} itemClass - General classification of the item.
* @param {string} itemSubClass - Detailed classification within the item class.
* @param {number} iLvl - Item level denoting its strength.
* @returns {Promise<Response>} The response object from the fetch API.
* @description
*   - The function communicates with a predefined server endpoint.
*   - JSON.stringify is used to serialize the body parameters.
*   - The 'User-Agent' header is set specifically for identifying client application.
*   - All communication is done over POST method ensuring data submission.
*/
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
