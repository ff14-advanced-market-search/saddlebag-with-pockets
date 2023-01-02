import { address, UserAgent } from '~/requests/client/config'
import type { WoWServerRegion } from '../WOWScan'

interface StatLookupProps {
  homeRealmId: number
  region: WoWServerRegion
  commodity: boolean
  desiredAvgPrice: number
  desiredSalesPerDay: number
  itemQuality: number
  requiredLevel: number
  itemClass: number
  itemSubclass: number
  iLvl: number
}

const WOWScan: (props: StatLookupProps) => Promise<Response> = async ({
  homeRealmId,
  itemQuality,
  desiredSalesPerDay,
  region,
  commodity,
  desiredAvgPrice,
  requiredLevel,
  itemClass,
  itemSubclass,
  iLvl
}) => {
  return fetch(`${address}/api/wow/itemstats`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': UserAgent
    },
    body: JSON.stringify({
      homeRealmId,
      region,
      commodity,
      desired_avg_price: desiredAvgPrice,
      desired_sales_per_day: desiredSalesPerDay,
      itemQuality,
      required_level: requiredLevel,
      item_class: itemClass,
      item_subclass: itemSubclass,
      ilvl: iLvl
    })
  })
}

export default WOWScan
