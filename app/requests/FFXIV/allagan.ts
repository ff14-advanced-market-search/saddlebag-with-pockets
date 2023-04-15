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

export interface UndercutAlertJson {
  add_ids: Array<number | string>
  hq_only: boolean
  ignore_data_after_hours: number
  ignore_ids: Array<string | number>
  ignore_undercuts_with_quantity_over: number
  seller_id: string
  server: string
}
export interface SaleAlertJson {
  item_ids: Array<number>
  seller_id: string
  server: string
}
export interface AllaganResults {
  in_bags_report: Array<InBagsReport>
  undercut_alert_json: UndercutAlertJson
  sale_alert_json: SaleAlertJson
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
