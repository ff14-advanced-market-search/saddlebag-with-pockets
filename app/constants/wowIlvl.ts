/**
 * Single source of truth for WoW ilvl shopping list and export search.
 * Update these when a new patch changes BOE levels or supported items.
 */

/** Default minimum item level for the ilvl form */
export const WOW_ILVL_DEFAULT = 106

/** Patch label for copy */
export const WOW_ILVL_PATCH = '12.0'

/** Available BOE item levels for the current patch */
/** Seems to always be 13 item levels apart */
export const WOW_BOE_ILVLS = [227, 240, 253, 266] as const
export const WOW_TOOL_ILVLS = [206, 212, 218, 225, 232] as const

/** Display string for BOE levels in tooltips/notes: "115, 128, 141, or 154" */
export const WOW_ILVL_LEVELS_DISPLAY =
  WOW_BOE_ILVLS.length > 1
    ? `${WOW_BOE_ILVLS.slice(0, -1).join(', ')} or ${
        WOW_BOE_ILVLS[WOW_BOE_ILVLS.length - 1]
      }`
    : String(WOW_BOE_ILVLS[0])
/** Display string for profession tool levels in tooltips/notes */
export const WOW_TOOL_LEVELS_DISPLAY =
  WOW_TOOL_ILVLS.length > 1
    ? `${WOW_TOOL_ILVLS.slice(0, -1).join(', ')} or ${
        WOW_TOOL_ILVLS[WOW_TOOL_ILVLS.length - 1]
      }`
    : String(WOW_TOOL_ILVLS[0])

/** Supported raid BOE gear names (shown in form descriptions) */
export const WOW_ILVL_SUPPORTED_RAID_GEAR = [
  'Visage of Unseen Truths',
  'Infernal Greatlock Girdle',
  "Nullstrider's Boots",
  'Power Stance Breeches',
  'Primal Spark Pauldrons',
  'Raging Storm Sash',
  'Breastplate of the Final Defense',
  'Fading Dawn Sabatons'
] as const

/** Supported profession tool names (shown in form descriptions) */
export const WOW_ILVL_SUPPORTED_TOOLS = [
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
