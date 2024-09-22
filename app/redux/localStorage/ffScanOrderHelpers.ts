const FF_SCAN_ORDER_KEY = 'ff-scan-order'

export const defaultSortOrder = [
  'real_name',
  'item_id',
  'url',
  'npc_vendor_info',
  'server',
  'home_server_price',
  'ppu',
  'profit_amount',
  'sale_rates',
  'avg_ppu',
  'ROI',
  'profit_raw_percent',
  'stack_size',
  'update_time',
  'home_update_time',
  'regionWeeklyMedianNQ',
  'regionWeeklyAverageNQ',
  'regionWeeklySalesAmountNQ',
  'regionWeeklyQuantitySoldNQ',
  'regionWeeklyMedianHQ',
  'regionWeeklyAverageHQ',
  'regionWeeklySalesAmountHQ',
  'regionWeeklyQuantitySoldHQ'
]

export const getFFScanSortOrderInLocalStorage = (): Array<string> => {
  try {
    const sortOrder = localStorage.getItem(FF_SCAN_ORDER_KEY)
    if (!sortOrder) {
      return defaultSortOrder
    }
    return JSON.parse(sortOrder)
  } catch {
    return defaultSortOrder
  }
}

export const setFFScanOrderInLocalStorage = (newOrder: Array<string>) => {
  try {
    localStorage.setItem(FF_SCAN_ORDER_KEY, JSON.stringify(newOrder))
    return { success: true }
  } catch {
    return undefined
  }
}
