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
