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
  show_out_stock: false
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
  hq_only?: boolean
  out_of_stock?: boolean
  include_vendor?: boolean
  region_wide?: boolean
  filters?: Array<number>
}

/**
 * Converts keys to corresponding filter parameters.
 * @example
 * convertKeyToFilter('sale_amount')
 * // Returns 'min_sales'
 * convertKeyToFilter('unknown_key')
 * // Returns 'unknown_key'
 * @param {string} key - The key to be converted.
 * @returns {string} The corresponding filter parameter or the original key if no match is found.
 * @description
 *   - Maps specific keys to their corresponding filter parameters for a full scan request in FFXIV.
 *   - If the key does not match any case, the function returns the original key, ensuring flexibility for unhandled keys.
 */
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

/**
 * Converts a FullScanForm object into a FullScanInput object with default values.
 * @example
 * formatFullScanInput({ sale_amount: 10, roi: 25 })
 * // Returns { min_sales: 10, preferred_roi: 25, hours_ago: 24, ... } with other default values
 * @param {FullScanForm} input - The full scan form object to be converted, optional.
 * @returns {FullScanInput} Returns an object that merges defaults with transformed input values.
 * @description
 *   - Utilizes `Object.entries()` to iterate over the input object.
 *   - Uses `reduce` to build a new object by mapping keys through `keyMap`.
 *   - The result merges with default values, ensuring all required fields are present.
 */
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
