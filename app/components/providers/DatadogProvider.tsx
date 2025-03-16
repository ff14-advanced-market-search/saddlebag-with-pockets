import { datadogRum } from '@datadog/browser-rum'
import { useEffect } from 'react'

/**
 * Initializes the Datadog RUM for monitoring user interactions if not in a server environment
 * @example
 * functionName()
 * undefined
 * @returns {void} No return value.
 * @description
 *   - The function configures Datadog RUM with specific identifiers and sampling rates for a production environment.
 *   - It only executes in a browser environment, as checked by the window object.
 *   - Data collection settings include tracking user interactions, resources, and long tasks.
 *   - User input privacy is set to mask user input by default.
 */
const initDatadog = () => {
  if (typeof window === 'undefined') return

  datadogRum.init({
    applicationId: '96c0b8c8-03c7-4a12-93df-102730a4493e',
    clientToken: 'pub58195f295af90ffce1b77c4a4e356e67',
    site: 'us5.datadoghq.com',
    service: 'saddlebag-exchange',
    env: 'production',
    sessionSampleRate: 100,
    sessionReplaySampleRate: 100,
    trackUserInteractions: true,
    trackResources: true,
    trackLongTasks: true,
    defaultPrivacyLevel: 'mask-user-input'
  })
}

export function DatadogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initDatadog()
  }, [])

  return <>{children}</>
}
