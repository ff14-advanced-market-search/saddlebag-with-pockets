import type { DataCentersList } from './DataCenters'
import DataCenters from './DataCenters'
import Regions from './Regions'
import type { WorldsList } from './Worlds'
import Worlds from './Worlds'
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

export { Regions, Worlds, DataCenters, DataCentersOfRegion, WorldsOfDataCenter }
