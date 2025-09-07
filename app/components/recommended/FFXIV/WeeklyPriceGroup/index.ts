import materia from './materia'
import furnishings from './furnishings'
import dawntrail70Commodities from './70dawntrailCommodities'
import dawntrail70Misc from './70dawntrailMisc'
import dawntrail71Commodities from './71dawntrailCommodities'
import dawntrail71Misc from './71dawntrailMisc'
import dawntrail72Commodities from './72dawntrailCommodities'
import dawntrail72Misc from './72dawntrailMisc'
import dawntrail73Commodities from './73dawntrailCommodities'
import dawntrail73Misc from './73dawntrailMisc'
import endwalker63Commodities from './63endwalkerCommodities'
import endwalker63Misc from './63endwalkerMisc'
import endwalker64Commodities from './64endwalkerCommodities'
import endwalker64Misc from './64endwalkerMisc'
import endwalker65Commodities from './65endwalkerCommodities'
import endwalker65Misc from './65endwalkerMisc'

const recommendedConfigs = [
  materia,
  furnishings,
  dawntrail73Commodities,
  dawntrail73Misc,
  dawntrail72Commodities,
  dawntrail72Misc,
  dawntrail71Commodities,
  dawntrail71Misc,
  dawntrail70Commodities,
  dawntrail70Misc,
  endwalker65Commodities,
  endwalker65Misc
  // Disable all before 6.5, we have incomplete data on some regions
  // Note: Oceania has the full data until 6.3 because it was small
  // endwalker64Commodities,
  // endwalker64Misc,
  // endwalker63Commodities,
  // endwalker63Misc
]

export default recommendedConfigs
