/**
 * Blog Components Registry
 *
 * This file exports all blog post components by name.
 * Components are dynamically loaded based on the 'component' field in blogPosts configuration.
 */
import type { MetaFunction } from '@remix-run/cloudflare'

import type React from 'react'
import FFXIVBs1 from './FFXIVBs1'
import FFXIVBs2 from './FFXIVBs2'
import FFXIVBs3 from './FFXIVBs3'
import FFXIVBs4 from './FFXIVBs4'
import FFXIVBs5 from './FFXIVBs5'
import FFXIVBs6 from './FFXIVBs6'
import FFXIVBs7 from './FFXIVBs7'
import FFXIVBs8 from './FFXIVBs8'
import FFXIVBs9 from './FFXIVBs9'
import FFXIVBs10 from './FFXIVBs10'
import FFXIVBs11 from './FFXIVBs11'
import FFXIVBs12 from './FFXIVBs12'
import FFXIVBs13 from './FFXIVBs13'
import FFXIVBs14 from './FFXIVBs14'
import FFXIVBs15 from './FFXIVBs15'
import FFXIVBs16 from './FFXIVBs16'
import FFXIVBs17 from './FFXIVBs17'
import FFXIVAdvancedCrafting from './FFXIVAdvancedCrafting'
import FFXIVHowToResell from './FFXIVHowToResell'
import FFXIVMarketMastery from './FFXIVMarketMastery'
import FFXIVUndercut from './FFXIVUndercut'

import WoWTLDR from './WoWTLDR'
import WoWCrossRealm1 from './WoWCrossRealm1'
import WoWAdvancedStrategies from './WoWAdvancedStrategies'
import WoWMarketDomination from './WoWMarketDomination'
import WoWSkyCoach from './WoWSkyCoach'
import WoWSkyCoachMoPGold from './WoWSkyCoachMoPGold'
import WoWSkyCoachDelves from './WoWSkyCoachDelves'

import MMOEconomicsTheory from './MMOEconomicsTheory'
import MMOFutureEconomies from './MMOFutureEconomies'

import TradingAutomationTools from './TradingAutomationTools'

import ResearchPost1 from './ResearchPost1'
import ResearchPost2 from './ResearchPost2'
import ResearchPost3 from './ResearchPost3'

// Import meta functions from components
import * as FFXIVBs1Meta from './FFXIVBs1'
import * as FFXIVBs2Meta from './FFXIVBs2'
import * as FFXIVBs3Meta from './FFXIVBs3'
import * as FFXIVBs4Meta from './FFXIVBs4'
import * as FFXIVBs5Meta from './FFXIVBs5'
import * as FFXIVBs6Meta from './FFXIVBs6'
import * as FFXIVBs7Meta from './FFXIVBs7'
import * as FFXIVBs8Meta from './FFXIVBs8'
import * as FFXIVBs9Meta from './FFXIVBs9'
import * as FFXIVBs10Meta from './FFXIVBs10'
import * as FFXIVBs11Meta from './FFXIVBs11'
import * as FFXIVBs12Meta from './FFXIVBs12'
import * as FFXIVBs13Meta from './FFXIVBs13'
import * as FFXIVBs14Meta from './FFXIVBs14'
import * as FFXIVBs15Meta from './FFXIVBs15'
import * as FFXIVBs16Meta from './FFXIVBs16'
import * as FFXIVBs17Meta from './FFXIVBs17'
import * as FFXIVAdvancedCraftingMeta from './FFXIVAdvancedCrafting'
import * as FFXIVHowToResellMeta from './FFXIVHowToResell'
import * as FFXIVMarketMasteryMeta from './FFXIVMarketMastery'
import * as FFXIVUndercutMeta from './FFXIVUndercut'
import * as WoWTLDRMeta from './WoWTLDR'
import * as WoWCrossRealm1Meta from './WoWCrossRealm1'
import * as WoWAdvancedStrategiesMeta from './WoWAdvancedStrategies'
import * as WoWMarketDominationMeta from './WoWMarketDomination'
import * as WoWSkyCoachMeta from './WoWSkyCoach'
import * as WoWSkyCoachMoPGoldMeta from './WoWSkyCoachMoPGold'
import * as WoWSkyCoachDelvesMeta from './WoWSkyCoachDelves'
import * as MMOEconomicsTheoryMeta from './MMOEconomicsTheory'
import * as MMOFutureEconomiesMeta from './MMOFutureEconomies'
import * as TradingAutomationToolsMeta from './TradingAutomationTools'
import * as ResearchPost1Meta from './ResearchPost1'
import * as ResearchPost2Meta from './ResearchPost2'
import * as ResearchPost3Meta from './ResearchPost3'

export const blogComponents: Record<string, React.ComponentType> = {
  // FFXIV Blog Series
  FFXIVBs1,
  FFXIVBs2,
  FFXIVBs3,
  FFXIVBs4,
  FFXIVBs5,
  FFXIVBs6,
  FFXIVBs7,
  FFXIVBs8,
  FFXIVBs9,
  FFXIVBs10,
  FFXIVBs11,
  FFXIVBs12,
  FFXIVBs13,
  FFXIVBs14,
  FFXIVBs15,
  FFXIVBs16,
  FFXIVBs17,
  FFXIVAdvancedCrafting,
  FFXIVHowToResell,
  FFXIVMarketMastery,
  FFXIVUndercut,

  // WoW Blog Posts
  WoWTLDR,
  WoWCrossRealm1,
  WoWAdvancedStrategies,
  WoWMarketDomination,
  WoWSkyCoach,
  WoWSkyCoachMoPGold,
  WoWSkyCoachDelves,

  // MMO Economics
  MMOEconomicsTheory,
  MMOFutureEconomies,

  // Trading
  TradingAutomationTools,

  // Research Posts
  ResearchPost1,
  ResearchPost2,
  ResearchPost3
}

// Meta functions registry - maps component names to their meta exports
export const blogMetaFunctions: Record<string, MetaFunction | undefined> = {
  FFXIVBs1: FFXIVBs1Meta.meta,
  FFXIVBs2: FFXIVBs2Meta.meta,
  FFXIVBs3: FFXIVBs3Meta.meta,
  FFXIVBs4: FFXIVBs4Meta.meta,
  FFXIVBs5: FFXIVBs5Meta.meta,
  FFXIVBs6: FFXIVBs6Meta.meta,
  FFXIVBs7: FFXIVBs7Meta.meta,
  FFXIVBs8: FFXIVBs8Meta.meta,
  FFXIVBs9: FFXIVBs9Meta.meta,
  FFXIVBs10: FFXIVBs10Meta.meta,
  FFXIVBs11: FFXIVBs11Meta.meta,
  FFXIVBs12: FFXIVBs12Meta.meta,
  FFXIVBs13: FFXIVBs13Meta.meta,
  FFXIVBs14: FFXIVBs14Meta.meta,
  FFXIVBs15: FFXIVBs15Meta.meta,
  FFXIVBs16: FFXIVBs16Meta.meta,
  FFXIVBs17: FFXIVBs17Meta.meta,
  FFXIVAdvancedCrafting: FFXIVAdvancedCraftingMeta.meta,
  FFXIVHowToResell: FFXIVHowToResellMeta.meta,
  FFXIVMarketMastery: FFXIVMarketMasteryMeta.meta,
  FFXIVUndercut: FFXIVUndercutMeta.meta,
  WoWTLDR: WoWTLDRMeta.meta,
  WoWCrossRealm1: WoWCrossRealm1Meta.meta,
  WoWAdvancedStrategies: WoWAdvancedStrategiesMeta.meta,
  WoWMarketDomination: WoWMarketDominationMeta.meta,
  WoWSkyCoach: WoWSkyCoachMeta.meta,
  WoWSkyCoachMoPGold: WoWSkyCoachMoPGoldMeta.meta,
  WoWSkyCoachDelves: WoWSkyCoachDelvesMeta.meta,
  MMOEconomicsTheory: MMOEconomicsTheoryMeta.meta,
  MMOFutureEconomies: MMOFutureEconomiesMeta.meta,
  TradingAutomationTools: TradingAutomationToolsMeta.meta,
  ResearchPost1: ResearchPost1Meta.meta,
  ResearchPost2: ResearchPost2Meta.meta,
  ResearchPost3: ResearchPost3Meta.meta
}
