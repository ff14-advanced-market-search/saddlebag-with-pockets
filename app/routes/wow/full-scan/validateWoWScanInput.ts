import type { WOWScanProps } from '~/requests/WOWScan'

export const validateWoWScanInput = (
  formData: FormData
): WOWScanProps | { exception: string } => {
  const minHistoricPriceData = formData.get('minHistoricPrice')
  if (
    !minHistoricPriceData ||
    typeof minHistoricPriceData !== 'string' ||
    isNaN(parseInt(minHistoricPriceData))
  ) {
    return { exception: 'Missing historic price' }
  }

  const minHistoricPrice = parseInt(minHistoricPriceData)

  const roiData = formData.get('roi')
  if (!roiData || typeof roiData !== 'string' || isNaN(parseInt(roiData))) {
    return { exception: 'Missing return on investment percentage' }
  }

  const roi = parseInt(roiData)

  const salePerDayData = formData.get('salePerDay')
  if (
    !salePerDayData ||
    typeof salePerDayData !== 'string' ||
    isNaN(parseInt(salePerDayData))
  ) {
    return { exception: 'Missing sale per day information' }
  }

  const salePerDay = parseInt(salePerDayData)

  const homeRealmIdData = formData.get('homeRealmId')
  if (
    !homeRealmIdData ||
    typeof homeRealmIdData !== 'string' ||
    isNaN(parseInt(homeRealmIdData))
  ) {
    return { exception: 'Missing home world server selection' }
  }
  const homeRealmId = parseInt(homeRealmIdData)

  const newRealmIdData = formData.get('newRealmId')
  if (
    !newRealmIdData ||
    typeof newRealmIdData !== 'string' ||
    isNaN(parseInt(newRealmIdData))
  ) {
    return { exception: 'Missing new world server selection' }
  }
  const newRealmId = parseInt(newRealmIdData)

  return {
    homeRealmId,
    newRealmId,
    minHistoricPrice,
    roi,
    salePerDay
  }
}
