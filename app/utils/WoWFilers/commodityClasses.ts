import { itemClasses } from './itemClasses'

export const commodityClassNames = [
  'Consumable',
  'Gem',
  'Tradegoods',
  'Item Enhancement',
  'Recipe',
  'Quest Item',
  'Miscellaneous',
  'Glyph',
  'Housing'
] as const

export function getCommodityItemClasses() {
  return itemClasses.filter((cls) =>
    commodityClassNames.includes(cls.name as any)
  )
}

export const subclassRestrictions: Record<string, string[]> = {
  Recipe: ['Book'],
  Miscellaneous: ['Junk', 'Reagent', 'Holiday', 'Other'],
  Housing: ['Decor']
}
