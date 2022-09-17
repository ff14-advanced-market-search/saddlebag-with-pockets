import { FilterFormat } from '~/utils/filters/index'
import { Stone } from '~/components/icons/materials/Stone'
import { Metal } from '~/components/icons/materials/Metal'
import { Lumber } from '~/components/icons/materials/Lumber'
import { Cloth } from '~/components/icons/materials/Cloth'
import { Leather } from '~/components/icons/materials/Leather'
import { Bone } from '~/components/icons/materials/Bone'
import { Reagents } from '~/components/icons/materials/Reagents'
import { Dyes } from '~/components/icons/materials/Dyes'
import { WeaponParts } from '~/components/icons/materials/WeaponParts'

export const materials: FilterFormat[] = [
  {
    name: `Stone`,
    icon: Stone,
    id: 47
  },
  {
    name: `Metal`,
    icon: Metal,
    id: 48
  },
  {
    name: `Lumber`,
    icon: Lumber,
    id: 49
  },
  {
    name: `Cloth`,
    icon: Cloth,
    id: 50
  },
  {
    name: `Leather`,
    icon: Leather,
    id: 51
  },
  {
    name: `Bone`,
    icon: Bone,
    id: 52
  },
  {
    name: `Reagents`,
    icon: Reagents,
    id: 53
  },
  {
    name: `Dyes`,
    icon: Dyes,
    id: 54
  },
  {
    name: `Weapon Parts`,
    icon: WeaponParts,
    id: 55
  }
]
