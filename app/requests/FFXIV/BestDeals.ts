import { address, UserAgent } from '~/requests/client/config'

export interface BestDealsProps {
  home_server: string
  discount: number
  medianPrice: number
  salesAmount: number
  maxBuyPrice: number
  filters: number[]
  hq_only: boolean
}

export interface DealItem {
  itemID: number
  itemName: string
  minPrice: number
  lastUploadTime: number
  mainCategory: number
  subCategory: number
  medianNQ: number
  averageNQ: number
  salesAmountNQ: number
  quantitySoldNQ: number
  medianHQ: number
  averageHQ: number
  salesAmountHQ: number
  quantitySoldHQ: number
  worldName: string
  itemData: string
  uniLink: string
  discount: number
}

export interface BestDealsResponse {
  data: DealItem[]
}

const FFXIVBestDeals: (
  props: BestDealsProps
  /**
   * Sends a POST request to the 'bestdeals' API endpoint with specified parameters.
   *
   * @example
   * sync({
   *   home_server: "Adamantoise",
   *   filters: [0],
   *   hq_only: false,
   *   discount: 70,
   *   medianPrice: 50000,
   *   salesAmount: 20,
   *   maxBuyPrice: 20000
   * })
   *
   * @returns {Promise<Response>} A promise that resolves to the API response object.
   */
) => Promise<Response> = async (props) => {
  return fetch(`${address}/api/ffxiv/bestdeals`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': UserAgent
    },
    body: JSON.stringify(props)
  })
}

export default FFXIVBestDeals
