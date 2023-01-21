type RedirectOnPath = { redirect: false } | { redirect: true; path: string }

export const COMMODITY_SCAN_PATH =
  '/queries/full-scan?minimumStackSize=2&minimumProfitAmount=1000&pricePerUnit=1000'
export const FAST_SCAN_PATH =
  '/queries/full-scan?salesAmount=20&minimumProfitAmount=500&pricePerUnit=500'

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
  { oldPath: '/queries/fast-scan', newPath: FAST_SCAN_PATH }
]
