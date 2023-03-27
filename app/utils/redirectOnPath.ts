type RedirectOnPath = { redirect: false } | { redirect: true; path: string }

export const COMMODITY_SCAN_PATH =
  '/queries/full-scan?minimumStackSize=2&minimumProfitAmount=1000&pricePerUnit=1000'

export const FAST_SCAN_PATH =
  '/queries/full-scan?salesAmount=20&minimumProfitAmount=500&pricePerUnit=500'

export const OUT_OF_STOCK_PATH =
  '/queries/full-scan?hours=168&salesAmount=2&ROI=99&minimumProfitAmount=100&pricePerUnit=100&filters=1,2,3,4,7&hQChecked=true&outOfStockChecked=true'

export const NQ_OUT_OF_STOCK_PATH =
  '/queries/full-scan?salesAmount=2&hours=168&ROI=99&minimumProfitAmount=100&pricePerUnit=100&filters=7,54&includeVendorChecked=true&outOfStockChecked=true'

export const MEGA_VALUE_PATH =
  '/queries/full-scan?hours=336&salesAmount=1&ROI=25&minimumProfitAmount=1000000&pricePerUnit=1000000&regionWideChecked=true&includeVendorChecked=true&outOfStockChecked=true'

export const VENDOR_PATH = `/queries/full-scan?hours=48&salesAmount=5&ROI=50&minimumStackSize=1&minimumProfitAmount=1000&pricePerUnit=1000&filters=-1&hQChecked=false&includeVendorChecked=true&outOfStockChecked=true`

export const QUEST_SCAN_PATH = `/queries/full-scan?hours=48&salesAmount=2ROI=50&minimumStackSize=1&minimumProfitAmount=1000&pricePerUnit=1000&filters=-2,-3&includeVendorChecked=true&outOfStockChecked=true&regionWideChecked=true`

export const VALUE_PATH = `/queries/full-scan?hours=48&salesAmount=5ROI=25&minimumStackSize=1&minimumProfitAmount=75000&pricePerUnit=300000&filters=0&includeVendorChecked=false&outOfStockChecked=true&regionWideChecked=true&hQChecked=false`

export const OLIVIA_1_PATH = `/queries/full-scan?hours=48&salesAmount=5&ROI=25&minimumStackSize=1&minimumProfitAmount=5000&pricePerUnit=5000&filters=0&hQChecked=false&includeVendorChecked=true&outOfStockChecked=true`
export const OLIVIA_2_PATH = `/queries/full-scan?hours=48&salesAmount=2&ROI=25&minimumStackSize=1&minimumProfitAmount=5000&pricePerUnit=5000&filters=-2,-3&hQChecked=false&includeVendorChecked=true&outOfStockChecked=true`
export const OLIVIA_3_PATH = `/queries/full-scan?hours=48&salesAmount=5&ROI=25&minimumStackSize=1&minimumProfitAmount=5000&pricePerUnit=5000&filters=56,65,66,67,68,69,70,71,72,81,82&hQChecked=false&includeVendorChecked=true&outOfStockChecked=true`
export const OLIVIA_4_PATH = `/queries/full-scan?hours=48&salesAmount=5&ROI=25&minimumStackSize=1&minimumProfitAmount=5000&pricePerUnit=5000&filters=75,80,90&hQChecked=false&includeVendorChecked=true&outOfStockChecked=true`
export const OLIVIA_5_PATH = `/queries/full-scan?hours=168&salesAmount=2&ROI=25&minimumStackSize=1&minimumProfitAmount=75000&pricePerUnit=30000&filters=56,65,66,67,68,69,70,71,72,81,82&hQChecked=false&includeVendorChecked=true&outOfStockChecked=true&regionWideChecked=true`
export const OLIVIA_6_PATH = `/queries/full-scan?hours=168&salesAmount=2&ROI=25&minimumStackSize=1&minimumProfitAmount=75000&pricePerUnit=30000&filters=75,80,90&hQChecked=false&includeVendorChecked=true&outOfStockChecked=true&regionWideChecked=true`
export const OLIVIA_7_PATH = `/queries/full-scan?hours=168&salesAmount=2&ROI=25&minimumStackSize=1&minimumProfitAmount=75000&pricePerUnit=30000&filters=1,2&hQChecked=false&includeVendorChecked=true&outOfStockChecked=true&regionWideChecked=true`
export const OLIVIA_8_PATH = `/queries/full-scan?hours=336&salesAmount=1&ROI=25&minimumStackSize=1&minimumProfitAmount=300000&pricePerUnit=300000&filters=75,80,90&hQChecked=false&includeVendorChecked=true&outOfStockChecked=true&regionWideChecked=true`
export const OLIVIA_9_PATH = `/queries/full-scan?hours=336&salesAmount=1&ROI=25&minimumStackSize=1&minimumProfitAmount=300000&pricePerUnit=300000&filters=1,2&hQChecked=false&includeVendorChecked=true&outOfStockChecked=true&regionWideChecked=true`
export const OLIVIA_10_PATH = `/queries/full-scan?hours=336&salesAmount=1&ROI=25&minimumStackSize=1&minimumProfitAmount=300000&pricePerUnit=300000&filters=56,65,66,67,68,69,70,71,72,81,82&hQChecked=false&includeVendorChecked=true&outOfStockChecked=true&regionWideChecked=true`
export const OLIVIA_11_PATH = `/queries/full-scan?hours=336&salesAmount=1&ROI=25&minimumStackSize=1&minimumProfitAmount=300000&pricePerUnit=300000&filters=6&hQChecked=false&includeVendorChecked=true&outOfStockChecked=true&regionWideChecked=true`

export const redirectOnPath = (path: string): RedirectOnPath => {
  const needsRedirect = replacedPages.find(
    ({ oldPath }) => path === oldPath || path === `${oldPath}/`
  )

  if (needsRedirect) {
    return { redirect: true, path: needsRedirect.newPath }
  }

  return { redirect: false }
}

const replacedPages: Array<{ oldPath: string; newPath: string }> = [
  { oldPath: '/queries/commodity-scan', newPath: COMMODITY_SCAN_PATH },
  { oldPath: '/queries/fast-scan', newPath: FAST_SCAN_PATH },
  { oldPath: '/queries/out-stock-scan', newPath: OUT_OF_STOCK_PATH },
  { oldPath: '/queries/nq-out-stock-scan', newPath: NQ_OUT_OF_STOCK_PATH },
  { oldPath: '/queries/mega-value-scan', newPath: MEGA_VALUE_PATH },
  { oldPath: '/queries/vendor-scan', newPath: VENDOR_PATH },
  { oldPath: '/queries/quest-scan', newPath: QUEST_SCAN_PATH },
  { oldPath: '/queries/value-scan', newPath: VALUE_PATH },
  { oldPath: '/queries/olivia1', newPath: OLIVIA_1_PATH },
  { oldPath: '/queries/olivia2', newPath: OLIVIA_2_PATH },
  { oldPath: '/queries/olivia3', newPath: OLIVIA_3_PATH },
  { oldPath: '/queries/olivia4', newPath: OLIVIA_4_PATH },
  { oldPath: '/queries/olivia5', newPath: OLIVIA_5_PATH },
  { oldPath: '/queries/olivia6', newPath: OLIVIA_6_PATH },
  { oldPath: '/queries/olivia7', newPath: OLIVIA_7_PATH },
  { oldPath: '/queries/olivia8', newPath: OLIVIA_8_PATH },
  { oldPath: '/queries/olivia9', newPath: OLIVIA_9_PATH },
  { oldPath: '/queries/olivia10', newPath: OLIVIA_10_PATH },
  { oldPath: '/queries/olivia11', newPath: OLIVIA_11_PATH }
]
