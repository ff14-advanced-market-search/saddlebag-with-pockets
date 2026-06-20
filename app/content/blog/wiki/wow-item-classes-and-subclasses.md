# regular items

info is found here https://wowpedia.fandom.com/wiki/ItemType

## Quality to int

```
export const itemQuality: ItemQuality[] = [
  {
    name: 'Common',
    value: 1
  },
  {
    name: 'Uncommon',
    value: 2
  },
  {
    name: 'Rare',
    value: 3
  },
  {
    name: 'Epic',
    value: 4
  },
  {
    name: 'Legendary',
    value: 5
  },
  {
    name: 'Artifact',
    value: 6
  },
  {
    name: 'Heirloom',
    value: 7
  }
]
```

## Classes:

```
{
    "Consumable": 0,
    "Container": 1,
    "Weapon": 2,
    "Gem": 3,
    "Armor": 4,
    "Tradegoods": 7,
    "Item Enhancement": 8,
    "Recipe": 9,
    "Quest Item": 12,
    "Miscellaneous": 15,
    "Glyph": 16,
    "Battle Pet": 17,
    "Profession": 19,
    "Housing": 20
}
```

## subclasses

note that toys are scrapped from wowhead and a custom category, that we change manually in the db

```
{
    "Consumable": {
        "Generic": 0,
        "Potion": 1,
        "Elixir": 2,
        "Flasks & Phials": 3,
        "Food & Drink": 4,
        "Food & Drink 2": 5,
        "Bandage": 6,
        "Other": 7,
        "Other 2": 8,
        "Vantus Rune": 9,
        "Toys": 199
    },
    "Container": {
        "Bag": 0,
        "Soul Bag": 1,
        "Herb Bag": 2,
        "Enchanting Bag": 3,
        "Engineering Bag": 4,
        "Gem Bag": 5,
        "Mining Bag": 6,
        "Leatherworking Bag": 7,
        "Inscription Bag": 8,
        "Tackle Box": 9,
        "Cooking Bag": 10
    },
    "Weapon": {
        "One-Handed Axes": 0,
        "Two-Handed Axes": 1,
        "Bows": 2,
        "Guns": 3,
        "One-Handed Maces": 4,
        "Two-Handed Maces": 5,
        "Polearms": 6,
        "One-Handed Swords": 7,
        "Two-Handed Swords": 8,
        "Warglaives": 9,
        "Staves": 10,
        "Bear Claws": 11,
        "Cat Claws": 12,
        "Fist Weapons": 13,
        "Miscellaneous": 14,
        "Daggers": 15,
        "Thrown": 16,
        "Crossbows": 18,
        "Wands": 19,
        "Fishing Poles": 20
    },
    "Gem": {
        "Intellect": 0,
        "Agility": 1,
        "Strength": 2,
        "Stamina": 3,
        "Spirit": 4,
        "Critical Strike": 5,
        "Mastery": 6,
        "Haste": 7,
        "Versatility": 8,
        "Other": 9,
        "Multiple Stats": 10,
        "Artifact Relic": 11
    },
    "Armor": {
        "Miscellaneous: Trinkets, Rings, Necks, Spellstones, Firestones, etc.": 0,
        "Cloth": 1,
        "Leather": 2,
        "Mail": 3,
        "Plate": 4,
        "Cosmetic": 5,
        "Shields": 6,
        "Librams": 7,
        "Idols": 8,
        "Totems": 9,
        "Sigils": 10,
        "Relic": 11
    },
    "Tradegoods": {
        "Parts": 1,
        "Jewelcrafting": 4,
        "Cloth": 5,
        "Leather": 6,
        "Metal & Stone": 7,
        "Cooking": 8,
        "Herb": 9,
        "Elemental": 10,
        "Other": 11,
        "Enchanting": 12,
        "Inscription": 16,
        "Optional Reagents" 18,
        "Finishing Reagents": 19
    },
    "Item Enhancement": {
        "Head": 0,
        "Neck": 1,
        "Shoulder": 2,
        "Cloak": 3,
        "Chest": 4,
        "Wrist": 5,
        "Hands": 6,
        "Waist": 7,
        "Legs": 8,
        "Feet": 9,
        "Finger": 10,
        "One-Handed Weapon": 11,
        "Two-Handed Weapon": 12,
        "Shield/Off-hand": 13,
        "Misc": 14
    },
    "Recipe": {
        "Book": 0,
        "Leatherworking": 1,
        "Tailoring": 2,
        "Engineering": 3,
        "Blacksmithing": 4,
        "Cooking": 5,
        "Alchemy": 6,
        "First Aid": 7,
        "Enchanting": 8,
        "Fishing": 9,
        "Jewelcrafting": 10,
        "Inscription": 11
    },
    "Quest Item": {
        "Quest Item": 0
    },
    "Miscellaneous": {
        "Junk": 0,
        "Reagent": 1,
        "Companion Pets": 2,
        "Holiday": 3,
        "Other": 4,
        "Mount": 5,
        "Mount Equipment": 6,
        "Toys": 199
    },
    "Glyph": {
        "Warrior": 1,
        "Paladin": 2,
        "Hunter": 3,
        "Rogue": 4,
        "Priest": 5,
        "Death Knight": 6,
        "Shaman": 7,
        "Mage": 8,
        "Warlock": 9,
        "Monk": 10,
        "Druid": 11,
        "Demon Hunter": 12
    },
    "Battle Pet": {
        "Humanoid": 0,
        "Dragonkin": 1,
        "Flying": 2,
        "Undead": 3,
        "Critter": 4,
        "Magic": 5,
        "Elemental": 6,
        "Beast": 7,
        "Aquatic": 8,
        "Mechanical": 9
    },
    "Profession": {
        "Blacksmithing": 0,
        "Leatherworking": 1,
        "Alchemy": 2,
        "Herbalism": 3,
        "Cooking": 4,
        "Mining": 5,
        "Tailoring": 6,
        "Engineering": 7,
        "Enchanting": 8,
        "Fishing": 9,
        "Skinning": 10,
        "Jewelcrafting": 11,
        "Inscription": 12,
        "Archaeology": 13
    },
    "Housing": {
        "Decor": 0
    }
}
```

# pets

for pets we have custom categories:

```
{
  "-1": "Vendor Pets",
  "-2": "Crafted Pets",
  "-3": "Top rated pets from https://www.warcraftpets.com/wow-pets/top-twenty/"
}
```
