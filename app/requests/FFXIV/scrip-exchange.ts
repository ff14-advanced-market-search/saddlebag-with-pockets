import { address, UserAgent } from '~/requests/client/config'

export interface ScripExchangeProps {
  home_server: string
  color: string
}

export interface ScripExchange {
  itemID: number
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

export type ScripExchangeResults = ScripExchange[]

/**
 * Sends a POST request to retrieve Scrip Exchange results for Final Fantasy XIV.
 * @example
 * sync({ home_server: "ServerName", color: "red" })
 * Promise<ScripExchangeResults>
 * @param {ScripExchangeProps} {home_server, color} - Contains the server name and color for the request.
 * @returns {Promise<ScripExchangeResults>} Returns a promise that resolves with the Scrip Exchange results as JSON.
 * @description
 *   - Requires a valid server name and color as input parameters.
 *   - Throws an error if the network response is not ok.
 *   - Uses JSON format for both request payload and response.
 *   - The function utilizes async/await for handling asynchronous operations.
 */
export const ScripExchangeRequest = async ({
  home_server,
  color
}: ScripExchangeProps): Promise<ScripExchangeResults> => {
  const response = await fetch(`${address}/api/ffxiv/scripexchange`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': UserAgent
    },
    body: JSON.stringify({ home_server, color })
  })

  if (!response.ok) {
    throw new Error('Network response was not ok')
  }

  return response.json()
}
