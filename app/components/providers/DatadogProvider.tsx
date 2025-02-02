import { datadogRum } from '@datadog/browser-rum'

const initDatadog = () => {
  if (typeof window === 'undefined') return

  datadogRum.init({
    applicationId: '96c0b8c8-03c7-4a12-93df-102730a4493e',
    clientToken: 'pub58195f295af90ffce1b77c4a4e356e67',
    site: 'us5.datadoghq.com',
    service: 'saddlebag-exchange',
    env: process.env.NODE_ENV,
    sessionSampleRate: 100,
    sessionReplaySampleRate: 100,
    trackUserInteractions: true,
    trackResources: true,
    trackLongTasks: true,
    defaultPrivacyLevel: 'mask-user-input'
  })

  // Optional: Log debug info in development
  if (process.env.NODE_ENV === 'development') {
    datadogRum.setDebug(true)
  }
}

export function DatadogProvider({ children }: { children: React.ReactNode }) {
  if (typeof window !== 'undefined') {
    initDatadog()
  }
  
  return <>{children}</>
} 