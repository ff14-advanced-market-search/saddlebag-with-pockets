import { address, UserAgent } from '~/requests/client/config'

export interface SelfPurchaseProps {
  server: string
  playerName: string
}

export interface SelfPurchase {
  buyerName: string
  hq: boolean
  itemID: string
  item_name: string
  onMannequin: boolean
  pricePerUnit: number
  quantity: number
  timestamp: number
}

export interface SelfPurchaseResults {
  data: Array<SelfPurchase>
  total_spent: number
}

const SelfPurchaseRequest: ({
  server,
  playerName
}: SelfPurchaseProps) => Promise<Response> = async ({ server, playerName }) => {
  return fetch(`${address}/api/selfpurchase`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': UserAgent
    },
    body: JSON.stringify({
      server,
      player_name: playerName
    })
  })
}

export default SelfPurchaseRequest
