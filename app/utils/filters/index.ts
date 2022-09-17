import { arms } from '~/utils/filters/arms'
import { tools } from '~/utils/filters/tools'
import { ReactNode } from 'react'
import { armor } from '~/utils/filters/armor'
import { accessories } from '~/utils/filters/accessories'
import { materials } from '~/utils/filters/materials'
import { medicinesMeals } from '~/utils/filters/medicines-meals'
import { other } from '~/utils/filters/other'

export type FilterFormat = {
  // @todo reencforce ID once all set.
  name: string
  abbreviation?: string
  icon: ReactNode
  id?: number
}
type FiltersList = {
  name: string
  data: FilterFormat[]
  id: number | 'all' | 'vendor'
}[]

const filters: FiltersList = [
  {
    name: `Everything`,
    data: [],
    id: 0
  },
  {
    name: 'Purchasable from NPC Vendor',
    data: [],
    id: -1
  },
  {
    name: 'Supply and Provisioning Mission Quest Items',
    data: [],
    id: -2
  },
  {
    name: 'Crafter Class Quest Items',
    data: [],
    id: -3
  },
  {
    name: 'Arms',
    data: arms,
    id: 1
  },
  {
    name: 'Tools',
    data: tools,
    id: 2
  },
  {
    name: 'Armor',
    data: armor,
    id: 3
  },
  {
    name: 'Accessories',
    data: accessories,
    id: 4
  },
  {
    name: 'Medicines & Meals',
    data: medicinesMeals,
    id: 5
  },
  {
    name: 'Materials',
    data: materials,
    id: 6
  },
  {
    name: 'Other',
    data: other,
    id: 7
  }
]

export default filters
