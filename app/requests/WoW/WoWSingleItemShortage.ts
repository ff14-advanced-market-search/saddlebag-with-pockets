import { address, UserAgent } from '~/requests/client/config'

export interface WOWSingleItemShortageProps {
  desiredAvgPrice: number
  desiredSalesPerDay: number
  desiredPriceIncrease: number
  desiredSellPrice: number
  flipRiskLimit: number
  itemQuality: number
  itemClass: number
  itemSubClass: number
  iLvl: number
  requiredLevel: number
  homeRealmId: number
  underMarketPricePercent: number
  overMarketPricePercent: number
}

const WoWSingleItemShortage: ({
  desiredAvgPrice,
  desiredSalesPerDay,
  desiredPriceIncrease,
  desiredSellPrice,
  flipRiskLimit,
  itemQuality,
  itemClass,
  itemSubClass,
  iLvl,
  requiredLevel,
  homeRealmId,
  underMarketPricePercent,
  overMarketPricePercent
/**
* Sends a POST request to the WoW API for single item shortage data.
* @example
* sync({
*   desiredAvgPrice: 100,
*   desiredSalesPerDay: 5,
*   desiredPriceIncrease: 10,
*   desiredSellPrice: 120,
*   flipRiskLimit: 2,
*   itemQuality: 3,
*   itemClass: 4,
*   itemSubClass: 5,
*   iLvl: 50,
*   requiredLevel: 40,
*   homeRealmId: 1,
*   underMarketPricePercent: 20,
*   overMarketPricePercent: 25
* })
* // returns a Promise resolving to the API response
* @param {number} desiredAvgPrice - The average price desired for the item.
* @param {number} desiredSalesPerDay - The desired number of sales per day.
* @param {number} desiredPriceIncrease - The desired increase in price.
* @param {number} desiredSellPrice - The desired selling price.
* @param {number} flipRiskLimit - Risk limit for flipping items.
* @param {number} itemQuality - Quality of the item.
* @param {number} itemClass - Class of the item.
* @param {number} itemSubClass - Subclass of the item.
* @param {number} iLvl - Item level.
* @param {number} requiredLevel - The required level to use the item.
* @param {number} homeRealmId - ID of the home realm.
* @param {number} underMarketPricePercent - Percentage under market price.
* @param {number} overMarketPricePercent - Percentage over market price.
* @returns {Promise<Response>} A promise resolving to the fetch API response object.
* @description
*   - Communicates with the API endpoint at `${address}/api/wow/single`.
*   - Requires `UserAgent` to be defined in the scope for headers.
*   - Converts the input parameters into a JSON string for the POST request body.
*/
}: WOWSingleItemShortageProps) => Promise<Response> = async ({
  desiredAvgPrice,
  desiredSalesPerDay,
  desiredPriceIncrease,
  desiredSellPrice,
  flipRiskLimit,
  itemQuality,
  itemClass,
  itemSubClass,
  iLvl,
  requiredLevel,
  homeRealmId,
  underMarketPricePercent,
  overMarketPricePercent
}) => {
  return fetch(`${address}/api/wow/single`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': UserAgent
    },
    body: JSON.stringify({
      desired_avg_price: desiredAvgPrice,
      desired_sales_per_day: desiredSalesPerDay,
      desired_price_increase: desiredPriceIncrease,
      desired_sell_price: desiredSellPrice,
      flip_risk_limit: flipRiskLimit,
      itemQuality: itemQuality,
      item_class: itemClass,
      item_subclass: itemSubClass,
      ilvl: iLvl,
      required_level: requiredLevel,
      homeRealmId,
      under_market_price_percent: underMarketPricePercent,
      over_market_price_percent: overMarketPricePercent
    })
  })
}

export default WoWSingleItemShortage
