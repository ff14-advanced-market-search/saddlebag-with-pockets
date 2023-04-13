import { address, UserAgent } from '~/requests/client/config'

export interface AllaganProps {
  server: string
  allaganJson: Array<{
    Id: number
    Type?: string
    Quantity?: number | string
    Source?: string
    Location: string
  }>
}

export interface InBagsReport {
  [key: string]: number | string | boolean
  hq: boolean
  itemID: string | number
  min_price: number
  name: string
  value: number
}

export interface AllaganResults {
  in_bags_report: Array<InBagsReport>
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
