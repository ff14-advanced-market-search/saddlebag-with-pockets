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

export type FormValuesMap = Map<
  string,
  number | string | boolean | number[] | string[]
>

export class FormValues {
  private readonly map: FormValuesMap
  constructor(private data: FormData) {
    if (data.has('filters')) {
      defaults['filters'] = []
    }
    this.map = new Map(Object.entries(defaults))
  }

  public toMap(
    fixValueTypes = true
  ): Map<string, number | string | boolean | Array<number> | Array<string>> {
    for (const [key, value] of this.data.entries()) {
      const newValue = fixValueTypes
        ? this.resolveValueType(value as string)
        : value
      const remappedKey = keyMap(key)

      console.dir(remappedKey, newValue)
      if (this.map.has(remappedKey)) {
        const existing: any[] | any = this.map.get(remappedKey)
        if (Array.isArray(existing)) {
          let arrayedValue
          if (Array.isArray(newValue)) {
            arrayedValue = [...existing, ...newValue]
          } else {
            arrayedValue = [...existing, newValue]
          }
          this.map.set(remappedKey, arrayedValue)
        } else {
          this.map.set(remappedKey, newValue as boolean | number | string)
        }
      } else {
        this.map.set(remappedKey, newValue as boolean | number | string)
      }
    }
    return this.map
  }

  private resolveValueType: (value: string) => string | number | boolean = (
    value
  ) => {
    if (value === 'on') {
      // checkboxes whyyyyyy
      return true
    }
    if (!isNaN(parseInt(value as string))) {
      return parseInt(value)
    }
    return value
  }
}

// export type FullScanFields = {
//   scan_hours: number
//   sale_amount: number
//   roi: number
//   minimum_stack_size: number
//   minimum_profit_amount: number
//   price_per_unit: number
//   world: string
// }

// export const validator: Validator<FullScanFields> = withZod(z.object({
//     scan_hours: z.number().positive().min(1).max(128),
//     sale_amount: z.number().min(1),
//     roi: z.number().min(1),
//     minimum_stack_size: z.number().min(1),
//     minimum_profit_amount: z.number().min(1),
//     price_per_unit: z.number().min(1),
//     world: z.string()
// }));

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
      // region_wide
      // include_vendor
      return key
  }
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
}

const FullScanRequest: (map: FormValuesMap) => Promise<Response> = async (
  map
) => {
  console.dir(`body`, map.entries())
  return fetch(`${address}/api/scan`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': UserAgent
    },
    body: JSON.stringify(Object.fromEntries(map.entries()))
  })
}

export default FullScanRequest
