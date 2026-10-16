import type { RumBeforeSend } from '@datadog/browser-rum'
import { createResizeObserverBeforeSend } from './resizeObserverReporting'

// Only fixed page categories are included; item IDs, slugs, search text, and
// arbitrary query parameters must never become debugging attributes.
const searchTypes = new Set([
  'best-deals',
  'craftsim',
  'export-search',
  'extended-history',
  'full-scan',
  'gc-seal-crafting',
  'gc-seals-exchange',
  'ilvl-export-search',
  'ilvl-shopping-list',
  'item-data',
  'item-data-detailed',
  'item-history',
  'itemlist',
  'legacy-marketshare',
  'listings',
  'marketshare',
  'out-of-stock',
  'pet-marketshare',
  'price-alert',
  'previous-search',
  'quantity-manipulation',
  'recommended',
  'region-undercut',
  'scrip-exchange',
  'self-purchase',
  'shopping-list',
  'shortage-predictor',
  'shortages',
  'ultrarare',
  'upload-timers',
  'weekly-price-group-delta',
  'weekly-price-group-delta-recommended',
  'world-comparison'
])

/** Derive a few bounded attributes from the event's own view, not the live tab. */
function getDebugContext(viewUrl: string): Record<string, string> | undefined {
  let url: URL
  try {
    url = new URL(viewUrl)
  } catch {
    return undefined
  }

  const [, section, page] = url.pathname.split('/')
  const game = section === 'queries' ? 'ffxiv' : section
  if (game !== 'wow' && game !== 'ffxiv' && game !== 'gw2') return undefined

  const context: Record<string, string> = { game }
  if (searchTypes.has(page)) context.search_type = page

  if (game === 'wow') {
    const region = url.searchParams.get('region')
    if (region === 'NA' || region === 'EU') context.region = region
  }
  return context
}

/** Enrich existing errors and views without collecting any additional events. */
export function createRumBeforeSend(): RumBeforeSend {
  const resizeBeforeSend = createResizeObserverBeforeSend()
  let previousUrl: string | undefined
  let debugContext: Record<string, string> | undefined

  return (event, context) => {
    if (resizeBeforeSend(event, context) === false) return false
    if (event.type !== 'error' && event.type !== 'view') return true

    // View updates often repeat the same URL. Keep only the most recent result,
    // bounding memory without adding a listener, timer, or extra SDK call.
    if (previousUrl !== event.view.url) {
      previousUrl = event.view.url
      debugContext = getDebugContext(event.view.url)
    }
    if (debugContext) {
      event.context = { ...event.context, app_debug: debugContext }
    }
    return true
  }
}
