export interface ItemRarity {
  name: string
  value: number
}

export const itemRarities: ItemRarity[] = [
  { name: 'Junk', value: 0 },
  { name: 'Basic', value: 1 },
  { name: 'Fine', value: 2 },
  { name: 'Masterwork', value: 3 },
  { name: 'Rare', value: 4 },
  { name: 'Exotic', value: 5 },
  { name: 'Ascended', value: 6 },
  { name: 'Legendary', value: 7 }
]
