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
