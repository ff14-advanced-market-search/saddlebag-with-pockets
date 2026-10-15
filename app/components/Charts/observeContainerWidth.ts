/**
 * Resize charts from a stable outer container. Observe first, then measure and
 * write on the next frame so chart layout cannot recurse in a resize callback.
 */
export function observeContainerWidth(
  container: HTMLElement,
  onWidthChange: (width: number) => void
) {
  let frame: number | undefined
  let lastWidth: number | undefined
  let disposed = false

  const updateWidth = () => {
    frame = undefined
    if (disposed) return

    // clientWidth is an integer: subpixel jitter and height-only changes should
    // not trigger another chart layout. Hidden containers are measured on reveal.
    const width = container.clientWidth
    if (width <= 0 || width === lastWidth) return

    lastWidth = width
    onWidthChange(width)
  }

  const scheduleUpdate = () => {
    if (!disposed && frame === undefined) {
      frame = window.requestAnimationFrame(updateWidth)
    }
  }

  const observer =
    typeof ResizeObserver === 'function'
      ? new ResizeObserver(scheduleUpdate)
      : undefined

  if (observer) {
    observer.observe(container)
  } else {
    window.addEventListener('resize', scheduleUpdate)
  }
  scheduleUpdate()

  return () => {
    disposed = true
    observer?.disconnect()
    if (!observer) window.removeEventListener('resize', scheduleUpdate)
    if (frame !== undefined) window.cancelAnimationFrame(frame)
  }
}
