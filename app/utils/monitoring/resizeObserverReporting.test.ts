import type {
  RumErrorEvent,
  RumErrorEventDomainContext,
  RumViewEvent
} from '@datadog/browser-rum'
import { describe, expect, it } from 'vitest'
import { createResizeObserverBeforeSend } from './resizeObserverReporting'

const warning = 'ResizeObserver loop completed with undelivered notifications.'

function errorEvent(
  message = warning,
  viewId = 'view-1',
  overrides: Partial<RumErrorEvent['error']> = {}
): RumErrorEvent {
  return {
    type: 'error',
    view: { id: viewId },
    error: {
      message,
      source: 'source',
      handling: 'unhandled',
      stack: '@ https://saddlebagexchange.com/wow/marketshare:0:0',
      ...overrides
    }
  } as RumErrorEvent
}

function viewEvent(viewId = 'view-1'): RumViewEvent {
  return { type: 'view', view: { id: viewId } } as RumViewEvent
}

const nativeContext: RumErrorEventDomainContext = { error: warning }

describe('ResizeObserver warning reporting', () => {
  it.each(
    [warning, 'ResizeObserver loop limit exceeded'].flatMap((message) => [
      message,
      `Uncaught ${message}`,
      `Uncaught ${JSON.stringify(message)}`
    ])
  )('samples the exact native warning form: %s', (message) => {
    const beforeSend = createResizeObserverBeforeSend(() => 0)
    expect(beforeSend(errorEvent(message), { error: message })).toBe(true)
    expect(beforeSend(errorEvent(message), { error: message })).toBe(false)
  })

  it('keeps the first warning in every view and samples continued warnings once per minute', () => {
    let timestamp = 0
    const beforeSend = createResizeObserverBeforeSend(() => timestamp)
    const first = errorEvent()
    expect(beforeSend(first, nativeContext)).toBe(true)
    expect(first.context?.resize_observer_monitoring).toMatchObject({
      observed_count: 1,
      reported_count: 1,
      suppressed_count: 0,
      suppressed_since_previous_sample: 0
    })

    for (let index = 0; index < 100; index += 1) {
      timestamp += 1
      expect(beforeSend(errorEvent(), nativeContext)).toBe(false)
    }
    expect(beforeSend(errorEvent(warning, 'view-2'), nativeContext)).toBe(true)
    timestamp = 59_999
    expect(beforeSend(errorEvent(), nativeContext)).toBe(false)
    timestamp = 60_000
    const next = errorEvent()
    expect(beforeSend(next, nativeContext)).toBe(true)
    expect(next.context?.resize_observer_monitoring).toEqual({
      sample_interval_ms: 60_000,
      observed_count: 103,
      reported_count: 2,
      suppressed_count: 101,
      suppressed_since_previous_sample: 101
    })
    expect(next.error).toEqual(first.error)

    timestamp = 60_001
    expect(beforeSend(errorEvent(), nativeContext)).toBe(false)
    timestamp = 120_000
    const third = errorEvent()
    expect(beforeSend(third, nativeContext)).toBe(true)
    expect(third.context?.resize_observer_monitoring).toMatchObject({
      observed_count: 105,
      reported_count: 3,
      suppressed_count: 102,
      suppressed_since_previous_sample: 1
    })
  })

  it('records remaining duplicates on view updates without dismissing the view', () => {
    const beforeSend = createResizeObserverBeforeSend(() => 0)
    beforeSend(errorEvent(), nativeContext)
    beforeSend(errorEvent(), nativeContext)
    beforeSend(errorEvent(), nativeContext)
    const view = viewEvent()
    view.context = { customer_context: 'preserved' }
    expect(beforeSend(view, { location: {} as Location })).toBe(true)
    expect(view.context).toEqual({
      customer_context: 'preserved',
      resize_observer_monitoring: {
        sample_interval_ms: 60_000,
        observed_count: 3,
        reported_count: 1,
        suppressed_count: 2,
        suppressed_since_previous_sample: 2
      }
    })
    const unaffectedView = viewEvent('other-view')
    beforeSend(unaffectedView, { location: {} as Location })
    expect(unaffectedView.context).toBeUndefined()
  })

  it.each([
    'ResizeObserver is not defined',
    `${warning} Additional failure details`,
    `TypeError: ${warning}`,
    `${warning}\nUnexpected stack details`,
    'ResizeObserver loop limit exceeded in my custom component'
  ])('leaves other messages untouched: %s', (message) => {
    const beforeSend = createResizeObserverBeforeSend(() => 0)
    const event = errorEvent(message)
    const original = structuredClone(event)
    expect(beforeSend(event, { error: message })).toBe(true)
    expect(beforeSend(event, { error: message })).toBe(true)
    expect(event).toEqual(original)
  })

  it.each([
    'console',
    'custom',
    'network',
    'logger',
    'agent',
    'report'
  ] as const)('does not sample matching errors from %s', (source) => {
    const beforeSend = createResizeObserverBeforeSend(() => 0)
    const event = errorEvent(warning, 'view-1', { source })
    expect(beforeSend(event, nativeContext)).toBe(true)
    expect(beforeSend(event, nativeContext)).toBe(true)
    expect(event.context).toBeUndefined()
  })

  it('does not hide thrown Error objects, manually handled errors, or missing native context', () => {
    const beforeSend = createResizeObserverBeforeSend(() => 0)
    const thrown = errorEvent()
    const handled = errorEvent(warning, 'view-1', { handling: 'handled' })
    for (let index = 0; index < 2; index += 1) {
      expect(beforeSend(thrown, { error: new Error(warning) })).toBe(true)
      expect(beforeSend(handled, nativeContext)).toBe(true)
      expect(beforeSend(errorEvent(), { error: undefined })).toBe(true)
      expect(beforeSend(errorEvent(), { error: 'Some other failure' })).toBe(
        true
      )
      expect(beforeSend(errorEvent(warning, ''), nativeContext)).toBe(true)
    }
  })

  it('bounds retained view state and starts a fresh sample for an evicted view', () => {
    const beforeSend = createResizeObserverBeforeSend(() => 0)
    beforeSend(errorEvent(warning, 'oldest-view'), nativeContext)
    beforeSend(errorEvent(warning, 'active-view'), nativeContext)
    for (let index = 0; index < 31; index += 1) {
      beforeSend(errorEvent(warning, `view-${index}`), nativeContext)
      expect(
        beforeSend(errorEvent(warning, 'active-view'), nativeContext)
      ).toBe(false)
    }
    const evictedView = viewEvent('oldest-view')
    beforeSend(evictedView, { location: {} as Location })
    expect(evictedView.context).toBeUndefined()
    expect(beforeSend(errorEvent(warning, 'oldest-view'), nativeContext)).toBe(
      true
    )
  })

  it('keeps existing error context and starts independent state for each initialization', () => {
    const beforeSend = createResizeObserverBeforeSend(() => 0)
    const event = errorEvent()
    event.context = { customer_context: 'preserved' }
    expect(beforeSend(event, nativeContext)).toBe(true)
    expect(event.context?.customer_context).toBe('preserved')
    expect(beforeSend(errorEvent(), nativeContext)).toBe(false)
    expect(
      createResizeObserverBeforeSend(() => 0)(errorEvent(), nativeContext)
    ).toBe(true)
  })
})
