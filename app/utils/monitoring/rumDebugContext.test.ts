import type {
  RumErrorEvent,
  RumResourceEvent,
  RumViewEvent
} from '@datadog/browser-rum'
import { describe, expect, it } from 'vitest'
import { createRumBeforeSend } from './rumDebugContext'

const origin = 'https://saddlebagexchange.com'
const viewContext = { location: {} as Location }

function viewEvent(path: string): RumViewEvent {
  return {
    type: 'view',
    view: { id: 'view-1', url: `${origin}${path}` }
  } as RumViewEvent
}

function errorEvent(message: string): RumErrorEvent {
  return {
    type: 'error',
    view: { id: 'view-1', url: `${origin}/wow/marketshare?region=EU` },
    error: { message, source: 'source', handling: 'unhandled' }
  } as RumErrorEvent
}

describe('RUM debugging context', () => {
  it.each(['wow', 'ffxiv', 'gw2'])(
    'adds the game and fixed search category for %s views',
    (game) => {
      const event = viewEvent(`/${game}/marketshare`)
      expect(createRumBeforeSend()(event, viewContext)).toBe(true)
      expect(event.context?.app_debug).toEqual({
        game,
        search_type: 'marketshare'
      })
    }
  )

  it('includes only the allowed WoW region, without copying search parameters', () => {
    const event = viewEvent(
      '/wow/marketshare?region=EU&search=private-text&token=private-token'
    )
    event.context = { existing: 'preserved' }
    createRumBeforeSend()(event, viewContext)
    expect(event.context).toEqual({
      existing: 'preserved',
      app_debug: { game: 'wow', search_type: 'marketshare', region: 'EU' }
    })
  })

  it.each(['full-scan', 'item-data', 'listings'])(
    'recognizes the FFXIV /queries/%s route family',
    (page) => {
      const event = viewEvent(`/queries/${page}/12345?region=EU`)
      createRumBeforeSend()(event, viewContext)
      expect(event.context?.app_debug).toEqual({
        game: 'ffxiv',
        search_type: page
      })
    }
  )

  it.each(['/wow/marketshare?region=private', '/ffxiv/marketshare?region=EU'])(
    'does not attach unsupported region data from %s',
    (path) => {
      const event = viewEvent(path)
      createRumBeforeSend()(event, viewContext)
      expect(event.context?.app_debug).not.toHaveProperty('region')
    }
  )

  it.each(['/wow/item-data/12345', '/wow/item-data/private-slug'])(
    'does not copy dynamic segments from %s',
    (path) => {
      const event = viewEvent(path)
      createRumBeforeSend()(event, viewContext)
      expect(event.context?.app_debug).toEqual({
        game: 'wow',
        search_type: 'item-data'
      })
    }
  )

  it('does not turn unknown page names into attributes', () => {
    const event = viewEvent('/wow/private-slug')
    createRumBeforeSend()(event, viewContext)
    expect(event.context?.app_debug).toEqual({ game: 'wow' })
  })

  it('uses each event URL when older views update after a navigation', () => {
    const beforeSend = createRumBeforeSend()
    const oldView = viewEvent('/wow/marketshare?region=NA')
    const newView = viewEvent('/gw2/best-deals')
    beforeSend(oldView, viewContext)
    beforeSend(newView, viewContext)
    beforeSend(oldView, viewContext)
    expect(oldView.context?.app_debug).toEqual({
      game: 'wow',
      search_type: 'marketshare',
      region: 'NA'
    })
    expect(newView.context?.app_debug).toEqual({
      game: 'gw2',
      search_type: 'best-deals'
    })
  })

  it('leaves unrelated pages, malformed URLs, and resources unchanged', () => {
    const beforeSend = createRumBeforeSend()
    const unrelated = viewEvent('/blog/private-slug')
    const malformed = viewEvent('/')
    malformed.view.url = 'not a URL'
    const resource = {
      type: 'resource',
      view: { url: `${origin}/wow/marketshare` }
    } as RumResourceEvent
    beforeSend(unrelated, viewContext)
    beforeSend(malformed, viewContext)
    beforeSend(resource, { isManual: true })
    expect(unrelated.context).toBeUndefined()
    expect(malformed.context).toBeUndefined()
    expect(resource.context).toBeUndefined()
  })

  it('preserves the ResizeObserver sampler and its warning totals', () => {
    const warning =
      'ResizeObserver loop completed with undelivered notifications.'
    const beforeSend = createRumBeforeSend()
    const first = errorEvent(warning)
    const duplicate = errorEvent(warning)
    expect(beforeSend(first, { error: warning })).toBe(true)
    expect(beforeSend(duplicate, { error: warning })).toBe(false)
    expect(first.context?.app_debug).toEqual({
      game: 'wow',
      search_type: 'marketshare',
      region: 'EU'
    })
    const view = viewEvent('/wow/marketshare?region=EU')
    beforeSend(view, viewContext)
    expect(view.context?.resize_observer_monitoring).toMatchObject({
      observed_count: 2,
      suppressed_count: 1
    })
    expect(view.context?.app_debug).toEqual(first.context?.app_debug)
  })

  it('keeps ordinary errors and their stacks unchanged', () => {
    const error = new Error('Unexpected search failure')
    const event = errorEvent(error.message)
    event.error.stack = error.stack
    const before = { ...event.error }
    expect(createRumBeforeSend()(event, { error })).toBe(true)
    expect(event.error).toEqual(before)
  })
})
