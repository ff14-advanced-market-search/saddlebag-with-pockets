import { json } from '@remix-run/cloudflare'
import { address, UserAgent } from '~/requests/client/config'

export const costMetrics = [
  'material_median_cost',
  'material_avg_cost',
  'material_min_listing_cost'
] as const

export type CostMetrics = (typeof costMetrics)[number]

export const costMetricLabels: Record<CostMetrics, string> = {
  material_median_cost: 'Regional Median Price',
  material_avg_cost: 'Regional Average Price',
  material_min_listing_cost: 'Regional Minimum Price'
}

export const revenueMetrics = [
  'revenue_home_min_listing',
  'revenue_region_min_listing',
  'revenue_median',
  'revenue_avg'
] as const

export type RevenueMetrics = (typeof revenueMetrics)[number]

export const revenueMetricLabels: Record<RevenueMetrics, string> = {
  revenue_home_min_listing: 'Home Minimum Price',
  revenue_region_min_listing: 'Regional Minimum Price',
  revenue_median: 'Regional Median Price',
  revenue_avg: 'Regional Average Price'
}

export interface CraftingListInput {
  homeServer: string
  costMetric: CostMetrics
  revenueMetric: RevenueMetrics
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

/**
 * Sends a POST request with crafting data to a specified API endpoint
 * @example
 * sync({
 *   homeServer: 'serverName',
 *   costMetric: 'cost',
 *   revenueMetric: 'revenue',
 *   salesPerWeek: 100,
 *   medianSalePrice: 250,
 *   maxMaterialCost: 600,
 *   jobs: ['job1', 'job2'],
 *   filters: ['filter1'],
 *   stars: 3,
 *   lvlLowerLimit: 50,
 *   lvlUpperLimit: 70,
 *   yields: 5,
 *   hideExpertRecipes: false
 * })
 * @param {Object} CraftingListInput - The input parameters for the crafting list request.
 * @returns {Promise<Response>} The response from the server.
 * @description
 *   - Uses the `fetch` API to send a POST request.
 *   - The function asynchronously sends data and returns a promise.
 *   - Ensures the request body is formatted as JSON string.
 *   - Requires a pre-configured server address and user agent.
 */
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
  return await fetch(`${address}/api/v2/craftsim`, {
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
}

export default CraftingList
