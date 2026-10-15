import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { scheduleExternalScripts } from './externalScripts'

const GOOGLE_TAG_MANAGER_URL =
  'https://www.googletagmanager.com/gtm.js?id=GTM-WH4KFG5'
const NEXT_MILLENNIUM_URL = 'https://powerad.ai/261066107350250/script.js'

type Script = { src: string; id?: string; async?: boolean }

describe('external script lifecycle', () => {
  let scripts: Script[]
  let frames: Map<number, FrameRequestCallback>
  let browser: {
    setTimeout: typeof setTimeout
    clearTimeout: typeof clearTimeout
    requestAnimationFrame: ReturnType<typeof vi.fn>
    cancelAnimationFrame: ReturnType<typeof vi.fn>
    dataLayer?: unknown[]
  }

  const runFrames = () => {
    const callbacks = [...frames.values()]
    frames.clear()
    callbacks.forEach((callback) => {
      callback(0)
    })
  }

  const finishLoading = () => {
    vi.advanceTimersByTime(3000)
    runFrames()
  }

  beforeEach(() => {
    vi.useFakeTimers()
    scripts = []
    frames = new Map()
    let nextFrame = 0
    browser = {
      setTimeout,
      clearTimeout,
      requestAnimationFrame: vi.fn((callback: FrameRequestCallback) => {
        frames.set(++nextFrame, callback)
        return nextFrame
      }),
      cancelAnimationFrame: vi.fn((id: number) => frames.delete(id))
    }
    vi.stubGlobal('window', browser)
    vi.stubGlobal('document', {
      scripts,
      createElement: vi.fn(() => ({ src: '' })),
      body: {
        appendChild: vi.fn((script: Script) => scripts.push(script))
      }
    })
  })

  afterEach(() => {
    vi.clearAllTimers()
    vi.useRealTimers()
    vi.unstubAllGlobals()
  })

  it('loads analytics and ads after the delay and animation frame', () => {
    scheduleExternalScripts()

    vi.advanceTimersByTime(2999)
    expect(scripts).toHaveLength(0)
    expect(frames.size).toBe(0)

    vi.advanceTimersByTime(1)
    expect(scripts).toHaveLength(0)
    runFrames()

    expect(scripts.map((script) => script.src)).toEqual([
      GOOGLE_TAG_MANAGER_URL,
      NEXT_MILLENNIUM_URL
    ])
    expect(scripts.every((script) => script.async)).toBe(true)
    expect(browser.dataLayer).toEqual([
      { 'gtm.start': expect.any(Number), event: 'gtm.js' }
    ])
  })

  it('reuses scripts and starts GTM only once after a remount', () => {
    const cleanup = scheduleExternalScripts()
    finishLoading()
    cleanup()

    scheduleExternalScripts()
    finishLoading()

    expect(scripts).toHaveLength(2)
    expect(browser.dataLayer).toHaveLength(1)
  })

  it('reuses identical scripts inserted elsewhere even without our IDs', () => {
    const analyticsScript = { src: GOOGLE_TAG_MANAGER_URL }
    const adScript = { src: NEXT_MILLENNIUM_URL }
    scripts.push(analyticsScript, adScript)

    scheduleExternalScripts()
    finishLoading()

    expect(scripts).toEqual([analyticsScript, adScript])
    expect(browser.dataLayer).toBeUndefined()
  })

  it('preserves queued analytics events without duplicating a prior GTM start', () => {
    const startEvent = { 'gtm.start': 123, event: 'gtm.js' }
    const customEvent = { event: 'search' }
    browser.dataLayer = [startEvent, customEvent]

    scheduleExternalScripts()
    finishLoading()

    expect(browser.dataLayer).toEqual([startEvent, customEvent])
    expect(scripts).toHaveLength(2)
  })

  it('cancels loading before the timeout and supports a StrictMode remount', () => {
    const cleanup = scheduleExternalScripts()
    cleanup()
    finishLoading()

    expect(browser.requestAnimationFrame).not.toHaveBeenCalled()
    expect(scripts).toHaveLength(0)

    scheduleExternalScripts()
    finishLoading()

    expect(scripts).toHaveLength(2)
    expect(browser.dataLayer).toHaveLength(1)
  })

  it('cancels the queued animation frame on unmount', () => {
    const cleanup = scheduleExternalScripts()
    vi.advanceTimersByTime(3000)
    const frameId = [...frames.keys()][0]
    cleanup()
    runFrames()

    expect(browser.cancelAnimationFrame).toHaveBeenCalledWith(frameId)
    expect(scripts).toHaveLength(0)
    expect(browser.dataLayer).toBeUndefined()
  })

  it('ignores an animation callback delivered after unmount', () => {
    const cleanup = scheduleExternalScripts()
    vi.advanceTimersByTime(3000)
    const callback = [...frames.values()][0]
    cleanup()
    callback(0)

    expect(scripts).toHaveLength(0)
    expect(browser.dataLayer).toBeUndefined()
  })
})
