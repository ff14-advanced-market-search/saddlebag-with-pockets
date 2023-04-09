import { address, UserAgent } from '~/requests/client/config'

export interface AllaganProps {
  server: string
  allaganJson: Array<{
    Id: number
    Name: string
    'MB Average Price NQ/HQ': string
    Type: string
    Quantity: number
    Source: string
    Location: string
  }>
}

const AllaganRequest: ({
  server,
  allaganJson
}: AllaganProps) => Promise<Response> = async ({ server, allaganJson }) => {
  return fetch(`${address}/api/parseallagan`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': UserAgent
    },
    body: JSON.stringify({
      server: server,
      allagan_json_data: allaganJson
    })
  })
}

export default AllaganRequest
