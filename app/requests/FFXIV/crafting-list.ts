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
