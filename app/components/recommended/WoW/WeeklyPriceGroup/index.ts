import enchants from './enchants'
import alchemy from './alchemy'
import gems from './gems'
import raidConsumables from './raidConsumables'
import craftingMaterials from './craftingMaterials'
import complete from './complete'
import tier11_1 from './tier-11-1'
import engMountTWW from './engMountTwwParts'
import engMountTwwOre from './engMountTwwOre'
import dragonflight1 from './dragonflight1'

const recommendedConfigs = [
  tier11_1, // Tier 11.1 Complete Analysis
  engMountTWW, // Increases from TWW mount using old parts
  engMountTwwOre, // Increases from TWW mount using old parts
  dragonflight1, // Dragonflight Market

  complete, // test
  enchants,
  alchemy,
  gems,
  raidConsumables,
  craftingMaterials
]

export default recommendedConfigs
