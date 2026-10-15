import type { RumBeforeSend, RumEvent } from '@datadog/browser-rum'

const SAMPLE_INTERVAL_MS = 60_000
const MAX_TRACKED_VIEWS = 32
const nativeMessages = [
  'ResizeObserver loop completed with undelivered notifications.',
  'ResizeObserver loop limit exceeded'
]

// With no Error object, Datadog 7 also wraps native window.onerror strings in
// `Uncaught` and JSON quotes. Keep this list exact to avoid hiding other errors.
const reportedMessages = new Set(
  nativeMessages.flatMap((message) => [
    message,
    `Uncaught ${message}`,
    `Uncaught ${JSON.stringify(message)}`
  ])
)

interface ViewWarnings {
  lastReportedAt: number
  observedCount: number
  reportedCount: number
  suppressedCount: number
  suppressedSincePreviousSample: number
}

function addWarningContext(event: RumEvent, warnings: ViewWarnings) {
  event.context = {
    ...event.context,
    resize_observer_monitoring: {
      sample_interval_ms: SAMPLE_INTERVAL_MS,
      observed_count: warnings.observedCount,
      reported_count: warnings.reportedCount,
      suppressed_count: warnings.suppressedCount,
      suppressed_since_previous_sample: warnings.suppressedSincePreviousSample
    }
  }
}

/**
 * Retain the first native ResizeObserver warning per view and at most one more
 * per minute. View context retains the observed volume, including duplicates
 * after the last sample. This limits telemetry; it does not fix a layout loop.
 *
 * There are no timers or browser listeners to clean up. The small LRU cache
 * bounds memory even in long-lived tabs; evicted views start a fresh sample.
 */
export function createResizeObserverBeforeSend(
  now: () => number = () => performance.now()
): RumBeforeSend {
  const views = new Map<string, ViewWarnings>()

  return (event, context) => {
    if (event.type === 'view') {
      const warnings = views.get(event.view.id)
      if (warnings) addWarningContext(event, warnings)
      return true
    }

    if (
      event.type !== 'error' ||
      event.error.source !== 'source' ||
      event.error.handling !== 'unhandled' ||
      !reportedMessages.has(event.error.message) ||
      !('error' in context) ||
      typeof context.error !== 'string' ||
      !reportedMessages.has(context.error) ||
      !event.view.id
    ) {
      return true
    }

    const timestamp = now()
    let warnings = views.get(event.view.id)
    warnings ??= {
      lastReportedAt: timestamp,
      observedCount: 0,
      reportedCount: 0,
      suppressedCount: 0,
      suppressedSincePreviousSample: 0
    }

    // Touch the entry on each warning, keeping active views when space runs out.
    views.delete(event.view.id)
    views.set(event.view.id, warnings)
    if (views.size > MAX_TRACKED_VIEWS) {
      const oldestView = views.keys().next()
      if (!oldestView.done) views.delete(oldestView.value)
    }

    warnings.observedCount += 1
    if (
      warnings.reportedCount > 0 &&
      timestamp - warnings.lastReportedAt < SAMPLE_INTERVAL_MS
    ) {
      warnings.suppressedCount += 1
      warnings.suppressedSincePreviousSample += 1
      return false
    }

    warnings.lastReportedAt = timestamp
    warnings.reportedCount += 1
    addWarningContext(event, warnings)
    warnings.suppressedSincePreviousSample = 0
    return true
  }
}
