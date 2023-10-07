export const handleCopyButton = async (
  e: React.MouseEvent<HTMLButtonElement>
) => {
  e.preventDefault()
  if (!window || !document) {
    return
  }

  if (!window.isSecureContext) {
    alert('Failed to copy address to clipboard.')
    return
  }

  await navigator.clipboard.writeText(document.URL)

  alert('Address copied to clipboard')
}

export const handleSearchParamChange = (
  paramName: string,
  newValue: string | undefined
) => {
  if (!document || !window) return
  const url = new window.URL(document.URL)

  if (newValue) {
    url.searchParams.set(paramName, newValue)
  }

  window.history.replaceState({}, '', url.toString())
}

export const getActionUrl = (pageUrl: string, params: Record<string, any>) => {
  const paramString = Object.entries(params)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join('&')

  return `${pageUrl}?${paramString}`
}
