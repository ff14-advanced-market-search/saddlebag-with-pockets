import { itemClasses } from './itemClasses'

// Add any classes that have commodities in here so they show up in delta filter options
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

// This is for some classes where only some sub-classes are commodity-only
// Just add the commodity-only sub-classes here, leave non commodities out of this
export const subclassRestrictions: Record<string, string[]> = {
  Recipe: ['Book'],
  Miscellaneous: ['Junk', 'Reagent', 'Holiday', 'Other'],
  Housing: ['Housing Dye']
}
