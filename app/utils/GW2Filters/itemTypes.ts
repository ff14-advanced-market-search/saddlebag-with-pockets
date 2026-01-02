export const itemTypes = [
  {
    name: 'Armor',
    value: 0,
    subClasses: [
      { name: 'Boots', value: 100 },
      { name: 'Coat', value: 102 },
      { name: 'Gloves', value: 103 },
      { name: 'Helm', value: 104 },
      { name: 'HelmAquatic', value: 105 },
      { name: 'Leggings', value: 106 },
      { name: 'Shoulders', value: 107 }
    ]
  },
  {
    name: 'Back',
    value: 1,
    subClasses: [{ name: 'None', value: 108 }]
  },
  {
    name: 'Bag',
    value: 2,
    subClasses: [{ name: 'None', value: 109 }]
  },
  {
    name: 'Consumable',
    value: 3,
    subClasses: [
      { name: 'Booze', value: 110 },
      { name: 'Currency', value: 111 },
      { name: 'Food', value: 112 },
      { name: 'Generic', value: 113 },
      { name: 'Immediate', value: 114 },
      { name: 'Transmutation', value: 115 },
      { name: 'Unlock', value: 116 },
      { name: 'Utility', value: 117 }
    ]
  },
  {
    name: 'Container',
    value: 4,
    subClasses: [
      { name: 'Default', value: 118 },
      { name: 'GiftBox', value: 119 },
      { name: 'Immediate', value: 120 },
      { name: 'OpenUI', value: 121 }
    ]
  },
  {
    name: 'CraftingMaterial',
    value: 5,
    subClasses: [{ name: 'None', value: 122 }]
  },
  {
    name: 'Gizmo',
    value: 6,
    subClasses: [{ name: 'Default', value: 123 }]
  },
  {
    name: 'JadeTechModule',
    value: 7,
    subClasses: [{ name: 'None', value: 124 }]
  },
  {
    name: 'MiniPet',
    value: 8,
    subClasses: [{ name: 'None', value: 125 }]
  },
  {
    name: 'PowerCore',
    value: 9,
    subClasses: [{ name: 'None', value: 126 }]
  },
  {
    name: 'Relic',
    value: 10,
    subClasses: [{ name: 'None', value: 127 }]
  },
  {
    name: 'Trinket',
    value: 11,
    subClasses: [
      { name: 'Accessory', value: 128 },
      { name: 'Amulet', value: 129 },
      { name: 'Ring', value: 130 }
    ]
  },
  {
    name: 'Trophy',
    value: 12,
    subClasses: [{ name: 'None', value: 131 }]
  },
  {
    name: 'UpgradeComponent',
    value: 13,
    subClasses: [
      { name: 'Default', value: 132 },
      { name: 'Gem', value: 133 },
      { name: 'Rune', value: 134 },
      { name: 'Sigil', value: 135 }
    ]
  },
  {
    name: 'Weapon',
    value: 14,
    subClasses: [
      { name: 'Axe', value: 136 },
      { name: 'Dagger', value: 137 },
      { name: 'Focus', value: 138 },
      { name: 'Greatsword', value: 139 },
      { name: 'Hammer', value: 140 },
      { name: 'Harpoon', value: 141 },
      { name: 'LongBow', value: 142 },
      { name: 'Mace', value: 143 },
      { name: 'Pistol', value: 144 },
      { name: 'Rifle', value: 145 },
      { name: 'Scepter', value: 146 },
      { name: 'Shield', value: 147 },
      { name: 'ShortBow', value: 148 },
      { name: 'Speargun', value: 149 },
      { name: 'Staff', value: 150 },
      { name: 'Sword', value: 151 },
      { name: 'Torch', value: 152 },
      { name: 'Trident', value: 153 },
      { name: 'Warhorn', value: 154 }
    ]
  }
]

export type ItemType = (typeof itemTypes)[0]
export type ItemDetailsType = (typeof itemTypes)[0]['subClasses'][0]
