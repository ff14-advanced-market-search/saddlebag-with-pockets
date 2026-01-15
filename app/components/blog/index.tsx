/**
 * Blog Components Registry
 *
 * This file exports all blog post components by name.
 * Components are dynamically loaded based on the 'component' field in blogPosts configuration.
 */

import React from 'react'
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
