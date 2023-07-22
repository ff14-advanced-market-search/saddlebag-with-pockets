import { address, UserAgent } from '~/requests/client/config'
const defaults = {
  preferred_roi: 50,
  min_profit_amount: 10000,
  min_desired_avg_ppu: 10000,
  min_stack_size: 1,
  hours_ago: 24,
  min_sales: 5,
  hq: false,
  home_server: 'Midgardsormr',
  filters: [0],
  region_wide: false,
  include_vendor: false,
  show_out_stock: false,
  universalis_list_uid: ''
}
export type FullScanInput = typeof defaults

export interface FullScanForm {
  sale_amount?: number
  minimum_stack_size?: number
  minimum_profit_amount?: number
  price_per_unit?: number
  roi?: number
  scan_hours?: number
  world?: string
  universalis_list_uid?: string
  hq_only?: boolean
  out_of_stock?: boolean
  include_vendor?: boolean
  region_wide?: boolean
  filters?: Array<number>
}

const keyMap: (key: string) => string = (key) => {
  switch (key) {
    case 'sale_amount':
      return 'min_sales'
    case 'world':
      return 'home_server'
    case 'minimum_stack_size':
      return 'min_stack_size'
    case 'hq_only':
      return 'hq'
    case 'minimum_profit_amount':
      return 'min_profit_amount'
    case 'price_per_unit':
      return 'min_desired_avg_ppu'
    case 'out_of_stock':
      return 'show_out_stock'
    case 'roi':
      return 'preferred_roi'
    case 'scan_hours':
      return 'hours_ago'
    default:
      return key
  }
}

export const formatFullScanInput = (input?: FullScanForm): FullScanInput => {
  if (!input) return defaults

  const entries = Object.entries(input)
  if (!entries.length) return defaults

  const results = entries.reduce<Partial<FullScanInput>>(
    (input, [key, value]) => {
      return { ...input, [keyMap(key)]: value }
    },
    {}
  )

  return { ...defaults, ...results }
}

export type ResponseType = {
  ROI: number
  avg_ppu: number
  home_server_price: number
  home_update_time: string // @todo datetime
  ppu: number
  profit_amount: number
  profit_raw_percent: number
  real_name: string
  sale_rates: number // @todo decimal
  server: string // @todo world / datacenter
  stack_size: number
  update_time: string // @todo datetime
  url: string // @todo URL
  npc_vendor_info: string
  item_id?: string | number
}

const FullScanRequest = async (input: FullScanInput): Promise<Response> => {
  return fetch(`${address}/api/scan`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': UserAgent
    },
    body: JSON.stringify(input)
  })
}

export default FullScanRequest
