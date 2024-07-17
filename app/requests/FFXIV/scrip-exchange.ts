import { address, UserAgent } from '~/requests/client/config'

export interface ScripExchangeProps {
  server: string
  color: string
}

export interface ScripExchange {
  itemID: string
  itemName: string
  cost: number
  minPrice: number
  salesAmountNQ: number
  quantitySoldNQ: number
  valuePerScrip: number
  saddleLink: string
  uniLink: string
  webpage: string
}

export type ScripExchangeResults =
  | {
      data: Array<ScripExchange>
    }
  | { exception: string }
  | {}

const ScripExchangeRequest: ({
  server,
  color
}: ScripExchangeProps) => Promise<Response> = async ({ server, color }) => {
  return fetch(`${address}/api/ffxiv/scripexchange`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': UserAgent
    },
    body: JSON.stringify({
      server,
      color: color
    })
  })
}

export default ScripExchangeRequest
