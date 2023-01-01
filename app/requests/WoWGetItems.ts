import { address, UserAgent } from '~/requests/client/config'

export type GetItemResponse = Record<string, string>

const WoWGetItems: () => Promise<Response> = async () => {
  return fetch(`${address}/api/wow/itemnames`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': UserAgent,
      'Cache-Control': 'max-age=1800'
    },
    body: JSON.stringify({})
  })
}

export default WoWGetItems
