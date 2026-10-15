import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { observeContainerWidth } from './observeContainerWidth'

describe('observeContainerWidth', () => {
  let width: number
  let container: HTMLElement
  let notify: () => void
  let nextFrame: number
  let frames: Map<number, FrameRequestCallback>
  let disconnect: ReturnType<typeof vi.fn>
  let observe: ReturnType<typeof vi.fn>
  let addEventListener: ReturnType<typeof vi.fn>
  let removeEventListener: ReturnType<typeof vi.fn>
  let cancelAnimationFrame: ReturnType<typeof vi.fn>

  const flushFrame = () => {
    const pending = [...frames.values()]
    frames.clear()
    pending.forEach((callback) => callback(0))
  }

  beforeEach(() => {
    width = 800
    container = {
      get clientWidth() {
        return width
      }
    } as HTMLElement
    nextFrame = 0
    frames = new Map()
    disconnect = vi.fn()
    observe = vi.fn()
    addEventListener = vi.fn()
    removeEventListener = vi.fn()
    cancelAnimationFrame = vi.fn((id: number) => frames.delete(id))

    vi.stubGlobal(
      'ResizeObserver',
      class {
        constructor(callback: () => void) {
          notify = callback
        }
        observe = observe
        disconnect = disconnect
      }
    )
    vi.stubGlobal('window', {
      requestAnimationFrame: vi.fn((callback: FrameRequestCallback) => {
        frames.set(++nextFrame, callback)
        return nextFrame
      }),
      cancelAnimationFrame,
      addEventListener,
      removeEventListener
    })
  })

  afterEach(() => vi.unstubAllGlobals())

  it('defers writes outside the observer callback and coalesces notifications', () => {
    const resize = vi.fn()
    const cleanup = observeContainerWidth(container, resize)
    expect(observe).toHaveBeenCalledWith(container)
    notify()
    notify()
    expect(resize).not.toHaveBeenCalled()
    expect(frames.size).toBe(1)

    flushFrame()
    expect(resize).toHaveBeenCalledExactlyOnceWith(800)

    width = 700
    notify()
    width = 600
    notify()
    expect(resize).toHaveBeenCalledTimes(1)
    flushFrame()
    expect(resize).toHaveBeenLastCalledWith(600)
    expect(resize).toHaveBeenCalledTimes(2)
    cleanup()
  })

  it('does not resize again for unchanged widths or chart height changes', () => {
    const resize = vi.fn(() => notify())
    const cleanup = observeContainerWidth(container, resize)
    flushFrame()
    // Even a size notification caused by the chart's own write must settle.
    flushFrame()
    notify()
    flushFrame()
    expect(resize).toHaveBeenCalledExactlyOnceWith(800)
    expect(frames.size).toBe(0)
    cleanup()
  })

  it('skips hidden containers and resizes when they become visible', () => {
    width = 0
    const resize = vi.fn()
    const cleanup = observeContainerWidth(container, resize)
    flushFrame()
    expect(resize).not.toHaveBeenCalled()

    width = 360
    notify()
    flushFrame()
    expect(resize).toHaveBeenCalledExactlyOnceWith(360)
    width = 0
    notify()
    flushFrame()
    expect(resize).toHaveBeenCalledTimes(1)
    width = 500
    notify()
    flushFrame()
    expect(resize).toHaveBeenLastCalledWith(500)
    cleanup()
  })

  it('disconnects and cancels pending work, including late notifications', () => {
    const resize = vi.fn()
    const cleanup = observeContainerWidth(container, resize)
    const pendingCallback = [...frames.values()][0]
    cleanup()
    expect(disconnect).toHaveBeenCalledOnce()
    expect(cancelAnimationFrame).toHaveBeenCalledWith(1)
    notify()
    // A frame already handed to the browser may still arrive after cleanup.
    pendingCallback(0)
    expect(frames.size).toBe(0)
    expect(resize).not.toHaveBeenCalled()
  })

  it('uses and removes a window resize listener when ResizeObserver is absent', () => {
    vi.stubGlobal('ResizeObserver', undefined)
    const resize = vi.fn()
    const cleanup = observeContainerWidth(container, resize)
    const schedule = addEventListener.mock.calls[0][1] as () => void
    expect(addEventListener).toHaveBeenCalledWith('resize', schedule)
    flushFrame()
    expect(resize).toHaveBeenCalledExactlyOnceWith(800)
    width = 450
    schedule()
    flushFrame()
    expect(resize).toHaveBeenLastCalledWith(450)
    cleanup()
    expect(removeEventListener).toHaveBeenCalledWith('resize', schedule)
    schedule()
    expect(frames.size).toBe(0)
  })
})
