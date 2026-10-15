import { datadogRum } from '@datadog/browser-rum'
import { useEffect } from 'react'
import { createResizeObserverBeforeSend } from '~/utils/monitoring/resizeObserverReporting'

/** Initialize RUM once per page, preserving warning samples across remounts. */
export const initDatadog = () => {
  if (typeof window === 'undefined' || datadogRum.getInitConfiguration()) return

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
    defaultPrivacyLevel: 'allow',
    version: '1.0.1',
    beforeSend: createResizeObserverBeforeSend()
  })
}

/** Start browser monitoring after mount while rendering children unchanged. */
export function DatadogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initDatadog()
  }, [])

  return <>{children}</>
}
