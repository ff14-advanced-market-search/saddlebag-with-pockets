export interface FFXIVLoaderData {
  region: string
}

export interface ImportData {
  region?: string
  start_year?: number
  start_month?: number
  start_day?: number
  end_year?: number
  end_month?: number
  end_day?: number
  minimum_marketshare?: number
  price_setting?: string
  quantity_setting?: string
  price_groups?: Array<{
    name: string
    item_ids: number[]
    categories: number[]
    hq_only: boolean
  }>
}
