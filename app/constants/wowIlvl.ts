/**
 * Single source of truth for WoW ilvl shopping list and export search.
 * Update these when a new patch changes BOE levels or supported items.
 */

/** Available BOE item levels for the current patch */
export const WOW_ILVL_LEVELS = [115, 128, 141, 154] as const

/** Default minimum item level for the ilvl form */
export const WOW_ILVL_DEFAULT = 141

/** Patch label for copy (e.g. "11.2") */
export const WOW_ILVL_PATCH = '11.2'

/** Display string for BOE levels in tooltips/notes: "115, 128, 141, or 154" */
export const WOW_ILVL_LEVELS_DISPLAY =
  WOW_ILVL_LEVELS.length > 1
    ? `${WOW_ILVL_LEVELS.slice(0, -1).join(', ')} or ${
        WOW_ILVL_LEVELS[WOW_ILVL_LEVELS.length - 1]
      }`
    : String(WOW_ILVL_LEVELS[0])

/** Supported raid BOE item names (shown in form descriptions) */
export const WOW_ILVL_SUPPORTED_ITEMS = [
  'Harvested Creephide Cord',
  'Bone-Melted Faceplate',
  "Voidhound Trainer's Boots",
  'Veiled Manta Vest',
  "Acolyte's Infused Leggings",
  "Zadus's Liturgical Hat",
  "Jak'tull's Intruder Stompers",
  'Entropy',
  "Technomancer's Service Sandals"
] as const

/** Bullet-list string for form description (Supports the following items: ...) */
export const WOW_ILVL_SUPPORTED_ITEMS_DESCRIPTION =
  WOW_ILVL_SUPPORTED_ITEMS.map((name) => `- ${name}`).join('\n          ')
