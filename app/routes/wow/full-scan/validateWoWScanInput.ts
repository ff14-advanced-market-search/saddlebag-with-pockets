import type { WOWScanProps } from '~/requests/WOWScan'

const getServerIdAndNameFromInput = (selectString: string) => {
  const [id, name] = selectString.split('---')
  if (!id || !name) return
  else return { id, name }
}

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

  const homeRealmData = formData.get('homeRealmId')

  if (!homeRealmData || typeof homeRealmData !== 'string') {
    return { exception: 'Missing home world server selection' }
  }

  const homeRealmIdData = getServerIdAndNameFromInput(homeRealmData)

  if (!homeRealmIdData) {
    return { exception: 'Missing home world server selection' }
  }

  const homeRealmId = parseInt(homeRealmIdData.id)
  const homeRealmServerName = homeRealmIdData.name

  const newRealmData = formData.get('newRealmId')
  if (!newRealmData || typeof newRealmData !== 'string') {
    return { exception: 'Missing new world server selection' }
  }

  const newRealmIdData = getServerIdAndNameFromInput(newRealmData)

  if (!newRealmIdData) {
    return { exception: 'Missing new world server selection' }
  }

  const newRealmId = parseInt(newRealmIdData.id)
  const newRealmServerName = newRealmIdData.name

  return {
    homeRealmId,
    homeRealmServerName,
    newRealmId,
    newRealmServerName,
    minHistoricPrice,
    roi,
    salePerDay
  }
}
