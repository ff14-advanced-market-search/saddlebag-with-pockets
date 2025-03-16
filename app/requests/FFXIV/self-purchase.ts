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

export type SelfPurchaseResults =
  | {
      data: Array<SelfPurchase>
      total_spent: number
    }
  | { exception: string }
  | {}

const SelfPurchaseRequest: ({
  server,
  playerName
}: /**
 * Sends a purchase request to the server for a specific player.
 * @example
 * sync({ server: 'Aether', playerName: 'WarriorOfLight' })
 * A promise resolving to the server response.
 * @param {Object} {server, playerName} - The server name and player name required for making the purchase request.
 * @returns {Promise} A promise that resolves with the response from the fetch API call.
 * @description
 *   - Ensures that the request body is properly formatted as JSON.
 *   - Utilizes the specified server address and user agent for the request.
 */
SelfPurchaseProps) => Promise<Response> = async ({ server, playerName }) => {
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
