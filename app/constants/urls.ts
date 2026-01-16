/**
 * Application-wide constants for external links, URLs, and fixed strings
 * Centralizes repeated hardcoded values to improve maintainability
 */

// External social media and support links
export const EXTERNAL_LINKS = {
  PATREON: 'https://www.patreon.com/indopan',
  GITHUB_WIKI: 'https://github.com/ff14-advanced-market-search/saddlebag-with-pockets/wiki',
  DISCORD: 'https://discord.gg/saddlebag-exchange-973380473281724476',
  YOUTUBE: 'https://www.youtube.com/@saddlebagexchange',
  GITHUB: 'https://github.com/ff14-advanced-market-search/saddlebag-with-pockets'
} as const

// API endpoints
export const API_ENDPOINTS = {
  UNIVERSALIS: 'https://universalis.app'
} as const

// Game-related constants
export const GAME_NAMES = {
  FFXIV: 'Final Fantasy XIV',
  WOW: 'World of Warcraft',
  GW2: 'Guild Wars 2'
} as const

// Legal/copyright text
export const COPYRIGHT_TEXT = {
  FFXIV: 'FINAL FANTASY is a registered trademark of Square Enix Holdings Co., Ltd. © SQUARE ENIX CO., LTD. All Rights Reserved.',
  WOW: 'WORLD OF WARCRAFT is a registered trademark of Blizzard Entertainment, Inc. © BLIZZARD ENTERTAINMENT, INC. All Rights Reserved.',
  GW2: 'GUILD WARS 2 is a registered trademark of ArenaNet, Inc. © ARENANET, INC. All Rights Reserved.'
} as const
