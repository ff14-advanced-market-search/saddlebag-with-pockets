import type { WOWScanProps } from '~/requests/WoW/WOWScan'

const getServerIdAndNameFromInput = (selectString: string) => {
  const [id, name] = selectString.split('---')
  if (!id || !name) return
  else return { id, name }
}

/**
 * Validates and extracts required data from FormData for a World of Warcraft scan.
 * @example
 * validateWoWScanInput(formData)
 * Returns an object containing the validated scan properties from FormData.
 * @param {FormData} formData - The FormData object containing various server and item details.
 * @returns {WOWScanProps | { exception: string }} An object containing the scan properties or an exception message string.
 * @description
 *   - Extracts server IDs and names for home and new realms using getServerIdAndNameFromInput.
 *   - Converts string data to integers for various game properties like item quality, required level, etc.
 *   - Returns specific exceptions for missing or invalid input data.
 */
export const validateWoWScanInput = (
  formData: FormData
): WOWScanProps | { exception: string } => {
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

  const minHistoricPriceData = formData.get('minHistoricPrice')

  if (!minHistoricPriceData || typeof minHistoricPriceData !== 'string') {
    return { exception: 'Missing minimum historic price' }
  }

  const minHistoricPrice = parseInt(minHistoricPriceData)

  const roiData = formData.get('roi')

  if (!roiData || typeof roiData !== 'string') {
    return { exception: 'Missing minimum historic price' }
  }

  const roi = parseInt(roiData)

  const salePerDayData = formData.get('salePerDay')

  if (!salePerDayData || typeof salePerDayData !== 'string') {
    return { exception: 'Missing minimum historic price' }
  }

  const salePerDay = parseInt(salePerDayData)

  const itemQualityData = formData.get('itemQuality')

  if (!itemQualityData || typeof itemQualityData !== 'string') {
    return { exception: 'Missing Item Quality' }
  }

  const itemQuality = parseInt(itemQualityData)

  const requiredLevelData = formData.get('requiredLevel')

  if (!requiredLevelData || typeof requiredLevelData !== 'string') {
    return { exception: 'Missing Required level' }
  }

  const requiredLevel = parseInt(requiredLevelData)

  const itemClassData = formData.get('itemClass')

  if (!itemClassData || typeof itemClassData !== 'string') {
    return { exception: 'Missing item class' }
  }

  const itemClass = parseInt(itemClassData)

  const itemSubClassData = formData.get('itemSubClass')

  if (!itemSubClassData || typeof itemSubClassData !== 'string') {
    return { exception: 'Missing item sub class' }
  }

  const itemSubClass = parseInt(itemSubClassData)

  const iLvlData = formData.get('iLvl')

  if (!iLvlData || typeof iLvlData !== 'string') {
    return { exception: 'Missing item level' }
  }

  const iLvl = parseInt(iLvlData)

  return {
    minHistoricPrice,
    roi,
    salePerDay,
    itemQuality,
    requiredLevel,
    itemClass,
    itemSubClass,
    iLvl,
    newRealmServerName,
    newRealmId,
    homeRealmId,
    homeRealmServerName
  }
}
