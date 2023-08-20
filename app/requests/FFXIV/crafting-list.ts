import { address, UserAgent } from '~/requests/client/config'

export interface CraftingListInput {
  homeServer: string
  costMetric: string
  revenueMetric: string
  salesPerWeek: number
  medianSalePrice: number
  maxMaterialCost: number
  jobs: Array<number>
  filters: Array<number>
  stars: number
  lvlLowerLimit: number
  lvlUpperLimit: number
  yields: number
  hideExpertRecipes: boolean
}

interface CostEstimate {
  material_avg_cost: number
  material_median_cost: number
  material_min_listing_cost: number
}

interface RevenueEstimate {
  revenue_avg: number
  revenue_home_min_listing: number
  revenue_median: number
  revenue_region_min_listing: number
}

export interface CraftingListData {
  [key: string]: any
  costEst: CostEstimate
  hq: boolean
  itemData: string
  itemID: number
  itemName: string
  profitEst: number
  revenueEst: RevenueEstimate
  soldPerWeek: number
  universalisLink: string
  yieldsPerCraft: number
}

export type FlatCraftingList = Omit<
  CraftingListData,
  'costEst' | 'revenueEst'
> &
  CostEstimate &
  RevenueEstimate

interface UntradableItems {
  craftID: number
  hq: boolean
  materialID: number
  quantity: number
}

export interface CraftingListRepsonse {
  data: Array<CraftingListData>
  item_ids: Array<number>
  untradable_items: Array<UntradableItems>
  missing_stats_ids: Array<number>
  missing_materials_ids: Array<number>
}

const CraftingList = async ({
  homeServer,
  costMetric,
  revenueMetric,
  salesPerWeek,
  medianSalePrice,
  maxMaterialCost,
  jobs,
  filters,
  stars,
  lvlLowerLimit,
  lvlUpperLimit,
  yields,
  hideExpertRecipes
}: CraftingListInput) => {
  const firstFetch = await fetch(`${address}/api/recipelookup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': UserAgent
    },
    body: JSON.stringify({
      home_server: homeServer,
      cost_metric: costMetric,
      revenue_metric: revenueMetric,
      sales_per_week: salesPerWeek,
      median_sale_price: medianSalePrice,
      max_material_cost: maxMaterialCost,
      jobs,
      filters,
      stars,
      lvl_lower_limit: lvlLowerLimit,
      lvl_upper_limit: lvlUpperLimit,
      yields,
      hide_expert_recipes: hideExpertRecipes
    })
  })

  const newInput = await firstFetch.json()

  return await fetch(`${address}/api/craftsim`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': UserAgent
    },
    body: JSON.stringify(newInput)
  })
}

export default CraftingList
