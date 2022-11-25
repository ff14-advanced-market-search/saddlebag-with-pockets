import type { DataCentersList } from './DataCenters'
import DataCenters, { DataCenterArray } from './DataCenters'
import Regions from './Regions'
import type { WorldsList } from './Worlds'
import Worlds, { WorldsArray } from './Worlds'
import {
  DataCenterNotFoundException,
  RegionNotFoundException
} from '~/utils/locations/Errors'
import type { ValueOf } from '~/utils/ts'

// @ts-ignore
const DataCentersOfRegion: (
  region_key: keyof DataCentersList
) => ValueOf<DataCentersList> = (region_key) => {
  if (DataCenters.has(region_key)) {
    return DataCenters.get(region_key)
  }
  throw new RegionNotFoundException(region_key)
}

// @ts-ignore
const WorldsOfDataCenter: (
  data_center_key: keyof WorldsList
) => ValueOf<WorldsList> = (data_center_key) => {
  if (Worlds.has(data_center_key)) {
    return Worlds.get(data_center_key)
  }
  throw new DataCenterNotFoundException(data_center_key)
}

const validateWorldAndDataCenter = (
  world?: string | null,
  data_center?: string | null
): { world: string; data_center: string } => {
  if (world && WorldsArray.includes(world)) {
    if (data_center && DataCenterArray.includes(data_center)) {
      return { world, data_center }
    }
  }

  return {
    world: WorldsArray.at(0)!,
    data_center: DataCenterArray.at(0)!
  }
}

export {
  Regions,
  Worlds,
  DataCenters,
  DataCentersOfRegion,
  WorldsOfDataCenter,
  validateWorldAndDataCenter
}
