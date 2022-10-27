import { address, UserAgent } from '~/requests/client/config'

export interface WOWScanProps {
  homeRealmId: number
  newRealmId: number
  minHistoricPrice: number
  roi: number
  salePerDay: number
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
  salePerDay
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
      sale_per_day: salePerDay
    })
  })
}

export default WOWScan
