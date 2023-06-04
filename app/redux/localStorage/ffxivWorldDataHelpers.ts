import { validateWorldAndDataCenter } from '~/utils/locations'

const FFXIV_WORLD_KEY = 'ffxiv_world'
const FFXIV_DATA_CENTER_KEY = 'ffxiv_data_center'

export const getFFWorldDataFromLocalStorage = () => {
  try {
    const world = localStorage.getItem(FFXIV_WORLD_KEY)
    const dataCenter = localStorage.getItem(FFXIV_DATA_CENTER_KEY)

    const validData = validateWorldAndDataCenter(world, dataCenter)

    if (!world || !dataCenter) {
      setFFWorldDataInLocalStorage(validData.world, validData.data_center)
    }

    return validData
  } catch {
    return validateWorldAndDataCenter()
  }
}

export const setFFWorldDataInLocalStorage = (
  world: string,
  dataCenter: string
) => {
  try {
    localStorage.setItem(FFXIV_WORLD_KEY, world)
    localStorage.setItem(FFXIV_DATA_CENTER_KEY, dataCenter)

    return { success: true }
  } catch {
    return undefined
  }
}
