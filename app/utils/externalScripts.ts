const GOOGLE_TAG_MANAGER_URL =
  'https://www.googletagmanager.com/gtm.js?id=GTM-WH4KFG5'
const NEXT_MILLENNIUM_URL = 'https://powerad.ai/261066107350250/script.js'

type AnalyticsWindow = Window & { dataLayer?: unknown[] }

const hasScript = (source: string) =>
  Array.from(document.scripts).some((script) => script.src === source)

const appendScript = (source: string, id: string) => {
  const script = document.createElement('script')
  script.id = id
  script.async = true
  script.src = source
  document.body.appendChild(script)
}

const loadExternalScripts = () => {
  // These scripts own page-wide state and must survive React remounts. Reuse
  // existing elements instead of starting another analytics or ad instance.
  if (!hasScript(GOOGLE_TAG_MANAGER_URL)) {
    const analyticsWindow = window as AnalyticsWindow
    const dataLayer = (analyticsWindow.dataLayer ||= [])
    const hasStarted = dataLayer.some(
      (event) =>
        event !== null &&
        typeof event === 'object' &&
        'event' in event &&
        event.event === 'gtm.js'
    )

    if (!hasStarted) {
      dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' })
    }

    appendScript(GOOGLE_TAG_MANAGER_URL, 'saddlebag-google-tag-manager')
  }

  if (!hasScript(NEXT_MILLENNIUM_URL)) {
    appendScript(NEXT_MILLENNIUM_URL, 'saddlebag-next-millennium')
  }
}

export const scheduleExternalScripts = () => {
  let active = true
  let animationFrame: number | undefined
  const timer = window.setTimeout(() => {
    if (!active) return

    animationFrame = window.requestAnimationFrame(() => {
      animationFrame = undefined
      if (active) loadExternalScripts()
    })
  }, 3000)

  return () => {
    active = false
    window.clearTimeout(timer)
    if (animationFrame !== undefined) {
      window.cancelAnimationFrame(animationFrame)
    }
  }
}
