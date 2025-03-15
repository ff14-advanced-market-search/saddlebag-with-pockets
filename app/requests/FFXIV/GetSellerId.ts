import { address, UserAgent } from '~/requests/client/config'

export interface SellerIdResponse {
  seller_id: number | null
}

const GetSellerId: ({
  itemId,
  homeServer,
  retainerName
}: {
  itemId: number
  homeServer: string
  retainerName: string
/**
* Sends a POST request to the seller API to fetch seller information.
* @example
* sync({ itemId: 123, homeServer: "ServerName", retainerName: "Retainer" })
* Promise { <state>: "pending" }
* @param {Object} params - An object containing parameters for the request.
* @param {number} params.itemId - The ID of the item in question.
* @param {string} params.homeServer - The name of the home server.
* @param {string} params.retainerName - The name of the retainer.
* @returns {Promise<Response>} A promise that resolves to the response from the server.
* @description
*   - The 'User-Agent' header is required for the request to be accepted by the server.
*   - Ensure that the 'address' variable is correctly defined as the server's base URL.
*   - The function is asynchronous and returns immediately after initiating the fetch operation.
*   - Handles JSON payload serialization internally with `JSON.stringify`.
*/
}) => Promise<Response> = async ({ itemId, homeServer, retainerName }) => {
  return fetch(`${address}/api/seller`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': UserAgent
    },
    body: JSON.stringify({
      item_id: itemId,
      home_server: homeServer,
      retainer_name: retainerName
    })
  })
}

export default GetSellerId
