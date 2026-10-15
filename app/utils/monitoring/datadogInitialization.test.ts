import type { RumInitConfiguration } from '@datadog/browser-rum'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { initDatadog } from '~/components/providers/DatadogProvider'

const rum = vi.hoisted(() => ({
  getInitConfiguration: vi.fn<() => RumInitConfiguration | undefined>(),
  init: vi.fn<(configuration: RumInitConfiguration) => void>()
}))

vi.mock('@datadog/browser-rum', () => ({ datadogRum: rum }))

beforeEach(() => {
  rum.getInitConfiguration.mockReset()
  rum.init.mockReset()
  rum.init.mockImplementation((configuration) => {
    rum.getInitConfiguration.mockReturnValue(configuration)
  })
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('Datadog initialization', () => {
  it('does not initialize during server rendering', () => {
    initDatadog()
    expect(rum.init).not.toHaveBeenCalled()
  })

  it('initializes once across remounts and preserves the warning sample state', () => {
    vi.stubGlobal('window', {})
    initDatadog()
    initDatadog()
    expect(rum.init).toHaveBeenCalledTimes(1)
    expect(rum.init.mock.calls[0][0].beforeSend).toBeTypeOf('function')
    expect(rum.getInitConfiguration()).toBe(rum.init.mock.calls[0][0])
  })
})
