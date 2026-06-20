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
import FFXIVTLDR from './FFXIVTLDR'
import FFXIVUndercut from './FFXIVUndercut'

import WoWTLDR from './WoWTLDR'
import WoWCrossRealm1 from './WoWCrossRealm1'
import WoWAdvancedStrategies from './WoWAdvancedStrategies'

import ResearchPost1 from './ResearchPost1'
import ResearchPost2 from './ResearchPost2'
import ResearchPost3 from './ResearchPost3'
import WikiBlog from './WikiBlog'

import * as FFXIVBs2Meta from './FFXIVBs2'
import * as FFXIVBs6Meta from './FFXIVBs6'
import * as FFXIVBs11Meta from './FFXIVBs11'
import * as FFXIVHowToResellMeta from './FFXIVHowToResell'
import * as FFXIVTLDRMeta from './FFXIVTLDR'
import * as FFXIVUndercutMeta from './FFXIVUndercut'
import * as WoWTLDRMeta from './WoWTLDR'
import * as WoWCrossRealm1Meta from './WoWCrossRealm1'
import * as WoWAdvancedStrategiesMeta from './WoWAdvancedStrategies'
import * as ResearchPost1Meta from './ResearchPost1'
import * as ResearchPost2Meta from './ResearchPost2'
import * as ResearchPost3Meta from './ResearchPost3'

export const blogComponents: Record<string, React.ComponentType> = {
  FFXIVBs2,
  FFXIVBs6,
  FFXIVBs11,
  FFXIVHowToResell,
  FFXIVTLDR,
  FFXIVUndercut,
  WoWTLDR,
  WoWCrossRealm1,
  WoWAdvancedStrategies,
  ResearchPost1,
  ResearchPost2,
  ResearchPost3,
  WikiBlog
}

export const blogMetaFunctions: Record<string, MetaFunction | undefined> = {
  FFXIVBs2: FFXIVBs2Meta.meta,
  FFXIVBs6: FFXIVBs6Meta.meta,
  FFXIVBs11: FFXIVBs11Meta.meta,
  FFXIVHowToResell: FFXIVHowToResellMeta.meta,
  FFXIVTLDR: FFXIVTLDRMeta.meta,
  FFXIVUndercut: FFXIVUndercutMeta.meta,
  WoWTLDR: WoWTLDRMeta.meta,
  WoWCrossRealm1: WoWCrossRealm1Meta.meta,
  WoWAdvancedStrategies: WoWAdvancedStrategiesMeta.meta,
  ResearchPost1: ResearchPost1Meta.meta,
  ResearchPost2: ResearchPost2Meta.meta,
  ResearchPost3: ResearchPost3Meta.meta,
  WikiBlog: undefined
}
