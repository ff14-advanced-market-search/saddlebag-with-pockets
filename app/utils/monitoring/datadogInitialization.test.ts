import type { datadogRum } from '@datadog/browser-rum'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { initDatadog } from '~/components/providers/DatadogProvider'

const rum = vi.hoisted(() => ({
  getInitConfiguration: vi.fn<typeof datadogRum.getInitConfiguration>(),
  init: vi.fn<typeof datadogRum.init>()
}))

vi.mock('@datadog/browser-rum', () => ({ datadogRum: rum }))
vi.mock('~/.generated/datadog-build.json', () => ({
  default: {
    service: 'saddlebag-exchange',
    env: 'preview',
    version: '1234567890abcdef1234567890abcdef12345678'
  }
}))

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
    expect(rum.init.mock.calls[0][0]).toMatchObject({
      service: 'saddlebag-exchange',
      env: 'preview',
      version: '1234567890abcdef1234567890abcdef12345678',
      sessionSampleRate: 100,
      sessionReplaySampleRate: 100,
      trackUserInteractions: true,
      trackResources: true,
      trackLongTasks: true,
      defaultPrivacyLevel: 'allow'
    })
    expect(rum.getInitConfiguration()).toBe(rum.init.mock.calls[0][0])
  })
})
