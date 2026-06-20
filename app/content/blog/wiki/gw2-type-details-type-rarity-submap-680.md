# GW2 Type, Details_Type, Rarity Submap #680

Heres the custom mapping the api system will use, ints to match what we use in all other games, its just better that way.

Theres no subcategories in GW2 so we invented them out of the details.type value found in the items api: https://wiki.guildwars2.com/wiki/API:2/items

---

rarity

```json
{
  "Junk": 0,
  "Basic": 1,
  "Fine": 2,
  "Masterwork": 3,
  "Rare": 4,
  "Exotic": 5,
  "Ascended": 6,
  "Legendary": 7
}
```

type

```json
{
  "Armor": 0,
  "Back": 1,
  "Bag": 2,
  "Consumable": 3,
  "Container": 4,
  "CraftingMaterial": 5,
  "Gizmo": 6,
  "JadeTechModule": 7,
  "MiniPet": 8,
  "PowerCore": 9,
  "Relic": 10,
  "Trinket": 11,
  "Trophy": 12,
  "UpgradeComponent": 13,
  "Weapon": 14
}
```

details_type

```json
{
  "Armor": {
    "Boots": 100,
    "Coat": 102,
    "Gloves": 103,
    "Helm": 104,
    "HelmAquatic": 105,
    "Leggings": 106,
    "Shoulders": 107
  },
  "Back": {
    "None": 108
  },
  "Bag": {
    "None": 109
  },
  "Consumable": {
    "Booze": 110,
    "Currency": 111,
    "Food": 112,
    "Generic": 113,
    "Immediate": 114,
    "Transmutation": 115,
    "Unlock": 116,
    "Utility": 117
  },
  "Container": {
    "Default": 118,
    "GiftBox": 119,
    "Immediate": 120,
    "OpenUI": 121
  },
  "CraftingMaterial": {
    "None": 122
  },
  "Gizmo": {
    "Default": 123
  },
  "JadeTechModule": {
    "None": 124
  },
  "MiniPet": {
    "None": 125
  },
  "PowerCore": {
    "None": 126
  },
  "Relic": {
    "None": 127
  },
  "Trinket": {
    "Accessory": 128,
    "Amulet": 129,
    "Ring": 130
  },
  "Trophy": {
    "None": 131
  },
  "UpgradeComponent": {
    "Default": 132,
    "Gem": 133,
    "Rune": 134,
    "Sigil": 135
  },
  "Weapon": {
    "Axe": 136,
    "Dagger": 137,
    "Focus": 138,
    "Greatsword": 139,
    "Hammer": 140,
    "Harpoon": 141,
    "LongBow": 142,
    "Mace": 143,
    "Pistol": 144,
    "Rifle": 145,
    "Scepter": 146,
    "Shield": 147,
    "ShortBow": 148,
    "Speargun": 149,
    "Staff": 150,
    "Sword": 151,
    "Torch": 152,
    "Trident": 153,
    "Warhorn": 154
  }
}
```
