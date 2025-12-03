export const itemClasses = [
  {
    name: 'Consumable',
    value: 0,
    subClasses: [
      { name: 'Generic', value: 0 },
      { name: 'Potion', value: 1 },
      { name: 'Elixir', value: 2 },
      { name: 'Flasks & Phials', value: 3 },
      { name: 'Food & Drink', value: 4 },
      { name: 'Food & Drink 2', value: 5 },
      { name: 'Bandage', value: 6 },
      { name: 'Other', value: 7 },
      { name: 'Other 2', value: 8 },
      { name: 'Vantus Rune', value: 9 },
      { name: 'Toys', value: 199 }
    ]
  },
  {
    name: 'Container',
    value: 1,
    subClasses: [
      { name: 'Bag', value: 0 },
      { name: 'Soul Bag', value: 1 },
      { name: 'Herb Bag', value: 2 },
      { name: 'Enchanting Bag', value: 3 },
      { name: 'Engineering Bag', value: 4 },
      { name: 'Gem Bag', value: 5 },
      { name: 'Mining Bag', value: 6 },
      { name: 'Leatherworking Bag', value: 7 },
      { name: 'Inscription Bag', value: 8 },
      { name: 'Tackle Box', value: 9 },
      { name: 'Cooking Bag', value: 10 }
    ]
  },
  {
    name: 'Weapon',
    value: 2,
    subClasses: [
      { name: 'One-Handed Axes', value: 0 },
      { name: 'Two-Handed Axes', value: 1 },
      { name: 'Bows', value: 2 },
      { name: 'Guns', value: 3 },
      { name: 'One-Handed Maces', value: 4 },
      { name: 'Two-Handed Maces', value: 5 },
      { name: 'Polearms', value: 6 },
      { name: 'One-Handed Swords', value: 7 },
      { name: 'Two-Handed Swords', value: 8 },
      { name: 'Warglaives', value: 9 },
      { name: 'Staves', value: 10 },
      { name: 'Bear Claws', value: 11 },
      { name: 'CatClaws', value: 12 },
      { name: 'Fist Weapons', value: 13 },
      { name: 'Miscellaneous', value: 14 },
      { name: 'Daggers', value: 15 },
      { name: 'Thrown', value: 16 },
      { name: 'Crossbows', value: 18 },
      { name: 'Wands', value: 19 },
      { name: 'Fishing Poles', value: 20 }
    ]
  },
  {
    name: 'Gem',
    value: 3,
    subClasses: [
      { name: 'Intellect', value: 0 },
      { name: 'Agility', value: 1 },
      { name: 'Strength', value: 2 },
      { name: 'Stamina', value: 3 },
      { name: 'Spirit', value: 4 },
      { name: 'Critical Strike', value: 5 },
      { name: 'Mastery', value: 6 },
      { name: 'Haste', value: 7 },
      { name: 'Versatility', value: 8 },
      { name: 'Other', value: 9 },
      { name: 'Multiple Stats', value: 10 },
      { name: 'Artifact Relic', value: 11 }
    ]
  },
  {
    name: 'Armor',
    value: 4,
    subClasses: [
      { name: 'Misc', value: 0 },
      { name: 'Cloth', value: 1 },
      { name: 'Leather', value: 2 },
      { name: 'Mail', value: 3 },
      { name: 'Plate', value: 4 },
      { name: 'Cosmetic', value: 5 },
      { name: 'Shields', value: 6 },
      { name: 'Librams', value: 7 },
      { name: 'Idols', value: 8 },
      { name: 'Totems', value: 9 },
      { name: 'Sigils', value: 10 },
      { name: 'Relic', value: 11 }
    ]
  },
  {
    name: 'Tradegoods',
    value: 7,
    subClasses: [
      { name: 'Parts', value: 1 },
      { name: 'Jewelcrafting', value: 4 },
      { name: 'Cloth', value: 5 },
      { name: 'Leather', value: 6 },
      { name: 'Metal & Stone', value: 7 },
      { name: 'Cooking', value: 8 },
      { name: 'Herb', value: 9 },
      { name: 'Elemental', value: 10 },
      { name: 'Other', value: 11 },
      { name: 'Enchanting', value: 12 },
      { name: 'Inscription', value: 16 },
      { name: 'Optional Reagents', value: 18 },
      { name: 'Finishing Reagents', value: 19 }
    ]
  },
  {
    name: 'Item Enhancement',
    value: 8,
    subClasses: [
      { name: 'Head', value: 0 },
      { name: 'Neck', value: 1 },
      { name: 'Shoulder', value: 2 },
      { name: 'Cloak', value: 3 },
      { name: 'Chest', value: 4 },
      { name: 'Wrist', value: 5 },
      { name: 'Hands', value: 6 },
      { name: 'Waist', value: 7 },
      { name: 'Legs', value: 8 },
      { name: 'Feet', value: 9 },
      { name: 'Finger', value: 10 },
      { name: 'One-Handed Weapon', value: 11 },
      { name: 'Two-Handed Weapon', value: 12 },
      { name: 'Shield/Off-hand', value: 13 },
      { name: 'Misc', value: 14 }
    ]
  },
  {
    name: 'Recipe',
    value: 9,
    subClasses: [
      { name: 'Book', value: 0 },
      { name: 'Leatherworking', value: 1 },
      { name: 'Tailoring', value: 2 },
      { name: 'Engineering', value: 3 },
      { name: 'Blacksmithing', value: 4 },
      { name: 'Cooking', value: 5 },
      { name: 'Alchemy', value: 6 },
      { name: 'First Aid', value: 7 },
      { name: 'Enchanting', value: 8 },
      { name: 'Fishing', value: 9 },
      { name: 'Jewelcrafting', value: 10 },
      { name: 'Inscription', value: 11 }
    ]
  },
  {
    name: 'Quest Item',
    value: 12,
    subClasses: [{ name: 'Quest Item', value: 0 }]
  },
  {
    name: 'Miscellaneous',
    value: 15,
    subClasses: [
      { name: 'Junk', value: 0 },
      { name: 'Reagent', value: 1 },
      { name: 'Companion Pets', value: 2 },
      { name: 'Holiday', value: 3 },
      { name: 'Other', value: 4 },
      { name: 'Mount', value: 5 },
      { name: 'Mount Equipment', value: 6 },
      { name: 'Toys', value: 199 }
    ]
  },
  {
    name: 'Glyph',
    value: 16,
    subClasses: [
      { name: 'Warrior', value: 1 },
      { name: 'Paladin', value: 2 },
      { name: 'Hunter', value: 3 },
      { name: 'Rogue', value: 4 },
      { name: 'Priest', value: 5 },
      { name: 'Death Knight', value: 6 },
      { name: 'Shaman', value: 7 },
      { name: 'Mage', value: 8 },
      { name: 'Warlock', value: 9 },
      { name: 'Monk', value: 10 },
      { name: 'Druid', value: 11 },
      { name: 'Demon Hunter', value: 12 }
    ]
  },
  {
    name: 'Battle Pet',
    value: 17,
    subClasses: [
      { name: 'Humanoid', value: 0 },
      { name: 'Dragonkin', value: 1 },
      { name: 'Flying', value: 2 },
      { name: 'Undead', value: 3 },
      { name: 'Critter', value: 4 },
      { name: 'Magic', value: 5 },
      { name: 'Elemental', value: 6 },
      { name: 'Beast', value: 7 },
      { name: 'Aquatic', value: 8 },
      { name: 'Mechanical', value: 9 }
    ]
  },
  {
    name: 'Profession',
    value: 19,
    subClasses: [
      { name: 'Blacksmithing', value: 0 },
      { name: 'Leatherworking', value: 1 },
      { name: 'Alchemy', value: 2 },
      { name: 'Herbalism', value: 3 },
      { name: 'Cooking', value: 4 },
      { name: 'Mining', value: 5 },
      { name: 'Tailoring', value: 6 },
      { name: 'Engineering', value: 7 },
      { name: 'Enchanting', value: 8 },
      { name: 'Fishing', value: 9 },
      { name: 'Skinning', value: 10 },
      { name: 'Jewelcrafting', value: 11 },
      { name: 'Inscription', value: 12 },
      { name: 'Archaeology', value: 1 }
    ]
  },
  {
    name: 'Housing',
    value: 20,
    subClasses: [
      { name: 'Decor', value: 0 },
      { name: 'Housing Dye', value: 1 }
    ]
  }
]

export type ItemClass = (typeof itemClasses)[0]
export type ItemSubClass = (typeof itemClasses)[0]['subClasses'][0]
