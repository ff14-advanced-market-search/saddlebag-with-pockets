export interface FFXIVLoaderData {
  world: {
    name: string
  }
  region: string
}

export interface ImportData {
  start_year?: number
  start_month?: number
  start_day?: number
  end_year?: number
  end_month?: number
  end_day?: number
  hq_only?: boolean
  price_setting?: string
  quantity_setting?: string
  price_groups?: Array<{
    name: string
    item_ids: number[]
    categories: number[]
  }>
}
