import { itemClasses } from './itemClasses'

export const commodityClassNames = [
  'Consumable',
  'Gem',
  'Tradegoods',
  'Item Enhancement',
  'Recipe',
  'Quest Item',
  'Miscellaneous',
  'Glyph'
] as const

/**
 * Returns item classes whose names match predefined commodity class names.
 *
 * @returns An array of item classes corresponding to commodity categories.
 */
export function getCommodityItemClasses() {
  return itemClasses.filter((cls) =>
    commodityClassNames.includes(cls.name as any)
  )
}

export const subclassRestrictions: Record<string, string[]> = {
  Recipe: ['Book'],
  Miscellaneous: ['Junk', 'Reagent', 'Holiday', 'Other']
}
