/**
 * Blog Components Registry
 *
 * This file exports all blog post components by name.
 * Components are dynamically loaded based on the 'component' field in blogPosts configuration.
 */
import type { MetaFunction } from '@remix-run/cloudflare'

import type React from 'react'
import FFXIVBs2 from './FFXIVBs2'
import FFXIVBs6 from './FFXIVBs6'
import FFXIVBs11 from './FFXIVBs11'
import FFXIVHowToResell from './FFXIVHowToResell'
import FFXIVUndercut from './FFXIVUndercut'

import WoWTLDR from './WoWTLDR'
import WoWCrossRealm1 from './WoWCrossRealm1'
import WoWAdvancedStrategies from './WoWAdvancedStrategies'

import ResearchPost2 from './ResearchPost2'

import * as FFXIVBs2Meta from './FFXIVBs2'
import * as FFXIVBs6Meta from './FFXIVBs6'
import * as FFXIVBs11Meta from './FFXIVBs11'
import * as FFXIVHowToResellMeta from './FFXIVHowToResell'
import * as FFXIVUndercutMeta from './FFXIVUndercut'
import * as WoWTLDRMeta from './WoWTLDR'
import * as WoWCrossRealm1Meta from './WoWCrossRealm1'
import * as WoWAdvancedStrategiesMeta from './WoWAdvancedStrategies'
import * as ResearchPost2Meta from './ResearchPost2'

export const blogComponents: Record<string, React.ComponentType> = {
  FFXIVBs2,
  FFXIVBs6,
  FFXIVBs11,
  FFXIVHowToResell,
  FFXIVUndercut,
  WoWTLDR,
  WoWCrossRealm1,
  WoWAdvancedStrategies,
  ResearchPost2
}

export const blogMetaFunctions: Record<string, MetaFunction | undefined> = {
  FFXIVBs2: FFXIVBs2Meta.meta,
  FFXIVBs6: FFXIVBs6Meta.meta,
  FFXIVBs11: FFXIVBs11Meta.meta,
  FFXIVHowToResell: FFXIVHowToResellMeta.meta,
  FFXIVUndercut: FFXIVUndercutMeta.meta,
  WoWTLDR: WoWTLDRMeta.meta,
  WoWCrossRealm1: WoWCrossRealm1Meta.meta,
  WoWAdvancedStrategies: WoWAdvancedStrategiesMeta.meta,
  ResearchPost2: ResearchPost2Meta.meta
}
