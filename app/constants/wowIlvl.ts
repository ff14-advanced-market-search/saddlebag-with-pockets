/**
 * Single source of truth for WoW ilvl shopping list and export search.
 * Update these when a new patch changes BOE levels or supported items.
 */

/** Available BOE item levels for the current patch */
/** Seems to always be 13 item levels apart */
export const WOW_ILVL_LEVELS = [227, 240, 253, 266] as const

/** Default minimum item level for the ilvl form */
export const WOW_ILVL_DEFAULT = 106

/** Patch label for copy */
export const WOW_ILVL_PATCH = '12.0'

/** Display string for BOE levels in tooltips/notes: "115, 128, 141, or 154" */
export const WOW_ILVL_LEVELS_DISPLAY =
  WOW_ILVL_LEVELS.length > 1
    ? `${WOW_ILVL_LEVELS.slice(0, -1).join(', ')} or ${
        WOW_ILVL_LEVELS[WOW_ILVL_LEVELS.length - 1]
      }`
    : String(WOW_ILVL_LEVELS[0])

/** Supported raid BOE item names (shown in form descriptions) */
export const WOW_ILVL_SUPPORTED_ITEMS = [
  'Visage of Unseen Truths',
  'Infernal Greatlock Girdle',
  "Nullstrider's Boots",
  'Power Stance Breeches',
  'Primal Spark Pauldrons',
  'Raging Storm Sash',
  'Breastplate of the Final Defense',
  'Fading Dawn Sabatons',
  "Sin'dorei Scribe's Spectacles",
  'Improved Right-Handed Magnifying Glass',
  "Sin'dorei Jeweler's Loupes",
  "Sin'dorei Enchanter's Crystal",
  'Runed Brilliant Silver Rod',
  "Sin'dorei Herbalist's Backpack",
  "Sin'dorei Hunter's Pack",
  "Eversong Hunter's Headcover",
  "Sin'dorei Engineer's Gloves",
  "Sin'dorei Leathershaper's Smock",
  "Sin'dorei Alchemist's Hat",
  "Sin'dorei Forgemaster's Cover",
  "Sin'dorei Jeweler's Cover",
  "Sin'dorei Snippers",
  "Sin'dorei Headlamp",
  "Sin'dorei Angler's Rod",
  "Sin'dorei Clampers",
  "Sin'dorei Gilded Hardhat",
  "Turbo-Junker's Multitool v1",
  "Junker's Big Ol' Bag",
  "Sin'dorei Quill",
  "Sin'dorei Alchemist's Mixing Rod",
  "Sin'dorei Rolling Pin"
] as const

/** Bullet-list string for form description (Supports the following items: ...) */
export const WOW_ILVL_SUPPORTED_ITEMS_DESCRIPTION =
  WOW_ILVL_SUPPORTED_ITEMS.map((name) => `- ${name}`).join('\n          ')
