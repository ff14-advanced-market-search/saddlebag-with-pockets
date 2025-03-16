import type { DataCentersList } from './DataCenters'
import DataCenters, { DataCenterArray } from './DataCenters'
import Regions from './Regions'
import type { WorldsList } from './Worlds'
import Worlds, { WorldList, WorldsArray } from './Worlds'
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

/**
 * Validates the provided world and data center names.
 * @example
 * validateLocation("world1", "dataCenter1")
 * { world: "world1", data_center: "dataCenter1" }
 * @param {string|null} world - Name of the world to validate.
 * @param {string|null} data_center - Name of the data center to validate.
 * @returns {object} Returns an object containing the validated world and data center.
 * @description
 *   - If the provided data center and world are valid, the function returns them.
 *   - If either the data center or the world is invalid, it returns defaults.
 *   - Relies on predefined arrays WorldList and DataCenterArray for validation.
 */
const validateWorldAndDataCenter = (
  world?: string | null,
  data_center?: string | null
): { world: string; data_center: string } => {
  if (data_center && DataCenterArray.includes(data_center)) {
    if (
      world &&
      WorldList[data_center]
        ?.map((validWorld) => validWorld.name)
        .includes(world)
    ) {
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
